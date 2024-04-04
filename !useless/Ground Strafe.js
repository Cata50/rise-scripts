// MODULE
var module = rise.registerModule("Ground Strafe", "");

// FUNCTION ONTICK
module.handle("onTick", function () {
    var ground = player.isOnGround();
    var strafe = rise.getModule("Strafe");
    var hurt = player.getHurtTime();

    if (ground && hurt == 0) {
        strafe.setEnabled(true);
    } else {
        strafe.setEnabled(false);
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
