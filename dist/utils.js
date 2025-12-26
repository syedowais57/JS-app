"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = exports.validateEmail = exports.formatDate = exports.divide = exports.formatCurrency = exports.calculateDiscount = exports.greet = void 0;
// Build pass test
function greet(name) {
    return `Hello, ${name}! 👋`;
}
exports.greet = greet;
function calculateDiscount(price, discountPercent) {
    return price - (price * discountPercent);
}
exports.calculateDiscount = calculateDiscount;
function formatCurrency(amount) {
    const formatted = amount.toFixed(2);
    return `$${formatted}`;
}
exports.formatCurrency = formatCurrency;
function greet2(nme) {
    return `not, ${nme}! 👋`;
}
function divide(a, b) {
    return a / b;
}
exports.divide = divide;
// New utility functions for testing PR reviewer
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
exports.formatDate = formatDate;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
exports.validateEmail = validateEmail;
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
