"""
Data models for the application
"""
from typing import Optional, List
from datetime import datetime

class User:
    def __init__(self, user_id: int, name: str, email: Optional[str] = None):
        self.id = user_id
        self.name = name
        self.email = email
        self.created_at = datetime.now()
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Order:
    def __init__(self, order_id: str, user_id: int, items: List[dict], total: float):
        self.order_id = order_id
        self.user_id = user_id
        self.items = items
        self.total = total
        self.status = "pending"
        self.created_at = datetime.now()
    
    def to_dict(self):
        return {
            'order_id': self.order_id,
            'user_id': self.user_id,
            'items': self.items,
            'total': self.total,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

