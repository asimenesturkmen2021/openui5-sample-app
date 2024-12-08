/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/CustomData"],function(t){"use strict";const e=t.extend("sap.ui.core.fieldhelp.FieldHelpCustomData",{metadata:{library:"sap.ui.core"}});e.DOCUMENTATION_REF_KEY="sap-ui-DocumentationRef";function o(t){const o=t.getParent();if(o&&t.getKey()===e.DOCUMENTATION_REF_KEY&&Array.isArray(t.getValue())){o.setFieldHelpDisplay(o);o.updateFieldHelp?.()}}e.prototype.init=function(){this.setKey(e.DOCUMENTATION_REF_KEY)};e.prototype.setParent=function(e){const p=t.prototype.setParent.apply(this,arguments);o(this);return p};e.prototype.destroy=function(){const o=this.getParent();const p=t.prototype.destroy.apply(this,arguments);if(o&&this.getKey()===e.DOCUMENTATION_REF_KEY){o.updateFieldHelp?.()}return p};e.prototype.setKey=function(o){if(o!==e.DOCUMENTATION_REF_KEY){throw new Error(`Unsupported key "${o}" for sap.ui.core.fieldhelp.FieldHelpCustomData`)}return t.prototype.setKey.apply(this,arguments)};e.prototype.setValue=function(e){const p=t.prototype.setValue.apply(this,arguments);o(this);return p};return e});
//# sourceMappingURL=FieldHelpCustomData.js.map