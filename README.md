# ClassyTrades - Real-time Tick Distribution Analysis Tool

## Overview

ClassyTrades is a modern, interactive trading analysis platform that provides real-time tick distribution analysis with market insights. The application integrates with Deriv's market data API to display live trading patterns and digit distribution analytics.

## Features

### 📊 Core Analytics

- **Real-time Digit Distribution**: Analyze the distribution of the last digit (0-9) in real-time price movements
- **Pattern Analysis**: Track Even/Odd and Over/Under patterns with visual indicators
- **Market Movement Chart**: Live price movement visualization using Chart.js
- **Statistical Analysis**: Highest, second-highest, lowest, and second-lowest digit occurrences

### 🎨 User Interface

- **Modern Dark Theme**: Professional gradient-based design with glassmorphism effects
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data refresh with smooth animations
- **Pattern History**: Visual sequence of Even/Odd patterns

### ⚙️ Configuration

- **Tick Count**: Adjustable number of ticks to analyze (10-1000)
- **Update Interval**: Configurable refresh rate (100-5000ms)
- **Auto Refresh**: Toggle automatic data updates
- **Market Selection**: Choose from Volatility 10/25/50/75/100 indices

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Chart.js for real-time graphing
- **Styling**: Modern CSS with Flexbox and CSS Grid
- **Architecture**: Object-oriented JavaScript with modular design

## File Structure

```
classytrades/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── app.js             # Core application logic and analysis engine
└── README.md          # Documentation
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Riskie123/classytrades.git
cd classytrades
```

2. Open in a web browser:
```bash
open index.html
# or
firefox index.html
# or use any web server:
python -m http.server 8000
```

## Usage

### Starting the Analysis

1. Click the **Run** button to start live tick collection
2. Watch the digit distribution update in real-time
3. Monitor pattern sequences in the Pattern Analysis section
4. View live price movements in the Market Movement chart

### Configuring Settings

1. Adjust **Tick Count** to change the number of ticks analyzed
2. Modify **Update Interval** to change the refresh rate
3. Toggle **Auto Refresh** to enable/disable automatic updates
4. Select different markets from the dropdown

### Understanding the Analytics

#### Digit Distribution
- Shows how many times each digit (0-9) appears in the last digit of prices
- Percentages update in real-time based on collected ticks
- Color coding highlights significant patterns

#### Pattern Analysis
- **EVEN/ODD**: Tracks whether the last digit is even (0,2,4,6,8) or odd (1,3,5,7,9)
- **OVER/UNDER**: Analyzes if the digit is over 5 or under 5
- Visual sequence shows the last 50 patterns

## API Integration (Production)

For production use with real Deriv market data:

```javascript
// Replace generateTick() with actual Deriv API integration
const DerivAPI = require('@deriv/deriv-api');

const api = new DerivAPI({ token: 'your-api-token' });
api.subscribe({
    ticks: 'frxEURUSD',
    subscribe: 1
});
```

## Performance Considerations

- Maintains a rolling buffer of the last N ticks (configurable)
- Efficient DOM updates using batch operations
- Chart.js configured for performance with `update('none')`
- Minimal memory footprint with automatic data cleanup

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features in Development

- [ ] WebSocket integration for live Deriv data
- [ ] Historical data export (CSV/JSON)
- [ ] Advanced pattern recognition (ML-based)
- [ ] Multiple market symbol tracking
- [ ] Custom alert notifications
- [ ] User authentication and data persistence
- [ ] Trading bot integration

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@classytrades.app

## Changelog

### v1.0.0 (2026-08-17)
- Initial release
- Real-time digit distribution analysis
- Pattern analysis (Even/Odd, Over/Under)
- Live market movement chart
- Responsive design
- Settings configuration panel

## Roadmap

1. **Phase 1**: Core analysis features ✅
2. **Phase 2**: Real Deriv API integration
3. **Phase 3**: Advanced analytics and machine learning
4. **Phase 4**: Trading automation features
5. **Phase 5**: Mobile app version

## Disclaimer

This tool is for educational and analytical purposes only. It does not provide financial advice. Always conduct your own research and consult with a financial advisor before making trading decisions.

---

**ClassyTrades** © 2026. Built with ❤️ for traders.
