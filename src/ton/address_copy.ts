const { derivePath, getPublicKey } = require('ed25519-hd-key');
const TonWeb = require('tonweb-lite');

export function createTonAddress(seedHex: string, addressIndex: number) {
    const { key } = derivePath("m/44'/607'/0'/" + addressIndex + "'", seedHex);
    
    const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');

    const tonweb = new TonWeb();
    const WalletClass = tonweb.wallet.all['v3R2'];

    const wallet = new WalletClass(tonweb.provider, {
        publicKey: new Uint8Array(Buffer.from(publicKey, 'hex')),
        wc: 0
    });
    const walletAddress = wallet.getAddress();
    return {
        "privateKey": key.toString('hex') + publicKey,
        "publicKey": publicKey,
        "address": walletAddress.toString(true, true, true, true)
    }
}

export function getAllAddress(seedHex: string, addressIndex: number, version: string) {
    const { key } = derivePath("m/44'/607'/0'/" + addressIndex + "'", seedHex);
    const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');

    const tonweb = new TonWeb();
    const WalletClass = tonweb.wallet.all[version];

    const wallet = new WalletClass(tonweb.provider, {
        publicKey: new Uint8Array(Buffer.from(publicKey, 'hex')),
        wc: 0
    });
    const dAddress = wallet.getAddress();
    const nfAddr = dAddress.toString(false);
    console.log(version, 'f: ', nfAddr);
    console.log(version, 'tfff: ', dAddress.toString(true, false, false, false));
    console.log(version, 'ttff: ', dAddress.toString(true, true, false, false));
    console.log(version, 'tfft: ', dAddress.toString(true, false, false, true));
    console.log(version, 'ttft: ', dAddress.toString(true, true, false, true));
    console.log(version, 'tftf: ', dAddress.toString(true, false, true, false));
    console.log(version, 'tttf: ', dAddress.toString(true, true, true, false));
    console.log(version, 'tftt: ', dAddress.toString(true, false, true, true));
    console.log(version, 'tttt: ', dAddress.toString(true, true, true, true));
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
    console.log('nfAddr: ', nfAddr);
    console.log('fnsnbntAddr: ', fnsnbntAddr);
    console.log('fsnbntAddr: ', fsnbntAddr);
    console.log('fnsnbtAddr: ', fnsnbtAddr);
    console.log('fsnbtAddr: ', fsnbtAddr);
    console.log('fnsbntAddr: ', fnsbntAddr);
    console.log('fsbntAddr: ', fsbntAddr);
    console.log('fnsbtAddr: ', fnsbtAddr);
    console.log('fsbtAddr: ', fsbtAddr);
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

    const walletAddress = wallet.getAddress();
    return {
        "privateKey": privateKey,
        "publicKey": Buffer.from(keyPair.publicKey).toString('hex'),
        "address": walletAddress.toString(true, true, false, true)
    }
}

export function checkAddress(privateKey: string, version: string) {
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, 'hex')));

    const tonweb = new TonWeb();

    const WalletClass = tonweb.wallet.all[version];

    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });

    const walletAddress = wallet.getAddress();
    const target = '0QDmEFrAvuS9no51jkOVyzIXR-WrD244voQOYEN2TxwHaodh';
    console.log( target === walletAddress.toString(true, true, true, true) || 
    target === walletAddress.toString(true, true, true, false) || 
    target === walletAddress.toString(true, true, false, false) || 
    target === walletAddress.toString(true, false, false, false) || 
    target === walletAddress.toString(true, false, false, true) || 
    target === walletAddress.toString(true, false, true, true) || 
    target === walletAddress.toString(true, false, true, false) || 
    target === walletAddress.toString(true, true, false, true) );
}