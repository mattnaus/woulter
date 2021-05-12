import Web3 from "web3";

let provider;
let web3;

const setProvider = async () => {
  if (window.ethereum) {
    provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }
  } else if (window.web3) {
    provider.window.web3.currentProvider;
  } else {
    provider = new Web3.providers.HttpProvider(
      "https://goerli.infura.io/v3/71efb150e6d54b1d820a46af3ca7512f"
    );
  }
};

setProvider();

web3 = new Web3(provider);

export default web3;
