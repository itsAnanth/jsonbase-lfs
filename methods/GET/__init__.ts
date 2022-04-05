import { http } from "adminhq";
import fetch from 'node-fetch';
import { PassThrough } from 'stream';

export default new http.Endpoint({
    path: '/get',
    type: 'get',
    // @ts-ignore
    callback: async(req, res) => {
        const id = req.query.id;
        const jsonbase = 'https://jsonbase.com';

        const resp = await (await fetch(`${jsonbase}/${id}/main`)).json();

        if (!(resp && resp.data)) return res.send(http.Response.error({
            message: 'Document not found',
            code: http.Response.status.BAD_REQUEST
        }));

        resp.data = JSON.parse(resp.data);

        if (!resp.data.chunks)
            return res.send(http.Response.error({
                message: 'Malformed data',
                code: http.Response.status.BAD_REQUEST
            }));


        const len = parseInt(resp.data.chunks);
        const arr = [];

        for (let i = 0; i < len; i++) {
            let temp = await (await fetch(`${jsonbase}/${id}/${i}`)).json();
            const buf = Buffer.from(temp.data, 'base64');
            arr.push(buf);
        }


  
        const stream = new PassThrough();
        stream.end(Buffer.concat(arr));

        res.set('Content-disposition', `attachment; filename=file${resp.data.format}`);
        // res.set('Content-Type', 'text/plain');

        // res.status(http.Response.status.OK).send(http.Response.success({
        //     message: 'success'
        // }));

        stream.pipe(res);


    }
})