function stringCompareWithUpperCaseFirstInRuEnLocales(s1, s2) {
  return s1.localeCompare(s2, ['ru', 'en'], { caseFirst: 'upper' });
}
  
function numberCompare(s1, s2) {
  return s1 - s2;
}

function compare(s1, s2, type = 'string') {
  switch (type) {
  case 'number': {
    return numberCompare(s1, s2);
  }
  case 'string':
  default:
    return stringCompareWithUpperCaseFirstInRuEnLocales(s1, s2);
  }
}

export {
  stringCompareWithUpperCaseFirstInRuEnLocales,
  numberCompare,
  compare,
};
