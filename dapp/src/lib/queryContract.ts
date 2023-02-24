import { smartContract } from "config/config";
import {
  ContractQueryResponse,
  ProxyNetworkProvider,
} from "@multiversx/sdk-network-providers/out";
import {
  ContractFunction,
  ResultsParser,
  ReturnCode,
  TypedOutcomeBundle,
} from "@multiversx/sdk-core";
import { AccountInfoSliceNetworkType } from "@multiversx/sdk-dapp/types";

export const queryContract = async (
  functionName: string,
  network: AccountInfoSliceNetworkType,
  args?: any[]
): Promise<TypedOutcomeBundle> => {
  const provider = new ProxyNetworkProvider(network.apiAddress);
  const resultsParser = new ResultsParser();
  try {
    const query = smartContract.createQuery({
      func: new ContractFunction(functionName),
      args: args,
    });

    return provider.queryContract(query).then((data) => {
      const endpointDefinition = smartContract.getEndpoint(functionName);
      return new Promise(function (resolve) {
        resolve(resultsParser.parseQueryResponse(data, endpointDefinition));
      });
    });
  } catch (err) {
    const badResponse: TypedOutcomeBundle = {
      returnCode: ReturnCode.ExecutionFailed,
      returnMessage: "",
      values: [],
    };
    return badResponse;
  }
};

