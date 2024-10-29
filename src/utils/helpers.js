/**
 *
 * @param element
 * @returns {*[]}
 */
export function getSiblings(element) {
    let siblings = [element];
    if (!element.parentNode) {
        return siblings;
    }
    let sibling = element.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
}

/**
 * Hides all the elements of an array of elements
 *
 * @param elements
 */
export function hideAll(elements) {
    Array.from(elements).forEach((element) => {
        element.style.display = 'none';
        element.style.opacity = 0;
    });
}

/**
 * Displays the given slide
 *
 * @param element
 * @param opacity
 */
export function showElement(element, opacity = 1) {
    element.style.display = 'block';
    element.style.opacity = opacity;
}

/**
 * Hides the given slide
 *
 * @param element
 * @param opacity
 */
export function hideElement(element, opacity = 0) {
    element.style.display = 'none';
    element.style.opacity = opacity;
}

/**
 * Determines if a HTML element is hidden
 *
 * @param element
 * @returns {boolean}
 */
export function isHidden(element) {
    return element.style.display === 'none' || element.style.opacity === 0;
}
