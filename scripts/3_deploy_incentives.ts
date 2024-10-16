import { ethers } from 'hardhat';
import { deployContract, sendTxn, writeToFile, readFromFile } from './helper';
import { read } from 'fs';
import { InitializableAdminUpgradeabilityProxy, TestnetERC20 } from '../types';

async function deployStake(): Promise<void> {
  const rewardTokenAddress = readFromFile('rewardToken');
  const COOLDOWN_SECONDS = '3600';
  const UNSTAKE_WINDOW = '1800';

  const rewardToken = (await ethers.getContractAt(
    'TestnetERC20',
    rewardTokenAddress
  )) as TestnetERC20;

  const proxy = await deployContract<InitializableAdminUpgradeabilityProxy>(
    'InitializableAdminUpgradeabilityProxy',
    []
  );
}
