from flask import Blueprint

from controllers import users_controller

users_routes = Blueprint("users", __name__)


@users_routes.route("/user", methods=["POST"])
def add_user():
    return users_controller.add_user()


@users_routes.route("/users", methods=["GET"])
def get_all_users():
    return users_controller.get_all_users()


@users_routes.route("/user/<user_id>", methods=["PUT"])
def update_user(user_id):
    return users_controller.update_user(user_id)


@users_routes.route("/user/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    return users_controller.delete_user(user_id)


@users_routes.route("/users/sync", methods=["PATCH"])
def sync_users():
    return users_controller.sync_users()
