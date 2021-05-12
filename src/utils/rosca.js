import web3 from "./web3";
import Rosca from "../../build/contracts/Rosca.json";

export default (address) => {
  return new web3.eth.Contract(Rosca.abi, address);
};
