export class ElementObserver {
  constructor(selector, callback) {
    this.selector = selector;
    this.callback = callback;
    this.observe();
  }

  observe() {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const matchingElements = document.querySelectorAll(this.selector);
          if (matchingElements.length > 0) {
            observer.disconnect();
            this.callback(matchingElements);
            return;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

export class ToggleSetting {
  constructor(toggleElement, settingName, defaultValue, onLoadedCallback) {
    // Get the toggle element
    this.toggle = toggleElement;

    // Get the setting name
    this.settingName = settingName;

    // Get the default value
    this.defaultValue = defaultValue;
    
    // Set the loaded callback
    this.loadedCallback = onLoadedCallback;

    // Check localStorage for the saved setting
    const savedSetting = localStorage.getItem(this.settingName);

    // Update the toggle state based on the saved setting or default value
    if (savedSetting === null) {
      // If setting not found in localStorage, use default value
      this.toggle.checked = this.defaultValue;
      localStorage.setItem(this.settingName, this.toggle.checked);
    } else if (savedSetting === 'true') {
      this.toggle.checked = true;
    } else if (savedSetting === 'false') {
      this.toggle.checked = false;
    }
    
    this.loaded();

    // Add event listener for toggle change
    this.toggle.addEventListener('change', this.handleToggle.bind(this));
  }

  // Function to handle toggle change
  handleToggle() {
    // Save the current toggle state to localStorage
    localStorage.setItem(this.settingName, this.toggle.checked);

    this.turned();
  }

  // Function to be called when the toggle is turned
  turned() {
    // Check if a callback function is provided

    if (typeof this.turnedCallback === 'function') {
      // Call the provided callback function
      this.turnedCallback(this.toggle.checked);
    }
  }

  // Function to bind a callback function to the turned event
  onTurned(callback) {
    // Set the callback function
    this.turnedCallback = callback;
  }
  
  loaded() {
    // Check if a callback function is provided
    if (typeof this.loadedCallback === 'function') {
      // Call the provided callback function
      this.loadedCallback(this.toggle.checked);
    }
  }
  
}

export class ButtonSetting {
  constructor(buttonElement) {
    this.buttonElement = buttonElement;

    // Initialize event handlers
    this.clickHandler = null;
    this.loadHandler = null;
    this.eventHandlers = {};

    // Add event listener for button click
    this.buttonElement.addEventListener('click', this.handleClick.bind(this));
  }

  // Function to handle button click
  handleClick() {
    // Call the click handler function
    if (typeof this.clickHandler === 'function') {
      this.clickHandler();
    }
  }

  // Function to bind a callback function to the click event
  onClick(callback) {
    this.clickHandler = callback;
  }

  // Function to bind a callback function to the load event
  onLoad(callback) {
    this.loadHandler = callback;
    // Call the load handler function
    if (typeof this.loadHandler === 'function') {
      this.loadHandler();
    }
  }

  // Function to bind a callback function to a custom event
  on(eventName, callback) {
    this.eventHandlers[eventName] = callback;
  }

  // Function to trigger a custom event
  trigger(eventName) {
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName]();
    }
  }
}

export class RedirectButton extends ButtonSetting {
  constructor(buttonElement, redirectURL) {
    super(buttonElement);
    this.redirectURL = redirectURL;
  }

  // Override the handleClick method to open a new window or tab with the specified URL
  handleClick() {
    // Call the click handler function if provided
    if (typeof this.clickHandler === 'function') {
      this.clickHandler();
    }
    // Open a new window or tab with the specified URL
    window.open(this.redirectURL, '_blank');
  }
}