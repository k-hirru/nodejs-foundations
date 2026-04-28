// grade.js
function randomNumber() {
    return Math.floor(Math.random() * 101);
}

const getGrade = (score) => 
    score >= 90 ? "A" :
    score >= 80 ? "B" :
    score >= 70 ? "C" :
    score >= 60 ? "D" : "F";



console.log(getGrade(randomNumber()));
console.log(getGrade(randomNumber()));
console.log(getGrade(randomNumber()));
console.log(getGrade(randomNumber()));
console.log(getGrade(randomNumber()));
