const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodeCache = require('node-cache');
const stdTTL = 30;
const myCache = new nodeCache({stdTTL, checkperiod: 60});

const app = express();

const timOnEachTeam = {
  'TDJ8STMFE': 'U2U3DH06N',
  'T2TJSK16K': 'U2U3DH06N'
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
  let tim = timOnEachTeam[event.team];
    
  if (typeof event.text === 'string' && event.text.indexOf(tim) > -1) {
    messageAsTim(body.token, event, (err, result) => {
      res.status(200).send({err: err, result: result});
      return;
    });

  }
  else {
    res.status(200).send('OK')
  }

})

function messageAsTim(token, event, cb) {
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
    
    const IS_THAT_A_FACT = [
	'areyousure',
	'isthattrue',
	'idontbelieveyou'    
    ].find(phrase => eventText.indexOf(phrase) > -1);   
    
	const IS_CAPYBARA_FACT = [
	 'capybara'
	].find(phrase => eventText.indexOf(phrase) > -1);   
	
    const IS_BRAD_FACT = [
	'fact',
	'faq'
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
	'decepticons',
	'bumblebee'
    ].find(phrase => eventText.indexOf(phrase) > -1);    
    
    const ARE_PET_PEEVES = [
	'peeve',
	'annoys',
	'bothers'		
    ].find(phrase => eventText.indexOf(phrase) > -1);    
	
    const IS_TELL_JOKE = [
	'tellmeajoke',
	'knockknock',
	'knowanyjokes'
    ].find(phrase => eventText.indexOf(phrase) > -1);  
	
    const IS_WHOS_THERE = [
	'whosthere',
	'whoisthere',
	'whosethere',
	'whobethere'
    ].find(phrase => eventText.indexOf(phrase) > -1); 
	
    const IS_TRUTH = [
    	'truths',
	'wisdom',
	'sayings',
	'potato'
    ].find(phrase => eventText.indexOf(phrase) > -1); 
	
    let listToUse;
    const BRAD_BOT_ABUSE  = [
	'Cool it now, I have other things to do besides receive your praise,',
	'Ok, this has been fun, but you should probably get back to work now,',
	'I heard you the first time, Jeeze!',
	`Keep this up and you'll burn through my free Heroku plan!`,
	'Stop talking to me', 
	'Seriously, stop talking',
	`Here are the latest rain forest test results: "You are a horrible person." That's what it says: a horrible person. We weren't even testing for that.`,
	`Okay, look; we both said a lot of things you're going to regret, but I think we can put our difference behind us. For science. You monster.`
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
        'Anyone else smell that? Wait... it is just',
	'I hate you',
	'Shut it',
	'Shut your pie hole',
	'You did NOT just say that',
	`I can't believe you just said that`,
	'Are you trying to annoy me',
	'May your headphones snag on every door handle',
	`May you press 'A' too hastily and be forced to speak with the nurse at the Pokemon Center all over again`,
	'May you forever feel your cell phone vibrating in the pocket it is not even in',
	'May the chocolate chips in your cookies always turn out to be raisins',
	`May your tea be too hot when you receive it, and too cold by the time you remember it's there`,
	'May your chair product a sound similar to a fart, but only once, such that you cannot reproduce it to prove that it was just the chair',
	'May you never be quite certain as to whether that pressure is a fart or a poop',
	`It says so right here in your personnel file: Unlikable. Liked by no one. A bitter, unlikable loner who's passing shall not be mourned.`,
	`I don't want to tell you you're business, but if I were you, I'd leave me alone.` 		
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
    
    const TRUTH_MESSAGES = [
	`You're the only one holding yourself back`,
	'The world owes you absolutely nothing',
	`Investing in yourself isn't selfish`,
	`What other people think of you really doesn't matter`,
	`You don't have to please everyone`,
	`Comparing your Chapter 1 with someone else's Chapter 9 is pure stupidity`,
	`There's another way.  There always is`,
	'A negative opinion always hits harder than a positive one',
	'Your ideas are useless if not implemented',
	`It's not what you say, It's what they hear`,
	`Good enough isn't good enough if it can be better`,
	`Try a little harder.  You'll be glad you did`,
	'Failure is a chance to restart',
	`Most of the time the people who talk about how hard they work don't actually work that hard`,
	`Just because you're busy doesn't mean you're accomplishing something`,
	'The world is full of idiots who think they are geniuses',
	`You're unique.  Just like everyone else`,
	`You're ridiculously average, at best`,
	'You know a lot less than what you think you do',
	'You cannot control lige, but you can change the way you see life',
	'Life will not be perfect',
	`Most of us don't know how to say 'No'`,
	'People will hate you for no reason',
	'Nobody is actually too busy to respond to you',
	`People won't always be nice to you`,
	'Your friends will talk behind your back at times',
	'People will use you',
	'We always tend to find a person to blame no matter what',
	`The life you're living right now is a dream for many people`,
	'Money can buy happiness',
	'Some people are just not meant to stay in your life, no matter how bad you want them to',
	`You'll find many people together, but not in love.  You'll find many people in love, but not together`,
	'Life of other will continue without you',
	'Life is a solo trip with lots of visitors',
	'Nobody really cares about how difficult your life is',
	'Your actions define you, not your thoughts',
	'We spend time worrying about the losses and not about the gains we have',
	'Almost no one practices what they preach',
	`You don't have to wait for an apology to forgive`,
	'One day everything will end',
	`Following rules doesn't always guarantee success`,
	'People ruin the happiness of other just because they cannnot find their own',
	'You rarely get a second chance',
	'You usually have to options. To stay or to dare',
	`Everyone's biased towards someone or something`,
	'People will always judge you'	
    ];
	
    const BACON_MESSAGES = [
        'mmmm.... bacon!',
        'Did someone say bacon?',
        ':bacon:',
        ':alert_bacon:',
        `IT'S BACON!!!`,
	'Is it nice, my preciousss? Is it juicy? Is it scrumptiously crunchable?'
    ];
    const CAPYBARA_FACTS = [
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
      	`An Amazon tribe calls the capybara Kapiyva or 'master of the grasses' in their native language.`
    ];
	
    const BRAD_FACTS = [
      	`A type of 'immortal' jellyfish is capable of cheating death indefinitely.`,
      	'Octopuses have three hearts.',
      	'Butterflies can taste with their feet.',
      	'Cats and horses are highly susceptible to black widow venom, but dogs are relatively resistant. Sheep and rabbits are apparently immune.',
      	'Sharks kill fewer than 10 people per year. Humans kill about 100 million sharks per year.',
      	'Wild dolphins call each other by name.',
      	'Young goats pick up accents from each other.',
      	`Humpback whale songs spread like 'cultural ripples from one population to another.'`,
      	'Tardigrades are extremely durable microscopic animals that exist all over Earth. They can survive any of the following: 300 degrees Fahrenheit (149 Celsius), -458 degrees F (-272 C), the vacuum of space, pressure six times stronger than the ocean floor and more than a decade without food.',
      	'Horses use facial expressions to communicate with each other.',
      	`Elephants have a specific alarm call that means 'human.'`,
      	`Squirrels can't burp or vomit.`,
      	'Less time separates the existence of humans and the tyrannosaurus rex than the T-rex and the stegosaurus.',
      	`There's a place on Earth where seagulls prey on right whales.`,
      	`Owls don't have eyeballs. They have eye tubes.`,
      	'Animals with smaller bodies and faster metabolism see in slow motion.',
      	`Dogs' sense of smell is about 100,000 times stronger than humans', but they have just one-sixth our number of taste buds.`,
      	'The extinct colossus penguin stood as tall as LeBron James.',
      	`Male gentoo and Adelie penguins 'propose' to females by giving them a pebble.`,
      	`Azara's owl monkeys are more monogamous than humans.`,
      	`Barn owls are normally monogamous, but about 25 percent of mated pairs 'divorce.'`,
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
      	`A supercolony of invasive Argentine ants, known as the 'California large', covers 560 miles of the U.S. West Coast. It's currently engaged in a turf war with a nearby supercolony in Mexico.`,
      	'The recently discovered bone-house wasp stuffs the walls of its nest with dead ants.',
      	'By eating pest insects, bats save the U.S. agriculture industry an estimated $3 billion per year.',
      	'Fourteen new species of dancing frogs were discovered in 2014, raising the global number of known dancing-frog species to 24.',
      	'A sea lion is the first nonhuman mammal with a proven ability to keep a beat.',
      	'Humans can survive underwater. But not for very long.',
    ];	
    const BRAD_WRATH = [
        'Autobots! Roll out!',
        'Freedom is the right of all sentient beings',
        `Until I return I'm leaving you in command. I know you won’t let me down`,
        'This universe, no matter how vast will never be big enough for you and I to coexist',
        'Above all, do not lament my absence, for in my spark, I know that this is not the end, but merely a new beginning. Simply put, another transformation',
        `It’s been an honor serving with you`
    ];
    const IS_THAT_A_FACT_MESSAGE = [
	'Do you doubt me?',
	'Google it.  I dare you.',
	'Prove me wrong.',
	'You dare question me?',
	'Oh geez. A non-believer...',
	`Of course it's true.`,
	'Would I lie to you',
	'Until you prove it otherwise',
	'It must be, I saw it on the interwebs this morning.',
	`Well, I'm not an expert on it, but I did stay at a Holiday Inn last night`,
	'Yes',
	'No',
	'Maybe',
	'Certainly',
	'Without a doubt',
	'Most likely',
	'Signs point to yes',
	'According to the prophesy, yes.',
	'Are you calling me a liar?'  
    ];
    const PET_PEVES_LIST = [
	'My pet peeve is people who clip their nails at work',
	'My pet peeve is people who chew loudly',
	'My pet peeve is people doing burpies by me',	
	'My pet peeve is people who pull in front of me only to slow down and turn - when they could have pulled in behind me!',
	`My pet peeve is people who don't use their turn signal`,
	`My pet peeve is people who start sentences with 'So...'`,
	`My pet peeve is people who talk loudly. I'm looking at you @cjweipert!`,
	'My pet peeve is people whose desks are filled with video game characters',
	'People who walk slowly or stop suddenly in the middle of the sidewalk',
	'People who block the aisle at the grocery store',
	'People who open the clear glass doors at the grocery store to see what is in the freezer!',
	'Being called Brian',
	'My pet peeve is being interrupted when having a conversation with someone',
	'My pet peeve is when people invite themselves in to a conversation I am having with someone else',	
	'My pet peeve is when whoever creates these responses sullies my name by leaving a typo in there.'
	];
    const TELL_JOKE = [
	'Ok, knock-knock',
	'Look in the mirror',
	'7 percent of all statistics are made up on the spot.',
	'A clear conscience is usually the sign of a bad memory.',
	'A conclusion is the place where you got tired of thinking.',
	'A conscience is what hurts when all your other parts feel so good.',
	`A cop stopped me for speeding. He said, “Why were you going so fast?” I said, “See this thing my foot is on? It’s called an accelerator. When you push down on it, it sends more gas to the engine. The whole car just takes right off. And see this thing? This steers it.”`,
	`A friend of mine once sent me a post card with a picture of the entire planet Earth taken from space. On the back it said, “Wish you were here.”`,
	`A lot of people are afraid of heights. Not me, I’m afraid of widths.`,
	'All those who believe in psychokinesis raise my hand.',
	'Ambition is a poor excuse for not having enough sense to be lazy.',
	'Bills travel through the mail at twice the speed of checks.',
	`Borrow money from pessimists-they don’t expect it back.`,
	'Change is inevitable….except from vending machines.',
	'Cross country skiing is great if you live in a small country.',
	'Dancing is a perpendicular expression of a horizontal desire.',
	`Doing a little work around the house. I put fake brick wallpaper over a real brick wall, just so I’d be the only one who knew. People come over and I’m gonna say, “Go ahead, touch it…it feels real.”`,
	`Drugs may lead to nowhere, but at least it’s the scenic route.`,
	`Eagles may soar, but weasels don’t get sucked into jet engines.`,
	`Everyone has a photographic memory. Some just don’t have film.`,
	`Experience is something you don’t get until just after you need it.`,
	'For every action, there is an equal and opposite criticism.',
	'Half the people you know are below average.',
	'Hard work pays off in the future. Laziness pays off now.',
	`How do you tell when you’re out of invisible ink?`,
	'I almost had a psychic girlfriend but she left me before we met.',
	`I bought a house, on a one-way dead-end road. I don’t know how I got there.`,
	'I bought a million lottery tickets. I won a dollar.',
	`I bought some powdered water, but I don’t know what to add to it.`,
	`I can remember the first time I had to go to sleep. Mom said, “Brad, time to go to sleep.” I said, “But I don’t know how.” She said, “It’s real easy. Just go down to the end of tired and hang a left.” So I went down to the end of tired, and just out of curiosity I hung a right. My mother was there, and she said “I thought I told you to go to sleep.”`,
	`I couldn’t repair your brakes, so I made your horn louder.`,
	'I eat swiss cheese from the inside out.',
	'I had amnesia once or twice.',
	`I hate it when my foot falls asleep during the day because that means it’s going to be up all night.`,
	`I have an answering machine in my car. It says, “I’m home now. But leave a message and I’ll call when I’m out.”`,
	'I intend to live forever – so far, so good.',
	`I love to go shopping. I love to freak out salespeople. They ask me if they can help me, and I say, “Have you got anything I’d like?” Then they ask me what size I need, and I say, “Extra medium.”`,
	`I planted some bird seed. A bird came up. Now I don’t know what to feed it.`,
	`I saw a bank that said “24 Hour Banking”, but I don’t have that much time.`,
	`I saw a sign: “Rest Area 25 Miles”. That’s pretty big. Some people must be really tired.`,
	`I saw a small bottle of cologne and asked if it was for sale. She said, “It’s free with purchase.” I asked her if anyone bought anything today.`,
	`I spilled spot remover on my dog. He’s gone now.`,
	'I took a course in speed waiting. Now I can wait an hour in only ten minutes.',
	'I used to have an open mind but my brains kept falling out.',
	`I used to work in a fire hydrant factory. You couldn’t park anywhere near the place.`,
	`I was going 70 miles an hour and got stopped by a cop who said, “Do you know the speed limit is 55 miles per hour?” “Yes, officer, but I wasn’t going to be out that long…”`,
	`I was in a job interview and I opened a book and started reading. Then I said to the guy, “Let me ask you a question. If you are in a spaceship that is traveling at the speed of light, and you turn on the headlights, does anything happen?” He said, “I don’t know.” I said, “I don’t want your job.”`,
	`I was sad because I had no shoes, until I met a man who had no feet. So I said, “Got any shoes you’re not using?”`,
	'I was trying to daydream, but my mind kept wandering.',
	`I went down the street to the 24-hour grocery. When I got there, the guy was locking the front door. I said, “Hey, the sign says you’re open 24 hours.” He said, “Yes, but not in a row.”`,
	`I went into this bar and sat down next to a pretty girl. She looked at me and said, “Hey, you have two different colored socks on.” I said, “Yeah, I know, but to me they’re the same because I go by thickness.”`,
	`I went to a 7-11 and asked for a 2×4 and a box of 3×5’s. The clerk said, “ten-four.”`,
	`I went to a fancy french restaurant called “Deja Vu.” The headwaiter said, “Don’t I know you?”`,
	`I went to a general store. They wouldn’t let me buy anything specifically.`,
	`I went to a restaurant that serves “breakfast at any time”. So I ordered French Toast during the Renaissance.`,
	`I went to the bank and asked to borrow a cup of money. They said, “What for?” I said, “I’m going to buy some sugar.”`,
	`I went to the hardware store and bought some used paint. It was in the shape of a house. I also bought some batteries, but they weren’t included.`,
	'I went to the museum where they had all the heads and arms from the statues that are in all the other museums.',
	'I woke up one morning, and all of my stuff had been stolen and replaced by exact duplicates.',
	`I worked in a health food store once. A guy came in and asked me, “If I melt dry ice, can I take a bath without getting wet?”`,
	`I wrote a song, but I can’t read music so I don’t know what it is. Every once in a while I’ll be listening to the radio and I say, “I think I might have written that.”`,
	`I’d kill for a Nobel Peace Prize.`,
	`If at first you don’t succeed, then skydiving definitely isn’t for you.`,
	'If Barbie is so popular, why do you have to buy her friends?',
	'If everything seems to be going well, you have obviously overlooked something.',
	'If you can wave a fan, and you can wave a club, can you wave a fan club?',
	`If you must choose between two evils, pick the one you’ve never tried before.`,
	'If you think nobody cares about you, try missing a couple of payments.',
	'If you were going to shoot a mime, would you use a silencer?',
	`If you write the word “monkey” a million times, do you start to think you’re Shakespeare?`,
	`If you’re not part of the solution, you’re part of the precipitate.`,
	'In my house on the ceilings I have paintings of the rooms above…so I never have to go upstairs.',
	'In school, every period ends with a bell. Every sentence ends with a period. Every crime ends with a sentence.',
	`It’s a small world, but I wouldn’t want to have to paint it.`,
	'Join the Army, meet interesting people, kill them.',
	'Many people quit looking for work when they find a job.',
	'Monday is an awful way to spend 1/7th of your life.',
	'My socks DO match. They’re the same thickness.',
	'My theory of evolution is that Darwin was adopted.',
	`Officer, I know I was going faster than 55MPH, but I wasn’t going to be on the road an hour.`,
	`OK, so what’s the speed of dark?`,
	'On the other hand, you have different fingers.',
	`One night I walked home very late and fell asleep in somebody’s satellite dish. My dreams were showing up on TV’s all over the world.`,
	`One time a cop pulled me over for running a stop sign. He said, “Didn’t you see the stop sign?” I said, “Yeah, but I don’t believe everything I read.”`,
	'Plan to be spontaneous tomorrow.',
	`Right now I’m having amnesia and deja vu at the same time.`,
	'Smoking cures weight problems…eventually.',
	`Someone sent me a postcard picture of the earth. On the back it said, “Wish you were here.”`,
	'Sponges grow in the ocean. That just kills me. I wonder how much deeper the ocean would be if that didn’t happen.',
	`Support bacteria – they’re the only culture some people have.`,
	'The early bird gets the worm, but the second mouse gets the cheese.',
	'The hardness of the butter is proportional to the softness of the bread.',
	`The judge asked, “What do you plead?” I said, “Insanity, your honor, who in their right mind would park in the passing lane?”`,
	'The problem with the gene pool is that there is no lifeguard.',
	'The severity of the itch is proportional to the reach.',
	`The sooner you fall behind, the more time you’ll have to catch up.`,
	'To steal ideas from one person is plagiarism; to steal from many is research.',
	`Today I dialed a wrong number… The other person said, “Hello?” and I said, “Hello, could I speak to Joey?”… They said, “Uh… I don’t think so…he’s only 2 months old.” I said, “I’ll wait.”`,
	'What a nice night for an evening.',
	'What happens if you get scared half to death twice?',
	`What’s another word for Thesaurus?`,
	`When everything is coming your way, you’re in the wrong lane.`,
	'Do you want to know how keep a moron in suspense?'    
    ];
    const WHOS_THERE = [
	'Seriously, you thought I was going to tell a knock knock joke?',
	`Shouldn't you be working?`,
	'You must really be desperate for something to do if you expect me to keep you entertained.',
	`"kNoCk KnOcK!" Durr!`    
    ];	    
    if (bradAbuseDetected(event.user)){
        listToUse = BRAD_BOT_ABUSE;
    }
    else if (IS_THANKS_MESSAGE){
        if ((event.user.indexOf('UGACR0GE4') > -1) || (event.user.indexOf('U9Z6ZMZPT') > -1)){
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
    else if (IS_THAT_A_FACT) {
	listToUse = IS_THAT_A_FACT_MESSAGE;
    } 
    else if (IS_CAPYBARA_FACT) {
	listToUse = CAPYBARA_FACTS;	
	}	
    else if (IS_TELL_JOKE) {
	listToUse = TELL_JOKE;
    }
    else if (ARE_PET_PEEVES) {
	listToUse = PET_PEVES_LIST;	
    }	
    else if (IS_WHOS_THERE) {
	listToUse = WHOS_THERE;
    }	    
    else if (IS_TRUTH) {
	listToUse = TRUTH_MESSAGES;
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