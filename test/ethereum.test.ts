import * as bip39 from 'bip39'
import {createEthAddress, importPrivateKey, publicKeyToAddress, ethSign, signOpMainnetTransaction} from '../src/ethereum'

describe('ethereum wallet test', ()=> {
    test('createEthAddress', () => {
        // const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        const mnemonic = 'bamboo solve mom trap patient enforce brain prefer legend item marine home';
        console.log("mnemonic:" + mnemonic);
        const seedHex = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        const result = createEthAddress(seedHex, '0');
        console.log("createEthAddress result:" + result);
    });

    test('importPrivateKey', () => {
        const privateKey = 'ecf89e2d87de13a1bf36a47d7e635d23968151f4a89f98c4d7d77adadcd48cf4';
        const result = importPrivateKey(privateKey);
        console.log("importPrivateKey result:" + result);
    });

    test('publicKeyToAddress', () => {
        const publicKey = '0x038b3ddfdd9040a56435be9a104f5c6603918de768cf2fb45b65b376cfa876588b';
        const result = publicKeyToAddress(publicKey);
        console.log("publicKeyToAddress result:" + result);
    });

    test('ethSign', () => {
        const params = {
            "privateKey": "ecf89e2d87de13a1bf36a47d7e635d23968151f4a89f98c4d7d77adadcd48cf4",
            "nonce": 7,
            "from": "0xcB1D7AeAa99344D2BEbA6a43BF778AF758568cCc",
            "to": "0xF60Eb3263C138525b6a324aFC9b93c610F60E833",
            "gasLimit": 21000,
            "amount": "0.0001",
            "gasPrice": 20520000000,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0x00"
        }
        const result = ethSign(params);
        console.log("ethSign result:" + result);
    });

    // test('signOpMainnetTransaction', () => {
    //     const params = {
    //         "privateKey": "ecf89e2d87de13a1bf36a47d7e635d23968151f4a89f98c4d7d77adadcd48cf4",
    //         "nonce": 7,
    //         "from": "0xcB1D7AeAa99344D2BEbA6a43BF778AF758568cCc",
    //         "to": "0xF60Eb3263C138525b6a324aFC9b93c610F60E833",
    //         "gasLimit": 21000,
    //         "amount": "0.0001",
    //         "gasPrice": 20520000000,
    //         "decimal": 18,
    //         "chainId": 1,
    //         "tokenAddress": "0x00"
    //     }
    //     const result = signOpMainnetTransaction(params);
    //     console.log("signOpMainnetTransaction result:" + result);
    // });
});