/**
 * Core mkv25.net typescript classes, including, Model, View, Signal, and Assert. 
 * To use, include this line in your application file: /// <reference path="core.ts" />
 */
module Core {
	
	export class Model {
		value: Object;
		changed: Core.Signal;
		constructor() {
			this.changed = new Core.Signal();
		}
	}
	
	export class View {
		element: HTMLElement;
		constructor(type: string, className: string = undefined) {
			this.element = document.createElement(type);
			if(className)
				this.element.setAttribute('class', className);
		}
		
		add(view: View) {
			this.element.appendChild(view.element);
		}
		
		removeAll() {
			this.element.innerHTML = '';
		}
		
		bind(model:Core.Model) {
			var self = this;
			model.changed.add(function() {
				self.onModelChanged(model);
			});
		}
		
		private onModelChanged(model:Model) {
			this.element.innerHTML = model + '';
		}
	}
	
	export class Signal {
		listeners:Function[];
		constructor() {
			this.listeners = new Array<Function>();
		}
		add (callback: Function) {
			this.listeners.push(callback);
		}
		remove (callback: Function) {
			this.listeners.indexOf(callback);
		}
		removeAll() {
			var list = this.listeners;
			while(list.length > 0)
				list.pop();
		}
		dispatch(args) {
			var list = this.listeners;
			for (var i = 0; i<list.length; i++) {
				var callback = list[i];
				if(callback)
					callback(args)
			}
		}
	}
	
	export class Assert {
		static notNull(value) {
			if(value == null) {
				throw new Error("Assertion failed: value was null (" + value + ")");
			}
		}
		
		static isInteger(value) {
			if (isNaN(value) || Math.floor(value) != parseInt(value)) {
				throw new Error("Assertion failed: value was not an integer (" + value + ")");
			}
		}
		
		static hasProperty(object:Object, propertyName: string, throwErrorOnFalse: boolean=true) {
			Assert.notNull(object);
			
			if (object.hasOwnProperty(propertyName)) {
				return true;
			}
			if (throwErrorOnFalse) {
				throw new Error("Assertion failed:  the property (" + propertyName + ") does not exist on the object.");
			}
			return false;
		}
		
		static findProperty(object: Object, propertyName: string) {
			if (object == null) {
				throw new Error("Assertion failed: supplied object was null");
			}
			if (object.hasOwnProperty(propertyName)) {
				var value = object[propertyName];
			}
			else {
				throw new Error("Assertion failed:  the property (" + propertyName + ") does not exists on the object.");
			}
			if (value == null) {
				throw new Error("Assertion failed: the property (" + propertyName + ") exists on the object but the value is null");
			}
			else {
				return value;
			}
		}
		
		static findInteger(object: Object, propertyName: string) {
			var value = Assert.findProperty(object, propertyName);
			
			Assert.isInteger(value);
			
			return parseInt(value);
		}
	}
}
