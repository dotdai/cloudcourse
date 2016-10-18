
/**
 * module模式
 */

// 传统的对象字面量无法做到访问控制
var myObj = {
	name: 'dotdai',
	age: 18,
	grow: function() {
		this.age++;
	}
}
myObj.grow();
var age = myObj.age;
myObj.age = 5;

// module模式
// 达到了控制访问的目的
var myObj = (function() { // IIFE
    // 私有变量
	var age = 18;
	var name = 'dotdai';
	// 私有函数
	var privateFunc = function() {}

	// 返回接口（公有变量/函数）
	return {
		getName: function() {
			return name;
		},
		grow: function() {
			age++;
		},
		getAge: function() {
			return age;
		}
	}
})();
myObj.grow();
myObj.getAge();




/**
 * 单例模式
 */

// 非单例下，每次调用函数都返回不同的实例对象
var Person = function() {
	return {
		name: 'dotdai',
		age: 18
	}
};

var p1 = Person();
var p2 = Person();
p1.name = 'dotgua';
p2.name;


// 单例模式下每次调用都返回同一个实例对象
var SinglePerson = (function() {
	var instance;
	var init = function() {
		return {
			name: 'dotdai',
			age: 18
		}
	};

	return function() {
		if (!instance) {
			instance = init();
		}
		return instance;
	};
})();
var p3 = SinglePerson();
var p4 = SinglePerson();
p3.name = 'dotgua';
p4.name;



/**
 * 观察者模式（订阅/发布模式）
 */
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


emitter.on('greet', function() {
	console.log('greet happen!');
});
emitter.on('greet', function() {
	console.log('greet2 happen!');
});
emitter.on('greet', function() {
	console.log('greet3 happen!');
});
emitter.emit('greet');


// Mixin混入
var mixin = function(base, ext) {
	for (var item in ext) {
		if (!base.hasOwnProperty(item)) {
			base[item] = ext[item];
		}
	}
}