// "use strict";
import * as mxn from "./scripts/mixins.js";

console.log(":: Monster Slayer 2 ::");


const PLAYERS = [];
const MAX_PLAYERS = 1;
const DEFAULT_NAME = "Slayer_";
const DEFAULT_MONSTER_NAME = "TPiRCSaVaJ the Vicious";

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 20;
const MIN_DMG = 5;
const MAX_DMG = MIN_DMG * 10;
const MIN_SPDMG = MIN_DMG * 2;
const MAX_SPDMG = MAX_DMG * 10;
const MIN_HP = 25;
const MAX_HP = 1000;


// let heal_value = 75;
let fightStarted = true;
let monsterExist = false;
let monster;


/////////////////////////////////////////////////////////////////////
/////////////////////////// CLASS ///////////////////////////////////
/////////////////////////////////////////////////////////////////////
export class Character{
    _mark = "::: "; // used for output print, ignore

    constructor(name = String, maxHealth = Number, damage = Array){


        this._progressInner = newElem("div").setClass("progressInner");
        this._progressText = newElem("p").insideTxt(this._health);
        
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = this._maxHealth;
        this.damage = damage; // should be range [min, max]
    }
    
    get name(){
        return this._name;
    }
    set name(value){
        if(value.length < 3 || value === "***"){
            value = DEFAULT_NAME + (PLAYERS.length +1);
        }
        this._name = value;
    }

    get health(){
        return this._health;
    }
    set health(value){
        if(value <= 0){ 
            console.log(`${this._mark + this._name} loses the fight${this._mark.split( '' ).reverse( ).join( '' )}`);
            value = 0;
        }
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
        this._damage = [1,2];
        if(Array.isArray(value)){
            value = returnOnlyNumbers(value);
            if(value.length > 0) this._damage = value;
        }
    }

    // attack(target, dmg){
    attack(dmg){
        if(this._health <= 0 || this._enemy === undefined){
            // console.log(`${this._name} is dead; can not attack`);
            return NaN;
        }
        
        // let dmg;
        let logs = {};

        for(const  k of this._enemy){
            if(!(k instanceof Character) || k.health <= 0){
                console.log(`Target ${k.name} is out of this world`);
                continue;
            }

            if(dmg === undefined){
                dmg = getRandomIntInclusive(this._damage);
                console.log(`${this._mark + this._name} hits ${k.name} for ${dmg} points`);
            }else{
                dmg = getRandomIntInclusive(dmg);
                console.log(`${this._mark + this._name} blasts ${k.name} with ${dmg} points`);
            }
    
            k.health -= dmg;
            logs[k.name] = dmg;
        }
    
    }

    card(){
        let card = newElem("section").setClass("card");
        let cardInner = newElem("section");;

        let p = newElem("p").insideTxt(this._name);
        
        let picture = newElem("figure").setClass("icon");
        
        let progressOuter = newElem("div").setClass("progressOuter");

        this._setProgressBar(); // ?
        
        progressOuter.addLast(this._progressInner, this._progressText);
        cardInner.addLast(p, picture, progressOuter);
        card.addLast(cardInner);

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
                color = "#FD3A0F";
                break;
        }

        return color;
    }

    get enemy(){
        // console.log("getting enemy", this._enemy)
        return this._enemy;
    }
    set enemy(_target = Array = []){
        // console.log("setting enemy:", _target);
        this._enemy = _target;
    }
}// class Character

class Playable extends Character{
    killCount = 0;

    constructor(name, maxHealth, damage, specialDamage = Array){
        super(name, maxHealth, damage);
        
        this._mark = ":::::: "
        this.specialDamage = specialDamage;
        this._bttnBox = newElem("section")
            .setClass("bttnSection")
    }
    
