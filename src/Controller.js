import { Container } from 'pixi.js';

//map keyboard key codes to controller's state keys
const keyMap = {
    Space: 'space',
    KeyW: 'up',
    ArrowUp: 'up',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyD: 'right',
    ArrowRight: 'right',
};

//class for handling keyboard inputs
export class Controller
{
    constructor()
    {
        //the controller's state
        this.keys = {
            up: { pressed: false, doubleTap: false, timestamp: 0 },
            left: { pressed: false, doubleTap: false, timestamp: 0 },
            down: { pressed: false, doubleTap: false, timestamp: 0 },
            right: { pressed: false, doubleTap: false, timestamp: 0 },
            space: { pressed: false, doubleTap: false, timestamp: 0 },
        };

        //register event listeners for keydown and keyup events.
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
        window.addEventListener('keyup', (event) => this.keyupHandler(event));
    }

    keydownHandler(event)
    {
        const key = keyMap[event.code];

        if (!key) return;

        const now = Date.now();

        //if not already in the double-tap state, toggle the double tap state if the key was pressed twice within 300ms
        this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;

        //toggle on the key pressed state
        this.keys[key].pressed = true;
    }

    keyupHandler(event)
    {
        const key = keyMap[event.code];

        if (!key) return;

        const now = Date.now();

        //reset the key pressed state
        this.keys[key].pressed = false;

        //reset double tap only if the key is in the double-tap state
        if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;

        //otherwise, update the timestamp to track the time difference till the next potential key down
        else this.keys[key].timestamp = now;
    }
}
