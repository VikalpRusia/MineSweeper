const {
    PI, SQRT2,
    floor, max,
    min, pow, sign, sqrt
} =
    Math;

const ONE = 1.0;
const TWO = 2.0;
const HALF = ONE / TWO;

const HALF_PI = PI * HALF;
const TAU = PI * TWO;

const TEXTALIGN_CENTER = 'center';
const TEXTBASELINE_MIDDLE = 'middle';

let LEVEL = {
    EASY: {
        levelName: 'EASY',
        x: 10,
        y: 10,
        mC: 10
    },
    MEDIUM: {
        levelName: 'MEDIUM',
        x: 18,
        y: 18,
        mC: 40
    },
    HARD: {
        levelName: 'HARD',
        x: 24,
        y: 24,
        mC: 99
    },
    CUSTOM: {
        levelName: 'Custom'
    }
};

let _defaultCanvasOptions = {
    autoClear: false,
    autoCompensate: true,
    autoPushPop: false,
    canvas: true,
    centered: false,
    desynchronized: false,
    drawAndStop: false,
    width: null,
    height: null
};
let canvasContainer = document.getElementById('canvasContainer');

let _canvasOptions = {};
let canvas = document.getElementById('canvas');
if (canvas === null) {
    canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    document.body.appendChild(canvas);
}
let ctx = canvas.getContext('2d', {
    desynchronized: window.canvasOptions && window.canvasOptions.desynchronized !== undefined ?
        window.canvasOptions.desynchronized : _defaultCanvasOptions.desynchronized
    // preserveDrawingBuffer: true // WebGL
});
const _originalCtx = ctx;
let _anim, _lastCanvasTime, canvasFrameRate, frameCount, width, height, width_half, height_half, width_quarter,
    height_quarter;
let _canvasCurrentlyCentered = false;
let _logMouseEvents = false;
let _mouseUpdateTimeThreshold = 12;
let mouseUpdate = -Infinity, mouseIn = false, mouseDown = false, mouseButton = -1,
    mouseMove = null, mousePos = null, mousePosPrev = null,
    mouseDownTime = -Infinity, mouseDownPos = null,
    mouseEnterPos = null, mouseExitPos = null,
    mouseUpTime = -Infinity, mouseUpPos = null,
    mouseEnterTime = -Infinity, mouseExitTime = -Infinity;

function updateMouse(e, eventName) {// Modified from p5.js
    if (_logMouseEvents) {
        console.log('Mouse event', eventName, e);
    }
    if (e && !e.clientX) {
        e = e.touches && e.touches.length ? e.touches[0] : e.changedTouches ? e.changedTouches[0] : e;
    }
    if (!e) {
        if (_logMouseEvents) {
            console.log('Missing event data');
        }
        return;
    }
    const _mouseUpdate = e.timeStamp === undefined ? performance.now() : e.timeStamp;
    if (mouseUpdate > 0 && _mouseUpdate - mouseUpdate < _mouseUpdateTimeThreshold) {
        if (_logMouseEvents) {
            // https://nolanlawson.com/2019/08/11/high-performance-input-handling-on-the-web/
            // http://event-timing.glitch.me/
            console.log('Skipping mouse event, are the dev tools open?');
        }
        return;
    }
    mouseUpdate = _mouseUpdate;
    let rect = canvas.getBoundingClientRect();
    let sx = canvas.scrollWidth / width;
    let sy = canvas.scrollHeight / height;
    let x = (e.clientX - rect.left) / sx;
    let y = (e.clientY - rect.top) / sy;
    if (x < 0) x = 0; else if (x > width) x = width;
    if (y < 0) y = 0; else if (y > height) y = height;
    if (mousePos) {
        mousePosPrev.set(mousePos);
        mousePos.set(x, y);
    }
}

canvas.addEventListener('mouseenter', e => {
    updateMouse(e, 'mouseenter');
    mouseIn = true;
    mouseEnterTime = e.timeStamp;
    // mouseExitTime = -Infinity;
});
canvas.addEventListener('mouseleave', e => {
    updateMouse(e, 'mouseleave');
    mouseIn = mouseDown = false;
    // mouseEnterTime = -Infinity;
    mouseExitTime = e.timeStamp;
});
canvas.addEventListener('mousemove', e => {
    updateMouse(e, 'mousemove');
    mouseIn = true;
    mouseMove = e.timeStamp;
});
canvas.addEventListener('mousedown', e => {
    updateMouse(e, 'mousedown');
    mouseIn = mouseDown = true;
    mouseButton = e.button;
    mouseDownTime = e.timeStamp;
    mouseDownPos = mousePos.copy();
});
canvas.addEventListener('mouseup', e => {
    updateMouse(e, 'mouseup');
    mouseDown = false;
    mouseButton = e.button;
    mouseUpTime = e.timeStamp;
    mouseUpPos = mousePos.copy();
});
canvas.addEventListener('touchstart', e => (updateMouse(e, 'touchstart'), mouseIn = true));
canvas.addEventListener('touchend', e => (updateMouse(e, 'touchend'), mouseIn = mouseDown = false));
canvas.addEventListener('touchcancel', e => (updateMouse(e, 'touchcancel'), mouseIn = mouseDown = false));
canvas.addEventListener('touchmove', e => (updateMouse(e, 'touchmove'), mouseIn = true));
window.addEventListener('resize', _resizeCanvas);
window.addEventListener('load', () => {
    mousePos = new Vector();
    mousePosPrev = new Vector();
    mouseUpPos = new Vector();
    mouseDownPos = new Vector();
    mouseEnterPos = new Vector();
    mouseExitPos = new Vector();
    Object.assign(
        _canvasOptions,
        _defaultCanvasOptions,
        'canvasOptions' in window ? window.canvasOptions : {});

    if (_canvasOptions.canvas === false) {
        document.body.removeChild(canvas);
    }
    _resizeCanvas();
    if ('setup' in window) {
        window.setup();
    }
    frameCount = 0;
    _anim = requestAnimationFrame(_draw);
});

