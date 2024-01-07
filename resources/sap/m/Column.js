/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Element","sap/ui/core/Renderer","sap/ui/core/library","sap/ui/Device","sap/ui/core/InvisibleText"],function(e,t,i,r,n,a,o){"use strict";var s=e.PopinDisplay;var p=n.VerticalAlign;var u=n.TextAlign;var d=n.SortOrder;var h=i.extend("sap.m.Column",{metadata:{library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},hAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:u.Begin},vAlign:{type:"sap.ui.core.VerticalAlign",group:"Appearance",defaultValue:p.Inherit},styleClass:{type:"string",group:"Appearance",defaultValue:null},visible:{type:"boolean",group:"Appearance",defaultValue:true},minScreenWidth:{type:"string",group:"Behavior",defaultValue:null},demandPopin:{type:"boolean",group:"Behavior",defaultValue:false},popinHAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:u.Begin,deprecated:true},popinDisplay:{type:"sap.m.PopinDisplay",group:"Appearance",defaultValue:s.Block},mergeDuplicates:{type:"boolean",group:"Behavior",defaultValue:false},mergeFunctionName:{type:"string",group:"Misc",defaultValue:"getText"},sortIndicator:{type:"sap.ui.core.SortOrder",group:"Appearance",defaultValue:d.None},importance:{type:"sap.ui.core.Priority",group:"Behavior",defaultValue:"None"},autoPopinWidth:{type:"float",group:"Behavior",defaultValue:8}},defaultAggregation:"header",aggregations:{header:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.ui.core.Control",multiple:false}},associations:{headerMenu:{type:"sap.ui.core.IColumnHeaderMenu",multiple:false}},designtime:"sap/m/designtime/Column.designtime"}});h.prototype._index=-1;h.prototype._media=null;h.prototype._bForcedColumn=false;h.prototype.exit=function(){this._clearMedia()};h.prototype.setParent=function(e){i.prototype.setParent.apply(this,arguments);if(!e){delete this._initialOrder}return this};h.prototype.getTable=function(){var e=this.getParent();if(e&&e.isA("sap.m.Table")){return e}};h.prototype.informTable=function(e,t,i){var r=this.getTable();if(r){var n="onColumn"+e;if(r[n]){r[n](this,t,i)}}};h.prototype.ontouchstart=function(e){this._bTouchStartMarked=e.isMarked()};h.prototype.ontap=function(e){if(!this._bTouchStartMarked&&!e.isMarked()){this.informTable("Press")}};h.prototype.onsapspace=function(e){if(e.srcControl===this){this.informTable("Press");e.preventDefault()}};h.prototype.onsapenter=h.prototype.onsapspace;h.prototype.oncontextmenu=function(e){var t=this.getHeaderMenuInstance();if(t){t.openBy(this);e.preventDefault()}};h.prototype.invalidate=function(){var e=this.getParent();if(e&&e.bOutput){i.prototype.invalidate.apply(this,arguments)}};h.prototype._clearMedia=function(){if(this._media&&this._minWidth){this._detachMediaContainerWidthChange(this._notifyResize,this,this.getId());a.media.removeRangeSet(this.getId());this._media=null}};h.prototype._addMedia=function(){delete this._bShouldAddMedia;if(this._minWidth){a.media.initRangeSet(this.getId(),[parseFloat(this._minWidth)]);this._attachMediaContainerWidthChange(this._notifyResize,this,this.getId());this._media=this._getCurrentMediaContainerRange(this.getId());if(this._media){this._media.matches=!!this._media.from}}};h.prototype._notifyResize=function(e){if(this._media.from===e.from){return}this._media=e;this._media.matches=!!e.from;if(this.getVisible()){this.informTable("Resize")}};h.prototype._validateMinWidth=function(t){if(!t){return}if(Object.prototype.toString.call(t)!="[object String]"){throw new Error('expected string for property "minScreenWidth" of '+this)}if(Object.keys(e.ScreenSizes).indexOf(t.toLowerCase())!=-1){return}if(!/^\d+(\.\d+)?(px|em|rem)$/i.test(t)){throw new Error('invalid CSS size("px", "em", "rem" required) or sap.m.ScreenSize enumeration for property "minScreenWidth" of '+this)}};h.prototype.getCssAlign=function(e){e=e||this.getHAlign();if(e===u.Begin||e===u.End||e===u.Initial){e=r.getTextAlign(e)}return e.toLowerCase()};h.prototype.setIndex=function(e){this._index=+e};h.prototype.getIndex=function(){return this._index};h.prototype.setOrder=function(e){this._order=+e};h.prototype.getOrder=function(){return this.hasOwnProperty("_order")?this._order:this.getInitialOrder()};h.prototype.setInitialOrder=function(e){this._initialOrder=+e};h.prototype.getInitialOrder=function(){if(this.hasOwnProperty("_initialOrder")){return this._initialOrder}var e=this.getTable();if(!e){return-1}return e.indexOfColumn(this)};h.prototype._setMinScreenWidth=function(t){this._clearMedia();this._minWidth=0;if(t){t=t.toLowerCase();var i=e.ScreenSizes[t];if(i){this._minWidth=i+"px"}else if(t.endsWith("px")){this._minWidth=t}else{var r=parseFloat(e.BaseFontSize);this._minWidth=parseFloat(t)*r+"px"}var n=this.getTable();if(n&&n.isActive()){this._addMedia()}else{this._bShouldAddMedia=true}}};h.prototype.setMinScreenWidth=function(e){e=e||"";if(e==this.getMinScreenWidth()){return this}this._validateMinWidth(e);this._setMinScreenWidth(e);return this.setProperty("minScreenWidth",e)};h.prototype.setSortIndicator=function(e){this.setProperty("sortIndicator",e,true);this.$().attr("aria-sort",this.getSortIndicator().toLowerCase());return this};h.prototype.isPopin=function(){if(!this.getDemandPopin()){return false}var e=this.getTable();if(e){var t=e.getHiddenInPopin()||[];var i=t.includes(this.getImportance());if(i){return false}}return this.isHidden()};h.prototype.isHidden=function(){return this._media?!this._media.matches:false};h.prototype.setLastValue=function(e){this._lastValue=e;return this};h.prototype.clearLastValue=function(){return this.setLastValue(NaN)};h.prototype.getLastValue=function(){return this._lastValue};h.prototype.onItemsRemoved=function(){this.clearLastValue()};h.prototype.onTableRendering=function(){this.clearLastValue();if(this._bShouldAddMedia){this._addMedia()}};h.prototype.getCalculatedMinScreenWidth=function(){return parseInt(this._minWidth)||0};h.prototype.setForcedColumn=function(e){if(this._bForcedColumn==e){return}this._bForcedColumn=e;this._setMinScreenWidth(e?"":this.getMinScreenWidth())};h.prototype.getHeaderMenuInstance=function(){return t.byId(this.getHeaderMenu())};h.prototype.setHeader=function(e){var t=this.getHeader();if(t&&t.isA("sap.m.Label")){t.detachEvent("_change",this._onLabelPropertyChange,this);t.setIsInColumnHeaderContext(false)}this.setAggregation("header",e);var i=this.getHeader();if(i&&i.isA("sap.m.Label")){i.attachEvent("_change",this._onLabelPropertyChange,this);i.setIsInColumnHeaderContext(true)}return this};h.prototype._onLabelPropertyChange=function(e){if(e.getParameter("name")!="required"){return}if(this.getTable().bActiveHeaders||this.getHeaderMenuInstance()){this.$()[e.getSource().getRequired()?"addAriaDescribedBy":"removeAriaDescribedBy"](o.getStaticId("sap.m","CONTROL_IN_COLUMN_REQUIRED"))}};return h});
//# sourceMappingURL=Column.js.map