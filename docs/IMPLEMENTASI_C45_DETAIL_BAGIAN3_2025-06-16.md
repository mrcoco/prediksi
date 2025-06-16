# 🎓 Implementasi Detail Algoritma C4.5 - Bagian 3: Training & Implementasi EduPro

## 🚀 **6. TRAINING MODEL DALAM EDUPRO**

### **6.1 ML Service Layer**

```python
# backend/ml/ml_service.py
from sqlalchemy.orm import Session
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
import pickle
import os
from datetime import datetime
import logging

from .data_extraction import DataExtractor
from .feature_engineering import FeatureEngineer
from .c45_algorithm import C45DecisionTree
from .evaluation import ModelEvaluator
from .visualization import TreeVisualizer

logger = logging.getLogger(__name__)

class MLService:
    """Service layer untuk machine learning dalam EduPro"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.data_extractor = DataExtractor(db_session)
        self.feature_engineer = FeatureEngineer()
        self.model_evaluator = ModelEvaluator()
        self.tree_visualizer = TreeVisualizer()
        
        # Model storage
        self.model_path = "models/c45_model.pkl"
        self.model_info_path = "models/model_info.json"
        self.current_model = None
        self.model_info = {}
        
        # Ensure models directory exists
        os.makedirs("models", exist_ok=True)
    
    def train_model(self) -> Dict[str, Any]:
        """Train C4.5 model dengan data terbaru dari database"""
        try:
            logger.info("Starting model training...")
            
            # 1. Extract data from database
            raw_data = self.data_extractor.extract_complete_dataset()
            
            if len(raw_data) < 10:
                raise ValueError("Insufficient data for training. Need at least 10 samples.")
            
            logger.info(f"Extracted {len(raw_data)} samples from database")
            
            # 2. Preprocess features
            X, y = self.feature_engineer.preprocess_features(raw_data)
            
            if len(X) < 5:
                raise ValueError("Insufficient valid data after preprocessing")
            
            # 3. Split data for training and validation
            from sklearn.model_selection import train_test_split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            logger.info(f"Training set: {len(X_train)} samples")
            logger.info(f"Test set: {len(X_test)} samples")
            
            # 4. Train C4.5 model
            model = C45DecisionTree(
                min_samples_split=max(2, len(X_train) // 20),
                max_depth=10
            )
            
            model.fit(X_train, y_train)
            
            # 5. Evaluate model
            y_pred_train = model.predict(X_train)
            y_pred_test = model.predict(X_test)
            
            train_metrics = self.model_evaluator.calculate_metrics(y_train.tolist(), y_pred_train)
            test_metrics = self.model_evaluator.calculate_metrics(y_test.tolist(), y_pred_test)
            
            confusion_matrix = self.model_evaluator.calculate_confusion_matrix(
                y_test.tolist(), y_pred_test
            )
            
            # 6. Save model
            self._save_model(model, {
                'training_date': datetime.now().isoformat(),
                'training_samples': len(X_train),
                'test_samples': len(X_test),
                'features': list(X.columns),
                'target_classes': list(y.unique()),
                'train_metrics': train_metrics,
                'test_metrics': test_metrics,
                'confusion_matrix': confusion_matrix
            })
            
            # 7. Generate visualization
            visualization_path = self.tree_visualizer.create_tree_visualization(
                model, feature_names=list(X.columns)
            )
            
            logger.info("Model training completed successfully")
            
            return {
                'status': 'success',
                'message': 'Model berhasil dilatih',
                'data': {
                    'training_samples': len(X_train),
                    'test_samples': len(X_test),
                    'accuracy': test_metrics['accuracy'],
                    'precision': test_metrics['precision'],
                    'recall': test_metrics['recall'],
                    'f1_score': test_metrics['f1_score'],
                    'confusion_matrix': confusion_matrix,
                    'visualization_path': visualization_path,
                    'training_date': datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            logger.error(f"Error during model training: {str(e)}")
            return {
                'status': 'error',
                'message': f'Gagal melatih model: {str(e)}',
                'data': None
            }
    
    def predict_prestasi(self, siswa_id: int, semester: str, tahun_ajaran: str) -> Dict[str, Any]:
        """Prediksi prestasi siswa menggunakan model C4.5"""
        try:
            # Load model if not already loaded
            if self.current_model is None:
                self._load_model()
            
            if self.current_model is None:
                raise ValueError("Model belum dilatih. Silakan latih model terlebih dahulu.")
            
            # Extract siswa data
            siswa_data = self.data_extractor.extract_siswa_data(
                siswa_id, semester, tahun_ajaran
            )
            
            if not siswa_data['rata_rata_nilai']:
                raise ValueError("Data nilai siswa tidak ditemukan untuk semester dan tahun ajaran yang dipilih")
            
            if not siswa_data['persentase_kehadiran']:
                raise ValueError("Data presensi siswa tidak ditemukan untuk semester dan tahun ajaran yang dipilih")
            
            if not siswa_data['kategori_penghasilan']:
                raise ValueError("Data penghasilan orang tua siswa tidak ditemukan")
            
            # Prepare input for prediction
            input_features = self.feature_engineer.prepare_prediction_input(siswa_data)
            
            # Ensure all required columns are present
            model_features = self.model_info.get('features', [])
            for feature in model_features:
                if feature not in input_features.columns:
                    input_features[feature] = 0
            
            # Reorder columns to match training data
            input_features = input_features.reindex(columns=model_features, fill_value=0)
            
            # Make prediction
            prediction = self.current_model.predict(input_features)[0]
            probabilities = self.current_model.predict_proba(input_features)[0]
            
            # Get confidence (probability of predicted class)
            confidence = probabilities.get(prediction, 0.0)
            
            # Save prediction to database
            self._save_prediction_history(
                siswa_id, semester, tahun_ajaran, prediction, confidence, siswa_data
            )
            
            return {
                'status': 'success',
                'siswa_id': siswa_id,
                'nama_siswa': siswa_data['nama_siswa'],
                'semester': semester,
                'tahun_ajaran': tahun_ajaran,
                'prediksi_prestasi': prediction,
                'confidence': confidence,
                'probabilities': probabilities,
                'detail_faktor': {
                    'nilai_rata_rata': float(siswa_data['rata_rata_nilai']),
                    'persentase_kehadiran': float(siswa_data['persentase_kehadiran']),
                    'kategori_penghasilan': siswa_data['kategori_penghasilan'],
                    'kategori_nilai': self.feature_engineer.kategorisasi_nilai(
                        float(siswa_data['rata_rata_nilai'])
                    ),
                    'kategori_kehadiran': self.feature_engineer.kategorisasi_kehadiran(
                        float(siswa_data['persentase_kehadiran'])
                    )
                }
            }
            
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            return {
                'status': 'error',
                'message': f'Gagal melakukan prediksi: {str(e)}',
                'data': None
            }
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Mendapatkan informasi model yang sedang aktif
        
        Returns:
            Dict: Informasi model
        """
        try:
            if os.path.exists(self.model_info_path):
                import json
                with open(self.model_info_path, 'r') as f:
                    return json.load(f)
            else:
                return {'status': 'no_model', 'message': 'Model belum dilatih'}
        except Exception as e:
            logger.error(f"Error getting model info: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def get_confusion_matrix(self) -> Dict[str, Any]:
        """
        Mendapatkan confusion matrix dari model aktif
        
        Returns:
            Dict: Confusion matrix dan labels
        """
        model_info = self.get_model_info()
        
        if 'confusion_matrix' in model_info:
            return {
                'status': 'success',
                'confusion_matrix': model_info['confusion_matrix']['matrix'],
                'labels': model_info['confusion_matrix']['labels']
            }
        else:
            return {
                'status': 'error',
                'message': 'Confusion matrix tidak tersedia'
            }
    
    def get_model_metrics(self) -> Dict[str, Any]:
        """
        Mendapatkan metrik evaluasi model
        
        Returns:
            Dict: Metrik evaluasi
        """
        model_info = self.get_model_info()
        
        if 'test_metrics' in model_info:
            return {
                'status': 'success',
                'metrics': model_info['test_metrics'],
                'last_trained': model_info.get('training_date')
            }
        else:
            return {
                'status': 'error',
                'message': 'Metrik model tidak tersedia'
            }
    
    def _save_model(self, model: C45DecisionTree, info: Dict[str, Any]):
        """Save model and its information"""
        # Save model
        with open(self.model_path, 'wb') as f:
            pickle.dump(model, f)
        
        # Save model info
        import json
        with open(self.model_info_path, 'w') as f:
            json.dump(info, f, indent=2, default=str)
        
        self.current_model = model
        self.model_info = info
        
        logger.info(f"Model saved to {self.model_path}")
    
    def _load_model(self):
        """Load model from file"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.current_model = pickle.load(f)
                
                if os.path.exists(self.model_info_path):
                    import json
                    with open(self.model_info_path, 'r') as f:
                        self.model_info = json.load(f)
                
                logger.info("Model loaded successfully")
            else:
                logger.warning("No saved model found")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.current_model = None
            self.model_info = {}
    
    def _save_prediction_history(self, siswa_id: int, semester: str, tahun_ajaran: str, 
                                prediction: str, confidence: float, detail_faktor: Dict[str, Any]):
        """Save prediction to database history"""
        try:
            from sqlalchemy import text
            
            query = text("""
                INSERT INTO riwayat_prediksi 
                (siswa_id, semester, tahun_ajaran, prediksi_prestasi, confidence, detail_faktor, created_at)
                VALUES (:siswa_id, :semester, :tahun_ajaran, :prediksi_prestasi, :confidence, :detail_faktor, NOW())
            """)
            
            self.db.execute(query, {
                'siswa_id': siswa_id,
                'semester': semester,
                'tahun_ajaran': tahun_ajaran,
                'prediksi_prestasi': prediction,
                'confidence': confidence,
                'detail_faktor': json.dumps(detail_faktor, default=str)
            })
            
            self.db.commit()
            logger.info(f"Prediction history saved for siswa_id: {siswa_id}")
            
        except Exception as e:
            logger.error(f"Error saving prediction history: {str(e)}")
            self.db.rollback()
```

