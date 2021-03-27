const Discord = require('discord.js');
const humanizeDuration = require("humanize-duration");

class Session{
    constructor(message){
        this.guild_id = message.guild.id;
        //storing [user_id,loop], loop = true|false
        //queue[0] = next user singing
        this.queue = [];
        this.stats = new StatTracker();
    }
}

class StatTracker{
    constructor(){
        this.startTime = new Date();
        //songs sang by every person songsCounter[userId] = number
        this.songsCounter = [];
    }

    increaseSongs(userId){
        if(this.songsCounter[userId])
            this.songsCounter[userId]++;
        else
            this.songsCounter[userId] = 1;
    }

    decreaseSongs(userId){
        if(this.songsCounter[userId] > 0)
            this.songsCounter[userId]--;
    }

    getStatsEmbed(){
        try{
            let embed = new Discord.MessageEmbed()
            .setColor('#f47fff')
            .setTitle('Session stats')
            //Start time
            //TODO: put timezone in database and make ?timezone command
            .setDescription(`Started: ${this.startTime.toLocaleString('en-US', { timeZone: 'America/New_York' })}`)
            //Total session time
            .addField('Session time', humanizeDuration(Date.now() - this.startTime, {units:["h","m"], round:true}))
            //total singers
            .addField(`Singers: ${Object.keys(this.songsCounter).length}`, '\u200b', true);

            //total songs
            let songs = 0;
            for(let user in this.songsCounter) 
                songs += this.songsCounter[user];
            embed.addField(`Songs: ${songs}`, '\u200b', true);
            if(songs === 0) return null;

            //top singers
            let topCount = 0;
            let userIds = Object.keys(this.songsCounter);
            for(let id of userIds){
                if(this.songsCounter[id] > topCount)
                    topCount = this.songsCounter[id];
            }
            let topSingers = '';
            let counter = 0;
            for(let id of userIds){
                if(this.songsCounter[id] === topCount){
                    topSingers += `<@${id}>\n`;
                    counter++;
                }
            }
            if(counter > 1){
                embed.addField(`With ${topCount} songs each, the Lead Singers are`, topSingers);
            }else{
                embed.addField(`With ${topCount} songs, the Lead Singer is`, topSingers);
            }
            return embed;
        }catch(error){
            console.log(error);
        }
    }
}

//store sessions for every guild here. 1 session per guild at once
var currentSessions = [];
//store last user with loop=false, removed during a shift

module.exports.Session = Session;
module.exports.currentSessions = currentSessions;