const Commando = require('discord.js-commando');
const path = require('path');

const config  = require('./config.json');
const database = require('./lib/database.js');

const client = new Commando.CommandoClient({
    commandPrefix: '?',
    owner: `${config.OWNER_ID}`,
    nonCommandEditable: false,
    commandEditableDuration: 0,
});
module.exports.client = client;

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'admin'],
		['karaoke', 'karaoke'],
        ['karaoke_host', 'karaoke_host'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
        unknownCommand:false,
        help:false,
    })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.dispatcher.addInhibitor(message => {
    //check if user has a mod role
    let isMod = false;
    modLoop: 
        for(let role of message.member.roles.cache.array()){
            for(modRole of database.guildCache[message.guild.id].modRoles){
                if(modRole === role.id){
                    isMod = true;
                    break modLoop;
                }
            }
        }
    //mods can use every command everywhere
    if(isMod) return false;
    //role check
    let isRoleAllowed = false;
    if(message.command.group.name === 'admin'){
        return message.command.name === 'mod' ? false : 'not_mod';
    }
    let allowedRoles = database.guildCache[message.guild.id].allowedRoles;
    for(let role of message.member.roles.cache.array()){
        if(allowedRoles[role.id] && allowedRoles[role.id].includes(message.command.group.name))
            isRoleAllowed = true;
    }
    if(!isRoleAllowed)
        return 'no_role';

    //channel check
    let isChannelAllowed = false;
    let allowedChannels = database.guildCache[message.guild.id].allowedChannels;
    if(allowedChannels[message.channel.id] && allowedChannels[message.channel.id].includes(message.command.group.name))
        isChannelAllowed = true;
    if(!isChannelAllowed)
        return 'no_channel';
    return false;

})


client.once('ready', async () => {
    await database.syncdb(client);
    console.log(`Logged in as ${client.user.tag}.`);
    client.user.setActivity('Karaoke');

    //check guilds in database 
    let knownGuilds = await database.guild.findAll();
    let knownIds = new Array();
    for(let guild of knownGuilds){
        knownIds.push(guild.discordid);
    }
    for(let guild of client.guilds.cache.array()){
        if(!knownIds.includes(guild.id)){
            let newGuild = await database.guild.create({
                discordid:guild.id,
            });
            knownGuilds.push(newGuild);
            console.log(`Guild ${guild.id} added to database`);
        }
    }

    //build guilds cache
    for(let guild of knownGuilds){
        database.guildCache[guild.discordid] = new database.guildCacheRecord(guild);
        await database.guildCache[guild.discordid].asyncConstructor(guild);
    }
    console.log(`Guild cache ready`);
});

client.on('guildCreate', async guild =>{
    let newGuild = await database.guild.create({
        discordid:guild.id,
    });
    database.guildCache[newGuild.discordid] = new database.guildCacheRecord(newGuild);
    await database.guildCache[newGuild.discordid].asyncConstructor(newGuild);
    console.log(`Guild ${newGuild.id} added to database`);
    console.log(database.guildCache[newGuild.discordid]);
});

client.on('error', console.error);
client.login(config.TOKEN);