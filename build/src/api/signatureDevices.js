import generateKeyPair from "../crypto/generation";
export async function signNewDevice(deviceId, algorithm, persistence, label) {
    if (!deviceId || deviceId.length < 1) {
        throw new Error("Device ID is required");
    }
    if (label && label.length > 50) {
        throw new Error("Label exceeds maximum length of 50 characters");
    }
    if (algorithm !== "ec" && algorithm !== "rsa") {
        throw new Error("Invalid algorithm");
    }
    const device = await persistence.get(deviceId);
    if (device) {
        // If device exists, return existing key maybe?
        // const keyPair = await generateKeyPair(algorithm);
        // await persistence.set({
        //   id: deviceId,
        //   algorithm,
        //   label,
        //   privateKey: keyPair.private,
        //   publicKey: keyPair.public,
        //   signatureCounter: device.signatureCounter,
        // });
        // const response: CreateSignatureDeviceResponse = {
        //   id: deviceId,
        //   publicKey: keyPair.public,
        // };
        // return response;
        throw new Error("Device already exists");
    }
    let keyPair = {};
    try {
        keyPair = await generateKeyPair(algorithm);
    }
    catch (e) {
        console.log(e);
        throw new Error("Error generating keypair");
    }
    try {
        await persistence.set({
            id: deviceId,
            algorithm,
            label,
            privateKey: keyPair.private,
            publicKey: keyPair.public,
            signatureCounter: 0,
        });
    }
    catch (e) {
        console.log(e);
        throw new Error("Error setting device in persistence layer");
    }
    return {
        id: deviceId,
        publicKey: keyPair.public,
    };
}
//# sourceMappingURL=signatureDevices.js.map