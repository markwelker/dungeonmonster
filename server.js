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

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const db = require('knex')(config);

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.SECRET_TOKEN;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  db.destroy();
  process.exit();
}

let party = [];
let partyId = 0;
let npcs = [];
let npcId = 0;
let creatureList = [];
let creatureDatabase = [];
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
  for (var i = 0; i < creatureDatabase.length; i++) {
    let npc = creatureDatabase[i];
    if (species == npc.name) {
      npcs.push({
        name: name,
        species: npc,
        curr_hp: npc.hit_points,
        id: npcId++,
      });
    }
  }
}

function fetchCreature(species) {
  fetch("http://www.dnd5eapi.co/api/monsters/?name=" + species).then(res => {
    res.json().then(json => {
      var url = json.results[0].url;

      addCreature(url);
    });
  });
}

function addCreature(url) {
  fetch(url).then(response => {
    return response.json();
  }).then(npc => {
    console.log("importing data for: " + npc.name);
    creatureDatabase.push(npc);
  });
}

function addChatMessage(plr, msg) {
  chatMessages.push({
    player: plr,
    message: msg
  });
}

function importData() {
	fetch("http://www.dnd5eapi.co/api/monsters/").then(response => {
		return response.json();
	}).then(json => {
		for (i = 0; i < json.count; i++) {
			let name = json.results[i].name;
			creatureList.push(name);
			fetchCreature(name);
		}
	});
	/*
	addPlayer("Fighter", "/static/images/Fighter.png", "/static/pdf/Fighter.pdf", 50);
	addPlayer("Bard", "/static/images/Bard.png", "/static/pdf/Bard.pdf", 30);
	addPlayer("Cleric", "/static/images/Cleric.png", "/static/pdf/Cleric.pdf", 45);
	addPlayer("Wizard", "/static/images/Wizard.png", "/static/pdf/Wizard.pdf", 25);

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
	*/
}

if (doImport) {
  importData();
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({
      error: 'No token provided.'
    });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({
        error: 'Failed to authenticate token.'
      });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

app.get('/api/party', (req, res) => {
  res.send(party);
  console.log("party accessed");
});

// Used to login players / DM
app.get('/api/player/:name', (req, res) => {
	console.log("Login Request Recieved");
  let name = req.params.name;
	console.log('accessing database, looking for "' + name + '"');
  db('players').select().from('players').where('name', name).then(player => {
		console.log('Found: "' + player + '" for "' + name + '"');
    var isDM = false;
    if (player == null || player == undefined || player == '') {
			res.status(403).send();
			return;
		}
    else {
			console.log("creating token");
      let token = jwt.sign({
        id: name
      }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      if (player.name == 'DM') isDM = true;
      res.status(200).json({
        name: player[0]['name'],
        token: token,
        isDM: isDM
      });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      error
    });
  });
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

app.get('/api/me', verifyToken, (req, res) => {
	db('players').select().from('players').where('name', req.name).then(player => {
		res.status(200).json({player: player});
	}).catch(error => {
		res.status(500).json({error});
	});
});

app.put('/api/party/:id', (req, res) => {

  let id = parseInt(req.params.id);
  let partyMap = party.map(item => {
    return item.id;
  });
  let index = partyMap.indexOf(id);
  let player = party[index];
  player.name = req.body.name;
  player.picture = req.body.picture;
  player.sheet = req.body.sheet;
  player.maxhp = req.body.maxhp;
  player.hp = req.body.hp;
  console.log("Sending Back Player:");
  console.log(player);
  res.send(player);
});

app.put('/api/npcs/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let npcsMap = npcs.map(item => {
    return item.id;
  });
  let index = npcsMap.indexOf(id);
  let npc = npcs[index];
  npc.curr_hp = req.body.curr_hp;
  res.send(npc);
});

// Used to register players
app.post('/api/player', (req, res) => {
  db('players').select().from('players').where('name', req.body.name).then(player => {
    if (player != null) res.status(409);
    return;
  });
  db('players').insert({
    name: req.body.name,
    password: req.body.password,
    class: req.body.class
  }).then(player => {
    let token = jwt.sign({
      id: req.body.name
    }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({
      name: player[0]['name'],
      token: token
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      error
    });
  });
});

app.post('/api/chat', verifyToken, (req, res) => {
  message = {
    player: req.body.player,
    message: req.body.message,
  };
	if(req.userID !== message.player)
	{
		res.status(403).send();
		return;
	}
  chatMessages.push(message);
  res.send(message);
});

app.post('/api/npcs', verifyToken, (req, res) => {
	if(req.userID !== 'DM'){
		res.status(403).send();
		return;
	}
  console.log("adding NPC");
  console.log(req.body);
  addNPC(req.body.name, req.body.species);
  res.send(npcs);
});

app.delete('/api/npcs/:id', (req, res) => {
  var id = parseInt(req.params.id);
  console.log(" DELETE: id: " + id + ", " + npcs[id].name);
  let npc = npcs[id];
  for (let i = id; i < npcs.length; i++) {
    npcs[i].id -= 1;
  }
  npcs.splice(id, 1);
  npcId--;
  res.send(npcs);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
