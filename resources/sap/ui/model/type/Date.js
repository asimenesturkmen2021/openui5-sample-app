/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/each","sap/base/util/isEmptyObject","sap/ui/core/date/UI5Date","sap/ui/core/format/DateFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/SimpleType","sap/ui/model/ValidateException"],function(t,e,o,a,r,i,s,n){"use strict";var u=s.extend("sap.ui.model.type.Date",{constructor:function(){s.apply(this,arguments);this.sName="Date"}});u.prototype.formatValue=function(t,e){var o;switch(this.getPrimitiveType(e)){case"string":case"any":if(t==null){return""}if(this.oFormatOptions.source&&this.oFormatOptions.source.pattern!=="timestamp"&&t===""){return""}o=this.getModelFormat();t=o.parse(t);return this.oOutputFormat.format(t);default:throw new r("Don't know how to format Date to "+e)}};u.prototype.parseValue=function(t,e){var o,a;switch(this.getPrimitiveType(e)){case"string":if(t===""){return null}o=this.oOutputFormat.parse(t);if(!o){a=sap.ui.getCore().getLibraryResourceBundle();throw new i(a.getText(this.sName+".Invalid"))}if(this.oInputFormat){if(this.oFormatOptions.source.pattern=="timestamp"){o=o.getTime()}else{o=this.oInputFormat.format(o)}}return o;default:throw new i("Don't know how to parse Date from "+e)}};u.prototype.validateValue=function(e){if(this.oConstraints){var o=sap.ui.getCore().getLibraryResourceBundle(),a=[],r=[],i=this.oInputFormat,s,u=this;if(i&&this.oFormatOptions.source.pattern!="timestamp"){e=i.parse(e)}t(this.oConstraints,function(t,n){if(i){n=i.parse(n)}s=u.oOutputFormat.format(n);switch(t){case"minimum":if(e<n){a.push("minimum");r.push(o.getText(u.sName+".Minimum",[s]))}break;case"maximum":if(e>n){a.push("maximum");r.push(o.getText(u.sName+".Maximum",[s]))}break;default:break}});if(a.length>0){throw new n(this.combineMessages(r),a)}}};var p={format:function(t){if(t instanceof Date){return t.getTime()}return null},parse:function(t){if(typeof t!="number"){if(isNaN(t)){throw new r("Cannot format date: "+t+" is not a valid Timestamp")}else{t=parseInt(t)}}t=o.getInstance(t);return t}};u.prototype.getModelFormat=function(){if(this.oInputFormat){if(this.oFormatOptions.source.pattern=="timestamp"){return p}else{return this.oInputFormat}}else{return s.prototype.getModelFormat.call(this)}};u.prototype.setFormatOptions=function(t){this.oFormatOptions=t;this._createFormats()};u.prototype.getOutputPattern=function(){return this.oOutputFormat.oFormatOptions.pattern};u.prototype._handleLocalizationChange=function(){this._createFormats()};u.prototype._createFormats=function(){var t=this.oFormatOptions.source;this.oOutputFormat=a.getInstance(this.oFormatOptions);if(t){if(e(t)){t={pattern:"yyyy-MM-dd"}}this.oInputFormat=a.getInstance(t)}};u.prototype.getPlaceholderText=function(){return this.oOutputFormat.getPlaceholderText()};return u});
//# sourceMappingURL=Date.js.map