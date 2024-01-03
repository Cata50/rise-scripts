// MODULE
var module = rise.registerModule("FakeLag", "Makes you look like lagging serversidedly - By Cata50");

// FUNCTION onTick
module.handle("onTick", function () {
    var blink = rise.getModule("Blink");
    var speed = rise.getModule("Speed");
    var ground = player.isOnGround();
    var fall = player.getFallDistance();


    if (speed.isEnabled() && fall > 0 && fall <= 1.145) {
        rise.blink();
    } else {
        rise.dispatch();
    }
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});