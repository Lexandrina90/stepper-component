class Stepper extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const initialValue = parseFloat(this.getAttribute('initial-value')) || 0;
    const step = parseFloat(this.getAttribute('step')) || 1;
    const fill = this.getAttribute('fill') === 'true' ? '#ffb4a4' : '#2b2220';
    const btnBackground = fill === '#ffb4a4' ? '#ffb4a4' : '#2b2220';
    const minusPlusBackground = fill === '#ffb4a4' ? '#2b2220' : '#ffb4a4';


    const container = document.createElement('div');
    container.setAttribute('class', 'stepper-container');

    container.innerHTML = `
      <button class="decrement-btn" style="background: ${btnBackground}">
        <div class="decrement-btn-minus" style="background: ${btnBackground}">
          <div class="decrement-btn-minus-h" style="background: ${minusPlusBackground}"></div>
        </div>
      </button>
      <div class="value-display">${initialValue}</div>
      <button class="increment-btn" style="background: ${btnBackground}">
        <div class="increment-btn-plus" style="background: ${btnBackground}">
          <div class="increment-btn-plus-v" style="background: ${minusPlusBackground}"></div>
          <div class="increment-btn-plus-h" style="background: ${minusPlusBackground}"></div>
        </div>
      </button>
    `;

    const decrementBtn = container.querySelector('.decrement-btn');
    const decrementButtonClickHandler = () => {
      this.decrement(step);
    };
    decrementBtn.addEventListener('click', decrementButtonClickHandler);

    const incrementBtn = container.querySelector('.increment-btn');
    const incrementButtonClickHandler = () => {
      this.increment(step);
    };
    
    incrementBtn.addEventListener('click', incrementButtonClickHandler);



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
        background: #2b2220;
        border-right: 0;
      }
      .decrement-btn-minus {
       
        padding: 16px;
        position: relative;
        background: #2b2220;
        border-right: 0;
      }
      .decrement-btn-minus-h {
        position: absolute;
        background: #ffb4a4;
        width: 14px;
        height: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .value-display {
        display: inline-block;
        padding: 10.9px 18px;
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
        background:#2b2220;
        height: 40px;
      }
      .increment-btn-plus {
        padding: 16px;
        position: relative;
        background: #2b2220;
        border-left: 0;
      }
      .increment-btn-plus-v,
      .increment-btn-plus-h {
        position: absolute;
        background: #ffb4a4;
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
    `

    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(container);

    this._value = initialValue;
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
  updateDisplay() {
    const valueDisplay = this.shadowRoot.querySelector('.value-display');
    valueDisplay.textContent = this._value;
  }
  disconnectedCallback() {
    decrementBtn.removeEventListener('click', decrementButtonClickHandler);
    incrementBtn.removeEventListener('click', incrementButtonClickHandler);
  }
}

customElements.define('stepper-component', Stepper);


