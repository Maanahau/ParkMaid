const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const database = require('../../lib/database.js');

module.exports = class GhostbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ghostban',
			group: 'admin',
			memberName: 'ghostban',
			description: 'Ban without sending dms',
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            clientPermissions: ['BAN_MEMBERS'],
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'user',
                    prompt: 'users',
                    type: 'user',
                    infinite: true,
                },
            ],
		});
	}

    async run(message, {user}){
        try{  
            let outputString = '';
            for(let u of user){
                if(u === message.author){
                    message.say('You can\'t ban yourself.');
                    continue;
                }
                let member = await message.guild.members.fetch(u)
                    .catch(e => {
                        console.log(`${u.tag} not in this guild.`);
                    });
                //check if user has a mod role
                if(member){
                    let isMod = false;
                    modLoop: 
                        for(let role of member.roles.cache.array()){
                            for(modRole of database.guildCache[message.guild.id].modRoles){
                                if(modRole === role.id){
                                    isMod = true;
                                    break modLoop;
                                }
                            }
                        }
                    if(isMod){
                        message.say('You can\'t ban a moderator.');
                        continue;
                    }
                }
                await message.guild.members.ban(u);
                outputString += `${u}\n`;
            }
            if(outputString !== ''){
                outputString = '**Banned users:**\n' + outputString;
                //TODO: use embed
                return message.say(outputString);
            }
        }catch(error){
            console.log(error);
        }
    }
     
};