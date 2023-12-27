/*

 Exhibition Fork v2.1

 [+] Modules
  - Added Coke Display
  - Removed watermark x,y sliders
  - Added QOL (contains qol modules)

 [$] Quality of Life (QOL)
  - Cleaner module settings & first load
  - removed unfunctional/useless settings/modules (thanks Alan <3)

 Exhibition Fork v2

 [+] Modules
  - Watermark: Selectable extra info
  - Targethud: Steve skin texture
  - Removed Auto Oof, Debug?, Dev Mode
  - Added Armor Hud

 [$] Quality of Life (QOL)
  - Cleaner module layout on first load
  - [BETA] Fixed block counter integer posX
  - Improved code efficiency



 Exhibition v1.12 Fork

 [+] Modules
  - Information: Toggle release build with x, y sliders
  - Block Counter: New modes + theme color
  - TargetHUD: Recoded with x, y sliders ("new Slider" & "skullLess")
  - Arraylist: Cleaner, more modules, suffix
  - Watermark: Cleaner extra info + option to remove watermark (rise.setName(""))

 [!] Bug Fixes
  - Duplicate arraylist "left" alignment
  - Block counter not working (chat spam)

 [$] Quality of Life (QOL)
  - Cleaner module GUI
  - "Fork" module mode in arraylist
  - Custom watermark

*/

// MODULE
var module = rise.registerModule("Exhibition", "By Cata50 - v2.0.4 (QOL: Speed NJD)");
module.registerSetting("mode", "ScriptMode", "Fork", "Fork");
module.setSettingVisibility("ScriptMode", false);

// Settings
module.registerSetting("boolean", "Custom Font", false);
module.registerSetting("boolean", "Watermark", true);
module.registerSetting("boolean", "no watermark", true);
module.registerSetting("boolean", "colored letter", true);
module.registerSetting("mode", "extra info", "enabled optimized", "disabled", "enabled", "enabled optimized");
module.registerSetting("boolean", "Time", true);
module.registerSetting("boolean", "FPS", true);
module.registerSetting("boolean", "Ping", true);
module.registerSetting("boolean", "Arraylist", false);
module.registerSetting("mode", "arraylist color", "theme", "theme", "white");
module.registerSetting("mode", "arraylist alignment", "right", "right", "left");
module.registerSetting("number", "arraylist X", 957, 1, 1000);
module.registerSetting("number", "arraylist Y", 3, 1, 1000);
module.registerSetting("boolean", "suffix", true);
module.registerSetting("boolean", "Block Counter", false);
module.registerSetting("mode", "color mode", "colored", "colored", "white", "theme color");
module.registerSetting("number", "BC X", 475, 1, 1000);
module.registerSetting("number", "BC Y", 285, 1, 1000);
module.registerSetting("boolean", "Playtime", true);
module.registerSetting("number", "playtime X", 3, 1, 1000);
module.registerSetting("number", "playtime Y", 15, 1, 1000);
module.registerSetting("boolean", "Coke Display", false);
module.registerSetting("mode", "potion effect", "speed", "speed", "strength", "both");
module.registerSetting("number", "coke size", 10, 1, 20);
module.registerSetting("number", "coke X", 7, 0, 1000);
module.registerSetting("number", "coke Y", 80, 0, 1000);
module.registerSetting("boolean", "QoL", false);
module.registerSetting("boolean", "Speed NJD", false);
module.registerSetting("boolean", "Speed Y Port", false);
module.registerSetting("mode", "Bed ESP", "disabled", "disabled", "theme", "custom");
module.registerSetting("color", "esp color", [255, 255, 255]);
module.registerSetting("boolean", "breaker only", false);
module.registerSetting("number", "range", 5, 1, 7);
module.registerSetting("number", "cube size", 1, 0.1, 1, 0.1);
module.registerSetting("number", "thiccness", 1, 0.1, 10, 0.1);
module.registerSetting("number", "opacity", 255, 26, 255);

// Starting setting visibility
module.setSettingVisibility("arraylist color", false);
module.setSettingVisibility("arraylist alignment", false);
module.setSettingVisibility("arraylist X", false);
module.setSettingVisibility("arraylist Y", false);
module.setSettingVisibility("suffix", false);


module.setSettingVisibility("color mode", false);
module.setSettingVisibility("BC X", false);
module.setSettingVisibility("BC Y", false);

module.setSettingVisibility("Speed NJD", false);
module.setSettingVisibility("Speed Y Port", false);
module.setSettingVisibility("Bed ESP", false);
module.setSettingVisibility("esp color", false);
module.setSettingVisibility("breaker only", false);
module.setSettingVisibility("range", false);
module.setSettingVisibility("cube size", false);
module.setSettingVisibility("thiccness", false);
module.setSettingVisibility("opacity", false);

module.setSettingVisibility("potion effect", false);
module.setSettingVisibility("coke size", false);
module.setSettingVisibility("coke X", false);
module.setSettingVisibility("coke Y", false);

// Fonts
var mcFont = render.getMinecraftFontRenderer();
var badcache12 = render.getCustomFontRenderer("badcache", 12, true);
var badcache16 = render.getCustomFontRenderer("badcache", 16, true);
var badcache18 = render.getCustomFontRenderer("badcache", 18, true);
var badcache24 = render.getCustomFontRenderer("badcache", 24, true);
var badcache32 = render.getCustomFontRenderer("badcache", 32, true);
var badcache36 = render.getCustomFontRenderer("badcache", 36, true);

// Variables
var target = null;
var i = 0;
var playtimeSeconds = 0;
var ticks = 0;

// Colors
var borderColor1 = [60, 60, 60];
var borderColor2 = [10, 10, 10];
var borderColor3 = [40, 40, 40];
var borderColor4 = [22, 22, 22];
var white = [255, 255, 255];
var black = [0, 0, 0];
var moduleTagColor = [175, 175, 175];

// Functions
function healthColor(health, maxHealth) { // Flamey
    var percentage = health / maxHealth;
    if (percentage >= 0.75) return [0, 165, 0]; // green
    if (percentage >= 0.5) return [255, 255, 0]; // yellow
    if (percentage >= 0.2) return [255, 155, 0]; // orange
    return [255, 0, 0]; // red
}

function rectangleBordered(x, y, x1, y1, width, internalColor, borderColor) {
    render.rectangle(x, y, x1 - x, y1 - y, internalColor);
    render.rectangle(x, y, x1 - x, width, borderColor);
    render.rectangle(x, y, width, y1 - y, borderColor);
    render.rectangle(x1 - width, y, width, y1 - y, borderColor);
    render.rectangle(x, y1 - width, x1 - x, width, borderColor);
}

function skeetRect(x, y, x1, y1, size) {
    rectangleBordered(x, y + -4.0, x1 + size, y1 + size, 0.5, [60, 60, 60], [10, 10, 10]);
    rectangleBordered(x + 1.0, y + -3.0, x1 + bedSize - 1.0, y1 + bedSize - 1.0, 1.0, [40, 40, 40], [40, 40, 40]);
    rectangleBordered(x + 2.5, y + -1.5, x1 + bedSize - 2.5, y1 + bedSize - 2.5, 0.5, [40, 40, 40], [60, 60, 60]);
    rectangleBordered(x + 2.5, y + -1.5, x1 + bedSize - 2.5, y1 + bedSize - 2.5, 0.5, [22, 22, 22], [255, 255, 255, 0]);
}

