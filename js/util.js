var CookieUtil = {
    getAll:function() {
        var cookie = {};
        // cookie字符串键值对以'; '分隔'
        var all = document.cookie;
        if(all === "") {
            return cookie;
        }
        var list = all.split("; ");

        // 遍历cookie数组
        for(var i = 0; i < list.length; i++) {
            // 获取键值对解码存入对象
            var item = list[i];
            var sep = item.indexOf("=");
            var name = item.substring(0,sep);
            name = decodeURIComponent(name);
            var value = item.substring(sep + 1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return cookie;
    },  

    get:function(name) {
        var cookieName = encodeURIComponent(name) + '=';
        var cookieStart = document.cookie.indexOf(cookieName);
        var cookieValue = null;

        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart
                     + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },

    set:function(name, value, expires, path, domain, secure) {
        var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if(expires) {
            cookie += "; expires = " + expires.toGMTString();
        }
        if(path) {
            cookie += "; path = " + path;
        }
        if(domain) {
            cookie += "; domian = " + domain;
        }
        if(secure) {
            cookie += "; seure= " + secure;
        }
        document.cookie = cookie;
    },

    remove:function(name, path, domain) {
        document.cookie = name + "=" + "; path =" + path + "; domain =" + domain + "; max-age = 0";
    },
};

var EventUtil = {
    addEvent: function(element, eventType, callback, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(eventType, callback, useCapture||false);
        } else {
            element.attachEvent('on'+ eventType, callback);
        }
    },
    removeEvent: function(element, eventType, callback) {
        if (element.removeEventListener) {
            element.removeEventListener(eventType, callback);
        } else {
            element.detachEvent('on'+ eventType, callback);
        }
    },
    getEvent: function(event) {
        event = event || window.event;
        if (!event.preventDefault) {
            event.preventDefault = function() {
                this.returnValue = false;
            }
        }
        if (!event.stopPropagation) {
            event.stopPropagation = function() {
                this.cancelBubble = true;
            }
        }
        event.getChar = function() {
            return String.fromCharCode(this.keyCode);
        }
        return event;
    }
};

var AjaxUtil = {
    // 封装的ajax get方法
    get: function(url, options, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                // 判断请求是否成功
                if((xhr.status >= 200 && xhr.status < 300) || (xhr.status == 304)) {
                    // 执行回调函数
                    callback(xhr.responseText);
                } else{
                    console.log("ajax: get: Request was unsuccessful:" + xhr.status);
               }
            }
        };
        // 查询字符串附在url后边
        url = url + '?' + this.serialize(options);
        // open方法的三个参数：请求方法，请求地址，是否异步
        xhr.open("get", url, true);
        xhr.send(null);
    },

    // 封装的ajax post方法
    post: function(url, options, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if((xhr.status >= 200 && xhr.status < 300) || (xhr.status == 304)) {
                    callback(xhr.responseText);
                } else{
                    alert("Request was unsuccessful:" + xhr.status);
               }
            }
        } 
        xhr.open("post", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // post方法的参数放在send方法体中
        xhr.send(this.serialize(options));
    },

    /**
     * 序列化查询字符串
     * @param  {Object} options 封装的查询字符串对象
     * @return {String}         查询字符串
     */
    serialize: function(options) {
        if (!options) return "";
        // 存放属性键值对
        var params = [];

        // 遍历对象的属性
        for (var name in options) {
            // 去除原型的属性
            if (!options.hasOwnProperty(name)) {continue;}
            // 去除方法
            if (typeof options[name] == "function") {continue;}
            // 键值对编码存入数组
            var value = options[name];
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            params.push(name + "=" + value);
        }
        return params.join("&");
    }
};