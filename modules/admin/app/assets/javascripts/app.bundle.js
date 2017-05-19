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
	const Main_1 = __webpack_require__(4);
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

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const SplitPane = __webpack_require__(5);
	const LargeView_1 = __webpack_require__(6);
	const SideMenu_1 = __webpack_require__(10);
	const CommandBar_1 = __webpack_require__(7);
	const PagesPanel_1 = __webpack_require__(11);
	const AssetsPanel_1 = __webpack_require__(24);
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
	                            React.createElement(CommandBar_1.CommandBar, { isSearchBoxVisible: false, items: this.itemsNonFocusable, farItems: this.farItemsNonFocusable }),
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(182);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const CommandBar_1 = __webpack_require__(7);
	const Label_1 = __webpack_require__(8);
	const Pivot_1 = __webpack_require__(9);
	class LargeView extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	        this.itemsNonFocusable = [
	            { key: "new", name: "New", iconProps: { iconName: "add" } }
	        ];
	        this.farItemsNonFocusable = [
	            { key: "test", name: "Test", iconProps: { iconName: "add" } }
	        ];
	    }
	    render() {
	        return (React.createElement("div", null,
	            React.createElement(Pivot_1.Pivot, { linkSize: Pivot_1.PivotLinkSize.large },
	                React.createElement(Pivot_1.PivotItem, { linkText: 'My Files' },
	                    React.createElement(Label_1.Label, null, "Pivot #1")),
	                React.createElement(Pivot_1.PivotItem, { linkText: 'Recent' },
	                    React.createElement(Label_1.Label, null, "Pivot #2")),
	                React.createElement(Pivot_1.PivotItem, { linkText: 'Shared with me' },
	                    React.createElement(Label_1.Label, null, "Pivot #3"))),
	            React.createElement(CommandBar_1.CommandBar, { isSearchBoxVisible: false, items: this.itemsNonFocusable, farItems: this.farItemsNonFocusable })));
	    }
	}
	exports.default = LargeView;
	//# sourceMappingURL=LargeView.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(353);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(336);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(481);

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const TreeView_1 = __webpack_require__(12);
	const Api = __webpack_require__(14);
	const PageTreeLabel_1 = __webpack_require__(18);
	const Loading_1 = __webpack_require__(23);
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
	    render() {
	        if (this.state.treeItems.length == 0) {
	            return (React.createElement(Loading_1.default, null));
	        }
	        return (React.createElement("div", null,
	            this.state.working ? (React.createElement(Loading_1.default, null)) : null,
	            React.createElement(TreeView_1.default, { items: this.state.treeItems, onClick: () => console.log("clicked"), onRenderLabel: this.renderLabel.bind(this) })));
	    }
	}
	exports.default = PagesPanel;
	//# sourceMappingURL=PagesPanel.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(3);
	const Utilities_1 = __webpack_require__(13);
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
	            let contextOpen = treeNode.getElementsByClassName("ms-Layer").length > 0;
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
	            React.createElement("nav", { role: "navigation", className: Utilities_1.css('ms-Nav', {
	                    'is-onTop ms-u-slideRightIn40': true
	                }) },
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
	        let icon = this.state.collapsed ? "ChevronDown" : "ChevronDown rotateIcon";
	        return (React.createElement("span", { onClick: this.switchCollapseState.bind(this), className: "beforeLabel collapseButton" },
	            React.createElement("i", { className: "chevronIcon ms-Nav-chevron ms-Icon ms-Icon--" + icon })));
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(233);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(15));
	__export(__webpack_require__(17));
	//# sourceMappingURL=Api.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiBase_js_1 = __webpack_require__(16);
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
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ApiBase_js_1 = __webpack_require__(16);
	function getAssets() {
	    return ApiBase_js_1.default("/admin/api/v1/assets", "GET").then(r => r);
	}
	exports.getAssets = getAssets;
	//# sourceMappingURL=AssetsApi.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const PageTreeContextMenu_1 = __webpack_require__(19);
	const RenameMode_1 = __webpack_require__(21);
	const AddMode_1 = __webpack_require__(22);
	const draggable_1 = __webpack_require__(26);
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ContextualMenu_1 = __webpack_require__(20);
	class PageTreeContextMenu extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    _onToggleSelect() {
	    }
	    render() {
	        return (React.createElement(ContextualMenu_1.ContextualMenu, { target: this.props.target, shouldFocusOnMount: true, onDismiss: this.props.onDismiss, directionalHint: ContextualMenu_1.DirectionalHint.bottomLeftEdge, items: [
	                {
	                    key: 'new',
	                    name: 'New',
	                    iconProps: { iconName: "Add" },
	                    onClick: this.props.onToggleAdd
	                },
	                {
	                    key: 'rename',
	                    name: 'Rename',
	                    iconProps: { iconName: "Edit" },
	                    onClick: this.props.onToggleEdit
	                },
	                {
	                    key: 'delete',
	                    name: 'Delete',
	                    iconProps: { iconName: "Delete" },
	                    onClick: this.props.onToggleDelete
	                },
	                {
	                    key: 'divider_1',
	                    name: '-',
	                },
	                {
	                    key: 'print',
	                    name: 'Print',
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'music',
	                    name: 'Music',
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'musicsub',
	                    subMenuProps: {
	                        items: [
	                            {
	                                key: 'emailmsg',
	                                name: 'Email message',
	                                onClick: this._onToggleSelect
	                            },
	                            {
	                                key: 'event',
	                                name: 'Calendar event',
	                                onClick: this._onToggleSelect
	                            }
	                        ],
	                    },
	                    name: 'New'
	                },
	            ] }));
	    }
	}
	exports.default = PageTreeContextMenu;
	//# sourceMappingURL=PageTreeContextMenu.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(266);