function skeetRectSmall(x, y, x1, y1, size) {
    rectangleBordered(x + 4.35, y + 0.5, x1 + bedSize - 84.5, y1 + bedSize - 4.35, 0.5, [48, 48, 48], [10, 10, 10]);
    rectangleBordered(x + 5.0, y + 1.0, x1 + bedSize - 85.0, y1 + bedSize - 5.0, 0.5, [17, 17, 17], white);
}


module.handle("onTick", function (tick) {
    var ground = player.isOnGround();
    var customFont = module.getSetting("Custom Font");
    var watermark = module.getSetting("Watermark");
    var coloredLetter = module.getSetting("colored letter");
    var extraInfo = module.getSetting("extra info");
    var noWatermark = module.getSetting("no watermark");
    var arraylist = module.getSetting("Arraylist");
    var arraylistAlignment = module.getSetting("arraylist alignment");
    var arraylistColorMode = module.getSetting("arraylist color");
    var arraylistX = module.getSetting("arraylist X");
    var arraylistY = module.getSetting("arraylist Y");
    var suffix = module.getSetting("suffix");
    var blockCounter = module.getSetting("Block Counter");
    var blockCounterColor = module.getSetting("color mode");
    var blockCounterX = module.getSetting("BC X");
    var blockCounterY = module.getSetting("BC Y");
    var playtime = module.getSetting("Playtime");
    var playtimeX = module.getSetting("playtime X");
    var playtimerY = module.getSetting("playtime Y");
    var cokeDisplay = module.getSetting("Coke Display");
    var cokeMode = module.getSetting("potion effect");
    var size = module.getSetting("coke size");
    var cokeX = module.getSetting("coke X");
    var cokeY = module.getSetting("coke Y");
    var qol = module.getSetting("QoL");
    var speedNJD = module.getSetting("Speed NJD");
    var yPort = module.getSetting("Speed Y Port");
    var bedEsp = module.getSetting("Bed ESP");
    var breakerOnly = module.getSetting("breaker only");
    var bedRange = module.getSetting("range");
    var bedSize = module.getSetting("cube size");
    var bedThicc = module.getSetting("thiccness");
    var bedOpac = module.getSetting("opacity");
    var bedColor = module.getSetting("esp color");

    if (++ticks % (20 * mc.getTimerSpeed()) == 0) {
        playtimeSeconds++;
    }

    module.setSettingVisibility("colored letter", watermark);
    module.setSettingVisibility("extra info", watermark);
    module.setSettingVisibility("no watermark", watermark);

    if (noWatermark ? rise.setName("") : rise.setName("Exhibition"));

    module.setSettingVisibility("Time", watermark && extraInfo != "disabled");
    module.setSettingVisibility("FPS", watermark && extraInfo != "disabled");
    module.setSettingVisibility("Ping", watermark && extraInfo != "disabled");

    module.setSettingVisibility("arraylist alignment", arraylist);
    module.setSettingVisibility("arraylist color", arraylist);
    module.setSettingVisibility("arraylist X", arraylist);
    module.setSettingVisibility("arraylist Y", arraylist);
    module.setSettingVisibility("suffix", arraylist);

    module.setSettingVisibility("BC X", blockCounter);
    module.setSettingVisibility("BC Y", blockCounter);
    module.setSettingVisibility("color mode", blockCounter);

    module.setSettingVisibility("playtime X", playtime);
    module.setSettingVisibility("playtime Y", playtime);

    module.setSettingVisibility("potion effect", cokeDisplay);
    module.setSettingVisibility("coke size", cokeDisplay);
    module.setSettingVisibility("coke X", cokeDisplay);
    module.setSettingVisibility("coke Y", cokeDisplay);

    module.setSettingVisibility("Speed NJD", qol);
    module.setSettingVisibility("Speed Y Port", qol);
    module.setSettingVisibility("Bed ESP", qol);
    module.setSettingVisibility("breaker only", qol && bedEsp != "disabled");
    module.setSettingVisibility("range", qol && bedEsp != "disabled");
    module.setSettingVisibility("cube size", qol && bedEsp != "disabled");
    module.setSettingVisibility("thiccness", qol && bedEsp != "disabled");
    module.setSettingVisibility("opacity", qol && bedEsp != "disabled");
    module.setSettingVisibility("esp color", qol && bedEsp === "custom");

    var upward = input.isKeyBindJumpDown();
    var qol = module.getSetting("QoL");
    var moving = player.isMoving();
	var speed = rise.getModule("Speed");
	
    if (qol) {
        if (speedNJD) {
            if (speed.isEnabled() && moving) {
                if (player.isOnGround()) {
                    player.jump();
                }
            }
        }
    }


});

module.handle("onAttack", function (attack) {
    // XD LOL FUNNY MAN
    target = attack.getTarget();
});

