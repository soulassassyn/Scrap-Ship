export class SpriteGrid {
    constructor(runtime, spriteName, numberOfColumns = 3, numberOfRows = 3, gap = 0) {
        this.runtime = runtime;
        this.spriteName = spriteName;
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
		this.gap = gap;
        this.currentPage = 0;
		this.gridUIDs = [];
    }
		
	updateSpriteName(newSpriteName) {
		this.spriteName = newSpriteName;
		this.clearGrid();
		this.createGrid(this.currentPage);
	}

    create() {
        this.createGrid(this.currentPage);
    }

    createGrid(page) {
        const spriteObject = this.runtime.objects[this.spriteName];
        const tempInstance = spriteObject.createInstance(0, 0, 0);
        let totalFrames = tempInstance.animation.frameCount;
        const gap = this.gap;
        tempInstance.destroy();

        const alignObject = this.runtime.objects.align;
        const positionAlign = alignObject.getFirstPickedInstance();
		const currentLayer = positionAlign.layer.name;
        const ogPAX = positionAlign.x;
        const ogPAY = positionAlign.y;
        const framesPerPage = this.numberOfRows * this.numberOfColumns;
        let frameIndex = 0;
		// Checks for multiple frames in the sprite animation. If only one, duplicates that for the grid instead of iterating over multiple frames
		if (totalFrames > 1) {
			frameIndex = framesPerPage * page;
		} else {
			totalFrames = framesPerPage;
		}
		
        for (let row = 0; row < this.numberOfRows; row++) {
            for (let col = 0; col < this.numberOfColumns; col++) {
                if (frameIndex < totalFrames) {
					const newInstance = spriteObject.createInstance(currentLayer, 0, 0);
					
					// Fills gridUIDs array with UID of created instance
					// Used for clearGrid()
					this.gridUIDs.push(newInstance.uid);
                    newInstance.setAnimation(this.spriteName);
					newInstance.animationFrame = frameIndex;
					newInstance.isVisible = true;						
                    newInstance.x = positionAlign.x;
                    newInstance.y = positionAlign.y;

                    positionAlign.x = positionAlign.width + (positionAlign.x + gap);
                    frameIndex++;
                } else {
                    positionAlign.x = ogPAX;
                    positionAlign.y = ogPAY;
                    break;
                }
            }
            positionAlign.x = ogPAX;
            positionAlign.y = positionAlign.height + (positionAlign.y + gap);
        }
        positionAlign.x = ogPAX;
        positionAlign.y = ogPAY;
    }

    changePage(newPage) {
        this.currentPage = newPage;
        this.clearGrid();
        this.createGrid(newPage);
    }

	nextPage() {
		const spriteObject = this.runtime.objects[this.spriteName];
		const tempInstance = spriteObject.createInstance(0, 0, 0);
		const totalFrames = tempInstance.animation.frameCount;
		tempInstance.destroy();

		const totalPages = Math.ceil(totalFrames / (this.numberOfRows * this.numberOfColumns));
		if (this.currentPage + 1 < totalPages) {
			this.changePage(this.currentPage + 1);
		}
	}

	previousPage() {
		if (this.currentPage - 1 >= 0) {
			this.changePage(this.currentPage - 1);
		}
	}

    clearGrid() {
		for (let i = 0; i < this.gridUIDs.length; i++)
		{
			const forDestroy = this.runtime.getInstanceByUid(this.gridUIDs[i]);
			if (forDestroy == null) {
				this.gridUIDs.length = 0;
			} else {
				forDestroy.destroy();
			}
		}
		this.gridUIDs = [];
    }
}

// Needed to initialize the spriteGrids object and attach it to the runtime object so that it's scoped Globally
export function initializeSpriteGrid(runtime, spriteName, numberOfColumns, numberOfRows, gap) {
	// Error check to make sure the grid doesn't already exist
    if (!runtime.spriteGrids) 
	{
        runtime.spriteGrids = {};
    }
    // Create a new SpriteGrid instance and store it in the spriteGrids object
    runtime.spriteGrids[spriteName] = new SpriteGrid(runtime, spriteName, numberOfColumns, numberOfRows, gap);
}