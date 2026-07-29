# VerifiDraw Lottery

A full-stack Web3 raffle built by Christian Ugo with Solidity, Foundry, Next.js,
Chainlink VRF v2.5, and wallet connectivity.

The application supports multiple-ticket purchases, verifiable winner selection,
onchain payouts, protocol-fee accounting, winner history, emergency pausing, and
a responsive public dashboard.

## Architecture

```text
src/                 Solidity raffle contract
script/              Foundry deployment and Chainlink subscription scripts
test/unit/           Contract unit tests
test/staging/        End-to-end contract workflow tests
frontend/            Next.js 16 application
```

## Smart-contract features

- Chainlink VRF v2.5 winner selection
- Multiple tickets in one transaction
- 95% winner payout and 5% protocol fee
- Winner history stored onchain
- Pausable emergency controls
- Reentrancy protection
- Custom errors and indexed events

## Frontend features

- RainbowKit and wagmi wallet connection
- Polygon Amoy network enforcement
- Live ticket price, pool, player count, state, and recent winner
- Ticket quantity presets and transaction feedback
- Hall of Fame for previous winners
- Safe disabled state until a verified public contract address is configured

## Local development

### Contracts

Requirements: Git, Foundry, and initialized Git submodules.

```bash
git submodule update --init --recursive
forge build
forge test
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

Set these public frontend variables:

```env
NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

Do not commit private keys, RPC credentials, or other secrets.

## Vercel deployment

Import this GitHub repository into Vercel and set **Root Directory** to
`frontend`. Configure the two `NEXT_PUBLIC_` variables above for Production and
Preview, then deploy.

The production portfolio deployment is intended to use:

`https://raffle.christianugo.com`

## Network note

The public frontend targets Polygon Amoy (chain ID `80002`). A production-ready
draw requires a funded Chainlink VRF v2.5 subscription with the deployed raffle
registered as a consumer. Draw triggering must use a currently supported
automation path or an authorized operational workflow.

## Author

Christian Ugo — Blockchain Engineer and Web3 Protocol Builder
