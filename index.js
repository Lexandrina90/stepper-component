class Stepper extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this._value = 0;
    this.step = 1;
    this.isFill = false;
    this.fill = '#2b2220';
    this.btnBackground = '#2b2220';
    this.minusPlusBackground = '#ffb4a4';
  }

  connectedCallback() {
    this.initialValue = parseFloat(this.getAttribute('initial-value')) || 0;
    this.step = parseFloat(this.getAttribute('step')) || 1;
    this.isFill = this.getAttribute('fill') === 'true';
    this.btnBackground = this.isFill ? '#ffb4a4' : '#2b2220';
    this.minusPlusBackground = this.isFill ? '#2b2220' : '#ffb4a4';
    this.value = this.initialValue;

    const container = document.createElement('div');
    container.setAttribute('class', 'stepper-container');

    container.innerHTML = `
        <button class="decrement-btn">
          <div class="decrement-btn-minus">
            <div class="decrement-btn-minus-h"></div>
          </div>
        </button>
        <div class="value-display">${this.initialValue}</div>
        <button class="increment-btn">
          <div class="increment-btn-plus">
            <div class="increment-btn-plus-v"></div>
            <div class="increment-btn-plus-h"></div>
          </div>
        </button>
      `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(container);

    this.updateStyles();
    this.updateDisplay();
    this.addEventListeners();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'initial-value':
        this.initialValue = parseFloat(newValue) || 0;
        this.value = this.initialValue;
        this.updateDisplay();
        break;
      case 'step':
        this.step = parseFloat(newValue) || 1;
        break;
      case 'fill':
        this.isFill = newValue === 'true';
        this.btnBackground = this.isFill ? '#ffb4a4' : '#2b2220';
    this.minusPlusBackground = this.isFill ? '#2b2220' : '#ffb4a4';
        this.updateStyles();
        this.updateDisplay();
        break;
      default:
        break;
    }
  }
  static get observedAttributes() {
    return ['initial-value', 'step', 'fill'];
  }



  addEventListeners() {
    const decrementBtn = this.shadowRoot.querySelector('.decrement-btn');
    const incrementBtn = this.shadowRoot.querySelector('.increment-btn');

    const decrementButtonClickHandler = () => {
      this.decrement(this.step);
    };
    decrementBtn.addEventListener('click', decrementButtonClickHandler);
    this.decrementButtonClickHandler = decrementButtonClickHandler;

    const incrementButtonClickHandler = () => {
      this.increment(this.step);
    }
    incrementBtn.addEventListener('click', incrementButtonClickHandler);
    this.incrementButtonClickHandler = incrementButtonClickHandler;
  }

  updateStyles() {
    const existingStyle = this.shadowRoot.querySelector('style');
    if (existingStyle) {
      existingStyle.remove();
    }

    //CSS-style
    const style = document.createElement('style');
    console.log(style.isConnected);

    style.textContent = `
      html,
      body {
        margin: 0;
        padding: 0;
      }
      .stepper-container {
        display: flex;
        align-items: center;
        position: relative;
        margin: 20px 50px;
        width: 126px;
        height: 40px;
      }
      
      .decrement-btn {
        height: 40px;
        display: inline-block;
        font-size: 14px;
        border-radius: 8px 0px 0px 8px;
        border: 1px solid #ffb4a4;
        background: ${this.btnBackground};
        border-right: 0;
      }
      .decrement-btn-minus {
       
        padding: 16px;
        position: relative;
        background: ${this.btnBackground};
        border-right: 0;
      }
      .decrement-btn-minus-h {
        position: absolute;
        background: ${this.minusPlusBackground};
        width: 14px;
        height: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .value-display {
        display: inline-block;
        padding: 10.8px 18px;
        font-size: 14px;
        color: #ffb4a4;
        border: 1px solid #ffb4a4;
        font-weight: 700;
        background: #2b2220;
      }
      .increment-btn {
        border-radius: 0px 8px 8px 0px;
        border: 1px solid #ffb4a4;
        border-left: 0;
        background: ${this.btnBackground};
        height: 40px;
      }
      .increment-btn-plus {
        padding: 16px;
        position: relative;
        background: ${this.btnBackground};
        border-left: 0;
      }
      .increment-btn-plus-v,
      .increment-btn-plus-h {
        position: absolute;
        background: ${this.minusPlusBackground};
      }
      
      .increment-btn-plus-v {
        width: 2px;
        height: 14px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .increment-btn-plus-h {
        width: 14px;
        height: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .decrement-btn , .increment-btn {
        cursor: pointer;
      }
      .fill {
        background: ${this.fill};
      }
    `;

    this.shadowRoot.appendChild(style);
  }
 
  updateDisplay() {
    const valueDisplay = this.shadowRoot.querySelector('.value-display');
    if (valueDisplay) {
      valueDisplay.textContent = this._value;
    }
  }
  disconnectedCallback() {
    const decrementBtn = this.shadowRoot.querySelector('.decrement-btn');
    const incrementBtn = this.shadowRoot.querySelector('.increment-btn');
    decrementBtn.removeEventListener('click', this.decrementButtonClickHandler);
    incrementBtn.removeEventListener('click', this.incrementButtonClickHandler);

  }
  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.dispatchEvent(new CustomEvent('stepperchange', { detail: this._value }));
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
}
customElements.define('stepper-component', Stepper);


