// src/components/AnalysisTool/README.md

# AnalysisTool component

This is a small, self-contained React component and service that connects to Deriv's public ticks websocket and computes a few realtime statistics:

- Digit distribution (last digit of the integer part of the quote)
- Even vs Odd percentage
- Recent parity (E/O) sequence

How to use

1. Import the component where you want it to appear (for example on your Bot Builder page):

```tsx
import AnalysisTool from 'src/components/AnalysisTool';

// in JSX
<AnalysisTool symbol="R_100" />
```

2. If you want to change the Deriv app_id or buffer size, edit the AnalysisService usage in src/services/analysis.ts or pass options when creating the service (the current component uses the default example app_id).

Security / notes

- This component uses Deriv's public websocket endpoint and does not perform any trades. If you need authenticated trading features you will need to add secure token management and use the official Deriv API client.

