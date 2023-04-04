// TODO: signature device domain model ...

export enum AlgorithmEnum {
  EC = "ec",
  RSA = "rsa",
}

export interface SignatureDevice {
  id: string;
  algorithm: AlgorithmEnum;
  label?: string;
  publicKey?: string;
  privateKey?: string;
  signatureCounter: number;
  lastSignature?: string;
}

export interface CreateSignatureDeviceRequest {
  id: string;
  algorithm: AlgorithmEnum;
  label?: string;
}

export interface CreateSignatureDeviceResponse {
  id: string;
  publicKey: string;
}

export interface SignatureResponse {
  signature: string;
  signedData: string;
}
