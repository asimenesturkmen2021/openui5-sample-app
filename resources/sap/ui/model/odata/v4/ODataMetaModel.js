/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./AnnotationHelper","./ValueListType","./lib/_Helper","sap/base/assert","sap/base/Log","sap/base/util/isEmptyObject","sap/base/util/JSTokenizer","sap/base/util/ObjectPath","sap/ui/base/ManagedObject","sap/ui/base/SyncPromise","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/ClientListBinding","sap/ui/model/Context","sap/ui/model/ContextBinding","sap/ui/model/MetaModel","sap/ui/model/PropertyBinding","sap/ui/model/odata/OperationMode","sap/ui/model/odata/type/Boolean","sap/ui/model/odata/type/Byte","sap/ui/model/odata/type/Date","sap/ui/model/odata/type/DateTimeOffset","sap/ui/model/odata/type/Decimal","sap/ui/model/odata/type/Double","sap/ui/model/odata/type/Guid","sap/ui/model/odata/type/Int16","sap/ui/model/odata/type/Int32","sap/ui/model/odata/type/Int64","sap/ui/model/odata/type/Raw","sap/ui/model/odata/type/SByte","sap/ui/model/odata/type/Single","sap/ui/model/odata/type/Stream","sap/ui/model/odata/type/String","sap/ui/model/odata/type/TimeOfDay","sap/ui/thirdparty/URI"],function(e,t,n,i,r,o,a,s,u,f,l,c,d,p,h,g,y,m,v,$,b,C,O,M,P,w,E,x,U,T,S,A,j,L,R){"use strict";var D=u.extend("sap.ui.model.odata.v4._any",{metadata:{properties:{any:"any"}}}),I,V=new Map,q=r.Level.DEBUG,N=/\$\(/g,k=/^-?\d+$/,B="sap.ui.model.odata.v4.ODataMetaModel",W=/\(.*\)$/,F=new U,_=/\$\)/g,G=new Map,K={messageChange:true},z={"Edm.Boolean":{Type:v},"Edm.Byte":{Type:$},"Edm.Date":{Type:b},"Edm.DateTimeOffset":{constraints:{$Precision:"precision"},Type:C},"Edm.Decimal":{constraints:{"@Org.OData.Validation.V1.Minimum/$Decimal":"minimum","@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive":"minimumExclusive","@Org.OData.Validation.V1.Maximum/$Decimal":"maximum","@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive":"maximumExclusive",$Precision:"precision",$Scale:"scale"},Type:O},"Edm.Double":{Type:M},"Edm.Guid":{Type:P},"Edm.Int16":{Type:w},"Edm.Int32":{Type:E},"Edm.Int64":{Type:x},"Edm.SByte":{Type:T},"Edm.Single":{Type:S},"Edm.Stream":{Type:A},"Edm.String":{constraints:{"@com.sap.vocabularies.Common.v1.IsDigitSequence":"isDigitSequence",$MaxLength:"maxLength"},Type:j},"Edm.TimeOfDay":{constraints:{$Precision:"precision"},Type:L}},H={},Q="@com.sap.vocabularies.Common.v1.ValueList",J="@com.sap.vocabularies.Common.v1.ValueListMapping",X="@com.sap.vocabularies.Common.v1.ValueListReferences",Y="@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers",Z="@com.sap.vocabularies.Common.v1.ValueListWithFixedValues",ee=r.Level.WARNING,te,ne=g.extend("sap.ui.model.odata.v4.ODataMetaModel",{constructor:pe}),ie,re;function oe(e,t,n,i){var r,o=e.mSchema2MetadataUrl[t];if(!o){o=e.mSchema2MetadataUrl[t]={};o[n]=false}else if(!(n in o)){r=Object.keys(o)[0];if(o[r]){ce(e,"A schema cannot span more than one document: "+t+" - expected reference URI "+r+" but instead saw "+n,i)}o[n]=false}}function ae(e,t,n,i){var r,o,a,s;function u(e){var r,a;if(!(n in e)){i(ee,o," does not contain ",n);return}i(q,"Including ",n," from ",o);for(a in e){if(a[0]!=="$"&&de(a)===n){r=e[a];t[a]=r;le(r,t.$Annotations)}}}if(n in t){return t[n]}s=e.mSchema2MetadataUrl[n];if(s){a=Object.keys(s);if(a.length>1){ce(e,"A schema cannot span more than one document: "+"schema is referenced by following URLs: "+a.join(", "),n)}o=a[0];s[o]=true;i(q,"Namespace ",n," found in $Include of ",o);r=e.mMetadataUrl2Promise[o];if(!r){i(q,"Reading ",o);r=e.mMetadataUrl2Promise[o]=f.resolve(e.oRequestor.read(o)).then(e.validate.bind(e,o))}r=r.then(u);if(n in t){return t[n]}t[n]=r;return r}}function se(e,t){if(e===t){return""}if(e.startsWith(t)&&e[t.length]==="#"&&!e.includes("@",t.length)){return e.slice(t.length+1)}}function ue(e){var t=se(e,J);return t!==undefined?t:se(e,Q)}function fe(e,t){return t.some(function(t){return e==="$ReturnType"?t.$ReturnType:t.$Parameter&&t.$Parameter.some(function(t){return t.$Name===e})})}function le(e,t,n){var i;function r(e,t){var i;for(i in t){if(n||!(i in e)){e[i]=t[i]}}}for(i in e.$Annotations){if(!(i in t)){t[i]={}}r(t[i],e.$Annotations[i])}delete e.$Annotations}function ce(e,t,n){var i=new Error(n+": "+t);e.oModel.reportError(t,B,i);throw i}function de(e){return e.slice(0,e.lastIndexOf(".")+1)}te=h.extend("sap.ui.model.odata.v4.ODataMetaContextBinding",{constructor:function(e,t,n){i(!n||n.getModel()===e,"oContext must belong to this model");h.call(this,e,t,n)},initialize:function(){var e=this.oModel.createBindingContext(this.sPath,this.oContext);this.bInitial=false;if(e!==this.oElementContext){this.oElementContext=e;this._fireChange()}},setContext:function(e){i(!e||e.getModel()===this.oModel,"oContext must belong to this model");if(e!==this.oContext){this.oContext=e;if(!this.bInitial){this.initialize()}}}});ie=d.extend("sap.ui.model.odata.v4.ODataMetaListBinding",{constructor:function(){d.apply(this,arguments)},_fireFilter:function(){},_fireSort:function(){},checkUpdate:function(e){var t=this.oList.length;this.update();if(e||this.oList.length!==t){this._fireChange({reason:c.Change})}},fetchContexts:function(){var e,t=this.getResolvedPath(),n=this;if(!t){return f.resolve([])}e=t.endsWith("@");if(!e&&!t.endsWith("/")){t+="/"}return this.oModel.fetchObject(t).then(function(i){if(!i){return[]}if(e){t=t.slice(0,-1)}return Object.keys(i).filter(function(t){return t[0]!=="$"&&e!==(t[0]!=="@")}).map(function(e){return new p(n.oModel,t+e)})})},getContexts:function(e,t){this.iCurrentStart=e||0;this.iCurrentLength=Math.min(t||Infinity,this.iLength-this.iCurrentStart);return this.getCurrentContexts()},getCurrentContexts:function(){var e=[],t,n=this.iCurrentStart+this.iCurrentLength;for(t=this.iCurrentStart;t<n;t+=1){e.push(this.oList[this.aIndices[t]])}if(this.oList.dataRequested){e.dataRequested=true}return e},setContexts:function(e){this.oList=e;this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength()},update:function(){var e=[],t=this.fetchContexts(),n=this;if(t.isFulfilled()){e=t.getResult()}else{t.then(function(e){n.setContexts(e);n._fireChange({reason:c.Change})});e.dataRequested=true}this.setContexts(e)}});re=y.extend("sap.ui.model.odata.v4.ODataMetaPropertyBinding",{constructor:function(){y.apply(this,arguments);this.vValue=undefined},checkUpdate:function(e,t){var n,i=this;function r(n){if(e||n!==i.vValue){i.vValue=n;i._fireChange({reason:t||c.Change})}return n}n=this.oModel.fetchObject(this.sPath,this.oContext,this.mParameters).then(r);if(this.mParameters&&this.mParameters.$$valueAsPromise&&n.isPending()){r(n.unwrap())}else if(n.isRejected()){n.unwrap()}},getValue:function(){return this.vValue},setContext:function(e){if(this.oContext!==e){this.oContext=e;if(this.bRelative){this.checkUpdate(false,c.Context)}}},setValue:function(){throw new Error("Unsupported operation: ODataMetaPropertyBinding#setValue")}});function pe(e,t,n,i,r,o){g.call(this);this.aAnnotationUris=n&&!Array.isArray(n)?[n]:n;this.sDefaultBindingMode=l.OneTime;this.mETags={};this.sLanguage=o;this.oLastModified=new Date(0);this.oMetadataPromise=null;this.oModel=i;this.mMetadataUrl2Promise={};this.oRequestor=e;this.mSchema2MetadataUrl={};this.mSupportedBindingModes={OneTime:true,OneWay:true};this.bSupportReferences=r!==false;this.mUnsupportedFilterOperators={All:true,Any:true};this.sUrl=t}ne.prototype.$$valueAsPromise=true;ne.prototype._mergeAnnotations=function(e,t){var n=this;this.validate(this.sUrl,e);e.$Annotations={};Object.keys(e).forEach(function(t){if(e[t].$kind==="Schema"){oe(n,t,n.sUrl);le(e[t],e.$Annotations)}});t.forEach(function(t,i){var r,o;n.validate(n.aAnnotationUris[i],t);for(o in t){if(o[0]!=="$"){if(o in e){ce(n,"A schema cannot span more than one document: "+o,n.aAnnotationUris[i])}r=t[o];e[o]=r;if(r.$kind==="Schema"){oe(n,o,n.aAnnotationUris[i]);le(r,e.$Annotations,true)}}}})};ne.prototype.attachEvent=function(e,t,n,i){if(!(e in K)){throw new Error("Unsupported event '"+e+"': v4.ODataMetaModel#attachEvent")}return g.prototype.attachEvent.apply(this,arguments)};ne.prototype.bindContext=function(e,t){return new te(this,e,t)};ne.prototype.bindList=function(e,t,n,i){return new ie(this,e,t,n,i)};ne.prototype.bindProperty=function(e,t,n){return new re(this,e,t,n)};ne.prototype.bindTree=function(e,t,n,i,r){throw new Error("Unsupported operation: v4.ODataMetaModel#bindTree")};ne.prototype.fetchCanonicalPath=function(e){return this.fetchUpdateData("",e).then(function(t){if(!t.editUrl){throw new Error(e.getPath()+": No canonical path for transient entity")}if(t.propertyPath){throw new Error("Context "+e.getPath()+" does not point to an entity. It should be "+t.entityPath)}return"/"+t.editUrl})};ne.prototype.fetchData=function(){return this.fetchEntityContainer().then(function(e){return JSON.parse(JSON.stringify(e))})};ne.prototype.fetchEntityContainer=function(e){var t,n=this;if(!this.oMetadataPromise){t=[f.resolve(this.oRequestor.read(this.sUrl,false,e))];if(this.aAnnotationUris){this.aAnnotationUris.forEach(function(i){t.push(f.resolve(n.oRequestor.read(i,true,e)))})}if(!e){this.oMetadataPromise=f.all(t).then(function(e){var t=e[0];n._mergeAnnotations(t,e.slice(1));return t})}}return this.oMetadataPromise};ne.prototype.fetchObject=function(e,t,n){var i=this.resolve(e,t),o=this;if(!i){r.error("Invalid relative path w/o context",e,B);return f.resolve(null)}return this.fetchEntityContainer().then(function(u){var l,c,d,h,g,y,m,v,$,b;function C(e,t,n){var i,r,o,a,s="";if(t){r=t.indexOf("@@");if(r>0){t=t.slice(0,r)}}else{t=e}n=n||"";if(l){m=a=b.filter(P);if(a.length!==1){return w(ee,"Expected a single overload, but found "+a.length)}if(l!==H){s=a[0].$Parameter[0].$isCollection?"Collection("+l+")":l}o=$+"("+s+")"+n;if(u.$Annotations[o]){if(t==="@"){b=u.$Annotations[o];i=u.$Annotations[$+n];if(i){b=Object.assign({},i,b)}return false}if(t in u.$Annotations[o]){$=o;b=u;return true}}}$+=n;b=u;return true}function O(e,t){var i,r,u,f=e.indexOf("@",2);if(f>-1){return w(ee,"Unsupported path after ",e.slice(0,f))}e=e.slice(2);u=e.indexOf("(");if(u>0){if(!e.endsWith(")")){return w(ee,"Expected ')' instead of '",e.slice(-1),"'")}try{r=a.parseJS("["+e.slice(u+1,-1).replace(N,"{").replace(_,"}")+"]")}catch(e){return w(ee,e.message,": ",e.text.slice(1,e.at),"<--",e.text.slice(e.at,-1))}e=e.slice(0,u)}i=e[0]==="."?s.get(e.slice(1),n.scope):n&&s.get(e,n.scope)||(e==="requestCurrencyCodes"||e==="requestUnitsOfMeasure"?o[e].bind(o):s.get(e));if(typeof i!=="function"){return w(ee,e," is not a function but: "+i)}try{b=i(b,{$$valueAsPromise:n&&n.$$valueAsPromise,arguments:r,context:new p(o,t),schemaChildName:v,overload:m.length===1?m[0]:undefined})}catch(t){w(ee,"Error calling ",e,": ",t)}return true}function M(e,t){var n;if(e==="$ReturnType"){if(t.$ReturnType){b=t.$ReturnType;return true}}else if(e&&t.$Parameter){n=t.$Parameter.filter(function(t){return t.$Name===e});if(n.length){b=n[0];return true}}return false}function P(e){return!e.$IsBound&&l===H||e.$IsBound&&l===e.$Parameter[0].$Type}function w(e){var t;if(r.isLoggable(e,B)){t=Array.isArray(h)?h.join("/"):h;r[e===q?"debug":"warning"](Array.prototype.slice.call(arguments,1).join("")+(t?" at /"+t:""),i,B)}if(e===ee){b=undefined}return false}function E(e,t){var n;function i(){h=h||$&&t&&$+"/"+t;return w.apply(this,arguments)}l=b&&b.$Type||l;if(o.bSupportReferences&&!(e in u)){n=de(e);b=ae(o,u,n,i)}if(e in u){$=g=v=e;b=m=u[v];if(!f.isThenable(b)){return true}}if(f.isThenable(b)&&b.isPending()){return i(q,"Waiting for ",n)}return i(ee,"Unknown qualified name ",e)}function x(e,t,n){var i,r,o;if(e==="$Annotations"){return w(ee,"Invalid segment: $Annotations")}e=e.replaceAll("%2F","/");if(t&&typeof b==="object"&&e in b){if(e[0]==="$"||k.test(e)){y=false}}else{i=e.indexOf("@@");if(i<0){if(e.endsWith("@sapui.name")){i=e.length-11}else{i=e.indexOf("@")}}if(i>0){if(!x(e.slice(0,i),t,n)){return false}e=e.slice(i);o=true;if(b&&(b.$kind==="EntitySet"||b.$kind==="Singleton")){c=b}}if(typeof b==="string"&&!(o&&(e==="@sapui.name"||e[1]==="@"))&&!(y&&m&&m.$kind==="EnumType")&&!U(b,n.slice(0,t))){return false}if(y){if(e[0]==="$"&&e!=="$Parameter"&&e!=="$ReturnType"||k.test(e)){y=false}else{r=typeof b==="object";if(o){}else if(e[0]!=="@"&&e.includes(".",1)){return E(e)}else if(r&&"$Type"in b){if(!E(b.$Type,"$Type")){return false}}else if(r&&"$Action"in b){if(!E(b.$Action,"$Action")){return false}l=H}else if(r&&"$Function"in b){if(!E(b.$Function,"$Function")){return false}l=H}else if(!t){$=g=v=v||u.$EntityContainer;b=m=m||u[v];if(Array.isArray(b)){if(l){b=b.filter(P)}if(M(e,b[0])){return true}}if(e&&e[0]!=="@"&&!(e in m)){return w(ee,"Unknown child ",e," of ",v)}}if(Array.isArray(b)){if(e==="$Parameter"){return true}if(e.startsWith("@$ui5.overload@")){e=e.slice(14);o=true}if(o){if(e[1]!=="@"&&!C(e)){return false}}else{if(e!==n[t]&&n[t][e.length+1]!=="@"&&fe(e,b)){g=e;return C(e,n[t].slice(e.length),"/"+g)}if(l){b=b.filter(P)}if(e==="@$ui5.overload"){return true}if(b.length!==1){return w(ee,"Expected a single overload, but found "+b.length)}if(M(e,b[0])){return true}b=b[0].$ReturnType;$+="/0/$ReturnType";if(b){if(e==="value"&&!(u[b.$Type]&&u[b.$Type].value)){g=undefined;return true}if(!E(b.$Type,"$Type")){return false}}if(!e){return true}}}}}if(!e){return t+1>=n.length||w(ee,"Invalid empty segment")}if(e[0]==="@"){if(e==="@sapui.name"){b=g;if(b===undefined){w(ee,"Unsupported path before @sapui.name")}else if(t+1<n.length){w(ee,"Unsupported path after @sapui.name")}return false}if(e[1]==="@"){if(t+1<n.length){return w(ee,"Unsupported path after ",e)}return O(e,[""].concat(n.slice(0,t),n[t].slice(0,i)).join("/"))}}if(y&&e[0]==="@"){l=b&&b.$Type||l;b=u.$Annotations[$]||{};y=false}else if(e==="$"&&t+1<n.length){return w(ee,"Unsupported path after $")}else if(!b||typeof b!=="object"){b=undefined;return!d&&w(q,"Invalid segment: ",e)}}if(e!=="@"&&e!=="$"){if(e[0]==="@"){d=true}g=y||e[0]==="@"?e:undefined;$=y?$+"/"+e:undefined;b=b[e]}return true}function U(e,t){var n;if(h){return w(ee,"Invalid recursion")}h=t;d=false;y=true;b=u;if(c){if(!e){b=c;c=h=undefined;return true}v=c.$Type;c=m=undefined}n=e.split("/").every(x);h=undefined;return n}if(!U(i.slice(1))&&f.isThenable(b)){b=b.then(function(){return o.fetchObject(e,t,n)})}return b})};ne.prototype.fetchUI5Type=function(e,t){var n=this.getMetaContext(e),i=this;if(e.endsWith("/$count")){I=I||new x;return f.resolve(I)}return this.fetchObject(undefined,n).catch(this.oModel.getReporter()).then(function(a){var s=F,u;if(!a){r.warning("No metadata for path '"+e+"', using "+s.getName(),undefined,B);return s}if(t){if(o(t)){t=undefined}else if("parseKeepsEmptyString"in t&&a.$Type!=="Edm.String"){if(Object.keys(t).length===1){t=undefined}else{t=Object.assign({},t);delete t.parseKeepsEmptyString}}}if(!t&&a["$ui5.type"]){return a["$ui5.type"]}if(a.$isCollection){r.warning("Unsupported collection type, using "+s.getName(),e,B)}else{u=z[a.$Type];if(u){s=new u.Type(t,i.getConstraints(a,n.getPath()))}else{r.warning("Unsupported type '"+a.$Type+"', using "+s.getName(),e,B)}}if(!t){a["$ui5.type"]=s}return s})};ne.prototype.fetchUpdateData=function(e,t,i){var r=t.getModel(),o=r.resolve(e,t),a=this;function s(e){var t=new Error(o+": "+e);r.reportError(e,B,t);throw t}return this.fetchObject(n.getMetaPath(o)).then(function(){return a.fetchEntityContainer()}).then(function(r){var a,u=r[r.$EntityContainer],l,c,d,p,h=false,g,y,m,v;function $(e){var t=e.indexOf("(");return t>=0?e.slice(t):""}function b(e){a.push({path:g,prefix:e,type:v})}function C(e){var t=e.indexOf("(");return t>=0?e.slice(0,t):e}function O(e){if(e.includes("($uid=")){b(C(e))}else{a.push(e)}}m=o.slice(1).split("/");p=m.shift();g="/"+p;l=g;d=decodeURIComponent(C(p));c=u[d];if(!c){s("Not an entity set: "+d)}v=r[c.$Type];e="";y="";a=[];O(p);m.forEach(function(t){var i,o;g+="/"+t;if(k.test(t)){b(a.pop());l+="/"+t}else{o=decodeURIComponent(C(t));y=n.buildPath(y,o);i=h?{}:v[o];if(!i){if(o.includes("@")){if(o.includes("@$ui5.")){s("Read-only path must not be updated")}h=true;i={}}else{s("Not a (navigation) property: "+o)}}v=r[i.$Type];if(i.$kind==="NavigationProperty"){if(c.$NavigationPropertyBinding&&y in c.$NavigationPropertyBinding){d=c.$NavigationPropertyBinding[y];c=u[d];y="";a=[encodeURIComponent(d)+$(t)];if(!i.$isCollection){b(a.pop())}}else{O(t)}l=g;e=""}else{e=n.buildPath(e,t)}}});if(i){return f.resolve({editUrl:undefined,entityPath:l,propertyPath:e})}return f.all(a.map(function(e){if(typeof e==="string"){return e}return t.fetchValue(e.path).then(function(t){var r;if(!t){s("No instance to calculate key predicate at "+e.path)}if(t["@$ui5.context.isTransient"]){i=true;return undefined}r=n.getPrivateAnnotation(t,"predicate");if(!r){s("No key predicate known at "+e.path)}return e.prefix+r},function(t){s(t.message+" at "+e.path)})})).then(function(t){return{editUrl:i?undefined:t.join("/"),entityPath:l,propertyPath:e}})})};ne.prototype.fetchValueListMappings=function(e,t,i,r){var o=this,a=e.getMetaModel();function s(){var e=r[0],n="";if(r.length!==1){throw new Error("Expected a single overload, but found "+r.length)}if(e.$IsBound){n=e.$Parameter[0].$isCollection?"Collection("+e.$Parameter[0].$Type+")":e.$Parameter[0].$Type}return t+"("+n+")"}return a.fetchEntityContainer().then(function(r){var u,f=r.$Annotations,l,c=n.namespace(t),d={},p=o===a,h,g;if(i.$Name){l=s()+"/"+i.$Name;g=t+"/"+i.$Name}h=Object.keys(f).filter(function(t){if(n.namespace(t)===c){if(l?t===l||t===g:o.getObject("/"+t)===i){return true}if(p||g&&n.getMetaPath(t)===g){return false}throw new Error("Unexpected annotation target '"+t+"' with namespace of data service in "+e.sServiceUrl)}return false});if(!h.length){throw new Error("No annotation '"+Q.slice(1)+"' in "+e.sServiceUrl)}if(h.length===1){u=f[h[0]]}else{u=Object.assign({},f[g],f[l])}Object.keys(u).forEach(function(t){var n=ue(t);if(n!==undefined){d[n]=u[t];["CollectionRoot","SearchSupported"].forEach(function(n){if(n in u[t]){throw new Error("Property '"+n+"' is not allowed in annotation '"+t.slice(1)+"' for target '"+h[0]+"' in "+e.sServiceUrl)}})}else if(!p){throw new Error("Unexpected annotation '"+t.slice(1)+"' for target '"+h[0]+"' with namespace of data service in "+e.sServiceUrl)}});return d})};ne.prototype.fetchValueListType=function(e){var n=this.getMetaContext(e),i=this;return this.fetchObject(undefined,n).then(function(r){var o,a;if(!r){throw new Error("No metadata for "+e)}o=i.getObject("@",n);if(o[Z]){return t.Fixed}for(a in o){if(se(a,X)!==undefined||se(a,J)!==undefined){return t.Standard}if(se(a,Q)!==undefined){return o[a].SearchSupported===false?t.Fixed:t.Standard}}return t.None})};ne.prototype.getAbsoluteServiceUrl=function(e){var t=new R(this.sUrl).absoluteTo(document.baseURI).pathname().toString();return new R(e).absoluteTo(t).filename("").toString()};ne.prototype.getAllPathReductions=function(e,t,i,r){var o=t.split("/").length,a,s={},u=e.split("/"),f=this;function l(e,t,a,u){var c,d,p;function h(n){if(!i){l(e,t,p-1,true)}if(u){t=t.slice();e=e.slice()}t.splice(p,n);e.splice(p,n);if(!i){s[e.join("/")]=true}}for(p=a;p>=o;p-=1){c=k.test(e[p+1])?p+2:p+1;if(c<e.length&&t[p].$Partner===e[c]&&!t[c].$isCollection&&t[c].$Partner===e[p].replace(W,"")){h(c-p+1)}else if(Array.isArray(t[p])&&e[p+1]==="$Parameter"){d=f.getObject(n.getMetaPath(e.slice(0,p+1).join("/")+"/@$ui5.overload"));if(d.length===1&&d[0].$Parameter[0].$Name===e[p+2]){h(3)}}else if(r&&t[p].$isCollection){break}}}a=u.map(function(e,t){return t<o||e[0]==="#"||e[0]==="@"||k.test(e)||e==="$Parameter"?{}:f.getObject(n.getMetaPath(u.slice(0,t+1).join("/")))||{}});s[e]=true;if(!(r&&a[u.length-1].$isCollection)){l(u,a,u.length-2)}return i?u.join("/"):Object.keys(s)};ne.prototype.getConstraints=function(e,t){var n,i,r,o=z[e.$Type];function a(e,t){if(t!==undefined){i=i||{};i[e]=t}}if(o){r=o.constraints;for(n in r){a(r[n],n[0]==="@"?this.getObject(t+n):e[n])}if(e.$Nullable===false){a("nullable",false)}}return i};ne.prototype.getData=n.createGetMethod("fetchData");ne.prototype.getETags=function(){return this.mETags};ne.prototype.getLastModified=function(){return this.oLastModified};ne.prototype.getMetaContext=function(e){return new p(this,n.getMetaPath(e))};ne.prototype.getMetaPath=function(e){return n.getMetaPath(e)};ne.prototype.getObject=n.createGetMethod("fetchObject");ne.prototype.getOrCreateSharedModel=function(e,t,n){var i,r;e=this.getAbsoluteServiceUrl(e);i=!!n+e;r=G.get(i);if(!r){r=new this.oModel.constructor({autoExpandSelect:n,groupId:t,httpHeaders:this.oModel.getHttpHeaders(),metadataUrlParams:this.sLanguage&&{"sap-language":this.sLanguage},operationMode:m.Server,serviceUrl:e,sharedRequests:true});G.set(i,r)}return r};ne.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#getOriginalProperty")};ne.prototype.getProperty=ne.prototype.getObject;ne.prototype.getReducedPath=function(e,t){return this.getAllPathReductions(e,t,true,true)};ne.prototype.getUI5Type=n.createGetMethod("fetchUI5Type",true);ne.prototype.getUnitOrCurrencyPath=function(e){var t=this.getObject("@",this.getMetaContext(e)),n=t&&(t["@Org.OData.Measures.V1.Unit"]||t["@Org.OData.Measures.V1.ISOCurrency"]);return n&&n.$Path};ne.prototype.getValueListType=n.createGetMethod("fetchValueListType",true);ne.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#isList")};ne.prototype.refresh=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#refresh")};ne.prototype.requestCodeList=function(e,t,i){var o=this.fetchEntityContainer().getResult(),a=o[o.$EntityContainer],s=this;if(i&&i.context){if(i.context.getModel()!==this||i.context.getPath()!=="/"){throw new Error("Unsupported context: "+i.context)}}if(t!==undefined&&t!==a){throw new Error("Unsupported raw value: "+t)}return this.requestObject("/@com.sap.vocabularies.CodeList.v1."+e).then(function(e){var t,i,o,a,u,f;if(!e){return null}f=n.setLanguage(e.Url,s.sLanguage);t=s.getAbsoluteServiceUrl(f)+"#"+e.CollectionPath;a=V.get(t);if(a){return a}o=s.getOrCreateSharedModel(f,"$direct");i=o.getMetaModel();u="/"+e.CollectionPath+"/";a=i.requestObject(u).then(function(t){var n=u+"@Org.OData.Core.V1.AlternateKeys",a=i.getObject(n),s,f=m(t.$Key),l=u+f+"@com.sap.vocabularies.Common.v1.",c,d,p=u+f+"@com.sap.vocabularies.CodeList.v1.StandardCode/$Path",h,g;function y(t,n){var i=n.getProperty(f),o={Text:n.getProperty(g),UnitSpecificScale:n.getProperty(d)};if(h){o.StandardCode=n.getProperty(h)}if(o.UnitSpecificScale===null){r.error("Ignoring customizing w/o unit-specific scale for code "+i+" from "+e.CollectionPath,e.Url,B)}else{t[i]=o}return t}function m(e){var t;if(e&&e.length===1){t=e[0]}else{throw new Error("Single key expected: "+u)}return typeof t==="string"?t:t[Object.keys(t)[0]]}if(a){if(a.length!==1){throw new Error("Single alternative expected: "+n)}else if(a[0].Key.length!==1){throw new Error("Single key expected: "+n+"/0/Key")}f=a[0].Key[0].Name.$PropertyPath}d=i.getObject(l+"UnitSpecificScale/$Path");g=i.getObject(l+"Text/$Path");c=[f,d,g];h=i.getObject(p);if(h){c.push(h)}s=o.bindList("/"+e.CollectionPath,null,null,null,{$select:c});return s.requestContexts(0,Infinity).then(function(t){if(!t.length){r.error("Customizing empty for ",o.sServiceUrl+e.CollectionPath,B)}return t.reduce(y,{})}).finally(function(){s.destroy()})});V.set(t,a);return a})};ne.prototype.requestCurrencyCodes=function(e,t){return this.requestCodeList("CurrencyCodes",e,t)};ne.prototype.requestData=n.createRequestMethod("fetchData");ne.prototype.requestObject=n.createRequestMethod("fetchObject");ne.prototype.requestUI5Type=n.createRequestMethod("fetchUI5Type");ne.prototype.requestUnitsOfMeasure=function(e,t){return this.requestCodeList("UnitsOfMeasure",e,t)};ne.prototype.requestValue4Annotation=function(t,n,i){var r=new D({any:e.value(t,{context:this.createBindingContext(n)}),bindingContexts:i,models:i.getModel()}),o=r.getBinding("any"),a;if(o){if(o.getBindings){a=Promise.all(o.getBindings().map(function(e){return e.requestValue()}))}else{a=o.requestValue()}}else{a=Promise.resolve()}return a.then(function(){return r.getAny()})};ne.prototype.requestValueListInfo=function(e,t,i){var r=n.getMetaPath(e),a=r.slice(0,r.lastIndexOf("/")).replace("/$Parameter",""),s=a.slice(a.lastIndexOf("/")+1),u=this;if(!s.includes(".")){s=undefined}return Promise.all([s||this.requestObject(a+"/@sapui.name"),this.requestObject(r),this.requestObject(r+"@"),this.requestObject(r+Z),this.requestObject(a+"/@$ui5.overload")]).then(function(a){var s=a[2],f=a[3],l={},c=a[1],d={};function p(i,r,o,a){if("CollectionRoot"in i){a=u.getOrCreateSharedModel(i.CollectionRoot,undefined,t);if(d[r]&&d[r].$model===a){l[r]=undefined}}if(l[r]){throw new Error("Annotations '"+Q.slice(1)+"' with identical qualifier '"+r+"' for property "+e+" in "+l[r]+" and "+o)}l[r]=o;i=n.clone(i);i.$model=a;delete i.CollectionRoot;delete i.SearchSupported;d[r]=i}if(!c){throw new Error("No metadata for "+e)}return Promise.all(Object.keys(s).filter(function(e){return se(e,X)!==undefined}).map(function(e){var n=s[e];return Promise.all(n.map(function(e){var n=u.getOrCreateSharedModel(e,undefined,t);return u.fetchValueListMappings(n,a[0],c,a[4]).then(function(e){return{valueListMappingByQualifier:e,$model:n}})})).then(function(e){n.forEach(function(t,n){var i=e[n].valueListMappingByQualifier;Object.keys(i).forEach(function(r){p(i[r],r,t,e[n].$model)})})})})).then(function(){var t=s[Y];Object.keys(s).filter(function(e){return ue(e)!==undefined}).forEach(function(e){p(s[e],ue(e),u.sUrl,u.oModel)});if(o(d)){throw new Error("No annotation '"+X.slice(1)+"' for "+e)}return t&&i&&i.getBinding?u.filterValueListRelevantQualifiers(d,t,r+Y,i):d}).then(function(t){var n,i;if(f){n=Object.keys(t);if(n.length!==1){throw new Error("Annotation '"+Z.slice(1)+"' but not exactly one '"+Q.slice(1)+"' for property "+e)}i=t[n[0]];i.$qualifier=n[0];return{"":i}}return t})})};ne.prototype.filterValueListRelevantQualifiers=function(e,t,n,i){return this.requestValue4Annotation(t,n,i).then(function(t){var n={};t.forEach(function(t){if(t in e){n[t]=e[t]}});return n})};ne.prototype.requestValueListType=n.createRequestMethod("fetchValueListType");ne.prototype.resolve=function(e,t){var n,i;if(!e){return t?t.getPath():undefined}i=e[0];if(i==="/"){return e}if(!t){return undefined}if(i==="."){if(e[1]!=="/"){throw new Error("Unsupported relative path: "+e)}e=e.slice(2)}n=t.getPath();return i==="@"||n.endsWith("/")?n+e:n+"/"+e};ne.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#setLegacySyntax")};ne.prototype.toString=function(){return B+": "+this.sUrl};ne.prototype.validate=function(e,t){var n,i,r,o,a,s;if(!this.bSupportReferences){return t}for(a in t.$Reference){o=t.$Reference[a];a=new R(a).absoluteTo(this.sUrl).toString();if("$IncludeAnnotations"in o){ce(this,"Unsupported IncludeAnnotations",e)}for(s in o.$Include){r=o.$Include[s];if(r in t){ce(this,"A schema cannot span more than one document: "+r+" - is both included and defined",e)}oe(this,r,a,e)}}i=t.$LastModified?new Date(t.$LastModified):null;this.mETags[e]=t.$ETag?t.$ETag:i;n=t.$Date?new Date(t.$Date):new Date;i=i||n;if(this.oLastModified<i){this.oLastModified=i}delete t.$Date;delete t.$ETag;delete t.$LastModified;return t};return ne});
//# sourceMappingURL=ODataMetaModel.js.map