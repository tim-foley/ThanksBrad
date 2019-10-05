const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const brad = 'UJT4QPQ90'
const request = require('request');

function thankBrad(token, event, cb) {
    if (typeof event !== 'object') return cb();

    const THANKS_MESSAGES = [
        'Thanks',
        'Salutations',
        'Much appreciated',
        'Thank you',
        'I appreciate you, '

    ]
    console.log('TOKEN', process.env.TOKEN)
    const body = JSON.stringify({
        token: process.env.TOKEN,
        channel: event.channel,
        text: `${THANKS_MESSAGES[Math.floor(Math.random() * THANKS_MESSAGES.length)]} <${event.user}>!`,
        thread_ts: event.thread_ts || undefined
    })
    console.log('body', body)
    request.post('https://slack.com/api/chat.postMessage', { body }, (err, result) => {
        if (err) {
            console.error('AN ERROR OCCURRED', err);
            cb(err);
            return;
        }
        cb(null, result)
        console.log('result', result.body)
    })
}


app.use(bodyParser());
app.post('/', function (req, res) {
    const body = req.body;
    if (!body) {
        res.status(200).send({});
        return;
    }
    if (body && body.type === 'url_verification') {
        res.status(200).send({ challenge: body.challenge });
        return;
    }
    console.log('my bot payload', body);
    const event = body ? body.event : null;
    console.log('text type', typeof event.text);
    console.log('isitbrad', event.text.indexOf(brad) > -1)

    if (typeof event.text === 'string' && event.text.indexOf(brad) > -1) {
        thankBrad(body.token, event, (err, result) => {
            res.status(200).send({err: err, result: result});
            return;
        });
        
    }
    else{
        res.status(200).send('OK')
    }
    
})

app.listen(process.env.PORT || 4747, () => console.log('Server is live and good'));