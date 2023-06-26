/**
 * Determines whether two strings are equivalent in the 'ru' and 'en' locale with 'upper' case first.
 * @param {string} s1 - The first string to compare.
 * @param {string} s2 - The second string to compare.
 * @returns {number}
 */
function stringCompareWithUpperCaseFirstInRuEnLocales(s1, s2) {
  return s1.localeCompare(s2, ['ru', 'en'], { caseFirst: 'upper' });
}

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

}
