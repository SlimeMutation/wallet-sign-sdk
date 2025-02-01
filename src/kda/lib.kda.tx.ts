const Pact = require("pact-lang-api");
const creationTime = () => Math.round((new Date).getTime()/1000)-15;

const transferCode = (sender, receiver, amount) => `(coin.transfer "${sender}" "${receiver}" ${amount})`;
const transferCreateCode = (sender, receiver, amount) => `(coin.transfer-create "${sender}" "${receiver}" (read-keyset "receiver-guard") ${amount})`;
const transferCrossChain = (sender, receiver, targetChain, amount) => `(coin.transfer-crosschain "${sender}" "${receiver}" (read-keyset "receiver-guard") "${targetChain}" ${amount})`;
const transferMeta = (sender, chainId, gasPrice, gasLimit) => Pact.lang.mkMeta(sender, chainId, gasPrice, gasLimit, creationTime(), 600);
const transferKp = (sender, senderKp, receiver, amount) => {
    return { ...senderKp,
        clist: [
            {"name": "coin.TRANSFER", "args": [sender, receiver, Number(amount)]},
            {"name": "coin.GAS", "args": []},
        ]
    }
};

const transferReceiverG = (pubKey) => {return {"receiver-guard": [pubKey]}};
const transferCrossChainKp = (sender, receiver, targetChain, amount, senderKp) => {
    return { ...senderKp,
        clist: [
            {"name": "coin.TRANSFER_XCHAIN", "args": [sender, receiver, Number(amount), targetChain]},
            {"name": "coin.GAS", "args": []},
        ]
    }
};

const keepDecimal = decimal => {
    decimal = decimal.toString();
    if (decimal.includes('.')) {
        return decimal
    }
    if ((decimal / Math.floor(decimal)) === 1) {
        decimal = decimal + ".0"
    }
    return decimal
}

export function CreateOfflineSignTx(params) {
    const {
        SignObj: { sender, senderPubKey, senderSecretKey, receiver, receiverPubKey, amount, chainId, targetChainId, networkId, gasPrice, gasLimit, spv, pactId },
        method,
    } = params;
    const senderKeyPair = {
        publicKey: senderPubKey,
        secretKey: senderSecretKey
    };
    let transferObj = {
        keyPairs: transferKp(sender, senderKeyPair, receiver, keepDecimal(amount)),
        transferCrossChainKp: transferCrossChainKp(sender, receiver, targetChainId, amount, senderKeyPair),
        meta: transferMeta(sender, chainId, gasPrice, gasLimit),
        envData: transferReceiverG(receiverPubKey),
        transferCode: transferCode(sender, receiver, keepDecimal(amount)),
        transferCreateCode: transferCreateCode(sender, receiver, keepDecimal(amount)),
        transferCrossChainCode: transferCrossChain(sender, receiver, targetChainId, keepDecimal(amount))
    };
    if (method === "crossTransferOffline") { // 跨链转账： 接收者公钥和注册名字必传，发送者公钥必传，接收者公钥必传
        if (spv === "" || spv === undefined) {
            return Pact.simple.exec.createCommand(
                transferObj.transferCrossChainKp,
                undefined,
                transferObj.transferCrossChainCode,
                transferObj.envData,
                transferObj.meta,
                networkId
            );
        } else {
            const meta = transferMeta(sender, targetChainId, gasPrice, gasLimit);
            return Pact.simple.cont.createCommand(
                senderKeyPair, undefined, 1, pactId, false, null, meta, spv, networkId
            )
        }
    } else if (method === "transferCreateOffline") {
        //  注册账号转账： 接收者公钥必传，接收注册名字必传，发送者公钥必传，接收者公钥必传
        return Pact.simple.exec.createCommand(
            transferObj.keyPairs,
            undefined,
            transferObj.transferCreateCode,
            transferObj.envData,
            transferObj.meta,
            networkId
        );
    } else {  // transferOffline
        // 离线转账: 接收注册名字必传, 公钥非必传，发送者公钥必传，接收者公钥必传
        return Pact.simple.exec.createCommand(
            transferObj.keyPairs,
            undefined,
            transferObj.transferCode,
            null,
            transferObj.meta,
            networkId
        )
    }
}

