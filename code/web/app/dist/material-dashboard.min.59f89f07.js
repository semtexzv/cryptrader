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
})({"assets/js/material-dashboard.min.js":[function(require,module,exports) {
isWindows = -1 < navigator.platform.indexOf("Win"), isWindows ? ($(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar(), $("html").addClass("perfect-scrollbar-on")) : $("html").addClass("perfect-scrollbar-off");
var breakCards = !0,
    searchVisible = 0,
    transparent = !0,
    transparentDemo = !0,
    fixedTop = !1,
    mobile_menu_visible = 0,
    mobile_menu_initialized = !1,
    toggle_initialized = !1,
    bootstrap_nav_initialized = !1,
    seq = 0,
    delays = 80,
    durations = 500,
    seq2 = 0,
    delays2 = 80,
    durations2 = 500;

function debounce(t, n, i) {
  var r;
  return function () {
    var e = this,
        a = arguments;
    clearTimeout(r), r = setTimeout(function () {
      r = null, i || t.apply(e, a);
    }, n), i && !r && t.apply(e, a);
  };
}

$(document).ready(function () {
  $("body").bootstrapMaterialDesign(), $sidebar = $(".sidebar"), md.initSidebarsCheck(), window_width = $(window).width(), md.checkSidebarImage(), 0 != $(".selectpicker").length && $(".selectpicker").selectpicker(), $('[rel="tooltip"]').tooltip(), $(".form-control").on("focus", function () {
    $(this).parent(".input-group").addClass("input-group-focus");
  }).on("blur", function () {
    $(this).parent(".input-group").removeClass("input-group-focus");
  }), $('input[type="checkbox"][required="true"], input[type="radio"][required="true"]').on("click", function () {
    $(this).hasClass("error") && $(this).closest("div").removeClass("has-error");
  });
}), $(document).on("click", ".navbar-toggler", function () {
  if ($toggle = $(this), 1 == mobile_menu_visible) $("html").removeClass("nav-open"), $(".close-layer").remove(), setTimeout(function () {
    $toggle.removeClass("toggled");
  }, 400), mobile_menu_visible = 0;else {
    setTimeout(function () {
      $toggle.addClass("toggled");
    }, 430);
    var e = $('<div class="close-layer"></div>');
    0 != $("body").find(".main-panel").length ? e.appendTo(".main-panel") : $("body").hasClass("off-canvas-sidebar") && e.appendTo(".wrapper-full-page"), setTimeout(function () {
      e.addClass("visible");
    }, 100), e.click(function () {
      $("html").removeClass("nav-open"), mobile_menu_visible = 0, e.removeClass("visible"), setTimeout(function () {
        e.remove(), $toggle.removeClass("toggled");
      }, 400);
    }), $("html").addClass("nav-open"), mobile_menu_visible = 1;
  }
}), $(window).resize(function () {
  md.initSidebarsCheck(), seq = seq2 = 0, setTimeout(function () {
    md.initDashboardPageCharts();
  }, 500);
}), md = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: !0,
    disabled_collapse_init: 0
  },
  checkSidebarImage: function () {
    $sidebar = $(".sidebar"), image_src = $sidebar.data("image"), void 0 !== image_src && (sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>', $sidebar.append(sidebar_container));
  },
  showNotification: function (e, a) {
    type = ["", "info", "danger", "success", "warning", "rose", "primary"], color = Math.floor(6 * Math.random() + 1), $.notify({
      icon: "add_alert",
      message: "Welcome to <b>Material Dashboard Pro</b> - a beautiful admin panel for every web developer."
    }, {
      type: type[color],
      timer: 3e3,
      placement: {
        from: e,
        align: a
      }
    });
  },
  initDocumentationCharts: function () {
    if (0 != $("#dailySalesChart").length && 0 != $("#websiteViewsChart").length) {
      dataDailySalesChart = {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        series: [[12, 17, 7, 17, 23, 18, 38]]
      }, optionsDailySalesChart = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 50,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };
      new Chartist.Line("#dailySalesChart", dataDailySalesChart, optionsDailySalesChart), new Chartist.Line("#websiteViewsChart", dataDailySalesChart, optionsDailySalesChart);
    }
  },
  initFormExtendedDatetimepickers: function () {
    $(".datetimepicker").datetimepicker({
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: "fa fa-chevron-left",
        next: "fa fa-chevron-right",
        today: "fa fa-screenshot",
        clear: "fa fa-trash",
        close: "fa fa-remove"
      }
    }), $(".datepicker").datetimepicker({
      format: "MM/DD/YYYY",
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: "fa fa-chevron-left",
        next: "fa fa-chevron-right",
        today: "fa fa-screenshot",
        clear: "fa fa-trash",
        close: "fa fa-remove"
      }
    }), $(".timepicker").datetimepicker({
      format: "h:mm A",
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: "fa fa-chevron-left",
        next: "fa fa-chevron-right",
        today: "fa fa-screenshot",
        clear: "fa fa-trash",
        close: "fa fa-remove"
      }
    });
  },
  initSliders: function () {
    var e = document.getElementById("sliderRegular");
    noUiSlider.create(e, {
      start: 40,
      connect: [!0, !1],
      range: {
        min: 0,
        max: 100
      }
    });
    var a = document.getElementById("sliderDouble");
    noUiSlider.create(a, {
      start: [20, 60],
      connect: !0,
      range: {
        min: 0,
        max: 100
      }
    });
  },
  initSidebarsCheck: function () {
    $(window).width() <= 991 && 0 != $sidebar.length && md.initRightMenu();
  },
  checkFullPageBackgroundImage: function () {
    $page = $(".full-page"), image_src = $page.data("image"), void 0 !== image_src && (image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>', $page.append(image_container));
  },
  initDashboardPageCharts: function () {
    if (0 != $("#dailySalesChart").length || 0 != $("#completedTasksChart").length || 0 != $("#websiteViewsChart").length) {
      dataDailySalesChart = {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        series: [[12, 17, 7, 17, 23, 18, 38]]
      }, optionsDailySalesChart = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 50,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };
      var e = new Chartist.Line("#dailySalesChart", dataDailySalesChart, optionsDailySalesChart);
      md.startAnimationForLineChart(e), dataCompletedTasksChart = {
        labels: ["12p", "3p", "6p", "9p", "12p", "3a", "6a", "9a"],
        series: [[230, 750, 450, 300, 280, 240, 200, 190]]
      }, optionsCompletedTasksChart = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 1e3,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };
      var a = new Chartist.Line("#completedTasksChart", dataCompletedTasksChart, optionsCompletedTasksChart);
      md.startAnimationForLineChart(a);
      var t = Chartist.Bar("#websiteViewsChart", {
        labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
      }, {
        axisX: {
          showGrid: !1
        },
        low: 0,
        high: 1e3,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 0
        }
      }, [["screen and (max-width: 640px)", {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (e) {
            return e[0];
          }
        }
      }]]);
      md.startAnimationForBarChart(t);
    }
  },
  initMinimizeSidebar: function () {
    $("#minimizeSidebar").click(function () {
      $(this);
      1 == md.misc.sidebar_mini_active ? ($("body").removeClass("sidebar-mini"), md.misc.sidebar_mini_active = !1) : ($("body").addClass("sidebar-mini"), md.misc.sidebar_mini_active = !0);
      var e = setInterval(function () {
        window.dispatchEvent(new Event("resize"));
      }, 180);
      setTimeout(function () {
        clearInterval(e);
      }, 1e3);
    });
  },
  checkScrollForTransparentNavbar: debounce(function () {
    260 < $(document).scrollTop() ? transparent && (transparent = !1, $(".navbar-color-on-scroll").removeClass("navbar-transparent")) : transparent || (transparent = !0, $(".navbar-color-on-scroll").addClass("navbar-transparent"));
  }, 17),
  initRightMenu: debounce(function () {
    $sidebar_wrapper = $(".sidebar-wrapper"), mobile_menu_initialized ? 991 < $(window).width() && ($sidebar_wrapper.find(".navbar-form").remove(), $sidebar_wrapper.find(".nav-mobile-menu").remove(), mobile_menu_initialized = !1) : ($navbar = $("nav").find(".navbar-collapse").children(".navbar-nav"), mobile_menu_content = "", nav_content = $navbar.html(), nav_content = '<ul class="nav navbar-nav nav-mobile-menu">' + nav_content + "</ul>", navbar_form = $("nav").find(".navbar-form").get(0).outerHTML, $sidebar_nav = $sidebar_wrapper.find(" > .nav"), $nav_content = $(nav_content), $navbar_form = $(navbar_form), $nav_content.insertBefore($sidebar_nav), $navbar_form.insertBefore($nav_content), $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function (e) {
      e.stopPropagation();
    }), window.dispatchEvent(new Event("resize")), mobile_menu_initialized = !0);
  }, 200),
  startAnimationForLineChart: function (e) {
    e.on("draw", function (e) {
      "line" === e.type || "area" === e.type ? e.element.animate({
        d: {
          begin: 600,
          dur: 700,
          from: e.path.clone().scale(1, 0).translate(0, e.chartRect.height()).stringify(),
          to: e.path.clone().stringify(),
          easing: Chartist.Svg.Easing.easeOutQuint
        }
      }) : "point" === e.type && (seq++, e.element.animate({
        opacity: {
          begin: seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: "ease"
        }
      }));
    }), seq = 0;
  },
  startAnimationForBarChart: function (e) {
    e.on("draw", function (e) {
      "bar" === e.type && (seq2++, e.element.animate({
        opacity: {
          begin: seq2 * delays2,
          dur: durations2,
          from: 0,
          to: 1,
          easing: "ease"
        }
      }));
    }), seq2 = 0;
  },
  initFullCalendar: function () {
    $calendar = $("#fullCalendar"), today = new Date(), y = today.getFullYear(), m = today.getMonth(), d = today.getDate(), $calendar.fullCalendar({
      viewRender: function (e, a) {
        "month" != e.name && $(a).find(".fc-scroller").perfectScrollbar();
      },
      header: {
        left: "title",
        center: "month,agendaWeek,agendaDay",
        right: "prev,next,today"
      },
      defaultDate: today,
      selectable: !0,
      selectHelper: !0,
      views: {
        month: {
          titleFormat: "MMMM YYYY"
        },
        week: {
          titleFormat: " MMMM D YYYY"
        },
        day: {
          titleFormat: "D MMM, YYYY"
        }
      },
      select: function (t, n) {
        swal({
          title: "Create an Event",
          html: '<div class="form-group"><input class="form-control" placeholder="Event Title" id="input-field"></div>',
          showCancelButton: !0,
          confirmButtonClass: "btn btn-success",
          cancelButtonClass: "btn btn-danger",
          buttonsStyling: !1
        }).then(function (e) {
          var a;
          event_title = $("#input-field").val(), event_title && (a = {
            title: event_title,
            start: t,
            end: n
          }, $calendar.fullCalendar("renderEvent", a, !0)), $calendar.fullCalendar("unselect");
        }).catch(swal.noop);
      },
      editable: !0,
      eventLimit: !0,
      events: [{
        title: "All Day Event",
        start: new Date(y, m, 1),
        className: "event-default"
      }, {
        id: 999,
        title: "Repeating Event",
        start: new Date(y, m, d - 4, 6, 0),
        allDay: !1,
        className: "event-rose"
      }, {
        id: 999,
        title: "Repeating Event",
        start: new Date(y, m, d + 3, 6, 0),
        allDay: !1,
        className: "event-rose"
      }, {
        title: "Meeting",
        start: new Date(y, m, d - 1, 10, 30),
        allDay: !1,
        className: "event-green"
      }, {
        title: "Lunch",
        start: new Date(y, m, d + 7, 12, 0),
        end: new Date(y, m, d + 7, 14, 0),
        allDay: !1,
        className: "event-red"
      }, {
        title: "Md-pro Launch",
        start: new Date(y, m, d - 2, 12, 0),
        allDay: !0,
        className: "event-azure"
      }, {
        title: "Birthday Party",
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: !1,
        className: "event-azure"
      }, {
        title: "Click for Creative Tim",
        start: new Date(y, m, 21),
        end: new Date(y, m, 22),
        url: "http://www.creative-tim.com/",
        className: "event-orange"
      }, {
        title: "Click for Google",
        start: new Date(y, m, 21),
        end: new Date(y, m, 22),
        url: "http://www.creative-tim.com/",
        className: "event-orange"
      }]
    });
  },
  initVectorMap: function () {
    $("#worldMap").vectorMap({
      map: "world_mill_en",
      backgroundColor: "transparent",
      zoomOnScroll: !1,
      regionStyle: {
        initial: {
          fill: "#e4e4e4",
          "fill-opacity": .9,
          stroke: "none",
          "stroke-width": 0,
          "stroke-opacity": 0
        }
      },
      series: {
        regions: [{
          values: {
            AU: 760,
            BR: 550,
            CA: 120,
            DE: 1300,
            FR: 540,
            GB: 690,
            GE: 200,
            IN: 200,
            RO: 600,
            RU: 300,
            US: 2920
          },
          scale: ["#AAAAAA", "#444444"],
          normalizeFunction: "polynomial"
        }]
      }
    });
  }
};
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "32833" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/material-dashboard.min.js"], null)
//# sourceMappingURL=/static/material-dashboard.min.59f89f07.map