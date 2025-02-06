import {
    CreateAddress
} from "../src/sia/address";
import {
    signTransaction
} from "../src/sia/transaction";


describe('test encode public key to public key', () => {
    test('encode key to public key', async () => {
        let key = "ewXkuoLxIEQ3Sf9ez/KzaDpfvvn3cNjuCnNLH/Nuc88="
        let aa = new Uint8Array(Buffer.from(key, 'base64'))
        console.log(" publicKey=", Buffer.from(aa).toString('hex'))
    });
});

/**
 * {
      PublicKey: '615ed2aa1f4be42ccf7681be701a6dbc7a32f88cc9b146915c832b21e06b444d',
      PrivateKey: '4f1f06a714cbfa936379d12989e648702dd550f9b4942cd39f6adf7bbd2b3c13615ed2aa1f4be42ccf7681be701a6dbc7a32f88cc9b146915c832b21e06b444d',
      Address: '53bd48f439127ecbeb39dd7ed738ec9a505aad1f28681a79812501beb5c47bbd1673b930f468'
    }
 */
/**
 * {
      PublicKey: '04a32039605b6f8e4bbc3549cd372d598ab4a12bbba50f347e593bd41c527c81',
      PrivateKey: '3be82ee9b04a04b31d100fc87c02b28b13fc2d06898b2c152a156c49f9f9d01804a32039605b6f8e4bbc3549cd372d598ab4a12bbba50f347e593bd41c527c81',
      Address: '54b54360e9953163837cfc63cb129af9f58734b4b03470caa54e9913ce3fb45fa0981b718680'
    }
 */
describe('CreateAddress()', () => {
    test('test create address', async () => {
        let addr = CreateAddress()
        console.log("address=", addr)
    });
});

describe('signTransaction()', ()=>{
    test('sign transaction test', async () => {
        let inputs = [
            {
                "address": "53bd48f439127ecbeb39dd7ed738ec9a505aad1f28681a79812501beb5c47bbd1673b930f468",
                "txid": "7c537aab197a82469eec89e04b8d9505edb5754bef39bd8f79d17ae5611de1f2",
                "amount": "0.17197",
            }
        ]
        let outputs = [
            {
                "address": "54b54360e9953163837cfc63cb129af9f58734b4b03470caa54e9913ce3fb45fa0981b718680",
                "amount": "1",
            },{
                "address": "53bd48f439127ecbeb39dd7ed738ec9a505aad1f28681a79812501beb5c47bbd1673b930f468",
                "amount": "0.06197",
            }
        ]
        const privKeys = [
            {
                address: "53bd48f439127ecbeb39dd7ed738ec9a505aad1f28681a79812501beb5c47bbd1673b930f468",
                key: "4f1f06a714cbfa936379d12989e648702dd550f9b4942cd39f6adf7bbd2b3c13615ed2aa1f4be42ccf7681be701a6dbc7a32f88cc9b146915c832b21e06b444d",
            }
        ];
        const params =  {
            txObj: {
                inputs: inputs,
                outputs: outputs,
                decimal: 24,
                fee: "0.1"
            },
            privs: privKeys
        }
        const tx_sign_msg = await signTransaction(params)
        console.log("tx_sign_msg ===", tx_sign_msg)
    });
});

