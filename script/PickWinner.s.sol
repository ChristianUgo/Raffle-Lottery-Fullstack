// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {VRFCoordinatorV2_5Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";
import {LotteryProject} from "../src/LotteryProject.sol";

contract PickWinner is Script {
    function run() external {
        address lotteryAddress = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;
        address vrfCoordinatorMock = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        address account = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

        uint256 subId = 55206376089722866173607361604040006654327088597510986890647459072094280452587;

        vm.startBroadcast(account);
        vm.warp(block.timestamp + 31);
        vm.roll(block.number + 1);

        LotteryProject(payable(lotteryAddress)).performUpkeep("");
        
        VRFCoordinatorV2_5Mock(vrfCoordinatorMock).fundSubscription(subId, 100 ether);
        VRFCoordinatorV2_5Mock(vrfCoordinatorMock).fulfillRandomWords(1, lotteryAddress);
        vm.stopBroadcast();
        
        console.log("Winner picked! Recent winner is: ", LotteryProject(payable(lotteryAddress)).getRecentWinner());
    }
}
