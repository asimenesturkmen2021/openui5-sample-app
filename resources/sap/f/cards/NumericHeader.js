/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseHeader","./NumericIndicators","sap/base/Log","sap/m/library","sap/m/Text","sap/m/ObjectStatus","sap/f/cards/NumericHeaderRenderer","sap/ui/core/library","sap/m/Avatar","sap/ui/core/InvisibleText"],function(t,e,i,a,s,r,n,o,p,l){"use strict";const u=o.ValueState;const g=a.AvatarShape;const d=a.AvatarColor;const c=a.AvatarImageFitType;const h=a.AvatarSize;var f=t.extend("sap.f.cards.NumericHeader",{metadata:{library:"sap.f",interfaces:["sap.f.cards.IHeader"],properties:{title:{type:"string",group:"Appearance"},titleMaxLines:{type:"int",defaultValue:3},subtitle:{type:"string",group:"Appearance"},subtitleMaxLines:{type:"int",defaultValue:2},statusText:{type:"string",defaultValue:""},iconDisplayShape:{type:"sap.m.AvatarShape",defaultValue:g.Circle},iconSrc:{type:"sap.ui.core.URI",defaultValue:""},iconInitials:{type:"string",defaultValue:""},iconAlt:{type:"string",defaultValue:""},iconBackgroundColor:{type:"sap.m.AvatarColor",defaultValue:d.Transparent},iconVisible:{type:"boolean",defaultValue:true},iconSize:{type:"sap.m.AvatarSize",defaultValue:h.S},unitOfMeasurement:{type:"string",group:"Data"},number:{type:"string",group:"Data"},numberSize:{type:"string",group:"Appearance",defaultValue:"L"},numberVisible:{type:"boolean",defaultValue:true},scale:{type:"string",group:"Data"},trend:{type:"sap.m.DeviationIndicator",group:"Appearance",defaultValue:"None"},state:{type:"sap.m.ValueColor",group:"Appearance",defaultValue:"Neutral"},details:{type:"string",group:"Appearance"},detailsState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:u.None},detailsMaxLines:{type:"int",defaultValue:1},sideIndicatorsAlignment:{type:"sap.f.cards.NumericHeaderSideIndicatorsAlignment",group:"Appearance",defaultValue:"Begin"}},aggregations:{sideIndicators:{type:"sap.f.cards.NumericSideIndicator",multiple:true,forwarding:{getter:"_getNumericIndicators",aggregation:"sideIndicators"}},_title:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_subtitle:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_avatar:{type:"sap.m.Avatar",multiple:false,visibility:"hidden"},_unitOfMeasurement:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_details:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_numericIndicators:{type:"sap.f.cards.NumericIndicators",multiple:false,visibility:"hidden"}},events:{press:{}}},renderer:n});f.prototype.init=function(){t.prototype.init.apply(this,arguments);this.data("sap-ui-fastnavgroup","true",true);this._oAriaAvatarText=new l({id:this.getId()+"-ariaAvatarText"});this._oAriaAvatarText.setText(this._oRb.getText("ARIA_HEADER_AVATAR_TEXT"))};f.prototype.exit=function(){t.prototype.exit.apply(this,arguments);this._oAriaAvatarText.destroy();this._oAriaAvatarText=null};f.prototype.onBeforeRendering=function(){t.prototype.onBeforeRendering.apply(this,arguments);this._getTitle().setText(this.getTitle()).setMaxLines(this.getTitleMaxLines());this._getSubtitle().setText(this.getSubtitle()).setMaxLines(this.getSubtitleMaxLines());this._getUnitOfMeasurement().setText(this.getUnitOfMeasurement());this._getAvatar().setDisplayShape(this.getIconDisplayShape()).setSrc(this.getIconSrc()).setInitials(this.getIconInitials()).setTooltip(this.getIconAlt()).setBackgroundColor(this.getIconBackgroundColor()).setDisplaySize(this.getIconSize());if(!this.isPropertyInitial("detailsState")&&!this.isPropertyInitial("detailsMaxLines")){i.error("Both details state and details max lines can not be used at the same time. Max lines setting will be ignored.")}if(!this.isPropertyInitial("detailsState")){this._createDetails(true).setText(this.getDetails()).setState(this.getDetailsState())}else{this._createDetails().setText(this.getDetails()).setMaxLines(this.getDetailsMaxLines())}this._getNumericIndicators().setNumber(this.getNumber()).setNumberSize(this.getNumberSize()).setScale(this.getScale()).setTrend(this.getTrend()).setState(this.getState()).setSideIndicatorsAlignment(this.getSideIndicatorsAlignment()).setNumberVisible(this.getNumberVisible())};f.prototype.shouldShowIcon=function(){return this.getIconVisible()};f.prototype.enhanceAccessibilityState=function(t,e){if(t===this.getAggregation("_title")){e.role=this.getTitleAriaRole();e.level=this.getAriaHeadingLevel()}};f.prototype._getTitle=function(){var t=this.getAggregation("_title");if(!t){t=new s({id:this.getId()+"-title",wrapping:true,maxLines:this.getTitleMaxLines()});this.setAggregation("_title",t)}return t};f.prototype._getSubtitle=function(){var t=this.getAggregation("_subtitle");if(!t){t=new s({id:this.getId()+"-subtitle",wrapping:true,maxLines:this.getSubtitleMaxLines()});this.setAggregation("_subtitle",t)}return t};f.prototype._getAvatar=function(){var t=this.getAggregation("_avatar");if(!t){t=new p({imageFitType:c.Contain}).addStyleClass("sapFCardIcon");this.setAggregation("_avatar",t)}return t};f.prototype._getUnitOfMeasurement=function(){var t=this.getAggregation("_unitOfMeasurement");if(!t){t=new s({id:this.getId()+"-unitOfMeasurement",wrapping:false});this.setAggregation("_unitOfMeasurement",t)}return t};f.prototype._createDetails=function(t){var e=this.getAggregation("_details");if(e?.isA("sap.m.Text")&&t){e.destroy()}else if(e){return e}var i={id:this._getDetailsId()};if(t){e=new r(i)}else{e=new s(i)}this.setAggregation("_details",e);return e};f.prototype._getDetails=function(){return this.getAggregation("_details")};f.prototype._getDetailsId=function(){return this.getId()+"-details"};f.prototype._getNumericIndicators=function(){var t=this.getAggregation("_numericIndicators");if(!t){t=new e;this.setAggregation("_numericIndicators",t)}return t};f.prototype._getAriaLabelledBy=function(){const t=[];if(this.getParent()&&this.getParent()._ariaText){t.push(this.getParent()._ariaText.getId())}if(this.getTitle()){t.push(this._getTitle().getId())}if(this.getSubtitle()){t.push(this._getSubtitle().getId())}if(this.getStatusText()){t.push(this.getId()+"-status")}t.push(this._getUnitOfMeasurement().getId());if(this.getIconSrc()||this.getIconInitials()){t.push(this.getId()+"-ariaAvatarText")}if(this.getNumber()||this.getScale()){t.push(this._getNumericIndicators()._getMainIndicator().getId())}t.push(this._getSideIndicatorIds());if(this.getDetails()){t.push(this._getDetailsId())}t.push(this._getBannerLinesIds());return t.filter(t=>!!t).join(" ")};f.prototype._getSideIndicatorIds=function(){return this.getSideIndicators().map(function(t){return t.getId()}).join(" ")};f.prototype.isLoading=function(){return false};f.prototype.attachPress=function(){var e=Array.prototype.slice.apply(arguments);e.unshift("press");t.prototype.attachEvent.apply(this,e);this.invalidate();return this};f.prototype.detachPress=function(){var e=Array.prototype.slice.apply(arguments);e.unshift("press");t.prototype.detachEvent.apply(this,e);this.invalidate();return this};return f});
//# sourceMappingURL=NumericHeader.js.map