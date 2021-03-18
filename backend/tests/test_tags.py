import pytest

@pytest.fixture
def test_create_tag_valid_inputs(access_token, client):
    """
    Test for creating a valid tag. Also a fixture so we can reuse the result in another test.
    """
    payload = {"name": "LinkedIn"}
    response = client.post("/tags/", json=payload, headers={"Authorization": access_token})

    assert response.status_code == 200  # Request went through
    assert response.json()["name"] == payload["name"]  # Correct data
    assert type(response.json()["user_id"]) == str  # Holds user_id

    return response.json()


def test_get_tags(access_token, client, test_create_tag_valid_inputs):
    """
    Test tag GET ALL endpoint.
    """
    response = client.get("/tags/", headers={"Authorization": access_token})

    assert response.status_code == 200  # Request went through
    assert len(response.json()) == 1  # Response is an array of length 1