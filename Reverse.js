// MODULE
var module = rise.registerModule("Reverse", "Hypixel Damageboost");
module.registerSetting("mode", "ScriptMode", "Velo", "Velo");
module.setSettingVisibility("ScriptMode", false);

// FUNCTION ONTICK
module.handle("onTick", function () {
    var hurt = player.getHurtTime();
    var motion = player.getMotion();
    var speed = rise.getModule("Speed");
    var velo = rise.getModule("Velocity");
	var scaffold = rise.getModule("Scaffold");

    if (speed.isEnabled() || scaffold.isEnabled()) {
        velo.setEnabled(false);
        if (hurt === 9) {
            player.setMotionX(motion.x * -1);
            player.setMotionZ(motion.z * -1);
        }
    } else {
        velo.setEnabled(true);
    }
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});
