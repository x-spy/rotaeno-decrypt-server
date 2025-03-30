import { Router, Request, Response } from 'express';
import { RedisClientType } from 'redis';
import { decryptFromRequest } from './utils.ts';

interface DecryptRequestData {
    'object-id': string;
    'save-data': string;
}

export default function routers(client: RedisClientType) {
    const router = Router();

    // Handler of Decrypt
    async function handler(req: Request, res: Response, save: boolean) {
        const body = req.body as DecryptRequestData;
        const objectID = body?.['object-id'];
        const saveData = body?.['save-data'];

        if (!objectID || !saveData) {
            return res.status(400).json({ error: 'Missing object-id or save-data' });
        } else if (objectID.length !== 24 || !objectID.startsWith('6')) {
            return res.status(400).json({ error: 'Invalid object-id, please check' });
        }

        try {
            const decryptedData = decryptFromRequest(objectID, saveData);
            const result = decryptedData.toString('utf8');

            if (save) {
                await client.set(objectID, result);
                console.log(`Game data saved for objectID = ${objectID}`);
            }

            return res.status(200).send(result);
        } catch (error) {
            console.error('Decrypt error:', error);
            return res.status(500).json({ error: 'Internal Error, please contact administrator' });
        }
    }

    router.post('/decryptGameData', (req, res) => handler(req, res, false));
    router.post('/decryptAndSaveGameData', (req, res) => handler(req, res, true));

    router.get('/getGameData', async (req, res) => {
        const objectID = req.query['object-id'];
        if (!objectID || typeof objectID !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid object-id' });
        }
        if (objectID.length !== 24 || !objectID.startsWith('6')) {
            return res.status(400).json({ error: 'Invalid object-id, please check' });
        }

        try {
            const gameData = await client.get(objectID);
            if (!gameData) {
                return res.status(404).json({ error: 'No data found for this object-id' });
            }
            console.log(`Got game data for objectID = ${objectID}`);
            return res.status(200).send(gameData);
        } catch (err) {
            console.error('Get data error:', err);
            return res.status(500).json({ error: 'Internal Error, please contact administrator' });
        }
    });

    return router;
}
