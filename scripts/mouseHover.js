export class MouseHoverEffect {
    constructor(runtime, objectName, scaleUpFactor = 1.25, scaleDownFactor = 1, tweenDuration = 0.1, mouseObjectName = 'Mouse') {
        this.runtime = runtime;
        this.objectName = objectName;
        this.mouseObjectName = mouseObjectName;
        this.scaleUpFactor = scaleUpFactor;
		this.scaleDownFactor = scaleDownFactor;
        this.tweenDuration = tweenDuration;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.runtime.addEventListener("tick", () => this.checkMouseHover());
    }

	checkMouseHover() {
		const object = this.runtime.objects[this.objectName];
		const mouse = this.runtime.objects.Mouse;

		// Get the mouse position using getMousePosition()
		const [mouseX, mouseY] = mouse.getMousePosition();

		// Use a for loop to iterate over the instances
		const instances = object.getAllInstances();
		for (let i = 0; i < instances.length; i++) {
			const instance = instances[i];

			if (instance.containsPoint(mouseX, mouseY)) {
				if (!instance.hovered) {
					instance.hovered = true;
					instance.zElevation = 99;
					const scaleAmountX = this.scaleUpFactor;
					const scaleAmountY = this.scaleUpFactor;
					instance.behaviors.Tween.startTween("scale", [scaleAmountX, scaleAmountY], this.tweenDuration, "linear");
				}
			} else {
				if (instance.hovered) {
					instance.hovered = false;
					instance.zElevation = 0;
					const scaleAmountX = this.scaleDownFactor;
					const scaleAmountY = this.scaleDownFactor;
					instance.behaviors.Tween.startTween("scale", [scaleAmountX, scaleAmountY], this.tweenDuration, "linear");
				}
			}
		}
	}
}