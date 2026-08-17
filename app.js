/**
 * ClassyTrades - Real-time Tick Distribution Analysis Tool
 * Integrates with Deriv API for live market data
 */

class ClassyTradesAnalyzer {
    constructor() {
        this.ticks = [];
        this.maxTicks = 100;
        this.isRunning = false;
        this.updateInterval = 1000;
        this.intervalId = null;
        this.digitDistribution = new Array(10).fill(0);
        this.patterns = [];
        this.chart = null;
        
        this.initializeUI();
        this.attachEventListeners();
    }

    /**
     * Initialize UI Elements
     */
    initializeUI() {
        this.renderDigitGrid();
        this.updateStats();
        this.initChart();
    }

    /**
     * Render Digit Distribution Grid (0-9)
     */
    renderDigitGrid() {
        const digitGrid = document.getElementById('digitGrid');
        digitGrid.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const digitItem = document.createElement('div');
            digitItem.className = 'digit-item';
            digitItem.innerHTML = `
                <div class="digit-circle" data-digit="${i}">
                    <div class="digit-number">${i}</div>
                    <div class="digit-percentage" data-percentage="${i}">0.00%</div>
                </div>
            `;
            digitGrid.appendChild(digitItem);
        }
    }

    /**
     * Attach Event Listeners
     */
    attachEventListeners() {
        // Run button
        document.querySelector('.btn-run').addEventListener('click', () => {
            this.toggleBot();
        });

        // Pattern buttons
        document.querySelectorAll('.pattern-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updatePatternDisplay(e.target.dataset.pattern);
            });
        });

        // Settings
        document.getElementById('tickCount').addEventListener('change', (e) => {
            this.maxTicks = parseInt(e.target.value);
        });

        document.getElementById('updateInterval').addEventListener('change', (e) => {
            this.updateInterval = parseInt(e.target.value);
            if (this.isRunning) {
                this.stopBot();
                this.startBot();
            }
        });
    }

    /**
     * Toggle Bot Start/Stop
     */
    toggleBot() {
        if (this.isRunning) {
            this.stopBot();
        } else {
            this.startBot();
        }
    }

    /**
     * Start Bot - Generate Real-time Ticks
     */
    startBot() {
        this.isRunning = true;
        this.updateBotStatus();

        // Simulate Deriv tick generation
        this.intervalId = setInterval(() => {
            this.generateTick();
        }, this.updateInterval);
    }

    /**
     * Stop Bot
     */
    stopBot() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.updateBotStatus();
    }

    /**
     * Update Bot Status Display
     */
    updateBotStatus() {
        const statusText = document.getElementById('botStatus');
        const indicator = document.querySelector('.status-indicator');

        if (this.isRunning) {
            statusText.textContent = 'Bot is running';
            indicator.classList.add('running');
        } else {
            statusText.textContent = 'Bot is not running';
            indicator.classList.remove('running');
        }
    }

    /**
     * Generate Simulated Tick Data (Deriv-style)
     * In production, this would connect to actual Deriv API
     */
    generateTick() {
        // Simulate price movement (base price ± random variation)
        const basePrice = 4832.943;
        const variation = (Math.random() - 0.5) * 100;
        const newPrice = basePrice + variation;

        // Get last digit of price
        const lastDigit = Math.floor((newPrice % 10));
        
        const tick = {
            price: newPrice.toFixed(3),
            digit: lastDigit,
            timestamp: new Date(),
        };

        this.ticks.push(tick);

        // Keep only the last N ticks
        if (this.ticks.length > this.maxTicks) {
            this.ticks.shift();
        }

        // Update distribution
        this.updateDistribution();
        this.updateStats();
        this.updateChart();
        this.updatePatternHistory();
    }

    /**
     * Update Digit Distribution
     */
    updateDistribution() {
        this.digitDistribution = new Array(10).fill(0);
        
        this.ticks.forEach(tick => {
            this.digitDistribution[tick.digit]++;
        });
    }

    /**
     * Update Statistics Display
     */
    updateStats() {
        const total = this.ticks.length || 1;
        const percentages = this.digitDistribution.map(count => (count / total * 100).toFixed(2));

        // Update digit percentages
        document.querySelectorAll('[data-percentage]').forEach((el, index) => {
            el.textContent = percentages[index] + '%';
        });

        // Update stat cards
        const sorted = [...percentages].map(Number).sort((a, b) => b - a);
        document.getElementById('highestStat').textContent = sorted[0].toFixed(2) + '%';
        document.getElementById('secondStat').textContent = sorted[1].toFixed(2) + '%';
        document.getElementById('lowestStat').textContent = sorted[sorted.length - 1].toFixed(2) + '%';
        document.getElementById('secondLowest').textContent = sorted[sorted.length - 2].toFixed(2) + '%';

        // Update current price
        if (this.ticks.length > 0) {
            const currentPrice = this.ticks[this.ticks.length - 1].price;
            document.getElementById('currentPrice').textContent = currentPrice;
        }
    }

    /**
     * Update Pattern Analysis
     */
    updatePatternHistory() {
        if (this.ticks.length === 0) return;

        // Analyze even/odd pattern
        const lastTick = this.ticks[this.ticks.length - 1];
        const isEven = lastTick.digit % 2 === 0 ? 'E' : 'O';
        
        this.patterns.push({
            type: isEven,
            digit: lastTick.digit,
            timestamp: lastTick.timestamp
        });

        // Keep last 50 patterns
        if (this.patterns.length > 50) {
            this.patterns.shift();
        }

        this.updatePatternDisplay('even-odd');
    }

    /**
     * Update Pattern Display
     */
    updatePatternDisplay(patternType) {
        const total = this.patterns.length || 1;
        let evenCount = 0, oddCount = 0;

        this.patterns.forEach(p => {
            if (p.type === 'E') evenCount++;
            else oddCount++;
        });

        const evenPercent = (evenCount / total * 100).toFixed(1);
        const oddPercent = (oddCount / total * 100).toFixed(1);

        // Update pattern cards
        document.querySelectorAll('.pattern-card')[0].querySelector('.pattern-value').textContent = evenPercent + '%';
        document.querySelectorAll('.pattern-card')[1].querySelector('.pattern-value').textContent = oddPercent + '%';

        // Generate pattern history visual
        const historyContainer = document.getElementById('patternHistory');
        if (historyContainer) {
            historyContainer.innerHTML = this.generatePatternSequence();
        }
    }

    /**
     * Generate Visual Pattern Sequence
     */
    generatePatternSequence() {
        const recentPatterns = this.patterns.slice(-50);
        return `
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${recentPatterns.map(p => `
                    <div style="
                        width: 32px;
                        height: 32px;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 14px;
                        background: ${p.type === 'E' ? 'rgba(76, 175, 80, 0.6)' : 'rgba(231, 76, 60, 0.6)'};
                        border: 1px solid ${p.type === 'E' ? 'rgba(76, 175, 80, 1)' : 'rgba(231, 76, 60, 1)'};
                        color: #fff;
                    ">
                        ${p.type}
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Initialize Chart
     */
    initChart() {
        const ctx = document.getElementById('movementChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Price Movement',
                        data: [],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#00d4ff',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Update Chart with Latest Data
     */
    updateChart() {
        if (!this.chart || this.ticks.length === 0) return;

        const labels = this.ticks.map((tick, index) => `T${index + 1}`);
        const data = this.ticks.map(tick => parseFloat(tick.price));

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update('none'); // Update without animation for performance
    }

    /**
     * Export Analysis Data
     */
    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            totalTicks: this.ticks.length,
            digitDistribution: this.digitDistribution,
            ticks: this.ticks,
            patterns: this.patterns
        };

        return JSON.stringify(exportData, null, 2);
    }
}

// Initialize the analyzer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analyzer = new ClassyTradesAnalyzer();
    console.log('ClassyTrades Analyzer initialized and ready!');
});