function _draw(timestamp) {
    frameCount++;
    canvasFrameRate = 1000.0 / (timestamp - _lastCanvasTime);
    if (!_lastCanvasTime) {
        _lastCanvasTime = timestamp;
    }
    // _lastCanvasTime = timestamp;
    ctx = _originalCtx;
    _canvasOptions.autoClear && clear(null);
    if (_canvasOptions.autoPushPop) {
        push();
        _canvasOptions.centered && (_canvasCurrentlyCentered = true) && translateCenter();
        _canvasOptions.autoCompensate && compensateCanvas();
    }
    'draw' in window && window.draw(timestamp);
    _canvasOptions.autoPushPop && pop();
    _canvasCurrentlyCentered = false;
    _lastCanvasTime = timestamp;
    if (_canvasOptions.drawAndStop) {
        return;
    }
    _anim = requestAnimationFrame(_draw);
}

function _resizeCanvas() {
    width = canvas.width = _canvasOptions.width !== null ? _canvasOptions.width : canvasContainer.clientWidth;
    height = canvas.height = _canvasOptions.height !== null ? _canvasOptions.height : canvasContainer.clientHeight;
    width_quarter = (width_half = width * HALF) * HALF;
    height_quarter = (height_half = height * HALF) * HALF;
    ctx.fillStyle = 'hsl(0, 0%, 100%)';
    ctx.strokeStyle = 'hsl(0, 0%, 100%)';
    if ('onResize' in window) {
        window.onResize();
    }
}

function clear(x, y, w, h) {
    if (x !== undefined && typeof x === 'number') {
        ctx.clearRect(x, y, w, h);
    } else if (_canvasOptions.centered && _canvasCurrentlyCentered /*  && x !== null */) {
        ctx.clearRect(-width_half, -height_half, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }
}

function isVectorish(n) {
    return n instanceof Vector || typeof n === 'object' && 'x' in n && 'y' in n;
}

function _resolveVectorArgs(x, y) {
    if (arguments.length === 0 || typeof x === 'undefined') return [];
    if (typeof x === 'number') return [x, ..._resolveVectorArgs(y)]; else if (isVectorish(x)) return [x.x, x.y, ..._resolveVectorArgs(y)]; else if (Array.isArray(x)) return [...x, ..._resolveVectorArgs(y)];
    throw new Error(`Could not understand arguments with types [ ${typeof x}, ${typeof y} ]`);
}

function fillStyle(...args) {
    if (args.length === 1) {
        let a = args[0];
        if (typeof a === 'string' || a instanceof CanvasGradient || a instanceof CanvasPattern) {
            ctx.fillStyle = args[0];
        }
    }
    return ctx.fillStyle;
}

function lineWidth(w) {
    if (typeof w === 'number') {
        ctx.lineWidth = w;
    }
    return ctx.lineWidth;
}

function miterLimit(value = 10) {
    ctx.miterLimit = value;
}

function strokeStyle(...args) {
    if (args.length === 1) {
        let [a] = args;
        if (typeof a === 'string' || a instanceof CanvasGradient) {
            ctx.strokeStyle = a;
        }
    } else if (args.length === 2) {
        strokeStyle(args[0]);
        lineWidth(args[1]);
    }
    return ctx.strokeStyle;
}

function hsl(hue, sat, light, alpha = 1) {
    if (typeof hue !== 'number') {
        if (Array.isArray(hue)) {
            [hue, sat, light, alpha = alpha] = hue;
        } else if ('h' in hue) {
            ({h: hue, s: sat, l: light, a: alpha = alpha} = hue);
        }
    }
    hue = hue % 360;
    if (hue < 0) {
        hue += 360;
    }
    return `hsl(${hue} ${sat}% ${light}% / ${alpha})`;
}

function rgb(r = 255, g = 255, b = 255, a = 1) {
    if (typeof r !== 'number' && 'r' in r) {
        ({r = 255, g = 255, b = 255, a = 1} = r);
    } else if (isVectorish(r)) {
        ({x: r = 255, y: g = 255, z: b = 255, a = 1} = r);
    }
    return `rgba(${[r, g, b, a]})`;
}

function fill(...args) {
    let path;
    if (args.length) {
        if (args[0] instanceof Path2D) {
            path = args.shift();
        }
        fillStyle(...args);
    }
    // Must branch the fill/stroke call as it
    // recognizes the undefined argument
    path ? ctx.fill(path) : ctx.fill();
}

function stroke(...args) {
    let path;
    if (args.length) {
        if (args[0] instanceof Path2D) {
            path = args.shift();
        }
        strokeStyle(...args);
    }
    // Must branch the fill/stroke call as it
    // recognizes the undefined argument
    path ? ctx.stroke(path) : ctx.stroke();
}

function strokeText(str = 'Hello world', ...pos) {
    const [x = 0, y = 0] = _resolveVectorArgs(...pos);
    ctx.strokeText(str, x, y);
}

function fillText(str = 'Hello world', ...pos) {
    const [x = 0, y = 0] = _resolveVectorArgs(...pos);
    ctx.fillText(str, x, y);
}

// ctx.textAlign = "left" || "right" || "center" || "start" || "end";
function textAlign(str = 'left') {
    ctx.textAlign = str;
}

// ctx.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
function textBaseline(str = 'left') {
    if (str === 'center') str = 'middle';
    ctx.textBaseline = str;
}

function push() {
    ctx.save();
}

function pop() {
    ctx.restore();
}

function translate(x = 0, y = 0) {
    if (typeof x === 'number') {
        ctx.translate(x, y);
    } else if ('x' in x) {
        ctx.translate(x.x, x.y);
    }
}

function translateCenter(x = 0, y = 0) {
    ctx.translate(width_half + x, height_half + y);
}

function scale(x = 1, y = x) {
    ctx.scale(x, y);
}

function compensateCanvas() {
    let offX = 0;
    let offY = 0;
    if (width % 2) offX += 0.5;
    if (height % 2) offY += 0.5;
    if (offX || offY) {
        translate(offX, offY);
    }
}

function beginPath() {
    ctx.beginPath();
}

function moveTo(x, y) {
    if (typeof x === 'number') {
        ctx.moveTo(x, y);
    } else if (isVectorish(x)) {
        ctx.moveTo(x.x, x.y);
    }
}

function closePath() {
    ctx.closePath();
}

function rect(x, y, w, h, r) {
    let _x2, _y2, _w, _h, _r;
    if (isVectorish(x)) {
        // Shift args down 1
        [w, h, r] = [y, w, h];
        ({x, y} = x);
    }
    if (isVectorish(w)) {
        r = h;
        ({x: w, y: h} = w);
    }
    // x = 0, y = 0, w = 10, h = w, r = 0
    x = (_x2 = x) !== null && _x2 !== void 0 ? _x2 : 0;
    y = (_y2 = y) !== null && _y2 !== void 0 ? _y2 : 0;
    w = (_w = w) !== null && _w !== void 0 ? _w : 10;
    h = (_h = h) !== null && _h !== void 0 ? _h : w;
    r = (_r = r) !== null && _r !== void 0 ? _r : 0;
    if (r > 0) {
        moveTo(x + r, y);
        arcTo(x + w, y, x + w, y + h, r);
        arcTo(x + w, y + h, x, y + h, r);
        arcTo(x, y + h, x, y, r);
        arcTo(x, y, x + w, y, r);
        closePath();
    } else {
        ctx.rect(x, y, w, h);
    }
}


function arcTo(x1 = 0, y1 = 0, x2 = 0, y2 = 0, radius = 50) {
    ctx.arcTo(x1, y1, x2, y2, radius);
}

function isPreviewEmbed() {
    return location.href.includes('/fullcpgrid/');
}

function random(low = 1, high = null) {
    if (Array.isArray(low)) {
        return low[floor(Math.random() * low.length)];
    }
    if (high === null) {
        return Math.random() * low;
    }
    return Math.random() * (high - low) + low;
}

function map(n, a, b, c, d) {
    return (n - a) * (d - c) / (b - a) + c;
}

function constrain(n, mn, mx) {
    return max(mn, min(mx, n));
}

function lerp(start, stop, amt = 0.5) {
    if (typeof start !== 'number') {
        return Vector.lerp(start, stop, amt);
    }
    return amt * (stop - start) + start;
}

function _distSq(x1, y1, x2, y2) {
    let _x = x2 - x1;
    let _y = y2 - y1;
    return _x * _x + _y * _y;
}

function distSq(x1, y1, x2, y2) {
    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
        return 0;
    } else if (typeof x1 === 'number') {
        if (x1 === x1) {
            return _distSq(x1, y1, x2, y2);
        }
        return 0;
    } else if ('x' in x1) {
        return _distSq(x1.x, x1.y, y1.x, y1.y);
    }
    return 0;
}

