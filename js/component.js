// 提示栏
// 
// 
var mnoti = document.querySelector(".m-noti");
var hide = document.querySelector(".hide");

if(!CookieUtil.get("notihide")) {
mnoti.style.display = "block";
EventUtil.addEvent(hide, "click", function() {
	mnoti.style.display = "none";
	CookieUtil.set("notihide", "yes", new Date(2017,11,13));
	});
}


// 页面头部
// 
// 
var attention = document.querySelector(".attention");
var attenAfter = document.querySelector(".attenAfter");
var cancel = document.querySelector(".cancel");
var mlogin = document.querySelector(".m-login");
var close = document.querySelector(".m-login .close");
var submit = document.querySelector(".m-login .submit");
var username = document.querySelector(".m-login .name");
var password = document.querySelector(".m-login .password");
var funsnum = document.querySelector(".funsnum");

// 取消关注
var notAtten = function() {
	attenAfter.style.display = "none";
	attention.style.display = "block";
	CookieUtil.remove("followSuc");
	var num = parseInt(funsnum.innerText);
	funsnum.innerText = --num;
};

// 关注
var atten = function() {
	if(CookieUtil.get("loginSuc")) {
		attention.style.display = "none";
		attenAfter.style.display = "block";
		CookieUtil.set('followSuc', 'yes', new Date(2017, 11, 113));
		var num = parseInt(funsnum.innerText);
		funsnum.innerText = ++num;

	} else {
		mlogin.style.display = "block";
		EventUtil.addEvent(close, "click", function() {
			mlogin.style.display = "none";
		});
		EventUtil.addEvent(submit, "click", function() {
			login();
		});
	}
};

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

EventUtil.addEvent(attention, "click", atten);
EventUtil.addEvent(cancel, "click", notAtten);


// 轮播头图
// 
// 
var banners = document.querySelectorAll(".m-slider img");
var dots = document.querySelectorAll(".m-slider .dots li");
var topBanner = 0;
var nextBanner = 1;

var removeClass = function(elem, classStr) {
	var name = elem.getAttribute("class");
	var names = name.split(" ");
	for (var i = 0; i < names.length; i++) {
		if(names[i] == classStr) {
			names[i] = "";
		}
	};
	elem.setAttribute("class", names.join(" "));
};

var addClass = function(elem, classStr) {
	var str = elem.className + " " + classStr;
	elem.className = str.trim();
}

var stepNext = function() {
	banners[nextBanner].style.opacity = 0;
	banners[nextBanner].style.zIndex = parseInt(banners[topBanner].style.zIndex) + 1;

	fadeIn(banners[nextBanner]);

	removeClass(dots[topBanner], "curDot");
	addClass(dots[nextBanner], "curDot");

	topBanner = nextBanner;
	nextBanner = (nextBanner + 1)%3;
};

var fadeIn = function(banner) {
	var opid = setInterval(function() {
		var curOpacity = parseFloat(banner.style.opacity);
		if(curOpacity >= 1) {
			clearInterval(opid);
		}
		banner.style.opacity = curOpacity + 0.1;
	}, 50);
};

var stepId = setInterval(stepNext, 5000);

for (var i = 0; i < dots.length; i++) {
	EventUtil.addEvent(dots[i], "click", (function(i) {
		clearInterval(stepId);
		stepId = setInterval(stepNext, 5000);
		nextBanner = i;
		stepNext();
	}).bind(null, i));
}

for (var i = 0; i < dots.length; i++) {
	EventUtil.addEvent(banners[i], "mouseover", (function(i) {
		clearInterval(stepId);
	}).bind(null, i));

	EventUtil.addEvent(banners[i], "mouseleave", (function(i) {
		stepId = setInterval(stepNext, 5000);
	}).bind(null, i));
}

// 页面中部
// 
// 
// tab 切换课程
var tabs = document.querySelectorAll(".m-tab .proTab");
var curTab = 0;

var removeClass = function(elem, classStr) {
	var name = elem.getAttribute("class");
	var names = name.split(" ");
	for (var i = 0; i < names.length; i++) {
		if(names[i] == classStr) {
			names[i] = "";
		}
	};
	elem.setAttribute("class", names.join(" "));
};

var addClass = function(elem, classStr) {
	var str = elem.className + " " + classStr;
	elem.className = str.trim();
};

for (var i = 0; i < tabs.length; i++) {
	EventUtil.addEvent(tabs[i], "click", (function(i) {
		if(i == curTab) {
			return;
		}
		addClass(tabs[i], "curTab");
		removeClass(tabs[curTab], "curTab");
		curTab = i;

		AjaxUtil.get("http://study.163.com/webDev/couresByCategory.htm", { 
				pageNo: 1,
				psize: 20,
				type: (i+1)*10,
			}, loadCourse);
	}).bind(null, i));
}

// main 获取课程
// 
// 获取课程列表 以及 课程的对象
// 将课程列表中的课程移除 并获取
// 将课程克隆一份，并填上数据，放入课程列表中
// 
var mCourselist = document.querySelector(".m-courselist");
var mproduct = document.querySelector(".m-courselist .m-pro")
mproduct = mCourselist.removeChild(mproduct);
var numOfPage = 20;
if (document.body.clientWidth < 1205) {
	numOfPage = 15;
}
EventUtil.addEvent(window, 'resize', function() {
	if (document.body.clientWidth < 1205) {
		numOfPage = 15;
	} else {
		numOfPage = 20;
	}
	AjaxUtil.get("http://study.163.com/webDev/couresByCategory.htm", 
	{ 
		pageNo: 1,
		psize: numOfPage,
		type: 10,
	}, loadCourse);
});

