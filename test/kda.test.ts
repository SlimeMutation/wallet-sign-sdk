const bip39 = require("bip39")
import {createKdaAddress } from "../src/kda/address"
import {
    signTransaction,
    pubKeyToAddress,
    verifyAddress,
} from "../src/kda/sign";

describe('address', ()=>{
    /**
     * {"privateKey":"b7b8704ec6d1625d06d5f20b6f8bded1f6c374546fd93f3f21d37f5a5072b00f40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda",
     * "publicKey":"40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda",
     * "address":"k:40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda"}
     */
    test('create kda address', () => {
        const mnemonic = "image program nasty bone category twist grab arrange joke crane laugh midnight"
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        const account = createKdaAddress(seed.toString("hex"), "0")
        console.log(account)
    });

    test('public key to address', async ()=>{
        const pubKey =  "40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda";
        const address = pubKeyToAddress({pubKey});
        expect("k:40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda").toEqual(address);
    });

    test('address verify', async ()=>{
        const address =  "k:40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda";
        const ok = verifyAddress({address});
        expect(ok).toEqual(true);
    });
    
});

describe('sign', ()=>{
    test('testnet04 sign transaction test', async () => {
        const privateKey = 'b7b8704ec6d1625d06d5f20b6f8bded1f6c374546fd93f3f21d37f5a5072b00f40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda'
        const params =  {
            txObj: {
                from: 'k:40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda',
                to: 'k:dc991e703eae66561681aa836ef00503d20bac1aad34589d434de126d78e2199',
                toPub: 'dc991e703eae66561681aa836ef00503d20bac1aad34589d434de126d78e2199',
                amount: '1',
                chainId: 1,
                targetChainId: 1,
                gasPrice: '0.0001',
                gasLimit: 1000,
                decimal: 12,
                spv: "",
                pactId: "",
            },
            network: 'testnet04',
            privs: [{ key: privateKey }]
        }
        const tx_sign_msg = await signTransaction(params)
        console.log("tx_sign_msg: ", tx_sign_msg);
    });


    test('cross chain sign transaction test', async () => {
        const privateKey = 'b7b8704ec6d1625d06d5f20b6f8bded1f6c374546fd93f3f21d37f5a5072b00f40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda'
        const params =  {
            txObj: {
                from: 'k:40e942c292ad09c43e4f2912e843a87e750cf261436dd7af17dff187ce8a9bda',
                to: 'k:dc991e703eae66561681aa836ef00503d20bac1aad34589d434de126d78e2199',
                toPub: 'dc991e703eae66561681aa836ef00503d20bac1aad34589d434de126d78e2199',
                amount: "1",
                chainId: 1,
                targetChainId: 2,
                gasPrice: "0.0001",
                gasLimit: 1000,
                decimal: 12,
                spv: "eyJjaGFpbiI6Miwib2JqZWN0IjoiQUFBQUVBQUFBQUFBQUFBQkFFLTZZS1N3ZWRoczFmajVibFo2UkE3ZVhnVEg3MmZIR29JTnpPc3UzMGJZQUpTc2VLQkJ1cVlxUnB2dWMxeDdFVVVWaGZmLWN0WE5uMTlQR1NBVjBLNDlBYTdkN0lnWUFUZUgxLWNEb3RJbnVyRFZMX1FjYzJyTzFtR3BvY21TcWlfeUFXbnZYNTlNWG01dDlVVFNXOGJHdHltVFR1bF9wNUU5Yzl0N016RFJwX2x4QUFiSm4yaXQteE9kN19YNXI1ejJVUThDckMxX2tVNDR5TjNTMW9lMlFoeE1BWDktMy1yc1Z4a0Z2WnhSWEFyNXNUOHNGQVA1Z1F2ZVd4dzd6eGlnMmc0YUFGWlRTYnN5aGJuaGlkMERYamlBX3g0N3BXc0ZvVC1acFVmR1dJMnp4OHktQURLa1VFR29OeFVHTWpnbFMtX2VJS3BORDRjTHJhbDBsRnhtbHZKSWhEaXhBUVlOVXU5N0l4Y2xVTzhLd21FbUtlZXh0cUNBMVduX1FrOXU3TjBKUmhfckFBNllHUWRrVmVaVlk1U2VON0VFeXFIcFVCOUUwYUtOcnNjanFjZkVEeDhEQWRJMnJqUXBmRWQ2djdwUjE4MUVUb1pmRUlZLTNqMFFlbDl1d3R6b0JTbXBBRU5Xekp4b1p4cVphUm9NQV9SM3FWdUprOF9mVUROTC04bEF5RlRkalFLQUFPNHowWEE3RG1fY1pDclFBTmMyVjdSNTAtRERuYmFxbGQ0VldNa0k1UHB3QUdIOFB3NzFoMXhYTFhGQW1RYUxFNDRmQkRmLWdKSVRkTHFXeno1THljS3JBQW1ncXEyNVdYWXFRcEFnUV9KSTdlNjItam9EX09USjFfUGpmQU1ZcS1CSEFMZFZDSFoyQkpIX0pVOWZOdXhHZEJpdk8tdlhFTHlUUmxvTXBpU2I5OWxnIiwic3ViamVjdCI6eyJpbnB1dCI6IkFCUjdJbWRoY3lJNk5qRTRMQ0p5WlhOMWJIUWlPbnNpYzNSaGRIVnpJam9pYzNWalkyVnpjeUlzSW1SaGRHRWlPbnNpWVcxdmRXNTBJam94TENKeVpXTmxhWFpsY2lJNkltczZaR001T1RGbE56QXpaV0ZsTmpZMU5qRTJPREZoWVRnek5tVm1NREExTUROa01qQmlZV014WVdGa016UTFPRGxrTkRNMFpHVXhNalprTnpobE1qRTVPU0lzSW5OdmRYSmpaUzFqYUdGcGJpSTZJakVpTENKeVpXTmxhWFpsY2kxbmRXRnlaQ0k2ZXlKd2NtVmtJam9pYTJWNWN5MWhiR3dpTENKclpYbHpJanBiSW1Sak9Ua3haVGN3TTJWaFpUWTJOVFl4TmpneFlXRTRNelpsWmpBd05UQXpaREl3WW1Gak1XRmhaRE0wTlRnNVpEUXpOR1JsTVRJMlpEYzRaVEl4T1RraVhYMTlmU3dpY21WeFMyVjVJam9pWHpGMGRsOTZibDgwZGtwbFMxcENVRnBJVGtkU2JtbDJiRlEwU20xS0xXeG5ibWg0V0Rad1gyRjJjeUlzSW14dlozTWlPaUo2WDNCa09HWk1XRWsyUkZkU1VUQm1SVmRYY0RWR1owbDBOVFJHWlZNMFZ6ZDZPR1ZOYm5nd1VXcFpJaXdpWlhabGJuUnpJanBiZXlKd1lYSmhiWE1pT2xzaWF6bzBNR1U1TkRKak1qa3lZV1F3T1dNME0yVTBaakk1TVRKbE9EUXpZVGczWlRjMU1HTm1Nall4TkRNMlpHUTNZV1l4TjJSbVpqRTROMk5sT0dFNVltUmhJaXdpYXpvME5qWXhZMkZpWkRRNVlqTmhOVFF4WkRBM1lXVmhaRFpsTldJeFltVmpabVE0T1Rka056UXdZbUZsWTJJeU1UUmlNVGRtTURWaE1EWmlaREV6WmpNMklpdzJMakU0WlMweVhTd2libUZ0WlNJNklsUlNRVTVUUmtWU0lpd2liVzlrZFd4bElqcDdJbTVoYldWemNHRmpaU0k2Ym5Wc2JDd2libUZ0WlNJNkltTnZhVzRpZlN3aWJXOWtkV3hsU0dGemFDSTZJbXRzUm10eVRHWndlVXhYTFUwemVHcFdVRk5rY1ZoRlRXZDRVRkJLYVdKU2RGOUVObkZwUW5kek5uTWlmU3g3SW5CaGNtRnRjeUk2V3lKck9qUXdaVGswTW1NeU9USmhaREE1WXpRelpUUm1Namt4TW1VNE5ETmhPRGRsTnpVd1kyWXlOakUwTXpaa1pEZGhaakUzWkdabU1UZzNZMlU0WVRsaVpHRWlMQ0pyT21Sak9Ua3haVGN3TTJWaFpUWTJOVFl4TmpneFlXRTRNelpsWmpBd05UQXpaREl3WW1Gak1XRmhaRE0wTlRnNVpEUXpOR1JsTVRJMlpEYzRaVEl4T1RraUxERXNJaklpWFN3aWJtRnRaU0k2SWxSU1FVNVRSa1ZTWDFoRFNFRkpUaUlzSW0xdlpIVnNaU0k2ZXlKdVlXMWxjM0JoWTJVaU9tNTFiR3dzSW01aGJXVWlPaUpqYjJsdUluMHNJbTF2WkhWc1pVaGhjMmdpT2lKcmJFWnJja3htY0hsTVZ5MU5NM2hxVmxCVFpIRllSVTFuZUZCUVNtbGlVblJmUkRaeGFVSjNjelp6SW4wc2V5SndZWEpoYlhNaU9sc2lhem8wTUdVNU5ESmpNamt5WVdRd09XTTBNMlUwWmpJNU1USmxPRFF6WVRnM1pUYzFNR05tTWpZeE5ETTJaR1EzWVdZeE4yUm1aakU0TjJObE9HRTVZbVJoSWl3aUlpd3hYU3dpYm1GdFpTSTZJbFJTUVU1VFJrVlNJaXdpYlc5a2RXeGxJanA3SW01aGJXVnpjR0ZqWlNJNmJuVnNiQ3dpYm1GdFpTSTZJbU52YVc0aWZTd2liVzlrZFd4bFNHRnphQ0k2SW10c1JtdHlUR1p3ZVV4WExVMHplR3BXVUZOa2NWaEZUV2Q0VUZCS2FXSlNkRjlFTm5GcFFuZHpObk1pZlN4N0luQmhjbUZ0Y3lJNld5SXlJaXdpWTI5cGJpNTBjbUZ1YzJabGNpMWpjbTl6YzJOb1lXbHVJaXhiSW1zNk5EQmxPVFF5WXpJNU1tRmtNRGxqTkRObE5HWXlPVEV5WlRnME0yRTROMlUzTlRCalpqSTJNVFF6Tm1Sa04yRm1NVGRrWm1ZeE9EZGpaVGhoT1dKa1lTSXNJbXM2WkdNNU9URmxOekF6WldGbE5qWTFOakUyT0RGaFlUZ3pObVZtTURBMU1ETmtNakJpWVdNeFlXRmtNelExT0Rsa05ETTBaR1V4TWpaa056aGxNakU1T1NJc2V5SndjbVZrSWpvaWEyVjVjeTFoYkd3aUxDSnJaWGx6SWpwYkltUmpPVGt4WlRjd00yVmhaVFkyTlRZeE5qZ3hZV0U0TXpabFpqQXdOVEF6WkRJd1ltRmpNV0ZoWkRNME5UZzVaRFF6TkdSbE1USTJaRGM0WlRJeE9Ua2lYWDBzSWpJaUxERmRYU3dpYm1GdFpTSTZJbGhmV1VsRlRFUWlMQ0p0YjJSMWJHVWlPbnNpYm1GdFpYTndZV05sSWpwdWRXeHNMQ0p1WVcxbElqb2ljR0ZqZENKOUxDSnRiMlIxYkdWSVlYTm9Jam9pYTJ4R2EzSk1abkI1VEZjdFRUTjRhbFpRVTJSeFdFVk5aM2hRVUVwcFlsSjBYMFEyY1dsQ2QzTTJjeUo5WFN3aWJXVjBZVVJoZEdFaU9tNTFiR3dzSW1OdmJuUnBiblZoZEdsdmJpSTZleUpsZUdWamRYUmxaQ0k2Ym5Wc2JDd2ljR0ZqZEVsa0lqb2lYekYwZGw5NmJsODBka3BsUzFwQ1VGcElUa2RTYm1sMmJGUTBTbTFLTFd4bmJtaDRXRFp3WDJGMmN5SXNJbk4wWlhCSVlYTlNiMnhzWW1GamF5STZabUZzYzJVc0luTjBaWEFpT2pBc0lubHBaV3hrSWpwN0ltUmhkR0VpT25zaVlXMXZkVzUwSWpveExDSnlaV05sYVhabGNpSTZJbXM2WkdNNU9URmxOekF6WldGbE5qWTFOakUyT0RGaFlUZ3pObVZtTURBMU1ETmtNakJpWVdNeFlXRmtNelExT0Rsa05ETTBaR1V4TWpaa056aGxNakU1T1NJc0luTnZkWEpqWlMxamFHRnBiaUk2SWpFaUxDSnlaV05sYVhabGNpMW5kV0Z5WkNJNmV5SndjbVZrSWpvaWEyVjVjeTFoYkd3aUxDSnJaWGx6SWpwYkltUmpPVGt4WlRjd00yVmhaVFkyTlRZeE5qZ3hZV0U0TXpabFpqQXdOVEF6WkRJd1ltRmpNV0ZoWkRNME5UZzVaRFF6TkdSbE1USTJaRGM0WlRJeE9Ua2lYWDE5TENKemIzVnlZMlVpT2lJeElpd2ljSEp2ZG1WdVlXNWpaU0k2ZXlKMFlYSm5aWFJEYUdGcGJrbGtJam9pTWlJc0ltMXZaSFZzWlVoaGMyZ2lPaUpyYkVacmNreG1jSGxNVnkxTk0zaHFWbEJUWkhGWVJVMW5lRkJRU21saVVuUmZSRFp4YVVKM2N6WnpJbjE5TENKamIyNTBhVzUxWVhScGIyNGlPbnNpWVhKbmN5STZXeUpyT2pRd1pUazBNbU15T1RKaFpEQTVZelF6WlRSbU1qa3hNbVU0TkROaE9EZGxOelV3WTJZeU5qRTBNelprWkRkaFpqRTNaR1ptTVRnM1kyVTRZVGxpWkdFaUxDSnJPbVJqT1RreFpUY3dNMlZoWlRZMk5UWXhOamd4WVdFNE16WmxaakF3TlRBelpESXdZbUZqTVdGaFpETTBOVGc1WkRRek5HUmxNVEkyWkRjNFpUSXhPVGtpTEhzaWNISmxaQ0k2SW10bGVYTXRZV3hzSWl3aWEyVjVjeUk2V3lKa1l6azVNV1UzTURObFlXVTJOalUyTVRZNE1XRmhPRE0yWldZd01EVXdNMlF5TUdKaFl6RmhZV1F6TkRVNE9XUTBNelJrWlRFeU5tUTNPR1V5TVRrNUlsMTlMQ0l5SWl3eFhTd2laR1ZtSWpvaVkyOXBiaTUwY21GdWMyWmxjaTFqY205emMyTm9ZV2x1SW4wc0luTjBaWEJEYjNWdWRDSTZNbjBzSW5SNFNXUWlPamN3TkRNd09UZDkifSwiYWxnb3JpdGhtIjoiU0hBNTEydF8yNTYifQ",
                pactId: "_1tv_zn_4vJeKZBPZHNGRnivlT4JmJ-lgnhxX6p_avs",
            },
            network: 'testnet04',
            privs: [{ key: privateKey }]
        }
        const tx_sign_msg = await signTransaction(params)
        console.log("tx_sign_msg: ", tx_sign_msg);
    });
});