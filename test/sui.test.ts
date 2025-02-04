import { createSuiAddress, importSuiAddress, verifySuiAddress, signSuiTransaction } from "../src/sui/index_copy";
import * as bip39 from 'bip39'


describe('sui unit test case', () => {
    /**
     * bargain venture guilt hole farm write scrub chaos garden roof gauge purchase
     * {
            privateKey: '4303f084bc77ab661dc2123d920d1ba8e2c2967971ebaf4cbe474aed0a34efe7',
            publicKey: '69c76e58a62ae7cb1816d801e8c6476739653e0f905ff75aa3826f573d11065a',
            address: '0x4c0a4a08688b24e26894a67e2f98aeb9b1ddb7b48ffaceda9a64519593bbcb4d'
        }
     */
    /**
     * speed blind athlete twin unfair juice panel amused drill waste timber tower
     * {
            privateKey: '318d889c6208272271fa51f2293aa31f9c150ea0feb2a5d4e8c1d7e816280994',
            publicKey: 'f9cd79b16d9b071ef508be0983f775ba18f9fcccee508252abf2c98db6b28fd9',
            address: '0xe41cfbbdd36013de4224d9489b83629ce125cca817864d0d8f5dbf6cfc405376'
        }
     */
    test('create sui adress', async () => {
        // const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        console.log('mnemonic: ', mnemonic);
        const seed = await bip39.mnemonicToSeedSync(mnemonic, '');
        const account = createSuiAddress(seed.toString("hex"), "0", "0", "mainnet")
        console.log(account)
    });

    //0x4c0a4a08688b24e26894a67e2f98aeb9b1ddb7b48ffaceda9a64519593bbcb4d
    test('import sui Address', () => {
        const params = {
            privateKey: "4303f084bc77ab661dc2123d920d1ba8e2c2967971ebaf4cbe474aed0a34efe7",
            network: "mainnet"
        }
        const account = importSuiAddress(params)
        console.log(account)
    });

    test('verify sui address', async () => {
        const params = {
            address: "0x4c0a4a08688b24e26894a67e2f98aeb9b1ddb7b48ffaceda9a64519593bbcb4d",
            network: "mainnet"
        }
        let verifyRes = verifySuiAddress(params)
        console.log(verifyRes);
    });

    test('sign', async () => {
        const data = {
            "from": "0x4c0a4a08688b24e26894a67e2f98aeb9b1ddb7b48ffaceda9a64519593bbcb4d",
            "outputs": [
                {
                    "requestId": "rex2025020401",
                    "to": "0xe41cfbbdd36013de4224d9489b83629ce125cca817864d0d8f5dbf6cfc405376",
                    "amount": "0.1"
                },
                {
                    "requestId": "rex2025020402",
                    "to": "0x4c0a4a08688b24e26894a67e2f98aeb9b1ddb7b48ffaceda9a64519593bbcb4d",
                    "amount": "0.78"
                }
            ],
            "decimal": 9,
            "coinRefs": [
                {
                    "objectId": "0xb53a69bcc350a721e0c1363c0d3be55deaa9d7a542df9ea5cb8010920f40009c",
                    "version": 341154913,
                    "digest": "6R46fhuGTC9o5EmzACiJP3ZmHUa2aaWn4kLHRj9nix7u"
                }
            ],
            "gasBudget": 9580000,
            "gasPrice": 2000
        };
        const rawHex = await signSuiTransaction({
            privateKey: "4303f084bc77ab661dc2123d920d1ba8e2c2967971ebaf4cbe474aed0a34efe7",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
