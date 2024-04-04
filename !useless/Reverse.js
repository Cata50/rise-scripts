// MODULE
var module = rise.registerModule("Reverse", "Hypixel Damageboost");
module.registerSetting("mode", "ScriptMode", "Velo", "Velo");
module.setSettingVisibility("ScriptMode", false);
module.registerSetting("boolean", "Hold Jump", false);

// FUNCTION ONTICK
module.handle("onTick", function () {
    var holdJump = module.getSetting("Hold Jump");
    var jumping = input.isKeyBindJumpDown();
    var hurt = player.getHurtTime();
    var motion = player.getMotion();
    var speed = rise.getModule("Speed");
    var velo = rise.getModule("Velocity");
    var scaffold = rise.getModule("Scaffold");

    if (speed.isEnabled() && (holdJump ? jumping : !player.isDead())) {
        velo.setEnabled(false);
        if (hurt === 9) {
            player.setMotionX(-motion.x);
            player.setMotionZ(-motion.z);
        }
    } else {
        velo.setEnabled(true);
    }
});

// UNLOAD
script.handle("onUnload", function () { module.unregister(); });
