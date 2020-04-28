const Discord = require('discord.js');
const fetch = require('node-fetch');

function help(message) {

	const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Here are some commands to give FrankBot')
	.addFields(
		{ name: '!help', value: 'To bring up this menu again.'},
		{ name: '@FrankBot Can I have a drink/smoke more/keep drinking? etc?', value: 'It will give you a qualified answer.'},
		{ name: '!drinkwith (ingredient)', value: 'Give me a single ingredient and I\'ll find a random drink recpie to make.'},
		{ name: '!roll', value: 'Role a a single die. 1 to 6.'},
		{ name: '!server', value: 'Get server info.'},

		)
	message.channel.send(exampleEmbed);
};

function checkToSmokeMore(message) {
	let messageContent = message.content.toLowerCase();

	const ingulgentQueries = [
		'have a drink',
		'drink more',
		'drink yet',
		'get drunk',
		'have a beer',
		'drink a beer',
		'keep drinking',
		'start drinking',
		'start smoking',
		'get stoned',
		'smoke more',
		'smoke yet',
		'smoking yet',
		'get high'
	];

	const affermativeMessages = [
		'Yes, you definately should',
		'Yes!',
		'You should libate',
		'Most dfinately',
		'I don\'t see why not',
		'Next question please',
		'Is the hypotenuse the longest side of a triangle?',
		'Affirmative',
		'Is Nate super gay?',
		'I think Sean would approve',
		'I think Sean would approve',
		'I think Sean would approve',
		'Is a frog\'s ass watertight?'
	];

	let randomAffermativeAnswer = affermativeMessages[Math.floor(Math.random() * affermativeMessages.length)];

	ingulgentQueries.forEach(element => {

		if (messageContent.includes(element)) {

			return message.channel.send(randomAffermativeAnswer);
		};

	});
}


function serverInfo(message) {

	message.guild.members.fetch().then(fetchedMembers => {
		const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
		message.channel.send(`There are currently ${totalOnline.size} members online in this guild out of ${fetchedMembers.size}`);
	});

	return message.channel.send(
		`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nEnvironment: ${process.env.NODE_ENV}\nBot uptime: https://stats.uptimerobot.com/2G0OZTkVwB
	`);
}


function rollDice(message) {
	return message.channel.send(`:game_die: ${Math.floor(Math.random() * 6) + 1}`);
}

function getRandomDrink(args, message) {
	if (!args.length) {
		return message.channel.send(`You didn't provide any ingredients, ...bitch ass ${message.author}!`);
	}

	message.channel.send(`Okay ${message.author}...thinking of a drink made with....${args}.`);

	fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${args}`)
		.then(response => response.json()
		.catch(err => message.channel.send(`Sorry we don\'t have any drinks with ${args}. Try another ingredient with no spaces.`))
		.then(getDrinks));

	function getDrinks(response) {
		if (response.drinks && response.drinks.length) {
			let pickRandomNumber = Math.floor(Math.random() * response.drinks.length);
			let drink = response.drinks[pickRandomNumber]
			let embed = new Discord.MessageEmbed();
	
			message.channel.send(`We have ${response.drinks.length} possible ${args} recipes and yours is...**${drink.strDrink}**`);
			message.channel.send(embed.setImage(`${drink.strDrinkThumb}`));
			getIngredients(drink)
		}
	};

	function getIngredients(drink) {
		fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`)
			.then(response => response.json()
			.then(renderIngredients));
	};

	function renderIngredients(response) {
		response.drinks.forEach(drink => {
			message.channel.send(drink.strInstructions);

			const drinkEntries = Object.entries(drink),
				ingredientsArray = drinkEntries
					.filter(([key, value]) => key.startsWith("strIngredient") && value && value.trim())
					.map(([key, value]) => value),
				measuresArray = drinkEntries
					.filter(([key, value]) => key.startsWith("strMeasure") && value && value.trim())
					.map(([key, value]) => value);

			message.channel.send(`Ingredients: ${ingredientsArray}, Measures: ${measuresArray}`);
		});
	}
};

module.exports = {
    help,
    checkToSmokeMore,
    serverInfo,
    rollDice,
    getRandomDrink

};