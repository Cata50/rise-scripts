// MODULE
var module = rise.registerModule("TargetHUD", "A customizable TargetHUD - by Cata50");
module.registerSetting("number", "X", 100, 1, 1000);
module.registerSetting("number", "Y", 150, 1, 1000);
module.registerSetting("number", "Size", 2, 1, 10);
module.registerSetting("number", "Background", 200, -2, 255); // Background
module.registerSetting("color", "Background RGB", [30, 30, 30]);
module.registerSetting("number", "Healthbar", 100, -2, 255); // Healthbar set back to -1
module.registerSetting("color", "Healthbar RGB", [0, 255, 0]);
module.registerSetting("number", "Healthbar Background", 255, -2, 255); // Healthbar Background
module.registerSetting("color", "Healthbar Background RGB", [255, 255, 255]);
module.registerSetting("number", "Healthbar Shader", 0, -1, 255); // Healthbar Shader
module.registerSetting("color", "Healthbar Shader RGB", [255, 255, 255]);
module.registerSetting("number", "Damage", 0, -2, 255); // Damage
module.registerSetting("color", "Damage RGB", [255, 0, 0]);
module.registerSetting("number", "Healthbar Easing", 0.3, 0, 1, 0.001);
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
    var x = module.getSetting("X");
    var y = module.getSetting("Y");
    var size = module.getSetting("Size");
    var background = module.getSetting("Background");
    var backgroundRGB = module.getSetting("Background RGB");
    var healthbar = module.getSetting("Healthbar");
    var healthbarRGB = module.getSetting("Healthbar RGB");
    var healthbarBackground = module.getSetting("Healthbar Background");
    var healthbarBackgroundRGB = module.getSetting("Healthbar Background RGB");
    var healthbarShader = module.getSetting("Healthbar Shader");
    var healthbarShaderRGB = module.getSetting("Healthbar Shader RGB");
    var damage = module.getSetting("Damage");
    var damageRGB = module.getSetting("Damage RGB");
    var easing = module.getSetting("Healthbar Easing");
    var distance = module.getSetting("Distance");

    function setSettingVisibility(settingName, value) {
        module.setSettingVisibility(settingName, value);
    }

    setSettingVisibility("Background RGB", background > 0);
    setSettingVisibility("Healthbar RGB", healthbar > 0);
    setSettingVisibility("Healthbar Background RGB", healthbarBackground > 0);
    setSettingVisibility("Healthbar Shader RGB", healthbarShader > 0);
    setSettingVisibility("Damage RGB", damage > 0);

});

