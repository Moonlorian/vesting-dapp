import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import {
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Address
} from '@multiversx/sdk-core';
import json from '../assets/resources/vesting.abi.json';

export const dAppName = "Vesting dashboard";
export const brand = "Your brand here";

//Smart contract data
export const contractAddress =
  "";

const abiRegistry = AbiRegistry.create(json);
const abi = new SmartContractAbi(abiRegistry);

export const smartContract = new SmartContract({
  address: new Address(contractAddress),
  abi,
});


// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = "9b1a9564f91cb659ffe21b73d5c4e2d8";

export const apiTimeout = 6000;
export const transactionSize = 15;
export const TOOLS_API_URL = "https://tools.multiversx.com";
/**
 * Calls to these domains will use `nativeAuth` Baerer token
 */
export const sampleAuthenticatedDomains = [TOOLS_API_URL];

export const enviroment = EnvironmentsEnum.mainnet;
