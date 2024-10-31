class Button {
    constructor(element, event_emitter, options) {
        this.element = element;
        this.event_emitter = event_emitter;
        this.options = options;
        this.init();
    }

    init() {
        this.element.addEventListener('click', () => this.handleClick());
    }

    handleClick() {
        if (this.options.type === 'direction') {
            this.event_emitter.emit('buttonClicked', { direction: this.options.direction });
        }
        else if (this.options.type === 'stop') {
            this.event_emitter.emit('stopSlider');
        }
        else if (this.options.type === 'play') {
            this.event_emitter.emit('startSlider');
        }
    }
}

export default Button;