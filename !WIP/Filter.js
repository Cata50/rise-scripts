// MODULE
var module = rise.registerModule("Filter", "[WIP] antibot...");
module.registerSetting("mode", "Mode", "Custom", "Custom");

module.registerSetting("boolean", "List Name", true);
module.registerSetting("string", "List Text", "> Players:");
module.registerSetting("number", "X", 3, 1, 1000);
module.registerSetting("number", "Y", 25, 1, 1000);
module.registerSetting("boolean", "Color Code Only", false);
module.registerSetting("boolean", "Have Space", false);
module.registerSetting("boolean", "Exclude NPC", false);
module.registerSetting("boolean", "Extra", false);

var mcFont = render.getMinecraftFontRenderer();

function renderNames(playerList, localPlayerName, listName, listText, x, y, mcFont, colorCodeOnly, haveSpace, excludeNPC, extra) {
    var livingEntities = world.getEntities();

    for (var i = 0; i < livingEntities.length; i++) {
        var entity = livingEntities[i];
        var displayName = entity.getDisplayName();

        var hasColorCode = displayName.indexOf("§") !== -1;
        var hasSpace = displayName.indexOf(" ") !== -1;

        if ((!colorCodeOnly || (colorCodeOnly && hasColorCode)) && (!haveSpace || (haveSpace && hasSpace)) && (extra || (!extra && entity.isPlayer() && displayName !== localPlayerName))) {
            playerList.push(displayName);
        }
    }

    if (excludeNPC) {
        playerList = playerList.filter(function (name) {
            return typeof name === 'string' && name.indexOf("[NPC]") === -1;
        });
    }

    if (listName) {
        mcFont.drawWithShadow(listText, x, y, [255, 255, 255]);
    } else {
			y = y - 10;
		}

    for (var i = 0; i < Math.min(32, playerList.length); i++) {
        mcFont.drawWithShadow(playerList[i], x, y + 10 * (i + 1), [255, 255, 255]);
    }
}

// FUNCTION ONRENDER2D
module.handle("onRender2D", function (render2) {
    var listName = module.getSetting("List Name");
    var listText = module.getSetting("List Text");
    var x = module.getSetting("X");
    var y = module.getSetting("Y");
    var colorCodeOnly = module.getSetting("Color Code Only");
    var haveSpace = module.getSetting("Have Space");
    var excludeNPC = module.getSetting("Exclude NPC");
    var extra = module.getSetting("Extra");

    var scaledHeight = render2.getScaledHeight();
    var scaledWidth = render2.getScaledWidth();

    var localPlayerName = player.getName();
    var playerList = [];

    if (colorCodeOnly || haveSpace || extra) {
        // New rendering based on checks
        renderNames(playerList, localPlayerName, listName, listText, x, y, mcFont, colorCodeOnly, haveSpace, excludeNPC, extra);
    } else {
        // Old rendering when all checks are disabled
        var livingEntities = world.getEntities();

        for (var i = 0; i < livingEntities.length; i++) {
            var entity = livingEntities[i];
            var displayName = entity.getDisplayName();
            if (entity.isPlayer() && displayName !== localPlayerName) {
                playerList.push(displayName);
            }
        }

        if (excludeNPC) {
            playerList = playerList.filter(function (name) {
                return typeof name === 'string' && name.indexOf("[NPC]") === -1;
            });
        }

        if (listName) {
            mcFont.drawWithShadow(listText, x, y, [255, 255, 255]);
        } else {
			y = y - 10;
		}

        for (var i = 0; i < Math.min(32, playerList.length); i++) {
            mcFont.drawWithShadow(playerList[i], x, y + 10 * (i + 1), [255, 255, 255]);
        }
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
