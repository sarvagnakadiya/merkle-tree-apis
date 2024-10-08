const { ethers } = require("ethers");
const fs = require("fs").promises;

const inputFile = "filtered_output.json";
const outputFile = "matching_contracts.json";

// Replace with your Ethereum node URL (e.g., Infura endpoint)
const providerUrl =
  "https://opt-mainnet.g.alchemy.com/v2/9-2O3J1H0d0Z-xDdDwZHHCBM2mwzVMwT";
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const targetAddress = "0x4200000000000000000000000000000000000042";

const abi = [
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "asset",
    outputs: [{ name: "", type: "address" }],
    type: "function",
  },
];

async function checkContract(address) {
  const contract = new ethers.Contract(address, abi, provider);

  try {
    const tokenResult = await contract.token();
    if (tokenResult.toLowerCase() === targetAddress.toLowerCase()) {
      return true;
    }
    // If token() returns a valid address but it's not the target, we don't need to check asset()
    return false;
  } catch (error) {
    // token() function doesn't exist or other error, continue to check asset()
  }

  try {
    const assetResult = await contract.asset();
    return assetResult.toLowerCase() === targetAddress.toLowerCase();
  } catch (error) {
    // asset() function doesn't exist or other error
  }

  return false;
}

async function main() {
  try {
    const addresses = JSON.parse(await fs.readFile(inputFile, "utf8"));
    const matchingAddresses = [];

    for (const address of addresses) {
      console.log(`Checking contract: ${address}`);
      const isMatching = await checkContract(address);
      if (isMatching) {
        matchingAddresses.push(address);
      }
    }

    await fs.writeFile(outputFile, JSON.stringify(matchingAddresses, null, 2));
    console.log(`Matching addresses written to ${outputFile}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
