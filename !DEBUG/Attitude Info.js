// MODULE
var module = rise.registerModule("Attitude Info", "Displays yaw/pitch - By Cata50");
module.registerSetting("number", "toFixed(#)", 1, 0, 13);
module.registerSetting("boolean", "blur (fire api)", false);

var mcFont = render.getMinecraftFontRenderer();
var decimalPlaces = 1;

// FUNCTION onTick
module.handle("onTick", function (tick) {
    var blur = module.getSetting("blur (fire api)");

    decimalPlaces = module.getSetting("toFixed(#)");
});

// FUNCTION onStrafe
module.handle("onStrafe", function (strafe) {
    var yaw = strafe.getYaw();
    while (yaw > 180) yaw -= 360;           // doing fucking
    while (yaw < -180) yaw += 360;          // devs job
    yawValue = yaw.toFixed(decimalPlaces);
});

// FUNCTION onPreMotion
module.handle("onPreMotion", function (preMotion) {
    var pitch = preMotion.getPitch();
    pitchValue = pitch.toFixed(decimalPlaces);
});

// FUNCTION onRender2D
module.handle("onRender2D", function (render2) {
    var scaledHeight = render2.getScaledHeight();
    var scaledWidth = render2.getScaledWidth();
    decimalPlaces = module.getSetting("toFixed(#)");
    var blur = module.getSetting("blur (fire api)");
    //rise.displayChat("Yaw: " + yawValue + ", Pitch: " + pitchValue);
    render.roundedRectangle((scaledWidth / 200) - 10, scaledHeight - 13, 83 + (decimalPlaces * 12.8), 13, 5, [0, 0, 0, 170]);
    if (blur) {
        render.blur(function () {
            render.roundedRectangle((scaledWidth / 200) - 10, scaledHeight - 13, 83 + (decimalPlaces * 12.8), 13, 5, [0, 0, 0, 240]);
        });
    }
    mcFont.drawWithShadow("Y: " + yawValue + " " + "P: " + pitchValue, (scaledWidth / 200), scaledHeight - 9, [255, 255, 255]);
});

// UNLOAD
script.handle("onUnload", function () {
    module.unregister();
});
