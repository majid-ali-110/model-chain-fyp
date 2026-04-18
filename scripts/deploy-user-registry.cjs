const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying UserRegistry with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy UserRegistry
  console.log("\n📦 Deploying UserRegistry...");
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.waitForDeployment();
  const userRegistryAddress = await userRegistry.getAddress();
  console.log("✅ UserRegistry deployed to:", userRegistryAddress);

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log(`Network: ${hre.network.name}`);
  console.log(`UserRegistry: ${userRegistryAddress}`);
  console.log("=".repeat(50));

  const deployment = {
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      UserRegistry: userRegistryAddress,
    },
  };

  const outputDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `${hre.network.name}-user-registry.json`);
  fs.writeFileSync(outputFile, JSON.stringify(deployment, null, 2));
  console.log(`\n💾 Deployment manifest written: ${outputFile}`);

  // Output for updating src/contracts/index.js
  console.log("\n📝 Update src/contracts/index.js UserRegistry address:");
  console.log(`UserRegistry: '${userRegistryAddress}',`);

  console.log("\n🔎 Verify deployment map + on-chain bytecode:");
  console.log(`npm run verify:deployment -- ${hre.network.name}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
