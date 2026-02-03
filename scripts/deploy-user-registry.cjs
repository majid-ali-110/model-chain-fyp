const hre = require("hardhat");

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

  // Output for updating src/contracts/index.js
  console.log("\n📝 Update src/contracts/index.js UserRegistry address:");
  console.log(`UserRegistry: '${userRegistryAddress}',`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
