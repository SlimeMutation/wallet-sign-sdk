import {
    CreateAddress,
    CreateAddressByPhrase
} from "../src/stacks/address_copy";
import { SignTransaction } from  "../src/stacks/transaction_copy"
import { deserializeTransaction } from '@stacks/transactions';




describe('Create Address', () => {
    /**
     * {
            address: 'SPVSSMJNTW300NQEAV4KJ1XKC79QGTE7GDSMMWE9',
            privateKey: '88a8c7acc17de20c0157e3a030aded7d81c04fe76211a481114410fca451d10b01'
        }
     */
    /**
     * {
            address: 'SPAE8JJQXN4BX7H5GYFKJAZMRZVY4ZA0TYHKF0N5',
            privateKey: '3f62fa234f88ec892c2334e423d1e33878c36601f09c72ffcd3cfde17c0ce06e01'
        }
     */
    test('it returns stx address', async () => {
        const result = await CreateAddress({
            network: "mainnet",
            password: ""
        })
        console.log("result: ", result)
    });
    /**
        {
            address: 'ST2JSAXXTH90R04677F6JDS5D4DXWNW4T3GMQV22V',
            privateKey: 'd7c71a427b8a9ed870c9552f67beadc2710dbee7f29a0cf6cfd1dd96a703bf1801',
            publicKey: '027b68c3e4f6ef34b20f15c2258ceee3ab8c5cb9b1cfef707bfe26f2bdd3cad428'
        }
     */
    test('it returns stx address by ', async () => {
        const result = await CreateAddressByPhrase({
            network: "testnet",
            phrase: "oblige boat easily source clip remind steel hockey nut arrow swallow keep run fragile fresh river expire stay monster black defy box fiber wave"
        })
        console.log("result: ", result)
    });
});


describe('sign transaction', () => {
    test('it returns stx address', async () => {
        const tx = await SignTransaction({
            to: "ST7GB88M2N1YXTQG1M59FAMM9ZMYNN49HXT849XT",
            amount: 100000,
            fee: 100000,
            nonce: 2,
            memo: "test3",
            privateKey: "d7c71a427b8a9ed870c9552f67beadc2710dbee7f29a0cf6cfd1dd96a703bf1801",
            network: "testnet"
        })
        console.log("tx: ", tx)

        // Convert hex to buffer
        const txBuffer = Buffer.from(tx, 'hex');
        
        // Write to file
        const fs = require('fs');
        const path = require('path');
        const outputPath = path.join(__dirname, 'temp', 'tx.bin');
        
        // Create temp directory if not exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        
        // Write buffer to file
        await fs.promises.writeFile(outputPath, txBuffer);
        
        // Verify file content
        const fileContent = await fs.promises.readFile(outputPath);
        expect(fileContent.equals(txBuffer)).toBe(true);
    });

    // afterEach(async () => {
    //     // Clean up generated files
    //     const fs = require('fs');
    //     const path = require('path');
    //     const outputPath = path.join(__dirname, 'temp');
    //     if (fs.existsSync(outputPath)) {
    //         fs.rmSync(outputPath, { recursive: true, force: true });
    //     }
    // });

    test('it test', async () => {
        const deserializedTx = deserializeTransaction('80800000000400a59577ba8a418010c73bcd26e4ad237bcaf09a1c000000000000000000000000000186a0000165b69e60a72fcd59438801a32e7550ca5d8202251b1bfdb8bc5c1d540e6eabec498404bf31cfea65996412c73982dc5e88893ae1d8ff1ff6e43f63059ac72b4703020000000000051a0f05a1141543eeeaf00d0a97aa944fe9ead4898f00000000000186a074657374000000000000000000000000000000000000000000000000000000000000');
        console.log(deserializedTx.auth.authType); // 输出授权类型
    });
});
