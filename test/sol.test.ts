import * as bip39 from "bip39";
const bs58 = require("bs58")

import {
    createSolAddress,
    getNonce,
    prepareAccount,
    signSolTransaction,
    verifySolAddress
} from "../src/solana";
import { createAccount, deactivateStake, delegateStake, withdrawFunds } from "@/solana/staking";

describe('solana unit test case', () => {
    //couple antique repeat pool crater confirm puppy session coffee length leave lady
    //{"privateKey":
    // "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
    // "publicKey":
    // "2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
    // "address":"4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv"}
    test('createAddress', () => {
        const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        console.log("mnemonic: ", mnemonic);
        // const mnemonic = "face defy torch paper dial goddess floor wage nephew floor million belt"
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const account = createSolAddress(seed.toString("hex"), "0");
        console.log('createAddress: ', account);
    });

    /*
     * blush slice later use gadget stay feature double cloud taste sense secret
     {"privateKey":
        "e2b5aeeac4a6a79cef6c22994d6fd39be0e2015840471a0d5dff988cddb41000fcbcaa56fa92a1134553ca70553f3ea8f074b68a1078d28a7651d2a81411b9c5",
    "publicKey":
        "fcbcaa56fa92a1134553ca70553f3ea8f074b68a1078d28a7651d2a81411b9c5",
    "address":"J1abbW4xJZtatP6XHEqRkv4Q5Vj3XTMVH2XW2RhJLsrU"}
     */
    test('prepareAccount', async () => {
        const params = {
            authorAddress: "4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv",
            from: "J1abbW4xJZtatP6XHEqRkv4Q5Vj3XTMVH2XW2RhJLsrU",
            recentBlockhash: "FDLeQ3Z8NjhahmMtn2ZQSSLfGFm8fyWVikcTSXM8Nvc2",
            minBalanceForRentExemption: 1647680,
            privs: [
                {
                    address: "4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv",
                    key: "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f"
                },
                {
                    address: "J1abbW4xJZtatP6XHEqRkv4Q5Vj3XTMVH2XW2RhJLsrU",
                    key: "e2b5aeeac4a6a79cef6c22994d6fd39be0e2015840471a0d5dff988cddb41000fcbcaa56fa92a1134553ca70553f3ea8f074b68a1078d28a7651d2a81411b9c5"
                }
            ]
        }
        let tx_msg = await prepareAccount(params)
        console.log("prepareAccount tx_msg: ", tx_msg)
    });

    test('getNonce', async () => {
        // const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        // connection.getNonce()
        // const base58Data = "df8aQUMTjFf3LwmmqYGSQ9kiFFZLghwJEF6nUr9TbudiX3dUd3VEHNSfcG3GVhygGnXH39Gobfyi8LKNxFhc1zbnnoEtVvynVg5qFbasNcxP"
        // const aa = NonceAccount.fromAccountData(Buffer.from(base58Data))
        // // const decodeData = bs58.decode(base58Data)
        // console.log(aa.nonce)

        console.log('getNonce: ', await getNonce('J1abbW4xJZtatP6XHEqRkv4Q5Vj3XTMVH2XW2RhJLsrU'))
    });

    /**
     * battle enact odor enemy achieve stadium clarify lyrics orphan vast gift gap
     * {"privateKey":"bb24421031e0386a7d42f1b3361114a6c932a695af09791a2d905124d503125bc6a9dbed9ca3c8527a76bb0420e9d70bcc2322e28f7af684eb78ba7e5a81e24d",
     * "publicKey":"c6a9dbed9ca3c8527a76bb0420e9d70bcc2322e28f7af684eb78ba7e5a81e24d",
     * "address":"ENVx1RQ8NQzNiF8hCKogCbw7fpRC8BWQuefG8F5kVK6L"}
     */
    test('signTransaction SOL_TOKEN', async () => {
        const params = {
            from: '4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv',
            nonceAccount: 'J1abbW4xJZtatP6XHEqRkv4Q5Vj3XTMVH2XW2RhJLsrU',
            amount: '0.01',
            to: 'ENVx1RQ8NQzNiF8hCKogCbw7fpRC8BWQuefG8F5kVK6L',
            nonce: '7B6dfLFkeo4yCLAUywRnc67BEka2u6Hwg94bBp6UaGSR',
            decimal: 9,
            privateKey: '9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f',
            mintAddress: ''
        };
        let tx_msg = await signSolTransaction(params);
        console.log('signTransaction SOL_TOKEN tx_msg: ', tx_msg);
    });

    test('signTransaction SPL_TOKEN', async () => {
        const params = {
            from: '4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv',
            nonceAccount: 'J1abbW4xJZtatP6XHEqRkv4Q5Vj3XTMVH2XW2RhJLsrU',
            amount: '5',
            to: 'ENVx1RQ8NQzNiF8hCKogCbw7fpRC8BWQuefG8F5kVK6L',
            nonce: '7kpUa44t1rsgG1Yt2yqrhpsScBAU1o1Yu96y3LwXfTUq',
            decimal: 6,
            privateKey: '9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f',
            mintAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
        };
        let tx_msg = await signSolTransaction(params);
        console.log('signTransaction SPL_TOKEN tx_msg: ', tx_msg);
    });

    test('verifyAddress', async () => {
        const params = {
            address: "4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv",
        }
        let result = verifySolAddress(params)
        console.log("verifyAddress result: ", result)
    });

});

