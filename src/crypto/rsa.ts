import { KeyPair } from "./generation";
import crypto from "crypto";
import { Signer } from "./signer";

export class RSASigner implements Signer {
  sign(dataToBeSigned: string, keyPair: KeyPair): string {
    try {
      const cipher = crypto.createCipheriv(
        "aes-192-cbc",
        crypto.scryptSync(keyPair.private, "fiskaly is AWESOME!", 24),
        crypto.randomBytes(16)
      );
      let encrypted = cipher.update(dataToBeSigned);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      console.log("Successfully signed data - RSA");
      return encrypted.toString("base64");
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
