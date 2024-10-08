const fs = require("fs");
const xlsx = require("xlsx");

// Load the JSON data
const jsonData = require("./contractDetails.json"); // Update the path to your JSON file

// Arrays to hold contracts with and without the specific 'sweep' function
const withFunction = [];
const withoutFunction = [];

// Function to check if a function matches the specific 'sweep' signature
const isSpecificSweepFunction = (func) => {
  return (
    func.type === "function" &&
    func.name.toLowerCase() === "sweep" &&
    func.inputs &&
    func.inputs.length === 3 &&
    func.inputs[0].type === "address" &&
    func.inputs[1].type === "address" &&
    func.inputs[2].type === "uint256" &&
    func.outputs &&
    func.outputs.length === 0 &&
    func.stateMutability === "nonpayable"
  );
};

// Check if ABI contains the specific 'sweep' function
jsonData.forEach((contractData) => {
  const contractAddress = Object.keys(contractData)[0];
  const contractInfo = contractData[contractAddress];
  const abi = contractInfo.abi;

  // Ensure abi is defined and is an array before checking for the function
  const specificSweepFunction = Array.isArray(abi)
    ? abi.find(isSpecificSweepFunction)
    : null;

  if (specificSweepFunction) {
    withFunction.push({
      Address: contractAddress,
      Balance: contractInfo.balance,
      FunctionName: specificSweepFunction.name,
    });
  } else {
    withoutFunction.push({
      Address: contractAddress,
      Balance: contractInfo.balance,
    });
  }
});

// Write to XLSX files
const createExcelFile = (data, filename) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  xlsx.writeFile(workbook, filename);
};

// Create two XLSX files
createExcelFile(withFunction, "with_sweepForSure.xlsx");
createExcelFile(withoutFunction, "without_specificSweepFunction.xlsx");

console.log(
  "Files have been created: with_specificSweepFunction.xlsx and without_specificSweepFunction.xlsx"
);
