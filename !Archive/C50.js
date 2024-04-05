// MODULE
var module = rise.registerModule("C50", "QOL Scripts by Cata50 for Rise 6.1.24 - v1.10.1 (minor fixes)");
module.registerSetting("mode", "ScriptMode", "Scripts", "Scripts");
module.setSettingVisibility("ScriptMode", false);

// Bed Plates
module.registerSetting("mode", "Bed Plates", "off", "off", "on");

// Block Counter
module.registerSetting("mode", "Block Counter", "off", "off", "on");

// Coke Display
module.registerSetting("mode", "Coke Display", "off", "off", "on");

// Item Tool Tips
module.registerSetting("mode", "Item Tool Tips", "off", "off", "on");

// No Jump Delay
module.registerSetting("mode", "No Jump Delay", "off", "off", "on");

// Playtime
module.registerSetting("mode", "Playtime", "off", "off", "on");

// Scaffold Overlay
module.registerSetting("mode", "Scaffold Overlay", "off", "off", "on");

// Smart
module.registerSetting("mode", "Smart Modules", "off", "off", "on"); // !ka = autotool, dynamic scaf + if speed = fastfall

// Watchdog Speed
module.registerSetting("mode", "Watchdog Speed", "off", "off", "on");

// Watermark
module.registerSetting("mode", "Watermark", "off", "off", "on");

// Air Velo
module.registerSetting("mode", "Air Velo", "off", "off", "on");

rise.setName("");

var mcFont = render.getMinecraftFontRenderer();
var white = [255, 255, 255];
var moduleTagColor = [175, 175, 175];
var blinkTime = 0;
var bedPlateSize = 0.5;
var currentItem;
var ticks = 0;
var playtimeSeconds = 0;
var blinksTime = 0;
var scafSpeed = false;
var scafJumps = 0;

module.handle("onTick", function () {
    var bedPlates = module.getSetting("Bed Plates");
    var blockCounter = module.getSetting("Block Counter");
    var cokeDisplay = module.getSetting("Coke Display");
    var itt = module.getSetting("Item Tool Tips");
    var njd = module.getSetting("No Jump Delay");
    var playtime = module.getSetting("Playtime");
    var scaffoldOverlay = module.getSetting("Scaffold Overlay");
    var smartModules = module.getSetting("Smart Modules");
    var extraInfo = module.getSetting("Extra Info");
    var moving = player.isMoving();
    var upward = input.isKeyBindJumpDown();
    var ground = player.isOnGround();

    if (njd != "off" && ground && upward && !player.isInWater() && !player.isInLava()) {
        player.jump();
    }

    if (++ticks % (20 * mc.getTimerSpeed()) == 0) {
        playtimeSeconds++;
    }

    if (smartModules != "off") {
        var killaura = rise.getModule("Kill Aura");
        var autoTool = rise.getModule("Auto Tool");

        if (killaura.isEnabled()) {
            autoTool.setEnabled(false);
        } else {
            autoTool.setEnabled(true);
        }
    }
});

