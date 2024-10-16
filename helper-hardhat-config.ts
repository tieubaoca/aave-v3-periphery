// @ts-ignore
import { HardhatNetworkForkingUserConfig } from 'hardhat/types';
import { eEthereumNetwork, iParamsPerNetwork } from './helpers/types';
import { EthereumProvider } from 'hardhat/types';
require('dotenv').config();

const INFURA_KEY = process.env.INFURA_KEY || '';
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || '';
const FORK = process.env.FORK || '';
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
  ? parseInt(process.env.FORK_BLOCK_NUMBER)
  : 0;

const GWEI = 1000 * 1000 * 1000;

export const buildForkConfig = (): HardhatNetworkForkingUserConfig | undefined => {
  let forkMode: HardhatNetworkForkingUserConfig | undefined;
  if (FORK) {
    forkMode = {
      url: NETWORKS_RPC_URL[FORK],
    };
    if (FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK]) {
      forkMode.blockNumber = FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK];
    }
  }
  return forkMode;
};

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
  [eEthereumNetwork.kovan]: ALCHEMY_KEY
    ? `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KEY}`
    : `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [eEthereumNetwork.ropsten]: ALCHEMY_KEY
    ? `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_KEY}`
    : `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [eEthereumNetwork.main]: ALCHEMY_KEY
    ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
    : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [eEthereumNetwork.coverage]: 'http://localhost:8555',
  [eEthereumNetwork.hardhat]: 'http://localhost:8545',
};

export const BLOCK_TO_FORK: iParamsPerNetwork<number | undefined> = {
  [eEthereumNetwork.main]: 12406069,
  [eEthereumNetwork.kovan]: undefined,
  [eEthereumNetwork.ropsten]: undefined,
  [eEthereumNetwork.coverage]: undefined,
  [eEthereumNetwork.hardhat]: undefined,
};

export interface EtherscanURLs {
  apiURL: string;
  browserURL: string;
}

type NetworkMap = {
  [networkID in NetworkID]: EtherscanURLs;
};

enum NetworkID {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  // Binance Smart Chain
  BSC = 56,
  BSC_TESTNET = 97,
  // Huobi ECO Chain
  HECO = 128,
  HECO_TESTNET = 256,
  // Fantom mainnet
  OPERA = 250,
  FTM_TESTNET = 4002,
  // Optimistim
  OPTIMISTIC_ETHEREUM = 10,
  OPTIMISTIC_KOVAN = 69,
  // Polygon
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  // Arbitrum
  ARBITRUM_ONE = 42161,
  ARBITRUM_TESTNET = 421611,
  // Avalanche
  AVALANCHE = 43114,
  AVALANCHE_FUJI_TESTNET = 43113,
  // Moonriver
  MOONRIVER = 1285,
  MOONBASE_ALPHA = 1287,
  BLAST_SEPOLIA = 168587773,
  BLAST = 81457,
}

const networkIDtoEndpoints: NetworkMap = {
  [NetworkID.MAINNET]: {
    apiURL: 'https://api.etherscan.io/api',
    browserURL: 'https://etherscan.io',
  },
  [NetworkID.ROPSTEN]: {
    apiURL: 'https://api-ropsten.etherscan.io/api',
    browserURL: 'https://ropsten.etherscan.io',
  },
  [NetworkID.RINKEBY]: {
    apiURL: 'https://api-rinkeby.etherscan.io/api',
    browserURL: 'https://rinkeby.etherscan.io',
  },
  [NetworkID.GOERLI]: {
    apiURL: 'https://api-goerli.etherscan.io/api',
    browserURL: 'https://goerli.etherscan.io',
  },
  [NetworkID.KOVAN]: {
    apiURL: 'https://api-kovan.etherscan.io/api',
    browserURL: 'https://kovan.etherscan.io',
  },
  [NetworkID.BSC]: {
    apiURL: 'https://api.bscscan.com/api',
    browserURL: 'https://bscscan.com',
  },
  [NetworkID.BSC_TESTNET]: {
    apiURL: 'https://api-testnet.bscscan.com/api',
    browserURL: 'https://testnet.bscscan.com',
  },
  [NetworkID.HECO]: {
    apiURL: 'https://api.hecoinfo.com/api',
    browserURL: 'https://hecoinfo.com',
  },
  [NetworkID.HECO_TESTNET]: {
    apiURL: 'https://api-testnet.hecoinfo.com/api',
    browserURL: 'https://testnet.hecoinfo.com',
  },
  [NetworkID.OPERA]: {
    apiURL: 'https://api.ftmscan.com/api',
    browserURL: 'https://ftmscan.com',
  },
  [NetworkID.FTM_TESTNET]: {
    apiURL: 'https://api-testnet.ftmscan.com/api',
    browserURL: 'https://testnet.ftmscan.com',
  },
  [NetworkID.OPTIMISTIC_ETHEREUM]: {
    apiURL: 'https://api-optimistic.etherscan.io/api',
    browserURL: 'https://optimistic.etherscan.io/',
  },
  [NetworkID.OPTIMISTIC_KOVAN]: {
    apiURL: 'https://api-kovan-optimistic.etherscan.io/api',
    browserURL: 'https://kovan-optimistic.etherscan.io/',
  },
  [NetworkID.POLYGON]: {
    apiURL: 'https://api.polygonscan.com/api',
    browserURL: 'https://polygonscan.com',
  },
  [NetworkID.POLYGON_MUMBAI]: {
    apiURL: 'https://api-testnet.polygonscan.com/api',
    browserURL: 'https://mumbai.polygonscan.com/',
  },
  [NetworkID.ARBITRUM_ONE]: {
    apiURL: 'https://api.arbiscan.io/api',
    browserURL: 'https://arbiscan.io/',
  },
  [NetworkID.ARBITRUM_TESTNET]: {
    apiURL: 'https://api-testnet.arbiscan.io/api',
    browserURL: 'https://testnet.arbiscan.io/',
  },
  [NetworkID.AVALANCHE]: {
    apiURL: 'https://api.snowtrace.io/api',
    browserURL: 'https://snowtrace.io/',
  },
  [NetworkID.AVALANCHE_FUJI_TESTNET]: {
    apiURL: 'https://api-testnet.snowtrace.io/api',
    browserURL: 'https://testnet.snowtrace.io/',
  },
  [NetworkID.MOONRIVER]: {
    apiURL: 'https://api-moonriver.moonscan.io/api',
    browserURL: 'https://moonscan.io',
  },
  [NetworkID.MOONBASE_ALPHA]: {
    apiURL: 'https://api-moonbase.moonscan.io/api',
    browserURL: 'https://moonbase.moonscan.io/',
  },
  [NetworkID.BLAST_SEPOLIA]: {
    apiURL: 'https://api-sepolia.blastscan.io/api',
    browserURL: 'https://sepolia.blastscan.io/',
  },
  [NetworkID.BLAST]: {
    apiURL: 'https://api.blastscan.io/api',
    browserURL: 'https://blastscan.io/',
  },
};

export async function getEtherscanEndpoints(
  provider: EthereumProvider,
  networkName: string
): Promise<EtherscanURLs> {
  if (networkName === 'hardhat') {
    throw new Error('Etherscan is not available on Hardhat Network');
  }

  const chainID = parseInt(await provider.send('eth_chainId'), 16) as NetworkID;

  const endpoints = networkIDtoEndpoints[chainID];

  if (endpoints === undefined) {
    throw new Error(`Etherscan endpoints not found for chain ID ${chainID}`);
  }

  return endpoints;
}
