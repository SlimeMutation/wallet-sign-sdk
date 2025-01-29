import * as SPLToken from '@solana/spl-token';
import {Connection, Keypair, NONCE_ACCOUNT_LENGTH, NonceAccount, PublicKey, SystemProgram, Transaction} from '@solana/web3.js';

const bs58 = require('bs58');
const { derivePath, getPublicKey} = require('ed25519-hd-key');
const Bignumber = require('bignumber.js');

export function createSolAddress(seedHex: string, addressIndex: string) {
    const { key } = derivePath("m/44'/501'/0'/"+ addressIndex + "'", seedHex);
    const buffer = getPublicKey(new Uint8Array(key), false);
    const publicKey = buffer.toString('hex');
    const address = bs58.encode(buffer);
    const hdwallet = {
        privateKey: key.toString('hex') + publicKey,
        publicKey,
        address
    };
    return JSON.stringify(hdwallet);
}

export async function signSolTransaction(params: any) {
    const { from, amount, nonceAccount, to, mintAddress, nonce, decimal, privateKey } = params;
    const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, 'hex')), { skipValidation: true });
    const calcAmount = new Bignumber(amount)
        .times(new Bignumber(10).pow(decimal))
        .integerValue()
        .toString();
    if (isNaN(calcAmount)) throw new Error("金额格式错误");

    const tx = new Transaction();
    const toPubkey = new PublicKey(to);
    const fromPubkey = new PublicKey(from);
    const noncePubkey = new PublicKey(nonceAccount);
    tx.recentBlockhash = nonce;
    tx.add(
        SystemProgram.nonceAdvance({
            noncePubkey,
            authorizedPubkey: fromAccount.publicKey
        })
    );
    if (mintAddress) {
        const mint = new PublicKey(mintAddress);
        const fromTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            fromPubkey
        );
        const toTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            toPubkey
        );

        // 检查接收方关联账户是否存在，若不存在则创建
        const connection = new Connection("https://intensive-weathered-mound.solana-devnet.quiknode.pro/bcc5a2956b356c690918605b8de52086d1460460");
        const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);
        if (!toTokenAccountInfo) {
            const createATAInstruction = SPLToken.Token.createAssociatedTokenAccountInstruction(
                SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
                SPLToken.TOKEN_PROGRAM_ID,
                mint,
                toTokenAccount,
                toPubkey,
                fromPubkey
            );
            tx.add(createATAInstruction);
        }

        tx.add(
            SPLToken.Token.createTransferInstruction(
                SPLToken.TOKEN_PROGRAM_ID,
                fromTokenAccount,
                toTokenAccount,
                fromPubkey,
                [fromAccount],
                calcAmount
            )
        );
    } else {
        // 处理原生 SOL 转账
        tx.add(
            SystemProgram.transfer({
                fromPubkey: fromAccount.publicKey,
                toPubkey: toPubkey,
                lamports: calcAmount
            })
        );
    }

    tx.sign(fromAccount);
    return tx.serialize().toString('base64');
}

export function prepareAccount(params: any){
    const {
        authorAddress, from, recentBlockhash, minBalanceForRentExemption, privs
    } = params;

    const authorPrivateKey = (privs?.find((ele:{address:any})=>ele.address===authorAddress))?.key;
    if (!authorPrivateKey) throw new Error('authorPrivateKey 为空');
    const nonceAccountPrivateKey = (privs?.find((ele:{address:any})=>ele.address===from))?.key;
    if (!nonceAccountPrivateKey) throw new Error('nonceAccountPrivateKey 为空');

    const author = Keypair.fromSecretKey(new Uint8Array(Buffer.from(authorPrivateKey, 'hex')));
    const nonceAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(nonceAccountPrivateKey, 'hex')));

    let tx = new Transaction();
    tx.add(
        SystemProgram.createAccount({
            fromPubkey: author.publicKey,
            newAccountPubkey: nonceAccount.publicKey,
            lamports: minBalanceForRentExemption,
            space: NONCE_ACCOUNT_LENGTH,
            programId: SystemProgram.programId
        }),

        SystemProgram.nonceInitialize({
            noncePubkey: nonceAccount.publicKey,
            authorizedPubkey: author.publicKey
        })
    );
    tx.recentBlockhash = recentBlockhash;

    tx.sign(author, nonceAccount);
    return tx.serialize().toString("base64");
}

export async function getNonce(nonceAccount: string) {
    const connection = new Connection('https://intensive-weathered-mound.solana-devnet.quiknode.pro/bcc5a2956b356c690918605b8de52086d1460460');
    const nonceAccountInfo = await connection.getNonce(new PublicKey(nonceAccount));
    console.log('nonceAccountInfo: ', nonceAccountInfo);
    return nonceAccountInfo?.nonce;
}

export function verifySolAddress(params: any) {
    const { address } = params;
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function importSolAddress(params: any) {
    const { privateKey } = params;
    const keyPairs = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
    return bs58.encode(keyPairs.publicKey);
}

// @ts-ignore
export function pubKeyToAddress({pubKey}): string {
    if (pubKey.length !== 64) {
        throw new Error('public key length invalid');
    }
    const buffer = Buffer.from(pubKey, 'hex');
    return bs58.encode(buffer);
}

// @ts-ignore
export function privateKeyToAddress({privateKey}): string {
    const bufferPriv = Buffer.from(privateKey, 'hex');
    const keypairs = Keypair.fromSecretKey(bufferPriv);
    return bs58.encode(keypairs.publicKey);
}