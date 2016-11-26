if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

const Botkit = require('botkit'),
      os = require('os');

const controller = Botkit.slackbot({
    debug: false
});

const channel = 'bot-tests';

const bot = controller.spawn({
    token: process.env.token
}).startRTM();

// bot.say({
//     text: 'QUACK! I\'M ALIVE! QUACK!',
//     channel: channel
// });

controller.hears(['hello'],['direct_message','direct_mention','mention'], (bot,message) => {
  bot.reply(message,'Quack.');
});

controller.hears(['joke'],['direct_message','direct_mention','mention'], (bot,message) => {
  tellDuckJoke(message);
});

function getRandomResponse(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function tellDuckJoke(message) {
  const jokes = [
    {
      q: 'At what time does a duck wake up?',
      a: 'At the quack of dawn!'
    },
    {
      q: 'What do ducks get after they eat?',
      a: 'A bill!'
    },
    {
      q: 'What do you call a crate full of ducks?',
      a: 'A box of quackers!'
    },
    {
      q: 'Who stole the soap?',
      a: 'The robber ducky!'
    },
    {
      q: 'What\'s another name for a clever duck?',
      a: 'A wise quacker!'
    },
    {
      q: 'What says "Quick, Quick!"?',
      a: 'A duck with the hiccups!'
    },
    {
      q: 'Why do ducks watch the news?',
      a: 'For the feather forecast!'
    },
    {
      q: 'What has webbed feet and fangs?',
      a: 'Count Duckula!'
    },
    {
      q: 'Where did the duck go when he was sick?',
      a: 'To the Ducktor!'
    }

  ];
  const acks = [
    'That sounds fun. Check this one out...',
    'Sure. I am only around for your amusement anyways...',
    'Oooh, I heard this one recently from my buddy, Donald Mallardson. It kills...'
  ];
  const followUps = [
    'QUACK! QUACK! QUACK! (duck laughter)'
  ];
  const joke = getRandomResponse(jokes),
        ack = getRandomResponse(acks),
        follow = getRandomResponse(followUps);

  bot.reply(message, ack + ' ' + joke.q);
  setTimeout( () => {
    bot.reply(message, joke.a);
    setTimeout(()=>{
      bot.reply(message, follow);
    },500);
  }, 8000);
}
