from flask import request, jsonify

from db import db
from models.users import Users


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
