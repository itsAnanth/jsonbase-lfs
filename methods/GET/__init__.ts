import { http } from "adminhq";
import fetch from 'node-fetch';
import fs from 'fs';

export default new http.Endpoint({
    path: '/get',
    type: 'get',
    callback: async(req, res) => {
        const id = req.query.id;
        const jsonbase = 'https://jsonbase.com';

        const resp = await (await fetch(`${jsonbase}/${id}/main`)).json();

        const len = parseInt(resp.data);
        const arr = [];

        for (let i = 0; i < len; i++) {
            let temp = await (await fetch(`${jsonbase}/${id}/${i}`)).json();
            const buf = Buffer.from(temp.data, 'base64');
            arr.push(buf);
        }


        fs.writeFileSync(`./uploads/w.txt`, Buffer.concat(arr));


        //ebe7824c04265fe0b4f581ac7aa471ff8d94fb8907d3c7a1f33b6b603a69048a

        
        res.send(http.Response.success({
            message: 'Reached server',
            code: http.Response.status.OK
        }))
    }
})