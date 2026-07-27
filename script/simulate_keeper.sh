#!/usr/bin/env bash
# Simulate Chainlink Keepers locally on Anvil
# Ensure Anvil is running and your frontend (http://localhost:3000) is up.

# Step 1: Buy a ticket manually via the frontend.
# (No script for this - just interact with the UI.)

# Step 2: Advance blockchain time by 31 seconds (interval > 30)
cast rpc evm_increaseTime 31
cast rpc evm_mine

# Step 3: Trigger performUpkeep on the lottery contract
# Replace the address below with your deployed LotteryProject address if different.
LOTTERY_ADDRESS="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
cast send $LOTTERY_ADDRESS "performUpkeep(bytes)" "0x" --private-key $PRIVATE_KEY

# Step 4: Mock VRF fulfillment (replace coordinator address & requestId if needed)
VRF_COORDINATOR="0x5FbDB2315678afecb367f032d93F642f64180aa3"
REQUEST_ID=1
cast send $VRF_COORDINATOR "fulfillRandomWords(uint256,address)" $REQUEST_ID $LOTTERY_ADDRESS --private-key $PRIVATE_KEY

echo "Simulation complete. Check the frontend Hall of Fame for the winner."
