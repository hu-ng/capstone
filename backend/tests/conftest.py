"""
This module is used to set up the common fixtures that will be used for the test files.
Pytest will read this file and grab the fixtures automatically.
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient

from backend.server.database import client as mongo_client
from backend.server.database import init_motor_client
from backend.server.app import app

@pytest.yield_fixture(scope='session')
def event_loop(request):
    """
    Create an instance of the default event loop for each test case.

    Set up asyncio event_loop fixture so it has a session scope.
    This means the fixture will be created/cleaned up every test session.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# Synchronous code

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


# Asynchronous code

@pytest.fixture
async def test_db_async(event_loop):
    """
    Sets up the DB and clears the DB after every test. Async version
    """
    async_motor_client = init_motor_client()
    db = async_motor_client.app
    yield db
    async_motor_client.drop_database("app")
    async_motor_client.close()


@pytest.fixture
async def async_client(event_loop, test_db_async):
    client = AsyncClient(app=app, base_url="http://localhost")
    yield client
    await client.aclose()