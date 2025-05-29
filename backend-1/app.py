import sys
import os

from flask import Flask
from flask_cors import CORS

from db import db, init_db
from util.blueprint import register_blueprints
from populate_users import populate_users


FLASK_HOST = os.environ.get("FLASK_HOST")
FLASK_PORT = os.environ.get("FLASK_PORT")
DATABASE_URI = os.environ.get("DATABASE_URI")

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

init_db(app, db)
with app.app_context():
    db.create_all()

register_blueprints(app)

if __name__ == "__main__":
    with app.app_context():
        if len(sys.argv) > 2:
            if (sys.argv[1]) == "csv-data":
                populate_users(sys.argv[2])

    app.run(FLASK_HOST, port=FLASK_PORT, debug=True)
