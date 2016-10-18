var emitter = {
	on: function(event, handle) {
		if (!this._handlers) {
			this._handlers = {};
		}
		if (!this._handlers[event]) {
			this._handlers[event] = [];
		}
		this._handlers[event].push(handle);
	},
	emit: function(event, args) {
		if (!this._handlers) {
			return;
		}
		if (!this._handlers[event]) {
			return;
		}
		for (var i = 0; i < this._handlers[event].length; i++) {
			this._handlers[event][i].apply(null, args);
		}
	},
	off: function(event, handle) {
		if (!this._handlers) {
			return;
		}
		if (!this._handlers[event]) {
			return;
		}
		for (var i = 0; i < this._handlers[event].length; i++) {
			if (this._handlers[event][i] == handle) {
				this._handlers = this._handlers.splice(i, 1);
				break;
			}
		};
	}
}


var Noti = function() {
	var mnoti = document.querySelector(".m-noti");
	var mhide = document.querySelector(".hide");

	var hide = function() {
		mnoti.style.display = "none";
	}

	EventUtil.addEvent(mhide, "click", function() {
		hide();
		emitter.emit('hide');
	});

	return {
		emitter: Object.create(emitter),
		show: function() {
			mnoti.style.display = "block";
		}
	}
}