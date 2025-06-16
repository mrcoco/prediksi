# 🎓 Implementasi Detail Algoritma C4.5 dalam EduPro - Bagian 2

## 🧮 **3.3 Split Information**

**Definisi Teoritis:**
Split Information mengukur seberapa luas dan seragam suatu atribut membagi dataset. Digunakan untuk menormalkan Information Gain dan mengatasi bias terhadap atribut dengan banyak nilai.

**Formula Matematika:**
```
SplitInfo(S, A) = -Σ(i=1 to v) (|S_i|/|S|) × log₂(|S_i|/|S|)
```

Dimana:
- S = dataset
- A = atribut yang diuji
- v = jumlah nilai berbeda dari atribut A
- S_i = subset ke-i dari S berdasarkan nilai atribut A
- |S_i| = jumlah sampel dalam subset S_i
- |S| = jumlah total sampel

**Implementasi Python:**

```python
# backend/ml/c45_math.py (lanjutan)
class C45Mathematics:
    # ... kode sebelumnya ...
    
    @staticmethod
    def calculate_split_info(df: pd.DataFrame, attribute: str) -> Dict[str, Any]:
        """
        Menghitung Split Information untuk suatu atribut
        
        Args:
            df: DataFrame dengan data
            attribute: Nama kolom atribut
            
        Returns:
            Dict: Detail perhitungan Split Information
        """
        total_samples = len(df)
        split_info = 0.0
        split_details = {}
        
        for value in df[attribute].unique():
            subset_size = len(df[df[attribute] == value])
            proportion = subset_size / total_samples
            
            if proportion > 0:
                log_proportion = math.log2(proportion)
                contribution = -proportion * log_proportion
                split_info += contribution
                
                split_details[value] = {
                    'subset_size': subset_size,
                    'proportion': proportion,
                    'log2_proportion': log_proportion,
                    'contribution': contribution
                }
        
        return {
            'attribute': attribute,
            'split_info': split_info,
            'total_samples': total_samples,
            'unique_values': len(df[attribute].unique()),
            'split_details': split_details
        }

# Contoh perhitungan Split Information
def contoh_perhitungan_split_info():
    """
    Contoh perhitungan Split Information untuk atribut 'kategori_penghasilan'
    """
    # Dataset contoh dengan distribusi yang berbeda
    data = {
        'kategori_penghasilan': ['Tinggi']*20 + ['Sedang']*50 + ['Rendah']*30,
        'prestasi_target': ['Tinggi']*40 + ['Sedang']*35 + ['Rendah']*25
    }
    
    df = pd.DataFrame(data)
    
    math_calc = C45Mathematics()
    result = math_calc.calculate_split_info(df, 'kategori_penghasilan')
    
    print("=== CONTOH PERHITUNGAN SPLIT INFORMATION ===")
    print(f"Atribut: {result['attribute']}")
    print(f"Total sampel: {result['total_samples']}")
    print(f"Jumlah nilai unik: {result['unique_values']}")
    
    print("\nDetail per nilai atribut:")
    for value, detail in result['split_details'].items():
        print(f"\nKategori Penghasilan = {value}:")
        print(f"  Jumlah sampel: {detail['subset_size']}")
        print(f"  Proporsi: {detail['proportion']:.3f}")
        print(f"  log₂(proporsi): {detail['log2_proportion']:.3f}")
        print(f"  Kontribusi: {detail['contribution']:.3f}")
    
    print(f"\nSplit Information: {result['split_info']:.3f}")
```

## 🧮 **3.4 Gain Ratio**

**Definisi Teoritis:**
Gain Ratio adalah perbaikan dari Information Gain yang menormalkan nilai dengan Split Information. Ini mengatasi bias C4.5 terhadap atribut dengan banyak nilai berbeda.

**Formula Matematika:**
```
GainRatio(S, A) = Gain(S, A) / SplitInfo(S, A)
```

Dimana:
- Gain(S, A) = Information Gain
- SplitInfo(S, A) = Split Information

**Implementasi Python:**

