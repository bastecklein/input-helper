let iOSHoldItem = null;
let iostouchhold = null;

function isIOSDevice() {
    if(typeof navigator == "undefined") {
        return false;
    }

    if(/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        return true;
    }

    // iPadOS can identify as Mac while still reporting touch points.
    return navigator.platform == "MacIntel" && navigator.maxTouchPoints > 1;
}

/**
 * Handles input events for an element
 * @param {Object} options 
 * options.element - the element to handle input for
 * options.down - function to call when a pointer down event is detected
 * options.move - function to call when a pointer move event is detected
 * options.up - function to call when a pointer up event is detected
 * options.suppressNative - when true, prevents default browser behaviors (defaults to true)
 * options.preventDefault - deprecated alias for suppressNative
 * @returns 
 */
export function handleInput(options) {
    if(!options || !options.element) {
        return;
    }

    const element = options.element;

    let ignoreOut = false;
    let suppressNative = true;

    if(options.ignoreOut) {
        ignoreOut = true;
    }

    if(options.suppressNative != undefined) {
        suppressNative = options.suppressNative;
    } else if(options.preventDefault != undefined) {
        suppressNative = options.preventDefault;
    }

    clearElementForTouch(element, {
        suppressNative: suppressNative
    });

    element.addEventListener("touchstart",function(e) {
        if(suppressNative) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });

    element.addEventListener("pointerdown", function (event) {
        if(suppressNative) {
            event.preventDefault();
            event.stopPropagation();
        }
            
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
        if(suppressNative) {
            event.preventDefault();
            event.stopPropagation();
        }

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

            if(suppressNative) {
                event.preventDefault();
                event.stopPropagation();
            }

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

        if(suppressNative) {
            event.preventDefault();
            event.stopPropagation();
        }

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
 * @param {Object} options
 * options.suppressNative - when true, disable native touch/click behavior (defaults to true)
 * @returns
 * */
export function clearElementForTouch(element, options = {}) {
    if(!element) {
        return;
    }

    let suppressNative = true;

    if(options.suppressNative != undefined) {
        suppressNative = options.suppressNative;
    }

    if(!suppressNative) {
        return;
    }

    element.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }, { passive: false });

    element.addEventListener("touchforcechange", function(e) {
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

    if (isIOSDevice()) {

        let touchStatus = null;
        let longPressFired = false;
        let startX = 0;
        let startY = 0;

        const LONG_PRESS_MS = 600;
        const MOVE_TOLERANCE_PX = 10;

        const getTouchPoint = function(e) {
            if(e.changedTouches && e.changedTouches.length > 0) {
                return {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY
                };
            }

            if(e.touches && e.touches.length > 0) {
                return {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                };
            }

            return {
                x: e.pageX,
                y: e.pageY
            };
        };

        element.ontouchstart = function(e) {
            touchStatus = "down";
            longPressFired = false;

            const point = getTouchPoint(e);
            startX = point.x;
            startY = point.y;

            iOSHoldItem = element;

            iostouchhold = setTimeout(function() {

                if(iOSHoldItem != null && touchStatus == "down") {
                    longPressFired = true;
                
                    if(vibrate && navigator.vibrate) {
                        navigator.vibrate(100);
                    }

                    if(options.context) {
                        options.context({
                            element: element,
                            x: startX,
                            y: startY
                        });
                    }
                }

                killIosHold();
            }, LONG_PRESS_MS);
        };

        element.ontouchend = function(e) {
            const stat = touchStatus;

            touchStatus = "up";

            killIosHold();

            if(longPressFired) {
                longPressFired = false;
                return;
            }

            if(stat == "down") {
                let useEle = element;
                const point = getTouchPoint(e);

                if(e.target) {
                    useEle = e.target;
                }

                if(options.click) {
                    options.click({
                        element: useEle,
                        x: point.x,
                        y: point.y
                    });
                }
            }

        };

        element.ontouchcancel = function() {
            touchStatus = "up";
            longPressFired = false;
            killIosHold();
        };

    
        element.ontouchmove = function(e) {
            if(touchStatus != "down") {
                return;
            }

            const point = getTouchPoint(e);
            const dx = point.x - startX;
            const dy = point.y - startY;

            if(Math.abs(dx) > MOVE_TOLERANCE_PX || Math.abs(dy) > MOVE_TOLERANCE_PX) {
                touchStatus = "up";
                killIosHold();
            }
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