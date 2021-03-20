# Backend code for Jobful.

## Setting up
### Pre-installation
The backend requires a few non-Python dependencies that you should obtain beforehand.
- MongoDB:
    - You can either install MongoDB [locally](https://docs.mongodb.com/manual/administration/install-community/) or use their [Atlas](https://www.mongodb.com/cloud/atlas) service.
    - The end result is a database connection string which has the following general form:
        - `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`
    - Keep this string handy.
- Poetry:
    - Poetry is a project package manager for Python, similar to NPM for JavaScript.
    - [Install](https://python-poetry.org/docs/) poetry.
    - Configure poetry so that it creates a virtual environment in the project directory.
        - `poetry config settings.virtualenvs.in-project true`
- Creating a `.env` file:
    - In the `backend` folder, create a new `.env` file based on `.env.example`.
    - Fill in the blanks.

### Installation:
To install the backend, navigate to the folder that contains `poetry.lock` and run `poetry install`. This does two things:
- Create a virtual environment in the folder if there isn't any.
- Reads the `.lock` file and downloads all dependencies.

### Running the backend:
To start the backend, do the following:

```
# First option
poetry run python backend/main.py

# Second option
poetry shell
python backend/main.py
```

With that running, go to `http://0.0.0.0:8000/docs` to view live documentation for the API, courtesy of FastAPI.

## Tests
At the point of submission, the app has 77% code coverage.

To run the tests, do the following:
```
# First option
poetry run pytest --cov=backend/server backend/tests

# Second option
poetry shell
pytest --cov=backend/server backend/tests
```