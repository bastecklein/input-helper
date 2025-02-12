let iOSHoldItem = null;
let iostouchhold = null;

/**
 * Handles input events for an element
 * @param {Object} options 
 * options.element - the element to handle input for
 * options.down - function to call when a pointer down event is detected
 * options.move - function to call when a pointer move event is detected
 * options.up - function to call when a pointer up event is detected
 * @returns 
 */
export function handleInput(options) {
    if(!options || !options.element) {
        return;
    }

    const element = options.element;

    let ignoreOut = false;

    if(options.ignoreOut) {
        ignoreOut = true;
    }

    clearElementForTouch(element);

    element.addEventListener("touchstart",function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    element.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
            
        let pointerType = "mouse";
            
        if (event.pointerType) {
            pointerType = event.pointerType;
        }
            
        let pressure = 1;
            
        if (event.pressure) {
            pressure = event.pressure;
        }

        let which = 1;
            
        if(pointerType == "mouse") {
            if(event.which) {
                which = event.which;
            }
        }

        if(options.down) {
            options.down({
                element: element,
                id: event.pointerId,
                x: event.offsetX,
                y: event.offsetY,
                type: pointerType,
                pressure: pressure,
                which: which,
                pageX: event.pageX,
                pageY: event.pageY
            });
        }

        return false;
    }, { passive: false });

    element.addEventListener("pointermove", function (event) {
        event.preventDefault();
        event.stopPropagation();

        let pointerType = "mouse";
            
        if (event.pointerType) {
            pointerType = event.pointerType;
        }
            
        let pressure = 1;
            
        if (event.pressure) {
            pressure = event.pressure;
        }

        let which = 1;
            
        if(pointerType == "mouse") {
            if(event.which) {
                which = event.which;
            }
        }

        if(options.move) {
            options.move({
                element: element,
                id: event.pointerId,
                x: event.offsetX,
                y: event.offsetY,
                type: pointerType,
                pressure: pressure,
                which: which,
                pageX: event.pageX,
                pageY: event.pageY
            });
        }

        return false;
    }, { passive: false });

    if(!ignoreOut) {
        element.addEventListener("pointerout", function (event) {

            event.preventDefault();
            event.stopPropagation();

            let pointerType = "mouse";
                
            if (event.pointerType) {
                pointerType = event.pointerType;
            }

            let which = 1;
                
            if(pointerType == "mouse") {
                if(event.which) {
                    which = event.which;
                }
            }

            if(options.up) {
                options.up({
                    element: element,
                    id: event.pointerId,
                    type: pointerType,
                    which: which,
                    evt: "out"
                });
            }

            return false;
        }, { passive: false });
    }
    

    element.addEventListener("pointerup", function (event) {

        event.preventDefault();
        event.stopPropagation();

        let pointerType = "mouse";
            
        if (event.pointerType) {
            pointerType = event.pointerType;
        }

        let which = 1;
            
        if(pointerType == "mouse") {
            if(event.which) {
                which = event.which;
            }
        }

        if(options.up) {
            options.up({
                element: element,
                id: event.pointerId,
                type: pointerType,
                which: which,
                evt: "up"
            });
        }

        return false;
    }, { passive: false });
}

/**
 * Removes the default touch and mouse events from an element
 * @param {HTMLElement} element - the element to clear touch events from
 * @returns
 * */
export function clearElementForTouch(element) {
    element.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }, { passive: false });

    element.addEventListener("ontouchforcechange", function(e) {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }, { passive: false });

    element.addEventListener("webkitmouseforcewillbegin", function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    element.addEventListener("webkitmouseforcedown", function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    element.addEventListener("webkitmouseforceup", function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    element.addEventListener("webkitmouseforcechanged", function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    element.touchAction = "none";
    element.contentZooming = "none";
    element.msTouchAction = "none";
    element.msContentZooming = "none";
        
    element.style.touchAction = "none";
    element.style.userSelect = "none";
}

/**
 * Handles click and context/long press events for an element
 * @param {Object} options
 * options.element - the element to handle click and context events for
 * options.click - function to call when a click event is detected
 * options.context - function to call when a context event is detected
 * options.vibrate - whether or not to vibrate on context event
 * @returns
 * */
export function clickAndContextHelper(options) {

    if(!options || !options.element) {
        return;
    }

    const element = options.element;

    let vibrate = true;

    if(options.vibrate != undefined) {
        vibrate = options.vibrate;
    }

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {

        let touchStatus = null;

        element.ontouchstart = function(e) {
            e.preventDefault();
            e.stopPropagation();

            touchStatus = "down";

            iOSHoldItem = element;

            iostouchhold = setTimeout(function() {

                if(iOSHoldItem != null) {
                    iOSHoldItem.touchStatus = "up";
                
                    if(vibrate && navigator.vibrate) {
                        navigator.vibrate(100);
                    }

                    if(options.context) {
                        options.context({
                            element: element,
                            x: e.pageX,
                            y: e.pageY
                        });
                    }
                }

                killIosHold();
            },600);
        };

        element.ontouchend = function(e) {

            e.preventDefault();
            e.stopPropagation();

            const stat = touchStatus;

            touchStatus = "up";

            killIosHold();

            if(stat == "down") {
                let useEle = element;

                if(e.target) {
                    useEle = e.target;
                }

                if(options.click) {
                    options.click({
                        element: useEle,
                        x: e.pageX,
                        y: e.pageY
                    });
                }
            }

        };

        element.ontouchcancel = function(e) {
            e.preventDefault();
            e.stopPropagation();

            touchStatus = "up";
            killIosHold();
        };

    
        element.ontouchmove = function(e) {

            e.preventDefault();
            e.stopPropagation();

            touchStatus = "up";
            killIosHold();
        };
    } else {
        element.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let useEle = element;

            if(e.target) {
                useEle = e.target;
            }

            if(options.click) {
                options.click({
                    element: useEle,
                    x: e.pageX,
                    y: e.pageY
                });
            }
        };

        element.oncontextmenu = function(e) {
            e.preventDefault();
            e.stopPropagation();

            if(vibrate && navigator.vibrate) {
                navigator.vibrate(50);
            }

            if(options.context) {
                options.context({
                    element: element,
                    x: e.clientX,
                    y: e.clientY
                });
            }

        };
    }
}

function killIosHold() {
    if(iostouchhold != null) {
        clearTimeout(iostouchhold);
    }

    iOSHoldItem = null;
    iostouchhold = null;
}

// for backwards compatibility
if(!window.apeApps) {
    window.apeApps = {};
}

if(!window.apeApps.utilities) {
    window.apeApps.utilities = {};
}

window.apeApps.utilities.inputHelper = {
    handleInput: function(object, downFunction, moveFunction, endFunction, ignoreOut = false) {

        console.warn("apeApps.utilities.inputHelper.handleInput is deprecated. Please use module instead.");

        handleInput({
            element: object,
            down: function(e) {
                downFunction(e.element, e.id, e.x, e.y, e.type, e.pressure, e.which, e.pageX, e.pageY);
            },
            move: function(e) {
                moveFunction(e.element, e.id, e.x, e.y, e.type, e.pressure, e.which, e.pageX, e.pageY);
            },
            up: function(e) {
                endFunction(e.element, e.id, e.type, e.which, e.evt);
            },
            ignoreOut: ignoreOut
        });
    },
    clearElementForTouch,
    clickAndContextHelper
};

export default {
    handleInput,
    clearElementForTouch,
    clickAndContextHelper
};