# Rotaeno Decrypt Server

**Rotaeno Decrypt Server** is an API server decrypting Rotaeno local storage data.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/x-spy/rotaeno-decrypt-server
   cd rotaeno-decrypt-server

2. **Install Dependencies**
    ```bash
   npm install
   
3. **Configuration**
- Redis
    ```ts
    const redisClient = createClient({
        username: 'default', // Redis Username
        password: '***', // Redis Password
        socket: {
            // Redis Host Info
            host: '***',
            port: 11451,
        },
    });
   ```
- TLS
    ```ts
    // Private Key File
    const privateKey = fs.readFileSync(
        path.join(__dirname, '../cert', 'server.key'),
        'utf8'
    );
    
    // Certificate File
    const certificate = fs.readFileSync(
        path.join(__dirname, '../cert', 'server.crt'),
        'utf8'
    );
  ```

## Run
```bash
  npm run server
```