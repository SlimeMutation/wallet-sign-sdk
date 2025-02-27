import { Interface } from '@ethersproject/abi';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common';

const ethers = require('ethers')
const BigNumber = require('Bignumber.js')

export function numberToHex(value: any) {
    const number = BigNumber(value);
    const result = number.toString(16);
    return '0x' + result;
}

export function createBttAddress(seedHex: string, addressIndex: string) {
    const hdNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
    const {
        privateKey,
        publicKey,
        address
    } = hdNode.derivePath("m/44'/60'/0'/0" + addressIndex);
    return JSON.stringify({
        privateKey,
        publicKey,
        address
    })
}

export function importPrivateKey(privateKey: string) {
    const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
    return JSON.stringify({
        privateKey,
        address: wallet.address
    });
}

export function publicKeyToAddress(publicKey: string) {
    return ethers.utils.computeAddress(publicKey);
}

export function bttSign(params: any) {
    let { privateKey, nonce, from, to, gasPrice, gasLimit, amount, tokenAddress, decimal, maxPriorityFeePerGas, maxFeePerGas, chainId, data } = params;
    const nonceHex = numberToHex(nonce);
    const gasLimitHex = numberToHex(gasLimit);
    const chainIdHex = numberToHex(chainId);
    let newAmount = BigNumber(amount).times((BigNumber(10).pow(decimal)));
    const newAmountHex = numberToHex(newAmount);
    let txData: any = {
        nonce: nonceHex,
        gasLimit: gasLimitHex,
        to,
        from,
        chainId: chainIdHex,
        value: newAmountHex
    }
    if (maxPriorityFeePerGas && maxFeePerGas) {
        txData.maxFeePerGas = numberToHex(maxFeePerGas);
        txData.maxPriorityFeePerGas = numberToHex(maxPriorityFeePerGas);
    } else {
        txData.gasPrice = numberToHex(gasPrice);
    }
    if (tokenAddress && tokenAddress !== '0x00') {
        const ABI = [
            'function transfer(address to, uint256 amount)'
        ];
        const iface = new Interface(ABI);
        txData.data = iface.encodeFunctionData('transfer', [to, newAmountHex]);
        txData.to = tokenAddress;
        txData.value = 0;
    }
    if (data) {
        txData.data = data;
    }
    let common: any, tx: any;
    if (txData.maxFeePerGas && txData.maxPriorityFeePerGas) {
        common = (Common as any).custom({
            chainId,
            defaultHardfork: 'london'
        });
        tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
    } else {
        common = (Common as any).custom({ chainId });
        tx = Transaction.fromTxData(txData, { common });
    }
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const signedTx = tx.sign(privateKeyBuffer);
    const serializedTx = signedTx.serialize();
    if (!serializedTx) {
        throw new Error("sign is null or undefined");
    }
    return `0x${serializedTx.toString('hex')}`;
}