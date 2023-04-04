### Curl request for testing

- Creating a new Device:

```bash
curl -X POST \
  http://localhost:3000/signature-device \
  -H 'Content-Type: application/json' \
  -d '{
        "id": "1",
        "label": "test",
        "algorithm": "rsa"
      }'

curl -X POST \
  http://localhost:3000/signature-device \
  -H 'Content-Type: application/json' \
  -d '{
        "id": "2",
        "label": "test",
        "algorithm": "ec"
      }'
```

- Sign transaction

```bash
      curl -X POST http://localhost:3000/signTransaction/1  -H 'Content-Type: application/json'  -d '{ "data": "Hello, RSA!"}'
```

- List all devices

```bash
curl -X GET http://localhost:3000/signature-devices
```

- List specific device with ID

```bash
curl -X GET http://localhost:3000/signature-device/1
```
