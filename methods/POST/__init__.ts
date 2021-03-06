import { http } from "adminhq";
import crypto from 'crypto';
import chunk from "../../modules/chunk";
import fetch from 'node-fetch';

const { Response: r } = http;

const jsonbase = 'https://jsonbase.com'

export default new http.Endpoint({
    path: '/',
    type: 'post',
    callback: async(req, res) => {
        if (!req.files) return;
        if (!(req.files instanceof Array)) return;
        const file = req.files[0];
        

        const uuid = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update(uuid + Date.now()).digest('hex');

        console.log(hash);

        const chunks = chunk(file.buffer, 90, (i) => console.log(`processing ${i} %`));
        const object = { chunks: chunks.length, format: file.originalname.slice(file.originalname.lastIndexOf('.')) };

        await post(JSON.stringify(object), `${hash}/main`);


        for (let i = 0; i < chunks.length; i++) {
            await post(chunks[i], `${hash}/${i}`);
            console.log(`uploaded ${(i * 100 / chunks.length).toFixed(1)}`)
        }

        res.status(r.status.OK).send(r.success({
            // @ts-ignore
            message: { id: hash, payload: object },
        }))
    }
})


async function post(data: Buffer | string, endpoint: string) {
    data = typeof data === 'string' ? data : data.toString('base64');
    await fetch(`${jsonbase}/${endpoint}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({ data: data })
    }).catch(console.error);
}