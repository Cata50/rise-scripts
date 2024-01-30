// MODULE
var module = rise.registerModule("Fake Lag", "Makes you look like lagging serversidedly - By Cata50");

// FUNCTION ONTICK
module.handle("onTick", function () {
    if (rise.getModule("Speed").isEnabled() && player.getFallDistance() > 0 && player.getFallDistance() < 0.145) {
        rise.blink();
    } 
	
	if (rise.getModule("Speed").isEnabled() && player.getFallDistance > 0.145) {
        rise.dispatch();
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });