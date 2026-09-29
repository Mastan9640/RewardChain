import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EmployeeRewardRegistryModule", (m) => {
  const registry = m.contract("EmployeeRewardRegistry");
  return { registry };
});
