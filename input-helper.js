let iOSHoldItem = null;
let iostouchhold = null;

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

            if(options.end) {
                options.end({
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

        if(options.end) {
            options.end({
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