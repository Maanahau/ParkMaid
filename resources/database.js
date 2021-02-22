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
    channel:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    category:{
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
    role:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    category:{
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
    role:{
        type: Sequelize.STRING,
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
    guild_id:{
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
module.exports.guild = guild;

function sync(){
    guild.sync();
    allowedChannel.sync();
    allowedRole.sync();
    modRole.sync();
    return;
}
module.exports.sync = sync;