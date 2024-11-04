/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../base/ManagedObject","./Element","./DeclarativeSupport","./XMLTemplateProcessor","sap/base/future","sap/base/Log","sap/base/util/LoaderExtensions","sap/base/util/merge","sap/ui/util/XMLHelper","sap/ui/core/Component","sap/ui/core/mvc/XMLProcessingMode"],function(e,t,n,i,r,o,a,s,f,u,g){"use strict";var m={},p={};var c=e.extend("sap.ui.core.Fragment",{metadata:{properties:{type:"string"},specialSettings:{async:{type:"boolean",visibility:"hidden"},fragmentName:"string",fragmentContent:"any",containingView:{type:"sap.ui.core.mvc.View",visibility:"hidden"},oController:{type:"sap.ui.core.mvc.Controller",visibility:"hidden"},sId:{type:"sap.ui.core.ID",visibility:"hidden"},sOwnerId:{type:"sap.ui.core.ID",visibility:"hidden"},processingMode:{type:"sap.ui.core.mvc.XMLProcessingMode",visibility:"hidden"}}},constructor:function(t,n){e.apply(this,arguments);if(!this._bAsync){if(this._aContent&&this._aContent.length==1){return this._aContent[0]}else{return this._aContent}}}});c.registerType=function(e,t){if(typeof e!=="string"){r.errorThrows("Invalid non-string Fragment type: '"+e+"'.",{suffix:"It will be ignored."});return}if(p[e]){o.warning("sap.ui.core.Fragment.registerType(): Fragment type '"+e+"' is already defined. Overriding this type now!")}p[e]=t};c.prototype._initCompositeSupport=function(e){if(!e){throw new Error("Settings must be set")}if(!(e.fragmentName||e.fragmentContent)){throw new Error("Please provide a fragment name")}if(e.oController){this.oController=e.oController}this._bAsync=e.async||false;this._sExplicitId=e.sId||e.id;this._sFragmentName=e.fragmentName;this.fnScopedRunWithOwner=e.containingView&&e.containingView.fnScopedRunWithOwner;if(!this.fnScopedRunWithOwner&&this._sOwnerId){var t=u.getComponentById(this._sOwnerId);this.fnScopedRunWithOwner=function(e){return t.runAsOwner(e)}}var n=c.getType(e.type);if(n){this._pContentPromise=n.init.apply(this,[e]);if(!this._pContentPromise){this._pContentPromise=Promise.resolve(this._aContent)}}else{throw new Error("No type for the fragment has been specified: "+e.type)}};c.prototype.getFragmentName=function(){return this._sFragmentName};c.prototype.getController=function(){return this.oController};c.byId=function(e,n){if(!(typeof e==="string"&&typeof n==="string")){r.errorThrows("sap.ui.core.Fragment.byId: two strings must be given as parameters, but are: "+e+" and "+n);return undefined}return t.getElementById(e+"--"+n)};c.createId=function(e,t){if(!(typeof e==="string"&&typeof t==="string")){r.errorThrows("sap.ui.core.Fragment.createId: two strings must be given as parameters, but are: "+e+" and "+t);return undefined}return e+"--"+t};c.prototype.createId=function(e){var t=this._sExplicitId?this._sExplicitId+"--"+e:e;if(this._oContainingView&&this._oContainingView!=this){t=this._oContainingView.createId(t)}return t};c.prototype.isSubView=function(){return true};sap.ui.fragment=function(e,t,n){var i;if(typeof t==="string"){i=t.toLowerCase()}else if(typeof t==="object"&&typeof t.fragmentName==="string"){i=t.fragmentName.toLowerCase()}else{i=""}o.info("Do not use deprecated factory function 'sap.ui."+i+"fragment'. Require 'sap/ui/core/Fragment' and use 'load()' instead","sap.ui."+i+"fragment",null,function(){return{type:"sap.ui."+i+"fragment",name:i?e+".fragment."+i:e}});return l(e,t,n)};function l(e,t,n){var i={};if(typeof e==="string"){i.fragmentName=e;i.oController=n;i.type=t}else if(typeof e==="object"){i=e;i.async=i.async===true?i.async:false;if(t){i.oController=t}if(i.async){var r=function(){var e=i.sOwnerId||i.containingView&&i.containingView._sOwnerId;var t=u.getComponentById(e);if(t){return t.runAsOwner(function(){return new c(i)})}return new c(i)};var a=c.getType(i.type);if(i.fragmentName&&i.fragmentContent){delete i.fragmentName}if(i.fragmentName&&typeof a.load=="function"){return new Promise(function(e,t){a.load(i).then(function(t){i.fragmentContent=t;e(r())}).catch(function(e){t(e)})})}else{return Promise.resolve(r())}}}else{o.error("sap.ui.fragment() must be called with Fragment name or config object as first parameter, but is: "+e)}return new c(i)}c.load=function(t){var n=Object.assign({},t);if(n.name&&n.definition){o.error("The properties 'name' and 'definition' shouldn't be provided at the same time. The fragment definition will be used instead of the name. Fragment name was: "+n.name);delete n.name}n.type=n.type||"XML";n.async=true;n.processingMode=n.processingMode||g.Sequential;n.fragmentName=n.fragmentName||n.name;n.fragmentContent=n.fragmentContent||n.definition;n.oController=n.controller;n.sOwnerId=e._sOwnerId;delete n.name;delete n.definition;delete n.controller;var i=l(n);return i.then(function(e){return e._pContentPromise})};c.getType=function(e){return p[e]};sap.ui.xmlfragment=function(e,t,n){if(typeof e==="string"){if(typeof t==="string"){return sap.ui.fragment({fragmentName:t,sId:e,type:"XML"},n)}else{return sap.ui.fragment(e,"XML",t)}}else{e.type="XML";return sap.ui.fragment(e,t)}};sap.ui.jsfragment=function(e,t,n){if(typeof e==="string"&&typeof t==="object"){if(t.createContent){m[e]=t;sap.ui.loader._.declareModule(e.replace(/\./g,"/")+".fragment.js")}else{return sap.ui.fragment(e,"JS",t)}}else if(typeof e==="string"&&t===undefined){return sap.ui.fragment(e,"JS")}else if(typeof e==="object"){e.type="JS";return sap.ui.fragment(e,t)}else if(arguments.length>=3){return sap.ui.fragment({id:e,fragmentName:t,type:"JS"},n)}else{o.error("sap.ui.jsfragment() was called with wrong parameter set: "+e+" + "+t)}};sap.ui.htmlfragment=function(e,t,n){if(typeof e==="string"){if(typeof t==="string"){return sap.ui.fragment({fragmentName:t,sId:e,type:"HTML"},n)}else{return sap.ui.fragment(e,"HTML",t)}}else{e.type="HTML";return sap.ui.fragment(e,t)}};c.registerType("XML",{load:function(e){return i.loadTemplatePromise(e.fragmentName,"fragment").then(function(e){return e})},init:function(n){this._aContent=[];if(n.fragmentContent){if(typeof n.fragmentContent==="string"){this._xContent=f.parse(n.fragmentContent).documentElement}else{this._xContent=n.fragmentContent}}else{o.warning("Synchronous loading of fragment, due to Fragment.init() call for '"+n.fragmentName+"'. Use 'sap/ui/core/Fragment' module with Fragment.load() instead.","SyncXHR",null,function(){return{type:"SyncXHR",name:"Fragment"}});this._xContent=i.loadTemplate(n.fragmentName,"fragment")}this._oContainingView=this._sExplicitId?this:n.containingView||this;if(this._oContainingView===this){this._oContainingView.oController=n.containingView&&n.containingView.oController||n.oController}this._sProcessingMode=n.processingMode;var a=this._oContainingView._fnSettingsPreprocessor;var s={fnRunWithPreprocessor:function(t){return e.runWithPreprocessors(t,{settings:a})}};var u=i.parseTemplatePromise(this._xContent,this,this._bAsync,s).then(function(e){this._aContent=e;if(this._aContent&&this._aContent.length&&n.objectBindings){this._aContent.forEach(function(e,i){if(e instanceof t){for(var r in n.objectBindings){e.bindObject(n.objectBindings[r])}}})}return this._aContent.length>1?this._aContent:this._aContent[0]}.bind(this));if(!this._bAsync){try{u.unwrap()}catch(e){r.errorThrows(this.getMetadata().getName()+": An Error occured during XML processing of '"+(n.fragmentName||n.fragmentContent)+"' with id '"+this.getId()+"'",{cause:e})}}return u}});c.registerType("JS",{load:function(e){var t=e.fragmentName.replace(/\./g,"/")+".fragment";return new Promise(function(e,n){sap.ui.require([t],function(t){e(t)},n)})},init:function(t){this._aContent=[];if(t.fragmentContent){s(this,t.fragmentContent)}else{(()=>{if(!m[t.fragmentName]){sap.ui.requireSync(t.fragmentName.replace(/\./g,"/")+".fragment")}})();s(this,m[t.fragmentName])}this._oContainingView=t.containingView||this;return e.runWithPreprocessors(function(){var e;if(this.fnScopedRunWithOwner){this.fnScopedRunWithOwner(function(){e=this.createContent(t.oController||this._oContainingView.oController)}.bind(this))}else{e=this.createContent(t.oController||this._oContainingView.oController)}if(e instanceof Promise){return e.then(function(e){this._aContent=this._aContent.concat(e);return this._aContent.length>1?this._aContent:this._aContent[0]}.bind(this))}else{return new Promise(function(t,n){this._aContent=this._aContent.concat(e);t(this._aContent.length>1?this._aContent:this._aContent[0])}.bind(this))}}.bind(this),{settings:this._oContainingView._fnSettingsPreprocessor})}});(function(){var t={};var i=function(e){var n=sap.ui.require.toUrl(e.replace(/\./g,"/"))+".fragment.html";var i=t[n];var r;if(!i){r=e.replace(/\./g,"/")+".fragment.html";i=a.loadResource(r);t[n]=i}return i};c.registerType("HTML",{load:function(e){var t=e.fragmentName.replace(/\./g,"/")+".fragment";return a.loadResource(t+".html",{async:true}).then(function(e){return e})},init:function(t){this._aContent=[];this.getContent=function(){return this._aContent};this.addContent=function(e){this._aContent.push(e)};this._oContainingView=t.containingView||this;this._sProcessingMode=t.processingMode;var r=t.fragmentContent||i(t.fragmentName);this._oTemplate=document.createElement("div");if(typeof r==="string"){this._oTemplate.innerHTML=r}else{var o=r;var a=document.createDocumentFragment();for(var s=0;s<o.length;s++){a.appendChild(o.item(s))}this._oTemplate.appendChild(a)}var f=this._oTemplate.getElementsByTagName("template")[0];var u=this.getMetadata().getAllProperties();if(f){var g=this;var m=f.getAttributeNames();for(var s=0;s<m.length-1;s++){var p=m[s];var c=n.convertAttributeToSettingName(p,g.getId());var l=f.getAttribute(p);var h=u[c];if(!t[c]){if(h){t[c]=n.convertValueToType(n.getPropertyDataType(h),l)}else if(sap.ui.core.mvc.HTMLView._mAllowedSettings[c]){t[c]=l}}}this._oTemplate=f}if(this._oTemplate.content){var d=this._oTemplate.content;this._oTemplate=document.createElement("div");this._oTemplate.appendChild(d)}return e.runWithPreprocessors(function(){if(this.fnScopedRunWithOwner){this.fnScopedRunWithOwner(function(){n.compile(this._oTemplate,this)}.bind(this))}else{n.compile(this._oTemplate,this)}var e=this.getContent();if(e&&e.length===1){this._aContent=[e[0]];return new Promise(function(e,t){e(this._aContent[0])}.bind(this))}}.bind(this),{settings:this._oContainingView._fnSettingsPreprocessor})}})})();return c});
//# sourceMappingURL=Fragment.js.map