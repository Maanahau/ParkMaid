const { Command } = require('discord.js-commando');
const database = require('../../lib/database.js');

module.exports = class AllowchannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'allowchannel',
			group: 'admin',
			memberName: 'allowchannel',
			description: 'Allow group of commands for #channel.',
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
                    key: 'channel',
                    prompt: 'channel into which the given group must be allowed',
                    type: 'channel',
                },
                {
                    key: 'group',
                    prompt: 'group to allow for the target',
                    type: 'group',
                },
            ],
		});
	}

    async run(message, {op, channel, group}){
        if(group.name === 'admin'){
            return message.say('Commands from the ``admin`` group can be used everywhere.');
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
        const allowedChannels = database.guildCache[message.guild.id].allowedChannels;

        if(op === 'add'){
            try{
                if(allowedChannels[channel.id] && allowedChannels[channel.id].includes(group.name))
                    return message.say(`\`\`${group.name}\`\` commands are already allowed in <#${channel.id}>.`)

                //cache
                if(!allowedChannels[channel.id])
                    allowedChannels[channel.id] = new Array();
                allowedChannels[channel.id].push(group.name);
                //database
                let newChannel = await database.allowedChannel.create({
                    discordid:channel.id,
                    guildId:guild.id,
                });
                await newChannel.addCommandGroup(commandGroup);
                console.log(allowedChannels);
                return message.say(`\`\`${group.name}\`\` commands are now allowed in <#${channel.id}>.`);

            }catch(error){ 
                return console.log(error);
            }
        }else if(op === 'remove'){
            try{
                if(!allowedChannels[channel.id])
                    return message.say(`Nothing to remove.`);

                if(!allowedChannels[channel.id].includes(group.name)){
                    return message.say(`Nothing to remove.`);
                }else{
                    //cache
                    allowedChannels[channel.id].splice(allowedChannels[channel.id].indexOf(group.name), 1);
                    //database
                    let targetChannel = await database.allowedChannel.findOne({
                        where:{
                            discordid:role.id,
                            guildId:guild.id,
                        },
                    });
                    await targetChannel.removeCommandGroup(commandGroup);

                    //remove role from allowedRoles if no permissions
                    if(allowedChannel[channel.id].length === 0){
                        //cache
                        delete allowedChannels[channel.id];
                        //database
                        await database.allowedChannel.destroy({
                            where:{
                                discordid:role.id,
                                guildId:guild.id,
                            },
                        });
                    }
                    console.log(allowedChannels);
                    return message.say(`\`\`${group.name}\`\` commands are not allowed in <#${channel.id}> anymore.`);
                }
            }catch(error){
                console.log(error);
            }
        }
    }
};