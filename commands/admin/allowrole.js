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
            argsCount: 3,
            argsSingleQuotes: true,
            argsPromptLimit: 0,
            args:[
                {
                    key:'op',
                    prompt: 'operation to be executed',
                    type: 'string',
                    oneOf: ['add','remove'],
                },
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

    async run(message, {op, role, group}){
        if(group.name === 'admin'){
            return message.say('Only mods can use commands from the ``admin`` group. Use the ``mod`` command to set mod roles.');
        }
        const guild = await database.guild.findOne({
            where:{
                discordid:message.guild.id,
            },
        });
        const allowedRoles = database.guildCache[message.guild.id].allowedRoles;
        if(op === 'add'){
            try{
                for(let r of allowedRoles){
                    if(r[0] === role.id && r[1] === group.name){
                        return message.say(`Role \`\`${role.name}\`\` is already allowed to use \`\`${group.name}\`\` commands.`);
                    }
                }
                const allowedRole = await database.allowedRole.create({
                    discordid:role.id,
                    group:group.name,
                    guildId:guild.id,
                });
                allowedRoles.push([allowedRole.discordid, group.name]);
                return message.say(`Role \`\`${role.name}\`\` is now allowed to use \`\`${group.name}\`\` commands.`);
            }catch(error){ 
                return console.log(error);
            }
        }else if(op === 'remove'){
            for(let r of allowedRoles){
                if(r[0] === role.id && r[1] === group.name){
                    allowedRoles.splice(allowedRoles.indexOf(r), 1);
                    const removedAllowedRole = await database.allowedRole.destroy({
                        where:{
                            discordid:role.id,
                            group:group.name,
                            guildId:guild.id,
                        },
                    });
                    if(removedAllowedRole){
                        return message.say(`Permissions for \`\`${role.name}\`\` on \`\`${group.name}\`\` group removed.`);
                    }
                }
            }
            return message.say('Nothing to remove.');
        }
    }
};