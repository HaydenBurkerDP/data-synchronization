# Data Synchronization

Demo app used to learn more about synchronizing data across multiple systems

## Steps to run

### Backend 1

Create a `.env` file under `/backend-1` with the following:

    FLASK_HOST = localhost
    FLASK_PORT = 8086
    DATABASE_URI = postgresql://localhost:5432/be1
    SYNC_URL = http://localhost:8087

Open a new terminal at the root project directory and run:

    cd backend-1
    python3 -m pipenv shell
    python3 -m pip install pipenv
    python3 -m pipenv install
    createdb be1
    python app.py

### Backend 2

Create a `.env` file under `/backend-2` with the following:

    FLASK_HOST = localhost
    FLASK_PORT = 8087
    DATABASE_URI = postgresql://localhost:5432/be2

Open a new terminal at the root project directory and run:

    cd backend-2
    python3 -m pipenv shell
    python3 -m pip install pipenv
    python3 -m pipenv install
    createdb be2
    python app.py

### Frontend

Create a `.env` file under `/data-synchronization-frontend` with the following:

    VITE_BACKEND_1_URL = http://localhost:8086
    VITE_BACKEND_2_URL = http://localhost:8087

Open a new terminal at the root project directory and run:

    cd data-synchronization-frontend
    npm i
    npm run dev

Open a browser window and navigate to the local url: `http://localhost:5173/`
