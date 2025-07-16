class BaseStrategy {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
  }

  validate(data) {
    throw new Error('validate method must be implemented by subclass');
  }

  execute(data) {
    throw new Error('execute method must be implemented by subclass');
  }

  getConfig() {
    return this.config;
  }

  setConfig(config) {
    this.config = { ...this.config, ...config };
  }
}

module.exports = BaseStrategy;