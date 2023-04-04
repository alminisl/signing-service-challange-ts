import crypto from "crypto";
export const generateEcKeyPair = () => {
    const options = {
        namedCurve: "secp256k1",
        publicKeyEncoding: {
            type: "spki",
            format: "der",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "der",
        },
    };
    return new Promise((resolve, reject) => {
        try {
            crypto.generateKeyPair("ec", options, (err, publicKey, privateKey) => {
                if (err) {
                    console.log(`Encountered an error during EC key pair generation: ${err.message}`);
                }
                const keyPair = {
                    public: publicKey.toString(),
                    private: privateKey.toString(),
                };
                // const keyPair: CryptoKeyPair = {
                //   public: publicKey,
                //   private: privateKey,
                // };
                console.log(`Created EC key pair: ${keyPair}`);
                resolve(keyPair);
            });
        }
        catch (e) {
            console.log(`Failed to generated EC key pair`);
            reject(e);
        }
    });
};
export const generateRsaKeyPair = () => {
    const options = {
        modulusLength: 2048,
        publicExponent: 0x10101,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "der",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "der",
            cipher: "aes-192-cbc",
            passphrase: "fiskaly is AWESOME",
        },
    };
    return new Promise((resolve, reject) => {
        try {
            crypto.generateKeyPair("rsa", options, (err, publicKey, privateKey) => {
                if (err) {
                    console.log(`Encountered an error during RSA key pair generation: ${err.message}`);
                }
                const keyPair = {
                    public: publicKey.toString(),
                    private: privateKey.toString(),
                };
                console.log(`Created RSA key pair: ${keyPair}`);
                resolve(keyPair);
            });
        }
        catch (e) {
            console.log(`Failed to generated RSA key pair`);
            reject(e);
        }
    });
};
export default function generateKeyPair(type) {
    if (type === "rsa") {
        return generateRsaKeyPair();
    }
    else if (type === "ec") {
        return generateEcKeyPair();
    }
    else {
        return Promise.reject(new Error("Invalid key pair type"));
    }
}
//# sourceMappingURL=generation.js.map