    card(){
        let card = newElem("section").setClass("card");
        let cardInner = newElem("section");;
        let p = newElem("p").insideTxt(this._name);
        let picture = newElem("figure").setClass("icon");
        let progressOuter = newElem("div").setClass("progressOuter");

        let attkBttn = newElem("button")
            .insideTxt("Attack")
            .setId(`attk${PLAYERS.indexOf(this)}`)
            .setClass("attk");
        let spBttn = newElem("button")
            .insideTxt("Sp. Attack")
            .setId(`spAttk${PLAYERS.indexOf(this)}`)
            .setClass("spAttk");
        let healBttn = newElem("button")
            .insideTxt("Heal")
            .setId(`heal${PLAYERS.indexOf(this)}`)
            .setClass("heal");
        let gvUpBttn = newElem("button")
            .insideTxt("Give Up")
            .setId(`gvup${PLAYERS.indexOf(this)}`)
            .setClass("gvUp");
        
        progressOuter.addLast(this._progressInner, this._progressText);
        this._bttnBox.addLast(attkBttn, spBttn, healBttn, gvUpBttn);
        cardInner.addLast(p, picture, progressOuter, this._bttnBox);
        card.addLast(cardInner);

        for(const k of this._bttnBox.children){
            k.addEventListener("click", act);
        }
        this.disableButtons();

        return card;
    }
    _makePlayable(){
        return bttnBox;
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

    get health(){
        return super.health;
    }
    set health(value){
        super.health = value;

        if(this._health <= 0) this.disableButtons();
    }

    attack(dmg){
        super.attack(dmg);

        for(const k of this._enemy){
            if(k.health <= 0){
                // console.log(":: ",this._enemy)
                this.killCount++
            }
        }
        
        if(this.killCount === this._enemy.length) this.disableButtons();
    }

    heal(){
        let healValue = getHealAmount(this._maxHealth)
        console.log(`${this._mark + this._name} heals for ${healValue} points`);
        this.health += healValue;
    }

    giveUp(){
        console.log(`${this._mark + this._name} has given up.`);
        this.disableButtons();
    }

    enableButtons(){
        for(const k of this._bttnBox.children){
            k.disabled = false;
        }
    }
    disableButtons(){
        for(const k of this._bttnBox.children){
            k.disabled = true;
        }
    }

    specialAttack(){
        this.attack(this._specialDamage);
        // return super.attack(this._specialDamage);
    }
}

function newCharacter(  name = String,
    maxHealth = Number, damage = Array,
    specialDamage = Array, 
    isPlayable = Boolean = false){

let c;
if(isPlayable){
c = new Playable(name, maxHealth, damage, specialDamage);
}else{
c = new Character(name, maxHealth, damage);
}

// console.log(c);
return c;
}// newCharacter
function newPlayable(_attr){
return newCharacter(  
_attr.charName,
+_attr.totalHP,
[+_attr.minDmg, +_attr.maxDmg],
[+_attr.minSpDmg, +_attr.maxSpDmg], true);
}// newPlayable


/////////////////////////////////////////////////////////////////////
///////////////////////// DOM ELEMENTS //////////////////////////////
/////////////////////////////////////////////////////////////////////
function createForm() {
    // Remove create "addPlayer" Button
    removeAddPlayerBttn();

    const form = newElem("section").setClass("form");

    let minInput;
    let maxInput;
    let label;
    let inner;
    
    // Name Section
    const nameBox = newElem("section");
    const nameInput = newInput("text").setId("charName")
        .minLen(MIN_NAME_LENGTH)
        .maxLen(MAX_NAME_LENGTH)
        .setPlaceholder("N00bSl4yer96")
        .defaultVal(DEFAULT_NAME+(PLAYERS.length + 1))
        .isRequired(true);

    label = mkLabel("Name");
    nameBox.addLast(label, nameInput);
    
    // HP Section
    const  hpBox = newElem("section");
    const hpInput = 
        newInput("number").setId("totalHP").setMin(MIN_HP).setMax(MAX_HP).defaultVal(MIN_HP * 4)
        .setStep(25).setPlaceholder("Total Health").isRequired(true);
    label = mkLabel("Max HP");
    hpBox.addLast(label, hpInput);
        

    // Basic Damage Section
    const dmgBox = newElem("section").setClass("baseDmg");
    label = mkLabel("Base Damage:");
    
    minInput = newInput("number").setId("minDmg").setMin(MIN_DMG).setMax(MAX_DMG)
        .setStep(2).defaultVal(MIN_DMG).setPlaceholder("Min");
    maxInput = newInput("number").setId("maxDmg").setMin(MIN_DMG+1).setMax(MAX_DMG+10)
        .setStep(2).defaultVal(MIN_SPDMG).setPlaceholder("Max");
    inner = newElem("section").addLast(minInput, maxInput);

    dmgBox.addLast(label, inner);

    // Special Damage Section
    label = mkLabel("Special Base Damage:");
    
    minInput = newInput("number").setId("minSpDmg").setMin(MIN_SPDMG).setMax(MAX_SPDMG)
        .setStep(5).defaultVal(MIN_SPDMG).setPlaceholder("Sp. Min");
    maxInput = newInput("number").setId("maxSpDmg").setMin(MIN_SPDMG+1).setMax(MAX_SPDMG+10)
        .setStep(5).defaultVal(MIN_SPDMG*2).setPlaceholder("Sp. Max");
    inner = newElem("section").addLast(minInput, maxInput);
    
    const specDmgBox = newElem("section").setClass("spDmg").addLast(label, inner);
    
    // Button Section
    const bttn = newElem("button").setId("newChar").insideTxt("Create Char");
    bttn.addEventListener("click", getFormInfo);
    const bttnBox = newElem("section").addLast(bttn);
    
    
    // Add everything to DOM
    form.addLast(nameBox, hpBox, dmgBox, specDmgBox, bttn); 
    getFormSection().append(form); 
    // getCardSection().append(form);
    
    // Set add listeners to all Inputs
    const numInputs = form.parentElement.querySelectorAll('input');
    for(const k of numInputs){
        k.addEventListener("change", checkInput)
    }
    nameInput.addEventListener("keyup", checkInput)
    nameInput.focus();
}// createForm()

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

function addNewForm(e){
    const caller = (e.target !== undefined) ? e.target : e;

    const _nC = () => {

        startGameButton();
        if(PLAYERS.length < MAX_PLAYERS){
            let addPlayerBttn =  newElem("button").setId("addPlayer").insideTxt("New Slayer");
            addPlayerBttn.addEventListener("click", createForm);
            getContainer().append(addPlayerBttn);
            // if(confirm("Add another player ?"))
                // createForm();
        }
    }

    switch(caller.id){
        case "startBttn":
            createForm();
            // caller.disabled = true;
            caller.remove();
            // caller.hidden = true;
            break;
        case "newChar":
            _nC();
            break;
        default: // Temp keyup enter
            _nC();
            break;
    }

    
}

function keepRange(el){

    // Beware concatenation
    const [min, max] = (el.previousSibling == null) ?
        [el, el.nextSibling] : [el.previousSibling, el];
    
    let [minVal, maxVal] = [+min.value, +max.value];
    
    if(min.id.replace("Dmg", "").length === 3){
        // Range for Base Damage:

        if(minVal < MIN_DMG) minVal = MIN_DMG;
        else if(minVal > MAX_DMG) minVal = MAX_DMG;

        if(maxVal < MIN_DMG) maxVal = MIN_DMG + 1;
        else if(maxVal > MAX_DMG + 10) maxVal = MAX_DMG + 10;
        
        min.max = maxVal;
        if(min.max > MAX_DMG) min.max = MAX_DMG;
    }else {
        // Range for Special Damage:

        if(minVal < MIN_SPDMG) minVal = MIN_SPDMG;
        else if(minVal > MAX_SPDMG) minVal = MAX_SPDMG;

        if(maxVal < MIN_SPDMG) maxVal = MIN_SPDMG + 1;
        else if(maxVal > MAX_SPDMG + 10) maxVal = MAX_SPDMG + 10;

        min.max = maxVal;
    }
    
    max.style.color = (minVal > Number(max.value)) ? "red" : "";
    min.style.color = (maxVal < Number(min.value)) ? "red" : "";

    min.value = minVal;
    max.value = maxVal;

    // max.min = minVal + 1;
    max.min = minVal;
}// keepRange

function removeForm(){
    let _form = document.querySelector(".form");
    // console.log(":: form",_form);
    if(_form){
        _form.remove();
    }
}

function getFormInfo(e){
    // console.log("getting form info\n",e.target);
    // console.log("getting form info\n",e.target.parentElement);
    const info = (e.target !== undefined)
        ? e.target.parentElement.querySelectorAll('input')
        : e.parentElement.querySelectorAll('input');
    // console.log(info);
    
    const p = {
        charName : DEFAULT_NAME,
        totalHP : 100,
        minDmg : 1,
        maxDmg : 2,
        minSpDmg : 3,
        maxSpDmg : 4,
    };

    let allInputFilled = true;

    for(const k of info){
        mxn.commonToAllElem(k);
        // Discount required checking
        if( k.value === ""
            || (k.id === "charName" && k.value.length < MIN_NAME_LENGTH)){
            
            k.setPlaceholder("Required")
            allInputFilled = false;
            k.style.color = "red";
            
            if(k.id === "charName") k.focus();

            continue;
        }
        p[k.id] = k.value;
    }


    if(allInputFilled){
        if(PLAYERS.length < MAX_PLAYERS){
            PLAYERS.push(newPlayable(p));
            getCardSection().append(PLAYERS[PLAYERS.length -1].card());

            (PLAYERS.length >= MAX_PLAYERS) ? enterCombat() : addNewForm(e);
        }
    }else{
        return;
    }

    
    // console.log(info[0].parentElement.parentNode)
    info[0].parentElement.parentNode.remove();
    return p;
}

function checkInput(e){
    // console.log(e);
    const t = e.target;
    
    switch(t.id){
        case "charName":
            if(t.value.length > MAX_NAME_LENGTH || t.value.length < MIN_NAME_LENGTH){
                t.value = t.value.substring(0, MAX_NAME_LENGTH);
                t.style.color = "red";
            }else
                t.style.color = "green";
            break;

        case "totalHP":
            if(t.value < MIN_HP) t.value = MIN_HP;
            else if(t.value > MAX_HP) t.value = MAX_HP;
            break;

        case "minDmg":
            keepRange(t);
            break;
        case "maxDmg":
            keepRange(t);
            break;
        case "minSpDmg":
            keepRange(t);
            break;
        case "maxSpDmg":
            keepRange(t);
            break;
    }

    if(e.keyCode === 13){
        getFormInfo(t.parentElement);
    }
}// checkInput

function getContainer(){
    return document.querySelector(".container");
}
function getCardSection(){
    return document.querySelector("#cardSection");
}
function getFormSection(){
    return document.querySelector("#formSection");
}
function newElem(tag = String, ..._classes){
    const elem = document.createElement(tag);

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
        case "radio":
            mxn.forRadio(input);
            break;
    }