function dist(x1, y1, x2, y2) {
    let d = distSq(x1, y1, x2, y2);
    if (d === 0) {
        return 0;
    }
    return sqrt(d);
}

function cos(input, mult = 1, add = 0) {
    return Math.cos(input % TAU) * mult;
}

function sin(input, mult = 1, add = 0) {
    return Math.sin(input % TAU) * mult + add;
}

let _warning_createVector = false;

function createVector(x, y, z) {
    if (!_warning_createVector) {
        _warning_createVector = true;
        console.warn('[Canvas Warning] Hey, stop using createVector');
    }
    return new Vector(x, y, z);
}

class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Swizzlers
    static center() {
        return new Vector(width_half, height_half);
    }

    static lerp(start, stop, amt = 0.5, apply = false) {
        let amtX = amt;
        let amtY = amt;
        let amtZ = amt;
        if (isVectorish(amt)) ({x: amtX, y: amtY, z: amtZ} = amt);
        const x = start.x === stop.x ? start.x : lerp(start.x, stop.x, amtX);
        const y = start.y === stop.y ? start.y : lerp(start.y, stop.y, amtY);
        const z = start.z === undefined ? stop.z === undefined ? 0 : stop.z : start.z === stop.z ? start.z : lerp(start.z, stop.z, amtZ);
        if (apply) {
            return start.set(x, y, z);
        }
        return new Vector(x, y, z);
    }

    toString() {
        let {x, y, z} = this;
        return `{ x: ${x}, y: ${y}, z: ${z} }`;
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }


    set(x = this.x, y = this.y, z = this.z) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            return this;
        }
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    add(x = 0, y = undefined, z = undefined) {
        if (y === undefined) {
            y = x;
            z = x;
        } else if (z === undefined) {
            z = 0;
        }
        if (x instanceof Vector) {
            this.x += x.x;
            this.y += x.y;
            this.z += x.z;
            return this;
        }
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    sub(x = 0, y = undefined, z = undefined) {
        if (y === undefined) {
            y = x;
            z = x;
        } else if (z === undefined) {
            z = 0;
        }
        if (x instanceof Vector) {
            this.x -= x.x;
            this.y -= x.y;
            this.z -= x.z;
            return this;
        }
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }

    mult(x = 1, y = x, z = x) {
        if (x instanceof Vector) {
            this.x *= x.x;
            this.y *= x.y;
            this.z *= x.z;
            return this;
        }
        this.x *= x;
        this.y *= y;
        this.z *= z;
        return this;
    }

    div(x = 1, y = x, z = x) {
        if (x instanceof Vector) {
            this.x /= x.x;
            this.y /= x.y;
            this.z /= x.z;
            return this;
        }
        this.x /= x;
        this.y /= y;
        this.z /= z;
        return this;
    }

    max(mX = this.x, mY = this.y, mZ = this.z) {
        if (mX instanceof Vector) {
            this.x = max(this.x, mX.x);
            this.y = max(this.y, mX.y);
            this.z = max(this.z, mX.z);
            return this;
        }
        this.x = max(this.x, mX);
        this.y = max(this.y, mY);
        this.z = max(this.z, mZ);
        return this;
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    mag() {
        return Math.sqrt(this.magSq());
        // return hypot(this.x, this.y);
    }

    dist(x, y) {
        if (x instanceof Vector) {
            return x.copy().sub(this).mag();
        } else if (typeof x === 'object' && 'x' in x) {
            ({x, y} = x);
        }
        return dist(this.x, this.y, x, y);
    }

    lerp(stop, amt) {
        return Vector.lerp(this, stop, amt, true);
    }

    floor() {
        this.x = floor(this.x);
        this.y = floor(this.y);
        this.z = floor(this.z);
        return this;
    }

}

function linearTween /* simple linear tweening    */(t = 0.5, b = 0, c = 1, d = 1) {
    return c * t / d + b;
}

function easeInQuad /* quadratic   easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    return c * t * t + b;
}

function easeOutQuad /* quadratic   easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    return -c * t * (t - 2) + b;
}

function easeInOutQuad /* quadratic   easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d * 0.5;
    if (t < 1) return c * 0.5 * t * t + b;
    t--;
    return -c * 0.5 * (t * (t - 2) - 1) + b;
}

function easeInCubic /* cubic       easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    return c * t * t * t + b;
}

function easeOutCubic /* cubic       easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

function easeInOutCubic /* cubic       easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d * 0.5;
    if (t < 1) return c * 0.5 * t * t * t + b;
    t -= 2;
    return c * 0.5 * (t * t * t + 2) + b;
}

function easeInQuart /* quartic     easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    return c * t * t * t * t + b;
}

function easeOutQuart /* quartic     easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
}

function easeInOutQuart /* quartic     easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d * 0.5;
    if (t < 1) return c * 0.5 * t * t * t * t + b;
    t -= 2;
    return -c * 0.5 * (t * t * t * t - 2) + b;
}

function easeInQuint /* quintic     easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    return c * t * t * t * t * t + b;
}

function easeOutQuint /* quintic     easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    t--;
    return c * (t * t * t * t * t + 1) + b;
}

function easeInOutQuint /* quintic     easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d * 0.5;
    if (t < 1) return c * 0.5 * t * t * t * t * t + b;
    t -= 2;
    return c * 0.5 * (t * t * t * t * t + 2) + b;
}

function easeInSine /* sinusoidal  easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    return -c * cos(t / d * HALF_PI) + c + b;
}

function easeOutSine /* sinusoidal  easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    return c * sin(t / d * HALF_PI) + b;
}

function easeInOutSine /* sinusoidal  easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    return -c * 0.5 * (cos(PI * t / d) - 1) + b;
}

function easeInExpo /* exponential easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    return c * pow(2, 10 * (t / d - 1)) + b;
}

function easeOutExpo /* exponential easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    return c * (-pow(2, -10 * t / d) + 1) + b;
}

function easeInOutExpo /* exponential easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d * 0.5;
    if (t < 1) return c * 0.5 * pow(2, 10 * (t - 1)) + b;
    t--;
    return c * 0.5 * (-pow(2, -10 * t) + 2) + b;
}

function easeInCirc /* circular    easing in     */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    return -c * (sqrt(1 - t * t) - 1) + b;
}

