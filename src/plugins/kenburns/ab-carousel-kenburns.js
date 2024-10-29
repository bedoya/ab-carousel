import default_options from './options.js';

function ABKenBurns() {
    let kenBurnsOptions;

    /**
     * Applies the KenBurns effect to the given image
     *
     * @param image
     */
    function applyEffect(image) {
        image.style.transform = 'none';
        image.offsetHeight;

        const zoom_start = parseFloat(kenBurnsOptions.zoom_start);
        const zoom_final = parseFloat(kenBurnsOptions.zoom_final);
        const pan_amount = parseFloat(kenBurnsOptions.pan_amount);
        const pan_direction = kenBurnsOptions.pan_direction;
        const duration = parseFloat(kenBurnsOptions.duration);

        const panX = Math.cos(pan_direction * (Math.PI / 180)) * pan_amount;
        const panY = Math.sin(pan_direction * (Math.PI / 180)) * pan_amount;

        image.style.transform = 'scale(' + zoom_start + ')';
        image.style.transition = 'transform ' + (duration / 1000) + 's ease-in-out';

        setTimeout(() => {
            let start_time;
            let progress = 0;
            let scale;

            function effect(timestamp) {
                if (!start_time) {
                    start_time = timestamp;
                }
                const elapsed = timestamp - start_time;

                // Only apply the transformation during the duration
                if (elapsed < duration) {
                    progress = elapsed / duration;
                    scale = zoom_start + ( (zoom_final - zoom_start) * progress );
                    const translateX = panX * progress;
                    const translateY = panY * progress;

                    image.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;

                    requestAnimationFrame(effect); // Continue the animation
                }
                else {
                    image.style.transform = `scale(${zoom_final}) translateX(${panX}px) translateY(${panY}px)`;
                }
            }

            // Start the animation
            requestAnimationFrame(effect);
        }, 1000);
    }

    /**
     * Removes the effects applied to the background image
     *
     * @param image
     */
    function resetEffect(image) {
        image.style.transform = 'scale(1) translate(0, 0)';
        image.style.transition = 'none';

        setTimeout(() => {
            image.style.transition = '';
        }, 50);
    }

    return {
        name: 'ABKenBurns',
        type: 'effect',
        init(image) {
            kenBurnsOptions = Object.assign({...default_options()}, image.dataset);
            applyEffect(image);
        },
        applyEffect: applyEffect,
        resetEffect: resetEffect,
    };
}

ABKenBurns.globalOptions = undefined;

export {ABKenBurns as default};
