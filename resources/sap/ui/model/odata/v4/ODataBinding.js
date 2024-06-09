/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./lib/_Helper","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason","sap/ui/model/odata/OperationMode","sap/ui/model/odata/v4/Context"],function(e,t,n,i,r){"use strict";var o=[n.Context,n.Change,n.Refresh,n.Sort,n.Filter],s=/\/\d|\(\$uid=/;function a(e,t){return o.indexOf(e)>o.indexOf(t)}function h(){this.mCacheByResourcePath=undefined;this.oCache=null;this.oCachePromise=t.resolve(null);this.mCacheQueryOptions=undefined;this.fnDeregisterChangeListener=undefined;this.oFetchCacheCallToken=undefined;this.mLateQueryOptions=undefined;this.sReducedPath=undefined;this.sResumeChangeReason=undefined}h.prototype._hasPendingChanges=function(e,t){return this.isResolved()&&(this.hasPendingChangesForPath("",e)||this.hasPendingChangesInDependents(e,t))};h.prototype._resetChanges=function(e){var t=[];this.checkSuspended();this.resetChangesForPath("",t);this.resetChangesInDependents(t,e);this.resetInvalidDataState();return Promise.all(t).then(function(){})};h.prototype.adjustPredicate=function(e,t){this.sReducedPath=this.sReducedPath.replace(e,t)};h.prototype.assertSameCache=function(e){var t;if(this.oCache!==e){t=new Error(this+" is ignoring response from inactive cache: "+e);t.canceled=true;throw t}};h.prototype.checkBindingParameters=function(t,n){var r=this;Object.keys(t).forEach(function(o){var s=t[o];if(!o.startsWith("$$")){return}if(!n.includes(o)){throw new Error("Unsupported binding parameter: "+o)}switch(o){case"$$aggregation":break;case"$$groupId":case"$$updateGroupId":e.checkGroupId(s,false,"Unsupported value for binding parameter '"+o+"': ");break;case"$$ignoreMessages":case"$$sharedRequest":if(s!==true&&s!==false){throw new Error("Unsupported value for binding parameter '"+o+"': "+s)}break;case"$$inheritExpandSelect":if(s!==true&&s!==false){throw new Error("Unsupported value for binding parameter "+"'$$inheritExpandSelect': "+s)}if(!r.oOperation){throw new Error("Unsupported binding parameter $$inheritExpandSelect: "+"binding is not an operation binding")}if(t.$expand){throw new Error("Must not set parameter $$inheritExpandSelect on a binding "+"which has a $expand binding parameter")}break;case"$$operationMode":if(s!==i.Server){throw new Error("Unsupported operation mode: "+s)}break;case"$$getKeepAliveContext":if(r.isRelative()&&!t.$$ownRequest){throw new Error("$$getKeepAliveContext requires $$ownRequest in a relative binding")}["$$aggregation","$$canonicalPath","$$sharedRequest"].forEach(function(n,i){if(n in t&&(i>0||e.isDataAggregation(t))){throw new Error("Cannot combine $$getKeepAliveContext and "+n)}});case"$$canonicalPath":case"$$clearSelectionOnFilter":case"$$noPatch":case"$$ownRequest":case"$$patchWithoutSideEffects":if(s!==true){throw new Error("Unsupported value for binding parameter '"+o+"': "+s)}break;default:throw new Error("Unknown binding-specific parameter: "+o)}})};h.prototype.checkSuspended=function(e){if(this.isRootBindingSuspended()&&(!e||this.isRoot()||this.getResumeChangeReason())){throw new Error("Must not call method when the binding's root binding is suspended: "+this)}};h.prototype.checkTransient=function(){if(this.isTransient()){throw new Error("Must not call method when the binding is part of a deep create: "+this)}};h.prototype.checkUpdate=function(e){if(arguments.length>1){throw new Error("Only the parameter bForceUpdate is supported")}this.checkUpdateInternal(e).catch(this.oModel.getReporter())};h.prototype.createAndSetCache=function(e,t,n,i,r){var o,s,a;this.mCacheQueryOptions=Object.assign({},this.oModel.mUriParameters,e);if(this.bRelative){o=this.mCacheByResourcePath&&this.mCacheByResourcePath[t];a=n.getGeneration&&n.getGeneration()||0;if(o&&o.$generation>=a){o.setActive(true)}else{s=this.oModel.resolve(this.sPath,n).slice(1);o=this.doCreateCache(t,this.mCacheQueryOptions,n,s,i,r);if(!(this.mParameters&&this.mParameters.$$sharedRequest)){this.mCacheByResourcePath??={};this.mCacheByResourcePath[t]=o}o.$deepResourcePath=s;o.$generation=a}}else{o=this.doCreateCache(t,this.mCacheQueryOptions,undefined,undefined,i,r)}if(r&&r!==o){this.deregisterChangeListener();r.setActive(false)}if(this.mLateQueryOptions){o.setLateQueryOptions(this.mLateQueryOptions)}this.oCache=o;return o};h.prototype.deregisterChangeListener=function(){this.fnDeregisterChangeListener?.();this.fnDeregisterChangeListener=undefined};h.prototype.destroy=function(){this.mCacheByResourcePath=undefined;this.deregisterChangeListener();this.oCachePromise.then(function(e){e?.setActive(false)},function(){});this.oCache=null;this.oCachePromise=t.resolve(null);this.mCacheQueryOptions=undefined;this.oContext=undefined;this.oFetchCacheCallToken=undefined};h.prototype.getEventingParent=function(){return this.oModel};h.prototype.fetchCache=function(e,n,i,r){var o=this.oCache,s={oOldCache:o===undefined?this.oFetchCacheCallToken.oOldCache:o},a,h=this;if(!this.bRelative){e=undefined}if(!o&&i){if(o===undefined){throw new Error("Unsupported bKeepQueryOptions while oCachePromise is pending")}return}this.oCache=undefined;this.oFetchCacheCallToken=s;if(i){this.oCachePromise=t.resolve(Promise.resolve()).then(function(){return h.createAndSetCache(h.mCacheQueryOptions,o.getResourcePath(),e,r,o)});return}a=[this.fetchOrGetQueryOptionsForOwnCache(e,n),this.oModel.oRequestor.ready()];this.mCacheQueryOptions=undefined;this.oCachePromise=t.all(a).then(function(t){var n=t[0].mQueryOptions;if(t[0].sReducedPath){h.sReducedPath=t[0].sReducedPath}if(!h.prepareDeepCreate(e,n)){return h.fetchResourcePath(e).then(function(t){if(h.oFetchCacheCallToken!==s){return h.oCachePromise.then(function(e){if(e===s.oOldCache){return e}const t=new Error("Cache discarded as a new cache has been created");t.canceled=true;throw t})}return h.oModel.waitForKeepAliveBinding(h).then(function(){h.oFetchCacheCallToken=undefined;return h.createAndSetCache(n,t,e,r,s.oOldCache)})})}s.oOldCache=undefined;if(o){o.setActive(false)}h.oCache=null;return null});this.oCachePromise.catch(this.oModel.getReporter())};h.prototype.fetchOrGetQueryOptionsForOwnCache=function(n,i){var r,o,s=this.oModel.resolve(this.sPath,n),a=this;function h(t,n,i){if(n&&t&&e.isEmptyObject(t)){t=undefined}return{mQueryOptions:t,sReducedPath:i||s}}function u(e,n){if(o instanceof t){if(!o.isFulfilled()){return o.then(function(t){return h(t,e,n)})}o=o.getResult()}return h(o,e,n)}if(this.oOperation||!s||this.isMeta()){return h()}o=this.doFetchOrGetQueryOptions(n);if(this.oModel.bAutoExpandSelect&&this.aChildCanUseCachePromises&&!e.isDataAggregation(this.mParameters)){o=t.all([o,Promise.resolve().then(function(){return t.all(a.aChildCanUseCachePromises)})]).then(function(e){a.aChildCanUseCachePromises=[];a.updateAggregatedQueryOptions(e[0]);return a.mAggregatedQueryOptions})}if(i||!this.bRelative||!n.fetchValue){return u()}if(this.oModel.bAutoExpandSelect){r=this.mParameters&&Object.keys(a.mParameters).some(function(e){return e[0]!=="$"||e[1]==="$"});if(r){return u()}return n.getBinding().fetchIfChildCanUseCache(n,a.sPath,o,!this.mParameters).then(function(e){if(e){o=undefined}else{o??={}}return u(false,e)})}if(this.mParameters&&!e.isEmptyObject(this.mParameters)){return u()}return u(true)};h.prototype.fetchResourcePath=function(n){var i,r,o,a=this;if(!this.bRelative){return t.resolve(this.sPath.slice(1))}n??=this.oContext;if(!n){return t.resolve()}r=n.getPath();i=n.fetchCanonicalPath&&(this.mParameters&&this.mParameters.$$canonicalPath||!this.isTransient()&&s.test(r));o=i?n.fetchCanonicalPath():t.resolve(r);return o.then(function(t){return e.buildPath(t,a.sPath).slice(1)})};h.prototype.fireDataReceived=function(e,t){this.fireEvent("dataReceived",e,false,!t)};h.prototype.fireDataRequested=function(e){this.fireEvent("dataRequested",undefined,false,!e)};h.prototype.getGroupId=function(){return this.sGroupId||this.bRelative&&this.oContext&&this.oContext.getGroupId&&this.oContext.getGroupId()||this.oModel.getGroupId()};h.prototype.getRelativePath=function(t){var n;if(t[0]==="/"){n=e.getRelativePath(t,this.getResolvedPath());if(n===undefined&&this.oReturnValueContext){n=e.getRelativePath(t,this.oReturnValueContext.getPath())}return n}return t};h.prototype.getResumeChangeReason=function(){var e=this.sResumeChangeReason;this.getDependentBindings().forEach(function(t){var n=t.getResumeChangeReason();if(n&&a(n,e)){e=n}});return e};h.prototype.getRootBinding=function(){if(this.bRelative){if(!this.oContext){return undefined}if(this.oContext.getBinding){return this.oContext.getBinding().getRootBinding()}}return this};h.prototype.getRootBindingResumePromise=function(){var e=this.getRootBinding();return e&&e.getResumePromise()||t.resolve()};h.prototype.getUpdateGroupId=function(){return this.sUpdateGroupId||this.bRelative&&this.oContext&&this.oContext.getUpdateGroupId&&this.oContext.getUpdateGroupId()||this.oModel.getUpdateGroupId()};h.prototype.hasPendingChanges=function(e){return this._hasPendingChanges(e)};h.prototype.hasPendingChangesForPath=function(e,t){return this.withCache(function(e,n,i){return e.hasPendingChangesForPath(n,t,t&&(i.isRoot()||i.mParameters.$$ownRequest))},e,true).unwrap()};h.prototype.hasPendingChangesInCaches=function(e){var t=this;if(!this.mCacheByResourcePath){return false}return Object.keys(this.mCacheByResourcePath).some(function(n){var i=t.mCacheByResourcePath[n];return i.$deepResourcePath.startsWith(e)&&i.hasPendingChangesForPath("")})};h.prototype.isTransient=function(){return this.sReducedPath&&this.sReducedPath.includes("($uid=")};h.prototype.isInitial=function(){throw new Error("Unsupported operation: isInitial")};h.prototype.isRoot=function(){return!this.bRelative||this.oContext&&!this.oContext.getBinding};h.prototype.isRootBindingSuspended=function(){var e=this.getRootBinding();return e&&e.isSuspended()};h.prototype.lockGroup=function(e,t,n,i){e??=n?this.getUpdateGroupId():this.getGroupId();return this.oModel.lockGroup(e,this,t,n,i)};h.prototype.prepareDeepCreate=function(e,t){if(e){if(e.iIndex===r.VIRTUAL){return true}if(e.getPath().includes("($uid=")){this.mCacheQueryOptions=t;return true}}return!t};h.prototype.refresh=function(e){if(typeof e==="boolean"){throw new Error("Unsupported parameter bForceUpdate")}this.requestRefresh(e).catch(this.oModel.getReporter())};h.prototype.refreshSuspended=function(e){if(e&&e!==this.getGroupId()){throw new Error(this+": Cannot refresh a suspended binding with group ID '"+e+"' (own group ID is '"+this.getGroupId()+"')")}this.setResumeChangeReason(n.Refresh)};h.prototype.removeCachesAndMessages=function(t,n){var i=this;if(!n&&this.oCache){this.oCache.removeMessages()}if(this.mCacheByResourcePath){Object.keys(this.mCacheByResourcePath).forEach(function(r){var o=i.mCacheByResourcePath[r],s=o.$deepResourcePath;if(e.hasPathPrefix(s,t)){if(!n){o.removeMessages()}delete i.mCacheByResourcePath[r]}})}};h.prototype.requestAbsoluteSideEffects=function(t,n){var i=[],r=e.getMetaPath(this.getResolvedPath());n.some(function(t){var n=e.getRelativePath(t,r);if(n!==undefined){i.push(n)}else if(e.hasPathPrefix(r,t)){i=[""];return true}});if(i.length){if(this.requestSideEffects){return this.requestSideEffects(t,i)}return this.refreshInternal("",t,true,true)}};h.prototype.requestRefresh=function(t){if(!this.mParameters?.$$ownRequest&&!this.isRoot()){throw new Error("Refresh on this binding is not supported")}if(this.hasPendingChanges(true)){throw new Error("Cannot refresh due to pending changes")}e.checkGroupId(t);return Promise.resolve(this.refreshInternal("",t,true)).then(function(){})};h.prototype.resetChanges=function(){this.checkTransient();return this._resetChanges()};h.prototype.resetChangesForPath=function(e,t){t.push(this.withCache(function(e,t){e.resetChangesForPath(t)},e).unwrap())};h.prototype.resetInvalidDataState=function(){};h.prototype.setDeregisterChangeListener=function(e){this.fnDeregisterChangeListener=e};h.prototype.setResumeChangeReason=function(e){if(a(e,this.sResumeChangeReason)){this.sResumeChangeReason=e}};h.prototype.toString=function(){return this.getMetadata().getName()+": "+(this.bRelative?this.oContext+"|":"")+this.sPath};h.prototype.withCache=function(n,i="",r=false,o=false){var s=r?t.resolve(this.oCache):this.oCachePromise,a,h=this;return s.then(function(t){if(t){a=h.getRelativePath(i);if(a!==undefined){return n(t,a,h)}}else if(t===undefined){return undefined}else if(h.oOperation){return o?n(null,h.getRelativePath(i),h):undefined}if(h.bRelative&&h.oContext&&h.oContext.withCache){return h.oContext.withCache(n,i[0]==="/"?i:e.buildPath(h.sPath,i),r,o)}return undefined})};function u(e){if(this){h.apply(this,arguments)}else{Object.assign(e,h.prototype)}}["adjustPredicate","destroy","hasPendingChangesForPath"].forEach(function(e){u.prototype[e]=h.prototype[e]});return u},false);
//# sourceMappingURL=ODataBinding.js.map