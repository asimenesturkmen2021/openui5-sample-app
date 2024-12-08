/*!
* OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./NavContainer","./library","sap/ui/core/Control","sap/ui/core/CustomData","sap/ui/core/Element","sap/ui/core/IconPool","sap/ui/core/Lib","sap/ui/core/delegate/ItemNavigation","sap/ui/core/InvisibleText","sap/ui/core/IntervalTrigger","sap/ui/Device","sap/ui/core/Icon","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","./FacetFilterRenderer","sap/ui/events/KeyCodes","sap/base/assert","sap/base/Log","sap/ui/events/jquery/EventSimulation","sap/ui/thirdparty/jquery","sap/m/Button","sap/m/ToolbarSpacer","sap/m/OverflowToolbar","sap/m/Text","sap/m/Toolbar","sap/m/Popover","sap/m/SearchField","sap/m/Bar","sap/m/Dialog","sap/m/List","sap/m/StandardListItem","sap/m/CheckBox","sap/m/Page","sap/ui/core/library","sap/ui/core/date/UI5Date","sap/ui/dom/jquery/scrollRightRTL","sap/ui/dom/jquery/scrollLeftRTL","sap/ui/dom/jquery/Selectors"],function(e,t,i,s,a,r,o,n,l,g,h,u,d,c,p,f,v,_,m,y,jQuery,I,T,F,b,L,S,A,C,R,E,x,w,B,N,D){"use strict";var P=t.ToolbarDesign;var M=t.ListType;var O=t.ListMode;var k=t.FacetFilterListDataType;var H=t.ButtonType;var V=t.PlacementType;var K=t.FacetFilterType;var q=N.TitleLevel;var z=500;var $=i.extend("sap.m.FacetFilter",{metadata:{interfaces:["sap.ui.core.IShrinkable"],library:"sap.m",properties:{showPersonalization:{type:"boolean",group:"Appearance",defaultValue:false},type:{type:"sap.m.FacetFilterType",group:"Appearance",defaultValue:K.Simple},liveSearch:{type:"boolean",group:"Behavior",defaultValue:true},showSummaryBar:{type:"boolean",group:"Behavior",defaultValue:false},showReset:{type:"boolean",group:"Behavior",defaultValue:true},showPopoverOKButton:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"lists",aggregations:{lists:{type:"sap.m.FacetFilterList",multiple:true,singularName:"list"},buttons:{type:"sap.m.Button",multiple:true,singularName:"button",visibility:"hidden"},removeFacetIcons:{type:"sap.ui.core.Icon",multiple:true,singularName:"removeFacetIcon",visibility:"hidden"},popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"},addFacetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},dialog:{type:"sap.m.Dialog",multiple:false,visibility:"hidden"},summaryBar:{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"},resetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},arrowLeft:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},arrowRight:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{reset:{},confirm:{}}},renderer:f});$.SCROLL_STEP=264;$.prototype.setType=function(e){var t,i;if(h.system.phone){this.setProperty("type",K.Light);i=true}else{this.setProperty("type",e);i=e===K.Light}t=this._getSummaryBar();t.setActive(i);if(e===K.Light){if(this.getShowReset()){this._addResetToSummary(t)}else{this._removeResetFromSummary(t)}}return this};$.prototype.setShowReset=function(e){this.setProperty("showReset",e);var t=this._getSummaryBar();if(e){if(this.getShowSummaryBar()||this.getType()===K.Light){this._addResetToSummary(t)}}else{if(this.getShowSummaryBar()||this.getType()===K.Light){this._removeResetFromSummary(t)}}return this};$.prototype.setShowSummaryBar=function(e){this.setProperty("showSummaryBar",e);if(e){var t=this._getSummaryBar();if(this.getShowReset()){this._addResetToSummary(t)}else{this._removeResetFromSummary(t)}t.setActive(this.getType()===K.Light)}return this};$.prototype.setLiveSearch=function(e){this.setProperty("liveSearch",e);if(this._displayedList){var t=this._displayedList;var i=a.getElementById(t.getAssociation("search"));i.detachLiveChange(t._handleSearchEvent,t);if(e){i.attachLiveChange(t._handleSearchEvent,t)}}return this};$.prototype.getLists=function(){var e=this.getAggregation("lists");if(!e){e=[]}if(this._displayedList){e.splice(this._listAggrIndex,0,this._displayedList)}e.forEach(function(e){e.setBusyIndicatorDelay(0);if(!e.hasListeners("listItemsChange")){e.attachEvent("listItemsChange",U.bind(this))}}.bind(this));return e};function U(e){var t=e.getSource();if(this._oAllCheckBoxBar){this._oAllCheckBoxBar.setVisible(Boolean(t.getItems(true).length))}}$.prototype.removeAggregation=function(){var e=i.prototype.removeAggregation.apply(this,arguments);if(arguments[0]==="lists"){this._removeList(e)}return e};$.prototype.openFilterDialog=function(){var e=this._getFacetDialog();var t=this._getFacetDialogNavContainer();e.removeAllAriaLabelledBy();e.addAriaLabelledBy(l.getStaticId("sap.m","FACETFILTER_AVAILABLE_FILTER_NAMES"));e.addContent(t);this.getLists().forEach(function(e){if(e.getMode()===O.MultiSelect){e._preserveOriginalActiveState()}});e.setInitialFocus(t.getPages()[0].getContent()[0].getItems()[0]);e.open();return this};$.prototype.init=function(){this._pageSize=5;this._invalidateFlag=false;this._lastCategoryFocusIndex=0;this._aDomRefs=null;this._previousTarget=null;this._addTarget=null;this._aRows=null;this._bundle=o.getResourceBundleFor("sap.m");this.data("sap-ui-fastnavgroup","true",true);this._buttons={};this._aOwnedLabels=[];this._removeFacetIcons={};this._listAggrIndex=-1;this._displayedList=null;this._lastScrolling=false;this._bPreviousScrollForward=false;this._bPreviousScrollBack=false;this._popoverClosing=false;this._getAddFacetButton();this.setAggregation("resetButton",this._createResetButton());if(y.touchEventMode==="ON"&&!h.system.phone){this._enableTouchSupport()}if(h.system.phone){this.setType(K.Light)}};$.prototype.exit=function(){var e;g.removeListener(this._checkOverflow,this);if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy()}if(this._aOwnedLabels){this._aOwnedLabels.forEach(function(t){e=a.getElementById(t);if(e){e.destroy()}});this._aOwnedLabels=null}if(this._oAllCheckBoxBar){this._oAllCheckBoxBar=undefined}if(this._oInvisibleTitleElement){this._oInvisibleTitleElement.destroy();this._oInvisibleTitleElement=null}};$.prototype.onBeforeRendering=function(){if(this.getShowSummaryBar()||this.getType()===K.Light){var e=this._getSummaryBar();var t=e.getContent()[0];t.setText(this._getSummaryText())}g.removeListener(this._checkOverflow,this)};$.prototype.onAfterRendering=function(){var e=this.getShowSummaryBar(),t=this.getType(),i=this._getSummaryBar().$();if(t!==K.Light&&!h.system.phone){g.addListener(this._checkOverflow,this)}if(t!==K.Light){this._startItemNavigation();this.addDelegate(this.oItemNavigation)}if(t===K.Light){i.attr("aria-roledescription",this._bundle.getText("FACETFILTER_ACTIVE_TITLE"));i.attr("role","group")}else if(e){i.attr("aria-roledescription",this._bundle.getText("FACETFILTER_TITLE"))}};$.prototype._startItemNavigation=function(){var e=this.getDomRef(),t=e.getElementsByClassName("sapMFFHead"),i=[];if(t.length>0){for(var s=0;s<t[0].childNodes.length;s++){if(t[0].childNodes[s].id.indexOf("ff")<0&&t[0].childNodes[s].id.indexOf("icon")<0&&t[0].childNodes[s].id.indexOf("add")<0){i.push(t[0].childNodes[s])}if(t[0].childNodes[s].id.indexOf("add")>=0){i.push(t[0].childNodes[s])}}}if(i!=""){this._aDomRefs=i}if(!this.oItemNavigation){this.oItemNavigation=new n}this._aRows=t;for(var s=0;s<this.$().find(":sapTabbable").length;s++){if(this.$().find(":sapTabbable")[s].id.indexOf("add")>=0){this._addTarget=this.$().find(":sapTabbable")[s];break}}this.oItemNavigation.setRootDomRef(e);if(this._invalidateFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._invalidateFlag=false}this.oItemNavigation.setItemDomRefs(i);this.oItemNavigation.setCycling(false);this.oItemNavigation.setPageSize(this._pageSize);this.oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"],saphome:["alt","meta"],sapend:["meta"]})};$.prototype.onsapdelete=function(e){var t,i;if(this.getType()===K.Light){return}if(!this.getShowPersonalization()){return}t=a.getElementById(e.target.id);if(!t){return}i=a.getElementById(t.getAssociation("list"));if(!i){return}if(!i.getShowRemoveFacetIcon()){return}i.removeSelections(true);i.setSelectedKeys();i.setProperty("active",false,true);this.invalidate();var s=this.$().find(":sapTabbable");jQuery(s[s.length-1]).trigger("focus");var r=this.oItemNavigation.getFocusedIndex();jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(r+1);this.focus();if(this.oItemNavigation.getFocusedIndex()==0){for(var o=0;o<this.$().find(":sapTabbable").length-1;o++){if(s[o].id.indexOf("add")>=0){jQuery(s[o]).trigger("focus")}}}};$.prototype.onsaptabnext=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFHead"){for(var t=0;t<this.$().find(":sapTabbable").length;t++){if(this.$().find(":sapTabbable")[t].parentNode.className=="sapMFFResetDiv"){jQuery(this.$().find(":sapTabbable")[t]).trigger("focus");this._invalidateFlag=false;e.preventDefault();e.setMarked();return}}}this._lastCategoryFocusIndex=this.oItemNavigation.getFocusedIndex();if(this._invalidateFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._invalidateFlag=false}};$.prototype.onsaptabprevious=function(e){if(this.getType()===K.Light){return}if(e.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget==null){jQuery(this.$().find(":sapTabbable")[0]).trigger("focus");e.preventDefault();e.setMarked();return}if(e.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget!=null&&this._previousTarget.id!=e.target.id){jQuery(this._previousTarget).trigger("focus");e.preventDefault();e.setMarked();return}if(e.target.id.indexOf("add")>=0||e.target.parentNode.className=="sapMFFHead"){this._previousTarget=e.target;jQuery(this.$().find(":sapTabbable")[0]).trigger("focus")}};$.prototype.onsapend=function(e){if(this.getType()===K.Light){return}if(this._addTarget!=null){jQuery(this._addTarget).trigger("focus");e.preventDefault();e.setMarked()}else{jQuery(this._aRows[this._aRows.length-1]).trigger("focus");e.preventDefault();e.setMarked()}this._previousTarget=e.target};$.prototype.onsaphome=function(e){if(this.getType()===K.Light){return}jQuery(this._aRows[0]).trigger("focus");e.preventDefault();e.setMarked();this._previousTarget=e.target};$.prototype.onsappageup=function(e){this._previousTarget=e.target};$.prototype.onsappagedown=function(e){this._previousTarget=e.target};$.prototype.onsapincreasemodifiers=function(e){if(this.getType()===K.Light){return}if(e.which==v.ARROW_RIGHT){this._previousTarget=e.target;var t=this.oItemNavigation.getFocusedIndex()-1;var i=t+this._pageSize;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(i);this.focus()}};$.prototype.onsapdecreasemodifiers=function(e){if(this.getType()===K.Light){return}var t=0;if(e.which==v.ARROW_LEFT){this._previousTarget=e.target;t=this.oItemNavigation.getFocusedIndex()+1;var i=t-this._pageSize;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(i);this.focus()}};$.prototype.onsapdownmodifiers=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;var t=0;t=this.oItemNavigation.getFocusedIndex()-1;var i=t+this._pageSize;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(i);this.focus()};$.prototype.onsapupmodifiers=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;var t=0;t=this.oItemNavigation.getFocusedIndex();if(t!=0){t=t+1}var i=t-this._pageSize;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(i);this.focus()};$.prototype.onsapexpand=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;var t=this.oItemNavigation.getFocusedIndex()+1;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(t);this.focus()};$.prototype.onsapcollapse=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;var t=this.oItemNavigation.getFocusedIndex()-1;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(t);this.focus()};$.prototype.onsapdown=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){jQuery(e.target).trigger("focus");e.preventDefault();e.setMarked();return}};$.prototype.onsapup=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){jQuery(e.target).trigger("focus");e.preventDefault();e.setMarked()}};$.prototype.onsapleft=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){jQuery(e.target).trigger("focus");e.preventDefault();e.setMarked()}var t=this.oItemNavigation.aItemDomRefs,i=this.oItemNavigation.getFocusedIndex(),s=i-1>=0?i-1:i,r=a.closestTo(t[s]),o=this._calculateScrollIntoView(r);this._scroll(o,z)};$.prototype.onsapright=function(e){if(this.getType()===K.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){jQuery(e.target).trigger("focus");e.preventDefault();e.setMarked()}var t=this.oItemNavigation.aItemDomRefs,i=this.oItemNavigation.getFocusedIndex(),s=t.length>i+1?i+1:i,r=a.closestTo(t[s]),o=this._calculateScrollIntoView(r);this._scroll(o,z)};$.prototype.onsapescape=function(e){if(this.getType()===K.Light){return}if(e.target.parentNode.className=="sapMFFResetDiv"){return}var t=this._lastCategoryFocusIndex;jQuery(e.target).trigger("blur");this.oItemNavigation.setFocusedIndex(t);this.focus()};$.prototype._getPopover=function(){var e=this.getAggregation("popover");if(!e){var t=this;e=new S({placement:V.Bottom,beforeOpen:function(e){if(t._displayedList){t._displayedList._bSearchEventDefaultBehavior&&t._displayedList._setSearchValue("")}this.setCustomHeader(t._createFilterItemsSearchFieldBar(t._displayedList));var s=this.getSubHeader();if(!s){this.setSubHeader(t._createSelectAllCheckboxBar(t._displayedList))}i(t._displayedList)},beforeClose:function(){t._popoverClosing=true},afterClose:function(e){this._popoverClosing=false;t._handlePopoverAfterClose()},horizontalScrolling:false});this.setAggregation("popover",e,true);e.setContentWidth("30%");e.addStyleClass("sapMFFPop");var i=function(e){if(!e){return}var i=t._getFacetRemoveIcon(e);if(i){i._bTouchStarted=false}}}if(this.getShowPopoverOKButton()){this._addOKButtonToPopover(e)}else{e.destroyAggregation("footer")}return e};$.prototype._handlePopoverAfterClose=function(){var e=this.getAggregation("popover"),t=this._displayedList;if(!e){return}var i=this._getFacetRemoveIcon(t);if(i&&i._bTouchStarted){return}this._restoreListFromDisplayContainer(e);this._displayRemoveIcon(false,t);t._fireListCloseEvent();this._fireConfirmEvent();this.destroyAggregation("popover");if(this._oOpenPopoverDeferred){setTimeout(function(){this._oOpenPopoverDeferred.resolve();this._oOpenPopoverDeferred=undefined}.bind(this),0)}};$.prototype._fireConfirmEvent=function(){this.fireEvent("confirm")};$.prototype._openPopover=function(e,t){var i;if(!e.isOpen()){var s=a.getElementById(t.getAssociation("list"));_(s,"The facet filter button should be associated with a list.");i=!s.fireListOpen({});s.attachUpdateFinished(U.bind(this));this._moveListToDisplayContainer(s,e);e.openBy(t);if(s.getShowRemoveFacetIcon()){this._displayRemoveIcon(true,s)}if(s.getWordWrap()){e.setContentWidth("30%")}if(!i){s._applySearch()}}return this};$.prototype._getAddFacetButton=function(){var e=this.getAggregation("addFacetButton");if(!e){e=new I(this.getId()+"-add",{icon:r.getIconURI("add-filter"),type:H.Transparent,tooltip:this._bundle.getText("FACETFILTER_ADDFACET"),press:function(e){this.openFilterDialog()}.bind(this)});this.setAggregation("addFacetButton",e,true)}return e};$.prototype._getButtonForList=function(e){if(this._buttons[e.getId()]){this._setButtonText(e);return this._buttons[e.getId()]}var t=this;var i=new I({type:H.Transparent,press:function(i){var s=this;var a=function(){var e=t._getPopover();t._openPopover(e,s)};if(e.getMode()===O.MultiSelect){e._preserveOriginalActiveState()}var r=t._getPopover();if(r.isOpen()){setTimeout(function(){if(r.isOpen()){return}t._oOpenPopoverDeferred=jQuery.Deferred();t._oOpenPopoverDeferred.promise().done(a)},100)}else{setTimeout(a.bind(this),100)}}});this._buttons[e.getId()]=i;this.addAggregation("buttons",i);i.setAssociation("list",e.getId(),true);this._setButtonText(e);return i};$.prototype._setButtonText=function(e){var t=this._buttons[e.getId()];if(e._iAllItemsCount===undefined&&e.getMaxItemsCount()||!e._bSearchEventDefaultBehavior){e._iAllItemsCount=e.getMaxItemsCount()}if(t){var i="";var s=Object.getOwnPropertyNames(e._oSelectedKeys);var a=s.length;if(a===1){var r=e._oSelectedKeys[s[0]];i=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[e.getTitle(),r])}else if(a>0&&a===(e._iAllItemsCount?e._iAllItemsCount:0)){i=this._bundle.getText("FACETFILTER_ALL_SELECTED",[e.getTitle()])}else if(a>0){i=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[e.getTitle(),a])}else{i=e.getTitle()}t.setText(i)}};$.prototype._getFacetRemoveIcon=function(e){var t=this,i=this._removeFacetIcons[e.getId()];if(!i){i=new u({src:r.getIconURI("decline"),tooltip:this._bundle.getText("FACETFILTER_REMOVE"),press:function(){i._bPressed=true}});i.addDelegate({ontouchstart:function(){i._bTouchStarted=true;i._bPressed=false},ontouchend:function(){t._displayRemoveIcon(false,e);i._bTouchStarted=false;setTimeout(s.bind(this),100)}},true);var s=function(){if(i._bPressed){e.removeSelections(true);e.setSelectedKeys();e.setProperty("active",false,true)}t._handlePopoverAfterClose()};i.setAssociation("list",e.getId(),true);i.addStyleClass("sapMFFLRemoveIcon");this._removeFacetIcons[e.getId()]=i;this.addAggregation("removeFacetIcons",i);this._displayRemoveIcon(false,e)}return i};$.prototype._displayRemoveIcon=function(e,t){if(this.getShowPersonalization()){var i=this._removeFacetIcons[t.getId()];if(e){i.removeStyleClass("sapMFFLHiddenRemoveIcon");i.addStyleClass("sapMFFLVisibleRemoveIcon")}else{i.removeStyleClass("sapMFFLVisibleRemoveIcon");i.addStyleClass("sapMFFLHiddenRemoveIcon")}}};$.prototype._getFacetDialogNavContainer=function(){var t=new e({autoFocus:false});var i=this._createFacetPage();t.addPage(i);t.setInitialPage(i);t.attachNavigate(function(e){var t=e.getParameters()["to"],s=this.getAggregation("dialog"),a=this._getInvisibleTitleElement();if(t!==i){s.addAriaLabelledBy(a.getId());a.setText(t.getTitle())}else{s.removeAriaLabelledBy(a.getId());a.setText("")}s.setInitialFocus(t)},this);t.attachAfterNavigate(function(e){var t=e.getParameters()["to"];var s=e.getParameters()["from"];if(s===i){var a=this._displayedList.getMode()===O.MultiSelect?t.getContent(0)[1].getItems()[0]:t.getContent(0)[0].getItems()[0];if(a){a.focus()}else if(t.getContent()[1]){t.getContent()[1].focus()}}if(t===i){s.destroySubHeader();_(this._displayedList===null,"Filter items list should have been placed back in the FacetFilter aggregation before page content is destroyed.");s.destroyContent();this._selectedFacetItem.invalidate();t.invalidate();this._selectedFacetItem.focus();this._selectedFacetItem=null}}.bind(this));return t};$.prototype._createFacetPage=function(){var e=this._createFacetList();var t=new A({width:"100%",tooltip:this._bundle.getText("FACETFILTER_SEARCH"),liveChange:function(t){var i=e.getBinding("items");if(i){var s=new d("text",c.Contains,t.getParameters()["newValue"]);i.filter([s])}}});var i=new B({enableScrolling:true,title:this._bundle.getText("FACETFILTER_TITLE"),titleLevel:q.H1,subHeader:new C({contentMiddle:t}),content:[e]});return i};$.prototype._getInvisibleTitleElement=function(){if(!this._oInvisibleTitleElement){this._oInvisibleTitleElement=(new l).toStatic()}return this._oInvisibleTitleElement};$.prototype._createFilterItemsPage=function(){var e=new B({titleLevel:q.H1,showNavButton:true,enableScrolling:true,navButtonPress:function(e){var t=e.getSource().getParent();this._navFromFilterItemsPage(t)}.bind(this)});return e};$.prototype._getFilterItemsPage=function(e){var t=e.getPages()[1];if(t){e.removePage(t);t.destroy()}var i=this._createFilterItemsPage();e.addPage(i);return i};$.prototype._createFilterItemsSearchFieldBar=function(e){var t=true;if(e.getDataType()!=k.String){t=false}var i=new A({value:e._getSearchValue(),width:"100%",enabled:t,tooltip:this._bundle.getText("FACETFILTER_SEARCH"),search:function(e){this._displayedList._handleSearchEvent(e)}.bind(this)});if(this.getLiveSearch()){i.attachLiveChange(e._handleSearchEvent,e)}var s=new C({contentMiddle:i});e.setAssociation("search",i);return s};$.prototype._getFacetDialog=function(){var e=this.getAggregation("dialog");if(!e){var t=this;e=new R({showHeader:false,stretch:h.system.phone?true:false,afterClose:function(){t._invalidateFlag=true;var e=this.getContent()[0];var i=e.getPages()[1];if(e.getCurrentPage()===i){var s=t._restoreListFromDisplayContainer(i);if(s.getMode()===O.MultiSelect){s._updateActiveState();t._bCheckForAddListBtn=true}s._fireListCloseEvent();s._bSearchEventDefaultBehavior&&s._search("")}this.destroyAggregation("content",true);t.invalidate()},beginButton:new I({text:this._bundle.getText("FACETFILTER_ACCEPT"),type:H.Emphasized,press:function(){t._closeDialog()}}),contentHeight:"500px"});e.addStyleClass("sapMFFDialog");e.onsapentermodifiers=function(e){if(e.shiftKey&&!e.ctrlKey&&!e.altKey){var i=this.getContent()[0];t._navFromFilterItemsPage(i)}};this.setAggregation("dialog",e,true)}return e};$.prototype._closeDialog=function(){var e=this.getAggregation("dialog");if(e&&e.isOpen()){e.close();this._fireConfirmEvent()}};$.prototype._closePopover=function(){var e=this.getAggregation("popover");if(e&&e.isOpen()){e.close()}};$.prototype._createFacetList=function(){var e=this._oFacetList=new E({mode:O.None,items:{path:"/items",template:new x({title:"{text}",counter:"{count}",type:M.Navigation,customData:[new s({key:"index",value:"{index}"})]})}});var t=this._getMapFacetLists();var i=new p({items:t});if(t.length>100){i.setSizeLimit(t.length)}var a=this;e.attachUpdateFinished(function(){for(var t=0;t<e.getItems().length;t++){var i=this.getItems()[t];i.detachPress(a._handleFacetListItemPress,a);i.attachPress(a._handleFacetListItemPress,a)}});e.setModel(i);return e};$.prototype.refreshFacetList=function(){this._oFacetList.getModel().setData({items:this._getMapFacetLists()});return this};$.prototype._getMapFacetLists=function(){return this.getLists().map(function(e,t){return{text:e.getTitle(),count:e.getAllCount(),index:t}})};$.prototype._createSelectAllCheckboxBar=function(e){if(e.getMode()!==O.MultiSelect){return null}var t=e.getActive()&&e.getItems().length>0&&Object.getOwnPropertyNames(e._oSelectedKeys).length===e.getItems().length;var i=new w(e.getId()+"-selectAll",{text:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),tooltip:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),selected:t,select:function(t){i.setSelected(t.getParameter("selected"));e._handleSelectAllClick(t.getParameter("selected"))}});e.setAssociation("allcheckbox",i);var s=new C({visible:Boolean(e.getItems(true).length)});s.addEventDelegate({ontap:function(t){if(t.srcControl===this){e._handleSelectAllClick(i.getSelected())}}},s);s.addContentLeft(i);s.addStyleClass("sapMFFCheckbar");this._oAllCheckBoxBar=s;return s};$.prototype._handleFacetListItemPress=function(e){this._navToFilterItemsPage(e.getSource())};$.prototype._navToFilterItemsPage=function(e){this._selectedFacetItem=e;var t=this.getAggregation("dialog").getContent()[0];var i=e.getCustomData();_(i.length===1,"There should be exactly one custom data for the original facet list item index");var s=i[0].getValue();var a=this.getLists()[s];this._listIndexAgg=this.indexOfAggregation("lists",a);if(this._listIndexAgg==s){var r=this._getFilterItemsPage(t);a.fireListOpen({});a.attachUpdateFinished(U.bind(this));this._moveListToDisplayContainer(a,r);r.setSubHeader(this._createFilterItemsSearchFieldBar(a));var o=this._createSelectAllCheckboxBar(a);if(o){r.insertContent(o,0)}r.setTitle(a.getTitle());t.to(r)}};$.prototype._navFromFilterItemsPage=function(e){var t=e.getPages()[1];var i=this._restoreListFromDisplayContainer(t);if(i.getMode()===O.MultiSelect){i._updateActiveState()}i._fireListCloseEvent();i._bSearchEventDefaultBehavior&&i._search("");this._selectedFacetItem.setCounter(i.getAllCount());e.backToTop()};$.prototype._moveListToDisplayContainer=function(e,t){this._listAggrIndex=this.indexOfAggregation("lists",e);_(this._listAggrIndex>-1,"The lists index should be valid.");i.prototype.removeAggregation.call(this,"lists",e,true);t.addAggregation("content",e,false);e.setAssociation("facetFilter",this,true);this._displayedList=e};$.prototype._restoreListFromDisplayContainer=function(e){var t=e.removeAggregation("content",this._displayedList,true);this.insertAggregation("lists",t,this._listAggrIndex,t.getActive());this._listAggrIndex=-1;this._displayedList=null;return t};$.prototype._getSequencedLists=function(){var e=-1;var t=[];var i=this.getLists();if(i.length>0){for(var s=0;s<i.length;s++){if(i[s].getActive()){if(i[s].getSequence()<-1){i[s].setSequence(-1)}else if(i[s].getSequence()>e){e=i[s].getSequence()}t.push(i[s])}else if(!i[s].getRetainListSequence()){i[s].setSequence(-1)}}for(var a=0;a<t.length;a++){if(t[a].getSequence()<=-1){e+=1;t[a].setSequence(e)}}if(t.length>1){t.sort(function(e,t){return e.getSequence()-t.getSequence()})}}return t};$.prototype._getSummaryBar=function(){var e=this.getAggregation("summaryBar"),t=this.getType();if(!e){var i=new b({maxLines:1});e=new L({content:[i],active:t===K.Light?true:false,design:P.Info,ariaLabelledBy:i,press:function(e){this.openFilterDialog()}.bind(this)});e._setRootAccessibilityRole("group");this.setAggregation("summaryBar",e)}return e};$.prototype._handleReset=function(){this.fireReset();this.invalidate()};$.prototype._createResetButton=function(){var e=new I({type:H.Transparent,icon:r.getIconURI("undo"),tooltip:this._bundle.getText("FACETFILTER_RESET"),press:function(e){this._invalidateFlag=true;if(this._popoverClosing){setTimeout(this._handleReset.bind(this),S.prototype._getAnimationDuration())}else{this._handleReset()}var t=this.getLists();for(var i=0;i<t.length;i++){t[i]._setSearchValue("");t[i]._applySearch();var s=t[i].getItems()[0];if(s){s.focus()}}}.bind(this)});return e};$.prototype._addOKButtonToPopover=function(e){var t=e.getFooter(),i;if(!t){i=new I({text:this._bundle.getText("FACETFILTER_ACCEPT"),type:H.Emphasized,press:function(){this._closePopover()}.bind(this)});t=new F({content:[new T,i]});e.setFooter(t)}};$.prototype._getSummaryText=function(){var e=", ";var t=" ";var i="";var s=true;var a=this.getLists();if(a.length>0){for(var r=0;r<a.length;r++){var o=a[r];if(o.getActive()){var n=this._getSelectedItemsText(o);var l="";for(var g=0;g<n.length;g++){l=l+n[g]+e}if(l){l=l.substring(0,l.lastIndexOf(e)).trim();if(s){i=this._bundle.getText("FACETFILTER_INFOBAR_FILTERED_BY",[o.getTitle(),l]);s=false}else{i=i+t+this._bundle.getText("FACETFILTER_INFOBAR_AND")+t+this._bundle.getText("FACETFILTER_INFOBAR_AFTER_AND",[o.getTitle(),l])}}}}}if(!i){i=this._bundle.getText("FACETFILTER_INFOBAR_NO_FILTERS")}return i};$.prototype._getSelectedItemsText=function(e){var t=e.getSelectedItems().map(function(e){return e.getText()});e._oSelectedKeys&&Object.getOwnPropertyNames(e._oSelectedKeys).forEach(function(i){t.indexOf(e._oSelectedKeys[i])===-1&&t.push(e._oSelectedKeys[i])});return t};$.prototype._addResetToSummary=function(e){if(e.getContent().length===1){e.addContent(new T({width:""}));var t=this._createResetButton();e.addContent(t);t.addStyleClass("sapUiSizeCompact");t.addStyleClass("sapMFFRefresh");t.addStyleClass("sapMFFBtnHoverable")}};$.prototype._removeResetFromSummary=function(e){if(e.getContent().length===3){var t=e.removeAggregation("content",1);t.destroy();var i=e.removeAggregation("content",1);i.destroy()}};$.prototype._removeList=function(e){if(e){var t=this._buttons[e.getId()];if(t){this.removeAggregation("buttons",t);t.destroy()}var i=this._removeFacetIcons[e.getId()];if(i){this.removeAggregation("removeIcons",i);i.destroy()}delete this._buttons[e.getId()];delete this._removeFacetIcons[e.getId()]}};$.prototype._calculateScrollIntoView=function(e){var t=this.$("head").width(),i=0;if(!t||!e){return i}var s=e.$(),a=s.outerWidth(true),r=s.position().left,o=r+a;if(o>t){i=o-t}else if(r<0){i=r}return i};$.prototype._getScrollingArrow=function(e){var t=null;var i={src:"sap-icon://navigation-"+e+"-arrow"};if(e==="left"){t=this.getAggregation("arrowLeft");if(!t){i.id=this.getId()+"-arrowScrollLeft";t=r.createControlByURI(i);var s=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollLeft"];for(var a=0;a<s.length;a++){t.addStyleClass(s[a]);t.setTooltip(this._bundle.getText("FACETFILTER_PREVIOUS"))}this.setAggregation("arrowLeft",t)}}else if(e==="right"){t=this.getAggregation("arrowRight");if(!t){i.id=this.getId()+"-arrowScrollRight";t=r.createControlByURI(i);var o=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollRight"];for(var a=0;a<o.length;a++){t.addStyleClass(o[a]);t.setTooltip(this._bundle.getText("FACETFILTER_NEXT"))}this.setAggregation("arrowRight",t)}}else{m.error("Scrolling arrow name "+e+" is not valid")}return t};$.prototype._checkOverflow=function(){var e=this.getDomRef("head"),t=jQuery(e),i=this.$(),s=false,a=false,r=false,o=null,n=null,l=null;if(e){o=e.scrollLeft;n=e.scrollWidth;l=e.clientWidth;if(n>l){if(n-l==1){n=l}else{r=true}}i.toggleClass("sapMFFScrolling",r);i.toggleClass("sapMFFNoScrolling",!r);this._lastScrolling=r;if(!this._bRtl){s=o>0;a=n>l&&n>o+l}else{a=t.scrollLeftRTL()>0;s=t.scrollRightRTL()>0}if(a!=this._bPreviousScrollForward||s!=this._bPreviousScrollBack){i.toggleClass("sapMFFNoScrollBack",!s);i.toggleClass("sapMFFNoScrollForward",!a)}}};$.prototype.onclick=function(e){var t=e.target,i=this.getId();if(!t.id){t=t.parentElement}if(!t.id){return}e.preventDefault();if(t.id==i+"-arrowScrollLeft"){t.tabIndex=-1;t.focus();this._scroll(-$.SCROLL_STEP,z)}else if(t.id==i+"-arrowScrollRight"){t.tabIndex=-1;t.focus();this._scroll($.SCROLL_STEP,z)}};$.prototype._scroll=function(e,t){var i=this.getDomRef("head");var s=i.scrollLeft;if(this._bRtl){e=-e}var a=s+e;jQuery(i).stop(true,true).animate({scrollLeft:a},t)};$.prototype._enableTouchSupport=function(){var e=function(e){var t=this.getType();if(t===K.Light){return}e.preventDefault();if(this._iInertiaIntervalId){window.clearInterval(this._iInertiaIntervalId)}this.startScrollX=this.getDomRef("head").scrollLeft;this.startTouchX=e.touches[0].pageX;this._bTouchNotMoved=true;this._lastMoveTime=D.getInstance().getTime()}.bind(this);var t=function(e){var t=this.getType();if(t===K.Light){return}var i=e.touches[0].pageX-this.startTouchX;var s=this.getDomRef("head");var a=s.scrollLeft;var r=this.startScrollX-i;s.scrollLeft=r;this._bTouchNotMoved=false;var o=D.getInstance().getTime()-this._lastMoveTime;this._lastMoveTime=D.getInstance().getTime();if(o>0){this._velocity=(r-a)/o}e.preventDefault()}.bind(this);var i=function(e){var t=this.getType();if(t===K.Light){return}if(this._bTouchNotMoved===false){e.preventDefault();var i=this.getDomRef("head");var s=50;var a=Math.abs(this._velocity/10);this._iInertiaIntervalId=window.setInterval(function(){this._velocity=this._velocity*.8;var e=this._velocity*s;i.scrollLeft=i.scrollLeft+e;if(Math.abs(this._velocity)<a){window.clearInterval(this._iInertiaIntervalId);this._iInertiaIntervalId=undefined}}.bind(this),s)}else if(this._bTouchNotMoved===true){this.onclick(e);e.preventDefault()}this._bTouchNotMoved=undefined;this._lastMoveTime=undefined}.bind(this);this.addEventDelegate({ontouchstart:e},this);this.addEventDelegate({ontouchend:i},this);this.addEventDelegate({ontouchmove:t},this)};return $});
//# sourceMappingURL=FacetFilter.js.map