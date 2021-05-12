import web3 from "./web3";
import RoscaFactory from "../../build/contracts/RoscaFactory.json";

const instance = new web3.eth.Contract(
  RoscaFactory.abi,
  "0xaC8B0952C9d746495795229F8861707746f6b748"
);

export default instance;
