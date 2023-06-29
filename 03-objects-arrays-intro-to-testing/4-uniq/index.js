/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr = []) {
  let trimmedArray = [];
  let currentItem;
         
  for (let i = 0; i < arr.length; i++) {
    if (currentItem === arr[i]) { 
        continue;
    }

    currentItem = arr[i];
    trimmedArray.push(currentItem);
  }
  
  return trimmedArray;
}