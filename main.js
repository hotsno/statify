const Discord = require('discord.js');
const config = require('./config.json');
const private = require('./private.json');
const token = private.BOT_TOKEN;
const bot = new Discord.Client();
const PREFIX = '.s';
const request = require('request');
const fortniteAPI = require('fortnite');
const ft = new fortniteAPI(private.FORTNITE_API_KEY);
const hypixel = require('hypixel');
const ht = new hypixel({ key: private.HYPIXEL_API_KEY });
const fs = require('fs');

const fortnitePlatformTypes = ['pc', 'psn', 'xbl'];
const fortniteModeTypes = ['solo', 'duo', 'squad', 'lifetime'];

const aboutEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('About Statify')
  .setAuthor('Statify', config.logoTransparent, config.glitchLink)
  .setDescription(config.about)
  .setURL(config.glitchLink)

const helpEmbed = new Discord.MessageEmbed()
  .setAuthor('Statify Help Menu', config.logoTransparent, config.rickroll)
  .setColor('c362d9')
  .addFields(
  { name: 'Syntax :tools:', value: '`.s help <command>`', inline: true },
  { name: 'Fortnite :wheelchair: ', value: '`.s fortnite <Epic name>, <platform>, <game mode>`', inline: true },
  { name: 'Hypixel :regional_indicator_h:', value: '`.s hypixel <Minecraft username>`', inline: true },
  { name: 'League of Legends :older_man:', value: '`.s lol <summoner name>`', inline: true },
  );

// Sets bot's Discord status
bot.on('ready', () => {
  console.log('Bot loaded');
  bot.user.setActivity('.s', { type: 'LISTENING' });
});

bot.on('message', (msg) => {
  let args = msg.content.substring(PREFIX.length).split(' ');
  
  if (!msg.content.startsWith(PREFIX)) return;

  switch (args[1]) {
    case 'help':
      help(args, msg);
      break;
    case 'about':
      about(args, msg);
      break;
    case 'fortnite':
      fortniteTracker(msg);
      break;
    case 'lol':
      lolTracker(args, msg);
      break;
    case 'hypixel':
      hypixelTracker(args, msg)
      break;
  }
});

// Sends a help embed
function help(args, msg) {
  if(args.length > 2) {
    helpSyntax(args, msg);
    return;
  }
  msg.channel.send(helpEmbed);
}

// Sends the syntax for different commands
function helpSyntax(args, msg) {
  switch (args[2]) {
    case 'fortnite':
      msg.channel.send(config.fortniteHelp);
      break;
    case 'lol':
      msg.channel.send(config.lolHelp);
      break;
  }
}

// Sends an about embed
function about(args, msg) {
  msg.channel.send(aboutEmbed);
}

// Sends an embed with Fortnite stats
function fortniteTracker(msg) {
  let command = msg.content.substring(12); // Get's the part after .s fortnite
  let args = command.split(', '); // Splits command by comma
  if(args.length < 3 || !fortnitePlatformTypes.includes(args[1]) || !fortniteModeTypes.includes(args[2])){ // Checks if arguments are valid (correct amount, valid platform, valid mode)
    msg.reply("make sure you're using the right format! Type `.c help fortnite` for more info.");
    return;
  }
  let username = args[0];
  let platform = args[1];
  let mode = args[2];

  let data = ft.user(username, platform).then(data => {
    if(data.stats == undefined)
    {
      msg.reply("that user doesn't exist or has never played on this platform!");
      return;
    }
    let stats = data.stats[mode];

    let embed = new Discord.MessageEmbed()
      .setColor('#00FF00')
      .setTitle('Fortnite ' + mode + ' stats for ' + data.username)
      .setAuthor('Statify', config.logoTransparent, config.glitchLink)
      .addFields(
        { name: 'Wins :trophy:', value: stats.wins, inline: true },
        { name: 'Top :five:', value: stats.top_5, inline: true },
        { name: 'Top :two::five:', value: stats.top_25, inline: true },
        { name: 'K/D :dart:', value: stats.kd, inline: true },
        { name: 'Kills :x:', value: stats.kills, inline: true },
      )

      msg.channel.send(embed);

  }).catch(e =>{
    console.log(e);
    let aboutEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Error')
      .setAuthor('Statify', config.logoTransparent, config.glitchLink)
      .setDescription("The user you provided does not exist, or hasn't played on this console!");
    msg.channel.send(aboutEmbed);
  })
}

