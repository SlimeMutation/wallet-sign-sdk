const bip39 = require('bip39');

import {
    createAtomAddress,
    publicKeyToAddress,
    signAtomTransaction,
    verifyAtomAddress,
    importAtomAddress,
    SignV2Transaction
} from '../src/cosmos/index_copy'

describe('atom unit test case', () => {
    test('createAddress', async () => {
        const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        const account = await createAtomAddress(seed.toString("hex"), "0", "mainnet")
        console.log(account)
    });

    test('import atom address', async () => {
        const params = {
            privateKey: "cbd18a2249d8ad9914ec7cb5941ffc7a517ab41533ee06eeb80f2e7a3e3baed1",
        }
        const account = await importAtomAddress(params)
        console.log(account)
    });

    test('import public to address', async () => {
        const account = await publicKeyToAddress("0329b70855c276554727bf88bcd40a7c9d807c2bd7b8d45a622be398da5d22cdb7")
        console.log(account)
    });

    test('verify atom address', async () => {
        const params = {
            address: "cosmos1s07m0gkqgw9ep2cmdtfn9469mdspgu50qeru4p",
            network: "mainnet"
        }
        let verifyRes = verifyAtomAddress(params)
        console.log(verifyRes);
    });

    test('sign atom transaction', async () => {
        const params = {
                privateKey: "cbd18a2249d8ad9914ec7cb5941ffc7a517ab41533ee06eeb80f2e7a3e3baed1",
                chainId: 'provider',
                from: "cosmos1s07m0gkqgw9ep2cmdtfn9469mdspgu50qeru4p",
                to: "cosmos1pdkkz3tkklpwcre6s8gt7elfsmyll8c0et6304",
                memo: "1010",
                amount: 0.1,
                fee: 0.03,
                accountNumber: 21542,
                sequence: 0,
                decimal: 6
            }
        let signTx = await signAtomTransaction(params)
        console.log(signTx);
    });

    test('sign version 2 atom transaction', async () => {
        const params = {
            privateKey: "cbd18a2249d8ad9914ec7cb5941ffc7a517ab41533ee06eeb80f2e7a3e3baed1",
            chainId: "provider",
            from: "cosmos1s07m0gkqgw9ep2cmdtfn9469mdspgu50qeru4p", 
            to: "cosmos1pdkkz3tkklpwcre6s8gt7elfsmyll8c0et6304",
            memo: "1010",
            amount_in: "0.1",
            fee: "0.01",
            gas: "127883",
            accountNumber: 21542,
            sequence: 1,
            decimal: 6
        }
        let signTx = await SignV2Transaction(params)
        console.log(signTx);
    });

});