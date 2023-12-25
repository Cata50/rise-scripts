// MODULE
var module = rise.registerModule("FakeLag", "Makes you look like lagging serversidedly - By Cata50");
module.registerSetting("mode", "Skip", "fall", ["fall", "jump", "both"]);

// FUNCTION onTick
module.handle("onTick", function () {
    var blink = rise.getModule("Blink");
    var speed = rise.getModule("Speed");
    var ground = player.isOnGround();
    var fall = player.getFallDistance();
    var mode = module.getSetting("Skip");

    if (mode === "fall") {
        if (speed && fall > 0 && fall <= 1.145) {
            rise.blink();
        } else {
            rise.dispatch();
        }
    } else if (mode === "jump") {
        if (speed && !ground && fall <= 0) {
            rise.blink();
        } else {
            rise.dispatch();
        }
    } else if (mode === "both") {
        if (!ground && fall <= 1.145) {
            rise.blink();
        } else {
            rise.dispatch();
        }
    }
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});
