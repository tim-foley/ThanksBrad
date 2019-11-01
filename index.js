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
    
    
    if (typeof event.text === 'string' && event.text.indexOf(brad) > -1) {
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
    const eventText = event.text.toLowerCase().replace(/[ \'\"]/g, '');
    
    const IS_THANKS_MESSAGE = [
        'thanks',
        'thx',
        'thankyou'
    ].find(phrase => eventText.indexOf(phrase) > -1);

    const IS_DONUTS_MESSAGE = [
        'donuts',
        'doughnuts'
    ].find(phrase => eventText.indexOf(phrase) > -1);

    const IS_BACON_MESSAGE = [
        'bacon'
    ].find(phrase => eventText.indexOf(phrase) > -1);
    
    const IS_BYE_MESSAGE = [
        'bye',
	'timetoleave',
	'timetogo'	
    ].find(phrase => eventText.indexOf(phrase) > -1);    
    
    const IS_BRAD_FACT = [
        'fact',
	'faq',
	'capybara'
    ].find(phrase => eventText.indexOf(phrase) > -1);    
    
    const IS_BRAD_WRATH = [
	'autobots',
	'rollout!',
	'optimus',
	'prime',
	'transformers',
	'megatron',
	'cybertron',
	'allspark',
	'decepticons'
    ].find(phrase => eventText.indexOf(phrase) > -1);    
	
    let listToUse;
    const BRAD_BOT_ABUSE  = [
        'Cool it now, I have other things to do besides receive your praise,',
        'Ok, this has been fun, but you should probably get back to work now,',
        'I heard you the first time, Jeeze!',
        `Keep this up and you'll burn through my free Heroku plan!`,
        'Stop talking to me', 
	'Seriously, stop talking'
    ];
	
    const SPENCER_MESSAGES = [
        'Just doing your job',
        'Even you could have done that',
        'Thanks, I sacrificed many lives for it',
        'Thanks, but I prefer not to be noticed for my intellectual superiority',
        `Give me a pen and I'll give you my autograph`,
        'Why',
        ':expressionless:',
        ':fp:',
        'Did somebody forget to feed the',
        'Could someone please take care of',
        'Did you actually pay for that haircut',
        'I thought that the judge also said that you could not talk to me',
        'Did you dress in the dark today',
        'Oh, are you still here', 
	'You should have worn the brown pants today',
        'Dude. Deodorant.',
        'Anyone else smell that? Wait... it is just'       
    ];
    const BYE_MESSAGES = [
        'Bye',
        'Laters',
        'Peace out',
        'I\'m out',
        'Toodles',
        'TTFN',
        'Sayonara',
        'Aloha',
        'Fare thee well',
        'Arrivederci',
        'Da Svedanya',
        'Adios',
        'Byeeeeeeeeeee',
        'Live long and prosper',
        'Bye Felicia, I mean',
        `I'm out`,
        'Autobots! Roll out!',
        'Freedom is the right of all sentient beings',
        'Until I return I\'m leaving you in command. I know you won\’t let me down',
        'This universe, no matter how vast will never be big enough for you and I to coexist',
        'Above all, do not lament my absence, for in my spark, I know that this is not the end, but merely a new beginning. Simply put, another transformation',
        'It\’s been an honor serving with you',
        `Job's done.`,
	'May the Force be with you'	    
    ];
    const THANKS_MESSAGES = [
        `You're welcome`,
        'No problem',
        'Much appreciated',
        `All in a day's work`,
        'I appreciate you,',
        'No problemo,',
        'Happy to help,',
        'Easy peasy,',
        'Easy peasy lemon squeezy,',
        'My pleasure,',
        'You got it,',
        'You got it, dude',
        `Don't mention it,`,
        'Not a problem',
        'It was nothing,',
        `I'm happy to help,`,
        'Anytime',
        'You got it,',
        'Oh, anytime',
        'It was the least I could do',
        'Think nothing of it,',
        'At your service,',
        'By all means,',
        'Anything for you,',
        'Glad I could help,',
        `It's my duty,`,
        'Glad to be of any assistance,',
        `It's all good,`,
        'Sure thing,',
        'No worries',
        'Helping is my business, and business is good!',
        'De nada',
        `Ain't no thang`
    ];

    const DONUT_MESSAGES = [
        'QT has great donuts',
        'Why not go to McDonalds for those donuts,',
        'I recommend finding donutless donuts,',
        'Donuts with sprinkles - hold the donut, sprinkles on the side,',
        'I also have a bag of just gluten, I can make some pretty decent keto doughnuts with it,',
        'I brought in some keto doughnuts, with extra gluten! Just for you,',
        'I bet you would love some Active donuts,',
        'Would you like a :fist: Hurtz Donut,',
        'DONUT TELL ME WHAT TO DO',
	`click here: https://lmgtfy.com/?q=worst+donuts+near+me&s=g`,
        'My tummy feels funny.'
    ];
      
    const BACON_MESSAGES = [
        'mmmm.... bacon!',
        'Did someone say bacon?',
        ':bacon:',
        ':alert_bacon:',
        `IT'S BACON!!!`,
	'Is it nice, my preciousss? Is it juicy? Is it scrumptiously crunchable?'
    ];
	
    const BRAD_FACTS = [
	'Like beavers, capybaras are strong swimmers.',
	'Capybara toes are partially webbed.',
	'Capybara fur is reddish to dark brown and is long and brittle.',
	'The largest rodent on Earth is the Capybara.',
	'Capybara are found throughout much of northern and central South America, though a small invasive population has been seen in Florida.',
	`Like other rodents, capybaras’ teeth grow continuously, and they wear them down by grazing on aquatic plants, grasses, and other plentiful plants.`,
	`Capybaras eat their own feces in the morning. That’s when their poo is protein rich from the high number of microbes digesting the previous day’s meals. Because the grasses they eat are so hard to digest, eating their waste essentially allows them to digest it twice.`,
	'Capybara are closely related to guinea pigs and rock cavies, and more distantly related to chinchillas and agouti.',
	`Capybara's pig-shaped bodies are adapted for life in bodies of water found in forests, seasonally flooded savannas, and wetlands.`,
	'Capybaras sleep very little, usually napping throughout the day and grazing into and through the night.',
	'Capybaras can stay underwater for up to five minutes at a time, according to the San Diego Zoo.',
	`The scientific name for capybara comes from Hydro chaeris, which means 'water hog' in Greek.`,
	`An Amazon tribe calls the capybara Kapiyva or 'master of the grasses' in their native language.`,
        `A type of "immortal" jellyfish is capable of cheating death indefinitely.`,
        'Octopuses have three hearts.',
        'Butterflies can taste with their feet.',
        'Cats and horses are highly susceptible to black widow venom, but dogs are relatively resistant. Sheep and rabbits are apparently immune.',
        'Sharks kill fewer than 10 people per year. Humans kill about 100 million sharks per year.',
        'Wild dolphins call each other by name.',
        'Young goats pick up accents from each other.',
        `Humpback whale songs spread like "cultural ripples from one population to another."`,
	'Tardigrades are extremely durable microscopic animals that exist all over Earth. They can survive any of the following: 300 degrees Fahrenheit (149 Celsius), -458 degrees F (-272 C), the vacuum of space, pressure six times stronger than the ocean floor and more than a decade without food.',
	'Horses use facial expressions to communicate with each other.',
	`Elephants have a specific alarm call that means "human."`,
	`Squirrels can't burp or vomit.`,
	'Less time separates the existence of humans and the tyrannosaurus rex than the T-rex and the stegosaurus.',
	`There's a place on Earth where seagulls prey on right whales.`,
	`Owls don't have eyeballs. They have eye tubes.`,
	'Animals with smaller bodies and faster metabolism see in slow motion.',
	`Dogs' sense of smell is about 100,000 times stronger than humans', but they have just one-sixth our number of taste buds.`,
	'The extinct colossus penguin stood as tall as LeBron James.',
	`Male gentoo and Adelie penguins "propose" to females by giving them a pebble.`,
	`Azara's owl monkeys are more monogamous than humans.`,
	`Barn owls are normally monogamous, but about 25 percent of mated pairs "divorce."`,
	'A group of parrots is known as a pandemonium.',
	'Polar bears have black skin.',
	'Reindeer eyeballs turn blue in winter to help them see at lower light levels.',
	'A human brain operates on about 15 watts.',
	'Warmer weather causes more turtles to be born female than male.',
	'African buffalo herds display voting behavior, in which individuals register their travel preference by standing up, looking in one direction and then lying back down. Only adult females can vote.',
	'If a honeybee keeps waggle dancing in favor of an unpopular nesting site, other workers headbutt her to help the colony reach a consensus.',
	'Honeybees can flap their wings 200 times every second.',
	'The claws of a mantis shrimp can accelerate as quickly as a .22-caliber bullet.',
	'A single strand of spider silk is thinner than a human hair, but also five times stronger than steel of the same width. A rope just 2 inches thick could reportedly stop a Boeing 747.',
	`A supercolony of invasive Argentine ants, known as the "California large," covers 560 miles of the U.S. West Coast. It's currently engaged in a turf war with a nearby supercolony in Mexico.`,
	'The recently discovered bone-house wasp stuffs the walls of its nest with dead ants.',
	'By eating pest insects, bats save the U.S. agriculture industry an estimated $3 billion per year.',
	'Fourteen new species of dancing frogs were discovered in 2014, raising the global number of known dancing-frog species to 24.',
	'A sea lion is the first nonhuman mammal with a proven ability to keep a beat.'
    ];
    const BRAD_WRATH = [
	'I hate you',
	'Shut it',
	'Shut your pie hole'
	'You did NOT just say that',
	`I can't believe you just said that`,
	'Are you trying to annoy me',
	'May your headphones snag on every door handle',
	`May you press 'A' too hastily and be forced to speak with the nurse at the Pokemon Center all over again`,
	'May you forever feel your cell phone vibrating in the pocket it is not even in',
	'May the chocolate chips in your cookies always turn out to be raisins',
	`May your tea be too hot when you receive it, and too cold by the time you remember it's there`,
	'May your chair product a sound similar to a fart, but only once, such that you cannot reproduce it to prove that it was tjust the chair',
	'May you never be quite certain as to whether that pressure is a fart or a poop',
	'May the hair on your toes never fall out!'
    ];
	
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
    else if (IS_BACON_MESSAGE) {
        listToUse = BACON_MESSAGES;
    }
    else if (IS_BYE_MESSAGE) {
        listToUse = BYE_MESSAGES;   
    }
    else if (IS_BRAD_FACT) {
	listToUse = BRAD_FACTS;
    }
    else if (IS_BRAD_WRATH) {
	listToUse = BRAD_WRATH;
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
