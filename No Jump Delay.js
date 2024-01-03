// MODULE
var module = rise.registerModule("No Jump Delay", "Removes the jump delay when holding down spacebar");

// FUNCTION ONTICK
module.handle("onTick", function () {
    if (player.isOnGround() && input.isKeyBindJumpDown() && !player.isInWater() && !player.isInLava()) {
        player.jump();
    }

    if (rise.getModule("Speed").isEnabled() && player.isMoving() && player.isOnGround()) {
        player.jump();
    }
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});
