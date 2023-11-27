// MODULE
var module = rise.registerModule("TargetHUD", "A customizable TargetHUD - by Cata50");
module.registerSetting("number", "X", 100, 1, 1000);
module.registerSetting("number", "Y", 150, 1, 1000);
module.registerSetting("number", "Background", 200, -1, 255); // Background
module.registerSetting("color", "Background RGB", [0, 255, 0]);
module.registerSetting("number", "Healthbar", -1, -2, 255); // Healthbar
module.registerSetting("color", "Healthbar RGB", [0, 255, 0]);
module.registerSetting("number", "Healthbar Background", 255, -1, 255); // Healthbar Background
module.registerSetting("color", "Healthbar Background RGB", [0, 255, 0]);
module.registerSetting("number", "Healthbar Shader", 0, -1, 255); // Healthbar Shader
module.registerSetting("color", "Healthbar Shader RGB", [0, 255, 0]);
module.registerSetting("number", "Damage", 0, -1, 255); // Damage
module.registerSetting("color", "Damage RGB", [0, 255, 0]);
module.registerSetting("number", "Easing", 0.3, 0, 1, 0.001);
module.registerSetting("number", "Distance", 5, 1, 10);
module.registerSetting("boolean", "Reset", false); // Reset


module.setSettingVisibility("Healthbar RGB", false);
module.setSettingVisibility("Healthbar Shader RGB", false);
module.setSettingVisibility("Damage RGB", false);

var healthbarWidth = 26;
var darkHealthbarWidth = 26;
var previousTarget = null;
var targetWidth = healthbarWidth;

var font = render.getMinecraftFontRenderer();

// FUNCTION onTick
module.handle("onTick", function () {
    module.setSettingVisibility("Background RGB", module.getSetting("Background") > 0 ? true : false);
    module.setSettingVisibility("Healthbar RGB", module.getSetting("Healthbar") > 0 ? true : false);
    module.setSettingVisibility("Healthbar Background RGB", module.getSetting("Healthbar Background") > 0 ? true : false);
    module.setSettingVisibility("Healthbar Shader RGB", module.getSetting("Healthbar Shader") > 0 ? true : false);
    module.setSettingVisibility("Damage RGB", module.getSetting("Damage") > 0 ? true : false);

    if (module.getSetting("Reset")) {
        module.setSetting("Distance", 5);
        module.setSetting("Reset", false);
    }
});

