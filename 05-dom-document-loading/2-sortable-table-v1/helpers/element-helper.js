function generateElement(template) {
  const element = document.createElement('div');
  element.innerHTML = template;

  return element.firstElementChild;
}
  
export {generateElement};