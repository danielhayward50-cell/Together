# ATC Master Platform - Backend API Tests
# Tests for Auth, Dashboard, Leads, Staff, Clients endpoints

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@achievetogethercare.com.au"
ADMIN_PASSWORD = "ATCAdmin2026!"


class TestHealthCheck:
    """Health check and basic API tests"""
    
    def test_api_health(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print(f"✓ Health check passed: {data}")
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        print(f"✓ API root passed: {data}")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful login with admin credentials"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "user" in data
        assert "message" in data
        assert data["message"] == "Login successful"
        
        # Validate user data
        user = data["user"]
        assert user["email"] == ADMIN_EMAIL
        assert user["role"] == "owner"
        assert "user_id" in user
        print(f"✓ Login successful: {user['email']} ({user['role']})")
        
        # Check cookies are set
        assert "access_token" in session.cookies or "refresh_token" in session.cookies
        print("✓ Auth cookies set correctly")
        
        return session
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid login rejected: {data['detail']}")
    
    def test_get_me_authenticated(self):
        """Test /auth/me with authenticated session"""
        # First login
        session = requests.Session()
        login_response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        
        # Then get current user
        me_response = session.get(f"{BASE_URL}/api/auth/me")
        assert me_response.status_code == 200
        
        data = me_response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "owner"
        print(f"✓ /auth/me returned: {data['email']}")
    
    def test_get_me_unauthenticated(self):
        """Test /auth/me without authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ /auth/me correctly rejects unauthenticated requests")
    
    def test_logout(self):
        """Test logout functionality"""
        session = requests.Session()
        
        # Login first
        login_response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        
        # Logout
        logout_response = session.post(f"{BASE_URL}/api/auth/logout")
        assert logout_response.status_code == 200
        data = logout_response.json()
        assert data["message"] == "Logged out successfully"
        print("✓ Logout successful")


class TestDashboard:
    """Dashboard API tests"""
    
    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        
        # Validate response structure
        assert "revenue" in data
        assert "clients" in data
        assert "staff" in data
        assert "compliance" in data
        assert "invoices" in data
        
        # Validate revenue data
        assert "amount" in data["revenue"]
        assert "period" in data["revenue"]
        assert isinstance(data["revenue"]["amount"], (int, float))
        
        # Validate clients data
        assert "total" in data["clients"]
        assert isinstance(data["clients"]["total"], int)
        
        # Validate compliance data
        assert "score" in data["compliance"]
        assert isinstance(data["compliance"]["score"], int)
        
        print(f"✓ Dashboard stats: Revenue=${data['revenue']['amount']}, Clients={data['clients']['total']}, Compliance={data['compliance']['score']}%")
    
    def test_dashboard_kpis(self):
        """Test dashboard KPIs endpoint"""
        response = requests.get(f"{BASE_URL}/api/dashboard/kpis")
        assert response.status_code == 200
        
        data = response.json()
        assert "monthly_revenue" in data
        assert "outreach_roi" in data
        print(f"✓ Dashboard KPIs: Monthly Revenue=${data['monthly_revenue']}")


class TestLeads:
    """CRM Leads API tests"""
    
    def test_get_all_leads(self):
        """Test getting all leads"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 5, "Expected at least 5 seeded leads"
        
        # Validate lead structure
        lead = data[0]
        assert "lead_id" in lead
        assert "name" in lead
        assert "organization" in lead
        assert "email" in lead
        assert "status" in lead
        
        print(f"✓ Got {len(data)} leads")
        for l in data[:3]:
            print(f"  - {l['name']} ({l['organization']}) - {l['status']}")
    
    def test_get_lead_by_id(self):
        """Test getting a specific lead"""
        # First get all leads
        all_leads = requests.get(f"{BASE_URL}/api/leads").json()
        lead_id = all_leads[0]["lead_id"]
        
        # Get specific lead
        response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["lead_id"] == lead_id
        print(f"✓ Got lead: {data['name']}")
    
    def test_create_lead(self):
        """Test creating a new lead"""
        new_lead = {
            "name": "TEST_John Smith",
            "organization": "Test Organization",
            "role": "Test Coordinator",
            "email": "test.john@example.com",
            "phone": "0400 000 000",
            "status": "draft",
            "priority": "high"
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=new_lead)
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == new_lead["name"]
        assert data["email"] == new_lead["email"]
        assert "lead_id" in data
        
        print(f"✓ Created lead: {data['lead_id']}")
        
        # Cleanup - delete the test lead
        delete_response = requests.delete(f"{BASE_URL}/api/leads/{data['lead_id']}")
        assert delete_response.status_code == 200
        print(f"✓ Cleaned up test lead")


class TestStaff:
    """Staff API tests"""
    
    def test_get_all_staff(self):
        """Test getting all staff"""
        response = requests.get(f"{BASE_URL}/api/staff")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1, "Expected at least 1 seeded staff member"
        
        # Validate staff structure
        staff = data[0]
        assert "staff_id" in staff
        assert "name" in staff
        assert "email" in staff
        assert "role" in staff
        
        print(f"✓ Got {len(data)} staff members")
        for s in data:
            print(f"  - {s['name']} ({s['role']})")
    
    def test_get_staff_by_id(self):
        """Test getting a specific staff member"""
        # First get all staff
        all_staff = requests.get(f"{BASE_URL}/api/staff").json()
        staff_id = all_staff[0]["staff_id"]
        
        # Get specific staff
        response = requests.get(f"{BASE_URL}/api/staff/{staff_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["staff_id"] == staff_id
        print(f"✓ Got staff: {data['name']}")


class TestClients:
    """Clients API tests"""
    
    def test_get_all_clients(self):
        """Test getting all clients"""
        response = requests.get(f"{BASE_URL}/api/clients")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1, "Expected at least 1 seeded client"
        
        # Validate client structure
        client = data[0]
        assert "client_id" in client
        assert "name" in client
        assert "ndis_number" in client
        
        print(f"✓ Got {len(data)} clients")
        for c in data:
            print(f"  - {c['name']} (NDIS: {c['ndis_number']})")
    
    def test_get_client_by_id(self):
        """Test getting a specific client"""
        # First get all clients
        all_clients = requests.get(f"{BASE_URL}/api/clients").json()
        client_id = all_clients[0]["client_id"]
        
        # Get specific client
        response = requests.get(f"{BASE_URL}/api/clients/{client_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["client_id"] == client_id
        print(f"✓ Got client: {data['name']}")


class TestInvoices:
    """Invoices API tests"""
    
    def test_get_all_invoices(self):
        """Test getting all invoices"""
        response = requests.get(f"{BASE_URL}/api/invoices")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            invoice = data[0]
            assert "invoice_id" in invoice
            assert "invoice_no" in invoice
            print(f"✓ Got {len(data)} invoices")
        else:
            print("✓ Invoices endpoint working (no invoices yet)")


class TestReports:
    """Reports API tests"""
    
    def test_get_all_reports(self):
        """Test getting all reports"""
        response = requests.get(f"{BASE_URL}/api/reports")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            report = data[0]
            assert "report_id" in report
            assert "title" in report
            print(f"✓ Got {len(data)} reports")
        else:
            print("✓ Reports endpoint working (no reports yet)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
