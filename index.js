const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');

app.use(compression({
    level: 9,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});
app.use(express.json());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, headers: true }));

// app.post('/player/login/dashboard', (req, res) => {
//     res.sendFile(__dirname + '/public/html/dashboard.html');
// });

// Route untuk login dashboard
app.post('/player/login/dashboard', (req, res) => {
    // Parsing data request
    const requestData = req.body;

    // Mengecek atau memproses data request
    console.log(requestData);

    // Mengirimkan file dashboard setelah login
    res.sendFile(__dirname + '/public/html/dashboard.html');
});

app.all('/player/growid/login/validate', (req, res) => {
    const _token = req.body._token;
    const tankIDName = req.body.tankIDName;
    const tankIDPass = req.body.tankIDPass;

    const token = Buffer.from(
        `_token=${_token}&tankID=${tankIDName}&tankIDPass=${tankIDPass}`,
    ).toString('base64');

    res.send(
        `{"status":"success","message":"Account Validated.","token":"${token}","url":"","accountType":"growtopia"}`,
    );
});

app.post('/player/validate/close', function (req, res) {
    res.send('<script>window.close();</script>');
});

app.get('/', function (req, res) {
    res.send('Login Function Is Connected!');
});

// app.get('/dashboard', (req, res) => {
//     res.sendFile(__dirname + '/public/html/dashboard.html');
// });

app.listen(5000, function () {
    console.log('Listening on port 5000');
});