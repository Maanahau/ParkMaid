const { Command } = require('discord.js-commando');
const database = require('../../lib/database.js');

module.exports = class ModCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mod',
			group: 'admin',
			memberName: 'mod',
			description: 'Set @role as moderator role.',
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'op',
                    prompt: 'Operation to be executed. Can be `add` or `remove`.',
                    type: 'string',
                    oneOf: ['add','remove'],
                },
                {
                    key: 'role',
                    prompt: 'Role that you want to add/remove from mod list.',
                    type: 'role',
                },
            ],
		});
	}

    async run(message, {op, role}){
        if(op === 'add'){
            try{
                const guild = await database.guild.findOne({
                    where:{
                        discordid:message.guild.id,
                    },
                });
                let newMod = await database.modRole.create({
                    discordid:role.id,
                    guildId:guild.id,
                });
                database.guildCache[guild.discordid].modRoles.push(newMod.discordid);
                return message.say('Role set as moderator.');
            }catch(error){
                if(error.name === 'SequelizeUniqueConstraintError'){
                    return message.say('This role is already a moderator.');
                }
                return console.log(error);
            }
        }else if(op === 'remove'){
            const guild = await database.guild.findOne({
                where:{
                    discordid:message.guild.id,
                },
            });
            const removedModRole = await database.modRole.destroy({
                where:{
                    discordid:role.id,
                    guildId:guild.id,
                },
            });
            let index = database.guildCache[guild.discordid].modRoles.indexOf(removedModRole.discordid);
            database.guildCache[guild.discordid].modRoles.splice(index, 1);
            if(removedModRole){
                return message.say('Moderator role removed.');
            }else{
                return message.say('This role is not a moderator.');
            }
        }
    }
};