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
        try{
            if(Karaoke.currentSessions){
                for (let session of Karaoke.currentSessions){
                    if(session.guild_id === message.guild.id){
                        const index = Karaoke.currentSessions.indexOf(session);
                        let stats = Karaoke.currentSessions[index].stats.getStatsEmbed();
                        Karaoke.currentSessions.splice(index, 1);
                        message.say('Session ended.');
                        return message.embed(stats);
                    }
                }
                return message.say('No active queue.');
            }
        }catch(error){
            console.log(error);
        }
    }
};