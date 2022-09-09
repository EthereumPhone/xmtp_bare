const { Client } = require('@xmtp/xmtp-js')
const { Wallet, Signer } = require('ethers')


let wallet;


if (localStorage.getItem("wallet") === null) {
  wallet = Wallet.createRandom()

  localStorage.setItem("wallet", wallet.privateKey)
} else {
  wallet = new Wallet(localStorage.getItem("wallet"))
}

class AndroidSigner extends Signer {

  constructor() {
    super();
  }

  getAddress() {
    return new Promise((resolve, reject) => {
      resolve(window.AndroidSigner.getAddress());
    });
  }

  signMessage(message) {
    return new Promise((resolve, reject) => {
      var signature = window.AndroidSigner.signMessage(message)
      resolve(signature) 
    });
  }

  signTransaction(transaction) {
    return new Promise((resolve, reject) => {
      resolve("todo") 
    });
  }

  connect(provider) {
    return this;
  }
}