from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from server import db, socketio
from server import Subscription
from utils_user_account import ensure_user_subscription
import uuid
from datetime import datetime, timedelta

bp = Blueprint("admin_subscriptions", __name__, url_prefix="/api/admin")

@bp.route("/subscription/extend", methods=["POST"])
@jwt_required()
def extend_sub():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    days = int(data.get("days", 30))

    sub = Subscription.query.filter_by(user_id=user_id).first()
    now = datetime.utcnow()

    if not sub:
        sub = ensure_user_subscription(user_id)
        sub.expires_at = now + timedelta(days=days)
    else:
        start = sub.expires_at if sub.expires_at and sub.expires_at > now else now
        sub.expires_at = start + timedelta(days=days)
        sub.active = True

    db.session.commit()

    try:
        socketio.emit("user_event", {
            "type": "subscription_updated",
            "user_id": user_id,
            "expires_at": sub.expires_at.isoformat()
        }, room=f"user_{user_id}")
    except:
        pass

    return jsonify({"ok": True})

@bp.route("/subscription/cancel", methods=["POST"])
@jwt_required()
def cancel_sub():
    data = request.get_json() or {}
    user_id = data.get("user_id")

    sub = Subscription.query.filter_by(user_id=user_id).first()
    if not sub:
        return jsonify({"error": "no_subscription"}), 404

    sub.active = False
    db.session.commit()

    try:
        socketio.emit("user_event", {
            "type": "subscription_updated",
            "user_id": user_id,
            "active": False
        }, room=f"user_{user_id}")
    except:
        pass

    return jsonify({"ok": True})