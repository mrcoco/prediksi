#!/usr/bin/env python3
"""
Performance Testing Script for Caching Implementation
==================================================

Script ini digunakan untuk mengukur peningkatan performa setelah 
implementasi caching pada function predict_prestasi.

Usage:
    python scripts/test_caching_performance.py

Requirements:
    - Backend server running on localhost:8000
    - Valid JWT token
    - Test data available in database
"""

import requests
import time  
import json
import statistics
from typing import List, Dict, Any

class CachingPerformanceTest:
    def __init__(self, base_url: str = "http://localhost:8000", token: str = None):
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}" if token else ""
        }
        self.results = []
    
    def login(self, username: str = "admin", password: str = "admin123") -> str:
        """Login dan dapatkan JWT token"""
        login_data = {
            "username": username,
            "password": password
        }
        
        response = requests.post(f"{self.base_url}/api/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json()["access_token"]
            self.headers["Authorization"] = f"Bearer {token}"
            print(f"✅ Login successful, token obtained")
            return token
        else:
            print(f"❌ Login failed: {response.text}")
            return None
    
    def test_single_prediction(self, siswa_id: int, semester: str, tahun_ajaran: str, iterations: int = 10) -> Dict[str, Any]:
        """Test performance untuk single prediction"""
        print(f"\n🧪 Testing Single Prediction Performance (siswa_id={siswa_id})")
        print(f"   Iterations: {iterations}")
        
        prediction_data = {
            "siswa_id": siswa_id,
            "semester": semester,
            "tahun_ajaran": tahun_ajaran
        }
        
        # Test without cache (first request)
        print("   Testing without cache...")
        start_time = time.time()
        response = requests.post(f"{self.base_url}/api/prediksi/?use_cache=false", 
                               json=prediction_data, headers=self.headers)
        no_cache_time = time.time() - start_time
        
        if response.status_code != 200:
            print(f"   ❌ Error: {response.text}")
            return None
        
        print(f"   Without cache: {no_cache_time:.3f}s")
        
        # Test with cache (multiple requests)
        print("   Testing with cache...")
        cache_times = []
        
        for i in range(iterations):
            start_time = time.time()
            response = requests.post(f"{self.base_url}/api/prediksi/?use_cache=true", 
                                   json=prediction_data, headers=self.headers)
            cache_time = time.time() - start_time
            cache_times.append(cache_time)
            
            if response.status_code != 200:
                print(f"   ❌ Error on iteration {i+1}: {response.text}")
                continue
        
        avg_cache_time = statistics.mean(cache_times)
        min_cache_time = min(cache_times)
        max_cache_time = max(cache_times)
        
        improvement = ((no_cache_time - avg_cache_time) / no_cache_time) * 100
        speedup = no_cache_time / avg_cache_time
        
        result = {
            "test_type": "single_prediction",
            "siswa_id": siswa_id,
            "iterations": iterations,
            "no_cache_time": no_cache_time,
            "avg_cache_time": avg_cache_time,
            "min_cache_time": min_cache_time,
            "max_cache_time": max_cache_time,
            "improvement_percentage": improvement,
            "speedup_factor": speedup
        }
        
        print(f"   Results:")
        print(f"   - Average with cache: {avg_cache_time:.3f}s")
        print(f"   - Min with cache: {min_cache_time:.3f}s")
        print(f"   - Max with cache: {max_cache_time:.3f}s")
        print(f"   - Performance improvement: {improvement:.1f}%")
        print(f"   - Speedup factor: {speedup:.1f}x")
        
        return result
    
    def test_batch_prediction(self, semester: str, tahun_ajaran: str, iterations: int = 3) -> Dict[str, Any]:
        """Test performance untuk batch prediction"""
        print(f"\n🧪 Testing Batch Prediction Performance")
        print(f"   Semester: {semester}, Tahun Ajaran: {tahun_ajaran}")
        print(f"   Iterations: {iterations}")
        
        batch_data = {
            "semester": semester,
            "tahun_ajaran": tahun_ajaran
        }
        
        # Test without cache (first request)
        print("   Testing without cache...")
        start_time = time.time()
        response = requests.post(f"{self.base_url}/api/prediksi/batch?use_cache=false", 
                               json=batch_data, headers=self.headers)
        no_cache_time = time.time() - start_time
        
        if response.status_code != 200:
            print(f"   ❌ Error: {response.text}")
            return None
        
        batch_result = response.json()
        total_students = batch_result.get('summary', {}).get('total_siswa', 0)
        success_count = batch_result.get('summary', {}).get('success_count', 0)
        
        print(f"   Without cache: {no_cache_time:.3f}s ({total_students} students processed)")
        
        # Test with cache (multiple requests)
        print("   Testing with cache...")
        cache_times = []
        
        for i in range(iterations):
            start_time = time.time()
            response = requests.post(f"{self.base_url}/api/prediksi/batch?use_cache=true", 
                                   json=batch_data, headers=self.headers)
            cache_time = time.time() - start_time
            cache_times.append(cache_time)
            
            if response.status_code != 200:
                print(f"   ❌ Error on iteration {i+1}: {response.text}")
                continue
        
        avg_cache_time = statistics.mean(cache_times)
        min_cache_time = min(cache_times)
        max_cache_time = max(cache_times)
        
        improvement = ((no_cache_time - avg_cache_time) / no_cache_time) * 100
        speedup = no_cache_time / avg_cache_time
        
        result = {
            "test_type": "batch_prediction",
            "semester": semester,
            "tahun_ajaran": tahun_ajaran,
            "total_students": total_students,
            "success_count": success_count,
            "iterations": iterations,
            "no_cache_time": no_cache_time,
            "avg_cache_time": avg_cache_time,
            "min_cache_time": min_cache_time,
            "max_cache_time": max_cache_time,
            "improvement_percentage": improvement,
            "speedup_factor": speedup
        }
        
        print(f"   Results:")
        print(f"   - Average with cache: {avg_cache_time:.3f}s")
        print(f"   - Min with cache: {min_cache_time:.3f}s")
        print(f"   - Max with cache: {max_cache_time:.3f}s")
        print(f"   - Performance improvement: {improvement:.1f}%")
        print(f"   - Speedup factor: {speedup:.1f}x")
        
        return result
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        response = requests.get(f"{self.base_url}/api/cache/stats", headers=self.headers)
        if response.status_code == 200:
            return response.json()["data"]
        return {}
    
    def clear_cache(self):
        """Clear prediction cache"""
        response = requests.post(f"{self.base_url}/api/prediksi/cache/clear", headers=self.headers)
        if response.status_code == 200:
            print("✅ Cache cleared successfully")
        else:
            print(f"❌ Failed to clear cache: {response.text}")
    
    def run_full_test(self):
        """Run complete performance test suite"""
        print("🚀 Starting Caching Performance Test Suite")
        print("=" * 50)
        
        # Clear cache before testing
        self.clear_cache()
        
        # Test single prediction
        single_result = self.test_single_prediction(
            siswa_id=1, 
            semester="Ganjil", 
            tahun_ajaran="2024/2025",
            iterations=10
        )
        if single_result:
            self.results.append(single_result)
        
        # Test batch prediction  
        batch_result = self.test_batch_prediction(
            semester="Ganjil",
            tahun_ajaran="2024/2025", 
            iterations=3
        )
        if batch_result:
            self.results.append(batch_result)
        
        # Get cache statistics
        print(f"\n📊 Final Cache Statistics:")
        cache_stats = self.get_cache_stats()
        for key, value in cache_stats.items():
            print(f"   {key}: {value}")
        
        # Summary
        print(f"\n📝 Test Summary:")
        print("=" * 50)
        
        for result in self.results:
            test_type = result["test_type"]
            improvement = result["improvement_percentage"]
            speedup = result["speedup_factor"]
            
            print(f"   {test_type.replace('_', ' ').title()}:")
            print(f"   - Performance improvement: {improvement:.1f}%")
            print(f"   - Speedup factor: {speedup:.1f}x")
            print()
        
        # Save results to file
        self.save_results()
        
        print("✅ Performance test completed successfully!")
    
    def save_results(self, filename: str = "caching_performance_results.json"):
        """Save test results to JSON file"""
        with open(filename, 'w') as f:
            json.dump({
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "results": self.results,
                "cache_stats": self.get_cache_stats()
            }, f, indent=2)
        print(f"📁 Results saved to {filename}")


def main():
    """Main function"""
    print("🎯 EduPro Caching Performance Test")
    print("=" * 50)
    
    # Initialize test
    tester = CachingPerformanceTest()
    
    # Login
    token = tester.login()
    if not token:
        print("❌ Cannot proceed without authentication")
        return
    
    # Run tests
    tester.run_full_test()


if __name__ == "__main__":
    main() 