module.handle("onRender2D", function (render2) {
    var ground = player.isOnGround();
    var customFont = module.getSetting("Custom Font");
    var watermark = module.getSetting("Watermark");
    var coloredLetter = module.getSetting("colored letter");
    var extraInfo = module.getSetting("extra info");
    var fps = module.getSetting("FPS");
    var ping = module.getSetting("Ping");
    var time = module.getSetting("Time");
    var arraylist = module.getSetting("Arraylist");
    var arraylistAlignment = module.getSetting("arraylist alignment");
    var arraylistColorMode = module.getSetting("arraylist color");
    var arraylistX = module.getSetting("arraylist X");
    var arraylistY = module.getSetting("arraylist Y");
    var suffix = module.getSetting("suffix");
    var blockCounter = module.getSetting("Block Counter");
    var blockCounterColor = module.getSetting("color mode");
    var blockCounterX = module.getSetting("BC X");
    var blockCounterY = module.getSetting("BC Y");
    var playtime = module.getSetting("Playtime");
    var playtimeX = module.getSetting("playtime X");
    var playtimerY = module.getSetting("playtime Y");
    var cokeDisplay = module.getSetting("Coke Display");
    var cokeMode = module.getSetting("potion effect");
    var size = module.getSetting("coke size");
    var cokeX = module.getSetting("coke X");
    var cokeY = module.getSetting("coke Y");
    var qol = module.getSetting("QoL");
    var yPort = module.getSetting("Speed Y Port");
    var speed = rise.getModule("Speed");

    // Player Coords
    var coordsX = Math.round(player.getPosition().getX());
    var coordsY = Math.round(player.getPosition().getY());
    var coordsZ = Math.round(player.getPosition().getZ());
    var coords = coordsX + ", " + coordsY + ", " + coordsZ;
    // Date finder shit (Arhu)
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Pro gaming
    var timeString = hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;
    // Idk
    var heldItem = player.getInventory().getHeldItem();

    // ARRAYLIST MODULES

    // Render
    var freecam = rise.getModule("Freecam");
    var freelook = rise.getModule("Freelook");
    // Ghost
    var legitScaffold = rise.getModule("LegitScaffold");
    var safeWalk = rise.getModule("Safewalk");
    // Other
    var timer = rise.getModule("Timer");
    // Movement
    var stuck = rise.getModule("Stuck");
    var flight = rise.getModule("Flight");
    var flightMode = flight.getSetting("Mode");
    var phase = rise.getModule("Phase");
    var noclip = rise.getModule("NoClip");
    var longJump = rise.getModule("LongJump");
    var longJumpMode = longJump.getSetting("Mode");
    var wallClimb = rise.getModule("WallClimb"); // daFuq? rename this to spider? fuq is rung w/ u alan
    var step = rise.getModule("Step");
    var strafe = rise.getModule("Strafe");
    var stepMode = step.getSetting("Mode");
    var speed = rise.getModule("Speed");
    var speedMode = speed.getSetting("Mode");
    // Combat
    var tickbase = rise.getModule("Tickbase");
    var crasher = rise.getModule("Crasher");
    var fences = rise.getModule("Fences");
    var killAura = rise.getModule("KillAura");
    var killAuraMode = killAura.getSetting("Attack Mode");
    var killAuraRange = killAura.getSetting("Range"); //TESTING DynamicKA.js - DELETE B4 RELEASE
    //lol nvm it turned to a suffix feature
    var teleportAura = rise.getModule("TeleportAura");
    var godMode = rise.getModule("GodMode");

    var comboOneHit = rise.getModule("ComboOneHit");
    var comboOneHitPackets = comboOneHit.getSetting("Attack Packets");

    var velocity = rise.getModule("Velocity"); // dear alan, fuq is u mean this a combat module, this movement u monke
    var velocityMode = velocity.getSetting("Mode");
    var velocityX = velocity.getSetting("Horizontal");
    var velocityY = velocity.getSetting("Vertical");
    //  Player
    var scaffold = rise.getModule("Scaffold");
    var scaffoldMode = scaffold.getSetting("Mode");
    var manager = rise.getModule("Manager");
    var blink = rise.getModule("Blink");
    var noFall = rise.getModule("NoFall");
    var autoTool = rise.getModule("AutoTool");
    var breaker = rise.getModule("Breaker");

    var antiVoid = rise.getModule("AntiVoid");
    var antiVoidMode = antiVoid.getSetting("Mode");

    var fastBreak = rise.getModule("FastBreak");
    var fastBreakMode = fastBreak.getSetting("Mode");
    var fastBreakSpeed = fastBreak.getSetting("Speed");

    if (fastBreakMode === "Ticks") {
        fastBreakSpeed = fastBreak.getSetting("Ticks");
    } else {
        fastBreakSpeed = fastBreak.getSetting("Speed");
    }

    var moduleList = [
        freecam,
        freelook,
        legitScaffold,
        safeWalk,
        timer,
        stuck,
        flight,
        phase,
        noclip,
        longJump,
        wallClimb,
        speed,
        velocity,
        tickbase,
        crasher,
        fences,
        killAura,
        comboOneHit,
        teleportAura,
        godMode,
        manager,
        scaffold,
        antiVoid,
        fastBreak,
        blink,
        noFall,
        autoTool,
        breaker,
        step,
        strafe,
    ];

    function getModuleTag(module) {
        if (arraylist && suffix) {
            if (module === flight) {
                return flightMode;
            } else if (module === killAura) {
                return "[" + killAuraMode + " - " + killAuraRange + "]";
            } else if (module === longJump) {
                return longJumpMode;
            } else if (module === scaffold) {
                return scaffoldMode;
            } else if (module === speed) {
                return speedMode;
            } else if (module === fastBreak) {
                if (fastBreakMode === "Ticks") {
                    return "[" + fastBreakSpeed + "x]";
                } else {
                    return "[" + fastBreakSpeed + "%]";
                }
            } else if (module === velocity) {
                if (velocityMode === "Standard") {
                    return "[" + velocityX + "," + velocityY + "]";
                } else {
                    return velocityMode;
                }
            } else if (module === comboOneHit) {
                return "[x" + comboOneHitPackets + "]";
            } else if (module === antiVoid) {
                return antiVoidMode;
            } else if (module === antiVoid) {
                return antiVoidMode;
            } else if (module === step) {
                return stepMode;
            }
            return "";
        }
    }
    if (arraylistColorMode === "white") {
        moduleNameColor = white;
    } else if (arraylistColorMode === "theme") {
        moduleNameColor = render.getThemeColor();
    }

    var sepo = "["; // Module opening bracket
    var sepc = "]"; // Module closing bracket
    var maino = " " + sepo; // after exhi text and first opening bracket only
    var mainc = sepc; // MODULE SPACE
    var endc = mainc;
    var sepd = "- ";

    var iFuckingLoveSkiddingPizza = "Exhibition ";
    if (watermark) {
        if (extraInfo === "disabled") {
            if (customFont) {
                if (coloredLetter) {
                    badcache18.drawWithShadow("E", 3, 3, render.getThemeColor())
                    badcache18.drawWithShadow("xhibition", 3 + badcache18.width("E"), 3, white)
                } else {
                    badcache18.drawWithShadow("Exhibition", 3, 3, white)
                }
            } else {
                if (coloredLetter) {
                    mcFont.drawWithShadow("E", 3, 3, render.getThemeColor())
                    mcFont.drawWithShadow("xhibition", 3 + badcache18.width("E"), 3, white)
                } else {
                    mcFont.drawWithShadow("Exhibition", 3, 3, white)
                }
            }
        } else if (extraInfo === "enabled") {
            // OG PIZZA CODE (VARs edit)
            var textWidthTotal = "Exhibition ";
            if (customFont) {
                if (coloredLetter) {
                    badcache18.drawWithShadow("E", 3, 3, render.getThemeColor())
                    badcache18.drawWithShadow("xhibition", 3 + badcache18.width("E"), 3, white)
                    if (time) {
                        badcache18.drawWithShadow(" [", 3 + badcache18.width("Exhibition"), 4, [185, 185, 185, 255])
                        badcache18.drawWithShadow(timeString, 3 + badcache18.width("Exhibition ["), 4, [255, 255, 255, 255])
                        badcache18.drawWithShadow("]", 3 + badcache18.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + timeString + "] "
                    }
                    if (fps) {
                        badcache18.drawWithShadow("[", 3 + badcache18.width(textWidthTotal), 4, [185, 185, 185, 255])
                        badcache18.drawWithShadow(mc.getFPS() + " FPS", 3 + badcache18.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        badcache18.drawWithShadow("]", 3 + badcache18.width(textWidthTotal + "[" + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + mc.getFPS() + " FPS] "
                    }
                    if (ping) {
                        badcache18.drawWithShadow("[", 3 + badcache18.width(textWidthTotal), 4, [185, 185, 185, 255])
                        badcache18.drawWithShadow(rise.getPing() + " ms", 3 + badcache18.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        badcache18.drawWithShadow("]", 3 + badcache18.width(textWidthTotal + "[" + rise.getPing() + " ms"), 4, [185, 185, 185, 255])
                    }
                } else {
                    badcache18.drawWithShadow("Exhibition", 3, 3, white)
                    if (time) {
                        badcache18.drawWithShadow(" [", 3 + badcache18.width("Exhibition"), 4, [185, 185, 185, 255])
                        badcache18.drawWithShadow(timeString, 3 + badcache18.width("Exhibition ["), 4, [255, 255, 255, 255])
                        badcache18.drawWithShadow("]", 3 + badcache18.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + timeString + "] "
                    }
                    if (fps) {
                        badcache18.drawWithShadow("[", 3 + badcache18.width(textWidthTotal), 4, [185, 185, 185, 255])
                        badcache18.drawWithShadow(mc.getFPS() + " FPS", 3 + badcache18.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        badcache18.drawWithShadow("]", 3 + badcache18.width(textWidthTotal + "[" + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + mc.getFPS() + " FPS] "
                    }
                    if (ping) {
                        badcache18.drawWithShadow("[", 3 + badcache18.width(textWidthTotal), 4, [185, 185, 185, 255])
                        badcache18.drawWithShadow(rise.getPing() + " ms", 3 + badcache18.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        badcache18.drawWithShadow("]", 3 + badcache18.width(textWidthTotal + "[" + rise.getPing() + " ms"), 4, [185, 185, 185, 255])
                    }
                }
            } else {
                if (coloredLetter) {
                    mcFont.drawWithShadow("E", 3, 3, render.getThemeColor())
                    mcFont.drawWithShadow("xhibition", 3 + mcFont.width("E"), 3, white)
                    if (time) {
                        mcFont.drawWithShadow(" [", 3 + mcFont.width("Exhibition"), 4, [185, 185, 185, 255])
                        mcFont.drawWithShadow(timeString, 3 + mcFont.width("Exhibition ["), 4, [255, 255, 255, 255])
                        mcFont.drawWithShadow("]", 3 + mcFont.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + timeString + "] "
                    }
                    if (fps) {
                        mcFont.drawWithShadow("[", 3 + mcFont.width(textWidthTotal), 4, [185, 185, 185, 255])
                        mcFont.drawWithShadow(mc.getFPS() + " FPS", 3 + mcFont.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        mcFont.drawWithShadow("]", 3 + mcFont.width(textWidthTotal + "[" + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + mc.getFPS() + " FPS] "
                    }
                    if (ping) {
                        mcFont.drawWithShadow("[", 3 + mcFont.width(textWidthTotal), 4, [185, 185, 185, 255])
                        mcFont.drawWithShadow(rise.getPing() + " ms", 3 + mcFont.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        mcFont.drawWithShadow("]", 3 + mcFont.width(textWidthTotal + "[" + rise.getPing() + " ms"), 4, [185, 185, 185, 255])
                    }
                } else {
                    mcFont.drawWithShadow("Exhibition", 3, 3, white)
                    if (time) {
                        mcFont.drawWithShadow(" [", 3 + mcFont.width("Exhibition"), 4, [185, 185, 185, 255])
                        mcFont.drawWithShadow(timeString, 3 + mcFont.width("Exhibition ["), 4, [255, 255, 255, 255])
                        mcFont.drawWithShadow("]", 3 + mcFont.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + timeString + "] "
                    }
                    if (fps) {
                        mcFont.drawWithShadow("[", 3 + mcFont.width(textWidthTotal), 4, [185, 185, 185, 255])
                        mcFont.drawWithShadow(mc.getFPS() + " FPS", 3 + mcFont.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        mcFont.drawWithShadow("]", 3 + mcFont.width(textWidthTotal + "[" + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255])
                        textWidthTotal += "[" + mc.getFPS() + " FPS] "
                    }
                    if (ping) {
                        mcFont.drawWithShadow("[", 3 + mcFont.width(textWidthTotal), 4, [185, 185, 185, 255])
                        mcFont.drawWithShadow(rise.getPing() + " ms", 3 + mcFont.width(textWidthTotal + "["), 4, [255, 255, 255, 255])
                        mcFont.drawWithShadow("]", 3 + mcFont.width(textWidthTotal + "[" + rise.getPing() + " ms"), 4, [185, 185, 185, 255])
                    }
                }
            }
        } else if (extraInfo === "enabled optimized") {
            // vKA$ - how did i pull this (//editor)
            if (customFont) {
                if (coloredLetter) {
                    badcache18.drawWithShadow("E", 3, 3, render.getThemeColor());
                    badcache18.drawWithShadow("xhibition", 3 + badcache18.width("E"), 3, white);
                    if (extraInfo && time) {
                        badcache18.drawWithShadow(maino, 3 + badcache18.width("Exhibition"), 4, [185, 185, 185, 255]);
                        badcache18.drawWithShadow(timeString, 3 + badcache18.width("Exhibition ["), 4, [255, 255, 255, 255]);
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepc = " "; } //editor
                            if (time && !fps && ping) { sepo = "  "; sepc = " - "; } //editor
                        }
                        badcache18.drawWithShadow(sepc, 3 + badcache18.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + timeString + endc;
                    }
                    if (extraInfo && fps) {
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepo = sepd; sepc = "]"; } //editor
                            if (ping) { sepc = ""; } //editor
                        }
                        badcache18.drawWithShadow(sepo, 3 + badcache18.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        badcache18.drawWithShadow(mc.getFPS() + " FPS", 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        badcache18.drawWithShadow(sepc, 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + mc.getFPS() + " FPS" + endc;
                    }
                    if (extraInfo && ping) {
                        if (extraInfo === "enabled optimized") {
                            sepc = "]"; //editor
                            if (!time && fps && ping) { sepo = "- "; } //editor
                        }
                        badcache18.drawWithShadow(sepo, 3 + badcache18.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        badcache18.drawWithShadow(rise.getPing() + " ms", 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        badcache18.drawWithShadow(sepc, 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo + rise.getPing() + " ms"), 4, [185, 185, 185, 255]);
                    }
                } else {
                    badcache18.drawWithShadow("Exhibition", 3, 3, white);
                    if (extraInfo && time) {
                        badcache18.drawWithShadow(maino, 3 + badcache18.width("Exhibition"), 4, [185, 185, 185, 255]);
                        badcache18.drawWithShadow(timeString, 3 + badcache18.width("Exhibition ["), 4, [255, 255, 255, 255]);
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepc = " "; } //editor
                            if (time && !fps && ping) { sepo = "  "; sepc = " - "; } //editor
                        }
                        badcache18.drawWithShadow(sepc, 3 + badcache18.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + timeString + endc;
                    }
                    if (extraInfo && fps) {
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepo = sepd; sepc = "]"; } //editor
                            if (ping) { sepc = ""; } //editor
                        }
                        badcache18.drawWithShadow(sepo, 3 + badcache18.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        badcache18.drawWithShadow(mc.getFPS() + " FPS", 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        badcache18.drawWithShadow(sepc, 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + mc.getFPS() + " FPS" + endc;
                    }
                    if (extraInfo && ping) {
                        if (extraInfo === "enabled optimized") {
                            sepc = "]"; //editor
                            if (!time && fps && ping) { sepo = "- "; } //editor
                        }
                        badcache18.drawWithShadow(sepo, 3 + badcache18.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        badcache18.drawWithShadow(rise.getPing() + " ms", 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        badcache18.drawWithShadow(sepc, 3 + badcache18.width(iFuckingLoveSkiddingPizza + sepo + rise.getPing() + " ms"), 4, [185, 185, 185, 255]);
                    }
                }
            } else {
                if (coloredLetter) { //MAIN
                    mcFont.drawWithShadow("E", 3, 3, render.getThemeColor());
                    mcFont.drawWithShadow("xhibition", 3 + mcFont.width("E"), 3, white);
                    if (extraInfo && time) {
                        mcFont.drawWithShadow(maino, 3 + mcFont.width("Exhibition"), 4, [185, 185, 185, 255]);
                        mcFont.drawWithShadow(timeString, 3 + mcFont.width("Exhibition ["), 4, [255, 255, 255, 255]);
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepc = " "; } //editor
                            if (time && !fps && ping) { sepo = "  "; sepc = " - "; } //editor
                        }
                        mcFont.drawWithShadow(sepc, 3 + mcFont.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + timeString + endc;
                    }
                    if (extraInfo && fps) {
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepo = sepd; sepc = "]"; } //editor
                            if (ping) { sepc = ""; } //editor
                        }
                        mcFont.drawWithShadow(sepo, 3 + mcFont.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        mcFont.drawWithShadow(mc.getFPS() + " FPS", 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        mcFont.drawWithShadow(sepc, 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + mc.getFPS() + " FPS" + endc;
                    }
                    if (extraInfo && ping) {
                        if (extraInfo === "enabled optimized") {
                            sepc = "]"; //editor
                            if (!time && fps && ping) { sepo = "- "; } //editor
                        }
                        mcFont.drawWithShadow(sepo, 3 + mcFont.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        mcFont.drawWithShadow(rise.getPing() + " ms", 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        mcFont.drawWithShadow(sepc, 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo + rise.getPing() + " ms"), 4, [185, 185, 185, 255]);
                    }
                } else {
                    mcFont.drawWithShadow("Exhibition", 3, 3, white);
                    if (extraInfo && time) {
                        mcFont.drawWithShadow(maino, 3 + mcFont.width("Exhibition"), 4, [185, 185, 185, 255]);
                        mcFont.drawWithShadow(timeString, 3 + mcFont.width("Exhibition ["), 4, [255, 255, 255, 255]);
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepc = " "; } //editor
                            if (time && !fps && ping) { sepo = "  "; sepc = " - "; } //editor
                        }
                        mcFont.drawWithShadow(sepc, 3 + mcFont.width("Exhibition [" + timeString + ""), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + timeString + endc;
                    }
                    if (extraInfo && fps) {
                        if (extraInfo === "enabled optimized") {
                            if (time && fps) { sepo = sepd; sepc = "]"; } //editor
                            if (ping) { sepc = ""; } //editor
                        }
                        mcFont.drawWithShadow(sepo, 3 + mcFont.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        mcFont.drawWithShadow(mc.getFPS() + " FPS", 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        mcFont.drawWithShadow(sepc, 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255]);
                        iFuckingLoveSkiddingPizza += sepo + mc.getFPS() + " FPS" + endc;
                    }
                    if (extraInfo && ping) {
                        if (extraInfo === "enabled optimized") {
                            sepc = "]"; //editor
                            if (!time && fps && ping) { sepo = "- "; } //editor
                        }
                        mcFont.drawWithShadow(sepo, 3 + mcFont.width(iFuckingLoveSkiddingPizza), 4, [185, 185, 185, 255]);
                        mcFont.drawWithShadow(rise.getPing() + " ms", 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo), 4, [255, 255, 255, 255]);
                        mcFont.drawWithShadow(sepc, 3 + mcFont.width(iFuckingLoveSkiddingPizza + sepo + rise.getPing() + " ms"), 4, [185, 185, 185, 255]);
                    }
                }
            }
        }
    }

    if (arraylist) {
        if (arraylistAlignment === "right") {
            var startingY = arraylistY;

            moduleList.sort(function (a, b) {
                var aName = a.getName();
                var bName = b.getName();
                var aTag = getModuleTag(a);
                var bTag = getModuleTag(b);

                var aText = aName + (aTag ? " " + aTag : "");
                var bText = bName + (bTag ? " " + bTag : "");

                if (customFont) {
                    return badcache18.width(bText) - badcache18.width(aText);
                } else {
                    return mcFont.width(bText) - mcFont.width(aText);
                }
            });

            var y = startingY;

            for (var i = 0; i < moduleList.length; i++) {
                if (moduleList[i].isEnabled()) {
                    var moduleName = moduleList[i].getName();
                    var moduleTag = getModuleTag(moduleList[i]);

                    if (customFont) {
                        var moduleNameWidth = badcache18.width(moduleName);
                        var moduleTagWidth = moduleTag ? badcache18.width(" " + moduleTag) : 0;
                    } else {
                        var moduleNameWidth = mcFont.width(moduleName);
                        var moduleTagWidth = moduleTag ? mcFont.width(" " + moduleTag) : 0;
                    }

                    var totalWidth = moduleNameWidth + moduleTagWidth;

                    var moduleNameStartX = arraylistX - totalWidth;
                    var moduleTagStartX = moduleNameStartX + moduleNameWidth;

                    if (customFont) {
                        badcache18.drawWithShadow(moduleName, moduleNameStartX, y, moduleNameColor);
                    } else {
                        mcFont.drawWithShadow(moduleName, moduleNameStartX, y, moduleNameColor);
                    }

                    if (moduleTag) {
                        if (customFont) {
                            badcache18.drawWithShadow(" " + moduleTag, moduleTagStartX, y, moduleTagColor);
                        } else {
                            mcFont.drawWithShadow(" " + moduleTag, moduleTagStartX, y, moduleTagColor);
                        }
                    }

                    if (customFont) {
                        y += badcache18.height();
                    } else {
                        y += mcFont.height();
                    }
                }
            }
        } else {
            var startingY = arraylistY;

            moduleList.sort(function (a, b) {
                var aName = a.getName();
                var bName = b.getName();
                var aTag = getModuleTag(a);
                var bTag = getModuleTag(b);

                var aText = (aTag ? aTag + " " : "") + aName;
                var bText = (bTag ? bTag + " " : "") + bName;

                if (customFont) {
                    return badcache18.width(bText) - badcache18.width(aText);
                } else {
                    return mcFont.width(bText) - mcFont.width(aText);
                }
            });

            var y = startingY;

            for (var i = 0; i < moduleList.length; i++) {
                if (moduleList[i].isEnabled()) {
                    var moduleName = moduleList[i].getName();
                    var moduleTag = getModuleTag(moduleList[i]);

                    if (customFont) {
                        var moduleNameWidth = badcache18.width(moduleName);
                        var moduleTagWidth = moduleTag ? badcache18.width(moduleTag) : 0;
                    } else {
                        var moduleNameWidth = mcFont.width(moduleName);
                        var moduleTagWidth = moduleTag ? mcFont.width(moduleTag) : 0;
                    }

                    var totalWidth = moduleNameWidth + moduleTagWidth;

                    var moduleContentStartX = arraylistX;

                    // Adjust the distance between moduleName and moduleTag
                    var spacingBetween = 5; // You can adjust this value as needed

                    var moduleTagStartX = moduleContentStartX + spacingBetween;
                    var moduleNameStartX = moduleTagStartX + moduleTagWidth + spacingBetween;

                    if (moduleTag) {
                        if (customFont) {
                            badcache18.drawWithShadow(" " + moduleTag, moduleTagStartX, y, moduleTagColor);
                            badcache18.drawWithShadow(moduleName, moduleNameStartX, y, moduleNameColor);
                        } else {
                            mcFont.drawWithShadow(" " + moduleTag, moduleTagStartX, y, moduleTagColor);
                            mcFont.drawWithShadow(moduleName, moduleNameStartX, y, moduleNameColor);
                        }
                    } else {
                        if (customFont) {
                            badcache18.drawWithShadow(moduleName, moduleNameStartX, y, moduleNameColor);
                        } else {
                            mcFont.drawWithShadow(moduleName, moduleNameStartX, y, moduleNameColor);
                        }
                    }

                    if (customFont) {
                        y += badcache18.height();
                    } else {
                        y += mcFont.height();
                    }
                }
            }
        }
    }


    if (blockCounterColor === "colored" && scaffold.isEnabled() && blockCounter && heldItem.getItemId() != 0) {
        function scaffoldColor() {
            if (heldItem.getAmount() <= 16) {
                return [165, 0, 0]; // Red
            } else if (heldItem.getAmount() <= 32) {
                return [200, 200, 0]; // Yellow
            } else if (heldItem.getAmount() <= 64) {
                return [0, 165, 0]; // Green
            }
        }

        scaffold.setSetting("Render", false);
        if (customFont) {
            if (heldItem.getAmount() <= 10) {
                badcache18.drawWithShadow(heldItem.getAmount(), blockCounterX + 3.5, blockCounterY, scaffoldColor());
            } else {
                badcache18.drawWithShadow(heldItem.getAmount(), blockCounterX + 0.75, blockCounterY, scaffoldColor());
            }
        } else {
            if (heldItem.getAmount() <= 10) {
                mcFont.drawWithShadow(heldItem.getAmount(), blockCounterX + 3.5, blockCounterY, scaffoldColor());
            } else {
                mcFont.drawWithShadow(heldItem.getAmount(), blockCounterX + 0.5, blockCounterY, scaffoldColor());
            }
        }
    } else if (blockCounterColor === "white" && scaffold.isEnabled() && blockCounter && heldItem.getItemId() != 0) {
        function scaffoldColor() {
            if (heldItem.getAmount() <= 64) {
                return [255, 255, 255]; // White
            }
        }

        scaffold.setSetting("Render", false);
        if (customFont) {
            if (heldItem.getAmount() <= 10) {
                badcache18.drawWithShadow(heldItem.getAmount(), blockCounterX + 3.5, blockCounterY, scaffoldColor());
            } else {
                badcache18.drawWithShadow(heldItem.getAmount(), blockCounterX + 0.75, blockCounterY, scaffoldColor());
            }
        } else {
            if (heldItem.getAmount() <= 10) {
                mcFont.drawWithShadow(heldItem.getAmount(), blockCounterX + 3.5, blockCounterY, scaffoldColor());
            } else {
                mcFont.drawWithShadow(heldItem.getAmount(), blockCounterX + 0.5, blockCounterY, scaffoldColor());
            }
        }
    } else if (blockCounterColor === "theme color" && scaffold.isEnabled() && blockCounter && heldItem.getItemId() != 0) {
        function scaffoldColor() {
            if (heldItem.getAmount() <= 64) {
                return [255, 255, 255]; // White
            }
        }

        scaffold.setSetting("Render", false);
        if (customFont) {
            if (heldItem.getAmount() <= 10) {
                badcache18.drawWithShadow(heldItem.getAmount(), blockCounterX + 3.5, blockCounterY, render.getThemeColor());
            } else {
                badcache18.drawWithShadow(heldItem.getAmount(), blockCounterX + 0.75, blockCounterY, render.getThemeColor());
            }
        } else {
            if (heldItem.getAmount() <= 10) {
                mcFont.drawWithShadow(heldItem.getAmount(), blockCounterX + 3.5, blockCounterY, render.getThemeColor());
            } else {
                mcFont.drawWithShadow(heldItem.getAmount(), blockCounterX + 0.5, blockCounterY, render.getThemeColor());
            }
        }
    }

    if (playtime) {
        var playtimeText = playtimeSeconds % 60 + "s";
        if (playtimeSeconds >= 3600) {
            playtimeText = Math.floor(playtimeSeconds / 3600) + "h " + Math.floor((playtimeSeconds % 3600) / 60) + "m " + playtimeSeconds % 60 + "s";
        } else if (playtimeSeconds >= 60) {
            playtimeText = Math.floor((playtimeSeconds % 3600) / 60) + "m " + playtimeSeconds % 60 + "s";
        }

        if (customFont) {
            badcache18.drawWithShadow(playtimeText, playtimeX, playtimerY, white);
        } else {
            mcFont.drawWithShadow(playtimeText, playtimeX, playtimerY, white);
        }

        if (cokeDisplay && cokeMode === "speed" || cokeMode === "both") {
            if (player.isPotionActive(1)) {

                // colors
                var textColor = [255, 255, 255];
                var darkColor = [84, 84, 104];
                var whiteColor = [255, 255, 255];
                var lightWhiteColor = [213, 213, 223];
                var whiteCreamColor = [234, 234, 234];
                var grayColor = [185, 185, 203];
                //Speed sugar drawing (stretched cuz lazy to draw pixel by pixel)
                // Draw dark rectangles
                render.rectangle(cokeX + size * 2.5, cokeY + size * 1.5, size, size * 0.5, darkColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 2, size * 2, size * 0.5, darkColor);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 2.5, size * 3, size * 0.5, darkColor);
                render.rectangle(cokeX + size, cokeY + size * 3, size * 4, size * 0.5, darkColor);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 3.5, size * 5, size * 0.5, darkColor);
                render.rectangle(cokeX, cokeY + size * 4, size * 6, size * 1.5, darkColor);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 5.5, size * 5, size * 0.5, darkColor);
                render.rectangle(cokeX + size, cokeY + size * 6, size * 4, size * 0.5, darkColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 6.5, size * 2, size * 0.5, darkColor);

                // Draw white rectangles
                render.rectangle(cokeX + size * 0.5, cokeY + size * 4, size * 3.5, size * 1.5, whiteColor);
                render.rectangle(cokeX + size, cokeY + size * 3.5, size * 3, size * 0.5, whiteColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 2.5, size * 1, size * 3.5, whiteColor);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 2, size * 0.5, size * 0.5, whiteColor);

                // Draw light white rectangles
                render.rectangle(cokeX + size * 3, cokeY + size * 2, size * 0.5, size, lightWhiteColor);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 2.5, size * 0.5, size * 1.5, lightWhiteColor);
                render.rectangle(cokeX + size * 4, cokeY + size * 3, size * 0.5, size * 0.5, lightWhiteColor);
                render.rectangle(cokeX + size * 4, cokeY + size * 3.5, size * 1, size * 2, lightWhiteColor);
                render.rectangle(cokeX + size * 5, cokeY + size * 4, size * 0.5, size * 1, lightWhiteColor);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 5, size * 0.5, size * 0.5, lightWhiteColor);
                render.rectangle(cokeX + size, cokeY + size * 5.5, size * 1, size * 0.5, lightWhiteColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 6, size * 2, size * 0.5, lightWhiteColor);
                render.rectangle(cokeX + size * 3, cokeY + size * 5.5, size * 1, size * 0.5, lightWhiteColor);

                // Draw white cream rectangles
                render.rectangle(cokeX + size, cokeY + size * 4, size * 0.5, size * 1, whiteCreamColor);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 4, size * 0.5, size * 0.5, whiteCreamColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 3.5, size * 0.5, size * 0.5, whiteCreamColor);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 3, size * 0.5, size * 0.5, whiteCreamColor);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 3, size * 1, size * 0.5, whiteCreamColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 5, size * 1, size * 0.5, whiteCreamColor);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 4.5, size * 0.5, size * 0.5, whiteCreamColor);
                render.rectangle(cokeX + size * 3, cokeY + size * 4, size * 1, size * 0.5, whiteCreamColor);

                // Draw gray rectangles
                render.rectangle(cokeX + size * 3, cokeY + size * 6, size * 0.5, size * 0.5, grayColor);
                render.rectangle(cokeX + size * 4, cokeY + size * 5.5, size * 1, size * 0.5, grayColor);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 5, size * 0.5, size * 0.5, grayColor);
                render.rectangle(cokeX + size * 5, cokeY + size * 5, size * 0.5, size * 0.5, grayColor);
                render.rectangle(cokeX + size * 4.5, cokeY + size * 4, size * 0.5, size * 1, grayColor);
                render.rectangle(cokeX + size * 4, cokeY + size * 3.5, size * 0.5, size * 0.5, grayColor);
            }
        }
        if (cokeDisplay && cokeMode === "strength" || cokeMode === "both") {
            if (player.isPotionActive(5)) {

                // Blaze powder drawing (also stretched cuz lazy)

                brownColor = [149, 51, 0];
                lightYellowColor = [255, 255, 181];
                pastelYellow = [255, 255, 110];
                yellowColor = [255, 254, 49];
                torchYellowColor = [255, 217, 66];
                orangeColor = [255, 163, 0];
                darkOrangeColor = [231, 133, 0];
                rottenBrown = [202, 140, 9];
                //nah fuck this fuck blaze color

                // Draw brown rectangles
                render.rectangle(cokeX + size * 1.5, cokeY + size * 1.5, size * 1.5, size * 0.5, brownColor); //top particle
                render.rectangle(cokeX + size * 2, cokeY + size * 1, size * 0.5, size * 1.5, brownColor);
                render.rectangle(cokeX + size * 0, cokeY + size * 2.5, size * 1.5, size * 0.5, brownColor); //left particle
                render.rectangle(cokeX + size * 0.5, cokeY + size * 2, size * 0.5, size * 1.5, brownColor);
                render.rectangle(cokeX + size * 4, cokeY + size * 2.5, size * 1.5, size * 0.5, brownColor); //right particle
                render.rectangle(cokeX + size * 4.5, cokeY + size * 2, size * 0.5, size * 1.5, brownColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 3.5, size * 1.5, size * 0.5, brownColor); //middle particle
                render.rectangle(cokeX + size * 2.5, cokeY + size * 3, size * 0.5, size * 1.5, brownColor);
                render.rectangle(cokeX + size * 0, cokeY + size * 3.5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 4, size * 0.5, size * 1, brownColor);
                render.rectangle(cokeX + size * 1, cokeY + size * 5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 4.5, size * 1, size * 1, brownColor);
                render.rectangle(cokeX + size * -0.5, cokeY + size * 4, size * 0.5, size * 2, brownColor);
                render.rectangle(cokeX + size * 0, cokeY + size * 6, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 6.5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 1, cokeY + size * 7, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 6.5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 2, cokeY + size * 7, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 7.5, size * 2.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 5, cokeY + size * 7, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 5.5, cokeY + size * 7, size * 0.5, size * -2, brownColor);
                render.rectangle(cokeX + size * 6, cokeY + size * 6, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 5, cokeY + size * 4.5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 4.5, cokeY + size * 5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 4, cokeY + size * 4, size * 0.5, size * 1, brownColor);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 3.5, size * 0.5, size * 0.5, brownColor);
                render.rectangle(cokeX + size * 3, cokeY + size * 4.5, size * 0.5, size * 0.5, brownColor);

                // Draw light yellow rectangles
                render.rectangle(cokeX + size * 2, cokeY + size * 1.5, size * 0.5, size * 0.5, lightYellowColor); //top
                render.rectangle(cokeX + size * 3.5, cokeY + size * 4, size * 0.5, size * 0.5, lightYellowColor);
                render.rectangle(cokeX + size * 0, cokeY + size * 4.5, size * 0.5, size * 0.5, lightYellowColor);
                // Draw yellow
                render.rectangle(cokeX + size * 0.5, cokeY + size * 2.5, size * 0.5, size * 0.5, yellowColor); //left
                // Draw Dark Orange
                render.rectangle(cokeX + size * 0, cokeY + size * 4, size * 0.5, size * 0.5, darkOrangeColor);
                // Draw torch yellow
                render.rectangle(cokeX + size * 0, cokeY + size * 5, size * 0.5, size * 0.5, torchYellowColor);
                // Draw orange
                render.rectangle(cokeX + size * 4.5, cokeY + size * 2.5, size * 0.5, size * 0.5, orangeColor); //right
                render.rectangle(cokeX + size * 2.5, cokeY + size * 3.5, size * 0.5, size * 0.5, orangeColor); //middle
                render.rectangle(cokeX + size * 3, cokeY + size * 4, size * 0.5, size * 0.5, orangeColor);
                render.rectangle(cokeX + size * 0, cokeY + size * 5.5, size * 0.5, size * 0.5, orangeColor);
                // Draw pastel
                render.rectangle(cokeX + size * 1.5, cokeY + size * 5, size * 0.5, size * 0.5, pastelYellow);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 4.5, size * 0.5, size * 0.5, pastelYellow);
                // Draw rotten brown
                render.rectangle(cokeX + size * 3.5, cokeY + size * 4.5, size * 0.5, size * 0.5, rottenBrown);
                render.rectangle(cokeX + size * 3, cokeY + size * 5, size * 0.5, size * 0.5, rottenBrown);
                render.rectangle(cokeX + size * 1, cokeY + size * 5.5, size * 2, size * 0.5, rottenBrown);
                // Draw nah fuck this fuck blaze color
                render.rectangle(cokeX + size * 0.5, cokeY + size * 5, size * 0.5, size * 0.5, [251, 191, 49]);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 5.5, size * 0.5, size * 0.5, [248, 163, 0]);
                render.rectangle(cokeX + size * 0.5, cokeY + size * 6, size * 0.5, size * 0.5, [255, 255, 181]);
                render.rectangle(cokeX + size * 1, cokeY + size * 6, size * 0.5, size * 0.5, [255, 203, 0]);
                render.rectangle(cokeX + size * 1, cokeY + size * 6.5, size * 0.5, size * 0.5, [251, 140, 0]);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 5.5, size * 0.5, size * 0.5, [255, 224, 0]);
                render.rectangle(cokeX + size * 1.5, cokeY + size * 6, size * 0.5, size * 0.5, [255, 216, 66]);
                render.rectangle(cokeX + size * 2, cokeY + size * 6, size * 0.5, size * 0.5, [255, 224, 0]);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 6, size * 0.5, size * 0.5, [205, 86, 0]);
                render.rectangle(cokeX + size * 3, cokeY + size * 6, size * 0.5, size * 0.5, [255, 203, 0]);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 6, size * 0.5, size * 0.5, [202, 118, 0]);
                render.rectangle(cokeX + size * 4, cokeY + size * 6, size * 0.5, size * 0.5, [255, 163, 0]);
                render.rectangle(cokeX + size * 4.5, cokeY + size * 6, size * 0.5, size * 0.5, [255, 223, 70]);
                render.rectangle(cokeX + size * 5, cokeY + size * 6, size * 0.5, size * 0.5, [200, 97, 0]);
                render.rectangle(cokeX + size * 5.5, cokeY + size * 6, size * 0.5, size * 0.5, [171, 62, 0]);
                render.rectangle(cokeX + size * 2, cokeY + size * 5.5, size * 0.5, size * 0.5, [255, 255, 181]);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 5, size * 0.5, size * 0.5, [255, 203, 0]);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 5, size * 0.5, size * 0.5, [255, 203, 0]);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 5, size * 0.5, size * 0.5, [255, 224, 0]);
                render.rectangle(cokeX + size * 4, cokeY + size * 5, size * 0.5, size * 0.5, [255, 255, 181]);
                render.rectangle(cokeX + size * 5, cokeY + size * 5, size * 0.5, size * 0.5, [168, 79, 0]);
                render.rectangle(cokeX + size * 5, cokeY + size * 5.5, size * 0.5, size * 0.5, [210, 128, 3]);
                render.rectangle(cokeX + size * 4.5, cokeY + size * 5.5, size * 0.5, size * 0.5, [255, 163, 0]);
                render.rectangle(cokeX + size * 4, cokeY + size * 5.5, size * 0.5, size * 0.5, [255, 254, 49]);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 5.5, size * 0.5, size * 0.5, [255, 163, 0]);
                render.rectangle(cokeX + size * 3, cokeY + size * 5.5, size * 0.5, size * 0.5, [255, 255, 181]);
                render.rectangle(cokeX + size * 5, cokeY + size * 6.5, size * 0.5, size * 0.5, [168, 73, 0]);
                render.rectangle(cokeX + size * 4.5, cokeY + size * 6.5, size * 0.5, size * 0.5, [168, 79, 0]);
                render.rectangle(cokeX + size * 4, cokeY + size * 6.5, size * 0.5, size * 0.5, [234, 138, 0]);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 6.5, size * 0.5, size * 0.5, [244, 234, 77]);
                render.rectangle(cokeX + size * 3, cokeY + size * 6.5, size * 0.5, size * 0.5, [205, 101, 0]);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 6.5, size * 0.5, size * 0.5, [255, 203, 0]);
                render.rectangle(cokeX + size * 2, cokeY + size * 6.5, size * 0.5, size * 0.5, [205, 86, 0]);
                render.rectangle(cokeX + size * 2.5, cokeY + size * 7, size * 0.5, size * 0.5, [205, 101, 0]);
                render.rectangle(cokeX + size * 3, cokeY + size * 7, size * 0.5, size * 0.5, [171, 62, 0]);
                render.rectangle(cokeX + size * 3.5, cokeY + size * 7, size * 0.5, size * 0.5, [168, 73, 0]);
                render.rectangle(cokeX + size * 4, cokeY + size * 7, size * 0.5, size * 0.5, [168, 79, 0]);
                render.rectangle(cokeX + size * 4.5, cokeY + size * 7, size * 0.5, size * 0.5, [171, 62, 0]);
            }
        }

        if (qol) {
            if (yPort) {
                rise.getModule("Speed").setSetting("Y Port", player.isPotionActive(1));
            }
        }
    }
});;

