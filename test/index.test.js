import chai from "chai";
const expect = chai.expect;
import { Character} from "../index.js";

describe("Monster Slayer 2", () => {

    describe("Character class", () => {
        let character = new Character();

        it("should return an object", () => {
            expect(character).to.be.an('object');
        });

        it("should return a string when name is called", () => {
            expect(character.name).to.be.a('string');
        });

        it("should return a number when health is called", () => {
            expect(character.health).to.be.a('number');
        });

        it("should return an array when damage is called", () => {
            expect(character.damage).to.be.an('array');
        });
    });// class

    describe("Character class methods", () => {
        let character = new Character();

        it("should have an attack that returns a number", () => {
            expect(character.attack()).to.be.a('number');
        });
    });// class methods
});