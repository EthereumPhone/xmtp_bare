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

const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const getType = obj => Object.prototype.toString.call(obj);

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

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  
const signer = new AndroidSigner();

async function getMessages(target, msg) {
    // Create the client with your wallet. This will connect to the XMTP development network by default  

    console.log(WHAT + ": ", getMethods(signer))
    console.log("ANDROID: ", getMethods(window.AndroidSigner))

    var address = signer.getAddress();

    console.log("My precious address (" + WHAT + "): ", JSON.stringify(address), address === undefined)
    /** 
    const getKeyResult = await window.AndroidSigner.getKey()
    if (getKeyResult === "null") {
        const keys = await Client.getKeys(signer)
        window.AndroidSigner.receiveKey(new TextDecoder().decode(keys))
        xmtp = await Client.create(null, { privateKeyOverride: keys })
    } else {
        try {
            xmtp = await Client.create(null, { privateKeyOverride: new TextEncoder().encode(getKeyResult) })
        } catch(e) {
            console.log(e.stack)
        }
    }
    */
    const getKeyResult = await window.AndroidSigner.getKey()
    if (getKeyResult === "null") {
        const keys = await Client.getKeys(signer)
        window.AndroidSigner.receiveKey(toHexString(keys))
        xmtp = await Client.create(null, { privateKeyOverride: keys })
      } else {
        try {
            xmtp = await Client.create(null, { privateKeyOverride: fromHexString(getKeyResult) })
        } catch(e) {
            console.log(e.stack)
        }
      }

    console.log("Finished creating xmtp_client")
    
    const conversation = await xmtp.conversations.newConversation(target)

    console.log("Finished creating conversation")

    if (WHAT === "getMessages") {
        output = []

        console.log("Get_message address is: " + address)

        const messages = await conversation.messages()

        for (const message of messages) {
            output.push(message.content)
        }

        if (window.Android) {
            window.Android.shareMessages(JSON.stringify(output))
        }
    }
    if (WHAT === "sendMessage") {
        console.log("Executing sendMessage if")
            // Send a message
        const receipt = await conversation.send(msg)

        console.log("Sending", JSON.stringify(receipt), "from", address)

        if (window.Android) {
            window.Android.sentMessage("%hash%")
        }
    }
}

getMessages("%target%", "%message%")