    input.type = _type;
    mxn.commonToAllInputs(input);

    return input;
}
function mkLabel(_innerTxt){
    return newElem("label").insideTxt(_innerTxt);
}

function startGameButton(){
    if(document.querySelector("#startGameBttn") === null){
        let bttn = newElem("button").setId("startGameBttn").insideTxt("Attack Monster");
        bttn.addEventListener("click", enterCombat);
        getContainer().append(bttn);
    }
}
function removeStartGameButton(){
    let rsgBttn = document.querySelector("#startGameBttn");
    return (rsgBttn === null) ? undefined : rsgBttn.remove();
}
function removeAddPlayerBttn(){
    removeForm();
    let rapBttn = document.querySelector("#addPlayer");
    return (rapBttn === null) ? undefined : rapBttn.remove();
}

/////////////////////////////////////////////////////////////////////
////////////////////////// COMBAT ///////////////////////////////////
/////////////////////////////////////////////////////////////////////
function init() {

    let startBttn =  newElem("button").setId("startBttn").insideTxt("Start");
    // button.addEventListener("click", newCharacter);
    startBttn.addEventListener("click", addNewForm);
    
    getContainer().append(startBttn);
    
    // console.log("Set !")
}

function act(e){
    // console.log(e);
    if(e.target){
        let action = e.target.id;
        let index = -1;
        let retaliate = true;
        
        if (action.includes("attk")){
            index = +(action.replace("attk", ""));
            PLAYERS[index].attack();
        }else if(action.includes("spAttk")){
            index = +(action.replace("spAttk", ""));
            PLAYERS[index].specialAttack();
        }else if(action.includes("heal")){
            index = +(action.replace("heal", ""));
            PLAYERS[index].heal();
        }else if(action.includes("gvup")){
            if(confirm("Declare forfeit ?")){

                index = +(action.replace("gvup", ""));
                PLAYERS[index].giveUp();
                retaliate = false;
            }
            return;
        }else if(action.includes("reset")){
            resetCombat();
            return;
        } else{
            return;
        }

        if(retaliate){
            monster.enemy = [PLAYERS[index]];
            monster.attack();
        }
    }
    // console.log(e.target);
}
function resetCombat(){
    // console.log("Game Reset");
    if(confirm("Restart combat ?")){
        console.log('\n##### -New- Game #####')
        for(const k of PLAYERS){
            k.health = MAX_HP * 999;
            k.killCount = 0;
            k.enableButtons();
        }
        monster.health = MAX_HP * 999;
    }
}

