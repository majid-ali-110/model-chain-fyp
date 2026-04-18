# model-chain-fyp
A fully decentralized AI Model Marketplace built on blockchain. It lets developers upload, license, and sell AI models securely using smart contracts, IPFS storage, and decentralized compute. Ensures transparent ownership, trustless payments, encrypted model access, and on-chain royalty tracking.

## Release Readiness (Module 5)

### Quality gates

- `npm run lint`
- `npm run build`
- `npm run test:frontend`
- `npm run test:contracts`
- `npm run test:ci` (runs all checks in deterministic sequence)

### Frontend integration test scope

- Wallet connect flow (`ConnectWallet` + wallet modal)
- Model upload flow (`/developer/upload`)
- Marketplace purchase flow (`/marketplace/models/:id`)

### Contract test scope

- `ModelRegistry` registration and metadata lifecycle
- `Marketplace` listing, pricing, purchase accounting, access control
- `Governance` stake/proposal/vote lifecycle
- `UserRegistry` registration/profile updates/validator approval

### Deterministic demo setup: Local + Amoy

1. Install dependencies:
	- `npm ci`
2. Run local Hardhat node in one terminal:
	- `npx hardhat node`
3. Deploy contracts to localhost in another terminal:
	- `npx hardhat run scripts/deploy.cjs --network localhost`
4. Verify localhost deployment map + bytecode:
	- `npm run verify:deployment -- localhost`
5. Deploy to Amoy:
	- `npx hardhat run scripts/deploy.cjs --network polygonAmoy`
6. Verify Amoy deployment map + bytecode:
	- `npm run verify:deployment -- polygonAmoy`

### Address management policy

- Contract addresses are managed in `src/contracts/index.js`.
- Every deploy must update all required addresses for the target network in one commit.
- Demo/release runs for `localhost` and `polygonAmoy` should pass `npm run verify:deployment` before sign-off.

## Sandbox Live Inference (.pkl)

The Sandbox can run real inference through a local Python API.

1. Install Python dependencies:
	- `npm run inference:install`
2. Start the inference server:
	- `npm run inference:dev`
3. In another terminal, start frontend dev server:
	- `npm run dev`
4. Open Sandbox and test with Iris input:
	- `{"features":[5.1,3.5,1.4,0.2]}`

### Model resolution order in backend

- If selected model has an IPFS hash, backend tries to download and load that `.pkl`.
- Else it uses local `model.pkl` in project root.
- You can override local model path with:
	- `SANDBOX_MODEL_PATH=/absolute/path/to/model.pkl npm run inference:dev`