function hypixelTracker(args, msg) {
  ht.getPlayerByUsername(args[2], (err, player) => {
    if (err) {
      return console.info('Nope!');
    }
    if(args[3] === "skywars") {
      if(player.stats && player.stats.SkyWars) {
        let skyKills = player.stats.SkyWars.kills;
        let skyDeaths = player.stats.SkyWars.deaths;
        let skyKD = skyKills / skyDeaths;
        let skyWins = player.stats.SkyWars.wins;
        let skyLosses = player.stats.SkyWars.losses;
        let skySoloNormalKills = player.stats.SkyWars.kills_solo_normal;
        let skySoloNormalDeaths = player.stats.SkyWars.deaths_solo_normal;
        let skySoloNormalKD = skySoloNormalKills / skySoloNormalDeaths;
        let skySoloNormalWins = player.stats.SkyWars.wins_solo_normal;
        let skySoloNormalLosses = player.stats.SkyWars.losses_solo_normal;
        let skySoloInsaneKills = player.stats.SkyWars.kills_solo_insane;
        let skySoloInsaneDeaths = player.stats.SkyWars.deaths_solo_insane;
        let skySoloInsaneKD = skySoloInsaneKills / skySoloInsaneDeaths;
        let skySoloInsaneWins = player.stats.SkyWars.wins_solo_insane;
        let skySoloInsaneLosses = player.stats.SkyWars.losses_solo_insane;

        let embed = new Discord.MessageEmbed()
          .setColor('#00FF00')
          .setTitle('Hypixel SkyWars Stats for ' + args[2])
          .setAuthor('Statify', config.logoTransparent, config.glitchLink)
          .addFields(
          { name: 'Category:', value: ':bangbang:LIFETIME STATS:bangbang:', inline: false },
          { name: 'Kills :x:', value: skyKills, inline: true },
          { name: 'Deaths :dizzy_face:', value: skyDeaths, inline: true  },
          { name: 'K/D :dart:', value: skyKD.toFixed(2), inline: true },
          { name: 'Wins :trophy:', value: skyWins, inline: true },
          { name: 'Losses :no_entry_sign:', value: skyLosses, inline: true },
          { name: 'Category:', value: ':bangbang:SOLO NORMAL STATS:bangbang:', inline: false },
          { name: 'Solo Normal Kills :x:', value: skySoloNormalKills, inline: true },
          { name: 'Solo Normal Deaths :dizzy_face:', value: skySoloNormalDeaths, inline: true  },
          { name: 'Solo Normal K/D :dart:', value: skySoloNormalKD.toFixed(2), inline: true },
          { name: 'Solo Normal Wins :trophy:', value: skySoloNormalWins, inline: true },
          { name: 'Solo Normal Losses :no_entry_sign:', value: skySoloNormalLosses, inline: true },
          { name: 'Category:', value: ':bangbang:SOLO INSANE STATS:bangbang:', inline: false },
          { name: 'Solo Insane Kills :x:', value: skySoloInsaneKills, inline: true },
          { name: 'Solo Insane Deaths :dizzy_face:', value: skySoloInsaneDeaths, inline: true  },
          { name: 'Solo Insane K/D :dart:', value: skySoloInsaneKD.toFixed(2), inline: true },
          { name: 'Solo Insane Wins :trophy:', value: skySoloInsaneWins, inline: true },
          { name: 'Solo Insane Losses :no_entry_sign:', value: skySoloInsaneLosses, inline: true },
          );

          msg.channel.send(embed);
      }
    }
  });
}

