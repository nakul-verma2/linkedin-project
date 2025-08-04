from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests
from datetime import datetime
FIREBASE_API_KEY="<YOUR-WEB-API-KEY>"

app = Flask(__name__)
CORS(app)

# ---------- Firebase ----------
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ---------- Routes ----------
@app.route("/")
def home():
    return {"message": "LinkedIn Clone API is running!"}

# ---------- Auth ----------
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        user = auth.create_user(
            email=data["email"],
            password=data["password"],
            display_name=data["name"],
        )

        db.collection("users").document(user.uid).set(
            {
                "uid": user.uid,
                "email": data["email"],
                "name": data["name"],
                "bio": data.get("bio", ""),
                "created_at": datetime.utcnow(),
            }
        )
        return jsonify(success=True, uid=user.uid)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 400



@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data["email"]
        password = data["password"]

        # Call Firebase REST API
        res = requests.post(
            f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}",
            json={
                "email": email,
                "password": password,
                "returnSecureToken": True
            }
        )

        if res.status_code != 200:
            return jsonify(success=False, error="Invalid email or password"), 401

        firebase_data = res.json()
        uid = firebase_data["localId"]

        # Get user profile from Firestore
        snap = db.collection("users").document(uid).get()
        if not snap.exists:
            return jsonify(success=False, error="User data not found"), 404

        user_data = snap.to_dict()

        return jsonify(
            success=True,
            user={
                "uid": uid,
                "email": user_data["email"],
                "name": user_data["name"],
                "bio": user_data.get("bio", ""),
                "idToken": firebase_data["idToken"]  # Optional: send to frontend
            }
        )

    except Exception as e:
        return jsonify(success=False, error=str(e)), 400



# ---------- Posts ----------
@app.route("/posts", methods=["POST"])
def create_post():
    try:
        body = request.get_json()
        uid, content = body["uid"], body["content"]

        snap = db.collection("users").document(uid).get()
        if not snap.exists:
            return jsonify(success=False, error="User not found"), 404

        u = snap.to_dict()
        post_ref = db.collection("posts").add(
            {
                "uid": uid,
                "author_name": u["name"],
                "author_email": u["email"],
                "content": content,
                "created_at": datetime.utcnow(),
                "timestamp": datetime.utcnow().isoformat(),
            }
        )[1]  # tuple -> (time, DocumentReference)

        return jsonify(success=True, post_id=post_ref.id)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 400


@app.route("/posts", methods=["GET"])
def get_posts():
    try:
        snaps = (
            db.collection("posts")
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .stream()
        )
        posts = [{**s.to_dict(), "id": s.id} for s in snaps]
        return jsonify(success=True, posts=posts)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 400


@app.route("/user/<uid>/posts", methods=["GET"])
def get_user_posts(uid):
    try:
        snaps = db.collection("posts").where("uid", "==", uid).stream()
        posts = [{**s.to_dict(), "id": s.id} for s in snaps]
        posts.sort(key=lambda p: p["timestamp"], reverse=True)
        return jsonify(success=True, posts=posts)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 400
        
@app.route("/user/<uid>", methods=["GET"])
def get_user(uid):
    try:
        snap = db.collection("users").document(uid).get()
        if not snap.exists:
            return jsonify(success=False, error="User not found"), 404
        return jsonify(success=True, user=snap.to_dict())
    except Exception as e:
        return jsonify(success=False, error=str(e)), 400


if __name__ == "__main__":
    app.run(debug=True)


    
