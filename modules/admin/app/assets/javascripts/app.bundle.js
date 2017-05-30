/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(3);
	const injectTapEventPlugin = __webpack_require__(4);
	const Main_1 = __webpack_require__(17);
	injectTapEventPlugin();
	ReactDOM.render(React.createElement(Main_1.default, null), document.getElementById('react-app'));
	//# sourceMappingURL=app.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(1);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = react_lib;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(36);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var invariant = __webpack_require__(6);
	var defaultClickRejectionStrategy = __webpack_require__(7);
	
	var alreadyInjected = false;
	
	module.exports = function injectTapEventPlugin (strategyOverrides) {
	  strategyOverrides = strategyOverrides || {}
	  var shouldRejectClick = strategyOverrides.shouldRejectClick || defaultClickRejectionStrategy;
	
	  if (process.env.NODE_ENV !== 'production') {
	    invariant(
	      !alreadyInjected,
	      'injectTapEventPlugin(): Can only be called once per application lifecycle.\n\n\
	It is recommended to call injectTapEventPlugin() just before you call \
	ReactDOM.render(). If you are using an external library which calls injectTapEventPlugin() \
	itself, please contact the maintainer as it shouldn\'t be called in library code and \
	should be injected by the application.'
	    )
	  }
	
	  alreadyInjected = true;
	
	  __webpack_require__(8).injection.injectEventPluginsByName({
	    'TapEventPlugin':       __webpack_require__(9)(shouldRejectClick)
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(3);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(8);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = function(lastTouchEvent, clickTimestamp) {
	  if (lastTouchEvent && (clickTimestamp - lastTouchEvent) < 750) {
	    return true;
	  }
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(46);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TapEventPlugin
	 * @typechecks static-only
	 */
	
	"use strict";
	
	var EventConstants = __webpack_require__(10);
	var EventPluginUtils = __webpack_require__(11);
	var EventPropagators = __webpack_require__(12);
	var SyntheticUIEvent = __webpack_require__(13);
	var TouchEventUtils = __webpack_require__(14);
	var ViewportMetrics = __webpack_require__(15);
	
	var keyOf = __webpack_require__(16);
	var topLevelTypes = EventConstants.topLevelTypes;
	
	var isStartish = EventPluginUtils.isStartish;
	var isEndish = EventPluginUtils.isEndish;
	
	var isTouch = function(topLevelType) {
	  var touchTypes = [
	    'topTouchCancel',
	    'topTouchEnd',
	    'topTouchStart',
	    'topTouchMove'
	  ];
	  return touchTypes.indexOf(topLevelType) >= 0;
	}
	
	/**
	 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
	 * in order to still be considered a 'tap' event.
	 */
	var tapMoveThreshold = 10;
	var ignoreMouseThreshold = 750;
	var startCoords = {x: null, y: null};
	var lastTouchEvent = null;
	
	var Axis = {
	  x: {page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft'},
	  y: {page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop'}
	};
	
	function getAxisCoordOfEvent(axis, nativeEvent) {
	  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
	  if (singleTouch) {
	    return singleTouch[axis.page];
	  }
	  return axis.page in nativeEvent ?
	    nativeEvent[axis.page] :
	    nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
	}
	
	function getDistance(coords, nativeEvent) {
	  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
	  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
	  return Math.pow(
	    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
	    0.5
	  );
	}
	
	var touchEvents = [
	  'topTouchStart',
	  'topTouchCancel',
	  'topTouchEnd',
	  'topTouchMove',
	];
	
	var dependencies = [
	  'topMouseDown',
	  'topMouseMove',
	  'topMouseUp',
	].concat(touchEvents);
	
	var eventTypes = {
	  touchTap: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onTouchTap: null}),
	      captured: keyOf({onTouchTapCapture: null})
	    },
	    dependencies: dependencies
	  }
	};
	
	var now = (function() {
	  if (Date.now) {
	    return Date.now;
	  } else {
	    // IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
	    return function () {
	      return +new Date;
	    }
	  }
	})();
	
	function createTapEventPlugin(shouldRejectClick) {
	  return {
	
	    tapMoveThreshold: tapMoveThreshold,
	
	    ignoreMouseThreshold: ignoreMouseThreshold,
	
	    eventTypes: eventTypes,
	
	    /**
	     * @param {string} topLevelType Record from `EventConstants`.
	     * @param {DOMEventTarget} targetInst The listening component root node.
	     * @param {object} nativeEvent Native browser event.
	     * @return {*} An accumulation of synthetic events.
	     * @see {EventPluginHub.extractEvents}
	     */
	    extractEvents: function(
	      topLevelType,
	      targetInst,
	      nativeEvent,
	      nativeEventTarget
	    ) {
	
	      if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
	        return null;
	      }
	
	      if (isTouch(topLevelType)) {
	        lastTouchEvent = now();
	      } else {
	        if (shouldRejectClick(lastTouchEvent, now())) {
	          return null;
	        }
	      }
	
	      var event = null;
	      var distance = getDistance(startCoords, nativeEvent);
	      if (isEndish(topLevelType) && distance < tapMoveThreshold) {
	        event = SyntheticUIEvent.getPooled(
	          eventTypes.touchTap,
	          targetInst,
	          nativeEvent,
	          nativeEventTarget
	        );
	      }
	      if (isStartish(topLevelType)) {
	        startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
	        startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
	      } else if (isEndish(topLevelType)) {
	        startCoords.x = 0;
	        startCoords.y = 0;
	      }
	      EventPropagators.accumulateTwoPhaseDispatches(event);
	      return event;
	    }
	
	  };
	}
	
	module.exports = createTapEventPlugin;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	/**
	 * Types of raw signals from the browser caught at the top level.
	 */
	var topLevelTypes = {
	  topAbort: null,
	  topAnimationEnd: null,
	  topAnimationIteration: null,
	  topAnimationStart: null,
	  topBlur: null,
	  topCanPlay: null,
	  topCanPlayThrough: null,
	  topChange: null,
	  topClick: null,
	  topCompositionEnd: null,
	  topCompositionStart: null,
	  topCompositionUpdate: null,
	  topContextMenu: null,
	  topCopy: null,
	  topCut: null,
	  topDoubleClick: null,
	  topDrag: null,
	  topDragEnd: null,
	  topDragEnter: null,
	  topDragExit: null,
	  topDragLeave: null,
	  topDragOver: null,
	  topDragStart: null,
	  topDrop: null,
	  topDurationChange: null,
	  topEmptied: null,
	  topEncrypted: null,
	  topEnded: null,
	  topError: null,
	  topFocus: null,
	  topInput: null,
	  topInvalid: null,
	  topKeyDown: null,
	  topKeyPress: null,
	  topKeyUp: null,
	  topLoad: null,
	  topLoadedData: null,
	  topLoadedMetadata: null,
	  topLoadStart: null,
	  topMouseDown: null,
	  topMouseMove: null,
	  topMouseOut: null,
	  topMouseOver: null,
	  topMouseUp: null,
	  topPaste: null,
	  topPause: null,
	  topPlay: null,
	  topPlaying: null,
	  topProgress: null,
	  topRateChange: null,
	  topReset: null,
	  topScroll: null,
	  topSeeked: null,
	  topSeeking: null,
	  topSelectionChange: null,
	  topStalled: null,
	  topSubmit: null,
	  topSuspend: null,
	  topTextInput: null,
	  topTimeUpdate: null,
	  topTouchCancel: null,
	  topTouchEnd: null,
	  topTouchMove: null,
	  topTouchStart: null,
	  topTransitionEnd: null,
	  topVolumeChange: null,
	  topWaiting: null,
	  topWheel: null
	};
	
	var EventConstants = {
	  topLevelTypes: topLevelTypes
	};
	
	module.exports = EventConstants;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(48);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(45);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(79);

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TouchEventUtils
	 */
	
	var TouchEventUtils = {
	  /**
	   * Utility function for common case of extracting out the primary touch from a
	   * touch event.
	   * - `touchEnd` events usually do not have the `touches` property.
	   *   http://stackoverflow.com/questions/3666929/
	   *   mobile-sarai-touchend-event-not-firing-when-last-touch-is-removed
	   *
	   * @param {Event} nativeEvent Native event that may or may not be a touch.
	   * @return {TouchesObject?} an object with pageX and pageY or null.
	   */
	  extractSingleTouch: function(nativeEvent) {
	    var touches = nativeEvent.touches;
	    var changedTouches = nativeEvent.changedTouches;
	    var hasTouches = touches && touches.length > 0;
	    var hasChangedTouches = changedTouches && changedTouches.length > 0;
	
	    return !hasTouches && hasChangedTouches ? changedTouches[0] :
	           hasTouches ? touches[0] :
	           nativeEvent;
	  }
	};
	
	module.exports = TouchEventUtils;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(80);

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without losing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	var keyOf = function keyOf(oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};
	
	module.exports = keyOf;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const SplitPane = __webpack_require__(18);
	const LargeView_1 = __webpack_require__(19);
	const SideMenu_1 = __webpack_require__(21);
	const PagesPanel_1 = __webpack_require__(22);
	const AssetsPanel_1 = __webpack_require__(35);
	class Main extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.itemsNonFocusable = [
	            { key: "new", name: "New", iconProps: { iconName: "add" } }
	        ];
	        this.farItemsNonFocusable = [
	            { key: "test", name: "Test", iconProps: { iconName: "add" } }
	        ];
	        this.state = { section: "pages", selected: "" };
	    }
	    switchSection(s) {
	        this.setState({ section: s });
	    }
	    render() {
	        return (React.createElement("div", null,
	            React.createElement(SideMenu_1.SideMenu, null,
	                React.createElement(SideMenu_1.SideMenuItem, { active: this.state.section == "home", icon: "home", onClick: () => this.switchSection("home") }, "DashBoard"),
	                React.createElement(SideMenu_1.SideMenuItem, { active: this.state.section == "pages", icon: "files-o", onClick: () => this.switchSection("pages") }, "Pages"),
	                React.createElement(SideMenu_1.SideMenuItem, { active: this.state.section == "entities", icon: "cubes", onClick: () => this.switchSection("entities") }, "Entities"),
	                React.createElement(SideMenu_1.SideMenuItem, { active: this.state.section == "assets", icon: "picture-o", onClick: () => this.switchSection("assets") }, "Assets"),
	                React.createElement(SideMenu_1.SideMenuItem, { active: this.state.section == "settings", icon: "gears", onClick: () => this.switchSection("settings") }, "Settings")),
	            React.createElement("div", { className: "splitpane-container" },
	                React.createElement(SplitPane, { split: "vertical", defaultSize: 400, minSize: 100 },
	                    React.createElement("div", { className: "leftpanel" },
	                        React.createElement("div", { className: this.state.section == "pages" ? "show" : "hide" },
	                            React.createElement(PagesPanel_1.default, null)),
	                        React.createElement("div", { className: this.state.section == "assets" ? "show" : "hide" },
	                            React.createElement(AssetsPanel_1.default, null))),
	                    React.createElement("div", null,
	                        React.createElement(LargeView_1.default, null))))));
	    }
	}
	exports.default = Main;
	//# sourceMappingURL=Main.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(182);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const semantic_ui_react_1 = __webpack_require__(20);
	class LargeView extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = { activeItem: "bio" };
	    }
	    handleItemClick(e, t) {
	        this.setState({ activeItem: t.name });
	    }
	    render() {
	        let activeItem = this.state.activeItem;
	        return (React.createElement("div", null,
	            React.createElement(semantic_ui_react_1.Menu, { className: "tabbar", tabular: true },
	                React.createElement(semantic_ui_react_1.Menu.Item, { name: 'bio', active: activeItem === 'bio', onClick: this.handleItemClick.bind(this) }),
	                React.createElement(semantic_ui_react_1.Menu.Item, { name: 'photos', active: activeItem === 'photos', onClick: this.handleItemClick.bind(this) })),
	            React.createElement(semantic_ui_react_1.Segment, { className: "toolbar", inverted: true },
	                React.createElement(semantic_ui_react_1.Menu, { inverted: true, icon: "labeled", size: "massive" },
	                    React.createElement(semantic_ui_react_1.Menu.Item, { name: 'home', active: false, onClick: this.handleItemClick.bind(this) },
	                        React.createElement(semantic_ui_react_1.Icon, { name: 'unhide' }),
	                        "Save & publish"),
	                    React.createElement(semantic_ui_react_1.Menu.Item, { name: 'Save', active: false, onClick: this.handleItemClick.bind(this) },
	                        React.createElement(semantic_ui_react_1.Icon, { name: 'save' }),
	                        "Save"),
	                    React.createElement(semantic_ui_react_1.Menu.Item, { name: 'properties', active: false, onClick: this.handleItemClick.bind(this) },
	                        React.createElement(semantic_ui_react_1.Icon, { name: 'setting' }),
	                        "Properties"),
	                    React.createElement(semantic_ui_react_1.Menu.Item, { name: 'delete', position: "right", active: false, onClick: this.handleItemClick.bind(this) },
	                        React.createElement(semantic_ui_react_1.Icon, { name: 'trash' }),
	                        "Remove")))));
	    }
	}
	exports.default = LargeView;
	//# sourceMappingURL=LargeView.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(229);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	function SideMenuItem(props) {
	    return (React.createElement("li", { className: props.active ? "active" : "", onClick: props.onClick },
	        React.createElement("i", { className: "fa fa-" + props.icon, "aria-hidden": "true" }),
	        React.createElement("p", null, props.children)));
	}
	exports.SideMenuItem = SideMenuItem;
	class SideMenu extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    render() {
	        return (React.createElement("div", { className: "menuleft" },
	            React.createElement("ul", null,
	                this.props.children,
	                React.createElement("li", { className: "signoutbtn" },
	                    React.createElement("a", { href: "/admin/logout" },
	                        React.createElement("i", { className: "fa fa-sign-out", "aria-hidden": "true" }),
	                        React.createElement("p", null, "Logout"))))));
	    }
	}
	exports.SideMenu = SideMenu;
	//# sourceMappingURL=SideMenu.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const TreeView_1 = __webpack_require__(23);
	const Api = __webpack_require__(24);
	const PageTreeLabel_1 = __webpack_require__(29);
	const semantic_ui_react_1 = __webpack_require__(20);
	class PagesPanel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            documents: [], treeItems: [], working: true, pagetypes: [], selected: null
	        };
	    }
	    toTreeItems(docs) {
	        return docs.map(doc => {
	            return {
	                key: doc.doc.id.toString(),
	                name: doc.doc.name,
	                collapsed: doc.doc.collapsed,
	                children: this.toTreeItems(doc.children),
	                item: doc
	            };
	        });
	    }
	    refresh() {
	        Api.getDocuments().then(documents => {
	            var items = this.toTreeItems(documents);
	            this.setState({ documents: documents, treeItems: items, working: false });
	        });
	    }
	    componentDidMount() {
	        Api.getPageTypes().then(types => {
	            Api.getDocuments().then(documents => {
	                var items = this.toTreeItems(documents);
	                this.setState({ documents: documents, pagetypes: types, treeItems: items, working: false });
	            });
	        });
	    }
	    onContextTriggered(n) {
	    }
	    onRenamed(doc) {
	        this.setState({ working: true }, () => {
	            Api.renameDocument(doc).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    onAdded(parent_id, name, pagetype) {
	        this.setState({ working: true }, () => {
	            Api.addDocument(parent_id, name, pagetype).then(x => {
	                Api.getDocuments().then(documents => {
	                    var items = this.toTreeItems(documents);
	                    var newSelection = {
	                        key: x.id.toString(),
	                        name: x.name,
	                        collapsed: x.collapsed,
	                        children: [],
	                        item: null
	                    };
	                    this.setState({ documents: documents, treeItems: items, selected: newSelection, working: false });
	                });
	            });
	        });
	    }
	    onDeleted(doc) {
	        this.setState({ working: true }, () => {
	            Api.deleteDocument(doc).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    onParentChanged(sourceid, targetid) {
	        this.setState({ working: true }, () => {
	            Api.updateParentDocument(sourceid, targetid).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    renderLabel(n) {
	        return (React.createElement(PageTreeLabel_1.default, { onRenamed: this.onRenamed.bind(this), onAdded: this.onAdded.bind(this), onDeleted: this.onDeleted.bind(this), onParentChanged: this.onParentChanged.bind(this), pagetypes: this.state.pagetypes, item: n, onContextTriggered: this.onContextTriggered.bind(this) }));
	    }
	    handleItemClick() {
	        this.setState(Object.assign({}, this.state, { working: true }), () => {
	            setTimeout(x => {
	                this.refresh();
	            }, 500);
	        });
	    }
	    render() {
	        if (this.state.treeItems.length == 0) {
	            return (React.createElement(semantic_ui_react_1.Menu, { className: "smalltoolbar", icon: true },
	                React.createElement(semantic_ui_react_1.Menu.Item, { name: 'refresh', active: false, onClick: this.handleItemClick.bind(this) },
	                    React.createElement(semantic_ui_react_1.Icon, { name: 'refresh' })),
	                React.createElement(semantic_ui_react_1.Menu.Item, { position: 'right' },
	                    React.createElement(semantic_ui_react_1.Loader, { active: true, size: "tiny", inline: true }))));
	        }
	        return (React.createElement("div", null,
	            React.createElement(semantic_ui_react_1.Menu, { className: "smalltoolbar", icon: true },
	                React.createElement(semantic_ui_react_1.Menu.Item, { name: 'refresh', position: "right", active: false, onClick: this.handleItemClick.bind(this) }, this.state.working ? React.createElement(semantic_ui_react_1.Loader, { active: true, size: "tiny", inline: true }) : React.createElement(semantic_ui_react_1.Icon, { name: 'refresh' }))),
	            React.createElement(TreeView_1.default, { items: this.state.treeItems, selected: this.state.selected, onClick: (n) => {
	                    this.setState({ selected: n });
	                }, onRenderLabel: this.renderLabel.bind(this), onCollapse: (i, state) => {
	                    Api.collapseDocument(i.item.doc.id, state);
	                } })));
	    }
	}
	exports.default = PagesPanel;
	//# sourceMappingURL=PagesPanel.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(3);
	class TreeView extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this._emptySelection = {
	            key: "",
	            name: "",
	            collapsed: false,
	            children: [],
	            item: {}
	        };
	        if (this.props.selected) {
	            this.state = { selected: this.props.selected };
	        }
	        else {
	            this.state = { selected: this._emptySelection };
	        }
	    }
	    componentWillReceiveProps(nextprops) {
	        let notNull = nextprops.selected != null && this.props.selected != null;
	        if (nextprops.selected != null && this.props.selected == null) {
	            this.setState({ selected: nextprops.selected });
	        }
	        else if (notNull && nextprops.selected.key != this.props.selected.key) {
	            this.setState({ selected: nextprops.selected });
	        }
	    }
	    componentDidMount() {
	        document.addEventListener('mousedown', function (e) {
	            let treeNode = ReactDOM.findDOMNode(this.refs.tree);
	            let targetElement = e.target;
	            let targetParent = targetElement.parentElement;
	            let isTreeAction = targetElement.classList.contains("treeaction") || targetParent.classList.contains("treeaction");
	            let containsElement = treeNode.contains(targetElement);
	            let contextOpen = treeNode.getElementsByClassName("contextmenu").length > 0;
	            if (!containsElement && !contextOpen && !isTreeAction) {
	                this.setState({ selected: this._emptySelection });
	            }
	        }.bind(this));
	    }
	    onClick(n) {
	        this.setState({ selected: n });
	        this.props.onClick(n);
	    }
	    render() {
	        return (React.createElement("div", { ref: 'tree', className: "TreeContainer" },
	            React.createElement("nav", { role: "navigation" },
	                React.createElement(SubTreeView, { visible: true, items: this.props.items, onClick: this.onClick.bind(this), selected: this.state.selected, onCollapse: this.props.onCollapse, onRenderLabel: this.props.onRenderLabel }))));
	    }
	}
	exports.default = TreeView;
	class SubTreeView extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    renderTreeNode(n) {
	        return (React.createElement(SubTreeViewNode, { key: n.key, onRenderLabel: this.props.onRenderLabel, selected: this.props.selected, onclick: this.props.onClick, onCollapse: this.props.onCollapse, item: n }));
	    }
	    render() {
	        let visibleClass = this.props.visible ? "" : " hidden";
	        return (React.createElement("ul", { className: "navItems" + visibleClass }, this.props.items.map(node => this.renderTreeNode(node))));
	    }
	}
	SubTreeView.defaultProps = {
	    selected: null,
	    onRenderLabel: (n) => {
	        return (React.createElement("span", null,
	            React.createElement("i", { className: "fa fa-file-text", "aria-hidden": "true" }),
	            " ",
	            n.name));
	    }
	};
	class SubTreeViewNode extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            collapsed: props.item.collapsed
	        };
	    }
	    switchCollapseState() {
	        this.setState(Object.assign({}, this.state, { collapsed: !this.state.collapsed }), () => {
	            this.props.onCollapse(this.props.item, this.state.collapsed);
	        });
	    }
	    renderCollapseBtn() {
	        let icon = this.state.collapsed ? "angle-down" : "angle-down rotateIcon";
	        return (React.createElement("span", { onClick: this.switchCollapseState.bind(this), className: "beforeLabel collapseButton" },
	            React.createElement("i", { className: "chevronIcon fa fa-" + icon })));
	    }
	    renderEmptyPlaceholder() {
	        return (React.createElement("span", { className: "beforeLabel emptyPlaceHolder" }));
	    }
	    renderChilren(node) {
	        if (node.children.length == 0)
	            return null;
	        else {
	            return (React.createElement(SubTreeView, { visible: this.state.collapsed, items: node.children, onRenderLabel: this.props.onRenderLabel, onClick: this.props.onclick, onCollapse: this.props.onCollapse, selected: this.props.selected }));
	        }
	    }
	    renderTreeItem(node) {
	        let isSelected = this.props.selected.key == node.key;
	        return (React.createElement("li", { ref: "treenode", className: "navItem", key: node.key },
	            React.createElement("div", { className: isSelected ? "compositeLink selected" : "compositeLink" },
	                node.children.length > 0 ? this.renderCollapseBtn() : this.renderEmptyPlaceholder(),
	                React.createElement("span", { onClick: () => this.props.onclick(node), onContextMenu: () => this.props.onclick(node), className: "link" }, this.props.onRenderLabel(node))),
	            this.renderChilren(node)));
	    }
	    render() {
	        return this.renderTreeItem(this.props.item);
	    }
	}
	//# sourceMappingURL=TreeView.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(25));
	__export(__webpack_require__(28));
	//# sourceMappingURL=Api.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiBase_js_1 = __webpack_require__(26);
	function getPageTypes() {
	    return ApiBase_js_1.default("/admin/api/v1/pagetypes", "GET").then(r => r.pagetypes);
	}
	exports.getPageTypes = getPageTypes;
	function getDocuments() {
	    return ApiBase_js_1.default("/admin/api/v1/documents", "GET").then(r => r);
	}
	exports.getDocuments = getDocuments;
	function renameDocument(doc) {
	    var body = JSON.stringify({
	        "name": doc.name
	    });
	    return ApiBase_js_1.default("/admin/api/v1/documents/" + doc.id + "/rename", "PUT", body);
	}
	exports.renameDocument = renameDocument;
	function addDocument(parent_id, name, pagetype) {
	    var body = JSON.stringify({
	        "document": {
	            "parent_id": parent_id,
	            "name": name,
	            "pagetype": pagetype
	        }
	    });
	    return ApiBase_js_1.default("/adminn/api/v1/documents", "POST", body);
	}
	exports.addDocument = addDocument;
	function deleteDocument(doc) {
	    return ApiBase_js_1.default("/admin/api/v1/documents/" + doc.id, "DELETE");
	}
	exports.deleteDocument = deleteDocument;
	function updateParentDocument(source_id, parent_id) {
	    var body = JSON.stringify({
	        "parent_id": parent_id
	    });
	    return ApiBase_js_1.default("/admin/api/v1/documents/" + source_id + "/updateparent", "PUT", body);
	}
	exports.updateParentDocument = updateParentDocument;
	function collapseDocument(id, collapsed) {
	    var body = JSON.stringify({
	        "collapsed": collapsed
	    });
	    return ApiBase_js_1.default("/admin/api/v1/documents/" + id + "/collapse", "PUT", body);
	}
	exports.collapseDocument = collapseDocument;
	//# sourceMappingURL=DocumentsApi.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiError_1 = __webpack_require__(27);
	var csrf = document.getElementById("csrftoken").innerText;
	function ApiCall(call, method, body, contenttype) {
	    var headers = {
	        "Csrf-Token": csrf
	    };
	    if (contenttype != null && contenttype != "none") {
	        headers["Content-Type"] = contenttype;
	    }
	    else if (contenttype == null) {
	        headers["Content-Type"] = "application/json";
	    }
	    var params = {
	        method: method,
	        credentials: "include",
	        headers: headers
	    };
	    if ((method != "GET" && method != "HEAD") && body != null) {
	        params["body"] = body;
	    }
	    return fetch(call, params).then(response => {
	        if (!response.ok) {
	            return response.text().then(r => {
	                let info = {
	                    errorCode: response.status,
	                    method: method,
	                    params: body == null ? "{}" : body.toString(),
	                    responseBody: r,
	                    statusText: response.statusText,
	                    url: call
	                };
	                ApiError_1.default(info);
	                return response;
	            });
	        }
	        return response;
	    }).then(r => {
	        if (r.ok) {
	            return r.json();
	        }
	        else {
	            return r;
	        }
	    });
	}
	exports.default = ApiCall;
	//# sourceMappingURL=ApiBase.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(3);
	const semantic_ui_react_1 = __webpack_require__(20);
	class ApiErrorView extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = { activeItem: "request" };
	    }
	    renderParams() {
	        let params = JSON.stringify(JSON.parse(this.props.info.params), null, 4);
	        return (React.createElement("div", { style: { whiteSpace: 'pre' } }, params));
	    }
	    render() {
	        let activeItem = this.state.activeItem;
	        return (React.createElement(semantic_ui_react_1.Modal, { style: { minHeight: "500px" }, onClose: this.props.onClose, defaultOpen: true },
	            React.createElement(semantic_ui_react_1.Modal.Header, null,
	                "Error ",
	                this.props.info.errorCode + ": " + this.props.info.statusText),
	            React.createElement(semantic_ui_react_1.Modal.Content, null,
	                React.createElement(semantic_ui_react_1.Modal.Description, null,
	                    React.createElement(semantic_ui_react_1.Menu, { pointing: true, secondary: true },
	                        React.createElement(semantic_ui_react_1.Menu.Item, { name: 'request', active: activeItem === 'request', onClick: () => this.setState({ activeItem: "request" }) }),
	                        React.createElement(semantic_ui_react_1.Menu.Item, { name: 'response', active: activeItem === 'response', onClick: () => this.setState({ activeItem: "response" }) })),
	                    React.createElement("div", { style: { display: activeItem == "request" ? "block" : "none" } },
	                        React.createElement(semantic_ui_react_1.Table, { basic: 'very' },
	                            React.createElement(semantic_ui_react_1.Table.Body, null,
	                                React.createElement(semantic_ui_react_1.Table.Row, null,
	                                    React.createElement(semantic_ui_react_1.Table.Cell, null, "Request method"),
	                                    React.createElement(semantic_ui_react_1.Table.Cell, null, this.props.info.method)),
	                                React.createElement(semantic_ui_react_1.Table.Row, null,
	                                    React.createElement(semantic_ui_react_1.Table.Cell, null, "URL"),
	                                    React.createElement(semantic_ui_react_1.Table.Cell, null, this.props.info.url)),
	                                React.createElement(semantic_ui_react_1.Table.Row, null,
	                                    React.createElement(semantic_ui_react_1.Table.Cell, null, "Body"),
	                                    React.createElement(semantic_ui_react_1.Table.Cell, null, this.renderParams()))))),
	                    React.createElement("iframe", { style: { display: activeItem == "response" ? "block" : "none" }, width: "100%", height: "342", src: "data:text/html;charset=utf-8," + encodeURI(this.props.info.responseBody) })))));
	    }
	}
	function ApiError(info) {
	    let onClose = function () {
	        document.getElementById("errordiv").innerHTML = "";
	    };
	    ReactDOM.render(React.createElement(ApiErrorView, { info: info, onClose: onClose }), document.getElementById('errordiv'));
	}
	exports.default = ApiError;
	//# sourceMappingURL=ApiError.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiBase_js_1 = __webpack_require__(26);
	function getAssets() {
	    return ApiBase_js_1.default("/admin/api/v1/assets", "GET").then(r => r);
	}
	exports.getAssets = getAssets;
	function renameAsset(asset) {
	    var body = JSON.stringify({
	        "name": asset.label
	    });
	    return ApiBase_js_1.default("/admin/api/v1/assets/" + asset.id + "/rename", "PUT", body);
	}
	exports.renameAsset = renameAsset;
	function addAsset(parent_id, name, path, mimetype) {
	    var body = JSON.stringify({
	        'parent_id': parent_id,
	        'name': name,
	        'server_path': path,
	        'mimetype': mimetype
	    });
	    return ApiBase_js_1.default("/admin/api/v1/assets", "POST", body).then(r => r);
	}
	exports.addAsset = addAsset;
	function uploadAsset(file) {
	    var data = new FormData();
	    data.append("asset", file);
	    return ApiBase_js_1.default("/admin/api/v1/assets/upload", "POST", data, "none").then(r => r);
	}
	exports.uploadAsset = uploadAsset;
	function deleteAsset(asset) {
	    return ApiBase_js_1.default("/admin/api/v1/assets/" + asset.id, "DELETE");
	}
	exports.deleteAsset = deleteAsset;
	function getAsset(id) {
	    return ApiBase_js_1.default("/admin/api/v1/assets/" + id, "GET");
	}
	exports.getAsset = getAsset;
	function updateParentAsset(id, parent_id) {
	    var body = JSON.stringify({
	        "parent_id": parent_id
	    });
	    return ApiBase_js_1.default("/admin/api/v1/assets/" + id + "/updateparent", "PUT", body);
	}
	exports.updateParentAsset = updateParentAsset;
	function collapseAsset(id, collapsed) {
	    var body = JSON.stringify({
	        "collapsed": collapsed
	    });
	    return ApiBase_js_1.default("/admin/api/v1/assets/" + id + "/collapse", "PUT", body);
	}
	exports.collapseAsset = collapseAsset;
	//# sourceMappingURL=AssetsApi.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const PageTreeContextMenu_1 = __webpack_require__(30);
	const RenameMode_1 = __webpack_require__(32);
	const AddMode_1 = __webpack_require__(33);
	const draggable_1 = __webpack_require__(34);
	class PageTreeLabel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            editmode: false, deleted: false, contextMenuVisible: false, menutarget: null, addtype: "", label: props.item.name, addingmode: false
	        };
	    }
	    componentWillReceiveProps(nextProps) {
	        if (nextProps.item.name != this.props.item.name) {
	            this.setState({ label: nextProps.item.name });
	        }
	    }
	    toggleContextMenu(e) {
	        this.props.onContextTriggered(this.props.item);
	        e.persist();
	        e.preventDefault();
	        this.setState(Object.assign({}, this.state, { contextMenuVisible: true, menutarget: e }));
	    }
	    renderContextMenu() {
	        return (React.createElement(PageTreeContextMenu_1.default, { target: this.state.menutarget.nativeEvent, pagetypes: this.props.pagetypes, isRootNode: this.props.item.item.doc.doctype == "home", onDismiss: this._onDismiss.bind(this), onToggleAdd: (t) => this.setState({ addingmode: true, addtype: t }), onToggleDelete: () => {
	                if (confirm("Are you sure?")) {
	                    this.setState({ deleted: true }, () => {
	                        this.props.onDeleted(this.props.item.item.doc);
	                    });
	                }
	            }, onToggleEdit: this._onToggleEdit.bind(this) }));
	    }
	    renderAddForm() {
	        return (React.createElement(AddMode_1.default, { icon: "file-code-o", onBlur: () => this.setState({ addingmode: false }), onSubmit: (val) => {
	                this.setState({ addingmode: false }, () => {
	                    this.props.onAdded(this.props.item.item.doc.id, val, this.state.addtype);
	                });
	            } }));
	    }
	    renderEditForm() {
	        let icon = this.props.item.item.doc.doctype == "home" ? "home" : "file-code-o";
	        return (React.createElement(RenameMode_1.default, { defaultValue: this.props.item.item.doc.name, icon: icon, onBlur: this._onToggleEdit.bind(this), onSubmit: (newname) => {
	                this.setState({ label: newname, editmode: false }, () => {
	                    this.props.onRenamed(Object.assign({}, this.props.item.item.doc, { name: newname }));
	                });
	            } }));
	    }
	    render() {
	        let icon = this.props.item.item.doc.doctype == "home" ? "home" : "file-code-o";
	        if (this.state.editmode)
	            return this.renderEditForm();
	        return (React.createElement(draggable_1.default, { isDropTarget: true, onDrop: this.props.onParentChanged.bind(this), item: this.props.item, className: this.state.deleted ? "deleted dragitem" : "dragitem", onContextMenu: this.toggleContextMenu.bind(this) },
	            React.createElement("i", { className: "fa fa-" + icon + " fileicon", "aria-hidden": "true" }),
	            " ",
	            this.state.label,
	            this.state.addingmode ? this.renderAddForm() : null,
	            this.state.contextMenuVisible ? this.renderContextMenu() : null));
	    }
	    _onDismiss() {
	        this.setState({ contextMenuVisible: false });
	    }
	    _onToggleSelect() {
	        return true;
	    }
	    _onToggleEdit() {
	        this.setState({ editmode: !this.state.editmode });
	    }
	}
	exports.default = PageTreeLabel;
	//# sourceMappingURL=PageTreeLabel.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ContextMenu_1 = __webpack_require__(31);
	class PageTreeContextMenu extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    handleItemClick() {
	    }
	    render() {
	        let target = {
	            x: this.props.target.clientX,
	            y: this.props.target.clientY
	        };
	        let newtypes = this.props.pagetypes.map(x => {
	            return {
	                key: x.typekey,
	                label: x.typename,
	                onClick: () => this.props.onToggleAdd(x.typekey),
	                children: []
	            };
	        });
	        return (React.createElement(ContextMenu_1.default, { target: target, items: [
	                {
	                    icon: "plus",
	                    label: "Create New...",
	                    onClick: this.handleItemClick.bind(this),
	                    children: newtypes
	                },
	                {
	                    icon: "write",
	                    label: "Rename",
	                    onClick: this.props.onToggleEdit,
	                    children: [],
	                    disabled: this.props.isRootNode
	                },
	                {
	                    icon: "trash",
	                    label: "Remove",
	                    onClick: this.props.onToggleDelete,
	                    children: [],
	                    disabled: this.props.isRootNode
	                },
	                {
	                    label: "Dublicate",
	                    onClick: this.handleItemClick.bind(this),
	                    children: [],
	                    disabled: this.props.isRootNode
	                },
	                {
	                    label: "Properties",
	                    onClick: this.handleItemClick.bind(this),
	                    children: []
	                },
	                {
	                    label: "Open",
	                    onClick: this.handleItemClick.bind(this),
	                    children: []
	                }
	            ], onDismiss: this.props.onDismiss }));
	    }
	}
	exports.default = PageTreeContextMenu;
	//# sourceMappingURL=PageTreeContextMenu.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const semantic_ui_react_1 = __webpack_require__(20);
	class ContextMenu extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.mouseDown = this.onDismiss.bind(this);
	    }
	    componentDidMount() {
	        document.addEventListener('mousedown', this.mouseDown);
	    }
	    componentWillUnmount() {
	        document.removeEventListener('mousedown', this.mouseDown);
	    }
	    onDismiss(e) {
	        let menu = this.refs.contextmenu;
	        if (menu != undefined && !menu.contains(e.target)) {
	            this.props.onDismiss();
	        }
	    }
	    renderMenuItem(item) {
	        const itemClicked = () => {
	            this.props.onDismiss();
	            item.onClick();
	        };
	        return (React.createElement(semantic_ui_react_1.Menu.Item, { key: item.label, disabled: item.disabled ? item.disabled : false, name: item.label, icon: item.icon, active: false, onClick: itemClicked }));
	    }
	    renderSubMenuItem(item) {
	        return (React.createElement(semantic_ui_react_1.Dropdown, { key: item.label, item: true, text: item.label },
	            React.createElement(semantic_ui_react_1.Dropdown.Menu, null, item.children.map(x => {
	                const itemClicked = () => {
	                    this.props.onDismiss();
	                    x.onClick();
	                };
	                return (React.createElement(semantic_ui_react_1.Dropdown.Item, { key: x.label, disabled: item.disabled ? item.disabled : false, icon: x.icon, text: x.label, onClick: itemClicked }));
	            }))));
	    }
	    renderItem(item) {
	        if (item.children.length > 0)
	            return this.renderSubMenuItem(item);
	        else
	            return this.renderMenuItem(item);
	    }
	    render() {
	        let top = this.props.target.y + "px";
	        let left = this.props.target.x + "px";
	        return (React.createElement("div", { className: "contextmenu", ref: "contextmenu", style: { position: 'fixed', top: top, left: left, zIndex: 999 } },
	            React.createElement(semantic_ui_react_1.Menu, { compact: true, pointing: true, vertical: true }, this.props.items.map(x => this.renderItem(x)))));
	    }
	}
	exports.default = ContextMenu;
	//# sourceMappingURL=ContextMenu.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	class RenameMode extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    render() {
	        return (React.createElement("div", { className: "renameContainer" },
	            React.createElement("div", { className: "treeicon" },
	                React.createElement("i", { className: "fa fa-" + this.props.icon + " fileicon", "aria-hidden": "true" })),
	            React.createElement("div", { className: "treerename" },
	                React.createElement("input", { autoFocus: true, ref: "editfield", type: "text", onKeyDown: (e) => {
	                        if (e.keyCode == 13)
	                            this.props.onSubmit(this.refs.editfield.value);
	                    }, onBlur: this.props.onBlur, defaultValue: this.props.defaultValue }))));
	    }
	}
	exports.default = RenameMode;
	//# sourceMappingURL=RenameMode.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	class AddMode extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    render() {
	        return (React.createElement("div", { className: "addContainer" },
	            React.createElement("div", { className: "treeicon" },
	                React.createElement("i", { className: "fa fa-" + this.props.icon + " fileicon", "aria-hidden": "true" })),
	            React.createElement("div", { className: "treerename" },
	                React.createElement("input", { autoFocus: true, ref: "treeinput", onBlur: this.props.onBlur, onKeyDown: (e) => {
	                        var nodename = this.refs.treeinput.value;
	                        if (e.keyCode == 13)
	                            this.props.onSubmit(nodename);
	                    }, type: "text", name: "" }))));
	    }
	}
	exports.default = AddMode;
	//# sourceMappingURL=AddMode.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	class Draggable extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    onDragStart(e) {
	        e.dataTransfer.setData("id", this.props.item.key);
	    }
	    onDragStop(e) {
	        e.preventDefault();
	        this.refs.draggable.classList.remove("dragover");
	        return false;
	    }
	    onDragOver(e) {
	        if (this.props.isDropTarget) {
	            e.preventDefault();
	            this.refs.draggable.classList.add("dragover");
	            return false;
	        }
	    }
	    onDragLeave(e) {
	        if (this.props.isDropTarget) {
	            e.preventDefault();
	            this.refs.draggable.classList.remove("dragover");
	            return false;
	        }
	    }
	    onDrop(e) {
	        if (this.props.isDropTarget) {
	            this.refs.draggable.classList.remove("dragover");
	            var targetid = e.dataTransfer.getData("id");
	            this.props.onDrop(Number(targetid), Number(this.props.item.key));
	        }
	    }
	    render() {
	        return (React.createElement("div", { ref: "draggable", draggable: true, onDragStart: this.onDragStart.bind(this), onDragEnd: this.onDragStop.bind(this), onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this), onDropCapture: this.onDrop.bind(this), className: this.props.className, onContextMenu: this.props.onContextMenu }, this.props.children));
	    }
	}
	exports.default = Draggable;
	//# sourceMappingURL=draggable.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const TreeView_1 = __webpack_require__(23);
	const Api = __webpack_require__(24);
	const AssetTreeLabel_1 = __webpack_require__(36);
	const semantic_ui_react_1 = __webpack_require__(20);
	const UploadModal_1 = __webpack_require__(39);
	class AssetsPanel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            assets: [], treeItems: [], working: false, showUploadDialog: false, upload_parent: 0, selected: null
	        };
	    }
	    toTreeItems(assets) {
	        return assets.map(asset => {
	            return {
	                key: asset.id.toString(),
	                name: asset.label,
	                collapsed: asset.collapsed,
	                children: this.toTreeItems(asset.children),
	                item: asset
	            };
	        });
	    }
	    componentDidMount() {
	        Api.getAssets().then(assets => {
	            var items = this.toTreeItems(assets);
	            this.setState({ assets: assets, treeItems: items });
	        });
	    }
	    refresh() {
	        Api.getAssets().then(assets => {
	            var items = this.toTreeItems(assets);
	            this.setState({ assets: assets, treeItems: items, working: false });
	        });
	    }
	    onContextTriggered(n) {
	    }
	    onDeleted(item) {
	        this.setState({ working: true }, () => {
	            Api.deleteAsset(item).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    onRenamed(asset) {
	        this.setState({ working: true }, () => {
	            Api.renameAsset(asset).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    onFolderAdded(parent_id, name) {
	        this.setState({ working: true }, () => {
	            Api.addAsset(parent_id, name, "", "folder").then(x => {
	                Api.getAssets().then(assets => {
	                    let items = this.toTreeItems(assets);
	                    let newSelection = {
	                        key: x.id.toString(),
	                        name: x.name,
	                        children: [],
	                        collapsed: false,
	                        item: null
	                    };
	                    this.setState({ assets: assets, treeItems: items, selected: newSelection, working: false });
	                });
	            });
	        });
	    }
	    onParentChanged(source_id, parent_id) {
	        this.setState({ working: true }, () => {
	            Api.updateParentAsset(source_id, parent_id).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    toggleUploadModal(parent_id) {
	        this.setState({ showUploadDialog: !this.state.showUploadDialog, upload_parent: parent_id });
	    }
	    renderLabel(n) {
	        return (React.createElement(AssetTreeLabel_1.default, { item: n, onToggleUpload: this.toggleUploadModal.bind(this), onRenamed: this.onRenamed.bind(this), onDeleted: this.onDeleted.bind(this), onFolderAdded: this.onFolderAdded.bind(this), onParentChanged: this.onParentChanged.bind(this), onContextTriggered: this.onContextTriggered.bind(this) }));
	    }
	    refreshClicked() {
	        this.setState({ working: true }, () => {
	            setTimeout(x => {
	                this.refresh();
	            }, 500);
	        });
	    }
	    render() {
	        if (this.state.treeItems.length == 0) {
	            return (React.createElement("div", null, "Loading..."));
	        }
	        return (React.createElement("div", null,
	            React.createElement(semantic_ui_react_1.Menu, { className: "smalltoolbar", icon: true },
	                React.createElement(semantic_ui_react_1.Menu.Item, { position: 'right', name: 'refresh', active: false, onClick: this.refreshClicked.bind(this) }, this.state.working ? React.createElement(semantic_ui_react_1.Loader, { active: true, size: "tiny", inline: true }) : React.createElement(semantic_ui_react_1.Icon, { name: 'refresh' }))),
	            React.createElement(TreeView_1.default, { items: this.state.treeItems, selected: this.state.selected, onClick: () => console.log("clicked"), onRenderLabel: this.renderLabel.bind(this), onCollapse: (i, state) => {
	                    Api.collapseAsset(i.item.id, state);
	                } }),
	            this.state.showUploadDialog ?
	                React.createElement(UploadModal_1.default, { onUploadFinished: (progress) => {
	                        if (progress == 100) {
	                            this.setState({ working: true, showUploadDialog: false }, () => {
	                                this.refresh();
	                            });
	                        }
	                    }, parent_id: this.state.upload_parent, onClose: this.toggleUploadModal.bind(this) }) : null));
	    }
	}
	exports.default = AssetsPanel;
	//# sourceMappingURL=AssetsPanel.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const AssetContextMenu_1 = __webpack_require__(37);
	const RenameMode_1 = __webpack_require__(32);
	const AddMode_1 = __webpack_require__(33);
	const draggable_1 = __webpack_require__(34);
	const AssetIcons_1 = __webpack_require__(38);
	class AssetTreeLabel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            contextMenuVisible: false, menutarget: null, editmode: false, createmode: false, deleted: false, label: props.item.item.label
	        };
	    }
	    componentWillReceiveProps(nextProps) {
	        if (nextProps.item.name != this.props.item.name) {
	            this.setState({ label: nextProps.item.name });
	        }
	    }
	    toggleContextMenu(e) {
	        this.props.onContextTriggered(this.props.item);
	        e.persist();
	        e.preventDefault();
	        this.setState(Object.assign({}, this.state, { contextMenuVisible: true, menutarget: e }));
	    }
	    renderAddForm() {
	        return (React.createElement(AddMode_1.default, { icon: AssetIcons_1.getAssetIcon("folder"), onBlur: () => this.setState({ createmode: false }), onSubmit: (val) => {
	                this.setState({ createmode: false }, () => {
	                    this.props.onFolderAdded(this.props.item.item.id, val);
	                });
	            } }));
	    }
	    renderEditForm() {
	        return (React.createElement(RenameMode_1.default, { defaultValue: this.props.item.item.label, icon: AssetIcons_1.getAssetIcon(this.props.item.item.mimetype), onBlur: this._onToggleEdit.bind(this), onSubmit: (newname) => {
	                this.setState(Object.assign({}, this.state, { label: newname, editmode: false }), () => {
	                    this.props.onRenamed(Object.assign({}, this.props.item.item, { label: newname }));
	                });
	            } }));
	    }
	    renderContextMenu() {
	        let mimetype = this.props.item.item.mimetype;
	        return (React.createElement(AssetContextMenu_1.default, { target: this.state.menutarget.nativeEvent, canCreate: mimetype == "home" || mimetype == "folder", canDelete: mimetype != "home", canRename: mimetype != "home", onToggleUpload: () => this.props.onToggleUpload(this.props.item.item.id), onDismiss: this._onDismiss.bind(this), onToggleAdd: () => this.setState({ createmode: true }), onToggleDelete: () => {
	                if (confirm("Are you sure?")) {
	                    this.setState(Object.assign({}, this.state, { deleted: true }), () => {
	                        this.props.onDeleted(this.props.item.item);
	                    });
	                }
	            }, onToggleEdit: this._onToggleEdit.bind(this) }));
	    }
	    render() {
	        let mimetype = this.props.item.item.mimetype;
	        let icon = AssetIcons_1.getAssetIcon(this.props.item.item.mimetype);
	        if (this.state.editmode)
	            return this.renderEditForm();
	        return (React.createElement(draggable_1.default, { isDropTarget: mimetype == "folder" || mimetype == "home", onDrop: this.props.onParentChanged.bind(this), item: this.props.item, className: this.state.deleted ? "deleted dragitem" : "dragitem", onContextMenu: this.toggleContextMenu.bind(this) },
	            React.createElement("i", { className: "fa fa-" + icon + " fileicon", "aria-hidden": "true" }),
	            " ",
	            this.state.label,
	            this.state.createmode ? this.renderAddForm() : null,
	            this.state.contextMenuVisible ? this.renderContextMenu() : null));
	    }
	    _onToggleEdit() {
	        this.setState({ editmode: !this.state.editmode });
	    }
	    _onDismiss() {
	        this.setState({ contextMenuVisible: false });
	    }
	    _onToggleSelect() {
	        return true;
	    }
	}
	exports.default = AssetTreeLabel;
	//# sourceMappingURL=AssetTreeLabel.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ContextMenu_1 = __webpack_require__(31);
	class AssetContextMenu extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    handleItemClick() {
	    }
	    render() {
	        let target = {
	            x: this.props.target.clientX,
	            y: this.props.target.clientY
	        };
	        return (React.createElement(ContextMenu_1.default, { target: target, items: [
	                {
	                    icon: "plus",
	                    label: "Create New folder  ",
	                    onClick: this.props.onToggleAdd,
	                    children: [],
	                    disabled: !this.props.canCreate
	                },
	                {
	                    label: "Upload...",
	                    onClick: this.props.onToggleUpload,
	                    children: [],
	                    disabled: !this.props.canCreate
	                },
	                {
	                    icon: "write",
	                    label: "Rename",
	                    onClick: this.props.onToggleEdit,
	                    children: [],
	                    disabled: !this.props.canRename
	                },
	                {
	                    icon: "trash",
	                    label: "Remove",
	                    onClick: this.props.onToggleDelete,
	                    children: [],
	                    disabled: !this.props.canDelete
	                },
	                {
	                    label: "Properties",
	                    onClick: this.handleItemClick.bind(this),
	                    children: []
	                },
	                {
	                    label: "Open",
	                    onClick: this.handleItemClick.bind(this),
	                    children: []
	                }
	            ], onDismiss: this.props.onDismiss }));
	    }
	}
	exports.default = AssetContextMenu;
	//# sourceMappingURL=AssetContextMenu.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function getAssetIcon(mimetype) {
	    switch (mimetype) {
	        case "home":
	            return "home";
	        case "folder":
	            return "folder";
	        case "image/jpeg":
	            return "file-image-o";
	        case "text/plain":
	            return "file-text-o";
	        case "application/pdf":
	            return "file-pdf-o";
	        default:
	            return "file-o";
	    }
	}
	exports.getAssetIcon = getAssetIcon;
	//# sourceMappingURL=AssetIcons.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const semantic_ui_react_1 = __webpack_require__(20);
	const Api = __webpack_require__(24);
	class UploadModal extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = { progress: 0, numFiles: 0 };
	    }
	    onDragOver(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        let uploadbtn = this.refs.uploadbtn;
	        uploadbtn.classList.add("fileover");
	    }
	    onDragLeave(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        let uploadbtn = this.refs.uploadbtn;
	        uploadbtn.classList.remove("fileover");
	    }
	    onDrop(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        var droppedFiles = e.dataTransfer.files;
	        let uploadbtn = this.refs.uploadbtn;
	        uploadbtn.classList.remove("fileover");
	        this.doUpload(droppedFiles);
	    }
	    uploadFile(file) {
	        return Api.uploadAsset(file).then(result => {
	            return Api.addAsset(this.props.parent_id, result.name, result.server_path, result.contenttype).then(x => {
	                this.setState({ progress: this.state.progress + 1 }, () => {
	                    setTimeout(() => {
	                        this.props.onUploadFinished(this.state.progress / (this.state.numFiles / 100));
	                    }, 700);
	                });
	            });
	        });
	    }
	    uploadFiles(current, files) {
	        this.uploadFile(files[current]).then(x => {
	            if (current < files.length - 1) {
	                this.uploadFiles(current + 1, files);
	            }
	        });
	    }
	    doUpload(files) {
	        this.setState({ progress: 0, numFiles: files.length }, () => {
	            this.uploadFiles(0, files);
	        });
	    }
	    renderUploadForm() {
	        return (React.createElement("div", { className: "uploadDialog" },
	            React.createElement("form", { onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this), onDropCapture: this.onDrop.bind(this) },
	                React.createElement("label", { ref: "uploadbtn", className: "uploadbtn" },
	                    React.createElement("input", { multiple: true, type: "file", id: "file-select", name: "asset[]", onChange: (e) => {
	                            var files = e.currentTarget.files;
	                            this.doUpload(files);
	                        } }),
	                    React.createElement("span", null,
	                        React.createElement("i", { className: "fa fa-upload", "aria-hidden": "true" }),
	                        React.createElement("br", null),
	                        "Drop files here or click to Select files from your computer")))));
	    }
	    renderProgres() {
	        return (React.createElement(semantic_ui_react_1.Progress, { size: "small", value: this.state.progress, total: this.state.numFiles, progress: 'ratio', autoSuccess: true, indicating: true }));
	    }
	    render() {
	        return (React.createElement(semantic_ui_react_1.Modal, { onClose: this.props.onClose, open: true },
	            React.createElement(semantic_ui_react_1.Modal.Header, null, "Upload Assets"),
	            React.createElement(semantic_ui_react_1.Modal.Content, null, this.state.numFiles == 0 ? this.renderUploadForm() : this.renderProgres())));
	    }
	}
	exports.default = UploadModal;
	//# sourceMappingURL=UploadModal.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map