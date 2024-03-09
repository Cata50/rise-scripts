// MODULE
var module = rise.registerModule("Filter", "[WIP] antibot...");
module.registerSetting("mode", "Mode", "Custom", "Custom", "Bedwars");

module.registerSetting("number", "X", 3, 1, 1000);
module.registerSetting("number", "Y", 25, 1, 1000);
module.registerSetting("boolean", "Color Code Only", false);
module.registerSetting("boolean", "Have Space", false);
module.registerSetting("boolean", "Dev", false);
module.registerSetting("boolean", "Remove NPC", false);
module.registerSetting("boolean", "Extra", false);
module.registerSetting("number", "Render", 20, 8, 40);
module.registerSetting("string", "Black List", "");

module.setSettingVisibility("Remove NPC", false);
module.setSettingVisibility("Extra", false);
module.setSettingVisibility("Render", false);
module.setSettingVisibility("Black List", false);

var mcFont = render.getMinecraftFontRenderer();

function renderNames(playerList, localPlayerName, x, y, mcFont, colorCodeOnly, haveSpace, removeNPC, extra, renderLimit, blacklist) {
    var livingEntities = world.getEntities();
    var entitiesToRemove = [];

    for (var i = 0; i < livingEntities.length; i++) {
        var entity = livingEntities[i];
        var displayName = entity.getDisplayName();

        var hasColorCode = displayName.indexOf("§") !== -1;
        var hasSpace = displayName.indexOf(" ") !== -1;

        if ((!colorCodeOnly || (colorCodeOnly && hasColorCode)) && (!haveSpace || (haveSpace && hasSpace)) && (extra || (!extra && entity.isPlayer() && displayName !== localPlayerName))) {
            var exclude = false;
            for (var j = 0; j < blacklist.length; j++) {
                if (displayName === blacklist[j]) {
                    exclude = true;
                    break;
                }
            }
            if (!exclude) {
                playerList.push(displayName);
            }
        } else {
            // Collect entity IDs to remove them from the world
            entitiesToRemove.push(entity.getEntityId());
        }
    }

    // Remove excluded entities from the world
    for (var j = 0; j < entitiesToRemove.length; j++) {
        world.removeEntity(entitiesToRemove[j]);
    }

    for (var k = 0; k < Math.min(renderLimit, playerList.length); k++) {
        mcFont.drawWithShadow(playerList[k], x, y + 10 * (k + 1), [255, 255, 255]);
    }
}

// FUNCTION ONRENDER2D
module.handle("onRender2D", function (render2) {
    var mode = module.getSetting("Mode");
    var x = module.getSetting("X");
    var y = module.getSetting("Y");
    var colorCodeOnly = module.getSetting("Color Code Only");
    var dev = module.getSetting("Dev");
    var removeNPC = module.getSetting("Remove NPC");
    var extra = module.getSetting("Extra");
    var renderLimit = module.getSetting("Render");
    var blacklistString = module.getSetting("Black List");
    var blacklist = blacklistString ? blacklistString.split(',').map(function (entity) { return entity.trim(); }) : []; // Split exclusion list and trim whitespaces

    var scaledHeight = render2.getScaledHeight();
    var scaledWidth = render2.getScaledWidth();

    var localPlayerName = player.getName();
    var playerList = [];

    if (colorCodeOnly || extra) {
        // New rendering based on checks
        renderNames(playerList, localPlayerName, x, y, mcFont, colorCodeOnly, true, removeNPC, extra, renderLimit, blacklist);
    } else {
        // Old rendering when all checks are disabled
        var livingEntities = world.getEntities();

        for (var i = 0; i < livingEntities.length; i++) {
            var entity = livingEntities[i];
            var displayName = entity.getDisplayName();
            if (entity.isPlayer() && displayName !== localPlayerName && blacklist.indexOf(displayName) === -1) {
                playerList.push(displayName);
            }
        }

        if (removeNPC) {
            playerList = playerList.filter(function (name) {
                return typeof name === 'string' && name.indexOf("[NPC]") === -1;
            });
        }

        for (var i = 0; i < Math.min(renderLimit, playerList.length); i++) {
            mcFont.drawWithShadow(playerList[i], x, y + 10 * (i + 1), [255, 255, 255]);
        }
    }

    if (mode == "Bedwars") {
        module.setSetting("Color Code Only", true);
        module.setSetting("Have Space", false);
        module.setSetting("Remove NPC", false);
        module.setSetting("Extra", false);
    }

    module.setSettingVisibility("Remove NPC", dev);
    module.setSettingVisibility("Extra", dev);
    module.setSettingVisibility("Render", dev);
    module.setSettingVisibility("Black List", dev);
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