function easeOutCirc /* circular    easing out    */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d;
    t--;
    return c * sqrt(1 - t * t) + b;
}

function easeInOutCirc /* circular    easing in/out */(t = 0.5, b = 0, c = 1, d = 1) {
    t /= d * 0.5;
    if (t < 1) return -c * 0.5 * (sqrt(1 - t * t) - 1) + b;
    t -= 2;
    return c * 0.5 * (sqrt(1 - t * t) + 1) + b;
}

const ease = {
    in: {
        linear: linearTween,
        quad: easeInQuad,
        cubic: easeInCubic,
        quart: easeInQuart,
        quint: easeInQuint,
        sine: easeInSine,
        expo: easeInExpo,
        circ: easeInCirc
    },
    out: {
        linear: linearTween,
        quad: easeOutQuad,
        cubic: easeOutCubic,
        quart: easeOutQuart,
        quint: easeOutQuint,
        sine: easeOutSine,
        expo: easeOutExpo,
        circ: easeOutCirc
    },
    inOut: {
        linear: linearTween,
        quad: easeInOutQuad,
        cubic: easeInOutCubic,
        quart: easeInOutQuart,
        quint: easeInOutQuint,
        sine: easeInOutSine,
        expo: easeInOutExpo,
        circ: easeInOutCirc
    },
    linear: Object.assign(linearTween,
        {in: linearTween, out: linearTween, inOut: linearTween}),
    quad: {in: easeInQuad, out: easeOutQuad, inOut: easeInOutQuad},
    cubic: {in: easeInCubic, out: easeOutCubic, inOut: easeInOutCubic},
    quart: {in: easeInQuart, out: easeOutQuart, inOut: easeInOutQuart},
    quint: {in: easeInQuint, out: easeOutQuint, inOut: easeInOutQuint},
    sine: {in: easeInSine, out: easeOutSine, inOut: easeInOutSine},
    expo: {in: easeInExpo, out: easeOutExpo, inOut: easeInOutExpo},
    circ: {in: easeInCirc, out: easeOutCirc, inOut: easeInOutCirc}
};

