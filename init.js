const { Client } = require('@xmtp/xmtp-js')
const { Wallet, Signer } = require('ethers')


let wallet;

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

const signer = new AndroidSigner();

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

async function init() {
  try{
    const getKeyResult = await window.AndroidSigner.getKey()
    console.log("GET KEY RESULT: " + getKeyResult)
    if (getKeyResult === "null") {
      console.log("No key found, creating new key")
      const keys = await Client.getKeys(signer, {env: "production"})
      console.log("Keys: " + keys)
      window.AndroidSigner.receiveKey(Buffer.from(keys).toString('binary'))
      console.log("Received key: ")
      xmtp = await Client.create(null, { 
        privateKeyOverride: keys,
        env: "production"
      })
      console.log("My xmtp address:" + xmtp.address)
    } else {
      console.log("Key found, using existing key")
      try {
        xmtp = await Client.create(null, { 
          privateKeyOverride: Buffer.from(getKeyResult, 'binary'),
          env: "production"
        })
        console.log("My xmtp address:" + xmtp.address)
      } catch (e) {
        console.log(e.stack)
      }
    }
  }catch(e) {
    console.log(e.stack)
  }
  
}

init().then(() => console.log("Done"))