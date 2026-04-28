// math-utils.js

function square(n){
    return n * n;
}

function cube(n){
    return n ** 3;
}

function average(numbers){
    const total = numbers.reduce((acc, curr) => acc + curr, 0);
    return total / numbers.length;
}

function max(numbers){
    return Math.max(...numbers);
}

module.exports = {
    square,
    cube,
    average,
    max,
}