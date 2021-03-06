ko.bindingHandlers.draggable = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
   $(element).draggable();
  },
  update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
   if (valueAccessor()) {
    $(element).draggable('enable');
   } else {
    $(element).draggable('disable');
   }
  }
};

ko.bindingHandlers.resizable = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
   $(element).resizable();
  },
  update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
   if (valueAccessor()) {
    $(element).resizable('enable');
   } else {
    $(element).resizable('disable');
   }
  }
};

var ViewModel = function() {
	var self = this;
	self.collection = ko.observableArray();
	self.load = function(data) {
		if ( data == null || data.Collection == null ) {
			return;
		}
		for ( var i = 0; i < data.Collection.length; i++ ) {
			var fusen = {
				top: ko.observable(data.Collection[i].top),
				left: ko.observable(data.Collection[i].left),
				width: ko.observable(data.Collection[i].width),
				height: ko.observable(data.Collection[i].height),
				body: ko.observable(data.Collection[i].body),
				color: ko.observable(data.Collection[i].color)
			}
			self.collection.push(fusen);
		}
	}
	$.getJSON("/all", function(data) {
		self.load(data);
	});

	self.newOne = function(obj, ev) {
		if ( ! ev ) {
			ev = event;
		}
		if ( ev.target == "#document" ) {
			return;
		}
		var x = ( ev != null ) ? ev.clientX : 10;
		var y = ( ev != null ) ? ev.clientY : 10;
		var pushed = {
			top: ko.observable(y),
			left: ko.observable(x),
			width: ko.observable(200),
			height: ko.observable(100),
			body: ko.observable(''),
			color: ko.observable("#FFFFFF")
		};
		var index = self.collection.push(pushed);
	};

	self.flush = function(index) {
		var fusen = self.collection[index];
		$.post("/update", fusen, function(data) {
			self.collection.removeAll();
			self.load(data);
		});
	}

	self.remove = function(data, event) {
		if ( event.target == "#document" ) {
			return;
		}
		console.log("remove start.");
		var removed = self.collection.remove(data);
		console.log(removed);
		console.log("remove end.");
	}

	self.moveToClick = function(element, data) {
		$(element).css({
			'top'    : data.top(),
			'left'   : data.left(),
			'width'  : data.width(),
			'height' : data.height()
		});
	}

};
$(function() {
	var vm = new ViewModel();
	ko.applyBindings(vm);
});
