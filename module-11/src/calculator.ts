// calculator.ts

function randomNumber() {
    return Math.floor(Math.random() * 101);
}

function add(a: number, b: number) {
    return a + b;
}

function subtract(a: number, b: number) {
    return a - b;
}

function multiply(a: number, b: number) {
    return a * b;
}

function divide(a: number, b: number) {
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

const num1 = randomNumber();
const num2 = randomNumber();

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

function calculate(op: Operation, a: number, b: number): number | string{
    switch (op) {
        case "add":
            return add(a, b);
        case "subtract":
            return subtract(a, b);
        case "multiply":
            return multiply(a, b);
        case "divide":
            return divide(a, b);
        default:
            throw new Error(`Invalid operation: ${op}`);
    }
}

console.log(`Numbers are: ${num1} and ${num2}`)
console.log(`Added: ${calculate('add', num1, num2)}`);
console.log(`Subtracted: ${calculate('subtract', num1, num2)}`);
console.log(`Multiplied: ${calculate('multiply', num1, num2)}`);
console.log(`Divided: ${calculate('divide', num1, num2)}`);