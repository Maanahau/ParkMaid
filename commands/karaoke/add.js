const { Command } = require('discord.js-commando');
const Karaoke = require('../../lib/karaoke.js');

module.exports = class AddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add',
			aliases: ['a'],
			group: 'karaoke_host',
			memberName: 'add',
			description: 'Add @user to the queue.',
            guildOnly: true,
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'user',
                    prompt: 'User to be added to the queue.',
                    type: 'member',
                    validate: user => {
                        if(user.bot) return false;
                        return true;
                    },
                },
                {
                    key: 'position',
                    prompt: 'Position where you want to add @user. Can be `top`, `bottom` or a number.',
                    type: 'string',
                    default: 'bottom',
                    validate: position => { 
                        if(['once', 'top', 'bottom'].includes(position) || (!isNaN(position) && position > 0)) 
                            return true;
                        return false;
                    },
                }, 
                {
                    key: 'noloop',
                    prompt: 'Whether or not @user will be kept in queue after their turn. Type `once` to add @user for a single song.',
                    type: 'string',
                    default: '',
                    validate: noloop => {
                        if(noloop === 'once')
                            return true;
                        return false;
                    },
                },
            ],
		});
	}

    run(message, {user, position, noloop}){
        if(Karaoke.currentSessions){
            for (let session of Karaoke.currentSessions){
                if(session.guild_id === message.guild.id){
                    if(session.host_id === message.author.id){
                        //remove user from queue if already present
                        for(let x of session.queue){
                            if(x[0] === user.id){
                                session.queue.splice(session.queue.indexOf(x), 1);
                            }
                        }
                        //check position
                        //special case, 'once' in position argument
                        if(position === 'once'){
                            session.queue.push([user.id, false]);
                        }else{
                            const entry = [user.id, noloop==='once' ? false : true];
                            //check position
                            if(position === 'bottom'){
                                session.queue.push(entry);
                            }else if(position === 'top'){
                                session.queue.unshift(entry);
                            }else{
                                if(position > session.queue.length){
                                    session.queue.push(entry);
                                }else{
                                    session.queue.splice(position-1, 0, entry);
                                }
                                message.say('User added to the queue');
                            }
                        }
                        return this.client.registry.commands.get('queue').run(message);
                    }else{
                        return message.say('Only the host can add people to the queue.');
                    }
                }
            }
            return message.channel.send('No active queue.');
        }
    }
};
