// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {DeployLotteryProject} from "../../script/DeployLotteryProject.s.sol";
import {LotteryProject} from "../../src/LotteryProject.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {Test, console2} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {VRFCoordinatorV2_5Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";
import {LinkToken} from "../../test/mocks/LinkToken.sol";
import {CodeConstants} from "../../script/HelperConfig.s.sol";

contract LotteryProjectTest is Test, CodeConstants {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event RequestedLotteryProjectWinner(uint256 indexed requestId);
    event LotteryProjectEnter(address indexed player, uint256 numTickets);
    event WinnerPicked(address indexed player);

    LotteryProject public lottery;
    HelperConfig public helperConfig;

    uint256 subscriptionId;
    bytes32 gasLane;
    uint256 automationUpdateInterval;
    uint256 lotteryEntranceFee;
    uint32 callbackGasLimit;
    address vrfCoordinatorV2_5;
    LinkToken link;

    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10 ether;
    uint256 public constant LINK_BALANCE = 100 ether;

    function setUp() external {
        DeployLotteryProject deployer = new DeployLotteryProject();
        (lottery, helperConfig) = deployer.run();
        vm.deal(PLAYER, STARTING_USER_BALANCE);

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        subscriptionId = config.subscriptionId;
        gasLane = config.gasLane;
        automationUpdateInterval = config.automationUpdateInterval;
        lotteryEntranceFee = config.lotteryEntranceFee;
        callbackGasLimit = config.callbackGasLimit;
        vrfCoordinatorV2_5 = config.vrfCoordinatorV2_5;
        link = LinkToken(config.link);

        vm.startPrank(config.account);
        if (block.chainid == LOCAL_CHAIN_ID) {
            link.mint(config.account, LINK_BALANCE);
            VRFCoordinatorV2_5Mock(vrfCoordinatorV2_5).fundSubscription(subscriptionId, LINK_BALANCE);
        }
        link.approve(vrfCoordinatorV2_5, LINK_BALANCE);
        vm.stopPrank();
    }

    function testLotteryProjectInitializesInOpenState() public view {
        assert(lottery.getLotteryProjectState() == LotteryProject.LotteryProjectState.OPEN);
    }

    /*//////////////////////////////////////////////////////////////
                              ENTER LOTTERY_PROJECT
    //////////////////////////////////////////////////////////////*/
    function testLotteryProjectRevertsWHenYouDontPayEnough() public {
        // Arrange
        vm.prank(PLAYER);
        // Act / Assert
        vm.expectRevert(LotteryProject.LotteryProject__SendMoreToEnterLotteryProject.selector);
        lottery.enterLotteryProject();
    }

    function testLotteryProjectRecordsPlayerWhenTheyEnter() public {
        // Arrange
        vm.prank(PLAYER);
        // Act
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        // Assert
        address playerRecorded = lottery.getPlayer(0);
        assert(playerRecorded == PLAYER);
    }

    function testEmitsEventOnEntrance() public {
        // Arrange
        vm.prank(PLAYER);

        // Act / Assert
        vm.expectEmit(true, false, false, false, address(lottery));
        emit LotteryProjectEnter(PLAYER, 1);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
    }

    function testDontAllowPlayersToEnterWhileLotteryProjectIsCalculating() public {
        // Arrange
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);
        lottery.performUpkeep("");

        // Act / Assert
        vm.expectRevert(LotteryProject.LotteryProject__LotteryProjectNotOpen.selector);
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
    }

    /*//////////////////////////////////////////////////////////////
                              CHECKUPKEEP
    //////////////////////////////////////////////////////////////*/
    function testCheckUpkeepReturnsFalseIfItHasNoBalance() public {
        // Arrange
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);

        // Act
        (bool upkeepNeeded,) = lottery.checkUpkeep("");

        // Assert
        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnsFalseIfLotteryProjectIsntOpen() public {
        // Arrange
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);
        lottery.performUpkeep("");
        LotteryProject.LotteryProjectState lotteryState = lottery.getLotteryProjectState();
        // Act
        (bool upkeepNeeded,) = lottery.checkUpkeep("");
        // Assert
        assert(lotteryState == LotteryProject.LotteryProjectState.CALCULATING);
        assert(upkeepNeeded == false);
    }

    // Challenge 1. testCheckUpkeepReturnsFalseIfEnoughTimeHasntPassed
    function testCheckUpkeepReturnsFalseIfEnoughTimeHasntPassed() public {
        // Arrange
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();

        // Act
        (bool upkeepNeeded,) = lottery.checkUpkeep("");

        // Assert
        assert(!upkeepNeeded);
    }

    // Challenge 2. testCheckUpkeepReturnsTrueWhenParametersGood
    function testCheckUpkeepReturnsTrueWhenParametersGood() public {
        // Arrange
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);

        // Act
        (bool upkeepNeeded,) = lottery.checkUpkeep("");

        // Assert
        assert(upkeepNeeded);
    }

    /*//////////////////////////////////////////////////////////////
                             PERFORMUPKEEP
    //////////////////////////////////////////////////////////////*/
    function testPerformUpkeepCanOnlyRunIfCheckUpkeepIsTrue() public {
        // Arrange
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);

        // Act / Assert
        // It doesnt revert
        lottery.performUpkeep("");
    }

    function testPerformUpkeepRevertsIfCheckUpkeepIsFalse() public {
        // Arrange
        uint256 currentBalance = 0;
        uint256 numPlayers = 0;
        LotteryProject.LotteryProjectState rState = lottery.getLotteryProjectState();
        // Act / Assert
        vm.expectRevert(
            abi.encodeWithSelector(LotteryProject.LotteryProject__UpkeepNotNeeded.selector, currentBalance, numPlayers, rState)
        );
        lottery.performUpkeep("");
    }

    function testPerformUpkeepUpdatesLotteryProjectStateAndEmitsRequestId() public {
        // Arrange
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);

        // Act
        vm.recordLogs();
        lottery.performUpkeep(""); // emits requestId
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 requestId = entries[1].topics[1];

        // Assert
        LotteryProject.LotteryProjectState lotteryState = lottery.getLotteryProjectState();
        // requestId = lottery.getLastRequestId();
        assert(uint256(requestId) > 0);
        assert(uint256(lotteryState) == 1); // 0 = open, 1 = calculating
    }

    /*//////////////////////////////////////////////////////////////
                           FULFILLRANDOMWORDS
    //////////////////////////////////////////////////////////////*/
    modifier lotteryEntered() {
        vm.prank(PLAYER);
        lottery.enterLotteryProject{value: lotteryEntranceFee}();
        vm.warp(block.timestamp + automationUpdateInterval + 1);
        vm.roll(block.number + 1);
        _;
    }

    modifier skipFork() {
        if (block.chainid != 31337) {
            return;
        }
        _;
    }

    function testFulfillRandomWordsCanOnlyBeCalledAfterPerformUpkeep() public lotteryEntered skipFork {
        // Arrange
        // Act / Assert
        vm.expectRevert(VRFCoordinatorV2_5Mock.InvalidRequest.selector);
        // vm.mockCall could be used here...
        VRFCoordinatorV2_5Mock(vrfCoordinatorV2_5).fulfillRandomWords(0, address(lottery));

        vm.expectRevert(VRFCoordinatorV2_5Mock.InvalidRequest.selector);
        VRFCoordinatorV2_5Mock(vrfCoordinatorV2_5).fulfillRandomWords(1, address(lottery));
    }

    function testFulfillRandomWordsPicksAWinnerResetsAndSendsMoney() public lotteryEntered skipFork {
        address expectedWinner = address(1);

        // Arrange
        uint256 additionalEntrances = 3;
        uint256 startingIndex = 1; // We have starting index be 1 so we can start with address(1) and not address(0)

        for (uint256 i = startingIndex; i < startingIndex + additionalEntrances; i++) {
            address player = address(uint160(i));
            hoax(player, 1 ether); // deal 1 eth to the player
            lottery.enterLotteryProject{value: lotteryEntranceFee}();
        }

        uint256 startingTimeStamp = lottery.getLastTimeStamp();
        uint256 startingBalance = expectedWinner.balance;

        // Act
        vm.recordLogs();
        lottery.performUpkeep(""); // emits requestId
        Vm.Log[] memory entries = vm.getRecordedLogs();
        console2.logBytes32(entries[1].topics[1]);
        bytes32 requestId = entries[1].topics[1]; // get the requestId from the logs

        VRFCoordinatorV2_5Mock(vrfCoordinatorV2_5).fulfillRandomWords(uint256(requestId), address(lottery));

        // Assert
        address recentWinner = lottery.getRecentWinner();
        LotteryProject.LotteryProjectState lotteryState = lottery.getLotteryProjectState();
        uint256 winnerBalance = recentWinner.balance;
        uint256 endingTimeStamp = lottery.getLastTimeStamp();
        uint256 prize = lotteryEntranceFee * (additionalEntrances + 1);
        uint256 expectedPrize = prize - ((prize * 5) / 100);

        assert(recentWinner == expectedWinner);
        assert(uint256(lotteryState) == 0);
        assert(winnerBalance == startingBalance + expectedPrize);
        assert(endingTimeStamp > startingTimeStamp);
    }
}
