import * as bip39 from 'bip39'

import { createAccountFromMnemonic, createAccountFromSecrectKey } from "../src/tezos/address";
import { transfer } from "../src/tezos/sign";

describe('tezos unit test case', () => {
    
    /**
     * zebra twenty plunge legend guess expose kick lounge short control jelly laundry voice minimum loud citizen tent tape ring expire transfer shield perfect amount
     * {
            publicKey: 'edpkvUqfGSLJRDv2fBFFbD2PbdojkhhMq5NSjVa8SHn22oGhgsQykb',
            privateKey: 'edskS8L4kMrsD8VKWbW4GSM6nfP7Lugp2AJjrQtFc8sX7iuz1L3oatx3tBmnQKftBQMU62JNHsgz97K7r8zSx8beuuwaxUh917',
            address: 'tz1cYHAw32mYJLKajJNVyMBosYFXA4hEbSsA'
        }
     * tz1cYHAw32mYJLKajJNVyMBosYFXA4hEbSsA
     */
    /**
     * old infant truly author diary sad charge misery seek snake various toy have cook deposit future person police among pattern guard crane express lazy
     * {
            publicKey: 'edpktubkTqK7WetsCfD5W3zcLVk2nQiNmfmNKJhnx1UfHGWehGPH1N',
            privateKey: 'edskRrnLrN1u9XUcxbMRaTyA3JZNE6172xoMsR9vx9jLLBNFkCQBB344kyzjAaCJit8nSv1ARGf6auCW4BfTUo8CnpMPzux5HT',
            address: 'tz1bS5Nf49pKEY5qwULwe48uMiLDaGFv2yor'
        }
     */
    test('createAccountFromMnemonic', async () => {
        const mnemonic = bip39.generateMnemonic(256, undefined, bip39.wordlists.english);
        console.log('助记词:', mnemonic);
        const account = await createAccountFromMnemonic(mnemonic)
        console.log(account)
    });

    /**
     * {
            publicKey: 'edpkvUqfGSLJRDv2fBFFbD2PbdojkhhMq5NSjVa8SHn22oGhgsQykb',
            privateKey: 'edskS8L4kMrsD8VKWbW4GSM6nfP7Lugp2AJjrQtFc8sX7iuz1L3oatx3tBmnQKftBQMU62JNHsgz97K7r8zSx8beuuwaxUh917',
            address: 'tz1cYHAw32mYJLKajJNVyMBosYFXA4hEbSsA'
        }
     */
    test('createAccountFromSecrectKey', async () => {
        const secretKey = 'edskS8L4kMrsD8VKWbW4GSM6nfP7Lugp2AJjrQtFc8sX7iuz1L3oatx3tBmnQKftBQMU62JNHsgz97K7r8zSx8beuuwaxUh917';
        const account = await createAccountFromSecrectKey(secretKey)
        console.log(account)
    });

    test('transfer', async () => {
        const secretKey = 'edskS8L4kMrsD8VKWbW4GSM6nfP7Lugp2AJjrQtFc8sX7iuz1L3oatx3tBmnQKftBQMU62JNHsgz97K7r8zSx8beuuwaxUh917';
        const toPublicKeyHash = 'tz1bS5Nf49pKEY5qwULwe48uMiLDaGFv2yor';
        const amount = 2;
        const result = await transfer(secretKey, toPublicKeyHash, amount);
        console.log(result)
    });
});