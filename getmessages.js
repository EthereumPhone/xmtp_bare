const { Client } = require('@xmtp/xmtp-js')
const { Wallet, Signer, utils } = require('ethers')
const Buffer = require('buffer/').Buffer
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

function equalArray(buf1, buf2) {
    if (buf1.byteLength != buf2.byteLength) return false;
    var dv1 = new Int8Array(buf1);
    var dv2 = new Int8Array(buf2);
    for (var i = 0; i != buf1.byteLength; i++) {
        if (dv1[i] != dv2[i]) return false;
    }
    return true;
}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}


const signer = new AndroidSigner();

async function getMessages(target, msg) {
    // Create the client with your wallet. This will connect to the XMTP development network by default  

    var address = await signer.getAddress();

    const hash = "%HASH%"

    const getKeyResult = await window.AndroidSigner.getKey()
    if (getKeyResult === "null") {
        const keys = await Client.getKeys(signer)
        window.AndroidSigner.receiveKey(Buffer.from(keys).toString('binary'))
        xmtp = await Client.create(null, {
            privateKeyOverride: keys,
            env: "production"
        })
    } else {
        try {
            xmtp = await Client.create(null, {
                privateKeyOverride: Buffer.from(getKeyResult, 'binary'),
                env: "production"
            })
        } catch (e) {
            console.log(e.stack)
        }
    }

    const conversation = await xmtp.conversations.newConversation(target)

    if (WHAT === "getMessages") {
        console.log("gettingMessages executing")
        output = []
        const messages = await conversation.messages()
        console.log("got Messages ", messages)
        for (var message of messages) {
            try {
                var newMessage = {}
                console.log(objToString(message))
                newMessage["senderAddress"] = message.senderAddress
                newMessage["content"] = message.content
                output.push(newMessage)
            } catch(e) {
                var errorMsg = {};
                errorMsg["error"] = e;
                console.log("Error: ", e)
            }
            
        }

        window.Android.shareMessages(hash, JSON.stringify(output))
        console.log("shared Messages back")

    }
    if (WHAT === "sendMessage") {
        // Send a message
        const receipt = await conversation.send(atob(msg))
        if (window.Android) {
            window.Android.sentMessage("%hash%")
        }
    }
}

getMessages("%target%", "%message%")