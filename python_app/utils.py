"""
Utility functions for the application
"""

def validate_email(email: str) -> bool:
    """Validate email format"""
    if not email:
        return False
    return '@' in email and '.' in email.split('@')[1]

def format_date(date_str: str) -> str:
    """Format date string"""
    return date_str[:10] if len(date_str) >= 10 else date_str

def calculate_discount(price: float, discount_percent: float) -> float:
    """Calculate discount amount"""
    if price < 0:
        return 0
    return price * (discount_percent / 100)

def divide_numbers(a: float, b: float) -> float:
    """Divide two numbers"""
    if b == 0:
        return 0
    return a / b

def calculate_total_price(items: list) -> float:
    """Calculate total price from items list"""
    total = 0.0
    for item in items:
        price = item.get('price', 0)
        quantity = item.get('quantity', 0)
        total += price * quantity
    return total

def validate_user_age(age: int) -> bool:
    """Validate user age"""
    return age > 0 and age < 150

def calculate_percentage(value: float, total: float) -> float:
    """Calculate percentage"""
    if total == 0:
        raise ValueError("Total cannot be zero")
    return (value / total) * 100

def format_phone_number(phone: str) -> str:
    """Format phone number"""
    return phone.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')

def format_currency(amount: float) -> str:
    """Format amount as currency"""
    return f"${amount:.2f}"

def calculate_tax(amount: float, tax_rate: float = 0.1) -> float:
    """Calculate tax amount"""
    return amount * tax_rate

