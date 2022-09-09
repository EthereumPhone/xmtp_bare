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

function objToString(obj, ndeep, lastObj) {
    if (obj === lastObj) {
        return "null";
    }
    switch (typeof obj) {
        case "string":
            return '"' + obj + '"';
        case "function":
            return obj.name || obj.toString();
        case "object":
            var indent = Array(ndeep || 1).join('\t'),
                isArray = Array.isArray(obj);
            return ('{[' [+isArray] + Object.keys(obj).map(function(key) {
                return '\n\t' + indent + (isArray ? '' : key + ': ') + objToString(obj[key], (ndeep || 1) + 1, obj);
            }).join(',') + '\n' + indent + '}]' [+isArray]).replace(/[\s\t\n]+(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g, '');
        default:
            return obj.toString();
    }
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


async function listenMessages(target) {
    // Create the client with your wallet. This will connect to the XMTP development network by default    
    // Start a conversation with Vitalik
    console.log("sendMessage: ", getMethods(signer))

    var address = await signer.getAddress();

    console.log("My precious address (sendMessage): ", JSON.stringify(address), address === undefined)

    if (localStorage.getItem("xmtp") === null) {
        xmtp = await Client.create(signer);
        console.log("Stringified xmtp: ", objToString(xmtp))
        localStorage.setItem("xmtp", objToString(xmtp))
    } else {
        xmtp = eval("(" + localStorage.getItem("xmtp") + ")")
    }


    const conversation = await xmtp.conversations.newConversation(target)

    for await (const message of await conversation.streamMessages()) {
        console.log(`[${message.senderAddress}]: ${message.content}`)
        window.Android.listenNewMessage(target, message.senderAddress, message.content)
    }

}

listenMessages("%target%")