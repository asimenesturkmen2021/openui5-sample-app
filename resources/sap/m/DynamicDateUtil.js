/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./StandardDynamicDateOption","sap/base/Log","./library","sap/ui/core/format/TimezoneUtil","sap/ui/core/Core","sap/ui/core/date/UI5Date"],function(e,T,E,A,n,R){"use strict";var S=["DATE","TODAY","YESTERDAY","TOMORROW","FIRSTDAYWEEK","LASTDAYWEEK","FIRSTDAYMONTH","LASTDAYMONTH","FIRSTDAYQUARTER","LASTDAYQUARTER","FIRSTDAYYEAR","LASTDAYYEAR","DATETIMERANGE","FROMDATETIME","TODATETIME","DATERANGE","FROM","TO","YEARTODATE","DATETOYEAR","LASTMINUTES","LASTHOURS","LASTDAYS","LASTWEEKS","LASTMONTHS","LASTQUARTERS","LASTYEARS","NEXTMINUTES","NEXTHOURS","NEXTDAYS","NEXTWEEKS","NEXTMONTHS","NEXTQUARTERS","NEXTYEARS","TODAYFROMTO","THISWEEK","LASTWEEK","NEXTWEEK","SPECIFICMONTH","THISMONTH","LASTMONTH","NEXTMONTH","THISQUARTER","LASTQUARTER","NEXTQUARTER","QUARTER1","QUARTER2","QUARTER3","QUARTER4","THISYEAR","LASTYEAR","NEXTYEAR"];var y={_options:{TODAY:new e({key:"TODAY",valueTypes:[]}),YESTERDAY:new e({key:"YESTERDAY",valueTypes:[]}),TOMORROW:new e({key:"TOMORROW",valueTypes:[]}),FIRSTDAYWEEK:new e({key:"FIRSTDAYWEEK",valueTypes:[]}),LASTDAYWEEK:new e({key:"LASTDAYWEEK",valueTypes:[]}),FIRSTDAYMONTH:new e({key:"FIRSTDAYMONTH",valueTypes:[]}),LASTDAYMONTH:new e({key:"LASTDAYMONTH",valueTypes:[]}),FIRSTDAYQUARTER:new e({key:"FIRSTDAYQUARTER",valueTypes:[]}),LASTDAYQUARTER:new e({key:"LASTDAYQUARTER",valueTypes:[]}),FIRSTDAYYEAR:new e({key:"FIRSTDAYYEAR",valueTypes:[]}),LASTDAYYEAR:new e({key:"LASTDAYYEAR",valueTypes:[]}),THISWEEK:new e({key:"THISWEEK",valueTypes:[]}),THISMONTH:new e({key:"THISMONTH",valueTypes:[]}),THISQUARTER:new e({key:"THISQUARTER",valueTypes:[]}),THISYEAR:new e({key:"THISYEAR",valueTypes:[]}),LASTWEEK:new e({key:"LASTWEEK",valueTypes:[]}),LASTMONTH:new e({key:"LASTMONTH",valueTypes:[]}),LASTQUARTER:new e({key:"LASTQUARTER",valueTypes:[]}),LASTYEAR:new e({key:"LASTYEAR",valueTypes:[]}),NEXTWEEK:new e({key:"NEXTWEEK",valueTypes:[]}),NEXTMONTH:new e({key:"NEXTMONTH",valueTypes:[]}),NEXTQUARTER:new e({key:"NEXTQUARTER",valueTypes:[]}),NEXTYEAR:new e({key:"NEXTYEAR",valueTypes:[]}),LASTMINUTES:new e({key:"LASTMINUTES",valueTypes:["int"]}),LASTHOURS:new e({key:"LASTHOURS",valueTypes:["int"]}),LASTDAYS:new e({key:"LASTDAYS",valueTypes:["int"]}),LASTWEEKS:new e({key:"LASTWEEKS",valueTypes:["int"]}),LASTMONTHS:new e({key:"LASTMONTHS",valueTypes:["int"]}),LASTQUARTERS:new e({key:"LASTQUARTERS",valueTypes:["int"]}),LASTYEARS:new e({key:"LASTYEARS",valueTypes:["int"]}),NEXTMINUTES:new e({key:"NEXTMINUTES",valueTypes:["int"]}),NEXTHOURS:new e({key:"NEXTHOURS",valueTypes:["int"]}),NEXTDAYS:new e({key:"NEXTDAYS",valueTypes:["int"]}),NEXTWEEKS:new e({key:"NEXTWEEKS",valueTypes:["int"]}),NEXTMONTHS:new e({key:"NEXTMONTHS",valueTypes:["int"]}),NEXTQUARTERS:new e({key:"NEXTQUARTERS",valueTypes:["int"]}),NEXTYEARS:new e({key:"NEXTYEARS",valueTypes:["int"]}),FROM:new e({key:"FROM",valueTypes:["date"]}),TO:new e({key:"TO",valueTypes:["date"]}),FROMDATETIME:new e({key:"FROMDATETIME",valueTypes:["datetime"]}),TODATETIME:new e({key:"TODATETIME",valueTypes:["datetime"]}),YEARTODATE:new e({key:"YEARTODATE",valueTypes:[]}),DATETOYEAR:new e({key:"DATETOYEAR",valueTypes:[]}),TODAYFROMTO:new e({key:"TODAYFROMTO",valueTypes:["int","int"]}),QUARTER1:new e({key:"QUARTER1",valueTypes:[]}),QUARTER2:new e({key:"QUARTER2",valueTypes:[]}),QUARTER3:new e({key:"QUARTER3",valueTypes:[]}),QUARTER4:new e({key:"QUARTER4",valueTypes:[]}),SPECIFICMONTH:new e({key:"SPECIFICMONTH",valueTypes:["int"]}),SPECIFICMONTHINYEAR:new e({key:"SPECIFICMONTHINYEAR",valueTypes:["int","int"]}),DATERANGE:new e({key:"DATERANGE",valueTypes:["date","date"]}),DATE:new e({key:"DATE",valueTypes:["date"]}),DATETIME:new e({key:"DATETIME",valueTypes:["datetime"]}),DATETIMERANGE:new e({key:"DATETIMERANGE",valueTypes:["datetime","datetime"]})},_allKeys:S.slice(0)};y.addOption=function(e){if(!e||!e.getKey()){return}var T=e.getKey();y._options[T]=e;if(y._allKeys.indexOf(T)===-1){y._allKeys.push(T)}};y.getAllOptionKeys=function(){return y._allKeys.slice(0)};y.getOption=function(e){return y._options[e]};y.getStandardKeys=function(){return S.slice(0)};y.parse=function(e,E,A){if(typeof e!=="string"){T.error("DynamicDateFormat can only parse a String.");return[]}var n=[],R,S=y.getStandardKeys();A=A||Object.keys(y._options);var a=A.sort(function(e,T){return S.indexOf(e)-S.indexOf(T)}).map(function(e){return y._options[e]});for(var t=0;t<a.length;t++){R=a[t]&&a[t].parse(e.trim(),E);if(R){R.operator=a[t].getKey();n.push(R)}}return n};y.toDates=function(e,T){var E=e.operator;return y._options[E].toDates(e,T)};y.removeTimezoneOffset=function(e){var T=R.getInstance(e);var E=n.getConfiguration().getTimezone();var S=A.calculateOffset(T,E)-T.getTimezoneOffset()*60;T.setSeconds(T.getSeconds()-S);return T};return y},true);
//# sourceMappingURL=DynamicDateUtil.js.map