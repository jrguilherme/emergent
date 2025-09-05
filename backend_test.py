#!/usr/bin/env python3
"""
Backend API Testing for Mensura Maat Contact Form
Tests all contact form endpoints and functionality
"""

import requests
import json
import time
from datetime import datetime
import uuid

# Configuration
BASE_URL = "https://mensuramaat-next.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ContactFormTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name, passed, details=""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
        print()

    def test_api_health(self):
        """Test if API is accessible"""
        try:
            response = requests.get(f"{BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test("API Health Check", True, f"API is online: {data.get('message', 'No message')}")
                return True
            else:
                self.log_test("API Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_create_contact_valid_all_fields(self):
        """Test POST /api/contacts with all valid fields"""
        contact_data = {
            "name": "João Silva",
            "email": "joao.silva@email.com",
            "phone": "(11) 99999-9999",
            "service": "Consultoria Empresarial",
            "message": "Gostaria de saber mais sobre os serviços de consultoria para minha empresa. Preciso de ajuda com planejamento estratégico."
        }
        
        try:
            response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("contact_id"):
                    self.log_test("Create Contact - All Fields Valid", True, f"Contact created with ID: {data.get('contact_id')}")
                    return data.get("contact_id")
                else:
                    self.log_test("Create Contact - All Fields Valid", False, f"Invalid response format: {data}")
            else:
                self.log_test("Create Contact - All Fields Valid", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Create Contact - All Fields Valid", False, f"Request error: {str(e)}")
        
        return None

    def test_create_contact_required_fields_only(self):
        """Test POST /api/contacts with only required fields"""
        contact_data = {
            "name": "Maria Santos",
            "email": "maria.santos@email.com",
            "message": "Mensagem de teste com apenas os campos obrigatórios preenchidos para validar a funcionalidade."
        }
        
        try:
            response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("contact_id"):
                    self.log_test("Create Contact - Required Fields Only", True, f"Contact created with ID: {data.get('contact_id')}")
                    return True
                else:
                    self.log_test("Create Contact - Required Fields Only", False, f"Invalid response format: {data}")
            else:
                self.log_test("Create Contact - Required Fields Only", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Create Contact - Required Fields Only", False, f"Request error: {str(e)}")
        
        return False

    def test_invalid_email_format(self):
        """Test POST /api/contacts with invalid email format"""
        contact_data = {
            "name": "Pedro Oliveira",
            "email": "email-invalido",
            "message": "Esta é uma mensagem de teste para validar email inválido."
        }
        
        try:
            response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
            
            if response.status_code == 422:  # Validation error
                self.log_test("Invalid Email Format Validation", True, "Correctly rejected invalid email")
                return True
            elif response.status_code == 400:
                self.log_test("Invalid Email Format Validation", True, "Correctly rejected invalid email (400)")
                return True
            else:
                self.log_test("Invalid Email Format Validation", False, f"Expected 422/400, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Invalid Email Format Validation", False, f"Request error: {str(e)}")
        
        return False

    def test_missing_required_fields(self):
        """Test POST /api/contacts with missing required fields"""
        test_cases = [
            {"email": "test@email.com", "message": "Teste sem nome"},
            {"name": "Teste", "message": "Teste sem email"},
            {"name": "Teste", "email": "test@email.com"}
        ]
        
        all_passed = True
        
        for i, contact_data in enumerate(test_cases):
            try:
                response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
                
                if response.status_code in [400, 422]:
                    print(f"   ✅ Test case {i+1}: Correctly rejected missing field")
                else:
                    print(f"   ❌ Test case {i+1}: Expected 400/422, got {response.status_code}")
                    all_passed = False
            except Exception as e:
                print(f"   ❌ Test case {i+1}: Request error: {str(e)}")
                all_passed = False
        
        self.log_test("Missing Required Fields Validation", all_passed, f"Tested {len(test_cases)} cases")
        return all_passed

    def test_empty_whitespace_validation(self):
        """Test validation for empty/whitespace name and message"""
        test_cases = [
            {"name": "   ", "email": "test@email.com", "message": "Valid message"},
            {"name": "Valid Name", "email": "test@email.com", "message": "   "},
            {"name": "", "email": "test@email.com", "message": "Valid message"}
        ]
        
        all_passed = True
        
        for i, contact_data in enumerate(test_cases):
            try:
                response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
                
                if response.status_code in [400, 422]:
                    print(f"   ✅ Test case {i+1}: Correctly rejected empty/whitespace")
                else:
                    print(f"   ❌ Test case {i+1}: Expected 400/422, got {response.status_code}")
                    all_passed = False
            except Exception as e:
                print(f"   ❌ Test case {i+1}: Request error: {str(e)}")
                all_passed = False
        
        self.log_test("Empty/Whitespace Validation", all_passed, f"Tested {len(test_cases)} cases")
        return all_passed

    def test_phone_validation(self):
        """Test Brazilian phone number validation"""
        test_cases = [
            {"phone": "(11) 99999-9999", "should_pass": True},
            {"phone": "11999999999", "should_pass": True},
            {"phone": "+55 11 99999-9999", "should_pass": True},
            {"phone": "invalid-phone", "should_pass": False},
            {"phone": "abc123", "should_pass": False}
        ]
        
        all_passed = True
        
        for i, case in enumerate(test_cases):
            contact_data = {
                "name": "Teste Phone",
                "email": "test@email.com",
                "phone": case["phone"],
                "message": "Mensagem de teste para validação de telefone."
            }
            
            try:
                response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
                
                if case["should_pass"]:
                    if response.status_code == 200:
                        print(f"   ✅ Test case {i+1}: Valid phone accepted")
                    else:
                        print(f"   ❌ Test case {i+1}: Valid phone rejected: {response.status_code}")
                        all_passed = False
                else:
                    if response.status_code in [400, 422]:
                        print(f"   ✅ Test case {i+1}: Invalid phone rejected")
                    else:
                        print(f"   ❌ Test case {i+1}: Invalid phone accepted: {response.status_code}")
                        all_passed = False
            except Exception as e:
                print(f"   ❌ Test case {i+1}: Request error: {str(e)}")
                all_passed = False
        
        self.log_test("Phone Number Validation", all_passed, f"Tested {len(test_cases)} cases")
        return all_passed

    def test_message_length_validation(self):
        """Test message length validation (10-1000 chars)"""
        test_cases = [
            {"message": "Curta", "should_pass": False},  # Too short
            {"message": "Esta é uma mensagem válida com mais de 10 caracteres.", "should_pass": True},  # Valid
            {"message": "x" * 1001, "should_pass": False}  # Too long
        ]
        
        all_passed = True
        
        for i, case in enumerate(test_cases):
            contact_data = {
                "name": "Teste Message",
                "email": "test@email.com",
                "message": case["message"]
            }
            
            try:
                response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
                
                if case["should_pass"]:
                    if response.status_code == 200:
                        print(f"   ✅ Test case {i+1}: Valid message length accepted")
                    else:
                        print(f"   ❌ Test case {i+1}: Valid message length rejected: {response.status_code}")
                        all_passed = False
                else:
                    if response.status_code in [400, 422]:
                        print(f"   ✅ Test case {i+1}: Invalid message length rejected")
                    else:
                        print(f"   ❌ Test case {i+1}: Invalid message length accepted: {response.status_code}")
                        all_passed = False
            except Exception as e:
                print(f"   ❌ Test case {i+1}: Request error: {str(e)}")
                all_passed = False
        
        self.log_test("Message Length Validation", all_passed, f"Tested {len(test_cases)} cases")
        return all_passed

    def test_name_length_validation(self):
        """Test name length validation (2-100 chars)"""
        test_cases = [
            {"name": "A", "should_pass": False},  # Too short
            {"name": "João", "should_pass": True},  # Valid
            {"name": "x" * 101, "should_pass": False}  # Too long
        ]
        
        all_passed = True
        
        for i, case in enumerate(test_cases):
            contact_data = {
                "name": case["name"],
                "email": "test@email.com",
                "message": "Esta é uma mensagem válida para teste de nome."
            }
            
            try:
                response = requests.post(f"{BASE_URL}/contacts", json=contact_data, headers=HEADERS, timeout=10)
                
                if case["should_pass"]:
                    if response.status_code == 200:
                        print(f"   ✅ Test case {i+1}: Valid name length accepted")
                    else:
                        print(f"   ❌ Test case {i+1}: Valid name length rejected: {response.status_code}")
                        all_passed = False
                else:
                    if response.status_code in [400, 422]:
                        print(f"   ✅ Test case {i+1}: Invalid name length rejected")
                    else:
                        print(f"   ❌ Test case {i+1}: Invalid name length accepted: {response.status_code}")
                        all_passed = False
            except Exception as e:
                print(f"   ❌ Test case {i+1}: Request error: {str(e)}")
                all_passed = False
        
        self.log_test("Name Length Validation", all_passed, f"Tested {len(test_cases)} cases")
        return all_passed

    def test_get_contacts_list(self):
        """Test GET /api/contacts endpoint"""
        try:
            response = requests.get(f"{BASE_URL}/contacts", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "contacts" in data and "total" in data and data.get("success"):
                    self.log_test("Get Contacts List", True, f"Retrieved {len(data['contacts'])} contacts, total: {data['total']}")
                    return True
                else:
                    self.log_test("Get Contacts List", False, f"Invalid response format: {data}")
            else:
                self.log_test("Get Contacts List", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Get Contacts List", False, f"Request error: {str(e)}")
        
        return False

    def test_get_contacts_pagination(self):
        """Test GET /api/contacts with pagination parameters"""
        try:
            response = requests.get(f"{BASE_URL}/contacts?skip=0&limit=5", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "contacts" in data and len(data["contacts"]) <= 5:
                    self.log_test("Get Contacts Pagination", True, f"Pagination working, got {len(data['contacts'])} contacts")
                    return True
                else:
                    self.log_test("Get Contacts Pagination", False, f"Pagination not working properly: {data}")
            else:
                self.log_test("Get Contacts Pagination", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Get Contacts Pagination", False, f"Request error: {str(e)}")
        
        return False

    def test_get_stats(self):
        """Test GET /api/stats endpoint"""
        try:
            response = requests.get(f"{BASE_URL}/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_contacts", "contacts_this_month", "popular_services"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Get Stats", True, f"Stats: {data['total_contacts']} total, {data['contacts_this_month']} this month")
                    return True
                else:
                    self.log_test("Get Stats", False, f"Missing required fields in response: {data}")
            else:
                self.log_test("Get Stats", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Get Stats", False, f"Request error: {str(e)}")
        
        return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 80)
        print("MENSURA MAAT BACKEND API TESTING")
        print("=" * 80)
        print()
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        print("Running Contact Form Tests...")
        print("-" * 40)
        
        # Test contact creation
        self.test_create_contact_valid_all_fields()
        self.test_create_contact_required_fields_only()
        
        # Test validation
        self.test_invalid_email_format()
        self.test_missing_required_fields()
        self.test_empty_whitespace_validation()
        self.test_phone_validation()
        self.test_message_length_validation()
        self.test_name_length_validation()
        
        # Test admin endpoints
        print("Running Admin Endpoint Tests...")
        print("-" * 40)
        self.test_get_contacts_list()
        self.test_get_contacts_pagination()
        self.test_get_stats()
        
        # Print summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"Passed: {len(self.passed_tests)}")
        print(f"Failed: {len(self.failed_tests)}")
        print()
        
        if self.failed_tests:
            print("FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  ❌ {test}")
            print()
        
        if self.passed_tests:
            print("PASSED TESTS:")
            for test in self.passed_tests:
                print(f"  ✅ {test}")
        
        print("=" * 80)
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = ContactFormTester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed!")
        exit(0)
    else:
        print("💥 Some tests failed!")
        exit(1)