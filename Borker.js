/*

 TO DO:
 Add ABORT_DESTROY_BLOCK
 Add Auto Tool

*/

var module = rise.registerModule("Borker", "borks beds");
module.registerSetting("boolean", "Randomization", false);

var locked = false;
var swings = 4;
var nukingAbove = true; 
var nukingBed = false;

module.handle("onTick", function () {
    var randomization = module.getSetting("Randomization");
    var playerPos = player.getPosition();
    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());
    var killaura = rise.getModule("Kill Aura");
    var sneaking = input.isKeyBindSneakDown();

    if (locked && inRange) {
        swings++;
        if (swings == 5) {
            player.swingItem();
            swings = 0;
        }
    }

    if (randomization) {
        randomX = Math.random() * 0.1 + 0;
        randomY = Math.random() * 0.1 + 0;
        randomZ = Math.random() * 0.1 + 0;
    } else {
        randomX = 0;
        randomY = 0;
        randomZ = 0;
    }

    var breakable = false;

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
                
                var sideX = world.newBlockPos(blockX + 1, blockY, blockZ);
                var sideNX = world.newBlockPos(blockX - 1, blockY, blockZ);
                var sideZ = world.newBlockPos(blockX, blockY, blockZ + 1);
                var sideNZ = world.newBlockPos(blockX, blockY, blockZ - 1);

                var sideXName = world.getBlockName(sideX);
                var sideNXName = world.getBlockName(sideNX);
                var sideZName = world.getBlockName(sideZ);
                var sideNZName = world.getBlockName(sideNZ);

                if (blockName != "tile.air.name" || blockName != "Air") {
                    if (blockName == "Bed") {
                        var bedPos = rise.newVec3(blockX + 0.5 + randomX, blockY + 0.3 + randomY, blockZ + 0.5 + randomZ);
                        var distance = player.getDistance(blockX + 0.5 + randomX, blockY + 0.3 + randomY, blockZ + 0.5 + randomZ);
                        var aboveBlockPos = rise.newVec3(blockX + 0.5 + randomX, blockY + 1.3 + randomY, blockZ + 0.5 + randomZ);
                        if (aboveName == "tile.air.name" || aboveName == "Air" || sideXName == "tile.air.name" || sideXName == "Air" || sideNXName == "tile.air.name" || sideNXName == "Air" || sideZName == "tile.air.name" || sideZName == "Air" || sideNZName == "tile.air.name" || sideNZName == "Air") {
                            breakable = true;
                        }
                    }
                }
            }
        }
    }

    if (!killaura.isEnabled() && sneaking && distance <= 4.5) {
        locked = true;
    }

    if (locked) {

        if (distance <= 4.5) {
            inRange = true;
        } else {
            inRange = false;
            locked = false;
        }

        killaura.setEnabled(false);

        if (inRange) {
            if (breakable) { // BED
                var rotations = player.calculateRotations(bedPos);
                player.setRotation(rotations, 10, true);
                nukingBed = true;
                if (nukingBed) {
                    packet.sendDigging("START_DESTROY_BLOCK", bedPos, "UP");
                    packet.sendDigging("STOP_DESTROY_BLOCK", bedPos, "UP");
                    nukingBed = false;
                    nukingAbove = true;
                    swings = 4;
                }
            } else { // TOP BLOCK
                var rotations = player.calculateRotations(aboveBlockPos);
                player.setRotation(rotations, 10, true);
                if (nukingAbove) {
                    packet.sendDigging("START_DESTROY_BLOCK", aboveBlockPos, "UP");
                    packet.sendDigging("STOP_DESTROY_BLOCK", aboveBlockPos, "UP");
                    nukingAbove = false;
                }
            }
        }
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
