import request from 'request';

var childProcess = require('child_process');
var child = childProcess.fork('./backend/bin/child.js');

child.on('message', function(msg) {
    console.log(process.pid + "Main on message: ", msg);
});
child.send("I Love U");
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
            child.send("I love U");
            return res.send(body1);
        });
    });
};
