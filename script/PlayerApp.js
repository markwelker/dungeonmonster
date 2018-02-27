function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

var PlayerApp = new Vue({
      el: '#player-app',
      data: {
        selection: 0,
        players: [],
      },

      created: function() {
        this.addPlayer("Fighter", "../assets/Fighter.png", "../assets/Fighter.pdf", 50);
        this.addPlayer("Bard", "../assets/Bard.png", "../assets/Bard.pdf", 30);
        this.addPlayer("Cleric", "../assets/Cleric.png", "../assets/Cleric.pdf", 45);
        this.addPlayer("Wizard", "../assets/Wizard.png", "../assets/Wizard.pdf", 25);
      },

      methods: {
        addPlayer: function(name, imagepath, sheetpath, maxhp) {
          var playerID = (this.players.length);
          this.players.push({
            name: name,
            profile: imagepath,
            sheet: sheetpath,
            maxhp: maxhp,
            hp: maxhp,
            id: playerID
          });
        },

        heal: function(x) {
          var amount = ""
          while(!isInt(amount)){
            amount = prompt("Heal how much?", 0);
          }
          amount = parseInt(amount, 10);
          this.players[x].hp += amount;
          if(this.players[x].hp > this.players[x].maxhp){
            this.players[x].hp = this.players[x].maxhp;
          }

        },

        damage: function(x) {
          var amount = ""
          while(!isInt(amount)){
            amount = prompt("Take how much?", 0);
          }
          amount = parseInt(amount, 10);
          this.players[x].hp -= amount;
        },

        select: function(x) {
          console.log("Selected: " + x);
          this.selection = x;
          var newSheet = this.players[this.selection].sheet;
          swapCharSheets(newSheet);
        },

        swapCharSheets: function(newSheet){
        	var oldSheet=document.getElementById("charsheet");
        	var clone=oldSheet.cloneNode(true);
        	clone.setAttribute('src', newSheet);
        	oldSheet.parentNode.replaceChild(clone,oldSheet);
        }
      },
    });
