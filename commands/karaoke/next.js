const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class NextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'next',
			aliases: ['n'],
			group: 'karaoke_host',
			memberName: 'next',
			description: 'Shift forward the current queue.',
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
                    if(session.queue.length){
                        const first = session.queue.shift();
                        if(first[1]) session.queue.push(first);
                        return this.client.registry.commands.get('queue').run(message);
                    }else return message.say('The queue is empty.');
                }
            }
            return message.say('No active queue.');
        }
    }
};