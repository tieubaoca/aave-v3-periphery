import { ethers } from 'hardhat';
import { deployContract, sendTxn, writeToFile } from './helper';
import { EmissionManager } from '../types';

async function deployEmission(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const emissionManager = deployContract<EmissionManager>('EmissionManager', [deployer.address]);
}
