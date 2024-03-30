var module = rise.registerModule("Defender", "defends bed");

module.handle("onTick", function () {
    var playerPos = player.getPosition();
    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());
    var sneaking = input.isKeyBindSneakDown();


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
                        var sideXPos = rise.newVec3(blockX + 1, blockY, blockZ);
                        var sideNXPos = rise.newVec3(blockX - 1, blockY, blockZ);
                        var sideYPos = rise.newVec3(blockX, blockY + 1, blockZ);
                        var sideZPos = rise.newVec3(blockX, blockY, blockZ + 1);
                        var sideNZPos = rise.newVec3(blockX, blockY, blockZ - 1);

                        if (sneaking) {
                            if (sideXName == "tile.air.name" || sideXName == "Air") {
                                rise.displayChat("sideX");
                                packet.sendPlacement(sideXPos, 0, blockX + 1, blockY, blockZ);
                            }
                            if (sideNXName == "tile.air.name" || sideNXName == "Air") {
                                rise.displayChat("sideNX");
                                packet.sendPlacement(sideNXPos, 0, blockX - 1, blockY, blockZ);
                            }
                            if (aboveName == "tile.air.name" || aboveName == "Air") {
                                rise.displayChat("sideY");
                                packet.sendPlacement(sideYPos, 0, blockX + 1, blockY, blockZ);
                            }
                            if (sideZName == "tile.air.name" || sideZName == "Air") {
                                rise.displayChat("sideZ");
                                packet.sendPlacement(sideZPos, 0, blockX + 1, blockY, blockZ);
                            }
                            if (sideNZName == "tile.air.name" || sideNZName == "Air") {
                                rise.displayChat("sideNZ");
                                packet.sendPlacement(sideNZPos, 0, blockX - 1, blockY, blockZ);
                            }
                        }
                    }
                }
            }
        }
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });