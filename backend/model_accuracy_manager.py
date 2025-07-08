"""
Model Accuracy Manager untuk EduPro - Sistem Prediksi Prestasi Siswa
==================================================================

Modul ini mengelola akurasi model machine learning dengan:
1. Model retraining strategy saat data berubah
2. Data quality validation untuk perubahan data
3. Model version management dan tracking
4. Performance monitoring dan accuracy degradation detection
5. Automated model updates dengan intelligent triggers

Author: EduPro Development Team
Date: 2025-06-21
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from sqlalchemy.orm import Session
from dataclasses import dataclass
import json
import hashlib
from enum import Enum

# Import dependencies
from database import get_db, NilaiRaport, Siswa, Prestasi, PenghasilanOrtu, Presensi
from models.c45_model import c45_model
from cache_config import set_cache, get_cache, delete_cache_pattern, cache_health_check


class RetrainingTrigger(Enum):
    """Enum untuk trigger retraining model"""
    DATA_CHANGE = "data_change"
    ACCURACY_DEGRADATION = "accuracy_degradation"
    SCHEDULED = "scheduled"
    MANUAL = "manual"


@dataclass
class ModelMetrics:
    """Dataclass untuk menyimpan metrics model"""
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    training_samples: int
    timestamp: datetime
    model_version: str


@dataclass
class DataChangeEvent:
    """Dataclass untuk tracking perubahan data"""
    siswa_id: int
    change_type: str  # 'nilai', 'presensi', 'penghasilan'
    old_value: Any
    new_value: Any
    timestamp: datetime
    impact_scope: str  # 'single', 'semester', 'all'


class ModelAccuracyManager:
    """
    Manager untuk mengelola akurasi model machine learning
    dengan intelligent retraining dan monitoring
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.model = c45_model
        self.retraining_threshold = 0.05  # 5% accuracy drop triggers retraining
        self.min_accuracy_threshold = 0.75  # Minimum acceptable accuracy
        self.max_days_without_training = 30  # Max days before scheduled retraining
        self.min_samples_for_training = 15  # Minimum samples needed for training
        
        # Cache keys for model management
        self.model_metrics_key = "model:metrics:current"
        self.model_version_key = "model:version:current" 
        self.data_changes_key = "model:data_changes"
        self.last_validation_key = "model:last_validation"
    
    def validate_data_change(self, siswa_id: int, change_type: str, old_value: Any, new_value: Any) -> Dict[str, Any]:
        """
        Validasi perubahan data dan tentukan dampaknya terhadap prediksi
        
        Args:
            siswa_id: ID siswa yang datanya berubah
            change_type: Jenis perubahan ('nilai', 'presensi', 'penghasilan')
            old_value: Nilai lama
            new_value: Nilai baru
            
        Returns:
            Dict dengan informasi validasi dan dampak
        """
        try:
            # Validasi signifikansi perubahan
            is_significant = self._is_change_significant(change_type, old_value, new_value)
            
            # Tentukan scope dampak
            impact_scope = self._determine_impact_scope(change_type, siswa_id)
            
            # Estimasi dampak terhadap prediksi
            prediction_impact = self._estimate_prediction_impact(change_type, old_value, new_value)
            
            # Record perubahan data
            change_event = DataChangeEvent(
                siswa_id=siswa_id,
                change_type=change_type,
                old_value=old_value,
                new_value=new_value,
                timestamp=datetime.now(),
                impact_scope=impact_scope
            )
            
            self._record_data_change(change_event)
            
            # Tentukan apakah perlu retraining
            needs_retraining = self._should_trigger_retraining(change_event, prediction_impact)
            
            validation_result = {
                "siswa_id": siswa_id,
                "change_type": change_type,
                "is_significant": is_significant,
                "impact_scope": impact_scope,
                "prediction_impact": prediction_impact,
                "needs_retraining": needs_retraining,
                "timestamp": datetime.now().isoformat(),
                "recommendation": self._get_recommendation(is_significant, prediction_impact, needs_retraining)
            }
            
            self.logger.info(f"📊 Data change validated - siswa_id={siswa_id}, type={change_type}, significant={is_significant}")
            
            return validation_result
            
        except Exception as e:
            self.logger.error(f"❌ Error validating data change: {str(e)}")
            return {
                "error": str(e),
                "needs_retraining": False,
                "recommendation": "Manual validation required"
            }
    
    def _is_change_significant(self, change_type: str, old_value: Any, new_value: Any) -> bool:
        """Tentukan apakah perubahan signifikan"""
        if change_type == "nilai":
            # Perubahan rata-rata > 5 poin dianggap signifikan
            if isinstance(old_value, (int, float)) and isinstance(new_value, (int, float)):
                return abs(old_value - new_value) > 5
        
        elif change_type == "presensi":
            # Perubahan kategori kehadiran dianggap signifikan
            if old_value != new_value:
                return True
        
        elif change_type == "penghasilan":
            # Perubahan kategori penghasilan dianggap signifikan
            if old_value != new_value:
                return True
        
        return False
    
    def _determine_impact_scope(self, change_type: str, siswa_id: int) -> str:
        """Tentukan scope dampak perubahan"""
        if change_type in ["nilai", "presensi"]:
            return "semester"  # Dampak pada semester tertentu
        elif change_type == "penghasilan":
            return "all"  # Dampak pada semua prediksi siswa
        else:
            return "single"  # Dampak pada prediksi tunggal
    
    def _estimate_prediction_impact(self, change_type: str, old_value: Any, new_value: Any) -> Dict[str, Any]:
        """Estimasi dampak perubahan terhadap prediksi"""
        impact = {
            "severity": "low",  # low, medium, high
            "confidence_change": 0.0,  # Estimasi perubahan confidence
            "prediction_change_probability": 0.0  # Probabilitas prediksi berubah
        }
        
        if change_type == "nilai":
            if isinstance(old_value, (int, float)) and isinstance(new_value, (int, float)):
                diff = abs(old_value - new_value)
                if diff > 15:
                    impact["severity"] = "high"
                    impact["prediction_change_probability"] = 0.7
                elif diff > 8:
                    impact["severity"] = "medium"
                    impact["prediction_change_probability"] = 0.4
                else:
                    impact["severity"] = "low"
                    impact["prediction_change_probability"] = 0.1
        
        elif change_type in ["presensi", "penghasilan"]:
            # Perubahan kategori selalu medium-high impact
            impact["severity"] = "medium"
            impact["prediction_change_probability"] = 0.5
        
        return impact
    
    def _should_trigger_retraining(self, change_event: DataChangeEvent, prediction_impact: Dict) -> bool:
        """Tentukan apakah perlu trigger retraining"""
        # Check accumulated data changes
        recent_changes = self._get_recent_data_changes()
        
        # Trigger retraining jika:
        # 1. High impact change
        if prediction_impact["severity"] == "high":
            return True
        
        # 2. Multiple medium impact changes dalam 24 jam
        medium_high_changes = [
            c for c in recent_changes 
            if c.get("prediction_impact", {}).get("severity") in ["medium", "high"]
            and (datetime.now() - datetime.fromisoformat(c["timestamp"])).days < 1
        ]
        if len(medium_high_changes) >= 3:
            return True
        
        # 3. Model belum di-train dalam X hari
        last_training = self._get_last_training_time()
        if last_training and (datetime.now() - last_training).days > self.max_days_without_training:
            return True
        
        return False
    
    def _record_data_change(self, change_event: DataChangeEvent):
        """Record perubahan data untuk tracking"""
        if cache_health_check():
            try:
                # Get existing changes
                existing_changes = get_cache(self.data_changes_key) or []
                
                # Add new change
                change_dict = {
                    "siswa_id": change_event.siswa_id,
                    "change_type": change_event.change_type,
                    "old_value": str(change_event.old_value),
                    "new_value": str(change_event.new_value),
                    "timestamp": change_event.timestamp.isoformat(),
                    "impact_scope": change_event.impact_scope
                }
                
                existing_changes.append(change_dict)
                
                # Keep only last 100 changes
                if len(existing_changes) > 100:
                    existing_changes = existing_changes[-100:]
                
                # Save to cache
                set_cache(self.data_changes_key, existing_changes, 86400 * 7)  # 7 days
                
            except Exception as e:
                self.logger.warning(f"⚠️ Failed to record data change: {str(e)}")
    
    def _get_recent_data_changes(self, days: int = 7) -> List[Dict]:
        """Get recent data changes dalam X hari terakhir"""
        if cache_health_check():
            try:
                all_changes = get_cache(self.data_changes_key) or []
                cutoff_time = datetime.now() - timedelta(days=days)
                
                recent_changes = [
                    change for change in all_changes
                    if datetime.fromisoformat(change["timestamp"]) > cutoff_time
                ]
                
                return recent_changes
            except Exception as e:
                self.logger.warning(f"⚠️ Failed to get recent changes: {str(e)}")
        
        return []
    
    def _get_last_training_time(self) -> Optional[datetime]:
        """Get timestamp terakhir model di-train"""
        try:
            if hasattr(self.model, 'last_trained') and self.model.last_trained:
                return datetime.fromisoformat(self.model.last_trained)
        except Exception:
            pass
        return None
    
    def _get_recommendation(self, is_significant: bool, prediction_impact: Dict, needs_retraining: bool) -> str:
        """Generate recommendation berdasarkan analysis"""
        if needs_retraining:
            return "Model retraining recommended due to significant data changes"
        elif prediction_impact["severity"] == "high":
            return "Monitor prediction accuracy closely for affected students"
        elif is_significant:
            return "Cache invalidation sufficient, monitor for additional changes"
        else:
            return "No immediate action required"
    
    def retrain_model_if_needed(self, db: Session, trigger: RetrainingTrigger = RetrainingTrigger.DATA_CHANGE) -> Dict[str, Any]:
        """
        Retrain model jika diperlukan berdasarkan trigger tertentu
        
        Args:
            db: Database session
            trigger: Trigger yang menyebabkan retraining
            
        Returns:
            Dict dengan hasil retraining
        """
        try:
            # Validate minimum data requirements
            validation_result = self._validate_training_requirements(db)
            if not validation_result["can_train"]:
                return {
                    "success": False,
                    "message": validation_result["message"],
                    "trigger": trigger.value
                }
            
            # Get current model metrics for comparison
            current_metrics = self._get_current_model_metrics()
            
            # Backup current model state
            model_backup = self._backup_current_model()
            
            self.logger.info(f"🔄 Starting model retraining - trigger: {trigger.value}")
            
            # Perform retraining
            training_result = self.model.train(db)
            
            # Get new model metrics
            new_metrics = ModelMetrics(
                accuracy=training_result.get('accuracy', 0),
                precision=self.model.model_metrics.get('precision', 0),
                recall=self.model.model_metrics.get('recall', 0),
                f1_score=self.model.model_metrics.get('f1_score', 0),
                training_samples=training_result.get('samples', 0),
                timestamp=datetime.now(),
                model_version=self._generate_model_version()
            )
            
            # Validate new model performance
            validation = self._validate_new_model_performance(current_metrics, new_metrics)
            
            if validation["is_acceptable"]:
                # Accept new model
                self._save_model_metrics(new_metrics)
                self._clear_model_caches()
                
                result = {
                    "success": True,
                    "message": "Model retrained successfully",
                    "trigger": trigger.value,
                    "old_accuracy": current_metrics.accuracy if current_metrics else 0,
                    "new_accuracy": new_metrics.accuracy,
                    "improvement": new_metrics.accuracy - (current_metrics.accuracy if current_metrics else 0),
                    "training_samples": new_metrics.training_samples,
                    "model_version": new_metrics.model_version,
                    "timestamp": new_metrics.timestamp.isoformat()
                }
                
                self.logger.info(f"✅ Model retraining successful - accuracy: {new_metrics.accuracy:.3f}")
                
            else:
                # Reject new model, restore backup
                self._restore_model_backup(model_backup)
                
                result = {
                    "success": False,
                    "message": f"New model performance unacceptable: {validation['reason']}",
                    "trigger": trigger.value,
                    "old_accuracy": current_metrics.accuracy if current_metrics else 0,
                    "new_accuracy": new_metrics.accuracy,
                    "reason": validation["reason"]
                }
                
                self.logger.warning(f"⚠️ Model retraining rejected - {validation['reason']}")
            
            return result
            
        except Exception as e:
            self.logger.error(f"❌ Error during model retraining: {str(e)}")
            return {
                "success": False,
                "message": f"Retraining failed: {str(e)}",
                "trigger": trigger.value
            }
    
    def _validate_training_requirements(self, db: Session) -> Dict[str, Any]:
        """Validate apakah data cukup untuk training"""
        try:
            # Count available labeled data
            labeled_count = db.query(Prestasi).count()
            
            if labeled_count < self.min_samples_for_training:
                return {
                    "can_train": False,
                    "message": f"Insufficient labeled data: {labeled_count} < {self.min_samples_for_training}",
                    "labeled_count": labeled_count
                }
            
            # Check data quality
            quality_check = self._check_data_quality(db)
            if not quality_check["is_good"]:
                return {
                    "can_train": False,
                    "message": f"Data quality issues: {quality_check['issues']}",
                    "labeled_count": labeled_count
                }
            
            return {
                "can_train": True,
                "message": "Training requirements met",
                "labeled_count": labeled_count
            }
            
        except Exception as e:
            return {
                "can_train": False,
                "message": f"Validation error: {str(e)}",
                "labeled_count": 0
            }
    
    def _check_data_quality(self, db: Session) -> Dict[str, Any]:
        """Check kualitas data untuk training"""
        try:
            issues = []
            
            # Check for data completeness
            incomplete_data = db.query(Siswa).outerjoin(NilaiRaport).outerjoin(Presensi).outerjoin(PenghasilanOrtu).filter(
                (NilaiRaport.id.is_(None)) | 
                (Presensi.id.is_(None)) | 
                (PenghasilanOrtu.id.is_(None))
            ).count()
            
            if incomplete_data > 0:
                issues.append(f"{incomplete_data} students with incomplete data")
            
            # Check for data balance
            class_distribution = db.query(Prestasi.prediksi_prestasi, db.func.count(Prestasi.id)).group_by(Prestasi.prediksi_prestasi).all()
            
            if len(class_distribution) < 2:
                issues.append("Insufficient class diversity")
            
            return {
                "is_good": len(issues) == 0,
                "issues": issues
            }
            
        except Exception as e:
            return {
                "is_good": False,
                "issues": [f"Quality check error: {str(e)}"]
            }
    
    def _get_current_model_metrics(self) -> Optional[ModelMetrics]:
        """Get current model metrics"""
        if cache_health_check():
            try:
                metrics_data = get_cache(self.model_metrics_key)
                if metrics_data:
                    return ModelMetrics(
                        accuracy=metrics_data["accuracy"],
                        precision=metrics_data["precision"],
                        recall=metrics_data["recall"],
                        f1_score=metrics_data["f1_score"],
                        training_samples=metrics_data["training_samples"],
                        timestamp=datetime.fromisoformat(metrics_data["timestamp"]),
                        model_version=metrics_data["model_version"]
                    )
            except Exception as e:
                self.logger.warning(f"⚠️ Failed to get current metrics: {str(e)}")
        
        return None
    
    def _save_model_metrics(self, metrics: ModelMetrics):
        """Save model metrics to cache"""
        if cache_health_check():
            try:
                metrics_data = {
                    "accuracy": metrics.accuracy,
                    "precision": metrics.precision,
                    "recall": metrics.recall,
                    "f1_score": metrics.f1_score,
                    "training_samples": metrics.training_samples,
                    "timestamp": metrics.timestamp.isoformat(),
                    "model_version": metrics.model_version
                }
                
                set_cache(self.model_metrics_key, metrics_data, 86400 * 30)  # 30 days
                set_cache(self.model_version_key, metrics.model_version, 86400 * 30)
                
            except Exception as e:
                self.logger.warning(f"⚠️ Failed to save model metrics: {str(e)}")
    
    def _generate_model_version(self) -> str:
        """Generate unique model version"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"c45_v{timestamp}"
    
    def _validate_new_model_performance(self, old_metrics: Optional[ModelMetrics], new_metrics: ModelMetrics) -> Dict[str, Any]:
        """Validate apakah performa model baru acceptable"""
        # Check minimum accuracy threshold
        if new_metrics.accuracy < self.min_accuracy_threshold:
            return {
                "is_acceptable": False,
                "reason": f"Accuracy below threshold: {new_metrics.accuracy:.3f} < {self.min_accuracy_threshold}"
            }
        
        # Check accuracy degradation
        if old_metrics and (old_metrics.accuracy - new_metrics.accuracy) > self.retraining_threshold:
            return {
                "is_acceptable": False,
                "reason": f"Accuracy degradation too high: {old_metrics.accuracy:.3f} -> {new_metrics.accuracy:.3f}"
            }
        
        # Check minimum training samples
        if new_metrics.training_samples < self.min_samples_for_training:
            return {
                "is_acceptable": False,
                "reason": f"Insufficient training samples: {new_metrics.training_samples}"
            }
        
        return {
            "is_acceptable": True,
            "reason": "Model performance acceptable"
        }
    
    def _backup_current_model(self) -> Dict[str, Any]:
        """Backup current model state"""
        backup = {
            "model_state": None,
            "metrics": self._get_current_model_metrics(),
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if self.model.trained:
                # In production, you'd save actual model state
                backup["model_trained"] = True
                backup["model_metrics"] = self.model.model_metrics
        except Exception as e:
            self.logger.warning(f"⚠️ Failed to backup model: {str(e)}")
        
        return backup
    
    def _restore_model_backup(self, backup: Dict[str, Any]):
        """Restore model from backup"""
        try:
            # In production, you'd restore actual model state
            self.logger.info("🔄 Restoring model from backup")
        except Exception as e:
            self.logger.error(f"❌ Failed to restore model backup: {str(e)}")
    
    def _clear_model_caches(self):
        """Clear all prediction caches after model update"""
        try:
            if cache_health_check():
                # Clear all prediction caches
                deleted_predict = delete_cache_pattern("predict:*")
                deleted_batch = delete_cache_pattern("batch_predict:*")
                
                self.logger.info(f"🗑️ Cleared {deleted_predict + deleted_batch} prediction cache entries after model update")
                
        except Exception as e:
            self.logger.warning(f"⚠️ Failed to clear model caches: {str(e)}")
    
    def monitor_model_performance(self, db: Session) -> Dict[str, Any]:
        """
        Monitor model performance dan detect accuracy degradation
        
        Returns:
            Dict dengan monitoring results
        """
        try:
            # Get current model metrics
            current_metrics = self._get_current_model_metrics()
            if not current_metrics:
                return {
                    "status": "no_metrics",
                    "message": "No current model metrics available",
                    "recommendation": "Train initial model"
                }
            
            # Check recent predictions accuracy (if available)
            recent_accuracy = self._calculate_recent_prediction_accuracy(db)
            
            # Check data drift
            data_drift = self._detect_data_drift(db)
            
            # Check staleness
            days_since_training = (datetime.now() - current_metrics.timestamp).days
            is_stale = days_since_training > self.max_days_without_training
            
            # Determine overall status
            status = "healthy"
            recommendations = []
            
            if recent_accuracy and recent_accuracy < (current_metrics.accuracy - self.retraining_threshold):
                status = "degraded"
                recommendations.append("Consider model retraining due to accuracy degradation")
            
            if data_drift["has_drift"]:
                status = "drift_detected"
                recommendations.append(f"Data drift detected: {data_drift['details']}")
            
            if is_stale:
                status = "stale"
                recommendations.append(f"Model is {days_since_training} days old, consider retraining")
            
            monitoring_result = {
                "status": status,
                "current_accuracy": current_metrics.accuracy,
                "recent_accuracy": recent_accuracy,
                "days_since_training": days_since_training,
                "is_stale": is_stale,
                "data_drift": data_drift,
                "training_samples": current_metrics.training_samples,
                "model_version": current_metrics.model_version,
                "recommendations": recommendations,
                "timestamp": datetime.now().isoformat()
            }
            
            # Cache monitoring result
            if cache_health_check():
                set_cache(self.last_validation_key, monitoring_result, 3600)  # 1 hour
            
            return monitoring_result
            
        except Exception as e:
            self.logger.error(f"❌ Error monitoring model performance: {str(e)}")
            return {
                "status": "error",
                "message": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _calculate_recent_prediction_accuracy(self, db: Session, days: int = 7) -> Optional[float]:
        """Calculate accuracy untuk prediksi recent"""
        try:
            # Get recent predictions with actual outcomes
            cutoff_date = datetime.now() - timedelta(days=days)
            
            # This would need actual outcome data to compare predictions
            # For now, return None as we don't have feedback mechanism
            return None
            
        except Exception as e:
            self.logger.warning(f"⚠️ Failed to calculate recent accuracy: {str(e)}")
            return None
    
    def _detect_data_drift(self, db: Session) -> Dict[str, Any]:
        """Detect data drift in training features"""
        try:
            # Get recent data changes
            recent_changes = self._get_recent_data_changes(days=14)
            
            # Count significant changes by type
            nilai_changes = len([c for c in recent_changes if c["change_type"] == "nilai"])
            presensi_changes = len([c for c in recent_changes if c["change_type"] == "presensi"])
            penghasilan_changes = len([c for c in recent_changes if c["change_type"] == "penghasilan"])
            
            total_changes = nilai_changes + presensi_changes + penghasilan_changes
            
            # Simple drift detection based on change volume
            has_drift = total_changes > 20  # Threshold for drift detection
            
            drift_details = []
            if nilai_changes > 10:
                drift_details.append(f"{nilai_changes} nilai changes")
            if presensi_changes > 8:
                drift_details.append(f"{presensi_changes} presensi changes")
            if penghasilan_changes > 5:
                drift_details.append(f"{penghasilan_changes} penghasilan changes")
            
            return {
                "has_drift": has_drift,
                "total_changes": total_changes,
                "details": ", ".join(drift_details) if drift_details else "No significant drift",
                "breakdown": {
                    "nilai": nilai_changes,
                    "presensi": presensi_changes,
                    "penghasilan": penghasilan_changes
                }
            }
            
        except Exception as e:
            self.logger.warning(f"⚠️ Failed to detect data drift: {str(e)}")
            return {
                "has_drift": False,
                "details": f"Drift detection error: {str(e)}"
            }


# Global instance
model_accuracy_manager = ModelAccuracyManager() 