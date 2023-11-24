// MODULE
var module = rise.registerModule("Manager+", "An easier way to avoid limbos and GUI stealing - By Cata50");

module.registerSetting("boolean", "Manager", true);
module.registerSetting("boolean", "Stealer", true);
module.registerSetting("boolean", "Debug", false);
module.registerSetting("boolean", "always", false);
module.registerSetting("boolean", "rename", true);

module.setSettingVisibility("rename", false);
module.setSettingVisibility("always", false);

// FUNCTION onTick
module.handle("onTick", function () {
    var manager = module.getSetting("Manager");
    var stealer = module.getSetting("Stealer");
    var inventoryManager = rise.getModule("Manager");
    var chestStealer = rise.getModule("Stealer");
    var inventory = player.getGUI() === "inventory";
    var chest = player.getGUI() === "chest";
    var move = player.isMoving();
    var debug = module.getSetting("Debug");
	var debugRename = module.getSetting("rename");
	var debugAlways = module.getSetting("always");
	
	
    module.setSettingVisibility("inventory only", manager);
    module.setSettingVisibility("rename", debug);
    module.setSettingVisibility("always", debug);

    if (manager && inventory && !move) {
        if (debug && debugMSG) {
			if (debugRename) {
			rise.setName("Manager+");
			}
            rise.displayChat("Sortable");
			if (debugRename) {
			rise.setName("Rise");
			}
			if (!debugAlways) {
				debugMSG = false;
			}
        }
        inventoryManager.setEnabled(true);
    } else {
        inventoryManager.setEnabled(false);
        if (!inventory) {
            debugMSG = true;
        }
    }

    if (stealer && chest) {
        chestStealer.setEnabled(true);
    } else {
        chestStealer.setEnabled(false);
    }
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});

/* GUIs
if (player.getGUI() != "chest" && player.getGUI() != "clickgui" && player.getGUI() != "chat" && player.getGUI() != "inventory" && player.getGUI() != "undefined") {
    doSomething();
}
*/
