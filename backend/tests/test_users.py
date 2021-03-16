import pytest
from backend.tests.common import client, test_db, existing_user
import logging


def test_create_new_user(client):
    """
    Test for creating a new user
    """
    user = "test@mail.com"
    payload = {
        "email": user,
        "password": "1234"
    }

    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    assert response.json()["email"] == user


def test_create_user_with_existing_email(client, existing_user):
    """
    Test for creating a new user with an existing email address
    """
    response = client.post("/auth/register", json=existing_user)
    assert response.status_code == 400


def test_valid_user_login(client, existing_user):
    """
    Test for logging in an existing user with valid inputs
    """
    payload = {"username": existing_user["email"], "password": existing_user["password"]}
    response = client.post("/auth/jwt/login", data=payload)
    assert response.status_code == 200


def test_invalid_user_login(client, existing_user):
    """
    Test for logging in an existing user with invalid inputs
    """
    payload = {"username": existing_user["email"], "password": "5678"}
    response = client.post("/auth/jwt/login", data=payload)
    assert response.status_code == 400

