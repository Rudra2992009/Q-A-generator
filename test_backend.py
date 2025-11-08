#!/usr/bin/env python3
"""
Quick Testing Script for CBSE Paper Generator Backend
Run this to test if your Flask backend is working correctly.
"""

import requests
import sys

BASE_URL = 'http://localhost:5000'

def test_health():
    """Test the health check endpoint"""
    print("\nðŸ” Testing health endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/api/health', timeout=5)
        if response.status_code == 200:
            print("âœ… Health check passed!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"âŒ Health check failed with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("âŒ Cannot connect to Flask server!")
        print("   Make sure the server is running: python flask_app.py")
        return False
    except Exception as e:
        print(f"âŒ Error: {e}")
        return False

def test_configure_keys():
    """Test API key configuration"""
    print("\nðŸ” Testing API key configuration...")
    try:
        test_keys = ['test_key_1', 'test_key_2', 'test_key_3']
        response = requests.post(
            f'{BASE_URL}/api/configure-keys',
            json={'api_keys': test_keys},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print("âœ… API key configuration passed!")
                print(f"   Configured {data['key_count']} keys")
                return True
        print(f"âŒ API key configuration failed")
        return False
    except Exception as e:
        print(f"âŒ Error: {e}")
        return False

def test_get_subjects():
    """Test subject retrieval"""
    print("\nðŸ” Testing subject retrieval...")
    try:
        response = requests.get(f'{BASE_URL}/api/get-subjects?class=10', timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print("âœ… Subject retrieval passed!")
                print(f"   Found {len(data['subjects'])} subjects for Class 10")
                print(f"   Subjects: {', '.join(data['subjects'][:3])}...")
                return True
        print(f"âŒ Subject retrieval failed")
        return False
    except Exception as e:
        print(f"âŒ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("CBSE Paper Generator - Backend Testing")
    print("="*60)

    results = []

    # Test 1: Health check
    results.append(('Health Check', test_health()))

    # Test 2: API key configuration
    results.append(('API Key Configuration', test_configure_keys()))

    # Test 3: Subject retrieval
    results.append(('Subject Retrieval', test_get_subjects()))

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)

    for test_name, passed in results:
        status = "âœ… PASSED" if passed else "âŒ FAILED"
        print(f"{test_name:.<40} {status}")

    total = len(results)
    passed = sum(1 for _, p in results if p)

    print("="*60)
    print(f"Total: {passed}/{total} tests passed")

    if passed == total:
        print("\nðŸŽ‰ All tests passed! Your backend is working correctly.")
        print("\nNext steps:")
        print("1. Get real Gemini API keys from https://ai.google.dev/")
        print("2. Open the web application in your browser")
        print("3. Enter your API keys and start generating papers!")
    else:
        print("\nâš ï¸  Some tests failed. Please check:")
        print("1. Is Flask server running? (python flask_app.py)")
        print("2. Is it running on port 5000?")
        print("3. Are all dependencies installed?")
        sys.exit(1)

if __name__ == '__main__':
    main()
