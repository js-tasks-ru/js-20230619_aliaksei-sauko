/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return (obj) => {
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
  
  if (firstKey in obj) {
    const value = obj[firstKey];

    if (nextKey) {
      return getProperty(value, nextKey);
    }

    return value;
  }
          
  return;    
}
