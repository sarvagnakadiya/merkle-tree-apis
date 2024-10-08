const fs = require("fs");
const xlsx = require("xlsx");

// Load the JSON data
const jsonData = require("./contractDetails.json"); // Update the path to your JSON file

// Arrays to hold contracts with and without the 'sweep' function
const withFunction = [];
const withoutFunction = [];

// // Function to check if a string contains any variation of 'sweep'
// const containsSweep = (str) => {
//   return /sweep/i.test(str);
// };
const containsSweep = (str) => {
  return /[Ss]weep/i.test(str);
};
// Check if ABI contains any 'sweep' function
jsonData.forEach((contractData) => {
  const contractAddress = Object.keys(contractData)[0];
  const contractInfo = contractData[contractAddress];
  const abi = contractInfo.abi;

  // Ensure abi is defined and is an array before checking for the function
  const sweepFunctions = Array.isArray(abi)
    ? abi.filter((item) => item.type === "function" && containsSweep(item.name))
    : [];

  if (sweepFunctions.length > 0) {
    sweepFunctions.forEach((func) => {
      withFunction.push({
        Address: contractAddress,
        Balance: contractInfo.balance,
        FunctionName: func.name,
      });
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
createExcelFile(withFunction, "with_sweepFunctionExtended.xlsx");
createExcelFile(withoutFunction, "without_sweepFunction.xlsx");

console.log(
  "Files have been created: with_sweepFunction.xlsx and without_sweepFunction.xlsx"
);
