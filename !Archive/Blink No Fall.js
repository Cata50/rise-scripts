// MODULE
var module = rise.registerModule("Blink No Fall", "Hypixel Blink No Fall - By Cata50");

var started = false;
var blink = rise.getModule("Blink");
var nofall = rise.getModule("No Fall");

// FUNCTION ONTICK
module.handle("onTick", function () {
    var playerPos = player.getPosition();
    var y = Math.floor(playerPos.getY()) - 1;
    var blockPos = world.newBlockPos(playerPos.getX(), y, playerPos.getZ());

    var blockName = world.getBlockName(blockPos);

    var ground = player.isOnGround();

    if (ground) {
        if (blockName == "tile.air.name" && !started) {
            blink.setEnabled(true);
            nofall.setEnabled(true);
            rise.displayChat("Blinked");
            started = true;
        } else if (blockName != "tile.air.name" && started) {
            blink.setEnabled(false);
            nofall.setEnabled(false);
            rise.displayChat("Dispatched");
            started = false;
        }
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });

//current script is perfect if u r slowly walking to the edges and shit but when u r too fast (sprinting) the script update
//rate cant keep up and the execution for the code (blink enable) is delayed (by the time its enabled on air)
