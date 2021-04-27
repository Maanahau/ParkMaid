const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const database = require('../../lib/database.js');

module.exports = class ShowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'showperms',
			group: 'admin',
			memberName: 'showperms',
			description: 'Show permissions for mods|roles|channels.',
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'category',
                    prompt: 'Category of permissions that you want to see. Can be `mods`, `roles` or `channels`.',
                    type: 'string',
                    oneOf: ['mods','roles','channels']
                },
            ],
		});
	}

    async run(message, {category}){
        try{
            const embed = new Discord.MessageEmbed().setColor('#ff0000');
            let field = '';

            switch(category){
                case 'mods':
                    embed.setTitle('Current mod roles');
                    let modRoles = database.guildCache[message.guild.id].modRoles;
                    for(modRole of modRoles){
                        field += `<@&${modRole}>\n`;
                    }
                    if(field === '')
                        field += 'No mod roles';
                    embed.addField('\u200b', field);
                    return message.embed(embed);

                case 'roles':
                    embed.setTitle('Current role permissions')
                    let allowedRoles = database.guildCache[message.guild.id].allowedRoles;
                    let roleIds = Object.keys(allowedRoles);
                    for(let id of roleIds){
                        field += `**Permissions for ** <@&${id}>\n`;
                        for(let group of allowedRoles[id]){
                            field += `\`${group}\`\n`;
                        }
                        field += '\n';
                    }
                    if(field === '')
                        field += 'No role permissions set';
                    embed.addField('\u200b', field);
                    return message.embed(embed);

                case 'channels':
                    embed.setTitle('Current channel permissions')
                    let allowedChannels = database.guildCache[message.guild.id].allowedChannels;
                    let channelIds = Object.keys(allowedChannels);
                    for(let id of channelIds){
                        field += `**Permissions for ** <#${id}>\n`;
                        for(let group of allowedChannels[id]){
                            field += `\`${group}\`\n`;
                        }
                        field += '\n';
                    }
                    if(field === '')
                        field += 'No channel permissions set';
                    embed.addField('\u200b', field);
                    return message.embed(embed);
            }
        }catch(error){
            console.log(error);
        }
    }
};