/***/ }),
/* 21 */
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
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	function Loading(props) {
	    return (React.createElement("div", { className: "loading" },
	        React.createElement("img", { src: "/assets/images/rolling.svg", alt: "" }),
	        " "));
	}
	exports.default = Loading;
	//# sourceMappingURL=Loading.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const TreeView_1 = __webpack_require__(12);
	const Api = __webpack_require__(14);
	const AssetTreeLabel_1 = __webpack_require__(25);
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
	    render() {
	        if (this.state.treeItems.length == 0) {
	            return (React.createElement("div", null, "Loading..."));
	        }
	        return (React.createElement(TreeView_1.default, { items: this.state.treeItems, onClick: () => console.log("clicked"), onRenderLabel: this.renderLabel.bind(this) }));
	    }
	}
	exports.default = AssetsPanel;
	//# sourceMappingURL=AssetsPanel.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const ContextualMenu_1 = __webpack_require__(20);
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
	    renderContextMenu() {
	        return (React.createElement(ContextualMenu_1.ContextualMenu, { target: this.state.menutarget, shouldFocusOnMount: true, onDismiss: this._onDismiss.bind(this), directionalHint: ContextualMenu_1.DirectionalHint.bottomLeftEdge, items: [
	                {
	                    key: 'new',
	                    name: 'New',
	                    iconProps: { iconName: "Add" },
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'share',
	                    name: 'Share',
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'mobile',
	                    name: 'Mobile',
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'divider_1',
	                    name: '-',
	                },
	                {
	                    key: 'print',
	                    name: 'Print',
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'music',
	                    name: 'Music',
	                    onClick: this._onToggleSelect
	                },
	                {
	                    key: 'musicsub',
	                    subMenuProps: {
	                        items: [
	                            {
	                                key: 'emailmsg',
	                                name: 'Email message',
	                                onClick: this._onToggleSelect
	                            },
	                            {
	                                key: 'event',
	                                name: 'Calendar event',
	                                onClick: this._onToggleSelect
	                            }
	                        ],
	                    },
	                    name: 'New'
	                },
	            ] }));
	    }
	}
	exports.default = AssetTreeLabel;
	//# sourceMappingURL=AssetTreeLabel.js.map

/***/ }),
/* 26 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map