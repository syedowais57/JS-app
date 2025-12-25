// Build pass test
export function greet(name: string) {
    return `Hello, ${name}! 👋`;
}

export function calculateDiscount(price: number, discountPercent: number): number {
    return price * (discountPercent / 100);
}

export function formatCurrency(amount: number): string {
    const formatted = amount.toFixed(2);
    return `$${formatted}`;
}

function greet2(nme: string) {
    return `not, ${nme}! 👋`;
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
