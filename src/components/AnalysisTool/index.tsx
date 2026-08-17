// src/components/AnalysisTool/index.tsx

import React, { useEffect, useRef, useState } from 'react';
import { AnalysisService, AnalysisResult } from '../../services/analysis';

type Props = {
  symbol?: string; // e.g. 'R_10' or 'R_100'
};

const gridCellStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 8,
  background: '#263238',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 6,
};

const containerStyle: React.CSSProperties = {
  padding: 12,
  background: 'rgba(255,255,255,0.02)',
  borderRadius: 8,
  color: '#fff',
  fontFamily: 'Inter, system-ui, Arial',
};

export const AnalysisTool: React.FC<Props> = ({ symbol = 'R_100' }) => {
  const svcRef = useRef<AnalysisService | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const svc = new AnalysisService({ bufferSize: 200 });
    svcRef.current = svc;

    svc.connect(symbol, (res) => {
      setResult(res);
      setConnected(true);
    });

    return () => {
      svc.disconnect();
      setConnected(false);
    };
  }, [symbol]);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <strong>Analysis</strong>
          <div style={{ fontSize: 12, color: '#b0bec5' }}>{symbol} — real-time digit & parity analysis</div>
        </div>
        <div style={{ fontSize: 13 }}>{connected ? 'Live' : 'Disconnected'}</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 740 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const count = result ? result.digitCounts[i] : 0;
          const pct = result ? (result.digitCounts[i] / (result.totalTicks || 1)) * 100 : 0;
          return (
            <div key={i} style={gridCellStyle}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{i}</div>
              <div style={{ fontSize: 12, color: '#90a4ae' }}>{count} ({pct.toFixed(1)}%)</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <div style={{ padding: 12, background: '#1e88e5', borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: '#e3f2fd' }}>Even</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{result ? result.evenPct.toFixed(1) : '0.0'}%</div>
        </div>
        <div style={{ padding: 12, background: '#ef5350', borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: '#ffebee' }}>Odd</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{result ? result.oddPct.toFixed(1) : '0.0'}%</div>
        </div>

        <div style={{ padding: 12, background: '#263238', borderRadius: 8, color: '#fff', minWidth: 260 }}>
          <div style={{ fontSize: 12, color: '#90a4ae' }}>Last parity sequence (newest →)</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {result
              ? result.lastParitySequence.slice(0, 20).map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '6px 8px',
                      background: p === 'E' ? '#4caf50' : '#ef5350',
                      color: '#fff',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {p}
                  </div>
                ))
              : '—'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: '#90a4ae' }}>
        Note: This component connects to Deriv's public tick websocket for live quotes. App ID used is the example app_id; replace with your own app_id in AnalysisService constructor if you have one.
      </div>
    </div>
  );
};

export default AnalysisTool;
