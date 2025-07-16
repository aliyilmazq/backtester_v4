# Backtest Platform v4

Modern ve modüler bir finansal backtesting platformu. Teknik analiz stratejilerini test edin, performans metriklerini analiz edin ve sonuçları görselleştirin.

## 🚀 Özellikler

- **Modüler Backend Mimarisi**: Stratejiler, metrikler ve göstergeler için ayrı modüller
- **RESTful API**: Tüm işlemler için standart API endpoint'leri
- **Stepper Tabanlı UI**: Kullanıcı dostu, adım adım backtest oluşturma
- **Gerçek Zamanlı Veri**: Polygon.io entegrasyonu ile güncel piyasa verileri
- **Kapsamlı Metrikler**: Sharpe, Sortino, Max Drawdown ve daha fazlası
- **Görselleştirme**: Chart.js ile interaktif grafikler
- **Hata Yönetimi**: Detaylı hata mesajları ve kullanıcı dostu geri bildirimler
- **Test Coverage**: Birim ve entegrasyon testleri

## 📋 Gereksinimler

- Node.js 14+
- npm veya yarn
- Polygon.io API anahtarı
- OpenAI API anahtarı (AI analizi için)

## 🛠️ Kurulum

1. Repository'yi klonlayın:
```bash
git clone https://github.com/yourusername/backtester_v4.git
cd backtester_v4
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Çevre değişkenlerini ayarlayın:
```bash
cp .env.example .env
# .env dosyasını düzenleyip API anahtarlarınızı ekleyin
```

4. Geliştirme sunucularını başlatın:
```bash
npm run dev
```

Bu komut hem backend (port 5001) hem de frontend (port 3000) sunucularını başlatır.

## 🏗️ Proje Yapısı

```
backtester_v4/
├── server/                    # Backend kodu
│   ├── controllers/           # API controller'ları
│   ├── routes/               # API route tanımlamaları
│   ├── services/             # İş mantığı servisleri
│   │   ├── strategies/       # Strateji implementasyonları
│   │   ├── metrics/          # Metrik hesaplamaları
│   │   └── indicators/       # Teknik gösterge servisi
│   ├── middleware/           # Express middleware'leri
│   └── server.js            # Ana server dosyası
├── src/                      # Frontend React kodu
│   ├── components/           # React bileşenleri
│   │   └── BacktestWizard/   # Ana wizard bileşeni
│   ├── services/             # API client servisleri
│   └── utils/               # Yardımcı fonksiyonlar
├── tests/                    # Test dosyaları
│   ├── integration/          # Entegrasyon testleri
│   └── unit/                # Birim testleri
└── docs/                    # Dokümantasyon
```

## 📡 API Endpoint'leri

### Backtest İşlemleri

#### POST /api/backtest/run
Backtest çalıştırır.

**Request Body:**
```json
{
  "data": {
    "closes": [100, 102, 101, ...],
    "opens": [...],
    "highs": [...],
    "lows": [...],
    "volumes": [...]
  },
  "strategy": {
    "type": "SMA",
    "params": {
      "period": 20,
      "includeShort": false
    }
  },
  "parameters": {
    "initialCapital": 10000,
    "positionSize": 1,
    "commission": 0.001
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": {...},
    "positions": [...],
    "metrics": {
      "sharpeRatio": 1.25,
      "maxDrawdown": -0.15,
      ...
    }
  }
}
```

#### GET /api/backtest/strategies
Mevcut stratejileri listeler.

#### GET /api/backtest/metrics
Mevcut metrikleri listeler.

### Veri İşlemleri

#### GET /api/data/market
Piyasa verilerini getirir.

**Query Parameters:**
- `symbol`: Hisse senedi sembolü (örn: AAPL)
- `from`: Başlangıç tarihi (YYYY-MM-DD)
- `to`: Bitiş tarihi (YYYY-MM-DD)
- `timeframe`: Zaman dilimi (varsayılan: 1Day)

#### GET /api/data/search
Sembol araması yapar.

**Query Parameters:**
- `query`: Arama terimi
- `limit`: Maksimum sonuç sayısı (varsayılan: 10)

## 🧪 Test Çalıştırma

```bash
# Tüm testleri çalıştır
npm run test:all

# Sadece entegrasyon testleri
npm run test:integration

# Sadece birim testleri
npm run test:unit

# Coverage raporu ile
npm run test:coverage
```

## 📊 Desteklenen Stratejiler

1. **SMA (Simple Moving Average)**: Basit hareketli ortalama
2. **EMA (Exponential Moving Average)**: Üstel hareketli ortalama
3. **RSI (Relative Strength Index)**: Göreceli güç endeksi
4. **MACD**: Moving Average Convergence Divergence
5. **Bollinger Bands**: Bollinger bantları

## 📈 Performans Metrikleri

- **Sharpe Ratio**: Risk-ayarlı getiri
- **Sortino Ratio**: Negatif volatilite odaklı risk-ayarlı getiri
- **Maximum Drawdown**: Maksimum değer kaybı
- **Trade Statistics**: İşlem istatistikleri (kazanma oranı, ortalama süre vb.)

## 🔧 Geliştirme

### Yeni Strateji Ekleme

1. `server/services/strategies/` klasöründe yeni strateji dosyası oluşturun
2. `BaseStrategy` sınıfından extend edin
3. `validate()` ve `execute()` metodlarını implement edin
4. `server/services/strategies/index.js` dosyasına ekleyin

### Yeni Metrik Ekleme

1. `server/services/metrics/` klasöründe yeni metrik dosyası oluşturun
2. `BaseMetric` sınıfından extend edin
3. `validate()` ve `calculate()` metodlarını implement edin
4. `server/services/metrics/index.js` dosyasına ekleyin

## 🐛 Hata Ayıklama

- Backend logları: `npm run server` çıktısını kontrol edin
- Frontend logları: Tarayıcı konsolu
- Test logları: `npm run test:all -- --verbose`

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'e push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

Sorularınız için issue açabilir veya [destek@example.com](mailto:destek@example.com) adresine mail gönderebilirsiniz.
