# Geliştirici Dokümantasyonu

## Mimari Genel Bakış

Backtest Platform, modüler bir mimari kullanır:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│  External   │
│   (React)   │     │  (Express)   │     │    APIs     │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
              ┌─────▼─────┐   ┌─────▼─────┐
              │ Services  │   │Controllers│
              └───────────┘   └───────────┘
```

## Backend Yapısı

### Services Katmanı

#### BaseStrategy
Tüm stratejilerin extend ettiği temel sınıf.

```javascript
class BaseStrategy {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
  }
  
  validate(data) {
    // Override in subclass
  }
  
  execute(data) {
    // Override in subclass
  }
}
```

#### BaseMetric
Tüm metriklerin extend ettiği temel sınıf.

```javascript
class BaseMetric {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
  }
  
  validate(data) {
    // Override in subclass
  }
  
  calculate(data) {
    // Override in subclass
  }
}
```

### Controller Katmanı

Controller'lar HTTP isteklerini alır ve uygun servislere yönlendirir.

```javascript
class BacktestController {
  async runBacktest(req, res) {
    // 1. Validate request
    // 2. Call backtest engine
    // 3. Return formatted response
  }
}
```

### Middleware

#### Error Handler
Tüm hataları yakalar ve kullanıcı dostu mesajlar döner.

#### Validation
İstek verilerini doğrular.

## Frontend Yapısı

### Component Hiyerarşisi

```
App
└── LandingPage
    └── ErrorBoundary
        └── BacktestWizard
            ├── StepIndicator
            └── Steps
                ├── StepSymbolSelection
                ├── StepDateRange
                ├── StepStrategySelection
                ├── StepParameterConfig
                ├── StepReview
                └── StepResults
```

### State Yönetimi

BacktestWizard component'i merkezi state'i yönetir:

```javascript
const [backtestConfig, setBacktestConfig] = useState({
  symbol: '',
  startDate: '',
  endDate: '',
  strategy: null,
  parameters: {}
});
```

### API İletişimi

Services klasöründeki modüller API iletişimini yönetir:

```javascript
// backtestService.js
async runBacktest(config) {
  return api.post('/backtest/run', config);
}
```

## Yeni Özellik Ekleme

### 1. Yeni Strateji Ekleme

1. `server/services/strategies/` klasöründe yeni dosya oluşturun:

```javascript
// bollingerStrategy.js
const BaseStrategy = require('./baseStrategy');

class BollingerStrategy extends BaseStrategy {
  constructor(config = {}) {
    super('Bollinger', config);
    this.period = config.period || 20;
    this.stdDev = config.stdDev || 2;
  }
  
  validate(data) {
    // Validation logic
  }
  
  execute(data) {
    // Strategy logic
    return {
      positions: [...],
      metadata: {...}
    };
  }
}

module.exports = BollingerStrategy;
```

2. `server/services/strategies/index.js` dosyasına ekleyin:

```javascript
module.exports = {
  // ...existing strategies
  Bollinger: require('./bollingerStrategy')
};
```

3. Frontend'de strateji parametrelerini tanımlayın.

### 2. Yeni Metrik Ekleme

1. `server/services/metrics/` klasöründe yeni dosya oluşturun:

```javascript
// calmarRatio.js
const BaseMetric = require('./baseMetric');

class CalmarRatio extends BaseMetric {
  constructor(config = {}) {
    super('Calmar Ratio', config);
  }
  
  calculate(data) {
    // Calculation logic
    return {
      value: calmarRatio,
      metadata: {...}
    };
  }
}

module.exports = CalmarRatio;
```

2. Index dosyasına ekleyin ve frontend'de gösterin.

## Test Yazma

### Unit Test Örneği

```javascript
// tests/unit/smaStrategy.test.js
const SMAStrategy = require('../../server/services/strategies/smaStrategy');

describe('SMAStrategy', () => {
  it('should generate buy signal when price crosses above SMA', () => {
    const strategy = new SMAStrategy({ period: 3 });
    const data = {
      closes: [100, 102, 104, 106],
      smaValues: [102, 104],
      includeShort: false
    };
    
    const result = strategy.execute(data);
    expect(result.positions[3]).toBe(1); // Buy signal
  });
});
```

### Integration Test Örneği

```javascript
// tests/integration/workflow.test.js
describe('Complete Backtest Workflow', () => {
  it('should execute full backtest', async () => {
    // 1. Fetch market data
    // 2. Run backtest
    // 3. Verify results
  });
});
```

## Debugging

### Backend Debugging

1. Environment variable ile detaylı log:
```bash
DEBUG=* npm run server
```

2. VS Code debug config:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "program": "${workspaceFolder}/server/server.js",
  "envFile": "${workspaceFolder}/.env"
}
```

### Frontend Debugging

1. React Developer Tools kullanın
2. Network tab'de API isteklerini inceleyin
3. Console'da hata mesajlarını kontrol edin

## Performance Optimizasyonu

### Backend

1. **Caching**: Sık kullanılan verileri cache'leyin
2. **Batch Processing**: Büyük veri setlerini parçalara ayırın
3. **Async Operations**: CPU-intensive işlemleri async yapın

### Frontend

1. **Lazy Loading**: Büyük component'leri lazy load edin
2. **Memoization**: React.memo ve useMemo kullanın
3. **Debouncing**: API çağrılarını debounce edin

## Deployment

### Production Build

```bash
# Frontend build
npm run build

# Environment variables
export NODE_ENV=production
export PORT=80

# Start server
node server/server.js
```

### Docker

```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["node", "server/server.js"]
```

## Güvenlik

1. **API Keys**: Asla frontend'de saklamayın
2. **Input Validation**: Tüm kullanıcı girdilerini doğrulayın
3. **Rate Limiting**: Production'da rate limiting ekleyin
4. **CORS**: Production'da CORS'u sınırlayın

## Monitoring

### Önerilen Araçlar

1. **Logging**: Winston veya Bunyan
2. **APM**: New Relic veya DataDog
3. **Error Tracking**: Sentry
4. **Analytics**: Google Analytics veya Mixpanel