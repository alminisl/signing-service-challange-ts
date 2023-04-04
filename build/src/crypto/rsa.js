import crypto from "crypto";
export class RSASigner {
    sign(dataToBeSigned, keyPair) {
        try {
            const cipher = crypto.createCipheriv("aes-192-cbc", crypto.scryptSync(keyPair.private, "fiskaly is AWESOME!", 24), crypto.randomBytes(16));
            let encrypted = cipher.update(dataToBeSigned);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return encrypted.toString("base64");
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
//# sourceMappingURL=rsa.js.map