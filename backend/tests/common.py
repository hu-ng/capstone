import pytest
from fastapi.testclient import TestClient

from backend.server.database import client as mongo_client
from backend.server.app import app


# @pytest.fixture(scope="class")
# def test_db_class():
#     db = mongo_client.app
#     yield db
#     mongo_client.drop_database("app")
#     mongo_client.close()


@pytest.fixture
def test_db():
    """
    Sets up the DB and clears the DB after every test.
    """
    db = mongo_client.app
    yield db
    mongo_client.drop_database("app")
    mongo_client.close()


@pytest.fixture
def client(test_db):
    """
    Returns a test client
    """
    test_client = TestClient(app)
    yield test_client


@pytest.fixture
def existing_user(client):
    """
    Creates one user with the payload below
    """
    user = "test@mail.com"
    payload = {
        "email": user,
        "password": "1234"
    }

    client.post("/auth/register", json=payload)
    yield payload


@pytest.fixture()
def access_token(client, existing_user):
    """
    Logs in the existing user and returns the correctly formatted access token
    """
    payload = {
        "username": existing_user["email"], 
        "password": existing_user["password"]
    }

    # Use data keyword here because we're sending a form
    response = client.post("/auth/jwt/login", data=payload)
    token = response.json()["access_token"]
    return f'Bearer {token}'