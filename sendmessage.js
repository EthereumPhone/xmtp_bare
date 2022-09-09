const { Client } = require('@xmtp/xmtp-js')
const { Wallet, Signer } = require('ethers')
let wallet;
let xmtp;

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


// A micro service will exit when it has nothing left to do.  So to
// avoid a premature exit, set an indefinite timer.  When we
// exit() later, the timer will get invalidated.

async function sendMessage(msg, target) {
  // Create the client with your wallet. This will connect to the XMTP development network by default    
  // Start a conversation with Vitalik

  var signer = new AndroidSigner();
  
  var address = await signer.getAddress();

  console.log("My precious address: ", JSON.stringify(address), address === undefined)
  /**
  xmtp = await Client.create(signer);
  const conversation = await xmtp.conversations.newConversation(target)
  // Send a message
  await conversation.send(msg)

  if (window.Android) {
    window.Android.sentMessage("%hash%")
  }
   */
}

sendMessage("%message%", "%target%").then(res => console.log("Result get"+res)).catch(e => console.log(e))
