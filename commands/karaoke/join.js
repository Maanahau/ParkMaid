const { Command } = require('discord.js-commando');
const Karaoke = require('../../resources/karaoke.js');

module.exports = class JoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['j'],
			group: 'karaoke',
			memberName: 'join',
			description: 'Join the current karaoke session.',
            guildOnly: true,
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'once',
                    prompt: 'Use `?join once` to join for just a song.',
                    type: 'string',
                    default: '',
                    validate: once => {
                        if(once === 'once')
                            return true;
                        return false;
                    },
                },
            ],
		});
	}

    run(message, { once }){
        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    if(session.queue){
                        for(let user of session.queue){
                            if(user[0] === message.author.id){
                                return message.say('You are already in the queue.');
                            }
                        }
                    }
                    session.queue.push([message.author.id, once==='once' ? false : true]);
                    message.say(`${message.author} joined the queue!`);
                    return this.client.registry.commands.get('queue').run(message);
                }
            }
            return message.say('No active queue.');
        }
    }
};