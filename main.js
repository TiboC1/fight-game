new Vue({
    el: '#app',
    data: {
        // initial game-state
        gameState: false,

        // player properties
        player: {
            health: 100,
            mana: 0
        },

        // monster properties
        monster: {
            health: 100,
        },
        log: [],
    },
    computed: {
        // watch to update player's health-bar
        playerHealth(){
            return {
                width: this.player.health + '%'
            }
        },

        // watch to update player's mana-bar
        playerMana() {
            return{
                width: this.player.mana + '%'
            }
        },

        // watch to update monster's health-bar
        monsterHealth(){
            return {
                width: this.monster.health + '%'
            }
        },
    },
    methods: {
        //function to reset stats and start new game
        newGame() {
            this.gameState = true;
            this.player.health = 100;
            this.player.mana = 0;
            this.monster.health = 100;
            this.log = [];
        },

        // function to simulate player's victory
        victory(){
            // check if player wants to play again
           if (confirm('You won, play again?')) {
               this.gameState = true;
               this.newGame()
            } else {
               this.monster.health = 0;
               this.gameState = false;
           }
        },

        // function to simulate player's defeat
        defeat(){
            if (confirm('You lost, play again?')) {
                this.gameState = true;
                this.newGame()
            } else {
                this.player.health = 0;
                this.gameState = false;
            }
        },

        // function to check if player has won, callback function at the end of every move by player
        checkVictory(){
            // check if monster's health is at 0
            if(this.monster.health > 0){
                setTimeout(() => {
                    this.monsterAttack();
                }, 500)
            } else {
                setTimeout(() => {
                    this.victory();
                }, 1000)
            }
        },

        // function to generate random number to decide damage output
        calculateDamage(param1, param2){
            const damage = Math.max(Math.floor(Math.random()* param2)+ 1, param1);
          return damage;
        },

        // function to simulate monster's attack, callback function called in checkVictory callback function
        monsterAttack(){
            // generate random number to decide damage output and subtract from player HP
            let number = this.calculateDamage(4, 12);
            this.player.health -= number;
            this.log.unshift({
                style: "monster-turn",
                description: `Monster attacked you for ${number} damage!`
            });
            // check if player is defeated
            if(this.player.health <= 0){
                this.defeat();
            }
        },

        // function to simulate player's standard attack
        playerAttack(){
            // generate random number to decide damage output
            let number = this.calculateDamage(3, 10);

            // subtract damage from monster HP
            this.monster.health -= number;

            // check if monster health goes below 0
            if(this.monster.health < 0){
                this.monster.health = 0
            }

            // check player's mana and add if not at max
            if(this.player.mana < 100){
                this.player.mana += 5;
            }
            this.log.unshift({
                style: "player-turn",
                description: `You attacked the monster for ${number} damage!`
            });
            this.checkVictory()
        },

        // function to simulate player's special attack, which costs mana
        playerSpecialAttack(){
            // generate random number to decide damage output
            let number = this.calculateDamage(15, 20);

            // check if player has enough mana and subtract dmg from monster HP, mana from player
            if(this.player.mana >= 20){
                this.monster.health -= number;
                this.player.mana -= 20;

                // check if monster health goes below 0
                if(this.monster.health < 0){
                    this.monster.health = 0
                }
                this.log.unshift({
                    style: "player-turn",
                    description: `You attacked the monster for ${number} damage!`
                });
                this.checkVictory()
            } else {
                alert('You need 20 mana to do a special attack');
            }
        },

        // function to simulate player's heal, which costs mana
        playerHeal(){
            // generate random number to heal
            let number = this.calculateDamage(10, 15);

            // check if player is at max health
            if(this.player.health >= 100){
                this.player.health = 100;
                this.log.unshift({
                    style: "player-turn",
                    description: `You are already at max health!`
                });
            } else {

                // check if player has enough mana to heal
                if(this.player.mana >= 10){
                    this.player.mana -= 10;
                    this.player.health += number;
                    this.log.unshift({
                        style: "player-turn",
                        description: `You healed for ${number} hitpoints!`
                    });
                    this.checkVictory();
                } else {
                    alert('You need 10 mana to heal.')
                }
            }
        },
    }
});