var request = require("request");

export default function apiProxy(req, res, next) {
    var options = {
        method: 'GET',
        url: 'http://10.2.56.40:8080/PacketMocker/GetJsonPacket',
        qs:
            {
                Version: '5',
                ServiceCode: '10001001',
                SystemCode: '17',
                ClientVersion: '711',
                Encoding: '3'
            },
        headers:
            {
                'Postman-Token': '92d22924-65c6-442d-9e15-eff21aa63e0d',
                'Cache-Control': 'no-cache'
            }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        return res.send(body);
        console.log(body);
    });
};