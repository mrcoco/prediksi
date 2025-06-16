# 🎓 Implementasi Detail Algoritma C4.5 - Bagian 2: Gain Ratio & Algoritma Lengkap

## 🧮 **3.3 Split Information**

**Definisi Teoritis:**
Split Information mengukur seberapa luas dan seragam suatu atribut membagi dataset. Digunakan untuk menormalkan Information Gain dan mengatasi bias terhadap atribut dengan banyak nilai.

**Formula Matematika:**
```
SplitInfo(S, A) = -Σ(i=1 to v) (|S_i|/|S|) × log₂(|S_i|/|S|)
```

**Implementasi Python:**

```python
# backend/ml/c45_math.py (lanjutan)
@staticmethod
def calculate_split_info(df: pd.DataFrame, attribute: str) -> Dict[str, Any]:
    """Menghitung Split Information untuk suatu atribut"""
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
```

## 🧮 **3.4 Gain Ratio**

**Formula Matematika:**
```
GainRatio(S, A) = Gain(S, A) / SplitInfo(S, A)
```

**Implementasi Python:**

```python
@staticmethod
def calculate_gain_ratio(df: pd.DataFrame, attribute: str, target: str) -> Dict[str, Any]:
    """Menghitung Gain Ratio untuk suatu atribut"""
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
        'gain_ratio': gain_ratio
    }
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
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class DecisionNode:
    """Node dalam decision tree"""
    attribute: Optional[str] = None
    prediction: Optional[str] = None
    children: Optional[Dict[str, 'DecisionNode']] = None
    samples: int = 0
    class_distribution: Optional[Dict[str, int]] = None
    is_leaf: bool = False

class C45DecisionTree:
    """Implementasi lengkap algoritma C4.5"""
    
    def __init__(self, min_samples_split: int = 2, max_depth: int = None):
        self.min_samples_split = min_samples_split
        self.max_depth = max_depth
        self.root = None
        self.feature_names = None
        self.target_name = None
        self.math_calc = C45Mathematics()
    
    def fit(self, X: pd.DataFrame, y: pd.Series) -> 'C45DecisionTree':
        """Train the C4.5 decision tree"""
        self.feature_names = list(X.columns)
        self.target_name = y.name or 'target'
        
        data = X.copy()
        data[self.target_name] = y
        
        self.root = self._build_tree(data, self.feature_names, depth=0)
        return self
    
    def _build_tree(self, data: pd.DataFrame, available_attributes: List[str], depth: int = 0) -> DecisionNode:
        """Recursively build the decision tree"""
        samples = len(data)
        target_values = data[self.target_name].tolist()
        class_counts = data[self.target_name].value_counts().to_dict()
        majority_class = data[self.target_name].mode().iloc[0]
        
        # Base cases
        if len(set(target_values)) == 1:
            return DecisionNode(
                prediction=target_values[0],
                samples=samples,
                class_distribution=class_counts,
                is_leaf=True
            )
        
        if not available_attributes or (self.max_depth and depth >= self.max_depth):
            return DecisionNode(
                prediction=majority_class,
                samples=samples,
                class_distribution=class_counts,
                is_leaf=True
            )
        
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
        
        remaining_attributes = [attr for attr in available_attributes if attr != best_attribute]
        
        # Create child nodes
        for value in data[best_attribute].unique():
            subset = data[data[best_attribute] == value]
            
            if len(subset) == 0:
                child = DecisionNode(
                    prediction=majority_class,
                    samples=0,
                    class_distribution={},
                    is_leaf=True
                )
            else:
                child = self._build_tree(subset, remaining_attributes, depth + 1)
            
            node.children[str(value)] = child
        
        return node
    
    def predict(self, X: pd.DataFrame) -> List[str]:
        """Make predictions for input data"""
        predictions = []
        for _, row in X.iterrows():
            prediction = self._predict_single(row, self.root)
            predictions.append(prediction)
        return predictions
    
    def _predict_single(self, sample: pd.Series, node: DecisionNode) -> str:
        """Make prediction for a single sample"""
        if node.is_leaf:
            return node.prediction
        
        attribute_value = str(sample[node.attribute])
        
        if attribute_value in node.children:
            return self._predict_single(sample, node.children[attribute_value])
        else:
            return max(node.class_distribution.items(), key=lambda x: x[1])[0]
```

---

## 📊 **5. EVALUASI MODEL**

### **5.1 Confusion Matrix**

```python
# backend/ml/evaluation.py
from sklearn.metrics import confusion_matrix, classification_report
import numpy as np

class ModelEvaluator:
    """Class untuk evaluasi model C4.5"""
    
    @staticmethod
    def calculate_confusion_matrix(y_true: List[str], y_pred: List[str]) -> Dict[str, Any]:
        """Menghitung confusion matrix"""
        labels = sorted(list(set(y_true + y_pred)))
        cm = confusion_matrix(y_true, y_pred, labels=labels)
        
        return {
            'matrix': cm.tolist(),
            'labels': labels,
            'accuracy': np.trace(cm) / np.sum(cm)
        }
    
    @staticmethod
    def calculate_metrics(y_true: List[str], y_pred: List[str]) -> Dict[str, float]:
        """Menghitung metrik evaluasi lengkap"""
        report = classification_report(y_true, y_pred, output_dict=True)
        
        return {
            'accuracy': report['accuracy'],
            'precision': report['macro avg']['precision'],
            'recall': report['macro avg']['recall'],
            'f1_score': report['macro avg']['f1-score']
        }
```

Dokumentasi akan dilanjutkan dengan implementasi dalam sistem EduPro. Apakah Anda ingin saya melanjutkan dengan bagian selanjutnya? 