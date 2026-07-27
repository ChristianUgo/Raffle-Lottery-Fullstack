// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

// IMPORTANT: Install openzeppelin contracts if you haven't: forge install OpenZeppelin/openzeppelin-contracts --no-commit
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title A Modernized LotteryProject Contract
 * @author Patrick Collins (Modernized)
 * @notice This contract is for creating a sample lottery contract with modern features
 * @dev This implements the Chainlink VRF Version 2
 */
contract LotteryProject is VRFConsumerBaseV2Plus, AutomationCompatibleInterface, Pausable, ReentrancyGuard {
    /* Errors */
    error LotteryProject__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 lotteryState);
    error LotteryProject__TransferFailed();
    error LotteryProject__SendMoreToEnterLotteryProject();
    error LotteryProject__LotteryProjectNotOpen();
    error LotteryProject__NoFundsToWithdraw();

    /* Type declarations */
    enum LotteryProjectState {
        OPEN,
        CALCULATING
    }

    struct WinnerInfo {
        address winnerAddress;
        uint256 amountWon;
        uint256 timestamp;
    }

    /* State variables */
    // Chainlink VRF Variables
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // Lottery Variables
    uint256 private immutable i_interval;
    uint256 private immutable i_entranceFee;
    uint256 private s_lastTimeStamp;
    address private s_recentWinner;
    address payable[] private s_players;
    LotteryProjectState private s_lotteryState;

    // Modernization Variables
    WinnerInfo[] private s_pastWinners;
    uint256 private constant PROTOCOL_FEE_PERCENTAGE = 5; // 5% protocol fee
    uint256 private s_protocolFeesCollected;

    /* Events */
    event RequestedLotteryProjectWinner(uint256 indexed requestId);
    event LotteryProjectEnter(address indexed player, uint256 numTickets);
    event WinnerPicked(address indexed player, uint256 amountWon);
    event ProtocolFeeWithdrawn(address indexed owner, uint256 amount);

    /* Functions */
    constructor(
        uint256 subscriptionId,
        bytes32 gasLane, // keyHash
        uint256 interval,
        uint256 entranceFee,
        uint32 callbackGasLimit,
        address vrfCoordinatorV2
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) { // Removed Ownable() because VRFConsumerBaseV2Plus likely isn't multiple inheritance conflict, but Ownable needs an owner.
        i_gasLane = gasLane;
        i_interval = interval;
        i_subscriptionId = subscriptionId;
        i_entranceFee = entranceFee;
        s_lotteryState = LotteryProjectState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_callbackGasLimit = callbackGasLimit;
    }

    /**
     * @notice Allows the owner to pause the lottery in case of emergencies.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Allows the owner to unpause the lottery.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Allows a user to enter the lottery.
     * Users can send multiple times the entrance fee to buy multiple tickets in one transaction.
     */
    function enterLotteryProject() public payable whenNotPaused nonReentrant {
        if (msg.value < i_entranceFee) {
            revert LotteryProject__SendMoreToEnterLotteryProject();
        }
        if (s_lotteryState != LotteryProjectState.OPEN) {
            revert LotteryProject__LotteryProjectNotOpen();
        }

        // Calculate how many tickets the user is buying
        uint256 numTickets = msg.value / i_entranceFee;
        for (uint256 i = 0; i < numTickets; i++) {
            s_players.push(payable(msg.sender));
        }

        // Refund any excess ETH sent
        uint256 refund = msg.value - (numTickets * i_entranceFee);
        if (refund > 0) {
            (bool success, ) = msg.sender.call{value: refund}("");
            if (!success) revert LotteryProject__TransferFailed();
        }

        emit LotteryProjectEnter(msg.sender, numTickets);
    }

    function checkUpkeep(bytes memory /* checkData */ )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        bool isOpen = LotteryProjectState.OPEN == s_lotteryState;
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > s_protocolFeesCollected; // Ensure we have prize money
        bool isNotPaused = !paused();
        
        upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers && isNotPaused);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(bytes calldata /* performData */ ) external override whenNotPaused {
        (bool upkeepNeeded,) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert LotteryProject__UpkeepNotNeeded(address(this).balance, s_players.length, uint256(s_lotteryState));
        }

        s_lotteryState = LotteryProjectState.CALCULATING;

        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_gasLane,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RequestedLotteryProjectWinner(requestId);
    }

    function fulfillRandomWords(uint256, /* requestId */ uint256[] calldata randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        // Calculate Prize Pool and Protocol Fee
        uint256 totalPrizePool = address(this).balance - s_protocolFeesCollected;
        uint256 protocolFee = (totalPrizePool * PROTOCOL_FEE_PERCENTAGE) / 100;
        uint256 winnerPrize = totalPrizePool - protocolFee;

        // Update states
        s_protocolFeesCollected += protocolFee;
        s_players = new address payable[](0);
        s_lotteryState = LotteryProjectState.OPEN;
        s_lastTimeStamp = block.timestamp;

        // Track past winners
        s_pastWinners.push(WinnerInfo({
            winnerAddress: recentWinner,
            amountWon: winnerPrize,
            timestamp: block.timestamp
        }));

        emit WinnerPicked(recentWinner, winnerPrize);

        // Pay the winner
        (bool success,) = recentWinner.call{value: winnerPrize}("");
        if (!success) {
            revert LotteryProject__TransferFailed();
        }
    }

    /**
     * @notice Allows the owner to withdraw collected protocol fees.
     */
    function withdrawProtocolFees() external onlyOwner nonReentrant {
        uint256 amountToWithdraw = s_protocolFeesCollected;
        if (amountToWithdraw == 0) {
            revert LotteryProject__NoFundsToWithdraw();
        }

        s_protocolFeesCollected = 0;
        
        // Use s_vrfCoordinator's owner getter if VRFConsumerBaseV2Plus inherits from ConfirmedOwner
        (bool success, ) = owner().call{value: amountToWithdraw}("");
        if (!success) {
            revert LotteryProject__TransferFailed();
        }
        
        emit ProtocolFeeWithdrawn(owner(), amountToWithdraw);
    }

    /**
     * Getter Functions
     */
    function getLotteryProjectState() public view returns (LotteryProjectState) {
        return s_lotteryState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getPastWinners() public view returns (WinnerInfo[] memory) {
        return s_pastWinners;
    }

    function getProtocolFeesCollected() public view returns (uint256) {
        return s_protocolFeesCollected;
    }
}
