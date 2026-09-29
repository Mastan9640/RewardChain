// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Employee Reward Registry
/// @notice Stores employee reward records on a local Ethereum-compatible blockchain.
contract EmployeeRewardRegistry {
    struct Reward {
        string employeeName;
        uint256 rewardPoints;
    }

    mapping(string => Reward) private rewards;
    mapping(string => bool) private rewardExists;
    string[] private employeeIds;

    event RewardStored(
        string employeeId,
        string employeeName,
        uint256 rewardPoints
    );

    function storeReward(
        string memory employeeId,
        string memory employeeName,
        uint256 rewardPoints
    ) public {
        require(bytes(employeeId).length > 0, "Employee ID required");
        require(bytes(employeeName).length > 0, "Employee name required");
        require(rewardPoints > 0, "Reward points must be greater than zero");
        require(!rewardExists[employeeId], "Employee reward already exists");

        rewards[employeeId] = Reward(employeeName, rewardPoints);
        rewardExists[employeeId] = true;
        employeeIds.push(employeeId);

        emit RewardStored(employeeId, employeeName, rewardPoints);
    }

    function getReward(string memory employeeId)
        public
        view
        returns (string memory employeeName, uint256 rewardPoints)
    {
        require(bytes(employeeId).length > 0, "Employee ID required");
        require(rewardExists[employeeId], "Employee reward not found");

        Reward memory reward = rewards[employeeId];
        return (reward.employeeName, reward.rewardPoints);
    }

    function getAllEmployeeIds() public view returns (string[] memory) {
        return employeeIds;
    }

    function employeeExists(string memory employeeId) public view returns (bool) {
        return rewardExists[employeeId];
    }
}
