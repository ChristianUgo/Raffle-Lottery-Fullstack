// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {LotteryProject} from "../src/LotteryProject.sol";
import {AddConsumer, CreateSubscription, FundSubscription} from "./Interactions.s.sol";

contract DeployLotteryProject is Script {
    function run() external returns (LotteryProject, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig(); // This comes with our mocks!
        AddConsumer addConsumer = new AddConsumer();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        if (config.subscriptionId == 0) {
            CreateSubscription createSubscription = new CreateSubscription();
            (config.subscriptionId, config.vrfCoordinatorV2_5) =
                createSubscription.createSubscription(config.vrfCoordinatorV2_5, config.account);

            FundSubscription fundSubscription = new FundSubscription();
            fundSubscription.fundSubscription(
                config.vrfCoordinatorV2_5, config.subscriptionId, config.link, config.account
            );

            helperConfig.setConfig(block.chainid, config);
        }

        vm.startBroadcast(config.account);
        LotteryProject lottery = new LotteryProject(
            config.subscriptionId,
            config.gasLane,
            config.automationUpdateInterval,
            config.lotteryEntranceFee,
            config.callbackGasLimit,
            config.vrfCoordinatorV2_5
        );
        vm.stopBroadcast();

        // We already have a broadcast in here
        addConsumer.addConsumer(address(lottery), config.vrfCoordinatorV2_5, config.subscriptionId, config.account);
        return (lottery, helperConfig);
    }
}
