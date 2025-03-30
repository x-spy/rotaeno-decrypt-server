import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import routers from './routers.ts';
import * as https from "node:https";
import * as fs from "node:fs";
import path from "node:path";

(async () => {

    // Redis
    const redisClient = createClient({
        username: 'default',
        password: '***',
        socket: {
            host: '***',
            port: 11451,
        },
    });

    redisClient.on('error', (err: any) => {
        console.error('Redis Client Error: ', err);
    });
    await redisClient.connect();
    console.log('Redis Connected');

    // Express
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));

    // Routers
    app.use('/', routers(redisClient));

    // Run HTTP
    const PORT = 8880;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Run HTTPS
    const privateKey = fs.readFileSync(
        path.join(__dirname, '../cert', 'server.key'),
        'utf8'
    );
    const certificate = fs.readFileSync(
        path.join(__dirname, '../cert', 'server.crt'),
        'utf8'
    );

    const httpsOptions = {
        key: privateKey,
        cert: certificate,
    };

    const HTTPS_PORT = 443;
    const httpsServer = https.createServer(httpsOptions, app);

    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server is running on https://localhost:${HTTPS_PORT}`);
    });

})();
