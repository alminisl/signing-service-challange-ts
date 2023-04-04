import { KeyPair } from "./generation";

export interface Signer {
  sign: (dataToBeSigned: string, keyPair: KeyPair) => string | Error;
}
