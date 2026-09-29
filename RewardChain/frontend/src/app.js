import { ethers } from "ethers";
import { RPC_URL, CONTRACT_ADDRESS } from "./config.js";

const CONTRACT_ABI = [
  "function storeReward(string employeeId, string employeeName, uint256 rewardPoints)",
  "function getReward(string employeeId) view returns (string employeeName, uint256 rewardPoints)",
  "function getAllEmployeeIds() view returns (string[] memory)",
  "function employeeExists(string employeeId) view returns (bool)"
];

let provider;
let signer;
let contract;

const $ = (id) => document.getElementById(id);

function showMessage(id, text, type) {
  const el = $(id);
  el.textContent = text;
  el.className = `message ${type}`;
}

function hideMessage(id) {
  $(id).className = "message hidden";
}

function friendlyError(error) {
  return error?.shortMessage || error?.reason || error?.info?.error?.message || error?.message || "Transaction failed";
}

async function connectBlockchain() {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    const network = await provider.getNetwork();
    console.log("Connected chain ID:", network.chainId.toString());

    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      throw new Error("Contract address is not configured. Update CONTRACT_ADDRESS in frontend/src/app.js.");
    }

    const code = await provider.getCode(CONTRACT_ADDRESS);
    console.log("Contract code length:", code.length);
    if (code === "0x") {
      throw new Error("No contract code found at the configured address. Redeploy and update CONTRACT_ADDRESS.");
    }

    const accounts = await provider.send("eth_accounts", []);
    if (!accounts.length) {
      throw new Error("No local Hardhat account is available. Start the local blockchain with 'npx hardhat node'.");
    }

    signer = await provider.getSigner(accounts[0]);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    $("connectionStatus").textContent = "🟢 Blockchain Connected";
    $("connectionStatus").className = "status connected";
    $("contractAddressLabel").textContent = `Contract: ${CONTRACT_ADDRESS}`;

    console.log("EmployeeRewardRegistry connected:", CONTRACT_ADDRESS);
    await loadRecords();
  } catch (error) {
    console.error("Blockchain connection error:", error);
    $("connectionStatus").textContent = "🔴 Blockchain Not Connected";
    $("connectionStatus").className = "status disconnected";
    $("contractAddressLabel").textContent = `Contract: ${CONTRACT_ADDRESS}`;
  }
}

async function storeReward(event) {
  event.preventDefault();
  hideMessage("storeMessage");

  if (!contract) {
    showMessage("storeMessage", "Blockchain is not connected. Check the Hardhat node and contract address.", "error");
    return;
  }

  const employeeId = $("employeeId").value.trim();
  const employeeName = $("employeeName").value.trim();
  const rewardPoints = Number($("rewardPoints").value);

  if (!employeeId || !employeeName || !Number.isInteger(rewardPoints) || rewardPoints <= 0) {
    showMessage("storeMessage", "Enter a valid Employee ID, Employee Name, and reward points greater than zero.", "error");
    return;
  }

  try {
    const exists = await contract.employeeExists(employeeId);
    if (exists) {
      showMessage("storeMessage", "Employee reward already exists. Duplicate Employee IDs are not allowed.", "error");
      return;
    }

    showMessage("storeMessage", "Submitting blockchain transaction...", "success");
    const tx = await contract.storeReward(employeeId, employeeName, rewardPoints);
    console.log("Transaction:", tx.hash);
    await tx.wait();

    showMessage("storeMessage", `✅ Reward successfully stored on blockchain! Transaction: ${tx.hash}`, "success");
    $("storeForm").reset();
    await loadRecords();
  } catch (error) {
    console.error(error);
    showMessage("storeMessage", `❌ ${friendlyError(error)}`, "error");
  }
}

async function retrieveReward(event) {
  event.preventDefault();
  hideMessage("retrieveMessage");
  $("resultName").textContent = "—";
  $("resultPoints").textContent = "—";

  if (!contract) {
    showMessage("retrieveMessage", "Blockchain is not connected.", "error");
    return;
  }

  const employeeId = $("retrieveId").value.trim();
  if (!employeeId) {
    showMessage("retrieveMessage", "Employee ID is required.", "error");
    return;
  }

  try {
    const exists = await contract.employeeExists(employeeId);
    if (!exists) {
      showMessage("retrieveMessage", "❌ Employee reward not found.", "error");
      return;
    }

    const [name, points] = await contract.getReward(employeeId);
    $("resultName").textContent = name;
    $("resultPoints").textContent = points.toString();
    showMessage("retrieveMessage", "✅ Employee reward retrieved from blockchain.", "success");
  } catch (error) {
    console.error(error);
    showMessage("retrieveMessage", `❌ ${friendlyError(error)}`, "error");
  }
}

async function loadRecords() {
  if (!contract) return;
  const body = $("recordsBody");
  body.innerHTML = "<tr><td colspan='3'>Loading blockchain records...</td></tr>";

  try {
    const ids = await contract.getAllEmployeeIds();
    if (!ids.length) {
      body.innerHTML = "<tr><td colspan='3'>No employee records stored yet.</td></tr>";
      return;
    }

    const rows = [];
    for (const id of ids) {
      const [name, points] = await contract.getReward(id);
      rows.push(`<tr><td>${escapeHtml(id)}</td><td>${escapeHtml(name)}</td><td>${points.toString()}</td></tr>`);
    }
    body.innerHTML = rows.join("");
  } catch (error) {
    console.error("Could not load records:", error);
    body.innerHTML = `<tr><td colspan='3'>Could not read blockchain records: ${escapeHtml(friendlyError(error))}</td></tr>`;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
}

$("storeForm").addEventListener("submit", storeReward);
$("retrieveForm").addEventListener("submit", retrieveReward);
$("refreshRecords").addEventListener("click", loadRecords);
window.addEventListener("DOMContentLoaded", connectBlockchain);
