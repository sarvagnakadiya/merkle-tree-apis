const axios = require("axios");
const xlsx = require("xlsx");

const apiKey = "FBMND61RM2KYWDHWD42PRMTAX5UE2H153G";
const apiUrl =
  "https://api-optimistic.etherscan.io/api?module=contract&action=getabi&apikey=" +
  apiKey;

const inputXlsx = "contract_without_gnosis_vault.xlsx"; // Your input .xlsx file
const outputXlsx = "contract_ab_results.xlsx"; // Your output .xlsx file

// Read the input XLSX file
const workbook = xlsx.readFile(inputXlsx);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

(async () => {
  console.log("Processing API requests...");

  // Initialize an array to store results
  const results = [];

  // Loop through the addresses and make API requests
  let verifiedcount = 0;
  for (const record of data) {
    const address = record["Address"];
    let result = { Address: address, Status: "" };

    try {
      const response = await axios.get(`${apiUrl}&address=${address}`);
      const status = response.data.status;

      if (status === "1") {
        result.Status = "verified";
        console.log(`Success: Address ${address}`);
        verifiedcount++;
      } else {
        result.Status = "not verified";
        console.log(`Failure: Address ${address}`);
      }
    } catch (error) {
      result.Status = "Error";
      console.error(
        `Error fetching data for address ${address}:`,
        error.message
      );
    }

    // Push the result for the address to the results array
    results.push(result);
  }
  console.log("verified account:", verifiedcount);

  // Create a new workbook and add the results as a new sheet
  const outputWorkbook = xlsx.utils.book_new();
  const outputSheet = xlsx.utils.json_to_sheet(results);
  xlsx.utils.book_append_sheet(outputWorkbook, outputSheet, "Results");

  // Write the output file
  xlsx.writeFile(outputWorkbook, outputXlsx);

  console.log("All requests completed. Results saved to", outputXlsx);
})();
