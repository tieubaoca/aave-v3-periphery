import { ethers } from 'hardhat';
import {
  AaveEcosystemReserveV2,
  InitializableAdminUpgradeabilityProxy,
  RewardsController,
} from '../types';
import { deployContract, sendTxn, writeToFile } from './helper';

async function deployTreasury(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const rewardController = await deployContract<RewardsController>(
    'RewardsController',
    [deployer.address],
    'RewardController'
  );

  const treasuryImpl = await deployContract<AaveEcosystemReserveV2>('AaveEcosystemReserveV2', []);
  await sendTxn(treasuryImpl.initialize(ethers.constants.AddressZero), 'treasuryImpl.initialize');

  const proxy = await deployContract<InitializableAdminUpgradeabilityProxy>(
    'InitializableAdminUpgradeabilityProxy',
    []
  );
  const initializeData = treasuryImpl.interface.encodeFunctionData('initialize', [
    rewardController.address,
  ]);
  await sendTxn(
    proxy['initialize(address,address,bytes)'](
      treasuryImpl.address,
      deployer.address,
      initializeData
    ),
    'proxy.initialize'
  );
  writeToFile({
    rewardController: rewardController.address,
    treasuryProxy: proxy.address,
    treasuryImpl: treasuryImpl.address,
  });
}
deployTreasury()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
