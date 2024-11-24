/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/InvisibleText","sap/ui/core/Element","sap/ui/core/Control","sap/ui/core/Lib","sap/ui/core/ListItem","sap/ui/core/library","sap/ui/core/Renderer","sap/ui/core/message/MessageMixin","sap/m/DynamicDateFormat","sap/ui/core/IconPool","sap/ui/core/Icon","sap/ui/core/LabelEnablement","sap/ui/core/date/UniversalDate","sap/ui/core/format/DateFormat","sap/ui/base/ManagedObjectObserver","sap/ui/Device","./Label","./GroupHeaderListItem","./StandardListItem","./StandardListItemRenderer","./Button","./List","./Input","./InputRenderer","./Toolbar","./ResponsivePopover","./Page","./NavContainer","./DynamicDateRangeRenderer","./StandardDynamicDateOption","./library","sap/ui/thirdparty/jquery","sap/ui/unified/calendar/CalendarUtils","sap/ui/core/CustomData"],function(e,t,i,o,n,a,s,r,u,p,l,T,E,h,g,d,A,S,D,c,y,f,_,R,I,N,O,v,L,m,C,U,jQuery,M,b){"use strict";var Y=s.ValueState,H=U.ToolbarDesign,P=U.ToolbarStyle,F=U.ListType,w=U.ListMode,V=U.ListSeparators,X=n.getResourceBundleFor("sap.m");var k={TODAY:new C({key:"TODAY",valueTypes:[]}),YESTERDAY:new C({key:"YESTERDAY",valueTypes:[]}),TOMORROW:new C({key:"TOMORROW",valueTypes:[]}),FIRSTDAYWEEK:new C({key:"FIRSTDAYWEEK",valueTypes:[]}),LASTDAYWEEK:new C({key:"LASTDAYWEEK",valueTypes:[]}),FIRSTDAYMONTH:new C({key:"FIRSTDAYMONTH",valueTypes:[]}),LASTDAYMONTH:new C({key:"LASTDAYMONTH",valueTypes:[]}),FIRSTDAYQUARTER:new C({key:"FIRSTDAYQUARTER",valueTypes:[]}),LASTDAYQUARTER:new C({key:"LASTDAYQUARTER",valueTypes:[]}),FIRSTDAYYEAR:new C({key:"FIRSTDAYYEAR",valueTypes:[]}),LASTDAYYEAR:new C({key:"LASTDAYYEAR",valueTypes:[]}),THISWEEK:new C({key:"THISWEEK",valueTypes:[]}),THISMONTH:new C({key:"THISMONTH",valueTypes:[]}),THISQUARTER:new C({key:"THISQUARTER",valueTypes:[]}),THISYEAR:new C({key:"THISYEAR",valueTypes:[]}),LASTWEEK:new C({key:"LASTWEEK",valueTypes:[]}),LASTMONTH:new C({key:"LASTMONTH",valueTypes:[]}),LASTQUARTER:new C({key:"LASTQUARTER",valueTypes:[]}),LASTYEAR:new C({key:"LASTYEAR",valueTypes:[]}),NEXTWEEK:new C({key:"NEXTWEEK",valueTypes:[]}),NEXTMONTH:new C({key:"NEXTMONTH",valueTypes:[]}),NEXTQUARTER:new C({key:"NEXTQUARTER",valueTypes:[]}),NEXTYEAR:new C({key:"NEXTYEAR",valueTypes:[]}),LASTMINUTES:new C({key:"LASTMINUTES",valueTypes:["int"]}),LASTHOURS:new C({key:"LASTHOURS",valueTypes:["int"]}),LASTDAYS:new C({key:"LASTDAYS",valueTypes:["int"]}),LASTWEEKS:new C({key:"LASTWEEKS",valueTypes:["int"]}),LASTMONTHS:new C({key:"LASTMONTHS",valueTypes:["int"]}),LASTQUARTERS:new C({key:"LASTQUARTERS",valueTypes:["int"]}),LASTYEARS:new C({key:"LASTYEARS",valueTypes:["int"]}),NEXTMINUTES:new C({key:"NEXTMINUTES",valueTypes:["int"]}),NEXTHOURS:new C({key:"NEXTHOURS",valueTypes:["int"]}),NEXTDAYS:new C({key:"NEXTDAYS",valueTypes:["int"]}),NEXTWEEKS:new C({key:"NEXTWEEKS",valueTypes:["int"]}),NEXTMONTHS:new C({key:"NEXTMONTHS",valueTypes:["int"]}),NEXTQUARTERS:new C({key:"NEXTQUARTERS",valueTypes:["int"]}),NEXTYEARS:new C({key:"NEXTYEARS",valueTypes:["int"]}),LASTMINUTESINCLUDED:new C({key:"LASTMINUTESINCLUDED",valueTypes:["int","included"]}),LASTHOURSINCLUDED:new C({key:"LASTHOURSINCLUDED",valueTypes:["int","included"]}),LASTDAYSINCLUDED:new C({key:"LASTDAYSINCLUDED",valueTypes:["int","included"]}),LASTWEEKSINCLUDED:new C({key:"LASTWEEKSINCLUDED",valueTypes:["int","included"]}),LASTMONTHSINCLUDED:new C({key:"LASTMONTHSINCLUDED",valueTypes:["int","included"]}),LASTQUARTERSINCLUDED:new C({key:"LASTQUARTERSINCLUDED",valueTypes:["int","included"]}),LASTYEARSINCLUDED:new C({key:"LASTYEARSINCLUDED",valueTypes:["int","included"]}),NEXTMINUTESINCLUDED:new C({key:"NEXTMINUTESINCLUDED",valueTypes:["int","included"]}),NEXTHOURSINCLUDED:new C({key:"NEXTHOURSINCLUDED",valueTypes:["int","included"]}),NEXTDAYSINCLUDED:new C({key:"NEXTDAYSINCLUDED",valueTypes:["int","included"]}),NEXTWEEKSINCLUDED:new C({key:"NEXTWEEKSINCLUDED",valueTypes:["int","included"]}),NEXTMONTHSINCLUDED:new C({key:"NEXTMONTHSINCLUDED",valueTypes:["int","included"]}),NEXTQUARTERSINCLUDED:new C({key:"NEXTQUARTERSINCLUDED",valueTypes:["int","included"]}),NEXTYEARSINCLUDED:new C({key:"NEXTYEARSINCLUDED",valueTypes:["int","included"]}),FROM:new C({key:"FROM",valueTypes:["date"]}),TO:new C({key:"TO",valueTypes:["date"]}),FROMDATETIME:new C({key:"FROMDATETIME",valueTypes:["datetime"]}),TODATETIME:new C({key:"TODATETIME",valueTypes:["datetime"]}),YEARTODATE:new C({key:"YEARTODATE",valueTypes:[]}),DATETOYEAR:new C({key:"DATETOYEAR",valueTypes:[]}),TODAYFROMTO:new C({key:"TODAYFROMTO",valueTypes:["int","int"]}),QUARTER1:new C({key:"QUARTER1",valueTypes:[]}),QUARTER2:new C({key:"QUARTER2",valueTypes:[]}),QUARTER3:new C({key:"QUARTER3",valueTypes:[]}),QUARTER4:new C({key:"QUARTER4",valueTypes:[]}),SPECIFICMONTH:new C({key:"SPECIFICMONTH",valueTypes:["int"]}),SPECIFICMONTHINYEAR:new C({key:"SPECIFICMONTHINYEAR",valueTypes:["int","int"]}),DATERANGE:new C({key:"DATERANGE",valueTypes:["date","date"]}),DATE:new C({key:"DATE",valueTypes:["date"]}),DATETIME:new C({key:"DATETIME",valueTypes:["datetime"]}),DATETIMERANGE:new C({key:"DATETIMERANGE",valueTypes:["datetime","datetime"]})};var K=["DATE","TODAY","YESTERDAY","TOMORROW","FIRSTDAYWEEK","LASTDAYWEEK","FIRSTDAYMONTH","LASTDAYMONTH","FIRSTDAYQUARTER","LASTDAYQUARTER","FIRSTDAYYEAR","LASTDAYYEAR","DATERANGE","DATETIMERANGE","FROM","TO","FROMDATETIME","TODATETIME","YEARTODATE","DATETOYEAR","LASTMINUTES","LASTHOURS","LASTDAYS","LASTWEEKS","LASTMONTHS","LASTQUARTERS","LASTYEARS","NEXTMINUTES","NEXTHOURS","NEXTDAYS","NEXTWEEKS","NEXTMONTHS","NEXTQUARTERS","NEXTYEARS","LASTMINUTESINCLUDED","LASTHOURSINCLUDED","LASTDAYSINCLUDED","LASTWEEKSINCLUDED","LASTMONTHSINCLUDED","LASTQUARTERSINCLUDED","LASTYEARSINCLUDED","NEXTMINUTESINCLUDED","NEXTHOURSINCLUDED","NEXTDAYSINCLUDED","NEXTWEEKSINCLUDED","NEXTMONTHSINCLUDED","NEXTQUARTERSINCLUDED","NEXTYEARSINCLUDED","TODAYFROMTO","THISWEEK","LASTWEEK","NEXTWEEK","SPECIFICMONTH","SPECIFICMONTHINYEAR","THISMONTH","LASTMONTH","NEXTMONTH","THISQUARTER","LASTQUARTER","NEXTQUARTER","QUARTER1","QUARTER2","QUARTER3","QUARTER4","THISYEAR","LASTYEAR","NEXTYEAR","DATETIME"];var x={SingleDates:1,DateRanges:2,Weeks:3,Month:4,Quarters:5,Years:6};var G=o.extend("sap.m.DynamicDateRange",{metadata:{library:"sap.m",properties:{value:{type:"object",group:"Data"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:Y.None},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueStateText:{type:"string",group:"Misc",defaultValue:null},required:{type:"boolean",group:"Misc",defaultValue:false},enableGroupHeaders:{type:"boolean",group:"Behavior",defaultValue:true},formatter:{type:"object"},standardOptions:{type:"string[]",group:"Behavior",defaultValue:["DATE","TODAY","YESTERDAY","TOMORROW","FIRSTDAYWEEK","LASTDAYWEEK","FIRSTDAYMONTH","LASTDAYMONTH","FIRSTDAYQUARTER","LASTDAYQUARTER","FIRSTDAYYEAR","LASTDAYYEAR","DATERANGE","DATETIMERANGE","FROM","TO","FROMDATETIME","TODATETIME","YEARTODATE","DATETOYEAR","LASTMINUTES","LASTHOURS","LASTDAYS","LASTWEEKS","LASTMONTHS","LASTQUARTERS","LASTYEARS","LASTMINUTESINCLUDED","LASTHOURSINCLUDED","LASTDAYSINCLUDED","LASTWEEKSINCLUDED","LASTMONTHSINCLUDED","LASTQUARTERSINCLUDED","LASTYEARSINCLUDED","NEXTMINUTES","NEXTHOURS","NEXTDAYS","NEXTWEEKS","NEXTMONTHS","NEXTQUARTERS","NEXTYEARS","NEXTMINUTESINCLUDED","NEXTHOURSINCLUDED","NEXTDAYSINCLUDED","NEXTWEEKSINCLUDED","NEXTMONTHSINCLUDED","NEXTQUARTERSINCLUDED","NEXTYEARSINCLUDED","TODAYFROMTO","THISWEEK","LASTWEEK","NEXTWEEK","SPECIFICMONTH","SPECIFICMONTHINYEAR","THISMONTH","LASTMONTH","NEXTMONTH","THISQUARTER","LASTQUARTER","NEXTQUARTER","QUARTER1","QUARTER2","QUARTER3","QUARTER4","THISYEAR","LASTYEAR","NEXTYEAR","DATETIME"]},hideInput:{type:"boolean",group:"Misc",defaultValue:false},calendarWeekNumbering:{type:"sap.ui.core.date.CalendarWeekNumbering",group:"Appearance",defaultValue:null},showClearIcon:{type:"boolean",defaultValue:false}},aggregations:{customOptions:{type:"sap.m.DynamicDateOption",multiple:true},_input:{type:"sap.m.Input",multiple:false,visibility:"hidden"},_popup:{type:"sap.m.ResponsivePopover",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{change:{parameters:{value:{type:"object"},valid:{type:"boolean"}}}}},renderer:m});u.call(G.prototype);var W=["LASTMINUTES","LASTHOURS","LASTMINUTESINCLUDED","LASTHOURSINCLUDED"];var Q=["NEXTMINUTES","NEXTHOURS","NEXTMINUTESINCLUDED","NEXTHOURSINCLUDED"];var B=W.concat(Q);var j=["LASTMINUTES","LASTHOURS","LASTDAYS","LASTWEEKS","LASTMONTHS","LASTQUARTERS","LASTYEARS"];var q=["NEXTMINUTES","NEXTHOURS","NEXTDAYS","NEXTWEEKS","NEXTMONTHS","NEXTQUARTERS","NEXTYEARS"];var z=["LASTMINUTESINCLUDED","LASTHOURSINCLUDED","LASTDAYSINCLUDED","LASTWEEKSINCLUDED","LASTMONTHSINCLUDED","LASTQUARTERSINCLUDED","LASTYEARSINCLUDED"];var J=["NEXTMINUTESINCLUDED","NEXTHOURSINCLUDED","NEXTDAYSINCLUDED","NEXTWEEKSINCLUDED","NEXTMONTHSINCLUDED","NEXTQUARTERSINCLUDED","NEXTYEARSINCLUDED"];G.prototype.init=function(){var e=!A.support.touch||A.system.desktop?true:false;this._oInput=new Z(this.getId()+"-input",{valueHelpIconSrc:l.getIconURI("sap-icon://check-availability"),valueHelpRequest:this._toggleOpen.bind(this),showSuggestion:true,suggest:this._handleSuggest.bind(this)});this._oListItemDelegate=undefined;this._onBeforeInputRenderingDelegate={onBeforeRendering:function(){this._oInput._getValueHelpIcon().setVisible(true)}};this._oInput._getValueHelpIcon().setDecorative(e);this._oInput.addDelegate(this._onBeforeInputRenderingDelegate,this);this.setAggregation("_input",this._oInput,false);this._oInput._setControlOrigin(this);this._oInput.attachChange(this._handleInputChange,this);this.oValueObserver=new d(function(){delete this.oBoundValueFormatter}.bind(this));this.oValueObserver.observe(this,{bindings:["value"]})};G.prototype.exit=function(){this._oInput.removeDelegate(this._onBeforeInputRenderingDelegate);this._onBeforeInputRenderingDelegate=undefined;this.oValueObserver.destroy();this._infoDatesFooter=undefined;this.aInputControls=undefined;this._removeAllListItemDelegates()};G.prototype._removeAllListItemDelegates=function(){if(this._oOptionsList){this._oOptionsList.getItems().forEach(function(e){e.removeDelegate(this._oListItemDelegate)},this)}};G.prototype.getValue=function(){return this.getProperty("value")};G.prototype.getFormatter=function(){return this.getProperty("formatter")};G.prototype.setFormatter=function(e){this.setProperty("formatter",e);return this};G.prototype.setTooltip=function(e){this._oInput.setTooltip(e);return o.prototype.setTooltip.apply(this,arguments)};G.prototype.setShowClearIcon=function(e){this.setProperty("showClearIcon",e);this._oInput.setShowClearIcon(e);return this};G.prototype.onBeforeRendering=function(){this._updateInputValue(this.getValue());this._oInput.setEditable(this.getEditable());this._oInput.setEnabled(this.getEnabled());this._oInput.setRequired(this.getRequired());this._oInput.setName(this.getName());this._oInput.setWidth(this.getWidth());this._oInput.setPlaceholder(this.getPlaceholder());this._oInput.setValueState(this.getValueState());this._oInput.setValueStateText(this.getValueStateText());this.setValue(this._substituteMissingValue(this.getValue()))};G.prototype.setValue=function(e){var t=e&&e.operator;e=this._substituteValue(e);this.setProperty("value",e);this._oSelectedOption=this.getOption(t);this._updateInputValue(e);return this};G.prototype._toggleOpen=function(){if(this._oPopup&&this._oPopup.isOpen()){this._closePopup()}else{this.open()}};G.prototype.open=function(e){if(this.getEditable()&&this.getEnabled()){this._createPopup();this._createPopupContent();if(!this._oListItemDelegate){this._oListItemDelegate={onsapshow:this._closePopup.bind(this),onsaphide:this._closePopup.bind(this)}}this._removeAllListItemDelegates();this._oOptionsList.destroyAggregation("items");this._collectValueHelpItems(this._getOptions(),true).map(function(e){if(typeof e==="string"){return this._createHeaderListItem(e)}if(e.getKey()==="FROMDATETIME"){e._bAdditionalTimeText=!!this._findOption("FROM")}else if(e.getKey()==="TODATETIME"){e._bAdditionalTimeText=!!this._findOption("TO")}else if(e.getKey()==="DATETIMERANGE"){e._bAdditionalTimeText=!!this._findOption("DATERANGE")}return this._createListItem(e)},this).forEach(function(e){e.addDelegate(this._oListItemDelegate,this);this._oOptionsList.addItem(e)},this);this._oNavContainer.to(this._oNavContainer.getPages()[0]);this._openPopup(e)}};G.prototype._findOption=function(e){return this._getOptions().find(function(t){return t.getKey()===e})};G.prototype.addStandardOption=function(e){var t=this.getStandardOptions();if(t.indexOf(e)===-1){t.push(e)}this.setStandardOptions(t)};G.prototype.getFocusDomRef=function(){return this.getAggregation("_input")&&this.getAggregation("_input").getFocusDomRef()};G.prototype._updateInputValue=function(e){var t;if(e&&e.operator!=="PARSEERROR"){t=this._enhanceInputValue(this._formatValue(e),e);this._oInput.setValue(t)}else if(e===undefined){this._oInput.setValue("")}};G.prototype._handleSuggest=function(e){this._bSuggestionMode=true;if(this._oPopup&&this._oPopup.isOpen()){this._closePopup()}var t=e.getParameter("suggestValue");this._oInput.removeAllSuggestionItems();var i=this._getOptions().filter(function(e){var i={operator:e.getKey(),values:[]},o=e.getValueHelpUITypes(this);if(o.length&&o[0].getType()){return false}var n=this.getOption(i.operator).format(i,this._getFormatter()).toLowerCase();var a=n.indexOf(t.toLowerCase());return a===0||a>0&&n[a-1]===" "},this);this._collectValueHelpItems(i,true).forEach(function(e){if(e.getKey){var t={operator:e.getKey(),values:[]};this._addSuggestionItem(t)}else{this._addSuggestionGroupItem(e)}},this);var o=t.match(/\d+/);if(!o){this._bSuggestionMode=false;return}i=this._getOptions().filter(function(e){return e.getValueHelpUITypes(this).length===1&&e.getValueHelpUITypes(this)[0].getType()==="int"},this);this._collectValueHelpItems(i,false).forEach(function(e){if(e.getKey){var t={operator:e.getKey(),values:[parseInt(o[0])]};this._addSuggestionItem(t)}else{this._addSuggestionGroupItem(e)}},this);this._bSuggestionMode=false};G.prototype.getOption=function(e){return this._getOptions().find(function(t){return t.getKey()===e})};G.prototype.toDates=function(e){var t=e.operator;return this.getOption(t).toDates(e,this.getCalendarWeekNumbering())};G.prototype._getGroups=function(){if(!this.oDynamicDateRangeGroups){this.oDynamicDateRangeGroups=JSON.parse(JSON.stringify(x))}return this.oDynamicDateRangeGroups};G.prototype._getCustomGroupHeader=function(e){var t=this._customGroupHeaders.find(t=>t.name===e);return t.header};G.prototype.addGroup=function(e,t){this._getGroups()[e]=Object.keys(this._getGroups()).length+1;if(!this._customGroupHeaders){this._customGroupHeaders=[]}this._customGroupHeaders.push({name:e,header:t})};G.prototype.setGroupHeader=function(e,t){this._customGroupHeaders.find(t=>t.name===e).header=t};G.prototype.removeCustomGroups=function(){const e=Object.keys(x).length;for(const t in this._getGroups()){if(this._getGroups()[t]>e){delete this._getGroups()[t]}}delete this._customGroupHeaders};G.prototype._getOptions=function(){var e=this.getStandardOptions();var t=e.map(function(e){return k[e]},this);var i=t.filter(Boolean);var o=this.getAggregation("customOptions");if(o){return i.concat(o)}return i};G.prototype._getValueHelpTypeForFormatter=function(){var e=this._oSelectedOption?this._oSelectedOption.getKey():"",t=this.lastOptionsIndex(e),i=this.nextOptionsIndex(e),o=this._oNavContainer?this._oNavContainer.getPages()[1].getContent()[3]||[]:[],n=o,a=this.getAggregation("_input").getAggregation("suggestionItems"),s=this.getValue(),r=this.getStandardOptions(),u="",p=[],l=[],T,E,h,g;if(!s&&!n&&a&&a.length&&a[a.length-1].getCustomData){T=a[a.length-1].getCustomData()[0]}if(this._bSuggestionMode&&a&&a.length&&a[a.length-1].getCustomData){T=a[a.length-1].getCustomData()[0]}r.forEach(function(e){if(this.lastOptionsIndex(e)>-1){p.push(e)}else if(this.nextOptionsIndex(e)>-1){l.push(e)}}.bind(this));if(T){g=T.getValue();t=W.indexOf(g);i=Q.indexOf(g)}if(T&&g){if(B.indexOf(g)>-1){h="datetime";return h}}if(this._oNavContainer||this._oNavContainer&&(t>-1||i>-1)){if((W.indexOf(e)>-1||Q.indexOf(e)>-1)&&n){u=this._oSelectedOption.getKey().slice(0,4)+n.getSelectedKey()}if(B.indexOf(u)>-1){h="datetime";return h}}E=this._oSelectedOption?this._oSelectedOption.getValueHelpUITypes():[];return E&&E.length?E[0].getType():""};G.prototype._getDatesLabelFormatter=function(){var e,t=this._getValueHelpTypeForFormatter();switch(t){case"datetime":e=Object.create(this._getFormatter()._dateTimeFormatter.oFormatOptions);e.singleIntervalValue=true;e.interval=true;this._oDatesLabelFormatter=g.getDateTimeInstance(e);break;default:e=Object.create(this._getFormatter()._dateFormatter.oFormatOptions);e.singleIntervalValue=true;e.interval=true;this._oDatesLabelFormatter=g.getInstance(e)}return this._oDatesLabelFormatter};G.prototype._destroyInputControls=function(){if(!this.aInputControls){return}this.aInputControls.forEach(function(e){e.destroy()});this.aInputControls=undefined};G.prototype._addSuggestionItem=function(e){var t=this.toDates(e,this.getCalendarWeekNumbering());var i=[];for(var o=0;o<t.length;o++){i[o]=t[o]}var n=new a({text:this.getOption(e.operator).format(e,this._getFormatter()),additionalText:"",customData:[new b({key:"operator",value:e.operator})]});this._oInput.addSuggestionItem(n);n.setAdditionalText(this._getDatesLabelFormatter().format(i))};G.prototype._addSuggestionGroupItem=function(e){this._oInput.addSuggestionItemGroup({text:e})};G.prototype._handleInputChange=function(e){var t=e.getParameter("value");var i=this._parseValue(this._stripValue(t));var o=this.getValue();var n=t.trim()===""||!!i;if(this._isDateRange(i)){this._swapDates(i.values)}if(!n){this.setValue({operator:"PARSEERROR",values:[X.getText("DDR_WRONG_VALUE"),t]})}else{this.setValue(i)}this.fireChange({value:this.getValue(),prevValue:o,valid:n})};G.prototype._isDateRange=function(e){return Boolean(e&&(e.operator==="DATERANGE"||e.operator==="DATETIMERANGE"))};G.prototype._swapDates=function(e){if(e.length>1&&e[0].getTime()>e[1].getTime()){e.reverse()}};G.prototype._enhanceInputValue=function(e,t){var i=this.getOption(t.operator);if(!i){return null}if(i.enhanceFormattedValue()||t.operator==="LASTDAYS"&&t.values[0]<=1||t.operator==="NEXTDAYS"&&t.values[0]<=1){return e+" ("+this._toDatesString(t)+")"}return e};G.prototype._stripValue=function(e){var t=e.indexOf("(");var i=e.lastIndexOf(")");var o=e;if(t!==-1&&i!==-1&&t<i){o=e.slice(0,t)+e.slice(i+1);o=o.trim()}return o};G.prototype._toDatesString=function(e){var t=this.toDates(e,this.getCalendarWeekNumbering());var i=[];for(var o=0;o<t.length;o++){i[o]=t[o]}return this._getDatesLabelFormatter().format(i)};G.prototype._getPickerParser=function(){if(!this._calendarParser){this._calendarParser=g.getDateTimeWithTimezoneInstance({showTimezone:false})}return this._calendarParser};G.prototype._createPopup=function(){if(!this._oPopup){this._oPopup=new O(this.getId()+"-RP",{contentHeight:"512px",contentWidth:"320px",showCloseButton:false,showArrow:false,showHeader:false,placement:U.PlacementType.VerticalPreferedBottom,ariaLabelledBy:[t.getStaticId("sap.m","INPUT_AVALIABLE_VALUES")]});this._oPopup.addStyleClass("sapMDDRPopover");this._oPopup.attachValidationError(function(e){e.bCancelBubble=true});if(A.system.phone){this._oPopup.addStyleClass("sapUiNoContentPadding")}else{this._oPopup._oControl._getSingleNavContent=function(){return null}}this._oPopup.attachAfterOpen(function(){var e=this._oNavContainer.getPages()[0];this._applyNavContainerPageFocus(e)},this);this._oPopup.attachAfterClose(function(){this._oPreviousSelectedOption=this._oSelectedOption;this._setFooterVisibility(false)},this);this._oPopup.setBeginButton(new f({type:U.ButtonType.Emphasized,text:X.getText("DYNAMIC_DATE_RANGE_CONFIRM"),press:this._applyValue.bind(this)}));this._oPopup.setEndButton(new f({text:X.getText("DYNAMIC_DATE_RANGE_CANCEL"),press:function(){this._oSelectedOption=this._oPreviousSelectedOption;this._oDatesLabelFormatter=null;this._closePopup()}.bind(this)}));this._setFooterVisibility(false);this._oPopup._getPopup().setAutoClose(true);this.setAggregation("_popup",this._oPopup,true)}};G.prototype._collectValueHelpItems=function(e,t){var i;var o;var n=[];var a=e;a.sort(function(e,t){var i=Number(e.getGroup())?e.getGroup():this._getGroups()[e.getGroup()];var o=Number(t.getGroup())?t.getGroup():this._getGroups()[t.getGroup()];var n=i-o;if(n){return n}return K.indexOf(e.getKey())-K.indexOf(t.getKey())}.bind(this));if(t){a=a.reduce(function(e,t){if(C.LastXKeys.indexOf(t.getKey())!==-1){if(i){return e}i=true}if(C.NextXKeys.indexOf(t.getKey())!==-1){if(o){return e}o=true}e.push(t);return e},[])}if(this.getEnableGroupHeaders()){a=a.reduce(function(e,t){var i=Number(t.getGroup())?t.getGroup():this._getGroups()[t.getGroup()];var o=Object.keys(this._getGroups()).find(e=>this._getGroups()[e]===i);var a=this._customGroupHeaders&&this._customGroupHeaders.find(e=>e.name===o);var s=a?this.getGroupHeader(o):t.getGroupHeader();if(n.indexOf(s)===-1){n.push(s);e.push(s)}e.push(t);return e}.bind(this),[])}return a};G.prototype.getGroupHeader=function(e){var t=this._getGroups()[e];if(t>=this._getGroups()["SingleDates"]&&t<=this._getGroups()["Years"]){return X.getText("DDR_OPTIONS_GROUP_"+t)}return this._getCustomGroupHeader(e)};G.prototype._createListItem=function(e){var t=this._isFixedOption(e);return new ee(this.getId()+"-option-"+e.getKey().replaceAll(" ",""),{type:t?F.Active:F.Navigation,title:e.getText(this),wrapping:true,optionKey:e.getKey(),press:this._handleOptionPress.bind(this)})};G.prototype._createHeaderListItem=function(e){var t=new D;t.setTitle(e);t._bGroupHeader=true;return t};G.prototype._handleOptionPress=function(e){var t=e.getSource().getOptionKey(),i=this.getOption(t);if(this._oPreviousSelectedOption&&this._oPreviousSelectedOption.getKey()!==t){this._oDatesLabelFormatter=null}this._oPreviousSelectedOption=this._oSelectedOption;this._oSelectedOption=i;if(this._isFixedOption(i)){this._applyValue()}else{var o=this._createInfoDatesFooter();this._destroyInputControls();this.aInputControls=i.createValueHelpUI(this,this._updateInternalControls.bind(this));var n=this._oNavContainer.getPages()[1];n.removeAllContent();this.aInputControls.forEach(function(e){n.addContent(e)});n.setFooter(o);n.setTitle(i.getText(this));this._setFooterVisibility(true);this._updateInternalControls(i);this._oNavContainer.to(n)}};G.prototype._isFixedOption=function(e){return!e.getValueHelpUITypes(this).length};G.prototype._createInfoDatesFooter=function(){this._infoDatesFooter=new N({design:H.Info,style:P.Clear,content:[new S({text:X.getText("DDR_INFO_DATES_EMPTY_HINT")})]});return this._infoDatesFooter};G.prototype._getDatesLabel=function(){return this._infoDatesFooter.getContent()[0]};G.prototype._updateDatesLabel=function(){var e=this._oSelectedOption.getValueHelpOutput(this),t=[],i,o;var n=this.toDates(e,this.getCalendarWeekNumbering());if(!e||!e.operator||!this.getOption(e.operator)){return}for(var a=0;a<n.length;a++){t[a]=M._createUTCDate(n[a],true)}if(this._isDateRange(e)){this._swapDates(t)}if(t){o=this._oSelectedOption.getKey();if(o==="FROMDATETIME"||o==="TODATETIME"||o==="FROM"||o==="TO"){t.push(null)}i=this._getDatesLabelFormatter().format(t,true);this._getDatesLabel().setText(X.getText("DDR_INFO_DATES",[i]))}};G.prototype._setApplyButtonEnabled=function(e){if(!this._oPopup){return}var t=this._oPopup.getBeginButton();if(t.getVisible()){t.setEnabled(e)}};G.prototype._updateInternalControls=function(e){var t=e.validateValueHelpUI(this);if(t){if(e.alignValueHelpUI){e.alignValueHelpUI(this)}this._updateDatesLabel()}this._setApplyButtonEnabled(t)};G.prototype._setFooterVisibility=function(e){var t;if(!this._oPopup){return}t=this._oPopup.getAggregation("_popup");if(A.system.phone){this._oPopup.getBeginButton().setVisible(e)}else{t.getFooter().setVisible(e)}e&&t.invalidate();return this};G.prototype._createPopupContent=function(){var e=new v({showHeader:false,showNavButton:false}),t=new v({showHeader:true,showNavButton:true}).addStyleClass("sapMDynamicDateRangePopover");t.attachNavButtonPress(function(){this._setFooterVisibility(false);this._oNavContainer.back()},this);if(A.system.phone){e.setShowHeader(true);e.setTitle(this._getOptionsPageTitleText())}if(!this._oOptionsList){this._oOptionsList=new _({showSeparators:V.None,mode:w.SingleSelectMaster})}if(!this._oNavContainer){this._oNavContainer=new L({autoFocus:false});this._oNavContainer.addPage(e);this._oNavContainer.setInitialPage(e);this._oNavContainer.addPage(t);this._oNavContainer.attachAfterNavigate(this._navContainerAfterNavigate,this);this._oPopup.addContent(this._oNavContainer)}this._oNavContainer.getPages()[0].removeAllContent();this._oNavContainer.getPages()[0].addContent(this._oOptionsList);return this._oOptionsList};G.prototype._determineOptionFocus=function(e){var t=this._oOptionsList.getItems(),i=t.filter(function(t){return t.getOptionKey&&t.getOptionKey()===e.operator})[0];if(!i){if(j.indexOf(e.operator)>-1){i=t.filter(function(e){return e.getOptionKey&&e.getOptionKey()===j[0]})[0]}else if(this.nextOptionsIndex(e.operator)>-1){i=t.filter(function(e){return e.getOptionKey&&e.getOptionKey()===q[0]})[0]}}return i};G.prototype._applyNavContainerPageFocus=function(e){var t=this.getValue(),i=this._oNavContainer.getPages()[0],o;if(e===i&&t){o=this._determineOptionFocus(t)||o}if(!e.getDomRef()){return}if(!o){o=jQuery(e.getDomRef().querySelector("section")).firstFocusableDomRef()}if(t&&t.operator!=="PARSEERROR"&&o){o.setSelected&&o.setSelected(true)}if(o){o.focus()}this._reApplyFocusToElement(e,t)};G.prototype._reApplyFocusToElement=function(e,t){};G.prototype._getOptionsPageTitleText=function(){return E.getReferencingLabels(this).concat(this.getAriaLabelledBy()).reduce(function(e,t){var o=i.getElementById(t);return e+" "+(o.getText?o.getText():"")},"").trim()};G.prototype._navContainerAfterNavigate=function(e){var t=this._oNavContainer.getPages()[1],i=e.getParameters()["to"];if(i===t){this.aInputControls.forEach(function(e){if(e.$().firstFocusableDomRef()){e.addAriaLabelledBy&&e.addAriaLabelledBy(i.getId()+"-title");if(!this._isCalendarBasedControl(e)&&e.addAriaDescribedBy){e.addAriaDescribedBy(i.getFooter().getContent()[0])}}},this)}if(this._oPopup&&this._oPopup.isOpen()){this._applyNavContainerPageFocus(i)}else{this.focus()}};G.prototype._isCalendarBasedControl=function(e){return e.isA("sap.ui.unified.Calendar")||e.isA("sap.ui.unified.calendar.CustomMonthPicker")||e.isA("sap.ui.unified.calendar.MonthPicker")||e.isA("sap.ui.unified.calendar.YearPicker")||e.isA("sap.ui.unified.calendar.YearRangePicker")||e.isA("sap.ui.unified.calendar.Month")};G.prototype.openBy=function(e){this.open(e)};G.prototype._openPopup=function(e){if(!this._oPopup){return}this._oPopup._getPopup().setExtraContent([this._oInput.getDomRef()]);this._oPopup.openBy(e||this._oInput)};G.prototype._applyValue=function(){this._oOutput=this._oSelectedOption.getValueHelpOutput(this);var e=this.toDates(this._oOutput,this.getCalendarWeekNumbering());for(var t=0;t<e.length;t++){if(this._oOutput.values[t]instanceof Date&&e[t]instanceof h){this._oOutput.values[t]=e[t].getJSDate()}}if(this._isDateRange(this._oOutput)){this._swapDates(this._oOutput.values)}var i=this.getValue();this.setValue(this._oOutput);this.fireChange({prevValue:i,value:this.getValue(),valid:true});this._closePopup()};G.prototype._closePopup=function(){this._setFooterVisibility(false);this._oNavContainer.to(this._oNavContainer.getPages()[0]);this._oPopup.close()};G.prototype._getFormatter=function(){var e=this.getFormatter(),t;if(e){return e}if(this.oBoundValueFormatter){return this.oBoundValueFormatter}t=this.getBinding("value");if(t&&t.getType()){this.oBoundValueFormatter=p.getInstance(t.getType().oFormatOptions);return this.oBoundValueFormatter}if(!this.oDefaultFormatter){this.oDefaultFormatter=p.getInstance()}return this.oDefaultFormatter};G.prototype._formatValue=function(e){var t=this.getOption(e.operator);return t?t.format(e,this._getFormatter()):""};G.prototype._parseValue=function(e){var t=this.parse(e,this._getFormatter(),this._getOptions()).filter(function(e){return this._getOptions().find(function(t){return t.getKey()===e.operator})},this);return t.length?t[0]:null};G.prototype.parse=function(t,i){if(typeof t!=="string"){e.error("DynamicDateFormat can only parse a String.");return[]}var o=[],n;var a=this._getOptions();for(var s=0;s<a.length;s++){n=a[s]&&a[s].parse(t.trim(),i);if(n){n.operator=a[s].getKey();o.push(n)}}return o};G.prototype._substituteValue=function(e){var t,i,o;if(!e||!e.operator||!e.values){return e}t=e.operator;i=e.values;if(t==="LASTDAYS"&&i[0]===1&&this.getStandardOptions().includes("YESTERDAY")){o={operator:"YESTERDAY",values:[]}}else if(t==="NEXTDAYS"&&i[0]===1&&this.getStandardOptions().includes("TOMORROW")){o={operator:"TOMORROW",values:[]}}else if((t==="LASTDAYS"||t==="NEXTDAYS")&&i[0]===0){o={operator:"TODAY",values:[]}}return o?o:e};G.prototype.getIdForLabel=function(){return this.getAggregation("_input").getIdForLabel()};G.prototype._substituteMissingValue=function(e){var t=e;if(e&&e.operator==="YESTERDAY"&&!this.getStandardOptions().includes("YESTERDAY")&&this.getStandardOptions().includes("LASTDAYS")){t={operator:"LASTDAYS",values:[1]}}else if(e&&e.operator==="TOMORROW"&&!this.getStandardOptions().includes("TOMORROW")&&this.getStandardOptions().includes("NEXTDAYS")){t={operator:"NEXTDAYS",values:[1]}}return t};G.prototype.lastOptionsIndex=function(e){return j.concat(z).indexOf(e)%j.length};G.prototype.nextOptionsIndex=function(e){return q.concat(J).indexOf(e)%q.length};G.toDates=function(e,t){return k[e.operator].toDates(e,t).map(function(e){if(e instanceof Date){return e}return e.getJSDate()})};var $=r.extend(I);$.apiVersion=2;$.writeInnerAttributes=function(e,t){if(t.getShowSuggestion()||t.getShowValueStateMessage()){e.attr("autocomplete","off")}var i=t._getControlOrigin?t._getControlOrigin():null,o=this.getAccessibilityState(t);if(i&&i.isA("sap.m.DynamicDateRange")){e.accessibilityState(i,o)}e.attr("type","text")};$.getAccessibilityState=function(e){var t=I.getAccessibilityState(e),i=e._getControlOrigin(),o=i.getAriaLabelledBy(),n=E.getReferencingLabels(i),a=i.getAriaDescribedBy().join(" "),r;r=n.concat(o).join(" ");if(a){t.describedby=a}if(r){t.labelledby=r}t.roledescription=X.getText("ACC_CTR_TYPE_DYNAMIC_DATE_RANGE");t.role=this.getAriaRole();if(e.getEditable()&&e.getEnabled()){t.haspopup=s.aria.HasPopup.ListBox.toLowerCase()}t.controls=i._oPopup&&i._oPopup.getDomRef()?i._oPopup.getDomRef().id:undefined;return t};var Z=R.extend("sap.m.internal.DynamicDateRangeInput",{metadata:{library:"sap.m"},renderer:$});Z.prototype._setControlOrigin=function(e){this._oOriginControl=e;return this._oOriginControl};Z.prototype._getControlOrigin=function(){return this._oOriginControl};Z.prototype.preventChangeOnFocusLeave=function(e){return this.bFocusoutDueRendering};Z.prototype.onsapshow=function(e){if(!this.getEnabled()||!this.getEditable()){return}this.bValueHelpRequested=true;this._fireValueHelpRequest(false);e.preventDefault();e.stopPropagation()};Z.prototype.onsaphide=Z.prototype.onsapshow;Z.prototype.shouldSuggetionsPopoverOpenOnMobile=function(e){var t=e.srcControl instanceof T;return this.isMobileDevice()&&this.getEditable()&&this.getEnabled()&&this.getShowSuggestion()&&!t&&!this._bClearButtonPressed};Z.prototype.onfocusin=function(e){var t=this._getControlOrigin()._oPopup;R.prototype.onfocusin.apply(this,arguments);if(t&&t.isOpen()&&!A.system.tablet&&!A.system.mobile){this._getControlOrigin()._closePopup()}};var ee=c.extend("sap.m.DynamicDateRangeListItem",{metadata:{library:"sap.m",properties:{optionKey:{type:"string",group:"Misc",defaultValue:null}}},renderer:y});ee.prototype.hasActiveType=function(){return true};ee.prototype.isIncludedIntoSelection=function(){return false};ee.prototype.onsapspace=function(e){e.preventDefault()};ee.prototype.getNavigationControl=function(){var e=c.prototype.getNavigationControl.apply(this,arguments),t=this.getOptionKey(),i=["SPECIFICMONTH","DATE","DATERANGE","FROM","TO"].includes(t),o=["DATETIME","DATETIMERANGE","FROMDATETIME","TODATETIME"].includes(t),n;if(i||o){e.addStyleClass("sapMDDRDateOption");n=i?l.getIconURI("appointment-2"):l.getIconURI("date-time")}else{n=l.getIconURI("slim-arrow-right")}e.setSrc(n);return e};return G});
//# sourceMappingURL=DynamicDateRange.js.map