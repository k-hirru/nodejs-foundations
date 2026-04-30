// date.js

const dayjs = require('dayjs');

var dateToday = dayjs().format('YYYY-MM-DD');
var inSevenDays = dayjs().add(7, 'day').format('YYYY-MM-DD');
var aMonthAgo = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
const sevenDays = [];

console.log(dateToday);
console.log(inSevenDays);
console.log(aMonthAgo);

for (let i = 1; i <= 7; i++){
    sevenDays.push(dayjs().day(i).format('dddd'));
}

sevenDays.forEach(day => {
    console.log(day);
});

