import request from 'request';

export function apiProxy(req, res, next) {
    var options = {
        method: req.method,
        url: 'http://10.2.56.40:8080' + req.url,
        qs: req.query,
        headers:
            {
                'Cache-Control': 'no-cache'
            }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var options1 = {
            method: 'POST',
            url: 'http://10.2.56.40:8080/PacketMocker/GenCustomJson',
            headers:
                {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            form: { jsonstring: JSON.parse(body).Data }
        };
        request(options1, function (error1, response1, body1) {
            if (error1) throw new Error(error1);
            return res.send(body1);
        });
    });
};
