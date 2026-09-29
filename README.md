# RewardChain – Blockchain-Based Employee Reward Registry

## 1. Project Overview
RewardChain is a simple blockchain application for storing and retrieving employee reward records on a local Ethereum-compatible blockchain.

Selected hackathon application: – Employee Reward Registry**.

Stored fields:
- Employee ID
- Employee Name
- Reward Points

The application supports:
- Store reward data on-chain through a Solidity smart contract
- Retrieve a reward by Employee ID
- Display all stored employee records from contract storage
- Validate empty fields, zero points, unknown IDs, and duplicate IDs

## 2. Technology Stack
- Solidity – smart contract
- Hardhat – local Ethereum development network and deployment
- ethers.js – frontend-to-blockchain communication
- Vite – local frontend development server
- HTML/CSS/JavaScript – user interface

## 3. Project Structure
```text
RewardChain/
├── contracts/EmployeeRewardRegistry.sol
├── ignition/modules/EmployeeRewardRegistry.ts
├── frontend/
│   ├── index.html
│   └── src/
│       ├── app.js
│       ├── config.js
│       └── style.css
├── presentation/
├── test/TEST_CHECKLIST.md
├── scripts/DEPLOYMENT_NOTES.md
├── package.json
├── hardhat.config.ts
├── DEPLOY.bat
├── START_BLOCKCHAIN.bat
├── START_FRONTEND.bat
└── START_HERE.txt
```

## 4. Requirements
- Node.js and npm
- VS Code or another code editor
- Modern browser

## 5. Installation
Open a terminal in the RewardChain folder:

```powershell
npm.cmd install
```

## 6. Compile
```powershell
npm.cmd run compile
```

## 7. Start the Local Ethereum Blockchain
In Terminal 1:

```powershell
npm.cmd run node
```

Keep this terminal running. The RPC endpoint is:

```text
http://127.0.0.1:8545
```

## 8. Deploy the Smart Contract
In Terminal 2:

```powershell
npm.cmd run deploy
```

Copy the address printed for `EmployeeRewardRegistry`.

Open:

```text
frontend/src/config.js
```

Replace:

```javascript
export const CONTRACT_ADDRESS = "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE";
```

with the actual deployed address.

## 9. Start the Frontend
In Terminal 2:

```powershell
npm.cmd run frontend
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173/
```

The header should show **Blockchain Connected**.

## 10. Store a Record
Example:

```text
Employee ID: EMP001
Employee Name: Bhaskar
Reward Points: 100
```

Click **STORE REWARD ON BLOCKCHAIN**.

The browser sends a transaction through ethers.js to the Solidity contract running on the local Ethereum network.

## 11. Retrieve a Record
Enter:

```text
EMP001
```

Click **RETRIEVE REWARD**.

Expected result:

```text
Employee Name: Bhaskar
Reward Points: 100
```

## 12. View All Blockchain Records
The **Blockchain Records** section calls `getAllEmployeeIds()` and reads each reward through `getReward()`. It displays the employee ID, name, and reward points returned by the smart contract.

## 13. Validation
- Empty Employee ID → rejected
- Empty Employee Name → rejected
- Reward Points <= 0 → rejected
- Duplicate Employee ID → rejected
- Unknown Employee ID → not found

## 14. Important Local-Network Note
The contract address belongs to the current local Hardhat deployment. If the local blockchain is restarted, deploy the contract again and update `frontend/src/config.js` with the new address.

## 15. Testing
Follow `test/TEST_CHECKLIST.md` for manual verification of deployment, storage, retrieval, validation, and duplicate handling.

## 16. Deliverables
This package contains the Solidity source, deployment module, frontend source, README, testing checklist, screenshots folder, and presentation.

Do not include `node_modules` or private keys in the submission.
