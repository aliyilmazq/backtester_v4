# API Dokümantasyonu

## Genel Bilgiler

Base URL: `http://localhost:5001/api`

Tüm istekler JSON formatında gönderilmeli ve `Content-Type: application/json` header'ı içermelidir.

## Hata Formatı

Tüm hata yanıtları aşağıdaki formatta döner:

```json
{
  "success": false,
  "error": "Hata mesajı",
  "details": {} // Opsiyonel detaylı bilgi
}
```

## Endpoints

### 1. Backtest İşlemleri

#### POST /backtest/run

Yeni bir backtest çalıştırır.

**Request:**
```json
{
  "data": {
    "closes": [number],      // Zorunlu: Kapanış fiyatları
    "opens": [number],       // Opsiyonel
    "highs": [number],       // Opsiyonel
    "lows": [number],        // Opsiyonel
    "volumes": [number],     // Opsiyonel
    "dates": [string]        // Opsiyonel: ISO format tarihler
  },
  "strategy": {
    "type": "string",        // Zorunlu: SMA, EMA, RSI, MACD, BBANDS
    "params": {              // Strateji parametreleri
      // Stratejiye göre değişir
    }
  },
  "parameters": {            // Portfolio parametreleri
    "initialCapital": number,  // Varsayılan: 10000
    "positionSize": number,    // Varsayılan: 1 (100%)
    "commission": number       // Varsayılan: 0
  }
}
```

**Strateji Parametreleri:**

- **SMA/EMA:**
  - `period`: number (varsayılan: 20)
  - `includeShort`: boolean (varsayılan: false)

- **RSI:**
  - `period`: number (varsayılan: 14)
  - `oversoldThreshold`: number (varsayılan: 30)
  - `overboughtThreshold`: number (varsayılan: 70)
  - `includeShort`: boolean (varsayılan: false)

- **MACD:**
  - `fastPeriod`: number (varsayılan: 12)
  - `slowPeriod`: number (varsayılan: 26)
  - `signalPeriod`: number (varsayılan: 9)
  - `includeShort`: boolean (varsayılan: false)

- **BBANDS:**
  - `period`: number (varsayılan: 20)
  - `stdDev`: number (varsayılan: 2)
  - `includeShort`: boolean (varsayılan: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": {
      "equity": [number],
      "trades": [{
        "entryIndex": number,
        "exitIndex": number,
        "entryPrice": number,
        "exitPrice": number,
        "position": number,
        "returns": number,
        "pnl": number,
        "duration": number
      }],
      "dailyReturns": [number],
      "positions": [number]
    },
    "positions": [number],
    "metrics": {
      "sharpeRatio": number,
      "sortinoRatio": number,
      "maxDrawdown": number,
      "tradeStats": {
        "tradeCount": number,
        "avgTradeDuration": number,
        "avgTradeReturn": number,
        "tradesPerMonth": number,
        "daysInMarket": number
      }
    },
    "metadata": {
      "strategy": {},
      "dataPoints": number,
      "initialCapital": number,
      "finalCapital": number,
      "totalReturn": number
    }
  }
}
```

#### GET /backtest/strategies

Mevcut stratejileri listeler.

**Response:**
```json
{
  "success": true,
  "data": [{
    "type": "SMA",
    "name": "SMA",
    "parameters": [{
      "name": "period",
      "type": "number",
      "default": 20,
      "min": 1,
      "max": 200
    }]
  }]
}
```

#### GET /backtest/metrics

Mevcut metrikleri listeler.

**Response:**
```json
{
  "success": true,
  "data": [{
    "type": "SharpeRatio",
    "name": "Sharpe Ratio"
  }]
}
```

#### POST /backtest/indicator

Teknik gösterge hesaplar.

**Request:**
```json
{
  "type": "SMA",              // SMA, EMA, RSI, MACD, BBANDS
  "data": [number],           // Fiyat verileri
  "params": {                 // Gösterge parametreleri
    "period": 20
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [number]            // Hesaplanan gösterge değerleri
}
```

### 2. Veri İşlemleri

#### GET /data/market

Piyasa verilerini getirir.

**Query Parameters:**
- `symbol` (zorunlu): Hisse senedi sembolü
- `from` (zorunlu): Başlangıç tarihi (YYYY-MM-DD)
- `to` (zorunlu): Bitiş tarihi (YYYY-MM-DD)
- `timeframe`: Zaman dilimi (varsayılan: "1Day")

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "timeframe": "1Day",
    "dates": [string],
    "opens": [number],
    "highs": [number],
    "lows": [number],
    "closes": [number],
    "volumes": [number]
  },
  "metadata": {
    "resultsCount": number,
    "ticker": string,
    "queryCount": number
  }
}
```

#### GET /data/search

Sembol araması yapar.

**Query Parameters:**
- `query` (zorunlu): Arama terimi
- `limit`: Maksimum sonuç sayısı (varsayılan: 10)

**Response:**
```json
{
  "success": true,
  "data": [{
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "market": "stocks",
    "locale": "us",
    "type": "CS",
    "currency": "USD"
  }],
  "count": number
}
```

### 3. AI İşlemleri

#### POST /ai-feedback

Backtest sonuçları için AI analizi sağlar.

**Request:**
```json
{
  "metrics": {
    "sharpeRatio": number,
    "maxDrawdown": number,
    // Diğer metrikler
  }
}
```

**Response:**
```json
{
  "success": true,
  "feedback": "AI tarafından oluşturulan analiz metni"
}
```

### 4. Sistem

#### GET /health

API sağlık kontrolü.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "version": "1.0.0"
}
```

## Rate Limiting

API şu anda rate limiting uygulamıyor, ancak Polygon.io API'si kendi limitlerini uygular:
- Free tier: Dakikada 5 istek
- Paid tiers: Plana göre değişir

## Örnek Kullanım

### cURL ile Backtest Çalıştırma

```bash
curl -X POST http://localhost:5001/api/backtest/run \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "closes": [100, 102, 101, 103, 105, 104, 106, 108, 107, 109]
    },
    "strategy": {
      "type": "SMA",
      "params": {
        "period": 3
      }
    }
  }'
```

### JavaScript/Fetch ile Veri Çekme

```javascript
const response = await fetch('http://localhost:5001/api/data/market?symbol=AAPL&from=2023-01-01&to=2023-12-31');
const data = await response.json();
console.log(data);
```