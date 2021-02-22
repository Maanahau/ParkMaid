const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const config  = require('./config.json');
const database = require('./resources/database.js');

const client = new CommandoClient({
    commandPrefix: '?',
    owner: `${config.OWNER_ID}`,
    nonCommandEditable: false,
    commandEditableDuration: 0,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'admin'],
		['karaoke', 'karaoke'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
        unknownCommand: false,
        eval_: false,
    })
	.registerCommandsIn(path.join(__dirname, 'commands'));


    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}.`);
        client.user.setActivity('Karaoke');
    });

client.on('error', console.error);
client.login(`${config.TOKEN}`);