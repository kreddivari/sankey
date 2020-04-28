/*!
 * Simple button radios 1.0.2
 * http://joelthorner.github.io/simple-button-radios/
 *
 * Copyright 2018 Joel Thorner - @joelthorner
 */
!function ($) {

	"use strict";

	var plugin;

	var simpleButtonRadios = function (el, options) {

		plugin = this;

		this.$element = $(el);

		var defaults = {
			buttonClass: "sbr-default",
			checkedIcon : '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="-725.53 115.775 1451.338 1451.338"><path d="M.141 376.731c-256.717 0-464.713 207.995-464.713 464.713 0 256.72 207.997 464.715 464.713 464.715 256.718 0 464.712-207.995 464.712-464.715 0-256.718-207.994-464.713-464.712-464.713z"/></svg>',
			nonCheckedIcon : '',

			// 'none' or 'input' or 'all'
			wrapContainer : 'none',

			btnAttributes : {
				'type' : 'button'
			},

			onInit : null,
			onChange : null,
			changeCallback : null,
			onDestroy: null
		};

		this.options = $.extend(defaults, options);

		init();
	};

	// public methods
	simpleButtonRadios.prototype = {

		destroy: function () {
			var thisData = $(this).data('simpleButtonRadios');

			// remove HTML
			thisData.$btn.remove();
			
			// remove classes
			thisData.$element.removeClass('sbr-init');
			
			// remove events
			thisData.$element.off('change.sbr');
			
			if(thisData.labelToInput){
				
				thisData.$element
					.siblings(thisData.labelToInput)
					.off('click.sbr');
				
				thisData.$element
					.parent().find(thisData.labelToInput)
					.off('click.sbr');

				thisData.$element
					.parent(thisData.labelToInput)
					.off('click.sbr');
			}

			$.each(thisData.aditionalListeners, function(index, val) {
				val.off('click.sbr');				
			});
			
			// callback
			if($.type(plugin.options.onDestroy) === 'function'){
				plugin.options.onDestroy.call(thisData.$element, thisData);
			}

			// remove data
			thisData.$element.removeData('simpleButtonRadios');
		},

		disable : function (bool) {
			var thisData = $(this).data('simpleButtonRadios'),
				 _self = $(this);

 			if (bool === true) {

 				thisData.$element.prop('disabled', true);
 				thisData.$btn.addClass('sbr-disabled');

 			}else if(bool === false){
 				
 				thisData.$element.prop('disabled', false);
 				thisData.$btn.removeClass('sbr-disabled');
 			}
		},

		addListener : function (newNode) {
			var thisData = $(this).data('simpleButtonRadios'),
				 _self = $(this);

 			if ($.type(newNode) === 'object' && thisData) {

 				thisData.aditionalListeners.push(newNode);

 				newNode.on('click.sbr', function(event) {
					_self.click();
				});
 			}
		}
	};


	// private
	function init() {
		// init additional listeners
		plugin.aditionalListeners = [];

		labelRelOption();

		// real init new html system
		initHTML();

		// wrap option with <button> added
		wrapContainer();

		// add input eventListeners with set all new html
		initEvents();

		// on init callback
		if($.type(plugin.options.onInit) === 'function'){
			plugin.options.onInit.call(plugin.$element, plugin);
		}
	}

	function wrapContainer () {
		
		if ($.type(plugin.options.wrapContainer) === 'string') {
			switch (plugin.options.wrapContainer) {
				case 'none':
					break;
				
				case 'input':
					plugin.$element
						.add(plugin.$btn)
						.wrapAll('<div class="sbr-container"></div>')
					break;
				
				case 'all':
					var toWrap;
					if(plugin.labelToInput){
						toWrap = plugin.$element
								.add(plugin.$btn)
								.add(plugin.$element.parent(plugin.labelToInput))
								.add(plugin.$element.siblings(plugin.labelToInput))
								.add(plugin.$element.parent().find(plugin.labelToInput));

					}else{
						toWrap = plugin.$element.add(plugin.$btn);
					}
					
					toWrap.wrapAll('<div class="sbr-container"></div>');
					break;
			}
		}

	}

	function initHTML() {
		// add init original input class
		plugin.$element.addClass('sbr-init');

		// checked check
		var isAlreadyChecked = false;

		if (plugin.$element.prop('checked')) {
			isAlreadyChecked = true;            
		}

		// save checked into el
		plugin.isChecked = isAlreadyChecked;

		// radio name required save
		plugin.inputName = plugin.$element.attr('name');

		// create btn
		var thisId = plugin.$element.attr('id');
		if ($.type(thisId) != 'undefined' && thisId.length) {
			plugin.uuid = plugin.$element.attr('id') + '-sbr';
		}else{
			plugin.uuid = guid();
		}

		var btnClasses = 'sbr-btn ' + plugin.options.buttonClass + ((isAlreadyChecked) ? ' sbr-checked': ' sbr-no-checked');

		// support disabled
		if (plugin.$element.prop('disabled')) {
			btnClasses += ' sbr-disabled'
		}

		var btnHtml = isAlreadyChecked ? plugin.options.checkedIcon : plugin.options.nonCheckedIcon;

		var btn = $('<button/>', {
			'id' : plugin.uuid,
			'html' : btnHtml,
			'class' : btnClasses,
			'data-sbr-name' : plugin.inputName
		});

		// option attributes button html
		$.each(plugin.options.btnAttributes, function(index, val) {
			btn.attr(index, val);
		});

		// save btn into node and append
		plugin.$btn = btn;
		plugin.$element.after(plugin.$btn);

	}

	function initEvents(){

		plugin.$btn.on('click.sbr', function(event) {
			$(this).prev('.sbr-init').click();
		});

		plugin.$element.on('change.sbr', function(event) {

			var thisData = $(this).data('simpleButtonRadios'),
				 self = $(this);

			if($.type(thisData.options.onChange) === 'function'){
				thisData.options.onChange.call(self, thisData);
			}

			// save checked datas
			$('[name="' + thisData.inputName + '"]').each(function(index, el) {
				var thisData = $(this).data('simpleButtonRadios');
				thisData.isChecked = $(this).prop('checked');

				if (thisData.isChecked) {
					$(thisData.$btn)
						.addClass('sbr-checked')
						.removeClass('sbr-no-checked')
						.html(thisData.options.checkedIcon);
				}else{
					$(thisData.$btn)
						.removeClass('sbr-checked')
						.addClass('sbr-no-checked')
						.html(thisData.options.nonCheckedIcon);
				}
			});

			if($.type(thisData.options.changeCallback) === 'function'){
				thisData.options.changeCallback.call(self, thisData);
			}

		});

		// focus tabs
		plugin.$element.on('focus.sbr', function(event) {
			var thisData = $(this).data('simpleButtonRadios'),
				 self = $(this);

			thisData.$btn.focus();
		});

	}

	function labelRelOption () {

		// save input label reference
		var inputId = plugin.$element.attr('id');

		if ($.type(inputId) != 'undefined' && inputId.length) {
			plugin.labelToInput = 'label[for="' + inputId + '"]';
		}else{	
			plugin.labelToInput = 'label';
		}
	}

	// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function guid() {
		
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		
		return 'sbr-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
	}


	$.fn.simpleButtonRadios = function (options) {

		var args = Array.prototype.slice.call(arguments);
		args.shift();

		return this.each(function () {

			var $element = $(this);
			var data = $element.data("simpleButtonRadios");


			if (!data && $element.is('input[type="radio"]')){
				$element.data("simpleButtonRadios", (data = new simpleButtonRadios(this, options)));
			}

			if (typeof options == 'string') data[options].apply(this, args);

		})
	};

	$.fn.simpleButtonRadios.Constructor = simpleButtonRadios;

}(window.jQuery);
