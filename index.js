"use strict";
console.log(":: Monster Slayer 2 ::");
let instanceCount = 0;

export class Character{

    constructor(name = String, maxHealth = Number, damage = Array){
        instanceCount ++;

        this.name = name;
        this.maxHealth = maxHealth;
        this.health = this._maxHealth;
        this.damage = damage; // should be range [min, max]
    }
    
    get name(){
        return this._name;
    }
    set name(value){
        if(value.length < 3){
            value = `Anon${instanceCount}`;
        }
        this._name = value;
    }

    get health(){
        return this._health;
    }
    set health(value){
        if(value < 0) value = 0;
        else if(value > this._maxHealth) value = this._maxHealth;

        this._health = value;
    }
    /**
     * @param {number} value
     */
    set maxHealth(value) {
        if(isNaN(value) || value < 0) value = 100;
        this._maxHealth = value;
    }

    get damage(){
        return this._damage;
    }
    set damage(value){
        this._damage = [1];
        if(Array.isArray(value)){
            value = returnOnlyNumbers(value);
            if(value.length > 0) this._damage = value;
        }
    }

    attack(target, value){
        if(this._health <= 0){
            console.log(this._name,"is dead; can not attack");
            return;
        }

        let dmg = 0;
        if(value === undefined){
            dmg = getRandomIntInclusive(this._damage)
        }else{
            dmg = getRandomIntInclusive(value);
        }

        target.health -= dmg;
    }

    card(){
        let card = document.createElement("section");
        card.classList.add("card");
        
        let picture = document.createElement("figure");
        picture.classList.add("icon");
        
        let progressOuter = document.createElement("div");
        progressOuter.classList.add("progressOuter");

        this._progressInner = document.createElement("div");
        this._progressInner.classList.add("progressInner");
        
        this._progressText = document.createElement("p");
        this._progressText.innerText = this._health;

        this._progressInner.append(this._progressText);
        
        progressOuter.append(this._progressInner);

        card.append(picture);
        card.append(progressOuter);

        // section.id = this._name;
        return card;
    }
}// class Character

class Playable extends Character{
    constructor(name, maxHealth, damage, specialDamage = Array){
        super(name, maxHealth, damage);
        this.specialDamage = specialDamage;
    }

    get specialDamage(){
        return this._specialDamage;
    }
    set specialDamage(value){
        this._specialDamage = [1];
        if(Array.isArray(value)){
            value = returnOnlyNumbers(value);
            if(value.length > 0) this._specialDamage = value;
        }
    }

    specialAttack(target){
        return this.attack(target, this._specialDamage);
    }
}

function getRandomIntInclusive(value = Array) {
    if(!Array.isArray(value)){
        return 1;
    }

    // "...value" because Array
    let min = Math.min(...value) < 1 ? 1 : Math.ceil(Math.min(...value));
    let max = Math.max(...value) < 1 ? 1 : Math.floor(Math.max(...value));

    // (Partial thanks to MDN)
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}// getRandomIntInclusive

function returnOnlyNumbers(value = Array){
    let filtered = [];

    if(Array.isArray(value)){
        for(const k of value){
            if(!isNaN(k)) filtered.push(Number(k));
        }
    }

    return filtered;
}// returnOnlyNumbers


function tempTesting(){
    let button =  document.createElement("button");
    button.addEventListener("click", makeNewChar);
    button.innerText = "Set";
    
    getContainer().append(button);
    
    // console.log("Set !")
}

tempTesting();

let player;
let monster;
function makeNewChar(){
    // let char = new Character("Eric", 127, [2, 5]);
    let char;
    switch(instanceCount){
        case 0:
            player = char = new Playable("z", 100, [2, 5], [10, 20]);
            
            break;
        case 1:
            monster = char = new Character("Monster", 250, [5, 20]);
            break;
        default:
            player.specialAttack(monster);
            monster.attack(player);
            console.log("p:", player.health)
            console.log("m:", monster.health)

    }

    if(char instanceof Character){
        console.log(char);
        getCardSection().append(char.card());

    }
}

function getContainer(){
    return document.querySelector(".container");
}

function getCardSection(){
    return document.querySelector("#cardSection");
}










