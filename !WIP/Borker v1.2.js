/*

 TO DO:
 Add ABORT_DESTROY_BLOCK

*/

var module = rise.registerModule("Borker", "borks beds v1.2 (easiest choice + plates)");
module.registerSetting("mode", "ScriptMode", "Pro", "Pro");
module.setSettingVisibility("ScriptMode", false);

module.registerSetting("boolean", "Randomization", false);
module.registerSetting("number", "Range", 4, 3, 5, 0.1);
module.registerSetting("mode", "Info", "Render", "Render", "Chat", "None");
module.registerSetting("mode", "Render", "LGBT", "LGBT", "None");
module.registerSetting("mode", "Rotation", "Both", "Both", "Surrounding", "Bed", "None");
module.registerSetting("mode", "Swing", "Both", "Both", "Surrounding", "Bed", "None");

var breakable = false;
var locked = false;
var nukingSurrounding = true;
var nukingBed = null;
var pickaxeSlot = 0;
var axeSlot = 0;
var shearsSlot = 0;
var inRange = false;

var mcFont = render.getMinecraftFontRenderer();
var leastHardBlockName = null;
var renderX = null;
var renderY = null;
var renderZ = null;
var toolUsed = null;
var renderBlockX = null;
var renderBlockY = null;
var renderBlockZ = null;

//RGB function
function rainbowColor(opacity) {
    var phase = Date.now() * 0.04;
    var center = 128;
    var width = 127;
    var red = Math.sin(0.04 * phase + 2) * width + center;
    var green = Math.sin(0.04 * phase + 0) * width + center;
    var blue = Math.sin(0.04 * phase + 4) * width + center;

    return [red, green, blue, opacity];
}

