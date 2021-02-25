const { Command } = require('discord.js-commando');
const database = require('../../lib/database.js');

module.exports = class AllowroleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'allowrole',
			group: 'admin',
			memberName: 'allowrole',
			description: 'Allow group of commands for @role.',
            guildOnly: true,
            throttling:{
                usages: 2,
                duration: 10,
            },
            args:[
                {
                    key: 'role',
                    prompt: 'target to which the given group must be allowed',
                    type: 'role',
                },
                {
                    key: 'group',
                    prompt: 'group to allow for the target',
                    type: 'group',
                },
            ],
		});
	}

    async run(message, {role, group}){
        try{
            for(let r of database.guildCache[message.guild.id].allowedRoles){
                if(r[0] === role.id && r[1] === group.name){
                    return message.say(`Role \`\`${role.name}\`\` is already allowed to use \`\`${group.name}\`\` commands.`);
                }
            }

            const guild = await database.guild.findOne({
                where:{
                    discordid:message.guild.id,
                },
            });
            const allowedRole = await database.allowedRole.create({
                discordid:role.id,
                group:group.name,
                guildId:guild.id,
            });
            database.guildCache[guild.discordid].allowedRoles.push([allowedRole.discordid, group.name]);
            return message.say(`Role \`\`${role.name}\`\` is now allowed to use \`\`${group.name}\`\` commands.`);
        }catch(error){ 
            return console.log(error);
        }
    }
};