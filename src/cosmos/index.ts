import BIP32Factory from "bip32";
import * as ecc from 'tiny-secp256k1';
import {util} from 'protobufjs';
import Buffer = util.Buffer;
const bip32 = BIP32Factory(ecc);
const { fromHex, toBase64} = require('@cosmjs/encoding');
const {
    Secp256k1Wallet,
    pubkeyToAddress: atomPubKeyToAddress
} = require('@cosmjs/amino');
const BigNumber = require('bignumber.js');
const { createSendMessage, createTxBody, createTxRawBytes } = require('./proto-tx-service');
const { getSignDoc, getAuthInfo, getDirectSignature } = require('./post-ibc-signer');
const { isValidAddress, verifyChecksum } = require('./validator');

export async function createAtomAddress(seedHex: string, addressIndex: string, network: string) {
    const node = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
    const child = node.derivePath("m/44'/118'/0'/0/" + addressIndex + "");
    const publicKey = Buffer.from(child.publicKey, 'hex');
    const prefix = 'cosmos';
    const pubkey = {
        type: 'tendermint/PubKeySecp256k1',
        value: toBase64(
            fromHex(publicKey.toString('hex'))
        )
    };
    const address = atomPubKeyToAddress(pubkey, prefix);
    return {
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        address
    };
}

export function publicKeyToAddress(publicKey: string) {
    const prefix = 'cosmos';
    const pubKey = {
        type: 'tendermint/PubKeySecp256k1',
        value: toBase64(
            fromHex(publicKey)
        )
    };
    return atomPubKeyToAddress(pubKey, prefix);
}

export async function signAtomTransaction (params: any): Promise<String> {
    const { privateKey, chainId, from, to, memo, amount, fee, gas, accountNumber, sequence, decimal } = params;
    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toNumber();
    if (calcAmount % 1 !== 0) throw new Error('amount invalid');
    const calcFee = new BigNumber(fee).times(new BigNumber(10).pow(decimal)).toNumber();
    if (calcFee % 1 !== 0) throw new Error('fee invalid');
    const signDoc = {
        msgs: [
            {
                type: 'cosmos-sdk/MsgSend',
                value: {
                    from_address: from,
                    to_address: to,
                    amount: [{ amount: BigNumber(amount).times(Math.pow(10, decimal)).toString(), denom: 'uatom'}]
                }
            }
        ],
        fee: {
            amount: [{ amount: BigNumber(fee).times(Math.pow(10, decimal)).toString(), denom: 'uatom' }],
            gas: String(gas)
        },
        chainId: chainId,
        memo: memo || '',
        account_number: accountNumber.toString(),
        sequence: sequence.toString()
    };
    const signer = await Secp256k1Wallet.fromKey(new Uint8Array(Buffer.from(privateKey, 'hex')), 'cosmos');
    const { signature } = await signer.signAmino(from, signDoc);
    const tx = {
        tx: {
            msg: signDoc.msgs,
            fee: signDoc.fee,
            signatures: [signature],
            memo: memo || ''
        },
        mode: 'sync'
    };
    return JSON.stringify(tx);
}

export function verifyAtomAddress(params: any) {
    const { address } = params;
    const regex = new RegExp('^cosmos[a-zA-Z0-9]{39}$');
    return regex.test(address);
}

export async function importAtomAddress(params: any) {
    const { privateKey } = params;
    const accounts = await Secp256k1Wallet.fromKey(new Uint8Array(Buffer.from(privateKey, 'hex')), 'cosmos');
    const accountList = await accounts.getAccounts();
    const address = accountList[0].address;
    return {
        privateKey,
        address
    };
}

export async function SignV2Transaction(params: any): Promise<string> {
    const { chainId, from, to, memo, amount_in, fee, gas, accountNumber, sequence, decimal, privateKey } = params;

    const amount = BigNumber(amount_in).times(Math.pow(10, decimal)).toString();
    const feeAmount = BigNumber(fee).times(Math.pow(10, decimal)).toString();
    const unit = "uatom";
    if (amount.toString().indexOf(".") !== -1) {
        throw new Error('input amount value invalid.');
    }
    if (feeAmount.toString().indexOf(".") !== -1) {
        throw new Error('input feeAmount value invalid.');
    }
    if (!verifyAddress({address: from}) || !verifyAddress({address: to})) {
        throw new Error('input address value invalid.');
    }
    const sendMessage = createSendMessage(
        from,
        to,
        amount,
        unit
    );
    const messages = [sendMessage];
    const txBody = createTxBody(messages, memo);
    const {pubkey} = await Secp256k1Wallet.fromKey(
        fromHex(privateKey),
        "cosmos"
    );
    const authInfo = await getAuthInfo(
        pubkey,
        sequence.toString(),
        feeAmount,
        unit,
        gas
    );
    const signDoc = getSignDoc(chainId, txBody, authInfo, accountNumber);
    const signature = getDirectSignature(signDoc, fromHex(privateKey));
    const txRawBytes = createTxRawBytes(
        txBody,
        authInfo,
        signature
    );
    const txBytesBase64 = Buffer.from(txRawBytes, 'binary').toString('base64');
    const txRaw = { tx_bytes: txBytesBase64, mode: "BROADCAST_MODE_SYNC"};
    return JSON.stringify(txRaw);
}

function verifyAddress(params: any): boolean {
    const { address } = params;
    try {
        if (!isValidAddress(address) || !verifyChecksum(address)) return false;
        return true;
    } catch (error) {
        return false;
    }
}