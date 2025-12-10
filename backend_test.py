import requests
import sys
import json
import os
from datetime import datetime
import tempfile

class StudyBroAPITester:
    def __init__(self, base_url="https://studybro-ai.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        if files:
            # Remove Content-Type for file uploads
            headers.pop('Content-Type', None)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, headers=headers)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "",
            200
        )
        return success

    def test_register(self, email, password, name):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            201,
            data={"email": email, "password": password, "name": name}
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            return True
        return False

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            return True
        return False

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        success, response = self.run_test(
            "Login Invalid Credentials",
            "POST",
            "auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpassword"}
        )
        return success

    def test_upload_pdf_without_auth(self):
        """Test PDF upload without authentication"""
        # Create a simple test PDF content
        test_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF"
        
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Upload PDF Without Auth",
            "POST",
            "notes/upload",
            401,
            data={"note_type": "general"},
            files={"file": ("test.pdf", test_content, "application/pdf")}
        )
        
        # Restore token
        self.token = temp_token
        return success

    def test_upload_pdf(self, note_type="general"):
        """Test PDF upload with authentication"""
        # Create a simple test PDF with some text content
        test_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test PDF Content) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF"""
        
        success, response = self.run_test(
            f"Upload PDF ({note_type})",
            "POST",
            "notes/upload",
            201,
            data={"note_type": note_type},
            files={"file": ("test_document.pdf", test_content, "application/pdf")}
        )
        
        if success and 'note' in response:
            return response['note']['id']
        return None

    def test_upload_non_pdf(self):
        """Test uploading non-PDF file"""
        success, response = self.run_test(
            "Upload Non-PDF File",
            "POST",
            "notes/upload",
            400,
            data={"note_type": "general"},
            files={"file": ("test.txt", b"This is a text file", "text/plain")}
        )
        return success

    def test_get_notes(self):
        """Test getting user's notes"""
        success, response = self.run_test(
            "Get Notes List",
            "GET",
            "notes",
            200
        )
        
        if success and 'notes' in response:
            return response['notes']
        return []

    def test_get_notes_without_auth(self):
        """Test getting notes without authentication"""
        temp_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Get Notes Without Auth",
            "GET",
            "notes",
            401
        )
        
        self.token = temp_token
        return success

    def test_get_single_note(self, note_id):
        """Test getting a single note"""
        success, response = self.run_test(
            "Get Single Note",
            "GET",
            f"notes/{note_id}",
            200
        )
        
        if success and 'note' in response:
            return response['note']
        return None

    def test_get_nonexistent_note(self):
        """Test getting a non-existent note"""
        success, response = self.run_test(
            "Get Non-existent Note",
            "GET",
            "notes/nonexistent-id",
            404
        )
        return success

    def test_export_note(self, note_id):
        """Test exporting a note"""
        url = f"{self.base_url}/notes/{note_id}/export?format=txt"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        print(f"\n🔍 Testing Export Note...")
        print(f"   URL: {url}")
        
        try:
            response = requests.get(url, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.log_test("Export Note", True)
                return True
            else:
                self.log_test("Export Note", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Export Note", False, f"Exception: {str(e)}")
            return False

    def test_delete_note(self, note_id):
        """Test deleting a note"""
        success, response = self.run_test(
            "Delete Note",
            "DELETE",
            f"notes/{note_id}",
            200
        )
        return success

    def test_delete_nonexistent_note(self):
        """Test deleting a non-existent note"""
        success, response = self.run_test(
            "Delete Non-existent Note",
            "DELETE",
            "notes/nonexistent-id",
            404
        )
        return success

    def run_comprehensive_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting StudyBro API Comprehensive Tests")
        print("=" * 60)
        
        # Test 1: Health Check
        if not self.test_health_check():
            print("❌ API is not responding. Stopping tests.")
            return False
        
        # Test 2: User Registration
        test_email = f"test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"
        test_password = "TestPass123!"
        test_name = "Test User"
        
        if not self.test_register(test_email, test_password, test_name):
            print("❌ Registration failed. Stopping tests.")
            return False
        
        # Test 3: Authentication Tests
        self.test_login_invalid_credentials()
        
        # Test 4: Login with valid credentials
        # Clear token first to test login
        self.token = None
        if not self.test_login(test_email, test_password):
            print("❌ Login failed. Stopping tests.")
            return False
        
        # Test 5: Upload Tests
        self.test_upload_pdf_without_auth()
        self.test_upload_non_pdf()
        
        # Test 6: Upload valid PDFs
        general_note_id = self.test_upload_pdf("general")
        question_paper_note_id = self.test_upload_pdf("question_paper")
        
        if not general_note_id:
            print("❌ PDF upload failed. Stopping tests.")
            return False
        
        # Test 7: Notes Retrieval Tests
        self.test_get_notes_without_auth()
        notes = self.test_get_notes()
        
        if not notes:
            print("❌ No notes found after upload.")
            return False
        
        # Test 8: Single Note Tests
        note = self.test_get_single_note(general_note_id)
        self.test_get_nonexistent_note()
        
        # Test 9: Export Tests
        if note:
            self.test_export_note(general_note_id)
        
        # Test 10: Delete Tests
        self.test_delete_nonexistent_note()
        if question_paper_note_id:
            self.test_delete_note(question_paper_note_id)
        
        return True

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_run - self.tests_passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = StudyBroAPITester()
    
    try:
        success = tester.run_comprehensive_tests()
        all_passed = tester.print_summary()
        
        return 0 if all_passed else 1
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        tester.print_summary()
        return 1
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {str(e)}")
        tester.print_summary()
        return 1

if __name__ == "__main__":
    sys.exit(main())