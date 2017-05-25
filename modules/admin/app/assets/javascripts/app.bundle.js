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
	const PageTreeLabel_1 = __webpack_require__(28);
	const Loading_1 = __webpack_require__(34);
	const semantic_ui_react_1 = __webpack_require__(20);
	class PagesPanel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            documents: [], treeItems: [], working: true
	        };
	    }
	    toTreeItems(docs) {
	        return docs.map(doc => {
	            return {
	                key: doc.id.toString(),
	                name: doc.label,
	                collapsed: doc.collapsed,
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
	        this.refresh();
	    }
	    onContextTriggered(n) {
	    }
	    onRenamed(doc) {
	        console.log("Got new name" + doc.label);
	        this.setState({ working: true }, () => {
	            Api.renameDocument(doc).then(x => {
	                this.refresh();
	            });
	        });
	    }
	    onAdded(parent_id, name, pagetype) {
	        this.setState({ working: true }, () => {
	            Api.addDocument(parent_id, name, pagetype).then(x => {
	                this.refresh();
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
	        return (React.createElement(PageTreeLabel_1.default, { onRenamed: this.onRenamed.bind(this), onAdded: this.onAdded.bind(this), onDeleted: this.onDeleted.bind(this), onParentChanged: this.onParentChanged.bind(this), item: n, onContextTriggered: this.onContextTriggered.bind(this) }));
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
	            return (React.createElement(Loading_1.default, null));
	        }
	        return (React.createElement("div", null,
	            React.createElement(semantic_ui_react_1.Menu, { className: "smalltoolbar", icon: true },
	                React.createElement(semantic_ui_react_1.Menu.Menu, null,
	                    React.createElement(semantic_ui_react_1.Dropdown, { item: true, icon: "add" },
	                        React.createElement(semantic_ui_react_1.Dropdown.Menu, null,
	                            React.createElement(semantic_ui_react_1.Dropdown.Item, null, "English"),
	                            React.createElement(semantic_ui_react_1.Dropdown.Item, null, "Russian"),
	                            React.createElement(semantic_ui_react_1.Dropdown.Item, null, "Spanish")))),
	                React.createElement(semantic_ui_react_1.Menu.Item, { name: 'remove', active: false, onClick: this.handleItemClick.bind(this) },
	                    React.createElement(semantic_ui_react_1.Icon, { name: 'trash' })),
	                React.createElement(semantic_ui_react_1.Menu.Item, { position: 'right', name: 'refresh', active: false, onClick: this.handleItemClick.bind(this) },
	                    React.createElement(semantic_ui_react_1.Icon, { name: 'refresh' }))),
	            React.createElement(TreeView_1.default, { items: this.state.treeItems, onClick: () => console.log("clicked"), onRenderLabel: this.renderLabel.bind(this) }),
	            this.state.working ? (React.createElement(Loading_1.default, null)) : null));
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
	        this.state = { selected: this._emptySelection };
	    }
	    componentDidMount() {
	        document.addEventListener('mousedown', function (e) {
	            let treeNode = ReactDOM.findDOMNode(this.refs.tree);
	            let containsElement = treeNode.contains(e.target);
	            let contextOpen = treeNode.getElementsByClassName("contextmenu").length > 0;
	            if (!containsElement && !contextOpen) {
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
	                React.createElement(SubTreeView, { visible: true, items: this.props.items, onClick: this.onClick.bind(this), selected: this.state.selected, onRenderLabel: this.props.onRenderLabel }))));
	    }
	}
	exports.default = TreeView;
	class SubTreeView extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    renderTreeNode(n) {
	        return (React.createElement(SubTreeViewNode, { key: n.key, onRenderLabel: this.props.onRenderLabel, selected: this.props.selected, onclick: this.props.onClick, item: n }));
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
	        this.setState(Object.assign({}, this.state, { collapsed: !this.state.collapsed }));
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
	            return (React.createElement(SubTreeView, { visible: this.state.collapsed, items: node.children, onRenderLabel: this.props.onRenderLabel, onClick: this.props.onclick, selected: this.props.selected }));
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
	__export(__webpack_require__(27));
	//# sourceMappingURL=Api.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiBase_js_1 = __webpack_require__(26);
	function getPageTypes() {
	    return ApiBase_js_1.default("/api/v1/pagetypes", "GET");
	}
	exports.getPageTypes = getPageTypes;
	function getDocuments() {
	    return ApiBase_js_1.default("/admin/api/v1/documents", "GET").then(r => r);
	}
	exports.getDocuments = getDocuments;
	function renameDocument(doc) {
	    var body = JSON.stringify({
	        "name": doc.label
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
	    return ApiBase_js_1.default("/admin/api/v1/documents", "POST", body);
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
	//# sourceMappingURL=DocumentsApi.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var csrf = document.getElementById("csrftoken").innerText;
	function handleErrors(response) {
	    if (!response.ok) {
	        response.text().then(r => {
	            alert(response.status + " - " + response.statusText + "\n" + r);
	        });
	    }
	    else {
	        return response;
	    }
	}
	function ApiCall(call, method, body, contenttype) {
	    var headers = {
	        "Csrf-Token": csrf
	    };
	    if (contenttype != null) {
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
	    return fetch(call, params).then(handleErrors).then(r => r.json());
	}
	exports.default = ApiCall;
	//# sourceMappingURL=ApiBase.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiBase_js_1 = __webpack_require__(26);
	function getAssets() {
	    return ApiBase_js_1.default("/admin/api/v1/assets", "GET").then(r => r);
	}
	exports.getAssets = getAssets;
	//# sourceMappingURL=AssetsApi.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const PageTreeContextMenu_1 = __webpack_require__(29);
	const RenameMode_1 = __webpack_require__(31);
	const AddMode_1 = __webpack_require__(32);
	const draggable_1 = __webpack_require__(33);
	class PageTreeLabel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            editmode: false, deleted: false, contextMenuVisible: false, menutarget: null, label: props.item.name, addingmode: false
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
	        return (React.createElement(PageTreeContextMenu_1.default, { target: this.state.menutarget.nativeEvent, onDismiss: this._onDismiss.bind(this), onToggleAdd: () => this.setState({ addingmode: true }), onToggleDelete: () => {
	                this.setState({ deleted: true }, () => {
	                    this.props.onDeleted(this.props.item.item);
	                });
	            }, onToggleEdit: this._onToggleEdit.bind(this) }));
	    }
	    renderAddForm() {
	        return (React.createElement(AddMode_1.default, { icon: "file-code-o", onBlur: () => this.setState({ addingmode: false }), onSubmit: (val) => {
	                this.setState({ addingmode: false }, () => {
	                    this.props.onAdded(this.props.item.item.id, val, "default");
	                });
	            } }));
	    }
	    renderEditForm() {
	        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
	        return (React.createElement(RenameMode_1.default, { defaultValue: this.props.item.item.label, icon: icon, onBlur: this._onToggleEdit.bind(this), onSubmit: (newname) => {
	                this.setState({ label: newname, editmode: false }, () => {
	                    this.props.onRenamed(Object.assign({}, this.props.item.item, { label: newname }));
	                });
	            } }));
	    }
	    render() {
	        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
	        if (this.state.editmode)
	            return this.renderEditForm();
	        return (React.createElement(draggable_1.default, { onDrop: this.props.onParentChanged.bind(this), item: this.props.item, className: this.state.deleted ? "deleted dragitem" : "dragitem", onContextMenu: this.toggleContextMenu.bind(this) },
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ContextMenu_1 = __webpack_require__(30);
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
	        return (React.createElement(ContextMenu_1.default, { target: target, items: [
	                {
	                    icon: "plus",
	                    label: "New",
	                    onClick: this.handleItemClick.bind(this),
	                    children: [
	                        {
	                            label: "test",
	                            onClick: this.props.onToggleAdd,
	                            children: []
	                        },
	                        {
	                            label: "test2",
	                            onClick: this.handleItemClick.bind(this),
	                            children: []
	                        }
	                    ]
	                },
	                {
	                    icon: "edit",
	                    label: "Rename",
	                    onClick: this.props.onToggleEdit,
	                    children: []
	                },
	                {
	                    icon: "trash",
	                    label: "Remove",
	                    onClick: this.props.onToggleDelete,
	                    children: []
	                },
	                {
	                    label: "Something else",
	                    onClick: this.handleItemClick.bind(this),
	                    children: [{
	                            icon: "edit",
	                            label: "subtest",
	                            onClick: this.props.onToggleEdit,
	                            children: []
	                        }, {
	                            icon: "globe",
	                            label: "Nog een test",
	                            onClick: this.handleItemClick.bind(this),
	                            children: []
	                        }]
	                }
	            ], onDismiss: this.props.onDismiss }));
	    }
	}
	exports.default = PageTreeContextMenu;
	//# sourceMappingURL=PageTreeContextMenu.js.map

/***/ }),
/* 30 */
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
	    onDismiss(e) {
	        let menu = this.refs.contextmenu;
	        if (!menu.contains(e.target)) {
	            document.removeEventListener('mousedown', this.mouseDown);
	            this.props.onDismiss();
	        }
	    }
	    renderMenuItem(item) {
	        const itemClicked = () => {
	            this.props.onDismiss();
	            item.onClick();
	        };
	        return (React.createElement(semantic_ui_react_1.Menu.Item, { name: item.label, icon: item.icon, active: false, onClick: itemClicked }));
	    }
	    renderSubMenuItem(item) {
	        return (React.createElement(semantic_ui_react_1.Dropdown, { item: true, text: item.label },
	            React.createElement(semantic_ui_react_1.Dropdown.Menu, null, item.children.map(x => React.createElement(semantic_ui_react_1.Dropdown.Item, { icon: x.icon, text: x.label })))));
	    }
	    renderItems(item) {
	        if (item.children.length > 0)
	            return this.renderSubMenuItem(item);
	        else
	            return this.renderMenuItem(item);
	    }
	    render() {
	        let top = this.props.target.y + "px";
	        let left = this.props.target.x + "px";
	        return (React.createElement("div", { className: "contextmenu", ref: "contextmenu", style: { position: 'fixed', top: top, left: left, zIndex: 999 } },
	            React.createElement(semantic_ui_react_1.Menu, { compact: true, pointing: true, vertical: true }, this.props.items.map(x => this.renderItems(x)))));
	    }
	}
	exports.default = ContextMenu;
	//# sourceMappingURL=ContextMenu.js.map

/***/ }),
/* 31 */
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
/* 32 */
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	class Draggable extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    onDragStart(e) {
	        e.dataTransfer.setData("id", this.props.item.item.id);
	    }
	    onDragStop(e) {
	        e.preventDefault();
	        this.refs.draggable.classList.remove("dragover");
	        return false;
	    }
	    onDragOver(e) {
	        e.preventDefault();
	        this.refs.draggable.classList.add("dragover");
	        return false;
	    }
	    onDragLeave(e) {
	        e.preventDefault();
	        this.refs.draggable.classList.remove("dragover");
	        return false;
	    }
	    onDrop(e) {
	        this.refs.draggable.classList.remove("dragover");
	        var targetid = e.dataTransfer.getData("id");
	        this.props.onDrop(Number(targetid), this.props.item.item.id);
	        console.log("dropped " + targetid);
	    }
	    render() {
	        return (React.createElement("div", { ref: "draggable", draggable: true, onDragStart: this.onDragStart.bind(this), onDragEnd: this.onDragStop.bind(this), onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this), onDropCapture: this.onDrop.bind(this), className: this.props.className, onContextMenu: this.props.onContextMenu }, this.props.children));
	    }
	}
	exports.default = Draggable;
	//# sourceMappingURL=draggable.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const semantic_ui_react_1 = __webpack_require__(20);
	function Loading(props) {
	    return (React.createElement(semantic_ui_react_1.Dimmer, { active: true, inverted: true },
	        React.createElement(semantic_ui_react_1.Loader, { inverted: true })));
	}
	exports.default = Loading;
	//# sourceMappingURL=Loading.js.map

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
	class AssetsPanel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            assets: [], treeItems: []
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
	    onContextTriggered(n) {
	        console.log("asdfasdf");
	    }
	    renderLabel(n) {
	        return (React.createElement(AssetTreeLabel_1.default, { item: n, onContextTriggered: this.onContextTriggered.bind(this) }));
	    }
	    handleItemClick() {
	    }
	    render() {
	        if (this.state.treeItems.length == 0) {
	            return (React.createElement("div", null, "Loading..."));
	        }
	        return (React.createElement("div", null,
	            React.createElement(semantic_ui_react_1.Menu, { className: "smalltoolbar", icon: true },
	                React.createElement(semantic_ui_react_1.Menu.Menu, null,
	                    React.createElement(semantic_ui_react_1.Dropdown, { item: true, icon: "add" },
	                        React.createElement(semantic_ui_react_1.Dropdown.Menu, null,
	                            React.createElement(semantic_ui_react_1.Dropdown.Item, null, "English"),
	                            React.createElement(semantic_ui_react_1.Dropdown.Item, null, "Russian"),
	                            React.createElement(semantic_ui_react_1.Dropdown.Item, null, "Spanish")))),
	                React.createElement(semantic_ui_react_1.Menu.Item, { name: 'remove', active: false, onClick: this.handleItemClick.bind(this) },
	                    React.createElement(semantic_ui_react_1.Icon, { name: 'trash' })),
	                React.createElement(semantic_ui_react_1.Menu.Item, { position: 'right', name: 'refresh', active: false, onClick: this.handleItemClick.bind(this) },
	                    React.createElement(semantic_ui_react_1.Icon, { name: 'refresh' }))),
	            React.createElement(TreeView_1.default, { items: this.state.treeItems, onClick: () => console.log("clicked"), onRenderLabel: this.renderLabel.bind(this) })));
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
	class AssetTreeLabel extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.state = {
	            contextMenuVisible: false, menutarget: MouseEvent
	        };
	    }
	    toggleContextMenu(e) {
	        this.props.onContextTriggered(this.props.item);
	        e.persist();
	        e.preventDefault();
	        this.setState({
	            contextMenuVisible: true, menutarget: e
	        });
	    }
	    renderContextMenu() {
	        return null;
	    }
	    render() {
	        let icon = this.props.item.item.mimetype == "home" ? "home" : "file-image-o";
	        if (this.props.item.item.mimetype == "folder") {
	            icon = "folder";
	        }
	        return (React.createElement("div", { onContextMenu: this.toggleContextMenu.bind(this) },
	            React.createElement("i", { className: "fa fa-" + icon + " fileicon", "aria-hidden": "true" }),
	            " ",
	            this.props.item.item.label,
	            this.state.contextMenuVisible ? this.renderContextMenu() : null));
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

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map