/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';



	config.height = 500;
	config.defaultLanguage = 'en'; // zh,zh-cn

	config.format_tags = 'h1;h2;h3;h4;h5;h6;pre;address;div';
	config.enterMode = CKEDITOR.ENTER_DIV;
	config.shiftEnterMode = CKEDITOR.ENTER_BR;
	//config.baseHref = '/flex/';

	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		'/',
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

	config.removeButtons = 'NewPage,Preview,Print,Templates,SelectAll,Scayt,Flash,Smiley,SpecialChar,PageBreak,Iframe,About,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,ImageButton,Language,BidiRtl,BidiLtr,CreateDiv';

	//config.toolbarCanCollapse = true;


	config.extraPlugins = 'imageuploaderV4';
	//config.filebrowserUploadUrl = config.baseHref + 'third-party/ckeditor-uploader.php';
	//config.filebrowserBrowseUrl = config.baseHref + 'third-party/ckeditor_4.5.3_full/plugins/imageuploader.php';

	//config.filebrowserUploadUrl = '/upload.php?id='+productID;
	//config.filebrowserBrowseUrl = 'browse.php?type=Images';

	/*
	config.extraPlugins = 'imagebrowserV2';
	config.filebrowserUploadUrl = 'ckeditor_4.5.3_full/plugins/imagebrowserV2/imgupload.php';
	config.filebrowserBrowseUrl = 'ckeditor_4.5.3_full/plugins/imagebrowserV2/browser/browser.html';
	config.imageBrowser_listUrl = '';
	*/
};