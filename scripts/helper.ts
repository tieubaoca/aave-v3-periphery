import { ethers } from 'hardhat';
import { ContractFactory, Contract } from 'ethers';
import * as fs from 'fs';

async function deployContract<T>(name: string, args: any[], label?: any, options?: any) {
  if (!options && typeof label === 'object') {
    label = null;
    options = label;
  }

  let info = name;
  if (label) {
    info = name + ':' + label;
  }
  let contract: Contract;
  if (!options) {
    contract = await ethers.deployContract(name, args);
  } else {
    contract = await ethers.deployContract(name, args, options);
  }
  console.log(args.toString());
  const argStr = args.map((i) => `"${i}"`).join(' ');
  console.info(`Deploying ${info} ${contract.address} ${argStr}`);
  await contract.deployed();
  console.info('... Completed!');
  return contract as T;
}

async function deployContractWithArtifact(artifact: any, args: any[], label: any, options: any) {
  if (!options && typeof label === 'object') {
    label = null;
    options = label;
  }

  let info = artifact.contractName;
  if (label) {
    info = artifact.contractName + ':' + label;
  }
  const contractFactory = new ContractFactory(
    artifact.abi,
    artifact.bytecode,
    await ethers.provider.getSigner()
  );

  const contract = await contractFactory.deploy(...args);
  const argStr = args.map((i) => `"${i}"`).join(' ');
  console.info(`Deploying ${info} ${contract.address} ${argStr}`);
  await contract.deployed();
  console.info('... Completed!');
  return contract;
}

async function sendTxn(txnPromise: Promise<any>, label: string): Promise<any> {
  console.info(`Processing ${label}:`);
  const txn = await txnPromise;
  console.info(`Sending ${label}...`);
  await txn.wait(1);
  console.info(`... Sent! ${txn.hash}`);
  return txn;
}

function writeToFile(data: any) {
  const network = process.env.HARDHAT_NETWORK || 'hardhat';
  const filePath = `./deployed/${network}-addresses.json`;
  if (!fs.existsSync('./deployed')) {
    fs.mkdirSync('./deployed');
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  const file = fs.readFileSync(filePath);
  const json = JSON.parse(file.toString());
  for (const key in data) {
    json[key] = data[key];
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

function readFromFile(contract: string) {
  const network = process.env.HARDHAT_NETWORK || 'hardhat';
  const filePath = `./deployed/${network}-addresses.json`;
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const file = fs.readFileSync(filePath);
  const json = JSON.parse(file.toString());
  return json[contract];
}
export { readFromFile, writeToFile, deployContract, sendTxn, deployContractWithArtifact };
