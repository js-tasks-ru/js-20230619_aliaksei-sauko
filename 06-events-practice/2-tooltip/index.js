class Tooltip {
  static #instance = null;

  constructor() {
    if (!Tooltip.#instance) {
      Tooltip.#instance = this;
    } else {
      return Tooltip.#instance;
    }
  }

  initialize() {
    document.addEventListener('pointerover', function (event) {
      if (event.target.dataset.tooltip != undefined) {

        Tooltip.#instance.render(event.target.dataset.tooltip);

        document.addEventListener('pointermove', function (event) {
          Tooltip.#instance.element.style.left = `${event.clientX + 15}px`;
          Tooltip.#instance.element.style.top = `${event.clientY + 15}px`;
        });
      }
    });

    document.addEventListener('pointerout', function (event) {
      if (event.target.dataset.tooltip != undefined) {
        Tooltip.#instance.element?.remove();
      }
    });
  }

  destroy() {
    this.element = null;
  }

  render(text) {
    const tooltipElement = document.createElement('div');

    tooltipElement.className = 'tooltip';
    tooltipElement.innerHTML = text;

    tooltipElement.style.position = 'absolute';
    tooltipElement.style.zIndex = 1000;

    this.element = tooltipElement;

    document.body.append(this.element);
  }
}

export default Tooltip;
