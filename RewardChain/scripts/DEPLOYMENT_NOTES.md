# Deployment notes

1. Start the local node:
   `npx.cmd hardhat node`
2. Deploy:
   `npx.cmd hardhat ignition deploy ignition/modules/EmployeeRewardRegistry.ts --network localhost`
3. Copy the printed EmployeeRewardRegistry address into `frontend/src/config.js`.
4. Start the frontend:
   `npm run frontend`
