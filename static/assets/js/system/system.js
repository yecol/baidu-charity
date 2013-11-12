W = {
	registry: {},
	common: {}
}

function xlog(msg) {
	if (window.console) {
		window.console.info(msg);
	}
}

/*按扭LOADING*/
$.fn.bottonLoading = function (options) {
	var el = this;
	if(!el.find('span.img').length) {
		el.prepend('<span class="img"></span>');
	}
	switch(options.status) {
	case 'show':
		el.addClass('submitting');
		el.attr('disabled', true);
		break;
	case 'hide':
		el.removeClass('submitting');
		el.attr('disabled', false);
		break;
	}
}

/**
 * Backbone扩展部分
 */
W.ApiModel = Backbone.Model.extend({
	app: null,
	
	getApiUrl: function(apiName, args) {
		var url = W.getApi().getUrl(this.app, apiName, args);
		this.apiUrl = url; //记录访问的api url
		return url;
	},

	save: function(attrs, options) {
		if (options && options.error) {
			options.error = function(onError) {
				return function(model, resp, options) {
					var info = resp.innerErrMsg || resp['responseText'] || resp;
					W.getApi().reportError(model.apiUrl, info);
					if (onError) {
						onError(model, resp, options);
					}
				};
			}(options.error);
		}


		if (options && options.success) {
			options.success = function(onSuccess) {
				return function(model, resp, xhr) {
					if (resp.code && resp.code != 200) {
						//W.getApi().reportError(model.apiUrl, resp);
						options.error(resp);
					}
					else {
						if (onSuccess) {
							onSuccess(model, resp, xhr);
						}
					}
				}
			}(options.success);
		}

		return Backbone.Model.prototype.save.call(this, attrs, options);
	},

	fetch: function(options) {
		if (options && options.error) {
			options.error = function(onError) {
				return function(model, resp, options) {
					var info = resp.innerErrMsg || resp['responseText'] || resp;
					W.getApi().reportError(model.apiUrl, info);
					if (onError) {
						onError(model, resp, options);
					}
				}
			}(options.error);
		}

		if (options && options.success) {
			options.success = function(onSuccess) {
				return function(model, resp, xhr) {
					if (resp.code && resp.code != 200) {
						//W.getApi().reportError(model.apiUrl, resp);
						options.error(resp);
					}
					else {
						if (onSuccess) {
							onSuccess(model, resp, xhr);
						}
					}
				}
			}(options.success);
		}

		return Backbone.Model.prototype.fetch.call(this, options);
	}
});

W.ApiCollection = Backbone.Collection.extend({
	app: null,
	
	getApiUrl: function(apiName, args) {
		var url = W.getApi().getUrl(this.app, apiName, args);
		this.apiUrl = url; //��¼���ʵ�api url
		return url;
	},

	fetch: function(options) {
		if (options && options.error) {
			options.error = function(onError) {
				return function(collection, resp, options) {
					var info = resp.innerErrMsg || resp['responseText'] || resp;
					W.getApi().reportError(collection.apiUrl, info);
					if (onError) {
						onError(collection, resp, options);
					}
				}
			}(options.error);
		}

		if (options && options.success) {
			options.success = function(onSuccess) {
				return function(collection, resp, xhr) {
					if (resp.code && resp.code != 200) {
						options.error(resp);
					}
					else {
						if (onSuccess) {
							onSuccess(collection, resp);
						}
					}
				}
			}(options.success);
		}

		return Backbone.Collection.prototype.fetch.call(this, options);
	}
});

W.TextareaMethod = {
	/*算出剩余字数*/
	getStringLength: function(value, number, isChineseBeTwoByte) {
		var valueLength;
		var maxLength = number;

		if(isChineseBeTwoByte) {
			value = value.replace(/[^\x00-\xff]/g, "**");
		}

		var reg = /(http:\/\/|https:\/\/)((\w|%|=|\?|\.|\/|&|-|#|:)+)/g;
		var https = value.match(reg);
		if(https !== null){
			//处理博文中的url链接长度，每个url链接的长度计算为20个长度
			value = value.replace(reg, '');
			valueLength = value.length/2;
			var httpsLength = 0, httpLength;
			var i, k;
			for(i = 0, k = https.length; i < k; i++) {
				httpLength = https[i].length;
				if(httpLength >= 20) {
					if(httpLength >= 140) {
						httpsLength += 10 + (httpLength - 140)/2;
					}
					else {
						httpsLength += 10;
					}
				}
				else {
					httpsLength += httpLength/2;
				}
			}
			valueLength = valueLength + httpsLength;
		}else{
			valueLength = value.length/2;
		}

		if(valueLength > number) {
			length = -parseFloat(maxLength-valueLength,10);
			length = Math.round(length);
			return {isValid: false, length: length};
		}else {
			return {isValid: true, length: parseInt(maxLength-valueLength,10)};
		}
	}
}

// 全局的Broadcaster
W.common.GlobalBroadcaster = {};
_.extend(W.common.GlobalBroadcaster, Backbone.Events);
W.Broadcaster = W.common.GlobalBroadcaster;

// 系统错误码
W.SUCCESS = 200;