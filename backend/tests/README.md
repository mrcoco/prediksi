# Unit Tests for EduPro Backend

This directory contains all unit and integration tests for the EduPro backend application. The tests are built using the `pytest` framework.

## Prerequisites

Before running the tests, ensure you have all the required dependencies installed, including the testing libraries.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install all dependencies from `requirements.txt`:
    ```bash
    pip install -r requirements.txt
    ```
    This will install FastAPI, SQLAlchemy, and other necessary packages, along with `pytest` and `httpx` for testing.

## Running the Tests

To run the entire test suite, navigate to the project's root directory (`prediksi/`) and simply run the `pytest` command. `pytest` will automatically discover and run all files that follow the `test_*.py` or `*_test.py` naming convention.

```bash
# Make sure you are in the root directory 'prediksi/'
pytest
```

### Running Specific Tests

You can also run specific test files or even specific test functions.

-   **Run a specific test file:**
    ```bash
    pytest backend/tests/test_c45_model.py
    ```

-   **Run tests in a directory:**
    ```bash
    pytest backend/tests/
    ```

-   **Run a specific test function using the `-k` flag:**
    ```bash
    pytest -k "test_train_model_success"
    ```

## Test Structure

-   `tests/test_c45_model.py`: Contains unit tests for the core machine learning model logic found in `models/c45_model.py`. It uses mocking to isolate the model from the database.
-   `tests/test_prediksi_router.py`: Contains integration tests for the prediction-related API endpoints found in `routes/prediksi_router.py`. It uses FastAPI's `TestClient` to send requests to the API and mocks dependencies like `get_db` and `get_current_user` to ensure tests are isolated and repeatable. 