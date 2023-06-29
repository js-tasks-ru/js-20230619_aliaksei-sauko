/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size = string.length) {
  if (size < 1 || string === '') {
    return '';
  }
  
  let trimmedString = '';
  let currentSubstringLength = 0;
  let currentChar = '';
       
  for (let i = 0; i < string.length; i++) {
    // текущий символ меняется, когда закончились соответствия в исходной строке
    if (currentChar !== string[i]) {
      currentChar = string[i];
      // обнуляем счётчик длинны
      currentSubstringLength = 0;
    }

    // добавляем символы, пока не достигнуто ограничение размера
    if (currentSubstringLength < size)
    {
      trimmedString += currentChar;
      currentSubstringLength++;
    } 
  }

  return trimmedString;
}
