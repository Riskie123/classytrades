// src/services/analysis.ts

// Lightweight client-side analysis service for Deriv ticks.
// - Subscribes to Deriv public ticks websocket and keeps a sliding window of recent ticks
// - Calculates digit distribution (last digit of the quote), even/odd percentages, and a simple parity pattern

export type DigitDistribution = { [digit: number]: { count: number; pct: number } };

export type AnalysisResult = {
  symbol: string;
  totalTicks: number;
  digitCounts: number[]; // index 0..9
  digitDistribution: DigitDistribution;
  evenPct: number;
  oddPct: number;
  lastParitySequence: string[]; // e.g. ['E','O','E']
  lastDigits: number[]; // most recent digits (descending: newest first)
};

export type AnalysisUpdateHandler = (result: AnalysisResult) => void;

export interface AnalysisServiceOptions {
  bufferSize?: number; // how many recent ticks to keep
  appId?: string; // Deriv app_id (optional). Default uses 1089 which works for public data in examples.
}

export class AnalysisService {
  private ws: WebSocket | null = null;
  private symbol: string | null = null;
  private bufferSize: number;
  private appId: string;
  private ticks: number[] = [];
  private onUpdate: AnalysisUpdateHandler | null = null;

  constructor(options?: AnalysisServiceOptions) {
    this.bufferSize = options?.bufferSize ?? 200;
    this.appId = options?.appId ?? '1089';
  }

  connect(symbol: string, onUpdate: AnalysisUpdateHandler) {
    this.disconnect();
    this.symbol = symbol;
    this.onUpdate = onUpdate;
    this.ticks = [];

    // Deriv public websocket endpoint
    const url = `wss://ws.binaryws.com/websockets/v3?app_id=${this.appId}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      // subscribe to ticks for the symbol
      const req = { ticks: symbol };
      this.ws?.send(JSON.stringify(req));
    };

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string);
        if (msg.tick && msg.tick.quote !== undefined) {
          this.handleTick(msg.tick.quote);
        }
      } catch (err) {
        // ignore parse errors
        // console.warn('parse error', err);
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
    };

    this.ws.onerror = () => {
      // noop
    };
  }

  disconnect() {
    if (this.ws) {
      try {
        // unsubscribe by closing socket; Deriv v3 doesn't require explicit unsubscribe for a single connection
        this.ws.close();
      } catch (e) {
        // ignore
      }
      this.ws = null;
    }
    this.symbol = null;
    this.onUpdate = null;
    this.ticks = [];
  }

  private handleTick(quote: number) {
    // store last digit of the integer part of the quote
    const lastDigit = Math.abs(Math.floor(quote)) % 10;
    this.ticks.unshift(lastDigit);
    if (this.ticks.length > this.bufferSize) this.ticks.pop();
    this.emitUpdate();
  }

  private emitUpdate() {
    if (!this.onUpdate || !this.symbol) return;

    const counts = new Array<number>(10).fill(0);
    this.ticks.forEach((d) => {
      if (d >= 0 && d <= 9) counts[d] += 1;
    });
    const total = this.ticks.length || 1;

    const digitDistribution: DigitDistribution = {};
    for (let i = 0; i < 10; i++) {
      digitDistribution[i] = { count: counts[i], pct: (counts[i] / total) * 100 };
    }

    const evens = counts.reduce((acc, c, i) => (i % 2 === 0 ? acc + c : acc), 0);
    const odds = counts.reduce((acc, c, i) => (i % 2 === 1 ? acc + c : acc), 0);

    const lastDigits = this.ticks.slice(0, 30);
    const lastParitySequence = lastDigits.map((d) => (d % 2 === 0 ? 'E' : 'O'));

    const result: AnalysisResult = {
      symbol: this.symbol,
      totalTicks: total,
      digitCounts: counts,
      digitDistribution,
      evenPct: (evens / total) * 100,
      oddPct: (odds / total) * 100,
      lastParitySequence,
      lastDigits,
    };

    try {
      this.onUpdate(result);
    } catch (e) {
      // swallow handler errors
    }
  }
}
