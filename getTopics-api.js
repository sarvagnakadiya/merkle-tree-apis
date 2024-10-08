const express = require("express");
const cors = require("cors");
const {
  HypersyncClient,
  BlockField,
  LogField,
} = require("@envio-dev/hypersync-client");
const { getAddress } = require("ethers");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());

const networkConfig = {
  arbitrum: {
    url: "https://arbitrum.hypersync.xyz",
    AAVE_V3_POOL: "0x8145edddf43f50276641b55bd3ad95944510021e",
  },
  optimism: {
    url: "https://optimism.hypersync.xyz",
    AAVE_V3_POOL: "0x4200000000000000000000000000000000000042",
  },
  ethereum: {
    url: "https://eth.hypersync.xyz",
    AAVE_V3_POOL: "0x64b761D848206f447Fe2dd461b0c635Ec39EbB27",
  },
  polygon: {
    url: "https://polygon.hypersync.xyz",
    AAVE_V3_POOL: "0x8145eddDf43f50276641b55bd3AD95944510021E",
  },
  base: {
    url: "https://base.hypersync.xyz",
    AAVE_V3_POOL: "0x5731a04B1E775f0fdd454Bf70f3335886e9A96be",
  },
};

app.get("/", (req, res) => {
  res.send(`
      <h1>Welcome to the Aave V3 Pool API</h1>
      <p>Use the following endpoint to get aTokens for a specific network:</p>
      <ul>
        <li><code>/getATokens/arbitrum</code></li>
        <li><code>/getATokens/optimism</code></li>
        <li><code>/getATokens/ethereum</code></li>
        <li><code>/getATokens/polygon</code></li>
        <li><code>/getATokens/base</code></li>
      </ul>
      <p><em>Supported by Hypersync | ENVIO</em></p>
    `);
});

app.get("/getDetails/:networkName", async (req, res) => {
  const networkName = req.params.networkName.toLowerCase();

  // Check if the network is supported
  if (!networkConfig[networkName]) {
    return res.status(400).send("Unsupported network");
  }

  const { url, AAVE_V3_POOL } = networkConfig[networkName];

  const client = HypersyncClient.new({
    url: url,
    bearerToken: process.env.HYPERSYNC_BEARER_TOKEN,
  });

  //   const RESERVE_INITIALIZED_TOPIC =
  //     "0x3a0ca721fc364424566385a1aa271ed508cc2c0949c2272575fb3013a163a45f";
  const RESERVE_INITIALIZED_TOPIC =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  const query = {
    fromBlock: 0,
    logs: [
      {
        address: [AAVE_V3_POOL],
        topics: [[RESERVE_INITIALIZED_TOPIC]],
      },
    ],
    fieldSelection: {
      block: [BlockField.Number, BlockField.Timestamp],
      log: [
        LogField.BlockNumber,
        LogField.LogIndex,
        LogField.TransactionIndex,
        LogField.TransactionHash,
        LogField.Address,
        LogField.Topic0,
        LogField.Topic1,
        LogField.Topic2,
      ],
    },
  };

  try {
    const result = await client.get(query);
    console.log(result.nextBlock);

    // Extract and checksum topics
    const extractedTopics = result.data.logs.map((log) => ({
      asset: getAddress(
        log.topics[1].replace("0x000000000000000000000000", "0x")
      ),
      aToken: getAddress(
        log.topics[2].replace("0x000000000000000000000000", "0x")
      ),
    }));

    // Return the extracted data as JSON
    res.json(extractedTopics);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
