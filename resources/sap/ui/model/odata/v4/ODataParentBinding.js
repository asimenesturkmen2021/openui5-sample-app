/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Context","./ODataBinding","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason"],function(e,t,n,r,i,o){"use strict";function s(){t.call(this);this.mAggregatedQueryOptions={};this.bAggregatedQueryOptionsInitial=true;this.mCanUseCachePromiseByChildPath={};this.aChildCanUseCachePromises=[];this.bHasPathReductionToParent=false;this.iPatchCounter=0;this.bPatchSuccess=true;this.oReadGroupLock=undefined;this.oRefreshPromise=null;this.oResumePromise=undefined}t(s.prototype);var a="sap.ui.model.odata.v4.ODataParentBinding";s.prototype.attachPatchCompleted=function(e,t){return this.attachEvent("patchCompleted",e,t)};s.prototype.detachPatchCompleted=function(e,t){return this.detachEvent("patchCompleted",e,t)};s.prototype.doSuspend=function(){};s.prototype.firePatchCompleted=function(e){if(this.iPatchCounter===0){throw new Error("Completed more PATCH requests than sent")}this.iPatchCounter-=1;this.bPatchSuccess&&=e;if(this.iPatchCounter===0){this.fireEvent("patchCompleted",{success:this.bPatchSuccess});this.bPatchSuccess=true}};s.prototype.attachPatchSent=function(e,t){return this.attachEvent("patchSent",e,t)};s.prototype.detachPatchSent=function(e,t){return this.detachEvent("patchSent",e,t)};s.prototype.firePatchSent=function(){this.iPatchCounter+=1;if(this.iPatchCounter===1){this.fireEvent("patchSent")}};s.prototype._findEmptyPathParentContext=function(e){if(this.sPath===""&&this.oContext.getBinding){return this.oContext.getBinding()._findEmptyPathParentContext(this.oContext)}return e};s.prototype.aggregateQueryOptions=function(e,t,r,i){var o=n.clone(r&&this.mLateQueryOptions||this.mAggregatedQueryOptions),s=this;function a(e,t,n,o,h){function u(i){var o=!e.$expand[i],h=n+"/"+i;if(o){e.$expand[i]={};if(r&&s.oModel.getMetaModel().fetchObject(h).getResult().$isCollection){return false}}return a(e.$expand[i],t.$expand[i],h,true,o)}function c(t){if(!e.$select.includes(t)){e.$select.push(t)}return true}return(i||!o||Object.keys(e).every(function(e){return e in t||e==="$count"||e==="$expand"||e==="$select"}))&&Object.keys(t).every(function(n){switch(n){case"$count":if(t.$count){e.$count=true}return true;case"$expand":e.$expand??={};return Object.keys(t.$expand).every(u);case"$select":e.$select??=[];return t.$select.every(c);default:if(h){e[n]=t[n];return true}return t[n]===e[n]}})}if(a(o,e,t)){if(r){this.mLateQueryOptions=o}else{this.mAggregatedQueryOptions=o;if(this.mLateQueryOptions){a(this.mLateQueryOptions,e)}}return true}return false};s.prototype.changeParameters=function(e){var t=Object.assign({},this.mParameters),r,i=[],s,a=this;function h(n){if(a.oModel.bAutoExpandSelect&&(n==="$expand"||n==="$select")){throw new Error("Cannot change "+n+" parameter in auto-$expand/$select mode: "+JSON.stringify(e[n])+" !== "+JSON.stringify(t[n]))}if(n==="$filter"||n==="$search"){r=o.Filter}else if(n==="$orderby"&&r!==o.Filter){r=o.Sort}else{r??=o.Change}i.push(s)}this.checkTransient();if(!e){throw new Error("Missing map of binding parameters")}for(s in e){if(s.startsWith("$$")){if(this.isUnchangedParameter(s,e[s])){continue}throw new Error("Unsupported parameter: "+s)}if(e[s]===undefined&&t[s]!==undefined){h(s);delete t[s]}else if(t[s]!==e[s]){h(s);if(typeof e[s]==="object"){t[s]=n.clone(e[s])}else{t[s]=e[s]}}}if(r){if(this.hasPendingChanges(true)){throw new Error("Cannot change parameters due to pending changes")}this.applyParameters(t,r,i)}};s.prototype.checkUpdateInternal=function(e){var t=this;function n(){return i.all(t.getDependentBindings().map(function(e){return e.checkUpdateInternal()}))}if(e!==undefined){throw new Error("Unsupported operation: "+a+"#checkUpdateInternal must not"+" be called with parameters")}return this.oCachePromise.then(function(e){if(e&&t.bRelative){return t.fetchResourcePath(t.oContext).then(function(r){if(e.getResourcePath()===r){return n()}return t.refreshInternal("")})}return n()})};s.prototype.createInCache=function(e,t,r,i,o,s,a,h){var u=this;return this.oCachePromise.then(function(c){var d;if(c){d=n.getRelativePath(r,u.getResolvedPath());return c.create(e,t,d,i,o,s,a,h).then(function(e){if(u.mCacheByResourcePath){delete u.mCacheByResourcePath[c.getResourcePath()]}return e})}return u.oContext.getBinding().createInCache(e,t,r,i,o,s,a,h)})};s.prototype.createReadGroupLock=function(e,t,n){var i,o=this;function s(){o.oModel.addPrerenderingTask(function(){if(o.oReadGroupLock===i){n-=1;if(n>0){Promise.resolve().then(s)}else{r.debug("Timeout: unlocked "+i,null,a);o.removeReadGroupLock()}}})}this.removeReadGroupLock();this.oReadGroupLock=i=this.lockGroup(e,t);if(t){n=2+(n||0);s()}};s.prototype.createRefreshPromise=function(e){var t,n;t=new Promise(function(e){n=e});t.$preventBubbling=e;t.$resolve=n;this.oRefreshPromise=t;return t};s.prototype.deleteFromCache=function(e,t,n,r,i){return this.withCache(function(n,o){return n._delete(e,t,o,r,i)},n,true)};s.prototype.destroy=function(){this.aChildCanUseCachePromises=[];this.removeReadGroupLock();this.oResumePromise=undefined;t.prototype.destroy.call(this)};s.prototype.fetchIfChildCanUseCache=function(t,o,s,h){var u=this.getBaseForPathReduction(),c,d,p,f=t.getPath().includes("(...)"),l=t.getIndex(),g=o[0]==="#",P=this.oModel.getMetaModel(),m=this.oContext,y,C=this.oModel.resolve(o,t),v=this;function R(){if(g){return P.fetchObject(c+"/")}return n.fetchPropertyAndType(v.oModel.oInterface.fetchMetadata,O(C))}function O(e){var t;e=n.getMetaPath(e);t=e.indexOf("@");return t>0?e.slice(0,t):e}if(f&&!C.includes("/$Parameter/")||this.isRootBindingSuspended()||n.isDataAggregation(this.mParameters)){return i.resolve(C)}p=this.mCanUseCachePromiseByChildPath[o];if(h&&this.oCache!==null&&p){return p.then(function(e){if(!e){return undefined}if(!o.includes("/")||n.getMetaPath(e)===n.getMetaPath(C)){return C}return P.getReducedPath(C,u)})}d=this.oCachePromise.isRejected()||l!==undefined&&l!==e.VIRTUAL||t.isEffectivelyKeptAlive()||this.oCache===null||this.oCache&&this.oCache.hasSentRequest();c=n.getMetaPath(t.getPath());y=[this.doFetchOrGetQueryOptions(m),R(),s];p=i.all(y).then(function(e){var t=e[2]||{},i,o=e[0],s=e[1],p,l;if(Array.isArray(s)){return undefined}l=P.getReducedPath(C,u);p=n.getRelativePath(O(l),c);if(p===undefined){v.bHasPathReductionToParent=true;return m.getBinding().fetchIfChildCanUseCache(m,n.getRelativePath(C,m.getPath()),t,h)}if(f||p==="$count"||p.endsWith("/$count")){return l}if(v.bAggregatedQueryOptionsInitial){v.mAggregatedQueryOptions=n.clone(o);v.selectKeyProperties(v.mAggregatedQueryOptions,c);v.bAggregatedQueryOptionsInitial=false}if(g){i={$select:[p.slice(1)]};return v.aggregateQueryOptions(i,c,d,h)?l:undefined}if(p===""||s&&(s.$kind==="Property"||s.$kind==="NavigationProperty")){i=n.wrapChildQueryOptions(c,p,t,v.oModel.oInterface.fetchMetadata);if(i){return v.aggregateQueryOptions(i,c,d,h)?l:undefined}return undefined}if(p==="value"){return v.aggregateQueryOptions(t,c,d,h)?l:undefined}r.error("Failed to enhance query options for auto-$expand/$select as the path '"+C+"' does not point to a property",JSON.stringify(s),a);return undefined}).then(function(e){if(v.mLateQueryOptions&&!v.isTransient()){if(v.oCache){v.oCache.setLateQueryOptions(v.mLateQueryOptions)}else if(v.oCache===null){return m.getBinding().fetchIfChildCanUseCache(m,v.sPath,v.mLateQueryOptions).then(function(t){return t&&e})}}return e});if(h&&this.oCache!==null&&!t.getPath().includes("($uid=")){this.mCanUseCachePromiseByChildPath[o]=p}this.aChildCanUseCachePromises.push(p);const b=d?p:i.all([this.oCachePromise,p]).then(function(e){var r=e[0];if(r&&!r.hasSentRequest()&&!v.oOperation){if(v.bSharedRequest){r.setActive(false);r=v.createAndSetCache(v.mAggregatedQueryOptions,r.getResourcePath(),t)}else{r.setQueryOptions(n.merge({},v.oModel.mUriParameters,v.mAggregatedQueryOptions))}}return r});b.catch(function(e){v.oModel.reportError(v+": Failed to enhance query options for "+"auto-$expand/$select for child "+o,a,e)});if(!d){this.oCachePromise=b}return p};s.prototype.fetchResolvedQueryOptions=function(e){var t,r,o,s=this.oModel,a=this.getQueryOptionsFromParameters();if(!(s.bAutoExpandSelect&&a.$select)){return i.resolve(a)}t=s.oInterface.fetchMetadata;o=n.getMetaPath(s.resolve(this.sPath,e));r=Object.assign({},n.clone(a),{$select:[]});return i.all(a.$select.map(function(e){var i=o+"/"+e;if(i.endsWith(".*")){i=i.slice(0,-1)}return n.fetchPropertyAndType(t,i).then(function(){var i=n.wrapChildQueryOptions(o,e,{},t);if(i){n.aggregateExpandSelect(r,i)}else{n.addToSelect(r,[e])}})})).then(function(){return r})};s.prototype.getBaseForPathReduction=function(){var e,t;if(!this.isRoot()){e=this.oContext.getBinding();t=e.getUpdateGroupId();if(t===this.getUpdateGroupId()||!this.oModel.isApiGroup(t)){return e.getBaseForPathReduction()}}return this.getResolvedPath()};s.prototype.getInheritableQueryOptions=function(){if(this.mLateQueryOptions){return n.merge({},this.mCacheQueryOptions,this.mLateQueryOptions)}return this.mCacheQueryOptions||n.getQueryOptionsForPath(this.oContext.getBinding().getInheritableQueryOptions(),this.sPath)};s.prototype.getGeneration=function(){return this.bRelative&&this.oContext.getGeneration&&this.oContext.getGeneration()||0};s.prototype.getQueryOptionsForPath=function(e,t){if(!n.isEmptyObject(this.mParameters)){return n.getQueryOptionsForPath(this.getQueryOptionsFromParameters(),e)}t??=this.oContext;if(!this.bRelative||!t.getQueryOptionsForPath){return{}}return t.getQueryOptionsForPath(n.buildPath(this.sPath,e))};s.prototype.getResumePromise=function(){return this.oResumePromise};s.prototype.hasPendingChangesInDependents=function(e,t){return this.getDependentBindings().some(function(n){var r=n.oCache,i,o=e;if(o){if(n.oContext.isEffectivelyKeptAlive()){return false}if(n.oContext.getIndex()!==undefined){o=false}}if(r!==undefined){if(r&&r.hasPendingChangesForPath("",false,o&&n.mParameters&&n.mParameters.$$ownRequest)){return true}}else if(n.hasPendingChangesForPath("")){return true}if(n.mCacheByResourcePath){i=Object.keys(n.mCacheByResourcePath).some(function(e){var i=n.mCacheByResourcePath[e];return(!t||e.startsWith(t.slice(1)))&&i!==r&&i.hasPendingChangesForPath("")});if(i){return true}}return n.hasPendingChangesInDependents(o,t)})||this.oModel.withUnresolvedBindings("hasPendingChangesInCaches",this.getResolvedPath().slice(1))};s.prototype.isMeta=function(){return false};s.prototype.isPatchWithoutSideEffects=function(){return this.mParameters.$$patchWithoutSideEffects||!this.isRoot()&&this.oContext&&this.oContext.getBinding().isPatchWithoutSideEffects()};s.prototype.isRefreshWithoutBubbling=function(){return this.oRefreshPromise&&this.oRefreshPromise.$preventBubbling};s.prototype.isUnchangedParameter=function(e,t){return this.mParameters[e]===t};s.prototype.onDelete=function(e){var t=this.findContextForCanonicalPath(e);if(t){this.resetChangesForPath(this.getRelativePath(t.getPath()),[]);this.oModel.getDependentBindings(t).forEach(function(e){e.resetChanges()});this.delete(null,e.slice(1),t)}};s.prototype.refreshDependentListBindingsWithoutCache=function(){return i.all(this.getDependentBindings().map(function(e){if(e.filter&&e.oCache===null){return e.refreshInternal("")}if(e.refreshDependentListBindingsWithoutCache){return e.refreshDependentListBindingsWithoutCache()}}))};s.prototype.removeReadGroupLock=function(){if(this.oReadGroupLock){this.oReadGroupLock.unlock(true);this.oReadGroupLock=undefined}};s.prototype.resetChangesInDependents=function(e,t){this.getDependentBindings().forEach(function(n){e.push(n.oCachePromise.then(function(e){if(e){e.resetChangesForPath("")}n.resetInvalidDataState()}).unwrap());if(n.mCacheByResourcePath){Object.keys(n.mCacheByResourcePath).forEach(function(e){if(!t||e.startsWith(t.slice(1))){n.mCacheByResourcePath[e].resetChangesForPath("")}})}n.resetChangesInDependents(e,t)})};s.prototype.resolveRefreshPromise=function(e){if(this.oRefreshPromise){this.oRefreshPromise.$resolve(e.catch(function(e){if(!e.canceled){throw e}}));this.oRefreshPromise=null}return e};s.prototype._resume=function(e){var t=this;function n(){t.bSuspended=false;if(t.oResumePromise){t.resumeInternal(true);t.oResumePromise.$resolve();t.oResumePromise=undefined}}if(this.oOperation){throw new Error("Cannot resume an operation binding: "+this)}if(!this.isRoot()){throw new Error("Cannot resume a relative binding: "+this)}if(!this.bSuspended){throw new Error("Cannot resume a not suspended binding: "+this)}if(e){this.createReadGroupLock(this.getGroupId(),true,1);this.oModel.addPrerenderingTask(n)}else{this.createReadGroupLock(this.getGroupId(),true);n()}};s.prototype.resume=function(){this._resume(false)};s.prototype.resumeAsync=function(){this._resume(true);return Promise.resolve(this.oResumePromise)};s.prototype.selectKeyProperties=function(e,t){n.selectKeyProperties(e,this.oModel.getMetaModel().getObject(t+"/"))};s.prototype.suspend=function(){var e;if(this.oOperation){throw new Error("Cannot suspend an operation binding: "+this)}if(!this.isRoot()){throw new Error("Cannot suspend a relative binding: "+this)}if(this.bSuspended){throw new Error("Cannot suspend a suspended binding: "+this)}if(this.hasPendingChanges(true)){throw new Error("Cannot suspend a binding with pending changes: "+this)}this.bSuspended=true;this.oResumePromise=new i(function(t){e=t});this.oResumePromise.$resolve=e;this.removeReadGroupLock();this.doSuspend()};s.prototype.updateAfterCreate=function(e,t){return i.all(this.getDependentBindings().map(function(n){return n.updateAfterCreate(e,t)}))};s.prototype.updateAggregatedQueryOptions=function(e){var t=this.mAggregatedQueryOptions,n=Object.keys(e),r=this;if(t){n=n.concat(Object.keys(t));n.forEach(function(n){if(r.bAggregatedQueryOptionsInitial||n!=="$select"&&n!=="$expand"){if(e[n]===undefined){delete t[n]}else{t[n]=e[n]}}});if(t.$select&&!t.$select.length){t.$select=[Object.keys(t.$expand)[0]]}}};s.prototype.visitSideEffects=function(e,t,r,i,o){var s=r?this.oModel.getDependentBindings(r):this.getDependentBindings();s.forEach(function(r){var s=n.buildPath(o,r.oOperation?"":n.getMetaPath(r.getPath())),a;if(r.oCache){a=n.stripPathPrefix(s,t);if(a.length){i.push(r.requestSideEffects(e,a))}}else{r.visitSideEffects(e,t,null,i,s)}})};function h(e){if(this){s.apply(this,arguments)}else{Object.assign(e,s.prototype)}}["adjustPredicate","destroy","getGeneration","hasPendingChangesForPath","isUnchangedParameter","updateAfterCreate"].forEach(function(e){h.prototype[e]=s.prototype[e]});return h},false);
//# sourceMappingURL=ODataParentBinding.js.map