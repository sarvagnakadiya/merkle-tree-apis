const fs = require("fs");
const path = require("path");

// Path to your JSON file
const inputFilePath = path.join(__dirname, "contractAddresses.json");

// Read the JSON file
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const contractsData = JSON.parse(data);

    // Log all the contract addresses
    contractsData.contractAddresses.forEach((address) => {
      console.log(address);
    });
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
  }
});
