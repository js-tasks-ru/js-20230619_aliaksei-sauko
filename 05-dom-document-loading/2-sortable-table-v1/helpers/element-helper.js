function removeChildren(element) {
  if (!element?.children) {
    return;
  }

  const childrenCount = element.children.length;
  for (let i = 0; i < childrenCount; i++) {
    element.children[0].remove();
  }
}

export { removeChildren };
