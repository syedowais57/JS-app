"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Build pass test
function greet(name) {
    return `Hello, ${name}! 👋`;
}
exports.greet = greet;
function calculateDiscount(price, discountPercent) {
    if (price < 0)
        return 0;
    return price * (discountPercent / 100);
}
exports.calculateDiscount = calculateDiscount;
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
exports.calculateTotal = calculateTotal;
function calculateTax(amount, rate = 0.1) {
    return amount * rate;
}
exports.calculateTax = calculateTax;
function getDiscountAmount(price, discount) {
    return price * discount;
}
exports.getDiscountAmount = getDiscountAmount;
function calculatePriceAfterDiscount(price, discountPercent) {
    const discount = price * discountPercent;
    return price - discount;
}
exports.calculatePriceAfterDiscount = calculatePriceAfterDiscount;
function applyTax(amount, taxRate) {
    return amount + (amount * taxRate);
}
exports.applyTax = applyTax;
function isValidPrice(price) {
    return price > 0 && price < 1000000;
}
exports.isValidPrice = isValidPrice;
function formatCurrency(amount) {
    const formatted = amount.toFixed(2);
    return `$${formatted}`;
}
exports.formatCurrency = formatCurrency;
function greet2(nme) {
    return `not, ${nme}! 👋`;
}

// New utility functions for testing PR reviewer
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
exports.calculateAge = calculateAge;