describe('CreateStakeAccount', ()=>{
    //couple antique repeat pool crater confirm puppy session coffee length leave lady
    //{"privateKey":
    // "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
    // "publicKey":
    // "2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
    // "address":"4CzdTEA5BbZgrBaRi9xkw2eqGDTmeqCXkkBxKGD4fzgv"}
    test('public key to address', async () => {
        const pubKey = "2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f"
        const buffer = Buffer.from(pubKey, "hex");
        console.log('public key to address: ', bs58.encode(buffer))
    });

    /**
     * stakeAccount
     * second pair guide movie calm network acoustic north dilemma same fatal lawsuit
     * {"privateKey":"3c0ed0e7eae010c9edf139084fec21998264a36c35ad41e8f4329627e9f3ab7c3e9ca8db924b648512e8777872ef2580e9b50c8f0de9fdd53b7d52d1831b75ff",
     * "publicKey":"3e9ca8db924b648512e8777872ef2580e9b50c8f0de9fdd53b7d52d1831b75ff",
     * "address":"5DQq1jsm8KapWCe5EDNfT59u5jj997h23j1Bu9f3QG7G"}
     */
    test('create stake account', async () => {
        const params = {
            authorPrivateKey: "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
            stakeAccountPrivateKey: "3c0ed0e7eae010c9edf139084fec21998264a36c35ad41e8f4329627e9f3ab7c3e9ca8db924b648512e8777872ef2580e9b50c8f0de9fdd53b7d52d1831b75ff",
            lamportsForStakeAccount: 19947680,
            recentBlockhash: "5dYvWTeVeGccBARhS45pVer4MeHnDZhekdoMyfeaqVZg",
            votePubkeyStr: "5ZWgXcyqrrNpQHCme5SdC5hCeYb2o3fEJhF7Gok3bTVN"
        }
        const txSignHex = await createAccount(params)
        console.log("txSignHex: ", txSignHex)
    });

    test('delegate stake', async () => {
        const params = {
            authorPrivateKey: "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
            stakeAccountPrivateKey: "3c0ed0e7eae010c9edf139084fec21998264a36c35ad41e8f4329627e9f3ab7c3e9ca8db924b648512e8777872ef2580e9b50c8f0de9fdd53b7d52d1831b75ff",
            recentBlockhash: "EKAbYae1JQTMescNu1GXRUyXAUgZb3bticye61W6j2wv",
            votePubkeyStr: "2u83Dx5qPV4QnujjJQv8v2SoqG1ixuAxPK5Jwhtkovd1"
        }
        const txSignHex =  await delegateStake(params)
        console.log("txSignHex: ", txSignHex)
    });

    test('deactivate stake', async () => {
        const params = {
            authorPrivateKey: "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
            stakeAccountPrivateKey: "3c0ed0e7eae010c9edf139084fec21998264a36c35ad41e8f4329627e9f3ab7c3e9ca8db924b648512e8777872ef2580e9b50c8f0de9fdd53b7d52d1831b75ff",
            recentBlockhash: "9nkXb9xKZMVA5sF1XCgbAGpiW6dxfyWQLWUH1twC4v4d",
        }
        const txSignHex =  await deactivateStake(params)
        console.log("txSignHex: ", txSignHex)
    });

    test('withdraw funds', async () => {
        const params = {
            authorPrivateKey: "9c081d99270618bb80c562698dc4a0f36bff5cf2fa77b1548f7311a4e8af126b2fa59c44344e516fd6bfb7ae9789efa59ea570e2e3f79b692e68f8475530bc6f",
            stakeAccountPrivateKey: "3c0ed0e7eae010c9edf139084fec21998264a36c35ad41e8f4329627e9f3ab7c3e9ca8db924b648512e8777872ef2580e9b50c8f0de9fdd53b7d52d1831b75ff",
            recentBlockhash: "5ebgjzcwLyHkK9Ky27LEdLdBnVRxFWxuwK7U7LVXymyW",
            stakeBalance: 10947680,
        }
        const txSignHex =  await withdrawFunds(params)
        console.log("txSignHex: ", txSignHex)
    });
});