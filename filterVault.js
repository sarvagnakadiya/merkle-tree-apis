const fs = require("fs");
const csv = require("csv-parser");

const inputFile = "contract_categories.csv";
const outputFile = "filtered_output.json";

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (data) => {
    if (data["Contract Type"] === "Vault Contract") {
      results.push(data["Contract Address"]);
    }
  })
  .on("end", () => {
    fs.writeFile(outputFile, JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error("Error writing JSON file", err);
      } else {
        console.log("JSON file has been written successfully");
      }
    });
  });
