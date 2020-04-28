const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const prefix = process.env.PREFIX;
const botCommands = require('./methods/botCommands');
const keepUptime = require('./methods/keepGlitchServerUptime');
keepUptime;

client.once('ready', () => {
	console.log('Frank Bot is ONLINE!');
});

client.on('message', message => {

	if (message.content.includes('703028698214957147')) {
		botCommands.checkToSmokeMore(message);
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ /);
	const command = args.shift().toLowerCase();

	if (command === 'help') {
		botCommands.help(message);
	}

	if (command === 'server') {
		botCommands.serverInfo(message);
	}

	if (command === 'roll') {
		botCommands.rollDice(message)
	}

	if (command === 'drinkwith') {
		botCommands.getRandomDrink(args, message);
	}
});

client.login();