```python
class C45Mathematics:
    # ... kode sebelumnya ...
    
    @staticmethod
    def calculate_gain_ratio(df: pd.DataFrame, attribute: str, target: str) -> Dict[str, Any]:
        """
        Menghitung Gain Ratio untuk suatu atribut
        
        Args:
            df: DataFrame dengan data
            attribute: Nama kolom atribut
            target: Nama kolom target
            
        Returns:
            Dict: Detail perhitungan Gain Ratio
        """
        # Hitung Information Gain
        gain_result = C45Mathematics.calculate_information_gain(df, attribute, target)
        information_gain = gain_result['information_gain']
        
        # Hitung Split Information
        split_result = C45Mathematics.calculate_split_info(df, attribute)
        split_info = split_result['split_info']
        
        # Hitung Gain Ratio
        if split_info == 0:
            gain_ratio = 0.0
        else:
            gain_ratio = information_gain / split_info
        
        return {
            'attribute': attribute,
            'information_gain': information_gain,
            'split_info': split_info,
            'gain_ratio': gain_ratio,
            'gain_details': gain_result,
            'split_details': split_result
        }
    
    @staticmethod
    def select_best_attribute(df: pd.DataFrame, attributes: List[str], target: str) -> Dict[str, Any]:
        """
        Memilih atribut terbaik berdasarkan Gain Ratio tertinggi
        
        Args:
            df: DataFrame dengan data
            attributes: List nama kolom atribut kandidat
            target: Nama kolom target
            
        Returns:
            Dict: Atribut terbaik dan detail perhitungan semua atribut
        """
        attribute_scores = {}
        
        for attribute in attributes:
            if attribute in df.columns and len(df[attribute].unique()) > 1:
                result = C45Mathematics.calculate_gain_ratio(df, attribute, target)
                attribute_scores[attribute] = result
        
        if not attribute_scores:
            return {'best_attribute': None, 'scores': {}}
        
        # Pilih atribut dengan Gain Ratio tertinggi
        best_attribute = max(attribute_scores.keys(), 
                           key=lambda x: attribute_scores[x]['gain_ratio'])
        
        return {
            'best_attribute': best_attribute,
            'best_score': attribute_scores[best_attribute],
            'all_scores': attribute_scores
        }

# Contoh pemilihan atribut terbaik
def contoh_pemilihan_atribut_terbaik():
    """
    Contoh pemilihan atribut terbaik menggunakan Gain Ratio
    """
    # Dataset contoh yang lebih realistis
    np.random.seed(42)
    n_samples = 200
    
    # Generate data sintetis
    kategori_nilai = np.random.choice(['Tinggi', 'Sedang', 'Rendah'], n_samples, p=[0.3, 0.4, 0.3])
    kategori_kehadiran = np.random.choice(['Tinggi', 'Sedang', 'Rendah'], n_samples, p=[0.4, 0.35, 0.25])
    kategori_penghasilan = np.random.choice(['Tinggi', 'Sedang', 'Rendah'], n_samples, p=[0.25, 0.45, 0.3])
    
    # Generate target berdasarkan aturan logis
    prestasi_target = []
    for i in range(n_samples):
        score = 0
        if kategori_nilai[i] == 'Tinggi': score += 3
        elif kategori_nilai[i] == 'Sedang': score += 2
        else: score += 1
        
        if kategori_kehadiran[i] == 'Tinggi': score += 2
        elif kategori_kehadiran[i] == 'Sedang': score += 1
        
        if kategori_penghasilan[i] == 'Tinggi': score += 1
        
        if score >= 5: prestasi_target.append('Tinggi')
        elif score >= 3: prestasi_target.append('Sedang')
        else: prestasi_target.append('Rendah')
    
    df = pd.DataFrame({
        'kategori_nilai': kategori_nilai,
        'kategori_kehadiran': kategori_kehadiran,
        'kategori_penghasilan': kategori_penghasilan,
        'prestasi_target': prestasi_target
    })
    
    math_calc = C45Mathematics()
    attributes = ['kategori_nilai', 'kategori_kehadiran', 'kategori_penghasilan']
    result = math_calc.select_best_attribute(df, attributes, 'prestasi_target')
    
    print("=== PEMILIHAN ATRIBUT TERBAIK ===")
    print(f"Dataset size: {len(df)}")
    print(f"Target distribution: {df['prestasi_target'].value_counts().to_dict()}")
    
    print("\nGain Ratio untuk setiap atribut:")
    for attr, score in result['all_scores'].items():
        print(f"\n{attr}:")
        print(f"  Information Gain: {score['information_gain']:.4f}")
        print(f"  Split Info: {score['split_info']:.4f}")
        print(f"  Gain Ratio: {score['gain_ratio']:.4f}")
    
    print(f"\nAtribut terpilih: {result['best_attribute']}")
    print(f"Gain Ratio terbaik: {result['best_score']['gain_ratio']:.4f}")
```

