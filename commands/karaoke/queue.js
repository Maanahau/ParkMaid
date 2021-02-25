const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['q'],
			group: 'karaoke',
			memberName: 'queue',
			description: 'Show the current queue.',
            guildOnly: true,
            throttling:{
                usages: 2,
                duration: 10,
            },
		});
	}

    run(message){
        const queueEmbed = new Discord.MessageEmbed()
            .setColor('#f47fff')
            .setTitle('Karaoke')
            .setDescription('Use `?join` to join the queue, or `?join once` to join for just a song.');

        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    if(session.queue.length){
                        queueEmbed.addField('**Next singing:**', `**1 -** <@${session.queue[0][0]}>`);
                        let field = '';
                        let i = 1;
                        while(session.queue[i]){
                            field += `**${i+1} -** <@${session.queue[i++][0]}>\n`;
                        }
                        if(field) queueEmbed.addField('Queue:', field);
                        queueEmbed.setFooter(`Current host: ${session.host_tag}`);
                        return message.embed(queueEmbed);
                    }else{
                        queueEmbed.addField('Queue:','Empty').setFooter(`Current host: ${session.host_tag}`);
                        return message.embed(queueEmbed);
                    }
                }
            }
        }
        return message.say('No active queue.');
    }
};