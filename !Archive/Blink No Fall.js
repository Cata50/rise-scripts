// MODULE
var module = rise.registerModule("Blink No Fall", "test...");

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
