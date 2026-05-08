function describe(value: string | number | boolean): string{
  switch (typeof value) {
    case "string":
      return `Text with ${value.length} character${value.length !== 1 ? 's' : ''}`;
    
    case "number":
      if (isNaN(value)) {
        return `Number: NaN`;
      }
      if (!isFinite(value)) {
        return `Number: ${value > 0 ? 'Positive' : 'Negative'} Infinity`;
      }
      return `Number: ${value}  ${value % 2 === 0 ? 'Even' : 'Odd'}`;
    
    case "boolean":
      return `Boolean: ${value ? 'True' : 'False'}`;
    
    default:
      throw new Error(`Invalid operation: ${value}`);
  }
}

console.log(describe("Test"));
console.log(describe(2));
console.log(describe(1));
console.log(describe(true));
console.log(describe(false));