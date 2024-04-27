var module = rise.registerModule("Gemstoner", "A Gemstone Macro for Hypixel Skyblock - by a depressed creature");
module.registerSetting("string", "Keybind", "35");
module.registerSetting("string", "Path", "719, 62, 753, 702, 62, 755, 693, 62, 764, 678, 62, 769, 683, 62, 791, 689, 62, 786, 686, 62, 802, 661, 62, 795, 664, 62, 802, 648, 62, 799, 648, 62, 780, 650, 62, 761, 655, 62, 774, 640, 62, 751, 641, 62, 736, 669, 62, 714, 676, 62, 722, 690, 62, 731, 716, 62, 713, 721, 62, 703, 736, 62, 707, 762, 62, 689, 758, 62, 724, 737, 62, 721");
module.registerSetting("number", "AOTV Slot", 0, 0, 8);
module.registerSetting("number", "Drill Slot", 1, 0, 8);

var startMacro = false;
var swapToDrill = true;
var drillDelay = 5;
var breakable = false;
var nukeDelay = 5;
var packetDelay = 5;
var swings = 4;
var previousPos = null;
var aotvDelay = 5;
var clickDelay = 5;
var pathX = 0;
var pathY = 1;
var pathZ = 2;
var aotvReady = false;
var aotvMsg = false;

module.handle("onTick", function () {
    var keybind = module.getSetting("Keybind");
    var path = module.getSetting("Path").split(',').map(function (point) { return parseInt(point.trim()); });
    var aotvSlot = module.getSetting("AOTV Slot");
    var drillSlot = module.getSetting("Drill Slot");

    var playerPos = player.getPosition();
    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());

    function startDetector() { // keybind on path0 to start
        if (x == path[0] && y - 1 == path[1] && z == path[2] && input.isKeyDown(keybind)) {
            startMacro = true;
            rise.displayChat("Starting...");
        }
    }

    function swapDrill() {
        if (drillDelay > 0) {
            drillDelay--;
        } else {
            if (drillDelay == 0) {
                player.setSlot(drillSlot);
                rise.displayChat("Swapped to Drill");
                drillDelay = 5;
                swapToDrill = false;
            }
        }
    }

    var closestGemPos;
    var closestDistance = Infinity;
    var breakable = false;

    for (var offsetX = -4; offsetX <= 4; offsetX++) {
        for (var offsetY = -4; offsetY <= 4; offsetY++) {
            for (var offsetZ = -4; offsetZ <= 4; offsetZ++) {
                var blockX = x + offsetX;
                var blockY = y + offsetY;
                var blockZ = z + offsetZ;

                var blockPos = world.newBlockPos(blockX, blockY, blockZ);
                var blockPos1 = world.newBlockPos(blockX, blockY + 1, blockZ);
                var blockName = world.getBlockName(blockPos);
                var blockName1 = world.getBlockName(blockPos1);

                if (blockName != "tile.air.name" || blockName != "Air") {
                    if (blockName == "Stained Glass" || blockName == "Stained Glass Pane") {
                        breakable = true;
                        var gemPos = rise.newVec3(blockX + 0.5, blockY + 0.5, blockZ + 0.5);
                        var distance = player.getDistance(blockX + 0.5, blockY + 0.5, blockZ + 0.5);

                        if (distance < closestDistance) {
                            closestGemPos = gemPos;
                            closestDistance = distance;
                        }
                    }
                }
            }
        }
    }

    function nukeIt() {
        var rotations = player.calculateRotations(gemPos);
        player.setRotation(rotations, 10, true);
        if (nukeDelay > 0) {
            nukeDelay--;
        } else {
            if (packetDelay > 0) {
                packetDelay--;
            } else {
                if (!previousPos || !gemPos.equals(previousPos)) {
                    packet.sendDigging("START_DESTROY_BLOCK", gemPos, "DOWN");
                    packet.sendDigging("STOP_DESTROY_BLOCK", gemPos, "DOWN");
                    rise.displayChat("Mining");
                    previousPos = gemPos;
                }
                swings++;
                if (swings == 5) {
                    player.swingItem();
                    swings = 0;
                }
            }
        }
    }

    if (aotvReady && !breakable) {
        if (x === path[pathX] && y - 1 === path[pathY] && z === path[pathZ]) {
            rise.displayChat("Set Next Path");
            pathX += 3;
            pathY += 3;
            pathZ += 3;
            if (pathX >= path.length || pathY >= path.length || pathZ >= path.length) {
                pathX = 0;
                pathY = 1;
                pathZ = 2;
                rise.displayChat("Repeating");
            }
            nextPath = rise.newVec3(path[pathX], path[pathY], path[pathZ]);
        }
    }

    function aotv() {
        if (aotvDelay > 0) {
            aotvDelay--;
        } else {
            if (aotvDelay == 0) {
                player.setSlot(aotvSlot);
                if (!aotvMsg) rise.displayChat("Swapped to AOTV"); aotvMsg = true;
                if (clickDelay > 0) {
                    clickDelay--;
                } else {
                    player.rightClick();
                    rise.displayChat("Teleported");
                    aotvDelay = 5;
                    clickDelay = 5;
                    aotvReady = false;
                    aotvMsg = false;
                    swapToDrill = true;
                    nukeDelay = 5;
                    packetDelay = 5;
                }
            }
        }
    }

    if (startMacro) {
        if (swapToDrill && closestGemPos) swapDrill();

        if (breakable && closestGemPos) {
            nukeIt();
            aotvReady = true;
        } else {
            swings = 4;
        }

        if (aotvReady && !breakable) {
            var rotations = player.calculateRotations(nextPath);
            player.setRotation(rotations, 10, false);
            aotv();
        }

    } else {
        startDetector();
    }

});


script.handle("onUnload", function () { module.unregister(); });