function drawCubeAroundBlock(blockPos, bedSize) {
    var halfSize = bedSize / 2;
    var x = blockPos.getPosition().getX() + 0.5;
    var y = blockPos.getPosition().getY() + 0.25 * bedSize - 0.25;
    var z = blockPos.getPosition().getZ() + 0.5;

    var vertices = [
        { x: x - halfSize, y: y, z: z - halfSize },
        { x: x + halfSize, y: y, z: z - halfSize },
        { x: x + halfSize, y: y + 0.5625 * bedSize, z: z - halfSize },
        { x: x - halfSize, y: y + 0.5625 * bedSize, z: z - halfSize },
        { x: x - halfSize, y: y, z: z + halfSize },
        { x: x + halfSize, y: y, z: z + halfSize },
        { x: x + halfSize, y: y + 0.5625 * bedSize, z: z + halfSize },
        { x: x - halfSize, y: y + 0.5625 * bedSize, z: z + halfSize }
    ];

    var lines = [
        [vertices[0], vertices[1]],
        [vertices[1], vertices[2]],
        [vertices[2], vertices[3]],
        [vertices[3], vertices[0]],
        [vertices[4], vertices[5]],
        [vertices[5], vertices[6]],
        [vertices[6], vertices[7]],
        [vertices[7], vertices[4]],
        [vertices[0], vertices[4]],
        [vertices[1], vertices[5]],
        [vertices[2], vertices[6]],
        [vertices[3], vertices[7]]
    ];

    // Convert the lines to 3D coordinates
    for (var i = 0; i < lines.length; i++) {
        lines[i][0] = rise.newVec3(lines[i][0].x, lines[i][0].y, lines[i][0].z);
        lines[i][1] = rise.newVec3(lines[i][1].x, lines[i][1].y, lines[i][1].z);
    }

    return lines;
}

