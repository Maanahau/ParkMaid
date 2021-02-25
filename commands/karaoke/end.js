const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class EndCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'end',
			aliases: ['e'],
			group: 'karaoke_host',
			memberName: 'end',
			description: 'Stop the current karaoke session.',
            guildOnly: true,
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
                    if(session.host_id === message.author.id){
                        const index = Karaoke.currentSessions.indexOf(session);
                        Karaoke.currentSessions.splice(index, 1);
                        return message.say('Session stopped.');
                    }else{
                        return message.say('Only the host can stop the current session.');
                    }
                }
            }
            return message.say('No active queue.');
        }
    }
};