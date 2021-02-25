const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class PrevCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prev',
			aliases: ['p'],
			group: 'karaoke_host',
			memberName: 'prev',
			description: 'Shift backward the current queue.',
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
                    if(session.queue.length){
                        if(session.host_id === message.author.id){
                            session.queue.unshift(session.queue.pop());
                            return this.client.registry.commands.get('queue').run(message);
                        }else{
                            return message.say('Only the host can shift the queue.');
                        }
                    }else return message.say('The queue is empty.');
                }
            }
            return message.say('No active queue.');
        }   
    }
};