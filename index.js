class Stepper extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode:'open'});

    const initialValue = parseFloat(this.getAttribute('initial-value')) || 0;
    const step = parseFloat(this.getAttribute('step')) || 1;
    const fill = this.getAttribute('fill') || '#ffb4a4';
    const btnBackground = fill === '#ffb4a4' ? '#ffb4a4' : '#2b2220';
    const minusPlusBackground = fill === '#ffb4a4' ? '#2b2220' : '#ffb4a4';


    const container = document.createElement('div');
    container.setAttribute('class', 'stepper-container');

    const decrementBtn = document.createElement('button');
    decrementBtn.setAttribute('class', 'decrement-btn');
    decrementBtn.style.background = btnBackground;
    const minus = document.createElement('div');
    minus.setAttribute('class','decrement-btn-minus');
    minus.style.background = btnBackground;
    const minusH = document.createElement('div');
    minusH.setAttribute('class', 'decrement-btn-minus-h');
    minusH.style.background = minusPlusBackground;
    minus.appendChild(minusH);
    decrementBtn.appendChild(minus);
    decrementBtn.addEventListener('click', () => {
      this.decrement(step);
    })

    const incrementBtn = document.createElement('button');
    incrementBtn.setAttribute('class', 'increment-btn');
    incrementBtn.style.background = btnBackground;
    const plus = document.createElement('div');
    plus.setAttribute('class','increment-btn-plus');
    plus.style.background = btnBackground;
    const plusV = document.createElement('div');
    plusV.setAttribute('class','increment-btn-plus-v');
    plusV.style.background = minusPlusBackground;
    const plusH = document.createElement('div');
    plusH.setAttribute('class','increment-btn-plus-h');
    plusH.style.background = minusPlusBackground;
    plus.appendChild(plusV);
    plus.appendChild(plusH);
    incrementBtn.appendChild(plus);
    incrementBtn.addEventListener('click', () => {
      this.increment(step);
    });
    
    const valueDisplay = document.createElement('span');
    valueDisplay.setAttribute('class','value-display');
    valueDisplay.textContent = initialValue;

    container.appendChild(decrementBtn);
    container.appendChild(valueDisplay);
    container.appendChild(incrementBtn);


    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '/style.css');

    shadow.appendChild(linkElem);
    shadow.appendChild(container);

    this._value = initialValue;

  }
  get value() {
    return this._value;
  }

  set value (newValue) {
    this._value = newValue;
    this.dispatchEvent(new CustomEvent('stepperchange', {detail: this._value}));
    this.updateDisplay();
  }

  increment(step) {
    const precision = step.toString().split('.')[1]?.length || 0;
    this.value = (Math.round(this._value / step) * step + step).toFixed(precision);
  }

  decrement(step) {
    const precision = step.toString().split('.')[1]?.length || 0;
    this.value = (Math.round(this._value / step) * step - step).toFixed(precision);
  }
  updateDisplay() {
    const valueDisplay = this.shadowRoot.querySelector('.value-display');
    valueDisplay.textContent = this._value;

  }
}
customElements.define('stepper-component', Stepper); 
