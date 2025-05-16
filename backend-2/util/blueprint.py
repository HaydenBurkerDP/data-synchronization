from routes.users_routes import users_routes


def register_blueprints(app):
    app.register_blueprint(users_routes)
