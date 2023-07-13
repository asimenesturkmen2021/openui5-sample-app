/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/BindingParser","./BaseTreeModifier","./XmlTreeModifier","sap/base/util/ObjectPath","sap/ui/util/XMLHelper","sap/base/util/merge","sap/ui/core/Fragment"],function(t,e,n,r,i,o,a){"use strict";var u={targets:"jsControlTree",setVisible:function(t,e){if(t.setVisible){this.unbindProperty(t,"visible");t.setVisible(e)}else{throw new Error("Provided control instance has no setVisible method")}},getVisible:function(t){if(t.getVisible){return Promise.resolve(t.getVisible())}else{return Promise.reject(new Error("Provided control instance has no getVisible method"))}},setStashed:function(t,e){e=!!e;if(t.unstash){if(t.isStashed()===true&&e===false){t=t.unstash()}if(t.setVisible){this.setVisible(t,!e)}return t}else{throw new Error("Provided control instance has no unstash method")}},getStashed:function(t){if(t.isStashed){if(t.isStashed()){return Promise.resolve(true)}return this.getVisible(t).then(function(t){return!t})}return Promise.reject(new Error("Provided control instance has no isStashed method"))},bindProperty:function(t,e,n){t.bindProperty(e,n)},unbindProperty:function(t,e){if(t){t.unbindProperty(e,true)}},setProperty:function(e,n,r){var i=e.getMetadata().getPropertyLikeSetting(n);var o;var a;this.unbindProperty(e,n);try{o=t.complexParser(r,undefined,true)}catch(t){a=true}if(i){if(this._isSerializable(r)){if(o&&typeof o==="object"||a){r=this._escapeCurlyBracketsInString(r)}var u=i._sMutator;e[u](r)}else{throw new TypeError("Value cannot be stringified","sap.ui.core.util.reflection.JsControlTreeModifier")}}},getProperty:function(t,e){var n=t.getMetadata().getPropertyLikeSetting(e);var r;if(n){var i=n._sGetter;r=t[i]()}return Promise.resolve(r)},isPropertyInitial:function(t,e){return t.isPropertyInitial(e)},setPropertyBinding:function(t,e,n){this.unbindProperty(t,e);var r={};r[e]=n;return t.applySettings(r)},getPropertyBinding:function(t,e){return t.getBindingInfo(e)},createAndAddCustomData:function(t,e,n,r){return this.createControl("sap.ui.core.CustomData",r).then(function(r){this.setProperty(r,"key",e);this.setProperty(r,"value",n);return this.insertAggregation(t,"customData",r,0)}.bind(this))},getCustomDataInfo:function(t,e){var n;if(t.getCustomData){t.getCustomData().some(function(t){if(t.getKey()===e){n=t;return true}return false})}if(n){return{customData:n,customDataValue:n.getValue()}}else{return{}}},createControl:function(t,e,n,r,i){t=t.replace(/\./g,"/");if(this.bySelector(r,e)){var o="Can't create a control with duplicated ID "+(r.id||r);return Promise.reject(o)}var a;var u=sap.ui.require(t);if(u){a=Promise.resolve(u)}else{a=new Promise(function(e,n){sap.ui.require([t],function(t){e(t)},function(){n(new Error("Required control '"+t+"' couldn't be created asynchronously"))})})}return a.then(function(t){var n=this.getControlIdBySelector(r,e);return new t(n,i)}.bind(this))},applySettings:function(t,e){return Promise.resolve(t.applySettings(e))},_byId:function(t){return sap.ui.getCore().byId(t)},getId:function(t){return t.getId()},getParent:function(t){return t.getParent&&t.getParent()},getControlMetadata:function(t){return Promise.resolve(t&&t.getMetadata())},getControlType:function(t){return t&&t.getMetadata().getName()},setAssociation:function(t,e,n){var r=t.getMetadata().getAssociation(e);r.set(t,n)},getAssociation:function(t,e){var n=t.getMetadata().getAssociation(e);return n.get(t)},getAllAggregations:function(t){return Promise.resolve(t.getMetadata().getAllAggregations())},getAggregation:function(t,e){return this.findAggregation(t,e).then(function(e){if(e){return t[e._sGetter]()}return undefined})},insertAggregation:function(t,e,n,r){if(e==="customData"){return t.insertAggregation(e,n,r,true)}return this.findAggregation(t,e).then(function(e){if(e){if(e.multiple){var i=r||0;t[e._sInsertMutator](n,i)}else{t[e._sMutator](n)}}})},removeAggregation:function(t,e,n){if(e==="customData"){t.removeAggregation(e,n,true);return Promise.resolve()}return this.findAggregation(t,e).then(function(e){if(e){t[e._sRemoveMutator](n)}})},removeAllAggregation:function(t,e){if(e==="customData"){t.removeAllAggregation(e,true);return Promise.resolve()}return this.findAggregation(t,e).then(function(e){if(e){t[e._sRemoveAllMutator]()}})},getBindingTemplate:function(t,e){var n=t.getBindingInfo(e);return Promise.resolve(n&&n.template)},updateAggregation:function(t,e){return this.findAggregation(t,e).then(function(n){if(n&&t.getBinding(e)){t[n._sDestructor]();t.updateAggregation(e)}})},findIndexInParentAggregation:function(t){var e=this.getParent(t);if(!e){return Promise.resolve(-1)}return this.getParentAggregationName(t).then(function(t){return this.getAggregation(e,t)}.bind(this)).then(function(e){if(Array.isArray(e)){return e.indexOf(t)}else{return 0}})},getParentAggregationName:function(t){return Promise.resolve(t.sParentAggregationName)},findAggregation:function(t,e){return new Promise(function(n,r){if(t){if(t.getMetadata){var i=t.getMetadata();var o=i.getAllAggregations();if(o){n(o[e]);return}}}n()})},validateType:function(t,e,n,r){var i=e.type;return this.getAggregation(n,e.name).then(function(n){if(e.multiple===false&&n&&n.length>0){return false}return t.isA(i)})},instantiateFragment:function(t,e,n){var r=i.parse(t);return this._checkAndPrefixIdsInFragment(r,e).then(function(t){return a.load({definition:t,sId:n&&n.getId(),controller:n.getController()})}).then(function(t){if(t&&!Array.isArray(t)){t=[t]}return t||[]})},templateControlFragment:function(t,n,r){return e._templateFragment(t,n).then(function(t){var e=r&&r.getController()||undefined;return a.load({definition:t,controller:e})})},destroy:function(t,e){t.destroy(e)},_getFlexCustomData:function(t,e){var n=typeof t==="object"&&typeof t.data==="function"&&t.data("sap-ui-custom-settings");return r.get(["sap.ui.fl",e],n)},attachEvent:function(t,e,n,i){return new Promise(function(o,a){var u=r.get(n);if(typeof u!=="function"){a(new Error("Can't attach event because the event handler function is not found or not a function."))}o(t.attachEvent(e,i,u))})},detachEvent:function(t,e,n){return new Promise(function(i,o){var a=r.get(n);if(typeof a!=="function"){o(new Error("Can't attach event because the event handler function is not found or not a function."))}i(t.detachEvent(e,a))})},bindAggregation:function(t,e,n){return Promise.resolve(t.bindAggregation(e,n))},unbindAggregation:function(t,e){return Promise.resolve(t.unbindAggregation(e))},getExtensionPointInfo:function(t,e){var r=e._xContent?e._xContent:e;return n.getExtensionPointInfo(t,r).then(function(t){if(t){t.index--;t.parent=t.parent&&this._byId(e.createId(t.parent.getAttribute("id")));t.defaultContent=t.defaultContent.map(function(t){var n=e.createId(t.getAttribute("id"));return this._byId(n)}.bind(this)).filter(function(t){return!!t})}return t}.bind(this))}};return o({},e,u)},true);
//# sourceMappingURL=JsControlTreeModifier.js.map