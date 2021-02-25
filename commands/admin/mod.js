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
            console.log(database.guildCache[guild.discordid]);
            return message.say('Role set as moderator.');
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return message.say('This role is already a moderator.');
            }
            return console.log(error);
        }
    }
};