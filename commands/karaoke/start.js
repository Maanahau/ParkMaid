const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: ['s'],
			group: 'karaoke_host',
			memberName: 'start',
			description: 'Start a new karaoke session.',
            guildOnly: true,
            argsPromptLimit: 0,
            throttling:{
                usages: 2,
                duration: 10,
            },
            validate: user => {
                if(user.bot) return false;
                return true;
            },
		});
	}

    run(message){
        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    return message.say('Another session is already in progress.');
                }
            }
        }
        //create new queue
        Karaoke.currentSessions.push(new Karaoke.Session(message));
        return message.say('Karaoke started!');
    }
};

