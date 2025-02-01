const { derivePath, getPublicKey } = require('ed25519-hd-key');

export function createKdaAddress (seedHex: string, addressIndex: string) {
    const { key } = derivePath("m/44'/626'/0'/" + addressIndex + "'", seedHex);
    const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');
    const hdWallet = {
        privateKey: key.toString('hex') + publicKey,
        publicKey,
        address: "k:" + publicKey
    };
    return JSON.stringify(hdWallet);
}

