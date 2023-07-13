/*
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Manifest","./ComponentMetadata","./Element","sap/base/config","sap/base/util/extend","sap/base/util/deepExtend","sap/base/util/merge","sap/ui/base/ManagedObject","sap/ui/base/ManagedObjectRegistry","sap/ui/core/Lib","sap/ui/core/ResizeHandler","sap/ui/thirdparty/URI","sap/ui/performance/trace/Interaction","sap/base/assert","sap/base/Log","sap/base/util/ObjectPath","sap/base/util/UriParameters","sap/base/util/isPlainObject","sap/base/util/LoaderExtensions","sap/base/strings/camelize","sap/ui/core/_UrlResolver","sap/ui/VersionInfo","sap/ui/core/mvc/ViewType","sap/ui/core/Configuration"],function(e,t,n,i,r,o,a,s,u,c,f,p,d,l,g,m,h,v,y,M,_,C,b,w){"use strict";var S={lazy:"lazy",eager:"eager",waitFor:"waitFor"};function O(e){return{name:e,type:i.Type.String,external:true}}function E(e){["sap-client","sap-server"].forEach(function(t){if(!e.hasSearch(t)){var n=i.get(O(M(t)));if(n){e.addSearch(t,n)}}})}function A(e,t,n,i){if(n){for(var r in e){if(!t[r]&&n[r]&&n[r].uri){t[r]=i}}}}function T(e,n,i,r){var a=n.getEntry(i);if(a!==undefined&&!v(a)){return a}var s,u;if(r&&(s=e.getParent())instanceof t){u=s._getManifestEntry(i,r)}if(u||a){a=o({},u,a)}return a}function U(e,t){var n=Object.create(Object.getPrototypeOf(e));n._oMetadata=e;n._oManifest=t;for(var i in e){if(!/^(getManifest|_getManifest|getManifestObject|getManifestEntry|_getManifestEntry|getMetadataVersion)$/.test(i)&&typeof e[i]==="function"){n[i]=e[i].bind(e)}}n.getManifest=function(){return this._getManifest()};n.getManifestEntry=function(e,t){return this._getManifestEntry(e,t)};n._getManifest=function(){return t&&t.getJson()};n.getManifestObject=function(){return t};n._getManifestEntry=function(n,i){return T(e,t,n,i)};n.getMetadataVersion=function(){return 2};return n}var k=s.extend("sap.ui.core.Component",{constructor:function(e,t){var n=Array.prototype.slice.call(arguments);if(typeof e!=="string"){t=e;e=undefined}if(t&&typeof t._metadataProxy==="object"){this._oMetadataProxy=t._metadataProxy;this._oManifest=t._metadataProxy._oManifest;delete t._metadataProxy;this.getMetadata=function(){return this._oMetadataProxy}}if(t&&typeof t._cacheTokens==="object"){this._mCacheTokens=t._cacheTokens;delete t._cacheTokens}if(t&&Array.isArray(t._activeTerminologies)){this._aActiveTerminologies=t._activeTerminologies;delete t._activeTerminologies}if(t&&typeof t._manifestModels==="object"){this._mManifestModels=t._manifestModels;delete t._manifestModels}else{this._mManifestModels={}}this._mServices={};this._oKeepAliveConfig=this.getManifestEntry("/sap.ui5/keepAlive");if(this._oKeepAliveConfig){this._oKeepAliveConfig.supported=!!this._oKeepAliveConfig.supported}this._bIsActive=true;this._aDestroyables=[];s.apply(this,n)},metadata:{stereotype:"component",abstract:true,specialSettings:{componentData:"any"},version:"0.0",includes:[],dependencies:{libs:[],components:[],ui5version:""},config:{},customizing:{},library:"sap.ui.core"}},t);u.apply(k,{onDeregister:function(e){P(function(e){if(e._sapui_candidateForDestroy){g.debug("destroying dangling template "+e+" when destroying the owner component");e.destroy()}},e)}});function P(e,t){n.registry.forEach(function(n,i){var r=k.getOwnerIdFor(n);if(r===t&&!n.getParent()){e(n,i)}})}function j(e){var t,n;if(!w.getDisableCustomizing()){if(typeof e==="string"){n=e}else if(e&&typeof e.isA==="function"&&!e.isA("sap.ui.core.Component")){n=k.getOwnerIdFor(e)}else{t=e}if(n){t=k.get(n)}if(t){if(t.getExtensionComponent){t=t.getExtensionComponent();if(!t){throw new Error("getExtensionComponent() must return an instance.")}}}}return t}k.getCustomizing=function(e,t){var n=t.type,i=t.name?"/"+t.name:"",r="/sap.ui5/extends/extensions/"+n+i;if(n==="sap.ui.viewExtensions"){r+="/"+t.extensionName}var o=j(e);return o?o._getManifestEntry(r,true):undefined};k.prototype.getManifest=function(){if(!this._oManifest){return this.getMetadata()._getManifest()}else{return this._oManifest.getJson()}};k.prototype.getManifestEntry=function(e){return this._getManifestEntry(e)};k.prototype._getManifestEntry=function(e,t){if(!this._oManifest){return this.getMetadata()._getManifestEntry(e,t)}else{return T(this.getMetadata(),this._oManifest,e,t)}};k.prototype.getManifestObject=function(){if(!this._oManifest){return this.getMetadata().getManifestObject()}else{return this._oManifest}};k.prototype._isVariant=function(){if(this._oManifest){var e=this.getManifestEntry("/sap.ui5/componentName");return e&&e!==this.getManifestEntry("/sap.app/id")}else{return false}};k.activateCustomizing=function(e){};k.deactivateCustomizing=function(e){};k.getOwnerIdFor=function(e){l(e instanceof s,"oObject must be given and must be a ManagedObject");var t=e instanceof s&&e._sOwnerId;return t||undefined};k.getOwnerComponentFor=function(e){return k.get(k.getOwnerIdFor(e))};k.prototype.runAsOwner=function(e){if(!this.isActive()){throw new Error("Execute 'runAsOwner' on an inactive owner component is not supported. Component: '"+this.getMetadata().getName()+"' with id '"+this.getId()+"'.")}return s.runWithOwner(e,this.getId())};k.prototype.getInterface=function(){return this};k.prototype._initCompositeSupport=function(e){this.oComponentData=e&&e.componentData;if(this._oManifest){this._oManifest.init(this)}else{this.getMetadata().init()}if(this._isVariant()){var t=this._oManifest.getEntry("/sap.app/id");if(t){x(t,this._oManifest.resolveUri("./","manifest"))}}this.initComponentModels();if(this.onWindowError){this._fnWindowErrorHandler=function(e){var t=e.originalEvent;this.onWindowError(t.message,t.filename,t.lineno)}.bind(this);window.addEventListener("error",this._fnWindowErrorHandler)}if(this.onWindowBeforeUnload){this._fnWindowBeforeUnloadHandler=function(e){var t=this.onWindowBeforeUnload.apply(this,arguments);if(typeof t==="string"){e.returnValue=t;e.preventDefault();return t}}.bind(this);window.addEventListener("beforeunload",this._fnWindowBeforeUnloadHandler)}if(this.onWindowUnload){this._fnWindowUnloadHandler=this.onWindowUnload.bind(this);window.addEventListener("unload",this._fnWindowUnloadHandler)}};k.prototype._getDestroyables=function(){if(!this._aDestroyables){g.error("Mandatory super constructor not called for Component: '"+this.getManifestObject().getComponentName()+"'.",null,"sap.ui.support",function(){return{type:"missingSuperConstructor"}});this._aDestroyables=[]}return this._aDestroyables};k.prototype.destroy=function(){var e,t=false;for(var n in this._mServices){if(this._mServices[n].instance){this._mServices[n].instance.destroy()}}delete this._mServices;for(var i in this._mManifestModels){this._mManifestModels[i].destroy()}delete this._mManifestModels;if(this._fnWindowErrorHandler){window.removeEventListener("error",this._fnWindowErrorHandler);delete this._fnWindowErrorHandler}if(this._fnWindowBeforeUnloadHandler){window.removeEventListener("beforeunload",this._fnWindowBeforeUnloadHandler);delete this._fnWindowBeforeUnloadHandler}if(this._fnWindowUnloadHandler){window.removeEventListener("unload",this._fnWindowUnloadHandler);delete this._fnWindowUnloadHandler}if(this._oEventBus){this._oEventBus.destroy();delete this._oEventBus}function r(e){if(e&&!e._bIsBeingDestroyed){e.destroy()}}function o(e){t=true}var a=this._getDestroyables();for(var u=0;u<a.length;u++){a[u]=a[u].then(r,o)}if(a.length>0){e=Promise.all(a).then(function(){if(t){P(function(e){e.destroy()},this.getId())}}.bind(this))}s.prototype.destroy.apply(this,arguments);var c=sap.ui.require("sap/ui/core/message/MessageManager");if(c){c.unregisterObject(this)}if(this._oManifest){this._oManifest.exit(this);delete this._oManifest}else{this.getMetadata().exit()}return e};k.prototype.getComponentData=function(){return this.oComponentData};k.prototype.getEventBus=function(){if(!this._oEventBus){var e=sap.ui.require("sap/ui/core/EventBus");if(!e){var t=this.getMetadata().getName();g.warning("Synchronous loading of EventBus, due to #getEventBus() call on Component '"+t+"'.","SyncXHR",null,function(){return{type:"SyncXHR",name:t}});e=sap.ui.requireSync("sap/ui/core/EventBus")}this._oEventBus=new e;if(!this.isActive()){this._oEventBus.suspend()}}return this._oEventBus};k.prototype.isActive=function(){return this._bIsActive};k.prototype.initComponentModels=function(){var e=this.getMetadata();if(e.isBaseClass()){return}var t=this._getManifestEntry("/sap.app/dataSources",true)||{};var n=this._getManifestEntry("/sap.ui5/models",true)||{};this._initComponentModels(n,t,this._mCacheTokens)};k.prototype._initComponentModels=function(e,t,n){var i=this.getManifestObject().getComponentName();var r=k._findManifestModelClasses({models:e,dataSources:t,componentName:i});k._loadManifestModelClasses(r,i);var o=k._createManifestModelConfigurations({models:r,dataSources:t,component:this,mergeParent:true,cacheTokens:n,activeTerminologies:this.getActiveTerminologies()}),a={},s;if(!o){return}for(s in o){if(!this._mManifestModels[s]){a[s]=o[s]}}var u=k._createManifestModels(a,i);for(s in u){this._mManifestModels[s]=u[s]}for(s in this._mManifestModels){var c=this._mManifestModels[s];this.setModel(c,s||undefined)}};k.prototype.getService=function(e){if(!this._mServices[e]){this._mServices[e]={};this._mServices[e].promise=new Promise(function(t,n){sap.ui.require(["sap/ui/core/service/ServiceFactoryRegistry"],function(i){var r=this._getManifestEntry("/sap.ui5/services/"+e,true);var o=r&&r.factoryName;if(!o){n(new Error("Service "+e+" not declared!"));return}var a=i.get(o);if(a){a.createInstance({scopeObject:this,scopeType:"component",settings:r.settings||{}}).then(function(i){if(!this.bIsDestroyed){this._mServices[e].instance=i;this._mServices[e].interface=i.getInterface();t(this._mServices[e].interface)}else{n(new Error("Service "+e+" could not be loaded as its Component was destroyed."))}}.bind(this)).catch(n)}else{var s="The ServiceFactory "+o+" for Service "+e+" not found in ServiceFactoryRegistry!";var u=this._getManifestEntry("/sap.ui5/services/"+e+"/optional",true);if(!u){g.error(s)}n(new Error(s))}}.bind(this),n)}.bind(this))}return this._mServices[e].promise};function D(e,t){var n=e._getManifestEntry("/sap.ui5/services",true);var i=t?[]:null;if(!n){return i}var r=Object.keys(n);if(!t&&r.some(function(e){return n[e].startup===S.waitFor})){throw new Error('The specified component "'+e.getMetadata().getName()+'" cannot be loaded in sync mode since it has some services declared with "startup" set to "waitFor"')}return r.reduce(function(t,i){if(n[i].lazy===false||n[i].startup===S.waitFor||n[i].startup===S.eager){var r=e.getService(i);if(n[i].startup===S.waitFor){t.push(r)}}return t},i)}k.prototype.createComponent=function(e){l(typeof e==="string"&&e||typeof e==="object"&&typeof e.usage==="string"&&e.usage,"vUsage either must be a non-empty string or an object with a non-empty usage id");var t={async:true};if(e){var n;if(typeof e==="object"){n=e.usage;["id","async","settings","componentData"].forEach(function(n){if(e[n]!==undefined){t[n]=e[n]}})}else if(typeof e==="string"){n=e}t=this._enhanceWithUsageConfig(n,t)}var i=k._createComponent(t,this);if(i instanceof Promise){this.registerForDestroy(i)}return i};k.prototype._enhanceWithUsageConfig=function(e,t){var n=this.getManifestEntry("/sap.ui5/componentUsages/"+e);if(!n){throw new Error('Component usage "'+e+'" not declared in Component "'+this.getManifestObject().getComponentName()+'"!')}if(n.activeTerminologies){throw new Error("Terminologies vector can't be used in component usages")}return o(n,t)};k.prototype.getActiveTerminologies=function(){return this._aActiveTerminologies?this._aActiveTerminologies.slice():undefined};k._createComponent=function(e,t){function n(){if(e.async===true){return k.create(e)}else{return sap.ui.component(e)}}if(t){if(!t.isActive()){throw new Error("Creation of component '"+e.name+"' is not possible due to inactive owner component '"+t.getId()+"'")}return t.runAsOwner(n)}else{return n()}};k._applyCacheToken=function(e,t,n){var r=n?"Model":"DataSource";var o=n?'["sap.ui5"]["models"]':'["sap.app"]["dataSources"]';var a=n&&n["sap-language"]||e.search(true)["sap-language"];var s=n&&n["sap-client"]||e.search(true)["sap-client"];if(!a){g.warning('Component Manifest: Ignoring provided "sap-context-token='+t.cacheToken+'" for '+r+' "'+t.dataSource+'" ('+e.toString()+"). "+'Missing "sap-language" URI parameter',o+'["'+t.dataSource+'"]',t.componentName);return}if(!s){g.warning('Component Manifest: Ignoring provided "sap-context-token='+t.cacheToken+'" for '+r+' "'+t.dataSource+'" ('+e.toString()+"). "+'Missing "sap-client" URI parameter',o+'["'+t.dataSource+'"]',t.componentName);return}var u=i.get(O("sapClient"));if(s!==u){g.warning('Component Manifest: Ignoring provided "sap-context-token='+t.cacheToken+'" for '+r+' "'+t.dataSource+'" ('+e.toString()+"). "+'URI parameter "sap-client='+s+'" must be identical with configuration "sap-client='+u+'"',o+'["'+t.dataSource+'"]',t.componentName);return}if(e.hasQuery("sap-context-token")&&!e.hasQuery("sap-context-token",t.cacheToken)||n&&n["sap-context-token"]&&n["sap-context-token"]!==t.cacheToken){g.warning('Component Manifest: Overriding existing "sap-context-token='+(e.query(true)["sap-context-token"]||n["sap-context-token"])+'" with provided value "'+t.cacheToken+'" for '+r+' "'+t.dataSource+'" ('+e.toString()+").",o+'["'+t.dataSource+'"]',t.componentName)}if(n){if(e.hasQuery("sap-context-token")){g.warning('Component Manifest: Move existing "sap-context-token='+e.query(true)["sap-context-token"]+'" to metadataUrlParams for '+r+' "'+t.dataSource+'" ('+e.toString()+").",o+'["'+t.dataSource+'"]',t.componentName)}e.removeQuery("sap-context-token");n["sap-context-token"]=t.cacheToken}else{e.setQuery("sap-context-token",t.cacheToken)}};k._findManifestModelClasses=function(e){if(!e.models){return null}var t={models:e.models,dataSources:e.dataSources||{},origin:{dataSources:{},models:{}}};var n=e.componentName;var i={};for(var r in t.models){var o=t.models[r];if(typeof o==="string"){o={dataSource:o}}if(o.dataSource){var a=t.dataSources&&t.dataSources[o.dataSource];if(typeof a==="object"){if(a.type===undefined){a.type="OData"}var s;if(!o.type){switch(a.type){case"OData":s=a.settings&&a.settings.odataVersion;if(s==="4.0"){o.type="sap.ui.model.odata.v4.ODataModel"}else if(!s||s==="2.0"){o.type="sap.ui.model.odata.v2.ODataModel"}else{g.error('Component Manifest: Provided OData version "'+s+'" in '+'dataSource "'+o.dataSource+'" for model "'+r+'" is unknown. '+'Falling back to default model type "sap.ui.model.odata.v2.ODataModel".','["sap.app"]["dataSources"]["'+o.dataSource+'"]',n);o.type="sap.ui.model.odata.v2.ODataModel"}break;case"JSON":o.type="sap.ui.model.json.JSONModel";break;case"XML":o.type="sap.ui.model.xml.XMLModel";break;default:}}}}if(!o.type){g.error('Component Manifest: Missing "type" for model "'+r+'"','["sap.ui5"]["models"]["'+r+'"]',n);continue}i[r]=o}return i};k._createManifestModelConfigurations=function(e){var n=e.component;var r=e.manifest||n.getManifestObject();var o=e.mergeParent;var a=e.cacheTokens||{};var s=n?n.getMetadata().getComponentName():r.getComponentName();var u=w;var c=e.activeTerminologies;if(!e.models){return null}var f={models:e.models,dataSources:e.dataSources||{},origin:{dataSources:{},models:{}}};if(n&&o){var d=n.getMetadata();while(d instanceof t){var l=d.getManifestObject();var h=d._getManifestEntry("/sap.app/dataSources");A(f.dataSources,f.origin.dataSources,h,l);var v=d._getManifestEntry("/sap.ui5/models");A(f.models,f.origin.models,v,l);d=d.getParent()}}var y={};for(var M in f.models){var C=f.models[M];var b=sap.ui.require(C.type.replace(/\./g,"/"));if(!b){b=m.get(C.type)}if(!b){g.error('Component Manifest: Class "'+C.type+'" for model "'+M+'" could not be found','["sap.ui5"]["models"]["'+M+'"]',s);continue}var S=b.getMetadata();var T=S.isA("sap.ui.model.odata.ODataModel");var U=S.isA("sap.ui.model.odata.v2.ODataModel");var P=S.isA("sap.ui.model.odata.v4.ODataModel");var j=S.isA("sap.ui.model.resource.ResourceModel");var D=false;var I=null;if(typeof C==="string"){C={dataSource:C}}if(C.dataSource){var N=f.dataSources&&f.dataSources[C.dataSource];if(typeof N==="object"){if(N.type===undefined){N.type="OData"}if(P&&N.settings&&N.settings.odataVersion){C.settings=C.settings||{};C.settings.odataVersion=N.settings.odataVersion}if(!C.uri){C.uri=N.uri;D=true}if(N.type==="OData"&&N.settings){C.settings=C.settings||{};if(typeof N.settings.maxAge==="number"){C.settings.headers=C.settings.headers||{};C.settings.headers["Cache-Control"]="max-age="+N.settings.maxAge}if("ignoreAnnotationsFromMetadata"in N.settings){C.settings.ignoreAnnotationsFromMetadata=N.settings.ignoreAnnotationsFromMetadata}if(N.settings.annotations){var x=N.settings.annotations;for(var R=0;R<x.length;R++){var B=x[R];var F=f.dataSources[B];if(!F){g.error('Component Manifest: ODataAnnotation "'+B+'" for dataSource "'+C.dataSource+'" could not be found in manifest','["sap.app"]["dataSources"]["'+B+'"]',s);continue}if(F.type!=="ODataAnnotation"){g.error('Component Manifest: dataSource "'+B+'" was expected to have type "ODataAnnotation" but was "'+F.type+'"','["sap.app"]["dataSources"]["'+B+'"]',s);continue}if(!F.uri){g.error('Component Manifest: Missing "uri" for ODataAnnotation "'+B+'"','["sap.app"]["dataSources"]["'+B+'"]',s);continue}var H=new p(F.uri);if(U||P){var L=w.getSAPLogonLanguage();if(!H.hasQuery("sap-language")&&L){H.setQuery("sap-language",L)}L=i.get(O("sapClient"));if(!H.hasQuery("sap-client")&&L){H.setQuery("sap-client",L)}var W=a.dataSources&&a.dataSources[F.uri];if(W){k._applyCacheToken(H,{cacheToken:W,componentName:s,dataSource:B})}}var q=f.origin.dataSources[x[R]]||r;var V=q.resolveUri(H.toString());C.settings.annotationURI=C.settings.annotationURI||[];C.settings.annotationURI.push(V)}}}}else{g.error('Component Manifest: dataSource "'+C.dataSource+'" for model "'+M+'" not found or invalid','["sap.app"]["dataSources"]["'+C.dataSource+'"]',s);continue}}if(T&&(!C.settings||C.settings.json===undefined)){C.settings=C.settings||{};C.settings.json=true}if(j){if(C.uri&&C.settings&&C.settings.bundleUrl){g.warning("Defining both model uri and bundleUrl is not supported. Only model uri will be resolved.")}if(!C.uri&&C.settings&&C.settings.terminologies){if(C.bundleUrl||C.settings.bundleUrl){C.uri=C.bundleUrl||C.settings.bundleUrl;delete C.settings.bundleUrl}}}if(C.uri){var z=new p(C.uri);var J=(D?f.origin.dataSources[C.dataSource]:f.origin.models[M])||r;z=new p(J.resolveUri(C.uri));if(C.dataSource){E(z);if(U||P){var Q=f.dataSources&&f.dataSources[C.dataSource];var K=a.dataSources&&a.dataSources[Q.uri];I=C.settings&&C.settings.metadataUrlParams;var X=(!I||typeof I["sap-language"]==="undefined")&&!z.hasQuery("sap-language")&&u.getSAPLogonLanguage();if(X||K){C.settings=C.settings||{};I=C.settings.metadataUrlParams=C.settings.metadataUrlParams||{};if(X){I["sap-language"]=u.getSAPLogonLanguage()}}if(K){k._applyCacheToken(z,{cacheToken:K,componentName:s,dataSource:M},I)}}}C.uri=z.toString()}if(C.uriSettingName===undefined){if(T||U||P){C.uriSettingName="serviceUrl"}else if(j){C.uriSettingName="bundleUrl"}else{}}var $;var G;if(n){G=n.getComponentData()}else{G=e.componentData}$=G&&G.startupParameters&&G.startupParameters["sap-system"];if(!$){$=i.get(O("sapSystem"))}var Y=false;var Z;if($&&(T||U)){Y=true;Z=sap.ui.require("sap/ui/model/odata/ODataUtils")}if(C.uri){if(Y){C.preOriginBaseUri=C.uri.split("?")[0];C.uri=Z.setOrigin(C.uri,{alias:$});C.postOriginBaseUri=C.uri.split("?")[0]}if(C.uriSettingName!==undefined){C.settings=C.settings||{};if(!C.settings[C.uriSettingName]){C.settings[C.uriSettingName]=C.uri}}else if(C.settings){C.settings=[C.uri,C.settings]}else{C.settings=[C.uri]}}else if(Y&&C.uriSettingName!==undefined&&C.settings&&C.settings[C.uriSettingName]){C.preOriginBaseUri=C.settings[C.uriSettingName].split("?")[0];C.settings[C.uriSettingName]=Z.setOrigin(C.settings[C.uriSettingName],{alias:$});C.postOriginUri=C.settings[C.uriSettingName].split("?")[0]}if(Y&&C.settings&&C.settings.annotationURI){var ee=[].concat(C.settings.annotationURI);var te=[];for(var ne=0;ne<ee.length;ne++){te.push(Z.setAnnotationOrigin(ee[ne],{alias:$,preOriginBaseUri:C.preOriginBaseUri,postOriginBaseUri:C.postOriginBaseUri}))}C.settings.annotationURI=te}if(j&&C.settings){if(c){C.settings.activeTerminologies=c}_._processResourceConfiguration(C.settings,{alreadyResolvedOnRoot:true,baseURI:r._oBaseUri,manifestBaseURI:r._oManifestBaseUri,relativeTo:undefined})}if(C.settings&&!Array.isArray(C.settings)){C.settings=[C.settings]}y[M]=C}if(r.getEntry("/sap.ui5/commands")||n&&n._getManifestEntry("/sap.ui5/commands",true)){y["$cmd"]={type:"sap.ui.model.json.JSONModel"}}return y};k._loadManifestModelClasses=function(e,t){for(var n in e){var i=e[n];try{sap.ui.requireSync(i.type.replace(/\./g,"/"))}catch(e){g.error('Component Manifest: Class "'+i.type+'" for model "'+n+'" could not be loaded. '+e,'["sap.ui5"]["models"]["'+n+'"]',t);continue}}};k._createManifestModels=function(e,t){var n={};for(var i in e){var r=e[i];var o=m.get(r.type)||sap.ui.require(r.type.replace(/\./g,"/"));var a=[null].concat(r.settings||[]);var s=o.bind.apply(o,a);var u=new s;n[i]=u}return n};function I(e){var t={afterManifest:{},afterPreload:{}};var n=a({},e.getEntry("/sap.app/dataSources"));var i=a({},e.getEntry("/sap.ui5/models"));var r=e.getComponentName();var o=k._findManifestModelClasses({models:i,dataSources:n,componentName:r});var s=h.fromQuery(window.location.search).get("sap-ui-xx-preload-component-models-"+e.getComponentName());var u=s&&s.split(",");for(var c in o){var f=o[c];if(!f.preload&&u&&u.indexOf(c)>-1){f.preload=true;g.warning('FOR TESTING ONLY!!! Activating preload for model "'+c+'" ('+f.type+")",r,"sap.ui.core.Component")}if(f.type==="sap.ui.model.resource.ResourceModel"&&(!f.settings||f.settings.async!==true)){t.afterPreload[c]=f}else if(f.preload){if(sap.ui.loader._.getModuleState(f.type.replace(/\./g,"/")+".js")){t.afterManifest[c]=f}else{g.warning('Can not preload model "'+c+'" as required class has not been loaded: "'+f.type+'"',r,"sap.ui.core.Component")}}}return t}function N(e){return sap.ui.require.toUrl(e.replace(/\./g,"/")+"/manifest.json")}function x(e,t){y.registerResourcePath(e.replace(/\./g,"/"),t)}function R(e){var n=[];var i=[];function r(e){if(!e._oManifest){var o=e.getComponentName();var a=N(o);var s=y.loadResource({url:a,dataType:"json",async:true}).catch(function(e){g.error('Failed to load component manifest from "'+a+'" (component '+o+")! Reason: "+e);return{}});n.push(s);i.push(e)}var u=e.getParent();if(u&&u instanceof t&&!u.isBaseClass()){r(u)}}r(e);return Promise.all(n).then(function(e){for(var t=0;t<e.length;t++){if(e[t]){i[t]._applyManifest(e[t])}}})}k._fnLoadComponentCallback=null;var B=[];Object.defineProperty(k,"_fnOnInstanceCreated",{get:function(){return B[0]},set:function(e){if(typeof e==="function"){B.push(e)}else{B=[]}}});k._fnPreprocessManifest=null;k.create=function(e){if(e==null||typeof e!=="object"){throw new TypeError("Component.create() must be called with a configuration object.")}var t=a({},e);t.async=true;if(t.manifest===undefined){t.manifest=true}return F(t)};sap.ui.component=function(e){if(!e){throw new Error("sap.ui.component cannot be called without parameter!")}var t=function(e){return{type:"sap.ui.component",name:e}};if(typeof e==="string"){g.warning("Do not use deprecated function 'sap.ui.component' ("+e+") + for Component instance lookup. "+"Use 'Component.get' instead","sap.ui.component",null,t.bind(null,e));return k.get(e)}if(e.async){g.info("Do not use deprecated factory function 'sap.ui.component' ("+e["name"]+"). "+"Use 'Component.create' instead","sap.ui.component",null,t.bind(null,e["name"]))}else{g.warning("Do not use synchronous component creation ("+e["name"]+")! "+"Use the new asynchronous factory 'Component.create' instead","sap.ui.component",null,t.bind(null,e["name"]))}return F(e,true)};function F(e,n){var i=k.get(s._sOwnerId);if(Array.isArray(e.activeTerminologies)&&e.activeTerminologies.length&&Array.isArray(w.getActiveTerminologies())&&w.getActiveTerminologies().length){if(JSON.stringify(e.activeTerminologies)!==JSON.stringify(w.getActiveTerminologies())){g.warning(n?"sap.ui.component: ":"Component.create: "+"The 'activeTerminolgies' passed to the component factory differ from the ones defined on the global 'sap.ui.core.Configuration#getActiveTerminologies';"+"This might lead to inconsistencies; ResourceModels that are not defined in the manifest and created by the component will use the globally configured terminologies.")}}var o=e.activeTerminologies||i&&i.getActiveTerminologies()||w.getActiveTerminologies();if(!e.asyncHints||!e.asyncHints.cacheTokens){var a=i&&i._mCacheTokens;if(typeof a==="object"){e.asyncHints=e.asyncHints||{};e.asyncHints.cacheTokens=a}}function u(e,t){return B.map(function(n){return n(e,t)})}function c(e,t){if(t.async){var n=e.rootControlLoaded?e.rootControlLoaded():Promise.resolve();var i=u(e,t);i.push(n);return Promise.all(i)}else{u(e,t)}return e}function f(t){if(n&&t.getMetadata().isA("sap.ui.core.IAsyncContentCreation")){throw new Error("Do not use deprecated factory function 'sap.ui.component' in combination with IAsyncContentCreation ("+e["name"]+"). "+"Use 'Component.create' instead")}var i=e.name,a=e.id,s=e.componentData,u=i+".Component",f=e.settings;var p=new t(r({},f,{id:a,componentData:s,_cacheTokens:e.asyncHints&&e.asyncHints.cacheTokens,_activeTerminologies:o}));l(p instanceof k,'The specified component "'+u+'" must be an instance of sap.ui.core.Component!');g.info("Component instance Id = "+p.getId());var d=p.getMetadata()._getManifestEntry("/sap.ui5/handleValidation");if(d!==undefined||e.handleValidation){var m=sap.ui.require("sap/ui/core/message/MessageManager");if(m){m.registerObject(p,d===undefined?e.handleValidation:d)}else{sap.ui.require(["sap/ui/core/message/MessageManager"],function(t){if(!p.isDestroyed()){t.registerObject(p,d===undefined?e.handleValidation:d)}})}}var h=D(p,e.async);if(e.async){return c(p,e).then(function(){return Promise.all(h)}).then(function(){return p})}else{return c(p,e)}}var p=H(e,{failOnError:true,createModels:true,waitFor:e.asyncHints&&e.asyncHints.waitFor,activeTerminologies:o});if(e.async){var d=s._sOwnerId;return p.then(function(e){var n=function(e){var i=e.getParent();var r=Promise.resolve();if(i instanceof t){r=r.then(function(){return n(i)})}return r.then(function(){return e.getManifestObject().loadDependenciesAndIncludes(true)})};return n(e.getMetadata()).then(function(){return s.runWithOwner(function(){return f(e)},d)})})}else{return f(p)}}k.load=function(e){var t=a({},e);t.async=true;if(t.manifest===undefined){t.manifest=true}return H(t,{preloadOnly:t.asyncHints&&t.asyncHints.preloadOnly})};k.get=function(e){return k.registry.get(e)};sap.ui.component.load=function(e,t){g.warning("Do not use deprecated function 'sap.ui.component.load'! Use 'Component.load' instead");return H(e,{failOnError:t,preloadOnly:e.asyncHints&&e.asyncHints.preloadOnly})};function H(t,n){var i=n.activeTerminologies,r=t.name,s=t.url,u=w,f=/^(sync|async)$/.test(u.getComponentPreload()),p=t.manifest,m,h,v,y,M,_;function S(n,i){var r=JSON.parse(JSON.stringify(n));if(t.async){return O(r).then(function(t){return new e(t,i)})}else{return new e(r,i)}}function O(e){if(typeof k._fnPreprocessManifest==="function"&&e!=null){try{var n=o({},t);return k._fnPreprocessManifest(e,n)}catch(e){g.error("Failed to execute flexibility hook for manifest preprocessing.",e);return Promise.reject(e)}}else{return Promise.resolve(e)}}l(!s||typeof s==="string","sUrl must be a string or undefined");if(r&&typeof s==="string"){x(r,s)}d.setStepComponent(r);if(p===undefined){m=t.manifestFirst===undefined?u.getManifestFirst():!!t.manifestFirst;h=t.manifestUrl}else{if(t.async===undefined){t.async=true}m=!!p;h=p&&typeof p==="string"?p:undefined;v=p&&typeof p==="object"?S(p,{url:t&&t.altManifestUrl,activeTerminologies:i}):undefined}if(!v&&h){v=e.load({activeTerminologies:i,manifestUrl:h,componentName:r,processJson:O,async:t.async,failOnError:true})}if(v&&!t.async){r=v.getComponentName();if(r&&typeof s==="string"){x(r,s)}}if(!(v&&t.async)){if(!r){throw new Error("The name of the component is undefined.")}l(typeof r==="string","sName must be a string")}if(m&&!v){v=e.load({activeTerminologies:i,manifestUrl:N(r),componentName:r,async:t.async,processJson:O,failOnError:false})}function E(){return(r+".Component").replace(/\./g,"/")}function A(e){var t=r+".Component";if(!e){var i="The specified component controller '"+t+"' could not be found!";if(n.failOnError){throw new Error(i)}else{g.warning(i)}}if(v){var o=U(e.getMetadata(),v);var a=function(){var t=Array.prototype.slice.call(arguments);var n;if(t.length===0||typeof t[0]==="object"){n=t[0]=t[0]||{}}else if(typeof t[0]==="string"){n=t[1]=t[1]||{}}n._metadataProxy=o;if(y){n._manifestModels=y}var i=Object.create(e.prototype);e.apply(i,t);return i};a.getMetadata=function(){return o};a.extend=function(){throw new Error("Extending Components created by Manifest is not supported!")};return a}else{return e}}function T(e,t){l(typeof e==="string"&&e||typeof e==="object"&&typeof e.name==="string"&&e.name,"reference either must be a non-empty string or an object with a non-empty 'name' and an optional 'url' property");if(typeof e==="object"){if(e.url){x(e.name,e.url)}return e.lazy&&t!==true?undefined:e.name}return e}function P(e,t){var n=e+".Component",i=w.getDepCache(),r,o,a,s=function(e,t){return function(n){var i="Component-preload for this component does not exist.";g.warning("Couldn't preload component from "+e+": "+(n&&n.message||n),!t?i:i+" If the component is part of a library or another component, the configuration 'sap.app/embeddedBy' is not maintained. "+" The 'sap.app/embeddedBy' property must be relative path inside the deployment unit (library or component).","sap.ui.core.Component#preload")}};if(f&&e!=null&&!sap.ui.loader._.getModuleState(n.replace(/\./g,"/")+".js")){if(t){o=C._getTransitiveDependencyForComponent(e);if(o&&!o.hasOwnPreload){a=[o.library];Array.prototype.push.apply(a,o.dependencies);return c._load(a,{preloadOnly:true}).catch(s(o.library,true))}else{r=n.replace(/\./g,"/")+(i?"-h2-preload.js":"-preload.js");return sap.ui.loader._.loadJSResourceAsync(r).catch(s(r,true))}}try{r=n+"-preload";sap.ui.requireSync(r.replace(/\./g,"/"))}catch(e){s(r,false)(e)}}else if(t){return Promise.resolve()}}function j(e,t,n){var i=[];var r=n?function(e){i.push(e)}:function(){};var o=t.getEntry("/sap.ui5/dependencies/libs");if(o){var a=[];for(var s in o){if(!o[s].lazy){a.push(s)}}if(a.length>0){g.info('Component "'+e+'" is loading libraries: "'+a.join(", ")+'"');r(c._load(a,{sync:!n}))}}var u=t.getEntry("/sap.ui5/extends/component");if(u){r(P(u,n))}var f=[];var p=t.getEntry("/sap.ui5/dependencies/components");if(p){for(var d in p){if(!p[d].lazy){f.push(d)}}}var l=t.getEntry("/sap.ui5/componentUsages");if(l){for(var m in l){if(l[m].lazy===false&&f.indexOf(l[m].name)===-1){f.push(l[m].name)}}}if(f.length>0){f.forEach(function(e){r(P(e,n))})}return n?Promise.all(i):undefined}if(t.async){var D=t.asyncHints||{},B=[],F=function(e){e=e.then(function(e){return{result:e,rejected:false}},function(e){return{result:e,rejected:true}});return e},H=function(e){if(e){B.push(F(e))}},L=function(e){return e},W,q;W=[];if(Array.isArray(D.preloadBundles)){D.preloadBundles.forEach(function(e){W.push(sap.ui.loader._.loadJSResourceAsync(T(e,true),true))})}if(Array.isArray(D.libs)){q=D.libs.map(T).filter(L);W.push(c._load(q,{preloadOnly:true}))}W=Promise.all(W);if(q&&!n.preloadOnly){W=W.then(function(){return c._load(q)})}H(W);if(D.components){Object.keys(D.components).forEach(function(e){H(P(T(D.components[e]),true))})}if(!v){H(P(r,true))}else{var V=[];v=v.then(function(e){var t=e.getComponentName();if(typeof s==="string"){x(t,s)}e.defineResourceRoots();e._preprocess({resolveUI5Urls:true,i18nProperties:V});return e});if(n.createModels){H(v.then(function(e){var n=e.getComponentName();M=I(e);if(Object.keys(M.afterManifest).length>0){k._loadManifestModelClasses(M.afterManifest,n);var r=a({},e.getEntry("/sap.app/dataSources"));var o=k._createManifestModelConfigurations({models:M.afterManifest,dataSources:r,manifest:e,componentData:t.componentData,cacheTokens:D.cacheTokens,activeTerminologies:i});y=k._createManifestModels(o,n)}return e}))}H(v.then(function(e){var r=Promise.resolve();var o=e.getEntry("/sap.app/embeddedBy");var s=e.getComponentName();if(!o){r=P(s,true)}else if(!sap.ui.loader._.getModuleState(E()+".js")){g.warning("Component '"+s+"' is defined to be embedded in a library or another component"+"The relatively given preload for the embedding resource was not loaded before hand. "+"Please make sure to load the embedding resource containing this Component before instantiating.",undefined,"sap.ui.core.Component#embeddedBy")}return r.then(function(){return e._processI18n(true,V)}).then(function(){if(!n.createModels){return null}var r=Object.keys(M.afterPreload);if(r.length===0){return null}return new Promise(function(e,t){sap.ui.require(["sap/ui/model/resource/ResourceModel"],function(t){e(t)},t)}).then(function(o){var s=a({},e.getEntry("/sap.app/dataSources"));var u=k._createManifestModelConfigurations({models:M.afterPreload,dataSources:s,manifest:e,componentData:t.componentData,cacheTokens:D.cacheTokens,activeTerminologies:i});function c(t){var i=u[t];if(Array.isArray(i.settings)&&i.settings.length>0){var r=i.settings[0];r.activeTerminologies=n.activeTerminologies;return o.loadResourceBundle(r,true).then(function(e){r.bundle=e;delete r.terminologies;delete r.activeTerminologies;delete r.enhanceWith},function(n){g.error("Component Manifest: Could not preload ResourceBundle for ResourceModel. "+"The model will be skipped here and tried to be created on Component initialization.",'["sap.ui5"]["models"]["'+t+'"]',e.getComponentName());g.error(n);delete u[t]})}else{return Promise.resolve()}}return Promise.all(r.map(c)).then(function(){if(Object.keys(u).length>0){var t=k._createManifestModels(u,e.getComponentName());if(!y){y={}}for(var n in t){y[n]=t[n]}}})})})}));_=function(e){if(typeof k._fnLoadComponentCallback==="function"){var n=o({},t);try{return k._fnLoadComponentCallback(n,e)}catch(t){g.error('Callback for loading the component "'+e.getComponentName()+'" run into an error. The callback was skipped and the component loading resumed.',t,"sap.ui.core.Component")}}}}return Promise.all(B).then(function(e){var t=[],n=false,i;n=e.some(function(e){if(e&&e.rejected){i=e.result;return true}t.push(e.result)});if(n){return Promise.reject(i)}return t}).then(function(e){if(v&&_){return v.then(_).then(function(){return e})}return e}).then(function(e){g.debug("Component.load: all promises fulfilled, then "+e);if(v){return v.then(function(e){if(!e._bLoadManifestRequestFailed){v=e;r=v.getComponentName();return j(r,v,true)}else{v=undefined;return v}})}else{return e}}).then(function(){if(n.preloadOnly){return true}return new Promise(function(e,t){sap.ui.require([E()],function(t){e(t)},t)}).then(function(t){var r=t.getMetadata();var o=r.getComponentName();var a=N(o);var s;if(v&&typeof p!=="object"&&(typeof h==="undefined"||h===a)){r._applyManifest(JSON.parse(JSON.stringify(v.getRawJson())))}s=R(r);return s.then(function(){var o=Promise.resolve();if(!v&&Array.isArray(n.activeTerminologies)&&n.activeTerminologies.length>0){v=new e(r.getManifestObject().getRawJson(),{process:false,activeTerminologies:i});o=v._processI18n(true)}return o.then(A.bind(undefined,t))})})}).then(function(e){if(!v){return e}var t=[];var n;var i=v.getEntry("/sap.ui5/rootView");if(typeof i==="string"){n="XML"}else if(i&&typeof i==="object"&&i.type){n=i.type}if(n&&b[n]){var r="sap/ui/core/mvc/"+b[n]+"View";t.push(r)}var o=v.getEntry("/sap.ui5/routing");if(o){if(o.routes){var s=v.getEntry("/sap.ui5/routing/config/routerClass")||"sap.ui.core.routing.Router";var u=s.replace(/\./g,"/");t.push(u)}else if(o.targets){var c=v.getEntry("/sap.ui5/routing/config/targetsClass")||"sap.ui.core.routing.Targets";var f=c.replace(/\./g,"/");t.push(f);t.push("sap/ui/core/routing/Views")}}var p=a({},v.getEntry("/sap.ui5/models"));var d=a({},v.getEntry("/sap.app/dataSources"));var l=k._findManifestModelClasses({models:p,dataSources:d,componentName:v.getComponentName()});for(var m in l){if(!l.hasOwnProperty(m)){continue}var h=l[m];if(!h.type){continue}var y=h.type.replace(/\./g,"/");if(t.indexOf(y)===-1){t.push(y)}}if(t.length>0){return Promise.all(t.map(function(e){return new Promise(function(t,n){var i=false;function r(n){if(i){return}g.warning('Can not preload module "'+e+'". '+"This will most probably cause an error once the module is used later on.",v.getComponentName(),"sap.ui.core.Component");g.warning(n);i=true;t()}sap.ui.require([e],t,r)})})).then(function(){return e})}else{return e}}).then(function(e){var t=n.waitFor;if(t){var i=Array.isArray(t)?t:[t];return Promise.all(i).then(function(){return e})}return e}).catch(function(e){if(y){for(var t in y){var n=y[t];if(n&&typeof n.destroy==="function"){n.destroy()}}}throw e})}if(v){v.defineResourceRoots();v._preprocess({resolveUI5Urls:true});j(r,v)}P(r);return A(sap.ui.requireSync(E()))}if(Math.sqrt(2)<1){sap.ui.require(["sap/ui/core/Core"],function(){})}k.prototype.getCommand=function(e){if(!this._mComputedCommands){var t=k.getCustomizing(this,{type:"sap.ui.commands"})||{},n=this._getManifestEntry("/sap.ui5/commands",true)||{},i=this.getMetadata().getComponentName(),r="",o=this.getExtensionComponent&&this.getExtensionComponent();if(o&&o.getLocalId){r="#"+(o.getLocalId(this.getId())||this.getId())}this._mComputedCommands=a({},n,t[i],t[i+r])}return e?this._mComputedCommands[e]:this._mComputedCommands};k.prototype.deactivate=function(){var e=k.getOwnerComponentFor(this);if(e&&e.isActive()){throw new Error("Component.deactivate must not be called on nested components.")}if(!this.isKeepAliveSupported()){g.warning("Deactivation of component failed. Component '"+this.getId()+"' does not support 'keepAlive'.");return}if(!this.isActive()){g.warning("Deactivation of component failed. Component '"+this.getId()+"' is already inactive.");return}this.onOwnerDeactivation();this._bIsActive=false;P(function(e){f.suspend(e.getDomRef());e.onOwnerDeactivation()},this.getId());k.registry.filter(function(e){var t=k.getOwnerIdFor(e);if(t===this.getId()){e.deactivate()}},this);if(this._oEventBus){this._oEventBus.suspend()}if(this.getRouter()){this.getRouter().stop()}if(typeof this.onDeactivate==="function"){this.onDeactivate()}};k.prototype.activate=function(){if(!this.isKeepAliveSupported()){g.warning("Activation of component failed. Component '"+this.getId()+"' does not support 'keepAlive'.");return}if(this.isActive()){g.warning("Activation of component failed. Component '"+this.getId()+"' is already active.");return}this.onOwnerActivation();this._bIsActive=true;P(function(e){f.resume(e.getDomRef());e.onOwnerActivation()},this.getId());k.registry.forEach(function(e){var t=k.getOwnerIdFor(e);if(t===this.getId()){e.activate()}},this);if(this._oEventBus){this._oEventBus.resume()}if(this.getRouter()){this.getRouter().initialize()}if(typeof this.onActivate==="function"){this.onActivate()}};k.prototype.isKeepAliveSupported=function(){var e=this._oKeepAliveConfig&&this._oKeepAliveConfig.supported;if(e){e=k.registry.filter(function(e){var t=k.getOwnerIdFor(e);if(t===this.getId()){return true}},this).every(function(e){return e.isKeepAliveSupported()},this)}return!!e};k.prototype.registerForDestroy=function(e){var t=this._getDestroyables();e=e.then(function(n){t.splice(t.indexOf(e),1);return n});t.push(e)};return k});
//# sourceMappingURL=Component.js.map