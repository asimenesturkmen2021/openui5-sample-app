/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Table","sap/m/ToolbarSpacer","sap/m/upload/UploadSetTableRenderer","sap/ui/unified/FileUploader","sap/m/upload/UploadSetToolbarPlaceholder","sap/m/upload/UploaderHttpRequestMethod","sap/m/OverflowToolbar","sap/m/upload/UploadSetTableItem","sap/base/util/deepEqual","sap/base/Log","sap/m/library","sap/m/IllustratedMessageType","sap/m/IllustratedMessage","sap/m/IllustratedMessageSize","sap/m/upload/UploaderTableItem","sap/ui/core/dnd/DragDropInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/dnd/DragInfo","sap/m/upload/FilePreviewDialog","sap/ui/base/Event"],function(e,t,i,o,a,l,r,s,n,p,d,u,h,g,f,m,c,y,_,U){"use strict";var F=e.extend("sap.m.upload.UploadSetTable",{library:"sap.m",metadata:{properties:{fileTypes:{type:"string[]",defaultValue:null},maxFileNameLength:{type:"int",defaultValue:null},maxFileSize:{type:"float",defaultValue:null},mediaTypes:{type:"string[]",defaultValue:null},noDataText:{type:"string",defaultValue:null},noDataDescription:{type:"string",defaultValue:null},dragDropText:{type:"string",defaultValue:null},dragDropDescription:{type:"string",defaultValue:null},uploadUrl:{type:"string",defaultValue:null},httpRequestMethod:{type:"sap.m.upload.UploaderHttpRequestMethod",defaultValue:l.Post},multiple:{type:"boolean",group:"Behavior",defaultValue:false},uploadButtonInvisible:{type:"boolean",group:"Appearance",defaultValue:false},uploadEnabled:{type:"boolean",defaultValue:true},onItemValidationSuccess:{type:"function",defaultValue:null}},aggregations:{headerToolbar:{type:"sap.m.OverflowToolbar",multiple:false},uploader:{type:"sap.m.upload.UploaderTableItem",multiple:false},headerFields:{type:"sap.ui.core.Item",multiple:true,singularName:"headerField"},previewDialogAdditionalFooterButtons:{type:"sap.m.Button",multiple:true}},defaultAggregation:"items",events:{fileRenamed:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}}},afterItemRemoved:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}}},beforeUploadStarts:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}},allowPreventDefault:true},uploadCompleted:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"},response:{type:"string"},readyState:{type:"string"},status:{type:"string"},responseXML:{type:"string"},responseText:{type:"string"},headers:{type:"object"}}},fileTypeMismatch:{parameters:{item:{type:"object"}}},fileNameLengthExceeded:{parameters:{item:{type:"object"}}},fileSizeExceeded:{parameters:{item:{type:"object"}}},mediaTypeMismatch:{parameters:{item:{type:"object"}}},beforeInitiatingItemUpload:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}}},itemDragStart:{},itemDrop:{}}},renderer:i});var T=d.UploadState;F.prototype.init=function(){e.prototype.init.call(this);this._setDragDropConfig();this._filesTobeUploaded=[];this._filePreviewDialogControl=null;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m")};F.prototype.onBeforeRendering=function(){e.prototype.onBeforeRendering.call(this);this._setIllustratedMessage()};F.prototype.onAfterRendering=function(){e.prototype.onAfterRendering.call(this)};F.prototype.exit=function(){e.prototype.exit.call(this);if(this._oToolbar){this._oToolbar.destroy();this._oToolbar=null}if(this._oFileUploader){this._oFileUploader.destroy();this._oFileUploader=null}if(this._illustratedMessage){this._illustratedMessage.destroy();this._illustratedMessage=null}};F.prototype.getHeaderToolbar=function(){if(!this._oToolbar){this._oToolbar=this.getAggregation("headerToolbar");if(!this._oToolbar){this._oToolbar=new r(this.getId()+"-toolbar",{content:[new t,this.getDefaultFileUploader()]});this._iFileUploaderPH=2;this.addDependent(this._oToolbar)}else{this._iFileUploaderPH=this._getFileUploaderPlaceHolderPosition(this._oToolbar);if(this._oToolbar&&this._iFileUploaderPH>-1){this._setFileUploaderInToolbar(this.getDefaultFileUploader())}else if(this._oToolbar){this._oToolbar.addContent(this.getDefaultFileUploader())}}}return this._oToolbar};F.prototype.setFileTypes=function(e){var t=e||null;if(typeof t==="string"){t=t.split(",")}t=(t||[]).map(function(e){return e?e.toLowerCase():""});if(!n(this.getFileTypes(),t)){this.setProperty("fileTypes",t,true);this.getDefaultFileUploader().setFileType(t)}return this};F.prototype.setMaxFileNameLength=function(e){if(this.getMaxFileNameLength()!==e){this.setProperty("maxFileNameLength",e,true);this.getDefaultFileUploader().setMaximumFilenameLength(e)}return this};F.prototype.setMaxFileSize=function(e){if(this.getMaxFileSize()!==e){this.setProperty("maxFileSize",e,true);this.getDefaultFileUploader().setMaximumFileSize(e)}return this};F.prototype.setMediaTypes=function(e){var t=e||null;if(typeof t==="string"){t=t.split(",")}t=(t||[]).map(function(e){return e?e.toLowerCase():""});if(!n(this.getMediaTypes(),t)){this.setProperty("mediaTypes",t,true);this.getDefaultFileUploader().setMimeType(t)}return this};F.prototype.setUploadButtonInvisible=function(e){if(e!==this.getUploadButtonInvisible()){this._setFileUploaderVisibility(e);this.setProperty("uploadButtonInvisible",e,true)}return this};F.prototype.setMultiple=function(e){if(this.getMultiple()!==e){this.setProperty("multiple",e);this.getDefaultFileUploader().setMultiple(e)}return this};F.prototype.setUploadEnabled=function(e){if(e!==this.getUploadEnabled()){this.getDefaultFileUploader().setEnabled(e);this.setProperty("uploadEnabled",e,false)}return this};F.prototype.getDefaultFileUploader=function(){var e="Upload";if(!this._oFileUploader){this._oFileUploader=new o(this.getId()+"-uploader",{buttonOnly:true,buttonText:e,tooltip:e,iconOnly:false,enabled:this.getUploadEnabled(),icon:"",iconFirst:false,style:"Transparent",name:"uploadSetTableFileUploader",sameFilenameAllowed:true,fileType:this.getFileTypes(),mimeType:this.getMediaTypes(),maximumFilenameLength:this.getMaxFileNameLength(),maximumFileSize:this.getMaxFileSize(),multiple:this.getMultiple(),useMultipart:false,sendXHR:true,change:[this._onFileUploaderChange,this],typeMissmatch:[this._fireFileTypeMismatch,this],fileSizeExceed:[this._fireFileSizeExceed,this],filenameLengthExceed:[this._fireFilenameLengthExceed,this],visible:true})}return this._oFileUploader};F.getIconForFileType=function(e,t){return s._getIconByMimeType(e,t)};F.prototype.downloadItems=function(e){if(e&&e.length){e.forEach(function(e){var t=e&&e instanceof s?true:false;var i=e&&e.getParent?e.getParent():null;if(t&&i===this){this._getActiveUploader().download(e,[],true)}else{p.warning("Download cannot proceed without a parent association.")}}.bind(this))}};F.prototype.registerUploaderEvents=function(e){e.attachUploadStarted(this._onUploadStarted.bind(this));e.attachUploadCompleted(this._onUploadCompleted.bind(this))};F.prototype.fileSelectionHandler=function(){var e=this.getDefaultFileUploader();if(e&&e.oFileUpload&&e.oFileUpload.click){e.oFileUpload.click()}};F.getFileSizeWithUnits=function(e){var t=1024;var i=t*1024;var o=i*1024;if(typeof e==="number"){if(e<i){return(e/t).toFixed(2)+" KB"}else if(e<o){return(e/i).toFixed(2)+" MB"}else{return(e/o).toFixed(2)+" GB"}}return e};F.prototype.uploadItemViaUrl=function(e,t,i){var o=new File([new Blob([])],e);var a=new s({uploadState:T.Ready});a._setFileObject(o);a.setFileName(o.name);a.setUrl(t);i.then(()=>this._initateItemUpload(a).bind(this)).catch(()=>a.destroy());return a};F.prototype.uploadItemWithoutFile=function(e){var t=new File([new Blob([])],"-");var i=new s({uploadState:T.Ready});i._setFileObject(t);i.setFileName(t.name);e.then(()=>this._initateItemUpload(i)).catch(()=>i.destroy());return i};F.prototype._setFileUploaderInToolbar=function(e){this._oToolbar.getContent()[this._iFileUploaderPH].setVisible(false);this._oToolbar.insertContent(e,this._iFileUploaderPH)};F.prototype._getFileUploaderPlaceHolderPosition=function(e){for(var t=0;t<e.getContent().length;t++){if(e.getContent()[t]instanceof a){return t}}return-1};F.prototype._onFileUploaderChange=function(e){var t=e.getParameter("files");if(t&&t.length){var i=this.getSelectedItems();var o=i&&i.length==1?i[0]:null;var a=o?o&&o.getFileName&&o.getFileName()==="-":false;if(a){this._oItemToUpdate=t[0]}this._processSelectedFileObjects(t)}};F.prototype._processSelectedFileObjects=function(e){var t=[];for(var i=0;i<e.length;i++){t.push(e[i])}t.forEach(e=>{var i=new s({uploadState:T.Ready});i._setFileObject(e);i.setFileName(e.name);if(this.getOnItemValidationSuccess()&&typeof this.getOnItemValidationSuccess()==="function"){const e=new U("onItemValidation",this,{item:i,totalItemsForUpload:t.length});var o=this.getOnItemValidationSuccess()(e);if(o&&o instanceof Promise){o.then(e=>{if(e instanceof s){this._initateItemUpload(e)}}).catch(e=>{if(e&&this._oItemToUpdate&&e instanceof s&&e.getId()===this._oItemToUpdate.getId()){this._oItemToUpdate=null}})}else{i.destroy();p.error("Invalid usage, missing Promise: onItemvalidationSuccess expects Promise to be returned.")}}else{this._initateItemUpload(i)}})};F.prototype._initateItemUpload=function(e){this.fireBeforeInitiatingItemUpload({item:e});if(this._oItemToUpdate){this._oItemToUpdate=e}this._uploadItemIfGoodToGo(e)};F.prototype._fireFileTypeMismatch=function(e){var t=this.getMediaTypes();var i=this.getFileTypes();var o=e.getParameter("fileType");var a=e.getParameter("mimeType");var l=!!t&&t.length>0&&!!a&&t.indexOf(a)===-1;var r=!!i&&i.length>0&&!!o&&i.indexOf(o)===-1;var s={fileType:o,mimeType:a};if(l){this.fireMediaTypeMismatch({item:s})}else if(r){this.fireFileTypeMismatch({item:s})}};F.prototype._fireFilenameLengthExceed=function(e){this.fireFileNameLengthExceeded({item:e})};F.prototype._fireFileSizeExceed=function(e){this.fireFileSizeExceeded({item:e})};F.prototype._onUploadStarted=function(e){var t=e.getParameter("item");t.setUploadState(T.Uploading)};F.prototype._onUploadCompleted=function(e){var t=e.getParameter("item"),i=e.getParameter("responseXHR"),o=null;if(i.responseXML){o=i.responseXML.documentElement.textContent}var a={item:t,response:i.response,responseXML:o,responseText:i.responseText,readyState:i.readyState,status:i.status,headers:i.headers};if(this._oItemToUpdate){this._oItemToUpdate.setFileName(t.getFileName());this._oItemToUpdate._setFileObject(t.getFileObject());this._oItemToUpdate=null}t.setUploadState(T.Complete);this.fireUploadCompleted(a)};F.prototype._uploadItemIfGoodToGo=function(e){if(e.getUploadState()===T.Ready&&!e._isRestricted()){if(this.fireBeforeUploadStarts({item:e})){var t=e.getHeaderFields().length?e.getHeaderFields():this.getHeaderFields();this._getActiveUploader().uploadItem(e,t)}}};F.prototype._getActiveUploader=function(){return this.getUploader()||this._getImplicitUploader()};F.prototype._getImplicitUploader=function(){if(!this._oUploader){this._oUploader=new f({httpRequestMethod:this.getHttpRequestMethod()});this._oUploader.setUploadUrl(this.getUploadUrl());this.registerUploaderEvents(this._oUploader);this.addDependent(this._oUploader)}return this._oUploader};F.prototype._setIllustratedMessage=function(){if(!this._illustratedMessage){this._illustratedMessage=new h({illustrationType:u.UploadCollection,illustrationSize:g.Spot,title:this.getNoDataText()?this.getNoDataText():this._oRb.getText("UPLOADSET_WITH_TABLE_NO_DATA_TEXT"),description:this.getNoDataDescription()?this.getNoDataDescription():this._oRb.getText("UPLOADSET_WITH_TABLE_NO_DATA_DESCRIPTION")})}this.setAggregation("_noColumnsMessage",this._illustratedMessage);this.setAggregation("noData",this._illustratedMessage)};F.prototype._setFileUploaderVisibility=function(e){if(this._oFileUploader){var t=this._oFileUploader.oBrowse&&this._oFileUploader.oBrowse?this._oFileUploader:null;if(t){if(e){t.addStyleClass("sapMUSTFileUploaderVisibility")}else{t.removeStyleClass("sapMUSTFileUploaderVisibility")}}}};F.prototype._setDragDropConfig=function(){var e=new m({sourceAggregation:"items",targetAggregation:"items",dragStart:[this._onDragStartItem,this],drop:[this._onDropItem,this]});var t=new c({targetAggregation:"",dropEffect:"Move",dropPosition:"OnOrBetween",dragEnter:[this._onDragEnterFile,this],drop:[this._onDropFile,this]});this.addDragDropConfig(e);this.addDragDropConfig(t)};F.prototype._onDragStartItem=function(e){this.fireItemDragStart(e)};F.prototype._onDropItem=function(e){this.fireItemDrop(e)};F.prototype._onDragEnterFile=function(e){var t=e.getParameter("dragSession");var i=t.getDragControl();this._oDragIndicator=true;if(i){e.preventDefault()}};F.prototype._onDropFile=function(e){this._oDragIndicator=false;e.preventDefault();if(this.getUploadEnabled()){var t=e.getParameter("browserEvent").dataTransfer.files;if(t&&t.length&&t.length>1&&!this.getMultiple()){p.warning("Multiple files upload is retsricted for this multiple property set");return}if(t&&t.length){this._processSelectedFileObjects(t)}}};F.prototype._openFilePreview=function(e){var t=this.getPreviewDialogAdditionalFooterButtons();if(!this._filePreviewDialogControl){this._filePreviewDialogControl=new _({previewItem:e,items:this.getItems(),additionalFooterButtons:this.getPreviewDialogAdditionalFooterButtons()});this.addDependent(this._filePreviewDialogControl);this._filePreviewDialogControl.open()}else{this._filePreviewDialogControl.setPreviewItem(e);this._filePreviewDialogControl.setItems(this.getItems());t.forEach(e=>this._filePreviewDialogControl.insertAddDiitionalFooterButton(e));this._filePreviewDialogControl.open()}};return F});
//# sourceMappingURL=UploadSetTable.js.map