module.handle("onStrafe", function (strafe) {
    var smartModules = module.getSetting("Smart Modules");
    var ground = player.isOnGround();
    var moving = player.isMoving();
    var scaffold = rise.getModule("Scaffold");
    var speed = rise.getModule("Speed");
    var watchdogSpeed = module.getSetting("Watchdog Speed");
    var blockCounter = module.getSetting("Block Counter");
    var hurt = player.getHurtTime();

    if (smartModules != "off") {
        
        var blockIds = [1, 5, 17, 20, 35];
        var inv = player.getInventory();

        var blockCount = [];
        for (var slot = 0; slot < 9; slot++) {
            var itemStack = inv.getItemStackInSlot(slot);
            if (blockIds.indexOf(itemStack.getItemId()) != -1) {
                blockCount.push(itemStack.getAmount());
            }
        }

        var totalBlocks = blockCount.reduce(function (total, count) {
            return total + count;
        }, 0);

        var forwardUp = input.isKeyBindUseItemDown();
        var upward = input.isKeyBindJumpDown();
        
        if (totalBlocks == 0) {
            scaffold.setEnabled(false);
        }

        if (scaffold.isEnabled()) {

            var yaw = strafe.getYaw();
            while (yaw > 180) yaw -= 360;
            while (yaw < -180) yaw += 360;

            var southStraight = (yaw >= -5 && yaw <= 5); // -0+
            var eastStraight = (yaw >= -95 && yaw <= -85); // -90+
            var northStraight = (yaw >= 175 && yaw <= 180) || (yaw >= -180 && yaw <= -175); // -180+
            var westStraight = yaw >= 85 && yaw <= 95; // -90+

            var southTilted = (yaw > -10 && yaw < -5) || (yaw > 5 && yaw < 10);
            var eastTilted = (yaw > -100 && yaw < -95) || (yaw > -85 && yaw < -80);
            var northTilted = (yaw > 170 && yaw < 175) || (yaw > -175 && yaw < -170);
            var westTilted = (yaw > 80 && yaw < 85) || (yaw > 95 && yaw < 100);

            if (southStraight || eastStraight || northStraight || westStraight) { // Straight
                randomSpeed = 0.58 + (0.6 - 0.58) * Math.random();
            } else if ( southTilted || eastTilted || westTilted || northTilted) { // Tilted
                randomSpeed = 0.53 + (0.55 - 0.53) * Math.random();
            } else {                                                              // Diagonal
                if (scafJumps < 2) {
                    randomSpeed = 0.48 + (0.5 - 0.48) * Math.random();
                } else {
                    randomSpeed = 0.43 + (0.45 - 0.43) * Math.random();
                }
            }

            if (upward && !forwardUp && hurt == 9) {
                scaffold.setEnabled(false);
            }

            // Vertical
            if (upward && ground && !forwardUp && !player.isPotionActive(8)) {
                speed.setEnabled(false);
                scaffold.setEnabled(false);
                scaffold.setSetting("Tower", "Watchdog");
                scaffold.setEnabled(true);
            }
            // Horizontal
            if (moving && !upward && !forwardUp && ground) {
                speed.setEnabled(false);
                scaffold.setEnabled(false);
                scaffold.setSetting("Tower", "Disabled");
                scaffold.setSetting("Sprint", "Watchdog");
                scaffold.setEnabled(true);
            }
            // Horizontal + Vertical
            if (moving && !upward && forwardUp) {
                speed.setEnabled(true);
                speed.setSetting("Fast Fall", true);
                scafSpeed = true;
                scaffold.setEnabled(false);
                scaffold.setSetting("Tower", "Disabled");
                scaffold.setSetting("Sprint", "Watchdog Jump (inconsistent)");
                scaffold.setEnabled(true);
                if (ground) {
                    strafe.setStrafe(false);
                    strafe.setSpeed(randomSpeed);
                    scafJumps++;
                    player.jump();
                }
            } else {
                speed.setEnabled(false);
                scafSpeed = false;
            }
        } else {
            if (scafSpeed) {
                speed.setEnabled(false);
                scafSpeed = false;
            }
            scafJumps = 0;
            scaffold.setSetting("Sprint", "Watchdog");
            speed.setSetting("Fast Fall", player.isPotionActive(1) && !player.isPotionActive(8));
        }
    }

    if (!scafSpeed && watchdogSpeed != "off" && speed.isEnabled()) {
        player.setSprinting(true);
        if (ground && moving) {
            if (player.isPotionActive(1)) {
                randomSpeed = 0.62 + (0.64 - 0.62) * Math.random(); // 0.62-0.64
                strafe.setSpeed(randomSpeed);
                player.jump()
            } else {
                randomSpeed = 0.6 + (0.61 - 0.6) * Math.random(); // 0.6-0.61
                strafe.setSpeed(randomSpeed);
                player.jump()
            }
        }
    }

    if (module.getSetting("Air Velo") != "off") {
        var velo = rise.getModule("Velocity");
        if (ground) {
            velo.setSetting("Vertical", 100);
        } else {
            velo.setSetting("Vertical", 0);
        }
    }
});

