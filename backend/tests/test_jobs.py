import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient


@pytest.fixture
def sample_job_data():
    # There is no posted date here
    job = {
        "title": "SWE",
        "company": "Google"
    }
    return job


@pytest.fixture
def invalid_inputs():
    # Title is intentionally excluded so that it is an invalid input
    job = {
        "company": "Google"
    }
    return job


def test_create_job_valid_inputs(access_token, client, sample_job_data):
    """
    Test to create a job for a user using valid inputs
    """
    response = client.post("/jobs/", json=sample_job_data, headers={"Authorization": access_token})
    assert response.status_code == 200
    
    # Return data is correct
    data = response.json()
    assert data["title"] == sample_job_data["title"]
    assert data["company"] == sample_job_data["company"]

    # There is one job for the user
    get_jobs = client.get("/jobs/", headers={"Authorization": access_token})
    assert len(get_jobs.json()) == 1


def test_create_job_invalid_inputs(access_token, client, invalid_inputs):
    """
    Test to create a job for a user using invalid inputs
    """
    response = client.post("/jobs/", json=invalid_inputs, headers={"Authorization": access_token})
    assert response.status_code == 422


def test_create_multiple_jobs(access_token, client, sample_job_data):
    """
    Test to create multiple jobs
    """
    # Create two jobs using the same JSON for convenience
    client.post("/jobs/", json=sample_job_data, headers={"Authorization": access_token})
    client.post("/jobs/", json=sample_job_data, headers={"Authorization": access_token})
    
    # There should be two job for the user
    get_jobs = client.get("/jobs/", headers={"Authorization": access_token})
    assert len(get_jobs.json()) == 2


def test_delete_job(access_token, client, sample_job_data):
    """
    Test to delete a job
    """
    # Create a job
    response = client.post("/jobs/", json=sample_job_data, headers={"Authorization": access_token})
    response = response.json()
    job_id = response["id"]

    # Delete the job
    del_response = client.delete(f"/jobs/{job_id}", headers={"Authorization": access_token})
    assert del_response.status_code == 204

    # There should be no jobs for the user
    get_jobs = client.get("/jobs/", headers={"Authorization": access_token})
    assert len(get_jobs.json()) == 0


def test_update_job(access_token, client, sample_job_data):
    """
    Test to update an existing job with new data
    """
    # Create a job, get the id
    response = client.post("/jobs/", json=sample_job_data, headers={"Authorization": access_token}).json()
    job_id = response["id"]
    
    posted_date = datetime.utcnow() - timedelta(days=2)  # Date posted two days before
    edit_payload = {
        "title": "Senior SWE",
        "company": "Google",
        "posted_date": posted_date.isoformat()
    }

    # Get existing job
    job_in_db = client.get(f"/jobs/{job_id}", headers={"Authorization": access_token}).json()

    # Update the job
    update_response = client.put(f"/jobs/{job_id}", json=edit_payload, headers={"Authorization": access_token})
    update_res_json = update_response.json()

    # Assertions
    assert update_response.status_code == 200
    assert update_res_json["title"] == edit_payload["title"]
    assert update_res_json["title"] != job_in_db["title"]
    assert update_res_json["added_date"] == job_in_db["added_date"]
    assert update_res_json["posted_date"] != job_in_db["posted_date"]
    assert job_in_db["posted_date"] is None