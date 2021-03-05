const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['l'],
			group: 'karaoke',
			memberName: 'leave',
			description: 'Leave the current karaoke session.',
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
                    for(let user of session.queue){
                        if(user[0] === message.author.id){
                            const index = session.queue.indexOf(user);
                            session.queue.splice(index, 1);
                            message.say(`${message.author} left the queue!`);
                            return this.client.registry.commands.get('queue').run(message);
                        }
                    }
                    return message.say('You\'re not in the queue.');
                }
            }
            return message.say('No active sessions to leave.');
        }
    }
};