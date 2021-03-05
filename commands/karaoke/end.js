const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class EndCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'end',
			group: 'karaoke_host',
			memberName: 'end',
			description: 'Stop the current karaoke session.',
            guildOnly: true,
            argsPromptLimit: 0,
            throttling:{
                usages: 2,
                duration: 10,
            },
		});
	}

    run(message){
        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    const index = Karaoke.currentSessions.indexOf(session);
                    Karaoke.currentSessions.splice(index, 1);
                    return message.say('Session stopped.');
                }
            }
            return message.say('No active queue.');
        }
    }
};