const {
    E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2,
    abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32,
    cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max,
    min, pow, /* random, */round, sign, sinh, sqrt, tan, tanh, trunc
} =
    Math;

let _codepenIDRegex = /codepen\.io\/[^/]+\/(?:pen|debug|fullpage|fullembedgrid)\/([^?#]+)/;

// Why not?
const ZERO = 0.0;
const ONE = 1.0;
const TWO = 2.0;
const THREE = 3.0;
const FOUR = 4.0;
const FIVE = 5.0;
const SIX = 6.0;
const SEVEN = 7.0;
const EIGHT = 8.0;
const NINE = 9.0;
const TEN = 10.0;
const ELEVEN = 11.0;
const TWELVE = 12.0;
const SIXTEEN = 16.0;
const THIRTY = 30.0;
const THIRTY_TWO = 32.0;
const SIXTY = 60.0;
const HUNDRED = 100.0;
const THOUSAND = 1000.0;

const HALF = ONE / TWO;
const THIRD = ONE / THREE;
const TWO_THIRDS = THIRD * TWO;
const QUARTER = ONE / FOUR;
const THREE_QUARTER = QUARTER * THREE;
const FIFTH = ONE / FIVE;
const SIXTH = ONE / SIX;
const SEVENTH = ONE / SEVEN;
const EIGHTH = ONE / EIGHT;
const TWELFTH = ONE / TWELVE;
const SIXTEENTH = ONE / SIXTEEN;
const ONE_THIRTIETH = ONE / THIRTY;
const THIRTY_SECONDTH = ONE / THIRTY_TWO;
const SIXTIETH = ONE / SIXTY;

const TENTH = 1e-1;
const HUNDREDTH = 1e-2;
const THOUSANDTH = 1e-3;
const TEN_THOUSANDTH = 1e-4;
const HUNDRED_THOUSANDTH = 1e-5;
const MILLIONTH = 1e-6;
const TEN_MILLIONTH = 1e-7;
const HUNDRED_MILLIONTH = 1e-8;
const BILLIONTH = 1e-9;
const TEN_BILLIONTH = 1e-10;
const HUNDRED_BILLIONTH = 1e-11;

const HALF_PI = PI * HALF;
const THREE_QUARTER_PI = PI * THREE_QUARTER;
const THIRD_PI = PI * THIRD;
const QUARTER_PI = PI * QUARTER;
const FIFTH_PI = PI * FIFTH;
const SIXTH_PI = PI * SIXTH;
const SEVENTH_PI = PI * SEVENTH;
const EIGHTH_PI = PI * EIGHTH;
const TWELFTH_PI = PI * TWELFTH;
const SIXTEENTH_PI = PI * SIXTEENTH;
const THIRTY_SECONDTH_PI = PI * THIRTY_SECONDTH;
const TAU = PI * TWO;
const TWO_TAU = TAU * TWO;
const THREE_QUARTER_TAU = TAU * THREE_QUARTER;
const HALF_TAU = PI;
const THIRD_TAU = TAU * THIRD;
const QUARTER_TAU = HALF_PI;
const FIFTH_TAU = TAU * FIFTH;
const SIXTH_TAU = THIRD_PI;
const EIGHTH_TAU = QUARTER_PI;
const TWELFTH_TAU = SIXTH_PI;
const SIXTEENTH_TAU = EIGHTH_PI;
const THIRTY_SECONDTH_TAU = SIXTEENTH_PI;

const SQRT_3 = sqrt(THREE);
const SQRT_4 = sqrt(FOUR);
const SQRT_5 = sqrt(FIVE);

const PHI = (1 + sqrt(5)) * 0.5;
const GOLDEN_ANGLE = 1 / (PHI * PHI);

const COLOR_BLACK = hsl(0, 0, 0);
const COLOR_WHITE = hsl(0, 0, 100);
const COLOR_RED = hsl(0, 100, 50);
const COLOR_ORANGE = hsl(30, 100, 50);
const COLOR_YELLOW = hsl(60, 100, 50);
const COLOR_GREEN = hsl(120, 100, 50);
const COLOR_CYAN = hsl(180, 100, 50);
const COLOR_BLUE = hsl(240, 100, 50);
const COLOR_PURPLE = hsl(280, 100, 50);
const COLOR_MAGENTA = hsl(300, 100, 50);

const TEXTALIGN_LEFT = 'left';
const TEXTALIGN_CENTER = 'center';
const TEXTALIGN_RIGHT = 'right';
const TEXTBASELINE_TOP = 'top';
const TEXTBASELINE_MIDDLE = 'middle';
const TEXTBASELINE_BOTTOM = 'bottom';

let _defaulCanvasOptions = {
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

let _canvasOptions = {};
let canvas = document.getElementById('canvas');
if (canvas === null) {
    canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    document.body.appendChild(canvas);
}
let ctx = canvas.getContext('2d', {
    desynchronized: window.canvasOptions && window.canvasOptions.desynchronized !== undefined ?
        window.canvasOptions.desynchronized : _defaulCanvasOptions.desynchronized
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
            // https://bugs.chromium.org/p/chromium/issues/detail?id=992954
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
    // return { x, y, winX: e.clientX, winY: e.clientY, id: e.identifier };
}

// let mouseIn = false, mouseDown = false, mouseMove = null, mousePos = { x: 0, y: 0 };
// function updateMouse(e) {
// 	if(e && !e.clientX) {
// 		e = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
// 	}
// 	const { innerWidth: width, innerHeight: height } = window;
// 	uniforms.mouse.value.set(e.clientX / width, 1 - e.clientY / height);
// }

// [
// 	[ 'mouseenter', e => mouseIn = true ],
// 	[ 'mouseleave', e => (mouseIn = false, mouseDown = false) ],
// 	[ 'mousemove', e => (mouseIn = true, mouseMove = e.timeStamp) ],
// 	[ 'mousedown', e => (mouseIn = true, mouseDown = true) ],
// 	[ 'mouseup', e => mouseDown = false ],
// 	[ 'touchstart', e => mouseIn = true ],
// 	[ 'touchend', e => (mouseIn = false, mouseDown = false) ],
// 	[ 'touchcancel', e => (mouseIn = false, mouseDown = false) ],
// 	[ 'touchmove', e => (mouseIn = true, mouseMove = e.timeStamp) ]
// ].forEach(([ eventName, cb ]) => document.body.addEventListener(eventName, e => {
// 	updateMouse(e);
// 	cb(e);
// }));

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
        _defaulCanvasOptions,
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
    // beginPath();
    // rect(width_half - 20, height_half - 20, 120, 30);
    // fill(hsl(0, 0, 0));
    // fillStyle(hsl(0, 0, 100));
    // font('24px monospace');
    // fillText(canvasFrameRate.toFixed(2), width_half, height_half);
    _anim = requestAnimationFrame(_draw);
}

function _resizeCanvas(specificCanvas) {
    width = canvas.width = _canvasOptions.width !== null ? _canvasOptions.width : window.innerWidth;
    height = canvas.height = _canvasOptions.height !== null ? _canvasOptions.height : window.innerHeight;
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

function background(a) {
    push();
    if (typeof a !== 'number') {
        fillStyle(a);
    }
    if (_canvasOptions.centered && _canvasCurrentlyCentered) {
        ctx.fillRect(-width_half, -height_half, width, height);
    } else {
        ctx.fillRect(0, 0, width, height);
    }
    pop();
}

function globalAlpha(alpha = ctx.globalAlpha) {
    return ctx.globalAlpha = alpha;
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

// "butt" || "round" || "square";
function lineCap(style = 'butt') {
    ctx.lineCap = style;
}

// "bevel" || "round" || "miter"
function lineJoin(style) {
    ctx.lineJoin = style;
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

function lerpRGB(...args) {
    let r1 = 255;
    let b1 = 255;
    let g1 = 255;
    let a1 = 1;
    let r2 = 0;
    let g2 = 0;
    let b2 = 0;
    let a2 = 1;
    let t = 0.5;
    if (args.length === 3) {
        if (Array.isArray(args[0]) && Array.isArray(args[1])) {
            return lerpRGB(...args[0], ...args[1], args[2]);
        }
        [
            {r: r1 = 255, b: b1 = 255, g: g1 = 255, a: a1 = 1},
            {r: r2 = 0, b: b2 = 0, g: g2 = 0, a: a2 = 1},
            t] =
            args;
    } else if (args.length === 7) {
        [
            r1, g1, b1,
            r2, g2, b2,
            t] =
            args;
    } else if (args.length === 9) {
        [
            r1, g1, b1, a1,
            r2, g2, b2, a2,
            t] =
            args;
    } else if (args.length === 2 && Array.isArray(args[0])) {
        if (args[0].length === 2) {
            return lerpRGB(...args[0], args[1]);
        }
        // TODO: Allow (possibly weighted) lerping between n-count RGBs at specified positions
    } else {
        return {r: 127.5, g: 127.5, b: 127.5, a: 1};
    }
    let r = lerp(r1, r2, t);
    let g = lerp(g1, g2, t);
    let b = lerp(b1, b2, t);
    let a = lerp(a1, a2, t);
    return {r, g, b, a};
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

function parseHSL(input) {
    if (typeof input !== 'string') {
        return input;
    }
    let result = input.match(/hsla?\(([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%\s*[/,]?\s*([\d.]*)?\)/);
    if (result) {
        let [i, h, s, l, a] = result;
        return {input, h, s, l, a};
    }
    return null;
}

function setHueHSL(input, val) {
    if (val === undefined) return input;
    let p = parseHSL(input);
    p.h = val;
    return hsl(p);
}

function rotateHSL(input, amt = 90) {
    if (amt === 0) return input;
    let p = parseHSL(input);
    p.h += amt;
    return hsl(p);
}

function saturateHSL(input, amt = 0.1) {
    if (amt === 0) return input;
    let p = parseHSL(input);
    p.s *= 1 + amt;
    return hsl(p);
}

function lightenHSL(input, amt = 0.1) {
    if (amt === 0) return input;
    let p = parseHSL(input);
    p.l *= 1 + amt;
    return hsl(p);
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

function clip(...args) {
    ctx.clip(...args);
}

function createLinearGradient(x1 = -100, y1 = -100, x2 = 100, y2 = 100, stops = []) {
    // Vector, Vector [stops]
    if (typeof x1 !== 'number' && typeof y1 !== 'number') {
        stops = x2;
        ({x: x2, y: y2} = y1);
        ({x: x1, y: y1} = x1);
    }
    // Vector, number, number, [stops]
    else if (typeof x1 !== 'number' && typeof y1 === 'number' && typeof x2 === 'number') {
        stops = y2;
        [x2, y2] = [y1, x2];
        ({x: x1, y: y1} = x1);
    }
    // Number, number, Vector, [stops]
    else if (typeof x1 === 'number' && typeof y1 === 'number' && typeof x2 !== 'number') {
        stops = y2;
        ({x: x2, y: y2} = x2);
    }
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    if (stops && Array.isArray(stops) && stops.length) {
        stops.forEach(stop => {
            // offset: number, color: string
            try {
                if (Array.isArray(stop)) {
                    grad.addColorStop(stop[0], stop[1]);
                }
                // { offset: number, color: string }
                else if (stop.offset && stop.color) {
                    grad.addColorStop(stop.offset, stop.color);
                }
            } catch (err) {
                console.error(err);
                console.error(stop);
            }
        });
    }
    return grad;
}

function createRadialGradient(x1 = 0, y1 = 0, r1 = 0, x2 = 0, y2 = 0, r2 = 200) {
    return ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
}

function createPattern(image, repetition = null) {
    return ctx.createPattern(image, repetition);
}

/*
void ctx.drawImage(image, dx, dy);
void ctx.drawImage(image, dx, dy, dWidth, dHeight);
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
*/
function drawImage(img, ...inputArgs) {
    const finalArgs = [];
    if (inputArgs.length === 0) {
        finalArgs.push(0, 0);
    } else {
        for (let i = 0; i < inputArgs.length; i += 2) {
            const result = _resolveVectorArgs(...inputArgs.slice(i, i + 2));
            finalArgs.push(...result);
        }
    }
    if (img) {
        if (img instanceof AlcaImage) {
            img = img.image;
        }
    }
    if (img) {
        ctx.drawImage(img, ...finalArgs);
    }
}

function strokeText(str = 'Hello world', ...pos) {
    const [x = 0, y = 0] = _resolveVectorArgs(...pos);
    ctx.strokeText(str, x, y);
}

function fillText(str = 'Hello world', ...pos) {
    const [x = 0, y = 0] = _resolveVectorArgs(...pos);
    ctx.fillText(str, x, y);
}

function strokeFillText(str = 'Hello world', ...pos) {
    const [x = 0, y = 0] = _resolveVectorArgs(...pos);
    strokeText(str, x, y);
    fillText(str, x, y);
}

function fillStrokeText(str = 'Hello world', ...pos) {
    const [x = 0, y = 0] = _resolveVectorArgs(...pos);
    fillText(str, x, y);
    strokeText(str, x, y);
}

function measureText(text, fontSettings, backupFontSettings) {
    const hasFontSettings = fontSettings !== undefined;
    if (hasFontSettings) {
        push();
        font(fontSettings, backupFontSettings);
    }
    const measure = ctx.measureText(text);
    if (hasFontSettings) {
        pop();
    }
    return measure;
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

function resetTransform() {
    ctx.resetTransform();
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

function rotate(rot, offsetX, offsetY) {
    rot = rot % TAU;
    if (offsetX === undefined) {
        ctx.rotate(rot);
    } else if (typeof offsetX !== 'number') {
        if ('x' in offsetX) {
            ctx.translate(offsetX.x, offsetX.y);
            ctx.rotate(rot);
            ctx.translate(-offsetX.x, -offsetX.y);
        }
    } else {
        ctx.translate(offsetX, offsetY);
        ctx.rotate(rot);
        ctx.translate(-offsetX, -offsetY);
    }
}

function scale(x = 1, y = x) {
    ctx.scale(x, y);
}

function shearX(rad) {
    ctx.transform(1, 0, tan(rad), 1, 0, 0);
}

function shearY(rad) {
    ctx.transform(1, tan(rad), 0, 1, 0, 0);
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

const compOper = {
    default: 'source-over', sourceOver: 'source-over', sourceIn: 'source-in',
    sourceOut: 'source-out', sourceAtop: 'source-atop', destinationOver: 'destination-over',
    destinationIn: 'destination-in', destinationOut: 'destination-out', destinationAtop: 'destination-atop',
    lighter: 'lighter', copy: 'copy', xor: 'xor',
    multiply: 'multiply', screen: 'screen', overlay: 'overlay',
    darken: 'darken', lighten: 'lighten', colorDodge: 'color-dodge',
    colorBurn: 'color-burn', hardLight: 'hard-light', softLight: 'soft-light',
    difference: 'difference', exclusion: 'exclusion', hue: 'hue',
    saturation: 'saturation', color: 'color', luminosity: 'luminosity',
    source: {
        over: 'source-over', in: 'source-in', out: 'source-out',
        atop: 'source-atop'
    },

    destination: {
        over: 'destination-over', in: 'destination-in', out: 'destination-out',
        atop: 'destination-atop'
    },

    light: {
        hard: 'hard-light', soft: 'soft-light'
    }
};


function compositeOperation(type = compOper.default) {// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    ctx.globalCompositeOperation = type;
}

// const filters = [
// 		[ 'url', [ 'url' ] ],
// 		[ 'blur', [ 'length' ] ],
// 		[ 'brightness', [ 'percentage' ] ],
// 		[ 'contrast', [ 'percentage' ] ]
// 	];

function filter(filterFuncs = 'none') {
    ctx.filter = filterFuncs || 'none';
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

function lineTo(x, y) {
    if (typeof x === 'number') {
        ctx.lineTo(x, y);
    } else if (isVectorish(x)) {
        ctx.lineTo(x.x, x.y);
    }
}

function quadraticCurveTo(cpX, cpY, x, y) {
    // ctx.quadraticCurveTo(cpX, cpY, x, y);
    let a = [];
    let b = [];
    if (typeof cpX === 'number') {
        a = [cpX, cpY];
        if (typeof x === 'number') {
            b = [x, y];
        } else if ('x' in x) {
            b = x.xy;
        }
    } else if ('x' in cpX) {
        a = cpX.xy;
        if (typeof cpY === 'number') {
            b = [cpY, x];
        } else if ('x' in cpY) {
            b = cpY.xy;
        }
    }
    ctx.quadraticCurveTo(a[0], a[1], b[0], b[1]);
}

function bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y) {
    let a = [];
    let b = [];
    let c = [];
    if (typeof cp1X === 'number') {
        a = [cp1X, cp1Y];
        if (typeof cp2X === 'number') {
            b = [cp2X, cp2Y];
            if (typeof x === 'number') {
                c = [x, y];
            } else if ('x' in x) {
                c = x.xy;
            }
        } else if ('x' in cp2X) {
            b = cp2X.xy;
            if (typeof cp2Y === 'number') {
                c = [cp2Y, x];
            } else if ('x' in cp2Y) {
                c = cp2Y.xy;
            }
        }
    } else if ('x' in cp1X) {
        a = cp1X.xy;
        if (typeof cp1Y === 'number') {
            b = [cp1Y, cp2X];
            if (typeof cp2Y === 'number') {
                c = [cp2Y, x];
            } else if ('x' in cp2Y) {
                c = cp2Y.xy;
            }
        } else if ('x' in cp1Y) {
            b = cp1Y.xy;
            if (typeof cp2X === 'number') {
                c = [cp2X, cp2Y];
            } else if ('x' in cp2X) {
                c = cp2X.xy;
            }
        }
    }
    ctx.bezierCurveTo(a[0], a[1], b[0], b[1], c[0], c[1]);
}

function closePath() {
    ctx.closePath();
}

function point(x = 0, y = 0, r = 0, g = 0, b = 0, a = 255, doPut_ = true) {
    // let imgData = ctx.createImageData(1, 1);
    // imgData.data[0] = r;
    // imgData.data[1] = g;
    // imgData.data[2] = b;
    // imgData.data[3] = a;
    // if(doPut_) {
    // 	ctx.putImageData(imgData, x, y);
    // }
    // return imgData;
}

function line(x = 0, y = 0, x_ = 0, y_ = 0) {
    if (typeof x === 'number') {
        moveTo(x, y);
        lineTo(x_, y_);
    } else if (isVectorish(x)) {
        moveTo(x);
        lineTo(y, x_);
    }
}

function vertices(...verts) {
    let shouldMoveFirst = false;
    if (verts.length === 0) return; else if (verts.length === 1 && Array.isArray(verts[0])) {
        verts = verts[0];
    } else if (verts.length === 2 && Array.isArray(verts[0]) && typeof verts[1] === 'boolean') {
        shouldMoveFirst = verts[1];
        verts = verts[0];
    }
    for (let i = 0; i < verts.length; i++) {
        let n = verts[i];
        let x = 0;
        let y = 0;
        if (Array.isArray(n)) {
            [x, y] = n;
        } else if (isVectorish(n)) {
            ({x, y} = n);
        }
        if (!shouldMoveFirst || i !== 0) {
            lineTo(x, y);
        } else {
            moveTo(x, y);
        }
    }
}

function rect(x, y, w, h, r) {
    var _x2, _y2, _w, _h, _r;
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

function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    var _x3, _y3, _radius, _startAngle, _endAngle, _anticlockwise;
    if (isVectorish(x)) {
        // Shift args down 1
        [radius, startAngle, endAngle, anticlockwise] = [y, radius, startAngle, endAngle];
        ({x, y} = x);
    }
    // x = 0, y = 0, radius = 50, startAngle = 0, endAngle = Math.PI * 2, anticlockwise = false
    x = (_x3 = x) !== null && _x3 !== void 0 ? _x3 : 0;
    y = (_y3 = y) !== null && _y3 !== void 0 ? _y3 : 0;
    radius = (_radius = radius) !== null && _radius !== void 0 ? _radius : 50;
    startAngle = (_startAngle = startAngle) !== null && _startAngle !== void 0 ? _startAngle : 0;
    endAngle = (_endAngle = endAngle) !== null && _endAngle !== void 0 ? _endAngle : TAU;
    anticlockwise = (_anticlockwise = anticlockwise) !== null && _anticlockwise !== void 0 ? _anticlockwise : false;
    if (radius < 0) radius = 0;
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
}

function arcTo(x1 = 0, y1 = 0, x2 = 0, y2 = 0, radius = 50) {
    ctx.arcTo(x1, y1, x2, y2, radius);
}

// function circle(x = 0, y = undefined, rX = 20, rY = undefined) {
function circle(x, y, rX, rY) {
    var _x4, _y4, _rX;
    // if(typeof x !== 'number' && 'x' in x) {
    // 	if(y !== undefined) {
    // 		rX = y;
    // 	}
    // 	y = x.y;
    // 	x = x.x;
    // }
    // else if(y === undefined) {
    // 	y = 0;
    // }
    // if(typeof rX !== 'number' && 'x' in rX) {
    // 	rY = rX.y;
    // 	rX = rX.x;
    // }
    if (isVectorish(x)) {
        [rX, rY] = [y, rX];
        ({x, y} = x);
    }
    if (isVectorish(rX)) {
        ({x: rX, y: rY} = rX);
    }
    x = (_x4 = x) !== null && _x4 !== void 0 ? _x4 : 0;
    y = (_y4 = y) !== null && _y4 !== void 0 ? _y4 : 0;
    rX = (_rX = rX) !== null && _rX !== void 0 ? _rX : 20;
    ctx.moveTo(x + rX, y);
    if (rY !== undefined) {
        ellipse(x, y, rX, rY);
    } else {
        if (rX < 0) rX = 0;
        ctx.arc(x, y, rX, 0, TAU);
    }
}

// function ellipse(x = 0, y = 0, rX = 50, rY = 50, rot = 0, angStart = 0, angEnd = Math.PI * 2, antiCw = false) {
function ellipse(x, y, rX, rY, rot, angStart, angEnd, antiCw) {
    var _x5, _y5, _rX2, _rY, _rot, _angStart, _angEnd, _antiCw;
    if (isVectorish(x)) {
        [rX, rY, rot, angStart, angEnd, antiCw] = [y, rX, rY, rot, angStart, angEnd];
        ({x, y} = x);
    }
    if (isVectorish(rX)) {
        [rot, angStart, angEnd, antiCw] = [rY, rot, angStart, angEnd];
        ({x: rX, y: rY} = rX);
    }
    x = (_x5 = x) !== null && _x5 !== void 0 ? _x5 : 0;
    y = (_y5 = y) !== null && _y5 !== void 0 ? _y5 : 0;
    rX = (_rX2 = rX) !== null && _rX2 !== void 0 ? _rX2 : 50;
    rY = (_rY = rY) !== null && _rY !== void 0 ? _rY : rX;
    rot = (_rot = rot) !== null && _rot !== void 0 ? _rot : 0;
    angStart = (_angStart = angStart) !== null && _angStart !== void 0 ? _angStart : 0;
    angEnd = (_angEnd = angEnd) !== null && _angEnd !== void 0 ? _angEnd : TAU;
    antiCw = (_antiCw = antiCw) !== null && _antiCw !== void 0 ? _antiCw : false;
    if (rX < 0) rX = 0;
    if (rY < 0) rY = 0;
    ctx.ellipse(x, y, rX, rY, rot, angStart, angEnd, antiCw);
}

function regularPolygon(sides, radius = 50, rotation = 0) {
    let circumference = TAU * radius;
    let count = min(sides, circumference);
    for (let i = 0; i < count; i++) {
        let t = i / count * TAU + rotation;
        let x = cos(t) * radius;
        let y = sin(t) * radius;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
}

function genRegularPolygon(sides = 3, radius = 50, rotation = 0) {
    let iSizes = 1 / sides * TAU;
    let data = {
        sides,
        radius,
        rotation,
        points: []
    };

    for (let i = 0; i < sides; i++) {
        let t = i * iSizes + rotation;
        let x = cos(t) * radius;
        let y = sin(t) * radius;
        let point = new Vector(x, y);
        Object.assign(point, {i, t});
        data.points.push(point);
    }
    return data;
}

function getCodePenID() {
    if (_codepenIDRegex.test(window.location.href)) {
        return _codepenIDRegex.exec(window.location.href)[1];
    } else {
        let metas = document.getElementsByTagName('link');
        for (let i = 0; i < metas.length; i++) {
            let m = metas[i];
            if (m.getAttribute('rel') == 'canonical') {
                let id = _codepenIDRegex.exec(m.getAttribute('href'));
                if (id) {
                    return id[1];
                }
            }
        }
    }
}

function isPreviewEmbed() {
    return location.href.includes('/fullcpgrid/');
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.src = url;
    });
}

loadImage.alca = function (urlPart) {
    return loadImage('https://alca.tv/static/' + urlPart);
};

loadImage.alca.pen = function (urlPart) {
    return loadImage.alca('codepen/' + urlPart);
};

loadImage.alca.pen._ = function (urlPart) {
    return loadImage.alca.pen(`pens/${getCodePenID()}/${urlPart}`);
};

function loadVideo(url) {
    return new Promise((resolve, reject) => {
        let vid = document.createElement('video');
        vid.crossOrigin = 'anonymous';
        vid.onloadeddata = () => resolve(vid);
        vid.preload = true;
        vid.muted = true;
        vid.src = url;
        vid.load();
    });
}

loadVideo.alca = function (urlPart) {
    return loadVideo('https://alca.tv/static/' + urlPart);
};

loadVideo.alca.pen = function (urlPart) {
    return loadVideo.alca('codepen/' + urlPart);
};

loadVideo.alca.pen._ = function (urlPart) {
    return loadVideo.alca.pen(`pens/${getCodePenID()}/${urlPart}`);
};

function loadData(url) {
    return fetch(url);
}

loadData.alca = function (urlPart) {
    return loadData('https://alca.tv/static/' + urlPart);
};

function loadText(url) {
    return loadData(url).then(res => res.text());
}

loadText.alca = function (urlPart) {
    return loadText('https://alca.tv/static/' + urlPart);
};

function loadJSON(url) {
    return loadData(url).then(res => res.json());
}

loadJSON.alca = function (urlPart) {
    return loadJSON('https://alca.tv/static/' + urlPart);
};

function getImageData(img, ...args) {
    if (img instanceof Image) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        Object.assign(canvas, {width: img.width, height: img.height});
        ctx.drawImage(img, 0, 0);
        let data;
        if (args.length) {
            data = ctx.getImageData(...args);
        } else {
            data = ctx.getImageData(0, 0, img.width, img.height);
        }
        return Object.assign(data, {canvas, ctx});
    } else {
        return ctx.getImageData(img, ...args);
    }
}

function putImageData(imageData, x, y, sourceX, sourceY, sourceWidth, sourceHeight) {
    var _x6, _y6, _sourceX, _sourceY, _sourceWidth, _sourceHeight;
    if (isVectorish(x)) {
        [sourceX, sourceY, sourceWidth, sourceHeight] = [y, sourceX, sourceY, sourceWidth];
        ({x, y} = x);
    }
    if (isVectorish(sourceX)) {
        [sourceWidth, sourceHeight] = [sourceY, sourceWidth];
        ({x: sourceX, y: sourceY} = sourceX);
    }
    if (isVectorish(sourceWidth)) {
        ({x: sourceWidth, y: sourceHeight} = sourceWidth);
    }
    (_x6 = x) !== null && _x6 !== void 0 ? _x6 : x = 0;
    (_y6 = y) !== null && _y6 !== void 0 ? _y6 : y = 0;
    (_sourceX = sourceX) !== null && _sourceX !== void 0 ? _sourceX : sourceX = 0;
    (_sourceY = sourceY) !== null && _sourceY !== void 0 ? _sourceY : sourceY = 0;
    (_sourceWidth = sourceWidth) !== null && _sourceWidth !== void 0 ? _sourceWidth : sourceWidth = imageData.width;
    (_sourceHeight = sourceHeight) !== null && _sourceHeight !== void 0 ? _sourceHeight : sourceHeight = imageData.height;
    ctx.putImageData(imageData, x, y, sourceX, sourceY, sourceWidth, sourceHeight);
}

function xyToI(x, y, w, h) {
    if (isVectorish(x)) {
        [w, h] = [y, w];
        ({x, y} = x);
    }
    if (w === undefined) w = 1;
    // if(h === undefined) h = Infinity;
    return x + w * y;
}

function iToXY(i, w, h) {
    const x = i % w;
    let y = floor(i / w);
    if (h !== undefined) {
        y %= h;
    }
    return new Vector(x, y);
}

function mapObject(obj, cb) {
    return Object.entries(obj).reduce((p, [key, value]) => {
        p[key] = cb(value, key);
        return p;
    }, {});
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

let _randomGaussianPrevious = false;
let _randomGaussianY2 = 0;

// https://github.com/processing/p5.js/blob/5a46133fdc3e8c42fda1c1888864cf499940d86d/src/math/random.js#L166
// Offset, deviation
function randomGaussian(mean = 0, sd = 1) {
    let y1, x1, x2, w;
    if (_randomGaussianPrevious) {
        y1 = _randomGaussianY2;
        _randomGaussianPrevious = false;
    } else {
        do {
            x1 = random(2) - 1;
            x2 = random(2) - 1;
            w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = sqrt(-2 * log(w) / w);
        y1 = x1 * w;
        _randomGaussianY2 = x2 * w;
        _randomGaussianPrevious = true;
    }
    return y1 * (sd || 1) + mean;
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

function lerpAngle(start, end, amt = 0.5) {
    return atan2(
        (1 - amt) * sin(start) + amt * sin(end),
        (1 - amt) * cos(start) + amt * cos(end));

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
        console.warn('[Alca Canvas Warning] Hey, stop using createVector');
    }
    return new Vector(x, y, z);
}

class AlcaImage {
    constructor({promise, image} = {}) {
        this.image = null;
        this.width = 0;
        this.height = 0;
        this.size = new Vector();
        this.promise = Promise.resolve();
        if (image) {
            this.image = image;
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;
            this.size.set(this.width, this.height);
        }
        if (promise) {
            this.promise = promise.then(img => {
                this.image = img;
                this.width = img.naturalWidth;
                this.height = img.naturalHeight;
                this.size.set(this.width, this.height);
            });
        }
    }

    static load(url) {
        return new AlcaImage({promise: loadImage(url)});
    }
}


class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Swizzlers
    get xy() {
        return [this.x, this.y];
    }

    get yx() {
        return [this.y, this.x];
    }

    get xz() {
        return [this.x, this.z];
    }

    get zx() {
        return [this.z, this.x];
    }

    get yz() {
        return [this.y, this.z];
    }

    get zy() {
        return [this.z, this.y];
    }

    get xyz() {
        return [this.x, this.y, this.z];
    }

    get xzy() {
        return [this.x, this.z, this.y];
    }

    get yxz() {
        return [this.y, this.x, this.z];
    }

    get yzx() {
        return [this.y, this.z, this.x];
    }

    get zyx() {
        return [this.z, this.y, this.x];
    }

    get zxy() {
        return [this.z, this.x, this.y];
    }

    get xyObject() {
        return {x: this.x, y: this.y};
    }

    get xzObject() {
        return {x: this.x, z: this.z};
    }

    get yzObject() {
        return {y: this.y, z: this.z};
    }

    get xyzObject() {
        return {x: this.x, y: this.y, z: this.z};
    }

    get _() {
        return this.copy();
    }

    static center() {
        return new Vector(width_half, height_half);
    }

    static from(v, ...args) {
        if (v === undefined) {
            return new Vector();
        } else if (Array.isArray(v)) {
            return new Vector(...v);
        } else if (typeof v === 'object') {
            return new Vector(v.x, v.y, v.z);
        } else if (typeof v === 'number') {
            return new Vector(v, ...args);
        }
    }

    static fromAngle(angle, mult = 1) {
        return new Vector(cos(angle), sin(angle)).mult(mult);
    }

    static fa(...args) {
        return Vector.fromAngle(...args);
    }

    static random2D(angle = true, mult = 1) {
        let v;
        if (angle === true) {
            v = Vector.fromAngle(random(TAU));
        } else {
            v = new Vector(random(-1, 1), random(-1, 1));
        }
        if (typeof angle === 'number') {
            v.mult(angle);
        } else if (mult !== 1) {
            v.mult(mult);
        }
        return v;
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

    static average(vectors, ...rest) {
        if (rest.length) {
            vectors = [vectors, ...rest];
        }
        return vectors.reduce((p, n) => p.add(n), new Vector()).div(vectors.length);
    }

    toString() {
        let {x, y, z} = this;
        return `{ x: ${x}, y: ${y}, z: ${z} }`;
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    swap(a, b) {
        const temp = this[a];
        this[a] = this[b];
        this[b] = temp;
        return this;
    }

    swapXY() {
        return this.swap('x', 'y');
    }

    swapYZ() {
        return this.swap('y', 'z');
    }

    swapZX() {
        return this.swap('z', 'x');
    }

    swapYX() {
        return this.swapXY();
    }

    swapZY() {
        return this.swapYZ();
    }

    swapXZ() {
        return this.swapZX();
    }

    // Copy [a] to [b]
    copyWithin(a, b) {
        this[b] = a;
        return this;
    }

    copyXY() {
        return this.copyWithin('x', 'y');
    }

    copyYX() {
        return this.copyWithin('y', 'x');
    }

    copyYZ() {
        return this.copyWithin('y', 'z');
    }

    copyZY() {
        return this.copyWithin('z', 'y');
    }

    copyZX() {
        return this.copyWithin('z', 'x');
    }

    copyXZ() {
        return this.copyWithin('x', 'z');
    }

    equals(vec) {
        return this.x === vec.x && this.y === vec.y;
    }

    equals3D(vec = {}) {
        return this.x === vec.x && this.y === vec.y && this.z === vec.z;
    }

    draw() {
        point(this.x, this.y);
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

    setX(x = this.x) {
        if (x instanceof Vector) {
            this.x = x.x;
            return this;
        }
        this.x = x;
        return this;
    }

    setY(y = this.y) {
        if (y instanceof Vector) {
            this.y = y.y;
            return this;
        }
        this.y = y;
        return this;
    }

    setZ(z = this.z) {
        if (z instanceof Vector) {
            this.z = z.z;
            return this;
        }
        this.z = z;
        return this;
    }

    setXY(x = this.x, y = this.y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
            return this;
        }
        this.x = x;
        this.y = y;
        return this;
    }

    setYX(...args) {
        return this.setXY(...args);
    }

    setYZ(y = this.y, z = this.z) {
        if (y instanceof Vector) {
            this.y = y.y;
            this.z = y.z;
            return this;
        }
        this.y = y;
        this.z = z;
        return this;
    }

    setZY(...args) {
        return this.setYZ(...args);
    }

    setXZ(x = this.x, z = this.y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.z = x.z;
            return this;
        }
        this.x = x;
        this.z = z;
        return this;
    }

    setZX(...args) {
        return this.setXZ(...args);
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

    addX(n = 0) {
        if (n instanceof Vector) {
            this.x += n.x;
            return this;
        }
        this.x += n;
        return this;
    }

    addY(n = 0) {
        if (n instanceof Vector) {
            this.y += n.y;
            return this;
        }
        this.y += n;
        return this;
    }

    addZ(n = 0) {
        if (n instanceof Vector) {
            this.z += n.z;
            return this;
        }
        this.z += n;
        return this;
    }

    addXY(x, y = x) {
        return this.addX(x).addY(y);
    }

    addYX(y, x = y) {
        return this.addXY(x, y);
    }

    addYZ(y, z = y) {
        return this.addY(y).addZ(z);
    }

    addZY(z, y = z) {
        return this.addYZ(y, z);
    }

    addZX(z, x = z) {
        return this.addZ(z).addX(x);
    }

    addXZ(x, z = x) {
        return this.addZX(x, z);
    }

    addXYZ(...args) {
        return this.add(...args);
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

    subX(n = 0) {
        if (n instanceof Vector) {
            this.x -= n.x;
            return this;
        }
        this.x -= n;
        return this;
    }

    subY(n = 0) {
        if (n instanceof Vector) {
            this.y -= n.y;
            return this;
        }
        this.y -= n;
        return this;
    }

    subZ(n = 0) {
        if (n instanceof Vector) {
            this.z -= n.z;
            return this;
        }
        this.z -= n;
        return this;
    }

    subXY(x, y = x) {
        return this.subX(x).subY(y);
    }

    subYX(y, x = y) {
        return this.subXY(x, y);
    }

    subYZ(y, z = y) {
        return this.subY(y).subZ(z);
    }

    subZY(z, y = z) {
        return this.subYZ(y, z);
    }

    subZX(z, x = z) {
        return this.subZ(z).subX(x);
    }

    subXZ(x, z = x) {
        return this.subZX(x, z);
    }

    subXYZ(...args) {
        return this.sub(...args);
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

    multX(n = 1) {
        if (n instanceof Vector) {
            this.x *= n.x;
            return this;
        }
        this.x *= n;
        return this;
    }

    multY(n = 1) {
        if (n instanceof Vector) {
            this.y *= n.y;
            return this;
        }
        this.y *= n;
        return this;
    }

    multZ(n = 1) {
        if (n instanceof Vector) {
            this.z *= n.z;
            return this;
        }
        this.z *= n;
        return this;
    }

    multXY(x, y = x) {
        return this.multX(x).multY(y);
    }

    multYX(y, x = y) {
        return this.multXY(x, y);
    }

    multYZ(y, z = y) {
        return this.multY(y).multZ(z);
    }

    multZY(z, y = z) {
        return this.multYZ(y, z);
    }

    multZX(z, x = z) {
        return this.multZ(z).multX(x);
    }

    multXZ(x, z = x) {
        return this.multZX(x, z);
    }

    multXYZ(...args) {
        return this.mult(...args);
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

    divX(n = 1) {
        if (n instanceof Vector) {
            this.x /= n.x;
            return this;
        }
        this.x /= n;
        return this;
    }

    divY(n = 1) {
        if (n instanceof Vector) {
            this.y /= n.y;
            return this;
        }
        this.y /= n;
        return this;
    }

    divZ(n = 1) {
        if (n instanceof Vector) {
            this.z /= n.z;
            return this;
        }
        this.z /= n;
        return this;
    }

    divXY(x, y = x) {
        return this.divX(x).divY(y);
    }

    divYX(y, x = y) {
        return this.divXY(x, y);
    }

    divYZ(y, z = y) {
        return this.divY(y).divZ(z);
    }

    divZY(z, y = z) {
        return this.divYZ(y, z);
    }

    divZX(z, x = z) {
        return this.divZ(z).divX(x);
    }

    divXZ(x, z = x) {
        return this.divZX(x, z);
    }

    divXYZ(...args) {
        return this.div(...args);
    }

    mod(x, y, z) {
        if (x === undefined) return this; else if (x instanceof Vector) {
            this.x %= x.x;
            this.y %= x.y;
            this.z %= x.z;
            return this;
        }
        this.x %= x;
        this.y %= y === undefined ? x : y;
        this.z %= z === undefined ? x : y;
        return this;
    }

    // TODO: modX, modY, modZ

    min(mX = this.x, mY = this.y, mZ = this.z) {
        if (mX instanceof Vector) {
            this.x = min(this.x, mX.x);
            this.y = min(this.y, mX.y);
            this.z = min(this.z, mX.z);
            return this;
        }
        this.x = min(this.x, mX);
        this.y = min(this.y, mY);
        this.z = min(this.z, mZ);
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

    minX(n) {
        this.x = min(this.x, n instanceof Vector ? n.x : n);
        return this;
    }

    minY(n) {
        this.y = min(this.y, n instanceof Vector ? n.y : n);
        return this;
    }

    minZ(n) {
        this.z = min(this.z, n instanceof Vector ? n.z : n);
        return this;
    }

    maxX(n) {
        this.x = max(this.x, n instanceof Vector ? n.x : n);
        return this;
    }

    maxY(n) {
        this.y = max(this.y, n instanceof Vector ? n.y : n);
        return this;
    }

    maxZ(n) {
        this.z = max(this.z, n instanceof Vector ? n.z : n);
        return this;
    }

    heading() {
        return atan2(this.y, this.x);
    }

    rotate(a = 0) {
        // if(a === 0) {
        // 	return this;
        // }
        // let newHeading = this.heading() + a;
        // let mag = this.mag();
        // return this.set(cos(newHeading), sin(newHeading)).mult(mag);
        if (!a) {
            return this;
        }
        const c = cos(a);
        const s = sin(a);
        const {x, y} = this;
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    }

    rotateXY(a) {
        let v = new Vector(this.x, this.y).rotate(a);
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    rotateYZ(a) {
        let v = new Vector(this.y, this.z).rotate(a);
        this.y = v.x;
        this.z = v.y;
        return this;
    }

    rotateZX(a) {
        let v = new Vector(this.z, this.x).rotate(a);
        this.z = v.x;
        this.x = v.y;
        return this;
    }

    rotateYX(a) {
        return this.rotateXY(a);
    }

    rotateZY(a) {
        return this.rotateYZ(a);
    }

    rotateXZ(a) {
        return this.rotateZX(a);
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    magSq3D() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    mag() {
        return Math.sqrt(this.magSq());
        // return hypot(this.x, this.y);
    }

    mag3D() {
        return Math.sqrt(this.magSq3D());
        // return hypot(this.x, this.y);
    }

    normalize(mag = this.mag()) {
        return mag === 0 ? this : this.div(mag);
    }

    normalize3D(mag = this.mag3D()) {
        return mag === 0 ? this : this.div(mag);
    }

    setMag(mag) {
        return this.normalize().mult(mag);
    }

    setMag3D(mag) {
        return this.normalize3D().mult(mag);
    }

    limit(max) {
        const magSq = this.magSq();
        if (magSq > max * max) {
            this.div(sqrt(magSq));
            this.mult(max);
        }
        return this;
    }

    limit3D(max) {
        const magSq = this.magSq3D();
        if (magSq > max * max) {
            this.div(sqrt(magSq));
            this.mult(max);
        }
        return this;
    }

    dot(x = 0, y = 0) {
        if (x instanceof Vector) {
            return this.dot(x.x, x.y);
        }
        return this.x * x + this.y * y;
    }

    dot3D(x = 0, y = 0, z = 0) {
        if (x instanceof Vector) {
            return this.dot(x.x, x.y, x.z);
        }
        return this.x * x + this.y * y + this.z * z;
    }

    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x);

    }

    dist(x, y) {
        if (x instanceof Vector) {
            return x.copy().sub(this).mag();
        } else if (typeof x === 'object' && 'x' in x) {
            ({x, y} = x);
        }
        return dist(this.x, this.y, x, y);
    }

    dist3D(v) {
        return v.copy().sub(this).mag3D();
    }

    lerp(stop, amt) {
        return Vector.lerp(this, stop, amt, true);
    }

    _lerpPart(stop, amt, part) {
        stop = isVectorish(stop) ? stop[part] : stop;
        amt = isVectorish(amt) ? amt[part] : amt;
        this[part] = lerp(this[part], stop, amt);
        return this;
    }

    lerpX(stop, amt) {
        return this._lerpPart(stop, amt, 'x');
    }

    lerpY(stop, amt) {
        return this._lerpPart(stop, amt, 'y');
    }

    lerpZ(stop, amt) {
        return this._lerpPart(stop, amt, 'z');
    }

    lerpXY(stop, amt) {
        return this.lerpX(stop, amt).lerpY(stop, amt);
    }

    lerpYX(stop, amt) {
        return this.lerpXY(stop, amt);
    }

    lerpYZ(stop, amt) {
        return this.lerpY(stop, amt).lerpZ(stop, amt);
    }

    lerpZY(stop, amt) {
        return this.lerpYZ(stop, amt);
    }

    lerpZX(stop, amt) {
        return this.lerpZ(stop, amt).lerpX(stop, amt);
    }

    lerpXZ(stop, amt) {
        return this.lerpZX(stop, amt);
    }

    round() {
        this.x = round(this.x);
        this.y = round(this.y);
        this.z = round(this.z);
        return this;
    }

    floor() {
        this.x = floor(this.x);
        this.y = floor(this.y);
        this.z = floor(this.z);
        return this;
    }

    fastFloor() {
        this.x = ~~this.x;
        this.y = ~~this.y;
        this.z = ~~this.z;
        return this;
    }

    ceil() {
        this.x = ceil(this.x);
        this.y = ceil(this.y);
        this.z = ceil(this.z);
        return this;
    }
}


// Robert Penner - http://gizma.com/easing/
// t: Current time
// b: Start value
// c: Change in value
// d: Duration

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
    linearTween,
    easeInQuad, easeOutQuad, easeInOutQuad,
    easeInCubic, easeOutCubic, easeInOutCubic,
    easeInQuart, easeOutQuart, easeInOutQuart,
    easeInQuint, easeOutQuint, easeInOutQuint,
    easeInSine, easeOutSine, easeInOutSine,
    easeInExpo, easeOutExpo, easeInOutExpo,
    easeInCirc, easeOutCirc, easeInOutCirc,
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


function getTimeArray(timestamp = null) {
    if (timestamp === null) {
        timestamp = new Date();
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        let parsedTimestamp = Date.parse(timestamp);
        if (!isNaN(parsedTimestamp)) {
            timestamp = new Date(parsedTimestamp);
        } else {
            throw new RangeError('Invalid Date');
        }
    } else if (!(timestamp instanceof Date)) {
        throw new TypeError('Unsupported timestamp');
    }
    let arr = [
        timestamp.getHours(),
        timestamp.getMinutes(),
        timestamp.getSeconds(),
        timestamp.getMilliseconds()];

    return arr;
}

function getTimeArrayPadded(...opts) {
    return getTimeArray(...opts).map(n => `0${n}`.slice(-2));
}

function getTimeArraySmooth(...opts) {
    let arr = getTimeArray(...opts);
    let milliseconds = arr[3] / 1000;
    let seconds = (arr[2] + milliseconds) / 60;
    let minutes = (arr[1] + seconds) / 60;
    let hours = ((arr[0] % 12 || 12) + minutes) / 12;
    return [hours, minutes, seconds, milliseconds];
}

function loadWebFont(fontName) {
    if ('WebFont' in window === false) {
        return Promise.reject('WebFont not available. Load using this script: https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js');
    }
    if (fontName === '') {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        let options = {fontactive: resolve};
        let providers = {};
        if (typeof fontName === 'string') {
            providers = {google: {families: [fontName]}};
        } else if (Array.isArray(fontName)) {
            providers = {google: {families: fontName}};
        } else {
            providers = fontName;
        }
        Object.assign(options, providers);
        WebFont.load(options);
    });
}

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

// https://stackoverflow.com/a/40200710/1703756
function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num > 1;
}

function repeatArray(input = [], count = 0) {
    if (count <= 0) return [];
    const arr = [];
    if (Array.isArray(input)) {
        for (let i = 0; i < count; i++) {
            arr.push(...input);
        }
    } else {
        for (let i = 0; i < count; i++) {
            arr.push(input);
        }
    }
    return arr;
}

// Where the game will be
let game;

let options = {
    smoothedMouseTracking: document.getElementById('smoothed-mouse-tracking'),
    boardSizeX: document.getElementById('board-size-x'),
    boardSizeY: document.getElementById('board-size-y'),
    mineCount: document.getElementById('mine-count'),
    setupGame: document.getElementById('setup-game')
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
    options.setupGame.addEventListener('click', () => {
        if (!game) {
            return;
        }
        let bX = constrain(parseInt(options.boardSizeX.value), 2, 128);
        let bY = constrain(parseInt(options.boardSizeY.value), 2, 128);
        let mC = constrain(parseInt(options.mineCount.value), 1, game.boardSize.x * game.boardSize.y - 2);
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
    });

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
            this.boardSize = createVector(16, 16);
        }
        // The px location of the top left-hand corner of the board
        this.drawOffset = createVector(0, 0);
        // The amount of mines to pick
        if ('gameMineCount' in window) {
            this.mineCount = window.gameMineCount;
        } else {
            this.mineCount = this.boardSize.x * this.boardSize.y * 0.15625;
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
        // Call the setup function to initialize the board/cells
        this.setup();
    }

    // Used to initialize the game, also whenever setings are changed (in the future)
    setup() {
        // Clear these values
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
        this.startedAt = null;
        // Call reset within each cell
        this.cells.forEach(c => c.reset());
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
        translate(this.viewOffset.lerp(this._viewOffsetLerp, options.smoothedMouseTracking.checked ? 0.3 / (this.currentScale * 0.5) : 1));

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
                        fill(rgb(lerpRGB(0, 0xFF, 0, 0xFF, 0, 0, t)));
                    }
                    // Not flagged, lerp from normal grey to bomb red
                    else {
                        fill(rgb(lerpRGB(0x3D, 0x3D, 0x3D, 0xFF, 0, 0, t)));
                    }
                }
            }
                // If the cell is covered and flagged
            // Then fill with a lightness based on if the mouse is over this cell
            else if (c.flagged) {
                fill(hsl(120, 100, mousedOver ? 65 : 50));
            } else {
                fill(hsl(0, 0, mousedOver ? 36 : 24));
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
            fillStyle(hsl(0, 0, 100));
            strokeStyle(hsl(0, 0, 0));
            lineWidth(cellSize * 0.2);
            // Only half of the stroke is seen because the text is filled over the stroke
            strokeText(message, centerX, y);
            fillText(message, centerX, y);
        }
        // Not playing anymore
        else {
            // Determine game win/lose text
            let message = this.state === 2 ? 'YOU LOSE' : 'YOU WIN!';
            // Text above the board
            let y = -cellSize;
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
            font(`800 ${cellSize * 1.6 * a}px sans-serif`);
            // White text with a black stroke of 30% of the cellSize
            fillStyle(hsl(0, 0, 100, a));
            strokeStyle(hsl(0, 0, 0, a));
            lineWidth(cellSize * 0.3);
            // Stroke and fill the main text
            strokeText(message, centerX, y);
            fillText(message, centerX, y);
            // The lower text message
            message = 'Press space bar to reset';
            // Set the lower text font weight, font size, and font family
            font(`800 ${cellSize * 0.8 * a}px sans-serif`);
            lineWidth(cellSize * 0.3 * 0.8);
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
            // Toggle the flag state using a bitwise XOR op
            cell.flagged ^= 1;
            // Set the current flagged cell count
            this.flaggedCount = this.cells.filter(c => c.flagged).length;
            // Stop here
            return;
        }
        // If the cell is not flagged
        else if (!cell.flagged) {
            // Set the cell as uncovered
            cell.covered = null;
            // Make sure the game is now in full play mode
            this.state = 1;
            this.startedAt = e;
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
                // The immediately neighbords around the clicked cell that aren't covered
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
            // Get the final flagged, non-mine count
            this.flaggedCount = this.cells.filter(c => c.flagged && !c.mine).length;
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