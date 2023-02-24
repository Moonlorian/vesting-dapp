import { Address, AddressValue, BigUIntValue, ContractCallPayloadBuilder, ContractFunction, StringValue, U32Value, U64Value } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';

import { contractAddress } from "config/config";
import { CategoryType } from 'pages/Dashboard/components/Categories/Categories';
import { AddressType } from 'pages/Dashboard/components/Addresses/Addresses';
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";

export const freeze_sc = async () => {
  const transaction = {
    value: 0,
    data: 'freeze_sc',
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Freezing SC',
      errorMessage: 'An error has occured during freeze process',
      successMessage: 'Contract is frozen'
    },
    redirectAfterSign: false
  });
};

export const unfreeze_sc = async () => {
  const transaction = {
    value: 0,
    data: 'unfreeze_sc',
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Unfreezing SC',
      errorMessage: 'An error has occured during unfrozen process',
      successMessage: 'Contract is unfrozen'
    },
    redirectAfterSign: false
  });
};

export const set_listing_epoch = async (new_epoch:number) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("set_listing_epoch"))
      .setArgs([new U64Value(new_epoch)])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Updating listing epoch',
      errorMessage: 'Error updating listing epoch',
      successMessage: 'Listing epoch updated to ' + new_epoch
    },
    redirectAfterSign: false
  });
};

export const set_vested_token = async (new_allowedToken:string) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("set_vested_token"))
      .setArgs([new StringValue(new_allowedToken)])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Updating allowed token',
      errorMessage: 'Error updating allowed token',
      successMessage: 'Allowed token updated to ' + new_allowedToken
    },
    redirectAfterSign: false
  });
};

export const update_category = async (category:CategoryType) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("configure_category"))
      .setArgs([new StringValue(category.name), new U64Value(category.unlockEpoch), new U64Value(category.period), new U32Value(category.percent)])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Creating or updating category to ' + category.name,
      errorMessage: 'Error creating/updating category to ' + category.name,
      successMessage: category.name + ' created/updated'
    },
    redirectAfterSign: false
  });
};

export const remove_category = async (category_name:string) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("remove_category"))
      .setArgs([new StringValue(category_name)])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Removing category',
      errorMessage: 'Error removing category',
      successMessage: 'Category ' + category_name + ' removed'
    },
    redirectAfterSign: false
  });
};


export const update_user_address = async (category_name: string, address:AddressType) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("set_address_balance"))
      .setArgs([new StringValue(category_name), new AddressValue(new Address(address.address)), new BigUIntValue(address.totalAmount)])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Creating or updating user address',
      errorMessage: 'Error creating/updating user address',
      successMessage: 'User address created/updated'
    },
    redirectAfterSign: false
  });
};


export const remove_user_address = async (category_name:string, user_address: string) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("remove_address_from_category"))
      .setArgs([new StringValue(category_name), new AddressValue(new Address(user_address))])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Removing user address',
      errorMessage: 'Error removing user address',
      successMessage: 'User address removed'
    },
    redirectAfterSign: false
  });
};

export const add_funds = async (token: string, funds:BigNumber) => {
  const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction("ESDTTransfer"))
      .setArgs([new StringValue(token), new BigUIntValue(funds), new StringValue("add_funds")])
      .build();
  const transaction = {
    value: 0,
    data: data,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Adding funds',
      errorMessage: 'Error adding funds',
      successMessage: 'Funds added'
    },
    redirectAfterSign: false
  });
};

export const claim = async () => {
  const transaction = {
    value: 0,
    data: 'claim',
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Claiming unlocked balance',
      errorMessage: 'An error has occured during claiming process',
      successMessage: 'Unlocked balance claimed'
    },
    redirectAfterSign: false
  });
};