/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Component"],function(e,r){"use strict";var n={};var o={};o._sExtensionProvider=null;o.registerExtensionProvider=function(e){o._sExtensionProvider=e};o.getControllerExtensions=function(n,s,l,u){var a={customizingControllerNames:[],providerControllers:[]};var v=r.getComponentById(s);if(v&&v.getLocalId){l=v.getLocalId(l)||l}var f=t(n,v,l);a.customizingControllerNames=f;if(u){if(o._sExtensionProvider){return i(u).then(function(e){return e.getControllerExtensions(n,s,u,l)}).then(function(e){a.providerControllers=e||[];return a})}else{return Promise.resolve(a)}}else{if(o._sExtensionProvider){var c=i();if(c){var d=c.getControllerExtensions(n,s,u,l);if(d&&Array.isArray(d)){a.providerControllers=d}else{e.error("[FUTURE FATAL] Controller Extension Provider: Error in ExtensionProvider.getControllerExtensions: "+o._sExtensionProvider+" - no valid extensions returned. Return value must be an array of ControllerExtensions.")}}}return a}};function t(e,n,o){var t=[];var i=r.getCustomizing(n,{type:"sap.ui.controllerExtensions",name:e+"#"+o});var s=[];if(i){s.push(i)}else{var l=r.getCustomizing(n,{type:"sap.ui.controllerExtensions",name:e});if(l){s.push(l)}}for(var u=0;u<s.length;u++){var a=s[u];if(a){var v=typeof a==="string"?a:a.controllerName;t=t.concat(a.controllerNames||[]);if(v){t.unshift(v)}}}return t}function i(e){var r=o._sExtensionProvider.replace(/\./g,"/"),t=n[r];if(t){return e?Promise.resolve(t):t}if(r){if(e){return new Promise(function(e,o){sap.ui.require([r],function(o){t=new o;n[r]=t;e(t)},o)})}else{var i=sap.ui.requireSync(r);t=new i;n[r]=t;return t}}else{return e?Promise.resolve():undefined}}return o});
//# sourceMappingURL=ControllerExtensionProvider.js.map