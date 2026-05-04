// calculator.js

function randomNumber() {
    return Math.floor(Math.random() * 101);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

const num1 = randomNumber();
const num2 = randomNumber();

console.log(`Numbers are: ${num1} and ${num2}`)
console.log(`Added: ${add(num1, num2)}`);
console.log(`Subtracted: ${subtract(num1, num2)}`);
console.log(`Multiplied: ${multiply(num1, num2)}`);
console.log(`Divided: ${divide(num1, num2)}`);