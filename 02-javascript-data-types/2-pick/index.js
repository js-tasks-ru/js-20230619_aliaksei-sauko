/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  // process array of fields
  const keys = Array.isArray(fields[0]) ? fields[0] : fields;

  // filter properties
  const resultObjectFields = Object.entries(obj).filter(([key, _]) => keys.includes(key));
  
  // order properties
  const entries = [];
  keys.forEach(f => {
    const item = resultObjectFields.find(([key, _])=> key === f);
    if (item) {
      entries.push(item);
    }
  });

  return Object.fromEntries(entries);
};
