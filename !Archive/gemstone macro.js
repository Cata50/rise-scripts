var module = rise.registerModule("!test", "macro");
module.registerSetting("mode", "Mode", "LMB", "LMB", "Nuke");
module.registerSetting("string", "Path", "18, 100, 6");
module.registerSetting("string", "AOTV", "Heroic Aspect of the Void");
module.registerSetting("string", "Drill", "Jasper Drill");

var locked = false;
var swings = 4;
var pathNum = 0;
var pathX = 0;
var pathY = 1;
var pathZ = 2;
var nextPathVec3 = null;
var rightClickOnce = false;
var aotvCd = 5;

function switchToDrill() {
    for (var slot = 0; slot < 9; slot++) {
        var item = player.getInventory().getItemStackInSlot(slot);
        if (item && item.getItemId() == 409 && module.getSetting("Drill")) {
            player.setSlot(slot);
            return;
        }
    }
    rise.displayChat("AOTV not found");
}

function switchToAOTV() {
    for (var slot = 0; slot < 9; slot++) {
        var item = player.getInventory().getItemStackInSlot(slot);
        if (item && item.getItemId() == 277 && module.getSetting("Drill")) {
            player.setSlot(slot);
            return;
        }
    }
    rise.displayChat("AOTV not found");
}

module.handle("onTick", function () {
    var path = module.getSetting("Path").split(',').map(function (point) { return parseInt(point.trim()); });
    var playerPos = player.getPosition();
    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());
    var sneaking = input.isKeyBindSneakDown();

    if (x === path[pathX] && y - 1 === path[pathY] && z === path[pathZ]) {
        rise.displayChat("Next");
        pathX += 3;
        pathY += 3;
        pathZ += 3;
        rise.displayChat("Teleporting");
        rightClickOnce = true;
        if (pathX >= path.length || pathY >= path.length || pathZ >= path.length) {
            pathX = 0;
            pathY = 1;
            pathZ = 2;
            rise.displayChat("Repeating");
        }
        nextPathVec3 = rise.newVec3(path[pathX], path[pathY], path[pathZ]);
    }

    if (locked && module.getSetting("Mode") == "Nuke") {
        swings++;
        if (swings == 5) {
            //player.swingItem();
            swings = 0;
        }
    }

    var closestBedPos;
    var closestDistance = Infinity;
    var nukingGlass = false;

    for (var offsetX = -3; offsetX <= 3; offsetX++) {
        for (var offsetY = -3; offsetY <= 3; offsetY++) {
            for (var offsetZ = -3; offsetZ <= 3; offsetZ++) {
                var blockX = x + offsetX;
                var blockY = y + offsetY;
                var blockZ = z + offsetZ;

                var blockPos = world.newBlockPos(blockX, blockY, blockZ);
                var blockPos1 = world.newBlockPos(blockX, blockY + 1, blockZ);
                var blockName = world.getBlockName(blockPos);
                var blockName1 = world.getBlockName(blockPos1);

                if (blockName !== "tile.air.name" && blockName === "Stained Glass") {
                    nukingGlass = true;
                    var bedPos = rise.newVec3(blockX + 0.5, blockY + 0.3, blockZ + 0.5);
                    var distance = player.getDistance(blockX + 0.5, blockY + 0.3, blockZ + 0.5);

                    if (distance < closestDistance) {
                        closestBedPos = bedPos;
                        closestDistance = distance;
                    }
                }
            }
        }
    }

    if (sneaking && closestBedPos) {
        var rotations = player.calculateRotations(closestBedPos);
        player.setRotation(rotations, 10, true);
        if (module.getSetting("Mode") == "Nuke") {
            //packet.sendDigging("START_DESTROY_BLOCK", closestBedPos, "UP");
            //packet.sendDigging("STOP_DESTROY_BLOCK", closestBedPos, "UP");
        }
        locked = true;
        swings = 4;
    } else {
        locked = false;
    }

    if (sneaking && !nukingGlass && nextPathVec3) {
        var rotations = player.calculateRotations(nextPathVec3);
        player.setRotation(rotations, 10, true);
        aotvCd--;
        if (rightClickOnce && aotvCd == 0) {
            switchToAOTV();
            player.rightClick();
            rightClickOnce = false;
            switchToDrill();
            aotvCd = 5;
        }
    }
});

script.handle("onUnload", function () { module.unregister(); });