function isFontDefault() {
    return ctx.font === '10px sans-serif';
}

function font(fontStr, fallbackIfDefault) {
    if (fontStr !== undefined) {
        ctx.font = fontStr;
        if (fallbackIfDefault !== undefined && isFontDefault()) {
            ctx.font = fallbackIfDefault;
        }
    }
    return ctx.font;
}

// Where the game will be
let game;

let options = {
    optionsMenu: document.getElementById('optionsChild'),
    boardSizeX: document.getElementById('board-size-x'),
    boardSizeY: document.getElementById('board-size-y'),
    mineCount: document.getElementById('mine-count'),
    setupGame: document.getElementById('setup-game'),
    custom: document.getElementById('custom'),
    easy: document.getElementById('easy'),
    medium: document.getElementById('medium'),
    hard: document.getElementById('hard'),
    setupCustom: document.getElementById('ifCustom')
};


function zoom(e) {
    let zoomDir = -sign(e.deltaY);
    if (e.demo) {
        zoomDir *= 0.1;
    }
    game.zoomLevel = constrain(game.zoomLevel + zoomDir, 1, game.maxZoomLevels);
}

// Drawing init function
function setup() {
    options.setupGame.addEventListener('click', () => settingUpLevel(LEVEL.CUSTOM));
    options.easy.addEventListener('click', () => settingUpLevel(LEVEL.EASY));
    options.medium.addEventListener('click', () => settingUpLevel(LEVEL.MEDIUM));
    options.hard.addEventListener('click', () => settingUpLevel(LEVEL.HARD));
    options.custom.addEventListener('click', () =>
        options.optionsMenu.appendChild(options.setupCustom));

    // Create a game instance
    game = new Game();
    // Setup the mouse event listeners
    window.addEventListener('click', e => {
        if (e.button !== 0) return; else if (e.target.id === 'canvas') {
            game.click(e);
        } else if (e.target.id === 'options' || e.target.id === 'title') {
            document.getElementById('options').classList.toggle('open');
        }
    });
    window.addEventListener('contextmenu', e => {
        if (e.target.id === 'canvas') {
            // Prevent the context menu from coming up for flagging cells
            e.preventDefault();
            // Tell the game we clicked
            game.click(e);
        }
    });
    // Setup the keyboard event listener
    window.addEventListener('keypress', e => {
        // Reset the game on space bar pressed
        if (e.key === ' ') {
            game.reset();
        }
    });
    // Setup the mouse wheel event
    window.addEventListener('wheel', zoom);

    // Run demo
    if (isPreviewEmbed()) {
        // Zoom in
        zoom({deltaY: -1, demo: true});
        // Mouse over and click a random cell to start the game
        mousePos.set(game.cellToMousePos(random(game.cells)));
        game.click();
        // Find all open cells
        game.cells.filter(n => n.mineCount === 0).map((n) =>
            // Include the original in a new array
            [n].concat(
                // Get their neighbors
                n.getNeighbors()
                    // Limit to open cells
                    .filter(n => n.mineCount === 0)))



            // Only keep them if there's 8 or 9 open cells
            .filter(n => n.length > 7)
            // Loop over and click the
            .forEach((n) =>
                n[0].click().forEach(c => {
                    // Uncover for the animation
                    c.covered = false;
                    c.uncoveredAt = performance.now() + c.pos.dist(n[n.length - 1].pos) / SQRT2 * 100;
                }));

        // Also click on some random ones
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                mousePos.set(game.cellToMousePos(random(game.cells)));
                game.click();
            }, (i + 2) * 250);
        }
    }
}

// The draw function, called with requestAnimationFrame
// Number e = performance.now()
function draw(e) {
    // Call the game's update and draw function
    game.update().draw(e);
}

// The Game class
class Game {
    // Game init
    constructor() {
        // The current state of the game.
        // 0 = waiting for first input, this decides when the game calls pickMines
        // 1 = now playing the game
        // 2 = mine exploded
        // 3 = no non-mine cells left
        this.state = 0;
        // Cells in rows
        this.board = [];
        // All cells
        this.cells = [];
        // The x/y size of the board
        if ('gameBoardSize' in window) {
            this.boardSize = createVector(window.gameBoardSize.x, window.gameBoardSize.y);
        } else {
            this.boardSize = createVector(LEVEL.EASY.x, LEVEL.EASY.y);
        }
        // The px location of the top left-hand corner of the board
        this.drawOffset = createVector(0, 0);
        // The amount of mines to pick
        if ('gameMineCount' in window) {
            this.mineCount = window.gameMineCount;
        } else {
            this.mineCount = LEVEL.EASY.mC;
        }
        // The px size of each cell
        this.cellSize = 10;
        // Has it picked the mines yet?
        this.pickedMines = false;
        // The amount of covered cells minus the mine count (set in reset)
        this.tilesLeft = 0;
        // The amount of cells with flags
        this.flaggedCount = 0;
        // The timestamp when the game entered state 1 (first click)
        this.startedAt = null;
        // The timestamp when the game ended (win or lose)
        this.finishedAt = null;
        // Global zoom level, scroll up to zoom in
        this.zoomLevel = 1;
        this._zoomLevelLerp = 1;
        this.maxZoomLevels = 8;
        this.currentScale = 1;
        this.viewOffset = createVector();
        this._viewOffsetLerp = createVector();
        this.level = LEVEL.EASY;
        // Call the setup function to initialize the board/cells
        this.setup();
    }

