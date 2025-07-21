# Token Fetching with CoinMarketCap API

This document explains how to use the token fetching functionality in the @d-sports/wallet package.

## Overview

The package includes a utility to fetch real-time token data from the CoinMarketCap API. This data is used to populate the token information displayed in the wallet UI, including:

- Token prices
- 24-hour price changes
- Market capitalization
- Other token metadata

## Prerequisites

1. A CoinMarketCap API key (get one at [https://coinmarketcap.com/api/](https://coinmarketcap.com/api/))
2. The API key should be stored in your `.env` file as `COINMARKETCAP_API_KEY`

## Usage

### Updating Token Data

To update the token data with the latest information from CoinMarketCap:

```bash
npm run update-tokens
```

This will:
1. Fetch the latest data for BTC, ETH, MATIC, USDC, and BNB from the CoinMarketCap API
2. Process the data into the format expected by the wallet
3. Update the `data/token-data.ts` file with the new information

### Programmatic Usage

You can also update the token data programmatically:

```typescript
import { updateTokenData } from '@d-sports/wallet/utils/token-fetcher';

// Update token data
await updateTokenData();
```

## Token Service API

The `TokenService` class provides methods for interacting with the CoinMarketCap API:

```typescript
import { tokenService } from '@d-sports/wallet/services/token-service';

// Fetch data for specific tokens
const tokens = await tokenService.fetchTokenData(['BTC', 'ETH'], 'USD');
```

### Available Methods

- `fetchTokenData(symbols: string[], currency: string = 'USD'): Promise<TokenInfo[]>`
  - Fetches token data for the specified symbols
  - Returns an array of TokenInfo objects

## Data Structure

The token data is structured as follows:

```typescript
interface TokenInfo {
  name: string;          // Token name (e.g., "Bitcoin")
  symbol: string;        // Token symbol (e.g., "BTC")
  network: string;       // Network (e.g., "Bitcoin", "Ethereum")
  amount: string;        // Amount with symbol (e.g., "0.5 BTC")
  value: string;         // Value in currency (e.g., "$25000")
  change: {              // 24h price change
    positive: string;    // Positive change (e.g., "+5.2%")
    negative: string;    // Negative change (e.g., "-5.2%")
  };
  icon: string;          // Icon representation
  bgColor: string;       // Background color class
  balance: string;       // Token balance
  address: string;       // Token address
  price: number;         // Current price
  percentChange24h: number; // 24h percent change
  marketCap: number;     // Market capitalization
  transactions: Transaction[]; // Recent transactions
}
```

## Customization

You can customize the token fetching by modifying:

1. The list of tokens to fetch in `src/utils/token-fetcher.ts`
2. The token display information in `src/services/token-service.ts`
3. The update frequency by setting up a cron job to run `npm run update-tokens`

## Error Handling

If the CoinMarketCap API is unavailable or returns an error, the script will:

1. Log the error to the console
2. Exit with a non-zero status code
3. Keep the existing token data unchanged

## Rate Limits

Be aware of the CoinMarketCap API rate limits for your subscription tier. The Basic plan includes:

- 10,000 credits per month
- 30 calls per minute

Each call to fetch data for multiple tokens counts as a single API call but uses credits based on the number of tokens requested.