// FUNCTION onAttack
module.handle("onAttack", function (attack) {
    var target = attack.getTarget();

    //FUNCTION onRender2D
    module.handle("onRender2D", function (render2) {
        var x = module.getSetting("X");
        var y = module.getSetting("Y");
        var background = module.getSetting("Background");
        var backgroundRGB = module.getSetting("Background RGB");
        var healthbar = module.getSetting("Healthbar");
        var healthbarRGB = module.getSetting("Healthbar RGB");
        var healthbarBackground = module.getSetting("Healthbar Background");
        var healthbarBackgroundRGB = module.getSetting("Healthbar Background RGB");
        var healthbarShader = module.getSetting("Healthbar Shader");
        var healthbarShaderRGB = module.getSetting("Healthbar Shader RGB");
        var damage = module.getSetting("Damage");
        var easing = module.getSetting("Easing"); // Adjust this value to change the speed of the easing
        var distance = module.getSetting("Distance");


        // Setting RGBs

        // healthbar
        var healthbarRed = healthbarRGB[0] || 255;
        var healthbarGreen = healthbarRGB[1] || 0;
        var healthbarBlue = healthbarRGB[2] || 0;
        if (healthbar === -1) {
            healthbarColor = themeColor;
        } else {
            healthbarColor = [healthbarRed, healthbarGreen, healthbarBlue, healthbar];
        }

        // healthbar shader
        var healthbarShaderRed = healthbarShaderRGB[0] || 255;
        var healthbarShaderGreen = healthbarShaderRGB[1] || 0;
        var healthbarShaderBlue = healthbarShaderRGB[2] || 0;
        healthbarShaderColor = [healthbarShaderRed, healthbarShaderGreen, healthbarBlue, healthbarShader];
        if (healthbarShader === -1) {
            healthbarShaderColor = themeColor;
        } else {
            healthbarShaderColor = [healthbarShaderRed, healthbarShaderGreen, healthbarShaderBlue, healthbarShader];
        }

        if (player.getDistanceToEntity(target) >= distance || target.isDead()) return;

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

        var particalTicks = 1 - render2.getPartialTicks();

        // Easing function for main health bar
        healthbarWidth += (targetWidth - healthbarWidth) * easing * particalTicks;

        var themeColor = render.getThemeColor();
        var darkThemeColor = [themeColor[0] * 0.4, themeColor[1] * 0.4, themeColor[2] * 0.4, themeColor[3]]; // Making the theme color slightly darker

        render.rectangle(x - 0.5, y - 0.5, font.width(target.getDisplayName()) + 52.5, 23.5, [30, 30, 30, module.getSetting("Background")]); // targethud background
        font.drawWithShadow(target.getDisplayName(), x + 24, y + 5, [255, 255, 255, 255]); // Target nametag renderer
        render.rectangle(x + 24, y + 16, healthbarWidth, 5, healthbarColor);
        // Healthbar Background renderer
        render.rectangle(x + 24, y + 16, 26 + font.width(target.getDisplayName()), 5, [21, 21, 21, module.getSetting("Healthbar Background")]);
        

        var width = 26 + font.width(target.getDisplayName());

        // Healthbar renderer
        render.rectangle(x + 24, y + 16, healthbarWidth, 5, module.getSetting("Healthbar") === -1 ? themeColor : healthbarColor);
        // Healthbar Shader renderer
        if (healthbarShader) {
            render.bloom(function () {
                render.rectangle(x + 24, y + 16, healthbarWidth, 5, healthbarShaderColor);
            });
        }


        // Steve Face
        render.rectangle(x + 1, y + 1, 2.5, 2.5, [47, 32, 13, 255]); render.rectangle(x + 3.5, y + 1, 2.5, 2.5, [47, 30, 13, 255]); render.rectangle(x + 6, y + 1, 2.5, 2.5, [47, 31, 15, 255]); render.rectangle(x + 8.5, y + 1, 2.5, 2.5, [40, 28, 11, 255]); render.rectangle(x + 11, y + 1, 2.5, 2.5, [36, 24, 8, 255]); render.rectangle(x + 13.5, y + 1, 2.5, 2.5, [38, 26, 10, 255]); render.rectangle(x + 16, y + 1, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 18.5, y + 1, 2.5, 2.5, [42, 29, 13, 255]); render.rectangle(x + 1, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 3.5, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 6, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 8.5, y + 3.5, 2.5, 2.5, [51, 36, 17, 255]); render.rectangle(x + 11, y + 3.5, 2.5, 2.5, [66, 42, 18, 255]); render.rectangle(x + 13.5, y + 3.5, 2.5, 2.5, [63, 42, 21, 255]); render.rectangle(x + 16, y + 3.5, 2.5, 2.5, [44, 30, 14, 255]); render.rectangle(x + 18.5, y + 3.5, 2.5, 2.5, [43, 30, 14, 255]); render.rectangle(x + 1, y + 6, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 3.5, y + 6, 2.5, 2.5, [182, 137, 108, 255]); render.rectangle(x + 6, y + 6, 2.5, 2.5, [189, 142, 114, 255]); render.rectangle(x + 8.5, y + 6, 2.5, 2.5, [198, 150, 128, 255]); render.rectangle(x + 11, y + 6, 2.5, 2.5, [189, 139, 114, 255]); render.rectangle(x + 13.5, y + 6, 2.5, 2.5, [189, 142, 116, 255]); render.rectangle(x + 16, y + 6, 2.5, 2.5, [172, 118, 90, 255]); render.rectangle(x + 18.5, y + 6, 2.5, 2.5, [43, 30, 14, 255]); render.rectangle(x + 1, y + 8.5, 2.5, 2.5, [170, 125, 102, 255]); render.rectangle(x + 3.5, y + 8.5, 2.5, 2.5, [180, 132, 109, 255]); render.rectangle(x + 6, y + 8.5, 2.5, 2.5, [170, 125, 102, 255]); render.rectangle(x + 8.5, y + 8.5, 2.5, 2.5, [173, 128, 109, 255]); render.rectangle(x + 11, y + 8.5, 2.5, 2.5, [156, 114, 92, 255]); render.rectangle(x + 13.5, y + 8.5, 2.5, 2.5, [187, 137, 114, 255]); render.rectangle(x + 16, y + 8.5, 2.5, 2.5, [156, 105, 76, 255]); render.rectangle(x + 18.5, y + 8.5, 2.5, 2.5, [156, 105, 76, 255]); render.rectangle(x + 1, y + 11, 2.5, 2.5, [180, 132, 109, 255]); render.rectangle(x + 3.5, y + 11, 2.5, 2.5, [255, 255, 255, 255]); render.rectangle(x + 6, y + 11, 2.5, 2.5, [82, 61, 137, 255]); render.rectangle(x + 8.5, y + 11, 2.5, 2.5, [181, 123, 103, 255]); render.rectangle(x + 11, y + 11, 2.5, 2.5, [187, 137, 114, 255]); render.rectangle(x + 13.5, y + 11, 2.5, 2.5, [82, 61, 137, 255]); render.rectangle(x + 16, y + 11, 2.5, 2.5, [255, 255, 255, 255]); render.rectangle(x + 18.5, y + 11, 2.5, 2.5, [170, 125, 102, 255]); render.rectangle(x + 1, y + 13.5, 2.5, 2.5, [156, 99, 70, 255]); render.rectangle(x + 3.5, y + 13.5, 2.5, 2.5, [179, 123, 93, 255]); render.rectangle(x + 6, y + 13.5, 2.5, 2.5, [183, 130, 114, 255]); render.rectangle(x + 8.5, y + 13.5, 2.5, 2.5, [106, 64, 48, 255]); render.rectangle(x + 11, y + 13.5, 2.5, 2.5, [106, 64, 48, 255]); render.rectangle(x + 13.5, y + 13.5, 2.5, 2.5, [190, 136, 108, 255]); render.rectangle(x + 16, y + 13.5, 2.5, 2.5, [162, 106, 71, 255]); render.rectangle(x + 18.5, y + 13.5, 2.5, 2.5, [128, 83, 52, 255]); render.rectangle(x + 1, y + 16, 2.5, 2.5, [144, 94, 67, 255]); render.rectangle(x + 3.5, y + 16, 2.5, 2.5, [150, 95, 64, 255]); render.rectangle(x + 6, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 8.5, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 11, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 13.5, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 16, y + 16, 2.5, 2.5, [143, 94, 62, 255]); render.rectangle(x + 18.5, y + 16, 2.5, 2.5, [129, 83, 57, 255]); render.rectangle(x + 1, y + 18.5, 2.5, 2.5, [111, 69, 44, 255]); render.rectangle(x + 3.5, y + 18.5, 2.5, 2.5, [109, 67, 42, 255]); render.rectangle(x + 6, y + 18.5, 2.5, 2.5, [129, 83, 57, 255]); render.rectangle(x + 8.5, y + 18.5, 2.5, 2.5, [129, 83, 57, 255]); render.rectangle(x + 11, y + 18.5, 2.5, 2.5, [122, 78, 51, 255]); render.rectangle(x + 13.5, y + 18.5, 2.5, 2.5, [131, 85, 59, 255]); render.rectangle(x + 16, y + 18.5, 2.5, 2.5, [131, 85, 59, 255]); render.rectangle(x + 18.5, y + 18.5, 2.5, 2.5, [122, 78, 51, 255]);

    });
});

script.handle("onUnload", function () {
    module.unregister();
});