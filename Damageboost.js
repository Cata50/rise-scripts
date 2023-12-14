// MODULE
var module = rise.registerModule("Damage boost", "By Cata50");
module.registerSetting("mode", "Mode", "Add", ["Add", "Set", "Fly"]);
module.registerSetting("number", "flight time", 1.1, 1, 3, 0.001);
module.setSettingVisibility("flight time", false);
module.registerSetting("mode", "Debug", "Disabled", ["Disabled", "All", "Hurt"]);

for (var i = 1; i <= 10; i++) {
    module.registerSetting("boolean", "Tick " + i, false);
    module.registerSetting("mode", "t" + i + " mode", "air", ["air", "all"]);
    module.registerSetting("number", "t" + i + " speed", 0.01, 0, 1, 0.001);
    module.setSettingVisibility("t" + i + " mode", false);
    module.setSettingVisibility("t" + i + " speed", false);
}

// Var for Module Flight
var flight = rise.getModule("Flight");
var flightTime = 0;

// FUNCTION ONTICK
module.handle("onTick", function (e) {
    var mode = module.getSetting("Mode");
    if (mode === "Fly") {
        module.setSettingVisibility("flight time", true);
    } else {
        module.setSettingVisibility("flight time", false);
    }
    // Flight mode
    if (flightTime > 0) {
        flightTime--;
        if (flightTime <= 0) {
            flight.setEnabled(false);
        }
    }

    hurt = player.getHurtTime();
    var playerSpeed = player.getSpeed();

    for (var i = 1; i <= 10; i++) {
        var t = module.getSetting("Tick " + i);
        module.setSettingVisibility("t" + i + " mode", t);
        module.setSettingVisibility("t" + i + " speed", t);
    }

    // Debug Mode
    var debug = module.getSetting("Debug");

    if (debug) {
        var debugMode = module.getSetting("Debug");

        if (debugMode === "Hurt" && hurt >= 1) {
            for (var i = 1; i <= 10; i++) {
                if (module.getSetting("Tick " + i) && hurt === 11 - i) {
                    var tickMode = module.getSetting("t" + i + " mode");
                    if (tickMode === "air" && !player.isOnGround()) {
                        rise.displayChat("\u00A7a" + i); // Green §a
                    } else if (tickMode === "all") {
                        rise.displayChat("\u00A7a" + i); // Green §a
                    } else {
                        rise.displayChat("\u00A7c" + i); // Red §c (default color)
                    }
                }
            }
        } else if (debugMode === "All" && hurt >= 1) {
            for (var i = 1; i <= 10; i++) {
                if (module.getSetting("Tick " + i)) {
                    if (hurt === 11 - i) {
                        var tickMode = module.getSetting("t" + i + " mode");
                        if (tickMode === "air" && !player.isOnGround()) {
                            rise.displayChat("\u00A7a" + i); // Green §a
                        } else if (tickMode === "all") {
                            rise.displayChat("\u00A7a" + i); // Green §a
                        } else {
                            rise.displayChat("\u00A7c" + i); // Red §c (default color)
                        }
                    }
                } else {
                    if (hurt === 11 - i) {
                        rise.displayChat("\u00A7f" + i); // White
                    }
                }
            }
        }
    }
});


// FUNCTION ONSTRAFE
module.handle("onStrafe", function (e) {
    var ground = player.isOnGround();
    var moduleMode = module.getSetting("Mode");
    var playerSpeed = player.getSpeed();
    var flightNumber = module.getSetting("flight time");

    for (var i = 1; i <= 10; i++) {
        var t = module.getSetting("Tick " + i);
        var tm = module.getSetting("t" + i + " mode");
        var ts = module.getSetting("t" + i + " speed");

        // Script Code
        if (moduleMode === "Set") {
            if (t && ((!ground && tm === "air") || (tm === "all")) && hurt === 11 - i) {
                e.setSpeed(ts);
            }
        } else if (moduleMode === "Add") {
            if (t && ((!ground && tm === "air") || (tm === "all")) && hurt === 11 - i) {
                e.setSpeed(playerSpeed + ts);
            }
        }    // Flight Code
        else if (moduleMode === "Fly") {
            if (t && ((!ground && tm === "air") || (tm === "all")) && hurt === 11 - i) {
                // Set Flight Speed
                rise.getModule("Flight").setSetting("speed", ts);
                // Enable Flight for 0.05 seconds
                flight.setEnabled(true);
                flightTime = flightNumber;
            }
        }
    }
    return e;
});


// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});