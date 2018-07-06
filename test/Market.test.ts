import Web3 from 'web3';
import { isUrl } from './utils';
// Types
import { toBeArray, toBeString } from 'jest-extended';

import { Market } from '../src/';
import { configRinkeby, constants } from '../src/constants';

// Deployed contracts on Rinkeby
const MARKET_CONTRACT_ADDRESS = '0xb97b05f8f65733bfffca1ab210d94197dbd3d1ef';
const COLLATERAL_POOL_CONTRACT_ADDRESS = '0xf8d557eeb0e4961a3de2ada3f18c80792dff4dae';

/**
 * Test for a valid address format.
 * @param {string} address   Address string to check.
 * @returns void
 */
function checkValidAddress(address: string): void {
  expect(address).toBeString();
  expect(address).toMatch(new RegExp('^0x[a-zA-Z0-9]+'));
  expect(address).toHaveLength(42);
}

/**
 * Market
 */
describe('Market class', () => {
  it('Is instantiable', () => {
    const market = new Market(
      new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY),
      configRinkeby
    );
    expect(market).toBeInstanceOf(Market);
  });
  it('Returns a whitelist', async () => {
    const market = new Market(
      new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY),
      configRinkeby
    );
    const result = await market.getAddressWhiteListAsync();
    expect(result).toBeDefined();
    expect(result).toBeArray();
    expect(result).toContain(MARKET_CONTRACT_ADDRESS);
    result.forEach(element => {
      checkValidAddress(element);
    });
  });
  it('Returns a collateral pool contract address', async () => {
    const market = new Market(
      new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY),
      configRinkeby
    );
    const result = await market.getCollateralPoolContractAddressAsync(MARKET_CONTRACT_ADDRESS);
    expect(result).toBe(COLLATERAL_POOL_CONTRACT_ADDRESS);
    checkValidAddress(result);
  });
  it('Returns a oracle query', async () => {
    const market = new Market(
      new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY),
      configRinkeby
    );
    const result = await market.getOracleQuery(MARKET_CONTRACT_ADDRESS);
    expect(result).toBeDefined();
    expect(result).toBeString();
    expect(isUrl(result.replace(/^.*\((.*)\)/, '$1'))).toBe(true);
  });
});
