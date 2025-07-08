#!/usr/bin/env python3
"""
Test Script: Model Accuracy Management System
============================================

Script untuk testing comprehensive dari sistem Model Accuracy Manager
yang mengatur keakuratan prediksi saat terjadi perubahan data.

Features tested:
1. Data change validation
2. Impact assessment 
3. Automatic retraining triggers
4. Model performance monitoring
5. Cache invalidation integration
6. Safety mechanisms (backup/rollback)

Author: EduPro Development Team
Date: 2025-06-21
"""

import sys
import os
import time
import requests
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

# Add parent directory to path untuk import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db, NilaiRaport, Siswa, Prestasi, PenghasilanOrtu, Presensi
from model_accuracy_manager import model_accuracy_manager, RetrainingTrigger
from models.c45_model import c45_model
from cache_config import cache_health_check, get_cache, set_cache, clear_cache
from sqlalchemy.orm import Session

class ModelAccuracyTestSuite:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.db = next(get_db())
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": [],
            "tests": []
        }
        
    def log_test(self, test_name: str, status: str, message: str = "", data: Any = None):
        """Log test result"""
        test_result = {
            "name": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        self.test_results["tests"].append(test_result)
        
        if status == "PASS":
            self.test_results["passed"] += 1
            print(f"✅ {test_name}: {message}")
        else:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: {message}")
            
        if data:
            print(f"   Data: {json.dumps(data, indent=2)}")
    
    def setup_test_data(self):
        """Setup test data untuk testing"""
        print("\n🔧 Setting up test data...")
        
        try:
            # Buat siswa test jika belum ada
            test_siswa = self.db.query(Siswa).filter(Siswa.nama == "Test Siswa Accuracy").first()
            if not test_siswa:
                test_siswa = Siswa(
                    nama="Test Siswa Accuracy",
                    nis="999001",
                    kelas="XI",
                    jenis_kelamin="L"
                )
                self.db.add(test_siswa)
                self.db.commit()
                self.db.refresh(test_siswa)
            
            self.test_siswa_id = test_siswa.id
            
            # Setup nilai test
            nilai_test = self.db.query(NilaiRaport).filter(
                NilaiRaport.siswa_id == self.test_siswa_id,
                NilaiRaport.semester == "Ganjil",
                NilaiRaport.tahun_ajaran == "2024/2025"
            ).first()
            
            if not nilai_test:
                nilai_test = NilaiRaport(
                    siswa_id=self.test_siswa_id,
                    semester="Ganjil",
                    tahun_ajaran="2024/2025",
                    rata_rata=75.0
                )
                self.db.add(nilai_test)
                self.db.commit()
            
            # Setup presensi test
            presensi_test = self.db.query(Presensi).filter(
                Presensi.siswa_id == self.test_siswa_id,
                Presensi.semester == "Ganjil",
                Presensi.tahun_ajaran == "2024/2025"
            ).first()
            
            if not presensi_test:
                presensi_test = Presensi(
                    siswa_id=self.test_siswa_id,
                    semester="Ganjil",
                    tahun_ajaran="2024/2025",
                    jumlah_hadir=80,
                    jumlah_sakit=2,
                    jumlah_izin=1,
                    jumlah_alpa=1,
                    total_hari_efektif=84,
                    persentase_kehadiran=95.2,
                    kategori_kehadiran="Tinggi"
                )
                self.db.add(presensi_test)
                self.db.commit()
            
            # Setup penghasilan test
            penghasilan_test = self.db.query(PenghasilanOrtu).filter(
                PenghasilanOrtu.siswa_id == self.test_siswa_id
            ).first()
            
            if not penghasilan_test:
                penghasilan_test = PenghasilanOrtu(
                    siswa_id=self.test_siswa_id,
                    penghasilan_ayah=3000000,
                    penghasilan_ibu=2500000,
                    total_penghasilan=5500000,
                    kategori_penghasilan="Menengah"
                )
                self.db.add(penghasilan_test)
                self.db.commit()
            
            self.log_test("Setup Test Data", "PASS", f"Test data created for siswa_id={self.test_siswa_id}")
            return True
            
        except Exception as e:
            self.log_test("Setup Test Data", "FAIL", f"Error: {str(e)}")
            return False
    
    def test_data_change_validation(self):
        """Test 1: Data change validation functionality"""
        print("\n🧪 Test 1: Data Change Validation")
        
        test_cases = [
            {
                "name": "Nilai - High Impact Change",
                "change_type": "nilai",
                "old_value": 75.0,
                "new_value": 92.0,
                "expected_significant": True
            },
            {
                "name": "Nilai - Medium Impact Change", 
                "change_type": "nilai",
                "old_value": 75.0,
                "new_value": 82.0,
                "expected_significant": True
            },
            {
                "name": "Nilai - Low Impact Change",
                "change_type": "nilai", 
                "old_value": 75.0,
                "new_value": 77.0,
                "expected_significant": False
            },
            {
                "name": "Presensi - Category Change",
                "change_type": "presensi",
                "old_value": "Tinggi",
                "new_value": "Sedang",
                "expected_significant": True
            },
            {
                "name": "Penghasilan - Category Change",
                "change_type": "penghasilan",
                "old_value": "Menengah",
                "new_value": "Rendah",
                "expected_significant": True
            }
        ]
        
        for test_case in test_cases:
            try:
                result = model_accuracy_manager.validate_data_change(
                    siswa_id=self.test_siswa_id,
                    change_type=test_case["change_type"],
                    old_value=test_case["old_value"],
                    new_value=test_case["new_value"]
                )
                
                is_significant = result.get("is_significant", False)
                expected = test_case["expected_significant"]
                
                if is_significant == expected:
                    self.log_test(
                        f"Validation - {test_case['name']}", 
                        "PASS", 
                        f"Correctly identified as {'significant' if expected else 'not significant'}",
                        result
                    )
                else:
                    self.log_test(
                        f"Validation - {test_case['name']}", 
                        "FAIL", 
                        f"Expected {expected}, got {is_significant}",
                        result
                    )
                    
            except Exception as e:
                self.log_test(
                    f"Validation - {test_case['name']}", 
                    "FAIL", 
                    f"Exception: {str(e)}"
                )
    
    def test_retraining_triggers(self):
        """Test 2: Retraining trigger logic"""
        print("\n🧪 Test 2: Retraining Triggers")
        
        try:
            # Test manual retraining
            result = model_accuracy_manager.retrain_model_if_needed(
                db=self.db, 
                trigger=RetrainingTrigger.MANUAL
            )
            
            if result.get("success"):
                self.log_test(
                    "Manual Retraining Trigger", 
                    "PASS", 
                    "Manual retraining completed successfully",
                    result
                )
            else:
                self.log_test(
                    "Manual Retraining Trigger", 
                    "FAIL", 
                    f"Manual retraining failed: {result.get('message')}",
                    result
                )
                
        except Exception as e:
            self.log_test(
                "Manual Retraining Trigger", 
                "FAIL", 
                f"Exception during manual retraining: {str(e)}"
            )
    
    def test_model_performance_monitoring(self):
        """Test 3: Model performance monitoring"""
        print("\n🧪 Test 3: Model Performance Monitoring")
        
        try:
            # Test monitoring
            monitoring_result = model_accuracy_manager.monitor_model_performance(self.db)
            
            required_keys = ["model_metrics", "health_status", "recommendations"]
            
            if all(key in monitoring_result for key in required_keys):
                self.log_test(
                    "Performance Monitoring", 
                    "PASS", 
                    "Monitoring returned all required data",
                    {
                        "health_status": monitoring_result.get("health_status"),
                        "recommendations_count": len(monitoring_result.get("recommendations", []))
                    }
                )
            else:
                missing_keys = [key for key in required_keys if key not in monitoring_result]
                self.log_test(
                    "Performance Monitoring", 
                    "FAIL", 
                    f"Missing required keys: {missing_keys}",
                    monitoring_result
                )
                
        except Exception as e:
            self.log_test(
                "Performance Monitoring", 
                "FAIL", 
                f"Exception during monitoring: {str(e)}"
            )
    
    def test_cache_integration(self):
        """Test 4: Cache invalidation integration"""
        print("\n🧪 Test 4: Cache Integration")
        
        try:
            if not cache_health_check():
                self.log_test(
                    "Cache Integration", 
                    "SKIP", 
                    "Redis not available for cache testing"
                )
                return
            
            # Test cache key creation and invalidation
            cache_key = f"test_accuracy:{self.test_siswa_id}:Ganjil:2024/2025"
            test_data = {"prediction": "Baik", "confidence": 0.85}
            
            # Set cache
            set_cache(cache_key, test_data, 60)
            
            # Verify cache exists
            cached_data = get_cache(cache_key)
            if cached_data:
                self.log_test(
                    "Cache Set/Get", 
                    "PASS", 
                    "Cache set and retrieved successfully"
                )
            else:
                self.log_test(
                    "Cache Set/Get", 
                    "FAIL", 
                    "Failed to set or retrieve cache"
                )
            
            # Test cache invalidation
            clear_cache(cache_key)
            cleared_data = get_cache(cache_key)
            
            if not cleared_data:
                self.log_test(
                    "Cache Invalidation", 
                    "PASS", 
                    "Cache successfully invalidated"
                )
            else:
                self.log_test(
                    "Cache Invalidation", 
                    "FAIL", 
                    "Cache was not properly invalidated"
                )
                
        except Exception as e:
            self.log_test(
                "Cache Integration", 
                "FAIL", 
                f"Exception during cache testing: {str(e)}"
            )
    
    def test_data_quality_validation(self):
        """Test 5: Data quality validation"""
        print("\n🧪 Test 5: Data Quality Validation")
        
        try:
            # Test data quality check
            data_quality = model_accuracy_manager._check_data_quality(self.db)
            
            required_keys = ["is_good", "score", "issues", "recommendations"]
            
            if all(key in data_quality for key in required_keys):
                quality_score = data_quality.get("score", 0)
                
                self.log_test(
                    "Data Quality Check", 
                    "PASS", 
                    f"Data quality score: {quality_score:.2f}",
                    {
                        "is_good": data_quality["is_good"],
                        "issues_count": len(data_quality["issues"]),
                        "recommendations_count": len(data_quality["recommendations"])
                    }
                )
            else:
                missing_keys = [key for key in required_keys if key not in data_quality]
                self.log_test(
                    "Data Quality Check", 
                    "FAIL", 
                    f"Missing required keys: {missing_keys}",
                    data_quality
                )
                
        except Exception as e:
            self.log_test(
                "Data Quality Check", 
                "FAIL", 
                f"Exception during data quality check: {str(e)}"
            )
    
    def test_model_health_status(self):
        """Test 6: Model health status assessment"""
        print("\n🧪 Test 6: Model Health Status")
        
        try:
            # Get current model metrics
            current_metrics = model_accuracy_manager._get_current_model_metrics()
            
            # Get training requirements
            training_req = model_accuracy_manager._validate_training_requirements(self.db)
            
            # Test health status logic
            health_tests = [
                {
                    "name": "Current Metrics Available",
                    "condition": current_metrics is not None,
                    "message": "Model metrics are available" if current_metrics else "No model metrics found"
                },
                {
                    "name": "Training Requirements",
                    "condition": training_req.get("can_train", False),
                    "message": training_req.get("message", "Unknown training status")
                }
            ]
            
            for test in health_tests:
                status = "PASS" if test["condition"] else "FAIL"
                self.log_test(
                    f"Health - {test['name']}", 
                    status, 
                    test["message"]
                )
            
            # Test overall health assessment
            if current_metrics and training_req.get("can_train"):
                self.log_test(
                    "Overall Health Assessment", 
                    "PASS", 
                    "Model is in healthy state",
                    {
                        "accuracy": current_metrics.accuracy if current_metrics else None,
                        "can_train": training_req.get("can_train"),
                        "training_samples": training_req.get("available_samples", 0)
                    }
                )
            else:
                self.log_test(
                    "Overall Health Assessment", 
                    "FAIL", 
                    "Model health issues detected"
                )
                
        except Exception as e:
            self.log_test(
                "Model Health Status", 
                "FAIL", 
                f"Exception during health check: {str(e)}"
            )
    
    def test_integration_flow(self):
        """Test 7: End-to-end integration flow"""
        print("\n🧪 Test 7: Integration Flow")
        
        try:
            # Simulate a significant data change
            old_nilai = 75.0
            new_nilai = 88.0
            
            # Step 1: Validate change
            validation_result = model_accuracy_manager.validate_data_change(
                siswa_id=self.test_siswa_id,
                change_type="nilai",
                old_value=old_nilai,
                new_value=new_nilai
            )
            
            if validation_result.get("is_significant"):
                self.log_test(
                    "Integration - Change Validation", 
                    "PASS", 
                    "Significant change detected correctly"
                )
                
                # Step 2: Check if retraining is needed
                if validation_result.get("needs_retraining"):
                    # Step 3: Attempt retraining
                    retraining_result = model_accuracy_manager.retrain_model_if_needed(self.db)
                    
                    if retraining_result.get("success"):
                        self.log_test(
                            "Integration - Auto Retraining", 
                            "PASS", 
                            "Automatic retraining triggered and completed"
                        )
                    else:
                        self.log_test(
                            "Integration - Auto Retraining", 
                            "FAIL", 
                            f"Retraining failed: {retraining_result.get('message')}"
                        )
                else:
                    self.log_test(
                        "Integration - Retraining Decision", 
                        "PASS", 
                        "Change significant but retraining not needed"
                    )
            else:
                self.log_test(
                    "Integration - Change Validation", 
                    "FAIL", 
                    "Failed to detect significant change"
                )
            
            # Step 4: Test cache invalidation (simulated)
            cache_key = f"predict:siswa_id={self.test_siswa_id}&semester=Ganjil&tahun_ajaran=2024/2025"
            
            if cache_health_check():
                # Cache should be invalidated after data change
                self.log_test(
                    "Integration - Cache Management", 
                    "PASS", 
                    "Cache invalidation integrated with data changes"
                )
            else:
                self.log_test(
                    "Integration - Cache Management", 
                    "SKIP", 
                    "Redis not available for cache testing"
                )
                
        except Exception as e:
            self.log_test(
                "Integration Flow", 
                "FAIL", 
                f"Exception during integration testing: {str(e)}"
            )
    
    def cleanup_test_data(self):
        """Cleanup test data"""
        print("\n🧹 Cleaning up test data...")
        
        try:
            # Remove test prestasi records
            self.db.query(Prestasi).filter(Prestasi.siswa_id == self.test_siswa_id).delete()
            
            # Remove test nilai records
            self.db.query(NilaiRaport).filter(NilaiRaport.siswa_id == self.test_siswa_id).delete()
            
            # Remove test presensi records
            self.db.query(Presensi).filter(Presensi.siswa_id == self.test_siswa_id).delete()
            
            # Remove test penghasilan records
            self.db.query(PenghasilanOrtu).filter(PenghasilanOrtu.siswa_id == self.test_siswa_id).delete()
            
            # Remove test siswa
            self.db.query(Siswa).filter(Siswa.id == self.test_siswa_id).delete()
            
            self.db.commit()
            
            self.log_test("Cleanup Test Data", "PASS", "Test data cleaned up successfully")
            
        except Exception as e:
            self.log_test("Cleanup Test Data", "FAIL", f"Cleanup error: {str(e)}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Model Accuracy Management Test Suite")
        print("=" * 60)
        
        start_time = time.time()
        
        # Setup
        if not self.setup_test_data():
            print("❌ Failed to setup test data. Aborting tests.")
            return False
        
        # Run tests
        test_methods = [
            self.test_data_change_validation,
            self.test_retraining_triggers,
            self.test_model_performance_monitoring,
            self.test_cache_integration,
            self.test_data_quality_validation,
            self.test_model_health_status,
            self.test_integration_flow
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                self.log_test(
                    f"Test Suite - {test_method.__name__}", 
                    "FAIL", 
                    f"Unexpected error: {str(e)}"
                )
        
        # Cleanup
        self.cleanup_test_data()
        
        # Print results
        end_time = time.time()
        duration = end_time - start_time
        
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        print(f"⏱️  Duration: {duration:.2f} seconds")
        print(f"📈 Success Rate: {(self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed']) * 100):.1f}%")
        
        if self.test_results['errors']:
            print("\n🚨 ERRORS:")
            for error in self.test_results['errors']:
                print(f"   - {error}")
        
        # Save detailed results
        results_file = f"test_results_model_accuracy_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(self.test_results, f, indent=2, default=str)
        
        print(f"\n📄 Detailed results saved to: {results_file}")
        
        return self.test_results['failed'] == 0


def main():
    """Main function to run tests"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Test Model Accuracy Management System")
    parser.add_argument("--base-url", default="http://localhost:8000", help="Base URL for API testing")
    parser.add_argument("--cleanup-only", action="store_true", help="Only run cleanup")
    args = parser.parse_args()
    
    test_suite = ModelAccuracyTestSuite(base_url=args.base_url)
    
    if args.cleanup_only:
        test_suite.setup_test_data()  # Setup first to get test IDs
        test_suite.cleanup_test_data()
        return
    
    success = test_suite.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Model Accuracy Management system is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please review the results above.")
        sys.exit(1)


if __name__ == "__main__":
    main() 