// FUNCTION onAttack
module.handle("onAttack", function (attack) {
    var target = attack.getTarget();

    //FUNCTION onRender2D
    module.handle("onRender2D", function (render2) {
        var x = module.getSetting("X");
        var y = module.getSetting("Y");
        var size = module.getSetting("Size");
        var background = module.getSetting("Background");
        var backgroundRGB = module.getSetting("Background RGB");
        var healthbar = module.getSetting("Healthbar");
        var healthbarRGB = module.getSetting("Healthbar RGB");
        var healthbarBackground = module.getSetting("Healthbar Background");
        var healthbarBackgroundRGB = module.getSetting("Healthbar Background RGB");
        var healthbarShader = module.getSetting("Healthbar Shader");
        var healthbarShaderRGB = module.getSetting("Healthbar Shader RGB");
        var damage = module.getSetting("Damage");
        var damageRGB = module.getSetting("Damage RGB");
        var easing = module.getSetting("Healthbar Easing");
        var distance = module.getSetting("Distance");


        // SETTING RGBs

        // background RGB
        var backgroundRed = backgroundRGB[0] || 255;
        var backgroundGreen = backgroundRGB[1] || 0;
        var backgroundBlue = backgroundRGB[2] || 0;
        backgroundColor = [backgroundRed, backgroundGreen, backgroundBlue, background];

        // healthbar RGB
        var healthbarRed = healthbarRGB[0] || 255;
        var healthbarGreen = healthbarRGB[1] || 0;
        var healthbarBlue = healthbarRGB[2] || 0;
        healthbarColor = [healthbarRed, healthbarGreen, healthbarBlue, healthbar];

        // healthbar background RGB
        var healthbarBackgroundRed = healthbarBackgroundRGB[0] || 255;
        var healthbarBackgroundGreen = healthbarBackgroundRGB[1] || 0;
        var healthbarBackgroundBlue = healthbarBackgroundRGB[2] || 0;
        healthbarBackgroundColor = [healthbarBackgroundRed, healthbarBackgroundGreen, healthbarBackgroundBlue, healthbarBackground];

        // healthbar shader RGB
        var healthbarShaderRed = healthbarShaderRGB[0] || 255;
        var healthbarShaderGreen = healthbarShaderRGB[1] || 0;
        var healthbarShaderBlue = healthbarShaderRGB[2] || 0;
        healthbarShaderColor = [healthbarShaderRed, healthbarShaderGreen, healthbarShaderBlue, healthbarShader];

        // damage RGB
        var damageRed = damageRGB[0] || 255;
        var damageGreen = damageRGB[1] || 0;
        var damageBlue = damageRGB[2] || 0;
        damageColor = [damageRed, damageGreen, healthbarBlue, damage];

        if (player.getDistanceToEntity(target) >= distance || target.isDead()) return; // unrenders targethud when exceeding distance

        var health = target.getHealth().toFixed(1);
        var maxHealth = target.getMaxHealth();
        var targetName = target.getDisplayName();
        var distance = player.getDistanceToEntity(target).toFixed(0);

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


        if (damage === -2) {
            if (target.getHurtTime() > 0) render.rainbowRectangle(x - 0.5, y - 0.5, font.width(targetName) + 52, 23.5);
        } else if (damage === -1) {
            if (target.getHurtTime() > 0) render.rectangle(x - 0.5, y - 0.5, font.width(targetName) + 52, 23.5, themeColor);
        } else if (damage > 0) {
            if (target.getHurtTime() > 0) render.rectangle(x - 0.5, y - 0.5, font.width(targetName) + 52, 23.5, damageColor);
        }


        if (background === -2) {  // targethud background
            render.rainbowRectangle(x - 0.5, y - 0.5, font.width(target.getDisplayName()) + 52.5, 23.5);
        } else if (background === -1) {
            render.rectangle(x - 0.5, y - 0.5, font.width(target.getDisplayName()) + 52.5, 23.5, themeColor);
        } else if (background > 0) {
            render.rectangle(x - 0.5, y - 0.5, font.width(target.getDisplayName()) + 52.5, 23.5, backgroundColor);
        }
        font.drawWithShadow(target.getDisplayName(), x + 1 + 24, y + 5, [255, 255, 255, 255]); // Target nametag renderer
        render.rectangle(x + 1 + 24, y + 16, healthbarWidth, 5, healthbarColor);
        // Healthbar Background renderer
        if (healthbarBackground === -2) {
            render.rainbowRectangle(x + 1 + 24, y + 16, 26 + font.width(target.getDisplayName()), 5);
        } else if (healthbarBackground === -1) {
            render.rectangle(x + 1 + 24, y + 16, 26 + font.width(target.getDisplayName()), 5, themeColor);
        } else if (healthbarBackground > 0) {
            render.rectangle(x + 1 + 24, y + 16, 26 + font.width(target.getDisplayName()), 5, healthbarBackgroundColor);
        }
           

        var width = 26 + font.width(target.getDisplayName());

        //niggerous piece of code fucking making my brain go chicken rooster
        //everytime i set health bar to -1 or -2 chat error kms

        // TargetHUD Healthbar renderer
        if (healthbar === -2) {
            render.rainbowRectangle(x + 1 + 24, y + 16, healthbarWidth, 5);
        } else if (healthbar === -1) {
            render.rectangle(x + 1 + 24, y + 16, healthbarWidth, 5, themeColor);
        } else if (healthbar > 0) {
            render.rectangle(x + 1 + 24, y + 16, healthbarWidth, 5, healthbarColor);
        }

        //fix pwease :up:

        // Healthbar Shader renderer
        if (healthbarShader) {
            render.bloom(function () {
                render.rectangle(x + 1 + 24, y + 16, healthbarWidth, 5, healthbarShaderColor);
            });
        }
        
        // Steve Face

        render.rectangle(x + 1 + 1, y + 1, 2.5, 2.5, [47, 32, 13, 255]); render.rectangle(x + 1 + 3.5, y + 1, 2.5, 2.5, [47, 30, 13, 255]); render.rectangle(x + 1 + 6, y + 1, 2.5, 2.5, [47, 31, 15, 255]); render.rectangle(x + 1 + 8.5, y + 1, 2.5, 2.5, [40, 28, 11, 255]); render.rectangle(x + 1 + 11, y + 1, 2.5, 2.5, [36, 24, 8, 255]); render.rectangle(x + 1 + 13.5, y + 1, 2.5, 2.5, [38, 26, 10, 255]); render.rectangle(x + 1 + 16, y + 1, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 1 + 18.5, y + 1, 2.5, 2.5, [42, 29, 13, 255]); render.rectangle(x + 1 + 1, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 1 + 3.5, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 1 + 6, y + 3.5, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 1 + 8.5, y + 3.5, 2.5, 2.5, [51, 36, 17, 255]); render.rectangle(x + 1 + 11, y + 3.5, 2.5, 2.5, [66, 42, 18, 255]); render.rectangle(x + 1 + 13.5, y + 3.5, 2.5, 2.5, [63, 42, 21, 255]); render.rectangle(x + 1 + 16, y + 3.5, 2.5, 2.5, [44, 30, 14, 255]); render.rectangle(x + 1 + 18.5, y + 3.5, 2.5, 2.5, [43, 30, 14, 255]); render.rectangle(x + 1 + 1, y + 6, 2.5, 2.5, [43, 30, 13, 255]); render.rectangle(x + 1 + 3.5, y + 6, 2.5, 2.5, [182, 137, 108, 255]); render.rectangle(x + 1 + 6, y + 6, 2.5, 2.5, [189, 142, 114, 255]); render.rectangle(x + 1 + 8.5, y + 6, 2.5, 2.5, [198, 150, 128, 255]); render.rectangle(x + 1 + 11, y + 6, 2.5, 2.5, [189, 139, 114, 255]); render.rectangle(x + 1 + 13.5, y + 6, 2.5, 2.5, [189, 142, 116, 255]); render.rectangle(x + 1 + 16, y + 6, 2.5, 2.5, [172, 118, 90, 255]); render.rectangle(x + 1 + 18.5, y + 6, 2.5, 2.5, [43, 30, 14, 255]); render.rectangle(x + 1 + 1, y + 8.5, 2.5, 2.5, [170, 125, 102, 255]); render.rectangle(x + 1 + 3.5, y + 8.5, 2.5, 2.5, [180, 132, 109, 255]); render.rectangle(x + 1 + 6, y + 8.5, 2.5, 2.5, [170, 125, 102, 255]); render.rectangle(x + 1 + 8.5, y + 8.5, 2.5, 2.5, [173, 128, 109, 255]); render.rectangle(x + 1 + 11, y + 8.5, 2.5, 2.5, [156, 114, 92, 255]); render.rectangle(x + 1 + 13.5, y + 8.5, 2.5, 2.5, [187, 137, 114, 255]); render.rectangle(x + 1 + 16, y + 8.5, 2.5, 2.5, [156, 105, 76, 255]); render.rectangle(x + 1 + 18.5, y + 8.5, 2.5, 2.5, [156, 105, 76, 255]); render.rectangle(x + 1 + 1, y + 11, 2.5, 2.5, [180, 132, 109, 255]); render.rectangle(x + 1 + 3.5, y + 11, 2.5, 2.5, [255, 255, 255, 255]); render.rectangle(x + 1 + 6, y + 11, 2.5, 2.5, [82, 61, 137, 255]); render.rectangle(x + 1 + 8.5, y + 11, 2.5, 2.5, [181, 123, 103, 255]); render.rectangle(x + 1 + 11, y + 11, 2.5, 2.5, [187, 137, 114, 255]); render.rectangle(x + 1 + 13.5, y + 11, 2.5, 2.5, [82, 61, 137, 255]); render.rectangle(x + 1 + 16, y + 11, 2.5, 2.5, [255, 255, 255, 255]); render.rectangle(x + 1 + 18.5, y + 11, 2.5, 2.5, [170, 125, 102, 255]); render.rectangle(x + 1 + 1, y + 13.5, 2.5, 2.5, [156, 99, 70, 255]); render.rectangle(x + 1 + 3.5, y + 13.5, 2.5, 2.5, [179, 123, 93, 255]); render.rectangle(x + 1 + 6, y + 13.5, 2.5, 2.5, [183, 130, 114, 255]); render.rectangle(x + 1 + 8.5, y + 13.5, 2.5, 2.5, [106, 64, 48, 255]); render.rectangle(x + 1 + 11, y + 13.5, 2.5, 2.5, [106, 64, 48, 255]); render.rectangle(x + 1 + 13.5, y + 13.5, 2.5, 2.5, [190, 136, 108, 255]); render.rectangle(x + 1 + 16, y + 13.5, 2.5, 2.5, [162, 106, 71, 255]); render.rectangle(x + 1 + 18.5, y + 13.5, 2.5, 2.5, [128, 83, 52, 255]); render.rectangle(x + 1 + 1, y + 16, 2.5, 2.5, [144, 94, 67, 255]); render.rectangle(x + 1 + 3.5, y + 16, 2.5, 2.5, [150, 95, 64, 255]); render.rectangle(x + 1 + 6, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 1 + 8.5, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 1 + 11, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 1 + 13.5, y + 16, 2.5, 2.5, [119, 66, 53, 255]); render.rectangle(x + 1 + 16, y + 16, 2.5, 2.5, [143, 94, 62, 255]); render.rectangle(x + 1 + 18.5, y + 16, 2.5, 2.5, [129, 83, 57, 255]); render.rectangle(x + 1 + 1, y + 18.5, 2.5, 2.5, [111, 69, 44, 255]); render.rectangle(x + 1 + 3.5, y + 18.5, 2.5, 2.5, [109, 67, 42, 255]); render.rectangle(x + 1 + 6, y + 18.5, 2.5, 2.5, [129, 83, 57, 255]); render.rectangle(x + 1 + 8.5, y + 18.5, 2.5, 2.5, [129, 83, 57, 255]); render.rectangle(x + 1 + 11, y + 18.5, 2.5, 2.5, [122, 78, 51, 255]); render.rectangle(x + 1 + 13.5, y + 18.5, 2.5, 2.5, [131, 85, 59, 255]); render.rectangle(x + 1 + 16, y + 18.5, 2.5, 2.5, [131, 85, 59, 255]); render.rectangle(x + 1 + 18.5, y + 18.5, 2.5, 2.5, [122, 78, 51, 255]);
        /*
        // layer 1
        render.rectangle(x - 2 + size * 2, y + size, size, size, [47, 32, 13, 255]);
        render.rectangle(x - 2 + size * 3, y + size, size, size, [47, 30, 13, 255]);
        render.rectangle(x - 2 + size * 4, y + size, size, size, [47, 31, 15, 255]);
        render.rectangle(x - 2 + size * 5, y + size, size, size, [40, 28, 11, 255]);
        render.rectangle(x - 2 + size * 6, y + size, size, size, [36, 24, 8, 255]);
        render.rectangle(x - 2 + size * 7, y + size, size, size, [38, 26, 10, 255]);
        render.rectangle(x - 2 + size * 8, y + size, size, size, [43, 30, 13, 255]);
        render.rectangle(x - 2 + size * 9, y + size, size, size, [42, 29, 13, 255]);

        // layer 2
        render.rectangle(x - 2 + size * 2, y + size * 2, size, size, [47, 32, 13, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 2, size, size, [47, 30, 13, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 2, size, size, [47, 31, 15, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 2, size, size, [40, 28, 11, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 2, size, size, [36, 24, 8, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 2, size, size, [38, 26, 10, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 2, size, size, [43, 30, 13, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 2, size, size, [42, 29, 13, 255]);

        // layer 3
        render.rectangle(x - 2 + size * 2, y + size * 3, size, size, [43, 30, 13, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 3, size, size, [182, 137, 108, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 3, size, size, [189, 142, 114, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 3, size, size, [198, 150, 128, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 3, size, size, [189, 139, 114, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 3, size, size, [189, 142, 116, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 3, size, size, [172, 118, 90, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 3, size, size, [43, 30, 14, 255]);

        // layer 4
        render.rectangle(x - 2 + size * 2, y + size * 4, size, size, [170, 125, 102, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 4, size, size, [180, 132, 109, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 4, size, size, [170, 125, 102, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 4, size, size, [173, 128, 109, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 4, size, size, [156, 114, 92, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 4, size, size, [187, 137, 114, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 4, size, size, [156, 105, 76, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 4, size, size, [156, 105, 76, 255]);

        // layer 5
        render.rectangle(x - 2 + size * 2, y + size * 5, size, size, [180, 132, 109, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 5, size, size, [255, 255, 255, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 5, size, size, [82, 61, 137, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 5, size, size, [181, 123, 103, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 5, size, size, [187, 137, 114, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 5, size, size, [82, 61, 137, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 5, size, size, [255, 255, 255, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 5, size, size, [170, 125, 102, 255]);

        // layer 6
        render.rectangle(x - 2 + size * 2, y + size * 6, size, size, [156, 99, 70, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 6, size, size, [179, 123, 93, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 6, size, size, [183, 130, 114, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 6, size, size, [106, 64, 48, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 6, size, size, [106, 64, 48, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 6, size, size, [190, 136, 108, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 6, size, size, [162, 106, 71, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 6, size, size, [128, 83, 52, 255]);

        // layer 7
        render.rectangle(x - 2 + size * 2, y + size * 7, size, size, [144, 94, 67, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 7, size, size, [150, 95, 64, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 7, size, size, [119, 66, 53, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 7, size, size, [119, 66, 53, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 7, size, size, [119, 66, 53, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 7, size, size, [119, 66, 53, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 7, size, size, [143, 94, 62, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 7, size, size, [129, 83, 57, 255]);

        // layer 8
        render.rectangle(x - 2 + size * 2, y + size * 8, size, size, [111, 69, 44, 255]);
        render.rectangle(x - 2 + size * 3, y + size * 8, size, size, [109, 67, 42, 255]);
        render.rectangle(x - 2 + size * 4, y + size * 8, size, size, [129, 83, 57, 255]);
        render.rectangle(x - 2 + size * 5, y + size * 8, size, size, [129, 83, 57, 255]);
        render.rectangle(x - 2 + size * 6, y + size * 8, size, size, [122, 78, 51, 255]);
        render.rectangle(x - 2 + size * 7, y + size * 8, size, size, [131, 85, 59, 255]);
        render.rectangle(x - 2 + size * 8, y + size * 8, size, size, [131, 85, 59, 255]);
        render.rectangle(x - 2 + size * 9, y + size * 8, size, size, [122, 78, 51, 255]);
        */
    });
});

script.handle("onUnload", function () {
    module.unregister();
});