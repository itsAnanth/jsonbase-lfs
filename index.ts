import { http } from 'adminhq';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(multer().any());



(async function () {
    const methods = [];
    const methodsPath = fs.readdirSync('./methods');

    if (methodsPath.length === 0)
        return console.log('[server]', `methods path is empty. skipping route register`);

    for (let i = 0; i < methodsPath.length; i++) {
        let method = methodsPath[i];
        let routesPath = fs.readdirSync(`./methods/${method}`);
        for (let j = 0; j < routesPath.length; j++) {
            let _filename = routesPath[j].slice(0, routesPath[j].lastIndexOf('.'));
            const _path = `./methods/${method}/${_filename}`;
            const route = (await import(`${_path}`)).default;

            if (!(route instanceof http.Endpoint)) {
                console.log('[server]', `at ${_path} expected type Enpoint got ${typeof route}`);
                continue;
            }

            methods.push(route);
        }
    }

    new http.Server(app, {
        PORT: Number(process.env.PORT) || 3000,
        methods: methods,
        autoHandle: true
    });
})()



