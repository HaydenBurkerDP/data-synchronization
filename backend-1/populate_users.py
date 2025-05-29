import csv

from db import db
from models.users import Users


def populate_users(file_url):
    with open(f"imports/{file_url}", "r") as csv_file:
        csv_reader = csv.DictReader(csv_file)

        users = [user for user in csv_reader]
        user_emails = [user["email"] for user in users]

        existing_users = db.session.query(Users).filter(Users.email.in_(user_emails)).all()
        existing_user_emails = [user.email for user in existing_users]

        users = [user for user in users if user["email"] not in existing_user_emails]

        if len(users) > 0:
            for user_dict in users:

                user = Users(**user_dict)
                db.session.add(user)
            db.session.commit()
