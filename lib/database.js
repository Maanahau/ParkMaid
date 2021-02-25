const Sequelize = require('sequelize');
const config = require('../config.json');

const sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWORD, {
    host: `${config.ADDRESS}`,
    dialect: `${config.DIALECT}`,
    logging: false,
});
module.exports.sequelize = sequelize;

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
    group:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});
module.exports.allowedChannel = allowedChannel;

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
    group:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});
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
guild.hasMany(allowedChannel);
guild.hasMany(allowedRole);
guild.hasMany(modRole);
allowedChannel.belongsTo(guild);
allowedRole.belongsTo(guild);
modRole.belongsTo(guild)
module.exports.guild = guild;

async function sync(){
    try{
        guild.sync();
        allowedChannel.sync();
        allowedRole.sync();
        modRole.sync();
        return console.log(`Database ${config.DATABASE} synced.`);
    }catch(error){
        return console.log(error);
    }
}
module.exports.sync = sync;

class guildCacheRecord{
    constructor(guild){
        this.guild_id = guild.discordid;
        this.prefix = guild.prefix;

        //{channel.id, group}
        this.allowedChannels = new Array();
        //{role.id, group}
        this.allowedRoles = new Array();
        //{role.id}
        this.modRoles = new Array();

    }

    async asyncConstructor(guild){
        let channels = await allowedChannel.findAll({
            where:{
                guildId:guild.id,
            },
        });
        for(let channel of channels){
            this.allowedChannels.push([channel.discordid, channel.group]);
        }

        let roles = await allowedRole.findAll({
            where:{
                guildId:guild.id,
            },
        });
        for(let role of roles){
            this.allowedRoles.push([role.discordid, role.group]);
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

