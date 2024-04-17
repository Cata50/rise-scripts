/*

 TO DO:
 Add ABORT_DESTROY_BLOCK

*/

var module = rise.registerModule("Borker", "borks beds v1.1 (auto tool)");
module.registerSetting("boolean", "Randomization", false);

var locked = false;
var nukingAbove = true;
var nukingBed = null;

module.handle("onTick", function () {
    var randomization = module.getSetting("Randomization");
    var playerPos = player.getPosition();
    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());
    var killaura = rise.getModule("Kill Aura");
    var sneaking = input.isKeyBindSneakDown();

    if (randomization) {
        randomX = Math.random() * 0.1 + 0;
        randomY = Math.random() * 0.1 + 0;
        randomZ = Math.random() * 0.1 + 0;
    } else {
        randomX = 0;
        randomY = 0;
        randomZ = 0;
    }

    function autoTool(type) {
        for (var slot = 0; slot < 9; slot++) {
            var item = player.getInventory().getItemStackInSlot(slot);
            var itemId = item.getItemId();
            if (type == "pickaxe") {
                if (itemId == 278 || itemId == 257 || itemId == 285 || itemId == 274 || itemId == 270) {
                    player.setSlot(slot);
                    return;
                }
            }
            if (type == "axe") {
                if (itemId == 279 || itemId == 258 || itemId == 286 || itemId == 275 || itemId == 271) {
                    player.setSlot(slot);
                    return;
                }
            }
            if (type == "shears") {
                if (itemId == 359) {
                    player.setSlot(slot);
                    return;
                }
            }
        }
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

                        var aboveId = abovePos.getBlock().getId();

                        if (locked && inRange) {
                            if (aboveId == 172 || aboveId == 121 || aboveId == 49) {
                                autoTool("pickaxe");
                            } else if (aboveId == 5) {
                                autoTool("axe");
                            } else if (aboveId == 35) {
                                autoTool("shears");
                            }
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
                autoTool("shears");
                if (!nukingBed || !bedPos.equals(nukingBed)) {
                    packet.sendDigging("START_DESTROY_BLOCK", bedPos, "UP");
                    packet.sendDigging("STOP_DESTROY_BLOCK", bedPos, "UP");
                    rise.displayChat("Bed");
                    nukingBed = bedPos;
                    nukingAbove = true;
                }
                player.swingItem();
            } else { // TOP BLOCK
                var rotations = player.calculateRotations(aboveBlockPos);
                player.setRotation(rotations, 10, true);
                if (nukingAbove) {
                    packet.sendDigging("START_DESTROY_BLOCK", aboveBlockPos, "UP");
                    packet.sendDigging("STOP_DESTROY_BLOCK", aboveBlockPos, "UP");
                    rise.displayChat("Top");
                    nukingAbove = false;
                }
                player.swingItem();
            }
        }
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });