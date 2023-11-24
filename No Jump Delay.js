d// MODULE
var module = rise.registerModule("No Jump Delay", "Removes the jump delay when holding down spacebar");

// FUNCTION onTick
module.handle("onTick", function () {
    if (player.isOnGround() && input.isKeyBindJumpDown() && !player.isInWater() && !player.isInLava()) {
        player.jump();
    }
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});
