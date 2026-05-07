const { capitalize, reverse, countWords, isEmail } = require('./string-utils');

describe('capitalize', () => {
  test('uppercases the first letter of a word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('returns empty string unchanged', () => {
    expect(capitalize('')).toBe('');
  });

  test('leaves already-capitalized string unchanged', () => {
    expect(capitalize('World')).toBe('World');
  });
});

describe('reverse', () => {
  test('reverses a normal string', () => {
    expect(reverse('hello')).toBe('olleh');
  });

  test('returns empty string unchanged', () => {
    expect(reverse('')).toBe('');
  });

  test('handles a single character', () => {
    expect(reverse('a')).toBe('a');
  });
});

describe('countWords', () => {
  test('counts space-separated words', () => {
    expect(countWords('one two three')).toBe(3);
  });

  test('counts comma-separated words', () => {
    expect(countWords('one,two,three')).toBe(3);
  });

  test('returns 0 for an empty string', () => {
    expect(countWords('')).toBe(0);
  });

  test('handles extra whitespace around words', () => {
    expect(countWords('  hello   world  ')).toBe(2);
  });
});

describe('isEmail', () => {
  test('returns true for a valid email', () => {
    expect(isEmail('user@example.com')).toBe(true);
  });

  test('returns false for a string missing @', () => {
    expect(isEmail('notanemail.com')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(isEmail('')).toBe(false);
  });

  test('returns false for an address missing a TLD', () => {
    expect(isEmail('user@domain')).toBe(false);
  });
});
