/// <reference path="net/mkv25/Core.ts" />
/// <reference path="net/mkv25/UI.ts" />
/// <reference path='FirebaseModel.ts'/>

class Main extends Core.View
{
	static main():void 
	{
		var main = new Main();
	}
	
	nameref: FirebaseModel;
	name: Core.View;
	input: UI.TextInput;
	
	constructor()
	{
		super('div');
		
		this.create();
	}
	
	create():void
	{
		document.body.appendChild(this.element);
			
		this.nameref = new FirebaseModel("sharedName");
		this.name = new Core.View('div');
		this.input = new UI.TextInput("Some input");
		
		this.add(this.name);
		this.add(this.input);
		
		this.name.element.innerHTML = "Started up";
		
		var self = this;
		this.nameref.childAdded.add(function(model) { self.onChildAdded(model); });
		this.nameref.changed.add(function (model) { self.onValueChanged(model); });
		
		this.registerEvents();
	}
	
	registerEvents()
	{
		var self = this;
		$(this.input.element).keypress(function (keyEvent) {
			var KEY_ENTER = 13;
			
			if (keyEvent.keyCode == KEY_ENTER) {
				var inputText = $(self.input.element).val();
				
				self.nameref.write(inputText);
				
				$(self.input.element).val('');
			}
		});
	}
	
	onValueChanged(value)
	{
		this.name.element.innerHTML = "Value changed: " + value;
	}
	
	onChildAdded(value)
	{
		this.name.element.innerHTML = "Child added: " + value;
	}
	
}