const { derivePath, getPublicKey } = require('ed25519-hd-key');
const TonWeb = require('tonweb-lite');


export function createTonAddress(seedHex: string, addressIndex: number) {
    const { key } = derivePath("m/44'/607'/1'/" + addressIndex + "'", seedHex);
    const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');

    const tonweb = new TonWeb();
    const WalletClass = tonweb.wallet.all['v3R2'];

    const publikKey = new Uint8Array(Buffer.from(publicKey, "hex"))
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: publikKey,
        wc: 0
    });
    const walletAddress =  wallet.getAddress();
    return {
        "privateKey": key.toString('hex') + publicKey,
        "publicKey": publicKey,
        "address": walletAddress.toString(true, true, true, false)
    }
}

export function verifyAddress(params: any) {
    const { address } = params;
    const regex = new RegExp("^[a-zA-Z0-9\+\-\_\*\/\%\=]{48}$");
    if (!regex.test(address)) return false;
    const dAddress = new TonWeb.utils.Address(address);
    const nfAddr = dAddress.toString(false);
    const fnsnbntAddr = dAddress.toString(true, false, false, false);
    const fsnbntAddr = dAddress.toString(true, true, false, false);
    const fnsnbtAddr = dAddress.toString(true, false, false, true);
    const fsnbtAddr = dAddress.toString(true, true, false, true);
    const fnsbntAddr = dAddress.toString(true, false, true, false);
    const fsbntAddr = dAddress.toString(true, true, true, false);
    const fnsbtAddr = dAddress.toString(true, false, true, true);
    const fsbtAddr = dAddress.toString(true, true, true, true);
    return address === nfAddr || address === fnsnbntAddr
        || address === fsnbntAddr || address === fnsnbtAddr
        || address === fsnbtAddr || address === fnsbntAddr || address === fsbntAddr
        || address === fnsbtAddr || address === fsbtAddr;
}


export function importTonAddress(privateKey: string) {
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, 'hex')));

    const tonweb = new TonWeb();

    const WalletClass = tonweb.wallet.all['v3R2'];

    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });

    const walletAddress =  wallet.getAddress();
    return {
        "privateKey": privateKey,
        "publicKey": Buffer.from(keyPair.publicKey).toString("hex"),
        "address": walletAddress.toString(true, true, true, false)
    }
}




