"""
Business logic service layer
"""
from typing import List, Optional
from .models import User, Order
from .utils import validate_email
import random
import string

class UserService:
    def __init__(self):
        self.users: List[User] = [
            User(1, "Alice", "alice@example.com"),
            User(2, "Bob", "bob@example.com"),
        ]
    
    def get_all_users(self) -> List[User]:
        return self.users
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        for user in self.users:
            if user.id == user_id:
                return user
        return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        for user in self.users:
            if user.email == email:
                return user
        return None
    
    def create_user(self, name: str, email: Optional[str] = None) -> User:
        if not name or not name.strip():
            raise ValueError("Name is required and cannot be empty")
        
        if email:
            if not validate_email(email):
                raise ValueError("Invalid email format")
            existing_user = self.get_user_by_email(email)
            if existing_user:
                raise ValueError("Email already exists")
        
        new_id = max([u.id for u in self.users], default=0) + 1
        new_user = User(new_id, name.strip(), email)
        self.users.append(new_user)
        return new_user
    
    def update_user(self, user_id: int, name: Optional[str] = None, email: Optional[str] = None) -> Optional[User]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        if name is not None:
            if not name.strip():
                raise ValueError("Name cannot be empty")
            user.name = name.strip()
        
        if email is not None:
            if email and not validate_email(email):
                raise ValueError("Invalid email format")
            user.email = email
        
        return user
    
    def delete_user(self, user_id: int) -> bool:
        for i, user in enumerate(self.users):
            if user.id == user_id:
                self.users.pop(i)
                return True
        return False


class OrderService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service
        self.orders: List[Order] = []
    
    def create_order(self, user_id: int, items: List[dict]) -> Order:
        user = self.user_service.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        total = sum(item.get('price', 0) * item.get('quantity', 0) for item in items)
        tax = total * 0.1
        discount = total * 0.05
        final_total = total + tax - discount
        
        order_id = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        
        order = Order(order_id, user_id, items, final_total)
        self.orders.append(order)
        return order
    
    def get_all_orders(self) -> List[Order]:
        return self.orders
    
    def get_orders_by_status(self, status: str) -> List[Order]:
        return [order for order in self.orders if order.status == status]
    
    def get_orders_by_user(self, user_id: int) -> List[Order]:
        return [order for order in self.orders if order.user_id == user_id]
    
    def get_order_by_id(self, order_id: str) -> Optional[Order]:
        for order in self.orders:
            if order.order_id == order_id:
                return order
        return None

