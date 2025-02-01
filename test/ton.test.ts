import * as bip39 from "bip39";

import { createTonAddress, verifyAddress, importTonAddress, getAllAddress, checkAddress } from "@/ton/address_copy";
import { signTransaction } from "@/ton/sign_copy";

describe('ton address unit test case', () => {
    /**
     * job crush endless damage biology torch bounce reopen assume desert law wreck filter report pledge pave age return stick mansion shell void tooth lake
            0QDqHWZvYjj1Chq0pPR_RLi3N4uuzjrumLatSms_OKl4f64R
            73f4f7ea2c02f7721b8df78488a01652fd720cc58a7a2205d78ec98a845363401b57b24c6dbd651b34060502d9e626678cc08ae2cf006dece62293b9c1cf5ffa
     */
    /**
     * until portion hospital square sponsor galaxy route attend catalog aunt curve used similar stereo marine pool thunder gospel soul ahead bike code situate name
     */
    test('createTonAddress', () => {
        // const mnemonic = bip39.generateMnemonic(256, undefined, bip39.wordlists.english);
        // console.log("mnemonic: ", mnemonic);
        const mnemonic = "job crush endless damage biology torch bounce reopen assume desert law wreck filter report pledge pave age return stick mansion shell void tooth lake"
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const account = createTonAddress(seed.toString("hex"), 0);
        console.log('createAddress: ', account);
    });

    test('getAllAddress', () => {
        // const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        // console.log("mnemonic: ", mnemonic);
        const mnemonic = "job crush endless damage biology torch bounce reopen assume desert law wreck filter report pledge pave age return stick mansion shell void tooth lake"
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const seedHex = seed.toString("hex");
        getAllAddress(seedHex, 0, 'simpleR1');
        getAllAddress(seedHex, 0, 'simpleR2');
        getAllAddress(seedHex, 0, 'simpleR3');
        getAllAddress(seedHex, 0, 'v2R1');
        getAllAddress(seedHex, 0, 'v2R2');
        getAllAddress(seedHex, 0, 'v3R1');
        getAllAddress(seedHex, 0, 'v3R2');
        getAllAddress(seedHex, 0, 'v4R1');
        getAllAddress(seedHex, 0, 'v4R2');
    });

    test('verifyAddress', () => {
        const result = verifyAddress({address: '0QDmEFrAvuS9no51jkOVyzIXR-WrD244voQOYEN2TxwHaodh'});
        console.log('verifyAddress: ', result);
    });

    /**
     * job crush endless damage biology torch bounce reopen assume desert law wreck filter report pledge pave age return stick mansion shell void tooth lake
     * 0QDqHWZvYjj1Chq0pPR_RLi3N4uuzjrumLatSms_OKl4f64R
     *  {
            privateKey: '73f4f7ea2c02f7721b8df78488a01652fd720cc58a7a2205d78ec98a845363401b57b24c6dbd651b34060502d9e626678cc08ae2cf006dece62293b9c1cf5ffa',
            publicKey: '1b57b24c6dbd651b34060502d9e626678cc08ae2cf006dece62293b9c1cf5ffa',
            address: '0QDmEFrAvuS9no51jkOVyzIXR-WrD244voQOYEN2TxwHaodh'
        }
     */
    test('importTonAddress', () => {
        const privateKey = '73f4f7ea2c02f7721b8df78488a01652fd720cc58a7a2205d78ec98a845363401b57b24c6dbd651b34060502d9e626678cc08ae2cf006dece62293b9c1cf5ffa';
        const result = importTonAddress(privateKey);
        console.log('importTonAddress: ', result);
    });

    test('checkAddress', () => {
        const privateKey = '73f4f7ea2c02f7721b8df78488a01652fd720cc58a7a2205d78ec98a845363401b57b24c6dbd651b34060502d9e626678cc08ae2cf006dece62293b9c1cf5ffa';
        checkAddress(privateKey, 'simpleR1');
        checkAddress(privateKey, 'simpleR2');
        checkAddress(privateKey, 'simpleR3');
        checkAddress(privateKey, 'v2R1');
        checkAddress(privateKey, 'v2R2');
        checkAddress(privateKey, 'v3R1');
        checkAddress(privateKey, 'v3R2');
        checkAddress(privateKey, 'v4R1');
        checkAddress(privateKey, 'v4R2');
    });
    
});

describe('ton sign unit test case', () => {
    test('sign transaction', async () => {
        const param = {
            from: "0QDmEFrAvuS9no51jkOVyzIXR-WrD244voQOYEN2TxwHaodh",
            to: "0QCZ3dDw2q7XOjLesUO7BflVN70Y5QI4p-FYk9M9g55YcdHi",
            memo: "memo",
            amount: 0.01,
            sequence: 27695131,
            decimal: 10,
            privateKey: "73f4f7ea2c02f7721b8df78488a01652fd720cc58a7a2205d78ec98a845363401b57b24c6dbd651b34060502d9e626678cc08ae2cf006dece62293b9c1cf5ffa"
        }
        const sign_message = await signTransaction(param)
        console.log("signTransaction: ", sign_message)
    })
});