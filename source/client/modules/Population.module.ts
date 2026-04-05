//-----------------------------------------//
// Population Module (Extra Safe)
// This module handles standard ambient population density.
//-----------------------------------------//

function setAmbientPopulation(multiplier: number) {
    try {
        // Safe guard for multiplier
        const density = Math.max(0, Math.min(1.0, multiplier));

        // Pedestrians
        mp.game.ped.setDensityMultiplierThisFrame(density);

        // Vehicles
        mp.game.vehicle.setDensityMultiplierThisFrame(density);
        mp.game.vehicle.setRandomDensityMultiplierThisFrame(density);
        mp.game.vehicle.setParkedDensityMultiplierThisFrame(density);
    } catch (e) {
        // Silently fail to avoid crashing the render loop
    }
}

let currentDensity = 1.0;

mp.events.add("client::population:setDensity", (density: number) => {
    currentDensity = density;
});

mp.events.add("render", () => {
    // 1. Ensure local player exists
    if (!mp.players.local) return;
    
    // 2. Ensure player model is actually spawned (has a handle)
    if (!mp.players.local.handle) return;

    // 3. Ensure the server has marked the player as logged in
    if (!mp.players.local.getVariable("loggedin")) return;
    
    setAmbientPopulation(currentDensity);
});
