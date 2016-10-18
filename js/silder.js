var Slider = function() {
	var mslider = document.querySelector('.m-slider');
	var banners = mslider.querySelectorAll("img");
	var dots = mslider.querySelectorAll(".dots li");
	var topBanner = 0;
	var nextBanner = 1;

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

	for (var i = 0; i < dots.length; i++) {
		EventUtil.addEvent(dots[i], "click", (function(i) {
			clearInterval(stepId);
			stepId = setInterval(stepNext, 5000);
			nextBanner = i;
			stepNext();
		}).bind(null, i));
	}

	return {
		mslider: mslider,
		stepNext: stepNext
	}
}