// Gets stats from League of Legends API
function lolTracker(args, msg) {
  var request = require('request');
  //   var region = args[2];
  var name = args[2];

  // Getting summoner info from SUMMONER-V4 API
  var options = {
    'method': 'GET',
    'url': 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + name + '?api_key=' + private.LEAGUE_API_KEY,
  };
  request(options, function (error, response) { 
    if (error) throw new Error(error);
    
    var summonerBody = JSON.parse(response.body);
   
    var status = summonerBody.status;
    if(status != undefined){
      msg.channel.send("Error: " + status.message);
      return;
    }
    
    var accountId = summonerBody.accountId;
    var summonerId = summonerBody.id;

    // Getting match info/ history from MATCH-V4 API
    var options2 = {
      'method': 'GET',
      'url': 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountId + '?api_key=' + private.LEAGUE_API_KEY,
    };
    request(options2, function (error, response2) { 
      if (error) throw new Error(error);

      // Gets match data of player
      var matchBody = JSON.parse(response2.body);
      var matches = matchBody.matches;

      // Sends error if user doesn't have any matches
      if(matches == undefined){
        msg.channel.send('Error');
        return;
      }

      // Finds all champions played, finds most common one
      var champions = []
      matches.forEach(item => champions.push(item.champion));
      var mostUsedChamp = ChIDToName(mode(champions));
      
      // Gets info from LEAGUE-V4 API
      var options3 = {
        'method': 'GET',
        'url': 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerId + '?api_key=' + private.LEAGUE_API_KEY,
      };
      request(options3, function (error, response3) { 
        if (error) throw new Error(error);

        var leagueString = response3.body;
        var leagueJSONArray = JSON.parse(leagueString);
        var leagueJSON = undefined;
        if (leagueJSONArray.length > 0) {
          leagueJSON = leagueJSONArray[0];
        }

        // Calls method to make league embed
        leagueStatsEmbed(msg, summonerBody, leagueJSON, matchBody, mostUsedChamp);
      });
    });
  });
}

// Sends an embed with League of Legends stats
function leagueStatsEmbed(msg, summonerBody, leagueJSON, matches, mostUsedChamp) {
  var leagueEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('League of Legends Stats')
  .setAuthor('Statify', config.logoTransparent, config.glitchLink)
  .addField('Name', summonerBody.name);
  
  // Adds rank if player has a rank
  if(leagueJSON != undefined){
    leagueEmbed.addField("Rank in " + leagueJSON.queueType, leagueJSON.tier + " "  + leagueJSON.rank);
  }
  
  leagueEmbed.addField('Summoner Level', summonerBody.summonerLevel)
  .addField('Games', matches.totalGames)
  .addField('Most used Champion', mostUsedChamp)
  .setTimestamp()
  .setFooter('Statify Game Stat Tracker', config.botPfp);

  msg.channel.send(leagueEmbed);
}

