import uuid

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy.dialects.postgresql import UUID

from db import db


class Users(db.Model):
    __tablename__ = "Users"

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False, unique=True)
    color = db.Column(db.String())
    external_id = db.Column(UUID(as_uuid=True))


class UsersSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Users
        fields = ["user_id", "name", "email", "color", "external_id"]


Users.schema = UsersSchema()
