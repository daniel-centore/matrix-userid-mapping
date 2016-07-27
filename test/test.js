var assert = require('chai').assert;

var muid = require("../index.js");

describe('#toMxid()', function() {
    it('Handles empty strings', function() {
        assert.equal('', muid.toMxid(""));
    });
    it('Handles all lowercase', function() {
        assert.equal('danielcentore', muid.toMxid("danielcentore"));
    });
    it('Escapes uppercase', function() {
        assert.equal('_daniel_centore', muid.toMxid("DanielCentore"));
    });
    it('Escapes underscores', function() {
        assert.equal('daniel__centore', muid.toMxid("daniel_centore"));
    });
    it('Escapes uppercase and underscores together', function() {
        assert.equal('_daniel___centore', muid.toMxid("Daniel_Centore"));
    });
    it('Passes .- and 0-9 unharmed', function() {
        assert.equal('0123456789.-', muid.toMxid("0123456789.-"));
    });
    it('Converts other ascii characters to =hex notation', function() {
        assert.equal('hello=20there', muid.toMxid("hello there"));
        assert.equal('hello=3dthere', muid.toMxid("hello=there"));
    });
    it('Converts 2 byte unicode characters to =hex notation', function() {
        assert.equal('=d0=9f=d1=80=d0=b8=d0=b2=d1=96=d1=82', muid.toMxid("Привіт"));
    });
    it('Converts 4 byte characters to =hex notation', function() {
        assert.equal('=f0=a9=b8=bd', muid.toMxid("𩸽"));
    });
    it('Handles mixed byte', function() {
        assert.equal('=d0=9f=d1=80=d0=b8=d0=b2=d1=96=d1=82___daniel__=f0=a9=b8=bd', muid.toMxid("Привіт_Daniel_𩸽"));
    });
    it('Converts tab character to =hex notation', function() {
        assert.equal('hello=09there', muid.toMxid("hello\tthere"));
    });
    it("Doesn't escape uppercase if escapeUpper=false", function() {
        assert.equal('danielcentore', muid.toMxid("DanielCentore", false));
    });
    it("Doesn't escape underscores if escapeUpper=false", function() {
        assert.equal('daniel_centore', muid.toMxid("daniel_centore", false));
    });
    it("Handles email addresses", function() {
        assert.equal('example.example=40gmail.com', muid.toMxid("example.example@gmail.com", false));
    });
});
describe('#fromMxid()', function() {
    var x = '';
    it('Reverses empty string', function() {
        assert.equal(x = '', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses all lowercase', function() {
        assert.equal(x = 'danielcentore', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses uppercase', function() {
        assert.equal(x = 'DanielCentore', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses underscores', function() {
        assert.equal(x = 'daniel_centore', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses uppercase and underscores together', function() {
        assert.equal(x = 'Daniel_Centore', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses .- and 0-9 unharmed', function() {
        assert.equal(x = '0123456789.-', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses other ascii characters', function() {
        assert.equal(x = 'hello there', muid.fromMxid(muid.toMxid(x)));
        assert.equal(x = 'hello=there', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses 2 byte unicode characters', function() {
        assert.equal(x = 'Привіт', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses 4 byte unicode characters', function() {
        assert.equal(x = '𩸽', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses mixed byte unicode characters', function() {
        assert.equal(x = 'Привіт_Daniel_𩸽', muid.fromMxid(muid.toMxid(x)));
    });
    it('Reverses tab character', function() {
        assert.equal(x = 'hello\tthere', muid.fromMxid(muid.toMxid(x)));
    });
    it('Mangles uppercase if escapeUpper=false', function() {
        assert.equal('danielcentore', muid.fromMxid(muid.toMxid('DanielCentore', false), false));
    });
    it("Doesn't treat underscore as escape if escapeUpper=false", function() {
        assert.equal(x = 'daniel_centore', muid.fromMxid(muid.toMxid(x, false), false));
    });
    it("Handles email addresses", function() {
        assert.equal(x = 'example.example@gmail.com', muid.fromMxid(muid.toMxid(x, false), false));
    });
    it("Errs on invalid underscore escape sequence", function() {
        assert.throws(function () {
            muid.fromMxid('hello_Pkd');
        }, Error, "Error");
    });
    it("Errs on invalid characters", function() {
        assert.throws(function () {
            muid.fromMxid('hello there');
        }, Error, "Error");
    });
});
