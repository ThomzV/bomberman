export class StateManager {
    constructor() {
      this.state = {};
      this.listeners = [];
    }
  
    addListener(listener) {
      this.listeners.push(listener);
    }
  
    removeListener(listener) {
      this.listeners = this.listeners.filter(obs => obs !== listener);
    }
  
    notifyListeners() {
      this.listeners.forEach(listener => listener.update(this.state));
    }
  
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.notifyListeners();
    }
  
    getState(stateName) {
      return this.state[stateName];
    }
}