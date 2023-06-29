/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return (obj) => {
    // IDEA TODO: NOT RELEFANT: get deep copy of the object;
    // IDEA TODO: NOT RELEFANT use typeof, check type of the value
           
    // IDEA TODO: RELEVANT использовать конструкцию замыкания 
    // FIX TODO: incorrect property splitter
    // TODO: clear code;
    // 07:00 29.06.23	js задача 1
    // 09:08 29.06.23	done, pull request is ready
    // FIX TODO: stop searching if primitive and 
    return getProperty(obj, path);
  };
}

/**
 * getProperty - returns property value from object by properties path
 * @param {object} obj - object to get property value
 * @param {string} path - the properties path separated by dot
 * @returns property value
 */
function getProperty(obj, path) {
  const dotId = path.indexOf('.');
  const firstKey = dotId > 0 ? path.slice(0, dotId) : path; 
  const nextKey = dotId > 0 ? path.slice(dotId + 1, path.length) : '';    
  
  if (!obj.hasOwnProperty(firstKey)) {
    return;
  }

  const value = obj[firstKey];

  if (nextKey) {
    return getProperty(value, nextKey);
  }

  return value;
}
