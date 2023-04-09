import { SpriteGrid } from "./spriteGrid.js";
import { initializeSpriteGrid } from "./spriteGrid.js";
import { MouseHoverEffect } from "./mouseHover.js";
import { EnemySpawner } from './enemySpawner.js';

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.

	
	initializeSpriteGrid(runtime, runtime.objects.rarityBox.name, 3, 1, 40);
	initializeSpriteGrid(runtime, runtime.objects.gridShip.name, 3, 1, 40);
	
	// List of objects effected by the MouseHoverEffect class
	const mouseHoverShip = new MouseHoverEffect(runtime, "gridShip", 2.3, 2);
	const mouseHoverWeapon = new MouseHoverEffect(runtime, "gridWeapon", 2.3, 2);
	const mouseHoverEngine = new MouseHoverEffect(runtime, "gridEngine", 2.3, 2);
	
	// Enemy spawner
	const enemySpawner = new EnemySpawner(runtime);
	runtime.enemySpawner = enemySpawner;
	// Array of EnemySpawner objects for positional tracking
	const enemyInstances = [];
	runtime.enemyInstances = enemyInstances;

	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
	// Code to run every tick
	for (const enemyData of runtime.enemyInstances) {
        runtime.enemySpawner.updateAttachments(enemyData.enemyInstance, enemyData.enemyWeapon, enemyData.enemyEngine);
    }
}