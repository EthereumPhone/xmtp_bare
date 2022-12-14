const { Client } = require('@xmtp/xmtp-js')
const { Wallet, Signer } = require('ethers')
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

const signer = new AndroidSigner();

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));


async function listenMessages(target) {
    var address = await signer.getAddress();
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

    for await (const message of await conversation.streamMessages()) {
        window.Android.listenNewMessage(target, message.senderAddress, message.content)
    }

}

listenMessages("%target%")