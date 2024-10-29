/**
 * @function default_options
 * Set options that can be overridden
 * when creating the ABCarousel instance.
 */
const default_options = () => {
    return {
        slide_speed: 9000,
        is_active: true,
        direction: true,
        transition: 'ABFade',
        container_class: 'ab-carousel',
        slide_class: 'ab-carousel-slide',
        slide_image_class: 'ab-carousel-slide-image',
    };
};

export default default_options;