// ONRENDER2D
module.handle("onRender2D", function (render2) {
    var blockCounter = module.getSetting("Block Counter");
    var cokeDisplay = module.getSetting("Coke Display");
    var itt = module.getSetting("Item Tool Tips");
    var playtime = module.getSetting("Playtime");
    var watermark = module.getSetting("Watermark");

    if (blockCounter !== "off") {
        var scaffold = rise.getModule("Scaffold");
        var heldItem = player.getInventory().getHeldItem();

        var blockIds = [1, 5, 17, 20, 35];
        var inv = player.getInventory();

        var blockCount = [];
        for (var slot = 0; slot < 9; slot++) {
            var itemStack = inv.getItemStackInSlot(slot);
            if (blockIds.indexOf(itemStack.getItemId()) !== -1) {
                blockCount.push(itemStack.getAmount());
            }
        }

        var totalBlocks = blockCount.reduce(function (total, count) {
            return total + count;
        }, 0);

        var xOffset = (totalBlocks > 999) ? -9 : (totalBlocks >= 100) ? -6 : (totalBlocks >= 10) ? -3 : 0;

        if (totalBlocks > 0 && scaffold.isEnabled()) {
            mcFont.drawWithShadow(totalBlocks + " Blox", 318 + xOffset + 18, 192 - 3, [255, 255, 255]);
            mcFont.drawWithShadow(totalBlocks, 318 + xOffset + 18, 192 - 3, render.getThemeColor());
        }
    }

    if (cokeDisplay != "off") {

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
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 1.5, 3, 3 * 0.5, darkColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 2, 3 * 2, 3 * 0.5, darkColor);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 2.5, 3 * 3, 3 * 0.5, darkColor);
            render.rectangle(311 + 3, 308 + 3 * 3, 3 * 4, 3 * 0.5, darkColor);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 3.5, 3 * 5, 3 * 0.5, darkColor);
            render.rectangle(311, 308 + 3 * 4, 3 * 6, 3 * 1.5, darkColor);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 5.5, 3 * 5, 3 * 0.5, darkColor);
            render.rectangle(311 + 3, 308 + 3 * 6, 3 * 4, 3 * 0.5, darkColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 6.5, 3 * 2, 3 * 0.5, darkColor);

            // Draw white rectangles
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 4, 3 * 3.5, 3 * 1.5, whiteColor);
            render.rectangle(311 + 3, 308 + 3 * 3.5, 3 * 3, 3 * 0.5, whiteColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 2.5, 3 * 1, 3 * 3.5, whiteColor);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 2, 3 * 0.5, 3 * 0.5, whiteColor);

            // Draw light white rectangles
            render.rectangle(311 + 3 * 3, 308 + 3 * 2, 3 * 0.5, 3, lightWhiteColor);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 2.5, 3 * 0.5, 3 * 1.5, lightWhiteColor);
            render.rectangle(311 + 3 * 4, 308 + 3 * 3, 3 * 0.5, 3 * 0.5, lightWhiteColor);
            render.rectangle(311 + 3 * 4, 308 + 3 * 3.5, 3 * 1, 3 * 2, lightWhiteColor);
            render.rectangle(311 + 3 * 5, 308 + 3 * 4, 3 * 0.5, 3 * 1, lightWhiteColor);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, lightWhiteColor);
            render.rectangle(311 + 3, 308 + 3 * 5.5, 3 * 1, 3 * 0.5, lightWhiteColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 6, 3 * 2, 3 * 0.5, lightWhiteColor);
            render.rectangle(311 + 3 * 3, 308 + 3 * 5.5, 3 * 1, 3 * 0.5, lightWhiteColor);

            // Draw white cream rectangles
            render.rectangle(311 + 3, 308 + 3 * 4, 3 * 0.5, 3 * 1, whiteCreamColor);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 4, 3 * 0.5, 3 * 0.5, whiteCreamColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 3.5, 3 * 0.5, 3 * 0.5, whiteCreamColor);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 3, 3 * 0.5, 3 * 0.5, whiteCreamColor);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 3, 3 * 1, 3 * 0.5, whiteCreamColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 5, 3 * 1, 3 * 0.5, whiteCreamColor);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 4.5, 3 * 0.5, 3 * 0.5, whiteCreamColor);
            render.rectangle(311 + 3 * 3, 308 + 3 * 4, 3 * 1, 3 * 0.5, whiteCreamColor);

            // Draw gray rectangles
            render.rectangle(311 + 3 * 3, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, grayColor);
            render.rectangle(311 + 3 * 4, 308 + 3 * 5.5, 3 * 1, 3 * 0.5, grayColor);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, grayColor);
            render.rectangle(311 + 3 * 5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, grayColor);
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 4, 3 * 0.5, 3 * 1, grayColor);
            render.rectangle(311 + 3 * 4, 308 + 3 * 3.5, 3 * 0.5, 3 * 0.5, grayColor);
        }
        
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
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 1.5, 3 * 1.5, 3 * 0.5, brownColor); //top particle
            render.rectangle(311 + 3 * 2, 308 + 3 * 1, 3 * 0.5, 3 * 1.5, brownColor);
            render.rectangle(311 + 3 * 0, 308 + 3 * 2.5, 3 * 1.5, 3 * 0.5, brownColor); //left particle
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 2, 3 * 0.5, 3 * 1.5, brownColor);
            render.rectangle(311 + 3 * 4, 308 + 3 * 2.5, 3 * 1.5, 3 * 0.5, brownColor); //right particle
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 2, 3 * 0.5, 3 * 1.5, brownColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 3.5, 3 * 1.5, 3 * 0.5, brownColor); //middle particle
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 3, 3 * 0.5, 3 * 1.5, brownColor);
            render.rectangle(311 + 3 * 0, 308 + 3 * 3.5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 4, 3 * 0.5, 3 * 1, brownColor);
            render.rectangle(311 + 3 * 1, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 4.5, 3 * 1, 3 * 1, brownColor);
            render.rectangle(311 + 3 * -0.5, 308 + 3 * 4, 3 * 0.5, 3 * 2, brownColor);
            render.rectangle(311 + 3 * 0, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 1, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 2, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 7.5, 3 * 2.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 5, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 5.5, 308 + 3 * 7, 3 * 0.5, 3 * -2, brownColor);
            render.rectangle(311 + 3 * 6, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 5, 308 + 3 * 4.5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 4, 308 + 3 * 4, 3 * 0.5, 3 * 1, brownColor);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 3.5, 3 * 0.5, 3 * 0.5, brownColor);
            render.rectangle(311 + 3 * 3, 308 + 3 * 4.5, 3 * 0.5, 3 * 0.5, brownColor);

            // Draw light yellow rectangles
            render.rectangle(311 + 3 * 2, 308 + 3 * 1.5, 3 * 0.5, 3 * 0.5, lightYellowColor); //top
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 4, 3 * 0.5, 3 * 0.5, lightYellowColor);
            render.rectangle(311 + 3 * 0, 308 + 3 * 4.5, 3 * 0.5, 3 * 0.5, lightYellowColor);
            // Draw yellow
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 2.5, 3 * 0.5, 3 * 0.5, yellowColor); //left
            // Draw Dark Orange
            render.rectangle(311 + 3 * 0, 308 + 3 * 4, 3 * 0.5, 3 * 0.5, darkOrangeColor);
            // Draw torch yellow
            render.rectangle(311 + 3 * 0, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, torchYellowColor);
            // Draw orange
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 2.5, 3 * 0.5, 3 * 0.5, orangeColor); //right
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 3.5, 3 * 0.5, 3 * 0.5, orangeColor); //middle
            render.rectangle(311 + 3 * 3, 308 + 3 * 4, 3 * 0.5, 3 * 0.5, orangeColor);
            render.rectangle(311 + 3 * 0, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, orangeColor);
            // Draw pastel
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, pastelYellow);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 4.5, 3 * 0.5, 3 * 0.5, pastelYellow);
            // Draw rotten brown
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 4.5, 3 * 0.5, 3 * 0.5, rottenBrown);
            render.rectangle(311 + 3 * 3, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, rottenBrown);
            render.rectangle(311 + 3 * 1, 308 + 3 * 5.5, 3 * 2, 3 * 0.5, rottenBrown);
            // Draw nah fuck this fuck blaze color
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, [251, 191, 49]);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [248, 163, 0]);
            render.rectangle(311 + 3 * 0.5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 255, 181]);
            render.rectangle(311 + 3 * 1, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 203, 0]);
            render.rectangle(311 + 3 * 1, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [251, 140, 0]);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [255, 224, 0]);
            render.rectangle(311 + 3 * 1.5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 216, 66]);
            render.rectangle(311 + 3 * 2, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 224, 0]);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [205, 86, 0]);
            render.rectangle(311 + 3 * 3, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 203, 0]);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [202, 118, 0]);
            render.rectangle(311 + 3 * 4, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 163, 0]);
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [255, 223, 70]);
            render.rectangle(311 + 3 * 5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [200, 97, 0]);
            render.rectangle(311 + 3 * 5.5, 308 + 3 * 6, 3 * 0.5, 3 * 0.5, [171, 62, 0]);
            render.rectangle(311 + 3 * 2, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [255, 255, 181]);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, [255, 203, 0]);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, [255, 203, 0]);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, [255, 224, 0]);
            render.rectangle(311 + 3 * 4, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, [255, 255, 181]);
            render.rectangle(311 + 3 * 5, 308 + 3 * 5, 3 * 0.5, 3 * 0.5, [168, 79, 0]);
            render.rectangle(311 + 3 * 5, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [210, 128, 3]);
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [255, 163, 0]);
            render.rectangle(311 + 3 * 4, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [255, 254, 49]);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [255, 163, 0]);
            render.rectangle(311 + 3 * 3, 308 + 3 * 5.5, 3 * 0.5, 3 * 0.5, [255, 255, 181]);
            render.rectangle(311 + 3 * 5, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [168, 73, 0]);
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [168, 79, 0]);
            render.rectangle(311 + 3 * 4, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [234, 138, 0]);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [244, 234, 77]);
            render.rectangle(311 + 3 * 3, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [205, 101, 0]);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [255, 203, 0]);
            render.rectangle(311 + 3 * 2, 308 + 3 * 6.5, 3 * 0.5, 3 * 0.5, [205, 86, 0]);
            render.rectangle(311 + 3 * 2.5, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, [205, 101, 0]);
            render.rectangle(311 + 3 * 3, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, [171, 62, 0]);
            render.rectangle(311 + 3 * 3.5, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, [168, 73, 0]);
            render.rectangle(311 + 3 * 4, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, [168, 79, 0]);
            render.rectangle(311 + 3 * 4.5, 308 + 3 * 7, 3 * 0.5, 3 * 0.5, [171, 62, 0]);
        }
    }
    
    if (playtime != "off") {

        var playtimeText = playtimeSeconds % 60 + "s";
        if (playtimeSeconds >= 3600) {
            playtimeText = Math.floor(playtimeSeconds / 3600) + "h " + Math.floor((playtimeSeconds % 3600) / 60) + "m " + playtimeSeconds % 60 + "s";
        } else if (playtimeSeconds >= 60) {
            playtimeText = Math.floor((playtimeSeconds % 3600) / 60) + "m " + playtimeSeconds % 60 + "s";
        }

        mcFont.drawWithShadow(playtimeText, 3, 15, white);
    }

    if (watermark != "off") {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        var timeString = hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;

        var sepo = "["; // Module opening bracket
        var sepc = "]"; // Module closing bracket
        var maino = " " + sepo; // after exhi text and first opening bracket only
        var mainc = sepc; // MODULE SPACE
        var endc = mainc;
        var sepd = "- ";

        var name = "C50 ";

        mcFont.drawWithShadow("C", 3, 3, render.getThemeColor());
        mcFont.drawWithShadow("50", 3 + mcFont.width("E"), 3, moduleTagColor);

        mcFont.drawWithShadow(maino, 3 + mcFont.width("C50"), 4, [185, 185, 185, 255]);
        mcFont.drawWithShadow(timeString, 3 + mcFont.width("C50 ["), 4, [255, 255, 255, 255]);
        sepc = " ";
        sepo = "  ";
        sepc = "  ";
        mcFont.drawWithShadow(sepc, 3 + mcFont.width("C50 [" + timeString + ""), 4, [185, 185, 185, 255]);
        name += sepo + timeString + endc;

        sepo = sepd;
        sepc = "]";
        sepc = "";
        mcFont.drawWithShadow(sepo, 3 + mcFont.width(name), 4, [185, 185, 185, 255]);
        mcFont.drawWithShadow(mc.getFPS() + " FPS", 3 + mcFont.width(name + sepo), 4, [255, 255, 255, 255]);
        mcFont.drawWithShadow(sepc, 3 + mcFont.width(name + sepo + mc.getFPS() + " FPS"), 4, [185, 185, 185, 255]);
        name += sepo + mc.getFPS() + " FPS" + endc;

        sepc = "]"; //editor
        sepo = "- ";
        mcFont.drawWithShadow(sepo, 3 + mcFont.width(name), 4, [185, 185, 185, 255]);
        mcFont.drawWithShadow(rise.getPing() + " ms", 3 + mcFont.width(name + sepo), 4, [255, 255, 255, 255]);
        mcFont.drawWithShadow(sepc, 3 + mcFont.width(name + sepo + rise.getPing() + " ms"), 4, [185, 185, 185, 255]);
    }
	
    if (itt != "off") {
        try {
            var heldItem = player.getHeldItemStack().getName();
        } catch (error) {
            return;
        }

        if (!heldItem) return;

        if (heldItem !== currentItem) {
            currentItem = heldItem;
        }

        var ittx = render2.getScaledWidth() / 2 - mcFont.width(currentItem) / 2;
        var itty = render2.getScaledHeight() - 60;

        var absorption = player.getAbsorption() || player.getMaxHealth() - 20;
        var maxHealth = player.getMaxHealth() - 20;

        var totalAbsorption = absorption + maxHealth;
        var absorptionRows = Math.ceil(totalAbsorption / 20);
        itty -= absorptionRows * 4;

        if (absorption > 0) itty -= 10;

        mcFont.drawWithShadow(currentItem, ittx, itty, [255, 255, 255]);
    }
});

