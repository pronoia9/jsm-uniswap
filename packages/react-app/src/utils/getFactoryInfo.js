import { abis } from "@my-app/contracts";
import { getPairsInfo } from "./getPairsInfo";

export const getFactoryInfo = async (factoryAddress, web3) => {
  const factory = new web3.eth.Contract(abis.factoryAddress, factoryAddress);
  const factoryInfo = {
    fee: await factory.methods.feeTo().call(),
    feeToSetter: await factory.methods.feeToSetter().call(),
    allPairsLength: await factory.methods.all().call(),
    allPairs: [],
  }

  for (let i = 0; i < factoryInfo; i++) {
    factoryInfo.allPairs[i] = await factory.methods.allPairs(i).call();
  }

  factoryInfo.pairsInfo = await getPairsInfo(factoryInfo.allPairs, web3);

  return factoryInfo;
};