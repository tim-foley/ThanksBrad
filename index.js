const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodeCache = require('node-cache');
const stdTTL = 30;
const myCache = new nodeCache({stdTTL, checkperiod: 60});

const app = express();

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
    
    
    if (typeof event.text === 'string' && IS_ACCEPTABLE_PHRASE && event.text.indexOf(brad) > -1) {
        messageAsBrad(body.token, event, (err, result) => {
            res.status(200).send({err: err, result: result});
            return;
        });

    }
    else{
        res.status(200).send('OK')
    }

})

function messageAsBrad(token, event, cb) {
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
        let userMessageCount = myCache.get(event.user);
        const numMessages = userMessageCount ? userMessageCount + 1 : 1;
        myCache.set(event.user, numMessages);

        cb(null, result)
    })
}

function determineMessage(event){
    const eventText = event.text.replace(/[ \'\"]/g, '');
    const IS_THANKS_MESSAGE = [
        'thanks',
        'thankyou',
    ].find(phrase => event.text.toLowerCase().indexOf(eventText) > -1);

    const IS_DONUTS_MESSAGE = [
        'donuts'
    ].find(phrase => event.text.toLowerCase().indexOf(eventText) > -1);

    let listToUse;
    const BRAD_BOT_ABUSE  = [
        'Cool it now, I have other things to do besides receive your praise,',
        'Ok, this has been fun, but you should probably get back to work now,',
        'I heard you the first time, Jeeze!',
        'Keep this up and you\'ll burn through my free Heroku plan!',
    ];
    const SPENCER_MESSAGES = [
        `Just doing your job`,
        `Even you could have done that`,
        `Thanks, I sacrificed many lives for it`,
        `Thanks, but I prefer not to be noticed for my intellectual superiority`,
        `Give me a pen and I'll give you my autograph`,
        `Why`,
        `:expressionless:`,
        ':fp:',
        'Did somebody forget to feed the',
        'Could someone please take care of',
    ];
    const THANKS_MESSAGES = [
        `You're welcome`,
        'No problem',
        'Much appreciated',
        `All in a day's work`,
        'I appreciate you,',
        `No problemo,`,
        `Happy to help,`,
        `Easy peasy,`,
        'Easy peasy lemon squeezy,',
        `My pleasure,`,
        'You got it,',
        'You got it, dude',
        `Don't mention it,`,
        `Not a problem`,
        `It was nothing,`,
        `I'm happy to help,`,
        `Anytime`,
        `You got it,`,
        `Oh, anytime`,
        `It was the least I could do`,
        `Think nothing of it,`,
        `At your service,`,
        `By all means,`,
        `Anything for you,`,
        `Glad I could help,`,
        `It's my duty,`,
        `Glad to be of any assistance,`,
        `It's all good,`,
        `Sure thing,`,
        `No worries`,
        'Helping is my business, and business is good!',
        'De nada',
        'Ain\'t no thang',
    ];

    const DONUT_MESSAGES = [
        `QT has great donuts `,
        `Why not go to McDonalds for those donuts `,
        `I recommend finding donutless donuts `,
        'Donuts with sprinkles - hold the donut, sprinkles on the side ',
        'I also have a bag of just gluten, I can make some pretty decent keto doughnuts with it '
    ]
      
    if (bradAbuseDetected(event.user)){
        listToUse = BRAD_BOT_ABUSE;
    }

    else if (IS_THANKS_MESSAGE){
        if (event.user.indexOf('U2TV91VSA') > -1){
            listToUse = SPENCER_MESSAGES;
        }
        else{
            listToUse = THANKS_MESSAGES;
        }
    }
    else if (IS_DONUTS_MESSAGE){
        listToUse = DONUT_MESSAGES;
    }
    

    return listToUse[Math.floor(Math.random() * listToUse.length)];
}

function bradAbuseDetected(user){
    const userMessageCount = myCache.get(user);
    if (userMessageCount && userMessageCount >= 3){
        return true;
    }
    return false;
}

app.listen(process.env.PORT || 4747, () => console.log('Server is live and good'));
