import { HardhatUserConfig } from 'hardhat/types';
import { accounts } from './helpers/test-wallets';
import { getEtherscanEndpoints, NETWORKS_RPC_URL } from './helper-hardhat-config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomicfoundation/hardhat-chai-matchers';
import '@typechain/hardhat';
import '@tenderly/hardhat-tenderly';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';
import { task, subtask } from 'hardhat/config';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const TASK_VERIFY_GET_ETHERSCAN_ENDPOINT = 'verify:get-etherscan-endpoint';

const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const MAINNET_FORK = process.env.MAINNET_FORK === 'true';
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT || '';
const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME || '';
const TENDERLY_FORK_NETWORK_ID = process.env.TENDERLY_FORK_NETWORK_ID || '1';
const REPORT_GAS = process.env.REPORT_GAS === 'true';

const customChains = {
  '168587773': {
    chainId: 168587773,
    urls: {
      apiURL: 'https://api-sepolia.blastscan.io/api',
      browserURL: 'https://sepolia.blastscan.io/',
    },
  },
  '81457': {
    chainId: 81457,
    urls: {
      apiURL: 'https://api.blastscan.io/api',
      browserURL: 'https://blastscan.io/',
    },
  },
};

subtask(TASK_VERIFY_GET_ETHERSCAN_ENDPOINT).setAction(async (_, { network }) => {
  const chainId = parseInt(await network.provider.send('eth_chainId'), 16);
  return customChains[chainId].urls;
});

const mainnetFork = MAINNET_FORK
  ? {
      blockNumber: 12012081,
      url: NETWORKS_RPC_URL['main'],
    }
  : undefined;

// export hardhat config
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: { enabled: true, runs: 25000 },
          evmVersion: 'london',
        },
      },
    ],
  },
  tenderly: {
    project: TENDERLY_PROJECT,
    username: TENDERLY_USERNAME,
    forkNetwork: TENDERLY_FORK_NETWORK_ID,
  },
  typechain: {
    outDir: 'types',
    externalArtifacts: [
      'node_modules/@aave/core-v3/artifacts/contracts/**/*[!dbg].json',
      'node_modules/@aave/core-v3/artifacts/contracts/**/**/*[!dbg].json',
      'node_modules/@aave/core-v3/artifacts/contracts/**/**/**/*[!dbg].json',
      'node_modules/@aave/core-v3/artifacts/contracts/mocks/tokens/WETH9Mocked.sol/WETH9Mocked.json',
    ],
  },
  gasReporter: {
    enabled: REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API,
  },
  networks: {
    hardhat: {
      hardfork: 'berlin',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      chainId: 31337,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
      forking: mainnetFork,
      allowUnlimitedContractSize: true,
    },
    ganache: {
      url: 'http://localhost:8545',
      accounts: {
        mnemonic:
          'misery, energy, fitness, glove, cook, casual, regret, craft, ship, inspire, lazy, horror',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
    blastSepolia: {
      url: 'https://sepolia.blast.io',
      accounts: process.env.BLAST_SEPOLIA_PRIVATE_KEY
        ? [process.env.BLAST_SEPOLIA_PRIVATE_KEY]
        : [],
    },
  },
  mocha: {
    timeout: 80000,
    bail: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    aclAdmin: {
      default: 0,
    },
    emergencyAdmin: {
      default: 0,
    },
    poolAdmin: {
      default: 0,
    },
    addressesProviderRegistryOwner: {
      default: 0,
    },
    treasuryProxyAdmin: {
      default: 1,
    },
    incentivesProxyAdmin: {
      default: 1,
    },
    incentivesEmissionManager: {
      default: 0,
    },
    incentivesRewardsVault: {
      default: 2,
    },
  },
  // Need to compile aave-v3 contracts due no way to import external artifacts for hre.ethers
  dependencyCompiler: {
    paths: [
      '@aave/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol',
      '@aave/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol',
      '@aave/core-v3/contracts/misc/AaveOracle.sol',
      '@aave/core-v3/contracts/protocol/tokenization/AToken.sol',
      '@aave/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol',
      '@aave/core-v3/contracts/protocol/tokenization/StableDebtToken.sol',
      '@aave/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol',
      '@aave/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol',
      '@aave/core-v3/contracts/protocol/pool/Pool.sol',
      '@aave/core-v3/contracts/protocol/pool/PoolConfigurator.sol',
      '@aave/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol',
      '@aave/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol',
      '@aave/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol',
      '@aave/core-v3/contracts/deployments/ReservesSetupHelper.sol',
      '@aave/core-v3/contracts/misc/AaveProtocolDataProvider.sol',
      '@aave/core-v3/contracts/protocol/configuration/ACLManager.sol',
      '@aave/core-v3/contracts/dependencies/weth/WETH9.sol',
      '@aave/core-v3/contracts/mocks/helpers/MockIncentivesController.sol',
      '@aave/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol',
      '@aave/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol',
      '@aave/core-v3/contracts/mocks/tokens/MintableERC20.sol',
      '@aave/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol',
      '@aave/core-v3/contracts/mocks/tokens/WETH9Mocked.sol',
      '@aave/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol',
      '@aave/core-v3/contracts/mocks/upgradeability/MockAToken.sol',
      '@aave/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol',
      '@aave/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol',
      '@aave/core-v3/contracts/mocks/helpers/MockPool.sol',
      '@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol',
      '@aave/core-v3/contracts/mocks/oracle/PriceOracle.sol',
      '@aave/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol',
    ],
  },
  external: {
    contracts: [
      {
        artifacts: './temp-artifacts',
        deploy: 'node_modules/@aave/deploy-v3/dist/deploy',
      },
    ],
  },
  etherscan: {
    apiKey: 'CT4NB7IQQC5TYKP2MSI8BKUPGIBSTK6JA7y',
  },
};
export default config;
