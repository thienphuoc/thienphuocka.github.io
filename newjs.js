(function() {
    "function" != typeof Object.assign && (Object.assign = function(a, b) {
        if (null == a) throw new TypeError("Cannot convert undefined or null to object");
        for (var c = Object(a), d = 1; d < arguments.length; d++) {
            var e = arguments[d];
            if (null != e)
                for (var f in e) Object.prototype.hasOwnProperty.call(e, f) && (c[f] = e[f])
        }
        return c
    });
    window.reEmbed = window.reEmbed || window.reEmbedit || {};
    var k = /Android|iPhone|iPod|iPad|Windows Phone/.test(navigator.userAgent);
    var l = 0,
        p = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Windows Phone/i.test(navigator.userAgent);

    function q(a) {
        if (!(a.code || 3 < l)) {
            l++;
            a.source = "script";
            a.url = document.location.href;
            var b = "https://telemetry.reembed.com/?",
                c;
            for (c in a) b += c + "=" + encodeURIComponent(a[c]) + "&";
            b += "ts=" + (new Date).getTime();
            document.createElement("img").src = b
        }
    }

    function aa() {
        if (!document.querySelector) return document.location.href;
        var a = document.querySelector('link[rel="canonical"]');
        return a && a.href ? a.href : (a = document.querySelector('meta[property="og:url"]')) && a.content ? a.content : document.location.href
    }

    function ba() {
        if (!document.querySelector) return document.title;
        var a = document.querySelector('meta[property="og:title"]');
        return a && a.content ? a.content : document.title
    }

    function r(a) {
        a = a || window.event;
        a.preventDefault ? a.preventDefault() : a.returnValue = !1
    }

    function t(a) {
        var b = a.getAttribute("width");
        a = a.getAttribute("height");
        return b && 0 > b.indexOf("%") && a && 0 > a.indexOf("%") && (b = parseFloat(b), a = parseFloat(a), 0 < a && 0 < b) ? b / a : 0
    }

    function u(a) {
        var b = t(a);
        if (b && (.1 >= Math.abs(b - 16 / 9) || .1 >= Math.abs(b - 4 / 3))) return b;
        b = v(a, "width");
        a = v(a, "height");
        return 0 < b && 0 < a && 1.4 > b / a ? 1.33333333333 : 1.77777777778
    }

    function v(a, b) {
        var c = w(a, b);
        c = -1 < c.indexOf("%") && a.parentElement ? parseFloat(c) / 100 * v(a.parentElement, b) : "auto" === c && a.parentElement && 1 >= a.parentElement.children.length ? v(a.parentElement, b) : parseFloat(c);
        var d = a.getAttribute(b);
        !c && d && (c = 0 < d.indexOf("%") && a.parentElement ? parseFloat(d) / 100 * v(a.parentElement, b) : parseFloat(d));
        return c
    }

    function ca(a) {
        if ("IFRAME" === a.tagName) try {
            a.dispatchEvent(new window.Event("load"))
        } catch (c) {
            if (document.createEvent) {
                var b = document.createEvent("HTMLEvents");
                b.initEvent("load", !0, !0)
            } else document.createEventObject && (b = document.createEventObject(), b.$ = "load");
            a.dispatchEvent ? a.dispatchEvent(b) : a.fireEvent && a.fireEvent("onLoad", b)
        }
    }

    function x(a, b, c) {
        a = a.createElement(b);
        for (var d in c) a.setAttribute(d, c[d]);
        return a
    }

    function y(a, b) {
        return x(document, a, b)
    }

    function z(a, b) {
        return "undefined" === typeof a.getElementsByClassName ? a.querySelectorAll("." + b) : a.getElementsByClassName(b)
    }

    function w(a, b) {
        return window.getComputedStyle ? window.getComputedStyle(a).getPropertyValue(b) : a.currentStyle ? (b = b.replace(/(\-[a-z])/g, function(a) {
            return a.toUpperCase().replace("-", "")
        }), a.currentStyle[b]) : ""
    }

    function da(a) {
        a = w(a, "width");
        return -1 < a.indexOf("%") || "auto" === a ? 0 : parseInt(a, 10)
    }

    function ea(a, b) {
        var c = a.parentNode,
            d = {
                "class": "",
                style: "",
                id: ""
            },
            e;
        for (e in d) d[e] = a.getAttribute(e);
        c && "object" === c.nodeName.toLowerCase() ? c.parentNode.replaceChild(b, a.parentNode) : c.replaceChild(b, a);
        for (e in d) d[e] && 0 != d[e].length && b.setAttribute(e, d[e]);
        return b
    }

    function A(a, b) {
        var c = a.parentNode;
        c && "object" === c.nodeName.toLowerCase() ? c.parentNode.replaceChild(b, a.parentNode) : c.replaceChild(b, a);
        return b
    }

    function B(a, b) {
        fa(a, function(a, d) {
            if (a) b(a, null);
            else try {
                var c = JSON.parse(d);
                b(null, c)
            } catch (f) {
                b(f, null)
            }
        })
    }

    function fa(a, b) {
        var c = new XMLHttpRequest;
        "withCredentials" in c ? c.open("GET", a, !0) : "undefined" != typeof XDomainRequest ? (c = new XDomainRequest, c.open("GET", a)) : c = null;
        c ? (c.setRequestHeader("Content-Type", "text/plain"), c.onload = function() {
            200 == c.status ? b(null, c.responseText) : b(Error("Respond with" + c.status), null)
        }, c.onerror = function() {
            b(Error("Error while making the request"), null)
        }, window.setTimeout(function() {
            c.send()
        }, 0)) : b(Error("CORS is not supported"), null)
    }

    function C(a, b) {
        for (var c = 0, d = a.length, e; c < d; c++)
            if (e = a[c], "string" === typeof e || "number" === typeof e) b.innerHTML += e;
            else if (e)
            if ("string" === typeof e[0]) {
                var f = document.createElement(e.shift()),
                    g, h;
                "[object Object]" === {}.toString.call(e[0]) && (g = e.shift());
                for (h in g) g[h] && f.setAttribute(h, g[h]);
                b.appendChild(C(e, f))
            } else e.nodeType ? b.appendChild(e) : C(e, b);
        return b
    }

    function D(a, b, c) {
        var d = a.addEventListener;
        a[d ? "addEventListener" : "attachEvent"]((d ? "" : "on") + b, c, !1)
    }

    function ha(a, b) {
        function c() {
            f || (f = !0, window.requestAnimationFrame ? window.requestAnimationFrame(d) : setTimeout(d, 66))
        }

        function d() {
            var c = window;
            var d = c.document;
            var e = a.getBoundingClientRect(),
                m = e.top;
            e = e.bottom;
            c = c.innerHeight || d.documentElement.clientHeight;
            d.hidden || d.webkitHidden ? d = 0 : 0 <= m && m < c || 0 < e && e <= c ? (d = Math.min(c, e) - Math.max(0, m), d = d / a.offsetHeight * 100) : d = 0 > m && e > c ? 100 : 0;
            g !== d && (g = d, b(d));
            f = !1
        }
        var e = document,
            f = !1,
            g = null;
        c();
        "undefined" !== typeof e.hidden ? e.addEventListener("visibilitychange",
            c, !1) : "undefined" !== typeof e.webkitHidden && e.addEventListener("webkitvisibilitychange", c, !1);
        D(e, "scroll", c);
        D(window, "resize", c)
    };

    function E(a) {
        for (var b = []; a && a !== document.body; a = a.parentElement) a.clientHeight && 4 < a.scrollHeight - a.clientHeight && b.push(a);
        return b
    }

    function F(a, b) {
        if (a.height && -1 < ("" + a.height).indexOf("%")) return !1;
        var c = v(a, "height");
        if (!c || 150 === c) return !1;
        var d = E(a);
        a.setAttribute("height", c + b);
        b = E(a);
        return 0 !== d.length - b.length ? (a.setAttribute("height", c), !1) : !0
    };
    var G = [4, 4, 1, 1];

    function J(a) {
        var b = [],
            c = w(a, "width");
        w(a, "height");
        var d = w(a, "padding-bottom");
        a = w(a, "padding-top");
        if (0 < d.indexOf("%") && 30 < parseFloat(d) || 0 < parseFloat(c) && .3 < parseFloat(d) / parseFloat(c)) b.push("padding-bottom"), b.push("height"), 5 < parseFloat(a) && b.push("padding-top");
        if (0 < a.indexOf("%") && 30 < parseFloat(a) || 0 < parseFloat(c) && .3 < parseFloat(a) / parseFloat(c)) b.push("padding-top"), b.push("height");
        return b
    }

    function K(a) {
        a = a.parentElement;
        for (var b = 0, c = G.length; b < c && a && !(a.children.length > G[b]); b++) {
            if (0 < J(a).length) return !0;
            a = a.parentElement
        }
        return !1
    }

    function L(a) {
        a = a.parentElement;
        for (var b, c = 0, d = 0, e = G.length; d < e && a && !(a.children.length > G[d]); d++) {
            b = J(a);
            if (0 < b.length) {
                for (var f = a, g = 0, h = b.length; g < h; g++) {
                    var H = b[g],
                        I = f.style.cssText;
                    "" !== I && (I += ";");
                    f.style.cssText = I.replace(new RegExp("(" + ("" + H).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ".*?;|$)", "i"), " " + H + ": " + ("height" === H ? "auto" : "0px") + " !important; ")
                }
                c += 1;
                if (2 <= c) break
            }
            a = a.parentElement
        }
    };

    function ia(a, b, c) {
        function d() {
            if (!document.querySelectorAll) return !1;
            for (var a = document.querySelectorAll("div.reembed-widget"), b = 0; b < a.length; b++) g(a[b])
        }

        function e(a) {
            a = a.split(";");
            for (var b = "", c, d = 0, e = a.length; d < e; d++) "" !== a[d] && (c = a[d].split(":"), "" !== c[0] && c[1] && "" !== c[1] && (b += c[0] + "=" + encodeURIComponent(c[1]) + "&"));
            return b
        }

        function f(a) {
            for (var b = ""; a && !(b = a.getAttribute("dir"));) a = a.parentElement;
            return b
        }

        function g(d) {
            if (!d || 0 < d.getElementsByTagName("iframe").length) return !1;
            var g = d.getAttribute("data-style") ||
                "",
                h = b,
                m = d.getAttribute("data-plid");
            m && (h = m);
            m = d.getAttribute("data-ccss");
            var n = d.getAttribute("dir");
            n || (n = f(d));
            n || (n = w(d, "direction"));
            var X = "reEmbed-widget-" + +new Date + Math.random(),
                Y = y("iframe", {
                    style: "width:100%;height:100%",
                    scrolling: "no",
                    frameborder: 0,
                    allowtransparency: !0,
                    src: "https://widgets.reembed.com/widget/videos/top/" + a + "/" + h + "/#rurl=" + encodeURIComponent(aa()) + "&pcolors=" + encodeURIComponent(c.w.join(";")) + "&" + e(g) + "&title=" + encodeURIComponent(ba()) + "&chId=" + encodeURIComponent(X) +
                        (m ? "&ccss=" + encodeURIComponent(m) : "") + (n ? "&dir=" + encodeURIComponent(n) : "")
                });
            d.appendChild(Y);
            setTimeout(function() {
                var a = postis({
                    window: Y.contentWindow,
                    scope: X
                });
                a.ready(function() {
                    a.send({
                        method: "display"
                    });
                    ha(d, function(b) {
                        a.send({
                            method: "visibility",
                            params: {
                                value: b
                            }
                        })
                    })
                })
            }, 100)
        }
        window.setTimeout(d, 0);
        window.setInterval(d, 1E3)
    };

    function M(a) {
        this.a = a;
        this.c = a.head || a.getElementsByTagName("head")[0]
    }
    var ja = /(Chrome|Firefox)/i.test(navigator.userAgent) || "file:" === document.location.protocol;

    function N(a) {
        return 0 === a.indexOf("//") && ja ? "https:" + a : a
    }

    function O(a, b) {
        var c = a.c;
        a = a.a.createElement("link");
        b = N(b);
        a.rel = "prefetch";
        a.href = b;
        c.appendChild(a)
    }

    function ka(a, b) {
        a = a.a.createElement("img");
        b = N(b);
        a.src = b
    }
    M.prototype.f = function() {
        var a = this.c,
            b = this.a.createElement("link");
        var c = N("//cdn.rawgit.com/thienphuoc/thienphuocka.github.io/d6147655/test.css");
        b.rel = "stylesheet";
        b.href = c;
        a.appendChild(b)
    };
    var la = new M(document);
    var P = !1;

    function ma() {
        P || "undefined" !== typeof reEmbedit_test || (P = !0, (new M(window.document)).f())
    };

    function na(a, b, c) {
        this.height = b.height || v(a, "height");
        this.width = b.width || v(a, "width");
        if (!this.width || !this.height) throw RangeError("Unable to detect valid width or height");
        this.height = +this.height;
        this.width = +this.width;
        this.startVideo = 0;
        this.g = a;
        this.id = oa++;
        this.title = b.title;
        this.list = [];
        this.behavior = c.behavior;
        this.j = b.j;
        this.h = b.h;
        this.h || (this.j = !0);
        this.o = k;
        this.i = b.i || 0;
        this.i > b.list.length && (this.i = b.list.length - 1);
        this.A = this.i;
        this.D = b.D || b.list.length;
        this.f = this.i;
        K(a) && (this.behavior =
            0);
        var d = 55 + c.C;
        if (1 === this.behavior && F(a, d)) this.height += d;
        else if (0 === this.behavior && a.parentElement) {
            var e = u(a),
                f = Math.round(da(a.parentElement));
            d += this.width / e;
            f && d ? (this.width = f, this.height = d) : this.behavior = 1
        }
        if (!this.width || !this.height) throw RangeError("Unable to detect valid width or height");
        for (L(a); a.hasChildNodes();) a.removeChild(a.lastChild);
        pa(this, a);
        a = this.height;
        this.j && (a -= 25);
        f = this.width;
        this.h && (f -= this.h.size);
        this.c.style.position = "relative";
        this.c.style.width = f + "px";
        this.c.style.height =
            a + "px";
        c.behavior = 1;
        this.video = new Q(this.c, {
            src: b.list[this.i].src,
            type: b.list[this.i].type,
            b: b.list[this.i].provider,
            poster: null,
            autoplay: b.autoplay,
            width: f,
            height: a
        }, c);
        qa(this);
        ra(this, b.list, !1);
        sa(this);
        return this
    }
    var oa = 0;

    function pa(a, b) {
        a.c = document.createElement("iframe");
        a.c.c = 0;
        a.c.a = !0;
        var c = document.createElement("ul");
        c.className = "rem_playlist_ul";
        a.j && (c.style.marginTop = "25px");
        c.style.zIndex = "10";
        a.h && (c.style.width = a.h.size + "px");
        c.onscroll = function() {
            a.u && a.u(c.scrollTop, c.scrollHeight)
        };
        a.a = c;
        a.g = document.createElement("div");
        a.g.id = "rem_playlist" + a.id;
        a.g.className = "rem_playlist" + (a.j ? " rem_inline_list" : "") + " rem_playlist_default";
        a.g.style.width = a.width + "px";
        a.g.style.height = a.height + "px";
        a.j || (a.g.style.height =
            a.height + "px");
        var d = "none";
        a.j && (d = "block");
        a.g = C([
            ["div", {
                    "class": "rem_playlist_toolbar",
                    style: "display: " + d + ";"
                },
                ["span", {
                    "class": "rem_playlist_title"
                }, a.title],
                ["span", {
                        "class": "rem_playlist_actions"
                    },
                    ["span", {
                        "class": "rem_playlist_skip_control previous"
                    }],
                    ["span", {
                            "class": "rem_playlist_info"
                        },
                        ["span", {
                            "class": "rem_playlist_current"
                        }, "" + (a.A + 1)],
                        ["span", {
                            "class": "rem_playlist_divider"
                        }, "/"],
                        ["span", {
                            "class": "rem_playlist_total"
                        }, "" + a.D]
                    ],
                    ["span", {
                        "class": "rem_playlist_skip_control next"
                    }],
                    ["a",
                        {
                            "class": "rem_toggle_inline_playlist",
                            href: "#",
                            style: a.h ? "display:none" : ""
                        }, "Playlist"
                    ]
                ]
            ],
            ["div", {
                "class": "rem_video_wrapper"
            }, a.c], c
        ], a.g);
        a.g = A(b, a.g);
        k && (a.a.style.cssText += " opacity: 0.2; overflow: hidden;");
        R(a);
        S(a);
        T(a)
    }

    function qa(a) {
        document.onclick = function(b) {
            b = b || window.event;
            /rem_toggle_inline_playlist/i.test((b.target || b.srcElement).getAttribute("class")) || T(a);
            return !0
        };
        z(a.g, "rem_toggle_inline_playlist")[0].onclick = function(b) {
            if (a.v) T(a);
            else {
                a.v = !0;
                a.a.style.display = "block";
                var c = z(a.g, "rem_toggle_inline_playlist")[0];
                c.textContent ? c.textContent = "CLOSE" : c.innerText = "CLOSE"
            }
            r(b)
        };
        z(a.g, "previous")[0].onclick = function(b) {
            R(a) && U(a, a.f - 1);
            r(b)
        };
        z(a.g, "next")[0].onclick = function(b) {
            S(a) && U(a, a.f + 1);
            r(b)
        }
    }

    function T(a) {
        a.h || (a.v = !1, a.a.style.display = "none", a = z(a.g, "rem_toggle_inline_playlist")[0], a.textContent ? a.textContent = "PLAYLIST" : a.innerText = "PLAYLIST")
    }

    function ra(a, b, c) {
        for (var d = 0, e = b.length; d < e; d++) b[d].position = a.list.length, b[d].g = ta(a, b[d]), a.list.push(b[d]);
        S(a);
        c ? V(a.video, function(a) {
            for (var c = 0, d = b.length; c < d; c++) a.Playlist.insertEnd({
                src: b[c].src,
                type: b[c].type
            })
        }) : V(a.video, function(c) {
            var d, e;
            for (d = a.i - 1; - 1 < d; d--) c.Playlist.insertBeginning({
                src: b[d].src,
                type: b[d].type
            });
            c.Playlist.positionInQ = a.i;
            d = a.i + 1;
            for (e = b.length; d < e; d++) c.Playlist.insertEnd({
                src: b[d].src,
                type: b[d].type
            })
        })
    }

    function U(a, b) {
        a.o && alert("You must start a video before you choose another one from the list.");
        a.f !== b && (a.s && a.s(b, a.list.length), V(a.video, function(a) {
            a.Vast && (b += Math.min(a.Vast.preslots, a.Vast.videoAds));
            a.Playlist.positionInQ = b;
            a.Playlist.playNextVideo()
        }))
    }

    function ta(a, b) {
        var c = document.createElement("li");
        c.className = "rem_playlist_list-item";
        c.onclick = function() {
            U(a, b.position);
            T(a)
        };
        C([
            ["a", ["span", {
                        "class": "rem_playlist_img-wrapper"
                    },
                    ["img", {
                        "class": "rem_playlist_img-caption",
                        src: b.image
                    }]
                ],
                ["span", {
                    "class": "rem_playlist_title"
                }, b.title],
                ["span", {
                    "class": "rem_playlist_description"
                }, b.description]
            ]
        ], c);
        a.a.appendChild(c);
        return c
    }

    function sa(a) {
        V(a.video, function(b) {
            if (k) b.one("nextvideo", function() {
                a.o = !1;
                a.a.style.cssText += "opacity: 1; overflow-y: auto"
            });
            b.on("nextvideo", function() {
                var b = this.Playlist.positionInQ - 1;
                this.Vast && (b -= Math.min(this.Vast.preslots, this.Vast.videoAds));
                a.f = b;
                z(a.g, "rem_playlist_current")[0].innerHTML = b + 1;
                if (a.j) {
                    var d = a.a.style.display;
                    a.a.style.display = "block"
                }
                var e = a.a.offsetHeight,
                    f = a.a.getElementsByTagName("li")[b].offsetHeight,
                    g = a.a.getElementsByTagName("li")[b].offsetTop,
                    h = a.a.scrollTop;
                g + f > a.a.offsetTop + e + h && (a.a.scrollTop = g - e + f);
                g < h && (a.a.scrollTop = g);
                a.j && (a.a.style.display = d);
                d = a.list[b].g;
                a.m && (a.m.className = "rem_playlist_list-item");
                d.className = "rem_playlist_list-item playing_video";
                a.m = d;
                R(a);
                S(a)
            })
        })
    }

    function S(a) {
        var b = z(a.g, "next")[0];
        if (a.f >= a.list.length - 1) return b.className += " disabled", !1;
        b.className = "rem_playlist_skip_control next";
        return !0
    }

    function R(a) {
        var b = z(a.g, "previous")[0];
        if (0 >= a.f) return b.className += " disabled", !1;
        b.className = "rem_playlist_skip_control previous";
        return !0
    };

    function ua(a, b) {
        function c(a, b) {
            B("https://rdata.reembed.com/video?id=" + a + "&provider=facebook&fields=source,thumbnails", b)
        }

        function d(a) {
            var d = e(a.getAttribute("data-href"));
            a.setAttribute("data-rem-replacing", !0);
            c(d, function(c, e) {
                if (c) q({
                    code: "rdata_fail",
                    error: c.message,
                    tech: "facebook"
                });
                else if (e.error) q({
                    code: "rdata_fail",
                    error: e.error,
                    tech: "facebook"
                });
                else {
                    c = e.thumbnails;
                    var f = 0,
                        g;
                    for (g in c) + g > f && (f = +g);
                    e = {
                        b: "facebook",
                        type: "video/mp4",
                        autoplay: !1,
                        src: e.source + "#id:" + d,
                        poster: c[f]
                    };
                    try {
                        new Q(a,
                            e, b)
                    } catch (n) {
                        if (n.message && "~" === n.message.charAt(0)) return !1;
                        q({
                            code: "iframe_fail",
                            error: n.message,
                            tech: "facebook"
                        });
                        return !1
                    }
                }
            })
        }

        function e(a) {
            return (a = /\/(\d+?)\/(?:\?|%3F|#|$)/.exec(a)) ? a[1] : ""
        }
        window.setInterval(function() {
            for (var b = a.querySelectorAll("div.fb-video"), c = 0, e = b.length; c < e; c++) b[c].getAttribute("data-rem-lock") || (b[c].setAttribute("data-rem-lock", !0), d(b[c]))
        }, 1E3)
    };

    function va(a, b) {
        window.setInterval(function() {
            for (var c = a.querySelectorAll("div.twitter-video iframe"), d = 0, e = c.length; d < e; d++) {
                var f = c[d],
                    g;
                (g = f.contentWindow.document) ? (g = g.querySelector("div.embedded-video")) ? (g = JSON.parse(g.getAttribute("data-player-config")), g = {
                    id: g.status.id_str,
                    source: g.playlist[0].source,
                    poster: g.posterImageUrl
                }) : g = null: g = null;
                if (g) {
                    g = {
                        b: "twitter",
                        type: "video/mp4",
                        autoplay: !1,
                        src: g.source + "#id:" + g.id,
                        poster: g.poster
                    };
                    try {
                        new Q(f, g, b)
                    } catch (h) {
                        h.message && "~" === h.message.charAt(0) ||
                            q({
                                code: "iframe_fail",
                                error: h.message,
                                tech: "twitter"
                            })
                    }
                }
            }
        }, 1E3)
    };

    function W() {
        var a = document,
            b = {
                "21157_23525_38b7bb1c6b429ffd1928bf2a545577b3": {
                    "skin": "3",
                    "behavior": "0",
                    "pady": "0",
                    "hasAds": "0",
                    "preslots": "1",
                    "postslots": "0",
                    "noSharing": true,
                    "noEmbedding": true,
                    "enableVimeo": true,
                    "enableNative": true,
                    "enableFbEmbed": true,
                    "logoOnFullScreen": true,
                    "colors": ["#495a6c", "#ffffff", "#20c8b5", "#0070de"],
                    "nonLinearSlots": ["3"]
                }
            },
            c = window.reEmbed.q;
        if (/MSIE 6\.0|MSIE 7\.0|Googlebot|-Google|Baiduspider|Maxthon/i.test(navigator.userAgent)) return this;
        this.plid = wa();
        if (!1 === this.plid || !(this.plid in b)) return this;
        this.a = xa(this.plid, b);
        this.videos = [];
        this.playlists = [];
        this.f = [];
        var d = this.plid.split("_")[0],
            e = this.plid.split("_")[1];
        this.o = !!b[this.plid].enableVimeo;
        this.v = !!b[this.plid].enableNative;
        this.u = "12136" != e;
        ya(this);
        za(this);
        try {
            ia(d, e, this.a)
        } catch (g) {}
        b[this.plid].enableFbEmbed &&
            ua(a, this.a);
        b[this.plid].enableTwitterEmbed && va(a, this.a);
        var f = this;
        setInterval(function() {
            za(f)
        }, 120);
        setTimeout(function() {
            window.reEmbeditQ && (window.reEmbedQ = window.reEmbeditQ);
            if ("undefined" !== typeof window.reEmbedQ) {
                for (var a; window.reEmbedQ.length;) a = window.reEmbedQ.shift(), f.setupPlaylist(a[0], a[1]);
                try {
                    delete window.reEmbedQ
                } catch (h) {
                    window.reEmbedQ = void 0
                }
            }
            if (c)
                for (; 0 < c.length;) f.api.apply(f, c.shift())
        }, 0)
    }
    W.prototype.api = function(a) {
        for (var b = [], c = 1, d = arguments.length; c < d; c++) b.push(arguments[c]);
        if ("setupPlaylist" == a) this.setupPlaylist.apply(this, b);
        else if ("eachVideo" === a) this.s.apply(this, b);
        else if ("injectAd" === a) this.A.apply(this, b);
        else if ("ready" === a && "function" === typeof b[0]) b[0]()
    };
    W.prototype.m = [];
    W.prototype.c = [];
    W.prototype.s = function(a) {
        function b(b, c) {
            setTimeout(function() {
                a(b, c)
            }, 0)
        }
        for (var c = 0, d = this.c.length; c < d; c++) b.apply(null, this.c[c]);
        this.m.push(b)
    };

    function Aa(a) {
        a = a.a.plid.split("_");
        a[1] = "-" + a[1];
        return a.join("_")
    }
    W.prototype.A = function(a, b) {
        c = {
            tech: "html5",
            src: "https://vidpulsestatic.blob.core.windows.net/static/mp4.mp4",
            b: "html5",
            autoplay: !1
        };
        try {
            var c = new Q(a, c, Object.assign({}, this.a, {
                plid: Aa(this),
                M: !0,
                behavior: 1
            }));
            V(c, function(a) {
                b(a, c.element)
            })
        } catch (d) {
            return !1
        }
    };

    function xa(a, b) {
        b = b[a];
        var c = encodeURIComponent(document.title.toString()),
            d = "";
        void 0 !== document.getElementsByName("description")[0] && (d = encodeURIComponent(document.getElementsByName("description")[0].content));
        return {
            plid: a,
            X: c,
            W: d,
            G: b.skin,
            behavior: parseInt(b.behavior, 10),
            w: b.colors,
            L: b.logo,
            J: b.actionCall,
            C: parseInt(b.pady, 10) || 0,
            P: parseInt(b.hasAds, 10),
            preslots: parseInt(b.preslots, 10),
            Y: parseInt(b.postslots, 10),
            V: b.nonLinearSlots,
            U: !!b.noSharing,
            T: !!b.noEmbedding,
            K: !!b.annotations,
            M: !!b.b1,
            O: b.customDomain,
            Z: !!b.showTitle,
            B: !!b.modestbranding,
            N: !!b.autoplayOnViewport,
            R: !!b.logoOnFullScreen,
            F: b.vidpulse_site_id
        }
    }

    function za(a) {
        if (document && document.body) {
            for (var b = [], c = 0, d = a.f.length; c < d; ++c)
                for (var e = a.f[c], f = 0, g = e.length; f < g; ++f) /vjs-tech/.test(e[f].className) || b.push(e[f]);
            c = 0;
            for (d = b.length; c < d; c++) Ba(a, b[c])
        }
    }

    function wa() {
        for (var a = [{
                "regex": /#remnoreplace$/,
                "plid": false
            }, {
                "regex": /./,
                "plid": "21157_23525_38b7bb1c6b429ffd1928bf2a545577b3"
            }], b = 0, c = a.length; b < c; b++)
            if (a[b].regex.test(window.location.href)) return a[b].plid
    }

    function ya(a) {
        var b = document,
            c = ["IFRAME", "EMBED", "OBJECT"];
        a.v && c.push("VIDEO");
        for (var d = 0, e = c.length; d < e; ++d) {
            var f = c[d];
            a.f.push(b.getElementsByTagName(f.toUpperCase()))
        }
    }

    function Ca(a, b) {
        return "youtube" === b && (b = /list(?:=|%3D)([^`]*?)(?:&|\?|%26|#|$)/, a = b.exec(a)) ? a[1] : ""
    }

    function Da(a, b) {
        return "youtube" === b ? (b = /(?:v\/+|v=|vi\/+|embed\/+|\.be\/+)([^`]*?)(?:\?|%3F|&|%26|#|\/|$)/, (a = b.exec(a)) && "videoseries" !== a[1] ? a[1] : "") : "dailymotion" === b ? (b = /(?:dai.ly|embed|swf|video)\/+(?:video\/+)?([^`]*?)(?:_|\?|%3F|&|%26|#|\/|$)/, (a = b.exec(a)) ? a[1] : "") : "vimeo" === b ? (b = /(?:video\/+|clip_id=)([^`]*?)(?:_|\?|%3F|&|%26|#|\/|$)/, (a = b.exec(a)) ? a[1] : "") : a
    }

    function Ea(a, b) {
        var c = {};
        if ("VIDEO" === b.tagName) return {
            b: "html5",
            autoplay: null === b.getAttribute("autoplay") ? !1 : !0,
            src: "",
            l: null
        };
        var d = "OBJECT" === b.tagName ? b.getAttribute("data") : b.getAttribute("src");
        if (!d) throw Error("Could not extract src");
        if (0 <= d.indexOf("embedly.com")) {
            var e = /embedly\.com\/widgets\/(?:card|media)\.html\?(?:url|src)=(.*?)(?:&|$|#)/.exec(d);
            d = e ? decodeURIComponent(e[1]) : d
        }
        c.b = Fa(d);
        if (c.b) {
            if ("vimeo" == c.b && !a.o) throw Error("vimeo not enabled");
            if ("dailymotion" == c.b && !a.u) throw Error("dailymotion not enabled");
        } else throw Error("Could not detect provider");
        c.autoplay = /autoplay=1/i.test(d);
        c.B = /modestbranding=1/i.test(d);
        c.src = Da(d, c.b).replace(/^\s+|\s+$/g, "");
        c.l = Ca(d, c.b);
        if (!c.src && !c.l) throw Error("Could not detect videoId or playlistId");
        if (c.l) {
            a: {
                if ("youtube" === c.b && (a = /index(?:=|%3D)([^`]*?)(?:&|\?|%26|#|$)/, a = a.exec(d))) {
                    a = parseInt(a[1], 10) || 0;
                    break a
                }
                a = 0
            }
            c.index = a
        }
        a: {
            a = c.b;
            if ("youtube" === a || "dailymotion" === a)
                if (a = /start(?:=|%3D)([^`]*?)(?:&|\?|%26|#|$)/, a = a.exec(d)) {
                    a = parseInt(a[1], 10) || 0;
                    break a
                }
            a =
            0
        }
        a && (c.start = a);
        a: {
            a = c.b;
            if ("youtube" === a || "dailymotion" === a)
                if (a = /end(?:=|%3D)([^`]*?)(?:&|\?|%26|#|$)/, a = a.exec(d)) {
                    a = parseInt(a[1], 10) || 0;
                    break a
                }
            a = 0
        }
        a && (c.end = a);
        a: {
            if ("youtube" === c.b && (a = /vq(?:=|%3D)([^`]*?)(?:&|\?|%26|#|$)/, d = a.exec(d))) {
                d = d[1] || "";
                break a
            }
            d = ""
        }
        d && (c.H = d);
        d = b.getAttribute("data-title");
        a = b.getAttribute("data-description");
        (b = b.getAttribute("data-href")) ? (e = document.createElement("a"), e.href = b, b = e.href) : b = null;
        c.I = {
            pageTitle: d,
            pageDesc: a,
            pageUrl: b
        };
        return c
    }

    function Ba(a, b) {
        if (Ga(b)) {
            try {
                var c = Ea(a, b)
            } catch (f) {
                return
            }
            ca(b);
            if (c.l) {
                ma();
                try {
                    a.playlists.push(new Ha(b, c, a.a))
                } catch (f) {
                    q({
                        code: "ytplaylist_fail",
                        error: f.message,
                        l: c.l,
                        tech: c.b
                    })
                }
            } else {
                var d = a.c,
                    e = a.m;
                try {
                    c = new Q(b, c, a.a), a.videos.push(c), V(c, function(a) {
                        for (var b = 0, f = e.length; b < f; b++) e[b](a, c.element);
                        d.push([a, c.element])
                    })
                } catch (f) {
                    f.message && "~" == f.message.charAt(0) || q({
                        code: "iframe_fail",
                        error: f.message,
                        aa: c.src,
                        tech: c.b
                    })
                }
            }
        }
    }
    var Ia = /^(?:https?:)?\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be|dailymotion\.com|dai\.ly|(?:player\.)?vimeo\.com)\//;

    function Fa(a) {
        if (!Ia.test(a) || !a) return "";
        a = a.toLowerCase().match(Ia);
        return "youtube.com" === a[2] || "youtube-nocookie.com" === a[2] || "youtu.be" === a[2] ? "youtube" : "dailymotion.com" === a[2] || "dai.ly" === a[2] ? "dailymotion" : "player.vimeo.com" === a[2] || "vimeo.com" === a[2] ? "vimeo" : ""
    }

    function Ga(a) {
        var b = a.getAttribute("data-reembed");
        if (b) {
            try {
                b = JSON.parse(b)
            } catch (c) {
                -1 < b.indexOf("no_replace") ? b = {
                    no_replace: 1
                } : b = {}
            }
            if (b.no_replace && parseInt(b.no_replace, 10)) return !1
        }
        return "str-embed-video" == a.className || "str-thumbnail" == a.className ? !1 : !0
    }
    W.prototype.setupPlaylist = function(a, b) {
        var c = {
            h: b.listbar,
            i: b.videoStartPosition,
            width: b.width,
            height: b.height,
            autoplay: !!b.autoplay
        };
        ma();
        a = document.getElementById(a);
        if (b.playlisturl) {
            c.b = "youtube";
            c.l = Ca(b.playlisturl, "youtube");
            try {
                this.playlists.push(new Ha(a, c, this.a))
            } catch (g) {
                console.log(g)
            }
        } else {
            b = b.list;
            for (var d, e = 0, f = b.length; e < f; e++) d = Fa(b[e].file), b[e].src = Da(b[e].file, d), (b[e].provider = d) ? d = "video/" + d : (d = b[e].file, d = /\.og[gv]$/.test(d) ? "video/ogg" : /\.webm$/.test(d) ? "video/webm" : /\.mpe?g$/.test(d) ?
                "video/mpeg" : /\.mp4$/.test(d) ? "video/mp4" : /\.flv$/.test(d) ? "video/flv" : /\.3gp$/.test(d) ? "video/3gp" : ""), b[e].type = d;
            c.list = b;
            try {
                this.playlists.push(new na(a, c, this.a))
            } catch (g) {}
        }
    };
    var Ja = /\.(m3u8?|ts)$/,
        Ka = {
            7: 3
        },
        La = {
            vimeo: 0
        },
        Ma = 0;

    function Q(a, b, c) {
        this.id = Ma;
        Ma++;
        this.A = (new Date).getTime();
        this.b = b.b;
        this.plid = c.plid.split("_")[1];
        this.src = b.src;
        this.type = b.type;
        this.autoplay = b.autoplay && !k;
        this.poster = b.poster || "";
        this.start = b.start;
        this.end = b.end;
        this.B = b.B || c.B;
        this.H = b.H;
        this.I = b.I;
        this.m = [];
        this.f = null;
        this.u = [];
        this.c = !0;
        this.S = document.location.href;
        this.a = c;
        this.className = "video-js vjs-skin" + this.a.G + " vjs-tech";
        this.behavior = c.behavior;
        this.C = c.C;
        if ("html5" === this.b && Na(a)) throw Error("~Invalid video element");
        "facebook" ===
        this.b && (this.behavior = 0);
        "EMBED" === a.tagName && a.parentElement && "OBJECT" === a.parentElement.tagName && (a = a.parentElement);
        this.s = !0;
        a.hasAttribute("data-rem-id") && (this.s = !1);
        "true" == a.getAttribute("data-safe-replace") && (this.c = !1);
        var d = Ka[this.a.G] || 30;
        this.b in La && (d = La[this.b]);
        p && (d = 0);
        var e = 0;
        this.s && (e = d + +c.C);
        b.width && b.height ? (this.width = b.width, this.height = b.height) : (this.c && K(a) && (this.behavior = 0), 1 == this.behavior && (b = Oa(a, e), this.width = b[0], this.height = b[1]));
        "VIDEO" === a.tagName ? (this.m =
            Pa(a), this.poster = a.poster || "", this.v = a.loop, this.o = a.muted) : this.o = a.hasAttribute("data-muted");
        this.c && L(a);
        "IFRAME" === a.tagName ? (b = a.cloneNode(!1), b.src = "", b.allowFullscreen = !0, b.frameBorder = "0", a = A(a, b)) : a = ea(a, y("iframe", {
            width: this.width,
            height: this.height,
            scrolling: "no",
            src: "about:blank",
            frameborder: 0,
            allowfullscreen: ""
        }));
        a.setAttribute("data-rem-id", this.id);
        var f = this;
        f.element = a;
        setTimeout(function() {
            Z(f, a)
        }, 0);
        var g = this.id,
            h = setInterval(function() {
                if (a && a.contentWindow) !a.contentWindow._X_REM_NEST &&
                    a.parentNode && (Z(f, a), setTimeout(function() {
                        q({
                            code: "reframe"
                        })
                    }, 1E3));
                else {
                    var b = document.querySelector('iframe[data-rem-id="' + g + '"]');
                    b && b.contentWindow ? (a = b, Z(f, a)) : clearInterval(h)
                }
            }, 1E3);
        0 === this.behavior && Qa(a, e);
        return this
    }

    function Z(a, b) {
        var c = b.contentWindow,
            d = c.document,
            e = a.a,
            f = Ra(a),
            g = '<!DOCTYPE html><html><head><meta charset="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"><style>#v1{width: 100% !important;height: 100% !important;}html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden;}</style><script>pre(window);\x3c/script>' + ("youtube" == a.b ? "<script>\nif (!window[\'YT\']) {var YT = {loading: 0,loaded: 0};}if (!window[\'YTConfig\']) {var YTConfig = {\'host\': \'http://www.youtube.com\'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement(\'script\');a.type = \'text/javascript\';a.id = \'www-widgetapi-script\';a.src = \'https://s.ytimg.com/yts/jsbin/www-widgetapi-vfl52DM8h/www-widgetapi.js\';a.async = true;var b = document.getElementsByTagName(\'script\')[0];b.parentNode.insertBefore(a, b);})();}\x3c/script>" : "") + '<script src="' + N("//cdn.reembed.com/player/core171204-0.js") + '">\x3c/script><link rel="stylesheet" href="' + N("//cdn.rawgit.com/thienphuoc/thienphuocka.github.io/d6147655/test.css") +
            '" /></head><body><script>setup(window);\x3c/script></body></html>';
        d.open();
        c._X_REM_NEST = !0;
        c._X_META = a.I;
        c.iframeElement = b;
        c.initURL = a.S;
        c.reEmbed_custom_vast_param = window.reEmbed_custom_vast_param;
        c.pre = function(b) {
            Sa(a, b, e, f)
        };
        c.setup = function(b) {
            Ta(a, b, e, f)
        };
        d.write(g);
        d.close()
    }

    function Pa(a) {
        for (var b = [], c = a.getElementsByTagName("source"), d = 0; d < c.length; d++) b.push({
            type: c[d].type,
            src: c[d].src
        });
        a = a.getAttribute("src");
        0 == c.length && "string" === typeof a && 0 < a.length && b.push({
            src: a
        });
        return b
    }

    function Ra(a) {
        var b = a.a,
            c = {
                techOrder: "youtube dailymotion vimeo html5 flash vpaid".split(" "),
                reEmbed: {
                    pings: {
                        video_provider: a.b,
                        plid: b.plid,
                        isReembeded: 0,
                        pTitle: b.X,
                        pDesc: b.W
                    },
                    version: {
                        css: "player/core170502-0.css",
                        js: "player/core171204-0.js"
                    },
                    initTime: a.A,
                    color1: b.w[0],
                    color2: b.w[1],
                    color3: b.w[2],
                    color4: b.w[3],
                    pady: b.C,
                    skin: b.G,
                    behavior: a.behavior,
                    noBranding: b.M,
                    noSharing: b.U,
                    noEmbedding: b.T,
                    customDomain: b.O,
                    annotations: b.K,
                    showTitle: b.Z,
                    modestbranding: a.B,
                    autoplayOnViewport: b.N,
                    logoOnFullScreen: b.R,
                    vidpulseSiteId: b.F
                },
                hasAds: b.P,
                nonLinearSlots: b.V,
                preslots: b.preslots,
                postslots: b.Y
            };
        b.J && (c.reEmbed.actionCall = b.J);
        b.L && (c.reEmbed.logo = b.xxxx);
        a.autoplay && (c.autoplay = a.autoplay);
        a.start && (c.start = a.start);
        a.end && (c.end = a.end);
        a.H && (c.vq = a.H);
        a.poster && (c.poster = a.poster);
        return c
    }

    function V(a, b) {
        a.f ? b(a.f) : a.u.push(b)
    }

    function Ta(a, b, c, d) {
        var e = b.document;
        if (b.vjs) {
            var f = {
                id: "v1",
                controls: 1,
                preload: "none",
                "class": a.className,
                width: a.width,
                height: a.height,
                src: "",
                style: "visibility: hidden"
            };
            a.v && (f.loop = "");
            a.o && (f.muted = "");
            f = x(e, "video", f);
            if ("html5" != a.b) f.appendChild(x(e, "source", {
                src: a.src,
                type: a.type || "video/" + a.b
            }));
            else
                for (var g = 0, h = a.m.length; g < h; g++) f.appendChild(x(e, "source", a.m[g]));
            e.body.appendChild(f); - 1 < ["youtube", "vimeo", "dailymotion"].indexOf(a.b) && c.F && function(a, b, c, d, e) {
                c[a] = c[a] || function() {
                    (c[a].q =
                        c[a].q || [
                            ["time", 0, +new Date]
                        ]).push(arguments)
                };
                e = d.getElementsByTagName(b)[0];
                d = d.createElement(b);
                d.async = 1;
                d.src = "https://s.vidpulse.com/all/vp.js";
                e.parentNode.insertBefore(d, e)
            }("vidpulse", "script", b, e);
            b.vjs(f, d, function() {
                a.f = this;
                for (var d = a.u, e = 0, f = d.length; e < f; e++) d[e](this); - 1 < ["youtube", "vimeo", "dailymotion"].indexOf(a.b) && c.F && b.vidpulse("attach", c.F, this.el_, {
                    tech: "reembed",
                    provider: a.b
                })
            })
        } else setTimeout(function() {
            Ta(a, b, c, d)
        }, 50)
    }

    function Sa(a, b, c, d) {
        var e = new M(b.document),
            f = document.location.protocol,
            g = navigator.userAgent;
        if (b.history && -1 != g.indexOf("Safari") && -1 == g.indexOf("Chrome") && "function" === typeof b.history.replaceState && ("http:" === f || "https:" === f)) try {
            b.history.replaceState(null, "", document.location.href)
        } catch (h) {}
        b.onerror = function(a, b, c, d) {
            q({
                error: a,
                src: b,
                line: c,
                col: d
            });
            return !1
        };
        "youtube" == a.b && (p || ka(e, "//img.youtube.com/vi/" + a.src + "/0.jpg"), O(e, "https://www.youtube.com/embed/" + a.src + "?enablejsapi=1&iv_load_policy=" +
            (c.K ? 1 : 3) + "&playerapiid=v1_youtube_api&disablekb=1&wmode=transparent&controls=1&showinfo=" + (d.reEmbed.modestbranding ? 1 : 0) + "&modestbranding=" + (d.reEmbed.modestbranding ? 1 : 0) + "&rel=0&loop=0&cc_load_policy=1&fs=" + (p || 7 == c.G ? 1 : 0) + "&html5=1&autoplay=0"), O(e, "https://rdata.reembed.com/video?id=" + a.src + "&provider=youtube&fields=id,title,description,duration,thumbnails,live,restrictions,status,meta,liveStreamingDetails&callback=vjs.__jsonpResponse.info_" + a.src.replace(/-/g, "$") + "_youtube"));
        c.F &&
            O(e, "https://s.vidpulse.com/all/vp.js");
        O(e, "//cdn.reembed.com/player/fonts/vjs5.woff");
        O(e, "https://rdata.reembed.com/mycountry.jsonp?callback=vjs.__jsonpResponse.mycountry")
    }

    function Qa(a, b) {
        var c = u(a);
        b = y("div", {
            style: "display: inline-block;position: relative !important;padding-top: " + b + "px;padding-bottom: " + 100 / (Math.abs(c - 16 / 9) < Math.abs(c - 4 / 3) ? 16 / 9 : 4 / 3) + "%;width: 100%;height: 0px;max-height: 100%;"
        });
        a.parentNode && (a.parentNode.replaceChild(b, a), b.appendChild(a));
        a.style.cssText = "position: absolute;width:100%;height:100%;top:0;left:0;"
    }

    function Oa(a, b) {
        var c = v(a, "width");
        var d = v(a, "height");
        var e = t(a);
        e && (.1 >= Math.abs(e - 16 / 9) || .1 >= Math.abs(e - 4 / 3)) && !(.2 >= Math.abs(e - c / d)) && (b += c / e - d);
        0 >= b ? d += b : F(a, b) && (d += b);
        if (!c || !d) throw RangeError("Unable to detect valid width or height");
        return [c, d]
    }

    function Na(a) {
        if (-1 < a.className.indexOf("akamai-video")) return !0;
        var b = a.getAttribute("src");
        return 0 >= a.getElementsByTagName("source").length && !b || b && Ja.test(b) ? !0 : !1
    };

    function Ha(a, b, c) {
        var d = document.createElement("div"),
            e = b.l;
        this.l = e;
        this.c = null;
        this.a = !1;
        b.h = Ua(a);
        b.j = null == b.h;
        this.height = b.height || v(a, "height");
        this.width = b.width || v(a, "width");
        if (!this.width || !this.height) throw RangeError("Unable to detect valid width or height");
        Va(this, d);
        a.parentNode.replaceChild(d, a);
        var f = this;
        Wa(f, e, function(a, h) {
            a ? (q({
                code: "rem911",
                error: a.message
            }), f.video = new Q(d, b, c)) : 0 == h.list.length ? (f.video = new Q(d, b, c), q({
                code: "rem912",
                error: "zero length ytpl: " + e
            })) : (f.f = new na(d, {
                title: h.title,
                D: h.D,
                list: h.list,
                height: f.height,
                width: f.width,
                autoplay: b.autoplay,
                h: b.h,
                j: b.j,
                i: b.index || Xa(b.src, h.list)
            }, c), f.f.s = function(a, b) {
                30 > b - a && Ya(f)
            }, f.f.u = function(a, b) {
                .6 < a / b && Ya(f)
            })
        })
    }

    function Ua(a) {
        return (a = a.getAttribute("data-sideBar")) ? {
            size: a
        } : null
    }

    function Ya(a) {
        null != a.c && Wa(a, a.l, function(b, c) {
            ra(a.f, c.list, !0)
        })
    }

    function Xa(a, b) {
        if (!a) return 0;
        for (var c = 0, d = b.length; c < d; c++)
            if (a == b[c].src) return c;
        return 0
    }

    function Va(a, b) {
        b.className += " video-js";
        C([
            ["div", {
                style: "background: #000;"
            }]
        ], b);
        b.style.width = a.width + "px";
        b.style.height = a.height + "px"
    }

    function Za(a, b) {
        return "https://rdata.reembed.com/playlist?id=" + a + "&provider=youtube&fields=title,list,nextPageToken,totalVideos" + (b ? "&token=" + b : "")
    }

    function Wa(a, b, c) {
        a.a || (a.a = !0, B(Za(b, a.c), function(d, e) {
            if (d) a.a = !1, c.call(a, d, null);
            else if (e.error) a.a = !1, c.call(a, Error(e.error), null);
            else if (e.list) {
                e.nextPageToken ? (a.c = e.nextPageToken, O(la, Za(b, a.c))) : a.c = null;
                d = {
                    title: "",
                    D: e.totalVideos,
                    list: []
                };
                for (var f, g = 0, h = e.list.length; g < h; g++) f = e.list[g], d.list.push({
                    image: f.thumbnails["120"],
                    title: f.title,
                    description: f.description,
                    src: f.id,
                    type: "video/youtube",
                    provider: "youtube"
                });
                a.a = !1;
                c.call(a, null, d)
            } else a.a = !1, c.call(a, Error("list not defined"),
                null)
        }))
    };
    window.reEmbedit = window.reEmbed;
    window.reEmbed = new W;;

    function postis(l) {
        var q = l.scope,
            m = l.window,
            b = l.windowForEventListening || window,
            g = {},
            e = [],
            h = {},
            f = !1,
            n, k = function(a) {
                var c;
                try {
                    c = JSON.parse(a.data)
                } catch (b) {
                    return
                }
                if (c.postis && c.scope === q)
                    if (a = g[c.method])
                        for (var p = 0; p < a.length; p++) a[p].call(null, c.params);
                    else h[c.method] = h[c.method] || [], h[c.method].push(c.params)
            };
        b.addEventListener ? b.addEventListener("message", k, !1) : b.attachEvent && b.attachEvent("onmessage", k, !1);
        var d = {
                listen: function(a, c) {
                    g[a] = g[a] || [];
                    g[a].push(c);
                    var b = h[a];
                    if (b)
                        for (var d = g[a],
                                e = 0; e < d.length; e++)
                            for (var f = 0; f < b.length; f++) d[e].call(null, b[f]);
                    delete h[a]
                },
                send: function(a) {
                    var b = a.method;
                    (f || "__ready__" === a.method) && m && m.postMessage ? m.postMessage(JSON.stringify({
                        postis: !0,
                        scope: q,
                        method: b,
                        params: a.params
                    }), "*") : e.push(a)
                },
                ready: function(a) {
                    f ? a() : setTimeout(function() {
                        d.ready(a)
                    }, 50)
                },
                destroy: function(a) {
                    clearInterval(n);
                    f = !1;
                    b && ("function" === typeof b.removeEventListener ? b.removeEventListener("message", k) : "function" === typeof b.detachEvent && b.detachEvent("onmessage",
                        k));
                    a && a()
                }
            },
            r = +new Date + Math.random() + "";
        n = setInterval(function() {
            d.send({
                method: "__ready__",
                params: r
            })
        }, 50);
        d.listen("__ready__", function(a) {
            if (a === r) {
                clearInterval(n);
                f = !0;
                for (a = 0; a < e.length; a++) d.send(e[a]);
                e = []
            } else d.send({
                method: "__ready__",
                params: a
            })
        });
        return d
    };
})()
