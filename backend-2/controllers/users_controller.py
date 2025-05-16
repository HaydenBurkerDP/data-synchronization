from flask import request, jsonify

from db import db
from models.users import Users


def add_user():
    post_data = request.json
    user = Users()

    user.name = post_data.get("name", "")
    user.email = post_data.get("email", "")
    user.color = post_data.get("color", "")

    if not user.name or not user.email:
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

    user.name = post_data.get("name", user.name)
    user.email = post_data.get("email", user.email)
    user.color = post_data.get("color", user.color)

    if not user.name or not user.email:
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
