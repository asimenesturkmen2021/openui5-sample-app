/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/Device","sap/ui/core/delegate/ItemNavigation","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/DateRange","sap/ui/unified/library","sap/ui/core/format/DateFormat","sap/ui/core/library","sap/ui/core/Locale","sap/ui/core/LocaleData","./YearPickerRenderer","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/ui/core/Configuration"],function(e,t,a,r,i,s,o,n,l,h,d,p,g,jQuery,y){"use strict";var c=l.CalendarType;var u=e.extend("sap.ui.unified.calendar.YearPicker",{metadata:{library:"sap.ui.unified",properties:{year:{type:"int",group:"Data",defaultValue:2e3,deprecated:true},years:{type:"int",group:"Appearance",defaultValue:20},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},columns:{type:"int",group:"Appearance",defaultValue:4},date:{type:"object",group:"Data"},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},_middleDate:{type:"object",group:"Data",visibility:"hidden"}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"}},events:{select:{},pageChange:{}}},renderer:p});u.prototype.init=function(){this._oFormatYyyymmdd=n.getInstance({pattern:"yyyyMMdd",calendarType:c.Gregorian});this._oMinDate=r._minDate(this._getPrimaryCalendarType());this._oMaxDate=r._maxDate(this._getPrimaryCalendarType())};u.prototype.onBeforeRendering=function(){this._oYearFormat=n.getDateInstance({format:"y",calendarType:this._getPrimaryCalendarType()})};u.prototype.onAfterRendering=function(){m.call(this);this.focus()};u.prototype.exit=function(){if(this._aMPSelectedDates&&this._aMPSelectedDates.length){this._aMPSelectedDates.forEach(function(e){e.destroy()});this._aMPSelectedDates=undefined}};u.prototype.getFocusDomRef=function(){return this.getDomRef()&&this._oItemNavigation.getItemDomRefs()[this._iSelectedIndex]};u.prototype.setYear=function(e){this.setProperty("year",e);e=this.getProperty("year");var t=new i(e,0,1,this._getPrimaryCalendarType()),a=this._getSelectedDates()[0],r=this.getAggregation("selectedDates");if(!a||this.getIntervalSelection()){return this}if(!this._oSelectedDatesControlOrigin){if(!r||!r.length){this.addAggregation("selectedDates",a)}!this.getIntervalSelection()&&a.setStartDate(t.toLocalJSDate())}this.setDate(t.toLocalJSDate());return this};u.prototype.setDate=function(e){var t=r._maxDate(this.getProperty("primaryCalendarType")).getYear(),a,s,o,n;e&&r._checkJSDateObject(e);s=e.getFullYear();r._checkYearInValidRange(s);a=i.fromLocalJSDate(e,this._getPrimaryCalendarType());a.setMonth(0,1);this.setProperty("date",e);this.setProperty("year",a.getYear());this._oDate=a;o=this.getYears();n=Math.floor(o/2);if(e.getFullYear()<n){this._iSelectedIndex=e.getFullYear()-1}else if(e.getFullYear()>t-n){this._iSelectedIndex=t+o-e.getFullYear()-1}else{this._iSelectedIndex=n}this.setProperty("_middleDate",a);return this};u.prototype._getDate=function(){if(!this._oDate){var e=this.getYear();this._oDate=new i(e,0,1,this._getPrimaryCalendarType())}return this._oDate};u.prototype._getPrimaryCalendarType=function(){return this.getProperty("primaryCalendarType")||y.getCalendarType()};u.prototype._setSelectedDatesControlOrigin=function(e){this._oSelectedDatesControlOrigin=e};u.prototype.getSelectedDates=function(){if(this._oSelectedDatesControlOrigin){return this._oSelectedDatesControlOrigin.getSelectedDates()}return this.getAggregation("selectedDates")};u.prototype._getSelectedDates=function(){var e=this.getSelectedDates();if(e){return e}else if(!this._aMPSelectedDates||!this._aMPSelectedDates.length){this._aMPSelectedDates=[new s];this._aMPSelectedDates[0].setStartDate(this._getDate().toLocalJSDate());return this._aMPSelectedDates}else{return this._aMPSelectedDates}};u.prototype.setPrimaryCalendarType=function(e){this.setProperty("primaryCalendarType",e);this._oYearFormat=n.getDateInstance({format:"y",calendarType:e});if(this._oDate){this._oDate=new i(this._oDate,e);this._oDate.setMonth(0,1)}this._oMinDate=new i(this._oMinDate,e);this._oMaxDate=new i(this._oMaxDate,e);if(this._getSecondaryCalendarType()){this.setColumns(2);this.setYears(8)}return this};u.prototype.nextPage=function(){this._updatePage(true,this._oItemNavigation.getFocusedIndex());return this};u.prototype.previousPage=function(){this._updatePage(false,this._oItemNavigation.getFocusedIndex());return this};u.prototype.onsapspace=function(e){e.preventDefault()};u.prototype.onsapselect=function(e){var t=this._oItemNavigation.getFocusedIndex();var a=this._selectYear(t);if(a){this.fireSelect()}};u.prototype.onmouseover=function(e){var t=e.target,a=this._getSelectedDates()[0],r,s,o;if(!a){return}if(a.getStartDate()){r=i.fromLocalJSDate(a.getStartDate(),this._getPrimaryCalendarType());r.setMonth(0,1)}if(t.classList.contains("sapUiCalItem")){o=t.getAttribute("data-sap-year-start");s=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(o),this._getPrimaryCalendarType());if(this._isSelectionInProgress()){this._markInterval(r,s)}}};u.prototype.onmousedown=function(e){this._oMousedownPosition={clientX:e.clientX,clientY:e.clientY}};u.prototype.onmouseup=function(e){var a=e.target,r=this._getSelectedDates()[0],s,o,n,l,h=this._oItemNavigation.getItemDomRefs();if(this._bMousedownChange){this._bMousedownChange=false;if(this.getIntervalSelection()&&a.classList.contains("sapUiCalItem")&&r){o=a.getAttribute("data-sap-year-start");l=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(o),this._getPrimaryCalendarType());n=i.fromLocalJSDate(r.getStartDate(),this._getPrimaryCalendarType());n.setMonth(0,1);if(!l.isSame(n)&&!r.getEndDate()){s=h.index(a);this._selectYear.call(this,s);this._oItemNavigation.focusItem(s)}}this.fireSelect()}else if(t.support.touch&&this._isValueInThreshold(this._oMousedownPosition.clientX,e.clientX,10)&&this._isValueInThreshold(this._oMousedownPosition.clientY,e.clientY,10)){s=this._oItemNavigation.getFocusedIndex();if(!h[s].classList.contains("sapUiCalItemDsbl")){this._selectYear(s);this.fireSelect()}}};u.prototype._markInterval=function(e,t){var a=this._oItemNavigation.getItemDomRefs(),s,o,n;if(e.isAfter(t)){t=[e,e=t][0]}for(n=0;n<a.length;++n){o=a[n].getAttribute("data-sap-year-start");s=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(o),this._getPrimaryCalendarType());if(this._bMousedownChange){if((s.isSame(e)||s.isSame(t))&&!r._isOutside(s,this._oMinDate,this._oMaxDate)){jQuery(a[n]).addClass("sapUiCalItemSel")}else{jQuery(a[n]).removeClass("sapUiCalItemSel")}}if(r._isBetween(s,e,t)&&r._isBetween(s,this._oMinDate,this._oMaxDate)){jQuery(a[n]).addClass("sapUiCalItemSelBetween")}else{jQuery(a[n]).removeClass("sapUiCalItemSelBetween")}}};u.prototype.getFirstRenderedDate=function(){var e;if(this.getDomRef()){var t=this._oItemNavigation.getItemDomRefs();e=this._oFormatYyyymmdd.parse(jQuery(t[0]).attr("data-sap-year-start"))}return e};u.prototype._isValueInThreshold=function(e,t,a){var r=e-a,i=e+a;return t>=r&&t<=i};u.prototype.setSecondaryCalendarType=function(e){this.setProperty("secondaryCalendarType",e);if(this._getSecondaryCalendarType()){this.setColumns(2);this.setYears(8)}return this};u.prototype._getSecondaryCalendarType=function(){var e=this.getSecondaryCalendarType();if(e===this._getPrimaryCalendarType()){return undefined}return e};u.prototype._getDisplayedSecondaryDates=function(e){var t=this.getSecondaryCalendarType(),a=new i(e,e.getCalendarType()),r=new i(e,e.getCalendarType());a.setMonth(0,1);a=new i(a,t);r.setYear(r.getYear()+1);r.setMonth(0,1);r.setDate(r.getDate()-1);r=new i(r,t);return{start:a,end:r}};u.prototype._getLocale=function(){var e=this._oSelectedDatesControlOrigin;if(e&&e._getLocale){return e._getLocale()}else if(!this._sLocale){this._sLocale=y.getFormatSettings().getFormatLocale().toString()}return this._sLocale};u.prototype._getLocaleData=function(){var e=this._oSelectedDatesControlOrigin;if(e&&e._getLocaleData){return e._getLocaleData()}else if(!this._oLocaleData){var t=this._getLocale();var a=new h(t);this._oLocaleData=d.getInstance(a)}return this._oLocaleData};u.prototype._checkFirstDate=function(e){var t=this.getYears(),a=new i(this._oMaxDate,this._getPrimaryCalendarType());if(!a.isSame(r._maxDate(this._getPrimaryCalendarType()))){return e}a.setYear(a.getYear()-t+1);if(e.isAfter(a)&&e.getYear()!=a.getYear()){e=new i(a,this._getPrimaryCalendarType());e.setMonth(0,1)}else if(e.isBefore(this._oMinDate)&&e.getYear()!=this._oMinDate.getYear()){e=new i(this._oMinDate,this._getPrimaryCalendarType());e.setMonth(0,1)}return e};u.prototype._checkDateEnabled=function(e){var t=true;if(e.isAfter(this._oMaxDate)&&e.getYear()!=this._oMaxDate.getYear()||e.isBefore(this._oMinDate)&&e.getYear()!=this._oMinDate.getYear()){t=false}return t};u.prototype._updatePage=function(e,t,a){var r=this._oItemNavigation.getItemDomRefs();var s=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(jQuery(r[0]).attr("data-sap-year-start")),this._getPrimaryCalendarType());var o=this.getYears();if(e){var n=new i(this._oMaxDate,this._getPrimaryCalendarType());n.setYear(n.getYear()-o+1);if(s.isBefore(n)){s.setYear(s.getYear()+o);if(s.isAfter(n)){t=t+(s.getYear()-n.getYear());if(t>o-1){t=o-1}s=new i(this._oMaxDate,this._getPrimaryCalendarType());this._oDate.setMonth(0,1)}}else{return}}else{if(s.isAfter(this._oMinDate)){s.setYear(s.getYear()-o);if(s.isBefore(this._oMinDate)){t=t-(this._oMinDate.getYear()-s.getYear());if(t<0){t=0}s=new i(this._oMinDate,this._getPrimaryCalendarType())}}else{return}}s.setYear(s.getYear()+Math.floor(o/2));this._iSelectedIndex=t;this.setProperty("_middleDate",s);if(a){this.firePageChange()}};u.prototype._selectYear=function(e){var t=this._oItemNavigation.getItemDomRefs(),a=jQuery(t[e]),r=a.attr("data-sap-year-start"),s=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(r),this._getPrimaryCalendarType()),o=this._getSelectedDates()[0],n=this.getAggregation("selectedDates"),l;if(a.hasClass("sapUiCalItemDsbl")){return false}if(!this._isSelectionInProgress()){var h=true}this.setProperty("year",s.getYear(),h);this.setProperty("date",s.toLocalJSDate(),h);if(!o){return true}if(!this._oSelectedDatesControlOrigin){if(!n||!n.length){this.addAggregation("selectedDates",o)}!this.getIntervalSelection()&&o.setStartDate(s.toLocalJSDate(),h)}if(this.getIntervalSelection()){if(!o.getStartDate()){o.setStartDate(s.toLocalJSDate(),h)}else if(!o.getEndDate()){l=i.fromLocalJSDate(o.getStartDate(),this._getPrimaryCalendarType());if(s.isBefore(l)){o.setEndDate(l.toLocalJSDate(),h);o.setStartDate(s.toLocalJSDate(),h)}else{o.setEndDate(s.toLocalJSDate(),h)}}else{o.setStartDate(s.toLocalJSDate(),h);o.setEndDate(undefined,h)}}if(h){for(var d=0;d<t.length;d++){a=jQuery(t[d]);r=a.attr("data-sap-year-start");var p=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(r),this._getPrimaryCalendarType());var g=this._fnShouldApplySelection(p);var y=this._fnShouldApplySelectionBetween(p);if(g){a.addClass("sapUiCalItemSel");a.removeClass("sapUiCalItemSelBetween");a.attr("aria-selected","true")}if(y){a.addClass("sapUiCalItemSelBetween");a.attr("aria-selected","true")}if(!g&&!y){a.removeClass("sapUiCalItemSel");a.removeClass("sapUiCalItemSelBetween");a.attr("aria-selected","false")}}}return true};u.prototype._isSelectionInProgress=function(){var e=this._getSelectedDates()[0];if(!e){return false}return this.getIntervalSelection()&&e.getStartDate()&&!e.getEndDate()};function m(){var e=this.getDate()?i.fromLocalJSDate(this.getDate(),this._getPrimaryCalendarType()):this._getDate(),t=this.getDomRef(),s=this.$().find(".sapUiCalItem"),o,n,l,h;for(h=0;h<s.length;++h){n=s[h].getAttribute("data-sap-year-start");l=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(n),this._getPrimaryCalendarType());if(l.isSame(e)){o=h;break}}if(!this._oItemNavigation){this._oItemNavigation=new a;this._oItemNavigation.attachEvent(a.Events.AfterFocus,f,this);this._oItemNavigation.attachEvent(a.Events.FocusAgain,_,this);this._oItemNavigation.attachEvent(a.Events.BorderReached,D,this);this.addDelegate(this._oItemNavigation);this._oItemNavigation.setHomeEndColumnMode(true,true);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"],saphome:["alt","meta"],sapend:["meta"]})}this._oItemNavigation.setRootDomRef(t);this._oItemNavigation.setItemDomRefs(s);this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(this.getColumns(),true);if(r._isBetween(e,this._oMinDate,this._oMaxDate,true)){this._oItemNavigation.setFocusedIndex(o)}this._oItemNavigation.setPageSize(s.length)}function f(e){var t=e.getParameter("index"),a=e.getParameter("event"),r=this._oItemNavigation.aItemDomRefs[t],s=this._getSelectedDates()[0],o,n,l;if(!a){return}if(a.type==="mousedown"){this._handleMousedown(a,t)}else if(a.type==="sapnext"||a.type==="sapprevious"){if(!s){return}if(s.getStartDate()){o=i.fromLocalJSDate(s.getStartDate(),this._getPrimaryCalendarType());o.setMonth(0,1)}l=r.getAttribute("data-sap-year-start");n=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(l),this._getPrimaryCalendarType());if(this._isSelectionInProgress()){this._markInterval(o,n)}}}function _(e){f.call(this,e)}u.prototype._handleMousedown=function(e,a){if(e.button||t.support.touch&&!t.system.combi){return}var r=this._selectYear(a);if(r){this._bMousedownChange=true}e.preventDefault();e.setMark("cancelAutoClose")};function D(e){var t=e.getParameter("event"),a=this._oItemNavigation.getFocusedIndex(),r=this.getYears(),s=this.getColumns(),o=this._getSelectedDates()[0],n=this._oItemNavigation.getItemDomRefs(),l,h,d;if(o&&o.getStartDate()){l=i.fromLocalJSDate(o.getStartDate(),this._getPrimaryCalendarType());l.setMonth(0,1)}if(t.type){if(s===0){s=r}switch(t.type){case"sapnext":case"sapnextmodifiers":if(t.keyCode===g.ARROW_DOWN&&s<r){d=n[a-r+s].getAttribute("data-sap-year-start");h=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(d),this._getPrimaryCalendarType());this._updatePage(true,a-r+s,true);this._iSelectedIndex=a-r+s}else{d=n[0].getAttribute("data-sap-year-start");h=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(d),this._getPrimaryCalendarType());this._updatePage(true,0,true)}break;case"sapprevious":case"sappreviousmodifiers":if(t.keyCode===g.ARROW_UP&&s<r){d=n[r-s+a].getAttribute("data-sap-year-start");h=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(d),this._getPrimaryCalendarType());this._updatePage(false,r-s+a,true);this._iSelectedIndex=r-s+a}else{d=n[r-1].getAttribute("data-sap-year-start");h=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(d),this._getPrimaryCalendarType());this._updatePage(false,r-1,true)}break;case"sappagedown":d=n[a].getAttribute("data-sap-year-start");h=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(d),this._getPrimaryCalendarType());this._updatePage(true,a,true);break;case"sappageup":d=n[a].getAttribute("data-sap-year-start");h=i.fromLocalJSDate(this._oFormatYyyymmdd.parse(d),this._getPrimaryCalendarType());this._updatePage(false,a,true);break;default:break}}this._isSelectionInProgress()&&this._markInterval(l,h)}u.prototype._fnShouldApplySelection=function(e){var t=this._getSelectedDates()[0],a,r;if(!t){return false}a=t.getStartDate();r=t.getEndDate();if(a){a=i.fromLocalJSDate(a,this._getPrimaryCalendarType());a.setMonth(0,1)}if(this.getIntervalSelection()&&a&&r){r=i.fromLocalJSDate(r,this._getPrimaryCalendarType());r.setMonth(0,1);if(e.isSame(a)||e.isSame(r)){return true}}else if(a&&e.isSame(a)){return true}return false};u.prototype._fnShouldApplySelectionBetween=function(e){var t=this._getSelectedDates()[0],a,s;if(!t){return false}a=t.getStartDate();s=t.getEndDate();if(this.getIntervalSelection()&&a&&s){a=i.fromLocalJSDate(a,this._getPrimaryCalendarType());a.setMonth(0,1);s=i.fromLocalJSDate(s,this._getPrimaryCalendarType());s.setMonth(0,1);if(r._isBetween(e,a,s)){return true}}return false};return u});
//# sourceMappingURL=YearPicker.js.map