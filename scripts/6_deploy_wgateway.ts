import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { WalletBalanceProvider, WrappedTokenGatewayV3 } from '../types';

async function deployWGateway(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  const poolProxy = readFromFile('poolProxy');

  const weth = readFromFile('weth');
  const wethGateway = await deployContract<WrappedTokenGatewayV3>('WrappedTokenGatewayV3', [
    weth,
    deployer.address,
    poolProxy,
  ]);

  const walletBalanceProvider = await deployContract<WalletBalanceProvider>(
    'WalletBalanceProvider',
    []
  );

  writeToFile({
    wethGateway: wethGateway.address,
    walletBalanceProvider: walletBalanceProvider.address,
  });
}

deployWGateway()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
