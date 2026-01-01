"""
Main application entry point
"""
from flask import Flask, request, jsonify
from .service import UserService, OrderService
from .models import User, Order

app = Flask(__name__)

user_service = UserService()
order_service = OrderService(user_service)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Service is running'
    })

@app.route('/users', methods=['GET'])
def get_users():
    users = user_service.get_all_users()
    return jsonify({
        'count': len(users),
        'users': [user.to_dict() for user in users]
    })

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id: int):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@app.route('/users', methods=['POST'])
def create_user():
    if not request.json:
        return jsonify({'error': 'Request body is required'}), 400
    
    data = request.json
    name = data.get('name')
    email = data.get('email')
    
    try:
        user = user_service.create_user(name=name, email=email)
        return jsonify(user.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/users/<int:user_id>/orders', methods=['POST'])
def create_order(user_id: int):
    if not request.json:
        return jsonify({'error': 'Request body is required'}), 400
    
    data = request.json
    items = data.get('items', [])
    
    if not isinstance(items, list):
        return jsonify({'error': 'Items must be a list'}), 400
    
    if not items:
        return jsonify({'error': 'Items list cannot be empty'}), 400
    
    try:
        order = order_service.create_order(user_id, items)
        response = order.to_dict()
        user = user_service.get_user_by_id(user_id)
        if user:
            response['items_count'] = len(items)
        return jsonify(response), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/users/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id: int):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'created_at': user.created_at.isoformat()
    })

@app.route('/orders', methods=['GET'])
def get_all_orders():
    orders = order_service.get_all_orders()
    return jsonify({
        'count': len(orders),
        'orders': [order.to_dict() for order in orders]
    })

@app.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id: int):
    orders = order_service.get_orders_by_user(user_id)
    return jsonify({
        'count': len(orders),
        'orders': [order.to_dict() for order in orders]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

