/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/extend","sap/ui/core/format/NumberFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/odata/type/ODataType"],function(t,e,a,n,r,o,i){"use strict";function s(t,e){return sap.ui.getCore().getLibraryResourceBundle().getText(t,e)}function u(e,a){var n;e.oConstraints=undefined;if(a){n=a.nullable;if(n===false||n==="false"){e.oConstraints={nullable:false}}else if(n!==undefined&&n!==true&&n!=="true"){t.warning("Illegal nullable: "+n,null,e.getName())}}e._handleLocalizationChange()}var l=i.extend("sap.ui.model.odata.type.Int",{constructor:function(t,e){i.apply(this,arguments);this.oFormatOptions=t;u(this,e);this.checkParseEmptyValueToZero()},metadata:{abstract:true}});l.prototype._handleLocalizationChange=function(){this.oFormat=null};l.prototype.formatValue=function(t,e){if(t===undefined||t===null){return null}if(typeof t!=="number"&&e!=="any"){throw new n("Illegal "+this.getName()+" value: "+t)}switch(this.getPrimitiveType(e)){case"string":return this.getFormat().format(t);case"int":return Math.floor(t);case"float":case"any":return t;default:throw new n("Don't know how to format "+this.getName()+" to "+e)}};l.prototype.getFormat=function(){if(!this.oFormat){var t=e({groupingEnabled:true},this.oFormatOptions);delete t.parseEmptyValueToZero;this.oFormat=a.getIntegerInstance(t)}return this.oFormat};l.prototype.parseValue=function(t,e){var a=this.getEmptyValue(t,true);if(a!==undefined){return a}switch(this.getPrimitiveType(e)){case"string":var n=this.getFormat().parse(t);if(isNaN(n)){throw new r(s("EnterInt"))}return n;case"float":return Math.floor(t);case"int":return t;default:throw new r("Don't know how to parse "+this.getName()+" from "+e)}};l.prototype.validateValue=function(t){var e=this.getRange();if(t===null){if(this.oConstraints&&this.oConstraints.nullable===false){throw new o(s("EnterInt"))}return}if(typeof t!=="number"){throw new o(t+" (of type "+typeof t+") is not a valid "+this.getName()+" value")}if(Math.floor(t)!==t){throw new o(s("EnterInt"))}if(t<e.minimum){throw new o(s("EnterNumberMin",[this.formatValue(e.minimum,"string")]))}if(t>e.maximum){throw new o(s("EnterNumberMax",[this.formatValue(e.maximum,"string")]))}};return l});
//# sourceMappingURL=Int.js.map