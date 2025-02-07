import { InMemorySigner } from '@taquito/signer';

export async function createAccountFromMnemonic(mnemonic: string) {
  const signer = await InMemorySigner.fromMnemonic({mnemonic});
  const publicKey = await signer.publicKey();
  const privateKey = await signer.secretKey();
  const address = await signer.publicKeyHash();
  return {
    publicKey,
    privateKey,
    address
  }
}

export async function createAccountFromSecrectKey(secretKey: string) {
    const signer = await InMemorySigner.fromSecretKey(secretKey);
    const publicKey = await signer.publicKey();
    const privateKey = await signer.secretKey();
    const address = await signer.publicKeyHash();
    return {
        publicKey,
        privateKey,
        address
    }
}