---

## 🌳 **4. ALGORITMA C4.5 LENGKAP**

### **4.1 Pseudocode Algoritma C4.5**

```
Algorithm C4.5(Dataset S, Attributes A, Target T):
1. IF all samples in S belong to same class:
   RETURN leaf node with that class
   
2. IF A is empty OR no attribute provides information gain:
   RETURN leaf node with majority class in S
   
3. SELECT attribute A_best with highest Gain Ratio from A
   
4. CREATE decision node for A_best
   
5. FOR each value v of A_best:
   a. CREATE subset S_v = samples in S where A_best = v
   b. IF S_v is empty:
      ADD leaf child with majority class in S
   c. ELSE:
      ADD child = C4.5(S_v, A - {A_best}, T)
      
6. RETURN decision node
```

### **4.2 Implementasi Lengkap C4.5**

```python
# backend/ml/c45_algorithm.py
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
import json
import logging

logger = logging.getLogger(__name__)

@dataclass
class DecisionNode:
    """Node dalam decision tree"""
    attribute: Optional[str] = None
    value: Optional[str] = None
    prediction: Optional[str] = None
    children: Optional[Dict[str, 'DecisionNode']] = None
    samples: int = 0
    class_distribution: Optional[Dict[str, int]] = None
    is_leaf: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert node to dictionary for serialization"""
        result = {
            'attribute': self.attribute,
            'value': self.value,
            'prediction': self.prediction,
            'samples': self.samples,
            'class_distribution': self.class_distribution,
            'is_leaf': self.is_leaf
        }
        
        if self.children:
            result['children'] = {k: v.to_dict() for k, v in self.children.items()}
        
        return result

class C45DecisionTree:
    """Implementasi lengkap algoritma C4.5"""
    
    def __init__(self, min_samples_split: int = 2, min_samples_leaf: int = 1, max_depth: int = None):
        """
        Initialize C4.5 Decision Tree
        
        Args:
            min_samples_split: Minimum samples required to split a node
            min_samples_leaf: Minimum samples required at a leaf node
            max_depth: Maximum depth of the tree
        """
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.max_depth = max_depth
        self.root = None
        self.feature_names = None
        self.target_name = None
        self.math_calc = C45Mathematics()
    
    def fit(self, X: pd.DataFrame, y: pd.Series) -> 'C45DecisionTree':
        """
        Train the C4.5 decision tree
        
        Args:
            X: Feature DataFrame
            y: Target Series
            
        Returns:
            self: Trained model
        """
        self.feature_names = list(X.columns)
        self.target_name = y.name or 'target'
        
        # Combine X and y for easier processing
        data = X.copy()
        data[self.target_name] = y
        
        logger.info(f"Training C4.5 with {len(data)} samples, {len(self.feature_names)} features")
        logger.info(f"Target distribution: {y.value_counts().to_dict()}")
        
        # Build the tree
        self.root = self._build_tree(data, self.feature_names, depth=0)
        
        return self
    
    def _build_tree(self, data: pd.DataFrame, available_attributes: List[str], depth: int = 0) -> DecisionNode:
        """
        Recursively build the decision tree
        
        Args:
            data: Current dataset
            available_attributes: Available attributes for splitting
            depth: Current depth
            
        Returns:
            DecisionNode: Root node of the subtree
        """
        samples = len(data)
        target_values = data[self.target_name].tolist()
        class_counts = data[self.target_name].value_counts().to_dict()
        majority_class = data[self.target_name].mode().iloc[0]
        
        # Base cases
        
        # 1. All samples belong to same class
        if len(set(target_values)) == 1:
            return DecisionNode(
                prediction=target_values[0],
                samples=samples,
                class_distribution=class_counts,
                is_leaf=True
            )
        
        # 2. No more attributes or max depth reached
        if not available_attributes or (self.max_depth and depth >= self.max_depth):
            return DecisionNode(
                prediction=majority_class,
                samples=samples,
                class_distribution=class_counts,
                is_leaf=True
            )
        
        # 3. Too few samples to split
        if samples < self.min_samples_split:
            return DecisionNode(
                prediction=majority_class,
                samples=samples,
                class_distribution=class_counts,
                is_leaf=True
            )
        
        # Select best attribute using Gain Ratio
        best_result = self.math_calc.select_best_attribute(
            data, available_attributes, self.target_name
        )
        
        best_attribute = best_result['best_attribute']
        
        # 4. No attribute provides information gain
        if not best_attribute or best_result['best_score']['gain_ratio'] <= 0:
            return DecisionNode(
                prediction=majority_class,
                samples=samples,
                class_distribution=class_counts,
                is_leaf=True
            )
        
        # Create decision node
        node = DecisionNode(
            attribute=best_attribute,
            samples=samples,
            class_distribution=class_counts,
            children={}
        )
        
        # Remove selected attribute from available attributes
        remaining_attributes = [attr for attr in available_attributes if attr != best_attribute]
        
        # Create child nodes for each value of the selected attribute
        for value in data[best_attribute].unique():
            subset = data[data[best_attribute] == value]
            
            if len(subset) == 0:
                # Empty subset - create leaf with majority class
                child = DecisionNode(
                    prediction=majority_class,
                    samples=0,
                    class_distribution=dict(),
                    is_leaf=True
                )
            elif len(subset) < self.min_samples_leaf:
                # Too few samples - create leaf with majority class of subset
                subset_majority = subset[self.target_name].mode().iloc[0]
                child = DecisionNode(
                    prediction=subset_majority,
                    samples=len(subset),
                    class_distribution=subset[self.target_name].value_counts().to_dict(),
                    is_leaf=True
                )
            else:
                # Recursively build subtree
                child = self._build_tree(subset, remaining_attributes, depth + 1)
            
            node.children[str(value)] = child
        
        return node
    
    def predict(self, X: pd.DataFrame) -> List[str]:
        """
        Make predictions for input data
        
        Args:
            X: Feature DataFrame
            
        Returns:
            List[str]: Predictions
        """
        if self.root is None:
            raise ValueError("Model has not been trained yet")
        
        predictions = []
        for _, row in X.iterrows():
            prediction = self._predict_single(row, self.root)
            predictions.append(prediction)
        
        return predictions
    
    def _predict_single(self, sample: pd.Series, node: DecisionNode) -> str:
        """
        Make prediction for a single sample
        
        Args:
            sample: Single sample as Series
            node: Current node
            
        Returns:
            str: Prediction
        """
        if node.is_leaf:
            return node.prediction
        
        attribute_value = str(sample[node.attribute])
        
        if attribute_value in node.children:
            return self._predict_single(sample, node.children[attribute_value])
        else:
            # Unknown value - return majority class of current node
            return max(node.class_distribution.items(), key=lambda x: x[1])[0]
    
    def predict_proba(self, X: pd.DataFrame) -> List[Dict[str, float]]:
        """
        Predict class probabilities
        
        Args:
            X: Feature DataFrame
            
        Returns:
            List[Dict[str, float]]: Probabilities for each class
        """
        if self.root is None:
            raise ValueError("Model has not been trained yet")
        
        probabilities = []
        for _, row in X.iterrows():
            proba = self._predict_proba_single(row, self.root)
            probabilities.append(proba)
        
        return probabilities
    
    def _predict_proba_single(self, sample: pd.Series, node: DecisionNode) -> Dict[str, float]:
        """
        Get class probabilities for a single sample
        
        Args:
            sample: Single sample as Series
            node: Current node
            
        Returns:
            Dict[str, float]: Class probabilities
        """
        if node.is_leaf or not node.children:
            # Calculate probabilities from class distribution
            total = sum(node.class_distribution.values())
            if total == 0:
                return {}
            
            return {cls: count/total for cls, count in node.class_distribution.items()}
        
        attribute_value = str(sample[node.attribute])
        
        if attribute_value in node.children:
            return self._predict_proba_single(sample, node.children[attribute_value])
        else:
            # Unknown value - return probabilities from current node
            total = sum(node.class_distribution.values())
            if total == 0:
                return {}
            
            return {cls: count/total for cls, count in node.class_distribution.items()}
    
    def get_tree_structure(self) -> Dict[str, Any]:
        """
        Get the complete tree structure
        
        Returns:
            Dict: Tree structure as dictionary
        """
        if self.root is None:
            return {}
        
        return self.root.to_dict()
    
    def print_tree(self, node: DecisionNode = None, depth: int = 0, prefix: str = ""):
        """
        Print the decision tree in readable format
        
        Args:
            node: Current node (None for root)
            depth: Current depth
            prefix: Prefix for formatting
        """
        if node is None:
            node = self.root
        
        if node is None:
            print("Tree has not been built yet")
            return
        
        indent = "  " * depth
        
        if node.is_leaf:
            print(f"{indent}{prefix}→ PREDICT: {node.prediction} (samples: {node.samples})")
            print(f"{indent}   Distribution: {node.class_distribution}")
        else:
            print(f"{indent}{prefix}[{node.attribute}] (samples: {node.samples})")
            print(f"{indent}   Distribution: {node.class_distribution}")
            
            for value, child in node.children.items():
                self.print_tree(child, depth + 1, f"{node.attribute} = {value}")

# Contoh penggunaan lengkap
def contoh_training_c45():
    """
    Contoh lengkap training model C4.5 dengan data EduPro
    """
    # Generate dataset contoh
    np.random.seed(42)
    n_samples = 300
    
    # Generate features
    kategori_nilai = np.random.choice(['Tinggi', 'Sedang', 'Rendah'], n_samples, p=[0.3, 0.4, 0.3])
    kategori_kehadiran = np.random.choice(['Tinggi', 'Sedang', 'Rendah'], n_samples, p=[0.4, 0.35, 0.25])
    kategori_penghasilan = np.random.choice(['Tinggi', 'Sedang', 'Rendah'], n_samples, p=[0.25, 0.45, 0.3])
    
    # Generate target dengan aturan yang realistis
    prestasi_target = []
    for i in range(n_samples):
        # Scoring system
        score = 0
        
        # Nilai akademik (bobot tertinggi)
        if kategori_nilai[i] == 'Tinggi': score += 4
        elif kategori_nilai[i] == 'Sedang': score += 2
        else: score += 0
        
        # Kehadiran (bobot sedang)
        if kategori_kehadiran[i] == 'Tinggi': score += 2
        elif kategori_kehadiran[i] == 'Sedang': score += 1
        else: score += 0
        
        # Penghasilan orang tua (bobot rendah)
        if kategori_penghasilan[i] == 'Tinggi': score += 1
        
        # Add some randomness
        score += np.random.choice([-1, 0, 1], p=[0.1, 0.8, 0.1])
        
        # Determine target
        if score >= 5: prestasi_target.append('Tinggi')
        elif score >= 2: prestasi_target.append('Sedang')
        else: prestasi_target.append('Rendah')
    
    # Create DataFrame
    X = pd.DataFrame({
        'kategori_nilai': kategori_nilai,
        'kategori_kehadiran': kategori_kehadiran,
        'kategori_penghasilan': kategori_penghasilan
    })
    
    y = pd.Series(prestasi_target, name='prestasi_target')
    
    print("=== TRAINING MODEL C4.5 ===")
    print(f"Dataset size: {len(X)}")
    print(f"Features: {list(X.columns)}")
    print(f"Target distribution: {y.value_counts().to_dict()}")
    
    # Train model
    model = C45DecisionTree(min_samples_split=5, min_samples_leaf=2, max_depth=10)
    model.fit(X, y)
    
    print("\n=== DECISION TREE STRUCTURE ===")
    model.print_tree()
    
    # Test predictions
    test_samples = pd.DataFrame([
        {'kategori_nilai': 'Tinggi', 'kategori_kehadiran': 'Tinggi', 'kategori_penghasilan': 'Sedang'},
        {'kategori_nilai': 'Rendah', 'kategori_kehadiran': 'Rendah', 'kategori_penghasilan': 'Rendah'},
        {'kategori_nilai': 'Sedang', 'kategori_kehadiran': 'Tinggi', 'kategori_penghasilan': 'Tinggi'}
    ])
    
    predictions = model.predict(test_samples)
    probabilities = model.predict_proba(test_samples)
    
    print("\n=== TEST PREDICTIONS ===")
    for i, (_, sample) in enumerate(test_samples.iterrows()):
        print(f"\nSample {i+1}: {dict(sample)}")
        print(f"Prediction: {predictions[i]}")
        print(f"Probabilities: {probabilities[i]}")
    
    return model, X, y

if __name__ == "__main__":
    # Jalankan contoh
    contoh_perhitungan_entropy()
    print("\n" + "="*50 + "\n")
    contoh_perhitungan_information_gain()
    print("\n" + "="*50 + "\n")
    contoh_perhitungan_split_info()
    print("\n" + "="*50 + "\n")
    contoh_pemilihan_atribut_terbaik()
    print("\n" + "="*50 + "\n")
    contoh_training_c45()
```

Dokumentasi ini akan dilanjutkan dengan bagian ketiga yang mencakup evaluasi model, implementasi dalam EduPro, dan visualisasi. Apakah Anda ingin saya melanjutkan dengan bagian selanjutnya? 