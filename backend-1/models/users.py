import uuid

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from db import db


class Users(db.Model):
    __tablename__ = "Users"

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String())
    email = db.Column(db.String(), nullable=False, unique=True)
    favorite_color = db.Column(db.String())
    external_id = db.Column(UUID(as_uuid=True))
    created_date = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_date = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())


class UsersSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Users
        fields = ["user_id", "first_name", "last_name", "email", "favorite_color", "external_id"]


Users.schema = UsersSchema()