function ChIDToName(id) {
  switch(id){
    case 266: return "Aatrox"; break;
    case 412: return "Thresh"; break;
    case 23: return "Tryndamere"; break;
    case 79: return "Gragas"; break;
    case 69: return "Cassiopeia"; break;
    case 136: return "Aurelion Sol"; break;
    case 13: return "Ryze"; break;
    case 78: return "Poppy"; break;
    case 14: return "Sion"; break;
    case 1: return "Annie"; break;
    case 202: return "Jhin"; break;
    case 43: return "Karma"; break;
    case 111: return "Nautilus"; break;
    case 240: return "Kled"; break;
    case 99: return "Lux"; break;
    case 103: return "Ahri"; break;
    case 2: return "Olaf"; break;
    case 112: return "Viktor"; break;
    case 34: return "Anivia"; break;
    case 27: return "Singed"; break;
    case 86: return "Garen"; break;
    case 127: return "Lissandra"; break;
    case 57: return "Maokai"; break;
    case 25: return "Morgana"; break;
    case 28: return "Evelynn"; break;
    case 105: return "Fizz"; break;
    case 74: return "Heimerdinger"; break;
    case 238: return "Zed"; break;
    case 68: return "Rumble"; break;
    case 82: return "Mordekaiser"; break;
    case 37: return "Sona"; break;
    case 96: return "Kog'Maw"; break;
    case 55: return "Katarina"; break;
    case 117: return "Lulu"; break;
    case 22: return "Ashe"; break;
    case 30: return "Karthus"; break;
    case 12: return "Alistar"; break;
    case 122: return "Darius"; break;
    case 67: return "Vayne"; break;
    case 110: return "Varus"; break;
    case 77: return "Udyr"; break;
    case 89: return "Leona"; break;
    case 126: return "Jayce"; break;
    case 134: return "Syndra"; break;
    case 80: return "Pantheon"; break;
    case 92: return "Riven"; break;
    case 121: return "Kha'Zix"; break;
    case 42: return "Corki"; break;
    case 268: return "Azir"; break;
    case 51: return "Caitlyn"; break;
    case 76: return "Nidalee"; break;
    case 85: return "Kennen"; break;
    case 3: return "Galio"; break;
    case 45: return "Veigar"; break;
    case 432: return "Bard"; break;
    case 150: return "Gnar"; break;
    case 90: return "Malzahar"; break;
    case 104: return "Graves"; break;
    case 254: return "Vi"; break;
    case 10: return "Kayle"; break;
    case 39: return "Irelia"; break;
    case 64: return "Lee Sin"; break;
    case 420: return "Illaoi"; break;
    case 60: return "Elise"; break;
    case 106: return "Volibear"; break;
    case 20: return "Nunu"; break;
    case 4: return "Twisted Fate"; break;
    case 24: return "Jax"; break;
    case 102: return "Shyvana"; break;
    case 429: return "Kalista"; break;
    case 36: return "Dr. Mundo"; break;
    case 427: return "Ivern"; break;
    case 131: return "Diana"; break;
    case 223: return "Tahm Kench"; break;
    case 63: return "Brand"; break;
    case 113: return "Sejuani"; break;
    case 8: return "Vladimir"; break;
    case 154: return "Zac"; break;
    case 421: return "Rek'Sai"; break;
    case 133: return "Quinn"; break;
    case 84: return "Akali"; break;
    case 163: return "Taliyah"; break;
    case 18: return "Tristana"; break;
    case 120: return "Hecarim"; break;
    case 15: return "Sivir"; break;
    case 236: return "Lucian"; break;
    case 107: return "Rengar"; break;
    case 19: return "Warwick"; break;
    case 72: return "Skarner"; break;
    case 54: return "Malphite"; break;
    case 157: return "Yasuo"; break;
    case 101: return "Xerath"; break;
    case 17: return "Teemo"; break;
    case 75: return "Nasus"; break;
    case 58: return "Renekton"; break;
    case 119: return "Draven"; break;
    case 35: return "Shaco"; break;
    case 50: return "Swain"; break;
    case 91: return "Talon"; break;
    case 40: return "Janna"; break;
    case 115: return "Ziggs"; break;
    case 245: return "Ekko"; break;
    case 61: return "Orianna"; break;
    case 114: return "Fiora"; break;
    case 9: return "Fiddlesticks"; break;
    case 31: return "Cho'Gath"; break;
    case 33: return "Rammus"; break;
    case 7: return "LeBlanc"; break;
    case 16: return "Soraka"; break;
    case 26: return "Zilean"; break;
    case 56: return "Nocturne"; break;
    case 222: return "Jinx"; break;
    case 83: return "Yorick"; break;
    case 6: return "Urgot"; break;
    case 203: return "Kindred"; break;
    case 21: return "Miss Fortune"; break;
    case 62: return "Wukong"; break;
    case 53: return "Blitzcrank"; break;
    case 98: return "Shen"; break;
    case 201: return "Braum"; break;
    case 5: return "Xin Zhao"; break;
    case 29: return "Twitch"; break;
    case 11: return "Master Yi"; break;
    case 44: return "Taric"; break;
    case 32: return "Amumu"; break;
    case 41: return "Gangplank"; break;
    case 48: return "Trundle"; break;
    case 38: return "Kassadin"; break;
    case 161: return "Vel'Koz"; break;
    case 143: return "Zyra"; break;
    case 267: return "Nami"; break;
    case 59: return "Jarvan IV"; break;
    case 81: return "Ezreal"; break;
  }
}

function mode(array) {
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

bot.login(token);