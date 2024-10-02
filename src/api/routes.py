from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os

api = Blueprint('api', __name__)
get_jwt_identity
# Allow CORS requests to this API
CORS(api)


@api.route("/signup", methods=["POST"])
def register_user():
    data = request.json
    if data.get("email", None) is None:
        return jsonify({"message":"the email is required"}), 400
    
    salt = b64encode(os.urandom(32)).decode("utf-8")
    password = generate_password_hash(f"{data['password']}{salt}")
  
    user = User(email=data["email"], password=password, salt=salt, is_active=True)
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify({"message":"User save success"}), 201
    except Exception as error:
        print(error.args)
        return jsonify({"message":f"error {error}"}), 500



@api.route("/login", methods=["POST"])
def user_login():
    data = request.json

    if data.get("email", None) is None:
        return jsonify({"message":"the email is required"}), 400

    user = User.query.filter_by(email=data["email"]).one_or_none()
    
    if user is not None:
        pass_with_salt = data["password"] + user.salt
        result = check_password_hash(user.password, pass_with_salt)
       
        if result: 
            token = create_access_token(identity=user.email)
            return jsonify({"token":token}),201
        else:
            return jsonify({"message":"bad credentials"}),400 
    else:
        return jsonify({"message":"bad credentials"}),400 


@api.route("/private", methods=["GET"])
@jwt_required()
def private_account():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as = current_user), 200