# input-helper

Simple library for handling user input in web based games in a platform agnostic way.

**input-helper** is something I have been using in my cross platform web apps and games for years now to get around all of the different touch/mouse/pen quirks across operating systems and devices.  I decided to finally refactor it as an ES6 module and throw it on GitHub in case it can be helpful to anyone else.

It also includes a helper function for adding click and context menu support for DOM elements.  That may sound trivial, but the oncontextmenu event does not work on iOS devices (as of 2025), so instead of writing special Safari logic in every application, I added it to this helper instead.

## Installing

On the Web you can just put the input-helper.js file in your project directory.  If you are using npm you can use the following (I have not published this to the npm repo but you can include it from GitHub):

```json
"dependencies": {
    "input-helper": "git+ssh://git@github.com:bastecklein/input-helper.git#main"
}
```

## Usage

```javascript
// node
import inputHelper from "input-helper";

// browser
import inputHelper from "./input-helper.js";

// It doesn't need to be a canvas, any dom element can be used,
// I normally use it on a canvas though
const canvas = document.getElementById("myCoolCanvas");

inputHelper.handleInput({
    element: canvas,
    down: onDown,
    move: onMove,
    up: onUp
});

function onDown(e) {
    // you can console.log(e) to see what it contains, 
    // will have the element, coordinates, id, pressure,
    // what kind of input device, etc
}

function onMove(e) {}

function onUp(e) {}

const button = document.getElementById("myButtonThatNeedsAContextMenu");

inputHelper.clickAndContextHelper({
    element: button,
    click: onClick,
    context: onContext
});

function onClick(e) {
    // button was clicked!
}

function onContext(e) {
    // button was right clicked or long pressed!
}

const ele = document.getElementById("cleanMeUp");

// this removes a lot of the default behaviors on mobile,
// such as touch feedback, hilighting, etc
inputHelper.clearElementForTouch(ele);
```

Library is pretty basic, let me know if you have issues!