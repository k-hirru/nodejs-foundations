// spot-the-bug.js

// function getNumber() {
//     return new Promise(resolve => {
//       setTimeout(() => resolve(42), 500);
//     });
//   }

//   function main() {
//     const number = getNumber();
//     console.log('The number is:', number);
//   }

// main();

function getNumber() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(42), 500);
  });
}

async function main() {
  const number = await getNumber();
  console.log("The number is:", number);
}

main();
