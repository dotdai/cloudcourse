// 登录模态框组件
var LoginModal = function() {
	var mlogin = document.querySelector(".m-login");
	var close = mlogin.querySelector(".close");
	var submit = mlogin.querySelector(".submit");
	var username = mlogin.querySelector(".name");
	var password = mlogin.querySelector(".password");

	// 登录
	var login = function() {
		var mname = username.value;
		var mpassword = password.value;

		if(!validateName(mname) || !validatePass(mpassword)) {
			return;
		}

		mname = md5(mname);
		mpassword = md5(mpassword);

		AjaxUtil.get("http://study.163.com/webDev/login.htm", {
			"userName":mname,
			"password":mpassword
		}, function(response) {
			if(response == 1) {
				mlogin.style.display = "none";
				CookieUtil.set("loginSuc", "yes", new Date(2017, 11, 13));
				atten();
			} else {
				alert("用户名或密码错误！");
			}
		});
	};
	// 隐藏登录框
	var hide = function() {
		mlogin.style.display = "none";
	};

	// 验证
	var validateName = function(name) {
		if(name == "") {
			alert("请输入用户名！");
		} else {
			return true;
		}
	};
	var validatePass = function(password) {
		if(password == "") {
			alert("请输入密码！");
		} else if (!/\d/.test(password)||!/[a-z]/i.test(password)) {
			alert("密码必须包含数字字母！");
		} else {
			return true;
		}
	};

	EventUtil.addEvent(close, "click", hide);
	EventUtil.addEvent(submit, "click", login);

	return {
		show: function() {
			mlogin.style.display = "block";
		}
	}
}