function enterCombat(e){
    if(fightStarted){

    let tmpBttn = newElem("button")
        .setId("reset")
        .insideTxt("Reset");
    tmpBttn.addEventListener("click", act)
    getContainer().append(tmpBttn);

    removeStartGameButton()
    removeAddPlayerBttn();

    const allPlayerDmg = []; // use to calculate monster healt
    const allPlayerHealth = []; // use to calculte monster damage

    for(const k of PLAYERS){
        allPlayerDmg.push(k.damage);
        allPlayerDmg.push(k.specialDamage);
        allPlayerHealth.push(+k.health);
    }

    monster = newCharacter(DEFAULT_MONSTER_NAME,
            calcMonsterHP(allPlayerDmg, allPlayerHealth), 
            calcMonsterDmg(allPlayerHealth));
    spawnMonster(monster);
    
    defineEnemies();

    fightStarted = false;
    } // if DoOnce
}
function calcMonsterDmg(arr){
    let min = arr[0];
    let avg = 0;

    for(const k of arr){
        min = min < +k ? min : k;
        avg += +k;
    }

    min = Math.round((min / arr.length) / 4);
    avg = Math.round((avg / arr.length) / 2);

    // console.log("min", min,"avg", avg);

    // return [Math.round(min/3), avg];
    return [Math.round(min/4), (avg/2)];
}
function calcMonsterHP(_playerDmg, _playerHealth){
    let mHP = 0;
    let totalMinDmg = 0;
    let totalMaxDmg = 0;

    for(const k of _playerDmg){
        totalMinDmg += k[0];
        totalMaxDmg += k[1];
    }
    // console.log("totalavgMin",totalMinDmg);
    // console.log("totalavgMax",totalMaxDmg);
    mHP = (totalMinDmg + totalMaxDmg) * (2 * _playerHealth.length);
    mHP = mHP < calcMinValue(_playerHealth) ? mHP * 2 : mHP;

    return mHP;
}
function calcMinValue(arr){
    let min = arr[0];

    for(const k of arr)
        min = min < k ? min : k;

    return min;
}
function spawnMonster(_monster){
    if(monsterExist) return;

    // console.log(_monster);
    monsterExist = true;
    getCardSection().prepend(_monster.card());
}
function defineEnemies(){
    for(const k of PLAYERS){
        k.enemy = [monster];
        k.enableButtons();
    }
    // monster.enemy = PLAYERS;
}
function getHealAmount(_maxHP){
    let heal_value = Math.round(_maxHP / 2);
    return heal_value;
}

/////////////////////////////////////////////////////////////////////
//////////////////////////// UTILITIES //////////////////////////////
/////////////////////////////////////////////////////////////////////

init();

// TO DO:
// check monster stats with min/max constants ***************
// unique names for players.
// update reset function to "real" reset
// (and/or return to player select)




