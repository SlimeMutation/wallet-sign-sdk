import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // development only
import ecc from 'eosjs-ecc';

export async function generateKey()  {
    /**
     * 5KTPxLEo2Z9o5ZZuBW3ch6YFhBu4sCM4c6xHPVLXXG6vBk8ZGy8
     * EOS7quH8LcgN6Jy2kNGoKC2BskHDSRRAvvCK65V8DH1swTyLZfLwJ
     */
    const key = await ecc.randomKey();
    console.log('私钥:\t', key); 
    console.log('公钥:\t', ecc.privateToPublic(key)); 

    const pk = ecc.privateToPublic('5KTPxLEo2Z9o5ZZuBW3ch6YFhBu4sCM4c6xHPVLXXG6vBk8ZGy8')
    console.log('pk:\t', pk); 
}

export async function createAccount()  {
    /**
     * rextesttest1
     * EOS83CaXGa5i4DuT7m5YsBM3ETBfzo8kLL3yTQe9dw1EGhUJuFnje
     * 5KFDzjPx5HcGRkfcFnSxfsH8uhNNPzzwj5FeyqG6BP76FEcS6uJ
     * 
     * rextesttest2
     * EOS5bgtBv1N6W2qH1ogey1b3uVybwWn73sdvd8mLBQqZDBj8hWiu7
     * 5KLqj4CzL9rV73it1h18qecz96FeniMPJ1ukkxu7cKUKvSeiT3u
     */
    const privateKeys = ['5KFDzjPx5HcGRkfcFnSxfsH8uhNNPzzwj5FeyqG6BP76FEcS6uJ'];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const rpc = new JsonRpc('https://jungle4.cryptolions.io:443'); //required to read blockchain state
    const api = new Api({ rpc, signatureProvider }); //required to submit transactions

    // const result = await rpc.get_block(1);
    // console.log('result:', result);

    const result = await api.transact({
        actions: [{
            account: 'eosio',
            name: 'newaccount',
            authorization: [{
            actor: 'rextesttest1',
            permission: 'active',
            }],
            data: {
            creator: 'rextesttest1',
            name: 'rextesttest2',
            owner: {
                threshold: 1,
                keys: [{
                key: 'EOS5bgtBv1N6W2qH1ogey1b3uVybwWn73sdvd8mLBQqZDBj8hWiu7',
                weight: 1
                }],
                accounts: [],
                waits: []
            },
            active: {
                threshold: 1,
                keys: [{
                key: 'EOS5bgtBv1N6W2qH1ogey1b3uVybwWn73sdvd8mLBQqZDBj8hWiu7',
                weight: 1
                }],
                accounts: [],
                waits: []
            },
            },
        },
        {
            account: 'eosio',
            name: 'buyrambytes',
            authorization: [{
            actor: 'rextesttest1',
            permission: 'active',
            }],
            data: {
            payer: 'rextesttest1',
            receiver: 'rextesttest2',
            bytes: 8192,
            },
        },
        {
            account: 'eosio',
            name: 'delegatebw',
            authorization: [{
            actor: 'rextesttest1',
            permission: 'active',
            }],
            data: {
            from: 'rextesttest1',
            receiver: 'rextesttest2',
            stake_net_quantity: '1.0000 EOS',
            stake_cpu_quantity: '1.0000 EOS',
            transfer: false,
            }
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30,
        });

    console.log('result:', result);
}

export async function transfer()  {
    const privateKeys = ['5KFDzjPx5HcGRkfcFnSxfsH8uhNNPzzwj5FeyqG6BP76FEcS6uJ'];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const rpc = new JsonRpc('https://jungle4.cryptolions.io:443'); //required to read blockchain state
    const api = new Api({ rpc, signatureProvider }); //required to submit transactions

    const result = await api.transact({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
            actor: 'rextesttest1',
            permission: 'active',
            }],
            data: {
            from: 'rextesttest1',
            to: 'rextesttest2',
            quantity: '1.0000 EOS',
            memo: 'some memo'
            }
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30,
        });
    console.log('result:', result);
}

export async function delegatebw()  {
    const privateKeys = ['5KLqj4CzL9rV73it1h18qecz96FeniMPJ1ukkxu7cKUKvSeiT3u'];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const rpc = new JsonRpc('https://jungle4.cryptolions.io:443'); //required to read blockchain state
    const api = new Api({ rpc, signatureProvider }); //required to submit transactions

    const result = await api.transact({
        actions: [{
            account: 'eosio',
            name: 'delegatebw',
            authorization: [{
            actor: 'rextesttest2',
            permission: 'active',
            }],
            data: {
            from: 'rextesttest2',
            receiver: 'rextesttest2',
            stake_net_quantity: '1.0000 EOS',
            stake_cpu_quantity: '1.0000 EOS',
            transfer: false,
            }
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30,
        });
    console.log('result:', result);
}