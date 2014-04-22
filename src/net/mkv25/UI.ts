/// <reference path="Core.ts" />
/// <reference path="../../com/jquery/jquery.d.ts" />

/**
 * User interface elements.
 */
module UI {
	export class Button extends Core.View {
		icon: string;
		clickAction: Function;
		color: string;
		constructor (icon: string, color: string, clickAction: Function) {
			// assign properties
			this.icon = icon;
			this.color = color;
			this.clickAction = clickAction;
			
			super('b');
			
			// create element
			this.create();
			this.up();
		}
		
		create() {
			// create button
			var button = this.element;
			button.setAttribute('class', 'sprite button ' + this.color);
			
			// create icon
			var icon = document.createElement('icon');
			icon.setAttribute('class', 'sprite icon ' + this.icon);
			
			// attach events
			var $button = $(button);
			$button.mouseenter($.proxy(this.over, this));
			$button.mouseleave($.proxy(this.up, this));
			$button.mousedown($.proxy(this.down, this));
			$button.mouseup($.proxy(this.over, this));
			$button.click($.proxy(this.click, this));
			
			// add icon to button
			button.appendChild(icon);
		}
		
		up() {
			$(this.element).removeClass('over down').addClass('up');
		}
		
		over() {
			$(this.element).removeClass('up down').addClass('over');
		}
		
		down() {
			$(this.element).removeClass('over up').addClass('down');
		}
		
		click() {
			this.clickAction();
		}
	} 
	export class TextInput extends Core.View {
		defaultText:string;
		constructor(defaultText:string, className:string="") {
			this.defaultText = defaultText;
			
			super('input', className);
			
			this.create();
		}
		
		create() {
			// create text input
			var textinput = this.element;
			textinput.setAttribute('value', this.defaultText);
			
			// attach events
			var $textinput = $(textinput);
			$textinput.mouseenter($.proxy(this.over, this));
			$textinput.mouseleave($.proxy(this.up, this));
			$textinput.mousedown($.proxy(this.down, this));
			$textinput.mouseup($.proxy(this.over, this));
			$textinput.focus($.proxy(this.focus, this));
			$textinput.focusout($.proxy(this.focusout, this));
		}
		
		up() {
			$(this.element).removeClass('over down').addClass('up');
		}
		
		over() {
			$(this.element).removeClass('up down').addClass('over');
		}
		
		down() {
			$(this.element).removeClass('over up').addClass('down');
		}
		
		focus() {
			var textinput = this.element;
			if($(textinput).val() == this.defaultText) {
				$(textinput).val('')
			}
		}
		
		focusout() {
			var textinput = this.element;
			if($(textinput).val() == '') {
				$(textinput).val(this.defaultText);
			}
		}
		
		text() {
			var textinput = this.element;
			var value = $(textinput).val();
			if(value == this.defaultText) {
				return '';
			}
			return value;
		}
	}
}