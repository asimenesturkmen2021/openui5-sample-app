/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dom/jquery/Selectors"],function(){"use strict";function e(e){let t=e.skipChild;const n=e.scope;if(e.element?.id==="sap-ui-static"){t=true}const l=[{element:e.element,skipChild:t}];while(l.length){const e=l.pop();const t=e.element;if(!t){return null}if(!e.skipChild){if(t.shadowRoot&&t.shadowRoot.firstElementChild){return t.shadowRoot.firstElementChild}else if(t.assignedElements&&t.assignedElements().length){return t.assignedElements()[0]}else if(t.firstElementChild){return t.firstElementChild}}else if(t===n){return n}if(t.assignedSlot){var s=t.assignedSlot.assignedElements();var i=s.indexOf(t)+1;if(i<s.length){return s[i]}}else if(t.nextElementSibling){return t.nextElementSibling}l.push({element:t.assignedSlot||t.parentElement||t.parentNode||t.host,skipChild:true})}return null}function t(e){const t=e.scope;let n=e.checkChildren||e.element===t;if(e.element.id==="sap-ui-static"){n=false}const l=[{element:e.element,checkChildren:n}];while(l.length){const e=l.pop();const t=e.element;if(!t){return null}let n;if(e.checkChildren){let e;if(t.shadowRoot){e=t.shadowRoot}else if(t.lastElementChild){e=t.lastElementChild}else if(t.assignedElements&&t.assignedElements().length){n=t.assignedElements();e=n[n.length-1]}if(e){l.push({element:e,checkChildren:true});continue}else{return t.nodeType===11?t.host:t}}if(t.assignedSlot){n=t.assignedSlot.assignedElements();var s=n.indexOf(t)-1;if(s>=0){l.push({element:n[s],checkChildren:true});continue}}else if(t.previousElementSibling){l.push({element:t.previousElementSibling,checkChildren:true});continue}let i;if(t.assignedSlot){i=t.assignedSlot}else if(t.parentElement){i=t.parentElement}else if(t.parentNode){i=t.parentNode.host}return i}return null}function n(n,l){const s=l.scope||document.documentElement;const i=!!l.forward;let r=false;const o=[{element:n,skipChild:l.skipChild}];while(o.length){const l=o.pop();const u=l.element;const d=l.skipChild;const h=i?e({element:u,scope:s,skipChild:d}):t({element:u,scope:s});if(!h){return null}if(h===s){r=true}if(r&&h===n){return{element:null,startOver:true}}if(jQuery.expr.pseudos.sapTabbable(h)){return{element:h,startOver:r}}else{o.push({element:h})}}return null}return n});
//# sourceMappingURL=findTabbable.js.map