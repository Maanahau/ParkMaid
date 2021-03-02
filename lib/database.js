const Sequelize = require('sequelize');
const config = require('../config.json');

const sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWORD, {
    host: `${config.ADDRESS}`,
    dialect: `${config.DIALECT}`,
    logging: false,
});
module.exports.sequelize = sequelize;

const commandGroup = sequelize.define('commandGroup',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    }
});
module.exports.commandGroup = commandGroup;

const groupChannel = sequelize.define('groupChannel',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
});
module.exports.groupChannel = groupChannel;

const allowedChannel = sequelize.define('allowedChannel',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discordid:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});
commandGroup.belongsToMany(allowedChannel, { through:groupChannel, onDelete:'CASCADE' });
allowedChannel.belongsToMany(commandGroup, { through:groupChannel });
module.exports.allowedChannel = allowedChannel;

const groupRole = sequelize.define('groupRole', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
});
module.exports.groupRole = groupRole;

const allowedRole = sequelize.define('allowedRole', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discordid:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});
commandGroup.belongsToMany(allowedRole, { through:groupRole, onDelete:'CASCADE' });
allowedRole.belongsToMany(commandGroup, { through:groupRole });
module.exports.allowedRole = allowedRole;

const modRole = sequelize.define('modRole',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discordid:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
});
module.exports.modRole = modRole;

const guild = sequelize.define('guild',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discordid:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    prefix:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "?",
    },
});
//default name for guild foreign key: guildId
guild.hasMany(allowedChannel, {onDelete:'CASCADE'});
guild.hasMany(allowedRole, {onDelete:'CASCADE'});
guild.hasMany(modRole, {onDelete:'CASCADE'});
allowedChannel.belongsTo(guild);
allowedRole.belongsTo(guild);
modRole.belongsTo(guild);
module.exports.guild = guild;

async function syncdb(client){
    try{
        commandGroup.sync();
        guild.sync();
        allowedChannel.sync();
        allowedRole.sync(); 
        groupChannel.sync();
        groupRole.sync();
        modRole.sync();

        //create entry for every command group
        for(group of client.registry.groups.array()){
            let existingGroup = await commandGroup.findOne({
                where:{
                    name:group.name,
                },
            });
            if(!existingGroup){
                await commandGroup.create({
                    name:group.name,
                });
            }
        }
        return console.log(`Database ${config.DATABASE} synced.`);
    }catch(error){
        return console.log(error);
    }
}
module.exports.syncdb = syncdb;

class guildCacheRecord{
    constructor(guild){
        this.guild_id = guild.discordid;
        this.prefix = guild.prefix;

        //allowedChannels[channel.id] = ['group1', 'group2', ...]
        this.allowedChannels = new Array();

        //allowedRoles[role.id] = ['group1', 'group2', ...]
        this.allowedRoles = new Array();

        //modRoles = ['modrole1', 'modrole2', ...]
        this.modRoles = new Array();

    }

    async asyncConstructor(guild){
        let channels = await allowedChannel.findAll({
            where:{
                guildId:guild.id,
            },
        });
        for(let channel of channels){
            let groups = await channel.getCommandGroups();
            for(let group of groups){
                this.allowedChannels[channel.discordid] = new Array();
                this.allowedChannels[channel.discordid].push(group.name);
            }
        }

        let roles = await allowedRole.findAll({
            where:{
                guildId:guild.id,
            },
        });
        for(let role of roles){
            let groups = await role.getCommandGroups();
            for(let group of groups){
                this.allowedRoles[role.discordid] = new Array();
                this.allowedRoles[role.discordid].push(group.name);
            }
        }

        let mods = await modRole.findAll({
            where:{
                guildId:guild.id,
            },
        });
        for(let mod of mods){
            this.modRoles.push(mod.discordid);
        }
        return;
    }
}
module.exports.guildCacheRecord = guildCacheRecord;

//put guildDatabaseCache here
//index = discord guild id
module.exports.guildCache = new Array();

