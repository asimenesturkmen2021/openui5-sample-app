/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/library","sap/ui/Device","sap/ui/core/Core","sap/ui/core/Control"],function(e,t,a,o,i){"use strict";var n=t.ValueState;var r=i.extend("sap.m.ValueStateHeader",{metadata:{library:"sap.m",properties:{text:{type:"string",defaultValue:""},valueState:{type:"sap.ui.core.ValueState",defaultValue:n.None}},aggregations:{formattedText:{type:"sap.m.FormattedText",multiple:false}},associations:{popup:{type:"sap.ui.core.Popup",multiple:false}}},renderer:{apiVersion:2,render:function(e,t){var a={None:"sapMValueStateHeaderNone",Error:"sapMValueStateHeaderError",Warning:"sapMValueStateHeaderWarning",Success:"sapMValueStateHeaderSuccess",Information:"sapMValueStateHeaderInformation"};e.openStart("div",t).class("sapMValueStateHeaderRoot").class(a[t.getValueState()]).openEnd();e.openStart("span",t.getId()+"-inner").class("sapMValueStateHeaderText").openEnd();if(t.getFormattedText()){e.renderControl(t.getFormattedText())}else{e.text(t.getText())}e.close("span");e.close("div")}}});r.prototype._fnOrientationChange=function(){var e=this._getAssociatedPopupObject(),t=this.getDomRef();if(t&&e&&e.isA("sap.m.Dialog")){t.style.width=e.getDomRef().getBoundingClientRect().width+"px"}};r.prototype.init=function(){a.orientation.attachHandler(this._fnOrientationChange,this)};r.prototype.exit=function(){a.orientation.detachHandler(this._fnOrientationChange,this)};r.prototype.setPopup=function(e){var t=this;var a=false;var i=typeof e==="string"?o.byId(e):e;this.setAssociation("popup",i);if(i.isA("sap.m.Dialog")){return this}i._afterAdjustPositionAndArrowHook=function(){var e=t.getDomRef();if(!e){return}e.style.width=i.getDomRef().getBoundingClientRect().width+"px";e.style.height="auto";if(!a){a=true;setTimeout(function(){if(i._getOpenByDomRef()){i._fnOrientationChange()}},0)}};return this};r.prototype._getAssociatedPopupObject=function(){return o.byId(this.getPopup())};r.prototype.onAfterRendering=function(){var e=this._getAssociatedPopupObject();if(e){if(e.isA("sap.m.Popover")){setTimeout(function(){if(e._getOpenByDomRef()){e._fnOrientationChange();e.oPopup._applyPosition()}},0)}}};return r},true);
//# sourceMappingURL=ValueStateHeader.js.map