//  hello.js

const name = 'World';
console.log(`Hello, ${name}!`);

const today = new Date();
console.log(`Today is ${today.toDateString()}`);

function add(a, b){
    return a + b;
}

console.log(`2 + 3 = ${add(2, 3)}`);