---

## 🎨 **7. VISUALISASI POHON KEPUTUSAN**

### **7.1 Tree Visualizer**

```python
# backend/ml/visualization.py
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np
from typing import Dict, List, Any, Tuple, Optional
import base64
import io
import os
from .c45_algorithm import C45DecisionTree, DecisionNode

class TreeVisualizer:
    """Class untuk visualisasi pohon keputusan C4.5"""
    
    def __init__(self):
        self.fig = None
        self.ax = None
        self.node_positions = {}
        self.colors = {
            'Tinggi': '#28a745',    # Green
            'Sedang': '#ffc107',    # Yellow
            'Rendah': '#dc3545',    # Red
            'node': '#e9ecef',      # Light gray
            'text': '#212529'       # Dark gray
        }
    
    def create_tree_visualization(self, model: C45DecisionTree, 
                                feature_names: List[str] = None,
                                save_path: str = "static/tree_visualization.png") -> str:
        """
        Membuat visualisasi pohon keputusan
        
        Args:
            model: Trained C4.5 model
            feature_names: List nama fitur
            save_path: Path untuk menyimpan gambar
            
        Returns:
            str: Path file gambar yang disimpan
        """
        if model.root is None:
            raise ValueError("Model belum dilatih")
        
        # Setup matplotlib
        plt.style.use('default')
        self.fig, self.ax = plt.subplots(1, 1, figsize=(16, 12))
        self.ax.set_xlim(0, 100)
        self.ax.set_ylim(0, 100)
        self.ax.axis('off')
        
        # Calculate node positions
        self._calculate_positions(model.root)
        
        # Draw tree
        self._draw_tree(model.root)
        
        # Add title
        self.ax.text(50, 95, 'Pohon Keputusan C4.5 - Prediksi Prestasi Siswa', 
                    ha='center', va='center', fontsize=16, fontweight='bold')
        
        # Add legend
        self._add_legend()
        
        # Save figure
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        plt.close()
        
        return save_path
    
    def create_tree_visualization_base64(self, model: C45DecisionTree, 
                                       feature_names: List[str] = None) -> str:
        """
        Membuat visualisasi pohon keputusan dalam format base64
        
        Returns:
            str: Base64 encoded image
        """
        if model.root is None:
            raise ValueError("Model belum dilatih")
        
        # Setup matplotlib
        plt.style.use('default')
        self.fig, self.ax = plt.subplots(1, 1, figsize=(16, 12))
        self.ax.set_xlim(0, 100)
        self.ax.set_ylim(0, 100)
        self.ax.axis('off')
        
        # Calculate node positions
        self._calculate_positions(model.root)
        
        # Draw tree
        self._draw_tree(model.root)
        
        # Add title
        self.ax.text(50, 95, 'Pohon Keputusan C4.5 - Prediksi Prestasi Siswa', 
                    ha='center', va='center', fontsize=16, fontweight='bold')
        
        # Add legend
        self._add_legend()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.tight_layout()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight',
                   facecolor='white', edgecolor='none')
        buffer.seek(0)
        
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()
        
        return image_base64
    
    def _calculate_positions(self, node: DecisionNode, x: float = 50, y: float = 85, 
                           level: int = 0, parent_x: float = None):
        """Calculate positions for all nodes"""
        if node is None:
            return
        
        # Store position
        self.node_positions[id(node)] = (x, y)
        
        if node.children:
            # Calculate positions for children
            num_children = len(node.children)
            if num_children == 1:
                child_x_positions = [x]
            else:
                # Distribute children horizontally
                width = min(80, 20 * num_children)
                start_x = x - width / 2
                child_x_positions = [start_x + i * (width / (num_children - 1)) 
                                   for i in range(num_children)]
            
            child_y = y - 15
            
            for i, (value, child) in enumerate(node.children.items()):
                child_x = child_x_positions[i]
                self._calculate_positions(child, child_x, child_y, level + 1, x)
    
    def _draw_tree(self, node: DecisionNode, parent_pos: Tuple[float, float] = None):
        """Draw the complete tree"""
        if node is None:
            return
        
        node_pos = self.node_positions[id(node)]
        
        # Draw connection to parent
        if parent_pos:
            self.ax.plot([parent_pos[0], node_pos[0]], [parent_pos[1], node_pos[1]], 
                        'k-', linewidth=1.5, alpha=0.7)
        
        # Draw node
        self._draw_node(node, node_pos)
        
        # Draw children
        if node.children:
            for value, child in node.children.items():
                child_pos = self.node_positions[id(child)]
                
                # Draw edge label
                mid_x = (node_pos[0] + child_pos[0]) / 2
                mid_y = (node_pos[1] + child_pos[1]) / 2
                self.ax.text(mid_x, mid_y, value, ha='center', va='center',
                           bbox=dict(boxstyle="round,pad=0.2", facecolor='white', 
                                   edgecolor='gray', alpha=0.8),
                           fontsize=8, fontweight='bold')
                
                self._draw_tree(child, node_pos)
    
    def _draw_node(self, node: DecisionNode, pos: Tuple[float, float]):
        """Draw a single node"""
        x, y = pos
        
        if node.is_leaf:
            # Leaf node - show prediction
            color = self.colors.get(node.prediction, self.colors['node'])
            
            # Draw circle for leaf
            circle = plt.Circle((x, y), 3, facecolor=color, edgecolor='black', 
                              linewidth=2, alpha=0.8)
            self.ax.add_patch(circle)
            
            # Add prediction text
            self.ax.text(x, y, node.prediction, ha='center', va='center',
                        fontsize=10, fontweight='bold', color='white')
            
            # Add sample count below
            self.ax.text(x, y-5, f'n={node.samples}', ha='center', va='center',
                        fontsize=8, style='italic')
        else:
            # Internal node - show attribute
            # Draw rectangle for internal node
            rect = FancyBboxPatch((x-4, y-2), 8, 4, 
                                boxstyle="round,pad=0.3",
                                facecolor=self.colors['node'], 
                                edgecolor='black', linewidth=1.5)
            self.ax.add_patch(rect)
            
            # Add attribute text
            attr_text = node.attribute.replace('kategori_', '').replace('_', ' ').title()
            self.ax.text(x, y, attr_text, ha='center', va='center',
                        fontsize=9, fontweight='bold', color=self.colors['text'])
            
            # Add sample count below
            self.ax.text(x, y-6, f'n={node.samples}', ha='center', va='center',
                        fontsize=8, style='italic')
    
    def _add_legend(self):
        """Add legend to the visualization"""
        legend_elements = [
            plt.Circle((0, 0), 1, facecolor=self.colors['Tinggi'], 
                      edgecolor='black', label='Prestasi Tinggi'),
            plt.Circle((0, 0), 1, facecolor=self.colors['Sedang'], 
                      edgecolor='black', label='Prestasi Sedang'),
            plt.Circle((0, 0), 1, facecolor=self.colors['Rendah'], 
                      edgecolor='black', label='Prestasi Rendah'),
            patches.Rectangle((0, 0), 1, 1, facecolor=self.colors['node'], 
                            edgecolor='black', label='Node Keputusan')
        ]
        
        self.ax.legend(handles=legend_elements, loc='upper right', 
                      bbox_to_anchor=(0.98, 0.98), fontsize=10)
```

