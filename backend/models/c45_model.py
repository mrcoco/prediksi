import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_graphviz
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_score, recall_score, f1_score
from sqlalchemy.orm import Session
import pydotplus
import graphviz
import os
import json
from io import StringIO, BytesIO
import logging
import base64

# Import model database
from database import Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi

logger = logging.getLogger(__name__)

class C45Model:
    def __init__(self):
        self.model = DecisionTreeClassifier(criterion='entropy')
        self.features = ['rata_rata', 'kategori_penghasilan', 'kategori_kehadiran']
        self.target = 'prediksi_prestasi'
        self.trained = False
        self.tree_visualization = None
        self.confusion_matrix = None
        self.model_metrics = None
        self.class_labels = ['Rendah', 'Sedang', 'Tinggi']
        self.last_trained = None
        
        # Mapping untuk konversi kategori
        self.penghasilan_map = {'Rendah': 0, 'Menengah': 1, 'Tinggi': 2}
        self.kehadiran_map = {'Rendah': 0, 'Sedang': 1, 'Tinggi': 2}
    
    def prepare_data(self, db: Session):
        """Menyiapkan data untuk training dan prediksi"""
        try:
            # Query semua data siswa (berlabel dan tidak berlabel)
            all_data = db.query(
                Siswa.id.label('siswa_id'),
                NilaiRaport.rata_rata,
                PenghasilanOrtu.kategori_penghasilan,
                Presensi.kategori_kehadiran
            ).join(NilaiRaport).join(PenghasilanOrtu).join(Presensi).all()
            
            if not all_data:
                raise ValueError("Tidak ada data yang ditemukan")
            
            # Convert ke DataFrame untuk semua data
            df = pd.DataFrame([{
                'siswa_id': row.siswa_id,
                'rata_rata': row.rata_rata,
                'kategori_penghasilan': row.kategori_penghasilan,
                'kategori_kehadiran': row.kategori_kehadiran
            } for row in all_data])
            
            # Query data siswa yang sudah memiliki label prestasi
            labeled_data = db.query(
                Siswa.id.label('siswa_id'),
                NilaiRaport.rata_rata,
                PenghasilanOrtu.kategori_penghasilan,
                Presensi.kategori_kehadiran,
                Prestasi.prediksi_prestasi
            ).join(NilaiRaport).join(PenghasilanOrtu).join(Presensi).join(
                Prestasi,
                (Prestasi.siswa_id == Siswa.id) &
                (Prestasi.semester == NilaiRaport.semester) &
                (Prestasi.tahun_ajaran == NilaiRaport.tahun_ajaran)
            ).filter(
                Prestasi.prediksi_prestasi.isnot(None)
            ).all()

            
            
            # Convert ke DataFrame untuk data berlabel
            df_labeled = pd.DataFrame([{
                'siswa_id': row.siswa_id,
                'rata_rata': row.rata_rata,
                'kategori_penghasilan': row.kategori_penghasilan,
                'kategori_kehadiran': row.kategori_kehadiran,
                'prediksi_prestasi': row.prediksi_prestasi
            } for row in labeled_data]) if labeled_data else pd.DataFrame(columns=[
                'siswa_id', 'rata_rata', 'kategori_penghasilan', 
                'kategori_kehadiran', 'prediksi_prestasi'
            ])
            
            logger.info(f"Berhasil mempersiapkan {len(df)} data total dan {len(df_labeled)} data berlabel")
            return df, df_labeled
            
        except Exception as e:
            logger.error(f"Error preparing data: {str(e)}")
            raise ValueError(f"Gagal mempersiapkan data: {str(e)}")
    
    def train(self, db: Session):
        """Melatih model C4.5 dengan data dari database"""
        print("Training model...")
        print("Preparing data...")
        print(self.prepare_data(db))
        try:
            logger.info("Starting model training...")
            _, df_labeled = self.prepare_data(db)
            print(df_labeled)
            # Jika data berlabel kurang dari 10, tidak bisa melatih model
            if len(df_labeled) < 10:
                raise ValueError("Data berlabel tidak cukup untuk melatih model (minimal 10 data)")
            
            logger.info(f"Training with {len(df_labeled)} labeled samples")
            
            # Siapkan fitur dan target
            # Convert categorical variables to numerical
            df_labeled['kategori_penghasilan'] = df_labeled['kategori_penghasilan'].map(self.penghasilan_map)
            df_labeled['kategori_kehadiran'] = df_labeled['kategori_kehadiran'].map(self.kehadiran_map)
            
            # Handle missing values
            if df_labeled[self.features].isnull().any().any():
                raise ValueError("Data memiliki nilai yang hilang (null)")
            
            X = df_labeled[self.features]
            y = df_labeled[self.target]
            
            # Bagi data menjadi training dan testing
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            logger.info("Training model...")
            
            # Reset model state
            self.model = DecisionTreeClassifier(criterion='entropy')
            
            # Latih model
            self.model.fit(X_train, y_train)
            
            # Evaluasi model
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            report = classification_report(y_test, y_pred, output_dict=True)
            
            # Hitung confusion matrix dan metrics
            cm = confusion_matrix(y_test, y_pred, labels=self.class_labels)
            precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
            recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
            f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
            
            # Simpan confusion matrix dan metrics
            self.confusion_matrix = cm.tolist()
            self.model_metrics = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'class_report': report
            }
            self.last_trained = pd.Timestamp.now().isoformat()
            self.trained = True
            
            logger.info(f"Model training completed. Accuracy: {accuracy:.2f}")
            
            return {
                'status': 'success',
                'message': 'Model berhasil dilatih',
                'metrics': self.model_metrics
            }
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            self.trained = False
            raise ValueError(f"Gagal melatih model: {str(e)}")
    
    def predict(self, data):
        """Melakukan prediksi dengan model yang sudah dilatih"""
        try:
            if not self.trained:
                raise ValueError("Model belum dilatih")
            
            # Pastikan data memiliki semua fitur yang diperlukan
            missing_features = [f for f in self.features if f not in data]
            if missing_features:
                raise ValueError(f"Data tidak memiliki fitur: {', '.join(missing_features)}")
            
            # Konversi nilai kategori ke format numerik
            data_copy = data.copy()
            
            # Konversi kategori penghasilan
            if data_copy['kategori_penghasilan'] not in self.penghasilan_map:
                raise ValueError(f"Kategori penghasilan tidak valid: {data_copy['kategori_penghasilan']}")
            data_copy['kategori_penghasilan'] = self.penghasilan_map[data_copy['kategori_penghasilan']]
            
            # Konversi kategori kehadiran
            if data_copy['kategori_kehadiran'] not in self.kehadiran_map:
                raise ValueError(f"Kategori kehadiran tidak valid: {data_copy['kategori_kehadiran']}")
            data_copy['kategori_kehadiran'] = self.kehadiran_map[data_copy['kategori_kehadiran']]
            
            # Validasi nilai rata-rata
            if not isinstance(data_copy['rata_rata'], (int, float)):
                raise ValueError("Nilai rata-rata harus berupa angka")
            if data_copy['rata_rata'] < 0 or data_copy['rata_rata'] > 100:
                raise ValueError("Nilai rata-rata harus antara 0 dan 100")
            
            # Siapkan data untuk prediksi
            X_pred = pd.DataFrame([data_copy])[self.features]
            
            # Lakukan prediksi
            prediction = self.model.predict(X_pred)[0]
            
            # Hitung confidence (probabilitas kelas yang diprediksi)
            probabilities = self.model.predict_proba(X_pred)[0]
            confidence = max(probabilities)
            
            # Dapatkan faktor-faktor yang mempengaruhi prediksi
            feature_importances = dict(zip(self.features, self.model.feature_importances_))
            
            logger.info(f"Prediction: {prediction}, Confidence: {confidence:.2f}")
            
            return {
                'prediksi': prediction,
                'confidence': confidence,
                'feature_importances': feature_importances,
                'probabilities': dict(zip(self.class_labels, probabilities.tolist()))
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            raise ValueError(f"Gagal melakukan prediksi: {str(e)}")
    
    def get_rules(self):
        """Mendapatkan aturan-aturan dari pohon keputusan"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        # Implementasi ekstraksi aturan dari pohon keputusan
        # (Ini adalah implementasi sederhana, bisa dikembangkan lebih lanjut)
        tree = self.model.tree_
        feature_names = self.features
        class_names = self.class_labels
        
        rules = []
        
        def recurse(node, depth, parent, rule):
            if tree.feature[node] != -2:  # Bukan leaf node
                name = feature_names[tree.feature[node]]
                threshold = tree.threshold[node]
                
                # Aturan untuk cabang kiri (<=)
                left_rule = rule.copy()
                left_rule.append(f"{name} <= {threshold:.2f}")
                recurse(tree.children_left[node], depth + 1, node, left_rule)
                
                # Aturan untuk cabang kanan (>)
                right_rule = rule.copy()
                right_rule.append(f"{name} > {threshold:.2f}")
                recurse(tree.children_right[node], depth + 1, node, right_rule)
            else:  # Leaf node
                class_idx = np.argmax(tree.value[node][0])
                class_name = class_names[class_idx]
                rules.append({
                    'conditions': rule,
                    'class': class_name,
                    'samples': int(np.sum(tree.value[node])),
                    'probability': float(np.max(tree.value[node]) / np.sum(tree.value[node]))
                })
        
        recurse(0, 1, -1, [])
        
        return rules
    
    def generate_label(self, rata_rata, kategori_penghasilan, kategori_kehadiran):
        """Membuat label prediksi_prestasi berdasarkan kriteria tertentu"""
        # Kriteria untuk menentukan prestasi
        if rata_rata >= 85 and kategori_penghasilan == 'Tinggi' and kategori_kehadiran == 'Tinggi':
            return 'Tinggi'
        elif rata_rata >= 75 and kategori_kehadiran == 'Tinggi':
            return 'Sedang'
        else:
            return 'Rendah'
            
    def get_visualization(self):
        """Mendapatkan visualisasi pohon keputusan"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        return self.tree_visualization
    
    def get_confusion_matrix(self):
        """Mendapatkan confusion matrix dari model yang sudah dilatih"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        if self.confusion_matrix is None:
            raise ValueError("Confusion matrix tidak tersedia")
        
        return {
            'matrix': self.confusion_matrix,
            'labels': self.class_labels
        }
    
    def get_model_metrics(self):
        """Mendapatkan metrik evaluasi model"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        if self.model_metrics is None:
            raise ValueError("Model metrics tidak tersedia")
        
        return {
            'metrics': self.model_metrics,
            'last_trained': self.last_trained
        }
    
    def visualize(self):
        """Membuat visualisasi pohon keputusan dalam format base64"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        if not hasattr(self, 'model') or not hasattr(self, 'features'):
            raise ValueError("Model atau features tidak tersedia")
            
        try:
            # Buat file DOT sementara
            dot_data = StringIO()
            export_graphviz(
                self.model,
                out_file=dot_data,
                feature_names=self.features,
                class_names=self.class_labels,
                filled=True,
                rounded=True,
                special_characters=True,
                proportion=True
            )
            
            # Convert DOT ke PNG menggunakan pydotplus
            graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
            
            # Handle jika graph adalah list
            if isinstance(graph, list):
                if len(graph) > 0:
                    graph = graph[0]
                else:
                    raise ValueError("Gagal membuat visualisasi: graph kosong")
            
            # Validasi graph memiliki method write_png
            if not hasattr(graph, 'write_png'):
                raise ValueError("Gagal membuat visualisasi: graph tidak valid")
                
            # Convert ke PNG dalam memory
            png_data = BytesIO()
            graph.write_png(png_data)
            png_data.seek(0)
            
            # Convert PNG ke base64
            base64_encoded = base64.b64encode(png_data.read()).decode('utf-8')
            return base64_encoded
            
        except Exception as e:
            logger.error(f"Error saat membuat visualisasi: {str(e)}")
            raise ValueError(f"Gagal membuat visualisasi: {str(e)}")

# Inisialisasi model global
c45_model = C45Model()