const fs = require("fs").promises;

const inputFile1 = "all_vault.json";
const inputFile2 = "op_vault.json";
const outputFile = "unique_addresses1.json";

async function removeCommonAddresses() {
  try {
    // Read both input files
    const addresses1 = new Set(
      JSON.parse(await fs.readFile(inputFile1, "utf8"))
    );
    const addresses2 = new Set(
      JSON.parse(await fs.readFile(inputFile2, "utf8"))
    );

    // Remove addresses from addresses1 that are present in addresses2
    const uniqueAddresses = [...addresses1].filter(
      (address) => !addresses2.has(address)
    );

    // Write the unique addresses to the output file
    await fs.writeFile(outputFile, JSON.stringify(uniqueAddresses, null, 2));

    console.log(`Unique addresses written to ${outputFile}`);
    console.log(`Total unique addresses: ${uniqueAddresses.length}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

removeCommonAddresses();
