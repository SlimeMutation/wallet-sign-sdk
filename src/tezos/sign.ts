import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

export async function transfer(secretKey: string, toPublicKeyHash: string, amount: number) {
    const Tezos = new TezosToolkit('https://rpc.tzkt.io/ghostnet');
    Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(secretKey) });

    // Using the contract API, the follwing operation is signed using the configured signer:
    return await Tezos.contract.transfer({ to: toPublicKeyHash, amount });
}

