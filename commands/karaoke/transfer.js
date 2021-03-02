const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class TransferCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'transfer',
			aliases: ['t'],
			group: 'karaoke_host',
			memberName: 'transfer',
			description: 'Transfer the current karaoke session to another host.',
            guildOnly: true,
            throttling:{
                usages: 2,
                duration: 10,
            },
            args:[
                {
                    key: 'user',
                    prompt: 'New karaoke host.',
                    type: 'user',
                }
            ],
		});
	}

    run(message, { user }){
        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    if(session.host_id === message.author.id){
                        if(session.host_id === user.id){
                            return message.say('You are already the host.');
                        }else{ 
                            session.host_id = user.id;
                            session.host_tag = user.tag;
                            return message.channel.send(`${user} is now the host.`);
                        }
                    }else{
                        return message.say('You are not the current host.');
                    }
                }
            }
            return message.say('No active queue');
        }
    }
};


