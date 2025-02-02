import keychain from '@stacks/keychain';
import { ChainID, TransactionVersion } from '@stacks/transactions';
import { deriveRootKeychainFromMnemonic, deriveStxAddressChain } from '@stacks/keychain';

export async function CreateAddress(params: any) {
    const { network, password } = params;
    if (network == 'mainnet') {
        const generated = await keychain.Wallet.generate(password, ChainID.Mainnet);
        const signer = generated.getSigner();
        const privateKey = signer.getSTXPrivateKey();
        const mainnetAddress = signer.getSTXAddress(TransactionVersion.Mainnet);
        return {
            address: mainnetAddress,
            privateKey: privateKey.toString('hex')
        }
    } else {
        const generated = await keychain.Wallet.generate(password, ChainID.Testnet);
        const signer = generated.getSigner();
        const privateKey = signer.getSTXPrivateKey();
        const testnetAddress = signer.getSTXAddress(TransactionVersion.Testnet);
        return {
            address: testnetAddress,
            privateKey: privateKey.toString('hex')
        }
    }
}

export async function CreateAddressByPhrase(params: any) {
    const { network, phrase } = params;
    const netWork = network === 'mainnet' ? ChainID.Mainnet : ChainID.Testnet;
    const deriveStxMainnetAddressChain = deriveStxAddressChain(netWork);
    const rootNode = await deriveRootKeychainFromMnemonic(phrase);
    const result = deriveStxMainnetAddressChain(rootNode);
    return {
        address: result.address,
        privateKey: result.privateKey,
        publicKey: result.childKey.publicKey.toString('hex')
    }
}