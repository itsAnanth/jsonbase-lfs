import { http } from "adminhq";
import crypto from 'crypto';
import chunk from "../../modules/chunk";
import fs from 'fs';
import fetch from 'node-fetch';

const jsonbase = 'https://jsonbase.com'

export default new http.Endpoint({
    path: '/',
    type: 'post',
    callback: async(req, _res) => {
        if (!req.files) return;
        if (!(req.files instanceof Array)) return;
        const file = req.files[0];
        

        const uuid = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update(uuid + Date.now()).digest('hex');

        console.log(hash);

        const chunks = chunk(file.buffer, 90, (i) => console.log(`processing ${i} %`));

        await post(chunks.length.toString(), `${hash}/main`);

        console.log(chunks.length);


        for (let i = 0; i < chunks.length; i++) {
            await post(chunks[i], `${hash}/${i}`);
            console.log(`uploaded ${(i * 100 / chunks.length).toFixed(1)}`)
        }

        console.log('finished');
        console.log(hash);

        // fs.writeFileSync(`./uploads/${uuid}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`, Buffer.concat(chunks))

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