module.handle("onTick", function () {
    var randomization = module.getSetting("Randomization");
    var range = module.getSetting("Range");
    var info = module.getSetting("Info");
    var rotational = module.getSetting("Rotation");
    var swing = module.getSetting("Swing");
    var playerPos = player.getPosition();
    var x = Math.floor(playerPos.getX());
    var y = Math.floor(playerPos.getY());
    var z = Math.floor(playerPos.getZ());
    var killaura = rise.getModule("Kill Aura");
    var sneaking = input.isKeyBindSneakDown();
    renderX = null;
    renderY = null;
    renderZ = null;

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
                    rise.displayChat("Pick");
                    toolUsed = "Picking";
                    return;
                }
            } else if (type == "axe") {
                if (itemId == 279 || itemId == 258 || itemId == 286 || itemId == 275 || itemId == 271) {
                    player.setSlot(slot);
                    rise.displayChat("Axe");
                    toolUsed = "Axing";
                    return;
                }
            } else if (type == "shears") {
                if (itemId == 359) {
                    player.setSlot(slot);
                    rise.displayChat("Shears");
                    toolUsed = "Shearing";
                    return;
                }
            } else {
                rise.displayChat("Breaking");
                toolUsed = "Breaking";
                return;
            }
        }
    }

    function pickaxeSlotFinder() {
        for (var slot = 0; slot < 9; slot++) {
            var item = player.getInventory().getItemStackInSlot(slot);
            var itemId = item.getItemId();
            if (itemId == 278 || itemId == 257 || itemId == 285 || itemId == 274 || itemId == 270) {
                pickaxeSlot = slot;
                return;
            }
        }
    }
    function axeSlotFinder() {
        for (var slot = 0; slot < 9; slot++) {
            var item = player.getInventory().getItemStackInSlot(slot);
            var itemId = item.getItemId();
            if (itemId == 279 || itemId == 258 || itemId == 286 || itemId == 275 || itemId == 271) {
                axeSlot = slot;
                return;
            }
        }
    }
    function shearsSlotFinder() {
        for (var slot = 0; slot < 9; slot++) {
            var item = player.getInventory().getItemStackInSlot(slot);
            var itemId = item.getItemId();
            if (itemId == 359) {
                shearsSlot = slot;
                return;
            }
        }
    }

    breakable = false;
    var easiest = [];

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
                        renderBlockX = blockX;
                        renderBlockY = blockY;
                        renderBlockZ = blockZ;
                        var distance = player.getDistance(blockX + 0.5 + randomX, blockY + 0.3 + randomY, blockZ + 0.5 + randomZ);
                        if (aboveName == "tile.air.name" || aboveName == "Air" || aboveName == "Ladder" || sideXName == "tile.air.name" || sideXName == "Air" || sideXName == "Ladder" || sideNXName == "tile.air.name" || sideNXName == "Air" || sideNXName == "Ladder" || sideZName == "tile.air.name" || sideZName == "Air" || sideZName == "Ladder" || sideNZName == "tile.air.name" || sideNZName == "Air" || sideNZName == "Ladder") {
                            breakable = true;
                        }

                        var aboveId = abovePos.getBlock().getId();

                        easiest.push({ x: blockX, y: blockY + 1, z: blockZ });
                        var sideBlocks = [
                            { x: blockX + 1, y: blockY, z: blockZ },
                            { x: blockX - 1, y: blockY, z: blockZ },
                            { x: blockX, y: blockY, z: blockZ + 1 },
                            { x: blockX, y: blockY, z: blockZ - 1 }
                        ];
                        sideBlocks.forEach(function (sideBlock) {
                            var sideBlockPos = world.newBlockPos(sideBlock.x, sideBlock.y, sideBlock.z);
                            var sideBlockName = world.getBlockName(sideBlockPos);
                            if (sideBlockName != "Bed") {
                                easiest.push(sideBlock);
                            }
                        });
                    }
                }
            }
        }
    }

    var blockInfo = [];
    var rotation;

    easiest.forEach(function (coord) {
        var blockPos = world.newBlockPos(coord.x, coord.y, coord.z);
        var blockId = blockPos.getBlock().getId();
        var hardness;

        if (blockId == 159 || blockId == 121 || blockId == 49) {
            pickaxeSlotFinder();
            hardness = blockPos.getHardness(pickaxeSlot);
        } else if (blockId == 5) {
            axeSlotFinder();
            hardness = blockPos.getHardness(axeSlot);
        } else if (blockId == 35) {
            shearsSlotFinder();
            hardness = blockPos.getHardness(shearsSlot);
        } else {
            hardness = blockPos.getHardness();
        }

        var hardnum = 1 / hardness;
        blockInfo.push({
            position: rise.newVec3(coord.x, coord.y, coord.z),
            name: blockPos.getBlock().getName(),
            id: blockPos.getBlock().getId(),
            hardnum: hardnum
        });
    });

    var renderLeastHardBlock = false;
    var leastHardBlock = blockInfo[0];
    for (var i = 1; i < blockInfo.length; i++) {
        if (blockInfo[i].hardnum < leastHardBlock.hardnum) {
            leastHardBlock = blockInfo[i];
        }
    }


    if (!killaura.isEnabled() && sneaking && distance <= range) {
        locked = true;
    }

    if (locked) {

        if (distance <= range) {
            inRange = true;
        } else {
            inRange = false;
            locked = false;
        }

        killaura.setEnabled(false);

        if (inRange) {
            if (breakable) { // BED
                var rotations = player.calculateRotations(bedPos);
                if (rotational == "Both" || rotational == "Bed") player.setRotation(rotations, 10, true);
                if (!nukingBed || !bedPos.equals(nukingBed)) {
                    autoTool("shears");
                    packet.sendDigging("START_DESTROY_BLOCK", bedPos, "UP");
                    packet.sendDigging("STOP_DESTROY_BLOCK", bedPos, "UP");
                    leastHardBlockName = "";
                    if (info == "Chat") rise.displayChat("Bed");
                    nukingBed = bedPos;
                    nukingSurrounding = true;
                }
                if (swing == "Both" || swing == "Bed") player.swingItem();
            } else { // EASIEST BLOCK
                var rotations = player.calculateRotations(leastHardBlock.position);
                if (rotational == "Both" || rotational == "Surrounding") player.setRotation(rotations, 10, true);
                renderX = leastHardBlock.position.getX();
                renderY = leastHardBlock.position.getY();
                renderZ = leastHardBlock.position.getZ();
                if (nukingSurrounding) {
                    if (leastHardBlock.id == 172 || leastHardBlock.id == 121 || leastHardBlock.id == 49) {
                        autoTool("pickaxe");
                    } else if (leastHardBlock.id == 5) {
                        autoTool("axe");
                    } else if (leastHardBlock.id == 35) {
                        autoTool("shears");
                    } else {
                        autoTool();
                    }
                    packet.sendDigging("START_DESTROY_BLOCK", leastHardBlock.position, "UP");
                    packet.sendDigging("STOP_DESTROY_BLOCK", leastHardBlock.position, "UP");
                    leastHardBlockName = leastHardBlock.name;
                    if (info == "Chat") rise.displayChat(leastHardBlock.name);
                    nukingSurrounding = false;
                }
                if (swing == "Both" || swing == "Surrounding") player.swingItem();
            }
        }
    }
});


module.handle("onRender2D", function () {
    var info = module.getSetting("Info");

    if (info == "Render") {
        if (inRange) {
            if (breakable) {
                mcFont.drawWithShadow(toolUsed + " Bed", 335, 178, [255, 255, 255]);
            } else {
                mcFont.drawWithShadow(toolUsed + " " + leastHardBlockName, 335, 178, [255, 255, 255]);
            }
        }
    }
});

// ONRENDER3D
module.handle("onRender3D", function () {
    var renderMode = module.getSetting("Render");

    if (renderMode == "LGBT") {
        function drawOverlay(blockPos, size) {
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

        function renderOverlay() {

            if (inRange) {
                if (breakable) {
                    var blockPos = world.newBlockPos(renderBlockX, renderBlockY, renderBlockZ);
                    var lines = drawOverlay(blockPos, 1);
                    for (var j = 0; j < lines.length; j++) {
                        var start = lines[j][0];
                        var end = lines[j][1];
                        render.drawLine3D(start, end, rainbowColor(255), 3);
                    }
                } else {
                    var blockPos = world.newBlockPos(renderX, renderY, renderZ);
                    var lines = drawOverlay(blockPos, 1);
                    for (var j = 0; j < lines.length; j++) {
                        var start = lines[j][0];
                        var end = lines[j][1];
                        render.drawLine3D(start, end, rainbowColor(255), 3);
                    }
                }
            }
        };

        renderOverlay();
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });