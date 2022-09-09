const { Client } = require('@xmtp/xmtp-js')
const { Wallet } = require('ethers')
let wallet;
let xmtp;


if (localStorage.getItem("wallet") === null) {
    wallet = Wallet.createRandom()
    localStorage.setItem("wallet", wallet.privateKey)
} else {
    wallet = new Wallet(localStorage.getItem("wallet"))
}


async function getPeerAccounts() {
    // Create the client with your wallet. This will connect to the XMTP development network by default    
    xmtp = await Client.create(wallet);
    const allConversations = await xmtp.conversations.list()

    output = []

    for (const conversation of allConversations) {
        output.push(conversation.peerAddress)
    }

    if (window.Android) {
        window.Android.sharePeers(JSON.stringify(output))
    }

    console.log(JSON.stringify(output))
}

getPeerAccounts()