const { Command } = require('discord.js-commando');
const database = require('../../lib/database.js');

module.exports = class UnmodCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unmod',
			group: 'admin',
			memberName: 'unmod',
			description: 'Unset @role as moderator role.',
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling:{
                usages: 2,
                duration: 10,
            },
            args:[
                {
                    key: 'role',
                    prompt: 'role',
                    type: 'role',
                },
            ],
		});
	}

    async run(message, {role}){
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
        console.log(database.guildCache[guild.discordid]);
        if(removedModRole){
            return message.say('Moderator role removed.');
        }else{
            return message.say('This role is not a moderator.');
        }
    }
};