/**
* Core mkv25.net typescript classes, including, Model, View, Signal, and Assert.
* To use, include this line in your application file: /// <reference path="core.ts" />
*/
var Core;
(function (Core) {
    var Model = (function () {
        function Model() {
            this.changed = new Core.Signal();
        }
        return Model;
    })();
    Core.Model = Model;

    var View = (function () {
        function View(type, className) {
            if (typeof className === "undefined") { className = undefined; }
            this.element = document.createElement(type);
            if (className)
                this.element.setAttribute('class', className);
        }
        View.prototype.add = function (view) {
            this.element.appendChild(view.element);
        };

        View.prototype.removeAll = function () {
            this.element.innerHTML = '';
        };

        View.prototype.bind = function (model) {
            var self = this;
            model.changed.add(function () {
                self.onModelChanged(model);
            });
        };

        View.prototype.onModelChanged = function (model) {
            this.element.innerHTML = model + '';
        };
        return View;
    })();
    Core.View = View;

    var Signal = (function () {
        function Signal() {
            this.listeners = new Array();
        }
        Signal.prototype.add = function (callback) {
            this.listeners.push(callback);
        };
        Signal.prototype.remove = function (callback) {
            this.listeners.indexOf(callback);
        };
        Signal.prototype.removeAll = function () {
            var list = this.listeners;
            while (list.length > 0)
                list.pop();
        };
        Signal.prototype.dispatch = function (args) {
            var list = this.listeners;
            for (var i = 0; i < list.length; i++) {
                var callback = list[i];
                if (callback)
                    callback(args);
            }
        };
        return Signal;
    })();
    Core.Signal = Signal;

    var Assert = (function () {
        function Assert() {
        }
        Assert.notNull = function (value) {
            if (value == null) {
                throw new Error("Assertion failed: value was null (" + value + ")");
            }
        };

        Assert.isInteger = function (value) {
            if (isNaN(value) || Math.floor(value) != parseInt(value)) {
                throw new Error("Assertion failed: value was not an integer (" + value + ")");
            }
        };

        Assert.hasProperty = function (object, propertyName, throwErrorOnFalse) {
            if (typeof throwErrorOnFalse === "undefined") { throwErrorOnFalse = true; }
            Assert.notNull(object);

            if (object.hasOwnProperty(propertyName)) {
                return true;
            }
            if (throwErrorOnFalse) {
                throw new Error("Assertion failed:  the property (" + propertyName + ") does not exist on the object.");
            }
            return false;
        };

        Assert.findProperty = function (object, propertyName) {
            if (object == null) {
                throw new Error("Assertion failed: supplied object was null");
            }
            if (object.hasOwnProperty(propertyName)) {
                var value = object[propertyName];
            } else {
                throw new Error("Assertion failed:  the property (" + propertyName + ") does not exists on the object.");
            }
            if (value == null) {
                throw new Error("Assertion failed: the property (" + propertyName + ") exists on the object but the value is null");
            } else {
                return value;
            }
        };

        Assert.findInteger = function (object, propertyName) {
            var value = Assert.findProperty(object, propertyName);

            Assert.isInteger(value);

            return parseInt(value);
        };
        return Assert;
    })();
    Core.Assert = Assert;
})(Core || (Core = {}));
/// <reference path="Core.ts" />
/// <reference path="../../com/jquery/jquery.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* User interface elements.
*/
var UI;
(function (UI) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(icon, color, clickAction) {
            // assign properties
            this.icon = icon;
            this.color = color;
            this.clickAction = clickAction;

            _super.call(this, 'b');

            // create element
            this.create();
            this.up();
        }
        Button.prototype.create = function () {
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
        };

        Button.prototype.up = function () {
            $(this.element).removeClass('over down').addClass('up');
        };

        Button.prototype.over = function () {
            $(this.element).removeClass('up down').addClass('over');
        };

        Button.prototype.down = function () {
            $(this.element).removeClass('over up').addClass('down');
        };

        Button.prototype.click = function () {
            this.clickAction();
        };
        return Button;
    })(Core.View);
    UI.Button = Button;
    var TextInput = (function (_super) {
        __extends(TextInput, _super);
        function TextInput(defaultText, className) {
            if (typeof className === "undefined") { className = ""; }
            this.defaultText = defaultText;

            _super.call(this, 'input', className);

            this.create();
        }
        TextInput.prototype.create = function () {
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
        };

        TextInput.prototype.up = function () {
            $(this.element).removeClass('over down').addClass('up');
        };

        TextInput.prototype.over = function () {
            $(this.element).removeClass('up down').addClass('over');
        };

        TextInput.prototype.down = function () {
            $(this.element).removeClass('over up').addClass('down');
        };

        TextInput.prototype.focus = function () {
            var textinput = this.element;
            if ($(textinput).val() == this.defaultText) {
                $(textinput).val('');
            }
        };

        TextInput.prototype.focusout = function () {
            var textinput = this.element;
            if ($(textinput).val() == '') {
                $(textinput).val(this.defaultText);
            }
        };

        TextInput.prototype.text = function () {
            var textinput = this.element;
            var value = $(textinput).val();
            if (value == this.defaultText) {
                return '';
            }
            return value;
        };
        return TextInput;
    })(Core.View);
    UI.TextInput = TextInput;
})(UI || (UI = {}));
/// <reference path="net/mkv25/Core.ts" />
/// <reference path='com/firebase/Firebase.d.ts'/>
var FirebaseModel = (function (_super) {
    __extends(FirebaseModel, _super);
    function FirebaseModel(key) {
        _super.call(this);

        this.key = key;
        this.firebaseRef = new Firebase(FirebaseModel.BASE_URL + key);

        this.childAdded = new Core.Signal();
        this.writeError = new Core.Signal();

        this.registerEvents();
    }
    FirebaseModel.prototype.registerEvents = function () {
        var self = this;
        this.firebaseRef.on('value', function (snapshot) {
            self.value = snapshot.val();
            self.changed.dispatch(self.value);
        });

        this.firebaseRef.on('child_added', function (snapshot) {
            self.value = snapshot.val();
            self.childAdded.dispatch(self.value);
        });
    };

    FirebaseModel.prototype.write = function (value) {
        this.value = value;

        var self = this;
        this.firebaseRef.set(value, function (error) {
            self.writeError.dispatch(error);
        });
        this.changed.dispatch(this.value);
    };
    FirebaseModel.BASE_URL = "https://aqwtblod5tn.firebaseio-demo.com/";
    return FirebaseModel;
})(Core.Model);
/// <reference path="net/mkv25/Core.ts" />
/// <reference path="net/mkv25/UI.ts" />
/// <reference path='FirebaseModel.ts'/>
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this, 'div');

        this.create();
    }
    Main.main = function () {
        var main = new Main();
    };

    Main.prototype.create = function () {
        document.body.appendChild(this.element);

        this.nameref = new FirebaseModel("sharedName");
        this.name = new Core.View('div');
        this.input = new UI.TextInput("Enter new value");

        this.add(this.name);
        this.add(this.input);

        this.name.element.innerHTML = "Started up";

        var self = this;
        this.nameref.childAdded.add(function (model) {
            self.onChildAdded(model);
        });
        this.nameref.changed.add(function (model) {
            self.onValueChanged(model);
        });

        this.registerEvents();
    };

    Main.prototype.registerEvents = function () {
        var self = this;
        $(this.input.element).keypress(function (keyEvent) {
            var KEY_ENTER = 13;

            if (keyEvent.keyCode == KEY_ENTER) {
                var inputText = $(self.input.element).val();

                self.nameref.write(inputText);

                $(self.input.element).val('');
            }
        });
    };

    Main.prototype.onValueChanged = function (value) {
        this.name.element.innerHTML = "Value changed: " + value;
    };

    Main.prototype.onChildAdded = function (value) {
        this.name.element.innerHTML = "Child added: " + value;
    };
    return Main;
})(Core.View);
