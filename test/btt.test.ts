import * as bip39 from 'bip39'
import {createBttAddress, importPrivateKey, publicKeyToAddress, bttSign} from '../src/btt'

describe('ethereum wallet test', ()=> {
    /**
     * gesture normal host also suit vintage genuine special rail chair local purity
     * {"privateKey":"0xb8140dbe351e5a28630a4fbcddda80838fa049692775bec1a27aa160973cb425",
     * "publicKey":"0x03a76ee673bedd4ee0df6c145865ed86804514cbb449fe9667431cafa7b14c0b50",
     * "address":"0xfe8dC982bC71Fcbfc8b08604f4869f668AA255E6"}
     */
    test('createEthAddress', () => {
        const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        console.log("mnemonic:" + mnemonic);
        const seedHex = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        const result = createBttAddress(seedHex, '0');
        console.log("createEthAddress result: " + result);
    });

    /**
     * {"privateKey":"b8140dbe351e5a28630a4fbcddda80838fa049692775bec1a27aa160973cb425",
     * "address":"0xfe8dC982bC71Fcbfc8b08604f4869f668AA255E6"}
     */
    test('importPrivateKey', () => {
        const privateKey = 'b8140dbe351e5a28630a4fbcddda80838fa049692775bec1a27aa160973cb425';
        const result = importPrivateKey(privateKey);
        console.log("importPrivateKey result: " + result);
    });


    /**
     * 0xfe8dC982bC71Fcbfc8b08604f4869f668AA255E6
     */
    test('publicKeyToAddress', () => {
        const publicKey = '0x03a76ee673bedd4ee0df6c145865ed86804514cbb449fe9667431cafa7b14c0b50';
        const result = publicKeyToAddress(publicKey);
        console.log("publicKeyToAddress result: " + result);
    });

    test('bttSign', () => {
        const params = {
            "privateKey": "b845b2ee7506a4d9ec7a56730ade95c07c0572b0802236fb33379c54a53579cf",
            "nonce": 0,
            "from": "0x34b544393513622f198c012FB2D4b404ad53a8A9",
            "to": "0xfe8dC982bC71Fcbfc8b08604f4869f668AA255E6",
            "gasLimit": 21000,
            "amount": "1000",
            "gasPrice": 9000000000000000,
            "decimal": 18,
            "chainId": 1029,
            "tokenAddress": "0x00"
        }
        const result = bttSign(params);
        console.log("bttSign result: " + result);
    });

});