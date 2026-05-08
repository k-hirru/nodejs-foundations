type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

const result: number = "forty-two";                          // 1: string assigned to number
const op: Operation = 'modulo';                              // 2: 'modulo' not in union
function add(a: number, b: number): number { return a + b; }
const sum = add(10, "5");                                    // 3: string passed where number expected
const total: number[] = [1, 2, 3];
console.log(total.toUpperCase());                            // 4: toUpperCase() doesn't exist on number[]
const user = { name: "Alice" };
console.log(user.age.toString());                            // 5: 'age' doesn't exist on type


const resultCorrect: number = 10;
const opCorrect: Operation = 'add';
const sumCorrect = add(10, 5);
console.log(total);
console.log(user.name.toString());     