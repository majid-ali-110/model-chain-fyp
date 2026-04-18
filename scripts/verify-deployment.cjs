const path = require('path');
const fs = require('fs');
const { JsonRpcProvider } = require('ethers');

const DEFAULT_RPCS = {
  localhost: process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545',
  polygonAmoy: process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology',
};

const REQUIRED_CONTRACT_KEYS = [
  'ModelRegistry',
  'Marketplace',
  'Governance',
  'UserRegistry',
];

const ADDRESS_MANAGEMENT_POLICY = {
  requireAllContractsPerNetwork: true,
  allowEmptyOnlyForUnsupportedNetworks: true,
  verifyBeforeDemoOn: ['localhost', 'polygonAmoy'],
  evidenceRequired: ['network', 'deployer', 'transactionHash', 'blockNumber'],
};

function loadContractsMap() {
  const contractsFilePath = path.resolve(__dirname, '../src/contracts/index.js');
  const source = fs.readFileSync(contractsFilePath, 'utf8');

  const exportMarker = 'export const CONTRACT_ADDRESSES =';
  const startIndex = source.indexOf(exportMarker);
  if (startIndex === -1) {
    throw new Error('Unable to locate CONTRACT_ADDRESSES export.');
  }

  const objectStartIndex = source.indexOf('{', startIndex);
  const objectEndIndex = source.indexOf('};', objectStartIndex);
  if (objectStartIndex === -1 || objectEndIndex === -1) {
    throw new Error('Unable to parse CONTRACT_ADDRESSES object.');
  }

  const objectLiteral = source.slice(objectStartIndex, objectEndIndex + 1);
  // eslint-disable-next-line no-new-func -- Controlled local source parsing for deployment utility
  return Function(`return (${objectLiteral});`)();
}

function validateNetworkContracts(contractsMap, networkKey) {
  const addresses = contractsMap[networkKey];

  if (!addresses) {
    return {
      ok: false,
      issues: [`Unknown network key: ${networkKey}`],
    };
  }

  const issues = [];
  for (const key of REQUIRED_CONTRACT_KEYS) {
    const value = addresses[key];
    if (!value) {
      issues.push(`Missing address for ${networkKey}.${key}`);
      continue;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(value) || value === '0x0000000000000000000000000000000000000000') {
      issues.push(`Invalid address format for ${networkKey}.${key}: ${value}`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}

async function verifyOnChainCode(networkKey, addresses, rpcUrl) {
  const provider = new JsonRpcProvider(rpcUrl);
  const failures = [];

  for (const [name, address] of Object.entries(addresses)) {
    const code = await provider.getCode(address);
    if (!code || code === '0x') {
      failures.push(`No contract bytecode at ${networkKey}.${name} (${address}) on ${rpcUrl}`);
    }
  }

  return failures;
}

async function main() {
  const requestedNetworks = process.argv.slice(2);
  const targets = requestedNetworks.length > 0 ? requestedNetworks : ['localhost', 'polygonAmoy'];
  const CONTRACTS = loadContractsMap();

  console.log('Address management policy:', ADDRESS_MANAGEMENT_POLICY);

  let hasFailure = false;

  for (const networkKey of targets) {
    console.log(`\n--- Verifying network: ${networkKey} ---`);

    const shapeResult = validateNetworkContracts(CONTRACTS, networkKey);
    if (!shapeResult.ok) {
      hasFailure = true;
      console.error('Address validation failed:');
      for (const issue of shapeResult.issues) {
        console.error(`  - ${issue}`);
      }
      continue;
    }

    console.log('Address validation passed.');

    const rpcUrl = process.env[`${networkKey.toUpperCase()}_RPC_URL`] || DEFAULT_RPCS[networkKey];
    if (!rpcUrl) {
      console.log('No RPC URL configured for bytecode verification. Skipping chain check.');
      continue;
    }

    try {
      const bytecodeFailures = await verifyOnChainCode(networkKey, CONTRACTS[networkKey], rpcUrl);
      if (bytecodeFailures.length > 0) {
        hasFailure = true;
        console.error('Bytecode verification failed:');
        for (const issue of bytecodeFailures) {
          console.error(`  - ${issue}`);
        }
      } else {
        console.log(`Bytecode verification passed for ${networkKey}.`);
      }
    } catch (error) {
      hasFailure = true;
      console.error(`RPC verification failed for ${networkKey}: ${error.message}`);
    }
  }

  if (hasFailure) {
    process.exit(1);
  }

  console.log('\nAll requested deployment checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
