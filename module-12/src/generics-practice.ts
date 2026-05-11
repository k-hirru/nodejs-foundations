// 1. Promise<User>
// An async operation which eventually resolves with a User object or rejects with an error.

// 2. Array<string>
// An array where every item is of type string.

// 3. Map<string, number>
// A key-value store where every key is a string and every value is a number.

// 4. Request<{ id: string }, {}, CreateTaskBody>
// An Express request with route params containing an id string, no query params,
// and body is shaped like CreateTaskBody.

// 5. (items: T[]) => T | undefined
// A function that takes an array of any one type T and returns either an item of that
// same type or undefined.

function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([10, 20, 30]);   
const firstString = firstItem(['a', 'b', 'c']);

console.log(firstNumber); 
console.log(firstString);
