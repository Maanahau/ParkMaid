const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class RemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove',
			aliases: ['r'],
			group: 'karaoke_host',
			memberName: 'remove',
			description: 'Remove the current karaoke session.',
            guildOnly: true,
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'user',
                    prompt: 'User to be removed for the queue.',
                    type: 'user', 
                    validate: user => {
                        if(user.bot) return false;
                        return true;
                    },
                },
            ],
		});
	}

    run(message, { user }){
        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    if(session.host_id === message.author.id){
                        for(let x of session.queue){
                            if(user.id === x[0]){
                                session.queue.splice(session.queue.indexOf(x), 1);
                                message.say('User removed from the queue');
                                return this.client.registry.commands.get('queue').run(message);
                            }
                        }
                        return message.say('User not in the queue.');
                    }else{
                        return message.channel.send('Only the host can remove people from the queue.');
                    }
                }
            }
            return message.channel.send('No active queue.');
        }
    }
};