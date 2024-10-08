const ethers = require("ethers");
const XLSX = require("xlsx");

const provider = new ethers.providers.JsonRpcProvider(
  "https://opt-mainnet.g.alchemy.com/v2/9-2O3J1H0d0Z-xDdDwZHHCBM2mwzVMwT"
);
const contractABI = [
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getRewardToken",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const OP_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000042"; // Replace with your OP Token address
const inputFilePath = "with_withdrawRemainingTokens.xlsx"; // Path to your Excel file
const outputFilePath = "noOwnerNoOpReward.xlsx"; // Path to save the output Excel file

// Output data array
const outputData = [];

// Load and parse the input Excel file
const workbook = XLSX.readFile(inputFilePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

// Function to process each address
async function processAddresses() {
  let count = 0;
  for (const row of rows) {
    const address = row.Address;
    console.log(address);

    // // Validate the address format
    // if (!ethers.utils.isAddress(address)) {
    //   console.error(`Invalid address: ${address}`);
    //   continue;
    // }

    try {
      // Create a contract instance for the current address
      const contract = new ethers.Contract(address, contractABI, provider);

      // Call the owner() function to check if the owner is the zero address
      const owner = await contract.owner();
      if (owner === ethers.constants.AddressZero) {
        // Add to the list if the owner is 0x00...
        outputData.push({
          address,
          reason: "noOwner",
        });
        console.log("owner suspect");
        count++;
      }

      // Call the getRewardToken() function to verify the reward token
      const rewardToken = await contract.getRewardToken();
      if (rewardToken !== OP_TOKEN_ADDRESS) {
        // Add to the list if the reward token is not the expected OP token
        outputData.push({
          address,
          reason: "tokenNotOP",
        });
        console.log("token suspect");
        count++;
      }
    } catch (error) {
      console.error(`Error processing address ${address}:`, error.message);
      // Optionally, you can log the error to the outputData for tracking issues:
      outputData.push({
        address,
        reason: `error: ${error.message}`,
      });
    }
  }

  // Write the output data to a new XLSX file
  const newSheet = XLSX.utils.json_to_sheet(outputData);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Results");
  XLSX.writeFile(newWorkbook, outputFilePath);

  console.log("Processing complete. Results saved to", outputFilePath);
}

// Run the processing function
processAddresses()
  .then(() => {
    console.log("Address processing finished.");
  })
  .catch((err) => {
    console.error("An error occurred during processing:", err);
  });

// console.log(rows);
