import { reactive } from 'vue';

// Create a reactive object to hold the event listeners
const eventBus = reactive({
  listeners: {},
});

// Add a method to register an event listener
eventBus.$on = function (eventName, callback) {
  if (!this.listeners[eventName]) {
    this.listeners[eventName] = [];
  }
  this.listeners[eventName].push(callback);
};

// Add a method to emit an event and call all registered listeners
eventBus.$emit = function (eventName, ...args) {
  const listeners = this.listeners[eventName];
  if (listeners) {
    listeners.forEach((callback) => {
      callback(...args);
    });
  }
};

export default eventBus;
