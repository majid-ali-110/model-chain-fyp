const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ModelRegistry
  console.log("\n📦 Deploying ModelRegistry...");
  const ModelRegistry = await hre.ethers.getContractFactory("ModelRegistry");
  const modelRegistry = await ModelRegistry.deploy();
  await modelRegistry.waitForDeployment();
  const modelRegistryAddress = await modelRegistry.getAddress();
  console.log("✅ ModelRegistry deployed to:", modelRegistryAddress);

  // Deploy Marketplace with ModelRegistry address
  console.log("\n📦 Deploying Marketplace...");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(modelRegistryAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ Marketplace deployed to:", marketplaceAddress);

  // Deploy Governance
  console.log("\n📦 Deploying Governance...");
  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("✅ Governance deployed to:", governanceAddress);

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
  console.log(`ModelRegistry: ${modelRegistryAddress}`);
  console.log(`Marketplace: ${marketplaceAddress}`);
  console.log(`Governance: ${governanceAddress}`);
  console.log(`UserRegistry: ${userRegistryAddress}`);
  console.log("=".repeat(50));

  const deployment = {
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      ModelRegistry: modelRegistryAddress,
      Marketplace: marketplaceAddress,
      Governance: governanceAddress,
      UserRegistry: userRegistryAddress,
    },
  };

  const outputDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `${hre.network.name}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(deployment, null, 2));
  console.log(`\n💾 Deployment manifest written: ${outputFile}`);

  // Output for updating src/contracts/index.js
  console.log("\n📝 Update src/contracts/index.js with:");
  console.log(`
  ${hre.network.name}: {
    ModelRegistry: '${modelRegistryAddress}',
    Marketplace: '${marketplaceAddress}',
    Governance: '${governanceAddress}',
    UserRegistry: '${userRegistryAddress}',
  },
  `);

  console.log("\n🔎 Verify deployment map + on-chain bytecode:");
  console.log(`npm run verify:deployment -- ${hre.network.name}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
