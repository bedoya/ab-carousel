/**
 * @function default_options
 * Set options that can be overridden
 * when creating the ABCarousel instance.
 */
const default_options = () => {
    return {
        slide_speed: 6000,
        is_active: true,
        direction: true,
        transition: 'ABFade',
        slide_class: 'ab-carousel-slide',
        slide_image_class: 'ab-carousel-slide-background',
        buttons: {
            prev: {class: 'ab-carousel-button-prev'},
            next: {class: 'ab-carousel-button-next'},
            stop: {class: 'ab-carousel-button-stop'}
        },
    };
};

export default default_options;
