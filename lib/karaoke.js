class Session{
    constructor(message){
        this.guild_id = message.guild.id;
        //storing [user_id,loop], loop = true|false
        //queue[0] = next user singing
        this.queue = [];
    }
}

//store sessions for every guild here. 1 session per guild at once
var currentSessions = [];
//store last user with loop=false, removed during a shift

module.exports.Session = Session;
module.exports.currentSessions = currentSessions;