const express = require("express");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { encodePacked, bytesToHex } = require("viem");

const app = express();
const port = 3000;

app.use(express.json());

let storedTree;

// Function to create Merkle tree from address-cap pairs
async function createMerkleTree(airdropData) {
  console.log("called");
  const packed = keccak256(
    encodePacked(
      ["address", "uint256"],
      ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 100]
    )
  );
  console.log(bytesToHex(packed));
  console.log("ho gaya");

  // Create leaf nodes by hashing each address and cap as key-value pairs
  const leafNodes = Object.entries(airdropData).map(([address, cap]) => {
    // Use ethers.utils.solidityPack to mimic abi.encodePacked
    const packed = encodePacked(["address", "uint256"], [address, cap]);
    // console.log(packed);
    // Then hash the packed data
    return keccak256(packed);
  });

  console.log("leaf", leafNodes);

  // Create the Merkle tree with sorted leaves and pairs
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortLeaves: true,
    sortPairs: true,
  });

  console.log("tree", merkleTree);

  // Get the Merkle root
  const merkleRoot = merkleTree.getRoot().toString("hex");
  console.log("root", merkleRoot);

  return {
    merkleTree,
    merkleRoot,
  };
}

app.get("/gen-leaf", async (req, res) => {
  const { address, amount } = req.body;
  console.log("called");
  const packed = keccak256(
    encodePacked(["address", "uint256"], [address, amount])
  );
  const packedEg = keccak256(
    encodePacked(
      ["address", "uint256"],
      ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 100]
    )
  );
  console.log(bytesToHex(packedEg));
  console.log("ho gaya");
  res.json({
    leaf: bytesToHex(packed),
  });
});
// API endpoint to create the Merkle tree and return the root
app.post("/create-tree", async (req, res) => {
  try {
    const airdropData = req.body;

    if (!airdropData || typeof airdropData !== "object") {
      return res.status(400).json({ error: "Invalid airdrop data" });
    }

    const { merkleTree, merkleRoot } = await createMerkleTree(airdropData);
    storedTree = merkleTree;
    console.log("----");
    console.log(merkleTree);
    console.log(merkleRoot);

    res.json({
      message: "Merkle tree created successfully",
      merkleRoot: merkleRoot,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating Merkle tree" });
  }
});

// API endpoint to get proof for a specific address and cap using provided Merkle root
app.post("/get-proof", (req, res) => {
  const { leaf } = req.body;

  if (!leaf) {
    return res
      .status(400)
      .json({ error: "Address, cap, and airdropData are required" });
  }

  try {
    // Get the Merkle proof for the leaf node
    const proof = storedTree.getHexProof(leaf);
    console.log(proof);

    res.json({
      message: "Proof generated successfully",
      proof: proof,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating proof" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
