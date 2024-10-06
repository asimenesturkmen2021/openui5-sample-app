/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/ControlBehavior","sap/ui/core/Lib","sap/ui/core/Renderer","sap/ui/core/library","sap/ui/Device","sap/base/Log","./library","./ListItemBaseRenderer"],function(e,t,l,n,a,i,s,r){"use strict";var o=s.PopinDisplay;var d=n.VerticalAlign;var p=l.extend(r);p.apiVersion=2;p.render=function(e,t){var l=t.getTable();if(!l){return}r.render.apply(this,arguments);if(t.getVisible()&&l.hasPopin()){this.renderPopin(e,t,l)}};p.makeFocusable=function(e){if(a.system.desktop){e.attr("tabindex","-1");e.class("sapMTblCellFocusable")}};p.openStartGridCell=function(e,t,l,n,a){e.openStart(l,n);e.class(a);e.attr("role","gridcell");e.attr("aria-colindex",t.aAriaOwns.push(n));this.makeFocusable(e);if(t.isSelectable()){e.attr("aria-selected",t.getSelected())}return e};p.renderHighlight=function(e,t){e.openStart("td");e.class("sapMListTblHighlightCell");e.attr("role","presentation");e.openEnd();r.renderHighlight.apply(this,arguments);e.close("td")};p.renderNavigated=function(e,t){e.openStart("td");e.class("sapMListTblNavigatedCell");e.attr("role","presentation");e.openEnd();r.renderNavigated.apply(this,arguments);e.close("td")};p.renderType=function(e,t){var l=t.getTable();if(!l||!l.doItemsNeedTypeColumn()){return}this.openStartGridCell(e,t,"td",t.getId()+"-TypeCell","sapMListTblNavCol").openEnd();r.renderType.apply(this,arguments);e.close("td")};p.renderModeContent=function(e,t){this.openStartGridCell(e,t,"td",t.getId()+"-ModeCell","sapMListTblSelCol").openEnd();r.renderModeContent.apply(this,arguments);e.close("td")};p.renderCounter=function(e,t){};p.getAriaRole=function(e){return"row"};p.getAccessbilityPosition=function(e){var t=e.getTable();if(t){var l=t.getVisibleItems().indexOf(e)+t.hasHeaderRow()+1;return{rowindex:l}}};p.renderLIAttributes=function(e,t){e.class("sapMListTblRow");var l=t.getVAlign();if(l!=d.Inherit){e.class("sapMListTblRow"+l)}var n=t.getTable();if(n){if(n.getAlternateRowColors()){e.class("sapMListTblRowAlternate")}}};p.renderLIContentWrapper=function(t,l){var n=l.getTable();if(!n){return}var a=n.getColumns(true),s=l.getCells();l._destroyClonedHeaders();a.forEach(function(a,r){if(!a.getVisible()||a.isHidden()){return}var o=a.getStyleClass().split(" ").filter(Boolean),p=l.getId()+"-cell"+r,u=s[a.getInitialOrder()],c=a.getVAlign(),g=true;this.openStartGridCell(t,l,"td",p,"sapMListTblCell");t.attr("data-sap-ui-column",a.getId());t.style("text-align",a.getCssAlign());o.forEach(function(e){t.class(e)});if(c!=d.Inherit){t.style("vertical-align",c.toLowerCase())}if(u&&!n.hasPopin()&&a.getMergeDuplicates()){var b=a.getMergeFunctionName(),f=b.split("#"),C=f[1],y=f[0];if(typeof u[y]!="function"){i.warning("mergeFunctionName property is defined on "+a+" but this is not function of "+u)}else if(n._bRendering||!u.bOutput){var h=a.getLastValue(),L=u[y](C);if(h===L){g=e.isAccessibilityEnabled();u.addStyleClass("sapMListTblCellDupCnt");t.class("sapMListTblCellDup")}else{a.setLastValue(L)}}else if(u.hasStyleClass("sapMListTblCellDupCnt")){t.class("sapMListTblCellDup")}}t.openEnd();if(u&&g){this.applyAriaLabelledBy(a.getHeader(),u);if(!u.getFieldHelpDisplay()){u.setFieldHelpDisplay(a)}t.renderControl(u)}t.close("td")},this)};p.renderDummyCell=function(e,t){e.openStart("td");e.class("sapMListTblDummyCell");e.attr("role","presentation");e.openEnd();e.close("td")};p.applyAriaLabelledBy=function(e,t){if(!e||!e.getText||!e.getVisible()||!t.getAriaLabelledBy){return}if(!t.getAriaLabelledBy().includes(e.getId())){t.addAriaLabelledBy(e)}};p.renderPopin=function(e,l,n){e.openStart("tr",l.getPopin());e.class("sapMListTblSubRow");e.attr("role","none");e.attr("tabindex","-1");e.attr("data-sap-ui-related",l.getId());e.openEnd();this.renderHighlight(e,l);e.openStart("td",l.getId()+"-subcell");e.class("sapMListTblSubRowCell");e.attr("role","none");e.attr("colspan",n.getColCount()-2);e.openEnd();this.openStartGridCell(e,l,"div",l.getId()+"-subcont","sapMListTblSubCnt");e.class("sapMListTblSubCnt"+n.getPopinLayout());e.openEnd();var a=l.getCells(),i=n.getColumns(true);i.forEach(function(i){if(!i.getVisible()||!i.isPopin()){return}var s=a[i.getInitialOrder()];var r=i.getHeader();if(!r&&!s){return}var d=i.getStyleClass().split(" ").filter(Boolean),p=i.getPopinDisplay(),u=r;e.openStart("div");e.class("sapMListTblSubCntRow");if(p==o.Inline){e.class("sapMListTblSubCntRowInline")}d.forEach(function(t){e.class(t)});e.openEnd();if(r&&p!=o.WithoutHeader){e.openStart("div").class("sapMListTblSubCntHdr").openEnd();if(n._aPopinHeaders.indexOf(r)===-1){n._aPopinHeaders.push(u)}r=r.clone();i.addDependent(r);l._addClonedHeader(r);e.renderControl(r);e.openStart("span").class("sapMListTblSubCntSpr");e.attr("data-popin-colon",t.getResourceBundleFor("sap.m").getText("TABLE_POPIN_LABEL_COLON"));e.openEnd().close("span");e.close("div")}if(s){e.openStart("div");e.class("sapMListTblSubCntVal");e.class("sapMListTblSubCntVal"+p);e.openEnd();this.applyAriaLabelledBy(u,s);if(s.getFieldHelpDisplay()===i.getId()){s.setFieldHelpDisplay()}e.renderControl(s);e.close("div")}e.close("div")},this);e.close("div");e.close("td");this.renderNavigated(e,l);e.close("tr")};p.addLegacyOutlineClass=function(e,t){var l=t.getTable();if(l){if(l.hasPopin()||l.shouldRenderDummyColumn()){e.class("sapMTableRowCustomFocus")}}};p.renderContentLatter=function(e,t){var l=t.getTable();if(l&&l.shouldRenderDummyColumn()){if(!l.hasPopin()){r.renderContentLatter.apply(this,arguments);p.renderDummyCell(e,l)}else{p.renderDummyCell(e,l);r.renderContentLatter.apply(this,arguments)}}else{r.renderContentLatter.apply(this,arguments)}};return p},true);
//# sourceMappingURL=ColumnListItemRenderer.js.map