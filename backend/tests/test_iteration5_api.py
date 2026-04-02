# ATC Master Platform - Iteration 5 API Tests
# Tests for Google Drive Sync API endpoints (MOCKED)

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@achievetogethercare.com.au"
ADMIN_PASSWORD = "ATCAdmin2026!"


class TestGDriveStatus:
    """Google Drive Status API tests (MOCKED)"""
    
    def test_get_gdrive_status(self):
        """Test GET /api/gdrive/status returns mock data"""
        response = requests.get(f"{BASE_URL}/api/gdrive/status")
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "connected" in data
        assert "folders" in data
        assert "recent_files" in data
        
        # Validate folders - should have 6 folders
        assert len(data["folders"]) == 6
        
        # Validate folder structure
        folder = data["folders"][0]
        assert "id" in folder
        assert "name" in folder
        assert "icon" in folder
        assert "files" in folder
        assert "subfolders" in folder
        
        # Validate folder names
        folder_names = [f["name"] for f in data["folders"]]
        assert "01 - Staff Records" in folder_names
        assert "02 - Finance" in folder_names
        assert "03 - Participants" in folder_names
        assert "04 - Operations" in folder_names
        assert "05 - Marketing" in folder_names
        assert "06 - Compliance" in folder_names
        
        print(f"✓ G-Drive status returned {len(data['folders'])} folders")
    
    def test_gdrive_folders_have_subfolders(self):
        """Test that each folder has subfolders"""
        response = requests.get(f"{BASE_URL}/api/gdrive/status")
        assert response.status_code == 200
        data = response.json()
        
        for folder in data["folders"]:
            assert len(folder["subfolders"]) > 0, f"Folder {folder['name']} has no subfolders"
            print(f"✓ Folder '{folder['name']}' has {len(folder['subfolders'])} subfolders")
    
    def test_gdrive_recent_files(self):
        """Test that recent files are returned"""
        response = requests.get(f"{BASE_URL}/api/gdrive/status")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["recent_files"]) > 0
        
        # Validate file structure
        file = data["recent_files"][0]
        assert "name" in file
        assert "folder" in file
        assert "modified" in file
        assert "type" in file
        
        print(f"✓ G-Drive status returned {len(data['recent_files'])} recent files")


class TestGDriveSync:
    """Google Drive Sync API tests (MOCKED)"""
    
    def test_sync_drive(self):
        """Test POST /api/gdrive/sync triggers sync (demo mode)"""
        response = requests.post(f"{BASE_URL}/api/gdrive/sync")
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "success" in data
        assert "message" in data
        assert "synced_at" in data
        
        # Validate values
        assert data["success"] == True
        assert "demo mode" in data["message"].lower()
        
        print(f"✓ G-Drive sync completed: {data['message']}")


class TestGDriveConnect:
    """Google Drive Connect API tests (MOCKED)"""
    
    def test_connect_drive(self):
        """Test POST /api/gdrive/connect returns setup instructions"""
        response = requests.post(f"{BASE_URL}/api/gdrive/connect")
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "message" in data
        assert "setup_instructions" in data
        
        # Validate setup instructions
        assert len(data["setup_instructions"]) > 0
        
        print(f"✓ G-Drive connect returned {len(data['setup_instructions'])} setup instructions")
