const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bradOnEachTeam = {
    'TDJ8STMFE': 'UJT4QPQ90',
    'T2TJSK16K': ''
}
const request = require('request');

function thankBrad(token, event, cb) {
    if (typeof event !== 'object') return cb();

    const THANKS_MESSAGES = [
        `You're welcome`,
        'No problem',
        'Much appreciated',
        `All in a day's work`,
        'I appreciate you, '

    ]
    
    const body = JSON.stringify({
        channel: event.channel,
        text: `${THANKS_MESSAGES[Math.floor(Math.random() * THANKS_MESSAGES.length)]} <@${event.user}>!`,
        thread_ts: event.thread_ts || undefined
    })

    request.post('https://slack.com/api/chat.postMessage', { 
        body, 
        headers: {
        'Authorization': `Bearer ${process.env.TOKEN}`,
        'Content-Type': 'application/json' } 
    }, (err, result) => {
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
    console.log('body', body)
    const event = body ? body.event : null;
    let brad = bradOnEachTeam[event.team];
    if (typeof event.text === 'string' && event.text.toLowerCase().indexOf('thanks') > -1 && event.text.indexOf(brad) > -1) {
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