import default_options from './options.js';

class ABKenBurns {
    /**
     * The constructor of the class
     */
    constructor() {
        this.name = 'ABKenBurns';
        this.type = 'effect';
    }

    /**
     * Initializes the effect for the element
     *
     * @param image
     */
    init(image) {
        this.image = image;
        this.ken_burns_options = Object.assign({...default_options()}, this.image.dataset);
        this.applyEffect();
    }

    /**
     * Applies the KenBurns effect to the given image
     */
    applyEffect() {
        this.image.style.transform = 'none';
        this.image.offsetHeight;

        const zoom_start = parseFloat(this.ken_burns_options.zoom_start);
        const zoom_final = parseFloat(this.ken_burns_options.zoom_final);
        const pan_amount = parseFloat(this.ken_burns_options.pan_amount);
        const pan_direction = this.ken_burns_options.pan_direction;
        const duration = parseFloat(this.ken_burns_options.duration);

        const panX = Math.cos(pan_direction * (Math.PI / 180)) * pan_amount;
        const panY = Math.sin(pan_direction * (Math.PI / 180)) * pan_amount;

        this.image.style.transform = 'scale(' + zoom_start + ')';
        this.image.style.transition = 'transform ' + (duration / 1000) + 's ease-in-out';

        setTimeout(() => {
            let start_time;
            let progress = 0;
            let scale;

            const self = this;

            function effect(timestamp) {
                if (!start_time) {
                    start_time = timestamp;
                }
                const elapsed = timestamp - start_time;

                // Only apply the transformation during the duration
                if (elapsed < duration) {
                    progress = elapsed / duration;
                    scale = zoom_start + ((zoom_final - zoom_start) * progress);
                    const translateX = panX * progress;
                    const translateY = panY * progress;

                    self.image.style.transform = 'scale(' + scale + ') translateX(' + translateX + 'px) translateY(' + translateY + 'px)';

                    requestAnimationFrame(effect);
                }
                else {
                    self.resetEffect(self.image);
                }
            }

            // Start the animation
            requestAnimationFrame(effect);
        }, 1000);
    }

    /**
     * Removes the effects applied to the background image
     */
    resetEffect(image) {
        image.style.transform = 'scale(1) translate(0, 0)';
        image.style.transition = 'none';

        setTimeout(() => {
            image.style.transition = '';
        }, 50);
    }
}

export default ABKenBurns;
