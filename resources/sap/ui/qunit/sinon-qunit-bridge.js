/*
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";var n=QUnit.module;function t(n){a(this._oSandbox);throw n}function o(n){throw new Error("sinon.assert.fail outside of test: "+n)}function s(n,t){Object.keys(t).forEach(function(o){n[o]=t[o]});return n}function i(){}function e(n){throw new Error("sinon.assert.pass outside of test: "+n)}function r(n){if(n&&typeof n.then==="function"){return n.then(r.bind(this),t.bind(this))}a(this._oSandbox);return n}function a(n){n.verifyAndRestore();sinon.assert.fail=o;sinon.assert.pass=e}QUnit.module=function(o,e,a){var c,f,u;if(typeof e==="function"||typeof a==="function"){n.call(this,o);throw new Error("QUnit.module with nested callback not supported")}c=e&&e.afterEach||i;f=e&&e.beforeEach||i;u={beforeEach:function(n){var t=["mock","spy","stub"],o=sinon.config&&sinon.config.useFakeTimers,s;if(o){t.push("clock")}s={injectInto:this,properties:t,useFakeTimers:o};if(sinon.createSandbox){this._oSandbox=sinon.createSandbox(s)}else{this._oSandbox=sinon.sandbox.create(s)}sinon.assert.fail=function(t){n.ok(false,t)};sinon.assert.pass=function(t){n.ok(true,t)};return f.apply(this,arguments)},afterEach:function(n){try{return r.call(this,c.apply(this,arguments))}catch(n){t.call(this,n)}}};n.call(this,o,e?s(s({},e),u):u)};sinon.assert.fail=o;sinon.assert.pass=e})();
//# sourceMappingURL=sinon-qunit-bridge.js.map