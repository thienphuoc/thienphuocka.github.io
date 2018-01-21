document.createElement("video");
document.createElement("audio");
document.createElement("track");
var vjs = function(a, b, c) {
        if ("string" === typeof a) {
            0 === a.indexOf("#") && (a = a.slice(1));
            if (vjs.players[a]) return vjs.players[a];
            a = vjs.el(a)
        }
        if (!a || !a.nodeName) throw new TypeError("The element or ID supplied is not valid. (videojs)");
        return a.player || new vjs.Player(a, b, c)
    },
    videojs = window.videojs = vjs;
vjs.CDN_VERSION = "4.7";
vjs.ACCESS_PROTOCOL = "https:" == document.location.protocol ? "https://" : "http://";
vjs.options = {
    techOrder: ["html5", "flash"],
    html5: {},
    flash: {},
    width: 300,
    height: 150,
    defaultVolume: 0,
    playbackRates: [],
    children: {
        mediaLoader: {},
        textTrackDisplay: {},
        loadingSpinner: {},
        controlBar: {}
    },
    language: document.getElementsByTagName("html")[0].getAttribute("lang") || navigator.languages && navigator.languages[0] || navigator.userLanguage || navigator.language || "en",
    languages: {},
    notSupportedMessage: "No compatible source was found for this video."
};
vjs.REM_SWF_URL = "//cdn.reembed.com/player/core141001-0.swf";
vjs.REM_SWF_URL ? videojs.options.flash.swf = vjs.REM_SWF_URL : "GENERATED_CDN_VSN" !== vjs.CDN_VERSION && (videojs.options.flash.swf = vjs.ACCESS_PROTOCOL + "vjs.zencdn.net/" + vjs.CDN_VERSION + "/video-js.swf");
vjs.addLanguage = function(a, b) {
    vjs.options.languages[a] = void 0 !== vjs.options.languages[a] ? vjs.util.mergeOptions(vjs.options.languages[a], b) : b;
    return vjs.options.languages
};
vjs.players = {};
"function" === typeof define && define.amd ? define([], function() {
    return videojs
}) : "object" === typeof exports && "object" === typeof module && (module.exports = videojs);
vjs.CoreObject = vjs.CoreObject = function() {};
vjs.CoreObject.extend = function(a) {
    var b, c;
    a = a || {};
    b = a.init || a.init || this.prototype.init || this.prototype.init || function() {};
    c = function() {
        b.apply(this, arguments)
    };
    c.prototype = vjs.obj.create(this.prototype);
    c.prototype.constructor = c;
    c.extend = vjs.CoreObject.extend;
    c.create = vjs.CoreObject.create;
    for (var d in a) a.hasOwnProperty(d) && (c.prototype[d] = a[d]);
    return c
};
vjs.CoreObject.create = function() {
    var a = vjs.obj.create(this.prototype);
    this.apply(a, arguments);
    return a
};
vjs.on = function(a, b, c) {
    if (!a) return DEBUG && console.log("Tried to set event: " + b + " on null element"), !1;
    if (vjs.obj.isArray(b)) return _handleMultipleEvents(vjs.on, a, b, c);
    var d = vjs.getData(a);
    d.handlers || (d.handlers = {});
    d.handlers[b] || (d.handlers[b] = []);
    c.guid || (c.guid = vjs.guid++);
    d.handlers[b].push(c);
    d.dispatcher || (d.disabled = !1, d.dispatcher = function(b) {
        if (!d.disabled) {
            b = vjs.fixEvent(b);
            var c = d.handlers[b.type];
            if (c)
                for (var c = c.slice(0), g = 0, k = c.length; g < k && !b.isImmediatePropagationStopped(); g++) c[g].call(a,
                    b)
        }
    });
    1 == d.handlers[b].length && (a.addEventListener ? a.addEventListener(b, d.dispatcher, !1) : a.attachEvent && a.attachEvent("on" + b, d.dispatcher))
};
vjs.off = function(a, b, c) {
    if (vjs.hasData(a)) {
        var d = vjs.getData(a);
        if (d.handlers) {
            if (vjs.obj.isArray(b)) return _handleMultipleEvents(vjs.off, a, b, c);
            if (b) {
                var e = d.handlers[b];
                if (e) {
                    if (!c) d.handlers[b] = [];
                    else if (c.guid)
                        for (d = 0; d < e.length; d++) e[d].guid === c.guid && e.splice(d--, 1);
                    vjs.cleanUpEvents(a, b)
                }
            } else
                for (e in d.handlers) b = e, d.handlers[b] = [], vjs.cleanUpEvents(a, b)
        }
    }
};
vjs.cleanUpEvents = function(a, b) {
    var c = vjs.getData(a);
    0 === c.handlers[b].length && (delete c.handlers[b], a.removeEventListener ? a.removeEventListener(b, c.dispatcher, !1) : a.detachEvent && a.detachEvent("on" + b, c.dispatcher));
    vjs.isEmpty(c.handlers) && (delete c.handlers, delete c.dispatcher, delete c.disabled);
    vjs.isEmpty(c) && vjs.removeData(a)
};
vjs.fixEvent = function(a) {
    function b() {
        return !0
    }

    function c() {
        return !1
    }
    if (!a || !a.isPropagationStopped) {
        var d = a || window.event;
        a = {};
        for (var e in d) "layerX" !== e && "layerY" !== e && "keyboardEvent.keyLocation" !== e && ("returnValue" == e && d.preventDefault || (a[e] = d[e]));
        a.target || (a.target = a.srcElement || document);
        "undefined" === typeof a.relatedTarget && (a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement);
        a.preventDefault = function() {
            d.preventDefault && d.preventDefault();
            a.returnValue = !1;
            a.isDefaultPrevented =
                b;
            a.defaultPrevented = !0
        };
        a.isDefaultPrevented = c;
        a.defaultPrevented = !1;
        a.stopPropagation = function() {
            d.stopPropagation && d.stopPropagation();
            a.cancelBubble = !0;
            a.isPropagationStopped = b
        };
        a.isPropagationStopped = c;
        a.stopImmediatePropagation = function() {
            d.stopImmediatePropagation && d.stopImmediatePropagation();
            a.isImmediatePropagationStopped = b;
            a.stopPropagation()
        };
        a.isImmediatePropagationStopped = c;
        if (null != a.clientX) {
            e = document.documentElement;
            var f = document.body;
            a.pageX = a.clientX + (e && e.scrollLeft || f && f.scrollLeft ||
                0) - (e && e.clientLeft || f && f.clientLeft || 0);
            a.pageY = a.clientY + (e && e.scrollTop || f && f.scrollTop || 0) - (e && e.clientTop || f && f.clientTop || 0)
        }
        a.which = a.charCode || a.keyCode;
        null != a.button && (a.button = a.button & 1 ? 0 : a.button & 4 ? 1 : a.button & 2 ? 2 : 0)
    }
    return a
};
vjs.trigger = function(a, b) {
    var c = vjs.hasData(a) ? vjs.getData(a) : {},
        d = a.parentNode || a.ownerDocument;
    "string" === typeof b && (b = {
        type: b,
        target: a
    });
    b = vjs.fixEvent(b);
    c.dispatcher && c.dispatcher.call(a, b);
    if (d && !b.isPropagationStopped() && !1 !== b.bubbles) vjs.trigger(d, b);
    else if (!d && !b.defaultPrevented && (c = vjs.getData(b.target), b.target[b.type])) {
        c.disabled = !0;
        if ("function" === typeof b.target[b.type]) b.target[b.type]();
        c.disabled = !1
    }
    return !b.defaultPrevented
};
vjs.one = function(a, b, c) {
    if (vjs.obj.isArray(b)) return _handleMultipleEvents(vjs.one, a, b, c);
    var d = function() {
        vjs.off(a, b, d);
        c.apply(this, arguments)
    };
    d.guid = c.guid = c.guid || vjs.guid++;
    vjs.on(a, b, d)
};

function _handleMultipleEvents(a, b, c, d) {
    vjs.arr.forEach(c, function(c) {
        a(b, c, d)
    })
}
var hasOwnProp = Object.prototype.hasOwnProperty;
vjs.createEl = function(a, b) {
    var c;
    b = b || {};
    c = document.createElement(a || "div");
    vjs.obj.each(b, function(a, b) {
        -1 !== a.indexOf("aria-") || "role" == a || -1 !== a.toLowerCase().indexOf("allowfullscreen") ? c.setAttribute(a, b) : c[a] = b
    });
    return c
};
vjs.capitalize = function(a) {
    return a.charAt(0).toUpperCase() + a.slice(1)
};
vjs.obj = {};
vjs.obj.create = Object.create || function(a) {
    function b() {}
    b.prototype = a;
    return new b
};
vjs.obj.each = function(a, b, c) {
    for (var d in a) hasOwnProp.call(a, d) && b.call(c || this, d, a[d])
};
vjs.obj.merge = function(a, b) {
    if (!b) return a;
    for (var c in b) hasOwnProp.call(b, c) && (a[c] = b[c]);
    return a
};
vjs.obj.deepMerge = function(a, b) {
    var c, d, e;
    a = vjs.obj.copy(a);
    for (c in b) hasOwnProp.call(b, c) && (d = a[c], e = b[c], vjs.obj.isPlain(d) && vjs.obj.isPlain(e) ? a[c] = vjs.obj.deepMerge(d, e) : a[c] = b[c]);
    return a
};
vjs.obj.copy = function(a) {
    return vjs.obj.merge({}, a)
};
vjs.obj.isPlain = function(a) {
    return !!a && "object" === typeof a && "[object Object]" === a.toString() && a.constructor === Object
};
vjs.obj.isArray = Array.isArray || function(a) {
    return "[object Array]" === Object.prototype.toString.call(a)
};
vjs.bind = function(a, b, c) {
    b.guid || (b.guid = vjs.guid++);
    var d = function() {
        return b.apply(a, arguments)
    };
    d.guid = c ? c + "_" + b.guid : b.guid;
    return d
};
vjs.cache = {};
vjs.guid = 1;
vjs.expando = "vdata" + (new Date).getTime();
vjs.getData = function(a) {
    var b = a[vjs.expando];
    b || (b = a[vjs.expando] = vjs.guid++, vjs.cache[b] = {});
    return vjs.cache[b]
};
vjs.hasData = function(a) {
    a = a ? a[vjs.expando] : !1;
    return !(!a || vjs.isEmpty(vjs.cache[a]))
};
vjs.removeData = function(a) {
    var b = a[vjs.expando];
    if (b) {
        delete vjs.cache[b];
        try {
            a[vjs.expando] = null
        } catch (c) {
            a.removeAttribute ? a.removeAttribute(vjs.expando) : a[vjs.expando] = null
        }
    }
};
vjs.isEmpty = function(a) {
    for (var b in a)
        if (null !== a[b]) return !1;
    return !0
};
vjs.addClass = function(a, b) {
    -1 == (" " + a.className + " ").indexOf(" " + b + " ") && (a.className = "" === a.className ? b : a.className + " " + b)
};
vjs.removeClass = function(a, b) {
    var c, d;
    if (-1 != a.className.indexOf(b)) {
        c = a.className.split(" ");
        for (d = c.length - 1; 0 <= d; d--) c[d] === b && c.splice(d, 1);
        a.className = c.join(" ")
    }
};
vjs.hasClass = function(a, b) {
    return a.className ? -1 < a.className.split(" ").indexOf(String(b)) : !1
};
vjs.TEST_VID = vjs.createEl("video");
vjs.USER_AGENT = navigator.userAgent;
vjs.IS_IPHONE = /iPhone/i.test(vjs.USER_AGENT);
vjs.IS_IPAD = /iPad/i.test(vjs.USER_AGENT);
vjs.IS_IPOD = /iPod/i.test(vjs.USER_AGENT);
vjs.IS_IOS = vjs.IS_IPHONE || vjs.IS_IPAD || vjs.IS_IPOD;
vjs.IOS_VERSION = function() {
    var a = vjs.USER_AGENT.match(/OS (\d+)_/i);
    if (a && a[1]) return a[1]
}();
vjs.IS_ANDROID = /Android/i.test(vjs.USER_AGENT);
vjs.ANDROID_VERSION = function() {
    var a = vjs.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),
        b, c;
    if (!a) return null;
    b = a[1] && parseFloat(a[1]);
    c = a[2] && parseFloat(a[2]);
    return b && c ? parseFloat(a[1] + "." + a[2]) : b ? b : null
}();
vjs.IS_OLD_ANDROID = vjs.IS_ANDROID && /webkit/i.test(vjs.USER_AGENT) && 2.3 > vjs.ANDROID_VERSION;
vjs.IS_FIREFOX = /Firefox/i.test(vjs.USER_AGENT);
vjs.IS_CHROME = /Chrome/i.test(vjs.USER_AGENT);
vjs.TOUCH_ENABLED = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch);
vjs.setElementAttributes = function(a, b) {
    vjs.obj.each(b, function(b, d) {
        null === d || "undefined" === typeof d || !1 === d ? a.removeAttribute(b) : a.setAttribute(b, !0 === d ? "" : d)
    })
};
vjs.getElementAttributes = function(a) {
    var b, c, d, e;
    b = {};
    if (a && a.attributes && 0 < a.attributes.length) {
        c = a.attributes;
        for (var f = c.length - 1; 0 <= f; f--) {
            d = c[f].name;
            e = c[f].value;
            if ("boolean" === typeof a[d] || -1 !== ",autoplay,controls,loop,muted,default,".indexOf("," + d + ",")) e = null !== e ? !0 : !1;
            b[d] = e
        }
    }
    return b
};
vjs.getComputedDimension = function(a, b) {
    var c = "";
    document.defaultView && document.defaultView.getComputedStyle ? c = document.defaultView.getComputedStyle(a, "").getPropertyValue(b) : a.currentStyle && (c = a["client" + b.substr(0, 1).toUpperCase() + b.substr(1)] + "px");
    return c
};
vjs.insertFirst = function(a, b) {
    b.firstChild ? b.insertBefore(a, b.firstChild) : b.appendChild(a)
};
vjs.browser = {};
vjs.el = function(a) {
    0 === a.indexOf("#") && (a = a.slice(1));
    return document.getElementById(a)
};
vjs.formatTime = function(a, b) {
    b = b || a;
    var c = Math.floor(a % 60),
        d = Math.floor(a / 60 % 60),
        e = Math.floor(a / 3600),
        f = Math.floor(b / 60 % 60),
        g = Math.floor(b / 3600);
    if (isNaN(a) || Infinity === a) e = d = c = "-";
    e = 0 < e || 0 < g ? e + ":" : "";
    return e + (((e || 10 <= f) && 10 > d ? "0" + d : d) + ":") + (10 > c ? "0" + c : c)
};
vjs.blockTextSelection = function() {
    document.body.focus();
    document.onselectstart = function() {
        return !1
    }
};
vjs.unblockTextSelection = function() {
    document.onselectstart = function() {
        return !0
    }
};
vjs.trim = function(a) {
    return (a + "").replace(/^\s+|\s+$/g, "")
};
vjs.round = function(a, b) {
    b || (b = 0);
    return Math.round(a * Math.pow(10, b)) / Math.pow(10, b)
};
vjs.createTimeRange = function(a, b) {
    return {
        length: 1,
        start: function() {
            return a
        },
        end: function() {
            return b
        }
    }
};
vjs.get = function(a, b, c, d, e, f, g) {
    var k, h, p, l = !1;
    c = c || function() {};
    g = g || function() {};
    var n = function() {
            b.apply(this, arguments);
            g.apply(this, arguments)
        },
        m = function() {
            c.apply(this, arguments);
            g.apply(this, arguments)
        };
    e && (n = function() {
        l || (l = !0, b.apply(this, arguments))
    }, m = function() {
        l || (l = !0, c.apply(this, arguments))
    }, setTimeout(function() {
        l || m()
    }, e));
    "undefined" === typeof XMLHttpRequest && (window.XMLHttpRequest = function() {
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")
        } catch (a) {}
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")
        } catch (a) {}
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP")
        } catch (a) {}
        throw Error("This browser does not support XMLHttpRequest.");
    });
    h = new XMLHttpRequest;
    e = vjs.parseUrl(a);
    p = window.location;
    e.protocol + e.host === p.protocol + p.host || !window.XDomainRequest || "withCredentials" in h ? (k = "file:" == e.protocol || "file:" == p.protocol, h.onreadystatechange = function() {
        4 === h.readyState && (200 === h.status || k && 0 === h.status ? n(h.responseText) : m(h.responseText))
    }) : (h = new window.XDomainRequest, h.onload = function() {
        n(h.responseText)
    }, h.onerror = m, h.onprogress = function() {}, h.ontimeout = m);
    try {
        h.open(f || "GET", a, !0), d && (h.withCredentials = !0)
    } catch (r) {
        m(r);
        return
    }
    try {
        h.send()
    } catch (r) {
        m(r)
    }
};
vjs.setLocalStorage = function(a, b) {
    try {
        var c = window.localStorage || !1;
        c && (c[a] = b)
    } catch (d) {
        22 == d.code || 1014 == d.code ? vjs.log("LocalStorage Full (VideoJS)", d) : 18 == d.code ? vjs.log("LocalStorage not allowed (VideoJS)", d) : vjs.log("LocalStorage Error (VideoJS)", d)
    }
};
vjs.getAbsoluteURL = function(a) {
    a.match(/^https?:\/\//) || (a = vjs.createEl("div", {
        innerHTML: '<a href="' + a + '">x</a>'
    }).firstChild.href);
    return a
};
vjs.parseUrl = function(a) {
    var b, c, d, e;
    e = "protocol hostname port pathname search hash host".split(" ");
    c = vjs.createEl("a", {
        href: a
    });
    if (d = "" === c.host && "file:" !== c.protocol) b = vjs.createEl("div"), b.innerHTML = '<a href="' + a + '"></a>', c = b.firstChild, b.setAttribute("style", "display:none; position:absolute;"), document.body.appendChild(b);
    a = {};
    for (var f = 0; f < e.length; f++) a[e[f]] = c[e[f]];
    d && document.body.removeChild(b);
    return a
};

function _logType(a, b) {
    var c, d;
    c = Array.prototype.slice.call(b);
    d = function() {};
    d = window.console || {
        log: d,
        warn: d,
        error: d
    };
    a ? c.unshift(a.toUpperCase() + ":") : a = "log";
    vjs.log.history.push(c);
    c.unshift("VIDEOJS:");
    if (d[a].apply) d[a].apply(d, c);
    else d[a](c.join(" "))
}
vjs.log = function() {
    _logType(null, arguments)
};
vjs.log.history = [];
vjs.log.error = function() {
    _logType("error", arguments)
};
vjs.log.warn = function() {
    _logType("warn", arguments)
};
vjs.findPosition = function(a) {
    var b, c, d;
    a.getBoundingClientRect && a.parentNode && (b = a.getBoundingClientRect());
    if (!b) return {
        left: 0,
        top: 0
    };
    c = document.documentElement;
    d = document.body;
    a = b.left + (window.pageXOffset || d.scrollLeft) - (c.clientLeft || d.clientLeft || 0);
    b = b.top + (window.pageYOffset || d.scrollTop) - (c.clientTop || d.clientTop || 0);
    return {
        left: vjs.round(a),
        top: vjs.round(b)
    }
};
vjs.arr = {};
vjs.arr.forEach = function(a, b, c) {
    if (vjs.obj.isArray(a) && b instanceof Function)
        for (var d = 0, e = a.length; d < e; ++d) b.call(c || vjs, a[d], d, a);
    return a
};
vjs.util = {};
vjs.util.mergeOptions = function(a, b) {
    var c, d, e;
    a = vjs.obj.copy(a);
    for (c in b) b.hasOwnProperty(c) && (d = a[c], e = b[c], vjs.obj.isPlain(d) && vjs.obj.isPlain(e) ? a[c] = vjs.util.mergeOptions(d, e) : a[c] = b[c]);
    return a
};
vjs.Component = vjs.CoreObject.extend({
    init: function(a, b, c) {
        this.player_ = a;
        this.options_ = vjs.obj.copy(this.options_);
        b = this.options(b);
        this.id_ = b.id || (b.el && b.el.id ? b.el.id : a.id() + "_component_" + vjs.guid++);
        this.name_ = b.name || null;
        this.el_ = b.el || this.createEl();
        this.children_ = [];
        this.childIndex_ = {};
        this.childNameIndex_ = {};
        this.initChildren();
        this.ready(c);
        !1 !== b.reportTouchActivity && this.enableTouchActivity()
    }
});
vjs.Component.prototype.dispose = function() {
    this.trigger({
        type: "dispose",
        bubbles: !1
    });
    if (this.children_)
        for (var a = this.children_.length - 1; 0 <= a; a--) this.children_[a].dispose && this.children_[a].dispose();
    this.childNameIndex_ = this.childIndex_ = this.children_ = null;
    this.off();
    this.el_.parentNode && this.el_.parentNode.removeChild(this.el_);
    vjs.removeData(this.el_);
    this.el_ = null
};
vjs.Component.prototype.player_ = !0;
vjs.Component.prototype.player = function() {
    return this.player_
};
vjs.Component.prototype.options = function(a) {
    return void 0 === a ? this.options_ : this.options_ = vjs.util.mergeOptions(this.options_, a)
};
vjs.Component.prototype.createEl = function(a, b) {
    return vjs.createEl(a, b)
};
vjs.Component.prototype.localize = function(a) {
    var b = this.player_.language(),
        c = this.player_.languages();
    return c && c[b] && c[b][a] ? c[b][a] : a
};
vjs.Component.prototype.el = function() {
    return this.el_
};
vjs.Component.prototype.contentEl = function() {
    return this.contentEl_ || this.el_
};
vjs.Component.prototype.id = function() {
    return this.id_
};
vjs.Component.prototype.name = function() {
    return this.name_
};
vjs.Component.prototype.children = function() {
    return this.children_
};
vjs.Component.prototype.getChildById = function(a) {
    return this.childIndex_[a]
};
vjs.Component.prototype.getChild = function(a) {
    return this.childNameIndex_[a]
};
vjs.Component.prototype.addChild = function(a, b) {
    var c, d;
    "string" === typeof a ? (d = a, b = b || {}, c = b.componentClass || vjs.capitalize(d), b.name = d, c = new window.videojs[c](this.player_ || this, b)) : c = a;
    this.children_.push(c);
    "function" === typeof c.id && (this.childIndex_[c.id()] = c);
    (d = d || c.name && c.name()) && (this.childNameIndex_[d] = c);
    "function" === typeof c.el && c.el() && this.contentEl().appendChild(c.el());
    return c
};
vjs.Component.prototype.removeChild = function(a) {
    "string" === typeof a && (a = this.getChild(a));
    if (a && this.children_) {
        for (var b = !1, c = this.children_.length - 1; 0 <= c; c--)
            if (this.children_[c] === a) {
                b = !0;
                this.children_.splice(c, 1);
                break
            }
        if (b) {
            if (a.children_)
                for (; a.children_.length;) a.removeChild(a.children_[0]);
            a.beforeRemove && a.beforeRemove.apply(a);
            this.childIndex_[a.id] = null;
            this.childNameIndex_[a.name] = null;
            (b = a.el()) && b.parentNode === this.contentEl() && this.contentEl().removeChild(a.el())
        }
    }
};
vjs.Component.prototype.initChildren = function() {
    var a, b, c, d;
    a = this;
    if (b = this.options().children)
        if (vjs.obj.isArray(b))
            for (var e = 0; e < b.length; e++) c = b[e], "string" == typeof c ? (d = c, c = {}) : d = c.name, a[d] = a.addChild(d, c);
        else vjs.obj.each(b, function(b, c) {
            !1 !== c && (a[b] = a.addChild(b, c))
        })
};
vjs.Component.prototype.buildCSSClass = function() {
    return ""
};
vjs.Component.prototype.on = function(a, b) {
    vjs.on(this.el_, a, vjs.bind(this, b));
    return this
};
vjs.Component.prototype.off = function(a, b) {
    vjs.off(this.el_, a, b);
    return this
};
vjs.Component.prototype.one = function(a, b) {
    vjs.one(this.el_, a, vjs.bind(this, b));
    return this
};
vjs.Component.prototype.trigger = function(a) {
    vjs.trigger(this.el_, a);
    return this
};
vjs.Component.prototype.isReadyOnInitFinish_ = !0;
vjs.Component.prototype.ready = function(a) {
    a && (this.isReady_ ? a.call(this) : (void 0 === this.readyQueue_ && (this.readyQueue_ = []), this.readyQueue_.push(a)));
    return this
};
vjs.Component.prototype.triggerReady = function() {
    this.isReady_ = !0;
    var a = this.readyQueue_;
    if (a && 0 < a.length) {
        for (var b = 0, c = a.length; b < c; b++) a[b].call(this);
        this.readyQueue_ = [];
        this.trigger("ready")
    }
};
vjs.Component.prototype.addClass = function(a) {
    vjs.addClass(this.el_, a);
    return this
};
vjs.Component.prototype.removeClass = function(a) {
    vjs.removeClass(this.el_, a);
    return this
};
vjs.Component.prototype.show = function() {
    this.el_.style.display = "block";
    return this
};
vjs.Component.prototype.hide = function() {
    this.el_.style.display = "none";
    return this
};
vjs.Component.prototype.lockShowing = function() {
    this.addClass("vjs-lock-showing");
    return this
};
vjs.Component.prototype.unlockShowing = function() {
    this.removeClass("vjs-lock-showing");
    return this
};
vjs.Component.prototype.disable = function() {
    this.hide();
    this.show = function() {}
};
vjs.Component.prototype.width = function(a, b) {
    return this.dimension("width", a, b)
};
vjs.Component.prototype.height = function(a, b) {
    return this.dimension("height", a, b)
};
vjs.Component.prototype.dimensions = function(a, b) {
    return this.width(a, !0).height(b)
};
vjs.Component.prototype.dimension = function(a, b, c) {
    if (void 0 !== b) return -1 !== ("" + b).indexOf("%") || -1 !== ("" + b).indexOf("px") ? this.el_.style[a] = b : this.el_.style[a] = "auto" === b ? "" : b + "px", c || this.trigger("resize"), this;
    if (!this.el_) return 0;
    b = this.el_.style[a];
    c = b.indexOf("px");
    return -1 !== c ? parseInt(b.slice(0, c), 10) : parseInt(this.el_["offset" + vjs.capitalize(a)], 10)
};
vjs.Component.prototype.emitTapEvents = function() {
    var a, b, c, d, e, f, g, k;
    a = 0;
    b = null;
    this.on("touchstart", function(c) {
        1 === c.touches.length && (b = c.touches[0], a = (new Date).getTime(), d = !0)
    });
    this.on("touchmove", function(a) {
        1 < a.touches.length ? d = !1 : b && (f = a.touches[0].pageX - b.pageX, g = a.touches[0].pageY - b.pageY, k = Math.sqrt(f * f + g * g), 22 < k && (d = !1))
    });
    e = function() {
        d = !1
    };
    this.on("touchleave", e);
    this.on("touchcancel", e);
    this.on("touchend", function(e) {
        b = null;
        !0 === d && (c = (new Date).getTime() - a, 250 > c && (e.preventDefault(),
            this.trigger("tap")))
    })
};
vjs.Component.prototype.enableTouchActivity = function() {
    var a, b, c;
    a = vjs.bind(this.player(), this.player().reportUserActivity);
    this.on("touchstart", function() {
        a();
        clearInterval(b);
        b = setInterval(a, 250)
    });
    c = function(c) {
        a();
        clearInterval(b)
    };
    this.on("touchmove", a);
    this.on("touchend", c);
    this.on("touchcancel", c)
};
vjs.Button = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.emitTapEvents();
        this.on("tap", this.onClick);
        this.on("click", this.onClick);
        this.on("focus", this.onFocus);
        this.on("blur", this.onBlur)
    }
});
vjs.Button.prototype.createEl = function(a, b) {
    var c;
    b = vjs.obj.merge({
        className: this.buildCSSClass(),
        role: "button",
        "aria-live": "polite",
        tabIndex: 0
    }, b);
    c = vjs.Component.prototype.createEl.call(this, a, b);
    b.innerHTML || (this.contentEl_ = vjs.createEl("div", {
        className: "vjs-control-content"
    }), this.controlText_ = vjs.createEl("span", {
        className: "vjs-control-text",
        innerHTML: this.localize(this.buttonText) || "Need Text"
    }), this.contentEl_.appendChild(this.controlText_), c.appendChild(this.contentEl_));
    return c
};
vjs.Button.prototype.buildCSSClass = function() {
    return "vjs-control " + vjs.Component.prototype.buildCSSClass.call(this)
};
vjs.Button.prototype.onClick = function() {};
vjs.Button.prototype.onFocus = function() {
    vjs.on(document, "keyup", vjs.bind(this, this.onKeyPress))
};
vjs.Button.prototype.onKeyPress = function(a) {
    if (32 == a.which || 13 == a.which) a.preventDefault(), this.onClick()
};
vjs.Button.prototype.onBlur = function() {
    vjs.off(document, "keyup", vjs.bind(this, this.onKeyPress))
};
vjs.Slider = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.bar = this.getChild(this.options_.barName);
        this.handle = this.getChild(this.options_.handleName);
        this.on("mousedown", this.onMouseDown);
        this.on("touchstart", this.onMouseDown);
        this.on("focus", this.onFocus);
        this.on("blur", this.onBlur);
        this.on("click", this.onClick);
        this.player_.on("controlsvisible", vjs.bind(this, this.update));
        a.on(this.playerEvent, vjs.bind(this, this.update));
        var c = this;
        this.on("mouseout", function(a) {
            vjs.hasClass(c.el_,
                "vjs-sliding") && a.relatedTarget.parentNode != this.el_ && a.relatedTarget != this.el_ && c.onMouseUp.apply(c, arguments)
        });
        this.boundEvents = {};
        this.boundEvents.move = vjs.bind(this, this.onMouseMove);
        this.boundEvents.end = vjs.bind(this, this.onMouseUp)
    }
});
vjs.Slider.prototype.createEl = function(a, b) {
    b = b || {};
    b.className += " vjs-slider";
    b = vjs.obj.merge({
        role: "slider",
        "aria-valuenow": 0,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        tabIndex: 0
    }, b);
    return vjs.Component.prototype.createEl.call(this, a, b)
};
vjs.Slider.prototype.onMouseDown = function(a) {
    a.preventDefault();
    vjs.blockTextSelection();
    this.addClass("vjs-sliding");
    this.player_.addClass("vjs-sliding");
    vjs.on(document, "mousemove", this.boundEvents.move);
    vjs.on(document, "mouseup", this.boundEvents.end);
    vjs.on(document, "touchmove", this.boundEvents.move);
    vjs.on(document, "touchend", this.boundEvents.end);
    this.onMouseMove(a)
};
vjs.Slider.prototype.onMouseMove = function() {};
vjs.Slider.prototype.onMouseUp = function() {
    vjs.unblockTextSelection();
    this.removeClass("vjs-sliding");
    this.player_.removeClass("vjs-sliding");
    vjs.off(document, "mousemove", this.boundEvents.move, !1);
    vjs.off(document, "mouseup", this.boundEvents.end, !1);
    vjs.off(document, "touchmove", this.boundEvents.move, !1);
    vjs.off(document, "touchend", this.boundEvents.end, !1);
    this.update()
};
vjs.Slider.prototype.update = function() {
    if (this.el_) {
        var a, b = this.getPercent(),
            c = this.handle,
            d = this.bar;
        a = this.bar.options_;
        var e = "left",
            f = "width";
        "undefined" != typeof a.vertical && (a.vertical ? (e = "bottom", f = "height") : (e = "left", f = "width"));
        isNaN(b) && (b = 0);
        a = b;
        c && (c.el().style[e] = vjs.round(100 * b, 2) + "%");
        d && (d.el().style[f] = vjs.round(100 * a, 2) + "%")
    }
};
vjs.Slider.prototype.calculateDistance = function(a) {
    var b, c, d, e;
    b = this.el_;
    c = vjs.findPosition(b);
    e = b.offsetWidth;
    d = b.offsetHeight;
    b = this.handle;
    if (this.options().vertical) return e = c.top, a = a.changedTouches ? a.changedTouches[0].pageY : a.pageY, b && (b = b.el().offsetHeight, e += b / 2, d -= b), Math.max(0, Math.min(1, (e - a + d) / d));
    d = c.left;
    a = a.changedTouches ? a.changedTouches[0].pageX : a.pageX;
    b && (b = b.el().offsetWidth, d += b / 2, e -= b);
    return Math.max(0, Math.min(1, (a - d) / e))
};
vjs.Slider.prototype.onFocus = function() {
    vjs.on(document, "keyup", vjs.bind(this, this.onKeyPress))
};
vjs.Slider.prototype.onKeyPress = function(a) {
    if (37 == a.which || 40 == a.which) a.preventDefault(), this.stepBack();
    else if (38 == a.which || 39 == a.which) a.preventDefault(), this.stepForward()
};
vjs.Slider.prototype.onBlur = function() {
    vjs.off(document, "keyup", vjs.bind(this, this.onKeyPress))
};
vjs.Slider.prototype.onClick = function(a) {
    a.stopImmediatePropagation();
    a.preventDefault()
};
vjs.SliderHandle = vjs.Component.extend();
vjs.SliderHandle.prototype.defaultValue = 0;
vjs.SliderHandle.prototype.createEl = function(a, b) {
    b = b || {};
    b.className += " vjs-slider-handle";
    b = vjs.obj.merge({
        innerHTML: '<span class="vjs-control-text">' + this.defaultValue + "</span>"
    }, b);
    return vjs.Component.prototype.createEl.call(this, "div", b)
};
vjs.Menu = vjs.Component.extend();
vjs.Menu.prototype.addItem = function(a) {
    this.addChild(a);
    a.on("click", vjs.bind(this, function() {
        this.unlockShowing()
    }))
};
vjs.Menu.prototype.createEl = function() {
    var a = this.options().contentElType || "ul";
    this.contentEl_ = vjs.createEl(a, {
        className: "vjs-menu-content"
    });
    a = vjs.Component.prototype.createEl.call(this, "div", {
        append: this.contentEl_,
        className: "vjs-menu"
    });
    a.appendChild(this.contentEl_);
    vjs.on(a, "click", function(a) {
        a.preventDefault();
        a.stopImmediatePropagation()
    });
    return a
};
vjs.MenuItem = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        this.selected(b.selected)
    }
});
vjs.MenuItem.prototype.createEl = function(a, b) {
    return vjs.Button.prototype.createEl.call(this, "li", vjs.obj.merge({
        className: "vjs-menu-item",
        innerHTML: this.options_.label
    }, b))
};
vjs.MenuItem.prototype.onClick = function() {
    this.selected(!0)
};
vjs.MenuItem.prototype.selected = function(a) {
    a ? (this.addClass("vjs-selected"), this.el_.setAttribute("aria-selected", !0)) : (this.removeClass("vjs-selected"), this.el_.setAttribute("aria-selected", !1))
};
vjs.MenuButton = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        this.menu = this.createMenu();
        this.addChild(this.menu);
        this.items && 0 === this.items.length && this.hide();
        this.on("keyup", this.onKeyPress);
        this.el_.setAttribute("aria-haspopup", !0);
        this.el_.setAttribute("role", "button")
    }
});
vjs.MenuButton.prototype.buttonPressed_ = !1;
vjs.MenuButton.prototype.createMenu = function() {
    var a = new vjs.Menu(this.player_);
    this.options().title && a.contentEl().appendChild(vjs.createEl("li", {
        className: "vjs-menu-title",
        innerHTML: vjs.capitalize(this.options().title),
        tabindex: -1
    }));
    if (this.items = this.createItems())
        for (var b = 0; b < this.items.length; b++) a.addItem(this.items[b]);
    return a
};
vjs.MenuButton.prototype.createItems = function() {};
vjs.MenuButton.prototype.buildCSSClass = function() {
    return this.className + " vjs-menu-button " + vjs.Button.prototype.buildCSSClass.call(this)
};
vjs.MenuButton.prototype.onFocus = function() {};
vjs.MenuButton.prototype.onBlur = function() {};
vjs.MenuButton.prototype.onClick = function() {
    this.one("mouseout", vjs.bind(this, function() {
        this.menu.unlockShowing();
        this.el_.blur()
    }));
    this.buttonPressed_ ? this.unpressButton() : this.pressButton()
};
vjs.MenuButton.prototype.onKeyPress = function(a) {
    a.preventDefault();
    32 == a.which || 13 == a.which ? this.buttonPressed_ ? this.unpressButton() : this.pressButton() : 27 == a.which && this.buttonPressed_ && this.unpressButton()
};
vjs.MenuButton.prototype.pressButton = function() {
    this.buttonPressed_ = !0;
    this.menu.lockShowing();
    this.el_.setAttribute("aria-pressed", !0);
    this.items && 0 < this.items.length && this.items[0].el().focus()
};
vjs.MenuButton.prototype.unpressButton = function() {
    this.buttonPressed_ = !1;
    this.menu.unlockShowing();
    this.el_.setAttribute("aria-pressed", !1)
};
vjs.MediaError = function(a) {
    "number" === typeof a ? this.code = a : "string" === typeof a ? this.message = a : "object" === typeof a && vjs.obj.merge(this, a);
    this.message || (this.message = vjs.MediaError.defaultMessages[this.code] || "")
};
vjs.MediaError.prototype.code = 0;
vjs.MediaError.prototype.message = "";
vjs.MediaError.prototype.status = null;
vjs.MediaError.errorTypes = "MEDIA_ERR_CUSTOM MEDIA_ERR_ABORTED MEDIA_ERR_NETWORK MEDIA_ERR_DECODE MEDIA_ERR_SRC_NOT_SUPPORTED MEDIA_ERR_ENCRYPTED".split(" ");
vjs.MediaError.defaultMessages = {
    1: "You aborted the video playback",
    2: "A network error caused the video download to fail part-way.",
    3: "The video playback was aborted due to a corruption problem or because the video used features your browser did not support.",
    4: "The video could not be loaded, either because the server or network failed or because the format is not supported.",
    5: "The video is encrypted and we do not have the keys to decrypt it."
};
for (var errNum = 0; errNum < vjs.MediaError.errorTypes.length; errNum++) vjs.MediaError[vjs.MediaError.errorTypes[errNum]] = errNum, vjs.MediaError.prototype[vjs.MediaError.errorTypes[errNum]] = errNum;
(function() {
    var a, b, c, d;
    a = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "), "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "),
        "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")
    ];
    b = a[0];
    for (d = 0; d < a.length; d++)
        if (a[d][1] in document) {
            c = a[d];
            break
        }
    if (c)
        for (vjs.browser.fullscreenAPI = {}, d = 0; d < c.length; d++) vjs.browser.fullscreenAPI[b[d]] = c[d]
})();
vjs.Player = vjs.Component.extend({
    init: function(a, b, c) {
        this.tag = a;
        a.id = a.id || "vjs_video_" + vjs.guid++;
        this.tagAttributes = a && vjs.getElementAttributes(a);
        delete this.tagAttributes.style;
        b = vjs.obj.merge(this.getTagSettings(a), b);
        this.language_ = b.language || vjs.options.language;
        this.languages_ = b.languages || vjs.options.languages;
        this.cache_ = {};
        this.poster_ = b.poster;
        this.controls_ = b.controls;
        a.controls = !1;
        b.reportTouchActivity = !1;
        vjs.Component.call(this, this, b, c);
        this.controls() ? this.addClass("vjs-controls-enabled") :
            this.addClass("vjs-controls-disabled");
        this.one("RstartScreenVisible", function() {
            this.tech.show();
            vjs.IS_MOBILE || "undefined" == typeof this.options_.autoplay || 1 != this.options_.autoplay ? vjs.IS_MOBILE || this.options_.autoplay || this.player_.options_.reEmbed.autoplayOnViewport && !this.player_.options_.hasAds && this.trackViewport() : 0 === parseInt(this.Playlist.positionInQ, 10) && (this.trigger("RstartRequested"), "dailymotion" == this.techName.toLowerCase() && this.isLive ? (this.startScreen.hide(), this.trigger("RhideOverlaySpinner")) :
                this.trigger("RshowOverlaySpinner"))
        });
        this.on("RisMobile", function() {
            vjs.defaultControls || (this.addClass("vjs-mobile"), vjs.IS_IPHONE ? this.addClass("vjs-iPhone") : vjs.IS_IPAD ? this.addClass("vjs-iPad") : vjs.IS_ANDROID ? this.addClass("vjs-android") : vjs.IS_WINDOWS_PHONE && !vjs.IS_IE11_PHONE && this.addClass("vjs-windowsPhone"));
            var a = vjs.getDoc().querySelector('meta[ name="viewport" ]');
            (!a || 0 > a.content.indexOf("width=device-width")) && this.addClass("vjs-no-viewport");
            if ("undefined" != typeof window.orientation) {
                0 ===
                    window.orientation ? (this.addClass("vjs-orientation-portrait"), this.removeClass("vjs-orientation-landscape")) : (this.addClass("vjs-orientation-landscape"), this.removeClass("vjs-orientation-portrait"));
                var b = this;
                vjs.on(window, "orientationchange", function() {
                    0 === window.orientation ? (b.addClass("vjs-orientation-portrait"), b.removeClass("vjs-orientation-landscape")) : (b.addClass("vjs-orientation-landscape"), b.removeClass("vjs-orientation-portrait"))
                })
            }
        });
        this.cReady(function() {
            vjs.IS_MOBILE && this.trigger("RisMobile")
        });
        this.one("dispose", function() {
            clearInterval(this.sizeFixInterval);
            clearInterval(this.trackWrapInterval);
            clearInterval(this.controlBar.progressControl.progressBarInterval)
        });
        vjs.players[this.id_] = this;
        b.plugins && vjs.obj.each(b.plugins, function(a, b) {
            this[a](b)
        }, this);
        this.listenForUserActivity();
        this.isCReady_ = !0;
        if ((a = this.cReadyQueue_) && 0 < a.length) {
            b = 0;
            for (c = a.length; b < c; b++) a[b].call(this);
            this.cReadyQueue_ = [];
            this.trigger("cReady")
        }
    }
});
vjs.Player.prototype.cReady = function(a) {
    a && (this.isCReady_ ? a.call(this) : (void 0 === this.cReadyQueue_ && (this.cReadyQueue_ = []), this.cReadyQueue_.push(a)));
    return this
};
vjs.Player.prototype.language = function(a) {
    if (void 0 === a) return this.language_;
    this.language_ = a;
    return this
};
vjs.Player.prototype.languages = function() {
    return this.languages_
};
vjs.Player.prototype.options_ = vjs.options;
vjs.Player.prototype.dispose = function() {
    this.trigger("dispose");
    this.off("dispose");
    clearInterval(this.trackWrapInterval);
    clearInterval(this.sizeFixInterval);
    clearInterval(this.progressBarInterval);
    vjs.players[this.id_] = null;
    this.tag && this.tag.player && (this.tag.player = null);
    this.el_ && this.el_.player && (this.el_.player = null);
    this.tech && this.tech.dispose();
    vjs.Component.prototype.dispose.call(this)
};
vjs.Player.prototype.getTagSettings = function(a) {
    var b = {
        sources: [],
        tracks: []
    };
    vjs.obj.merge(b, vjs.getElementAttributes(a));
    if (a.hasChildNodes()) {
        var c, d, e, f;
        a = a.childNodes;
        e = 0;
        for (f = a.length; e < f; e++) c = a[e], d = c.nodeName.toLowerCase(), "source" === d ? b.sources.push(vjs.getElementAttributes(c)) : "track" === d && b.tracks.push(vjs.getElementAttributes(c))
    }
    return b
};
vjs.Player.prototype.createEl = function() {
    var a = this.el_ = vjs.Component.prototype.createEl.call(this, "div"),
        b = this.tag;
    b.removeAttribute("width");
    b.removeAttribute("height");
    if (b.hasChildNodes()) {
        var c, d, e, f, g;
        c = b.childNodes;
        d = c.length;
        for (g = []; d--;) e = c[d], f = e.nodeName.toLowerCase(), "track" === f && g.push(e);
        for (c = 0; c < g.length; c++) b.removeChild(g[c])
    }
    a.id = b.id;
    a.className = b.className;
    b.id += "_html5_api";
    b.className = "vjs-tech";
    b.player = a.player = this;
    this.addClass("vjs-paused");
    window._X_REM_NEST || (this.width(this.options_.width, !0), this.height(this.options_.height, !0));
    b.parentNode && b.parentNode.insertBefore(a, b);
    vjs.insertFirst(b, a);
    this.el_ = a;
    this.on("loadstart", this.onLoadStart);
    this.on("waiting", this.onWaiting);
    this.on(["canplay", "canplaythrough", "playing", "ended"], this.onWaitEnd);
    this.on("seeking", this.onSeeking);
    this.on("seeked", this.onSeeked);
    this.on("ended", this.onEnded);
    this.on("play", this.onPlay);
    this.on("firstplay", this.onFirstPlay);
    this.on("pause", this.onPause);
    this.on("progress", this.onProgress);
    this.on("durationchange",
        this.onDurationChange);
    this.on("fullscreenchange", this.onFullscreenChange);
    return a
};
vjs.Player.prototype.loadTech = function(a, b) {
    this.tech && (this.tech.features.timeupdateEvents = !1, this.tech.features.progressEvents = !1, this.lastTech = this.techName, this.tech.removeControlsListeners(), this.unloadTech());
    "Html5" !== a && this.tag && (vjs.Html5.disposeMediaElement(this.tag), this.tag = null);
    this.techName = a;
    this.isReady_ = !1;
    var c = vjs.obj.merge({
        source: b,
        parentEl: this.el_
    }, this.options_[a.toLowerCase()]);
    b && (this.currentType_ = b.type, b.src == this.cache_.src && 0 < this.cache_.currentTime && (c.startTime =
        this.cache_.currentTime), this.cache_.src = b.src, this.cache_.isAd = b.ad);
    this.tech = new window.videojs[a](this, c);
    this.tech.ready(function() {
        this.player_.triggerReady();
        this.player_.trigger("techchange");
        this.player_.setVolume();
        this.player_.trackResize();
        this.player_.trackWrapping()
    })
};
vjs.Player.prototype.unloadTech = function() {
    this.isReady_ = !1;
    this.manualProgress && this.manualProgressOff();
    this.tech.dispose();
    this.tech = !1
};
vjs.Player.prototype.onLoadStart = function() {
    this.paused() ? (this.hasStarted(!1), this.one("play", function() {
        this.hasStarted(!0)
    })) : this.trigger("firstplay")
};
vjs.Player.prototype.hasStarted_ = !1;
vjs.Player.prototype.hasStarted = function(a) {
    return void 0 !== a ? (this.hasStarted_ !== a && ((this.hasStarted_ = a) ? (this.addClass("vjs-has-started"), this.trigger("firstplay")) : this.removeClass("vjs-has-started")), this) : this.hasStarted_
};
vjs.Player.prototype.onPlay = function() {
    this.removeClass("vjs-paused");
    this.addClass("vjs-playing")
};
vjs.Player.prototype.onWaiting = function() {
    "youtube" !== this.techName.toLowerCase() && this.addClass("vjs-waiting")
};
vjs.Player.prototype.onWaitEnd = function() {
    this.removeClass("vjs-waiting")
};
vjs.Player.prototype.onSeeking = function() {
    if ("dailymotion" === this.techName.toLowerCase()) return !1;
    this.addClass("vjs-seeking")
};
vjs.Player.prototype.onSeeked = function() {
    this.removeClass("vjs-seeking")
};
vjs.Player.prototype.onFirstPlay = function() {
    this.options_.starttime && this.currentTime(this.options_.starttime);
    this.addClass("vjs-has-started")
};
vjs.Player.prototype.onPause = function() {
    this.promptPause = 1;
    this.removeClass("vjs-playing");
    this.addClass("vjs-paused")
};
vjs.Player.prototype.onProgress = function() {
    1 == this.bufferedPercent() && this.trigger("loadedalldata")
};
vjs.Player.prototype.onEnded = function() {
    this.options_.loop && (this.currentTime(0), this.play());
    if (window._X_REM_NEST) {
        var a;
        try {
            document.createEvent ? (a = document.createEvent("HTMLEvents"), a.initEvent("ended", !0, !0), window.iframeElement.dispatchEvent(a)) : (a = document.createEventObject(), a.eventType = "ended", window.iframeElement.fireEvent("onended", a))
        } catch (b) {}
    }
};
vjs.Player.prototype.onDurationChange = function() {
    var a = this.techGet("duration");
    a && (0 > a && (a = Infinity), this.duration(a), this.isLive ? this.addClass("vjs-live") : this.isLive || this.removeClass("vjs-live"))
};
vjs.Player.prototype.onFullscreenChange = function() {
    this.isFullscreen() ? this.addClass("vjs-fullscreen") : this.removeClass("vjs-fullscreen")
};
vjs.Player.prototype.getCache = function() {
    return this.cache_
};
vjs.Player.prototype.techCall = function(a, b) {
    if (this.tech && !this.tech.isReady_) this.tech.ready(function() {
        this[a](b)
    });
    else try {
        this.tech[a](b)
    } catch (c) {
        vjs.log(c)
    }
};
vjs.Player.prototype.techGet = function(a) {
    if (this.tech && this.tech.isReady_) try {
        return this.tech[a]()
    } catch (b) {
        throw void 0 === this.tech[a] ? vjs.log("Video.js: " + a + " method not defined for " + this.techName + " playback technology.", b) : "TypeError" == b.name ? (vjs.log("Video.js: " + a + " unavailable on " + this.techName + " playback technology element.", b), this.tech.isReady_ = !1) : vjs.log(b), b;
    }
};
vjs.Player.prototype.play = function() {
    this.techCall("play");
    return this
};
vjs.Player.prototype.pause = function() {
    this.techCall("pause");
    return this
};
vjs.Player.prototype.paused = function() {
    return !1 === this.techGet("paused") ? !1 : !0
};
vjs.Player.prototype.currentTime = function(a) {
    return void 0 !== a ? (this.techCall("setCurrentTime", a), this) : this.cache_.currentTime = this.techGet("currentTime") || 0
};
vjs.Player.prototype.duration = function(a) {
    if (void 0 !== a) return this.cache_.duration = parseFloat(a), this;
    if (void 0 === this.cache_.duration) this.onDurationChange();
    return this.cache_.duration || 0
};
vjs.Player.prototype.remainingTime = function() {
    return this.duration() - this.currentTime()
};
vjs.Player.prototype.buffered = function() {
    var a = this.techGet("buffered");
    a && a.length || (a = vjs.createTimeRange(0, 0));
    return a
};
vjs.Player.prototype.bufferedPercent = function() {
    var a = this.duration(),
        b = this.buffered(),
        c = 0,
        d, e;
    if (!a) return 0;
    for (var f = 0; f < b.length; f++) d = b.start(f), e = b.end(f), e > a && (e = a), c += e - d;
    return c / a
};
vjs.Player.prototype.bufferedEnd = function() {
    var a = this.buffered(),
        b = this.duration(),
        a = a.end(a.length - 1);
    a > b && (a = b);
    return a
};
vjs.Player.prototype.volume = function(a) {
    if (void 0 !== a) return a = Math.max(0, Math.min(1, parseFloat(a))), this.cache_.volume = a, this.techCall("setVolume", a), vjs.setLocalStorage("volume", a), this;
    a = parseFloat(this.techGet("volume"));
    return isNaN(a) ? 1 : a
};
vjs.Player.prototype.muted = function(a) {
    return void 0 !== a ? (this.techCall("setMuted", a), this) : this.techGet("muted") || !1
};
vjs.Player.prototype.supportsFullScreen = function() {
    return this.techGet("supportsFullScreen") || !1
};
vjs.Player.prototype.isFullscreen_ = !1;
vjs.Player.prototype.isFullscreen = function(a) {
    return void 0 !== a ? (this.isFullscreen_ = !!a, this) : this.isFullscreen_
};
vjs.Player.prototype.isFullScreen = function(a) {
    vjs.log.warn('player.isFullScreen() has been deprecated, use player.isFullscreen() with a lowercase "s")');
    return this.isFullscreen(a)
};
vjs.Player.prototype.requestFullscreen = function() {
    var a = vjs.browser.fullscreenAPI;
    this.isFullscreen(!0);
    a ? (vjs.on(document, a.fullscreenchange, vjs.bind(this, function(b) {
        this.isFullscreen(document[a.fullscreenElement]);
        !1 === this.isFullscreen() && vjs.off(document, a.fullscreenchange, arguments.callee);
        this.trigger("fullscreenchange")
    })), this.el_[a.requestFullscreen]()) : this.tech.supportsFullScreen() ? this.techCall("enterFullScreen") : (this.enterFullWindow(), this.trigger("fullscreenchange"));
    return this
};
vjs.Player.prototype.requestFullScreen = function() {
    vjs.log.warn('player.requestFullScreen() has been deprecated, use player.requestFullscreen() with a lowercase "s")');
    return this.requestFullscreen()
};
vjs.Player.prototype.exitFullscreen = function() {
    var a = vjs.browser.fullscreenAPI;
    this.isFullscreen(!1);
    if (a) document[a.exitFullscreen]();
    else this.tech.supportsFullScreen() ? this.techCall("exitFullScreen") : (this.exitFullWindow(), this.trigger("fullscreenchange"));
    return this
};
vjs.Player.prototype.cancelFullScreen = function() {
    vjs.log.warn("player.cancelFullScreen() has been deprecated, use player.exitFullscreen()");
    return this.exitFullscreen()
};
vjs.Player.prototype.enterFullWindow = function() {
    this.isFullWindow = !0;
    this.docOrigOverflow = document.documentElement.style.overflow;
    vjs.on(document, "keydown", vjs.bind(this, this.fullWindowOnEscKey));
    document.documentElement.style.overflow = "hidden";
    vjs.addClass(document.body, "vjs-full-window");
    window._X_REM_NEST && this.toggleIframeFullscreen(!0);
    this.trigger("enterFullWindow")
};
vjs.Player.prototype.fullWindowOnEscKey = function(a) {
    27 === a.keyCode && (!0 === this.isFullscreen() ? this.exitFullscreen() : this.exitFullWindow())
};
vjs.Player.prototype.exitFullWindow = function() {
    this.isFullWindow = !1;
    vjs.off(document, "keydown", this.fullWindowOnEscKey);
    document.documentElement.style.overflow && (document.documentElement.style.overflow = this.docOrigOverflow);
    vjs.removeClass(document.body, "vjs-full-window");
    window._X_REM_NEST && this.toggleIframeFullscreen(!1);
    this.trigger("exitFullWindow")
};
vjs.Player.prototype.selectSource = function(a) {
    for (var b = 0, c = this.options_.techOrder; b < c.length; b++) {
        var d = vjs.capitalize(c[b]),
            e = window.videojs[d];
        if (!e) vjs.log.error('The "' + d + '" tech is undefined. Skipped browser support check for that tech.');
        else if (e.isSupported())
            for (var f = 0, g = a; f < g.length; f++) {
                var k = g[f];
                if (e.canPlaySource(k)) return {
                    source: k,
                    tech: d
                }
            }
    }
    return !1
};
vjs.Player.prototype.src = function(a) {
    if (void 0 === a) return this.techGet("src");
    vjs.obj.isArray(a) ? this.sourceList_(a) : "string" === typeof a ? this.src({
        src: a
    }) : a instanceof Object && (a.type && !window.videojs[this.techName].canPlaySource(a) ? this.sourceList_([a]) : (this.cache_.src = a.src, this.cache_.isAd = a.ad, this.currentType_ = a.type || "", this.ready(function() {
        this.techCall("src", a.src);
        "auto" == this.options_.preload && this.load()
    })));
    return this
};
vjs.Player.prototype.sourceList_ = function(a) {
    a = this.selectSource(a);
    var b;
    this.sourceTech = a ? a.source : a;
    this.sourceTech.src && !this.sourceTech.type && (b = this.sourceTech.src.match(/\.([^\/\?]+)(\?[^\/]+)?$/i)[1], this.sourceTech.type = "video/" + b);
    if (a) a.tech === this.techName ? this.src(a.source) : this.loadTech(a.tech, a.source);
    else {
        this.noTech = !0;
        if ("undefined" == typeof this.Playlist) this.loadError = "noTech";
        else this.Playlist.onError();
        this.triggerReady()
    }
};
vjs.Player.prototype.load = function(a) {
    if (a && vjs.IS_FIREFOX && vjs.IS_WINDOWS && "html5" == this.techName) return this;
    this.techCall("load");
    return this
};
vjs.Player.prototype.currentSrc = function() {
    return this.techGet("currentSrc") || this.cache_.src || ""
};
vjs.Player.prototype.currentType = function() {
    return this.currentType_ || ""
};
vjs.Player.prototype.preload = function(a) {
    return void 0 !== a ? (this.techCall("setPreload", a), this.options_.preload = a, this) : this.techGet("preload")
};
vjs.Player.prototype.autoplay = function(a) {
    return void 0 !== a ? (this.techCall("setAutoplay", a), this.options_.autoplay = a, this) : this.techGet("autoplay", a)
};
vjs.Player.prototype.loop = function(a) {
    return void 0 !== a ? (this.techCall("setLoop", a), this.options_.loop = a, this) : this.techGet("loop")
};
vjs.Player.prototype.poster = function(a) {
    if (void 0 === a) return this.poster_;
    this.poster_ = a;
    "undefined" != typeof this.tech && this.techCall("setPoster", a);
    this.trigger("posterchange")
};
vjs.Player.prototype.controls = function(a) {
    return void 0 !== a ? (a = !!a, this.controls_ !== a && ((this.controls_ = a) ? (this.removeClass("vjs-controls-disabled"), this.addClass("vjs-controls-enabled"), this.trigger("controlsenabled")) : (this.removeClass("vjs-controls-enabled"), this.addClass("vjs-controls-disabled"), this.trigger("controlsdisabled"))), this) : this.controls_
};
vjs.Player.prototype.usingNativeControls_;
vjs.Player.prototype.usingNativeControls = function(a) {
    return void 0 !== a ? (a = !!a, this.usingNativeControls_ !== a && ((this.usingNativeControls_ = a) ? (this.addClass("vjs-using-native-controls"), this.trigger("usingnativecontrols")) : (this.removeClass("vjs-using-native-controls"), this.trigger("usingcustomcontrols"))), this) : this.usingNativeControls_
};
vjs.Player.prototype.error_ = null;
vjs.Player.prototype.error = function(a) {
    if (void 0 === a) return this.error_;
    if (null === a) return this.error_ = a, this.removeClass("vjs-error"), this;
    this.error_ = a instanceof vjs.MediaError ? a : new vjs.MediaError(a);
    this.trigger("error");
    this.addClass("vjs-error");
    vjs.log.error("(CODE:" + this.error_.code + " " + vjs.MediaError.errorTypes[this.error_.code] + ")", this.error_.message, this.error_);
    return this
};
vjs.Player.prototype.ended = function() {
    return this.techGet("ended")
};
vjs.Player.prototype.seeking = function() {
    return this.techGet("seeking")
};
vjs.Player.prototype.userActivity_ = !0;
vjs.Player.prototype.reportUserActivity = function(a) {
    this.userActivity_ = !0
};
vjs.Player.prototype.userActive_ = !0;
vjs.Player.prototype.userActive = function(a) {
    if (void 0 !== a) {
        a = !!a;
        if (a !== this.userActive_)
            if (this.userActive_ = a) this.userActivity_ = !0, this.removeClass("vjs-user-inactive"), this.addClass("vjs-user-active"), this.trigger("useractive");
            else {
                this.userActivity_ = !1;
                if (this.tech) this.tech.one("mousemove", function(a) {
                    a.stopPropagation();
                    a.preventDefault()
                });
                this.removeClass("vjs-user-active");
                this.addClass("vjs-user-inactive");
                this.trigger("userinactive")
            }
        return this
    }
    return this.userActive_
};
vjs.Player.prototype.listenForUserActivity = function() {
    var a, b, c, d, e, f;
    a = vjs.bind(this, this.reportUserActivity);
    this.on("mousedown", function() {
        a();
        clearInterval(b);
        b = setInterval(a, 250)
    });
    this.on("mousemove", function(b) {
        if (b.screenX != e || b.screenY != f) e = b.screenX, f = b.screenY, a()
    });
    this.on("mouseup", function(c) {
        a();
        clearInterval(b)
    });
    this.on("keydown", a);
    this.on("keyup", a);
    c = setInterval(vjs.bind(this, function() {
        this.userActivity_ && (this.userActivity_ = !1, this.userActive(!0), clearTimeout(d), d = setTimeout(vjs.bind(this,
            function() {
                this.userActivity_ || this.userActive(!1)
            }), 2E3))
    }), 250);
    this.on("dispose", function() {
        clearInterval(c);
        clearTimeout(d)
    })
};
vjs.Player.prototype.playbackRate = function(a) {
    return void 0 !== a ? (this.techCall("setPlaybackRate", a), this) : this.tech && this.tech.features && this.tech.features.playbackRate ? this.techGet("playbackRate") : 1
};
vjs.ControlBar = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        a.one("RisLive", function() {
            this.addClass("vjs-live");
            this.controlBar.el_.removeChild(this.controlBar.currentTimeDisplay.el_);
            this.controlBar.el_.removeChild(this.controlBar.timeDivider.el_);
            this.controlBar.el_.removeChild(this.controlBar.durationDisplay.el_)
        });
        a.on("RisMobile", function() {
            vjs.defaultControls || this.player_.controlBar.progressControl.addClass("vjs-mobile-progress")
        });
        this.on("mouseover", function() {
            this.addClass("vjs-mouseover")
        });
        this.on("mouseout", function(a) {
            vjs.isDescendant(this.el_, a.relatedTarget) || this.removeClass("vjs-mouseover")
        })
    }
});
vjs.ControlBar.prototype.options_ = {
    loadEvent: "play",
    children: {
        playToggle: {},
        currentTimeDisplay: {},
        timeDivider: {},
        durationDisplay: {},
        remainingTimeDisplay: {},
        liveDisplay: {},
        progressControl: {},
        fullscreenToggle: {},
        volumeControl: {},
        muteToggle: {},
        playbackRateMenuButton: {}
    }
};
vjs.ControlBar.prototype.createEl = function() {
    return vjs.createEl("div", {
        className: "vjs-control-bar"
    })
};
vjs.LiveDisplay = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        var c = "click";
        vjs.IS_IPAD && (c = "touchstart");
        this.on(c, function(b) {
            this.player_.isLive && (this.player_.currentTime(2 * this.player_.duration()), a.addClass("vjs-live-focused"))
        });
        a.on("seek", function() {
            a.one("play", function() {
                a.removeClass("vjs-live-focused")
            })
        })
    }
});
vjs.LiveDisplay.prototype.createEl = function() {
    var a = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-live-controls vjs-control"
    });
    this.contentEl_ = vjs.createEl("div", {
        className: "vjs-live-display",
        innerHTML: '<span class="vjs-control-text">' + this.localize("Stream Type") + "</span>" + this.localize("LIVE"),
        "aria-live": "off"
    });
    var b = vjs.createEl("img", {
        className: "vjs-live-display-icon",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAADZAADZAADZAADZAADZAADZAADZAADZAADYAADZAADZAADZAADZAADZAADZAAAQIAQFAAAAD3RSTlMAzPFcG7mkLuCXi39MCnC+osFeAAAAXUlEQVQI12NgYHBOFN3OAAQ88v//f1oCZDz6DwRfHRh49P+DQC6D438w+MxgD2F8ZMj/DwEM8hiMeBhjP4T+xFAEYfxk4IIw2hlYIIoMGBjcQHQz0FJew///NQsYAOCHXvFBIMIGAAAAAElFTkSuQmCC"
    });
    a.appendChild(b);
    a.appendChild(this.contentEl_);
    return a
};
vjs.PlayToggle = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click";
        this.off("click");
        this.off("touchstart");
        this.off("touchend");
        this.off("touchcancel");
        this.on(c, this.onClick);
        a.on("play", vjs.bind(this, this.onPlay));
        a.on("pause", vjs.bind(this, this.onPause))
    }
});
vjs.PlayToggle.prototype.buttonText = "Play";
vjs.PlayToggle.prototype.buildCSSClass = function() {
    return "vjs-play-control " + vjs.Button.prototype.buildCSSClass.call(this)
};
vjs.PlayToggle.prototype.onClick = function() {
    this.player_.paused() ? this.player_.play() : (this.player_.trigger("RpauseClick"), this.player_.pause())
};
vjs.PlayToggle.prototype.onPlay = function() {
    vjs.removeClass(this.el_, "vjs-paused");
    vjs.addClass(this.el_, "vjs-playing");
    this.el_.children[0].children[0].innerHTML = this.localize("Pause")
};
vjs.PlayToggle.prototype.onPause = function() {
    vjs.removeClass(this.el_, "vjs-playing");
    vjs.addClass(this.el_, "vjs-paused");
    this.el_.children[0].children[0].innerHTML = this.localize("Play")
};
vjs.CurrentTimeDisplay = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        a.on("timeupdate", vjs.bind(this, this.updateContent))
    }
});
vjs.CurrentTimeDisplay.prototype.createEl = function() {
    var a = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-current-time vjs-time-controls vjs-control"
    });
    this.contentEl_ = vjs.createEl("div", {
        className: "vjs-current-time-display",
        innerHTML: '<span class="vjs-control-text">Current Time </span>0:00',
        "aria-live": "off"
    });
    a.appendChild(this.contentEl_);
    return a
};
vjs.CurrentTimeDisplay.prototype.updateContent = function() {
    var a = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime();
    this.contentEl_.innerHTML = '<span class="vjs-control-text">' + this.localize("Current Time") + "</span> " + vjs.formatTime(a, this.player_.duration())
};
vjs.DurationDisplay = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        a.on("timeupdate", vjs.bind(this, this.updateContent))
    }
});
vjs.DurationDisplay.prototype.createEl = function() {
    var a = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-duration vjs-time-controls vjs-control"
    });
    this.contentEl_ = vjs.createEl("div", {
        className: "vjs-duration-display",
        innerHTML: '<span class="vjs-control-text">' + this.localize("Duration Time") + "</span> 0:00",
        "aria-live": "off"
    });
    a.appendChild(this.contentEl_);
    return a
};
vjs.DurationDisplay.prototype.updateContent = function() {
    var a = this.player_.duration();
    a && (this.contentEl_.innerHTML = '<span class="vjs-control-text">' + this.localize("Duration Time") + "</span> " + vjs.formatTime(a))
};
vjs.TimeDivider = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b)
    }
});
vjs.TimeDivider.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-time-divider",
        innerHTML: "<div><span>/</span></div>"
    })
};
vjs.RemainingTimeDisplay = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        a.on("timeupdate", vjs.bind(this, this.updateContent))
    }
});
vjs.RemainingTimeDisplay.prototype.createEl = function() {
    var a = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-remaining-time vjs-time-controls vjs-control"
    });
    this.contentEl_ = vjs.createEl("div", {
        className: "vjs-remaining-time-display",
        innerHTML: '<span class="vjs-control-text">' + this.localize("Remaining Time") + "</span> -0:00",
        "aria-live": "off"
    });
    a.appendChild(this.contentEl_);
    return a
};
vjs.RemainingTimeDisplay.prototype.updateContent = function() {
    this.player_.duration() && (this.contentEl_.innerHTML = '<span class="vjs-control-text">' + this.localize("Remaining Time") + "</span> -" + vjs.formatTime(this.player_.remainingTime()))
};
vjs.FullscreenToggle = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click";
        this.off("click");
        this.off("touchstart");
        this.off("touchend");
        this.off("touchcancel");
        this.on(c, this.onClick)
    }
});
vjs.FullscreenToggle.prototype.buttonText = "Fullscreen";
vjs.FullscreenToggle.prototype.buildCSSClass = function() {
    return "vjs-fullscreen-control " + vjs.Button.prototype.buildCSSClass.call(this)
};
vjs.FullscreenToggle.prototype.onClick = function() {
    this.player_.isFullscreen() ? (this.player_.exitFullscreen(), this.controlText_.innerHTML = this.localize("Fullscreen")) : (this.player_.requestFullscreen(), this.controlText_.innerHTML = this.localize("Non-Fullscreen"))
};
vjs.ProgressControl = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        var c = this;
        a.on(["Rresize", "RskinChanged", "RisLive", "durationchange", "play"], vjs.bind(this, this.fixDimensions));
        a.one(["RstartRequested", "play"], function(b) {
            "RstartRequested" == b.type ? c.fixDimensionsInit() : clearInterval(a.progressBarInterval)
        })
    }
});
vjs.ProgressControl.prototype.options_ = {
    children: {
        seekBar: {}
    }
};
vjs.ProgressControl.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-progress-control vjs-control"
    })
};
vjs.SeekBar = vjs.Slider.extend({
    init: function(a, b) {
        vjs.Slider.call(this, a, b);
        a.on("timeupdate", vjs.bind(this, this.updateARIAAttributes));
        a.ready(vjs.bind(this, this.updateARIAAttributes));
        this.buffering = !0;
        var c = this;
        a.on("waiting", function() {
            c.buffering = !0
        });
        a.on("play", function() {
            c.buffering = !1;
            c.bufferOnScrub = !1
        });
        a.on("nextvideo", function() {
            c.bufferOnScrub = !1
        })
    }
});
vjs.SeekBar.prototype.options_ = {
    children: {
        loadProgressBar: {},
        playProgressBar: {},
        seekHandle: {}
    },
    barName: "playProgressBar",
    handleName: "seekHandle"
};
vjs.SeekBar.prototype.playerEvent = "timeupdate";
vjs.SeekBar.prototype.createEl = function() {
    return vjs.Slider.prototype.createEl.call(this, "div", {
        className: "vjs-progress-holder",
        "aria-label": "video progress bar"
    })
};
vjs.SeekBar.prototype.updateARIAAttributes = function() {
    var a = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime();
    this.el_.setAttribute("aria-valuenow", vjs.round(100 * this.getPercent(), 2));
    this.el_.setAttribute("aria-valuetext", vjs.formatTime(a, this.player_.duration()))
};
vjs.SeekBar.prototype.getPercent = function() {
    return this.player_.scrubbing || this.bufferOnScrub ? this.givenDistance : Math.min(1, this.player_.currentTime() / Math.max(this.player_.duration(), .1))
};
vjs.SeekBar.prototype.onMouseDown = function(a) {
    vjs.Slider.prototype.onMouseDown.call(this, a);
    this.player_.scrubbing = !0;
    this.givenDistance = this.calculateDistance(a);
    this.videoWasPlaying = !this.player_.paused();
    this.player_.pause()
};
vjs.SeekBar.prototype.onMouseMove = function(a) {
    a = this.calculateDistance(a);
    var b = a * this.player_.duration();
    1 > Math.abs(b - this.player_.duration()) && (b = this.player_.duration() - 1);
    this.player_.currentTime(b);
    this.player_.trigger("seek");
    this.givenDistance = a
};
vjs.SeekBar.prototype.onMouseUp = function(a) {
    vjs.Slider.prototype.onMouseUp.call(this, a);
    this.player_.scrubbing = !1;
    this.videoWasPlaying && this.player_.play();
    this.bufferOnScrub = this.buffering ? !0 : !1
};
vjs.SeekBar.prototype.stepForward = function() {
    this.player_.currentTime(this.player_.currentTime() + 5);
    this.player_.trigger("seek")
};
vjs.SeekBar.prototype.stepBack = function() {
    this.player_.currentTime(this.player_.currentTime() - 5);
    this.player_.trigger("seek")
};
vjs.LoadProgressBar = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        a.on("progress", vjs.bind(this, this.update))
    }
});
vjs.LoadProgressBar.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-load-progress",
        innerHTML: '<span class="vjs-control-text"><span>' + this.localize("Loaded") + "</span>: 0%</span>"
    })
};
vjs.LoadProgressBar.prototype.update = function() {
    var a, b, c, d, e = this.player_.buffered();
    a = this.player_.duration();
    var f = this.player_.bufferedEnd(),
        g = this.el_.children,
        k = function(a, b) {
            isFinite(a) || (a = 0);
            return 100 * (a / b || 0) + "%"
        };
    this.el_.style.width = k(f, a);
    for (a = 0; a < e.length; a++) b = e.start(a), c = e.end(a), (d = g[a]) || (d = this.el_.appendChild(vjs.createEl())), d.style.left = k(b, f), d.style.width = k(c - b, f);
    for (a = g.length; a > e.length; a--) this.el_.removeChild(g[a - 1])
};
vjs.PlayProgressBar = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b)
    }
});
vjs.PlayProgressBar.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-play-progress",
        innerHTML: '<span class="vjs-control-text"><span>' + this.localize("Progress") + "</span>: 0%</span>"
    })
};
vjs.SeekHandle = vjs.SliderHandle.extend({
    init: function(a, b) {
        vjs.SliderHandle.call(this, a, b);
        a.on("timeupdate", vjs.bind(this, this.updateContent))
    }
});
vjs.SeekHandle.prototype.defaultValue = "00:00";
vjs.SeekHandle.prototype.createEl = function() {
    return vjs.SliderHandle.prototype.createEl.call(this, "div", {
        className: "vjs-seek-handle",
        "aria-live": "off"
    })
};
vjs.SeekHandle.prototype.updateContent = function() {
    var a = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime();
    this.el_.innerHTML = '<span class="vjs-control-text">' + vjs.formatTime(a, this.player_.duration()) + "</span>"
};
vjs.VolumeControl = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        a.tech && a.tech.features && !1 === a.tech.features.volumeControl && this.addClass("vjs-hidden");
        a.on("loadstart", vjs.bind(this, function() {
            a.tech.features && !1 === a.tech.features.volumeControl ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden")
        }))
    }
});
vjs.VolumeControl.prototype.options_ = {
    children: {
        volumeBar: {}
    }
};
vjs.VolumeControl.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-volume-control vjs-control"
    })
};
vjs.VolumeBar = vjs.Slider.extend({
    init: function(a, b) {
        vjs.Slider.call(this, a, b);
        a.on("volumechange", vjs.bind(this, this.updateARIAAttributes));
        a.ready(vjs.bind(this, this.updateARIAAttributes))
    }
});
vjs.VolumeBar.prototype.updateARIAAttributes = function() {
    this.el_.setAttribute("aria-valuenow", vjs.round(100 * this.player_.volume(), 2));
    this.el_.setAttribute("aria-valuetext", vjs.round(100 * this.player_.volume(), 2) + "%")
};
vjs.VolumeBar.prototype.options_ = {
    children: {
        volumeLevel: {},
        volumeHandle: {}
    },
    barName: "volumeLevel",
    handleName: "volumeHandle"
};
vjs.VolumeBar.prototype.playerEvent = "volumechange";
vjs.VolumeBar.prototype.createEl = function() {
    return vjs.Slider.prototype.createEl.call(this, "div", {
        className: "vjs-volume-bar",
        "aria-label": "volume level"
    })
};
vjs.VolumeBar.prototype.onMouseMove = function(a) {
    this.player_.muted() && this.player_.muted(!1);
    this.player_.volume(this.calculateDistance(a))
};
vjs.VolumeBar.prototype.getPercent = function() {
    return this.player_.muted() ? 0 : this.player_.volume()
};
vjs.VolumeBar.prototype.stepForward = function() {
    this.player_.volume(this.player_.volume() + .1)
};
vjs.VolumeBar.prototype.stepBack = function() {
    this.player_.volume(this.player_.volume() - .1)
};
vjs.VolumeLevel = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b)
    }
});
vjs.VolumeLevel.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-volume-level",
        innerHTML: '<span class="vjs-control-text"></span>'
    })
};
vjs.VolumeHandle = vjs.SliderHandle.extend({
    init: function(a, b) {
        vjs.SliderHandle.call(this, a, b);
        this.on("mousedown", function() {
            this.player_.muted() && this.player_.volume(.001)
        })
    }
});
vjs.VolumeHandle.prototype.defaultValue = "00:00";
vjs.VolumeHandle.prototype.createEl = function() {
    return vjs.SliderHandle.prototype.createEl.call(this, "div", {
        className: "vjs-volume-handle"
    })
};
vjs.MuteToggle = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        a.on("volumechange", vjs.bind(this, this.update));
        a.tech && a.tech.features && !1 === a.tech.features.volumeControl && this.addClass("vjs-hidden");
        a.on("loadstart", vjs.bind(this, function() {
            a.tech.features && !1 === a.tech.features.volumeControl ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden")
        }))
    }
});
vjs.MuteToggle.prototype.createEl = function() {
    return vjs.Button.prototype.createEl.call(this, "div", {
        className: "vjs-mute-control vjs-control",
        innerHTML: '<div><span class="vjs-control-text">' + this.localize("Mute") + "</span></div>"
    })
};
vjs.MuteToggle.prototype.onClick = function() {
    this.player_.muted(this.player_.muted() ? !1 : !0)
};
vjs.MuteToggle.prototype.update = function() {
    var a = this.player_.volume(),
        b = 3;
    0 === a || this.player_.muted() ? b = 0 : .33 > a ? b = 1 : .67 > a && (b = 2);
    this.player_.muted() ? this.el_.children[0].children[0].innerHTML != this.localize("Unmute") && (this.el_.children[0].children[0].innerHTML = this.localize("Unmute")) : this.el_.children[0].children[0].innerHTML != this.localize("Mute") && (this.el_.children[0].children[0].innerHTML = this.localize("Mute"));
    for (a = 0; 4 > a; a++) vjs.removeClass(this.el_, "vjs-vol-" + a);
    vjs.addClass(this.el_, "vjs-vol-" +
        b)
};
vjs.VolumeMenuButton = vjs.MenuButton.extend({
    init: function(a, b) {
        vjs.MenuButton.call(this, a, b);
        a.on("volumechange", vjs.bind(this, this.update));
        a.tech && a.tech.features && !1 === a.tech.features.volumeControl && this.addClass("vjs-hidden");
        a.on("loadstart", vjs.bind(this, function() {
            a.tech.features && !1 === a.tech.features.volumeControl ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden")
        }));
        this.addClass("vjs-menu-button")
    }
});
vjs.VolumeMenuButton.prototype.createMenu = function() {
    var a = new vjs.Menu(this.player_, {
            contentElType: "div"
        }),
        b = new vjs.VolumeBar(this.player_, vjs.obj.merge({
            vertical: !0
        }, this.options_.volumeBar));
    a.addChild(b);
    return a
};
vjs.VolumeMenuButton.prototype.onClick = function() {
    vjs.MuteToggle.prototype.onClick.call(this);
    vjs.MenuButton.prototype.onClick.call(this)
};
vjs.VolumeMenuButton.prototype.createEl = function() {
    return vjs.Button.prototype.createEl.call(this, "div", {
        className: "vjs-volume-menu-button vjs-menu-button vjs-control",
        innerHTML: '<div><span class="vjs-control-text">' + this.localize("Mute") + "</span></div>"
    })
};
vjs.VolumeMenuButton.prototype.update = vjs.MuteToggle.prototype.update;
vjs.PlaybackRateMenuButton = vjs.MenuButton.extend({
    init: function(a, b) {
        vjs.MenuButton.call(this, a, b);
        this.updateVisibility();
        this.updateLabel();
        a.on("loadstart", vjs.bind(this, this.updateVisibility));
        a.on("ratechange", vjs.bind(this, this.updateLabel))
    }
});
vjs.PlaybackRateMenuButton.prototype.createEl = function() {
    var a = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-playback-rate vjs-menu-button vjs-control",
        innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + this.localize("Playback Rate") + "</span></div>"
    });
    this.labelEl_ = vjs.createEl("div", {
        className: "vjs-playback-rate-value",
        innerHTML: 1
    });
    a.appendChild(this.labelEl_);
    return a
};
vjs.PlaybackRateMenuButton.prototype.createMenu = function() {
    var a = new vjs.Menu(this.player()),
        b = this.player().options().playbackRates;
    if (b)
        for (var c = b.length - 1; 0 <= c; c--) a.addChild(new vjs.PlaybackRateMenuItem(this.player(), {
            rate: b[c] + "x"
        }));
    return a
};
vjs.PlaybackRateMenuButton.prototype.updateARIAAttributes = function() {
    this.el().setAttribute("aria-valuenow", this.player().playbackRate())
};
vjs.PlaybackRateMenuButton.prototype.onClick = function() {
    for (var a = this.player().playbackRate(), b = this.player().options().playbackRates, c = b[0], d = 0; d < b.length; d++)
        if (b[d] > a) {
            c = b[d];
            break
        }
    this.player().playbackRate(c)
};
vjs.PlaybackRateMenuButton.prototype.playbackRateSupported = function() {
    return this.player().tech && this.player().tech.features.playbackRate && this.player().options().playbackRates && 0 < this.player().options().playbackRates.length
};
vjs.PlaybackRateMenuButton.prototype.updateVisibility = function() {
    this.playbackRateSupported() ? this.removeClass("vjs-hidden") : this.addClass("vjs-hidden")
};
vjs.PlaybackRateMenuButton.prototype.updateLabel = function() {
    this.playbackRateSupported() && (this.labelEl_.innerHTML = this.player().playbackRate() + "x")
};
vjs.PlaybackRateMenuItem = vjs.MenuItem.extend({
    contentElType: "button",
    init: function(a, b) {
        var c = this.label = b.rate,
            d = this.rate = parseFloat(c, 10);
        b.label = c;
        b.selected = 1 === d;
        vjs.MenuItem.call(this, a, b);
        this.player().on("ratechange", vjs.bind(this, this.update))
    }
});
vjs.PlaybackRateMenuItem.prototype.onClick = function() {
    vjs.MenuItem.prototype.onClick.call(this);
    this.player().playbackRate(this.rate)
};
vjs.PlaybackRateMenuItem.prototype.update = function() {
    this.selected(this.player().playbackRate() == this.rate)
};
vjs.PosterImage = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        vjs.IS_MOBILE && (this.hidden = !0, this.hide());
        a.poster() && this.src(a.poster());
        a.ready(function() {
            a.techName && "html5" == a.techName.toLowerCase() && !a.hasNegativePlid() && setTimeout(function() {
                a.startScreen.posterImage.show()
            }, 0)
        });
        a.on("posterchange", vjs.bind(this, function() {
            this.src(a.poster())
        }));
        a.on("RsetPoster", function() {
            this.startScreen.posterImage.fixDimensions(this)
        });
        a.on("Rresize", function() {
            this.startScreen.posterImage.fixDimensions()
        });
        var c = "click";
        if ((vjs.IS_ANDROID || vjs.IS_IPAD) && /html5|flash/i.test(a.techName) || vjs.IS_MOBILE && "vimeo" == a.techName.toLowerCase()) c = "touchstart";
        this.on(c, function(a) {
            this.player_.initialClick.apply(this.player_, [a])
        })
    }
});
var _backgroundSizeSupported = "backgroundSize" in vjs.TEST_VID.style;
vjs.PosterImage.prototype.createEl = function() {
    var a = vjs.createEl("div", {
        className: "vjs-poster",
        tabIndex: -1
    });
    _backgroundSizeSupported || a.appendChild(vjs.createEl("img"));
    !vjs.IS_MOBILE || (vjs.IS_ANDROID || vjs.IS_IPAD) && /html5|flash/i.test(this.player_.techName) || (vjs.IS_CHROME || vjs.IS_WINDOWS_PHONE) && "vimeo" == this.player_.techName.toLowerCase() || (a.style.pointerEvents = "none");
    return a
};
vjs.PosterImage.prototype.src = function(a) {
    var b = this.el();
    void 0 !== a && (_backgroundSizeSupported ? b.style.backgroundImage = 'url("' + a + '")' : b.firstChild.src = a)
};
vjs.PosterImage.prototype.onClick = function() {};
vjs.LoadingSpinner = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.inStartScreen = !1;
        a.one("RstartRequested", function() {
            this.loadingSpinner.inStartScreen = !0;
            a.one("playing", function() {
                this.loadingSpinner.inStartScreen = !1
            })
        });
        a.on("RshowLoadingSpinner", vjs.bind(this, this.show));
        a.on("RloadNextVideo", vjs.bind(this, this.show));
        a.on("timeupdate", vjs.bind(this, this.hide));
        a.on("RhideLoadingSpinner", vjs.bind(this, this.hide));
        a.on("RdimensionsChanged", vjs.bind(a, this.fixPosition))
    }
});
vjs.LoadingSpinner.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-loading-spinner"
    })
};
vjs.LoadingSpinner.prototype.show = function() {
    return this.inStartScreen || vjs.arrayContains(vjs.defaultSpinners, this.player_.techName) && this.player_.isReady_ && this.player_.options_.playerStarted ? this.player_.onWaitEnd() : this.player_.onWaiting()
};
vjs.LoadingSpinner.prototype.hide = function() {
    return this.player_.onWaitEnd()
};
vjs.ErrorDisplay = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.update();
        a.on("error", vjs.bind(this, this.update))
    }
});
vjs.ErrorDisplay.prototype.createEl = function() {
    var a = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-error-display"
    });
    this.contentEl_ = vjs.createEl("div");
    a.appendChild(this.contentEl_);
    return a
};
vjs.ErrorDisplay.prototype.update = function() {
    this.player().error() && (this.contentEl_.innerHTML = this.localize(this.player().error().message))
};
vjs.MediaTechController = vjs.Component.extend({
    init: function(a, b, c) {
        b = b || {};
        b.reportTouchActivity = !1;
        vjs.Component.call(this, a, b, c);
        this.features.progressEvents || this.manualProgressOn();
        this.features.timeupdateEvents || this.manualTimeUpdatesOn();
        this.initControlsListeners()
    }
});
vjs.MediaTechController.prototype.controlsCompatibleTechs = ["html5", "flash"];
vjs.MediaTechController.prototype.initControlsListeners = function() {
    var a, b, c;
    b = this;
    a = this.player();
    c = function() {
        a.controls() && !a.usingNativeControls() && b.addControlsListeners()
    };
    this.ready(c);
    a.on("controlsenabled", c);
    a.on("controlsdisabled", function() {
        vjs.bind(this.tech, this.tech.removeControlsListeners)
    });
    this.ready(function() {
        this.networkState && 0 < this.networkState() && this.player().trigger("loadstart")
    })
};
vjs.MediaTechController.prototype.addControlsListeners = function() {
    if (-1 == this.controlsCompatibleTechs.indexOf(this.player_.techName.toLowerCase())) return !1;
    var a;
    this.on("mousedown", this.onClick);
    this.on("touchstart", function(b) {
        a = this.player_.userActive()
    });
    this.on("touchmove", function(b) {
        a && this.player().reportUserActivity()
    });
    this.on("touchend", function(a) {
        a.preventDefault()
    });
    this.emitTapEvents();
    this.on("tap", this.onTap)
};
vjs.MediaTechController.prototype.removeControlsListeners = function() {
    if ("undefined" != typeof this.player_.lastTech && -1 == this.controlsCompatibleTechs.indexOf(this.player_.lastTech.toLowerCase())) return !1;
    this.off("tap");
    this.off("touchstart");
    this.off("touchmove");
    this.off("touchleave");
    this.off("touchcancel");
    this.off("touchend");
    this.off("click");
    this.off("mousedown")
};
vjs.MediaTechController.prototype.onClick = function(a) {
    0 === a.button && this.player().controls() && (this.player().paused() ? this.player().play() : this.player().pause())
};
vjs.MediaTechController.prototype.onTap = function() {
    this.player().userActive(!this.player().userActive())
};
vjs.MediaTechController.prototype.manualProgressOn = function() {
    this.manualProgress = !0;
    this.trackProgress()
};
vjs.MediaTechController.prototype.manualProgressOff = function() {
    this.manualProgress = !1;
    this.stopTrackingProgress()
};
vjs.MediaTechController.prototype.trackProgress = function() {
    this.progressInterval = setInterval(vjs.bind(this, function() {
        var a = this.player().bufferedPercent();
        this.bufferedPercent_ != a && this.player().trigger("progress");
        this.bufferedPercent_ = a;
        1 === a && this.stopTrackingProgress()
    }), 500)
};
vjs.MediaTechController.prototype.stopTrackingProgress = function() {
    clearInterval(this.progressInterval)
};
vjs.MediaTechController.prototype.manualTimeUpdatesOn = function() {
    this.manualTimeUpdates = !0;
    this.player().on("play", vjs.bind(this, this.trackCurrentTime));
    this.player().on("pause", vjs.bind(this, this.stopTrackingCurrentTime));
    this.one("timeupdate", function() {
        this.features.timeupdateEvents = !0;
        this.manualTimeUpdatesOff()
    })
};
vjs.MediaTechController.prototype.manualTimeUpdatesOff = function() {
    this.manualTimeUpdates = !1;
    this.stopTrackingCurrentTime();
    this.off("play", this.trackCurrentTime);
    this.off("pause", this.stopTrackingCurrentTime)
};
vjs.MediaTechController.prototype.trackCurrentTime = function() {
    this.currentTimeInterval && this.stopTrackingCurrentTime();
    this.currentTimeInterval = setInterval(vjs.bind(this, function() {
        this.player().trigger("timeupdate")
    }), 250)
};
vjs.MediaTechController.prototype.stopTrackingCurrentTime = function() {
    clearInterval(this.currentTimeInterval);
    this.player().trigger("timeupdate")
};
vjs.MediaTechController.prototype.dispose = function() {
    this.manualProgress && this.manualProgressOff();
    this.manualTimeUpdates && this.manualTimeUpdatesOff();
    vjs.Component.prototype.dispose.call(this)
};
vjs.MediaTechController.prototype.setCurrentTime = function() {
    this.manualTimeUpdates && this.player().trigger("timeupdate")
};
vjs.MediaTechController.prototype.setPoster = function() {};
vjs.MediaTechController.prototype.features = {
    volumeControl: !0,
    fullscreenResize: !1,
    playbackRate: !1,
    progressEvents: !1,
    timeupdateEvents: !1
};
vjs.media = {};
vjs.Html5 = vjs.MediaTechController.extend({
    init: function(a, b, c) {
        this.features.volumeControl = vjs.Html5.canControlVolume();
        this.features.playbackRate = vjs.Html5.canControlPlaybackRate();
        this.features.movingMediaElementInDOM = !vjs.IS_IOS;
        this.features.fullscreenResize = !0;
        this.features.progressEvents = !0;
        vjs.MediaTechController.call(this, a, b, c);
        this.setupTriggers();
        (b = b.source) && this.el_.currentSrc !== b.src && (this.el_.src = b.src);
        vjs.TOUCH_ENABLED && a.options();
        a.ready(function() {
            this.tag && this.options_.autoplay && this.paused() &&
                delete this.tag.poster
        });
        this.triggerReady()
    }
});
vjs.Html5.prototype.dispose = function() {
    vjs.Html5.disposeMediaElement(this.el_);
    vjs.MediaTechController.prototype.dispose.call(this)
};
vjs.Html5.prototype.createEl = function() {
    var a = this.player_,
        b = a.tag,
        c;
    b && !1 !== this.features.movingMediaElementInDOM || (b ? (c = b.cloneNode(!1), vjs.Html5.disposeMediaElement(b), b = c, a.tag = null) : (b = vjs.createEl("video"), vjs.setElementAttributes(b, vjs.obj.merge(a.tagAttributes || {}, {
        id: a.id() + "_html5_api",
        "class": "vjs-tech"
    }))), this.player_.hasNegativePlid() && this.prepareInread(b), b.player = a, vjs.insertFirst(b, a.el()));
    c = ["autoplay", "preload", "loop", "muted"];
    for (var d = c.length - 1; 0 <= d; d--) {
        var e = c[d],
            f = {};
        "undefined" !==
        typeof a.options_[e] && (f[e] = a.options_[e]);
        vjs.setElementAttributes(b, f)
    }
    return b
};
vjs.Html5.prototype.setupTriggers = function() {
    for (var a = vjs.Html5.Events.length - 1; 0 <= a; a--) vjs.on(this.el_, vjs.Html5.Events[a], vjs.bind(this, this.eventHandler))
};
vjs.Html5.prototype.eventHandler = function(a) {
    if ("error" == a.type) this.player().Playlist.onError();
    else a.bubbles = !1, this.player().trigger(a)
};
vjs.Html5.prototype.useNativeControls = function() {
    var a, b, c, d, e;
    a = this;
    b = this.player();
    a.setControls(b.controls());
    c = function() {
        a.setControls(!0)
    };
    d = function() {
        a.setControls(!1)
    };
    b.on("controlsenabled", c);
    b.on("controlsdisabled", d);
    e = function() {
        b.off("controlsenabled", c);
        b.off("controlsdisabled", d)
    };
    a.on("dispose", e);
    b.on("usingcustomcontrols", e);
    b.usingNativeControls(!0)
};
vjs.Html5.prototype.play = function() {
    this.el_.play()
};
vjs.Html5.prototype.pause = function() {
    this.el_.pause()
};
vjs.Html5.prototype.paused = function() {
    return this.el_.paused
};
vjs.Html5.prototype.currentTime = function() {
    return this.el_.currentTime
};
vjs.Html5.prototype.setCurrentTime = function(a) {
    try {
        this.el_.currentTime = a
    } catch (b) {
        vjs.log(b, "Video is not ready. (Video.js)")
    }
};
vjs.Html5.prototype.duration = function() {
    return this.el_.duration || 0
};
vjs.Html5.prototype.buffered = function() {
    return this.el_.buffered
};
vjs.Html5.prototype.volume = function() {
    return this.el_.volume
};
vjs.Html5.prototype.setVolume = function(a) {
    this.el_.volume = a
};
vjs.Html5.prototype.muted = function() {
    return this.el_.muted
};
vjs.Html5.prototype.setMuted = function(a) {
    this.el_.muted = a
};
vjs.Html5.prototype.width = function() {
    return this.el_.offsetWidth
};
vjs.Html5.prototype.height = function() {
    return this.el_.offsetHeight
};
vjs.Html5.prototype.supportsFullScreen = function() {
    return "function" != typeof this.el_.webkitEnterFullScreen || !/Android/.test(vjs.USER_AGENT) && /Chrome|Mac OS X 10.5/.test(vjs.USER_AGENT) ? !1 : !0
};
vjs.Html5.prototype.enterFullScreen = function() {
    var a = this.el_;
    a.paused && a.networkState <= a.HAVE_METADATA ? (this.el_.play(), setTimeout(function() {
        a.pause();
        a.webkitEnterFullScreen()
    }, 0)) : a.webkitEnterFullScreen()
};
vjs.Html5.prototype.exitFullScreen = function() {
    this.el_.webkitExitFullScreen()
};
vjs.Html5.prototype.prepareInread = function(a) {
    this.player_.mutedFlag = 1;
    a.setAttribute("playsinline", "");
    a.setAttribute("controls", "0");
    a.setAttribute("muted", "");
    a.muted = !0
};
vjs.Html5.prototype.src = function(a) {
    this.player_.cache_.isAd && this.player_.hasNegativePlid() && this.prepareInread(this.el_);
    this.el_.src = a
};
vjs.Html5.prototype.load = function() {
    this.el_.load()
};
vjs.Html5.prototype.currentSrc = function() {
    return this.el_.currentSrc
};
vjs.Html5.prototype.poster = function() {
    return this.el_.poster
};
vjs.Html5.prototype.setPoster = function(a) {
    this.el_.poster = a
};
vjs.Html5.prototype.preload = function() {
    return this.el_.preload
};
vjs.Html5.prototype.setPreload = function(a) {
    this.el_.preload = a
};
vjs.Html5.prototype.autoplay = function() {
    return this.el_.autoplay
};
vjs.Html5.prototype.setAutoplay = function(a) {
    this.el_.autoplay = a
};
vjs.Html5.prototype.controls = function() {
    return this.el_.controls
};
vjs.Html5.prototype.setControls = function(a) {
    this.el_.controls = !!a
};
vjs.Html5.prototype.loop = function() {
    return this.el_.loop
};
vjs.Html5.prototype.setLoop = function(a) {
    this.el_.loop = a
};
vjs.Html5.prototype.error = function() {
    return this.el_.error
};
vjs.Html5.prototype.seeking = function() {
    return this.el_.seeking
};
vjs.Html5.prototype.ended = function() {
    return this.el_.ended
};
vjs.Html5.prototype.defaultMuted = function() {
    return this.el_.defaultMuted
};
vjs.Html5.prototype.playbackRate = function() {
    return this.el_.playbackRate
};
vjs.Html5.prototype.setPlaybackRate = function(a) {
    this.el_.playbackRate = a
};
vjs.Html5.prototype.networkState = function() {
    return this.el_.networkState
};
vjs.Html5.isSupported = function() {
    try {
        vjs.TEST_VID.volume = .5
    } catch (a) {
        return !1
    }
    return !!vjs.TEST_VID.canPlayType
};
vjs.Html5.canPlaySource = function(a) {
    function b(a) {
        try {
            return !!vjs.TEST_VID.canPlayType(a)
        } catch (b) {
            return ""
        }
    }
    if (a.type) return b(a.type);
    a = a.src.match(/\.([^\/\?]+)(\?[^\/]+)?$/i);
    return null != a && a[1] && b("video/" + a[1])
};
vjs.Html5.canControlVolume = function() {
    var a = vjs.TEST_VID.volume;
    vjs.TEST_VID.volume = a / 2 + .1;
    return a !== vjs.TEST_VID.volume
};
vjs.Html5.canControlPlaybackRate = function() {
    var a = vjs.TEST_VID.playbackRate;
    vjs.TEST_VID.playbackRate = a / 2 + .1;
    return a !== vjs.TEST_VID.playbackRate
};
(function() {
    var a, b = /^application\/(?:x-|vnd\.apple\.)mpegurl/i,
        c = /^video\/mp4/i;
    vjs.Html5.patchCanPlayType = function() {
        4 <= vjs.ANDROID_VERSION && (a || (a = vjs.TEST_VID.constructor.prototype.canPlayType), vjs.TEST_VID.constructor.prototype.canPlayType = function(c) {
            return c && b.test(c) ? "maybe" : a.call(this, c)
        });
        vjs.IS_OLD_ANDROID && (a || (a = vjs.TEST_VID.constructor.prototype.canPlayType), vjs.TEST_VID.constructor.prototype.canPlayType = function(b) {
            return b && c.test(b) ? "maybe" : a.call(this, b)
        })
    };
    vjs.Html5.unpatchCanPlayType =
        function() {
            var b = vjs.TEST_VID.constructor.prototype.canPlayType;
            vjs.TEST_VID.constructor.prototype.canPlayType = a;
            a = null;
            return b
        };
    vjs.Html5.patchCanPlayType()
})();
vjs.Html5.Events = "loadstart suspend abort error emptied stalled loadedmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate progress play pause ratechange volumechange".split(" ");
vjs.Html5.disposeMediaElement = function(a) {
    if (a) {
        a.player = null;
        for (a.parentNode && a.parentNode.removeChild(a); a.hasChildNodes();) a.removeChild(a.firstChild);
        a.removeAttribute("src");
        if ("function" === typeof a.load) try {
            a.load()
        } catch (b) {}
    }
};
vjs.Flash = vjs.MediaTechController.extend({
    init: function(a, b, c) {
        vjs.MediaTechController.call(this, a, b, c);
        var d = b.source;
        c = b.parentEl;
        var e = this.el_ = vjs.createEl("div", {
                id: a.id() + "_temp_flash"
            }),
            f = a.id() + "_flash_api",
            g = a.options_,
            g = vjs.obj.merge({
                readyFunction: "videojs.Flash.onReady",
                eventProxyFunction: "videojs.Flash.onEvent",
                errorEventProxyFunction: "videojs.Flash.onError",
                autoplay: g.autoplay,
                preload: g.preload,
                loop: g.loop,
                muted: g.muted
            }, b.flashVars),
            k = vjs.obj.merge({
                    wmode: "opaque",
                    bgcolor: "#000000"
                },
                b.params),
            f = vjs.obj.merge({
                id: f,
                name: f,
                "class": "vjs-tech"
            }, b.attributes);
        d && (d.type && vjs.Flash.isStreamingType(d.type) ? (d = vjs.Flash.streamToParts(d.src), g.rtmpConnection = encodeURIComponent(d.connection), g.rtmpStream = encodeURIComponent(d.stream)) : g.src = encodeURIComponent(vjs.getAbsoluteURL(d.src)));
        vjs.insertFirst(e, c);
        b.startTime && this.ready(function() {
            this.load();
            this.play();
            this.currentTime(b.startTime)
        });
        vjs.IS_FIREFOX && this.ready(function() {
            vjs.on(this.el(), "mousemove", vjs.bind(this, function() {
                this.player().trigger({
                    type: "mousemove",
                    bubbles: !1
                })
            }))
        });
        a.on("stageclick", a.reportUserActivity);
        this.el_ = vjs.Flash.embed(b.swf, e, g, k, f)
    }
});
vjs.Flash.prototype.dispose = function() {
    vjs.MediaTechController.prototype.dispose.call(this)
};
vjs.Flash.prototype.play = function() {
    this.el_.vjs_play()
};
vjs.Flash.prototype.pause = function() {
    this.el_.vjs_pause()
};
vjs.Flash.prototype.src = function(a) {
    if (void 0 === a) return this.currentSrc();
    vjs.Flash.isStreamingSrc(a) ? (a = vjs.Flash.streamToParts(a), this.setRtmpConnection(a.connection), this.setRtmpStream(a.stream)) : (a = vjs.getAbsoluteURL(a), this.el_.vjs_src(a));
    this.player_.autoplay()
};
vjs.Flash.prototype.setCurrentTime = function(a) {
    this.lastSeekTarget_ = a;
    this.el_.vjs_setProperty("currentTime", a);
    vjs.MediaTechController.prototype.setCurrentTime.call(this)
};
vjs.Flash.prototype.currentTime = function(a) {
    return this.seeking() ? this.lastSeekTarget_ || 0 : this.el_.vjs_getProperty("currentTime")
};
vjs.Flash.prototype.currentSrc = function() {
    var a = this.el_.vjs_getProperty("currentSrc");
    if (null == a) {
        var b = this.rtmpConnection(),
            c = this.rtmpStream();
        b && c && (a = vjs.Flash.streamFromParts(b, c))
    }
    return a
};
vjs.Flash.prototype.load = function() {
    this.el_.vjs_load()
};
vjs.Flash.prototype.poster = function() {
    this.el_.vjs_getProperty("poster")
};
vjs.Flash.prototype.setPoster = function() {};
vjs.Flash.prototype.buffered = function() {
    return null == this.el_ ? 0 : vjs.createTimeRange(0, this.el_.vjs_getProperty("buffered"))
};
vjs.Flash.prototype.supportsFullScreen = function() {
    return !1
};
vjs.Flash.prototype.enterFullScreen = function() {
    return !1
};
(function() {
    function a(a) {
        var b = a.charAt(0).toUpperCase() + a.slice(1);
        c["set" + b] = function(b) {
            return this.el_.vjs_setProperty(a, b)
        }
    }

    function b(a) {
        c[a] = function() {
            return this.el_.vjs_getProperty(a)
        }
    }
    var c = vjs.Flash.prototype,
        d = "rtmpConnection rtmpStream preload defaultPlaybackRate playbackRate autoplay loop mediaGroup controller controls volume muted defaultMuted".split(" "),
        e = "error networkState readyState seeking initialTime duration startOffsetTime paused played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks".split(" "),
        f;
    for (f = 0; f < d.length; f++) b(d[f]), a(d[f]);
    for (f = 0; f < e.length; f++) b(e[f])
})();
vjs.Flash.isSupported = function() {
    return 10 <= vjs.Flash.version()[0]
};
vjs.Flash.canPlaySource = function(a) {
    a.type ? a = a.type.replace(/;.*/, "").toLowerCase() : (a = a.src.match(/\.([^\/\?]+)(\?[^\/]+)?$/i), a = null != a && a[1] ? "video/" + a[1].toLowerCase() : void 0);
    if (a in vjs.Flash.formats || a in vjs.Flash.streamingFormats) return "maybe"
};
vjs.Flash.formats = {
    "video/flv": "FLV",
    "video/x-flv": "FLV",
    "video/mp4": "MP4",
    "video/m4v": "MP4"
};
vjs.Flash.streamingFormats = {
    "rtmp/mp4": "MP4",
    "rtmp/flv": "FLV"
};
vjs.Flash.onReady = function(a) {
    var b;
    if (b = (a = vjs.el(a)) && a.parentNode && a.parentNode.player) a.player = b, vjs.Flash.checkReady(b.tech)
};
vjs.Flash.checkReady = function(a) {
    a.el() && (a.el().vjs_getProperty ? a.triggerReady() : setTimeout(function() {
        vjs.Flash.checkReady(a)
    }, 50))
};
vjs.Flash.onEvent = function(a, b) {
    vjs.el(a).player.trigger(b)
};
vjs.Flash.onError = function(a, b) {
    var c = vjs.el(a).player;
    if ("srcnotfound" == b) c.Playlist.onError("flash_srcnotfound");
    else c.Playlist.onError("flash_error")
};
vjs.Flash.version = function() {
    var a = "0,0,0";
    try {
        a = (new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
    } catch (b) {
        try {
            navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin && (a = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1])
        } catch (c) {}
    }
    return a.split(",")
};
vjs.Flash.embed = function(a, b, c, d, e) {
    a = vjs.Flash.getEmbedCode(a, c, d, e);
    a = vjs.createEl("div", {
        innerHTML: a
    }).childNodes[0];
    b.parentNode.replaceChild(a, b);
    return a
};
vjs.Flash.getEmbedCode = function(a, b, c, d) {
    var e = "",
        f = "",
        g = "";
    b && vjs.obj.each(b, function(a, b) {
        e += a + "=" + b + "&amp;"
    });
    c = vjs.obj.merge({
        movie: a,
        flashvars: e,
        allowScriptAccess: "always",
        allowNetworking: "all"
    }, c);
    vjs.obj.each(c, function(a, b) {
        f += '<param name="' + a + '" value="' + b + '" />'
    });
    d = vjs.obj.merge({
        data: a,
        width: "100%",
        height: "100%"
    }, d);
    vjs.obj.each(d, function(a, b) {
        g += a + '="' + b + '" '
    });
    return '<object type="application/x-shockwave-flash"' + g + ">" + f + "</object>"
};
vjs.Flash.streamFromParts = function(a, b) {
    return a + "&" + b
};
vjs.Flash.streamToParts = function(a) {
    var b = {
        connection: "",
        stream: ""
    };
    if (!a) return b;
    var c = a.indexOf("&"),
        d; - 1 !== c ? d = c + 1 : (c = d = a.lastIndexOf("/") + 1, 0 === c && (c = d = a.length));
    b.connection = a.substring(0, c);
    b.stream = a.substring(d, a.length);
    return b
};
vjs.Flash.isStreamingType = function(a) {
    return a in vjs.Flash.streamingFormats
};
vjs.Flash.RTMP_RE = /^rtmp[set]?:\/\//i;
vjs.Flash.isStreamingSrc = function(a) {
    return vjs.Flash.RTMP_RE.test(a)
};
vjs.MediaLoader = vjs.Component.extend({
    init: function(a, b, c) {
        vjs.Component.call(this, a, b, c);
        if (a.options_.sources && 0 !== a.options_.sources.length) a.src(a.options_.sources);
        else
            for (b = 0, c = a.options_.techOrder; b < c.length; b++) {
                var d = vjs.capitalize(c[b]),
                    e = window.videojs[d];
                if (e && e.isSupported()) {
                    a.loadTech(d);
                    break
                }
            }
    }
});
vjs.Player.prototype.textTracks = function() {
    return this.textTracks_ = this.textTracks_ || []
};
vjs.Player.prototype.addTextTrack = function(a, b, c, d) {
    var e = this.textTracks_ = this.textTracks_ || [];
    d = d || {};
    d.kind = a;
    d.label = b;
    d.language = c;
    a = vjs.capitalize(a || "subtitles");
    var f = new window.videojs[a + "Track"](this, d);
    e.push(f);
    f.dflt() && this.ready(function() {
        setTimeout(function() {
            f.player().showTextTrack(f.id())
        }, 0)
    });
    return f
};
vjs.Player.prototype.addTextTracks = function(a) {
    for (var b, c = 0; c < a.length; c++) b = a[c], this.addTextTrack(b.kind, b.label, b.language, b);
    return this
};
vjs.Player.prototype.showTextTrack = function(a, b) {
    for (var c = this.textTracks_, d = 0, e = c.length, f, g; d < e; d++) f = c[d], f.id() === a ? (f.show(), g = f) : b && f.kind() == b && 0 < f.mode() && f.disable();
    (c = g ? g.kind() : b ? b : !1) && this.trigger(c + "trackchange");
    return this
};
vjs.TextTrack = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.id_ = b.id || "vjs_" + b.kind + "_" + b.language + "_" + vjs.guid++;
        this.src_ = b.src;
        this.dflt_ = b["default"] || b.dflt;
        this.title_ = b.title;
        this.language_ = b.srclang;
        this.label_ = b.label;
        this.cues_ = [];
        this.activeCues_ = [];
        this.mode_ = this.readyState_ = 0;
        this.player_.on("fullscreenchange", vjs.bind(this, this.adjustFontSize))
    }
});
vjs.TextTrack.prototype.kind = function() {
    return this.kind_
};
vjs.TextTrack.prototype.src = function() {
    return this.src_
};
vjs.TextTrack.prototype.dflt = function() {
    return this.dflt_
};
vjs.TextTrack.prototype.title = function() {
    return this.title_
};
vjs.TextTrack.prototype.language = function() {
    return this.language_
};
vjs.TextTrack.prototype.label = function() {
    return this.label_
};
vjs.TextTrack.prototype.cues = function() {
    return this.cues_
};
vjs.TextTrack.prototype.activeCues = function() {
    return this.activeCues_
};
vjs.TextTrack.prototype.readyState = function() {
    return this.readyState_
};
vjs.TextTrack.prototype.mode = function() {
    return this.mode_
};
vjs.TextTrack.prototype.adjustFontSize = function() {
    this.player_.isFullscreen() ? this.el_.style.fontSize = screen.width / this.player_.width() * 140 + "%" : this.el_.style.fontSize = ""
};
vjs.TextTrack.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-" + this.kind_ + " vjs-text-track"
    })
};
vjs.TextTrack.prototype.show = function() {
    this.activate();
    this.mode_ = 2;
    vjs.Component.prototype.show.call(this)
};
vjs.TextTrack.prototype.hide = function() {
    this.activate();
    this.mode_ = 1;
    vjs.Component.prototype.hide.call(this)
};
vjs.TextTrack.prototype.disable = function() {
    2 == this.mode_ && this.hide();
    this.deactivate();
    this.mode_ = 0
};
vjs.TextTrack.prototype.activate = function() {
    0 === this.readyState_ && this.load();
    0 === this.mode_ && (this.player_.on("timeupdate", vjs.bind(this, this.update, this.id_)), this.player_.on("ended", vjs.bind(this, this.reset, this.id_)), "captions" !== this.kind_ && "subtitles" !== this.kind_ || this.player_.getChild("textTrackDisplay").addChild(this))
};
vjs.TextTrack.prototype.deactivate = function() {
    this.player_.off("timeupdate", vjs.bind(this, this.update, this.id_));
    this.player_.off("ended", vjs.bind(this, this.reset, this.id_));
    this.reset();
    this.player_.getChild("textTrackDisplay").removeChild(this)
};
vjs.TextTrack.prototype.load = function() {
    0 === this.readyState_ && (this.readyState_ = 1, vjs.get(this.src_, vjs.bind(this, this.parseCues), vjs.bind(this, this.onError)))
};
vjs.TextTrack.prototype.onError = function(a) {
    this.error = a;
    this.readyState_ = 3;
    this.trigger("error")
};
vjs.TextTrack.prototype.parseCues = function(a) {
    var b, c;
    a = a.split("\n");
    for (var d, e = 1, f = a.length; e < f; e++)
        if (d = vjs.trim(a[e])) {
            -1 == d.indexOf("--\x3e") ? (b = d, d = vjs.trim(a[++e])) : b = this.cues_.length;
            b = {
                id: b,
                index: this.cues_.length
            };
            c = d.split(/[\t ]+/);
            b.startTime = this.parseCueTime(c[0]);
            b.endTime = this.parseCueTime(c[2]);
            for (c = []; a[++e] && (d = vjs.trim(a[e]));) c.push(d);
            b.text = c.join("<br/>");
            this.cues_.push(b)
        }
    this.readyState_ = 2;
    this.trigger("loaded")
};
vjs.TextTrack.prototype.parseCueTime = function(a) {
    var b = a.split(":");
    a = 0;
    var c, d, e;
    3 == b.length ? (c = b[0], d = b[1], b = b[2]) : (c = 0, d = b[0], b = b[1]);
    b = b.split(/\s+/);
    b = b.splice(0, 1)[0];
    b = b.split(/\.|,/);
    e = parseFloat(b[1]);
    b = b[0];
    a += 3600 * parseFloat(c);
    a += 60 * parseFloat(d);
    a += parseFloat(b);
    e && (a += e / 1E3);
    return a
};
vjs.TextTrack.prototype.update = function() {
    if (0 < this.cues_.length) {
        var a = this.player_.options().trackTimeOffset || 0,
            a = this.player_.currentTime() + a;
        if (void 0 === this.prevChange || a < this.prevChange || this.nextChange <= a) {
            var b = this.cues_,
                c = this.player_.duration(),
                d = 0,
                e = !1,
                f = [],
                g, k, h, p;
            a >= this.nextChange || void 0 === this.nextChange ? p = void 0 !== this.firstActiveIndex ? this.firstActiveIndex : 0 : (e = !0, p = void 0 !== this.lastActiveIndex ? this.lastActiveIndex : b.length - 1);
            for (;;) {
                h = b[p];
                if (h.endTime <= a) d = Math.max(d, h.endTime),
                    h.active && (h.active = !1);
                else if (a < h.startTime) {
                    if (c = Math.min(c, h.startTime), h.active && (h.active = !1), !e) break
                } else e ? (f.splice(0, 0, h), void 0 === k && (k = p), g = p) : (f.push(h), void 0 === g && (g = p), k = p), c = Math.min(c, h.endTime), d = Math.max(d, h.startTime), h.active = !0;
                if (e)
                    if (0 === p) break;
                    else p--;
                else if (p === b.length - 1) break;
                else p++
            }
            this.activeCues_ = f;
            this.nextChange = c;
            this.prevChange = d;
            this.firstActiveIndex = g;
            this.lastActiveIndex = k;
            this.updateDisplay();
            this.trigger("cuechange")
        }
    }
};
vjs.TextTrack.prototype.updateDisplay = function() {
    for (var a = this.activeCues_, b = "", c = 0, d = a.length; c < d; c++) b += '<span class="vjs-tt-cue">' + a[c].text + "</span>";
    this.el_.innerHTML = b
};
vjs.TextTrack.prototype.reset = function() {
    this.nextChange = 0;
    this.prevChange = this.player_.duration();
    this.lastActiveIndex = this.firstActiveIndex = 0
};
vjs.CaptionsTrack = vjs.TextTrack.extend();
vjs.CaptionsTrack.prototype.kind_ = "captions";
vjs.SubtitlesTrack = vjs.TextTrack.extend();
vjs.SubtitlesTrack.prototype.kind_ = "subtitles";
vjs.ChaptersTrack = vjs.TextTrack.extend();
vjs.ChaptersTrack.prototype.kind_ = "chapters";
vjs.TextTrackDisplay = vjs.Component.extend({
    init: function(a, b, c) {
        vjs.Component.call(this, a, b, c);
        a.options_.tracks && 0 < a.options_.tracks.length && this.player_.addTextTracks(a.options_.tracks)
    }
});
vjs.TextTrackDisplay.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-text-track-display"
    })
};
vjs.TextTrackMenuItem = vjs.MenuItem.extend({
    init: function(a, b) {
        var c = this.track = b.track;
        b.label = c.label();
        b.selected = c.dflt();
        vjs.MenuItem.call(this, a, b);
        this.player_.on(c.kind() + "trackchange", vjs.bind(this, this.update))
    }
});
vjs.TextTrackMenuItem.prototype.onClick = function() {
    vjs.MenuItem.prototype.onClick.call(this);
    this.player_.showTextTrack(this.track.id_, this.track.kind())
};
vjs.TextTrackMenuItem.prototype.update = function() {
    this.selected(2 == this.track.mode())
};
vjs.OffTextTrackMenuItem = vjs.TextTrackMenuItem.extend({
    init: function(a, b) {
        b.track = {
            kind: function() {
                return b.kind
            },
            player: a,
            label: function() {
                return b.kind + " off"
            },
            dflt: function() {
                return !1
            },
            mode: function() {
                return !1
            }
        };
        vjs.TextTrackMenuItem.call(this, a, b);
        this.selected(!0)
    }
});
vjs.OffTextTrackMenuItem.prototype.onClick = function() {
    vjs.TextTrackMenuItem.prototype.onClick.call(this);
    this.player_.showTextTrack(this.track.id_, this.track.kind())
};
vjs.OffTextTrackMenuItem.prototype.update = function() {
    for (var a = this.player_.textTracks(), b = 0, c = a.length, d, e = !0; b < c; b++) d = a[b], d.kind() == this.track.kind() && 2 == d.mode() && (e = !1);
    this.selected(e)
};
vjs.TextTrackButton = vjs.MenuButton.extend({
    init: function(a, b) {
        vjs.MenuButton.call(this, a, b);
        1 >= this.items.length && this.hide()
    }
});
vjs.TextTrackButton.prototype.createItems = function() {
    var a = [],
        b;
    a.push(new vjs.OffTextTrackMenuItem(this.player_, {
        kind: this.kind_
    }));
    for (var c = 0; c < this.player_.textTracks().length; c++) b = this.player_.textTracks()[c], b.kind() === this.kind_ && a.push(new vjs.TextTrackMenuItem(this.player_, {
        track: b
    }));
    return a
};
vjs.CaptionsButton = vjs.TextTrackButton.extend({
    init: function(a, b, c) {
        vjs.TextTrackButton.call(this, a, b, c);
        this.el_.setAttribute("aria-label", "Captions Menu")
    }
});
vjs.CaptionsButton.prototype.kind_ = "captions";
vjs.CaptionsButton.prototype.buttonText = "Captions";
vjs.CaptionsButton.prototype.className = "vjs-captions-button";
vjs.SubtitlesButton = vjs.TextTrackButton.extend({
    init: function(a, b, c) {
        vjs.TextTrackButton.call(this, a, b, c);
        this.el_.setAttribute("aria-label", "Subtitles Menu")
    }
});
vjs.SubtitlesButton.prototype.kind_ = "subtitles";
vjs.SubtitlesButton.prototype.buttonText = "Subtitles";
vjs.SubtitlesButton.prototype.className = "vjs-subtitles-button";
vjs.ChaptersButton = vjs.TextTrackButton.extend({
    init: function(a, b, c) {
        vjs.TextTrackButton.call(this, a, b, c);
        this.el_.setAttribute("aria-label", "Chapters Menu")
    }
});
vjs.ChaptersButton.prototype.kind_ = "chapters";
vjs.ChaptersButton.prototype.buttonText = "Chapters";
vjs.ChaptersButton.prototype.className = "vjs-chapters-button";
vjs.ChaptersButton.prototype.createItems = function() {
    for (var a = [], b, c = 0; c < this.player_.textTracks().length; c++) b = this.player_.textTracks()[c], b.kind() === this.kind_ && a.push(new vjs.TextTrackMenuItem(this.player_, {
        track: b
    }));
    return a
};
vjs.ChaptersButton.prototype.createMenu = function() {
    for (var a = this.player_.textTracks(), b = 0, c = a.length, d, e, f = this.items = []; b < c; b++)
        if (d = a[b], d.kind() == this.kind_)
            if (0 === d.readyState()) d.load(), d.on("loaded", vjs.bind(this, this.createMenu));
            else {
                e = d;
                break
            }
    a = this.menu;
    void 0 === a && (a = new vjs.Menu(this.player_), a.contentEl().appendChild(vjs.createEl("li", {
        className: "vjs-menu-title",
        innerHTML: vjs.capitalize(this.kind_),
        tabindex: -1
    })));
    if (e) {
        d = e.cues_;
        for (var g, b = 0, c = d.length; b < c; b++) g = d[b], g = new vjs.ChaptersTrackMenuItem(this.player_, {
            track: e,
            cue: g
        }), f.push(g), a.addChild(g);
        this.addChild(a)
    }
    0 < this.items.length && this.show();
    return a
};
vjs.ChaptersTrackMenuItem = vjs.MenuItem.extend({
    init: function(a, b) {
        var c = this.track = b.track,
            d = this.cue = b.cue,
            e = a.currentTime();
        b.label = d.text;
        b.selected = d.startTime <= e && e < d.endTime;
        vjs.MenuItem.call(this, a, b);
        c.on("cuechange", vjs.bind(this, this.update))
    }
});
vjs.ChaptersTrackMenuItem.prototype.onClick = function() {
    vjs.MenuItem.prototype.onClick.call(this);
    this.player_.currentTime(this.cue.startTime);
    this.update(this.cue.startTime)
};
vjs.ChaptersTrackMenuItem.prototype.update = function() {
    var a = this.cue,
        b = this.player_.currentTime();
    this.selected(a.startTime <= b && b < a.endTime)
};
vjs.obj.merge(vjs.ControlBar.prototype.options_.children, {
    subtitlesButton: {},
    captionsButton: {},
    chaptersButton: {}
});
if ("undefined" !== typeof window.JSON && "function" === window.JSON.parse) vjs.JSON = window.JSON;
else {
    vjs.JSON = {};
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    vjs.JSON.parse = function(a, b) {
        function c(a, d) {
            var g, k, h = a[d];
            if (h && "object" === typeof h)
                for (g in h) Object.prototype.hasOwnProperty.call(h, g) && (k = c(h, g), void 0 !== k ? h[g] = k : delete h[g]);
            return b.call(a, d, h)
        }
        var d;
        a = String(a);
        cx.lastIndex = 0;
        cx.test(a) && (a = a.replace(cx, function(a) {
            return "\\u" +
                ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return d = eval("(" + a + ")"), "function" === typeof b ? c({
            "": d
        }, "") : d;
        throw new SyntaxError("JSON.parse(): invalid or malformed JSON data");
    }
}
vjs.autoSetup = function() {
    var a, b, c = document.getElementsByTagName("video");
    if (c && 0 < c.length)
        for (var d = 0, e = c.length; d < e; d++)
            if ((b = c[d]) && b.getAttribute) void 0 === b.player && (a = b.getAttribute("data-setup"), null !== a && (a = vjs.JSON.parse(a || "{}"), videojs(b, a)));
            else {
                vjs.autoSetupTimeout(1);
                break
            }
    else vjs.windowLoaded || vjs.autoSetupTimeout(1)
};
vjs.autoSetupTimeout = function(a) {
    setTimeout(vjs.autoSetup, a)
};
if ("complete" === document.readyState) vjs.windowLoaded = !0;
else vjs.one(window, "load", function() {
    vjs.windowLoaded = !0
});
window._X_REM_NEST || vjs.autoSetupTimeout(1);
vjs.plugin = function(a, b) {
    vjs.Player.prototype[a] = b
};
vjs.MD5lib = function() {
    function a(a, h) {
        var g = a[0],
            l = a[1],
            n = a[2],
            m = a[3],
            g = c(g, l, n, m, h[0], 7, -680876936),
            m = c(m, g, l, n, h[1], 12, -389564586),
            n = c(n, m, g, l, h[2], 17, 606105819),
            l = c(l, n, m, g, h[3], 22, -1044525330),
            g = c(g, l, n, m, h[4], 7, -176418897),
            m = c(m, g, l, n, h[5], 12, 1200080426),
            n = c(n, m, g, l, h[6], 17, -1473231341),
            l = c(l, n, m, g, h[7], 22, -45705983),
            g = c(g, l, n, m, h[8], 7, 1770035416),
            m = c(m, g, l, n, h[9], 12, -1958414417),
            n = c(n, m, g, l, h[10], 17, -42063),
            l = c(l, n, m, g, h[11], 22, -1990404162),
            g = c(g, l, n, m, h[12], 7, 1804603682),
            m = c(m, g, l, n, h[13],
                12, -40341101),
            n = c(n, m, g, l, h[14], 17, -1502002290),
            l = c(l, n, m, g, h[15], 22, 1236535329),
            g = d(g, l, n, m, h[1], 5, -165796510),
            m = d(m, g, l, n, h[6], 9, -1069501632),
            n = d(n, m, g, l, h[11], 14, 643717713),
            l = d(l, n, m, g, h[0], 20, -373897302),
            g = d(g, l, n, m, h[5], 5, -701558691),
            m = d(m, g, l, n, h[10], 9, 38016083),
            n = d(n, m, g, l, h[15], 14, -660478335),
            l = d(l, n, m, g, h[4], 20, -405537848),
            g = d(g, l, n, m, h[9], 5, 568446438),
            m = d(m, g, l, n, h[14], 9, -1019803690),
            n = d(n, m, g, l, h[3], 14, -187363961),
            l = d(l, n, m, g, h[8], 20, 1163531501),
            g = d(g, l, n, m, h[13], 5, -1444681467),
            m = d(m, g,
                l, n, h[2], 9, -51403784),
            n = d(n, m, g, l, h[7], 14, 1735328473),
            l = d(l, n, m, g, h[12], 20, -1926607734),
            g = b(l ^ n ^ m, g, l, h[5], 4, -378558),
            m = b(g ^ l ^ n, m, g, h[8], 11, -2022574463),
            n = b(m ^ g ^ l, n, m, h[11], 16, 1839030562),
            l = b(n ^ m ^ g, l, n, h[14], 23, -35309556),
            g = b(l ^ n ^ m, g, l, h[1], 4, -1530992060),
            m = b(g ^ l ^ n, m, g, h[4], 11, 1272893353),
            n = b(m ^ g ^ l, n, m, h[7], 16, -155497632),
            l = b(n ^ m ^ g, l, n, h[10], 23, -1094730640),
            g = b(l ^ n ^ m, g, l, h[13], 4, 681279174),
            m = b(g ^ l ^ n, m, g, h[0], 11, -358537222),
            n = b(m ^ g ^ l, n, m, h[3], 16, -722521979),
            l = b(n ^ m ^ g, l, n, h[6], 23, 76029189),
            g = b(l ^ n ^
                m, g, l, h[9], 4, -640364487),
            m = b(g ^ l ^ n, m, g, h[12], 11, -421815835),
            n = b(m ^ g ^ l, n, m, h[15], 16, 530742520),
            l = b(n ^ m ^ g, l, n, h[2], 23, -995338651),
            g = e(g, l, n, m, h[0], 6, -198630844),
            m = e(m, g, l, n, h[7], 10, 1126891415),
            n = e(n, m, g, l, h[14], 15, -1416354905),
            l = e(l, n, m, g, h[5], 21, -57434055),
            g = e(g, l, n, m, h[12], 6, 1700485571),
            m = e(m, g, l, n, h[3], 10, -1894986606),
            n = e(n, m, g, l, h[10], 15, -1051523),
            l = e(l, n, m, g, h[1], 21, -2054922799),
            g = e(g, l, n, m, h[8], 6, 1873313359),
            m = e(m, g, l, n, h[15], 10, -30611744),
            n = e(n, m, g, l, h[6], 15, -1560198380),
            l = e(l, n, m, g, h[13], 21,
                1309151649),
            g = e(g, l, n, m, h[4], 6, -145523070),
            m = e(m, g, l, n, h[11], 10, -1120210379),
            n = e(n, m, g, l, h[2], 15, 718787259),
            l = e(l, n, m, g, h[9], 21, -343485551);
        a[0] = f(g, a[0]);
        a[1] = f(l, a[1]);
        a[2] = f(n, a[2]);
        a[3] = f(m, a[3])
    }

    function b(a, b, c, d, e, g) {
        b = f(f(b, a), f(d, g));
        return f(b << e | b >>> 32 - e, c)
    }

    function c(a, c, d, e, f, g, r) {
        return b(c & d | ~c & e, a, c, f, g, r)
    }

    function d(a, c, d, e, f, g, r) {
        return b(c & e | d & ~e, a, c, f, g, r)
    }

    function e(a, c, d, e, f, g, r) {
        return b(d ^ (c | ~e), a, c, f, g, r)
    }

    function f(a, b) {
        return a + b & 4294967295
    }
    var g = "0123456789abcdef".split("");
    this.md5 = function(b) {
        var c = b,
            d = c.length;
        b = [1732584193, -271733879, -1732584194, 271733878];
        var e;
        for (e = 64; e <= c.length; e += 64) {
            var f = c.substring(e - 64, e),
                m = [],
                r;
            for (r = 0; 64 > r; r += 4) m[r >> 2] = f.charCodeAt(r) + (f.charCodeAt(r + 1) << 8) + (f.charCodeAt(r + 2) << 16) + (f.charCodeAt(r + 3) << 24);
            a(b, m)
        }
        c = c.substring(e - 64);
        f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (e = 0; e < c.length; e++) f[e >> 2] |= c.charCodeAt(e) << (e % 4 << 3);
        f[e >> 2] |= 128 << (e % 4 << 3);
        if (55 < e)
            for (a(b, f), e = 0; 16 > e; e++) f[e] = 0;
        f[14] = 8 * d;
        a(b, f);
        for (c = 0; c < b.length; c++) {
            d = b;
            e = c;
            f =
                b[c];
            m = "";
            for (r = 0; 4 > r; r++) m += g[f >> 8 * r + 4 & 15] + g[f >> 8 * r & 15];
            d[e] = m
        }
        return b.join("")
    };
    "5d41402abc4b2a76b9719d911017c592" != this.md5("hello") && (f = function(a, b) {
        var c = (a & 65535) + (b & 65535);
        return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
    })
};
vjs.MD5exec = new vjs.MD5lib;
(function() {
    vjs.MD5b64 = function(a) {
        a = vjs.MD5exec.md5(a);
        for (var b = "", c = 0; 32 > c; c += 8) {
            for (var d = a.slice(c, c + 8), e = "", d = parseInt(d, 16), f = 0; 6 > f; f++) e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-".charAt(d % 64) + e, d = Math.floor(d / 64);
            b += e
        }
        return b
    }
})();
vjs.postis = function(a) {
    var b = a.scope,
        c = a.window,
        d = a.windowForEventListening || window,
        e = {},
        f = [],
        g = {},
        k = !1,
        h, p = function(a) {
            var c;
            try {
                c = JSON.parse(a.data)
            } catch (d) {
                return
            }
            if (c.postis && c.scope === b)
                if (a = e[c.method])
                    for (var f = 0; f < a.length; f++) a[f].call(null, c.params);
                else g[c.method] = g[c.method] || [], g[c.method].push(c.params)
        };
    d.addEventListener ? d.addEventListener("message", p, !1) : d.attachEvent && d.attachEvent("onmessage", p);
    var l = {
            listen: function(a, b) {
                e[a] = e[a] || [];
                e[a].push(b);
                var c = g[a];
                if (c)
                    for (var d =
                            e[a], f = 0; f < d.length; f++)
                        for (var h = 0; h < c.length; h++) d[f].call(null, c[h]);
                delete g[a]
            },
            send: function(a) {
                var d = a.method;
                (k || "__ready__" === a.method) && c && c.postMessage ? c.postMessage(JSON.stringify({
                    postis: !0,
                    scope: b,
                    method: d,
                    params: a.params
                }), "*") : f.push(a)
            },
            ready: function(a) {
                k ? a() : setTimeout(function() {
                    l.ready(a)
                }, 50)
            },
            destroy: function(a) {
                clearInterval(h);
                k = !1;
                d && ("function" === typeof d.removeEventListener ? d.removeEventListener("message", p) : "function" === typeof d.detachEvent && d.detachEvent("onmessage",
                    p));
                a && a()
            }
        },
        n = +new Date + Math.random() + "";
    h = setInterval(function() {
        l.send({
            method: "__ready__",
            params: n
        })
    }, 50);
    l.listen("__ready__", function(a) {
        if (a === n) {
            clearInterval(h);
            k = !0;
            for (a = 0; a < f.length; a++) l.send(f[a]);
            f = []
        } else l.send({
            method: "__ready__",
            params: a
        })
    });
    return l
};
window.console || (window.console = {});
window.console.log || (window.console.log = function() {});
if ("undefined" == typeof vjs.text || "" == vjs.text) "textContent" in document.createElement("span") ? vjs.text = "textContent" : vjs.text = "innerText";
Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
    for (var c = b || 0, d = this.length; c < d; c++)
        if (this[c] === a) return c;
    return -1
});
Array.prototype.filter || (Array.prototype.filter = function(a) {
    if (void 0 === this || null === this) throw new TypeError;
    var b = Object(this),
        c = b.length >>> 0;
    if ("function" !== typeof a) throw new TypeError;
    for (var d = [], e = 2 <= arguments.length ? arguments[1] : void 0, f = 0; f < c; f++)
        if (f in b) {
            var g = b[f];
            a.call(e, g, f, b) && d.push(g)
        }
    return d
});
vjs.isDescendant = function(a, b) {
    if (!b || !a) return !1;
    if (a == b) return !0;
    for (var c = b.parentNode; null != c;) {
        if (c == a) return !0;
        c = c.parentNode
    }
    return !1
};
vjs.arrayContains = function(a, b) {
    for (var c = a.length; c--;)
        if (a[c] === b) return !0;
    return !1
};
vjs.logObject = function(a) {
    var b = "",
        c;
    for (c in a) b += "\n" + c + " => " + a[c];
    return b
};
vjs.extractCDATA = function(a) {
    try {
        return null == a.childNodes[1] ? null == a.childNodes[0] ? "" : a.childNodes[0].nodeValue : a.childNodes[1].nodeValue
    } catch (b) {
        return ""
    }
};
vjs.xml2Dom = function(a) {
    var b, c;
    if (!a || "" == a || "string" !== typeof a) return !1;
    try {
        window.DOMParser ? (c = new DOMParser, b = c.parseFromString(a, "text/xml")) : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a))
    } catch (d) {
        b = !1
    }
    b && b.documentElement && !b.getElementsByTagName("parsererror").length || (b = !1);
    return b
};
vjs.colors = {
    getBrighterColor: function(a) {
        var b = [a.color1, a.color2, a.color3, a.color4];
        a = -1 < [2, 3, 4, 5, 6].indexOf(a.skin || 1) ? b[3] : b[0];
        return b.slice(0, -1).concat([a]).sort(function(a, b) {
            a = vjs.colors.anyToRGB(a);
            b = vjs.colors.anyToRGB(b);
            vjs.colors.RGBToHSV(a.r, a.g, a.b);
            vjs.colors.RGBToHSV(b.r, b.g, b.b);
            var e = vjs.colors.RGBToHSV(a.r, a.g, a.b).s,
                f = vjs.colors.RGBToHSV(b.r, b.g, b.b).s;
            return .8 * -(e - f) + .2 * (e - f)
        })[0]
    },
    RGBToHSL: function(a, b, c) {
        var d = Math.min(a, b, c),
            e = Math.max(a, b, c),
            f = e - d,
            g = 0,
            k = 0,
            h = (d + e) / 2;
        0 != f &&
            (k = .5 > h ? f / (e + d) : f / (2 - e - d), g = 60 * (a == e ? (b - c) / f : b == e ? 2 + (c - a) / f : 4 + (a - b) / f));
        return [g, k, h]
    },
    RGBToHSV: function(a, b, c) {
        var d, e;
        a /= 255;
        b /= 255;
        var f = c / 255,
            g, k, h = Math.max(a, b, f);
        e = h - Math.min(a, b, f);
        0 == e ? g = k = 0 : (k = e / h, c = (h - a) / 6 / e + .5, d = (h - b) / 6 / e + .5, e = (h - f) / 6 / e + .5, a === h ? g = e - d : b === h ? g = 1 / 3 + c - e : f === h && (g = 2 / 3 + d - c), 0 > g ? g += 1 : 1 < g && --g);
        return {
            h: Math.round(360 * g),
            s: Math.round(100 * k),
            v: Math.round(100 * h)
        }
    },
    HSLToRGB: function(a, b, c) {
        if (0 == b) return [c, c, c];
        b = .5 > c ? c * (1 + b) : c + b - c * b;
        c = 2 * c - b;
        a /= 360;
        a = [(a + 1 / 3) % 1, a, (a + 2 / 3) % 1];
        for (var d =
                0; 3 > d; ++d) a[d] = a[d] < 1 / 6 ? c + 6 * (b - c) * a[d] : .5 > a[d] ? b : a[d] < 2 / 3 ? c + 6 * (b - c) * (2 / 3 - a[d]) : c;
        return a
    },
    HEXToRGB: function(a) {
        var b = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
        return b ? {
            r: parseInt(b[1], 16),
            g: parseInt(b[2], 16),
            b: parseInt(b[3], 16)
        } : (b = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(a)) ? (b[1] = b[1].toString() + b[1].toString(), b[2] = b[2].toString() + b[2].toString(), b[3] = b[3].toString() + b[3].toString(), {
            r: parseInt(b[1], 16),
            g: parseInt(b[2], 16),
            b: parseInt(b[3], 16)
        }) : null
    },
    RGBToHEX: function(a, b, c) {
        return "#" +
            vjs.colors.componentToHex(a) + vjs.colors.componentToHex(b) + vjs.colors.componentToHex(c)
    },
    componentToHex: function(a) {
        a = a.toString(16);
        return 1 == a.length ? "0" + a : a
    },
    anyToRGB: function(a) {
        "#" === a.substr(0, 1) ? a = vjs.colors.HEXToRGB(a) : "rgb" === a.substr(0, 3) && (a = (a = /[rgb|rgba]\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)/i.exec(a)) ? {
            r: parseInt(a[1]),
            g: parseInt(a[2]),
            b: parseInt(a[3])
        } : null);
        return a
    },
    rgbBrightness: function(a) {
        return (a.r + a.g + a.b) / 765
    },
    darken: function(a, b) {
        var c = parseInt(a.r),
            d = parseInt(a.g),
            e = parseInt(a.b),
            c = Math.floor(c * b),
            d = Math.floor(d * b),
            e = Math.floor(e * b);
        return "rgb(" + c + "," + d + "," + e + ")"
    },
    lighten: function(a, b) {
        var c = parseInt(a.r),
            d = parseInt(a.g),
            e = parseInt(a.b);
        30 > c && 30 > d && 30 > e && (c += 30, d += 30, e += 30);
        c = Math.floor(c * b);
        d = Math.floor(d * b);
        e = Math.floor(e * b);
        255 < c && (c = 255);
        255 < d && (d = 255);
        255 < e && (e = 255);
        return "rgb(" + c + "," + d + "," + e + ")"
    },
    tweakShadows: function(a, b, c) {
        a = vjs.colors.anyToRGB(a);
        b = vjs.colors.anyToRGB(b);
        var d = vjs.colors.rgbBrightness(a),
            e = vjs.colors.rgbBrightness(b);
        return 1 == c ? .95 < d ? "#ddd" : vjs.colors.lighten(a,
            1.1 + 1.1 * Math.pow(1 - d, 2)) : .33 < d && .66 > d ? .5 > e ? vjs.colors.darken(b, .7) : vjs.colors.lighten(b, 1.2) : .5 < d ? vjs.colors.darken(b, .4) : vjs.colors.lighten(b, 1.7)
    }
};
vjs.keepUnique = function(a) {
    return a instanceof Array ? a.filter(function(b, c) {
        return a.indexOf(b) === c
    }) : []
};
vjs.mergeUnique = function(a, b) {
    if (!(a instanceof Array)) return vjs.keepUnique(b);
    if (!(b instanceof Array)) return vjs.keepUnique(a);
    var c = a.concat(b);
    return vjs.keepUnique(c)
};
vjs.commonProps = function(a, b) {
    var c = [],
        d;
    if (a instanceof Object && !(a instanceof Array))
        for (d in a) c.push(d);
    if (b instanceof Object && !(b instanceof Array))
        for (d in b) c.push(d);
    return vjs.keepUnique(c)
};
vjs.cloneObject = function(a) {
    if (!(a instanceof Object)) return !1;
    try {
        return JSON.parse(JSON.stringify(a))
    } catch (b) {
        return !1
    }
};
vjs.bufferBlacklist = [];
vjs.buffer = function(a, b, c) {
    var d = new Image,
        e = 0;
    "undefined" == typeof c && (c = function() {});
    d.onload = function() {
        if (-1 < vjs.bufferBlacklist.indexOf(b) || e) return !1;
        e = 1;
        "img" == a ? c([this.height, this.width]) : c();
        return !0
    };
    d.onerror = function() {
        c(null);
        return !0
    };
    d.src = b;
    return !0
};
vjs.multiLine = function(a) {
    return a instanceof Array ? a.join("\n") : "string" === typeof a ? a : ""
};
vjs.HHMMSSToSS = function(a) {
    a = "string" === typeof a ? a.split(":") : [];
    return 3 === a.length ? 3600 * +a[0] + 60 * +a[1] + +a[2] : 0
};
vjs.SSToHHMMSS = function(a) {
    var b = Math.floor(a / 3600);
    10 > b && (b = "0" + b);
    var c = Math.floor((a - 3600 * b) / 60);
    10 > c && (c = "0" + c);
    a = a - 60 * c - 3600 * b;
    10 > a && (a = "0" + a);
    return [b, c, a]
};
vjs.getByClassName = function(a, b) {
    var c, d = [],
        e;
    c = "undefined" == typeof a.getElementsByClassName ? a.querySelectorAll("." + b) : a.getElementsByClassName(b);
    for (e = 0; e < c.length; ++e) d.push(c[e]);
    return d
};
vjs.objectToCSS = function(a) {
    if (a && "[object object]" !== a.toString().toLowerCase()) return "";
    var b = "",
        c;
    for (c in a) b += c + ":" + a[c] + ";";
    return b
};
vjs.objectToGet = function(a) {
    if (a && "[object object]" !== a.toString().toLowerCase()) return "";
    var b = "",
        c;
    for (c in a) b += c + "=" + a[c] + "&";
    return b.substr(0, b.length - 1)
};
vjs.emptyElement = function(a) {
    for (; a.firstChild;) a.removeChild(a.firstChild)
};
vjs.createTrackingPixel = function(a, b, c) {
    var d = document.createElement("img"),
        e = (new Date).getTime(),
        f = -1 < a.indexOf("?");
    b = vjs.objectToGet(b);
    var g;
    g = "" !== b ? f ? "&" : "?" : "";
    f = "" != g || f ? "&" : "?";
    b = a + g + b;
    if (c)
        for (; b.length > c - 20;)
            if (a = b.lastIndexOf("&"), 0 > a && (a = b.lastIndexOf("?")), -1 < a) b = b.substr(0, a);
            else break;
    0 > b.indexOf("adman.gr") && (b += f + "ts=" + e);
    d.setAttribute("src", b);
    return c && b.length > c ? !1 : !0
};
vjs.capitaliseFirstLetter = function(a) {
    return a.charAt(0).toUpperCase() + a.slice(1)
};
RegExp.quote = function(a) {
    return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
};
window._X_REM_NEST && (vjs.gErrors = [], vjs._defaultError = window.onerror, window.onerror = function(a, b, c) {
    return 2 > vjs.gErrors.push({
        source: "player",
        code: "000",
        errorMsg: a,
        file: b,
        line: c
    }) ? !1 : vjs._defaultError ? vjs._defaultError(a, b, c) : !1
});
vjs.insideIframe = function() {
    try {
        return window.self !== window.top
    } catch (a) {
        return !0
    }
};
vjs.getWindow = function() {
    return window._X_REM_NEST ? window.parent : window
};
vjs.getDoc = function() {
    return vjs.getWindow().document
};
vjs.getAbsoluteURL = function(a) {
    var b = document.createElement("a");
    b.href = a;
    return b.href
};
vjs.getPageUrl = function() {
    if (window._X_META && window._X_META.pageUrl) return window._X_META.pageUrl;
    var a = this.getDoc(),
        b = a.location.href;
    if (window.initURL && window.initURL != b) return vjs.getAbsoluteURL(b);
    var c = a.querySelector('link[rel="canonical"]');
    return c && c.href ? c.href : (a = a.querySelector('meta[property="og:url"]')) && a.content ? a.content : b
};
vjs.getPageTitle = function() {
    if (window._X_META && window._X_META.pageTitle) return window._X_META.pageTitle;
    var a = this.getDoc(),
        b = a.location.href;
    return window.initURL && window.initURL != b ? a.title : (b = a.querySelector('meta[property="og:title"]')) && b.content ? b.content : a.title
};
vjs.getPageDesc = function() {
    if (window._X_META && window._X_META.pageDesc) return window._X_META.pageDesc;
    var a = this.getDoc().getElementsByName("description")[0];
    return a && a.content ? a.content : ""
};
vjs.__jsonpCallbacks = {};
vjs.__jsonpCache = {};
vjs.__jsonpResponse = {};
vjs.__jsonpOngoing = {};
vjs.jsonp = function(a, b, c, d) {
    function e() {
        if (k) return !1;
        k = !0;
        delete vjs.__jsonpOngoing[f];
        g && window.clearTimeout(g);
        return !0
    }
    var f;
    f = d ? d.replace(/-/g, "$") : "_" + vjs.MD5b64(a).replace(/-/g, "$");
    if (f in vjs.__jsonpCache) b(null, vjs.__jsonpCache[f]);
    else if (f in vjs.__jsonpOngoing) vjs.__jsonpCallbacks[f].push(b);
    else {
        vjs.__jsonpCallbacks[f] = [b];
        vjs.__jsonpOngoing[f] = !0;
        var g = 0,
            k = !1,
            h = function(a) {
                if (e()) {
                    vjs.__jsonpResponse[f] = function() {};
                    for (var b = vjs.__jsonpCallbacks[f], c = 0; c < b.length; c++) b[c](a, null);
                    delete vjs.__jsonpCallbacks[f]
                }
            };
        vjs.__jsonpResponse[f] = function(a) {
            if (e()) {
                vjs.__jsonpCache[f] = a;
                vjs.__jsonpResponse[f] = function() {};
                for (var b = vjs.__jsonpCallbacks[f], c = 0; c < b.length; c++) b[c](null, a);
                delete vjs.__jsonpCallbacks[f]
            }
        };
        a = 0 <= a.indexOf("?") ? a + "&" : a + "?";
        a += "callback=vjs.__jsonpResponse." + f;
        var p;
        try {
            p = HTMLDocument.prototype.createElement.call(document, "script")
        } catch (l) {
            p = document.createElement("script")
        }
        p.onerror = h;
        p.onreadystatechange = function() {
            "loaded" == p.readyState && setTimeout(function() {
                    h(Error("script failed to load"))
                },
                10)
        };
        p.setAttribute("src", a);
        c && (g = window.setTimeout(function() {
            h(Error("jsonp request timeout"))
        }, c));
        (document.head || document.getElementsByTagName("head")[0]).appendChild(p)
    }
};
vjs.prefetch = function(a) {
    var b = document.head || document.getElementsByTagName("head")[0],
        c = document.createElement("link");
    c.rel = "prefetch";
    c.href = a;
    b.appendChild(c)
};
vjs.getFullscreenElement = function() {
    return "undefined" !== typeof document.webkitFullscreenElement ? document.webkitFullscreenElement : document.mozFullscreenElement
};
vjs.getMyCountry = function(a) {
    vjs.jsonp("https://rdata.reembed.com/mycountry.jsonp", function(b, c) {
        b ? a(b, "") : a(null, c.code)
    }, void 0, "mycountry")
};
vjs.getMyCountry(function() {});
vjs.storageAvailable = function(a) {
    try {
        var b = window[a];
        b.setItem("__storage_test__", "__storage_test__");
        b.removeItem("__storage_test__");
        return !0
    } catch (c) {
        return !1
    }
};
var DEBUG = !1;
vjs.defaultSpinners = ["Youtube"];
vjs.availableQuality = ["Youtube"];
vjs.availableRate = ["Youtube"];
vjs._protocol = "";
if (/(Chrome|Firefox)/i.test(navigator.userAgent) || "file:" == document.location.protocol) vjs._protocol = "https:";
vjs.static_ = {
    close: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMBAMAAABLmSrqAAAAHlBMVEWtrLcAAACtrLetrLetrLetrLetrLetrLetrLetrLfdeyOgAAAACnRSTlP+APVJH9Y+4EvM10HzFgAAAE9JREFUCNdjEHQ1FBQOEWAQKdAQNGJ3YBBlYGpWYAhgEFZgUGJgSmAQNGJgYFATYBAECjAlQmlDAYi4sgBUnQFIXzJIn0iBGtgcQc9EkLkA4wEKHPVp6ZgAAAAASUVORK5CYII=",
    closeAds: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAQlBMVEUhJSsjKTCUm6WFjZWYoK2lr8Shqbaxu8vI0OK8xdV8goqNk53V3OqZo7VudHtYXmbK0NqyvNSosLqGj6F0eoNkanV4HbySAAAAfklEQVQY02XLWw7FIAhF0fIQFa32Of+pXqA3/en+IDkrYfk2lN50GCjhG6kBIc9LrGsykgNPAD0OBZjs0ITARO2QtICKEGENQMlbCG5Z8IHaHFp9gFMmiCgnDvDN7BKw5tt27yZ3XgPKwF5Kx1ECONVS6r77jZeTJf0TPpdPP0L7BIfvaZNPAAAAAElFTkSuQmCC",
    logo: {
        white170px: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAASCAMAAAAKVPJ1AAAAQlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////8IX9KGAAAAFXRSTlMAafaoLAge2DzJ6odJeFgUlOG0vZ9kcNzvAAAB5ElEQVR4AcWS4a7bIAxGHYNJAoQA6ff+r7pi4KbSzdUmTdPOj1YW9onBpkccPtjoiR2GfscC/Dd/sBP5J/7ljv7K75yQpNhC2ZZkn/ziHJ1xsT0nyvBrcJJyVyt6on4gHV7vcTDe1HP6ndDgwLpxO6PY/srW/dHjTe5pi1Zf9g44HOqvADNRBWp4MXYZ/oWDm35m7AwYxuqBIs3P4PpagYveZOAK2aO09gLgjSlg9cO3GydweyTLOKYfYLN1P3ZLcrVUkgxszY99uCLR1h/0LMjqqEKaqH6904pAjYpy+9/sSf2pj+vVWtBo1zot3ImuMe0MlvajU5Gi/kpvzrnnCZAH/0napO6B9rpj/3o8Itb2NcXeqxXUH8aB7wD2+/vwLJ7+W5IAd35UR/II936OTYzAOokP833wv4hGpbVAmdWJ2giVdPudvo/ysJ+P/uurSRFGuqtX5G/9f31Utk26/+bZ72WMtEylVp9UsZJiPvx55BsU+jP/uDgja4brE2WhNPbA8of/ZKzx3LLGDqhhEn/y47AuFV1GWVGS20LflhW8vI88pl+rC5RM6r/JP/j3FQ3uvfYAVVrQVb4CZEykzhkuLpdGp/kgUTQvdRijj6AlwSwSdl5flhQ5Lu+vNFS5nbhozC9Hfy1+pwpD7wAAAABJRU5ErkJggg==",
        whiteE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AcGDhkg5yuWNAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAB70lEQVRIx73WP2gUQRgF8NMUSZAoqCkMKSy0UgsD6QLpLGwkIEggpWBSWQmCpX/SCJpgFcFGks6QRmsVwT8YFIMBRQTRQiRwhBQKl9zPwgms4+zd3mXP1yzsm+97zMybN1OptAkcrvwPoBez/uBSp8UmseFv9HVCaBSr/sUyDmFXWUKDWEoIfcWZMmfUhemE0CYul718E1hLiN3HgTKFhsOexHiFoTKF+rGQEPqB8Tb6NR0wkxC7WaTptjtbcil6EmfrbiuzevPpe3fodQ53ioheSMxyKMOfxD0cwXOcxlvcxgt83KrXH2dqjxcRfR8JvsxwKddmUQ/fdUwVWuaQJjHGAzemAOYevett1WFLCaduG+NpE71ntc36vlYNNJhodDVwxxqIfdnJubyRaDgQuLkE92v7mmorxEOOxiZ5ELg+/Iy4+QI9zxbJ0xgjgbuY+fekVqudyEsYjGAljJ1qJvo6ElzJcJ/Dv4mc2gEsRvUb6GkW5jHOB+4UridqduNaA3PNNJvlfFSwju6csePhGOVhAf3NBA9iKyq8FY0ZCldYHpYx3IprrySa7K9Wq3vCpZyHtbw9LiL6LWr2ITw38jCNrp2EwVhOWMdYwmBZL4NGWbqK0bIfV6ks3cBkJ1/e2SydRW+lk8BePMTRdnv8BjE/6c8+qM9eAAAAAElFTkSuQmCC"
    },
    share: {
        twitter: "https://www.twitter.com/home?status=",
        facebook: "https://www.facebook.com/sharer/sharer.php?u=",
        googleplus: "https://plus.google.com/share?url="
    },
    homepageURL: "https://www.reembed.com/",
    feedbackURL: "https://www.reembed.com/feedback?",
    perfUrl: "https://pings.reembed.com/metrics/perf",
    pings: {
        ping1: "https://pings.reembed.com/impression",
        ping2: "https://pings.reembed.com/play",
        social: "https://pings.reembed.com/social",
        ping3: "https://pings.reembed.com/watch",
        widget_local: "https://widgets.reembed.com/widget/videos/bridge-ng",
        ping_removed: "https://pings.reembed.com/broken"
    },
    iframeServer: "https://iframe.reembed.com",
    nfl_poster: "https://static.reembed.com/data/logos/NFL-comingHome.jpg",
    embedServer: "https://embed.reembed.com",
    twitterServer: "https://t.reembed.com",
    galleryServer: "https://widgets.reembed.com/widget/videos/endscreen",
    adsense: "cc.reembed.com",
    vastServer: vjs._protocol + "//ads.reembed.com/get.php",
    vpaidProxy: "//cdn.reembed.com/player/vpaid161116-0.swf",
    lkqdServer: vjs._protocol + "//ad.lkqd.net/serve/pure.js",
    feedbackServer: vjs._protocol +
        "//telemetry.reembed.com/",
    youtube_poster: function(a) {
        return vjs._protocol + "//img.youtube.com/vi/" + a + "/0.jpg"
    },
    youtubeCaptionsAPI: function(a) {
        return vjs._protocol + "//video.google.com/timedtext?type=list&v=" + a
    },
    videoInfo: function(a, b) {
        b = b.toLowerCase();
        switch (b) {
            case "youtube":
                return "https://rdata.reembed.com/video?id=" + a + "&provider=" + b + "&fields=id,title,description,duration,thumbnails,live,restrictions,status,meta,liveStreamingDetails";
            case "dailymotion":
                return "https://api.dailymotion.com/video/" +
                    a + "?fields=thumbnail_url,title,duration,id,description,mode,access_error,private";
            case "vimeo":
                return "https://vimeo.com/api/oembed.json?url=https://vimeo.com/" + a;
            default:
                return !1
        }
    },
    jsonp: "../tests/jsonp.php",
    wizard_width: 595,
    shareHeight: 40,
    controlBarSize: {
        skin1: {
            width: "100%",
            height: "30px"
        },
        skin2: {
            width: "100%",
            height: "30px"
        },
        skin3: {
            width: "100%",
            height: "30px"
        },
        skin4: {
            width: "100%",
            height: "30px"
        },
        skin5: {
            width: "100%",
            height: "30px"
        },
        skin6: {
            width: "100%",
            height: "30px"
        },
        skin7: {
            width: "100%",
            height: "3px"
        }
    },
    watermark: {
        rootStyles: "width:28px!important;height:30px!important;right:1.7em!important;bottom:1.7em!important;left:auto!important;top:auto!important;z-index:9!important;pointer-events:all;",
        imageStyles: "width:inherit!important;height:inherit!important;right:0em!important;bottom:0em!important;left:0!important;top:auto!important;font-size:inherit!important;"
    }
};
vjs.IS_WINDOWS = /Windows/i.test(vjs.USER_AGENT);
vjs.IS_MAC = /Mac/i.test(vjs.USER_AGENT);
vjs.IS_OPERA = /Opera|OPR/i.test(vjs.USER_AGENT);
vjs.IS_LINUX = /Linux/i.test(vjs.USER_AGENT);
vjs.IS_IE11_PHONE = /Windows Phone 8\.1/i.test(vjs.USER_AGENT);
vjs.IS_WINDOWS_PHONE = /Windows Phone/i.test(vjs.USER_AGENT);
vjs.IS_ANDROID = vjs.IS_WINDOWS_PHONE ? !1 : vjs.IS_ANDROID;
vjs.IS_IPHONE = vjs.IS_WINDOWS_PHONE ? !1 : vjs.IS_IPHONE;
vjs.IS_IOS = vjs.IS_IPHONE || vjs.IS_IPAD || vjs.IS_IPOD;
vjs.IS_IE11 = /rv\:/i.test(vjs.USER_AGENT) && /Trident/i.test(vjs.USER_AGENT);
vjs.IS_MOBILE = vjs.IS_IOS || vjs.IS_ANDROID || vjs.IS_WINDOWS_PHONE || vjs.IS_IE11_PHONE;
vjs.IS_TABLET = vjs.IS_IPAD || vjs.IS_ANDROID && !/mobile/i.test(vjs.USER_AGENT);
vjs.IS_NATIVE_ANDROID = !vjs.IS_CHROME && !vjs.IS_FIREFOX && !vjs.IS_OPERA && vjs.IS_ANDROID;
vjs.IS_ANDROID && /Linux; U;/i.test(vjs.USER_AGENT) && !vjs.IS_NATIVE_ANDROID && vjs.IS_CHROME && (vjs.IS_NATIVE_ANDROID = !0, vjs.IS_CHROME = !1);
vjs.IS_SAFARI = /Safari/i.test(vjs.USER_AGENT) && !vjs.IS_CHROME;
vjs.IS_IE8 = /MSIE 8/i.test(vjs.USER_AGENT);
vjs.IS_IE9 = /MSIE 9/i.test(vjs.USER_AGENT);
vjs.forceHTML = 1;
vjs.loadedStyles = 0;
vjs.maxVASTRequests = 7;
vjs.widthBreakpoints = [360, 310, 240, 215];
vjs.SelectBar = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        c.optionsOn = 0;
        c.off("click");
        c.off("touchstart");
        c.eventListener = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click";
        c.on(c.eventListener, function(a) {
            c.onClick(a);
            c.selectAction(a)
        })
    }
});
vjs.SelectBar.prototype.createEl = function() {
    var a = vjs.createEl("li", {
        className: this.className + "-li vjs-toolkit-option",
        innerHTML: "<span>" + this.pluginName + ":</span>"
    });
    this.el_ = vjs.createEl("div", {
        className: this.className + " vjs-selectbar"
    });
    var b = vjs.createEl("span", {
            className: this.className + "-current vjs-selectbar-current",
            innerHTML: "Loading"
        }),
        c = vjs.createEl("ul", {
            className: this.className + "-options vjs-selectbar-menu"
        });
    this.currentEl = b;
    this.optionsEl = c;
    this.el_.appendChild(b);
    this.el_.appendChild(this.optionsEl);
    a.appendChild(this.el_);
    this.optionsEl.style.display = "none";
    return a
};
vjs.SelectBar.prototype.playerMouseOut = function(a) {
    vjs.isDescendant(this.player_.el_, a.relatedTarget) || "undefined" == typeof a.relatedTarget || this.hideOptions()
};
vjs.SelectBar.prototype.hideOptions = function() {
    this.optionsEl.style.display = "none";
    this.optionsOn = 0
};
vjs.SelectBar.prototype.showOptions = function() {
    this.optionsEl.style.display = "block";
    this.optionsOn = 1
};
vjs.SelectBar.prototype.onClick = function(a) {
    var b = this.optionsEl.style.display; - 1 < a.target.className.indexOf("vjs-selectbar") && !vjs.hasClass(a.target, "vjs-selectbar-menu") ? "block" != b ? this.showOptions() : this.hideOptions() : vjs.hasClass(a.target.parentNode, "vjs-toolkit-option") && this.hideOptions()
};
vjs.SelectBar.prototype.onMouseActivity = function(a) {
    a = vjs.fixEvent(a);
    vjs.isDescendant(this.el_, a.target) || this.hideOptions()
};
vjs.SelectBar.prototype.setMouseListeners = function() {
    var a = this.player_;
    this.on("mouseout", function() {
        for (var a = this.optionsEl.childNodes, b = 0; b < a.length; ++b) vjs.hasClass(a[b], "active") || (a[b].style.backgroundColor = "transparent")
    });
    this.on("mouseover", function(b) {
        b = vjs.fixEvent(b);
        for (var d = this.optionsEl.childNodes, e = 0; e < d.length; ++e) vjs.hasClass(d[e], "active") || (d[e].style.backgroundColor = "transparent");
        vjs.hasClass(b.target.parentNode, "vjs-selectbar-menu") && !vjs.hasClass(b.target, "active") && (d =
            vjs.colors.getBrighterColor(a.options_.reEmbed), d = vjs.colors.HEXToRGB(d), d = vjs.colors.RGBToHSL(d.r, d.g, d.b), d = vjs.colors.HSLToRGB(d[0], d[1], 0 >= d[2] - 20 ? d[2] : d[2] - 20), d = vjs.colors.RGBToHEX(Math.floor(d[0]), Math.floor(d[1]), Math.floor(d[2])), b.target.style.backgroundColor = d)
    });
    a.on("mouseout", vjs.bind(this, this.playerMouseOut));
    var b = this;
    a.on(vjs.IS_IPAD ? "touchstart" : "click", function(a) {
        b.onMouseActivity(a)
    });
    vjs.IS_IPAD && (document.body.ontouchstart = function(a) {
        b.onMouseActivity()
    })
};
vjs.SelectBar.prototype.setOptions = function(a) {
    var b;
    vjs.emptyElement(this.optionsEl);
    for (b = 0; b < a.length; ++b) this.optionsEl.appendChild(vjs.createEl("li", {
        className: a[b].value,
        innerHTML: a[b].name
    }))
};
vjs.SelectBar.prototype.setActive = function(a) {
    for (var b = this.player_, c = this.optionsEl.childNodes, d = 0; d < c.length; ++d) this.optionsEl.childNodes[d].style.backgroundColor = "transparent", vjs.removeClass(this.optionsEl.childNodes[d], "active"), vjs.hasClass(c[d], a) && (this.optionsEl.childNodes[d].style.backgroundColor = vjs.colors.getBrighterColor(b.options_.reEmbed), vjs.addClass(this.optionsEl.childNodes[d], "active"));
    this.optionSetCallback(a)
};
vjs.ActionCall = vjs.Component.extend({
    init: function(a, b) {
        this.actionsMap = {
            shopnow: {
                title: "Shop Now"
            },
            readmore: {
                title: "Read More",
                subtitle: !0
            },
            watchmore: {
                title: "Watch More",
                subtitle: !0
            },
            learnmore: {
                title: "Learn More",
                subtitle: !0
            },
            signup: {
                title: "Sign Up"
            },
            likeus: {
                title: "Like us"
            },
            followus: {
                title: "Follow us"
            }
        };
        this.actionsMap[b.id] && vjs.Component.call(this, a, b)
    }
});
vjs.ActionCall.prototype.createEl = function() {
    var a = this.actionsMap[this.options_.id],
        b = this.options_.href,
        c = "",
        d;
    a.subtitle && (d = /\/\/(.*?)(?:\/|$)/i, (d = b.match(d)) && 0 < d.length && (c = d[1]));
    d = vjs.createEl("div", {
        className: "vjs-call-to-action vjs-call-to-action-" + this.options_.id + " vjs-end-options"
    });
    a = vjs.createEl("a", {
        className: "vjs-call-to-action-icon" + (a.subtitle ? " vjs-call-to-action-subtitle-enabled" : ""),
        href: b,
        innerHTML: a.title + (a.subtitle ? '<span class="vjs-call-to-action-subtitle">' + c + "</span>" :
            ""),
        target: "_blank"
    });
    d.appendChild(a);
    return d
};
vjs.AutoFeedback = vjs.Component.extend({
    init: function(a, b) {
        this.player_ = a;
        this.options_ = b;
        this.played = [];
        var c = this;
        c.initTime = (new Date).getTime();
        c.windowUnload = !1;
        vjs.on(window, ["beforeunload", "unload"], function() {
            c.windowUnload = !0
        });
        a.on("ended", c.rem1End);
        c.rem200 = {
            timeLimit: 2,
            counter: 0,
            lastPlayed: 0
        };
        a.on("timeupdate", c.rem200timeUpdate);
        c.rem201 = {
            timeupdate: !1
        };
        if (!vjs.IS_MOBILE) a.on("RsetStartScreen", function() {
            a.startScreen.posterImage.one("click", function() {
                a.one("timeupdate", function() {
                    c.rem201.timeupdate = !0
                });
                setTimeout(function() {
                    c.rem201.timeupdate && "none" === a.startScreen.posterImage.el_.style.display || a.isAd || c.sendReport("rem201")
                }, 6E3)
            })
        });
        c.rem300 = {
            positionInterval: void 0
        };
        c.stat100 = {
            start: (new Date).getTime(),
            poster: 0,
            playButton: 0,
            playButtonInterval: void 0
        };
        a.on("Rprogress", function(b) {
            setTimeout(function() {
                "setPoster" == b.data && (c.stat100.poster = (new Date).getTime(), a.startScreen.posterImage.size[0] || a.startScreen.posterImage.size[1] || a.landing.blockingError || c.sendReport("rem400"))
            }, 0)
        });
        "undefined" !== typeof a.options_.autoplay && 1 * a.options_.autoplay || a.tech.params && a.tech.params.autoplay ? c.stat100.autoplay = 1 : c.stat100.playButtonInterval = setInterval(function() {
            "block" == a.startScreen.playButton.el_.style.display && (clearInterval(c.stat100.playButtonInterval), c.stat100.playButton = (new Date).getTime())
        }, 50);
        setTimeout(function() {
            clearInterval(c.stat100.playButtonInterval);
            c.stat100.autoplay ? c.stat100.playButton = c.stat100.start : c.stat100.playButton || (c.sendReport("rem500"), c.stat100.playButton =
                c.stat100.start - 1)
        }, 2E4);
        a.on("RjsonpRequestCall", function() {
            c.sendReport("rem700")
        });
        setTimeout(function() {
            vjs.getMyCountry(function(a, b) {
                a ? c.sendReport("rem804") : b || c.sendReport("rem806")
            })
        }, 0);
        a.on(["Rrem801", "Rrem802", "Rrem803"], function(a) {
            if (c.windowUnload) c.sendReport("rem811");
            else {
                if ("Rrem803" == a.type) {
                    if (c.rem803Fired) return;
                    c.rem803Fired = !0
                }
                c.sendReport(a.type.substr(1), a.data)
            }
        });
        c.rem902Fired = !1;
        a.on(["Rrem901", "Rrem902", "Rrem903", "Rrem904"], function(a) {
            if (0 <= ["Rrem902", "Rrem904"].indexOf(a.type)) {
                if (c.remMainErrorFired) return;
                c.remMainErrorFired = !0
            }
            c.sendReport(a.type.substr(1), a.data)
        });
        a.on(["RremVast", "RremAdBlock", "RremNoAdBlock"], function(a) {
            c.sendReport(a.type.substr(1))
        });
        a.on("durationchange", function() {
            c.duration = this.duration()
        });
        a.on("timeupdate", this.trackPlayTime);
        a.on("nextvideo", function() {
            c.played = []
        })
    }
});
vjs.AutoFeedback.prototype.setMeta = function() {
    var a = this.player_,
        b = a.AutoFeedback,
        c = a.size();
    b.metaData = {
        code: "",
        tech: a.techName.toLowerCase(),
        options_autoplay: 1 * a.options_.autoplay,
        videoId: a.cache_.src,
        tech_autoplay: a.tech.params ? 1 * a.tech.params.autoplay : 0,
        flash: vjs.Flash.version().join("."),
        ad: a.isAd,
        duration: a.duration(),
        versionjs: a.options_.reEmbed.version ? a.options_.reEmbed.version.js : "",
        versioncss: a.options_.reEmbed.version ? a.options_.reEmbed.version.css : "",
        vast: a.options_.hasAds ? encodeURIComponent(a.Vast.vastURL) : "",
        currentTime: a.currentTime(),
        hasAds: a.options_.hasAds,
        preslots: a.options_.hasAds ? a.Vast.preslots : 0,
        postslots: a.options_.hasAds ? a.Vast.postslots : 0,
        nonlinear_slots: a.options_.hasAds ? a.nonLinear.slots : "none",
        playerCount: b.countPlayers(),
        life: (new Date).getTime() - b.initTime,
        w: c[0],
        h: c[1],
        ratio: (c[0] / c[1]).toFixed(4),
        id: a.id_
    }
};
vjs.AutoFeedback.prototype.countPlayers = function() {
    var a = 0,
        b;
    for (b in vjs.players) ++a;
    return a
};
vjs.AutoFeedback.prototype.sendReport = function(a, b) {
    var c = this.player_.AutoFeedback;
    if (!a) return !1;
    c.setMeta();
    c = vjs.cloneObject(c.metaData);
    c.code = a;
    if (b)
        for (var d in b) c[d] = b[d];
    vjs.createTrackingPixel(vjs.static_.feedbackServer, c)
};
vjs.AutoFeedback.prototype.trackPlayTime = function() {
    var a = this.player_,
        b = a.AutoFeedback;
    (!b.played.length || 0 < b.played.length && Math.floor(b.played[b.played.length - 1]) != Math.floor(a.currentTime())) && b.played.push(Math.floor(a.currentTime()))
};
vjs.AutoFeedback.prototype.rem1End = function() {
    var a = this.player_,
        b = a.AutoFeedback;
    3 >= b.played.length && b.played.length < b.duration && (a.isAd ? b.sendReport("rem101") : b.sendReport("rem100"), a.off("ended", b.rem1End));
    b.played[b.played.length - 1] !== Math.floor(a.duration()) && (a.isAd || b.sendReport("rem102"))
};
vjs.AutoFeedback.prototype.rem200timeUpdate = function() {
    var a = this.player_,
        b = a.AutoFeedback;
    b.played.length !== b.rem200.lastPlayed && (b.rem200.lastPlayed = b.played.length, "block" === a.overlaySpinner.el_.style.display || "block" === a.loadingSpinner.el_.style.display || vjs.hasClass(a.el_, "vjs-waiting")) && (++b.rem200.counter, b.rem200.counter > b.rem200.timeLimit && (b.sendReport("rem200"), a.off("timeupdate", b.rem200timeUpdate)))
};
vjs.AutoFeedback.prototype.rem300fullScreenChange = function() {
    var a = this.player_,
        b = a.AutoFeedback;
    a.isFullscreen() || a.defaultControls() || (setTimeout(function() {
        clearInterval(b.rem300.positionInterval)
    }, 2E3), b.rem300.positionInterval = setInterval(function() {
        "0px" === a.controlBar.el_.style.bottom || a.isFullscreen() ? "0px" !== a.controlBar.el_.style.bottom && a.isFullscreen() && (clearInterval(b.rem300.positionInterval), a.off("fullscreenchange", b.rem300fullScreenChange), b.sendReport("rem301")) : (clearInterval(b.rem300.positionInterval),
            a.off("fullscreenchange", b.rem300fullScreenChange), b.sendReport("rem300"))
    }, 10))
};
vjs.Captions = vjs.SelectBar.extend({
    init: function(a, b) {
        this.className = "vjs-yt-captions";
        this.pluginName = "Captions";
        vjs.SelectBar.call(this, a, b);
        this.active = !1;
        this.hide();
        this.setMouseListeners();
        this.langCode = "";
        this.codeMap = {
            off: "Off"
        };
        a.on("techchange", this.onTechChange);
        a.on("nextvideo", this.onNextVideo);
        a.options_.playerStarted && this.onNextVideo.apply(a)
    }
});
vjs.Captions.prototype.onNextVideo = function() {
    var a = this.player_,
        b = a.controlBar.Toolkit.Captions;
    if (b)
        if (a.paused()) a.one("play", b.tryCaptions);
        else b.tryCaptions.apply(a)
};
vjs.Captions.prototype.tryCaptions = function() {
    var a = this,
        b = a.controlBar.Toolkit.Captions;
    if ("youtube" !== a.techName.toLowerCase()) return !1;
    b.setCaptions("off");
    vjs.get(vjs.static_.youtubeCaptionsAPI(a.tech.videoId), function(c) {
        c = vjs.xml2Dom(c).getElementsByTagName("track");
        var d = [{
            value: "off",
            name: "Off"
        }];
        if (c.length) {
            for (var e = 0; e < c.length; ++e) d[e + 1] = {
                value: c[e].getAttribute("lang_code"),
                name: c[e].getAttribute("lang_translated")
            }, b.codeMap[d[e + 1].value] = d[e + 1].name;
            a.controlBar.Toolkit.show();
            b.show();
            b.setOptions(d);
            b.setActive("off");
            b.setCaptions("off")
        } else b.hide(), a.trigger("RdisabledCaptions")
    }, function() {
        b.hide();
        a.trigger("RdisabledCaptions")
    })
};
vjs.Captions.prototype.onTechChange = function() {
    var a = this.player_;
    "youtube" !== a.techName.toLowerCase() && (a.controlBar.Toolkit.removeChild("Captions"), a.trigger("RdisabledCaptions"))
};
vjs.Captions.prototype.setCaptions = function(a) {
    var b = this.player_;
    "off" == a ? (b.tech.ytplayer.unloadModule("cc"), b.tech.ytplayer.unloadModule("captions")) : (b.tech.ytplayer.loadModule("cc"), b.tech.ytplayer.setOption("cc", "track", {
        languageCode: a
    }), b.tech.ytplayer.loadModule("captions"), b.tech.ytplayer.setOption("captions", "track", {
        languageCode: a
    }))
};
vjs.Captions.prototype.selectAction = function(a) {
    var b = this.player_,
        c = b.controlBar.Toolkit.Captions;
    if ("undefined" == typeof c.codeMap[a.target.className.split(" active")[0]]) return !1;
    a = a.target.className.split(" active")[0];
    c.hideOptions();
    c.setCaptions(a);
    c.setActive(a);
    b.trigger("RcaptionsChanged")
};
vjs.Captions.prototype.optionSetCallback = function(a) {
    var b = this.player_.controlBar.Toolkit.Captions;
    b.currentEl[vjs.text] = b.codeMap[a]
};
vjs.options.children.Data = {};
vjs.Data = vjs.CoreObject.extend({
    init: function(a, b) {
        var c = this;
        c.player_ = a;
        c.options_ = b;
        c.videoInfo = {};
        c.adInfo = {};
        c.initialInfo = 0;
        a.on("RisLive", function() {
            a.isLive = 1
        });
        a.on("RlinearLoaded", function(a) {
            c.adInfo = {
                id: a.data.id,
                type: a.data.type
            }
        });
        a.on("RadEnd", function() {
            c.adInfo = {}
        });
        a.on("nextvideo", function() {
            if (!a.sourceTech) return !1;
            c.getInfo(a.sourceTech.type, a.sourceTech.src, function() {}, function() {})
        });
        a.cReady(function() {
            var b = a.options().sources;
            b[0].type && b[0].src && c.getInfo(b[0].type, b[0].src,
                function() {},
                function() {})
        });
        c._getInfoCache = {};
        c._callbacks = {};
        c._errorCallbacks = {}
    }
});
vjs.Data.prototype.getInfo = function(a, b, c, d) {
    var e = this.player_.Data,
        f = a.substr(6);
    e.getVideoInfo(f, b, function(a, k) {
        a || !k ? d && d(a) : (k._id = b, e._getInfoCache[f + "$" + b] = k, c(k))
    })
};
vjs.Data.prototype.getCachedData = function(a, b) {
    return this.player_.Data._getInfoCache[a + "$" + b]
};
vjs.Data.prototype.getVideoInfo = function(a, b, c) {
    var d = {},
        e = this.player_.Data;
    (d = e.getCachedData(a, b)) ? c(null, d): 0 > ["youtube", "dailymotion", "vimeo"].indexOf(a) ? (a = "html5", d = e.parseVideoInfo_html5(b), c(null, d)) : vjs.jsonp(vjs.static_.videoInfo(b, a), function(b, d) {
        b ? c(b, null) : "youtube" == a && d.restrictions && d.restrictions.geo ? vjs.getMyCountry(function(b, f) {
            d.myCountry = f;
            c(null, e["parseVideoInfo_" + a](d))
        }) : c(null, e["parseVideoInfo_" + a](d))
    }, void 0, "info_" + b + "_" + a)
};
vjs.Data.prototype.parseVideoInfo_html5 = function(a) {
    var b = this.player_;
    return {
        title: b.options_.title,
        description: b.options_.description,
        duration: "undefined" === typeof b.duration() ? !1 : b.duration(),
        poster: b.options_.poster,
        type: b.sourceTech.type.split("/")[1],
        provider: "html5",
        videoId: a,
        response: {
            live: !1
        }
    }
};
vjs.Data.prototype.parseVideoInfo_youtube = function(a) {
    var b = this.player_.Data;
    if (a.error || 0 > ["processed", "uploaded"].indexOf(a.status)) return null;
    var c = {};
    c.title = "";
    c.description = a.description;
    c.duration = a.duration;
    c.videoId = a.id;
    c.poster = a.live ? "https://i.ytimg.com/vi/" + c.videoId + "/sddefault_live.jpg" : vjs.static_.youtube_poster(c.videoId);
    c.response = a;
    c.type = "youtube";
    c.provider = "youtube";
    c.category = null;
    c.fidTopics = null;
    c.fidRelated = null;
    var d = a.meta;
    d && (c.category = d.iabCategoryId, d.topics &&
        (c.fidTopics = d.topics.topicIds, c.fidRelated = d.topics.relevantTopicIds));
    c.restrictions = {
        geo: b.geoRestriction(a.myCountry, a.restrictions.geo),
        embeddable: a.restrictions.embeddable,
        "private": a.restrictions["private"],
        age: a.restrictions.age
    };
    return c
};
vjs.Data.prototype.parseVideoInfo_dailymotion = function(a) {
    var b = this.player_,
        c = {},
        d = !1;
    "undefined" != typeof a.error ? d = void 0 : a.access_error ? -1 < a.access_error.title.indexOf("geo-restricted") ? d = "dm_geo" : -1 < ["DM007", "DM003"].indexOf(a.access_error.code) && "live" == a.mode && (d = "custom_" + vjs.capitaliseFirstLetter(a.access_error.raw_message)) : a.access_error || !a["private"] || "dailymotion" != b.techName.toLowerCase() || b.tech.params.html || (b.tech.params.chromeless = 0, b.defaultControls(!0), b.tech.loadDailymotion());
    !1 !== d && (b.trigger({
        type: "Rerror",
        data: d
    }), b.tech.removePlayer());
    c.title = a.title;
    c.duration = a.duration;
    c.description = a.description;
    c.videoId = a.id;
    c.poster = a.thumbnail_url;
    c.response = a;
    c.type = "dailymotion";
    c.provider = "dailymotion";
    return c
};
vjs.Data.prototype.parseVideoInfo_vimeo = function(a) {
    var b = this.player_,
        c = {};
    c.title = a.title;
    c.duration = a.duration;
    c.description = a.description;
    c.videoId = a.video_id;
    c.poster = a.thumbnail_url;
    c.response = a;
    c.type = "vimeo";
    c.provider = "vimeo";
    a.embed_privacy && "nowhere" == a.embed_privacy && b.trigger({
        type: "Rerror",
        data: "vm_embed"
    });
    return c
};
vjs.Data.prototype.geoRestriction = function(a, b) {
    return a && b ? b.allowed ? -1 == b.allowed.indexOf(a) : b.blocked ? -1 < b.blocked.indexOf(a) : !1 : !1
};
vjs.Data.prototype.getPoster = function(a, b, c) {
    var d = "",
        e = this.player_,
        f = e.Data,
        d = "video/youtube" == a ? "youtube" : "video/dailymotion" == a ? "dailymotion" : "video/vimeo" == a ? "vimeo" : "html5";
    /dailymotion|vimeo/i.test(d) && (d = "dynamic_load");
    switch (d) {
        case "youtube":
            return e.isLive ? c.apply(e, ["https://i.ytimg.com/vi/" + b + "/sddefault_live.jpg"]) : c.apply(e, [vjs.static_.youtube_poster(b)]);
        case "dynamic_load":
            return f.getInfo(a, b, function(a) {
                c.apply(e, [a.poster])
            }, function(a) {
                c.apply(e, [""])
            });
        case "html5":
            return c.apply(e, [e.poster_]);
        default:
            return c.apply(e, [""])
    }
};
vjs.options.children.endScreen = {};
vjs.EndScreen = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        var c = this;
        if (!(0 > a.options_.reEmbed.pings.plid.split("_")[1])) {
            c.endScreenActions = c.addChild("EndScreenActions");
            c.endScreenWatermark = c.addChild("endScreenWatermark");
            this.hide();
            a.on("play", function() {
                a.removeClass("vjs-playlist-end");
                c.hide()
            });
            a.on("Rreplay", function() {
                c.hide()
            });
            a.on("ended", function() {
                a.options_.reEmbed.vidpulseSiteId || "undefined" !== typeof vjs.Playlist || (a.addClass("vjs-playlist-end"), a.endScreen.show())
            });
            c.videoCategory = null;
            c.fidTopic = null;
            c.fidRelated = null;
            a.on("RsetVideoInfo", function(a) {
                a = a.data;
                c.videoCategory = a.category;
                c.fidTopics = a.fidTopics;
                c.fidRelated = a.fidRelated
            });
            var d = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchend" : "click";
            c.off("click");
            c.on(d, c.onClick);
            c.on("RnoGallery", function() {
                c.hasCTA || (c.endScreenActions.replay = c.endScreenActions.addChild("Replay", {
                    inline: !1
                }));
                a.addClass("vjs-no-gallery")
            });
            c.on("RgalleryLoaded", function() {
                c.hasCTA ? (c.endScreenActions.el_.appendChild(c.moreVideos),
                    a.addClass("vjs-cta-gallery")) : (c.replay = c.addChild("Replay", {
                    inline: !0
                }), a.addClass("vjs-has-gallery"), vjs.hasClass(a.el_, "vjs-endscreen-show") && (c.galleryOn = !0, c.trigger("RgalleryStateChange")))
            });
            a.options_.reEmbed.actionCall && (c.endScreenActions.replay = c.endScreenActions.addChild("Replay", {
                inline: !1
            }), c.endScreenActions.ActionCall = c.endScreenActions.addChild("ActionCall", a.options_.reEmbed.actionCall), c.hasCTA = !0);
            if (!a.options_.reEmbed.vidpulseSiteId) a.on("playlistEnd", vjs.bind(this, this.show));
            a.ready(function() {
                if (11481 == a.options_.reEmbed.pings.plid.split("_")[0]) a.one("play", function() {
                    a.poster(vjs.static_.nfl_poster)
                });
                a.addClass("vjs-endscreen-poster")
            });
            c.one("RgalleryLoaded", function() {
                var a = vjs.getDoc();
                "undefined" !== typeof a.hidden ? a.addEventListener("visibilitychange", function() {
                    c.sendWidgetVisibility.call(c, void 0, a.hidden ? 0 : void 0)
                }) : "undefined" !== typeof a.webkitHidden && a.addEventListener("webkitvisibilitychange", function() {
                    c.sendWidgetVisibility.call(c, void 0, a.webkitHidden ?
                        0 : void 0)
                });
                vjs.on(a, "scroll", c.sendWidgetVisibility.bind(c));
                c.on("RgalleryStateChange", c.sendWidgetVisibility)
            });
            a.one("play", function(b) {
                a.endScreen.loadGallery(b, !0)
            })
        }
    }
});
vjs.EndScreen.prototype.sendWidgetVisibility = function(a, b) {
    var c = this.player_,
        d = c.endScreen,
        c = d.galleryOn ? c.proportionInViewport() : 0;
    d.sendWidget({
        method: "visibility",
        params: {
            value: "undefined" !== typeof b ? b : c
        }
    })
};
vjs.EndScreen.prototype.loadGallery = function() {
    var a = this.player_,
        b = a.endScreen;
    a.options_.reEmbed.pings.plid.split("_");
    b.trigger("RnoGallery")
};
vjs.EndScreen.prototype.createEl = function() {
    var a = vjs.createEl("div", {
        className: "vjs-end-screen"
    });
    this.moreVideos = vjs.createEl("div", {
        className: "vjs-call-to-action vjs-call-to-action-recommended vjs-end-options"
    });
    this.moreVideosLink = vjs.createEl("a", {
        className: "vjs-call-to-action-icon",
        href: "javascript:;",
        innerHTML: "More Videos"
    });
    this.closeGallery = vjs.createEl("div", {
        className: "vjs-end-screen-gallery-close"
    });
    this.exitFullWindow = vjs.createEl("div", {
        className: "vjs-end-screen-cancel-fullwindow",
        innerHTML: "Close"
    });
    this.moreVideos.appendChild(this.moreVideosLink);
    var b = vjs.createEl("iframe", {
        className: "vjs-end-screen-gallery",
        frameborder: "0",
        scrolling: "no"
    });
    this.gallery = vjs.createEl("div", {
        className: "vjs-end-screen-gallery-wrapper"
    });
    this.gallery.appendChild(b);
    a.appendChild(this.closeGallery);
    a.appendChild(this.gallery);
    a.appendChild(this.exitFullWindow);
    return a
};
vjs.EndScreen.prototype.hide = function() {
    this.removeClass("vjs-inline-endscreen");
    this.player_.removeClass("vjs-endscreen-show");
    this.player_.addClass("vjs-endscreen-hide");
    vjs.IS_MOBILE && this.player_.toggleIframeFullscreen(!1, !0);
    this.galleryOn = !1;
    this.sendWidget({
        method: "close"
    });
    this.trigger("RgalleryStateChange");
    return this
};
vjs.EndScreen.prototype.fullscreenTest = function() {
    return !1
};
vjs.EndScreen.prototype.show = function(a, b) {
    var c = this.player_,
        d = c.endScreen;
    b && d.addClass("vjs-inline-endscreen");
    c.removeClass("vjs-endscreen-hide");
    c.addClass("vjs-endscreen-show");
    d.fullscreenTest() && c.toggleIframeFullscreen(!0, !0);
    vjs.hasClass(c.el_, "vjs-has-gallery") && (d.galleryOn = !0, d.sendWidget({
        method: "display",
        params: {
            xp: {
                inline: !!b
            }
        }
    }));
    d.trigger("RgalleryStateChange");
    return this
};
vjs.EndScreen.prototype.onClick = function(a) {
    a.preventDefault();
    var b = this.player_,
        c = b.endScreen;
    vjs.isDescendant(c.moreVideos, a.target) || vjs.isDescendant(c.closeGallery, a.target) ? c.toggleGallery() : vjs.hasClass(a.target, "vjs-end-screen-cancel-fullwindow") && b.toggleIframeFullscreen(!1, !0);
    return !1
};
vjs.EndScreen.prototype._widgetURL = function() {
    var a = this.player_,
        b = a.endScreen,
        c = a.options_.reEmbed.pings.plid.split("_");
    vjs.hasClass(this.player_.el_, "vjs-no-viewport");
    c = vjs.static_.galleryServer + "/" + c[0] + "/" + c[1] + "/#rurl=" + encodeURIComponent(vjs.getPageUrl()) + "&pageTitle=" + encodeURIComponent(vjs.getPageTitle()) + "&videoId=" + encodeURIComponent(a.videoId()) + "&videoProvider=" + encodeURIComponent(a.provider()) + "&cat=" + encodeURIComponent(b.videoCategory) + "&fidTopics=" + encodeURIComponent(JSON.stringify(b.fidTopics)) +
        "&fidRelated=" + encodeURIComponent(JSON.stringify(b.fidRelated)) + "&xp_posterEndscreen=1";
    vjs.IS_MOBILE && (c += "&viewport=" + (vjs.hasClass(a.el_, "vjs-no-viewport") ? 0 : 1) + "&fullscreen=" + b.fullscreenExperiment);
    return c
};
vjs.EndScreen.prototype.toggleGallery = function() {
    var a = this.player_,
        b = a.endScreen;
    b.galleryOn ? (b.gallery.style.display = "none", b.galleryOn = !1, b.sendWidget({
        method: "close"
    }), a.removeClass("vjs-gallery-enabled")) : (b.gallery.style.display = "block", b.galleryOn = !0, a.addClass("vjs-gallery-enabled"), b.sendWidget({
        method: "display"
    }));
    b.trigger("RgalleryStateChange")
};
vjs.EndScreen.prototype.sendWidget = function(a) {
    var b = this.player_.endScreen;
    b && b.channel && b.channel.ready(function() {
        b.channel.send(a)
    })
};
vjs.EndScreen.prototype.initWidget = function() {
    var a = this.player_.endScreen,
        b = "reEmbed-widget-endscreen-" + +new Date + Math.random(),
        c = a.gallery.childNodes[0];
    c.src = a._widgetURL() + "&chId=" + b;
    a.channel = vjs.postis({
        window: c.contentWindow,
        scope: b
    })
};
vjs.EndScreenActions = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b)
    }
});
vjs.EndScreenActions.prototype.createEl = function() {
    return vjs.createEl("div", {
        className: "vjs-end-screen-actions" + (this.player_.options_.reEmbed.actionCall ? " vjs-end-screen-has-cta" : "")
    })
};
vjs.Replay = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        a.replay = 0;
        var c = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchend" : "click";
        this.off("click");
        this.on(c, this.onClick);
        b.inline || (c = "Replay", "9707" == a.options_.reEmbed.pings.plid.split("_")[0] && (c = "Tekrar"), this.el_.childNodes[0][vjs.text] = c)
    }
});
vjs.Replay.prototype.createEl = function() {
    return vjs.createEl("div", {
        className: "vjs-replay vjs-end-options" + (this.options_.inline ? " vjs-inline-replay" : ""),
        title: "Replay video",
        innerHTML: "<span></span>"
    })
};
vjs.Replay.prototype.onClick = function(a) {
    a.preventDefault();
    a = this.player_;
    a.options_.playlistStarted ? a.play() : (a.replay = 1, a.trigger("Rreplay"))
};
vjs.EndScreenWatermark = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        a.on("play", this.clearCSSText)
    }
});
vjs.EndScreenWatermark.prototype.clearCSSText = function() {
    this.player_.endScreen.endScreenWatermark.el_.style.cssText = ""
};
vjs.EndScreenWatermark.prototype.createEl = function() {
    return vjs.createEl("a", {
        className: "vjs-watermark",
        href: vjs.static_.homepageURL + "?ref=endscreen",
        target: "_blank",
        title: "Custom YouTube Video Players",
        innerHTML: '<img src="' + vjs.static_.logo.white170px + '" alt="reEmbed" />'
    })
};
vjs.EndScreenWatermark.prototype.beforeRemove = function() {
    var a = this.player_,
        b = a.endScreen.endScreenWatermark;
    a.off("play", b.clearCSSText);
    a.off("playlistEnd", b.protectInterval)
};
vjs.EndScreenWatermark.prototype.verifyDom = function() {
    var a = this.player_.endScreen.endScreenWatermark;
    return null !== a.el_.parentNode && a.el_.childNodes.length && "img" == a.el_.childNodes[0].tagName.toLowerCase() && a.el_.childNodes[0].src == vjs.static_.logo.white170px && "vjs-watermark" == a.el_.className && a.el_.href == vjs.static_.homepageURL + "?ref=endscreen"
};
vjs.EndScreenWatermark.prototype.validateStyles = function(a, b) {
    a = a.toLowerCase().replace(/ |;$/g, "").split(";");
    b = b.toLowerCase().replace(/ |;$/g, "").split(";");
    if (a.length == b.length)
        for (var c = 0; c < a.length; ++c)
            if (-1 >= b.indexOf(a[c])) return !1;
    return a.length == b.length
};
vjs.FeedBack = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.on("click", this.onClick)
    }
});
vjs.FeedBack.prototype.onClick = function(a) {
    var b = this.player_.endScreen.endScreenButtons.feedBack;
    "vjs-report-issue" == a.target.className && (b.comment.style.display = "block", b.el_.childNodes[0].style.display = "none");
    if ("vjs-feedback-close" == a.target.className) return b.comment.style.display = "none", b.el_.childNodes[0].style.display = "block", !0;
    if ("vjs-feedback-submit" == a.target.className) return b.sendFeedback(), !0
};
vjs.FeedBack.prototype.sendFeedback = function() {
    var a = this.player_,
        b = a.endScreen.endScreenButtons.feedBack;
    b.comment.style.display = "none";
    b.el_.childNodes[0].parentNode.removeChild(b.el_.childNodes[0]);
    b.comment.parentNode.removeChild(b.comment);
    var c = "c=" + encodeURIComponent(b.comment.childNodes[1].value) + "&",
        c = c + ("u=" + encodeURIComponent(window.location.href) + "&"),
        c = c + ("b=" + encodeURIComponent(vjs.USER_AGENT) + "&"),
        c = c + ("f=" + encodeURIComponent(vjs.Flash.version().join(".")) + "&"),
        c = c + ("t=" + encodeURIComponent(a.techName) +
            "&"),
        c = c + ("p=" + encodeURIComponent(a.id_) + "&"),
        c = c + ("a=" + encodeURIComponent(a.isAd));
    document.createElement("img").setAttribute("src", vjs.static_.feedbackURL + c);
    b.thankyou.style.display = "block"
};
vjs.FeedBack.prototype.createEl = function() {
    var a = vjs.createEl("div", {
            className: "vjs-feedback",
            innerHTML: '<span class="vjs-report-issue">Report an issue</span>'
        }),
        b = vjs.createEl("div", {
            className: "vjs-feedback-comment",
            innerHTML: "<span>More information about this issue would be really helpful.</span>"
        }),
        c = vjs.createEl("textarea", {}),
        d = vjs.createEl("input", {
            type: "submit",
            className: "vjs-feedback-submit",
            value: "Submit"
        }),
        e = vjs.createEl("img", {
            src: vjs.static_.close,
            className: "vjs-feedback-close"
        });
    e.style.cssText =
        "width: 13px !important;height: 12px !important;";
    this.thankyou = vjs.createEl("span", {
        className: "vjs-feedback-message",
        innerHTML: "Thank you for your feedback!"
    });
    b.appendChild(c);
    b.appendChild(d);
    b.appendChild(e);
    this.comment = b;
    a.appendChild(this.comment);
    a.appendChild(this.thankyou);
    return a
};
vjs.options.children.landing = {};
(function() {
    var a = {
        notech: {
            desktop: 'Sorry, no compatible source and playback technology were found for this video. Try using another browser like <a href="http://www.google.com/chrome/">Chrome</a> or download the latest <a href="http://get.adobe.com/flashplayer/">Adobe Flash Player</a>.',
            mobile: "Sorry, this video can't be played on your device."
        },
        yt100: "The video was not found on YouTube. It is either removed or marked as private.",
        yt101: 'The owner of the requested video does not allow this video to be played in embedded players <a class="vjs-loading-youtube" href="http://www.youtube.com/watch?v=VJS_ERROR_VAR" target="_blank">Watch it on YouTube</a>',
        yt150: 'The owner of the requested video does not allow this video to be played in embedded players <a class="vjs-loading-youtube" href="http://www.youtube.com/watch?v=VJS_ERROR_VAR" target="_blank">Watch it on YouTube</a>',
        yt_region: "This video is not available in your region.",
        vm_embed: 'Sorry, because of its privacy settings, this video cannot be played here. <a class="vjs-loading-youtube" href="https://vimeo.com/VJS_ERROR_VAR" target="_blank">Watch on Vimeo</a>',
        dm_geo: "Video geo-restricted by the owner.",
        playlist_error: "There was an error loading this video.<p>Loading next video..</p>",
        playlist_error_prompt_click: "There was an error loading this video.<p>Click here to load the next video</p>"
    };
    vjs.Landing = vjs.Component.extend({
        init: function(a,
            c) {
            vjs.Component.call(this, a, c);
            var d = this;
            d.enableClick = 0;
            d.hide();
            d.currentError = void 0;
            a.on("play", function() {
                d.hide()
            });
            var e = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click";
            d.off("click");
            d.on(e, d.onClick);
            a.loadError && a.cReady(function() {
                d.error(a.loadError)
            });
            d.blockingError = !1;
            a.on("Rerror", function(c) {
                if (c.data && -1 < String(c.data).indexOf("playlist")) d.blockingError = 0;
                else {
                    var e = a.Playlist.videoQ[Math.max(0, a.Playlist.positionInQ - 1)][0].type,
                        e = 0 > ["youtube", "vimeo", "dailymotion"].indexOf(e.split("video/")[1]) ?
                        "html5" : e.split("video/")[1];
                    a.Data.getCachedData(e, a.cache_.src) || "youtube" != e ? a.trigger({
                        type: "Rrem902",
                        data: c.data ? {
                            errorCode: c.data
                        } : void 0
                    }) : a.trigger({
                        type: "Rrem904",
                        data: c.data ? {
                            errorCode: c.data
                        } : void 0
                    });
                    d.blockingError = 1
                }(!d.currentError || "" == d.currentError || "" != d.currentError && c.data && "" != c.data) && d.error(c.data)
            });
            a.on(["nextvideo", "RnoError"], function() {
                d.currentError = void 0;
                d.hide()
            });
            d.on("RgalleryLoaded", function() {
                d.moreVideos.style.display = "inline-block"
            });
            d.one("RgalleryLoaded",
                function() {
                    var a = vjs.getDoc();
                    "undefined" !== typeof a.hidden ? a.addEventListener("visibilitychange", function() {
                        d.sendWidgetVisibility.call(d, void 0, a.hidden ? 0 : void 0)
                    }) : "undefined" !== typeof a.webkitHidden && a.addEventListener("webkitvisibilitychange", function() {
                        d.sendWidgetVisibility.call(d, void 0, a.webkitHidden ? 0 : void 0)
                    });
                    vjs.on(a, "scroll", d.sendWidgetVisibility.bind(d));
                    d.on("RgalleryStateChange", d.sendWidgetVisibility)
                })
        }
    });
    vjs.Landing.prototype.sendWidgetVisibility = function(a, c) {
        var d = this.player_,
            e = d.landing,
            d = e.galleryOn ? d.proportionInViewport() : 0;
        e.gallerySend({
            method: "visibility",
            params: {
                value: "undefined" !== typeof c ? c : d
            }
        })
    };
    vjs.Landing.prototype.hide = function() {
        this.el_.style.display = "none";
        this.enableClick = 0;
        return this
    };
    vjs.Landing.prototype.onClick = function(a) {
        var c = this.player_,
            d = c.landing;
        vjs.isDescendant(d.moreVideos, a.target) ? (d.toggleGallery(), d.loadGalleryIframe()) : "vjs-loading-recommended-close" == a.target.className || "vjs-loading-recommended-close" == a.target.parentNode.className ?
            d.toggleGallery() : d.enableClick && c.trigger("RnextVideo");
        return !1
    };
    vjs.Landing.prototype.loadGallery = function() {
        var a = this.player_,
            c = a.landing;
        a.options_.reEmbed.pings.plid.split("_");
        c.trigger("RnoGallery")
    };
    vjs.Landing.prototype.loadGalleryIframe = function() {
        var a = this.player_,
            c = a.landing,
            d = a.options_.reEmbed.pings.plid.split("_"),
            e = "reEmbed-widget-broken-" + +new Date + Math.random(),
            f = c.recommended.getElementsByTagName("iframe")[0];
        f.src = vjs.static_.galleryServer + "/" + d[0] + "/" + d[1] + "/" + (vjs.IS_IPHONE ?
            "mobile/" : "") + "#rurl=" + encodeURIComponent(vjs.getPageUrl()) + "&pageTitle=" + encodeURIComponent(vjs.getPageTitle()) + "&videoId=" + encodeURIComponent(a.videoId()) + "&videoProvider=" + encodeURIComponent(a.provider()) + "&ref=brokenvideo&chId=" + encodeURIComponent(e);
        c.channel = vjs.postis({
            window: f.contentWindow,
            scope: e
        })
    };
    vjs.Landing.prototype.gallerySend = function(a) {
        var c = this.player_.landing;
        c && c.channel && c.channel.ready(function() {
            c.channel.send(a)
        })
    };
    vjs.Landing.prototype.toggleGallery = function() {
        var a = this.player_.landing;
        a.galleryOn ? (a.recommended.style.display = "none", a.gallerySend({
            method: "close"
        }), a.galleryOn = !1) : (a.recommended.style.display = "block", a.gallerySend({
            method: "display"
        }), a.galleryOn = !0);
        a.trigger("RgalleryStateChange")
    };
    vjs.Landing.prototype.createEl = function() {
        this.el_ = vjs.Component.prototype.createEl("div", {
            className: "vjs-loading-screen"
        });
        this.content = vjs.Component.prototype.createEl("div", {
            className: "vjs-loading-container"
        });
        this.warning = vjs.Component.prototype.createEl("span", {
            className: "vjs-loading-warning",
            innerHTML: "!"
        });
        this.errorElem = vjs.Component.prototype.createEl("span", {
            className: "vjs-loading-error"
        });
        this.moreVideos = vjs.Component.prototype.createEl("span", {
            className: "vjs-loading-more",
            innerHTML: "<a>More videos</a>"
        });
        this.recommended = vjs.Component.prototype.createEl("div", {
            className: "vjs-loading-recommended",
            innerHTML: "<div class='vjs-loading-recommended-title'><span class='vjs-loading-recommended-close'><img src='" + vjs.static_.close + "' /></span><span class='vjs-loading-recommended-caption'>More videos</span></div>"
        });
        var a = vjs.Component.prototype.createEl("div", {
                className: "vjs-loading-recommended-iframe-wrapper"
            }),
            c = vjs.Component.prototype.createEl("iframe", {
                className: "vjs-loading-recommended-iframe",
                frameborder: "0",
                scrolling: "no"
            });
        a.appendChild(c);
        this.recommended.appendChild(a);
        this.el_.appendChild(this.warning);
        this.content.appendChild(this.errorElem);
        this.content.appendChild(this.moreVideos);
        this.el_.appendChild(this.content);
        this.el_.appendChild(this.recommended);
        return this.el_
    };
    vjs.Landing.prototype.error =
        function(b) {
            var c = this.player_,
                d = c.landing,
                e;
            "string" === typeof b && (e = b, b = b.toLowerCase());
            d.galleryLoaded || (d.galleryLoaded = !0, d.loadGallery());
            b in a ? (d.currentError = b, e = a[b], "string" !== typeof e && (e = vjs.IS_MOBILE ? e.mobile : e.desktop), -1 < ["yt", "vm"].indexOf(b.substr(0, 2)) && (e = e.replace("VJS_ERROR_VAR", c.tech.videoId)), /_prompt_click/.test(b) ? d.enableClick = 1 : d.enableClick = 0) : "string" === typeof b && 0 == b.indexOf("custom_") ? (d.currentError = e, e = e.replace("custom_", "")) : (d.currentError = "", e = "There was an error loading this video.");
            d.errorElem.style.display = "block";
            c.options_.reEmbed.vidpulseSiteId || d.show();
            d.errorElem.innerHTML = e;
            c.trigger("landingError");
            return !0
        }
})();
vjs.options.children.logo = {};
vjs.Logo = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        c.options = a.options_.reEmbed.logo;
        if (!c.noLogo && (c.el_.style[c.options.align] = "0", c.el_.style.display = "none", c.noClick && (c.el_.onclick = function() {
                return !1
            }, c.el_.style.cursor = "default"), c.off("click"), c.off("touchstart"), c.eventListener = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click", c.on(c.eventListener, c.onClick), a.on("Rresize", vjs.bind(c, c.resize)), a.on("RlinearLoaded", function(a) {
                c.hide()
            }), a.on("RvideoLoaded",
                function() {
                    c.show()
                }), !a.options_.reEmbed.logoOnFullScreen)) a.on("fullscreenchange", function() {
            a.isFullscreen() ? c.hide() : c.show()
        })
    }
});
vjs.Logo.prototype.onClick = function(a) {
    a = this.player_.logo;
    if (a.noLogo || a.noClick) return !1;
    (vjs.IS_ANDROID || vjs.IS_IOS) && window.open(a.el_.getAttribute("href"))
};
vjs.Logo.prototype.show = function() {
    var a = this.player_.logo;
    if (a.noLogo) return !1;
    a.resize();
    return a.el_.style.display = "block"
};
vjs.Logo.prototype.resize = function() {
    var a = this.player_,
        b = a.logo,
        a = a.size()[0] / vjs.static_.wizard_width,
        c = b.options.scale * b.options.width,
        d = b.options.pady,
        e = b.options.padx;
    1 > a && (c *= a, e *= a, d *= a);
    b.el_.style.margin = d + "px " + e + "px";
    b.el_.style.width = c + "px"
};
vjs.Logo.prototype.createEl = function() {
    var a = this.player_;
    this.noClick = this.noLogo = 0;
    "undefined" == typeof a.options_.reEmbed.logo && (this.noLogo = 1);
    var b = vjs.createEl("a", {
        className: "vjs-logo",
        target: "_blank"
    });
    if (this.noLogo) return b;
    b.href = a.options_.reEmbed.logo.href;
    "" == a.options_.reEmbed.logo.href && (this.noClick = 1);
    a = vjs.createEl("img", {
        src: a.options_.reEmbed.logo.src
    });
    b.appendChild(a);
    return b
};
vjs.MiniPlayButton = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        a.cReady(function() {
            c.resize()
        });
        c.hasLoadedPoster = !1;
        a.on("play", function() {
            c.hide()
        });
        a.on("Rresize", vjs.bind(c, c.resize));
        c.off("click");
        var d = "click";
        vjs.IS_IPAD && /html5|flash/i.test(a.techName) && (d = "touchstart");
        c.on(d, function(b) {
            a.initialClick.apply(a, [b])
        });
        a.one("RshowOverlaySpinner", function() {
            c.hide()
        })
    }
});
vjs.MiniPlayButton.prototype.resize = function() {
    var a = this.player_,
        b = a.startScreen.playButton,
        a = .6 + .3 * (a.size()[0] / 600);
    b.el_.style.setProperty && b.el_.style.setProperty("font-size", a + "em", "important")
};
vjs.MiniPlayButton.prototype.createEl = function() {
    return vjs.Button.prototype.createEl.call(this, "div", {
        className: "rem-play-mini",
        innerHTML: '<span class="vjs-control-text">Play Button</span>',
        role: "button",
        "aria-live": "polite"
    })
};
vjs.options.children.MoreVideos = {};
vjs.MoreVideos = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        c.slideTimeout = void 0;
        c.animationInterval = void 0;
        c.on("click", function(b) {
            a.trigger("RmoreVideosClick");
            a.endScreen.show(b, !0)
        });
        a.on("pause", function() {
            a.options_.reEmbed.vidpulseSiteId || !vjs.hasClass(a.el_, "vjs-has-gallery") || vjs.IS_MOBILE || (c.el_.style.right = "-1px", c.show(), c.slideTimeout = setTimeout(c.slideAnimation.bind(c), 3E3))
        });
        a.on("play", function() {
            c.hide();
            clearInterval(c.animationInterval);
            clearTimeout(c.slideTimeout)
        })
    }
});
vjs.MoreVideos.prototype.slideAnimation = function() {
    var a = this.player_.MoreVideos,
        b = -1;
    a.animationInterval = setInterval(function() {
        -79 > b ? clearInterval(a.animationInterval) : (a.el_.style.right = b + "px", b -= 2)
    }, 10)
};
vjs.MoreVideos.prototype.createEl = function() {
    var a = vjs.createEl("div", {
            className: "vjs-more-videos"
        }),
        b = vjs.createEl("span", {
            innerText: "More Videos"
        });
    a.appendChild(b);
    return a
};
vjs.options.children.overlaySpinner = {};
vjs.OverlaySpinner = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        var c = this;
        c.hide();
        a.on("RshowOverlaySpinner", function() {
            c.show()
        });
        a.on(["play", "landingError", "RhideOverlaySpinner"], function() {
            c.hide()
        });
        if (!vjs.IS_MOBILE) a.on("timeupdate", function() {
            c.hide()
        });
        else if (vjs.IS_IOS && "vimeo" !== a.techName.toLowerCase()) a.one("timeupdate", function() {
            c.show()
        })
    }
});
vjs.OverlaySpinner.prototype.createEl = function() {
    return vjs.Component.prototype.createEl("div", {
        className: "vjs-loading-overlay",
        innerHTML: "<div></div>"
    })
};
vjs.options.children.PerfStats = {};
vjs.PerfStats = vjs.Component.extend({
    init: function(a, b) {
        this.player_ = a;
        this.options_ = b;
        var c = this,
            d = a.options_.reEmbed.initTime;
        c.tts = void 0;
        c.ttr = void 0;
        c.coreInitTime = d;
        c.playerInitTime = (new Date).getTime();
        c.startScreenTime = void 0;
        c.posterTime = void 0;
        c.pcore = void 0;
        c.wunload = void 0;
        c.piload = void 0;
        c.pwidgetapi = void 0;
        c.iload = void 0;
        c.techReadyTime = void 0;
        c.clickTime = void 0;
        c.bufferTime = void 0;
        c.clickEvent = void 0;
        if (vjs.IS_MOBILE && !vjs.IS_IPHONE) a.one("ended", function() {
            var b = vjs.getWindow(),
                d = vjs.getDoc(),
                b = (b.innerWidth / (d.documentElement.clientWidth || 1)).toFixed(2);
            vjs.hasClass(a.el_, "vjs-no-viewport") && c.sendStats({
                _zoomRatio: 1E4 * b
            })
        });
        var e = "click";
        if ((vjs.IS_ANDROID || vjs.IS_IPAD) && /html5|flash/i.test(a.techName) || vjs.IS_MOBILE && "vimeo" == a.techName.toLowerCase()) e = "touchstart";
        a.cReady(function() {
            var b = !1,
                d = !1,
                k = !1,
                h = a.options_.hasAds;
            a.startScreen.posterImage.on(e, function() {
                k = d;
                b = !0
            });
            a.ready(function() {
                d = !0
            });
            a.one("play", function() {
                c.sendStats({
                    _startAfterClick: b
                });
                b && c.sendStats({
                    _startAfterClickCause: h ?
                        "hasAds" : k ? "" : "not ready"
                })
            })
        });
        a.options_.hasAds || (a.one("RpauseClick", function() {
            c.sendStats({
                _clickPaused: !0
            });
            var b = (new Date).getTime();
            a.one("play", function() {
                var a = (new Date).getTime();
                c.sendStats({
                    _startedAfterPause: !0,
                    _timePlayAfterPause: a - b
                })
            })
        }), a.one("RmoreVideosClick", function() {
            c.sendStats({
                _moreVideosClick: !0
            });
            a.one("play", function() {
                c.sendStats({
                    _startedAfterMoreVideos: !0
                })
            })
        }), a.on("Rprogress", function g(b) {
            "setStartScreen" == b.data && (c.startScreenTime = (new Date).getTime());
            "setPoster" ==
            b.data && (a.off("Rprogress", g), c.posterTime = (new Date).getTime(), c.techReadyTime && c.iload && c.sendStartScreenStats(), a.startScreen.posterImage.on(e, function() {
                c.clickTime = (new Date).getTime();
                c.bufferTimeout = setTimeout(function() {
                    c.bufferTime = -1;
                    a.off("timeupdate", c.timeToBufferCallback);
                    c.sendBufferStats()
                }, 1E4);
                c.clickEvent = c.ttr ? 1 : 0;
                a.one("timeupdate", c.timeToBufferCallback)
            }))
        }), window.onbeforeunload = function() {
            c.wunload = 1
        }, a.one("RperfILoaded", function() {
            c.iload = (new Date).getTime() - c.playerInitTime;
            "youtube" == a.techName.toLowerCase() && (c.capturePerformance(), "failed" == c.piload && (c.techReadyTime = "failed"));
            c.techReadyTime && c.posterTime && c.sendStartScreenStats()
        }), a.one("play", function() {
            c.played = [];
            a.one("ended", function() {
                3 >= c.played.length && c.played.length < a.duration() ? c.sendStats({
                    _finishedImmediately: !0
                }) : c.sendStats({
                    _finishedImmediately: !1
                });
                c.played[c.played.length - 1] !== Math.floor(a.duration()) ? c.sendStats({
                    _finishedWithoutLastSec: !0
                }) : c.sendStats({
                    _finishedWithoutLastSec: !1
                });
                c.played = []
            });
            a.on("timeupdate", function() {
                (!c.played.length || 0 < c.played.length && Math.floor(c.played[c.played.length - 1]) != Math.floor(a.currentTime())) && c.played.push(Math.floor(a.currentTime()))
            })
        }), c.firedReady = !1, a.ready(function() {
            !c.firedReady && a.techName && (c.firedReady = !0, c.techReadyTime = (new Date).getTime(), c.posterTime ? "youtube" == a.techName.toLowerCase() ? c.iload ? c.sendStartScreenStats() : setTimeout(function() {
                    c.iload || (a.off("RperfILoaded"), c.iload = -1, c.sendStartScreenStats())
                }, 5E3) : (c.iload = -2, c.sendStartScreenStats()) :
                "youtube" != a.techName.toLowerCase() && (c.iload = -2))
        }))
    }
});
vjs.PerfStats.prototype.getMeta = function() {
    var a = this.player_;
    return {
        source: "player",
        version: a.options_.reEmbed.version ? a.options_.reEmbed.version.js : "",
        tech: a.techName.toLowerCase()
    }
};
vjs.PerfStats.prototype.timeToBufferCallback = function() {
    var a = this.player_.PerfStats;
    clearTimeout(a.bufferTimeout);
    a.bufferTime = (new Date).getTime();
    a.sendBufferStats()
};
vjs.PerfStats.prototype.capturePerformance = function() {
    var a = this.player_,
        b = a.PerfStats;
    if (window.performance && window.performance.getEntriesByType) {
        var c = window.performance.getEntriesByType("resource"),
            d;
        for (d in c) - 1 < c[d].name.indexOf("cdn.reembed.com/player/core") && "script" == c[d].initiatorType ? b.pcore = Math.ceil(c[d].duration) : -1 < c[d].name.indexOf("youtube.com/embed/") && -1 < ["iframe", "subdocument"].indexOf(c[d].initiatorType) ? b.piload = Math.ceil(c[d].duration) : -1 < c[d].name.indexOf("www-widgetapi") &&
            "script" == c[d].initiatorType && (b.pwidgetapi = Math.ceil(c[d].duration));
        "youtube" == a.techName.toLowerCase() && "undefined" == typeof b.piload && (b.piload = "failed")
    }
};
vjs.PerfStats.prototype.testYoutubeLink = function(a) {
    var b = this,
        c = document.createElement("script");
    c.async = !0;
    c.src = "https://www.youtube.com/iframe_api";
    var d = document.getElementsByTagName("script")[0];
    c.onload = function() {
        b.blockedYoutube = !1;
        a()
    };
    c.onerror = function() {
        b.blockedYoutube = !0;
        a()
    };
    d.parentNode.insertBefore(c, d)
};
vjs.PerfStats.prototype.sendStartScreenStats = function() {
    function a() {
        c.sendStats({
            _tts: c.tts,
            _ttr: c.ttr,
            _tposter: c.tposter,
            _tiload: c.iload,
            _ptiload: c.piload,
            _tcore: c.playerInitTime - c.coreInitTime,
            _ptcore: c.pcore,
            _pwidgetapi: c.pwidgetapi,
            _pwunload: c.wunload,
            _hasAdBlock: c.hasAdBlock,
            _blockedYoutube: c.blockedYoutube,
            _failedWithAdb: "failed" == c.piload && c.hasAdBlock
        })
    }
    var b = this.player_,
        c = b.PerfStats;
    c.tts = c.posterTime - c.coreInitTime;
    c.ttr = "failed" !== c.techReadyTime ? c.techReadyTime - c.playerInitTime : c.techReadyTime;
    c.tposter = c.posterTime - c.startScreenTime;
    c.capturePerformance();
    c.posterTime = void 0;
    c.techReadyTime = void 0;
    "youtube" === b.techName.toLowerCase() && vjs.get("https://ads.reembed.com/get.php", function() {
        c.hasAdBlock = !1
    }, function() {
        c.hasAdBlock = !0
    }, void 0, void 0, "HEAD", function() {
        c.testYoutubeLink.apply(c, [a])
    })
};
vjs.PerfStats.prototype.sendBufferStats = function() {
    var a = this.player_.PerfStats,
        b = {};
    b["_" + (a.clickEvent ? "crb" : "cub")] = 0 < a.bufferTime ? a.bufferTime - a.clickTime : a.bufferTime;
    a.sendStats(b)
};
vjs.PerfStats.prototype.sendStats = function(a) {
    var b = this.player_.PerfStats.getMeta(),
        c;
    for (c in a) b[c] = a[c]
};
vjs.options.children.Pings = {};
vjs.Pings = vjs.Component.extend({
    init: function(a, b) {
        var c = this,
            d = a.options_.reEmbed;
        d.pings.video_code = "";
        if ("undefined" == typeof a.noTech || 0 == a.noTech) d.pings.video_code = a.videoId();
        c.pingParams = {};
        c.pingParams.rurl = encodeURIComponent(vjs.getPageUrl());
        c.lastSec = 0;
        c.bucketCount = 0;
        c.bucket = [];
        c.loadedPings = {};
        c.playPings = {};
        c.brokenPings = {};
        for (var e in d.pings) c.pingParams[e] = d.pings[e];
        c.pingParams.pTitle = encodeURIComponent(vjs.getPageTitle());
        c.pingParams.pDesc = encodeURIComponent(vjs.getPageDesc());
        "iframe.reembed.com" ==
        window.location.hostname && (c.pingParams.isReembeded = 1);
        0 <= ["iframe.reembed.com", "embed.reembed.com"].indexOf(window.location.hostname) && (c.pingParams.rurl = encodeURIComponent(document.referrer));
        c.pingParams.initTime = (new Date).getTime();
        c.pingParams.playbackStartTime = 0;
        c.pingParams.fullScreen = 0;
        c.newPingId();
        c.pingParams.videoFinished = 0;
        c.pingParams.playbackDataArray = [];
        c.pingParams.errorType = "";
        c.pingData = {
            common: ["plid", "video_code", "video_provider", "rurl"],
            ping1: ["isReembeded", "pTitle", "pDesc"],
            ping2: ["initTime", "playbackStartTime", "uniquePingReferrenceId"],
            ping3: "initTime playbackStartTime uniquePingReferrenceId videoFinished playbackDataArray fullScreen".split(" "),
            social: ["initTime", "share"],
            ping_removed: "initTime playbackStartTime uniquePingReferrenceId videoFinished fullScreen isReembeded errorType".split(" ")
        };
        c.player_ = a;
        setTimeout(function() {
            c.onLoad()
        }, 0);
        a.on("play", function() {
            c.onPlay()
        });
        a.on("ended", function() {
            c.onEnded()
        });
        a.on("RvideoLoaded", function() {
            a.on("timeupdate", c.onTimeChange)
        });
        a.on("RlinearLoaded", function() {
            a.off("timeupdate", c.onTimeChange)
        });
        a.on("pause", function() {
            c.onPause()
        });
        a.on(["error", "Rerror"], function(a) {
            c.onError(a.data)
        });
        c.videoCategory = null;
        a.on("RsetVideoInfo", function(a) {
            c.initBuckets();
            c.videoCategory = a.data.category
        });
        a.on("RshareSocial", function(a) {
            c.social(a.data)
        });
        a.on("RvideoLoaded", function() {
            if (a.isAd) return !1;
            if (a.provider() != c.pingParams.video_provider || a.videoId() != c.pingParams.video_code) c.pingParams.video_code = encodeURIComponent(a.videoId()),
                c.pingParams.video_provider = a.provider(), c.newPingId(), c.onLoad()
        });
        c.iframe = null;
        window.onunload = function() {
            !a.isAd && a.options_.playlistStarted && c.sendBuckets()
        }
    }
});
vjs.Pings.prototype.newPingId = function() {
    var a = (new Date).getTime().toString(16) + Math.floor(1E17 * Math.random()).toString(16);
    this.pingParams.uniquePingReferrenceId = a
};
vjs.Pings.prototype.hasNegativePlid = function() {
    return 0 > this.pingParams.plid.split("_")[1]
};
vjs.Pings.prototype.onPause = function() {
    var a = this.player_;
    if (a.isLive || a.isAd) return !1;
    a.Pings.sendBuckets()
};
vjs.Pings.prototype.onEnded = function() {
    var a = this.player_;
    if (a.isAd) return !1;
    a.Pings.sendBuckets(1)
};
vjs.Pings.prototype.onLoad = function() {
    var a = this.player_.Pings;
    if ("undefined" !== typeof a.loadedPings[a.pingParams.video_code]) return !1;
    a.firePing(vjs.static_.pings.ping1, "PING1")
};
vjs.Pings.prototype.onTimeChange = function() {
    var a = this.player_,
        b = a.Pings;
    if (a.isAd || Math.floor(a.currentTime()) === b.lastSec) return !1;
    b.lastSec = Math.floor(a.currentTime());
    b.bucket.push(Math.floor(a.currentTime()));
    10 <= b.bucket.length && b.sendBuckets()
};
vjs.Pings.prototype.onPlay = function() {
    var a = this.player_,
        b = a.Pings;
    if (a.isAd || "undefined" != typeof b.playPings[b.pingParams.video_code]) return !1;
    b.pingParams.playbackStartTime = (new Date).getTime();
    b.pingParams.videoFinished = 0;
    b.firePing(vjs.static_.pings.ping2, "PING2");
    b.sendBuckets();
    var c = document.createElement("iframe");
    c.style.display = "none";
    b.hasNegativePlid() || (c.src = vjs.static_.pings.widget_local + "#video_provider=" + b.pingParams.video_provider + "&video_code=" + b.pingParams.video_code + "&cat=" + b.videoCategory +
        "&plid=" + b.pingParams.plid + "&rurl=" + encodeURIComponent(document.location.href) + "&nurl=" + b.pingParams.rurl + "&ref=" + encodeURIComponent(document.referrer), null == b.iframe ? a.el_.appendChild(c) : a.el_.replaceChild(c, b.iframe), b.iframe = c)
};
vjs.Pings.prototype.social = function(a) {
    var b = this.player_.Pings;
    b.pingParams.share = a;
    b.firePing(vjs.static_.pings.social, "social")
};
vjs.Pings.prototype.onError = function(a) {
    var b = this.player_.Pings;
    if ("undefined" != typeof b.brokenPings[b.pingParams.video_code]) return !1;
    b.pingParams.errorType = a ? a : "";
    b.firePing(vjs.static_.pings.ping_removed, "PING_REMOVED")
};
vjs.Pings.prototype.firePing = function(a, b, c) {
    c = this.player_;
    var d = c.Pings;
    if (c.isAd || "" == a || d.hasNegativePlid()) return !1;
    /MSIE 8|MSIE 9/i.test(vjs.USER_AGENT);
    a = {
        ping_type: b
    };
    var e = "undefined" !== typeof d.pingData[b.toLowerCase()] ? d.pingData[b.toLowerCase()] : [],
        f = d.pingData.common,
        g;
    for (g = 0; g < f.length; ++g) a[f[g]] = d.pingParams[f[g]];
    for (g = 0; g < e.length; ++g) a[e[g]] = d.pingParams[e[g]];
    "ping3" == b.toLowerCase() && (a.duration = c.duration());
    switch (b.toLowerCase()) {
        case "ping1":
            d.loadedPings[d.pingParams.video_code] = !0;
            break;
        case "ping2":
            d.playPings[d.pingParams.video_code] = !0;
            break;
        case "ping_removed":
            d.brokenPings[d.pingParams.video_code] = !0
    }
};
vjs.Pings.prototype.sendBuckets = function(a) {
    var b = this.player_,
        c = b.Pings;
    if (b.isLive) return !1;
    "undefined" != typeof a && (c.pingParams.videoFinished = 1);
    if (!c.bucket.length && !c.pingParams.videoFinished) return !1;
    c.pingParams.playbackDataArray = c.bucket.join(",");
    c.bucket = [];
    c.firePing(vjs.static_.pings.ping3, "PING3")
};
vjs.Pings.prototype.initBuckets = function() {
    var a = this.player_;
    if (a.isLive) return !1;
    a.Pings.bucket = [0]
};
vjs.Pings.prototype.getAbsoluteURL = function(a) {
    var b = document.createElement("a");
    b.href = a;
    return b.href
};
vjs.options.children.Playlist = {};
vjs.Playlist = vjs.Component.extend({
    init: function(a, b) {
        this.player_ = a;
        var c = this;
        c.initialVideo = a.options_.sources;
        c.options_ = b;
        c.videoQ = [c.initialVideo];
        c.videoQ[0][0].ad = 0;
        c.positionInQ = 0;
        c.mainVideoPos = 0;
        a.options_.playlistStarted = 0;
        a.options_.playerStarted = 0;
        c.hasError = !1;
        c.mobileStart = 0;
        c.forceTimeout = !1;
        c.timeoutEvent = !1;
        c.operaHack = 0;
        c.IS_OPERA_LINUX = vjs.IS_OPERA ? !0 : !1;
        "undefined" != typeof a.noTech && 1 == a.noTech || a.cReady(function() {
            a.trigger({
                type: "Rprogress",
                data: "playlistInit"
            })
        });
        a.on("play",
            c.fixVimeoDuration);
        a.on("durationchange", function() {
            if (1 == a.duration() && vjs.IS_ANDROID && "youtube" === a.techName.toLowerCase() || 0 == a.duration() && "vimeo" === a.techName.toLowerCase()) a.pause(), a.play();
            vjs.IS_OPERA && a.options_.playlistStarted && !c.operaHack && -1 < ["html5", "flash"].indexOf(a.techName.toLowerCase()) && (a.pause(), a.play(), 0 < a.currentTime() && (c.operaHack = 1))
        });
        a.on("ended", function() {
            c.onEnded.apply(this)
        });
        a.on("error", function() {
            "html5" == a.techName.toLowerCase() && clearTimeout(c.forceTimeout);
            c.onError.apply(this)
        });
        a.on(["play", "timeupdate"], function(b) {
            if ("html5" != a.techName.toLowerCase() || a.options_.playerStarted || "timeupdate" != b.type) clearTimeout(c.forceTimeout), c.onPlay()
        });
        a.on("nextvideo", function() {
            c.forceTimeout = setTimeout(function() {
                a.paused() && a.options_.playlistStarted && ("undefined" == typeof a.promptPause || 0 == a.promptPause) && (DEBUG && console.log("Forced to start after 5s"), a.play())
            }, 5E3);
            c.setupPlayer()
        });
        a.on("RsetVideoInfo", function(b) {
            b = b.data;
            if ((b.response.live || "live" ==
                    b.response.mode || b.response.liveStreamingDetails) && b._id == a.cache_.src) {
                if ("youtube" == b.provider) {
                    if (!a.isReady_) {
                        a.ready(function() {
                            a.duration() || a.trigger("RisLive")
                        });
                        return
                    }
                    if (a.duration()) return;
                    b.response.liveStreamingDetails || (a.startScreen.hasLoadedPoster && a.startScreen.posterReady ? (clearInterval(a.startScreen.posterInterval), a.poster(b.poster), a.startScreen.posterImage.size = [480, 640], a.startScreen.posterImage.fixDimensions(a)) : (clearInterval(a.startScreen.posterInterval), vjs.bufferBlacklist.push(vjs.static_.youtube_poster(b.videoId)),
                        a.startScreen.setPoster.apply(a, [b.poster])))
                }
                a.trigger("RisLive")
            }
        });
        a.on("RsetVideoInfo", function(b) {
            if (a.isAd || b.data._id !== a.cache_.src) return !1;
            b = b.data;
            "youtube" == b.provider && (b = b.restrictions, b.geo ? a.trigger({
                type: "Rerror",
                data: "yt_region"
            }) : b.embeddable ? b["private"] && a.trigger({
                type: "Rerror",
                data: "yt100"
            }) : a.trigger({
                type: "Rerror",
                data: "yt150"
            }))
        });
        a.on(["RlinearLoaded", "RvideoLoaded"], function() {
            if ("flash" == a.techName.toLowerCase()) a.one("play", function() {
                a.trigger("seeked")
            })
        });
        a.on("RrequestNextVideo",
            function() {
                c.resetTimeIndicators();
                c.playNextVideo()
            });
        a.on("RloadNextVideo", function() {
            a.promptPause = 0
        });
        a.on("RnextVideo", function() {
            c.resetTimeIndicators();
            c.playNextVideo()
        });
        a.on("RplayEnabled", function() {
            c.resetTimeIndicators();
            a.startScreen.playButton.hide();
            a.isReady_ ? c.playNextVideo() : a.ready(function() {
                setTimeout(function() {
                    c.playNextVideo()
                }, 0)
            })
        });
        a.on("Rreplay", function() {
            c.playOriginalVideo()
        });
        a.one("RstartRequested", function() {
            a.blockPlay || a.trigger("RplayEnabled")
        });
        a.on("RcantPlayNext",
            function() {
                ++c.positionInQ;
                "undefined" !== typeof c.videoQ[c.positionInQ] ? a.trigger({
                    type: "Rerror",
                    data: "playlist_error"
                }) : a.trigger({
                    type: "Rerror"
                });
                c.timeoutEvent = setTimeout(function() {
                    c.playNextVideo()
                }, 1E3)
            });
        a.on("RvideoLoaded", function() {
            a.on("timeupdate", c.fixDuration);
            c.resetTimeIndicators()
        });
        a.one("RinitialVideoError", function() {
            "undefined" == typeof c.videoQ[c.positionInQ + 1] || c.videoQ[c.positionInQ + 1][0].ad ? "youtube" === a.techName.toLowerCase() ? a.trigger({
                    type: "Rerror",
                    data: "yt100"
                }) : a.trigger("Rerror") :
                a.options_.autoplay ? (a.trigger({
                    type: "Rerror",
                    data: "playlist_error"
                }), ++c.positionInQ, setTimeout(function() {
                    c.playNextVideo()
                }, 2E3)) : a.trigger({
                    type: "Rerror",
                    data: "playlist_error_prompt_click"
                })
        });
        c.fixedLive = 0;
        a.one("RisLive", function() {
            a.on("timeupdate", c.fixLiveIndicator);
            a.on("RvideoLoaded", function() {
                a.on("timeupdate", c.fixLiveIndicator)
            });
            a.on("RlinearLoaded", function() {
                a.off("timeupdate", c.fixLiveIndicator)
            })
        });
        c.triggerReady();
        c.ready(function() {})
    }
});
vjs.Playlist.prototype.fixVimeoDuration = function() {
    var a = this.player_,
        b = a.Playlist;
    "vimeo" == a.techName.toLowerCase() && 0 == a.duration() && (a.off("play", b.fixVimeoDuration), a.pause(), a.play())
};
vjs.Playlist.prototype.fixDuration = function() {
    var a = this.player_,
        b = a.Playlist;
    "youtube" == a.techName.toLowerCase() && 100 == a.duration() && vjs.IS_NATIVE_ANDROID ? 0 < a.currentTime() && (a.off("timeupdate", b.fixDuration), a.pause().play()) : a.off("timeupdate", b.fixDuration)
};
vjs.Playlist.prototype.removeIndex = function(a) {
    var b = this.player_.Playlist;
    if ("undefined" == typeof a || null == a || b.mainVideoPos == a || 0 > a || a >= b.videoQ.length) return !1;
    b.mainVideoPos > a && --b.mainVideoPos;
    for (a += 1; a < b.videoQ.length; ++a) b.videoQ[a - 1] = b.videoQ[a];
    b.videoQ = b.videoQ.splice(0, b.videoQ.length - 1);
    return b.videoQ.length
};
vjs.Playlist.prototype.insertBeginning = function(a) {
    var b = this.player_.Playlist;
    a = b.createSrcArray(a);
    if (!1 === a) return !1;
    "undefined" == typeof a[0].ad && (a[0].ad = 0);
    b.videoQ.unshift(a);
    b.mainVideoPos++;
    return b.videoQ.length
};
vjs.Playlist.prototype.insertBefore = function(a, b) {
    var c = this.player_.Playlist;
    b = c.createSrcArray(b);
    if (!1 === b || "undefined" === typeof a || 0 > a || null === a || "number" !== typeof a || a > c.videoQ.length) return !1;
    a <= c.mainVideoPos && ++c.mainVideoPos;
    "undefined" == typeof b[0].ad && (b[0].ad = 0);
    c.videoQ.splice(a, 0, b);
    return c.videoQ.length
};
vjs.Playlist.prototype.insertAfter = function(a, b) {
    var c = this.player_.Playlist;
    b = c.createSrcArray(b);
    return "undefined" == typeof a || null == a ? !1 : c.insertBefore(a + 1, b)
};
vjs.Playlist.prototype.insertBeforeMain = function(a) {
    var b = this.player_.Playlist;
    a = b.createSrcArray(a);
    return b.insertBefore(b.mainVideoPos, a)
};
vjs.Playlist.prototype.insertEnd = function(a) {
    var b = this.player_.Playlist;
    a = b.createSrcArray(a);
    if (!1 === a) return !1;
    "undefined" == typeof a[0].ad && (a[0].ad = 0);
    b.videoQ.push(a);
    return b.videoQ.length
};
vjs.Playlist.prototype.emptyQueue = function() {
    var a = this.player_.Playlist;
    a.videoQ = [];
    a.positionInQ = 0;
    a.mainVideoPos = !1
};
vjs.Playlist.prototype.createSrcArray = function(a) {
    var b = !1;
    a = JSON.parse(JSON.stringify(a));
    if ("object" != typeof a) return !1;
    a && a.src && a.type ? b = [a] : a && 0 < a.length && a[0].src && a[0].type && (b = a);
    return b
};
vjs.Playlist.prototype.playOriginalVideo = function() {
    var a = this.player_,
        b = a.Playlist;
    b.emptyQueue();
    b.videoQ = [b.initialVideo];
    b.mainVideoPos = 0;
    b.playNextVideo();
    "youtube" == a.techName.toLowerCase() && a.play()
};
vjs.Playlist.prototype.theEnd = function() {
    var a = this.player_,
        b = a.Playlist;
    a.options_.playlistStarted = 0;
    a.pause();
    a.addClass("vjs-playlist-end");
    a.options_.reEmbed.vidpulseSiteId || a.controls(!1);
    a.trigger("RadEnd");
    b.emptyQueue();
    a.trigger("playlistEnd");
    return !0
};
vjs.Playlist.prototype.setupPlayer = function() {
    var a = this.player_,
        b = a.Playlist,
        c = b.videoQ[b.positionInQ - 1],
        b = b.videoQ[b.positionInQ],
        d;
    c[0].ad ? (a.isAd = 1, a.controls(!1), /html5/i.test(a.techName.toLowerCase()) && a.tech.setControls(!1), d = "postroll", "undefined" === typeof b || b[0].ad || (d = "preroll"), a.trigger({
        type: "RlinearLoaded",
        data: {
            id: c[0].adId,
            skip: a.Vast.ads[c[0].adId].creatives[0].skip,
            type: d
        }
    })) : (a.isAd = 0, a.defaultControls() || "dailymotion" === a.techName.toLowerCase() && (vjs.IS_ANDROID || vjs.IS_IOS) ? a.defaultControls() &&
        /html5|flash/i.test(a.techName.toLowerCase()) && vjs.IS_ANDROID && a.tech.setControls(!0) : (a.controls(!0), /html5/i.test(a.techName.toLowerCase()) && a.tech.setControls(!1)), a.trigger("RadEnd"), a.trigger("RvideoLoaded"));
    a.setPosition();
    return !0
};
vjs.Playlist.prototype.playNextVideo = function() {
    var a = this.player_,
        b = a.Playlist;
    clearTimeout(b.timeoutEvent);
    if (a.blockPlay) return !1;
    if ("undefined" == typeof b.videoQ[b.positionInQ]) return b.theEnd(), a.trigger("RplaylistEnd"), !1;
    a.trigger("RloadNextVideo");
    var c = b.videoQ[b.positionInQ];
    a.one("loadedmetadata", function() {
        a.play()
    });
    if (vjs.IS_FIREFOX && vjs.IS_WINDOWS) a.one("loadstart", function() {
        a.play()
    });
    var d = a.selectSource(c);
    if (d) return a.options_.playlistStarted = 1, d.source.src != a.cache_.src ? (a.options_.autoplay =
        1, a.src(c)) : (vjs.IS_FIREFOX && "dailymotion" === a.techName.toLowerCase() && a.replay && (a.tech.params.autoplay = 1, a.tech.loadDailymotion()), a.mobileStart && !a.replay || a.play(), "vimeo" !== a.techName.toLowerCase() && setTimeout(function() {
        a.currentTime(0)
    }, vjs.IS_IPHONE ? 500 : 0), setTimeout(function() {
        vjs.IS_IPHONE && a.replay && a.play()
    }, 2E3)), a.load(!0), b.positionInQ++, a.trigger("nextvideo"), !0;
    c[0].ad ? (b.positionInQ++, b.playNextVideo()) : a.trigger("RcantPlayNext");
    return !1
};
vjs.Playlist.prototype.onPlay = function() {
    var a = this.player_,
        b = a.Playlist;
    b.promptPause = 0;
    a.options_.playerStarted = 1;
    a.removeClass("vjs-playlist-end");
    vjs.IS_IPHONE && a.toggleIframeFullscreen(!1, !0);
    b.hasError = !1;
    vjs.IS_IPAD && "html5" == a.techName.toLowerCase() && (a.tech.setControls(!1), a.removeClass("vjs-using-native-controls"));
    vjs.IS_MOBILE && !a.mobileStart ? (a.mobileStart = 1, a.options_.playlistStarted = 1, a.setPosition(), a.trigger("RstartRequested")) : vjs.IS_MOBILE || a.options_.playlistStarted || (a.firstClick = !0, a.trigger("RdisableLinears"), a.trigger("RstartRequested"))
};
vjs.Playlist.prototype.onEnded = function() {
    var a = this.player_,
        b = a.Playlist;
    if (vjs.IS_IPHONE && 0 > a.remainingTime() && "Youtube" == a.techName) return !1;
    a.exitFullscreen();
    setTimeout(function() {
        b.playNextVideo()
    }, 0)
};
vjs.Playlist.prototype.onError = function(a) {
    var b = this.player_,
        c = b.Playlist;
    c.hasError = !0;
    if ("undefined" == typeof c.videoQ[c.positionInQ])
        if (c.videoQ.length && c.videoQ[c.positionInQ - 1][0].ad) DEBUG && console.log("is ad"), b.trigger("Rrem903"), b.trigger("RadError");
        else return DEBUG && console.log("is not ad"), "Youtube" == b.techName ? 150 == b.tech.errorCode ? (a = c.videoQ[c.positionInQ - 1][0], b.Data.getInfo(a.type, a.src, function(a) {
            var c = "yt" + b.tech.errorCode;
            a.response.liveStreamingDetails && a.response.liveStreamingDetails.scheduledStartTime &&
                (c = new Date, a = ((new Date(a.response.liveStreamingDetails.scheduledStartTime)).getTime() - c.getTime()) / 1E3, c = "custom_The live event will start " + (60 > a ? "in less than a minute" : 60 <= a && 3600 > a ? "in " + Math.floor(a / 60) + " minute(s)" : 3600 <= a && 86400 > a ? "in " + Math.floor(a / 3600) + " hour(s)" : "in " + Math.floor(a / 86400) + " day(s)") + ".");
            b.trigger({
                type: "Rerror",
                data: c
            })
        }, function(a) {
            b.trigger({
                type: "Rerror",
                data: "yt" + b.tech.errorCode
            })
        })) : b.trigger({
            type: "Rerror",
            data: "yt" + b.tech.errorCode
        }) : b.noTech ? b.trigger({
            type: "Rerror",
            data: "noTech"
        }) : b.trigger({
            type: "Rerror"
        }), 1 < c.positionInQ && !c.videoQ[c.positionInQ - 2][0].ad && setTimeout(function() {
            c.playNextVideo()
        }, 2E3), "undefined" != typeof c.emptyQueue && c.emptyQueue(), !1;
    else {
        if (!c.videoQ[c.positionInQ][0].ad && !c.videoQ[Math.max(c.positionInQ - 1, 0)][0].ad) return 1 >= c.videoQ.length ? b.trigger({
            type: "Rerror"
        }) : (b.trigger({
            type: "Rerror",
            data: "playlist_error"
        }), c.timeoutEvent = setTimeout(function() {
            c.playNextVideo()
        }, 1E3)), !1;
        0 <= c.positionInQ - 1 && c.videoQ[c.positionInQ - 1][0].ad && b.trigger("Rrem901")
    }
    c.playNextVideo()
};
vjs.Playlist.prototype.resetTimeIndicators = function() {
    var a = this.player_,
        b = a.Playlist;
    a.controlBar.currentTimeDisplay.contentEl_.innerHTML = "0:00";
    a.controlBar.durationDisplay.contentEl_.innerHTML = "0:00";
    a.controlBar.progressControl.seekBar.seekHandle.el_.style.left = "0%";
    a.controlBar.progressControl.seekBar.playProgressBar.el_.style.width = "0%";
    a.controlBar.progressControl.seekBar.loadProgressBar.el_.style.width = "0%";
    b.operaHack = 0
};
vjs.Playlist.prototype.fixLiveIndicator = function() {
    var a = this.player_,
        b = a.Playlist;
    if (a.isAd || b.fixedLive || 0 == a.duration()) return !1;
    b.fixedLive = 1;
    a.trigger("play");
    a.addClass("vjs-live-focused")
};
vjs.Quality = vjs.SelectBar.extend({
    init: function(a, b) {
        var c = this;
        c.className = "vjs-quality";
        c.pluginName = "Quality";
        vjs.SelectBar.call(c, a, b);
        c.hide();
        c.loaded = 0;
        c.quality = {
            none: "Loading",
            tiny: "144p",
            small: "240p",
            medium: "360p",
            large: "480p",
            hd720: "720p",
            hd1080: "1080p",
            hd1440: "1440p",
            hd2160: "4K",
            highres: "FullHD"
        };
        c.currentQuality = "default";
        c.enabled = 0;
        if (vjs.arrayContains(vjs.availableQuality, a.techName))
            if (vjs.IS_ANDROID || vjs.IS_IE11_PHONE) {
                if (c.enabled = 0, vjs.IS_ANDROID) a.one("play", function() {
                    vjs.arrayContains(a.tech.ytplayer.getAvailableQualityLevels(),
                        "medium") ? (a.tech.ytplayer.setPlaybackQuality("medium"), c.currentQuality = "medium") : a.tech.ytplayer.setPlaybackQuality("default")
                })
            } else c.show(), c.enabled = 1;
        c.enabled && c.setMouseListeners();
        a.on("play", function() {
            if ("youtube" !== a.techName.toLowerCase() || c.loaded || a.isAd) return !1;
            a.isLive ? (a.one("play", function() {
                a.tech.duration() && a.currentTime(a.tech.duration())
            }), a.on("timeupdate", c.loadQualityLevels)) : c.findValidOptions(a.tech.ytplayer.getAvailableQualityLevels())
        });
        a.on("RqualityChange", function(b) {
            a.options_.playlistStarted &&
                0 < Math.floor(a.duration()) - Math.ceil(a.currentTime()) && c.setActive(b.data)
        });
        a.on("RnonLinearCleared", function() {
            "youtube" === a.techName.toLowerCase() && !vjs.IS_IPAD && a.options_.playlistStarted && a.tech.ytplayer.setPlaybackQuality(c.currentQuality)
        });
        a.on("RnonLinearStarted", function() {
            "Youtube" == a.techName && a.tech.ytplayer.setPlaybackQuality(a.tech.ytplayer.getPlaybackQuality())
        })
    }
});
vjs.Quality.prototype.loadQualityLevels = function() {
    var a = this.player_,
        b = a.controlBar.Toolkit.Quality,
        c = a.tech.ytplayer.getAvailableQualityLevels();
    0 < c.length && (a.off("timeupdate", b.loadQualityLevels), b.findValidOptions(c))
};
vjs.Quality.prototype.selectAction = function(a) {
    var b = this.player_,
        c = b.controlBar.Toolkit.Quality;
    if ("undefined" == typeof c.quality[a.target.className.split(" active")[0]]) return !1;
    c.hideOptions();
    c.currentQuality = a.target.className;
    b.tech.ytplayer.setPlaybackQuality(a.target.className);
    b.trigger("RqualityRequested")
};
vjs.Quality.prototype.findValidOptions = function(a) {
    var b = this.player_,
        c = b.controlBar.Toolkit.Quality,
        d, e = [];
    for (d = 0; d < a.length; ++d) "auto" != a[d] && "undefined" != typeof c.quality[a[d]] && e.push({
        value: a[d],
        name: c.quality[a[d]]
    });
    c.setOptions(e);
    c.setActive(b.tech.ytplayer.getPlaybackQuality());
    a.length && (c.loaded = 1)
};
vjs.Quality.prototype.optionSetCallback = function(a) {
    var b = this.player_,
        c = b.controlBar.Toolkit.Quality;
    1 < b.currentTime() && b.currentTime(b.currentTime());
    c.currentEl[vjs.text] = c.quality[a]
};
vjs.Rate = vjs.SelectBar.extend({
    init: function(a, b) {
        var c = this;
        c.className = "vjs-rate";
        c.pluginName = "Speed";
        vjs.SelectBar.call(c, a, b);
        c.hide();
        c.loaded = 0;
        c.rates = {
            none: "Loading",
            "0.25": "0.25x",
            "0.5": "0.5x",
            1: "Normal",
            "1.25": "1.25x",
            "1.5": "1.5x",
            2: "2x"
        };
        c.currentRate = "default";
        c.enabled = 0;
        vjs.arrayContains(vjs.availableRate, a.techName) && !vjs.IS_MOBILE && (c.show(), c.enabled = 1);
        c.enabled && c.setMouseListeners();
        a.on("play", function() {
            if ("youtube" !== a.techName.toLowerCase() || c.loaded) return !1;
            c.findValidOptions(a.tech.ytplayer.getAvailablePlaybackRates())
        });
        a.on("RrateChange", function(b) {
            a.options_.playlistStarted && c.setActive(String(b.data))
        })
    }
});
vjs.Rate.prototype.selectAction = function(a) {
    var b = this.player_,
        c = b.controlBar.Toolkit.Rate;
    if ("undefined" == typeof c.rates[a.target.className.split(" active")[0]]) return !1;
    c.hideOptions();
    c.currentRate = a.target.className;
    b.tech.ytplayer.setPlaybackRate(a.target.className);
    b.trigger("RrateRequested")
};
vjs.Rate.prototype.findValidOptions = function(a) {
    var b = this.player_,
        c = b.controlBar.Toolkit.Rate,
        d, e = [];
    for (d = 0; d < a.length; ++d) "auto" != a[d] && "undefined" != typeof c.rates[a[d]] && e.push({
        value: a[d],
        name: c.rates[a[d]]
    });
    c.setOptions(e);
    c.setActive(String(b.tech.ytplayer.getPlaybackRate()));
    c.loaded = 1
};
vjs.Rate.prototype.optionSetCallback = function(a) {
    var b = this.player_.controlBar.Toolkit.Rate;
    b.currentEl[vjs.text] = b.rates[a]
};
vjs.options.children.Share = {};
vjs.Share = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        c.hide();
        c.off("click");
        c.off("touchstart");
        c.off("touchend");
        c.off("touchcancel");
        c.on(vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click", c.onClick);
        var d = a.options_.reEmbed.skin || 1,
            e = 315 + parseInt(a.options_.reEmbed.pady, 10) + parseInt(vjs.static_.controlBarSize["skin" + d].height, 10);
        c.textVisible = !1;
        c.blockTimeout = !1;
        vjs.insideIframe() && "iframe.reembed.com" == window.location.hostname ? c.rurl = encodeURIComponent(document.referrer) :
            c.rurl = encodeURIComponent(window.location.href);
        c.twitterUrl = c.rurl;
        c.plid = a.options_.reEmbed.pings.plid;
        c.mouseover = !1;
        c.on("mouseout", function(a) {
            if (/Tablet PC/.test(vjs.USER_AGENT) && /ARM;/.test(vjs.USER_AGENT) && /Trident/.test(vjs.USER_AGENT)) return c.mouseover = !1;
            /MSIE 8/.test(vjs.USER_AGENT);
            vjs.isDescendant(c.el_, a.relatedTarget) || "undefined" == typeof a.relatedTarget || (c.mouseover = !1, c.toggleText())
        });
        a.on("mouseout", function(b) {
            if (/Tablet PC/.test(vjs.USER_AGENT) && /ARM;/.test(vjs.USER_AGENT) &&
                /Trident/.test(vjs.USER_AGENT) || a.isAd) return !1;
            vjs.isDescendant(a.el_, b.relatedTarget) || "undefined" == typeof b.relatedTarget || (c.hide(), a.trigger("RresetVideoOverlay"))
        });
        c.on("mousemove", function() {
            c.blockTimeout || (c.mouseover = !0, c.setInterval())
        });
        a.on("Rresize", c.setPosition);
        a.on("RinlineShare", function() {
            c.setPosition();
            c.show()
        });
        a.on("RvideoOverlayActive", function() {
            c.blockTimeout || c.setInterval()
        });
        a.on("RplaylistEnd", function() {
            c.blockTimeout = !0;
            clearTimeout(c.timeout)
        });
        a.on("play", function() {
            c.blockTimeout = !1
        });
        a.on("RvideoLoaded", function(b) {
            b = a.videoId();
            var d = a.provider(),
                d = a.options_.reEmbed.shareId || vjs.MD5b64([b, d, vjs.getPageUrl(), c.plid.split("_")[1]].join(""));
            b = vjs.getPageUrl();
            d = a.options_.reEmbed.customDomain ? [a.options_.reEmbed.customDomain, "/embed/", location.hostname, "/", d].join("") : [vjs.static_.embedServer, "/", location.hostname, "/", d].join("");
            c.shareUrl = b;
            c.script = '<iframe src="' + d + '" allowfullscreen frameborder="0" width="560" height="' + e + '"></iframe>'
        })
    }
});
vjs.Share.prototype.twitterPopup = function() {
    var a = this.player_.Share,
        b = this.player_,
        c = vjs.getPageTitle(),
        c = encodeURIComponent(c.replace(/^(.{100}[^\s]*).*/, "$1")).replace(".", ".%E2%80%8B");
    b.options_.reEmbed.shareId && (c = "");
    a = vjs.static_.share.twitter + c + " " + encodeURIComponent(a.shareUrl);
    window.open(a, "_blank")
};
vjs.Share.prototype.generatePopup = function(a) {
    var b = this.player_.Share;
    if ("twitter" == a) b.twitterPopup();
    else {
        var c = "window.open(";
        switch (a) {
            case "facebook":
                c += "'" + vjs.static_.share.facebook + "'+ '" + encodeURIComponent(b.shareUrl) + "'";
                /MSIE 8|MSIE 9/.test(vjs.USER_AGENT) || (c += ", 'facebook-share-dialog', 'width=626,height=436'");
                break;
            case "googleplus":
                c += "'" + vjs.static_.share.googleplus + "'+ '" + encodeURIComponent(b.shareUrl) + "'", /MSIE 8|MSIE 9/.test(vjs.USER_AGENT) || (c += ", 'googleplus-share-dialog', 'width=626,height=436'")
        }
        return c +
            ");"
    }
};
vjs.Share.prototype.createEl = function() {
    var a = vjs.createEl("div", {
            className: "vjs-share vjs-share-no-embedding"
        }),
        b = vjs.createEl("ul", {}),
        c = [];
    c.push(vjs.createEl("li", {
        className: "vjs-share-fb",
        title: "Share on Facebook"
    }));
    c.push(vjs.createEl("li", {
        className: "vjs-share-twitter",
        title: "Share on Twitter"
    }));
    c.push(vjs.createEl("li", {
        className: "vjs-share-gplus",
        title: "Share on Google+"
    }));
    c.push(vjs.createEl("li", {
        className: "vjs-share-link",
        title: "Link to video"
    }));
    for (var d = vjs.createEl("span", {
            className: "vjs-share-text-view",
            innerHTML: '<input class="vjs-share-text-code" type="text" value="" readonly/>'
        }), e = 0; e < c.length; ++e) b.appendChild(c[e]);
    a.appendChild(b);
    a.appendChild(d);
    this.optionsList = b;
    this.embedMsg = d;
    return a
};
vjs.Share.prototype.onClick = function(a) {
    var b = this.player_.Share;
    b.blockTimeout || b.setInterval();
    /vjs-share-fb/i.test(a.target.className) ? (eval(b.generatePopup("facebook")), b.trigger({
            type: "RshareSocial",
            data: "facebook"
        })) : /vjs-share-twitter/i.test(a.target.className) ? (eval(b.generatePopup("twitter")), b.trigger({
            type: "RshareSocial",
            data: "twitter"
        })) : /vjs-share-gplus/i.test(a.target.className) ? (eval(b.generatePopup("googleplus")), b.trigger({
            type: "RshareSocial",
            data: "google"
        })) : /vjs-share-link/i.test(a.target.className) ?
        (b.toggleText(b.shareUrl), b.trigger({
            type: "RshareSocial",
            data: "link"
        })) : /vjs-share-text-code/i.test(a.target.className) && b.embedMsg.childNodes[0].select();
    a.preventDefault()
};
vjs.Share.prototype.toggleText = function(a) {
    var b = this.player_.Share;
    a && (!b.textVisible || a && a != b.embedMsg.childNodes[0].value) ? (b.embedMsg.childNodes[0].value = a, b.addClass("vjs-share-text-visible"), b.textVisible = !0) : (b.removeClass("vjs-share-text-visible"), b.textVisible = !1)
};
vjs.Share.prototype.setInterval = function() {
    var a = this.player_,
        b = a.Share;
    "undefined" != typeof b.timeout && clearTimeout(b.timeout);
    if ("vimeo" == a.techName.toLowerCase() || a.isAd) return !1;
    a.trigger("RinlineShare");
    b.timeout = setTimeout(function() {
        b.mouseover ? b.setInterval() : vjs.hasClass(a.el_, "vjs-playlist-end") || b.hide()
    }, 2E3)
};
vjs.Share.prototype.setPosition = function() {
    var a = this.player_,
        b = a.Share,
        c = a.size()[0] / vjs.static_.wizard_width,
        d = a.isFullscreen() ? 0 : a.options_.reEmbed.pady;
    b.el_.style.top = d * (1 > c ? c : 1) + "px";
    a.options_.reEmbed.logo && "right" == a.options_.reEmbed.logo.align && (b.el_.style.left = "0", b.el_.style.right = "auto")
};
vjs.options.children.startScreen = {};
vjs.StartScreen = vjs.CoreObject.extend({
    init: function(a, b) {
        var c = this;
        c.posterImage = a.addChild("posterImage", {});
        c.playButton = c.posterImage.addChild("miniPlayButton", {});
        c.waterMark = c.posterImage.addChild("waterMark", {});
        c.player_ = a;
        c.options_ = b;
        c.hasLoadedPoster = !1;
        c.posterReady = !1;
        var d = ["8938", "8032", "8944", "9707", "9386"],
            e = ["13620"];
        a.cReady(function() {
            if (!a.sourceTech) return !1;
            var b = a.options_.reEmbed.pings.plid.split("_")[0]; -
            1 < d.indexOf(b) && (c.posterImage.el_.style.backgroundSize = "100%"); - 1 < e.indexOf(b) && (c.posterImage.el_.style.display = "none");
            a.Data.getPoster(a.sourceTech.type, a.sourceTech.src, function(a) {
                c.setStartScreen(a)
            });
            a.Data.getInfo(a.sourceTech.type, a.sourceTech.src, function(b) {
                a.trigger({
                    type: "RsetVideoInfo",
                    data: b
                })
            }, function(b) {
                if (b && -1 < ["video/youtube", "video/dailymotion"].indexOf(a.sourceTech.type)) return a.trigger("Rrem801"), !1;
                a.options_.playerStarted && !a.landing.blockingError || a.trigger("RinitialVideoError")
            })
        });
        a.ready(function() {
            "youtube" == a.techName.toLowerCase() && 0 == a.options_.hasAds && (c.posterImage.el_.style.pointerEvents = "none")
        });
        a.on("Rprogress", function(b) {
            "playlistInit" == b.data ? a.trigger("RsetStartScreen") : "setPoster" == b.data && (!a.isReady_ && vjs.IS_MOBILE ? a.ready(vjs.bind(c, c.show)) : c.show())
        });
        a.on("RstartScreenVisible", function() {
            clearTimeout(c.spinnerTimeout);
            a.trigger("RhideOverlaySpinner")
        });
        if ("Html5" === a.techName) {
            var f = "nextvideo";
            vjs.IS_IOS && (f = "canplay");
            if (vjs.IS_MOBILE) a.one("nextvideo",
                function() {
                    a.trigger("RshowOverlaySpinner")
                });
            a.one(f, function() {
                c.hide()
            })
        } else if (vjs.IS_MOBILE) {
            f = "playing";
            if ("vimeo" == a.techName.toLowerCase()) {
                if (vjs.IS_NATIVE_ANDROID || vjs.IS_IOS) setTimeout(function() {
                    c.hide()
                }, 0), a.fixDimensions();
                f = "play"
            }
            a.one(f, function() {
                c.hide()
            })
        } else a.on("timeupdate", c.clearOnTimeUpdate)
    }
});
vjs.StartScreen.prototype.show = function() {
    var a = this.player_,
        b = a.startScreen;
    !vjs.IS_MOBILE && "undefined" != typeof a.options_.autoplay && a.options_.autoplay || a.firstClick || (b.playButton.show(), b.waterMark.show());
    a.trigger("RstartScreenVisible")
};
vjs.StartScreen.prototype.hide = function() {
    var a = this.player_.startScreen;
    a.playButton.hide();
    a.posterImage.hide();
    a.waterMark.clearProtection();
    a.waterMark.hide()
};
vjs.StartScreen.prototype.clearOnTimeUpdate = function() {
    var a = this.player_,
        b = a.startScreen;
    if (a.unWrapped) return a.unWrapped = !1;
    a.off("timeupdate", b.clearOnTimeUpdate);
    b.hide();
    vjs.arrayContains(vjs.defaultSpinners, a.techName) && a.trigger("RhideLoadingSpinner")
};
vjs.StartScreen.prototype.setStartScreen = function(a) {
    var b = this.player_,
        c = b.startScreen;
    b.trigger({
        type: "Rprogress",
        data: "setStartScreen"
    });
    c.hasLoadedPoster || (c.setPoster(a), b.setPosition())
};
vjs.StartScreen.prototype.posterError = function() {
    var a = this.player_,
        b = a.startScreen;
    a.options_.playlistStarted || b.posterImage.hidden || b.posterImage.show();
    b.posterImage.size = [0, 0];
    b.posterImage.el_.style.backgroundColor = "#000";
    a.trigger({
        type: "Rprogress",
        data: "setPoster"
    })
};
vjs.StartScreen.prototype.setPoster = function(a) {
    var b = this.player_,
        c = b.startScreen;
    if (c.hasLoadedPoster) return !1;
    "undefined" != typeof a && "" != a ? ("html5" !== b.provider() && (a = a.replace(/^https?:/, ""), a = vjs._protocol + a), vjs.IS_MOBILE && b.trigger({
        type: "Rprogress",
        data: "setPoster"
    }), vjs.buffer("img", a, function(d) {
        if (c.hasLoadedPoster) return !1;
        c.hasLoadedPoster = !0;
        b.cReady(function() {
            if (!d) return c.posterError();
            b.trigger({
                type: "Rprogress",
                data: "setPoster"
            });
            b.poster(a);
            c.posterImage.size = d;
            c.posterImage.fixDimensions(b);
            c.posterReady = !0;
            "youtube" != b.techName.toLowerCase() || vjs.IS_MOBILE || c.tryHDPoster()
        })
    })) : setTimeout(c.posterError.bind(c), 0)
};
vjs.StartScreen.prototype.tryHDPoster = function() {
    var a = this.player_,
        b = a.startScreen;
    a.Data.getInfo(a.sourceTech.type, a.sourceTech.src, function(c) {
        var d = c.response,
            e = a.size(),
            f = 480,
            g = e[0],
            k, h;
        if ("youtube" == c.provider) {
            for (k in d.thumbnails) c = Math.abs(k - 1.1 * e[0]), c < g ? (f = +k, g = c) : +k > f && (f = k, g = c);
            h = d.thumbnails[f];
            vjs.buffer("img", h, function(c) {
                a.poster(h);
                b.posterImage.size = c;
                b.posterImage.fixDimensions(a)
            })
        }
    })
};
vjs.options.children.TimeLimit = {};
vjs.TimeLimit = vjs.Component.extend({
    init: function(a, b) {
        var c = this;
        c.player_ = a;
        c.initialVideo = a.options_.sources;
        c.options_ = b;
        c.start = a.options_.start ? a.options_.start : 0;
        c.end = a.options_.end ? a.options_.end : 0;
        c.lastSec = -1;
        a.on("RvideoLoaded", function() {
            a.on("timeupdate", c.checkIndicators)
        });
        a.on("RlinearLoaded", function() {
            a.off("timeupdate", c.checkIndicators)
        });
        a.on("Rreplay", function() {
            c.removeIndicators()
        });
        a.on("nextvideo", function() {
            if (a.isAd) return !1;
            a.on("durationchange", c.setLimitIndicators);
            a.one("play", function() {
                c.start && a.duration() > c.start && (a.currentTime(c.start), c.start = 0)
            })
        })
    }
});
vjs.TimeLimit.prototype.setLimitIndicators = function() {
    var a = this.player_,
        b = a.TimeLimit;
    a.duration() && (a.off("durationchange", b.setLimitIndicators), b.end && b.end < a.duration() && b.addLimitIcon(b.end, 1), a.duration() > b.start && b.addLimitIcon(b.start))
};
vjs.TimeLimit.prototype.addLimitIcon = function(a, b) {
    var c = this.player_,
        d = c.duration();
    if (!a || !d) return !1;
    var e = vjs.createEl("div", {
        className: "vjs-timelimit-indicator " + (b ? "vjs-end-indicator" : "")
    });
    e.style.left = 100 * a / Math.floor(d) + "%";
    c.controlBar.progressControl.el_.childNodes[0].appendChild(e)
};
vjs.TimeLimit.prototype.removeIndicators = function(a) {
    var b = this.player_,
        c;
    a && a.length ? (-1 < a.indexOf("start") && (c = b.el_.querySelectorAll(".vjs-timelimit-indicator:not(.vjs-end-indicator)")), -1 < a.indexOf("end") && (c = vjs.getByClassName(b.el_, "vjs-end-indicator"))) : c = vjs.getByClassName(b.el_, "vjs-timelimit-indicator");
    if (c)
        for (a = 0; a < c.length; ++a) c[a].parentNode.removeChild(c[a])
};
vjs.TimeLimit.prototype.checkIndicators = function() {
    var a = this.player_,
        b = a.TimeLimit;
    if (a.isAd) return !1;
    a.currentTime() >= b.end && 1 < Math.floor(a.currentTime()) - b.lastSec && -1 < b.lastSec && (b.end = 0, b.removeIndicators(["end"]));
    b.end && a.currentTime() >= b.end && (b.end = 0, a.trigger("ended"));
    b.lastSec != Math.floor(a.currentTime()) && (b.lastSec = Math.floor(a.currentTime()))
};
vjs.ControlBar.prototype.options_.children.Toolkit = {};
vjs.Toolkit = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        c.Quality = c.addChild("Quality");
        c.Rate = c.addChild("Rate");
        c.hide();
        c.off("click");
        c.off("touchstart");
        var d = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click";
        c.on(d, c.onClick);
        a.on("mouseout", c.playerMouseOut);
        a.on(d, function(a) {
            c.onMouseActivity(a)
        });
        a.on(["RqualityRequested", "RrateRequested", "RcaptionsChanged"], vjs.bind(c, c.hideToolkit));
        a.on("techchange", function() {
            vjs.arrayContains(vjs.availableQuality,
                a.techName) && !vjs.IS_ANDROID && !vjs.IS_IE11_PHONE || vjs.arrayContains(vjs.availableRate, a.techName) && !vjs.IS_MOBILE ? c.show() : c.hide()
        });
        a.on("RdisabledCaptions", function() {
            c.Quality.enabled || c.hide()
        })
    }
});
vjs.Toolkit.prototype.hideToolkit = function() {
    return this.player_.controlBar.Toolkit.el_.childNodes[0].style.display = "none"
};
vjs.Toolkit.prototype.showToolkit = function() {
    return this.player_.controlBar.Toolkit.el_.childNodes[0].style.display = "block"
};
vjs.Toolkit.prototype.onClick = function(a) {
    var b = this.player_.controlBar.Toolkit,
        c = b.el_.childNodes[0].style.display; - 1 < a.target.className.indexOf("vjs-toolkit") && -1 == a.target.className.indexOf("vjs-toolkit-menu") && ("block" != c ? b.showToolkit() : b.hideToolkit())
};
vjs.Toolkit.prototype.playerMouseOut = function(a) {
    var b = this.player_.controlBar.Toolkit;
    vjs.isDescendant(b.el_, a.relatedTarget) || "undefined" == typeof a.relatedTarget || b.hideToolkit()
};
vjs.Toolkit.prototype.onMouseActivity = function(a) {
    var b = this.player_.controlBar.Toolkit;
    a = vjs.fixEvent(a);
    vjs.isDescendant(b.el_, a.target) || b.hideToolkit()
};
vjs.Toolkit.prototype.createEl = function() {
    var a = vjs.createEl("div", {
        className: "vjs-toolkit vjs-control",
        innerHTML: '<div class="vjs-toolkit-menu"><ul></ul></div>'
    });
    this.contentEl_ = a.childNodes[0].childNodes[0];
    return a
};
vjs.VideoTitle = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
		
        a.one("RsetVideoInfo", function(a) {
            c.el_.childNodes[0][vjs.text] = a.data.title;
        })
    }
});
vjs.VideoTitle.prototype.createEl = function() {
    return vjs.createEl("div", {
        className: "vjs-startscreen-video-title disabled",
        innerHTML: '<span class="vjs-startscreen-title-text"></span>'
    })
};
vjs.options.children.videoOverlay = {};
vjs.VideoOverlay = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        var c = this,
            d = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "mousemove";
        c.on(vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click", c.onClick);
        c.on(d, function() {
            c.eventCallback()
        });
        c.on("dblclick", function() {
            7 == a.options_.reEmbed.skin && -1 > ["youtube", "dailymotion"].indexOf(a.techName.toLowerCase()) && a.controlBar.fullscreenToggle.onClick.apply(a.controlBar.fullscreenToggle)
        });
        if (a.defaultControls()) a.on("techready",
            function() {
                if ("Youtube" == a.techName) a.one("play", function() {
                    c.show();
                    c.el_.style.top = "-40px"
                });
                else c.hide()
            });
        else a.on("fullscreenchange", function() {
            a.isAd || a.isFullscreen() || a.defaultControls() ? a.isAd || !a.isFullscreen() || a.defaultControls() || c.eventCallback() : (a.controls(!0), a.controlBar.el_.style.bottom = "0px")
        });
        a.on(["RshowVideoOverlay", "RvideoLoaded"], function(b) {
            if ("RvideoLoaded" == b.type && "dailymotion" == a.techName.toLowerCase()) a.on("durationchange", c.durationChange);
            else c.show()
        });
        a.on(["RhideVideoOverlay",
            "RlinearLoaded"
        ], function() {
            clearTimeout(c.showTimeout);
            c.hide()
        });
        a.on("RresetVideoOverlay", function() {
            clearTimeout(c.showTimeout);
            a.isAd || c.show()
        });
        c.hide()
    }
});
vjs.VideoOverlay.prototype.durationChange = function() {
    var a = this.player_,
        b = a.videoOverlay;
    0 < a.duration() && (b.show(), a.off("durationchange", b.durationChange))
};
vjs.VideoOverlay.prototype.eventCallback = function() {
    var a = this.player_,
        b = a.videoOverlay; - 1 < ["youtube", "dailymotion", "vimeo"].indexOf(a.techName.toLowerCase()) && b.hide();
    a.defaultControls() || a.controlBar.autoSlide();
    a.trigger("RvideoOverlayActive");
    b.showTimeout = setTimeout(function() {
        b.show()
    }, 2E3)
};
vjs.VideoOverlay.prototype.createEl = function() {
    return vjs.Component.prototype.createEl("div", {
        className: "vjs-video-overlay",
        innerHTML: "<div></div>"
    })
};
vjs.VideoOverlay.prototype.show = function() {
    this.player_.options_.playerStarted && (this.el_.style.display = "block");
    return this
};
vjs.VideoOverlay.prototype.onClick = function(a) {
    var b = this.player_;
    a.preventDefault();
    b.isAd || (b.paused() ? b.play() : (b.trigger("RpauseClick"), b.pause()))
};
videojs.Dailymotion = videojs.MediaTechController.extend({
    init: function(a, b, c) {
        videojs.MediaTechController.call(this, a, b, c);
        this.features.fullscreenResize = !0;
        this.player_ = a;
        this.player_el_ = document.getElementById(this.player_.id());
        this.removeInterval = !1;
        "undefined" != typeof a.Playlist && "undefined" != typeof a.Playlist.videoQ[a.Playlist.positionInQ] && "video/dailymotion" == a.Playlist.videoQ[a.Playlist.positionInQ][0].type ? (this.source = vjs.cloneObject(a.Playlist.videoQ[a.Playlist.positionInQ][0]), this.videoId =
            a.Playlist.videoQ[a.Playlist.positionInQ][0].src) : a.options().sources && "video/dailymotion" == a.options().sources[0].type ? (this.source = vjs.cloneObject(a.options().sources[0]), this.videoId = a.options().sources[0].src) : (this.source = {}, this.videoId = "");
        if ("" != this.videoId && !this.player_.options().ytcontrols) {
            "undefined" == typeof this.player_.poster() && this.player_.poster("");
            var d = this
        }
        this.id_ = this.player_.id() + "_dailymotion_api";
        this.wrapperDiv = this.el_ = videojs.Component.prototype.createEl("div", {
            id: this.id_,
            className: "vjs-tech"
        });
        this.player_el_.insertBefore(this.el_, this.player_el_.firstChild);
        this.params = {
            api: 1,
            chromeless: vjs.IS_IOS || vjs.IS_ANDROID ? 0 : 1,
            background: this.player_.options_.reEmbed.color1.split("#")[1],
            foreground: this.player_.options_.reEmbed.color2.split("#")[1],
            "ui-highlight": this.player_.options_.reEmbed.color3.split("#")[1],
            "ui-start-screen-info": 0,
            "ui-logo": 0,
            "endscreen-enable": 0,
            html: vjs.Html5.canPlaySource({
                type: "video/mp4"
            }) ? 1 : 0,
            quality: 720
        };
        a.on("RisLive", function() {
            "dailymotion" ==
            this.techName.toLowerCase() && (this.tech.params.quality = 480)
        });
        (this.player_.options_.playerStarted || this.source.ad || this.player_.Playlist && 1 <= this.player_.Playlist.positionInQ) && this.player_.options().autoplay ? this.params.autoplay = 1 : this.params.autoplay = 0;
        /MSIE 8|MSIE 9|Opera|OPR/i.test(vjs.USER_AGENT) && (this.fallback = 1, delete this.params.html);
        vjs.IS_MOBILE && (this.params.autoplay = 0, this.params.quality = 480);
        this.player_.options().autoplay && (this.playOnReady = !0);
        this.player_.options().ytcontrols &&
            (d = this, setTimeout(function() {
                var a = d.player_.startScreen.bigPlayButton.el();
                a.parentNode.removeChild(a);
                a = d.player_.controlBar.el();
                a.parentNode.removeChild(a)
            }, 50));
        videojs.Dailymotion.apiReady ? this.loadDailymotion() : (videojs.Dailymotion.loadingQueue.push(this), videojs.Dailymotion.apiLoading || (a = document.createElement("script"), a.src = "https://api.dmcdn.net/all.js", b = document.getElementsByTagName("script")[0], b.parentNode.insertBefore(a, b), videojs.Dailymotion.apiLoading = !0))
    }
});
videojs.Dailymotion.prototype.dispose = function() {
    "undefined" != typeof this.dmplayer && "undefined" != typeof this.dmplayer.remove && this.dmplayer.remove();
    videojs.MediaTechController.prototype.dispose.call(this)
};
videojs.Dailymotion.prototype.removePlayer = function() {
    var a = this;
    this.removeInterval = setInterval(function() {
        a.dmplayer && ("undefined" != typeof a.dmplayer.remove && a.dmplayer.remove(), clearInterval(a.removeInterval))
    }, 50)
};
videojs.Dailymotion.prototype.play = function() {
    this.isReady_ ? this.dmplayer.play() : this.playOnReady = !0
};
videojs.Dailymotion.prototype.pause = function() {
    this.dmplayer.pause();
    /MSIE 8.0/.test(vjs.USER_AGENT) && this.player_.trigger("pause")
};
videojs.Dailymotion.prototype.paused = function() {
    return this.dmplayer.paused
};
videojs.Dailymotion.prototype.currentTime = function() {
    return this.dmplayer.currentTime
};
videojs.Dailymotion.prototype.currentSrc = function() {};
videojs.Dailymotion.prototype.setCurrentTime = function(a) {
    this.wasPaused = this.dmplayer.paused ? !0 : !1;
    this.isBuffering = !0;
    this.dmplayer.seek(a);
    this.player_.trigger("timeupdate")
};
videojs.Dailymotion.prototype.duration = function() {
    return this.dmplayer.duration
};
videojs.Dailymotion.prototype.buffered = function() {
    return videojs.createTimeRange(this.dmplayer.currentTime, this.dmplayer.bufferedTime)
};
videojs.Dailymotion.prototype.volume = function() {
    isNaN(this.volumeVal) && (this.volumeVal = this.dmplayer.volume);
    return this.volumeVal
};
videojs.Dailymotion.prototype.setVolume = function(a) {
    a && a != this.volumeVal && (this.dmplayer.setVolume(a), this.volumeVal = a, this.player_.trigger("volumechange"))
};
videojs.Dailymotion.prototype.muted = function() {
    return this.dmplayer.muted
};
videojs.Dailymotion.prototype.setMuted = function(a) {
    a ? (this.dmplayer.setMuted(!0), this.dmplayer.muted = !0) : (this.dmplayer.setMuted(!1), this.dmplayer.muted = !1);
    var b = this;
    setTimeout(function() {
        b.player_.trigger("volumechange")
    }, 50)
};
videojs.Dailymotion.prototype.onReady = function() {
    this.isReady_ = !0;
    this.player_.trigger("techready");
    this.triggerReady();
    this.player_.trigger("durationchange")
};
videojs.Dailymotion.prototype.canplay = function() {};
videojs.Dailymotion.prototype.playing = function() {
    this.player_.trigger("timeupdate");
    this.player_.trigger("durationchange");
    this.player_.trigger("playing");
    this.player_.trigger("play")
};
videojs.Dailymotion.prototype.onSeek = function() {
    this.isBuffering = !0;
    this.player_.trigger("waiting");
    this.player_.trigger("timeupdate")
};
videojs.Dailymotion.prototype.onSeekFinish = function() {
    this.isBuffering = !1;
    this.wasPaused || this.play()
};
videojs.Dailymotion.prototype.exitFullScreen = function() {};
videojs.Dailymotion.prototype.onError = function(a) {
    if (!this.isReady_ && this.fallback) return a.stopPropagation(), !1;
    if (!this.fallback) return this.fallback = 1, delete this.params.html, this.params.autoplay = 1, this.isReady_ = !1, this.loadDailymotion(), a.stopPropagation(), !1;
    this.player_.Playlist.initialVideo[0].src != this.videoId || this.player_.Playlist.positionInQ || (this.player_.Playlist.positionInQ = 1)
};
videojs.Dailymotion.isSupported = function() {
    return !0
};
videojs.Dailymotion.prototype.supportsFullScreen = function() {
    return !1
};
videojs.Dailymotion.canPlaySource = function(a) {
    return "video/dailymotion" == a.type
};
videojs.Dailymotion.prototype.loadAndPlay = function() {
    this.dmplayer.load(this.videoId);
    this.dmplayer.play()
};
videojs.Dailymotion.prototype.ping = function(a, b) {
    if (a || "undefined" != typeof b.error && 404 == b.error.code) return this.player_.trigger("Rerror"), !1;
    this.loadAndPlay();
    return !0
};
videojs.Dailymotion.prototype.src = function(a) {
    this.videoId = a;
    vjs.jsonp("https://api.dailymotion.com/video/" + a, vjs.bind(this, this.ping))
};
videojs.Dailymotion.prototype.load = function() {};
videojs.Dailymotion.prototype.onEnded = function(a) {
    /MSIE 8.0/.test(vjs.USER_AGENT) && this.player_.trigger("ended");
    return !1
};
videojs.Dailymotion.loadingQueue = [];
videojs.Dailymotion.prototype.loadDailymotion = function() {
    var a = this.player_.options_.width,
        b = parseInt(vjs.static_.controlBarSize["skin" + (this.player_.options_.reEmbed.skin || 1)].height, 10);
    this.dmplayer = DM.player(this.el_, {
        video: this.videoId,
        width: a,
        height: this.player_.options_.height - this.player_.options_.reEmbed.pady - b,
        params: this.params,
        events: {
            apiready: function(a) {
                a.target.vjsTech.onReady()
            },
            canplay: function(a) {
                a.target.vjsTech.canplay()
            },
            playing: function(a) {
                a.target.vjsTech.playing()
            },
            seeking: function(a) {
                a.target.vjsTech.onSeek()
            },
            seeked: function(a) {
                a.target.vjsTech.onSeekFinish()
            },
            error: function(a) {
                a.target.vjsTech.onError(a)
            },
            ended: function(a) {
                a.target.vjsTech.onEnded(a)
            }
        }
    });
    this.dmplayer.vjsTech = this;
    this.el_ = this.player_.el_.childNodes[0];
    this.el_.setAttribute("scrolling", "no")
};
window.dmAsyncInit = function() {
    for (var a; a = videojs.Dailymotion.loadingQueue.shift();) a.loadDailymotion();
    videojs.Dailymotion.loadingQueue = [];
    videojs.Dailymotion.apiReady = !0
};
var VimeoState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3
};
videojs.Vimeo = videojs.MediaTechController.extend({
    init: function(a, b, c) {
        videojs.MediaTechController.call(this, a, b, c);
        "undefined" != typeof a.Playlist && "undefined" != typeof a.Playlist.videoQ[a.Playlist.positionInQ] && "video/vimeo" == a.Playlist.videoQ[a.Playlist.positionInQ][0].type ? (this.source = vjs.cloneObject(a.Playlist.videoQ[a.Playlist.positionInQ][0]), this.videoId = a.Playlist.videoQ[a.Playlist.positionInQ][0].src) : a.options().sources && "video/vimeo" == a.options().sources[0].type ? (this.source = vjs.cloneObject(a.options().sources[0]),
            this.videoId = a.options().sources[0].src) : (this.source = {}, this.videoId = "");
        this.player_ = a;
        this.player_el_ = document.getElementById(this.player_.id());
        this.id_ = this.player_.id() + "_vimeo_api";
        this.el_ = videojs.Component.prototype.createEl("iframe", {
            id: this.id_,
            className: "vjs-tech",
            scrolling: "no",
            marginWidth: 0,
            marginHeight: 0,
            frameBorder: 0,
            webkitAllowFullScreen: "true",
            mozallowfullscreen: "true",
            allowFullScreen: "true"
        });
        this.player_el_.insertBefore(this.el_, this.player_el_.firstChild);
        b = vjs.colors.getBrighterColor(this.player_.options_.reEmbed);
        this.params = {
            api: 1,
            byline: 0,
            badge: 0,
            portrait: 0,
            title: 0,
            show_title: 0,
            show_byline: 0,
            show_portait: 0,
            fullscreen: 1,
            player_id: this.id_,
            loop: 0,
            color: b
        };
        (this.player_.options_.playerStarted || this.source.ad || this.player_.Playlist && 1 <= this.player_.Playlist.positionInQ) && this.player_.options().autoplay ? this.params.autoplay = 1 : this.params.autoplay = 0;
        this.baseUrl = "https://player.vimeo.com/video/";
        this.vimeo = {};
        this.vimeoInfo = {};
        var d = this;
        this.el_.attachEvent ? this.el_.attachEvent("onload", vjs.bind(d, d.onLoad)) :
            this.el_.onload = function() {
                d.onLoad()
            };
        this.startMuted = a.options().muted;
        this.src(this.videoId)
    }
});
videojs.Vimeo.prototype.dispose = function() {
    this.vimeo.api && (this.vimeo.removeEvent("ready"), this.vimeo.api("unload"));
    delete this.vimeo;
    this.el_.parentNode.removeChild(this.el_);
    videojs.MediaTechController.prototype.dispose.call(this)
};
videojs.Vimeo.prototype.src = function(a) {
    this.isReady_ = !1;
    this.videoId = a;
    "#" === this.params.color.substring(0, 1) && (this.params.color = this.params.color.substring(1));
    this.el_.src = this.baseUrl + this.videoId + "?" + videojs.Vimeo.makeQueryString(this.params)
};
videojs.Vimeo.prototype.load = function() {};
videojs.Vimeo.prototype.play = function() {
    this.vimeo.api("play")
};
videojs.Vimeo.prototype.pause = function() {
    this.vimeo.api("pause")
};
videojs.Vimeo.prototype.paused = function() {
    return this.vimeoInfo.state !== VimeoState.PLAYING && this.vimeoInfo.state !== VimeoState.BUFFERING
};
videojs.Vimeo.prototype.currentTime = function() {
    return this.vimeoInfo.time || 0
};
videojs.Vimeo.prototype.setCurrentTime = function(a) {
    this.vimeo.api("seekTo", a);
    this.player_.trigger("timeupdate")
};
videojs.Vimeo.prototype.duration = function() {
    return this.vimeoInfo.duration || 0
};
videojs.Vimeo.prototype.buffered = function() {
    return videojs.createTimeRange(0, this.vimeoInfo.buffered * this.vimeoInfo.duration || 0)
};
videojs.Vimeo.prototype.volume = function() {
    return this.vimeoInfo.muted ? this.vimeoInfo.muteVolume : this.vimeoInfo.volume
};
videojs.Vimeo.prototype.setVolume = function(a) {
    this.vimeo.api("setvolume", a);
    this.vimeoInfo.volume = a;
    this.player_.trigger("volumechange")
};
videojs.Vimeo.prototype.currentSrc = function() {
    return this.el_.src
};
videojs.Vimeo.prototype.muted = function() {
    return this.vimeoInfo.muted || !1
};
videojs.Vimeo.prototype.setMuted = function(a) {
    a ? (this.vimeoInfo.muteVolume = this.vimeoInfo.volume, this.setVolume(0)) : this.setVolume(this.vimeoInfo.muteVolume);
    this.vimeoInfo.muted = a;
    this.player_.trigger("volumechange")
};
videojs.Vimeo.prototype.onReady = function() {
    this.isReady_ = !0;
    this.triggerReady();
    this.player_.trigger("loadedmetadata");
    this.startMuted && (this.setMuted(!0), this.startMuted = !1)
};
videojs.Vimeo.prototype.onLoad = function() {
    this.vimeo && this.vimeo.api && (this.vimeo.api("unload"), delete this.vimeo);
    this.vimeo = window.Froogaloop(this.el_);
    this.vimeoInfo = {
        state: VimeoState.UNSTARTED,
        volume: 1,
        muted: !1,
        muteVolume: 1,
        time: 0,
        duration: 0,
        buffered: 0,
        url: this.baseUrl + this.videoId,
        error: null
    };
    var a = this;
    this.vimeo.addEvent("ready", function(b) {
        a.onReady();
        a.vimeo.addEvent("loadProgress", function(b, d) {
            a.onLoadProgress(b)
        });
        a.vimeo.addEvent("playProgress", function(b, d) {
            a.onPlayProgress(b)
        });
        a.vimeo.addEvent("play",
            function(b) {
                a.onPlay()
            });
        a.vimeo.addEvent("pause", function(b) {
            a.onPause()
        });
        a.vimeo.addEvent("finish", function(b) {
            a.onFinish()
        });
        a.vimeo.addEvent("seek", function(b, d) {
            a.onSeek(b)
        })
    })
};
videojs.Vimeo.prototype.onLoadProgress = function(a) {
    var b = !this.vimeoInfo.duration;
    this.vimeoInfo.duration = a.duration;
    this.vimeoInfo.buffered = a.percent;
    this.player_.trigger("progress");
    b && this.player_.trigger("durationchange")
};
videojs.Vimeo.prototype.onPlayProgress = function(a) {
    this.vimeoInfo.time = a.seconds;
    this.player_.trigger("timeupdate")
};
videojs.Vimeo.prototype.onPlay = function() {
    this.vimeoInfo.state = VimeoState.PLAYING;
    this.player_.trigger("play")
};
videojs.Vimeo.prototype.onPause = function() {
    this.vimeoInfo.state = VimeoState.PAUSED;
    this.player_.trigger("pause")
};
videojs.Vimeo.prototype.onFinish = function() {
    this.vimeoInfo.state = VimeoState.ENDED;
    this.player_.trigger("ended")
};
videojs.Vimeo.prototype.onSeek = function(a) {
    this.vimeoInfo.time = a.seconds;
    this.player_.trigger("timeupdate");
    this.player_.trigger("seeked")
};
videojs.Vimeo.prototype.onError = function(a) {
    this.player_.trigger("error")
};
videojs.Vimeo.isSupported = function() {
    return !0
};
videojs.Vimeo.prototype.supportsFullScreen = function() {
    return !1
};
videojs.Vimeo.canPlaySource = function(a) {
    return "video/vimeo" == a.type
};
videojs.Vimeo.makeQueryString = function(a) {
    var b = [],
        c;
    for (c in a) a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
    return b.join("&")
};
var Froogaloop = function() {
    function a(b) {
        return new a.fn.init(b)
    }

    function b(a, b, c) {
        if (!c || !c.contentWindow || !c.contentWindow.postMessage) return !1;
        var d = c.getAttribute("src").split("?")[0];
        a = JSON.stringify({
            method: a,
            value: b
        });
        "//" === d.substr(0, 2) && (d = window.location.protocol + d);
        c.contentWindow.postMessage(a, d)
    }

    function c(a) {
        var b, c;
        try {
            b = JSON.parse(a.data), c = b.event || b.method
        } catch (d) {}
        "ready" != c || f || (f = !0);
        if (a.origin != g) return !1;
        a = b.value;
        var l = b.data,
            n = "" === n ? null : b.player_id;
        b = n && e[n] ? e[n][c] : e[c];
        c = [];
        if (!b) return !1;
        void 0 !== a && c.push(a);
        l && c.push(l);
        n && c.push(n);
        return 0 < c.length ? b.apply(null, c) : b.call()
    }

    function d(a, b, c) {
        c ? (e[c] || (e[c] = {}), e[c][a] = b) : e[a] = b
    }
    var e = {},
        f = !1,
        g = "";
    a.fn = a.prototype = {
        element: null,
        init: function(a) {
            "string" === typeof a && (a = document.getElementById(a));
            this.element = a;
            a = this.element.getAttribute("src");
            "//" === a.substr(0, 2) && (a = window.location.protocol + a);
            a = a.split("/");
            for (var b = "", c = 0, d = a.length; c < d; c++) {
                if (3 > c) b += a[c];
                else break;
                2 > c && (b += "/")
            }
            g = b;
            return this
        },
        api: function(a,
            c) {
            if (!this.element || !a) return !1;
            var e = this.element,
                f = "" !== e.id ? e.id : null,
                g = c && c.constructor && c.call && c.apply ? null : c,
                m = c && c.constructor && c.call && c.apply ? c : null;
            m && d(a, m, f);
            b(a, g, e);
            return this
        },
        addEvent: function(a, c) {
            if (!this.element) return !1;
            var e = this.element,
                g = "" !== e.id ? e.id : null;
            d(a, c, g);
            "ready" != a ? b("addEventListener", a, e) : "ready" == a && f && c.call(null, g);
            return this
        },
        removeEvent: function(a) {
            if (!this.element) return !1;
            var c = this.element,
                d = "" !== c.id ? c.id : null;
            a: {
                if (d && e[d]) {
                    if (!e[d][a]) {
                        d = !1;
                        break a
                    }
                    e[d][a] =
                        null
                } else {
                    if (!e[a]) {
                        d = !1;
                        break a
                    }
                    e[a] = null
                }
                d = !0
            }
            "ready" != a && d && b("removeEventListener", a, c)
        }
    };
    a.fn.init.prototype = a.fn;
    window.addEventListener ? window.addEventListener("message", c, !1) : window.attachEvent("onmessage", c);
    return window.Froogaloop = a
}();
videojs.Youtube = videojs.MediaTechController.extend({
    init: function(a, b, c) {
        videojs.MediaTechController.call(this, a, b, c);
        this.features.fullscreenResize = !0;
        this.player_ = a;
        this.player_el_ = document.getElementById(this.player_.id());
        this.errorCode = 0;
        this.initialLoad = !0;
        this.player_.options().ytcontrols && this.player_.controls(!1);
        "undefined" != typeof a.Playlist && "undefined" != typeof a.Playlist.videoQ[a.Playlist.positionInQ] && "video/youtube" == a.Playlist.videoQ[a.Playlist.positionInQ][0].type ? (this.source = vjs.cloneObject(a.Playlist.videoQ[a.Playlist.positionInQ][0]),
            this.videoId = a.Playlist.videoQ[a.Playlist.positionInQ][0].src) : a.options().sources && "video/youtube" == a.options().sources[0].type ? (this.source = vjs.cloneObject(a.options().sources[0]), this.videoId = a.options().sources[0].src) : (this.source = {}, this.videoId = "");
        this.id_ = this.player_.id() + "_youtube_api";
        this.el_ = videojs.Component.prototype.createEl("iframe", {
            id: this.id_,
            className: "vjs-tech",
            scrolling: "no",
            marginWidth: 0,
            marginHeight: 0,
            frameBorder: 0,
            referrerPolicy: vjs.IS_SAFARI ? "never" : "no-referrer",
            webkitAllowFullScreen: "true",
            mozallowfullscreen: "true",
            allowFullScreen: "true"
        });
        this.el_.onload = function(b) {
            setTimeout(function() {
                    var b = !1;
                    if (window.performance && window.performance.getEntriesByType) {
                        var c = window.performance.getEntriesByType("resource"),
                            d;
                        for (d in c) - 1 < c[d].name.indexOf("youtube.com/embed/") && -1 < ["iframe", "subdocument"].indexOf(c[d].initiatorType) && (b = !0);
                        b || a.isReady_ || (a.trigger("error"), a.PerfStats.sendStats({
                            _detectedIframeError: !0
                        }), a.ready(function() {
                            a.trigger("RnoError");
                            a.PerfStats.sendStats({
                                _detectedIframeError: "falsepositive"
                            })
                        }))
                    }
                },
                0);
            a.trigger("RperfILoaded")
        };
        this.wrapperDiv = this.el_;
        this.params = {
            enablejsapi: 1,
            iv_load_policy: a.options().reEmbed.annotations && !a.hasNegativePlid() ? 1 : 3,
            playerapiid: this.id(),
            disablekb: 1,
            wmode: "transparent",
            controls: !a.options().ytcontrols && !a.defaultControls() || a.hasNegativePlid() ? 0 : 1,
            showinfo: a.options().reEmbed.modestbranding ? 1 : 0,
            playsinline: a.hasNegativePlid() ? 1 : 0,
            modestbranding: a.options().reEmbed.modestbranding ? 1 : 0,
            rel: 0,
            loop: a.options().loop ? 1 : 0,
            cc_load_policy: 1,
            fs: 7 == a.options_.reEmbed.skin ||
                vjs.IS_MOBILE ? 1 : 0,
            html5: vjs.Html5.canPlaySource({
                type: "video/mp4"
            }) ? 1 : 0
        };
        b = a.options().reEmbed.pings.plid.split("_");
        if ("11630" == b[0] || "13620" == b[0]) this.params.showinfo = 1;
        (this.player_.options_.playerStarted || this.source.ad || this.player_.Playlist && 1 <= this.player_.Playlist.positionInQ) && this.player_.options().autoplay ? this.params.autoplay = 1 : this.params.autoplay = 0;
        vjs.IS_IE11_PHONE && (this.params.vq = "small");
        /MSIE 8|MSIE 9|Opera|OPR/i.test(vjs.USER_AGENT) && delete this.params.html5;
        vjs.IS_MOBILE && (this.params.autoplay =
            0);
        this.params.autoplay && (this.playOnReady = !0);
        var d = this;
        setTimeout(function() {
            d.player_.controlBar.Toolkit.Captions = d.player_.controlBar.Toolkit.addChild("Captions")
        }, 10);
        this.player_.options().ytcontrols && setTimeout(function() {
            var a = d.player_.startScreen.bigPlayButton.el();
            a.parentNode.removeChild(a);
            a = d.player_.controlBar.el();
            a.parentNode.removeChild(a)
        }, 50);
        this.el_.src = "https://www.youtube.com/embed/" + this.videoId + "?" + vjs.objectToGet(this.params);
        this.player_.el_.insertBefore(this.el_, this.player_.el_.firstChild);
        videojs.Youtube.apiReady ? this.loadYoutube() : (videojs.Youtube.loadingQueue.push(this), videojs.Youtube.apiLoading || "undefined" != typeof YT && (YT.loading || YT.loaded) || (b = document.createElement("script"), b.async = !0, b.src = "https://www.youtube.com/iframe_api", c = document.getElementsByTagName("script")[0], c.parentNode.insertBefore(b, c), videojs.Youtube.apiLoading = !0))
    }
});
videojs.Youtube.prototype.dispose = function() {
    this.el_ = this.wrapperDiv;
    "undefined" != typeof this.ytplayer && this.ytplayer.destroy();
    videojs.MediaTechController.prototype.dispose.call(this)
};
videojs.Youtube.prototype.play = function() {
    this.isReady_ ? (this.player_.options_.vq && this.ytplayer.setPlaybackQuality(this.player_.options_.vq), this.ytplayer.playVideo()) : this.playOnReady = !0
};
videojs.Youtube.prototype.pause = function() {
    this.ytplayer.pauseVideo()
};
videojs.Youtube.prototype.paused = function() {
    return this.ytplayer ? this.lastState !== YT.PlayerState.PLAYING && this.lastState !== YT.PlayerState.BUFFERING : !0
};
videojs.Youtube.prototype.currentSrc = function() {};
videojs.Youtube.prototype.currentTime = function() {
    return this.ytplayer && this.ytplayer.getCurrentTime ? this.ytplayer.getCurrentTime() : 0
};
videojs.Youtube.prototype.setCurrentTime = function(a) {
    1 > Math.floor(this.player_.duration()) - Math.floor(a) && (a = Math.floor(this.player_.duration() - 1));
    this.ytplayer.seekTo(a, !0);
    this.player_.trigger("timeupdate")
};
videojs.Youtube.prototype.duration = function() {
    return this.ytplayer && this.ytplayer.getDuration ? this.ytplayer.getDuration() : 0
};
videojs.Youtube.prototype.buffered = function() {
    if (this.ytplayer && this.ytplayer.getVideoBytesLoaded) {
        var a = this.ytplayer.getVideoBytesLoaded(),
            b = this.ytplayer.getVideoBytesTotal();
        if (!a || !b) return 0;
        var c = this.ytplayer.getDuration(),
            a = a / b * c,
            b = this.ytplayer.getVideoStartBytes() / b * c;
        return videojs.createTimeRange(b, b + a)
    }
    return videojs.createTimeRange(0, 0)
};
videojs.Youtube.prototype.volume = function() {
    isNaN(this.volumeVal) && (this.volumeVal = this.ytplayer.getVolume() / 100);
    return this.volumeVal
};
videojs.Youtube.prototype.setVolume = function(a) {
    a && a != this.volumeVal && (this.ytplayer.setVolume(100 * a), this.volumeVal = a, this.player_.trigger("volumechange"))
};
videojs.Youtube.prototype.muted = function() {
    return this.mutedVal
};
videojs.Youtube.prototype.setMuted = function(a) {
    a ? this.ytplayer.mute() : this.ytplayer.unMute();
    this.mutedVal = a;
    this.player_.trigger("volumechange")
};
videojs.Youtube.prototype.onReady = function() {
    this.isReady_ = !0;
    this.triggerReady();
    this.player_.hasNegativePlid() && this.setMuted(!0);
    this.playOnReady && this.play()
};
videojs.Youtube.prototype.exitFullScreen = function() {};
videojs.Youtube.prototype.onStateChange = function(a) {
    if (a != this.lastState) {
        switch (a) {
            case -1:
                vjs.IS_MOBILE && "none" == this.player_.landing.el_.style.display && "block" == this.player_.startScreen.posterImage.el_.style.display && (this.player_.trigger("RshowOverlaySpinner"), this.player_.options_.hasAds && !this.player_.Lkqd.complete && (this.ytplayer.pauseVideo(), this.initialLoad = !0, this.player_.trigger("RloadLKQD")));
                this.player_.trigger("durationchange");
                break;
            case YT.PlayerState.ENDED:
                this.player_.trigger("ended");
                break;
            case YT.PlayerState.PLAYING:
                this.player_.trigger("timeupdate");
                this.player_.trigger("durationchange");
                this.player_.trigger("playing");
                this.player_.trigger("play");
                break;
            case YT.PlayerState.PAUSED:
                this.player_.trigger("pause");
                break;
            case YT.PlayerState.BUFFERING:
                this.player_.trigger("timeupdate"), this.player_.trigger("waiting"), this.initialLoad && vjs.IS_MOBILE && (this.initialLoad = !1, this.player_.onWaitEnd())
        }
        this.lastState = a
    }
};
videojs.Youtube.prototype.onPlaybackRateChange = function(a) {
    this.player_.trigger({
        type: "RrateChange",
        data: a
    })
};
videojs.Youtube.prototype.onPlaybackQualityChange = function(a) {
    switch (a) {
        case "medium":
            this.player_.videoWidth = 480;
            this.player_.videoHeight = 360;
            break;
        case "large":
            this.player_.videoWidth = 640;
            this.player_.videoHeight = 480;
            break;
        case "hd720":
            this.player_.videoWidth = 960;
            this.player_.videoHeight = 720;
            break;
        case "hd1080":
            this.player_.videoWidth = 1440;
            this.player_.videoHeight = 1080;
            break;
        case "hd1440":
            this.player_.videoWidth = 2560;
            this.player_.videoHeight = 1440;
            break;
        case "hd2160":
            this.player_.videoWidth = 3840;
            this.player_.videoHeight = 2160;
            break;
        case "highres":
            this.player_.videoWidth = 1920;
            this.player_.videoHeight = 1080;
            break;
        case "small":
            this.player_.videoWidth = 320;
            this.player_.videoHeight = 240;
            break;
        default:
            a = "tiny", this.player_.videoWidth = 0, this.player_.videoHeight = 0
    }
    this.player_.trigger({
        type: "RqualityChange",
        data: a
    })
};
videojs.Youtube.prototype.onError = function(a) {
    if ("" == this.videoId) return !1;
    this.player_.Playlist.positionInQ || (this.player_.Playlist.positionInQ = 1);
    this.errorCode = a;
    if (5 == a) return delete this.params.html5, this.params.autoplay = 1, !1;
    this.player_.trigger("error")
};
videojs.Youtube.isSupported = function() {
    return !0
};
videojs.Youtube.prototype.supportsFullScreen = function() {
    return !1
};
videojs.Youtube.canPlaySource = function(a) {
    return "video/youtube" == a.type
};
videojs.Youtube.canControlVolume = function() {
    return !0
};
videojs.Youtube.prototype.src = function(a) {
    this.videoId = a;
    this.ytplayer.loadVideoById(this.videoId)
};
videojs.Youtube.prototype.load = function() {};
videojs.Youtube.loadingQueue = [];
videojs.Youtube.prototype.loadYoutube = function() {
    if ("youtube" != this.player_.techName.toLowerCase()) return videojs.Youtube.loadingQueue = [], !1;
    parseInt(vjs.static_.controlBarSize["skin" + (this.player_.options_.reEmbed.skin || 1)].height, 10);
    this.ytplayer = new YT.Player(this.id_, {
        events: {
            onReady: function(a) {
                a.target.vjsTech.onReady()
            },
            onStateChange: function(a) {
                a.target.vjsTech.onStateChange(a.data)
            },
            onPlaybackQualityChange: function(a) {
                a.target.vjsTech.onPlaybackQualityChange(a.data)
            },
            onPlaybackRateChange: function(a) {
                a.target.vjsTech.onPlaybackRateChange(a.data)
            },
            onError: function(a) {
                a.target.vjsTech.onError(a.data)
            }
        }
    });
    var a = this.ytplayer.getIframe();
    !1 === /https:/.test(a.src) && (a.src = a.src.replace("http://", "https://"));
    this.el_ = a;
    this.el_.setAttribute("scrolling", "no");
    this.ytplayer.vjsTech = this
};
videojs.Youtube.makeQueryString = function(a) {
    var b = [],
        c;
    for (c in a) a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
    return b.join("&")
};

function YTReady() {
    for (var a; a = videojs.Youtube.loadingQueue.shift();) a.loadYoutube();
    videojs.Youtube.loadingQueue = [];
    videojs.Youtube.apiReady = !0
}
"undefined" === typeof YT || 1 !== YT.loaded ? window.onYouTubeIframeAPIReady = function() {
    YTReady()
} : YTReady();
vjs.Vpaid = vjs.MediaTechController.extend({
    init: function(a, b, c) {
        vjs.MediaTechController.call(this, a, b, c);
        this.endTriggered = !1;
        this.features.fullscreenResize = !1;
        this.player_ = a;
        this.fakeCurrentTime = 0;
        this.fakeDuration;
        this.state = "";
        this.initialTimeUpdate = !1;
        this.objectParams = {
            movie: vjs.static_.vpaidProxy,
            quality: "high",
            bgcolor: "#ffffff",
            play: "true",
            wmode: /MSIE/.test(vjs.USER_AGENT) ? "opaque" : "window",
            scale: "showall"
        };
        this.eventListeners = {
            AdLoaded: "adLoaded",
            AdError: "onError",
            AdStarted: "adStarted",
            AdPaused: "adPaused",
            AdPlaying: "adPlaying",
            AdVideoComplete: "adVideoComplete",
            AdStopped: "adStopped",
            AdDurationChange: "adDurationChange",
            AdClickThru: "adClickThru"
        };
        this.isFlash = "application/x-shockwave-flash" == b.source.vType;
        this.createElement(b.source);
        a.on("play", this.onPlay);
        a.on("pause", this.onPause)
    }
});
vjs.Vpaid.prototype.dispose = function() {
    try {
        this.api.stopAd()
    } catch (a) {}
    clearInterval(this.timeUpdate);
    this.initialTimeUpdate = !1;
    this.player_.off("play", this.onPlay);
    this.player_.off("pause", this.onPause);
    this.vpaidholder.parentNode.removeChild(this.vpaidholder);
    vjs.MediaTechController.prototype.dispose.call(this)
};
vjs.Vpaid.prototype.onPlay = function() {
    var a = this;
    clearInterval(this.tech.timeUpdate);
    this.tech.timeUpdate = setInterval(function() {
        var b = a.tech.remainingTime();
        if ("undefined" == typeof b || 0 > b) return !1;
        !a.tech.initialTimeUpdate && 0 < b && (a.tech.fakeDuration = b, a.tech.initialTimeUpdate = !0, a.tech.adDurationChange());
        a.tech.fakeCurrentTime = a.duration() - b;
        a.trigger("timeupdate");
        0 >= b && a.tech.initialTimeUpdate && a.tech.checkEnded()
    }, 10)
};
vjs.Vpaid.prototype.checkEnded = function() {
    var a = this.player_;
    setTimeout(function() {
        "Vpaid" == a.techName && a.tech.adVideoComplete()
    }, 1E3)
};
vjs.Vpaid.prototype.onPause = function() {
    clearInterval(this.tech.timeUpdate)
};
vjs.Vpaid.prototype.init = function(a) {
    a = a || {};
    var b = this.player_.size(),
        c = this.player_,
        d = {
            slot: this.vpaidholder,
            videoSlot: this.el_,
            videoSlotCanAutoPlay: !0
        };
    if (this.isFlash) this.api.initAd();
    else try {
        this.api.initAd(b[0], b[1], "normal", 512, a, d)
    } catch (e) {
        setTimeout(function() {
            c.Playlist.playNextVideo()
        }, 0)
    }
};
vjs.Vpaid.prototype.adLoaded = function() {
    this.player_.overlaySpinner.hide();
    !1 === this.getProperty("adLinear") ? this.player_.trigger("error") : this.api.startAd()
};
vjs.Vpaid.prototype.adPaused = function() {
    this.state = "paused";
    this.player_.trigger("pause")
};
vjs.Vpaid.prototype.adPlaying = function() {
    this.state = "playing";
    this.player_.trigger("play");
    this.player_.trigger("timeupdate")
};
vjs.Vpaid.prototype.adDurationChange = function() {
    this.player_.trigger("durationchange")
};
vjs.Vpaid.prototype.adClickThru = function() {
    this.player_.Linear.firePing("click")
};
vjs.Vpaid.prototype.adStarted = function() {
    this.adPlaying()
};
vjs.Vpaid.prototype.adVideoComplete = function() {
    !1 === this.endTriggered && (clearInterval(this.timeUpdate), this.player_.trigger("ended"), this.endTriggered = !0)
};
vjs.Vpaid.prototype.adStopped = function() {
    clearInterval(this.timeUpdate);
    this.checkEnded()
};
vjs.Vpaid.prototype.onError = function() {
    this.player_.trigger("error")
};
vjs.Vpaid.prototype.setListeners = function() {
    var a = "vjs.players." + this.player_.id() + ".tech.",
        b;
    for (b in this.eventListeners) this.api.subscribe(this.isFlash ? a + this.eventListeners[b] : vjs.bind(this, this[this.eventListeners[b]]), b)
};
vjs.Vpaid.prototype.createElement = function(a) {
    var b = this,
        c = this.player_.size();
    this.player_.overlaySpinner.show();
    this.id_ = this.player_.id() + "_vpaid_api";
    "application/javascript" == a.vType || "application/x-javascript" == a.vType ? (this.el_ = vjs.createEl("video", {
        id: this.id_,
        className: "vjs-tech"
    }), this.adManager = vjs.createEl("iframe", {
        className: "vjs-adManager-loader"
    }), this.adManager.style.display = "none", this.adManager.onload = function() {
        var c = this.contentWindow.document.createElement("script"),
            e = this;
        c.src =
            a.src;
        c.onload = function() {
            clearTimeout(b.loadTimeout);
            b.api = e.contentWindow.getVPAIDAd();
            b.api.handshakeVersion("2.0");
            b.setListeners();
            b.init(a.adParameters || {});
            b.onReady()
        };
        this.contentWindow.document.body.appendChild(c)
    }, this.player_.el_.appendChild(this.adManager)) : (this.el_ = vjs.createEl("object", {}), vjs.insertFirst(this.el_, this.player_.el_), this.el_ = vjs.Flash.embed(vjs.static_.vpaidProxy, this.el_, {
        vpaidUrl: encodeURIComponent(a.src),
        loadedCallback: "vjs.players." + this.player_.id() + ".tech.SWFLoaded",
        adParameters: encodeURIComponent(a.adParameters || "")
    }, this.objectParams, {
        id: this.id_,
        className: "vjs-tech",
        width: c[0],
        height: c[1]
    }));
    this.vpaidholder = vjs.createEl("div", {
        className: "vpaidholder"
    });
    this.player_.el_.appendChild(this.vpaidholder);
    this.player_.el_.insertBefore(this.el_, this.player_.el_.firstChild);
    this.loadTimeoutCheck()
};
vjs.Vpaid.prototype.loadTimeoutCheck = function() {
    var a = this.player_;
    this.loadTimeout = setTimeout(function() {
        a.Playlist.playNextVideo()
    }, 5E3)
};
vjs.Vpaid.prototype.SWFLoaded = function() {
    clearTimeout(this.loadTimeout);
    this.api = window[this.id_];
    this.api.handshakeVersion("2.0");
    this.setListeners();
    this.init();
    this.onReady()
};
vjs.Vpaid.canPlaySource = function(a) {
    return "video/vpaid" == a.type
};
vjs.Vpaid.isSupported = function() {
    return !0
};
vjs.Vpaid.prototype.onReady = function() {
    this.isReady_ = !0;
    this.player_.trigger("techready");
    this.triggerReady();
    this.player_.trigger("durationchange")
};
vjs.Vpaid.prototype.play = function() {
    this.api.resumeAd()
};
vjs.Vpaid.prototype.pause = function() {
    this.api.pauseAd()
};
vjs.Vpaid.prototype.getProperty = function(a) {
    try {
        return this.isFlash ? this.api.getProperty(a) : this.api["get" + vjs.capitaliseFirstLetter(a)]()
    } catch (b) {}
};
vjs.Vpaid.prototype.currentTime = function() {
    return this.fakeCurrentTime
};
vjs.Vpaid.prototype.remainingTime = function() {
    return this.getProperty("adRemainingTime")
};
vjs.Vpaid.prototype.volume = function() {};
vjs.Vpaid.prototype.duration = function() {
    var a = this.getProperty("adDuration");
    return 0 > a && this.initialTimeUpdate ? this.fakeDuration : a
};
vjs.Vpaid.prototype.buffered = function() {
    return 0
};
vjs.Vpaid.prototype.supportsFullScreen = function() {
    return !1
};
vjs.Vpaid.prototype.load = function() {};
vjs.Vpaid.prototype.setVolume = function() {};
vjs.Vpaid.prototype.setMuted = function() {};
vjs.Vpaid.prototype.muted = function() {};
vjs.Vpaid.prototype.paused = function() {
    return "paused" == this.state
};
vjs.WaterMark = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        this.hide();
        a.on("Rresize", vjs.bind(this, this.resize));
        var c = this;
        c.off("click");
        c.off("touchstart");
        c.eventListener = vjs.IS_MOBILE && !vjs.IS_WINDOWS_PHONE ? "touchstart" : "click";
        c.on(c.eventListener, c.onClick);
        setTimeout(function() {
            c.resize()
        }, 0);
        window._X_REM_NEST || a.ready(function() {
            return !1
        })
    }
});
vjs.WaterMark.prototype.verifyDom = function() {
    return null !== this.el_.parentNode && this.el_.childNodes.length && "img" == this.el_.childNodes[0].tagName.toLowerCase() && this.el_.childNodes[0].src == vjs.static_.logo.whiteE && "rem-logo" == this.el_.className && "rem-logo-img" == this.el_.childNodes[0].className && this.el_.href == vjs.static_.homepageURL + "?ref=startscreen"
};
vjs.WaterMark.prototype.createEl = function() {
    var a = vjs.createEl("a", {
        className: "rem-logo",
        target: "_blank",
        title: "Custom YouTube Video Players",
        href: vjs.static_.homepageURL + "?ref=startscreen"
    });
    a.style.cssText = vjs.static_.watermark.rootStyles;
    var b = vjs.createEl("img", {
        className: "rem-logo-img",
        src: vjs.static_.logo.whiteE,
        alt: "reEmbed"
    });
    b.style.cssText = vjs.static_.watermark.imageStyles;
    a.appendChild(b);
    return a
};
vjs.WaterMark.prototype.validateStyles = function(a, b) {
    a = a.toLowerCase().replace(/ |;$/g, "").split(";");
    b = b.toLowerCase().replace(/ |;$/g, "").split(";");
    if (a.length == b.length)
        for (var c = 0; c < a.length; ++c)
            if (-1 >= b.indexOf(a[c])) return !1;
    return a.length == b.length
};
vjs.WaterMark.prototype.clearProtection = function() {
    var a = this.player_.startScreen.waterMark;
    clearInterval(a.protectInterval);
    a.el_.style.cssText = a.el_.style.cssText.replace(/display.*?;/g, "");
    a.el_.childNodes[0].style.cssText = a.el_.childNodes[0].style.cssText.replace(/display.*?;/g, "")
};
vjs.WaterMark.prototype.resize = function() {
    var a = this.player_.startScreen.waterMark;
    a.scale = (.65 + .2 * (a.player_.size()[0] / 600)).toFixed(/MSIE/i.test(vjs.USER_AGENT) ? 2 : 5);
    a.el_.style.setProperty && a.el_.style.setProperty("font-size", a.scale + "em", "important")
};
vjs.WaterMark.prototype.onClick = function() {
    var a = this.player_.startScreen.waterMark;
    (vjs.IS_ANDROID || vjs.IS_IOS) && window.open(a.el_.getAttribute("href"))
};
vjs.options.children.Ads = {};
vjs.Ads = vjs.CoreObject.extend({
    init: function(a, b) {
        1 == a.options().hasAds && (a.Linear = a.addChild("Linear"), a.nonLinear = a.addChild("nonLinear"), a.Vast = a.addChild("Vast"), a.Lkqd = a.addChild("Lkqd"))
    }
});
vjs.AdLink = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        this.player = a;
        this.hide();
        this.on("click", this.onClick);
        a.on("RadEnd", function() {
            this.Linear.AdLink.hide()
        });
        a.on("RlinearLoaded", function(a) {
            "Vpaid" !== this.techName && (this.Linear.AdLink.show(), this.Linear.AdLink.el_.setAttribute("href", this.Vast.ads[a.data.id].creatives[0].clicks.ClickThrough))
        })
    }
});
vjs.AdLink.prototype.createEl = function() {
    return vjs.createEl("a", {
        className: "vjs-link",
        target: "_blank"
    })
};
vjs.AdLink.prototype.onClick = function() {
    this.player.pause();
    this.player.Linear.firePing("click")
};
vjs.AdPlayButton = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        this.player = a;
        a.on("pause", function() {
            this.Linear.AdPlayButton.show.apply(this)
        });
        a.on("play", function() {
            this.Linear.AdPlayButton.hide()
        });
        a.on("RadEnd", function() {
            this.Linear.AdPlayButton.hide()
        })
    }
});
vjs.AdPlayButton.prototype.createEl = function() {
    var a = vjs.createEl("div", {
            className: "vjs-ad-play"
        }),
        b = vjs.createEl("span");
    a.appendChild(b);
    return a
};
vjs.AdPlayButton.prototype.show = function() {
    this.isAd && this.options_.playlistStarted && (this.Linear.AdPlayButton.el_.style.display = "block")
};
vjs.AdPlayButton.prototype.onClick = function() {
    this.player.play();
    this.player.trigger("RadPlay")
};
vjs.AdPlayButton.prototype.hide = function() {
    return this.el_.style.display = "none"
};
vjs.AdTime = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.hide();
        var c = this;
        a.on("RadEnd", function() {
            this.Linear.AdTime.hide();
            this.Linear.AdTime.el_.childNodes[1].style.width = "0px"
        });
        a.on("RlinearLoaded", function() {
            a.on("timeupdate", c.onTimeUpdate)
        });
        a.on("RadEnd", function() {
            a.off("timeupdate", c.onTimeUpdate)
        });
        a.on("RlinearLoaded", function(a) {
            this.one("durationchange", function() {
                this.isAd && this.Linear.AdTime.show()
            });
            a = this.size();
            this.Linear.AdTime.el_.style.width = a[0] -
                10 + "px"
        })
    }
});
vjs.AdTime.prototype.createEl = function() {
    return vjs.createEl("div", {
        className: "vjs-adtime",
        innerHTML: '<span></span><div class="vjs-adprogress"></div>'
    })
};
vjs.AdTime.prototype.onTimeUpdate = function() {
    var a = this.player_,
        b = a.Linear.AdTime;
    if (!(0 > a.currentTime()) && isFinite(a.currentTime()) && isFinite(a.duration())) {
        var c = a.duration(),
            d = a.currentTime();
        if (a.isAd) {
            var e = vjs.SSToHHMMSS(Math.floor(c) - Math.floor(d)),
                a = e[0],
                f = e[1],
                e = e[2];
            isNaN(a) || isNaN(f) || isNaN(e) || (b.el_.childNodes[0].innerHTML = "Advertisement: <strong>" + (0 < a ? a + ":" : "") + (f + ":" + e + "</strong>"));
            b.el_.childNodes[1].style.width = 100 * d / Math.floor(c) + "%"
        }
    }
};
vjs.Linear = vjs.CoreObject.extend({
    init: function(a, b) {
        this.player_ = a;
        this.options_ = b;
        var c = this;
        c.AdLink = a.addChild("AdLink", {});
        c.AdTime = a.addChild("AdTime", {});
        c.Skip = a.addChild("Skip", {});
        c.AdPlayButton = a.addChild("AdPlayButton", {});
        c.events = {};
        a.on("error", function() {
            c.onError()
        });
        a.on("RskipRequested", function() {
            c.firePing("skip");
            c.firePing("close")
        });
        a.on("ended", function() {
            a.isAd && !c.Skip.forced && c.firePing("complete")
        });
        a.on("RadPlay", function() {
            c.firePing("resume")
        });
        a.on("RadEnd", function() {
            a.off("timeupdate",
                c.onTimeUpdate)
        });
        a.on("RlinearLoaded", function() {
            a.on("timeupdate", c.onTimeUpdate)
        });
        a.on("pause", function() {
            a.isAd && c.firePing("pause")
        });
        a.on("play", function() {
            a.isAd && (299 == a.options_.reEmbed.pings.plid.split("_")[0] && vjs.storageAvailable("localStorage") && window.localStorage.setItem("reEmbedAds", (new Date).getTime()), c.firePing("start"), c.onLoad.apply(c))
        })
    }
});
vjs.Linear.prototype.onTimeUpdate = function() {
    var a = this.player_,
        b = a.Linear,
        c = a.currentTime(),
        d = a.duration();
    if (a.isAd && isFinite(c)) {
        var e = a.Data.adInfo.id;
        if ("undefined" !== typeof e && "undefined" !== typeof a.Vast.ads[e] && d)
            if (a.trigger({
                    type: "RadTimeUpdate",
                    data: {
                        currentTime: c,
                        duration: d
                    }
                }), a = String(a.Vast.ads[e].creatives[0].progress), "undefined" == typeof b.events.progress && (-1 < a.indexOf("%") ? Math.floor(parseInt(a, 10) / 100 * d) == c && b.firePing("progress") : c >= parseInt(a, 10) && b.firePing("progress")), Math.floor(.25 *
                    d) <= c && !b.events.firstQuartile && c < d) b.onFirstQuartile();
            else if (Math.floor(.5 * d) <= c && !b.events.midpoint && c < d) b.onMidPoint();
        else if (Math.floor(.75 * d) <= c && !b.events.thirdQuartile && c < d) b.onThirdQuartile()
    }
};
vjs.Linear.prototype.firePing = function(a) {
    var b = this.player_,
        c = b.Linear;
    if (b.isAd && !c.events[a]) {
        var d = b.Data.adInfo.id;
        if ("undefined" !== typeof d && "undefined" !== typeof b.Vast.ads[d]) {
            c.events[a] = 1;
            b = "impression" == a ? b.Vast.ads[d].impression : "error" == a ? b.Vast.ads[d].error : b.Vast.ads[d].creatives[0].tracking[a];
            if ("undefined" == typeof b) return !1;
            for (a = 0; a < b.length; ++a) "" != b[a] && vjs.createTrackingPixel(b[a])
        }
    }
};
vjs.Linear.prototype.onFirstQuartile = function() {
    var a = this.player_.Linear;
    this.player_.trigger("RlinearFirstQuartile");
    a.firePing("firstQuartile")
};
vjs.Linear.prototype.onMidPoint = function() {
    var a = this.player_.Linear;
    this.player_.trigger("RlinearMidpoint");
    a.firePing("midpoint")
};
vjs.Linear.prototype.onThirdQuartile = function() {
    var a = this.player_.Linear;
    this.player_.trigger("RlinearThirdQuartile");
    a.firePing("thirdQuartile")
};
vjs.Linear.prototype.onLoad = function() {
    var a = this.player_.Linear;
    a.firePing("impression");
    a.firePing("creativeView")
};
vjs.Linear.prototype.onError = function() {
    this.player_.Linear.firePing("error")
};
vjs.Lkqd = vjs.Component.extend({
    init: function(a, b) {
        vjs.Component.call(this, a, b);
        this.hide();
        this.complete = this.loaded = 0;
        this.pingQueue = [];
        var c = a.size();
        this.params = {
            format: 2,
            apt: "auto",
            ear: 100,
            env: 1,
            lkqdid: (new Date).getTime().toString() + Math.round(1E9 * Math.random()).toString(),
            pid: 0,
            sid: 0,
            tagqa: !1,
            elementid: a.id(),
            width: c[0],
            height: c[1],
            mode: "overlay",
            companionid: "",
            rnd: Math.floor(1E8 * Math.random()),
            m: ""
        };
        a.on("Rresize", function() {
            var a = this.size();
            this.Lkqd.params.width = a[0];
            this.Lkqd.params.height =
                a[1]
        });
        window.addEventListener ? window.addEventListener("message", vjs.bind(this, this.eventListener), !1) : window.attachEvent("onmessage", this.eventListener);
        a.one(["play", "RloadLKQD"], this.loadLKQD)
    }
});
vjs.Lkqd.prototype.loadLKQD = function() {
    var a = this.player_;
    a.off(["play", "RloadLKQD"], a.Lkqd.loadLKQD);
    a.on(["play", "timeupdate"], vjs.bind(a, a.Lkqd.keepPaused));
    a.Vast.adsLoaded ? a.Lkqd.checkAd() : (a.trigger("RpreloadAds"), a.one("RadsLoaded", vjs.bind(a.Lkqd, a.Lkqd.checkAd)))
};
vjs.Lkqd.prototype.checkAd = function() {
    if ("undefined" != typeof this.adId) {
        var a = this;
        this.createElement(function() {
            window.postMessage({
                lkqd: !0,
                from: "pub",
                lkqdid: a.params.lkqdid,
                event: "initAd"
            }, "*");
            window.postMessage({
                lkqd: !0,
                from: "pub",
                lkqdid: a.params.lkqdid,
                event: "startAd"
            }, "*")
        })
    } else this.adStopped()
};
vjs.Lkqd.prototype.keepPaused = function() {
    this.pause()
};
vjs.Lkqd.prototype.adLoaded = function() {};
vjs.Lkqd.prototype.adStarted = function() {
    this.adPlaying = 1;
    this.firePing("impression")
};
vjs.Lkqd.prototype.firePing = function(a) {
    if (this.player_.Vast.adsLoaded && "undefined" !== typeof this.adId) {
        var b = this.adId,
            c;
        c = this.pingQueue.pop();
        "undefined" != typeof c && this.firePing(c);
        c = "impression" == a ? this.player_.Vast.ads[b].impression : this.player_.Vast.ads[b].creatives[0].tracking[a];
        if (!c) return !1;
        for (a = 0; a < c.length; ++a) "" != c[a] && vjs.createTrackingPixel(c[a])
    } else this.pingQueue.push(a)
};
vjs.Lkqd.prototype.adClickThru = function() {
    this.firePing("click")
};
vjs.Lkqd.prototype.adStopped = function() {
    this.player_.off(["play", "timeupdate"], this.keepPaused);
    this.adPlaying = 0;
    this.complete = 1;
    this.player_.play()
};
vjs.Lkqd.prototype.adError = function() {};
vjs.Lkqd.prototype.eventListener = function(a) {
    if (a.data && a.data.lkqd && "lkqd" == a.data.from) switch (a.data.event) {
        case "AdLoaded":
            this.adLoaded();
            break;
        case "AdStarted":
            this.adStarted();
            break;
        case "AdClickThru":
            this.adClickThru();
            break;
        case "AdStopped":
            this.adStopped();
            break;
        case "AdError":
            this.adError()
    }
};
vjs.Lkqd.prototype.scriptLoaded = function() {
    this.loaded = 1
};
vjs.Lkqd.prototype.createElement = function(a) {
    var b = vjs.createEl("script", {
        async: !0,
        type: "text/javascript"
    });
    a || (a = function() {});
    var c = this;
    b.onload = function() {
        c.scriptLoaded.apply(c);
        a()
    };
    b.src = vjs.static_.lkqdServer + "?" + vjs.objectToGet(this.params);
    this.el_ = b;
    this.player_.el_.appendChild(this.el_)
};
vjs.NonLinear = vjs.Component.extend({
    init: function(a, b) {
        this.player_ = a;
        this.durationCount = -1;
        this.finished = 0;
        this.lastCheck = -1;
        this.playing = 0;
        this.overIframe = !1;
        this.el_ = this.createEl();
        this.hide();
        this.clickTrack = !1;
        var c = this.player_.options_;
        this.slots = "undefined" == typeof c.nonLinearSlots ? [2] : c.nonLinearSlots;
        this.slot = this.slots[0];
        this.on("click", this.onClick);
        a.on("ended", function() {
            this.nonLinear.onEnded()
        });
        a.on("durationchange", function() {
            if ("undefined" === typeof this.nonLinear.resource) return !1;
            this.nonLinear.resetControlBarSlots.apply(this);
            this.nonLinear.addControlBarSlot.apply(this, [this.nonLinear.slot, this.duration()])
        });
        a.on("RadEnd", function() {
            this.nonLinear.clear()
        });
        a.on("RnonLinearStarted", function() {
            var a = parseInt(vjs.static_.controlBarSize["skin" + (this.options_.reEmbed.skin || 1)].height, 10);
            this.player_.defaultControls() ? "vimeo" == this.player_.techName.toLowerCase() ? this.nonLinear.el_.style.bottom = "50px" : this.nonLinear.el_.style.bottom = 0 : this.nonLinear.el_.style.bottom = a + "px";
            "Youtube" ==
            this.techName && (this.nonLinear.el_.style.backgroundColor = "#000")
        });
        a.one("RplayEnabled", function() {
            var a = this.nonLinear;
            if ("undefined" !== typeof a.resource) {
                var b = a.resource.type.toLowerCase(),
                    b = 0 === b.indexOf("image/") ? "image" : b;
                switch (b) {
                    case "image":
                        a.setAd = function() {
                            vjs.NonLinear.prototype.setAd.apply(a, arguments);
                            vjs.NonLinear.prototype.setImageAd.apply(a, arguments)
                        };
                        break;
                    case "iframe":
                        a.setAd = function() {
                            vjs.NonLinear.prototype.setAd.apply(a, arguments);
                            vjs.NonLinear.prototype.setIframeAd.apply(a,
                                arguments)
                        };
                        break;
                    case "application/x-shockwave-flash":
                        a.setAd = function() {
                            vjs.NonLinear.prototype.setAd.apply(a, arguments);
                            vjs.NonLinear.prototype.setSWFAd.apply(a, arguments)
                        }
                }
            }
        });
        a.on("RadsLoaded", function() {
            this.nonLinear.resetControlBarSlots.apply(this);
            if ("undefined" === typeof this.nonLinear.resource) return !1;
            this.nonLinear.addControlBarSlot.apply(this, [this.nonLinear.slot, this.duration()])
        });
        a.one("play", function() {
            if (!this.Vast.adsLoaded) return a.one("RadsLoaded", function() {
                this.nonLinear.preload()
            }), !1;
            this.nonLinear.preload()
        });
        if (!vjs.IS_IPHONE) a.on("timeupdate", function() {
            if ("undefined" === typeof this.nonLinear.resource) return !1;
            this.nonLinear.onTimeUpdate.apply(this.nonLinear)
        })
    }
});
vjs.NonLinear.prototype.onTimeUpdate = function() {
    var a = this.player_;
    if (a.isAd || a.isLive || a.nonLinear.finished || Math.floor(a.currentTime()) === this.lastCheck) return !1;
    this.lastCheck = Math.floor(a.currentTime());
    if (-1 < this.durationCount && (++this.durationCount, this.durationCount >= this.resource.duration)) return this.clear(), !0;
    if (this.canPlayNonLinear()) return this.el_.style.backgroundColor = "transparent", this.el_.childNodes[0].style.height = a.Vast.ads[this.resource.adId].creatives[0].height + "px", this.el_.childNodes[0].style.width =
        a.Vast.ads[this.resource.adId].creatives[0].width + "px", this.setAd({
            src: a.Vast.filterVariables(this.resource.src),
            clickThrough: a.Vast.ads[this.resource.adId].creatives[0].clicks,
            width: a.Vast.ads[this.resource.adId].creatives[0].width,
            height: a.Vast.ads[this.resource.adId].creatives[0].height
        }), this.playing = 1, this.show(), this.firePing("impression"), this.firePing("creativeView"), this.durationCount = 0, this.trigger("RnonLinearStarted"), a.fixDimensions(0), !0
};
vjs.NonLinear.prototype.canPlayNonLinear = function() {
    return !this.playing && Math.floor(this.player_.currentTime()) >= this.slot && 5 < this.player_.remainingTime() && !this.finished
};
vjs.NonLinear.prototype.createEl = function() {
    var a = vjs.createEl("div", {
        className: "vjs-nonLinear"
    });
    this.hideEl = vjs.createEl("img", {
        className: "vjs-nonLinear-hide",
        src: vjs.static_.closeAds,
        alt: "close"
    });
    this.buffer = vjs.createEl("img", {
        className: "vjs-nonLinear-buffer vjs-hidden"
    });
    this.link = vjs.createEl("a", {
        className: "vjs-nonLinear-link",
        target: "_blank"
    });
    var b = vjs.createEl("div", {
            className: "vjs-nonLinear-linkContainer"
        }),
        c = vjs.createEl("img", {});
    this.iframe = vjs.createEl("iframe", {
        scrolling: "no",
        marginWidth: 0,
        marginHeight: 0,
        frameBorder: 0,
        webkitAllowFullScreen: 0,
        mozallowfullscreen: 0,
        allowFullScreen: 0
    });
    var d = this;
    this.iframe.onmouseover = function() {
        d.overIframe = !0;
        window.focus()
    };
    this.iframe.onmouseout = function() {
        d.overIframe = !1
    };
    window.onblur = function(a) {
        !0 !== d.overIframe || d.clickTrack || (d.clickTrack = !0, d.firePing("click"))
    };
    /MSIE/i.test(vjs.USER_AGENT) || vjs.IS_IE11 || (this.object = vjs.createEl("object", {
            innerHTML: '<param name="bgcolor" value="#fff"><param name="wmode" value="transparent"><param name="quality" value="high">'
        }),
        this.embed = vjs.createEl("embed", {}), this.param = vjs.createEl("param", {
            name: "movie"
        }), this.clickTag = vjs.createEl("param", {
            name: "flashVars"
        }), this.object.appendChild(this.param), this.object.appendChild(this.clickTag), this.object.appendChild(this.embed), this.objectClone = this.object.cloneNode(!0));
    this.link.appendChild(c);
    b.appendChild(this.link);
    b.appendChild(this.iframe);
    b.appendChild(this.hideEl);
    b.appendChild(this.buffer);
    a.appendChild(b);
    return a
};
vjs.NonLinear.prototype.clearObject = function(a) {
    for (var b in a) "function" === typeof a[b] && (a[b] = null)
};
vjs.NonLinear.prototype.clear = function() {
    var a = this.player_,
        b = this.player_.nonLinear;
    if (!b.playing) return !1;
    b.finished = 1;
    b.hide();
    b.durationCount = -1;
    b.clickTrack = !1;
    b.playing = 0;
    a.fixDimensions(0);
    b.overIframe = !1;
    /x-shockwave-flash/i.test(b.resource.type) && (/MSIE/i.test(vjs.USER_AGENT) || vjs.IS_IE11 ? b.clearObject(b.object) : b.objectClone = b.object.cloneNode(!0), b.el_.childNodes[0].removeChild(b.object));
    setTimeout(function() {
        a.trigger("RnonLinearCleared")
    }, 0)
};
vjs.NonLinear.prototype.onClick = function(a) {
    a = vjs.fixEvent(a);
    if (vjs.isDescendant(this.el_.getElementsByTagName("a")[0], a.target)) return this.firePing("click"), !0;
    if ("vjs-nonLinear-hide" == a.target.className) return this.clear(), this.firePing("close"), !0
};
vjs.NonLinear.prototype.onEnded = function() {
    this.clear()
};
vjs.NonLinear.prototype.firePing = function(a) {
    if ("undefined" === typeof this.resource || "undefined" === typeof this.resource.adId) return !1;
    var b = this.resource.adId;
    if ("undefined" === typeof this.player_.Vast.ads[b]) return !1;
    "impression" == a ? (a = this.player_.Vast.ads[b].impression, DEBUG && console.log("IMMMM: " + this.player_.Vast.ads[b].impression)) : a = "error" == a ? this.player_.Vast.ads[b].error : this.player_.Vast.ads[b].creatives[0].tracking[a];
    if (a)
        for (b = 0; b < a.length; ++b) vjs.createTrackingPixel(a[b]);
    return !0
};
vjs.NonLinear.prototype.preload = function() {
    if ("undefined" == typeof this.resource) return !1;
    var a = JSON.parse(JSON.stringify(this.resource)),
        b = a.type;
    if (-1 == b.indexOf("image") && "iframe" != b) return !1;
    "iframe" == b ? (a.width = this.player_.Vast.ads[a.adId].creatives[0].width, a = this.prepareIframeUrl(a), this.iframe.src = a) : this.buffer.src = this.player_.Vast.filterVariables(a.src)
};
vjs.NonLinear.prototype.setImageAd = function(a) {
    this.link.setAttribute("href", a.clickThrough);
    this.link.getElementsByTagName("img")[0].setAttribute("src", a.src);
    this.link.style.display = "block"
};
vjs.NonLinear.prototype.setSWFAd = function(a) {
    if (/MSIE/i.test(vjs.USER_AGENT) || vjs.IS_IE11) {
        if (vjs.IS_IE11) {
            var b = "?"; - 1 < a.src.indexOf("?") && (b = "&");
            this.object = '<embed src="' + a.src + b + "clickTAG=" + encodeURIComponent(a.clickThrough) + '" fullscreen="no" type="application/x-shockwave-flash" ></embed>'
        } else this.object = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param name="movie" value="' + a.src + '"><param name="flashVars" value="clickTAG=' + a.clickThrough + '"><param name="bgcolor" value="#fff"><param name="wmode" value="transparent"><param name="quality" value="high"></object>';
        this.el_.childNodes[0].innerHTML += this.object;
        this.object = this.el_.childNodes[0].getElementsByTagName(vjs.IS_IE11 ? "embed" : "object")[0]
    } else this.el_.childNodes[0].appendChild(this.objectClone), this.object = this.el_.childNodes[0].getElementsByTagName("object")[0], this.object.getElementsByTagName("param")[3].value = a.src, this.object.getElementsByTagName("param")[4].value = "clickTAG=" + a.clickThrough, this.object.getElementsByTagName("embed")[0].width = a.width + "px", this.object.getElementsByTagName("embed")[0].height =
        a.height + "px", this.object.getElementsByTagName("embed")[0].src = a.src, this.object.getElementsByTagName("embed")[0].setAttribute("flashVars", "clickTAG=" + a.clickThrough);
    this.object.width = a.width + "px";
    this.object.height = a.height + "px";
    this.object.style.display = "block"
};
vjs.NonLinear.prototype.setIframeAd = function(a) {
    this.iframe.style.height = a.height + "px";
    this.iframe.style.width = a.width + "px";
    this.iframe.style.display = "block"
};
vjs.NonLinear.prototype.setAd = function(a) {
    this.iframe.style.display = "none";
    this.link.style.display = "none";
    /MSIE/i.test(vjs.USER_AGENT) || vjs.IS_IE11 || (this.object.style.display = "none");
    return !0
};
vjs.NonLinear.prototype.resetControlBarSlots = function() {
    for (var a = vjs.getByClassName(this.controlBar.el_, "vjs-nonLinear-slot"), b = 0; b < a.length; ++b) a[b].parentNode.removeChild(a[b])
};
vjs.NonLinear.prototype.addControlBarSlot = function(a, b) {
    if (0 == Math.floor(b)) return !1;
    var c = vjs.createEl("div", {
        className: "vjs-nonLinear-slot"
    });
    c.style.left = 100 * a / Math.floor(b) + "%";
    this.controlBar.progressControl.el_.childNodes[0].appendChild(c)
};
vjs.NonLinear.prototype.scaleResource = function(a) {
    var b = this.player_.size();
    if (a.creatives[0].width > b[0]) {
        if (!a.creatives[0].scalable) return !1;
        b = b[0];
        a.creatives[0].height = a.creatives[0].height / a.creatives[0].width * b;
        a.creatives[0].width = b
    }
    return a
};
vjs.NonLinear.prototype.prepareIframeUrl = function(a) {
    var b = a.src;
    if (-1 < b.indexOf(vjs.static_.adsense)) {
        var c = this.player_.techName.toLowerCase(),
            d = (c = this.player_.Data.getCachedData(c, this.player_.sourceTech.src)) ? c.description : "";
        a = ["?aw=" + a.width, "&videoid=" + this.player_.Pings.pingParams.video_code, "&provider=" + this.player_.Pings.pingParams.video_provider, "&age=" + (c.restrictions && c.restrictions.age ? "1" : "0"), "&pTitle=" + this.player_.Pings.pingParams.pTitle, "&vTitle=" + encodeURIComponent(c ? c.title :
            ""), "&rurl=" + this.player_.Pings.pingParams.rurl, "&pDesc=" + this.player_.Pings.pingParams.pDesc, "&vDesc=" + encodeURIComponent(d)];
        for (var c = b.length, d = /MSIE 8|MSIE 9/i.test(vjs.USER_AGENT) ? 2E3 : 3E3, e, f = 0, g = a.length; f < g; f++)
            if (e = a[f].length, "" != a[f].split("=")[1]) {
                c += e;
                if (c > d) break;
                b += a[f]
            }
    }
    return b
};
vjs.Skip = vjs.Button.extend({
    init: function(a, b) {
        vjs.Button.call(this, a, b);
        var c = this;
        c.count = {};
        c.count.prevSec = -1;
        c.forced = 0;
        a.on("RlinearLoaded", function() {
            a.on("timeupdate", c.onTimeUpdate);
            a.on("durationchange", c.onDurationChange)
        });
        a.on("RadEnd", function() {
            a.off("timeupdate", c.onTimeUpdate);
            a.off("durationchange", c.onDurationChange)
        });
        a.on("RadEnd", function() {
            c.hide()
        });
        a.on("RlinearLoaded", function(a) {
            c.setup(a.data.id, a.data.type, a.data.skip); - 1 === c.count.left && c.hide()
        });
        a.on("ended", function() {
            c.count.left = -2
        })
    }
});
vjs.Skip.prototype.onDurationChange = function() {
    var a = this.player_,
        b = a.Linear.Skip;
    a.duration() <= b.count.left && a.duration() && (b.hide(), b.count.left = -1)
};
vjs.Skip.prototype.createEl = function() {
    var a = vjs.createEl("div", {
            className: "vjs-skip"
        }),
        b = vjs.createEl("span", {
            className: "skip"
        });
    this.poster = vjs.createEl("span", {
        className: "vjs-skip-poster",
        innerHTML: '<img src="" alt="" />'
    });
    b.innerHTML = "Skip in 0";
    a.appendChild(b);
    a.appendChild(this.poster);
    return a
};
vjs.Skip.prototype.onClick = function() {
    var a = this.player_,
        b = a.Linear.Skip;
    if (-2 < b.count.left || !a.isAd) return DEBUG && console.log("unable to skip"), !1;
    a.pause();
    b.forced = 1;
    a.trigger("RskipRequested");
    a.trigger("ended");
    b.forced = 0
};
vjs.Skip.prototype.onTimeUpdate = function() {
    var a = this.player_,
        b = a.Linear.Skip;
    if (!a.isAd) return b.count.left = -2, !1;
    if (a.remainingTime() <= b.count.left) return Math.floor(a.currentTime()) && (b.count.left = -1), !1;
    a = Math.floor(a.currentTime());
    if (0 > b.count.left || a == b.count.prevSec) return !1;
    b.count.prevSec = a;
    0 < b.count.left ? (b.el_.getElementsByTagName("span")[0][vjs.text] = "Skip in " + b.count.left, --b.count.left) : 0 == b.count.left && (b.el_.getElementsByTagName("span")[0][vjs.text] = "Skip", b.count.left = -2);
    b.show()
};
vjs.Skip.prototype.setup = function(a, b, c) {
    var d = this.player_;
    a = d.Linear.Skip;
    a.type = b;
    a.count.left = c;
    "preroll" == a.type ? (b = d.poster(), "undefined" === typeof b ? a.poster.style.display = "none" : (a.poster.getElementsByTagName("img")[0].src = b, a.poster.style.display = "block")) : a.poster.style.display = "none";
    return !0
};
vjs.Vast = vjs.Component.extend({
    init: function(a, b) {
        this.player_ = a;
        this.mainVideo = a.options_.sources;
        this.vastXML = !1;
        this.vastURLQ = [this.prepareVastURL()];
        this.ads = [];
        this.adsLoaded = 0;
        this.startOnLoad = this.pending = !1;
        this.wrapperTracking = {};
        this.videoAds = 0;
        a.blockPlay = !0;
        this.requested = [];
        this.proxyUrl = vjs.static_.vastServer;
        b = this.player_.options_;
        var c = this.player_.size(),
            d = vjs.getWindow();
        this.variables = [{
                tags: ["__page-url__", "[page_url]", "{{page_url}}", "[LR_URL]", "%%SITE%%"],
                value: encodeURIComponent(vjs.getPageUrl())
            },
            {
                tags: ["__page-title__", "[page_title]", "{{page_title}}", "[LR_TITLE]"],
                value: encodeURIComponent(vjs.getPageTitle())
            }, {
                tags: ["__random-number__", "[random_number]", "{{random}}"],
                value: Math.floor(1E12 * Math.random())
            }, {
                tags: ["[RANDOM]"],
                value: Math.floor(1E4 * Math.random())
            }, {
                tags: ["__player-width__", "[player_width]", "{{width}}", "[LR_WIDTH]", "%%WIDTH%%"],
                value: c[0]
            }, {
                tags: ["__player-height", "[player_height]", "{{height}}", "[LR_HEIGHT]", "%%HEIGHT%%"],
                value: c[1]
            }, {
                tags: ["__item-duration__", "[video_duration]",
                    "[LR_DURATION]", "%%VIDEO_DURATION%%"
                ],
                value: a.duration()
            }, {
                tags: ["__item-file__", "[media_file_url]", "[LR_VIDEO_ID]", "%%VIDEO_ID%%"],
                value: a.cache_.src
            }, {
                tags: ["__timestamp__", "[TIMESTAMP]", "[CACHEBUSTER]", "%%CACHEBUSTER%%", "%25%25CACHEBUSTER%25%25"],
                value: (new Date).getTime()
            }, {
                tags: ["__domain__", "[LR_URL_HOST]"],
                value: document.location.host
            }, {
                tags: ["__referrer__"],
                value: encodeURIComponent(document.referrer)
            }, {
                tags: ["[reEmbed_custom_vast_param]"],
                value: d.reEmbed_custom_vast_param
            }, {
                tags: ["[gwdTagDataAdGroup]"],
                value: function() {
                    return d.gwdTagDataAdGroup
                }
            }, {
                tags: ["[gwdTagDataBlob]"],
                value: function() {
                    return d.gwdTagDataBlob
                }
            }
        ];
        this.preslots = "undefined" == typeof b.preslots ? 1 : b.preslots;
        this.postslots = "undefined" == typeof b.postslots ? 1 : b.postslots;
        a.one("RstartRequested", function() {
            this.Vast.startOnLoad = !0;
            this.Vast.fetchAds.apply(this.Vast, [this.Vast.vastURLQ.shift()])
        });
        a.one("RpreloadAds", function() {
            this.Vast.fetchAds.apply(this.Vast, [this.Vast.vastURLQ.shift()])
        });
        a.on("RadError", function() {
            this.Linear.onError();
            this.noTech = !1
        });
        a.on("RdisableLinears", function() {
            this.Vast.disableLinears()
        });
        if (299 != b.reEmbed.pings.plid.split("_")[0] && !a.options_.reEmbed.vidpulseSiteId) a.one("mouseover", function() {
            this.trigger("RpreloadAds")
        });
        vjs.IS_MOBILE && !a.hasNegativePlid() && this.disableLinears();
        this.checkForAdblock()
    }
});
vjs.Vast.prototype.checkForAdblock = function() {
    var a = vjs.createEl("div", {
        className: "textads"
    });
    a.style.cssText = "height: 10px !important; width: 10px !important; z-index: -1; position: absolute;";
    this.player_.el_.appendChild(a);
    var b = this.player_;
    setTimeout(function() {
        b.hasAdBlock = a.offsetWidth || a.offsetHeight ? !1 : !0;
        a.parentNode.removeChild(a)
    }, 10)
};
vjs.Vast.prototype.disableLinears = function() {
    this.postslots = this.preslots = 0
};
vjs.Vast.prototype.filterAS = function(a) {
    var b = this.player_,
        c = vjs.getWindow(),
        b = b.options_.reEmbed.pings.plid.split("_")[0];
    if (-1 < [2179, 299].indexOf(+b) && c.reembed_ASPQ) {
        var b = -1 < a.indexOf("?"),
            d = c.reembed_ASPQ;
        c.reembed_ASPQ = void 0;
        c["ASPQ_" + d] && (a += (b ? "&" : "?") + "aspq=" + encodeURIComponent(c["ASPQ_" + d]))
    }
    return a
};
vjs.Vast.prototype.reachedStorageCap = function() {
    if (!vjs.storageAvailable("localStorage")) return !1;
    var a = window.localStorage.getItem("reEmbedAds");
    return a ? 3E5 < (new Date).getTime() - a ? (window.localStorage.removeItem("reEmbedAds"), !1) : !0 : !1
};
vjs.Vast.prototype.fetchAds = function(a, b) {
    var c = this.player_,
        d = c.Vast;
    if (c.options_.hasAds && !d.adsLoaded && !d.pending) {
        if (299 == c.options_.reEmbed.pings.plid.split("_")[0] && d.reachedStorageCap()) return d.jsonpResponse(), !1;
        d.pending = !0;
        if (!a || -1 < d.requested.indexOf(a) || d.requested.length >= vjs.maxVASTRequests) return d.jsonpResponse(), !1;
        d.requested.push(a);
        b ? vjs.get(a, function(b) {
            d.jsonpResponse(null, {
                vastXML: b
            }, a)
        }, function(b) {
            vjs.get(a, function(b) {
                d.jsonpResponse(null, {
                    vastXML: b
                }, a)
            }, function(a) {
                d.jsonpResponse()
            }, !1, 2E3)
        }, !0, 2E3) : (a = d.filterAS(a), vjs.jsonp(a, vjs.bind(d, d.jsonpResponse), 2E3));
        return !0
    }
    return !d.pending && c.blockPlay ? (d.enablePlay(), !0) : !1
};
vjs.Vast.prototype.prepareVastURL = function() {
    var a = this.player_,
        b = a.options_,
        a = a.size(),
        b = b.reEmbed.pings.plid.split("_");
    return vjs.static_.vastServer + "?uid=" + b[0] + "&pid=" + b[1] + "&w=" + a[0] + "&h=" + a[1] + "&m=" + (vjs.IS_MOBILE ? "1" : "0") + "&ts=" + (new Date).getTime()
};
vjs.Vast.prototype.jsonpResponse = function(a, b, c) {
    a = this.player_;
    var d = a.Vast;
    d.pending = !1;
    if (!b && !d.adsLoaded || d.adsLoaded) {
        if (!b && !d.adsLoaded && d.vastURLQ.length) return d.fetchAds.apply(d, [d.vastURLQ.shift(), !0]), !1;
        d.setAdsLoaded();
        a.blockPlay && d.enablePlay();
        return !1
    }
    d.vastXML = b.vastXML;
    d.setupAds(c)
};
vjs.Vast.prototype.enablePlay = function() {
    this.player_.blockPlay = !1;
    this.startOnLoad && this.player_.trigger("RplayEnabled")
};
vjs.Vast.prototype.setAdsLoaded = function() {
    this.adsLoaded = 1;
    this.player_.trigger("RadsLoaded")
};
vjs.Vast.prototype.filterVariables = function(a) {
    var b, c, d, e;
    for (b = 0; b < this.variables.length; ++b)
        for (c = 0; c < this.variables[b].tags.length; ++c) d = new RegExp(RegExp.quote(this.variables[b].tags[c]), "gi"), e = this.variables[b].value, "function" == typeof e && (e = e()), a = a.replace(d, e);
    return a
};
vjs.Vast.prototype.setupAds = function(a) {
    if (!this.vastXML) return this.setAdsLoaded(), this.enablePlay(), !1;
    var b = vjs.xml2Dom(this.vastXML);
    if (!b) return this.setAdsLoaded(), this.enablePlay(), !1;
    var b = b.getElementsByTagName("Ad"),
        c = [],
        d, e, f, g, k, h = [];
    for (d = 0; d < b.length; d++) e = this.adIsWrapper(b[d]), k = k || e, e ? (f = this.parseTag(b[d], "Impression"), g = this.parseTag(b[d], "Error"), e = vjs.trim(this.filterVariables(vjs.extractCDATA(b[d].getElementsByTagName("VASTAdTagURI")[0]))), this.wrapperTracking[e] = {}, a && this.wrapperTracking[a] ?
        (this.wrapperTracking[e].impression = "undefined" != typeof this.wrapperTracking[a].impression ? vjs.mergeUnique(f, this.wrapperTracking[a].impression) : f, this.wrapperTracking[e].error = "undefined" != typeof this.wrapperTracking[a].error ? vjs.mergeUnique(g, this.wrapperTracking[a].error) : g) : (this.wrapperTracking[e].impression = f, this.wrapperTracking[e].error = g), this.wrapperTracking[e].tracking = this.getWrapperCreatives(b[d], a), h.push(e)) : c[d] = this.parseAdObject(b[d], d, a);
    k && (this.vastURLQ = h.concat(this.vastURLQ));
    if (k || !b.length) return this.fetchAds.apply(this, [this.vastURLQ.shift(), !0]), !1;
    this.ads = c;
    this.distributeAds();
    this.setAdsLoaded();
    this.enablePlay()
};
vjs.Vast.prototype.parseAdObject = function(a, b, c) {
    var d = {};
    d.creatives = this.getCreatives(a, b, c);
    d.impression = this.parseTag(a.getElementsByTagName("InLine")[0], "Impression");
    d.error = this.parseTag(a.getElementsByTagName("InLine")[0], "Error");
    this.wrapperTracking[c] && (d.impression = vjs.mergeUnique(this.wrapperTracking[c].impression ? vjs.cloneObject(this.wrapperTracking[c].impression) : [], d.impression), d.error = vjs.mergeUnique(this.wrapperTracking[c].error ? vjs.cloneObject(this.wrapperTracking[c].error) : [],
        d.error));
    return d
};
vjs.Vast.prototype.distributeAds = function() {
    for (var a = this.preslots, b = this.postslots, c = 0; c < this.ads.length && 0 < a; ++c) "linear" == this.ads[c].creatives[0].type && (this.player_.Playlist.insertBeforeMain(this.ads[c].creatives[0].mediaFiles), --a, ++this.videoAds);
    if (0 >= a)
        for (; c < this.ads.length && 0 < b; ++c) "linear" == this.ads[c].creatives[0].type && (this.player_.Playlist.insertEnd(this.ads[c].creatives[0].mediaFiles), --b, ++this.videoAds);
    for (c = 0; c < this.ads.length; ++c)
        if ("nonlinear" == this.ads[c].creatives[0].type && (a =
                this.player_.nonLinear.scaleResource(vjs.cloneObject(this.ads[c])))) {
            this.ads[c] = a;
            this.player_.nonLinear.resource = this.ads[c].creatives[0].resource;
            this.player_.nonLinear.resource.adId = c;
            break
        }
};
vjs.Vast.prototype.adIsWrapper = function(a) {
    return 0 < a.getElementsByTagName("Wrapper").length
};
vjs.Vast.prototype.getWrapperCreatives = function(a, b) {
    var c, d = {},
        e, f = {
            linear: {
                click: [],
                tracking: {}
            },
            nonlinear: {
                click: [],
                tracking: {}
            }
        },
        g;
    this.wrapperTracking[b] && this.wrapperTracking[b].tracking && (d = vjs.cloneObject(this.wrapperTracking[b].tracking));
    var k = a.getElementsByTagName("Creative");
    for (g = 0; g < k.length; g++) c = k[g].getElementsByTagName("Linear"), e = k[g].getElementsByTagName("NonLinearAds"), 0 < c.length ? (f.linear.tracking = this.parseTrackingEvents(c[0].getElementsByTagName("TrackingEvents")[0]), c = c[0].getElementsByTagName("ClickTracking")[0],
        "undefined" != typeof c && null != c && (f.linear.click = [vjs.extractCDATA(c)])) : 0 < e.length && (f.nonlinear.tracking = this.parseTrackingEvents(e[0].getElementsByTagName("TrackingEvents")[0]), c = e[0].getElementsByTagName("NonLinearClickTracking")[0], "undefined" != typeof c && null != c && (f.nonlinear.click = [vjs.extractCDATA(c)]));
    var h, k = ["linear", "nonlinear"];
    for (g = 0; g < k.length; ++g)
        if (d[k[g]])
            if (d[k[g]].click = vjs.mergeUnique(d[k[g]].click, f[k[g]].click), d[k[g]].tracking)
                for (h in f[k[g]].tracking) d[k[g]].tracking[h] =
                    vjs.mergeUnique(d[k[g]].tracking[h], f[k[g]].tracking[h]);
            else d[k[g]].tracking = f[k[g]].tracking;
    else d[k[g]] = f[k[g]];
    return d
};
vjs.Vast.prototype.getCreatives = function(a, b, c) {
    for (var d = [], e, f, g, k, h = a.getElementsByTagName("Creative"), p = 0; p < h.length; p++)
        if (k = h[p].getElementsByTagName("Linear"), e = h[p].getElementsByTagName("NonLinearAds"), a = {}, k.length || e.length) {
            if (0 < k.length) {
                a.tracking = this.parseTrackingEvents(k[0].getElementsByTagName("TrackingEvents")[0]);
                f = k[0].getElementsByTagName("ClickTracking")[0];
                a.duration = this.parseDuration(k[0]);
                a.adParameters = this.parseAdParameters(k[0].getElementsByTagName("AdParameters")[0]);
                a.clicks = this.parseVideoClicks(k[0].getElementsByTagName("VideoClicks")[0]);
                a.progress = this.parseProgress(k[0].getElementsByTagName("TrackingEvents")[0]);
                a.mediaFiles = this.parseMediaFiles(k[0].getElementsByTagName("MediaFiles")[0], b);
                for (e = 0; e < a.mediaFiles.length; e++) a.mediaFiles[e].adParameters = a.adParameters;
                e = k[0].getAttribute("skipoffset");
                a.skip = e ? parseInt(vjs.HHMMSSToSS(e), 10) : -1;
                a.type = "linear"
            } else 0 < e.length && (k = e[0].getElementsByTagName("NonLinear")[0], a.tracking = this.parseTrackingEvents(e[0].getElementsByTagName("TrackingEvents")[0]),
                f = e[0].getElementsByTagName("NonLinearClickTracking")[0], a.resource = {}, 0 < k.getElementsByTagName("StaticResource").length ? (a.clicks = vjs.extractCDATA(k.getElementsByTagName("NonLinearClickThrough")[0]), a.resource.src = vjs.extractCDATA(k.getElementsByTagName("StaticResource")[0]), a.resource.type = k.getElementsByTagName("StaticResource")[0].getAttribute("creativeType")) : 0 < k.getElementsByTagName("IFrameResource").length && (a.resource.src = vjs.extractCDATA(k.getElementsByTagName("IFrameResource")[0]), a.resource.type =
                    "iframe"), k = k.getAttribute("minSuggestedDuration"), a.resource.duration = k && "undefined" !== typeof k ? vjs.HHMMSSToSS(k) : 15, a.width = e[0].getElementsByTagName("NonLinear")[0].getAttribute("width"), a.height = e[0].getElementsByTagName("NonLinear")[0].getAttribute("height"), a.scalable = 1, a.type = "nonlinear");
            "undefined" != typeof f && null != f && (a.tracking.click = [vjs.extractCDATA(f)]);
            if (this.wrapperTracking[c] && this.wrapperTracking[c].tracking && this.wrapperTracking[c].tracking[a.type]) {
                for (g in this.wrapperTracking[c].tracking[a.type].tracking) a.tracking[g] =
                    vjs.mergeUnique(a.tracking[g], this.wrapperTracking[c].tracking[a.type].tracking[g]);
                a.tracking.click = vjs.mergeUnique(a.tracking.click, this.wrapperTracking[c].tracking[a.type].click)
            }
            d.push(a)
        }
    return d
};
vjs.Vast.prototype.parseMediaFiles = function(a, b) {
    if (!a || "undefined" === typeof a.getElementsByTagName) return [];
    for (var c = a.getElementsByTagName("MediaFile"), d = [], e, f = 0; f < c.length; ++f) {
        e = !1;
        if ("VPAID" === c[f].getAttribute("apiFramework")) e = !0;
        else if ("LKQD" === c[f].getAttribute("apiFramework")) return this.player_.Lkqd.adId = b, this.player_.Lkqd.params.sid = parseInt(c[f].getAttribute("sid"), 10), this.player_.Lkqd.params.pid = parseInt(c[f].getAttribute("pid"), 10), [];
        d[f] = {};
        d[f].width = c[f].getAttribute("width");
        d[f].height = c[f].getAttribute("height");
        e ? (d[f].vType = c[f].getAttribute("type"), d[f].type = "video/vpaid") : d[f].type = "video/x-mp4" == c[f].getAttribute("type") ? "video/mp4" : c[f].getAttribute("type");
        d[f].ad = 1;
        d[f].adId = b;
        d[f].src = vjs.trim(vjs.extractCDATA(c[f]));
        "video/x-flv" == d[f].type && -1 < d[f].src.indexOf("www.youtube.com") && (d[f].type = "video/youtube", d[f].src = d[f].src.replace(/https?:\/\/www\.youtube\.com\/watch\?v=/, ""))
    }
    return d
};
vjs.Vast.prototype.parseVideoClicks = function(a) {
    if (!a || "undefined" === typeof a.childNodes) return {};
    var b = {};
    a = a.childNodes;
    for (var c = 0; c < a.length; ++c) "undefined" != typeof a[c].tagName && (b[a[c].tagName] = this.filterVariables(vjs.extractCDATA(a[c])));
    return b
};
vjs.Vast.prototype.parseAdParameters = function(a) {
    return a ? (a = vjs.extractCDATA(a)) ? a : "" : ""
};
vjs.Vast.prototype.parseProgress = function(a) {
    if (!a || "undefined" === typeof a.getElementsByTagName) return 0;
    a = a.getElementsByTagName("Tracking");
    for (var b = 0; b < a.length; ++b)
        if ("progress" == a[b].getAttribute("event")) {
            a = a[b].getAttribute("offset");
            if (!a) break;
            return -1 < a.indexOf("%") ? a : vjs.HHMMSSToSS(a)
        }
    return 0
};
vjs.Vast.prototype.parseTrackingEvents = function(a) {
    if (!a || "undefined" === typeof a.getElementsByTagName) return {};
    var b = {};
    a = a.getElementsByTagName("Tracking");
    for (var c = 0; c < a.length; ++c) b[a[c].getAttribute("event")] = [this.filterVariables(vjs.extractCDATA(a[c]))];
    return b
};
vjs.Vast.prototype.parseDuration = function(a) {
    if (!a || "undefined" === typeof a.getElementsByTagName) return !1;
    a = vjs.extractCDATA(a.getElementsByTagName("Duration")[0]) || vjs.extractCDATA(a.getElementsByTagName("Duration"));
    return vjs.HHMMSSToSS(a)
};
vjs.Vast.prototype.parseTag = function(a, b) {
    for (var c = [], d = a.getElementsByTagName(b), e = 0; e < d.length; ++e) c.push(this.filterVariables(vjs.trim(vjs.extractCDATA(d[e]))));
    return c
};
vjs.ControlBar.prototype.autoSlide = function() {
    "undefined" != typeof this.slideControlBar && clearTimeout(this.slideControlBar);
    this.stopSlide = 1;
    this.el_.style.bottom = "0px";
    var a = this;
    this.slideControlBar = setTimeout(function() {
        if (vjs.hasClass(a.player_.el_, "vjs-sliding") || vjs.hasClass(a.el_, "vjs-mouseover")) return a.autoSlide(), !1;
        if (!a.player_.isFullscreen() || "none" != a.Toolkit.el_.childNodes[0].style.display) return !1;
        a.stopSlide = 0;
        a.slideDown()
    }, 2E3)
};
vjs.ControlBar.prototype.slideDown = function() {
    var a = this,
        b = setInterval(function() {
            if ("-45" > 1 * a.el_.style.bottom.split("px")[0] || a.stopSlide) return clearInterval(b), !1;
            a.el_.style.bottom = 1 * a.el_.style.bottom.split("px")[0] - 10 + "px"
        }, 50);
    return !0
};
vjs.LoadingSpinner.prototype.fixPosition = function() {
    if ("undefined" === typeof this.tech.el_) return !1;
    var a = parseInt(this.tech.el_.style.marginTop),
        b, c = this.options_.reEmbed.skin || 1;
    this.isAd ? (b = this.size()[1], this.loadingSpinner.el_.style.top = b / 2 + "px") : (b = this.size()[1] - a, b -= this.defaultControls() ? 0 : parseInt(vjs.static_.controlBarSize["skin" + c].height, 10), this.loadingSpinner.el_.style.top = b / 2 + a + "px")
};
vjs.Player.prototype.size = function() {
    var a, b;
    window._X_REM_NEST ? (a = window.innerHeight || this.el_.offsetHeight, b = window.innerWidth || this.el_.offsetWidth) : (a = this.el_.offsetHeight, b = this.el_.offsetWidth);
    if ("undefined" == typeof a || "undefined" == typeof b) b = this.options_.width, a = this.options_.height;
    return [b, a]
};
vjs.Player.prototype.jsonpRequest = function(a, b, c, d, e, f) {
    if (!(this instanceof vjs.Player)) return this.player_.jsonpRequest.apply(this.player_, arguments), !1;
    var g = null;
    if (!a || "" === a || "string" !== typeof a) return !1;
    var k = this.player_;
    k.trigger("RjsonpRequestCall");
    var h = (new Date).getTime() + String(Math.floor(1E4 * Math.random()));
    "undefined" == typeof this.jsonpCallback && (this.jsonpCallback = {});
    this.jsonpCallback["request" + h] = function(a) {
        for (var c = b.split("."), d = window.vjs.players[k.id_][c[0]], e = d, g = 1; g < c.length; ++g) e =
            e[c[g]];
        a instanceof Object && (a.remExtraParams = f);
        e.apply(d, [a]);
        delete this["request" + h]
    };
    a = 0 <= a.indexOf("?") ? a + "&" : a + "?";
    a += "callback=vjs.players." + this.player_.id_ + ".jsonpCallback.request" + h;
    try {
        g = HTMLDocument.prototype.createElement.call(document, "script")
    } catch (l) {
        g = document.createElement("script")
    }
    g.className = "request" + h;
    g.setAttribute("src", a);
    var p = 0;
    g.onload = function() {
        p = 1
    };
    g.onreadystatechange = function() {
        "loaded" != g.readyState || p || (p = 1, setTimeout(function() {
            k.jsonpCallback[g.className] &&
                (delete k.jsonpCallback[g.className], c && c.apply(k, [{
                    type: "error"
                }]))
        }, 10))
    };
    g.onerror = function(a) {
        p || (p = 1, c && c.apply(k, [a]))
    };
    "undefined" == typeof e && (e = 3E3);
    setTimeout(function() {
        p || (p = 1, g.parentNode.removeChild(g), d && d.apply(k))
    }, parseInt(e, 10));
    return this.el_.appendChild(g)
};
vjs.Player.prototype.setVolume = function() {
    "undefined" == typeof this.player_.volumeLevel && (this.player_.volumeLevel = this.player_.tag && "VIDEO" == this.player_.tag.tagName && this.player_.tag.muted ? 0 : 1, this.player_.on("volumechange", function() {
        this.volumeLevel = this.volume()
    }));
    "undefined" == typeof this.player_.mutedFlag && (this.player_.mutedFlag = 0, this.player_.options_.muted && (this.player_.mutedFlag = 1), this.player_.on("volumechange", function() {
        this.mutedFlag = this.muted()
    }));
    this.player_.mutedFlag || this.player_.volume(this.player_.volumeLevel);
    this.player_.muted(this.player_.mutedFlag);
    return !0
};
vjs.Player.prototype.trackViewport = function() {
    function a(a) {
        b.viewportCheckEnabled && ("click" != a.type || vjs.isDescendant(b.controlBar.volumeControl.el_, a.target) || vjs.isDescendant(b.controlBar.muteToggle.el_, a.target) || b.muted(0), b.viewportCheckEnabled = !1)
    }
    var b = this.player_;
    b.viewportCheckEnabled = !0;
    b.one(["durationchange", "timeupdate", "play"], function() {
        b.viewportCheckEnabled && b.muted(1)
    });
    b.controlBar.one("click", a);
    b.controlBar.volumeControl.volumeBar.one("mousedown", a);
    b.one(["click", "ended"],
        a);
    b.checkViewport();
    vjs.on(vjs.getDoc(), "scroll", vjs.bind(b, b.checkViewport))
};
vjs.Player.prototype.checkViewport = function() {
    var a = this.player_;
    if (window && a.viewportCheckEnabled)
        if (70 < a.proportionInViewport()) a.viewportPlay ? a.play() : (a.firstClick = !0, a.startProcess(), a.viewportPlay = !0);
        else try {
            a.pause()
        } catch (b) {}
};
vjs.Player.prototype.proportionInViewport = function() {
    var a = this.player_,
        b = window._X_REM_NEST ? window.iframeElement : a.el_,
        a = a.size(),
        c = vjs.getWindow(),
        d = b.getBoundingClientRect().top,
        b = b.getBoundingClientRect().bottom;
    return 0 <= d && d < c.innerHeight || 0 < b && b <= c.innerHeight ? (b = Math.min(c.innerHeight, b) - Math.max(0, d), Math.min(100, b / a[1] * 100)) : 0 > d && b > c.innerHeight ? 100 : 0
};
vjs.Player.prototype.trackResize = function() {
    var a = this.player_;
    if ("undefined" != typeof a.sizeFixInterval || window._X_REM_NEST) {
        if (window._X_REM_NEST) vjs.on(window, "resize", function() {
            setTimeout(function() {
                a.setPosition();
                a.trigger("Rresize")
            }, 60)
        });
        return !1
    }
    var b = [],
        b = [a.options_.width, a.options_.height],
        c = parseInt(vjs.static_.controlBarSize["skin" + (this.options_.reEmbed.skin || 1)].height, 10),
        d = a.options_.height,
        d = d - (parseInt(a.options_.reEmbed.behavior, 10) ? 0 : parseInt(a.options_.reEmbed.pady, 10) + c),
        e = a.options_.width / d;
    this.sizeFixInterval = setInterval(function() {
        if (a.el_.offsetWidth != b[0] || a.el_.offsetHeight != b[1]) a.isFullscreen() || (b[0] != a.el_.offsetWidth ? a.el_.style.height = a.options_.reEmbed.behavior ? a.el_.offsetWidth / e + "px" : a.el_.offsetWidth / e + parseInt(a.options_.reEmbed.pady, 10) + c + "px" : b[1] != a.el_.offsetHeight && (a.el_.style.width = a.options_.reEmbed.behavior ? a.el_.offsetHeight * e + "px" : (a.el_.offsetHeight - c - a.options_.reEmbed.pady) * e + "px")), b = [a.el_.offsetWidth, a.el_.offsetHeight], a.trigger("Rresize"),
            setTimeout(function() {
                a.setPosition()
            }, vjs.IS_IE11_PHONE ? 200 : 0)
    }, 100)
};
vjs.Player.prototype.fixStyles = function() {
    if (!(this instanceof vjs.Player)) return this.player_.fixStyles.apply(this.player_), !1;
    this.options_.reEmbed.noSharing && this.addClass("vjs-no-sharing");
    this.options_.reEmbed.noBranding && this.addClass("vjs-no-branding");
    var a = 1;
    "undefined" !== typeof this.options_.reEmbed.skin && (a = +this.options_.reEmbed.skin);
    /vjs-skin/i.test(this.el_.className) || vjs.addClass(this.el_, "vjs-skin" + a);
    if (vjs.loadedStyles) return !1;
    vjs.loadedStyles = !0;
    var b = [this.options_.reEmbed.color1,
            this.options_.reEmbed.color2, this.options_.reEmbed.color3, this.options_.reEmbed.color4
        ],
        c;
    c = -1 < [2, 3, 4, 5, 6].indexOf(a) ? b[3] : b[0];
    var a = ".video-js .vjs-control-bar, .video-js .vjs-control-bar li { color: " + b[1] + " !important; } .video-js .vjs-control-bar span { color: " + b[1] + " !important; } .video-js .vjs-play-progress, .video-js .vjs-volume-level { background-color: " + b[2] + " !important; } .video-js .vjs-control-bar, .video-js, .video-js .vjs-adprogress, .video-js .vjs-volume-control.vjs-vertical-volume { background-color: " +
        b[0] + " !important;} ",
        a = a + (".video-js.vjs-skin2 .vjs-control:before,.video-js.vjs-skin3 .vjs-control:before{ background-color:" + b[3] + " !important; }"),
        a = a + (".video-js.vjs-skin4 .vjs-control.vjs-play-control:before{ background-color:" + b[3] + " !important; }"),
        a = a + (".video-js.vjs-skin5 .vjs-control.vjs-play-control:before, .video-js.vjs-skin5 .vjs-toolkit, .video-js.vjs-skin5 .vjs-mute-control, .video-js.vjs-skin5 .vjs-volume-control, .video-js.vjs-skin5 .vjs-fullscreen-control{ background-color:" + b[3] +
            " !important; }"),
        a = a + (".video-js.vjs-skin6 .vjs-control:before{ border-color:" + b[3] + " !important; }"),
        a = a + (".video-js.vjs-skin6 .vjs-control:after { color:" + b[3] + " !important; }"),
        d = vjs.colors.getBrighterColor(this.options_.reEmbed),
        a = a + (".video-js:hover .rem-play-mini { background:" + d + " !important; }") + (".video-js .vjs-share-options ul li:hover { background:" + d + " !important; }") + (".video-js .vjs-end-options:hover { color:" + d + " !important; }") + (".video-js .vjs-end-screen .vjs-end-screen-gallery-close:hover { background:" +
            d + " !important; }") + (".video-js .vjs-end-options.vjs-inline-replay:hover { background:" + d + " !important; color: #fff !important; }"),
        e = vjs.colors.tweakShadows(b[1], b[0]),
        d = vjs.colors.tweakShadows(b[1], c),
        f = vjs.colors.tweakShadows(b[1], c, !0),
        b = vjs.multiLine([".video-js .vjs-duration-display,", ".video-js .vjs-live,", ".video-js .vjs-current-time-display,", "{", "text-shadow: 1px 1px 1px " + e + "!important;", "-webkit-text-shadow: 1px 1px 1px " + e + "!important;", "-moz-text-shadow: 1px 1px 1px " + e + "!important;",
            "}"
        ]);
    c = vjs.multiLine([".video-js .vjs-control:before", "{", "text-shadow: 1px 1px 1px " + d + "!important;", "-webkit-text-shadow: 1px 1px 1px " + d + "!important;", "-moz-text-shadow: 1px 1px 1px " + d + "!important;", "}"]);
    d = vjs.multiLine([".video-js .vjs-control:hover:before", "{", "color: " + f + "!important;", "text-shadow: 1px 1px 1px " + d + ";", "-webkit-text-shadow: 1px 1px 1px " + d + ";", "-moz-text-shadow: 1px 1px 1px " + d + ";", "}"]);
    e = "";
    0 == this.options_.reEmbed.behavior && (e = vjs.multiLine(".video-js,{,max-width: 100%;,max-height: 100%;,min-width: 100%;,}".split(",")));
    f = document.createElement("style");
    f.setAttribute("type", "text/css");
    "undefined" == typeof f.styleSheet ? f.innerHTML = e + a + b + c + d : f.styleSheet.cssText = e + a + b + c + d;
    document.getElementsByTagName("head")[0].appendChild(f)
};
vjs.Player.prototype.checkSize = function(a, b) {
    if (!(this instanceof vjs.Player)) return this.player_.checkSize.apply(this.player_, arguments), !1;
    var c = 0;
    this.defaultControls();
    for (var d = 0; d < vjs.widthBreakpoints.length; d++) a <= vjs.widthBreakpoints[d] && (c = vjs.widthBreakpoints[d]), this.removeClass("vjs-w" + vjs.widthBreakpoints[d]);
    0 < c && this.addClass("vjs-w" + c);
    360 >= a && !vjs.IS_MOBILE ? this.controlBar.volumeControl.setVertical() : this.controlBar.volumeControl.unsetVertical()
};
vjs.Player.prototype.initialClick = function(a) {
    if (this.firstClick) return !1;
    this.firstClick = !0;
    "rem-logo-img" != a.target.className && "rem-logo" != a.target.className ? this.startProcess() : this.firstClick = !1
};
vjs.Player.prototype.startProcess = function() {
    var a = this.player_;
    if (vjs.IS_IPAD && "html5" == a.techName.toLowerCase() || vjs.IS_MOBILE && "vimeo" == a.techName.toLowerCase()) return a.play(), "vimeo" == a.techName.toLowerCase() && a.startScreen.hide(), !1;
    "youtube" !== a.techName.toLowerCase() && a.trigger("RshowOverlaySpinner");
    a.trigger("RstartRequested");
    "dailymotion" !== a.techName.toLowerCase() || !a.isLive && a.tech.params.html || (a.trigger("RhideOverlaySpinner"), a.startScreen.hide())
};
vjs.Player.prototype.fixDimensions = function(a) {
    "undefined" === typeof a && (a = 0);
    var b = this.size(),
        c = [];
    if (this.isAd) c.push("height: 100% !important"), c.push("margin: 0 !important"), this.tech.el_.style.cssText = c.join("; ");
    else {
        var d = b[0] / vjs.static_.wizard_width,
            e = this.options_.reEmbed.pady;
        1 > d && (e *= d);
        d = parseInt(vjs.static_.controlBarSize["skin" + (this.options_.reEmbed.skin || 1)].height, 10);
        a = d + 1 * a + 1 * e;
        this.defaultControls() && (a -= d);
        if (this.tech) {
            !this.isFullscreen() && this.nonLinear && this.nonLinear.playing &&
                "youtube" == this.techName.toLowerCase() && (a += parseInt(this.Vast.ads[this.nonLinear.resource.adId].creatives[0].height, 10));
            if (this.options_.playlistStarted || !vjs.IS_MOBILE || "vimeo" == this.techName.toLowerCase() && (vjs.IS_IOS || vjs.IS_NATIVE_ANDROID)) {
                if (this.isFullscreen() && !this.defaultControls() ? (c.push("height: " + (void 0 !== window.innerHeight ? window.innerHeight : document.documentElement.clientHeight) + "px !important"), c.push("margin: 0 !important")) : (c.push("margin: " + e + "px 0 0 0 !important"), c.push("height: " +
                        (b[1] - a) + "px !important")), vjs.IS_IPAD && "html5" == this.techName.toLowerCase() && c.push("-webkit-transform: scale( 1 );"), "div" == this.tech.el_.tagName.toLowerCase()) this.one("ready", function() {
                    this.setPosition()
                })
            } else c.push("height: 100% !important"), c.push("margin: 0 !important");
            this.tech.el_.style.cssText = c.join("; ")
        }
    }
    this.trigger("RdimensionsChanged")
};
vjs.Player.prototype.setPosition = function() {
    if (!(this instanceof vjs.Player)) return this.player_.setPosition.apply(this.player_);
    var a = this.size();
    this.checkSize(a[0], a[1]);
    this.options_.playlistStarted ? this.isAd && this.trigger("RhideVideoOverlay") : (this.trigger("RsetInitialLayout"), this.controls(!1), this.fixStyles(), this.tech && (this.tech.el_.style.visibility = "visible"), this.controlBar.volumeControl.setVerticalEvents());
    this.fixDimensions()
};
vjs.Player.prototype.trackWrapping = function() {
    if (window._X_REM_NEST) return !1;
    var a = this;
    this.trackWrapInterval = setInterval(function() {
        if (null == a.tech.el_.parentNode || -1 === a.tech.el_.parentNode.className.indexOf("video-js"))
            if (clearInterval(a.trackWrapInterval), -1 < ["youtube", "dailymotion"].indexOf(a.techName.toLowerCase())) {
                var b = {
                        type: a.sourceTech.type,
                        src: a.sourceTech.src
                    },
                    c = a.el_.childNodes[0],
                    d = !1,
                    e;
                a.options_.playerStarted ? vjs.IS_MOBILE ? a.ready(function() {
                    this.play()
                }) : (d = !0, a.options_.autoplay =
                    1, e = a.currentTime(), a.one("play", function() {
                        this.currentTime(e)
                    })) : a.unWrapped = !0;
                a.loadTech(a.techName, b);
                d && a.setPosition();
                a.el_.removeChild(c)
            }
    }, 100)
};
vjs.Player.prototype.defaultControls = function(a) {
    var b = this.player_;
    "undefined" != typeof a ? b.defaultControlsFlag = a : "undefined" == typeof b.defaultControlsFlag && (b.defaultControlsFlag = !1, vjs.IS_MOBILE ? b.defaultControlsFlag = !0 : b.techName && ("dailymotion" == b.techName.toLowerCase() && (vjs.IS_ANDROID || vjs.IS_IOS) || /html5|flash/i.test(b.techName.toLowerCase()) && !vjs.IS_CHROME && vjs.IS_ANDROID || "vimeo" == b.techName.toLowerCase()) && (b.defaultControlsFlag = !0));
    return b.defaultControlsFlag
};
vjs.Player.prototype.hasNegativePlid = function() {
    return 0 > this.options_.reEmbed.pings.plid.split("_")[1]
};
vjs.Player.prototype.toggleIframeFullscreen = function(a, b) {
    if (window._X_REM_NEST || b) {
        var c = this.player_,
            d = window._X_REM_NEST ? window.iframeElement : c.el_,
            e = {
                position: "fixed !important",
                width: "100% !important",
                height: "100% !important",
                top: "0 !important",
                left: "0 !important",
                "z-index": "9999 !important"
            };
        c.iframeFullWindow && !a ? (d.style.cssText = c.normalIframeCSS, c.removeClass("vjs-is-full-window"), c.iframeFullWindow = !1) : !c.iframeFullWindow && a && (c.normalIframeCSS = d.style.cssText, d.style.cssText = vjs.objectToCSS(e),
            c.addClass("vjs-is-full-window"), c.iframeFullWindow = !0)
    }
};
vjs.Player.prototype.provider = function() {
    if (!this.tech) return null;
    var a = this.techName.toLowerCase();
    if (-1 < ["youtube", "dailymotion", "vimeo"].indexOf(a)) return a;
    if (this.cache_.src) {
        if (-1 < this.cache_.src.indexOf(".xx.fbcdn.net/")) return "facebook";
        if (-1 < this.cache_.src.indexOf("//video.twimg.com/")) return "twitter"
    }
    return "html5"
};
vjs.Player.prototype.videoId = function() {
    if (!this.tech) return null;
    if ("undefined" != typeof this.tech.videoId) return this.tech.videoId;
    var a = this.cache_.src;
    if (a && -1 < a.indexOf(".xx.fbcdn.net/") || -1 < a.indexOf("//video.twimg.com/"))
        if (a = a.match(/#id:(\d+)/)) return a[1];
    return vjs.getAbsoluteURL(this.cache_.src)
};
vjs.PosterImage.prototype.fixDimensions = function() {
    var a = this.player_,
        b = a.startScreen.posterImage,
        c = b.size;
    if ("undefined" === typeof c) return !1;
    var c = c[1] / c[0],
        d = a.size(),
        a = d[0],
        d = d[1],
        e = "";
    _backgroundSizeSupported || (c > a / d ? (c = [d, d * c], e += "left: " + (a - c[1]) / 2 + "px !important; ") : (c = [a / c, a], e += "top: " + (d - c[0]) / 2 + "px !important; "), e += "height: " + c[0] + "px !important; ", e += "width: " + c[1] + "px !important; ", e += "display: block;", b.el_.getElementsByTagName("img")[0].style.cssText = e);
    return !0
};
vjs.ProgressControl.prototype.fixDimensionsInit = function() {
    var a = this.player_;
    a.progressBarInterval = setInterval(vjs.bind(a, a.controlBar.progressControl.fixDimensions), 100)
};
vjs.ProgressControl.prototype.fixDimensions = function() {
    var a, b, c, d, e, f, g, k, h, p, l, n, m, r, t, q = this.player_;
    a = parseInt(q.options_.reEmbed.skin || 1, 10);
    vjs.IS_IPHONE || (q.controlBar.durationDisplay.el_.style.right = "0px");
    b = q.controlBar.Toolkit.el_.offsetLeft || Infinity;
    c = q.controlBar.ytCaptions ? q.controlBar.ytCaptions.el_.offsetLeft || Infinity : Infinity;
    d = q.controlBar.muteToggle.el_.offsetLeft || Infinity;
    e = q.controlBar.volumeControl.el_.offsetLeft || Infinity;
    f = q.controlBar.fullscreenToggle.el_.offsetLeft || Infinity;
    h = q.controlBar.currentTimeDisplay.el_.offsetLeft || Infinity;
    n = q.controlBar.currentTimeDisplay.el_.offsetWidth;
    g = q.controlBar.durationDisplay.el_.offsetLeft || Infinity;
    p = q.controlBar.liveDisplay.el_.offsetLeft || Infinity;
    l = q.controlBar.liveDisplay.el_.offsetWidth;
    m = q.controlBar.playToggle.el_.offsetLeft;
    r = q.controlBar.playToggle.el_.offsetWidth;
    k = q.controlBar.durationDisplay.el_.offsetWidth;
    t = q.size();
    b = Math.min(b, c, d, e, f);
    isFinite(b) || (b = 0); - 1 < [2, 3, 4].indexOf(a) ? (q.isLive ? a = p + l : (a = g + k, a = isFinite(a) ?
        a : h + n), a = isFinite(a) ? a : 0, q.controlBar.progressControl.el_.style.marginRight = t[0] - b + 10 + "px", q.controlBar.progressControl.el_.style.marginLeft = a + 10 + "px") : -1 < [5, 6].indexOf(a) ? (q.isLive ? a = p + l : (a = h + n, a = isFinite(a) ? a : m + r), a = isFinite(a) ? a : 0, vjs.IS_IPHONE || (q.controlBar.durationDisplay.el_.style.right = t[0] - b + "px", g = q.controlBar.durationDisplay.el_.offsetLeft || Infinity), b = Math.min(b, g), isFinite(b) || (b = 0), q.controlBar.progressControl.el_.style.marginRight = t[0] - b + "px", q.controlBar.progressControl.el_.style.marginLeft =
        a + "px") : -1 < [1, 7].indexOf(a) && (q.controlBar.progressControl.el_.style.marginLeft = 0, q.controlBar.progressControl.el_.style.marginRight = 0)
};
vjs.VolumeControl.prototype.setVertical = function() {
    this.volumeBar.options_.vertical = 1;
    this.volumeBar.volumeLevel.options_.vertical = 1;
    this.addClass("vjs-vertical-volume");
    this.volumeBar.volumeLevel.el_.style.width = "";
    this.volumeBar.volumeLevel.el_.style.height = "";
    this.volumeBar.update();
    this.hide();
    this.vertical = 1;
    return !0
};
vjs.VolumeControl.prototype.unsetVertical = function() {
    delete this.volumeBar.options_.vertical;
    delete this.volumeBar.volumeLevel.options_.vertical;
    this.removeClass("vjs-vertical-volume");
    this.volumeBar.volumeLevel.el_.style.width = "";
    this.volumeBar.volumeLevel.el_.style.height = "";
    this.volumeBar.update();
    this.show();
    this.vertical = 0;
    return !0
};
vjs.VolumeControl.prototype.toggleVertical = function() {
    this.volumeBar.options_.vertical ? this.unsetVertical() : this.setVertical();
    return !0
};
vjs.VolumeControl.prototype.setVerticalEvents = function() {
    this.player_.ready(function() {
        if (vjs.IS_MOBILE || this.controlBar.volumeControl.verticalEvent) return !1;
        this.controlBar.volumeControl.verticalEvent = 1;
        this.controlBar.muteToggle.on("mouseover", function() {
            this.player_.controlBar.volumeControl.vertical && this.player_.controlBar.volumeControl.show()
        });
        this.controlBar.muteToggle.on("mouseout", function(a) {
            if ("undefined" === typeof a.relatedTarget) return !1;
            vjs.isDescendant(this.player_.controlBar.volumeControl.el_,
                a.relatedTarget) || vjs.isDescendant(this.el_, a.relatedTarget) || !this.player_.controlBar.volumeControl.vertical ? this.player_.controlBar.volumeControl.show() : this.player_.controlBar.volumeControl.hide()
        });
        this.on("mouseout", function(a) {
            if ("undefined" === typeof a.relatedTarget) return !1;
            vjs.isDescendant(this.player_.controlBar.muteToggle.el_, a.relatedTarget) || vjs.isDescendant(this.controlBar.volumeControl.el_, a.relatedTarget) || !this.player_.controlBar.volumeControl.vertical || this.player_.controlBar.volumeControl.hide()
        });
        this.on("mousemove", function(a) {
            vjs.isDescendant(this.controlBar.volumeControl.el_, a.target) || vjs.isDescendant(this.controlBar.muteToggle.el_, a.target) || !this.controlBar.volumeControl.vertical ? this.controlBar.volumeControl.show() : this.controlBar.volumeControl.hide()
        })
    })
};
