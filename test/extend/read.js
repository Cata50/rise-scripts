// MODULE
var module = rise.registerModule("TargetHUD", "A customizable TargetHUD - by Cata50");
module.registerSetting("number", "X", 100, 1, 1000);
module.registerSetting("number", "Y", 150, 1, 1000);
module.registerSetting("number", "Background", 200, -1, 255);
module.registerSetting("number", "Healthbar", -1, -1, 255);
module.registerSetting("color", "Healthbar RGB", [0, 255, 0]);
module.registerSetting("number", "Healthbar Background", 255, 0, 255);
module.registerSetting("boolean", "Healthbar Shader", false);
module.registerSetting("number", "Damage", 100, 0, 255);
module.registerSetting("boolean", "Rainbow", false);
module.registerSetting("boolean", "Reset", false);

module.setSettingVisibility("Healthbar RGB", false);

var healthbarWidth = 26;
var darkHealthbarWidth = 26;
var previousTarget = null;
var targetWidth = healthbarWidth;

module.handle("onTick", function () {
    if (module.getSetting("Healthbar") > -1) {
        module.setSettingVisibility("Healthbar RGB", true);
    } else {
        module.setSettingVisibility("Healthbar RGB", false);
    }
});

module.handle("onAttack", function (attackEvent) {
    var animationSpeed = module.getSetting("animation speed"); // Assuming "animation speed" setting exists
    var font = render.getMinecraftFontRenderer();
    var hpShader = module.getSetting("Healthbar Shader");
    var target = attackEvent.getTarget();
    var x = module.getSetting("X");
    var y = module.getSetting("Y");

    module.handle("onRender2D", function (e) {
        if (player.getDistanceToEntity(target) >= 5 || target.isDead()) return;

        var health = target.getHealth().toFixed(1);
        var maxHealth = target.getMaxHealth();
        var targetName = target.getDisplayName();
        var distance = player.getDistanceToEntity(target).toFixed(0);

        if (target.getHurtTime() > 0) render.rectangle(x - 0.5, y - 0.5, font.width(targetName) + 52.5, 23.5, [255, 0, 0, module.getSetting("Damage")]);

        var healthPer = (health / maxHealth) * 100;
        var newTargetWidth = Math.floor((26 + font.width(target.getDisplayName())) * (health / maxHealth));

        if (newTargetWidth !== targetWidth) {
            targetWidth = newTargetWidth;
            if (healthPer <= 0) {
                healthbarWidth = targetWidth; // Reset to original width if health is 0%
            }
        }

        var particalTicks = 1 - e.getPartialTicks();
        var easingFactor = 0.3; // Adjust this value to change the speed of the easing

        // Easing function for main health bar
        healthbarWidth += (targetWidth - healthbarWidth) * easingFactor * particalTicks;

        var themeColor = render.getThemeColor();
        var darkThemeColor = [themeColor[0] * 0.4, themeColor[1] * 0.4, themeColor[2] * 0.4, themeColor[3]]; // Making the theme color slightly darker

        render.rectangle(x - 0.5, y - 0.5, font.width(target.getDisplayName()) + 52.5, 23.5, [30, 30, 30, module.getSetting("Background")]); // targethud background
        font.drawWithShadow(target.getDisplayName(), x + 24, y + 5, [255, 255, 255, 255]); // player nametag renderer

        render.rectangle(x + 24, y + 16, 26 + font.width(target.getDisplayName()), 5, [21, 21, 21, module.getSetting("Healthbar Background")]); // underhealth black
        render.rectangle(x + 24, y + 16, healthbarWidth, 5, module.getSetting("Healthbar") === -1 ? themeColor : module.getSetting("Healthbar RGB")); // Healthbar render           // HOW TO ALSO SET ALPHA [255, 255, 255, module.getSetting("Healthbar")] - e.g. make it like module.getSetting("Healthbar RGB").Healthbar (the number used for alpha)

        var width = 26 + font.width(target.getDisplayName());

        if (hpShader) {
            render.bloom(function () {
                render.rectangle(x + 24, y + 16, healthbarWidth, 5, themeColor);
            });
        }

        // layer 1
        render.rectangle(x + 1, y + 1, 2.5, 2.5, [47, 32, 13, 255]);
        render.rectangle(x + 3.5, y + 1, 2.5, 2.5, [47, 30, 13, 255]);
        render.rectangle(x + 6, y + 1, 2.5, 2.5, [47, 31, 15, 255]);
        render.rectangle(x + 8.5, y + 1, 2.5, 2.5, [40, 28, 11, 255]);
        render.rectangle(x + 11, y + 1, 2.5, 2.5, [36, 24, 8, 255]);
        render.rectangle(x + 13.5, y + 1, 2.5, 2.5, [38, 26, 10, 255]);
        render.rectangle(x + 16, y + 1, 2.5, 2.5, [43, 30, 13, 255]);
        render.rectangle(x + 18.5, y + 1, 2.5, 2.5, [42, 29, 13, 255]);

        // layer 2
        render.rectangle(x + 1, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]);
        render.rectangle(x + 3.5, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]);
        render.rectangle(x + 6, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]);
        render.rectangle(x + 8.5, y + 3.5, 2.5, 2.5, [51, 36, 17, 255]);
        render.rectangle(x + 11, y + 3.5, 2.5, 2.5, [66, 42, 18, 255]);
        render.rectangle(x + 13.5, y + 3.5, 2.5, 2.5, [63, 42, 21, 255]);
        render.rectangle(x + 16, y + 3.5, 2.5, 2.5, [44, 30, 14, 255]);
        render.rectangle(x + 18.5, y + 3.5, 2.5, 2.5, [43, 30, 14, 255]);

        // layer 3
        render.rectangle(x + 1, y + 6, 2.5, 2.5, [43, 30, 13, 255]);
        render.rectangle(x + 3.5, y + 6, 2.5, 2.5, [182, 137, 108, 255]);
        render.rectangle(x + 6, y + 6, 2.5, 2.5, [189, 142, 114, 255]);
        render.rectangle(x + 8.5, y + 6, 2.5, 2.5, [198, 150, 128, 255]);
        render.rectangle(x + 11, y + 6, 2.5, 2.5, [189, 139, 114, 255]);
        render.rectangle(x + 13.5, y + 6, 2.5, 2.5, [189, 142, 116, 255]);
        render.rectangle(x + 16, y + 6, 2.5, 2.5, [172, 118, 90, 255]);
        render.rectangle(x + 18.5, y + 6, 2.5, 2.5, [43, 30, 14, 255]);

        // layer 4
        render.rectangle(x + 1, y + 8.5, 2.5, 2.5, [170, 125, 102, 255]);
        render.rectangle(x + 3.5, y + 8.5, 2.5, 2.5, [180, 132, 109, 255]);
        render.rectangle(x + 6, y + 8.5, 2.5, 2.5, [170, 125, 102, 255]);
        render.rectangle(x + 8.5, y + 8.5, 2.5, 2.5, [173, 128, 109, 255]);
        render.rectangle(x + 11, y + 8.5, 2.5, 2.5, [156, 114, 92, 255]);
        render.rectangle(x + 13.5, y + 8.5, 2.5, 2.5, [187, 137, 114, 255]);
        render.rectangle(x + 16, y + 8.5, 2.5, 2.5, [156, 105, 76, 255]);
        render.rectangle(x + 18.5, y + 8.5, 2.5, 2.5, [156, 105, 76, 255]);

        // layer 5
        render.rectangle(x + 1, y + 11, 2.5, 2.5, [180, 132, 109, 255]);
        render.rectangle(x + 3.5, y + 11, 2.5, 2.5, [255, 255, 255, 255]);
        render.rectangle(x + 6, y + 11, 2.5, 2.5, [82, 61, 137, 255]);
        render.rectangle(x + 8.5, y + 11, 2.5, 2.5, [181, 123, 103, 255]);
        render.rectangle(x + 11, y + 11, 2.5, 2.5, [187, 137, 114, 255]);
        render.rectangle(x + 13.5, y + 11, 2.5, 2.5, [82, 61, 137, 255]);
        render.rectangle(x + 16, y + 11, 2.5, 2.5, [255, 255, 255, 255]);
        render.rectangle(x + 18.5, y + 11, 2.5, 2.5, [170, 125, 102, 255]);

        // layer 6
        render.rectangle(x + 1, y + 13.5, 2.5, 2.5, [156, 99, 70, 255]);
        render.rectangle(x + 3.5, y + 13.5, 2.5, 2.5, [179, 123, 93, 255]);
        render.rectangle(x + 6, y + 13.5, 2.5, 2.5, [183, 130, 114, 255]);
        render.rectangle(x + 8.5, y + 13.5, 2.5, 2.5, [106, 64, 48, 255]);
        render.rectangle(x + 11, y + 13.5, 2.5, 2.5, [106, 64, 48, 255]);
        render.rectangle(x + 13.5, y + 13.5, 2.5, 2.5, [190, 136, 108, 255]);
        render.rectangle(x + 16, y + 13.5, 2.5, 2.5, [162, 106, 71, 255]);
        render.rectangle(x + 18.5, y + 13.5, 2.5, 2.5, [128, 83, 52, 255]);

        // layer 7
        render.rectangle(x + 1, y + 16, 2.5, 2.5, [144, 94, 67, 255]);
        render.rectangle(x + 3.5, y + 16, 2.5, 2.5, [150, 95, 64, 255]);
        render.rectangle(x + 6, y + 16, 2.5, 2.5, [119, 66, 53, 255]);
        render.rectangle(x + 8.5, y + 16, 2.5, 2.5, [119, 66, 53, 255]);
        render.rectangle(x + 11, y + 16, 2.5, 2.5, [119, 66, 53, 255]);
        render.rectangle(x + 13.5, y + 16, 2.5, 2.5, [119, 66, 53, 255]);
        render.rectangle(x + 16, y + 16, 2.5, 2.5, [143, 94, 62, 255]);
        render.rectangle(x + 18.5, y + 16, 2.5, 2.5, [129, 83, 57, 255]);

        // layer 8
        render.rectangle(x + 1, y + 18.5, 2.5, 2.5, [111, 69, 44, 255]);
        render.rectangle(x + 3.5, y + 18.5, 2.5, 2.5, [109, 67, 42, 255]);
        render.rectangle(x + 6, y + 18.5, 2.5, 2.5, [129, 83, 57, 255]);
        render.rectangle(x + 8.5, y + 18.5, 2.5, 2.5, [129, 83, 57, 255]);
        render.rectangle(x + 11, y + 18.5, 2.5, 2.5, [122, 78, 51, 255]);
        render.rectangle(x + 13.5, y + 18.5, 2.5, 2.5, [131, 85, 59, 255]);
        render.rectangle(x + 16, y + 18.5, 2.5, 2.5, [131, 85, 59, 255]);
        render.rectangle(x + 18.5, y + 18.5, 2.5, 2.5, [122, 78, 51, 255]);

    });
});

script.handle("onUnload", function () {
    module.unregister();
});