// ONRENDER3D
module.handle("onRender3D", function () {
    var bedPlates = module.getSetting("Bed Plates");

    if (bedPlates !== "off") {
        var breaker = rise.getModule("Breaker");
        var playerPos = player.getPosition();
        var x = Math.floor(playerPos.getX());
        var y = Math.floor(playerPos.getY());
        var z = Math.floor(playerPos.getZ());
        var killaura = rise.getModule("Kill Aura");
        var sneaking = input.isKeyBindSneakDown();

        function drawCubeAroundBlock(blockPos) {
            var x = blockPos.getPosition().getX() + 0.5;
            var y = blockPos.getPosition().getY() + 0.25 - 0.25;
            var z = blockPos.getPosition().getZ() + 0.5;

            var vertices = [
                { x: x - 0.5, y: y, z: z - 0.5 },
                { x: x + 0.5, y: y, z: z - 0.5 },
                { x: x + 0.5, y: y + bedPlateSize, z: z - 0.5 },
                { x: x - 0.5, y: y + bedPlateSize, z: z - 0.5 },
                { x: x - 0.5, y: y, z: z + 0.5 },
                { x: x + 0.5, y: y, z: z + 0.5 },
                { x: x + 0.5, y: y + bedPlateSize, z: z + 0.5 },
                { x: x - 0.5, y: y + bedPlateSize, z: z + 0.5 }
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

        function renderCubeAboveBed(blockPos) {
            
            var blockName = world.getBlockName(blockPos);
            if (blockName == "Obsidian") {
                var bedPlatesColor = [0, 255, 0];
            } else {
                var bedPlatesColor = render.getThemeColor();
            }


            var lines = drawCubeAroundBlock(blockPos, 1);
            for (var j = 0; j < lines.length; j++) {
                var start = lines[j][0];
                var end = lines[j][1];
                render.drawLine3D(start, end, bedPlatesColor, 4);
            }
        }

        breakable = false;

        for (var offsetX = -5; offsetX <= 5; offsetX++) {
            for (var offsetY = -5; offsetY <= 5; offsetY++) {
                for (var offsetZ = -5; offsetZ <= 5; offsetZ++) {
                    var blockX = x + offsetX;
                    var blockY = y + offsetY;
                    var blockZ = z + offsetZ;

                    var blockPos = world.newBlockPos(blockX, blockY, blockZ);
                    var abovePos = world.newBlockPos(blockX, blockY + 1, blockZ);
                    var blockName = world.getBlockName(blockPos);
                    var aboveName = world.getBlockName(abovePos);

                    if (blockName != "Air") {
                        if (blockName == "Bed") {
                            bedPlateSize = 0.5625;
                            renderCubeAboveBed(blockPos, 1);
                        } else if (blockName == "Obsidian") {
                            bedPlateSize = 1;
                            renderCubeAboveBed(blockPos, 1);
                        }
                    }
                }
            }
        }
    }

    var scaffoldOverlay = module.getSetting("Scaffold Overlay");

    if (scaffoldOverlay !== "off") {
        var renderScaffoldOverlay = function () {

            var playerPos = player.getPosition();
            var blockPos = world.newBlockPos(Math.floor(playerPos.getX()), Math.floor(playerPos.getY()) - 1, Math.floor(playerPos.getZ()));

            var lines = drawScaffoldOverlay(blockPos, 1);
            for (var j = 0; j < lines.length; j++) {
                var start = lines[j][0];
                var end = lines[j][1];
                render.drawLine3D(start, end, [255, 255, 255, 100], 3);
            }
        };

        var scaffold = rise.getModule("Scaffold");

        if (scaffoldOverlay !== "off" && scaffold.isEnabled()) {
            renderScaffoldOverlay();
        }
    }

    function drawScaffoldOverlay(blockPos, size) {
        var halfSize = size / 2;
        var x = blockPos.getPosition().getX() + 0.5;
        var y = blockPos.getPosition().getY() + 0.5;
        var z = blockPos.getPosition().getZ() + 0.5;

        var vertices = [
            { x: x - halfSize, y: y - halfSize, z: z - halfSize },
            { x: x + halfSize, y: y - halfSize, z: z - halfSize },
            { x: x + halfSize, y: y + halfSize, z: z - halfSize },
            { x: x - halfSize, y: y + halfSize, z: z - halfSize },
            { x: x - halfSize, y: y - halfSize, z: z + halfSize },
            { x: x + halfSize, y: y - halfSize, z: z + halfSize },
            { x: x + halfSize, y: y + halfSize, z: z + halfSize },
            { x: x - halfSize, y: y + halfSize, z: z + halfSize }
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
        
        for (var i = 0; i < lines.length; i++) {
            lines[i][0] = rise.newVec3(lines[i][0].x, lines[i][0].y, lines[i][0].z);
            lines[i][1] = rise.newVec3(lines[i][1].x, lines[i][1].y, lines[i][1].z);
        }

        return lines;
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
