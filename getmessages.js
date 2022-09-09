const { Client } = require('@xmtp/xmtp-js')
const { Wallet, Signer } = require('ethers')
let wallet;
let xmtp;

const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
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

var WHAT = "%WHICH_FUNCTION%";

const signer = new AndroidSigner();

async function getMessages(target, msg) {
    // Create the client with your wallet. This will connect to the XMTP development network by default  
    
    console.log(WHAT+": ", getMethods(signer))
  
    var address = await signer.getAddress();

    console.log("My precious address ("+WHAT+"): ", JSON.stringify(address), address === undefined)

    xmtp = await Client.create(signer);

    console.log("Finished creating xmtp_client")

    const conversation = await xmtp.conversations.newConversation(target)

    console.log("Finished creating conversation")

    if (WHAT === "getMessages") {
      output = []

      console.log("Get_message address is: "+address)

      const messages = await conversation.messages()

      for (const message of messages) {
          output.push(message.content)
      }
      
      if (window.Android) {
          window.Android.shareMessages(JSON.stringify(output))
      }
    }
    if (WHAT === "sendMessage"){
      console.log("Executing sendMessage if")
      // Send a message
      const receipt = await conversation.send(msg)

      console.log("Sending", JSON.stringify(receipt), "from", address)

      if (window.Android) {
        window.Android.sentMessage("%hash%")
      }
    }
}

async function sendMessage(msg, target) {
  // Create the client with your wallet. This will connect to the XMTP development network by default    
  // Start a conversation with Vitalik
  console.log("sendMessage: ", getMethods(signer))
  
  var address = await signer.getAddress();

  console.log("My precious address (sendMessage): ", JSON.stringify(address), address === undefined)

  xmtp = await Client.create(signer);
  const conversation = await xmtp.conversations.newConversation(target)
  

}

if (WHAT === "getMessages") {
  //getMessages("%target%").then(res => console.log("Result get"+res)).catch(e => console.log(e))
}
if(WHAT === "sendMessage") {
  //sendMessage("%message%", "%target%").then(res => console.log("Result get"+res)).catch(e => console.log(e.stack))
}

getMessages("%target%", "%message%").then(res => console.log("Result get"+res)).catch(e => console.log(e))