    // Used to initialize the game, also whenever settings are changed (in the future)
    setup() {
        // Clear these values
        if (options.optionsMenu.contains(options.setupCustom)) {
            options.optionsMenu.removeChild(options.setupCustom);
        }
        this.board = [];
        this.cells = [];
        // Calculate the mine count
        this.boardSize.max(2, 2);
        // this.mineCount = max(1, floor((this.boardSize.x * this.boardSize.y) * 0.15625));
        this.mineCount = constrain(this.mineCount, 1, this.boardSize.x * this.boardSize.y - 2);
        // Generate cells
        for (let y = 0; y < this.boardSize.y; y++) {
            // Keep them in a 2D array
            let row = [];
            this.board.push(row);
            for (let x = 0; x < this.boardSize.x; x++) {
                let cell = new Cell({x, y}, this);
                // Also keep them in a flat list
                this.cells.push(cell);
                row.push(cell);
            }
        }
        // Jump to reset
        this.reset();
    }

    // Set the game values for a new game
    reset() {
        this.state = 0;
        this.pickedMines = false;
        this.tilesLeft = this.boardSize.x * this.boardSize.y - this.mineCount;
        this.flaggedCount = 0;
        this.finishedAt = null;
        this.zoomLevel = 1;
        // Call reset within each cell
        this.cells.forEach(c => c.reset());
        stopwatch.stop();
        stopwatch.reset();
    }

    // Pick the board's mines
    pickMines() {
        // Don't re-pick the mines until the game is reset
        if (this.pickedMines) {
            return;
        }
        this.pickedMines = true;
        // Get a new array of only covered cells so that they can be removed as it picks
        let cells = this.cells.filter(c => c.covered);
        // For each mine to set
        for (let i = 0; i < this.mineCount; i++) {
            // Get a random index from the cells array
            let index = floor(random(cells.length));
            // Remove that cell from cells
            let cell = cells.splice(index, 1)[0];
            // Set that cell as a mine
            cell.mine = true;
        }
        // For all non-mines, set the mineCount property
        this.cells.filter(c => !c.mine).forEach(c => {
            // Get neighbors, filter for mines
            c.mineCount = this.getCellNeighbors(c).filter(n => n.mine).length;
        });
    }

    // Update px values for drawing and mouse events
    update(e = performance.now()) {
        let {boardSize: {x, y}} = this;
        // Fit to 90% of the width/height
        let max = 0.9;
        // Fit to 80% of the width/height
        let min = 0.8;
        // If you're still playing, stay zoomed in
        let time = game.state < 2 ? 0 : constrain((e - game.finishedAt) * 0.001, 0, 1);
        // When you win or lose, zoom out to give the top text room
        let scl = lerp(max, min, time);
        let w = width * scl;
        let h = height * scl;
        // Calculate the square cellSize that fits within the w/h
        // This will also determine the size when there's more or less x/y in whichever orientation
        // The naive size of x/y
        let w_ = w / x;
        let h_ = h / y;
        // If w is greater than h
        this.cellSize = w > h ?
            // true: If there's more x than y in the boardSize
            // true: Use h_ if w_ times the y count is greater than the total h, else use w_
            // false: Use h_
            x > y ? w_ * y > h ? h_ : w_ : h_ :
            // false: If there's more y than x in the boardSize
            // true: Use w_ if h_ times the x count is greater than the total w, else use h_
            // false: Use w_
            y > x ? h_ * x > w ? w_ : h_ : w_;
        // Multiply the boardSize by half of the negative cellSize
        this.cellSize = Math.min(this.cellSize, 80);
        this.drawOffset.set(x, y).mult(this.cellSize * -0.5)
            // Offset up when still playing
            .sub(0, lerp(this.cellSize * 0.5, 0, time));
        // Allow chaining
        return this;
    }

