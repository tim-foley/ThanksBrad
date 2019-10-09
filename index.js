const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
let inMemCache = {}

const bradOnEachTeam = {
    'TDJ8STMFE': 'UJT4QPQ90',
    'T2TJSK16K': 'UGACR0GE4'
};

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

function thankBrad(token, event, cb) {
    if (typeof event !== 'object') return cb();

    
    const body = JSON.stringify({
        channel: event.channel,
        text: `${determineMessage(event)} <@${event.user}>!`,
        thread_ts: event.thread_ts || undefined
    })

    request.post('https://slack.com/api/chat.postMessage', { 
        body, 
        headers: {
        'Authorization': `Bearer ${process.env.TOKEN}`,
        'Content-Type': 'application/json' } 
    }, (err, result) => {
        if (err) {
            cb(err);
            return;
        }
        cb(null, result)
    })
}

function determineMessage(event){
    let listToUse;
    const BRAD_BOT_ABUSE  = [

    ];
    const SPENCER_MESSAGES = [
        `Just doing your job`,
        `Even you could have done that`,
        `Thanks, I sacrificed many lives for it`,
        `Thanks, but I prefer not to be noticed for my intellectual superiority`,
        `Give me a pen and I'll give you my autograph`,
        `Why`
    ];

    const THANKS_MESSAGES = [
        `You're welcome`,
        'No problem',
        'Much appreciated',
        `All in a day's work`,
        'I appreciate you, ',
        `No problemo, `,
        `Happy to help, `,
        `Easy peasy, `,
        `My pleasure, `,
        'You got it, ',
        `Don't mention it, `,
        `Not a problem`,
        `It was nothing, `,
        `I'm happy to help, `,
        `Anytime `,
        `You got it, `,
        `Oh, anytime `,
        `It was the least I could do `,
        `Think nothing of it, `,
        `At your service, `,
        `By all means, `,
        `Anything for you, `,
        `Glad I could help, `,
        `It's my duty, `,
        `Glad to be of any assistance, `,
        `It's all good, `, 
        `Sure thing, `,
        `No worries `,
    ];
      
    if (bradAbuseDetected()){
        listToUse = BRAD_BOT_ABUSE;
    }
    else if (event.user.indexOf('U2TV91VSA') > -1){
        listToUse = SPENCER_MESSAGES;
    }
    else{
        listToUse = THANKS_MESSAGES;
    }

    return listToUse[Math.floor(Math.random() * listToUse.length)];
}

function bradAbuseDetected(){
    return false;
}

app.listen(process.env.PORT || 4747, () => console.log('Server is live and good'));
