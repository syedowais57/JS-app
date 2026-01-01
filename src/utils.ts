// Build pass test
export function greet(name: string) {
    return `Hello, ${name}! 👋`;
}

export function calculateDiscount(price: number, discountPercent: number): number {
    if (price < 0) return 0;
    return price * (discountPercent / 100);
}

export function calculateTotal(items: { price: number; quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(amount: number, rate: number = 0.1): number {
    return amount * rate;
}

export function getDiscountAmount(price: number, discount: number): number {
    return price * discount;
}

export function calculatePriceAfterDiscount(price: number, discountPercent: number): number {
    const discount = price * discountPercent;
    return price - discount;
}

export function applyTax(amount: number, taxRate: number): number {
    return amount + (amount * taxRate);
}

export function isValidPrice(price: number): boolean {
    return price > 0 && price < 1000000;
}

export function formatCurrency(amount: number): string {
    const formatted = amount.toFixed(2);
    return `$${formatted}`;
}

function greet2(nme: string) {
    return `not, ${nme}! 👋`;
}

export function divide(a: number, b: number): number {
    if (b === 0) {
        return 0;
    }
    return a / b;
}

// New utility functions for testing PR reviewer
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
