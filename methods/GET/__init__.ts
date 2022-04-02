import { http } from "adminhq";

export default new http.Endpoint({
    path: '/',
    type: 'get',
    callback: async(_req, res) => {
        res.send(http.Response.success({
            message: 'Reached server',
            code: http.Response.status.OK
        }))
    }
})