    draw(e) {
        let zoomLevel = this._zoomLevelLerp = lerp(this._zoomLevelLerp, this.zoomLevel, 0.1);
        scale(this.currentScale = sqrt(zoomLevel));
        this._viewOffsetLerp.set(mousePos.copy().sub(Vector.center())).mult(-map(this.currentScale, 1, sqrt(this.maxZoomLevels), 0, 1));
        translate(this.viewOffset.lerp(this._viewOffsetLerp, 0.3 / (this.currentScale * 0.5)));

        let {cellSize, boardSize} = this;
        // Save the current context state
        push();
        // Translate by the drawOffset in px
        translate(this.drawOffset);
        // Set the text x alignment to center
        textAlign(TEXTALIGN_CENTER);
        // Set the text y alignment to middle
        textBaseline(TEXTBASELINE_MIDDLE);
        // Set the font size and family
        font(`${cellSize * 0.5}px sans-serif`);
        // Set the miter limit to cut down on spikes from text
        miterLimit(2);
        // Determine if currently in play
        let playing = this.state < 2;
        // Get the mouse over cell position
        let cellPos = this.mouseToCellPos();
        // The cell that is moused over
        let mouseCell = playing ? this.getCell(cellPos) : null;
        canvas.style.cursor = !mouseCell || !mouseCell.covered ? 'default' : mouseCell.flagged ? 'cell' : 'pointer';
        // Loop over each cell
        this.cells.forEach(c => {
            // Get the actual x/y of the cell
            let {x, y} = c.pos.copy().mult(cellSize);
            // If this cell is being moused over
            let mousedOver = mouseCell && mouseCell === c;
            // Draw the cell's rectangle
            beginPath();
            rect(x, y, cellSize, cellSize);
            // If the cell is not covered
            if (!c.covered) {
                // The current time through the uncovered animation
                let t = e - c.uncoveredAt;
                // The alpha value of the cell, 0 by default
                let a = 0;
                // If the cell is not a mine
                if (!c.mine) {
                    // If the uncovered animation hasn't started, alpha is 1
                    if (t < 0) {
                        a = 1;
                    }
                    // If the current time is within the animation time, ease from 1 to 0
                    else if (t < 300) {
                        a = ease.quad.inOut(t, 1, -1, 300);
                    }
                    // If the cell has mine neighbors
                    fill(hsl(186, 42, 45))
                    if (c.mineCount) {
                        // Fill the mine count text
                        // Orange if 5 or more
                        if (c.mineCount >= 5) {
                            fillStyle(hsl(25, 80, 50));
                        } else {
                            fillStyle(hsl(0, 0, 100));
                        }
                        fillText(c.mineCount, x + cellSize * 0.5, y + cellSize * 0.5);
                    }
                    // Fill the cell over the text if there's any alpha
                    if (a > 0) {
                        fill(hsl(0, 0, 24, a));
                    }
                }
                // Definitely is a mine
                else {
                    // If the flag animation hasn't started, time is 0
                    if (t < 0) {
                        t = 0;
                    }
                    // If the current time is within the animation time, ease from 0 to 1
                    else if (t < 300) {
                        t = ease.quad.inOut(t, 0, 1, 300);
                    }
                    // If it's flagged, lerp the color from flagged green to bomb red
                    if (c.flagged) {
                        fill(rgb(255, 26, 102, 1));
                    }
                    // Not flagged, lerp from normal grey to bomb red
                    else {
                        fill(rgb(255, 26, 102, 1));
                    }
                }
            }
                // If the cell is covered and flagged
            // Then fill with a lightness based on if the mouse is over this cell
            else if (c.flagged) {
                fill(hsl(140, 100, mousedOver ? 50 : 35));
            } else {
                fill(hsl(186, 42, mousedOver ? 36 : 24));
            }
            // Stroke the cell
            stroke();
        });
        // Get the center of the board on the x-axis
        let centerX = cellSize * boardSize.x * 0.5;
        // If the game is still playing
        if (playing) {
            // The amount of mines left: `24/40 mines left` -- can be negative
            let message = `${
                (this.mineCount - this.flaggedCount).toLocaleString()
            }/${
                this.mineCount.toLocaleString()
            } mines left`;
            // Display the amount of mines at the bottom of the screen
            let y = (boardSize.y + 0.75) * cellSize;
            // White text with a black stroke of 20% of the cellSize
            font('30px sans-serif');
            fillStyle(hsl(0, 0, 100));
            strokeStyle(hsl(0, 0, 0));
            lineWidth(30 * 0.2);
            // Only half of the stroke is seen because the text is filled over the stroke
            strokeText(message, centerX, y);
            fillText(message, centerX, y);
        }
        // Not playing anymore
        else {
            // Determine game win/lose text
            let message = this.state === 2 ? 'YOU LOSE' : 'YOU WIN!';
            // Text above the board
            let y = -cellSize + 20;
            // The current time through the text animation
            let t = e - this.finishedAt;
            // The alpha value of the text, 1 by default
            let a = 1;
            // If the animation hasn't started, alpha is 0
            if (t < 0) {
                a = 0;
            }
            // If the current time is within the animation time, ease from 0 to 1
            else if (t < 800) {
                a = ease.quad.inOut(t, 0, 1, 800);
            }
            // Set the main text font weight, font size, and font family
            font(`35px sans-serif`);
            // White text with a black stroke of 30% of the cellSize
            fillStyle(hsl(0, 0, 100, a));
            strokeStyle(hsl(0, 0, 0, a));
            lineWidth(30 * 0.3);
            // Stroke and fill the main text
            strokeText(message, centerX, y);
            fillText(message, centerX, y);
            // The lower text message
            message = 'Press space bar to reset';
            // Set the lower text font weight, font size, and font family
            font(`25px sans-serif`);
            lineWidth(25 * 0.3 * 0.8);
            // Flip the y offset by 80 percent and then add the total board height
            y = y * -0.8 + cellSize * boardSize.y;
            // Stroke and fill the lower text
            strokeText(message, centerX, y);
            fillText(message, centerX, y);
        }
        // Undo the context changes
        pop();
    }

