// "use strict";
// import * as mxn from "./scripts/mixins.js"
import * as mxn from "./scripts/mixins.js";

console.log(":: Monster Slayer 2 ::");
let instanceCount = 0;

export class Character{
    constructor(name = String, maxHealth = Number, damage = Array){
        // instanceCount ++;

        this.card();
        
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

        this._health = this._progressText.textContent = value;
        this._setProgressBar();
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

    attack(target, dmg){
        if(this._health <= 0){
            // console.log(`${this._name} is dead; can not attack`);
            return NaN;
        }else if(!(target instanceof Character) || target.health <= 0){
            // console.log(`Target is dead, ${this.name} doesn't attack.`);
            return NaN;
        }

        if(dmg === undefined){
            dmg = getRandomIntInclusive(this._damage)
        }else{
            dmg = getRandomIntInclusive(dmg);
        }

        target.health -= dmg;

        return dmg;
    }

    card(){
        let card = newElem("section");
        card.classList.add("card");
        
        let picture = newElem("figure");
        picture.classList.add("icon");
        
        let progressOuter = newElem("div");
        progressOuter.classList.add("progressOuter");

        this._progressInner = newElem("div");
        this._progressInner.classList.add("progressInner");
        this._setProgressBar();
        
        this._progressText = newElem("p");
        this._progressText.textContent = this._health;

        progressOuter.append(this._progressInner);
        progressOuter.append(this._progressText);

        card.append(picture);
        card.append(progressOuter);

        // section.id = this._name;
        return card;
    }
    _setProgressBar(){
        let healthRatio = this._health / this._maxHealth;
        healthRatio = Math.floor(healthRatio * 100);
        // console.log(this._name,"'s health", healthRatio, "%");
        this._progressInner.style.width = healthRatio+"%";

        this._progressInner.style.backgroundColor = this._getBarColor(healthRatio);
    }
    _getBarColor(value = Number){
        let color = "#B2D732";

        switch (Math.floor(value/10)) {
            case 8:
                color = "#CBE432";
                break;
            case 7:
                color = "#E4F132";
                break;
            case 6:
                color = "#FEFE33";
                break;
            case 5:
                color = "#FDED2A";
                break;
            case 4:
                color = "#FDDC22";
                break;
            case 3:
                color = "#FCCB1A";
                break;
            case 2:
                color = "#FCBA12";
                break;
            case 1:
                color = "#FBA90A";
                break;
            case 0:
                color = "#FB9902";
                break;
        }

        return color;
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
        return super.attack(target, this._specialDamage);
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
    let button =  newElem("button");
    // button.addEventListener("click", demo);
    button.addEventListener("click", newCharacter);
    button.innerText = "Set";
    
    getContainer().append(button);
    
    // console.log("Set !")
}

tempTesting();

const pr = [];
// const player = new Playable();
// const monster = new Character();
function demo(){

    if(instanceCount <= 0){
        const player = new Playable("z", 500, [2, 5], [10, 20]);
        player.name = "Joko";
        getCardSection().append(player.card());
        pr.push(player);

        const monster = new Character("Monster", 250, [5, 20]);
        getCardSection().append(monster.card());
        pr.push(monster)

        instanceCount ++;
    }else{
        pr[0].attack(pr[1]);
        // player.attack(monster);
        // monster.attack(player);
    }

    // console.log("player hp:", player.health, "- monster hp:", monster.health)
}

function getContainer(){
    return document.querySelector(".container");
}

function getCardSection(){
    return document.querySelector("#cardSection");
}

function getFormSection(){
    return document.querySelector("#formSection");
}

const characters = [];
function newCharacter(  isPlayable = Boolean, name = String,
                        maxHealth = Number, damage = Array,
                        specialDamage = Array){
    
    isPlayable = true;
    // let c = new Playable();
    let c;
    if(isPlayable){
        c = new Playable(name, maxHealth, damage, specialDamage);
    }else{
        c = new Character(name,maxHealth, damage);
    }
    
    console.log(c);
    return c;
}// newCharacter

function createForm() {
    const form = newElem("section", "form");
    let label;
    let inner;
    
    const nameInput = newInput("text");
    nameInput.minLen(3).maxLen(20).isRequired(true);
    nameInput.placeholder = "Name";
    
    const healthInput = newInput("number").setMin(25).setMax(1000)
        .setStep(25).setPlaceholder("Total Health");

    // 
    const baseDmgContainer = newElem("section","baseDmg");
        let minDmgInput = newInput("number", "mnDmg").setMin(1).setPlaceholder("Min");
        let maxDmgInput = newInput("number", "mxDmg").setMin(2).setMax(25).setPlaceholder("Max");

        label = newElem("label").intrnlTxt("Base Damage:");
        inner = newElem("section").addLast(minDmgInput, maxDmgInput);
    
    baseDmgContainer.append();
    baseDmgContainer.addLast(label, inner);
    
    const specDmgContainer = newElem("section", "spDmg");
    minDmgInput = newInput("number", "minSpDmg").setMin(1).setPlaceholder("Sp. Min");
    maxDmgInput = newInput("number", "maxSpDmg").setMin(2).setMax(25).setPlaceholder("Sp. Max");
    specDmgContainer.append(minDmgInput);
    specDmgContainer.append(maxDmgInput);
    
    
    
    form.append(nameInput);
    form.append(healthInput);
    form.append(baseDmgContainer); 
    form.append(specDmgContainer); 

    // section.id = this._name;
    getFormSection().append(form);
}

createForm();
createForm();
createForm();
createForm();

function newElem(tag = String, ..._classes){
    const elem = document.createElement(tag);

    for(const k of _classes){
        elem.classList.add(k);
    }

    mxn.commonToAllElem(elem);

    return elem;
}

function newInput(_type = String, ..._classes){
    let input;

    if(_classes.length > 0)
        input = newElem("input", _classes);
    else
        input = newElem("input");

    switch(_type.toLowerCase()){
        case "text":
            mxn.forTxt(input);
            break;
        case "number":
            mxn.forNum(input);
            break;
    }

    mxn.commonToAllInputs(input);

    return input;
}

// function setInner(_inTxt = String, ...elems){
//     const sec = newElem("section");




// }











