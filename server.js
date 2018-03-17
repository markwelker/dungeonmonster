const express = require('express');
const bodyParser = require('body-parser');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('dist'))

let party = [];
let partyId = 0;
let npcs = [];
let npcId = 0;
let creatureList = [];
let chatMessages = [];

// setup some random data
let doImport = true;

function addPlayer(name, imagepath, sheetpath, maxhp) {
  party.push({
    name: name,
    picture: imagepath,
    sheet: sheetpath,
    maxhp: maxhp,
    hp: maxhp,
    id: partyId++,
  });
}

function addNPC(name, species) {
  fetch("http://www.dnd5eapi.co/api/monsters/?name=" + species).then(response => {
    return response.json();
  }).then(npc => {
    var specAbil = [];
    if (npc.special_abilities !== undefined) {
      for(feature in npc.special_abilities){
        specAbil.push({name:feature.name, desc: feature.desc});
      }
    }
    var act = [];
    for(item in npc.actions){
      act.push({name: item.name, desc: item.desc});
    }
    npcs.push({
      name: name,
      id: npcId++,
      species: species,
      size: npc.size,
      type: npc.type,
      subtype: npc.subtype,
      alignment: npc.alignment,
      ac: npc.armor_class,
      maxhp: npc.hit_points,
      hp: npc.hit_points,
      stats: {
        str: npc.strength,
        dex: npc.dexterity,
        con: npc.constitution,
        int: npc.intelligence,
        wis: npc.wisdom,
        cha: npc.charisma,
      },
      special: specAbil,
      actions: act,
    });
  });
}

function addChatMessage(plr, msg){
  chatMessages.push({player: plr, message: msg});
}

function importData() {
  fetch("http://www.dnd5eapi.co/api/monsters/").then(response => {
    return response.json();
  }).then(json => {
    console.log(json);
    for(creature in json){
      creatureList.push(creature.name);
    }
    addNPC('Grogg', 'Orc');
    addNPC('Flubber', 'Ochre Jelly');
    addNPC('Whinny', 'Warhorse');
  });
  addPlayer("Fighter", "../assets/pdf/Fighter.png", "../assets/Fighter.pdf", 50);
  addPlayer("Bard", "../assets/pdf/Bard.png", "../assets/Bard.pdf", 30);
  addPlayer("Cleric", "../assets/pdf/Cleric.png", "../assets/Cleric.pdf", 45);
  addPlayer("Wizard", "../assets/pdf/Wizard.png", "../assets/Wizard.pdf", 25);

  addChatMessage("DM", "Are you sure you want to touch that?");
  addChatMessage("Fighter", "Yes, yes I am.");
  addChatMessage("Cleric", "Oh no you aren't!");
  addChatMessage("Fighter", "But why not?");
  addChatMessage("Cleric", "You don't even know where that's been!");
  addChatMessage("Wizard", "...or if it is magically protected.");
  addChatMessage("Bard", "You're all a bunch of party-poopers, I say let him do what he wants!");
  addChatMessage("Fighter", "Yeah! Let me pick it up!");
  addChatMessage("DM", "Does anyone try to stop him?");
  addChatMessage("Cleric", "I try to grapple the Fighter.");
  addChatMessage("DM", "OK, make a strength check.");
  addChatMessage("Cleric", "*rolls 1d20+1: 3");
  addChatMessage("Cleric", "No!");
  addChatMessage("Wizard", "Uh oh!");
  addChatMessage("Bard", "Yeah baby!");
  addChatMessage("Fighter", "Hahaha! I laugh at your puny arms and pick up the artifact!");
  addChatMessage("Cleric", "...");
  addChatMessage("DM", "...");
  addChatMessage("DM", "Nothing happens.");
  addChatMessage("Fighter", "Really, nothing? Then why'd you make a big deal about not touching it?");
  addChatMessage("DM", "Oh you'll see.");
  addChatMessage("Bard", "Well that's not ominous or anything...");
  addChatMessage("Cleric", "Wait, wasn't it in the gelatinous cube earlier?");
  addChatMessage("Fighter", "What even is this thing anyways?");
  addChatMessage("DM", "It appears to be a small cube of some sort, with some small buttons on one side.");
  addChatMessage("Wizard", "Do the buttons have any sort of markings?");
  addChatMessage("DM", "Yes, make a history check.");
  addChatMessage("Wizard", "*rolls 1d20+7: 22");
  addChatMessage("DM", "You remember seeing these types of symbols in some books on the ancient empire.");
  addChatMessage("Wizard", "Do they look like the symbols on the note we got earlier?");
  addChatMessage("DM", "Yes, they do!");
  addChatMessage("Bard", "Aha! I press the buttons in the sequence found on the note.");
  addChatMessage("DM", "The cube opens up and releases a horrid smelling substance on you.");
  addChatMessage("Bard", "Agh! This is the second time this week that I'll be washing this!");
  addChatMessage("DM", "You hear slurping sounds from the next hallway... a lot of slurping.");
}

if (doImport) {
  importData();
}

app.get('/api/party', (req, res) => {
  res.send(party);
  console.log("party accessed");
});

app.get('/api/npcs', (req, res) => {
  res.send(npcs);
  console.log("npcs accessed");
});

app.get('/api/creatures', (req, res) => {
  res.send(creatureList);
  console.log("creature list accessed");
});

app.get('/api/chat', (req, res) => {
  res.send(chatMessages);
  console.log("chat accessed");
});

app.put('/api/party/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let partyMap = party.map(item => {
    return item.id;
  });
  let index = partyMap.indexOf(id);
  let player = party[index];
  player.name = req.body.name,
  player.picture = req.body.imagepath;
  player.sheet = req.body.sheetpath;
  player.maxhp = req.body.maxhp;
  player.hp = req.body.maxhp;
  res.send(player);
});

app.post('/api/chat', (req, res) => {
  message = {
    player: req.body.player,
    message: req.body.message,
  };
  chatMessages.push(message);
  res.send(message);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
