// MODULE
var module = rise.registerModule("Dynamic Killaura", "Modifies Killaura reach based on certain conditions - By Cata50");

module.registerSetting("number", "Base reach", 3.25, 3, 6, 0.001);
module.registerSetting("number", "Sprint reach +", 0.3, 0, 1, 0.001);
module.registerSetting("number", "Jump reach +", 0.6, 0, 1, 0.001);
module.registerSetting("boolean", "Sneak check", true);
module.registerSetting("boolean", "Wall check", true);
module.registerSetting("boolean", "Liquid check", false);
module.registerSetting("boolean", "Web check", false);
module.registerSetting("boolean", "Ladder check", false);

var killaura = rise.getModule("Killaura");
var range = 3.0;

// FUNCTION ONTICK
module.handle("onTick", function () {
    var reach = module.getSetting("Base reach");
    var sprint = module.getSetting("Sprint reach +");
    var jump = module.getSetting("Jump reach +");
    var wall = module.getSetting("Wall check");
    var sneak = module.getSetting("Sneak check");
    var liquid = module.getSetting("Liquid check");
    var web = module.getSetting("Web check");
    var ladder = module.getSetting("Ladder check");

    var inSneak = player.isSneaking();
    var inWall = player.isCollidedHorizontally();
    var inLiquid = player.isInLava() || player.isInWater();
    var inWeb = player.isInWeb();
    var inLadder = player.isOnLadder();

    var ground = player.isOnGround();
    var forward = input.isKeyBindForwardDown();

    //Script Code
    if (sneak && inSneak) {
        range = reach;
    } else if (liquid && inLiquid) {
        range = reach;
    } else if (wall && inWall) {
        range = reach;
    } else if (web && inWeb) {
        range = reach;
    } else if (ladder && inLadder) {
        range = reach;
    } else if (!ground) {
        range = reach + jump;
    } else if (forward) {
        range = reach + sprint;
    } else {
        range = reach;
    }
    killaura.setSetting("range", range);
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});

//This module was originally meant to be created for the "Reach" module for closet cheating, but shit scripting API, ty Alan <3
//Made on OCT 13/2023 | Rise v6.0.23