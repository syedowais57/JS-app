"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greet = greet;
exports.formatDate = formatDate;
exports.validateEmail = validateEmail;
exports.calculateAge = calculateAge;
// Build pass test
function greet(name) {
    return `Hello, ${name}! 👋`;
}
function greet2(nme) {
    return `not, ${nme}! 👋`;
}
// New utility functions for testing PR reviewer
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
