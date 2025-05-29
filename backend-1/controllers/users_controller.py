import os
from datetime import datetime, timezone
import requests

from flask import request, jsonify
from sqlalchemy import or_

from db import db
from models.users import Users

SYNC_URL = os.environ.get("SYNC_URL")
last_sync_date = datetime.now(timezone.utc)


def add_user():
    post_data = request.json
    user = Users()

    user.first_name = post_data.get("first_name", "")
    user.last_name = post_data.get("last_name", "")
    user.email = post_data.get("email", "")
    user.favorite_color = post_data.get("favorite_color", "")

    if not user.first_name or not user.email:
        return jsonify({"message": "missing required field(s)"}), 400

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "user added", "results": Users.schema.dump(user)}), 201


def get_all_users():
    users = db.session.query(Users).all()
    return jsonify({"message": "users found", "results": Users.schema.dump(users, many=True)}), 200


def update_user(user_id):
    post_data = request.json

    user = db.session.query(Users).filter(Users.user_id == user_id).first()
    if not user:
        return jsonify({"message": "user not found"}), 404

    user.first_name = post_data.get("first_name", user.first_name)
    user.last_name = post_data.get("last_name", user.last_name)
    user.email = post_data.get("email", user.email)
    user.favorite_color = post_data.get("favorite_color", user.favorite_color)

    if not user.first_name or not user.email:
        return jsonify({"message": "missing required field(s)"}), 400

    db.session.commit()

    return jsonify({"message": "user updated", "results": Users.schema.dump(user)}), 200


def delete_user(user_id):
    user = db.session.query(Users).filter(Users.user_id == user_id).first()
    if not user:
        return jsonify({"message": "user not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "user deleted"}), 200


def sync_users():
    global last_sync_date
    unsynced_user_records = db.session.query(Users).filter(or_(Users.external_id == None, Users.updated_date > last_sync_date)).all()
    mapped_users = {str(user.user_id): user for user in unsynced_user_records}
    unsynced_users = Users.schema.dump(unsynced_user_records, many=True)
    sync_update_objs = []

    for user in unsynced_users:
        external_user_obj = {
            "user_id": user["external_id"],
            "name": user["first_name"] + " " + user["last_name"],
            "email": user["email"],
            "color": user["favorite_color"],
            "external_id": user["user_id"]
        }

        sync_update_objs.append(external_user_obj)

    if sync_update_objs:
        try:
            response = requests.patch(f"{SYNC_URL}/users/batch-update", json={"users": sync_update_objs})
            success = response.status_code == 200
        except:
            success = False

        if not success:
            return jsonify({"message": "unable to sync records"}), 500

        record_response = response.json().get("results")

        if record_response:
            for response_user in record_response:
                user = mapped_users.get(response_user.get("external_id"))
                user.external_id = response_user.get("user_id")
            db.session.commit()
    else:
        record_response = []

    last_sync_date = datetime.now(timezone.utc)

    return jsonify({"message": "users synced", "results": [Users.schema.dump(unsynced_user_records, many=True), record_response]}), 200
