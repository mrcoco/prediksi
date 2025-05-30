import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_graphviz
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sqlalchemy.orm import Session
import pydotplus
import graphviz
import os
import json
from io import StringIO

# Import model database
from database import Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi

class C45Model:
    def __init__(self):
        self.model = DecisionTreeClassifier(criterion='entropy')
        self.features = ['rata_rata', 'kategori_penghasilan', 'kategori_kehadiran']
        self.target = 'prediksi_prestasi'
        self.trained = False
        self.tree_visualization = None
    
    def prepare_data(self, db: Session):
        """Menyiapkan data dari database untuk pelatihan model"""
        # Mengambil data siswa beserta nilai, presensi, dan penghasilan
        siswa_data = db.query(Siswa).all()
        
        data_list = []
        for siswa in siswa_data:
            # Ambil data nilai raport terbaru
            nilai = db.query(NilaiRaport).filter(NilaiRaport.siswa_id == siswa.id).order_by(NilaiRaport.updated_at.desc()).first()
            # Ambil data presensi terbaru
            presensi = db.query(Presensi).filter(Presensi.siswa_id == siswa.id).order_by(Presensi.updated_at.desc()).first()
            # Ambil data penghasilan terbaru
            penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.siswa_id == siswa.id).order_by(PenghasilanOrtu.updated_at.desc()).first()
            # Ambil data prestasi terbaru (jika ada)
            prestasi = db.query(Prestasi).filter(Prestasi.siswa_id == siswa.id).order_by(Prestasi.updated_at.desc()).first()
            
            # Pastikan semua data tersedia
            if nilai and presensi and penghasilan:
                data_entry = {
                    'siswa_id': siswa.id,
                    'nama': siswa.nama,
                    'rata_rata': nilai.rata_rata,
                    'kategori_penghasilan': penghasilan.kategori_penghasilan,
                    'kategori_kehadiran': presensi.kategori_kehadiran,
                    'prediksi_prestasi': prestasi.prediksi_prestasi if prestasi else self.generate_label(nilai.rata_rata, penghasilan.kategori_penghasilan, presensi.kategori_kehadiran)
                }
                data_list.append(data_entry)
        
        # Buat DataFrame
        df = pd.DataFrame(data_list)
        
        # Filter data yang sudah memiliki label prestasi
        df_labeled = df[df['prediksi_prestasi'].notna()]
        
        return df, df_labeled
    
    def train(self, db: Session):
        """Melatih model C4.5 dengan data dari database"""
        _, df_labeled = self.prepare_data(db)
        
        # Jika data berlabel kurang dari 10, tidak bisa melatih model
        if len(df_labeled) < 10:
            raise ValueError("Data berlabel tidak cukup untuk melatih model (minimal 10 data)")
        
        # Siapkan fitur dan target
        # Convert categorical variables to numerical
        df_labeled['kategori_penghasilan'] = df_labeled['kategori_penghasilan'].map({'Rendah': 0, 'Menengah': 1, 'Tinggi': 2})
        df_labeled['kategori_kehadiran'] = df_labeled['kategori_kehadiran'].map({'Rendah': 0, 'Sedang': 1, 'Tinggi': 2})
        
        X = df_labeled[self.features]
        y = df_labeled[self.target]
        
        # Bagi data menjadi training dan testing
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Latih model
        self.model.fit(X_train, y_train)
        
        # Evaluasi model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # Buat visualisasi pohon keputusan
        dot_data = StringIO()
        export_graphviz(self.model, out_file=dot_data, feature_names=self.features,
                        class_names=['Rendah', 'Sedang', 'Tinggi'], filled=True, rounded=True,
                        special_characters=True)
        graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
        self.tree_visualization = graph
        
        # Simpan visualisasi ke file
        if not os.path.exists('static'):
            os.makedirs('static')
        graph.write_png('static/decision_tree.png')
        
        self.trained = True
        
        return {
            'accuracy': accuracy,
            'report': report,
            'samples': len(df_labeled)
        }
    
    def predict(self, data):
        """Melakukan prediksi dengan model yang sudah dilatih"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        # Pastikan data memiliki semua fitur yang diperlukan
        for feature in self.features:
            if feature not in data:
                raise ValueError(f"Data tidak memiliki fitur {feature}")
        
        # Konversi nilai kategori ke format numerik
        data_copy = data.copy()
        if 'kategori_penghasilan' in data_copy:
            data_copy['kategori_penghasilan'] = {'Rendah': 0, 'Menengah': 1, 'Tinggi': 2}.get(data_copy['kategori_penghasilan'], 0)
        if 'kategori_kehadiran' in data_copy:
            data_copy['kategori_kehadiran'] = {'Rendah': 0, 'Sedang': 1, 'Tinggi': 2}.get(data_copy['kategori_kehadiran'], 0)
        
        # Siapkan data untuk prediksi
        X_pred = pd.DataFrame([data_copy])[self.features]
        
        # Lakukan prediksi
        prediction = self.model.predict(X_pred)[0]
        
        # Hitung confidence (probabilitas kelas yang diprediksi)
        probabilities = self.model.predict_proba(X_pred)[0]
        confidence = max(probabilities)
        
        # Dapatkan faktor-faktor yang mempengaruhi prediksi
        feature_importances = dict(zip(self.features, self.model.feature_importances_))
        
        return {
            'prediksi': prediction,
            'confidence': confidence,
            'feature_importances': feature_importances
        }
    
    def get_rules(self):
        """Mendapatkan aturan-aturan dari pohon keputusan"""
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        # Implementasi ekstraksi aturan dari pohon keputusan
        # (Ini adalah implementasi sederhana, bisa dikembangkan lebih lanjut)
        tree = self.model.tree_
        feature_names = self.features
        class_names = ['Rendah', 'Sedang', 'Tinggi']
        
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
        
    def visualize(self):
        """Generate visualization of decision tree and return as base64"""
        if not self.trained:
            raise ValueError("Model must be trained first")
            
        if not self.tree_visualization:
            raise ValueError("No tree visualization available")
            
        # Generate PNG data in memory
        import io
        import base64
        
        png_data = io.BytesIO()
        self.tree_visualization.write_png(png_data)
        png_data.seek(0)
        
        # Convert to base64
        base64_image = base64.b64encode(png_data.read()).decode('utf-8')
        
        return f"data:image/png;base64,{base64_image}"

# Inisialisasi model global
c45_model = C45Model()