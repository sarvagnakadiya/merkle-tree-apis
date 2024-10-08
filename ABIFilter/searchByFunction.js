const fs = require("fs");
const xlsx = require("xlsx");

// Load the JSON data
const jsonData = require("./contractDetails.json"); // Update the path to your JSON file

// Arrays to hold contracts with and without the 'withdrawRemainingTokens' function
const withFunction = [];
const withoutFunction = [];

// Check if ABI contains 'withdrawRemainingTokens' function
jsonData.forEach((contractData) => {
  const contractAddress = Object.keys(contractData)[0];
  const contractInfo = contractData[contractAddress];
  const abi = contractInfo.abi;

  // Ensure abi is defined and is an array before checking for the function
  const hasFunction =
    Array.isArray(abi) && abi.some((item) => item.name === "rescue");

  if (hasFunction) {
    withFunction.push({
      Address: contractAddress,
      Balance: contractInfo.balance,
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
createExcelFile(withFunction, "with_rescue.xlsx");
// createExcelFile(withoutFunction, "without_withdrawRemainingTokens.xlsx");

console.log(
  "Files have been created: with_withdrawRemainingTokens.xlsx and without_withdrawRemainingTokens.xlsx"
);
