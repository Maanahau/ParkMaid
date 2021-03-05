const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class SkipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			aliases: ['sk'],
			group: 'karaoke',
			memberName: 'skip',
			description: 'Shift your position back by one position.',
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
                        for(let user of session.queue){
                            if(user[0] === message.author.id){
                                let userIndex = session.queue.indexOf(user);
                                if(userIndex === session.queue.length - 1){
                                    return message.say('You are already last.');
                                }else{
                                    const temp = user;
                                    session.queue[userIndex] = session.queue[userIndex + 1];
                                    session.queue[userIndex + 1] = temp;
                                    message.say(`<@${temp[0]}> skipped.`);
                                    return this.client.registry.commands.get('queue').run(message);
                                }
                            }
                        }
                        return message.say('You\'re not in the queue.');
                    }else return message.say('The queue is empty.');
                }
            }
            return message.say('No active queue.');
        }
    }
};