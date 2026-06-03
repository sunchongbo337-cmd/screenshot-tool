(function() {
  "use strict";
  var A = function() {
    return A = Object.assign || function(A2) {
      for (var e2, t2 = 1, n2 = arguments.length; t2 < n2; t2++) for (var r2 in e2 = arguments[t2]) Object.prototype.hasOwnProperty.call(e2, r2) && (A2[r2] = e2[r2]);
      return A2;
    }, A.apply(this, arguments);
  };
  function e(A2, e2, t2, n2) {
    return new (t2 || (t2 = Promise))(function(r2, o2) {
      function i2(A3) {
        try {
          a2(n2.next(A3));
        } catch (A4) {
          o2(A4);
        }
      }
      function s2(A3) {
        try {
          a2(n2.throw(A3));
        } catch (A4) {
          o2(A4);
        }
      }
      function a2(A3) {
        var e3;
        A3.done ? r2(A3.value) : (e3 = A3.value, e3 instanceof t2 ? e3 : new t2(function(A4) {
          A4(e3);
        })).then(i2, s2);
      }
      a2((n2 = n2.apply(A2, [])).next());
    });
  }
  function t(A2, e2) {
    var t2, n2, r2, o2 = { label: 0, sent: function() {
      if (1 & r2[0]) throw r2[1];
      return r2[1];
    }, trys: [], ops: [] }, i2 = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
    return i2.next = s2(0), i2.throw = s2(1), i2.return = s2(2), "function" == typeof Symbol && (i2[Symbol.iterator] = function() {
      return this;
    }), i2;
    function s2(s3) {
      return function(a2) {
        return function(s4) {
          if (t2) throw new TypeError("Generator is already executing.");
          for (; i2 && (i2 = 0, s4[0] && (o2 = 0)), o2; ) try {
            if (t2 = 1, n2 && (r2 = 2 & s4[0] ? n2.return : s4[0] ? n2.throw || ((r2 = n2.return) && r2.call(n2), 0) : n2.next) && !(r2 = r2.call(n2, s4[1])).done) return r2;
            switch (n2 = 0, r2 && (s4 = [2 & s4[0], r2.value]), s4[0]) {
              case 0:
              case 1:
                r2 = s4;
                break;
              case 4:
                return o2.label++, { value: s4[1], done: false };
              case 5:
                o2.label++, n2 = s4[1], s4 = [0];
                continue;
              case 7:
                s4 = o2.ops.pop(), o2.trys.pop();
                continue;
              default:
                if (!(r2 = o2.trys, (r2 = r2.length > 0 && r2[r2.length - 1]) || 6 !== s4[0] && 2 !== s4[0])) {
                  o2 = 0;
                  continue;
                }
                if (3 === s4[0] && (!r2 || s4[1] > r2[0] && s4[1] < r2[3])) {
                  o2.label = s4[1];
                  break;
                }
                if (6 === s4[0] && o2.label < r2[1]) {
                  o2.label = r2[1], r2 = s4;
                  break;
                }
                if (r2 && o2.label < r2[2]) {
                  o2.label = r2[2], o2.ops.push(s4);
                  break;
                }
                r2[2] && o2.ops.pop(), o2.trys.pop();
                continue;
            }
            s4 = e2.call(A2, o2);
          } catch (A3) {
            s4 = [6, A3], n2 = 0;
          } finally {
            t2 = r2 = 0;
          }
          if (5 & s4[0]) throw s4[1];
          return { value: s4[0] ? s4[1] : void 0, done: true };
        }([s3, a2]);
      };
    }
  }
  function n(A2, e2, t2) {
    if (t2 || 2 === arguments.length) for (var n2, r2 = 0, o2 = e2.length; r2 < o2; r2++) !n2 && r2 in e2 || (n2 || (n2 = Array.prototype.slice.call(e2, 0, r2)), n2[r2] = e2[r2]);
    return A2.concat(n2 || Array.prototype.slice.call(e2));
  }
  "function" == typeof SuppressedError && SuppressedError;
  var r = function() {
  };
  function o(A2, e2, t2) {
    var n2 = l(e2);
    t2 && (n2 = c(e2));
    for (var r2 = (A2.path || A2.composedPath && A2.composedPath())[1].children, o2 = 0; o2 < r2.length; o2++) {
      var i2 = r2[o2];
      if (Number(i2.getAttribute("data-id")) > 100 && e2 !== Number.MAX_VALUE) {
        var s2 = i2.getAttribute("data-icon");
        i2.style.backgroundImage = "url(".concat(s2, ")");
      }
      i2.className.includes("active") && i2.classList.remove(i2.classList[2]);
    }
    n2 && (A2.target.className += " " + n2);
  }
  function i(A2, e2) {
    if (null != A2 && null != e2) {
      var t2 = l(e2);
      if (t2) for (var r2 = new Set(n(n([], Object.values(s), true), Object.values(a), true)), o2 = A2.children, i2 = function(A3) {
        var n2 = o2[A3];
        n2.classList.forEach(function(A4) {
          r2.has(A4) && n2.classList.remove(A4);
        });
        var i3 = Number(n2.getAttribute("data-id"));
        Number.isNaN(i3) || i3 !== e2 || n2.classList.add(t2);
      }, c2 = 0; c2 < o2.length; c2++) i2(c2);
    }
  }
  var s = { 1: "square-active", 2: "round-active", 3: "right-top-active", 4: "brush-active", 5: "mosaicPen-active", 6: "text-active" }, a = { 1: "brush-small-active", 2: "brush-medium-active", 3: "brush-big-active" }, l = function(A2) {
    var e2;
    return null !== (e2 = s[A2]) && void 0 !== e2 ? e2 : "";
  }, c = function(A2) {
    var e2;
    return null !== (e2 = a[A2]) && void 0 !== e2 ? e2 : "";
  };
  function u(A2, e2, t2) {
    var n2 = window.devicePixelRatio || 1;
    A2.width = Math.round(e2 * n2), A2.height = Math.round(t2 * n2), A2.style.width = e2 + "px", A2.style.height = t2 + "px";
    var r2 = A2.getContext("2d");
    return r2 && r2.scale(n2, n2), r2;
  }
  function B(A2) {
    for (var e2 = arguments.length, t2 = new Array(e2 > 1 ? e2 - 1 : 0), n2 = 1; n2 < e2; n2++) t2[n2 - 1] = arguments[n2];
    throw new Error("number" == typeof A2 ? "[MobX] minified error nr: " + A2 + (t2.length ? " " + t2.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + A2);
  }
  var h = {};
  function g() {
    return "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : h;
  }
  var d = Object.assign, w = Object.getOwnPropertyDescriptor, f = Object.defineProperty, p = Object.prototype, C = [];
  Object.freeze(C);
  var Q = {};
  Object.freeze(Q);
  var v = "undefined" != typeof Proxy, U = Object.toString();
  function m() {
    v || B("Proxy not available");
  }
  function F(A2) {
    var e2 = false;
    return function() {
      if (!e2) return e2 = true, A2.apply(this, arguments);
    };
  }
  var y = function() {
  };
  function E(A2) {
    return "function" == typeof A2;
  }
  function b(A2) {
    switch (typeof A2) {
      case "string":
      case "symbol":
      case "number":
        return true;
    }
    return false;
  }
  function I(A2) {
    return null !== A2 && "object" == typeof A2;
  }
  function H(A2) {
    if (!I(A2)) return false;
    var e2 = Object.getPrototypeOf(A2);
    if (null == e2) return true;
    var t2 = Object.hasOwnProperty.call(e2, "constructor") && e2.constructor;
    return "function" == typeof t2 && t2.toString() === U;
  }
  function S(A2) {
    var e2 = null == A2 ? void 0 : A2.constructor;
    return !!e2 && ("GeneratorFunction" === e2.name || "GeneratorFunction" === e2.displayName);
  }
  function x(A2, e2, t2) {
    f(A2, e2, { enumerable: false, writable: true, configurable: true, value: t2 });
  }
  function K(A2, e2, t2) {
    f(A2, e2, { enumerable: false, writable: false, configurable: true, value: t2 });
  }
  function D(A2, e2) {
    var t2 = "isMobX" + A2;
    return e2.prototype[t2] = true, function(A3) {
      return I(A3) && true === A3[t2];
    };
  }
  function L(A2) {
    return null != A2 && "[object Map]" === Object.prototype.toString.call(A2);
  }
  function O(A2) {
    return null != A2 && "[object Set]" === Object.prototype.toString.call(A2);
  }
  var k = void 0 !== Object.getOwnPropertySymbols;
  var M = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : k ? function(A2) {
    return Object.getOwnPropertyNames(A2).concat(Object.getOwnPropertySymbols(A2));
  } : Object.getOwnPropertyNames;
  function P(A2) {
    return null === A2 ? null : "object" == typeof A2 ? "" + A2 : A2;
  }
  function T(A2, e2) {
    return p.hasOwnProperty.call(A2, e2);
  }
  var R = Object.getOwnPropertyDescriptors || function(A2) {
    var e2 = {};
    return M(A2).forEach(function(t2) {
      e2[t2] = w(A2, t2);
    }), e2;
  };
  function G(A2, e2) {
    return !!(A2 & e2);
  }
  function V(A2, e2, t2) {
    return t2 ? A2 |= e2 : A2 &= ~e2, A2;
  }
  function N(A2, e2) {
    (null == e2 || e2 > A2.length) && (e2 = A2.length);
    for (var t2 = 0, n2 = Array(e2); t2 < e2; t2++) n2[t2] = A2[t2];
    return n2;
  }
  function X(A2, e2) {
    for (var t2 = 0; t2 < e2.length; t2++) {
      var n2 = e2[t2];
      n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(A2, Z(n2.key), n2);
    }
  }
  function _(A2, e2, t2) {
    return e2 && X(A2.prototype, e2), Object.defineProperty(A2, "prototype", { writable: false }), A2;
  }
  function Y(A2, e2) {
    var t2 = "undefined" != typeof Symbol && A2[Symbol.iterator] || A2["@@iterator"];
    if (t2) return (t2 = t2.call(A2)).next.bind(t2);
    if (Array.isArray(A2) || (t2 = function(A3, e3) {
      if (A3) {
        if ("string" == typeof A3) return N(A3, e3);
        var t3 = {}.toString.call(A3).slice(8, -1);
        return "Object" === t3 && A3.constructor && (t3 = A3.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(A3) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? N(A3, e3) : void 0;
      }
    }(A2)) || e2) {
      t2 && (A2 = t2);
      var n2 = 0;
      return function() {
        return n2 >= A2.length ? { done: true } : { done: false, value: A2[n2++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function J() {
    return J = Object.assign ? Object.assign.bind() : function(A2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var t2 = arguments[e2];
        for (var n2 in t2) ({}).hasOwnProperty.call(t2, n2) && (A2[n2] = t2[n2]);
      }
      return A2;
    }, J.apply(null, arguments);
  }
  function W(A2, e2) {
    A2.prototype = Object.create(e2.prototype), A2.prototype.constructor = A2, z(A2, e2);
  }
  function z(A2, e2) {
    return z = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(A3, e3) {
      return A3.__proto__ = e3, A3;
    }, z(A2, e2);
  }
  function Z(A2) {
    var e2 = function(A3, e3) {
      if ("object" != typeof A3 || !A3) return A3;
      var t2 = A3[Symbol.toPrimitive];
      if (void 0 !== t2) {
        var n2 = t2.call(A3, e3);
        if ("object" != typeof n2) return n2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return String(A3);
    }(A2, "string");
    return "symbol" == typeof e2 ? e2 : e2 + "";
  }
  var j = Symbol("mobx-stored-annotations");
  function q(A2) {
    return Object.assign(function(e2, t2) {
      if (AA(t2)) return A2.decorate_20223_(e2, t2);
      $(e2, t2, A2);
    }, A2);
  }
  function $(A2, e2, t2) {
    T(A2, j) || x(A2, j, J({}, A2[j])), function(A3) {
      return A3.annotationType_ === aA;
    }(t2) || (A2[j][e2] = t2);
  }
  function AA(A2) {
    return "object" == typeof A2 && "string" == typeof A2.kind;
  }
  var eA = Symbol("mobx administration"), tA = function() {
    function A2(A3) {
      void 0 === A3 && (A3 = "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = oe.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = A3;
    }
    var e2 = A2.prototype;
    return e2.onBO = function() {
      this.onBOL && this.onBOL.forEach(function(A3) {
        return A3();
      });
    }, e2.onBUO = function() {
      this.onBUOL && this.onBUOL.forEach(function(A3) {
        return A3();
      });
    }, e2.reportObserved = function() {
      return be(this);
    }, e2.reportChanged = function() {
      ye(), Ie(this), Ee();
    }, e2.toString = function() {
      return this.name_;
    }, _(A2, [{ key: "isBeingObserved", get: function() {
      return G(this.flags_, A2.isBeingObservedMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isBeingObservedMask_, e3);
    } }, { key: "isPendingUnobservation", get: function() {
      return G(this.flags_, A2.isPendingUnobservationMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isPendingUnobservationMask_, e3);
    } }, { key: "diffValue", get: function() {
      return G(this.flags_, A2.diffValueMask_) ? 1 : 0;
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.diffValueMask_, 1 === e3);
    } }]);
  }();
  tA.isBeingObservedMask_ = 1, tA.isPendingUnobservationMask_ = 2, tA.diffValueMask_ = 4;
  var nA = D("Atom", tA);
  function rA(A2, e2, t2) {
    void 0 === e2 && (e2 = y), void 0 === t2 && (t2 = y);
    var n2, r2 = new tA(A2);
    return e2 !== y && qe(ze, r2, e2, n2), t2 !== y && je(r2, t2), r2;
  }
  var oA = { structural: function(A2, e2) {
    return hn(A2, e2);
  }, default: function(A2, e2) {
    return Object.is ? Object.is(A2, e2) : A2 === e2 ? 0 !== A2 || 1 / A2 == 1 / e2 : A2 != A2 && e2 != e2;
  } };
  function iA(A2, e2, t2) {
    return st(A2) ? A2 : Array.isArray(A2) ? XA.array(A2, { name: t2 }) : H(A2) ? XA.object(A2, void 0, { name: t2 }) : L(A2) ? XA.map(A2, { name: t2 }) : O(A2) ? XA.set(A2, { name: t2 }) : "function" != typeof A2 || _e(A2) || it(A2) ? A2 : S(A2) ? rt(A2) : Xe(t2, A2);
  }
  function sA(A2) {
    return A2;
  }
  var aA = "override";
  function lA(A2, e2) {
    return { annotationType_: A2, options_: e2, make_: cA, extend_: uA, decorate_20223_: BA };
  }
  function cA(A2, e2, t2, n2) {
    var r2;
    if (null != (r2 = this.options_) && r2.bound) return null === this.extend_(A2, e2, t2, false) ? 0 : 1;
    if (n2 === A2.target_) return null === this.extend_(A2, e2, t2, false) ? 0 : 2;
    if (_e(t2.value)) return 1;
    var o2 = hA(A2, this, e2, t2, false);
    return f(n2, e2, o2), 2;
  }
  function uA(A2, e2, t2, n2) {
    var r2 = hA(A2, this, e2, t2);
    return A2.defineProperty_(e2, r2, n2);
  }
  function BA(A2, e2) {
    var t2, n2 = e2.kind, r2 = e2.name, o2 = e2.addInitializer, i2 = this, s2 = function(A3) {
      var e3, t3, n3, o3;
      return $A(null != (e3 = null == (t3 = i2.options_) ? void 0 : t3.name) ? e3 : r2.toString(), A3, null != (n3 = null == (o3 = i2.options_) ? void 0 : o3.autoAction) && n3);
    };
    return "field" == n2 ? function(A3) {
      var e3, t3 = A3;
      return _e(t3) || (t3 = s2(t3)), null != (e3 = i2.options_) && e3.bound && ((t3 = t3.bind(this)).isMobxAction = true), t3;
    } : "method" == n2 ? (_e(A2) || (A2 = s2(A2)), null != (t2 = this.options_) && t2.bound && o2(function() {
      var A3 = this, e3 = A3[r2].bind(A3);
      e3.isMobxAction = true, A3[r2] = e3;
    }), A2) : void B("Cannot apply '" + i2.annotationType_ + "' to '" + String(r2) + "' (kind: " + n2 + "):\n'" + i2.annotationType_ + "' can only be used on properties with a function value.");
  }
  function hA(A2, e2, t2, n2, r2) {
    var o2, i2, s2, a2, l2, c2, u2, B2;
    void 0 === r2 && (r2 = ve.safeDescriptors), B2 = n2, e2.annotationType_, B2.value;
    var h2, g2 = n2.value;
    null != (o2 = e2.options_) && o2.bound && (g2 = g2.bind(null != (h2 = A2.proxy_) ? h2 : A2.target_));
    return { value: $A(null != (i2 = null == (s2 = e2.options_) ? void 0 : s2.name) ? i2 : t2.toString(), g2, null != (a2 = null == (l2 = e2.options_) ? void 0 : l2.autoAction) && a2, null != (c2 = e2.options_) && c2.bound ? null != (u2 = A2.proxy_) ? u2 : A2.target_ : void 0), configurable: !r2 || A2.isPlainObject_, enumerable: false, writable: !r2 };
  }
  function gA(A2, e2) {
    return { annotationType_: A2, options_: e2, make_: dA, extend_: wA, decorate_20223_: fA };
  }
  function dA(A2, e2, t2, n2) {
    var r2;
    if (n2 === A2.target_) return null === this.extend_(A2, e2, t2, false) ? 0 : 2;
    if (null != (r2 = this.options_) && r2.bound && (!T(A2.target_, e2) || !it(A2.target_[e2])) && null === this.extend_(A2, e2, t2, false)) return 0;
    if (it(t2.value)) return 1;
    var o2 = pA(A2, this, e2, t2, false, false);
    return f(n2, e2, o2), 2;
  }
  function wA(A2, e2, t2, n2) {
    var r2, o2 = pA(A2, this, e2, t2, null == (r2 = this.options_) ? void 0 : r2.bound);
    return A2.defineProperty_(e2, o2, n2);
  }
  function fA(A2, e2) {
    var t2, n2 = e2.name, r2 = e2.addInitializer;
    return it(A2) || (A2 = rt(A2)), null != (t2 = this.options_) && t2.bound && r2(function() {
      var A3 = this, e3 = A3[n2].bind(A3);
      e3.isMobXFlow = true, A3[n2] = e3;
    }), A2;
  }
  function pA(A2, e2, t2, n2, r2, o2) {
    var i2;
    void 0 === o2 && (o2 = ve.safeDescriptors), i2 = n2, e2.annotationType_, i2.value;
    var s2, a2 = n2.value;
    (it(a2) || (a2 = rt(a2)), r2) && ((a2 = a2.bind(null != (s2 = A2.proxy_) ? s2 : A2.target_)).isMobXFlow = true);
    return { value: a2, configurable: !o2 || A2.isPlainObject_, enumerable: false, writable: !o2 };
  }
  function CA(A2, e2) {
    return { annotationType_: A2, options_: e2, make_: QA, extend_: vA, decorate_20223_: UA };
  }
  function QA(A2, e2, t2) {
    return null === this.extend_(A2, e2, t2, false) ? 0 : 1;
  }
  function vA(A2, e2, t2, n2) {
    var r2;
    return r2 = t2, this.annotationType_, r2.get, A2.defineComputedProperty_(e2, J({}, this.options_, { get: t2.get, set: t2.set }), n2);
  }
  function UA(A2, e2) {
    var t2 = this, n2 = e2.name;
    return (0, e2.addInitializer)(function() {
      var e3 = Xt(this)[eA], r2 = J({}, t2.options_, { get: A2, context: this });
      r2.name || (r2.name = "ObservableObject." + n2.toString()), e3.values_.set(n2, new re(r2));
    }), function() {
      return this[eA].getObservablePropValue_(n2);
    };
  }
  function mA(A2, e2) {
    return { annotationType_: A2, options_: e2, make_: FA, extend_: yA, decorate_20223_: EA };
  }
  function FA(A2, e2, t2) {
    return null === this.extend_(A2, e2, t2, false) ? 0 : 1;
  }
  function yA(A2, e2, t2, n2) {
    var r2, o2;
    return this.annotationType_, A2.defineObservableProperty_(e2, t2.value, null != (r2 = null == (o2 = this.options_) ? void 0 : o2.enhancer) ? r2 : iA, n2);
  }
  function EA(A2, e2) {
    var t2 = this, n2 = e2.kind, r2 = e2.name, o2 = /* @__PURE__ */ new WeakSet();
    function i2(A3, e3) {
      var n3, i3, s2 = Xt(A3)[eA], a2 = new ne(e3, null != (n3 = null == (i3 = t2.options_) ? void 0 : i3.enhancer) ? n3 : iA, "ObservableObject." + r2.toString(), false);
      s2.values_.set(r2, a2), o2.add(A3);
    }
    if ("accessor" == n2) return { get: function() {
      return o2.has(this) || i2(this, A2.get.call(this)), this[eA].getObservablePropValue_(r2);
    }, set: function(A3) {
      return o2.has(this) || i2(this, A3), this[eA].setObservablePropValue_(r2, A3);
    }, init: function(A3) {
      return o2.has(this) || i2(this, A3), A3;
    } };
  }
  var bA = "true", IA = HA();
  function HA(A2) {
    return { annotationType_: bA, options_: A2, make_: SA, extend_: xA, decorate_20223_: KA };
  }
  function SA(A2, e2, t2, n2) {
    var r2, o2, i2, s2;
    if (t2.get) return WA.make_(A2, e2, t2, n2);
    if (t2.set) {
      var a2 = _e(t2.set) ? t2.set : $A(e2.toString(), t2.set);
      return n2 === A2.target_ ? null === A2.defineProperty_(e2, { configurable: !ve.safeDescriptors || A2.isPlainObject_, set: a2 }) ? 0 : 2 : (f(n2, e2, { configurable: true, set: a2 }), 2);
    }
    if (n2 !== A2.target_ && "function" == typeof t2.value) return S(t2.value) ? (null != (s2 = this.options_) && s2.autoBind ? rt.bound : rt).make_(A2, e2, t2, n2) : (null != (i2 = this.options_) && i2.autoBind ? Xe.bound : Xe).make_(A2, e2, t2, n2);
    var l2, c2 = false === (null == (r2 = this.options_) ? void 0 : r2.deep) ? XA.ref : XA;
    "function" == typeof t2.value && null != (o2 = this.options_) && o2.autoBind && (t2.value = t2.value.bind(null != (l2 = A2.proxy_) ? l2 : A2.target_));
    return c2.make_(A2, e2, t2, n2);
  }
  function xA(A2, e2, t2, n2) {
    var r2, o2, i2;
    if (t2.get) return WA.extend_(A2, e2, t2, n2);
    if (t2.set) return A2.defineProperty_(e2, { configurable: !ve.safeDescriptors || A2.isPlainObject_, set: $A(e2.toString(), t2.set) }, n2);
    "function" == typeof t2.value && null != (r2 = this.options_) && r2.autoBind && (t2.value = t2.value.bind(null != (i2 = A2.proxy_) ? i2 : A2.target_));
    return (false === (null == (o2 = this.options_) ? void 0 : o2.deep) ? XA.ref : XA).extend_(A2, e2, t2, n2);
  }
  function KA(A2, e2) {
    B("'" + this.annotationType_ + "' cannot be used as a decorator");
  }
  var DA = { deep: true, name: void 0, defaultDecorator: void 0, proxy: true };
  function LA(A2) {
    return A2 || DA;
  }
  Object.freeze(DA);
  var OA = mA("observable"), kA = mA("observable.ref", { enhancer: sA }), MA = mA("observable.shallow", { enhancer: function(A2, e2, t2) {
    return null == A2 || Jt(A2) || St(A2) || Ot(A2) || Tt(A2) ? A2 : Array.isArray(A2) ? XA.array(A2, { name: t2, deep: false }) : H(A2) ? XA.object(A2, void 0, { name: t2, deep: false }) : L(A2) ? XA.map(A2, { name: t2, deep: false }) : O(A2) ? XA.set(A2, { name: t2, deep: false }) : void 0;
  } }), PA = mA("observable.struct", { enhancer: function(A2, e2) {
    return hn(A2, e2) ? e2 : A2;
  } }), TA = q(OA);
  function RA(A2) {
    return true === A2.deep ? iA : false === A2.deep ? sA : (e2 = A2.defaultDecorator) && null != (t2 = null == (n2 = e2.options_) ? void 0 : n2.enhancer) ? t2 : iA;
    var e2, t2, n2;
  }
  function GA(A2, e2, t2) {
    return AA(e2) ? OA.decorate_20223_(A2, e2) : b(e2) ? void $(A2, e2, OA) : st(A2) ? A2 : H(A2) ? XA.object(A2, e2, t2) : Array.isArray(A2) ? XA.array(A2, e2) : L(A2) ? XA.map(A2, e2) : O(A2) ? XA.set(A2, e2) : "object" == typeof A2 && null !== A2 ? A2 : XA.box(A2, e2);
  }
  d(GA, TA);
  var VA, NA, XA = d(GA, { box: function(A2, e2) {
    var t2 = LA(e2);
    return new ne(A2, RA(t2), t2.name, true, t2.equals);
  }, array: function(A2, e2) {
    var t2 = LA(e2);
    return (false === ve.useProxies || false === t2.proxy ? on : mt)(A2, RA(t2), t2.name);
  }, map: function(A2, e2) {
    var t2 = LA(e2);
    return new Lt(A2, RA(t2), t2.name);
  }, set: function(A2, e2) {
    var t2 = LA(e2);
    return new Pt(A2, RA(t2), t2.name);
  }, object: function(A2, e2, t2) {
    return cn(function() {
      return $e(false === ve.useProxies || false === (null == t2 ? void 0 : t2.proxy) ? Xt({}, t2) : function(A3, e3) {
        var t3, n2;
        return m(), A3 = Xt(A3, e3), null != (n2 = (t3 = A3[eA]).proxy_) ? n2 : t3.proxy_ = new Proxy(A3, ct);
      }({}, t2), A2, e2);
    });
  }, ref: q(kA), shallow: q(MA), deep: TA, struct: q(PA) }), _A = "computed", YA = CA(_A), JA = CA("computed.struct", { equals: oA.structural }), WA = function(A2, e2) {
    if (AA(e2)) return YA.decorate_20223_(A2, e2);
    if (b(e2)) return $(A2, e2, YA);
    if (H(A2)) return q(CA(_A, A2));
    var t2 = H(e2) ? e2 : {};
    return t2.get = A2, t2.name || (t2.name = A2.name || ""), new re(t2);
  };
  Object.assign(WA, YA), WA.struct = q(JA);
  var zA = 0, ZA = 1, jA = null != (VA = null == (NA = w(function() {
  }, "name")) ? void 0 : NA.configurable) && VA, qA = { value: "action", configurable: true, writable: false, enumerable: false };
  function $A(A2, e2, t2, n2) {
    function r2() {
      return Ae(A2, t2, e2, n2 || this, arguments);
    }
    return void 0 === t2 && (t2 = false), r2.isMobxAction = true, r2.toString = function() {
      return e2.toString();
    }, jA && (qA.value = A2, f(r2, "name", qA)), r2;
  }
  function Ae(A2, e2, t2, n2, r2) {
    var o2 = function(A3, e3) {
      var t3 = false, n3 = 0, r3 = ve.trackingDerivation, o3 = !e3 || !r3;
      ye();
      var i2 = ve.allowStateChanges;
      o3 && (ge(), i2 = ee(true));
      var s2 = we(true), a2 = { runAsAction_: o3, prevDerivation_: r3, prevAllowStateChanges_: i2, prevAllowStateReads_: s2, notifySpy_: t3, startTime_: n3, actionId_: ZA++, parentActionId_: zA };
      return zA = a2.actionId_, a2;
    }(0, e2);
    try {
      return t2.apply(n2, r2);
    } catch (A3) {
      throw o2.error_ = A3, A3;
    } finally {
      !function(A3) {
        zA !== A3.actionId_ && B(30);
        zA = A3.parentActionId_, void 0 !== A3.error_ && (ve.suppressReactionErrors = true);
        te(A3.prevAllowStateChanges_), fe(A3.prevAllowStateReads_), Ee(), A3.runAsAction_ && de(A3.prevDerivation_);
        ve.suppressReactionErrors = false;
      }(o2);
    }
  }
  function ee(A2) {
    var e2 = ve.allowStateChanges;
    return ve.allowStateChanges = A2, e2;
  }
  function te(A2) {
    ve.allowStateChanges = A2;
  }
  var ne = function(A2) {
    function e2(e3, t3, n2, r2, o2) {
      var i2;
      return void 0 === n2 && (n2 = "ObservableValue"), void 0 === o2 && (o2 = oA.default), (i2 = A2.call(this, n2) || this).enhancer = void 0, i2.name_ = void 0, i2.equals = void 0, i2.hasUnreportedChange_ = false, i2.interceptors_ = void 0, i2.changeListeners_ = void 0, i2.value_ = void 0, i2.dehancer = void 0, i2.enhancer = t3, i2.name_ = n2, i2.equals = o2, i2.value_ = t3(e3, void 0, n2), i2;
    }
    W(e2, A2);
    var t2 = e2.prototype;
    return t2.dehanceValue = function(A3) {
      return void 0 !== this.dehancer ? this.dehancer(A3) : A3;
    }, t2.set = function(A3) {
      this.value_, (A3 = this.prepareNewValue_(A3)) !== ve.UNCHANGED && this.setNewValue_(A3);
    }, t2.prepareNewValue_ = function(A3) {
      if (ut(this)) {
        var e3 = ht(this, { object: this, type: Qt, newValue: A3 });
        if (!e3) return ve.UNCHANGED;
        A3 = e3.newValue;
      }
      return A3 = this.enhancer(A3, this.value_, this.name_), this.equals(this.value_, A3) ? ve.UNCHANGED : A3;
    }, t2.setNewValue_ = function(A3) {
      var e3 = this.value_;
      this.value_ = A3, this.reportChanged(), gt(this) && wt(this, { type: Qt, object: this, newValue: A3, oldValue: e3 });
    }, t2.get = function() {
      return this.reportObserved(), this.dehanceValue(this.value_);
    }, t2.intercept_ = function(A3) {
      return Bt(this, A3);
    }, t2.observe_ = function(A3, e3) {
      return e3 && A3({ observableKind: "value", debugObjectName: this.name_, object: this, type: Qt, newValue: this.value_, oldValue: void 0 }), dt(this, A3);
    }, t2.raw = function() {
      return this.value_;
    }, t2.toJSON = function() {
      return this.get();
    }, t2.toString = function() {
      return this.name_ + "[" + this.value_ + "]";
    }, t2.valueOf = function() {
      return P(this.get());
    }, t2[Symbol.toPrimitive] = function() {
      return this.valueOf();
    }, e2;
  }(tA), re = function() {
    function A2(A3) {
      this.dependenciesState_ = oe.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = oe.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new ae(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = ie.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, A3.get || B(31), this.derivation = A3.get, this.name_ = A3.name || "ComputedValue", A3.set && (this.setter_ = $A("ComputedValue-setter", A3.set)), this.equals_ = A3.equals || (A3.compareStructural || A3.struct ? oA.structural : oA.default), this.scope_ = A3.context, this.requiresReaction_ = A3.requiresReaction, this.keepAlive_ = !!A3.keepAlive;
    }
    var e2 = A2.prototype;
    return e2.onBecomeStale_ = function() {
      !function(A3) {
        if (A3.lowestObserverState_ !== oe.UP_TO_DATE_) return;
        A3.lowestObserverState_ = oe.POSSIBLY_STALE_, A3.observers_.forEach(function(A4) {
          A4.dependenciesState_ === oe.UP_TO_DATE_ && (A4.dependenciesState_ = oe.POSSIBLY_STALE_, A4.onBecomeStale_());
        });
      }(this);
    }, e2.onBO = function() {
      this.onBOL && this.onBOL.forEach(function(A3) {
        return A3();
      });
    }, e2.onBUO = function() {
      this.onBUOL && this.onBUOL.forEach(function(A3) {
        return A3();
      });
    }, e2.get = function() {
      if (this.isComputing && B(32, this.name_, this.derivation), 0 !== ve.inBatch || 0 !== this.observers_.size || this.keepAlive_) {
        if (be(this), ce(this)) {
          var A3 = ve.trackingContext;
          this.keepAlive_ && !A3 && (ve.trackingContext = this), this.trackAndCompute() && function(A4) {
            if (A4.lowestObserverState_ === oe.STALE_) return;
            A4.lowestObserverState_ = oe.STALE_, A4.observers_.forEach(function(e4) {
              e4.dependenciesState_ === oe.POSSIBLY_STALE_ ? e4.dependenciesState_ = oe.STALE_ : e4.dependenciesState_ === oe.UP_TO_DATE_ && (A4.lowestObserverState_ = oe.UP_TO_DATE_);
            });
          }(this), ve.trackingContext = A3;
        }
      } else ce(this) && (this.warnAboutUntrackedRead_(), ye(), this.value_ = this.computeValue_(false), Ee());
      var e3 = this.value_;
      if (le(e3)) throw e3.cause;
      return e3;
    }, e2.set = function(A3) {
      if (this.setter_) {
        this.isRunningSetter && B(33, this.name_), this.isRunningSetter = true;
        try {
          this.setter_.call(this.scope_, A3);
        } finally {
          this.isRunningSetter = false;
        }
      } else B(34, this.name_);
    }, e2.trackAndCompute = function() {
      var A3 = this.value_, e3 = this.dependenciesState_ === oe.NOT_TRACKING_, t2 = this.computeValue_(true), n2 = e3 || le(A3) || le(t2) || !this.equals_(A3, t2);
      return n2 && (this.value_ = t2), n2;
    }, e2.computeValue_ = function(A3) {
      this.isComputing = true;
      var e3, t2 = ee(false);
      if (A3) e3 = ue(this, this.derivation, this.scope_);
      else if (true === ve.disableErrorBoundaries) e3 = this.derivation.call(this.scope_);
      else try {
        e3 = this.derivation.call(this.scope_);
      } catch (A4) {
        e3 = new ae(A4);
      }
      return te(t2), this.isComputing = false, e3;
    }, e2.suspend_ = function() {
      this.keepAlive_ || (Be(this), this.value_ = void 0);
    }, e2.observe_ = function(A3, e3) {
      var t2 = this, n2 = true, r2 = void 0;
      return function(A4, e4) {
        var t3, n3, r3, o2;
        void 0 === e4 && (e4 = Q);
        var i2, s2 = null != (t3 = null == (n3 = e4) ? void 0 : n3.name) ? t3 : "Autorun";
        if (e4.scheduler || e4.delay) {
          var a2 = Je(e4), l2 = false;
          i2 = new He(s2, function() {
            l2 || (l2 = true, a2(function() {
              l2 = false, i2.isDisposed || i2.track(c2);
            }));
          }, e4.onError, e4.requiresObservable);
        } else i2 = new He(s2, function() {
          this.track(c2);
        }, e4.onError, e4.requiresObservable);
        function c2() {
          A4(i2);
        }
        null != (r3 = e4) && null != (r3 = r3.signal) && r3.aborted || i2.schedule_();
        return i2.getDisposer_(null == (o2 = e4) ? void 0 : o2.signal);
      }(function() {
        var o2 = t2.get();
        if (!n2 || e3) {
          var i2 = ge();
          A3({ observableKind: "computed", debugObjectName: t2.name_, type: Qt, object: t2, newValue: o2, oldValue: r2 }), de(i2);
        }
        n2 = false, r2 = o2;
      });
    }, e2.warnAboutUntrackedRead_ = function() {
    }, e2.toString = function() {
      return this.name_ + "[" + this.derivation.toString() + "]";
    }, e2.valueOf = function() {
      return P(this.get());
    }, e2[Symbol.toPrimitive] = function() {
      return this.valueOf();
    }, _(A2, [{ key: "isComputing", get: function() {
      return G(this.flags_, A2.isComputingMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isComputingMask_, e3);
    } }, { key: "isRunningSetter", get: function() {
      return G(this.flags_, A2.isRunningSetterMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isRunningSetterMask_, e3);
    } }, { key: "isBeingObserved", get: function() {
      return G(this.flags_, A2.isBeingObservedMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isBeingObservedMask_, e3);
    } }, { key: "isPendingUnobservation", get: function() {
      return G(this.flags_, A2.isPendingUnobservationMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isPendingUnobservationMask_, e3);
    } }, { key: "diffValue", get: function() {
      return G(this.flags_, A2.diffValueMask_) ? 1 : 0;
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.diffValueMask_, 1 === e3);
    } }]);
  }();
  re.isComputingMask_ = 1, re.isRunningSetterMask_ = 2, re.isBeingObservedMask_ = 4, re.isPendingUnobservationMask_ = 8, re.diffValueMask_ = 16;
  var oe, ie, se = D("ComputedValue", re);
  !function(A2) {
    A2[A2.NOT_TRACKING_ = -1] = "NOT_TRACKING_", A2[A2.UP_TO_DATE_ = 0] = "UP_TO_DATE_", A2[A2.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", A2[A2.STALE_ = 2] = "STALE_";
  }(oe || (oe = {})), function(A2) {
    A2[A2.NONE = 0] = "NONE", A2[A2.LOG = 1] = "LOG", A2[A2.BREAK = 2] = "BREAK";
  }(ie || (ie = {}));
  var ae = function(A2) {
    this.cause = void 0, this.cause = A2;
  };
  function le(A2) {
    return A2 instanceof ae;
  }
  function ce(A2) {
    switch (A2.dependenciesState_) {
      case oe.UP_TO_DATE_:
        return false;
      case oe.NOT_TRACKING_:
      case oe.STALE_:
        return true;
      case oe.POSSIBLY_STALE_:
        for (var e2 = we(true), t2 = ge(), n2 = A2.observing_, r2 = n2.length, o2 = 0; o2 < r2; o2++) {
          var i2 = n2[o2];
          if (se(i2)) {
            if (ve.disableErrorBoundaries) i2.get();
            else try {
              i2.get();
            } catch (A3) {
              return de(t2), fe(e2), true;
            }
            if (A2.dependenciesState_ === oe.STALE_) return de(t2), fe(e2), true;
          }
        }
        return pe(A2), de(t2), fe(e2), false;
    }
  }
  function ue(A2, e2, t2) {
    var n2 = we(true);
    pe(A2), A2.newObserving_ = new Array(0 === A2.runId_ ? 100 : A2.observing_.length), A2.unboundDepsCount_ = 0, A2.runId_ = ++ve.runId;
    var r2, o2 = ve.trackingDerivation;
    if (ve.trackingDerivation = A2, ve.inBatch++, true === ve.disableErrorBoundaries) r2 = e2.call(t2);
    else try {
      r2 = e2.call(t2);
    } catch (A3) {
      r2 = new ae(A3);
    }
    return ve.inBatch--, ve.trackingDerivation = o2, function(A3) {
      for (var e3 = A3.observing_, t3 = A3.observing_ = A3.newObserving_, n3 = oe.UP_TO_DATE_, r3 = 0, o3 = A3.unboundDepsCount_, i2 = 0; i2 < o3; i2++) {
        var s2 = t3[i2];
        0 === s2.diffValue && (s2.diffValue = 1, r3 !== i2 && (t3[r3] = s2), r3++), s2.dependenciesState_ > n3 && (n3 = s2.dependenciesState_);
      }
      t3.length = r3, A3.newObserving_ = null, o3 = e3.length;
      for (; o3--; ) {
        var a2 = e3[o3];
        0 === a2.diffValue && me(a2, A3), a2.diffValue = 0;
      }
      for (; r3--; ) {
        var l2 = t3[r3];
        1 === l2.diffValue && (l2.diffValue = 0, Ue(l2, A3));
      }
      n3 !== oe.UP_TO_DATE_ && (A3.dependenciesState_ = n3, A3.onBecomeStale_());
    }(A2), fe(n2), r2;
  }
  function Be(A2) {
    var e2 = A2.observing_;
    A2.observing_ = [];
    for (var t2 = e2.length; t2--; ) me(e2[t2], A2);
    A2.dependenciesState_ = oe.NOT_TRACKING_;
  }
  function he(A2) {
    var e2 = ge();
    try {
      return A2();
    } finally {
      de(e2);
    }
  }
  function ge() {
    var A2 = ve.trackingDerivation;
    return ve.trackingDerivation = null, A2;
  }
  function de(A2) {
    ve.trackingDerivation = A2;
  }
  function we(A2) {
    var e2 = ve.allowStateReads;
    return ve.allowStateReads = A2, e2;
  }
  function fe(A2) {
    ve.allowStateReads = A2;
  }
  function pe(A2) {
    if (A2.dependenciesState_ !== oe.UP_TO_DATE_) {
      A2.dependenciesState_ = oe.UP_TO_DATE_;
      for (var e2 = A2.observing_, t2 = e2.length; t2--; ) e2[t2].lowestObserverState_ = oe.UP_TO_DATE_;
    }
  }
  var Ce = function() {
    this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = false, this.allowStateChanges = false, this.allowStateReads = true, this.enforceActions = true, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = false, this.reactionRequiresObservable = false, this.observableRequiresReaction = false, this.disableErrorBoundaries = false, this.suppressReactionErrors = false, this.useProxies = true, this.verifyProxies = false, this.safeDescriptors = true;
  }, Qe = true, ve = function() {
    var A2 = g();
    return A2.__mobxInstanceCount > 0 && !A2.__mobxGlobals && (Qe = false), A2.__mobxGlobals && A2.__mobxGlobals.version !== new Ce().version && (Qe = false), Qe ? A2.__mobxGlobals ? (A2.__mobxInstanceCount += 1, A2.__mobxGlobals.UNCHANGED || (A2.__mobxGlobals.UNCHANGED = {}), A2.__mobxGlobals) : (A2.__mobxInstanceCount = 1, A2.__mobxGlobals = new Ce()) : (setTimeout(function() {
      B(35);
    }, 1), new Ce());
  }();
  function Ue(A2, e2) {
    A2.observers_.add(e2), A2.lowestObserverState_ > e2.dependenciesState_ && (A2.lowestObserverState_ = e2.dependenciesState_);
  }
  function me(A2, e2) {
    A2.observers_.delete(e2), 0 === A2.observers_.size && Fe(A2);
  }
  function Fe(A2) {
    false === A2.isPendingUnobservation && (A2.isPendingUnobservation = true, ve.pendingUnobservations.push(A2));
  }
  function ye() {
    ve.inBatch++;
  }
  function Ee() {
    if (0 === --ve.inBatch) {
      Ke();
      for (var A2 = ve.pendingUnobservations, e2 = 0; e2 < A2.length; e2++) {
        var t2 = A2[e2];
        t2.isPendingUnobservation = false, 0 === t2.observers_.size && (t2.isBeingObserved && (t2.isBeingObserved = false, t2.onBUO()), t2 instanceof re && t2.suspend_());
      }
      ve.pendingUnobservations = [];
    }
  }
  function be(A2) {
    var e2 = ve.trackingDerivation;
    return null !== e2 ? (e2.runId_ !== A2.lastAccessedBy_ && (A2.lastAccessedBy_ = e2.runId_, e2.newObserving_[e2.unboundDepsCount_++] = A2, !A2.isBeingObserved && ve.trackingContext && (A2.isBeingObserved = true, A2.onBO())), A2.isBeingObserved) : (0 === A2.observers_.size && ve.inBatch > 0 && Fe(A2), false);
  }
  function Ie(A2) {
    A2.lowestObserverState_ !== oe.STALE_ && (A2.lowestObserverState_ = oe.STALE_, A2.observers_.forEach(function(A3) {
      A3.dependenciesState_ === oe.UP_TO_DATE_ && A3.onBecomeStale_(), A3.dependenciesState_ = oe.STALE_;
    }));
  }
  var He = function() {
    function A2(A3, e3, t2, n2) {
      void 0 === A3 && (A3 = "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = oe.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = ie.NONE, this.name_ = A3, this.onInvalidate_ = e3, this.errorHandler_ = t2, this.requiresObservable_ = n2;
    }
    var e2 = A2.prototype;
    return e2.onBecomeStale_ = function() {
      this.schedule_();
    }, e2.schedule_ = function() {
      this.isScheduled || (this.isScheduled = true, ve.pendingReactions.push(this), Ke());
    }, e2.runReaction_ = function() {
      if (!this.isDisposed) {
        ye(), this.isScheduled = false;
        var A3 = ve.trackingContext;
        if (ve.trackingContext = this, ce(this)) {
          this.isTrackPending = true;
          try {
            this.onInvalidate_();
          } catch (A4) {
            this.reportExceptionInDerivation_(A4);
          }
        }
        ve.trackingContext = A3, Ee();
      }
    }, e2.track = function(A3) {
      if (!this.isDisposed) {
        ye(), this.isRunning = true;
        var e3 = ve.trackingContext;
        ve.trackingContext = this;
        var t2 = ue(this, A3, void 0);
        ve.trackingContext = e3, this.isRunning = false, this.isTrackPending = false, this.isDisposed && Be(this), le(t2) && this.reportExceptionInDerivation_(t2.cause), Ee();
      }
    }, e2.reportExceptionInDerivation_ = function(A3) {
      var e3 = this;
      if (this.errorHandler_) this.errorHandler_(A3, this);
      else {
        if (ve.disableErrorBoundaries) throw A3;
        var t2 = "[mobx] uncaught error in '" + this + "'";
        ve.suppressReactionErrors || console.error(t2, A3), ve.globalReactionErrorHandlers.forEach(function(t3) {
          return t3(A3, e3);
        });
      }
    }, e2.dispose = function() {
      this.isDisposed || (this.isDisposed = true, this.isRunning || (ye(), Be(this), Ee()));
    }, e2.getDisposer_ = function(A3) {
      var e3 = this, t2 = function t3() {
        e3.dispose(), null == A3 || null == A3.removeEventListener || A3.removeEventListener("abort", t3);
      };
      return null == A3 || null == A3.addEventListener || A3.addEventListener("abort", t2), t2[eA] = this, "dispose" in Symbol && "symbol" == typeof Symbol.dispose && (t2[Symbol.dispose] = t2), t2;
    }, e2.toString = function() {
      return "Reaction[" + this.name_ + "]";
    }, e2.trace = function(A3) {
    }, _(A2, [{ key: "isDisposed", get: function() {
      return G(this.flags_, A2.isDisposedMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isDisposedMask_, e3);
    } }, { key: "isScheduled", get: function() {
      return G(this.flags_, A2.isScheduledMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isScheduledMask_, e3);
    } }, { key: "isTrackPending", get: function() {
      return G(this.flags_, A2.isTrackPendingMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isTrackPendingMask_, e3);
    } }, { key: "isRunning", get: function() {
      return G(this.flags_, A2.isRunningMask_);
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.isRunningMask_, e3);
    } }, { key: "diffValue", get: function() {
      return G(this.flags_, A2.diffValueMask_) ? 1 : 0;
    }, set: function(e3) {
      this.flags_ = V(this.flags_, A2.diffValueMask_, 1 === e3);
    } }]);
  }();
  He.isDisposedMask_ = 1, He.isScheduledMask_ = 2, He.isTrackPendingMask_ = 4, He.isRunningMask_ = 8, He.diffValueMask_ = 16;
  var Se = 100, xe = function(A2) {
    return A2();
  };
  function Ke() {
    ve.inBatch > 0 || ve.isRunningReactions || xe(De);
  }
  function De() {
    ve.isRunningReactions = true;
    for (var A2 = ve.pendingReactions, e2 = 0; A2.length > 0; ) {
      ++e2 === Se && (console.error("[mobx] cycle in reaction: " + A2[0]), A2.splice(0));
      for (var t2 = A2.splice(0), n2 = 0, r2 = t2.length; n2 < r2; n2++) t2[n2].runReaction_();
    }
    ve.isRunningReactions = false;
  }
  var Le = D("Reaction", He);
  var Oe = "action", ke = "autoAction", Me = "<unnamed action>", Pe = lA(Oe), Te = lA("action.bound", { bound: true }), Re = lA(ke, { autoAction: true }), Ge = lA("autoAction.bound", { autoAction: true, bound: true });
  function Ve(A2) {
    return function(e2, t2) {
      return E(e2) ? $A(e2.name || Me, e2, A2) : E(t2) ? $A(e2, t2, A2) : AA(t2) ? (A2 ? Re : Pe).decorate_20223_(e2, t2) : b(t2) ? $(e2, t2, A2 ? Re : Pe) : b(e2) ? q(lA(A2 ? ke : Oe, { name: e2, autoAction: A2 })) : void 0;
    };
  }
  var Ne = Ve(false);
  Object.assign(Ne, Pe);
  var Xe = Ve(true);
  function _e(A2) {
    return E(A2) && true === A2.isMobxAction;
  }
  Object.assign(Xe, Re), Ne.bound = q(Te), Xe.bound = q(Ge);
  var Ye = function(A2) {
    return A2();
  };
  function Je(A2) {
    return A2.scheduler ? A2.scheduler : A2.delay ? function(e2) {
      return setTimeout(e2, A2.delay);
    } : Ye;
  }
  function We(A2, e2, t2) {
    var n2, r2, o2;
    void 0 === t2 && (t2 = Q);
    var i2, s2, a2, l2 = null != (n2 = t2.name) ? n2 : "Reaction", c2 = Ne(l2, t2.onError ? (i2 = t2.onError, s2 = e2, function() {
      try {
        return s2.apply(this, arguments);
      } catch (A3) {
        i2.call(this, A3);
      }
    }) : e2), u2 = !t2.scheduler && !t2.delay, B2 = Je(t2), h2 = true, g2 = false, d2 = t2.compareStructural ? oA.structural : t2.equals || oA.default, w2 = new He(l2, function() {
      h2 || u2 ? f2() : g2 || (g2 = true, B2(f2));
    }, t2.onError, t2.requiresObservable);
    function f2() {
      if (g2 = false, !w2.isDisposed) {
        var e3 = false, n3 = a2;
        w2.track(function() {
          var t3 = function(A3, e4) {
            var t4 = ee(A3);
            try {
              return e4();
            } finally {
              te(t4);
            }
          }(false, function() {
            return A2(w2);
          });
          e3 = h2 || !d2(a2, t3), a2 = t3;
        }), (h2 && t2.fireImmediately || !h2 && e3) && c2(a2, n3, w2), h2 = false;
      }
    }
    return null != (r2 = t2) && null != (r2 = r2.signal) && r2.aborted || w2.schedule_(), w2.getDisposer_(null == (o2 = t2) ? void 0 : o2.signal);
  }
  var ze = "onBO", Ze = "onBUO";
  function je(A2, e2, t2) {
    return qe(Ze, A2, e2, t2);
  }
  function qe(A2, e2, t2, n2) {
    var r2 = sn(e2), o2 = E(n2) ? n2 : t2, i2 = A2 + "L";
    return r2[i2] ? r2[i2].add(o2) : r2[i2] = /* @__PURE__ */ new Set([o2]), function() {
      var A3 = r2[i2];
      A3 && (A3.delete(o2), 0 === A3.size && delete r2[i2]);
    };
  }
  function $e(A2, e2, t2, n2) {
    var r2 = R(e2);
    return cn(function() {
      var e3 = Xt(A2, n2)[eA];
      M(r2).forEach(function(A3) {
        e3.extend_(A3, r2[A3], !t2 || (!(A3 in t2) || t2[A3]));
      });
    }), A2;
  }
  var At = 0;
  function et() {
    this.message = "FLOW_CANCELLED";
  }
  et.prototype = Object.create(Error.prototype);
  var tt = gA("flow"), nt = gA("flow.bound", { bound: true }), rt = Object.assign(function(A2, e2) {
    if (AA(e2)) return tt.decorate_20223_(A2, e2);
    if (b(e2)) return $(A2, e2, tt);
    var t2 = A2, n2 = t2.name || "<unnamed flow>", r2 = function() {
      var A3, e3 = arguments, r3 = ++At, o2 = Ne(n2 + " - runid: " + r3 + " - init", t2).apply(this, e3), i2 = void 0, s2 = new Promise(function(e4, t3) {
        var s3 = 0;
        function a2(A4) {
          var e5;
          i2 = void 0;
          try {
            e5 = Ne(n2 + " - runid: " + r3 + " - yield " + s3++, o2.next).call(o2, A4);
          } catch (A5) {
            return t3(A5);
          }
          c2(e5);
        }
        function l2(A4) {
          var e5;
          i2 = void 0;
          try {
            e5 = Ne(n2 + " - runid: " + r3 + " - yield " + s3++, o2.throw).call(o2, A4);
          } catch (A5) {
            return t3(A5);
          }
          c2(e5);
        }
        function c2(A4) {
          if (!E(null == A4 ? void 0 : A4.then)) return A4.done ? e4(A4.value) : (i2 = Promise.resolve(A4.value)).then(a2, l2);
          A4.then(c2, t3);
        }
        A3 = t3, a2(void 0);
      });
      return s2.cancel = Ne(n2 + " - runid: " + r3 + " - cancel", function() {
        try {
          i2 && ot(i2);
          var e4 = o2.return(void 0), t3 = Promise.resolve(e4.value);
          t3.then(y, y), ot(t3), A3(new et());
        } catch (e5) {
          A3(e5);
        }
      }), s2;
    };
    return r2.isMobXFlow = true, r2;
  }, tt);
  function ot(A2) {
    E(A2.cancel) && A2.cancel();
  }
  function it(A2) {
    return true === (null == A2 ? void 0 : A2.isMobXFlow);
  }
  function st(A2) {
    return function(A3, e2) {
      return !!A3 && (void 0 !== e2 ? !!Jt(A3) && A3[eA].values_.has(e2) : Jt(A3) || !!A3[eA] || nA(A3) || Le(A3) || se(A3));
    }(A2);
  }
  function at(A2, e2) {
    void 0 === e2 && (e2 = void 0), ye();
    try {
      return A2.apply(e2);
    } finally {
      Ee();
    }
  }
  function lt(A2) {
    return A2[eA];
  }
  rt.bound = q(nt);
  var ct = { has: function(A2, e2) {
    return lt(A2).has_(e2);
  }, get: function(A2, e2) {
    return lt(A2).get_(e2);
  }, set: function(A2, e2, t2) {
    var n2;
    return !!b(e2) && (null == (n2 = lt(A2).set_(e2, t2, true)) || n2);
  }, deleteProperty: function(A2, e2) {
    var t2;
    return !!b(e2) && (null == (t2 = lt(A2).delete_(e2, true)) || t2);
  }, defineProperty: function(A2, e2, t2) {
    var n2;
    return null == (n2 = lt(A2).defineProperty_(e2, t2)) || n2;
  }, ownKeys: function(A2) {
    return lt(A2).ownKeys_();
  }, preventExtensions: function(A2) {
    B(13);
  } };
  function ut(A2) {
    return void 0 !== A2.interceptors_ && A2.interceptors_.length > 0;
  }
  function Bt(A2, e2) {
    var t2 = A2.interceptors_ || (A2.interceptors_ = []);
    return t2.push(e2), F(function() {
      var A3 = t2.indexOf(e2);
      -1 !== A3 && t2.splice(A3, 1);
    });
  }
  function ht(A2, e2) {
    var t2 = ge();
    try {
      for (var n2 = [].concat(A2.interceptors_ || []), r2 = 0, o2 = n2.length; r2 < o2 && ((e2 = n2[r2](e2)) && !e2.type && B(14), e2); r2++) ;
      return e2;
    } finally {
      de(t2);
    }
  }
  function gt(A2) {
    return void 0 !== A2.changeListeners_ && A2.changeListeners_.length > 0;
  }
  function dt(A2, e2) {
    var t2 = A2.changeListeners_ || (A2.changeListeners_ = []);
    return t2.push(e2), F(function() {
      var A3 = t2.indexOf(e2);
      -1 !== A3 && t2.splice(A3, 1);
    });
  }
  function wt(A2, e2) {
    var t2 = ge(), n2 = A2.changeListeners_;
    if (n2) {
      for (var r2 = 0, o2 = (n2 = n2.slice()).length; r2 < o2; r2++) n2[r2](e2);
      de(t2);
    }
  }
  var ft = Symbol("mobx-keys");
  function pt(A2, e2, t2) {
    return H(A2) ? $e(A2, A2, e2, t2) : (cn(function() {
      var n2 = Xt(A2, t2)[eA];
      if (!A2[ft]) {
        var r2 = Object.getPrototypeOf(A2), o2 = new Set([].concat(M(A2), M(r2)));
        o2.delete("constructor"), o2.delete(eA), x(r2, ft, o2);
      }
      A2[ft].forEach(function(A3) {
        return n2.make_(A3, !e2 || (!(A3 in e2) || e2[A3]));
      });
    }), A2);
  }
  var Ct = "splice", Qt = "update", vt = { get: function(A2, e2) {
    var t2 = A2[eA];
    return e2 === eA ? t2 : "length" === e2 ? t2.getArrayLength_() : "string" != typeof e2 || isNaN(e2) ? T(Ft, e2) ? Ft[e2] : A2[e2] : t2.get_(parseInt(e2));
  }, set: function(A2, e2, t2) {
    var n2 = A2[eA];
    return "length" === e2 && n2.setArrayLength_(t2), "symbol" == typeof e2 || isNaN(e2) ? A2[e2] = t2 : n2.set_(parseInt(e2), t2), true;
  }, preventExtensions: function() {
    B(15);
  } }, Ut = function() {
    function A2(A3, e3, t2, n2) {
      void 0 === A3 && (A3 = "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = t2, this.legacyMode_ = n2, this.atom_ = new tA(A3), this.enhancer_ = function(A4, t3) {
        return e3(A4, t3, "ObservableArray[..]");
      };
    }
    var e2 = A2.prototype;
    return e2.dehanceValue_ = function(A3) {
      return void 0 !== this.dehancer ? this.dehancer(A3) : A3;
    }, e2.dehanceValues_ = function(A3) {
      return void 0 !== this.dehancer && A3.length > 0 ? A3.map(this.dehancer) : A3;
    }, e2.intercept_ = function(A3) {
      return Bt(this, A3);
    }, e2.observe_ = function(A3, e3) {
      return void 0 === e3 && (e3 = false), e3 && A3({ observableKind: "array", object: this.proxy_, debugObjectName: this.atom_.name_, type: "splice", index: 0, added: this.values_.slice(), addedCount: this.values_.length, removed: [], removedCount: 0 }), dt(this, A3);
    }, e2.getArrayLength_ = function() {
      return this.atom_.reportObserved(), this.values_.length;
    }, e2.setArrayLength_ = function(A3) {
      ("number" != typeof A3 || isNaN(A3) || A3 < 0) && B("Out of range: " + A3);
      var e3 = this.values_.length;
      if (A3 !== e3) if (A3 > e3) {
        for (var t2 = new Array(A3 - e3), n2 = 0; n2 < A3 - e3; n2++) t2[n2] = void 0;
        this.spliceWithArray_(e3, 0, t2);
      } else this.spliceWithArray_(A3, e3 - A3);
    }, e2.updateArrayLength_ = function(A3, e3) {
      A3 !== this.lastKnownLength_ && B(16), this.lastKnownLength_ += e3, this.legacyMode_ && e3 > 0 && rn(A3 + e3 + 1);
    }, e2.spliceWithArray_ = function(A3, e3, t2) {
      var n2 = this;
      this.atom_;
      var r2 = this.values_.length;
      if (void 0 === A3 ? A3 = 0 : A3 > r2 ? A3 = r2 : A3 < 0 && (A3 = Math.max(0, r2 + A3)), e3 = 1 === arguments.length ? r2 - A3 : null == e3 ? 0 : Math.max(0, Math.min(e3, r2 - A3)), void 0 === t2 && (t2 = C), ut(this)) {
        var o2 = ht(this, { object: this.proxy_, type: Ct, index: A3, removedCount: e3, added: t2 });
        if (!o2) return C;
        e3 = o2.removedCount, t2 = o2.added;
      }
      if (t2 = 0 === t2.length ? t2 : t2.map(function(A4) {
        return n2.enhancer_(A4, void 0);
      }), this.legacyMode_) {
        var i2 = t2.length - e3;
        this.updateArrayLength_(r2, i2);
      }
      var s2 = this.spliceItemsIntoValues_(A3, e3, t2);
      return 0 === e3 && 0 === t2.length || this.notifyArraySplice_(A3, t2, s2), this.dehanceValues_(s2);
    }, e2.spliceItemsIntoValues_ = function(A3, e3, t2) {
      var n2;
      if (t2.length < 1e4) return (n2 = this.values_).splice.apply(n2, [A3, e3].concat(t2));
      var r2 = this.values_.slice(A3, A3 + e3), o2 = this.values_.slice(A3 + e3);
      this.values_.length += t2.length - e3;
      for (var i2 = 0; i2 < t2.length; i2++) this.values_[A3 + i2] = t2[i2];
      for (var s2 = 0; s2 < o2.length; s2++) this.values_[A3 + t2.length + s2] = o2[s2];
      return r2;
    }, e2.notifyArrayChildUpdate_ = function(A3, e3, t2) {
      var n2 = !this.owned_ && false, r2 = gt(this), o2 = r2 || n2 ? { observableKind: "array", object: this.proxy_, type: Qt, debugObjectName: this.atom_.name_, index: A3, newValue: e3, oldValue: t2 } : null;
      this.atom_.reportChanged(), r2 && wt(this, o2);
    }, e2.notifyArraySplice_ = function(A3, e3, t2) {
      var n2 = !this.owned_ && false, r2 = gt(this), o2 = r2 || n2 ? { observableKind: "array", object: this.proxy_, debugObjectName: this.atom_.name_, type: Ct, index: A3, removed: t2, added: e3, removedCount: t2.length, addedCount: e3.length } : null;
      this.atom_.reportChanged(), r2 && wt(this, o2);
    }, e2.get_ = function(A3) {
      if (!(this.legacyMode_ && A3 >= this.values_.length)) return this.atom_.reportObserved(), this.dehanceValue_(this.values_[A3]);
      console.warn("[mobx] Out of bounds read: " + A3);
    }, e2.set_ = function(A3, e3) {
      var t2 = this.values_;
      if (this.legacyMode_ && A3 > t2.length && B(17, A3, t2.length), A3 < t2.length) {
        this.atom_;
        var n2 = t2[A3];
        if (ut(this)) {
          var r2 = ht(this, { type: Qt, object: this.proxy_, index: A3, newValue: e3 });
          if (!r2) return;
          e3 = r2.newValue;
        }
        (e3 = this.enhancer_(e3, n2)) !== n2 && (t2[A3] = e3, this.notifyArrayChildUpdate_(A3, e3, n2));
      } else {
        for (var o2 = new Array(A3 + 1 - t2.length), i2 = 0; i2 < o2.length - 1; i2++) o2[i2] = void 0;
        o2[o2.length - 1] = e3, this.spliceWithArray_(t2.length, 0, o2);
      }
    }, A2;
  }();
  function mt(A2, e2, t2, n2) {
    return void 0 === t2 && (t2 = "ObservableArray"), void 0 === n2 && (n2 = false), m(), cn(function() {
      var r2 = new Ut(t2, e2, n2, false);
      K(r2.values_, eA, r2);
      var o2 = new Proxy(r2.values_, vt);
      return r2.proxy_ = o2, A2 && A2.length && r2.spliceWithArray_(0, 0, A2), o2;
    });
  }
  var Ft = { clear: function() {
    return this.splice(0);
  }, replace: function(A2) {
    var e2 = this[eA];
    return e2.spliceWithArray_(0, e2.values_.length, A2);
  }, toJSON: function() {
    return this.slice();
  }, splice: function(A2, e2) {
    for (var t2 = arguments.length, n2 = new Array(t2 > 2 ? t2 - 2 : 0), r2 = 2; r2 < t2; r2++) n2[r2 - 2] = arguments[r2];
    var o2 = this[eA];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return o2.spliceWithArray_(A2);
      case 2:
        return o2.spliceWithArray_(A2, e2);
    }
    return o2.spliceWithArray_(A2, e2, n2);
  }, spliceWithArray: function(A2, e2, t2) {
    return this[eA].spliceWithArray_(A2, e2, t2);
  }, push: function() {
    for (var A2 = this[eA], e2 = arguments.length, t2 = new Array(e2), n2 = 0; n2 < e2; n2++) t2[n2] = arguments[n2];
    return A2.spliceWithArray_(A2.values_.length, 0, t2), A2.values_.length;
  }, pop: function() {
    return this.splice(Math.max(this[eA].values_.length - 1, 0), 1)[0];
  }, shift: function() {
    return this.splice(0, 1)[0];
  }, unshift: function() {
    for (var A2 = this[eA], e2 = arguments.length, t2 = new Array(e2), n2 = 0; n2 < e2; n2++) t2[n2] = arguments[n2];
    return A2.spliceWithArray_(0, 0, t2), A2.values_.length;
  }, reverse: function() {
    return ve.trackingDerivation && B(37, "reverse"), this.replace(this.slice().reverse()), this;
  }, sort: function() {
    ve.trackingDerivation && B(37, "sort");
    var A2 = this.slice();
    return A2.sort.apply(A2, arguments), this.replace(A2), this;
  }, remove: function(A2) {
    var e2 = this[eA], t2 = e2.dehanceValues_(e2.values_).indexOf(A2);
    return t2 > -1 && (this.splice(t2, 1), true);
  } };
  function yt(A2, e2) {
    "function" == typeof Array.prototype[A2] && (Ft[A2] = e2(A2));
  }
  function Et(A2) {
    return function() {
      var e2 = this[eA];
      e2.atom_.reportObserved();
      var t2 = e2.dehanceValues_(e2.values_);
      return t2[A2].apply(t2, arguments);
    };
  }
  function bt(A2) {
    return function(e2, t2) {
      var n2 = this, r2 = this[eA];
      return r2.atom_.reportObserved(), r2.dehanceValues_(r2.values_)[A2](function(A3, r3) {
        return e2.call(t2, A3, r3, n2);
      });
    };
  }
  function It(A2) {
    return function() {
      var e2 = this, t2 = this[eA];
      t2.atom_.reportObserved();
      var n2 = t2.dehanceValues_(t2.values_), r2 = arguments[0];
      return arguments[0] = function(A3, t3, n3) {
        return r2(A3, t3, n3, e2);
      }, n2[A2].apply(n2, arguments);
    };
  }
  yt("at", Et), yt("concat", Et), yt("flat", Et), yt("includes", Et), yt("indexOf", Et), yt("join", Et), yt("lastIndexOf", Et), yt("slice", Et), yt("toString", Et), yt("toLocaleString", Et), yt("toSorted", Et), yt("toSpliced", Et), yt("with", Et), yt("every", bt), yt("filter", bt), yt("find", bt), yt("findIndex", bt), yt("findLast", bt), yt("findLastIndex", bt), yt("flatMap", bt), yt("forEach", bt), yt("map", bt), yt("some", bt), yt("toReversed", bt), yt("reduce", It), yt("reduceRight", It);
  var Ht = D("ObservableArrayAdministration", Ut);
  function St(A2) {
    return I(A2) && Ht(A2[eA]);
  }
  var xt = {}, Kt = "add", Dt = "delete", Lt = function() {
    function A2(A3, e3, t2) {
      var n2 = this;
      void 0 === e3 && (e3 = iA), void 0 === t2 && (t2 = "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[eA] = xt, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = e3, this.name_ = t2, E(Map) || B(18), cn(function() {
        n2.keysAtom_ = rA("ObservableMap.keys()"), n2.data_ = /* @__PURE__ */ new Map(), n2.hasMap_ = /* @__PURE__ */ new Map(), A3 && n2.merge(A3);
      });
    }
    var e2 = A2.prototype;
    return e2.has_ = function(A3) {
      return this.data_.has(A3);
    }, e2.has = function(A3) {
      var e3 = this;
      if (!ve.trackingDerivation) return this.has_(A3);
      var t2 = this.hasMap_.get(A3);
      if (!t2) {
        var n2 = t2 = new ne(this.has_(A3), sA, "ObservableMap.key?", false);
        this.hasMap_.set(A3, n2), je(n2, function() {
          return e3.hasMap_.delete(A3);
        });
      }
      return t2.get();
    }, e2.set = function(A3, e3) {
      var t2 = this.has_(A3);
      if (ut(this)) {
        var n2 = ht(this, { type: t2 ? Qt : Kt, object: this, newValue: e3, name: A3 });
        if (!n2) return this;
        e3 = n2.newValue;
      }
      return t2 ? this.updateValue_(A3, e3) : this.addValue_(A3, e3), this;
    }, e2.delete = function(A3) {
      var e3 = this;
      if ((this.keysAtom_, ut(this)) && !ht(this, { type: Dt, object: this, name: A3 })) return false;
      if (this.has_(A3)) {
        var t2 = gt(this), n2 = t2 ? { observableKind: "map", debugObjectName: this.name_, type: Dt, object: this, oldValue: this.data_.get(A3).value_, name: A3 } : null;
        return at(function() {
          var t3;
          e3.keysAtom_.reportChanged(), null == (t3 = e3.hasMap_.get(A3)) || t3.setNewValue_(false), e3.data_.get(A3).setNewValue_(void 0), e3.data_.delete(A3);
        }), t2 && wt(this, n2), true;
      }
      return false;
    }, e2.updateValue_ = function(A3, e3) {
      var t2 = this.data_.get(A3);
      if ((e3 = t2.prepareNewValue_(e3)) !== ve.UNCHANGED) {
        var n2 = gt(this), r2 = n2 ? { observableKind: "map", debugObjectName: this.name_, type: Qt, object: this, oldValue: t2.value_, name: A3, newValue: e3 } : null;
        t2.setNewValue_(e3), n2 && wt(this, r2);
      }
    }, e2.addValue_ = function(A3, e3) {
      var t2 = this;
      this.keysAtom_, at(function() {
        var n3, r3 = new ne(e3, t2.enhancer_, "ObservableMap.key", false);
        t2.data_.set(A3, r3), e3 = r3.value_, null == (n3 = t2.hasMap_.get(A3)) || n3.setNewValue_(true), t2.keysAtom_.reportChanged();
      });
      var n2 = gt(this), r2 = n2 ? { observableKind: "map", debugObjectName: this.name_, type: Kt, object: this, name: A3, newValue: e3 } : null;
      n2 && wt(this, r2);
    }, e2.get = function(A3) {
      return this.has(A3) ? this.dehanceValue_(this.data_.get(A3).get()) : this.dehanceValue_(void 0);
    }, e2.dehanceValue_ = function(A3) {
      return void 0 !== this.dehancer ? this.dehancer(A3) : A3;
    }, e2.keys = function() {
      return this.keysAtom_.reportObserved(), this.data_.keys();
    }, e2.values = function() {
      var A3 = this, e3 = this.keys();
      return kt({ next: function() {
        var t2 = e3.next(), n2 = t2.done, r2 = t2.value;
        return { done: n2, value: n2 ? void 0 : A3.get(r2) };
      } });
    }, e2.entries = function() {
      var A3 = this, e3 = this.keys();
      return kt({ next: function() {
        var t2 = e3.next(), n2 = t2.done, r2 = t2.value;
        return { done: n2, value: n2 ? void 0 : [r2, A3.get(r2)] };
      } });
    }, e2[Symbol.iterator] = function() {
      return this.entries();
    }, e2.forEach = function(A3, e3) {
      for (var t2, n2 = Y(this); !(t2 = n2()).done; ) {
        var r2 = t2.value, o2 = r2[0], i2 = r2[1];
        A3.call(e3, i2, o2, this);
      }
    }, e2.merge = function(A3) {
      var e3 = this;
      return Ot(A3) && (A3 = new Map(A3)), at(function() {
        var t2, n2, r2;
        H(A3) ? function(A4) {
          var e4 = Object.keys(A4);
          if (!k) return e4;
          var t3 = Object.getOwnPropertySymbols(A4);
          return t3.length ? [].concat(e4, t3.filter(function(e5) {
            return p.propertyIsEnumerable.call(A4, e5);
          })) : e4;
        }(A3).forEach(function(t3) {
          return e3.set(t3, A3[t3]);
        }) : Array.isArray(A3) ? A3.forEach(function(A4) {
          var t3 = A4[0], n3 = A4[1];
          return e3.set(t3, n3);
        }) : L(A3) ? (t2 = A3, n2 = Object.getPrototypeOf(t2), r2 = Object.getPrototypeOf(n2), null !== Object.getPrototypeOf(r2) && B(19, A3), A3.forEach(function(A4, t3) {
          return e3.set(t3, A4);
        })) : null != A3 && B(20, A3);
      }), this;
    }, e2.clear = function() {
      var A3 = this;
      at(function() {
        he(function() {
          for (var e3, t2 = Y(A3.keys()); !(e3 = t2()).done; ) {
            var n2 = e3.value;
            A3.delete(n2);
          }
        });
      });
    }, e2.replace = function(A3) {
      var e3 = this;
      return at(function() {
        for (var t2, n2 = function(A4) {
          if (L(A4) || Ot(A4)) return A4;
          if (Array.isArray(A4)) return new Map(A4);
          if (H(A4)) {
            var e4 = /* @__PURE__ */ new Map();
            for (var t3 in A4) e4.set(t3, A4[t3]);
            return e4;
          }
          return B(21, A4);
        }(A3), r2 = /* @__PURE__ */ new Map(), o2 = false, i2 = Y(e3.data_.keys()); !(t2 = i2()).done; ) {
          var s2 = t2.value;
          if (!n2.has(s2)) if (e3.delete(s2)) o2 = true;
          else {
            var a2 = e3.data_.get(s2);
            r2.set(s2, a2);
          }
        }
        for (var l2, c2 = Y(n2.entries()); !(l2 = c2()).done; ) {
          var u2 = l2.value, h2 = u2[0], g2 = u2[1], d2 = e3.data_.has(h2);
          if (e3.set(h2, g2), e3.data_.has(h2)) {
            var w2 = e3.data_.get(h2);
            r2.set(h2, w2), d2 || (o2 = true);
          }
        }
        if (!o2) if (e3.data_.size !== r2.size) e3.keysAtom_.reportChanged();
        else for (var f2 = e3.data_.keys(), p2 = r2.keys(), C2 = f2.next(), Q2 = p2.next(); !C2.done; ) {
          if (C2.value !== Q2.value) {
            e3.keysAtom_.reportChanged();
            break;
          }
          C2 = f2.next(), Q2 = p2.next();
        }
        e3.data_ = r2;
      }), this;
    }, e2.toString = function() {
      return "[object ObservableMap]";
    }, e2.toJSON = function() {
      return Array.from(this);
    }, e2.observe_ = function(A3, e3) {
      return dt(this, A3);
    }, e2.intercept_ = function(A3) {
      return Bt(this, A3);
    }, _(A2, [{ key: "size", get: function() {
      return this.keysAtom_.reportObserved(), this.data_.size;
    } }, { key: Symbol.toStringTag, get: function() {
      return "Map";
    } }]);
  }(), Ot = D("ObservableMap", Lt);
  function kt(A2) {
    return A2[Symbol.toStringTag] = "MapIterator", fn(A2);
  }
  var Mt = {}, Pt = function() {
    function A2(A3, e3, t2) {
      var n2 = this;
      void 0 === e3 && (e3 = iA), void 0 === t2 && (t2 = "ObservableSet"), this.name_ = void 0, this[eA] = Mt, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = t2, E(Set) || B(22), this.enhancer_ = function(A4, n3) {
        return e3(A4, n3, t2);
      }, cn(function() {
        n2.atom_ = rA(n2.name_), A3 && n2.replace(A3);
      });
    }
    var e2 = A2.prototype;
    return e2.dehanceValue_ = function(A3) {
      return void 0 !== this.dehancer ? this.dehancer(A3) : A3;
    }, e2.clear = function() {
      var A3 = this;
      at(function() {
        he(function() {
          for (var e3, t2 = Y(A3.data_.values()); !(e3 = t2()).done; ) {
            var n2 = e3.value;
            A3.delete(n2);
          }
        });
      });
    }, e2.forEach = function(A3, e3) {
      for (var t2, n2 = Y(this); !(t2 = n2()).done; ) {
        var r2 = t2.value;
        A3.call(e3, r2, r2, this);
      }
    }, e2.add = function(A3) {
      var e3 = this;
      if (this.atom_, ut(this)) {
        var t2 = ht(this, { type: Kt, object: this, newValue: A3 });
        if (!t2) return this;
        A3 = t2.newValue;
      }
      if (!this.has(A3)) {
        at(function() {
          e3.data_.add(e3.enhancer_(A3, void 0)), e3.atom_.reportChanged();
        });
        var n2 = gt(this), r2 = n2 ? { observableKind: "set", debugObjectName: this.name_, type: Kt, object: this, newValue: A3 } : null;
        n2 && wt(this, r2);
      }
      return this;
    }, e2.delete = function(A3) {
      var e3 = this;
      if (ut(this) && !ht(this, { type: Dt, object: this, oldValue: A3 })) return false;
      if (this.has(A3)) {
        var t2 = gt(this), n2 = t2 ? { observableKind: "set", debugObjectName: this.name_, type: Dt, object: this, oldValue: A3 } : null;
        return at(function() {
          e3.atom_.reportChanged(), e3.data_.delete(A3);
        }), t2 && wt(this, n2), true;
      }
      return false;
    }, e2.has = function(A3) {
      return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(A3));
    }, e2.entries = function() {
      var A3 = this.values();
      return Rt({ next: function() {
        var e3 = A3.next(), t2 = e3.value, n2 = e3.done;
        return n2 ? { value: void 0, done: n2 } : { value: [t2, t2], done: n2 };
      } });
    }, e2.keys = function() {
      return this.values();
    }, e2.values = function() {
      this.atom_.reportObserved();
      var A3 = this, e3 = this.data_.values();
      return Rt({ next: function() {
        var t2 = e3.next(), n2 = t2.value, r2 = t2.done;
        return r2 ? { value: void 0, done: r2 } : { value: A3.dehanceValue_(n2), done: r2 };
      } });
    }, e2.intersection = function(A3) {
      return O(A3) && !Tt(A3) ? A3.intersection(this) : new Set(this).intersection(A3);
    }, e2.union = function(A3) {
      return O(A3) && !Tt(A3) ? A3.union(this) : new Set(this).union(A3);
    }, e2.difference = function(A3) {
      return new Set(this).difference(A3);
    }, e2.symmetricDifference = function(A3) {
      return O(A3) && !Tt(A3) ? A3.symmetricDifference(this) : new Set(this).symmetricDifference(A3);
    }, e2.isSubsetOf = function(A3) {
      return new Set(this).isSubsetOf(A3);
    }, e2.isSupersetOf = function(A3) {
      return new Set(this).isSupersetOf(A3);
    }, e2.isDisjointFrom = function(A3) {
      return O(A3) && !Tt(A3) ? A3.isDisjointFrom(this) : new Set(this).isDisjointFrom(A3);
    }, e2.replace = function(A3) {
      var e3 = this;
      return Tt(A3) && (A3 = new Set(A3)), at(function() {
        Array.isArray(A3) || O(A3) ? (e3.clear(), A3.forEach(function(A4) {
          return e3.add(A4);
        })) : null != A3 && B("Cannot initialize set from " + A3);
      }), this;
    }, e2.observe_ = function(A3, e3) {
      return dt(this, A3);
    }, e2.intercept_ = function(A3) {
      return Bt(this, A3);
    }, e2.toJSON = function() {
      return Array.from(this);
    }, e2.toString = function() {
      return "[object ObservableSet]";
    }, e2[Symbol.iterator] = function() {
      return this.values();
    }, _(A2, [{ key: "size", get: function() {
      return this.atom_.reportObserved(), this.data_.size;
    } }, { key: Symbol.toStringTag, get: function() {
      return "Set";
    } }]);
  }(), Tt = D("ObservableSet", Pt);
  function Rt(A2) {
    return A2[Symbol.toStringTag] = "SetIterator", fn(A2);
  }
  var Gt = /* @__PURE__ */ Object.create(null), Vt = "remove", Nt = function() {
    function A2(A3, e3, t2, n2) {
      void 0 === e3 && (e3 = /* @__PURE__ */ new Map()), void 0 === n2 && (n2 = IA), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = A3, this.values_ = e3, this.name_ = t2, this.defaultAnnotation_ = n2, this.keysAtom_ = new tA("ObservableObject.keys"), this.isPlainObject_ = H(this.target_);
    }
    var e2 = A2.prototype;
    return e2.getObservablePropValue_ = function(A3) {
      return this.values_.get(A3).get();
    }, e2.setObservablePropValue_ = function(A3, e3) {
      var t2 = this.values_.get(A3);
      if (t2 instanceof re) return t2.set(e3), true;
      if (ut(this)) {
        var n2 = ht(this, { type: Qt, object: this.proxy_ || this.target_, name: A3, newValue: e3 });
        if (!n2) return null;
        e3 = n2.newValue;
      }
      if ((e3 = t2.prepareNewValue_(e3)) !== ve.UNCHANGED) {
        var r2 = gt(this), o2 = r2 ? { type: Qt, observableKind: "object", debugObjectName: this.name_, object: this.proxy_ || this.target_, oldValue: t2.value_, name: A3, newValue: e3 } : null;
        t2.setNewValue_(e3), r2 && wt(this, o2);
      }
      return true;
    }, e2.get_ = function(A3) {
      return ve.trackingDerivation && !T(this.target_, A3) && this.has_(A3), this.target_[A3];
    }, e2.set_ = function(A3, e3, t2) {
      return void 0 === t2 && (t2 = false), T(this.target_, A3) ? this.values_.has(A3) ? this.setObservablePropValue_(A3, e3) : t2 ? Reflect.set(this.target_, A3, e3) : (this.target_[A3] = e3, true) : this.extend_(A3, { value: e3, enumerable: true, writable: true, configurable: true }, this.defaultAnnotation_, t2);
    }, e2.has_ = function(A3) {
      if (!ve.trackingDerivation) return A3 in this.target_;
      this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
      var e3 = this.pendingKeys_.get(A3);
      return e3 || (e3 = new ne(A3 in this.target_, sA, "ObservableObject.key?", false), this.pendingKeys_.set(A3, e3)), e3.get();
    }, e2.make_ = function(A3, e3) {
      if (true === e3 && (e3 = this.defaultAnnotation_), false !== e3) {
        if (!(A3 in this.target_)) {
          var t2;
          if (null != (t2 = this.target_[j]) && t2[A3]) return;
          B(1, e3.annotationType_, this.name_ + "." + A3.toString());
        }
        for (var n2 = this.target_; n2 && n2 !== p; ) {
          var r2 = w(n2, A3);
          if (r2) {
            var o2 = e3.make_(this, A3, r2, n2);
            if (0 === o2) return;
            if (1 === o2) break;
          }
          n2 = Object.getPrototypeOf(n2);
        }
        Wt(this, e3, A3);
      }
    }, e2.extend_ = function(A3, e3, t2, n2) {
      if (void 0 === n2 && (n2 = false), true === t2 && (t2 = this.defaultAnnotation_), false === t2) return this.defineProperty_(A3, e3, n2);
      var r2 = t2.extend_(this, A3, e3, n2);
      return r2 && Wt(this, t2, A3), r2;
    }, e2.defineProperty_ = function(A3, e3, t2) {
      void 0 === t2 && (t2 = false), this.keysAtom_;
      try {
        ye();
        var n2 = this.delete_(A3);
        if (!n2) return n2;
        if (ut(this)) {
          var r2 = ht(this, { object: this.proxy_ || this.target_, name: A3, type: Kt, newValue: e3.value });
          if (!r2) return null;
          var o2 = r2.newValue;
          e3.value !== o2 && (e3 = J({}, e3, { value: o2 }));
        }
        if (t2) {
          if (!Reflect.defineProperty(this.target_, A3, e3)) return false;
        } else f(this.target_, A3, e3);
        this.notifyPropertyAddition_(A3, e3.value);
      } finally {
        Ee();
      }
      return true;
    }, e2.defineObservableProperty_ = function(A3, e3, t2, n2) {
      void 0 === n2 && (n2 = false), this.keysAtom_;
      try {
        ye();
        var r2 = this.delete_(A3);
        if (!r2) return r2;
        if (ut(this)) {
          var o2 = ht(this, { object: this.proxy_ || this.target_, name: A3, type: Kt, newValue: e3 });
          if (!o2) return null;
          e3 = o2.newValue;
        }
        var i2 = Yt(A3), s2 = { configurable: !ve.safeDescriptors || this.isPlainObject_, enumerable: true, get: i2.get, set: i2.set };
        if (n2) {
          if (!Reflect.defineProperty(this.target_, A3, s2)) return false;
        } else f(this.target_, A3, s2);
        var a2 = new ne(e3, t2, "ObservableObject.key", false);
        this.values_.set(A3, a2), this.notifyPropertyAddition_(A3, a2.value_);
      } finally {
        Ee();
      }
      return true;
    }, e2.defineComputedProperty_ = function(A3, e3, t2) {
      void 0 === t2 && (t2 = false), this.keysAtom_;
      try {
        ye();
        var n2 = this.delete_(A3);
        if (!n2) return n2;
        if (ut(this)) {
          if (!ht(this, { object: this.proxy_ || this.target_, name: A3, type: Kt, newValue: void 0 })) return null;
        }
        e3.name || (e3.name = "ObservableObject.key"), e3.context = this.proxy_ || this.target_;
        var r2 = Yt(A3), o2 = { configurable: !ve.safeDescriptors || this.isPlainObject_, enumerable: false, get: r2.get, set: r2.set };
        if (t2) {
          if (!Reflect.defineProperty(this.target_, A3, o2)) return false;
        } else f(this.target_, A3, o2);
        this.values_.set(A3, new re(e3)), this.notifyPropertyAddition_(A3, void 0);
      } finally {
        Ee();
      }
      return true;
    }, e2.delete_ = function(A3, e3) {
      if (void 0 === e3 && (e3 = false), this.keysAtom_, !T(this.target_, A3)) return true;
      if (ut(this) && !ht(this, { object: this.proxy_ || this.target_, name: A3, type: Vt })) return null;
      try {
        var t2;
        ye();
        var n2, r2 = gt(this), o2 = this.values_.get(A3), i2 = void 0;
        if (!o2 && r2) i2 = null == (n2 = w(this.target_, A3)) ? void 0 : n2.value;
        if (e3) {
          if (!Reflect.deleteProperty(this.target_, A3)) return false;
        } else delete this.target_[A3];
        if (o2 && (this.values_.delete(A3), o2 instanceof ne && (i2 = o2.value_), Ie(o2)), this.keysAtom_.reportChanged(), null == (t2 = this.pendingKeys_) || null == (t2 = t2.get(A3)) || t2.set(A3 in this.target_), r2) {
          var s2 = { type: Vt, observableKind: "object", object: this.proxy_ || this.target_, debugObjectName: this.name_, oldValue: i2, name: A3 };
          0, r2 && wt(this, s2);
        }
      } finally {
        Ee();
      }
      return true;
    }, e2.observe_ = function(A3, e3) {
      return dt(this, A3);
    }, e2.intercept_ = function(A3) {
      return Bt(this, A3);
    }, e2.notifyPropertyAddition_ = function(A3, e3) {
      var t2, n2 = gt(this);
      if (n2) {
        var r2 = n2 ? { type: Kt, observableKind: "object", debugObjectName: this.name_, object: this.proxy_ || this.target_, name: A3, newValue: e3 } : null;
        n2 && wt(this, r2);
      }
      null == (t2 = this.pendingKeys_) || null == (t2 = t2.get(A3)) || t2.set(true), this.keysAtom_.reportChanged();
    }, e2.ownKeys_ = function() {
      return this.keysAtom_.reportObserved(), M(this.target_);
    }, e2.keys_ = function() {
      return this.keysAtom_.reportObserved(), Object.keys(this.target_);
    }, A2;
  }();
  function Xt(A2, e2) {
    var t2;
    if (T(A2, eA)) return A2;
    var n2 = null != (t2 = null == e2 ? void 0 : e2.name) ? t2 : "ObservableObject", r2 = new Nt(A2, /* @__PURE__ */ new Map(), String(n2), function(A3) {
      var e3;
      return A3 ? null != (e3 = A3.defaultDecorator) ? e3 : HA(A3) : void 0;
    }(e2));
    return x(A2, eA, r2), A2;
  }
  var _t = D("ObservableObjectAdministration", Nt);
  function Yt(A2) {
    return Gt[A2] || (Gt[A2] = { get: function() {
      return this[eA].getObservablePropValue_(A2);
    }, set: function(e2) {
      return this[eA].setObservablePropValue_(A2, e2);
    } });
  }
  function Jt(A2) {
    return !!I(A2) && _t(A2[eA]);
  }
  function Wt(A2, e2, t2) {
    var n2;
    null == (n2 = A2.target_[j]) || delete n2[t2];
  }
  var zt, Zt, jt = tn(0), qt = function() {
    var A2 = false, e2 = {};
    return Object.defineProperty(e2, "0", { set: function() {
      A2 = true;
    } }), Object.create(e2)[0] = 1, false === A2;
  }(), $t = 0, An = function() {
  };
  zt = An, Zt = Array.prototype, Object.setPrototypeOf ? Object.setPrototypeOf(zt.prototype, Zt) : void 0 !== zt.prototype.__proto__ ? zt.prototype.__proto__ = Zt : zt.prototype = Zt;
  var en = function(A2) {
    function e2(e3, t3, n2, r2) {
      var o2;
      return void 0 === n2 && (n2 = "ObservableArray"), void 0 === r2 && (r2 = false), o2 = A2.call(this) || this, cn(function() {
        var A3 = new Ut(n2, t3, r2, true);
        A3.proxy_ = o2, K(o2, eA, A3), e3 && e3.length && o2.spliceWithArray(0, 0, e3), qt && Object.defineProperty(o2, "0", jt);
      }), o2;
    }
    W(e2, A2);
    var t2 = e2.prototype;
    return t2.concat = function() {
      this[eA].atom_.reportObserved();
      for (var A3 = arguments.length, e3 = new Array(A3), t3 = 0; t3 < A3; t3++) e3[t3] = arguments[t3];
      return Array.prototype.concat.apply(this.slice(), e3.map(function(A4) {
        return St(A4) ? A4.slice() : A4;
      }));
    }, t2[Symbol.iterator] = function() {
      var A3 = this, e3 = 0;
      return fn({ next: function() {
        return e3 < A3.length ? { value: A3[e3++], done: false } : { done: true, value: void 0 };
      } });
    }, _(e2, [{ key: "length", get: function() {
      return this[eA].getArrayLength_();
    }, set: function(A3) {
      this[eA].setArrayLength_(A3);
    } }, { key: Symbol.toStringTag, get: function() {
      return "Array";
    } }]);
  }(An);
  function tn(A2) {
    return { enumerable: false, configurable: true, get: function() {
      return this[eA].get_(A2);
    }, set: function(e2) {
      this[eA].set_(A2, e2);
    } };
  }
  function nn(A2) {
    f(en.prototype, "" + A2, tn(A2));
  }
  function rn(A2) {
    if (A2 > $t) {
      for (var e2 = $t; e2 < A2 + 100; e2++) nn(e2);
      $t = A2;
    }
  }
  function on(A2, e2, t2) {
    return new en(A2, e2, t2);
  }
  function sn(A2, e2) {
    if ("object" == typeof A2 && null !== A2) {
      if (St(A2)) return void 0 !== e2 && B(23), A2[eA].atom_;
      if (Tt(A2)) return A2.atom_;
      if (Ot(A2)) {
        if (void 0 === e2) return A2.keysAtom_;
        var t2 = A2.data_.get(e2) || A2.hasMap_.get(e2);
        return t2 || B(25, e2, ln(A2)), t2;
      }
      if (Jt(A2)) {
        if (!e2) return B(26);
        var n2 = A2[eA].values_.get(e2);
        return n2 || B(27, e2, ln(A2)), n2;
      }
      if (nA(A2) || se(A2) || Le(A2)) return A2;
    } else if (E(A2) && Le(A2[eA])) return A2[eA];
    B(28);
  }
  function an(A2, e2) {
    return A2 || B(29), void 0 !== e2 ? an(sn(A2, e2)) : nA(A2) || se(A2) || Le(A2) || Ot(A2) || Tt(A2) ? A2 : A2[eA] ? A2[eA] : void B(24, A2);
  }
  function ln(A2, e2) {
    var t2;
    if (void 0 !== e2) t2 = sn(A2, e2);
    else {
      if (_e(A2)) return A2.name;
      t2 = Jt(A2) || Ot(A2) || Tt(A2) ? an(A2) : sn(A2);
    }
    return t2.name_;
  }
  function cn(A2) {
    var e2 = ge(), t2 = ee(true);
    ye();
    try {
      return A2();
    } finally {
      Ee(), te(t2), de(e2);
    }
  }
  Object.entries(Ft).forEach(function(A2) {
    var e2 = A2[0], t2 = A2[1];
    "concat" !== e2 && x(en.prototype, e2, t2);
  }), rn(1e3);
  var un, Bn = p.toString;
  function hn(A2, e2, t2) {
    return void 0 === t2 && (t2 = -1), gn(A2, e2, t2);
  }
  function gn(A2, e2, t2, n2, r2) {
    if (A2 === e2) return 0 !== A2 || 1 / A2 == 1 / e2;
    if (null == A2 || null == e2) return false;
    if (A2 != A2) return e2 != e2;
    var o2 = typeof A2;
    if ("function" !== o2 && "object" !== o2 && "object" != typeof e2) return false;
    var i2 = Bn.call(A2);
    if (i2 !== Bn.call(e2)) return false;
    switch (i2) {
      case "[object RegExp]":
      case "[object String]":
        return "" + A2 == "" + e2;
      case "[object Number]":
        return +A2 != +A2 ? +e2 != +e2 : 0 === +A2 ? 1 / +A2 == 1 / e2 : +A2 === +e2;
      case "[object Date]":
      case "[object Boolean]":
        return +A2 === +e2;
      case "[object Symbol]":
        return "undefined" != typeof Symbol && Symbol.valueOf.call(A2) === Symbol.valueOf.call(e2);
      case "[object Map]":
      case "[object Set]":
        t2 >= 0 && t2++;
    }
    A2 = dn(A2), e2 = dn(e2);
    var s2 = "[object Array]" === i2;
    if (!s2) {
      if ("object" != typeof A2 || "object" != typeof e2) return false;
      var a2 = A2.constructor, l2 = e2.constructor;
      if (a2 !== l2 && !(E(a2) && a2 instanceof a2 && E(l2) && l2 instanceof l2) && "constructor" in A2 && "constructor" in e2) return false;
    }
    if (0 === t2) return false;
    t2 < 0 && (t2 = -1), r2 = r2 || [];
    for (var c2 = (n2 = n2 || []).length; c2--; ) if (n2[c2] === A2) return r2[c2] === e2;
    if (n2.push(A2), r2.push(e2), s2) {
      if ((c2 = A2.length) !== e2.length) return false;
      for (; c2--; ) if (!gn(A2[c2], e2[c2], t2 - 1, n2, r2)) return false;
    } else {
      var u2 = Object.keys(A2), B2 = u2.length;
      if (Object.keys(e2).length !== B2) return false;
      for (var h2 = 0; h2 < B2; h2++) {
        var g2 = u2[h2];
        if (!T(e2, g2) || !gn(A2[g2], e2[g2], t2 - 1, n2, r2)) return false;
      }
    }
    return n2.pop(), r2.pop(), true;
  }
  function dn(A2) {
    return St(A2) ? A2.slice() : L(A2) || Ot(A2) || O(A2) || Tt(A2) ? Array.from(A2.entries()) : A2;
  }
  var wn = (null == (un = g().Iterator) ? void 0 : un.prototype) || {};
  function fn(A2) {
    return A2[Symbol.iterator] = pn, Object.assign(Object.create(wn), A2);
  }
  function pn() {
    return this;
  }
  function Cn(A2, e2) {
    var t2 = function() {
      Object.assign(A2, e2());
    };
    return t2(), t2;
  }
  ["Symbol", "Map", "Set"].forEach(function(A2) {
    void 0 === g()[A2] && B("MobX requires global '" + A2 + "' to be available or polyfilled");
  }), "object" == typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({ spy: function(A2) {
    return console.warn("[mobx.spy] Is a no-op in production builds"), function() {
    };
  }, extras: { getDebugName: ln }, $mobx: eA });
  var Qn = [];
  function vn(A2) {
    Qn.push(A2);
  }
  function Un() {
    Qn.forEach(function(A2) {
      return A2();
    });
  }
  var mn = "image/png", Fn = 0.75, yn = ["image/png", "image/jpeg", "image/webp"], En = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }, bn = function(A2) {
    return "string" == typeof A2 && yn.includes(A2);
  }, In = function(A2) {
    var e2 = null == A2 ? void 0 : A2.type, t2 = "number" == typeof (null == A2 ? void 0 : A2.quality) && Number.isFinite(A2.quality) ? Math.min(1, Math.max(0, A2.quality)) : Fn;
    return { type: bn(e2) ? e2 : mn, quality: t2 };
  }, Hn = new (function() {
    function e2() {
      var A2 = this;
      this.applyInitialState = Cn(this, function() {
        return A2.initialState();
      }), pt(this, { snapdom: false }, { autoBind: true }), vn(this.reset);
    }
    return e2.prototype.initialState = function() {
      return { enableWebRtc: true, menuBarHeight: 0, clickCutFullScreen: false, imgSrc: null, loadCrossImg: false, proxyUrl: void 0, useCORS: false, h2cIgnoreElementsFn: function() {
        return false;
      }, position: { left: 0, top: 0 }, wrcReplyTime: 500, cropBoxInfo: null, toolPosition: "center", wrcImgPosition: { x: 0, y: 0, w: 0, h: 0 }, hiddenScrollBar: { color: "#000000", fillState: false, state: false, fillWidth: 0, fillHeight: 0 }, wrcWindowMode: false, customRightClickEvent: { state: false }, screenFlow: null, canvasWidth: 0, canvasHeight: 0, showScreenData: false, screenShotDom: null, destroyContainer: true, maskColor: { r: 0, g: 0, b: 0, a: 0.6 }, writeBase64: true, exportOptions: In(), cutBoxBdColor: "#2CABFF", maxUndoNum: 15, useRatioArrow: false, imgAutoFit: false, useCustomImgSize: false, customImgSize: { w: 0, h: 0 }, userToolbar: [], h2cCrossImgLoadErrFn: null, saveCallback: null, saveImgTitle: null, canvasEvents: null, customElementAdapters: [], renderOptions: { x: 0, y: 0 }, canvasElements: [], domRenderEngine: "html2canvas", snapdom: null, snapdomOptions: {}, captureCursor: "never" };
    }, e2.prototype.setWebRtcStatus = function(A2) {
      this.enableWebRtc = A2;
    }, e2.prototype.setMenuBarHeight = function(A2) {
      this.menuBarHeight = A2;
    }, e2.prototype.setClickCutFullScreenStatus = function(A2) {
      this.clickCutFullScreen = A2;
    }, e2.prototype.setImgSrc = function(A2) {
      this.imgSrc = A2;
    }, e2.prototype.setLoadCrossImg = function(A2) {
      this.loadCrossImg = A2;
    }, e2.prototype.setProxyUrl = function(A2) {
      this.proxyUrl = A2;
    }, e2.prototype.setUseCORS = function(A2) {
      this.useCORS = A2;
    }, e2.prototype.setH2cIgnoreElementsFn = function(A2) {
      this.h2cIgnoreElementsFn = A2;
    }, e2.prototype.setPosition = function(A2) {
      this.position = { top: A2.top, left: A2.left };
    }, e2.prototype.setWrcReplyTime = function(A2) {
      this.wrcReplyTime = A2;
    }, e2.prototype.setCropBoxInfo = function(A2) {
      this.cropBoxInfo = A2;
    }, e2.prototype.setToolPosition = function(A2) {
      this.toolPosition = A2;
    }, e2.prototype.setWrcImgPosition = function(A2) {
      this.wrcImgPosition = A2;
    }, e2.prototype.setHiddenScrollBar = function(A2) {
      this.hiddenScrollBar = A2;
    }, e2.prototype.setWrcWindowMode = function(A2) {
      this.wrcWindowMode = A2;
    }, e2.prototype.setCustomRightClickEvent = function(A2) {
      this.customRightClickEvent = A2;
    }, e2.prototype.setScreenShotDom = function(A2) {
      this.screenShotDom = A2;
    }, e2.prototype.setCutBoxBdColor = function(A2) {
      this.cutBoxBdColor = A2;
    }, e2.prototype.setScreenFlow = function(A2) {
      this.screenFlow = A2;
    }, e2.prototype.getCanvasSize = function() {
      return { canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight };
    }, e2.prototype.setCanvasSize = function(A2, e3) {
      this.canvasWidth = A2, this.canvasHeight = e3;
    }, e2.prototype.setShowScreenDataStatus = function(A2) {
      this.showScreenData = A2;
    }, e2.prototype.setMaskColor = function(A2) {
      this.maskColor = A2;
    }, e2.prototype.setWriteImgState = function(A2) {
      this.writeBase64 = A2;
    }, e2.prototype.setExportOptions = function(e3) {
      this.exportOptions = In(A(A({}, this.exportOptions), e3));
    }, e2.prototype.setSaveCallback = function(A2) {
      this.saveCallback = A2;
    }, e2.prototype.setMaxUndoNum = function(A2) {
      this.maxUndoNum = A2;
    }, e2.prototype.setRatioArrow = function(A2) {
      this.useRatioArrow = A2;
    }, e2.prototype.setImgAutoFit = function(A2) {
      this.imgAutoFit = A2;
    }, e2.prototype.setUseCustomImgSize = function(A2, e3) {
      A2 && e3 ? (this.useCustomImgSize = true, this.customImgSize = e3) : (this.useCustomImgSize = false, this.customImgSize = this.initialState().customImgSize);
    }, e2.prototype.getCustomImgSize = function() {
      return { useCustomImgSize: this.useCustomImgSize, customImgSize: this.customImgSize };
    }, e2.prototype.setSaveImgTitle = function(A2) {
      this.saveImgTitle = A2;
    }, e2.prototype.setDestroyContainerState = function(A2) {
      this.destroyContainer = A2;
    }, e2.prototype.setUserToolbar = function(e3) {
      this.userToolbar = e3.map(function(e4, t2) {
        return A(A({}, e4), { id: 100 + (t2 + 1) });
      });
    }, e2.prototype.setH2cCrossImgLoadErrFn = function(A2) {
      this.h2cCrossImgLoadErrFn = A2;
    }, e2.prototype.setCanvasEvents = function(A2) {
      this.canvasEvents = A2;
    }, e2.prototype.setCustomElementAdapters = function(A2) {
      this.customElementAdapters = n([], A2, true);
    }, e2.prototype.getCustomElementAdapter = function(A2, e3) {
      return this.customElementAdapters.find(function(t2) {
        var n2 = null != A2 && null != t2.toolId && t2.toolId === A2, r2 = null != e3 && null != t2.toolName && t2.toolName === e3;
        return n2 || r2;
      });
    }, e2.prototype.setCanvasElements = function(A2) {
      this.canvasElements = JSON.parse(JSON.stringify(A2));
    }, e2.prototype.getCanvasElements = function() {
      return JSON.parse(JSON.stringify(this.canvasElements));
    }, e2.prototype.setRenderOptions = function(e3) {
      this.renderOptions = A({}, e3);
    }, e2.prototype.setDomRenderEngine = function(A2) {
      this.domRenderEngine = A2;
    }, e2.prototype.setSnapDomRenderer = function(A2) {
      this.snapdom = A2;
    }, e2.prototype.setSnapDomOptions = function(e3) {
      this.snapdomOptions = A({}, e3);
    }, e2.prototype.setCaptureCursor = function(A2) {
      this.captureCursor = A2;
    }, e2.prototype.getCanvasEvents = function() {
      return this.canvasEvents;
    }, e2.prototype.reset = function() {
      this.applyInitialState();
    }, e2;
  }())();
  function Sn(A2, e2, t2, n2, r2, o2, i2) {
    void 0 === o2 && (o2 = Fn), void 0 === i2 && (i2 = mn);
    var s2 = In({ type: i2, quality: o2 }), a2 = window.devicePixelRatio || 1, l2 = A2.getImageData(e2 * a2, t2 * a2, n2 * a2, r2 * a2), c2 = document.createElement("canvas"), B2 = u(c2, n2, r2);
    if (B2) {
      B2.putImageData(l2, 0, 0);
      var h2 = document.createElement("a");
      h2.href = c2.toDataURL(s2.type, s2.quality);
      var g2 = function(A3, e3) {
        var t3, n3 = null === (t3 = /^data:([^;,]+)/.exec(A3)) || void 0 === t3 ? void 0 : t3[1];
        return bn(n3) ? n3 : e3;
      }(h2.href, s2.type), d2 = Hn.saveImgTitle || (/* @__PURE__ */ new Date()).getTime();
      h2.download = "".concat(d2, ".").concat(function(A3) {
        return En[A3];
      }(g2)), h2.click();
    }
  }
  function xn(A2, e2, t2) {
    void 0 === t2 && (t2 = document.body);
    var n2 = t2.getBoundingClientRect();
    return { left: A2 || Math.abs(n2.left), top: e2 || Math.abs(n2.top) };
  }
  var Kn = function(A2, e2) {
    A2 && (A2.style.display = e2);
  }, Dn = function(A2, e2, t2) {
    A2 && (A2.style.left = e2, A2.style.top = t2);
  }, Ln = function(A2, e2, t2) {
    A2 && (A2.width = e2, A2.height = t2);
  }, On = function(A2, e2) {
    A2 && (A2.style.backgroundColor = e2);
  }, kn = function(A2, e2) {
    A2 && A2.classList.add(e2);
  }, Mn = function(A2, e2, t2) {
    if (A2) {
      var n2 = "".concat(e2, " * ").concat(t2), r2 = A2.firstChild;
      if (r2) r2.innerText = n2;
      else {
        var o2 = document.createElement("p");
        o2.innerText = n2, A2.appendChild(o2);
      }
    }
  }, Pn = function(A2, e2) {
    A2 && (A2.style.cursor = e2);
  }, Tn = function(A2, e2, t2) {
    if (A2) {
      if (A2.removeEventListener("click", e2), t2) return A2.classList.add("undo"), A2.classList.remove("undo-disabled"), void A2.addEventListener("click", e2);
      A2.classList.add("undo-disabled"), A2.classList.remove("undo");
    }
  }, Rn = function() {
    function A2() {
      var A3 = this;
      this.applyInitialState = Cn(this, function() {
        return A3.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return A2.prototype.initialState = function() {
      return { screenShotController: null, cutBoxSizeContainer: null, textInputController: null, videoController: null, noScrollStatus: false, resetScrollbarState: false, mousePointer: "default", keyboardEventHandler: null };
    }, A2.prototype.hydrateDomRefs = function() {
      this.screenShotController = document.getElementById("screenShotContainer"), this.textInputController = document.getElementById("textInputPanel"), this.cutBoxSizeContainer = document.getElementById("cutBoxSizePanel");
    }, A2.prototype.setNoScrollStatus = function(A3) {
      null != A3 && (this.noScrollStatus = A3);
    }, A2.prototype.setKeyboardEventHandler = function(A3) {
      this.keyboardEventHandler = A3;
    }, A2.prototype.setResetScrollbarState = function(A3) {
      this.resetScrollbarState = A3;
    }, A2.prototype.initWebRtcDom = function() {
      this.videoController = document.createElement("video"), this.videoController.autoplay = true;
    }, A2.prototype.setVideoSrcObject = function(A3) {
      null != this.videoController && (this.videoController.srcObject = A3);
    }, A2.prototype.showScreenShotPanel = function() {
      Kn(this.screenShotController, "block");
    }, A2.prototype.updateCutBoxSizeShowState = function(A3) {
      Kn(this.cutBoxSizeContainer, A3);
    }, A2.prototype.updateTextInputShowState = function(A3) {
      Kn(this.textInputController, A3);
    }, A2.prototype.updateCutBoxSizePosition = function(A3, e2, t2) {
      Dn(this.cutBoxSizeContainer, "".concat(A3, "px"), "".concat(e2 + t2, "px"));
    }, A2.prototype.updateCutBoxSizeInfo = function(A3, e2) {
      Mn(this.cutBoxSizeContainer, Math.floor(A3), Math.floor(e2));
    }, A2.prototype.updateScreenShotControllerSize = function(A3, e2) {
      Ln(this.screenShotController, A3, e2);
    }, A2.prototype.updateScreenShotPosition = function(A3, e2) {
      Dn(this.screenShotController, "".concat(A3, "px"), "".concat(e2, "px"));
    }, A2.prototype.setCursorStyle = function(A3) {
      Pn(this.screenShotController, A3), this.mousePointer = A3;
    }, A2.prototype.destroyDOM = function() {
      var A3;
      this.keyboardEventHandler && (document.body.removeEventListener("keydown", this.keyboardEventHandler), this.keyboardEventHandler = null), this.noScrollStatus && document.body.classList.remove("__screenshot-lock-scroll"), null === (A3 = this.screenShotController) || void 0 === A3 || A3.classList.remove("no-cursor"), this.removeElement(this.screenShotController), this.removeElement(this.textInputController), this.removeElement(this.cutBoxSizeContainer), document.body.classList.contains("no-cursor") && document.body.classList.remove("no-cursor"), this.resetScrollbarState && (document.documentElement.classList.remove("hidden-screen-shot-scroll"), document.body.classList.remove("hidden-screen-shot-scroll")), null != this.videoController && (this.videoController.srcObject = null);
    }, A2.prototype.removeElement = function(A3) {
      var e2;
      null === (e2 = null == A3 ? void 0 : A3.parentElement) || void 0 === e2 || e2.removeChild(A3);
    }, A2.prototype.reset = function() {
      this.applyInitialState();
    }, A2;
  }(), Gn = new Rn(), Vn = function() {
    function A2() {
      var A3 = this;
      this.applyInitialState = Cn(this, function() {
        return A3.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return A2.prototype.initialState = function() {
      return { draggingTrim: false, dragging: false, borderSize: 10, cutOutBoxPosition: { startX: 0, startY: 0, width: 0, height: 0 }, drawGraphPosition: { startX: 0, startY: 0, width: 0, height: 0 } };
    }, A2.prototype.setDraggingTrim = function(A3) {
      this.draggingTrim = A3;
    }, A2.prototype.setDragging = function(A3) {
      this.dragging = A3;
    }, A2.prototype.setCutOutBoxPosition = function(A3, e2, t2, n2) {
      this.cutOutBoxPosition = { startX: A3, startY: e2, width: t2, height: n2 };
    }, A2.prototype.setCutBoxSizeStatus = function(A3) {
      Gn.updateCutBoxSizeShowState(A3 ? "flex" : "none");
    }, A2.prototype.setCutBoxSizePosition = function(A3, e2) {
      var t2 = xn(A3, e2), n2 = t2.left, r2 = t2.top, o2 = 0;
      Gn.screenShotController && (o2 = parseInt(Gn.screenShotController.style.top)), Gn.updateCutBoxSizePosition(n2, r2, o2);
    }, A2.prototype.setCutBoxSize = function(A3, e2) {
      Gn.updateCutBoxSizeInfo(Math.floor(A3), Math.floor(e2));
    }, A2.prototype.updateDrawGraphPosition = function(A3, e2, t2, n2) {
      var r2 = this, o2 = { mouseX: A3, mouseY: e2, width: t2, height: n2 }, i2 = { mouseX: "startX", mouseY: "startY", width: "width", height: "height" };
      Object.entries(o2).forEach(function(A4) {
        var e3 = A4[0], t3 = A4[1];
        void 0 !== t3 && (r2.drawGraphPosition[i2[e3]] = t3);
      });
    }, A2.prototype.reset = function() {
      this.applyInitialState();
    }, A2;
  }(), Nn = new Vn(), Xn = new (function() {
    function A2() {
      var A3 = this;
      this.applyInitialState = Cn(this, function() {
        return A3.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return A2.prototype.initialState = function() {
      return { imageController: null, screenShotCanvas: null };
    }, A2.prototype.updateScreenShotCanvas = function(A3) {
      this.screenShotCanvas = A3;
    }, A2.prototype.setImageController = function(A3) {
      this.imageController = A3;
    }, A2.prototype.reset = function() {
      this.applyInitialState();
    }, A2;
  }())();
  function _n(A2) {
    var e2 = Xn.screenShotCanvas, t2 = Nn.cutOutBoxPosition, n2 = t2.startX, r2 = t2.startY, o2 = t2.width, i2 = t2.height, s2 = Hn.exportOptions, a2 = s2.type, l2 = s2.quality, c2 = "";
    return e2 && (A2 && Sn(e2, n2, r2, o2, i2, l2, a2), c2 = function(A3, e3, t3, n3, r3, o3, i3, s3) {
      void 0 === o3 && (o3 = Fn), void 0 === i3 && (i3 = true), void 0 === s3 && (s3 = mn);
      var a3 = In({ type: s3, quality: o3 }), l3 = window.devicePixelRatio || 1, c3 = A3.getImageData(e3 * l3, t3 * l3, n3 * l3, r3 * l3), B2 = document.createElement("canvas"), h2 = u(B2, n3, r3);
      return h2 ? (h2.putImageData(c3, 0, 0), i3 && (null == B2 || B2.toBlob(function(A4) {
        var e4, t4;
        if (null != A4) {
          var n4 = window.ClipboardItem;
          if (null == n4) return B2.toDataURL(a3.type, a3.quality);
          var r4 = new n4(((e4 = {})[A4.type] = A4, e4));
          null === (t4 = navigator.clipboard) || void 0 === t4 || t4.write([r4]).then(function() {
            return "写入成功";
          });
        }
      }, a3.type, a3.quality)), B2.toDataURL(a3.type, a3.quality)) : "";
    }(e2, n2, r2, o2, i2, l2, Hn.writeBase64, a2)), c2;
  }
  var Yn = "rgba(0, 0, 0, .6)";
  function Jn(A2, e2, t2, n2, r2, o2, i2, s2, a2) {
    void 0 === a2 && (a2 = true);
    var l2 = null == i2 ? void 0 : i2.width, c2 = null == i2 ? void 0 : i2.height, u2 = window.devicePixelRatio || 1;
    if (l2 && c2 && s2 && i2) {
      r2.clearRect(0, 0, l2, c2), t2 = 0 !== t2 ? t2 : 5, n2 = 0 !== n2 ? n2 : 5, r2.save();
      var B2 = Hn.maskColor;
      if (r2.fillStyle = Yn, B2 && (r2.fillStyle = "rgba(".concat(B2.r, ", ").concat(B2.g, ", ").concat(B2.b, ", ").concat(B2.a, ")")), r2.fillRect(0, 0, l2, c2), r2.globalCompositeOperation = "source-atop", r2.clearRect(A2, e2, t2, n2), r2.globalCompositeOperation = "source-over", r2.fillStyle = Hn.cutBoxBdColor, a2) {
        var h2 = o2;
        r2.fillRect(A2 - h2 / 2, e2 - h2 / 2, h2, h2), r2.fillRect(A2 - h2 / 2 + t2 / 2, e2 - h2 / 2, h2, h2), r2.fillRect(A2 - h2 / 2 + t2, e2 - h2 / 2, h2, h2), r2.fillRect(A2 - h2 / 2, e2 - h2 / 2 + n2 / 2, h2, h2), r2.fillRect(A2 - h2 / 2 + t2, e2 - h2 / 2 + n2 / 2, h2, h2), r2.fillRect(A2 - h2 / 2, e2 - h2 / 2 + n2, h2, h2), r2.fillRect(A2 - h2 / 2 + t2 / 2, e2 - h2 / 2 + n2, h2, h2), r2.fillRect(A2 - h2 / 2 + t2, e2 - h2 / 2 + n2, h2, h2);
      }
      r2.restore(), r2.save(), r2.globalCompositeOperation = "destination-over";
      var g2 = { imgWidth: parseInt(null == i2 ? void 0 : i2.style.width), imgHeight: parseInt(null == i2 ? void 0 : i2.style.height) }, d2 = g2.imgWidth, w2 = g2.imgHeight, f2 = Hn.screenShotDom;
      if (null != f2 && (d2 = f2.clientWidth, w2 = f2.clientHeight), Hn.getCustomImgSize().useCustomImgSize) {
        var p2 = Hn.getCustomImgSize().customImgSize;
        d2 = p2.w, w2 = p2.h;
      }
      return Hn.enableWebRtc || Hn.imgAutoFit || Hn.getCustomImgSize().useCustomImgSize || null != f2 || (d2 = s2.width / u2, w2 = s2.height / u2), r2.drawImage(s2, 0, 0, d2, w2), r2.restore(), t2 > 0 && n2 > 0 ? { startX: A2, startY: e2, width: t2, height: n2 } : t2 < 0 && n2 < 0 ? { startX: A2 + t2, startY: e2 + n2, width: Math.abs(t2), height: Math.abs(n2) } : t2 > 0 && n2 < 0 ? { startX: A2, startY: e2 + n2, width: t2, height: Math.abs(n2) } : t2 < 0 && n2 > 0 ? { startX: A2 + t2, startY: e2, width: Math.abs(t2), height: n2 } : { startX: A2, startY: e2, width: t2, height: n2 };
    }
  }
  function Wn(A2, e2, t2, n2) {
    return [{ x: A2, y: e2 }, { x: A2 + t2, y: e2 }, { x: A2 + t2, y: e2 + n2 }, { x: A2, y: e2 + n2 }, { x: A2 + t2 / 2, y: e2 }, { x: A2 + t2, y: e2 + n2 / 2 }, { x: A2 + t2 / 2, y: e2 + n2 }, { x: A2, y: e2 + n2 / 2 }];
  }
  function zn(A2, e2, t2, n2, r2, o2, i2, s2, a2) {
    (i2.save(), i2.strokeStyle = r2, i2.lineWidth = o2, a2 && a2.length > 0 && i2.setLineDash(a2), i2.beginPath(), i2.rect(A2, e2, t2, n2), i2.stroke(), s2 && s2.drawState) && Wn(A2, e2, t2, n2).forEach(function(A3) {
      i2.beginPath(), i2.arc(A3.x, A3.y, s2.dotRadius, 0, 2 * Math.PI), i2.fillStyle = "#ffffff", i2.fill(), i2.lineWidth = 1, i2.strokeStyle = r2, i2.stroke();
    });
    i2.restore();
  }
  var Zn = /\r?\n/, jn = [6, 4], qn = function(A2) {
    return (null != A2 ? A2 : "").split(Zn);
  }, $n = function(A2) {
    return 1.4 * A2;
  }, Ar = function(A2, e2, t2) {
    var n2 = qn(A2), r2 = $n(e2);
    t2.save(), t2.font = "bold ".concat(e2, "px none");
    for (var o2 = 0, i2 = 0; i2 < n2.length; i2++) {
      var s2 = t2.measureText(n2[i2]);
      o2 = Math.max(o2, s2.width);
    }
    t2.restore();
    var a2 = Math.max(n2.length, 1);
    return { width: o2, height: r2 * a2, lineHeight: r2, lineCount: a2 };
  }, er = function() {
    var A2 = Nn.cutOutBoxPosition;
    return { x: A2.startX, y: A2.startY, width: A2.width, height: A2.height };
  }, tr = function(A2, e2) {
    return A2.width > 0 && A2.height > 0 && e2.width > 0 && e2.height > 0 && A2.x < e2.x + e2.width && A2.x + A2.width > e2.x && A2.y < e2.y + e2.height && A2.y + A2.height > e2.y;
  }, nr = function(A2, e2, t2) {
    e2.width <= 0 || e2.height <= 0 || (A2.save(), A2.beginPath(), A2.rect(e2.x, e2.y, e2.width, e2.height), A2.clip(), t2(), A2.restore());
  };
  function rr(A2, e2, t2, n2, r2, o2) {
    var i2 = qn(A2), s2 = $n(r2), a2 = Ar(A2, r2, o2), l2 = { x: e2, y: t2 - s2 / 2, width: Math.max(a2.width, 0.6 * r2), height: a2.height }, c2 = er();
    tr(l2, c2) && nr(o2, c2, function() {
      o2.save(), o2.lineWidth = 1, o2.fillStyle = n2, o2.textBaseline = "middle", o2.textAlign = "left", o2.font = "bold ".concat(r2, "px none"), i2.forEach(function(A3, n3) {
        var r3 = t2 + s2 * n3;
        o2.fillText(A3, e2, r3);
      }), o2.restore();
    });
  }
  var or = function(A2, e2) {
    var t2 = er(), n2 = { x: A2.x, y: A2.y, width: A2.width, height: A2.height };
    if (tr(n2, t2)) {
      var r2 = $n(A2.fontSize);
      nr(e2, t2, function() {
        var t3;
        if (rr(A2.text, A2.x, A2.y + r2 / 2, A2.color, A2.fontSize, e2), A2.drawNode) {
          var n3 = null !== (t3 = A2.dotRadius) && void 0 !== t3 ? t3 : 0, o2 = n3 > 0 ? { drawState: true, dotRadius: n3 } : void 0;
          zn(A2.x, A2.y, A2.width, A2.height, A2.color, Math.max(A2.borderWidth, 1), e2, o2, jn);
        }
      });
    }
  }, ir = function(A2, e2, t2, n2, r2) {
    void 0 === r2 && (r2 = 5);
    var o2 = t2.x, i2 = t2.y, s2 = t2.width, a2 = t2.height, l2 = n2 + r2;
    return e2 >= i2 - l2 && e2 <= i2 + l2 && A2 >= o2 && A2 <= o2 + s2 || e2 >= i2 + a2 - l2 && e2 <= i2 + a2 + l2 && A2 >= o2 && A2 <= o2 + s2 || A2 >= o2 - l2 && A2 <= o2 + l2 && e2 >= i2 && e2 <= i2 + a2 || A2 >= o2 + s2 - l2 && A2 <= o2 + s2 + l2 && e2 >= i2 && e2 <= i2 + a2;
  }, sr = function(A2, e2) {
    var t2 = A2.startX, n2 = A2.startY, r2 = A2.width, o2 = A2.height, i2 = e2.mouseX, s2 = e2.mouseY;
    return i2 >= t2 && i2 <= t2 + r2 && s2 >= n2 && s2 <= n2 + o2;
  }, ar = function(A2) {
    var e2 = Math.abs(A2.width), t2 = Math.abs(A2.height);
    return { x: A2.width >= 0 ? A2.x : A2.x + A2.width, y: A2.height >= 0 ? A2.y : A2.y + A2.height, width: e2, height: t2 };
  }, lr = function(A2) {
    var e2 = A2.x, t2 = A2.y, n2 = A2.width, r2 = A2.height, o2 = e2 + n2 / 2, i2 = t2 + r2 / 2;
    return [{ x: o2, y: t2 }, { x: e2 + n2, y: i2 }, { x: o2, y: t2 + r2 }, { x: e2, y: i2 }];
  }, cr = function(A2, e2, t2, n2, r2) {
    var o2 = ar(e2);
    A2.save(), A2.lineWidth = t2, A2.strokeStyle = n2, function(A3, e3) {
      var t3 = e3.x, n3 = e3.y, r3 = e3.width / 2, o3 = e3.height / 2, i2 = t3 + r3, s2 = n3 + o3;
      if ("function" != typeof A3.ellipse) throw "你的浏览器不支持ellipse，无法绘制椭圆";
      A3.beginPath(), A3.ellipse(i2, s2, r3, o3, 0, 0, 2 * Math.PI);
    }(A2, o2), A2.stroke(), r2 && function(A3, e3, t3, n3) {
      n3.drawState && lr(e3).forEach(function(e4) {
        A3.beginPath(), A3.arc(e4.x, e4.y, n3.dotRadius, 0, 2 * Math.PI), A3.fillStyle = "#ffffff", A3.fill(), A3.lineWidth = 1, A3.strokeStyle = t3, A3.stroke();
      });
    }(A2, o2, n2, r2), A2.restore();
  };
  function ur(A2, e2, t2, n2, r2, o2, i2, s2) {
    var a2 = function(A3, e3, t3, n3) {
      var r3 = Math.min(A3, t3), o3 = Math.min(e3, n3);
      return { x: r3, y: o3, width: Math.max(A3, t3) - r3, height: Math.max(e3, n3) - o3 };
    }(e2, t2, n2, r2);
    cr(A2, a2, o2, i2, s2);
  }
  var Br = function(A2, e2, t2, n2, r2) {
    cr(A2, e2, t2, n2, r2);
  };
  function hr(A2, e2, t2, n2, r2) {
    void 0 === r2 && (r2 = 3);
    var o2 = ar(t2), i2 = o2.width / 2, s2 = o2.height / 2;
    if (i2 <= 0 && s2 <= 0) return false;
    var a2 = A2 - (o2.x + i2), l2 = e2 - (o2.y + s2), c2 = n2 / 2, u2 = i2 + c2 + r2, B2 = s2 + c2 + r2, h2 = Math.max(i2 - c2 - r2, 0), g2 = Math.max(s2 - c2 - r2, 0);
    return !(u2 <= 0 || B2 <= 0) && (!(a2 * a2 / (u2 * u2) + l2 * l2 / (B2 * B2) > 1) && (0 === h2 || 0 === g2 || a2 * a2 / (h2 * h2) + l2 * l2 / (g2 * g2) >= 1));
  }
  var gr = function() {
    function A2() {
      this.beginPoint = { x: 0, y: 0 }, this.stopPoint = { x: 0, y: 0 }, this.polygonVertex = [], this.angle = 0, this.arrowInfo = { edgeLen: 50, angle: 30 }, this.size = 1;
    }
    return A2.prototype.draw = function(A3, e2, t2, n2, r2, o2, i2) {
      switch (this.beginPoint.x = e2, this.beginPoint.y = t2, this.stopPoint.x = n2, this.stopPoint.y = r2, this.arrowCord(this.beginPoint, this.stopPoint), this.sideCord(), this.drawArrow(A3, o2), i2) {
        case 2:
        default:
          this.size = 1;
          break;
        case 5:
          this.size = 1.3;
          break;
        case 10:
          this.size = 1.7;
      }
    }, A2.prototype.arrowCord = function(A3, e2) {
      this.polygonVertex[0] = A3.x, this.polygonVertex[1] = A3.y, this.polygonVertex[6] = e2.x, this.polygonVertex[7] = e2.y, this.getRadian(A3, e2), this.polygonVertex[8] = e2.x - this.arrowInfo.edgeLen * Math.cos(Math.PI / 180 * (this.angle + this.arrowInfo.angle)), this.polygonVertex[9] = e2.y - this.arrowInfo.edgeLen * Math.sin(Math.PI / 180 * (this.angle + this.arrowInfo.angle)), this.polygonVertex[4] = e2.x - this.arrowInfo.edgeLen * Math.cos(Math.PI / 180 * (this.angle - this.arrowInfo.angle)), this.polygonVertex[5] = e2.y - this.arrowInfo.edgeLen * Math.sin(Math.PI / 180 * (this.angle - this.arrowInfo.angle));
    }, A2.prototype.getRadian = function(A3, e2) {
      this.angle = Math.atan2(e2.y - A3.y, e2.x - A3.x) / Math.PI * 180, this.setArrowInfo(50 * this.size, 30 * this.size), this.dynArrowSize();
    }, A2.prototype.sideCord = function() {
      var A3 = { x: 0, y: 0 };
      A3.x = (this.polygonVertex[4] + this.polygonVertex[8]) / 2, A3.y = (this.polygonVertex[5] + this.polygonVertex[9]) / 2, this.polygonVertex[2] = (this.polygonVertex[4] + A3.x) / 2, this.polygonVertex[3] = (this.polygonVertex[5] + A3.y) / 2, this.polygonVertex[10] = (this.polygonVertex[8] + A3.x) / 2, this.polygonVertex[11] = (this.polygonVertex[9] + A3.y) / 2;
    }, A2.prototype.setArrowInfo = function(A3, e2) {
      this.arrowInfo.edgeLen = A3, this.arrowInfo.angle = e2;
    }, A2.prototype.dynArrowSize = function() {
      var A3 = this.stopPoint.x - this.beginPoint.x, e2 = this.stopPoint.y - this.beginPoint.y, t2 = Math.sqrt(Math.pow(A3, 2) + Math.pow(e2, 2));
      t2 < 50 ? this.arrowInfo.edgeLen = t2 / 2 : t2 < 250 ? this.arrowInfo.edgeLen /= 2 : t2 < 500 && (this.arrowInfo.edgeLen = this.arrowInfo.edgeLen * t2 / 500);
    }, A2.prototype.drawArrow = function(A3, e2) {
      A3.fillStyle = e2, A3.beginPath(), A3.moveTo(this.polygonVertex[0], this.polygonVertex[1]), A3.lineTo(this.polygonVertex[2], this.polygonVertex[3]), A3.lineTo(this.polygonVertex[4], this.polygonVertex[5]), A3.lineTo(this.polygonVertex[6], this.polygonVertex[7]), A3.lineTo(this.polygonVertex[8], this.polygonVertex[9]), A3.lineTo(this.polygonVertex[10], this.polygonVertex[11]), A3.closePath(), A3.fill();
    }, A2;
  }();
  function dr(A2, e2, t2, n2, r2, o2, i2, s2, a2) {
    var l2 = 180 * Math.atan2(t2 - r2, e2 - n2) / Math.PI, c2 = (l2 + o2) * Math.PI / 180, u2 = (l2 - o2) * Math.PI / 180, B2 = i2 * Math.cos(c2), h2 = i2 * Math.sin(c2), g2 = i2 * Math.cos(u2), d2 = i2 * Math.sin(u2);
    A2.save(), A2.beginPath();
    var w2 = e2 - B2, f2 = t2 - h2;
    A2.moveTo(w2, f2), A2.moveTo(e2, t2), A2.lineTo(n2, r2), w2 = n2 + B2, f2 = r2 + h2, A2.moveTo(w2, f2), A2.lineTo(n2, r2), w2 = n2 + g2, f2 = r2 + d2, A2.lineTo(w2, f2), A2.strokeStyle = a2, A2.lineWidth = s2, A2.stroke(), A2.restore();
  }
  var wr = /* @__PURE__ */ new Set(["nwse-resize", "nesw-resize", "ns-resize", "ew-resize", "crosshair"]), fr = new gr(), pr = function(A2, e2) {
    var t2 = A2.x - e2.x, n2 = A2.y - e2.y;
    return Math.sqrt(t2 * t2 + n2 * n2);
  }, Cr = function(A2, e2, t2) {
    return Math.min(Math.max(A2, e2), t2);
  }, Qr = function(A2) {
    return Number.isFinite(A2.x) && Number.isFinite(A2.y);
  }, vr = function(A2) {
    var e2, t2, n2, r2, o2, i2;
    return { start: { x: null !== (e2 = A2.startX) && void 0 !== e2 ? e2 : A2.x, y: null !== (t2 = A2.startY) && void 0 !== t2 ? t2 : A2.y }, end: { x: null !== (r2 = null !== (n2 = A2.endX) && void 0 !== n2 ? n2 : A2.x2) && void 0 !== r2 ? r2 : A2.x + A2.width, y: null !== (i2 = null !== (o2 = A2.endY) && void 0 !== o2 ? o2 : A2.y2) && void 0 !== i2 ? i2 : A2.y + A2.height } };
  }, Ur = function(A2) {
    var e2 = vr(A2), t2 = e2.start, n2 = e2.end, r2 = Math.min(t2.x, n2.x), o2 = Math.min(t2.y, n2.y);
    return { x: r2, y: o2, width: Math.max(t2.x, n2.x) - r2, height: Math.max(t2.y, n2.y) - o2 };
  }, mr = function(e2, t2, n2) {
    var r2 = Ur(A(A({}, e2), { startX: t2.x, startY: t2.y, endX: n2.x, endY: n2.y, x2: n2.x, y2: n2.y }));
    return A(A({}, e2), { startX: t2.x, startY: t2.y, endX: n2.x, endY: n2.y, x: r2.x, y: r2.y, width: r2.width, height: r2.height, x2: n2.x, y2: n2.y });
  }, Fr = function(A2, e2, t2) {
    var n2, r2, o2 = vr(e2), i2 = o2.start, s2 = o2.end, a2 = e2.color, l2 = e2.borderWidth;
    if ("line" === e2.arrowType) {
      var c2 = null !== (n2 = e2.theta) && void 0 !== n2 ? n2 : 30, u2 = null !== (r2 = e2.slashLength) && void 0 !== r2 ? r2 : 10;
      dr(A2, i2.x, i2.y, s2.x, s2.y, c2, u2, l2, a2);
    } else fr.draw(A2, i2.x, i2.y, s2.x, s2.y, a2, l2);
    (null == t2 ? void 0 : t2.drawState) && t2.dotRadius && function(A3, e3, t3, n3) {
      e3.forEach(function(e4) {
        A3.beginPath(), A3.arc(e4.x, e4.y, n3, 0, 2 * Math.PI), A3.fillStyle = "#ffffff", A3.fill(), A3.lineWidth = 1, A3.strokeStyle = t3, A3.stroke();
      });
    }(A2, [i2, s2], a2, t2.dotRadius);
  }, yr = function(A2, e2, t2, n2) {
    void 0 === n2 && (n2 = 8);
    var r2 = vr(t2), o2 = r2.start, i2 = r2.end;
    if (!Qr(o2) || !Qr(i2)) return false;
    var s2 = Math.max(n2, 0), a2 = Math.min(o2.x, i2.x) - s2, l2 = Math.min(o2.y, i2.y) - s2, c2 = Math.max(o2.x, i2.x) + s2, u2 = Math.max(o2.y, i2.y) + s2;
    if (A2 < a2 || A2 > c2 || e2 < l2 || e2 > u2) return false;
    var B2 = pr(o2, i2);
    if (0 === B2) return pr({ x: A2, y: e2 }, o2) <= s2;
    if (Math.abs((i2.x - o2.x) * (o2.y - e2) - (o2.x - A2) * (i2.y - o2.y)) / B2 > s2) return false;
    var h2 = (A2 - o2.x) * (i2.x - o2.x) + (e2 - o2.y) * (i2.y - o2.y);
    return !(h2 < 0) && !(h2 > B2 * B2);
  };
  var Er = function(A2, e2) {
    var t2, n2 = null !== (t2 = A2.points) && void 0 !== t2 ? t2 : [];
    if (0 !== n2.length) {
      e2.save(), e2.beginPath(), e2.lineWidth = A2.size, e2.strokeStyle = A2.color, e2.lineCap = "round", e2.lineJoin = "round";
      var r2 = n2[0], o2 = n2.slice(1);
      e2.moveTo(r2.x, r2.y);
      for (var i2 = 0; i2 < o2.length; i2++) {
        var s2 = o2[i2];
        e2.lineTo(s2.x, s2.y);
      }
      e2.stroke(), e2.restore();
    }
  }, br = function(A2, e2, t2) {
    var n2 = A2.width, r2 = A2.data, o2 = [];
    return o2[0] = r2[4 * (t2 * n2 + e2)], o2[1] = r2[4 * (t2 * n2 + e2) + 1], o2[2] = r2[4 * (t2 * n2 + e2) + 2], o2[3] = r2[4 * (t2 * n2 + e2) + 3], o2;
  }, Ir = function(A2, e2, t2, n2) {
    var r2 = A2.width, o2 = A2.data;
    o2[4 * (t2 * r2 + e2)] = n2[0], o2[4 * (t2 * r2 + e2) + 1] = n2[1], o2[4 * (t2 * r2 + e2) + 2] = n2[2], o2[4 * (t2 * r2 + e2) + 3] = n2[3];
  };
  function Hr(A2, e2, t2, n2, r2) {
    for (var o2 = window.devicePixelRatio || 1, i2 = r2.getImageData(A2 * o2, e2 * o2, t2 * o2, t2 * o2), s2 = i2.width / n2, a2 = i2.height / n2, l2 = 0; l2 < a2; l2++) for (var c2 = 0; c2 < s2; c2++) for (var u2 = br(i2, c2 * n2 + Math.floor(Math.random() * n2), l2 * n2 + Math.floor(Math.random() * n2)), B2 = 0; B2 < n2; B2++) for (var h2 = 0; h2 < n2; h2++) Ir(i2, c2 * n2 + h2, l2 * n2 + B2, u2);
    r2.putImageData(i2, A2 * o2, e2 * o2);
  }
  var Sr = function(A2, e2) {
    for (var t2, n2 = null !== (t2 = A2.points) && void 0 !== t2 ? t2 : [], r2 = 0; r2 < n2.length; r2++) {
      var o2 = n2[r2];
      Hr(o2.x, o2.y, A2.size, A2.degreeOfBlur, e2);
    }
  }, xr = function(A2) {
    return Boolean(A2 && ("custom" === A2.type || (e2 = A2.element, Boolean(e2 && "customType" in e2 && "custom" === e2.customType))));
    var e2;
  }, Kr = function(A2) {
    return Hn.getCustomElementAdapter(A2.toolId, A2.toolName);
  }, Dr = function(A2, e2, t2) {
    var n2 = Kr(A2);
    return (null == n2 ? void 0 : n2.hitTest) ? n2.hitTest(A2, { x: e2, y: t2 }) : sr({ startX: A2.x, startY: A2.y, width: A2.width, height: A2.height }, { mouseX: e2, mouseY: t2 });
  }, Lr = function(A2, e2) {
    var t2, n2 = Kr(A2);
    null == n2 || n2.draw(A2, e2), A2.drawNode && Or(A2, e2, null !== (t2 = A2.dotRadius) && void 0 !== t2 ? t2 : 0);
  }, Or = function(A2, e2, t2) {
    var n2 = Kr(A2);
    (null == n2 ? void 0 : n2.drawActiveBorder) ? n2.drawActiveBorder(A2, e2, t2) : (e2.save(), e2.strokeStyle = "#2CABFF", e2.lineWidth = Math.max(1, t2 > 0 ? t2 / 2 : 1), e2.setLineDash(jn), e2.strokeRect(A2.x, A2.y, A2.width, A2.height), e2.restore());
  }, kr = function(e2, t2, n2) {
    var r2, o2 = Kr(e2), i2 = null === (r2 = null == o2 ? void 0 : o2.move) || void 0 === r2 ? void 0 : r2.call(o2, e2, t2, n2);
    if (i2) return i2;
    var s2 = Math.min(Math.max(n2.startX, e2.x + t2.x), n2.startX + n2.width - e2.width), a2 = Math.min(Math.max(n2.startY, e2.y + t2.y), n2.startY + n2.height - e2.height);
    return A(A({}, e2), { x: s2, y: a2 });
  }, Mr = function(A2, e2, t2, n2) {
    var r2, o2, i2 = Kr(A2);
    return null !== (o2 = null === (r2 = null == i2 ? void 0 : i2.resize) || void 0 === r2 ? void 0 : r2.call(i2, A2, e2, t2, n2)) && void 0 !== o2 ? o2 : A2;
  };
  function Pr() {
    return "undefined" != typeof window && "undefined" != typeof document;
  }
  function Tr() {
    return "undefined" == typeof navigator ? null : navigator;
  }
  var Rr = function() {
    function e2() {
      var A2 = this;
      this.applyInitialState = Cn(this, function() {
        return A2.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return e2.prototype.initialState = function() {
      return { dpr: (void 0 === A2 && (A2 = 1), Pr() && window.devicePixelRatio || A2), getFullScreenStatus: false, selectionBorderNodes: [], captureStream: null, movePosition: { moveStartX: 0, moveStartY: 0 }, history: [], borderOption: null, mouseInsideCropBox: false, tempGraphPosition: { startX: 0, startY: 0, width: 0, height: 0 }, textInputPosition: { mouseX: 0, mouseY: 0 }, drawGraphPrevX: 0, drawGraphPrevY: 0, drawStatus: false, degreeOfBlur: 5, resetAllStore: false, canUndo: true, canvasElements: [], activeElementId: null, rectOperateIndex: null, editingTextElementId: null, pendingEditingTextElement: null };
      var A2;
    }, e2.prototype.updateDpr = function(A2) {
      this.dpr = A2;
    }, e2.prototype.updateFullScreenStatus = function(A2) {
      this.getFullScreenStatus = A2;
    }, e2.prototype.resetCompState = function() {
      this.resetAllStore = true;
    }, e2.prototype.updateCanUndo = function(A2) {
      this.canUndo = A2;
    }, e2.prototype.updateSelectionBorderNodes = function(A2) {
      this.selectionBorderNodes = A2;
    }, e2.prototype.updateCaptureStream = function(A2) {
      this.captureStream = A2;
    }, e2.prototype.updateMovePosition = function(A2, e3) {
      this.movePosition = { moveStartX: A2, moveStartY: e3 };
    }, e2.prototype.updateBorderOption = function(A2) {
      this.borderOption = A2;
    }, e2.prototype.updateMouseInsideCropBox = function(A2) {
      this.mouseInsideCropBox = A2;
    }, e2.prototype.updateTempGraphPosition = function(A2, e3, t2, n2) {
      this.tempGraphPosition = { startX: A2, startY: e3, width: t2, height: n2 };
    }, e2.prototype.updateTextInputPosition = function(A2, e3) {
      this.textInputPosition = { mouseX: A2, mouseY: e3 };
    }, e2.prototype.updateDrawGraphPrevInfo = function(A2, e3) {
      this.drawGraphPrevX = A2, this.drawGraphPrevY = e3;
    }, e2.prototype.updateDrawStatus = function(A2) {
      this.drawStatus = A2;
    }, e2.prototype.shiftHistory = function() {
      return this.history.shift();
    }, e2.prototype.popHistory = function() {
      return this.history.pop();
    }, e2.prototype.undoHistory = function(A2, e3) {
      if (this.popHistory(), A2 && this.history.length > 0) {
        var t2 = this.history[this.history.length - 1];
        A2.putImageData(t2.data, 0, 0), this.replaceCanvasElements(t2.canvasElements);
      }
      this.history.length <= 1 && e3();
    }, e2.prototype.addElement = function(A2) {
      this.canvasElements.push(A2);
    }, e2.prototype.removeElement = function(A2) {
      this.canvasElements = this.canvasElements.filter(function(e3) {
        return e3.id !== A2;
      });
    }, e2.prototype.updateCanvasElement = function(e3) {
      for (var t2, n2, r2 = 0; r2 < this.canvasElements.length; r2++) {
        var o2 = this.canvasElements[r2];
        if (o2.id === e3.id) {
          if ("text" === o2.type && o2.element) {
            var i2 = o2.element, s2 = e3;
            e3 = A(A(A({}, i2), s2), { width: 0 === (null !== (t2 = s2.width) && void 0 !== t2 ? t2 : 0) && i2.width ? i2.width : s2.width, height: 0 === (null !== (n2 = s2.height) && void 0 !== n2 ? n2 : 0) && i2.height ? i2.height : s2.height });
          }
          this.canvasElements[r2] = A(A({}, this.canvasElements[r2]), { element: e3 });
        }
      }
    }, e2.prototype.clearEmptyCanvasElements = function(A2) {
      var e3 = this.canvasElements.filter(function(A3) {
        var e4, t2, n2 = A3.element;
        return null != n2 && ("text" === A3.type || (!("width" in n2) || !("height" in n2) || (0 !== (null !== (e4 = n2.width) && void 0 !== e4 ? e4 : 0) || 0 !== (null !== (t2 = n2.height) && void 0 !== t2 ? t2 : 0))));
      });
      A2(e3.length), this.canvasElements = e3;
    }, e2.prototype.replaceCanvasElements = function(A2) {
      this.canvasElements = A2;
    }, e2.prototype.checkMouseInElement = function(A2, e3, t2) {
      for (var n2, r2 = 0; r2 < this.canvasElements.length; r2++) {
        var o2 = this.canvasElements[r2];
        if (null != o2.element) switch (o2.type) {
          case "square":
            var i2 = o2.element, s2 = i2.x, a2 = i2.y, l2 = i2.width, c2 = i2.height, u2 = i2.borderWidth;
            if (ir(A2, e3, { x: s2, y: a2, width: l2, height: c2 }, u2)) return void t2(o2.id);
            break;
          case "round":
            var B2 = o2.element;
            if (hr(A2, e3, { x: s2 = B2.x, y: a2 = B2.y, width: l2 = B2.width, height: c2 = B2.height }, u2 = B2.borderWidth)) return void t2(o2.id);
            break;
          case "right-top":
            var h2 = o2.element, g2 = Math.max(h2.borderWidth, null !== (n2 = h2.dotRadius) && void 0 !== n2 ? n2 : 0, 8);
            if (yr(A2, e3, h2, g2)) return void t2(o2.id);
            break;
          case "text":
            var d2 = o2.element;
            if (sr({ startX: d2.x, startY: d2.y, width: d2.width, height: d2.height }, { mouseX: A2, mouseY: e3 })) return void t2(o2.id);
            break;
          case "brush":
            var w2 = o2.element;
            if (sr({ startX: w2.x, startY: w2.y, width: Math.max(w2.width, w2.size), height: Math.max(w2.height, w2.size) }, { mouseX: A2, mouseY: e3 })) return void t2(o2.id);
            break;
          case "custom":
            var f2 = o2.element;
            if (Dr(f2, A2, e3)) return void t2(o2.id);
            break;
          default:
            if (xr(o2)) {
              f2 = o2.element;
              if (Dr(f2, A2, e3)) return void t2(o2.id);
            }
        }
      }
      t2(null);
    }, e2.prototype.resetCanvasElementNodeState = function() {
      for (var A2, e3 = 0; e3 < this.canvasElements.length; e3++) {
        var t2 = this.canvasElements[e3];
        (null === (A2 = t2.element) || void 0 === A2 ? void 0 : A2.drawNode) && (t2.element.drawNode = false);
      }
    }, e2.prototype.findTextElementAt = function(A2, e3) {
      for (var t2 = 0; t2 < this.canvasElements.length; t2++) {
        var n2 = this.canvasElements[t2];
        if ("text" === n2.type && null != n2.element) {
          var r2 = n2.element;
          if (sr({ startX: r2.x, startY: r2.y, width: r2.width, height: r2.height }, { mouseX: A2, mouseY: e3 })) return n2;
        }
      }
      return null;
    }, e2.prototype.redrawCanvasElements = function() {
      for (var A2, e3, t2 = 0; t2 < this.canvasElements.length; t2++) {
        var n2 = this.canvasElements[t2];
        switch (n2.type) {
          case "square":
            var r2 = n2.element;
            zn(r2.x, r2.y, r2.width, r2.height, r2.color, r2.borderWidth, Xn.screenShotCanvas, { dotRadius: (null == r2 ? void 0 : r2.dotRadius) || 0, drawState: (null == r2 ? void 0 : r2.drawNode) || false });
            break;
          case "round":
            var o2 = n2.element;
            Br(Xn.screenShotCanvas, { x: o2.x, y: o2.y, width: o2.width, height: o2.height }, o2.borderWidth, o2.color, o2.drawNode ? { drawState: true, dotRadius: o2.dotRadius || 0 } : void 0);
            break;
          case "right-top":
            var i2 = n2.element;
            Fr(Xn.screenShotCanvas, i2, i2.drawNode ? { drawState: true, dotRadius: i2.dotRadius || 0 } : void 0);
            break;
          case "brush":
            var s2 = n2.element, a2 = Xn.screenShotCanvas;
            if (Er(s2, a2), s2.drawNode) {
              var l2 = null !== (A2 = s2.dotRadius) && void 0 !== A2 ? A2 : 0, c2 = l2 > 0 ? { drawState: true, dotRadius: l2 } : void 0;
              zn(s2.x, s2.y, s2.width, s2.height, s2.color, Math.max(1, Math.min(s2.size, 4)), a2, c2, jn);
            }
            break;
          case "mosaicPen":
            var u2 = n2.element, B2 = Xn.screenShotCanvas;
            if (Sr(u2, B2), u2.drawNode) {
              var h2 = null !== (e3 = u2.dotRadius) && void 0 !== e3 ? e3 : 0, g2 = h2 > 0 ? { drawState: true, dotRadius: h2 } : void 0;
              zn(u2.x, u2.y, u2.width, u2.height, u2.color, Math.max(1, Math.min(u2.size, 4)), B2, g2);
            }
            break;
          case "text":
            var d2 = n2.element;
            or(d2, Xn.screenShotCanvas);
            break;
          case "custom":
            Lr(n2.element, Xn.screenShotCanvas);
            break;
          default:
            xr(n2) && Lr(n2.element, Xn.screenShotCanvas);
        }
      }
    }, e2.prototype.getCanvasElement = function(A2) {
      return this.canvasElements.find(function(e3) {
        return e3.id === A2;
      });
    }, e2.prototype.updateActiveElementId = function(A2) {
      this.activeElementId = A2;
    }, e2.prototype.updateRectOperateIndex = function(A2) {
      this.rectOperateIndex = A2;
    }, e2.prototype.updateEditingTextElementId = function(A2) {
      this.editingTextElementId = A2;
    }, e2.prototype.updatePendingEditingTextElement = function(A2) {
      this.pendingEditingTextElement = A2;
    }, e2.prototype.pushHistory = function(A2) {
      this.history.push(A2);
    }, e2.prototype.reset = function() {
      this.applyInitialState();
    }, e2;
  }(), Gr = new Rr(), Vr = Object.freeze({ 1: 16, 2: 56, 3: 90, 4: 128, 5: 174, 6: 210 }), Nr = function() {
    function A2() {
      var A3 = this;
      this.applyInitialState = Cn(this, function() {
        return A3.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return A2.prototype.initialState = function() {
      return { toolController: null, optionIcoController: null, optionController: null, colorSelectPanel: null, brushSelectionController: null, colorSelectController: null, rightPanel: null, undoController: null };
    }, A2.prototype.hydrateDomRefs = function() {
      this.toolController = document.getElementById("toolPanel"), this.optionController = document.getElementById("optionPanel"), this.optionIcoController = document.getElementById("optionIcoController");
    }, A2.prototype.updateToolShowStatus = function(A3) {
      Kn(this.toolController, A3);
    }, A2.prototype.updateToolPosition = function(A3, e2) {
      if (null != this.toolController) {
        var t2 = 0;
        Gn.screenShotController && (t2 = parseInt(Gn.screenShotController.style.top)), Dn(this.toolController, "".concat(e2, "px"), "".concat(A3 + t2, "px"));
      }
    }, A2.prototype.updateToolOptionShowState = function(A3) {
      Kn(this.optionIcoController, A3), Kn(this.optionController, A3);
    }, A2.prototype.updateToolOptIcon = function(A3) {
      Kn(this.optionIcoController, A3);
    }, A2.prototype.updateToolOptionPosition = function(A3, e2, t2, n2, r2) {
      Dn(this.optionIcoController, A3, e2), Dn(this.optionController, t2, n2), null != this.optionIcoController && r2 && (this.optionIcoController.style.transform = r2);
    }, A2.prototype.addColorSelectPanelClassStyle = function(A3) {
      this.ensureColorSelectPanel(), kn(this.colorSelectPanel, A3);
    }, A2.prototype.updateColorSelectPanelColor = function(A3) {
      this.ensureColorSelectPanel(), On(this.colorSelectPanel, A3);
    }, A2.prototype.getBrushSelectionController = function() {
      this.brushSelectionController = document.getElementById("brushSelectPanel");
    }, A2.prototype.updateBrushSelectionShowState = function(A3) {
      Kn(this.brushSelectionController, A3);
    }, A2.prototype.getColorPanel = function() {
      this.colorSelectController = document.getElementById("colorPanel");
    }, A2.prototype.updateColorPanelShowState = function(A3) {
      Kn(this.colorSelectController, A3), "flex" === A3 && this.updateFloatingPanelVerticalPosition(this.colorSelectController, 225);
    }, A2.prototype.updateFloatingPanelVerticalPosition = function(A3, e2) {
      var t2;
      if (null != A3) {
        var n2 = null !== (t2 = this.optionController) && void 0 !== t2 ? t2 : document.getElementById("optionPanel");
        if (null != n2) {
          var r2 = A3.offsetHeight || A3.scrollHeight || e2, o2 = n2.offsetHeight || 40, i2 = n2.getBoundingClientRect().top;
          A3.style.top = i2 >= r2 ? "-".concat(r2, "px") : "".concat(o2, "px");
        }
      }
    }, A2.prototype.getRightPanel = function() {
      this.rightPanel = document.getElementById("rightPanel");
    }, A2.prototype.updateRightPanelShowState = function(A3) {
      Kn(this.rightPanel, A3);
    }, A2.prototype.getUndoController = function() {
      this.undoController = document.getElementById("undoPanel");
    }, A2.prototype.undoFn = function() {
      var A3;
      Gr.undoHistory(null === (A3 = Gn.screenShotController) || void 0 === A3 ? void 0 : A3.getContext("2d"), function() {
        Gr.updateCanUndo(false);
      });
    }, A2.prototype.enableUndoButton = function() {
      Tn(this.undoController, this.undoFn, true);
    }, A2.prototype.disableUndoButton = function() {
      Tn(this.undoController, this.undoFn, false);
    }, A2.prototype.destroyDOM = function() {
      this.removeElement(this.toolController), this.removeElement(this.optionIcoController), this.removeElement(this.optionController), this.removeElement(this.brushSelectionController), this.removeElement(this.colorSelectController), this.removeElement(this.rightPanel), this.removeElement(this.undoController), this.removeElement(this.colorSelectPanel);
    }, A2.prototype.ensureColorSelectPanel = function() {
      null == this.colorSelectPanel && (this.colorSelectPanel = document.getElementById("colorSelectPanel"));
    }, A2.prototype.removeElement = function(A3) {
      var e2;
      null === (e2 = null == A3 ? void 0 : A3.parentElement) || void 0 === e2 || e2.removeChild(A3);
    }, A2.prototype.reset = function() {
      this.applyInitialState();
    }, A2;
  }(), Xr = new Nr();
  var _r = new (function() {
    function A2() {
      var A3 = this;
      this.applyInitialState = Cn(this, function() {
        return A3.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return A2.prototype.initialState = function() {
      return { textSizeContainer: null, optionTextSizeController: null };
    }, A2.prototype.getTextSizeContainer = function() {
      this.textSizeContainer = document.getElementById("textSizePanel");
    }, A2.prototype.getOptionTextSizeController = function() {
      this.optionTextSizeController = document.getElementById("textSelectPanel");
    }, A2.prototype.setTextStatus = function(A3) {
      null != Gn.textInputController && (A3 ? Gn.updateTextInputShowState("block") : Gn.updateTextInputShowState("none"));
    }, A2.prototype.setTextSizeOptionStatus = function(A3) {
      if (this.getOptionTextSizeController(), null != this.optionTextSizeController) return A3 ? (this.optionTextSizeController.style.display = "flex", void Xr.updateFloatingPanelVerticalPosition(this.optionTextSizeController, 321)) : void (this.optionTextSizeController.style.display = "none");
    }, A2.prototype.setTextSizePanelStatus = function(A3) {
      this.getTextSizeContainer(), null != this.textSizeContainer && (this.textSizeContainer.style.display = A3 ? "flex" : "none");
    }, A2.prototype.reset = function() {
      this.applyInitialState();
    }, A2;
  }())(), Yr = function() {
    function A2() {
      var A3 = this;
      this.applyInitialState = Cn(this, function() {
        return A3.initialState();
      }), pt(this, {}, { autoBind: true }), vn(this.reset);
    }
    return A2.prototype.initialState = function() {
      return { toolClickStatus: false, selectedColor: "#F53340", toolName: "", toolId: null, penSize: 2, fontSize: 17, mosaicPenSize: 10, toolVerticalAnchor: "below", activeTool: "", textEditState: false, textInfo: { positionX: 0, positionY: 0, color: "#000000", size: 0 } };
    }, A2.prototype.setToolStatus = function(A3) {
      Xr.updateToolShowStatus(A3 ? "block" : "none");
    }, A2.prototype.setToolInfo = function(A3, e2) {
      if (null != Xr.toolController) {
        var t2 = xn(A3, e2), n2 = t2.left, r2 = t2.top;
        Xr.updateToolPosition(r2, n2);
      }
    }, A2.prototype.getToolPosition = function() {
      if (null != Xr.toolController) return { left: Xr.toolController.offsetLeft, top: Xr.toolController.offsetTop };
    }, A2.prototype.setOptionStatus = function(A3) {
      Xr.updateToolOptionShowState(A3 ? "block" : "none");
    }, A2.prototype.hiddenOptionIcoStatus = function() {
      Xr.updateToolOptIcon("none");
    }, A2.prototype.setOptionPosition = function(A3) {
      var e2, t2, n2, r2 = this.getToolPosition();
      if (null != r2) {
        var o2 = null !== (t2 = null === (e2 = Xr.toolController) || void 0 === e2 ? void 0 : e2.offsetHeight) && void 0 !== t2 ? t2 : 46, i2 = (null === (n2 = Xr.optionController) || void 0 === n2 ? void 0 : n2.offsetHeight) || 40, s2 = "".concat(r2.left + A3, "px"), a2 = "".concat(r2.left, "px"), l2 = r2.top + o2, c2 = l2 + 6, u2 = "rotate(180deg)";
        this.isToolbarAnchoredAbove() && (c2 = (l2 = r2.top - 6) - i2, u2 = "rotate(0deg)"), Xr.updateToolOptionPosition(s2, "".concat(l2, "px"), a2, "".concat(c2, "px"), u2);
      }
    }, A2.prototype.setToolClickStatus = function(A3) {
      this.toolClickStatus = A3;
    }, A2.prototype.setSelectedColor = function(A3) {
      this.selectedColor = A3, Xr.updateColorSelectPanelColor(A3);
    }, A2.prototype.setToolName = function(A3) {
      this.toolName = A3;
    }, A2.prototype.setToolId = function(A3) {
      this.toolId = A3;
    }, A2.prototype.syncOptionLayout = function(A3, e2) {
      null != A3 && (this.setOptionStatus(true), this.setOptionPosition(function(A4) {
        var e3;
        return null !== (e3 = Vr[A4]) && void 0 !== e3 ? e3 : 0;
      }(A3)), "mosaicPen" === e2 ? (this.setRightPanel(false), this.hiddenOptionIcoStatus()) : this.setRightPanel(true));
    }, A2.prototype.syncOptionContent = function(A3) {
      if ("text" === A3) return _r.setTextSizePanelStatus(true), this.setBrushSelectionStatus(false), void Xr.addColorSelectPanelClassStyle("text-select-status");
      _r.setTextSizePanelStatus(false), this.setBrushSelectionStatus(true);
    }, A2.prototype.setPenSize = function(A3) {
      this.penSize = A3;
    }, A2.prototype.setMosaicPenSize = function(A3) {
      this.mosaicPenSize = A3;
    }, A2.prototype.setToolVerticalAnchor = function(A3) {
      this.toolVerticalAnchor = A3;
    }, A2.prototype.resetToolVerticalAnchor = function() {
      this.toolVerticalAnchor = "below";
    }, A2.prototype.isToolbarAnchoredAbove = function() {
      return "above" === this.toolVerticalAnchor;
    }, A2.prototype.setFontSize = function(A3) {
      this.fontSize = A3;
    }, A2.prototype.setActiveToolName = function(A3) {
      this.activeTool = A3;
    }, A2.prototype.setTextInfo = function(A3) {
      this.textInfo = A3;
    }, A2.prototype.setTextEditState = function(A3) {
      this.textEditState = A3;
    }, A2.prototype.setBrushSelectionStatus = function(A3) {
      Xr.getBrushSelectionController(), Xr.updateBrushSelectionShowState(A3 ? "block" : "none");
    }, A2.prototype.setColorPanelStatus = function(A3) {
      Xr.getColorPanel(), Xr.updateColorPanelShowState(A3 ? "flex" : "none");
    }, A2.prototype.setRightPanel = function(A3) {
      Xr.getRightPanel(), Xr.updateRightPanelShowState(A3 ? "flex" : "none");
    }, A2.prototype.setUndoStatus = function(A3) {
      Xr.getUndoController(), A3 ? Xr.enableUndoButton() : Xr.disableUndoButton();
    }, A2.prototype.reset = function() {
      this.applyInitialState();
    }, A2;
  }(), Jr = new Yr();
  function Wr() {
    var A2 = Gn.screenShotController;
    if (null != A2) {
      var e2 = A2.getContext("2d"), t2 = A2;
      Gr.history.length > Hn.maxUndoNum && Gr.shiftHistory(), Gr.pushHistory({ data: e2.getImageData(0, 0, t2.width, t2.height), canvasElements: JSON.parse(JSON.stringify(Gr.canvasElements)) }), Jr.setUndoStatus(true);
    }
  }
  function zr(A2) {
    A2.putImageData(Gr.history[Gr.history.length - 1].data, 0, 0);
  }
  var Zr = [];
  function jr(A2) {
    return Zr.push(A2), A2;
  }
  var qr = [], $r = function() {
    qr.forEach(function(A2) {
      return A2();
    }), qr = [];
  }, Ao = function() {
    return $r(), qr = [We(function() {
      return Gr.resetAllStore;
    }, function(A2) {
      A2 && function(A3) {
        Ae(A3.name, false, A3, this, void 0);
      }(Un);
    }), We(function() {
      return Gr.canUndo;
    }, function(A2) {
      A2 || Jr.setUndoStatus(false);
    })], $r;
  };
  function eo() {
    $r(), function() {
      for (; Zr.length > 0; ) {
        var A2 = Zr.pop();
        try {
          null == A2 || A2();
        } catch (A3) {
          console.error("[domDisposers] cleanup failed", A3);
        }
      }
    }(), Gn.destroyDOM(), Xr.destroyDOM(), Un();
  }
  var to = function(A2) {
    return null == A2 || 0 === A2.trim().length;
  };
  function no() {
    var A2 = { width: parseFloat(window.getComputedStyle(document.body).width), height: parseFloat(window.getComputedStyle(document.body).height) };
    return { maxWidth: Math.max(A2.width || 0, Math.max(document.body.scrollWidth, document.documentElement.scrollWidth), Math.max(document.body.offsetWidth, document.documentElement.offsetWidth), Math.max(document.body.clientWidth, document.documentElement.clientWidth)), maxHeight: Math.max(A2.height || 0, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), Math.max(document.body.offsetHeight, document.documentElement.offsetHeight), Math.max(document.body.clientHeight, document.documentElement.clientHeight)) };
  }
  var ro = function() {
    var A2 = Xn.screenShotCanvas;
    if (null != A2) {
      var e2 = no(), t2 = e2.maxWidth, n2 = e2.maxHeight;
      A2.clearRect(0, 0, t2, n2);
      var r2 = Gn.screenShotController, o2 = Xn.imageController;
      if (null != r2 && null != o2) {
        var i2 = Nn.cutOutBoxPosition;
        Jn(i2.startX, i2.startY, i2.width, i2.height, A2, Nn.borderSize, r2, o2, false);
      }
    }
  }, oo = function(A2) {
    var e2 = Gr.editingTextElementId;
    null != e2 && (Gr.removeElement(e2), ro(), Gr.redrawCanvasElements(), (null == A2 ? void 0 : A2.retainEditingId) || (Gr.updateEditingTextElementId(null), Gr.updatePendingEditingTextElement(null)));
  }, io = function() {
    var A2 = Gr.pendingEditingTextElement;
    if (null != A2) {
      var e2 = { id: A2.id, type: "text", element: A2 };
      Gr.addElement(e2), ro(), Gr.redrawCanvasElements(), Gr.updatePendingEditingTextElement(null), Gr.updateEditingTextElementId(null);
    }
  };
  let so = (A2 = 21) => crypto.getRandomValues(new Uint8Array(A2)).reduce((A3, e2) => A3 += (e2 &= 63) < 36 ? e2.toString(36) : e2 < 62 ? (e2 - 26).toString(36).toUpperCase() : e2 > 62 ? "-" : "_", "");
  var ao, lo, co, uo = function(A2) {
    var e2 = A2.text, t2 = A2.mouseX, n2 = A2.mouseY, r2 = A2.color, o2 = A2.fontSize, i2 = A2.context, s2 = A2.borderWidth, a2 = void 0 === s2 ? 1 : s2, l2 = function(A3) {
      return Number.isFinite(A3) && A3 > 0 ? A3 : 12;
    }(o2), c2 = Ar(e2, l2, i2), u2 = Math.max(c2.width, 0.6 * l2), B2 = n2 - c2.lineHeight / 2;
    return { id: so(), x: t2, y: B2, width: u2, height: c2.height, color: r2, fontSize: l2, text: e2, borderWidth: a2 };
  }, Bo = function(A2) {
    var e2 = uo(A2), t2 = { id: e2.id, type: "text", element: e2 };
    return Gr.addElement(t2), Gr.updateActiveElementId(e2.id), t2;
  }, ho = function(A2, e2, t2, n2) {
    if (null != A2) {
      var r2 = Gr.getCanvasElement(A2);
      switch (null == r2 ? void 0 : r2.type) {
        case "square":
          if (null == (null == r2 ? void 0 : r2.element)) break;
          var o2 = r2.element, i2 = function(A3, e3, t3, n3, r3, o3, i3) {
            for (var s3 = Wn(t3, n3, r3, o3), a3 = 0; a3 < s3.length; a3++) {
              var l3 = s3[a3];
              if (Math.sqrt(Math.pow(A3 - l3.x, 2) + Math.pow(e3 - l3.y, 2)) <= i3) return a3;
            }
            return null;
          }(e2, t2, o2.x, o2.y, o2.width, o2.height, n2);
          if (null != i2 && Gr.activeElementId == A2) {
            Gr.updateRectOperateIndex(i2);
            var s2 = function(A3) {
              var e3 = null;
              switch (A3) {
                case 0:
                case 2:
                  e3 = "nwse-resize";
                  break;
                case 1:
                case 3:
                  e3 = "nesw-resize";
                  break;
                case 4:
                case 6:
                  e3 = "ns-resize";
                  break;
                case 5:
                case 7:
                  e3 = "ew-resize";
              }
              return e3;
            }(i2);
            return void (null != s2 && Gn.setCursorStyle(s2));
          }
          break;
        case "round":
          if (null == (null == r2 ? void 0 : r2.element)) break;
          var a2 = r2.element, l2 = function(A3, e3, t3, n3) {
            for (var r3 = ar(t3), o3 = lr(r3), i3 = 0; i3 < o3.length; i3++) {
              var s3 = o3[i3];
              if (Math.sqrt(Math.pow(A3 - s3.x, 2) + Math.pow(e3 - s3.y, 2)) <= n3) return i3;
            }
            return null;
          }(e2, t2, { x: a2.x, y: a2.y, width: a2.width, height: a2.height }, n2);
          if (null != l2 && Gr.activeElementId == A2) {
            Gr.updateRectOperateIndex(l2);
            var c2 = function(A3) {
              switch (A3) {
                case 0:
                case 2:
                  return "ns-resize";
                case 1:
                case 3:
                  return "ew-resize";
                default:
                  return null;
              }
            }(l2);
            return void (null != c2 && Gn.setCursorStyle(c2));
          }
          break;
        case "right-top":
          if (null == (null == r2 ? void 0 : r2.element)) break;
          var u2 = r2.element, B2 = function(A3, e3, t3, n3) {
            var r3 = vr(t3), o3 = r3.start, i3 = r3.end, s3 = Math.max(n3, 8);
            return pr({ x: A3, y: e3 }, o3) <= s3 ? 0 : pr({ x: A3, y: e3 }, i3) <= s3 ? 1 : null;
          }(e2, t2, u2, n2);
          if (null != B2 && Gr.activeElementId == A2) return Gr.updateRectOperateIndex(B2), void Gn.setCursorStyle("crosshair");
          var h2 = Math.max(u2.borderWidth, n2, 8);
          if (yr(e2, t2, u2, h2)) return Gn.setCursorStyle("move"), void Gr.updateActiveElementId(A2);
          break;
        case "text":
          if (null == (null == r2 ? void 0 : r2.element)) break;
          var g2 = r2.element;
          if (sr({ startX: g2.x, startY: g2.y, width: g2.width, height: g2.height }, { mouseX: e2, mouseY: t2 })) return Gn.setCursorStyle("move"), void Gr.updateActiveElementId(r2.id);
          break;
        case "custom":
          if (null == (null == r2 ? void 0 : r2.element)) break;
          var d2 = r2.element;
          if (Dr(d2, e2, t2)) return Gn.setCursorStyle("move"), void Gr.updateActiveElementId(r2.id);
          break;
        default:
          if (xr(r2)) {
            var w2 = r2.element;
            if (Dr(w2, e2, t2)) return Gn.setCursorStyle("move"), void Gr.updateActiveElementId(r2.id);
          }
      }
      return Gn.setCursorStyle("move"), void Gr.updateActiveElementId(A2);
    }
    Gn.setCursorStyle("default"), Gr.updateActiveElementId(null), Gr.updateRectOperateIndex(null);
  }, go = function(A2, e2, t2) {
    var n2, r2 = { x: 0, y: 0 }, o2 = Gr.getCanvasElement(null != t2 ? t2 : "");
    if (o2 && null != o2.element) switch (o2.type) {
      case "square":
        var i2 = o2.element, s2 = i2.x, a2 = i2.y, l2 = i2.width, c2 = i2.height, u2 = i2.borderWidth;
        ir(Nn.drawGraphPosition.startX, Nn.drawGraphPosition.startY, { x: s2, y: a2, width: l2, height: c2 }, u2) && (r2 = { x: A2 - s2, y: e2 - a2 });
        break;
      case "round":
        var B2 = o2.element, h2 = B2.x, g2 = B2.y, d2 = B2.width, w2 = B2.height, f2 = ar({ x: h2, y: g2, width: d2, height: w2 });
        (function(A3, e3, t3) {
          var n3 = ar(t3), r3 = n3.width / 2, o3 = n3.height / 2;
          if (r3 <= 0 || o3 <= 0) return false;
          var i3 = A3 - (n3.x + r3), s3 = e3 - (n3.y + o3);
          return i3 * i3 / (r3 * r3) + s3 * s3 / (o3 * o3) <= 1;
        })(A2, e2, f2) && (r2 = { x: A2 - f2.x, y: e2 - f2.y });
        break;
      case "right-top":
        var p2 = o2.element, C2 = Math.max(p2.borderWidth, null !== (n2 = p2.dotRadius) && void 0 !== n2 ? n2 : 0, 8);
        if (yr(A2, e2, p2, C2)) {
          var Q2 = Ur(p2);
          r2 = { x: A2 - Q2.x, y: e2 - Q2.y };
        }
        break;
      case "text":
        var v2 = o2.element;
        sr({ startX: v2.x, startY: v2.y, width: v2.width, height: v2.height }, { mouseX: A2, mouseY: e2 }) && (r2 = { x: A2 - v2.x, y: e2 - v2.y });
        break;
      case "brush":
        var U2 = o2.element;
        sr({ startX: U2.x, startY: U2.y, width: Math.max(U2.width, U2.size), height: Math.max(U2.height, U2.size) }, { mouseX: A2, mouseY: e2 }) && (r2 = { x: A2 - U2.x, y: e2 - U2.y });
        break;
      case "custom":
        var m2 = o2.element;
        Dr(m2, A2, e2) && (r2 = { x: A2 - m2.x, y: e2 - m2.y });
        break;
      default:
        if (xr(o2)) {
          var F2 = o2.element;
          Dr(F2, A2, e2) && (r2 = { x: A2 - F2.x, y: e2 - F2.y });
        }
    }
    return r2;
  };
  function wo(A2) {
    return A2 > 0 ? A2 : 0;
  }
  function fo(A2, e2, t2) {
    return wo(A2) + e2 > t2 ? wo(t2 - e2) : wo(A2);
  }
  !function(A2) {
    A2[A2.Move = 1] = "Move", A2[A2.North = 2] = "North", A2[A2.South = 3] = "South", A2[A2.West = 4] = "West", A2[A2.East = 5] = "East", A2[A2.NorthWest = 6] = "NorthWest", A2[A2.SouthEast = 7] = "SouthEast", A2[A2.NorthEast = 8] = "NorthEast", A2[A2.SouthWest = 9] = "SouthWest";
  }(lo || (lo = {})), function(A2) {
    A2[A2.Move = 1] = "Move", A2[A2.VerticalResize = 2] = "VerticalResize", A2[A2.HorizontalResize = 3] = "HorizontalResize", A2[A2.DiagonalResizeA = 4] = "DiagonalResizeA", A2[A2.DiagonalResizeB = 5] = "DiagonalResizeB";
  }(co || (co = {}));
  var po = ((ao = {})[co.Move] = "move", ao[co.VerticalResize] = "ns-resize", ao[co.HorizontalResize] = "ew-resize", ao[co.DiagonalResizeA] = "nwse-resize", ao[co.DiagonalResizeB] = "nesw-resize", ao);
  function Co(A2, e2, t2, n2, r2, o2, i2) {
    switch (i2) {
      case lo.North:
        return { tempStartX: t2, tempStartY: e2 - (n2 + o2) > 0 ? n2 + o2 : e2, tempWidth: r2, tempHeight: wo(o2 - (e2 - n2)) };
      case lo.South:
        return { tempStartX: t2, tempStartY: n2, tempWidth: r2, tempHeight: wo(e2 - n2) };
      case lo.West:
        return { tempStartX: A2 - (t2 + r2) > 0 ? t2 + r2 : A2, tempStartY: n2, tempWidth: wo(r2 - (A2 - t2)), tempHeight: o2 };
      case lo.East:
        return { tempStartX: t2, tempStartY: n2, tempWidth: wo(A2 - t2), tempHeight: o2 };
      case lo.NorthWest:
        return { tempStartX: A2 - (t2 + r2) > 0 ? t2 + r2 : A2, tempStartY: e2 - (n2 + o2) > 0 ? n2 + o2 : e2, tempWidth: wo(r2 - (A2 - t2)), tempHeight: wo(o2 - (e2 - n2)) };
      case lo.SouthEast:
        return { tempStartX: t2, tempStartY: n2, tempWidth: wo(A2 - t2), tempHeight: wo(e2 - n2) };
      case lo.NorthEast:
        return { tempStartX: t2, tempStartY: e2 - (n2 + o2) > 0 ? n2 + o2 : e2, tempWidth: wo(A2 - t2), tempHeight: wo(o2 - (e2 - n2)) };
      case lo.SouthWest:
        return { tempStartX: A2 - (t2 + r2) > 0 ? t2 + r2 : A2, tempStartY: n2, tempWidth: wo(r2 - (A2 - t2)), tempHeight: wo(e2 - n2) };
    }
  }
  var Qo = function(A2) {
    var e2, t2, n2 = null !== (e2 = null != A2 ? A2 : Gr.activeElementId) && void 0 !== e2 ? e2 : null;
    return null == n2 ? null : null !== (t2 = Gr.canvasElements.find(function(A3) {
      return A3.id === n2;
    })) && void 0 !== t2 ? t2 : null;
  }, vo = function(e2, t2, n2) {
    var r2;
    if (sr(Gr.tempGraphPosition, { mouseX: e2, mouseY: t2 })) {
      var o2 = Qo(n2);
      if (null != o2 && null != Xn.screenShotCanvas) {
        switch (Gr.updateDrawStatus(true), o2.type) {
          case "square":
            if (null == Gr.rectOperateIndex) return;
            var i2 = function(A2) {
              var e3 = null;
              switch (A2) {
                case 0:
                  e3 = 6;
                  break;
                case 1:
                  e3 = 8;
                  break;
                case 2:
                  e3 = 7;
                  break;
                case 3:
                  e3 = 9;
                  break;
                case 4:
                  e3 = 2;
                  break;
                case 5:
                  e3 = 5;
                  break;
                case 6:
                  e3 = 3;
                  break;
                case 7:
                  e3 = 4;
              }
              return e3;
            }(Gr.rectOperateIndex);
            if (null == i2) return;
            var s2 = o2.element;
            if (null == s2) return;
            var a2 = Co(e2, t2, s2.x, s2.y, s2.width, s2.height, i2);
            Gr.updateCanvasElement({ id: o2.id, x: a2.tempStartX, y: a2.tempStartY, width: a2.tempWidth, height: a2.tempHeight, color: Jr.selectedColor || s2.color, borderWidth: Jr.penSize || s2.borderWidth });
            break;
          case "round":
            if (null == Gr.rectOperateIndex) return;
            var l2 = o2.element;
            if (null == l2) return;
            var c2 = function(A2, e3, t3, n3, r3, o3, i3) {
              var s3 = ar({ x: A2, y: e3, width: t3, height: n3 }), a3 = s3.x, l3 = s3.y, c3 = s3.width, u3 = s3.height;
              switch (r3) {
                case 0:
                  u3 = s3.y + s3.height - i3, l3 = i3;
                  break;
                case 1:
                  c3 = o3 - s3.x;
                  break;
                case 2:
                  u3 = i3 - s3.y;
                  break;
                case 3:
                  c3 = s3.x + s3.width - o3, a3 = o3;
              }
              return c3 < 0 && (a3 += c3, c3 = Math.abs(c3)), u3 < 0 && (l3 += u3, u3 = Math.abs(u3)), { x: a3, y: l3, width: c3, height: u3 };
            }(l2.x, l2.y, l2.width, l2.height, Gr.rectOperateIndex, e2, t2);
            Gr.updateCanvasElement({ id: o2.id, x: c2.x, y: c2.y, width: c2.width, height: c2.height, color: Jr.selectedColor || l2.color, borderWidth: Jr.penSize || l2.borderWidth, drawNode: l2.drawNode, dotRadius: null !== (r2 = l2.dotRadius) && void 0 !== r2 ? r2 : 2 * Jr.penSize });
            break;
          case "right-top":
            if (null == Gr.rectOperateIndex) return;
            var u2 = o2.element;
            if (null == u2) return;
            Gr.updateCanvasElement(function(e3, t3, n3, r3, o3) {
              var i3 = vr(e3), s3 = i3.start, a3 = i3.end, l3 = A({}, s3), c3 = A({}, a3);
              if (0 === t3 ? (l3.x = n3, l3.y = r3) : 1 === t3 && (c3.x = n3, c3.y = r3), o3) {
                var u3 = o3.startX, B3 = o3.startY, h2 = o3.startX + o3.width, g2 = o3.startY + o3.height, d2 = function(A2) {
                  A2.x = Cr(A2.x, u3, h2), A2.y = Cr(A2.y, B3, g2);
                };
                d2(l3), d2(c3);
              }
              return mr(e3, l3, c3);
            }(u2, Gr.rectOperateIndex, e2, t2, Gr.tempGraphPosition));
            break;
          case "custom":
            if (null == Gr.rectOperateIndex) return;
            var B2 = o2.element;
            if (null == B2) return;
            Gr.updateCanvasElement(Mr(B2, Gr.rectOperateIndex, { x: e2, y: t2 }, Gr.tempGraphPosition));
            break;
          default:
            if (xr(o2)) {
              if (null == Gr.rectOperateIndex) return;
              Gr.updateCanvasElement(Mr(o2.element, Gr.rectOperateIndex, { x: e2, y: t2 }, Gr.tempGraphPosition));
            }
        }
        ro(), Gr.redrawCanvasElements();
      }
    }
  }, Uo = function(e2, t2, n2, r2) {
    var o2, i2 = Qo(r2);
    if (null != i2) {
      switch (Gr.updateDrawStatus(true), ro(), i2.type) {
        case "square":
          if (null == (h2 = i2.element)) break;
          var s2 = mo(h2, { x: e2, y: t2 }, Gr.tempGraphPosition, n2);
          Gr.updateCanvasElement({ id: i2.id, x: s2.mouseX, y: s2.mouseY, width: s2.width, height: s2.height, color: Jr.selectedColor || h2.color, borderWidth: Jr.penSize || h2.borderWidth });
          break;
        case "round":
          if (null == (h2 = i2.element)) break;
          var a2 = Fo(h2, { x: e2, y: t2 }, Gr.tempGraphPosition, n2);
          Gr.updateCanvasElement({ id: i2.id, x: a2.mouseX, y: a2.mouseY, width: a2.width, height: a2.height, color: Jr.selectedColor || h2.color, borderWidth: Jr.penSize || h2.borderWidth });
          break;
        case "right-top":
          var l2 = i2.element;
          if (null == l2) break;
          var c2 = Ur(l2), u2 = e2 - n2.x, B2 = t2 - n2.y;
          Gr.updateCanvasElement(function(A2, e3, t3, n3) {
            var r3 = vr(A2), o3 = r3.start, i3 = r3.end, s3 = Ur(A2), a3 = s3.x, l3 = s3.y, c3 = s3.x + s3.width, u3 = s3.y + s3.height, B3 = n3.startX, h3 = n3.startY, g3 = n3.startX + n3.width, d3 = h3 - l3, w3 = n3.startY + n3.height - u3, f3 = Cr(e3, B3 - a3, g3 - c3), p3 = Cr(t3, d3, w3), C3 = { x: o3.x + f3, y: o3.y + p3 }, Q2 = { x: i3.x + f3, y: i3.y + p3 };
            return mr(A2, C3, Q2);
          }(l2, u2 - c2.x, B2 - c2.y, Gr.tempGraphPosition));
          break;
        case "text":
          var h2;
          if (null == (h2 = i2.element)) break;
          s2 = mo(h2, { x: e2, y: t2 }, Gr.tempGraphPosition, n2);
          Gr.updateCanvasElement(A(A({}, h2), { id: i2.id, x: s2.mouseX, y: s2.mouseY, color: Jr.selectedColor || h2.color })), Gn.setCursorStyle("move");
          break;
        case "brush":
          var g2 = i2.element;
          if (null == g2) break;
          var d2 = null !== (o2 = g2.points) && void 0 !== o2 ? o2 : [], w2 = (s2 = mo({ x: g2.x, y: g2.y, width: g2.width, height: g2.height }, { x: e2, y: t2 }, Gr.tempGraphPosition, n2)).mouseX - g2.x, f2 = s2.mouseY - g2.y;
          Gr.updateCanvasElement(A(A({}, g2), { id: i2.id, x: s2.mouseX, y: s2.mouseY, points: d2.map(function(A2) {
            return { x: A2.x + w2, y: A2.y + f2 };
          }) })), Gn.setCursorStyle("move");
          break;
        case "custom":
          if (null == (C2 = i2.element)) break;
          var p2 = { x: e2 - n2.x - C2.x, y: t2 - n2.y - C2.y };
          Gr.updateCanvasElement(kr(C2, p2, Gr.tempGraphPosition)), Gn.setCursorStyle("move");
          break;
        default:
          if (xr(i2)) {
            var C2 = i2.element;
            p2 = { x: e2 - n2.x - C2.x, y: t2 - n2.y - C2.y };
            Gr.updateCanvasElement(kr(C2, p2, Gr.tempGraphPosition)), Gn.setCursorStyle("move");
          }
      }
      Gr.redrawCanvasElements();
    }
  }, mo = function(e2, t2, n2, r2) {
    var o2 = t2.x - r2.x, i2 = t2.y - r2.y;
    return o2 = Math.max(n2.startX, o2), o2 = Math.min(n2.startX + n2.width - e2.width, o2), i2 = Math.max(n2.startY, i2), i2 = Math.min(n2.startY + n2.height - e2.height, i2), A(A({}, e2), { mouseX: o2, mouseY: i2 });
  }, Fo = function(e2, t2, n2, r2) {
    var o2 = e2.width, i2 = e2.height, s2 = t2.x - r2.x, a2 = t2.y - r2.y;
    return s2 = Math.max(n2.startX, s2), s2 = Math.min(n2.startX + n2.width - o2, s2), a2 = Math.max(n2.startY, a2), a2 = Math.min(n2.startY + n2.height - i2, a2), A(A({}, e2), { mouseX: s2, mouseY: a2, centerX: s2 + o2 / 2, centerY: a2 + i2 / 2 });
  }, yo = [{ id: 1, title: "square" }, { id: 2, title: "round" }, { id: 3, title: "right-top" }, { id: 4, title: "brush" }, { id: 5, title: "mosaicPen" }, { id: 6, title: "text" }, { id: 7, title: "separateLine" }, { id: 8, title: "save" }, { id: 9, title: "undo" }, { id: 10, title: "close" }, { id: 11, title: "confirm" }], Eo = function(A2) {
    var e2, t2, n2, r2;
    if (null != A2) {
      var o2 = xr(A2), s2 = o2 ? A2.element : null, a2 = null !== (e2 = null == s2 ? void 0 : s2.toolName) && void 0 !== e2 ? e2 : A2.type, l2 = null !== (r2 = null !== (t2 = null == s2 ? void 0 : s2.toolId) && void 0 !== t2 ? t2 : null === (n2 = yo.find(function(e3) {
        return e3.title === A2.type;
      })) || void 0 === n2 ? void 0 : n2.id) && void 0 !== r2 ? r2 : null;
      Jr.setToolClickStatus(true), Jr.setToolName(a2), Jr.setActiveToolName(a2), Jr.setToolId(l2), o2 ? (Jr.setOptionStatus(false), Jr.hiddenOptionIcoStatus(), Jr.setBrushSelectionStatus(false), Jr.setColorPanelStatus(false), Jr.setRightPanel(false), _r.setTextSizePanelStatus(false), _r.setTextSizeOptionStatus(false)) : (Jr.syncOptionContent(a2), Jr.syncOptionLayout(l2, a2)), i(Xr.toolController, l2), function() {
        io();
        var A3 = Gn.textInputController;
        null != A3 && (A3.innerHTML = ""), _r.setTextStatus(false), Gr.updateTextInputPosition(0, 0), Gr.updateEditingTextElementId(null), Gr.updatePendingEditingTextElement(null);
      }();
    }
  }, bo = function() {
    var A2 = Gr.activeElementId, e2 = Gr.canvasElements.some(function(A3) {
      var e3;
      return Boolean(null === (e3 = A3.element) || void 0 === e3 ? void 0 : e3.drawNode);
    });
    return !(null == A2 && !e2) && (Gr.updateActiveElementId(null), Gr.updateRectOperateIndex(null), e2 && (Gr.resetCanvasElementNodeState(), ro(), Gr.redrawCanvasElements()), true);
  }, Io = function(e2, t2) {
    var n2 = Gr.getCanvasElement(e2);
    if (null == (null == n2 ? void 0 : n2.element)) return false;
    switch (Eo(n2), Gr.updateActiveElementId(n2.id), Gr.updateRectOperateIndex(null), Gn.setCursorStyle("move"), Gr.resetCanvasElementNodeState(), n2.type) {
      case "square":
        var r2 = n2.element;
        Gr.updateCanvasElement(A(A({}, r2), { id: n2.id, drawNode: true, dotRadius: t2 }));
        break;
      case "round":
        var o2 = n2.element, i2 = ar({ x: o2.x, y: o2.y, width: o2.width, height: o2.height });
        Gr.updateCanvasElement(A(A({}, o2), { id: n2.id, x: i2.x, y: i2.y, width: i2.width, height: i2.height, drawNode: true, dotRadius: t2 }));
        break;
      case "right-top":
        var s2 = n2.element;
        Gr.updateCanvasElement(function(e3, t3, n3) {
          return A(A({}, e3), { drawNode: t3, dotRadius: n3 });
        }(s2, true, t2));
        break;
      case "text":
        var a2 = n2.element;
        Gr.updateCanvasElement(A(A({}, a2), { id: n2.id, drawNode: true, dotRadius: 0 }));
        break;
      case "brush":
        var l2 = n2.element;
        Gr.updateCanvasElement(A(A({}, l2), { id: n2.id, drawNode: true, dotRadius: 0 }));
        break;
      case "custom":
        var c2 = n2.element;
        Gr.updateCanvasElement(A(A({}, c2), { id: n2.id, drawNode: true, dotRadius: t2 }));
        break;
      default:
        if (!xr(n2)) return false;
        Gr.updateCanvasElement(A(A({}, n2.element), { id: n2.id, drawNode: true, dotRadius: t2 }));
    }
    return ro(), Gr.redrawCanvasElements(), true;
  }, Ho = { cropBoxStore: Nn, toolBarStore: Jr, textInputStore: _r, screenDomStore: Gn, toolPanelDomStore: Xr, screenShotCanvasStore: Xn, userParamStore: Hn, drawingDataStore: Gr, destroyDom: eo }, So = function() {
    return Ho;
  };
  function xo() {
    var A2 = So(), e2 = A2.screenDomStore, t2 = A2.screenShotCanvasStore, n2 = e2.screenShotController, r2 = t2.imageController;
    if (null == n2 || null == r2) return null;
    var o2 = n2.getContext("2d");
    return { screenShotController: n2, ScreenShotImageController: r2, screenShotCanvas: o2 };
  }
  function Ko(A2, e2) {
    var t2 = So(), n2 = t2.screenDomStore, r2 = t2.toolBarStore, o2 = t2.textInputStore, i2 = n2.textInputController;
    if (null != i2 && "text" !== A2) {
      var s2 = i2.innerText;
      if (!to(s2)) {
        var a2 = r2.textInfo, l2 = a2.positionX, c2 = a2.positionY, u2 = a2.color, B2 = a2.size;
        oo(), rr(s2, l2, c2, u2, B2, e2), Bo({ text: s2, mouseX: l2, mouseY: c2, color: u2, fontSize: B2, context: e2 }), Wr();
      } else {
        var h2 = null != Gr.editingTextElementId;
        oo(), h2 && Wr();
      }
      i2.innerHTML = "", o2.setTextStatus(false), Gr.updateEditingTextElementId(null), Gr.updatePendingEditingTextElement(null);
    }
  }
  function Do(A2, e2, t2) {
    var n2 = So(), r2 = n2.toolBarStore, o2 = n2.cropBoxStore;
    r2.setToolStatus(true);
    var i2 = o2.cutOutBoxPosition;
    Jn(i2.startX, i2.startY, i2.width, i2.height, A2, o2.borderSize, e2, t2, false);
  }
  function Lo(A2, e2, t2, n2, r2) {
    var i2 = So(), s2 = i2.toolBarStore, a2 = i2.screenDomStore, l2 = i2.cropBoxStore, c2 = i2.userParamStore, u2 = i2.drawingDataStore, B2 = i2.destroyDom;
    s2.setActiveToolName(A2), s2.setToolId(e2);
    var h2 = xo();
    if (null != h2) {
      var g2 = h2.screenShotController, d2 = h2.ScreenShotImageController, w2 = h2.screenShotCanvas;
      s2.toolClickStatus || Do(w2, g2, d2), s2.setToolClickStatus(true), s2.setToolName(A2), o(t2, e2, false), s2.syncOptionContent(A2), s2.syncOptionLayout(e2, A2), Ko(A2, w2), l2.setDragging(false), l2.setDraggingTrim(false), function(A3, e3) {
        var t3, n3;
        switch (A3) {
          case "save":
            var r3 = _n(true), o2 = e3.userParamStore.saveCallback;
            return o2 && o2(0, "保存成功", r3), void e3.destroyDom();
          case "close":
            return e3.closeCallback && e3.closeCallback(), void e3.destroyDom();
          case "confirm":
            bo();
            r3 = _n(false);
            return null === (t3 = e3.completeCallback) || void 0 === t3 || t3.call(e3, { base64: r3, cutInfo: e3.cropBoxStore.cutOutBoxPosition }), e3.userParamStore.destroyContainer ? void e3.destroyDom() : (e3.toolBarStore.setToolStatus(false), void e3.toolBarStore.setOptionStatus(false));
          case "undo":
            return e3.toolBarStore.setOptionStatus(false), void e3.drawingDataStore.undoHistory(null === (n3 = e3.screenDomStore.screenShotController) || void 0 === n3 ? void 0 : n3.getContext("2d"), function() {
              e3.toolBarStore.setUndoStatus(false);
            });
        }
      }(A2, { completeCallback: n2, closeCallback: r2, cropBoxStore: l2, destroyDom: B2, drawingDataStore: u2, screenDomStore: a2, toolBarStore: s2, userParamStore: c2 });
    }
  }
  var Oo = { small: 2, medium: 5, big: 10 }, ko = { small: 10, medium: 20, big: 40 };
  function Mo() {
    Jr.setColorPanelStatus(true);
  }
  var Po = function(A2) {
    var e2 = JSON.stringify(A2);
    return new Blob([e2]).size;
  }, To = function(A2, e2) {
    var t2 = indexedDB.open("js-screen-shot-db", 1);
    t2.onupgradeneeded = function(A3) {
      var e3 = A3.target.result;
      e3.objectStoreNames.contains("dataStore") || e3.createObjectStore("dataStore");
    }, t2.onsuccess = function(t3) {
      t3.target.result.transaction(["dataStore"], "readwrite").objectStore("dataStore").put(A2, e2);
    }, t2.onerror = function(A3) {
      console.error("Error opening IndexedDB:", A3.target.error);
    };
  }, Ro = { screenShot: "screenShotContainer", tool: "toolPanel", optionIco: "optionIcoController", option: "optionPanel", cutBoxSize: "cutBoxSizePanel", textInput: "textInputPanel" };
  function Go(A2) {
    Object.values(Ro).forEach(function(A3) {
      var e2;
      null === (e2 = document.getElementById(A3)) || void 0 === e2 || e2.remove();
    }), [A2.screenShot, A2.tool, A2.optionIco, A2.option, A2.cutBoxSize, A2.textInput].forEach(function(A3) {
      return document.body.appendChild(A3);
    });
  }
  var Vo = Object.freeze([12, 13, 14, 15, 16, 17, 20, 24, 36, 48, 64, 72, 96]), No = [{ size: "small", index: 1, baseClass: "brush-small", activeClass: "brush-small-active" }, { size: "medium", index: 2, baseClass: "brush-medium" }, { size: "big", index: 3, baseClass: "brush-big" }], Xo = 2, _o = "24px", Yo = "item-panel", Jo = "undo-disabled", Wo = "undoPanel", zo = "undo", Zo = "textSizePanel", jo = "textSelectPanel", qo = "brushSelectPanel", $o = "colorSelectPanel", Ai = "colorPanel", ei = "rightPanel", ti = "text-size-panel", ni = "text-select-panel", ri = "text-item", oi = "brush-select-panel", ii = "color-select-panel", si = "color-panel", ai = "color-item", li = "pull-down-arrow", ci = "right-panel", ui = ["#".concat($o), "#".concat(Zo), "#".concat(jo), "#".concat(Ai)], Bi = ".".concat(Yo), hi = ".".concat(ri), gi = ".".concat(ai), di = function() {
    function A2(A3) {
      var e2, t2, r2, i2, s2, a2, l2, c2 = this;
      if (this.toolbarItemMap = /* @__PURE__ */ new Map(), this.toolbarEventsBound = false, this.handleToolbarClick = function(A4) {
        var e3 = A4.target.closest(Bi);
        if (e3 && c2.toolController.contains(e3) && e3.dataset.title !== zo) {
          var t3 = Number(e3.dataset.id);
          if (!Number.isNaN(t3)) {
            var n2 = c2.toolbarItemMap.get(t3);
            n2 && (t3 <= 100 ? Lo(n2.title, n2.id, A4, c2.completeCallback, c2.closeCallback) : function(A5, e4, t4, n3, r3) {
              var i3 = So(), s3 = i3.toolBarStore, a3 = i3.cropBoxStore;
              s3.setActiveToolName(e4), s3.setToolId(A5), r3.target.style.backgroundImage = "url(".concat(t4, ")");
              var l3 = xo();
              if (null != l3) {
                var c3 = l3.screenShotController, u3 = l3.ScreenShotImageController, B3 = l3.screenShotCanvas;
                s3.toolClickStatus || Do(B3, c3, u3), n3({ screenShotCanvas: B3, screenShotController: c3, ScreenShotImageController: u3, currentInfo: { toolName: e4, toolId: A5 }, imgInfo: { base64: _n(false), cutInfo: a3.cutOutBoxPosition } }), s3.setToolClickStatus(true), s3.setToolName(e4), o(r3, Number.MAX_VALUE, false), s3.setOptionStatus(false), Ko(e4, B3), a3.setDragging(false), a3.setDraggingTrim(false);
              }
            }(n2.id, n2.title, n2.activeIcon, n2.clickFn, A4));
          }
        }
      }, this.handleToolbarPointerOver = function(A4) {
        var e3 = A4.target.closest(Bi);
        if (e3 && c2.toolController.contains(e3)) {
          var t3 = Number(e3.dataset.id);
          if (!Number.isNaN(t3) && Jr.toolId !== t3) {
            var n2 = e3.dataset.activeIcon;
            n2 && (e3.style.backgroundImage = "url(".concat(n2, ")"));
          }
        }
      }, this.handleToolbarPointerOut = function(A4) {
        var e3 = A4.target.closest(Bi);
        if (e3 && c2.toolController.contains(e3)) {
          var t3 = Number(e3.dataset.id);
          if (!Number.isNaN(t3) && Jr.toolId !== t3) {
            var n2 = e3.dataset.icon;
            n2 && (e3.style.backgroundImage = "url(".concat(n2, ")"));
          }
        }
      }, this.handleTextSizeOptionClick = function(A4) {
        var e3, t3 = A4.target.closest(hi);
        if (t3 && (null === (e3 = c2.textSizeSelectPanel) || void 0 === e3 ? void 0 : e3.contains(t3))) {
          c2.textSizeSelectPanel.style.display = "none";
          var n2, r3 = t3.dataset.value;
          r3 && (c2.textSizeDisplay && (c2.textSizeDisplay.innerText = "".concat(r3, " px")), n2 = +r3, Jr.setFontSize(n2));
        }
      }, this.handleBrushSelectClick = function(A4) {
        var e3 = A4.target.closest(Bi);
        if (e3 && e3.dataset.brushSize) {
          var t3 = e3.dataset.brushSize, n2 = Number(e3.dataset.brushIndex);
          t3 && !Number.isNaN(n2) && (function(A5, e4, t4) {
            var n3;
            o(t4, e4, true);
            var r3 = null !== (n3 = Oo[A5]) && void 0 !== n3 ? n3 : Oo.small;
            Jr.setPenSize(r3);
          }(t3, n2, A4), function(A5, e4, t4) {
            var n3;
            o(t4, e4, true);
            var r3 = null !== (n3 = ko[A5]) && void 0 !== n3 ? n3 : ko.small;
            Jr.setMosaicPenSize(r3);
          }(t3, n2, A4));
        }
      }, this.handleColorPanelClick = function(A4) {
        var e3 = A4.target.closest(gi);
        if (e3) {
          var t3 = Number(e3.dataset.colorIndex);
          Number.isNaN(t3) || function(A5) {
            var e4, t4 = null !== (e4 = { 1: "#F53440", 2: "#F65E95", 3: "#D254CF", 4: "#12A9D7", 5: "#30A345", 6: "#FACF50", 7: "#F66632", 8: "#989998", 9: "#000000", 10: "#FEFFFF" }[A5]) && void 0 !== e4 ? e4 : "#F53440";
            Jr.setSelectedColor(t4), Jr.setColorPanelStatus(false);
          }(t3);
        }
      }, this.domNodes = (t2 = document.createElement("canvas"), r2 = document.createElement("div"), i2 = document.createElement("div"), s2 = document.createElement("div"), a2 = document.createElement("div"), l2 = document.createElement("div"), t2.id = Ro.screenShot, r2.id = Ro.tool, i2.id = Ro.optionIco, s2.id = Ro.option, a2.id = Ro.cutBoxSize, l2.id = Ro.textInput, { screenShot: t2, tool: r2, optionIco: i2, option: s2, cutBoxSize: a2, textInput: l2 }), this.toolController = this.domNodes.tool, this.optionIcoController = this.domNodes.optionIco, this.optionController = this.domNodes.option, this.textInputController = this.domNodes.textInput, this.completeCallback = this.resolveCompleteCallback(A3), this.closeCallback = null == A3 ? void 0 : A3.closeCallback, this.hiddenIcoArr = [], this.toolbar = n([], yo, true), this.setupOptionPanelAutoHide(), null == A3 ? void 0 : A3.hiddenToolIco) for (var u2 in A3.hiddenToolIco) A3.hiddenToolIco[u2] && this.filterHideIcon(u2);
      this.setOptionIcoClassName();
      var B2, h2 = Math.max(this.toolbar.length - Xo, 0);
      (e2 = this.toolbar).splice.apply(e2, n([h2, 0], Hn.userToolbar, false)), this.renderToolBar(), this.renderTextSizeSelectPanel(), this.renderBrushSelectPanel(), this.setTextInputPanel(), Go(this.domNodes), [(B2 = this.domNodes).screenShot, B2.tool, B2.optionIco, B2.option, B2.cutBoxSize, B2.textInput].forEach(function(A4) {
        A4.style.display = "none";
      });
    }
    return A2.prototype.resolveCompleteCallback = function(A3) {
      return A3 && Object.prototype.hasOwnProperty.call(A3, "completeCallback") ? A3.completeCallback : function(A4) {
        var e2, t2;
        t2 = "screenShotImg", Po(e2 = A4) <= 5242880 ? sessionStorage.setItem(t2, JSON.stringify(e2)) : To(JSON.stringify(e2), t2);
      };
    }, A2.prototype.setupOptionPanelAutoHide = function() {
      this.optionController.addEventListener("click", function(A3) {
        var e2 = A3.target;
        ui.some(function(A4) {
          return e2.closest(A4);
        }) || (_r.setTextSizeOptionStatus(false), Jr.setColorPanelStatus(false));
      });
    }, A2.prototype.renderToolBar = function() {
      var A3 = document.createDocumentFragment(), e2 = new Set(this.hiddenIcoArr);
      this.toolbarItemMap.clear();
      for (var t2 = 0; t2 < this.toolbar.length; t2++) {
        var n2 = this.toolbar[t2];
        if (!e2.has(n2.title)) {
          var r2 = this.createToolbarItem(n2);
          this.toolbarItemMap.set(n2.id, n2), A3.appendChild(r2);
        }
      }
      this.toolController.appendChild(A3), e2.size > 0 && (this.toolController.style.minWidth = _o), this.bindToolbarEvents();
    }, A2.prototype.createToolbarItem = function(A3) {
      var e2 = A3.title === zo, t2 = Yo, n2 = this.createDiv({ className: e2 ? "".concat(t2, " ").concat(Jo) : "".concat(t2, " ").concat(A3.title), dataset: { title: A3.title, id: "".concat(A3.id) } });
      return e2 ? (n2.id = Wo, n2) : (A3.icon && (n2.dataset.icon = A3.icon, n2.style.backgroundImage = "url(".concat(A3.icon, ")"), n2.style.backgroundSize = "cover"), A3.activeIcon && (n2.dataset.activeIcon = A3.activeIcon), n2);
    }, A2.prototype.bindToolbarEvents = function() {
      this.toolbarEventsBound || (this.toolbarEventsBound = true, this.toolController.addEventListener("click", this.handleToolbarClick), this.toolController.addEventListener("pointerover", this.handleToolbarPointerOver), this.toolController.addEventListener("pointerout", this.handleToolbarPointerOut));
    }, A2.prototype.renderTextSizeSelectPanel = function() {
      for (var A3 = this.createDiv({ className: ti, id: Zo, text: "".concat(Jr.fontSize, " px") }), e2 = this.createDiv({ className: ni, id: jo }), t2 = document.createDocumentFragment(), n2 = 0; n2 < Vo.length; n2++) {
        var r2 = Vo[n2], o2 = this.createDiv({ className: ri, text: "".concat(r2, " px"), dataset: { value: "".concat(r2) } });
        t2.appendChild(o2);
      }
      e2.appendChild(t2), e2.addEventListener("click", this.handleTextSizeOptionClick), A3.style.display = "none", e2.style.display = "none", A3.addEventListener("click", function() {
        _r.setTextSizeOptionStatus(true);
      }), this.textSizeDisplay = A3, this.textSizeSelectPanel = e2, this.optionController.appendChild(A3), this.optionController.appendChild(e2);
    }, A2.prototype.renderBrushSelectPanel = function() {
      for (var A3 = this.createDiv({ id: qo, className: oi }), e2 = document.createDocumentFragment(), t2 = 0; t2 < No.length; t2++) {
        var n2 = No[t2], r2 = [Yo, n2.baseClass];
        n2.activeClass && r2.push(n2.activeClass);
        var o2 = this.createDiv({ className: r2.join(" "), dataset: { brushSize: n2.size, brushIndex: "".concat(n2.index) } });
        e2.appendChild(o2);
      }
      A3.appendChild(e2), A3.addEventListener("click", this.handleBrushSelectClick);
      var i2 = this.createDiv({ className: ci, id: ei }), s2 = this.createDiv({ className: ii, id: $o });
      s2.addEventListener("click", function() {
        Mo();
      });
      var a2 = this.createDiv({ className: si, id: Ai });
      a2.style.display = "none";
      var l2 = document.createDocumentFragment();
      for (t2 = 0; t2 < 10; t2++) {
        var c2 = this.createDiv({ className: ai, dataset: { colorIndex: "".concat(t2 + 1) } });
        l2.appendChild(c2);
      }
      a2.appendChild(l2), a2.addEventListener("click", this.handleColorPanelClick);
      var u2 = this.createDiv({ className: li });
      u2.addEventListener("click", function() {
        Mo();
      }), i2.appendChild(a2), i2.appendChild(s2), i2.appendChild(u2), this.optionController.appendChild(A3), this.optionController.appendChild(i2);
    }, A2.prototype.setTextInputPanel = function() {
      this.textInputController.contentEditable = "true", this.textInputController.spellcheck = false;
    }, A2.prototype.setOptionIcoClassName = function() {
      this.optionIcoController.className = "ico-panel";
    }, A2.prototype.filterHideIcon = function(A3) {
      if ("rightTop" === A3) this.hiddenIcoArr.push("right-top");
      else this.hiddenIcoArr.push(A3);
    }, A2.prototype.createDiv = function(A3) {
      void 0 === A3 && (A3 = {});
      var e2 = document.createElement("div");
      return A3.className && (e2.className = A3.className), A3.id && (e2.id = A3.id), "string" == typeof A3.text && (e2.innerText = A3.text), A3.dataset && Object.entries(A3.dataset).forEach(function(A4) {
        var t2 = A4[0], n2 = A4[1];
        null != n2 && (e2.dataset[t2] = n2);
      }), e2;
    }, A2;
  }();
  !function(A2, e2) {
    void 0 === e2 && (e2 = {});
    var t2 = e2.insertAt;
    if ("undefined" != typeof document) {
      var n2 = document.head || document.getElementsByTagName("head")[0], r2 = document.createElement("style");
      r2.type = "text/css", "top" === t2 && n2.firstChild ? n2.insertBefore(r2, n2.firstChild) : n2.appendChild(r2), r2.styleSheet ? r2.styleSheet.cssText = A2 : r2.appendChild(document.createTextNode(A2));
    }
  }('#screenShotContainer{cursor:crosshair;left:0;outline:none;position:absolute;top:0}#screenShotContainer:focus{outline:none}#toolPanel{background:#fff;box-sizing:content-box;height:24px;left:0;min-width:392px;padding:10px;position:absolute;top:0;z-index:9999}#toolPanel .item-panel{float:left;height:24px;margin-right:15px;width:24px}#toolPanel .item-panel:last-child{margin-right:0}#toolPanel .square{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAORJREFUaAXtmLENwkAQBA0iI6ULeqAKmqMHCiCmBzrBMdzK+fvlXVsgzUsX3d3u/2z2w8CBAAQgAAEItAmcqn2veld9Nip5yVPezbNrdqemhM5Vz47Z5MilxF5VV1dUNG6uyIJ9ecq7efbN7tQ8dsysNTLr3fOAtS4X0eUBEYyGCAkY8CKrJBDBaIiQgAEvskoCEYyGCAkY8CKrJBDBaIiQgAEvskoCEYyGCAkY8CKrJBDBaIiQgAEvstqTwBhxWiYy633o0H3UjD5at/4flae87aMv7p/9XrdfhwAEIAABCPw1gS8CdEV3aG1wFQAAAABJRU5ErkJggg==");background-size:cover}#toolPanel .square:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAARFJREFUaAXtmLENwkAMRe8QUoTogIoV2AGJjgHoWICRYABm4Dq2oaIkoFSHja6M4lN+FBD5lNj+//x+KjvHHwmQAAmQwJAJeGv55TUuqup1lL5tjHFq9XdR996XohOKYnK4bfy9SXPcVNRaevxKHn+2eruqi5eTJdbJewfpzsPzMbuUJ0ikxbB6qrc1OrIa+vps6t6R420uUCf8S/9xgW+nwQSYAEiAnxAIEB5nAjBCUIAJgADhcSYAIwQFmAAIEB5nAjBCUIAJgADhcSYAIwQFmAAIEB7//wTSoRUm1UYgx9s87opx0ENr3/dR9VRva3FzAT1x65VYBPc5t0rLMKeeyH/O6zn97CEBEiABEhgugTemKDubNjFCTQAAAABJRU5ErkJggg==")}#toolPanel .square-active,#toolPanel .square:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAPJJREFUaAXtmDEOwjAMRRuEVCFWJm7D1r0cgiNxlG7chokVoU4hkTJWcdQfKCovY2x/x+9nctNwIAABCEDgnwk4a/jjzR/G8XUNeZ33fm/l14g7555BZ2jb3eV+co+c5jYXjLH4+PDw3sqrGU+g+tA7yp5z2ptcMMW6gpxPpZi9zQG+9W2mCJT0NgeYEv6lOwZY2g0cwAGRAF9IBCiX44CMUBTAARGgXI4DMkJRAAdEgHI5DsgIRQEcEAHK5TggIxQFcEAEKJev34G0aJVJzREo6V3iwDCneaUas7e5nY4r7rQlXmS9XgkEMhCAAAQgsFICb9uiLZTmm16RAAAAAElFTkSuQmCC")}#toolPanel .round{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAi5JREFUaAXtmL9OwzAYxAsS7cLGwp+dSkh0ZmFgYusjdehD8BIsiBegEkM3xo4siDIjmFjgfk2uA1LSlDhpLXzS1VFj3/n77MR2Op2ElIGUgZSBlIH/nIGdgMF3pXUlDsUz8Tinis4850zlvfggfolbgUP14kZ8F78rkrq0oe3G0JPzWPwU3fEnXY9ERuJU3M/JNf9xjzquT1s00GoVZG4quiO3uu6v0QPq0sbt0WptNAYye8nNn1VeiH8FbdEgEDTPxUZBltz5ia4PArihgZaDaGwkejJhqDGaiHtiKKA1EdHGA6/g4GHDgCEPkfnfHUTT0wmvoGBY/bZh3jYFtEkSXkGnEu9shHlzNA2/nfAMgq5UvEj1gyiWi+BBsvDEuzaupYAgC1Bb8GKHdyl2S+9mN4d5nbsKdUNVsZe9C3WrBMDGDDxmRSu/9rJ3oWmVANhVgtesaOXXXvauZfqh1jwDbMzaAl544l2KKiNggZBnB2sWlfYiiFJUCWCeKxyVKoW9aa+3VbLrBHCySizgfXs5eYXSVQKY5a0vC1XC37CXvWs5bPVCViWy6LcSBBn1Zo4Aot9OE8RY5L0c5YGGAHriVCSIiRjdkVJ9XkylaA/1BAAGooNgOtU5YtLW52A0G/+sIo8FeKg9nZhSUX3YykLIngkebB/2CYST1Ejc+k+L6uMSjAbrhM/NBLKKwT7uetu67E2NC1ZsMs8xMKrP6zViTk1TBlIGUgZSBjacgR/CFam/GpziJgAAAABJRU5ErkJggg==");background-size:cover}#toolPanel .round:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA4hJREFUaAXtWEFrE0EUfrNJTVJBRK1oK6JYEVoQigr1IFKwBxVE0ZP+C6+KB9Gr/0JPFUUQDxaK9GCgSg9SQawI0lalKlKwSUyy4/smOzEEMm+SbJXQncsm+2a+b743b2feG6KkJR5IPJB4IPHAZvaAikv86ILesvqpNFGl8AIpGiFNg/wcNPiaVvj3Cr97m6LgycD+zMzCqPodB3fXAgZm9J6wVLxFOrymibb5TIpJ10gF94NM9vbqhPriM6ZVn44FDL/XmZ8f1m9oUte11ltBwGDzWgWPA6JZSqtllcqs4L2ulgapoodColNKhxdZ6Jjpr9QvRfre9kP9dxcPqxLetds6EmC8Xiw80qTHQahITSkKbn47m33nM4Fdz4pHNIV3ePyVaHw+yOYudbIabQvYPV06Wi1XnzL5PlLqI6Xo6o/J/rzPxJv77Hi+Pk5VekBaH2QnLKXTqXNfJzNvmvu5/rclIPL8HCbPhC+yfbnLy2fUdxeBZBua1juL5cJDxjwNEbwSJ9pZCQ5Xv4aYD2thYyZ/YCA32e3kwQwMYMEhcAw4wOU3KyJvAbUPlmOewwaef31clX1JpH7AAiawWcQ4uKQx1u4VQrWtsrBodpu0OtlpzFvSVk/zTVT0S8W7U5DJDfuEktcKYJ/H5HmZpzZq8hAFbHCAy5wtrZQ2vBcF4ITFIYUx2Cobxm7IzzoHcxpugUUUgPQAJyzH2rzvPi9wOs3gABc4we3szEZRgMltuCNOWAksLrvlstwuXFEAx80IALjjrAsoTludK+J2YcsCkFWicW7jAorVZrkstwNcFhClxDYxc2DFZqpz2XTcgSwLiAbrPiSb/6bVufhUkxhlAShG0IqlvRJYbPa/XJ8lTFkAKik0zuclsNjslstyO4BlAVwGYjyKEQdOrKY6V8TtAhcFoIYFACopF1CcNstluV3YogAU4Pz1rqEMRCXlAovDVqvWaAyc4JYwRQHm9oALcAChDJQAu7XXOZjT5+bCa2vs+XQaeTluD4x3uYZFGditp5vHG0zUx9zA5VMLoK8YQuiEhqsPztXzKMBRwx57xcdNTA1YwIyK+zy4fKG9QsiC9XRRDxFY1lRf6jyvxBJuEQqVwpwpA63CNp8YCwxgARPXKr6hY6naWgE7KFqJ3rzYsiJ6+mrRisCztsX24OVuowj8/l/X683zSP4nHkg8kHgg8cDm8sAfhkzSnCu/+OAAAAAASUVORK5CYII=")}#toolPanel .round-active,#toolPanel .round:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqJJREFUaAXtWDFLHEEUfrNn3LsIIRYGOcQml8YDu0BKr7BREKzzL2wDFopt/kXqQCBdwDZgKWeTsxE5FRsREr2Eu8l8uzewCLvvzbp7q9xMM3M7b973vjdzM+89It+8B7wHvAe8B6bZA6oo8u2unr0+G3SGNNoiRSukqWn6ZqRfU9+M++bbSY2CbwvL4WG3rf4Wgf1oAguHenE0uN8lPfqoiV5JjDKgt6SCL0FY37vuqEvJmjSZ3ARav3R4c/rnkya1o7WeSwPI+q6U+q1If3799uVB750aZMmmzeUiEHn9/u6rJv0hTbHLd0XqZ1BvbOfZDWcCb34MVof/ht+N8UsuRnKyhsT5zExt42o9POZkk/NOBMaePyraeGsQSJideO+yE4FdzPU486P42BTq+SQuHAMMYCW/Z43FBOI/bDFnPssg/K+AlSWTnBMdofiqvOvlvW2SgJIxbqcgbLQkR0m0A7jnJ2U8CAIrelsEbFkCeGHxSAl0FStiMCNsRitLAOGB9IVlsJymgQlsbhFLIIptOC0lzUuwWQJRYFaSgaxaBIVM4wkgqqyqCbB5AjYkroKEAJsnUIXhFtO8anaY1vMEkIxU1y44aJ4AMqmqmgCbJ2DSwKrsRwrKYbMEkMNySsqal2CzBJCAm4jvtiwj0/QCE9hp8/Y7SyCqHpgE3C6YWG8wJZULlgAMRvUAIe6kjI/D6fqeBE9EAHE5qgcShUXIAEuSCwBLRACCKH2geoBxmQ0YwJJiiAmgboPSBxJvqXJXuXFSv+1SIxITgDHY1tqL2mYZJKATZRXp0bHOEeXEVtj2T6mw5bQDlgC8NN9qrAWK9h9zO0W3jdEBXa6et7bk2gG7GH1csXiGxd0kCYyrKq8/tMP/9h7wHvAe8B6YLg/8B7td+kBEJNs9AAAAAElFTkSuQmCC")}#toolPanel .right-top{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAgNJREFUaAXtmE0rRkEUx6/XsrC1okRPYWWhbCQWFmxsbCyelKysZGFnISWSlJBIkpT0ZO8T2Nmy8QGQkrzn7X8yU9N97h0z923uZE79u3PPPXPmd05zPeN6njPXAdcB1wHXgf/cgQqDxddi7QLULqgJ4xNoFVKyLAqoB0kbJILSuBWqgvz2Cked3xl2Xx32IIa/C3OLEAdu1Mx1qxmfePgpMn7HEM1XtkrlSPXAKYTeqIeXRV6UeSSONAoggH4oahFaBUhqi/2oAxmuId3t1Bt75QQTRCmiIcH1E0mlU8Sd7oppvAN+hks4zvzOkPvc7H/ORz+UOxB/Dx6FMfeJV4rNlW2AhgPOY/zXdprOEz2dZzj8ggAmK2JQiDM6XBLgFwNIwopoDojN3EVbhXd+WbK6v4gnxGZxuJQged6sAL8ijfx9KBZxrhCfasgMsvPOK5/nMYeKuILmIGNGBzgOv2aMIuLCkwL8esQcxqZNYOUvVsCmMYqIC49h3ieD38LV+F8QnTpGBXj6+bcKfgTAHxC9tLu2wQ8D+J3B7+GaxWkWyyRjQ0jzBlHn9yGr4AcA/MLgD2yD7wPwM4M/xDXoYxTc+bQeYPF/Qo4wtgq+G8APEO35Y9vgOwF8z+BLuKbxCRJp07NtpKbO05di6+CpLS3QOFRDN85cB1wHXAdcB1wH8tqBH3D6o7sgJgNQAAAAAElFTkSuQmCC");background-size:cover}#toolPanel .right-top:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAwdJREFUaAXtmD1s00AUx9+7JCgBIdEoNJ1QyoDqAQkJNkCqYGgEMwMDCwsLLOyUAitsMDCzsVUdSghVJTYkmJBI+VhgoOJTgiLH+fA93nNICFHjnGNXMZKfFPt89+z7/d/dO58DkFgSgSQCSQSSCISIAIa4N9StpXXK2m7zELmuRZosjWgxzDQhvs5AdvHTAn426SBt4hTGh0H32U7daiPOAZKFRBYQWj+d+iwAqd6ziYDkgmi+hfYBLp3ptfkUIhWwRKTuVRtl7eqzgMCgxKD2jNc/AwqhBylHxDYCvuXiKxZWA1AbXLlJ5FaR4LgP8z9NkQq4W7Gva4LFDnCnH4a0GXCDo14DxT/NsOlUrTS1692LY9jqp5lZrZeaUoH4q7/erxypACI8ITFm6DWF6nY6Q7WPp7IfEDmmA/Zt4FouXYUWaC4Q8IiY2d85aObv66UQ7osD084T6anN07n328EPewhpbXltCDydzCxSAV/Kux8CKp5ClOJAPiis2ufNMDpempO8U5KcMLNIBUiX38u5W2OL4NXJw0Y1OQGhRPwZAaTsZAWMI6JYoWlOnjyvAD++lnHTGwmDQ+RTqL/PINPJRcebPijLbQDbUQHCkVKpFU7qrZGJ3VuBzBNYnr+jAvY/bh5xdWuN30x7ObGf+YngPVC8RqAHz/Oa3wXLs4XsSd/VSdOcRBSU+QrkuXs3RXwYhC8Vcudk2+CXE90RUGnzt7BgR76dHgbfH6P8o/o1IH2Tu3d5Dl/AbG7FdewtHinnykJuzxKibCiMLNIcMIEXqsGRcBv1G1JPRG+CwMs9kQkwhZdOxfpFMPlVqeMReCrnIBaJgKDwXUARoRRcQgT5+nqZIbzTbTM9h86BceFNAUf5hRIwaXgRN7aAOMCPLSAu8GMJiBN8YAFxgw8kII7wxgLiCm8kIM7wIwXEHd5XwP8ALwJSchi0YrVxuK3b6/KRLR8j3f38oF8crrf9a7HVbl9muNjDDw1g8YlzMF+pXzz6nDJDnZKGJAJJBJIIJBFIIhCDCPwGO3q+e4PmVA0AAAAASUVORK5CYII=")}#toolPanel .right-top-active,#toolPanel .right-top:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAjBJREFUaAXtmDlLA0EUgN/brMaINiEqgoIoglEEQf+A4AXWlja2WuRPWPtPBLXywsZSS402NlYeSSPGHJt9zrisSOIeM9llR5wpsuy8zcz3vTmYXQBddAZ0BnQGdAb+cwYwKfmZG+ouPdYn69jMA2EegNgVRsGA/fJq715YrtgFcpfUT9XKFFgGA2SQCBw0TwATDDrVCoqI1dJab6a13uve9ArI1udO3heIcPMLlmXWfquMOG3ZzoWR+xUWfvGLt8YiF6Am7BLQitNRAG0rDbtHouIv1Z5VhmdENmCaBUR4lv07ICYrUFpOF8k0F2Ulkh8BlvryUvpWVgINI9kRcKeOrIQBPXduG2Gu0a+BH70KSyCUn1ZRaP3EKsBduISV7loPtSZIbAHz9mMXGDipz5m1xiEhbgdKoNgWGrsAh2/ajXMiGEYbFoMWtqHSCLjw7NiQZceDg7GBTCFoTYjuQLGNQBt8LrNxvYAN3qGfRMoWn0KRH+b84LmAW7JntWm0rAs2vQZ5HQJWXtcyfWy0hM4fkS7isPAcuH0k6F4UnrcTmYAIPO+YF1eC5f+B7VBHTq3YbyRTSAZeDNP76Y4FkoTnWh0JJA3fkYAK8NICqsBLCagELyygGryQgIrwoQVUhQ8loDJ8oIDq8L4CfwGeC7R9m+SVQ6e1Wcu2Lr5fRn6c53lcpfLrp8WGZe0wSOdNSmF4z0QOnVXHs8cfW/NX1OX5kA7oDOgM6AzoDOgMKJCBTz35SoU1TFsiAAAAAElFTkSuQmCC")}#toolPanel .brush{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAArJJREFUaAXtl7tu1UAURS+IDokkvEOABkENFVADEl+UXwglXb4EiY6UvN+PyzMlFZCCBhpYi3ikKWznWJixI3ykfce58mTWGc/Zx3c2m2LagWkHph2YdmAX78Ap2G+hp2gN7Ue7Ji5D+gP9ynSP6wU0+rgI4U+Uw6fr0SexAvhmA/zokxD+fQX/hHHeksjonsQJYN9VwA8ZF9Fx9Lr6Lu1+PprEKApb+LcV6CPGJZRipyRupBuHGpdZOB2Vx1wfrAFpS+JFzf3FvhLsDfJYeObr4Pn6TzQlsZ5uKD0eY8EEb6M6FAAwiTlKdfCJ6yOBeb3fInwqzmdcR+CFsLA9ZiawiU6j4nGUFV8hIZ6jwygSwj9AzvuIfM0oHj7ul0gIiy8Krysl+A9cn0TFQ3ihE3z07ApvX3CeTW4QeHfa4yKET8BjFAldyb7gPJucnbp4CG+hCuHZ7wKfCtYmZ7MrHrqLFim8rqP7RMJ59gXnDQbv408Q+r0eHok8aT3fTl08hE+PX4gofH7cuiTda4K6Rio8H390B3WlVOget2jS3Npf5JbX5ezmFmuhR2ulP3L+k50y+bWWF3UNXUlrtWC7WCy39xd5m7fZRP16FPALAN9H7mCXNu8x8bg4zw7tMSoeB1jRn3VC+IIVbfMWqIXqPAt3EHh/i96tILq8HQqvRQpvh9Y6B4lLrCrEZxR9L9dS59U8O7RNa7C4zsomcDtIoCtprc6xQxeB38tCTaHzGFvbQ+un8HfQOST8FfQF/fPoIwEtdQMJ7+vFVfQVFYm2BOy6xrftofZTV9pAZ5GvF0XhWW+2z4+G2OkIJfgzzBf+GmpLtmGZv/s6ksAFllhFJpTrPH/rOr5eCL+FRhXr0OgobbJDm9Rg0fYEbkJljexB7m6d7LLf0RTTDkw7MO3Af7oDvwFjWdeSB4jgWgAAAABJRU5ErkJggg==");background-size:cover}#toolPanel .brush:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABOFJREFUaAXtmVtzU1UUgNfaSZOckwFKW8ql6DDeRaugCOMDTE5vMuMP4J/4pk/+AB/9J9RSmqI8OCqKBUUEsYNQSymYjvScxKRnudZOT8xkcrJ3GhJ8yOnDydnXb133pQD9p6+Bvgb6GuhroAMNYAd9O+46dImeg2Lpc6JwTBGcTyrn0wcf4GY7Az8zAUbP++9XABYBKBUBo8Jv9ihn5s40bkRlprcyNehG/fCCf6qMcKkeXuahkE5uhMHcCxdoj+28PbfA8EV/jMp4mWmPxEG2Y4meWkDgocxuI/AqcRUBbzYToh1L9EyAkbnNQwyfJ6KXEOHK7lTaUxknx79vtBJi/xeUbVYflfVEAIGnLRT4lxn4+2zWnV72sPDQw1WVdidaCVGh4OMIttm76wKMzNJBCnGBgF7hgPvBAXf67mn8K4IxCQGAH0Ztm727KsC+PB0gCBZY868CwlUH3al7Z/FxI4hBiMuN7eu/uybA6DztD0uBuM1rDP+jk2wOH8HUhKgPbIW/D7iZT6I2zd5dEUDgtyp+FR5gieEn70/ho2YA9WUcrUVA5UsZZ6jljMLc6hl8WN+m8XeysaDTb84ao5Wyzz4Pr/NY1zIZhvfM8EfyNPh3MbjAsXKc8e+kFeRWpp0/TDwJU4N26g98SfvKZT/Pfd5gFV5n+IkVD9dNYzz/Fe194mv4E6z53yADubUp956pn9Q/NQsI/D++vwBUhU+5DH/GDn5z02fNw7uIeJvS4D327OBFgKeylTiUp5FikeEBxnnEnwbQneBd5ZpM0Oo5PEtDATA8wTsMfwsGwHs06d5v1aexrmMLbMNf5IHHWRs/J9uBJ3+eNX+c3eZXVOStT2ZXGgFN3x3FwNg8DRfLvsC/LatpYsCdWJsxa176BaHuV4VPMPxM+/Ai3I5dSMzvA0MQHGPz/6LSjie53KQxDV/R/VhovIngeOtn8U9Tv7j6HQmgfTcyP0MwfM4Gvs7d3mpH6Dh4KW97IZOUpwMv8l3WoA28ZKntQGd4uGFrsVbwUtdWEAu8TnmSNSTwtO+azV9LsQBvSqAnkhwrHj4wwdnUW7uQXilLnDVI5+tbnDVyNoEnK3OZauuDdYq1gZc2VgLULfMn2Hdvc77O2eTrbsNbCSAH7I2KXubfk2WeeJm3WSn1hq66JzrKarouK7NpY2ar9fp2LdeBoa9pdynQ8CdlgyV7FBt4OQeEvCfiReooT3YtlXUnuwEvgsRmITmLYiGY4/28hs/w7tAaXp8D9G50STZ03YIXAWKzUFkF41ChUxwkq+kkejZbWzk+bh9i5AQmhxirrbSA7PSJtUBiSw3KoMQgDH/XNIE+uFOwyBarHh8tDzGmcU31sQIQhloA9v2CaZDarcP2wd0FuxOYaVyb+lgBgKgqALYWQN+0hbiobx34yiTu4G4Ds5M2sTFApPYChIAh1a5AGicYyvuHofTfZZXc99RfmTS278Z3rACAbAHOgxyMTV1I4LEIovkXeW9z5VnAi0JiBeBg1C4kB47hWf+jqkBqkIG5nAaxRMe47iAvbt/tSjvTy6dbu1o3tN9SAEQV8j8emJXOMeg5bQ12qeipGge/3ZVxZuSaMCrv9TvWAkj4GUMqdiH+wwJ/Fzgg+K0KfP3N77BAKWeJ4Z/0Gro/X18DfQ30NfD/0cC/yGVeCCJ5w/QAAAAASUVORK5CYII=")}#toolPanel .brush-active,#toolPanel .brush:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA45JREFUaAXtmFtPE0EUx8/ZFuwuQS5yE9EYjJdoiLeoL2rYUpAPZXwwfgA/DiBQ1BfjXcQbKhoFREQsUXYLpXs8U9xkQzLb2d22+LDtw+zOnDPz+59zdnZagPgTRyCOQByBOAIRIoARfCO7dt2j9oKVv0lEfQxyP6npt75fw/UgE++agO5R62DegSkA6nWBEfFhU0IfmhvENbevXKuVM6jGeGvW6tlwIOuFF+twJi6uFe2x3jvUpLpuzTOwb8I6AJtwl4COyCCDZKKmGSjBF2DKDz5oJmqWgbax9W5ycIrL5Kgs8jv7RSaSqKf9HuyaZKAEX8RsEHg3E1uOfX2nMO991QW0jdB+jvwkl80x78Kq1wRw2c+2qgLas9RFYE9y5I/7QfiNcRnN+I1XTUDHOHU6G7YomxN+AL5jiJ/qjNQNP5uqCBDwxS0rGjzgXCqB/UtX8YefgITfYJixzlHqKBYZHuBkGP9tH4bXoH9xyPhabo6KCiidbQoWv2HhVLmFZeMI+BFS0L+cMeZlNt7+ipWQgN+0rEmgCPCIH4jhV001eCGkIhnozlLbhs3wAH3e6AS55t3mPdSBuZo2FoL4Rc6AgM/nrYlI8ICzqFH/z4Fg8EJopAwcGKd9+UIJ/nSQqHltueZnMUHmylDDordf9Tr0WahnhFotYHiCM6qL7bTjsnmHoJsrw/ht55jqfVLV0Gsn4G2yxrkvCvxbbY9u/jBxyTt30OvAz8Ch+9Rig3WH9/mzQRdz7RHhTSXgxXyBBAj49XWGJzjnwgRtuWZfJ5JG5Mi76yoLOJyl5n/w513nwC3Cq6RmmMsZ/B7YV+Kg9AwI+N95W5RNJPg6NMSPk2UJS6jusruQ+IG9tiXg6UKoFYQTwky9YaTLHczCzO9bQq0PaK/4lyASPMDLasFvx0Yim0+VDVtkT/B5/pLERKV7OpUyBhZNXFExDmMjzUBBs/siwSO80OuMdDXhhWCpgERRaw4TkZIPwnM9aQwsZPBn6DkUHaUCCJ1QAnhXeGZAbeCFRqkA/p8vsAB+wz7V0cjMD+OqYgAjm0nfA0RaC4CjvADDP2loMAa/XMFfyk4VMJRnANUzsFvwQr9UAO9ASiXE5/nHjXuMTK0j7yZPKgBRK1s/DP+oMaUPfjYx505Y61b6DCDhbT77aHwM4C/m+D4H6HCr5VAT906O6vVphv9Ta+h4vTgCcQTiCPw/EfgLJV9RSXPyCEcAAAAASUVORK5CYII=")}#toolPanel .mosaicPen{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAOtJREFUaAXtmckNwjAQRcNSBg3QCkVRIXQBZxogghlxQ7Zl8YKSSG8kX2bx8r4PtmYYNAlIQAJLJXCOjT1jvGYet1j/FKNom6L348zN7xrx3tC1N7GSdwz/I8ahEq+6pyJfXaAzcIm83EvRtkXvipweYG6xVEAFIAGvEASIy1UAI4QTqAAEiMtVACOEE6xegdb58w2eb3Fqf/1XrF4BD0DvF61XAUqQ1qsAJUjrVYASpPUqQAnSehWgBGm9ClCCtH7fmOAesWwuTPEnaCzTFRq7sr6Ssq2T7Z2pPiS/zpOdomx3aRKQgAQWSOANmudym8Lt+O8AAAAASUVORK5CYII=");background-size:cover}#toolPanel .mosaicPen:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAXxJREFUaAXtWU1Kw0AUfm90UeyuIih4Add6ATeinkP0TIrnqOLGC+gtFASxu0o2zpgpSUngvaTtS6YtfFkl37zf78tiZh4RHjAABsDAOhlgLfnBS3btvX8MIRxpNilwJv50O+72+2IwlvLtSmDEiuIPtfVlcGZ6X8a+ZhvoxP/5hxw7ruHFh9pAhfkxDfhucr73IQVowkZP0xDXfy6HZ012TWv7z9O3EOhUs3Hawhxfsfi5f88vrQ2swnzPNdfCtzZQs97ADzSwblGgABQwMoBfyEig2R0KmCk0BoACRgLN7uqBptwKmzN0FGByNRRr3fpfSD3QROLiScpyGClV1NhbRJwyhma79QqgAU3aVDgUSMW0lgcKaMykwqFAKqa1PFBAYyYVDgX6ZHr0+iteqVdzbqwCs+KzcF8tVnpXt9NxMkL5cCHez0uOi2D5vf7sadsSi7GywpkoMPOXaJODagNxrBMnI03DBS1ol3gs3jl302VMxAIDYAAMdMfAP+EdVKaWg/p6AAAAAElFTkSuQmCC")}#toolPanel .mosaicPen-active,#toolPanel .mosaicPen:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAV9JREFUaAXtmU1KBDEQhauiC9GdIih4Add6BhnmHOKhxHOoeAY9hjAgLkfcTGo6Mo2ZpivW2F3GgZdNJ5VKVfK9XuSHCAUEQAAEahJgLfnx0+c0xngnIqeaz1/Ymfg17ISbt6u9+758u33GZFtN/kTr38TOTC+b+K/5Cp3HRbxtbGdr9lVDXcA3ef4gkv2+wVbb++Tg0urb9Tt6nD+L0EXX3rZDW9G/wyavxx2nx7CAcRJ5RcECvMha40IBKykvPyjgRdYaFwpYSXn5QQEvsta4UMBKystP3U6PmfDwYS6/jddspYtl63+hogLpJDXkMDKEfBF71rn1CmABmZpVqlCgCvYsKRTIYFSpQoEq2LOkUCCDUaUKBapgz5L+cwXS1X65qNvp9DJCzeNCup8vh9B7fzqM6CPbnq+rfWHmWWvpftUFpGed9DJSelzoBvNop8mHEK49YiMmCIAACAwnsARsm0C5E2sdIAAAAABJRU5ErkJggg==")}#toolPanel .separateLine{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAoCAYAAADUgSt0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABlJREFUeNpi4WUQTWMAAiYGKBhl0IIBEGAA+zwA23Qf36YAAAAASUVORK5CYII=");background-size:cover;width:1px}#toolPanel .text{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAupJREFUaAXtmE2ITlEYx8dn1EiUSYkSKRNRzMpEUayQolgZpXyVBStqdmY1ZDGyIKywsSCFSSE7Y2OiFBuTCPlokPIR/j+et+68zX3Pe+49933vne5T/857znme//M/5z33nHNvS0tp5QyUM1DOwFidgXUa2Edhd1EHeE/C/whDwgShUNYutYivYHOh1EvsKRP/1sr+Ig2gVWKHTfhqld+E38JCoRC2VypZOvdN7Tmrn7B67otBE7zdlK6w+geVU60tt0WniX2jcnJE5QNr3xVpy+XPSyb0WJW6ndb+sKo9V9U2qfku/BLmVimbovp7gWejo6ovN9WjJvBqjKJe678Q09/U5vHK/kJghtcLo9kCNbKdsq3OHM2hmW2blBzxz4VxNYTcNL/DNXya0nXLhB1yZN9ofq6BOmjCdkeXxgwHdXSpbXD4Nqz7uDKxfM7XmfGI+V+r0z9TN7ZHTlgGsLLOTLPkV9lu59UZk5lbl5gRP+CZ4aLF9XjGBXdHOAPo8mReZXFct6NXDk+adO7RSxpLydceKYDB7/ANjPpPjFY8fx8w/36V8z1jcb8hLBP2C5eFhhrbJScqMxgCS5OqT/oPcC3mbs9XB9ZxUmMiZgv8C/uSkvjGcVV4JjDznKxpbLGC4fkiTEtD5BPLZY2kQwIna1q7IwL4Ks9UWj5nPNdlEnKihrCtIoHvSQgyFwcvKrywcJLyAhPCeA5fCQxijS+h7xLYowR8ZbsivPNNFuPPhJy1Ph7mzGySmHlZZ6Y4SUPaHJH9FH4I7EqZGJ9JED+YCfv/fxX+7oz4/32oIgHLKAtbK1L4Xwos06C2RGyQDwutQZlHkj1VlTxbRjanr5024r70VDUZDlqe2zW9PDs5IT8bcbtnrK/7dAV8Ffh6scg3OM6frY2/9W6cQ+D2M5bvZCjeyr19WyhCB89yG8AnlUFedgZE9FjgHGiUXVei1wI33tTGlhZ8W3Oo4oaQ9KrvoC67yxkYWzPwF7rCpZtbo68bAAAAAElFTkSuQmCC");background-size:cover}#toolPanel .text:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABOpJREFUaAXtWd1vG0UQ3zk7ju0koCROUkWhUFEqQVB4KH1rKVGIXQlUgSoEDy1qpVI+/4VK+SMQFLUIgQQtEkKt+LLr0FQUeIAi8ZUCUkE0qBWJ46A0sc92zzf87i6Oncj4bs/rB5D9cre3szO/38zuzO5aiPav7YG2B9oe+F96oP+8PtH3aW4pltSPtpKg1jLlZT4O3b2m4ONPMgdaZYdaobhvunifuGXMVnQTicez+7rOVdoqny2JABnlFy2QAL5gg2Vht1UCr+hSHoGBGe42C/nrLMRtAU3ba5qcZBLhgNB2ZPaFr1YMq3oqjwAX8wct8HD/pUwi8rkgPi2YqSzMF1SBrtWjnIDJwgaqkXjVMoRpZD+F4MMjX3Gk1riKd6UEBtL6boAaA+j5oZHIBxbAxUTXt0T0tWDRl79ZeFoF6FodSgmUy1xZrKdmR6m0bojIiQav9693NfuijMBQigfh5QOYNOVOotdrgfWEwu8JElkW/GD/dG5XbV+z78oIGFxAxeUQps9HNxLRP2uB/TFOBcH0pv3NUJtSlRCYYtaY+ZgFkDVtbdHWUhAiGNJOYEUjCPTUSJL7Nvb6bykh8Eoy/xig34nFejU72ZmuB2dhIvwbZFJgECkI/Ug9GT/flBAwyZkW8O9rIIEyUP9XSa0QeB4RU1JEmyYw+FnhbizcOAnSo90RZ57Xxy9ejkc/huw1gN8+lCzG/0VM6nPTBIxbqLCWN4nPzO2hvxtZnyJCsJwMVSazknIbDXHta4rAXTMcxry25zNplYrb2GZHV/gUolBiFo8Op/WtjaXde5sisFJAZUWFhVe/WYx3XXY3J8RfD1EGqfZ9EA8Uy+ZzXsY0kmmKAECsTQOn0jYyVNsXqEbr6Ogsh2r7ZN99E4ilcjuREnehwi71hMNnZAwvxKNfYtz3mEaD83M6qrf/X9DvUBh/yRlLqRWjtK0/XZRTZRqfQMcDprBT8Gm5wVVpX7l46yXuza3qOLSo2R53BINj85OdP1ZheX/zFYH8qn7EBo/pAw/Meze3SZJFL4raFqNsp1RfBx7pCFgVNJbSf8XzHk0T+7Hf/3ATLM9NTLt72TCuoHqvUndkeHE3rXgevCYovYhhdNICj43ZnFNZZU1W5bFv+hngZ6Cvm1fzz1R7vL9JEyDTqaDEdMKqrN5N1ZdEDbd3r5hKvqaQFIHhVP4OZA7sPKkU1MJv1Ick93UsFDmLKNxAQRyNndf3yo0WQopAkRmVkwNWJZ1P0IKssXryF8fJIOaTVh+uYKT3R54J7LzMHbBh33PWVNJ6mKS/4Rx3EmvKwMAncK+0RUaBZwLXsvoBTJ8hKP/BrqQyVlxksxPR60iH57Cr7SgXC8+6iG/o9kwA9z12eDGg7pFxg1Y/jerNxTGZy2BPBIZSxfvhnT3w0k0KR9/xg89tTDYRuYDF/AsK5MiFtL7fTb7S74mAwWuHD6K3M+O0Whms/Ikjqa1TYjG7Eoh9wT3w/kFLMQcDjgHlyB2FtwcjbyEKORY0EZsu7PBixpUA5/KHENYeKL649EjnFS9K/cr8PknLsPWufUQ1vF0GuxNg4dz3cIsW7ya2Aa3DThL4Z+ewl8OOKwFsGUo4fPy0bSBydpOtljQz8dB31u0eEoa+vCya/2vKSmkyaU0Fqync9D08w762+irst3W0PfBf8sA/GcCs3A4F3NoAAAAASUVORK5CYII=")}#toolPanel .text-active,#toolPanel .text:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABFBJREFUaAXtWd1rHFUUv2e/srumSpNNUkrUirSglbwU6UulhriJglRERIVWKmgltiCITxYhhfY/EBWKDwr65ENFhWxTuwU/HsQH8aMqSMFqimmaQtLd+Whm5/ib2S7sTnYyc+/cfajsPOzMPffe3zm/c8+5XytE/+l7oO+Bvgf+lx4YPmtODc3XV4cr9ZO9JJjqGXiD3xYs7hRMrz/LnO6Vnp4QGDpnP8iC93tGM/NgtWI9d1sRIKfxWrvBrsBo9Ogh3bgjVR50LWORBcKn9RAhhlK7lh/P/9kS6XprDyG2jYMdxnuWMlNDuKd0Gd2Oo52Ay2K2XUHrG6SeGv+OC62yrrdWAiML5j4YNiEQMkEDiXnAWLOPBOVJy1oJNBrcTF6ETHfD+M3ucnVpiCJ5wLEKj6675t+CRNaL+TAEytHelani92H1snJtI+Cw9TKyNbeZ8b5x66Q1mbUQmGNOYcGKFd8s3MnxeR6S9XRYey0E3pk3noT37+2WvBsUs0ibwnhjg1xRoIWASyIieTutY0GzGLHQPOlsvXkpMYHRr6z7haBpqNkwdYaqZh4aXbCfCK2XqEhMwFl3Z28lrpRHXXZPSNgZ2lRKaRBlR5Xza7axCN8rJCVxPkM7rpQLl4O4MuVEI3DDsp5XM94zkclyxVsyxnZrm4gAjOjYNndTsJkM24tDu3/F2pHgUSZQqtT34NDyMBLYVdWPmaj47z/WC6r9vX7KBJjF0aZiVsbw+oPE8SaO2q9SEt/zNW+t10wcWvRsj7OZzMRSeeBnFQoZlU5GzXzJN57EdXhgSQXD78NiKxaPbU7D9XKp6zkiClt6BLwVtFQx/8B7ZyolDlybuePzKCVh9cML9gPsOBeJqEaDhe3X9tGNsLZhcun4hdKyZzz2PZePTRe/DAOOI18pD/wG46vAG+Sa8WKcPsE20gTI9YdbENP7c6Q+A7UMwY7oXe8boaQUQlIEtleMuzH7YOdJNzOp/ActI5K8J3KFMxiFK2Cwu3TW3C+LJUXAZn4VvkoTiU+XZuiqrLJu7S9MkoMF7bRX57ryC2NsAnt+4Cx04NQlRDrVHHbvW8fDOTqNnHKA9TTulbbJYMYm8NeK+QzCZwzgP12dLn4roySqLc7Ii5gOP8Oqlm3Y1itR7dvrYxPAfY+/70EHP+naQbR8E/m4CKcjMpfBsQiMVeyH4J1H4KU1yhc/1mJwAGRlpnAeyfw7Fsjx8wvmgUB1aDEWAYebUyfi9KPlSaqFoiWtYPGeDyGRzJEESt/wFnj/oAfMmXRTQVJDQ/rflSl8iFGo48w8VTpn7Qpp1iGOJMB14xCGdQuAL1x/bOBiR2/NhUtlWoWuT+AwEg6OqjGeaAIs/PsezEC9Sd6AkelU1teD/xQOxznsRBLAluEmrgt/uW+kcCagqyfF5encj1gov8CEYa6uiuR/TXlTmsy0poPVHG76Hq2y0lZfh/4+Rt8Dt5MH/gPfHXmcyfgZhQAAAABJRU5ErkJggg==")}#toolPanel .save{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAY9JREFUaAXtWDFKQ0EQDSaNliFl5F9AyBEscgKLHMLGQ9jkCBYeIkUkNxAsLA0eQLAT7bQR8xYZEPmzM7t/d/iaWRgW9r19M/Mm+flkMPDlDrgDNR24gXiIP7u+UHmIauugmrKRsDdgZDSbxifAWmME+ASMjGbT+ARYa4wAn4CR0WwanwBrjRGw1xO4g8n0usztNAcOp/N7IqbuXSbwmposwn+LYNWgKZRfEORi7h6MaKpVKQifFWhgIeSoDl91aOK6enWKBIfgPGQ08Yg7Rwp9E8oJsrwjtN+DD3BnJpUlJDlPaOAiQTeZ2uW/nJWiiXVyRd8X1HXRxyAnzxiXnhCk8Xt/BjbJEf6hKV6npCKRIZzi/BNBOrSHszlzR3NMOiJXTYwoXQIjHdqXEb4GIh2RqyZGlIbAbhGkFd6bRhG+BiItkasmCkrHwLeI8LxvBK4GVtelJmqyFuS01tXlbbRgbflS3kC+d2Vu+gTK+Jiv4hPI967MzdivY3ju9n61fYQ2Pa66z7X12DYv7T87sAMM9Kzb7VMBMwAAAABJRU5ErkJggg==");background-size:cover}#toolPanel .save:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAuRJREFUaAXtWE1oE1EQntmkTXYLIok/KEGvQvVWKFgo5JKk9OShmoMepAp6KvTgxf+DFw+CPahIr5FCQT0U2xRK9VIU9VBQ8W6IKEktQjaJJjvOBgNJNtvd7PYFhbewZHfevO+b+Wb2vd0AyEMqIBUQpkBkpbRknsIIGDgoEhwIJoXiM7gimkA0vkxAtMJO+LICTgqJHpcVEK2wE76sgJNCosdlBUQr7IQvK+CkkOjx/74C6FWh6Ir+mohGvc5vnYcI74upoZFWm9trzxUgoB9uSRz9CLcdfWwcvH/QhPAiVGmTP1oiCDhTnNDmbDi6mqPZ0mUy4AEgbA8O4HRXJxdGzy1kYkdX9VNUp6ecQDWAwdHvqcFNF5xwMFs9XqP6W27BMACe3prQFt3M6+bjuYVMsGJCe4aoPOJ2CtWhtnD4HWndSFptsQ1Sf1NtoRE8wryf4E1cXwmYAOqe8Cy3wUcO6FiloN83bTsd5Z+Ve9x2w4j4ObxPm9nJ182Y7wRyJ7E8gME0B1ThwC5ElvUpO+JGy5FxqdFyEEznR1C383Vr952ASfQtGfoASLMNUqTHh9bKRzsDiKzrMTJo/q/9itvnpROn896SgNf/corJoYdchedchb3VX5SZIgo0yW4RKVCFTGPFQljqdcUycezisiTAJJONs8new68K6jS3Rw6Axtaz+s3m1Lls5RoQjfOG9TUU0s437T392sRlTaAn1HbnXAq3MIBneWk0DMKr+7Pl8QOr+hgHf8O0gaKcy8ex0D7L392uJmCGUkiorxSkO1wFhbPI1Ax4wtcB3nDuFhPqmr9wrbN3PQGTIp7UbgPiBu8PMVb/CD8bb06E1etWev8WIQksItbDCGlW/ZO53vOrwpmXcaz5D9eK4P1dyIrVZskntS9sGG4zCrgRUgEBcdpCygRspenTgKxAn4S2pZEVsJWmTwO2+0BkuUR9isEXTbcWeuELUezkfzk2sZlLdKmAjQJ/ANa802uhvjOOAAAAAElFTkSuQmCC")}#toolPanel .save:active{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAmNJREFUaAXtWL9rFEEUft/mcne7AYuY0v8gpDsQ7A7h7oIK6bxCi5AfrZDCLoWFjX+Bhf9BijRB0wixEVOkEIykDTkuGHKbNMkpqJO3p5tsuNnM3OwMKMzBcbPvx/fe+97sG26I/Mcz4BlwxsDk5tlG8nUWgIFLLsFJ0AOn+AweuA7gGt8X4JphFb7vgIoh13rfAdcMq/B9B1QMudb7DrhmWIXvO6BiyLX+v+8ATBm6vXn+SQhx19Q/6wfQTq81UcvKdNfGHRAkTnSDKO0ETpU2OQbGBVAFSwSKc3D1xaDTchkL+g7XLY0LiOtRBwEW/8BBXIfVeMJfH4Hlw/vhvoaH1MS4gASt14jWgeA1kRj9XRLsA3oTz0Zr0sw0hYUKSGKEt6ornMiuZrxLMwB71ano2aXAcFG4gM499MdRanNC33VzYOp/jFGp3a3hXNcnz65wAQnwt2blC0GsDIKke1sW8Ur3/KhV/iwzGVU2tHfTe5y4NfFwVDA+G9b5bJi7yY9n/gbP/Ec32ch0eXkN3wsVuMsJKVzoU7/GZ8QdWRKc/GGlEs3LdEpZTl5WtlAavNNCjDE8IcJvutourE5GJsuC4Gm3juPU3sav1QKShI4b4YcA4iUNxmR6Pggmn171GuF7G0lnMawXkIDXm9EL7sDHQRH8zBNqe6YarmYD21o7KWAN+FUFtZn1r8m8L4/j8VYdP20lncUZfomz2gLrbjM6YPfpAhBark46oBXZkpEvwBKRxjC+A8bUWXL0HbBEpDFM7jkw+e5s9L+JxmmYO8q20FtzOOee/3Juzov3ATwDMgYuAKebdW38MyGrAAAAAElFTkSuQmCC")}#toolPanel .close{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAUJJREFUaAXtmD0KwkAQhdPZWNho4wlEvIKnyDE8k3ewyE08hXaWWuh74MAihvzNbCY6C8MKgdnveybsJkURIxKIBCKBSCAS+JMEZvAsUYsMvnOLNQj/RJ1RS4sF0JMhnVB31BalOpg84a0kCF+9+18xm4TEphYSn/A7rGM2tCWywksqWhKjwGtJjAo/VMIFfF8JV/BdJVzCt5VwDd8kMQn4Ook1LlQo7uDcYU03KfRXGek+cUPHScFLAkxe4B/4vZcLU5jTe57wVgdAkyxSeN7zTN7iAJgFXh7Y9JmwfJ8YJJUmf0EngZemriWa4F1LtIV3KdEV3pVEX3gXEkPhR5XQgh9FQhs+q4QVfBYJa/g6CbXPmAeswAPZtx1WFteaV2gkZ6dSq+kGjY4o9e+VNYBMnvD852NEApFAJBAJRAK/m8ALlHeZDLF6LwcAAAAASUVORK5CYII=");background-size:cover}#toolPanel .close:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAjZJREFUaAXtmN1KAkEUx2d0V3EpCUUQuonozleIQC0Coa7qEXqlLrrpAYIgujEoBIleIKKLPugyNSwNdtGy055kY7VNZ2fPXESzIIoze+b3++/XYRnTm05AJ6AT0AnoBP5DAks3kMyc2FsLNZhT7ZurwYzoGjHRie17Z4N9wEG3Z5/n65AT3S/MPAwpW7WPBj2nna/2CiL7CgukE6lTxtkVA1bo23aNWgLh27f2IQBsMoAOsxJNUoGHIn9JWFZRhYQH7wJX3M+TaRilxxXeEhHgIpP8czB5PAJ4JFAGpUQX89fxfgfBN9aSl974tO/QAliQSiIqPLJICVBIUMBHEogiQQUfWUBGghKeRCCMBDU8mYCIhAp4UoFJEqrgyQWCJHjaWoeOveeOfT+kwtznseakTfo2OqnoyHOC8VfGYNad//WEpYRHBiUCWDh7AfPQca4RHjh/N0yz3CqbdRyj3ISbuTCL4jk/PG2G8BzAGLz1d6kbQGQiFxi/YDF5FQ2gFyipwDg8dpV42qjqYlGC7Brww7tFW4ZhlP0X7MiFTdDFekeARGAavLeYConIAqLwqiQiCYSFVyEhLSALTy0hJRAVnlIitAAVPJVEKAFqeAoJYQFV8FElhARUw/8mkU5ay/g+yhsP+hZqJZ7vnB1354pr++MJG1RU9j98v2Ryq+T1Tt2+szqtlpAAi8fPOGf7JjeK/vZgWnGZ8cY6b2LyLMa3M4upY5kaeh+dgE5AJ6AT0An8mQQ+AcXxBv2nkpz+AAAAAElFTkSuQmCC")}#toolPanel .undo-disabled{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA/pJREFUaAXtmU9Ik2Ecx93cdJbEDlIQBKvoZOVBbzL8n5jdOowET4HQH8MOXZW6ehHFpAjqErJDR7P8w4QQdhiBhR2izFOHFTRkObO59fmt94Wx+bx73V5lg/eBn8//7+/3/T2/93n2PFZV2cn2gO0B2wO2B0rwgKOEuXlTV1dXT+7s7FxNp9PtSKPD4fCRn5CBlLcob5KvIysej+d1a2trNA/kgA2WEFhaWvKj9wHSh5EuMzZAIsm4eWS8u7v7nZk5+40piQCGn8PgSYD7BRyj/pK9pW2BcqSuru6r1+uNSV8sFvMmEonz9LXQd4WmXspu6SPN1dTUDLe1tX37XzX/t2gCy8vLNzDgKVKPQTFkwul0Tnd0dPw0oz4UCjWkUqk7zB9BvMyPI0NdXV2zZubrYwwJAAymI60P1nM8P0rfQ6nTH8TT94qNZ/luWJlJ8AIa3hgh9UjXVShXElhcXLyEcSEx1OVyzeBZidmqLOP3qA739PTMFFJiph99txg3hVSj1zQJJQGW+GIymfwoygH8hNxnyRuovkTE+ADGvyK3LEHiOmBBpJpwHDATTkoCa2trx6PRaDzbOkh8Z0VO03bbKs9n40tZW4nH6Iq73e7LhT5sZy6AXm9qavpN+Ydel1wzPgn42XA4nNnfs/utKItjwA+iq353d1dCyjApCcgsgPbb1lyAP4jH45/5Hm5SNsQw1K7olE0B3bL99qNDzhhlKqR8PwIZMAw/hTxjOw1HIpFjSg1FdMiOBoEJbaockMpkSAADlQQ0RAmxN83NzX+UGorskDMFEnIw9slWq4IxJKAIIcEK0zfo8/nOsGePUpZdydKkHYhyqrvk95UK3PB3C4Z9ASAzl3KCwiz5NNvbexWgle3oXgDvGnk7+QskLxkS6OzsXCHGp5m1UVtb+9zv9//KQzjEBpwVEQcijSo1hgQASDHxrmryYbfLj8Ht7W3ZDX0qXYbfgGrSUbXrv2RZAeWZU9YEzDiqrAnIHUJIEEJbKjJlTUAuQGI4IbRZkQQwvEUMZwXWK5IAhsvVUwisVBwBuXJidC/GJ+UFwxICgHpUQFa3a/dlufTPG11XTX/EnMiDe3t7H4x+WFlFQnQQ/yMa3rgRrmkCeCQA6AW5gBsBWtGnXfJlC50r9GZkmgCxKJeMOCQC2rXPClvzMARbdIgueSvKG5DTYJoAntgAdEibP6VdwHPgSqtqmJlrpOgqdB8WbaYJyGB5JQB4jGI1ErRyJTSszIuE6DDzIiE2KV8lpFOVst6GZI8uz4ctlfF6Ox4bwPgnxGv5Pi3qxqpyVqJyH3ezSWlPH/J6UFnP69kkpCwH0FH/gyPXBrtue8D2gO0B2wMH8sA/gAT1Qeh5oB4AAAAASUVORK5CYII=");background-size:cover}#toolPanel .undo{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAp1JREFUaAXtmb1LHEEYxs8oiSiIgWDtR2lsJI2FcKRIYZsqoiAIAYs0/gEe2Aip0wqWqfVIbReS1GlSXRMQIwgKgh+QPL+wLyzDLsrM7N0uzgvP7czsvM/7sTuzM3OtVpKUgZSBlIGUgYAMDAXoFqlOqXFFaAvzwrQwISAXQk/4KRwLX4RToRayLC8OhVvh7wNBX3TQHZjMynJXMKdvVD4SPghLAk/kaQbKtHGPPvQ1PThmhL7KO1m7FHDiXOgIL4SHCn3RQRcOuOCMKmVjZEdWMAo+C2TXV9CFw/jgjiILYjkTeOQjOUZz/k5tW7n20CJccBJIlCBeZmQQMnO8EVazNgy9FWILnBZE8Os0LjJ7rHb9nbXFzLybBLixx5gIHtjM0+a8XZn+Pgo2v6sYXWxMMDsFyTdpm+Pu9UT3NoUnQRaKlRnYNjsFfScsE67z+fp3GRsr9iOotSNt7PCx85Y9aeaddcu8YrvCsLeFckW+E3zseGW9p+n3Unadpv5VWBOeCVXKkcixt+Fr5HVGAMmVsC8sCv0SvkHYPvA1yAD9JGwLz31JAvRYOxHAjwCOgary7hPAn4F6EWCclSwBXJdxVDGHl9mqpL3uAUxmUV+URV/3AOYyx3tNDeBV5jir4UKp+xNgCY8c//9t2E+UpYQb86jbUGG9I26m0KDFXN6/dVV+Cd4LqzzZPWVsRFlO5+10VSEjLLGrFlvGYzOazIqJbR5BNGZL6UbPRpsAGrGpd523emOOVczhoqsFYWMiZGCja+88fFHOhIqcdts4I7IxUdujRddpt87AttmJ7LGHZRvITorNCNllSQwo08Y9+tAXHQBH8BmQOLyFow8+OH0/Xi87vPWNhCyvCG2hUX9wyN8kKQMpAykDjzED/wAOt9HUp+PK6gAAAABJRU5ErkJggg==");background-size:cover}#toolPanel .undo:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABOlJREFUaAXtWU2IW1UUPufmZ/KSUcoknYhUqIouHEdcWLqxoDA2E/82goMFdzIgpcWFiriw1YWb2UilDAri30JmIYKlJhkLFQTpQhBGZ+NPZyitNm3mh2knL5kk93jOewam8b6Xl0wYI+TB5L137z0/37nnnXPuGYDBNbDAwAIDCwwssAML4A5o/0WaLtBoXVeeBNCPAeAYAe3n++3uQtpAwGUAWgRQ34VV7JtiBq+5c93/9gTA3rx9SBO9RghZIAoHUgexjgQ5hThzfdL6PhCNYdGOAKTPVe6p1RungOAphzdiDYEKgDgf0vAjKuuP1D5Yl7nSZdhD2r63oeARBnmYADN8j7h0cDaC6lgxYy057x38+AIgIuSLTPxSufILbPEPec0wICuJ6r1YNHb6z8exZFrfOnbneUpVtipHgfQrbIA9LOcmS5ouZeNftK71ezcC2H+eYhtVe5799SH2289jYevklQlcaTIaydtvseC3nXfEuQhax7v1Z/luamTzLtKUy0+dWJ203mnKanc3AkgWygdJ04VtxGuo8MR41JpdqFbedJXHBio6tpJJzG5b1/VjsrD5Mml8n40W4t0MDMIIIP1tdbxWry/w5HXW6Cf2ocOiGb9f5ud9/NTgl6nVyfiXXWtsIBzJl59jd5oTEArwSBB3UgY+0LCiy+44Dq9kExml4Fn20d9c5XkG4eeQUgsm2p2MiUFkV4WHfF/pgn13O35GAKVH8QYTljiOW6PnKF3KJM7ccZf1IFvldd6FDfbXhxsN/ctIrjwzcoH+ifPtRAWbd1ySvysJDjXS7FL+lxGAkLhJB6BOrhUWx3CLt3QmFInfz0Qf8RKO9/Qqrpd/3VuoZP3FdDYrQYEVWJfwLDnGj9oTALvLkhCqOtyyjdcmsFjKJl5SGD7AQhaJIK21/oqjScJPUCdzTkTjsCw0kiD9aD0BILoAOBPcAuAkkUoVNp/RUHuX9+kBlzmtccKq+QnqdE5yCifEmmR3CbVe9N4AgJwdINAOAEk8yYL9xqm8fVFr+Jq3N8OJpyLuRDE8IC7mJaSbcUmITlbn0sStr8xcPOsWRaElDQ12cziYzJc/q1bs5/mjHhI2HJF+Z+Vn48PWx5cO4ZqZdQ9GuSThgPG0WxzCJyaOngD0bUM/4E17k6PBuPyx2po/7DMhUKeLmaF5rxLDJKTbMamn6g4xjnnx8AQgoXQ0V36igTBNqJajGj69mrWWhRGH0l25pBgEXWYnkLLcfO2WLmbpbUbHFin616VylU22tZqNO+7bSuL5Ebcu7Nf3vgYgZwjXcLThZcC+BiAHIFG8WRWYQPQ1AOf05mgt52jz1dcAOAc4Zbw0Aczq84zXxH89LpnfOTfz4V86GF76dARAjppejHo97p6XKcIZP+d3XA0MIJm3X7xRtRf8CqtegXBkyGGfL2m7+PENDICLuikuKe5zDuB+HHsw5x7yOYQinG3XMwoMIBIOHZfWB39YU3IA74GeRhYOb5YhsqRXZFy0bTAwgOJE7CL747TQSvfAOYBvY9SLR+HpdiY49rOsII2uwABEQadLwC0PhhDiCmuulzvhWt7tSEhbJUhHQnTqqpjr+8aWIGt3pfL2ES5zP5DuAZuhv1qL7ZRvzvd9c7epaLv7/7a93gpMEtBu/4OjVYfB+8ACAwsMLDCwQEcW+BshWTaR4gPCwwAAAABJRU5ErkJggg==")}#toolPanel .confirm{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAN5JREFUaAXtmE0KwjAQhXsuvUZBxIU9RN17WZfeQNE3iwEXSqJmknnwAkMaOovvfSn9myYNGZABGZABGZABGagxMKNpX9OYsecEqAfqmhGuxOTwdzQeS83Zzq8AMvMGv6CoBjX862WzUGkHrOBH7ZjMu3l74h180WFubv4CaLv3nhnhjXmHuqGiQzQ3b/A+okOEwkeH6AIfFaIrfOsQQ+BbhRgK/2+IFPC/hkgF/22IlPC1IVLDl0JQwH8KQQX/LgTtB7i/O1H+PfCd2OBg6wvNMiADMiADMiADMkBg4Akg3m3A8SMAAwAAAABJRU5ErkJggg==");background-size:cover}#toolPanel .confirm:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAWBJREFUaAXtmDtOw0AQhmcCDa0xOQycgB4JIRokboCgBlo6JA5AQSoOsFruROlNQ3bZAQWCoyTY+/BG+t1Efmjn+z+vPesQYYMBGIABGIABGICBjQYqbU5qZc7aF47aB0rc9+A3ZN2rZffU5tttHyhtX+AtuQcitsx8VRrfWp5am+tKNa5SZravphdrLy7t5HbD+2mzveYBP9DDIG8bTBuR/9Xx9PQ8140INb/UidnRo7X2pVbNXeoQf5oU8eX78d5z15pLAUZMvtvxzBLdpgwRA35l2ANtTn33+5CHKkWI0GmzEnzxRKoQWeDnQWKHyAofO8Qg8LFCDAofGqII+L4hioLvGqJI+P+GKBp+U4jc8DwH6vMrfcKvOSZEbsevSe79EqT5+QDvubbpyhEUQIothvgu7v89yAQv9YIDyCC/IYhzwkvtaNtYm8PxmzmKNiAGggEYgAEYgAEYgIH0Bj4BteBmoOo+DxkAAAAASUVORK5CYII=")}.__screenshot-lock-scroll{height:100%!important;margin:0;overflow:hidden!important}.ico-panel{border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #fff;height:0;left:23px;position:absolute;top:0;transform:rotate(180deg);width:0;z-index:9999}.ico-panel img{height:100%;width:100%}#optionPanel{background:#fff;border-radius:5px;box-sizing:content-box;height:20px;left:0;padding:10px;position:absolute;top:6px;z-index:9999}#optionPanel .text-size-panel{align-items:center;border:1px solid #bebfca;border-radius:3px;cursor:pointer;display:flex;float:left;font-size:14px;height:20px;justify-content:center;overflow:hidden;width:65px}#optionPanel .text-select-panel{background:#fff;border:1px solid #d8dcea;border-radius:3px;display:flex;flex-wrap:wrap;justify-content:center;left:10px;position:absolute;top:-321px;width:65px}#optionPanel .text-select-panel .text-item{cursor:pointer;font-size:14px;height:20px;margin-bottom:5px;text-align:center;width:45px}#optionPanel .text-select-panel .text-item:hover{background:#bebfca}#optionPanel .text-select-panel .text-item:first-child{margin-top:5px}#optionPanel .brush-select-panel{float:left;height:20px}#optionPanel .brush-select-panel .item-panel{float:left;height:20px;margin-right:18px;width:20px}#optionPanel .brush-select-panel .item-panel:first-child{margin-left:2px}#optionPanel .brush-select-panel .item-panel:last-child{margin-right:0}#optionPanel .brush-select-panel .brush-small{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKlJREFUeNrs18EKgkAUhWEnwmW1amObHqKeo0ftOfIh3OSmlba0xXSEK4SICAoz4X/gINwL8sE4C533Pok5myTyAAQIECBAgAAB/jdwO/cFO3dsH3v1qmY2LtWHWr/9KyxQOag3Nf2ZnQ17V6vQR3zp4bqktgv+DWYjuxO3eELKkd0zBmCuNgPzxnbBgZXd1kL9WIslbnAbx38xQIAAAQIECBDgqoFfAQYAhLQbgzDvXkAAAAAASUVORK5CYII=");background-size:cover}#optionPanel .brush-select-panel .brush-small-active,#optionPanel .brush-select-panel .brush-small:active,#optionPanel .brush-select-panel .brush-small:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALhJREFUeNpi/P//P8NgBkwMgxyMOnDUgaMOHHXgqANHHTjqwFEHDm0HslBqAB+jGIhSBeIOIHaBCu8B4gogvv3p/yuKzGektMEKdKA6kDoBxAJoUh+A2ALowJsDHcVtWBzHABVro9RwaoTgRxCFQ/oLMAR5R3MxAbAHj9yuweDAamiGYMCSSaoHgwNvgHIrEK8D4s9QvA4qdmPAM8loVTfqwFEHjjpw1IGjDhx14KgDRx04pB0IEGAAHeMoHW2kl/cAAAAASUVORK5CYII=")}#optionPanel .brush-select-panel .brush-medium{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAS9JREFUeNrs2EsLgkAQB/BWupQQHXpczbp36/EB6ptH1M2D17RLhx6XQG9lszCBxEa5zoTQDPxvjv52RR1UWZbVqlxOreIlQAEKUID/Dqx/e2BL9d4t0MP0IS7kBkkgZ0iMub82XrMjLdBQGjXTdgO6jRlpC2QDiX51ixVkClkacMbNhyywR/0COIGMLfrG2MsK9C1xeaTPBdTHzgkezHmR6zoFd88lAOpzDDmAHuHrzeMA9giBXQ5ggxDY5ADeq/4tTgmvm3IAL4TAEwcwJgTGHMAdTillK8FzsTwkawLgGkcylm+xXnlQAhcU2T3baWYLCS36QuzlmahzpX/mrCAHnPE+zYRXhO1strzMRK0n5D0OEQNIJzdMPEf+CGHWL3klf7cEKEABClCApeohwADD8zb9WRTsHgAAAABJRU5ErkJggg==");background-size:cover}#optionPanel .brush-select-panel .brush-medium-active,#optionPanel .brush-select-panel .brush-medium:active,#optionPanel .brush-select-panel .brush-medium:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU9JREFUeNpi/P//P8NgBkwMgxyMOnDUgaMOHHXgSHcgC7EK+RjFsAmzAXEAFFsCsRQQ/wLiJ0B8HojXA/FGqBgK+PT/FVH2MhJb1WFxYCAQdwGxCgGtd4C4HIjXkeNAcqKYGYg7oRaqEKEepGYtVA8zzaIYCbQBcRkZ+mB6ymmZSULIdByyI0NI0UBKGgRliLtALENhxnwKxErANPiL2iEYSgXHgYA0EIfRIooDqFi8BdDCgaZUdKAJLRwoQUUHStLCgb8YBgCQ4sDnVLT3OS0ceImKDjxDCwduoKIDN9DCgauhrRRKwVOoWTTJJEVUcGAhEP+kVV0M8nk3BY7rJiX0yG1uVQLxFDL0TYXqpXmT/y8Q50JbJXeIUH8HWo/nQPWSBChpUcOa/KHQ1rUxtCEAywhnoU3+1XRp8o/26kYdOOrAUQeOOnDUgVgBQIABAPYuSgtJpajwAAAAAElFTkSuQmCC")}#optionPanel .brush-select-panel .brush-big{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAaNJREFUeNrcmMFKw0AQhpOqRdGUCloD2lMv1T6B6RMI4sOK4BM0b1Clh56skFahpVaUaln/wBQkzKYmTbJTB75TSPJlN7uzM7ZSypIc9sYIVuxa0nsdUAcuqIIDUKZrczADExCAJ/CW5OFTNUolaIMGaIGThB80BF3QByoPwVPQptFaJ8JR7YDnrAS3gAfOM/69HoEPFusI7oIrcJzTGngB9+AzjWAod5PBlP5lym+jkqsEt8E1qBW0m4Q2d+A7KljS3OAVKGfRuzzuQkmzWpsG9uQmvTtW0KatxFS0yUEr2ChgUcRFlRy0ghcC0m9LJ+hQXjUdYQqtcIJ1QYeYM07QFSTocoKHggSrnOC+IEGHEywLEtyJyySi4rfgXJDXFyf4LkhwxgmOBQmOOcFAkGDACQ4ECQ44wamQURySC7vNPAgQ7MYdt/pUxJiKCTloBRUV1abCj3YduEwSVvw9A3I9bqHqUl2HSsGiYqSbuY0t3JexR62Po5zkXqn18ZG2N7PsMlxaQptH0TrBs7Jpv/mrMte/bGByx/LiWsBSQ7zgjwADAPqYqQ1c9nN+AAAAAElFTkSuQmCC");background-size:cover}#optionPanel .brush-select-panel .brush-big-active,#optionPanel .brush-select-panel .brush-big:active,#optionPanel .brush-select-panel .brush-big:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhRJREFUeNrUmLtPAkEQh+/UghCxw06JNuCjJURBK+OjsNVEW4KF6P+iYKGF9rYWhmClKKGg8wGNRu2kA4M25PyNGRKFPb0Fjlsm+SKG3MyXLLezs7phGJrK0acpHgP1D0P6sOyzY2AJRMAE8AEPf1cBz+ABZEAKPMkkLxtv33/1+hJbFOwHayAOZuh5i/WoSBYkwSmo2SG4ABIg0OaqFcAOuLAiaOU36AKHIN0BOY1zpDmnq92XxAsuQcyG33+Mc3tbFaQHr0DQxpc0yDW8soJucAb8XdhJ/FzLLSO4B0Jd3O5CXNOSIL2tUQf25CjX/lOQ/t93sHEkeK81FVznruBUBLgRmApuK9B+42aC1FtnFRCkFjouElyW6K12hs6HkCbBsEKnrLBIcEohwUmR4IhCgj6RoEchwcGeOfL/FKwo5PUuEnxVSPBFJHivkOCdSDCjkOC1SDDF05fTYbBLk+AjuFFAMMsuwm3mQAHB5K/G3DAX02HxtkPjZasz8zQN9mZzcY2Haqdit/HWQdRJaOI/cUDumAd6S1MdnWpzXZTLma2cmWAVrIJiF+SKXKsqe7NQAvMgb6NcnmuUWrn6oKBXaQ4c2SBHOSNcQ2tVkOIDbIHFDi15kXNRzk+Z49Z/keaxYIN3e9m2SM9sco605QlK8oZVaxhTV3iZaGMfpTT8XZmPTAU+hJxr7V4B98KJWsn4EmAAKPJ2SXt/mW0AAAAASUVORK5CYII=")}#optionPanel .right-panel{align-items:center;display:flex;float:left;margin-left:39px}#optionPanel .right-panel .color-panel{background:#fff;border:1px solid #e5e6e5;border-radius:5px;display:flex;flex-wrap:wrap;justify-content:center;position:absolute;right:28px;top:-225px;width:72px}#optionPanel .right-panel .color-panel .color-item{height:20px;margin-bottom:5px;width:62px}#optionPanel .right-panel .color-panel .color-item:first-child{background:#f53440;margin-top:5px}#optionPanel .right-panel .color-panel .color-item:nth-child(2){background:#f65e95}#optionPanel .right-panel .color-panel .color-item:nth-child(3){background:#d254cf}#optionPanel .right-panel .color-panel .color-item:nth-child(4){background:#12a9d7}#optionPanel .right-panel .color-panel .color-item:nth-child(5){background:#30a345}#optionPanel .right-panel .color-panel .color-item:nth-child(6){background:#facf50}#optionPanel .right-panel .color-panel .color-item:nth-child(7){background:#f66632}#optionPanel .right-panel .color-panel .color-item:nth-child(8){background:#989998}#optionPanel .right-panel .color-panel .color-item:nth-child(9){background:#000}#optionPanel .right-panel .color-panel .color-item:nth-child(10){background:#feffff;border:1px solid #e5e6e5}#optionPanel .right-panel .color-select-panel{background:#f53340;border:1px solid #e5e6e5;height:20px;width:62px}#optionPanel .right-panel .color-select-panel.text-select-status{margin-left:31px}#optionPanel .right-panel .pull-down-arrow{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAQCAYAAAABOs/SAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANNJREFUeNq01TEKwjAUxvHXOAhKJ3Fwc9PVzbWipxCdHLyMV9AD6A2EegRdvYBOnd3E70ELIcT2JU0C/1BI4AeB8pKUhlMiOqAtKijuGqEj2ne61D/jY1V2QZ+IaI7maKywrdETzdAVDSKi/Lp3tGP4hRYRcRPlly1Uech4FgG3onygtEvvwDijNxtqwiHxCp3YUBscAm9E/8FtcBFaB/vgYrQJdsGdUAkswZ1RKVyH6+hDivJKMCTa/CY9DV26DBlX2MTJB/WFK/yEvmjjM05/AgwANuZSRB8r5twAAAAASUVORK5CYII=");background-size:cover;height:8px;margin-left:10px;width:15px}#cutBoxSizePanel{align-items:center;background:rgba(0,0,0,.4);border-radius:3px;color:#fff;display:flex;font-size:14px;height:25px;justify-content:center;left:0;position:absolute;top:0;width:85px;z-index:9999}#textInputPanel{border:none;box-sizing:border-box;font-weight:700;left:0;margin:0;min-height:20px;min-width:20px;outline:none;padding:0;position:fixed;top:0;z-index:9999}.hidden-screen-shot-scroll{height:100vh;overflow:hidden;width:100vw}.no-cursor *{cursor:none}');
  var wi = "close", fi = "confirm", pi = "undo", Ci = function() {
    function A2(A3, e2) {
      var t2 = this;
      this.toolController = null, document.getElementById("textInputPanel"), this.toolController = e2, A3.tabIndex = 9999, Gn.keyboardEventHandler && document.body.removeEventListener("keydown", Gn.keyboardEventHandler), this.onKeyDown = function(A4) {
        var e3;
        "Escape" === A4.code && t2.triggerEvent(wi), "Enter" === A4.code && t2.triggerEvent(fi), (A4.metaKey || A4.ctrlKey) && "KeyZ" === A4.code && t2.triggerEvent(pi), ("Delete" === A4.key || "Backspace" === A4.key && !A4.metaKey && !A4.ctrlKey && !A4.altKey) && null != (e3 = Gr.activeElementId) && (Gr.removeElement(e3), Gr.updateActiveElementId(null), Gr.updateRectOperateIndex(null), ro(), Gr.redrawCanvasElements(), Wr());
      }, document.body.addEventListener("keydown", this.onKeyDown), Gn.setKeyboardEventHandler(this.onKeyDown);
    }
    return A2.prototype.triggerEvent = function(A3) {
      if (null != this.toolController) for (var e2 = 0; e2 < this.toolController.childNodes.length; e2++) {
        var t2 = this.toolController.childNodes[e2];
        t2.getAttribute("data-title") === A3 && t2.click();
      }
    }, A2;
  }(), Qi = Object.prototype.hasOwnProperty;
  function vi(A2, e2) {
    null != A2 && e2.forEach(function(e3) {
      var t2 = e3.keys, n2 = void 0 === t2 ? [] : t2, r2 = e3.always, o2 = void 0 !== r2 && r2, i2 = e3.when, s2 = e3.apply, a2 = n2.length > 0 && n2.some(function(e4) {
        return Qi.call(A2, e4);
      }), l2 = null != i2 ? i2(A2) : a2;
      (o2 || l2) && s2(A2);
    });
  }
  var Ui = [{ keys: ["enableWebRtc"], apply: function(A2) {
    false === A2.enableWebRtc && Hn.setWebRtcStatus(false);
  } }, { keys: ["screenFlow"], apply: function(A2) {
    A2.screenFlow instanceof MediaStream && Hn.setScreenFlow(A2.screenFlow);
  } }, { keys: ["capture"], apply: function(A2) {
    var e2, t2, n2, r2, o2;
    "snapdom" === (null === (e2 = A2.capture) || void 0 === e2 ? void 0 : e2.source) ? Hn.setDomRenderEngine("snapdom") : "dom" === (null === (t2 = A2.capture) || void 0 === t2 ? void 0 : t2.source) && Hn.setDomRenderEngine("html2canvas"), (null === (n2 = A2.capture) || void 0 === n2 ? void 0 : n2.snapdom) && Hn.setSnapDomRenderer(A2.capture.snapdom), (null === (r2 = A2.capture) || void 0 === r2 ? void 0 : r2.snapdomOptions) && Hn.setSnapDomOptions(A2.capture.snapdomOptions), (null === (o2 = A2.capture) || void 0 === o2 ? void 0 : o2.cursor) && Hn.setCaptureCursor(A2.capture.cursor);
  } }, { keys: ["menuBarHeight"], apply: function(A2) {
    "number" == typeof A2.menuBarHeight && Hn.setMenuBarHeight(A2.menuBarHeight);
  } }, { keys: ["canvasWidth", "canvasHeight"], when: function(A2) {
    return Boolean(A2.canvasWidth && A2.canvasHeight);
  }, apply: function(A2) {
    Hn.setCanvasSize(A2.canvasWidth, A2.canvasHeight);
  } }, { keys: ["showScreenData"], apply: function(A2) {
    A2.showScreenData && Hn.setShowScreenDataStatus(true);
  } }, { keys: ["maskColor"], apply: function(A2) {
    A2.maskColor && "object" == typeof A2.maskColor && Hn.setMaskColor(A2.maskColor);
  } }, { keys: ["writeBase64"], apply: function(A2) {
    false === A2.writeBase64 && Hn.setWriteImgState(false);
  } }, { keys: ["exportOptions"], apply: function(A2) {
    A2.exportOptions && Hn.setExportOptions(A2.exportOptions);
  } }, { keys: ["screenShotDom"], apply: function(A2) {
    A2.screenShotDom && Hn.setScreenShotDom(A2.screenShotDom);
  } }, { keys: ["cutBoxBdColor"], apply: function(A2) {
    A2.cutBoxBdColor && Hn.setCutBoxBdColor(A2.cutBoxBdColor);
  } }, { keys: ["saveCallback"], apply: function(A2) {
    "function" == typeof A2.saveCallback && Hn.setSaveCallback(A2.saveCallback);
  } }, { keys: ["maxUndoNum"], apply: function(A2) {
    void 0 !== A2.maxUndoNum && Hn.setMaxUndoNum(A2.maxUndoNum);
  } }, { keys: ["useRatioArrow"], apply: function(A2) {
    A2.useRatioArrow && Hn.setRatioArrow(A2.useRatioArrow);
  } }, { keys: ["imgAutoFit"], apply: function(A2) {
    A2.imgAutoFit && Hn.setImgAutoFit(A2.imgAutoFit);
  } }, { keys: ["useCustomImgSize", "customImgSize"], when: function(A2) {
    return Boolean(A2.useCustomImgSize && A2.customImgSize);
  }, apply: function(A2) {
    Hn.setUseCustomImgSize(Boolean(A2.useCustomImgSize), A2.customImgSize);
  } }, { keys: ["saveImgTitle"], apply: function(A2) {
    A2.saveImgTitle && Hn.setSaveImgTitle(A2.saveImgTitle);
  } }, { keys: ["destroyContainer"], apply: function(A2) {
    false === A2.destroyContainer && Hn.setDestroyContainerState(false);
  } }, { keys: ["userToolbar"], apply: function(A2) {
    Array.isArray(A2.userToolbar) && Hn.setUserToolbar(A2.userToolbar);
  } }, { keys: ["h2cImgLoadErrCallback"], apply: function(A2) {
    A2.h2cImgLoadErrCallback && Hn.setH2cCrossImgLoadErrFn(A2.h2cImgLoadErrCallback);
  } }, { keys: ["canvasEvents"], apply: function(A2) {
    A2.canvasEvents && Hn.setCanvasEvents(A2.canvasEvents);
  } }, { keys: ["customElementAdapters"], apply: function(A2) {
    Array.isArray(A2.customElementAdapters) && Hn.setCustomElementAdapters(A2.customElementAdapters);
  } }, { keys: ["canvasElements"], apply: function(A2) {
    Array.isArray(A2.canvasElements) && Hn.setCanvasElements(A2.canvasElements);
  } }, { keys: ["x", "y"], always: true, apply: function(A2) {
    var e2, t2;
    Hn.setRenderOptions({ x: null !== (e2 = A2.x) && void 0 !== e2 ? e2 : 0, y: null !== (t2 = A2.y) && void 0 !== t2 ? t2 : 0 });
  } }];
  var mi = ["enableWebRtc", "screenFlow", "imgSrc", "wrcWindowMode"], Fi = function(A2) {
    return "undefined" != typeof MediaStream && A2 instanceof MediaStream;
  }, yi = function(A2) {
    return mi.filter(function(e2) {
      return function(A3, e3) {
        return Object.prototype.hasOwnProperty.call(A3, e3);
      }(A2, e2);
    });
  }, Ei = function(e2) {
    var t2, n2 = A({}, e2), r2 = yi(e2), o2 = e2.capture;
    if (null == o2) return 0 !== (t2 = r2).length && console.warn("[js-web-screen-shot] ".concat(t2.join(", "), " 已被标记为废弃参数，请尽量改用 capture 配置；这些旧参数将在后续版本中移除。")), n2;
    !function(A2) {
      0 !== A2.length && console.warn("[js-web-screen-shot] 检测到同时传入 capture 与旧参数 ".concat(A2.join(", "), "；当前已优先使用 capture，旧参数将在后续版本中移除。"));
    }(r2), null != o2.render && (n2.wrcWindowMode = "window-frame" === o2.render);
    var i2 = function(A2) {
      return null != A2.source ? A2.source : Fi(A2.stream) ? "injected-stream" : "string" == typeof A2.imageSrc && "" !== A2.imageSrc.trim() ? "image" : null;
    }(o2);
    return null == i2 || function(A2, e3, t3) {
      switch (t3) {
        case "display-media":
          return A2.enableWebRtc = true, A2.screenFlow = void 0, void (A2.imgSrc = void 0);
        case "dom":
        case "snapdom":
          return A2.enableWebRtc = false, A2.screenFlow = void 0, void (A2.imgSrc = void 0);
        case "image":
          if ("string" != typeof e3.imageSrc || "" === e3.imageSrc.trim()) throw new Error('capture.source 为 "image" 时，必须同时传入非空的 capture.imageSrc。');
          return A2.enableWebRtc = false, A2.imgSrc = e3.imageSrc, void (A2.screenFlow = void 0);
        case "injected-stream":
          if (!Fi(e3.stream)) throw new Error('capture.source 为 "injected-stream" 时，必须同时传入 capture.stream。');
          A2.enableWebRtc = true, A2.screenFlow = e3.stream, A2.imgSrc = void 0;
      }
    }(n2, o2, i2), n2;
  }, bi = Object.freeze(["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]);
  function Ii() {
    var A2 = Tr();
    if (!Pr() || null == A2) return false;
    var e2 = "maxTouchPoints" in A2 && A2.maxTouchPoints > 0, t2 = "msMaxTouchPoints" in A2 && A2.msMaxTouchPoints > 0, n2 = "ontouchstart" in window, r2 = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return e2 || t2 || n2 || r2;
  }
  var Hi = [{ keys: ["clickCutFullScreen"], always: true, apply: function(A2) {
    Hn.setClickCutFullScreenStatus(Boolean(A2.clickCutFullScreen));
  } }, { keys: ["loadCrossImg"], always: true, apply: function(A2) {
    Hn.setLoadCrossImg(Boolean(A2.loadCrossImg));
  } }, { keys: ["imgSrc"], apply: function(A2) {
    null != A2.imgSrc && Hn.setImgSrc(A2.imgSrc);
  } }, { keys: ["proxyUrl"], apply: function(A2) {
    A2.proxyUrl && Hn.setProxyUrl(A2.proxyUrl);
  } }, { keys: ["useCORS"], apply: function(A2) {
    void 0 !== A2.useCORS && Hn.setUseCORS(A2.useCORS);
  } }, { keys: ["h2cIgnoreElementsCallback"], apply: function(A2) {
    A2.h2cIgnoreElementsCallback && Hn.setH2cIgnoreElementsFn(A2.h2cIgnoreElementsCallback);
  } }, { keys: ["position"], apply: function(A2) {
    A2.position && xi(A2.position);
  } }, { keys: ["wrcReplyTime"], apply: function(A2) {
    A2.wrcReplyTime && Hn.setWrcReplyTime(A2.wrcReplyTime);
  } }, { keys: ["cropBoxInfo"], apply: function(A2) {
    A2.cropBoxInfo && Hn.setCropBoxInfo(A2.cropBoxInfo);
  } }, { keys: ["toolPosition"], apply: function(A2) {
    A2.toolPosition && Hn.setToolPosition(A2.toolPosition);
  } }, { keys: ["wrcImgPosition"], apply: function(A2) {
    A2.wrcImgPosition && Ki(A2.wrcImgPosition);
  } }, { keys: ["hiddenScrollBar"], apply: function(A2) {
    A2.hiddenScrollBar && Si(A2.hiddenScrollBar);
  } }, { keys: ["noScroll"], apply: function(A2) {
    Gn.setNoScrollStatus(A2.noScroll);
  } }, { keys: ["wrcWindowMode"], apply: function(A2) {
    null != A2.wrcWindowMode && Hn.setWrcWindowMode(A2.wrcWindowMode);
  } }, { keys: ["customRightClickEvent"], apply: function(A2) {
    null != A2.customRightClickEvent && Hn.setCustomRightClickEvent(A2.customRightClickEvent);
  } }];
  var Si = function(A2) {
    var e2 = A2.state, t2 = A2.color, n2 = void 0 === t2 ? "#000000" : t2, r2 = A2.fillWidth, o2 = void 0 === r2 ? 0 : r2, i2 = A2.fillHeight, s2 = void 0 === i2 ? 0 : i2, a2 = A2.fillState, l2 = void 0 !== a2 && a2;
    Hn.setHiddenScrollBar({ state: e2, color: n2, fillWidth: o2, fillHeight: s2, fillState: l2 }), e2 && (Gn.setResetScrollbarState(true), document.documentElement.classList.add("hidden-screen-shot-scroll"), document.body.classList.add("hidden-screen-shot-scroll"));
  }, xi = function(A2) {
    var e2 = A2.top, t2 = A2.left;
    null == e2 && null == t2 || Hn.setPosition({ top: null != e2 ? e2 : 0, left: null != t2 ? t2 : 0 });
  }, Ki = function(A2) {
    var e2 = A2.x, t2 = A2.y;
    Hn.setWrcImgPosition({ x: -Math.abs(e2), y: -Math.abs(t2), w: 0, h: 0 });
  };
  function Di(A2, e2, t2) {
    return !(A2 < t2.startX || e2 < t2.startY || A2 > t2.startX + t2.width || e2 > t2.startY + t2.height);
  }
  var Li = function(A2) {
    var e2 = A2.controller, t2 = A2.canvasContext, n2 = A2.persistText, r2 = void 0 === n2 || n2, o2 = e2.innerText, i2 = to(o2), s2 = Gr.editingTextElementId;
    if (!r2) return null != Gr.pendingEditingTextElement ? io() : (oo(), Gr.updateEditingTextElementId(null), Gr.updatePendingEditingTextElement(null)), e2.innerHTML = "", void _r.setTextStatus(false);
    if (oo(), i2) null != s2 && Wr();
    else {
      var a2 = Gr.textInputPosition, l2 = a2.mouseX, c2 = a2.mouseY;
      rr(o2, l2, c2, Jr.selectedColor, Jr.fontSize, t2), Bo({ text: o2, mouseX: l2, mouseY: c2, color: Jr.selectedColor, fontSize: Jr.fontSize, context: t2 }), Wr(), _r.setTextStatus(false), Gr.updatePendingEditingTextElement(null);
    }
    e2.innerHTML = "";
  }, Oi = function(A2, e2, t2, n2, r2) {
    if (void 0 === r2 && (r2 = 60), null != Xr.toolController && null != Gn.screenShotController) {
      var o2 = function(A3, e3, t3, n3, r3) {
        var o3 = (A3.width - e3) / 2 + (A3.startX - r3.left);
        "left" === n3 && (o3 = A3.startX), "right" === n3 && (o3 = A3.startX + A3.width - e3), o3 < 0 && (o3 = 0), o3 + e3 > t3 && (o3 = t3 - e3);
        var i3 = A3.startY + A3.height + 10;
        return (A3.width < 0 && A3.height < 0 || A3.width > 0 && A3.height < 0) && (i3 = A3.startY + 10), { mouseX: o3, mouseY: i3 -= r3.top };
      }(A2, Xr.toolController.offsetWidth, Gn.screenShotController.width / e2, t2, Hn.position), i2 = ki(Gn.screenShotController, e2), s2 = function() {
        var A3, e3;
        return null !== (e3 = null === (A3 = Xr.toolController) || void 0 === A3 ? void 0 : A3.offsetHeight) && void 0 !== e3 ? e3 : 46;
      }(), a2 = function(A3) {
        var e3, t3 = (null === (e3 = Xr.optionController) || void 0 === e3 ? void 0 : e3.offsetHeight) || 40;
        return A3 + 6 + t3;
      }(s2), l2 = function(A3, e3, t3, n3, r3, o3) {
        if (A3 + r3 <= t3) return { y: A3, anchor: "below" };
        var i3 = e3.startY - n3 - 10, s3 = r3 - n3;
        i3 - s3 < 0 && (i3 = Math.max(s3, t3 - o3));
        return { y: i3, anchor: "above" };
      }(o2.mouseY, A2, i2, s2, a2, r2);
      o2.mouseY = l2.y;
      var c2 = l2.anchor;
      if ("above" === c2 && Nn.setCutBoxSizeStatus(false), n2) {
        var u2 = ki(Gn.screenShotController, e2), B2 = (A2.width - Xr.toolController.offsetWidth) / 2;
        o2.mouseY = u2 - r2, o2.mouseX = B2, c2 = "above";
      }
      Jr.setToolInfo(o2.mouseX + Hn.position.left, o2.mouseY + Hn.position.top), Jr.setToolVerticalAnchor(c2), Nn.setCutBoxSizePosition(A2.startX, A2.startY - 35), Nn.setCutBoxSize(A2.width, A2.height), Gr.updateFullScreenStatus(false);
    }
  };
  function ki(A2, e2) {
    var t2 = A2.clientHeight || parseFloat(A2.style.height) || A2.height / e2;
    return Math.max(0, t2 - Hn.menuBarHeight);
  }
  var Mi = [{ option: lo.Move, index: co.Move, x: function(A2) {
    return A2.startX + A2.halfBorderSize;
  }, y: function(A2) {
    return A2.startY + A2.halfBorderSize;
  }, width: function(A2) {
    return A2.innerWidth;
  }, height: function(A2) {
    return A2.innerHeight;
  } }, { option: lo.North, index: co.VerticalResize, x: function(A2) {
    return A2.startX + A2.halfBorderSize;
  }, y: function(A2) {
    return A2.startY;
  }, width: function(A2) {
    return A2.innerWidth;
  }, height: function(A2) {
    return A2.halfBorderSize;
  } }, { option: lo.North, index: co.VerticalResize, x: function(A2) {
    return A2.centerX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.startY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.borderSize;
  }, height: function(A2) {
    return A2.halfBorderSize;
  } }, { option: lo.South, index: co.VerticalResize, x: function(A2) {
    return A2.startX + A2.halfBorderSize;
  }, y: function(A2) {
    return A2.endY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.innerWidth;
  }, height: function(A2) {
    return A2.halfBorderSize;
  } }, { option: lo.South, index: co.VerticalResize, x: function(A2) {
    return A2.centerX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.endY;
  }, width: function(A2) {
    return A2.borderSize;
  }, height: function(A2) {
    return A2.halfBorderSize;
  } }, { option: lo.West, index: co.HorizontalResize, x: function(A2) {
    return A2.startX;
  }, y: function(A2) {
    return A2.startY + A2.halfBorderSize;
  }, width: function(A2) {
    return A2.halfBorderSize;
  }, height: function(A2) {
    return A2.innerHeight;
  } }, { option: lo.West, index: co.HorizontalResize, x: function(A2) {
    return A2.startX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.centerY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.halfBorderSize;
  }, height: function(A2) {
    return A2.borderSize;
  } }, { option: lo.East, index: co.HorizontalResize, x: function(A2) {
    return A2.endX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.startY + A2.halfBorderSize;
  }, width: function(A2) {
    return A2.halfBorderSize;
  }, height: function(A2) {
    return A2.innerHeight;
  } }, { option: lo.East, index: co.HorizontalResize, x: function(A2) {
    return A2.endX;
  }, y: function(A2) {
    return A2.centerY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.halfBorderSize;
  }, height: function(A2) {
    return A2.borderSize;
  } }, { option: lo.NorthWest, index: co.DiagonalResizeA, x: function(A2) {
    return A2.startX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.startY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.borderSize;
  }, height: function(A2) {
    return A2.borderSize;
  } }, { option: lo.SouthEast, index: co.DiagonalResizeA, x: function(A2) {
    return A2.endX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.endY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.borderSize;
  }, height: function(A2) {
    return A2.borderSize;
  } }, { option: lo.NorthEast, index: co.DiagonalResizeB, x: function(A2) {
    return A2.endX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.startY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.borderSize;
  }, height: function(A2) {
    return A2.borderSize;
  } }, { option: lo.SouthWest, index: co.DiagonalResizeB, x: function(A2) {
    return A2.startX - A2.halfBorderSize;
  }, y: function(A2) {
    return A2.endY - A2.halfBorderSize;
  }, width: function(A2) {
    return A2.borderSize;
  }, height: function(A2) {
    return A2.borderSize;
  } }];
  function Pi(A2, e2) {
    var t2 = e2.startX, n2 = e2.startY, r2 = e2.width, o2 = e2.height;
    if (A2 <= 0 || r2 <= 0 || o2 <= 0) return [];
    var i2 = { startX: t2, startY: n2, width: r2, height: o2, endX: t2 + r2, endY: n2 + o2, centerX: t2 + r2 / 2, centerY: n2 + o2 / 2, halfBorderSize: A2 / 2, innerWidth: Math.max(r2 - A2, 0), innerHeight: Math.max(o2 - A2, 0), borderSize: A2 };
    return Mi.map(function(A3) {
      return { x: A3.x(i2), y: A3.y(i2), width: A3.width(i2), height: A3.height(i2), index: A3.index, option: A3.option };
    });
  }
  var Ti = function(A2, e2, t2, n2) {
    null != A2 && A2({ code: 0, msg: "截图加载完成" }), Xn.updateScreenShotCanvas(e2), Xn.setImageController(t2), function(A3, e3) {
      var t3 = Hn.getCanvasSize(), n3 = no(), r2 = n3.maxWidth, o2 = n3.maxHeight;
      A3.clearRect(0, 0, r2, o2), null != e3 && Hn.showScreenData && (0 !== t3.canvasWidth && 0 !== t3.canvasHeight ? A3.drawImage(e3, 0, 0, t3.canvasWidth, t3.canvasHeight) : A3.drawImage(e3, 0, 0, r2, o2)), A3.save();
      var i2 = Hn.maskColor;
      A3.fillStyle = Yn, i2 && (A3.fillStyle = "rgba(".concat(i2.r, ", ").concat(i2.g, ", ").concat(i2.b, ", ").concat(i2.a, ")")), 0 !== t3.canvasWidth && 0 !== t3.canvasHeight ? A3.fillRect(0, 0, t3.canvasWidth, t3.canvasHeight) : A3.fillRect(0, 0, r2, o2), A3.restore();
    }(e2, t2), Ri(n2.mouseDownEvent, n2.mouseMoveEvent, n2.mouseUpEvent), null != Hn.cropBoxInfo && 4 === Object.keys(Hn.cropBoxInfo).length && Gi(Hn.cropBoxInfo, t2), Xi();
  }, Ri = function(A2, e2, t2) {
    var n2 = Gn.screenShotController;
    null != n2 && (function() {
      var A3 = Tr();
      if (null == A3) return true;
      for (var e3 = A3.userAgent, t3 = true, n3 = 0; n3 < bi.length; n3++) if (e3.indexOf(bi[n3]) > 0) {
        t3 = false;
        break;
      }
      return t3;
    }() && (n2.addEventListener("mousedown", A2), n2.addEventListener("mousemove", e2), n2.addEventListener("mouseup", t2), jr(function() {
      n2.removeEventListener("mousedown", A2), n2.removeEventListener("mousemove", e2), n2.removeEventListener("mouseup", t2);
    })), Ii() && (n2.addEventListener("touchstart", A2, false), n2.addEventListener("touchmove", e2, false), n2.addEventListener("touchend", t2, false), jr(function() {
      n2.removeEventListener("touchstart", A2, false), n2.removeEventListener("touchmove", e2, false), n2.removeEventListener("touchend", t2, false);
    })));
  }, Gi = function(A2, e2) {
    var t2 = A2.x, n2 = A2.y, r2 = A2.w, o2 = A2.h;
    null != Gn.screenShotController && (Nn.updateDrawGraphPosition(t2, n2, r2, o2), Nn.setCutOutBoxPosition(t2, n2, r2, o2), Jn(t2, n2, r2, o2, Xn.screenShotCanvas, Nn.borderSize, Gn.screenShotController, e2), Gr.updateSelectionBorderNodes(Pi(Nn.borderSize, Nn.drawGraphPosition)), Gn.setCursorStyle("move"), Jr.setToolStatus(true), Nn.setCutBoxSizeStatus(true), null != Xr.toolController && Oi(Nn.drawGraphPosition, Gr.dpr, Hn.toolPosition, Gr.getFullScreenStatus));
  }, Vi = function(A2, e2) {
    Gn.noScrollStatus && document.body.classList.add("__screenshot-lock-scroll"), Gn.updateScreenShotControllerSize(A2, e2);
  }, Ni = function(A2, e2) {
    var t2 = xn(A2, e2), n2 = t2.left, r2 = t2.top;
    Gn.updateScreenShotPosition(n2, r2);
  }, Xi = function() {
    var A2 = Hn.getCanvasElements();
    0 !== A2.length && null != Xn.screenShotCanvas && null != Gn.screenShotController && (Gr.replaceCanvasElements(A2), Gr.redrawCanvasElements(), Wr());
  }, _i = { exports: {} };
  _i.exports = function() {
    var A2 = function(e3, t3) {
      return A2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(A3, e4) {
        A3.__proto__ = e4;
      } || function(A3, e4) {
        for (var t4 in e4) Object.prototype.hasOwnProperty.call(e4, t4) && (A3[t4] = e4[t4]);
      }, A2(e3, t3);
    };
    function e2(e3, t3) {
      if ("function" != typeof t3 && null !== t3) throw new TypeError("Class extends value " + String(t3) + " is not a constructor or null");
      function n3() {
        this.constructor = e3;
      }
      A2(e3, t3), e3.prototype = null === t3 ? Object.create(t3) : (n3.prototype = t3.prototype, new n3());
    }
    var t2 = function() {
      return t2 = Object.assign || function(A3) {
        for (var e3, t3 = 1, n3 = arguments.length; t3 < n3; t3++) for (var r3 in e3 = arguments[t3]) Object.prototype.hasOwnProperty.call(e3, r3) && (A3[r3] = e3[r3]);
        return A3;
      }, t2.apply(this, arguments);
    };
    function n2(A3, e3, t3, n3) {
      function r3(A4) {
        return A4 instanceof t3 ? A4 : new t3(function(e4) {
          e4(A4);
        });
      }
      return new (t3 || (t3 = Promise))(function(t4, o3) {
        function i3(A4) {
          try {
            a3(n3.next(A4));
          } catch (A5) {
            o3(A5);
          }
        }
        function s3(A4) {
          try {
            a3(n3.throw(A4));
          } catch (A5) {
            o3(A5);
          }
        }
        function a3(A4) {
          A4.done ? t4(A4.value) : r3(A4.value).then(i3, s3);
        }
        a3((n3 = n3.apply(A3, [])).next());
      });
    }
    function r2(A3, e3) {
      var t3, n3, r3, o3, i3 = { label: 0, sent: function() {
        if (1 & r3[0]) throw r3[1];
        return r3[1];
      }, trys: [], ops: [] };
      return o3 = { next: s3(0), throw: s3(1), return: s3(2) }, "function" == typeof Symbol && (o3[Symbol.iterator] = function() {
        return this;
      }), o3;
      function s3(A4) {
        return function(e4) {
          return a3([A4, e4]);
        };
      }
      function a3(o4) {
        if (t3) throw new TypeError("Generator is already executing.");
        for (; i3; ) try {
          if (t3 = 1, n3 && (r3 = 2 & o4[0] ? n3.return : o4[0] ? n3.throw || ((r3 = n3.return) && r3.call(n3), 0) : n3.next) && !(r3 = r3.call(n3, o4[1])).done) return r3;
          switch (n3 = 0, r3 && (o4 = [2 & o4[0], r3.value]), o4[0]) {
            case 0:
            case 1:
              r3 = o4;
              break;
            case 4:
              return i3.label++, { value: o4[1], done: false };
            case 5:
              i3.label++, n3 = o4[1], o4 = [0];
              continue;
            case 7:
              o4 = i3.ops.pop(), i3.trys.pop();
              continue;
            default:
              if (!((r3 = (r3 = i3.trys).length > 0 && r3[r3.length - 1]) || 6 !== o4[0] && 2 !== o4[0])) {
                i3 = 0;
                continue;
              }
              if (3 === o4[0] && (!r3 || o4[1] > r3[0] && o4[1] < r3[3])) {
                i3.label = o4[1];
                break;
              }
              if (6 === o4[0] && i3.label < r3[1]) {
                i3.label = r3[1], r3 = o4;
                break;
              }
              if (r3 && i3.label < r3[2]) {
                i3.label = r3[2], i3.ops.push(o4);
                break;
              }
              r3[2] && i3.ops.pop(), i3.trys.pop();
              continue;
          }
          o4 = e3.call(A3, i3);
        } catch (A4) {
          o4 = [6, A4], n3 = 0;
        } finally {
          t3 = r3 = 0;
        }
        if (5 & o4[0]) throw o4[1];
        return { value: o4[0] ? o4[1] : void 0, done: true };
      }
    }
    function o2(A3, e3, t3) {
      if (2 === arguments.length) for (var n3, r3 = 0, o3 = e3.length; r3 < o3; r3++) !n3 && r3 in e3 || (n3 || (n3 = Array.prototype.slice.call(e3, 0, r3)), n3[r3] = e3[r3]);
      return A3.concat(n3 || e3);
    }
    for (var i2 = function() {
      function A3(A4, e3, t3, n3) {
        this.left = A4, this.top = e3, this.width = t3, this.height = n3;
      }
      return A3.prototype.add = function(e3, t3, n3, r3) {
        return new A3(this.left + e3, this.top + t3, this.width + n3, this.height + r3);
      }, A3.fromClientRect = function(e3, t3) {
        return new A3(t3.left + e3.windowBounds.left, t3.top + e3.windowBounds.top, t3.width, t3.height);
      }, A3.fromDOMRectList = function(e3, t3) {
        var n3 = Array.from(t3).find(function(A4) {
          return 0 !== A4.width;
        });
        return n3 ? new A3(n3.left + e3.windowBounds.left, n3.top + e3.windowBounds.top, n3.width, n3.height) : A3.EMPTY;
      }, A3.EMPTY = new A3(0, 0, 0, 0), A3;
    }(), s2 = function(A3, e3) {
      return i2.fromClientRect(A3, e3.getBoundingClientRect());
    }, a2 = function(A3) {
      var e3 = A3.body, t3 = A3.documentElement;
      if (!e3 || !t3) throw new Error("Unable to get document size");
      var n3 = Math.max(Math.max(e3.scrollWidth, t3.scrollWidth), Math.max(e3.offsetWidth, t3.offsetWidth), Math.max(e3.clientWidth, t3.clientWidth)), r3 = Math.max(Math.max(e3.scrollHeight, t3.scrollHeight), Math.max(e3.offsetHeight, t3.offsetHeight), Math.max(e3.clientHeight, t3.clientHeight));
      return new i2(0, 0, n3, r3);
    }, l2 = function(A3) {
      for (var e3 = [], t3 = 0, n3 = A3.length; t3 < n3; ) {
        var r3 = A3.charCodeAt(t3++);
        if (r3 >= 55296 && r3 <= 56319 && t3 < n3) {
          var o3 = A3.charCodeAt(t3++);
          56320 == (64512 & o3) ? e3.push(((1023 & r3) << 10) + (1023 & o3) + 65536) : (e3.push(r3), t3--);
        } else e3.push(r3);
      }
      return e3;
    }, c2 = function() {
      for (var A3 = [], e3 = 0; e3 < arguments.length; e3++) A3[e3] = arguments[e3];
      if (String.fromCodePoint) return String.fromCodePoint.apply(String, A3);
      var t3 = A3.length;
      if (!t3) return "";
      for (var n3 = [], r3 = -1, o3 = ""; ++r3 < t3; ) {
        var i3 = A3[r3];
        i3 <= 65535 ? n3.push(i3) : (i3 -= 65536, n3.push(55296 + (i3 >> 10), i3 % 1024 + 56320)), (r3 + 1 === t3 || n3.length > 16384) && (o3 += String.fromCharCode.apply(String, n3), n3.length = 0);
      }
      return o3;
    }, u2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", B2 = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), h2 = 0; h2 < u2.length; h2++) B2[u2.charCodeAt(h2)] = h2;
    for (var g2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d2 = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), w2 = 0; w2 < g2.length; w2++) d2[g2.charCodeAt(w2)] = w2;
    for (var f2 = function(A3) {
      var e3, t3, n3, r3, o3, i3 = 0.75 * A3.length, s3 = A3.length, a3 = 0;
      "=" === A3[A3.length - 1] && (i3--, "=" === A3[A3.length - 2] && i3--);
      var l3 = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array && void 0 !== Uint8Array.prototype.slice ? new ArrayBuffer(i3) : new Array(i3), c3 = Array.isArray(l3) ? l3 : new Uint8Array(l3);
      for (e3 = 0; e3 < s3; e3 += 4) t3 = d2[A3.charCodeAt(e3)], n3 = d2[A3.charCodeAt(e3 + 1)], r3 = d2[A3.charCodeAt(e3 + 2)], o3 = d2[A3.charCodeAt(e3 + 3)], c3[a3++] = t3 << 2 | n3 >> 4, c3[a3++] = (15 & n3) << 4 | r3 >> 2, c3[a3++] = (3 & r3) << 6 | 63 & o3;
      return l3;
    }, p2 = function(A3) {
      for (var e3 = A3.length, t3 = [], n3 = 0; n3 < e3; n3 += 2) t3.push(A3[n3 + 1] << 8 | A3[n3]);
      return t3;
    }, C2 = function(A3) {
      for (var e3 = A3.length, t3 = [], n3 = 0; n3 < e3; n3 += 4) t3.push(A3[n3 + 3] << 24 | A3[n3 + 2] << 16 | A3[n3 + 1] << 8 | A3[n3]);
      return t3;
    }, Q2 = 5, v2 = 11, U2 = 2, m2 = 65536 >> Q2, F2 = (1 << Q2) - 1, y2 = m2 + (1024 >> Q2) + 32, E2 = 65536 >> v2, b2 = (1 << v2 - Q2) - 1, I2 = function(A3, e3, t3) {
      return A3.slice ? A3.slice(e3, t3) : new Uint16Array(Array.prototype.slice.call(A3, e3, t3));
    }, H2 = function(A3, e3, t3) {
      return A3.slice ? A3.slice(e3, t3) : new Uint32Array(Array.prototype.slice.call(A3, e3, t3));
    }, S2 = function(A3, e3) {
      var t3 = f2(A3), n3 = Array.isArray(t3) ? C2(t3) : new Uint32Array(t3), r3 = Array.isArray(t3) ? p2(t3) : new Uint16Array(t3), o3 = 24, i3 = I2(r3, o3 / 2, n3[4] / 2), s3 = 2 === n3[5] ? I2(r3, (o3 + n3[4]) / 2) : H2(n3, Math.ceil((o3 + n3[4]) / 4));
      return new x2(n3[0], n3[1], n3[2], n3[3], i3, s3);
    }, x2 = function() {
      function A3(A4, e3, t3, n3, r3, o3) {
        this.initialValue = A4, this.errorValue = e3, this.highStart = t3, this.highValueIndex = n3, this.index = r3, this.data = o3;
      }
      return A3.prototype.get = function(A4) {
        var e3;
        if (A4 >= 0) {
          if (A4 < 55296 || A4 > 56319 && A4 <= 65535) return e3 = ((e3 = this.index[A4 >> Q2]) << U2) + (A4 & F2), this.data[e3];
          if (A4 <= 65535) return e3 = ((e3 = this.index[m2 + (A4 - 55296 >> Q2)]) << U2) + (A4 & F2), this.data[e3];
          if (A4 < this.highStart) return e3 = y2 - E2 + (A4 >> v2), e3 = this.index[e3], e3 += A4 >> Q2 & b2, e3 = ((e3 = this.index[e3]) << U2) + (A4 & F2), this.data[e3];
          if (A4 <= 1114111) return this.data[this.highValueIndex];
        }
        return this.errorValue;
      }, A3;
    }(), K2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", D2 = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), L2 = 0; L2 < K2.length; L2++) D2[K2.charCodeAt(L2)] = L2;
    var O2 = 50, k2 = 1, M2 = 2, P2 = 3, T2 = 4, R2 = 5, G2 = 7, V2 = 8, N2 = 9, X2 = 10, _2 = 11, Y2 = 12, J2 = 13, W2 = 14, z2 = 15, Z2 = 16, j2 = 17, q2 = 18, $2 = 19, AA2 = 20, eA2 = 21, tA2 = 22, nA2 = 23, rA2 = 24, oA2 = 25, iA2 = 26, sA2 = 27, aA2 = 28, lA2 = 29, cA2 = 30, uA2 = 31, BA2 = 32, hA2 = 33, gA2 = 34, dA2 = 35, wA2 = 36, fA2 = 37, pA2 = 38, CA2 = 39, QA2 = 40, vA2 = 41, UA2 = 42, mA2 = 43, FA2 = [9001, 65288], yA2 = "!", EA2 = "×", bA2 = "÷", IA2 = S2("KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA=="), HA2 = [cA2, wA2], SA2 = [k2, M2, P2, R2], xA2 = [X2, V2], KA2 = [sA2, iA2], DA2 = SA2.concat(xA2), LA2 = [pA2, CA2, QA2, gA2, dA2], OA2 = [z2, J2], kA2 = function(A3, e3) {
      void 0 === e3 && (e3 = "strict");
      var t3 = [], n3 = [], r3 = [];
      return A3.forEach(function(A4, o3) {
        var i3 = IA2.get(A4);
        if (i3 > O2 ? (r3.push(true), i3 -= O2) : r3.push(false), -1 !== ["normal", "auto", "loose"].indexOf(e3) && -1 !== [8208, 8211, 12316, 12448].indexOf(A4)) return n3.push(o3), t3.push(Z2);
        if (i3 === T2 || i3 === _2) {
          if (0 === o3) return n3.push(o3), t3.push(cA2);
          var s3 = t3[o3 - 1];
          return -1 === DA2.indexOf(s3) ? (n3.push(n3[o3 - 1]), t3.push(s3)) : (n3.push(o3), t3.push(cA2));
        }
        return n3.push(o3), i3 === uA2 ? t3.push("strict" === e3 ? eA2 : fA2) : i3 === UA2 || i3 === lA2 ? t3.push(cA2) : i3 === mA2 ? A4 >= 131072 && A4 <= 196605 || A4 >= 196608 && A4 <= 262141 ? t3.push(fA2) : t3.push(cA2) : void t3.push(i3);
      }), [n3, t3, r3];
    }, MA2 = function(A3, e3, t3, n3) {
      var r3 = n3[t3];
      if (Array.isArray(A3) ? -1 !== A3.indexOf(r3) : A3 === r3) for (var o3 = t3; o3 <= n3.length; ) {
        if ((a3 = n3[++o3]) === e3) return true;
        if (a3 !== X2) break;
      }
      if (r3 === X2) for (o3 = t3; o3 > 0; ) {
        var i3 = n3[--o3];
        if (Array.isArray(A3) ? -1 !== A3.indexOf(i3) : A3 === i3) for (var s3 = t3; s3 <= n3.length; ) {
          var a3;
          if ((a3 = n3[++s3]) === e3) return true;
          if (a3 !== X2) break;
        }
        if (i3 !== X2) break;
      }
      return false;
    }, PA2 = function(A3, e3) {
      for (var t3 = A3; t3 >= 0; ) {
        var n3 = e3[t3];
        if (n3 !== X2) return n3;
        t3--;
      }
      return 0;
    }, TA2 = function(A3, e3, t3, n3, r3) {
      if (0 === t3[n3]) return EA2;
      var o3 = n3 - 1;
      if (Array.isArray(r3) && true === r3[o3]) return EA2;
      var i3 = o3 - 1, s3 = o3 + 1, a3 = e3[o3], l3 = i3 >= 0 ? e3[i3] : 0, c3 = e3[s3];
      if (a3 === M2 && c3 === P2) return EA2;
      if (-1 !== SA2.indexOf(a3)) return yA2;
      if (-1 !== SA2.indexOf(c3)) return EA2;
      if (-1 !== xA2.indexOf(c3)) return EA2;
      if (PA2(o3, e3) === V2) return bA2;
      if (IA2.get(A3[o3]) === _2) return EA2;
      if ((a3 === BA2 || a3 === hA2) && IA2.get(A3[s3]) === _2) return EA2;
      if (a3 === G2 || c3 === G2) return EA2;
      if (a3 === N2) return EA2;
      if (-1 === [X2, J2, z2].indexOf(a3) && c3 === N2) return EA2;
      if (-1 !== [j2, q2, $2, rA2, aA2].indexOf(c3)) return EA2;
      if (PA2(o3, e3) === tA2) return EA2;
      if (MA2(nA2, tA2, o3, e3)) return EA2;
      if (MA2([j2, q2], eA2, o3, e3)) return EA2;
      if (MA2(Y2, Y2, o3, e3)) return EA2;
      if (a3 === X2) return bA2;
      if (a3 === nA2 || c3 === nA2) return EA2;
      if (c3 === Z2 || a3 === Z2) return bA2;
      if (-1 !== [J2, z2, eA2].indexOf(c3) || a3 === W2) return EA2;
      if (l3 === wA2 && -1 !== OA2.indexOf(a3)) return EA2;
      if (a3 === aA2 && c3 === wA2) return EA2;
      if (c3 === AA2) return EA2;
      if (-1 !== HA2.indexOf(c3) && a3 === oA2 || -1 !== HA2.indexOf(a3) && c3 === oA2) return EA2;
      if (a3 === sA2 && -1 !== [fA2, BA2, hA2].indexOf(c3) || -1 !== [fA2, BA2, hA2].indexOf(a3) && c3 === iA2) return EA2;
      if (-1 !== HA2.indexOf(a3) && -1 !== KA2.indexOf(c3) || -1 !== KA2.indexOf(a3) && -1 !== HA2.indexOf(c3)) return EA2;
      if (-1 !== [sA2, iA2].indexOf(a3) && (c3 === oA2 || -1 !== [tA2, z2].indexOf(c3) && e3[s3 + 1] === oA2) || -1 !== [tA2, z2].indexOf(a3) && c3 === oA2 || a3 === oA2 && -1 !== [oA2, aA2, rA2].indexOf(c3)) return EA2;
      if (-1 !== [oA2, aA2, rA2, j2, q2].indexOf(c3)) for (var u3 = o3; u3 >= 0; ) {
        if ((B3 = e3[u3]) === oA2) return EA2;
        if (-1 === [aA2, rA2].indexOf(B3)) break;
        u3--;
      }
      if (-1 !== [sA2, iA2].indexOf(c3)) for (u3 = -1 !== [j2, q2].indexOf(a3) ? i3 : o3; u3 >= 0; ) {
        var B3;
        if ((B3 = e3[u3]) === oA2) return EA2;
        if (-1 === [aA2, rA2].indexOf(B3)) break;
        u3--;
      }
      if (pA2 === a3 && -1 !== [pA2, CA2, gA2, dA2].indexOf(c3) || -1 !== [CA2, gA2].indexOf(a3) && -1 !== [CA2, QA2].indexOf(c3) || -1 !== [QA2, dA2].indexOf(a3) && c3 === QA2) return EA2;
      if (-1 !== LA2.indexOf(a3) && -1 !== [AA2, iA2].indexOf(c3) || -1 !== LA2.indexOf(c3) && a3 === sA2) return EA2;
      if (-1 !== HA2.indexOf(a3) && -1 !== HA2.indexOf(c3)) return EA2;
      if (a3 === rA2 && -1 !== HA2.indexOf(c3)) return EA2;
      if (-1 !== HA2.concat(oA2).indexOf(a3) && c3 === tA2 && -1 === FA2.indexOf(A3[s3]) || -1 !== HA2.concat(oA2).indexOf(c3) && a3 === q2) return EA2;
      if (a3 === vA2 && c3 === vA2) {
        for (var h3 = t3[o3], g3 = 1; h3 > 0 && e3[--h3] === vA2; ) g3++;
        if (g3 % 2 != 0) return EA2;
      }
      return a3 === BA2 && c3 === hA2 ? EA2 : bA2;
    }, RA2 = function(A3, e3) {
      e3 || (e3 = { lineBreak: "normal", wordBreak: "normal" });
      var t3 = kA2(A3, e3.lineBreak), n3 = t3[0], r3 = t3[1], o3 = t3[2];
      "break-all" !== e3.wordBreak && "break-word" !== e3.wordBreak || (r3 = r3.map(function(A4) {
        return -1 !== [oA2, cA2, UA2].indexOf(A4) ? fA2 : A4;
      }));
      var i3 = "keep-all" === e3.wordBreak ? o3.map(function(e4, t4) {
        return e4 && A3[t4] >= 19968 && A3[t4] <= 40959;
      }) : void 0;
      return [n3, r3, i3];
    }, GA2 = function() {
      function A3(A4, e3, t3, n3) {
        this.codePoints = A4, this.required = e3 === yA2, this.start = t3, this.end = n3;
      }
      return A3.prototype.slice = function() {
        return c2.apply(void 0, this.codePoints.slice(this.start, this.end));
      }, A3;
    }(), VA2 = function(A3, e3) {
      var t3 = l2(A3), n3 = RA2(t3, e3), r3 = n3[0], o3 = n3[1], i3 = n3[2], s3 = t3.length, a3 = 0, c3 = 0;
      return { next: function() {
        if (c3 >= s3) return { done: true, value: null };
        for (var A4 = EA2; c3 < s3 && (A4 = TA2(t3, o3, r3, ++c3, i3)) === EA2; ) ;
        if (A4 !== EA2 || c3 === s3) {
          var e4 = new GA2(t3, A4, a3, c3);
          return a3 = c3, { value: e4, done: false };
        }
        return { done: true, value: null };
      } };
    }, NA2 = 1, XA2 = 2, _A2 = 4, YA2 = 8, JA2 = 10, WA2 = 47, zA2 = 92, ZA2 = 9, jA2 = 32, qA2 = 34, $A2 = 61, Ae2 = 35, ee2 = 36, te2 = 37, ne2 = 39, re2 = 40, oe2 = 41, ie2 = 95, se2 = 45, ae2 = 33, le2 = 60, ce2 = 62, ue2 = 64, Be2 = 91, he2 = 93, ge2 = 61, de2 = 123, we2 = 63, fe2 = 125, pe2 = 124, Ce2 = 126, Qe2 = 128, ve2 = 65533, Ue2 = 42, me2 = 43, Fe2 = 44, ye2 = 58, Ee2 = 59, be2 = 46, Ie2 = 0, He2 = 8, Se2 = 11, xe2 = 14, Ke2 = 31, De2 = 127, Le2 = -1, Oe2 = 48, ke2 = 97, Me2 = 101, Pe2 = 102, Te2 = 117, Re2 = 122, Ge2 = 65, Ve2 = 69, Ne2 = 70, Xe2 = 85, _e2 = 90, Ye2 = function(A3) {
      return A3 >= Oe2 && A3 <= 57;
    }, Je2 = function(A3) {
      return A3 >= 55296 && A3 <= 57343;
    }, We2 = function(A3) {
      return Ye2(A3) || A3 >= Ge2 && A3 <= Ne2 || A3 >= ke2 && A3 <= Pe2;
    }, ze2 = function(A3) {
      return A3 >= ke2 && A3 <= Re2;
    }, Ze2 = function(A3) {
      return A3 >= Ge2 && A3 <= _e2;
    }, je2 = function(A3) {
      return ze2(A3) || Ze2(A3);
    }, qe2 = function(A3) {
      return A3 >= Qe2;
    }, $e2 = function(A3) {
      return A3 === JA2 || A3 === ZA2 || A3 === jA2;
    }, At2 = function(A3) {
      return je2(A3) || qe2(A3) || A3 === ie2;
    }, et2 = function(A3) {
      return At2(A3) || Ye2(A3) || A3 === se2;
    }, tt2 = function(A3) {
      return A3 >= Ie2 && A3 <= He2 || A3 === Se2 || A3 >= xe2 && A3 <= Ke2 || A3 === De2;
    }, nt2 = function(A3, e3) {
      return A3 === zA2 && e3 !== JA2;
    }, rt2 = function(A3, e3, t3) {
      return A3 === se2 ? At2(e3) || nt2(e3, t3) : !!At2(A3) || !(A3 !== zA2 || !nt2(A3, e3));
    }, ot2 = function(A3, e3, t3) {
      return A3 === me2 || A3 === se2 ? !!Ye2(e3) || e3 === be2 && Ye2(t3) : Ye2(A3 === be2 ? e3 : A3);
    }, it2 = function(A3) {
      var e3 = 0, t3 = 1;
      A3[e3] !== me2 && A3[e3] !== se2 || (A3[e3] === se2 && (t3 = -1), e3++);
      for (var n3 = []; Ye2(A3[e3]); ) n3.push(A3[e3++]);
      var r3 = n3.length ? parseInt(c2.apply(void 0, n3), 10) : 0;
      A3[e3] === be2 && e3++;
      for (var o3 = []; Ye2(A3[e3]); ) o3.push(A3[e3++]);
      var i3 = o3.length, s3 = i3 ? parseInt(c2.apply(void 0, o3), 10) : 0;
      A3[e3] !== Ve2 && A3[e3] !== Me2 || e3++;
      var a3 = 1;
      A3[e3] !== me2 && A3[e3] !== se2 || (A3[e3] === se2 && (a3 = -1), e3++);
      for (var l3 = []; Ye2(A3[e3]); ) l3.push(A3[e3++]);
      var u3 = l3.length ? parseInt(c2.apply(void 0, l3), 10) : 0;
      return t3 * (r3 + s3 * Math.pow(10, -i3)) * Math.pow(10, a3 * u3);
    }, st2 = { type: 2 }, at2 = { type: 3 }, lt2 = { type: 4 }, ct2 = { type: 13 }, ut2 = { type: 8 }, Bt2 = { type: 21 }, ht2 = { type: 9 }, gt2 = { type: 10 }, dt2 = { type: 11 }, wt2 = { type: 12 }, ft2 = { type: 14 }, pt2 = { type: 23 }, Ct2 = { type: 1 }, Qt2 = { type: 25 }, vt2 = { type: 24 }, Ut2 = { type: 26 }, mt2 = { type: 27 }, Ft2 = { type: 28 }, yt2 = { type: 29 }, Et2 = { type: 31 }, bt2 = { type: 32 }, It2 = function() {
      function A3() {
        this._value = [];
      }
      return A3.prototype.write = function(A4) {
        this._value = this._value.concat(l2(A4));
      }, A3.prototype.read = function() {
        for (var A4 = [], e3 = this.consumeToken(); e3 !== bt2; ) A4.push(e3), e3 = this.consumeToken();
        return A4;
      }, A3.prototype.consumeToken = function() {
        var A4 = this.consumeCodePoint();
        switch (A4) {
          case qA2:
            return this.consumeStringToken(qA2);
          case Ae2:
            var e3 = this.peekCodePoint(0), t3 = this.peekCodePoint(1), n3 = this.peekCodePoint(2);
            if (et2(e3) || nt2(t3, n3)) {
              var r3 = rt2(e3, t3, n3) ? XA2 : NA2;
              return { type: 5, value: this.consumeName(), flags: r3 };
            }
            break;
          case ee2:
            if (this.peekCodePoint(0) === $A2) return this.consumeCodePoint(), ct2;
            break;
          case ne2:
            return this.consumeStringToken(ne2);
          case re2:
            return st2;
          case oe2:
            return at2;
          case Ue2:
            if (this.peekCodePoint(0) === $A2) return this.consumeCodePoint(), ft2;
            break;
          case me2:
            if (ot2(A4, this.peekCodePoint(0), this.peekCodePoint(1))) return this.reconsumeCodePoint(A4), this.consumeNumericToken();
            break;
          case Fe2:
            return lt2;
          case se2:
            var o3 = A4, i3 = this.peekCodePoint(0), s3 = this.peekCodePoint(1);
            if (ot2(o3, i3, s3)) return this.reconsumeCodePoint(A4), this.consumeNumericToken();
            if (rt2(o3, i3, s3)) return this.reconsumeCodePoint(A4), this.consumeIdentLikeToken();
            if (i3 === se2 && s3 === ce2) return this.consumeCodePoint(), this.consumeCodePoint(), vt2;
            break;
          case be2:
            if (ot2(A4, this.peekCodePoint(0), this.peekCodePoint(1))) return this.reconsumeCodePoint(A4), this.consumeNumericToken();
            break;
          case WA2:
            if (this.peekCodePoint(0) === Ue2) for (this.consumeCodePoint(); ; ) {
              var a3 = this.consumeCodePoint();
              if (a3 === Ue2 && (a3 = this.consumeCodePoint()) === WA2) return this.consumeToken();
              if (a3 === Le2) return this.consumeToken();
            }
            break;
          case ye2:
            return Ut2;
          case Ee2:
            return mt2;
          case le2:
            if (this.peekCodePoint(0) === ae2 && this.peekCodePoint(1) === se2 && this.peekCodePoint(2) === se2) return this.consumeCodePoint(), this.consumeCodePoint(), Qt2;
            break;
          case ue2:
            var l3 = this.peekCodePoint(0), u3 = this.peekCodePoint(1), B3 = this.peekCodePoint(2);
            if (rt2(l3, u3, B3)) return { type: 7, value: this.consumeName() };
            break;
          case Be2:
            return Ft2;
          case zA2:
            if (nt2(A4, this.peekCodePoint(0))) return this.reconsumeCodePoint(A4), this.consumeIdentLikeToken();
            break;
          case he2:
            return yt2;
          case ge2:
            if (this.peekCodePoint(0) === $A2) return this.consumeCodePoint(), ut2;
            break;
          case de2:
            return dt2;
          case fe2:
            return wt2;
          case Te2:
          case Xe2:
            var h3 = this.peekCodePoint(0), g3 = this.peekCodePoint(1);
            return h3 !== me2 || !We2(g3) && g3 !== we2 || (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(A4), this.consumeIdentLikeToken();
          case pe2:
            if (this.peekCodePoint(0) === $A2) return this.consumeCodePoint(), ht2;
            if (this.peekCodePoint(0) === pe2) return this.consumeCodePoint(), Bt2;
            break;
          case Ce2:
            if (this.peekCodePoint(0) === $A2) return this.consumeCodePoint(), gt2;
            break;
          case Le2:
            return bt2;
        }
        return $e2(A4) ? (this.consumeWhiteSpace(), Et2) : Ye2(A4) ? (this.reconsumeCodePoint(A4), this.consumeNumericToken()) : At2(A4) ? (this.reconsumeCodePoint(A4), this.consumeIdentLikeToken()) : { type: 6, value: c2(A4) };
      }, A3.prototype.consumeCodePoint = function() {
        var A4 = this._value.shift();
        return void 0 === A4 ? -1 : A4;
      }, A3.prototype.reconsumeCodePoint = function(A4) {
        this._value.unshift(A4);
      }, A3.prototype.peekCodePoint = function(A4) {
        return A4 >= this._value.length ? -1 : this._value[A4];
      }, A3.prototype.consumeUnicodeRangeToken = function() {
        for (var A4 = [], e3 = this.consumeCodePoint(); We2(e3) && A4.length < 6; ) A4.push(e3), e3 = this.consumeCodePoint();
        for (var t3 = false; e3 === we2 && A4.length < 6; ) A4.push(e3), e3 = this.consumeCodePoint(), t3 = true;
        if (t3) return { type: 30, start: parseInt(c2.apply(void 0, A4.map(function(A5) {
          return A5 === we2 ? Oe2 : A5;
        })), 16), end: parseInt(c2.apply(void 0, A4.map(function(A5) {
          return A5 === we2 ? Ne2 : A5;
        })), 16) };
        var n3 = parseInt(c2.apply(void 0, A4), 16);
        if (this.peekCodePoint(0) === se2 && We2(this.peekCodePoint(1))) {
          this.consumeCodePoint(), e3 = this.consumeCodePoint();
          for (var r3 = []; We2(e3) && r3.length < 6; ) r3.push(e3), e3 = this.consumeCodePoint();
          return { type: 30, start: n3, end: parseInt(c2.apply(void 0, r3), 16) };
        }
        return { type: 30, start: n3, end: n3 };
      }, A3.prototype.consumeIdentLikeToken = function() {
        var A4 = this.consumeName();
        return "url" === A4.toLowerCase() && this.peekCodePoint(0) === re2 ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === re2 ? (this.consumeCodePoint(), { type: 19, value: A4 }) : { type: 20, value: A4 };
      }, A3.prototype.consumeUrlToken = function() {
        var A4 = [];
        if (this.consumeWhiteSpace(), this.peekCodePoint(0) === Le2) return { type: 22, value: "" };
        var e3 = this.peekCodePoint(0);
        if (e3 === ne2 || e3 === qA2) {
          var t3 = this.consumeStringToken(this.consumeCodePoint());
          return 0 === t3.type && (this.consumeWhiteSpace(), this.peekCodePoint(0) === Le2 || this.peekCodePoint(0) === oe2) ? (this.consumeCodePoint(), { type: 22, value: t3.value }) : (this.consumeBadUrlRemnants(), pt2);
        }
        for (; ; ) {
          var n3 = this.consumeCodePoint();
          if (n3 === Le2 || n3 === oe2) return { type: 22, value: c2.apply(void 0, A4) };
          if ($e2(n3)) return this.consumeWhiteSpace(), this.peekCodePoint(0) === Le2 || this.peekCodePoint(0) === oe2 ? (this.consumeCodePoint(), { type: 22, value: c2.apply(void 0, A4) }) : (this.consumeBadUrlRemnants(), pt2);
          if (n3 === qA2 || n3 === ne2 || n3 === re2 || tt2(n3)) return this.consumeBadUrlRemnants(), pt2;
          if (n3 === zA2) {
            if (!nt2(n3, this.peekCodePoint(0))) return this.consumeBadUrlRemnants(), pt2;
            A4.push(this.consumeEscapedCodePoint());
          } else A4.push(n3);
        }
      }, A3.prototype.consumeWhiteSpace = function() {
        for (; $e2(this.peekCodePoint(0)); ) this.consumeCodePoint();
      }, A3.prototype.consumeBadUrlRemnants = function() {
        for (; ; ) {
          var A4 = this.consumeCodePoint();
          if (A4 === oe2 || A4 === Le2) return;
          nt2(A4, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
        }
      }, A3.prototype.consumeStringSlice = function(A4) {
        for (var e3 = 5e4, t3 = ""; A4 > 0; ) {
          var n3 = Math.min(e3, A4);
          t3 += c2.apply(void 0, this._value.splice(0, n3)), A4 -= n3;
        }
        return this._value.shift(), t3;
      }, A3.prototype.consumeStringToken = function(A4) {
        for (var e3 = "", t3 = 0; ; ) {
          var n3 = this._value[t3];
          if (n3 === Le2 || void 0 === n3 || n3 === A4) return { type: 0, value: e3 += this.consumeStringSlice(t3) };
          if (n3 === JA2) return this._value.splice(0, t3), Ct2;
          if (n3 === zA2) {
            var r3 = this._value[t3 + 1];
            r3 !== Le2 && void 0 !== r3 && (r3 === JA2 ? (e3 += this.consumeStringSlice(t3), t3 = -1, this._value.shift()) : nt2(n3, r3) && (e3 += this.consumeStringSlice(t3), e3 += c2(this.consumeEscapedCodePoint()), t3 = -1));
          }
          t3++;
        }
      }, A3.prototype.consumeNumber = function() {
        var A4 = [], e3 = _A2, t3 = this.peekCodePoint(0);
        for (t3 !== me2 && t3 !== se2 || A4.push(this.consumeCodePoint()); Ye2(this.peekCodePoint(0)); ) A4.push(this.consumeCodePoint());
        t3 = this.peekCodePoint(0);
        var n3 = this.peekCodePoint(1);
        if (t3 === be2 && Ye2(n3)) for (A4.push(this.consumeCodePoint(), this.consumeCodePoint()), e3 = YA2; Ye2(this.peekCodePoint(0)); ) A4.push(this.consumeCodePoint());
        t3 = this.peekCodePoint(0), n3 = this.peekCodePoint(1);
        var r3 = this.peekCodePoint(2);
        if ((t3 === Ve2 || t3 === Me2) && ((n3 === me2 || n3 === se2) && Ye2(r3) || Ye2(n3))) for (A4.push(this.consumeCodePoint(), this.consumeCodePoint()), e3 = YA2; Ye2(this.peekCodePoint(0)); ) A4.push(this.consumeCodePoint());
        return [it2(A4), e3];
      }, A3.prototype.consumeNumericToken = function() {
        var A4 = this.consumeNumber(), e3 = A4[0], t3 = A4[1], n3 = this.peekCodePoint(0), r3 = this.peekCodePoint(1), o3 = this.peekCodePoint(2);
        return rt2(n3, r3, o3) ? { type: 15, number: e3, flags: t3, unit: this.consumeName() } : n3 === te2 ? (this.consumeCodePoint(), { type: 16, number: e3, flags: t3 }) : { type: 17, number: e3, flags: t3 };
      }, A3.prototype.consumeEscapedCodePoint = function() {
        var A4 = this.consumeCodePoint();
        if (We2(A4)) {
          for (var e3 = c2(A4); We2(this.peekCodePoint(0)) && e3.length < 6; ) e3 += c2(this.consumeCodePoint());
          $e2(this.peekCodePoint(0)) && this.consumeCodePoint();
          var t3 = parseInt(e3, 16);
          return 0 === t3 || Je2(t3) || t3 > 1114111 ? ve2 : t3;
        }
        return A4 === Le2 ? ve2 : A4;
      }, A3.prototype.consumeName = function() {
        for (var A4 = ""; ; ) {
          var e3 = this.consumeCodePoint();
          if (et2(e3)) A4 += c2(e3);
          else {
            if (!nt2(e3, this.peekCodePoint(0))) return this.reconsumeCodePoint(e3), A4;
            A4 += c2(this.consumeEscapedCodePoint());
          }
        }
      }, A3;
    }(), Ht2 = function() {
      function A3(A4) {
        this._tokens = A4;
      }
      return A3.create = function(e3) {
        var t3 = new It2();
        return t3.write(e3), new A3(t3.read());
      }, A3.parseValue = function(e3) {
        return A3.create(e3).parseComponentValue();
      }, A3.parseValues = function(e3) {
        return A3.create(e3).parseComponentValues();
      }, A3.prototype.parseComponentValue = function() {
        for (var A4 = this.consumeToken(); 31 === A4.type; ) A4 = this.consumeToken();
        if (32 === A4.type) throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
        this.reconsumeToken(A4);
        var e3 = this.consumeComponentValue();
        do {
          A4 = this.consumeToken();
        } while (31 === A4.type);
        if (32 === A4.type) return e3;
        throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
      }, A3.prototype.parseComponentValues = function() {
        for (var A4 = []; ; ) {
          var e3 = this.consumeComponentValue();
          if (32 === e3.type) return A4;
          A4.push(e3), A4.push();
        }
      }, A3.prototype.consumeComponentValue = function() {
        var A4 = this.consumeToken();
        switch (A4.type) {
          case 11:
          case 28:
          case 2:
            return this.consumeSimpleBlock(A4.type);
          case 19:
            return this.consumeFunction(A4);
        }
        return A4;
      }, A3.prototype.consumeSimpleBlock = function(A4) {
        for (var e3 = { type: A4, values: [] }, t3 = this.consumeToken(); ; ) {
          if (32 === t3.type || Pt2(t3, A4)) return e3;
          this.reconsumeToken(t3), e3.values.push(this.consumeComponentValue()), t3 = this.consumeToken();
        }
      }, A3.prototype.consumeFunction = function(A4) {
        for (var e3 = { name: A4.value, values: [], type: 18 }; ; ) {
          var t3 = this.consumeToken();
          if (32 === t3.type || 3 === t3.type) return e3;
          this.reconsumeToken(t3), e3.values.push(this.consumeComponentValue());
        }
      }, A3.prototype.consumeToken = function() {
        var A4 = this._tokens.shift();
        return void 0 === A4 ? bt2 : A4;
      }, A3.prototype.reconsumeToken = function(A4) {
        this._tokens.unshift(A4);
      }, A3;
    }(), St2 = function(A3) {
      return 15 === A3.type;
    }, xt2 = function(A3) {
      return 17 === A3.type;
    }, Kt2 = function(A3) {
      return 20 === A3.type;
    }, Dt2 = function(A3) {
      return 0 === A3.type;
    }, Lt2 = function(A3, e3) {
      return Kt2(A3) && A3.value === e3;
    }, Ot2 = function(A3) {
      return 31 !== A3.type;
    }, kt2 = function(A3) {
      return 31 !== A3.type && 4 !== A3.type;
    }, Mt2 = function(A3) {
      var e3 = [], t3 = [];
      return A3.forEach(function(A4) {
        if (4 === A4.type) {
          if (0 === t3.length) throw new Error("Error parsing function args, zero tokens for arg");
          return e3.push(t3), void (t3 = []);
        }
        31 !== A4.type && t3.push(A4);
      }), t3.length && e3.push(t3), e3;
    }, Pt2 = function(A3, e3) {
      return 11 === e3 && 12 === A3.type || 28 === e3 && 29 === A3.type || 2 === e3 && 3 === A3.type;
    }, Tt2 = function(A3) {
      return 17 === A3.type || 15 === A3.type;
    }, Rt2 = function(A3) {
      return 16 === A3.type || Tt2(A3);
    }, Gt2 = function(A3) {
      return A3.length > 1 ? [A3[0], A3[1]] : [A3[0]];
    }, Vt2 = { type: 17, number: 0, flags: _A2 }, Nt2 = { type: 16, number: 50, flags: _A2 }, Xt2 = { type: 16, number: 100, flags: _A2 }, _t2 = function(A3, e3, t3) {
      var n3 = A3[0], r3 = A3[1];
      return [Yt2(n3, e3), Yt2(void 0 !== r3 ? r3 : n3, t3)];
    }, Yt2 = function(A3, e3) {
      if (16 === A3.type) return A3.number / 100 * e3;
      if (St2(A3)) switch (A3.unit) {
        case "rem":
        case "em":
          return 16 * A3.number;
        default:
          return A3.number;
      }
      return A3.number;
    }, Jt2 = "deg", Wt2 = "grad", zt2 = "rad", Zt2 = "turn", jt2 = { name: "angle", parse: function(A3, e3) {
      if (15 === e3.type) switch (e3.unit) {
        case Jt2:
          return Math.PI * e3.number / 180;
        case Wt2:
          return Math.PI / 200 * e3.number;
        case zt2:
          return e3.number;
        case Zt2:
          return 2 * Math.PI * e3.number;
      }
      throw new Error("Unsupported angle type");
    } }, qt2 = function(A3) {
      return 15 === A3.type && (A3.unit === Jt2 || A3.unit === Wt2 || A3.unit === zt2 || A3.unit === Zt2);
    }, $t2 = function(A3) {
      switch (A3.filter(Kt2).map(function(A4) {
        return A4.value;
      }).join(" ")) {
        case "to bottom right":
        case "to right bottom":
        case "left top":
        case "top left":
          return [Vt2, Vt2];
        case "to top":
        case "bottom":
          return An2(0);
        case "to bottom left":
        case "to left bottom":
        case "right top":
        case "top right":
          return [Vt2, Xt2];
        case "to right":
        case "left":
          return An2(90);
        case "to top left":
        case "to left top":
        case "right bottom":
        case "bottom right":
          return [Xt2, Xt2];
        case "to bottom":
        case "top":
          return An2(180);
        case "to top right":
        case "to right top":
        case "left bottom":
        case "bottom left":
          return [Xt2, Vt2];
        case "to left":
        case "right":
          return An2(270);
      }
      return 0;
    }, An2 = function(A3) {
      return Math.PI * A3 / 180;
    }, en2 = { name: "color", parse: function(A3, e3) {
      if (18 === e3.type) {
        var t3 = cn2[e3.name];
        if (void 0 === t3) throw new Error('Attempting to parse an unsupported color function "' + e3.name + '"');
        return t3(A3, e3.values);
      }
      if (5 === e3.type) {
        if (3 === e3.value.length) {
          var n3 = e3.value.substring(0, 1), r3 = e3.value.substring(1, 2), o3 = e3.value.substring(2, 3);
          return rn2(parseInt(n3 + n3, 16), parseInt(r3 + r3, 16), parseInt(o3 + o3, 16), 1);
        }
        if (4 === e3.value.length) {
          n3 = e3.value.substring(0, 1), r3 = e3.value.substring(1, 2), o3 = e3.value.substring(2, 3);
          var i3 = e3.value.substring(3, 4);
          return rn2(parseInt(n3 + n3, 16), parseInt(r3 + r3, 16), parseInt(o3 + o3, 16), parseInt(i3 + i3, 16) / 255);
        }
        if (6 === e3.value.length) return n3 = e3.value.substring(0, 2), r3 = e3.value.substring(2, 4), o3 = e3.value.substring(4, 6), rn2(parseInt(n3, 16), parseInt(r3, 16), parseInt(o3, 16), 1);
        if (8 === e3.value.length) return n3 = e3.value.substring(0, 2), r3 = e3.value.substring(2, 4), o3 = e3.value.substring(4, 6), i3 = e3.value.substring(6, 8), rn2(parseInt(n3, 16), parseInt(r3, 16), parseInt(o3, 16), parseInt(i3, 16) / 255);
      }
      if (20 === e3.type) {
        var s3 = Bn2[e3.value.toUpperCase()];
        if (void 0 !== s3) return s3;
      }
      return Bn2.TRANSPARENT;
    } }, tn2 = function(A3) {
      return !(255 & A3);
    }, nn2 = function(A3) {
      var e3 = 255 & A3, t3 = 255 & A3 >> 8, n3 = 255 & A3 >> 16, r3 = 255 & A3 >> 24;
      return e3 < 255 ? "rgba(" + r3 + "," + n3 + "," + t3 + "," + e3 / 255 + ")" : "rgb(" + r3 + "," + n3 + "," + t3 + ")";
    }, rn2 = function(A3, e3, t3, n3) {
      return (A3 << 24 | e3 << 16 | t3 << 8 | Math.round(255 * n3)) >>> 0;
    }, on2 = function(A3, e3) {
      if (17 === A3.type) return A3.number;
      if (16 === A3.type) {
        var t3 = 3 === e3 ? 1 : 255;
        return 3 === e3 ? A3.number / 100 * t3 : Math.round(A3.number / 100 * t3);
      }
      return 0;
    }, sn2 = function(A3, e3) {
      var t3 = e3.filter(kt2);
      if (3 === t3.length) {
        var n3 = t3.map(on2), r3 = n3[0], o3 = n3[1], i3 = n3[2];
        return rn2(r3, o3, i3, 1);
      }
      if (4 === t3.length) {
        var s3 = t3.map(on2), a3 = (r3 = s3[0], o3 = s3[1], i3 = s3[2], s3[3]);
        return rn2(r3, o3, i3, a3);
      }
      return 0;
    };
    function an2(A3, e3, t3) {
      return t3 < 0 && (t3 += 1), t3 >= 1 && (t3 -= 1), t3 < 1 / 6 ? (e3 - A3) * t3 * 6 + A3 : t3 < 0.5 ? e3 : t3 < 2 / 3 ? 6 * (e3 - A3) * (2 / 3 - t3) + A3 : A3;
    }
    var ln2 = function(A3, e3) {
      var t3 = e3.filter(kt2), n3 = t3[0], r3 = t3[1], o3 = t3[2], i3 = t3[3], s3 = (17 === n3.type ? An2(n3.number) : jt2.parse(A3, n3)) / (2 * Math.PI), a3 = Rt2(r3) ? r3.number / 100 : 0, l3 = Rt2(o3) ? o3.number / 100 : 0, c3 = void 0 !== i3 && Rt2(i3) ? Yt2(i3, 1) : 1;
      if (0 === a3) return rn2(255 * l3, 255 * l3, 255 * l3, 1);
      var u3 = l3 <= 0.5 ? l3 * (a3 + 1) : l3 + a3 - l3 * a3, B3 = 2 * l3 - u3, h3 = an2(B3, u3, s3 + 1 / 3), g3 = an2(B3, u3, s3), d3 = an2(B3, u3, s3 - 1 / 3);
      return rn2(255 * h3, 255 * g3, 255 * d3, c3);
    }, cn2 = { hsl: ln2, hsla: ln2, rgb: sn2, rgba: sn2 }, un2 = function(A3, e3) {
      return en2.parse(A3, Ht2.create(e3).parseComponentValue());
    }, Bn2 = { ALICEBLUE: 4042850303, ANTIQUEWHITE: 4209760255, AQUA: 16777215, AQUAMARINE: 2147472639, AZURE: 4043309055, BEIGE: 4126530815, BISQUE: 4293182719, BLACK: 255, BLANCHEDALMOND: 4293643775, BLUE: 65535, BLUEVIOLET: 2318131967, BROWN: 2771004159, BURLYWOOD: 3736635391, CADETBLUE: 1604231423, CHARTREUSE: 2147418367, CHOCOLATE: 3530104575, CORAL: 4286533887, CORNFLOWERBLUE: 1687547391, CORNSILK: 4294499583, CRIMSON: 3692313855, CYAN: 16777215, DARKBLUE: 35839, DARKCYAN: 9145343, DARKGOLDENROD: 3095837695, DARKGRAY: 2846468607, DARKGREEN: 6553855, DARKGREY: 2846468607, DARKKHAKI: 3182914559, DARKMAGENTA: 2332068863, DARKOLIVEGREEN: 1433087999, DARKORANGE: 4287365375, DARKORCHID: 2570243327, DARKRED: 2332033279, DARKSALMON: 3918953215, DARKSEAGREEN: 2411499519, DARKSLATEBLUE: 1211993087, DARKSLATEGRAY: 793726975, DARKSLATEGREY: 793726975, DARKTURQUOISE: 13554175, DARKVIOLET: 2483082239, DEEPPINK: 4279538687, DEEPSKYBLUE: 12582911, DIMGRAY: 1768516095, DIMGREY: 1768516095, DODGERBLUE: 512819199, FIREBRICK: 2988581631, FLORALWHITE: 4294635775, FORESTGREEN: 579543807, FUCHSIA: 4278255615, GAINSBORO: 3705462015, GHOSTWHITE: 4177068031, GOLD: 4292280575, GOLDENROD: 3668254975, GRAY: 2155905279, GREEN: 8388863, GREENYELLOW: 2919182335, GREY: 2155905279, HONEYDEW: 4043305215, HOTPINK: 4285117695, INDIANRED: 3445382399, INDIGO: 1258324735, IVORY: 4294963455, KHAKI: 4041641215, LAVENDER: 3873897215, LAVENDERBLUSH: 4293981695, LAWNGREEN: 2096890111, LEMONCHIFFON: 4294626815, LIGHTBLUE: 2916673279, LIGHTCORAL: 4034953471, LIGHTCYAN: 3774873599, LIGHTGOLDENRODYELLOW: 4210742015, LIGHTGRAY: 3553874943, LIGHTGREEN: 2431553791, LIGHTGREY: 3553874943, LIGHTPINK: 4290167295, LIGHTSALMON: 4288707327, LIGHTSEAGREEN: 548580095, LIGHTSKYBLUE: 2278488831, LIGHTSLATEGRAY: 2005441023, LIGHTSLATEGREY: 2005441023, LIGHTSTEELBLUE: 2965692159, LIGHTYELLOW: 4294959359, LIME: 16711935, LIMEGREEN: 852308735, LINEN: 4210091775, MAGENTA: 4278255615, MAROON: 2147483903, MEDIUMAQUAMARINE: 1724754687, MEDIUMBLUE: 52735, MEDIUMORCHID: 3126187007, MEDIUMPURPLE: 2473647103, MEDIUMSEAGREEN: 1018393087, MEDIUMSLATEBLUE: 2070474495, MEDIUMSPRINGGREEN: 16423679, MEDIUMTURQUOISE: 1221709055, MEDIUMVIOLETRED: 3340076543, MIDNIGHTBLUE: 421097727, MINTCREAM: 4127193855, MISTYROSE: 4293190143, MOCCASIN: 4293178879, NAVAJOWHITE: 4292783615, NAVY: 33023, OLDLACE: 4260751103, OLIVE: 2155872511, OLIVEDRAB: 1804477439, ORANGE: 4289003775, ORANGERED: 4282712319, ORCHID: 3664828159, PALEGOLDENROD: 4008225535, PALEGREEN: 2566625535, PALETURQUOISE: 2951671551, PALEVIOLETRED: 3681588223, PAPAYAWHIP: 4293907967, PEACHPUFF: 4292524543, PERU: 3448061951, PINK: 4290825215, PLUM: 3718307327, POWDERBLUE: 2967529215, PURPLE: 2147516671, REBECCAPURPLE: 1714657791, RED: 4278190335, ROSYBROWN: 3163525119, ROYALBLUE: 1097458175, SADDLEBROWN: 2336560127, SALMON: 4202722047, SANDYBROWN: 4104413439, SEAGREEN: 780883967, SEASHELL: 4294307583, SIENNA: 2689740287, SILVER: 3233857791, SKYBLUE: 2278484991, SLATEBLUE: 1784335871, SLATEGRAY: 1887473919, SLATEGREY: 1887473919, SNOW: 4294638335, SPRINGGREEN: 16744447, STEELBLUE: 1182971135, TAN: 3535047935, TEAL: 8421631, THISTLE: 3636451583, TOMATO: 4284696575, TRANSPARENT: 0, TURQUOISE: 1088475391, VIOLET: 4001558271, WHEAT: 4125012991, WHITE: 4294967295, WHITESMOKE: 4126537215, YELLOW: 4294902015, YELLOWGREEN: 2597139199 }, hn2 = { name: "background-clip", initialValue: "border-box", prefix: false, type: 1, parse: function(A3, e3) {
      return e3.map(function(A4) {
        if (Kt2(A4)) switch (A4.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
        return 0;
      });
    } }, gn2 = { name: "background-color", initialValue: "transparent", prefix: false, type: 3, format: "color" }, dn2 = function(A3, e3) {
      var t3 = en2.parse(A3, e3[0]), n3 = e3[1];
      return n3 && Rt2(n3) ? { color: t3, stop: n3 } : { color: t3, stop: null };
    }, wn2 = function(A3, e3) {
      var t3 = A3[0], n3 = A3[A3.length - 1];
      null === t3.stop && (t3.stop = Vt2), null === n3.stop && (n3.stop = Xt2);
      for (var r3 = [], o3 = 0, i3 = 0; i3 < A3.length; i3++) {
        var s3 = A3[i3].stop;
        if (null !== s3) {
          var a3 = Yt2(s3, e3);
          a3 > o3 ? r3.push(a3) : r3.push(o3), o3 = a3;
        } else r3.push(null);
      }
      var l3 = null;
      for (i3 = 0; i3 < r3.length; i3++) {
        var c3 = r3[i3];
        if (null === c3) null === l3 && (l3 = i3);
        else if (null !== l3) {
          for (var u3 = i3 - l3, B3 = (c3 - r3[l3 - 1]) / (u3 + 1), h3 = 1; h3 <= u3; h3++) r3[l3 + h3 - 1] = B3 * h3;
          l3 = null;
        }
      }
      return A3.map(function(A4, t4) {
        return { color: A4.color, stop: Math.max(Math.min(1, r3[t4] / e3), 0) };
      });
    }, fn2 = function(A3, e3, t3) {
      var n3 = e3 / 2, r3 = t3 / 2, o3 = Yt2(A3[0], e3) - n3, i3 = r3 - Yt2(A3[1], t3);
      return (Math.atan2(i3, o3) + 2 * Math.PI) % (2 * Math.PI);
    }, pn2 = function(A3, e3, t3) {
      var n3 = "number" == typeof A3 ? A3 : fn2(A3, e3, t3), r3 = Math.abs(e3 * Math.sin(n3)) + Math.abs(t3 * Math.cos(n3)), o3 = e3 / 2, i3 = t3 / 2, s3 = r3 / 2, a3 = Math.sin(n3 - Math.PI / 2) * s3, l3 = Math.cos(n3 - Math.PI / 2) * s3;
      return [r3, o3 - l3, o3 + l3, i3 - a3, i3 + a3];
    }, Cn2 = function(A3, e3) {
      return Math.sqrt(A3 * A3 + e3 * e3);
    }, Qn2 = function(A3, e3, t3, n3, r3) {
      return [[0, 0], [0, e3], [A3, 0], [A3, e3]].reduce(function(A4, e4) {
        var o3 = e4[0], i3 = e4[1], s3 = Cn2(t3 - o3, n3 - i3);
        return (r3 ? s3 < A4.optimumDistance : s3 > A4.optimumDistance) ? { optimumCorner: e4, optimumDistance: s3 } : A4;
      }, { optimumDistance: r3 ? 1 / 0 : -1 / 0, optimumCorner: null }).optimumCorner;
    }, vn2 = function(A3, e3, t3, n3, r3) {
      var o3 = 0, i3 = 0;
      switch (A3.size) {
        case 0:
          0 === A3.shape ? o3 = i3 = Math.min(Math.abs(e3), Math.abs(e3 - n3), Math.abs(t3), Math.abs(t3 - r3)) : 1 === A3.shape && (o3 = Math.min(Math.abs(e3), Math.abs(e3 - n3)), i3 = Math.min(Math.abs(t3), Math.abs(t3 - r3)));
          break;
        case 2:
          if (0 === A3.shape) o3 = i3 = Math.min(Cn2(e3, t3), Cn2(e3, t3 - r3), Cn2(e3 - n3, t3), Cn2(e3 - n3, t3 - r3));
          else if (1 === A3.shape) {
            var s3 = Math.min(Math.abs(t3), Math.abs(t3 - r3)) / Math.min(Math.abs(e3), Math.abs(e3 - n3)), a3 = Qn2(n3, r3, e3, t3, true), l3 = a3[0], c3 = a3[1];
            i3 = s3 * (o3 = Cn2(l3 - e3, (c3 - t3) / s3));
          }
          break;
        case 1:
          0 === A3.shape ? o3 = i3 = Math.max(Math.abs(e3), Math.abs(e3 - n3), Math.abs(t3), Math.abs(t3 - r3)) : 1 === A3.shape && (o3 = Math.max(Math.abs(e3), Math.abs(e3 - n3)), i3 = Math.max(Math.abs(t3), Math.abs(t3 - r3)));
          break;
        case 3:
          if (0 === A3.shape) o3 = i3 = Math.max(Cn2(e3, t3), Cn2(e3, t3 - r3), Cn2(e3 - n3, t3), Cn2(e3 - n3, t3 - r3));
          else if (1 === A3.shape) {
            s3 = Math.max(Math.abs(t3), Math.abs(t3 - r3)) / Math.max(Math.abs(e3), Math.abs(e3 - n3));
            var u3 = Qn2(n3, r3, e3, t3, false);
            l3 = u3[0], c3 = u3[1], i3 = s3 * (o3 = Cn2(l3 - e3, (c3 - t3) / s3));
          }
      }
      return Array.isArray(A3.size) && (o3 = Yt2(A3.size[0], n3), i3 = 2 === A3.size.length ? Yt2(A3.size[1], r3) : o3), [o3, i3];
    }, Un2 = function(A3, e3) {
      var t3 = An2(180), n3 = [];
      return Mt2(e3).forEach(function(e4, r3) {
        if (0 === r3) {
          var o3 = e4[0];
          if (20 === o3.type && -1 !== ["top", "left", "right", "bottom"].indexOf(o3.value)) return void (t3 = $t2(e4));
          if (qt2(o3)) return void (t3 = (jt2.parse(A3, o3) + An2(270)) % An2(360));
        }
        var i3 = dn2(A3, e4);
        n3.push(i3);
      }), { angle: t3, stops: n3, type: 1 };
    }, mn2 = "closest-side", Fn2 = "farthest-side", yn2 = "closest-corner", En2 = "farthest-corner", bn2 = "circle", In2 = "ellipse", Hn2 = "cover", Sn2 = "contain", xn2 = function(A3, e3) {
      var t3 = 0, n3 = 3, r3 = [], o3 = [];
      return Mt2(e3).forEach(function(e4, i3) {
        var s3 = true;
        if (0 === i3 ? s3 = e4.reduce(function(A4, e5) {
          if (Kt2(e5)) switch (e5.value) {
            case "center":
              return o3.push(Nt2), false;
            case "top":
            case "left":
              return o3.push(Vt2), false;
            case "right":
            case "bottom":
              return o3.push(Xt2), false;
          }
          else if (Rt2(e5) || Tt2(e5)) return o3.push(e5), false;
          return A4;
        }, s3) : 1 === i3 && (s3 = e4.reduce(function(A4, e5) {
          if (Kt2(e5)) switch (e5.value) {
            case bn2:
              return t3 = 0, false;
            case In2:
              return t3 = 1, false;
            case Sn2:
            case mn2:
              return n3 = 0, false;
            case Fn2:
              return n3 = 1, false;
            case yn2:
              return n3 = 2, false;
            case Hn2:
            case En2:
              return n3 = 3, false;
          }
          else if (Tt2(e5) || Rt2(e5)) return Array.isArray(n3) || (n3 = []), n3.push(e5), false;
          return A4;
        }, s3)), s3) {
          var a3 = dn2(A3, e4);
          r3.push(a3);
        }
      }), { size: n3, shape: t3, stops: r3, position: o3, type: 2 };
    }, Kn2 = function(A3) {
      return 1 === A3.type;
    }, Dn2 = function(A3) {
      return 2 === A3.type;
    }, Ln2 = { name: "image", parse: function(A3, e3) {
      if (22 === e3.type) {
        var t3 = { url: e3.value, type: 0 };
        return A3.cache.addImage(e3.value), t3;
      }
      if (18 === e3.type) {
        var n3 = Mn2[e3.name];
        if (void 0 === n3) throw new Error('Attempting to parse an unsupported image function "' + e3.name + '"');
        return n3(A3, e3.values);
      }
      throw new Error("Unsupported image type " + e3.type);
    } };
    function On2(A3) {
      return !(20 === A3.type && "none" === A3.value || 18 === A3.type && !Mn2[A3.name]);
    }
    var kn2, Mn2 = { "linear-gradient": function(A3, e3) {
      var t3 = An2(180), n3 = [];
      return Mt2(e3).forEach(function(e4, r3) {
        if (0 === r3) {
          var o3 = e4[0];
          if (20 === o3.type && "to" === o3.value) return void (t3 = $t2(e4));
          if (qt2(o3)) return void (t3 = jt2.parse(A3, o3));
        }
        var i3 = dn2(A3, e4);
        n3.push(i3);
      }), { angle: t3, stops: n3, type: 1 };
    }, "-moz-linear-gradient": Un2, "-ms-linear-gradient": Un2, "-o-linear-gradient": Un2, "-webkit-linear-gradient": Un2, "radial-gradient": function(A3, e3) {
      var t3 = 0, n3 = 3, r3 = [], o3 = [];
      return Mt2(e3).forEach(function(e4, i3) {
        var s3 = true;
        if (0 === i3) {
          var a3 = false;
          s3 = e4.reduce(function(A4, e5) {
            if (a3) if (Kt2(e5)) switch (e5.value) {
              case "center":
                return o3.push(Nt2), A4;
              case "top":
              case "left":
                return o3.push(Vt2), A4;
              case "right":
              case "bottom":
                return o3.push(Xt2), A4;
            }
            else (Rt2(e5) || Tt2(e5)) && o3.push(e5);
            else if (Kt2(e5)) switch (e5.value) {
              case bn2:
                return t3 = 0, false;
              case In2:
                return t3 = 1, false;
              case "at":
                return a3 = true, false;
              case mn2:
                return n3 = 0, false;
              case Hn2:
              case Fn2:
                return n3 = 1, false;
              case Sn2:
              case yn2:
                return n3 = 2, false;
              case En2:
                return n3 = 3, false;
            }
            else if (Tt2(e5) || Rt2(e5)) return Array.isArray(n3) || (n3 = []), n3.push(e5), false;
            return A4;
          }, s3);
        }
        if (s3) {
          var l3 = dn2(A3, e4);
          r3.push(l3);
        }
      }), { size: n3, shape: t3, stops: r3, position: o3, type: 2 };
    }, "-moz-radial-gradient": xn2, "-ms-radial-gradient": xn2, "-o-radial-gradient": xn2, "-webkit-radial-gradient": xn2, "-webkit-gradient": function(A3, e3) {
      var t3 = An2(180), n3 = [], r3 = 1, o3 = 0, i3 = 3, s3 = [];
      return Mt2(e3).forEach(function(e4, t4) {
        var o4 = e4[0];
        if (0 === t4) {
          if (Kt2(o4) && "linear" === o4.value) return void (r3 = 1);
          if (Kt2(o4) && "radial" === o4.value) return void (r3 = 2);
        }
        if (18 === o4.type) {
          if ("from" === o4.name) {
            var i4 = en2.parse(A3, o4.values[0]);
            n3.push({ stop: Vt2, color: i4 });
          } else if ("to" === o4.name) i4 = en2.parse(A3, o4.values[0]), n3.push({ stop: Xt2, color: i4 });
          else if ("color-stop" === o4.name) {
            var s4 = o4.values.filter(kt2);
            if (2 === s4.length) {
              i4 = en2.parse(A3, s4[1]);
              var a3 = s4[0];
              xt2(a3) && n3.push({ stop: { type: 16, number: 100 * a3.number, flags: a3.flags }, color: i4 });
            }
          }
        }
      }), 1 === r3 ? { angle: (t3 + An2(180)) % An2(360), stops: n3, type: r3 } : { size: i3, shape: o3, stops: n3, position: s3, type: r3 };
    } }, Pn2 = { name: "background-image", initialValue: "none", type: 1, prefix: false, parse: function(A3, e3) {
      if (0 === e3.length) return [];
      var t3 = e3[0];
      return 20 === t3.type && "none" === t3.value ? [] : e3.filter(function(A4) {
        return kt2(A4) && On2(A4);
      }).map(function(e4) {
        return Ln2.parse(A3, e4);
      });
    } }, Tn2 = { name: "background-origin", initialValue: "border-box", prefix: false, type: 1, parse: function(A3, e3) {
      return e3.map(function(A4) {
        if (Kt2(A4)) switch (A4.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
        return 0;
      });
    } }, Rn2 = { name: "background-position", initialValue: "0% 0%", type: 1, prefix: false, parse: function(A3, e3) {
      return Mt2(e3).map(function(A4) {
        return A4.filter(Rt2);
      }).map(Gt2);
    } }, Gn2 = { name: "background-repeat", initialValue: "repeat", prefix: false, type: 1, parse: function(A3, e3) {
      return Mt2(e3).map(function(A4) {
        return A4.filter(Kt2).map(function(A5) {
          return A5.value;
        }).join(" ");
      }).map(Vn2);
    } }, Vn2 = function(A3) {
      switch (A3) {
        case "no-repeat":
          return 1;
        case "repeat-x":
        case "repeat no-repeat":
          return 2;
        case "repeat-y":
        case "no-repeat repeat":
          return 3;
        default:
          return 0;
      }
    };
    !function(A3) {
      A3.AUTO = "auto", A3.CONTAIN = "contain", A3.COVER = "cover";
    }(kn2 || (kn2 = {}));
    var Nn2, Xn2 = { name: "background-size", initialValue: "0", prefix: false, type: 1, parse: function(A3, e3) {
      return Mt2(e3).map(function(A4) {
        return A4.filter(_n2);
      });
    } }, _n2 = function(A3) {
      return Kt2(A3) || Rt2(A3);
    }, Yn2 = function(A3) {
      return { name: "border-" + A3 + "-color", initialValue: "transparent", prefix: false, type: 3, format: "color" };
    }, Jn2 = Yn2("top"), Wn2 = Yn2("right"), zn2 = Yn2("bottom"), Zn2 = Yn2("left"), jn2 = function(A3) {
      return { name: "border-radius-" + A3, initialValue: "0 0", prefix: false, type: 1, parse: function(A4, e3) {
        return Gt2(e3.filter(Rt2));
      } };
    }, qn2 = jn2("top-left"), $n2 = jn2("top-right"), Ar2 = jn2("bottom-right"), er2 = jn2("bottom-left"), tr2 = function(A3) {
      return { name: "border-" + A3 + "-style", initialValue: "solid", prefix: false, type: 2, parse: function(A4, e3) {
        switch (e3) {
          case "none":
            return 0;
          case "dashed":
            return 2;
          case "dotted":
            return 3;
          case "double":
            return 4;
        }
        return 1;
      } };
    }, nr2 = tr2("top"), rr2 = tr2("right"), or2 = tr2("bottom"), ir2 = tr2("left"), sr2 = function(A3) {
      return { name: "border-" + A3 + "-width", initialValue: "0", type: 0, prefix: false, parse: function(A4, e3) {
        return St2(e3) ? e3.number : 0;
      } };
    }, ar2 = sr2("top"), lr2 = sr2("right"), cr2 = sr2("bottom"), ur2 = sr2("left"), Br2 = { name: "color", initialValue: "transparent", prefix: false, type: 3, format: "color" }, hr2 = { name: "direction", initialValue: "ltr", prefix: false, type: 2, parse: function(A3, e3) {
      return "rtl" === e3 ? 1 : 0;
    } }, gr2 = { name: "display", initialValue: "inline-block", prefix: false, type: 1, parse: function(A3, e3) {
      return e3.filter(Kt2).reduce(function(A4, e4) {
        return A4 | dr2(e4.value);
      }, 0);
    } }, dr2 = function(A3) {
      switch (A3) {
        case "block":
        case "-webkit-box":
          return 2;
        case "inline":
          return 4;
        case "run-in":
          return 8;
        case "flow":
          return 16;
        case "flow-root":
          return 32;
        case "table":
          return 64;
        case "flex":
        case "-webkit-flex":
          return 128;
        case "grid":
        case "-ms-grid":
          return 256;
        case "ruby":
          return 512;
        case "subgrid":
          return 1024;
        case "list-item":
          return 2048;
        case "table-row-group":
          return 4096;
        case "table-header-group":
          return 8192;
        case "table-footer-group":
          return 16384;
        case "table-row":
          return 32768;
        case "table-cell":
          return 65536;
        case "table-column-group":
          return 131072;
        case "table-column":
          return 262144;
        case "table-caption":
          return 524288;
        case "ruby-base":
          return 1048576;
        case "ruby-text":
          return 2097152;
        case "ruby-base-container":
          return 4194304;
        case "ruby-text-container":
          return 8388608;
        case "contents":
          return 16777216;
        case "inline-block":
          return 33554432;
        case "inline-list-item":
          return 67108864;
        case "inline-table":
          return 134217728;
        case "inline-flex":
          return 268435456;
        case "inline-grid":
          return 536870912;
      }
      return 0;
    }, wr2 = { name: "float", initialValue: "none", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "left":
          return 1;
        case "right":
          return 2;
        case "inline-start":
          return 3;
        case "inline-end":
          return 4;
      }
      return 0;
    } }, fr2 = { name: "letter-spacing", initialValue: "0", prefix: false, type: 0, parse: function(A3, e3) {
      return 20 === e3.type && "normal" === e3.value ? 0 : 17 === e3.type || 15 === e3.type ? e3.number : 0;
    } };
    !function(A3) {
      A3.NORMAL = "normal", A3.STRICT = "strict";
    }(Nn2 || (Nn2 = {}));
    var pr2, Cr2 = { name: "line-break", initialValue: "normal", prefix: false, type: 2, parse: function(A3, e3) {
      return "strict" === e3 ? Nn2.STRICT : Nn2.NORMAL;
    } }, Qr2 = { name: "line-height", initialValue: "normal", prefix: false, type: 4 }, vr2 = function(A3, e3) {
      return Kt2(A3) && "normal" === A3.value ? 1.2 * e3 : 17 === A3.type ? e3 * A3.number : Rt2(A3) ? Yt2(A3, e3) : e3;
    }, Ur2 = { name: "list-style-image", initialValue: "none", type: 0, prefix: false, parse: function(A3, e3) {
      return 20 === e3.type && "none" === e3.value ? null : Ln2.parse(A3, e3);
    } }, mr2 = { name: "list-style-position", initialValue: "outside", prefix: false, type: 2, parse: function(A3, e3) {
      return "inside" === e3 ? 0 : 1;
    } }, Fr2 = { name: "list-style-type", initialValue: "none", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "disc":
          return 0;
        case "circle":
          return 1;
        case "square":
          return 2;
        case "decimal":
          return 3;
        case "cjk-decimal":
          return 4;
        case "decimal-leading-zero":
          return 5;
        case "lower-roman":
          return 6;
        case "upper-roman":
          return 7;
        case "lower-greek":
          return 8;
        case "lower-alpha":
          return 9;
        case "upper-alpha":
          return 10;
        case "arabic-indic":
          return 11;
        case "armenian":
          return 12;
        case "bengali":
          return 13;
        case "cambodian":
          return 14;
        case "cjk-earthly-branch":
          return 15;
        case "cjk-heavenly-stem":
          return 16;
        case "cjk-ideographic":
          return 17;
        case "devanagari":
          return 18;
        case "ethiopic-numeric":
          return 19;
        case "georgian":
          return 20;
        case "gujarati":
          return 21;
        case "gurmukhi":
        case "hebrew":
          return 22;
        case "hiragana":
          return 23;
        case "hiragana-iroha":
          return 24;
        case "japanese-formal":
          return 25;
        case "japanese-informal":
          return 26;
        case "kannada":
          return 27;
        case "katakana":
          return 28;
        case "katakana-iroha":
          return 29;
        case "khmer":
          return 30;
        case "korean-hangul-formal":
          return 31;
        case "korean-hanja-formal":
          return 32;
        case "korean-hanja-informal":
          return 33;
        case "lao":
          return 34;
        case "lower-armenian":
          return 35;
        case "malayalam":
          return 36;
        case "mongolian":
          return 37;
        case "myanmar":
          return 38;
        case "oriya":
          return 39;
        case "persian":
          return 40;
        case "simp-chinese-formal":
          return 41;
        case "simp-chinese-informal":
          return 42;
        case "tamil":
          return 43;
        case "telugu":
          return 44;
        case "thai":
          return 45;
        case "tibetan":
          return 46;
        case "trad-chinese-formal":
          return 47;
        case "trad-chinese-informal":
          return 48;
        case "upper-armenian":
          return 49;
        case "disclosure-open":
          return 50;
        case "disclosure-closed":
          return 51;
        default:
          return -1;
      }
    } }, yr2 = function(A3) {
      return { name: "margin-" + A3, initialValue: "0", prefix: false, type: 4 };
    }, Er2 = yr2("top"), br2 = yr2("right"), Ir2 = yr2("bottom"), Hr2 = yr2("left"), Sr2 = { name: "overflow", initialValue: "visible", prefix: false, type: 1, parse: function(A3, e3) {
      return e3.filter(Kt2).map(function(A4) {
        switch (A4.value) {
          case "hidden":
            return 1;
          case "scroll":
            return 2;
          case "clip":
            return 3;
          case "auto":
            return 4;
          default:
            return 0;
        }
      });
    } }, xr2 = { name: "overflow-wrap", initialValue: "normal", prefix: false, type: 2, parse: function(A3, e3) {
      return "break-word" === e3 ? "break-word" : "normal";
    } }, Kr2 = function(A3) {
      return { name: "padding-" + A3, initialValue: "0", prefix: false, type: 3, format: "length-percentage" };
    }, Dr2 = Kr2("top"), Lr2 = Kr2("right"), Or2 = Kr2("bottom"), kr2 = Kr2("left"), Mr2 = { name: "text-align", initialValue: "left", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "right":
          return 2;
        case "center":
        case "justify":
          return 1;
        default:
          return 0;
      }
    } }, Pr2 = { name: "position", initialValue: "static", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "relative":
          return 1;
        case "absolute":
          return 2;
        case "fixed":
          return 3;
        case "sticky":
          return 4;
      }
      return 0;
    } }, Tr2 = { name: "text-shadow", initialValue: "none", type: 1, prefix: false, parse: function(A3, e3) {
      return 1 === e3.length && Lt2(e3[0], "none") ? [] : Mt2(e3).map(function(e4) {
        for (var t3 = { color: Bn2.TRANSPARENT, offsetX: Vt2, offsetY: Vt2, blur: Vt2 }, n3 = 0, r3 = 0; r3 < e4.length; r3++) {
          var o3 = e4[r3];
          Tt2(o3) ? (0 === n3 ? t3.offsetX = o3 : 1 === n3 ? t3.offsetY = o3 : t3.blur = o3, n3++) : t3.color = en2.parse(A3, o3);
        }
        return t3;
      });
    } }, Rr2 = { name: "text-transform", initialValue: "none", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "uppercase":
          return 2;
        case "lowercase":
          return 1;
        case "capitalize":
          return 3;
      }
      return 0;
    } }, Gr2 = { name: "transform", initialValue: "none", prefix: true, type: 0, parse: function(A3, e3) {
      if (20 === e3.type && "none" === e3.value) return null;
      if (18 === e3.type) {
        var t3 = Vr2[e3.name];
        if (void 0 === t3) throw new Error('Attempting to parse an unsupported transform function "' + e3.name + '"');
        return t3(e3.values);
      }
      return null;
    } }, Vr2 = { matrix: function(A3) {
      var e3 = A3.filter(function(A4) {
        return 17 === A4.type;
      }).map(function(A4) {
        return A4.number;
      });
      return 6 === e3.length ? e3 : null;
    }, matrix3d: function(A3) {
      var e3 = A3.filter(function(A4) {
        return 17 === A4.type;
      }).map(function(A4) {
        return A4.number;
      }), t3 = e3[0], n3 = e3[1];
      e3[2], e3[3];
      var r3 = e3[4], o3 = e3[5];
      e3[6], e3[7], e3[8], e3[9], e3[10], e3[11];
      var i3 = e3[12], s3 = e3[13];
      return e3[14], e3[15], 16 === e3.length ? [t3, n3, r3, o3, i3, s3] : null;
    } }, Nr2 = { type: 16, number: 50, flags: _A2 }, Xr2 = [Nr2, Nr2], _r2 = { name: "transform-origin", initialValue: "50% 50%", prefix: true, type: 1, parse: function(A3, e3) {
      var t3 = e3.filter(Rt2);
      return 2 !== t3.length ? Xr2 : [t3[0], t3[1]];
    } }, Yr2 = { name: "visible", initialValue: "none", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "hidden":
          return 1;
        case "collapse":
          return 2;
        default:
          return 0;
      }
    } };
    !function(A3) {
      A3.NORMAL = "normal", A3.BREAK_ALL = "break-all", A3.KEEP_ALL = "keep-all";
    }(pr2 || (pr2 = {}));
    for (var Jr2 = { name: "word-break", initialValue: "normal", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "break-all":
          return pr2.BREAK_ALL;
        case "keep-all":
          return pr2.KEEP_ALL;
        default:
          return pr2.NORMAL;
      }
    } }, Wr2 = { name: "z-index", initialValue: "auto", prefix: false, type: 0, parse: function(A3, e3) {
      if (20 === e3.type) return { auto: true, order: 0 };
      if (xt2(e3)) return { auto: false, order: e3.number };
      throw new Error("Invalid z-index number parsed");
    } }, zr2 = { name: "time", parse: function(A3, e3) {
      if (15 === e3.type) switch (e3.unit.toLowerCase()) {
        case "s":
          return 1e3 * e3.number;
        case "ms":
          return e3.number;
      }
      throw new Error("Unsupported time type");
    } }, Zr2 = { name: "opacity", initialValue: "1", type: 0, prefix: false, parse: function(A3, e3) {
      return xt2(e3) ? e3.number : 1;
    } }, jr2 = { name: "text-decoration-color", initialValue: "transparent", prefix: false, type: 3, format: "color" }, qr2 = { name: "text-decoration-line", initialValue: "none", prefix: false, type: 1, parse: function(A3, e3) {
      return e3.filter(Kt2).map(function(A4) {
        switch (A4.value) {
          case "underline":
            return 1;
          case "overline":
            return 2;
          case "line-through":
            return 3;
          case "none":
            return 4;
        }
        return 0;
      }).filter(function(A4) {
        return 0 !== A4;
      });
    } }, $r2 = { name: "font-family", initialValue: "", prefix: false, type: 1, parse: function(A3, e3) {
      var t3 = [], n3 = [];
      return e3.forEach(function(A4) {
        switch (A4.type) {
          case 20:
          case 0:
            t3.push(A4.value);
            break;
          case 17:
            t3.push(A4.number.toString());
            break;
          case 4:
            n3.push(t3.join(" ")), t3.length = 0;
        }
      }), t3.length && n3.push(t3.join(" ")), n3.map(function(A4) {
        return -1 === A4.indexOf(" ") ? A4 : "'" + A4 + "'";
      });
    } }, Ao2 = { name: "font-size", initialValue: "0", prefix: false, type: 3, format: "length" }, eo2 = { name: "font-weight", initialValue: "normal", type: 0, prefix: false, parse: function(A3, e3) {
      return xt2(e3) ? e3.number : Kt2(e3) && "bold" === e3.value ? 700 : 400;
    } }, to2 = { name: "font-variant", initialValue: "none", type: 1, prefix: false, parse: function(A3, e3) {
      return e3.filter(Kt2).map(function(A4) {
        return A4.value;
      });
    } }, no2 = { name: "font-style", initialValue: "normal", prefix: false, type: 2, parse: function(A3, e3) {
      switch (e3) {
        case "oblique":
          return "oblique";
        case "italic":
          return "italic";
        default:
          return "normal";
      }
    } }, ro2 = function(A3, e3) {
      return 0 !== (A3 & e3);
    }, oo2 = { name: "content", initialValue: "none", type: 1, prefix: false, parse: function(A3, e3) {
      if (0 === e3.length) return [];
      var t3 = e3[0];
      return 20 === t3.type && "none" === t3.value ? [] : e3;
    } }, io2 = { name: "counter-increment", initialValue: "none", prefix: true, type: 1, parse: function(A3, e3) {
      if (0 === e3.length) return null;
      var t3 = e3[0];
      if (20 === t3.type && "none" === t3.value) return null;
      for (var n3 = [], r3 = e3.filter(Ot2), o3 = 0; o3 < r3.length; o3++) {
        var i3 = r3[o3], s3 = r3[o3 + 1];
        if (20 === i3.type) {
          var a3 = s3 && xt2(s3) ? s3.number : 1;
          n3.push({ counter: i3.value, increment: a3 });
        }
      }
      return n3;
    } }, so2 = { name: "counter-reset", initialValue: "none", prefix: true, type: 1, parse: function(A3, e3) {
      if (0 === e3.length) return [];
      for (var t3 = [], n3 = e3.filter(Ot2), r3 = 0; r3 < n3.length; r3++) {
        var o3 = n3[r3], i3 = n3[r3 + 1];
        if (Kt2(o3) && "none" !== o3.value) {
          var s3 = i3 && xt2(i3) ? i3.number : 0;
          t3.push({ counter: o3.value, reset: s3 });
        }
      }
      return t3;
    } }, ao2 = { name: "duration", initialValue: "0s", prefix: false, type: 1, parse: function(A3, e3) {
      return e3.filter(St2).map(function(e4) {
        return zr2.parse(A3, e4);
      });
    } }, lo2 = { name: "quotes", initialValue: "none", prefix: true, type: 1, parse: function(A3, e3) {
      if (0 === e3.length) return null;
      var t3 = e3[0];
      if (20 === t3.type && "none" === t3.value) return null;
      var n3 = [], r3 = e3.filter(Dt2);
      if (r3.length % 2 != 0) return null;
      for (var o3 = 0; o3 < r3.length; o3 += 2) {
        var i3 = r3[o3].value, s3 = r3[o3 + 1].value;
        n3.push({ open: i3, close: s3 });
      }
      return n3;
    } }, co2 = function(A3, e3, t3) {
      if (!A3) return "";
      var n3 = A3[Math.min(e3, A3.length - 1)];
      return n3 ? t3 ? n3.open : n3.close : "";
    }, uo2 = { name: "box-shadow", initialValue: "none", type: 1, prefix: false, parse: function(A3, e3) {
      return 1 === e3.length && Lt2(e3[0], "none") ? [] : Mt2(e3).map(function(e4) {
        for (var t3 = { color: 255, offsetX: Vt2, offsetY: Vt2, blur: Vt2, spread: Vt2, inset: false }, n3 = 0, r3 = 0; r3 < e4.length; r3++) {
          var o3 = e4[r3];
          Lt2(o3, "inset") ? t3.inset = true : Tt2(o3) ? (0 === n3 ? t3.offsetX = o3 : 1 === n3 ? t3.offsetY = o3 : 2 === n3 ? t3.blur = o3 : t3.spread = o3, n3++) : t3.color = en2.parse(A3, o3);
        }
        return t3;
      });
    } }, Bo2 = { name: "paint-order", initialValue: "normal", prefix: false, type: 1, parse: function(A3, e3) {
      var t3 = [0, 1, 2], n3 = [];
      return e3.filter(Kt2).forEach(function(A4) {
        switch (A4.value) {
          case "stroke":
            n3.push(1);
            break;
          case "fill":
            n3.push(0);
            break;
          case "markers":
            n3.push(2);
        }
      }), t3.forEach(function(A4) {
        -1 === n3.indexOf(A4) && n3.push(A4);
      }), n3;
    } }, ho2 = { name: "-webkit-text-stroke-color", initialValue: "currentcolor", prefix: false, type: 3, format: "color" }, go2 = { name: "-webkit-text-stroke-width", initialValue: "0", type: 0, prefix: false, parse: function(A3, e3) {
      return St2(e3) ? e3.number : 0;
    } }, wo2 = function() {
      function A3(A4, e3) {
        var t3, n3;
        this.animationDuration = Co2(A4, ao2, e3.animationDuration), this.backgroundClip = Co2(A4, hn2, e3.backgroundClip), this.backgroundColor = Co2(A4, gn2, e3.backgroundColor), this.backgroundImage = Co2(A4, Pn2, e3.backgroundImage), this.backgroundOrigin = Co2(A4, Tn2, e3.backgroundOrigin), this.backgroundPosition = Co2(A4, Rn2, e3.backgroundPosition), this.backgroundRepeat = Co2(A4, Gn2, e3.backgroundRepeat), this.backgroundSize = Co2(A4, Xn2, e3.backgroundSize), this.borderTopColor = Co2(A4, Jn2, e3.borderTopColor), this.borderRightColor = Co2(A4, Wn2, e3.borderRightColor), this.borderBottomColor = Co2(A4, zn2, e3.borderBottomColor), this.borderLeftColor = Co2(A4, Zn2, e3.borderLeftColor), this.borderTopLeftRadius = Co2(A4, qn2, e3.borderTopLeftRadius), this.borderTopRightRadius = Co2(A4, $n2, e3.borderTopRightRadius), this.borderBottomRightRadius = Co2(A4, Ar2, e3.borderBottomRightRadius), this.borderBottomLeftRadius = Co2(A4, er2, e3.borderBottomLeftRadius), this.borderTopStyle = Co2(A4, nr2, e3.borderTopStyle), this.borderRightStyle = Co2(A4, rr2, e3.borderRightStyle), this.borderBottomStyle = Co2(A4, or2, e3.borderBottomStyle), this.borderLeftStyle = Co2(A4, ir2, e3.borderLeftStyle), this.borderTopWidth = Co2(A4, ar2, e3.borderTopWidth), this.borderRightWidth = Co2(A4, lr2, e3.borderRightWidth), this.borderBottomWidth = Co2(A4, cr2, e3.borderBottomWidth), this.borderLeftWidth = Co2(A4, ur2, e3.borderLeftWidth), this.boxShadow = Co2(A4, uo2, e3.boxShadow), this.color = Co2(A4, Br2, e3.color), this.direction = Co2(A4, hr2, e3.direction), this.display = Co2(A4, gr2, e3.display), this.float = Co2(A4, wr2, e3.cssFloat), this.fontFamily = Co2(A4, $r2, e3.fontFamily), this.fontSize = Co2(A4, Ao2, e3.fontSize), this.fontStyle = Co2(A4, no2, e3.fontStyle), this.fontVariant = Co2(A4, to2, e3.fontVariant), this.fontWeight = Co2(A4, eo2, e3.fontWeight), this.letterSpacing = Co2(A4, fr2, e3.letterSpacing), this.lineBreak = Co2(A4, Cr2, e3.lineBreak), this.lineHeight = Co2(A4, Qr2, e3.lineHeight), this.listStyleImage = Co2(A4, Ur2, e3.listStyleImage), this.listStylePosition = Co2(A4, mr2, e3.listStylePosition), this.listStyleType = Co2(A4, Fr2, e3.listStyleType), this.marginTop = Co2(A4, Er2, e3.marginTop), this.marginRight = Co2(A4, br2, e3.marginRight), this.marginBottom = Co2(A4, Ir2, e3.marginBottom), this.marginLeft = Co2(A4, Hr2, e3.marginLeft), this.opacity = Co2(A4, Zr2, e3.opacity);
        var r3 = Co2(A4, Sr2, e3.overflow);
        this.overflowX = r3[0], this.overflowY = r3[r3.length > 1 ? 1 : 0], this.overflowWrap = Co2(A4, xr2, e3.overflowWrap), this.paddingTop = Co2(A4, Dr2, e3.paddingTop), this.paddingRight = Co2(A4, Lr2, e3.paddingRight), this.paddingBottom = Co2(A4, Or2, e3.paddingBottom), this.paddingLeft = Co2(A4, kr2, e3.paddingLeft), this.paintOrder = Co2(A4, Bo2, e3.paintOrder), this.position = Co2(A4, Pr2, e3.position), this.textAlign = Co2(A4, Mr2, e3.textAlign), this.textDecorationColor = Co2(A4, jr2, null !== (t3 = e3.textDecorationColor) && void 0 !== t3 ? t3 : e3.color), this.textDecorationLine = Co2(A4, qr2, null !== (n3 = e3.textDecorationLine) && void 0 !== n3 ? n3 : e3.textDecoration), this.textShadow = Co2(A4, Tr2, e3.textShadow), this.textTransform = Co2(A4, Rr2, e3.textTransform), this.transform = Co2(A4, Gr2, e3.transform), this.transformOrigin = Co2(A4, _r2, e3.transformOrigin), this.visibility = Co2(A4, Yr2, e3.visibility), this.webkitTextStrokeColor = Co2(A4, ho2, e3.webkitTextStrokeColor), this.webkitTextStrokeWidth = Co2(A4, go2, e3.webkitTextStrokeWidth), this.wordBreak = Co2(A4, Jr2, e3.wordBreak), this.zIndex = Co2(A4, Wr2, e3.zIndex);
      }
      return A3.prototype.isVisible = function() {
        return this.display > 0 && this.opacity > 0 && 0 === this.visibility;
      }, A3.prototype.isTransparent = function() {
        return tn2(this.backgroundColor);
      }, A3.prototype.isTransformed = function() {
        return null !== this.transform;
      }, A3.prototype.isPositioned = function() {
        return 0 !== this.position;
      }, A3.prototype.isPositionedWithZIndex = function() {
        return this.isPositioned() && !this.zIndex.auto;
      }, A3.prototype.isFloating = function() {
        return 0 !== this.float;
      }, A3.prototype.isInlineLevel = function() {
        return ro2(this.display, 4) || ro2(this.display, 33554432) || ro2(this.display, 268435456) || ro2(this.display, 536870912) || ro2(this.display, 67108864) || ro2(this.display, 134217728);
      }, A3;
    }(), fo2 = /* @__PURE__ */ function() {
      function A3(A4, e3) {
        this.content = Co2(A4, oo2, e3.content), this.quotes = Co2(A4, lo2, e3.quotes);
      }
      return A3;
    }(), po2 = /* @__PURE__ */ function() {
      function A3(A4, e3) {
        this.counterIncrement = Co2(A4, io2, e3.counterIncrement), this.counterReset = Co2(A4, so2, e3.counterReset);
      }
      return A3;
    }(), Co2 = function(A3, e3, t3) {
      var n3 = new It2(), r3 = null != t3 ? t3.toString() : e3.initialValue;
      n3.write(r3);
      var o3 = new Ht2(n3.read());
      switch (e3.type) {
        case 2:
          var i3 = o3.parseComponentValue();
          return e3.parse(A3, Kt2(i3) ? i3.value : e3.initialValue);
        case 0:
          return e3.parse(A3, o3.parseComponentValue());
        case 1:
          return e3.parse(A3, o3.parseComponentValues());
        case 4:
          return o3.parseComponentValue();
        case 3:
          switch (e3.format) {
            case "angle":
              return jt2.parse(A3, o3.parseComponentValue());
            case "color":
              return en2.parse(A3, o3.parseComponentValue());
            case "image":
              return Ln2.parse(A3, o3.parseComponentValue());
            case "length":
              var s3 = o3.parseComponentValue();
              return Tt2(s3) ? s3 : Vt2;
            case "length-percentage":
              var a3 = o3.parseComponentValue();
              return Rt2(a3) ? a3 : Vt2;
            case "time":
              return zr2.parse(A3, o3.parseComponentValue());
          }
      }
    }, Qo2 = "data-html2canvas-debug", vo2 = function(A3) {
      switch (A3.getAttribute(Qo2)) {
        case "all":
          return 1;
        case "clone":
          return 2;
        case "parse":
          return 3;
        case "render":
          return 4;
        default:
          return 0;
      }
    }, Uo2 = function(A3, e3) {
      var t3 = vo2(A3);
      return 1 === t3 || e3 === t3;
    }, mo2 = /* @__PURE__ */ function() {
      function A3(A4, e3) {
        this.context = A4, this.textNodes = [], this.elements = [], this.flags = 0, Uo2(e3, 3), this.styles = new wo2(A4, window.getComputedStyle(e3, null)), cs2(e3) && (this.styles.animationDuration.some(function(A5) {
          return A5 > 0;
        }) && (e3.style.animationDuration = "0s"), null !== this.styles.transform && (e3.style.transform = "none")), this.bounds = s2(this.context, e3), Uo2(e3, 4) && (this.flags |= 16);
      }
      return A3;
    }(), Fo2 = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", yo2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Eo2 = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), bo2 = 0; bo2 < yo2.length; bo2++) Eo2[yo2.charCodeAt(bo2)] = bo2;
    for (var Io2 = function(A3) {
      var e3, t3, n3, r3, o3, i3 = 0.75 * A3.length, s3 = A3.length, a3 = 0;
      "=" === A3[A3.length - 1] && (i3--, "=" === A3[A3.length - 2] && i3--);
      var l3 = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array && void 0 !== Uint8Array.prototype.slice ? new ArrayBuffer(i3) : new Array(i3), c3 = Array.isArray(l3) ? l3 : new Uint8Array(l3);
      for (e3 = 0; e3 < s3; e3 += 4) t3 = Eo2[A3.charCodeAt(e3)], n3 = Eo2[A3.charCodeAt(e3 + 1)], r3 = Eo2[A3.charCodeAt(e3 + 2)], o3 = Eo2[A3.charCodeAt(e3 + 3)], c3[a3++] = t3 << 2 | n3 >> 4, c3[a3++] = (15 & n3) << 4 | r3 >> 2, c3[a3++] = (3 & r3) << 6 | 63 & o3;
      return l3;
    }, Ho2 = function(A3) {
      for (var e3 = A3.length, t3 = [], n3 = 0; n3 < e3; n3 += 2) t3.push(A3[n3 + 1] << 8 | A3[n3]);
      return t3;
    }, So2 = function(A3) {
      for (var e3 = A3.length, t3 = [], n3 = 0; n3 < e3; n3 += 4) t3.push(A3[n3 + 3] << 24 | A3[n3 + 2] << 16 | A3[n3 + 1] << 8 | A3[n3]);
      return t3;
    }, xo2 = 5, Ko2 = 11, Do2 = 2, Lo2 = 65536 >> xo2, Oo2 = (1 << xo2) - 1, ko2 = Lo2 + (1024 >> xo2) + 32, Mo2 = 65536 >> Ko2, Po2 = (1 << Ko2 - xo2) - 1, To2 = function(A3, e3, t3) {
      return A3.slice ? A3.slice(e3, t3) : new Uint16Array(Array.prototype.slice.call(A3, e3, t3));
    }, Ro2 = function(A3, e3, t3) {
      return A3.slice ? A3.slice(e3, t3) : new Uint32Array(Array.prototype.slice.call(A3, e3, t3));
    }, Go2 = function(A3, e3) {
      var t3 = Io2(A3), n3 = Array.isArray(t3) ? So2(t3) : new Uint32Array(t3), r3 = Array.isArray(t3) ? Ho2(t3) : new Uint16Array(t3), o3 = 24, i3 = To2(r3, o3 / 2, n3[4] / 2), s3 = 2 === n3[5] ? To2(r3, (o3 + n3[4]) / 2) : Ro2(n3, Math.ceil((o3 + n3[4]) / 4));
      return new Vo2(n3[0], n3[1], n3[2], n3[3], i3, s3);
    }, Vo2 = function() {
      function A3(A4, e3, t3, n3, r3, o3) {
        this.initialValue = A4, this.errorValue = e3, this.highStart = t3, this.highValueIndex = n3, this.index = r3, this.data = o3;
      }
      return A3.prototype.get = function(A4) {
        var e3;
        if (A4 >= 0) {
          if (A4 < 55296 || A4 > 56319 && A4 <= 65535) return e3 = ((e3 = this.index[A4 >> xo2]) << Do2) + (A4 & Oo2), this.data[e3];
          if (A4 <= 65535) return e3 = ((e3 = this.index[Lo2 + (A4 - 55296 >> xo2)]) << Do2) + (A4 & Oo2), this.data[e3];
          if (A4 < this.highStart) return e3 = ko2 - Mo2 + (A4 >> Ko2), e3 = this.index[e3], e3 += A4 >> xo2 & Po2, e3 = ((e3 = this.index[e3]) << Do2) + (A4 & Oo2), this.data[e3];
          if (A4 <= 1114111) return this.data[this.highValueIndex];
        }
        return this.errorValue;
      }, A3;
    }(), No2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Xo2 = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), _o2 = 0; _o2 < No2.length; _o2++) Xo2[No2.charCodeAt(_o2)] = _o2;
    var Yo2, Jo2 = 1, Wo2 = 2, zo2 = 3, Zo2 = 4, jo2 = 5, qo2 = 7, $o2 = 8, Ai2 = 9, ei2 = 10, ti2 = 11, ni2 = 12, ri2 = 13, oi2 = 14, ii2 = 15, si2 = function(A3) {
      for (var e3 = [], t3 = 0, n3 = A3.length; t3 < n3; ) {
        var r3 = A3.charCodeAt(t3++);
        if (r3 >= 55296 && r3 <= 56319 && t3 < n3) {
          var o3 = A3.charCodeAt(t3++);
          56320 == (64512 & o3) ? e3.push(((1023 & r3) << 10) + (1023 & o3) + 65536) : (e3.push(r3), t3--);
        } else e3.push(r3);
      }
      return e3;
    }, ai2 = function() {
      for (var A3 = [], e3 = 0; e3 < arguments.length; e3++) A3[e3] = arguments[e3];
      if (String.fromCodePoint) return String.fromCodePoint.apply(String, A3);
      var t3 = A3.length;
      if (!t3) return "";
      for (var n3 = [], r3 = -1, o3 = ""; ++r3 < t3; ) {
        var i3 = A3[r3];
        i3 <= 65535 ? n3.push(i3) : (i3 -= 65536, n3.push(55296 + (i3 >> 10), i3 % 1024 + 56320)), (r3 + 1 === t3 || n3.length > 16384) && (o3 += String.fromCharCode.apply(String, n3), n3.length = 0);
      }
      return o3;
    }, li2 = Go2(Fo2), ci2 = "×", ui2 = "÷", Bi2 = function(A3) {
      return li2.get(A3);
    }, hi2 = function(A3, e3, t3) {
      var n3 = t3 - 2, r3 = e3[n3], o3 = e3[t3 - 1], i3 = e3[t3];
      if (o3 === Wo2 && i3 === zo2) return ci2;
      if (o3 === Wo2 || o3 === zo2 || o3 === Zo2) return ui2;
      if (i3 === Wo2 || i3 === zo2 || i3 === Zo2) return ui2;
      if (o3 === $o2 && -1 !== [$o2, Ai2, ti2, ni2].indexOf(i3)) return ci2;
      if (!(o3 !== ti2 && o3 !== Ai2 || i3 !== Ai2 && i3 !== ei2)) return ci2;
      if ((o3 === ni2 || o3 === ei2) && i3 === ei2) return ci2;
      if (i3 === ri2 || i3 === jo2) return ci2;
      if (i3 === qo2) return ci2;
      if (o3 === Jo2) return ci2;
      if (o3 === ri2 && i3 === oi2) {
        for (; r3 === jo2; ) r3 = e3[--n3];
        if (r3 === oi2) return ci2;
      }
      if (o3 === ii2 && i3 === ii2) {
        for (var s3 = 0; r3 === ii2; ) s3++, r3 = e3[--n3];
        if (s3 % 2 == 0) return ci2;
      }
      return ui2;
    }, gi2 = function(A3) {
      var e3 = si2(A3), t3 = e3.length, n3 = 0, r3 = 0, o3 = e3.map(Bi2);
      return { next: function() {
        if (n3 >= t3) return { done: true, value: null };
        for (var A4 = ci2; n3 < t3 && (A4 = hi2(e3, o3, ++n3)) === ci2; ) ;
        if (A4 !== ci2 || n3 === t3) {
          var i3 = ai2.apply(null, e3.slice(r3, n3));
          return r3 = n3, { value: i3, done: false };
        }
        return { done: true, value: null };
      } };
    }, di2 = function(A3) {
      for (var e3, t3 = gi2(A3), n3 = []; !(e3 = t3.next()).done; ) e3.value && n3.push(e3.value.slice());
      return n3;
    }, wi2 = function(A3) {
      var e3 = 123;
      if (A3.createRange) {
        var t3 = A3.createRange();
        if (t3.getBoundingClientRect) {
          var n3 = A3.createElement("boundtest");
          n3.style.height = e3 + "px", n3.style.display = "block", A3.body.appendChild(n3), t3.selectNode(n3);
          var r3 = t3.getBoundingClientRect(), o3 = Math.round(r3.height);
          if (A3.body.removeChild(n3), o3 === e3) return true;
        }
      }
      return false;
    }, fi2 = function(A3) {
      var e3 = A3.createElement("boundtest");
      e3.style.width = "50px", e3.style.display = "block", e3.style.fontSize = "12px", e3.style.letterSpacing = "0px", e3.style.wordSpacing = "0px", A3.body.appendChild(e3);
      var t3 = A3.createRange();
      e3.innerHTML = "function" == typeof "".repeat ? "&#128104;".repeat(10) : "";
      var n3 = e3.firstChild, r3 = l2(n3.data).map(function(A4) {
        return c2(A4);
      }), o3 = 0, i3 = {}, s3 = r3.every(function(A4, e4) {
        t3.setStart(n3, o3), t3.setEnd(n3, o3 + A4.length);
        var r4 = t3.getBoundingClientRect();
        o3 += A4.length;
        var s4 = r4.x > i3.x || r4.y > i3.y;
        return i3 = r4, 0 === e4 || s4;
      });
      return A3.body.removeChild(e3), s3;
    }, pi2 = function() {
      return void 0 !== new Image().crossOrigin;
    }, Ci2 = function() {
      return "string" == typeof new XMLHttpRequest().responseType;
    }, Qi2 = function(A3) {
      var e3 = new Image(), t3 = A3.createElement("canvas"), n3 = t3.getContext("2d");
      if (!n3) return false;
      e3.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
      try {
        n3.drawImage(e3, 0, 0), t3.toDataURL();
      } catch (A4) {
        return false;
      }
      return true;
    }, vi2 = function(A3) {
      return 0 === A3[0] && 255 === A3[1] && 0 === A3[2] && 255 === A3[3];
    }, Ui2 = function(A3) {
      var e3 = A3.createElement("canvas"), t3 = 100;
      e3.width = t3, e3.height = t3;
      var n3 = e3.getContext("2d");
      if (!n3) return Promise.reject(false);
      n3.fillStyle = "rgb(0, 255, 0)", n3.fillRect(0, 0, t3, t3);
      var r3 = new Image(), o3 = e3.toDataURL();
      r3.src = o3;
      var i3 = mi2(t3, t3, 0, 0, r3);
      return n3.fillStyle = "red", n3.fillRect(0, 0, t3, t3), Fi2(i3).then(function(e4) {
        n3.drawImage(e4, 0, 0);
        var r4 = n3.getImageData(0, 0, t3, t3).data;
        n3.fillStyle = "red", n3.fillRect(0, 0, t3, t3);
        var i4 = A3.createElement("div");
        return i4.style.backgroundImage = "url(" + o3 + ")", i4.style.height = t3 + "px", vi2(r4) ? Fi2(mi2(t3, t3, 0, 0, i4)) : Promise.reject(false);
      }).then(function(A4) {
        return n3.drawImage(A4, 0, 0), vi2(n3.getImageData(0, 0, t3, t3).data);
      }).catch(function() {
        return false;
      });
    }, mi2 = function(A3, e3, t3, n3, r3) {
      var o3 = "http://www.w3.org/2000/svg", i3 = document.createElementNS(o3, "svg"), s3 = document.createElementNS(o3, "foreignObject");
      return i3.setAttributeNS(null, "width", A3.toString()), i3.setAttributeNS(null, "height", e3.toString()), s3.setAttributeNS(null, "width", "100%"), s3.setAttributeNS(null, "height", "100%"), s3.setAttributeNS(null, "x", t3.toString()), s3.setAttributeNS(null, "y", n3.toString()), s3.setAttributeNS(null, "externalResourcesRequired", "true"), i3.appendChild(s3), s3.appendChild(r3), i3;
    }, Fi2 = function(A3) {
      return new Promise(function(e3, t3) {
        var n3 = new Image();
        n3.onload = function() {
          return e3(n3);
        }, n3.onerror = t3, n3.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A3));
      });
    }, yi2 = { get SUPPORT_RANGE_BOUNDS() {
      var A3 = wi2(document);
      return Object.defineProperty(yi2, "SUPPORT_RANGE_BOUNDS", { value: A3 }), A3;
    }, get SUPPORT_WORD_BREAKING() {
      var A3 = yi2.SUPPORT_RANGE_BOUNDS && fi2(document);
      return Object.defineProperty(yi2, "SUPPORT_WORD_BREAKING", { value: A3 }), A3;
    }, get SUPPORT_SVG_DRAWING() {
      var A3 = Qi2(document);
      return Object.defineProperty(yi2, "SUPPORT_SVG_DRAWING", { value: A3 }), A3;
    }, get SUPPORT_FOREIGNOBJECT_DRAWING() {
      var A3 = "function" == typeof Array.from && "function" == typeof window.fetch ? Ui2(document) : Promise.resolve(false);
      return Object.defineProperty(yi2, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A3 }), A3;
    }, get SUPPORT_CORS_IMAGES() {
      var A3 = pi2();
      return Object.defineProperty(yi2, "SUPPORT_CORS_IMAGES", { value: A3 }), A3;
    }, get SUPPORT_RESPONSE_TYPE() {
      var A3 = Ci2();
      return Object.defineProperty(yi2, "SUPPORT_RESPONSE_TYPE", { value: A3 }), A3;
    }, get SUPPORT_CORS_XHR() {
      var A3 = "withCredentials" in new XMLHttpRequest();
      return Object.defineProperty(yi2, "SUPPORT_CORS_XHR", { value: A3 }), A3;
    }, get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
      var A3 = !("undefined" == typeof Intl || !Intl.Segmenter);
      return Object.defineProperty(yi2, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: A3 }), A3;
    } }, Ei2 = /* @__PURE__ */ function() {
      function A3(A4, e3) {
        this.text = A4, this.bounds = e3;
      }
      return A3;
    }(), bi2 = function(A3, e3, t3, n3) {
      var r3 = Ki2(e3, t3), o3 = [], s3 = 0;
      return r3.forEach(function(e4) {
        if (t3.textDecorationLine.length || e4.trim().length > 0) if (yi2.SUPPORT_RANGE_BOUNDS) {
          var r4 = Hi2(n3, s3, e4.length).getClientRects();
          if (r4.length > 1) {
            var a3 = Si2(e4), l3 = 0;
            a3.forEach(function(e5) {
              o3.push(new Ei2(e5, i2.fromDOMRectList(A3, Hi2(n3, l3 + s3, e5.length).getClientRects()))), l3 += e5.length;
            });
          } else o3.push(new Ei2(e4, i2.fromDOMRectList(A3, r4)));
        } else {
          var c3 = n3.splitText(e4.length);
          o3.push(new Ei2(e4, Ii2(A3, n3))), n3 = c3;
        }
        else yi2.SUPPORT_RANGE_BOUNDS || (n3 = n3.splitText(e4.length));
        s3 += e4.length;
      }), o3;
    }, Ii2 = function(A3, e3) {
      var t3 = e3.ownerDocument;
      if (t3) {
        var n3 = t3.createElement("html2canvaswrapper");
        n3.appendChild(e3.cloneNode(true));
        var r3 = e3.parentNode;
        if (r3) {
          r3.replaceChild(n3, e3);
          var o3 = s2(A3, n3);
          return n3.firstChild && r3.replaceChild(n3.firstChild, n3), o3;
        }
      }
      return i2.EMPTY;
    }, Hi2 = function(A3, e3, t3) {
      var n3 = A3.ownerDocument;
      if (!n3) throw new Error("Node has no owner document");
      var r3 = n3.createRange();
      return r3.setStart(A3, e3), r3.setEnd(A3, e3 + t3), r3;
    }, Si2 = function(A3) {
      if (yi2.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
        var e3 = new Intl.Segmenter(void 0, { granularity: "grapheme" });
        return Array.from(e3.segment(A3)).map(function(A4) {
          return A4.segment;
        });
      }
      return di2(A3);
    }, xi2 = function(A3, e3) {
      if (yi2.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
        var t3 = new Intl.Segmenter(void 0, { granularity: "word" });
        return Array.from(t3.segment(A3)).map(function(A4) {
          return A4.segment;
        });
      }
      return Li2(A3, e3);
    }, Ki2 = function(A3, e3) {
      return 0 !== e3.letterSpacing ? Si2(A3) : xi2(A3, e3);
    }, Di2 = [32, 160, 4961, 65792, 65793, 4153, 4241], Li2 = function(A3, e3) {
      for (var t3, n3 = VA2(A3, { lineBreak: e3.lineBreak, wordBreak: "break-word" === e3.overflowWrap ? "break-word" : e3.wordBreak }), r3 = [], o3 = function() {
        if (t3.value) {
          var A4 = t3.value.slice(), e4 = l2(A4), n4 = "";
          e4.forEach(function(A5) {
            -1 === Di2.indexOf(A5) ? n4 += c2(A5) : (n4.length && r3.push(n4), r3.push(c2(A5)), n4 = "");
          }), n4.length && r3.push(n4);
        }
      }; !(t3 = n3.next()).done; ) o3();
      return r3;
    }, Oi2 = /* @__PURE__ */ function() {
      function A3(A4, e3, t3) {
        this.text = ki2(e3.data, t3.textTransform), this.textBounds = bi2(A4, this.text, t3, e3);
      }
      return A3;
    }(), ki2 = function(A3, e3) {
      switch (e3) {
        case 1:
          return A3.toLowerCase();
        case 3:
          return A3.replace(Mi2, Pi2);
        case 2:
          return A3.toUpperCase();
        default:
          return A3;
      }
    }, Mi2 = /(^|\s|:|-|\(|\))([a-z])/g, Pi2 = function(A3, e3, t3) {
      return A3.length > 0 ? e3 + t3.toUpperCase() : A3;
    }, Ti2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3.src = t4.currentSrc || t4.src, n3.intrinsicWidth = t4.naturalWidth, n3.intrinsicHeight = t4.naturalHeight, n3.context.cache.addImage(n3.src), n3;
      }
      return e2(t3, A3), t3;
    }(mo2), Ri2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3.canvas = t4, n3.intrinsicWidth = t4.width, n3.intrinsicHeight = t4.height, n3;
      }
      return e2(t3, A3), t3;
    }(mo2), Gi2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this, r3 = new XMLSerializer(), o3 = s2(e3, t4);
        return t4.setAttribute("width", o3.width + "px"), t4.setAttribute("height", o3.height + "px"), n3.svg = "data:image/svg+xml," + encodeURIComponent(r3.serializeToString(t4)), n3.intrinsicWidth = t4.width.baseVal.value, n3.intrinsicHeight = t4.height.baseVal.value, n3.context.cache.addImage(n3.svg), n3;
      }
      return e2(t3, A3), t3;
    }(mo2), Vi2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3.value = t4.value, n3;
      }
      return e2(t3, A3), t3;
    }(mo2), Ni2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3.start = t4.start, n3.reversed = "boolean" == typeof t4.reversed && true === t4.reversed, n3;
      }
      return e2(t3, A3), t3;
    }(mo2), Xi2 = [{ type: 15, flags: 0, unit: "px", number: 3 }], _i2 = [{ type: 16, flags: 0, number: 50 }], Yi2 = function(A3) {
      return A3.width > A3.height ? new i2(A3.left + (A3.width - A3.height) / 2, A3.top, A3.height, A3.height) : A3.width < A3.height ? new i2(A3.left, A3.top + (A3.height - A3.width) / 2, A3.width, A3.width) : A3;
    }, Ji2 = function(A3) {
      var e3 = A3.type === Zi2 ? new Array(A3.value.length + 1).join("•") : A3.value;
      return 0 === e3.length ? A3.placeholder || "" : e3;
    }, Wi2 = "checkbox", zi2 = "radio", Zi2 = "password", ji2 = 707406591, qi2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        switch (n3.type = t4.type.toLowerCase(), n3.checked = t4.checked, n3.value = Ji2(t4), n3.type !== Wi2 && n3.type !== zi2 || (n3.styles.backgroundColor = 3739148031, n3.styles.borderTopColor = n3.styles.borderRightColor = n3.styles.borderBottomColor = n3.styles.borderLeftColor = 2779096575, n3.styles.borderTopWidth = n3.styles.borderRightWidth = n3.styles.borderBottomWidth = n3.styles.borderLeftWidth = 1, n3.styles.borderTopStyle = n3.styles.borderRightStyle = n3.styles.borderBottomStyle = n3.styles.borderLeftStyle = 1, n3.styles.backgroundClip = [0], n3.styles.backgroundOrigin = [0], n3.bounds = Yi2(n3.bounds)), n3.type) {
          case Wi2:
            n3.styles.borderTopRightRadius = n3.styles.borderTopLeftRadius = n3.styles.borderBottomRightRadius = n3.styles.borderBottomLeftRadius = Xi2;
            break;
          case zi2:
            n3.styles.borderTopRightRadius = n3.styles.borderTopLeftRadius = n3.styles.borderBottomRightRadius = n3.styles.borderBottomLeftRadius = _i2;
        }
        return n3;
      }
      return e2(t3, A3), t3;
    }(mo2), $i2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this, r3 = t4.options[t4.selectedIndex || 0];
        return n3.value = r3 && r3.text || "", n3;
      }
      return e2(t3, A3), t3;
    }(mo2), As2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3.value = t4.value, n3;
      }
      return e2(t3, A3), t3;
    }(mo2), es2 = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        n3.src = t4.src, n3.width = parseInt(t4.width, 10) || 0, n3.height = parseInt(t4.height, 10) || 0, n3.backgroundColor = n3.styles.backgroundColor;
        try {
          if (t4.contentWindow && t4.contentWindow.document && t4.contentWindow.document.documentElement) {
            n3.tree = os2(e3, t4.contentWindow.document.documentElement);
            var r3 = t4.contentWindow.document.documentElement ? un2(e3, getComputedStyle(t4.contentWindow.document.documentElement).backgroundColor) : Bn2.TRANSPARENT, o3 = t4.contentWindow.document.body ? un2(e3, getComputedStyle(t4.contentWindow.document.body).backgroundColor) : Bn2.TRANSPARENT;
            n3.backgroundColor = tn2(r3) ? tn2(o3) ? n3.styles.backgroundColor : o3 : r3;
          }
        } catch (A4) {
        }
        return n3;
      }
      return e2(t3, A3), t3;
    }(mo2), ts2 = ["OL", "UL", "MENU"], ns2 = function(A3, e3, t3, n3) {
      for (var r3 = e3.firstChild, o3 = void 0; r3; r3 = o3) if (o3 = r3.nextSibling, as2(r3) && r3.data.trim().length > 0) t3.textNodes.push(new Oi2(A3, r3, t3.styles));
      else if (ls2(r3)) if (Es2(r3) && r3.assignedNodes) r3.assignedNodes().forEach(function(e4) {
        return ns2(A3, e4, t3, n3);
      });
      else {
        var i3 = rs2(A3, r3);
        i3.styles.isVisible() && (is2(r3, i3, n3) ? i3.flags |= 4 : ss2(i3.styles) && (i3.flags |= 2), -1 !== ts2.indexOf(r3.tagName) && (i3.flags |= 8), t3.elements.push(i3), r3.slot, r3.shadowRoot ? ns2(A3, r3.shadowRoot, i3, n3) : Fs2(r3) || ws2(r3) || ys2(r3) || ns2(A3, r3, i3, n3));
      }
    }, rs2 = function(A3, e3) {
      return Qs2(e3) ? new Ti2(A3, e3) : ps2(e3) ? new Ri2(A3, e3) : ws2(e3) ? new Gi2(A3, e3) : Bs2(e3) ? new Vi2(A3, e3) : hs2(e3) ? new Ni2(A3, e3) : gs2(e3) ? new qi2(A3, e3) : ys2(e3) ? new $i2(A3, e3) : Fs2(e3) ? new As2(A3, e3) : vs2(e3) ? new es2(A3, e3) : new mo2(A3, e3);
    }, os2 = function(A3, e3) {
      var t3 = rs2(A3, e3);
      return t3.flags |= 4, ns2(A3, e3, t3, t3), t3;
    }, is2 = function(A3, e3, t3) {
      return e3.styles.isPositionedWithZIndex() || e3.styles.opacity < 1 || e3.styles.isTransformed() || fs2(A3) && t3.styles.isTransparent();
    }, ss2 = function(A3) {
      return A3.isPositioned() || A3.isFloating();
    }, as2 = function(A3) {
      return A3.nodeType === Node.TEXT_NODE;
    }, ls2 = function(A3) {
      return A3.nodeType === Node.ELEMENT_NODE;
    }, cs2 = function(A3) {
      return ls2(A3) && void 0 !== A3.style && !us2(A3);
    }, us2 = function(A3) {
      return "object" == typeof A3.className;
    }, Bs2 = function(A3) {
      return "LI" === A3.tagName;
    }, hs2 = function(A3) {
      return "OL" === A3.tagName;
    }, gs2 = function(A3) {
      return "INPUT" === A3.tagName;
    }, ds2 = function(A3) {
      return "HTML" === A3.tagName;
    }, ws2 = function(A3) {
      return "svg" === A3.tagName;
    }, fs2 = function(A3) {
      return "BODY" === A3.tagName;
    }, ps2 = function(A3) {
      return "CANVAS" === A3.tagName;
    }, Cs2 = function(A3) {
      return "VIDEO" === A3.tagName;
    }, Qs2 = function(A3) {
      return "IMG" === A3.tagName;
    }, vs2 = function(A3) {
      return "IFRAME" === A3.tagName;
    }, Us2 = function(A3) {
      return "STYLE" === A3.tagName;
    }, ms2 = function(A3) {
      return "SCRIPT" === A3.tagName;
    }, Fs2 = function(A3) {
      return "TEXTAREA" === A3.tagName;
    }, ys2 = function(A3) {
      return "SELECT" === A3.tagName;
    }, Es2 = function(A3) {
      return "SLOT" === A3.tagName;
    }, bs2 = function(A3) {
      return A3.tagName.indexOf("-") > 0;
    }, Is2 = function() {
      function A3() {
        this.counters = {};
      }
      return A3.prototype.getCounterValue = function(A4) {
        var e3 = this.counters[A4];
        return e3 && e3.length ? e3[e3.length - 1] : 1;
      }, A3.prototype.getCounterValues = function(A4) {
        var e3 = this.counters[A4];
        return e3 || [];
      }, A3.prototype.pop = function(A4) {
        var e3 = this;
        A4.forEach(function(A5) {
          return e3.counters[A5].pop();
        });
      }, A3.prototype.parse = function(A4) {
        var e3 = this, t3 = A4.counterIncrement, n3 = A4.counterReset, r3 = true;
        null !== t3 && t3.forEach(function(A5) {
          var t4 = e3.counters[A5.counter];
          t4 && 0 !== A5.increment && (r3 = false, t4.length || t4.push(1), t4[Math.max(0, t4.length - 1)] += A5.increment);
        });
        var o3 = [];
        return r3 && n3.forEach(function(A5) {
          var t4 = e3.counters[A5.counter];
          o3.push(A5.counter), t4 || (t4 = e3.counters[A5.counter] = []), t4.push(A5.reset);
        }), o3;
      }, A3;
    }(), Hs2 = { integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"] }, Ss2 = { integers: [9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], values: ["Ք", "Փ", "Ւ", "Ց", "Ր", "Տ", "Վ", "Ս", "Ռ", "Ջ", "Պ", "Չ", "Ո", "Շ", "Ն", "Յ", "Մ", "Ճ", "Ղ", "Ձ", "Հ", "Կ", "Ծ", "Խ", "Լ", "Ի", "Ժ", "Թ", "Ը", "Է", "Զ", "Ե", "Դ", "Գ", "Բ", "Ա"] }, xs2 = { integers: [1e4, 9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 19, 18, 17, 16, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], values: ["י׳", "ט׳", "ח׳", "ז׳", "ו׳", "ה׳", "ד׳", "ג׳", "ב׳", "א׳", "ת", "ש", "ר", "ק", "צ", "פ", "ע", "ס", "נ", "מ", "ל", "כ", "יט", "יח", "יז", "טז", "טו", "י", "ט", "ח", "ז", "ו", "ה", "ד", "ג", "ב", "א"] }, Ks2 = { integers: [1e4, 9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], values: ["ჵ", "ჰ", "ჯ", "ჴ", "ხ", "ჭ", "წ", "ძ", "ც", "ჩ", "შ", "ყ", "ღ", "ქ", "ფ", "ჳ", "ტ", "ს", "რ", "ჟ", "პ", "ო", "ჲ", "ნ", "მ", "ლ", "კ", "ი", "თ", "ჱ", "ზ", "ვ", "ე", "დ", "გ", "ბ", "ა"] }, Ds2 = function(A3, e3, t3, n3, r3, o3) {
      return A3 < e3 || A3 > t3 ? Ys2(A3, r3, o3.length > 0) : n3.integers.reduce(function(e4, t4, r4) {
        for (; A3 >= t4; ) A3 -= t4, e4 += n3.values[r4];
        return e4;
      }, "") + o3;
    }, Ls2 = function(A3, e3, t3, n3) {
      var r3 = "";
      do {
        t3 || A3--, r3 = n3(A3) + r3, A3 /= e3;
      } while (A3 * e3 >= e3);
      return r3;
    }, Os2 = function(A3, e3, t3, n3, r3) {
      var o3 = t3 - e3 + 1;
      return (A3 < 0 ? "-" : "") + (Ls2(Math.abs(A3), o3, n3, function(A4) {
        return c2(Math.floor(A4 % o3) + e3);
      }) + r3);
    }, ks2 = function(A3, e3, t3) {
      void 0 === t3 && (t3 = ". ");
      var n3 = e3.length;
      return Ls2(Math.abs(A3), n3, false, function(A4) {
        return e3[Math.floor(A4 % n3)];
      }) + t3;
    }, Ms2 = 1, Ps2 = 2, Ts2 = 4, Rs2 = 8, Gs2 = function(A3, e3, t3, n3, r3, o3) {
      if (A3 < -9999 || A3 > 9999) return Ys2(A3, 4, r3.length > 0);
      var i3 = Math.abs(A3), s3 = r3;
      if (0 === i3) return e3[0] + s3;
      for (var a3 = 0; i3 > 0 && a3 <= 4; a3++) {
        var l3 = i3 % 10;
        0 === l3 && ro2(o3, Ms2) && "" !== s3 ? s3 = e3[l3] + s3 : l3 > 1 || 1 === l3 && 0 === a3 || 1 === l3 && 1 === a3 && ro2(o3, Ps2) || 1 === l3 && 1 === a3 && ro2(o3, Ts2) && A3 > 100 || 1 === l3 && a3 > 1 && ro2(o3, Rs2) ? s3 = e3[l3] + (a3 > 0 ? t3[a3 - 1] : "") + s3 : 1 === l3 && a3 > 0 && (s3 = t3[a3 - 1] + s3), i3 = Math.floor(i3 / 10);
      }
      return (A3 < 0 ? n3 : "") + s3;
    }, Vs2 = "十百千萬", Ns2 = "拾佰仟萬", Xs2 = "マイナス", _s2 = "마이너스", Ys2 = function(A3, e3, t3) {
      var n3 = t3 ? ". " : "", r3 = t3 ? "、" : "", o3 = t3 ? ", " : "", i3 = t3 ? " " : "";
      switch (e3) {
        case 0:
          return "•" + i3;
        case 1:
          return "◦" + i3;
        case 2:
          return "◾" + i3;
        case 5:
          var s3 = Os2(A3, 48, 57, true, n3);
          return s3.length < 4 ? "0" + s3 : s3;
        case 4:
          return ks2(A3, "〇一二三四五六七八九", r3);
        case 6:
          return Ds2(A3, 1, 3999, Hs2, 3, n3).toLowerCase();
        case 7:
          return Ds2(A3, 1, 3999, Hs2, 3, n3);
        case 8:
          return Os2(A3, 945, 969, false, n3);
        case 9:
          return Os2(A3, 97, 122, false, n3);
        case 10:
          return Os2(A3, 65, 90, false, n3);
        case 11:
          return Os2(A3, 1632, 1641, true, n3);
        case 12:
        case 49:
          return Ds2(A3, 1, 9999, Ss2, 3, n3);
        case 35:
          return Ds2(A3, 1, 9999, Ss2, 3, n3).toLowerCase();
        case 13:
          return Os2(A3, 2534, 2543, true, n3);
        case 14:
        case 30:
          return Os2(A3, 6112, 6121, true, n3);
        case 15:
          return ks2(A3, "子丑寅卯辰巳午未申酉戌亥", r3);
        case 16:
          return ks2(A3, "甲乙丙丁戊己庚辛壬癸", r3);
        case 17:
        case 48:
          return Gs2(A3, "零一二三四五六七八九", Vs2, "負", r3, Ps2 | Ts2 | Rs2);
        case 47:
          return Gs2(A3, "零壹貳參肆伍陸柒捌玖", Ns2, "負", r3, Ms2 | Ps2 | Ts2 | Rs2);
        case 42:
          return Gs2(A3, "零一二三四五六七八九", Vs2, "负", r3, Ps2 | Ts2 | Rs2);
        case 41:
          return Gs2(A3, "零壹贰叁肆伍陆柒捌玖", Ns2, "负", r3, Ms2 | Ps2 | Ts2 | Rs2);
        case 26:
          return Gs2(A3, "〇一二三四五六七八九", "十百千万", Xs2, r3, 0);
        case 25:
          return Gs2(A3, "零壱弐参四伍六七八九", "拾百千万", Xs2, r3, Ms2 | Ps2 | Ts2);
        case 31:
          return Gs2(A3, "영일이삼사오육칠팔구", "십백천만", _s2, o3, Ms2 | Ps2 | Ts2);
        case 33:
          return Gs2(A3, "零一二三四五六七八九", "十百千萬", _s2, o3, 0);
        case 32:
          return Gs2(A3, "零壹貳參四五六七八九", "拾百千", _s2, o3, Ms2 | Ps2 | Ts2);
        case 18:
          return Os2(A3, 2406, 2415, true, n3);
        case 20:
          return Ds2(A3, 1, 19999, Ks2, 3, n3);
        case 21:
          return Os2(A3, 2790, 2799, true, n3);
        case 22:
          return Os2(A3, 2662, 2671, true, n3);
        case 22:
          return Ds2(A3, 1, 10999, xs2, 3, n3);
        case 23:
          return ks2(A3, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
        case 24:
          return ks2(A3, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
        case 27:
          return Os2(A3, 3302, 3311, true, n3);
        case 28:
          return ks2(A3, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", r3);
        case 29:
          return ks2(A3, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", r3);
        case 34:
          return Os2(A3, 3792, 3801, true, n3);
        case 37:
          return Os2(A3, 6160, 6169, true, n3);
        case 38:
          return Os2(A3, 4160, 4169, true, n3);
        case 39:
          return Os2(A3, 2918, 2927, true, n3);
        case 40:
          return Os2(A3, 1776, 1785, true, n3);
        case 43:
          return Os2(A3, 3046, 3055, true, n3);
        case 44:
          return Os2(A3, 3174, 3183, true, n3);
        case 45:
          return Os2(A3, 3664, 3673, true, n3);
        case 46:
          return Os2(A3, 3872, 3881, true, n3);
        default:
          return Os2(A3, 48, 57, true, n3);
      }
    }, Js2 = "data-html2canvas-ignore", Ws2 = function() {
      function A3(A4, e3, t3) {
        if (this.context = A4, this.options = t3, this.scrolledElements = [], this.referenceElement = e3, this.counters = new Is2(), this.quoteDepth = 0, !e3.ownerDocument) throw new Error("Cloned element does not have an owner document");
        this.documentElement = this.cloneNode(e3.ownerDocument.documentElement, false);
      }
      return A3.prototype.toIFrame = function(A4, e3) {
        var t3 = this, o3 = Zs2(A4, e3);
        if (!o3.contentWindow) return Promise.reject("Unable to find iframe window");
        var i3 = A4.defaultView.pageXOffset, s3 = A4.defaultView.pageYOffset, a3 = o3.contentWindow, l3 = a3.document, c3 = $s2(o3).then(function() {
          return n2(t3, void 0, void 0, function() {
            var A5, t4;
            return r2(this, function(n3) {
              switch (n3.label) {
                case 0:
                  return this.scrolledElements.forEach(ra2), a3 && (a3.scrollTo(e3.left, e3.top), !/(iPad|iPhone|iPod)/g.test(navigator.userAgent) || a3.scrollY === e3.top && a3.scrollX === e3.left || (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(a3.scrollX - e3.left, a3.scrollY - e3.top, 0, 0))), A5 = this.options.onclone, void 0 === (t4 = this.clonedReferenceElement) ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : l3.fonts && l3.fonts.ready ? [4, l3.fonts.ready] : [3, 2];
                case 1:
                  n3.sent(), n3.label = 2;
                case 2:
                  return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, qs2(l3)] : [3, 4];
                case 3:
                  n3.sent(), n3.label = 4;
                case 4:
                  return "function" == typeof A5 ? [2, Promise.resolve().then(function() {
                    return A5(l3, t4);
                  }).then(function() {
                    return o3;
                  })] : [2, o3];
              }
            });
          });
        });
        return l3.open(), l3.write(ta2(document.doctype) + "<html></html>"), na2(this.referenceElement.ownerDocument, i3, s3), l3.replaceChild(l3.adoptNode(this.documentElement), l3.documentElement), l3.close(), c3;
      }, A3.prototype.createElementClone = function(A4) {
        if (Uo2(A4, 2), ps2(A4)) return this.createCanvasClone(A4);
        if (Cs2(A4)) return this.createVideoClone(A4);
        if (Us2(A4)) return this.createStyleClone(A4);
        var e3 = A4.cloneNode(false);
        return Qs2(e3) && (Qs2(A4) && A4.currentSrc && A4.currentSrc !== A4.src && (e3.src = A4.currentSrc, e3.srcset = ""), "lazy" === e3.loading && (e3.loading = "eager")), bs2(e3) ? this.createCustomElementClone(e3) : e3;
      }, A3.prototype.createCustomElementClone = function(A4) {
        var e3 = document.createElement("html2canvascustomelement");
        return ea2(A4.style, e3), e3;
      }, A3.prototype.createStyleClone = function(A4) {
        try {
          var e3 = A4.sheet;
          if (e3 && e3.cssRules) {
            var t3 = [].slice.call(e3.cssRules, 0).reduce(function(A5, e4) {
              return e4 && "string" == typeof e4.cssText ? A5 + e4.cssText : A5;
            }, ""), n3 = A4.cloneNode(false);
            return n3.textContent = t3, n3;
          }
        } catch (A5) {
          if (this.context.logger.error("Unable to access cssRules property", A5), "SecurityError" !== A5.name) throw A5;
        }
        return A4.cloneNode(false);
      }, A3.prototype.createCanvasClone = function(A4) {
        var e3;
        if (this.options.inlineImages && A4.ownerDocument) {
          var t3 = A4.ownerDocument.createElement("img");
          try {
            return t3.src = A4.toDataURL(), t3;
          } catch (e4) {
            this.context.logger.info("Unable to inline canvas contents, canvas is tainted", A4);
          }
        }
        var n3 = A4.cloneNode(false);
        try {
          n3.width = A4.width, n3.height = A4.height;
          var r3 = A4.getContext("2d"), o3 = n3.getContext("2d");
          if (o3) if (!this.options.allowTaint && r3) o3.putImageData(r3.getImageData(0, 0, A4.width, A4.height), 0, 0);
          else {
            var i3 = null !== (e3 = A4.getContext("webgl2")) && void 0 !== e3 ? e3 : A4.getContext("webgl");
            if (i3) {
              var s3 = i3.getContextAttributes();
              false === (null == s3 ? void 0 : s3.preserveDrawingBuffer) && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", A4);
            }
            o3.drawImage(A4, 0, 0);
          }
          return n3;
        } catch (e4) {
          this.context.logger.info("Unable to clone canvas as it is tainted", A4);
        }
        return n3;
      }, A3.prototype.createVideoClone = function(A4) {
        var e3 = A4.ownerDocument.createElement("canvas");
        e3.width = A4.offsetWidth, e3.height = A4.offsetHeight;
        var t3 = e3.getContext("2d");
        try {
          return t3 && (t3.drawImage(A4, 0, 0, e3.width, e3.height), this.options.allowTaint || t3.getImageData(0, 0, e3.width, e3.height)), e3;
        } catch (e4) {
          this.context.logger.info("Unable to clone video as it is tainted", A4);
        }
        var n3 = A4.ownerDocument.createElement("canvas");
        return n3.width = A4.offsetWidth, n3.height = A4.offsetHeight, n3;
      }, A3.prototype.appendChildNode = function(A4, e3, t3) {
        ls2(e3) && (ms2(e3) || e3.hasAttribute(Js2) || "function" == typeof this.options.ignoreElements && this.options.ignoreElements(e3)) || this.options.copyStyles && ls2(e3) && Us2(e3) || A4.appendChild(this.cloneNode(e3, t3));
      }, A3.prototype.cloneChildNodes = function(A4, e3, t3) {
        for (var n3 = this, r3 = A4.shadowRoot ? A4.shadowRoot.firstChild : A4.firstChild; r3; r3 = r3.nextSibling) if (ls2(r3) && Es2(r3) && "function" == typeof r3.assignedNodes) {
          var o3 = r3.assignedNodes();
          o3.length && o3.forEach(function(A5) {
            return n3.appendChildNode(e3, A5, t3);
          });
        } else this.appendChildNode(e3, r3, t3);
      }, A3.prototype.cloneNode = function(A4, e3) {
        if (as2(A4)) return document.createTextNode(A4.data);
        if (!A4.ownerDocument) return A4.cloneNode(false);
        var t3 = A4.ownerDocument.defaultView;
        if (t3 && ls2(A4) && (cs2(A4) || us2(A4))) {
          var n3 = this.createElementClone(A4);
          n3.style.transitionProperty = "none";
          var r3 = t3.getComputedStyle(A4), o3 = t3.getComputedStyle(A4, ":before"), i3 = t3.getComputedStyle(A4, ":after");
          this.referenceElement === A4 && cs2(n3) && (this.clonedReferenceElement = n3), fs2(n3) && ca(n3);
          var s3 = this.counters.parse(new po2(this.context, r3)), a3 = this.resolvePseudoContent(A4, n3, o3, Yo2.BEFORE);
          bs2(A4) && (e3 = true), Cs2(A4) || this.cloneChildNodes(A4, n3, e3), a3 && n3.insertBefore(a3, n3.firstChild);
          var l3 = this.resolvePseudoContent(A4, n3, i3, Yo2.AFTER);
          return l3 && n3.appendChild(l3), this.counters.pop(s3), (r3 && (this.options.copyStyles || us2(A4)) && !vs2(A4) || e3) && ea2(r3, n3), 0 === A4.scrollTop && 0 === A4.scrollLeft || this.scrolledElements.push([n3, A4.scrollLeft, A4.scrollTop]), (Fs2(A4) || ys2(A4)) && (Fs2(n3) || ys2(n3)) && (n3.value = A4.value), n3;
        }
        return A4.cloneNode(false);
      }, A3.prototype.resolvePseudoContent = function(A4, e3, t3, n3) {
        var r3 = this;
        if (t3) {
          var o3 = t3.content, i3 = e3.ownerDocument;
          if (i3 && o3 && "none" !== o3 && "-moz-alt-content" !== o3 && "none" !== t3.display) {
            this.counters.parse(new po2(this.context, t3));
            var s3 = new fo2(this.context, t3), a3 = i3.createElement("html2canvaspseudoelement");
            ea2(t3, a3), s3.content.forEach(function(e4) {
              if (0 === e4.type) a3.appendChild(i3.createTextNode(e4.value));
              else if (22 === e4.type) {
                var t4 = i3.createElement("img");
                t4.src = e4.value, t4.style.opacity = "1", a3.appendChild(t4);
              } else if (18 === e4.type) {
                if ("attr" === e4.name) {
                  var n4 = e4.values.filter(Kt2);
                  n4.length && a3.appendChild(i3.createTextNode(A4.getAttribute(n4[0].value) || ""));
                } else if ("counter" === e4.name) {
                  var o4 = e4.values.filter(kt2), l4 = o4[0], c3 = o4[1];
                  if (l4 && Kt2(l4)) {
                    var u3 = r3.counters.getCounterValue(l4.value), B3 = c3 && Kt2(c3) ? Fr2.parse(r3.context, c3.value) : 3;
                    a3.appendChild(i3.createTextNode(Ys2(u3, B3, false)));
                  }
                } else if ("counters" === e4.name) {
                  var h3 = e4.values.filter(kt2), g3 = (l4 = h3[0], h3[1]);
                  if (c3 = h3[2], l4 && Kt2(l4)) {
                    var d3 = r3.counters.getCounterValues(l4.value), w3 = c3 && Kt2(c3) ? Fr2.parse(r3.context, c3.value) : 3, f3 = g3 && 0 === g3.type ? g3.value : "", p3 = d3.map(function(A5) {
                      return Ys2(A5, w3, false);
                    }).join(f3);
                    a3.appendChild(i3.createTextNode(p3));
                  }
                }
              } else if (20 === e4.type) switch (e4.value) {
                case "open-quote":
                  a3.appendChild(i3.createTextNode(co2(s3.quotes, r3.quoteDepth++, true)));
                  break;
                case "close-quote":
                  a3.appendChild(i3.createTextNode(co2(s3.quotes, --r3.quoteDepth, false)));
                  break;
                default:
                  a3.appendChild(i3.createTextNode(e4.value));
              }
            }), a3.className = sa2 + " " + aa;
            var l3 = n3 === Yo2.BEFORE ? " " + sa2 : " " + aa;
            return us2(e3) ? e3.className.baseValue += l3 : e3.className += l3, a3;
          }
        }
      }, A3.destroy = function(A4) {
        return !!A4.parentNode && (A4.parentNode.removeChild(A4), true);
      }, A3;
    }();
    !function(A3) {
      A3[A3.BEFORE = 0] = "BEFORE", A3[A3.AFTER = 1] = "AFTER";
    }(Yo2 || (Yo2 = {}));
    var zs2, Zs2 = function(A3, e3) {
      var t3 = A3.createElement("iframe");
      return t3.className = "html2canvas-container", t3.style.visibility = "hidden", t3.style.position = "fixed", t3.style.left = "-10000px", t3.style.top = "0px", t3.style.border = "0", t3.width = e3.width.toString(), t3.height = e3.height.toString(), t3.scrolling = "no", t3.setAttribute(Js2, "true"), A3.body.appendChild(t3), t3;
    }, js2 = function(A3) {
      return new Promise(function(e3) {
        A3.complete ? e3() : A3.src ? (A3.onload = e3, A3.onerror = e3) : e3();
      });
    }, qs2 = function(A3) {
      return Promise.all([].slice.call(A3.images, 0).map(js2));
    }, $s2 = function(A3) {
      return new Promise(function(e3, t3) {
        var n3 = A3.contentWindow;
        if (!n3) return t3("No window assigned for iframe");
        var r3 = n3.document;
        n3.onload = A3.onload = function() {
          n3.onload = A3.onload = null;
          var t4 = setInterval(function() {
            r3.body.childNodes.length > 0 && "complete" === r3.readyState && (clearInterval(t4), e3(A3));
          }, 50);
        };
      });
    }, Aa2 = ["all", "d", "content"], ea2 = function(A3, e3) {
      for (var t3 = A3.length - 1; t3 >= 0; t3--) {
        var n3 = A3.item(t3);
        -1 === Aa2.indexOf(n3) && e3.style.setProperty(n3, A3.getPropertyValue(n3));
      }
      return e3;
    }, ta2 = function(A3) {
      var e3 = "";
      return A3 && (e3 += "<!DOCTYPE ", A3.name && (e3 += A3.name), A3.internalSubset && (e3 += A3.internalSubset), A3.publicId && (e3 += '"' + A3.publicId + '"'), A3.systemId && (e3 += '"' + A3.systemId + '"'), e3 += ">"), e3;
    }, na2 = function(A3, e3, t3) {
      A3 && A3.defaultView && (e3 !== A3.defaultView.pageXOffset || t3 !== A3.defaultView.pageYOffset) && A3.defaultView.scrollTo(e3, t3);
    }, ra2 = function(A3) {
      var e3 = A3[0], t3 = A3[1], n3 = A3[2];
      e3.scrollLeft = t3, e3.scrollTop = n3;
    }, oa2 = ":before", ia2 = ":after", sa2 = "___html2canvas___pseudoelement_before", aa = "___html2canvas___pseudoelement_after", la = '{\n    content: "" !important;\n    display: none !important;\n}', ca = function(A3) {
      ua(A3, "." + sa2 + oa2 + la + "\n         ." + aa + ia2 + la);
    }, ua = function(A3, e3) {
      var t3 = A3.ownerDocument;
      if (t3) {
        var n3 = t3.createElement("style");
        n3.textContent = e3, A3.appendChild(n3);
      }
    }, Ba = function() {
      function A3() {
      }
      return A3.getOrigin = function(e3) {
        var t3 = A3._link;
        return t3 ? (t3.href = e3, t3.href = t3.href, t3.protocol + t3.hostname + t3.port) : "about:blank";
      }, A3.isSameOrigin = function(e3) {
        return A3.getOrigin(e3) === A3._origin;
      }, A3.setContext = function(e3) {
        A3._link = e3.document.createElement("a"), A3._origin = A3.getOrigin(e3.location.href);
      }, A3._origin = "about:blank", A3;
    }(), ha = function() {
      function A3(A4, e3) {
        this.context = A4, this._options = e3, this._cache = {};
      }
      return A3.prototype.addImage = function(A4) {
        var e3 = Promise.resolve();
        return this.has(A4) ? e3 : Qa(A4) || fa(A4) ? ((this._cache[A4] = this.loadImage(A4)).catch(function() {
        }), e3) : e3;
      }, A3.prototype.match = function(A4) {
        return this._cache[A4];
      }, A3.prototype.loadImage = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3, t3, n3, o3, i3 = this;
          return r2(this, function(r3) {
            switch (r3.label) {
              case 0:
                return e3 = Ba.isSameOrigin(A4), t3 = !pa(A4) && true === this._options.useCORS && yi2.SUPPORT_CORS_IMAGES && !e3, n3 = !pa(A4) && !e3 && !Qa(A4) && "string" == typeof this._options.proxy && yi2.SUPPORT_CORS_XHR && !t3, e3 || false !== this._options.allowTaint || pa(A4) || Qa(A4) || n3 || t3 ? (o3 = A4, n3 ? [4, this.proxy(o3)] : [3, 2]) : [2];
              case 1:
                o3 = r3.sent(), r3.label = 2;
              case 2:
                return this.context.logger.debug("Added image " + A4.substring(0, 256)), [4, new Promise(function(A5, e4) {
                  var n4 = new Image();
                  n4.onload = function() {
                    return A5(n4);
                  }, n4.onerror = e4, (Ca(o3) || t3) && (n4.crossOrigin = "anonymous"), n4.src = o3, true === n4.complete && setTimeout(function() {
                    return A5(n4);
                  }, 500), i3._options.imageTimeout > 0 && setTimeout(function() {
                    return e4("Timed out (" + i3._options.imageTimeout + "ms) loading image");
                  }, i3._options.imageTimeout);
                })];
              case 3:
                return [2, r3.sent()];
            }
          });
        });
      }, A3.prototype.has = function(A4) {
        return void 0 !== this._cache[A4];
      }, A3.prototype.keys = function() {
        return Promise.resolve(Object.keys(this._cache));
      }, A3.prototype.proxy = function(A4) {
        var e3 = this, t3 = this._options.proxy;
        if (!t3) throw new Error("No proxy defined");
        var n3 = A4.substring(0, 256);
        return new Promise(function(r3, o3) {
          var i3 = yi2.SUPPORT_RESPONSE_TYPE ? "blob" : "text", s3 = new XMLHttpRequest();
          s3.onload = function() {
            if (200 === s3.status) if ("text" === i3) r3(s3.response);
            else {
              var A5 = new FileReader();
              A5.addEventListener("load", function() {
                return r3(A5.result);
              }, false), A5.addEventListener("error", function(A6) {
                return o3(A6);
              }, false), A5.readAsDataURL(s3.response);
            }
            else o3("Failed to proxy resource " + n3 + " with status code " + s3.status);
          }, s3.onerror = o3;
          var a3 = t3.indexOf("?") > -1 ? "&" : "?";
          if (s3.open("GET", "" + t3 + a3 + "url=" + encodeURIComponent(A4) + "&responseType=" + i3), "text" !== i3 && s3 instanceof XMLHttpRequest && (s3.responseType = i3), e3._options.imageTimeout) {
            var l3 = e3._options.imageTimeout;
            s3.timeout = l3, s3.ontimeout = function() {
              return o3("Timed out (" + l3 + "ms) proxying " + n3);
            };
          }
          s3.send();
        });
      }, A3;
    }(), ga = /^data:image\/svg\+xml/i, da = /^data:image\/.*;base64,/i, wa = /^data:image\/.*/i, fa = function(A3) {
      return yi2.SUPPORT_SVG_DRAWING || !va(A3);
    }, pa = function(A3) {
      return wa.test(A3);
    }, Ca = function(A3) {
      return da.test(A3);
    }, Qa = function(A3) {
      return "blob" === A3.substr(0, 4);
    }, va = function(A3) {
      return "svg" === A3.substr(-3).toLowerCase() || ga.test(A3);
    }, Ua = function() {
      function A3(A4, e3) {
        this.type = 0, this.x = A4, this.y = e3;
      }
      return A3.prototype.add = function(e3, t3) {
        return new A3(this.x + e3, this.y + t3);
      }, A3;
    }(), ma = function(A3, e3, t3) {
      return new Ua(A3.x + (e3.x - A3.x) * t3, A3.y + (e3.y - A3.y) * t3);
    }, Fa = function() {
      function A3(A4, e3, t3, n3) {
        this.type = 1, this.start = A4, this.startControl = e3, this.endControl = t3, this.end = n3;
      }
      return A3.prototype.subdivide = function(e3, t3) {
        var n3 = ma(this.start, this.startControl, e3), r3 = ma(this.startControl, this.endControl, e3), o3 = ma(this.endControl, this.end, e3), i3 = ma(n3, r3, e3), s3 = ma(r3, o3, e3), a3 = ma(i3, s3, e3);
        return t3 ? new A3(this.start, n3, i3, a3) : new A3(a3, s3, o3, this.end);
      }, A3.prototype.add = function(e3, t3) {
        return new A3(this.start.add(e3, t3), this.startControl.add(e3, t3), this.endControl.add(e3, t3), this.end.add(e3, t3));
      }, A3.prototype.reverse = function() {
        return new A3(this.end, this.endControl, this.startControl, this.start);
      }, A3;
    }(), ya = function(A3) {
      return 1 === A3.type;
    }, Ea = /* @__PURE__ */ function() {
      function A3(A4) {
        var e3 = A4.styles, t3 = A4.bounds, n3 = _t2(e3.borderTopLeftRadius, t3.width, t3.height), r3 = n3[0], o3 = n3[1], i3 = _t2(e3.borderTopRightRadius, t3.width, t3.height), s3 = i3[0], a3 = i3[1], l3 = _t2(e3.borderBottomRightRadius, t3.width, t3.height), c3 = l3[0], u3 = l3[1], B3 = _t2(e3.borderBottomLeftRadius, t3.width, t3.height), h3 = B3[0], g3 = B3[1], d3 = [];
        d3.push((r3 + s3) / t3.width), d3.push((h3 + c3) / t3.width), d3.push((o3 + g3) / t3.height), d3.push((a3 + u3) / t3.height);
        var w3 = Math.max.apply(Math, d3);
        w3 > 1 && (r3 /= w3, o3 /= w3, s3 /= w3, a3 /= w3, c3 /= w3, u3 /= w3, h3 /= w3, g3 /= w3);
        var f3 = t3.width - s3, p3 = t3.height - u3, C3 = t3.width - c3, Q3 = t3.height - g3, v3 = e3.borderTopWidth, U3 = e3.borderRightWidth, m3 = e3.borderBottomWidth, F3 = e3.borderLeftWidth, y3 = Yt2(e3.paddingTop, A4.bounds.width), E3 = Yt2(e3.paddingRight, A4.bounds.width), b3 = Yt2(e3.paddingBottom, A4.bounds.width), I3 = Yt2(e3.paddingLeft, A4.bounds.width);
        this.topLeftBorderDoubleOuterBox = r3 > 0 || o3 > 0 ? ba(t3.left + F3 / 3, t3.top + v3 / 3, r3 - F3 / 3, o3 - v3 / 3, zs2.TOP_LEFT) : new Ua(t3.left + F3 / 3, t3.top + v3 / 3), this.topRightBorderDoubleOuterBox = r3 > 0 || o3 > 0 ? ba(t3.left + f3, t3.top + v3 / 3, s3 - U3 / 3, a3 - v3 / 3, zs2.TOP_RIGHT) : new Ua(t3.left + t3.width - U3 / 3, t3.top + v3 / 3), this.bottomRightBorderDoubleOuterBox = c3 > 0 || u3 > 0 ? ba(t3.left + C3, t3.top + p3, c3 - U3 / 3, u3 - m3 / 3, zs2.BOTTOM_RIGHT) : new Ua(t3.left + t3.width - U3 / 3, t3.top + t3.height - m3 / 3), this.bottomLeftBorderDoubleOuterBox = h3 > 0 || g3 > 0 ? ba(t3.left + F3 / 3, t3.top + Q3, h3 - F3 / 3, g3 - m3 / 3, zs2.BOTTOM_LEFT) : new Ua(t3.left + F3 / 3, t3.top + t3.height - m3 / 3), this.topLeftBorderDoubleInnerBox = r3 > 0 || o3 > 0 ? ba(t3.left + 2 * F3 / 3, t3.top + 2 * v3 / 3, r3 - 2 * F3 / 3, o3 - 2 * v3 / 3, zs2.TOP_LEFT) : new Ua(t3.left + 2 * F3 / 3, t3.top + 2 * v3 / 3), this.topRightBorderDoubleInnerBox = r3 > 0 || o3 > 0 ? ba(t3.left + f3, t3.top + 2 * v3 / 3, s3 - 2 * U3 / 3, a3 - 2 * v3 / 3, zs2.TOP_RIGHT) : new Ua(t3.left + t3.width - 2 * U3 / 3, t3.top + 2 * v3 / 3), this.bottomRightBorderDoubleInnerBox = c3 > 0 || u3 > 0 ? ba(t3.left + C3, t3.top + p3, c3 - 2 * U3 / 3, u3 - 2 * m3 / 3, zs2.BOTTOM_RIGHT) : new Ua(t3.left + t3.width - 2 * U3 / 3, t3.top + t3.height - 2 * m3 / 3), this.bottomLeftBorderDoubleInnerBox = h3 > 0 || g3 > 0 ? ba(t3.left + 2 * F3 / 3, t3.top + Q3, h3 - 2 * F3 / 3, g3 - 2 * m3 / 3, zs2.BOTTOM_LEFT) : new Ua(t3.left + 2 * F3 / 3, t3.top + t3.height - 2 * m3 / 3), this.topLeftBorderStroke = r3 > 0 || o3 > 0 ? ba(t3.left + F3 / 2, t3.top + v3 / 2, r3 - F3 / 2, o3 - v3 / 2, zs2.TOP_LEFT) : new Ua(t3.left + F3 / 2, t3.top + v3 / 2), this.topRightBorderStroke = r3 > 0 || o3 > 0 ? ba(t3.left + f3, t3.top + v3 / 2, s3 - U3 / 2, a3 - v3 / 2, zs2.TOP_RIGHT) : new Ua(t3.left + t3.width - U3 / 2, t3.top + v3 / 2), this.bottomRightBorderStroke = c3 > 0 || u3 > 0 ? ba(t3.left + C3, t3.top + p3, c3 - U3 / 2, u3 - m3 / 2, zs2.BOTTOM_RIGHT) : new Ua(t3.left + t3.width - U3 / 2, t3.top + t3.height - m3 / 2), this.bottomLeftBorderStroke = h3 > 0 || g3 > 0 ? ba(t3.left + F3 / 2, t3.top + Q3, h3 - F3 / 2, g3 - m3 / 2, zs2.BOTTOM_LEFT) : new Ua(t3.left + F3 / 2, t3.top + t3.height - m3 / 2), this.topLeftBorderBox = r3 > 0 || o3 > 0 ? ba(t3.left, t3.top, r3, o3, zs2.TOP_LEFT) : new Ua(t3.left, t3.top), this.topRightBorderBox = s3 > 0 || a3 > 0 ? ba(t3.left + f3, t3.top, s3, a3, zs2.TOP_RIGHT) : new Ua(t3.left + t3.width, t3.top), this.bottomRightBorderBox = c3 > 0 || u3 > 0 ? ba(t3.left + C3, t3.top + p3, c3, u3, zs2.BOTTOM_RIGHT) : new Ua(t3.left + t3.width, t3.top + t3.height), this.bottomLeftBorderBox = h3 > 0 || g3 > 0 ? ba(t3.left, t3.top + Q3, h3, g3, zs2.BOTTOM_LEFT) : new Ua(t3.left, t3.top + t3.height), this.topLeftPaddingBox = r3 > 0 || o3 > 0 ? ba(t3.left + F3, t3.top + v3, Math.max(0, r3 - F3), Math.max(0, o3 - v3), zs2.TOP_LEFT) : new Ua(t3.left + F3, t3.top + v3), this.topRightPaddingBox = s3 > 0 || a3 > 0 ? ba(t3.left + Math.min(f3, t3.width - U3), t3.top + v3, f3 > t3.width + U3 ? 0 : Math.max(0, s3 - U3), Math.max(0, a3 - v3), zs2.TOP_RIGHT) : new Ua(t3.left + t3.width - U3, t3.top + v3), this.bottomRightPaddingBox = c3 > 0 || u3 > 0 ? ba(t3.left + Math.min(C3, t3.width - F3), t3.top + Math.min(p3, t3.height - m3), Math.max(0, c3 - U3), Math.max(0, u3 - m3), zs2.BOTTOM_RIGHT) : new Ua(t3.left + t3.width - U3, t3.top + t3.height - m3), this.bottomLeftPaddingBox = h3 > 0 || g3 > 0 ? ba(t3.left + F3, t3.top + Math.min(Q3, t3.height - m3), Math.max(0, h3 - F3), Math.max(0, g3 - m3), zs2.BOTTOM_LEFT) : new Ua(t3.left + F3, t3.top + t3.height - m3), this.topLeftContentBox = r3 > 0 || o3 > 0 ? ba(t3.left + F3 + I3, t3.top + v3 + y3, Math.max(0, r3 - (F3 + I3)), Math.max(0, o3 - (v3 + y3)), zs2.TOP_LEFT) : new Ua(t3.left + F3 + I3, t3.top + v3 + y3), this.topRightContentBox = s3 > 0 || a3 > 0 ? ba(t3.left + Math.min(f3, t3.width + F3 + I3), t3.top + v3 + y3, f3 > t3.width + F3 + I3 ? 0 : s3 - F3 + I3, a3 - (v3 + y3), zs2.TOP_RIGHT) : new Ua(t3.left + t3.width - (U3 + E3), t3.top + v3 + y3), this.bottomRightContentBox = c3 > 0 || u3 > 0 ? ba(t3.left + Math.min(C3, t3.width - (F3 + I3)), t3.top + Math.min(p3, t3.height + v3 + y3), Math.max(0, c3 - (U3 + E3)), u3 - (m3 + b3), zs2.BOTTOM_RIGHT) : new Ua(t3.left + t3.width - (U3 + E3), t3.top + t3.height - (m3 + b3)), this.bottomLeftContentBox = h3 > 0 || g3 > 0 ? ba(t3.left + F3 + I3, t3.top + Q3, Math.max(0, h3 - (F3 + I3)), g3 - (m3 + b3), zs2.BOTTOM_LEFT) : new Ua(t3.left + F3 + I3, t3.top + t3.height - (m3 + b3));
      }
      return A3;
    }();
    !function(A3) {
      A3[A3.TOP_LEFT = 0] = "TOP_LEFT", A3[A3.TOP_RIGHT = 1] = "TOP_RIGHT", A3[A3.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A3[A3.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
    }(zs2 || (zs2 = {}));
    var ba = function(A3, e3, t3, n3, r3) {
      var o3 = (Math.sqrt(2) - 1) / 3 * 4, i3 = t3 * o3, s3 = n3 * o3, a3 = A3 + t3, l3 = e3 + n3;
      switch (r3) {
        case zs2.TOP_LEFT:
          return new Fa(new Ua(A3, l3), new Ua(A3, l3 - s3), new Ua(a3 - i3, e3), new Ua(a3, e3));
        case zs2.TOP_RIGHT:
          return new Fa(new Ua(A3, e3), new Ua(A3 + i3, e3), new Ua(a3, l3 - s3), new Ua(a3, l3));
        case zs2.BOTTOM_RIGHT:
          return new Fa(new Ua(a3, e3), new Ua(a3, e3 + s3), new Ua(A3 + i3, l3), new Ua(A3, l3));
        case zs2.BOTTOM_LEFT:
        default:
          return new Fa(new Ua(a3, l3), new Ua(a3 - i3, l3), new Ua(A3, e3 + s3), new Ua(A3, e3));
      }
    }, Ia = function(A3) {
      return [A3.topLeftBorderBox, A3.topRightBorderBox, A3.bottomRightBorderBox, A3.bottomLeftBorderBox];
    }, Ha = function(A3) {
      return [A3.topLeftContentBox, A3.topRightContentBox, A3.bottomRightContentBox, A3.bottomLeftContentBox];
    }, Sa = function(A3) {
      return [A3.topLeftPaddingBox, A3.topRightPaddingBox, A3.bottomRightPaddingBox, A3.bottomLeftPaddingBox];
    }, xa = /* @__PURE__ */ function() {
      function A3(A4, e3, t3) {
        this.offsetX = A4, this.offsetY = e3, this.matrix = t3, this.type = 0, this.target = 6;
      }
      return A3;
    }(), Ka = /* @__PURE__ */ function() {
      function A3(A4, e3) {
        this.path = A4, this.target = e3, this.type = 1;
      }
      return A3;
    }(), Da = /* @__PURE__ */ function() {
      function A3(A4) {
        this.opacity = A4, this.type = 2, this.target = 6;
      }
      return A3;
    }(), La = function(A3) {
      return 0 === A3.type;
    }, Oa = function(A3) {
      return 1 === A3.type;
    }, ka = function(A3) {
      return 2 === A3.type;
    }, Ma = function(A3, e3) {
      return A3.length === e3.length && A3.some(function(A4, t3) {
        return A4 === e3[t3];
      });
    }, Pa = function(A3, e3, t3, n3, r3) {
      return A3.map(function(A4, o3) {
        switch (o3) {
          case 0:
            return A4.add(e3, t3);
          case 1:
            return A4.add(e3 + n3, t3);
          case 2:
            return A4.add(e3 + n3, t3 + r3);
          case 3:
            return A4.add(e3, t3 + r3);
        }
        return A4;
      });
    }, Ta = /* @__PURE__ */ function() {
      function A3(A4) {
        this.element = A4, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
      }
      return A3;
    }(), Ra = function() {
      function A3(A4, e3) {
        if (this.container = A4, this.parent = e3, this.effects = [], this.curves = new Ea(this.container), this.container.styles.opacity < 1 && this.effects.push(new Da(this.container.styles.opacity)), null !== this.container.styles.transform) {
          var t3 = this.container.bounds.left + this.container.styles.transformOrigin[0].number, n3 = this.container.bounds.top + this.container.styles.transformOrigin[1].number, r3 = this.container.styles.transform;
          this.effects.push(new xa(t3, n3, r3));
        }
        if (0 !== this.container.styles.overflowX) {
          var o3 = Ia(this.curves), i3 = Sa(this.curves);
          Ma(o3, i3) ? this.effects.push(new Ka(o3, 6)) : (this.effects.push(new Ka(o3, 2)), this.effects.push(new Ka(i3, 4)));
        }
      }
      return A3.prototype.getEffects = function(A4) {
        for (var e3 = -1 === [2, 3].indexOf(this.container.styles.position), t3 = this.parent, n3 = this.effects.slice(0); t3; ) {
          var r3 = t3.effects.filter(function(A5) {
            return !Oa(A5);
          });
          if (e3 || 0 !== t3.container.styles.position || !t3.parent) {
            if (n3.unshift.apply(n3, r3), e3 = -1 === [2, 3].indexOf(t3.container.styles.position), 0 !== t3.container.styles.overflowX) {
              var o3 = Ia(t3.curves), i3 = Sa(t3.curves);
              Ma(o3, i3) || n3.unshift(new Ka(i3, 6));
            }
          } else n3.unshift.apply(n3, r3);
          t3 = t3.parent;
        }
        return n3.filter(function(e4) {
          return ro2(e4.target, A4);
        });
      }, A3;
    }(), Ga = function(A3, e3, t3, n3) {
      A3.container.elements.forEach(function(r3) {
        var o3 = ro2(r3.flags, 4), i3 = ro2(r3.flags, 2), s3 = new Ra(r3, A3);
        ro2(r3.styles.display, 2048) && n3.push(s3);
        var a3 = ro2(r3.flags, 8) ? [] : n3;
        if (o3 || i3) {
          var l3 = o3 || r3.styles.isPositioned() ? t3 : e3, c3 = new Ta(s3);
          if (r3.styles.isPositioned() || r3.styles.opacity < 1 || r3.styles.isTransformed()) {
            var u3 = r3.styles.zIndex.order;
            if (u3 < 0) {
              var B3 = 0;
              l3.negativeZIndex.some(function(A4, e4) {
                return u3 > A4.element.container.styles.zIndex.order ? (B3 = e4, false) : B3 > 0;
              }), l3.negativeZIndex.splice(B3, 0, c3);
            } else if (u3 > 0) {
              var h3 = 0;
              l3.positiveZIndex.some(function(A4, e4) {
                return u3 >= A4.element.container.styles.zIndex.order ? (h3 = e4 + 1, false) : h3 > 0;
              }), l3.positiveZIndex.splice(h3, 0, c3);
            } else l3.zeroOrAutoZIndexOrTransformedOrOpacity.push(c3);
          } else r3.styles.isFloating() ? l3.nonPositionedFloats.push(c3) : l3.nonPositionedInlineLevel.push(c3);
          Ga(s3, c3, o3 ? c3 : t3, a3);
        } else r3.styles.isInlineLevel() ? e3.inlineLevel.push(s3) : e3.nonInlineLevel.push(s3), Ga(s3, e3, t3, a3);
        ro2(r3.flags, 8) && Va(r3, a3);
      });
    }, Va = function(A3, e3) {
      for (var t3 = A3 instanceof Ni2 ? A3.start : 1, n3 = A3 instanceof Ni2 && A3.reversed, r3 = 0; r3 < e3.length; r3++) {
        var o3 = e3[r3];
        o3.container instanceof Vi2 && "number" == typeof o3.container.value && 0 !== o3.container.value && (t3 = o3.container.value), o3.listValue = Ys2(t3, o3.container.styles.listStyleType, true), t3 += n3 ? -1 : 1;
      }
    }, Na = function(A3) {
      var e3 = new Ra(A3, null), t3 = new Ta(e3), n3 = [];
      return Ga(e3, t3, t3, n3), Va(e3.container, n3), t3;
    }, Xa = function(A3, e3) {
      switch (e3) {
        case 0:
          return za(A3.topLeftBorderBox, A3.topLeftPaddingBox, A3.topRightBorderBox, A3.topRightPaddingBox);
        case 1:
          return za(A3.topRightBorderBox, A3.topRightPaddingBox, A3.bottomRightBorderBox, A3.bottomRightPaddingBox);
        case 2:
          return za(A3.bottomRightBorderBox, A3.bottomRightPaddingBox, A3.bottomLeftBorderBox, A3.bottomLeftPaddingBox);
        default:
          return za(A3.bottomLeftBorderBox, A3.bottomLeftPaddingBox, A3.topLeftBorderBox, A3.topLeftPaddingBox);
      }
    }, _a = function(A3, e3) {
      switch (e3) {
        case 0:
          return za(A3.topLeftBorderBox, A3.topLeftBorderDoubleOuterBox, A3.topRightBorderBox, A3.topRightBorderDoubleOuterBox);
        case 1:
          return za(A3.topRightBorderBox, A3.topRightBorderDoubleOuterBox, A3.bottomRightBorderBox, A3.bottomRightBorderDoubleOuterBox);
        case 2:
          return za(A3.bottomRightBorderBox, A3.bottomRightBorderDoubleOuterBox, A3.bottomLeftBorderBox, A3.bottomLeftBorderDoubleOuterBox);
        default:
          return za(A3.bottomLeftBorderBox, A3.bottomLeftBorderDoubleOuterBox, A3.topLeftBorderBox, A3.topLeftBorderDoubleOuterBox);
      }
    }, Ya = function(A3, e3) {
      switch (e3) {
        case 0:
          return za(A3.topLeftBorderDoubleInnerBox, A3.topLeftPaddingBox, A3.topRightBorderDoubleInnerBox, A3.topRightPaddingBox);
        case 1:
          return za(A3.topRightBorderDoubleInnerBox, A3.topRightPaddingBox, A3.bottomRightBorderDoubleInnerBox, A3.bottomRightPaddingBox);
        case 2:
          return za(A3.bottomRightBorderDoubleInnerBox, A3.bottomRightPaddingBox, A3.bottomLeftBorderDoubleInnerBox, A3.bottomLeftPaddingBox);
        default:
          return za(A3.bottomLeftBorderDoubleInnerBox, A3.bottomLeftPaddingBox, A3.topLeftBorderDoubleInnerBox, A3.topLeftPaddingBox);
      }
    }, Ja = function(A3, e3) {
      switch (e3) {
        case 0:
          return Wa(A3.topLeftBorderStroke, A3.topRightBorderStroke);
        case 1:
          return Wa(A3.topRightBorderStroke, A3.bottomRightBorderStroke);
        case 2:
          return Wa(A3.bottomRightBorderStroke, A3.bottomLeftBorderStroke);
        default:
          return Wa(A3.bottomLeftBorderStroke, A3.topLeftBorderStroke);
      }
    }, Wa = function(A3, e3) {
      var t3 = [];
      return ya(A3) ? t3.push(A3.subdivide(0.5, false)) : t3.push(A3), ya(e3) ? t3.push(e3.subdivide(0.5, true)) : t3.push(e3), t3;
    }, za = function(A3, e3, t3, n3) {
      var r3 = [];
      return ya(A3) ? r3.push(A3.subdivide(0.5, false)) : r3.push(A3), ya(t3) ? r3.push(t3.subdivide(0.5, true)) : r3.push(t3), ya(n3) ? r3.push(n3.subdivide(0.5, true).reverse()) : r3.push(n3), ya(e3) ? r3.push(e3.subdivide(0.5, false).reverse()) : r3.push(e3), r3;
    }, Za = function(A3) {
      var e3 = A3.bounds, t3 = A3.styles;
      return e3.add(t3.borderLeftWidth, t3.borderTopWidth, -(t3.borderRightWidth + t3.borderLeftWidth), -(t3.borderTopWidth + t3.borderBottomWidth));
    }, ja = function(A3) {
      var e3 = A3.styles, t3 = A3.bounds, n3 = Yt2(e3.paddingLeft, t3.width), r3 = Yt2(e3.paddingRight, t3.width), o3 = Yt2(e3.paddingTop, t3.width), i3 = Yt2(e3.paddingBottom, t3.width);
      return t3.add(n3 + e3.borderLeftWidth, o3 + e3.borderTopWidth, -(e3.borderRightWidth + e3.borderLeftWidth + n3 + r3), -(e3.borderTopWidth + e3.borderBottomWidth + o3 + i3));
    }, qa = function(A3, e3) {
      return 0 === A3 ? e3.bounds : 2 === A3 ? ja(e3) : Za(e3);
    }, $a = function(A3, e3) {
      return 0 === A3 ? e3.bounds : 2 === A3 ? ja(e3) : Za(e3);
    }, Al = function(A3, e3, t3) {
      var n3 = qa(rl(A3.styles.backgroundOrigin, e3), A3), r3 = $a(rl(A3.styles.backgroundClip, e3), A3), o3 = nl(rl(A3.styles.backgroundSize, e3), t3, n3), i3 = o3[0], s3 = o3[1], a3 = _t2(rl(A3.styles.backgroundPosition, e3), n3.width - i3, n3.height - s3);
      return [ol(rl(A3.styles.backgroundRepeat, e3), a3, o3, n3, r3), Math.round(n3.left + a3[0]), Math.round(n3.top + a3[1]), i3, s3];
    }, el = function(A3) {
      return Kt2(A3) && A3.value === kn2.AUTO;
    }, tl = function(A3) {
      return "number" == typeof A3;
    }, nl = function(A3, e3, t3) {
      var n3 = e3[0], r3 = e3[1], o3 = e3[2], i3 = A3[0], s3 = A3[1];
      if (!i3) return [0, 0];
      if (Rt2(i3) && s3 && Rt2(s3)) return [Yt2(i3, t3.width), Yt2(s3, t3.height)];
      var a3 = tl(o3);
      if (Kt2(i3) && (i3.value === kn2.CONTAIN || i3.value === kn2.COVER)) return tl(o3) ? t3.width / t3.height < o3 != (i3.value === kn2.COVER) ? [t3.width, t3.width / o3] : [t3.height * o3, t3.height] : [t3.width, t3.height];
      var l3 = tl(n3), c3 = tl(r3), u3 = l3 || c3;
      if (el(i3) && (!s3 || el(s3))) return l3 && c3 ? [n3, r3] : a3 || u3 ? u3 && a3 ? [l3 ? n3 : r3 * o3, c3 ? r3 : n3 / o3] : [l3 ? n3 : t3.width, c3 ? r3 : t3.height] : [t3.width, t3.height];
      if (a3) {
        var B3 = 0, h3 = 0;
        return Rt2(i3) ? B3 = Yt2(i3, t3.width) : Rt2(s3) && (h3 = Yt2(s3, t3.height)), el(i3) ? B3 = h3 * o3 : s3 && !el(s3) || (h3 = B3 / o3), [B3, h3];
      }
      var g3 = null, d3 = null;
      if (Rt2(i3) ? g3 = Yt2(i3, t3.width) : s3 && Rt2(s3) && (d3 = Yt2(s3, t3.height)), null === g3 || s3 && !el(s3) || (d3 = l3 && c3 ? g3 / n3 * r3 : t3.height), null !== d3 && el(i3) && (g3 = l3 && c3 ? d3 / r3 * n3 : t3.width), null !== g3 && null !== d3) return [g3, d3];
      throw new Error("Unable to calculate background-size for element");
    }, rl = function(A3, e3) {
      var t3 = A3[e3];
      return void 0 === t3 ? A3[0] : t3;
    }, ol = function(A3, e3, t3, n3, r3) {
      var o3 = e3[0], i3 = e3[1], s3 = t3[0], a3 = t3[1];
      switch (A3) {
        case 2:
          return [new Ua(Math.round(n3.left), Math.round(n3.top + i3)), new Ua(Math.round(n3.left + n3.width), Math.round(n3.top + i3)), new Ua(Math.round(n3.left + n3.width), Math.round(a3 + n3.top + i3)), new Ua(Math.round(n3.left), Math.round(a3 + n3.top + i3))];
        case 3:
          return [new Ua(Math.round(n3.left + o3), Math.round(n3.top)), new Ua(Math.round(n3.left + o3 + s3), Math.round(n3.top)), new Ua(Math.round(n3.left + o3 + s3), Math.round(n3.height + n3.top)), new Ua(Math.round(n3.left + o3), Math.round(n3.height + n3.top))];
        case 1:
          return [new Ua(Math.round(n3.left + o3), Math.round(n3.top + i3)), new Ua(Math.round(n3.left + o3 + s3), Math.round(n3.top + i3)), new Ua(Math.round(n3.left + o3 + s3), Math.round(n3.top + i3 + a3)), new Ua(Math.round(n3.left + o3), Math.round(n3.top + i3 + a3))];
        default:
          return [new Ua(Math.round(r3.left), Math.round(r3.top)), new Ua(Math.round(r3.left + r3.width), Math.round(r3.top)), new Ua(Math.round(r3.left + r3.width), Math.round(r3.height + r3.top)), new Ua(Math.round(r3.left), Math.round(r3.height + r3.top))];
      }
    }, il = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", sl = "Hidden Text", al = function() {
      function A3(A4) {
        this._data = {}, this._document = A4;
      }
      return A3.prototype.parseMetrics = function(A4, e3) {
        var t3 = this._document.createElement("div"), n3 = this._document.createElement("img"), r3 = this._document.createElement("span"), o3 = this._document.body;
        t3.style.visibility = "hidden", t3.style.fontFamily = A4, t3.style.fontSize = e3, t3.style.margin = "0", t3.style.padding = "0", t3.style.whiteSpace = "nowrap", o3.appendChild(t3), n3.src = il, n3.width = 1, n3.height = 1, n3.style.margin = "0", n3.style.padding = "0", n3.style.verticalAlign = "baseline", r3.style.fontFamily = A4, r3.style.fontSize = e3, r3.style.margin = "0", r3.style.padding = "0", r3.appendChild(this._document.createTextNode(sl)), t3.appendChild(r3), t3.appendChild(n3);
        var i3 = n3.offsetTop - r3.offsetTop + 2;
        t3.removeChild(r3), t3.appendChild(this._document.createTextNode(sl)), t3.style.lineHeight = "normal", n3.style.verticalAlign = "super";
        var s3 = n3.offsetTop - t3.offsetTop + 2;
        return o3.removeChild(t3), { baseline: i3, middle: s3 };
      }, A3.prototype.getMetrics = function(A4, e3) {
        var t3 = A4 + " " + e3;
        return void 0 === this._data[t3] && (this._data[t3] = this.parseMetrics(A4, e3)), this._data[t3];
      }, A3;
    }(), ll = /* @__PURE__ */ function() {
      function A3(A4, e3) {
        this.context = A4, this.options = e3;
      }
      return A3;
    }(), cl = 1e4, ul = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3._activeEffects = [], n3.canvas = t4.canvas ? t4.canvas : document.createElement("canvas"), n3.ctx = n3.canvas.getContext("2d"), t4.canvas || (n3.canvas.width = Math.floor(t4.width * t4.scale), n3.canvas.height = Math.floor(t4.height * t4.scale), n3.canvas.style.width = t4.width + "px", n3.canvas.style.height = t4.height + "px"), n3.fontMetrics = new al(document), n3.ctx.scale(n3.options.scale, n3.options.scale), n3.ctx.translate(-t4.x, -t4.y), n3.ctx.textBaseline = "bottom", n3._activeEffects = [], n3.context.logger.debug("Canvas renderer initialized (" + t4.width + "x" + t4.height + ") with scale " + t4.scale), n3;
      }
      return e2(t3, A3), t3.prototype.applyEffects = function(A4) {
        for (var e3 = this; this._activeEffects.length; ) this.popEffect();
        A4.forEach(function(A5) {
          return e3.applyEffect(A5);
        });
      }, t3.prototype.applyEffect = function(A4) {
        this.ctx.save(), ka(A4) && (this.ctx.globalAlpha = A4.opacity), La(A4) && (this.ctx.translate(A4.offsetX, A4.offsetY), this.ctx.transform(A4.matrix[0], A4.matrix[1], A4.matrix[2], A4.matrix[3], A4.matrix[4], A4.matrix[5]), this.ctx.translate(-A4.offsetX, -A4.offsetY)), Oa(A4) && (this.path(A4.path), this.ctx.clip()), this._activeEffects.push(A4);
      }, t3.prototype.popEffect = function() {
        this._activeEffects.pop(), this.ctx.restore();
      }, t3.prototype.renderStack = function(A4) {
        return n2(this, void 0, void 0, function() {
          return r2(this, function(e3) {
            switch (e3.label) {
              case 0:
                return A4.element.container.styles.isVisible() ? [4, this.renderStackContent(A4)] : [3, 2];
              case 1:
                e3.sent(), e3.label = 2;
              case 2:
                return [2];
            }
          });
        });
      }, t3.prototype.renderNode = function(A4) {
        return n2(this, void 0, void 0, function() {
          return r2(this, function(e3) {
            switch (e3.label) {
              case 0:
                return ro2(A4.container.flags, 16), A4.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(A4)] : [3, 3];
              case 1:
                return e3.sent(), [4, this.renderNodeContent(A4)];
              case 2:
                e3.sent(), e3.label = 3;
              case 3:
                return [2];
            }
          });
        });
      }, t3.prototype.renderTextWithLetterSpacing = function(A4, e3, t4) {
        var n3 = this;
        0 === e3 ? this.ctx.fillText(A4.text, A4.bounds.left, A4.bounds.top + t4) : Si2(A4.text).reduce(function(e4, r3) {
          return n3.ctx.fillText(r3, e4, A4.bounds.top + t4), e4 + n3.ctx.measureText(r3).width;
        }, A4.bounds.left);
      }, t3.prototype.createFontStyle = function(A4) {
        var e3 = A4.fontVariant.filter(function(A5) {
          return "normal" === A5 || "small-caps" === A5;
        }).join(""), t4 = wl(A4.fontFamily).join(", "), n3 = St2(A4.fontSize) ? "" + A4.fontSize.number + A4.fontSize.unit : A4.fontSize.number + "px";
        return [[A4.fontStyle, e3, A4.fontWeight, n3, t4].join(" "), t4, n3];
      }, t3.prototype.renderTextNode = function(A4, e3) {
        return n2(this, void 0, void 0, function() {
          var t4, n3, o3, i3, s3, a3, l3, c3, u3 = this;
          return r2(this, function(r3) {
            return t4 = this.createFontStyle(e3), n3 = t4[0], o3 = t4[1], i3 = t4[2], this.ctx.font = n3, this.ctx.direction = 1 === e3.direction ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", s3 = this.fontMetrics.getMetrics(o3, i3), a3 = s3.baseline, l3 = s3.middle, c3 = e3.paintOrder, A4.textBounds.forEach(function(A5) {
              c3.forEach(function(t5) {
                switch (t5) {
                  case 0:
                    u3.ctx.fillStyle = nn2(e3.color), u3.renderTextWithLetterSpacing(A5, e3.letterSpacing, a3);
                    var n4 = e3.textShadow;
                    n4.length && A5.text.trim().length && (n4.slice(0).reverse().forEach(function(t6) {
                      u3.ctx.shadowColor = nn2(t6.color), u3.ctx.shadowOffsetX = t6.offsetX.number * u3.options.scale, u3.ctx.shadowOffsetY = t6.offsetY.number * u3.options.scale, u3.ctx.shadowBlur = t6.blur.number, u3.renderTextWithLetterSpacing(A5, e3.letterSpacing, a3);
                    }), u3.ctx.shadowColor = "", u3.ctx.shadowOffsetX = 0, u3.ctx.shadowOffsetY = 0, u3.ctx.shadowBlur = 0), e3.textDecorationLine.length && (u3.ctx.fillStyle = nn2(e3.textDecorationColor || e3.color), e3.textDecorationLine.forEach(function(e4) {
                      switch (e4) {
                        case 1:
                          u3.ctx.fillRect(A5.bounds.left, Math.round(A5.bounds.top + a3), A5.bounds.width, 1);
                          break;
                        case 2:
                          u3.ctx.fillRect(A5.bounds.left, Math.round(A5.bounds.top), A5.bounds.width, 1);
                          break;
                        case 3:
                          u3.ctx.fillRect(A5.bounds.left, Math.ceil(A5.bounds.top + l3), A5.bounds.width, 1);
                      }
                    }));
                    break;
                  case 1:
                    e3.webkitTextStrokeWidth && A5.text.trim().length && (u3.ctx.strokeStyle = nn2(e3.webkitTextStrokeColor), u3.ctx.lineWidth = e3.webkitTextStrokeWidth, u3.ctx.lineJoin = window.chrome ? "miter" : "round", u3.ctx.strokeText(A5.text, A5.bounds.left, A5.bounds.top + a3)), u3.ctx.strokeStyle = "", u3.ctx.lineWidth = 0, u3.ctx.lineJoin = "miter";
                }
              });
            }), [2];
          });
        });
      }, t3.prototype.renderReplacedElement = function(A4, e3, t4) {
        if (t4 && A4.intrinsicWidth > 0 && A4.intrinsicHeight > 0) {
          var n3 = ja(A4), r3 = Sa(e3);
          this.path(r3), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(t4, 0, 0, A4.intrinsicWidth, A4.intrinsicHeight, n3.left, n3.top, n3.width, n3.height), this.ctx.restore();
        }
      }, t3.prototype.renderNodeContent = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3, n3, o3, s3, a3, l3, c3, u3, B3, h3, g3, d3, w3, f3, p3, C3, Q3, v3;
          return r2(this, function(r3) {
            switch (r3.label) {
              case 0:
                this.applyEffects(A4.getEffects(4)), e3 = A4.container, n3 = A4.curves, o3 = e3.styles, s3 = 0, a3 = e3.textNodes, r3.label = 1;
              case 1:
                return s3 < a3.length ? (l3 = a3[s3], [4, this.renderTextNode(l3, o3)]) : [3, 4];
              case 2:
                r3.sent(), r3.label = 3;
              case 3:
                return s3++, [3, 1];
              case 4:
                if (!(e3 instanceof Ti2)) return [3, 8];
                r3.label = 5;
              case 5:
                return r3.trys.push([5, 7, , 8]), [4, this.context.cache.match(e3.src)];
              case 6:
                return p3 = r3.sent(), this.renderReplacedElement(e3, n3, p3), [3, 8];
              case 7:
                return r3.sent(), this.context.logger.error("Error loading image " + e3.src), [3, 8];
              case 8:
                if (e3 instanceof Ri2 && this.renderReplacedElement(e3, n3, e3.canvas), !(e3 instanceof Gi2)) return [3, 12];
                r3.label = 9;
              case 9:
                return r3.trys.push([9, 11, , 12]), [4, this.context.cache.match(e3.svg)];
              case 10:
                return p3 = r3.sent(), this.renderReplacedElement(e3, n3, p3), [3, 12];
              case 11:
                return r3.sent(), this.context.logger.error("Error loading svg " + e3.svg.substring(0, 255)), [3, 12];
              case 12:
                return e3 instanceof es2 && e3.tree ? [4, new t3(this.context, { scale: this.options.scale, backgroundColor: e3.backgroundColor, x: 0, y: 0, width: e3.width, height: e3.height }).render(e3.tree)] : [3, 14];
              case 13:
                c3 = r3.sent(), e3.width && e3.height && this.ctx.drawImage(c3, 0, 0, e3.width, e3.height, e3.bounds.left, e3.bounds.top, e3.bounds.width, e3.bounds.height), r3.label = 14;
              case 14:
                if (e3 instanceof qi2 && (u3 = Math.min(e3.bounds.width, e3.bounds.height), e3.type === Wi2 ? e3.checked && (this.ctx.save(), this.path([new Ua(e3.bounds.left + 0.39363 * u3, e3.bounds.top + 0.79 * u3), new Ua(e3.bounds.left + 0.16 * u3, e3.bounds.top + 0.5549 * u3), new Ua(e3.bounds.left + 0.27347 * u3, e3.bounds.top + 0.44071 * u3), new Ua(e3.bounds.left + 0.39694 * u3, e3.bounds.top + 0.5649 * u3), new Ua(e3.bounds.left + 0.72983 * u3, e3.bounds.top + 0.23 * u3), new Ua(e3.bounds.left + 0.84 * u3, e3.bounds.top + 0.34085 * u3), new Ua(e3.bounds.left + 0.39363 * u3, e3.bounds.top + 0.79 * u3)]), this.ctx.fillStyle = nn2(ji2), this.ctx.fill(), this.ctx.restore()) : e3.type === zi2 && e3.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(e3.bounds.left + u3 / 2, e3.bounds.top + u3 / 2, u3 / 4, 0, 2 * Math.PI, true), this.ctx.fillStyle = nn2(ji2), this.ctx.fill(), this.ctx.restore())), Bl(e3) && e3.value.length) {
                  switch (B3 = this.createFontStyle(o3), Q3 = B3[0], h3 = B3[1], g3 = this.fontMetrics.getMetrics(Q3, h3).baseline, this.ctx.font = Q3, this.ctx.fillStyle = nn2(o3.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = gl(e3.styles.textAlign), v3 = ja(e3), d3 = 0, e3.styles.textAlign) {
                    case 1:
                      d3 += v3.width / 2;
                      break;
                    case 2:
                      d3 += v3.width;
                  }
                  w3 = v3.add(d3, 0, 0, -v3.height / 2 + 1), this.ctx.save(), this.path([new Ua(v3.left, v3.top), new Ua(v3.left + v3.width, v3.top), new Ua(v3.left + v3.width, v3.top + v3.height), new Ua(v3.left, v3.top + v3.height)]), this.ctx.clip(), this.renderTextWithLetterSpacing(new Ei2(e3.value, w3), o3.letterSpacing, g3), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
                }
                if (!ro2(e3.styles.display, 2048)) return [3, 20];
                if (null === e3.styles.listStyleImage) return [3, 19];
                if (0 !== (f3 = e3.styles.listStyleImage).type) return [3, 18];
                p3 = void 0, C3 = f3.url, r3.label = 15;
              case 15:
                return r3.trys.push([15, 17, , 18]), [4, this.context.cache.match(C3)];
              case 16:
                return p3 = r3.sent(), this.ctx.drawImage(p3, e3.bounds.left - (p3.width + 10), e3.bounds.top), [3, 18];
              case 17:
                return r3.sent(), this.context.logger.error("Error loading list-style-image " + C3), [3, 18];
              case 18:
                return [3, 20];
              case 19:
                A4.listValue && -1 !== e3.styles.listStyleType && (Q3 = this.createFontStyle(o3)[0], this.ctx.font = Q3, this.ctx.fillStyle = nn2(o3.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", v3 = new i2(e3.bounds.left, e3.bounds.top + Yt2(e3.styles.paddingTop, e3.bounds.width), e3.bounds.width, vr2(o3.lineHeight, o3.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new Ei2(A4.listValue, v3), o3.letterSpacing, vr2(o3.lineHeight, o3.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), r3.label = 20;
              case 20:
                return [2];
            }
          });
        });
      }, t3.prototype.renderStackContent = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3, t4, n3, o3, i3, s3, a3, l3, c3, u3, B3, h3, g3, d3, w3;
          return r2(this, function(r3) {
            switch (r3.label) {
              case 0:
                return ro2(A4.element.container.flags, 16), [4, this.renderNodeBackgroundAndBorders(A4.element)];
              case 1:
                r3.sent(), e3 = 0, t4 = A4.negativeZIndex, r3.label = 2;
              case 2:
                return e3 < t4.length ? (w3 = t4[e3], [4, this.renderStack(w3)]) : [3, 5];
              case 3:
                r3.sent(), r3.label = 4;
              case 4:
                return e3++, [3, 2];
              case 5:
                return [4, this.renderNodeContent(A4.element)];
              case 6:
                r3.sent(), n3 = 0, o3 = A4.nonInlineLevel, r3.label = 7;
              case 7:
                return n3 < o3.length ? (w3 = o3[n3], [4, this.renderNode(w3)]) : [3, 10];
              case 8:
                r3.sent(), r3.label = 9;
              case 9:
                return n3++, [3, 7];
              case 10:
                i3 = 0, s3 = A4.nonPositionedFloats, r3.label = 11;
              case 11:
                return i3 < s3.length ? (w3 = s3[i3], [4, this.renderStack(w3)]) : [3, 14];
              case 12:
                r3.sent(), r3.label = 13;
              case 13:
                return i3++, [3, 11];
              case 14:
                a3 = 0, l3 = A4.nonPositionedInlineLevel, r3.label = 15;
              case 15:
                return a3 < l3.length ? (w3 = l3[a3], [4, this.renderStack(w3)]) : [3, 18];
              case 16:
                r3.sent(), r3.label = 17;
              case 17:
                return a3++, [3, 15];
              case 18:
                c3 = 0, u3 = A4.inlineLevel, r3.label = 19;
              case 19:
                return c3 < u3.length ? (w3 = u3[c3], [4, this.renderNode(w3)]) : [3, 22];
              case 20:
                r3.sent(), r3.label = 21;
              case 21:
                return c3++, [3, 19];
              case 22:
                B3 = 0, h3 = A4.zeroOrAutoZIndexOrTransformedOrOpacity, r3.label = 23;
              case 23:
                return B3 < h3.length ? (w3 = h3[B3], [4, this.renderStack(w3)]) : [3, 26];
              case 24:
                r3.sent(), r3.label = 25;
              case 25:
                return B3++, [3, 23];
              case 26:
                g3 = 0, d3 = A4.positiveZIndex, r3.label = 27;
              case 27:
                return g3 < d3.length ? (w3 = d3[g3], [4, this.renderStack(w3)]) : [3, 30];
              case 28:
                r3.sent(), r3.label = 29;
              case 29:
                return g3++, [3, 27];
              case 30:
                return [2];
            }
          });
        });
      }, t3.prototype.mask = function(A4) {
        this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(this.canvas.width, 0), this.ctx.lineTo(this.canvas.width, this.canvas.height), this.ctx.lineTo(0, this.canvas.height), this.ctx.lineTo(0, 0), this.formatPath(A4.slice(0).reverse()), this.ctx.closePath();
      }, t3.prototype.path = function(A4) {
        this.ctx.beginPath(), this.formatPath(A4), this.ctx.closePath();
      }, t3.prototype.formatPath = function(A4) {
        var e3 = this;
        A4.forEach(function(A5, t4) {
          var n3 = ya(A5) ? A5.start : A5;
          0 === t4 ? e3.ctx.moveTo(n3.x, n3.y) : e3.ctx.lineTo(n3.x, n3.y), ya(A5) && e3.ctx.bezierCurveTo(A5.startControl.x, A5.startControl.y, A5.endControl.x, A5.endControl.y, A5.end.x, A5.end.y);
        });
      }, t3.prototype.renderRepeat = function(A4, e3, t4, n3) {
        this.path(A4), this.ctx.fillStyle = e3, this.ctx.translate(t4, n3), this.ctx.fill(), this.ctx.translate(-t4, -n3);
      }, t3.prototype.resizeImage = function(A4, e3, t4) {
        var n3;
        if (A4.width === e3 && A4.height === t4) return A4;
        var r3 = (null !== (n3 = this.canvas.ownerDocument) && void 0 !== n3 ? n3 : document).createElement("canvas");
        return r3.width = Math.max(1, e3), r3.height = Math.max(1, t4), r3.getContext("2d").drawImage(A4, 0, 0, A4.width, A4.height, 0, 0, e3, t4), r3;
      }, t3.prototype.renderBackgroundImage = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3, t4, n3, o3, i3, s3;
          return r2(this, function(a3) {
            switch (a3.label) {
              case 0:
                e3 = A4.styles.backgroundImage.length - 1, t4 = function(t5) {
                  var o4, i4, s4, a4, l3, c3, u3, B3, h3, g3, d3, w3, f3, p3, C3, Q3, v3, U3, m3, F3, y3, E3, b3, I3, H3, S3, x3, K3, D3, L3, O3;
                  return r2(this, function(r3) {
                    switch (r3.label) {
                      case 0:
                        if (0 !== t5.type) return [3, 5];
                        o4 = void 0, i4 = t5.url, r3.label = 1;
                      case 1:
                        return r3.trys.push([1, 3, , 4]), [4, n3.context.cache.match(i4)];
                      case 2:
                        return o4 = r3.sent(), [3, 4];
                      case 3:
                        return r3.sent(), n3.context.logger.error("Error loading background-image " + i4), [3, 4];
                      case 4:
                        return o4 && (s4 = Al(A4, e3, [o4.width, o4.height, o4.width / o4.height]), Q3 = s4[0], E3 = s4[1], b3 = s4[2], m3 = s4[3], F3 = s4[4], p3 = n3.ctx.createPattern(n3.resizeImage(o4, m3, F3), "repeat"), n3.renderRepeat(Q3, p3, E3, b3)), [3, 6];
                      case 5:
                        Kn2(t5) ? (a4 = Al(A4, e3, [null, null, null]), Q3 = a4[0], E3 = a4[1], b3 = a4[2], m3 = a4[3], F3 = a4[4], l3 = pn2(t5.angle, m3, F3), c3 = l3[0], u3 = l3[1], B3 = l3[2], h3 = l3[3], g3 = l3[4], (d3 = document.createElement("canvas")).width = m3, d3.height = F3, w3 = d3.getContext("2d"), f3 = w3.createLinearGradient(u3, h3, B3, g3), wn2(t5.stops, c3).forEach(function(A5) {
                          return f3.addColorStop(A5.stop, nn2(A5.color));
                        }), w3.fillStyle = f3, w3.fillRect(0, 0, m3, F3), m3 > 0 && F3 > 0 && (p3 = n3.ctx.createPattern(d3, "repeat"), n3.renderRepeat(Q3, p3, E3, b3))) : Dn2(t5) && (C3 = Al(A4, e3, [null, null, null]), Q3 = C3[0], v3 = C3[1], U3 = C3[2], m3 = C3[3], F3 = C3[4], y3 = 0 === t5.position.length ? [Nt2] : t5.position, E3 = Yt2(y3[0], m3), b3 = Yt2(y3[y3.length - 1], F3), I3 = vn2(t5, E3, b3, m3, F3), H3 = I3[0], S3 = I3[1], H3 > 0 && S3 > 0 && (x3 = n3.ctx.createRadialGradient(v3 + E3, U3 + b3, 0, v3 + E3, U3 + b3, H3), wn2(t5.stops, 2 * H3).forEach(function(A5) {
                          return x3.addColorStop(A5.stop, nn2(A5.color));
                        }), n3.path(Q3), n3.ctx.fillStyle = x3, H3 !== S3 ? (K3 = A4.bounds.left + 0.5 * A4.bounds.width, D3 = A4.bounds.top + 0.5 * A4.bounds.height, O3 = 1 / (L3 = S3 / H3), n3.ctx.save(), n3.ctx.translate(K3, D3), n3.ctx.transform(1, 0, 0, L3, 0, 0), n3.ctx.translate(-K3, -D3), n3.ctx.fillRect(v3, O3 * (U3 - D3) + D3, m3, F3 * O3), n3.ctx.restore()) : n3.ctx.fill())), r3.label = 6;
                      case 6:
                        return e3--, [2];
                    }
                  });
                }, n3 = this, o3 = 0, i3 = A4.styles.backgroundImage.slice(0).reverse(), a3.label = 1;
              case 1:
                return o3 < i3.length ? (s3 = i3[o3], [5, t4(s3)]) : [3, 4];
              case 2:
                a3.sent(), a3.label = 3;
              case 3:
                return o3++, [3, 1];
              case 4:
                return [2];
            }
          });
        });
      }, t3.prototype.renderSolidBorder = function(A4, e3, t4) {
        return n2(this, void 0, void 0, function() {
          return r2(this, function(n3) {
            return this.path(Xa(t4, e3)), this.ctx.fillStyle = nn2(A4), this.ctx.fill(), [2];
          });
        });
      }, t3.prototype.renderDoubleBorder = function(A4, e3, t4, o3) {
        return n2(this, void 0, void 0, function() {
          var n3, i3;
          return r2(this, function(r3) {
            switch (r3.label) {
              case 0:
                return e3 < 3 ? [4, this.renderSolidBorder(A4, t4, o3)] : [3, 2];
              case 1:
                return r3.sent(), [2];
              case 2:
                return n3 = _a(o3, t4), this.path(n3), this.ctx.fillStyle = nn2(A4), this.ctx.fill(), i3 = Ya(o3, t4), this.path(i3), this.ctx.fill(), [2];
            }
          });
        });
      }, t3.prototype.renderNodeBackgroundAndBorders = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3, t4, n3, o3, i3, s3, a3, l3, c3 = this;
          return r2(this, function(r3) {
            switch (r3.label) {
              case 0:
                return this.applyEffects(A4.getEffects(2)), e3 = A4.container.styles, t4 = !tn2(e3.backgroundColor) || e3.backgroundImage.length, n3 = [{ style: e3.borderTopStyle, color: e3.borderTopColor, width: e3.borderTopWidth }, { style: e3.borderRightStyle, color: e3.borderRightColor, width: e3.borderRightWidth }, { style: e3.borderBottomStyle, color: e3.borderBottomColor, width: e3.borderBottomWidth }, { style: e3.borderLeftStyle, color: e3.borderLeftColor, width: e3.borderLeftWidth }], o3 = hl(rl(e3.backgroundClip, 0), A4.curves), t4 || e3.boxShadow.length ? (this.ctx.save(), this.path(o3), this.ctx.clip(), tn2(e3.backgroundColor) || (this.ctx.fillStyle = nn2(e3.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(A4.container)]) : [3, 2];
              case 1:
                r3.sent(), this.ctx.restore(), e3.boxShadow.slice(0).reverse().forEach(function(e4) {
                  c3.ctx.save();
                  var t5 = Ia(A4.curves), n4 = e4.inset ? 0 : cl, r4 = Pa(t5, -n4 + (e4.inset ? 1 : -1) * e4.spread.number, (e4.inset ? 1 : -1) * e4.spread.number, e4.spread.number * (e4.inset ? -2 : 2), e4.spread.number * (e4.inset ? -2 : 2));
                  e4.inset ? (c3.path(t5), c3.ctx.clip(), c3.mask(r4)) : (c3.mask(t5), c3.ctx.clip(), c3.path(r4)), c3.ctx.shadowOffsetX = e4.offsetX.number + n4, c3.ctx.shadowOffsetY = e4.offsetY.number, c3.ctx.shadowColor = nn2(e4.color), c3.ctx.shadowBlur = e4.blur.number, c3.ctx.fillStyle = e4.inset ? nn2(e4.color) : "rgba(0,0,0,1)", c3.ctx.fill(), c3.ctx.restore();
                }), r3.label = 2;
              case 2:
                i3 = 0, s3 = 0, a3 = n3, r3.label = 3;
              case 3:
                return s3 < a3.length ? 0 !== (l3 = a3[s3]).style && !tn2(l3.color) && l3.width > 0 ? 2 !== l3.style ? [3, 5] : [4, this.renderDashedDottedBorder(l3.color, l3.width, i3, A4.curves, 2)] : [3, 11] : [3, 13];
              case 4:
                return r3.sent(), [3, 11];
              case 5:
                return 3 !== l3.style ? [3, 7] : [4, this.renderDashedDottedBorder(l3.color, l3.width, i3, A4.curves, 3)];
              case 6:
                return r3.sent(), [3, 11];
              case 7:
                return 4 !== l3.style ? [3, 9] : [4, this.renderDoubleBorder(l3.color, l3.width, i3, A4.curves)];
              case 8:
                return r3.sent(), [3, 11];
              case 9:
                return [4, this.renderSolidBorder(l3.color, i3, A4.curves)];
              case 10:
                r3.sent(), r3.label = 11;
              case 11:
                i3++, r3.label = 12;
              case 12:
                return s3++, [3, 3];
              case 13:
                return [2];
            }
          });
        });
      }, t3.prototype.renderDashedDottedBorder = function(A4, e3, t4, o3, i3) {
        return n2(this, void 0, void 0, function() {
          var n3, s3, a3, l3, c3, u3, B3, h3, g3, d3, w3, f3, p3, C3, Q3, v3;
          return r2(this, function(r3) {
            return this.ctx.save(), n3 = Ja(o3, t4), s3 = Xa(o3, t4), 2 === i3 && (this.path(s3), this.ctx.clip()), ya(s3[0]) ? (a3 = s3[0].start.x, l3 = s3[0].start.y) : (a3 = s3[0].x, l3 = s3[0].y), ya(s3[1]) ? (c3 = s3[1].end.x, u3 = s3[1].end.y) : (c3 = s3[1].x, u3 = s3[1].y), B3 = 0 === t4 || 2 === t4 ? Math.abs(a3 - c3) : Math.abs(l3 - u3), this.ctx.beginPath(), 3 === i3 ? this.formatPath(n3) : this.formatPath(s3.slice(0, 2)), h3 = e3 < 3 ? 3 * e3 : 2 * e3, g3 = e3 < 3 ? 2 * e3 : e3, 3 === i3 && (h3 = e3, g3 = e3), d3 = true, B3 <= 2 * h3 ? d3 = false : B3 <= 2 * h3 + g3 ? (h3 *= w3 = B3 / (2 * h3 + g3), g3 *= w3) : (f3 = Math.floor((B3 + g3) / (h3 + g3)), p3 = (B3 - f3 * h3) / (f3 - 1), g3 = (C3 = (B3 - (f3 + 1) * h3) / f3) <= 0 || Math.abs(g3 - p3) < Math.abs(g3 - C3) ? p3 : C3), d3 && (3 === i3 ? this.ctx.setLineDash([0, h3 + g3]) : this.ctx.setLineDash([h3, g3])), 3 === i3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = e3) : this.ctx.lineWidth = 2 * e3 + 1.1, this.ctx.strokeStyle = nn2(A4), this.ctx.stroke(), this.ctx.setLineDash([]), 2 === i3 && (ya(s3[0]) && (Q3 = s3[3], v3 = s3[0], this.ctx.beginPath(), this.formatPath([new Ua(Q3.end.x, Q3.end.y), new Ua(v3.start.x, v3.start.y)]), this.ctx.stroke()), ya(s3[1]) && (Q3 = s3[1], v3 = s3[2], this.ctx.beginPath(), this.formatPath([new Ua(Q3.end.x, Q3.end.y), new Ua(v3.start.x, v3.start.y)]), this.ctx.stroke())), this.ctx.restore(), [2];
          });
        });
      }, t3.prototype.render = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3;
          return r2(this, function(t4) {
            switch (t4.label) {
              case 0:
                return this.options.backgroundColor && (this.ctx.fillStyle = nn2(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), e3 = Na(A4), [4, this.renderStack(e3)];
              case 1:
                return t4.sent(), this.applyEffects([]), [2, this.canvas];
            }
          });
        });
      }, t3;
    }(ll), Bl = function(A3) {
      return A3 instanceof As2 || A3 instanceof $i2 || A3 instanceof qi2 && A3.type !== zi2 && A3.type !== Wi2;
    }, hl = function(A3, e3) {
      switch (A3) {
        case 0:
          return Ia(e3);
        case 2:
          return Ha(e3);
        default:
          return Sa(e3);
      }
    }, gl = function(A3) {
      switch (A3) {
        case 1:
          return "center";
        case 2:
          return "right";
        default:
          return "left";
      }
    }, dl = ["-apple-system", "system-ui"], wl = function(A3) {
      return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A3.filter(function(A4) {
        return -1 === dl.indexOf(A4);
      }) : A3;
    }, fl = function(A3) {
      function t3(e3, t4) {
        var n3 = A3.call(this, e3, t4) || this;
        return n3.canvas = t4.canvas ? t4.canvas : document.createElement("canvas"), n3.ctx = n3.canvas.getContext("2d"), n3.options = t4, n3.canvas.width = Math.floor(t4.width * t4.scale), n3.canvas.height = Math.floor(t4.height * t4.scale), n3.canvas.style.width = t4.width + "px", n3.canvas.style.height = t4.height + "px", n3.ctx.scale(n3.options.scale, n3.options.scale), n3.ctx.translate(-t4.x, -t4.y), n3.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + t4.width + "x" + t4.height + " at " + t4.x + "," + t4.y + ") with scale " + t4.scale), n3;
      }
      return e2(t3, A3), t3.prototype.render = function(A4) {
        return n2(this, void 0, void 0, function() {
          var e3, t4;
          return r2(this, function(n3) {
            switch (n3.label) {
              case 0:
                return e3 = mi2(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, A4), [4, pl(e3)];
              case 1:
                return t4 = n3.sent(), this.options.backgroundColor && (this.ctx.fillStyle = nn2(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(t4, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
            }
          });
        });
      }, t3;
    }(ll), pl = function(A3) {
      return new Promise(function(e3, t3) {
        var n3 = new Image();
        n3.onload = function() {
          e3(n3);
        }, n3.onerror = t3, n3.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A3));
      });
    }, Cl = function() {
      function A3(A4) {
        var e3 = A4.id, t3 = A4.enabled;
        this.id = e3, this.enabled = t3, this.start = Date.now();
      }
      return A3.prototype.debug = function() {
        for (var A4 = [], e3 = 0; e3 < arguments.length; e3++) A4[e3] = arguments[e3];
        this.enabled && ("undefined" != typeof window && window.console && "function" == typeof console.debug ? console.debug.apply(console, o2([this.id, this.getTime() + "ms"], A4)) : this.info.apply(this, A4));
      }, A3.prototype.getTime = function() {
        return Date.now() - this.start;
      }, A3.prototype.info = function() {
        for (var A4 = [], e3 = 0; e3 < arguments.length; e3++) A4[e3] = arguments[e3];
        this.enabled && "undefined" != typeof window && window.console && "function" == typeof console.info && console.info.apply(console, o2([this.id, this.getTime() + "ms"], A4));
      }, A3.prototype.warn = function() {
        for (var A4 = [], e3 = 0; e3 < arguments.length; e3++) A4[e3] = arguments[e3];
        this.enabled && ("undefined" != typeof window && window.console && "function" == typeof console.warn ? console.warn.apply(console, o2([this.id, this.getTime() + "ms"], A4)) : this.info.apply(this, A4));
      }, A3.prototype.error = function() {
        for (var A4 = [], e3 = 0; e3 < arguments.length; e3++) A4[e3] = arguments[e3];
        this.enabled && ("undefined" != typeof window && window.console && "function" == typeof console.error ? console.error.apply(console, o2([this.id, this.getTime() + "ms"], A4)) : this.info.apply(this, A4));
      }, A3.instances = {}, A3;
    }(), Ql = function() {
      function A3(e3, t3) {
        var n3;
        this.windowBounds = t3, this.instanceName = "#" + A3.instanceCount++, this.logger = new Cl({ id: this.instanceName, enabled: e3.logging }), this.cache = null !== (n3 = e3.cache) && void 0 !== n3 ? n3 : new ha(this, e3);
      }
      return A3.instanceCount = 1, A3;
    }(), vl = function(A3, e3) {
      return void 0 === e3 && (e3 = {}), Ul(A3, e3);
    };
    "undefined" != typeof window && Ba.setContext(window);
    var Ul = function(A3, e3) {
      return n2(void 0, void 0, void 0, function() {
        var n3, o3, l3, c3, u3, B3, h3, g3, d3, w3, f3, p3, C3, Q3, v3, U3, m3, F3, y3, E3, b3, I3, H3, S3, x3, K3, D3, L3, O3, k3, M3, P3, T3, R3, G3, V3, N3, X3;
        return r2(this, function(r3) {
          switch (r3.label) {
            case 0:
              if (!A3 || "object" != typeof A3) return [2, Promise.reject("Invalid element provided as first argument")];
              if (!(n3 = A3.ownerDocument)) throw new Error("Element is not attached to a Document");
              if (!(o3 = n3.defaultView)) throw new Error("Document is not attached to a Window");
              return l3 = { allowTaint: null !== (I3 = e3.allowTaint) && void 0 !== I3 && I3, imageTimeout: null !== (H3 = e3.imageTimeout) && void 0 !== H3 ? H3 : 15e3, proxy: e3.proxy, useCORS: null !== (S3 = e3.useCORS) && void 0 !== S3 && S3 }, c3 = t2({ logging: null === (x3 = e3.logging) || void 0 === x3 || x3, cache: e3.cache }, l3), u3 = { windowWidth: null !== (K3 = e3.windowWidth) && void 0 !== K3 ? K3 : o3.innerWidth, windowHeight: null !== (D3 = e3.windowHeight) && void 0 !== D3 ? D3 : o3.innerHeight, scrollX: null !== (L3 = e3.scrollX) && void 0 !== L3 ? L3 : o3.pageXOffset, scrollY: null !== (O3 = e3.scrollY) && void 0 !== O3 ? O3 : o3.pageYOffset }, B3 = new i2(u3.scrollX, u3.scrollY, u3.windowWidth, u3.windowHeight), h3 = new Ql(c3, B3), g3 = null !== (k3 = e3.foreignObjectRendering) && void 0 !== k3 && k3, d3 = { allowTaint: null !== (M3 = e3.allowTaint) && void 0 !== M3 && M3, onclone: e3.onclone, ignoreElements: e3.ignoreElements, inlineImages: g3, copyStyles: g3 }, h3.logger.debug("Starting document clone with size " + B3.width + "x" + B3.height + " scrolled to " + -B3.left + "," + -B3.top), w3 = new Ws2(h3, A3, d3), (f3 = w3.clonedReferenceElement) ? [4, w3.toIFrame(n3, B3)] : [2, Promise.reject("Unable to find element in cloned iframe")];
            case 1:
              return p3 = r3.sent(), C3 = fs2(f3) || ds2(f3) ? a2(f3.ownerDocument) : s2(h3, f3), Q3 = C3.width, v3 = C3.height, U3 = C3.left, m3 = C3.top, F3 = ml(h3, f3, e3.backgroundColor), y3 = { canvas: e3.canvas, backgroundColor: F3, scale: null !== (T3 = null !== (P3 = e3.scale) && void 0 !== P3 ? P3 : o3.devicePixelRatio) && void 0 !== T3 ? T3 : 1, x: (null !== (R3 = e3.x) && void 0 !== R3 ? R3 : 0) + U3, y: (null !== (G3 = e3.y) && void 0 !== G3 ? G3 : 0) + m3, width: null !== (V3 = e3.width) && void 0 !== V3 ? V3 : Math.ceil(Q3), height: null !== (N3 = e3.height) && void 0 !== N3 ? N3 : Math.ceil(v3) }, g3 ? (h3.logger.debug("Document cloned, using foreign object rendering"), [4, new fl(h3, y3).render(f3)]) : [3, 3];
            case 2:
              return E3 = r3.sent(), [3, 5];
            case 3:
              return h3.logger.debug("Document cloned, element located at " + U3 + "," + m3 + " with size " + Q3 + "x" + v3 + " using computed rendering"), h3.logger.debug("Starting DOM parsing"), b3 = os2(h3, f3), F3 === b3.styles.backgroundColor && (b3.styles.backgroundColor = Bn2.TRANSPARENT), h3.logger.debug("Starting renderer for element at " + y3.x + "," + y3.y + " with size " + y3.width + "x" + y3.height), [4, new ul(h3, y3).render(b3)];
            case 4:
              E3 = r3.sent(), r3.label = 5;
            case 5:
              return (null === (X3 = e3.removeContainer) || void 0 === X3 || X3) && (Ws2.destroy(p3) || h3.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), h3.logger.debug("Finished rendering"), [2, E3];
          }
        });
      });
    }, ml = function(A3, e3, t3) {
      var n3 = e3.ownerDocument, r3 = n3.documentElement ? un2(A3, getComputedStyle(n3.documentElement).backgroundColor) : Bn2.TRANSPARENT, o3 = n3.body ? un2(A3, getComputedStyle(n3.body).backgroundColor) : Bn2.TRANSPARENT, i3 = "string" == typeof t3 ? un2(A3, t3) : null === t3 ? Bn2.TRANSPARENT : 4294967295;
      return e3 === n3.documentElement ? tn2(r3) ? tn2(o3) ? i3 : o3 : r3 : i3;
    };
    return vl;
  }();
  var Yi = _i.exports;
  function Ji(e2) {
    var t2 = [];
    return e2.querySelectorAll("img").forEach(function(e3) {
      var n2 = e3.getAttribute("src");
      if (n2 && (!n2 || !n2.startsWith("base64"))) {
        var r2 = new Promise(function(t3) {
          var r3 = new Image();
          r3.crossOrigin = "anonymous", r3.src = "".concat(n2, "&time=").concat(+(/* @__PURE__ */ new Date()).getTime()), r3.onload = function() {
            var A2 = e3.width, n3 = e3.height, o2 = document.createElement("canvas");
            o2.width = A2, o2.height = n3, o2.getContext("2d").drawImage(r3, 0, 0, A2, n3);
            var i2 = null == o2 ? void 0 : o2.toDataURL();
            e3.setAttribute("src", i2), t3("转换成功");
          }, r3.onerror = function(e4) {
            var r4 = Hn.h2cCrossImgLoadErrFn;
            r4 && "string" != typeof e4 && r4(A(A({}, e4), { imgUrl: n2 })), t3(true);
          }, null !== n2 && (r3.src = n2);
        });
        t2.push(r2);
      }
    }), Promise.all(t2);
  }
  var Wi = function(A2) {
    return /^(data|blob):/i.test(A2.trim());
  }, zi = function() {
    function A2(A3) {
      this.captureFn = A3;
    }
    return A2.prototype.acquireStream = function() {
      return this.captureFn();
    }, A2;
  }(), Zi = function() {
    function A2(A3, e2) {
      this.stream = A3, this.onFailure = e2;
    }
    return A2.prototype.acquireStream = function() {
      return this.stream instanceof MediaStream ? (Gn.setVideoSrcObject(this.stream), Promise.resolve(this.stream)) : (this.onFailure(), Promise.resolve(null));
    }, A2;
  }(), ji = function(A2, n2, r2) {
    return e(void 0, void 0, void 0, function() {
      var e2, o2, i2;
      return t(this, function(t2) {
        switch (t2.label) {
          case 0:
            e2 = null, o2 = function(A3, e3) {
              var t3 = e3.width * Gr.dpr, n3 = e3.height * Gr.dpr, r3 = { cursor: Hn.captureCursor, width: t3, height: n3, displaySurface: "browser" };
              return "window-frame" === A3 && (r3.width = window.screen.width * Gr.dpr, r3.height = window.screen.height * Gr.dpr, r3.displaySurface = "window"), r3;
            }(n2, r2), t2.label = 1;
          case 1:
            return t2.trys.push([1, 3, , 4]), [4, navigator.mediaDevices.getDisplayMedia({ video: o2, audio: false })];
          case 2:
            return e2 = t2.sent(), Gr.updateCaptureStream(e2), Gn.setVideoSrcObject(e2), [3, 4];
          case 3:
            return i2 = t2.sent(), function(A3, e3) {
              var t3 = { code: -1, msg: "浏览器不支持webrtc或者用户未授权", errorInfo: e3 };
              if (null != A3 && A3(t3), eo(), null == A3) throw "".concat(t3.msg, "( ").concat(e3, " )");
            }(A2, i2), [3, 4];
          case 4:
            return [2, e2];
        }
      });
    });
  }, qi = function() {
    function A2() {
    }
    return A2.prototype.draw = function(A3) {
      var e2 = A3.imgContext, t2 = A3.videoController, n2 = A3.imgWidth, r2 = A3.imgHeight, o2 = es(t2.videoWidth, t2.videoHeight, n2, r2, Gr.dpr);
      return null != o2 && (e2.putImageData(o2, 0, 0), true);
    }, A2;
  }(), $i = function() {
    function A2() {
    }
    return A2.prototype.draw = function(A3) {
      var e2 = A3.imgContext, t2 = A3.videoController, n2 = A3.containerWidth, r2 = A3.containerHeight, o2 = t2.videoWidth, i2 = n2, s2 = t2.videoHeight * n2 / o2;
      s2 > r2 && (i2 = n2 * r2 / s2, s2 = r2);
      var a2 = Hn.wrcImgPosition;
      i2 = a2.w > 0 ? a2.w : i2, s2 = a2.h > 0 ? a2.h : s2, e2.drawImage(t2, a2.x, a2.y, i2, s2);
      var l2 = r2 - s2;
      return Hn.hiddenScrollBar.state && l2 > 0 && Hn.hiddenScrollBar.fillState && function(A4, e3, t3, n3) {
        var r3, o3 = Hn.hiddenScrollBar, i3 = o3.fillWidth, s3 = o3.fillHeight, a3 = null !== (r3 = o3.color) && void 0 !== r3 ? r3 : "#000000", l3 = e3, c2 = t3;
        "number" == typeof i3 && i3 > 0 && (l3 = i3), "number" == typeof s3 && s3 > 0 && (c2 = s3), A4.beginPath(), A4.rect(0, n3, l3, c2), A4.fillStyle = a3, A4.fill();
      }(e2, n2, l2, s2), true;
    }, A2;
  }(), As = { "window-frame": new qi(), "browser-frame": new $i() }, es = function(A2, e2, t2, n2, r2) {
    var o2 = document.createElement("canvas");
    o2.width = A2, o2.height = e2;
    var i2 = u(o2, A2, e2);
    if (i2 && Gn.videoController) {
      i2.drawImage(Gn.videoController, 0, 0);
      var s2 = e2 - n2, a2 = t2, l2 = e2 - s2;
      return i2.getImageData(0 * r2, s2 * r2, a2 * r2, l2 * r2);
    }
    return null;
  }, ts = function() {
    !function() {
      if (null != Gn.videoController) {
        var A2 = Gn.videoController.srcObject;
        A2 && "getTracks" in A2 && (A2.getTracks().forEach(function(A3) {
          return A3.stop();
        }), Gn.setVideoSrcObject(null));
      }
    }(), document.body.classList.remove("no-cursor");
  }, ns = function(e2, t2, n2, r2, o2) {
    setTimeout(function() {
      o2.remove();
      var i2 = Gn.screenShotController, s2 = Gn.videoController, a2 = function(A2, e3) {
        var t3 = Hn.getCanvasSize(), n3 = 0 !== t3.canvasWidth ? t3.canvasWidth : e3.width, r3 = 0 !== t3.canvasHeight ? t3.canvasHeight : e3.height;
        return "window-frame" === A2 ? { containerWidth: n3, containerHeight: r3, imgWidth: n3 * Gr.dpr, imgHeight: r3 * Gr.dpr } : { containerWidth: n3, containerHeight: r3, imgWidth: n3, imgHeight: r3 };
      }(t2, n2);
      if (null != i2 && null != s2) {
        var l2 = u(i2, a2.containerWidth, a2.containerHeight), c2 = u(n2, a2.imgWidth, a2.imgHeight);
        if (null != l2 && null != c2) {
          Xn.updateScreenShotCanvas(l2);
          var B2 = function(A2) {
            return As[A2];
          }(t2).draw(A(A({}, a2), { imgContext: c2, videoController: s2 }));
          if (B2) {
            Ti(void 0, l2, n2, r2);
            var h2 = function() {
              var A2, e3;
              if (null == Gr.captureStream) return { displaySurface: null, displayLabel: null };
              var t3 = Gr.captureStream.getVideoTracks()[0];
              if (null == t3) return { displaySurface: null, displayLabel: null };
              var n3 = t3.getSettings();
              return { displaySurface: null !== (A2 = null == n3 ? void 0 : n3.displaySurface) && void 0 !== A2 ? A2 : null, displayLabel: null !== (e3 = t3.label) && void 0 !== e3 ? e3 : null };
            }(), g2 = h2.displaySurface, d2 = h2.displayLabel;
            e2 && e2({ code: 0, msg: "截图加载完成", displaySurface: g2, displayLabel: d2 }), ts();
          } else ts();
        } else ts();
      } else ts();
    }, Hn.wrcReplyTime);
  }, rs = function(A2, n2, r2, o2, i2) {
    return e(void 0, void 0, void 0, function() {
      var e2, s2, a2;
      return t(this, function(t2) {
        switch (t2.label) {
          case 0:
            return e2 = function() {
              var A3 = document.createElement("div");
              return A3.style.cssText = "position: fixed;top: 0;left: 0;width: ".concat(innerWidth, "px;height: ").concat(innerHeight, "px;z-index: ").concat(9999, ";cursor: none;"), A3;
            }, [4, A2.acquireStream()];
          case 1:
            return null == (s2 = t2.sent()) ? [2, null] : (a2 = e2(), document.body.appendChild(a2), ns(r2, n2, o2, i2, a2), [2, s2]);
        }
      });
    });
  }, os = function(A2, e2, t2, n2, r2, o2) {
    return rs(new Zi(A2, function() {
      return function(A3) {
        null != A3 && A3({ code: -1, msg: "视频流接入失败" }), eo();
      }(e2);
    }), t2, n2, r2, o2);
  }, is = function(A2, e2, t2, n2, r2) {
    return { "browser-display-media": function() {
      return function(A3, e3, t3, n3, r3) {
        return rs(new zi(function() {
          return ji(A3, e3, n3);
        }), e3, t3, n3, r3);
      }(e2, A2.renderStrategy, t2, n2, r2);
    }, "injected-media-stream": function() {
      return os(Hn.screenFlow, e2, A2.renderStrategy, t2, n2, r2);
    }, "static-image": function() {
      return Promise.resolve(null);
    }, "dom-render": function() {
      return Promise.resolve(null);
    }, "snapdom-render": function() {
      return Promise.resolve(null);
    } }[A2.captureSource]();
  }, ss = function() {
    var A2, e2 = null !== (A2 = Hn.snapdom) && void 0 !== A2 ? A2 : function() {
      var A3;
      return "undefined" == typeof window ? null : null !== (A3 = window.snapdom) && void 0 !== A3 ? A3 : null;
    }();
    if (null == (null == e2 ? void 0 : e2.toCanvas) || "function" != typeof e2.toCanvas) throw new Error('[js-web-screen-shot] capture.source 为 "snapdom" 时，需要先引入 SnapDOM，并通过 capture.snapdom 传入或暴露为 window.snapdom。');
    return e2;
  }, as = function(A2, e2, t2, n2, r2) {
    return function(A3, e3, t3, n3) {
      return new Promise(function(r3, o2) {
        var i2 = document.createElement("canvas"), s2 = i2.getContext("2d");
        i2.width = e3 * n3, i2.height = t3 * n3, i2.style.width = "".concat(e3, "px"), i2.style.height = "".concat(t3, "px");
        var a2 = new Image();
        Wi(A3) || (a2.crossOrigin = "Anonymous"), a2.width = e3, a2.height = t3, a2.onload = function() {
          null != s2 ? (s2.scale(n3, n3), s2.drawImage(a2, 0, 0, e3, t3), r3(i2)) : o2("图像绘制失败");
        }, a2.onerror = function() {
          o2(new Error("图像加载失败: ".concat(A3)));
        }, a2.onabort = function() {
          o2(new Error("图像加载中断: ".concat(A3)));
        }, a2.src = A3;
      });
    }(n2, t2.width, t2.height, Gr.dpr).then(function(t3) {
      return Ti(A2, e2, t3, r2), t3;
    });
  }, ls = [{ captureSource: "static-image", predicate: function() {
    return !Hn.enableWebRtc && null != Hn.imgSrc;
  } }, { captureSource: "dom-render", predicate: function() {
    return !Hn.enableWebRtc && "html2canvas" === Hn.domRenderEngine;
  } }, { captureSource: "snapdom-render", predicate: function() {
    return !Hn.enableWebRtc && "snapdom" === Hn.domRenderEngine;
  } }, { captureSource: "injected-media-stream", predicate: function() {
    return null != Hn.screenFlow;
  } }], cs = function(A2) {
    var e2 = A2.mouseEvents, t2 = A2.context, n2 = A2.triggerCallback, r2 = A2.getImageController, o2 = A2.setImageController, i2 = A2.cancelCallback, s2 = Hn.imgSrc;
    if (null != s2) {
      var a2 = as(n2, t2, r2(), s2, e2);
      gs(a2, "image", { setImageController: o2, cancelCallback: i2 });
    }
  }, us = function(A2) {
    var n2 = A2.mouseEvents, r2 = A2.context, o2 = A2.triggerCallback, i2 = A2.setImageController, s2 = A2.cancelCallback, a2 = function(A3, n3, r3) {
      return e(void 0, void 0, void 0, function() {
        var e2, o3, i3, s3;
        return t(this, function(t2) {
          switch (t2.label) {
            case 0:
              e2 = null !== (s3 = Hn.screenShotDom) && void 0 !== s3 ? s3 : document.body, t2.label = 1;
            case 1:
              return t2.trys.push([1, 3, , 4]), [4, Yi(e2, { x: Hn.renderOptions.x, y: Hn.renderOptions.y, onclone: Hn.loadCrossImg ? Ji : void 0, proxy: Hn.proxyUrl, ignoreElements: Hn.h2cIgnoreElementsFn, useCORS: Hn.useCORS })];
            case 2:
              return o3 = t2.sent(), null != Gn.screenShotController && Ti(A3, n3, o3, r3), [2, o3];
            case 3:
              throw i3 = t2.sent(), null != A3 && A3({ code: -1, msg: i3 }), i3;
            case 4:
              return [2];
          }
        });
      });
    }(o2, r2, n2);
    gs(a2, "html2canvas", { setImageController: i2, cancelCallback: s2 });
  }, Bs = function(A2) {
    var n2 = A2.mouseEvents, r2 = A2.context, o2 = A2.triggerCallback, i2 = A2.setImageController, s2 = A2.cancelCallback, a2 = function(A3, n3, r3) {
      return e(void 0, void 0, void 0, function() {
        var e2, o3, i3;
        return t(this, function(t2) {
          switch (t2.label) {
            case 0:
              return e2 = null !== (i3 = Hn.screenShotDom) && void 0 !== i3 ? i3 : document.body, [4, ss().toCanvas(e2, Hn.snapdomOptions)];
            case 1:
              return o3 = t2.sent(), null != Gn.screenShotController && Ti(A3, n3, o3, r3), [2, o3];
          }
        });
      });
    }(o2, r2, n2);
    gs(a2, "snapdom", { setImageController: i2, cancelCallback: s2 });
  }, hs = function(A2) {
    var e2 = A2.plan, t2 = A2.mouseEvents, n2 = A2.triggerCallback, r2 = A2.cancelCallback, o2 = A2.getImageController, i2 = is(e2, r2, n2, o2(), t2);
    ds(i2, "injected-media-stream" === e2.captureSource ? "injected-stream" : "webrtc", r2);
  }, gs = function(A2, e2, t2) {
    var n2 = t2.setImageController, r2 = t2.cancelCallback;
    A2.then(function(A3) {
      n2(A3);
    }).catch(function(A3) {
      ws(e2, A3, r2);
    });
  }, ds = function(A2, e2, t2) {
    A2.catch(function(A3) {
      ws(e2, A3, t2);
    });
  }, ws = function(A2, e2, t2) {
    console.error("[ScreenShotModeExecutor] ".concat(A2, " mode failed"), e2), null == t2 || t2(e2), eo();
  }, fs = function() {
    if (null != Xn.screenShotCanvas) {
      var A2 = Xn.screenShotCanvas;
      Gr.history.length <= 0 && Wr(), A2.putImageData(Gr.history[Gr.history.length - 1].data, 0, 0);
    }
  }, ps = function() {
    var A2 = Jr.toolId;
    return A2 && A2 > 100;
  }, Cs = function() {
    return ps() ? Hn.getCanvasEvents() : null;
  }, Qs = function() {
    null != Xn.screenShotCanvas && (ro(), Gr.redrawCanvasElements());
  }, vs = { addElement: function(e2) {
    var t2 = function(e3) {
      var t3, n2, r2, o2, i2, s2, a2, l2, c2 = e3, u2 = null != c2.element ? c2.element : e3;
      if (null == u2) return null;
      var B2 = u2.id || c2.id || so();
      return { id: B2, type: "custom", element: A(A({}, u2), { id: B2, customType: "custom", x: null !== (t3 = u2.x) && void 0 !== t3 ? t3 : 0, y: null !== (n2 = u2.y) && void 0 !== n2 ? n2 : 0, width: "width" in u2 && null !== (r2 = u2.width) && void 0 !== r2 ? r2 : 0, height: "height" in u2 && null !== (o2 = u2.height) && void 0 !== o2 ? o2 : 0, toolId: null !== (s2 = null !== (i2 = u2.toolId) && void 0 !== i2 ? i2 : Jr.toolId) && void 0 !== s2 ? s2 : void 0, toolName: null !== (l2 = null !== (a2 = u2.toolName) && void 0 !== a2 ? a2 : Jr.toolName) && void 0 !== l2 ? l2 : void 0 }) };
    }(e2);
    return null == t2 ? null : (Gr.addElement(t2), Gr.updateActiveElementId(t2.id), Qs(), t2);
  }, updateElement: function(A2) {
    Gr.updateCanvasElement(A2), Qs();
  }, removeElement: function(A2) {
    Gr.removeElement(A2), Gr.activeElementId === A2 && (Gr.updateActiveElementId(null), Gr.updateRectOperateIndex(null)), Qs();
  }, selectElement: function(A2) {
    var e2 = Io(A2, 0);
    return e2 && Qs(), e2;
  }, getElement: function(A2) {
    return Gr.getCanvasElement(A2);
  }, getActiveElement: function() {
    var A2 = Gr.activeElementId;
    return null == A2 ? void 0 : Gr.getCanvasElement(A2);
  }, redraw: function() {
    Qs();
  } }, Us = function(A2, e2, t2) {
    var n2;
    null === (n2 = Cs()) || void 0 === n2 || n2.mouseDownFn(A2, e2, t2, Wr, vs);
  }, ms = function(A2) {
    var e2 = function(A3) {
      var e3 = A3.currentX, t2 = A3.currentY, n2 = A3.startX, r2 = A3.startY, o2 = A3.width, i2 = A3.height, s2 = A3.moveStartX, a2 = A3.moveStartY, l2 = A3.controller, c2 = A3.dpr, u2 = fo(e3 - (s2 - n2), o2, l2.width), B2 = fo(t2 - (a2 - r2), i2, l2.height), h2 = l2.width / c2, g2 = l2.height / c2;
      return u2 + o2 > h2 && (u2 = h2 - o2), B2 + i2 > g2 && (B2 = g2 - i2), { x: u2, y: B2 };
    }(A2);
    return { startX: e2.x, startY: e2.y, width: A2.width, height: A2.height };
  };
  var Fs = function(A2) {
    if (Jr.toolClickStatus) A2 === co.Move && null != Gn.screenShotController && (e2 = Gn.screenShotController, "text" === Jr.activeTool ? (Gn.setCursorStyle("text"), e2 !== Gn.screenShotController && (e2.style.cursor = "text")) : e2.style.cursor = "default");
    else {
      var e2, t2 = po[A2];
      t2 && Gn.setCursorStyle(t2);
    }
  }, ys = function(A2, e2, t2) {
    var n2 = false;
    t2.beginPath();
    for (var r2 = 0; r2 < Gr.selectionBorderNodes.length; r2++) {
      var o2 = Gr.selectionBorderNodes[r2];
      if (t2.rect(o2.x, o2.y, o2.width, o2.height), t2.isPointInPath(A2 * Gr.dpr, e2 * Gr.dpr)) {
        Fs(o2.index), Gr.updateBorderOption(o2.option), n2 = true;
        break;
      }
    }
    Gr.updateMouseInsideCropBox(n2), t2.closePath(), n2 || (Gn.setCursorStyle("default"), Gr.updateBorderOption(null));
  };
  function Es(A2, e2, t2, n2, r2, o2, i2, s2) {
    if (null != Gn.screenShotController) {
      var a2 = Gr.movePosition, l2 = a2.moveStartX, c2 = a2.moveStartY;
      Gr.selectionBorderNodes.length > 0 && !Jr.toolClickStatus && !Nn.draggingTrim && ys(A2, e2, i2), Nn.draggingTrim && function(A3, e3, t3, n3, r3, o3, i3, s3, a3, l3) {
        var c3 = Gn.screenShotController;
        if (null == c3) return;
        var u2 = function(A4) {
          return function(A5, e4, t4, n4) {
            var r4 = Jn(A5.startX, A5.startY, A5.width, A5.height, e4, Nn.borderSize, t4, n4);
            Gr.updateTempGraphPosition(r4.startX, r4.startY, r4.width, r4.height);
          }(A4, i3, c3, s3);
        }, B2 = Gr.borderOption;
        if (null == B2) return;
        if (B2 === lo.Move) {
          return void u2(ms({ currentX: A3, currentY: e3, startX: t3, startY: n3, width: r3, height: o3, moveStartX: a3, moveStartY: l3, controller: c3, dpr: Gr.dpr }));
        }
        var h2 = function(A4) {
          var e4 = Co(A4.currentX, A4.currentY, A4.startX, A4.startY, A4.width, A4.height, A4.borderOption);
          return { startX: e4.tempStartX, startY: e4.tempStartY, width: e4.tempWidth, height: e4.tempHeight };
        }({ currentX: A3, currentY: e3, startX: t3, startY: n3, width: r3, height: o3, borderOption: B2 });
        u2(h2);
      }(A2, e2, t2, n2, r2, o2, i2, s2, l2, c2);
    }
  }
  var bs = function() {
    return null != Gn.screenShotController && null != Xn.screenShotCanvas;
  }, Is = function(A2) {
    Gr.clearEmptyCanvasElements(function(e2) {
      e2 > 0 && null != A2 && Gr.updateActiveElementId(A2);
    });
  }, Hs = function(A2, e2) {
    if (!Jr.toolClickStatus) return false;
    var t2 = 2 * Jr.penSize;
    return Gr.drawStatus ? (function() {
      var A3;
      null === (A3 = Cs()) || void 0 === A3 || A3.mouseUpFn(zr, vs);
    }(), Wr(), e2 && null != A2 && Io(A2, t2), true) : (function(A3) {
      var e3, t3, n2 = Gr.getCanvasElement(null !== (e3 = Gr.activeElementId) && void 0 !== e3 ? e3 : "");
      switch (Eo(n2), null == n2 ? void 0 : n2.type) {
        case "square":
          if (null == n2.element) break;
          var o2 = n2.element, i2 = o2.x, s2 = o2.y, a2 = o2.width, l2 = o2.height, c2 = o2.borderWidth;
          o2.color, ir(Nn.drawGraphPosition.startX, Nn.drawGraphPosition.startY, { x: i2, y: s2, width: a2, height: l2 }, c2) && (r("当前鼠标处于".concat(n2.id, "矩形内")), Io(n2.id, A3));
          break;
        case "round":
          if (null == n2.element) break;
          var u2 = n2.element, B2 = u2.x, h2 = u2.y, g2 = u2.width, d2 = u2.height, w2 = u2.borderWidth;
          u2.color;
          var f2 = ar({ x: B2, y: h2, width: g2, height: d2 });
          hr(Nn.drawGraphPosition.startX, Nn.drawGraphPosition.startY, f2, w2) && Io(n2.id, A3);
          break;
        case "right-top":
          if (null == n2.element) break;
          var p2 = n2.element;
          yr(Nn.drawGraphPosition.startX, Nn.drawGraphPosition.startY, p2, Math.max(p2.borderWidth, null !== (t3 = p2.dotRadius) && void 0 !== t3 ? t3 : 0, 8)) && Io(n2.id, A3);
          break;
        case "text":
          if (null == n2.element) break;
          var C2 = n2.element;
          sr({ startX: C2.x, startY: C2.y, width: C2.width, height: C2.height }, { mouseX: Nn.drawGraphPosition.startX, mouseY: Nn.drawGraphPosition.startY }) && Io(n2.id, A3);
          break;
        case "brush":
          if (null == n2.element) break;
          var Q2 = n2.element;
          sr({ startX: Q2.x, startY: Q2.y, width: Math.max(Q2.width, Q2.size), height: Math.max(Q2.height, Q2.size) }, { mouseX: Nn.drawGraphPosition.startX, mouseY: Nn.drawGraphPosition.startY }) && Io(n2.id, A3);
          break;
        case "custom":
          if (null == n2.element) break;
          var v2 = n2.element;
          Dr(v2, Nn.drawGraphPosition.startX, Nn.drawGraphPosition.startY) && Io(n2.id, A3);
          break;
        default:
          xr(n2) && Io(n2.id, A3);
      }
    }(t2), true);
  }, Ss = function() {
    if (Nn.updateDrawGraphPosition(Gr.tempGraphPosition.startX, Gr.tempGraphPosition.startY, Gr.tempGraphPosition.width, Gr.tempGraphPosition.height), !Jr.toolClickStatus) {
      var A2 = Nn.drawGraphPosition, e2 = A2.startX, t2 = A2.startY, n2 = A2.width, r2 = A2.height;
      Nn.setCutOutBoxPosition(e2, t2, n2, r2);
    }
  }, xs = function() {
    Gr.updateSelectionBorderNodes(Pi(Nn.borderSize, Nn.drawGraphPosition));
  }, Ks = function(A2) {
    return A2 || Hn.clickCutFullScreen;
  }, Ds = function(A2) {
    Gn.setCursorStyle("move"), Jr.setToolStatus(true), Nn.setCutBoxSizeStatus(true), A2(), null != Xr.toolController && Oi(Nn.drawGraphPosition, Gr.dpr, Hn.toolPosition, Gr.getFullScreenStatus);
  };
  var Ls = function() {
    return Jr.toolClickStatus;
  }, Os = function() {
    return "brush" !== Jr.toolName ? null : Xn.screenShotCanvas;
  }, ks = function() {
    if ("text" !== Jr.toolName) return null;
    var A2 = Gn.textInputController, e2 = Xn.screenShotCanvas;
    return null == A2 || null == e2 ? null : { textInputController: A2, canvasContext: e2 };
  }, Ms = function() {
    return Boolean(Gr.borderOption);
  };
  var Ps = function(A2, e2) {
    var t2 = A2[A2.length - 1];
    return (!t2 || t2.x !== e2.x || t2.y !== e2.y) && (A2.push(e2), true);
  }, Ts = function(A2) {
    var e2 = A2.startX, t2 = A2.startY, r2 = A2.currentX, o2 = A2.currentY, i2 = Gr.activeElementId;
    if (null != i2) {
      var s2 = Gr.getCanvasElement(i2), a2 = null == s2 ? void 0 : s2.element, l2 = Jr.penSize, c2 = Jr.selectedColor, u2 = (null == a2 ? void 0 : a2.points) ? n([], a2.points, true) : [], B2 = false;
      if (0 === u2.length && (u2.push({ x: e2, y: t2 }), B2 = true), Ps(u2, { x: r2, y: o2 }) && (B2 = true), B2) {
        var h2 = function(A3, e3) {
          for (var t3 = e3 / 2, n2 = A3[0].x - t3, r3 = A3[0].x + t3, o3 = A3[0].y - t3, i3 = A3[0].y + t3, s3 = 1; s3 < A3.length; s3++) {
            var a3 = A3[s3], l3 = a3.x - t3, c3 = a3.x + t3, u3 = a3.y - t3, B3 = a3.y + t3;
            n2 = Math.min(n2, l3), r3 = Math.max(r3, c3), o3 = Math.min(o3, u3), i3 = Math.max(i3, B3);
          }
          return { x: n2, y: o3, width: Math.max(r3 - n2, e3), height: Math.max(i3 - o3, e3) };
        }(u2, l2), g2 = { id: i2, x: h2.x, y: h2.y, width: h2.width, height: h2.height, size: l2, color: c2, points: u2, drawNode: null == a2 ? void 0 : a2.drawNode, dotRadius: null == a2 ? void 0 : a2.dotRadius };
        Gr.updateCanvasElement(g2);
      }
    }
  }, Rs = function(A2) {
    var e2, t2 = A2.startX, r2 = A2.startY, o2 = A2.currentX, i2 = A2.currentY, s2 = Gr.activeElementId;
    if (null != s2) {
      var a2 = Gr.getCanvasElement(s2), l2 = null == a2 ? void 0 : a2.element, c2 = Jr.mosaicPenSize, u2 = Gr.degreeOfBlur, B2 = null !== (e2 = null == l2 ? void 0 : l2.color) && void 0 !== e2 ? e2 : Jr.selectedColor, h2 = (null == l2 ? void 0 : l2.points) ? n([], l2.points, true) : [], g2 = function(A3, e3) {
        return { x: A3 - 10, y: e3 - 10 };
      }, d2 = false;
      if (0 === h2.length && (h2.push(g2(t2, r2)), d2 = true), Ps(h2, g2(o2, i2)) && (d2 = true), d2) {
        var w2 = function(A3, e3) {
          for (var t3 = A3[0].x, n2 = A3[0].x + e3, r3 = A3[0].y, o3 = A3[0].y + e3, i3 = 1; i3 < A3.length; i3++) {
            var s3 = A3[i3];
            t3 = Math.min(t3, s3.x), r3 = Math.min(r3, s3.y), n2 = Math.max(n2, s3.x + e3), o3 = Math.max(o3, s3.y + e3);
          }
          return { x: t3, y: r3, width: Math.max(n2 - t3, e3), height: Math.max(o3 - r3, e3) };
        }(h2, c2), f2 = { id: s2, x: w2.x, y: w2.y, width: w2.width, height: w2.height, size: c2, degreeOfBlur: u2, color: B2, points: h2, drawNode: null == l2 ? void 0 : l2.drawNode, dotRadius: null == l2 ? void 0 : l2.dotRadius };
        Gr.updateCanvasElement(f2);
      }
    }
  }, Gs = function(A2) {
    var e2 = A2.startX, t2 = A2.startY, n2 = A2.currentX, r2 = A2.currentY, o2 = A2.tempWidth, i2 = A2.tempHeight;
    if ("brush" !== Jr.toolName) if ("mosaicPen" !== Jr.toolName) {
      var s2 = Gr.activeElementId;
      if (null != s2) {
        var a2 = function(A3, e3, t3, n3, r3, o3, i3) {
          var s3 = Jr.selectedColor, a3 = Jr.penSize;
          switch (Jr.toolName) {
            case "square":
              return { id: A3, x: Math.min(e3, n3), y: Math.min(t3, r3), width: Math.abs(o3), height: Math.abs(i3), color: s3, borderWidth: a3 };
            case "round":
              var l2 = ar({ x: e3, y: t3, width: o3, height: i3 });
              return { id: A3, x: l2.x, y: l2.y, width: l2.width, height: l2.height, color: s3, borderWidth: a3 };
            case "right-top":
              var c2 = { x: e3, y: t3 }, u2 = { x: n3, y: r3 }, B2 = Math.min(c2.x, u2.x), h2 = Math.min(c2.y, u2.y), g2 = Math.abs(u2.x - c2.x), d2 = Math.abs(u2.y - c2.y);
              return Hn.useRatioArrow ? { id: A3, arrowType: "line", x: B2, y: h2, width: g2, height: d2, color: s3, borderWidth: a3, startX: c2.x, startY: c2.y, endX: u2.x, endY: u2.y, x2: u2.x, y2: u2.y, theta: 30, slashLength: 10 } : { id: A3, arrowType: "filled", x: B2, y: h2, width: g2, height: d2, color: s3, borderWidth: a3, startX: c2.x, startY: c2.y, endX: u2.x, endY: u2.y, x2: u2.x, y2: u2.y };
            default:
              return null;
          }
        }(s2, e2, t2, n2, r2, o2, i2);
        null != a2 && Gr.updateCanvasElement(a2);
      }
    } else Rs({ startX: e2, startY: t2, currentX: n2, currentY: r2 });
    else Ts({ startX: e2, startY: t2, currentX: n2, currentY: r2 });
  }, Vs = function(A2) {
    var e2 = A2.startX, t2 = A2.startY, n2 = A2.currentX, r2 = A2.currentY, o2 = A2.tempWidth, i2 = A2.tempHeight, s2 = A2.event, a2 = A2.drawArrow, l2 = A2.dragOffset, c2 = A2.prevElementId, u2 = A2.transformingExisting, B2 = void 0 !== u2 && u2;
    if (null != Xn.screenShotCanvas && !function(A3, e3, t3, n3, r3) {
      if (!r3) return false;
      var o3 = null != n3 ? n3 : Gr.activeElementId;
      if (null != o3) {
        var i3 = Gr.getCanvasElement(o3);
        Eo(i3);
      }
      return null != Gr.rectOperateIndex ? (vo(A3, e3, n3), true) : (Uo(A3, e3, t3, n3), true);
    }(n2, r2, l2, c2, function(A3, e3) {
      return !!e3 || null != A3 && "move" === Gn.mousePointer && "text" === Jr.toolName && null != Gr.getCanvasElement(A3);
    }(c2, B2))) {
      var h2 = Nn.cutOutBoxPosition, g2 = Di(e2, t2, h2), d2 = Di(n2, r2, h2);
      g2 && d2 && (!function() {
        if ("mosaicPen" !== Jr.toolName) return fs(), void Gr.updateDrawStatus(true);
        Gr.drawStatus || (fs(), Gr.updateDrawStatus(true));
      }(), function(A3, e3) {
        var t3;
        null === (t3 = Cs()) || void 0 === t3 || t3.mouseMoveFn(A3, e3, zr, vs);
      }(s2, { startX: e2, startY: t2, currentX: n2, currentY: r2 }), function(A3) {
        var e3 = A3.startX, t3 = A3.startY, n3 = A3.currentX, r3 = A3.currentY, o3 = A3.tempWidth, i3 = A3.tempHeight, s3 = A3.drawArrow, a3 = Xn.screenShotCanvas;
        if (null != a3) {
          var l3 = Jr.selectedColor, c3 = Jr.penSize;
          switch (Jr.toolName) {
            case "square":
              zn(e3, t3, o3, i3, l3, c3, a3);
              break;
            case "round":
              ur(a3, n3, r3, e3, t3, c3, l3);
              break;
            case "right-top":
              Hn.useRatioArrow ? dr(a3, e3, t3, n3, r3, 30, 10, c3, l3) : s3.draw(a3, e3, t3, n3, r3, l3, c3);
              break;
            case "brush":
              !function(A4, e4, t4, n4, r4) {
                A4.save(), A4.lineWidth = n4, A4.strokeStyle = r4, A4.lineTo(e4, t4), A4.stroke(), A4.restore();
              }(a3, n3, r3, c3, l3);
              break;
            case "mosaicPen":
              Hr(n3 - 10, r3 - 10, Jr.mosaicPenSize, Gr.degreeOfBlur, a3);
          }
        }
      }({ startX: e2, startY: t2, currentX: n2, currentY: r2, tempWidth: o2, tempHeight: i2, drawArrow: a2 }), Gs({ startX: e2, startY: t2, currentX: n2, currentY: r2, tempWidth: o2, tempHeight: i2 }));
    }
  }, Ns = function(A2) {
    return { x: wo(A2 instanceof MouseEvent ? A2.offsetX : A2.touches[0].pageX), y: wo(A2 instanceof MouseEvent ? A2.offsetY : A2.touches[0].pageY) };
  }, Xs = function(A2) {
    return function() {
      var A3 = Nn.cutOutBoxPosition, e2 = A3.width, t2 = A3.height, n2 = A3.startX, r2 = A3.startY;
      return 0 === e2 && 0 === t2 && 0 === n2 && 0 === r2;
    }() && !A2 && Hn.clickCutFullScreen;
  }, _s = null, Ys = 0, Js = function() {
    _s = null, Ys = 0;
  }, Ws = function(A2, e2, t2, n2, r2) {
    null != r2 && (A2.innerText = r2), A2.style.left = "".concat(e2, "px"), A2.style.fontSize = "".concat(n2, "px"), A2.style.fontFamily = "none", A2.style.color = t2;
  }, zs = function(A2) {
    var e2 = function() {
      return function(A3) {
        var e3 = A3.controller, t2 = A3.canvasX, n2 = A3.baselineY, r2 = A3.color, o2 = A3.fontSize, i2 = A3.selectExistingContent, s2 = void 0 !== i2 && i2, a2 = e3.offsetHeight, l2 = n2 - Math.floor(a2 / 2) + Hn.position.top;
        if (e3.style.top = "".concat(l2, "px"), e3.focus(), s2) {
          var c2 = window.getSelection();
          if (null != c2) {
            c2.removeAllRanges();
            var u2 = document.createRange();
            u2.selectNodeContents(e3), u2.collapse(false), c2.addRange(u2);
          }
        }
        Gr.updateTextInputPosition(t2, n2), Jr.setTextInfo({ positionX: t2, positionY: n2, color: r2, size: o2 });
      }(A2);
    };
    "function" == typeof requestAnimationFrame ? requestAnimationFrame(e2) : setTimeout(e2);
  };
  function Zs(e2, t2, n2) {
    if (!Gr.mouseInsideCropBox) return true;
    var r2 = n2.textInputController, o2 = n2.canvasContext, i2 = null;
    Gr.checkMouseInElement(e2, t2, function(A2) {
      i2 = A2;
    });
    var s2 = null != i2 ? Gr.getCanvasElement(i2) : null, a2 = Gr.activeElementId;
    if (function(A2, e3, t3) {
      var n3 = null != e3 && "text" !== e3.type && ("move" === t3 || wr.has(t3)), r3 = null != A2 && "text" !== A2.type;
      return n3 || r3;
    }(s2, null != a2 ? Gr.getCanvasElement(a2) : null, Gn.mousePointer)) return false;
    _r.setTextStatus(true);
    var l2 = Gr.textInputPosition, c2 = l2.mouseX, u2 = l2.mouseY;
    0 !== c2 && 0 !== u2 && c2 !== e2 && u2 !== t2 && Li({ controller: r2, canvasContext: o2 });
    var B2, h2, g2, d2 = Gr.findTextElementAt(e2, t2);
    if (null != d2 && null != d2.element) {
      var w2 = d2.element;
      return B2 = d2.id, h2 = Date.now(), g2 = _s === B2 && h2 - Ys <= 400, _s = B2, Ys = h2, g2 ? function(e3, t3, n3) {
        Gr.updateEditingTextElementId(t3), Gr.updatePendingEditingTextElement(A({}, e3)), oo({ retainEditingId: true });
        var r3 = e3.y + e3.height / 2, o3 = e3.x;
        _r.setTextStatus(true), Ws(n3, o3 + Hn.position.left, e3.color, e3.fontSize, e3.text), Jr.setFontSize(e3.fontSize), Jr.setSelectedColor(e3.color), zs({ controller: n3, canvasX: o3, baselineY: r3, color: e3.color, fontSize: e3.fontSize, selectExistingContent: true }), Js();
      }(w2, d2.id, r2) : (Gr.updateActiveElementId(d2.id), Gn.setCursorStyle("move")), false;
    }
    Gr.updateEditingTextElementId(null), Gr.updatePendingEditingTextElement(null), Js();
    var f2 = e2 + Hn.position.left;
    return Ws(r2, f2, Jr.selectedColor, Jr.fontSize, ""), zs({ controller: r2, canvasX: e2, baselineY: t2, color: Jr.selectedColor, fontSize: Jr.fontSize }), false;
  }
  var js = function() {
    return null != Gr.activeElementId || Gr.canvasElements.some(function(A2) {
      var e2;
      return Boolean(null === (e2 = A2.element) || void 0 === e2 ? void 0 : e2.drawNode);
    });
  }, qs = function(A2, e2) {
    Nn.updateDrawGraphPosition(A2.mouseX, A2.mouseY), ys(A2.mouseX, A2.mouseY, e2);
  }, $s = function(A2) {
    return bo(), Us(A2.event, A2.mouseX, A2.mouseY), { prevElementId: null, dragOffset: { x: 0, y: 0 }, transformingExisting: false };
  }, Aa = function(A2, e2, t2, n2, r2) {
    var o2 = t2, i2 = go(A2, e2, o2);
    return null != n2 && Gn.setCursorStyle(n2), { prevElementId: o2, dragOffset: i2, transformingExisting: r2 };
  }, ea = function(A2, e2, t2, n2) {
    n2 || bo();
    return { prevElementId: t2, dragOffset: n2 ? go(A2, e2, t2) : { x: 0, y: 0 }, transformingExisting: n2 };
  }, ta = function(A2, e2) {
    bo();
    var t2 = so();
    return Gr.addElement({ id: t2, type: Jr.toolName, element: { id: t2, x: 0, y: 0 } }), Gr.updateActiveElementId(t2), { prevElementId: t2, dragOffset: go(A2, e2, t2), transformingExisting: false };
  }, na = { prevElementId: null, dragOffset: { x: 0, y: 0 }, transformingExisting: false }, ra = function(A2) {
    Jr.resetToolVerticalAnchor();
    var e2 = function(A3) {
      var e3 = Ns(A3);
      return { mouseX: e3.x, mouseY: e3.y };
    }(A2), t2 = e2.mouseX, n2 = e2.mouseY;
    na.prevElementId = function(A3, e3, t3) {
      if (!Jr.toolClickStatus || !js()) return t3;
      var n3 = null;
      return Gr.checkMouseInElement(A3, e3, function(A4) {
        n3 = A4;
      }), null != n3 ? t3 : bo() ? null : t3;
    }(t2, n2, na.prevElementId);
    var r2, o2 = function(A3, e3) {
      var t3, n3 = Xn.screenShotCanvas;
      if (!Ls() || null == n3) return e3;
      qs(A3, n3);
      var r3 = null;
      Gr.checkMouseInElement(A3.mouseX, A3.mouseY, function(A4) {
        r3 = A4;
      });
      var o3 = null !== (t3 = Gr.activeElementId) && void 0 !== t3 ? t3 : r3, i2 = "text" === Jr.toolName, s2 = Gn.mousePointer, a2 = null != r3, l2 = null != r3 ? Gr.getCanvasElement(r3) : null != o3 ? Gr.getCanvasElement(o3) : null;
      if (i2 && a2 && null != r3 && "text" === (null == l2 ? void 0 : l2.type) && null != r3) return Aa(A3.mouseX, A3.mouseY, r3, s2, true);
      if (i2) return ea(A3.mouseX, A3.mouseY, o3, a2);
      if (null != r3) {
        Us(A3.event, A3.mouseX, A3.mouseY);
        var c2 = go(A3.mouseX, A3.mouseY, r3);
        return Gr.resetCanvasElementNodeState(), Gr.updateActiveElementId(r3), { prevElementId: r3, dragOffset: c2, transformingExisting: true };
      }
      return ps() ? $s(A3) : ta(A3.mouseX, A3.mouseY);
    }({ event: A2, mouseX: t2, mouseY: n2 }, na);
    r2 = o2, na.prevElementId = r2.prevElementId, na.dragOffset = r2.dragOffset, na.transformingExisting = r2.transformingExisting, function(A3, e3) {
      var t3 = Os();
      t3 && function(A4, e4, t4) {
        A4.beginPath(), A4.moveTo(e4, t4);
      }(t3, A3, e3);
    }(t2, n2), function(A3, e3) {
      var t3 = ks();
      return Boolean(t3 && Zs(A3, e3, t3));
    }(t2, n2) || (Ms() ? function(A3, e3) {
      Nn.setDraggingTrim(true), Gr.updateMovePosition(A3, e3);
    }(t2, n2) : function(A3, e3) {
      Gr.updateDrawGraphPrevInfo(Nn.drawGraphPosition.startX, Nn.drawGraphPosition.startY), Nn.updateDrawGraphPosition(A3, e3);
    }(t2, n2));
  }, oa = function(e2, t2, n2) {
    var r2 = Xn.screenShotCanvas, o2 = Gn.screenShotController;
    if (null != r2 && null != o2) {
      var i2 = function(A2) {
        var e3 = Nn.drawGraphPosition, t3 = e3.startX, n3 = e3.startY, r3 = e3.width, o3 = e3.height, i3 = Ns(A2), s3 = i3.x, a3 = i3.y;
        return { metrics: { startX: t3, startY: n3, currentX: s3, currentY: a3, tempWidth: s3 - t3, tempHeight: a3 - n3 }, cropBoxSize: { width: r3, height: o3 } };
      }(e2), s2 = i2.metrics, a2 = i2.cropBoxSize;
      !Jr.toolClickStatus || Nn.dragging ? Jr.toolClickStatus && Nn.dragging ? Vs(A(A({}, s2), { event: e2, drawArrow: n2, dragOffset: na.dragOffset, prevElementId: na.prevElementId, transformingExisting: na.transformingExisting })) : function(A2, e3, t3, n3, r3, o3) {
        var i3 = A2.startX, s3 = A2.startY, a3 = A2.currentX, l2 = A2.currentY, c2 = A2.tempWidth, u2 = A2.tempHeight;
        if (Es(a3, l2, i3, s3, e3, t3, r3, n3), Nn.dragging && !Nn.draggingTrim) {
          var B2 = Jn(i3, s3, c2, u2, r3, Nn.borderSize, o3, n3);
          Gr.updateTempGraphPosition(B2.startX, B2.startY, B2.width, B2.height);
        }
      }(s2, a2.width, a2.height, t2, r2, o2) : Gr.checkMouseInElement(s2.currentX, s2.currentY, function(A2) {
        var e3 = 2 * Jr.penSize;
        ho(A2, s2.currentX, s2.currentY, e3);
      });
    }
  }, ia = function(A2, e2, t2) {
    null != Xn.screenShotCanvas && null != Gn.screenShotController && (function(A3) {
      return !Jr.toolClickStatus && !A3 && !Hn.clickCutFullScreen;
    }(A2) ? Nn.updateDrawGraphPosition(Gr.drawGraphPrevX, Gr.drawGraphPrevY) : (Xs(A2) && function(A3) {
      var e3 = Gn.screenShotController, t3 = Xn.screenShotCanvas;
      if (null != e3 && null != t3) {
        var n2 = Nn.borderSize;
        Gr.updateFullScreenStatus(true);
        var r2 = Jn(0, 0, (e3.clientWidth || parseFloat(e3.style.width) || e3.width) - n2 / 2, (e3.clientHeight || parseFloat(e3.style.height) || e3.height) - n2 / 2, t3, n2, e3, A3);
        Gr.updateTempGraphPosition(r2.startX, r2.startY, r2.width, r2.height);
      }
    }(e2), function(A3, e3, t3, n2) {
      void 0 === n2 && (n2 = false), bs() && (Is(t3), Hs(t3, n2) || (Ss(), xs(), Ks(A3) && Ds(e3)));
    }(A2, t2, na.prevElementId, na.transformingExisting)));
  }, sa = function() {
    function A2(A3) {
      var e2 = this;
      if (this.keyboardEventHandle = null, this.dragFlag = false, this.drawArrow = new gr(), this.mouseDownEvent = function(A4) {
        Jr.setColorPanelStatus(false), _r.setTextSizeOptionStatus(false), A4 instanceof MouseEvent && 0 != A4.button || (Ii() && A4 instanceof TouchEvent && Xn.screenShotCanvas && Es(A4.touches[0].pageX, A4.touches[0].pageY, Gr.tempGraphPosition.startX, Gr.tempGraphPosition.startY, Gr.tempGraphPosition.width, Gr.tempGraphPosition.height, Xn.screenShotCanvas, e2.screenShotImageController), "undo" != Jr.toolName && (Nn.setDragging(true), Gr.updateDrawStatus(false), ra(A4)));
      }, this.mouseMoveEvent = function(A4) {
        "undo" != Jr.toolName && (A4.preventDefault(), !Jr.toolClickStatus && Nn.dragging && (e2.dragFlag = true, Jr.setToolStatus(false), Nn.setCutBoxSizeStatus(false)), oa(A4, e2.screenShotImageController, e2.drawArrow));
      }, this.mouseUpEvent = function() {
        "undo" != Jr.toolName && (Nn.setDragging(false), Nn.setDraggingTrim(false), ia(e2.dragFlag, e2.screenShotImageController, function() {
          e2.dragFlag = false;
        }));
      }, !Pr()) throw new Error("js-web-screen-shot must be instantiated in a browser environment.");
      var t2 = Ei(A3);
      !function(A4) {
        A4 && vi(A4, Ui);
      }(t2), new di(t2), Gn.initWebRtcDom(), this.screenShotImageController = document.createElement("canvas"), function(A4) {
        try {
          vi(A4, Hi);
        } catch (A5) {
          console.error("设置截图参数时出错:", A5);
        }
      }(t2), Gn.hydrateDomRefs(), Xr.hydrateDomRefs(), this.load(t2);
    }
    return A2.prototype.load = function(A3) {
      var e2, t2, n2, r2 = this, o2 = A3.triggerCallback, i2 = A3.cancelCallback;
      e2 = this.screenShotImageController, t2 = Hn.getCanvasSize(), n2 = { width: parseFloat(window.getComputedStyle(document.body).width), height: parseFloat(window.getComputedStyle(document.body).height) }, Vi(n2.width, n2.height), Ni(Hn.position.left, Hn.position.top), e2.width = n2.width, e2.height = n2.height, 0 !== t2.canvasWidth && 0 !== t2.canvasHeight && (Vi(t2.canvasWidth, t2.canvasHeight), e2.width = t2.canvasWidth, e2.height = t2.canvasHeight);
      var s2 = null;
      if (null != Gn.screenShotController && (s2 = u(Gn.screenShotController, this.screenShotImageController.width, this.screenShotImageController.height)), null != s2) {
        Gn.showScreenShotPanel();
        var a2 = { mouseDownEvent: this.mouseDownEvent, mouseMoveEvent: this.mouseMoveEvent, mouseUpEvent: this.mouseUpEvent }, l2 = function() {
          var A4, e3 = ls.find(function(A5) {
            return A5.predicate();
          });
          return { captureSource: null !== (A4 = null == e3 ? void 0 : e3.captureSource) && void 0 !== A4 ? A4 : "browser-display-media", renderStrategy: Hn.wrcWindowMode ? "window-frame" : "browser-frame" };
        }();
        !function(A4, e3, t3, n3, r3, o3, i3) {
          var s3, a3 = { plan: A4, mouseEvents: e3, context: t3, triggerCallback: n3, cancelCallback: r3, getImageController: o3, setImageController: i3 }, l3 = { "static-image": cs, "dom-render": us, "snapdom-render": Bs, "injected-media-stream": hs, "browser-display-media": hs };
          (null !== (s3 = l3[A4.captureSource]) && void 0 !== s3 ? s3 : l3["browser-display-media"])(a3);
        }(l2, a2, s2, o2, i2, function() {
          return r2.screenShotImageController;
        }, function(A4) {
          r2.screenShotImageController = A4;
        }), function() {
          var e3, t3, n3;
          null != Xr.toolController && null != Gn.screenShotController && null != Gn.textInputController && (!function(A4) {
            if (!(null == Gn.screenShotController || null == Xr.toolController || null == Gn.textInputController || null == Xr.optionIcoController || null == Xr.optionController || null == Gn.cutBoxSizeContainer || A4 <= 0)) {
              var e4 = "".concat(A4), t4 = "".concat(A4 + 1);
              Gn.screenShotController.style.zIndex = e4, [Xr.toolController, Gn.textInputController, Xr.optionIcoController, Xr.optionController, Gn.cutBoxSizeContainer].forEach(function(A5) {
                null != A5 && (A5.style.zIndex = t4);
              });
            }
          }(null !== (e3 = A3.level) && void 0 !== e3 ? e3 : 0), r2.keyboardEventHandle = new Ci(Gn.screenShotController, Xr.toolController), t3 = Gn.textInputController, n3 = function(A4) {
            var e4 = Xn.screenShotCanvas;
            if (null != e4) {
              var n4 = (A4.metaKey || A4.ctrlKey) && "Enter" === A4.code, r3 = "Escape" === A4.code;
              (n4 || r3) && (A4.preventDefault(), A4.stopPropagation(), Li({ controller: t3, canvasContext: e4, persistText: !r3 }));
            }
          }, t3.addEventListener("keydown", n3), jr(function() {
            t3.removeEventListener("keydown", n3);
          }), Hn.customRightClickEvent.state && function(A4) {
            var e4 = function(A5) {
              A5.preventDefault(), Hn.customRightClickEvent.handleFn ? Hn.customRightClickEvent.handleFn() : eo();
            };
            A4.addEventListener("contextmenu", e4), jr(function() {
              A4.removeEventListener("contextmenu", e4);
            });
          }(Gn.screenShotController), Ao());
        }();
      }
    }, A2.prototype.destroyComponents = function() {
      eo();
    }, A2.prototype.completeScreenshot = function() {
      this.keyboardEventHandle && this.keyboardEventHandle.triggerEvent("confirm");
    }, A2.prototype.getCanvasElementsPosition = function() {
      return JSON.parse(JSON.stringify(Gr.canvasElements));
    }, A2.prototype.getCutBoxInfo = function() {
      return JSON.parse(JSON.stringify(Nn.cutOutBoxPosition));
    }, A2;
  }();
  async function measureStreamVideoPixels(stream) {
    const track = stream.getVideoTracks()[0];
    const settings = track?.getSettings();
    let width = settings?.width ?? 0;
    let height = settings?.height ?? 0;
    if (width > 0 && height > 0) return { width, height };
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    try {
      await video.play().catch(() => void 0);
      for (let i2 = 0; i2 < 80 && (!video.videoWidth || !video.videoHeight); i2++) {
        await new Promise((r2) => requestAnimationFrame(() => r2()));
      }
      return { width: video.videoWidth, height: video.videoHeight };
    } finally {
      video.pause();
      video.srcObject = null;
    }
  }
  function pickRenderForDisplayStream(stream) {
    const track = stream.getVideoTracks()[0];
    const settings = track?.getSettings();
    const surface = settings?.displaySurface;
    if (surface === "monitor" || surface === "window") return "window-frame";
    if (surface === "browser") return "browser-frame";
    const vw = settings?.width ?? 0;
    const vh = settings?.height ?? 0;
    if (vw <= 0 || vh <= 0) return "browser-frame";
    const dpr = window.devicePixelRatio || 1;
    const screenW = window.screen.width * dpr;
    const screenH = window.screen.height * dpr;
    const viewW = window.innerWidth * dpr;
    const viewH = window.innerHeight * dpr;
    const coversScreen = vw >= screenW * 0.88 && vh >= screenH * 0.88;
    if (coversScreen) return "window-frame";
    const matchesViewport = Math.abs(vw - viewW) <= viewW * 0.12 && Math.abs(vh - viewH) <= viewH * 0.12;
    if (matchesViewport) return "window-frame";
    return "browser-frame";
  }
  async function resolveInjectedStreamCanvasLayout(stream) {
    const render = pickRenderForDisplayStream(stream);
    const { width: pxW, height: pxH } = await measureStreamVideoPixels(stream);
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    if (!pxW || !pxH) {
      return { canvasWidth: winW, canvasHeight: winH, render: "window-frame" };
    }
    const surface = stream.getVideoTracks()[0]?.getSettings()?.displaySurface;
    const dpr = window.devicePixelRatio || 1;
    const videoCssW = pxW / dpr;
    const videoCssH = pxH / dpr;
    const videoAspect = videoCssW / Math.max(1, videoCssH);
    const winAspect = winW / Math.max(1, winH);
    const aspectClose = Math.abs(videoAspect - winAspect) <= 0.1;
    if (render === "window-frame" || surface === "monitor" || surface === "window" || aspectClose || pxW >= winW * dpr * 0.9 && pxH >= winH * dpr * 0.9) {
      return { canvasWidth: winW, canvasHeight: winH, render: "window-frame" };
    }
    let canvasWidth = winW;
    let canvasHeight = Math.round(winW / videoAspect);
    if (canvasHeight > winH) {
      canvasHeight = winH;
      canvasWidth = Math.round(winH * videoAspect);
    }
    return { canvasWidth, canvasHeight, render: "browser-frame" };
  }
  const STYLE_ID = "__sshot_toolbar_preserve";
  function applyCaptureToolbarPreserveStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
#toolPanel,
#optionIcoController,
#optionPanel,
#cutBoxSizePanel {
  z-index: 2147483647 !important;
  visibility: visible !important;
  pointer-events: auto !important;
}
body.no-cursor #toolPanel,
body.no-cursor #toolPanel *,
body.no-cursor #optionIcoController,
body.no-cursor #optionIcoController *,
body.no-cursor #optionPanel,
body.no-cursor #optionPanel *,
body.no-cursor #cutBoxSizePanel {
  cursor: default !important;
}
`;
    document.documentElement.appendChild(el);
  }
  function removeCaptureToolbarPreserveStyles() {
    document.getElementById(STYLE_ID)?.remove();
  }
  const GREEN_BORDER = "rgba(38, 220, 98, 0.98)";
  async function waitForDisplayStreamReady(stream, timeoutMs = 2500) {
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.srcObject = null;
    };
    try {
      await video.play().catch(() => void 0);
      let lastW = 0;
      let lastH = 0;
      let stableFrames = 0;
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const w2 = video.videoWidth;
        const h2 = video.videoHeight;
        if (w2 > 0 && h2 > 0) {
          if (w2 === lastW && h2 === lastH) stableFrames += 1;
          else {
            lastW = w2;
            lastH = h2;
            stableFrames = 0;
          }
          if (stableFrames >= 2) return;
        }
        await new Promise((r2) => requestAnimationFrame(() => r2()));
      }
    } finally {
      cleanup();
    }
  }
  class CaptureCancelledError extends Error {
    constructor() {
      super("cancelled");
      this.name = "CaptureCancelledError";
    }
  }
  function isBenignCaptureDismissal(err) {
    if (err instanceof CaptureCancelledError) return true;
    if (err instanceof DOMException) {
      const name = err.name;
      if (name === "NotAllowedError" || name === "AbortError" || name === "NotFoundError") {
        return true;
      }
    }
    const message = err instanceof Error ? err.message : String(err ?? "");
    return /cancel|aborted|denied|dismiss|not allowed|permission/i.test(message);
  }
  function normalizeBase64(base64) {
    const raw = String(base64 ?? "").trim();
    if (!raw) return "";
    if (raw.startsWith("data:")) return raw;
    if (/^base64,/i.test(raw)) return `data:image/png;base64,${raw.replace(/^base64,/i, "")}`;
    return `data:image/png;base64,${raw}`;
  }
  function dataUrlToBlob(dataUrl) {
    const normalized = normalizeBase64(dataUrl);
    const comma = normalized.indexOf(",");
    if (comma < 0) return null;
    const header = normalized.slice(0, comma);
    const b64 = normalized.slice(comma + 1).trim();
    if (!b64) return null;
    const mime = /data:([^;]+)/.exec(header)?.[1] ?? "image/png";
    try {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i2 = 0; i2 < binary.length; i2++) bytes[i2] = binary.charCodeAt(i2);
      return new Blob([bytes], { type: mime });
    } catch {
      return null;
    }
  }
  function stopStream(stream) {
    stream?.getTracks().forEach((t2) => {
      try {
        t2.stop();
      } catch {
      }
    });
  }
  async function assertBlobHasVisiblePixels(blob) {
    if (typeof createImageBitmap !== "function") return;
    const bmp = await createImageBitmap(blob);
    const w2 = Math.min(48, bmp.width);
    const h2 = Math.min(48, bmp.height);
    if (w2 < 2 || h2 < 2) {
      bmp.close();
      throw new Error("截图尺寸无效");
    }
    const canvas = document.createElement("canvas");
    canvas.width = w2;
    canvas.height = h2;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      bmp.close();
      throw new Error("无法校验截图");
    }
    ctx.drawImage(bmp, 0, 0, w2, h2);
    bmp.close();
    const { data } = ctx.getImageData(0, 0, w2, h2);
    let hits = 0;
    for (let i2 = 0; i2 < data.length; i2 += 4) {
      const a2 = data[i2 + 3];
      const lum = data[i2] + data[i2 + 1] + data[i2 + 2];
      if (a2 > 12 && lum > 24) hits++;
    }
    if (hits < 4) {
      throw new Error("截图为空白，请换共享「窗口」或「整个屏幕」后重试");
    }
  }
  function startRegionCaptureWithStream(stream) {
    return new Promise((resolve, reject) => {
      let settled = false;
      let plugin = null;
      const finish = (fn2) => {
        if (settled) return;
        settled = true;
        fn2();
      };
      const cleanup = () => {
        stopStream(stream);
        try {
          plugin?.destroyComponents?.();
        } catch {
        }
        plugin = null;
        document.body.classList.remove("no-cursor");
        document.documentElement.style.overflow = "";
        removeCaptureToolbarPreserveStyles();
      };
      void (async () => {
        try {
          await waitForDisplayStreamReady(stream);
          const layout = await resolveInjectedStreamCanvasLayout(stream);
          window.scrollTo(0, 0);
          document.documentElement.style.overflow = "hidden";
          applyCaptureToolbarPreserveStyles();
          plugin = new sa({
            capture: {
              source: "injected-stream",
              stream,
              render: layout.render,
              cursor: "never"
            },
            writeBase64: false,
            showScreenData: true,
            clickCutFullScreen: true,
            canvasWidth: layout.canvasWidth,
            canvasHeight: layout.canvasHeight,
            imgAutoFit: true,
            wrcReplyTime: 800,
            level: 99999,
            cutBoxBdColor: GREEN_BORDER,
            completeCallback: (res) => {
              finish(() => {
                void (async () => {
                  try {
                    const dataUrl = normalizeBase64(String(res?.base64 ?? ""));
                    const blob = dataUrlToBlob(dataUrl);
                    if (!blob || blob.size < 1024) {
                      throw new Error("截图数据无效，请重新框选后再点确定");
                    }
                    await assertBlobHasVisiblePixels(blob);
                    await copyImageToClipboard(dataUrl, blob);
                    cleanup();
                    resolve(dataUrl);
                  } catch (err) {
                    cleanup();
                    reject(err);
                  }
                })();
              });
            },
            closeCallback: () => {
              finish(() => {
                cleanup();
                reject(new CaptureCancelledError());
              });
            },
            cancelCallback: () => {
              finish(() => {
                cleanup();
                reject(new CaptureCancelledError());
              });
            }
          });
        } catch (err) {
          cleanup();
          reject(err);
        }
      })();
    });
  }
  async function copyImageToClipboard(dataUrl, blob) {
    try {
      const resp = await chrome.runtime.sendMessage({
        type: "CLIPBOARD_IMAGE",
        dataUrl
      });
      if (resp?.ok) return;
      if (resp?.error) throw new Error(String(resp.error));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!/receiving end does not exist/i.test(msg)) {
        console.warn("[sshot] background clipboard failed, fallback in page", msg);
      }
    }
    const pngBlob = blob.type === "image/png" ? blob : dataUrlToBlob(dataUrl);
    if (!pngBlob) throw new Error("无法生成 PNG");
    if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": Promise.resolve(pngBlob)
        })
      ]);
      return;
    }
    const a2 = document.createElement("a");
    a2.href = dataUrl;
    a2.download = `screenshot_${Date.now()}.png`;
    a2.click();
    throw new Error("无法写入剪贴板，已改为下载 PNG");
  }
  function showToast(message, isError = false) {
    const root = document.documentElement ?? document.body;
    if (!root) return;
    const id = "__sshot_toast";
    document.getElementById(id)?.remove();
    const el = document.createElement("div");
    el.id = id;
    el.textContent = message;
    el.style.cssText = [
      "position:fixed",
      "left:50%",
      "bottom:24px",
      "transform:translateX(-50%)",
      "z-index:2147483647",
      "padding:10px 16px",
      "border-radius:10px",
      "font:13px/1.4 system-ui,sans-serif",
      "color:#e7eaf0",
      isError ? "background:rgba(180,40,40,0.95)" : "background:rgba(24,28,36,0.96)",
      "border:1px solid rgba(255,255,255,0.12)",
      "box-shadow:0 12px 40px rgba(0,0,0,0.35)",
      "max-width:min(420px,calc(100vw - 32px))",
      "text-align:center"
    ].join(";");
    root.appendChild(el);
    window.setTimeout(() => el.remove(), isError ? 6e3 : 3e3);
  }
  let captureBusy = false;
  async function runCapturePipeline(streamPromise) {
    if (captureBusy) return;
    captureBusy = true;
    let stream = null;
    try {
      stream = await streamPromise;
      await waitForDisplayStreamReady(stream);
      await startRegionCaptureWithStream(stream);
      stream = null;
      showToast("已复制到剪贴板");
    } catch (err) {
      stopStream(stream);
      if (isBenignCaptureDismissal(err)) return;
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[sshot] capture failed", message);
      showToast(`截图失败：${message}`, true);
      try {
        chrome.runtime.sendMessage({ type: "SCREENSHOT_ERROR", message, source: "content" });
      } catch {
      }
    } finally {
      captureBusy = false;
    }
  }
  function getStreamFromDesktopCaptureId(streamId) {
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: streamId,
          maxFrameRate: 30
        }
      }
    });
  }
  function beginCaptureWithStreamId(streamId) {
    if (captureBusy || !streamId) return;
    void runCapturePipeline(getStreamFromDesktopCaptureId(streamId));
  }
  function beginCaptureFromUserGesture() {
    if (captureBusy) return;
    if (!navigator.mediaDevices?.getDisplayMedia) {
      showToast("当前环境不支持屏幕共享", true);
      return;
    }
    const streamPromise = navigator.mediaDevices.getDisplayMedia({
      video: { cursor: "never" },
      audio: false
    });
    void runCapturePipeline(streamPromise);
  }
  function registerCaptureRuntime() {
    const g2 = globalThis;
    g2.__sshotStartCapture = beginCaptureFromUserGesture;
    g2.__sshotStartCaptureWithStreamId = beginCaptureWithStreamId;
    if (g2.__sshotCaptureBooted) return;
    g2.__sshotCaptureBooted = true;
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.dataset.sshotExtension = "1";
    }
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg?.type === "PING") {
        sendResponse({ ok: true });
        return;
      }
      if (msg?.type === "CAPTURE_REQUEST") {
        beginCaptureFromUserGesture();
        sendResponse({ ok: true });
        return;
      }
      if (msg?.type === "CAPTURE_STREAM_ID" && typeof msg.streamId === "string") {
        beginCaptureWithStreamId(msg.streamId);
        sendResponse({ ok: true });
        return;
      }
    });
  }
  const isExtensionCapturePage = location.protocol === "chrome-extension:" && /\/capture\.html$/i.test(location.pathname);
  const PENDING_STREAM_KEY = "sshotPendingStreamId";
  async function tryConsumePendingStreamId() {
    try {
      const data = await chrome.storage.session.get(PENDING_STREAM_KEY);
      const streamId = data?.[PENDING_STREAM_KEY];
      if (typeof streamId === "string" && streamId) {
        await chrome.storage.session.remove(PENDING_STREAM_KEY);
        beginCaptureWithStreamId(streamId);
        return true;
      }
    } catch {
    }
    return false;
  }
  function updateCapturePageHint(params) {
    const hint = document.getElementById("sshot-hint");
    if (!hint) return;
    const reason = params.get("reason");
    if (reason === "restricted") {
      hint.textContent = "当前是浏览器内置页（新标签 / 搜索页），无法在原页截图。请点下方按钮，在共享窗口中选择「窗口」「整个屏幕」或要截的标签页。";
      return;
    }
    if (reason === "picker-cancelled") {
      hint.textContent = "未选择共享内容。请点下方按钮，重新选择「Chrome 标签页」「窗口」或「整个屏幕」。";
      return;
    }
    hint.textContent = "请点下方按钮，在共享窗口中选择「Chrome 标签页」「窗口」或「整个屏幕」，然后开始区域截图。";
  }
  if (window === window.top) {
    registerCaptureRuntime();
    if (isExtensionCapturePage) {
      const params = new URLSearchParams(location.search);
      const bindStartButton = () => {
        document.getElementById("sshot-start-btn")?.addEventListener("click", () => {
          beginCaptureFromUserGesture();
        });
      };
      const bootCapturePage = async () => {
        updateCapturePageHint(params);
        bindStartButton();
        if (await tryConsumePendingStreamId()) return;
        if (params.get("autostart") === "1") {
          beginCaptureFromUserGesture();
        }
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          void bootCapturePage();
        });
      } else {
        void bootCapturePage();
      }
    }
  }
})();
