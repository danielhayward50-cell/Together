# ATC Master Platform - Iteration 3 API Tests
# Tests for AI Email Generation, Payroll (SCHADS), and Compliance Tracking

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@achievetogethercare.com.au"
ADMIN_PASSWORD = "ATCAdmin2026!"


class TestAIEmailGeneration:
    """AI Email Generation API tests using Emergent LLM"""
    
    def test_generate_email_support_coordinator(self):
        """Test AI email generation for Support Coordinator role"""
        response = requests.post(f"{BASE_URL}/api/ai/generate-email", json={
            "lead_name": "Sarah Williams",
            "organization": "North West Co.",
            "role": "Support Coordinator",
            "service_type": "Community Access"
        })
        
        assert response.status_code == 200, f"AI email generation failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "subject" in data, "Response missing 'subject' field"
        assert "body" in data, "Response missing 'body' field"
        
        # Validate content
        assert len(data["subject"]) > 10, "Subject too short"
        assert len(data["body"]) > 100, "Body too short"
        assert "Daniel Hayward" in data["body"] or "daniel" in data["body"].lower(), "Missing signature"
        
        print(f"✓ AI Email generated successfully")
        print(f"  Subject: {data['subject'][:60]}...")
        print(f"  Body length: {len(data['body'])} chars")
    
    def test_generate_email_plan_manager(self):
        """Test AI email generation for Plan Manager role"""
        response = requests.post(f"{BASE_URL}/api/ai/generate-email", json={
            "lead_name": "David Kumar",
            "organization": "Western Sydney Hub",
            "role": "Plan Manager"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert "subject" in data
        assert "body" in data
        assert len(data["body"]) > 50
        
        print(f"✓ AI Email for Plan Manager generated")
    
    def test_generate_email_recovery_coach(self):
        """Test AI email generation for Recovery Coach role"""
        response = requests.post(f"{BASE_URL}/api/ai/generate-email", json={
            "lead_name": "Lisa Anderson",
            "organization": "North Shore Coaching",
            "role": "Recovery Coach"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert "subject" in data
        assert "body" in data
        
        print(f"✓ AI Email for Recovery Coach generated")


class TestPayrollRates:
    """SCHADS Award Rates API tests"""
    
    def test_get_schads_rates(self):
        """Test getting SCHADS award rates"""
        response = requests.get(f"{BASE_URL}/api/payroll/rates")
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate rate levels exist
        assert "level_2" in data, "Missing level_2 rates"
        assert "level_3" in data, "Missing level_3 rates"
        assert "level_4" in data, "Missing level_4 rates"
        
        # Validate level_2 structure
        level_2 = data["level_2"]
        assert "name" in level_2
        assert "weekday" in level_2
        assert "saturday" in level_2
        assert "sunday" in level_2
        assert "public_holiday" in level_2
        
        # Validate rate values
        assert level_2["weekday"] == 38.08, f"Expected weekday rate 38.08, got {level_2['weekday']}"
        assert level_2["saturday"] == 57.12, f"Expected saturday rate 57.12, got {level_2['saturday']}"
        assert level_2["sunday"] == 76.16, f"Expected sunday rate 76.16, got {level_2['sunday']}"
        
        print(f"✓ SCHADS rates retrieved successfully")
        print(f"  Level 2 Weekday: ${level_2['weekday']}/hr")
        print(f"  Level 2 Saturday: ${level_2['saturday']}/hr")
        print(f"  Level 2 Sunday: ${level_2['sunday']}/hr")


class TestPayrollSummary:
    """Payroll Summary API tests"""
    
    def test_get_payroll_summary(self):
        """Test getting payroll summary for a period"""
        response = requests.get(
            f"{BASE_URL}/api/payroll/summary",
            params={"period_start": "2026-01-01", "period_end": "2026-03-31"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "period" in data
        assert "staff" in data
        assert "totals" in data
        
        # Validate totals structure
        totals = data["totals"]
        assert "staff_count" in totals
        assert "total_hours" in totals
        assert "total_gross" in totals
        assert "total_super" in totals
        assert "total_cost" in totals
        
        # Validate staff entries
        assert isinstance(data["staff"], list)
        if len(data["staff"]) > 0:
            staff_entry = data["staff"][0]
            assert "staff_id" in staff_entry
            assert "name" in staff_entry
            assert "hours" in staff_entry
            assert "gross_pay" in staff_entry
            assert "super" in staff_entry
        
        print(f"✓ Payroll summary retrieved")
        print(f"  Period: {data['period']}")
        print(f"  Staff count: {totals['staff_count']}")
        print(f"  Total hours: {totals['total_hours']}")
        print(f"  Total gross: ${totals['total_gross']}")
        print(f"  Total super: ${totals['total_super']}")
        print(f"  Total cost: ${totals['total_cost']}")
    
    def test_payroll_calculate_for_staff(self):
        """Test calculating payroll for a specific staff member"""
        response = requests.get(
            f"{BASE_URL}/api/payroll/calculate",
            params={
                "staff_id": "staff_danielhayward",
                "period_start": "2026-01-01",
                "period_end": "2026-03-31"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "staff_id" in data
        assert "staff_name" in data
        assert "period" in data
        assert "hours" in data
        assert "pay" in data
        
        # Validate hours breakdown
        hours = data["hours"]
        assert "total" in hours
        assert "weekday" in hours
        assert "saturday" in hours
        assert "sunday" in hours
        
        # Validate pay breakdown
        pay = data["pay"]
        assert "gross" in pay
        assert "super" in pay
        assert "net_estimate" in pay
        
        print(f"✓ Payroll calculated for {data['staff_name']}")
        print(f"  Total hours: {hours['total']}")
        print(f"  Gross pay: ${pay['gross']}")
        print(f"  Super: ${pay['super']}")
    
    def test_payroll_calculate_nonexistent_staff(self):
        """Test payroll calculation for non-existent staff"""
        response = requests.get(
            f"{BASE_URL}/api/payroll/calculate",
            params={
                "staff_id": "nonexistent_staff",
                "period_start": "2026-01-01",
                "period_end": "2026-03-31"
            }
        )
        
        assert response.status_code == 404
        print("✓ Non-existent staff correctly returns 404")


class TestPayrollProcess:
    """Payroll Processing API tests"""
    
    def test_process_payroll(self):
        """Test processing payroll for a period"""
        response = requests.post(
            f"{BASE_URL}/api/payroll/process",
            params={"period_start": "2026-04-01", "period_end": "2026-04-02"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "payroll_id" in data
        assert "period_start" in data
        assert "period_end" in data
        assert "status" in data
        assert data["status"] == "processed"
        
        print(f"✓ Payroll processed: {data['payroll_id']}")
    
    def test_get_payroll_history(self):
        """Test getting payroll history"""
        response = requests.get(f"{BASE_URL}/api/payroll/history", params={"limit": 5})
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"✓ Payroll history retrieved: {len(data)} records")


class TestComplianceDashboard:
    """Compliance Dashboard API tests"""
    
    def test_get_compliance_dashboard(self):
        """Test getting compliance dashboard overview"""
        response = requests.get(f"{BASE_URL}/api/compliance/dashboard")
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "compliance_score" in data
        assert "total_staff" in data
        assert "total_documents" in data
        assert "summary" in data
        assert "alerts" in data
        
        # Validate summary structure
        summary = data["summary"]
        assert "valid" in summary
        assert "expired" in summary
        assert "expiring_30_days" in summary
        assert "expiring_60_days" in summary
        assert "missing_critical" in summary
        
        # Validate alerts structure
        alerts = data["alerts"]
        assert "expired" in alerts
        assert "expiring_soon" in alerts
        assert "missing" in alerts
        
        # Validate compliance score is percentage
        assert 0 <= data["compliance_score"] <= 100
        
        print(f"✓ Compliance dashboard retrieved")
        print(f"  Compliance score: {data['compliance_score']}%")
        print(f"  Total staff: {data['total_staff']}")
        print(f"  Total documents: {data['total_documents']}")
        print(f"  Valid: {summary['valid']}")
        print(f"  Expired: {summary['expired']}")
        print(f"  Missing critical: {summary['missing_critical']}")
    
    def test_compliance_score_calculation(self):
        """Test that compliance score reflects missing documents"""
        response = requests.get(f"{BASE_URL}/api/compliance/dashboard")
        data = response.json()
        
        # With 4 missing critical documents out of 6, score should be ~33%
        # (2 compliant / 6 required = 33%)
        assert data["compliance_score"] == 33, f"Expected 33%, got {data['compliance_score']}%"
        assert data["summary"]["missing_critical"] == 4, f"Expected 4 missing, got {data['summary']['missing_critical']}"
        
        print(f"✓ Compliance score correctly calculated: {data['compliance_score']}%")


class TestComplianceRequirements:
    """Compliance Requirements API tests"""
    
    def test_get_compliance_requirements(self):
        """Test getting list of required compliance documents"""
        response = requests.get(f"{BASE_URL}/api/compliance/requirements")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 10, "Expected at least 10 required documents"
        
        # Validate document structure
        doc = data[0]
        assert "name" in doc
        assert "critical" in doc
        
        # Count critical documents
        critical_count = len([d for d in data if d["critical"]])
        assert critical_count == 6, f"Expected 6 critical documents, got {critical_count}"
        
        print(f"✓ Compliance requirements retrieved: {len(data)} documents")
        print(f"  Critical documents: {critical_count}")


class TestStaffCompliance:
    """Staff Compliance API tests"""
    
    def test_get_staff_compliance(self):
        """Test getting compliance status for a specific staff member"""
        response = requests.get(f"{BASE_URL}/api/compliance/staff/staff_danielhayward")
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "staff_id" in data
        assert "staff_name" in data
        assert "compliance_score" in data
        assert "documents" in data
        assert "missing" in data
        assert "summary" in data
        
        # Validate documents
        assert isinstance(data["documents"], list)
        assert len(data["documents"]) == 7, f"Expected 7 documents, got {len(data['documents'])}"
        
        # Validate document structure
        if len(data["documents"]) > 0:
            doc = data["documents"][0]
            assert "name" in doc
            assert "expiry" in doc
            assert "status" in doc
        
        # Validate missing documents
        assert isinstance(data["missing"], list)
        assert len(data["missing"]) >= 4, "Expected at least 4 missing documents"
        
        print(f"✓ Staff compliance retrieved for {data['staff_name']}")
        print(f"  Compliance score: {data['compliance_score']}%")
        print(f"  Documents: {len(data['documents'])}")
        print(f"  Missing: {len(data['missing'])}")
    
    def test_get_staff_compliance_nonexistent(self):
        """Test getting compliance for non-existent staff"""
        response = requests.get(f"{BASE_URL}/api/compliance/staff/nonexistent_staff")
        
        assert response.status_code == 404
        print("✓ Non-existent staff correctly returns 404")
    
    def test_add_compliance_document(self):
        """Test adding a compliance document to staff"""
        doc_data = {
            "name": "TEST_Document",
            "number": "TEST-12345",
            "expiry": "2027-12-31"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/compliance/staff/staff_danielhayward/document",
            json=doc_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "message" in data
        assert data["message"] == "Document added"
        
        print(f"✓ Compliance document added")
        
        # Cleanup - delete the test document
        delete_response = requests.delete(
            f"{BASE_URL}/api/compliance/staff/staff_danielhayward/document/TEST_Document"
        )
        assert delete_response.status_code == 200
        print(f"✓ Test document cleaned up")


class TestExpiringDocuments:
    """Expiring Documents API tests"""
    
    def test_get_expiring_documents(self):
        """Test getting documents expiring within specified days"""
        response = requests.get(f"{BASE_URL}/api/compliance/expiring", params={"days": 365})
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        
        # Validate document structure if any exist
        if len(data) > 0:
            doc = data[0]
            assert "staff_id" in doc
            assert "staff_name" in doc
            assert "document_name" in doc
            assert "expiry_date" in doc
            assert "days_until_expiry" in doc
        
        print(f"✓ Expiring documents retrieved: {len(data)} documents expiring within 365 days")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
