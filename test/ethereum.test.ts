import * as bip39 from 'bip39'
import {createEthAddress, importPrivateKey, publicKeyToAddress, ethSign, signOpMainnetTransaction} from '../src/ethereum'

describe('ethereum wallet test', ()=> {
    test('createEthAddress', () => {
        const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        console.log("mnemonic:" + mnemonic);
        const seedHex = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        const result = createEthAddress(seedHex, '0');
        console.log("createEthAddress result: " + result);
    });

    test('importPrivateKey', () => {
        const privateKey = 'f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe';
        const result = importPrivateKey(privateKey);
        console.log("importPrivateKey result: " + result);
    });

    test('publicKeyToAddress', () => {
        const publicKey = '0x038b3ddfdd9040a56435be9a104f5c6603918de768cf2fb45b65b376cfa876588b';
        const result = publicKeyToAddress(publicKey);
        console.log("publicKeyToAddress result: " + result);
    });

    test('ethSign', () => {
        const params = {
            "privateKey": "f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe",
            "nonce": 7,
            "from": "0x6e40b69CFe816f2FFcc74d1b7Ca2E88136F3A8A6",
            "to": "0xF60Eb3263C138525b6a324aFC9b93c610F60E833",
            "gasLimit": 21000,
            "amount": "0.0001",
            "gasPrice": 20520000000,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0x00"
        }
        const result = ethSign(params);
        console.log("ethSign result: " + result);
    });

    test('signOpMainnetTransaction', async () => {
        const params = {
            "privateKey": "f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe",
            "nonce": 7,
            "from": "0x6e40b69CFe816f2FFcc74d1b7Ca2E88136F3A8A6",
            "to": "0xF60Eb3263C138525b6a324aFC9b93c610F60E833",
            "gasLimit": 21000,
            "amount": "0.0001",
            "gasPrice": 20520000000,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0x00"
        }
        const result = await signOpMainnetTransaction(params);
        console.log("signOpMainnetTransaction result: " + result);
    });

    test('sign eth legacy', async () => {
        const rawHex = await ethSign({
            "privateKey": "f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe",
            "nonce": 193,
            "from": "0x6e40b69CFe816f2FFcc74d1b7Ca2E88136F3A8A6",
            "to": "0x34b544393513622f198c012FB2D4b404ad53a8A9",
            "gasLimit": 21000,
            "amount": "0.0001",
            "gasPrice": 20520000000,
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });

    test('sign eth eip1559', async () => {
        const rawHex = ethSign({
            "privateKey": "f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe",
            "nonce": 194,
            "from": "0x6e40b69CFe816f2FFcc74d1b7Ca2E88136F3A8A6",
            "to": "0x34b544393513622f198c012FB2D4b404ad53a8A9",
            "amount": "0.0001",
            "gasLimit": 21000,
            "maxFeePerGas": 20900000000,
            "maxPriorityFeePerGas": 2600000000,
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });

    test('sign bnb eip1559', async () => {
        const rawHex = ethSign({
            "privateKey": "f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe",
            "nonce": 0,
            "from": "0x6e40b69CFe816f2FFcc74d1b7Ca2E88136F3A8A6",
            "to": "0x34b544393513622f198c012FB2D4b404ad53a8A9",
            "amount": "0.0001",
            "gasLimit": 21000,
            "maxFeePerGas": 20900000000,
            "maxPriorityFeePerGas": 2600000000,
            "decimal": 18,
            "chainId": 97,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });

    test('sign mytoken eip1559', async () => {
        const rawHex = ethSign({
            "privateKey": "f7f4ed74999ac4332223705eb36b63ed33ba42bca192396258f1beceac78f4fe",
            "nonce": 203,
            "from": "0x6e40b69CFe816f2FFcc74d1b7Ca2E88136F3A8A6",
            "to": "0x34b544393513622f198c012FB2D4b404ad53a8A9",
            "amount": "100000",
            "gasLimit": 150000,
            "maxFeePerGas": 30000000000,
            "maxPriorityFeePerGas": 3000000000,
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x05206DeAc2b9f5c712890c20f66883b8Af1F755a"
        })
        console.log(rawHex)
    });
});