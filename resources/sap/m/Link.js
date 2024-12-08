/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Element","sap/ui/core/InvisibleText","sap/ui/core/EnabledPropagator","sap/ui/core/AccessKeysEnablement","sap/ui/core/LabelEnablement","sap/ui/core/Lib","sap/ui/core/Icon","sap/ui/core/IconPool","sap/ui/core/library","sap/ui/Device","./LinkRenderer","sap/ui/events/KeyCodes","sap/base/security/URLListValidator","sap/base/Log"],function(e,t,r,i,o,a,n,s,p,l,u,c,d,f,g,h){"use strict";var y=u.TextDirection;var b=u.TextAlign;var I=u.aria.HasPopup;var m=e.LinkAccessibleRole;var v=e.EmptyIndicatorMode;var E=t.extend("sap.m.Link",{metadata:{interfaces:["sap.ui.core.IShrinkable","sap.ui.core.IFormContent","sap.ui.core.ISemanticFormContent","sap.ui.core.ITitleContent","sap.ui.core.IAccessKeySupport","sap.m.IToolbarInteractiveControl","sap.ui.core.ILabelable"],library:"sap.m",designtime:"sap/m/designtime/Link.designtime",properties:{text:{type:"string",group:"Data",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},endIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},enabled:{type:"boolean",group:"Behavior",defaultValue:true},target:{type:"string",group:"Behavior",defaultValue:null},rel:{type:"string",group:"Behavior",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},href:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},validateUrl:{type:"boolean",group:"Data",defaultValue:false},wrapping:{type:"boolean",group:"Appearance",defaultValue:false},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:b.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:y.Inherit},subtle:{type:"boolean",group:"Behavior",defaultValue:false},emphasized:{type:"boolean",group:"Behavior",defaultValue:false},ariaHasPopup:{type:"sap.ui.core.aria.HasPopup",group:"Accessibility",defaultValue:I.None},accessibleRole:{type:"sap.m.LinkAccessibleRole",group:"Accessibility",defaultValue:m.Default},emptyIndicatorMode:{type:"sap.m.EmptyIndicatorMode",group:"Appearance",defaultValue:v.Off},highlightAccKeysRef:{type:"boolean",defaultValue:false,visibility:"hidden"},accesskey:{type:"string",defaultValue:"",visibility:"hidden"}},aggregations:{_icon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_endIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{allowPreventDefault:true,parameters:{ctrlKey:{type:"boolean"},metaKey:{type:"boolean"}}}},dnd:{draggable:true,droppable:false}},renderer:d});o.call(E.prototype);E.prototype.init=function(){a.registerControl(this)};E.prototype.onBeforeRendering=function(){};E.prototype.getAccessKeysFocusTarget=function(){return this.getFocusDomRef()};E.prototype.onAccKeysHighlightStart=function(){A.call(this,true)};E.prototype.onAccKeysHighlightEnd=function(){A.call(this,false)};E.prototype.onAfterRendering=function(){if(c.system.phone||c.system.tablet){var e=this.getDomRef();if(!e){return}e.removeEventListener("touchstart",this._onTouchStart);if(e.getAttribute("href")==="#"){e.addEventListener("touchstart",this._onTouchStart)}}};E.prototype.exit=function(){var e=this.getAggregation("_icon"),t=this.getAggregation("_endIcon");if(c.system.phone||c.system.tablet){var r=this.getDomRef();if(!r){return}r.removeEventListener("touchstart",this._onTouchStart)}if(e){e.destroy();e=null}if(t){t.destroy();t=null}};E.prototype._onTouchStart=function(e){e.preventDefault()};E.prototype.onkeydown=function(e){if(e.which===f.SPACE||e.which===f.SHIFT||e.which===f.ESCAPE){if(e.which===f.SPACE){if(this.getEnabled()||this.getHref()){e.setMarked();e.preventDefault();this._bPressedSpace=true}}if(this._bPressedSpace&&(e.which===f.ESCAPE||e.which===f.SHIFT)){this._bPressedEscapeOrShift=true}}else{if(this._bPressedSpace){e.preventDefault()}}};E.prototype.onkeyup=function(e){if(e.which===f.SPACE){if(!this._bPressedEscapeOrShift){this._handlePress(e);if(this.getHref()&&!e.isDefaultPrevented()){e.preventDefault();e.setMarked();var t=document.createEvent("MouseEvents");t.initEvent("click",false,true);this.getDomRef().dispatchEvent(t)}}else{this._bPressedEscapeOrShift=false}this._bPressedSpace=false}};E.prototype._handlePress=function(e){var t=e.target,r;if(this.getEnabled()){e.setMarked();r=(t.classList.contains("sapMLnk")||t.parentElement.classList.contains("sapMLnk"))&&(t.getAttribute("href")=="#"||t.parentElement.getAttribute("href")=="#");if(!this.firePress({ctrlKey:!!e.ctrlKey,metaKey:!!e.metaKey})||r){e.preventDefault()}}else{e.preventDefault()}};E.prototype.onsapenter=E.prototype._handlePress;E.prototype.onclick=E.prototype._handlePress;E.prototype.ontouchstart=function(e){if(this.getEnabled()){e.setMarked()}};E.prototype.setSubtle=function(e){this.setProperty("subtle",e);if(e&&!E.prototype._sAriaLinkSubtleId){E.prototype._sAriaLinkSubtleId=i.getStaticId("sap.m","LINK_SUBTLE")}return this};E.prototype.setEmphasized=function(e){this.setProperty("emphasized",e);if(e&&!E.prototype._sAriaLinkEmphasizedId){E.prototype._sAriaLinkEmphasizedId=i.getStaticId("sap.m","LINK_EMPHASIZED")}return this};E.prototype.setIcon=function(e){if(!l.isIconURI(e)){h.error("setIcon: The provided URI ' + sSrc + ' is is not a valid Icon URI!")}else{var t=this._getIcon();t.setSrc(e);this.setProperty("icon",e)}return this};E.prototype.setEndIcon=function(e){if(!l.isIconURI(e)){h.error("setEndIcon: The provided URI ' + sSrc + ' is is not a valid Icon URI!")}else{var t=this._getEndIcon();t.setSrc(e);this.setProperty("endIcon",e)}return this};E.prototype._isHrefValid=function(e){return this.getValidateUrl()?g.validate(e):true};E.prototype.getAccessibilityInfo=function(){var e=s.getResourceBundleFor("sap.m"),t=this.getEmphasized()?e.getText("LINK_EMPHASIZED"):"",r=this.getSubtle()?e.getText("LINK_SUBTLE"):"",i=this.getText(),o=i,a=this.getAccessibleRole(),n;if(i){n=a===m.Default?e.getText("ACC_CTR_TYPE_LINK"):e.getText("ACC_CTR_TYPE_BUTTON");t&&(o+=" "+t);r&&(o+=" "+r)}return{role:a===m.Default?"link":a,type:n,description:o,focusable:this.getEnabled(),enabled:this.getEnabled()}};E.prototype.getFormDoNotAdjustWidth=function(){return true};E.prototype._getTabindex=function(){return this.getText()&&this.getEnabled()?"0":"-1"};E.prototype._determineSelfReferencePresence=function(){var e=this.getAriaLabelledBy(),t=e.indexOf(this.getId())!==-1,r=n.getReferencingLabels(this).length>0,i=this.getParent(),o=!!(i&&i.enhanceAccessibilityState);return!t&&(e.length>0||r||o)};E.prototype._getToolbarInteractive=function(){return true};var A=function(e){var t=this.getAriaLabelledBy();if(t.length){var i=r.getElementById(t[0]);i.setProperty("highlightAccKeysRef",e);if(i.getText&&i.getText()){this.setProperty("accesskey",i.getText()[0].toLowerCase())}}};E.prototype.getFormFormattedValue=function(){return this.getText()};E.prototype.getFormValueProperty=function(){return"text"};E.prototype.getFormObservingProperties=function(){return["text"]};E.prototype.getFormRenderAsControl=function(){return true};E.prototype._getIcon=function(){var e=this.getAggregation("_icon");if(!e){e=new p(this.getId()+"-icon",{useIconTooltip:false}).addStyleClass("sapMLnkIcon");this.setAggregation("_icon",e)}return e};E.prototype._getEndIcon=function(){var e=this.getAggregation("_endIcon");if(!e){e=new p(this.getId()+"-endIcon",{useIconTooltip:false}).addStyleClass("sapMLnkEndIcon");this.setAggregation("_endIcon",e)}return e};E.prototype.hasLabelableHTMLElement=function(){return false};return E});
//# sourceMappingURL=Link.js.map