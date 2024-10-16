import { ethers } from 'hardhat';
import { RewardsController } from '../../types';
import { deployContract, writeToFile } from '../helper';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const rewardController = await deployContract<RewardsController>(
    'RewardsController',
    [deployer.address],
    'RewardController'
  );

  writeToFile({
    rewardController: rewardController.address,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
