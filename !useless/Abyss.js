//@ author Z52
//@ version 1.1
//@ description A script that uses a custom command to allow stat-checking overlays to be used. (Log-based overlays)

//Need to ".script disablesecurity" to let the script write to the file

//java.type imports for writing to file
var FileWriter = Java.type("java.io.FileWriter");
var BufferedWriter = Java.type("java.io.BufferedWriter");
var PrintWriter = Java.type("java.io.PrintWriter");

//Registering module
var module = rise.registerModule("Abyss Overlay", "By Z52")

script.handle('onUnload', function() {
	module.unregister();
	overlay.unregister();
});

// Use the command ".overlay" to update the player list for the overlay.
// Without this, the player list will not be updated and the overlay won't know who is in the game.
// Sometimes it shows extra players like NPC's, but I don't know a better way to do this without that bug.
var overlay = rise.registerCommand("overlay", "updates overlay")
overlay.handle("onExecute", function(){

function processWorld() {
	var livingEntities = world.getEntities();
	var players = [];
	var writeBuf = "[00:00:00] [Client thread/INFO]: [CHAT] ONLINE: ";

	for(var i = 0; i < livingEntities.length; i++) {
		entity = livingEntities[i];
		if (entity.isPlayer())
		{
			writeBuf = writeBuf + entity.getDisplayName() + ", ";
		}
	}
	
	writeBuf = writeBuf.substring(0, writeBuf.length - 2);
	writeBuf = writeBuf.replaceAll("§c", "")
	writeBuf = writeBuf.replaceAll("§7", "")
	
	var out = new PrintWriter(new BufferedWriter(new FileWriter("latest.log", true)));
	out.println(writeBuf);
	out.close();
}

processWorld();
})
