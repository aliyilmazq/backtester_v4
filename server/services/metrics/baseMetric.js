class BaseMetric {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
  }

  validate(data) {
    throw new Error('validate method must be implemented by subclass');
  }

  calculate(data) {
    throw new Error('calculate method must be implemented by subclass');
  }

  getConfig() {
    return this.config;
  }

  setConfig(config) {
    this.config = { ...this.config, ...config };
  }
}

module.exports = BaseMetric;