function loadCourse(response) {
	var courseList = JSON.parse(response);
	// 保证在获取第二页数据 或者 第二个tab时 第一页数据被移除
	mCourselist.innerHTML = ""; 

	for (var i = 0; i < courseList.list.length; i++) {
		var item = courseList.list[i];
		var npro = mproduct.cloneNode(true);
		mCourselist.appendChild(npro);
		var mproBasic = npro.querySelector(".m-proBasic");
		var mproDetail = npro.querySelector(".m-proDetail");

		var proImg = mproBasic.querySelector(".proImg");
		proImg.src = item.middlePhotoUrl;

		var name = mproBasic.querySelector(".name");
		name.innerText = item.name;

		var provider = mproBasic.querySelector(".provider");
		provider.innerText = item.provider;

		var count = mproBasic.querySelector(".count");
		count.innerText = item.learnerCount;

		var price = mproBasic.querySelector(".price");
		price.innerText = item.price == 0 ? "免费" : "￥" + item.price;

		proImg = mproDetail.querySelector(".proImg");
		proImg.src = item.middlePhotoUrl;

		name = mproDetail.querySelector(".name");
		name.innerText = item.name;

		count = mproDetail.querySelector(".count");
		count.innerText = item.learnerCount;

		provider = mproDetail.querySelector(".provider");
		provider.innerText = item.provider;

		var categoryName = mproDetail.querySelector(".categoryName");
		categoryName.innerText = item.categoryName;

		var description = mproDetail.querySelector(".description");
		description.innerText = item.description;
	};
}

// 在没有点击任何tab时 页面固定展现的课程
AjaxUtil.get("http://study.163.com/webDev/couresByCategory.htm", 
	{ 
		pageNo: 1,
		psize: numOfPage,
		type: 10,
	}, loadCourse);

// side
// 
// 视频
var videoImg = document.querySelector(".m-intrduce .videoImg");
var mvideo = document.querySelector(".m-video");
var video = document.querySelector(".video");
var videoClose = document.querySelector(".m-video .close");

EventUtil.addEvent(videoImg, "click", function() {
	mvideo.style.display = "block";
	video.play();
});

EventUtil.addEvent(videoClose, "click", function() {
	mvideo.style.display = "none";
	video.pause();
});

// 
// 最热排行
var mlist = document.querySelector(".m-topList");
var mcourse = document.querySelector(".m-hotcourse");
mcourse = mlist.removeChild(mcourse);
var topList = null;


AjaxUtil.get("http://study.163.com/webDev/hotcouresByCategory.htm", null, function(response) {
		topList = JSON.parse(response);
		mlist.innerHTML = "";

		for (var i = 0; i < 10; i++) {
			var item = topList[i];
			var ncourse = mcourse.cloneNode(true);
			mlist.appendChild(ncourse);

			var topImg = ncourse.querySelector(".topImg");
			topImg.src = item.middlePhotoUrl;

			var name = ncourse.querySelector(".name");
			name.innerText = item.name;

			var count = ncourse.querySelector(".count");
			count.innerText = item.learnerCount;
		};
});

var updateId = setInterval(update, 5000);
var i = 10;
function update() {
	var item = topList[i];
	var ncourse = mcourse.cloneNode(true);
	mlist.insertBefore(ncourse, mlist.firstChild);
	mlist.removeChild(mlist.lastChild);

	var topImg = ncourse.querySelector(".topImg");
	topImg.src = item.middlePhotoUrl;

	var name = ncourse.querySelector(".name");
	name.innerText = item.name;

	var count = ncourse.querySelector(".count");
	count.innerText = item.learnerCount;
	i = (i + 1) % topList.length;
}

// 页码
// 
// 
var pages = document.querySelectorAll(".m-page span");
var directionLeft = document.querySelector(".direction-left");
var directionRight = document.querySelector(".direction-right");
var curPage = 0;

for (var i = 0; i < pages.length; i++) {
	EventUtil.addEvent(pages[i], "click", (function(i) {
		if(i == curPage) {
			return;
		}
		AjaxUtil.get("http://study.163.com/webDev/couresByCategory.htm", { 
				pageNo: i+1,
				psize: 20,
				type: (curTab+1)*10,
			}, loadCourse);

		addClass(pages[i], "curPage");
		removeClass(pages[curPage], "curPage");

		curPage = i;
	}).bind(null, i));
}


EventUtil.addEvent(directionLeft, "click", function() {
	if (curPage == 0) {
		return;
	}
	AjaxUtil.get("http://study.163.com/webDev/couresByCategory.htm", { 
				pageNo: curPage,
				psize: 20,
				type: (curTab+1)*10,
			}, loadCourse);

	addClass(pages[curPage-1], "curPage");
	removeClass(pages[curPage], "curPage");

	curPage--;
});

EventUtil.addEvent(directionRight, "click", function() {
	if (curPage == pages.length-1) {
		return;
	}
	AjaxUtil.get("http://study.163.com/webDev/couresByCategory.htm", { 
				pageNo: curPage+2,
				psize: 20,
				type: (curTab+1)*10,
			}, loadCourse);

	addClass(pages[curPage+1], "curPage");
	removeClass(pages[curPage], "curPage");

	curPage++;
});


