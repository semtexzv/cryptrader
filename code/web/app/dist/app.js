// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

function __exportStar(m, exports) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator],
      i = 0;
  if (m) return m.call(o);
  return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result.default = mod;
  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}
},{}],"util/api.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAll = getAll;
exports.getOne = getOne;
exports.postOne = postOne;
exports.Trader = exports.Assignment = exports.Strategy = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class Strategy {}

exports.Strategy = Strategy;

class Assignment {
  constructor() {
    this.exchange = null;
    this.pair = null;
    this.period = null;
    this.strategy_id = null;
    this.trader_id = null;
  }

}

exports.Assignment = Assignment;

class Trader {
  constructor() {
    this.id = null;
    this.name = null;
    this.exchange = null;
    this.api_key = null;
    this.api_secret = null;
  }

}

exports.Trader = Trader;

function getAll(base) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    let data = yield fetch(`/api/${base}`, {
      credentials: "include",
      headers: {
        'Accept': 'application/json'
      }
    });

    if (data.status == 401) {
      window.location.href = "/app/login";
      return [];
    }

    return yield data.json();
  });
}

function getOne(base, id) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    let data = yield fetch(`/api/${base}/${id}`, {
      credentials: "include",
      headers: {
        'Accept': 'application/json'
      }
    });

    if (data.status == 401) {
      window.location.href = "/app/login";
      return {};
    }

    return yield data.json();
  });
}

function postOne(base, v) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    let url = v.hasOwnProperty('id') && v['id'] != null ? `/api/${base}/${v.id}` : `/api/${base}`;
    let data = yield fetch(url, {
      credentials: 'include',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(v)
    });

    try {
      return yield data.json();
    } catch (e) {
      return null;
    }
  });
}
},{"tslib":"../node_modules/tslib/tslib.es6.js"}],"../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive so that lit-html will call the function
 * during template rendering, rather than passing as a value.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object
 *
 * @example
 *
 * ```
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 * ```
 */
// tslint:disable-next-line:no-any

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  let node = start;

  while (node !== end) {
    const n = node.nextSibling;
    container.insertBefore(node, before);
    node = n;
  }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, startNode, endNode = null) => {
  let node = startNode;

  while (node !== endNode) {
    const n = node.nextSibling;
    container.removeChild(node);
    node = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    let index = -1;
    let partIndex = 0;
    const nodesToRemove = [];

    const _prepareTemplate = template => {
      const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      const walker = document.createTreeWalker(content, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false); // Keeps track of the last index associated with a part. We try to delete
      // unnecessary nodes, but we never want to associate two different parts
      // to the same index. They must have a constant node between.

      let lastPartIndex = 0;

      while (walker.nextNode()) {
        index++;
        const node = walker.currentNode;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              let count = 0;

              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = result.strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                const strings = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings
                });
                node.removeAttribute(attributeLookupName);
                partIndex += strings.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              _prepareTemplate(node);
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            const data = node.data;

            if (data.indexOf(marker) >= 0) {
              const parent = node.parentNode;
              const strings = data.split(markerRegex);
              const lastIndex = strings.length - 1; // Generate a new text node for each literal section
              // These nodes are also used as the markers for node parts

              for (let i = 0; i < lastIndex; i++) {
                parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
                this.parts.push({
                  type: 'node',
                  index: ++index
                });
              } // If there's no text, we must insert a comment to mark our place.
              // Else, we can trust it will stick around after cloning.


              if (strings[lastIndex] === '') {
                parent.insertBefore(createMarker(), node);
                nodesToRemove.push(node);
              } else {
                node.data = strings[lastIndex];
              } // We have a part for each match found


              partIndex += lastIndex;
            }
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.data === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * The previousSibling is already the start of a previous part

              if (node.previousSibling === null || index === lastPartIndex) {
                index++;
                parent.insertBefore(createMarker(), node);
              }

              lastPartIndex = index;
              this.parts.push({
                type: 'node',
                index
              }); // If we don't have a nextSibling, keep this node so we have an end.
              // Else, we can remove it to save future costs.

              if (node.nextSibling === null) {
                node.data = '';
              } else {
                nodesToRemove.push(node);
                index--;
              }

              partIndex++;
            } else {
              let i = -1;

              while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this._parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this._parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this._parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // When using the Custom Elements polyfill, clone the node, rather than
    // importing it, to keep the fragment in the template's document. This
    // leaves the fragment inert so custom elements won't upgrade and
    // potentially modify their contents by creating a polyfilled ShadowRoot
    // while we traverse the tree.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const parts = this.template.parts;
    let partIndex = 0;
    let nodeIndex = 0;

    const _prepareInstance = fragment => {
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null
      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length && node !== null) {
        const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
        // multiple bound attributes on an element. So each iteration we either
        // increment the nodeIndex, if we aren't on a node with a part, or the
        // partIndex if we are. By not incrementing the nodeIndex when we find a
        // part, we allow for the next part to be associated with the current
        // node if neccessasry.

        if (!(0, _template.isTemplatePartActive)(part)) {
          this._parts.push(undefined);

          partIndex++;
        } else if (nodeIndex === part.index) {
          if (part.type === 'node') {
            const part = this.processor.handleTextExpression(this.options);
            part.insertAfterNode(node.previousSibling);

            this._parts.push(part);
          } else {
            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
          }

          partIndex++;
        } else {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            _prepareInstance(node.content);
          }

          node = walker.nextNode();
        }
      }
    };

    _prepareInstance(fragment);

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const endIndex = this.strings.length - 1;
    let html = '';

    for (let i = 0; i < endIndex; i++) {
      const s = this.strings[i]; // This exec() call does two things:
      // 1) Appends a suffix to the bound attribute name to opt out of special
      // attribute value parsing that IE11 and Edge do, like for style and
      // many SVG attributes. The Template class also appends the same suffix
      // when looking up attributes to create Parts.
      // 2) Adds an unquoted-attribute-safe marker for the first expression in
      // an attribute. Subsequent attribute expressions will use node markers,
      // and this is safe since attributes with multiple expressions are
      // guaranteed to be quoted.

      const match = _template.lastAttributeNameRegex.exec(s);

      if (match) {
        // We're starting a new bound attribute.
        // Add the safe attribute suffix, and use unquoted-attribute-safe
        // marker.
        html += s.substr(0, match.index) + match[1] + match[2] + _template.boundAttributeSuffix + match[3] + _template.marker;
      } else {
        // We're either in a bound node, or trailing bound attribute.
        // Either way, nodeMarker is safe to use.
        html += s + _template.nodeMarker;
      }
    }

    return html + this.strings[endIndex];
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};
/**
 * Sets attribute values for AttributeParts, so that the value is only set once
 * even if there are multiple parts for an attribute.
 */


exports.isPrimitive = isPrimitive;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (v != null && (Array.isArray(v) || // tslint:disable-next-line:no-any
        typeof v !== 'string' && v[Symbol.iterator])) {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        } else {
          text += typeof v === 'string' ? v : String(v);
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}

exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(comitter) {
    this.value = undefined;
    this.committer = comitter;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}

exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.options = options;
  }
  /**
   * Inserts this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
   * its next sibling must be static, unchanging nodes such as those that appear
   * in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part._insert(this.startNode = (0, _template.createMarker)());

    part._insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Appends this part after `ref`
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref._insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    const value = this._pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this._commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this._commitTemplateResult(value);
    } else if (value instanceof Node) {
      this._commitNode(value);
    } else if (Array.isArray(value) || // tslint:disable-next-line:no-any
    value[Symbol.iterator]) {
      this._commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this._commitText(value);
    }
  }

  _insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  _commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this._insert(value);

    this.value = value;
  }

  _commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = value;
      } else {
      this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
    }

    this.value = value;
  }

  _commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this._commitNode(fragment);

      this.value = instance;
    }
  }

  _commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this._pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const value = !!this._pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }
    }

    this.value = value;
    this._pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this._boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const newListener = this._pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    if (shouldAddListener) {
      this._options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    this.value = newListener;
    this._pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../node_modules/lit-html/lib/directive.js","./dom.js":"../node_modules/lit-html/lib/dom.js","./part.js":"../node_modules/lit-html/lib/part.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../node_modules/lit-html/lib/template-result.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const comitter = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return comitter.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const comitter = new _parts.AttributeCommitter(element, name, strings);
    return comitter.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"../node_modules/lit-html/lib/parts.js"}],"../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const parts = new WeakMap();
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./parts.js":"../node_modules/lit-html/lib/parts.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js"}],"../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */

const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../node_modules/lit-html/lib/dom.js","./lib/part.js":"../node_modules/lit-html/lib/part.js","./lib/parts.js":"../node_modules/lit-html/lib/parts.js","./lib/render.js":"../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/modify-template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodesFromTemplate = removeNodesFromTemplate;
exports.insertNodeIntoTemplate = insertNodeIntoTemplate;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module shady-render
 */
const walkerNodeFilter = 133
/* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */

function removeNodesFromTemplate(template, nodesToRemove) {
  const {
    element: {
      content
    },
    parts
  } = template;
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let part = parts[partIndex];
  let nodeIndex = -1;
  let removeCount = 0;
  const nodesToRemoveInTemplate = [];
  let currentRemovingNode = null;

  while (walker.nextNode()) {
    nodeIndex++;
    const node = walker.currentNode; // End removal if stepped past the removing node

    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    } // A node to remove was found in the template


    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node); // Track node we're removing

      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    } // When removing, increment count by which to adjust subsequent part indices


    if (currentRemovingNode !== null) {
      removeCount++;
    }

    while (part !== undefined && part.index === nodeIndex) {
      // If part is in a removed node deactivate it by setting index to -1 or
      // adjust the index as needed.
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      part = parts[partIndex];
    }
  }

  nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
}

const countNodes = node => {
  let count = node.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  ? 0 : 1;
  const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

  while (walker.nextNode()) {
    count++;
  }

  return count;
};

const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
  for (let i = startIndex + 1; i < parts.length; i++) {
    const part = parts[i];

    if ((0, _template.isTemplatePartActive)(part)) {
      return i;
    }
  }

  return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */


function insertNodeIntoTemplate(template, node, refNode = null) {
  const {
    element: {
      content
    },
    parts
  } = template; // If there's no refNode, then put node at end of template.
  // No part indices need to be shifted in this case.

  if (refNode === null || refNode === undefined) {
    content.appendChild(node);
    return;
  }

  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let insertCount = 0;
  let walkerIndex = -1;

  while (walker.nextNode()) {
    walkerIndex++;
    const walkerNode = walker.currentNode;

    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }

    while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
      // If we've inserted the node, simply adjust all subsequent parts
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }

        return;
      }

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
    }
  }
}
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/shady-render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml.svg;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml.TemplateResult;
  }
});
exports.render = void 0;

var _dom = require("./dom.js");

var _modifyTemplate = require("./modify-template.js");

var _render = require("./render.js");

var _templateFactory = require("./template-factory.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Module to add shady DOM/shady CSS polyfill support to lit-html template
 * rendering. See the [[render]] method for details.
 *
 * @module shady-render
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

let compatibleShadyCSSVersion = true;

if (typeof window.ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
  console.warn(`Incompatible ShadyCSS version detected.` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` + `@webcomponents/shadycss@1.3.1.`);
  compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */


const shadyTemplateFactory = scopeName => result => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);

  let templateCache = _templateFactory.templateCaches.get(cacheKey);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };

    _templateFactory.templateCaches.set(cacheKey, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  }

  const key = result.strings.join(_template.marker);
  template = templateCache.keyString.get(key);

  if (template === undefined) {
    const element = result.getTemplateElement();

    if (compatibleShadyCSSVersion) {
      window.ShadyCSS.prepareTemplateDom(element, scopeName);
    }

    template = new _template.Template(result, element);
    templateCache.keyString.set(key, template);
  }

  templateCache.stringsArray.set(result.strings, template);
  return template;
};

const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */

const removeStylesFromLitTemplates = scopeName => {
  TEMPLATE_TYPES.forEach(type => {
    const templates = _templateFactory.templateCaches.get(getTemplateCacheKey(type, scopeName));

    if (templates !== undefined) {
      templates.keyString.forEach(template => {
        const {
          element: {
            content
          }
        } = template; // IE 11 doesn't support the iterable param Set constructor

        const styles = new Set();
        Array.from(content.querySelectorAll('style')).forEach(s => {
          styles.add(s);
        });
        (0, _modifyTemplate.removeNodesFromTemplate)(template, styles);
      });
    }
  });
};

const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */

const prepareTemplateStyles = (renderedDOM, template, scopeName) => {
  shadyRenderSet.add(scopeName); // Move styles out of rendered DOM and store.

  const styles = renderedDOM.querySelectorAll('style'); // If there are no styles, skip unnecessary work

  if (styles.length === 0) {
    // Ensure prepareTemplateStyles is called to support adding
    // styles via `prepareAdoptedCssText` since that requires that
    // `prepareTemplateStyles` is called.
    window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
    return;
  }

  const condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
  // manipulations will not prevent us from being able to fix up template
  // part indices.
  // NOTE: collecting styles is inefficient for browsers but ShadyCSS
  // currently does this anyway. When it does not, this should be changed.

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    style.parentNode.removeChild(style);
    condensedStyle.textContent += style.textContent;
  } // Remove styles from nested templates in this scope.


  removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
  // `template`.

  (0, _modifyTemplate.insertNodeIntoTemplate)(template, condensedStyle, template.element.content.firstChild); // Note, it's important that ShadyCSS gets the template that `lit-html`
  // will actually render so that it can update the style inside when
  // needed (e.g. @apply native Shadow DOM case).

  window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);

  if (window.ShadyCSS.nativeShadow) {
    // When in native Shadow DOM, re-add styling to rendered content using
    // the style ShadyCSS produced.
    const style = template.element.content.querySelector('style');
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else {
    // When not in native Shadow DOM, at this point ShadyCSS will have
    // removed the style from the lit template and parts will be broken as a
    // result. To fix this, we put back the style node ShadyCSS removed
    // and then tell lit to remove that node from the template.
    // NOTE, ShadyCSS creates its own style so we can safely add/remove
    // `condensedStyle` here.
    template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
    const removes = new Set();
    removes.add(condensedStyle);
    (0, _modifyTemplate.removeNodesFromTemplate)(template, removes);
  }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */


const render = (result, container, options) => {
  const scopeName = options.scopeName;

  const hasRendered = _render.parts.has(container);

  const needsScoping = container instanceof ShadowRoot && compatibleShadyCSSVersion && result instanceof _templateResult.TemplateResult; // Handle first render to a scope specially...

  const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
  // fragment that is reused since nested renders can occur synchronously.

  const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
  (0, _render.render)(result, renderContainer, Object.assign({
    templateFactory: shadyTemplateFactory(scopeName)
  }, options)); // When performing first scope render,
  // (1) We've rendered into a fragment so that there's a chance to
  // `prepareTemplateStyles` before sub-elements hit the DOM
  // (which might cause them to render based on a common pattern of
  // rendering in a custom element's `connectedCallback`);
  // (2) Scope the template with ShadyCSS one time only for this scope.
  // (3) Render the fragment into the container and make sure the
  // container knows its `part` is the one we just rendered. This ensures
  // DOM will be re-used on subsequent renders.

  if (firstScopeRender) {
    const part = _render.parts.get(renderContainer);

    _render.parts.delete(renderContainer);

    if (part.value instanceof _templateInstance.TemplateInstance) {
      prepareTemplateStyles(renderContainer, part.value.template, scopeName);
    }

    (0, _dom.removeNodes)(container, container.firstChild);
    container.appendChild(renderContainer);

    _render.parts.set(container, part);
  } // After elements have hit the DOM, update styling if this is the
  // initial render to this container.
  // This is needed whenever dynamic changes are made so it would be
  // safest to do every render; however, this would regress performance
  // so we leave it up to the user to call `ShadyCSSS.styleElement`
  // for dynamic changes.


  if (!hasRendered && needsScoping) {
    window.ShadyCSS.styleElement(container.host);
  }
};

exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./modify-template.js":"../node_modules/lit-html/lib/modify-template.js","./render.js":"../node_modules/lit-html/lib/render.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../node_modules/lit-html/lib/template-result.js","./template.js":"../node_modules/lit-html/lib/template.js","../lit-html.js":"../node_modules/lit-html/lit-html.js"}],"../node_modules/lit-element/lib/updating-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdatingElement = exports.notEqual = exports.defaultConverter = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty = (prop, _obj) => prop;

const defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value ? '' : null;

      case Object:
      case Array:
        // if the value is `null` or `undefined` pass this through
        // to allow removing/no change behavior.
        return value == null ? value : JSON.stringify(value);
    }

    return value;
  },

  fromAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value !== null;

      case Number:
        return value === null ? null : Number(value);

      case Object:
      case Array:
        return JSON.parse(value);
    }

    return value;
  }

};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */

exports.defaultConverter = defaultConverter;

const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

exports.notEqual = notEqual;
const defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
const microtaskPromise = Promise.resolve(true);
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_HAS_CONNECTED = 1 << 5;
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */

class UpdatingElement extends HTMLElement {
  constructor() {
    super();
    this._updateState = 0;
    this._instanceProperties = undefined;
    this._updatePromise = microtaskPromise;
    this._hasConnectedResolver = undefined;
    /**
     * Map with keys for any properties that have changed since the last
     * update cycle with previous values.
     */

    this._changedProperties = new Map();
    /**
     * Map with keys of properties that should be reflected when updated.
     */

    this._reflectingProperties = undefined;
    this.initialize();
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   */


  static get observedAttributes() {
    // note: piggy backing on this to ensure we're finalized.
    this.finalize();
    const attributes = []; // Use forEach so this works even if for/of loops are compiled to for loops
    // expecting arrays

    this._classProperties.forEach((v, p) => {
      const attr = this._attributeNameForProperty(p, v);

      if (attr !== undefined) {
        this._attributeToPropertyMap.set(attr, p);

        attributes.push(attr);
      }
    });

    return attributes;
  }
  /**
   * Ensures the private `_classProperties` property metadata is created.
   * In addition to `finalize` this is also called in `createProperty` to
   * ensure the `@property` decorator can add property metadata.
   */

  /** @nocollapse */


  static _ensureClassProperties() {
    // ensure private storage for property declarations.
    if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
      this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

      const superProperties = Object.getPrototypeOf(this)._classProperties;

      if (superProperties !== undefined) {
        superProperties.forEach((v, k) => this._classProperties.set(k, v));
      }
    }
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist.
   * The property setter calls the property's `hasChanged` property option
   * or uses a strict identity check to determine whether or not to request
   * an update.
   * @nocollapse
   */


  static createProperty(name, options = defaultPropertyDeclaration) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `finalize`, we ensure storage exists for property
    // metadata.
    this._ensureClassProperties();

    this._classProperties.set(name, options); // Do not generate an accessor if the prototype already has one, since
    // it would be lost otherwise and that would never be the user's intention;
    // Instead, we expect users to call `requestUpdate` themselves from
    // user-defined accessors. Note that if the super has an accessor we will
    // still overwrite it


    if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
      return;
    }

    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    Object.defineProperty(this.prototype, name, {
      // tslint:disable-next-line:no-any no symbol in index
      get() {
        // tslint:disable-next-line:no-any no symbol in index
        return this[key];
      },

      set(value) {
        // tslint:disable-next-line:no-any no symbol in index
        const oldValue = this[name]; // tslint:disable-next-line:no-any no symbol in index

        this[key] = value;
        this.requestUpdate(name, oldValue);
      },

      configurable: true,
      enumerable: true
    });
  }
  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   * @nocollapse
   */


  static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this)) && this.finalized) {
      return;
    } // finalize any superclasses


    const superCtor = Object.getPrototypeOf(this);

    if (typeof superCtor.finalize === 'function') {
      superCtor.finalize();
    }

    this.finalized = true;

    this._ensureClassProperties(); // initialize Map populated in observedAttributes


    this._attributeToPropertyMap = new Map(); // make any properties
    // Note, only process "own" properties since this element will inherit
    // any properties defined on the superClass, and finalization ensures
    // the entire prototype chain is finalized.

    if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
      const props = this.properties; // support symbols in properties (IE11 does not support this)

      const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])]; // This for/of is ok because propKeys is an array

      for (const p of propKeys) {
        // note, use of `any` is due to TypeSript lack of support for symbol in
        // index types
        // tslint:disable-next-line:no-any no symbol in index
        this.createProperty(p, props[p]);
      }
    }
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */


  static _attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
  }
  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   * @nocollapse
   */


  static _valueHasChanged(value, old, hasChanged = notEqual) {
    return hasChanged(value, old);
  }
  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's
   * `converter` or `converter.fromAttribute` property option.
   * @nocollapse
   */


  static _propertyValueFromAttribute(value, options) {
    const type = options.type;
    const converter = options.converter || defaultConverter;
    const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
    return fromAttribute ? fromAttribute(value, type) : value;
  }
  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   * @nocollapse
   */


  static _propertyValueToAttribute(value, options) {
    if (options.reflect === undefined) {
      return;
    }

    const type = options.type;
    const converter = options.converter;
    const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
    return toAttribute(value, type);
  }
  /**
   * Performs element initialization. By default captures any pre-set values for
   * registered properties.
   */


  initialize() {
    this._saveInstanceProperties();
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */


  _saveInstanceProperties() {
    // Use forEach so this works even if for/of loops are compiled to for loops
    // expecting arrays
    this.constructor._classProperties.forEach((_v, p) => {
      if (this.hasOwnProperty(p)) {
        const value = this[p];
        delete this[p];

        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }

        this._instanceProperties.set(p, value);
      }
    });
  }
  /**
   * Applies previously saved instance properties.
   */


  _applyInstanceProperties() {
    // Use forEach so this works even if for/of loops are compiled to for loops
    // expecting arrays
    // tslint:disable-next-line:no-any
    this._instanceProperties.forEach((v, p) => this[p] = v);

    this._instanceProperties = undefined;
  }

  connectedCallback() {
    this._updateState = this._updateState | STATE_HAS_CONNECTED; // Ensure connection triggers an update. Updates cannot complete before
    // connection and if one is pending connection the `_hasConnectionResolver`
    // will exist. If so, resolve it to complete the update, otherwise
    // requestUpdate.

    if (this._hasConnectedResolver) {
      this._hasConnectedResolver();

      this._hasConnectedResolver = undefined;
    } else {
      this.requestUpdate();
    }
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */


  disconnectedCallback() {}
  /**
   * Synchronizes property values when attributes change.
   */


  attributeChangedCallback(name, old, value) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }

  _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    const ctor = this.constructor;

    const attr = ctor._attributeNameForProperty(name, options);

    if (attr !== undefined) {
      const attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


      if (attrValue === undefined) {
        return;
      } // Track if the property is being reflected to avoid
      // setting the property again via `attributeChangedCallback`. Note:
      // 1. this takes advantage of the fact that the callback is synchronous.
      // 2. will behave incorrectly if multiple attributes are in the reaction
      // stack at time of calling. However, since we process attributes
      // in `update` this should not be possible (or an extreme corner case
      // that we'd like to discover).
      // mark state reflecting


      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      } // mark state not reflecting


      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
    }
  }

  _attributeToProperty(name, value) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
      return;
    }

    const ctor = this.constructor;

    const propName = ctor._attributeToPropertyMap.get(name);

    if (propName !== undefined) {
      const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration; // mark state reflecting

      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
      this[propName] = // tslint:disable-next-line:no-any
      ctor._propertyValueFromAttribute(value, options); // mark state not reflecting

      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should
   * be called when an element should update based on some state not triggered
   * by setting a property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored. Returns the `updateComplete` Promise which is resolved
   * when the update completes.
   *
   * @param name {PropertyKey} (optional) name of requesting property
   * @param oldValue {any} (optional) old value of requesting property
   * @returns {Promise} A Promise that is resolved when the update completes.
   */


  requestUpdate(name, oldValue) {
    let shouldRequestUpdate = true; // if we have a property key, perform property update steps.

    if (name !== undefined && !this._changedProperties.has(name)) {
      const ctor = this.constructor;
      const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;

      if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
        // track old value when changing.
        this._changedProperties.set(name, oldValue); // add to reflecting properties set


        if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }

          this._reflectingProperties.set(name, options);
        } // abort the request if the property should not be considered changed.

      } else {
        shouldRequestUpdate = false;
      }
    }

    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._enqueueUpdate();
    }

    return this.updateComplete;
  }
  /**
   * Sets up the element to asynchronously update.
   */


  async _enqueueUpdate() {
    // Mark state updating...
    this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
    let resolve;
    const previousUpdatePromise = this._updatePromise;
    this._updatePromise = new Promise(res => resolve = res); // Ensure any previous update has resolved before updating.
    // This `await` also ensures that property changes are batched.

    await previousUpdatePromise; // Make sure the element has connected before updating.

    if (!this._hasConnected) {
      await new Promise(res => this._hasConnectedResolver = res);
    } // Allow `performUpdate` to be asynchronous to enable scheduling of updates.


    const result = this.performUpdate(); // Note, this is to avoid delaying an additional microtask unless we need
    // to.

    if (result != null && typeof result.then === 'function') {
      await result;
    }

    resolve(!this._hasRequestedUpdate);
  }

  get _hasConnected() {
    return this._updateState & STATE_HAS_CONNECTED;
  }

  get _hasRequestedUpdate() {
    return this._updateState & STATE_UPDATE_REQUESTED;
  }

  get hasUpdated() {
    return this._updateState & STATE_HAS_UPDATED;
  }
  /**
   * Performs an element update.
   *
   * You can override this method to change the timing of updates. For instance,
   * to schedule updates to occur just before the next frame:
   *
   * ```
   * protected async performUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.performUpdate();
   * }
   * ```
   */


  performUpdate() {
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }

    if (this.shouldUpdate(this._changedProperties)) {
      const changedProperties = this._changedProperties;
      this.update(changedProperties);

      this._markUpdated();

      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }

      this.updated(changedProperties);
    } else {
      this._markUpdated();
    }
  }

  _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. This getter can be implemented to
   * await additional state. For example, it is sometimes useful to await a
   * rendered element before fulfilling this Promise. To do this, first await
   * `super.updateComplete` then any subsequent state.
   *
   * @returns {Promise} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */


  get updateComplete() {
    return this._updatePromise;
  }
  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  update(_changedProperties) {
    if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
      // Use forEach so this works even if for/of loops are compiled to for
      // loops expecting arrays
      this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));

      this._reflectingProperties = undefined;
    }
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  updated(_changedProperties) {}
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  firstUpdated(_changedProperties) {}

}
/**
 * Marks class as having finished creating properties.
 */


exports.UpdatingElement = UpdatingElement;
UpdatingElement.finalized = true;
},{}],"../node_modules/lit-element/lib/decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.property = property;
exports.eventOptions = exports.queryAll = exports.query = exports.customElement = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
  window.customElements.define(tagName, clazz); // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.
  // tslint:disable-next-line:no-any

  return clazz;
};

const standardCustomElement = (tagName, descriptor) => {
  const {
    kind,
    elements
  } = descriptor;
  return {
    kind,
    elements,

    // This callback is called once the class is otherwise fully defined
    finisher(clazz) {
      window.customElements.define(tagName, clazz);
    }

  };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * @param tagName the name of the custom element to define
 */


const customElement = tagName => classOrDescriptor => typeof classOrDescriptor === 'function' ? legacyCustomElement(tagName, classOrDescriptor) : standardCustomElement(tagName, classOrDescriptor);

exports.customElement = customElement;

const standardProperty = (options, element) => {
  // When decorating an accessor, pass it through and add property metadata.
  // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
  // stomp over the user's accessor.
  if (element.kind === 'method' && element.descriptor && !('value' in element.descriptor)) {
    return Object.assign({}, element, {
      finisher(clazz) {
        clazz.createProperty(element.key, options);
      }

    });
  } else {
    // createProperty() takes care of defining the property, but we still
    // must return some kind of descriptor, so return a descriptor for an
    // unused prototype field. The finisher calls createProperty().
    return {
      kind: 'field',
      key: Symbol(),
      placement: 'own',
      descriptor: {},

      // When @babel/plugin-proposal-decorators implements initializers,
      // do this instead of the initializer below. See:
      // https://github.com/babel/babel/issues/9260 extras: [
      //   {
      //     kind: 'initializer',
      //     placement: 'own',
      //     initializer: descriptor.initializer,
      //   }
      // ],
      // tslint:disable-next-line:no-any decorator
      initializer() {
        if (typeof element.initializer === 'function') {
          this[element.key] = element.initializer.call(this);
        }
      },

      finisher(clazz) {
        clazz.createProperty(element.key, options);
      }

    };
  }
};

const legacyProperty = (options, proto, name) => {
  proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 *
 * @ExportDecoratedItems
 */


function property(options) {
  // tslint:disable-next-line:no-any decorator
  return (protoOrDescriptor, name) => name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 */


const query = _query((target, selector) => target.querySelector(selector));
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 */


exports.query = query;

const queryAll = _query((target, selector) => target.querySelectorAll(selector));

exports.queryAll = queryAll;

const legacyQuery = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};

const standardQuery = (descriptor, element) => ({
  kind: 'method',
  placement: 'prototype',
  key: element.key,
  descriptor
});
/**
 * Base-implementation of `@query` and `@queryAll` decorators.
 *
 * @param queryFn exectute a `selector` (ie, querySelector or querySelectorAll)
 * against `target`.
 * @suppress {visibility} The descriptor accesses an internal field on the
 * element.
 */


function _query(queryFn) {
  return selector => (protoOrDescriptor, // tslint:disable-next-line:no-any decorator
  name) => {
    const descriptor = {
      get() {
        return queryFn(this.renderRoot, selector);
      },

      enumerable: true,
      configurable: true
    };
    return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
  };
}

const standardEventOptions = (options, element) => {
  return Object.assign({}, element, {
    finisher(clazz) {
      Object.assign(clazz.prototype[element.key], options);
    }

  });
};

const legacyEventOptions = // tslint:disable-next-line:no-any legacy decorator
(options, proto, name) => {
  Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifis event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 *
 *     class MyElement {
 *
 *       clicked = false;
 *
 *       render() {
 *         return html`<div @click=${this._onClick}`><button></button></div>`;
 *       }
 *
 *       @eventOptions({capture: true})
 *       _onClick(e) {
 *         this.clicked = true;
 *       }
 *     }
 */


const eventOptions = options => // Return value typed as any to prevent TypeScript from complaining that
// standard decorator function signature does not match TypeScript decorator
// signature
// TODO(kschaaf): unclear why it was only failing on this decorator and not
// the others
(protoOrDescriptor, name) => name !== undefined ? legacyEventOptions(options, protoOrDescriptor, name) : standardEventOptions(options, protoOrDescriptor);

exports.eventOptions = eventOptions;
},{}],"../node_modules/lit-element/lib/css-tag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = exports.unsafeCSS = exports.CSSResult = exports.supportsAdoptingStyleSheets = void 0;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
exports.supportsAdoptingStyleSheets = supportsAdoptingStyleSheets;
const constructionToken = Symbol();

class CSSResult {
  constructor(cssText, safeToken) {
    if (safeToken !== constructionToken) {
      throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    }

    this.cssText = cssText;
  } // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.


  get styleSheet() {
    if (this._styleSheet === undefined) {
      // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
      // is constructable.
      if (supportsAdoptingStyleSheets) {
        this._styleSheet = new CSSStyleSheet();

        this._styleSheet.replaceSync(this.cssText);
      } else {
        this._styleSheet = null;
      }
    }

    return this._styleSheet;
  }

  toString() {
    return this.cssText;
  }

}
/**
 * Wrap a value for interpolation in a css tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */


exports.CSSResult = CSSResult;

const unsafeCSS = value => {
  return new CSSResult(String(value), constructionToken);
};

exports.unsafeCSS = unsafeCSS;

const textFromCSSResult = value => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
  }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */


const css = (strings, ...values) => {
  const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, constructionToken);
};

exports.css = css;
},{}],"../node_modules/lit-element/lit-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LitElement: true,
  html: true,
  svg: true,
  TemplateResult: true,
  SVGTemplateResult: true
};
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml2.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml2.svg;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.TemplateResult;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.SVGTemplateResult;
  }
});
exports.LitElement = void 0;

var _litHtml = require("lit-html");

var _shadyRender = require("lit-html/lib/shady-render");

var _updatingElement = require("./lib/updating-element.js");

Object.keys(_updatingElement).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _updatingElement[key];
    }
  });
});

var _decorators = require("./lib/decorators.js");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _litHtml2 = require("lit-html/lit-html");

var _cssTag = require("./lib/css-tag.js");

Object.keys(_cssTag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cssTag[key];
    }
  });
});

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.0.1');
/**
 * Minimal implementation of Array.prototype.flat
 * @param arr the array to flatten
 * @param result the accumlated result
 */

function arrayFlat(styles, result = []) {
  for (let i = 0, length = styles.length; i < length; i++) {
    const value = styles[i];

    if (Array.isArray(value)) {
      arrayFlat(value, result);
    } else {
      result.push(value);
    }
  }

  return result;
}
/** Deeply flattens styles array. Uses native flat if available. */


const flattenStyles = styles => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);

class LitElement extends _updatingElement.UpdatingElement {
  /** @nocollapse */
  static finalize() {
    super.finalize(); // Prepare styling that is stamped at first render time. Styling
    // is built from user provided `styles` or is inherited from the superclass.

    this._styles = this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ? this._getUniqueStyles() : this._styles || [];
  }
  /** @nocollapse */


  static _getUniqueStyles() {
    // Take care not to call `this.styles` multiple times since this generates
    // new CSSResults each time.
    // TODO(sorvell): Since we do not cache CSSResults by input, any
    // shared styles will generate new stylesheet objects, which is wasteful.
    // This should be addressed when a browser ships constructable
    // stylesheets.
    const userStyles = this.styles;
    const styles = [];

    if (Array.isArray(userStyles)) {
      const flatStyles = flattenStyles(userStyles); // As a performance optimization to avoid duplicated styling that can
      // occur especially when composing via subclassing, de-duplicate styles
      // preserving the last item in the list. The last item is kept to
      // try to preserve cascade order with the assumption that it's most
      // important that last added styles override previous styles.

      const styleSet = flatStyles.reduceRight((set, s) => {
        set.add(s); // on IE set.add does not return the set.

        return set;
      }, new Set()); // Array.from does not work on Set in IE

      styleSet.forEach(v => styles.unshift(v));
    } else if (userStyles) {
      styles.push(userStyles);
    }

    return styles;
  }
  /**
   * Performs element initialization. By default this calls `createRenderRoot`
   * to create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */


  initialize() {
    super.initialize();
    this.renderRoot = this.createRenderRoot(); // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
    // element's getRootNode(). While this could be done, we're choosing not to
    // support this now since it would require different logic around de-duping.

    if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
      this.adoptStyles();
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */


  createRenderRoot() {
    return this.attachShadow({
      mode: 'open'
    });
  }
  /**
   * Applies styling to the element shadowRoot using the `static get styles`
   * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
   * available and will fallback otherwise. When Shadow DOM is polyfilled,
   * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
   * is available but `adoptedStyleSheets` is not, styles are appended to the
   * end of the `shadowRoot` to [mimic spec
   * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
   */


  adoptStyles() {
    const styles = this.constructor._styles;

    if (styles.length === 0) {
      return;
    } // There are three separate cases here based on Shadow DOM support.
    // (1) shadowRoot polyfilled: use ShadyCSS
    // (2) shadowRoot.adoptedStyleSheets available: use it.
    // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
    // rendering


    if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
      window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
    } else if (_cssTag.supportsAdoptingStyleSheets) {
      this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
    } else {
      // This must be done after rendering so the actual style insertion is done
      // in `update`.
      this._needsShimAdoptedStyleSheets = true;
    }
  }

  connectedCallback() {
    super.connectedCallback(); // Note, first update/render handles styleElement so we only call this if
    // connected after first update.

    if (this.hasUpdated && window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this);
    }
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * * @param _changedProperties Map of changed properties with old values
   */


  update(changedProperties) {
    super.update(changedProperties);
    const templateResult = this.render();

    if (templateResult instanceof _litHtml.TemplateResult) {
      this.constructor.render(templateResult, this.renderRoot, {
        scopeName: this.localName,
        eventContext: this
      });
    } // When native Shadow DOM is used but adoptedStyles are not supported,
    // insert styling after rendering to ensure adoptedStyles have highest
    // priority.


    if (this._needsShimAdoptedStyleSheets) {
      this._needsShimAdoptedStyleSheets = false;

      this.constructor._styles.forEach(s => {
        const style = document.createElement('style');
        style.textContent = s.cssText;
        this.renderRoot.appendChild(style);
      });
    }
  }
  /**
   * Invoked on each update to perform rendering tasks. This method must return
   * a lit-html TemplateResult. Setting properties inside this method will *not*
   * trigger the element to update.
   */


  render() {}

}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 */


exports.LitElement = LitElement;
LitElement.finalized = true;
/**
 * Render method used to render the lit-html TemplateResult to the element's
 * DOM.
 * @param {TemplateResult} Template to render.
 * @param {Element|DocumentFragment} Node into which to render.
 * @param {String} Element name.
 * @nocollapse
 */

LitElement.render = _shadyRender.render;
},{"lit-html":"../node_modules/lit-html/lit-html.js","lit-html/lib/shady-render":"../node_modules/lit-html/lib/shady-render.js","./lib/updating-element.js":"../node_modules/lit-element/lib/updating-element.js","./lib/decorators.js":"../node_modules/lit-element/lib/decorators.js","lit-html/lit-html":"../node_modules/lit-html/lit-html.js","./lib/css-tag.js":"../node_modules/lit-element/lib/css-tag.js"}],"util/notify.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventNameForProperty = eventNameForProperty;
exports.default = void 0;

var _litElement = require("lit-element");

/**
 * Returns the event name for the given property.
 */
function eventNameForProperty(name) {
  return `${name.toLowerCase()}-changed`;
}

class CustomElement extends _litElement.LitElement {
  createRenderRoot() {
    return this;
  }

  notifyPropChanged(name, value = null) {
    this.dispatchEvent(new CustomEvent(eventNameForProperty(name), {
      detail: {
        value: value != null ? value : this[name]
      },
      bubbles: true,
      composed: false
    }));
  }

}

var _default = CustomElement;
exports.default = _default;
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/ace-builds/src-noconflict/ace.js":[function(require,module,exports) {
var global = arguments[3];
var define;
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Define a module along with a payload
 * @param module a name for the payload
 * @param payload a function to call with (require, exports, module) params
 */

(function() {

var ACE_NAMESPACE = "ace";

var global = (function() { return this; })();
if (!global && typeof window != "undefined") global = window; // strict mode


if (!ACE_NAMESPACE && typeof requirejs !== "undefined")
    return;


var define = function(module, deps, payload) {
    if (typeof module !== "string") {
        if (define.original)
            define.original.apply(this, arguments);
        else {
            console.error("dropping module because define wasn\'t a string.");
            console.trace();
        }
        return;
    }
    if (arguments.length == 2)
        payload = deps;
    if (!define.modules[module]) {
        define.payloads[module] = payload;
        define.modules[module] = null;
    }
};

define.modules = {};
define.payloads = {};

/**
 * Get at functionality define()ed using the function above
 */
var _require = function(parentId, module, callback) {
    if (typeof module === "string") {
        var payload = lookup(parentId, module);
        if (payload != undefined) {
            callback && callback();
            return payload;
        }
    } else if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(parentId, module[i]);
            if (dep == undefined && require.original)
                return;
            params.push(dep);
        }
        return callback && callback.apply(null, params) || true;
    }
};

var require = function(module, callback) {
    var packagedModule = _require("", module, callback);
    if (packagedModule == undefined && require.original)
        return require.original.apply(this, arguments);
    return packagedModule;
};

var normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = base + "/" + moduleName;

        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }
    return moduleName;
};

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(parentId, moduleName) {
    moduleName = normalizeModule(parentId, moduleName);

    var module = define.modules[moduleName];
    if (!module) {
        module = define.payloads[moduleName];
        if (typeof module === 'function') {
            var exports = {};
            var mod = {
                id: moduleName,
                uri: '',
                exports: exports,
                packaged: true
            };

            var req = function(module, callback) {
                return _require(moduleName, module, callback);
            };

            var returnValue = module(req, exports, mod);
            exports = returnValue || mod.exports;
            define.modules[moduleName] = exports;
            delete define.payloads[moduleName];
        }
        module = define.modules[moduleName] = exports || module;
    }
    return module;
};

function exportAce(ns) {
    var root = global;
    if (ns) {
        if (!global[ns])
            global[ns] = {};
        root = global[ns];
    }

    if (!root.define || !root.define.packaged) {
        define.original = root.define;
        root.define = define;
        root.define.packaged = true;
    }

    if (!root.require || !root.require.packaged) {
        require.original = root.require;
        root.require = require;
        root.require.packaged = true;
    }
}

exportAce(ACE_NAMESPACE);

})();

ace.define("ace/lib/regexp",["require","exports","module"], function(require, exports, module) {
"use strict";

    var real = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        compliantExecNpcg = real.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
        compliantLastIndexIncrement = function () {
            var x = /^/g;
            real.test.call(x, "");
            return !x.lastIndex;
        }();

    if (compliantLastIndexIncrement && compliantExecNpcg)
        return;
    RegExp.prototype.exec = function (str) {
        var match = real.exec.apply(this, arguments),
            name, r2;
        if ( typeof(str) == 'string' && match) {
            if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                r2 = RegExp(this.source, real.replace.call(getNativeFlags(this), "g", ""));
                real.replace.call(str.slice(match.index), r2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined)
                            match[i] = undefined;
                    }
                });
            }
            if (this._xregexp && this._xregexp.captureNames) {
                for (var i = 1; i < match.length; i++) {
                    name = this._xregexp.captureNames[i - 1];
                    if (name)
                       match[name] = match[i];
                }
            }
            if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
        }
        return match;
    };
    if (!compliantLastIndexIncrement) {
        RegExp.prototype.test = function (str) {
            var match = real.exec.call(this, str);
            if (match && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
            return !!match;
        };
    }

    function getNativeFlags (regex) {
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
               (regex.sticky     ? "y" : "");
    }

    function indexOf (array, item, from) {
        if (Array.prototype.indexOf) // Use the native array method if available
            return array.indexOf(item, from);
        for (var i = from || 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }

});

ace.define("ace/lib/es5-shim",["require","exports","module"], function(require, exports, module) {

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        var target = this;
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = slice.call(arguments, 1); // for normal call
        var bound = function () {

            if (this instanceof bound) {

                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }
        return bound;
    };
}
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}
if ([1,2].splice(0).length != 2) {
    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = new Array(l+2);
            a[0] = a[1] = 0;
            return a;
        }
        var array = [], lengthBefore;
        
        array.splice.apply(array, makeArray(20));
        array.splice.apply(array, makeArray(26));

        lengthBefore = array.length; //46
        array.splice(5, 0, "XXX"); // add one element

        lengthBefore + 1 == array.length

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
    }()) {//IE 6/7
        var array_splice = Array.prototype.splice;
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(slice.call(arguments, 2)))
            }
        };
    } else {//IE8
        Array.prototype.splice = function(pos, removeCount){
            var length = this.length;
            if (pos > 0) {
                if (pos > length)
                    pos = length;
            } else if (pos == void 0) {
                pos = 0;
            } else if (pos < 0) {
                pos = Math.max(length + pos, 0);
            }

            if (!(pos+removeCount < length))
                removeCount = length - pos;

            var removed = this.slice(pos, pos+removeCount);
            var insert = slice.call(arguments, 2);
            var add = insert.length;            
            if (pos === length) {
                if (add) {
                    this.push.apply(this, insert);
                }
            } else {
                var remove = Math.min(removeCount, length - pos);
                var tailOldPos = pos + remove;
                var tailNewPos = tailOldPos + add - remove;
                var tailCount = length - tailOldPos;
                var lengthAfterRemove = length - remove;

                if (tailNewPos < tailOldPos) { // case A
                    for (var i = 0; i < tailCount; ++i) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } else if (tailNewPos > tailOldPos) { // case B
                    for (i = tailCount; i--; ) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } // else, add == remove (nothing to do)

                if (add && pos === lengthAfterRemove) {
                    this.length = lengthAfterRemove; // truncate array
                    this.push.apply(this, insert);
                } else {
                    this.length = lengthAfterRemove + add; // reserves space
                    for (i = 0; i < add; ++i) {
                        this[pos+i] = insert[i];
                    }
                }
            }
            return removed;
        };
    }
}
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}
if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;
        descriptor =  { enumerable: true, configurable: true };
        if (supportsAccessors) {
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;
                return descriptor;
            }
        }
        descriptor.value = object[property];
        return descriptor;
    };
}
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}
if (!Object.create) {
    var createEmpty;
    if (Object.prototype.__proto__ === null) {
        createEmpty = function () {
            return { "__proto__": null };
        };
    } else {
        createEmpty = function () {
            var empty = {};
            for (var i in empty)
                empty[i] = null;
            empty.constructor =
            empty.hasOwnProperty =
            empty.propertyIsEnumerable =
            empty.isPrototypeOf =
            empty.toLocaleString =
            empty.toString =
            empty.valueOf =
            empty.__proto__ = null;
            return empty;
        }
    }

    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
    }
}
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
            }
        }
        if (owns(descriptor, "value")) {

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                delete object[property];
                object[property] = descriptor.value;
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}
if (!Object.seal) {
    Object.seal = function seal(object) {
        return object;
    };
}
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        return object;
    };
}
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        return object;
    };
}
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}
if (!Object.keys) {
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});

ace.define("ace/lib/fixoldbrowsers",["require","exports","module","ace/lib/regexp","ace/lib/es5-shim"], function(require, exports, module) {
"use strict";

require("./regexp");
require("./es5-shim");
if (typeof Element != "undefined" && !Element.prototype.remove) {
    Object.defineProperty(Element.prototype, "remove", {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function() { this.parentNode && this.parentNode.removeChild(this); }
    });
}


});

ace.define("ace/lib/useragent",["require","exports","module"], function(require, exports, module) {
"use strict";
exports.OS = {
    LINUX: "LINUX",
    MAC: "MAC",
    WINDOWS: "WINDOWS"
};
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS.MAC;
    } else if (exports.isLinux) {
        return exports.OS.LINUX;
    } else {
        return exports.OS.WINDOWS;
    }
};
if (typeof navigator != "object")
    return;

var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
var ua = navigator.userAgent;
exports.isWin = (os == "win");
exports.isMac = (os == "mac");
exports.isLinux = (os == "linux");
exports.isIE = 
    (navigator.appName == "Microsoft Internet Explorer" || navigator.appName.indexOf("MSAppHost") >= 0)
    ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1])
    : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]); // for ie
    
exports.isOldIE = exports.isIE && exports.isIE < 9;
exports.isGecko = exports.isMozilla = ua.match(/ Gecko\/\d+/);
exports.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;

exports.isEdge = parseFloat(ua.split(" Edge/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isIPad = ua.indexOf("iPad") >= 0;

exports.isAndroid = ua.indexOf("Android") >= 0;

exports.isChromeOS = ua.indexOf(" CrOS ") >= 0;

exports.isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

if (exports.isIOS) exports.isMac = true;

exports.isMobile = exports.isIPad || exports.isAndroid;

});

ace.define("ace/lib/dom",["require","exports","module","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var useragent = require("./useragent"); 
var XHTML_NS = "http://www.w3.org/1999/xhtml";

exports.buildDom = function buildDom(arr, parent, refs) {
    if (typeof arr == "string" && arr) {
        var txt = document.createTextNode(arr);
        if (parent)
            parent.appendChild(txt);
        return txt;
    }
    
    if (!Array.isArray(arr))
        return arr;
    if (typeof arr[0] != "string" || !arr[0]) {
        var els = [];
        for (var i = 0; i < arr.length; i++) {
            var ch = buildDom(arr[i], parent, refs);
            ch && els.push(ch);
        }
        return els;
    }
    
    var el = document.createElement(arr[0]);
    var options = arr[1];
    var childIndex = 1;
    if (options && typeof options == "object" && !Array.isArray(options))
        childIndex = 2;
    for (var i = childIndex; i < arr.length; i++)
        buildDom(arr[i], el, refs);
    if (childIndex == 2) {
        Object.keys(options).forEach(function(n) {
            var val = options[n];
            if (n === "class") {
                el.className = Array.isArray(val) ? val.join(" ") : val;
            } else if (typeof val == "function" || n == "value") {
                el[n] = val;
            } else if (n === "ref") {
                if (refs) refs[val] = el;
            } else if (val != null) {
                el.setAttribute(n, val);
            }
        });
    }
    if (parent)
        parent.appendChild(el);
    return el;
};

exports.getDocumentHead = function(doc) {
    if (!doc)
        doc = document;
    return doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
};

exports.createElement = function(tag, ns) {
    return document.createElementNS ?
           document.createElementNS(ns || XHTML_NS, tag) :
           document.createElement(tag);
};

exports.removeChildren = function(element) {
    element.innerHTML = "";
};

exports.createTextNode = function(textContent, element) {
    var doc = element ? element.ownerDocument : document;
    return doc.createTextNode(textContent);
};

exports.createFragment = function(element) {
    var doc = element ? element.ownerDocument : document;
    return doc.createDocumentFragment();
};

exports.hasCssClass = function(el, name) {
    var classes = (el.className + "").split(/\s+/g);
    return classes.indexOf(name) !== -1;
};
exports.addCssClass = function(el, name) {
    if (!exports.hasCssClass(el, name)) {
        el.className += " " + name;
    }
};
exports.removeCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g);
    while (true) {
        var index = classes.indexOf(name);
        if (index == -1) {
            break;
        }
        classes.splice(index, 1);
    }
    el.className = classes.join(" ");
};

exports.toggleCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g), add = true;
    while (true) {
        var index = classes.indexOf(name);
        if (index == -1) {
            break;
        }
        add = false;
        classes.splice(index, 1);
    }
    if (add)
        classes.push(name);

    el.className = classes.join(" ");
    return add;
};
exports.setCssClass = function(node, className, include) {
    if (include) {
        exports.addCssClass(node, className);
    } else {
        exports.removeCssClass(node, className);
    }
};

exports.hasCssString = function(id, doc) {
    var index = 0, sheets;
    doc = doc || document;
    if ((sheets = doc.querySelectorAll("style"))) {
        while (index < sheets.length)
            if (sheets[index++].id === id)
                return true;
    }
};

exports.importCssString = function importCssString(cssText, id, target) {
    var container = target;
    if (!target || !target.getRootNode) {
        container = document;
    } else {
        container = target.getRootNode();
        if (!container || container == target)
            container = document;
    }
    
    var doc = container.ownerDocument || container;
    if (id && exports.hasCssString(id, container))
        return null;
    
    if (id)
        cssText += "\n/*# sourceURL=ace/css/" + id + " */";
    
    var style = exports.createElement("style");
    style.appendChild(doc.createTextNode(cssText));
    if (id)
        style.id = id;

    if (container == doc)
        container = exports.getDocumentHead(doc);
    container.insertBefore(style, container.firstChild);
};

exports.importCssStylsheet = function(uri, doc) {
    exports.buildDom(["link", {rel: "stylesheet", href: uri}], exports.getDocumentHead(doc));
};
exports.scrollbarWidth = function(document) {
    var inner = exports.createElement("ace_inner");
    inner.style.width = "100%";
    inner.style.minWidth = "0px";
    inner.style.height = "200px";
    inner.style.display = "block";

    var outer = exports.createElement("ace_outer");
    var style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.minWidth = "0px";
    style.height = "150px";
    style.display = "block";

    outer.appendChild(inner);

    var body = document.documentElement;
    body.appendChild(outer);

    var noScrollbar = inner.offsetWidth;

    style.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;

    if (noScrollbar == withScrollbar) {
        withScrollbar = outer.clientWidth;
    }

    body.removeChild(outer);

    return noScrollbar-withScrollbar;
};

if (typeof document == "undefined") {
    exports.importCssString = function() {};
}

exports.computedStyle = function(element, style) {
    return window.getComputedStyle(element, "") || {};
};

exports.setStyle = function(styles, property, value) {
    if (styles[property] !== value) {
        styles[property] = value;
    }
};

exports.HAS_CSS_ANIMATION = false;
exports.HAS_CSS_TRANSFORMS = false;
exports.HI_DPI = useragent.isWin
    ? typeof window !== "undefined" && window.devicePixelRatio >= 1.5
    : true;

if (typeof document !== "undefined") {
    var div = document.createElement("div");
    if (exports.HI_DPI && div.style.transform  !== undefined)
        exports.HAS_CSS_TRANSFORMS = true;
    if (!useragent.isEdge && typeof div.style.animationName !== "undefined")
        exports.HAS_CSS_ANIMATION = true;
    div = null;
}

if (exports.HAS_CSS_TRANSFORMS) {
    exports.translate = function(element, tx, ty) {
        element.style.transform = "translate(" + Math.round(tx) + "px, " + Math.round(ty) +"px)";
    };
} else {
    exports.translate = function(element, tx, ty) {
        element.style.top = Math.round(ty) + "px";
        element.style.left = Math.round(tx) + "px";
    };
}

});

ace.define("ace/lib/oop",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

exports.mixin = function(obj, mixin) {
    for (var key in mixin) {
        obj[key] = mixin[key];
    }
    return obj;
};

exports.implement = function(proto, mixin) {
    exports.mixin(proto, mixin);
};

});

ace.define("ace/lib/keys",["require","exports","module","ace/lib/oop"], function(require, exports, module) {
"use strict";

var oop = require("./oop");
var Keys = (function() {
    var ret = {
        MODIFIER_KEYS: {
            16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta'
        },

        KEY_MODS: {
            "ctrl": 1, "alt": 2, "option" : 2, "shift": 4,
            "super": 8, "meta": 8, "command": 8, "cmd": 8
        },

        FUNCTION_KEYS : {
            8  : "Backspace",
            9  : "Tab",
            13 : "Return",
            19 : "Pause",
            27 : "Esc",
            32 : "Space",
            33 : "PageUp",
            34 : "PageDown",
            35 : "End",
            36 : "Home",
            37 : "Left",
            38 : "Up",
            39 : "Right",
            40 : "Down",
            44 : "Print",
            45 : "Insert",
            46 : "Delete",
            96 : "Numpad0",
            97 : "Numpad1",
            98 : "Numpad2",
            99 : "Numpad3",
            100: "Numpad4",
            101: "Numpad5",
            102: "Numpad6",
            103: "Numpad7",
            104: "Numpad8",
            105: "Numpad9",
            '-13': "NumpadEnter",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Numlock",
            145: "Scrolllock"
        },

        PRINTABLE_KEYS: {
           32: ' ',  48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',
           54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=', 65:  'a',
           66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',
           73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o',
           80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86:  'v',
           87: 'w',  88: 'x',  89: 'y',  90: 'z', 107: '+', 109: '-', 110: '.',
          186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`',
          219: '[', 220: '\\',221: ']', 222: "'", 111: '/', 106: '*'
        }
    };
    var name, i;
    for (i in ret.FUNCTION_KEYS) {
        name = ret.FUNCTION_KEYS[i].toLowerCase();
        ret[name] = parseInt(i, 10);
    }
    for (i in ret.PRINTABLE_KEYS) {
        name = ret.PRINTABLE_KEYS[i].toLowerCase();
        ret[name] = parseInt(i, 10);
    }
    oop.mixin(ret, ret.MODIFIER_KEYS);
    oop.mixin(ret, ret.PRINTABLE_KEYS);
    oop.mixin(ret, ret.FUNCTION_KEYS);
    ret.enter = ret["return"];
    ret.escape = ret.esc;
    ret.del = ret["delete"];
    ret[173] = '-';
    
    (function() {
        var mods = ["cmd", "ctrl", "alt", "shift"];
        for (var i = Math.pow(2, mods.length); i--;) {            
            ret.KEY_MODS[i] = mods.filter(function(x) {
                return i & ret.KEY_MODS[x];
            }).join("-") + "-";
        }
    })();

    ret.KEY_MODS[0] = "";
    ret.KEY_MODS[-1] = "input-";

    return ret;
})();
oop.mixin(exports, Keys);

exports.keyCodeToString = function(keyCode) {
    var keyString = Keys[keyCode];
    if (typeof keyString != "string")
        keyString = String.fromCharCode(keyCode);
    return keyString.toLowerCase();
};

});

ace.define("ace/lib/event",["require","exports","module","ace/lib/keys","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var keys = require("./keys");
var useragent = require("./useragent");

var pressedKeys = null;
var ts = 0;

exports.addListener = function(elem, type, callback) {
    if (elem.addEventListener) {
        return elem.addEventListener(type, callback, false);
    }
    if (elem.attachEvent) {
        var wrapper = function() {
            callback.call(elem, window.event);
        };
        callback._wrapper = wrapper;
        elem.attachEvent("on" + type, wrapper);
    }
};

exports.removeListener = function(elem, type, callback) {
    if (elem.removeEventListener) {
        return elem.removeEventListener(type, callback, false);
    }
    if (elem.detachEvent) {
        elem.detachEvent("on" + type, callback._wrapper || callback);
    }
};
exports.stopEvent = function(e) {
    exports.stopPropagation(e);
    exports.preventDefault(e);
    return false;
};

exports.stopPropagation = function(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
};

exports.preventDefault = function(e) {
    if (e.preventDefault)
        e.preventDefault();
    else
        e.returnValue = false;
};
exports.getButton = function(e) {
    if (e.type == "dblclick")
        return 0;
    if (e.type == "contextmenu" || (useragent.isMac && (e.ctrlKey && !e.altKey && !e.shiftKey)))
        return 2;
    if (e.preventDefault) {
        return e.button;
    }
    else {
        return {1:0, 2:2, 4:1}[e.button];
    }
};

exports.capture = function(el, eventHandler, releaseCaptureHandler) {
    function onMouseUp(e) {
        eventHandler && eventHandler(e);
        releaseCaptureHandler && releaseCaptureHandler(e);

        exports.removeListener(document, "mousemove", eventHandler, true);
        exports.removeListener(document, "mouseup", onMouseUp, true);
        exports.removeListener(document, "dragstart", onMouseUp, true);
    }

    exports.addListener(document, "mousemove", eventHandler, true);
    exports.addListener(document, "mouseup", onMouseUp, true);
    exports.addListener(document, "dragstart", onMouseUp, true);
    
    return onMouseUp;
};

exports.addTouchMoveListener = function (el, callback) {
    var startx, starty;
    exports.addListener(el, "touchstart", function (e) {
        var touches = e.touches;
        var touchObj = touches[0];
        startx = touchObj.clientX;
        starty = touchObj.clientY;
    });
    exports.addListener(el, "touchmove", function (e) {
        var touches = e.touches;
        if (touches.length > 1) return;
        
        var touchObj = touches[0];

        e.wheelX = startx - touchObj.clientX;
        e.wheelY = starty - touchObj.clientY;

        startx = touchObj.clientX;
        starty = touchObj.clientY;

        callback(e);
    });
};

exports.addMouseWheelListener = function(el, callback) {
    if ("onmousewheel" in el) {
        exports.addListener(el, "mousewheel", function(e) {
            var factor = 8;
            if (e.wheelDeltaX !== undefined) {
                e.wheelX = -e.wheelDeltaX / factor;
                e.wheelY = -e.wheelDeltaY / factor;
            } else {
                e.wheelX = 0;
                e.wheelY = -e.wheelDelta / factor;
            }
            callback(e);
        });
    } else if ("onwheel" in el) {
        exports.addListener(el, "wheel",  function(e) {
            var factor = 0.35;
            switch (e.deltaMode) {
                case e.DOM_DELTA_PIXEL:
                    e.wheelX = e.deltaX * factor || 0;
                    e.wheelY = e.deltaY * factor || 0;
                    break;
                case e.DOM_DELTA_LINE:
                case e.DOM_DELTA_PAGE:
                    e.wheelX = (e.deltaX || 0) * 5;
                    e.wheelY = (e.deltaY || 0) * 5;
                    break;
            }
            
            callback(e);
        });
    } else {
        exports.addListener(el, "DOMMouseScroll", function(e) {
            if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                e.wheelX = (e.detail || 0) * 5;
                e.wheelY = 0;
            } else {
                e.wheelX = 0;
                e.wheelY = (e.detail || 0) * 5;
            }
            callback(e);
        });
    }
};

exports.addMultiMouseDownListener = function(elements, timeouts, eventHandler, callbackName) {
    var clicks = 0;
    var startX, startY, timer; 
    var eventNames = {
        2: "dblclick",
        3: "tripleclick",
        4: "quadclick"
    };

    function onMousedown(e) {
        if (exports.getButton(e) !== 0) {
            clicks = 0;
        } else if (e.detail > 1) {
            clicks++;
            if (clicks > 4)
                clicks = 1;
        } else {
            clicks = 1;
        }
        if (useragent.isIE) {
            var isNewClick = Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5;
            if (!timer || isNewClick)
                clicks = 1;
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function() {timer = null;}, timeouts[clicks - 1] || 600);

            if (clicks == 1) {
                startX = e.clientX;
                startY = e.clientY;
            }
        }
        
        e._clicks = clicks;

        eventHandler[callbackName]("mousedown", e);

        if (clicks > 4)
            clicks = 0;
        else if (clicks > 1)
            return eventHandler[callbackName](eventNames[clicks], e);
    }
    function onDblclick(e) {
        clicks = 2;
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(function() {timer = null;}, timeouts[clicks - 1] || 600);
        eventHandler[callbackName]("mousedown", e);
        eventHandler[callbackName](eventNames[clicks], e);
    }
    if (!Array.isArray(elements))
        elements = [elements];
    elements.forEach(function(el) {
        exports.addListener(el, "mousedown", onMousedown);
        if (useragent.isOldIE)
            exports.addListener(el, "dblclick", onDblclick);
    });
};

var getModifierHash = useragent.isMac && useragent.isOpera && !("KeyboardEvent" in window)
    ? function(e) {
        return 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
    }
    : function(e) {
        return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
    };

exports.getModifierString = function(e) {
    return keys.KEY_MODS[getModifierHash(e)];
};

function normalizeCommandKeys(callback, e, keyCode) {
    var hashId = getModifierHash(e);

    if (!useragent.isMac && pressedKeys) {
        if (e.getModifierState && (e.getModifierState("OS") || e.getModifierState("Win")))
            hashId |= 8;
        if (pressedKeys.altGr) {
            if ((3 & hashId) != 3)
                pressedKeys.altGr = 0;
            else
                return;
        }
        if (keyCode === 18 || keyCode === 17) {
            var location = "location" in e ? e.location : e.keyLocation;
            if (keyCode === 17 && location === 1) {
                if (pressedKeys[keyCode] == 1)
                    ts = e.timeStamp;
            } else if (keyCode === 18 && hashId === 3 && location === 2) {
                var dt = e.timeStamp - ts;
                if (dt < 50)
                    pressedKeys.altGr = true;
            }
        }
    }
    
    if (keyCode in keys.MODIFIER_KEYS) {
        keyCode = -1;
    }
    if (hashId & 8 && (keyCode >= 91 && keyCode <= 93)) {
        keyCode = -1;
    }
    
    if (!hashId && keyCode === 13) {
        var location = "location" in e ? e.location : e.keyLocation;
        if (location === 3) {
            callback(e, hashId, -keyCode);
            if (e.defaultPrevented)
                return;
        }
    }
    
    if (useragent.isChromeOS && hashId & 8) {
        callback(e, hashId, keyCode);
        if (e.defaultPrevented)
            return;
        else
            hashId &= ~8;
    }
    if (!hashId && !(keyCode in keys.FUNCTION_KEYS) && !(keyCode in keys.PRINTABLE_KEYS)) {
        return false;
    }
    
    return callback(e, hashId, keyCode);
}


exports.addCommandKeyListener = function(el, callback) {
    var addListener = exports.addListener;
    if (useragent.isOldGecko || (useragent.isOpera && !("KeyboardEvent" in window))) {
        var lastKeyDownKeyCode = null;
        addListener(el, "keydown", function(e) {
            lastKeyDownKeyCode = e.keyCode;
        });
        addListener(el, "keypress", function(e) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        });
    } else {
        var lastDefaultPrevented = null;

        addListener(el, "keydown", function(e) {
            pressedKeys[e.keyCode] = (pressedKeys[e.keyCode] || 0) + 1;
            var result = normalizeCommandKeys(callback, e, e.keyCode);
            lastDefaultPrevented = e.defaultPrevented;
            return result;
        });

        addListener(el, "keypress", function(e) {
            if (lastDefaultPrevented && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
                exports.stopEvent(e);
                lastDefaultPrevented = null;
            }
        });

        addListener(el, "keyup", function(e) {
            pressedKeys[e.keyCode] = null;
        });

        if (!pressedKeys) {
            resetPressedKeys();
            addListener(window, "focus", resetPressedKeys);
        }
    }
};
function resetPressedKeys() {
    pressedKeys = Object.create(null);
}

if (typeof window == "object" && window.postMessage && !useragent.isOldIE) {
    var postMessageId = 1;
    exports.nextTick = function(callback, win) {
        win = win || window;
        var messageName = "zero-timeout-message-" + (postMessageId++);
        
        var listener = function(e) {
            if (e.data == messageName) {
                exports.stopPropagation(e);
                exports.removeListener(win, "message", listener);
                callback();
            }
        };
        
        exports.addListener(win, "message", listener);
        win.postMessage(messageName, "*");
    };
}

exports.$idleBlocked = false;
exports.onIdle = function(cb, timeout) {
    return setTimeout(function handler() {
        if (!exports.$idleBlocked) {
            cb();
        } else {
            setTimeout(handler, 100);
        }
    }, timeout);
};

exports.$idleBlockId = null;
exports.blockIdle = function(delay) {
    if (exports.$idleBlockId)
        clearTimeout(exports.$idleBlockId);
        
    exports.$idleBlocked = true;
    exports.$idleBlockId = setTimeout(function() {
        exports.$idleBlocked = false;
    }, delay || 100);
};

exports.nextFrame = typeof window == "object" && (window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame);

if (exports.nextFrame)
    exports.nextFrame = exports.nextFrame.bind(window);
else
    exports.nextFrame = function(callback) {
        setTimeout(callback, 17);
    };
});

ace.define("ace/range",["require","exports","module"], function(require, exports, module) {
"use strict";
var comparePoints = function(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};
var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {
        row: startRow,
        column: startColumn
    };

    this.end = {
        row: endRow,
        column: endColumn
    };
};

(function() {
    this.isEqual = function(range) {
        return this.start.row === range.start.row &&
            this.end.row === range.end.row &&
            this.start.column === range.start.column &&
            this.end.column === range.end.column;
    };
    this.toString = function() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    };

    this.contains = function(row, column) {
        return this.compare(row, column) == 0;
    };
    this.compareRange = function(range) {
        var cmp,
            end = range.end,
            start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp == 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    };
    this.comparePoint = function(p) {
        return this.compare(p.row, p.column);
    };
    this.containsRange = function(range) {
        return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
    };
    this.intersects = function(range) {
        var cmp = this.compareRange(range);
        return (cmp == -1 || cmp == 0 || cmp == 1);
    };
    this.isEnd = function(row, column) {
        return this.end.row == row && this.end.column == column;
    };
    this.isStart = function(row, column) {
        return this.start.row == row && this.start.column == column;
    };
    this.setStart = function(row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    };
    this.setEnd = function(row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    };
    this.inside = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    this.insideStart = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    this.insideEnd = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    this.compare = function(row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            }
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };
    this.compareStart = function(row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    this.compareEnd = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    };
    this.compareInside = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    this.clipRows = function(firstRow, lastRow) {
        if (this.end.row > lastRow)
            var end = {row: lastRow + 1, column: 0};
        else if (this.end.row < firstRow)
            var end = {row: firstRow, column: 0};

        if (this.start.row > lastRow)
            var start = {row: lastRow + 1, column: 0};
        else if (this.start.row < firstRow)
            var start = {row: firstRow, column: 0};

        return Range.fromPoints(start || this.start, end || this.end);
    };
    this.extend = function(row, column) {
        var cmp = this.compare(row, column);

        if (cmp == 0)
            return this;
        else if (cmp == -1)
            var start = {row: row, column: column};
        else
            var end = {row: row, column: column};

        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.isEmpty = function() {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    };
    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };
    this.clone = function() {
        return Range.fromPoints(this.start, this.end);
    };
    this.collapseRows = function() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0);
        else
            return new Range(this.start.row, 0, this.end.row, 0);
    };
    this.toScreenRange = function(session) {
        var screenPosStart = session.documentToScreenPosition(this.start);
        var screenPosEnd = session.documentToScreenPosition(this.end);

        return new Range(
            screenPosStart.row, screenPosStart.column,
            screenPosEnd.row, screenPosEnd.column
        );
    };
    this.moveBy = function(row, column) {
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    };

}).call(Range.prototype);
Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};
Range.comparePoints = comparePoints;

Range.comparePoints = function(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};


exports.Range = Range;
});

ace.define("ace/lib/lang",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.last = function(a) {
    return a[a.length - 1];
};

exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
    var result = '';
    while (count > 0) {
        if (count & 1)
            result += string;

        if (count >>= 1)
            string += string;
    }
    return result;
};

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '');
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, '');
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.copyArray = function(array){
    var copy = [];
    for (var i=0, l=array.length; i<l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject(array[i]);
        else 
            copy[i] = array[i];
    }
    return copy;
};

exports.deepCopy = function deepCopy(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    var copy;
    if (Array.isArray(obj)) {
        copy = [];
        for (var key = 0; key < obj.length; key++) {
            copy[key] = deepCopy(obj[key]);
        }
        return copy;
    }
    if (Object.prototype.toString.call(obj) !== "[object Object]")
        return obj;
    
    copy = {};
    for (var key in obj)
        copy[key] = deepCopy(obj[key]);
    return copy;
};

exports.arrayToMap = function(arr) {
    var map = {};
    for (var i=0; i<arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;

};

exports.createMap = function(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
};
exports.arrayRemove = function(array, value) {
  for (var i = 0; i <= array.length; i++) {
    if (value === array[i]) {
      array.splice(i, 1);
    }
  }
};

exports.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

exports.escapeHTML = function(str) {
    return ("" + str).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
};

exports.getMatchOffsets = function(string, regExp) {
    var matches = [];

    string.replace(regExp, function(str) {
        matches.push({
            offset: arguments[arguments.length-2],
            length: str.length
        });
    });

    return matches;
};
exports.deferredCall = function(fcn) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var deferred = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };
    
    deferred.isPending = function() {
        return timer;
    };

    return deferred;
};


exports.delayedCall = function(fcn, defaultTimeout) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var _self = function(timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };

    _self.delay = function(timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
    };
    _self.schedule = _self;

    _self.call = function() {
        this.cancel();
        fcn();
    };

    _self.cancel = function() {
        timer && clearTimeout(timer);
        timer = null;
    };

    _self.isPending = function() {
        return timer;
    };

    return _self;
};
});

ace.define("ace/keyboard/textinput",["require","exports","module","ace/lib/event","ace/lib/useragent","ace/lib/dom","ace/lib/lang","ace/lib/keys"], function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var BROKEN_SETDATA = useragent.isChrome < 18;
var USE_IE_MIME_TYPE =  useragent.isIE;
var HAS_FOCUS_ARGS = useragent.isChrome > 63;
var MAX_LINE_LENGTH = 400;

var KEYS = require("../lib/keys");
var MODS = KEYS.KEY_MODS;
var isIOS = useragent.isIOS;
var valueResetRegex = isIOS ? /\s/ : /\n/;

var TextInput = function(parentNode, host) {
    var text = dom.createElement("textarea");
    text.className = "ace_text-input";

    text.setAttribute("wrap", "off");
    text.setAttribute("autocorrect", "off");
    text.setAttribute("autocapitalize", "off");
    text.setAttribute("spellcheck", false);

    text.style.opacity = "0";
    parentNode.insertBefore(text, parentNode.firstChild);

    var copied = false;
    var pasted = false;
    var inComposition = false;
    var sendingText = false;
    var tempStyle = '';
    var isSelectionEmpty = true;
    var copyWithEmptySelection = false;
    
    if (!useragent.isMobile)
        text.style.fontSize = "1px";

    var commandMode = false;
    var ignoreFocusEvents = false;
    
    var lastValue = "";
    var lastSelectionStart = 0;
    var lastSelectionEnd = 0;
    try { var isFocused = document.activeElement === text; } catch(e) {}
    
    event.addListener(text, "blur", function(e) {
        if (ignoreFocusEvents) return;
        host.onBlur(e);
        isFocused = false;
    });
    event.addListener(text, "focus", function(e) {
        if (ignoreFocusEvents) return;
        isFocused = true;
        if (useragent.isEdge) {
            try {
                if (!document.hasFocus())
                    return;
            } catch(e) {}
        }
        host.onFocus(e);
        if (useragent.isEdge)
            setTimeout(resetSelection);
        else
            resetSelection();
    });
    this.$focusScroll = false;
    this.focus = function() {
        if (tempStyle || HAS_FOCUS_ARGS || this.$focusScroll == "browser")
            return text.focus({ preventScroll: true });

        var top = text.style.top;
        text.style.position = "fixed";
        text.style.top = "0px";
        try {
            var isTransformed = text.getBoundingClientRect().top != 0;
        } catch(e) {
            return;
        }
        var ancestors = [];
        if (isTransformed) {
            var t = text.parentElement;
            while (t && t.nodeType == 1) {
                ancestors.push(t);
                t.setAttribute("ace_nocontext", true);
                if (!t.parentElement && t.getRootNode)
                    t = t.getRootNode().host;
                else
                    t = t.parentElement;
            }
        }
        text.focus({ preventScroll: true });
        if (isTransformed) {
            ancestors.forEach(function(p) {
                p.removeAttribute("ace_nocontext");
            });
        }
        setTimeout(function() {
            text.style.position = "";
            if (text.style.top == "0px")
                text.style.top = top;
        }, 0);
    };
    this.blur = function() {
        text.blur();
    };
    this.isFocused = function() {
        return isFocused;
    };
    
    host.on("beforeEndOperation", function() {
        if (host.curOp && host.curOp.command.name == "insertstring")
            return;
        if (inComposition) {
            lastValue = text.value = "";
            onCompositionEnd();
        }
        resetSelection();
    });
    
    var resetSelection = isIOS
    ? function(value) {
        if (!isFocused || (copied && !value)) return;
        if (!value) 
            value = "";
        var newValue = "\n ab" + value + "cde fg\n";
        if (newValue != text.value)
            text.value = lastValue = newValue;
        
        var selectionStart = 4;
        var selectionEnd = 4 + (value.length || (host.selection.isEmpty() ? 0 : 1));

        if (lastSelectionStart != selectionStart || lastSelectionEnd != selectionEnd) {
            text.setSelectionRange(selectionStart, selectionEnd);
        }
        lastSelectionStart = selectionStart;
        lastSelectionEnd = selectionEnd;
    }
    : function() {
        if (inComposition || sendingText)
            return;
        if (!isFocused && !afterContextMenu)
            return;
        inComposition = true;
        
        var selection = host.selection;
        var range = selection.getRange();
        var row = selection.cursor.row;
        var selectionStart = range.start.column;
        var selectionEnd = range.end.column;
        var line = host.session.getLine(row);

        if (range.start.row != row) {
            var prevLine = host.session.getLine(row - 1);
            selectionStart = range.start.row < row - 1 ? 0 : selectionStart;
            selectionEnd += prevLine.length + 1;
            line = prevLine + "\n" + line;
        }
        else if (range.end.row != row) {
            var nextLine = host.session.getLine(row + 1);
            selectionEnd = range.end.row > row  + 1 ? nextLine.length : selectionEnd;
            selectionEnd += line.length + 1;
            line = line + "\n" + nextLine;
        }

        if (line.length > MAX_LINE_LENGTH) {
            if (selectionStart < MAX_LINE_LENGTH && selectionEnd < MAX_LINE_LENGTH) {
                line = line.slice(0, MAX_LINE_LENGTH);
            } else {
                line = "\n";
                selectionStart = 0;
                selectionEnd = 1;
            }
        }

        var newValue = line + "\n\n";
        if (newValue != lastValue) {
            text.value = lastValue = newValue;
            lastSelectionStart = lastSelectionEnd = newValue.length;
        }
        if (afterContextMenu) {
            lastSelectionStart = text.selectionStart;
            lastSelectionEnd = text.selectionEnd;
        }
        if (
            lastSelectionEnd != selectionEnd 
            || lastSelectionStart != selectionStart 
            || text.selectionEnd != lastSelectionEnd // on ie edge selectionEnd changes silently after the initialization
        ) {
            try {
                text.setSelectionRange(selectionStart, selectionEnd);
                lastSelectionStart = selectionStart;
                lastSelectionEnd = selectionEnd;
            } catch(e){}
        }
        inComposition = false;
    };

    if (isFocused)
        host.onFocus();


    var isAllSelected = function(text) {
        return text.selectionStart === 0 && text.selectionEnd >= lastValue.length
            && text.value === lastValue && lastValue
            && text.selectionEnd !== lastSelectionEnd;
    };

    var onSelect = function(e) {
        if (inComposition)
            return;
        if (copied) {
            copied = false;
        } else if (isAllSelected(text)) {
            host.selectAll();
            resetSelection();
        }
    };

    var inputHandler = null;
    this.setInputHandler = function(cb) {inputHandler = cb;};
    this.getInputHandler = function() {return inputHandler;};
    var afterContextMenu = false;
    
    var sendText = function(value, fromInput) {
        if (afterContextMenu)
            afterContextMenu = false;
        if (pasted) {
            resetSelection();
            if (value)
                host.onPaste(value);
            pasted = false;
            return "";
        } else {
            var selectionStart = text.selectionStart;
            var selectionEnd = text.selectionEnd;
        
            var extendLeft = lastSelectionStart;
            var extendRight = lastValue.length - lastSelectionEnd;
            
            var inserted = value;
            var restoreStart = value.length - selectionStart;
            var restoreEnd = value.length - selectionEnd;
        
            var i = 0;
            while (extendLeft > 0 && lastValue[i] == value[i]) {
                i++;
                extendLeft--;
            }
            inserted = inserted.slice(i);
            i = 1;
            while (extendRight > 0 && lastValue.length - i > lastSelectionStart - 1  && lastValue[lastValue.length - i] == value[value.length - i]) {
                i++;
                extendRight--;
            }
            restoreStart -= i-1;
            restoreEnd -= i-1;
            inserted = inserted.slice(0, inserted.length - i+1);
            if (!fromInput && restoreStart == inserted.length && !extendLeft && !extendRight && !restoreEnd)
                return "";
            
            sendingText = true;
            if (inserted && !extendLeft && !extendRight && !restoreStart && !restoreEnd || commandMode) {
                host.onTextInput(inserted);
            } else {
                host.onTextInput(inserted, {
                    extendLeft: extendLeft,
                    extendRight: extendRight,
                    restoreStart: restoreStart,
                    restoreEnd: restoreEnd
                });
            }
            sendingText = false;
            
            lastValue = value;
            lastSelectionStart = selectionStart;
            lastSelectionEnd = selectionEnd;
            return inserted;
        }
    };
    var onInput = function(e) {
        if (inComposition)
            return onCompositionUpdate();
        var data = text.value;
        var inserted = sendText(data, true);
        if (data.length > MAX_LINE_LENGTH + 100 || valueResetRegex.test(inserted))
            resetSelection();
    };
    
    var handleClipboardData = function(e, data, forceIEMime) {
        var clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData || BROKEN_SETDATA)
            return;
        var mime = USE_IE_MIME_TYPE || forceIEMime ? "Text" : "text/plain";
        try {
            if (data) {
                return clipboardData.setData(mime, data) !== false;
            } else {
                return clipboardData.getData(mime);
            }
        } catch(e) {
            if (!forceIEMime)
                return handleClipboardData(e, data, true);
        }
    };

    var doCopy = function(e, isCut) {
        var data = host.getCopyText();
        if (!data)
            return event.preventDefault(e);

        if (handleClipboardData(e, data)) {
            if (isIOS) {
                resetSelection(data);
                copied = data;
                setTimeout(function () {
                    copied = false;
                }, 10);
            }
            isCut ? host.onCut() : host.onCopy();
            event.preventDefault(e);
        } else {
            copied = true;
            text.value = data;
            text.select();
            setTimeout(function(){
                copied = false;
                resetSelection();
                isCut ? host.onCut() : host.onCopy();
            });
        }
    };
    
    var onCut = function(e) {
        doCopy(e, true);
    };
    
    var onCopy = function(e) {
        doCopy(e, false);
    };
    
    var onPaste = function(e) {
        var data = handleClipboardData(e);
        if (typeof data == "string") {
            if (data)
                host.onPaste(data, e);
            if (useragent.isIE)
                setTimeout(resetSelection);
            event.preventDefault(e);
        }
        else {
            text.value = "";
            pasted = true;
        }
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));

    event.addListener(text, "select", onSelect);
    event.addListener(text, "input", onInput);

    event.addListener(text, "cut", onCut);
    event.addListener(text, "copy", onCopy);
    event.addListener(text, "paste", onPaste);
    if (!('oncut' in text) || !('oncopy' in text) || !('onpaste' in text)) {
        event.addListener(parentNode, "keydown", function(e) {
            if ((useragent.isMac && !e.metaKey) || !e.ctrlKey)
                return;

            switch (e.keyCode) {
                case 67:
                    onCopy(e);
                    break;
                case 86:
                    onPaste(e);
                    break;
                case 88:
                    onCut(e);
                    break;
            }
        });
    }
    var onCompositionStart = function(e) {
        if (inComposition || !host.onCompositionStart || host.$readOnly) 
            return;
        
        inComposition = {};

        if (commandMode)
            return;
        
        setTimeout(onCompositionUpdate, 0);
        host.on("mousedown", cancelComposition);
        
        var range = host.getSelectionRange();
        range.end.row = range.start.row;
        range.end.column = range.start.column;
        inComposition.markerRange = range;
        inComposition.selectionStart = lastSelectionStart;
        host.onCompositionStart(inComposition);
        
        if (inComposition.useTextareaForIME) {
            text.value = "";
            lastValue = "";
            lastSelectionStart = 0;
            lastSelectionEnd = 0;
        }
        else {
            if (text.msGetInputContext)
                inComposition.context = text.msGetInputContext();
            if (text.getInputContext)
                inComposition.context = text.getInputContext();
        }
    };

    var onCompositionUpdate = function() {
        if (!inComposition || !host.onCompositionUpdate || host.$readOnly)
            return;
        if (commandMode)
            return cancelComposition();
        
        if (inComposition.useTextareaForIME) {
            host.onCompositionUpdate(text.value);
        }
        else {
            var data = text.value;
            sendText(data);
            if (inComposition.markerRange) {
                if (inComposition.context) {
                    inComposition.markerRange.start.column = inComposition.selectionStart
                        = inComposition.context.compositionStartOffset;
                }
                inComposition.markerRange.end.column = inComposition.markerRange.start.column
                    + lastSelectionEnd - inComposition.selectionStart;
            }
        }
    };

    var onCompositionEnd = function(e) {
        if (!host.onCompositionEnd || host.$readOnly) return;
        inComposition = false;
        host.onCompositionEnd();
        host.off("mousedown", cancelComposition);
        if (e) onInput();
    };
    

    function cancelComposition() {
        ignoreFocusEvents = true;
        text.blur();
        text.focus();
        ignoreFocusEvents = false;
    }

    var syncComposition = lang.delayedCall(onCompositionUpdate, 50).schedule.bind(null, null);
    
    function onKeyup(e) {
        if (e.keyCode == 27 && text.value.length < text.selectionStart) {
            if (!inComposition)
                lastValue = text.value;
            lastSelectionStart = lastSelectionEnd = -1;
            resetSelection();
        }
        syncComposition();
    }

    event.addListener(text, "compositionstart", onCompositionStart);
    event.addListener(text, "compositionupdate", onCompositionUpdate);
    event.addListener(text, "keyup", onKeyup);
    event.addListener(text, "keydown", syncComposition);
    event.addListener(text, "compositionend", onCompositionEnd);

    this.getElement = function() {
        return text;
    };
    this.setCommandMode = function(value) {
       commandMode = value;
       text.readOnly = false;
    };
    
    this.setReadOnly = function(readOnly) {
        if (!commandMode)
            text.readOnly = readOnly;
    };

    this.setCopyWithEmptySelection = function(value) {
        copyWithEmptySelection = value;
    };

    this.onContextMenu = function(e) {
        afterContextMenu = true;
        resetSelection();
        host._emit("nativecontextmenu", {target: host, domEvent: e});
        this.moveToMouse(e, true);
    };
    
    this.moveToMouse = function(e, bringToFront) {
        if (!tempStyle)
            tempStyle = text.style.cssText;
        text.style.cssText = (bringToFront ? "z-index:100000;" : "")
            + (useragent.isIE ? "opacity:0.1;" : "")
            + "text-indent: -" + (lastSelectionStart + lastSelectionEnd) * host.renderer.characterWidth * 0.5 + "px;";

        var rect = host.container.getBoundingClientRect();
        var style = dom.computedStyle(host.container);
        var top = rect.top + (parseInt(style.borderTopWidth) || 0);
        var left = rect.left + (parseInt(rect.borderLeftWidth) || 0);
        var maxTop = rect.bottom - top - text.clientHeight -2;
        var move = function(e) {
            text.style.left = e.clientX - left - 2 + "px";
            text.style.top = Math.min(e.clientY - top - 2, maxTop) + "px";
        }; 
        move(e);

        if (e.type != "mousedown")
            return;

        if (host.renderer.$keepTextAreaAtCursor)
            host.renderer.$keepTextAreaAtCursor = null;

        clearTimeout(closeTimeout);
        if (useragent.isWin)
            event.capture(host.container, move, onContextMenuClose);
    };

    this.onContextMenuClose = onContextMenuClose;
    var closeTimeout;
    function onContextMenuClose() {
        clearTimeout(closeTimeout);
        closeTimeout = setTimeout(function () {
            if (tempStyle) {
                text.style.cssText = tempStyle;
                tempStyle = '';
            }
            if (host.renderer.$keepTextAreaAtCursor == null) {
                host.renderer.$keepTextAreaAtCursor = true;
                host.renderer.$moveTextAreaToCursor();
            }
        }, 0);
    }

    var onContextMenu = function(e) {
        host.textInput.onContextMenu(e);
        onContextMenuClose();
    };
    event.addListener(text, "mouseup", onContextMenu);
    event.addListener(text, "mousedown", function(e) {
        e.preventDefault();
        onContextMenuClose();
    });
    event.addListener(host.renderer.scroller, "contextmenu", onContextMenu);
    event.addListener(text, "contextmenu", onContextMenu);
    
    if (isIOS)
        addIosSelectionHandler(parentNode, host, text);

    function addIosSelectionHandler(parentNode, host, text) {
        var typingResetTimeout = null;
        var typing = false;
 
        text.addEventListener("keydown", function (e) {
            if (typingResetTimeout) clearTimeout(typingResetTimeout);
            typing = true;
        }, true);

        text.addEventListener("keyup", function (e) {
            typingResetTimeout = setTimeout(function () {
                typing = false;
            }, 100);
        }, true);
        var detectArrowKeys = function(e) {
            if (document.activeElement !== text) return;
            if (typing || inComposition) return;

            if (copied) {
                return;
            }
            var selectionStart = text.selectionStart;
            var selectionEnd = text.selectionEnd;
            
            var key = null;
            var modifier = 0;
            console.log(selectionStart, selectionEnd);
            if (selectionStart == 0) {
                key = KEYS.up;
            } else if (selectionStart == 1) {
                key = KEYS.home;
            } else if (selectionEnd > lastSelectionEnd && lastValue[selectionEnd] == "\n") {
                key = KEYS.end;
            } else if (selectionStart < lastSelectionStart && lastValue[selectionStart - 1] == " ") {
                key = KEYS.left;
                modifier = MODS.option;
            } else if (
                selectionStart < lastSelectionStart
                || (
                    selectionStart == lastSelectionStart 
                    && lastSelectionEnd != lastSelectionStart
                    && selectionStart == selectionEnd
                )
            ) {
                key = KEYS.left;
            } else if (selectionEnd > lastSelectionEnd && lastValue.slice(0, selectionEnd).split("\n").length > 2) {
                key = KEYS.down;
            } else if (selectionEnd > lastSelectionEnd && lastValue[selectionEnd - 1] == " ") {
                key = KEYS.right;
                modifier = MODS.option;
            } else if (
                selectionEnd > lastSelectionEnd
                || (
                    selectionEnd == lastSelectionEnd 
                    && lastSelectionEnd != lastSelectionStart
                    && selectionStart == selectionEnd
                )
            ) {
                key = KEYS.right;
            }
            
            if (selectionStart !== selectionEnd)
                modifier |= MODS.shift;

            if (key) {
                host.onCommandKey(null, modifier, key);
                lastSelectionStart = selectionStart;
                lastSelectionEnd = selectionEnd;
                resetSelection("");
            }
        };
        document.addEventListener("selectionchange", detectArrowKeys);
        host.on("destroy", function() {
            document.removeEventListener("selectionchange", detectArrowKeys);
        });
    }

};

exports.TextInput = TextInput;
});

ace.define("ace/mouse/default_handlers",["require","exports","module","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var useragent = require("../lib/useragent");

var DRAG_OFFSET = 0; // pixels
var SCROLL_COOLDOWN_T = 550; // milliseconds

function DefaultHandlers(mouseHandler) {
    mouseHandler.$clickSelection = null;

    var editor = mouseHandler.editor;
    editor.setDefaultHandler("mousedown", this.onMouseDown.bind(mouseHandler));
    editor.setDefaultHandler("dblclick", this.onDoubleClick.bind(mouseHandler));
    editor.setDefaultHandler("tripleclick", this.onTripleClick.bind(mouseHandler));
    editor.setDefaultHandler("quadclick", this.onQuadClick.bind(mouseHandler));
    editor.setDefaultHandler("mousewheel", this.onMouseWheel.bind(mouseHandler));
    editor.setDefaultHandler("touchmove", this.onTouchMove.bind(mouseHandler));

    var exports = ["select", "startSelect", "selectEnd", "selectAllEnd", "selectByWordsEnd",
        "selectByLinesEnd", "dragWait", "dragWaitEnd", "focusWait"];

    exports.forEach(function(x) {
        mouseHandler[x] = this[x];
    }, this);

    mouseHandler.selectByLines = this.extendSelectionBy.bind(mouseHandler, "getLineRange");
    mouseHandler.selectByWords = this.extendSelectionBy.bind(mouseHandler, "getWordRange");
}

(function() {

    this.onMouseDown = function(ev) {
        var inSelection = ev.inSelection();
        var pos = ev.getDocumentPosition();
        this.mousedownEvent = ev;
        var editor = this.editor;

        var button = ev.getButton();
        if (button !== 0) {
            var selectionRange = editor.getSelectionRange();
            var selectionEmpty = selectionRange.isEmpty();
            if (selectionEmpty || button == 1)
                editor.selection.moveToPosition(pos);
            if (button == 2) {
                editor.textInput.onContextMenu(ev.domEvent);
                if (!useragent.isMozilla)
                    ev.preventDefault();
            }
            return;
        }

        this.mousedownEvent.time = Date.now();
        if (inSelection && !editor.isFocused()) {
            editor.focus();
            if (this.$focusTimeout && !this.$clickSelection && !editor.inMultiSelectMode) {
                this.setState("focusWait");
                this.captureMouse(ev);
                return;
            }
        }

        this.captureMouse(ev);
        this.startSelect(pos, ev.domEvent._clicks > 1);
        return ev.preventDefault();
    };

    this.startSelect = function(pos, waitForClickSelection) {
        pos = pos || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
        var editor = this.editor;
        if (!this.mousedownEvent) return;
        if (this.mousedownEvent.getShiftKey())
            editor.selection.selectToPosition(pos);
        else if (!waitForClickSelection)
            editor.selection.moveToPosition(pos);
        if (!waitForClickSelection)
            this.select();
        if (editor.renderer.scroller.setCapture) {
            editor.renderer.scroller.setCapture();
        }
        editor.setStyle("ace_selecting");
        this.setState("select");
    };

    this.select = function() {
        var anchor, editor = this.editor;
        var cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
        if (this.$clickSelection) {
            var cmp = this.$clickSelection.comparePoint(cursor);

            if (cmp == -1) {
                anchor = this.$clickSelection.end;
            } else if (cmp == 1) {
                anchor = this.$clickSelection.start;
            } else {
                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);
        editor.renderer.scrollCursorIntoView();
    };

    this.extendSelectionBy = function(unitName) {
        var anchor, editor = this.editor;
        var cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
        var range = editor.selection[unitName](cursor.row, cursor.column);
        if (this.$clickSelection) {
            var cmpStart = this.$clickSelection.comparePoint(range.start);
            var cmpEnd = this.$clickSelection.comparePoint(range.end);

            if (cmpStart == -1 && cmpEnd <= 0) {
                anchor = this.$clickSelection.end;
                if (range.end.row != cursor.row || range.end.column != cursor.column)
                    cursor = range.start;
            } else if (cmpEnd == 1 && cmpStart >= 0) {
                anchor = this.$clickSelection.start;
                if (range.start.row != cursor.row || range.start.column != cursor.column)
                    cursor = range.end;
            } else if (cmpStart == -1 && cmpEnd == 1) {
                cursor = range.end;
                anchor = range.start;
            } else {
                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);
        editor.renderer.scrollCursorIntoView();
    };

    this.selectEnd =
    this.selectAllEnd =
    this.selectByWordsEnd =
    this.selectByLinesEnd = function() {
        this.$clickSelection = null;
        this.editor.unsetStyle("ace_selecting");
        if (this.editor.renderer.scroller.releaseCapture) {
            this.editor.renderer.scroller.releaseCapture();
        }
    };

    this.focusWait = function() {
        var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
        var time = Date.now();

        if (distance > DRAG_OFFSET || time - this.mousedownEvent.time > this.$focusTimeout)
            this.startSelect(this.mousedownEvent.getDocumentPosition());
    };

    this.onDoubleClick = function(ev) {
        var pos = ev.getDocumentPosition();
        var editor = this.editor;
        var session = editor.session;

        var range = session.getBracketRange(pos);
        if (range) {
            if (range.isEmpty()) {
                range.start.column--;
                range.end.column++;
            }
            this.setState("select");
        } else {
            range = editor.selection.getWordRange(pos.row, pos.column);
            this.setState("selectByWords");
        }
        this.$clickSelection = range;
        this.select();
    };

    this.onTripleClick = function(ev) {
        var pos = ev.getDocumentPosition();
        var editor = this.editor;

        this.setState("selectByLines");
        var range = editor.getSelectionRange();
        if (range.isMultiLine() && range.contains(pos.row, pos.column)) {
            this.$clickSelection = editor.selection.getLineRange(range.start.row);
            this.$clickSelection.end = editor.selection.getLineRange(range.end.row).end;
        } else {
            this.$clickSelection = editor.selection.getLineRange(pos.row);
        }
        this.select();
    };

    this.onQuadClick = function(ev) {
        var editor = this.editor;

        editor.selectAll();
        this.$clickSelection = editor.getSelectionRange();
        this.setState("selectAll");
    };

    this.onMouseWheel = function(ev) {
        if (ev.getAccelKey())
            return;
        if (ev.getShiftKey() && ev.wheelY && !ev.wheelX) {
            ev.wheelX = ev.wheelY;
            ev.wheelY = 0;
        }
        
        var editor = this.editor;
        
        if (!this.$lastScroll)
            this.$lastScroll = { t: 0, vx: 0, vy: 0, allowed: 0 };
        
        var prevScroll = this.$lastScroll;
        var t = ev.domEvent.timeStamp;
        var dt = t - prevScroll.t;
        var vx = dt ? ev.wheelX / dt : prevScroll.vx;
        var vy = dt ? ev.wheelY / dt : prevScroll.vy;
        if (dt < SCROLL_COOLDOWN_T) {
            vx = (vx + prevScroll.vx) / 2;
            vy = (vy + prevScroll.vy) / 2;
        }
        
        var direction = Math.abs(vx / vy);
        
        var canScroll = false;
        if (direction >= 1 && editor.renderer.isScrollableBy(ev.wheelX * ev.speed, 0))
            canScroll = true;
        if (direction <= 1 && editor.renderer.isScrollableBy(0, ev.wheelY * ev.speed))
            canScroll = true;
            
        if (canScroll) {
            prevScroll.allowed = t;
        } else if (t - prevScroll.allowed < SCROLL_COOLDOWN_T) {
            var isSlower = Math.abs(vx) <= 1.5 * Math.abs(prevScroll.vx)
                && Math.abs(vy) <= 1.5 * Math.abs(prevScroll.vy);
            if (isSlower) {
                canScroll = true;
                prevScroll.allowed = t;
            }
            else {
                prevScroll.allowed = 0;
            }
        }
        
        prevScroll.t = t;
        prevScroll.vx = vx;
        prevScroll.vy = vy;

        if (canScroll) {
            editor.renderer.scrollBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
            return ev.stop();
        }
    };
    
    this.onTouchMove = function(ev) {
        this.editor._emit("mousewheel", ev);
    };

}).call(DefaultHandlers.prototype);

exports.DefaultHandlers = DefaultHandlers;

function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

function calcRangeOrientation(range, cursor) {
    if (range.start.row == range.end.row)
        var cmp = 2 * cursor.column - range.start.column - range.end.column;
    else if (range.start.row == range.end.row - 1 && !range.start.column && !range.end.column)
        var cmp = cursor.column - 4;
    else
        var cmp = 2 * cursor.row - range.start.row - range.end.row;

    if (cmp < 0)
        return {cursor: range.start, anchor: range.end};
    else
        return {cursor: range.end, anchor: range.start};
}

});

ace.define("ace/tooltip",["require","exports","module","ace/lib/oop","ace/lib/dom"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
function Tooltip (parentNode) {
    this.isOpen = false;
    this.$element = null;
    this.$parentNode = parentNode;
}

(function() {
    this.$init = function() {
        this.$element = dom.createElement("div");
        this.$element.className = "ace_tooltip";
        this.$element.style.display = "none";
        this.$parentNode.appendChild(this.$element);
        return this.$element;
    };
    this.getElement = function() {
        return this.$element || this.$init();
    };
    this.setText = function(text) {
        this.getElement().textContent = text;
    };
    this.setHtml = function(html) {
        this.getElement().innerHTML = html;
    };
    this.setPosition = function(x, y) {
        this.getElement().style.left = x + "px";
        this.getElement().style.top = y + "px";
    };
    this.setClassName = function(className) {
        dom.addCssClass(this.getElement(), className);
    };
    this.show = function(text, x, y) {
        if (text != null)
            this.setText(text);
        if (x != null && y != null)
            this.setPosition(x, y);
        if (!this.isOpen) {
            this.getElement().style.display = "block";
            this.isOpen = true;
        }
    };

    this.hide = function() {
        if (this.isOpen) {
            this.getElement().style.display = "none";
            this.isOpen = false;
        }
    };
    this.getHeight = function() {
        return this.getElement().offsetHeight;
    };
    this.getWidth = function() {
        return this.getElement().offsetWidth;
    };
    
    this.destroy = function() {
        this.isOpen = false;
        if (this.$element && this.$element.parentNode) {
            this.$element.parentNode.removeChild(this.$element);
        }
    };

}).call(Tooltip.prototype);

exports.Tooltip = Tooltip;
});

ace.define("ace/mouse/default_gutter_handler",["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/event","ace/tooltip"], function(require, exports, module) {
"use strict";
var dom = require("../lib/dom");
var oop = require("../lib/oop");
var event = require("../lib/event");
var Tooltip = require("../tooltip").Tooltip;

function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;
    var gutter = editor.renderer.$gutterLayer;
    var tooltip = new GutterTooltip(editor.container);

    mouseHandler.editor.setDefaultHandler("guttermousedown", function(e) {
        if (!editor.isFocused() || e.getButton() != 0)
            return;
        var gutterRegion = gutter.getRegion(e);

        if (gutterRegion == "foldWidgets")
            return;

        var row = e.getDocumentPosition().row;
        var selection = editor.session.selection;

        if (e.getShiftKey())
            selection.selectTo(row, 0);
        else {
            if (e.domEvent.detail == 2) {
                editor.selectAll();
                return e.preventDefault();
            }
            mouseHandler.$clickSelection = editor.selection.getLineRange(row);
        }
        mouseHandler.setState("selectByLines");
        mouseHandler.captureMouse(e);
        return e.preventDefault();
    });


    var tooltipTimeout, mouseEvent, tooltipAnnotation;

    function showTooltip() {
        var row = mouseEvent.getDocumentPosition().row;
        var annotation = gutter.$annotations[row];
        if (!annotation)
            return hideTooltip();

        var maxRow = editor.session.getLength();
        if (row == maxRow) {
            var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.y).row;
            var pos = mouseEvent.$pos;
            if (screenRow > editor.session.documentToScreenRow(pos.row, pos.column))
                return hideTooltip();
        }

        if (tooltipAnnotation == annotation)
            return;
        tooltipAnnotation = annotation.text.join("<br/>");

        tooltip.setHtml(tooltipAnnotation);
        tooltip.show();
        editor._signal("showGutterTooltip", tooltip);
        editor.on("mousewheel", hideTooltip);

        if (mouseHandler.$tooltipFollowsMouse) {
            moveTooltip(mouseEvent);
        } else {
            var gutterElement = mouseEvent.domEvent.target;
            var rect = gutterElement.getBoundingClientRect();
            var style = tooltip.getElement().style;
            style.left = rect.right + "px";
            style.top = rect.bottom + "px";
        }
    }

    function hideTooltip() {
        if (tooltipTimeout)
            tooltipTimeout = clearTimeout(tooltipTimeout);
        if (tooltipAnnotation) {
            tooltip.hide();
            tooltipAnnotation = null;
            editor._signal("hideGutterTooltip", tooltip);
            editor.removeEventListener("mousewheel", hideTooltip);
        }
    }

    function moveTooltip(e) {
        tooltip.setPosition(e.x, e.y);
    }

    mouseHandler.editor.setDefaultHandler("guttermousemove", function(e) {
        var target = e.domEvent.target || e.domEvent.srcElement;
        if (dom.hasCssClass(target, "ace_fold-widget"))
            return hideTooltip();

        if (tooltipAnnotation && mouseHandler.$tooltipFollowsMouse)
            moveTooltip(e);

        mouseEvent = e;
        if (tooltipTimeout)
            return;
        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            if (mouseEvent && !mouseHandler.isMousePressed)
                showTooltip();
            else
                hideTooltip();
        }, 50);
    });

    event.addListener(editor.renderer.$gutter, "mouseout", function(e) {
        mouseEvent = null;
        if (!tooltipAnnotation || tooltipTimeout)
            return;

        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            hideTooltip();
        }, 50);
    });
    
    editor.on("changeSession", hideTooltip);
}

function GutterTooltip(parentNode) {
    Tooltip.call(this, parentNode);
}

oop.inherits(GutterTooltip, Tooltip);

(function(){
    this.setPosition = function(x, y) {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var width = this.getWidth();
        var height = this.getHeight();
        x += 15;
        y += 15;
        if (x + width > windowWidth) {
            x -= (x + width) - windowWidth;
        }
        if (y + height > windowHeight) {
            y -= 20 + height;
        }
        Tooltip.prototype.setPosition.call(this, x, y);
    };

}).call(GutterTooltip.prototype);



exports.GutterHandler = GutterHandler;

});

ace.define("ace/mouse/mouse_event",["require","exports","module","ace/lib/event","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");
var MouseEvent = exports.MouseEvent = function(domEvent, editor) {
    this.domEvent = domEvent;
    this.editor = editor;
    
    this.x = this.clientX = domEvent.clientX;
    this.y = this.clientY = domEvent.clientY;

    this.$pos = null;
    this.$inSelection = null;
    
    this.propagationStopped = false;
    this.defaultPrevented = false;
};

(function() {  
    
    this.stopPropagation = function() {
        event.stopPropagation(this.domEvent);
        this.propagationStopped = true;
    };
    
    this.preventDefault = function() {
        event.preventDefault(this.domEvent);
        this.defaultPrevented = true;
    };
    
    this.stop = function() {
        this.stopPropagation();
        this.preventDefault();
    };
    this.getDocumentPosition = function() {
        if (this.$pos)
            return this.$pos;
        
        this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        return this.$pos;
    };
    this.inSelection = function() {
        if (this.$inSelection !== null)
            return this.$inSelection;
            
        var editor = this.editor;
        

        var selectionRange = editor.getSelectionRange();
        if (selectionRange.isEmpty())
            this.$inSelection = false;
        else {
            var pos = this.getDocumentPosition();
            this.$inSelection = selectionRange.contains(pos.row, pos.column);
        }

        return this.$inSelection;
    };
    this.getButton = function() {
        return event.getButton(this.domEvent);
    };
    this.getShiftKey = function() {
        return this.domEvent.shiftKey;
    };
    
    this.getAccelKey = useragent.isMac
        ? function() { return this.domEvent.metaKey; }
        : function() { return this.domEvent.ctrlKey; };
    
}).call(MouseEvent.prototype);

});

ace.define("ace/mouse/dragdrop_handler",["require","exports","module","ace/lib/dom","ace/lib/event","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");
var event = require("../lib/event");
var useragent = require("../lib/useragent");

var AUTOSCROLL_DELAY = 200;
var SCROLL_CURSOR_DELAY = 200;
var SCROLL_CURSOR_HYSTERESIS = 5;

function DragdropHandler(mouseHandler) {

    var editor = mouseHandler.editor;

    var blankImage = dom.createElement("img");
    blankImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    if (useragent.isOpera)
        blankImage.style.cssText = "width:1px;height:1px;position:fixed;top:0;left:0;z-index:2147483647;opacity:0;";

    var exports = ["dragWait", "dragWaitEnd", "startDrag", "dragReadyEnd", "onMouseDrag"];

     exports.forEach(function(x) {
         mouseHandler[x] = this[x];
    }, this);
    editor.addEventListener("mousedown", this.onMouseDown.bind(mouseHandler));


    var mouseTarget = editor.container;
    var dragSelectionMarker, x, y;
    var timerId, range;
    var dragCursor, counter = 0;
    var dragOperation;
    var isInternal;
    var autoScrollStartTime;
    var cursorMovedTime;
    var cursorPointOnCaretMoved;

    this.onDragStart = function(e) {
        if (this.cancelDrag || !mouseTarget.draggable) {
            var self = this;
            setTimeout(function(){
                self.startSelect();
                self.captureMouse(e);
            }, 0);
            return e.preventDefault();
        }
        range = editor.getSelectionRange();

        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = editor.getReadOnly() ? "copy" : "copyMove";
        if (useragent.isOpera) {
            editor.container.appendChild(blankImage);
            blankImage.scrollTop = 0;
        }
        dataTransfer.setDragImage && dataTransfer.setDragImage(blankImage, 0, 0);
        if (useragent.isOpera) {
            editor.container.removeChild(blankImage);
        }
        dataTransfer.clearData();
        dataTransfer.setData("Text", editor.session.getTextRange());

        isInternal = true;
        this.setState("drag");
    };

    this.onDragEnd = function(e) {
        mouseTarget.draggable = false;
        isInternal = false;
        this.setState(null);
        if (!editor.getReadOnly()) {
            var dropEffect = e.dataTransfer.dropEffect;
            if (!dragOperation && dropEffect == "move")
                editor.session.remove(editor.getSelectionRange());
            editor.renderer.$cursorLayer.setBlinking(true);
        }
        this.editor.unsetStyle("ace_dragging");
        this.editor.renderer.setCursorStyle("");
    };

    this.onDragEnter = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        x = e.clientX;
        y = e.clientY;
        if (!dragSelectionMarker)
            addDragMarker();
        counter++;
        e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
        return event.preventDefault(e);
    };

    this.onDragOver = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        x = e.clientX;
        y = e.clientY;
        if (!dragSelectionMarker) {
            addDragMarker();
            counter++;
        }
        if (onMouseMoveTimer !== null)
            onMouseMoveTimer = null;

        e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
        return event.preventDefault(e);
    };

    this.onDragLeave = function(e) {
        counter--;
        if (counter <= 0 && dragSelectionMarker) {
            clearDragMarker();
            dragOperation = null;
            return event.preventDefault(e);
        }
    };

    this.onDrop = function(e) {
        if (!dragCursor)
            return;
        var dataTransfer = e.dataTransfer;
        if (isInternal) {
            switch (dragOperation) {
                case "move":
                    if (range.contains(dragCursor.row, dragCursor.column)) {
                        range = {
                            start: dragCursor,
                            end: dragCursor
                        };
                    } else {
                        range = editor.moveText(range, dragCursor);
                    }
                    break;
                case "copy":
                    range = editor.moveText(range, dragCursor, true);
                    break;
            }
        } else {
            var dropData = dataTransfer.getData('Text');
            range = {
                start: dragCursor,
                end: editor.session.insert(dragCursor, dropData)
            };
            editor.focus();
            dragOperation = null;
        }
        clearDragMarker();
        return event.preventDefault(e);
    };

    event.addListener(mouseTarget, "dragstart", this.onDragStart.bind(mouseHandler));
    event.addListener(mouseTarget, "dragend", this.onDragEnd.bind(mouseHandler));
    event.addListener(mouseTarget, "dragenter", this.onDragEnter.bind(mouseHandler));
    event.addListener(mouseTarget, "dragover", this.onDragOver.bind(mouseHandler));
    event.addListener(mouseTarget, "dragleave", this.onDragLeave.bind(mouseHandler));
    event.addListener(mouseTarget, "drop", this.onDrop.bind(mouseHandler));

    function scrollCursorIntoView(cursor, prevCursor) {
        var now = Date.now();
        var vMovement = !prevCursor || cursor.row != prevCursor.row;
        var hMovement = !prevCursor || cursor.column != prevCursor.column;
        if (!cursorMovedTime || vMovement || hMovement) {
            editor.moveCursorToPosition(cursor);
            cursorMovedTime = now;
            cursorPointOnCaretMoved = {x: x, y: y};
        } else {
            var distance = calcDistance(cursorPointOnCaretMoved.x, cursorPointOnCaretMoved.y, x, y);
            if (distance > SCROLL_CURSOR_HYSTERESIS) {
                cursorMovedTime = null;
            } else if (now - cursorMovedTime >= SCROLL_CURSOR_DELAY) {
                editor.renderer.scrollCursorIntoView();
                cursorMovedTime = null;
            }
        }
    }

    function autoScroll(cursor, prevCursor) {
        var now = Date.now();
        var lineHeight = editor.renderer.layerConfig.lineHeight;
        var characterWidth = editor.renderer.layerConfig.characterWidth;
        var editorRect = editor.renderer.scroller.getBoundingClientRect();
        var offsets = {
           x: {
               left: x - editorRect.left,
               right: editorRect.right - x
           },
           y: {
               top: y - editorRect.top,
               bottom: editorRect.bottom - y
           }
        };
        var nearestXOffset = Math.min(offsets.x.left, offsets.x.right);
        var nearestYOffset = Math.min(offsets.y.top, offsets.y.bottom);
        var scrollCursor = {row: cursor.row, column: cursor.column};
        if (nearestXOffset / characterWidth <= 2) {
            scrollCursor.column += (offsets.x.left < offsets.x.right ? -3 : +2);
        }
        if (nearestYOffset / lineHeight <= 1) {
            scrollCursor.row += (offsets.y.top < offsets.y.bottom ? -1 : +1);
        }
        var vScroll = cursor.row != scrollCursor.row;
        var hScroll = cursor.column != scrollCursor.column;
        var vMovement = !prevCursor || cursor.row != prevCursor.row;
        if (vScroll || (hScroll && !vMovement)) {
            if (!autoScrollStartTime)
                autoScrollStartTime = now;
            else if (now - autoScrollStartTime >= AUTOSCROLL_DELAY)
                editor.renderer.scrollCursorIntoView(scrollCursor);
        } else {
            autoScrollStartTime = null;
        }
    }

    function onDragInterval() {
        var prevCursor = dragCursor;
        dragCursor = editor.renderer.screenToTextCoordinates(x, y);
        scrollCursorIntoView(dragCursor, prevCursor);
        autoScroll(dragCursor, prevCursor);
    }

    function addDragMarker() {
        range = editor.selection.toOrientedRange();
        dragSelectionMarker = editor.session.addMarker(range, "ace_selection", editor.getSelectionStyle());
        editor.clearSelection();
        if (editor.isFocused())
            editor.renderer.$cursorLayer.setBlinking(false);
        clearInterval(timerId);
        onDragInterval();
        timerId = setInterval(onDragInterval, 20);
        counter = 0;
        event.addListener(document, "mousemove", onMouseMove);
    }

    function clearDragMarker() {
        clearInterval(timerId);
        editor.session.removeMarker(dragSelectionMarker);
        dragSelectionMarker = null;
        editor.selection.fromOrientedRange(range);
        if (editor.isFocused() && !isInternal)
            editor.renderer.$cursorLayer.setBlinking(!editor.getReadOnly());
        range = null;
        dragCursor = null;
        counter = 0;
        autoScrollStartTime = null;
        cursorMovedTime = null;
        event.removeListener(document, "mousemove", onMouseMove);
    }
    var onMouseMoveTimer = null;
    function onMouseMove() {
        if (onMouseMoveTimer == null) {
            onMouseMoveTimer = setTimeout(function() {
                if (onMouseMoveTimer != null && dragSelectionMarker)
                    clearDragMarker();
            }, 20);
        }
    }

    function canAccept(dataTransfer) {
        var types = dataTransfer.types;
        return !types || Array.prototype.some.call(types, function(type) {
            return type == 'text/plain' || type == 'Text';
        });
    }

    function getDropEffect(e) {
        var copyAllowed = ['copy', 'copymove', 'all', 'uninitialized'];
        var moveAllowed = ['move', 'copymove', 'linkmove', 'all', 'uninitialized'];

        var copyModifierState = useragent.isMac ? e.altKey : e.ctrlKey;
        var effectAllowed = "uninitialized";
        try {
            effectAllowed = e.dataTransfer.effectAllowed.toLowerCase();
        } catch (e) {}
        var dropEffect = "none";

        if (copyModifierState && copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";
        else if (moveAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "move";
        else if (copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";

        return dropEffect;
    }
}

(function() {

    this.dragWait = function() {
        var interval = Date.now() - this.mousedownEvent.time;
        if (interval > this.editor.getDragDelay())
            this.startDrag();
    };

    this.dragWaitEnd = function() {
        var target = this.editor.container;
        target.draggable = false;
        this.startSelect(this.mousedownEvent.getDocumentPosition());
        this.selectEnd();
    };

    this.dragReadyEnd = function(e) {
        this.editor.renderer.$cursorLayer.setBlinking(!this.editor.getReadOnly());
        this.editor.unsetStyle("ace_dragging");
        this.editor.renderer.setCursorStyle("");
        this.dragWaitEnd();
    };

    this.startDrag = function(){
        this.cancelDrag = false;
        var editor = this.editor;
        var target = editor.container;
        target.draggable = true;
        editor.renderer.$cursorLayer.setBlinking(false);
        editor.setStyle("ace_dragging");
        var cursorStyle = useragent.isWin ? "default" : "move";
        editor.renderer.setCursorStyle(cursorStyle);
        this.setState("dragReady");
    };

    this.onMouseDrag = function(e) {
        var target = this.editor.container;
        if (useragent.isIE && this.state == "dragReady") {
            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
            if (distance > 3)
                target.dragDrop();
        }
        if (this.state === "dragWait") {
            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
            if (distance > 0) {
                target.draggable = false;
                this.startSelect(this.mousedownEvent.getDocumentPosition());
            }
        }
    };

    this.onMouseDown = function(e) {
        if (!this.$dragEnabled)
            return;
        this.mousedownEvent = e;
        var editor = this.editor;

        var inSelection = e.inSelection();
        var button = e.getButton();
        var clickCount = e.domEvent.detail || 1;
        if (clickCount === 1 && button === 0 && inSelection) {
            if (e.editor.inMultiSelectMode && (e.getAccelKey() || e.getShiftKey()))
                return;
            this.mousedownEvent.time = Date.now();
            var eventTarget = e.domEvent.target || e.domEvent.srcElement;
            if ("unselectable" in eventTarget)
                eventTarget.unselectable = "on";
            if (editor.getDragDelay()) {
                if (useragent.isWebKit) {
                    this.cancelDrag = true;
                    var mouseTarget = editor.container;
                    mouseTarget.draggable = true;
                }
                this.setState("dragWait");
            } else {
                this.startDrag();
            }
            this.captureMouse(e, this.onMouseDrag.bind(this));
            e.defaultPrevented = true;
        }
    };

}).call(DragdropHandler.prototype);


function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

exports.DragdropHandler = DragdropHandler;

});

ace.define("ace/lib/net",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";
var dom = require("./dom");

exports.get = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
};

exports.loadScript = function(path, callback) {
    var head = dom.getDocumentHead();
    var s = document.createElement('script');

    s.src = path;
    head.appendChild(s);

    s.onload = s.onreadystatechange = function(_, isAbort) {
        if (isAbort || !s.readyState || s.readyState == "loaded" || s.readyState == "complete") {
            s = s.onload = s.onreadystatechange = null;
            if (!isAbort)
                callback();
        }
    };
};
exports.qualifyURL = function(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
};

});

ace.define("ace/lib/event_emitter",["require","exports","module"], function(require, exports, module) {
"use strict";

var EventEmitter = {};
var stopPropagation = function() { this.propagationStopped = true; };
var preventDefault = function() { this.defaultPrevented = true; };

EventEmitter._emit =
EventEmitter._dispatchEvent = function(eventName, e) {
    this._eventRegistry || (this._eventRegistry = {});
    this._defaultHandlers || (this._defaultHandlers = {});

    var listeners = this._eventRegistry[eventName] || [];
    var defaultHandler = this._defaultHandlers[eventName];
    if (!listeners.length && !defaultHandler)
        return;

    if (typeof e != "object" || !e)
        e = {};

    if (!e.type)
        e.type = eventName;
    if (!e.stopPropagation)
        e.stopPropagation = stopPropagation;
    if (!e.preventDefault)
        e.preventDefault = preventDefault;

    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++) {
        listeners[i](e, this);
        if (e.propagationStopped)
            break;
    }
    
    if (defaultHandler && !e.defaultPrevented)
        return defaultHandler(e, this);
};


EventEmitter._signal = function(eventName, e) {
    var listeners = (this._eventRegistry || {})[eventName];
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++)
        listeners[i](e, this);
};

EventEmitter.once = function(eventName, callback) {
    var _self = this;
    this.addEventListener(eventName, function newCallback() {
        _self.removeEventListener(eventName, newCallback);
        callback.apply(null, arguments);
    });
    if (!callback) {
        return new Promise(function(resolve) {
            callback = resolve;
        });
    }
};


EventEmitter.setDefaultHandler = function(eventName, callback) {
    var handlers = this._defaultHandlers;
    if (!handlers)
        handlers = this._defaultHandlers = {_disabled_: {}};
    
    if (handlers[eventName]) {
        var old = handlers[eventName];
        var disabled = handlers._disabled_[eventName];
        if (!disabled)
            handlers._disabled_[eventName] = disabled = [];
        disabled.push(old);
        var i = disabled.indexOf(callback);
        if (i != -1) 
            disabled.splice(i, 1);
    }
    handlers[eventName] = callback;
};
EventEmitter.removeDefaultHandler = function(eventName, callback) {
    var handlers = this._defaultHandlers;
    if (!handlers)
        return;
    var disabled = handlers._disabled_[eventName];
    
    if (handlers[eventName] == callback) {
        if (disabled)
            this.setDefaultHandler(eventName, disabled.pop());
    } else if (disabled) {
        var i = disabled.indexOf(callback);
        if (i != -1)
            disabled.splice(i, 1);
    }
};

EventEmitter.on =
EventEmitter.addEventListener = function(eventName, callback, capturing) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        listeners = this._eventRegistry[eventName] = [];

    if (listeners.indexOf(callback) == -1)
        listeners[capturing ? "unshift" : "push"](callback);
    return callback;
};

EventEmitter.off =
EventEmitter.removeListener =
EventEmitter.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        return;

    var index = listeners.indexOf(callback);
    if (index !== -1)
        listeners.splice(index, 1);
};

EventEmitter.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
};

exports.EventEmitter = EventEmitter;

});

ace.define("ace/lib/app_config",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";

var oop = require("./oop");
var EventEmitter = require("./event_emitter").EventEmitter;

var optionsProvider = {
    setOptions: function(optList) {
        Object.keys(optList).forEach(function(key) {
            this.setOption(key, optList[key]);
        }, this);
    },
    getOptions: function(optionNames) {
        var result = {};
        if (!optionNames) {
            var options = this.$options;
            optionNames = Object.keys(options).filter(function(key) {
                return !options[key].hidden;
            });
        } else if (!Array.isArray(optionNames)) {
            result = optionNames;
            optionNames = Object.keys(result);
        }
        optionNames.forEach(function(key) {
            result[key] = this.getOption(key);
        }, this);
        return result;
    },
    setOption: function(name, value) {
        if (this["$" + name] === value)
            return;
        var opt = this.$options[name];
        if (!opt) {
            return warn('misspelled option "' + name + '"');
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].setOption(name, value);

        if (!opt.handlesSet)
            this["$" + name] = value;
        if (opt && opt.set)
            opt.set.call(this, value);
    },
    getOption: function(name) {
        var opt = this.$options[name];
        if (!opt) {
            return warn('misspelled option "' + name + '"');
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].getOption(name);
        return opt && opt.get ? opt.get.call(this) : this["$" + name];
    }
};

function warn(message) {
    if (typeof console != "undefined" && console.warn)
        console.warn.apply(console, arguments);
}

function reportError(msg, data) {
    var e = new Error(msg);
    e.data = data;
    if (typeof console == "object" && console.error)
        console.error(e);
    setTimeout(function() { throw e; });
}

var AppConfig = function() {
    this.$defaultOptions = {};
};

(function() {
    oop.implement(this, EventEmitter);
    this.defineOptions = function(obj, path, options) {
        if (!obj.$options)
            this.$defaultOptions[path] = obj.$options = {};

        Object.keys(options).forEach(function(key) {
            var opt = options[key];
            if (typeof opt == "string")
                opt = {forwardTo: opt};

            opt.name || (opt.name = key);
            obj.$options[opt.name] = opt;
            if ("initialValue" in opt)
                obj["$" + opt.name] = opt.initialValue;
        });
        oop.implement(obj, optionsProvider);

        return this;
    };

    this.resetOptions = function(obj) {
        Object.keys(obj.$options).forEach(function(key) {
            var opt = obj.$options[key];
            if ("value" in opt)
                obj.setOption(key, opt.value);
        });
    };

    this.setDefaultValue = function(path, name, value) {
        var opts = this.$defaultOptions[path] || (this.$defaultOptions[path] = {});
        if (opts[name]) {
            if (opts.forwardTo)
                this.setDefaultValue(opts.forwardTo, name, value);
            else
                opts[name].value = value;
        }
    };

    this.setDefaultValues = function(path, optionHash) {
        Object.keys(optionHash).forEach(function(key) {
            this.setDefaultValue(path, key, optionHash[key]);
        }, this);
    };
    
    this.warn = warn;
    this.reportError = reportError;
    
}).call(AppConfig.prototype);

exports.AppConfig = AppConfig;

});

ace.define("ace/config",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/lib/net","ace/lib/app_config"], function(require, exports, module) {
"no use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var net = require("./lib/net");
var AppConfig = require("./lib/app_config").AppConfig;

module.exports = exports = new AppConfig();

var global = (function() {
    return this || typeof window != "undefined" && window;
})();

var options = {
    packaged: false,
    workerPath: null,
    modePath: null,
    themePath: null,
    basePath: "",
    suffix: ".js",
    $moduleUrls: {},
    loadWorkerFromBlob: true
};

exports.get = function(key) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown config key: " + key);

    return options[key];
};

exports.set = function(key, value) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown config key: " + key);

    options[key] = value;
};

exports.all = function() {
    return lang.copyObject(options);
};

exports.$modes = {};
exports.moduleUrl = function(name, component) {
    if (options.$moduleUrls[name])
        return options.$moduleUrls[name];

    var parts = name.split("/");
    component = component || parts[parts.length - 2] || "";
    var sep = component == "snippets" ? "/" : "-";
    var base = parts[parts.length - 1];
    if (component == "worker" && sep == "-") {
        var re = new RegExp("^" + component + "[\\-_]|[\\-_]" + component + "$", "g");
        base = base.replace(re, "");
    }

    if ((!base || base == component) && parts.length > 1)
        base = parts[parts.length - 2];
    var path = options[component + "Path"];
    if (path == null) {
        path = options.basePath;
    } else if (sep == "/") {
        component = sep = "";
    }
    if (path && path.slice(-1) != "/")
        path += "/";
    return path + component + sep + base + this.get("suffix");
};

exports.setModuleUrl = function(name, subst) {
    return options.$moduleUrls[name] = subst;
};

exports.$loading = {};
exports.loadModule = function(moduleName, onLoad) {
    var module, moduleType;
    if (Array.isArray(moduleName)) {
        moduleType = moduleName[0];
        moduleName = moduleName[1];
    }

    try {
        module = require(moduleName);
    } catch (e) {}
    if (module && !exports.$loading[moduleName])
        return onLoad && onLoad(module);

    if (!exports.$loading[moduleName])
        exports.$loading[moduleName] = [];

    exports.$loading[moduleName].push(onLoad);

    if (exports.$loading[moduleName].length > 1)
        return;

    var afterLoad = function() {
        require([moduleName], function(module) {
            exports._emit("load.module", {name: moduleName, module: module});
            var listeners = exports.$loading[moduleName];
            exports.$loading[moduleName] = null;
            listeners.forEach(function(onLoad) {
                onLoad && onLoad(module);
            });
        });
    };

    if (!exports.get("packaged"))
        return afterLoad();
    
    net.loadScript(exports.moduleUrl(moduleName, moduleType), afterLoad);
    reportErrorIfPathIsNotConfigured();
};

var reportErrorIfPathIsNotConfigured = function() {
    if (
        !options.basePath && !options.workerPath 
        && !options.modePath && !options.themePath
        && !Object.keys(options.$moduleUrls).length
    ) {
        console.error(
            "Unable to infer path to ace from script src,",
            "use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes",
            "or with webpack use ace/webpack-resolver"
        );
        reportErrorIfPathIsNotConfigured = function() {};
    }
};
init(true);function init(packaged) {

    if (!global || !global.document)
        return;
    
    options.packaged = packaged || require.packaged || module.packaged || (global.define && define.packaged);

    var scriptOptions = {};
    var scriptUrl = "";
    var currentScript = (document.currentScript || document._currentScript ); // native or polyfill
    var currentDocument = currentScript && currentScript.ownerDocument || document;
    
    var scripts = currentDocument.getElementsByTagName("script");
    for (var i=0; i<scripts.length; i++) {
        var script = scripts[i];

        var src = script.src || script.getAttribute("src");
        if (!src)
            continue;

        var attributes = script.attributes;
        for (var j=0, l=attributes.length; j < l; j++) {
            var attr = attributes[j];
            if (attr.name.indexOf("data-ace-") === 0) {
                scriptOptions[deHyphenate(attr.name.replace(/^data-ace-/, ""))] = attr.value;
            }
        }

        var m = src.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
        if (m)
            scriptUrl = m[1];
    }

    if (scriptUrl) {
        scriptOptions.base = scriptOptions.base || scriptUrl;
        scriptOptions.packaged = true;
    }

    scriptOptions.basePath = scriptOptions.base;
    scriptOptions.workerPath = scriptOptions.workerPath || scriptOptions.base;
    scriptOptions.modePath = scriptOptions.modePath || scriptOptions.base;
    scriptOptions.themePath = scriptOptions.themePath || scriptOptions.base;
    delete scriptOptions.base;

    for (var key in scriptOptions)
        if (typeof scriptOptions[key] !== "undefined")
            exports.set(key, scriptOptions[key]);
}

exports.init = init;

function deHyphenate(str) {
    return str.replace(/-(.)/g, function(m, m1) { return m1.toUpperCase(); });
}

});

ace.define("ace/mouse/mouse_handler",["require","exports","module","ace/lib/event","ace/lib/useragent","ace/mouse/default_handlers","ace/mouse/default_gutter_handler","ace/mouse/mouse_event","ace/mouse/dragdrop_handler","ace/config"], function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");
var DefaultHandlers = require("./default_handlers").DefaultHandlers;
var DefaultGutterHandler = require("./default_gutter_handler").GutterHandler;
var MouseEvent = require("./mouse_event").MouseEvent;
var DragdropHandler = require("./dragdrop_handler").DragdropHandler;
var config = require("../config");

var MouseHandler = function(editor) {
    var _self = this;
    this.editor = editor;

    new DefaultHandlers(this);
    new DefaultGutterHandler(this);
    new DragdropHandler(this);

    var focusEditor = function(e) {
        var windowBlurred = !document.hasFocus || !document.hasFocus()
            || !editor.isFocused() && document.activeElement == (editor.textInput && editor.textInput.getElement());
        if (windowBlurred)
            window.focus();
        editor.focus();
    };

    var mouseTarget = editor.renderer.getMouseEventTarget();
    event.addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"));
    event.addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"));
    event.addMultiMouseDownListener([
        mouseTarget,
        editor.renderer.scrollBarV && editor.renderer.scrollBarV.inner,
        editor.renderer.scrollBarH && editor.renderer.scrollBarH.inner,
        editor.textInput && editor.textInput.getElement()
    ].filter(Boolean), [400, 300, 250], this, "onMouseEvent");
    event.addMouseWheelListener(editor.container, this.onMouseWheel.bind(this, "mousewheel"));
    event.addTouchMoveListener(editor.container, this.onTouchMove.bind(this, "touchmove"));

    var gutterEl = editor.renderer.$gutter;
    event.addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"));
    event.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"));
    event.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"));
    event.addListener(gutterEl, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"));

    event.addListener(mouseTarget, "mousedown", focusEditor);
    event.addListener(gutterEl, "mousedown", focusEditor);
    if (useragent.isIE && editor.renderer.scrollBarV) {
        event.addListener(editor.renderer.scrollBarV.element, "mousedown", focusEditor);
        event.addListener(editor.renderer.scrollBarH.element, "mousedown", focusEditor);
    }

    editor.on("mousemove", function(e){
        if (_self.state || _self.$dragDelay || !_self.$dragEnabled)
            return;

        var character = editor.renderer.screenToTextCoordinates(e.x, e.y);
        var range = editor.session.selection.getRange();
        var renderer = editor.renderer;

        if (!range.isEmpty() && range.insideStart(character.row, character.column)) {
            renderer.setCursorStyle("default");
        } else {
            renderer.setCursorStyle("");
        }
    });
};

(function() {
    this.onMouseEvent = function(name, e) {
        this.editor._emit(name, new MouseEvent(e, this.editor));
    };

    this.onMouseMove = function(name, e) {
        var listeners = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
        if (!listeners || !listeners.length)
            return;

        this.editor._emit(name, new MouseEvent(e, this.editor));
    };

    this.onMouseWheel = function(name, e) {
        var mouseEvent = new MouseEvent(e, this.editor);
        mouseEvent.speed = this.$scrollSpeed * 2;
        mouseEvent.wheelX = e.wheelX;
        mouseEvent.wheelY = e.wheelY;

        this.editor._emit(name, mouseEvent);
    };
    
    this.onTouchMove = function (name, e) {
        var mouseEvent = new MouseEvent(e, this.editor);
        mouseEvent.speed = 1;//this.$scrollSpeed * 2;
        mouseEvent.wheelX = e.wheelX;
        mouseEvent.wheelY = e.wheelY;
        this.editor._emit(name, mouseEvent);
    };

    this.setState = function(state) {
        this.state = state;
    };

    this.captureMouse = function(ev, mouseMoveHandler) {
        this.x = ev.x;
        this.y = ev.y;

        this.isMousePressed = true;
        var editor = this.editor;
        var renderer = this.editor.renderer;
        if (renderer.$keepTextAreaAtCursor)
            renderer.$keepTextAreaAtCursor = null;

        var self = this;
        var onMouseMove = function(e) {
            if (!e) return;
            if (useragent.isWebKit && !e.which && self.releaseMouse)
                return self.releaseMouse();

            self.x = e.clientX;
            self.y = e.clientY;
            mouseMoveHandler && mouseMoveHandler(e);
            self.mouseEvent = new MouseEvent(e, self.editor);
            self.$mouseMoved = true;
        };

        var onCaptureEnd = function(e) {
            editor.off("beforeEndOperation", onOperationEnd);
            clearInterval(timerId);
            onCaptureInterval();
            self[self.state + "End"] && self[self.state + "End"](e);
            self.state = "";
            if (renderer.$keepTextAreaAtCursor == null) {
                renderer.$keepTextAreaAtCursor = true;
                renderer.$moveTextAreaToCursor();
            }
            self.isMousePressed = false;
            self.$onCaptureMouseMove = self.releaseMouse = null;
            e && self.onMouseEvent("mouseup", e);
            editor.endOperation();
        };

        var onCaptureInterval = function() {
            self[self.state] && self[self.state]();
            self.$mouseMoved = false;
        };

        if (useragent.isOldIE && ev.domEvent.type == "dblclick") {
            return setTimeout(function() {onCaptureEnd(ev);});
        }

        var onOperationEnd = function(e) {
            if (!self.releaseMouse) return;
            if (editor.curOp.command.name && editor.curOp.selectionChanged) {
                self[self.state + "End"] && self[self.state + "End"]();
                self.state = "";
                self.releaseMouse();
            }
        };

        editor.on("beforeEndOperation", onOperationEnd);
        editor.startOperation({command: {name: "mouse"}});

        self.$onCaptureMouseMove = onMouseMove;
        self.releaseMouse = event.capture(this.editor.container, onMouseMove, onCaptureEnd);
        var timerId = setInterval(onCaptureInterval, 20);
    };
    this.releaseMouse = null;
    this.cancelContextMenu = function() {
        var stop = function(e) {
            if (e && e.domEvent && e.domEvent.type != "contextmenu")
                return;
            this.editor.off("nativecontextmenu", stop);
            if (e && e.domEvent)
                event.stopEvent(e.domEvent);
        }.bind(this);
        setTimeout(stop, 10);
        this.editor.on("nativecontextmenu", stop);
    };
}).call(MouseHandler.prototype);

config.defineOptions(MouseHandler.prototype, "mouseHandler", {
    scrollSpeed: {initialValue: 2},
    dragDelay: {initialValue: (useragent.isMac ? 150 : 0)},
    dragEnabled: {initialValue: true},
    focusTimeout: {initialValue: 0},
    tooltipFollowsMouse: {initialValue: true}
});


exports.MouseHandler = MouseHandler;
});

ace.define("ace/mouse/fold_handler",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";
var dom = require("../lib/dom");

function FoldHandler(editor) {

    editor.on("click", function(e) {
        var position = e.getDocumentPosition();
        var session = editor.session;
        var fold = session.getFoldAt(position.row, position.column, 1);
        if (fold) {
            if (e.getAccelKey())
                session.removeFold(fold);
            else
                session.expandFold(fold);

            e.stop();
        }
        
        var target = e.domEvent && e.domEvent.target;
        if (target && dom.hasCssClass(target, "ace_inline_button")) {
            if (dom.hasCssClass(target, "ace_toggle_wrap")) {
                session.setOption("wrap", true);
                editor.renderer.scrollCursorIntoView();
            }
        }
    });

    editor.on("gutterclick", function(e) {
        var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

        if (gutterRegion == "foldWidgets") {
            var row = e.getDocumentPosition().row;
            var session = editor.session;
            if (session.foldWidgets && session.foldWidgets[row])
                editor.session.onFoldWidgetClick(row, e);
            if (!editor.isFocused())
                editor.focus();
            e.stop();
        }
    });

    editor.on("gutterdblclick", function(e) {
        var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

        if (gutterRegion == "foldWidgets") {
            var row = e.getDocumentPosition().row;
            var session = editor.session;
            var data = session.getParentFoldRangeData(row, true);
            var range = data.range || data.firstRange;

            if (range) {
                row = range.start.row;
                var fold = session.getFoldAt(row, session.getLine(row).length, 1);

                if (fold) {
                    session.removeFold(fold);
                } else {
                    session.addFold("...", range);
                    editor.renderer.scrollCursorIntoView({row: range.start.row, column: 0});
                }
            }
            e.stop();
        }
    });
}

exports.FoldHandler = FoldHandler;

});

ace.define("ace/keyboard/keybinding",["require","exports","module","ace/lib/keys","ace/lib/event"], function(require, exports, module) {
"use strict";

var keyUtil  = require("../lib/keys");
var event = require("../lib/event");

var KeyBinding = function(editor) {
    this.$editor = editor;
    this.$data = {editor: editor};
    this.$handlers = [];
    this.setDefaultHandler(editor.commands);
};

(function() {
    this.setDefaultHandler = function(kb) {
        this.removeKeyboardHandler(this.$defaultHandler);
        this.$defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    };

    this.setKeyboardHandler = function(kb) {
        var h = this.$handlers;
        if (h[h.length - 1] == kb)
            return;

        while (h[h.length - 1] && h[h.length - 1] != this.$defaultHandler)
            this.removeKeyboardHandler(h[h.length - 1]);

        this.addKeyboardHandler(kb, 1);
    };

    this.addKeyboardHandler = function(kb, pos) {
        if (!kb)
            return;
        if (typeof kb == "function" && !kb.handleKeyboard)
            kb.handleKeyboard = kb;
        var i = this.$handlers.indexOf(kb);
        if (i != -1)
            this.$handlers.splice(i, 1);

        if (pos == undefined)
            this.$handlers.push(kb);
        else
            this.$handlers.splice(pos, 0, kb);

        if (i == -1 && kb.attach)
            kb.attach(this.$editor);
    };

    this.removeKeyboardHandler = function(kb) {
        var i = this.$handlers.indexOf(kb);
        if (i == -1)
            return false;
        this.$handlers.splice(i, 1);
        kb.detach && kb.detach(this.$editor);
        return true;
    };

    this.getKeyboardHandler = function() {
        return this.$handlers[this.$handlers.length - 1];
    };
    
    this.getStatusText = function() {
        var data = this.$data;
        var editor = data.editor;
        return this.$handlers.map(function(h) {
            return h.getStatusText && h.getStatusText(editor, data) || "";
        }).filter(Boolean).join(" ");
    };

    this.$callKeyboardHandlers = function(hashId, keyString, keyCode, e) {
        var toExecute;
        var success = false;
        var commands = this.$editor.commands;

        for (var i = this.$handlers.length; i--;) {
            toExecute = this.$handlers[i].handleKeyboard(
                this.$data, hashId, keyString, keyCode, e
            );
            if (!toExecute || !toExecute.command)
                continue;
            if (toExecute.command == "null") {
                success = true;
            } else {
                success = commands.exec(toExecute.command, this.$editor, toExecute.args, e);
            }
            if (success && e && hashId != -1 && 
                toExecute.passEvent != true && toExecute.command.passEvent != true
            ) {
                event.stopEvent(e);
            }
            if (success)
                break;
        }
        
        if (!success && hashId == -1) {
            toExecute = {command: "insertstring"};
            success = commands.exec("insertstring", this.$editor, keyString);
        }
        
        if (success && this.$editor._signal)
            this.$editor._signal("keyboardActivity", toExecute);
        
        return success;
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        var keyString = keyUtil.keyCodeToString(keyCode);
        this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
    };

    this.onTextInput = function(text) {
        this.$callKeyboardHandlers(-1, text);
    };

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;
});

ace.define("ace/lib/bidiutil",["require","exports","module"], function(require, exports, module) {
"use strict";

var ArabicAlefBetIntervalsBegine = ['\u0621', '\u0641'];
var ArabicAlefBetIntervalsEnd = ['\u063A', '\u064a'];
var dir = 0, hiLevel = 0;
var lastArabic = false, hasUBAT_AL = false,  hasUBAT_B = false,  hasUBAT_S = false, hasBlockSep = false, hasSegSep = false;

var impTab_LTR = [	[	0,		3,		0,		1,		0,		0,		0	],	[	0,		3,		0,		1,		2,		2,		0	],	[	0,		3,		0,		0x11,		2,		0,		1	],	[	0,		3,		5,		5,		4,		1,		0	],	[	0,		3,		0x15,		0x15,		4,		0,		1	],	[	0,		3,		5,		5,		4,		2,		0	]
];

var impTab_RTL = [	[	2,		0,		1,		1,		0,		1,		0	],	[	2,		0,		1,		1,		0,		2,		0	],	[	2,		0,		2,		1,		3,		2,		0	],	[	2,		0,		2,		0x21,		3,		1,		1	]
];

var LTR = 0, RTL = 1;

var L = 0;
var R = 1;
var EN = 2;
var AN = 3;
var ON = 4;
var B = 5;
var S = 6;
var AL = 7;
var WS = 8;
var CS = 9;
var ES = 10;
var ET = 11;
var NSM = 12;
var LRE = 13;
var RLE = 14;
var PDF = 15;
var LRO = 16;
var RLO = 17;
var BN = 18;

var UnicodeTBL00 = [
BN,BN,BN,BN,BN,BN,BN,BN,BN,S,B,S,WS,B,BN,BN,
BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,B,B,B,S,
WS,ON,ON,ET,ET,ET,ON,ON,ON,ON,ON,ES,CS,ES,CS,CS,
EN,EN,EN,EN,EN,EN,EN,EN,EN,EN,CS,ON,ON,ON,ON,ON,
ON,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,
L,L,L,L,L,L,L,L,L,L,L,ON,ON,ON,ON,ON,
ON,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,
L,L,L,L,L,L,L,L,L,L,L,ON,ON,ON,ON,BN,
BN,BN,BN,BN,BN,B,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,
BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,
CS,ON,ET,ET,ET,ET,ON,ON,ON,ON,L,ON,ON,BN,ON,ON,
ET,ET,EN,EN,ON,L,ON,ON,ON,EN,L,ON,ON,ON,ON,ON
];

var UnicodeTBL20 = [
WS,WS,WS,WS,WS,WS,WS,WS,WS,WS,WS,BN,BN,BN,L,R	,
ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,
ON,ON,ON,ON,ON,ON,ON,ON,WS,B,LRE,RLE,PDF,LRO,RLO,CS,
ET,ET,ET,ET,ET,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,
ON,ON,ON,ON,CS,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,
ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,WS
];

function _computeLevels(chars, levels, len, charTypes) {
	var impTab = dir ? impTab_RTL : impTab_LTR
		, prevState = null, newClass = null, newLevel = null, newState = 0
		, action = null, cond = null, condPos = -1, i = null, ix = null, classes = [];

	if (!charTypes) {
		for (i = 0, charTypes = []; i < len; i++) {
			charTypes[i] = _getCharacterType(chars[i]);
		}
	}
	hiLevel = dir;
	lastArabic = false;
	hasUBAT_AL = false;
	hasUBAT_B = false;
	hasUBAT_S = false;
	for (ix = 0; ix < len; ix++){
		prevState = newState;
		classes[ix] = newClass = _getCharClass(chars, charTypes, classes, ix);
		newState = impTab[prevState][newClass];
		action = newState & 0xF0;
		newState &= 0x0F;
		levels[ix] = newLevel = impTab[newState][5];
		if (action > 0){
			if (action == 0x10){
				for(i = condPos; i < ix; i++){
					levels[i] = 1;
				}
				condPos = -1;
			} else {
				condPos = -1;
			}
		}
		cond = impTab[newState][6];
		if (cond){
			if(condPos == -1){
				condPos = ix;
			}
		}else{
			if (condPos > -1){
				for(i = condPos; i < ix; i++){
					levels[i] = newLevel;
				}
				condPos = -1;
			}
		}
		if (charTypes[ix] == B){
			levels[ix] = 0;
		}
		hiLevel |= newLevel;
	}
	if (hasUBAT_S){
		for(i = 0; i < len; i++){
			if(charTypes[i] == S){
				levels[i] = dir;
				for(var j = i - 1; j >= 0; j--){
					if(charTypes[j] == WS){
						levels[j] = dir;
					}else{
						break;
					}
				}
			}
		}
	}
}

function _invertLevel(lev, levels, _array) {
	if (hiLevel < lev){
		return;
	}
	if (lev == 1 && dir == RTL && !hasUBAT_B){
		_array.reverse();
		return;
	}
	var len = _array.length, start = 0, end, lo, hi, tmp;
	while(start < len){
		if (levels[start] >= lev){
			end = start + 1;
		while(end < len && levels[end] >= lev){
			end++;
		}
		for(lo = start, hi = end - 1 ; lo < hi; lo++, hi--){
			tmp = _array[lo];
			_array[lo] = _array[hi];
			_array[hi] = tmp;
		}
		start = end;
	}
	start++;
	}
}

function _getCharClass(chars, types, classes, ix) {			
	var cType = types[ix], wType, nType, len, i;
	switch(cType){
		case L:
		case R:
			lastArabic = false;
		case ON:
		case AN:
			return cType;
		case EN:
			return lastArabic ? AN : EN;
		case AL:
			lastArabic = true;
			hasUBAT_AL = true;
			return R;
		case WS:
			return ON;
		case CS:
			if (ix < 1 || (ix + 1) >= types.length ||
				((wType = classes[ix - 1]) != EN && wType != AN) ||
				((nType = types[ix + 1]) != EN && nType != AN)){
				return ON;
			}
			if (lastArabic){nType = AN;}
			return nType == wType ? nType : ON;
		case ES:
			wType = ix > 0 ? classes[ix - 1] : B;
			if (wType == EN && (ix + 1) < types.length && types[ix + 1] == EN){
				return EN;
			}
			return ON;
		case ET:
			if (ix > 0 && classes[ix - 1] == EN){
				return EN;
			}
			if (lastArabic){
				return ON;
			}
			i = ix + 1;
			len = types.length;
			while (i < len && types[i] == ET){
				i++;
			}
			if (i < len && types[i] == EN){
				return EN;
			}
			return ON;
		case NSM:
			len = types.length;
			i = ix + 1;
			while (i < len && types[i] == NSM){
				i++;
			}
			if (i < len){
				var c = chars[ix], rtlCandidate = (c >= 0x0591 && c <= 0x08FF) || c == 0xFB1E;
				
				wType = types[i];
				if (rtlCandidate && (wType == R || wType == AL)){
					return R;
				}
			}

			if (ix < 1 || (wType = types[ix - 1]) == B){
				return ON;
			}
			return classes[ix - 1];
		case B:
			lastArabic = false;
			hasUBAT_B = true;
			return dir;
		case S:
			hasUBAT_S = true;
			return ON;
		case LRE:
		case RLE:
		case LRO:
		case RLO:
		case PDF:
			lastArabic = false;
		case BN:
			return ON;
	}
}

function _getCharacterType( ch ) {		
	var uc = ch.charCodeAt(0), hi = uc >> 8;
	
	if (hi == 0) {		
		return ((uc > 0x00BF) ? L : UnicodeTBL00[uc]);
	} else if (hi == 5) {
		return (/[\u0591-\u05f4]/.test(ch) ? R : L);
	} else if (hi == 6) {
		if (/[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(ch))
			return NSM;
		else if (/[\u0660-\u0669\u066b-\u066c]/.test(ch))
			return AN;
		else if (uc == 0x066A)
			return ET;
		else if (/[\u06f0-\u06f9]/.test(ch))
			return EN;			
		else
			return AL;
	} else if (hi == 0x20 && uc <= 0x205F) {
		return UnicodeTBL20[uc & 0xFF];
	} else if (hi == 0xFE) {
		return (uc >= 0xFE70 ? AL : ON);
	}		
	return ON;	
}

function _isArabicDiacritics( ch ) {
	return (ch >= '\u064b' && ch <= '\u0655');
}
exports.L = L;
exports.R = R;
exports.EN = EN;
exports.ON_R = 3;
exports.AN = 4;
exports.R_H = 5;
exports.B = 6;
exports.RLE = 7;

exports.DOT = "\xB7";
exports.doBidiReorder = function(text, textCharTypes, isRtl) {
	if (text.length < 2)
		return {};
		
	var chars = text.split(""), logicalFromVisual = new Array(chars.length),
		bidiLevels = new Array(chars.length), levels = []; 

	dir = isRtl ? RTL : LTR;

	_computeLevels(chars, levels, chars.length, textCharTypes);

	for (var i = 0; i < logicalFromVisual.length; logicalFromVisual[i] = i, i++);

	_invertLevel(2, levels, logicalFromVisual);
	_invertLevel(1, levels, logicalFromVisual);

	for (var i = 0; i < logicalFromVisual.length - 1; i++) { //fix levels to reflect character width
		if (textCharTypes[i] === AN) {
			levels[i] = exports.AN;
		} else if (levels[i] === R && ((textCharTypes[i] > AL && textCharTypes[i] < LRE) 
			|| textCharTypes[i] === ON || textCharTypes[i] === BN)) {
			levels[i] = exports.ON_R;
		} else if ((i > 0 && chars[i - 1] === '\u0644') && /\u0622|\u0623|\u0625|\u0627/.test(chars[i])) {
			levels[i - 1] = levels[i] = exports.R_H;
			i++;
		}
	}
	if (chars[chars.length - 1] === exports.DOT)
		levels[chars.length - 1] = exports.B;
				
	if (chars[0] === '\u202B')
		levels[0] = exports.RLE;
				
	for (var i = 0; i < logicalFromVisual.length; i++) {
		bidiLevels[i] = levels[logicalFromVisual[i]];
	}

	return {'logicalFromVisual': logicalFromVisual, 'bidiLevels': bidiLevels};
};
exports.hasBidiCharacters = function(text, textCharTypes){
	var ret = false;
	for (var i = 0; i < text.length; i++){
		textCharTypes[i] = _getCharacterType(text.charAt(i));
		if (!ret && (textCharTypes[i] == R || textCharTypes[i] == AL || textCharTypes[i] == AN))
			ret = true;
	}
	return ret;
};	
exports.getVisualFromLogicalIdx = function(logIdx, rowMap) {
	for (var i = 0; i < rowMap.logicalFromVisual.length; i++) {
		if (rowMap.logicalFromVisual[i] == logIdx)
			return i;
	}
	return 0;
};

});

ace.define("ace/bidihandler",["require","exports","module","ace/lib/bidiutil","ace/lib/lang"], function(require, exports, module) {
"use strict";

var bidiUtil = require("./lib/bidiutil");
var lang = require("./lib/lang");
var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/;
var BidiHandler = function(session) {
    this.session = session;
    this.bidiMap = {};
    this.currentRow = null;
    this.bidiUtil = bidiUtil;
    this.charWidths = [];
    this.EOL = "\xAC";
    this.showInvisibles = true;
    this.isRtlDir = false;
    this.$isRtl = false;
    this.line = "";
    this.wrapIndent = 0;
    this.EOF = "\xB6";
    this.RLE = "\u202B";
    this.contentWidth = 0;
    this.fontMetrics = null;
    this.rtlLineOffset = 0;
    this.wrapOffset = 0;
    this.isMoveLeftOperation = false;
    this.seenBidi = bidiRE.test(session.getValue());
};

(function() {
    this.isBidiRow = function(screenRow, docRow, splitIndex) {
        if (!this.seenBidi)
            return false;
        if (screenRow !== this.currentRow) {
            this.currentRow = screenRow;
            this.updateRowLine(docRow, splitIndex);
            this.updateBidiMap();
        }
        return this.bidiMap.bidiLevels;
    };

    this.onChange = function(delta) {
        if (!this.seenBidi) {
            if (delta.action == "insert" && bidiRE.test(delta.lines.join("\n"))) {
                this.seenBidi = true;
                this.currentRow = null;
            }
        } 
        else {
            this.currentRow = null;
        }
    };

    this.getDocumentRow = function() {
        var docRow = 0;
        var rowCache = this.session.$screenRowCache;
        if (rowCache.length) {
            var index = this.session.$getRowCacheIndex(rowCache, this.currentRow);
            if (index >= 0)
                docRow = this.session.$docRowCache[index];
        }

        return docRow;
    };

    this.getSplitIndex = function() {
        var splitIndex = 0;
        var rowCache = this.session.$screenRowCache;
        if (rowCache.length) {
            var currentIndex, prevIndex = this.session.$getRowCacheIndex(rowCache, this.currentRow);
            while (this.currentRow - splitIndex > 0) {
                currentIndex = this.session.$getRowCacheIndex(rowCache, this.currentRow - splitIndex - 1);
                if (currentIndex !== prevIndex)
                    break;

                prevIndex = currentIndex;
                splitIndex++;
            }
        } else {
            splitIndex = this.currentRow;
        }

        return splitIndex;
    };

    this.updateRowLine = function(docRow, splitIndex) {
        if (docRow === undefined)
            docRow = this.getDocumentRow();
            
        var isLastRow = (docRow === this.session.getLength() - 1),
            endOfLine = isLastRow ? this.EOF : this.EOL;

        this.wrapIndent = 0;
        this.line = this.session.getLine(docRow);
        this.isRtlDir = this.$isRtl || this.line.charAt(0) === this.RLE;
        if (this.session.$useWrapMode) {
            var splits = this.session.$wrapData[docRow];
            if (splits) {
                if (splitIndex === undefined)
                    splitIndex = this.getSplitIndex();

                if(splitIndex > 0 && splits.length) {
                    this.wrapIndent = splits.indent;
                    this.wrapOffset = this.wrapIndent * this.charWidths[bidiUtil.L];
                    this.line = (splitIndex < splits.length) ?
                        this.line.substring(splits[splitIndex - 1], splits[splitIndex]) :
                            this.line.substring(splits[splits.length - 1]);
                } else {
                    this.line = this.line.substring(0, splits[splitIndex]);
                }
            }
            if (splitIndex == splits.length)
                this.line += (this.showInvisibles) ? endOfLine : bidiUtil.DOT;
        } else {
            this.line += this.showInvisibles ? endOfLine : bidiUtil.DOT;
        }
        var session = this.session, shift = 0, size;
        this.line = this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g, function(ch, i){
            if (ch === '\t' || session.isFullWidth(ch.charCodeAt(0))) {
                size = (ch === '\t') ? session.getScreenTabSize(i + shift) : 2;
                shift += size - 1;
                return lang.stringRepeat(bidiUtil.DOT, size);
            }
            return ch;
        });

        if (this.isRtlDir) {
            this.fontMetrics.$main.textContent = (this.line.charAt(this.line.length - 1) == bidiUtil.DOT) ? this.line.substr(0, this.line.length - 1) : this.line;
            this.rtlLineOffset = this.contentWidth - this.fontMetrics.$main.getBoundingClientRect().width;
        }
    };
    
    this.updateBidiMap = function() {
        var textCharTypes = [];
        if (bidiUtil.hasBidiCharacters(this.line, textCharTypes) || this.isRtlDir) {
             this.bidiMap = bidiUtil.doBidiReorder(this.line, textCharTypes, this.isRtlDir);
        } else {
            this.bidiMap = {};
        }
    };
    this.markAsDirty = function() {
        this.currentRow = null;
    };
    this.updateCharacterWidths = function(fontMetrics) {
        if (this.characterWidth === fontMetrics.$characterSize.width)
            return;

        this.fontMetrics = fontMetrics;
        var characterWidth = this.characterWidth = fontMetrics.$characterSize.width;
        var bidiCharWidth = fontMetrics.$measureCharWidth("\u05d4");

        this.charWidths[bidiUtil.L] = this.charWidths[bidiUtil.EN] = this.charWidths[bidiUtil.ON_R] = characterWidth;
        this.charWidths[bidiUtil.R] = this.charWidths[bidiUtil.AN] = bidiCharWidth;
        this.charWidths[bidiUtil.R_H] = bidiCharWidth * 0.45;
        this.charWidths[bidiUtil.B] = this.charWidths[bidiUtil.RLE] = 0;

        this.currentRow = null;
    };

    this.setShowInvisibles = function(showInvisibles) {
        this.showInvisibles = showInvisibles;
        this.currentRow = null;
    };

    this.setEolChar = function(eolChar) {
        this.EOL = eolChar; 
    };

    this.setContentWidth = function(width) {
        this.contentWidth = width;
    };

    this.isRtlLine = function(row) {
        if (this.$isRtl) return true;
        if (row != undefined)
            return (this.session.getLine(row).charAt(0) == this.RLE);
        else
            return this.isRtlDir; 
    };

    this.setRtlDirection = function(editor, isRtlDir) {
        var cursor = editor.getCursorPosition(); 
        for (var row = editor.selection.getSelectionAnchor().row; row <= cursor.row; row++) {
            if (!isRtlDir && editor.session.getLine(row).charAt(0) === editor.session.$bidiHandler.RLE)
                editor.session.doc.removeInLine(row, 0, 1);
            else if (isRtlDir && editor.session.getLine(row).charAt(0) !== editor.session.$bidiHandler.RLE)
                editor.session.doc.insert({column: 0, row: row}, editor.session.$bidiHandler.RLE);
        }
    };
    this.getPosLeft = function(col) {
        col -= this.wrapIndent;
        var leftBoundary = (this.line.charAt(0) === this.RLE) ? 1 : 0;
        var logicalIdx = (col > leftBoundary) ? (this.session.getOverwrite() ? col : col - 1) : leftBoundary;
        var visualIdx = bidiUtil.getVisualFromLogicalIdx(logicalIdx, this.bidiMap),
            levels = this.bidiMap.bidiLevels, left = 0;

        if (!this.session.getOverwrite() && col <= leftBoundary && levels[visualIdx] % 2 !== 0)
            visualIdx++;
            
        for (var i = 0; i < visualIdx; i++) {
            left += this.charWidths[levels[i]];
        }

        if (!this.session.getOverwrite() && (col > leftBoundary) && (levels[visualIdx] % 2 === 0))
            left += this.charWidths[levels[visualIdx]];

        if (this.wrapIndent)
            left += this.isRtlDir ? (-1 * this.wrapOffset) : this.wrapOffset;

        if (this.isRtlDir)
            left += this.rtlLineOffset;

        return left;
    };
    this.getSelections = function(startCol, endCol) {
        var map = this.bidiMap, levels = map.bidiLevels, level, selections = [], offset = 0,
            selColMin = Math.min(startCol, endCol) - this.wrapIndent, selColMax = Math.max(startCol, endCol) - this.wrapIndent,
                isSelected = false, isSelectedPrev = false, selectionStart = 0;
            
        if (this.wrapIndent)
            offset += this.isRtlDir ? (-1 * this.wrapOffset) : this.wrapOffset;

        for (var logIdx, visIdx = 0; visIdx < levels.length; visIdx++) {
            logIdx = map.logicalFromVisual[visIdx];
            level = levels[visIdx];
            isSelected = (logIdx >= selColMin) && (logIdx < selColMax);
            if (isSelected && !isSelectedPrev) {
                selectionStart = offset;
            } else if (!isSelected && isSelectedPrev) {
                selections.push({left: selectionStart, width: offset - selectionStart});
            }
            offset += this.charWidths[level];
            isSelectedPrev = isSelected;
        }

        if (isSelected && (visIdx === levels.length)) {
            selections.push({left: selectionStart, width: offset - selectionStart});
        }

        if(this.isRtlDir) {
            for (var i = 0; i < selections.length; i++) {
                selections[i].left += this.rtlLineOffset;
            }
        }
        return selections;
    };
    this.offsetToCol = function(posX) {
        if(this.isRtlDir)
            posX -= this.rtlLineOffset;

        var logicalIdx = 0, posX = Math.max(posX, 0),
            offset = 0, visualIdx = 0, levels = this.bidiMap.bidiLevels,
                charWidth = this.charWidths[levels[visualIdx]];

        if (this.wrapIndent)
           posX -= this.isRtlDir ? (-1 * this.wrapOffset) : this.wrapOffset;
    
        while(posX > offset + charWidth/2) {
            offset += charWidth;
            if(visualIdx === levels.length - 1) {
                charWidth = 0;
                break;
            }
            charWidth = this.charWidths[levels[++visualIdx]];
        }
    
        if (visualIdx > 0 && (levels[visualIdx - 1] % 2 !== 0) && (levels[visualIdx] % 2 === 0)){
            if(posX < offset)
                visualIdx--;
            logicalIdx = this.bidiMap.logicalFromVisual[visualIdx];

        } else if (visualIdx > 0 && (levels[visualIdx - 1] % 2 === 0) && (levels[visualIdx] % 2 !== 0)){
            logicalIdx = 1 + ((posX > offset) ? this.bidiMap.logicalFromVisual[visualIdx]
                    : this.bidiMap.logicalFromVisual[visualIdx - 1]);

        } else if ((this.isRtlDir && visualIdx === levels.length - 1 && charWidth === 0 && (levels[visualIdx - 1] % 2 === 0))
                || (!this.isRtlDir && visualIdx === 0 && (levels[visualIdx] % 2 !== 0))){
            logicalIdx = 1 + this.bidiMap.logicalFromVisual[visualIdx];
        } else {
            if (visualIdx > 0 && (levels[visualIdx - 1] % 2 !== 0) && charWidth !== 0)
                visualIdx--;
            logicalIdx = this.bidiMap.logicalFromVisual[visualIdx];
        }

        if (logicalIdx === 0 && this.isRtlDir)
            logicalIdx++;

        return (logicalIdx + this.wrapIndent);
    };

}).call(BidiHandler.prototype);

exports.BidiHandler = BidiHandler;
});

ace.define("ace/selection",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/lib/event_emitter","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;
var Selection = function(session) {
    this.session = session;
    this.doc = session.getDocument();

    this.clearSelection();
    this.cursor = this.lead = this.doc.createAnchor(0, 0);
    this.anchor = this.doc.createAnchor(0, 0);
    this.$silent = false;

    var self = this;
    this.cursor.on("change", function(e) {
        self.$cursorChanged = true;
        if (!self.$silent)
            self._emit("changeCursor");
        if (!self.$isEmpty && !self.$silent)
            self._emit("changeSelection");
        if (!self.$keepDesiredColumnOnChange && e.old.column != e.value.column)
            self.$desiredColumn = null;
    });

    this.anchor.on("change", function() {
        self.$anchorChanged = true;
        if (!self.$isEmpty && !self.$silent)
            self._emit("changeSelection");
    });
};

(function() {

    oop.implement(this, EventEmitter);
    this.isEmpty = function() {
        return this.$isEmpty || (
            this.anchor.row == this.lead.row &&
            this.anchor.column == this.lead.column
        );
    };
    this.isMultiLine = function() {
        return !this.$isEmpty && this.anchor.row != this.cursor.row;
    };
    this.getCursor = function() {
        return this.lead.getPosition();
    };
    this.setSelectionAnchor = function(row, column) {
        this.$isEmpty = false;
        this.anchor.setPosition(row, column);
    };
    this.getAnchor = 
    this.getSelectionAnchor = function() {
        if (this.$isEmpty)
            return this.getSelectionLead();
        
        return this.anchor.getPosition();
    };
    this.getSelectionLead = function() {
        return this.lead.getPosition();
    };
    this.isBackwards = function() {
        var anchor = this.anchor;
        var lead = this.lead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };
    this.getRange = function() {
        var anchor = this.anchor;
        var lead = this.lead;

        if (this.$isEmpty)
            return Range.fromPoints(lead, lead);

        return this.isBackwards()
            ? Range.fromPoints(lead, anchor)
            : Range.fromPoints(anchor, lead);
    };
    this.clearSelection = function() {
        if (!this.$isEmpty) {
            this.$isEmpty = true;
            this._emit("changeSelection");
        }
    };
    this.selectAll = function() {
        this.$setSelection(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    };
    this.setRange =
    this.setSelectionRange = function(range, reverse) {
        var start = reverse ? range.end : range.start;
        var end = reverse ? range.start : range.end;
        this.$setSelection(start.row, start.column, end.row, end.column);
    };

    this.$setSelection = function(anchorRow, anchorColumn, cursorRow, cursorColumn) {
        var wasEmpty = this.$isEmpty;
        var wasMultiselect = this.inMultiSelectMode;
        this.$silent = true;
        this.$cursorChanged = this.$anchorChanged = false;
        this.anchor.setPosition(anchorRow, anchorColumn);
        this.cursor.setPosition(cursorRow, cursorColumn);
        this.$isEmpty = !Range.comparePoints(this.anchor, this.cursor);
        this.$silent = false;
        if (this.$cursorChanged)
            this._emit("changeCursor");
        if (this.$cursorChanged || this.$anchorChanged || wasEmpty != this.$isEmpty || wasMultiselect)
            this._emit("changeSelection");
    };

    this.$moveSelection = function(mover) {
        var lead = this.lead;
        if (this.$isEmpty)
            this.setSelectionAnchor(lead.row, lead.column);

        mover.call(this);
    };
    this.selectTo = function(row, column) {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };
    this.selectToPosition = function(pos) {
        this.$moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };
    this.moveTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };
    this.moveToPosition = function(pos) {
        this.clearSelection();
        this.moveCursorToPosition(pos);
    };
    this.selectUp = function() {
        this.$moveSelection(this.moveCursorUp);
    };
    this.selectDown = function() {
        this.$moveSelection(this.moveCursorDown);
    };
    this.selectRight = function() {
        this.$moveSelection(this.moveCursorRight);
    };
    this.selectLeft = function() {
        this.$moveSelection(this.moveCursorLeft);
    };
    this.selectLineStart = function() {
        this.$moveSelection(this.moveCursorLineStart);
    };
    this.selectLineEnd = function() {
        this.$moveSelection(this.moveCursorLineEnd);
    };
    this.selectFileEnd = function() {
        this.$moveSelection(this.moveCursorFileEnd);
    };
    this.selectFileStart = function() {
        this.$moveSelection(this.moveCursorFileStart);
    };
    this.selectWordRight = function() {
        this.$moveSelection(this.moveCursorWordRight);
    };
    this.selectWordLeft = function() {
        this.$moveSelection(this.moveCursorWordLeft);
    };
    this.getWordRange = function(row, column) {
        if (typeof column == "undefined") {
            var cursor = row || this.lead;
            row = cursor.row;
            column = cursor.column;
        }
        return this.session.getWordRange(row, column);
    };
    this.selectWord = function() {
        this.setSelectionRange(this.getWordRange());
    };
    this.selectAWord = function() {
        var cursor = this.getCursor();
        var range = this.session.getAWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    };

    this.getLineRange = function(row, excludeLastChar) {
        var rowStart = typeof row == "number" ? row : this.lead.row;
        var rowEnd;

        var foldLine = this.session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        } else {
            rowEnd = rowStart;
        }
        if (excludeLastChar === true)
            return new Range(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length);
        else
            return new Range(rowStart, 0, rowEnd + 1, 0);
    };
    this.selectLine = function() {
        this.setSelectionRange(this.getLineRange());
    };
    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };
    this.moveCursorDown = function() {
        this.moveCursorBy(1, 0);
    };
    this.wouldMoveIntoSoftTab = function(cursor, tabSize, direction) {
        var start = cursor.column;
        var end = cursor.column + tabSize;

        if (direction < 0) {
            start = cursor.column - tabSize;
            end = cursor.column;
        }
        return this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(start, end).split(" ").length-1 == tabSize;
    };
    this.moveCursorLeft = function() {
        var cursor = this.lead.getPosition(),
            fold;

        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        } else if (cursor.column === 0) {
            if (cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            if (this.wouldMoveIntoSoftTab(cursor, tabSize, -1) && !this.session.getNavigateWithinSoftTabs()) {
                this.moveCursorBy(0, -tabSize);
            } else {
                this.moveCursorBy(0, -1);
            }
        }
    };
    this.moveCursorRight = function() {
        var cursor = this.lead.getPosition(),
            fold;
        if (fold = this.session.getFoldAt(cursor.row, cursor.column, 1)) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        }
        else if (this.lead.column == this.doc.getLine(this.lead.row).length) {
            if (this.lead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.lead.row + 1, 0);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            var cursor = this.lead;
            if (this.wouldMoveIntoSoftTab(cursor, tabSize, 1) && !this.session.getNavigateWithinSoftTabs()) {
                this.moveCursorBy(0, tabSize);
            } else {
                this.moveCursorBy(0, 1);
            }
        }
    };
    this.moveCursorLineStart = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var screenRow = this.session.documentToScreenRow(row, column);
        var firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0);
        var beforeCursor = this.session.getDisplayLine(
            row, null, firstColumnPosition.row,
            firstColumnPosition.column
        );

        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length != column && !this.session.$useEmacsStyleLineStart)
            firstColumnPosition.column += leadingSpace[0].length;
        this.moveCursorToPosition(firstColumnPosition);
    };
    this.moveCursorLineEnd = function() {
        var lead = this.lead;
        var lineEnd = this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        if (this.lead.column == lineEnd.column) {
            var line = this.session.getLine(lineEnd.row);
            if (lineEnd.column == line.length) {
                var textEnd = line.search(/\s+$/);
                if (textEnd > 0)
                    lineEnd.column = textEnd;
            }
        }

        this.moveCursorTo(lineEnd.row, lineEnd.column);
    };
    this.moveCursorFileEnd = function() {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };
    this.moveCursorFileStart = function() {
        this.moveCursorTo(0, 0);
    };
    this.moveCursorLongWordRight = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
            return;
        }
        if (this.session.nonTokenRe.exec(rightOfCursor)) {
            column += this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
            rightOfCursor = line.substring(column);
        }
        if (column >= line.length) {
            this.moveCursorTo(row, line.length);
            this.moveCursorRight();
            if (row < this.doc.getLength() - 1)
                this.moveCursorWordRight();
            return;
        }
        if (this.session.tokenRe.exec(rightOfCursor)) {
            column += this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };
    this.moveCursorLongWordLeft = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var fold;
        if (fold = this.session.getFoldAt(row, column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
            return;
        }

        var str = this.session.getFoldStringAt(row, column, -1);
        if (str == null) {
            str = this.doc.getLine(row).substring(0, column);
        }

        var leftOfCursor = lang.stringReverse(str);
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;
        if (this.session.nonTokenRe.exec(leftOfCursor)) {
            column -= this.session.nonTokenRe.lastIndex;
            leftOfCursor = leftOfCursor.slice(this.session.nonTokenRe.lastIndex);
            this.session.nonTokenRe.lastIndex = 0;
        }
        if (column <= 0) {
            this.moveCursorTo(row, 0);
            this.moveCursorLeft();
            if (row > 0)
                this.moveCursorWordLeft();
            return;
        }
        if (this.session.tokenRe.exec(leftOfCursor)) {
            column -= this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.$shortWordEndIndex = function(rightOfCursor) {
        var index = 0, ch;
        var whitespaceRe = /\s/;
        var tokenRe = this.session.tokenRe;

        tokenRe.lastIndex = 0;
        if (this.session.tokenRe.exec(rightOfCursor)) {
            index = this.session.tokenRe.lastIndex;
        } else {
            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                index ++;

            if (index < 1) {
                tokenRe.lastIndex = 0;
                 while ((ch = rightOfCursor[index]) && !tokenRe.test(ch)) {
                    tokenRe.lastIndex = 0;
                    index ++;
                    if (whitespaceRe.test(ch)) {
                        if (index > 2) {
                            index--;
                            break;
                        } else {
                            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                                index ++;
                            if (index > 2)
                                break;
                        }
                    }
                }
            }
        }
        tokenRe.lastIndex = 0;

        return index;
    };

    this.moveCursorShortWordRight = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var fold = this.session.getFoldAt(row, column, 1);
        if (fold)
            return this.moveCursorTo(fold.end.row, fold.end.column);

        if (column == line.length) {
            var l = this.doc.getLength();
            do {
                row++;
                rightOfCursor = this.doc.getLine(row);
            } while (row < l && /^\s*$/.test(rightOfCursor));

            if (!/^\s+/.test(rightOfCursor))
                rightOfCursor = "";
            column = 0;
        }

        var index = this.$shortWordEndIndex(rightOfCursor);

        this.moveCursorTo(row, column + index);
    };

    this.moveCursorShortWordLeft = function() {
        var row = this.lead.row;
        var column = this.lead.column;

        var fold;
        if (fold = this.session.getFoldAt(row, column, -1))
            return this.moveCursorTo(fold.start.row, fold.start.column);

        var line = this.session.getLine(row).substring(0, column);
        if (column === 0) {
            do {
                row--;
                line = this.doc.getLine(row);
            } while (row > 0 && /^\s*$/.test(line));

            column = line.length;
            if (!/\s+$/.test(line))
                line = "";
        }

        var leftOfCursor = lang.stringReverse(line);
        var index = this.$shortWordEndIndex(leftOfCursor);

        return this.moveCursorTo(row, column - index);
    };

    this.moveCursorWordRight = function() {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordRight();
        else
            this.moveCursorShortWordRight();
    };

    this.moveCursorWordLeft = function() {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordLeft();
        else
            this.moveCursorShortWordLeft();
    };
    this.moveCursorBy = function(rows, chars) {
        var screenPos = this.session.documentToScreenPosition(
            this.lead.row,
            this.lead.column
        );

        var offsetX;

        if (chars === 0) {
            if (rows !== 0) {
                if (this.session.$bidiHandler.isBidiRow(screenPos.row, this.lead.row)) {
                    offsetX = this.session.$bidiHandler.getPosLeft(screenPos.column);
                    screenPos.column = Math.round(offsetX / this.session.$bidiHandler.charWidths[0]);
                } else {
                    offsetX = screenPos.column * this.session.$bidiHandler.charWidths[0];
                }
            }

            if (this.$desiredColumn)
                screenPos.column = this.$desiredColumn;
            else
                this.$desiredColumn = screenPos.column;
        }

        var docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenPos.column, offsetX);
        
        if (rows !== 0 && chars === 0 && docPos.row === this.lead.row && docPos.column === this.lead.column) {
            if (this.session.lineWidgets && this.session.lineWidgets[docPos.row]) {
                if (docPos.row > 0 || rows > 0)
                    docPos.row++;
            }
        }
        this.moveCursorTo(docPos.row, docPos.column + chars, chars === 0);
    };
    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };
    this.moveCursorTo = function(row, column, keepDesiredColumn) {
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }

        this.$keepDesiredColumnOnChange = true;
        var line = this.session.getLine(row);
        if (/[\uDC00-\uDFFF]/.test(line.charAt(column)) && line.charAt(column - 1)) {
            if (this.lead.row == row && this.lead.column == column + 1)
                column = column - 1;
            else
                column = column + 1;
        }
        this.lead.setPosition(row, column);
        this.$keepDesiredColumnOnChange = false;

        if (!keepDesiredColumn)
            this.$desiredColumn = null;
    };
    this.moveCursorToScreen = function(row, column, keepDesiredColumn) {
        var pos = this.session.screenToDocumentPosition(row, column);
        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
    };
    this.detach = function() {
        this.lead.detach();
        this.anchor.detach();
        this.session = this.doc = null;
    };

    this.fromOrientedRange = function(range) {
        this.setSelectionRange(range, range.cursor == range.start);
        this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
    };

    this.toOrientedRange = function(range) {
        var r = this.getRange();
        if (range) {
            range.start.column = r.start.column;
            range.start.row = r.start.row;
            range.end.column = r.end.column;
            range.end.row = r.end.row;
        } else {
            range = r;
        }

        range.cursor = this.isBackwards() ? range.start : range.end;
        range.desiredColumn = this.$desiredColumn;
        return range;
    };
    this.getRangeOfMovements = function(func) {
        var start = this.getCursor();
        try {
            func(this);
            var end = this.getCursor();
            return Range.fromPoints(start, end);
        } catch(e) {
            return Range.fromPoints(start, start);
        } finally {
            this.moveCursorToPosition(start);
        }
    };

    this.toJSON = function() {
        if (this.rangeCount) {
            var data = this.ranges.map(function(r) {
                var r1 = r.clone();
                r1.isBackwards = r.cursor == r.start;
                return r1;
            });
        } else {
            var data = this.getRange();
            data.isBackwards = this.isBackwards();
        }
        return data;
    };

    this.fromJSON = function(data) {
        if (data.start == undefined) {
            if (this.rangeList) {
                this.toSingleRange(data[0]);
                for (var i = data.length; i--; ) {
                    var r = Range.fromPoints(data[i].start, data[i].end);
                    if (data[i].isBackwards)
                        r.cursor = r.start;
                    this.addRange(r, true);
                }
                return;
            } else {
                data = data[0];
            }
        }
        if (this.rangeList)
            this.toSingleRange(data);
        this.setSelectionRange(data, data.isBackwards);
    };

    this.isEqual = function(data) {
        if ((data.length || this.rangeCount) && data.length != this.rangeCount)
            return false;
        if (!data.length || !this.ranges)
            return this.getRange().isEqual(data);

        for (var i = this.ranges.length; i--; ) {
            if (!this.ranges[i].isEqual(data[i]))
                return false;
        }
        return true;
    };

}).call(Selection.prototype);

exports.Selection = Selection;
});

ace.define("ace/tokenizer",["require","exports","module","ace/config"], function(require, exports, module) {
"use strict";

var config = require("./config");
var MAX_TOKEN_COUNT = 2000;
var Tokenizer = function(rules) {
    this.states = rules;

    this.regExps = {};
    this.matchMappings = {};
    for (var key in this.states) {
        var state = this.states[key];
        var ruleRegExps = [];
        var matchTotal = 0;
        var mapping = this.matchMappings[key] = {defaultToken: "text"};
        var flag = "g";

        var splitterRurles = [];
        for (var i = 0; i < state.length; i++) {
            var rule = state[i];
            if (rule.defaultToken)
                mapping.defaultToken = rule.defaultToken;
            if (rule.caseInsensitive)
                flag = "gi";
            if (rule.regex == null)
                continue;

            if (rule.regex instanceof RegExp)
                rule.regex = rule.regex.toString().slice(1, -1);
            var adjustedregex = rule.regex;
            var matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
            if (Array.isArray(rule.token)) {
                if (rule.token.length == 1 || matchcount == 1) {
                    rule.token = rule.token[0];
                } else if (matchcount - 1 != rule.token.length) {
                    this.reportError("number of classes and regexp groups doesn't match", { 
                        rule: rule,
                        groupCount: matchcount - 1
                    });
                    rule.token = rule.token[0];
                } else {
                    rule.tokenArray = rule.token;
                    rule.token = null;
                    rule.onMatch = this.$arrayTokens;
                }
            } else if (typeof rule.token == "function" && !rule.onMatch) {
                if (matchcount > 1)
                    rule.onMatch = this.$applyToken;
                else
                    rule.onMatch = rule.token;
            }

            if (matchcount > 1) {
                if (/\\\d/.test(rule.regex)) {
                    adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function(match, digit) {
                        return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                    });
                } else {
                    matchcount = 1;
                    adjustedregex = this.removeCapturingGroups(rule.regex);
                }
                if (!rule.splitRegex && typeof rule.token != "string")
                    splitterRurles.push(rule); // flag will be known only at the very end
            }

            mapping[matchTotal] = i;
            matchTotal += matchcount;

            ruleRegExps.push(adjustedregex);
            if (!rule.onMatch)
                rule.onMatch = null;
        }
        
        if (!ruleRegExps.length) {
            mapping[0] = 0;
            ruleRegExps.push("$");
        }
        
        splitterRurles.forEach(function(rule) {
            rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
        }, this);

        this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
    }
};

(function() {
    this.$setMaxTokenCount = function(m) {
        MAX_TOKEN_COUNT = m | 0;
    };
    
    this.$applyToken = function(str) {
        var values = this.splitRegex.exec(str).slice(1);
        var types = this.token.apply(this, values);
        if (typeof types === "string")
            return [{type: types, value: str}];

        var tokens = [];
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i]
                };
        }
        return tokens;
    };

    this.$arrayTokens = function(str) {
        if (!str)
            return [];
        var values = this.splitRegex.exec(str);
        if (!values)
            return "text";
        var tokens = [];
        var types = this.tokenArray;
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i + 1])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i + 1]
                };
        }
        return tokens;
    };

    this.removeCapturingGroups = function(src) {
        var r = src.replace(
            /\\.|\[(?:\\.|[^\\\]])*|\(\?[:=!]|(\()/g,
            function(x, y) {return y ? "(?:" : x;}
        );
        return r;
    };

    this.createSplitterRegexp = function(src, flag) {
        if (src.indexOf("(?=") != -1) {
            var stack = 0;
            var inChClass = false;
            var lastCapture = {};
            src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(
                m, esc, parenOpen, parenClose, square, index
            ) {
                if (inChClass) {
                    inChClass = square != "]";
                } else if (square) {
                    inChClass = true;
                } else if (parenClose) {
                    if (stack == lastCapture.stack) {
                        lastCapture.end = index+1;
                        lastCapture.stack = -1;
                    }
                    stack--;
                } else if (parenOpen) {
                    stack++;
                    if (parenOpen.length != 1) {
                        lastCapture.stack = stack;
                        lastCapture.start = index;
                    }
                }
                return m;
            });

            if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
                src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
        }
        if (src.charAt(0) != "^") src = "^" + src;
        if (src.charAt(src.length - 1) != "$") src += "$";
        
        return new RegExp(src, (flag||"").replace("g", ""));
    };
    this.getLineTokens = function(line, startState) {
        if (startState && typeof startState != "string") {
            var stack = startState.slice(0);
            startState = stack[0];
            if (startState === "#tmp") {
                stack.shift();
                startState = stack.shift();
            }
        } else
            var stack = [];

        var currentState = startState || "start";
        var state = this.states[currentState];
        if (!state) {
            currentState = "start";
            state = this.states[currentState];
        }
        var mapping = this.matchMappings[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];
        var lastIndex = 0;
        var matchAttempts = 0;

        var token = {type: null, value: ""};

        while (match = re.exec(line)) {
            var type = mapping.defaultToken;
            var rule = null;
            var value = match[0];
            var index = re.lastIndex;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                if (token.type == type) {
                    token.value += skipped;
                } else {
                    if (token.type)
                        tokens.push(token);
                    token = {type: type, value: skipped};
                }
            }

            for (var i = 0; i < match.length-2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = state[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack, line);
                else
                    type = rule.token;

                if (rule.next) {
                    if (typeof rule.next == "string") {
                        currentState = rule.next;
                    } else {
                        currentState = rule.next(currentState, stack);
                    }
                    
                    state = this.states[currentState];
                    if (!state) {
                        this.reportError("state doesn't exist", currentState);
                        currentState = "start";
                        state = this.states[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                if (rule.consumeLineEnd)
                    lastIndex = index;
                break;
            }

            if (value) {
                if (typeof type === "string") {
                    if ((!rule || rule.merge !== false) && token.type === type) {
                        token.value += value;
                    } else {
                        if (token.type)
                            tokens.push(token);
                        token = {type: type, value: value};
                    }
                } else if (type) {
                    if (token.type)
                        tokens.push(token);
                    token = {type: null, value: ""};
                    for (var i = 0; i < type.length; i++)
                        tokens.push(type[i]);
                }
            }

            if (lastIndex == line.length)
                break;

            lastIndex = index;

            if (matchAttempts++ > MAX_TOKEN_COUNT) {
                if (matchAttempts > 2 * line.length) {
                    this.reportError("infinite loop with in ace tokenizer", {
                        startState: startState,
                        line: line
                    });
                }
                while (lastIndex < line.length) {
                    if (token.type)
                        tokens.push(token);
                    token = {
                        value: line.substring(lastIndex, lastIndex += 2000),
                        type: "overflow"
                    };
                }
                currentState = "start";
                stack = [];
                break;
            }
        }

        if (token.type)
            tokens.push(token);
        
        if (stack.length > 1) {
            if (stack[0] !== currentState)
                stack.unshift("#tmp", currentState);
        }
        return {
            tokens : tokens,
            state : stack.length ? stack : currentState
        };
    };
    
    this.reportError = config.reportError;
    
}).call(Tokenizer.prototype);

exports.Tokenizer = Tokenizer;
});

ace.define("ace/mode/text_highlight_rules",["require","exports","module","ace/lib/lang"], function(require, exports, module) {
"use strict";

var lang = require("../lib/lang");

var TextHighlightRules = function() {

    this.$rules = {
        "start" : [{
            token : "empty_line",
            regex : '^$'
        }, {
            defaultToken : "text"
        }]
    };
};

(function() {

    this.addRules = function(rules, prefix) {
        if (!prefix) {
            for (var key in rules)
                this.$rules[key] = rules[key];
            return;
        }
        for (var key in rules) {
            var state = rules[key];
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.next || rule.onMatch) {
                    if (typeof rule.next == "string") {
                        if (rule.next.indexOf(prefix) !== 0)
                            rule.next = prefix + rule.next;
                    }
                    if (rule.nextState && rule.nextState.indexOf(prefix) !== 0)
                        rule.nextState = prefix + rule.nextState;
                }
            }
            this.$rules[prefix + key] = state;
        }
    };

    this.getRules = function() {
        return this.$rules;
    };

    this.embedRules = function (HighlightRules, prefix, escapeRules, states, append) {
        var embedRules = typeof HighlightRules == "function"
            ? new HighlightRules().getRules()
            : HighlightRules;
        if (states) {
            for (var i = 0; i < states.length; i++)
                states[i] = prefix + states[i];
        } else {
            states = [];
            for (var key in embedRules)
                states.push(prefix + key);
        }

        this.addRules(embedRules, prefix);

        if (escapeRules) {
            var addRules = Array.prototype[append ? "push" : "unshift"];
            for (var i = 0; i < states.length; i++)
                addRules.apply(this.$rules[states[i]], lang.deepCopy(escapeRules));
        }

        if (!this.$embeds)
            this.$embeds = [];
        this.$embeds.push(prefix);
    };

    this.getEmbeds = function() {
        return this.$embeds;
    };

    var pushState = function(currentState, stack) {
        if (currentState != "start" || stack.length)
            stack.unshift(this.nextState, currentState);
        return this.nextState;
    };
    var popState = function(currentState, stack) {
        stack.shift();
        return stack.shift() || "start";
    };

    this.normalizeRules = function() {
        var id = 0;
        var rules = this.$rules;
        function processState(key) {
            var state = rules[key];
            state.processed = true;
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                var toInsert = null;
                if (Array.isArray(rule)) {
                    toInsert = rule;
                    rule = {};
                }
                if (!rule.regex && rule.start) {
                    rule.regex = rule.start;
                    if (!rule.next)
                        rule.next = [];
                    rule.next.push({
                        defaultToken: rule.token
                    }, {
                        token: rule.token + ".end",
                        regex: rule.end || rule.start,
                        next: "pop"
                    });
                    rule.token = rule.token + ".start";
                    rule.push = true;
                }
                var next = rule.next || rule.push;
                if (next && Array.isArray(next)) {
                    var stateName = rule.stateName;
                    if (!stateName)  {
                        stateName = rule.token;
                        if (typeof stateName != "string")
                            stateName = stateName[0] || "";
                        if (rules[stateName])
                            stateName += id++;
                    }
                    rules[stateName] = next;
                    rule.next = stateName;
                    processState(stateName);
                } else if (next == "pop") {
                    rule.next = popState;
                }

                if (rule.push) {
                    rule.nextState = rule.next || rule.push;
                    rule.next = pushState;
                    delete rule.push;
                }

                if (rule.rules) {
                    for (var r in rule.rules) {
                        if (rules[r]) {
                            if (rules[r].push)
                                rules[r].push.apply(rules[r], rule.rules[r]);
                        } else {
                            rules[r] = rule.rules[r];
                        }
                    }
                }
                var includeName = typeof rule == "string" ? rule : rule.include;
                if (includeName) {
                    if (Array.isArray(includeName))
                        toInsert = includeName.map(function(x) { return rules[x]; });
                    else
                        toInsert = rules[includeName];
                }

                if (toInsert) {
                    var args = [i, 1].concat(toInsert);
                    if (rule.noEscape)
                        args = args.filter(function(x) {return !x.next;});
                    state.splice.apply(state, args);
                    i--;
                }
                
                if (rule.keywordMap) {
                    rule.token = this.createKeywordMapper(
                        rule.keywordMap, rule.defaultToken || "text", rule.caseInsensitive
                    );
                    delete rule.defaultToken;
                }
            }
        }
        Object.keys(rules).forEach(processState, this);
    };

    this.createKeywordMapper = function(map, defaultToken, ignoreCase, splitChar) {
        var keywords = Object.create(null);
        Object.keys(map).forEach(function(className) {
            var a = map[className];
            if (ignoreCase)
                a = a.toLowerCase();
            var list = a.split(splitChar || "|");
            for (var i = list.length; i--; )
                keywords[list[i]] = className;
        });
        if (Object.getPrototypeOf(keywords)) {
            keywords.__proto__ = null;
        }
        this.$keywordList = Object.keys(keywords);
        map = null;
        return ignoreCase
            ? function(value) {return keywords[value.toLowerCase()] || defaultToken; }
            : function(value) {return keywords[value] || defaultToken; };
    };

    this.getKeywords = function() {
        return this.$keywords;
    };

}).call(TextHighlightRules.prototype);

exports.TextHighlightRules = TextHighlightRules;
});

ace.define("ace/mode/behaviour",["require","exports","module"], function(require, exports, module) {
"use strict";

var Behaviour = function() {
   this.$behaviours = {};
};

(function () {

    this.add = function (name, action, callback) {
        switch (undefined) {
          case this.$behaviours:
              this.$behaviours = {};
          case this.$behaviours[name]:
              this.$behaviours[name] = {};
        }
        this.$behaviours[name][action] = callback;
    };
    
    this.addBehaviours = function (behaviours) {
        for (var key in behaviours) {
            for (var action in behaviours[key]) {
                this.add(key, action, behaviours[key][action]);
            }
        }
    };
    
    this.remove = function (name) {
        if (this.$behaviours && this.$behaviours[name]) {
            delete this.$behaviours[name];
        }
    };
    
    this.inherit = function (mode, filter) {
        if (typeof mode === "function") {
            var behaviours = new mode().getBehaviours(filter);
        } else {
            var behaviours = mode.getBehaviours(filter);
        }
        this.addBehaviours(behaviours);
    };
    
    this.getBehaviours = function (filter) {
        if (!filter) {
            return this.$behaviours;
        } else {
            var ret = {};
            for (var i = 0; i < filter.length; i++) {
                if (this.$behaviours[filter[i]]) {
                    ret[filter[i]] = this.$behaviours[filter[i]];
                }
            }
            return ret;
        }
    };

}).call(Behaviour.prototype);

exports.Behaviour = Behaviour;
});

ace.define("ace/token_iterator",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("./range").Range;
var TokenIterator = function(session, initialRow, initialColumn) {
    this.$session = session;
    this.$row = initialRow;
    this.$rowTokens = session.getTokens(initialRow);

    var token = session.getTokenAt(initialRow, initialColumn);
    this.$tokenIndex = token ? token.index : -1;
};

(function() { 
    this.stepBackward = function() {
        this.$tokenIndex -= 1;
        
        while (this.$tokenIndex < 0) {
            this.$row -= 1;
            if (this.$row < 0) {
                this.$row = 0;
                return null;
            }
                
            this.$rowTokens = this.$session.getTokens(this.$row);
            this.$tokenIndex = this.$rowTokens.length - 1;
        }
            
        return this.$rowTokens[this.$tokenIndex];
    };   
    this.stepForward = function() {
        this.$tokenIndex += 1;
        var rowCount;
        while (this.$tokenIndex >= this.$rowTokens.length) {
            this.$row += 1;
            if (!rowCount)
                rowCount = this.$session.getLength();
            if (this.$row >= rowCount) {
                this.$row = rowCount - 1;
                return null;
            }

            this.$rowTokens = this.$session.getTokens(this.$row);
            this.$tokenIndex = 0;
        }
            
        return this.$rowTokens[this.$tokenIndex];
    };      
    this.getCurrentToken = function () {
        return this.$rowTokens[this.$tokenIndex];
    };      
    this.getCurrentTokenRow = function () {
        return this.$row;
    };     
    this.getCurrentTokenColumn = function() {
        var rowTokens = this.$rowTokens;
        var tokenIndex = this.$tokenIndex;
        var column = rowTokens[tokenIndex].start;
        if (column !== undefined)
            return column;
            
        column = 0;
        while (tokenIndex > 0) {
            tokenIndex -= 1;
            column += rowTokens[tokenIndex].value.length;
        }
        
        return column;  
    };
    this.getCurrentTokenPosition = function() {
        return {row: this.$row, column: this.getCurrentTokenColumn()};
    };
    this.getCurrentTokenRange = function() {
        var token = this.$rowTokens[this.$tokenIndex];
        var column = this.getCurrentTokenColumn();
        return new Range(this.$row, column, this.$row, column + token.value.length);
    };
    
}).call(TokenIterator.prototype);

exports.TokenIterator = TokenIterator;
});

ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Behaviour = require("../behaviour").Behaviour;
var TokenIterator = require("../../token_iterator").TokenIterator;
var lang = require("../../lib/lang");

var SAFE_INSERT_IN_TOKENS =
    ["text", "paren.rparen", "punctuation.operator"];
var SAFE_INSERT_BEFORE_TOKENS =
    ["text", "paren.rparen", "punctuation.operator", "comment"];

var context;
var contextCache = {};
var defaultQuotes = {'"' : '"', "'" : "'"};

var initContext = function(editor) {
    var id = -1;
    if (editor.multiSelect) {
        id = editor.selection.index;
        if (contextCache.rangeCount != editor.multiSelect.rangeCount)
            contextCache = {rangeCount: editor.multiSelect.rangeCount};
    }
    if (contextCache[id])
        return context = contextCache[id];
    context = contextCache[id] = {
        autoInsertedBrackets: 0,
        autoInsertedRow: -1,
        autoInsertedLineEnd: "",
        maybeInsertedBrackets: 0,
        maybeInsertedRow: -1,
        maybeInsertedLineStart: "",
        maybeInsertedLineEnd: ""
    };
};

var getWrapped = function(selection, selected, opening, closing) {
    var rowDiff = selection.end.row - selection.start.row;
    return {
        text: opening + selected + closing,
        selection: [
                0,
                selection.start.column + 1,
                rowDiff,
                selection.end.column + (rowDiff ? 0 : 1)
            ]
    };
};

var CstyleBehaviour = function(options) {
    this.add("braces", "insertion", function(state, action, editor, session, text) {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        if (text == '{') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '{', '}');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode || options && options.braces) {
                    CstyleBehaviour.recordAutoInsert(editor, session, "}");
                    return {
                        text: '{}',
                        selection: [1, 1]
                    };
                } else {
                    CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                    return {
                        text: '{',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == '}') {
            initContext(editor);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == '}') {
                var matching = session.$findOpeningBracket('}', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == "\n" || text == "\r\n") {
            initContext(editor);
            var closing = "";
            if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                closing = lang.stringRepeat("}", context.maybeInsertedBrackets);
                CstyleBehaviour.clearMaybeInsertedClosing();
            }
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar === '}') {
                var openBracePos = session.findMatchingBracket({row: cursor.row, column: cursor.column+1}, '}');
                if (!openBracePos)
                     return null;
                var next_indent = this.$getIndent(session.getLine(openBracePos.row));
            } else if (closing) {
                var next_indent = this.$getIndent(line);
            } else {
                CstyleBehaviour.clearMaybeInsertedClosing();
                return;
            }
            var indent = next_indent + session.getTabString();

            return {
                text: '\n' + indent + '\n' + next_indent + closing,
                selection: [1, indent.length, 1, indent.length]
            };
        } else {
            CstyleBehaviour.clearMaybeInsertedClosing();
        }
    });

    this.add("braces", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '{') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.end.column, range.end.column + 1);
            if (rightChar == '}') {
                range.end.column++;
                return range;
            } else {
                context.maybeInsertedBrackets--;
            }
        }
    });

    this.add("parens", "insertion", function(state, action, editor, session, text) {
        if (text == '(') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '(', ')');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, ")");
                return {
                    text: '()',
                    selection: [1, 1]
                };
            }
        } else if (text == ')') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ')') {
                var matching = session.$findOpeningBracket(')', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("parens", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '(') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ')') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("brackets", "insertion", function(state, action, editor, session, text) {
        if (text == '[') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '[', ']');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, "]");
                return {
                    text: '[]',
                    selection: [1, 1]
                };
            }
        } else if (text == ']') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ']') {
                var matching = session.$findOpeningBracket(']', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("brackets", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '[') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ']') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("string_dquotes", "insertion", function(state, action, editor, session, text) {
        var quotes = session.$mode.$quotes || defaultQuotes;
        if (text.length == 1 && quotes[text]) {
            if (this.lineCommentStart && this.lineCommentStart.indexOf(text) != -1) 
                return;
            initContext(editor);
            var quote = text;
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && (selected.length != 1 || !quotes[selected]) && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, quote, quote);
            } else if (!selected) {
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var leftChar = line.substring(cursor.column-1, cursor.column);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                
                var token = session.getTokenAt(cursor.row, cursor.column);
                var rightToken = session.getTokenAt(cursor.row, cursor.column + 1);
                if (leftChar == "\\" && token && /escape/.test(token.type))
                    return null;
                
                var stringBefore = token && /string|escape/.test(token.type);
                var stringAfter = !rightToken || /string|escape/.test(rightToken.type);
                
                var pair;
                if (rightChar == quote) {
                    pair = stringBefore !== stringAfter;
                    if (pair && /string\.end/.test(rightToken.type))
                        pair = false;
                } else {
                    if (stringBefore && !stringAfter)
                        return null; // wrap string with different quote
                    if (stringBefore && stringAfter)
                        return null; // do not pair quotes inside strings
                    var wordRe = session.$mode.tokenRe;
                    wordRe.lastIndex = 0;
                    var isWordBefore = wordRe.test(leftChar);
                    wordRe.lastIndex = 0;
                    var isWordAfter = wordRe.test(leftChar);
                    if (isWordBefore || isWordAfter)
                        return null; // before or after alphanumeric
                    if (rightChar && !/[\s;,.})\]\\]/.test(rightChar))
                        return null; // there is rightChar and it isn't closing
                    pair = true;
                }
                return {
                    text: pair ? quote + quote : "",
                    selection: [1,1]
                };
            }
        }
    });

    this.add("string_dquotes", "deletion", function(state, action, editor, session, range) {
        var quotes = session.$mode.$quotes || defaultQuotes;

        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && quotes.hasOwnProperty(selected)) {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == selected) {
                range.end.column++;
                return range;
            }
        }
    });

};

    
CstyleBehaviour.isSaneInsertion = function(editor, session) {
    var cursor = editor.getCursorPosition();
    var iterator = new TokenIterator(session, cursor.row, cursor.column);
    if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
        var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
        if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS))
            return false;
    }
    iterator.stepForward();
    return iterator.getCurrentTokenRow() !== cursor.row ||
        this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
};

CstyleBehaviour.$matchTokenType = function(token, types) {
    return types.indexOf(token.type || token) > -1;
};

CstyleBehaviour.recordAutoInsert = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0]))
        context.autoInsertedBrackets = 0;
    context.autoInsertedRow = cursor.row;
    context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
    context.autoInsertedBrackets++;
};

CstyleBehaviour.recordMaybeInsert = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this.isMaybeInsertedClosing(cursor, line))
        context.maybeInsertedBrackets = 0;
    context.maybeInsertedRow = cursor.row;
    context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
    context.maybeInsertedLineEnd = line.substr(cursor.column);
    context.maybeInsertedBrackets++;
};

CstyleBehaviour.isAutoInsertedClosing = function(cursor, line, bracket) {
    return context.autoInsertedBrackets > 0 &&
        cursor.row === context.autoInsertedRow &&
        bracket === context.autoInsertedLineEnd[0] &&
        line.substr(cursor.column) === context.autoInsertedLineEnd;
};

CstyleBehaviour.isMaybeInsertedClosing = function(cursor, line) {
    return context.maybeInsertedBrackets > 0 &&
        cursor.row === context.maybeInsertedRow &&
        line.substr(cursor.column) === context.maybeInsertedLineEnd &&
        line.substr(0, cursor.column) == context.maybeInsertedLineStart;
};

CstyleBehaviour.popAutoInsertedClosing = function() {
    context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
    context.autoInsertedBrackets--;
};

CstyleBehaviour.clearMaybeInsertedClosing = function() {
    if (context) {
        context.maybeInsertedBrackets = 0;
        context.maybeInsertedRow = -1;
    }
};



oop.inherits(CstyleBehaviour, Behaviour);

exports.CstyleBehaviour = CstyleBehaviour;
});

ace.define("ace/unicode",["require","exports","module"], function(require, exports, module) {
"use strict";
var wordChars = [48,9,8,25,5,0,2,25,48,0,11,0,5,0,6,22,2,30,2,457,5,11,15,4,8,0,2,0,18,116,2,1,3,3,9,0,2,2,2,0,2,19,2,82,2,138,2,4,3,155,12,37,3,0,8,38,10,44,2,0,2,1,2,1,2,0,9,26,6,2,30,10,7,61,2,9,5,101,2,7,3,9,2,18,3,0,17,58,3,100,15,53,5,0,6,45,211,57,3,18,2,5,3,11,3,9,2,1,7,6,2,2,2,7,3,1,3,21,2,6,2,0,4,3,3,8,3,1,3,3,9,0,5,1,2,4,3,11,16,2,2,5,5,1,3,21,2,6,2,1,2,1,2,1,3,0,2,4,5,1,3,2,4,0,8,3,2,0,8,15,12,2,2,8,2,2,2,21,2,6,2,1,2,4,3,9,2,2,2,2,3,0,16,3,3,9,18,2,2,7,3,1,3,21,2,6,2,1,2,4,3,8,3,1,3,2,9,1,5,1,2,4,3,9,2,0,17,1,2,5,4,2,2,3,4,1,2,0,2,1,4,1,4,2,4,11,5,4,4,2,2,3,3,0,7,0,15,9,18,2,2,7,2,2,2,22,2,9,2,4,4,7,2,2,2,3,8,1,2,1,7,3,3,9,19,1,2,7,2,2,2,22,2,9,2,4,3,8,2,2,2,3,8,1,8,0,2,3,3,9,19,1,2,7,2,2,2,22,2,15,4,7,2,2,2,3,10,0,9,3,3,9,11,5,3,1,2,17,4,23,2,8,2,0,3,6,4,0,5,5,2,0,2,7,19,1,14,57,6,14,2,9,40,1,2,0,3,1,2,0,3,0,7,3,2,6,2,2,2,0,2,0,3,1,2,12,2,2,3,4,2,0,2,5,3,9,3,1,35,0,24,1,7,9,12,0,2,0,2,0,5,9,2,35,5,19,2,5,5,7,2,35,10,0,58,73,7,77,3,37,11,42,2,0,4,328,2,3,3,6,2,0,2,3,3,40,2,3,3,32,2,3,3,6,2,0,2,3,3,14,2,56,2,3,3,66,5,0,33,15,17,84,13,619,3,16,2,25,6,74,22,12,2,6,12,20,12,19,13,12,2,2,2,1,13,51,3,29,4,0,5,1,3,9,34,2,3,9,7,87,9,42,6,69,11,28,4,11,5,11,11,39,3,4,12,43,5,25,7,10,38,27,5,62,2,28,3,10,7,9,14,0,89,75,5,9,18,8,13,42,4,11,71,55,9,9,4,48,83,2,2,30,14,230,23,280,3,5,3,37,3,5,3,7,2,0,2,0,2,0,2,30,3,52,2,6,2,0,4,2,2,6,4,3,3,5,5,12,6,2,2,6,67,1,20,0,29,0,14,0,17,4,60,12,5,0,4,11,18,0,5,0,3,9,2,0,4,4,7,0,2,0,2,0,2,3,2,10,3,3,6,4,5,0,53,1,2684,46,2,46,2,132,7,6,15,37,11,53,10,0,17,22,10,6,2,6,2,6,2,6,2,6,2,6,2,6,2,6,2,31,48,0,470,1,36,5,2,4,6,1,5,85,3,1,3,2,2,89,2,3,6,40,4,93,18,23,57,15,513,6581,75,20939,53,1164,68,45,3,268,4,27,21,31,3,13,13,1,2,24,9,69,11,1,38,8,3,102,3,1,111,44,25,51,13,68,12,9,7,23,4,0,5,45,3,35,13,28,4,64,15,10,39,54,10,13,3,9,7,22,4,1,5,66,25,2,227,42,2,1,3,9,7,11171,13,22,5,48,8453,301,3,61,3,105,39,6,13,4,6,11,2,12,2,4,2,0,2,1,2,1,2,107,34,362,19,63,3,53,41,11,5,15,17,6,13,1,25,2,33,4,2,134,20,9,8,25,5,0,2,25,12,88,4,5,3,5,3,5,3,2];

var code = 0;
var str = [];
for (var i = 0; i < wordChars.length; i += 2) {
    str.push(code += wordChars[i]);
    if (wordChars[i + 1])
        str.push(45, code += wordChars[i + 1]);
}

exports.wordChars = String.fromCharCode.apply(null, str);

});

ace.define("ace/mode/text",["require","exports","module","ace/config","ace/tokenizer","ace/mode/text_highlight_rules","ace/mode/behaviour/cstyle","ace/unicode","ace/lib/lang","ace/token_iterator","ace/range"], function(require, exports, module) {
"use strict";
var config = require("../config");

var Tokenizer = require("../tokenizer").Tokenizer;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var unicode = require("../unicode");
var lang = require("../lib/lang");
var TokenIterator = require("../token_iterator").TokenIterator;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = TextHighlightRules;
};

(function() {
    this.$defaultBehaviour = new CstyleBehaviour();

    this.tokenRe = new RegExp("^[" + unicode.wordChars + "\\$_]+", "g");

    this.nonTokenRe = new RegExp("^(?:[^" + unicode.wordChars + "\\$_]|\\s])+", "g");

    this.getTokenizer = function() {
        if (!this.$tokenizer) {
            this.$highlightRules = this.$highlightRules || new this.HighlightRules(this.$highlightRuleConfig);
            this.$tokenizer = new Tokenizer(this.$highlightRules.getRules());
        }
        return this.$tokenizer;
    };

    this.lineCommentStart = "";
    this.blockComment = "";

    this.toggleCommentLines = function(state, session, startRow, endRow) {
        var doc = session.doc;

        var ignoreBlankLines = true;
        var shouldRemove = true;
        var minIndent = Infinity;
        var tabSize = session.getTabSize();
        var insertAtTabStop = false;

        if (!this.lineCommentStart) {
            if (!this.blockComment)
                return false;
            var lineCommentStart = this.blockComment.start;
            var lineCommentEnd = this.blockComment.end;
            var regexpStart = new RegExp("^(\\s*)(?:" + lang.escapeRegExp(lineCommentStart) + ")");
            var regexpEnd = new RegExp("(?:" + lang.escapeRegExp(lineCommentEnd) + ")\\s*$");

            var comment = function(line, i) {
                if (testRemove(line, i))
                    return;
                if (!ignoreBlankLines || /\S/.test(line)) {
                    doc.insertInLine({row: i, column: line.length}, lineCommentEnd);
                    doc.insertInLine({row: i, column: minIndent}, lineCommentStart);
                }
            };

            var uncomment = function(line, i) {
                var m;
                if (m = line.match(regexpEnd))
                    doc.removeInLine(i, line.length - m[0].length, line.length);
                if (m = line.match(regexpStart))
                    doc.removeInLine(i, m[1].length, m[0].length);
            };

            var testRemove = function(line, row) {
                if (regexpStart.test(line))
                    return true;
                var tokens = session.getTokens(row);
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].type === "comment")
                        return true;
                }
            };
        } else {
            if (Array.isArray(this.lineCommentStart)) {
                var regexpStart = this.lineCommentStart.map(lang.escapeRegExp).join("|");
                var lineCommentStart = this.lineCommentStart[0];
            } else {
                var regexpStart = lang.escapeRegExp(this.lineCommentStart);
                var lineCommentStart = this.lineCommentStart;
            }
            regexpStart = new RegExp("^(\\s*)(?:" + regexpStart + ") ?");
            
            insertAtTabStop = session.getUseSoftTabs();

            var uncomment = function(line, i) {
                var m = line.match(regexpStart);
                if (!m) return;
                var start = m[1].length, end = m[0].length;
                if (!shouldInsertSpace(line, start, end) && m[0][end - 1] == " ")
                    end--;
                doc.removeInLine(i, start, end);
            };
            var commentWithSpace = lineCommentStart + " ";
            var comment = function(line, i) {
                if (!ignoreBlankLines || /\S/.test(line)) {
                    if (shouldInsertSpace(line, minIndent, minIndent))
                        doc.insertInLine({row: i, column: minIndent}, commentWithSpace);
                    else
                        doc.insertInLine({row: i, column: minIndent}, lineCommentStart);
                }
            };
            var testRemove = function(line, i) {
                return regexpStart.test(line);
            };
            
            var shouldInsertSpace = function(line, before, after) {
                var spaces = 0;
                while (before-- && line.charAt(before) == " ")
                    spaces++;
                if (spaces % tabSize != 0)
                    return false;
                var spaces = 0;
                while (line.charAt(after++) == " ")
                    spaces++;
                if (tabSize > 2)
                    return spaces % tabSize != tabSize - 1;
                else
                    return spaces % tabSize == 0;
            };
        }

        function iter(fun) {
            for (var i = startRow; i <= endRow; i++)
                fun(doc.getLine(i), i);
        }


        var minEmptyLength = Infinity;
        iter(function(line, i) {
            var indent = line.search(/\S/);
            if (indent !== -1) {
                if (indent < minIndent)
                    minIndent = indent;
                if (shouldRemove && !testRemove(line, i))
                    shouldRemove = false;
            } else if (minEmptyLength > line.length) {
                minEmptyLength = line.length;
            }
        });

        if (minIndent == Infinity) {
            minIndent = minEmptyLength;
            ignoreBlankLines = false;
            shouldRemove = false;
        }

        if (insertAtTabStop && minIndent % tabSize != 0)
            minIndent = Math.floor(minIndent / tabSize) * tabSize;

        iter(shouldRemove ? uncomment : comment);
    };

    this.toggleBlockComment = function(state, session, range, cursor) {
        var comment = this.blockComment;
        if (!comment)
            return;
        if (!comment.start && comment[0])
            comment = comment[0];

        var iterator = new TokenIterator(session, cursor.row, cursor.column);
        var token = iterator.getCurrentToken();

        var sel = session.selection;
        var initialRange = session.selection.toOrientedRange();
        var startRow, colDiff;

        if (token && /comment/.test(token.type)) {
            var startRange, endRange;
            while (token && /comment/.test(token.type)) {
                var i = token.value.indexOf(comment.start);
                if (i != -1) {
                    var row = iterator.getCurrentTokenRow();
                    var column = iterator.getCurrentTokenColumn() + i;
                    startRange = new Range(row, column, row, column + comment.start.length);
                    break;
                }
                token = iterator.stepBackward();
            }

            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            while (token && /comment/.test(token.type)) {
                var i = token.value.indexOf(comment.end);
                if (i != -1) {
                    var row = iterator.getCurrentTokenRow();
                    var column = iterator.getCurrentTokenColumn() + i;
                    endRange = new Range(row, column, row, column + comment.end.length);
                    break;
                }
                token = iterator.stepForward();
            }
            if (endRange)
                session.remove(endRange);
            if (startRange) {
                session.remove(startRange);
                startRow = startRange.start.row;
                colDiff = -comment.start.length;
            }
        } else {
            colDiff = comment.start.length;
            startRow = range.start.row;
            session.insert(range.end, comment.end);
            session.insert(range.start, comment.start);
        }
        if (initialRange.start.row == startRow)
            initialRange.start.column += colDiff;
        if (initialRange.end.row == startRow)
            initialRange.end.column += colDiff;
        session.selection.fromOrientedRange(initialRange);
    };

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

    this.checkOutdent = function(state, line, input) {
        return false;
    };

    this.autoOutdent = function(state, doc, row) {
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

    this.createWorker = function(session) {
        return null;
    };

    this.createModeDelegates = function (mapping) {
        this.$embeds = [];
        this.$modes = {};
        for (var i in mapping) {
            if (mapping[i]) {
                var Mode = mapping[i];
                var id = Mode.prototype.$id;
                var mode = config.$modes[id];
                if (!mode)
                    config.$modes[id] = mode = new Mode();
                if (!config.$modes[i])
                    config.$modes[i] = mode;
                this.$embeds.push(i);
                this.$modes[i] = mode;
            }
        }

        var delegations = ["toggleBlockComment", "toggleCommentLines", "getNextLineIndent", 
            "checkOutdent", "autoOutdent", "transformAction", "getCompletions"];

        for (var i = 0; i < delegations.length; i++) {
            (function(scope) {
              var functionName = delegations[i];
              var defaultHandler = scope[functionName];
              scope[delegations[i]] = function() {
                  return this.$delegator(functionName, arguments, defaultHandler);
              };
            }(this));
        }
    };

    this.$delegator = function(method, args, defaultHandler) {
        var state = args[0] || "start";
        if (typeof state != "string") {
            if (Array.isArray(state[2])) {
                var language = state[2][state[2].length - 1];
                var mode = this.$modes[language];
                if (mode)
                    return mode[method].apply(mode, [state[1]].concat([].slice.call(args, 1)));
            }
            state = state[0] || "start";
        }
            
        for (var i = 0; i < this.$embeds.length; i++) {
            if (!this.$modes[this.$embeds[i]]) continue;

            var split = state.split(this.$embeds[i]);
            if (!split[0] && split[1]) {
                args[0] = split[1];
                var mode = this.$modes[this.$embeds[i]];
                return mode[method].apply(mode, args);
            }
        }
        var ret = defaultHandler.apply(this, args);
        return defaultHandler ? ret : undefined;
    };

    this.transformAction = function(state, action, editor, session, param) {
        if (this.$behaviour) {
            var behaviours = this.$behaviour.getBehaviours();
            for (var key in behaviours) {
                if (behaviours[key][action]) {
                    var ret = behaviours[key][action].apply(this, arguments);
                    if (ret) {
                        return ret;
                    }
                }
            }
        }
    };
    
    this.getKeywords = function(append) {
        if (!this.completionKeywords) {
            var rules = this.$tokenizer.rules;
            var completionKeywords = [];
            for (var rule in rules) {
                var ruleItr = rules[rule];
                for (var r = 0, l = ruleItr.length; r < l; r++) {
                    if (typeof ruleItr[r].token === "string") {
                        if (/keyword|support|storage/.test(ruleItr[r].token))
                            completionKeywords.push(ruleItr[r].regex);
                    }
                    else if (typeof ruleItr[r].token === "object") {
                        for (var a = 0, aLength = ruleItr[r].token.length; a < aLength; a++) {    
                            if (/keyword|support|storage/.test(ruleItr[r].token[a])) {
                                var rule = ruleItr[r].regex.match(/\(.+?\)/g)[a];
                                completionKeywords.push(rule.substr(1, rule.length - 2));
                            }
                        }
                    }
                }
            }
            this.completionKeywords = completionKeywords;
        }
        if (!append)
            return this.$keywordList;
        return completionKeywords.concat(this.$keywordList || []);
    };
    
    this.$createKeywordList = function() {
        if (!this.$highlightRules)
            this.getTokenizer();
        return this.$keywordList = this.$highlightRules.$keywordList || [];
    };

    this.getCompletions = function(state, session, pos, prefix) {
        var keywords = this.$keywordList || this.$createKeywordList();
        return keywords.map(function(word) {
            return {
                name: word,
                value: word,
                score: 0,
                meta: "keyword"
            };
        });
    };

    this.$id = "ace/mode/text";
}).call(Mode.prototype);

exports.Mode = Mode;
});

ace.define("ace/apply_delta",["require","exports","module"], function(require, exports, module) {
"use strict";

function throwDeltaError(delta, errorText){
    console.log("Invalid Delta:", delta);
    throw "Invalid Delta: " + errorText;
}

function positionInDocument(docLines, position) {
    return position.row    >= 0 && position.row    <  docLines.length &&
           position.column >= 0 && position.column <= docLines[position.row].length;
}

function validateDelta(docLines, delta) {
    if (delta.action != "insert" && delta.action != "remove")
        throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");
    if (!(delta.lines instanceof Array))
        throwDeltaError(delta, "delta.lines must be an Array");
    if (!delta.start || !delta.end)
       throwDeltaError(delta, "delta.start/end must be an present");
    var start = delta.start;
    if (!positionInDocument(docLines, delta.start))
        throwDeltaError(delta, "delta.start must be contained in document");
    var end = delta.end;
    if (delta.action == "remove" && !positionInDocument(docLines, end))
        throwDeltaError(delta, "delta.end must contained in document for 'remove' actions");
    var numRangeRows = end.row - start.row;
    var numRangeLastLineChars = (end.column - (numRangeRows == 0 ? start.column : 0));
    if (numRangeRows != delta.lines.length - 1 || delta.lines[numRangeRows].length != numRangeLastLineChars)
        throwDeltaError(delta, "delta.range must match delta lines");
}

exports.applyDelta = function(docLines, delta, doNotValidate) {
    
    var row = delta.start.row;
    var startColumn = delta.start.column;
    var line = docLines[row] || "";
    switch (delta.action) {
        case "insert":
            var lines = delta.lines;
            if (lines.length === 1) {
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
            } else {
                var args = [row, 1].concat(delta.lines);
                docLines.splice.apply(docLines, args);
                docLines[row] = line.substring(0, startColumn) + docLines[row];
                docLines[row + delta.lines.length - 1] += line.substring(startColumn);
            }
            break;
        case "remove":
            var endColumn = delta.end.column;
            var endRow = delta.end.row;
            if (row === endRow) {
                docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
            } else {
                docLines.splice(
                    row, endRow - row + 1,
                    line.substring(0, startColumn) + docLines[endRow].substring(endColumn)
                );
            }
            break;
    }
};
});

ace.define("ace/anchor",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

var Anchor = exports.Anchor = function(doc, row, column) {
    this.$onChange = this.onChange.bind(this);
    this.attach(doc);
    
    if (typeof column == "undefined")
        this.setPosition(row.row, row.column);
    else
        this.setPosition(row, column);
};

(function() {

    oop.implement(this, EventEmitter);
    this.getPosition = function() {
        return this.$clipPositionToDocument(this.row, this.column);
    };
    this.getDocument = function() {
        return this.document;
    };
    this.$insertRight = false;
    this.onChange = function(delta) {
        if (delta.start.row == delta.end.row && delta.start.row != this.row)
            return;

        if (delta.start.row > this.row)
            return;
            
        var point = $getTransformedPoint(delta, {row: this.row, column: this.column}, this.$insertRight);
        this.setPosition(point.row, point.column, true);
    };
    
    function $pointsInOrder(point1, point2, equalPointsInOrder) {
        var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
        return (point1.row < point2.row) || (point1.row == point2.row && bColIsAfter);
    }
            
    function $getTransformedPoint(delta, point, moveIfEqual) {
        var deltaIsInsert = delta.action == "insert";
        var deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row    - delta.start.row);
        var deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
        var deltaStart = delta.start;
        var deltaEnd = deltaIsInsert ? deltaStart : delta.end; // Collapse insert range.
        if ($pointsInOrder(point, deltaStart, moveIfEqual)) {
            return {
                row: point.row,
                column: point.column
            };
        }
        if ($pointsInOrder(deltaEnd, point, !moveIfEqual)) {
            return {
                row: point.row + deltaRowShift,
                column: point.column + (point.row == deltaEnd.row ? deltaColShift : 0)
            };
        }
        
        return {
            row: deltaStart.row,
            column: deltaStart.column
        };
    }
    this.setPosition = function(row, column, noClip) {
        var pos;
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        } else {
            pos = this.$clipPositionToDocument(row, column);
        }

        if (this.row == pos.row && this.column == pos.column)
            return;

        var old = {
            row: this.row,
            column: this.column
        };

        this.row = pos.row;
        this.column = pos.column;
        this._signal("change", {
            old: old,
            value: pos
        });
    };
    this.detach = function() {
        this.document.removeEventListener("change", this.$onChange);
    };
    this.attach = function(doc) {
        this.document = doc || this.document;
        this.document.on("change", this.$onChange);
    };
    this.$clipPositionToDocument = function(row, column) {
        var pos = {};

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0)
            pos.column = 0;

        return pos;
    };

}).call(Anchor.prototype);

});

ace.define("ace/document",["require","exports","module","ace/lib/oop","ace/apply_delta","ace/lib/event_emitter","ace/range","ace/anchor"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var applyDelta = require("./apply_delta").applyDelta;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;
var Anchor = require("./anchor").Anchor;

var Document = function(textOrLines) {
    this.$lines = [""];
    if (textOrLines.length === 0) {
        this.$lines = [""];
    } else if (Array.isArray(textOrLines)) {
        this.insertMergedLines({row: 0, column: 0}, textOrLines);
    } else {
        this.insert({row: 0, column:0}, textOrLines);
    }
};

(function() {

    oop.implement(this, EventEmitter);
    this.setValue = function(text) {
        var len = this.getLength() - 1;
        this.remove(new Range(0, 0, len, this.getLine(len).length));
        this.insert({row: 0, column: 0}, text);
    };
    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };
    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };
    if ("aaa".split(/a/).length === 0) {
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        };
    } else {
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };
    }


    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        this.$autoNewLine = match ? match[1] : "\n";
        this._signal("changeNewLineMode");
    };
    this.getNewLineCharacter = function() {
        switch (this.$newLineMode) {
          case "windows":
            return "\r\n";
          case "unix":
            return "\n";
          default:
            return this.$autoNewLine || "\n";
        }
    };

    this.$autoNewLine = "";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
        this._signal("changeNewLineMode");
    };
    this.getNewLineMode = function() {
        return this.$newLineMode;
    };
    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };
    this.getLine = function(row) {
        return this.$lines[row] || "";
    };
    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };
    this.getLength = function() {
        return this.$lines.length;
    };
    this.getTextRange = function(range) {
        return this.getLinesForRange(range).join(this.getNewLineCharacter());
    };
    this.getLinesForRange = function(range) {
        var lines;
        if (range.start.row === range.end.row) {
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
        } else {
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            var l = lines.length - 1;
            if (range.end.row - range.start.row == l)
                lines[l] = lines[l].substring(0, range.end.column);
        }
        return lines;
    };
    this.insertLines = function(row, lines) {
        console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead.");
        return this.insertFullLines(row, lines);
    };
    this.removeLines = function(firstRow, lastRow) {
        console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead.");
        return this.removeFullLines(firstRow, lastRow);
    };
    this.insertNewLine = function(position) {
        console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead.");
        return this.insertMergedLines(position, ["", ""]);
    };
    this.insert = function(position, text) {
        if (this.getLength() <= 1)
            this.$detectNewLine(text);
        
        return this.insertMergedLines(position, this.$split(text));
    };
    this.insertInLine = function(position, text) {
        var start = this.clippedPos(position.row, position.column);
        var end = this.pos(position.row, position.column + text.length);
        
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
        }, true);
        
        return this.clonePos(end);
    };
    
    this.clippedPos = function(row, column) {
        var length = this.getLength();
        if (row === undefined) {
            row = length;
        } else if (row < 0) {
            row = 0;
        } else if (row >= length) {
            row = length - 1;
            column = undefined;
        }
        var line = this.getLine(row);
        if (column == undefined)
            column = line.length;
        column = Math.min(Math.max(column, 0), line.length);
        return {row: row, column: column};
    };
    
    this.clonePos = function(pos) {
        return {row: pos.row, column: pos.column};
    };
    
    this.pos = function(row, column) {
        return {row: row, column: column};
    };
    
    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length - 1).length;
        } else {
            position.row = Math.max(0, position.row);
            position.column = Math.min(Math.max(position.column, 0), this.getLine(position.row).length);
        }
        return position;
    };
    this.insertFullLines = function(row, lines) {
        row = Math.min(Math.max(row, 0), this.getLength());
        var column = 0;
        if (row < this.getLength()) {
            lines = lines.concat([""]);
            column = 0;
        } else {
            lines = [""].concat(lines);
            row--;
            column = this.$lines[row].length;
        }
        this.insertMergedLines({row: row, column: column}, lines);
    };    
    this.insertMergedLines = function(position, lines) {
        var start = this.clippedPos(position.row, position.column);
        var end = {
            row: start.row + lines.length - 1,
            column: (lines.length == 1 ? start.column : 0) + lines[lines.length - 1].length
        };
        
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: lines
        });
        
        return this.clonePos(end);
    };
    this.remove = function(range) {
        var start = this.clippedPos(range.start.row, range.start.column);
        var end = this.clippedPos(range.end.row, range.end.column);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({start: start, end: end})
        });
        return this.clonePos(start);
    };
    this.removeInLine = function(row, startColumn, endColumn) {
        var start = this.clippedPos(row, startColumn);
        var end = this.clippedPos(row, endColumn);
        
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({start: start, end: end})
        }, true);
        
        return this.clonePos(start);
    };
    this.removeFullLines = function(firstRow, lastRow) {
        firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
        lastRow  = Math.min(Math.max(0, lastRow ), this.getLength() - 1);
        var deleteFirstNewLine = lastRow == this.getLength() - 1 && firstRow > 0;
        var deleteLastNewLine  = lastRow  < this.getLength() - 1;
        var startRow = ( deleteFirstNewLine ? firstRow - 1                  : firstRow                    );
        var startCol = ( deleteFirstNewLine ? this.getLine(startRow).length : 0                           );
        var endRow   = ( deleteLastNewLine  ? lastRow + 1                   : lastRow                     );
        var endCol   = ( deleteLastNewLine  ? 0                             : this.getLine(endRow).length ); 
        var range = new Range(startRow, startCol, endRow, endCol);
        var deletedLines = this.$lines.slice(firstRow, lastRow + 1);
        
        this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
        });
        return deletedLines;
    };
    this.removeNewLine = function(row) {
        if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
                start: this.pos(row, this.getLine(row).length),
                end: this.pos(row + 1, 0),
                action: "remove",
                lines: ["", ""]
            });
        }
    };
    this.replace = function(range, text) {
        if (!(range instanceof Range))
            range = Range.fromPoints(range.start, range.end);
        if (text.length === 0 && range.isEmpty())
            return range.start;
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        var end;
        if (text) {
            end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }
        
        return end;
    };
    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            this.applyDelta(deltas[i]);
        }
    };
    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            this.revertDelta(deltas[i]);
        }
    };
    this.applyDelta = function(delta, doNotValidate) {
        var isInsert = delta.action == "insert";
        if (isInsert ? delta.lines.length <= 1 && !delta.lines[0]
            : !Range.comparePoints(delta.start, delta.end)) {
            return;
        }
        
        if (isInsert && delta.lines.length > 20000) {
            this.$splitAndapplyLargeDelta(delta, 20000);
        }
        else {
            applyDelta(this.$lines, delta, doNotValidate);
            this._signal("change", delta);
        }
    };
    
    this.$splitAndapplyLargeDelta = function(delta, MAX) {
        var lines = delta.lines;
        var l = lines.length - MAX + 1;
        var row = delta.start.row; 
        var column = delta.start.column;
        for (var from = 0, to = 0; from < l; from = to) {
            to += MAX - 1;
            var chunk = lines.slice(from, to);
            chunk.push("");
            this.applyDelta({
                start: this.pos(row + from, column),
                end: this.pos(row + to, column = 0),
                action: delta.action,
                lines: chunk
            }, true);
        }
        delta.lines = lines.slice(from);
        delta.start.row = row + from;
        delta.start.column = column;
        this.applyDelta(delta, true);
    };
    this.revertDelta = function(delta) {
        this.applyDelta({
            start: this.clonePos(delta.start),
            end: this.clonePos(delta.end),
            action: (delta.action == "insert" ? "remove" : "insert"),
            lines: delta.lines.slice()
        });
    };
    this.indexToPosition = function(index, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        for (var i = startRow || 0, l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return {row: i, column: index + lines[i].length + newlineLength};
        }
        return {row: l-1, column: index + lines[l-1].length + newlineLength};
    };
    this.positionToIndex = function(pos, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(pos.row, lines.length);
        for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;

        return index + pos.column;
    };

}).call(Document.prototype);

exports.Document = Document;
});

ace.define("ace/background_tokenizer",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

var BackgroundTokenizer = function(tokenizer, editor) {
    this.running = false;
    this.lines = [];
    this.states = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    var self = this;

    this.$worker = function() {
        if (!self.running) { return; }

        var workerStart = new Date();
        var currentLine = self.currentLine;
        var endLine = -1;
        var doc = self.doc;

        var startLine = currentLine;
        while (self.lines[currentLine])
            currentLine++;
        
        var len = doc.getLength();
        var processedLines = 0;
        self.running = false;
        while (currentLine < len) {
            self.$tokenizeRow(currentLine);
            endLine = currentLine;
            do {
                currentLine++;
            } while (self.lines[currentLine]);
            processedLines ++;
            if ((processedLines % 5 === 0) && (new Date() - workerStart) > 20) {
                self.running = setTimeout(self.$worker, 20);
                break;
            }
        }
        self.currentLine = currentLine;
        
        if (endLine == -1)
            endLine = currentLine;
        
        if (startLine <= endLine)
            self.fireUpdateEvent(startLine, endLine);
    };
};

(function(){

    oop.implement(this, EventEmitter);
    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];
        this.states = [];

        this.start(0);
    };
    this.setDocument = function(doc) {
        this.doc = doc;
        this.lines = [];
        this.states = [];

        this.stop();
    };
    this.fireUpdateEvent = function(firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._signal("update", {data: data});
    };
    this.start = function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        this.running = setTimeout(this.$worker, 700);
    };
    
    this.scheduleStart = function() {
        if (!this.running)
            this.running = setTimeout(this.$worker, 700);
    };

    this.$updateOnChange = function(delta) {
        var startRow = delta.start.row;
        var len = delta.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        } else if (delta.action == "remove") {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        } else {
            var args = Array(len + 1);
            args.unshift(startRow, 1);
            this.lines.splice.apply(this.lines, args);
            this.states.splice.apply(this.states, args);
        }

        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());

        this.stop();
    };
    this.stop = function() {
        if (this.running)
            clearTimeout(this.running);
        this.running = false;
    };
    this.getTokens = function(row) {
        return this.lines[row] || this.$tokenizeRow(row);
    };
    this.getState = function(row) {
        if (this.currentLine == row)
            this.$tokenizeRow(row);
        return this.states[row] || "start";
    };

    this.$tokenizeRow = function(row) {
        var line = this.doc.getLine(row);
        var state = this.states[row - 1];

        var data = this.tokenizer.getLineTokens(line, state, row);

        if (this.states[row] + "" !== data.state + "") {
            this.states[row] = data.state;
            this.lines[row + 1] = null;
            if (this.currentLine > row + 1)
                this.currentLine = row + 1;
        } else if (this.currentLine == row) {
            this.currentLine = row + 1;
        }

        return this.lines[row] = data.tokens;
    };

}).call(BackgroundTokenizer.prototype);

exports.BackgroundTokenizer = BackgroundTokenizer;
});

ace.define("ace/search_highlight",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/range"], function(require, exports, module) {
"use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

var SearchHighlight = function(regExp, clazz, type) {
    this.setRegexp(regExp);
    this.clazz = clazz;
    this.type = type || "text";
};

(function() {
    this.MAX_RANGES = 500;
    
    this.setRegexp = function(regExp) {
        if (this.regExp+"" == regExp+"")
            return;
        this.regExp = regExp;
        this.cache = [];
    };

    this.update = function(html, markerLayer, session, config) {
        if (!this.regExp)
            return;
        var start = config.firstRow, end = config.lastRow;

        for (var i = start; i <= end; i++) {
            var ranges = this.cache[i];
            if (ranges == null) {
                ranges = lang.getMatchOffsets(session.getLine(i), this.regExp);
                if (ranges.length > this.MAX_RANGES)
                    ranges = ranges.slice(0, this.MAX_RANGES);
                ranges = ranges.map(function(match) {
                    return new Range(i, match.offset, i, match.offset + match.length);
                });
                this.cache[i] = ranges.length ? ranges : "";
            }

            for (var j = ranges.length; j --; ) {
                markerLayer.drawSingleLineMarker(
                    html, ranges[j].toScreenRange(session), this.clazz, config);
            }
        }
    };

}).call(SearchHighlight.prototype);

exports.SearchHighlight = SearchHighlight;
});

ace.define("ace/edit_session/fold_line",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
function FoldLine(foldData, folds) {
    this.foldData = foldData;
    if (Array.isArray(folds)) {
        this.folds = folds;
    } else {
        folds = this.folds = [ folds ];
    }

    var last = folds[folds.length - 1];
    this.range = new Range(folds[0].start.row, folds[0].start.column,
                           last.end.row, last.end.column);
    this.start = this.range.start;
    this.end   = this.range.end;

    this.folds.forEach(function(fold) {
        fold.setFoldLine(this);
    }, this);
}

(function() {
    this.shiftRow = function(shift) {
        this.start.row += shift;
        this.end.row += shift;
        this.folds.forEach(function(fold) {
            fold.start.row += shift;
            fold.end.row += shift;
        });
    };

    this.addFold = function(fold) {
        if (fold.sameRow) {
            if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                throw new Error("Can't add a fold to this FoldLine as it has no connection");
            }
            this.folds.push(fold);
            this.folds.sort(function(a, b) {
                return -a.range.compareEnd(b.start.row, b.start.column);
            });
            if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                this.end.row = fold.end.row;
                this.end.column =  fold.end.column;
            } else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            }
        } else if (fold.start.row == this.end.row) {
            this.folds.push(fold);
            this.end.row = fold.end.row;
            this.end.column = fold.end.column;
        } else if (fold.end.row == this.start.row) {
            this.folds.unshift(fold);
            this.start.row = fold.start.row;
            this.start.column = fold.start.column;
        } else {
            throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");
        }
        fold.foldLine = this;
    };

    this.containsRow = function(row) {
        return row >= this.start.row && row <= this.end.row;
    };

    this.walk = function(callback, endRow, endColumn) {
        var lastEnd = 0,
            folds = this.folds,
            fold,
            cmp, stop, isNewRow = true;

        if (endRow == null) {
            endRow = this.end.row;
            endColumn = this.end.column;
        }

        for (var i = 0; i < folds.length; i++) {
            fold = folds[i];

            cmp = fold.range.compareStart(endRow, endColumn);
            if (cmp == -1) {
                callback(null, endRow, endColumn, lastEnd, isNewRow);
                return;
            }

            stop = callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow);
            stop = !stop && callback(fold.placeholder, fold.start.row, fold.start.column, lastEnd);
            if (stop || cmp === 0) {
                return;
            }
            isNewRow = !fold.sameRow;
            lastEnd = fold.end.column;
        }
        callback(null, endRow, endColumn, lastEnd, isNewRow);
    };

    this.getNextFoldTo = function(row, column) {
        var fold, cmp;
        for (var i = 0; i < this.folds.length; i++) {
            fold = this.folds[i];
            cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                return {
                    fold: fold,
                    kind: "after"
                };
            } else if (cmp === 0) {
                return {
                    fold: fold,
                    kind: "inside"
                };
            }
        }
        return null;
    };

    this.addRemoveChars = function(row, column, len) {
        var ret = this.getNextFoldTo(row, column),
            fold, folds;
        if (ret) {
            fold = ret.fold;
            if (ret.kind == "inside"
                && fold.start.column != column
                && fold.start.row != row)
            {
                window.console && window.console.log(row, column, fold);
            } else if (fold.start.row == row) {
                folds = this.folds;
                var i = folds.indexOf(fold);
                if (i === 0) {
                    this.start.column += len;
                }
                for (i; i < folds.length; i++) {
                    fold = folds[i];
                    fold.start.column += len;
                    if (!fold.sameRow) {
                        return;
                    }
                    fold.end.column += len;
                }
                this.end.column += len;
            }
        }
    };

    this.split = function(row, column) {
        var pos = this.getNextFoldTo(row, column);
        
        if (!pos || pos.kind == "inside")
            return null;
            
        var fold = pos.fold;
        var folds = this.folds;
        var foldData = this.foldData;
        
        var i = folds.indexOf(fold);
        var foldBefore = folds[i - 1];
        this.end.row = foldBefore.end.row;
        this.end.column = foldBefore.end.column;
        folds = folds.splice(i, folds.length - i);

        var newFoldLine = new FoldLine(foldData, folds);
        foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine);
        return newFoldLine;
    };

    this.merge = function(foldLineNext) {
        var folds = foldLineNext.folds;
        for (var i = 0; i < folds.length; i++) {
            this.addFold(folds[i]);
        }
        var foldData = this.foldData;
        foldData.splice(foldData.indexOf(foldLineNext), 1);
    };

    this.toString = function() {
        var ret = [this.range.toString() + ": [" ];

        this.folds.forEach(function(fold) {
            ret.push("  " + fold.toString());
        });
        ret.push("]");
        return ret.join("\n");
    };

    this.idxToPosition = function(idx) {
        var lastFoldEndColumn = 0;

        for (var i = 0; i < this.folds.length; i++) {
            var fold = this.folds[i];

            idx -= fold.start.column - lastFoldEndColumn;
            if (idx < 0) {
                return {
                    row: fold.start.row,
                    column: fold.start.column + idx
                };
            }

            idx -= fold.placeholder.length;
            if (idx < 0) {
                return fold.start;
            }

            lastFoldEndColumn = fold.end.column;
        }

        return {
            row: this.end.row,
            column: this.end.column + idx
        };
    };
}).call(FoldLine.prototype);

exports.FoldLine = FoldLine;
});

ace.define("ace/range_list",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";
var Range = require("./range").Range;
var comparePoints = Range.comparePoints;

var RangeList = function() {
    this.ranges = [];
};

(function() {
    this.comparePoints = comparePoints;

    this.pointIndex = function(pos, excludeEdges, startIndex) {
        var list = this.ranges;

        for (var i = startIndex || 0; i < list.length; i++) {
            var range = list[i];
            var cmpEnd = comparePoints(pos, range.end);
            if (cmpEnd > 0)
                continue;
            var cmpStart = comparePoints(pos, range.start);
            if (cmpEnd === 0)
                return excludeEdges && cmpStart !== 0 ? -i-2 : i;
            if (cmpStart > 0 || (cmpStart === 0 && !excludeEdges))
                return i;

            return -i-1;
        }
        return -i - 1;
    };

    this.add = function(range) {
        var excludeEdges = !range.isEmpty();
        var startIndex = this.pointIndex(range.start, excludeEdges);
        if (startIndex < 0)
            startIndex = -startIndex - 1;

        var endIndex = this.pointIndex(range.end, excludeEdges, startIndex);

        if (endIndex < 0)
            endIndex = -endIndex - 1;
        else
            endIndex++;
        return this.ranges.splice(startIndex, endIndex - startIndex, range);
    };

    this.addList = function(list) {
        var removed = [];
        for (var i = list.length; i--; ) {
            removed.push.apply(removed, this.add(list[i]));
        }
        return removed;
    };

    this.substractPoint = function(pos) {
        var i = this.pointIndex(pos);

        if (i >= 0)
            return this.ranges.splice(i, 1);
    };
    this.merge = function() {
        var removed = [];
        var list = this.ranges;
        
        list = list.sort(function(a, b) {
            return comparePoints(a.start, b.start);
        });
        
        var next = list[0], range;
        for (var i = 1; i < list.length; i++) {
            range = next;
            next = list[i];
            var cmp = comparePoints(range.end, next.start);
            if (cmp < 0)
                continue;

            if (cmp == 0 && !range.isEmpty() && !next.isEmpty())
                continue;

            if (comparePoints(range.end, next.end) < 0) {
                range.end.row = next.end.row;
                range.end.column = next.end.column;
            }

            list.splice(i, 1);
            removed.push(next);
            next = range;
            i--;
        }
        
        this.ranges = list;

        return removed;
    };

    this.contains = function(row, column) {
        return this.pointIndex({row: row, column: column}) >= 0;
    };

    this.containsPoint = function(pos) {
        return this.pointIndex(pos) >= 0;
    };

    this.rangeAtPoint = function(pos) {
        var i = this.pointIndex(pos);
        if (i >= 0)
            return this.ranges[i];
    };


    this.clipRows = function(startRow, endRow) {
        var list = this.ranges;
        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow)
            return [];

        var startIndex = this.pointIndex({row: startRow, column: 0});
        if (startIndex < 0)
            startIndex = -startIndex - 1;
        var endIndex = this.pointIndex({row: endRow, column: 0}, startIndex);
        if (endIndex < 0)
            endIndex = -endIndex - 1;

        var clipped = [];
        for (var i = startIndex; i < endIndex; i++) {
            clipped.push(list[i]);
        }
        return clipped;
    };

    this.removeAll = function() {
        return this.ranges.splice(0, this.ranges.length);
    };

    this.attach = function(session) {
        if (this.session)
            this.detach();

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    };

    this.detach = function() {
        if (!this.session)
            return;
        this.session.removeListener('change', this.onChange);
        this.session = null;
    };

    this.$onChange = function(delta) {
        var start = delta.start;
        var end = delta.end;
        var startRow = start.row;
        var endRow = end.row;
        var ranges = this.ranges;
        for (var i = 0, n = ranges.length; i < n; i++) {
            var r = ranges[i];
            if (r.end.row >= startRow)
                break;
        }
        
        if (delta.action == "insert") {
            var lineDif = endRow - startRow;
            var colDiff = -start.column + end.column;
            for (; i < n; i++) {
                var r = ranges[i];
                if (r.start.row > startRow)
                    break;
    
                if (r.start.row == startRow && r.start.column >= start.column) {
                    if (r.start.column == start.column && this.$insertRight) {
                    } else {
                        r.start.column += colDiff;
                        r.start.row += lineDif;
                    }
                }
                if (r.end.row == startRow && r.end.column >= start.column) {
                    if (r.end.column == start.column && this.$insertRight) {
                        continue;
                    }
                    if (r.end.column == start.column && colDiff > 0 && i < n - 1) {
                        if (r.end.column > r.start.column && r.end.column == ranges[i+1].start.column)
                            r.end.column -= colDiff;
                    }
                    r.end.column += colDiff;
                    r.end.row += lineDif;
                }
            }
        } else {
            var lineDif = startRow - endRow;
            var colDiff = start.column - end.column;
            for (; i < n; i++) {
                var r = ranges[i];
                
                if (r.start.row > endRow)
                    break;
                    
                if (r.end.row < endRow
                    && (
                        startRow < r.end.row 
                        || startRow == r.end.row && start.column < r.end.column
                    )
                ) {
                    r.end.row = startRow;
                    r.end.column = start.column;
                }
                else if (r.end.row == endRow) {
                    if (r.end.column <= end.column) {
                        if (lineDif || r.end.column > start.column) {
                            r.end.column = start.column;
                            r.end.row = start.row;
                        }
                    }
                    else {
                        r.end.column += colDiff;
                        r.end.row += lineDif;
                    }
                }
                else if (r.end.row > endRow) {
                    r.end.row += lineDif;
                }
                
                if (r.start.row < endRow
                    && (
                        startRow < r.start.row 
                        || startRow == r.start.row && start.column < r.start.column
                    )
                ) {
                    r.start.row = startRow;
                    r.start.column = start.column;
                }
                else if (r.start.row == endRow) {
                    if (r.start.column <= end.column) {
                        if (lineDif || r.start.column > start.column) {
                            r.start.column = start.column;
                            r.start.row = start.row;
                        }
                    }
                    else {
                        r.start.column += colDiff;
                        r.start.row += lineDif;
                    }
                }
                else if (r.start.row > endRow) {
                    r.start.row += lineDif;
                }
            }
        }

        if (lineDif != 0 && i < n) {
            for (; i < n; i++) {
                var r = ranges[i];
                r.start.row += lineDif;
                r.end.row += lineDif;
            }
        }
    };

}).call(RangeList.prototype);

exports.RangeList = RangeList;
});

ace.define("ace/edit_session/fold",["require","exports","module","ace/range","ace/range_list","ace/lib/oop"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var RangeList = require("../range_list").RangeList;
var oop = require("../lib/oop");
var Fold = exports.Fold = function(range, placeholder) {
    this.foldLine = null;
    this.placeholder = placeholder;
    this.range = range;
    this.start = range.start;
    this.end = range.end;

    this.sameRow = range.start.row == range.end.row;
    this.subFolds = this.ranges = [];
};

oop.inherits(Fold, RangeList);

(function() {

    this.toString = function() {
        return '"' + this.placeholder + '" ' + this.range.toString();
    };

    this.setFoldLine = function(foldLine) {
        this.foldLine = foldLine;
        this.subFolds.forEach(function(fold) {
            fold.setFoldLine(foldLine);
        });
    };

    this.clone = function() {
        var range = this.range.clone();
        var fold = new Fold(range, this.placeholder);
        this.subFolds.forEach(function(subFold) {
            fold.subFolds.push(subFold.clone());
        });
        fold.collapseChildren = this.collapseChildren;
        return fold;
    };

    this.addSubFold = function(fold) {
        if (this.range.isEqual(fold))
            return;

        if (!this.range.containsRange(fold))
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);
        consumeRange(fold, this.start);

        var row = fold.start.row, column = fold.start.column;
        for (var i = 0, cmp = -1; i < this.subFolds.length; i++) {
            cmp = this.subFolds[i].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterStart = this.subFolds[i];

        if (cmp == 0)
            return afterStart.addSubFold(fold);
        var row = fold.range.end.row, column = fold.range.end.column;
        for (var j = i, cmp = -1; j < this.subFolds.length; j++) {
            cmp = this.subFolds[j].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterEnd = this.subFolds[j];

        if (cmp == 0)
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);

        var consumedFolds = this.subFolds.splice(i, j - i, fold);
        fold.setFoldLine(this.foldLine);

        return fold;
    };
    
    this.restoreRange = function(range) {
        return restoreRange(range, this.start);
    };

}).call(Fold.prototype);

function consumePoint(point, anchor) {
    point.row -= anchor.row;
    if (point.row == 0)
        point.column -= anchor.column;
}
function consumeRange(range, anchor) {
    consumePoint(range.start, anchor);
    consumePoint(range.end, anchor);
}
function restorePoint(point, anchor) {
    if (point.row == 0)
        point.column += anchor.column;
    point.row += anchor.row;
}
function restoreRange(range, anchor) {
    restorePoint(range.start, anchor);
    restorePoint(range.end, anchor);
}

});

ace.define("ace/edit_session/folding",["require","exports","module","ace/range","ace/edit_session/fold_line","ace/edit_session/fold","ace/token_iterator"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var FoldLine = require("./fold_line").FoldLine;
var Fold = require("./fold").Fold;
var TokenIterator = require("../token_iterator").TokenIterator;

function Folding() {
    this.getFoldAt = function(row, column, side) {
        var foldLine = this.getFoldLine(row);
        if (!foldLine)
            return null;

        var folds = foldLine.folds;
        for (var i = 0; i < folds.length; i++) {
            var fold = folds[i];
            if (fold.range.contains(row, column)) {
                if (side == 1 && fold.range.isEnd(row, column)) {
                    continue;
                } else if (side == -1 && fold.range.isStart(row, column)) {
                    continue;
                }
                return fold;
            }
        }
    };
    this.getFoldsInRange = function(range) {
        var start = range.start;
        var end = range.end;
        var foldLines = this.$foldData;
        var foundFolds = [];

        start.column += 1;
        end.column -= 1;

        for (var i = 0; i < foldLines.length; i++) {
            var cmp = foldLines[i].range.compareRange(range);
            if (cmp == 2) {
                continue;
            }
            else if (cmp == -2) {
                break;
            }

            var folds = foldLines[i].folds;
            for (var j = 0; j < folds.length; j++) {
                var fold = folds[j];
                cmp = fold.range.compareRange(range);
                if (cmp == -2) {
                    break;
                } else if (cmp == 2) {
                    continue;
                } else
                if (cmp == 42) {
                    break;
                }
                foundFolds.push(fold);
            }
        }
        start.column -= 1;
        end.column += 1;

        return foundFolds;
    };

    this.getFoldsInRangeList = function(ranges) {
        if (Array.isArray(ranges)) {
            var folds = [];
            ranges.forEach(function(range) {
                folds = folds.concat(this.getFoldsInRange(range));
            }, this);
        } else {
            var folds = this.getFoldsInRange(ranges);
        }
        return folds;
    };
    this.getAllFolds = function() {
        var folds = [];
        var foldLines = this.$foldData;
        
        for (var i = 0; i < foldLines.length; i++)
            for (var j = 0; j < foldLines[i].folds.length; j++)
                folds.push(foldLines[i].folds[j]);

        return folds;
    };
    this.getFoldStringAt = function(row, column, trim, foldLine) {
        foldLine = foldLine || this.getFoldLine(row);
        if (!foldLine)
            return null;

        var lastFold = {
            end: { column: 0 }
        };
        var str, fold;
        for (var i = 0; i < foldLine.folds.length; i++) {
            fold = foldLine.folds[i];
            var cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                str = this
                    .getLine(fold.start.row)
                    .substring(lastFold.end.column, fold.start.column);
                break;
            }
            else if (cmp === 0) {
                return null;
            }
            lastFold = fold;
        }
        if (!str)
            str = this.getLine(fold.start.row).substring(lastFold.end.column);

        if (trim == -1)
            return str.substring(0, column - lastFold.end.column);
        else if (trim == 1)
            return str.substring(column - lastFold.end.column);
        else
            return str;
    };

    this.getFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i == -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) {
                return foldLine;
            } else if (foldLine.end.row > docRow) {
                return null;
            }
        }
        return null;
    };
    this.getNextFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i == -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.end.row >= docRow) {
                return foldLine;
            }
        }
        return null;
    };

    this.getFoldedRowCount = function(first, last) {
        var foldData = this.$foldData, rowCount = last-first+1;
        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i],
                end = foldLine.end.row,
                start = foldLine.start.row;
            if (end >= last) {
                if (start < last) {
                    if (start >= first)
                        rowCount -= last-start;
                    else
                        rowCount = 0; // in one fold
                }
                break;
            } else if (end >= first){
                if (start >= first) // fold inside range
                    rowCount -=  end-start;
                else
                    rowCount -=  end-first+1;
            }
        }
        return rowCount;
    };

    this.$addFoldLine = function(foldLine) {
        this.$foldData.push(foldLine);
        this.$foldData.sort(function(a, b) {
            return a.start.row - b.start.row;
        });
        return foldLine;
    };
    this.addFold = function(placeholder, range) {
        var foldData = this.$foldData;
        var added = false;
        var fold;
        
        if (placeholder instanceof Fold)
            fold = placeholder;
        else {
            fold = new Fold(range, placeholder);
            fold.collapseChildren = range.collapseChildren;
        }
        this.$clipRangeToDocument(fold.range);

        var startRow = fold.start.row;
        var startColumn = fold.start.column;
        var endRow = fold.end.row;
        var endColumn = fold.end.column;
        if (!(startRow < endRow || 
            startRow == endRow && startColumn <= endColumn - 2))
            throw new Error("The range has to be at least 2 characters width");

        var startFold = this.getFoldAt(startRow, startColumn, 1);
        var endFold = this.getFoldAt(endRow, endColumn, -1);
        if (startFold && endFold == startFold)
            return startFold.addSubFold(fold);

        if (startFold && !startFold.range.isStart(startRow, startColumn))
            this.removeFold(startFold);
        
        if (endFold && !endFold.range.isEnd(endRow, endColumn))
            this.removeFold(endFold);
        var folds = this.getFoldsInRange(fold.range);
        if (folds.length > 0) {
            this.removeFolds(folds);
            folds.forEach(function(subFold) {
                fold.addSubFold(subFold);
            });
        }

        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (endRow == foldLine.start.row) {
                foldLine.addFold(fold);
                added = true;
                break;
            } else if (startRow == foldLine.end.row) {
                foldLine.addFold(fold);
                added = true;
                if (!fold.sameRow) {
                    var foldLineNext = foldData[i + 1];
                    if (foldLineNext && foldLineNext.start.row == endRow) {
                        foldLine.merge(foldLineNext);
                        break;
                    }
                }
                break;
            } else if (endRow <= foldLine.start.row) {
                break;
            }
        }

        if (!added)
            foldLine = this.$addFoldLine(new FoldLine(this.$foldData, fold));

        if (this.$useWrapMode)
            this.$updateWrapData(foldLine.start.row, foldLine.start.row);
        else
            this.$updateRowLengthCache(foldLine.start.row, foldLine.start.row);
        this.$modified = true;
        this._signal("changeFold", { data: fold, action: "add" });

        return fold;
    };

    this.addFolds = function(folds) {
        folds.forEach(function(fold) {
            this.addFold(fold);
        }, this);
    };

    this.removeFold = function(fold) {
        var foldLine = fold.foldLine;
        var startRow = foldLine.start.row;
        var endRow = foldLine.end.row;

        var foldLines = this.$foldData;
        var folds = foldLine.folds;
        if (folds.length == 1) {
            foldLines.splice(foldLines.indexOf(foldLine), 1);
        } else
        if (foldLine.range.isEnd(fold.end.row, fold.end.column)) {
            folds.pop();
            foldLine.end.row = folds[folds.length - 1].end.row;
            foldLine.end.column = folds[folds.length - 1].end.column;
        } else
        if (foldLine.range.isStart(fold.start.row, fold.start.column)) {
            folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
        } else
        if (fold.sameRow) {
            folds.splice(folds.indexOf(fold), 1);
        } else
        {
            var newFoldLine = foldLine.split(fold.start.row, fold.start.column);
            folds = newFoldLine.folds;
            folds.shift();
            newFoldLine.start.row = folds[0].start.row;
            newFoldLine.start.column = folds[0].start.column;
        }

        if (!this.$updating) {
            if (this.$useWrapMode)
                this.$updateWrapData(startRow, endRow);
            else
                this.$updateRowLengthCache(startRow, endRow);
        }
        this.$modified = true;
        this._signal("changeFold", { data: fold, action: "remove" });
    };

    this.removeFolds = function(folds) {
        var cloneFolds = [];
        for (var i = 0; i < folds.length; i++) {
            cloneFolds.push(folds[i]);
        }

        cloneFolds.forEach(function(fold) {
            this.removeFold(fold);
        }, this);
        this.$modified = true;
    };

    this.expandFold = function(fold) {
        this.removeFold(fold);
        fold.subFolds.forEach(function(subFold) {
            fold.restoreRange(subFold);
            this.addFold(subFold);
        }, this);
        if (fold.collapseChildren > 0) {
            this.foldAll(fold.start.row+1, fold.end.row, fold.collapseChildren-1);
        }
        fold.subFolds = [];
    };

    this.expandFolds = function(folds) {
        folds.forEach(function(fold) {
            this.expandFold(fold);
        }, this);
    };

    this.unfold = function(location, expandInner) {
        var range, folds;
        if (location == null) {
            range = new Range(0, 0, this.getLength(), 0);
            expandInner = true;
        } else if (typeof location == "number")
            range = new Range(location, 0, location, this.getLine(location).length);
        else if ("row" in location)
            range = Range.fromPoints(location, location);
        else
            range = location;
        
        folds = this.getFoldsInRangeList(range);
        if (expandInner) {
            this.removeFolds(folds);
        } else {
            var subFolds = folds;
            while (subFolds.length) {
                this.expandFolds(subFolds);
                subFolds = this.getFoldsInRangeList(range);
            }
        }
        if (folds.length)
            return folds;
    };
    this.isRowFolded = function(docRow, startFoldRow) {
        return !!this.getFoldLine(docRow, startFoldRow);
    };

    this.getRowFoldEnd = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return foldLine ? foldLine.end.row : docRow;
    };

    this.getRowFoldStart = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return foldLine ? foldLine.start.row : docRow;
    };

    this.getFoldDisplayLine = function(foldLine, endRow, endColumn, startRow, startColumn) {
        if (startRow == null)
            startRow = foldLine.start.row;
        if (startColumn == null)
            startColumn = 0;
        if (endRow == null)
            endRow = foldLine.end.row;
        if (endColumn == null)
            endColumn = this.getLine(endRow).length;
        var doc = this.doc;
        var textLine = "";

        foldLine.walk(function(placeholder, row, column, lastColumn) {
            if (row < startRow)
                return;
            if (row == startRow) {
                if (column < startColumn)
                    return;
                lastColumn = Math.max(startColumn, lastColumn);
            }

            if (placeholder != null) {
                textLine += placeholder;
            } else {
                textLine += doc.getLine(row).substring(lastColumn, column);
            }
        }, endRow, endColumn);
        return textLine;
    };

    this.getDisplayLine = function(row, endColumn, startRow, startColumn) {
        var foldLine = this.getFoldLine(row);

        if (!foldLine) {
            var line;
            line = this.doc.getLine(row);
            return line.substring(startColumn || 0, endColumn || line.length);
        } else {
            return this.getFoldDisplayLine(
                foldLine, row, endColumn, startRow, startColumn);
        }
    };

    this.$cloneFoldData = function() {
        var fd = [];
        fd = this.$foldData.map(function(foldLine) {
            var folds = foldLine.folds.map(function(fold) {
                return fold.clone();
            });
            return new FoldLine(fd, folds);
        });

        return fd;
    };

    this.toggleFold = function(tryToUnfold) {
        var selection = this.selection;
        var range = selection.getRange();
        var fold;
        var bracketPos;

        if (range.isEmpty()) {
            var cursor = range.start;
            fold = this.getFoldAt(cursor.row, cursor.column);

            if (fold) {
                this.expandFold(fold);
                return;
            } else if (bracketPos = this.findMatchingBracket(cursor)) {
                if (range.comparePoint(bracketPos) == 1) {
                    range.end = bracketPos;
                } else {
                    range.start = bracketPos;
                    range.start.column++;
                    range.end.column--;
                }
            } else if (bracketPos = this.findMatchingBracket({row: cursor.row, column: cursor.column + 1})) {
                if (range.comparePoint(bracketPos) == 1)
                    range.end = bracketPos;
                else
                    range.start = bracketPos;

                range.start.column++;
            } else {
                range = this.getCommentFoldRange(cursor.row, cursor.column) || range;
            }
        } else {
            var folds = this.getFoldsInRange(range);
            if (tryToUnfold && folds.length) {
                this.expandFolds(folds);
                return;
            } else if (folds.length == 1 ) {
                fold = folds[0];
            }
        }

        if (!fold)
            fold = this.getFoldAt(range.start.row, range.start.column);

        if (fold && fold.range.toString() == range.toString()) {
            this.expandFold(fold);
            return;
        }

        var placeholder = "...";
        if (!range.isMultiLine()) {
            placeholder = this.getTextRange(range);
            if (placeholder.length < 4)
                return;
            placeholder = placeholder.trim().substring(0, 2) + "..";
        }

        this.addFold(placeholder, range);
    };

    this.getCommentFoldRange = function(row, column, dir) {
        var iterator = new TokenIterator(this, row, column);
        var token = iterator.getCurrentToken();
        var type = token.type;
        if (token && /^comment|string/.test(type)) {
            type = type.match(/comment|string/)[0];
            if (type == "comment")
                type += "|doc-start";
            var re = new RegExp(type);
            var range = new Range();
            if (dir != 1) {
                do {
                    token = iterator.stepBackward();
                } while (token && re.test(token.type));
                iterator.stepForward();
            }
            
            range.start.row = iterator.getCurrentTokenRow();
            range.start.column = iterator.getCurrentTokenColumn() + 2;

            iterator = new TokenIterator(this, row, column);
            
            if (dir != -1) {
                var lastRow = -1;
                do {
                    token = iterator.stepForward();
                    if (lastRow == -1) {
                        var state = this.getState(iterator.$row);
                        if (!re.test(state))
                            lastRow = iterator.$row;
                    } else if (iterator.$row > lastRow) {
                        break;
                    }
                } while (token && re.test(token.type));
                token = iterator.stepBackward();
            } else
                token = iterator.getCurrentToken();

            range.end.row = iterator.getCurrentTokenRow();
            range.end.column = iterator.getCurrentTokenColumn() + token.value.length - 2;
            return range;
        }
    };

    this.foldAll = function(startRow, endRow, depth) {
        if (depth == undefined)
            depth = 100000; // JSON.stringify doesn't hanle Infinity
        var foldWidgets = this.foldWidgets;
        if (!foldWidgets)
            return; // mode doesn't support folding
        endRow = endRow || this.getLength();
        startRow = startRow || 0;
        for (var row = startRow; row < endRow; row++) {
            if (foldWidgets[row] == null)
                foldWidgets[row] = this.getFoldWidget(row);
            if (foldWidgets[row] != "start")
                continue;

            var range = this.getFoldWidgetRange(row);
            if (range && range.isMultiLine()
                && range.end.row <= endRow
                && range.start.row >= startRow
            ) {
                row = range.end.row;
                try {
                    var fold = this.addFold("...", range);
                    if (fold)
                        fold.collapseChildren = depth;
                } catch(e) {}
            }
        }
    };
    this.$foldStyles = {
        "manual": 1,
        "markbegin": 1,
        "markbeginend": 1
    };
    this.$foldStyle = "markbegin";
    this.setFoldStyle = function(style) {
        if (!this.$foldStyles[style])
            throw new Error("invalid fold style: " + style + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
        
        if (this.$foldStyle == style)
            return;

        this.$foldStyle = style;
        
        if (style == "manual")
            this.unfold();
        var mode = this.$foldMode;
        this.$setFolding(null);
        this.$setFolding(mode);
    };

    this.$setFolding = function(foldMode) {
        if (this.$foldMode == foldMode)
            return;
            
        this.$foldMode = foldMode;
        
        this.off('change', this.$updateFoldWidgets);
        this.off('tokenizerUpdate', this.$tokenizerUpdateFoldWidgets);
        this._signal("changeAnnotation");
        
        if (!foldMode || this.$foldStyle == "manual") {
            this.foldWidgets = null;
            return;
        }
        
        this.foldWidgets = [];
        this.getFoldWidget = foldMode.getFoldWidget.bind(foldMode, this, this.$foldStyle);
        this.getFoldWidgetRange = foldMode.getFoldWidgetRange.bind(foldMode, this, this.$foldStyle);
        
        this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
        this.$tokenizerUpdateFoldWidgets = this.tokenizerUpdateFoldWidgets.bind(this);
        this.on('change', this.$updateFoldWidgets);
        this.on('tokenizerUpdate', this.$tokenizerUpdateFoldWidgets);
    };

    this.getParentFoldRangeData = function (row, ignoreCurrent) {
        var fw = this.foldWidgets;
        if (!fw || (ignoreCurrent && fw[row]))
            return {};

        var i = row - 1, firstRange;
        while (i >= 0) {
            var c = fw[i];
            if (c == null)
                c = fw[i] = this.getFoldWidget(i);

            if (c == "start") {
                var range = this.getFoldWidgetRange(i);
                if (!firstRange)
                    firstRange = range;
                if (range && range.end.row >= row)
                    break;
            }
            i--;
        }

        return {
            range: i !== -1 && range,
            firstRange: firstRange
        };
    };

    this.onFoldWidgetClick = function(row, e) {
        e = e.domEvent;
        var options = {
            children: e.shiftKey,
            all: e.ctrlKey || e.metaKey,
            siblings: e.altKey
        };
        
        var range = this.$toggleFoldWidget(row, options);
        if (!range) {
            var el = (e.target || e.srcElement);
            if (el && /ace_fold-widget/.test(el.className))
                el.className += " ace_invalid";
        }
    };
    
    this.$toggleFoldWidget = function(row, options) {
        if (!this.getFoldWidget)
            return;
        var type = this.getFoldWidget(row);
        var line = this.getLine(row);

        var dir = type === "end" ? -1 : 1;
        var fold = this.getFoldAt(row, dir === -1 ? 0 : line.length, dir);

        if (fold) {
            if (options.children || options.all)
                this.removeFold(fold);
            else
                this.expandFold(fold);
            return fold;
        }

        var range = this.getFoldWidgetRange(row, true);
        if (range && !range.isMultiLine()) {
            fold = this.getFoldAt(range.start.row, range.start.column, 1);
            if (fold && range.isEqual(fold.range)) {
                this.removeFold(fold);
                return fold;
            }
        }
        
        if (options.siblings) {
            var data = this.getParentFoldRangeData(row);
            if (data.range) {
                var startRow = data.range.start.row + 1;
                var endRow = data.range.end.row;
            }
            this.foldAll(startRow, endRow, options.all ? 10000 : 0);
        } else if (options.children) {
            endRow = range ? range.end.row : this.getLength();
            this.foldAll(row + 1, endRow, options.all ? 10000 : 0);
        } else if (range) {
            if (options.all) 
                range.collapseChildren = 10000;
            this.addFold("...", range);
        }
        
        return range;
    };
    
    
    
    this.toggleFoldWidget = function(toggleParent) {
        var row = this.selection.getCursor().row;
        row = this.getRowFoldStart(row);
        var range = this.$toggleFoldWidget(row, {});
        
        if (range)
            return;
        var data = this.getParentFoldRangeData(row, true);
        range = data.range || data.firstRange;
        
        if (range) {
            row = range.start.row;
            var fold = this.getFoldAt(row, this.getLine(row).length, 1);

            if (fold) {
                this.removeFold(fold);
            } else {
                this.addFold("...", range);
            }
        }
    };

    this.updateFoldWidgets = function(delta) {
        var firstRow = delta.start.row;
        var len = delta.end.row - firstRow;

        if (len === 0) {
            this.foldWidgets[firstRow] = null;
        } else if (delta.action == 'remove') {
            this.foldWidgets.splice(firstRow, len + 1, null);
        } else {
            var args = Array(len + 1);
            args.unshift(firstRow, 1);
            this.foldWidgets.splice.apply(this.foldWidgets, args);
        }
    };
    this.tokenizerUpdateFoldWidgets = function(e) {
        var rows = e.data;
        if (rows.first != rows.last) {
            if (this.foldWidgets.length > rows.first)
                this.foldWidgets.splice(rows.first, this.foldWidgets.length);
        }
    };
}

exports.Folding = Folding;

});

ace.define("ace/edit_session/bracket_match",["require","exports","module","ace/token_iterator","ace/range"], function(require, exports, module) {
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;
var Range = require("../range").Range;


function BracketMatch() {

    this.findMatchingBracket = function(position, chr) {
        if (position.column == 0) return null;

        var charBeforeCursor = chr || this.getLine(position.row).charAt(position.column-1);
        if (charBeforeCursor == "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match)
            return null;

        if (match[1])
            return this.$findClosingBracket(match[1], position);
        else
            return this.$findOpeningBracket(match[2], position);
    };
    
    this.getBracketRange = function(pos) {
        var line = this.getLine(pos.row);
        var before = true, range;

        var chr = line.charAt(pos.column-1);
        var match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            chr = line.charAt(pos.column);
            pos = {row: pos.row, column: pos.column + 1};
            match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
            before = false;
        }
        if (!match)
            return null;

        if (match[1]) {
            var bracketPos = this.$findClosingBracket(match[1], pos);
            if (!bracketPos)
                return null;
            range = Range.fromPoints(pos, bracketPos);
            if (!before) {
                range.end.column++;
                range.start.column--;
            }
            range.cursor = range.end;
        } else {
            var bracketPos = this.$findOpeningBracket(match[2], pos);
            if (!bracketPos)
                return null;
            range = Range.fromPoints(bracketPos, pos);
            if (!before) {
                range.start.column++;
                range.end.column--;
            }
            range.cursor = range.start;
        }
        
        return range;
    };

    this.$brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{",
        "<": ">",
        ">": "<"
    };

    this.$findOpeningBracket = function(bracket, position, typeRe) {
        var openBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();
        if (!token)
            return;
        
         if (!typeRe){
            typeRe = new RegExp(
                "(\\.?" +
                token.type.replace(".", "\\.").replace("rparen", ".paren")
                    .replace(/\b(?:end)\b/, "(?:start|begin|end)")
                + ")+"
            );
        }
        var valueIndex = position.column - iterator.getCurrentTokenColumn() - 2;
        var value = token.value;
        
        while (true) {
        
            while (valueIndex >= 0) {
                var chr = value.charAt(valueIndex);
                if (chr == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }
            do {
                token = iterator.stepBackward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                break;
                
            value = token.value;
            valueIndex = value.length - 1;
        }
        
        return null;
    };

    this.$findClosingBracket = function(bracket, position, typeRe) {
        var closingBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();
        if (!token)
            return;

        if (!typeRe){
            typeRe = new RegExp(
                "(\\.?" +
                token.type.replace(".", "\\.").replace("lparen", ".paren")
                    .replace(/\b(?:start|begin)\b/, "(?:start|begin|end)")
                + ")+"
            );
        }
        var valueIndex = position.column - iterator.getCurrentTokenColumn();

        while (true) {

            var value = token.value;
            var valueLength = value.length;
            while (valueIndex < valueLength) {
                var chr = value.charAt(valueIndex);
                if (chr == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex += 1;
            }
            do {
                token = iterator.stepForward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                break;

            valueIndex = 0;
        }
        
        return null;
    };
}
exports.BracketMatch = BracketMatch;

});

ace.define("ace/edit_session",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/bidihandler","ace/config","ace/lib/event_emitter","ace/selection","ace/mode/text","ace/range","ace/document","ace/background_tokenizer","ace/search_highlight","ace/edit_session/folding","ace/edit_session/bracket_match"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var BidiHandler = require("./bidihandler").BidiHandler;
var config = require("./config");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Selection = require("./selection").Selection;
var TextMode = require("./mode/text").Mode;
var Range = require("./range").Range;
var Document = require("./document").Document;
var BackgroundTokenizer = require("./background_tokenizer").BackgroundTokenizer;
var SearchHighlight = require("./search_highlight").SearchHighlight;

var EditSession = function(text, mode) {
    this.$breakpoints = [];
    this.$decorations = [];
    this.$frontMarkers = {};
    this.$backMarkers = {};
    this.$markerId = 1;
    this.$undoSelect = true;

    this.$foldData = [];
    this.id = "session" + (++EditSession.$uid);
    this.$foldData.toString = function() {
        return this.join("\n");
    };
    this.on("changeFold", this.onChangeFold.bind(this));
    this.$onChange = this.onChange.bind(this);

    if (typeof text != "object" || !text.getLine)
        text = new Document(text);

    this.setDocument(text);
    this.selection = new Selection(this);
    this.$bidiHandler = new BidiHandler(this);

    config.resetOptions(this);
    this.setMode(mode);
    config._signal("session", this);
};


EditSession.$uid = 0;

(function() {

    oop.implement(this, EventEmitter);
    this.setDocument = function(doc) {
        if (this.doc)
            this.doc.removeListener("change", this.$onChange);

        this.doc = doc;
        doc.on("change", this.$onChange);

        if (this.bgTokenizer)
            this.bgTokenizer.setDocument(this.getDocument());

        this.resetCaches();
    };
    this.getDocument = function() {
        return this.doc;
    };
    this.$resetRowCache = function(docRow) {
        if (!docRow) {
            this.$docRowCache = [];
            this.$screenRowCache = [];
            return;
        }
        var l = this.$docRowCache.length;
        var i = this.$getRowCacheIndex(this.$docRowCache, docRow) + 1;
        if (l > i) {
            this.$docRowCache.splice(i, l);
            this.$screenRowCache.splice(i, l);
        }
    };

    this.$getRowCacheIndex = function(cacheArray, val) {
        var low = 0;
        var hi = cacheArray.length - 1;

        while (low <= hi) {
            var mid = (low + hi) >> 1;
            var c = cacheArray[mid];

            if (val > c)
                low = mid + 1;
            else if (val < c)
                hi = mid - 1;
            else
                return mid;
        }

        return low -1;
    };

    this.resetCaches = function() {
        this.$modified = true;
        this.$wrapData = [];
        this.$rowLengthCache = [];
        this.$resetRowCache(0);
        if (this.bgTokenizer)
            this.bgTokenizer.start(0);
    };

    this.onChangeFold = function(e) {
        var fold = e.data;
        this.$resetRowCache(fold.start.row);
    };

    this.onChange = function(delta) {
        this.$modified = true;
        this.$bidiHandler.onChange(delta);
        this.$resetRowCache(delta.start.row);

        var removedFolds = this.$updateInternalDataOnChange(delta);
        if (!this.$fromUndo && this.$undoManager) {
            if (removedFolds && removedFolds.length) {
                this.$undoManager.add({
                    action: "removeFolds",
                    folds:  removedFolds
                }, this.mergeUndoDeltas);
                this.mergeUndoDeltas = true;
            }
            this.$undoManager.add(delta, this.mergeUndoDeltas);
            this.mergeUndoDeltas = true;
            
            this.$informUndoManager.schedule();
        }

        this.bgTokenizer && this.bgTokenizer.$updateOnChange(delta);
        this._signal("change", delta);
    };
    this.setValue = function(text) {
        this.doc.setValue(text);
        this.selection.moveTo(0, 0);

        this.$resetRowCache(0);
        this.setUndoManager(this.$undoManager);
        this.getUndoManager().reset();
    };
    this.getValue =
    this.toString = function() {
        return this.doc.getValue();
    };
    this.getSelection = function() {
        return this.selection;
    };
    this.getState = function(row) {
        return this.bgTokenizer.getState(row);
    };
    this.getTokens = function(row) {
        return this.bgTokenizer.getTokens(row);
    };
    this.getTokenAt = function(row, column) {
        var tokens = this.bgTokenizer.getTokens(row);
        var token, c = 0;
        if (column == null) {
            var i = tokens.length - 1;
            c = this.getLine(row).length;
        } else {
            for (var i = 0; i < tokens.length; i++) {
                c += tokens[i].value.length;
                if (c >= column)
                    break;
            }
        }
        token = tokens[i];
        if (!token)
            return null;
        token.index = i;
        token.start = c - token.value.length;
        return token;
    };
    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        
        if (this.$informUndoManager)
            this.$informUndoManager.cancel();
        
        if (undoManager) {
            var self = this;
            undoManager.addSession(this);
            this.$syncInformUndoManager = function() {
                self.$informUndoManager.cancel();
                self.mergeUndoDeltas = false;
            };
            this.$informUndoManager = lang.delayedCall(this.$syncInformUndoManager);
        } else {
            this.$syncInformUndoManager = function() {};
        }
    };
    this.markUndoGroup = function() {
        if (this.$syncInformUndoManager)
            this.$syncInformUndoManager();
    };
    
    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {},
        reset: function() {},
        add: function() {},
        addSelection: function() {},
        startNewGroup: function() {},
        addSession: function() {}
    };
    this.getUndoManager = function() {
        return this.$undoManager || this.$defaultUndoManager;
    };
    this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };
    this.setUseSoftTabs = function(val) {
        this.setOption("useSoftTabs", val);
    };
    this.getUseSoftTabs = function() {
        return this.$useSoftTabs && !this.$mode.$indentWithTabs;
    };
    this.setTabSize = function(tabSize) {
        this.setOption("tabSize", tabSize);
    };
    this.getTabSize = function() {
        return this.$tabSize;
    };
    this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize === 0);
    };
    this.setNavigateWithinSoftTabs = function (navigateWithinSoftTabs) {
        this.setOption("navigateWithinSoftTabs", navigateWithinSoftTabs);
    };
    this.getNavigateWithinSoftTabs = function() {
        return this.$navigateWithinSoftTabs;
    };

    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
        this.setOption("overwrite", overwrite);
    };
    this.getOverwrite = function() {
        return this.$overwrite;
    };
    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };
    this.addGutterDecoration = function(row, className) {
        if (!this.$decorations[row])
            this.$decorations[row] = "";
        this.$decorations[row] += " " + className;
        this._signal("changeBreakpoint", {});
    };
    this.removeGutterDecoration = function(row, className) {
        this.$decorations[row] = (this.$decorations[row] || "").replace(" " + className, "");
        this._signal("changeBreakpoint", {});
    };
    this.getBreakpoints = function() {
        return this.$breakpoints;
    };
    this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = "ace_breakpoint";
        }
        this._signal("changeBreakpoint", {});
    };
    this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this._signal("changeBreakpoint", {});
    };
    this.setBreakpoint = function(row, className) {
        if (className === undefined)
            className = "ace_breakpoint";
        if (className)
            this.$breakpoints[row] = className;
        else
            delete this.$breakpoints[row];
        this._signal("changeBreakpoint", {});
    };
    this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this._signal("changeBreakpoint", {});
    };
    this.addMarker = function(range, clazz, type, inFront) {
        var id = this.$markerId++;

        var marker = {
            range : range,
            type : type || "line",
            renderer: typeof type == "function" ? type : null,
            clazz : clazz,
            inFront: !!inFront,
            id: id
        };

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._signal("changeFrontMarker");
        } else {
            this.$backMarkers[id] = marker;
            this._signal("changeBackMarker");
        }

        return id;
    };
    this.addDynamicMarker = function(marker, inFront) {
        if (!marker.update)
            return;
        var id = this.$markerId++;
        marker.id = id;
        marker.inFront = !!inFront;

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._signal("changeFrontMarker");
        } else {
            this.$backMarkers[id] = marker;
            this._signal("changeBackMarker");
        }

        return marker;
    };
    this.removeMarker = function(markerId) {
        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker)
            return;

        var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        delete (markers[markerId]);
        this._signal(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
    };
    this.getMarkers = function(inFront) {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    };

    this.highlight = function(re) {
        if (!this.$searchHighlight) {
            var highlight = new SearchHighlight(null, "ace_selected-word", "text");
            this.$searchHighlight = this.addDynamicMarker(highlight);
        }
        this.$searchHighlight.setRegexp(re);
    };
    this.highlightLines = function(startRow, endRow, clazz, inFront) {
        if (typeof endRow != "number") {
            clazz = endRow;
            endRow = startRow;
        }
        if (!clazz)
            clazz = "ace_step";

        var range = new Range(startRow, 0, endRow, Infinity);
        range.id = this.addMarker(range, clazz, "fullLine", inFront);
        return range;
    };
    this.setAnnotations = function(annotations) {
        this.$annotations = annotations;
        this._signal("changeAnnotation", {});
    };
    this.getAnnotations = function() {
        return this.$annotations || [];
    };
    this.clearAnnotations = function() {
        this.setAnnotations([]);
    };
    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };
    this.getWordRange = function(row, column) {
        var line = this.getLine(row);

        var inToken = false;
        if (column > 0)
            inToken = !!line.charAt(column - 1).match(this.tokenRe);

        if (!inToken)
            inToken = !!line.charAt(column).match(this.tokenRe);

        if (inToken)
            var re = this.tokenRe;
        else if (/^\s+$/.test(line.slice(column-1, column+1)))
            var re = /\s/;
        else
            var re = this.nonTokenRe;

        var start = column;
        if (start > 0) {
            do {
                start--;
            }
            while (start >= 0 && line.charAt(start).match(re));
            start++;
        }

        var end = column;
        while (end < line.length && line.charAt(end).match(re)) {
            end++;
        }

        return new Range(row, start, row, end);
    };
    this.getAWordRange = function(row, column) {
        var wordRange = this.getWordRange(row, column);
        var line = this.getLine(wordRange.end.row);

        while (line.charAt(wordRange.end.column).match(/[ \t]/)) {
            wordRange.end.column += 1;
        }
        return wordRange;
    };
    this.setNewLineMode = function(newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };
    this.getNewLineMode = function() {
        return this.doc.getNewLineMode();
    };
    this.setUseWorker = function(useWorker) { this.setOption("useWorker", useWorker); };
    this.getUseWorker = function() { return this.$useWorker; };
    this.onReloadTokenizer = function(e) {
        var rows = e.data;
        this.bgTokenizer.start(rows.first);
        this._signal("tokenizerUpdate", e);
    };

    this.$modes = config.$modes;
    this.$mode = null;
    this.$modeId = null;
    this.setMode = function(mode, cb) {
        if (mode && typeof mode === "object") {
            if (mode.getTokenizer)
                return this.$onChangeMode(mode);
            var options = mode;
            var path = options.path;
        } else {
            path = mode || "ace/mode/text";
        }
        if (!this.$modes["ace/mode/text"])
            this.$modes["ace/mode/text"] = new TextMode();

        if (this.$modes[path] && !options) {
            this.$onChangeMode(this.$modes[path]);
            cb && cb();
            return;
        }
        this.$modeId = path;
        config.loadModule(["mode", path], function(m) {
            if (this.$modeId !== path)
                return cb && cb();
            if (this.$modes[path] && !options) {
                this.$onChangeMode(this.$modes[path]);
            } else if (m && m.Mode) {
                m = new m.Mode(options);
                if (!options) {
                    this.$modes[path] = m;
                    m.$id = path;
                }
                this.$onChangeMode(m);
            }
            cb && cb();
        }.bind(this));
        if (!this.$mode)
            this.$onChangeMode(this.$modes["ace/mode/text"], true);
    };

    this.$onChangeMode = function(mode, $isPlaceholder) {
        if (!$isPlaceholder)
            this.$modeId = mode.$id;
        if (this.$mode === mode) 
            return;

        this.$mode = mode;

        this.$stopWorker();

        if (this.$useWorker)
            this.$startWorker();

        var tokenizer = mode.getTokenizer();

        if(tokenizer.addEventListener !== undefined) {
            var onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer.addEventListener("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new BackgroundTokenizer(tokenizer);
            var _self = this;
            this.bgTokenizer.addEventListener("update", function(e) {
                _self._signal("tokenizerUpdate", e);
            });
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());

        this.tokenRe = mode.tokenRe;
        this.nonTokenRe = mode.nonTokenRe;

        
        if (!$isPlaceholder) {
            if (mode.attachToSession)
                mode.attachToSession(this);
            this.$options.wrapMethod.set.call(this, this.$wrapMethod);
            this.$setFolding(mode.foldingRules);
            this.bgTokenizer.start(0);
            this._emit("changeMode");
        }
    };

    this.$stopWorker = function() {
        if (this.$worker) {
            this.$worker.terminate();
            this.$worker = null;
        }
    };

    this.$startWorker = function() {
        try {
            this.$worker = this.$mode.createWorker(this);
        } catch (e) {
            config.warn("Could not load worker", e);
            this.$worker = null;
        }
    };
    this.getMode = function() {
        return this.$mode;
    };

    this.$scrollTop = 0;
    this.setScrollTop = function(scrollTop) {
        if (this.$scrollTop === scrollTop || isNaN(scrollTop))
            return;

        this.$scrollTop = scrollTop;
        this._signal("changeScrollTop", scrollTop);
    };
    this.getScrollTop = function() {
        return this.$scrollTop;
    };

    this.$scrollLeft = 0;
    this.setScrollLeft = function(scrollLeft) {
        if (this.$scrollLeft === scrollLeft || isNaN(scrollLeft))
            return;

        this.$scrollLeft = scrollLeft;
        this._signal("changeScrollLeft", scrollLeft);
    };
    this.getScrollLeft = function() {
        return this.$scrollLeft;
    };
    this.getScreenWidth = function() {
        this.$computeWidth();
        if (this.lineWidgets) 
            return Math.max(this.getLineWidgetMaxWidth(), this.screenWidth);
        return this.screenWidth;
    };
    
    this.getLineWidgetMaxWidth = function() {
        if (this.lineWidgetsWidth != null) return this.lineWidgetsWidth;
        var width = 0;
        this.lineWidgets.forEach(function(w) {
            if (w && w.screenWidth > width)
                width = w.screenWidth;
        });
        return this.lineWidgetWidth = width;
    };

    this.$computeWidth = function(force) {
        if (this.$modified || force) {
            this.$modified = false;

            if (this.$useWrapMode)
                return this.screenWidth = this.$wrapLimit;

            var lines = this.doc.getAllLines();
            var cache = this.$rowLengthCache;
            var longestScreenLine = 0;
            var foldIndex = 0;
            var foldLine = this.$foldData[foldIndex];
            var foldStart = foldLine ? foldLine.start.row : Infinity;
            var len = lines.length;

            for (var i = 0; i < len; i++) {
                if (i > foldStart) {
                    i = foldLine.end.row + 1;
                    if (i >= len)
                        break;
                    foldLine = this.$foldData[foldIndex++];
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }

                if (cache[i] == null)
                    cache[i] = this.$getStringScreenWidth(lines[i])[0];

                if (cache[i] > longestScreenLine)
                    longestScreenLine = cache[i];
            }
            this.screenWidth = longestScreenLine;
        }
    };
    this.getLine = function(row) {
        return this.doc.getLine(row);
    };
    this.getLines = function(firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };
    this.getLength = function() {
        return this.doc.getLength();
    };
    this.getTextRange = function(range) {
        return this.doc.getTextRange(range || this.selection.getRange());
    };
    this.insert = function(position, text) {
        return this.doc.insert(position, text);
    };
    this.remove = function(range) {
        return this.doc.remove(range);
    };
    this.removeFullLines = function(firstRow, lastRow){
        return this.doc.removeFullLines(firstRow, lastRow);
    };
    this.undoChanges = function(deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        for (var i = deltas.length - 1; i != -1; i--) {
            var delta = deltas[i];
            if (delta.action == "insert" || delta.action == "remove") {
                this.doc.revertDelta(delta);
            } else if (delta.folds) {
                this.addFolds(delta.folds);
            }
        }
        if (!dontSelect && this.$undoSelect) {
            if (deltas.selectionBefore)
                this.selection.fromJSON(deltas.selectionBefore);
            else
                this.selection.setRange(this.$getUndoSelection(deltas, true));
        }
        this.$fromUndo = false;
    };
    this.redoChanges = function(deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            if (delta.action == "insert" || delta.action == "remove") {
                this.doc.applyDelta(delta);
            }
        }

        if (!dontSelect && this.$undoSelect) {
            if (deltas.selectionAfter)
                this.selection.fromJSON(deltas.selectionAfter);
            else
                this.selection.setRange(this.$getUndoSelection(deltas, false));
        }
        this.$fromUndo = false;
    };
    this.setUndoSelect = function(enable) {
        this.$undoSelect = enable;
    };

    this.$getUndoSelection = function(deltas, isUndo) {
        function isInsert(delta) {
            return isUndo ? delta.action !== "insert" : delta.action === "insert";
        }

        var range, point;
        var lastDeltaIsInsert;

        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            if (!delta.start) continue; // skip folds
            if (!range) {
                if (isInsert(delta)) {
                    range = Range.fromPoints(delta.start, delta.end);
                    lastDeltaIsInsert = true;
                } else {
                    range = Range.fromPoints(delta.start, delta.start);
                    lastDeltaIsInsert = false;
                }
                continue;
            }
            
            if (isInsert(delta)) {
                point = delta.start;
                if (range.compare(point.row, point.column) == -1) {
                    range.setStart(point);
                }
                point = delta.end;
                if (range.compare(point.row, point.column) == 1) {
                    range.setEnd(point);
                }
                lastDeltaIsInsert = true;
            } else {
                point = delta.start;
                if (range.compare(point.row, point.column) == -1) {
                    range = Range.fromPoints(delta.start, delta.start);
                }
                lastDeltaIsInsert = false;
            }
        }
        return range;
    };
    this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };
    this.moveText = function(fromRange, toPosition, copy) {
        var text = this.getTextRange(fromRange);
        var folds = this.getFoldsInRange(fromRange);

        var toRange = Range.fromPoints(toPosition, toPosition);
        if (!copy) {
            this.remove(fromRange);
            var rowDiff = fromRange.start.row - fromRange.end.row;
            var collDiff = rowDiff ? -fromRange.end.column : fromRange.start.column - fromRange.end.column;
            if (collDiff) {
                if (toRange.start.row == fromRange.end.row && toRange.start.column > fromRange.end.column)
                    toRange.start.column += collDiff;
                if (toRange.end.row == fromRange.end.row && toRange.end.column > fromRange.end.column)
                    toRange.end.column += collDiff;
            }
            if (rowDiff && toRange.start.row >= fromRange.end.row) {
                toRange.start.row += rowDiff;
                toRange.end.row += rowDiff;
            }
        }

        toRange.end = this.insert(toRange.start, text);
        if (folds.length) {
            var oldStart = fromRange.start;
            var newStart = toRange.start;
            var rowDiff = newStart.row - oldStart.row;
            var collDiff = newStart.column - oldStart.column;
            this.addFolds(folds.map(function(x) {
                x = x.clone();
                if (x.start.row == oldStart.row)
                    x.start.column += collDiff;
                if (x.end.row == oldStart.row)
                    x.end.column += collDiff;
                x.start.row += rowDiff;
                x.end.row += rowDiff;
                return x;
            }));
        }

        return toRange;
    };
    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++)
            this.doc.insertInLine({row: row, column: 0}, indentString);
    };
    this.outdentRows = function (range) {
        var rowRange = range.collapseRows();
        var deleteRange = new Range(0, 0, 0, 0);
        var size = this.getTabSize();

        for (var i = rowRange.start.row; i <= rowRange.end.row; ++i) {
            var line = this.getLine(i);

            deleteRange.start.row = i;
            deleteRange.end.row = i;
            for (var j = 0; j < size; ++j)
                if (line.charAt(j) != ' ')
                    break;
            if (j < size && line.charAt(j) == '\t') {
                deleteRange.start.column = j;
                deleteRange.end.column = j + 1;
            } else {
                deleteRange.start.column = 0;
                deleteRange.end.column = j;
            }
            this.remove(deleteRange);
        }
    };

    this.$moveLines = function(firstRow, lastRow, dir) {
        firstRow = this.getRowFoldStart(firstRow);
        lastRow = this.getRowFoldEnd(lastRow);
        if (dir < 0) {
            var row = this.getRowFoldStart(firstRow + dir);
            if (row < 0) return 0;
            var diff = row-firstRow;
        } else if (dir > 0) {
            var row = this.getRowFoldEnd(lastRow + dir);
            if (row > this.doc.getLength()-1) return 0;
            var diff = row-lastRow;
        } else {
            firstRow = this.$clipRowToDocument(firstRow);
            lastRow = this.$clipRowToDocument(lastRow);
            var diff = lastRow - firstRow + 1;
        }

        var range = new Range(firstRow, 0, lastRow, Number.MAX_VALUE);
        var folds = this.getFoldsInRange(range).map(function(x){
            x = x.clone();
            x.start.row += diff;
            x.end.row += diff;
            return x;
        });
        
        var lines = dir == 0
            ? this.doc.getLines(firstRow, lastRow)
            : this.doc.removeFullLines(firstRow, lastRow);
        this.doc.insertFullLines(firstRow+diff, lines);
        folds.length && this.addFolds(folds);
        return diff;
    };
    this.moveLinesUp = function(firstRow, lastRow) {
        return this.$moveLines(firstRow, lastRow, -1);
    };
    this.moveLinesDown = function(firstRow, lastRow) {
        return this.$moveLines(firstRow, lastRow, 1);
    };
    this.duplicateLines = function(firstRow, lastRow) {
        return this.$moveLines(firstRow, lastRow, 0);
    };


    this.$clipRowToDocument = function(row) {
        return Math.max(0, Math.min(row, this.doc.getLength()-1));
    };

    this.$clipColumnToRow = function(row, column) {
        if (column < 0)
            return 0;
        return Math.min(this.doc.getLine(row).length, column);
    };


    this.$clipPositionToDocument = function(row, column) {
        column = Math.max(0, column);

        if (row < 0) {
            row = 0;
            column = 0;
        } else {
            var len = this.doc.getLength();
            if (row >= len) {
                row = len - 1;
                column = this.doc.getLine(len-1).length;
            } else {
                column = Math.min(this.doc.getLine(row).length, column);
            }
        }

        return {
            row: row,
            column: column
        };
    };

    this.$clipRangeToDocument = function(range) {
        if (range.start.row < 0) {
            range.start.row = 0;
            range.start.column = 0;
        } else {
            range.start.column = this.$clipColumnToRow(
                range.start.row,
                range.start.column
            );
        }

        var len = this.doc.getLength() - 1;
        if (range.end.row > len) {
            range.end.row = len;
            range.end.column = this.doc.getLine(len).length;
        } else {
            range.end.column = this.$clipColumnToRow(
                range.end.row,
                range.end.column
            );
        }
        return range;
    };
    this.$wrapLimit = 80;
    this.$useWrapMode = false;
    this.$wrapLimitRange = {
        min : null,
        max : null
    };
    this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;
            this.$resetRowCache(0);
            if (useWrapMode) {
                var len = this.getLength();
                this.$wrapData = Array(len);
                this.$updateWrapData(0, len - 1);
            }

            this._signal("changeWrapMode");
        }
    };
    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };
    this.setWrapLimitRange = function(min, max) {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange = { min: min, max: max };
            this.$modified = true;
            this.$bidiHandler.markAsDirty();
            if (this.$useWrapMode)
                this._signal("changeWrapMode");
        }
    };
    this.adjustWrapLimit = function(desiredLimit, $printMargin) {
        var limits = this.$wrapLimitRange;
        if (limits.max < 0)
            limits = {min: $printMargin, max: $printMargin};
        var wrapLimit = this.$constrainWrapLimit(desiredLimit, limits.min, limits.max);
        if (wrapLimit != this.$wrapLimit && wrapLimit > 1) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this.$resetRowCache(0);
                this._signal("changeWrapLimit");
            }
            return true;
        }
        return false;
    };

    this.$constrainWrapLimit = function(wrapLimit, min, max) {
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        return wrapLimit;
    };
    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };
    this.setWrapLimit = function (limit) {
        this.setWrapLimitRange(limit, limit);
    };
    this.getWrapLimitRange = function() {
        return {
            min : this.$wrapLimitRange.min,
            max : this.$wrapLimitRange.max
        };
    };

    this.$updateInternalDataOnChange = function(delta) {
        var useWrapMode = this.$useWrapMode;
        var action = delta.action;
        var start = delta.start;
        var end = delta.end;
        var firstRow = start.row;
        var lastRow = end.row;
        var len = lastRow - firstRow;
        var removedFolds = null;
        
        this.$updating = true;
        if (len != 0) {
            if (action === "remove") {
                this[useWrapMode ? "$wrapData" : "$rowLengthCache"].splice(firstRow, len);

                var foldLines = this.$foldData;
                removedFolds = this.getFoldsInRange(delta);
                this.removeFolds(removedFolds);

                var foldLine = this.getFoldLine(end.row);
                var idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    var foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= end.row) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            } else {
                var args = Array(len);
                args.unshift(firstRow, 0);
                var arr = useWrapMode ? this.$wrapData : this.$rowLengthCache;
                arr.splice.apply(arr, args);
                var foldLines = this.$foldData;
                var foldLine = this.getFoldLine(firstRow);
                var idx = 0;
                if (foldLine) {
                    var cmp = foldLine.range.compareInside(start.row, start.column);
                    if (cmp == 0) {
                        foldLine = foldLine.split(start.row, start.column);
                        if (foldLine) {
                            foldLine.shiftRow(len);
                            foldLine.addRemoveChars(lastRow, 0, end.column - start.column);
                        }
                    } else
                    if (cmp == -1) {
                        foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                        foldLine.shiftRow(len);
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        } else {
            len = Math.abs(delta.start.column - delta.end.column);
            if (action === "remove") {
                removedFolds = this.getFoldsInRange(delta);
                this.removeFolds(removedFolds);

                len = -len;
            }
            var foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length != this.doc.getLength()) {
            console.error("doc.getLength() and $wrapData.length have to be the same!");
        }
        this.$updating = false;

        if (useWrapMode)
            this.$updateWrapData(firstRow, lastRow);
        else
            this.$updateRowLengthCache(firstRow, lastRow);

        return removedFolds;
    };

    this.$updateRowLengthCache = function(firstRow, lastRow, b) {
        this.$rowLengthCache[firstRow] = null;
        this.$rowLengthCache[lastRow] = null;
    };

    this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;
        var tokens;
        var foldLine;

        var row = firstRow;
        lastRow = Math.min(lastRow, lines.length - 1);
        while (row <= lastRow) {
            foldLine = this.getFoldLine(row, foldLine);
            if (!foldLine) {
                tokens = this.$getDisplayTokens(lines[row]);
                wrapData[row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row ++;
            } else {
                tokens = [];
                foldLine.walk(function(placeholder, row, column, lastColumn) {
                        var walkTokens;
                        if (placeholder != null) {
                            walkTokens = this.$getDisplayTokens(
                                            placeholder, tokens.length);
                            walkTokens[0] = PLACEHOLDER_START;
                            for (var i = 1; i < walkTokens.length; i++) {
                                walkTokens[i] = PLACEHOLDER_BODY;
                            }
                        } else {
                            walkTokens = this.$getDisplayTokens(
                                lines[row].substring(lastColumn, column),
                                tokens.length);
                        }
                        tokens = tokens.concat(walkTokens);
                    }.bind(this),
                    foldLine.end.row,
                    lines[foldLine.end.row].length + 1
                );

                wrapData[foldLine.start.row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row = foldLine.end.row + 1;
            }
        }
    };
    var CHAR = 1,
        CHAR_EXT = 2,
        PLACEHOLDER_START = 3,
        PLACEHOLDER_BODY =  4,
        PUNCTUATION = 9,
        SPACE = 10,
        TAB = 11,
        TAB_SPACE = 12;


    this.$computeWrapSplits = function(tokens, wrapLimit, tabSize) {
        if (tokens.length == 0) {
            return [];
        }

        var splits = [];
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        var isCode = this.$wrapAsCode;

        var indentedSoftWrap = this.$indentedSoftWrap;
        var maxIndent = wrapLimit <= Math.max(2 * tabSize, 8)
            || indentedSoftWrap === false ? 0 : Math.floor(wrapLimit / 2);

        function getWrapIndent() {
            var indentation = 0;
            if (maxIndent === 0)
                return indentation;
            if (indentedSoftWrap) {
                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];
                    if (token == SPACE)
                        indentation += 1;
                    else if (token == TAB)
                        indentation += tabSize;
                    else if (token == TAB_SPACE)
                        continue;
                    else
                        break;
                }
            }
            if (isCode && indentedSoftWrap !== false)
                indentation += tabSize;
            return Math.min(indentation, maxIndent);
        }
        function addSplit(screenPos) {
            var len = screenPos - lastSplit;
            for (var i = lastSplit; i < screenPos; i++) {
                var ch = tokens[i];
                if (ch === 12 || ch === 2) len -= 1;
            }

            if (!splits.length) {
                indent = getWrapIndent();
                splits.indent = indent;
            }
            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }
        var indent = 0;
        while (displayLength - lastSplit > wrapLimit - indent) {
            var split = lastSplit + wrapLimit - indent;
            if (tokens[split - 1] >= SPACE && tokens[split] >= SPACE) {
                addSplit(split);
                continue;
            }
            if (tokens[split] == PLACEHOLDER_START || tokens[split] == PLACEHOLDER_BODY) {
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] == PLACEHOLDER_START) {
                        break;
                    }
                }
                if (split > lastSplit) {
                    addSplit(split);
                    continue;
                }
                split = lastSplit + wrapLimit;
                for (split; split < tokens.length; split++) {
                    if (tokens[split] != PLACEHOLDER_BODY) {
                        break;
                    }
                }
                if (split == tokens.length) {
                    break;  // Breaks the while-loop.
                }
                addSplit(split);
                continue;
            }
            var minSplit = Math.max(split - (wrapLimit -(wrapLimit>>2)), lastSplit - 1);
            while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                split --;
            }
            if (isCode) {
                while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                    split --;
                }
                while (split > minSplit && tokens[split] == PUNCTUATION) {
                    split --;
                }
            } else {
                while (split > minSplit && tokens[split] < SPACE) {
                    split --;
                }
            }
            if (split > minSplit) {
                addSplit(++split);
                continue;
            }
            split = lastSplit + wrapLimit;
            if (tokens[split] == CHAR_EXT)
                split--;
            addSplit(split - indent);
        }
        return splits;
    };
    this.$getDisplayTokens = function(str, offset) {
        var arr = [];
        var tabSize;
        offset = offset || 0;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c == 9) {
                tabSize = this.getScreenTabSize(arr.length + offset);
                arr.push(TAB);
                for (var n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            }
            else if (c == 32) {
                arr.push(SPACE);
            } else if((c > 39 && c < 48) || (c > 57 && c < 64)) {
                arr.push(PUNCTUATION);
            }
            else if (c >= 0x1100 && isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    };
    this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
        if (maxScreenColumn == 0)
            return [0, 0];
        if (maxScreenColumn == null)
            maxScreenColumn = Infinity;
        screenColumn = screenColumn || 0;

        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            else if (c >= 0x1100 && isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break;
            }
        }

        return [screenColumn, column];
    };

    this.lineWidgets = null;
    this.getRowLength = function(row) {
        if (this.lineWidgets)
            var h = this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0;
        else 
            h = 0;
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1 + h;
        } else {
            return this.$wrapData[row].length + 1 + h;
        }
    };
    this.getRowLineCount = function(row) {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        } else {
            return this.$wrapData[row].length + 1;
        }
    };

    this.getRowWrapIndent = function(screenRow) {
        if (this.$useWrapMode) {
            var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
            var splits = this.$wrapData[pos.row];
            return splits.length && splits[0] < pos.column ? splits.indent : 0;
        } else {
            return 0;
        }
    };
    this.getScreenLastRowColumn = function(screenRow) {
        var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
        return this.documentToScreenColumn(pos.row, pos.column);
    };
    this.getDocumentLastRowColumn = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    };
    this.getDocumentLastRowColumnPosition = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
    };
    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };
    this.getScreenTabSize = function(screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };


    this.screenToDocumentRow = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    };


    this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };
    this.screenToDocumentPosition = function(screenRow, screenColumn, offsetX) {
        if (screenRow < 0)
            return {row: 0, column: 0};

        var line;
        var docRow = 0;
        var docColumn = 0;
        var column;
        var row = 0;
        var rowLength = 0;

        var rowCache = this.$screenRowCache;
        var i = this.$getRowCacheIndex(rowCache, screenRow);
        var l = rowCache.length;
        if (l && i >= 0) {
            var row = rowCache[i];
            var docRow = this.$docRowCache[i];
            var doCache = screenRow > rowCache[l - 1];
        } else {
            var doCache = !l;
        }

        var maxRow = this.getLength() - 1;
        var foldLine = this.getNextFoldLine(docRow);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row <= screenRow) {
            rowLength = this.getRowLength(docRow);
            if (row + rowLength > screenRow || docRow >= maxRow) {
                break;
            } else {
                row += rowLength;
                docRow++;
                if (docRow > foldStart) {
                    docRow = foldLine.end.row+1;
                    foldLine = this.getNextFoldLine(docRow, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }

            if (doCache) {
                this.$docRowCache.push(docRow);
                this.$screenRowCache.push(row);
            }
        }

        if (foldLine && foldLine.start.row <= docRow) {
            line = this.getFoldDisplayLine(foldLine);
            docRow = foldLine.start.row;
        } else if (row + rowLength <= screenRow || docRow > maxRow) {
            return {
                row: maxRow,
                column: this.getLine(maxRow).length
            };
        } else {
            line = this.getLine(docRow);
            foldLine = null;
        }
        var wrapIndent = 0, splitIndex = Math.floor(screenRow - row);
        if (this.$useWrapMode) {
            var splits = this.$wrapData[docRow];
            if (splits) {
                column = splits[splitIndex];
                if(splitIndex > 0 && splits.length) {
                    wrapIndent = splits.indent;
                    docColumn = splits[splitIndex - 1] || splits[splits.length - 1];
                    line = line.substring(docColumn);
                }
            }
        }

        if (offsetX !== undefined && this.$bidiHandler.isBidiRow(row + splitIndex, docRow, splitIndex))
            screenColumn = this.$bidiHandler.offsetToCol(offsetX);

        docColumn += this.$getStringScreenWidth(line, screenColumn - wrapIndent)[1];
        if (this.$useWrapMode && docColumn >= column)
            docColumn = column - 1;

        if (foldLine)
            return foldLine.idxToPosition(docColumn);

        return {row: docRow, column: docColumn};
    };
    this.documentToScreenPosition = function(docRow, docColumn) {
        if (typeof docColumn === "undefined")
            var pos = this.$clipPositionToDocument(docRow.row, docRow.column);
        else
            pos = this.$clipPositionToDocument(docRow, docColumn);

        docRow = pos.row;
        docColumn = pos.column;

        var screenRow = 0;
        var foldStartRow = null;
        var fold = null;
        fold = this.getFoldAt(docRow, docColumn, 1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        var rowEnd, row = 0;


        var rowCache = this.$docRowCache;
        var i = this.$getRowCacheIndex(rowCache, docRow);
        var l = rowCache.length;
        if (l && i >= 0) {
            var row = rowCache[i];
            var screenRow = this.$screenRowCache[i];
            var doCache = docRow > rowCache[l - 1];
        } else {
            var doCache = !l;
        }

        var foldLine = this.getNextFoldLine(row);
        var foldStart = foldLine ?foldLine.start.row :Infinity;

        while (row < docRow) {
            if (row >= foldStart) {
                rowEnd = foldLine.end.row + 1;
                if (rowEnd > docRow)
                    break;
                foldLine = this.getNextFoldLine(rowEnd, foldLine);
                foldStart = foldLine ?foldLine.start.row :Infinity;
            }
            else {
                rowEnd = row + 1;
            }

            screenRow += this.getRowLength(row);
            row = rowEnd;

            if (doCache) {
                this.$docRowCache.push(row);
                this.$screenRowCache.push(screenRow);
            }
        }
        var textLine = "";
        if (foldLine && row >= foldStart) {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
            foldStartRow = foldLine.start.row;
        } else {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        }
        var wrapIndent = 0;
        if (this.$useWrapMode) {
            var wrapRow = this.$wrapData[foldStartRow];
            if (wrapRow) {
                var screenRowOffset = 0;
                while (textLine.length >= wrapRow[screenRowOffset]) {
                    screenRow ++;
                    screenRowOffset++;
                }
                textLine = textLine.substring(
                    wrapRow[screenRowOffset - 1] || 0, textLine.length
                );
                wrapIndent = screenRowOffset > 0 ? wrapRow.indent : 0;
            }
        }

        return {
            row: screenRow,
            column: wrapIndent + this.$getStringScreenWidth(textLine)[0]
        };
    };
    this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };
    this.documentToScreenRow = function(docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).row;
    };
    this.getScreenLength = function() {
        var screenRows = 0;
        var fold = null;
        if (!this.$useWrapMode) {
            screenRows = this.getLength();
            var foldData = this.$foldData;
            for (var i = 0; i < foldData.length; i++) {
                fold = foldData[i];
                screenRows -= fold.end.row - fold.start.row;
            }
        } else {
            var lastRow = this.$wrapData.length;
            var row = 0, i = 0;
            var fold = this.$foldData[i++];
            var foldStart = fold ? fold.start.row :Infinity;

            while (row < lastRow) {
                var splits = this.$wrapData[row];
                screenRows += splits ? splits.length + 1 : 1;
                row ++;
                if (row > foldStart) {
                    row = fold.end.row+1;
                    fold = this.$foldData[i++];
                    foldStart = fold ?fold.start.row :Infinity;
                }
            }
        }
        if (this.lineWidgets)
            screenRows += this.$getWidgetScreenLength();

        return screenRows;
    };
    this.$setFontMetrics = function(fm) {
        if (!this.$enableVarChar) return;
        this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
            if (maxScreenColumn === 0)
                return [0, 0];
            if (!maxScreenColumn)
                maxScreenColumn = Infinity;
            screenColumn = screenColumn || 0;
            
            var c, column;
            for (column = 0; column < str.length; column++) {
                c = str.charAt(column);
                if (c === "\t") {
                    screenColumn += this.getScreenTabSize(screenColumn);
                } else {
                    screenColumn += fm.getCharacterWidth(c);
                }
                if (screenColumn > maxScreenColumn) {
                    break;
                }
            }
            
            return [screenColumn, column];
        };
    };
    
    this.destroy = function() {
        if (this.bgTokenizer) {
            this.bgTokenizer.setDocument(null);
            this.bgTokenizer = null;
        }
        this.$stopWorker();
    };

    this.isFullWidth = isFullWidth;
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
               c >= 0x11A3 && c <= 0x11A7 ||
               c >= 0x11FA && c <= 0x11FF ||
               c >= 0x2329 && c <= 0x232A ||
               c >= 0x2E80 && c <= 0x2E99 ||
               c >= 0x2E9B && c <= 0x2EF3 ||
               c >= 0x2F00 && c <= 0x2FD5 ||
               c >= 0x2FF0 && c <= 0x2FFB ||
               c >= 0x3000 && c <= 0x303E ||
               c >= 0x3041 && c <= 0x3096 ||
               c >= 0x3099 && c <= 0x30FF ||
               c >= 0x3105 && c <= 0x312D ||
               c >= 0x3131 && c <= 0x318E ||
               c >= 0x3190 && c <= 0x31BA ||
               c >= 0x31C0 && c <= 0x31E3 ||
               c >= 0x31F0 && c <= 0x321E ||
               c >= 0x3220 && c <= 0x3247 ||
               c >= 0x3250 && c <= 0x32FE ||
               c >= 0x3300 && c <= 0x4DBF ||
               c >= 0x4E00 && c <= 0xA48C ||
               c >= 0xA490 && c <= 0xA4C6 ||
               c >= 0xA960 && c <= 0xA97C ||
               c >= 0xAC00 && c <= 0xD7A3 ||
               c >= 0xD7B0 && c <= 0xD7C6 ||
               c >= 0xD7CB && c <= 0xD7FB ||
               c >= 0xF900 && c <= 0xFAFF ||
               c >= 0xFE10 && c <= 0xFE19 ||
               c >= 0xFE30 && c <= 0xFE52 ||
               c >= 0xFE54 && c <= 0xFE66 ||
               c >= 0xFE68 && c <= 0xFE6B ||
               c >= 0xFF01 && c <= 0xFF60 ||
               c >= 0xFFE0 && c <= 0xFFE6;
    }

}).call(EditSession.prototype);

require("./edit_session/folding").Folding.call(EditSession.prototype);
require("./edit_session/bracket_match").BracketMatch.call(EditSession.prototype);


config.defineOptions(EditSession.prototype, "session", {
    wrap: {
        set: function(value) {
            if (!value || value == "off")
                value = false;
            else if (value == "free")
                value = true;
            else if (value == "printMargin")
                value = -1;
            else if (typeof value == "string")
                value = parseInt(value, 10) || false;

            if (this.$wrap == value)
                return;
            this.$wrap = value;
            if (!value) {
                this.setUseWrapMode(false);
            } else {
                var col = typeof value == "number" ? value : null;
                this.setWrapLimitRange(col, col);
                this.setUseWrapMode(true);
            }
        },
        get: function() {
            if (this.getUseWrapMode()) {
                if (this.$wrap == -1)
                    return "printMargin";
                if (!this.getWrapLimitRange().min)
                    return "free";
                return this.$wrap;
            }
            return "off";
        },
        handlesSet: true
    },    
    wrapMethod: {
        set: function(val) {
            val = val == "auto"
                ? this.$mode.type != "text"
                : val != "text";
            if (val != this.$wrapAsCode) {
                this.$wrapAsCode = val;
                if (this.$useWrapMode) {
                    this.$useWrapMode = false;
                    this.setUseWrapMode(true);
                }
            }
        },
        initialValue: "auto"
    },
    indentedSoftWrap: {
        set: function() {
            if (this.$useWrapMode) {
                this.$useWrapMode = false;
                this.setUseWrapMode(true);
            }
        },
        initialValue: true 
    },
    firstLineNumber: {
        set: function() {this._signal("changeBreakpoint");},
        initialValue: 1
    },
    useWorker: {
        set: function(useWorker) {
            this.$useWorker = useWorker;

            this.$stopWorker();
            if (useWorker)
                this.$startWorker();
        },
        initialValue: true
    },
    useSoftTabs: {initialValue: true},
    tabSize: {
        set: function(tabSize) {
            tabSize = parseInt(tabSize);
            if (isNaN(tabSize) || this.$tabSize === tabSize) return;

            this.$modified = true;
            this.$rowLengthCache = [];
            this.$tabSize = tabSize;
            this._signal("changeTabSize");
        },
        initialValue: 4,
        handlesSet: true
    },
    navigateWithinSoftTabs: {initialValue: false},
    foldStyle: {
        set: function(val) {this.setFoldStyle(val);},
        handlesSet: true
    },
    overwrite: {
        set: function(val) {this._signal("changeOverwrite");},
        initialValue: false
    },
    newLineMode: {
        set: function(val) {this.doc.setNewLineMode(val);},
        get: function() {return this.doc.getNewLineMode();},
        handlesSet: true
    },
    mode: {
        set: function(val) { this.setMode(val); },
        get: function() { return this.$modeId; },
        handlesSet: true
    }
});

exports.EditSession = EditSession;
});

ace.define("ace/search",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/range"], function(require, exports, module) {
"use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

var Search = function() {
    this.$options = {};
};

(function() {
    this.set = function(options) {
        oop.mixin(this.$options, options);
        return this;
    };
    this.getOptions = function() {
        return lang.copyObject(this.$options);
    };
    this.setOptions = function(options) {
        this.$options = options;
    };
    this.find = function(session) {
        var options = this.$options;
        var iterator = this.$matchIterator(session, options);
        if (!iterator)
            return false;

        var firstRange = null;
        iterator.forEach(function(sr, sc, er, ec) {
            firstRange = new Range(sr, sc, er, ec);
            if (sc == ec && options.start && options.start.start
                && options.skipCurrent != false && firstRange.isEqual(options.start)
            ) {
                firstRange = null;
                return false;
            }
            
            return true;
        });

        return firstRange;
    };
    this.findAll = function(session) {
        var options = this.$options;
        if (!options.needle)
            return [];
        this.$assembleRegExp(options);

        var range = options.range;
        var lines = range
            ? session.getLines(range.start.row, range.end.row)
            : session.doc.getAllLines();

        var ranges = [];
        var re = options.re;
        if (options.$isMultiLine) {
            var len = re.length;
            var maxRow = lines.length - len;
            var prevRange;
            outer: for (var row = re.offset || 0; row <= maxRow; row++) {
                for (var j = 0; j < len; j++)
                    if (lines[row + j].search(re[j]) == -1)
                        continue outer;
                
                var startLine = lines[row];
                var line = lines[row + len - 1];
                var startIndex = startLine.length - startLine.match(re[0])[0].length;
                var endIndex = line.match(re[len - 1])[0].length;
                
                if (prevRange && prevRange.end.row === row &&
                    prevRange.end.column > startIndex
                ) {
                    continue;
                }
                ranges.push(prevRange = new Range(
                    row, startIndex, row + len - 1, endIndex
                ));
                if (len > 2)
                    row = row + len - 2;
            }
        } else {
            for (var i = 0; i < lines.length; i++) {
                var matches = lang.getMatchOffsets(lines[i], re);
                for (var j = 0; j < matches.length; j++) {
                    var match = matches[j];
                    ranges.push(new Range(i, match.offset, i, match.offset + match.length));
                }
            }
        }

        if (range) {
            var startColumn = range.start.column;
            var endColumn = range.start.column;
            var i = 0, j = ranges.length - 1;
            while (i < j && ranges[i].start.column < startColumn && ranges[i].start.row == range.start.row)
                i++;

            while (i < j && ranges[j].end.column > endColumn && ranges[j].end.row == range.end.row)
                j--;
            
            ranges = ranges.slice(i, j + 1);
            for (i = 0, j = ranges.length; i < j; i++) {
                ranges[i].start.row += range.start.row;
                ranges[i].end.row += range.start.row;
            }
        }

        return ranges;
    };
    this.replace = function(input, replacement) {
        var options = this.$options;

        var re = this.$assembleRegExp(options);
        if (options.$isMultiLine)
            return replacement;

        if (!re)
            return;

        var match = re.exec(input);
        if (!match || match[0].length != input.length)
            return null;
        
        replacement = input.replace(re, replacement);
        if (options.preserveCase) {
            replacement = replacement.split("");
            for (var i = Math.min(input.length, input.length); i--; ) {
                var ch = input[i];
                if (ch && ch.toLowerCase() != ch)
                    replacement[i] = replacement[i].toUpperCase();
                else
                    replacement[i] = replacement[i].toLowerCase();
            }
            replacement = replacement.join("");
        }
        
        return replacement;
    };

    this.$assembleRegExp = function(options, $disableFakeMultiline) {
        if (options.needle instanceof RegExp)
            return options.re = options.needle;

        var needle = options.needle;

        if (!options.needle)
            return options.re = false;

        if (!options.regExp)
            needle = lang.escapeRegExp(needle);

        if (options.wholeWord)
            needle = addWordBoundary(needle, options);

        var modifier = options.caseSensitive ? "gm" : "gmi";

        options.$isMultiLine = !$disableFakeMultiline && /[\n\r]/.test(needle);
        if (options.$isMultiLine)
            return options.re = this.$assembleMultilineRegExp(needle, modifier);

        try {
            var re = new RegExp(needle, modifier);
        } catch(e) {
            re = false;
        }
        return options.re = re;
    };

    this.$assembleMultilineRegExp = function(needle, modifier) {
        var parts = needle.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
        var re = [];
        for (var i = 0; i < parts.length; i++) try {
            re.push(new RegExp(parts[i], modifier));
        } catch(e) {
            return false;
        }
        return re;
    };

    this.$matchIterator = function(session, options) {
        var re = this.$assembleRegExp(options);
        if (!re)
            return false;
        var backwards = options.backwards == true;
        var skipCurrent = options.skipCurrent != false;

        var range = options.range;
        var start = options.start;
        if (!start)
            start = range ? range[backwards ? "end" : "start"] : session.selection.getRange();
         
        if (start.start)
            start = start[skipCurrent != backwards ? "end" : "start"];

        var firstRow = range ? range.start.row : 0;
        var lastRow = range ? range.end.row : session.getLength() - 1;
        
        if (backwards) {
            var forEach = function(callback) {
                var row = start.row;
                if (forEachInLine(row, start.column, callback))
                    return;
                for (row--; row >= firstRow; row--)
                    if (forEachInLine(row, Number.MAX_VALUE, callback))
                        return;
                if (options.wrap == false)
                    return;
                for (row = lastRow, firstRow = start.row; row >= firstRow; row--)
                    if (forEachInLine(row, Number.MAX_VALUE, callback))
                        return;
            };
        }
        else {
            var forEach = function(callback) {
                var row = start.row;
                if (forEachInLine(row, start.column, callback))
                    return;
                for (row = row + 1; row <= lastRow; row++)
                    if (forEachInLine(row, 0, callback))
                        return;
                if (options.wrap == false)
                    return;
                for (row = firstRow, lastRow = start.row; row <= lastRow; row++)
                    if (forEachInLine(row, 0, callback))
                        return;
            };
        }
        
        if (options.$isMultiLine) {
            var len = re.length;
            var forEachInLine = function(row, offset, callback) {
                var startRow = backwards ? row - len + 1 : row;
                if (startRow < 0) return;
                var line = session.getLine(startRow);
                var startIndex = line.search(re[0]);
                if (!backwards && startIndex < offset || startIndex === -1) return;
                for (var i = 1; i < len; i++) {
                    line = session.getLine(startRow + i);
                    if (line.search(re[i]) == -1)
                        return;
                }
                var endIndex = line.match(re[len - 1])[0].length;
                if (backwards && endIndex > offset) return;
                if (callback(startRow, startIndex, startRow + len - 1, endIndex))
                    return true;
            };
        }
        else if (backwards) {
            var forEachInLine = function(row, endIndex, callback) {
                var line = session.getLine(row);
                var matches = [];
                var m, last = 0;
                re.lastIndex = 0;
                while((m = re.exec(line))) {
                    var length = m[0].length;
                    last = m.index;
                    if (!length) {
                        if (last >= line.length) break;
                        re.lastIndex = last += 1;
                    }
                    if (m.index + length > endIndex)
                        break;
                    matches.push(m.index, length);
                }
                for (var i = matches.length - 1; i >= 0; i -= 2) {
                    var column = matches[i - 1];
                    var length = matches[i];
                    if (callback(row, column, row, column + length))
                        return true;
                }
            };
        }
        else {
            var forEachInLine = function(row, startIndex, callback) {
                var line = session.getLine(row);
                var last;
                var m;
                re.lastIndex = startIndex;
                while((m = re.exec(line))) {
                    var length = m[0].length;
                    last = m.index;
                    if (callback(row, last, row,last + length))
                        return true;
                    if (!length) {
                        re.lastIndex = last += 1;
                        if (last >= line.length) return false;
                    }
                }
            };
        }
        return {forEach: forEach};
    };

}).call(Search.prototype);

function addWordBoundary(needle, options) {
    function wordBoundary(c) {
        if (/\w/.test(c) || options.regExp) return "\\b";
        return "";
    }
    return wordBoundary(needle[0]) + needle
        + wordBoundary(needle[needle.length - 1]);
}

exports.Search = Search;
});

ace.define("ace/keyboard/hash_handler",["require","exports","module","ace/lib/keys","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var keyUtil = require("../lib/keys");
var useragent = require("../lib/useragent");
var KEY_MODS = keyUtil.KEY_MODS;

function HashHandler(config, platform) {
    this.platform = platform || (useragent.isMac ? "mac" : "win");
    this.commands = {};
    this.commandKeyBinding = {};
    this.addCommands(config);
    this.$singleCommand = true;
}

function MultiHashHandler(config, platform) {
    HashHandler.call(this, config, platform);
    this.$singleCommand = false;
}

MultiHashHandler.prototype = HashHandler.prototype;

(function() {
    

    this.addCommand = function(command) {
        if (this.commands[command.name])
            this.removeCommand(command);

        this.commands[command.name] = command;

        if (command.bindKey)
            this._buildKeyHash(command);
    };

    this.removeCommand = function(command, keepCommand) {
        var name = command && (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        if (!keepCommand)
            delete this.commands[name];
        var ckb = this.commandKeyBinding;
        for (var keyId in ckb) {
            var cmdGroup = ckb[keyId];
            if (cmdGroup == command) {
                delete ckb[keyId];
            } else if (Array.isArray(cmdGroup)) {
                var i = cmdGroup.indexOf(command);
                if (i != -1) {
                    cmdGroup.splice(i, 1);
                    if (cmdGroup.length == 1)
                        ckb[keyId] = cmdGroup[0];
                }
            }
        }
    };

    this.bindKey = function(key, command, position) {
        if (typeof key == "object" && key) {
            if (position == undefined)
                position = key.position;
            key = key[this.platform];
        }
        if (!key)
            return;
        if (typeof command == "function")
            return this.addCommand({exec: command, bindKey: key, name: command.name || key});
        
        key.split("|").forEach(function(keyPart) {
            var chain = "";
            if (keyPart.indexOf(" ") != -1) {
                var parts = keyPart.split(/\s+/);
                keyPart = parts.pop();
                parts.forEach(function(keyPart) {
                    var binding = this.parseKeys(keyPart);
                    var id = KEY_MODS[binding.hashId] + binding.key;
                    chain += (chain ? " " : "") + id;
                    this._addCommandToBinding(chain, "chainKeys");
                }, this);
                chain += " ";
            }
            var binding = this.parseKeys(keyPart);
            var id = KEY_MODS[binding.hashId] + binding.key;
            this._addCommandToBinding(chain + id, command, position);
        }, this);
    };
    
    function getPosition(command) {
        return typeof command == "object" && command.bindKey
            && command.bindKey.position 
            || (command.isDefault ? -100 : 0);
    }
    this._addCommandToBinding = function(keyId, command, position) {
        var ckb = this.commandKeyBinding, i;
        if (!command) {
            delete ckb[keyId];
        } else if (!ckb[keyId] || this.$singleCommand) {
            ckb[keyId] = command;
        } else {
            if (!Array.isArray(ckb[keyId])) {
                ckb[keyId] = [ckb[keyId]];
            } else if ((i = ckb[keyId].indexOf(command)) != -1) {
                ckb[keyId].splice(i, 1);
            }
            
            if (typeof position != "number") {
                position = getPosition(command);
            }

            var commands = ckb[keyId];
            for (i = 0; i < commands.length; i++) {
                var other = commands[i];
                var otherPos = getPosition(other);
                if (otherPos > position)
                    break;
            }
            commands.splice(i, 0, command);
        }
    };

    this.addCommands = function(commands) {
        commands && Object.keys(commands).forEach(function(name) {
            var command = commands[name];
            if (!command)
                return;
            
            if (typeof command === "string")
                return this.bindKey(command, name);

            if (typeof command === "function")
                command = { exec: command };

            if (typeof command !== "object")
                return;

            if (!command.name)
                command.name = name;

            this.addCommand(command);
        }, this);
    };

    this.removeCommands = function(commands) {
        Object.keys(commands).forEach(function(name) {
            this.removeCommand(commands[name]);
        }, this);
    };

    this.bindKeys = function(keyList) {
        Object.keys(keyList).forEach(function(key) {
            this.bindKey(key, keyList[key]);
        }, this);
    };

    this._buildKeyHash = function(command) {
        this.bindKey(command.bindKey, command);
    };
    this.parseKeys = function(keys) {
        var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(x){return x;});
        var key = parts.pop();

        var keyCode = keyUtil[key];
        if (keyUtil.FUNCTION_KEYS[keyCode])
            key = keyUtil.FUNCTION_KEYS[keyCode].toLowerCase();
        else if (!parts.length)
            return {key: key, hashId: -1};
        else if (parts.length == 1 && parts[0] == "shift")
            return {key: key.toUpperCase(), hashId: -1};

        var hashId = 0;
        for (var i = parts.length; i--;) {
            var modifier = keyUtil.KEY_MODS[parts[i]];
            if (modifier == null) {
                if (typeof console != "undefined")
                    console.error("invalid modifier " + parts[i] + " in " + keys);
                return false;
            }
            hashId |= modifier;
        }
        return {key: key, hashId: hashId};
    };

    this.findKeyCommand = function findKeyCommand(hashId, keyString) {
        var key = KEY_MODS[hashId] + keyString;
        return this.commandKeyBinding[key];
    };

    this.handleKeyboard = function(data, hashId, keyString, keyCode) {
        if (keyCode < 0) return;
        var key = KEY_MODS[hashId] + keyString;
        var command = this.commandKeyBinding[key];
        if (data.$keyChain) {
            data.$keyChain += " " + key;
            command = this.commandKeyBinding[data.$keyChain] || command;
        }
        
        if (command) {
            if (command == "chainKeys" || command[command.length - 1] == "chainKeys") {
                data.$keyChain = data.$keyChain || key;
                return {command: "null"};
            }
        }
        
        if (data.$keyChain) {
            if ((!hashId || hashId == 4) && keyString.length == 1)
                data.$keyChain = data.$keyChain.slice(0, -key.length - 1); // wait for input
            else if (hashId == -1 || keyCode > 0)
                data.$keyChain = ""; // reset keyChain
        }
        return {command: command};
    };
    
    this.getStatusText = function(editor, data) {
        return data.$keyChain || "";
    };

}).call(HashHandler.prototype);

exports.HashHandler = HashHandler;
exports.MultiHashHandler = MultiHashHandler;
});

ace.define("ace/commands/command_manager",["require","exports","module","ace/lib/oop","ace/keyboard/hash_handler","ace/lib/event_emitter"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var MultiHashHandler = require("../keyboard/hash_handler").MultiHashHandler;
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var CommandManager = function(platform, commands) {
    MultiHashHandler.call(this, commands, platform);
    this.byName = this.commands;
    this.setDefaultHandler("exec", function(e) {
        return e.command.exec(e.editor, e.args || {});
    });
};

oop.inherits(CommandManager, MultiHashHandler);

(function() {

    oop.implement(this, EventEmitter);

    this.exec = function(command, editor, args) {
        if (Array.isArray(command)) {
            for (var i = command.length; i--; ) {
                if (this.exec(command[i], editor, args)) return true;
            }
            return false;
        }

        if (typeof command === "string")
            command = this.commands[command];

        if (!command)
            return false;

        if (editor && editor.$readOnly && !command.readOnly)
            return false;

        if (this.$checkCommandState != false && command.isAvailable && !command.isAvailable(editor))
            return false;

        var e = {editor: editor, command: command, args: args};
        e.returnValue = this._emit("exec", e);
        this._signal("afterExec", e);

        return e.returnValue === false ? false : true;
    };

    this.toggleRecording = function(editor) {
        if (this.$inReplay)
            return;

        editor && editor._emit("changeStatus");
        if (this.recording) {
            this.macro.pop();
            this.removeEventListener("exec", this.$addCommandToMacro);

            if (!this.macro.length)
                this.macro = this.oldMacro;

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = function(e) {
                this.macro.push([e.command, e.args]);
            }.bind(this);
        }

        this.oldMacro = this.macro;
        this.macro = [];
        this.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    };

    this.replay = function(editor) {
        if (this.$inReplay || !this.macro)
            return;

        if (this.recording)
            return this.toggleRecording(editor);

        try {
            this.$inReplay = true;
            this.macro.forEach(function(x) {
                if (typeof x == "string")
                    this.exec(x, editor);
                else
                    this.exec(x[0], editor, x[1]);
            }, this);
        } finally {
            this.$inReplay = false;
        }
    };

    this.trimMacro = function(m) {
        return m.map(function(x){
            if (typeof x[0] != "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    };

}).call(CommandManager.prototype);

exports.CommandManager = CommandManager;

});

ace.define("ace/commands/default_commands",["require","exports","module","ace/lib/lang","ace/config","ace/range"], function(require, exports, module) {
"use strict";

var lang = require("../lib/lang");
var config = require("../config");
var Range = require("../range").Range;

function bindKey(win, mac) {
    return {win: win, mac: mac};
}
exports.commands = [{
    name: "showSettingsMenu",
    bindKey: bindKey("Ctrl-,", "Command-,"),
    exec: function(editor) {
        config.loadModule("ace/ext/settings_menu", function(module) {
            module.init(editor);
            editor.showSettingsMenu();
        });
    },
    readOnly: true
}, {
    name: "goToNextError",
    bindKey: bindKey("Alt-E", "F4"),
    exec: function(editor) {
        config.loadModule("./ext/error_marker", function(module) {
            module.showErrorMarker(editor, 1);
        });
    },
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "goToPreviousError",
    bindKey: bindKey("Alt-Shift-E", "Shift-F4"),
    exec: function(editor) {
        config.loadModule("./ext/error_marker", function(module) {
            module.showErrorMarker(editor, -1);
        });
    },
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "selectall",
    bindKey: bindKey("Ctrl-A", "Command-A"),
    exec: function(editor) { editor.selectAll(); },
    readOnly: true
}, {
    name: "centerselection",
    bindKey: bindKey(null, "Ctrl-L"),
    exec: function(editor) { editor.centerSelection(); },
    readOnly: true
}, {
    name: "gotoline",
    bindKey: bindKey("Ctrl-L", "Command-L"),
    exec: function(editor, line) {
        if (typeof line !== "number")
            line = parseInt(prompt("Enter line number:"), 10);
        if (!isNaN(line)) {
            editor.gotoLine(line);
        }
    },
    readOnly: true
}, {
    name: "fold",
    bindKey: bindKey("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
    exec: function(editor) { editor.session.toggleFold(false); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "unfold",
    bindKey: bindKey("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
    exec: function(editor) { editor.session.toggleFold(true); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "toggleFoldWidget",
    bindKey: bindKey("F2", "F2"),
    exec: function(editor) { editor.session.toggleFoldWidget(); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "toggleParentFoldWidget",
    bindKey: bindKey("Alt-F2", "Alt-F2"),
    exec: function(editor) { editor.session.toggleFoldWidget(true); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "foldall",
    bindKey: bindKey(null, "Ctrl-Command-Option-0"),
    exec: function(editor) { editor.session.foldAll(); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "foldOther",
    bindKey: bindKey("Alt-0", "Command-Option-0"),
    exec: function(editor) { 
        editor.session.foldAll();
        editor.session.unfold(editor.selection.getAllRanges());
    },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "unfoldall",
    bindKey: bindKey("Alt-Shift-0", "Command-Option-Shift-0"),
    exec: function(editor) { editor.session.unfold(); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "findnext",
    bindKey: bindKey("Ctrl-K", "Command-G"),
    exec: function(editor) { editor.findNext(); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "findprevious",
    bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
    exec: function(editor) { editor.findPrevious(); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "selectOrFindNext",
    bindKey: bindKey("Alt-K", "Ctrl-G"),
    exec: function(editor) {
        if (editor.selection.isEmpty())
            editor.selection.selectWord();
        else
            editor.findNext(); 
    },
    readOnly: true
}, {
    name: "selectOrFindPrevious",
    bindKey: bindKey("Alt-Shift-K", "Ctrl-Shift-G"),
    exec: function(editor) { 
        if (editor.selection.isEmpty())
            editor.selection.selectWord();
        else
            editor.findPrevious();
    },
    readOnly: true
}, {
    name: "find",
    bindKey: bindKey("Ctrl-F", "Command-F"),
    exec: function(editor) {
        config.loadModule("ace/ext/searchbox", function(e) {e.Search(editor);});
    },
    readOnly: true
}, {
    name: "overwrite",
    bindKey: "Insert",
    exec: function(editor) { editor.toggleOverwrite(); },
    readOnly: true
}, {
    name: "selecttostart",
    bindKey: bindKey("Ctrl-Shift-Home", "Command-Shift-Home|Command-Shift-Up"),
    exec: function(editor) { editor.getSelection().selectFileStart(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "gotostart",
    bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
    exec: function(editor) { editor.navigateFileStart(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "selectup",
    bindKey: bindKey("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
    exec: function(editor) { editor.getSelection().selectUp(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "golineup",
    bindKey: bindKey("Up", "Up|Ctrl-P"),
    exec: function(editor, args) { editor.navigateUp(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selecttoend",
    bindKey: bindKey("Ctrl-Shift-End", "Command-Shift-End|Command-Shift-Down"),
    exec: function(editor) { editor.getSelection().selectFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "gotoend",
    bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
    exec: function(editor) { editor.navigateFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "selectdown",
    bindKey: bindKey("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
    exec: function(editor) { editor.getSelection().selectDown(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "golinedown",
    bindKey: bindKey("Down", "Down|Ctrl-N"),
    exec: function(editor, args) { editor.navigateDown(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectwordleft",
    bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectWordLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotowordleft",
    bindKey: bindKey("Ctrl-Left", "Option-Left"),
    exec: function(editor) { editor.navigateWordLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selecttolinestart",
    bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left|Ctrl-Shift-A"),
    exec: function(editor) { editor.getSelection().selectLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotolinestart",
    bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
    exec: function(editor) { editor.navigateLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectleft",
    bindKey: bindKey("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
    exec: function(editor) { editor.getSelection().selectLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotoleft",
    bindKey: bindKey("Left", "Left|Ctrl-B"),
    exec: function(editor, args) { editor.navigateLeft(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectwordright",
    bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectWordRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotowordright",
    bindKey: bindKey("Ctrl-Right", "Option-Right"),
    exec: function(editor) { editor.navigateWordRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selecttolineend",
    bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right|Shift-End|Ctrl-Shift-E"),
    exec: function(editor) { editor.getSelection().selectLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotolineend",
    bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
    exec: function(editor) { editor.navigateLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectright",
    bindKey: bindKey("Shift-Right", "Shift-Right"),
    exec: function(editor) { editor.getSelection().selectRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotoright",
    bindKey: bindKey("Right", "Right|Ctrl-F"),
    exec: function(editor, args) { editor.navigateRight(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectpagedown",
    bindKey: "Shift-PageDown",
    exec: function(editor) { editor.selectPageDown(); },
    readOnly: true
}, {
    name: "pagedown",
    bindKey: bindKey(null, "Option-PageDown"),
    exec: function(editor) { editor.scrollPageDown(); },
    readOnly: true
}, {
    name: "gotopagedown",
    bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
    exec: function(editor) { editor.gotoPageDown(); },
    readOnly: true
}, {
    name: "selectpageup",
    bindKey: "Shift-PageUp",
    exec: function(editor) { editor.selectPageUp(); },
    readOnly: true
}, {
    name: "pageup",
    bindKey: bindKey(null, "Option-PageUp"),
    exec: function(editor) { editor.scrollPageUp(); },
    readOnly: true
}, {
    name: "gotopageup",
    bindKey: "PageUp",
    exec: function(editor) { editor.gotoPageUp(); },
    readOnly: true
}, {
    name: "scrollup",
    bindKey: bindKey("Ctrl-Up", null),
    exec: function(e) { e.renderer.scrollBy(0, -2 * e.renderer.layerConfig.lineHeight); },
    readOnly: true
}, {
    name: "scrolldown",
    bindKey: bindKey("Ctrl-Down", null),
    exec: function(e) { e.renderer.scrollBy(0, 2 * e.renderer.layerConfig.lineHeight); },
    readOnly: true
}, {
    name: "selectlinestart",
    bindKey: "Shift-Home",
    exec: function(editor) { editor.getSelection().selectLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectlineend",
    bindKey: "Shift-End",
    exec: function(editor) { editor.getSelection().selectLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "togglerecording",
    bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
    exec: function(editor) { editor.commands.toggleRecording(editor); },
    readOnly: true
}, {
    name: "replaymacro",
    bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
    exec: function(editor) { editor.commands.replay(editor); },
    readOnly: true
}, {
    name: "jumptomatching",
    bindKey: bindKey("Ctrl-P", "Ctrl-P"),
    exec: function(editor) { editor.jumpToMatching(); },
    multiSelectAction: "forEach",
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "selecttomatching",
    bindKey: bindKey("Ctrl-Shift-P", "Ctrl-Shift-P"),
    exec: function(editor) { editor.jumpToMatching(true); },
    multiSelectAction: "forEach",
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "expandToMatching",
    bindKey: bindKey("Ctrl-Shift-M", "Ctrl-Shift-M"),
    exec: function(editor) { editor.jumpToMatching(true, true); },
    multiSelectAction: "forEach",
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "passKeysToBrowser",
    bindKey: bindKey(null, null),
    exec: function() {},
    passEvent: true,
    readOnly: true
}, {
    name: "copy",
    exec: function(editor) {
    },
    readOnly: true
},
{
    name: "cut",
    exec: function(editor) {
        var cutLine = editor.$copyWithEmptySelection && editor.selection.isEmpty();
        var range = cutLine ? editor.selection.getLineRange() : editor.selection.getRange();
        editor._emit("cut", range);

        if (!range.isEmpty())
            editor.session.remove(range);
        editor.clearSelection();
    },
    scrollIntoView: "cursor",
    multiSelectAction: "forEach"
}, {
    name: "paste",
    exec: function(editor, args) {
        editor.$handlePaste(args);
    },
    scrollIntoView: "cursor"
}, {
    name: "removeline",
    bindKey: bindKey("Ctrl-D", "Command-D"),
    exec: function(editor) { editor.removeLines(); },
    scrollIntoView: "cursor",
    multiSelectAction: "forEachLine"
}, {
    name: "duplicateSelection",
    bindKey: bindKey("Ctrl-Shift-D", "Command-Shift-D"),
    exec: function(editor) { editor.duplicateSelection(); },
    scrollIntoView: "cursor",
    multiSelectAction: "forEach"
}, {
    name: "sortlines",
    bindKey: bindKey("Ctrl-Alt-S", "Command-Alt-S"),
    exec: function(editor) { editor.sortLines(); },
    scrollIntoView: "selection",
    multiSelectAction: "forEachLine"
}, {
    name: "togglecomment",
    bindKey: bindKey("Ctrl-/", "Command-/"),
    exec: function(editor) { editor.toggleCommentLines(); },
    multiSelectAction: "forEachLine",
    scrollIntoView: "selectionPart"
}, {
    name: "toggleBlockComment",
    bindKey: bindKey("Ctrl-Shift-/", "Command-Shift-/"),
    exec: function(editor) { editor.toggleBlockComment(); },
    multiSelectAction: "forEach",
    scrollIntoView: "selectionPart"
}, {
    name: "modifyNumberUp",
    bindKey: bindKey("Ctrl-Shift-Up", "Alt-Shift-Up"),
    exec: function(editor) { editor.modifyNumber(1); },
    scrollIntoView: "cursor",
    multiSelectAction: "forEach"
}, {
    name: "modifyNumberDown",
    bindKey: bindKey("Ctrl-Shift-Down", "Alt-Shift-Down"),
    exec: function(editor) { editor.modifyNumber(-1); },
    scrollIntoView: "cursor",
    multiSelectAction: "forEach"
}, {
    name: "replace",
    bindKey: bindKey("Ctrl-H", "Command-Option-F"),
    exec: function(editor) {
        config.loadModule("ace/ext/searchbox", function(e) {e.Search(editor, true);});
    }
}, {
    name: "undo",
    bindKey: bindKey("Ctrl-Z", "Command-Z"),
    exec: function(editor) { editor.undo(); }
}, {
    name: "redo",
    bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
    exec: function(editor) { editor.redo(); }
}, {
    name: "copylinesup",
    bindKey: bindKey("Alt-Shift-Up", "Command-Option-Up"),
    exec: function(editor) { editor.copyLinesUp(); },
    scrollIntoView: "cursor"
}, {
    name: "movelinesup",
    bindKey: bindKey("Alt-Up", "Option-Up"),
    exec: function(editor) { editor.moveLinesUp(); },
    scrollIntoView: "cursor"
}, {
    name: "copylinesdown",
    bindKey: bindKey("Alt-Shift-Down", "Command-Option-Down"),
    exec: function(editor) { editor.copyLinesDown(); },
    scrollIntoView: "cursor"
}, {
    name: "movelinesdown",
    bindKey: bindKey("Alt-Down", "Option-Down"),
    exec: function(editor) { editor.moveLinesDown(); },
    scrollIntoView: "cursor"
}, {
    name: "del",
    bindKey: bindKey("Delete", "Delete|Ctrl-D|Shift-Delete"),
    exec: function(editor) { editor.remove("right"); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "backspace",
    bindKey: bindKey(
        "Shift-Backspace|Backspace",
        "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    ),
    exec: function(editor) { editor.remove("left"); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "cut_or_delete",
    bindKey: bindKey("Shift-Delete", null),
    exec: function(editor) { 
        if (editor.selection.isEmpty()) {
            editor.remove("left");
        } else {
            return false;
        }
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removetolinestart",
    bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
    exec: function(editor) { editor.removeToLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removetolineend",
    bindKey: bindKey("Alt-Delete", "Ctrl-K|Command-Delete"),
    exec: function(editor) { editor.removeToLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removetolinestarthard",
    bindKey: bindKey("Ctrl-Shift-Backspace", null),
    exec: function(editor) {
        var range = editor.selection.getRange();
        range.start.column = 0;
        editor.session.remove(range);
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removetolineendhard",
    bindKey: bindKey("Ctrl-Shift-Delete", null),
    exec: function(editor) {
        var range = editor.selection.getRange();
        range.end.column = Number.MAX_VALUE;
        editor.session.remove(range);
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removewordleft",
    bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
    exec: function(editor) { editor.removeWordLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removewordright",
    bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
    exec: function(editor) { editor.removeWordRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "outdent",
    bindKey: bindKey("Shift-Tab", "Shift-Tab"),
    exec: function(editor) { editor.blockOutdent(); },
    multiSelectAction: "forEach",
    scrollIntoView: "selectionPart"
}, {
    name: "indent",
    bindKey: bindKey("Tab", "Tab"),
    exec: function(editor) { editor.indent(); },
    multiSelectAction: "forEach",
    scrollIntoView: "selectionPart"
}, {
    name: "blockoutdent",
    bindKey: bindKey("Ctrl-[", "Ctrl-["),
    exec: function(editor) { editor.blockOutdent(); },
    multiSelectAction: "forEachLine",
    scrollIntoView: "selectionPart"
}, {
    name: "blockindent",
    bindKey: bindKey("Ctrl-]", "Ctrl-]"),
    exec: function(editor) { editor.blockIndent(); },
    multiSelectAction: "forEachLine",
    scrollIntoView: "selectionPart"
}, {
    name: "insertstring",
    exec: function(editor, str) { editor.insert(str); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "inserttext",
    exec: function(editor, args) {
        editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "splitline",
    bindKey: bindKey(null, "Ctrl-O"),
    exec: function(editor) { editor.splitLine(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "transposeletters",
    bindKey: bindKey("Alt-Shift-X", "Ctrl-T"),
    exec: function(editor) { editor.transposeLetters(); },
    multiSelectAction: function(editor) {editor.transposeSelections(1); },
    scrollIntoView: "cursor"
}, {
    name: "touppercase",
    bindKey: bindKey("Ctrl-U", "Ctrl-U"),
    exec: function(editor) { editor.toUpperCase(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "tolowercase",
    bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
    exec: function(editor) { editor.toLowerCase(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "expandtoline",
    bindKey: bindKey("Ctrl-Shift-L", "Command-Shift-L"),
    exec: function(editor) {
        var range = editor.selection.getRange();

        range.start.column = range.end.column = 0;
        range.end.row++;
        editor.selection.setRange(range, false);
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "joinlines",
    bindKey: bindKey(null, null),
    exec: function(editor) {
        var isBackwards = editor.selection.isBackwards();
        var selectionStart = isBackwards ? editor.selection.getSelectionLead() : editor.selection.getSelectionAnchor();
        var selectionEnd = isBackwards ? editor.selection.getSelectionAnchor() : editor.selection.getSelectionLead();
        var firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length;
        var selectedText = editor.session.doc.getTextRange(editor.selection.getRange());
        var selectedCount = selectedText.replace(/\n\s*/, " ").length;
        var insertLine = editor.session.doc.getLine(selectionStart.row);

        for (var i = selectionStart.row + 1; i <= selectionEnd.row + 1; i++) {
            var curLine = lang.stringTrimLeft(lang.stringTrimRight(editor.session.doc.getLine(i)));
            if (curLine.length !== 0) {
                curLine = " " + curLine;
            }
            insertLine += curLine;
        }

        if (selectionEnd.row + 1 < (editor.session.doc.getLength() - 1)) {
            insertLine += editor.session.doc.getNewLineCharacter();
        }

        editor.clearSelection();
        editor.session.doc.replace(new Range(selectionStart.row, 0, selectionEnd.row + 2, 0), insertLine);

        if (selectedCount > 0) {
            editor.selection.moveCursorTo(selectionStart.row, selectionStart.column);
            editor.selection.selectTo(selectionStart.row, selectionStart.column + selectedCount);
        } else {
            firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length > firstLineEndCol ? (firstLineEndCol + 1) : firstLineEndCol;
            editor.selection.moveCursorTo(selectionStart.row, firstLineEndCol);
        }
    },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "invertSelection",
    bindKey: bindKey(null, null),
    exec: function(editor) {
        var endRow = editor.session.doc.getLength() - 1;
        var endCol = editor.session.doc.getLine(endRow).length;
        var ranges = editor.selection.rangeList.ranges;
        var newRanges = [];
        if (ranges.length < 1) {
            ranges = [editor.selection.getRange()];
        }

        for (var i = 0; i < ranges.length; i++) {
            if (i == (ranges.length - 1)) {
                if (!(ranges[i].end.row === endRow && ranges[i].end.column === endCol)) {
                    newRanges.push(new Range(ranges[i].end.row, ranges[i].end.column, endRow, endCol));
                }
            }

            if (i === 0) {
                if (!(ranges[i].start.row === 0 && ranges[i].start.column === 0)) {
                    newRanges.push(new Range(0, 0, ranges[i].start.row, ranges[i].start.column));
                }
            } else {
                newRanges.push(new Range(ranges[i-1].end.row, ranges[i-1].end.column, ranges[i].start.row, ranges[i].start.column));
            }
        }

        editor.exitMultiSelectMode();
        editor.clearSelection();

        for(var i = 0; i < newRanges.length; i++) {
            editor.selection.addRange(newRanges[i], false);
        }
    },
    readOnly: true,
    scrollIntoView: "none"
}];

});

ace.define("ace/clipboard",["require","exports","module"], function(require, exports, module) {
"use strict";

module.exports = { lineMode: false };

});

ace.define("ace/editor",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/lib/useragent","ace/keyboard/textinput","ace/mouse/mouse_handler","ace/mouse/fold_handler","ace/keyboard/keybinding","ace/edit_session","ace/search","ace/range","ace/lib/event_emitter","ace/commands/command_manager","ace/commands/default_commands","ace/config","ace/token_iterator","ace/clipboard"], function(require, exports, module) {
"use strict";

require("./lib/fixoldbrowsers");

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var lang = require("./lib/lang");
var useragent = require("./lib/useragent");
var TextInput = require("./keyboard/textinput").TextInput;
var MouseHandler = require("./mouse/mouse_handler").MouseHandler;
var FoldHandler = require("./mouse/fold_handler").FoldHandler;
var KeyBinding = require("./keyboard/keybinding").KeyBinding;
var EditSession = require("./edit_session").EditSession;
var Search = require("./search").Search;
var Range = require("./range").Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var CommandManager = require("./commands/command_manager").CommandManager;
var defaultCommands = require("./commands/default_commands").commands;
var config = require("./config");
var TokenIterator = require("./token_iterator").TokenIterator;

var clipboard = require("./clipboard");
var Editor = function(renderer, session, options) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;
    this.id = "editor" + (++Editor.$uid);

    this.commands = new CommandManager(useragent.isMac ? "mac" : "win", defaultCommands);
    if (typeof document == "object") {
        this.textInput = new TextInput(renderer.getTextAreaContainer(), this);
        this.renderer.textarea = this.textInput.getElement();
        this.$mouseHandler = new MouseHandler(this);
        new FoldHandler(this);
    }

    this.keyBinding = new KeyBinding(this);

    this.$search = new Search().set({
        wrap: true
    });

    this.$historyTracker = this.$historyTracker.bind(this);
    this.commands.on("exec", this.$historyTracker);

    this.$initOperationListeners();
    
    this._$emitInputEvent = lang.delayedCall(function() {
        this._signal("input", {});
        if (this.session && this.session.bgTokenizer)
            this.session.bgTokenizer.scheduleStart();
    }.bind(this));
    
    this.on("change", function(_, _self) {
        _self._$emitInputEvent.schedule(31);
    });

    this.setSession(session || options && options.session || new EditSession(""));
    config.resetOptions(this);
    if (options)
        this.setOptions(options);
    config._signal("editor", this);
};

Editor.$uid = 0;

(function(){

    oop.implement(this, EventEmitter);

    this.$initOperationListeners = function() {
        this.commands.on("exec", this.startOperation.bind(this), true);
        this.commands.on("afterExec", this.endOperation.bind(this), true);

        this.$opResetTimer = lang.delayedCall(this.endOperation.bind(this, true));
        this.on("change", function() {
            if (!this.curOp) {
                this.startOperation();
                this.curOp.selectionBefore = this.$lastSel;
            }
            this.curOp.docChanged = true;
        }.bind(this), true);
        
        this.on("changeSelection", function() {
            if (!this.curOp) {
                this.startOperation();
                this.curOp.selectionBefore = this.$lastSel;
            }
            this.curOp.selectionChanged = true;
        }.bind(this), true);
    };

    this.curOp = null;
    this.prevOp = {};
    this.startOperation = function(commandEvent) {
        if (this.curOp) {
            if (!commandEvent || this.curOp.command)
                return;
            this.prevOp = this.curOp;
        }
        if (!commandEvent) {
            this.previousCommand = null;
            commandEvent = {};
        }

        this.$opResetTimer.schedule();
        this.curOp = this.session.curOp = {
            command: commandEvent.command || {},
            args: commandEvent.args,
            scrollTop: this.renderer.scrollTop
        };
        this.curOp.selectionBefore = this.selection.toJSON();
    };

    this.endOperation = function(e) {
        if (this.curOp) {
            if (e && e.returnValue === false)
                return (this.curOp = null);
            if (e == true && this.curOp.command && this.curOp.command.name == "mouse")
                return;
            this._signal("beforeEndOperation");
            if (!this.curOp) return;
            var command = this.curOp.command;
            var scrollIntoView = command && command.scrollIntoView;
            if (scrollIntoView) {
                switch (scrollIntoView) {
                    case "center-animate":
                        scrollIntoView = "animate";
                    case "center":
                        this.renderer.scrollCursorIntoView(null, 0.5);
                        break;
                    case "animate":
                    case "cursor":
                        this.renderer.scrollCursorIntoView();
                        break;
                    case "selectionPart":
                        var range = this.selection.getRange();
                        var config = this.renderer.layerConfig;
                        if (range.start.row >= config.lastRow || range.end.row <= config.firstRow) {
                            this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                        }
                        break;
                    default:
                        break;
                }
                if (scrollIntoView == "animate")
                    this.renderer.animateScrolling(this.curOp.scrollTop);
            }
            var sel = this.selection.toJSON();
            this.curOp.selectionAfter = sel;
            this.$lastSel = this.selection.toJSON();
            this.session.getUndoManager().addSelection(sel);
            this.prevOp = this.curOp;
            this.curOp = null;
        }
    };
    this.$mergeableCommands = ["backspace", "del", "insertstring"];
    this.$historyTracker = function(e) {
        if (!this.$mergeUndoDeltas)
            return;

        var prev = this.prevOp;
        var mergeableCommands = this.$mergeableCommands;
        var shouldMerge = prev.command && (e.command.name == prev.command.name);
        if (e.command.name == "insertstring") {
            var text = e.args;
            if (this.mergeNextCommand === undefined)
                this.mergeNextCommand = true;

            shouldMerge = shouldMerge
                && this.mergeNextCommand // previous command allows to coalesce with
                && (!/\s/.test(text) || /\s/.test(prev.args)); // previous insertion was of same type

            this.mergeNextCommand = true;
        } else {
            shouldMerge = shouldMerge
                && mergeableCommands.indexOf(e.command.name) !== -1; // the command is mergeable
        }

        if (
            this.$mergeUndoDeltas != "always"
            && Date.now() - this.sequenceStartTime > 2000
        ) {
            shouldMerge = false; // the sequence is too long
        }

        if (shouldMerge)
            this.session.mergeUndoDeltas = true;
        else if (mergeableCommands.indexOf(e.command.name) !== -1)
            this.sequenceStartTime = Date.now();
    };
    this.setKeyboardHandler = function(keyboardHandler, cb) {
        if (keyboardHandler && typeof keyboardHandler === "string" && keyboardHandler != "ace") {
            this.$keybindingId = keyboardHandler;
            var _self = this;
            config.loadModule(["keybinding", keyboardHandler], function(module) {
                if (_self.$keybindingId == keyboardHandler)
                    _self.keyBinding.setKeyboardHandler(module && module.handler);
                cb && cb();
            });
        } else {
            this.$keybindingId = null;
            this.keyBinding.setKeyboardHandler(keyboardHandler);
            cb && cb();
        }
    };
    this.getKeyboardHandler = function() {
        return this.keyBinding.getKeyboardHandler();
    };
    this.setSession = function(session) {
        if (this.session == session)
            return;
        if (this.curOp) this.endOperation();
        this.curOp = {};

        var oldSession = this.session;
        if (oldSession) {
            this.session.off("change", this.$onDocumentChange);
            this.session.off("changeMode", this.$onChangeMode);
            this.session.off("tokenizerUpdate", this.$onTokenizerUpdate);
            this.session.off("changeTabSize", this.$onChangeTabSize);
            this.session.off("changeWrapLimit", this.$onChangeWrapLimit);
            this.session.off("changeWrapMode", this.$onChangeWrapMode);
            this.session.off("changeFold", this.$onChangeFold);
            this.session.off("changeFrontMarker", this.$onChangeFrontMarker);
            this.session.off("changeBackMarker", this.$onChangeBackMarker);
            this.session.off("changeBreakpoint", this.$onChangeBreakpoint);
            this.session.off("changeAnnotation", this.$onChangeAnnotation);
            this.session.off("changeOverwrite", this.$onCursorChange);
            this.session.off("changeScrollTop", this.$onScrollTopChange);
            this.session.off("changeScrollLeft", this.$onScrollLeftChange);

            var selection = this.session.getSelection();
            selection.off("changeCursor", this.$onCursorChange);
            selection.off("changeSelection", this.$onSelectionChange);
        }

        this.session = session;
        if (session) {
            this.$onDocumentChange = this.onDocumentChange.bind(this);
            session.on("change", this.$onDocumentChange);
            this.renderer.setSession(session);
    
            this.$onChangeMode = this.onChangeMode.bind(this);
            session.on("changeMode", this.$onChangeMode);
    
            this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
            session.on("tokenizerUpdate", this.$onTokenizerUpdate);
    
            this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
            session.on("changeTabSize", this.$onChangeTabSize);
    
            this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
            session.on("changeWrapLimit", this.$onChangeWrapLimit);
    
            this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
            session.on("changeWrapMode", this.$onChangeWrapMode);
    
            this.$onChangeFold = this.onChangeFold.bind(this);
            session.on("changeFold", this.$onChangeFold);
    
            this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
            this.session.on("changeFrontMarker", this.$onChangeFrontMarker);
    
            this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
            this.session.on("changeBackMarker", this.$onChangeBackMarker);
    
            this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
            this.session.on("changeBreakpoint", this.$onChangeBreakpoint);
    
            this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
            this.session.on("changeAnnotation", this.$onChangeAnnotation);
    
            this.$onCursorChange = this.onCursorChange.bind(this);
            this.session.on("changeOverwrite", this.$onCursorChange);
    
            this.$onScrollTopChange = this.onScrollTopChange.bind(this);
            this.session.on("changeScrollTop", this.$onScrollTopChange);
    
            this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
            this.session.on("changeScrollLeft", this.$onScrollLeftChange);
    
            this.selection = session.getSelection();
            this.selection.on("changeCursor", this.$onCursorChange);
    
            this.$onSelectionChange = this.onSelectionChange.bind(this);
            this.selection.on("changeSelection", this.$onSelectionChange);
    
            this.onChangeMode();
    
            this.onCursorChange();
    
            this.onScrollTopChange();
            this.onScrollLeftChange();
            this.onSelectionChange();
            this.onChangeFrontMarker();
            this.onChangeBackMarker();
            this.onChangeBreakpoint();
            this.onChangeAnnotation();
            this.session.getUseWrapMode() && this.renderer.adjustWrapLimit();
            this.renderer.updateFull();
        } else {
            this.selection = null;
            this.renderer.setSession(session);
        }

        this._signal("changeSession", {
            session: session,
            oldSession: oldSession
        });
        
        this.curOp = null;
        
        oldSession && oldSession._signal("changeEditor", {oldEditor: this});
        session && session._signal("changeEditor", {editor: this});
        
        if (session && session.bgTokenizer)
            session.bgTokenizer.scheduleStart();
    };
    this.getSession = function() {
        return this.session;
    };
    this.setValue = function(val, cursorPos) {
        this.session.doc.setValue(val);

        if (!cursorPos)
            this.selectAll();
        else if (cursorPos == 1)
            this.navigateFileEnd();
        else if (cursorPos == -1)
            this.navigateFileStart();

        return val;
    };
    this.getValue = function() {
        return this.session.getValue();
    };
    this.getSelection = function() {
        return this.selection;
    };
    this.resize = function(force) {
        this.renderer.onResize(force);
    };
    this.setTheme = function(theme, cb) {
        this.renderer.setTheme(theme, cb);
    };
    this.getTheme = function() {
        return this.renderer.getTheme();
    };
    this.setStyle = function(style) {
        this.renderer.setStyle(style);
    };
    this.unsetStyle = function(style) {
        this.renderer.unsetStyle(style);
    };
    this.getFontSize = function () {
        return this.getOption("fontSize") ||
           dom.computedStyle(this.container).fontSize;
    };
    this.setFontSize = function(size) {
        this.setOption("fontSize", size);
    };

    this.$highlightBrackets = function() {
        if (this.session.$bracketHighlight) {
            this.session.removeMarker(this.session.$bracketHighlight);
            this.session.$bracketHighlight = null;
        }

        if (this.$highlightPending) {
            return;
        }
        var self = this;
        this.$highlightPending = true;
        setTimeout(function() {
            self.$highlightPending = false;
            var session = self.session;
            if (!session || !session.bgTokenizer) return;
            var pos = session.findMatchingBracket(self.getCursorPosition());
            if (pos) {
                var range = new Range(pos.row, pos.column, pos.row, pos.column + 1);
            } else if (session.$mode.getMatching) {
                var range = session.$mode.getMatching(self.session);
            }
            if (range)
                session.$bracketHighlight = session.addMarker(range, "ace_bracket", "text");
        }, 50);
    };
    this.$highlightTags = function() {
        if (this.$highlightTagPending)
            return;
        var self = this;
        this.$highlightTagPending = true;
        setTimeout(function() {
            self.$highlightTagPending = false;
            
            var session = self.session;
            if (!session || !session.bgTokenizer) return;
            
            var pos = self.getCursorPosition();
            var iterator = new TokenIterator(self.session, pos.row, pos.column);
            var token = iterator.getCurrentToken();
            
            if (!token || !/\b(?:tag-open|tag-name)/.test(token.type)) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
                return;
            }
            
            if (token.type.indexOf("tag-open") != -1) {
                token = iterator.stepForward();
                if (!token)
                    return;
            }
            
            var tag = token.value;
            var depth = 0;
            var prevToken = iterator.stepBackward();
            
            if (prevToken.value == '<'){
                do {
                    prevToken = token;
                    token = iterator.stepForward();
                    
                    if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                        if (prevToken.value === '<'){
                            depth++;
                        } else if (prevToken.value === '</'){
                            depth--;
                        }
                    }
                    
                } while (token && depth >= 0);
            } else {
                do {
                    token = prevToken;
                    prevToken = iterator.stepBackward();
                    
                    if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                        if (prevToken.value === '<') {
                            depth++;
                        } else if (prevToken.value === '</') {
                            depth--;
                        }
                    }
                } while (prevToken && depth <= 0);
                iterator.stepForward();
            }
            
            if (!token) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
                return;
            }
            
            var row = iterator.getCurrentTokenRow();
            var column = iterator.getCurrentTokenColumn();
            var range = new Range(row, column, row, column+token.value.length);
            var sbm = session.$backMarkers[session.$tagHighlight];
            if (session.$tagHighlight && sbm != undefined && range.compareRange(sbm.range) !== 0) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
            }
            
            if (!session.$tagHighlight)
                session.$tagHighlight = session.addMarker(range, "ace_bracket", "text");
        }, 50);
    };
    this.focus = function() {
        var _self = this;
        setTimeout(function() {
            if (!_self.isFocused())
                _self.textInput.focus();
        });
        this.textInput.focus();
    };
    this.isFocused = function() {
        return this.textInput.isFocused();
    };
    this.blur = function() {
        this.textInput.blur();
    };
    this.onFocus = function(e) {
        if (this.$isFocused)
            return;
        this.$isFocused = true;
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._emit("focus", e);
    };
    this.onBlur = function(e) {
        if (!this.$isFocused)
            return;
        this.$isFocused = false;
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._emit("blur", e);
    };

    this.$cursorChange = function() {
        this.renderer.updateCursor();
    };
    this.onDocumentChange = function(delta) {
        var wrap = this.session.$useWrapMode;
        var lastRow = (delta.start.row == delta.end.row ? delta.end.row : Infinity);
        this.renderer.updateLines(delta.start.row, lastRow, wrap);

        this._signal("change", delta);
        this.$cursorChange();
        this.$updateHighlightActiveLine();
    };

    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };


    this.onScrollTopChange = function() {
        this.renderer.scrollToY(this.session.getScrollTop());
    };

    this.onScrollLeftChange = function() {
        this.renderer.scrollToX(this.session.getScrollLeft());
    };
    this.onCursorChange = function() {
        this.$cursorChange();

        this.$highlightBrackets();
        this.$highlightTags();
        this.$updateHighlightActiveLine();
        this._signal("changeSelection");
    };

    this.$updateHighlightActiveLine = function() {
        var session = this.getSession();

        var highlight;
        if (this.$highlightActiveLine) {
            if (this.$selectionStyle != "line" || !this.selection.isMultiLine())
                highlight = this.getCursorPosition();
            if (this.renderer.theme && this.renderer.theme.$selectionColorConflict && !this.selection.isEmpty())
                highlight = false;
            if (this.renderer.$maxLines && this.session.getLength() === 1 && !(this.renderer.$minLines > 1))
                highlight = false;
        }

        if (session.$highlightLineMarker && !highlight) {
            session.removeMarker(session.$highlightLineMarker.id);
            session.$highlightLineMarker = null;
        } else if (!session.$highlightLineMarker && highlight) {
            var range = new Range(highlight.row, highlight.column, highlight.row, Infinity);
            range.id = session.addMarker(range, "ace_active-line", "screenLine");
            session.$highlightLineMarker = range;
        } else if (highlight) {
            session.$highlightLineMarker.start.row = highlight.row;
            session.$highlightLineMarker.end.row = highlight.row;
            session.$highlightLineMarker.start.column = highlight.column;
            session._signal("changeBackMarker");
        }
    };

    this.onSelectionChange = function(e) {
        var session = this.session;

        if (session.$selectionMarker) {
            session.removeMarker(session.$selectionMarker);
        }
        session.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        } else {
            this.$updateHighlightActiveLine();
        }

        var re = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
        this.session.highlight(re);

        this._signal("changeSelection");
    };

    this.$getSelectionHighLightRegexp = function() {
        var session = this.session;

        var selection = this.getSelectionRange();
        if (selection.isEmpty() || selection.isMultiLine())
            return;

        var startColumn = selection.start.column;
        var endColumn = selection.end.column;
        var line = session.getLine(selection.start.row);
        
        var needle = line.substring(startColumn, endColumn);
        if (needle.length > 5000 || !/[\w\d]/.test(needle))
            return;

        var re = this.$search.$assembleRegExp({
            wholeWord: true,
            caseSensitive: true,
            needle: needle
        });
        
        var wordWithBoundary = line.substring(startColumn - 1, endColumn + 1);
        if (!re.test(wordWithBoundary))
            return;
        
        return re;
    };


    this.onChangeFrontMarker = function() {
        this.renderer.updateFrontMarkers();
    };

    this.onChangeBackMarker = function() {
        this.renderer.updateBackMarkers();
    };


    this.onChangeBreakpoint = function() {
        this.renderer.updateBreakpoints();
    };

    this.onChangeAnnotation = function() {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };


    this.onChangeMode = function(e) {
        this.renderer.updateText();
        this._emit("changeMode", e);
    };


    this.onChangeWrapLimit = function() {
        this.renderer.updateFull();
    };

    this.onChangeWrapMode = function() {
        this.renderer.onResize(true);
    };


    this.onChangeFold = function() {
        this.$updateHighlightActiveLine();
        this.renderer.updateFull();
    };
    this.getSelectedText = function() {
        return this.session.getTextRange(this.getSelectionRange());
    };
    this.getCopyText = function() {
        var text = this.getSelectedText();
        var nl = this.session.doc.getNewLineCharacter();
        var copyLine= false;
        if (!text && this.$copyWithEmptySelection) {
            copyLine = true;
            var ranges = this.selection.getAllRanges();
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                if (i && ranges[i - 1].start.row == range.start.row)
                    continue;
                text += this.session.getLine(range.start.row) + nl;
            }
        }
        var e = {text: text};
        this._signal("copy", e);
        clipboard.lineMode = copyLine ? e.text : "";
        return e.text;
    };
    this.onCopy = function() {
        this.commands.exec("copy", this);
    };
    this.onCut = function() {
        this.commands.exec("cut", this);
    };
    this.onPaste = function(text, event) {
        var e = {text: text, event: event};
        this.commands.exec("paste", this, e);
    };
    
    this.$handlePaste = function(e) {
        if (typeof e == "string") 
            e = {text: e};
        this._signal("paste", e);
        var text = e.text;

        var lineMode = text == clipboard.lineMode;
        var session = this.session;
        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) {
            if (lineMode)
                session.insert({ row: this.selection.lead.row, column: 0 }, text);
            else
                this.insert(text);
        } else if (lineMode) {
            this.selection.rangeList.ranges.forEach(function(range) {
                session.insert({ row: range.start.row, column: 0 }, text);
            });
        } else {
            var lines = text.split(/\r\n|\r|\n/);
            var ranges = this.selection.rangeList.ranges;
    
            if (lines.length > ranges.length || lines.length < 2 || !lines[1])
                return this.commands.exec("insertstring", this, text);
    
            for (var i = ranges.length; i--;) {
                var range = ranges[i];
                if (!range.isEmpty())
                    session.remove(range);
    
                session.insert(range.start, lines[i]);
            }
        }
    };

    this.execCommand = function(command, args) {
        return this.commands.exec(command, this, args);
    };
    this.insert = function(text, pasted) {
        var session = this.session;
        var mode = session.getMode();
        var cursor = this.getCursorPosition();

        if (this.getBehavioursEnabled() && !pasted) {
            var transform = mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
            if (transform) {
                if (text !== transform.text) {
                    if (!this.inVirtualSelectionMode) {
                        this.session.mergeUndoDeltas = false;
                        this.mergeNextCommand = false;
                    }
                }
                text = transform.text;

            }
        }
        
        if (text == "\t")
            text = this.session.getTabString();
        if (!this.selection.isEmpty()) {
            var range = this.getSelectionRange();
            cursor = this.session.remove(range);
            this.clearSelection();
        }
        else if (this.session.getOverwrite() && text.indexOf("\n") == -1) {
            var range = new Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        if (text == "\n" || text == "\r\n") {
            var line = session.getLine(cursor.row);
            if (cursor.column > line.search(/\S|$/)) {
                var d = line.substr(cursor.column).search(/\S|$/);
                session.doc.removeInLine(cursor.row, cursor.column, cursor.column + d);
            }
        }
        this.clearSelection();

        var start = cursor.column;
        var lineState = session.getState(cursor.row);
        var line = session.getLine(cursor.row);
        var shouldOutdent = mode.checkOutdent(lineState, line, text);
        var end = session.insert(cursor, text);

        if (transform && transform.selection) {
            if (transform.selection.length == 2) { // Transform relative to the current column
                this.selection.setSelectionRange(
                    new Range(cursor.row, start + transform.selection[0],
                              cursor.row, start + transform.selection[1]));
            } else { // Transform relative to the current row.
                this.selection.setSelectionRange(
                    new Range(cursor.row + transform.selection[0],
                              transform.selection[1],
                              cursor.row + transform.selection[2],
                              transform.selection[3]));
            }
        }

        if (session.getDocument().isNewLine(text)) {
            var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());

            session.insert({row: cursor.row+1, column: 0}, lineIndent);
        }
        if (shouldOutdent)
            mode.autoOutdent(lineState, session, cursor.row);
    };

    this.onTextInput = function(text, composition) {
        if (!composition)
            return this.keyBinding.onTextInput(text);
        
        this.startOperation({command: { name: "insertstring" }});
        var applyComposition = this.applyComposition.bind(this, text, composition);
        if (this.selection.rangeCount)
            this.forEachSelection(applyComposition);
        else
            applyComposition();
        this.endOperation();
    };
    
    this.applyComposition = function(text, composition) {
        if (composition.extendLeft || composition.extendRight) {
            var r = this.selection.getRange();
            r.start.column -= composition.extendLeft;
            r.end.column += composition.extendRight;
            this.selection.setRange(r);
            if (!text && !r.isEmpty())
                this.remove();
        }
        if (text || !this.selection.isEmpty())
            this.insert(text, true);
        if (composition.restoreStart || composition.restoreEnd) {
            var r = this.selection.getRange();
            r.start.column -= composition.restoreStart;
            r.end.column -= composition.restoreEnd;
            this.selection.setRange(r);
        }
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };
    this.setOverwrite = function(overwrite) {
        this.session.setOverwrite(overwrite);
    };
    this.getOverwrite = function() {
        return this.session.getOverwrite();
    };
    this.toggleOverwrite = function() {
        this.session.toggleOverwrite();
    };
    this.setScrollSpeed = function(speed) {
        this.setOption("scrollSpeed", speed);
    };
    this.getScrollSpeed = function() {
        return this.getOption("scrollSpeed");
    };
    this.setDragDelay = function(dragDelay) {
        this.setOption("dragDelay", dragDelay);
    };
    this.getDragDelay = function() {
        return this.getOption("dragDelay");
    };
    this.setSelectionStyle = function(val) {
        this.setOption("selectionStyle", val);
    };
    this.getSelectionStyle = function() {
        return this.getOption("selectionStyle");
    };
    this.setHighlightActiveLine = function(shouldHighlight) {
        this.setOption("highlightActiveLine", shouldHighlight);
    };
    this.getHighlightActiveLine = function() {
        return this.getOption("highlightActiveLine");
    };
    this.setHighlightGutterLine = function(shouldHighlight) {
        this.setOption("highlightGutterLine", shouldHighlight);
    };

    this.getHighlightGutterLine = function() {
        return this.getOption("highlightGutterLine");
    };
    this.setHighlightSelectedWord = function(shouldHighlight) {
        this.setOption("highlightSelectedWord", shouldHighlight);
    };
    this.getHighlightSelectedWord = function() {
        return this.$highlightSelectedWord;
    };

    this.setAnimatedScroll = function(shouldAnimate){
        this.renderer.setAnimatedScroll(shouldAnimate);
    };

    this.getAnimatedScroll = function(){
        return this.renderer.getAnimatedScroll();
    };
    this.setShowInvisibles = function(showInvisibles) {
        this.renderer.setShowInvisibles(showInvisibles);
    };
    this.getShowInvisibles = function() {
        return this.renderer.getShowInvisibles();
    };

    this.setDisplayIndentGuides = function(display) {
        this.renderer.setDisplayIndentGuides(display);
    };

    this.getDisplayIndentGuides = function() {
        return this.renderer.getDisplayIndentGuides();
    };
    this.setShowPrintMargin = function(showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };
    this.getShowPrintMargin = function() {
        return this.renderer.getShowPrintMargin();
    };
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };
    this.getPrintMarginColumn = function() {
        return this.renderer.getPrintMarginColumn();
    };
    this.setReadOnly = function(readOnly) {
        this.setOption("readOnly", readOnly);
    };
    this.getReadOnly = function() {
        return this.getOption("readOnly");
    };
    this.setBehavioursEnabled = function (enabled) {
        this.setOption("behavioursEnabled", enabled);
    };
    this.getBehavioursEnabled = function () {
        return this.getOption("behavioursEnabled");
    };
    this.setWrapBehavioursEnabled = function (enabled) {
        this.setOption("wrapBehavioursEnabled", enabled);
    };
    this.getWrapBehavioursEnabled = function () {
        return this.getOption("wrapBehavioursEnabled");
    };
    this.setShowFoldWidgets = function(show) {
        this.setOption("showFoldWidgets", show);

    };
    this.getShowFoldWidgets = function() {
        return this.getOption("showFoldWidgets");
    };

    this.setFadeFoldWidgets = function(fade) {
        this.setOption("fadeFoldWidgets", fade);
    };

    this.getFadeFoldWidgets = function() {
        return this.getOption("fadeFoldWidgets");
    };
    this.remove = function(dir) {
        if (this.selection.isEmpty()){
            if (dir == "left")
                this.selection.selectLeft();
            else
                this.selection.selectRight();
        }

        var range = this.getSelectionRange();
        if (this.getBehavioursEnabled()) {
            var session = this.session;
            var state = session.getState(range.start.row);
            var new_range = session.getMode().transformAction(state, 'deletion', this, session, range);

            if (range.end.column === 0) {
                var text = session.getTextRange(range);
                if (text[text.length - 1] == "\n") {
                    var line = session.getLine(range.end.row);
                    if (/^\s+$/.test(line)) {
                        range.end.column = line.length;
                    }
                }
            }
            if (new_range)
                range = new_range;
        }

        this.session.remove(range);
        this.clearSelection();
    };
    this.removeWordRight = function() {
        if (this.selection.isEmpty())
            this.selection.selectWordRight();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };
    this.removeWordLeft = function() {
        if (this.selection.isEmpty())
            this.selection.selectWordLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };
    this.removeToLineStart = function() {
        if (this.selection.isEmpty())
            this.selection.selectLineStart();
        if (this.selection.isEmpty())
            this.selection.selectLeft();
        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };
    this.removeToLineEnd = function() {
        if (this.selection.isEmpty())
            this.selection.selectLineEnd();

        var range = this.getSelectionRange();
        if (range.start.column == range.end.column && range.start.row == range.end.row) {
            range.end.column = 0;
            range.end.row++;
        }

        this.session.remove(range);
        this.clearSelection();
    };
    this.splitLine = function() {
        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        var cursor = this.getCursorPosition();
        this.insert("\n");
        this.moveCursorToPosition(cursor);
    };
    this.transposeLetters = function() {
        if (!this.selection.isEmpty()) {
            return;
        }

        var cursor = this.getCursorPosition();
        var column = cursor.column;
        if (column === 0)
            return;

        var line = this.session.getLine(cursor.row);
        var swap, range;
        if (column < line.length) {
            swap = line.charAt(column) + line.charAt(column-1);
            range = new Range(cursor.row, column-1, cursor.row, column+1);
        }
        else {
            swap = line.charAt(column-1) + line.charAt(column-2);
            range = new Range(cursor.row, column-2, cursor.row, column);
        }
        this.session.replace(range, swap);
        this.session.selection.moveToPosition(range.end);
    };
    this.toLowerCase = function() {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toLowerCase());
        this.selection.setSelectionRange(originalRange);
    };
    this.toUpperCase = function() {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toUpperCase());
        this.selection.setSelectionRange(originalRange);
    };
    this.indent = function() {
        var session = this.session;
        var range = this.getSelectionRange();

        if (range.start.row < range.end.row) {
            var rows = this.$getSelectedRows();
            session.indentRows(rows.first, rows.last, "\t");
            return;
        } else if (range.start.column < range.end.column) {
            var text = session.getTextRange(range);
            if (!/^\s+$/.test(text)) {
                var rows = this.$getSelectedRows();
                session.indentRows(rows.first, rows.last, "\t");
                return;
            }
        }
        
        var line = session.getLine(range.start.row);
        var position = range.start;
        var size = session.getTabSize();
        var column = session.documentToScreenColumn(position.row, position.column);

        if (this.session.getUseSoftTabs()) {
            var count = (size - column % size);
            var indentString = lang.stringRepeat(" ", count);
        } else {
            var count = column % size;
            while (line[range.start.column - 1] == " " && count) {
                range.start.column--;
                count--;
            }
            this.selection.setSelectionRange(range);
            indentString = "\t";
        }
        return this.insert(indentString);
    };
    this.blockIndent = function() {
        var rows = this.$getSelectedRows();
        this.session.indentRows(rows.first, rows.last, "\t");
    };
    this.blockOutdent = function() {
        var selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    };
    this.sortLines = function() {
        var rows = this.$getSelectedRows();
        var session = this.session;

        var lines = [];
        for (var i = rows.first; i <= rows.last; i++)
            lines.push(session.getLine(i));

        lines.sort(function(a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        });

        var deleteRange = new Range(0, 0, 0, 0);
        for (var i = rows.first; i <= rows.last; i++) {
            var line = session.getLine(i);
            deleteRange.start.row = i;
            deleteRange.end.row = i;
            deleteRange.end.column = line.length;
            session.replace(deleteRange, lines[i-rows.first]);
        }
    };
    this.toggleCommentLines = function() {
        var state = this.session.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows();
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    };

    this.toggleBlockComment = function() {
        var cursor = this.getCursorPosition();
        var state = this.session.getState(cursor.row);
        var range = this.getSelectionRange();
        this.session.getMode().toggleBlockComment(state, this.session, range, cursor);
    };
    this.getNumberAt = function(row, column) {
        var _numberRx = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
        _numberRx.lastIndex = 0;

        var s = this.session.getLine(row);
        while (_numberRx.lastIndex < column) {
            var m = _numberRx.exec(s);
            if(m.index <= column && m.index+m[0].length >= column){
                var number = {
                    value: m[0],
                    start: m.index,
                    end: m.index+m[0].length
                };
                return number;
            }
        }
        return null;
    };
    this.modifyNumber = function(amount) {
        var row = this.selection.getCursor().row;
        var column = this.selection.getCursor().column;
        var charRange = new Range(row, column-1, row, column);

        var c = this.session.getTextRange(charRange);
        if (!isNaN(parseFloat(c)) && isFinite(c)) {
            var nr = this.getNumberAt(row, column);
            if (nr) {
                var fp = nr.value.indexOf(".") >= 0 ? nr.start + nr.value.indexOf(".") + 1 : nr.end;
                var decimals = nr.start + nr.value.length - fp;

                var t = parseFloat(nr.value);
                t *= Math.pow(10, decimals);


                if(fp !== nr.end && column < fp){
                    amount *= Math.pow(10, nr.end - column - 1);
                } else {
                    amount *= Math.pow(10, nr.end - column);
                }

                t += amount;
                t /= Math.pow(10, decimals);
                var nnr = t.toFixed(decimals);
                var replaceRange = new Range(row, nr.start, row, nr.end);
                this.session.replace(replaceRange, nnr);
                this.moveCursorTo(row, Math.max(nr.start +1, column + nnr.length - nr.value.length));

            }
        } else {
            this.toggleWord();
        }
    };

    this.$toggleWordPairs = [
        ["first", "last"],
        ["true", "false"],
        ["yes", "no"],
        ["width", "height"],
        ["top", "bottom"],
        ["right", "left"],
        ["on", "off"],
        ["x", "y"],
        ["get", "set"],
        ["max", "min"],
        ["horizontal", "vertical"],
        ["show", "hide"],
        ["add", "remove"],
        ["up", "down"],
        ["before", "after"],
        ["even", "odd"],
        ["inside", "outside"],
        ["next", "previous"],
        ["increase", "decrease"],
        ["attach", "detach"],
        ["&&", "||"],
        ["==", "!="]
    ];

    this.toggleWord = function () {
        var row = this.selection.getCursor().row;
        var column = this.selection.getCursor().column;
        this.selection.selectWord();
        var currentState = this.getSelectedText();
        var currWordStart = this.selection.getWordRange().start.column;
        var wordParts = currentState.replace(/([a-z]+|[A-Z]+)(?=[A-Z_]|$)/g, '$1 ').split(/\s/);
        var delta = column - currWordStart - 1;
        if (delta < 0) delta = 0;
        var curLength = 0, itLength = 0;
        var that = this;
        if (currentState.match(/[A-Za-z0-9_]+/)) {
            wordParts.forEach(function (item, i) {
                itLength = curLength + item.length;
                if (delta >= curLength && delta <= itLength) {
                    currentState = item;
                    that.selection.clearSelection();
                    that.moveCursorTo(row, curLength + currWordStart);
                    that.selection.selectTo(row, itLength + currWordStart);
                }
                curLength = itLength;
            });
        }

        var wordPairs = this.$toggleWordPairs;
        var reg;
        for (var i = 0; i < wordPairs.length; i++) {
            var item = wordPairs[i];
            for (var j = 0; j <= 1; j++) {
                var negate = +!j;
                var firstCondition = currentState.match(new RegExp('^\\s?_?(' + lang.escapeRegExp(item[j]) + ')\\s?$', 'i'));
                if (firstCondition) {
                    var secondCondition = currentState.match(new RegExp('([_]|^|\\s)(' + lang.escapeRegExp(firstCondition[1]) + ')($|\\s)', 'g'));
                    if (secondCondition) {
                        reg = currentState.replace(new RegExp(lang.escapeRegExp(item[j]), 'i'), function (result) {
                            var res = item[negate];
                            if (result.toUpperCase() == result) {
                                res = res.toUpperCase();
                            } else if (result.charAt(0).toUpperCase() == result.charAt(0)) {
                                res = res.substr(0, 0) + item[negate].charAt(0).toUpperCase() + res.substr(1);
                            }
                            return res;
                        });
                        this.insert(reg);
                        reg = "";
                    }
                }
            }
        }
    };
    this.removeLines = function() {
        var rows = this.$getSelectedRows();
        this.session.removeFullLines(rows.first, rows.last);
        this.clearSelection();
    };

    this.duplicateSelection = function() {
        var sel = this.selection;
        var doc = this.session;
        var range = sel.getRange();
        var reverse = sel.isBackwards();
        if (range.isEmpty()) {
            var row = range.start.row;
            doc.duplicateLines(row, row);
        } else {
            var point = reverse ? range.start : range.end;
            var endPoint = doc.insert(point, doc.getTextRange(range), false);
            range.start = point;
            range.end = endPoint;

            sel.setSelectionRange(range, reverse);
        }
    };
    this.moveLinesDown = function() {
        this.$moveLines(1, false);
    };
    this.moveLinesUp = function() {
        this.$moveLines(-1, false);
    };
    this.moveText = function(range, toPosition, copy) {
        return this.session.moveText(range, toPosition, copy);
    };
    this.copyLinesUp = function() {
        this.$moveLines(-1, true);
    };
    this.copyLinesDown = function() {
        this.$moveLines(1, true);
    };
    this.$moveLines = function(dir, copy) {
        var rows, moved;
        var selection = this.selection;
        if (!selection.inMultiSelectMode || this.inVirtualSelectionMode) {
            var range = selection.toOrientedRange();
            rows = this.$getSelectedRows(range);
            moved = this.session.$moveLines(rows.first, rows.last, copy ? 0 : dir);
            if (copy && dir == -1) moved = 0;
            range.moveBy(moved, 0);
            selection.fromOrientedRange(range);
        } else {
            var ranges = selection.rangeList.ranges;
            selection.rangeList.detach(this.session);
            this.inVirtualSelectionMode = true;
            
            var diff = 0;
            var totalDiff = 0;
            var l = ranges.length;
            for (var i = 0; i < l; i++) {
                var rangeIndex = i;
                ranges[i].moveBy(diff, 0);
                rows = this.$getSelectedRows(ranges[i]);
                var first = rows.first;
                var last = rows.last;
                while (++i < l) {
                    if (totalDiff) ranges[i].moveBy(totalDiff, 0);
                    var subRows = this.$getSelectedRows(ranges[i]);
                    if (copy && subRows.first != last)
                        break;
                    else if (!copy && subRows.first > last + 1)
                        break;
                    last = subRows.last;
                }
                i--;
                diff = this.session.$moveLines(first, last, copy ? 0 : dir);
                if (copy && dir == -1) rangeIndex = i + 1;
                while (rangeIndex <= i) {
                    ranges[rangeIndex].moveBy(diff, 0);
                    rangeIndex++;
                }
                if (!copy) diff = 0;
                totalDiff += diff;
            }
            
            selection.fromOrientedRange(selection.ranges[0]);
            selection.rangeList.attach(this.session);
            this.inVirtualSelectionMode = false;
        }
    };
    this.$getSelectedRows = function(range) {
        range = (range || this.getSelectionRange()).collapseRows();

        return {
            first: this.session.getRowFoldStart(range.start.row),
            last: this.session.getRowFoldEnd(range.end.row)
        };
    };

    this.onCompositionStart = function(compositionState) {
        this.renderer.showComposition(compositionState);
    };

    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
    };
    this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };
    this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };
    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };
    this.isRowFullyVisible = function(row) {
        return (row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow());
    };
    this.$getVisibleRowCount = function() {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    };

    this.$moveByPage = function(dir, select) {
        var renderer = this.renderer;
        var config = this.renderer.layerConfig;
        var rows = dir * Math.floor(config.height / config.lineHeight);

        if (select === true) {
            this.selection.$moveSelection(function(){
                this.moveCursorBy(rows, 0);
            });
        } else if (select === false) {
            this.selection.moveCursorBy(rows, 0);
            this.selection.clearSelection();
        }

        var scrollTop = renderer.scrollTop;

        renderer.scrollBy(0, rows * config.lineHeight);
        if (select != null)
            renderer.scrollCursorIntoView(null, 0.5);

        renderer.animateScrolling(scrollTop);
    };
    this.selectPageDown = function() {
        this.$moveByPage(1, true);
    };
    this.selectPageUp = function() {
        this.$moveByPage(-1, true);
    };
    this.gotoPageDown = function() {
       this.$moveByPage(1, false);
    };
    this.gotoPageUp = function() {
        this.$moveByPage(-1, false);
    };
    this.scrollPageDown = function() {
        this.$moveByPage(1);
    };
    this.scrollPageUp = function() {
        this.$moveByPage(-1);
    };
    this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };
    this.scrollToLine = function(line, center, animate, callback) {
        this.renderer.scrollToLine(line, center, animate, callback);
    };
    this.centerSelection = function() {
        var range = this.getSelectionRange();
        var pos = {
            row: Math.floor(range.start.row + (range.end.row - range.start.row) / 2),
            column: Math.floor(range.start.column + (range.end.column - range.start.column) / 2)
        };
        this.renderer.alignCursor(pos, 0.5);
    };
    this.getCursorPosition = function() {
        return this.selection.getCursor();
    };
    this.getCursorPositionScreen = function() {
        return this.session.documentToScreenPosition(this.getCursorPosition());
    };
    this.getSelectionRange = function() {
        return this.selection.getRange();
    };
    this.selectAll = function() {
        this.selection.selectAll();
    };
    this.clearSelection = function() {
        this.selection.clearSelection();
    };
    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
    };
    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };
    this.jumpToMatching = function(select, expand) {
        var cursor = this.getCursorPosition();
        var iterator = new TokenIterator(this.session, cursor.row, cursor.column);
        var prevToken = iterator.getCurrentToken();
        var token = prevToken || iterator.stepForward();

        if (!token) return;
        var matchType;
        var found = false;
        var depth = {};
        var i = cursor.column - token.start;
        var bracketType;
        var brackets = {
            ")": "(",
            "(": "(",
            "]": "[",
            "[": "[",
            "{": "{",
            "}": "{"
        };
        
        do {
            if (token.value.match(/[{}()\[\]]/g)) {
                for (; i < token.value.length && !found; i++) {
                    if (!brackets[token.value[i]]) {
                        continue;
                    }

                    bracketType = brackets[token.value[i]] + '.' + token.type.replace("rparen", "lparen");

                    if (isNaN(depth[bracketType])) {
                        depth[bracketType] = 0;
                    }

                    switch (token.value[i]) {
                        case '(':
                        case '[':
                        case '{':
                            depth[bracketType]++;
                            break;
                        case ')':
                        case ']':
                        case '}':
                            depth[bracketType]--;

                            if (depth[bracketType] === -1) {
                                matchType = 'bracket';
                                found = true;
                            }
                        break;
                    }
                }
            }
            else if (token.type.indexOf('tag-name') !== -1) {
                if (isNaN(depth[token.value])) {
                    depth[token.value] = 0;
                }
                
                if (prevToken.value === '<') {
                    depth[token.value]++;
                }
                else if (prevToken.value === '</') {
                    depth[token.value]--;
                }
                
                if (depth[token.value] === -1) {
                    matchType = 'tag';
                    found = true;
                }
            }

            if (!found) {
                prevToken = token;
                token = iterator.stepForward();
                i = 0;
            }
        } while (token && !found);
        if (!matchType)
            return;

        var range, pos;
        if (matchType === 'bracket') {
            range = this.session.getBracketRange(cursor);
            if (!range) {
                range = new Range(
                    iterator.getCurrentTokenRow(),
                    iterator.getCurrentTokenColumn() + i - 1,
                    iterator.getCurrentTokenRow(),
                    iterator.getCurrentTokenColumn() + i - 1
                );
                pos = range.start;
                if (expand || pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    range = this.session.getBracketRange(pos);
            }
        }
        else if (matchType === 'tag') {
            if (token && token.type.indexOf('tag-name') !== -1) 
                var tag = token.value;
            else
                return;

            range = new Range(
                iterator.getCurrentTokenRow(),
                iterator.getCurrentTokenColumn() - 2,
                iterator.getCurrentTokenRow(),
                iterator.getCurrentTokenColumn() - 2
            );
            if (range.compare(cursor.row, cursor.column) === 0) {
                found = false;
                do {
                    token = prevToken;
                    prevToken = iterator.stepBackward();
                    
                    if (prevToken) {
                        if (prevToken.type.indexOf('tag-close') !== -1) {
                            range.setEnd(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1);
                        }

                        if (token.value === tag && token.type.indexOf('tag-name') !== -1) {
                            if (prevToken.value === '<') {
                                depth[tag]++;
                            }
                            else if (prevToken.value === '</') {
                                depth[tag]--;
                            }
                            
                            if (depth[tag] === 0)
                                found = true;
                        }
                    }
                } while (prevToken && !found);
            }
            if (token && token.type.indexOf('tag-name')) {
                pos = range.start;
                if (pos.row == cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    pos = range.end;
            }
        }

        pos = range && range.cursor || pos;
        if (pos) {
            if (select) {
                if (range && expand) {
                    this.selection.setRange(range);
                } else if (range && range.isEqual(this.getSelectionRange())) {
                    this.clearSelection();
                } else {
                    this.selection.selectTo(pos.row, pos.column);
                }
            } else {
                this.selection.moveTo(pos.row, pos.column);
            }
        }
    };
    this.gotoLine = function(lineNumber, column, animate) {
        this.selection.clearSelection();
        this.session.unfold({row: lineNumber - 1, column: column || 0});
        this.exitMultiSelectMode && this.exitMultiSelectMode();
        this.moveCursorTo(lineNumber - 1, column || 0);

        if (!this.isRowFullyVisible(lineNumber - 1))
            this.scrollToLine(lineNumber - 1, true, animate);
    };
    this.navigateTo = function(row, column) {
        this.selection.moveTo(row, column);
    };
    this.navigateUp = function(times) {
        if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
            var selectionStart = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionStart);
        }
        this.selection.clearSelection();
        this.selection.moveCursorBy(-times || -1, 0);
    };
    this.navigateDown = function(times) {
        if (this.selection.isMultiLine() && this.selection.isBackwards()) {
            var selectionEnd = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionEnd);
        }
        this.selection.clearSelection();
        this.selection.moveCursorBy(times || 1, 0);
    };
    this.navigateLeft = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    };
    this.navigateRight = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
        }
        this.clearSelection();
    };
    this.navigateLineStart = function() {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };
    this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };
    this.navigateFileEnd = function() {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    };
    this.navigateFileStart = function() {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    };
    this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };
    this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };
    this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        var replaced = 0;
        if (!range)
            return replaced;

        if (this.$tryReplace(range, replacement)) {
            replaced = 1;
        }

        this.selection.setSelectionRange(range);
        this.renderer.scrollSelectionIntoView(range.start, range.end);

        return replaced;
    };
    this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        var replaced = 0;
        if (!ranges.length)
            return replaced;

        var selection = this.getSelectionRange();
        this.selection.moveTo(0, 0);

        for (var i = ranges.length - 1; i >= 0; --i) {
            if(this.$tryReplace(ranges[i], replacement)) {
                replaced++;
            }
        }

        this.selection.setSelectionRange(selection);

        return replaced;
    };

    this.$tryReplace = function(range, replacement) {
        var input = this.session.getTextRange(range);
        replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };
    this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };
    this.find = function(needle, options, animate) {
        if (!options)
            options = {};

        if (typeof needle == "string" || needle instanceof RegExp)
            options.needle = needle;
        else if (typeof needle == "object")
            oop.mixin(options, needle);

        var range = this.selection.getRange();
        if (options.needle == null) {
            needle = this.session.getTextRange(range)
                || this.$search.$options.needle;
            if (!needle) {
                range = this.session.getWordRange(range.start.row, range.start.column);
                needle = this.session.getTextRange(range);
            }
            this.$search.set({needle: needle});
        }

        this.$search.set(options);
        if (!options.start)
            this.$search.set({start: range});

        var newRange = this.$search.find(this.session);
        if (options.preventScroll)
            return newRange;
        if (newRange) {
            this.revealRange(newRange, animate);
            return newRange;
        }
        if (options.backwards)
            range.start = range.end;
        else
            range.end = range.start;
        this.selection.setRange(range);
    };
    this.findNext = function(options, animate) {
        this.find({skipCurrent: true, backwards: false}, options, animate);
    };
    this.findPrevious = function(options, animate) {
        this.find(options, {skipCurrent: true, backwards: true}, animate);
    };

    this.revealRange = function(range, animate) {
        this.session.unfold(range);
        this.selection.setSelectionRange(range);

        var scrollTop = this.renderer.scrollTop;
        this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
        if (animate !== false)
            this.renderer.animateScrolling(scrollTop);
    };
    this.undo = function() {
        this.session.getUndoManager().undo(this.session);
        this.renderer.scrollCursorIntoView(null, 0.5);
    };
    this.redo = function() {
        this.session.getUndoManager().redo(this.session);
        this.renderer.scrollCursorIntoView(null, 0.5);
    };
    this.destroy = function() {
        this.renderer.destroy();
        this._signal("destroy", this);
        if (this.session) {
            this.session.destroy();
        }
    };
    this.setAutoScrollEditorIntoView = function(enable) {
        if (!enable)
            return;
        var rect;
        var self = this;
        var shouldScroll = false;
        if (!this.$scrollAnchor)
            this.$scrollAnchor = document.createElement("div");
        var scrollAnchor = this.$scrollAnchor;
        scrollAnchor.style.cssText = "position:absolute";
        this.container.insertBefore(scrollAnchor, this.container.firstChild);
        var onChangeSelection = this.on("changeSelection", function() {
            shouldScroll = true;
        });
        var onBeforeRender = this.renderer.on("beforeRender", function() {
            if (shouldScroll)
                rect = self.renderer.container.getBoundingClientRect();
        });
        var onAfterRender = this.renderer.on("afterRender", function() {
            if (shouldScroll && rect && (self.isFocused()
                || self.searchBox && self.searchBox.isFocused())
            ) {
                var renderer = self.renderer;
                var pos = renderer.$cursorLayer.$pixelPos;
                var config = renderer.layerConfig;
                var top = pos.top - config.offset;
                if (pos.top >= 0 && top + rect.top < 0) {
                    shouldScroll = true;
                } else if (pos.top < config.height &&
                    pos.top + rect.top + config.lineHeight > window.innerHeight) {
                    shouldScroll = false;
                } else {
                    shouldScroll = null;
                }
                if (shouldScroll != null) {
                    scrollAnchor.style.top = top + "px";
                    scrollAnchor.style.left = pos.left + "px";
                    scrollAnchor.style.height = config.lineHeight + "px";
                    scrollAnchor.scrollIntoView(shouldScroll);
                }
                shouldScroll = rect = null;
            }
        });
        this.setAutoScrollEditorIntoView = function(enable) {
            if (enable)
                return;
            delete this.setAutoScrollEditorIntoView;
            this.off("changeSelection", onChangeSelection);
            this.renderer.off("afterRender", onAfterRender);
            this.renderer.off("beforeRender", onBeforeRender);
        };
    };


    this.$resetCursorStyle = function() {
        var style = this.$cursorStyle || "ace";
        var cursorLayer = this.renderer.$cursorLayer;
        if (!cursorLayer)
            return;
        cursorLayer.setSmoothBlinking(/smooth/.test(style));
        cursorLayer.isBlinking = !this.$readOnly && style != "wide";
        dom.setCssClass(cursorLayer.element, "ace_slim-cursors", /slim/.test(style));
    };

}).call(Editor.prototype);



config.defineOptions(Editor.prototype, "editor", {
    selectionStyle: {
        set: function(style) {
            this.onSelectionChange();
            this._signal("changeSelectionStyle", {data: style});
        },
        initialValue: "line"
    },
    highlightActiveLine: {
        set: function() {this.$updateHighlightActiveLine();},
        initialValue: true
    },
    highlightSelectedWord: {
        set: function(shouldHighlight) {this.$onSelectionChange();},
        initialValue: true
    },
    readOnly: {
        set: function(readOnly) {
            this.textInput.setReadOnly(readOnly);
            this.$resetCursorStyle(); 
        },
        initialValue: false
    },
    copyWithEmptySelection: {
        set: function(value) {
            this.textInput.setCopyWithEmptySelection(value);
        },
        initialValue: false
    },
    cursorStyle: {
        set: function(val) { this.$resetCursorStyle(); },
        values: ["ace", "slim", "smooth", "wide"],
        initialValue: "ace"
    },
    mergeUndoDeltas: {
        values: [false, true, "always"],
        initialValue: true
    },
    behavioursEnabled: {initialValue: true},
    wrapBehavioursEnabled: {initialValue: true},
    autoScrollEditorIntoView: {
        set: function(val) {this.setAutoScrollEditorIntoView(val);}
    },
    keyboardHandler: {
        set: function(val) { this.setKeyboardHandler(val); },
        get: function() { return this.$keybindingId; },
        handlesSet: true
    },
    value: {
        set: function(val) { this.session.setValue(val); },
        get: function() { return this.getValue(); },
        handlesSet: true,
        hidden: true
    },
    session: {
        set: function(val) { this.setSession(val); },
        get: function() { return this.session; },
        handlesSet: true,
        hidden: true
    },
    
    showLineNumbers: {
        set: function(show) {
            this.renderer.$gutterLayer.setShowLineNumbers(show);
            this.renderer.$loop.schedule(this.renderer.CHANGE_GUTTER);
            if (show && this.$relativeLineNumbers)
                relativeNumberRenderer.attach(this);
            else
                relativeNumberRenderer.detach(this);
        },
        initialValue: true
    },
    relativeLineNumbers: {
        set: function(value) {
            if (this.$showLineNumbers && value)
                relativeNumberRenderer.attach(this);
            else
                relativeNumberRenderer.detach(this);
        }
    },

    hScrollBarAlwaysVisible: "renderer",
    vScrollBarAlwaysVisible: "renderer",
    highlightGutterLine: "renderer",
    animatedScroll: "renderer",
    showInvisibles: "renderer",
    showPrintMargin: "renderer",
    printMarginColumn: "renderer",
    printMargin: "renderer",
    fadeFoldWidgets: "renderer",
    showFoldWidgets: "renderer",
    displayIndentGuides: "renderer",
    showGutter: "renderer",
    fontSize: "renderer",
    fontFamily: "renderer",
    maxLines: "renderer",
    minLines: "renderer",
    scrollPastEnd: "renderer",
    fixedWidthGutter: "renderer",
    theme: "renderer",
    hasCssTransforms: "renderer",
    maxPixelHeight: "renderer",
    useTextareaForIME: "renderer",

    scrollSpeed: "$mouseHandler",
    dragDelay: "$mouseHandler",
    dragEnabled: "$mouseHandler",
    focusTimeout: "$mouseHandler",
    tooltipFollowsMouse: "$mouseHandler",

    firstLineNumber: "session",
    overwrite: "session",
    newLineMode: "session",
    useWorker: "session",
    useSoftTabs: "session",
    navigateWithinSoftTabs: "session",
    tabSize: "session",
    wrap: "session",
    indentedSoftWrap: "session",
    foldStyle: "session",
    mode: "session"
});


var relativeNumberRenderer = {
    getText: function(session, row) {
        return (Math.abs(session.selection.lead.row - row) || (row + 1 + (row < 9 ? "\xb7" : ""))) + "";
    },
    getWidth: function(session, lastLineNumber, config) {
        return Math.max(
            lastLineNumber.toString().length,
            (config.lastRow + 1).toString().length,
            2
        ) * config.characterWidth;
    },
    update: function(e, editor) {
        editor.renderer.$loop.schedule(editor.renderer.CHANGE_GUTTER);
    },
    attach: function(editor) {
        editor.renderer.$gutterLayer.$renderer = this;
        editor.on("changeSelection", this.update);
        this.update(null, editor);
    },
    detach: function(editor) {
        if (editor.renderer.$gutterLayer.$renderer == this)
            editor.renderer.$gutterLayer.$renderer = null;
        editor.off("changeSelection", this.update);
        this.update(null, editor);
    }
};

exports.Editor = Editor;
});

ace.define("ace/undomanager",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";
var UndoManager = function() {
    this.$maxRev = 0;
    this.$fromUndo = false;
    this.reset();
};

(function() {
    
    this.addSession = function(session) {
        this.$session = session;
    };
    this.add = function(delta, allowMerge, session) {
        if (this.$fromUndo) return;
        if (delta == this.$lastDelta) return;
        if (allowMerge === false || !this.lastDeltas) {
            this.lastDeltas = [];
            this.$undoStack.push(this.lastDeltas);
            delta.id = this.$rev = ++this.$maxRev;
        }
        if (delta.action == "remove" || delta.action == "insert")
            this.$lastDelta = delta;
        this.lastDeltas.push(delta);
    };
    
    this.addSelection = function(selection, rev) {
        this.selections.push({
            value: selection,
            rev: rev || this.$rev
        });
    };
    
    this.startNewGroup = function() {
        this.lastDeltas = null;
        return this.$rev;
    };
    
    this.markIgnored = function(from, to) {
        if (to == null) to = this.$rev + 1;
        var stack = this.$undoStack;
        for (var i = stack.length; i--;) {
            var delta = stack[i][0];
            if (delta.id <= from)
                break;
            if (delta.id < to)
                delta.ignore = true;
        }
        this.lastDeltas = null;
    };
    
    this.getSelection = function(rev, after) {
        var stack = this.selections;
        for (var i = stack.length; i--;) {
            var selection = stack[i];
            if (selection.rev < rev) {
                if (after)
                    selection = stack[i + 1];
                return selection;
            }
        }
    };
    
    this.getRevision = function() {
        return this.$rev;
    };
    
    this.getDeltas = function(from, to) {
        if (to == null) to = this.$rev + 1;
        var stack = this.$undoStack;
        var end = null, start = 0;
        for (var i = stack.length; i--;) {
            var delta = stack[i][0];
            if (delta.id < to && !end)
                end = i+1;
            if (delta.id <= from) {
                start = i + 1;
                break;
            }
        }
        return stack.slice(start, end);
    };
    
    this.getChangedRanges = function(from, to) {
        if (to == null) to = this.$rev + 1;
        
    };
    
    this.getChangedLines = function(from, to) {
        if (to == null) to = this.$rev + 1;
        
    };
    this.undo = function(session, dontSelect) {
        this.lastDeltas = null;
        var stack = this.$undoStack;
        
        if (!rearrangeUndoStack(stack, stack.length))
            return;
        
        if (!session)
            session = this.$session;
        
        if (this.$redoStackBaseRev !== this.$rev && this.$redoStack.length)
            this.$redoStack = [];
        
        this.$fromUndo = true;
        
        var deltaSet = stack.pop();
        var undoSelectionRange = null;
        if (deltaSet && deltaSet.length) {
            undoSelectionRange = session.undoChanges(deltaSet, dontSelect);
            this.$redoStack.push(deltaSet);
            this.$syncRev();
        }
        
        this.$fromUndo = false;

        return undoSelectionRange;
    };
    this.redo = function(session, dontSelect) {
        this.lastDeltas = null;
        
        if (!session)
            session = this.$session;
        
        this.$fromUndo = true;
        if (this.$redoStackBaseRev != this.$rev) {
            var diff = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
            rebaseRedoStack(this.$redoStack, diff);
            this.$redoStackBaseRev = this.$rev;
            this.$redoStack.forEach(function(x) {
                x[0].id = ++this.$maxRev;
            }, this);
        }
        var deltaSet = this.$redoStack.pop();
        var redoSelectionRange = null;
        
        if (deltaSet) {
            redoSelectionRange = session.redoChanges(deltaSet, dontSelect);
            this.$undoStack.push(deltaSet);
            this.$syncRev();
        }
        this.$fromUndo = false;
        
        return redoSelectionRange;
    };
    
    this.$syncRev = function() {
        var stack = this.$undoStack;
        var nextDelta = stack[stack.length - 1];
        var id = nextDelta && nextDelta[0].id || 0;
        this.$redoStackBaseRev = id;
        this.$rev = id;
    };
    this.reset = function() {
        this.lastDeltas = null;
        this.$lastDelta = null;
        this.$undoStack = [];
        this.$redoStack = [];
        this.$rev = 0;
        this.mark = 0;
        this.$redoStackBaseRev = this.$rev;
        this.selections = [];
    };
    this.canUndo = function() {
        return this.$undoStack.length > 0;
    };
    this.canRedo = function() {
        return this.$redoStack.length > 0;
    };
    this.bookmark = function(rev) {
        if (rev == undefined)
            rev = this.$rev;
        this.mark = rev;
    };
    this.isAtBookmark = function() {
        return this.$rev === this.mark;
    };
    
    this.toJSON = function() {
        
    };
    
    this.fromJSON = function() {
        
    };
    
    this.hasUndo = this.canUndo;
    this.hasRedo = this.canRedo;
    this.isClean = this.isAtBookmark;
    this.markClean = this.bookmark;
    
    this.$prettyPrint = function(delta) {
        if (delta) return stringifyDelta(delta);
        return stringifyDelta(this.$undoStack) + "\n---\n" + stringifyDelta(this.$redoStack);
    };
}).call(UndoManager.prototype);

function rearrangeUndoStack(stack, pos) {
    for (var i = pos; i--; ) {
        var deltaSet = stack[i];
        if (deltaSet && !deltaSet[0].ignore) {
            while(i < pos - 1) {
                var swapped = swapGroups(stack[i], stack[i + 1]);
                stack[i] = swapped[0];
                stack[i + 1] = swapped[1];
                i++;
            }
            return true;
        }
    }
}

var Range = require("./range").Range;
var cmp = Range.comparePoints;
var comparePoints = Range.comparePoints;

function $updateMarkers(delta) {
    var isInsert = delta.action == "insert";
    var start = delta.start;
    var end = delta.end;
    var rowShift = (end.row - start.row) * (isInsert ? 1 : -1);
    var colShift = (end.column - start.column) * (isInsert ? 1 : -1);
    if (isInsert) end = start;

    for (var i in this.marks) {
        var point = this.marks[i];
        var cmp = comparePoints(point, start);
        if (cmp < 0) {
            continue; // delta starts after the range
        }
        if (cmp === 0) {
            if (isInsert) {
                if (point.bias == 1) {
                    cmp = 1;
                }
                else {
                    point.bias == -1;
                    continue;
                }
            }
        }
        var cmp2 = isInsert ? cmp : comparePoints(point, end);
        if (cmp2 > 0) {
            point.row += rowShift;
            point.column += point.row == end.row ? colShift : 0;
            continue;
        }
        if (!isInsert && cmp2 <= 0) {
            point.row = start.row;
            point.column = start.column;
            if (cmp2 === 0)
                point.bias = 1;
        }
    }
}



function clonePos(pos) {
    return {row: pos.row,column: pos.column};
}
function cloneDelta(d) {
    return {
        start: clonePos(d.start),
        end: clonePos(d.end),
        action: d.action,
        lines: d.lines.slice()
    };
}
function stringifyDelta(d) {
    d = d || this;
    if (Array.isArray(d)) {
        return d.map(stringifyDelta).join("\n");
    }
    var type = "";
    if (d.action) {
        type = d.action == "insert" ? "+" : "-";
        type += "[" + d.lines + "]";
    } else if (d.value) {
        if (Array.isArray(d.value)) {
            type = d.value.map(stringifyRange).join("\n");
        } else {
            type = stringifyRange(d.value);
        }
    }
    if (d.start) {
        type += stringifyRange(d);
    }
    if (d.id || d.rev) {
        type += "\t(" + (d.id || d.rev) + ")";
    }
    return type;
}
function stringifyRange(r) {
    return r.start.row + ":" + r.start.column 
        + "=>" + r.end.row + ":" + r.end.column;
}

function swap(d1, d2) {
    var i1 = d1.action == "insert";
    var i2 = d2.action == "insert";
    
    if (i1 && i2) {
        if (cmp(d2.start, d1.end) >= 0) {
            shift(d2, d1, -1);
        } else if (cmp(d2.start, d1.start) <= 0) {
            shift(d1, d2, +1);
        } else {
            return null;
        }
    } else if (i1 && !i2) {
        if (cmp(d2.start, d1.end) >= 0) {
            shift(d2, d1, -1);
        } else if (cmp(d2.end, d1.start) <= 0) {
            shift(d1, d2, -1);
        } else {
            return null;
        }
    } else if (!i1 && i2) {
        if (cmp(d2.start, d1.start) >= 0) {
            shift(d2, d1, +1);
        } else if (cmp(d2.start, d1.start) <= 0) {
            shift(d1, d2, +1);
        } else {
            return null;
        }
    } else if (!i1 && !i2) {
        if (cmp(d2.start, d1.start) >= 0) {
            shift(d2, d1, +1);
        } else if (cmp(d2.end, d1.start) <= 0) {
            shift(d1, d2, -1);
        } else {
            return null;
        }
    }
    return [d2, d1];
}
function swapGroups(ds1, ds2) {
    for (var i = ds1.length; i--; ) {
        for (var j = 0; j < ds2.length; j++) {
            if (!swap(ds1[i], ds2[j])) {
                while (i < ds1.length) {
                    while (j--) {
                        swap(ds2[j], ds1[i]);
                    }
                    j = ds2.length;
                    i++;
                }                
                return [ds1, ds2];
            }
        }
    }
    ds1.selectionBefore = ds2.selectionBefore = 
    ds1.selectionAfter = ds2.selectionAfter = null;
    return [ds2, ds1];
}
function xform(d1, c1) {
    var i1 = d1.action == "insert";
    var i2 = c1.action == "insert";
    
    if (i1 && i2) {
        if (cmp(d1.start, c1.start) < 0) {
            shift(c1, d1, 1);
        } else {
            shift(d1, c1, 1);
        }
    } else if (i1 && !i2) {
        if (cmp(d1.start, c1.end) >= 0) {
            shift(d1, c1, -1);
        } else if (cmp(d1.start, c1.start) <= 0) {
            shift(c1, d1, +1);
        } else {
            shift(d1, Range.fromPoints(c1.start, d1.start), -1);
            shift(c1, d1, +1);
        }
    } else if (!i1 && i2) {
        if (cmp(c1.start, d1.end) >= 0) {
            shift(c1, d1, -1);
        } else if (cmp(c1.start, d1.start) <= 0) {
            shift(d1, c1, +1);
        } else {
            shift(c1, Range.fromPoints(d1.start, c1.start), -1);
            shift(d1, c1, +1);
        }
    } else if (!i1 && !i2) {
        if (cmp(c1.start, d1.end) >= 0) {
            shift(c1, d1, -1);
        } else if (cmp(c1.end, d1.start) <= 0) {
            shift(d1, c1, -1);
        } else {
            var before, after;
            if (cmp(d1.start, c1.start) < 0) {
                before = d1;
                d1 = splitDelta(d1, c1.start);
            }
            if (cmp(d1.end, c1.end) > 0) {
                after = splitDelta(d1, c1.end);
            }

            shiftPos(c1.end, d1.start, d1.end, -1);
            if (after && !before) {
                d1.lines = after.lines;
                d1.start = after.start;
                d1.end = after.end;
                after = d1;
            }

            return [c1, before, after].filter(Boolean);
        }
    }
    return [c1, d1];
}
    
function shift(d1, d2, dir) {
    shiftPos(d1.start, d2.start, d2.end, dir);
    shiftPos(d1.end, d2.start, d2.end, dir);
}
function shiftPos(pos, start, end, dir) {
    if (pos.row == (dir == 1 ? start : end).row) {
        pos.column += dir * (end.column - start.column);
    }
    pos.row += dir * (end.row - start.row);
}
function splitDelta(c, pos) {
    var lines = c.lines;
    var end = c.end;
    c.end = clonePos(pos);    
    var rowsBefore = c.end.row - c.start.row;
    var otherLines = lines.splice(rowsBefore, lines.length);
    
    var col = rowsBefore ? pos.column : pos.column - c.start.column;
    lines.push(otherLines[0].substring(0, col));
    otherLines[0] = otherLines[0].substr(col)   ; 
    var rest = {
        start: clonePos(pos),
        end: end,
        lines: otherLines,
        action: c.action
    };
    return rest;
}

function moveDeltasByOne(redoStack, d) {
    d = cloneDelta(d);
    for (var j = redoStack.length; j--;) {
        var deltaSet = redoStack[j];
        for (var i = 0; i < deltaSet.length; i++) {
            var x = deltaSet[i];
            var xformed = xform(x, d);
            d = xformed[0];
            if (xformed.length != 2) {
                if (xformed[2]) {
                    deltaSet.splice(i + 1, 1, xformed[1], xformed[2]);
                    i++;
                } else if (!xformed[1]) {
                    deltaSet.splice(i, 1);
                    i--;
                }
            }
        }
        if (!deltaSet.length) {
            redoStack.splice(j, 1); 
        }
    }
    return redoStack;
}
function rebaseRedoStack(redoStack, deltaSets) {
    for (var i = 0; i < deltaSets.length; i++) {
        var deltas = deltaSets[i];
        for (var j = 0; j < deltas.length; j++) {
            moveDeltasByOne(redoStack, deltas[j]);
        }
    }
}

exports.UndoManager = UndoManager;

});

ace.define("ace/layer/lines",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");

var Lines = function(element, canvasHeight) {
    this.element = element;
    this.canvasHeight = canvasHeight || 500000;
    this.element.style.height = (this.canvasHeight * 2) + "px";
    
    this.cells = [];
    this.cellCache = [];
    this.$offsetCoefficient = 0;
};

(function() {
    
    this.moveContainer = function(config) {
        dom.translate(this.element, 0, -((config.firstRowScreen * config.lineHeight) % this.canvasHeight) - config.offset * this.$offsetCoefficient);
    };    
    
    this.pageChanged = function(oldConfig, newConfig) {
        return (
            Math.floor((oldConfig.firstRowScreen * oldConfig.lineHeight) / this.canvasHeight) !==
            Math.floor((newConfig.firstRowScreen * newConfig.lineHeight) / this.canvasHeight)
        );
    };
    
    this.computeLineTop = function(row, config, session) {
        var screenTop = config.firstRowScreen * config.lineHeight;
        var screenPage = Math.floor(screenTop / this.canvasHeight);
        var lineTop = session.documentToScreenRow(row, 0) * config.lineHeight;
        return lineTop - (screenPage * this.canvasHeight);
    };
    
    this.computeLineHeight = function(row, config, session) {
        return config.lineHeight * session.getRowLength(row);
    };
    
    this.getLength = function() {
        return this.cells.length;
    };
    
    this.get = function(index) {
        return this.cells[index];
    };
    
    this.shift = function() {
        this.$cacheCell(this.cells.shift());
    };
    
    this.pop = function() {
        this.$cacheCell(this.cells.pop());
    };
    
    this.push = function(cell) {
        if (Array.isArray(cell)) {
            this.cells.push.apply(this.cells, cell);
            var fragment = dom.createFragment(this.element);
            for (var i=0; i<cell.length; i++) {
                fragment.appendChild(cell[i].element);
            }
            this.element.appendChild(fragment);
         } else {
            this.cells.push(cell);
            this.element.appendChild(cell.element);
         }
    };
    
    this.unshift = function(cell) {
        if (Array.isArray(cell)) {
            this.cells.unshift.apply(this.cells, cell);
            var fragment = dom.createFragment(this.element);
            for (var i=0; i<cell.length; i++) {
                fragment.appendChild(cell[i].element);
            }
            if (this.element.firstChild)
                this.element.insertBefore(fragment, this.element.firstChild);
            else
                this.element.appendChild(fragment);
         } else {
            this.cells.unshift(cell);
            this.element.insertAdjacentElement("afterbegin", cell.element);
         }
    };
    
    this.last = function() {
        if (this.cells.length)
            return this.cells[this.cells.length-1];
        else
            return null;
    };
    
    this.$cacheCell = function(cell) {
        if (!cell)
            return;
            
        cell.element.remove();
        this.cellCache.push(cell);
    };
    
    this.createCell = function(row, config, session, initElement) {
        var cell = this.cellCache.pop();
        if (!cell) {
            var element = dom.createElement("div");
            if (initElement)
                initElement(element);
            
            this.element.appendChild(element);
            
            cell = {
                element: element,
                text: "",
                row: row
            };
        }
        cell.row = row;
        
        return cell;
    };
    
}).call(Lines.prototype);

exports.Lines = Lines;

});

ace.define("ace/layer/gutter",["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/lang","ace/lib/event_emitter","ace/layer/lines"], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");
var oop = require("../lib/oop");
var lang = require("../lib/lang");
var EventEmitter = require("../lib/event_emitter").EventEmitter;
var Lines = require("./lines").Lines;

var Gutter = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);
    this.setShowFoldWidgets(this.$showFoldWidgets);
    
    this.gutterWidth = 0;

    this.$annotations = [];
    this.$updateAnnotations = this.$updateAnnotations.bind(this);
    
    this.$lines = new Lines(this.element);
    this.$lines.$offsetCoefficient = 1;
};

(function() {

    oop.implement(this, EventEmitter);

    this.setSession = function(session) {
        if (this.session)
            this.session.removeEventListener("change", this.$updateAnnotations);
        this.session = session;
        if (session)
            session.on("change", this.$updateAnnotations);
    };

    this.addGutterDecoration = function(row, className) {
        if (window.console)
            console.warn && console.warn("deprecated use session.addGutterDecoration");
        this.session.addGutterDecoration(row, className);
    };

    this.removeGutterDecoration = function(row, className) {
        if (window.console)
            console.warn && console.warn("deprecated use session.removeGutterDecoration");
        this.session.removeGutterDecoration(row, className);
    };

    this.setAnnotations = function(annotations) {
        this.$annotations = [];
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            var rowInfo = this.$annotations[row];
            if (!rowInfo)
                rowInfo = this.$annotations[row] = {text: []};
           
            var annoText = annotation.text;
            annoText = annoText ? lang.escapeHTML(annoText) : annotation.html || "";

            if (rowInfo.text.indexOf(annoText) === -1)
                rowInfo.text.push(annoText);

            var type = annotation.type;
            if (type == "error")
                rowInfo.className = " ace_error";
            else if (type == "warning" && rowInfo.className != " ace_error")
                rowInfo.className = " ace_warning";
            else if (type == "info" && (!rowInfo.className))
                rowInfo.className = " ace_info";
        }
    };

    this.$updateAnnotations = function (delta) {
        if (!this.$annotations.length)
            return;
        var firstRow = delta.start.row;
        var len = delta.end.row - firstRow;
        if (len === 0) {
        } else if (delta.action == 'remove') {
            this.$annotations.splice(firstRow, len + 1, null);
        } else {
            var args = new Array(len + 1);
            args.unshift(firstRow, 1);
            this.$annotations.splice.apply(this.$annotations, args);
        }
    };

    this.update = function(config) {
        this.config = config;
        
        var session = this.session;
        var firstRow = config.firstRow;
        var lastRow = Math.min(config.lastRow + config.gutterOffset,  // needed to compensate for hor scollbar
            session.getLength() - 1);
            
        this.oldLastRow = lastRow;
        this.config = config;
        
        this.$lines.moveContainer(config);
        this.$updateCursorRow();
            
        var fold = session.getNextFoldLine(firstRow);
        var foldStart = fold ? fold.start.row : Infinity;

        var cell = null;
        var index = -1;
        var row = firstRow;
        
        while (true) {
            if (row > foldStart) {
                row = fold.end.row + 1;
                fold = session.getNextFoldLine(row, fold);
                foldStart = fold ? fold.start.row : Infinity;
            }
            if (row > lastRow) {
                while (this.$lines.getLength() > index + 1)
                    this.$lines.pop();
                    
                break;
            }

            cell = this.$lines.get(++index);
            if (cell) {
                cell.row = row;
            } else {
                cell = this.$lines.createCell(row, config, this.session, onCreateCell);
                this.$lines.push(cell);
            }

            this.$renderCell(cell, config, fold, row);
            row++;
        }
        
        this._signal("afterRender");
        this.$updateGutterWidth(config);
    };

    this.$updateGutterWidth = function(config) {
        var session = this.session;
        
        var gutterRenderer = session.gutterRenderer || this.$renderer;
        
        var firstLineNumber = session.$firstLineNumber;
        var lastLineText = this.$lines.last() ? this.$lines.last().text : "";
        
        if (this.$fixedWidth || session.$useWrapMode)
            lastLineText = session.getLength() + firstLineNumber - 1;

        var gutterWidth = gutterRenderer 
            ? gutterRenderer.getWidth(session, lastLineText, config)
            : lastLineText.toString().length * config.characterWidth;
        
        var padding = this.$padding || this.$computePadding();
        gutterWidth += padding.left + padding.right;
        if (gutterWidth !== this.gutterWidth && !isNaN(gutterWidth)) {
            this.gutterWidth = gutterWidth;
            this.element.parentNode.style.width = 
            this.element.style.width = Math.ceil(this.gutterWidth) + "px";
            this._signal("changeGutterWidth", gutterWidth);
        }
    };
    
    this.$updateCursorRow = function() {
        if (!this.$highlightGutterLine)
            return;
            
        var position = this.session.selection.getCursor();
        if (this.$cursorRow === position.row)
            return;
        
        this.$cursorRow = position.row;
    };
    
    this.updateLineHighlight = function() {
        if (!this.$highlightGutterLine)
            return;
        var row = this.session.selection.cursor.row;
        this.$cursorRow = row;

        if (this.$cursorCell && this.$cursorCell.row == row)
            return;
        if (this.$cursorCell)
            this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
        var cells = this.$lines.cells;
        this.$cursorCell = null;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.row >= this.$cursorRow) {
                if (cell.row > this.$cursorRow) {
                    var fold = this.session.getFoldLine(this.$cursorRow);
                    if (i > 0 && fold && fold.start.row == cells[i - 1].row)
                        cell = cells[i - 1];
                    else
                        break;
                }
                cell.element.className = "ace_gutter-active-line " + cell.element.className;
                this.$cursorCell = cell;
                break;
            }
        }
    };
    
    this.scrollLines = function(config) {
        var oldConfig = this.config;
        this.config = config;
        
        this.$updateCursorRow();
        if (this.$lines.pageChanged(oldConfig, config))
            return this.update(config);
        
        this.$lines.moveContainer(config);

        var lastRow = Math.min(config.lastRow + config.gutterOffset,  // needed to compensate for hor scollbar
            this.session.getLength() - 1);
        var oldLastRow = this.oldLastRow;
        this.oldLastRow = lastRow;
        
        if (!oldConfig || oldLastRow < config.firstRow)
            return this.update(config);

        if (lastRow < oldConfig.firstRow)
            return this.update(config);

        if (oldConfig.firstRow < config.firstRow)
            for (var row=this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row>0; row--)
                this.$lines.shift();

        if (oldLastRow > lastRow)
            for (var row=this.session.getFoldedRowCount(lastRow + 1, oldLastRow); row>0; row--)
                this.$lines.pop();

        if (config.firstRow < oldConfig.firstRow) {
            this.$lines.unshift(this.$renderLines(config, config.firstRow, oldConfig.firstRow - 1));
        }

        if (lastRow > oldLastRow) {
            this.$lines.push(this.$renderLines(config, oldLastRow + 1, lastRow));
        }
        
        this.updateLineHighlight();
        
        this._signal("afterRender");
        this.$updateGutterWidth(config);
    };

    this.$renderLines = function(config, firstRow, lastRow) {
        var fragment = [];
        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            var cell = this.$lines.createCell(row, config, this.session, onCreateCell);
            this.$renderCell(cell, config, foldLine, row);
            fragment.push(cell);

            row++;
        }
        return fragment;
    };
    
    this.$renderCell = function(cell, config, fold, row) {
        var element = cell.element;
        
        var session = this.session;
        
        var textNode = element.childNodes[0];
        var foldWidget = element.childNodes[1];

        var firstLineNumber = session.$firstLineNumber;
        
        var breakpoints = session.$breakpoints;
        var decorations = session.$decorations;
        var gutterRenderer = session.gutterRenderer || this.$renderer;
        var foldWidgets = this.$showFoldWidgets && session.foldWidgets;
        var foldStart = fold ? fold.start.row : Number.MAX_VALUE;
        
        var className = "ace_gutter-cell ";
        if (this.$highlightGutterLine) {
            if (row == this.$cursorRow || (fold && row < this.$cursorRow && row >= foldStart &&  this.$cursorRow <= fold.end.row)) {
                className += "ace_gutter-active-line ";
                if (this.$cursorCell != cell) {
                    if (this.$cursorCell)
                        this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                    this.$cursorCell = cell;
                }
            }
        }
        
        if (breakpoints[row])
            className += breakpoints[row];
        if (decorations[row])
            className += decorations[row];
        if (this.$annotations[row])
            className += this.$annotations[row].className;
        if (element.className != className)
            element.className = className;

        if (foldWidgets) {
            var c = foldWidgets[row];
            if (c == null)
                c = foldWidgets[row] = session.getFoldWidget(row);
        }

        if (c) {
            var className = "ace_fold-widget ace_" + c;
            if (c == "start" && row == foldStart && row < fold.end.row)
                className += " ace_closed";
            else
                className += " ace_open";
            if (foldWidget.className != className)
                foldWidget.className = className;

            var foldHeight = config.lineHeight + "px";
            dom.setStyle(foldWidget.style, "height", foldHeight);
            dom.setStyle(foldWidget.style, "display", "inline-block");
        } else {
            if (foldWidget) {
                dom.setStyle(foldWidget.style, "display", "none");
            }
        }
        
        var text = (gutterRenderer
            ? gutterRenderer.getText(session, row)
            : row + firstLineNumber).toString();
            
        if (text !== textNode.data) {
            textNode.data = text;
        }
        
        dom.setStyle(cell.element.style, "height", this.$lines.computeLineHeight(row, config, session) + "px");
        dom.setStyle(cell.element.style, "top", this.$lines.computeLineTop(row, config, session) + "px");
        
        cell.text = text;
        return cell;
    };

    this.$fixedWidth = false;
    
    this.$highlightGutterLine = true;
    this.$renderer = "";
    this.setHighlightGutterLine = function(highlightGutterLine) {
        this.$highlightGutterLine = highlightGutterLine;
    };
    
    this.$showLineNumbers = true;
    this.$renderer = "";
    this.setShowLineNumbers = function(show) {
        this.$renderer = !show && {
            getWidth: function() {return 0;},
            getText: function() {return "";}
        };
    };
    
    this.getShowLineNumbers = function() {
        return this.$showLineNumbers;
    };
    
    this.$showFoldWidgets = true;
    this.setShowFoldWidgets = function(show) {
        if (show)
            dom.addCssClass(this.element, "ace_folding-enabled");
        else
            dom.removeCssClass(this.element, "ace_folding-enabled");

        this.$showFoldWidgets = show;
        this.$padding = null;
    };
    
    this.getShowFoldWidgets = function() {
        return this.$showFoldWidgets;
    };

    this.$computePadding = function() {
        if (!this.element.firstChild)
            return {left: 0, right: 0};
        var style = dom.computedStyle(this.element.firstChild);
        this.$padding = {};
        this.$padding.left = (parseInt(style.borderLeftWidth) || 0)
            + (parseInt(style.paddingLeft) || 0) + 1;
        this.$padding.right = (parseInt(style.borderRightWidth) || 0)
            + (parseInt(style.paddingRight) || 0);
        return this.$padding;
    };

    this.getRegion = function(point) {
        var padding = this.$padding || this.$computePadding();
        var rect = this.element.getBoundingClientRect();
        if (point.x < padding.left + rect.left)
            return "markers";
        if (this.$showFoldWidgets && point.x > rect.right - padding.right)
            return "foldWidgets";
    };

}).call(Gutter.prototype);

function onCreateCell(element) {
    var textNode = document.createTextNode('');
    element.appendChild(textNode);
    
    var foldWidget = dom.createElement("span");
    element.appendChild(foldWidget);
    
    return element;
}

exports.Gutter = Gutter;

});

ace.define("ace/layer/marker",["require","exports","module","ace/range","ace/lib/dom"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var dom = require("../lib/dom");

var Marker = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl.appendChild(this.element);
};

(function() {

    this.$padding = 0;

    this.setPadding = function(padding) {
        this.$padding = padding;
    };
    this.setSession = function(session) {
        this.session = session;
    };
    
    this.setMarkers = function(markers) {
        this.markers = markers;
    };
    
    this.elt = function(className, css) {
        var x = this.i != -1 && this.element.childNodes[this.i];
        if (!x) {
            x = document.createElement("div");
            this.element.appendChild(x);
            this.i = -1;
        } else {
            this.i++;
        }
        x.style.cssText = css;
        x.className = className;
    };

    this.update = function(config) {
        if (!config) return;

        this.config = config;

        this.i = 0;
        var html;
        for (var key in this.markers) {
            var marker = this.markers[key];

            if (!marker.range) {
                marker.update(html, this, this.session, config);
                continue;
            }

            var range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty()) continue;

            range = range.toScreenRange(this.session);
            if (marker.renderer) {
                var top = this.$getTop(range.start.row, config);
                var left = this.$padding + range.start.column * config.characterWidth;
                marker.renderer(html, range, left, top, config);
            } else if (marker.type == "fullLine") {
                this.drawFullLineMarker(html, range, marker.clazz, config);
            } else if (marker.type == "screenLine") {
                this.drawScreenLineMarker(html, range, marker.clazz, config);
            } else if (range.isMultiLine()) {
                if (marker.type == "text")
                    this.drawTextMarker(html, range, marker.clazz, config);
                else
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
            } else {
                this.drawSingleLineMarker(html, range, marker.clazz + " ace_start" + " ace_br15", config);
            }
        }
        if (this.i !=-1) {
            while (this.i < this.element.childElementCount)
                this.element.removeChild(this.element.lastChild);
        }
    };

    this.$getTop = function(row, layerConfig) {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    };

    function getBorderClass(tl, tr, br, bl) {
        return (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
    }
    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig, extraStyle) {
        var session = this.session;
        var start = range.start.row;
        var end = range.end.row;
        var row = start;
        var prev = 0; 
        var curr = 0;
        var next = session.getScreenLastRowColumn(row);
        var lineRange = new Range(row, range.start.column, row, curr);
        for (; row <= end; row++) {
            lineRange.start.row = lineRange.end.row = row;
            lineRange.start.column = row == start ? range.start.column : session.getRowWrapIndent(row);
            lineRange.end.column = next;
            prev = curr;
            curr = next;
            next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row == end ? 0 : range.end.column;
            this.drawSingleLineMarker(stringBuilder, lineRange, 
                clazz + (row == start  ? " ace_start" : "") + " ace_br"
                    + getBorderClass(row == start || row == start + 1 && range.start.column, prev < curr, curr > next, row == end),
                layerConfig, row == end ? 0 : 1, extraStyle);
        }
    };
    this.drawMultiLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
        var padding = this.$padding;
        var height = config.lineHeight;
        var top = this.$getTop(range.start.row, config);
        var left = padding + range.start.column * config.characterWidth;
        extraStyle = extraStyle || "";

        if (this.session.$bidiHandler.isBidiRow(range.start.row)) {
           var range1 = range.clone();
           range1.end.row = range1.start.row;
           range1.end.column = this.session.getLine(range1.start.row).length;
           this.drawBidiSingleLineMarker(stringBuilder, range1, clazz + " ace_br1 ace_start", config, null, extraStyle);
        } else {
            this.elt(
                clazz + " ace_br1 ace_start",
                "height:"+ height+ "px;"+ "right:0;"+ "top:"+top+ "px;left:"+ left+ "px;" + (extraStyle || "")
            );
        }
        if (this.session.$bidiHandler.isBidiRow(range.end.row)) {
           var range1 = range.clone();
           range1.start.row = range1.end.row;
           range1.start.column = 0;
           this.drawBidiSingleLineMarker(stringBuilder, range1, clazz + " ace_br12", config, null, extraStyle);
        } else {
            top = this.$getTop(range.end.row, config);
            var width = range.end.column * config.characterWidth;

            this.elt(
                clazz + " ace_br12",
                "height:"+ height+ "px;"+
                "width:"+ width+ "px;"+
                "top:"+ top+ "px;"+
                "left:"+ padding+ "px;"+ (extraStyle || "")
            );
        }
        height = (range.end.row - range.start.row - 1) * config.lineHeight;
        if (height <= 0)
            return;
        top = this.$getTop(range.start.row + 1, config);
        
        var radiusClass = (range.start.column ? 1 : 0) | (range.end.column ? 0 : 8);

        this.elt(
            clazz + (radiusClass ? " ace_br" + radiusClass : ""),
            "height:"+ height+ "px;"+
            "right:0;"+
            "top:"+ top+ "px;"+
            "left:"+ padding+ "px;"+ (extraStyle || "")
        );
    };
    this.drawSingleLineMarker = function(stringBuilder, range, clazz, config, extraLength, extraStyle) {
        if (this.session.$bidiHandler.isBidiRow(range.start.row))
            return this.drawBidiSingleLineMarker(stringBuilder, range, clazz, config, extraLength, extraStyle);
        var height = config.lineHeight;
        var width = (range.end.column + (extraLength || 0) - range.start.column) * config.characterWidth;

        var top = this.$getTop(range.start.row, config);
        var left = this.$padding + range.start.column * config.characterWidth;

        this.elt(
            clazz,
            "height:"+ height+ "px;"+
            "width:"+ width+ "px;"+
            "top:"+ top+ "px;"+
            "left:"+ left+ "px;"+ (extraStyle || "")
        );
    };
    this.drawBidiSingleLineMarker = function(stringBuilder, range, clazz, config, extraLength, extraStyle) {
        var height = config.lineHeight, top = this.$getTop(range.start.row, config), padding = this.$padding;
        var selections = this.session.$bidiHandler.getSelections(range.start.column, range.end.column);

        selections.forEach(function(selection) {
            this.elt(
                clazz,
                "height:" + height + "px;" +
                "width:" + selection.width + (extraLength || 0) + "px;" +
                "top:" + top + "px;" +
                "left:" + (padding + selection.left) + "px;" + (extraStyle || "")
            );
        }, this);
    };

    this.drawFullLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;
        if (range.start.row != range.end.row)
            height += this.$getTop(range.end.row, config) - top;

        this.elt(
            clazz,
            "height:"+ height+ "px;"+
            "top:"+ top+ "px;"+
            "left:0;right:0;"+ (extraStyle || "")
        );
    };
    
    this.drawScreenLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;

        this.elt(
            clazz,
            "height:"+ height+ "px;"+
            "top:"+ top+ "px;"+
            "left:0;right:0;"+ (extraStyle || "")
        );
    };

}).call(Marker.prototype);

exports.Marker = Marker;

});

ace.define("ace/layer/text",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/layer/lines","ace/lib/event_emitter"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var Lines = require("./lines").Lines;
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var Text = function(parentEl) {
    this.dom = dom; 
    this.element = this.dom.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);
    this.$updateEolChar = this.$updateEolChar.bind(this);
    this.$lines = new Lines(this.element);
};

(function() {

    oop.implement(this, EventEmitter);

    this.EOF_CHAR = "\xB6";
    this.EOL_CHAR_LF = "\xAC";
    this.EOL_CHAR_CRLF = "\xa4";
    this.EOL_CHAR = this.EOL_CHAR_LF;
    this.TAB_CHAR = "\u2014"; //"\u21E5";
    this.SPACE_CHAR = "\xB7";
    this.$padding = 0;
    this.MAX_LINE_LENGTH = 10000;

    this.$updateEolChar = function() {
        var doc = this.session.doc;
        var unixMode = doc.getNewLineCharacter() == "\n" && doc.getNewLineMode() != "windows";
        var EOL_CHAR = unixMode ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
        if (this.EOL_CHAR != EOL_CHAR) {
            this.EOL_CHAR = EOL_CHAR;
            return true;
        }
    };

    this.setPadding = function(padding) {
        this.$padding = padding;
        this.element.style.margin = "0 " + padding + "px";
    };

    this.getLineHeight = function() {
        return this.$fontMetrics.$characterSize.height || 0;
    };

    this.getCharacterWidth = function() {
        return this.$fontMetrics.$characterSize.width || 0;
    };
    
    this.$setFontMetrics = function(measure) {
        this.$fontMetrics = measure;
        this.$fontMetrics.on("changeCharacterSize", function(e) {
            this._signal("changeCharacterSize", e);
        }.bind(this));
        this.$pollSizeChanges();
    };

    this.checkForSizeChanges = function() {
        this.$fontMetrics.checkForSizeChanges();
    };
    this.$pollSizeChanges = function() {
        return this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges();
    };
    this.setSession = function(session) {
        this.session = session;
        if (session)
            this.$computeTabString();
    };

    this.showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        this.$computeTabString();
        return true;
    };

    this.displayIndentGuides = true;
    this.setDisplayIndentGuides = function(display) {
        if (this.displayIndentGuides == display)
            return false;

        this.displayIndentGuides = display;
        this.$computeTabString();
        return true;
    };

    this.$tabStrings = [];
    this.onChangeTabSize =
    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        this.tabSize = tabSize;
        var tabStr = this.$tabStrings = [0];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showInvisibles) {
                var span = this.dom.createElement("span");
                span.className = "ace_invisible ace_invisible_tab";
                span.textContent = lang.stringRepeat(this.TAB_CHAR, i);
                tabStr.push(span);
            } else {
                tabStr.push(this.dom.createTextNode(lang.stringRepeat(" ", i), this.element));
            }
        }
        if (this.displayIndentGuides) {
            this.$indentGuideRe =  /\s\S| \t|\t |\s$/;
            var className = "ace_indent-guide";
            var spaceClass = "";
            var tabClass = "";
            if (this.showInvisibles) {
                className += " ace_invisible";
                spaceClass = " ace_invisible_space";
                tabClass = " ace_invisible_tab";
                var spaceContent = lang.stringRepeat(this.SPACE_CHAR, this.tabSize);
                var tabContent = lang.stringRepeat(this.TAB_CHAR, this.tabSize);
            } else {
                var spaceContent = lang.stringRepeat(" ", this.tabSize);
                var tabContent = spaceContent;
            }

            var span = this.dom.createElement("span");
            span.className = className + spaceClass;
            span.textContent = spaceContent;
            this.$tabStrings[" "] = span;
            
            var span = this.dom.createElement("span");
            span.className = className + tabClass;
            span.textContent = tabContent;
            this.$tabStrings["\t"] = span;
        }
    };

    this.updateLines = function(config, firstRow, lastRow) {
        if (this.config.lastRow != config.lastRow ||
            this.config.firstRow != config.firstRow) {
            return this.update(config);
        }
        
        this.config = config;

        var first = Math.max(firstRow, config.firstRow);
        var last = Math.min(lastRow, config.lastRow);

        var lineElements = this.element.childNodes;
        var lineElementsIdx = 0;

        for (var row = config.firstRow; row < first; row++) {
            var foldLine = this.session.getFoldLine(row);
            if (foldLine) {
                if (foldLine.containsRow(first)) {
                    first = foldLine.start.row;
                    break;
                } else {
                    row = foldLine.end.row;
                }
            }
            lineElementsIdx ++;
        }

        var heightChanged = false;
        var row = first;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row :Infinity;
            }
            if (row > last)
                break;

            var lineElement = lineElements[lineElementsIdx++];
            if (lineElement) {
                this.dom.removeChildren(lineElement);
                this.$renderLine(
                    lineElement, row, row == foldStart ? foldLine : false
                );
                var height = (config.lineHeight * this.session.getRowLength(row)) + "px";
                if (lineElement.style.height != height) {
                    heightChanged = true;
                    lineElement.style.height = height;
                }
            }
            row++;
        }
        if (heightChanged) {
            while (lineElementsIdx < this.$lines.cells.length) {
                var cell = this.$lines.cells[lineElementsIdx++];
                cell.element.style.top = this.$lines.computeLineTop(cell.row, config, this.session) + "px";
            }
        }
    };

    this.scrollLines = function(config) {
        var oldConfig = this.config;
        this.config = config;

        if (this.$lines.pageChanged(oldConfig, config))
            return this.update(config);
            
        this.$lines.moveContainer(config);
        
        var lastRow = config.lastRow;
        var oldLastRow = oldConfig ? oldConfig.lastRow : -1;

        if (!oldConfig || oldLastRow < config.firstRow)
            return this.update(config);

        if (lastRow < oldConfig.firstRow)
            return this.update(config);

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        if (oldConfig.firstRow < config.firstRow)
            for (var row=this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row>0; row--)
                this.$lines.shift();

        if (oldConfig.lastRow > config.lastRow)
            for (var row=this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row>0; row--)
                this.$lines.pop();

        if (config.firstRow < oldConfig.firstRow) {
            this.$lines.unshift(this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1));
        }

        if (config.lastRow > oldConfig.lastRow) {
            this.$lines.push(this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow));
        }
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow) {
        var fragment = [];
        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            var line = this.$lines.createCell(row, config, this.session);
            
            var lineEl = line.element;
            this.dom.removeChildren(lineEl);
            dom.setStyle(lineEl.style, "height", this.$lines.computeLineHeight(row, config, this.session) + "px");
            dom.setStyle(lineEl.style, "top", this.$lines.computeLineTop(row, config, this.session) + "px");
            this.$renderLine(lineEl, row, row == foldStart ? foldLine : false);

            if (this.$useLineGroups()) {
                lineEl.className = "ace_line_group";
            } else {
                lineEl.className = "ace_line";
            }
            fragment.push(line);

            row++;
        }
        return fragment;
    };

    this.update = function(config) {
        this.$lines.moveContainer(config);
        
        this.config = config;

        var firstRow = config.firstRow;
        var lastRow = config.lastRow;

        var lines = this.$lines;
        while (lines.getLength())
            lines.pop();
            
        lines.push(this.$renderLinesFragment(config, firstRow, lastRow));
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderToken = function(parent, screenColumn, token, value) {
        var self = this;
        var re = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;
        
        var valueFragment = this.dom.createFragment(this.element);

        var m;
        var i = 0;
        while (m = re.exec(value)) {
            var tab = m[1];
            var simpleSpace = m[2];
            var controlCharacter = m[3];
            var cjkSpace = m[4];
            var cjk = m[5];
            
            if (!self.showInvisibles && simpleSpace)
                continue;

            var before = i != m.index ? value.slice(i, m.index) : "";

            i = m.index + m[0].length;
            
            if (before) {
                valueFragment.appendChild(this.dom.createTextNode(before, this.element));
            }
                
            if (tab) {
                var tabSize = self.session.getScreenTabSize(screenColumn + m.index);
                valueFragment.appendChild(self.$tabStrings[tabSize].cloneNode(true));
                screenColumn += tabSize - 1;
            } else if (simpleSpace) {
                if (self.showInvisibles) {
                    var span = this.dom.createElement("span");
                    span.className = "ace_invisible ace_invisible_space";
                    span.textContent = lang.stringRepeat(self.SPACE_CHAR, simpleSpace.length);
                    valueFragment.appendChild(span);
                } else {
                    valueFragment.appendChild(this.com.createTextNode(simpleSpace, this.element));
                }
            } else if (controlCharacter) {
                var span = this.dom.createElement("span");
                span.className = "ace_invisible ace_invisible_space ace_invalid";
                span.textContent = lang.stringRepeat(self.SPACE_CHAR, controlCharacter.length);
                valueFragment.appendChild(span);
            } else if (cjkSpace) {
                var space = self.showInvisibles ? self.SPACE_CHAR : "";
                screenColumn += 1;
                
                var span = this.dom.createElement("span");
                span.style.width = (self.config.characterWidth * 2) + "px";
                span.className = self.showInvisibles ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                span.textContent = self.showInvisibles ? self.SPACE_CHAR : "";
                valueFragment.appendChild(span);
            } else if (cjk) {
                screenColumn += 1;
                var span = dom.createElement("span");
                span.style.width = (self.config.characterWidth * 2) + "px";
                span.className = "ace_cjk";
                span.textContent = cjk;
                valueFragment.appendChild(span);
            }
        }
        
        valueFragment.appendChild(this.dom.createTextNode(i ? value.slice(i) : value, this.element));

        if (!this.$textToken[token.type]) {
            var classes = "ace_" + token.type.replace(/\./g, " ace_");
            var span = this.dom.createElement("span");
            if (token.type == "fold")
                span.style.width = (token.value.length * this.config.characterWidth) + "px";
                
            span.className = classes;
            span.appendChild(valueFragment);
            
            parent.appendChild(span);
        }
        else {
            parent.appendChild(valueFragment);
        }
        
        return screenColumn + value.length;
    };

    this.renderIndentGuide = function(parent, value, max) {
        var cols = value.search(this.$indentGuideRe);
        if (cols <= 0 || cols >= max)
            return value;
        if (value[0] == " ") {
            cols -= cols % this.tabSize;
            var count = cols/this.tabSize;
            for (var i=0; i<count; i++) {
                parent.appendChild(this.$tabStrings[" "].cloneNode(true));
            }
            return value.substr(cols);
        } else if (value[0] == "\t") {
            for (var i=0; i<cols; i++) {
                parent.appendChild(this.$tabStrings["\t"].cloneNode(true));
            }
            return value.substr(cols);
        }
        return value;
    };

    this.$createLineElement = function(parent) {
        var lineEl = this.dom.createElement("div");
        lineEl.className = "ace_line";
        lineEl.style.height = this.config.lineHeight + "px";
        
        return lineEl;
    };

    this.$renderWrappedLine = function(parent, tokens, splits) {
        var chars = 0;
        var split = 0;
        var splitChars = splits[0];
        var screenColumn = 0;

        var lineEl = this.$createLineElement();
        parent.appendChild(lineEl);
        
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;
            if (i == 0 && this.displayIndentGuides) {
                chars = value.length;
                value = this.renderIndentGuide(lineEl, value, splitChars);
                if (!value)
                    continue;
                chars -= value.length;
            }

            if (chars + value.length < splitChars) {
                screenColumn = this.$renderToken(lineEl, screenColumn, token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    screenColumn = this.$renderToken(
                        lineEl, screenColumn,
                        token, value.substring(0, splitChars - chars)
                    );
                    value = value.substring(splitChars - chars);
                    chars = splitChars;

                    lineEl = this.$createLineElement();
                    parent.appendChild(lineEl);

                    lineEl.appendChild(this.dom.createTextNode(lang.stringRepeat("\xa0", splits.indent), this.element));

                    split ++;
                    screenColumn = 0;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    screenColumn = this.$renderToken(
                        lineEl, screenColumn, token, value
                    );
                }
            }
        }
    };

    this.$renderSimpleLine = function(parent, tokens) {
        var screenColumn = 0;
        var token = tokens[0];
        var value = token.value;
        if (this.displayIndentGuides)
            value = this.renderIndentGuide(parent, value);
        if (value)
            screenColumn = this.$renderToken(parent, screenColumn, token, value);
        for (var i = 1; i < tokens.length; i++) {
            token = tokens[i];
            value = token.value;
            if (screenColumn + value.length > this.MAX_LINE_LENGTH)
                return this.$renderOverflowMessage(parent, screenColumn, token, value);
            screenColumn = this.$renderToken(parent, screenColumn, token, value);
        }
    };
    
    this.$renderOverflowMessage = function(parent, screenColumn, token, value) {
        this.$renderToken(parent, screenColumn, token,
            value.slice(0, this.MAX_LINE_LENGTH - screenColumn));
            
        var overflowEl = this.dom.createElement("span");
        overflowEl.className = "ace_inline_button ace_keyword ace_toggle_wrap";
        overflowEl.style.position = "absolute";
        overflowEl.style.right = "0";
        overflowEl.textContent = "<click to see more...>";
        
        parent.appendChild(overflowEl);        
    };
    this.$renderLine = function(parent, row, foldLine) {
        if (!foldLine && foldLine != false)
            foldLine = this.session.getFoldLine(row);

        if (foldLine)
            var tokens = this.$getFoldLineTokens(row, foldLine);
        else
            var tokens = this.session.getTokens(row);

        var lastLineEl = parent;
        if (tokens.length) {
            var splits = this.session.getRowSplitData(row);
            if (splits && splits.length) {
                this.$renderWrappedLine(parent, tokens, splits);
                var lastLineEl = parent.lastChild;
            } else {
                var lastLineEl = parent;
                if (this.$useLineGroups()) {
                    lastLineEl = this.$createLineElement();
                    parent.appendChild(lastLineEl);
                }
                this.$renderSimpleLine(lastLineEl, tokens);
            }
        } else if (this.$useLineGroups()) {
            lastLineEl = this.$createLineElement();
            parent.appendChild(lastLineEl);
        }

        if (this.showInvisibles && lastLineEl) {
            if (foldLine)
                row = foldLine.end.row;

            var invisibleEl = this.dom.createElement("span");
            invisibleEl.className = "ace_invisible ace_invisible_eol";
            invisibleEl.textContent = row == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR;
            
            lastLineEl.appendChild(invisibleEl);
        }
    };

    this.$getFoldLineTokens = function(row, foldLine) {
        var session = this.session;
        var renderTokens = [];

        function addTokens(tokens, from, to) {
            var idx = 0, col = 0;
            while ((col + tokens[idx].value.length) < from) {
                col += tokens[idx].value.length;
                idx++;

                if (idx == tokens.length)
                    return;
            }
            if (col != from) {
                var value = tokens[idx].value.substring(from - col);
                if (value.length > (to - from))
                    value = value.substring(0, to - from);

                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });

                col = from + value.length;
                idx += 1;
            }

            while (col < to && idx < tokens.length) {
                var value = tokens[idx].value;
                if (value.length + col > to) {
                    renderTokens.push({
                        type: tokens[idx].type,
                        value: value.substring(0, to - col)
                    });
                } else
                    renderTokens.push(tokens[idx]);
                col += value.length;
                idx += 1;
            }
        }

        var tokens = session.getTokens(row);
        foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder != null) {
                renderTokens.push({
                    type: "fold",
                    value: placeholder
                });
            } else {
                if (isNewRow)
                    tokens = session.getTokens(row);

                if (tokens.length)
                    addTokens(tokens, lastColumn, column);
            }
        }, foldLine.end.row, this.session.getLine(foldLine.end.row).length);

        return renderTokens;
    };

    this.$useLineGroups = function() {
        return this.session.getUseWrapMode();
    };

    this.destroy = function() {};
}).call(Text.prototype);

exports.Text = Text;

});

ace.define("ace/layer/cursor",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");

var Cursor = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    parentEl.appendChild(this.element);
    
    this.isVisible = false;
    this.isBlinking = true;
    this.blinkInterval = 1000;
    this.smoothBlinking = false;

    this.cursors = [];
    this.cursor = this.addCursor();
    dom.addCssClass(this.element, "ace_hidden-cursors");
    this.$updateCursors = this.$updateOpacity.bind(this);
};

(function() {
    
    this.$updateOpacity = function(val) {
        var cursors = this.cursors;
        for (var i = cursors.length; i--; )
            dom.setStyle(cursors[i].style, "opacity", val ? "" : "0");
    };

    this.$startCssAnimation = function() {
        var cursors = this.cursors;
        for (var i = cursors.length; i--; )
            cursors[i].style.animationDuration = this.blinkInterval + "ms";

        setTimeout(function() {
            dom.addCssClass(this.element, "ace_animate-blinking");
        }.bind(this));
    };
    
    this.$stopCssAnimation = function() {
        dom.removeCssClass(this.element, "ace_animate-blinking");
    };

    this.$padding = 0;
    this.setPadding = function(padding) {
        this.$padding = padding;
    };

    this.setSession = function(session) {
        this.session = session;
    };

    this.setBlinking = function(blinking) {
        if (blinking != this.isBlinking) {
            this.isBlinking = blinking;
            this.restartTimer();
        }
    };

    this.setBlinkInterval = function(blinkInterval) {
        if (blinkInterval != this.blinkInterval) {
            this.blinkInterval = blinkInterval;
            this.restartTimer();
        }
    };

    this.setSmoothBlinking = function(smoothBlinking) {
        if (smoothBlinking != this.smoothBlinking) {
            this.smoothBlinking = smoothBlinking;
            dom.setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
            this.$updateCursors(true);
            this.restartTimer();
        }
    };

    this.addCursor = function() {
        var el = dom.createElement("div");
        el.className = "ace_cursor";
        this.element.appendChild(el);
        this.cursors.push(el);
        return el;
    };

    this.removeCursor = function() {
        if (this.cursors.length > 1) {
            var el = this.cursors.pop();
            el.parentNode.removeChild(el);
            return el;
        }
    };

    this.hideCursor = function() {
        this.isVisible = false;
        dom.addCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    };

    this.showCursor = function() {
        this.isVisible = true;
        dom.removeCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    };

    this.restartTimer = function() {
        var update = this.$updateCursors;
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        this.$stopCssAnimation();

        if (this.smoothBlinking) {
            dom.removeCssClass(this.element, "ace_smooth-blinking");
        }
        
        update(true);

        if (!this.isBlinking || !this.blinkInterval || !this.isVisible) {
            this.$stopCssAnimation();
            return;
        }

        if (this.smoothBlinking) {
            setTimeout(function(){
                dom.addCssClass(this.element, "ace_smooth-blinking");
            }.bind(this));
        }
        
        if (dom.HAS_CSS_ANIMATION) {
            this.$startCssAnimation();
        } else {
            var blink = function(){
                this.timeoutId = setTimeout(function() {
                    update(false);
                }, 0.6 * this.blinkInterval);
            }.bind(this);
    
            this.intervalId = setInterval(function() {
                update(true);
                blink();
            }, this.blinkInterval);
            blink();
        }
    };

    this.getPixelPosition = function(position, onScreen) {
        if (!this.config || !this.session)
            return {left : 0, top : 0};

        if (!position)
            position = this.session.selection.getCursor();
        var pos = this.session.documentToScreenPosition(position);
        var cursorLeft = this.$padding + (this.session.$bidiHandler.isBidiRow(pos.row, position.row)
            ? this.session.$bidiHandler.getPosLeft(pos.column)
            : pos.column * this.config.characterWidth);

        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) *
            this.config.lineHeight;

        return {left : cursorLeft, top : cursorTop};
    };

    this.isCursorInView = function(pixelPos, config) {
        return pixelPos.top >= 0 && pixelPos.top < config.maxHeight;
    };

    this.update = function(config) {
        this.config = config;

        var selections = this.session.$selectionMarkers;
        var i = 0, cursorIndex = 0;

        if (selections === undefined || selections.length === 0){
            selections = [{cursor: null}];
        }

        for (var i = 0, n = selections.length; i < n; i++) {
            var pixelPos = this.getPixelPosition(selections[i].cursor, true);
            if ((pixelPos.top > config.height + config.offset ||
                 pixelPos.top < 0) && i > 1) {
                continue;
            }

            var element = this.cursors[cursorIndex++] || this.addCursor();
            var style = element.style;
            
            if (!this.drawCursor) {
                if (!this.isCursorInView(pixelPos, config)) {
                    dom.setStyle(style, "display", "none");
                } else {
                    dom.setStyle(style, "display", "block");
                    dom.translate(element, pixelPos.left, pixelPos.top);
                    dom.setStyle(style, "width", Math.round(config.characterWidth) + "px");
                    dom.setStyle(style, "height", config.lineHeight + "px");
                }
            } else {
                this.drawCursor(element, pixelPos, config, selections[i], this.session);
            }
        }
        while (this.cursors.length > cursorIndex)
            this.removeCursor();

        var overwrite = this.session.getOverwrite();
        this.$setOverwrite(overwrite);
        this.$pixelPos = pixelPos;
        this.restartTimer();
    };
    
    this.drawCursor = null;

    this.$setOverwrite = function(overwrite) {
        if (overwrite != this.overwrite) {
            this.overwrite = overwrite;
            if (overwrite)
                dom.addCssClass(this.element, "ace_overwrite-cursors");
            else
                dom.removeCssClass(this.element, "ace_overwrite-cursors");
        }
    };

    this.destroy = function() {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
    };

}).call(Cursor.prototype);

exports.Cursor = Cursor;

});

ace.define("ace/scrollbar",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/lib/event","ace/lib/event_emitter"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var event = require("./lib/event");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var MAX_SCROLL_H = 0x8000;
var ScrollBar = function(parent) {
    this.element = dom.createElement("div");
    this.element.className = "ace_scrollbar ace_scrollbar" + this.classSuffix;

    this.inner = dom.createElement("div");
    this.inner.className = "ace_scrollbar-inner";
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    this.setVisible(false);
    this.skipEvent = false;

    event.addListener(this.element, "scroll", this.onScroll.bind(this));
    event.addListener(this.element, "mousedown", event.preventDefault);
};

(function() {
    oop.implement(this, EventEmitter);

    this.setVisible = function(isVisible) {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
        this.coeff = 1;
    };
}).call(ScrollBar.prototype);
var VScrollBar = function(parent, renderer) {
    ScrollBar.call(this, parent);
    this.scrollTop = 0;
    this.scrollHeight = 0;
    renderer.$scrollbarWidth = 
    this.width = dom.scrollbarWidth(parent.ownerDocument);
    this.inner.style.width =
    this.element.style.width = (this.width || 15) + 5 + "px";
    this.$minWidth = 0;
};

oop.inherits(VScrollBar, ScrollBar);

(function() {

    this.classSuffix = '-v';
    this.onScroll = function() {
        if (!this.skipEvent) {
            this.scrollTop = this.element.scrollTop;
            if (this.coeff != 1) {
                var h = this.element.clientHeight / this.scrollHeight;
                this.scrollTop = this.scrollTop * (1 - h) / (this.coeff - h);
            }
            this._emit("scroll", {data: this.scrollTop});
        }
        this.skipEvent = false;
    };
    this.getWidth = function() {
        return Math.max(this.isVisible ? this.width : 0, this.$minWidth || 0);
    };
    this.setHeight = function(height) {
        this.element.style.height = height + "px";
    };
    this.setInnerHeight = 
    this.setScrollHeight = function(height) {
        this.scrollHeight = height;
        if (height > MAX_SCROLL_H) {
            this.coeff = MAX_SCROLL_H / height;
            height = MAX_SCROLL_H;
        } else if (this.coeff != 1) {
            this.coeff = 1;
        }
        this.inner.style.height = height + "px";
    };
    this.setScrollTop = function(scrollTop) {
        if (this.scrollTop != scrollTop) {
            this.skipEvent = true;
            this.scrollTop = scrollTop;
            this.element.scrollTop = scrollTop * this.coeff;
        }
    };

}).call(VScrollBar.prototype);
var HScrollBar = function(parent, renderer) {
    ScrollBar.call(this, parent);
    this.scrollLeft = 0;
    this.height = renderer.$scrollbarWidth;
    this.inner.style.height =
    this.element.style.height = (this.height || 15) + 5 + "px";
};

oop.inherits(HScrollBar, ScrollBar);

(function() {

    this.classSuffix = '-h';
    this.onScroll = function() {
        if (!this.skipEvent) {
            this.scrollLeft = this.element.scrollLeft;
            this._emit("scroll", {data: this.scrollLeft});
        }
        this.skipEvent = false;
    };
    this.getHeight = function() {
        return this.isVisible ? this.height : 0;
    };
    this.setWidth = function(width) {
        this.element.style.width = width + "px";
    };
    this.setInnerWidth = function(width) {
        this.inner.style.width = width + "px";
    };
    this.setScrollWidth = function(width) {
        this.inner.style.width = width + "px";
    };
    this.setScrollLeft = function(scrollLeft) {
        if (this.scrollLeft != scrollLeft) {
            this.skipEvent = true;
            this.scrollLeft = this.element.scrollLeft = scrollLeft;
        }
    };

}).call(HScrollBar.prototype);


exports.ScrollBar = VScrollBar; // backward compatibility
exports.ScrollBarV = VScrollBar; // backward compatibility
exports.ScrollBarH = HScrollBar; // backward compatibility

exports.VScrollBar = VScrollBar;
exports.HScrollBar = HScrollBar;
});

ace.define("ace/renderloop",["require","exports","module","ace/lib/event"], function(require, exports, module) {
"use strict";

var event = require("./lib/event");


var RenderLoop = function(onRender, win) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0;
    this.$recursionLimit = 2;
    this.window = win || window;
    var _self = this;
    this._flush = function(ts) {
        _self.pending = false;
        var changes = _self.changes;

        if (changes) {
            event.blockIdle(100);
            _self.changes = 0;
            _self.onRender(changes);
        }
        
        if (_self.changes) {
            if (_self.$recursionLimit-- < 0) return;
            _self.schedule();
        } else {
            _self.$recursionLimit = 2;
        }
    };
};

(function() {

    this.schedule = function(change) {
        this.changes = this.changes | change;
        if (this.changes && !this.pending) {
            event.nextFrame(this._flush);
            this.pending = true;
        }
    };

    this.clear = function(change) {
        var changes = this.changes;
        this.changes = 0;
        return changes;
    };

}).call(RenderLoop.prototype);

exports.RenderLoop = RenderLoop;
});

ace.define("ace/layer/font_metrics",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/lib/event","ace/lib/useragent","ace/lib/event_emitter"], function(require, exports, module) {

var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var event = require("../lib/event");
var useragent = require("../lib/useragent");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var CHAR_COUNT = 256;
var USE_OBSERVER = typeof ResizeObserver == "function";
var L = 200;

var FontMetrics = exports.FontMetrics = function(parentEl) {
    this.el = dom.createElement("div");
    this.$setMeasureNodeStyles(this.el.style, true);
    
    this.$main = dom.createElement("div");
    this.$setMeasureNodeStyles(this.$main.style);
    
    this.$measureNode = dom.createElement("div");
    this.$setMeasureNodeStyles(this.$measureNode.style);
    
    
    this.el.appendChild(this.$main);
    this.el.appendChild(this.$measureNode);
    parentEl.appendChild(this.el);
    
    this.$measureNode.innerHTML = lang.stringRepeat("X", CHAR_COUNT);
    
    this.$characterSize = {width: 0, height: 0};
    
    
    if (USE_OBSERVER)
        this.$addObserver();
    else
        this.checkForSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);
        
    this.$characterSize = {width: 0, height: 0};
    
    this.$setMeasureNodeStyles = function(style, isRoot) {
        style.width = style.height = "auto";
        style.left = style.top = "0px";
        style.visibility = "hidden";
        style.position = "absolute";
        style.whiteSpace = "pre";

        if (useragent.isIE < 8) {
            style["font-family"] = "inherit";
        } else {
            style.font = "inherit";
        }
        style.overflow = isRoot ? "hidden" : "visible";
    };

    this.checkForSizeChanges = function(size) {
        if (size === undefined)
            size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$measureNode.style.fontWeight = "bold";
            var boldSize = this.$measureSizes();
            this.$measureNode.style.fontWeight = "";
            this.$characterSize = size;
            this.charSizes = Object.create(null);
            this.allowBoldFonts = boldSize && boldSize.width === size.width && boldSize.height === size.height;
            this._emit("changeCharacterSize", {data: size});
        }
    };
    
    this.$addObserver = function() {
        var self = this;
        this.$observer = new window.ResizeObserver(function(e) {
            var rect = e[0].contentRect;
            self.checkForSizeChanges({
                height: rect.height,
                width: rect.width / CHAR_COUNT
            });
        });
        this.$observer.observe(this.$measureNode);
    };

    this.$pollSizeChanges = function() {
        if (this.$pollSizeChangesTimer || this.$observer)
            return this.$pollSizeChangesTimer;
        var self = this;
        
        return this.$pollSizeChangesTimer = event.onIdle(function cb() {
            self.checkForSizeChanges();
            event.onIdle(cb, 500);
        }, 500);
    };
    
    this.setPolling = function(val) {
        if (val) {
            this.$pollSizeChanges();
        } else if (this.$pollSizeChangesTimer) {
            clearInterval(this.$pollSizeChangesTimer);
            this.$pollSizeChangesTimer = 0;
        }
    };

    this.$measureSizes = function(node) {
        var size = {
            height: (node || this.$measureNode).clientHeight,
            width: (node || this.$measureNode).clientWidth / CHAR_COUNT
        };
        if (size.width === 0 || size.height === 0)
            return null;
        return size;
    };

    this.$measureCharWidth = function(ch) {
        this.$main.innerHTML = lang.stringRepeat(ch, CHAR_COUNT);
        var rect = this.$main.getBoundingClientRect();
        return rect.width / CHAR_COUNT;
    };
    
    this.getCharacterWidth = function(ch) {
        var w = this.charSizes[ch];
        if (w === undefined) {
            w = this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width;
        }
        return w;
    };

    this.destroy = function() {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.$observer)
            this.$observer.disconnect();
        if (this.el && this.el.parentNode)
            this.el.parentNode.removeChild(this.el);
    };

    
    this.$getZoom = function getZoom(element) {
        if (!element) return 1;
        return (window.getComputedStyle(element).zoom || 1) * getZoom(element.parentElement);
    };
    this.$initTransformMeasureNodes = function() {
        var t = function(t, l) {
            return ["div", {
                style: "position: absolute;top:" + t + "px;left:" + l + "px;"
            }];
        };
        this.els = dom.buildDom([t(0, 0), t(L, 0), t(0, L), t(L, L)], this.el);
    };
    this.transformCoordinates = function(clientPos, elPos) {
        if (clientPos) {
            var zoom = this.$getZoom(this.el);
            clientPos = mul(1 / zoom, clientPos);
        }
        function solve(l1, l2, r) {
            var det = l1[1] * l2[0] - l1[0] * l2[1];
            return [
                (-l2[1] * r[0] + l2[0] * r[1]) / det,
                (+l1[1] * r[0] - l1[0] * r[1]) / det
            ];
        }
        function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
        function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
        function mul(a, b) { return [a * b[0], a * b[1]]; }

        if (!this.els)
            this.$initTransformMeasureNodes();
        
        function p(el) {
            var r = el.getBoundingClientRect();
            return [r.left, r.top];
        }

        var a = p(this.els[0]);
        var b = p(this.els[1]);
        var c = p(this.els[2]);
        var d = p(this.els[3]);

        var h = solve(sub(d, b), sub(d, c), sub(add(b, c), add(d, a)));

        var m1 = mul(1 + h[0], sub(b, a));
        var m2 = mul(1 + h[1], sub(c, a));
        
        if (elPos) {
            var x = elPos;
            var k = h[0] * x[0] / L + h[1] * x[1] / L + 1;
            var ut = add(mul(x[0], m1), mul(x[1], m2));
            return  add(mul(1 / k / L, ut), a);
        }
        var u = sub(clientPos, a);
        var f = solve(sub(m1, mul(h[0], u)), sub(m2, mul(h[1], u)), u);
        return mul(L, f);
    };
    
}).call(FontMetrics.prototype);

});

ace.define("ace/virtual_renderer",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/config","ace/layer/gutter","ace/layer/marker","ace/layer/text","ace/layer/cursor","ace/scrollbar","ace/scrollbar","ace/renderloop","ace/layer/font_metrics","ace/lib/event_emitter","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var config = require("./config");
var GutterLayer = require("./layer/gutter").Gutter;
var MarkerLayer = require("./layer/marker").Marker;
var TextLayer = require("./layer/text").Text;
var CursorLayer = require("./layer/cursor").Cursor;
var HScrollBar = require("./scrollbar").HScrollBar;
var VScrollBar = require("./scrollbar").VScrollBar;
var RenderLoop = require("./renderloop").RenderLoop;
var FontMetrics = require("./layer/font_metrics").FontMetrics;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var editorCss = "\
.ace_br1 {border-top-left-radius    : 3px;}\
.ace_br2 {border-top-right-radius   : 3px;}\
.ace_br3 {border-top-left-radius    : 3px; border-top-right-radius:    3px;}\
.ace_br4 {border-bottom-right-radius: 3px;}\
.ace_br5 {border-top-left-radius    : 3px; border-bottom-right-radius: 3px;}\
.ace_br6 {border-top-right-radius   : 3px; border-bottom-right-radius: 3px;}\
.ace_br7 {border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px;}\
.ace_br8 {border-bottom-left-radius : 3px;}\
.ace_br9 {border-top-left-radius    : 3px; border-bottom-left-radius:  3px;}\
.ace_br10{border-top-right-radius   : 3px; border-bottom-left-radius:  3px;}\
.ace_br11{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-left-radius:  3px;}\
.ace_br12{border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br13{border-top-left-radius    : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br14{border-top-right-radius   : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br15{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;}\
.ace_editor {\
position: relative;\
overflow: hidden;\
font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;\
direction: ltr;\
text-align: left;\
-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\
}\
.ace_scroller {\
position: absolute;\
overflow: hidden;\
top: 0;\
bottom: 0;\
background-color: inherit;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
cursor: text;\
}\
.ace_content {\
position: absolute;\
box-sizing: border-box;\
min-width: 100%;\
contain: style size layout;\
}\
.ace_dragging .ace_scroller:before{\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
bottom: 0;\
content: '';\
background: rgba(250, 250, 250, 0.01);\
z-index: 1000;\
}\
.ace_dragging.ace_dark .ace_scroller:before{\
background: rgba(0, 0, 0, 0.01);\
}\
.ace_selecting, .ace_selecting * {\
cursor: text !important;\
}\
.ace_gutter {\
position: absolute;\
overflow : hidden;\
width: auto;\
top: 0;\
bottom: 0;\
left: 0;\
cursor: default;\
z-index: 4;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
contain: style size layout;\
}\
.ace_gutter-active-line {\
position: absolute;\
left: 0;\
right: 0;\
}\
.ace_scroller.ace_scroll-left {\
box-shadow: 17px 0 16px -16px rgba(0, 0, 0, 0.4) inset;\
}\
.ace_gutter-cell {\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
padding-left: 19px;\
padding-right: 6px;\
background-repeat: no-repeat;\
}\
.ace_gutter-cell.ace_error {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==\");\
background-repeat: no-repeat;\
background-position: 2px center;\
}\
.ace_gutter-cell.ace_warning {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==\");\
background-position: 2px center;\
}\
.ace_gutter-cell.ace_info {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAJ0Uk5TAAB2k804AAAAPklEQVQY02NgIB68QuO3tiLznjAwpKTgNyDbMegwisCHZUETUZV0ZqOquBpXj2rtnpSJT1AEnnRmL2OgGgAAIKkRQap2htgAAAAASUVORK5CYII=\");\
background-position: 2px center;\
}\
.ace_dark .ace_gutter-cell.ace_info {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAChoaGAgIAqKiq+vr6tra1ZWVmUlJSbm5s8PDxubm56enrdgzg3AAAAAXRSTlMAQObYZgAAAClJREFUeNpjYMAPdsMYHegyJZFQBlsUlMFVCWUYKkAZMxZAGdxlDMQBAG+TBP4B6RyJAAAAAElFTkSuQmCC\");\
}\
.ace_scrollbar {\
contain: strict;\
position: absolute;\
right: 0;\
bottom: 0;\
z-index: 6;\
}\
.ace_scrollbar-inner {\
position: absolute;\
cursor: text;\
left: 0;\
top: 0;\
}\
.ace_scrollbar-v{\
overflow-x: hidden;\
overflow-y: scroll;\
top: 0;\
}\
.ace_scrollbar-h {\
overflow-x: scroll;\
overflow-y: hidden;\
left: 0;\
}\
.ace_print-margin {\
position: absolute;\
height: 100%;\
}\
.ace_text-input {\
position: absolute;\
z-index: 0;\
width: 0.5em;\
height: 1em;\
opacity: 0;\
background: transparent;\
-moz-appearance: none;\
appearance: none;\
border: none;\
resize: none;\
outline: none;\
overflow: hidden;\
font: inherit;\
padding: 0 1px;\
margin: 0 -1px;\
contain: strict;\
-ms-user-select: text;\
-moz-user-select: text;\
-webkit-user-select: text;\
user-select: text;\
white-space: pre!important;\
}\
.ace_text-input.ace_composition {\
background: transparent;\
color: inherit;\
z-index: 1000;\
opacity: 1;\
}\
.ace_composition_placeholder { color: transparent }\
.ace_composition_marker { \
border-bottom: 1px solid;\
position: absolute;\
border-radius: 0;\
margin-top: 1px;\
}\
[ace_nocontext=true] {\
transform: none!important;\
filter: none!important;\
perspective: none!important;\
clip-path: none!important;\
mask : none!important;\
contain: none!important;\
perspective: none!important;\
mix-blend-mode: initial!important;\
z-index: auto;\
}\
.ace_layer {\
z-index: 1;\
position: absolute;\
overflow: hidden;\
word-wrap: normal;\
white-space: pre;\
height: 100%;\
width: 100%;\
box-sizing: border-box;\
pointer-events: none;\
}\
.ace_gutter-layer {\
position: relative;\
width: auto;\
text-align: right;\
pointer-events: auto;\
height: 1000000px;\
contain: style size layout;\
}\
.ace_text-layer {\
font: inherit !important;\
position: absolute;\
height: 1000000px;\
width: 1000000px;\
contain: style size layout;\
}\
.ace_text-layer > .ace_line, .ace_text-layer > .ace_line_group {\
contain: style size layout;\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
}\
.ace_hidpi .ace_text-layer,\
.ace_hidpi .ace_gutter-layer,\
.ace_hidpi .ace_content,\
.ace_hidpi .ace_gutter {\
contain: strict;\
will-change: transform;\
}\
.ace_hidpi .ace_text-layer > .ace_line, \
.ace_hidpi .ace_text-layer > .ace_line_group {\
contain: strict;\
}\
.ace_cjk {\
display: inline-block;\
text-align: center;\
}\
.ace_cursor-layer {\
z-index: 4;\
}\
.ace_cursor {\
z-index: 4;\
position: absolute;\
box-sizing: border-box;\
border-left: 2px solid;\
transform: translatez(0);\
}\
.ace_multiselect .ace_cursor {\
border-left-width: 1px;\
}\
.ace_slim-cursors .ace_cursor {\
border-left-width: 1px;\
}\
.ace_overwrite-cursors .ace_cursor {\
border-left-width: 0;\
border-bottom: 1px solid;\
}\
.ace_hidden-cursors .ace_cursor {\
opacity: 0.2;\
}\
.ace_smooth-blinking .ace_cursor {\
transition: opacity 0.18s;\
}\
.ace_animate-blinking .ace_cursor {\
animation-duration: 1000ms;\
animation-timing-function: step-end;\
animation-name: blink-ace-animate;\
animation-iteration-count: infinite;\
}\
.ace_animate-blinking.ace_smooth-blinking .ace_cursor {\
animation-duration: 1000ms;\
animation-timing-function: ease-in-out;\
animation-name: blink-ace-animate-smooth;\
}\
@keyframes blink-ace-animate {\
from, to { opacity: 1; }\
60% { opacity: 0; }\
}\
@keyframes blink-ace-animate-smooth {\
from, to { opacity: 1; }\
45% { opacity: 1; }\
60% { opacity: 0; }\
85% { opacity: 0; }\
}\
.ace_marker-layer .ace_step, .ace_marker-layer .ace_stack {\
position: absolute;\
z-index: 3;\
}\
.ace_marker-layer .ace_selection {\
position: absolute;\
z-index: 5;\
}\
.ace_marker-layer .ace_bracket {\
position: absolute;\
z-index: 6;\
}\
.ace_marker-layer .ace_active-line {\
position: absolute;\
z-index: 2;\
}\
.ace_marker-layer .ace_selected-word {\
position: absolute;\
z-index: 4;\
box-sizing: border-box;\
}\
.ace_line .ace_fold {\
box-sizing: border-box;\
display: inline-block;\
height: 11px;\
margin-top: -2px;\
vertical-align: middle;\
background-image:\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII=\"),\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACJJREFUeNpi+P//fxgTAwPDBxDxD078RSX+YeEyDFMCIMAAI3INmXiwf2YAAAAASUVORK5CYII=\");\
background-repeat: no-repeat, repeat-x;\
background-position: center center, top left;\
color: transparent;\
border: 1px solid black;\
border-radius: 2px;\
cursor: pointer;\
pointer-events: auto;\
}\
.ace_dark .ace_fold {\
}\
.ace_fold:hover{\
background-image:\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII=\"),\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpi+P//fz4TAwPDZxDxD5X4i5fLMEwJgAADAEPVDbjNw87ZAAAAAElFTkSuQmCC\");\
}\
.ace_tooltip {\
background-color: #FFF;\
background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));\
border: 1px solid gray;\
border-radius: 1px;\
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\
color: black;\
max-width: 100%;\
padding: 3px 4px;\
position: fixed;\
z-index: 999999;\
box-sizing: border-box;\
cursor: default;\
white-space: pre;\
word-wrap: break-word;\
line-height: normal;\
font-style: normal;\
font-weight: normal;\
letter-spacing: normal;\
pointer-events: none;\
}\
.ace_folding-enabled > .ace_gutter-cell {\
padding-right: 13px;\
}\
.ace_fold-widget {\
box-sizing: border-box;\
margin: 0 -12px 0 1px;\
display: none;\
width: 11px;\
vertical-align: top;\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42mWKsQ0AMAzC8ixLlrzQjzmBiEjp0A6WwBCSPgKAXoLkqSot7nN3yMwR7pZ32NzpKkVoDBUxKAAAAABJRU5ErkJggg==\");\
background-repeat: no-repeat;\
background-position: center;\
border-radius: 3px;\
border: 1px solid transparent;\
cursor: pointer;\
}\
.ace_folding-enabled .ace_fold-widget {\
display: inline-block;   \
}\
.ace_fold-widget.ace_end {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42m3HwQkAMAhD0YzsRchFKI7sAikeWkrxwScEB0nh5e7KTPWimZki4tYfVbX+MNl4pyZXejUO1QAAAABJRU5ErkJggg==\");\
}\
.ace_fold-widget.ace_closed {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAYAAAAG5SQMAAAAOUlEQVR42jXKwQkAMAgDwKwqKD4EwQ26sSOkVWjgIIHAzPiCgaqiqnJHZnKICBERHN194O5b9vbLuAVRL+l0YWnZAAAAAElFTkSuQmCCXA==\");\
}\
.ace_fold-widget:hover {\
border: 1px solid rgba(0, 0, 0, 0.3);\
background-color: rgba(255, 255, 255, 0.2);\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);\
}\
.ace_fold-widget:active {\
border: 1px solid rgba(0, 0, 0, 0.4);\
background-color: rgba(0, 0, 0, 0.05);\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);\
}\
.ace_dark .ace_fold-widget {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHklEQVQIW2P4//8/AzoGEQ7oGCaLLAhWiSwB146BAQCSTPYocqT0AAAAAElFTkSuQmCC\");\
}\
.ace_dark .ace_fold-widget.ace_end {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAH0lEQVQIW2P4//8/AxQ7wNjIAjDMgC4AxjCVKBirIAAF0kz2rlhxpAAAAABJRU5ErkJggg==\");\
}\
.ace_dark .ace_fold-widget.ace_closed {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAHElEQVQIW2P4//+/AxAzgDADlOOAznHAKgPWAwARji8UIDTfQQAAAABJRU5ErkJggg==\");\
}\
.ace_dark .ace_fold-widget:hover {\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);\
background-color: rgba(255, 255, 255, 0.1);\
}\
.ace_dark .ace_fold-widget:active {\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);\
}\
.ace_inline_button {\
border: 1px solid lightgray;\
display: inline-block;\
margin: -1px 8px;\
padding: 0 5px;\
pointer-events: auto;\
cursor: pointer;\
}\
.ace_inline_button:hover {\
border-color: gray;\
background: rgba(200,200,200,0.2);\
display: inline-block;\
pointer-events: auto;\
}\
.ace_fold-widget.ace_invalid {\
background-color: #FFB4B4;\
border-color: #DE5555;\
}\
.ace_fade-fold-widgets .ace_fold-widget {\
transition: opacity 0.4s ease 0.05s;\
opacity: 0;\
}\
.ace_fade-fold-widgets:hover .ace_fold-widget {\
transition: opacity 0.05s ease 0.05s;\
opacity:1;\
}\
.ace_underline {\
text-decoration: underline;\
}\
.ace_bold {\
font-weight: bold;\
}\
.ace_nobold .ace_bold {\
font-weight: normal;\
}\
.ace_italic {\
font-style: italic;\
}\
.ace_error-marker {\
background-color: rgba(255, 0, 0,0.2);\
position: absolute;\
z-index: 9;\
}\
.ace_highlight-marker {\
background-color: rgba(255, 255, 0,0.2);\
position: absolute;\
z-index: 8;\
}\
";

var useragent = require("./lib/useragent");
var HIDE_TEXTAREA = useragent.isIE;

dom.importCssString(editorCss, "ace_editor.css");

var VirtualRenderer = function(container, theme) {
    var _self = this;

    this.container = container || dom.createElement("div");

    dom.addCssClass(this.container, "ace_editor");
    if (dom.HI_DPI) dom.addCssClass(this.container, "ace_hidpi");

    this.setTheme(theme);

    this.$gutter = dom.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.$gutter.setAttribute("aria-hidden", true);

    this.scroller = dom.createElement("div");
    this.scroller.className = "ace_scroller";
    
    this.container.appendChild(this.scroller);

    this.content = dom.createElement("div");
    this.content.className = "ace_content";
    this.scroller.appendChild(this.content);

    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));

    this.$markerBack = new MarkerLayer(this.content);

    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;

    this.$markerFront = new MarkerLayer(this.content);

    this.$cursorLayer = new CursorLayer(this.content);
    this.$horizScroll = false;
    this.$vScroll = false;

    this.scrollBar = 
    this.scrollBarV = new VScrollBar(this.container, this);
    this.scrollBarH = new HScrollBar(this.container, this);
    this.scrollBarV.addEventListener("scroll", function(e) {
        if (!_self.$scrollAnimation)
            _self.session.setScrollTop(e.data - _self.scrollMargin.top);
    });
    this.scrollBarH.addEventListener("scroll", function(e) {
        if (!_self.$scrollAnimation)
            _self.session.setScrollLeft(e.data - _self.scrollMargin.left);
    });

    this.scrollTop = 0;
    this.scrollLeft = 0;

    this.cursorPos = {
        row : 0,
        column : 0
    };

    this.$fontMetrics = new FontMetrics(this.container);
    this.$textLayer.$setFontMetrics(this.$fontMetrics);
    this.$textLayer.addEventListener("changeCharacterSize", function(e) {
        _self.updateCharacterSize();
        _self.onResize(true, _self.gutterWidth, _self.$size.width, _self.$size.height);
        _self._signal("changeCharacterSize", e);
    });

    this.$size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0,
        $dirty: true
    };

    this.layerConfig = {
        width : 1,
        padding : 0,
        firstRow : 0,
        firstRowScreen: 0,
        lastRow : 0,
        lineHeight : 0,
        characterWidth : 0,
        minHeight : 1,
        maxHeight : 1,
        offset : 0,
        height : 1,
        gutterOffset: 1
    };
    
    this.scrollMargin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        v: 0,
        h: 0
    };
    
    this.margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        v: 0,
        h: 0
    };
    
    this.$keepTextAreaAtCursor = !useragent.isIOS;

    this.$loop = new RenderLoop(
        this.$renderChanges.bind(this),
        this.container.ownerDocument.defaultView
    );
    this.$loop.schedule(this.CHANGE_FULL);

    this.updateCharacterSize();
    this.setPadding(4);
    config.resetOptions(this);
    config._emit("renderer", this);
};

(function() {

    this.CHANGE_CURSOR = 1;
    this.CHANGE_MARKER = 2;
    this.CHANGE_GUTTER = 4;
    this.CHANGE_SCROLL = 8;
    this.CHANGE_LINES = 16;
    this.CHANGE_TEXT = 32;
    this.CHANGE_SIZE = 64;
    this.CHANGE_MARKER_BACK = 128;
    this.CHANGE_MARKER_FRONT = 256;
    this.CHANGE_FULL = 512;
    this.CHANGE_H_SCROLL = 1024;

    oop.implement(this, EventEmitter);

    this.updateCharacterSize = function() {
        if (this.$textLayer.allowBoldFonts != this.$allowBoldFonts) {
            this.$allowBoldFonts = this.$textLayer.allowBoldFonts;
            this.setStyle("ace_nobold", !this.$allowBoldFonts);
        }

        this.layerConfig.characterWidth =
        this.characterWidth = this.$textLayer.getCharacterWidth();
        this.layerConfig.lineHeight =
        this.lineHeight = this.$textLayer.getLineHeight();
        this.$updatePrintMargin();
    };
    this.setSession = function(session) {
        if (this.session)
            this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode);
            
        this.session = session;
        if (session && this.scrollMargin.top && session.getScrollTop() <= 0)
            session.setScrollTop(-this.scrollMargin.top);

        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        if (!session)
            return;
        
        this.$loop.schedule(this.CHANGE_FULL);
        this.session.$setFontMetrics(this.$fontMetrics);
        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
        
        this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
        this.onChangeNewLineMode();
        this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode);
    };
    this.updateLines = function(firstRow, lastRow, force) {
        if (lastRow === undefined)
            lastRow = Infinity;

        if (!this.$changedLines) {
            this.$changedLines = {
                firstRow: firstRow,
                lastRow: lastRow
            };
        }
        else {
            if (this.$changedLines.firstRow > firstRow)
                this.$changedLines.firstRow = firstRow;

            if (this.$changedLines.lastRow < lastRow)
                this.$changedLines.lastRow = lastRow;
        }
        if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
            if (force)
                this.$changedLines.lastRow = this.layerConfig.lastRow;
            else
                return;
        }
        if (this.$changedLines.firstRow > this.layerConfig.lastRow)
            return;
        this.$loop.schedule(this.CHANGE_LINES);
    };

    this.onChangeNewLineMode = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
        this.$textLayer.$updateEolChar();
        this.session.$bidiHandler.setEolChar(this.$textLayer.EOL_CHAR);
    };
    
    this.onChangeTabSize = function() {
        this.$loop.schedule(this.CHANGE_TEXT | this.CHANGE_MARKER);
        this.$textLayer.onChangeTabSize();
    };
    this.updateText = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };
    this.updateFull = function(force) {
        if (force)
            this.$renderChanges(this.CHANGE_FULL, true);
        else
            this.$loop.schedule(this.CHANGE_FULL);
    };
    this.updateFontSize = function() {
        this.$textLayer.checkForSizeChanges();
    };

    this.$changes = 0;
    this.$updateSizeAsync = function() {
        if (this.$loop.pending)
            this.$size.$dirty = true;
        else
            this.onResize();
    };
    this.onResize = function(force, gutterWidth, width, height) {
        if (this.resizing > 2)
            return;
        else if (this.resizing > 0)
            this.resizing++;
        else
            this.resizing = force ? 1 : 0;
        var el = this.container;
        if (!height)
            height = el.clientHeight || el.scrollHeight;
        if (!width)
            width = el.clientWidth || el.scrollWidth;
        var changes = this.$updateCachedSize(force, gutterWidth, width, height);

        
        if (!this.$size.scrollerHeight || (!width && !height))
            return this.resizing = 0;

        if (force)
            this.$gutterLayer.$padding = null;

        if (force)
            this.$renderChanges(changes | this.$changes, true);
        else
            this.$loop.schedule(changes | this.$changes);

        if (this.resizing)
            this.resizing = 0;
        this.scrollBarV.scrollLeft = this.scrollBarV.scrollTop = null;
    };
    
    this.$updateCachedSize = function(force, gutterWidth, width, height) {
        height -= (this.$extraHeight || 0);
        var changes = 0;
        var size = this.$size;
        var oldSize = {
            width: size.width,
            height: size.height,
            scrollerHeight: size.scrollerHeight,
            scrollerWidth: size.scrollerWidth
        };
        if (height && (force || size.height != height)) {
            size.height = height;
            changes |= this.CHANGE_SIZE;

            size.scrollerHeight = size.height;
            if (this.$horizScroll)
                size.scrollerHeight -= this.scrollBarH.getHeight();
            this.scrollBarV.element.style.bottom = this.scrollBarH.getHeight() + "px";

            changes = changes | this.CHANGE_SCROLL;
        }

        if (width && (force || size.width != width)) {
            changes |= this.CHANGE_SIZE;
            size.width = width;
            
            if (gutterWidth == null)
                gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
            
            this.gutterWidth = gutterWidth;
            
            dom.setStyle(this.scrollBarH.element.style, "left", gutterWidth + "px");
            dom.setStyle(this.scroller.style, "left", gutterWidth + this.margin.left + "px");
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBarV.getWidth() - this.margin.h);
            dom.setStyle(this.$gutter.style, "left", this.margin.left + "px");
            
            var right = this.scrollBarV.getWidth() + "px";
            dom.setStyle(this.scrollBarH.element.style, "right", right);
            dom.setStyle(this.scroller.style, "right", right);
            dom.setStyle(this.scroller.style, "bottom", this.scrollBarH.getHeight());

            if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force) {
                changes |= this.CHANGE_FULL;
            }
        }
        
        size.$dirty = !width || !height;

        if (changes)
            this._signal("resize", oldSize);

        return changes;
    };

    this.onGutterResize = function(width) {
        var gutterWidth = this.$showGutter ? width : 0;
        if (gutterWidth != this.gutterWidth)
            this.$changes |= this.$updateCachedSize(true, gutterWidth, this.$size.width, this.$size.height);

        if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
            this.$loop.schedule(this.CHANGE_FULL);
        } else if (this.$size.$dirty) {
            this.$loop.schedule(this.CHANGE_FULL);
        } else {
            this.$computeLayerConfig();
        }
    };
    this.adjustWrapLimit = function() {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth);
        return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
    };
    this.setAnimatedScroll = function(shouldAnimate){
        this.setOption("animatedScroll", shouldAnimate);
    };
    this.getAnimatedScroll = function() {
        return this.$animatedScroll;
    };
    this.setShowInvisibles = function(showInvisibles) {
        this.setOption("showInvisibles", showInvisibles);
        this.session.$bidiHandler.setShowInvisibles(showInvisibles);
    };
    this.getShowInvisibles = function() {
        return this.getOption("showInvisibles");
    };
    this.getDisplayIndentGuides = function() {
        return this.getOption("displayIndentGuides");
    };

    this.setDisplayIndentGuides = function(display) {
        this.setOption("displayIndentGuides", display);
    };
    this.setShowPrintMargin = function(showPrintMargin) {
        this.setOption("showPrintMargin", showPrintMargin);
    };
    this.getShowPrintMargin = function() {
        return this.getOption("showPrintMargin");
    };
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.setOption("printMarginColumn", showPrintMargin);
    };
    this.getPrintMarginColumn = function() {
        return this.getOption("printMarginColumn");
    };
    this.getShowGutter = function(){
        return this.getOption("showGutter");
    };
    this.setShowGutter = function(show){
        return this.setOption("showGutter", show);
    };

    this.getFadeFoldWidgets = function(){
        return this.getOption("fadeFoldWidgets");
    };

    this.setFadeFoldWidgets = function(show) {
        this.setOption("fadeFoldWidgets", show);
    };

    this.setHighlightGutterLine = function(shouldHighlight) {
        this.setOption("highlightGutterLine", shouldHighlight);
    };

    this.getHighlightGutterLine = function() {
        return this.getOption("highlightGutterLine");
    };

    this.$updatePrintMargin = function() {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            var containerEl = dom.createElement("div");
            containerEl.className = "ace_layer ace_print-margin-layer";
            this.$printMarginEl = dom.createElement("div");
            this.$printMarginEl.className = "ace_print-margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.content.firstChild);
        }

        var style = this.$printMarginEl.style;
        style.left = Math.round(this.characterWidth * this.$printMarginColumn + this.$padding) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
        
        if (this.session && this.session.$wrap == -1)
            this.adjustWrapLimit();
    };
    this.getContainerElement = function() {
        return this.container;
    };
    this.getMouseEventTarget = function() {
        return this.scroller;
    };
    this.getTextAreaContainer = function() {
        return this.container;
    };
    this.$moveTextAreaToCursor = function() {
        var style = this.textarea.style;
        if (!this.$keepTextAreaAtCursor) {
            dom.translate(this.textarea, -100, 0);
            return;
        }
        var pixelPos = this.$cursorLayer.$pixelPos;
        if (!pixelPos)
            return;
        var composition = this.$composition;
        if (composition && composition.markerRange)
            pixelPos = this.$cursorLayer.getPixelPosition(composition.markerRange.start, true);
        
        var config = this.layerConfig;
        var posTop = pixelPos.top;
        var posLeft = pixelPos.left;
        posTop -= config.offset;

        var h = composition && composition.useTextareaForIME ? this.lineHeight : HIDE_TEXTAREA ? 0 : 1;
        if (posTop < 0 || posTop > config.height - h) {
            dom.translate(this.textarea, 0, 0);
            return;
        }

        var w = 1;
        if (!composition) {
            posTop += this.lineHeight;
        }
        else {
            if (composition.useTextareaForIME) {
                var val = this.textarea.value;
                w = this.characterWidth * (this.session.$getStringScreenWidth(val)[0]);
                h += 2;
            }
            else {
                posTop += this.lineHeight + 2;
            }
        }
        
        posLeft -= this.scrollLeft;
        if (posLeft > this.$size.scrollerWidth - w)
            posLeft = this.$size.scrollerWidth - w;

        posLeft += this.gutterWidth + this.margin.left;

        dom.setStyle(style, "height", h + "px");
        dom.setStyle(style, "width", w + "px");
        dom.translate(this.textarea, Math.min(posLeft, this.$size.scrollerWidth - w), Math.min(posTop, this.$size.height - h));
    };
    this.getFirstVisibleRow = function() {
        return this.layerConfig.firstRow;
    };
    this.getFirstFullyVisibleRow = function() {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    };
    this.getLastFullyVisibleRow = function() {
        var config = this.layerConfig;
        var lastRow = config.lastRow;
        var top = this.session.documentToScreenRow(lastRow, 0) * config.lineHeight;
        if (top - this.session.getScrollTop() > config.height - config.lineHeight)
            return lastRow - 1;
        return lastRow;
    };
    this.getLastVisibleRow = function() {
        return this.layerConfig.lastRow;
    };

    this.$padding = null;
    this.setPadding = function(padding) {
        this.$padding = padding;
        this.$textLayer.setPadding(padding);
        this.$cursorLayer.setPadding(padding);
        this.$markerFront.setPadding(padding);
        this.$markerBack.setPadding(padding);
        this.$loop.schedule(this.CHANGE_FULL);
        this.$updatePrintMargin();
    };
    
    this.setScrollMargin = function(top, bottom, left, right) {
        var sm = this.scrollMargin;
        sm.top = top|0;
        sm.bottom = bottom|0;
        sm.right = right|0;
        sm.left = left|0;
        sm.v = sm.top + sm.bottom;
        sm.h = sm.left + sm.right;
        if (sm.top && this.scrollTop <= 0 && this.session)
            this.session.setScrollTop(-sm.top);
        this.updateFull();
    };
    
    this.setMargin = function(top, bottom, left, right) {
        var sm = this.margin;
        sm.top = top|0;
        sm.bottom = bottom|0;
        sm.right = right|0;
        sm.left = left|0;
        sm.v = sm.top + sm.bottom;
        sm.h = sm.left + sm.right;
        this.$updateCachedSize(true, this.gutterWidth, this.$size.width, this.$size.height);
        this.updateFull();
    };
    this.getHScrollBarAlwaysVisible = function() {
        return this.$hScrollBarAlwaysVisible;
    };
    this.setHScrollBarAlwaysVisible = function(alwaysVisible) {
        this.setOption("hScrollBarAlwaysVisible", alwaysVisible);
    };
    this.getVScrollBarAlwaysVisible = function() {
        return this.$vScrollBarAlwaysVisible;
    };
    this.setVScrollBarAlwaysVisible = function(alwaysVisible) {
        this.setOption("vScrollBarAlwaysVisible", alwaysVisible);
    };

    this.$updateScrollBarV = function() {
        var scrollHeight = this.layerConfig.maxHeight;
        var scrollerHeight = this.$size.scrollerHeight;
        if (!this.$maxLines && this.$scrollPastEnd) {
            scrollHeight -= (scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
            if (this.scrollTop > scrollHeight - scrollerHeight) {
                scrollHeight = this.scrollTop + scrollerHeight;
                this.scrollBarV.scrollTop = null;
            }
        }
        this.scrollBarV.setScrollHeight(scrollHeight + this.scrollMargin.v);
        this.scrollBarV.setScrollTop(this.scrollTop + this.scrollMargin.top);
    };
    this.$updateScrollBarH = function() {
        this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h);
        this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
    };
    
    this.$frozen = false;
    this.freeze = function() {
        this.$frozen = true;
    };
    
    this.unfreeze = function() {
        this.$frozen = false;
    };

    this.$renderChanges = function(changes, force) {
        if (this.$changes) {
            changes |= this.$changes;
            this.$changes = 0;
        }
        if ((!this.session || !this.container.offsetWidth || this.$frozen) || (!changes && !force)) {
            this.$changes |= changes;
            return; 
        } 
        if (this.$size.$dirty) {
            this.$changes |= changes;
            return this.onResize(true);
        }
        if (!this.lineHeight) {
            this.$textLayer.checkForSizeChanges();
        }
        
        this._signal("beforeRender");
        
        if (this.session && this.session.$bidiHandler)
            this.session.$bidiHandler.updateCharacterWidths(this.$fontMetrics);

        var config = this.layerConfig;
        if (changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL ||
            changes & this.CHANGE_H_SCROLL
        ) {
            changes |= this.$computeLayerConfig() | this.$loop.clear();
            if (config.firstRow != this.layerConfig.firstRow && config.firstRowScreen == this.layerConfig.firstRowScreen) {
                var st = this.scrollTop + (config.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                if (st > 0) {
                    this.scrollTop = st;
                    changes = changes | this.CHANGE_SCROLL;
                    changes |= this.$computeLayerConfig() | this.$loop.clear();
                }
            }
            config = this.layerConfig;
            this.$updateScrollBarV();
            if (changes & this.CHANGE_H_SCROLL)
                this.$updateScrollBarH();
            
            dom.translate(this.content, -this.scrollLeft, -config.offset);
            
            var width = config.width + 2 * this.$padding + "px";
            var height = config.minHeight + "px";
            
            dom.setStyle(this.content.style, "width", width);
            dom.setStyle(this.content.style, "height", height);
        }
        if (changes & this.CHANGE_H_SCROLL) {
            dom.translate(this.content, -this.scrollLeft, -config.offset);
            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
        }
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            this._signal("afterRender");
            return;
        }
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(config);
            else
                this.$textLayer.scrollLines(config);

            if (this.$showGutter) {
                if (changes & this.CHANGE_GUTTER || changes & this.CHANGE_LINES)
                    this.$gutterLayer.update(config);
                else
                    this.$gutterLayer.scrollLines(config);
            }
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            this._signal("afterRender");
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
        }
        else if (changes & this.CHANGE_LINES) {
            if (this.$updateLines() || (changes & this.CHANGE_GUTTER) && this.$showGutter)
                this.$gutterLayer.update(config);
        }
        else if (changes & this.CHANGE_TEXT || changes & this.CHANGE_GUTTER) {
            if (this.$showGutter)
                this.$gutterLayer.update(config);
        }
        else if (changes & this.CHANGE_CURSOR) {
            if (this.$highlightGutterLine)
                this.$gutterLayer.updateLineHighlight(config);
        }

        if (changes & this.CHANGE_CURSOR) {
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(config);
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update(config);
        }

        this._signal("afterRender");
    };

    
    this.$autosize = function() {
        var height = this.session.getScreenLength() * this.lineHeight;
        var maxHeight = this.$maxLines * this.lineHeight;
        var desiredHeight = Math.min(maxHeight, 
            Math.max((this.$minLines || 1) * this.lineHeight, height)
        ) + this.scrollMargin.v + (this.$extraHeight || 0);
        if (this.$horizScroll)
            desiredHeight += this.scrollBarH.getHeight();
        if (this.$maxPixelHeight && desiredHeight > this.$maxPixelHeight)
            desiredHeight = this.$maxPixelHeight;
        
        var hideScrollbars = desiredHeight <= 2 * this.lineHeight;
        var vScroll = !hideScrollbars && height > maxHeight;
        
        if (desiredHeight != this.desiredHeight ||
            this.$size.height != this.desiredHeight || vScroll != this.$vScroll) {
            if (vScroll != this.$vScroll) {
                this.$vScroll = vScroll;
                this.scrollBarV.setVisible(vScroll);
            }
            
            var w = this.container.clientWidth;
            this.container.style.height = desiredHeight + "px";
            this.$updateCachedSize(true, this.$gutterWidth, w, desiredHeight);
            this.desiredHeight = desiredHeight;
            
            this._signal("autosize");
        }
    };
    
    this.$computeLayerConfig = function() {
        var session = this.session;
        var size = this.$size;
        
        var hideScrollbars = size.height <= 2 * this.lineHeight;
        var screenLines = this.session.getScreenLength();
        var maxHeight = screenLines * this.lineHeight;

        var longestLine = this.$getLongestLine();
        
        var horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible ||
            size.scrollerWidth - longestLine - 2 * this.$padding < 0);

        var hScrollChanged = this.$horizScroll !== horizScroll;
        if (hScrollChanged) {
            this.$horizScroll = horizScroll;
            this.scrollBarH.setVisible(horizScroll);
        }
        var vScrollBefore = this.$vScroll; // autosize can change vscroll value in which case we need to update longestLine
        if (this.$maxLines && this.lineHeight > 1)
            this.$autosize();

        var minHeight = size.scrollerHeight + this.lineHeight;
        
        var scrollPastEnd = !this.$maxLines && this.$scrollPastEnd
            ? (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd
            : 0;
        maxHeight += scrollPastEnd;
        
        var sm = this.scrollMargin;
        this.session.setScrollTop(Math.max(-sm.top,
            Math.min(this.scrollTop, maxHeight - size.scrollerHeight + sm.bottom)));

        this.session.setScrollLeft(Math.max(-sm.left, Math.min(this.scrollLeft, 
            longestLine + 2 * this.$padding - size.scrollerWidth + sm.right)));
        
        var vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible ||
            size.scrollerHeight - maxHeight + scrollPastEnd < 0 || this.scrollTop > sm.top);
        var vScrollChanged = vScrollBefore !== vScroll;
        if (vScrollChanged) {
            this.$vScroll = vScroll;
            this.scrollBarV.setVisible(vScroll);
        }

        var offset = this.scrollTop % this.lineHeight;
        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;
        var firstRowScreen, firstRowHeight;
        var lineHeight = this.lineHeight;
        firstRow = session.screenToDocumentRow(firstRow, 0);
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowLength(firstRow) * lineHeight;

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight +
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * lineHeight;

        var changes = 0;
        if (this.layerConfig.width != longestLine || hScrollChanged) 
            changes = this.CHANGE_H_SCROLL;
        if (hScrollChanged || vScrollChanged) {
            changes = this.$updateCachedSize(true, this.gutterWidth, size.width, size.height);
            this._signal("scrollbarVisibilityChanged");
            if (vScrollChanged)
                longestLine = this.$getLongestLine();
        }
        
        this.layerConfig = {
            width : longestLine,
            padding : this.$padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            maxHeight : maxHeight,
            offset : offset,
            gutterOffset : lineHeight ? Math.max(0, Math.ceil((offset + size.height - size.scrollerHeight) / lineHeight)) : 0,
            height : this.$size.scrollerHeight
        };

        if (this.session.$bidiHandler)
            this.session.$bidiHandler.setContentWidth(longestLine - this.$padding);

        return changes;
    };

    this.$updateLines = function() {
        if (!this.$changedLines) return;
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }
        if (lastRow === Infinity) {
            if (this.$showGutter)
                this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
        return true;
    };

    this.$getLongestLine = function() {
        var charCount = this.session.getScreenWidth();
        if (this.showInvisibles && !this.session.$useWrapMode)
            charCount += 1;
            
        if (this.$textLayer && charCount > this.$textLayer.MAX_LINE_LENGTH)
            charCount = this.$textLayer.MAX_LINE_LENGTH + 30;

        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    };
    this.updateFrontMarkers = function() {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    };
    this.updateBackMarkers = function() {
        this.$markerBack.setMarkers(this.session.getMarkers());
        this.$loop.schedule(this.CHANGE_MARKER_BACK);
    };
    this.addGutterDecoration = function(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
    };
    this.removeGutterDecoration = function(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
    };
    this.updateBreakpoints = function(rows) {
        this.$loop.schedule(this.CHANGE_GUTTER);
    };
    this.setAnnotations = function(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };
    this.updateCursor = function() {
        this.$loop.schedule(this.CHANGE_CURSOR);
    };
    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };
    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollSelectionIntoView = function(anchor, lead, offset) {
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    };
    this.scrollCursorIntoView = function(cursor, offset, $viewMargin) {
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.$cursorLayer.getPixelPosition(cursor);

        var left = pos.left;
        var top = pos.top;
        
        var topMargin = $viewMargin && $viewMargin.top || 0;
        var bottomMargin = $viewMargin && $viewMargin.bottom || 0;
        
        var scrollTop = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;
        
        if (scrollTop + topMargin > top) {
            if (offset && scrollTop + topMargin > top + this.lineHeight)
                top -= offset * this.$size.scrollerHeight;
            if (top === 0)
                top = -this.scrollMargin.top;
            this.session.setScrollTop(top);
        } else if (scrollTop + this.$size.scrollerHeight - bottomMargin < top + this.lineHeight) {
            if (offset && scrollTop + this.$size.scrollerHeight - bottomMargin < top -  this.lineHeight)
                top += offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top + this.lineHeight + bottomMargin - this.$size.scrollerHeight);
        }

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            if (left < this.$padding + 2 * this.layerConfig.characterWidth)
                left = -this.scrollMargin.left;
            this.session.setScrollLeft(left);
        } else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
            this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        } else if (scrollLeft <= this.$padding && left - scrollLeft < this.characterWidth) {
            this.session.setScrollLeft(0);
        }
    };
    this.getScrollTop = function() {
        return this.session.getScrollTop();
    };
    this.getScrollLeft = function() {
        return this.session.getScrollLeft();
    };
    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };
    this.getScrollBottomRow = function() {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    };
    this.scrollToRow = function(row) {
        this.session.setScrollTop(row * this.lineHeight);
    };

    this.alignCursor = function(cursor, alignment) {
        if (typeof cursor == "number")
            cursor = {row: cursor, column: 0};

        var pos = this.$cursorLayer.getPixelPosition(cursor);
        var h = this.$size.scrollerHeight - this.lineHeight;
        var offset = pos.top - h * (alignment || 0);

        this.session.setScrollTop(offset);
        return offset;
    };

    this.STEPS = 8;
    this.$calcSteps = function(fromValue, toValue){
        var i = 0;
        var l = this.STEPS;
        var steps = [];

        var func  = function(t, x_min, dx) {
            return dx * (Math.pow(t - 1, 3) + 1) + x_min;
        };

        for (i = 0; i < l; ++i)
            steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));

        return steps;
    };
    this.scrollToLine = function(line, center, animate, callback) {
        var pos = this.$cursorLayer.getPixelPosition({row: line, column: 0});
        var offset = pos.top;
        if (center)
            offset -= this.$size.scrollerHeight / 2;

        var initialScroll = this.scrollTop;
        this.session.setScrollTop(offset);
        if (animate !== false)
            this.animateScrolling(initialScroll, callback);
    };

    this.animateScrolling = function(fromValue, callback) {
        var toValue = this.scrollTop;
        if (!this.$animatedScroll)
            return;
        var _self = this;
        
        if (fromValue == toValue)
            return;
        
        if (this.$scrollAnimation) {
            var oldSteps = this.$scrollAnimation.steps;
            if (oldSteps.length) {
                fromValue = oldSteps[0];
                if (fromValue == toValue)
                    return;
            }
        }
        
        var steps = _self.$calcSteps(fromValue, toValue);
        this.$scrollAnimation = {from: fromValue, to: toValue, steps: steps};

        clearInterval(this.$timer);

        _self.session.setScrollTop(steps.shift());
        _self.session.$scrollTop = toValue;
        this.$timer = setInterval(function() {
            if (steps.length) {
                _self.session.setScrollTop(steps.shift());
                _self.session.$scrollTop = toValue;
            } else if (toValue != null) {
                _self.session.$scrollTop = -1;
                _self.session.setScrollTop(toValue);
                toValue = null;
            } else {
                _self.$timer = clearInterval(_self.$timer);
                _self.$scrollAnimation = null;
                callback && callback();
            }
        }, 10);
    };
    this.scrollToY = function(scrollTop) {
        if (this.scrollTop !== scrollTop) {
            this.$loop.schedule(this.CHANGE_SCROLL);
            this.scrollTop = scrollTop;
        }
    };
    this.scrollToX = function(scrollLeft) {
        if (this.scrollLeft !== scrollLeft)
            this.scrollLeft = scrollLeft;
        this.$loop.schedule(this.CHANGE_H_SCROLL);
    };
    this.scrollTo = function(x, y) {
        this.session.setScrollTop(y);
        this.session.setScrollLeft(y);
    };
    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.session.setScrollTop(this.session.getScrollTop() + deltaY);
        deltaX && this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
    };
    this.isScrollableBy = function(deltaX, deltaY) {
        if (deltaY < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top)
           return true;
        if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight
            - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom)
           return true;
        if (deltaX < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left)
            return true;
        if (deltaX > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth
            - this.layerConfig.width < -1 + this.scrollMargin.right)
           return true;
    };

    this.pixelToScreenCoordinates = function(x, y) {
        var canvasPos;
        if (this.$hasCssTransforms) {
            canvasPos = {top:0, left: 0};
            var p = this.$fontMetrics.transformCoordinates([x, y]);
            x = p[1] - this.gutterWidth - this.margin.left;
            y = p[0];
        } else {
            canvasPos = this.scroller.getBoundingClientRect();
        }
        
        var offsetX = x + this.scrollLeft - canvasPos.left - this.$padding;
        var offset = offsetX / this.characterWidth;
        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        var col = this.$blockCursor ? Math.floor(offset) : Math.round(offset);

        return {row: row, column: col, side: offset - col > 0 ? 1 : -1, offsetX:  offsetX};
    };

    this.screenToTextCoordinates = function(x, y) {
        var canvasPos;
        if (this.$hasCssTransforms) {
            canvasPos = {top:0, left: 0};
            var p = this.$fontMetrics.transformCoordinates([x, y]);
            x = p[1] - this.gutterWidth - this.margin.left;
            y = p[0];
        } else {
            canvasPos = this.scroller.getBoundingClientRect();
        }

        var offsetX = x + this.scrollLeft - canvasPos.left - this.$padding;
        var offset = offsetX / this.characterWidth;
        var col = this.$blockCursor ? Math.floor(offset) : Math.round(offset);

        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);

        return this.session.screenToDocumentPosition(row, Math.max(col, 0), offsetX);
    };
    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + (this.session.$bidiHandler.isBidiRow(pos.row, row)
             ? this.session.$bidiHandler.getPosLeft(pos.column)
             : Math.round(pos.column * this.characterWidth));
        
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    };
    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };
    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };
    this.showComposition = function(composition) {
        this.$composition = composition;
        if (!composition.cssText) {
            composition.cssText = this.textarea.style.cssText;
            composition.keepTextAreaAtCursor = this.$keepTextAreaAtCursor;
        }
        composition.useTextareaForIME = this.$useTextareaForIME;
        
        if (this.$useTextareaForIME) {
            this.$keepTextAreaAtCursor = true;
            dom.addCssClass(this.textarea, "ace_composition");
            this.textarea.style.cssText = "";
            this.$moveTextAreaToCursor();
            this.$cursorLayer.element.style.display = "none";
        }
        else {            
            composition.markerId = this.session.addMarker(composition.markerRange, "ace_composition_marker", "text");
        }
    };
    this.setCompositionText = function(text) {
        var cursor = this.session.selection.cursor;
        this.addToken(text, "composition_placeholder", cursor.row, cursor.column);
        this.$moveTextAreaToCursor();
    };
    this.hideComposition = function() {
        if (!this.$composition)
            return;
        
        if (this.$composition.markerId)
            this.session.removeMarker(this.$composition.markerId);

        dom.removeCssClass(this.textarea, "ace_composition");
        this.$keepTextAreaAtCursor = this.$composition.keepTextAreaAtCursor;
        this.textarea.style.cssText = this.$composition.cssText;
        this.$composition = null;
        this.$cursorLayer.element.style.display = "";
    };
    
    this.addToken = function(text, type, row, column) {
        var session = this.session;
        session.bgTokenizer.lines[row] = null;
        var newToken = {type: type, value: text};
        var tokens = session.getTokens(row);
        if (column == null) {
            tokens.push(newToken);
        } else {
            var l = 0;
            for (var i =0; i < tokens.length; i++) {
                var token = tokens[i];
                l += token.value.length;
                if (column <= l) {
                    var diff = token.value.length - (l - column);
                    var before = token.value.slice(0, diff);
                    var after = token.value.slice(diff);
    
                    tokens.splice(i, 1, {type: token.type, value: before},  newToken,  {type: token.type, value: after});
                    break;
                }
            }
        }
        this.updateLines(row, row);
    };
    this.setTheme = function(theme, cb) {
        var _self = this;
        this.$themeId = theme;
        _self._dispatchEvent('themeChange',{theme:theme});

        if (!theme || typeof theme == "string") {
            var moduleName = theme || this.$options.theme.initialValue;
            config.loadModule(["theme", moduleName], afterLoad);
        } else {
            afterLoad(theme);
        }

        function afterLoad(module) {
            if (_self.$themeId != theme)
                return cb && cb();
            if (!module || !module.cssClass)
                throw new Error("couldn't load module " + theme + " or it didn't call define");
            if (module.$id)
                _self.$themeId = module.$id;
            dom.importCssString(
                module.cssText,
                module.cssClass,
                _self.container
            );

            if (_self.theme)
                dom.removeCssClass(_self.container, _self.theme.cssClass);

            var padding = "padding" in module ? module.padding 
                : "padding" in (_self.theme || {}) ? 4 : _self.$padding;
            if (_self.$padding && padding != _self.$padding)
                _self.setPadding(padding);
            _self.$theme = module.cssClass;

            _self.theme = module;
            dom.addCssClass(_self.container, module.cssClass);
            dom.setCssClass(_self.container, "ace_dark", module.isDark);
            if (_self.$size) {
                _self.$size.width = 0;
                _self.$updateSizeAsync();
            }

            _self._dispatchEvent('themeLoaded', {theme:module});
            cb && cb();
        }
    };
    this.getTheme = function() {
        return this.$themeId;
    };
    this.setStyle = function(style, include) {
        dom.setCssClass(this.container, style, include !== false);
    };
    this.unsetStyle = function(style) {
        dom.removeCssClass(this.container, style);
    };
    
    this.setCursorStyle = function(style) {
        dom.setStyle(this.scroller.style, "cursor", style);
    };
    this.setMouseCursor = function(cursorStyle) {
        dom.setStyle(this.scroller.style, "cursor", cursorStyle);
    };
    
    this.attachToShadowRoot = function() {
        dom.importCssString(editorCss, "ace_editor.css", this.container);
    };
    this.destroy = function() {
        this.$fontMetrics.destroy();
        this.$cursorLayer.destroy();
    };

}).call(VirtualRenderer.prototype);


config.defineOptions(VirtualRenderer.prototype, "renderer", {
    animatedScroll: {initialValue: false},
    showInvisibles: {
        set: function(value) {
            if (this.$textLayer.setShowInvisibles(value))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: false
    },
    showPrintMargin: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: true
    },
    printMarginColumn: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: 80
    },
    printMargin: {
        set: function(val) {
            if (typeof val == "number")
                this.$printMarginColumn = val;
            this.$showPrintMargin = !!val;
            this.$updatePrintMargin();
        },
        get: function() {
            return this.$showPrintMargin && this.$printMarginColumn; 
        }
    },
    showGutter: {
        set: function(show){
            this.$gutter.style.display = show ? "block" : "none";
            this.$loop.schedule(this.CHANGE_FULL);
            this.onGutterResize();
        },
        initialValue: true
    },
    fadeFoldWidgets: {
        set: function(show) {
            dom.setCssClass(this.$gutter, "ace_fade-fold-widgets", show);
        },
        initialValue: false
    },
    showFoldWidgets: {
        set: function(show) {
            this.$gutterLayer.setShowFoldWidgets(show);
            this.$loop.schedule(this.CHANGE_GUTTER);
        },
        initialValue: true
    },
    displayIndentGuides: {
        set: function(show) {
            if (this.$textLayer.setDisplayIndentGuides(show))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: true
    },
    highlightGutterLine: {
        set: function(shouldHighlight) {
            this.$gutterLayer.setHighlightGutterLine(shouldHighlight);
            this.$loop.schedule(this.CHANGE_GUTTER);
        },
        initialValue: true
    },
    hScrollBarAlwaysVisible: {
        set: function(val) {
            if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    vScrollBarAlwaysVisible: {
        set: function(val) {
            if (!this.$vScrollBarAlwaysVisible || !this.$vScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    fontSize: {
        set: function(size) {
            if (typeof size == "number")
                size = size + "px";
            this.container.style.fontSize = size;
            this.updateFontSize();
        },
        initialValue: 12
    },
    fontFamily: {
        set: function(name) {
            this.container.style.fontFamily = name;
            this.updateFontSize();
        }
    },
    maxLines: {
        set: function(val) {
            this.updateFull();
        }
    },
    minLines: {
        set: function(val) {
            if (!(this.$minLines < 0x1ffffffffffff))
                this.$minLines = 0;
            this.updateFull();
        }
    },
    maxPixelHeight: {
        set: function(val) {
            this.updateFull();
        },
        initialValue: 0
    },
    scrollPastEnd: {
        set: function(val) {
            val = +val || 0;
            if (this.$scrollPastEnd == val)
                return;
            this.$scrollPastEnd = val;
            this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: 0,
        handlesSet: true
    },
    fixedWidthGutter: {
        set: function(val) {
            this.$gutterLayer.$fixedWidth = !!val;
            this.$loop.schedule(this.CHANGE_GUTTER);
        }
    },
    theme: {
        set: function(val) { this.setTheme(val); },
        get: function() { return this.$themeId || this.theme; },
        initialValue: "./theme/textmate",
        handlesSet: true
    },
    hasCssTransforms: {
    },
    useTextareaForIME: {
        initialValue: !useragent.isMobile && !useragent.isIE
    }
});

exports.VirtualRenderer = VirtualRenderer;
});

ace.define("ace/worker/worker_client",["require","exports","module","ace/lib/oop","ace/lib/net","ace/lib/event_emitter","ace/config"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var net = require("../lib/net");
var EventEmitter = require("../lib/event_emitter").EventEmitter;
var config = require("../config");

function $workerBlob(workerUrl) {
    var script = "importScripts('" + net.qualifyURL(workerUrl) + "');";
    try {
        return new Blob([script], {"type": "application/javascript"});
    } catch (e) { // Backwards-compatibility
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        var blobBuilder = new BlobBuilder();
        blobBuilder.append(script);
        return blobBuilder.getBlob("application/javascript");
    }
}

function createWorker(workerUrl) {
    if (typeof Worker == "undefined")
        return { postMessage: function() {}, terminate: function() {} };
    if (config.get("loadWorkerFromBlob")) {
        var blob = $workerBlob(workerUrl);
        var URL = window.URL || window.webkitURL;
        var blobURL = URL.createObjectURL(blob);
        return new Worker(blobURL);
    }
    return new Worker(workerUrl);
}

var WorkerClient = function(worker) {
    if (!worker.postMessage)
        worker = this.$createWorkerFromOldConfig.apply(this, arguments);

    this.$worker = worker;
    this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
    this.changeListener = this.changeListener.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.callbackId = 1;
    this.callbacks = {};

    this.$worker.onmessage = this.onMessage;
};

(function(){

    oop.implement(this, EventEmitter);

    this.$createWorkerFromOldConfig = function(topLevelNamespaces, mod, classname, workerUrl, importScripts) {
        if (require.nameToUrl && !require.toUrl)
            require.toUrl = require.nameToUrl;

        if (config.get("packaged") || !require.toUrl) {
            workerUrl = workerUrl || config.moduleUrl(mod, "worker");
        } else {
            var normalizePath = this.$normalizePath;
            workerUrl = workerUrl || normalizePath(require.toUrl("ace/worker/worker.js", null, "_"));

            var tlns = {};
            topLevelNamespaces.forEach(function(ns) {
                tlns[ns] = normalizePath(require.toUrl(ns, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
            });
        }

        this.$worker = createWorker(workerUrl);
        if (importScripts) {
            this.send("importScripts", importScripts);
        }
        this.$worker.postMessage({
            init : true,
            tlns : tlns,
            module : mod,
            classname : classname
        });
        return this.$worker;
    };

    this.onMessage = function(e) {
        var msg = e.data;
        switch (msg.type) {
            case "event":
                this._signal(msg.name, {data: msg.data});
                break;
            case "call":
                var callback = this.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete this.callbacks[msg.id];
                }
                break;
            case "error":
                this.reportError(msg.data);
                break;
            case "log":
                window.console && console.log && console.log.apply(console, msg.data);
                break;
        }
    };
    
    this.reportError = function(err) {
        window.console && console.error && console.error(err);
    };

    this.$normalizePath = function(path) {
        return net.qualifyURL(path);
    };

    this.terminate = function() {
        this._signal("terminate", {});
        this.deltaQueue = null;
        this.$worker.terminate();
        this.$worker = null;
        if (this.$doc)
            this.$doc.off("change", this.changeListener);
        this.$doc = null;
    };

    this.send = function(cmd, args) {
        this.$worker.postMessage({command: cmd, args: args});
    };

    this.call = function(cmd, args, callback) {
        if (callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            args.push(id);
        }
        this.send(cmd, args);
    };

    this.emit = function(event, data) {
        try {
            if (data.data && data.data.err)
                data.data.err = {message: data.data.err.message, stack: data.data.err.stack, code: data.data.err.code};
            this.$worker.postMessage({event: event, data: {data: data.data}});
        }
        catch(ex) {
            console.error(ex.stack);
        }
    };

    this.attachToDocument = function(doc) {
        if (this.$doc)
            this.terminate();

        this.$doc = doc;
        this.call("setValue", [doc.getValue()]);
        doc.on("change", this.changeListener);
    };

    this.changeListener = function(delta) {
        if (!this.deltaQueue) {
            this.deltaQueue = [];
            setTimeout(this.$sendDeltaQueue, 0);
        }
        if (delta.action == "insert")
            this.deltaQueue.push(delta.start, delta.lines);
        else
            this.deltaQueue.push(delta.start, delta.end);
    };

    this.$sendDeltaQueue = function() {
        var q = this.deltaQueue;
        if (!q) return;
        this.deltaQueue = null;
        if (q.length > 50 && q.length > this.$doc.getLength() >> 1) {
            this.call("setValue", [this.$doc.getValue()]);
        } else
            this.emit("change", {data: q});
    };

}).call(WorkerClient.prototype);


var UIWorkerClient = function(topLevelNamespaces, mod, classname) {
    var main = null;
    var emitSync = false;
    var sender = Object.create(EventEmitter);

    var messageBuffer = [];
    var workerClient = new WorkerClient({
        messageBuffer: messageBuffer,
        terminate: function() {},
        postMessage: function(e) {
            messageBuffer.push(e);
            if (!main) return;
            if (emitSync)
                setTimeout(processNext);
            else
                processNext();
        }
    });

    workerClient.setEmitSync = function(val) { emitSync = val; };

    var processNext = function() {
        var msg = messageBuffer.shift();
        if (msg.command)
            main[msg.command].apply(main, msg.args);
        else if (msg.event)
            sender._signal(msg.event, msg.data);
    };

    sender.postMessage = function(msg) {
        workerClient.onMessage({data: msg});
    };
    sender.callback = function(data, callbackId) {
        this.postMessage({type: "call", id: callbackId, data: data});
    };
    sender.emit = function(name, data) {
        this.postMessage({type: "event", name: name, data: data});
    };

    config.loadModule(["worker", mod], function(Main) {
        main = new Main[classname](sender);
        while (messageBuffer.length)
            processNext();
    });

    return workerClient;
};

exports.UIWorkerClient = UIWorkerClient;
exports.WorkerClient = WorkerClient;
exports.createWorker = createWorker;


});

ace.define("ace/placeholder",["require","exports","module","ace/range","ace/lib/event_emitter","ace/lib/oop"], function(require, exports, module) {
"use strict";

var Range = require("./range").Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var oop = require("./lib/oop");

var PlaceHolder = function(session, length, pos, others, mainClass, othersClass) {
    var _self = this;
    this.length = length;
    this.session = session;
    this.doc = session.getDocument();
    this.mainClass = mainClass;
    this.othersClass = othersClass;
    this.$onUpdate = this.onUpdate.bind(this);
    this.doc.on("change", this.$onUpdate);
    this.$others = others;
    
    this.$onCursorChange = function() {
        setTimeout(function() {
            _self.onCursorChange();
        });
    };
    
    this.$pos = pos;
    var undoStack = session.getUndoManager().$undoStack || session.getUndoManager().$undostack || {length: -1};
    this.$undoStackDepth = undoStack.length;
    this.setup();

    session.selection.on("changeCursor", this.$onCursorChange);
};

(function() {

    oop.implement(this, EventEmitter);
    this.setup = function() {
        var _self = this;
        var doc = this.doc;
        var session = this.session;
        
        this.selectionBefore = session.selection.toJSON();
        if (session.selection.inMultiSelectMode)
            session.selection.toSingleRange();

        this.pos = doc.createAnchor(this.$pos.row, this.$pos.column);
        var pos = this.pos;
        pos.$insertRight = true;
        pos.detach();
        pos.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column + this.length), this.mainClass, null, false);
        this.others = [];
        this.$others.forEach(function(other) {
            var anchor = doc.createAnchor(other.row, other.column);
            anchor.$insertRight = true;
            anchor.detach();
            _self.others.push(anchor);
        });
        session.setUndoSelect(false);
    };
    this.showOtherMarkers = function() {
        if (this.othersActive) return;
        var session = this.session;
        var _self = this;
        this.othersActive = true;
        this.others.forEach(function(anchor) {
            anchor.markerId = session.addMarker(new Range(anchor.row, anchor.column, anchor.row, anchor.column+_self.length), _self.othersClass, null, false);
        });
    };
    this.hideOtherMarkers = function() {
        if (!this.othersActive) return;
        this.othersActive = false;
        for (var i = 0; i < this.others.length; i++) {
            this.session.removeMarker(this.others[i].markerId);
        }
    };
    this.onUpdate = function(delta) {
        if (this.$updating)
            return this.updateAnchors(delta);
            
        var range = delta;
        if (range.start.row !== range.end.row) return;
        if (range.start.row !== this.pos.row) return;
        this.$updating = true;
        var lengthDiff = delta.action === "insert" ? range.end.column - range.start.column : range.start.column - range.end.column;
        var inMainRange = range.start.column >= this.pos.column && range.start.column <= this.pos.column + this.length + 1;
        var distanceFromStart = range.start.column - this.pos.column;
        
        this.updateAnchors(delta);
        
        if (inMainRange)
            this.length += lengthDiff;

        if (inMainRange && !this.session.$fromUndo) {
            if (delta.action === 'insert') {
                for (var i = this.others.length - 1; i >= 0; i--) {
                    var otherPos = this.others[i];
                    var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                    this.doc.insertMergedLines(newPos, delta.lines);
                }
            } else if (delta.action === 'remove') {
                for (var i = this.others.length - 1; i >= 0; i--) {
                    var otherPos = this.others[i];
                    var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                    this.doc.remove(new Range(newPos.row, newPos.column, newPos.row, newPos.column - lengthDiff));
                }
            }
        }
        
        this.$updating = false;
        this.updateMarkers();
    };
    
    this.updateAnchors = function(delta) {
        this.pos.onChange(delta);
        for (var i = this.others.length; i--;)
            this.others[i].onChange(delta);
        this.updateMarkers();
    };
    
    this.updateMarkers = function() {
        if (this.$updating)
            return;
        var _self = this;
        var session = this.session;
        var updateMarker = function(pos, className) {
            session.removeMarker(pos.markerId);
            pos.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column+_self.length), className, null, false);
        };
        updateMarker(this.pos, this.mainClass);
        for (var i = this.others.length; i--;)
            updateMarker(this.others[i], this.othersClass);
    };

    this.onCursorChange = function(event) {
        if (this.$updating || !this.session) return;
        var pos = this.session.selection.getCursor();
        if (pos.row === this.pos.row && pos.column >= this.pos.column && pos.column <= this.pos.column + this.length) {
            this.showOtherMarkers();
            this._emit("cursorEnter", event);
        } else {
            this.hideOtherMarkers();
            this._emit("cursorLeave", event);
        }
    };    
    this.detach = function() {
        this.session.removeMarker(this.pos && this.pos.markerId);
        this.hideOtherMarkers();
        this.doc.removeEventListener("change", this.$onUpdate);
        this.session.selection.removeEventListener("changeCursor", this.$onCursorChange);
        this.session.setUndoSelect(true);
        this.session = null;
    };
    this.cancel = function() {
        if (this.$undoStackDepth === -1)
            return;
        var undoManager = this.session.getUndoManager();
        var undosRequired = (undoManager.$undoStack || undoManager.$undostack).length - this.$undoStackDepth;
        for (var i = 0; i < undosRequired; i++) {
            undoManager.undo(this.session, true);
        }
        if (this.selectionBefore)
            this.session.selection.fromJSON(this.selectionBefore);
    };
}).call(PlaceHolder.prototype);


exports.PlaceHolder = PlaceHolder;
});

ace.define("ace/mouse/multi_select_handler",["require","exports","module","ace/lib/event","ace/lib/useragent"], function(require, exports, module) {

var event = require("../lib/event");
var useragent = require("../lib/useragent");
function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column;
}

function onMouseDown(e) {
    var ev = e.domEvent;
    var alt = ev.altKey;
    var shift = ev.shiftKey;
    var ctrl = ev.ctrlKey;
    var accel = e.getAccelKey();
    var button = e.getButton();
    
    if (ctrl && useragent.isMac)
        button = ev.button;

    if (e.editor.inMultiSelectMode && button == 2) {
        e.editor.textInput.onContextMenu(e.domEvent);
        return;
    }
    
    if (!ctrl && !alt && !accel) {
        if (button === 0 && e.editor.inMultiSelectMode)
            e.editor.exitMultiSelectMode();
        return;
    }
    
    if (button !== 0)
        return;

    var editor = e.editor;
    var selection = editor.selection;
    var isMultiSelect = editor.inMultiSelectMode;
    var pos = e.getDocumentPosition();
    var cursor = selection.getCursor();
    var inSelection = e.inSelection() || (selection.isEmpty() && isSamePoint(pos, cursor));

    var mouseX = e.x, mouseY = e.y;
    var onMouseSelection = function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    
    var session = editor.session;
    var screenAnchor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
    var screenCursor = screenAnchor;
    
    var selectionMode;
    if (editor.$mouseHandler.$enableJumpToDef) {
        if (ctrl && alt || accel && alt)
            selectionMode = shift ? "block" : "add";
        else if (alt && editor.$blockSelectEnabled)
            selectionMode = "block";
    } else {
        if (accel && !alt) {
            selectionMode = "add";
            if (!isMultiSelect && shift)
                return;
        } else if (alt && editor.$blockSelectEnabled) {
            selectionMode = "block";
        }
    }
    
    if (selectionMode && useragent.isMac && ev.ctrlKey) {
        editor.$mouseHandler.cancelContextMenu();
    }

    if (selectionMode == "add") {
        if (!isMultiSelect && inSelection)
            return; // dragging

        if (!isMultiSelect) {
            var range = selection.toOrientedRange();
            editor.addSelectionMarker(range);
        }

        var oldRange = selection.rangeList.rangeAtPoint(pos);
        
        editor.inVirtualSelectionMode = true;
        
        if (shift) {
            oldRange = null;
            range = selection.ranges[0] || range;
            editor.removeSelectionMarker(range);
        }
        editor.once("mouseup", function() {
            var tmpSel = selection.toOrientedRange();

            if (oldRange && tmpSel.isEmpty() && isSamePoint(oldRange.cursor, tmpSel.cursor))
                selection.substractPoint(tmpSel.cursor);
            else {
                if (shift) {
                    selection.substractPoint(range.cursor);
                } else if (range) {
                    editor.removeSelectionMarker(range);
                    selection.addRange(range);
                }
                selection.addRange(tmpSel);
            }
            editor.inVirtualSelectionMode = false;
        });

    } else if (selectionMode == "block") {
        e.stop();
        editor.inVirtualSelectionMode = true;        
        var initialRange;
        var rectSel = [];
        var blockSelect = function() {
            var newCursor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
            var cursor = session.screenToDocumentPosition(newCursor.row, newCursor.column, newCursor.offsetX);

            if (isSamePoint(screenCursor, newCursor) && isSamePoint(cursor, selection.lead))
                return;
            screenCursor = newCursor;
            
            editor.selection.moveToPosition(cursor);
            editor.renderer.scrollCursorIntoView();

            editor.removeSelectionMarkers(rectSel);
            rectSel = selection.rectangularRangeBlock(screenCursor, screenAnchor);
            if (editor.$mouseHandler.$clickSelection && rectSel.length == 1 && rectSel[0].isEmpty())
                rectSel[0] = editor.$mouseHandler.$clickSelection.clone();
            rectSel.forEach(editor.addSelectionMarker, editor);
            editor.updateSelectionMarkers();
        };
        if (isMultiSelect && !accel) {
            selection.toSingleRange();
        } else if (!isMultiSelect && accel) {
            initialRange = selection.toOrientedRange();
            editor.addSelectionMarker(initialRange);
        }
        
        if (shift)
            screenAnchor = session.documentToScreenPosition(selection.lead);            
        else
            selection.moveToPosition(pos);
        
        screenCursor = {row: -1, column: -1};

        var onMouseSelectionEnd = function(e) {
            blockSelect();
            clearInterval(timerId);
            editor.removeSelectionMarkers(rectSel);
            if (!rectSel.length)
                rectSel = [selection.toOrientedRange()];
            if (initialRange) {
                editor.removeSelectionMarker(initialRange);
                selection.toSingleRange(initialRange);
            }
            for (var i = 0; i < rectSel.length; i++)
                selection.addRange(rectSel[i]);
            editor.inVirtualSelectionMode = false;
            editor.$mouseHandler.$clickSelection = null;
        };

        var onSelectionInterval = blockSelect;

        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(function() {onSelectionInterval();}, 20);

        return e.preventDefault();
    }
}


exports.onMouseDown = onMouseDown;

});

ace.define("ace/commands/multi_select_commands",["require","exports","module","ace/keyboard/hash_handler"], function(require, exports, module) {
exports.defaultCommands = [{
    name: "addCursorAbove",
    exec: function(editor) { editor.selectMoreLines(-1); },
    bindKey: {win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "addCursorBelow",
    exec: function(editor) { editor.selectMoreLines(1); },
    bindKey: {win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "addCursorAboveSkipCurrent",
    exec: function(editor) { editor.selectMoreLines(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Up", mac: "Ctrl-Alt-Shift-Up"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "addCursorBelowSkipCurrent",
    exec: function(editor) { editor.selectMoreLines(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Down", mac: "Ctrl-Alt-Shift-Down"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectMoreBefore",
    exec: function(editor) { editor.selectMore(-1); },
    bindKey: {win: "Ctrl-Alt-Left", mac: "Ctrl-Alt-Left"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectMoreAfter",
    exec: function(editor) { editor.selectMore(1); },
    bindKey: {win: "Ctrl-Alt-Right", mac: "Ctrl-Alt-Right"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectNextBefore",
    exec: function(editor) { editor.selectMore(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Left", mac: "Ctrl-Alt-Shift-Left"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectNextAfter",
    exec: function(editor) { editor.selectMore(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Right", mac: "Ctrl-Alt-Shift-Right"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "splitIntoLines",
    exec: function(editor) { editor.multiSelect.splitIntoLines(); },
    bindKey: {win: "Ctrl-Alt-L", mac: "Ctrl-Alt-L"},
    readOnly: true
}, {
    name: "alignCursors",
    exec: function(editor) { editor.alignCursors(); },
    bindKey: {win: "Ctrl-Alt-A", mac: "Ctrl-Alt-A"},
    scrollIntoView: "cursor"
}, {
    name: "findAll",
    exec: function(editor) { editor.findAll(); },
    bindKey: {win: "Ctrl-Alt-K", mac: "Ctrl-Alt-G"},
    scrollIntoView: "cursor",
    readOnly: true
}];
exports.multiSelectCommands = [{
    name: "singleSelection",
    bindKey: "esc",
    exec: function(editor) { editor.exitMultiSelectMode(); },
    scrollIntoView: "cursor",
    readOnly: true,
    isAvailable: function(editor) {return editor && editor.inMultiSelectMode;}
}];

var HashHandler = require("../keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiSelectCommands);

});

ace.define("ace/multi_select",["require","exports","module","ace/range_list","ace/range","ace/selection","ace/mouse/multi_select_handler","ace/lib/event","ace/lib/lang","ace/commands/multi_select_commands","ace/search","ace/edit_session","ace/editor","ace/config"], function(require, exports, module) {

var RangeList = require("./range_list").RangeList;
var Range = require("./range").Range;
var Selection = require("./selection").Selection;
var onMouseDown = require("./mouse/multi_select_handler").onMouseDown;
var event = require("./lib/event");
var lang = require("./lib/lang");
var commands = require("./commands/multi_select_commands");
exports.commands = commands.defaultCommands.concat(commands.multiSelectCommands);
var Search = require("./search").Search;
var search = new Search();

function find(session, needle, dir) {
    search.$options.wrap = true;
    search.$options.needle = needle;
    search.$options.backwards = dir == -1;
    return search.find(session);
}
var EditSession = require("./edit_session").EditSession;
(function() {
    this.getSelectionMarkers = function() {
        return this.$selectionMarkers;
    };
}).call(EditSession.prototype);
(function() {
    this.ranges = null;
    this.rangeList = null;
    this.addRange = function(range, $blockChangeEvents) {
        if (!range)
            return;

        if (!this.inMultiSelectMode && this.rangeCount === 0) {
            var oldRange = this.toOrientedRange();
            this.rangeList.add(oldRange);
            this.rangeList.add(range);
            if (this.rangeList.ranges.length != 2) {
                this.rangeList.removeAll();
                return $blockChangeEvents || this.fromOrientedRange(range);
            }
            this.rangeList.removeAll();
            this.rangeList.add(oldRange);
            this.$onAddRange(oldRange);
        }

        if (!range.cursor)
            range.cursor = range.end;

        var removed = this.rangeList.add(range);

        this.$onAddRange(range);

        if (removed.length)
            this.$onRemoveRange(removed);

        if (this.rangeCount > 1 && !this.inMultiSelectMode) {
            this._signal("multiSelect");
            this.inMultiSelectMode = true;
            this.session.$undoSelect = false;
            this.rangeList.attach(this.session);
        }

        return $blockChangeEvents || this.fromOrientedRange(range);
    };

    this.toSingleRange = function(range) {
        range = range || this.ranges[0];
        var removed = this.rangeList.removeAll();
        if (removed.length)
            this.$onRemoveRange(removed);

        range && this.fromOrientedRange(range);
    };
    this.substractPoint = function(pos) {
        var removed = this.rangeList.substractPoint(pos);
        if (removed) {
            this.$onRemoveRange(removed);
            return removed[0];
        }
    };
    this.mergeOverlappingRanges = function() {
        var removed = this.rangeList.merge();
        if (removed.length)
            this.$onRemoveRange(removed);
    };

    this.$onAddRange = function(range) {
        this.rangeCount = this.rangeList.ranges.length;
        this.ranges.unshift(range);
        this._signal("addRange", {range: range});
    };

    this.$onRemoveRange = function(removed) {
        this.rangeCount = this.rangeList.ranges.length;
        if (this.rangeCount == 1 && this.inMultiSelectMode) {
            var lastRange = this.rangeList.ranges.pop();
            removed.push(lastRange);
            this.rangeCount = 0;
        }

        for (var i = removed.length; i--; ) {
            var index = this.ranges.indexOf(removed[i]);
            this.ranges.splice(index, 1);
        }

        this._signal("removeRange", {ranges: removed});

        if (this.rangeCount === 0 && this.inMultiSelectMode) {
            this.inMultiSelectMode = false;
            this._signal("singleSelect");
            this.session.$undoSelect = true;
            this.rangeList.detach(this.session);
        }

        lastRange = lastRange || this.ranges[0];
        if (lastRange && !lastRange.isEqual(this.getRange()))
            this.fromOrientedRange(lastRange);
    };
    this.$initRangeList = function() {
        if (this.rangeList)
            return;

        this.rangeList = new RangeList();
        this.ranges = [];
        this.rangeCount = 0;
    };
    this.getAllRanges = function() {
        return this.rangeCount ? this.rangeList.ranges.concat() : [this.getRange()];
    };

    this.splitIntoLines = function () {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor == lastRange.start);
        } else {
            var range = this.getRange();
            var isBackwards = this.isBackwards();
            var startRow = range.start.row;
            var endRow = range.end.row;
            if (startRow == endRow) {
                if (isBackwards)
                    var start = range.end, end = range.start;
                else
                    var start = range.start, end = range.end;
                
                this.addRange(Range.fromPoints(end, end));
                this.addRange(Range.fromPoints(start, start));
                return;
            }

            var rectSel = [];
            var r = this.getLineRange(startRow, true);
            r.start.column = range.start.column;
            rectSel.push(r);

            for (var i = startRow + 1; i < endRow; i++)
                rectSel.push(this.getLineRange(i, true));

            r = this.getLineRange(endRow, true);
            r.end.column = range.end.column;
            rectSel.push(r);

            rectSel.forEach(this.addRange, this);
        }
    };
    this.toggleBlockSelection = function () {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor == lastRange.start);
        } else {
            var cursor = this.session.documentToScreenPosition(this.cursor);
            var anchor = this.session.documentToScreenPosition(this.anchor);

            var rectSel = this.rectangularRangeBlock(cursor, anchor);
            rectSel.forEach(this.addRange, this);
        }
    };
    this.rectangularRangeBlock = function(screenCursor, screenAnchor, includeEmptyLines) {
        var rectSel = [];

        var xBackwards = screenCursor.column < screenAnchor.column;
        if (xBackwards) {
            var startColumn = screenCursor.column;
            var endColumn = screenAnchor.column;
            var startOffsetX = screenCursor.offsetX;
            var endOffsetX = screenAnchor.offsetX;
        } else {
            var startColumn = screenAnchor.column;
            var endColumn = screenCursor.column;
            var startOffsetX = screenAnchor.offsetX;
            var endOffsetX = screenCursor.offsetX;
        }

        var yBackwards = screenCursor.row < screenAnchor.row;
        if (yBackwards) {
            var startRow = screenCursor.row;
            var endRow = screenAnchor.row;
        } else {
            var startRow = screenAnchor.row;
            var endRow = screenCursor.row;
        }

        if (startColumn < 0)
            startColumn = 0;
        if (startRow < 0)
            startRow = 0;

        if (startRow == endRow)
            includeEmptyLines = true;

        var docEnd;
        for (var row = startRow; row <= endRow; row++) {
            var range = Range.fromPoints(
                this.session.screenToDocumentPosition(row, startColumn, startOffsetX),
                this.session.screenToDocumentPosition(row, endColumn, endOffsetX)
            );
            if (range.isEmpty()) {
                if (docEnd && isSamePoint(range.end, docEnd))
                    break;
                docEnd = range.end;
            }
            range.cursor = xBackwards ? range.start : range.end;
            rectSel.push(range);
        }

        if (yBackwards)
            rectSel.reverse();

        if (!includeEmptyLines) {
            var end = rectSel.length - 1;
            while (rectSel[end].isEmpty() && end > 0)
                end--;
            if (end > 0) {
                var start = 0;
                while (rectSel[start].isEmpty())
                    start++;
            }
            for (var i = end; i >= start; i--) {
                if (rectSel[i].isEmpty())
                    rectSel.splice(i, 1);
            }
        }

        return rectSel;
    };
}).call(Selection.prototype);
var Editor = require("./editor").Editor;
(function() {
    this.updateSelectionMarkers = function() {
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };
    this.addSelectionMarker = function(orientedRange) {
        if (!orientedRange.cursor)
            orientedRange.cursor = orientedRange.end;

        var style = this.getSelectionStyle();
        orientedRange.marker = this.session.addMarker(orientedRange, "ace_selection", style);

        this.session.$selectionMarkers.push(orientedRange);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
        return orientedRange;
    };
    this.removeSelectionMarker = function(range) {
        if (!range.marker)
            return;
        this.session.removeMarker(range.marker);
        var index = this.session.$selectionMarkers.indexOf(range);
        if (index != -1)
            this.session.$selectionMarkers.splice(index, 1);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
    };

    this.removeSelectionMarkers = function(ranges) {
        var markerList = this.session.$selectionMarkers;
        for (var i = ranges.length; i--; ) {
            var range = ranges[i];
            if (!range.marker)
                continue;
            this.session.removeMarker(range.marker);
            var index = markerList.indexOf(range);
            if (index != -1)
                markerList.splice(index, 1);
        }
        this.session.selectionMarkerCount = markerList.length;
    };

    this.$onAddRange = function(e) {
        this.addSelectionMarker(e.range);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onRemoveRange = function(e) {
        this.removeSelectionMarkers(e.ranges);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onMultiSelect = function(e) {
        if (this.inMultiSelectMode)
            return;
        this.inMultiSelectMode = true;

        this.setStyle("ace_multiselect");
        this.keyBinding.addKeyboardHandler(commands.keyboardHandler);
        this.commands.setDefaultHandler("exec", this.$onMultiSelectExec);

        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onSingleSelect = function(e) {
        if (this.session.multiSelect.inVirtualMode)
            return;
        this.inMultiSelectMode = false;

        this.unsetStyle("ace_multiselect");
        this.keyBinding.removeKeyboardHandler(commands.keyboardHandler);

        this.commands.removeDefaultHandler("exec", this.$onMultiSelectExec);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
        this._emit("changeSelection");
    };

    this.$onMultiSelectExec = function(e) {
        var command = e.command;
        var editor = e.editor;
        if (!editor.multiSelect)
            return;
        if (!command.multiSelectAction) {
            var result = command.exec(editor, e.args || {});
            editor.multiSelect.addRange(editor.multiSelect.toOrientedRange());
            editor.multiSelect.mergeOverlappingRanges();
        } else if (command.multiSelectAction == "forEach") {
            result = editor.forEachSelection(command, e.args);
        } else if (command.multiSelectAction == "forEachLine") {
            result = editor.forEachSelection(command, e.args, true);
        } else if (command.multiSelectAction == "single") {
            editor.exitMultiSelectMode();
            result = command.exec(editor, e.args || {});
        } else {
            result = command.multiSelectAction(editor, e.args || {});
        }
        return result;
    }; 
    this.forEachSelection = function(cmd, args, options) {
        if (this.inVirtualSelectionMode)
            return;
        var keepOrder = options && options.keepOrder;
        var $byLines = options == true || options && options.$byLines;
        var session = this.session;
        var selection = this.selection;
        var rangeList = selection.rangeList;
        var ranges = (keepOrder ? selection : rangeList).ranges;
        var result;
        
        if (!ranges.length)
            return cmd.exec ? cmd.exec(this, args || {}) : cmd(this, args || {});
        
        var reg = selection._eventRegistry;
        selection._eventRegistry = {};

        var tmpSel = new Selection(session);
        this.inVirtualSelectionMode = true;
        for (var i = ranges.length; i--;) {
            if ($byLines) {
                while (i > 0 && ranges[i].start.row == ranges[i - 1].end.row)
                    i--;
            }
            tmpSel.fromOrientedRange(ranges[i]);
            tmpSel.index = i;
            this.selection = session.selection = tmpSel;
            var cmdResult = cmd.exec ? cmd.exec(this, args || {}) : cmd(this, args || {});
            if (!result && cmdResult !== undefined)
                result = cmdResult;
            tmpSel.toOrientedRange(ranges[i]);
        }
        tmpSel.detach();

        this.selection = session.selection = selection;
        this.inVirtualSelectionMode = false;
        selection._eventRegistry = reg;
        selection.mergeOverlappingRanges();
        if (selection.ranges[0])
            selection.fromOrientedRange(selection.ranges[0]);
        
        var anim = this.renderer.$scrollAnimation;
        this.onCursorChange();
        this.onSelectionChange();
        if (anim && anim.from == anim.to)
            this.renderer.animateScrolling(anim.from);
        
        return result;
    };
    this.exitMultiSelectMode = function() {
        if (!this.inMultiSelectMode || this.inVirtualSelectionMode)
            return;
        this.multiSelect.toSingleRange();
    };

    this.getSelectedText = function() {
        var text = "";
        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
            var ranges = this.multiSelect.rangeList.ranges;
            var buf = [];
            for (var i = 0; i < ranges.length; i++) {
                buf.push(this.session.getTextRange(ranges[i]));
            }
            var nl = this.session.getDocument().getNewLineCharacter();
            text = buf.join(nl);
            if (text.length == (buf.length - 1) * nl.length)
                text = "";
        } else if (!this.selection.isEmpty()) {
            text = this.session.getTextRange(this.getSelectionRange());
        }
        return text;
    };
    
    this.$checkMultiselectChange = function(e, anchor) {
        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
            var range = this.multiSelect.ranges[0];
            if (this.multiSelect.isEmpty() && anchor == this.multiSelect.anchor)
                return;
            var pos = anchor == this.multiSelect.anchor
                ? range.cursor == range.start ? range.end : range.start
                : range.cursor;
            if (pos.row != anchor.row 
                || this.session.$clipPositionToDocument(pos.row, pos.column).column != anchor.column)
                this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());
            else
                this.multiSelect.mergeOverlappingRanges();
        }
    };
    this.findAll = function(needle, options, additive) {
        options = options || {};
        options.needle = needle || options.needle;
        if (options.needle == undefined) {
            var range = this.selection.isEmpty()
                ? this.selection.getWordRange()
                : this.selection.getRange();
            options.needle = this.session.getTextRange(range);
        }    
        this.$search.set(options);
        
        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return 0;

        var selection = this.multiSelect;

        if (!additive)
            selection.toSingleRange(ranges[0]);

        for (var i = ranges.length; i--; )
            selection.addRange(ranges[i], true);
        if (range && selection.rangeList.rangeAtPoint(range.start))
            selection.addRange(range, true);
        
        return ranges.length;
    };
    this.selectMoreLines = function(dir, skip) {
        var range = this.selection.toOrientedRange();
        var isBackwards = range.cursor == range.end;

        var screenLead = this.session.documentToScreenPosition(range.cursor);
        if (this.selection.$desiredColumn)
            screenLead.column = this.selection.$desiredColumn;

        var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);

        if (!range.isEmpty()) {
            var screenAnchor = this.session.documentToScreenPosition(isBackwards ? range.end : range.start);
            var anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
        } else {
            var anchor = lead;
        }

        if (isBackwards) {
            var newRange = Range.fromPoints(lead, anchor);
            newRange.cursor = newRange.start;
        } else {
            var newRange = Range.fromPoints(anchor, lead);
            newRange.cursor = newRange.end;
        }

        newRange.desiredColumn = screenLead.column;
        if (!this.selection.inMultiSelectMode) {
            this.selection.addRange(range);
        } else {
            if (skip)
                var toRemove = range.cursor;
        }

        this.selection.addRange(newRange);
        if (toRemove)
            this.selection.substractPoint(toRemove);
    };
    this.transposeSelections = function(dir) {
        var session = this.session;
        var sel = session.multiSelect;
        var all = sel.ranges;

        for (var i = all.length; i--; ) {
            var range = all[i];
            if (range.isEmpty()) {
                var tmp = session.getWordRange(range.start.row, range.start.column);
                range.start.row = tmp.start.row;
                range.start.column = tmp.start.column;
                range.end.row = tmp.end.row;
                range.end.column = tmp.end.column;
            }
        }
        sel.mergeOverlappingRanges();

        var words = [];
        for (var i = all.length; i--; ) {
            var range = all[i];
            words.unshift(session.getTextRange(range));
        }

        if (dir < 0)
            words.unshift(words.pop());
        else
            words.push(words.shift());

        for (var i = all.length; i--; ) {
            var range = all[i];
            var tmp = range.clone();
            session.replace(range, words[i]);
            range.start.row = tmp.start.row;
            range.start.column = tmp.start.column;
        }
        sel.fromOrientedRange(sel.ranges[0]);
    };
    this.selectMore = function(dir, skip, stopAtFirst) {
        var session = this.session;
        var sel = session.multiSelect;

        var range = sel.toOrientedRange();
        if (range.isEmpty()) {
            range = session.getWordRange(range.start.row, range.start.column);
            range.cursor = dir == -1 ? range.start : range.end;
            this.multiSelect.addRange(range);
            if (stopAtFirst)
                return;
        }
        var needle = session.getTextRange(range);

        var newRange = find(session, needle, dir);
        if (newRange) {
            newRange.cursor = dir == -1 ? newRange.start : newRange.end;
            this.session.unfold(newRange);
            this.multiSelect.addRange(newRange);
            this.renderer.scrollCursorIntoView(null, 0.5);
        }
        if (skip)
            this.multiSelect.substractPoint(range.cursor);
    };
    this.alignCursors = function() {
        var session = this.session;
        var sel = session.multiSelect;
        var ranges = sel.ranges;
        var row = -1;
        var sameRowRanges = ranges.filter(function(r) {
            if (r.cursor.row == row)
                return true;
            row = r.cursor.row;
        });
        
        if (!ranges.length || sameRowRanges.length == ranges.length - 1) {
            var range = this.selection.getRange();
            var fr = range.start.row, lr = range.end.row;
            var guessRange = fr == lr;
            if (guessRange) {
                var max = this.session.getLength();
                var line;
                do {
                    line = this.session.getLine(lr);
                } while (/[=:]/.test(line) && ++lr < max);
                do {
                    line = this.session.getLine(fr);
                } while (/[=:]/.test(line) && --fr > 0);
                
                if (fr < 0) fr = 0;
                if (lr >= max) lr = max - 1;
            }
            var lines = this.session.removeFullLines(fr, lr);
            lines = this.$reAlignText(lines, guessRange);
            this.session.insert({row: fr, column: 0}, lines.join("\n") + "\n");
            if (!guessRange) {
                range.start.column = 0;
                range.end.column = lines[lines.length - 1].length;
            }
            this.selection.setRange(range);
        } else {
            sameRowRanges.forEach(function(r) {
                sel.substractPoint(r.cursor);
            });

            var maxCol = 0;
            var minSpace = Infinity;
            var spaceOffsets = ranges.map(function(r) {
                var p = r.cursor;
                var line = session.getLine(p.row);
                var spaceOffset = line.substr(p.column).search(/\S/g);
                if (spaceOffset == -1)
                    spaceOffset = 0;

                if (p.column > maxCol)
                    maxCol = p.column;
                if (spaceOffset < minSpace)
                    minSpace = spaceOffset;
                return spaceOffset;
            });
            ranges.forEach(function(r, i) {
                var p = r.cursor;
                var l = maxCol - p.column;
                var d = spaceOffsets[i] - minSpace;
                if (l > d)
                    session.insert(p, lang.stringRepeat(" ", l - d));
                else
                    session.remove(new Range(p.row, p.column, p.row, p.column - l + d));

                r.start.column = r.end.column = maxCol;
                r.start.row = r.end.row = p.row;
                r.cursor = r.end;
            });
            sel.fromOrientedRange(ranges[0]);
            this.renderer.updateCursor();
            this.renderer.updateBackMarkers();
        }
    };

    this.$reAlignText = function(lines, forceLeft) {
        var isLeftAligned = true, isRightAligned = true;
        var startW, textW, endW;

        return lines.map(function(line) {
            var m = line.match(/(\s*)(.*?)(\s*)([=:].*)/);
            if (!m)
                return [line];

            if (startW == null) {
                startW = m[1].length;
                textW = m[2].length;
                endW = m[3].length;
                return m;
            }

            if (startW + textW + endW != m[1].length + m[2].length + m[3].length)
                isRightAligned = false;
            if (startW != m[1].length)
                isLeftAligned = false;

            if (startW > m[1].length)
                startW = m[1].length;
            if (textW < m[2].length)
                textW = m[2].length;
            if (endW > m[3].length)
                endW = m[3].length;

            return m;
        }).map(forceLeft ? alignLeft :
            isLeftAligned ? isRightAligned ? alignRight : alignLeft : unAlign);

        function spaces(n) {
            return lang.stringRepeat(" ", n);
        }

        function alignLeft(m) {
            return !m[2] ? m[0] : spaces(startW) + m[2]
                + spaces(textW - m[2].length + endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
        function alignRight(m) {
            return !m[2] ? m[0] : spaces(startW + textW - m[2].length) + m[2]
                + spaces(endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
        function unAlign(m) {
            return !m[2] ? m[0] : spaces(startW) + m[2]
                + spaces(endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
    };
}).call(Editor.prototype);


function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column;
}
exports.onSessionChange = function(e) {
    var session = e.session;
    if (session && !session.multiSelect) {
        session.$selectionMarkers = [];
        session.selection.$initRangeList();
        session.multiSelect = session.selection;
    }
    this.multiSelect = session && session.multiSelect;

    var oldSession = e.oldSession;
    if (oldSession) {
        oldSession.multiSelect.off("addRange", this.$onAddRange);
        oldSession.multiSelect.off("removeRange", this.$onRemoveRange);
        oldSession.multiSelect.off("multiSelect", this.$onMultiSelect);
        oldSession.multiSelect.off("singleSelect", this.$onSingleSelect);
        oldSession.multiSelect.lead.off("change", this.$checkMultiselectChange);
        oldSession.multiSelect.anchor.off("change", this.$checkMultiselectChange);
    }

    if (session) {
        session.multiSelect.on("addRange", this.$onAddRange);
        session.multiSelect.on("removeRange", this.$onRemoveRange);
        session.multiSelect.on("multiSelect", this.$onMultiSelect);
        session.multiSelect.on("singleSelect", this.$onSingleSelect);
        session.multiSelect.lead.on("change", this.$checkMultiselectChange);
        session.multiSelect.anchor.on("change", this.$checkMultiselectChange);
    }

    if (session && this.inMultiSelectMode != session.selection.inMultiSelectMode) {
        if (session.selection.inMultiSelectMode)
            this.$onMultiSelect();
        else
            this.$onSingleSelect();
    }
};
function MultiSelect(editor) {
    if (editor.$multiselectOnSessionChange)
        return;
    editor.$onAddRange = editor.$onAddRange.bind(editor);
    editor.$onRemoveRange = editor.$onRemoveRange.bind(editor);
    editor.$onMultiSelect = editor.$onMultiSelect.bind(editor);
    editor.$onSingleSelect = editor.$onSingleSelect.bind(editor);
    editor.$multiselectOnSessionChange = exports.onSessionChange.bind(editor);
    editor.$checkMultiselectChange = editor.$checkMultiselectChange.bind(editor);

    editor.$multiselectOnSessionChange(editor);
    editor.on("changeSession", editor.$multiselectOnSessionChange);

    editor.on("mousedown", onMouseDown);
    editor.commands.addCommands(commands.defaultCommands);

    addAltCursorListeners(editor);
}

function addAltCursorListeners(editor){
    var el = editor.textInput.getElement();
    var altCursor = false;
    event.addListener(el, "keydown", function(e) {
        var altDown = e.keyCode == 18 && !(e.ctrlKey || e.shiftKey || e.metaKey);
        if (editor.$blockSelectEnabled && altDown) {
            if (!altCursor) {
                editor.renderer.setMouseCursor("crosshair");
                altCursor = true;
            }
        } else if (altCursor) {
            reset();
        }
    });

    event.addListener(el, "keyup", reset);
    event.addListener(el, "blur", reset);
    function reset(e) {
        if (altCursor) {
            editor.renderer.setMouseCursor("");
            altCursor = false;
        }
    }
}

exports.MultiSelect = MultiSelect;


require("./config").defineOptions(Editor.prototype, "editor", {
    enableMultiselect: {
        set: function(val) {
            MultiSelect(this);
            if (val) {
                this.on("changeSession", this.$multiselectOnSessionChange);
                this.on("mousedown", onMouseDown);
            } else {
                this.off("changeSession", this.$multiselectOnSessionChange);
                this.off("mousedown", onMouseDown);
            }
        },
        value: true
    },
    enableBlockSelect: {
        set: function(val) {
            this.$blockSelectEnabled = val;
        },
        value: true
    }
});



});

ace.define("ace/mode/folding/fold_mode",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};

(function() {

    this.foldingStartMarker = null;
    this.foldingStopMarker = null;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        if (this.foldingStartMarker.test(line))
            return "start";
        if (foldStyle == "markbeginend"
                && this.foldingStopMarker
                && this.foldingStopMarker.test(line))
            return "end";
        return "";
    };

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        return null;
    };

    this.indentationBlock = function(session, row, column) {
        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel == -1)
            return;

        var startColumn = column || line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            var level = session.getLine(row).search(re);

            if (level == -1)
                continue;

            if (level <= startLevel)
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };

    this.openingBracketBlock = function(session, bracket, row, column, typeRe) {
        var start = {row: row, column: column + 1};
        var end = session.$findClosingBracket(bracket, start, typeRe);
        if (!end)
            return;

        var fw = session.foldWidgets[end.row];
        if (fw == null)
            fw = session.getFoldWidget(end.row);

        if (fw == "start" && end.row > start.row) {
            end.row --;
            end.column = session.getLine(end.row).length;
        }
        return Range.fromPoints(start, end);
    };

    this.closingBracketBlock = function(session, bracket, row, column, typeRe) {
        var end = {row: row, column: column};
        var start = session.$findOpeningBracket(bracket, end);

        if (!start)
            return;

        start.column++;
        end.column--;

        return  Range.fromPoints(start, end);
    };
}).call(FoldMode.prototype);

});

ace.define("ace/theme/textmate",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";

exports.isDark = false;
exports.cssClass = "ace-tm";
exports.cssText = ".ace-tm .ace_gutter {\
background: #f0f0f0;\
color: #333;\
}\
.ace-tm .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-tm .ace_fold {\
background-color: #6B72E6;\
}\
.ace-tm {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-tm .ace_cursor {\
color: black;\
}\
.ace-tm .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-tm .ace_storage,\
.ace-tm .ace_keyword {\
color: blue;\
}\
.ace-tm .ace_constant {\
color: rgb(197, 6, 11);\
}\
.ace-tm .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-tm .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-tm .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-tm .ace_invalid {\
background-color: rgba(255, 0, 0, 0.1);\
color: red;\
}\
.ace-tm .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-tm .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-tm .ace_support.ace_type,\
.ace-tm .ace_support.ace_class {\
color: rgb(109, 121, 222);\
}\
.ace-tm .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-tm .ace_string {\
color: rgb(3, 106, 7);\
}\
.ace-tm .ace_comment {\
color: rgb(76, 136, 107);\
}\
.ace-tm .ace_comment.ace_doc {\
color: rgb(0, 102, 255);\
}\
.ace-tm .ace_comment.ace_doc.ace_tag {\
color: rgb(128, 159, 191);\
}\
.ace-tm .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-tm .ace_variable {\
color: rgb(49, 132, 149);\
}\
.ace-tm .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-tm .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-tm .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-tm .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-tm .ace_meta.ace_tag {\
color:rgb(0, 22, 142);\
}\
.ace-tm .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-tm .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-tm.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px white;\
}\
.ace-tm .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-tm .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-tm .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-tm .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.07);\
}\
.ace-tm .ace_gutter-active-line {\
background-color : #dcdcdc;\
}\
.ace-tm .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-tm .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
";
exports.$id = "ace/theme/textmate";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});

ace.define("ace/line_widgets",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var Range = require("./range").Range;


function LineWidgets(session) {
    this.session = session;
    this.session.widgetManager = this;
    this.session.getRowLength = this.getRowLength;
    this.session.$getWidgetScreenLength = this.$getWidgetScreenLength;
    this.updateOnChange = this.updateOnChange.bind(this);
    this.renderWidgets = this.renderWidgets.bind(this);
    this.measureWidgets = this.measureWidgets.bind(this);
    this.session._changedWidgets = [];
    this.$onChangeEditor = this.$onChangeEditor.bind(this);
    
    this.session.on("change", this.updateOnChange);
    this.session.on("changeFold", this.updateOnFold);
    this.session.on("changeEditor", this.$onChangeEditor);
}

(function() {
    this.getRowLength = function(row) {
        var h;
        if (this.lineWidgets)
            h = this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0;
        else 
            h = 0;
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1 + h;
        } else {
            return this.$wrapData[row].length + 1 + h;
        }
    };

    this.$getWidgetScreenLength = function() {
        var screenRows = 0;
        this.lineWidgets.forEach(function(w){
            if (w && w.rowCount && !w.hidden)
                screenRows += w.rowCount;
        });
        return screenRows;
    };    
    
    this.$onChangeEditor = function(e) {
        this.attach(e.editor);
    };
    
    this.attach = function(editor) {
        if (editor  && editor.widgetManager && editor.widgetManager != this)
            editor.widgetManager.detach();

        if (this.editor == editor)
            return;

        this.detach();
        this.editor = editor;
        
        if (editor) {
            editor.widgetManager = this;
            editor.renderer.on("beforeRender", this.measureWidgets);
            editor.renderer.on("afterRender", this.renderWidgets);
        }
    };
    this.detach = function(e) {
        var editor = this.editor;
        if (!editor)
            return;
        
        this.editor = null;
        editor.widgetManager = null;
        
        editor.renderer.off("beforeRender", this.measureWidgets);
        editor.renderer.off("afterRender", this.renderWidgets);
        var lineWidgets = this.session.lineWidgets;
        lineWidgets && lineWidgets.forEach(function(w) {
            if (w && w.el && w.el.parentNode) {
                w._inDocument = false;
                w.el.parentNode.removeChild(w.el);
            }
        });
    };

    this.updateOnFold = function(e, session) {
        var lineWidgets = session.lineWidgets;
        if (!lineWidgets || !e.action)
            return;
        var fold = e.data;
        var start = fold.start.row;
        var end = fold.end.row;
        var hide = e.action == "add";
        for (var i = start + 1; i < end; i++) {
            if (lineWidgets[i])
                lineWidgets[i].hidden = hide;
        }
        if (lineWidgets[end]) {
            if (hide) {
                if (!lineWidgets[start])
                    lineWidgets[start] = lineWidgets[end];
                else
                    lineWidgets[end].hidden = hide;
            } else {
                if (lineWidgets[start] == lineWidgets[end])
                    lineWidgets[start] = undefined;
                lineWidgets[end].hidden = hide;
            }
        }
    };
    
    this.updateOnChange = function(delta) {
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;
        
        var startRow = delta.start.row;
        var len = delta.end.row - startRow;

        if (len === 0) {
        } else if (delta.action == 'remove') {
            var removed = lineWidgets.splice(startRow + 1, len);
            removed.forEach(function(w) {
                w && this.removeLineWidget(w);
            }, this);
            this.$updateRows();
        } else {
            var args = new Array(len);
            args.unshift(startRow, 0);
            lineWidgets.splice.apply(lineWidgets, args);
            this.$updateRows();
        }
    };
    
    this.$updateRows = function() {
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;
        var noWidgets = true;
        lineWidgets.forEach(function(w, i) {
            if (w) {
                noWidgets = false;
                w.row = i;
                while (w.$oldWidget) {
                    w.$oldWidget.row = i;
                    w = w.$oldWidget;
                }
            }
        });
        if (noWidgets)
            this.session.lineWidgets = null;
    };

    this.addLineWidget = function(w) {
        if (!this.session.lineWidgets)
            this.session.lineWidgets = new Array(this.session.getLength());
        
        var old = this.session.lineWidgets[w.row];
        if (old) {
            w.$oldWidget = old;
            if (old.el && old.el.parentNode) {
                old.el.parentNode.removeChild(old.el);
                old._inDocument = false;
            }
        }
            
        this.session.lineWidgets[w.row] = w;
        
        w.session = this.session;
        
        var renderer = this.editor.renderer;
        if (w.html && !w.el) {
            w.el = dom.createElement("div");
            w.el.innerHTML = w.html;
        }
        if (w.el) {
            dom.addCssClass(w.el, "ace_lineWidgetContainer");
            w.el.style.position = "absolute";
            w.el.style.zIndex = 5;
            renderer.container.appendChild(w.el);
            w._inDocument = true;
        }
        
        if (!w.coverGutter) {
            w.el.style.zIndex = 3;
        }
        if (w.pixelHeight == null) {
            w.pixelHeight = w.el.offsetHeight;
        }
        if (w.rowCount == null) {
            w.rowCount = w.pixelHeight / renderer.layerConfig.lineHeight;
        }
        
        var fold = this.session.getFoldAt(w.row, 0);
        w.$fold = fold;
        if (fold) {
            var lineWidgets = this.session.lineWidgets;
            if (w.row == fold.end.row && !lineWidgets[fold.start.row])
                lineWidgets[fold.start.row] = w;
            else
                w.hidden = true;
        }
            
        this.session._emit("changeFold", {data:{start:{row: w.row}}});
        
        this.$updateRows();
        this.renderWidgets(null, renderer);
        this.onWidgetChanged(w);
        return w;
    };
    
    this.removeLineWidget = function(w) {
        w._inDocument = false;
        w.session = null;
        if (w.el && w.el.parentNode)
            w.el.parentNode.removeChild(w.el);
        if (w.editor && w.editor.destroy) try {
            w.editor.destroy();
        } catch(e){}
        if (this.session.lineWidgets) {
            var w1 = this.session.lineWidgets[w.row];
            if (w1 == w) {
                this.session.lineWidgets[w.row] = w.$oldWidget;
                if (w.$oldWidget)
                    this.onWidgetChanged(w.$oldWidget);
            } else {
                while (w1) {
                    if (w1.$oldWidget == w) {
                        w1.$oldWidget = w.$oldWidget;
                        break;
                    }
                    w1 = w1.$oldWidget;
                }
            }
        }
        this.session._emit("changeFold", {data:{start:{row: w.row}}});
        this.$updateRows();
    };
    
    this.getWidgetsAtRow = function(row) {
        var lineWidgets = this.session.lineWidgets;
        var w = lineWidgets && lineWidgets[row];
        var list = [];
        while (w) {
            list.push(w);
            w = w.$oldWidget;
        }
        return list;
    };
    
    this.onWidgetChanged = function(w) {
        this.session._changedWidgets.push(w);
        this.editor && this.editor.renderer.updateFull();
    };
    
    this.measureWidgets = function(e, renderer) {
        var changedWidgets = this.session._changedWidgets;
        var config = renderer.layerConfig;
        
        if (!changedWidgets || !changedWidgets.length) return;
        var min = Infinity;
        for (var i = 0; i < changedWidgets.length; i++) {
            var w = changedWidgets[i];
            if (!w || !w.el) continue;
            if (w.session != this.session) continue;
            if (!w._inDocument) {
                if (this.session.lineWidgets[w.row] != w)
                    continue;
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }
            
            w.h = w.el.offsetHeight;
            
            if (!w.fixedWidth) {
                w.w = w.el.offsetWidth;
                w.screenWidth = Math.ceil(w.w / config.characterWidth);
            }
            
            var rowCount = w.h / config.lineHeight;
            if (w.coverLine) {
                rowCount -= this.session.getRowLineCount(w.row);
                if (rowCount < 0)
                    rowCount = 0;
            }
            if (w.rowCount != rowCount) {
                w.rowCount = rowCount;
                if (w.row < min)
                    min = w.row;
            }
        }
        if (min != Infinity) {
            this.session._emit("changeFold", {data:{start:{row: min}}});
            this.session.lineWidgetWidth = null;
        }
        this.session._changedWidgets = [];
    };
    
    this.renderWidgets = function(e, renderer) {
        var config = renderer.layerConfig;
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets)
            return;
        var first = Math.min(this.firstRow, config.firstRow);
        var last = Math.max(this.lastRow, config.lastRow, lineWidgets.length);
        
        while (first > 0 && !lineWidgets[first])
            first--;
        
        this.firstRow = config.firstRow;
        this.lastRow = config.lastRow;

        renderer.$cursorLayer.config = config;
        for (var i = first; i <= last; i++) {
            var w = lineWidgets[i];
            if (!w || !w.el) continue;
            if (w.hidden) {
                w.el.style.top = -100 - (w.pixelHeight || 0) + "px";
                continue;
            }
            if (!w._inDocument) {
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }
            var top = renderer.$cursorLayer.getPixelPosition({row: i, column:0}, true).top;
            if (!w.coverLine)
                top += config.lineHeight * this.session.getRowLineCount(w.row);
            w.el.style.top = top - config.offset + "px";
            
            var left = w.coverGutter ? 0 : renderer.gutterWidth;
            if (!w.fixedWidth)
                left -= renderer.scrollLeft;
            w.el.style.left = left + "px";
            
            if (w.fullWidth && w.screenWidth) {
                w.el.style.minWidth = config.width + 2 * config.padding + "px";
            }
            
            if (w.fixedWidth) {
                w.el.style.right = renderer.scrollBar.getWidth() + "px";
            } else {
                w.el.style.right = "";
            }
        }
    };
    
}).call(LineWidgets.prototype);


exports.LineWidgets = LineWidgets;

});

ace.define("ace/ext/error_marker",["require","exports","module","ace/line_widgets","ace/lib/dom","ace/range"], function(require, exports, module) {
"use strict";
var LineWidgets = require("../line_widgets").LineWidgets;
var dom = require("../lib/dom");
var Range = require("../range").Range;

function binarySearch(array, needle, comparator) {
    var first = 0;
    var last = array.length - 1;

    while (first <= last) {
        var mid = (first + last) >> 1;
        var c = comparator(needle, array[mid]);
        if (c > 0)
            first = mid + 1;
        else if (c < 0)
            last = mid - 1;
        else
            return mid;
    }
    return -(first + 1);
}

function findAnnotations(session, row, dir) {
    var annotations = session.getAnnotations().sort(Range.comparePoints);
    if (!annotations.length)
        return;
    
    var i = binarySearch(annotations, {row: row, column: -1}, Range.comparePoints);
    if (i < 0)
        i = -i - 1;
    
    if (i >= annotations.length)
        i = dir > 0 ? 0 : annotations.length - 1;
    else if (i === 0 && dir < 0)
        i = annotations.length - 1;
    
    var annotation = annotations[i];
    if (!annotation || !dir)
        return;

    if (annotation.row === row) {
        do {
            annotation = annotations[i += dir];
        } while (annotation && annotation.row === row);
        if (!annotation)
            return annotations.slice();
    }
    
    
    var matched = [];
    row = annotation.row;
    do {
        matched[dir < 0 ? "unshift" : "push"](annotation);
        annotation = annotations[i += dir];
    } while (annotation && annotation.row == row);
    return matched.length && matched;
}

exports.showErrorMarker = function(editor, dir) {
    var session = editor.session;
    if (!session.widgetManager) {
        session.widgetManager = new LineWidgets(session);
        session.widgetManager.attach(editor);
    }
    
    var pos = editor.getCursorPosition();
    var row = pos.row;
    var oldWidget = session.widgetManager.getWidgetsAtRow(row).filter(function(w) {
        return w.type == "errorMarker";
    })[0];
    if (oldWidget) {
        oldWidget.destroy();
    } else {
        row -= dir;
    }
    var annotations = findAnnotations(session, row, dir);
    var gutterAnno;
    if (annotations) {
        var annotation = annotations[0];
        pos.column = (annotation.pos && typeof annotation.column != "number"
            ? annotation.pos.sc
            : annotation.column) || 0;
        pos.row = annotation.row;
        gutterAnno = editor.renderer.$gutterLayer.$annotations[pos.row];
    } else if (oldWidget) {
        return;
    } else {
        gutterAnno = {
            text: ["Looks good!"],
            className: "ace_ok"
        };
    }
    editor.session.unfold(pos.row);
    editor.selection.moveToPosition(pos);
    
    var w = {
        row: pos.row, 
        fixedWidth: true,
        coverGutter: true,
        el: dom.createElement("div"),
        type: "errorMarker"
    };
    var el = w.el.appendChild(dom.createElement("div"));
    var arrow = w.el.appendChild(dom.createElement("div"));
    arrow.className = "error_widget_arrow " + gutterAnno.className;
    
    var left = editor.renderer.$cursorLayer
        .getPixelPosition(pos).left;
    arrow.style.left = left + editor.renderer.gutterWidth - 5 + "px";
    
    w.el.className = "error_widget_wrapper";
    el.className = "error_widget " + gutterAnno.className;
    el.innerHTML = gutterAnno.text.join("<br>");
    
    el.appendChild(dom.createElement("div"));
    
    var kb = function(_, hashId, keyString) {
        if (hashId === 0 && (keyString === "esc" || keyString === "return")) {
            w.destroy();
            return {command: "null"};
        }
    };
    
    w.destroy = function() {
        if (editor.$mouseHandler.isMousePressed)
            return;
        editor.keyBinding.removeKeyboardHandler(kb);
        session.widgetManager.removeLineWidget(w);
        editor.off("changeSelection", w.destroy);
        editor.off("changeSession", w.destroy);
        editor.off("mouseup", w.destroy);
        editor.off("change", w.destroy);
    };
    
    editor.keyBinding.addKeyboardHandler(kb);
    editor.on("changeSelection", w.destroy);
    editor.on("changeSession", w.destroy);
    editor.on("mouseup", w.destroy);
    editor.on("change", w.destroy);
    
    editor.session.widgetManager.addLineWidget(w);
    
    w.el.onmousedown = editor.focus.bind(editor);
    
    editor.renderer.scrollCursorIntoView(null, 0.5, {bottom: w.el.offsetHeight});
};


dom.importCssString("\
    .error_widget_wrapper {\
        background: inherit;\
        color: inherit;\
        border:none\
    }\
    .error_widget {\
        border-top: solid 2px;\
        border-bottom: solid 2px;\
        margin: 5px 0;\
        padding: 10px 40px;\
        white-space: pre-wrap;\
    }\
    .error_widget.ace_error, .error_widget_arrow.ace_error{\
        border-color: #ff5a5a\
    }\
    .error_widget.ace_warning, .error_widget_arrow.ace_warning{\
        border-color: #F1D817\
    }\
    .error_widget.ace_info, .error_widget_arrow.ace_info{\
        border-color: #5a5a5a\
    }\
    .error_widget.ace_ok, .error_widget_arrow.ace_ok{\
        border-color: #5aaa5a\
    }\
    .error_widget_arrow {\
        position: absolute;\
        border: solid 5px;\
        border-top-color: transparent!important;\
        border-right-color: transparent!important;\
        border-left-color: transparent!important;\
        top: -5px;\
    }\
", "");

});

ace.define("ace/ace",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/dom","ace/lib/event","ace/range","ace/editor","ace/edit_session","ace/undomanager","ace/virtual_renderer","ace/worker/worker_client","ace/keyboard/hash_handler","ace/placeholder","ace/multi_select","ace/mode/folding/fold_mode","ace/theme/textmate","ace/ext/error_marker","ace/config"], function(require, exports, module) {
"use strict";

require("./lib/fixoldbrowsers");

var dom = require("./lib/dom");
var event = require("./lib/event");

var Range = require("./range").Range;
var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var UndoManager = require("./undomanager").UndoManager;
var Renderer = require("./virtual_renderer").VirtualRenderer;
require("./worker/worker_client");
require("./keyboard/hash_handler");
require("./placeholder");
require("./multi_select");
require("./mode/folding/fold_mode");
require("./theme/textmate");
require("./ext/error_marker");

exports.config = require("./config");
exports.require = require;

if (typeof define === "function")
    exports.define = define;
exports.edit = function(el, options) {
    if (typeof el == "string") {
        var _id = el;
        el = document.getElementById(_id);
        if (!el)
            throw new Error("ace.edit can't find div #" + _id);
    }

    if (el && el.env && el.env.editor instanceof Editor)
        return el.env.editor;

    var value = "";
    if (el && /input|textarea/i.test(el.tagName)) {
        var oldNode = el;
        value = oldNode.value;
        el = dom.createElement("pre");
        oldNode.parentNode.replaceChild(el, oldNode);
    } else if (el) {
        value = el.textContent;
        el.innerHTML = "";
    }

    var doc = exports.createEditSession(value);

    var editor = new Editor(new Renderer(el), doc, options);

    var env = {
        document: doc,
        editor: editor,
        onResize: editor.resize.bind(editor, null)
    };
    if (oldNode) env.textarea = oldNode;
    event.addListener(window, "resize", env.onResize);
    editor.on("destroy", function() {
        event.removeListener(window, "resize", env.onResize);
        env.editor.container.env = null; // prevent memory leak on old ie
    });
    editor.container.env = editor.env = env;
    return editor;
};
exports.createEditSession = function(text, mode) {
    var doc = new EditSession(text, mode);
    doc.setUndoManager(new UndoManager());
    return doc;
};
exports.Range = Range;
exports.Editor = Editor;
exports.EditSession = EditSession;
exports.UndoManager = UndoManager;
exports.VirtualRenderer = Renderer;
exports.version = "1.4.3";
});            (function() {
                ace.require(["ace/ace"], function(a) {
                    if (a) {
                        a.config.init(true);
                        a.define = ace.define;
                    }
                    if (!window.ace)
                        window.ace = a;
                    for (var key in a) if (a.hasOwnProperty(key))
                        window.ace[key] = a[key];
                    window.ace["default"] = window.ace;
                    if (typeof module == "object" && typeof exports == "object" && module) {
                        module.exports = window.ace;
                    }
                });
            })();
        
},{}],"../node_modules/ace-builds/src-noconflict/ext-language_tools.js":[function(require,module,exports) {
ace.define("ace/snippets",["require","exports","module","ace/lib/oop","ace/lib/event_emitter","ace/lib/lang","ace/range","ace/anchor","ace/keyboard/hash_handler","ace/tokenizer","ace/lib/dom","ace/editor"], function(require, exports, module) {
"use strict";
var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var lang = require("./lib/lang");
var Range = require("./range").Range;
var Anchor = require("./anchor").Anchor;
var HashHandler = require("./keyboard/hash_handler").HashHandler;
var Tokenizer = require("./tokenizer").Tokenizer;
var comparePoints = Range.comparePoints;

var SnippetManager = function() {
    this.snippetMap = {};
    this.snippetNameMap = {};
};

(function() {
    oop.implement(this, EventEmitter);
    
    this.getTokenizer = function() {
        function TabstopToken(str, _, stack) {
            str = str.substr(1);
            if (/^\d+$/.test(str) && !stack.inFormatString)
                return [{tabstopId: parseInt(str, 10)}];
            return [{text: str}];
        }
        function escape(ch) {
            return "(?:[^\\\\" + ch + "]|\\\\.)";
        }
        SnippetManager.$tokenizer = new Tokenizer({
            start: [
                {regex: /:/, onMatch: function(val, state, stack) {
                    if (stack.length && stack[0].expectIf) {
                        stack[0].expectIf = false;
                        stack[0].elseBranch = stack[0];
                        return [stack[0]];
                    }
                    return ":";
                }},
                {regex: /\\./, onMatch: function(val, state, stack) {
                    var ch = val[1];
                    if (ch == "}" && stack.length) {
                        val = ch;
                    }else if ("`$\\".indexOf(ch) != -1) {
                        val = ch;
                    } else if (stack.inFormatString) {
                        if (ch == "n")
                            val = "\n";
                        else if (ch == "t")
                            val = "\n";
                        else if ("ulULE".indexOf(ch) != -1) {
                            val = {changeCase: ch, local: ch > "a"};
                        }
                    }

                    return [val];
                }},
                {regex: /}/, onMatch: function(val, state, stack) {
                    return [stack.length ? stack.shift() : val];
                }},
                {regex: /\$(?:\d+|\w+)/, onMatch: TabstopToken},
                {regex: /\$\{[\dA-Z_a-z]+/, onMatch: function(str, state, stack) {
                    var t = TabstopToken(str.substr(1), state, stack);
                    stack.unshift(t[0]);
                    return t;
                }, next: "snippetVar"},
                {regex: /\n/, token: "newline", merge: false}
            ],
            snippetVar: [
                {regex: "\\|" + escape("\\|") + "*\\|", onMatch: function(val, state, stack) {
                    stack[0].choices = val.slice(1, -1).split(",");
                }, next: "start"},
                {regex: "/(" + escape("/") + "+)/(?:(" + escape("/") + "*)/)(\\w*):?",
                 onMatch: function(val, state, stack) {
                    var ts = stack[0];
                    ts.fmtString = val;

                    val = this.splitRegex.exec(val);
                    ts.guard = val[1];
                    ts.fmt = val[2];
                    ts.flag = val[3];
                    return "";
                }, next: "start"},
                {regex: "`" + escape("`") + "*`", onMatch: function(val, state, stack) {
                    stack[0].code = val.splice(1, -1);
                    return "";
                }, next: "start"},
                {regex: "\\?", onMatch: function(val, state, stack) {
                    if (stack[0])
                        stack[0].expectIf = true;
                }, next: "start"},
                {regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start"}
            ],
            formatString: [
                {regex: "/(" + escape("/") + "+)/", token: "regex"},
                {regex: "", onMatch: function(val, state, stack) {
                    stack.inFormatString = true;
                }, next: "start"}
            ]
        });
        SnippetManager.prototype.getTokenizer = function() {
            return SnippetManager.$tokenizer;
        };
        return SnippetManager.$tokenizer;
    };

    this.tokenizeTmSnippet = function(str, startState) {
        return this.getTokenizer().getLineTokens(str, startState).tokens.map(function(x) {
            return x.value || x;
        });
    };

    this.$getDefaultValue = function(editor, name) {
        if (/^[A-Z]\d+$/.test(name)) {
            var i = name.substr(1);
            return (this.variables[name[0] + "__"] || {})[i];
        }
        if (/^\d+$/.test(name)) {
            return (this.variables.__ || {})[name];
        }
        name = name.replace(/^TM_/, "");

        if (!editor)
            return;
        var s = editor.session;
        switch(name) {
            case "CURRENT_WORD":
                var r = s.getWordRange();
            case "SELECTION":
            case "SELECTED_TEXT":
                return s.getTextRange(r);
            case "CURRENT_LINE":
                return s.getLine(editor.getCursorPosition().row);
            case "PREV_LINE": // not possible in textmate
                return s.getLine(editor.getCursorPosition().row - 1);
            case "LINE_INDEX":
                return editor.getCursorPosition().column;
            case "LINE_NUMBER":
                return editor.getCursorPosition().row + 1;
            case "SOFT_TABS":
                return s.getUseSoftTabs() ? "YES" : "NO";
            case "TAB_SIZE":
                return s.getTabSize();
            case "FILENAME":
            case "FILEPATH":
                return "";
            case "FULLNAME":
                return "Ace";
        }
    };
    this.variables = {};
    this.getVariableValue = function(editor, varName) {
        if (this.variables.hasOwnProperty(varName))
            return this.variables[varName](editor, varName) || "";
        return this.$getDefaultValue(editor, varName) || "";
    };
    this.tmStrFormat = function(str, ch, editor) {
        var flag = ch.flag || "";
        var re = ch.guard;
        re = new RegExp(re, flag.replace(/[^gi]/, ""));
        var fmtTokens = this.tokenizeTmSnippet(ch.fmt, "formatString");
        var _self = this;
        var formatted = str.replace(re, function() {
            _self.variables.__ = arguments;
            var fmtParts = _self.resolveVariables(fmtTokens, editor);
            var gChangeCase = "E";
            for (var i  = 0; i < fmtParts.length; i++) {
                var ch = fmtParts[i];
                if (typeof ch == "object") {
                    fmtParts[i] = "";
                    if (ch.changeCase && ch.local) {
                        var next = fmtParts[i + 1];
                        if (next && typeof next == "string") {
                            if (ch.changeCase == "u")
                                fmtParts[i] = next[0].toUpperCase();
                            else
                                fmtParts[i] = next[0].toLowerCase();
                            fmtParts[i + 1] = next.substr(1);
                        }
                    } else if (ch.changeCase) {
                        gChangeCase = ch.changeCase;
                    }
                } else if (gChangeCase == "U") {
                    fmtParts[i] = ch.toUpperCase();
                } else if (gChangeCase == "L") {
                    fmtParts[i] = ch.toLowerCase();
                }
            }
            return fmtParts.join("");
        });
        this.variables.__ = null;
        return formatted;
    };

    this.resolveVariables = function(snippet, editor) {
        var result = [];
        for (var i = 0; i < snippet.length; i++) {
            var ch = snippet[i];
            if (typeof ch == "string") {
                result.push(ch);
            } else if (typeof ch != "object") {
                continue;
            } else if (ch.skip) {
                gotoNext(ch);
            } else if (ch.processed < i) {
                continue;
            } else if (ch.text) {
                var value = this.getVariableValue(editor, ch.text);
                if (value && ch.fmtString)
                    value = this.tmStrFormat(value, ch);
                ch.processed = i;
                if (ch.expectIf == null) {
                    if (value) {
                        result.push(value);
                        gotoNext(ch);
                    }
                } else {
                    if (value) {
                        ch.skip = ch.elseBranch;
                    } else
                        gotoNext(ch);
                }
            } else if (ch.tabstopId != null) {
                result.push(ch);
            } else if (ch.changeCase != null) {
                result.push(ch);
            }
        }
        function gotoNext(ch) {
            var i1 = snippet.indexOf(ch, i + 1);
            if (i1 != -1)
                i = i1;
        }
        return result;
    };

    this.insertSnippetForSelection = function(editor, snippetText) {
        var cursor = editor.getCursorPosition();
        var line = editor.session.getLine(cursor.row);
        var tabString = editor.session.getTabString();
        var indentString = line.match(/^\s*/)[0];
        
        if (cursor.column < indentString.length)
            indentString = indentString.slice(0, cursor.column);

        snippetText = snippetText.replace(/\r/g, "");
        var tokens = this.tokenizeTmSnippet(snippetText);
        tokens = this.resolveVariables(tokens, editor);
        tokens = tokens.map(function(x) {
            if (x == "\n")
                return x + indentString;
            if (typeof x == "string")
                return x.replace(/\t/g, tabString);
            return x;
        });
        var tabstops = [];
        tokens.forEach(function(p, i) {
            if (typeof p != "object")
                return;
            var id = p.tabstopId;
            var ts = tabstops[id];
            if (!ts) {
                ts = tabstops[id] = [];
                ts.index = id;
                ts.value = "";
            }
            if (ts.indexOf(p) !== -1)
                return;
            ts.push(p);
            var i1 = tokens.indexOf(p, i + 1);
            if (i1 === -1)
                return;

            var value = tokens.slice(i + 1, i1);
            var isNested = value.some(function(t) {return typeof t === "object";});
            if (isNested && !ts.value) {
                ts.value = value;
            } else if (value.length && (!ts.value || typeof ts.value !== "string")) {
                ts.value = value.join("");
            }
        });
        tabstops.forEach(function(ts) {ts.length = 0;});
        var expanding = {};
        function copyValue(val) {
            var copy = [];
            for (var i = 0; i < val.length; i++) {
                var p = val[i];
                if (typeof p == "object") {
                    if (expanding[p.tabstopId])
                        continue;
                    var j = val.lastIndexOf(p, i - 1);
                    p = copy[j] || {tabstopId: p.tabstopId};
                }
                copy[i] = p;
            }
            return copy;
        }
        for (var i = 0; i < tokens.length; i++) {
            var p = tokens[i];
            if (typeof p != "object")
                continue;
            var id = p.tabstopId;
            var i1 = tokens.indexOf(p, i + 1);
            if (expanding[id]) {
                if (expanding[id] === p)
                    expanding[id] = null;
                continue;
            }
            
            var ts = tabstops[id];
            var arg = typeof ts.value == "string" ? [ts.value] : copyValue(ts.value);
            arg.unshift(i + 1, Math.max(0, i1 - i));
            arg.push(p);
            expanding[id] = p;
            tokens.splice.apply(tokens, arg);

            if (ts.indexOf(p) === -1)
                ts.push(p);
        }
        var row = 0, column = 0;
        var text = "";
        tokens.forEach(function(t) {
            if (typeof t === "string") {
                var lines = t.split("\n");
                if (lines.length > 1){
                    column = lines[lines.length - 1].length;
                    row += lines.length - 1;
                } else
                    column += t.length;
                text += t;
            } else {
                if (!t.start)
                    t.start = {row: row, column: column};
                else
                    t.end = {row: row, column: column};
            }
        });
        var range = editor.getSelectionRange();
        var end = editor.session.replace(range, text);

        var tabstopManager = new TabstopManager(editor);
        var selectionId = editor.inVirtualSelectionMode && editor.selection.index;
        tabstopManager.addTabstops(tabstops, range.start, end, selectionId);
    };
    
    this.insertSnippet = function(editor, snippetText) {
        var self = this;
        if (editor.inVirtualSelectionMode)
            return self.insertSnippetForSelection(editor, snippetText);
        
        editor.forEachSelection(function() {
            self.insertSnippetForSelection(editor, snippetText);
        }, null, {keepOrder: true});
        
        if (editor.tabstopManager)
            editor.tabstopManager.tabNext();
    };

    this.$getScope = function(editor) {
        var scope = editor.session.$mode.$id || "";
        scope = scope.split("/").pop();
        if (scope === "html" || scope === "php") {
            if (scope === "php" && !editor.session.$mode.inlinePhp) 
                scope = "html";
            var c = editor.getCursorPosition();
            var state = editor.session.getState(c.row);
            if (typeof state === "object") {
                state = state[0];
            }
            if (state.substring) {
                if (state.substring(0, 3) == "js-")
                    scope = "javascript";
                else if (state.substring(0, 4) == "css-")
                    scope = "css";
                else if (state.substring(0, 4) == "php-")
                    scope = "php";
            }
        }
        
        return scope;
    };

    this.getActiveScopes = function(editor) {
        var scope = this.$getScope(editor);
        var scopes = [scope];
        var snippetMap = this.snippetMap;
        if (snippetMap[scope] && snippetMap[scope].includeScopes) {
            scopes.push.apply(scopes, snippetMap[scope].includeScopes);
        }
        scopes.push("_");
        return scopes;
    };

    this.expandWithTab = function(editor, options) {
        var self = this;
        var result = editor.forEachSelection(function() {
            return self.expandSnippetForSelection(editor, options);
        }, null, {keepOrder: true});
        if (result && editor.tabstopManager)
            editor.tabstopManager.tabNext();
        return result;
    };
    
    this.expandSnippetForSelection = function(editor, options) {
        var cursor = editor.getCursorPosition();
        var line = editor.session.getLine(cursor.row);
        var before = line.substring(0, cursor.column);
        var after = line.substr(cursor.column);

        var snippetMap = this.snippetMap;
        var snippet;
        this.getActiveScopes(editor).some(function(scope) {
            var snippets = snippetMap[scope];
            if (snippets)
                snippet = this.findMatchingSnippet(snippets, before, after);
            return !!snippet;
        }, this);
        if (!snippet)
            return false;
        if (options && options.dryRun)
            return true;
        editor.session.doc.removeInLine(cursor.row,
            cursor.column - snippet.replaceBefore.length,
            cursor.column + snippet.replaceAfter.length
        );

        this.variables.M__ = snippet.matchBefore;
        this.variables.T__ = snippet.matchAfter;
        this.insertSnippetForSelection(editor, snippet.content);

        this.variables.M__ = this.variables.T__ = null;
        return true;
    };

    this.findMatchingSnippet = function(snippetList, before, after) {
        for (var i = snippetList.length; i--;) {
            var s = snippetList[i];
            if (s.startRe && !s.startRe.test(before))
                continue;
            if (s.endRe && !s.endRe.test(after))
                continue;
            if (!s.startRe && !s.endRe)
                continue;

            s.matchBefore = s.startRe ? s.startRe.exec(before) : [""];
            s.matchAfter = s.endRe ? s.endRe.exec(after) : [""];
            s.replaceBefore = s.triggerRe ? s.triggerRe.exec(before)[0] : "";
            s.replaceAfter = s.endTriggerRe ? s.endTriggerRe.exec(after)[0] : "";
            return s;
        }
    };

    this.snippetMap = {};
    this.snippetNameMap = {};
    this.register = function(snippets, scope) {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;
        var self = this;
        
        if (!snippets) 
            snippets = [];
        
        function wrapRegexp(src) {
            if (src && !/^\^?\(.*\)\$?$|^\\b$/.test(src))
                src = "(?:" + src + ")";

            return src || "";
        }
        function guardedRegexp(re, guard, opening) {
            re = wrapRegexp(re);
            guard = wrapRegexp(guard);
            if (opening) {
                re = guard + re;
                if (re && re[re.length - 1] != "$")
                    re = re + "$";
            } else {
                re = re + guard;
                if (re && re[0] != "^")
                    re = "^" + re;
            }
            return new RegExp(re);
        }

        function addSnippet(s) {
            if (!s.scope)
                s.scope = scope || "_";
            scope = s.scope;
            if (!snippetMap[scope]) {
                snippetMap[scope] = [];
                snippetNameMap[scope] = {};
            }

            var map = snippetNameMap[scope];
            if (s.name) {
                var old = map[s.name];
                if (old)
                    self.unregister(old);
                map[s.name] = s;
            }
            snippetMap[scope].push(s);

            if (s.tabTrigger && !s.trigger) {
                if (!s.guard && /^\w/.test(s.tabTrigger))
                    s.guard = "\\b";
                s.trigger = lang.escapeRegExp(s.tabTrigger);
            }
            
            if (!s.trigger && !s.guard && !s.endTrigger && !s.endGuard)
                return;
            
            s.startRe = guardedRegexp(s.trigger, s.guard, true);
            s.triggerRe = new RegExp(s.trigger);

            s.endRe = guardedRegexp(s.endTrigger, s.endGuard, true);
            s.endTriggerRe = new RegExp(s.endTrigger);
        }

        if (snippets && snippets.content)
            addSnippet(snippets);
        else if (Array.isArray(snippets))
            snippets.forEach(addSnippet);
        
        this._signal("registerSnippets", {scope: scope});
    };
    this.unregister = function(snippets, scope) {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;

        function removeSnippet(s) {
            var nameMap = snippetNameMap[s.scope||scope];
            if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                var map = snippetMap[s.scope||scope];
                var i = map && map.indexOf(s);
                if (i >= 0)
                    map.splice(i, 1);
            }
        }
        if (snippets.content)
            removeSnippet(snippets);
        else if (Array.isArray(snippets))
            snippets.forEach(removeSnippet);
    };
    this.parseSnippetFile = function(str) {
        str = str.replace(/\r/g, "");
        var list = [], snippet = {};
        var re = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
        var m;
        while (m = re.exec(str)) {
            if (m[1]) {
                try {
                    snippet = JSON.parse(m[1]);
                    list.push(snippet);
                } catch (e) {}
            } if (m[4]) {
                snippet.content = m[4].replace(/^\t/gm, "");
                list.push(snippet);
                snippet = {};
            } else {
                var key = m[2], val = m[3];
                if (key == "regex") {
                    var guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
                    snippet.guard = guardRe.exec(val)[1];
                    snippet.trigger = guardRe.exec(val)[1];
                    snippet.endTrigger = guardRe.exec(val)[1];
                    snippet.endGuard = guardRe.exec(val)[1];
                } else if (key == "snippet") {
                    snippet.tabTrigger = val.match(/^\S*/)[0];
                    if (!snippet.name)
                        snippet.name = val;
                } else {
                    snippet[key] = val;
                }
            }
        }
        return list;
    };
    this.getSnippetByName = function(name, editor) {
        var snippetMap = this.snippetNameMap;
        var snippet;
        this.getActiveScopes(editor).some(function(scope) {
            var snippets = snippetMap[scope];
            if (snippets)
                snippet = snippets[name];
            return !!snippet;
        }, this);
        return snippet;
    };

}).call(SnippetManager.prototype);


var TabstopManager = function(editor) {
    if (editor.tabstopManager)
        return editor.tabstopManager;
    editor.tabstopManager = this;
    this.$onChange = this.onChange.bind(this);
    this.$onChangeSelection = lang.delayedCall(this.onChangeSelection.bind(this)).schedule;
    this.$onChangeSession = this.onChangeSession.bind(this);
    this.$onAfterExec = this.onAfterExec.bind(this);
    this.attach(editor);
};
(function() {
    this.attach = function(editor) {
        this.index = 0;
        this.ranges = [];
        this.tabstops = [];
        this.$openTabstops = null;
        this.selectedTabstop = null;

        this.editor = editor;
        this.editor.on("change", this.$onChange);
        this.editor.on("changeSelection", this.$onChangeSelection);
        this.editor.on("changeSession", this.$onChangeSession);
        this.editor.commands.on("afterExec", this.$onAfterExec);
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    };
    this.detach = function() {
        this.tabstops.forEach(this.removeTabstopMarkers, this);
        this.ranges = null;
        this.tabstops = null;
        this.selectedTabstop = null;
        this.editor.removeListener("change", this.$onChange);
        this.editor.removeListener("changeSelection", this.$onChangeSelection);
        this.editor.removeListener("changeSession", this.$onChangeSession);
        this.editor.commands.removeListener("afterExec", this.$onAfterExec);
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.tabstopManager = null;
        this.editor = null;
    };

    this.onChange = function(delta) {
        var changeRange = delta;
        var isRemove = delta.action[0] == "r";
        var start = delta.start;
        var end = delta.end;
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;
        var colDiff = end.column - start.column;

        if (isRemove) {
            lineDif = -lineDif;
            colDiff = -colDiff;
        }
        if (!this.$inChange && isRemove) {
            var ts = this.selectedTabstop;
            var changedOutside = ts && !ts.some(function(r) {
                return comparePoints(r.start, start) <= 0 && comparePoints(r.end, end) >= 0;
            });
            if (changedOutside)
                return this.detach();
        }
        var ranges = this.ranges;
        for (var i = 0; i < ranges.length; i++) {
            var r = ranges[i];
            if (r.end.row < start.row)
                continue;

            if (isRemove && comparePoints(start, r.start) < 0 && comparePoints(end, r.end) > 0) {
                this.removeRange(r);
                i--;
                continue;
            }

            if (r.start.row == startRow && r.start.column > start.column)
                r.start.column += colDiff;
            if (r.end.row == startRow && r.end.column >= start.column)
                r.end.column += colDiff;
            if (r.start.row >= startRow)
                r.start.row += lineDif;
            if (r.end.row >= startRow)
                r.end.row += lineDif;

            if (comparePoints(r.start, r.end) > 0)
                this.removeRange(r);
        }
        if (!ranges.length)
            this.detach();
    };
    this.updateLinkedFields = function() {
        var ts = this.selectedTabstop;
        if (!ts || !ts.hasLinkedRanges)
            return;
        this.$inChange = true;
        var session = this.editor.session;
        var text = session.getTextRange(ts.firstNonLinked);
        for (var i = ts.length; i--;) {
            var range = ts[i];
            if (!range.linked)
                continue;
            var fmt = exports.snippetManager.tmStrFormat(text, range.original);
            session.replace(range, fmt);
        }
        this.$inChange = false;
    };
    this.onAfterExec = function(e) {
        if (e.command && !e.command.readOnly)
            this.updateLinkedFields();
    };
    this.onChangeSelection = function() {
        if (!this.editor)
            return;
        var lead = this.editor.selection.lead;
        var anchor = this.editor.selection.anchor;
        var isEmpty = this.editor.selection.isEmpty();
        for (var i = this.ranges.length; i--;) {
            if (this.ranges[i].linked)
                continue;
            var containsLead = this.ranges[i].contains(lead.row, lead.column);
            var containsAnchor = isEmpty || this.ranges[i].contains(anchor.row, anchor.column);
            if (containsLead && containsAnchor)
                return;
        }
        this.detach();
    };
    this.onChangeSession = function() {
        this.detach();
    };
    this.tabNext = function(dir) {
        var max = this.tabstops.length;
        var index = this.index + (dir || 1);
        index = Math.min(Math.max(index, 1), max);
        if (index == max)
            index = 0;
        this.selectTabstop(index);
        if (index === 0)
            this.detach();
    };
    this.selectTabstop = function(index) {
        this.$openTabstops = null;
        var ts = this.tabstops[this.index];
        if (ts)
            this.addTabstopMarkers(ts);
        this.index = index;
        ts = this.tabstops[this.index];
        if (!ts || !ts.length)
            return;
        
        this.selectedTabstop = ts;
        if (!this.editor.inVirtualSelectionMode) {        
            var sel = this.editor.multiSelect;
            sel.toSingleRange(ts.firstNonLinked.clone());
            for (var i = ts.length; i--;) {
                if (ts.hasLinkedRanges && ts[i].linked)
                    continue;
                sel.addRange(ts[i].clone(), true);
            }
            if (sel.ranges[0])
                sel.addRange(sel.ranges[0].clone());
        } else {
            this.editor.selection.setRange(ts.firstNonLinked);
        }
        
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    };
    this.addTabstops = function(tabstops, start, end) {
        if (!this.$openTabstops)
            this.$openTabstops = [];
        if (!tabstops[0]) {
            var p = Range.fromPoints(end, end);
            moveRelative(p.start, start);
            moveRelative(p.end, start);
            tabstops[0] = [p];
            tabstops[0].index = 0;
        }

        var i = this.index;
        var arg = [i + 1, 0];
        var ranges = this.ranges;
        tabstops.forEach(function(ts, index) {
            var dest = this.$openTabstops[index] || ts;
                
            for (var i = ts.length; i--;) {
                var p = ts[i];
                var range = Range.fromPoints(p.start, p.end || p.start);
                movePoint(range.start, start);
                movePoint(range.end, start);
                range.original = p;
                range.tabstop = dest;
                ranges.push(range);
                if (dest != ts)
                    dest.unshift(range);
                else
                    dest[i] = range;
                if (p.fmtString) {
                    range.linked = true;
                    dest.hasLinkedRanges = true;
                } else if (!dest.firstNonLinked)
                    dest.firstNonLinked = range;
            }
            if (!dest.firstNonLinked)
                dest.hasLinkedRanges = false;
            if (dest === ts) {
                arg.push(dest);
                this.$openTabstops[index] = dest;
            }
            this.addTabstopMarkers(dest);
        }, this);
        
        if (arg.length > 2) {
            if (this.tabstops.length)
                arg.push(arg.splice(2, 1)[0]);
            this.tabstops.splice.apply(this.tabstops, arg);
        }
    };

    this.addTabstopMarkers = function(ts) {
        var session = this.editor.session;
        ts.forEach(function(range) {
            if  (!range.markerId)
                range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
        });
    };
    this.removeTabstopMarkers = function(ts) {
        var session = this.editor.session;
        ts.forEach(function(range) {
            session.removeMarker(range.markerId);
            range.markerId = null;
        });
    };
    this.removeRange = function(range) {
        var i = range.tabstop.indexOf(range);
        range.tabstop.splice(i, 1);
        i = this.ranges.indexOf(range);
        this.ranges.splice(i, 1);
        this.editor.session.removeMarker(range.markerId);
        if (!range.tabstop.length) {
            i = this.tabstops.indexOf(range.tabstop);
            if (i != -1)
                this.tabstops.splice(i, 1);
            if (!this.tabstops.length)
                this.detach();
        }
    };

    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys({
        "Tab": function(ed) {
            if (exports.snippetManager && exports.snippetManager.expandWithTab(ed)) {
                return;
            }

            ed.tabstopManager.tabNext(1);
        },
        "Shift-Tab": function(ed) {
            ed.tabstopManager.tabNext(-1);
        },
        "Esc": function(ed) {
            ed.tabstopManager.detach();
        },
        "Return": function(ed) {
            return false;
        }
    });
}).call(TabstopManager.prototype);



var changeTracker = {};
changeTracker.onChange = Anchor.prototype.onChange;
changeTracker.setPosition = function(row, column) {
    this.pos.row = row;
    this.pos.column = column;
};
changeTracker.update = function(pos, delta, $insertRight) {
    this.$insertRight = $insertRight;
    this.pos = pos; 
    this.onChange(delta);
};

var movePoint = function(point, diff) {
    if (point.row == 0)
        point.column += diff.column;
    point.row += diff.row;
};

var moveRelative = function(point, start) {
    if (point.row == start.row)
        point.column -= start.column;
    point.row -= start.row;
};


require("./lib/dom").importCssString("\
.ace_snippet-marker {\
    -moz-box-sizing: border-box;\
    box-sizing: border-box;\
    background: rgba(194, 193, 208, 0.09);\
    border: 1px dotted rgba(211, 208, 235, 0.62);\
    position: absolute;\
}");

exports.snippetManager = new SnippetManager();


var Editor = require("./editor").Editor;
(function() {
    this.insertSnippet = function(content, options) {
        return exports.snippetManager.insertSnippet(this, content, options);
    };
    this.expandSnippet = function(options) {
        return exports.snippetManager.expandWithTab(this, options);
    };
}).call(Editor.prototype);

});

ace.define("ace/autocomplete/popup",["require","exports","module","ace/virtual_renderer","ace/editor","ace/range","ace/lib/event","ace/lib/lang","ace/lib/dom"], function(require, exports, module) {
"use strict";

var Renderer = require("../virtual_renderer").VirtualRenderer;
var Editor = require("../editor").Editor;
var Range = require("../range").Range;
var event = require("../lib/event");
var lang = require("../lib/lang");
var dom = require("../lib/dom");

var $singleLineEditor = function(el) {
    var renderer = new Renderer(el);

    renderer.$maxLines = 4;

    var editor = new Editor(renderer);

    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setHighlightGutterLine(false);

    editor.$mouseHandler.$focusTimeout = 0;
    editor.$highlightTagPending = true;

    return editor;
};

var AcePopup = function(parentNode) {
    var el = dom.createElement("div");
    var popup = new $singleLineEditor(el);

    if (parentNode)
        parentNode.appendChild(el);
    el.style.display = "none";
    popup.renderer.content.style.cursor = "default";
    popup.renderer.setStyle("ace_autocomplete");

    popup.setOption("displayIndentGuides", false);
    popup.setOption("dragDelay", 150);

    var noop = function(){};

    popup.focus = noop;
    popup.$isFocused = true;

    popup.renderer.$cursorLayer.restartTimer = noop;
    popup.renderer.$cursorLayer.element.style.opacity = 0;

    popup.renderer.$maxLines = 8;
    popup.renderer.$keepTextAreaAtCursor = false;

    popup.setHighlightActiveLine(false);
    popup.session.highlight("");
    popup.session.$searchHighlight.clazz = "ace_highlight-marker";

    popup.on("mousedown", function(e) {
        var pos = e.getDocumentPosition();
        popup.selection.moveToPosition(pos);
        selectionMarker.start.row = selectionMarker.end.row = pos.row;
        e.stop();
    });

    var lastMouseEvent;
    var hoverMarker = new Range(-1,0,-1,Infinity);
    var selectionMarker = new Range(-1,0,-1,Infinity);
    selectionMarker.id = popup.session.addMarker(selectionMarker, "ace_active-line", "fullLine");
    popup.setSelectOnHover = function(val) {
        if (!val) {
            hoverMarker.id = popup.session.addMarker(hoverMarker, "ace_line-hover", "fullLine");
        } else if (hoverMarker.id) {
            popup.session.removeMarker(hoverMarker.id);
            hoverMarker.id = null;
        }
    };
    popup.setSelectOnHover(false);
    popup.on("mousemove", function(e) {
        if (!lastMouseEvent) {
            lastMouseEvent = e;
            return;
        }
        if (lastMouseEvent.x == e.x && lastMouseEvent.y == e.y) {
            return;
        }
        lastMouseEvent = e;
        lastMouseEvent.scrollTop = popup.renderer.scrollTop;
        var row = lastMouseEvent.getDocumentPosition().row;
        if (hoverMarker.start.row != row) {
            if (!hoverMarker.id)
                popup.setRow(row);
            setHoverMarker(row);
        }
    });
    popup.renderer.on("beforeRender", function() {
        if (lastMouseEvent && hoverMarker.start.row != -1) {
            lastMouseEvent.$pos = null;
            var row = lastMouseEvent.getDocumentPosition().row;
            if (!hoverMarker.id)
                popup.setRow(row);
            setHoverMarker(row, true);
        }
    });
    popup.renderer.on("afterRender", function() {
        var row = popup.getRow();
        var t = popup.renderer.$textLayer;
        var selected = t.element.childNodes[row - t.config.firstRow];
        if (selected !== t.selectedNode && t.selectedNode)
            dom.removeCssClass(t.selectedNode, "ace_selected");
        t.selectedNode = selected;
        if (selected)
            dom.addCssClass(selected, "ace_selected");
    });
    var hideHoverMarker = function() { setHoverMarker(-1); };
    var setHoverMarker = function(row, suppressRedraw) {
        if (row !== hoverMarker.start.row) {
            hoverMarker.start.row = hoverMarker.end.row = row;
            if (!suppressRedraw)
                popup.session._emit("changeBackMarker");
            popup._emit("changeHoverMarker");
        }
    };
    popup.getHoveredRow = function() {
        return hoverMarker.start.row;
    };

    event.addListener(popup.container, "mouseout", hideHoverMarker);
    popup.on("hide", hideHoverMarker);
    popup.on("changeSelection", hideHoverMarker);

    popup.session.doc.getLength = function() {
        return popup.data.length;
    };
    popup.session.doc.getLine = function(i) {
        var data = popup.data[i];
        if (typeof data == "string")
            return data;
        return (data && data.value) || "";
    };

    var bgTokenizer = popup.session.bgTokenizer;
    bgTokenizer.$tokenizeRow = function(row) {
        var data = popup.data[row];
        var tokens = [];
        if (!data)
            return tokens;
        if (typeof data == "string")
            data = {value: data};
        var caption = data.caption || data.value || data.name;

        function addToken(value, className) {
            value && tokens.push({
                type: (data.className || "") + (className || ""), 
                value: value
            });
        }
        
        var lower = caption.toLowerCase();
        var filterText = (popup.filterText || "").toLowerCase();
        var lastIndex = 0;
        var lastI = 0;
        for (var i = 0; i <= filterText.length; i++) {
            if (i != lastI && (data.matchMask & (1 << i) || i == filterText.length)) {
                var sub = filterText.slice(lastI, i);
                lastI = i;
                var index = lower.indexOf(sub, lastIndex);
                if (index == -1) continue;
                addToken(caption.slice(lastIndex, index), "");
                lastIndex = index + sub.length;
                addToken(caption.slice(index, lastIndex), "completion-highlight");
            }
        }
        addToken(caption.slice(lastIndex, caption.length), "");
        
        if (data.meta)
            tokens.push({type: "completion-meta", value: data.meta});

        return tokens;
    };
    bgTokenizer.$updateOnChange = noop;
    bgTokenizer.start = noop;

    popup.session.$computeWidth = function() {
        return this.screenWidth = 0;
    };
    popup.isOpen = false;
    popup.isTopdown = false;
    popup.autoSelect = true;
    popup.filterText = "";

    popup.data = [];
    popup.setData = function(list, filterText) {
        popup.filterText = filterText || "";
        popup.setValue(lang.stringRepeat("\n", list.length), -1);
        popup.data = list || [];
        popup.setRow(0);
    };
    popup.getData = function(row) {
        return popup.data[row];
    };

    popup.getRow = function() {
        return selectionMarker.start.row;
    };
    popup.setRow = function(line) {
        line = Math.max(this.autoSelect ? 0 : -1, Math.min(this.data.length, line));
        if (selectionMarker.start.row != line) {
            popup.selection.clearSelection();
            selectionMarker.start.row = selectionMarker.end.row = line || 0;
            popup.session._emit("changeBackMarker");
            popup.moveCursorTo(line || 0, 0);
            if (popup.isOpen)
                popup._signal("select");
        }
    };

    popup.on("changeSelection", function() {
        if (popup.isOpen)
            popup.setRow(popup.selection.lead.row);
        popup.renderer.scrollCursorIntoView();
    });

    popup.hide = function() {
        this.container.style.display = "none";
        this._signal("hide");
        popup.isOpen = false;
    };
    popup.show = function(pos, lineHeight, topdownOnly) {
        var el = this.container;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        var renderer = this.renderer;
        var maxH = renderer.$maxLines * lineHeight * 1.4;
        var top = pos.top + this.$borderSize;
        var allowTopdown = top > screenHeight / 2 && !topdownOnly;
        if (allowTopdown && top + lineHeight + maxH > screenHeight) {
            renderer.$maxPixelHeight = top - 2 * this.$borderSize;
            el.style.top = "";
            el.style.bottom = screenHeight - top + "px";
            popup.isTopdown = false;
        } else {
            top += lineHeight;
            renderer.$maxPixelHeight = screenHeight - top - 0.2 * lineHeight;
            el.style.top = top + "px";
            el.style.bottom = "";
            popup.isTopdown = true;
        }

        el.style.display = "";

        var left = pos.left;
        if (left + el.offsetWidth > screenWidth)
            left = screenWidth - el.offsetWidth;

        el.style.left = left + "px";

        this._signal("show");
        lastMouseEvent = null;
        popup.isOpen = true;
    };

    popup.getTextLeftOffset = function() {
        return this.$borderSize + this.renderer.$padding + this.$imageSize;
    };

    popup.$imageSize = 0;
    popup.$borderSize = 1;

    return popup;
};

dom.importCssString("\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #CAD6FA;\
    z-index: 1;\
}\
.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #3a674e;\
}\
.ace_editor.ace_autocomplete .ace_line-hover {\
    border: 1px solid #abbffe;\
    margin-top: -1px;\
    background: rgba(233,233,253,0.4);\
    position: absolute;\
    z-index: 2;\
}\
.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {\
    border: 1px solid rgba(109, 150, 13, 0.8);\
    background: rgba(58, 103, 78, 0.62);\
}\
.ace_completion-meta {\
    opacity: 0.5;\
    margin: 0.9em;\
}\
.ace_editor.ace_autocomplete .ace_completion-highlight{\
    color: #2d69c7;\
}\
.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{\
    color: #93ca12;\
}\
.ace_editor.ace_autocomplete {\
    width: 300px;\
    z-index: 200000;\
    border: 1px lightgray solid;\
    position: fixed;\
    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\
    line-height: 1.4;\
    background: #fefefe;\
    color: #111;\
}\
.ace_dark.ace_editor.ace_autocomplete {\
    border: 1px #484747 solid;\
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.51);\
    line-height: 1.4;\
    background: #25282c;\
    color: #c1c1c1;\
}", "autocompletion.css");

exports.AcePopup = AcePopup;

});

ace.define("ace/autocomplete/util",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.parForEach = function(array, fn, callback) {
    var completed = 0;
    var arLength = array.length;
    if (arLength === 0)
        callback();
    for (var i = 0; i < arLength; i++) {
        fn(array[i], function(result, err) {
            completed++;
            if (completed === arLength)
                callback(result, err);
        });
    }
};

var ID_REGEX = /[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/;

exports.retrievePrecedingIdentifier = function(text, pos, regex) {
    regex = regex || ID_REGEX;
    var buf = [];
    for (var i = pos-1; i >= 0; i--) {
        if (regex.test(text[i]))
            buf.push(text[i]);
        else
            break;
    }
    return buf.reverse().join("");
};

exports.retrieveFollowingIdentifier = function(text, pos, regex) {
    regex = regex || ID_REGEX;
    var buf = [];
    for (var i = pos; i < text.length; i++) {
        if (regex.test(text[i]))
            buf.push(text[i]);
        else
            break;
    }
    return buf;
};

exports.getCompletionPrefix = function (editor) {
    var pos = editor.getCursorPosition();
    var line = editor.session.getLine(pos.row);
    var prefix;
    editor.completers.forEach(function(completer) {
        if (completer.identifierRegexps) {
            completer.identifierRegexps.forEach(function(identifierRegex) {
                if (!prefix && identifierRegex)
                    prefix = this.retrievePrecedingIdentifier(line, pos.column, identifierRegex);
            }.bind(this));
        }
    }.bind(this));
    return prefix || this.retrievePrecedingIdentifier(line, pos.column);
};

});

ace.define("ace/autocomplete",["require","exports","module","ace/keyboard/hash_handler","ace/autocomplete/popup","ace/autocomplete/util","ace/lib/event","ace/lib/lang","ace/lib/dom","ace/snippets"], function(require, exports, module) {
"use strict";

var HashHandler = require("./keyboard/hash_handler").HashHandler;
var AcePopup = require("./autocomplete/popup").AcePopup;
var util = require("./autocomplete/util");
var event = require("./lib/event");
var lang = require("./lib/lang");
var dom = require("./lib/dom");
var snippetManager = require("./snippets").snippetManager;

var Autocomplete = function() {
    this.autoInsert = false;
    this.autoSelect = true;
    this.exactMatch = false;
    this.gatherCompletionsId = 0;
    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys(this.commands);

    this.blurListener = this.blurListener.bind(this);
    this.changeListener = this.changeListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);

    this.changeTimer = lang.delayedCall(function() {
        this.updateCompletions(true);
    }.bind(this));

    this.tooltipTimer = lang.delayedCall(this.updateDocTooltip.bind(this), 50);
};

(function() {

    this.$init = function() {
        this.popup = new AcePopup(document.body || document.documentElement);
        this.popup.on("click", function(e) {
            this.insertMatch();
            e.stop();
        }.bind(this));
        this.popup.focus = this.editor.focus.bind(this.editor);
        this.popup.on("show", this.tooltipTimer.bind(null, null));
        this.popup.on("select", this.tooltipTimer.bind(null, null));
        this.popup.on("changeHoverMarker", this.tooltipTimer.bind(null, null));
        return this.popup;
    };

    this.getPopup = function() {
        return this.popup || this.$init();
    };

    this.openPopup = function(editor, prefix, keepPopupPosition) {
        if (!this.popup)
            this.$init();

        this.popup.autoSelect = this.autoSelect;

        this.popup.setData(this.completions.filtered, this.completions.filterText);

        editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        
        var renderer = editor.renderer;
        this.popup.setRow(this.autoSelect ? 0 : -1);
        if (!keepPopupPosition) {
            this.popup.setTheme(editor.getTheme());
            this.popup.setFontSize(editor.getFontSize());

            var lineHeight = renderer.layerConfig.lineHeight;

            var pos = renderer.$cursorLayer.getPixelPosition(this.base, true);
            pos.left -= this.popup.getTextLeftOffset();

            var rect = editor.container.getBoundingClientRect();
            pos.top += rect.top - renderer.layerConfig.offset;
            pos.left += rect.left - editor.renderer.scrollLeft;
            pos.left += renderer.gutterWidth;

            this.popup.show(pos, lineHeight);
        } else if (keepPopupPosition && !prefix) {
            this.detach();
        }
    };

    this.detach = function() {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.off("changeSelection", this.changeListener);
        this.editor.off("blur", this.blurListener);
        this.editor.off("mousedown", this.mousedownListener);
        this.editor.off("mousewheel", this.mousewheelListener);
        this.changeTimer.cancel();
        this.hideDocTooltip();

        this.gatherCompletionsId += 1;
        if (this.popup && this.popup.isOpen)
            this.popup.hide();

        if (this.base)
            this.base.detach();
        this.activated = false;
        this.completions = this.base = null;
    };

    this.changeListener = function(e) {
        var cursor = this.editor.selection.lead;
        if (cursor.row != this.base.row || cursor.column < this.base.column) {
            this.detach();
        }
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    };

    this.blurListener = function(e) {
        var el = document.activeElement;
        var text = this.editor.textInput.getElement();
        var fromTooltip = e.relatedTarget && this.tooltipNode && this.tooltipNode.contains(e.relatedTarget);
        var container = this.popup && this.popup.container;
        if (el != text && el.parentNode != container && !fromTooltip
            && el != this.tooltipNode && e.relatedTarget != text
        ) {
            this.detach();
        }
    };

    this.mousedownListener = function(e) {
        this.detach();
    };

    this.mousewheelListener = function(e) {
        this.detach();
    };

    this.goTo = function(where) {
        var row = this.popup.getRow();
        var max = this.popup.session.getLength() - 1;

        switch(where) {
            case "up": row = row <= 0 ? max : row - 1; break;
            case "down": row = row >= max ? -1 : row + 1; break;
            case "start": row = 0; break;
            case "end": row = max; break;
        }

        this.popup.setRow(row);
    };

    this.insertMatch = function(data, options) {
        if (!data)
            data = this.popup.getData(this.popup.getRow());
        if (!data)
            return false;

        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(this.editor, data);
        } else {
            if (this.completions.filterText) {
                var ranges = this.editor.selection.getAllRanges();
                for (var i = 0, range; range = ranges[i]; i++) {
                    range.start.column -= this.completions.filterText.length;
                    this.editor.session.remove(range);
                }
            }
            if (data.snippet)
                snippetManager.insertSnippet(this.editor, data.snippet);
            else
                this.editor.execCommand("insertstring", data.value || data);
        }
        this.detach();
    };


    this.commands = {
        "Up": function(editor) { editor.completer.goTo("up"); },
        "Down": function(editor) { editor.completer.goTo("down"); },
        "Ctrl-Up|Ctrl-Home": function(editor) { editor.completer.goTo("start"); },
        "Ctrl-Down|Ctrl-End": function(editor) { editor.completer.goTo("end"); },

        "Esc": function(editor) { editor.completer.detach(); },
        "Return": function(editor) { return editor.completer.insertMatch(); },
        "Shift-Return": function(editor) { editor.completer.insertMatch(null, {deleteSuffix: true}); },
        "Tab": function(editor) {
            var result = editor.completer.insertMatch();
            if (!result && !editor.tabstopManager)
                editor.completer.goTo("down");
            else
                return result;
        },

        "PageUp": function(editor) { editor.completer.popup.gotoPageUp(); },
        "PageDown": function(editor) { editor.completer.popup.gotoPageDown(); }
    };

    this.gatherCompletions = function(editor, callback) {
        var session = editor.getSession();
        var pos = editor.getCursorPosition();

        var prefix = util.getCompletionPrefix(editor);

        this.base = session.doc.createAnchor(pos.row, pos.column - prefix.length);
        this.base.$insertRight = true;

        var matches = [];
        var total = editor.completers.length;
        editor.completers.forEach(function(completer, i) {
            completer.getCompletions(editor, session, pos, prefix, function(err, results) {
                if (!err && results)
                    matches = matches.concat(results);
                callback(null, {
                    prefix: util.getCompletionPrefix(editor),
                    matches: matches,
                    finished: (--total === 0)
                });
            });
        });
        return true;
    };

    this.showPopup = function(editor) {
        if (this.editor)
            this.detach();

        this.activated = true;

        this.editor = editor;
        if (editor.completer != this) {
            if (editor.completer)
                editor.completer.detach();
            editor.completer = this;
        }

        editor.on("changeSelection", this.changeListener);
        editor.on("blur", this.blurListener);
        editor.on("mousedown", this.mousedownListener);
        editor.on("mousewheel", this.mousewheelListener);

        this.updateCompletions();
    };

    this.updateCompletions = function(keepPopupPosition) {
        if (keepPopupPosition && this.base && this.completions) {
            var pos = this.editor.getCursorPosition();
            var prefix = this.editor.session.getTextRange({start: this.base, end: pos});
            if (prefix == this.completions.filterText)
                return;
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();
            if (this.completions.filtered.length == 1
            && this.completions.filtered[0].value == prefix
            && !this.completions.filtered[0].snippet)
                return this.detach();
            this.openPopup(this.editor, prefix, keepPopupPosition);
            return;
        }
        var _id = this.gatherCompletionsId;
        this.gatherCompletions(this.editor, function(err, results) {
            var detachIfFinished = function() {
                if (!results.finished) return;
                return this.detach();
            }.bind(this);

            var prefix = results.prefix;
            var matches = results && results.matches;

            if (!matches || !matches.length)
                return detachIfFinished();
            if (prefix.indexOf(results.prefix) !== 0 || _id != this.gatherCompletionsId)
                return;

            this.completions = new FilteredList(matches);

            if (this.exactMatch)
                this.completions.exactMatch = true;

            this.completions.setFilter(prefix);
            var filtered = this.completions.filtered;
            if (!filtered.length)
                return detachIfFinished();
            if (filtered.length == 1 && filtered[0].value == prefix && !filtered[0].snippet)
                return detachIfFinished();
            if (this.autoInsert && filtered.length == 1 && results.finished)
                return this.insertMatch(filtered[0]);

            this.openPopup(this.editor, prefix, keepPopupPosition);
        }.bind(this));
    };

    this.cancelContextMenu = function() {
        this.editor.$mouseHandler.cancelContextMenu();
    };

    this.updateDocTooltip = function() {
        var popup = this.popup;
        var all = popup.data;
        var selected = all && (all[popup.getHoveredRow()] || all[popup.getRow()]);
        var doc = null;
        if (!selected || !this.editor || !this.popup.isOpen)
            return this.hideDocTooltip();
        this.editor.completers.some(function(completer) {
            if (completer.getDocTooltip)
                doc = completer.getDocTooltip(selected);
            return doc;
        });
        if (!doc)
            doc = selected;

        if (typeof doc == "string")
            doc = {docText: doc};
        if (!doc || !(doc.docHTML || doc.docText))
            return this.hideDocTooltip();
        this.showDocTooltip(doc);
    };

    this.showDocTooltip = function(item) {
        if (!this.tooltipNode) {
            this.tooltipNode = dom.createElement("div");
            this.tooltipNode.className = "ace_tooltip ace_doc-tooltip";
            this.tooltipNode.style.margin = 0;
            this.tooltipNode.style.pointerEvents = "auto";
            this.tooltipNode.tabIndex = -1;
            this.tooltipNode.onblur = this.blurListener.bind(this);
            this.tooltipNode.onclick = this.onTooltipClick.bind(this);
        }

        var tooltipNode = this.tooltipNode;
        if (item.docHTML) {
            tooltipNode.innerHTML = item.docHTML;
        } else if (item.docText) {
            tooltipNode.textContent = item.docText;
        }

        if (!tooltipNode.parentNode)
            document.body.appendChild(tooltipNode);
        var popup = this.popup;
        var rect = popup.container.getBoundingClientRect();
        tooltipNode.style.top = popup.container.style.top;
        tooltipNode.style.bottom = popup.container.style.bottom;

        tooltipNode.style.display = "block";
        if (window.innerWidth - rect.right < 320) {
            if (rect.left < 320) {
                if(popup.isTopdown) {
                    tooltipNode.style.top = rect.bottom + "px";
                    tooltipNode.style.left = rect.left + "px";
                    tooltipNode.style.right = "";
                    tooltipNode.style.bottom = "";
                } else {
                    tooltipNode.style.top = popup.container.offsetTop - tooltipNode.offsetHeight + "px";
                    tooltipNode.style.left = rect.left + "px";
                    tooltipNode.style.right = "";
                    tooltipNode.style.bottom = "";
                }
            } else {
                tooltipNode.style.right = window.innerWidth - rect.left + "px";
                tooltipNode.style.left = "";
            }
        } else {
            tooltipNode.style.left = (rect.right + 1) + "px";
            tooltipNode.style.right = "";
        }
    };

    this.hideDocTooltip = function() {
        this.tooltipTimer.cancel();
        if (!this.tooltipNode) return;
        var el = this.tooltipNode;
        if (!this.editor.isFocused() && document.activeElement == el)
            this.editor.focus();
        this.tooltipNode = null;
        if (el.parentNode)
            el.parentNode.removeChild(el);
    };
    
    this.onTooltipClick = function(e) {
        var a = e.target;
        while (a && a != this.tooltipNode) {
            if (a.nodeName == "A" && a.href) {
                a.rel = "noreferrer";
                a.target = "_blank";
                break;
            }
            a = a.parentNode;
        }
    };

}).call(Autocomplete.prototype);

Autocomplete.startCommand = {
    name: "startAutocomplete",
    exec: function(editor) {
        if (!editor.completer)
            editor.completer = new Autocomplete();
        editor.completer.autoInsert = false;
        editor.completer.autoSelect = true;
        editor.completer.showPopup(editor);
        editor.completer.cancelContextMenu();
    },
    bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
};

var FilteredList = function(array, filterText) {
    this.all = array;
    this.filtered = array;
    this.filterText = filterText || "";
    this.exactMatch = false;
};
(function(){
    this.setFilter = function(str) {
        if (str.length > this.filterText && str.lastIndexOf(this.filterText, 0) === 0)
            var matches = this.filtered;
        else
            var matches = this.all;

        this.filterText = str;
        matches = this.filterCompletions(matches, this.filterText);
        matches = matches.sort(function(a, b) {
            return b.exactMatch - a.exactMatch || b.$score - a.$score 
                || (a.caption || a.value) < (b.caption || b.value);
        });
        var prev = null;
        matches = matches.filter(function(item){
            var caption = item.snippet || item.caption || item.value;
            if (caption === prev) return false;
            prev = caption;
            return true;
        });

        this.filtered = matches;
    };
    this.filterCompletions = function(items, needle) {
        var results = [];
        var upper = needle.toUpperCase();
        var lower = needle.toLowerCase();
        loop: for (var i = 0, item; item = items[i]; i++) {
            var caption = item.caption || item.value || item.snippet;
            if (!caption) continue;
            var lastIndex = -1;
            var matchMask = 0;
            var penalty = 0;
            var index, distance;

            if (this.exactMatch) {
                if (needle !== caption.substr(0, needle.length))
                    continue loop;
            } else {
                var fullMatchIndex = caption.toLowerCase().indexOf(lower);
                if (fullMatchIndex > -1) {
                    penalty = fullMatchIndex;
                } else {
                    for (var j = 0; j < needle.length; j++) {
                        var i1 = caption.indexOf(lower[j], lastIndex + 1);
                        var i2 = caption.indexOf(upper[j], lastIndex + 1);
                        index = (i1 >= 0) ? ((i2 < 0 || i1 < i2) ? i1 : i2) : i2;
                        if (index < 0)
                            continue loop;
                        distance = index - lastIndex - 1;
                        if (distance > 0) {
                            if (lastIndex === -1)
                                penalty += 10;
                            penalty += distance;
                            matchMask = matchMask | (1 << j);
                        }
                        lastIndex = index;
                    }
                }
            }
            item.matchMask = matchMask;
            item.exactMatch = penalty ? 0 : 1;
            item.$score = (item.score || 0) - penalty;
            results.push(item);
        }
        return results;
    };
}).call(FilteredList.prototype);

exports.Autocomplete = Autocomplete;
exports.FilteredList = FilteredList;

});

ace.define("ace/autocomplete/text_completer",["require","exports","module","ace/range"], function(require, exports, module) {
    var Range = require("../range").Range;
    
    var splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;

    function getWordIndex(doc, pos) {
        var textBefore = doc.getTextRange(Range.fromPoints({row: 0, column:0}, pos));
        return textBefore.split(splitRegex).length - 1;
    }
    function wordDistance(doc, pos) {
        var prefixPos = getWordIndex(doc, pos);
        var words = doc.getValue().split(splitRegex);
        var wordScores = Object.create(null);
        
        var currentWord = words[prefixPos];

        words.forEach(function(word, idx) {
            if (!word || word === currentWord) return;

            var distance = Math.abs(prefixPos - idx);
            var score = words.length - distance;
            if (wordScores[word]) {
                wordScores[word] = Math.max(score, wordScores[word]);
            } else {
                wordScores[word] = score;
            }
        });
        return wordScores;
    }

    exports.getCompletions = function(editor, session, pos, prefix, callback) {
        var wordScore = wordDistance(session, pos);
        var wordList = Object.keys(wordScore);
        callback(null, wordList.map(function(word) {
            return {
                caption: word,
                value: word,
                score: wordScore[word],
                meta: "local"
            };
        }));
    };
});

ace.define("ace/ext/language_tools",["require","exports","module","ace/snippets","ace/autocomplete","ace/config","ace/lib/lang","ace/autocomplete/util","ace/autocomplete/text_completer","ace/editor","ace/config"], function(require, exports, module) {
"use strict";

var snippetManager = require("../snippets").snippetManager;
var Autocomplete = require("../autocomplete").Autocomplete;
var config = require("../config");
var lang = require("../lib/lang");
var util = require("../autocomplete/util");

var textCompleter = require("../autocomplete/text_completer");
var keyWordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if (session.$mode.completer) {
            return session.$mode.completer.getCompletions(editor, session, pos, prefix, callback);
        }
        var state = editor.session.getState(pos.row);
        var completions = session.$mode.getCompletions(state, session, pos, prefix);
        callback(null, completions);
    }
};

var snippetCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var scopes = [];
        var token = session.getTokenAt(pos.row, pos.column);
        if (token && token.type.match(/(tag-name|tag-open|tag-whitespace|attribute-name|attribute-value)\.xml$/))
            scopes.push('html-tag');
        else
            scopes = snippetManager.getActiveScopes(editor);

        var snippetMap = snippetManager.snippetMap;
        var completions = [];
        scopes.forEach(function(scope) {
            var snippets = snippetMap[scope] || [];
            for (var i = snippets.length; i--;) {
                var s = snippets[i];
                var caption = s.name || s.tabTrigger;
                if (!caption)
                    continue;
                completions.push({
                    caption: caption,
                    snippet: s.content,
                    meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet",
                    type: "snippet"
                });
            }
        }, this);
        callback(null, completions);
    },
    getDocTooltip: function(item) {
        if (item.type == "snippet" && !item.docHTML) {
            item.docHTML = [
                "<b>", lang.escapeHTML(item.caption), "</b>", "<hr></hr>",
                lang.escapeHTML(item.snippet)
            ].join("");
        }
    }
};

var completers = [snippetCompleter, textCompleter, keyWordCompleter];
exports.setCompleters = function(val) {
    completers.length = 0;
    if (val) completers.push.apply(completers, val);
};
exports.addCompleter = function(completer) {
    completers.push(completer);
};
exports.textCompleter = textCompleter;
exports.keyWordCompleter = keyWordCompleter;
exports.snippetCompleter = snippetCompleter;

var expandSnippet = {
    name: "expandSnippet",
    exec: function(editor) {
        return snippetManager.expandWithTab(editor);
    },
    bindKey: "Tab"
};

var onChangeMode = function(e, editor) {
    loadSnippetsForMode(editor.session.$mode);
};

var loadSnippetsForMode = function(mode) {
    var id = mode.$id;
    if (!snippetManager.files)
        snippetManager.files = {};
    loadSnippetFile(id);
    if (mode.modes)
        mode.modes.forEach(loadSnippetsForMode);
};

var loadSnippetFile = function(id) {
    if (!id || snippetManager.files[id])
        return;
    var snippetFilePath = id.replace("mode", "snippets");
    snippetManager.files[id] = {};
    config.loadModule(snippetFilePath, function(m) {
        if (m) {
            snippetManager.files[id] = m;
            if (!m.snippets && m.snippetText)
                m.snippets = snippetManager.parseSnippetFile(m.snippetText);
            snippetManager.register(m.snippets || [], m.scope);
            if (m.includeScopes) {
                snippetManager.snippetMap[m.scope].includeScopes = m.includeScopes;
                m.includeScopes.forEach(function(x) {
                    loadSnippetFile("ace/mode/" + x);
                });
            }
        }
    });
};

var doLiveAutocomplete = function(e) {
    var editor = e.editor;
    var hasCompleter = editor.completer && editor.completer.activated;
    if (e.command.name === "backspace") {
        if (hasCompleter && !util.getCompletionPrefix(editor))
            editor.completer.detach();
    }
    else if (e.command.name === "insertstring") {
        var prefix = util.getCompletionPrefix(editor);
        if (prefix && !hasCompleter) {
            if (!editor.completer) {
                editor.completer = new Autocomplete();
            }
            editor.completer.autoInsert = false;
            editor.completer.showPopup(editor);
        }
    }
};

var Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    enableBasicAutocompletion: {
        set: function(val) {
            if (val) {
                if (!this.completers)
                    this.completers = Array.isArray(val)? val: completers;
                this.commands.addCommand(Autocomplete.startCommand);
            } else {
                this.commands.removeCommand(Autocomplete.startCommand);
            }
        },
        value: false
    },
    enableLiveAutocompletion: {
        set: function(val) {
            if (val) {
                if (!this.completers)
                    this.completers = Array.isArray(val)? val: completers;
                this.commands.on('afterExec', doLiveAutocomplete);
            } else {
                this.commands.removeListener('afterExec', doLiveAutocomplete);
            }
        },
        value: false
    },
    enableSnippets: {
        set: function(val) {
            if (val) {
                this.commands.addCommand(expandSnippet);
                this.on("changeMode", onChangeMode);
                onChangeMode(null, this);
            } else {
                this.commands.removeCommand(expandSnippet);
                this.off("changeMode", onChangeMode);
            }
        },
        value: false
    }
});
});                (function() {
                    ace.require(["ace/ext/language_tools"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
},{}],"../node_modules/ace-builds/src-noconflict/mode-lua.js":[function(require,module,exports) {
ace.define("ace/mode/lua_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LuaHighlightRules = function() {

    var keywords = (
        "break|do|else|elseif|end|for|function|if|in|local|repeat|"+
         "return|then|until|while|or|and|not"
    );

    var builtinConstants = ("true|false|nil|_G|_VERSION");

    var functions = (
        "string|xpcall|package|tostring|print|os|unpack|require|"+
        "getfenv|setmetatable|next|assert|tonumber|io|rawequal|"+
        "collectgarbage|getmetatable|module|rawset|math|debug|"+
        "pcall|table|newproxy|type|coroutine|_G|select|gcinfo|"+
        "pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|"+
        "load|error|loadfile|"+

        "sub|upper|len|gfind|rep|find|match|char|dump|gmatch|"+
        "reverse|byte|format|gsub|lower|preload|loadlib|loaded|"+
        "loaders|cpath|config|path|seeall|exit|setlocale|date|"+
        "getenv|difftime|remove|time|clock|tmpname|rename|execute|"+
        "lines|write|close|flush|open|output|type|read|stderr|"+
        "stdin|input|stdout|popen|tmpfile|log|max|acos|huge|"+
        "ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|"+
        "frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|"+
        "atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|"+
        "gethook|setmetatable|setlocal|traceback|setfenv|getinfo|"+
        "setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|"+
        "foreachi|maxn|foreach|concat|sort|remove|resume|yield|"+
        "status|wrap|create|running|"+
        "__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|"+
         "__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber"
    );

    var stdLibaries = ("string|package|os|io|math|debug|table|coroutine");

    var deprecatedIn5152 = ("setn|foreach|foreachi|gcinfo|log10|maxn");

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "support.function": functions,
        "keyword.deprecated": deprecatedIn5152,
        "constant.library": stdLibaries,
        "constant.language": builtinConstants,
        "variable.language": "self"
    }, "identifier");

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var integer = "(?:" + decimalInteger + "|" + hexInteger + ")";

    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var floatNumber = "(?:" + pointFloat + ")";

    this.$rules = {
        "start" : [{
            stateName: "bracketedComment",
            onMatch : function(value, currentState, stack){
                stack.unshift(this.next, value.length - 2, currentState);
                return "comment";
            },
            regex : /\-\-\[=*\[/,
            next  : [
                {
                    onMatch : function(value, currentState, stack) {
                        if (value.length == stack[1]) {
                            stack.shift();
                            stack.shift();
                            this.next = stack.shift();
                        } else {
                            this.next = "";
                        }
                        return "comment";
                    },
                    regex : /\]=*\]/,
                    next  : "start"
                }, {
                    defaultToken : "comment"
                }
            ]
        },

        {
            token : "comment",
            regex : "\\-\\-.*$"
        },
        {
            stateName: "bracketedString",
            onMatch : function(value, currentState, stack){
                stack.unshift(this.next, value.length, currentState);
                return "string.start";
            },
            regex : /\[=*\[/,
            next  : [
                {
                    onMatch : function(value, currentState, stack) {
                        if (value.length == stack[1]) {
                            stack.shift();
                            stack.shift();
                            this.next = stack.shift();
                        } else {
                            this.next = "";
                        }
                        return "string.end";
                    },
                    
                    regex : /\]=*\]/,
                    next  : "start"
                }, {
                    defaultToken : "string"
                }
            ]
        },
        {
            token : "string",           // " string
            regex : '"(?:[^\\\\]|\\\\.)*?"'
        }, {
            token : "string",           // ' string
            regex : "'(?:[^\\\\]|\\\\.)*?'"
        }, {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\."
        }, {
            token : "paren.lparen",
            regex : "[\\[\\(\\{]"
        }, {
            token : "paren.rparen",
            regex : "[\\]\\)\\}]"
        }, {
            token : "text",
            regex : "\\s+|\\w+"
        } ]
    };
    
    this.normalizeRules();
};

oop.inherits(LuaHighlightRules, TextHighlightRules);

exports.LuaHighlightRules = LuaHighlightRules;
});

ace.define("ace/mode/folding/lua",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range","ace/token_iterator"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;
var TokenIterator = require("../../token_iterator").TokenIterator;


var FoldMode = exports.FoldMode = function() {};

oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /\b(function|then|do|repeat)\b|{\s*$|(\[=*\[)/;
    this.foldingStopMarker = /\bend\b|^\s*}|\]=*\]/;

    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarker.test(line);
        var isEnd = this.foldingStopMarker.test(line);

        if (isStart && !isEnd) {
            var match = line.match(this.foldingStartMarker);
            if (match[1] == "then" && /\belseif\b/.test(line))
                return;
            if (match[1]) {
                if (session.getTokenAt(row, match.index + 1).type === "keyword")
                    return "start";
            } else if (match[2]) {
                var type = session.bgTokenizer.getState(row) || "";
                if (type[0] == "bracketedComment" || type[0] == "bracketedString")
                    return "start";
            } else {
                return "start";
            }
        }
        if (foldStyle != "markbeginend" || !isEnd || isStart && isEnd)
            return "";

        var match = line.match(this.foldingStopMarker);
        if (match[0] === "end") {
            if (session.getTokenAt(row, match.index + 1).type === "keyword")
                return "end";
        } else if (match[0][0] === "]") {
            var type = session.bgTokenizer.getState(row - 1) || "";
            if (type[0] == "bracketedComment" || type[0] == "bracketedString")
                return "end";
        } else
            return "end";
    };

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.doc.getLine(row);
        var match = this.foldingStartMarker.exec(line);
        if (match) {
            if (match[1])
                return this.luaBlock(session, row, match.index + 1);

            if (match[2])
                return session.getCommentFoldRange(row, match.index + 1);

            return this.openingBracketBlock(session, "{", row, match.index);
        }

        var match = this.foldingStopMarker.exec(line);
        if (match) {
            if (match[0] === "end") {
                if (session.getTokenAt(row, match.index + 1).type === "keyword")
                    return this.luaBlock(session, row, match.index + 1);
            }

            if (match[0][0] === "]")
                return session.getCommentFoldRange(row, match.index + 1);

            return this.closingBracketBlock(session, "}", row, match.index + match[0].length);
        }
    };

    this.luaBlock = function(session, row, column) {
        var stream = new TokenIterator(session, row, column);
        var indentKeywords = {
            "function": 1,
            "do": 1,
            "then": 1,
            "elseif": -1,
            "end": -1,
            "repeat": 1,
            "until": -1
        };

        var token = stream.getCurrentToken();
        if (!token || token.type != "keyword")
            return;

        var val = token.value;
        var stack = [val];
        var dir = indentKeywords[val];

        if (!dir)
            return;

        var startColumn = dir === -1 ? stream.getCurrentTokenColumn() : session.getLine(row).length;
        var startRow = row;

        stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
        while(token = stream.step()) {
            if (token.type !== "keyword")
                continue;
            var level = dir * indentKeywords[token.value];

            if (level > 0) {
                stack.unshift(token.value);
            } else if (level <= 0) {
                stack.shift();
                if (!stack.length && token.value != "elseif")
                    break;
                if (level === 0)
                    stack.unshift(token.value);
            }
        }

        var row = stream.getCurrentTokenRow();
        if (dir === -1)
            return new Range(row, session.getLine(row).length, startRow, startColumn);
        else
            return new Range(startRow, startColumn, row, stream.getCurrentTokenColumn());
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/lua",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/lua_highlight_rules","ace/mode/folding/lua","ace/range","ace/worker/worker_client"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var LuaHighlightRules = require("./lua_highlight_rules").LuaHighlightRules;
var LuaFoldMode = require("./folding/lua").FoldMode;
var Range = require("../range").Range;
var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    this.HighlightRules = LuaHighlightRules;
    
    this.foldingRules = new LuaFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
   
    this.lineCommentStart = "--";
    this.blockComment = {start: "--[", end: "]--"};
    
    var indentKeywords = {
        "function": 1,
        "then": 1,
        "do": 1,
        "else": 1,
        "elseif": 1,
        "repeat": 1,
        "end": -1,
        "until": -1
    };
    var outdentKeywords = [
        "else",
        "elseif",
        "end",
        "until"
    ];

    function getNetIndentLevel(tokens) {
        var level = 0;
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type == "keyword") {
                if (token.value in indentKeywords) {
                    level += indentKeywords[token.value];
                }
            } else if (token.type == "paren.lparen") {
                level += token.value.length;
            } else if (token.type == "paren.rparen") {
                level -= token.value.length;
            }
        }
        if (level < 0) {
            return -1;
        } else if (level > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        var level = 0;

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (state == "start") {
            level = getNetIndentLevel(tokens);
        }
        if (level > 0) {
            return indent + tab;
        } else if (level < 0 && indent.substr(indent.length - tab.length) == tab) {
            if (!this.checkOutdent(state, line, "\n")) {
                return indent.substr(0, indent.length - tab.length);
            }
        }
        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        if (input != "\n" && input != "\r" && input != "\r\n")
            return false;

        if (line.match(/^\s*[\)\}\]]$/))
            return true;

        var tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;

        if (!tokens || !tokens.length)
            return false;

        return (tokens[0].type == "keyword" && outdentKeywords.indexOf(tokens[0].value) != -1);
    };

    this.autoOutdent = function(state, session, row) {
        var prevLine = session.getLine(row - 1);
        var prevIndent = this.$getIndent(prevLine).length;
        var prevTokens = this.getTokenizer().getLineTokens(prevLine, "start").tokens;
        var tabLength = session.getTabString().length;
        var expectedIndent = prevIndent + tabLength * getNetIndentLevel(prevTokens);
        var curIndent = this.$getIndent(session.getLine(row)).length;
        if (curIndent <= expectedIndent) {
            return;
        }
        session.outdentRows(new Range(row, 0, row + 2, 0));
    };

    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/lua_worker", "Worker");
        worker.attachToDocument(session.getDocument());
        
        worker.on("annotate", function(e) {
            session.setAnnotations(e.data);
        });
        
        worker.on("terminate", function() {
            session.clearAnnotations();
        });
        
        return worker;
    };

    this.$id = "ace/mode/lua";
}).call(Mode.prototype);

exports.Mode = Mode;
});                (function() {
                    ace.require(["ace/mode/lua"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
},{}],"../node_modules/ace-builds/src-noconflict/theme-dreamweaver.js":[function(require,module,exports) {
ace.define("ace/theme/dreamweaver",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
exports.isDark = false;
exports.cssClass = "ace-dreamweaver";
exports.cssText = ".ace-dreamweaver .ace_gutter {\
background: #e8e8e8;\
color: #333;\
}\
.ace-dreamweaver .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-dreamweaver {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-dreamweaver .ace_fold {\
background-color: #757AD8;\
}\
.ace-dreamweaver .ace_cursor {\
color: black;\
}\
.ace-dreamweaver .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-dreamweaver .ace_storage,\
.ace-dreamweaver .ace_keyword {\
color: blue;\
}\
.ace-dreamweaver .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-dreamweaver .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-dreamweaver .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-dreamweaver .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-dreamweaver .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-dreamweaver .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-dreamweaver .ace_support.ace_type,\
.ace-dreamweaver .ace_support.ace_class {\
color: #009;\
}\
.ace-dreamweaver .ace_support.ace_php_tag {\
color: #f00;\
}\
.ace-dreamweaver .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-dreamweaver .ace_string {\
color: #00F;\
}\
.ace-dreamweaver .ace_comment {\
color: rgb(76, 136, 107);\
}\
.ace-dreamweaver .ace_comment.ace_doc {\
color: rgb(0, 102, 255);\
}\
.ace-dreamweaver .ace_comment.ace_doc.ace_tag {\
color: rgb(128, 159, 191);\
}\
.ace-dreamweaver .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-dreamweaver .ace_variable {\
color: #06F\
}\
.ace-dreamweaver .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-dreamweaver .ace_entity.ace_name.ace_function {\
color: #00F;\
}\
.ace-dreamweaver .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-dreamweaver .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-dreamweaver .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-dreamweaver .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-dreamweaver .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-dreamweaver .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-dreamweaver .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.07);\
}\
.ace-dreamweaver .ace_gutter-active-line {\
background-color : #DCDCDC;\
}\
.ace-dreamweaver .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-dreamweaver .ace_meta.ace_tag {\
color:#009;\
}\
.ace-dreamweaver .ace_meta.ace_tag.ace_anchor {\
color:#060;\
}\
.ace-dreamweaver .ace_meta.ace_tag.ace_form {\
color:#F90;\
}\
.ace-dreamweaver .ace_meta.ace_tag.ace_image {\
color:#909;\
}\
.ace-dreamweaver .ace_meta.ace_tag.ace_script {\
color:#900;\
}\
.ace-dreamweaver .ace_meta.ace_tag.ace_style {\
color:#909;\
}\
.ace-dreamweaver .ace_meta.ace_tag.ace_table {\
color:#099;\
}\
.ace-dreamweaver .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-dreamweaver .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/dreamweaver"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
},{}],"util/ace-editor.ts":[function(require,module,exports) {
"use strict";

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _litElement = require("lit-element");

var _notify = _interopRequireDefault(require("./notify"));

var ace = _interopRequireWildcard(require("ace-builds/src-noconflict/ace"));

require("ace-builds/src-noconflict/ext-language_tools");

require("ace-builds/src-noconflict/mode-lua");

require("ace-builds/src-noconflict/theme-dreamweaver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let AceEditor = class AceEditor extends _notify.default {
  constructor() {
    super(...arguments);
    this.content = "";
  }

  firstUpdated(_changedProperties) {
    this.initEditor();
  }

  updated(changedProperties) {
    if (changedProperties.has('content')) {
      this.editor.session.setValue(this.content);
    }
  }

  initEditor() {
    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/');
    var shadow = this.shadowRoot;

    ace.require("ace/ext/lanugage_tools");

    var dom = ace.require("ace/lib/dom");

    dom.buildDom(["div", {
      id: "host"
    }, ["div", {
      id: "editor"
    }], ["style", `
                #host {
                    border: solid 1px gray;                 
                }
                #editor {
                    height: 200px;
                }
            `]], shadow);
    this.editor = ace.edit(shadow.querySelector("#editor"), {
      theme: "ace/theme/dreamweaver",
      mode: "ace/mode/lua",
      value: this.content,
      autoScrollEditorIntoView: true,
      enableBasicAutocompletion: true,
      enableSnippets: true
    });
    this.editor.renderer.attachToShadowRoot();
    this.editor.session.on('change', () => {
      this.notifyPropChanged('content', this.editor.session.getValue());
    });
  }

  bind(property) {
    return e => {
      try {
        var schema = this; // a moving reference to internal objects within obj

        var pList = property.split('.');
        var len = pList.length;

        for (var i = 0; i < len - 1; i++) {
          var elem = pList[i];
          if (!schema[elem]) schema[elem] = {};
          schema = schema[elem];
        }

        if (schema) schema[pList[len - 1]] = e.target.value;
      } catch (e) {
        console.error("Error in 2-way DataBinding", e);
      }
    };
  }

};

tslib_1.__decorate([(0, _litElement.property)({
  type: String
})], AceEditor.prototype, "content", void 0);

AceEditor = tslib_1.__decorate([(0, _litElement.customElement)("ace-editor")], AceEditor);
},{"tslib":"../node_modules/tslib/tslib.es6.js","lit-element":"../node_modules/lit-element/lit-element.js","./notify":"util/notify.ts","ace-builds/src-noconflict/ace":"../node_modules/ace-builds/src-noconflict/ace.js","ace-builds/src-noconflict/ext-language_tools":"../node_modules/ace-builds/src-noconflict/ext-language_tools.js","ace-builds/src-noconflict/mode-lua":"../node_modules/ace-builds/src-noconflict/mode-lua.js","ace-builds/src-noconflict/theme-dreamweaver":"../node_modules/ace-builds/src-noconflict/theme-dreamweaver.js"}],"auth/auth-block.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Login = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _litElement = require("lit-element");

var _notify = _interopRequireDefault(require("../util/notify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let Login = class Login extends _notify.default {
  constructor() {
    super(...arguments);
    this.email = "";
    this.password = "";
    this.mode = "login";
  }

  render() {
    return _litElement.html`
<div class="login-form">
    <form method="POST" action="/users/${this.mode}/">
        <h2 class="text-center">${this.mode == 'login' ? 'Log in' : 'Sign up'}</h2>
        <input class="form-control"
            type="text" name="email"
            value="${this.email}" 
            @changed="${e => this.email = e.currentTarget.value}">
        <input class="form-control" 
            type="password" 
            name="password" 
            value="${this.password}" 
            @changed="${e => this.password = e.currentTarget.value}">
        <input class="form-control btn btn-primary" type="submit" value="${this.mode == 'login' ? 'Log in' : 'sign up'}">
    </form>
</div>

`;
  }

};
exports.Login = Login;

tslib_1.__decorate([(0, _litElement.property)()], Login.prototype, "email", void 0);

tslib_1.__decorate([(0, _litElement.property)()], Login.prototype, "password", void 0);

tslib_1.__decorate([(0, _litElement.property)({
  type: String
})], Login.prototype, "mode", void 0);

exports.Login = Login = tslib_1.__decorate([(0, _litElement.customElement)("auth-form")], Login);
let AuthBlock = class AuthBlock extends _litElement.LitElement {
  render() {
    return _litElement.html`<auth-form .mode="${'login'}"></auth-form> <auth-form .mode="${'signup'}"></auth-form>`;
  }

};
AuthBlock = tslib_1.__decorate([(0, _litElement.customElement)("auth-block")], AuthBlock);
},{"tslib":"../node_modules/tslib/tslib.es6.js","lit-element":"../node_modules/lit-element/lit-element.js","../util/notify":"util/notify.ts"}],"strategies/detail.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Detail = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _litElement = require("lit-element");

var api = _interopRequireWildcard(require("../util/api"));

var _notify = _interopRequireDefault(require("../util/notify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let Detail = class Detail extends _notify.default {
  constructor() {
    super(...arguments);
    this.strat_id = null;
    this.strat = null;
  }

  loadStrat() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      this.strat = yield api.getOne('strategies', this.strat_id);
      console.log("Loaded strategy details: " + this.strat.name);
    });
  }

  saveStrat() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      this.strat = yield api.postOne('strategies', this.strat);
    });
  }

  firstUpdated(_changedProperties) {
    this.addEventListener('id-changed', e => {
      this.loadStrat();
    });
    this.notifyPropChanged('id');
  }

  connectedCallback() {
    super.connectedCallback();
  }

  editor() {
    return _litElement.html`
<ace-editor 
content="${this.strat.body}" 
@content-changed="${e => this.strat.body = e.detail.value}"></ace-editor>
<button @click="${e => this.saveStrat()}">Save</button>
`;
  }

  loading() {
    return _litElement.html`<div>Not yet loaded</div>`;
  }

  render() {
    return _litElement.html`${this.strat != null ? this.editor() : this.loading()}`;
  }

};
exports.Detail = Detail;

tslib_1.__decorate([(0, _litElement.property)({
  type: Number,
  attribute: true
})], Detail.prototype, "strat_id", void 0);

tslib_1.__decorate([(0, _litElement.property)({
  type: Object
})], Detail.prototype, "strat", void 0);

exports.Detail = Detail = tslib_1.__decorate([(0, _litElement.customElement)("strategy-detail")], Detail);
},{"tslib":"../node_modules/tslib/tslib.es6.js","lit-element":"../node_modules/lit-element/lit-element.js","../util/api":"util/api.ts","../util/notify":"util/notify.ts"}],"strategies/list.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Detail = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _litElement = require("lit-element");

var api = _interopRequireWildcard(require("../util/api"));

var _notify = _interopRequireDefault(require("../util/notify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let Detail = class Detail extends _notify.default {
  constructor() {
    super(...arguments);
    this.strategies = null;
    this.newName = null;
  }

  load() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      this.strategies = yield api.getAll('strategies');
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.load();
  }

  handleText(e) {
    this.newName = e.target.value;
  }

  submitNew(e) {
    api.postOne("strategies", {
      name: this.newName,
      body: ""
    }).then(e => {
      window.location.href = `/strategies/${e.id}`;
    });
  }

  item(o) {
    return _litElement.html`
        <tr>
        <td>${o.name}</td>
        <td>${o.created}</td>
        <td><a href="/app/strategies/${o.id}">Detail</a></td>
        </tr>
`;
  }

  form() {
    return _litElement.html`
        <div style="display: inline-block;">
        <input name="name" type="text" .value="${this.newName}" @input="${e => this.handleText(e)}">
        <button @click="${this.submitNew}">Create new</button>
        </div>
        `;
  }

  ok() {
    return _litElement.html`
    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        ${this.strategies.map(this.item)}
        </tbody>
    </table>
       ${this.form()}
        
`;
  }

  loading() {
    return _litElement.html`<div>Not yet loaded</div>`;
  }

  render() {
    return _litElement.html`${this.strategies != null ? this.ok() : this.loading()}`;
  }

};
exports.Detail = Detail;

tslib_1.__decorate([(0, _litElement.property)({
  type: Array
})], Detail.prototype, "strategies", void 0);

tslib_1.__decorate([(0, _litElement.property)({
  type: String
})], Detail.prototype, "newName", void 0);

exports.Detail = Detail = tslib_1.__decorate([(0, _litElement.customElement)("strategy-list")], Detail);
},{"tslib":"../node_modules/tslib/tslib.es6.js","lit-element":"../node_modules/lit-element/lit-element.js","../util/api":"util/api.ts","../util/notify":"util/notify.ts"}],"assignments/list.ts":[function(require,module,exports) {
"use strict";

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _litElement = require("lit-element");

var api = _interopRequireWildcard(require("../util/api"));

var _notify = _interopRequireDefault(require("../util/notify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let AssignmentItem = class AssignmentItem extends _notify.default {};
AssignmentItem = tslib_1.__decorate([(0, _litElement.customElement)("assignment-item")], AssignmentItem);
let AssignmentList = class AssignmentList extends _notify.default {
  constructor() {
    super(...arguments);
    this.periods = ["1m", "5m", "15m"];
    this.pairs = null;
    this.assignments = null;
    this.strategies = null;
    this.traders = null;
    this.newData = new api.Assignment();
  }

  firstUpdated(_changedProperties) {
    api.getAll('pairs').then(p => {
      this.pairs = p;
      this.requestUpdate();
    });
    this.load();
  }

  loaded() {
    return this.pairs != null && this.strategies != null && this.assignments != null && this.traders != null;
  }

  load() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      this.assignments = yield api.getAll('assignments');
      this.strategies = yield api.getAll('strategies');
      this.traders = yield api.getAll('traders');
      console.log(this.traders);
      this.requestUpdate();
    });
  }

  delete(a) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      a.period = null;
      a.strategy_id = null;
      a.trader_id = null;
      yield api.postOne('assignments', a);
      yield this.load();
    });
  }

  trader_name(id) {
    let t = this.traders.find(t => t.id == id);
    return t ? t.name : '';
  }

  createNew() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      yield api.postOne('assignments', this.newData);
      yield this.load();
    });
  }

  form() {
    let pairListener = e => {
      let p = e.target.options[e.target.selectedIndex];
      this.newData.exchange = p.dataset.exchange;
      this.newData.pair = p.dataset.pair;
      this.requestUpdate('newData');
    };

    let selectPair = _litElement.html`
        <select @change="${pairListener}" required>
           <option value="" disabled selected>Select pair</option>
${this.pairs.map(p => _litElement.html`
<option data-exchange="${p.exchange}" data-pair="${p.pair}">${p.exchange}/${p.pair}</option>`)}
        </select>
        `;

    let periodListener = e => {
      this.newData.period = e.target.options[e.target.selectedIndex].value;
      this.requestUpdate('newData');
    };

    let selectPeriod = _litElement.html`
<select @change="${periodListener}">
${this.periods.map(p => _litElement.html`<option>${p}</option>`)}
</select>
        `;

    let stratListener = e => {
      this.newData.strategy_id = parseInt(e.target.options[e.target.selectedIndex].dataset.id);
      this.requestUpdate('newData');
    };

    let selectStrat = _litElement.html`
        <select @change="${stratListener}">
           <option value="" disabled selected>Select Strategy</option>
        ${this.strategies.map(s => _litElement.html`<option data-id="${s.id}" >${s.name}</option>`)}
        </select>
        `;

    let traderListener = e => {
      this.newData.trader_id = parseInt(e.target.options[e.target.selectedIndex].dataset.id);
      this.requestUpdate('newData');
    };

    let selectTrader = _litElement.html`
        <select @change="${traderListener}">
           <option value="" disabled selected>Select trader</option>
           <option value="" >None</option>
        ${this.traders.filter(t => this.assignments.find(a => a.trader_id == t.id) == null).map(s => _litElement.html`<option data-id="${s.id}">${s.name}</option>`)}
        </select>
        `;
    return _litElement.html`
        <div style="display: inline-block;">
        ${selectPair}
        ${selectPeriod}
        ${selectStrat}
        ${selectTrader}
        <button @click="${this.createNew}" ?disabled="${this.newData.pair == null || this.newData.strategy_id == null}">Create new</button>
        </div>
        
        `;
  }

  header() {
    return _litElement.html`
          <thead>
        <tr>
        <th>Exchange</th>
        <th>Pair</th>
        <th>Period</th>
        <th>Strategy</th>
        <th>Trader</th>
        <th>Actions</th>
        </tr>
    </thead>
        `;
  }

  row(a) {
    return _litElement.html`
<tr>
        <td>${a.exchange}</td>
        <td>${a.pair}</td>
        <td>${a.period}</td>
        <td>${this.strategies.find(s => s.id == a.strategy_id).name}</td>
        <td>${this.trader_name(a.trader_id)}</td>
        <td><button @click="${e => this.delete(a)}">Delete</button></td>
</tr>
        
        `;
  }

  loading() {
    return _litElement.html`<div>Not yet loaded</div>`;
  }

  ok() {
    return _litElement.html`
        ${this.form()}
<table id="assignments" class="table">
    ${this.header()}  
    <tbody>
    ${this.assignments.map(a => this.row(a))}
    </tbody>
</table>
        `;
  }

  render() {
    return _litElement.html`
            ${this.loaded() ? this.ok() : this.loading()}
        `;
  }

};
AssignmentList = tslib_1.__decorate([(0, _litElement.customElement)("assignment-list")], AssignmentList);
},{"tslib":"../node_modules/tslib/tslib.es6.js","lit-element":"../node_modules/lit-element/lit-element.js","../util/api":"util/api.ts","../util/notify":"util/notify.ts"}],"traders/list.ts":[function(require,module,exports) {
"use strict";

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _litElement = require("lit-element");

var api = _interopRequireWildcard(require("../util/api"));

var _notify = _interopRequireDefault(require("../util/notify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let style = _litElement.html` <style> :host { display: table-row; }  .td, ::content .td { display: table-cell; width: 50px;} </style>`;
let TraderList = class TraderList extends _notify.default {
  constructor() {
    super(...arguments);
    this.traders = [];
    this.exchanges = [];
    this.newTrader = new api.Trader();
  }

  load() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      this.traders = yield api.getAll('traders');
      let pairs = yield api.getAll('pairs');
      this.exchanges = [...new Set(pairs.map(p => p.exchange))];
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.load();
  }

  thead() {
    return _litElement.html`
        <thead class="thead-dark">
        <tr>
            <th>Name</th>
            <th>Exchange</th>
            <th>Key</th>
            <th>Secret</th>
            <th>Actions</th>
        </tr>
        </thead>
        `;
  }

  item(t) {
    return _litElement.html`
        ${style}
        <tr>
        <td>${t.name}</td>
        <td>${t.exchange}</td>
        <td>${t.api_key}</td>
        <td>Hidden</td>
        <td>Delete</td>
        </tr>
        `;
  }

  itemNew() {
    let valid = () => {
      return this.newTrader.api_secret != null && this.newTrader.api_key != null && this.newTrader.exchange != null;
    };

    let clicked = e => tslib_1.__awaiter(this, void 0, void 0, function* () {
      yield api.postOne('traders', this.newTrader);
      this.newTrader = new api.Trader();
      yield this.load();
      console.log(e);
    });

    let but = _litElement.html`<button @click="${clicked}"  ?disabled="${!valid()}">Create new</button>`;

    let exchListener = e => {
      this.newTrader.exchange = e.target.options[e.target.selectedIndex].value;
      this.requestUpdate();
    };

    let nameListener = e => {
      this.newTrader.name = e.target.value;
      this.requestUpdate();
    };

    let keyListener = e => {
      this.newTrader.api_key = e.target.value;
      this.requestUpdate();
    };

    let secretListener = e => {
      this.newTrader.api_secret = e.target.value;
      this.requestUpdate();
    };

    return _litElement.html`
${style}
<td><input @input="${nameListener}" .value="${this.newTrader.name}"/></td>
<td>
    <select @change="${exchListener}" >
           <option value="" disabled selected>Select Exchange</option>
            ${this.exchanges.map(e => _litElement.html`<option>${e}</option>`)}
    </select>
</td>
<td><input @input="${keyListener}" .value="${this.newTrader.api_key}"/></td>
<td><input @input="${secretListener}" .value="${this.newTrader.api_secret}"/>
</td>
${but}
`;
  }

  tbody() {
    return _litElement.html`
<tbody>
${this.itemNew()}
${this.traders.map(this.item)}
</tbody>
`;
  }

  created(e) {
    console.log(e);
  }

  render() {
    return _litElement.html`
<table id="traders" class="table">
${this.thead()}
${this.tbody()}
</table>
`;
  }

};

tslib_1.__decorate([(0, _litElement.property)()], TraderList.prototype, "traders", void 0);

tslib_1.__decorate([(0, _litElement.property)()], TraderList.prototype, "exchanges", void 0);

TraderList = tslib_1.__decorate([(0, _litElement.customElement)("trader-list")], TraderList);
},{"tslib":"../node_modules/tslib/tslib.es6.js","lit-element":"../node_modules/lit-element/lit-element.js","../util/api":"util/api.ts","../util/notify":"util/notify.ts"}],"../node_modules/lit-element-router/utility/router-utility.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripExtraTrailingSlash = stripExtraTrailingSlash;
exports.parseQuery = parseQuery;
exports.parseParams = parseParams;
exports.patternToRegExp = patternToRegExp;
exports.testRoute = testRoute;

/**
 * 
 * @param {String} str - The uri that has extra slashes
 */
function stripExtraTrailingSlash(str) {
  while (str.length !== 1 && str.substr(-1) === '/') {
    str = str.substr(0, str.length - 1);
  }

  return str;
}
/**
 * 
 * @param {String} querystring - The author of the book.
 */


function parseQuery(querystring) {
  return querystring ? JSON.parse('{"' + querystring.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}') : {};
}
/**
 * Desc
 * @param {String} pattern - The pattern
 * @param {String} uri - The current uri
 * @return {Object} - The uri params object
 */


function parseParams(pattern, uri) {
  let params = {};
  const patternArray = pattern.split('/').filter(path => {
    return path != '';
  });
  const uriArray = uri.split('/').filter(path => {
    return path != '';
  });
  patternArray.map((pattern, i) => {
    if (/^:/.test(pattern)) {
      params[pattern.substring(1)] = uriArray[i];
    }
  });
  return params;
}
/**
 * À-ÖØ-öø-ÿ
 * @param {*} pattern 
 */


function patternToRegExp(pattern) {
  if (pattern) {
    return new RegExp(pattern.replace(/:[^\s/]+/g, '([\\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff-]+)') + '(|/)$');
  } else {
    return new RegExp('(^$|^/$)');
  }
}

function testRoute(uri, pattern) {
  if (patternToRegExp(pattern).test(uri)) {
    return true;
  }
}
},{}],"../node_modules/lit-element-router/router/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = router;

var _routerUtility = require("../utility/router-utility");

let globalRoutes;
let globalCallback;
let stats = 0;

function router(routes, callback) {
  if (!stats) {
    window.addEventListener('route', () => {
      router.call(this, globalRoutes, globalCallback);
    });

    window.onpopstate = () => {
      window.dispatchEvent(new CustomEvent('route'));
    };

    stats = 1;
  }

  globalRoutes = routes;
  globalCallback = callback;
  const uri = decodeURI(window.location.pathname);
  const querystring = decodeURI(window.location.search);
  let notFoundRoute = routes.filter(route => route.pattern === '*')[0];
  routes = routes.filter(route => route.pattern !== '*' && (0, _routerUtility.testRoute)(uri, route.pattern));

  if (routes.length) {
    let route = routes[0];
    route.params = (0, _routerUtility.parseParams)(route.pattern, uri);
    route.query = (0, _routerUtility.parseQuery)(querystring);

    if (route.guard && typeof route.guard === 'function') {
      const guard = route.guard();
      Promise.resolve(guard).then(allowed => {
        if (allowed) {
          route.callback && route.callback(route.name, route.params, route.query, route.data);
          callback(route.name, route.params, route.query, route.data);
        } else {
          route.callback && route.callback('not-authorized', route.params, route.query, route.data);
          callback('not-authorized', {}, {}, {});
        }
      });
    } else {
      route.callback && route.callback(route.name, route.params, route.query, route.data);
      callback(route.name, route.params, route.query, route.data);
    }
  } else if (notFoundRoute) {
    notFoundRoute.callback && notFoundRoute.callback(notFoundRoute.name, {}, {}, {});
    callback(notFoundRoute.name, {}, {}, {});
  } else {
    callback('not-found', {}, {}, {});
  }
}
},{"../utility/router-utility":"../node_modules/lit-element-router/utility/router-utility.js"}],"../node_modules/lit-element-router/router-mixin/router-mixin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerOutletMixin = exports.routerLinkMixin = exports.routerMixin = void 0;

var _routerUtility = require("../utility/router-utility");

let routerMixin = superclass => class extends superclass {
  static get properties() {
    return {
      route: {
        type: String,
        reflect: true,
        attribute: 'route'
      },
      canceled: {
        type: Boolean
      }
    };
  }

  firstUpdated() {
    this.router(this.constructor.routes, (...args) => this.onRoute(...args));
    window.addEventListener('route', () => {
      this.router(this.constructor.routes, (...args) => this.onRoute(...args));
    });

    window.onpopstate = () => {
      window.dispatchEvent(new CustomEvent('route'));
    };

    if (super.firstUpdated) super.firstUpdated();
  }

  router(routes, callback) {
    this.canceled = true;
    const uri = decodeURI(window.location.pathname);
    const querystring = decodeURI(window.location.search);
    let notFoundRoute = routes.filter(route => route.pattern === '*')[0];
    routes = routes.filter(route => route.pattern !== '*' && (0, _routerUtility.testRoute)(uri, route.pattern));

    if (routes.length) {
      let route = routes[0];
      route.params = (0, _routerUtility.parseParams)(route.pattern, uri);
      route.query = (0, _routerUtility.parseQuery)(querystring);

      if (route.guard && typeof route.guard === 'function') {
        this.canceled = false;
        Promise.resolve(route.guard()).then(allowed => {
          if (!this.canceled) {
            if (allowed) {
              route.callback && route.callback(route.name, route.params, route.query, route.data);
              callback(route.name, route.params, route.query, route.data);
            } else {
              route.callback && route.callback('not-authorized', route.params, route.query, route.data);
              callback('not-authorized', {}, {}, {});
            }
          }
        });
      } else {
        route.callback && route.callback(route.name, route.params, route.query, route.data);
        callback(route.name, route.params, route.query, route.data);
      }
    } else if (notFoundRoute) {
      notFoundRoute.callback && notFoundRoute.callback(notFoundRoute.name, {}, {}, {});
      callback(notFoundRoute.name, {}, {}, {});
    } else {
      callback('not-found', {}, {}, {});
    }

    if (super.router) super.router();
  }

};

exports.routerMixin = routerMixin;

let routerLinkMixin = superclass => class extends superclass {
  navigate(href) {
    window.history.pushState({}, null, href + window.location.search);
    window.dispatchEvent(new CustomEvent('route'));
    if (super.navigate) super.navigate();
  }

};

exports.routerLinkMixin = routerLinkMixin;

let routerOutletMixin = superclass => class extends superclass {
  static get properties() {
    return {
      currentRoute: {
        type: String,
        reflect: true,
        attribute: 'current-route'
      }
    };
  }

  updated(updatedProperties) {
    updatedProperties.has('currentRoute') && this.routerOutlet();
    if (super.updated) super.updated();
  }

  firstUpdated() {
    this.routerOutlet();
  }

  routerOutlet() {
    Array.from(this.shadowRoot.querySelectorAll(`[route]`)).map(selected => {
      this.appendChild(selected);
    });

    if (this.currentRoute) {
      Array.from(this.querySelectorAll(`[route~=${this.currentRoute}]`)).map(selected => {
        this.shadowRoot.appendChild(selected);
      });
    }

    if (super.routerOutlet) super.routerOutlet();
  }

};

exports.routerOutletMixin = routerOutletMixin;
},{"../utility/router-utility":"../node_modules/lit-element-router/utility/router-utility.js"}],"../node_modules/lit-element-router/router/router-link.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterLink = void 0;

var _litElement = require("lit-element");

class RouterLink extends _litElement.LitElement {
  constructor() {
    super();
    this.addEventListener('click', this.clickHandler.bind(this));
  }

  clickHandler(event) {
    event.preventDefault();
    window.history.pushState({}, null, event.target.href + window.location.search);
    window.dispatchEvent(new CustomEvent('route'));
  }

  static get properties() {
    return {
      href: {
        type: String
      }
    };
  }

  render() {
    return _litElement.html`
            <style>
                ::slotted(*) {
                    pointer-events: none;
                }
                a {
                    all: unset;
                    display: contents;
                    
                    /*Fallback for Edge*/
                    text-decoration: unset;
                    color: unset;
                }
            </style>
            <a href='${this.href}'>
                <slot></slot>
            </a>
        `;
  }

}

exports.RouterLink = RouterLink;
customElements.define('router-link', RouterLink);
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/lit-element-router/router/router-slot.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterSlot = void 0;

var _litElement = require("lit-element");

class RouterSlot extends _litElement.LitElement {
  static get properties() {
    return {
      route: {
        type: String,
        reflect: true,
        attribute: 'route'
      }
    };
  }

  updated(updatedProperties) {
    updatedProperties.has('route') && this.slott();
  }

  slott() {
    if (this.route.length) {
      [...this.shadowRoot.querySelectorAll(`[slot]`)].map(selected => {
        this.appendChild(selected);
      });
      [...this.querySelectorAll(`[slot~=${this.route}]`)].map(selected => {
        this.shadowRoot.appendChild(selected);
      });
    }
  }

}

exports.RouterSlot = RouterSlot;
customElements.define('router-slot', RouterSlot);
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/lit-element-router/lit-element-router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "router", {
  enumerable: true,
  get: function () {
    return _router.router;
  }
});
Object.defineProperty(exports, "routerMixin", {
  enumerable: true,
  get: function () {
    return _routerMixin.routerMixin;
  }
});
Object.defineProperty(exports, "routerLinkMixin", {
  enumerable: true,
  get: function () {
    return _routerMixin.routerLinkMixin;
  }
});
Object.defineProperty(exports, "routerOutletMixin", {
  enumerable: true,
  get: function () {
    return _routerMixin.routerOutletMixin;
  }
});
Object.defineProperty(exports, "RouterLink", {
  enumerable: true,
  get: function () {
    return _routerLink.RouterLink;
  }
});
Object.defineProperty(exports, "RouterSlot", {
  enumerable: true,
  get: function () {
    return _routerSlot.RouterSlot;
  }
});

var _router = require("./router/router");

var _routerMixin = require("./router-mixin/router-mixin");

var _routerLink = require("./router/router-link");

var _routerSlot = require("./router/router-slot");
},{"./router/router":"../node_modules/lit-element-router/router/router.js","./router-mixin/router-mixin":"../node_modules/lit-element-router/router-mixin/router-mixin.js","./router/router-link":"../node_modules/lit-element-router/router/router-link.js","./router/router-slot":"../node_modules/lit-element-router/router/router-slot.js"}],"app.ts":[function(require,module,exports) {
"use strict";

var tslib_1 = _interopRequireWildcard(require("tslib"));

require("./util/api");

require("./util/ace-editor");

require("./util/notify.ts");

require("./auth/auth-block.ts");

require("./strategies/detail");

require("./strategies/list");

require("./assignments/list");

require("./traders/list");

var _litElement = require("lit-element");

var _litElementRouter = require("lit-element-router");

var _notify2 = _interopRequireDefault(require("./util/notify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let AppHome = class AppHome extends _litElement.LitElement {
  render() {
    return _litElement.html`Root`;
  }

};
AppHome = tslib_1.__decorate([(0, _litElement.customElement)("app-home")], AppHome);
let AppRoot = class AppRoot extends (0, _litElementRouter.routerMixin)(_notify2.default) {
  constructor() {
    super(...arguments);
    this.route = '';
    this.params = null;
    this.elem = null;
  }

  onRoute(route, params, query, data) {
    console.log(route, params, query, data);
    this.route = route;
    this.params = params;
    this.elem = document.createElement(route);

    for (let k in params) {
      this.elem.setAttribute(k, params[k]);
    }
  }

  render() {
    return _litElement.html`
        ${this.elem}
        `;
  }

};
AppRoot.routes = [{
  name: 'app-home',
  pattern: '/app'
}, {
  name: 'auth-block',
  pattern: '/app/login'
}, {
  name: 'strategy-list',
  pattern: '/app/strategies'
}, {
  name: 'strategy-detail',
  pattern: '/app/strategies/:strat_id'
}, {
  name: 'assignment-list',
  pattern: '/app/assignments'
}, {
  name: 'trader-list',
  pattern: '/app/traders'
}];
AppRoot = tslib_1.__decorate([(0, _litElement.customElement)("app-root")], AppRoot);
},{"tslib":"../node_modules/tslib/tslib.es6.js","./util/api":"util/api.ts","./util/ace-editor":"util/ace-editor.ts","./util/notify.ts":"util/notify.ts","./auth/auth-block.ts":"auth/auth-block.ts","./strategies/detail":"strategies/detail.ts","./strategies/list":"strategies/list.ts","./assignments/list":"assignments/list.ts","./traders/list":"traders/list.ts","lit-element":"../node_modules/lit-element/lit-element.js","lit-element-router":"../node_modules/lit-element-router/lit-element-router.js","./util/notify":"util/notify.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "37053" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/static/app.map