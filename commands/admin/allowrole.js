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
        const commandGroup = await database.commandGroup.findOne({
            where:{
                name:group.name,
            },
        });
        const allowedRoles = database.guildCache[message.guild.id].allowedRoles;

        if(op === 'add'){
            try{
                if(allowedRoles[role.id] && allowedRoles[role.id].includes(group.name))
                    return message.say(`Role \`\`${role.name}\`\` is already allowed to use \`\`${group.name}\`\` commands.`);

                //cache
                if(!allowedRoles[role.id])
                    allowedRoles[role.id] = new Array();
                allowedRoles[role.id].push(group.name);
                //database
                let newRole = await database.allowedRole.create({
                    discordid:role.id,
                    guildId:guild.id,
                });
                await newRole.addCommandGroup(commandGroup);
                console.log(allowedRoles);
                return message.say(`Role \`\`${role.name}\`\` is now allowed to use \`\`${group.name}\`\` commands.`);

            }catch(error){ 
                return console.log(error);
            }
        }else if(op === 'remove'){
            try{
                if(!allowedRoles[role.id])
                    return message.say(`Nothing to remove.`);

                if(!allowedRoles[role.id].includes(group.name)){
                    return message.say(`Nothing to remove.`);
                }else{
                    //cache
                    allowedRoles[role.id].splice(allowedRoles[role.id].indexOf(group.name), 1);
                    //database
                    let targetRole = await database.allowedRole.findOne({
                        where:{
                            discordid:role.id,
                            guildId:guild.id,
                        },
                    });
                    await targetRole.removeCommandGroup(commandGroup);

                    //remove role from allowedRoles if no permissions
                    if(allowedRoles[role.id].length === 0){
                        //cache
                        delete allowedRoles[role.id];
                        //database
                        await database.allowedRole.destroy({
                            where:{
                                discordid:role.id,
                                guildId:guild.id,
                            },
                        });
                    }
                    console.log(allowedRoles);
                    return message.say(`Role \`\`${role.name}\`\` is not allowed to use \`\`${group.name}\`\` commands anymore.`);
                }
            }catch(error){
                console.log(error);
            }
        }
    }
};