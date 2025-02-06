import { Aptos, AptosConfig, Network, Account, PrivateKey, PrivateKeyVariants, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import BigNumber from 'bignumber.js';

export function createAddressFromMnemonic(mnemonic: string, addressIndex: string) {
    const path = "m/44'/637'/0'/0'/"+addressIndex+"'";
    const account = Account.fromDerivationPath({ path, mnemonic });
    return {
        privateKey: account.privateKey.toHexString(),
        publicKey: Buffer.from(account.publicKey.toUint8Array()).toString('hex'),
        address: Buffer.from(account.accountAddress.data).toString('hex')
    }
}

export async function deriveFromPrivateKey(privateKeyHex: string) {
    const privateKey = new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyHex, PrivateKeyVariants.Ed25519));
    const account = await Account.fromPrivateKey({ privateKey });
    return {
        privateKey: account.privateKey.toHexString(),
        publicKey: Buffer.from(account.publicKey.toUint8Array()).toString('hex'),
        address: Buffer.from(account.accountAddress.data).toString('hex')
    }
}

export async function signTransaction(params: any){
    const { privateKeyHex, toAddress, amount, decimal } = params;

    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toNumber();
    if (calcAmount % 1 !== 0) throw new Error('amount invalid');
    
    const privateKey = new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyHex, PrivateKeyVariants.Ed25519));
    const fromAccount = await Account.fromPrivateKey({ privateKey });
    console.log("=== Addresses ===\n");
    console.log(`fromAccount address is: ${fromAccount.accountAddress}`);

    // 0. Setup the client and test accounts
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
 
    // 1. Build
    console.log("\n=== 1. Building the transaction ===\n");
    const transaction = await aptos.transaction.build.simple({
        sender: fromAccount.accountAddress,
        data: {
        // All transactions on Aptos are implemented via smart contracts.
        function: "0x1::aptos_account::transfer",
        functionArguments: [toAddress, calcAmount],
        },
    });
    console.log("Built the transaction!")
 
    // 2. Simulate (Optional)
    console.log("\n === 2. Simulating Response (Optional) === \n")
    const [userTransactionResponse] = await aptos.transaction.simulate.simple({
        signerPublicKey: fromAccount.publicKey,
        transaction,
    });
    console.log(userTransactionResponse)
 
    // 3. Sign
    console.log("\n=== 3. Signing transaction ===\n");
    const senderAuthenticator = aptos.transaction.sign({
        signer: fromAccount,
        transaction,
    });
    console.log("Signed the transaction!")
    console.log("bcs: ", Buffer.from(senderAuthenticator.bcsToBytes()).toString('hex'));
    

    // // 4. Submit
    // console.log("\n=== 4. Submitting transaction ===\n");
    // const submittedTransaction = await aptos.transaction.submit.simple({
    //     transaction,
    //     senderAuthenticator,
    // });
 
    // console.log(`Submitted transaction hash: ${submittedTransaction.hash}`);
 
    // // 5. Wait for results
    // console.log("\n=== 5. Waiting for result of transaction ===\n");
    // const executedTransaction = await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
    // console.log(executedTransaction)
}