    // Get a cell (or null) from the board at x/y
    getCell(x, y) {
        // x can be an object with x/y properties
        if (x instanceof Vector || typeof x !== 'number' && 'x' in x) {
            y = x.y;
            x = x.x;
        }
        // x can be an array
        else if (Array.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        // Get the cell or null if it's not there
        return this.board[y] ? this.board[y][x] : null;
    }

    // Get the 3x3 neighbors around a cell
    getCellNeighbors(cell) {
        let {pos} = cell;
        return [
            [pos.x - 1, pos.y - 1], [pos.x, pos.y - 1], [pos.x + 1, pos.y - 1],
            [pos.x - 1, pos.y], [pos.x + 1, pos.y],
            [pos.x - 1, pos.y + 1], [pos.x, pos.y + 1], [pos.x + 1, pos.y + 1]]

            // Get the cells at those positions
            .map(this.getCell, this)
            // Identity filter (remove nulls)
            .filter(n => n);
    }

    // Get the mouse position and transform it into a cell position
    mouseToCellPos() {
        // Make a copy to not change the original Vector
        return mousePos.copy()
            // Subtract the center of the screen since it's being drawn from the center
            .sub(Vector.center())
            // Account for zoom
            .mult(1 / this.currentScale).sub(this.viewOffset)
            // Subtract the draw offset
            .sub(this.drawOffset)
            // Divide by the cell size
            .div(this.cellSize)
            // Round down
            .floor();
    }

    cellToMousePos(cell) {
        return cell.pos.copy().mult(this.cellSize).add(this.drawOffset).add(this.viewOffset).div(1 / this.currentScale).add(Vector.center());
    }

    // When clicked, left or right
    click(e) {
        // If it's not playing, skip the interaction
        if (this.state >= 2) {
            return;
        }
        // If the event (as e) is passed, update the mouse position using the library function
        if (e) {
            updateMouse(e);
        }
        // Get the cell position at the mouse
        let cellPos = this.mouseToCellPos();
        let cell = this.getCell(cellPos);
        // If no cell was found or not covered, skip the interaction
        if (!cell || cell.covered === false) {
            return;
        }
        // If there's an event (as e), check if it's a right-click and if the game is playing in normal mode
        else if (e && e.button === 2 && this.state === 1) {
            if (!stopwatch.isRunning()) {
                stopwatch.start();
                this.startedAt = performance.now();
                console.log("Start time:", this.startedAt);
            }
            // Toggle the flag state using a bitwise XOR op
            cell.flagged ^= 1;
            // Set the current flagged cell count
            this.flaggedCount = this.cells.filter(c => c.flagged).length;
            // Stop here
            return;
        }
        // If the cell is not flagged
        else if (!cell.flagged) {
            if (!stopwatch.isRunning()) {
                stopwatch.start();
                this.startedAt = performance.now();
                console.log("Start time:", this.startedAt);
            }
            // Set the cell as uncovered
            cell.covered = null;
            // Make sure the game is now in full play mode
            this.state = 1;
            // The game can call pickMines in this case
            this.pickMines();
        }
        // Skip the interaction, nothing happened
        else {
            return;
        }
        // Get all cells that are the same mine state, covered, and either not flagged or flagged AND a mine
        let cells = this.cells.filter(c => c.mine === cell.mine && c.covered && (!c.flagged || c.flagged && c.mine));
        // Get the current timestamp
        let now = e && e.timeStamp || performance.now();
        // If the cell if not a mine
        if (!cell.mine) {
            // If the cell and its neighbors are open
            if (!cell.mineCount) {
                // The immediately neighbours around the clicked cell that aren't covered
                cells = cell.click();
            } else {
                // There's only 1 cell to uncover
                cells = [cell];
            }
        }
        // Clicked on a mine
        else {
            // Set the losing state
            this.state = 2;
            // Reset game zoom level
            this.zoomLevel = 1;
            // Set the current timestamp for the animation
            this.finishedAt = now;
            stopwatch.stop();
            // Get the final flagged, non-mine count
            this.flaggedCount = this.cells.filter(c => c.flagged && !c.mine).length;
            console.log("Loosen at:", this.finishedAt);
            if (this.level !== LEVEL.CUSTOM) {
                sendScore('Loose').then(data => data.json()).then(resp => {
                    if (!resp.scoreRecorded) {
                        alert("Server not accepting your score!");
                    }
                })
                    .catch(error => {
                        console.log(error);
                        alert(error);
                    });
            }
        }
        // For each selected cells
        cells.forEach(c => {
            // Remove the cover
            c.covered = false;
            // Set the timestamp to start the animation for this cell
            c.uncoveredAt = now + c.pos.dist(cellPos) / SQRT2 * 100;
        });
        // The count of remaining tiles to uncover minus the mine count
        this.tilesLeft = this.cells.filter(c => c.covered).length - this.mineCount;
        // If there's no tiles left
        if (this.tilesLeft === 0) {
            // Set the winning state
            this.state = 3;
            this.zoomLevel = 1;
            // Set the current timestamp for the animation
            this.finishedAt = now;
            stopwatch.stop();
            console.log("Time taken: ", stopwatch.getTimeTaken());

            if (this.level !== LEVEL.CUSTOM) {
                sendScore('Win').then(data => data.json()).then(resp => {
                    if (!resp.scoreRecorded) {
                        alert("Server not accepting your score!");
                    }
                })
                    .catch(error => {
                        console.log(error);
                        alert(error);
                    });
            }
        }
    }
}


// The Cell class
class Cell {
    // Cell init
    // Takes an object with x/y properties
    // Takes the current game that the cell is attached to
    constructor({x, y}, game) {
        // Sets the position as a vector
        this.pos = createVector(x, y);
        // The current game instance
        this.game = game;
        // Jump to reset
        this.reset();
    }

    // Set the cell values for a new game
    reset() {
        // No mine neighbors are determinable yet
        this.mineCount = 0;
        // Not a mine
        this.mine = false;
        // Covered
        this.covered = true;
        // Not flagged
        this.flagged = false;
        // Having been uncovered yet
        this.uncoveredAt = null;
    }

    getNeighbors() {
        return this.game.getCellNeighbors(this);
    }

    click() {
        // If the cell is covered
        if (this.covered !== false && !this.flagged && !this.mine) {
            this.covered = false;
            if (this.mineCount === 0) {
                let neighbors = this.getNeighbors();
                return neighbors.filter(n => n.covered).reduce((p, n) => p.concat(n.click()), []).concat(this);
            }
            return [this];
        }
        return [];
    }
}

function settingUpLevel(level) {

    if (!game) {
        return;
    }
    document.getElementById('options').classList.toggle('open');
    let bX, bY, mC;
    stopwatch.stop();
    game.level = level;
    if (level === LEVEL.CUSTOM) {
        bX = constrain(parseInt(options.boardSizeX.value), 2, 128);
        bY = constrain(parseInt(options.boardSizeY.value), 2, 128);
        mC = constrain(parseInt(options.mineCount.value), 1, game.boardSize.x * game.boardSize.y - 2);
    } else {
        bX = level.x;
        options.boardSizeX.value = level.x;
        bY = level.y;
        options.boardSizeY.value = level.y;
        mC = level.mC;
        options.mineCount.value = level.mC;
        //.2
    }
    console.log(mC);
    if (bX === bX) {
        game.boardSize.x = bX;
    }
    if (bY === bY) {
        game.boardSize.y = bY;
    }
    if (mC === mC) {
        game.mineCount = mC;
    }
    game.setup();
}

async function sendScore(result) {
    return await fetch("score/collect", {
        method: "POST",
        headers: {
            "charset": "UTF-8",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            result: result,
            time: stopwatch.getTimeTaken(),
            level: game.level
        })
    });
}