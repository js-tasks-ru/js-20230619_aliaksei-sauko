import { invertObj } from './index.js';

describe('objects-arrays-intro-to-testing/invert-object', () => {
  it('should swap keys and values and return new object', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2'
    };

    const expected = {
      value1: 'key1',
      value2: 'key2',
    };

    expect(invertObj(obj)).toEqual(expected);
  });

  it('should swap keys and values and return new object. Process number values', () => {
    const obj = {
      numericKey1: 1,
      numericKey2: 2,
    };

    const expected = {
      1: 'numericKey1',
      2: 'numericKey2',
    };

    expect(invertObj(obj)).toEqual(expected);
  });

  it('should swap keys and values and return new object. Process string with spaces', () => {
    const obj = {
      keyWithSpaces1: 'some text with spaces 1',
      keyWithSpaces2: 'some text with spaces 2',
    };

    const expected = {
      'some text with spaces 1': 'keyWithSpaces1',
      'some text with spaces 2': 'keyWithSpaces2',
    };

    expect(invertObj(obj)).toEqual(expected);
  });

  it('should swap keys and values and return new object. Process reserved words such as "let", "var", "return"', () => {
    const obj = {
      letKey: 'let',
      varKey: 'var',
      returnKey: 'return',
    };    
   
    const expected = {
      let: 'letKey',
      var: 'varKey',
      return: 'returnKey',
    };

    expect(invertObj(obj)).toEqual(expected);
  });

  it('should return empty object if was passed object without values', () => {
    expect(invertObj({})).toEqual({});
  });

  it('should return "undefined" if object wasn\'t passed', () => {
    expect(invertObj()).toBeUndefined();
  });
});
