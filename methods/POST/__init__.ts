import { http } from "adminhq";
import crypto from 'crypto';
import chunk from "../../modules/chunk";
import fs from 'fs';

export default new http.Endpoint({
    path: '/',
    type: 'post',
    callback: async(req, _res) => {
        if (!req.files) return;
        if (!(req.files instanceof Array)) return;
        const file = req.files[0];

        const uuid = crypto.randomBytes(16).toString('hex');

        console.log(file.originalname)

        const chunks = chunk(file.buffer, 90, (i) => console.log(`processing ${i} %`));

        console.log(chunks.length);

        fs.writeFileSync(`./uploads/${uuid}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`, Buffer.concat(chunks))

    }
})