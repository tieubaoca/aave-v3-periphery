import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { Faucet, TestnetERC20, WETH9Mock } from '../types';

async function deployFaucet(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const faucet = await deployContract<Faucet>('Faucet', [deployer.address, true, 1000]);

  const usdt = await deployContract<TestnetERC20>('TestnetERC20', [
    'USDT',
    'USDT',
    6,
    faucet.address,
  ]);

  const usdc = await deployContract<TestnetERC20>('TestnetERC20', [
    'USDC',
    'USDC',
    6,
    faucet.address,
  ]);

  const btc = await deployContract<TestnetERC20>('TestnetERC20', ['BTC', 'BTC', 8, faucet.address]);

  const rewardToken = await deployContract<TestnetERC20>('TestnetERC20', [
    'Token Reward',
    'TKR',
    18,
    faucet.address,
  ]);
  const weth = await deployContract<WETH9Mock>('WETH9Mock', [
    'Wrapped Ether',
    'WETH',
    faucet.address,
  ]);

  await sendTxn(faucet.mint(usdt.address, deployer.address, 1000), 'faucet.mint(usdt)');
  await sendTxn(faucet.mint(usdc.address, deployer.address, 1000), 'faucet.mint(usdc)');
  await sendTxn(faucet.mint(btc.address, deployer.address, 1000), 'faucet.mint(btc)');
  await sendTxn(faucet.mint(weth.address, deployer.address, 1000), 'faucet.mint(weth)');
  await sendTxn(
    faucet.mint(rewardToken.address, deployer.address, 1000),
    'faucet.mint(rewardToken)'
  );

  writeToFile({
    faucet: faucet.address,
    usdt: usdt.address,
    usdc: usdc.address,
    btc: btc.address,
    weth: weth.address,
    rewardToken: rewardToken.address,
  });
}

deployFaucet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
