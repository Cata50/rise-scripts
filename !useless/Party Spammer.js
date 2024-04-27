var module = rise.registerModule("Party Spammer", "fuck jesus - Kash");
module.registerSetting("boolean", "Start", false);
module.registerSetting("boolean", "Stop", false);
module.registerSetting("string", "Username", "Hqkimi");
module.registerSetting("number", "Tick rate", 6, 1, 20);

module.setSettingVisibility("Stop", false);

var spammer = false;
var cd = 0;
var disband = false;

module.handle("onTick", function () {
    var start = module.getSetting("Start");
    var stop = module.getSetting("Stop");
    var username = module.getSetting("Username");
    var tickRate = module.getSetting("Tick rate");

    if (start) {
        module.setSetting("Start", false);
        module.setSettingVisibility("Start", false);
        module.setSettingVisibility("Stop", true);
        module.setSettingVisibility("Username", false);
        module.setSettingVisibility("Tick rate", false);
        spammer = true;
    }

    if (stop && !disband) {
        module.setSetting("Stop", false);
        module.setSettingVisibility("Stop", false);
        module.setSettingVisibility("Start", true);
        module.setSettingVisibility("Username", true);
        module.setSettingVisibility("Tick rate", true);
        spammer = false;
        cd = 0;
    }

    if (spammer) {
        if (cd == 0) {
            player.message("/p " + username);
            disband = true;
            cd = tickRate * 2;
        } else {
            cd--;
        }
        if (cd == tickRate && disband) {
            player.message("/p disband");
            disband = false;
        }
    }

});

script.handle("onUnload", function () { module.unregister(); });