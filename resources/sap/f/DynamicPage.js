/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/base/i18n/Localization","sap/ui/core/Control","sap/ui/core/ControlBehavior","sap/m/library","sap/ui/base/ManagedObjectObserver","sap/ui/core/Element","sap/ui/core/Lib","sap/ui/core/ResizeHandler","sap/ui/core/Configuration","sap/ui/core/InvisibleText","sap/ui/core/delegate/ScrollEnablement","sap/ui/Device","sap/ui/base/ManagedObject","sap/ui/dom/getScrollbarSize","sap/f/DynamicPageTitle","sap/f/DynamicPageHeader","./DynamicPageRenderer","sap/base/Log","sap/ui/dom/units/Rem","sap/ui/core/library"],function(e,t,i,r,a,n,s,o,l,d,h,p,_,g,c,u,f,S,H,y,E){"use strict";var A=a.PageBackgroundDesign;var T=i.extend("sap.f.DynamicPage",{metadata:{library:"sap.f",properties:{preserveHeaderStateOnScroll:{type:"boolean",group:"Behavior",defaultValue:false},headerExpanded:{type:"boolean",group:"Behavior",defaultValue:true},headerPinned:{type:"boolean",group:"Behavior",defaultValue:false},toggleHeaderOnTitleClick:{type:"boolean",group:"Behavior",defaultValue:true},showFooter:{type:"boolean",group:"Behavior",defaultValue:false},backgroundDesign:{type:"sap.m.PageBackgroundDesign",group:"Appearance",defaultValue:A.Standard},fitContent:{type:"boolean",group:"Behavior",defaultValue:false}},associations:{stickySubheaderProvider:{type:"sap.f.IDynamicPageStickyContent",multiple:false}},aggregations:{title:{type:"sap.f.DynamicPageTitle",multiple:false},header:{type:"sap.f.DynamicPageHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.m.IBar",multiple:false},landmarkInfo:{type:"sap.f.DynamicPageAccessibleLandmarkInfo",multiple:false}},events:{pinnedStateChange:{parameters:{pinned:{type:"boolean"}}}},dnd:{draggable:false,droppable:true},designtime:"sap/f/designtime/DynamicPage.designtime"},renderer:S});function P(e){if(arguments.length===1){return e&&"length"in e?e.length>0:!!e}return Array.prototype.slice.call(arguments).every(function(e){return P(e)})}function v(e){var t;if(!e){return false}t=e.getBoundingClientRect();return!!(t.width&&t.height)}var b=E.AccessibleLandmarkRole;T.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE=.6;T.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE=.6;T.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE=.3;T.MEDIA_RANGESET_NAME="DynamicPageRangeSet";T.BREAK_POINTS={DESKTOP:1439,TABLET:1024,PHONE:600};T.EVENTS={TITLE_PRESS:"_titlePress",TITLE_MOUSE_OVER:"_titleMouseOver",TITLE_MOUSE_OUT:"_titleMouseOut",PIN_UNPIN_PRESS:"_pinUnpinPress",VISUAL_INDICATOR_MOUSE_OVER:"_visualIndicatorMouseOver",VISUAL_INDICATOR_MOUSE_OUT:"_visualIndicatorMouseOut",HEADER_VISUAL_INDICATOR_PRESS:"_headerVisualIndicatorPress",TITLE_VISUAL_INDICATOR_PRESS:"_titleVisualIndicatorPress"};T.MEDIA={PHONE:"sapFDynamicPage-Std-Phone",TABLET:"sapFDynamicPage-Std-Tablet",DESKTOP:"sapFDynamicPage-Std-Desktop",DESKTOP_XL:"sapFDynamicPage-Std-Desktop-XL"};T.RESIZE_HANDLER_ID={PAGE:"_sResizeHandlerId",TITLE:"_sTitleResizeHandlerId",HEADER:"_sHeaderResizeHandlerId",CONTENT:"_sContentResizeHandlerId"};T.DIV="div";T.HEADER="header";T.FOOTER="footer";T.HEADER_CONTENT_PADDING_BOTTOM=y.toPx("1rem");T.SHOW_FOOTER_CLASS_NAME="sapFDynamicPageActualFooterControlShow";T.HIDE_FOOTER_CLASS_NAME="sapFDynamicPageActualFooterControlHide";T.NAVIGATION_CLASS_NAME="sapFDynamicPageNavigation";T.ARIA_ROLE_DESCRIPTION="DYNAMIC_PAGE_ROLE_DESCRIPTION";T.ARIA_LABEL_TOOLBAR_FOOTER_ACTIONS="ARIA_LABEL_TOOLBAR_FOOTER_ACTIONS";T.prototype.init=function(){this._bPinned=false;this._bHeaderInTitleArea=false;this._bExpandingWithAClick=false;this._bSuppressToggleHeaderOnce=false;this._headerBiggerThanAllowedHeight=false;this._oStickySubheader=null;this._bStickySubheaderInTitleArea=false;this._oScrollHelper=new p(this,this.getId()+"-content",{horizontal:false,vertical:true});this._oStickyHeaderObserver=null;this._oHeaderObserver=null;this._oTitleObserver=null;this._oSubHeaderAfterRenderingDelegate={onAfterRendering:function(){this._bStickySubheaderInTitleArea=false;this._cacheDomElements();this._adjustStickyContent()}};this._setAriaRoleDescription(o.getResourceBundleFor("sap.f").getText(T.ARIA_ROLE_DESCRIPTION));this._initRangeSet();this._attachMediaContainerWidthChange(this._onMediaRangeChange,this,T.MEDIA_RANGESET_NAME)};T.prototype.onBeforeRendering=function(){if(!this._preserveHeaderStateOnScroll()){this._attachPinPressHandler()}this._attachTitlePressHandler();this._attachVisualIndicatorsPressHandlers();if(_.system.desktop){this._attachVisualIndicatorMouseOverHandlers();this._attachTitleMouseOverHandlers()}this._attachHeaderObserver();this._attachTitleObserver();this._addStickySubheaderAfterRenderingDelegate();this._detachScrollHandler();this._detachResizeHandlers();this._toggleAdditionalNavigationClass();this._setFooterAriaLabelledBy()};T.prototype.onAfterRendering=function(){var e,t;if(this.getPreserveHeaderStateOnScroll()){setTimeout(this._overridePreserveHeaderStateOnScroll.bind(this),0)}this._cacheDomElements();this._attachResizeHandlers();this._updateMedia(this._getWidth(this));this._attachScrollHandler();this._updateTitlePositioning();this._attachPageChildrenAfterRenderingDelegates();this._updatePinButtonState();this._hidePinButtonIfNotApplicable();if(!this.getHeaderExpanded()){this._snapHeader(false);e=this.getHeader()&&!this.getPreserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();if(e){t=this.$wrapper.scrollTop();this._setScrollPosition(t?t:this._getSnappingHeight())}else{this._toggleHeaderVisibility(false);this._moveHeaderToTitleArea()}}this._updateToggleHeaderVisualIndicators();this._updateTitleVisualState()};T.prototype.exit=function(){this._detachResizeHandlers();if(this._oScrollHelper){this._oScrollHelper.destroy()}if(this._oStickyHeaderObserver){this._oStickyHeaderObserver.disconnect()}if(this._oHeaderObserver){this._oHeaderObserver.disconnect()}if(this._oTitleObserver){this._oTitleObserver.disconnect()}if(this._oStickySubheader){this._oStickySubheader.removeEventDelegate(this._oSubHeaderAfterRenderingDelegate)}this._destroyInvisibleText()};T.prototype.setShowFooter=function(e){var t=this.setProperty("showFooter",e,true);this._toggleFooter(e);return t};T.prototype.setHeader=function(e){var t=this.getHeader();if(e===t){return this}this._detachHeaderEventListeners();return this.setAggregation("header",e)};T.prototype.destroyHeader=function(){this._detachHeaderEventListeners();return this.destroyAggregation("header")};T.prototype.destroyFooter=function(){this._destroyInvisibleText();return this.destroyAggregation("footer")};T.prototype._detachHeaderEventListeners=function(){var e=this.getHeader();if(e){if(this._oStickyHeaderObserver){this._oStickyHeaderObserver.disconnect()}if(this._oHeaderObserver){this._oHeaderObserver.disconnect()}this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.HEADER);e.detachEvent(T.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress);this._bAlreadyAttachedPinPressHandler=false;e.detachEvent(T.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress);this._bAlreadyAttachedHeaderIndicatorPressHandler=false;e.detachEvent(T.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver);e.detachEvent(T.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=false;this._bAlreadyAttachedStickyHeaderObserver=false;this._bAlreadyAttachedHeaderObserver=false}};T.prototype.setStickySubheaderProvider=function(e){var t,i=this.getStickySubheaderProvider();if(e===i){return this}t=s.getElementById(i);if(this._oStickySubheader&&t){t._returnStickyContent();t._setStickySubheaderSticked(false);this._oStickySubheader.removeEventDelegate(this._oSubHeaderAfterRenderingDelegate);this._bAlreadyAddedStickySubheaderAfterRenderingDelegate=false;this._oStickySubheader=null}this.setAssociation("stickySubheaderProvider",e);return this};T.prototype.setHeaderExpanded=function(e){e=this.validateProperty("headerExpanded",e);if(this._bPinned){return this}if(this.getHeaderExpanded()===e){return this}if(this.getDomRef()){this._titleExpandCollapseWhenAllowed()}this.setProperty("headerExpanded",e,true);this._updatePinButtonState();return this};T.prototype.setToggleHeaderOnTitleClick=function(e){var t=this.getHeaderExpanded(),i=this.setProperty("toggleHeaderOnTitleClick",e,true);e=this.getProperty("toggleHeaderOnTitleClick");this._updateTitleVisualState();this._updateToggleHeaderVisualIndicators();this._updateARIAStates(t);return i};T.prototype.setFitContent=function(e){var t=this.setProperty("fitContent",e,true);if(P(this.$())){this._toggleScrollingStyles()}return t};T.prototype.getScrollDelegate=function(){return this._oScrollHelper};T.prototype._overridePreserveHeaderStateOnScroll=function(){if(this.$().width()===0||this.$().height()===0){return}var e=this._headerBiggerThanAllowedHeight,t;this._headerBiggerThanAllowedHeight=this._headerBiggerThanAllowedToBeFixed();t=e!==this._headerBiggerThanAllowedHeight;if(!this._headerBiggerThanAllowedHeight||!t){return}if(this.getHeaderExpanded()){this._moveHeaderToContentArea()}else{this._adjustSnap()}this._updateTitlePositioning()};T.prototype._toggleFooter=function(e){var t=this.getFooter(),i,a;if(!P(this.$())||!P(t)||!P(this.$footerWrapper)){return}a=r.getAnimationMode();i=a!==d.AnimationMode.none&&a!==d.AnimationMode.minimal;if(P(this.$contentFitContainer)){this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainerFooterVisible",e)}this.$().toggleClass("sapFDynamicPageFooterVisible",e);if(i){this._toggleFooterAnimation(e,t)}else{this.$footerWrapper.toggleClass("sapUiHidden",!e)}this._updateTitlePositioning()};T.prototype._toggleFooterAnimation=function(e,t){this.$footerWrapper.on("webkitAnimationEnd animationend",this._onToggleFooterAnimationEnd.bind(this,t));if(e){this.$footerWrapper.removeClass("sapUiHidden")}t.toggleStyleClass(T.SHOW_FOOTER_CLASS_NAME,e);t.toggleStyleClass(T.HIDE_FOOTER_CLASS_NAME,!e)};T.prototype._onToggleFooterAnimationEnd=function(e){this.$footerWrapper.off("webkitAnimationEnd animationend");if(e.hasStyleClass(T.HIDE_FOOTER_CLASS_NAME)){this.$footerWrapper.addClass("sapUiHidden");e.removeStyleClass(T.HIDE_FOOTER_CLASS_NAME)}else{e.removeStyleClass(T.SHOW_FOOTER_CLASS_NAME)}};T.prototype._toggleHeaderInTabChain=function(e){var t=this.getTitle(),i=this.getHeader();if(!P(t)||!P(i)){return}i.$().css("visibility",e?"visible":"hidden");i.$().css("height",e?"":this._getHeaderHeight()+"px");i.$().css("overflow",e?"":"hidden")};T.prototype._snapHeader=function(e,t){var i=this.getTitle();if(this._bPinned&&!t){H.debug("DynamicPage :: aborted snapping, header is pinned",this);return}H.debug("DynamicPage :: snapped header",this);if(this._bPinned&&t){this._unPin(t);this._togglePinButtonPressedState(false)}if(P(i)){i._toggleState(false,t);if(e&&this._bHeaderInTitleArea){this._moveHeaderToContentArea(true)}}if(!P(this.$titleArea)){H.warning("DynamicPage :: couldn't snap header. There's no title.",this);return}this.setProperty("headerExpanded",false,true);this._adjustStickyContent();if(this._hasVisibleTitleAndHeader()){this.$titleArea.addClass(_.system.phone&&i.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();this._togglePinButtonVisibility(false);this._updateTitlePositioning()}this._toggleHeaderInTabChain(false);this._updateARIAStates(false);this._toggleHeaderBackground(true)};T.prototype._expandHeader=function(e,t){var i=this.getTitle();H.debug("DynamicPage :: expand header",this);if(P(i)){i._toggleState(true,t);if(e){this._moveHeaderToTitleArea(true)}}if(!P(this.$titleArea)){H.warning("DynamicPage :: couldn't expand header. There's no title.",this);return}this.setProperty("headerExpanded",true,true);this._adjustStickyContent();if(this._hasVisibleTitleAndHeader()){this.$titleArea.removeClass(_.system.phone&&i.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();if(!this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedToPin()){this._togglePinButtonVisibility(true)}this._updateTitlePositioning()}this._toggleHeaderInTabChain(true);this._updateARIAStates(true);this._toggleHeaderBackground(false)};T.prototype._toggleHeaderVisibility=function(e,t){var i=this.getHeaderExpanded(),r=this.getTitle(),a=this.getHeader();if(this._bPinned&&!t){H.debug("DynamicPage :: header toggle aborted, header is pinned",this);return}if(P(r)){r._toggleState(i)}if(P(a)){a.$().toggleClass("sapFDynamicPageHeaderHidden",!e);this._updateTitlePositioning()}};T.prototype._toggleHeaderBackground=function(e){this.$headerInContentWrapper.toggleClass("sapFDynamicPageHeaderSolid",e)};T.prototype._moveHeaderToContentArea=function(e){var t=this.getHeader();if(P(t)){t.$().prependTo(this.$headerInContentWrapper);this._bHeaderInTitleArea=false;if(e){this._offsetContentOnMoveHeader()}this.fireEvent("_moveHeader")}};T.prototype._moveHeaderToTitleArea=function(e){var t=this.getHeader();if(P(t)){t.$().prependTo(this.$stickyPlaceholder);this._bHeaderInTitleArea=true;if(e){this._offsetContentOnMoveHeader()}this.fireEvent("_moveHeader")}};T.prototype._offsetContentOnMoveHeader=function(){var e=Math.ceil(this._getHeaderHeight()),t=this.$wrapper.scrollTop(),i;if(!e){return}i=this._bHeaderInTitleArea?t-e:t+e;i=Math.max(i,0);this._setScrollPosition(i,true)};T.prototype._isHeaderPinnable=function(){var e=this.getHeader();return e&&e.getPinnable()&&this.getHeaderExpanded()&&!this.getPreserveHeaderStateOnScroll()};T.prototype._updatePinButtonState=function(){var e=this.getHeaderPinned()&&this._isHeaderPinnable();this._togglePinButtonPressedState(e);if(e){this._pin()}else{this._unPin()}};T.prototype._pin=function(e){if(this._bPinned){return}this._bPinned=true;if(e){this.setProperty("headerPinned",true,true);this.fireEvent("pinnedStateChange",{pinned:true})}if(!this._bHeaderInTitleArea){this._moveHeaderToTitleArea(true);this._adjustStickyContent();this._updateTitlePositioning()}this._updateToggleHeaderVisualIndicators();this.addStyleClass("sapFDynamicPageHeaderPinned")};T.prototype._unPin=function(e){if(!this._bPinned){return}this._bPinned=false;if(e){this.setProperty("headerPinned",false,true);this.fireEvent("pinnedStateChange",{pinned:false})}this._updateToggleHeaderVisualIndicators();this.removeStyleClass("sapFDynamicPageHeaderPinned")};T.prototype._togglePinButtonVisibility=function(e){var t=this.getHeader();if(P(t)){t._setShowPinBtn(e)}};T.prototype._togglePinButtonPressedState=function(e){var t=this.getHeader();if(P(t)){t._togglePinButton(e)}};T.prototype._hidePinButtonIfNotApplicable=function(){if(this._preserveHeaderStateOnScroll()){this._togglePinButtonVisibility(false)}};T.prototype._isHeaderPinnable=function(){var e=this.getHeader();return e&&e.getPinnable()&&this.getHeaderExpanded()&&!this.getPreserveHeaderStateOnScroll()};T.prototype._restorePinButtonFocus=function(){this.getHeader()._focusPinButton()};T.prototype._getScrollPosition=function(){return P(this.$wrapper)?Math.ceil(this.$wrapper.scrollTop()):0};T.prototype._setAriaRoleDescription=function(e){this._sAriaRoleDescription=e;return this};T.prototype._getAriaRoleDescription=function(){return this._sAriaRoleDescription};T.prototype._setScrollPosition=function(e,t){if(!P(this.$wrapper)){return}if(this._getScrollPosition()===e){return}if(t){this._bSuppressToggleHeaderOnce=true}if(!this.getScrollDelegate()._$Container){this.getScrollDelegate()._$Container=this.$wrapper}this.getScrollDelegate().scrollTo(0,e)};T.prototype._shouldSnapOnScroll=function(){return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()>=this._getSnappingHeight()&&this.getHeaderExpanded()&&!this._bPinned};T.prototype._shouldExpandOnScroll=function(){var e=this._needsVerticalScrollBar(),t=this._getScrollPosition(),i=t===0||t<this._getSnappingHeight();return!this._preserveHeaderStateOnScroll()&&i&&!this.getHeaderExpanded()&&!this._bPinned&&e};T.prototype._shouldStickStickyContent=function(){return!this.getHeaderExpanded()||this._preserveHeaderStateOnScroll()||this._bHeaderInTitleArea};T.prototype._headerScrolledOut=function(){return this._getScrollPosition()>=this._getSnappingHeight()};T.prototype._headerSnapAllowed=function(){return!this._preserveHeaderStateOnScroll()&&this.getHeaderExpanded()&&!this._bPinned};T.prototype._canSnapHeaderOnScroll=function(){return this._getMaxScrollPosition()>this._getSnappingHeight()};T.prototype._getSnappingHeight=function(){var e=this.getTitle(),t=e&&e.$expandWrapper,i=e&&e.$snappedWrapper,r=e&&e.$expandHeadingWrapper,a=e&&e.$snappedHeadingWrapper,n=t&&t.length?t.height():0,s=a&&a.length?a.height():0,o=r&&r.length?r.height():0,l=i&&i.length?i.height():0,d=Math.ceil(this._getHeaderHeight()||n+l+s+o)-T.HEADER_CONTENT_PADDING_BOTTOM;return d>0?d:0};T.prototype._getMaxScrollPosition=function(){var e,t;if(P(this.$wrapper)){e=this.$wrapper[0];t=Math.max(e.clientHeight,Math.ceil(e.getBoundingClientRect().height));return e.scrollHeight-t}return 0};T.prototype._needsVerticalScrollBar=function(){return Math.floor(this._getMaxScrollPosition())>1};T.prototype._getOwnHeight=function(){return this._getHeight(this)};T.prototype._getEntireHeaderHeight=function(){var e=0,t=0,i=this.getTitle(),r=this.getHeader();if(P(i)){e=i.$().outerHeight()}if(P(r)){t=r.$().outerHeight()}return e+t};T.prototype._headerBiggerThanAllowedToPin=function(e){if(!(typeof e==="number"&&!isNaN(parseInt(e)))){e=this._getOwnHeight()}return this._getEntireHeaderHeight()>T.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE*e};T.prototype._headerBiggerThanAllowedToBeFixed=function(){var e=this._getOwnHeight();return this._getEntireHeaderHeight()>T.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE*e};T.prototype._headerBiggerThanAllowedToBeExpandedInTitleArea=function(){var e=this._getEntireHeaderHeight(),t=this._getOwnHeight();if(t===0){return false}return _.system.phone?e>=T.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE*t:e>=t};T.prototype._updateTitlePositioning=function(){if(!P(this.$wrapper)||!P(this.$titleArea)||this._getHeight(this)===0){return}var e=this._needsVerticalScrollBar(),i=this.$wrapper.get(0),r=this.$titleArea.get(0).getBoundingClientRect().height,a=this._getTitleAreaWidth(),n=c().width,s;i.style.paddingTop=r+"px";i.style.scrollPaddingTop=r+"px";this._oScrollHelper.setScrollPaddingTop(r);s="polygon(0px "+Math.floor(r)+"px, "+a+"px "+Math.floor(r)+"px, "+a+"px 0, 100% 0, 100% 100%, 0 100%)";if(t.getRTL()){s="polygon(0px 0px, "+n+"px 0px, "+n+"px "+r+"px, 100% "+r+"px, 100% 100%, 0 100%)"}i.style.clipPath=s;this.toggleStyleClass("sapFDynamicPageWithScroll",e);setTimeout(this._toggleScrollingStyles.bind(this),0)};T.prototype._toggleScrollingStyles=function(e){var t=typeof e!=="undefined"?!e:!this._needsVerticalScrollBar();this.toggleStyleClass("sapFDynamicPageWithScroll",!t);this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainer",t)};T.prototype._updateHeaderARIAState=function(e){var t=this.getHeader();if(P(t)){t._updateARIAState(e)}};T.prototype._updateTitleARIAState=function(e){var t=this.getTitle();if(P(t)){t._updateARIAState(e)}};T.prototype._updateARIAStates=function(e){this._updateHeaderARIAState(e);this._updateTitleARIAState(e)};T.prototype._initRangeSet=function(){if(!_.media.hasRangeSet(T.MEDIA_RANGESET_NAME)){_.media.initRangeSet(T.MEDIA_RANGESET_NAME,[T.BREAK_POINTS.PHONE,T.BREAK_POINTS.TABLET,T.BREAK_POINTS.DESKTOP],"px",["phone","tablet","desktop"])}};T.prototype._onMediaRangeChange=function(){var e=this._getMediaContainerWidth();this._updateMedia(e)};T.prototype._updateMedia=function(e){if(!e){return}if(e<=T.BREAK_POINTS.PHONE){this._updateMediaStyle(T.MEDIA.PHONE)}else if(e<=T.BREAK_POINTS.TABLET){this._updateMediaStyle(T.MEDIA.TABLET)}else if(e<=T.BREAK_POINTS.DESKTOP){this._updateMediaStyle(T.MEDIA.DESKTOP)}else{this._updateMediaStyle(T.MEDIA.DESKTOP_XL)}};T.prototype._updateMediaStyle=function(e){Object.keys(T.MEDIA).forEach(function(t){var i=e===T.MEDIA[t];this.toggleStyleClass(T.MEDIA[t],i)},this)};T.prototype._toggleExpandVisualIndicator=function(e){var t=this.getTitle();if(P(t)){t._toggleExpandButton(e)}};T.prototype._focusExpandVisualIndicator=function(){var e=this.getTitle();if(P(e)){e._focusExpandButton()}};T.prototype._toggleCollapseVisualIndicator=function(e){var t=this.getHeader();if(P(t)){t._toggleCollapseButton(e)}};T.prototype._focusCollapseVisualIndicator=function(){var e=this.getHeader();if(P(e)){e._focusCollapseButton()}};T.prototype._updateToggleHeaderVisualIndicators=function(){var e,t,i,r=this._hasVisibleTitleAndHeader(),a=this.getHeader(),n=false;if(P(a)){n=!!a.getContent().length}if(!this.getToggleHeaderOnTitleClick()||!r){t=false;i=false}else{e=this.getHeaderExpanded();t=e;i=_.system.phone&&this.getTitle().getAggregation("snappedTitleOnMobile")?false:!e}i=i&&n;t=t&&n;this._toggleCollapseVisualIndicator(t);this._toggleExpandVisualIndicator(i);this._updateTitleVisualState()};T.prototype._updateHeaderVisualState=function(e,t){var i=this.getHeader();if(e&&this.getPreserveHeaderStateOnScroll()){this._overridePreserveHeaderStateOnScroll()}if(!this._preserveHeaderStateOnScroll()&&i){if(this._headerBiggerThanAllowedToPin(t)||_.system.phone){this._unPin();this._togglePinButtonVisibility(false);this._togglePinButtonPressedState(false)}else{this._togglePinButtonVisibility(true);this._updatePinButtonState()}if(this.getHeaderExpanded()&&this._bHeaderInTitleArea&&this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._expandHeader(false);this._setScrollPosition(0)}}else if(this._preserveHeaderStateOnScroll()&&i){this._togglePinButtonVisibility(false)}};T.prototype._updateTitleVisualState=function(){var e=this.getTitle(),t=this._hasVisibleTitleAndHeader()&&this.getToggleHeaderOnTitleClick();this.$().toggleClass("sapFDynamicPageTitleClickEnabled",t&&!_.system.phone);if(P(e)){e._toggleFocusableState(t)}};T.prototype._scrollBellowCollapseVisualIndicator=function(){var e=this.getHeader(),t,i,r,a;if(P(e)){t=this.getHeader()._getCollapseButton().getDomRef();i=t.getBoundingClientRect().height;r=this.$wrapper[0].getBoundingClientRect().height;a=t.offsetTop+i-r+this._getTitleHeight();this._setScrollPosition(a)}};T.prototype._hasVisibleTitleAndHeader=function(){var e=this.getTitle();return P(e)&&e.getVisible()&&this._hasVisibleHeader()};T.prototype._hasVisibleHeader=function(){var e=this.getHeader();return P(e)&&e.getVisible()&&P(e.getContent())};T.prototype._getHeight=function(e){var t;if(!(e instanceof i)){return 0}t=e.getDomRef();return t?t.getBoundingClientRect().height:0};T.prototype._getWidth=function(e){return!(e instanceof i)?0:e.$().outerWidth()||0};T.prototype._getTitleAreaHeight=function(){return P(this.$titleArea)?this.$titleArea.outerHeight()||0:0};T.prototype._getTitleAreaWidth=function(){return P(this.$titleArea)?this.$titleArea.width()||0:0};T.prototype._getTitleHeight=function(){return this._getHeight(this.getTitle())};T.prototype._getHeaderHeight=function(){return this._getHeight(this.getHeader())};T.prototype._preserveHeaderStateOnScroll=function(){return this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedHeight};T.prototype._cacheDomElements=function(){var e=this.getFooter();if(P(e)){this.$footer=e.$();this.$footerWrapper=this.$("footerWrapper")}this.$wrapper=this.$("contentWrapper");this.$headerInContentWrapper=this.$("headerWrapper");this.$contentFitContainer=this.$("contentFitContainer");this.$titleArea=this.$("header");this.$stickyPlaceholder=this.$("stickyPlaceholder");this._cacheTitleDom();this._cacheHeaderDom()};T.prototype._cacheTitleDom=function(){var e=this.getTitle();if(P(e)){this.$title=e.$()}};T.prototype._cacheHeaderDom=function(){var e=this.getHeader();if(P(e)){this.$header=e.$()}};T.prototype._adjustSnap=function(){var e,t,i,r,a,n,s=this.$();if(!P(s)){return}if(!v(s[0])){return}e=this.getHeader();t=!this.getHeaderExpanded();if(!e||!t){return}i=!this._preserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();r=t&&e.$().hasClass("sapFDynamicPageHeaderHidden");if(i&&r){this._toggleHeaderVisibility(true);this._moveHeaderToContentArea(true);return}if(!i&&!r){this._moveHeaderToTitleArea(true);this._toggleHeaderVisibility(false);return}if(i){a=this._getScrollPosition();n=this._getSnappingHeight();if(a<n){this._setScrollPosition(n)}}};T.prototype.ontouchmove=function(e){e.setMarked()};T.prototype._onChildControlAfterRendering=function(e){var t=e.srcControl;if(t instanceof u){this._cacheTitleDom();this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.TITLE);this._registerResizeHandler(T.RESIZE_HANDLER_ID.TITLE,this.$title[0],this._onChildControlsHeightChange.bind(this))}else if(t instanceof f&&t.getDomRef()!==this.$header.get(0)){this._cacheHeaderDom();this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.HEADER);this._registerResizeHandler(T.RESIZE_HANDLER_ID.HEADER,this.$header[0],this._onChildControlsHeightChange.bind(this))}setTimeout(this._updateTitlePositioning.bind(this),0)};T.prototype._onChildControlsHeightChange=function(e){var t=this._needsVerticalScrollBar(),i=this.getHeader(),r,a;if(t){this._toggleScrollingStyles(t)}this._adjustSnap();if(!this._bExpandingWithAClick){this._updateTitlePositioning()}this._bExpandingWithAClick=false;if(i&&e.target.id===i.getId()){r=e.size.height;a=e.oldSize.height;this._updateHeaderVisualState(r!==a);this._adaptScrollPositionOnHeaderChange(r,a)}};T.prototype._onResize=function(e){var t=this.getTitle(),i=e.size.width,r=e.size.height,a=r!==e.oldSize.height;this._updateHeaderVisualState(a,r);if(P(t)){t._onResize(i)}this._adjustSnap();this._updateTitlePositioning();this._updateMedia(i)};T.prototype._toggleHeaderOnScroll=function(){if(this._bSuppressToggleHeaderOnce){this._bSuppressToggleHeaderOnce=false;return}if(_.system.desktop&&this._bExpandingWithAClick){return}if(this._preserveHeaderStateOnScroll()){return}if(this._shouldSnapOnScroll()){this._snapHeader(true,true)}else if(this._shouldExpandOnScroll()){this._expandHeader(false,true);this._toggleHeaderVisibility(true)}else if(!this._bPinned&&this._bHeaderInTitleArea){var e=this._getScrollPosition()>=this._getSnappingHeight();this._moveHeaderToContentArea(e);this._adjustStickyContent();this._updateTitlePositioning()}};T.prototype._adjustStickyContent=function(){if(!this._oStickySubheader){return}var e,t=this._shouldStickStickyContent(),i,r=this.getStickySubheaderProvider();if(t===this._bStickySubheaderInTitleArea){return}i=s.getElementById(r);if(!P(i)){return}e=document.activeElement;i._setStickySubheaderSticked(t);if(t){this._oStickySubheader.$().appendTo(this.$stickyPlaceholder)}else{i._returnStickyContent()}e.focus();this._bStickySubheaderInTitleArea=t};T.prototype._adaptScrollPositionOnHeaderChange=function(e,t){var i=e-t,r=this.getHeader();if(i&&(!this.getHeaderExpanded()&&r.$().css("visibility")!=="hidden")&&!this._bHeaderInTitleArea&&this._needsVerticalScrollBar()){this._setScrollPosition(this._getScrollPosition()+i)}};T.prototype._onTitlePress=function(){if(this.getToggleHeaderOnTitleClick()&&this._hasVisibleTitleAndHeader()){if(!this.getHeaderExpanded()&&this._headerBiggerThanAllowedToBeExpandedInTitleArea()&&!this._preserveHeaderStateOnScroll()){this._moveHeaderToContentArea(true)}this._titleExpandCollapseWhenAllowed(true);this.getTitle()._focus()}};T.prototype._onExpandHeaderVisualIndicatorPress=function(){this._onTitlePress();if(this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._scrollBellowCollapseVisualIndicator()}this._focusCollapseVisualIndicator()};T.prototype._onCollapseHeaderVisualIndicatorPress=function(){this._onTitlePress();this._focusExpandVisualIndicator()};T.prototype._onVisualIndicatorMouseOver=function(){var e=this.$();if(P(e)){e.addClass("sapFDynamicPageTitleForceHovered")}};T.prototype._onVisualIndicatorMouseOut=function(){var e=this.$();if(P(e)){e.removeClass("sapFDynamicPageTitleForceHovered")}};T.prototype._onTitleMouseOver=T.prototype._onVisualIndicatorMouseOver;T.prototype._onTitleMouseOut=T.prototype._onVisualIndicatorMouseOut;T.prototype._titleExpandCollapseWhenAllowed=function(e){var t,i;if(this._bPinned&&!e){return this}if(this._preserveHeaderStateOnScroll()||!this._canSnapHeaderOnScroll()||!this.getHeader()){if(!this.getHeaderExpanded()){this._expandHeader(false,e);this._toggleHeaderVisibility(true,e)}else{this._snapHeader(false,e);this._toggleHeaderVisibility(false,e)}}else if(!this.getHeaderExpanded()){t=!this._headerBiggerThanAllowedToBeExpandedInTitleArea();this._bExpandingWithAClick=true;this._expandHeader(t,e);this.getHeader().$().removeClass("sapFDynamicPageHeaderHidden");if(!t){this._setScrollPosition(0)}this._bExpandingWithAClick=false}else{var r=this._bHeaderInTitleArea;this._snapHeader(r,e);if(!r){i=this._getSnappingHeight();this._setScrollPosition(i?i+T.HEADER_CONTENT_PADDING_BOTTOM:0)}}};T.prototype._onPinUnpinButtonPress=function(){if(this._bPinned){this._unPin(true)}else{this._pin(true);this._restorePinButtonFocus()}};T.prototype._attachResizeHandlers=function(){var e=this._onChildControlsHeightChange.bind(this);this._registerResizeHandler(T.RESIZE_HANDLER_ID.PAGE,this,this._onResize.bind(this));if(P(this.$title)){this._registerResizeHandler(T.RESIZE_HANDLER_ID.TITLE,this.$title[0],e)}if(P(this.$header)){this._registerResizeHandler(T.RESIZE_HANDLER_ID.HEADER,this.$header[0],e)}if(P(this.$contentFitContainer)){this._registerResizeHandler(T.RESIZE_HANDLER_ID.CONTENT,this.$contentFitContainer[0],e)}};T.prototype._registerResizeHandler=function(e,t,i){if(!this[e]){this[e]=l.register(t,i)}};T.prototype._detachResizeHandlers=function(){this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.PAGE);this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.TITLE);this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.HEADER);this._deRegisterResizeHandler(T.RESIZE_HANDLER_ID.CONTENT)};T.prototype._deRegisterResizeHandler=function(e){if(this[e]){l.deregister(this[e]);this[e]=null}};T.prototype._attachPageChildrenAfterRenderingDelegates=function(){var e=this.getTitle(),t=this.getHeader(),i=this.getContent(),r=this._onChildControlAfterRendering.bind(this),a={onAfterRendering:r};if(P(e)){e.addEventDelegate(a)}if(P(i)){i.addEventDelegate(a)}if(P(t)){t.addEventDelegate(a)}};T.prototype._attachTitlePressHandler=function(){var e=this.getTitle();if(P(e)&&!this._bAlreadyAttachedTitlePressHandler){e.attachEvent(T.EVENTS.TITLE_PRESS,this._onTitlePress,this);this._bAlreadyAttachedTitlePressHandler=true}};T.prototype._attachPinPressHandler=function(){var e=this.getHeader();if(P(e)&&!this._bAlreadyAttachedPinPressHandler){e.attachEvent(T.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress,this);this._bAlreadyAttachedPinPressHandler=true}};T.prototype._attachStickyHeaderObserver=function(){var e=this.getHeader();if(P(e)&&!this._bAlreadyAttachedStickyHeaderObserver){if(!this._oStickyHeaderObserver){this._oStickyHeaderObserver=new n(this._onHeaderPropertyChange.bind(this))}this._oStickyHeaderObserver.observe(e,{properties:["visible"]});this._bAlreadyAttachedStickyHeaderObserver=true}};T.prototype._onHeaderPropertyChange=function(e){var t=this.getHeader();this._adjustStickyContent();if(t&&e.name==="visible"&&e.current===false){t.invalidate();this._updateTitlePositioning()}};T.prototype._attachHeaderObserver=function(){var e=this.getHeader();if(P(e)&&!this._bAlreadyAttachedHeaderObserver){if(!this._oHeaderObserver){this._oHeaderObserver=new n(this._onHeaderFieldChange.bind(this))}this._oHeaderObserver.observe(e,{aggregations:["content"],properties:["visible","pinnable"]});this._bAlreadyAttachedHeaderObserver=true}};T.prototype._attachTitleObserver=function(){var e=this.getTitle();if(P(e)&&!this._bAlreadyAttachedTitleObserver){if(!this._oTitleObserver){this._oTitleObserver=new n(this._onTitleFieldChange.bind(this))}this._oTitleObserver.observe(e,{properties:["visible"]});this._bAlreadyAttachedTitleObserver=true}};T.prototype._onHeaderFieldChange=function(e){if(e.type==="property"&&e.name==="pinnable"){this._updatePinButtonState();return}this._updateToggleHeaderVisualIndicators()};T.prototype._onTitleFieldChange=function(e){if(e.type==="property"&&e.name==="visible"){this.invalidate();return}};T.prototype._attachVisualIndicatorsPressHandlers=function(){var e=this.getTitle(),t=this.getHeader();if(P(e)&&!this._bAlreadyAttachedTitleIndicatorPressHandler){e.attachEvent(T.EVENTS.TITLE_VISUAL_INDICATOR_PRESS,this._onExpandHeaderVisualIndicatorPress,this);this._bAlreadyAttachedTitleIndicatorPressHandler=true}if(P(t)&&!this._bAlreadyAttachedHeaderIndicatorPressHandler){t.attachEvent(T.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress,this);this._bAlreadyAttachedHeaderIndicatorPressHandler=true}};T.prototype._addStickySubheaderAfterRenderingDelegate=function(){var e,t=this.getStickySubheaderProvider(),i;e=s.getElementById(t);if(P(e)&&!this._bAlreadyAddedStickySubheaderAfterRenderingDelegate){i=e.getMetadata().getInterfaces().indexOf("sap.f.IDynamicPageStickyContent")!==-1;if(i){this._oStickySubheader=e._getStickyContent();this._oStickySubheader.addEventDelegate(this._oSubHeaderAfterRenderingDelegate,this);this._bAlreadyAddedStickySubheaderAfterRenderingDelegate=true;this._attachStickyHeaderObserver()}}};T.prototype._attachVisualIndicatorMouseOverHandlers=function(){var e=this.getHeader();if(P(e)&&!this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler){e.attachEvent(T.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver,this);e.attachEvent(T.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut,this);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=true}};T.prototype._attachTitleMouseOverHandlers=function(){var e=this.getTitle();if(P(e)&&!this._bAlreadyAttachedTitleMouseOverOutHandler){e.attachEvent(T.EVENTS.TITLE_MOUSE_OVER,this._onTitleMouseOver,this);e.attachEvent(T.EVENTS.TITLE_MOUSE_OUT,this._onTitleMouseOut,this);this._bAlreadyAttachedTitleMouseOverOutHandler=true}};T.prototype._attachScrollHandler=function(){this._toggleHeaderOnScrollReference=this._toggleHeaderOnScroll.bind(this);this.$wrapper.on("scroll",this._toggleHeaderOnScrollReference)};T.prototype._toggleAdditionalNavigationClass=function(){var e=this._bStickySubheaderProviderExists();this.toggleStyleClass(T.NAVIGATION_CLASS_NAME,e)};T.prototype._bStickySubheaderProviderExists=function(){var e=s.getElementById(this.getStickySubheaderProvider());return!!e&&e.isA("sap.f.IDynamicPageStickyContent")};T.prototype._detachScrollHandler=function(){if(this.$wrapper){this.$wrapper.off("scroll",this._toggleHeaderOnScrollReference)}};T.prototype._formatLandmarkInfo=function(e,t){if(e){var i=e["get"+t+"Role"]()||"",r=e["get"+t+"Label"]()||"";if(i===b.None){i=""}return{role:i.toLowerCase(),label:r}}return{}};T.prototype._getHeaderTag=function(e){if(e&&e.getHeaderRole()!==b.None){return T.DIV}return T.HEADER};T.prototype._getFooterTag=function(e){if(e&&e.getFooterRole()!==b.None){return T.DIV}return T.FOOTER};T.prototype._setFooterAriaLabelledBy=function(){var e=this.getFooter();if(e&&!e.getAriaLabelledBy().length){this._oInvisibleText=new h({id:e.getId()+"-FooterActions-InvisibleText",text:o.getResourceBundleFor("sap.f").getText(T.ARIA_LABEL_TOOLBAR_FOOTER_ACTIONS)}).toStatic();e.addAriaLabelledBy(this._oInvisibleText)}};T.prototype._destroyInvisibleText=function(){if(this._oInvisibleText){this._oInvisibleText.destroy();this._oInvisibleText=null}};return T});
//# sourceMappingURL=DynamicPage.js.map