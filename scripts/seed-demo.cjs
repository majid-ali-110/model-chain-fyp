/**
 * seed-demo.cjs
 *
 * Seeds demo data into the freshly-deployed localhost contracts.
 * Run AFTER deploy.cjs:
 *   npx hardhat run scripts/seed-demo.cjs --network localhost
 *
 * What it does:
 *  - Claims 1000 MCT for accounts 0-4 (deployer + 4 demo voters)
 *  - Creates 2 sample governance proposals from account 0
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const signers = await hre.ethers.getSigners();
  const [deployer, voter1, voter2, voter3, voter4] = signers;

  // Read deployed addresses from the manifest written by deploy.cjs
  const manifestPath = path.join(__dirname, "..", "deployments", "localhost.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("deployments/localhost.json not found — run deploy.cjs first.");
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const governanceAddress = manifest.contracts.Governance;

  console.log("\n🌱  Seeding demo data...");
  console.log("   Governance contract:", governanceAddress);

  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = Governance.attach(governanceAddress);

  // ── 1. Claim MCT tokens for 5 accounts ─────────────────────────────────
  const claimers = [deployer, voter1, voter2, voter3, voter4];
  for (const signer of claimers) {
    const already = await governance.connect(signer).hasClaimedInitialTokens(signer.address);
    if (!already) {
      const tx = await governance.connect(signer).claimInitialTokens();
      await tx.wait();
      console.log(`   ✅ Claimed 1000 MCT for ${signer.address}`);
    } else {
      console.log(`   ⏭  ${signer.address} already claimed`);
    }
  }

  // ── 2. Create demo proposals from deployer ───────────────────────────────
  const PROPOSAL_TYPE_FEE = 0;
  const PROPOSAL_TYPE_FEATURE = 1;

  const proposals = [
    {
      title: "Reduce Platform Fee from 5% to 2.5%",
      description:
        "Current 5% marketplace fee is too high for early adopters. Proposing a reduction " +
        "to 2.5% for the first 6 months to grow the ecosystem and attract more developers.",
      type: PROPOSAL_TYPE_FEE,
    },
    {
      title: "Add On-Chain Model Verification Badge",
      description:
        "Introduce a community-verified badge for models that have passed peer review. " +
        "Verified models would display a checkmark and gain higher search ranking.",
      type: PROPOSAL_TYPE_FEATURE,
    },
  ];

  for (const p of proposals) {
    const tx = await governance
      .connect(deployer)
      .createProposal(p.title, p.description, "", p.type, [], []);
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log) => { try { return governance.interface.parseLog(log); } catch { return null; } })
      .find((e) => e && e.name === "ProposalCreated");
    const id = event ? event.args.proposalId.toString() : "?";
    console.log(`   ✅ Created proposal #${id}: "${p.title}"`);
  }

  console.log("\n🎉  Demo seed complete!");
  console.log("\n📋  Quick reference:");
  console.log("   MetaMask RPC   : http://127.0.0.1:8545  Chain ID: 31337");
  console.log("   Deployer (account #0):");
  console.log(`     Address : ${deployer.address}`);
  console.log(`     Key     : 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`);
  console.log("   Voter (account #1):");
  console.log(`     Address : ${voter1.address}`);
  console.log(`     Key     : 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
