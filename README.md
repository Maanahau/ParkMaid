# ParkMaid
This bot will keep track of the queue during karaoke, allowing people to join, leave or show the current queue with a simple command.

## Installing
To install everything needed, run the following commands:

    $ git clone https://github.com/Maanahau/ParkMaid.git
    $ cd ParkMaid
    $ npm install

You will need to set up a database, i used mysql but you can use whatever you want as long as it's supported by [Sequelize](https://sequelize.org/).

## Configuration
Before starting your bot, you will need to create a file named `config.json`, which will be like the following

    {
        "TOKEN" : "your bot token here",
        "OWNER_ID": "your discord user id here",
    
        "DATABASE" : "name of your database",
        "USER": "user",
        "PASSWORD": "password",
        "ADDRESS": "address where you're hosting your database",
        "DIALECT": "mysql/mariadb/etc.."
    }

This will contain the data needed to access your database, the bot's token and your discord id.

## First use
To start the bot, run the command

    $ npm start

Your bot has no permissions set at the moment. The first thing you want to do is `?mod add @role` to give a role moderator permissions. You can now set permissions for every group of commands. Mods bypass every permission in the server.`?help` can always be used by everyone.

## Moderator commands
|Command|Description|Example|
|-------|-----------|-------|
|`?prefix <newprefix>`|Change prefix to `newprefix`.|
|`?showperms <mods\|roles\|channels>`|Show current permissions.|`?showperms mods`|
|`?mod <add\|remove> <@role>`|Give or revoke moderator permissions to `@role`.|`?mod remove 'New Member'`|
|`?roleperms <add\|remove> <@role> <group>`|Give or revoke permission to use `group` commands to `@role`.|`?roleperms add Member karaoke`|
|`?channelperms <add\|remove> <#channel> <group>`|Give or revoke permission to use `group` commands in `#channel`.|`?channelperms add #bots karaoke`|

### Command groups
|Group|Description|
|-|-|
|`karaoke`|Join, leave and show the current queue.|
|`karaoke_host`|Queue management|


## Karaoke commands
|Command|Description|
|-------|-----------|
|`?queue`|Show the current queue.|
|`?join [once]`|Join the current queue. Use `?join once` to join for a single song.|
|`?leave`|Leave the current queue.|
|`?skip`|Swap position in the queue with the person singing after you.|

## Karaoke Host commands
|Command|Description|Example|
|-|-|-|
|`?start`|Start a karaoke session.| |
|`?end`|Stop the current karaoke session.| |
|`?add <@user> [top\|bottom\|number] [once]`|Add `@user` to the queue. If a position is not given, they will be placed at the bottom. Using `?add` on a user already in queue will result in the user being moved to the given position.|`?add @Maanahau 5 once`|
|`?remove <@user>`|Remove `@user` from the queue.|`?remove @Maanahau`|
|`?next`|Shift queue forward by 1.|
|`?prev`|Shift queue back by 1.|
