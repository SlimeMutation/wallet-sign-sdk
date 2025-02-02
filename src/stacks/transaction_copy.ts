import {
    makeSTXTokenTransfer,
    AnchorMode,
    validateStacksAddress,
    TransactionVersion,
    getAddressFromPublicKey,
    broadcastTransaction
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

export async function SignTransaction(params: any) {
    const {
        to, amount, fee, nonce, memo, privateKey, network
    } = params;
    const stacksNet = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    const txOptions = {
        recipient: to,
        amount,
        senderKey: privateKey,
        network: stacksNet,
        memo,
        nonce,
        fee,
        anchorMode: AnchorMode.Any
    }
    const transaction = await makeSTXTokenTransfer(txOptions);
    return transaction.serialize().toString('hex');
    // // 3. 广播到节点
    // const response = await broadcastTransaction(transaction, 'testnet');

    // // 4. 检查结果
    // console.log(response);
}