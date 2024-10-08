const fs = require("fs");
const path = require("path");

// Path to your JSON file
const inputFilePath = path.join(__dirname, "contractDetails.json"); // Replace 'contracts.json' with your actual file name
const outputFilePath = path.join(__dirname, "contractAddresses.json");

// Read the JSON file
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const contractsData = JSON.parse(data);

    // Extract contract addresses
    const contractAddresses = contractsData.map(
      (contract) => Object.keys(contract)[0]
    );

    // Create a new JSON object to store just the addresses
    const addressesJson = { contractAddresses };

    // Write the new JSON to a file
    fs.writeFile(
      outputFilePath,
      JSON.stringify(addressesJson, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }

        console.log(
          "Successfully created contractAddresses.json with contract addresses."
        );
      }
    );
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
  }
});
