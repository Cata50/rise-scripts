// MODULE
var module = rise.registerModule("00 Breaker", "00 velo w/ breaker");

// FUNCTION ONTICK
module.handle("onTick", function () {
    var breaker = rise.getModule("Breaker");
    var velo = rise.getModule("Velocity");

    if (breaker.isEnabled()) {
        velo.setSetting("Mode", "Watchdog");
    } else {
        velo.setSetting("Mode", "Standard");
    }

});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
