import pytest
from datetime import datetime, timedelta

from backend.tests.test_jobs import sample_job_data

@pytest.fixture
def job_id(access_token, client, sample_job_data):
    """
    Fixture to create a job and returns its id
    """
    response = client.post("/jobs/", json=sample_job_data, headers={"Authorization": access_token})
    return response.json()["id"]


@pytest.fixture
def test_create_todo(access_token, client, job_id):
    """
    Test to create a valid to-do
    Also a fixture because we reuse the logic in other tests
    """
    # Create a sample todo
    payload = { "title": "Write resume" }
    response = client.post(f"/jobs/{job_id}/todos/", json=payload, headers={"Authorization": access_token})

    # Assert that there is a todo
    assert response.status_code == 200
    assert len(response.json()["todos"]) == 1

    # Return the data we need for other tests
    return {"id": response.json()["todos"][0], "payload": payload}


def test_create_todo_invalid_inputs(access_token, client, job_id):
    """
    Test to create a to-do with invalid inputs
    """
    # Create a to-do with an empty dict
    response = client.post(f"/jobs/{job_id}/todos/", json={}, headers={"Authorization": access_token})
    assert response.status_code == 422


def test_update_todo(access_token, client, job_id, test_create_todo):
    """
    Test to update existing to-do with new data
    """
    # Extract the values from the fixture
    todo_id, payload = test_create_todo.values()

    # Create update data
    due_date = datetime.utcnow() + timedelta(days=5)
    due_date_str = due_date.isoformat()
    update_payload = {"due_date": due_date_str}  # Update the time

    # Send request to update
    update_res = client.put(f"/jobs/{job_id}/todos/{todo_id}", json=update_payload, headers={"Authorization": access_token})
    
    # Assert that it's good
    assert update_res.status_code == 200
    assert update_res.json()["todo"]["title"] == payload["title"]

    # <- weird work around here. Due to database interactions, the date is moved by a few seconds.
    assert update_res.json()["todo"]["due_date"][:-3] == due_date_str[:-3]


def test_delete_todo(access_token, client, job_id, test_create_todo):
    """
    Test to delete a to-do in a job
    """
    # Extract the id of the todo from the fixture
    todo_id, _ = test_create_todo.values()

    # Send request to delete the todo
    delete_res = client.delete(f"/jobs/{job_id}/todos/{todo_id}", headers={"Authorization": access_token})
    
    # Check the job object
    job_res = client.get(f"/jobs/{job_id}", headers={"Authorization": access_token})

    # Checks if the delete call went through
    assert delete_res.status_code == 200

    # Check that there are no todos
    assert len(job_res.json()["todos"]) == 0