function renderCubeAboveBed(blockPos, bedSize) {
    var bedEsp = module.getSetting("Bed ESP");
    var bedColor = module.getSetting("esp color");
    var bedThicc = module.getSetting("thiccness");
    var bedOpac = module.getSetting("Opacity");

    if (bedEsp === "theme") {
        bedColor = render.getThemeColor();
    }

    // background RGB
    var bedColorRed = bedColor[0] || 255;
    var bedColorGreen = bedColor[1] || 255;
    var bedColorBlue = bedColor[2] || 255;
    bedEspColor = [bedColorRed, bedColorGreen, bedColorBlue, bedOpac];

    var lines = drawCubeAroundBlock(blockPos, bedSize);
    for (var j = 0; j < lines.length; j++) {
        var start = lines[j][0];
        var end = lines[j][1];
        render.drawLine3D(start, end, bedEspColor, bedThicc);
    }
}

module.handle("onRender3D", function () {
    var playerPos = player.getPosition();

    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());

    var bedEsp = module.getSetting("Bed ESP");
    var breakerOnly = module.getSetting("breaker only");
    var bedRange = module.getSetting("range");
    var bedSize = module.getSetting("cube size");

    var breaker = rise.getModule("Breaker");

    if (module.getSetting("Bed ESP") != "disabled" && breakerOnly && breaker.isEnabled()) {
        for (var offsetX = -bedRange; offsetX <= bedRange; offsetX++) {
            for (var offsetY = -bedRange; offsetY <= bedRange; offsetY++) {
                for (var offsetZ = -bedRange; offsetZ <= bedRange; offsetZ++) {
                    var blockX = x + offsetX;
                    var blockY = y + offsetY;
                    var blockZ = z + offsetZ;

                    var blockPos = world.newBlockPos(blockX, blockY, blockZ);
                    var blockPos1 = world.newBlockPos(blockX, blockY + 1, blockZ);
                    var blockName = world.getBlockName(blockPos);
                    var blockName1 = world.getBlockName(blockPos1);

                    if (blockName == "Bed") {
                        renderCubeAboveBed(blockPos, bedSize);
                    }
                }
            }
        }
    } else if (module.getSetting("Bed ESP") != "disabled" && !breakerOnly) {
        for (var offsetX = -bedRange; offsetX <= bedRange; offsetX++) {
            for (var offsetY = -bedRange; offsetY <= bedRange; offsetY++) {
                for (var offsetZ = -bedRange; offsetZ <= bedRange; offsetZ++) {
                    var blockX = x + offsetX;
                    var blockY = y + offsetY;
                    var blockZ = z + offsetZ;

                    var blockPos = world.newBlockPos(blockX, blockY, blockZ);
                    var blockPos1 = world.newBlockPos(blockX, blockY + 1, blockZ);
                    var blockName = world.getBlockName(blockPos);
                    var blockName1 = world.getBlockName(blockPos1);

                    if (blockName == "Bed") {
                        renderCubeAboveBed(blockPos, bedSize);
                    }
                }
            }
        }
    }
});


module.handle("onGameEvent", function (e) {
    if (!(network.isMultiplayer() || network.isSingleplayer())) {
        playtimeSeconds = 0;
    }
});

module.handle("onDisable", function (e) {
    rise.setName("Rise");
});

script.handle("onUnload", function (e) {
    module.unregister();
});