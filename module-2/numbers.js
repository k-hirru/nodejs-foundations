// numbers.js

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function double(number){
    return number * 2;
}

function isNumberEven(number){
    return number % 2 === 0;
}

const doubled = numbers.map(number => number * 2);
console.log(doubled);

const evenNumbers = numbers.filter(number => number % 2 === 0)
console.log(evenNumbers);

const sumOfArray = numbers.reduce((acc, curr) => acc + curr)
console.log(sumOfArray);

