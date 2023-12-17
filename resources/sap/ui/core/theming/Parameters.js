/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Lib","sap/ui/core/Theming","sap/ui/thirdparty/URI","../Element","sap/base/Log","sap/base/util/extend","sap/base/util/syncFetch","sap/ui/core/theming/ThemeManager","./ThemeHelper"],function(e,r,t,a,n,i,s,o,u){"use strict";var c=sap.ui.loader._.getSyncCallBehavior();var f={};var l=null;var m=null;var p=[];var d=[];var h=new t(sap.ui.require.toUrl(""),document.baseURI).origin();var g={};var v=/url[\s]*\('?"?([^\'")]*)'?"?\)/;var y=new URLSearchParams(window.location.search).get("sap-ui-xx-no-inline-theming-parameters")!=="true";function b(e,r){var a=v.exec(e);if(a){var n=new t(a[1]);if(n.is("relative")){var i=n.absoluteTo(r).normalize().toString();e="url('"+i+"')"}}return e}function A(e,r,t){for(var a in r){if(typeof e[a]==="undefined"){e[a]=b(r[a],t)}}return e}function U(e,r){if(typeof e["default"]!=="object"){e={default:e,scopes:{}}}l=l||{};l["default"]=l["default"]||{};l["scopes"]=l["scopes"]||{};A(l["default"],e["default"],r);if(typeof e["scopes"]==="object"){for(var t in e["scopes"]){l["scopes"][t]=l["scopes"][t]||{};A(l["scopes"][t],e["scopes"][t],r)}}}function w(e){document.querySelectorAll("link[id^=sap-ui-theme-]").forEach(function(r){e(r.getAttribute("id"))})}function T(e,r){var t=L(e);var a=u.checkAndRemoveStyle({id:e});if(!a&&!r){n.warning("Parameters have been requested but theme is not applied, yet.","sap.ui.core.theming.Parameters")}if(a&&y){var i=document.getElementById(e);var s=window.getComputedStyle(i).getPropertyValue("background-image");var o=/\(["']?data:text\/plain;utf-8,(.*?)['"]?\)$/i.exec(s);if(o&&o.length>=2){var c=o[1];if(c.charAt(0)!=="{"&&c.charAt(c.length-1)!=="}"){try{c=decodeURIComponent(c)}catch(e){n.warning("[FUTURE FATAL] Could not decode theme parameters URI from "+t.styleSheetUrl)}}try{var f=JSON.parse(c);U(f,t.themeBaseUrl);return true}catch(e){n.warning("[FUTURE FATAL] Could not parse theme parameters from "+t.styleSheetUrl+". Loading library-parameters.json as fallback solution.")}}}return r?a:false}function P(e){var r=L(e);if(!T(e)){var a=r.styleSheetUrl.replace(/\/(?:css_variables|library)([^\/.]*)\.(?:css|less)($|[?#])/,function(e,r,t){return"/library-parameters.json"+(t?t:"")});if(c===2){n.error("[nosync] Loading library-parameters.json ignored",a,"sap.ui.core.theming.Parameters");return}else if(c===1){n.error("[nosync] Loading library-parameters.json with sync XHR",a,"sap.ui.core.theming.Parameters")}var i=new t(r.themeBaseUrl).origin();var s=g[i];var o=[];if(s===undefined){if(a.startsWith(h)){o=[false,true]}else{o=[true,false]}}else{o=[s]}R(a,r.themeBaseUrl,o)}}function L(e){var r=document.getElementById(e);if(!r){n.warning("[FUTURE FATAL] Could not find stylesheet element with ID",e,"sap.ui.core.theming.Parameters");return undefined}var a=r.href;return{themeBaseUrl:new t(a).filename("").query("").toString(),styleSheetUrl:a}}function R(e,r,a){var i={Accept:s.ContentTypes.JSON};var o=a.shift();if(o){i["X-Requested-With"]="XMLHttpRequest"}function u(t){n.error("[FUTURE FATAL] Could not load theme parameters from: "+e,t);if(a.length>0){n.warning("Initial library-parameters.json request failed ('withCredentials="+o+"'; sUrl: '"+e+"').\n"+"Retrying with 'withCredentials="+!o+"'.","sap.ui.core.theming.Parameters");R(e,r,a)}}try{var c=s(e,{credentials:o?"include":"omit",headers:i});if(c.ok){var f=c.json();var l=new t(r).origin();g[l]=o;if(Array.isArray(f)){for(var m=0;m<f.length;m++){var p=f[m];U(p,r)}}else{U(f,r)}}else{throw new Error(c.statusText||c.status)}}catch(e){u(e)}}function E(e){if(!l){U({},"");w(function(r){if(e){if(!T(r,e)){p.push(r)}}else{P(r)}})}return l}function S(){var e=[];p.forEach(function(r){if(!T(r,true)){e.push(r)}});p=e}function j(){p.forEach(P);p=[]}f._addLibraryTheme=function(e){if(l){p.push("sap-ui-theme-"+e)}};function F(r){var t=r.async,a=E(t);if(r.scopeName){a=a["scopes"][r.scopeName]}else{a=a["default"]}var n=a[r.parameterName];if(!n){var i=r.parameterName.indexOf(":");if(i!=-1){var s=r.parameterName.substr(i+1);n=a[s]}}if(r.loadPendingParameters&&typeof n==="undefined"&&!t){var u=e.getAllInstancesRequiringCss();u.forEach(function(e){o._includeLibraryThemeAndEnsureThemeRoot(e)});j();n=F({parameterName:r.parameterName,scopeName:r.scopeName,loadPendingParameters:false})}return n}function I(e,r,t){var a=f.getActiveScopesFor(r,t);var n=a.flat().reduce(function(e,r){if(e.indexOf(r)===-1){e.push(r)}return e},[]);for(var i=0;i<n.length;i++){var s=n[i];var o=F({parameterName:e,scopeName:s,async:t});if(o){return o}}return F({parameterName:e,async:t})}f._getScopes=function(e,r){if(e&&!l){return}var t=E(r);var a=Object.keys(t["scopes"]);return a};f.getActiveScopesFor=function(e,r){var t=[];if(e instanceof a){var n=e.getDomRef();if(r){S()}else{j()}var i=this._getScopes(undefined,r);if(i.length){if(n){var s=function(e){var r=n.classList;return r&&r.contains(e)};while(n){var o=i.filter(s);if(o.length>0){t.push(o)}n=n.parentNode}}else{var u=function(r){return typeof e.hasStyleClass==="function"&&e.hasStyleClass(r)};while(e){var o=i.filter(u);if(o.length>0){t.push(o)}e=typeof e.getParent==="function"&&e.getParent()}}}}return t};f.get=function(e,t){var i,s,u,c,f;var l=function(e){return e.callback===s};if(!m){m=r.getTheme()}if(arguments.length===0){n.warning("Legacy variant usage of sap.ui.core.theming.Parameters.get API detected. Do not use the Parameters.get() API to retrieve ALL theming parameters, "+"as this will lead to unwanted synchronous requests. "+"Use the asynchronous API variant instead and retrieve a fixed set of parameters.","LegacyParametersGet","sap.ui.support",function(){return{type:"LegacyParametersGet"}});j();var p=E();return Object.assign({},p["default"])}if(!e){return undefined}if(e instanceof Object&&!Array.isArray(e)){if(!e.name){n.warning("[FUTURE FATAL] sap.ui.core.theming.Parameters.get was called with an object argument without one or more parameter names.");return undefined}t=e.scopeElement;s=e.callback;c=typeof e.name==="string"?[e.name]:e.name;u=true}if(!(e instanceof Object&&!Array.isArray(e))){if(typeof e==="string"){c=[e]}else{c=e}n.warning("Legacy variant usage of sap.ui.core.theming.Parameters.get API detected for parameter(s): '"+c.join(", ")+"'. This could lead to bad performance and additional synchronous XHRs, as parameters might not be available yet. Use asynchronous variant instead.","LegacyParametersGet","sap.ui.support",function(){return{type:"LegacyParametersGet"}})}var h,g;var v=function(e){if(t instanceof a){return I(e,t,u)}else{if(u){S()}return F({parameterName:e,loadPendingParameters:!u,async:u})}};g={};for(var y=0;y<c.length;y++){i=c[y];var b=v(i);if(!u||b){g[i]=b}}if(u&&s&&Object.keys(g).length!==c.length){if(!o.themeLoaded){h=function(){o._detachThemeApplied(h);var r=this.get({name:e.name,scopeElement:e.scopeElement});if(!r||typeof r==="object"&&Object.keys(r).length!==c.length){n.error("[FUTURE FATAL] One or more parameters could not be found.","sap.ui.core.theming.Parameters")}s(r);d.splice(d.findIndex(l),1)}.bind(this);f=d.findIndex(l);if(f>=0){o._detachThemeApplied(d[f].eventHandler);d[f].eventHandler=h}else{d.push({callback:s,eventHandler:h})}o._attachThemeApplied(h);return undefined}else{n.error("[FUTURE FATAL] One or more parameters could not be found.","sap.ui.core.theming.Parameters")}}return c.length===1?g[c[0]]:g};f._setOrLoadParameters=function(e){l={default:{},scopes:{}};m=r.getTheme();w(function(r){var t=r.substr(13);if(e[t]){i(l["default"],e[t])}else{P(r)}})};f.reset=function(){this._reset.apply(this,arguments)};f._reset=function(){var e=arguments[0]===true;if(!e||r.getTheme()!==m){m=r.getTheme();p=[];l=null}};f._getThemeImage=function(e,r){e=e||"sapUiGlobalLogo";var t=f.get(e);if(t){var a=v.exec(t);if(a){t=a[1]}else if(t==="''"||t==="none"){t=null}}if(r&&!t){return sap.ui.require.toUrl("sap/ui/core/themes/base/img/1x1.gif")}return t};return f},true);
//# sourceMappingURL=Parameters.js.map