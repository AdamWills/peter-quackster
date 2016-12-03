if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

const Botkit = require('botkit'),
      CronJob = require('cron').CronJob,
      jokes = require('./jokes.js');

const controller = Botkit.slackbot({
    debug: false
});

const bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['hello', 'good morning'],['direct_message','direct_mention','mention'], (bot,message) => {
  bot.reply(message,'Quack.');
});

controller.hears(['joke'],['direct_message','direct_mention','mention'], (bot,message) => {
  tellDuckJoke(message);
});

// Runs Mon, Tues, Thurs, Fri at 9:30:00 AM.
const standupReminder = new CronJob({
  cronTime: '00 30 9 * * 1,2,4,5',
  onTick: function() {
    bot.say({
      text: 'QUACK! It\'s time for your standup, folks! QUACK!',
      channel: 'dev'
    });
  },
  start: false,
  timeZone: 'America/Toronto'
});
standupReminder.start();

// Runs Thurs at 3:59:00 PM.
const wiretapReminder = new CronJob({
  cronTime: '00 59 15 * * 4',
  onTick: function() {
    bot.say({
      text: 'QUACK! It\'s time to tap some wires, folks! QUACK!',
      channel: 'dev'
    });
  },
  start: false,
  timeZone: 'America/Toronto'
});
wiretapReminder.start();

function getRandomResponse(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function tellDuckJoke(message) {
  const acks = [
          'That sounds fun. Check this one out...',
          'Sure. I am only around for your amusement anyways...',
          'Oooh, I heard this one recently from my buddy, Donald Mallardson. It kills...'
        ],
        followUps = [
          'QUACK! QUACK! QUACK! (duck laughter)'
        ],
        joke = getRandomResponse(jokes),
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