---

## 🔌 **8. INTEGRASI DENGAN FASTAPI**

### **8.1 API Endpoints**

```python
# backend/routers/prediksi.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, List, Any
import logging

from ..database import get_db
from ..ml.ml_service import MLService
from ..models.auth import get_current_user
from ..schemas.prediksi import PrediksiRequest, PrediksiResponse

router = APIRouter(prefix="/prediksi", tags=["prediksi"])
logger = logging.getLogger(__name__)

@router.post("/train")
async def train_model(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Endpoint untuk melatih model C4.5
    """
    try:
        ml_service = MLService(db)
        result = ml_service.train_model()
        
        return {
            "status": "success",
            "message": "Model training completed",
            "data": result
        }
        
    except Exception as e:
        logger.error(f"Error in train_model endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=PrediksiResponse)
async def predict_prestasi(
    request: PrediksiRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Endpoint untuk prediksi prestasi siswa
    """
    try:
        ml_service = MLService(db)
        result = ml_service.predict_prestasi(
            siswa_id=request.siswa_id,
            semester=request.semester,
            tahun_ajaran=request.tahun_ajaran
        )
        
        if result['status'] == 'error':
            raise HTTPException(status_code=400, detail=result['message'])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in predict_prestasi endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visualization")
async def get_tree_visualization(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Endpoint untuk mendapatkan visualisasi pohon keputusan
    """
    try:
        ml_service = MLService(db)
        
        # Load model
        ml_service._load_model()
        
        if ml_service.current_model is None:
            return {
                "status": "error",
                "message": "Model belum dilatih. Silakan latih model terlebih dahulu."
            }
        
        # Generate visualization
        visualization_base64 = ml_service.tree_visualizer.create_tree_visualization_base64(
            ml_service.current_model
        )
        
        return {
            "status": "success",
            "visualization_base64": visualization_base64
        }
        
    except Exception as e:
        logger.error(f"Error in get_tree_visualization endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/confusion-matrix")
async def get_confusion_matrix(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Endpoint untuk mendapatkan confusion matrix
    """
    try:
        ml_service = MLService(db)
        result = ml_service.get_confusion_matrix()
        
        return result
        
    except Exception as e:
        logger.error(f"Error in get_confusion_matrix endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-metrics")
async def get_model_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Endpoint untuk mendapatkan metrik evaluasi model
    """
    try:
        ml_service = MLService(db)
        result = ml_service.get_model_metrics()
        
        return result
        
    except Exception as e:
        logger.error(f"Error in get_model_metrics endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🎯 **9. INTEGRASI FRONTEND**

### **9.1 JavaScript Implementation**

Berdasarkan kode `frontend/js/app.js` yang sudah ada, implementasi C4.5 terintegrasi dengan:

1. **Training Model**: Tombol "Latih Model" memanggil endpoint `/prediksi/train`
2. **Prediksi**: Form prediksi memanggil endpoint `/prediksi`  
3. **Visualisasi**: Menampilkan pohon keputusan dari endpoint `/prediksi/visualization`
4. **Evaluasi**: Menampilkan confusion matrix dan metrik dari endpoint yang sesuai

### **9.2 Workflow Lengkap dalam Aplikasi**

```javascript
// Contoh workflow training dan prediksi dalam app.js
$("#btn-train").on("click", function() {
    $(this).prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Melatih...');
    
    $.ajax({
        url: `${API_URL}/prediksi/train`,
        method: "POST",
        beforeSend: function(xhr) {
            const token = getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
        },
        success: function(data) {
            alert(`Model berhasil dilatih dengan akurasi ${(data.data.accuracy * 100).toFixed(2)}%`);
            
            // Refresh visualisasi dan metrik
            loadModelEvaluation();
        },
        error: function(xhr) {
            const errorMsg = xhr.responseJSON?.detail || 'Terjadi kesalahan saat melatih model';
            alert(errorMsg);
        },
        complete: function() {
            $("#btn-train").prop("disabled", false).html('<i class="fas fa-cogs mr-2"></i> Latih Model');
        }
    });
});
```

---

## 📊 **10. KESIMPULAN IMPLEMENTASI**

### **10.1 Keunggulan Implementasi C4.5 dalam EduPro**

1. **Interpretabilitas Tinggi**: Pohon keputusan mudah dipahami oleh guru dan staf
2. **Handling Categorical Data**: Cocok untuk data kategorikal seperti tingkat prestasi
3. **Gain Ratio**: Mengatasi bias terhadap atribut dengan banyak nilai
4. **Visualisasi Interaktif**: Pohon keputusan dapat dilihat dan dipahami secara visual
5. **Real-time Prediction**: Prediksi dapat dilakukan secara real-time melalui web interface

### **10.2 Metrik Evaluasi yang Digunakan**

- **Accuracy**: Persentase prediksi yang benar
- **Precision**: Kemampuan model untuk tidak melabeli sampel negatif sebagai positif
- **Recall**: Kemampuan model untuk menemukan semua sampel positif
- **F1-Score**: Harmonic mean dari precision dan recall
- **Confusion Matrix**: Matriks untuk melihat detail kesalahan klasifikasi

### **10.3 Workflow Lengkap Sistem**

1. **Input Data** → Database EduPro (siswa, nilai, presensi, penghasilan)
2. **Data Extraction** → Query database untuk mendapatkan dataset lengkap
3. **Preprocessing** → Feature engineering dan kategorisasi
4. **Training** → Algoritma C4.5 dengan Gain Ratio
5. **Evaluation** → Confusion matrix dan metrik evaluasi
6. **Visualization** → Pohon keputusan visual
7. **Prediction** → Prediksi prestasi siswa baru
8. **Storage** → Simpan hasil prediksi ke database

Implementasi ini memberikan solusi end-to-end yang lengkap untuk prediksi prestasi siswa menggunakan algoritma C4.5 dalam aplikasi EduPro. 