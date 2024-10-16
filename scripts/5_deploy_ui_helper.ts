import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { UiIncentiveDataProviderV3, UiPoolDataProviderV3 } from '../types';

async function deployUiHelper(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const ethAggregator = readFromFile('wethPriceAggregator');

  const uiIncentiveDataProvider = await deployContract<UiIncentiveDataProviderV3>(
    'UiIncentiveDataProviderV3',
    []
  );

  const uiPoolDataProvider = await deployContract<UiPoolDataProviderV3>('UiPoolDataProviderV3', [
    ethAggregator,
    ethAggregator,
  ]);

  writeToFile({
    uiIncentiveDataProvider: uiIncentiveDataProvider.address,
    uiPoolDataProvider: uiPoolDataProvider.address,
  });
}

deployUiHelper()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
