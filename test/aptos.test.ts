const bip39 = require('bip39');
import { createAddressFromMnemonic, deriveFromPrivateKey, signTransaction } from '../src/aptos'

describe('aptos unit test case', () => {

    /**
     * kiss remove tortoise sister clutch remove adult struggle noble swarm toe flight
     * {
            privateKey: '0xfe33e92091ce4c81a29659a419e54b121461de91e804f894ea6bdb4eb433c099',
            publicKey: '024d34cd2a9195f219caf1a205fbeee1566e2f53f62933558f57d3ce0c797006',
            address: '552839005054a0025e54c4d08a18d354f5f9db522a843f9b2b838d4f62e2547b'
        }
     */
    /**
     * present quantum voice unit define guitar plate finger city flip display vintage
     * {
            privateKey: '0x0c3e94a265da2c534f94c75713c397e53515f3ece78de36f3e055fde7e7c260c',
            publicKey: '0af36d989864d19f39e8cdea33ea761c2955f8d746fca35d2035058a9ed0ddcd',
            address: 'd28ca1dd3c0eb06f2a9e4f6f4ede14cbe46332137465b5cebdfa7dd791d9adec'
        }
            0xd28ca1dd3c0eb06f2a9e4f6f4ede14cbe46332137465b5cebdfa7dd791d9adec
     */
    test('createAddressFromMnemonic', async () => {
        // const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
        const mnemonic = 'kiss remove tortoise sister clutch remove adult struggle noble swarm toe flight';
        // const mnemonic = 'present quantum voice unit define guitar plate finger city flip display vintage';
        console.log('mnemonic: ', mnemonic);
        const result = createAddressFromMnemonic(mnemonic, "0");
        console.log(result);
    });

    test('deriveFromPrivateKey', async () => {
        const privateKey = '0x0c3e94a265da2c534f94c75713c397e53515f3ece78de36f3e055fde7e7c260c';
        console.log('privateKey: ', privateKey);
        const result = await deriveFromPrivateKey(privateKey);
        console.log(result);
    });

    test('signTransactionNew', async () => {
        const params = {
            privateKeyHex: '0xfe33e92091ce4c81a29659a419e54b121461de91e804f894ea6bdb4eb433c099',
            toAddress: '0xd28ca1dd3c0eb06f2a9e4f6f4ede14cbe46332137465b5cebdfa7dd791d9adec',
            amount: 0.01,
            decimal: 8
        };
        await signTransaction(params);
    });
});