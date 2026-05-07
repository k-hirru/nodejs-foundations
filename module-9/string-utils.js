// Return string param with uppercased first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Return string param reversed
function reverse(str) {
 return reverse = [...str].reverse().join('');
}

// Return string param word count
function countWords(str) {
    return str.trim().split(/[\s,]+/).filter(word => word.length > 0).length;
}

// Return true if string param is a valid email
function isEmail(str) {
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return emailRegex.test(str);
}

module.exports = { capitalize, reverse, countWords, isEmail };

console.log(capitalize("test"));
console.log(reverse("test"));
console.log(countWords("test,test,test,test"))
console.log(isEmail("clyde@gmail.com"))