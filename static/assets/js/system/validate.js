W.ValidaterClass = function() {
	var ascii = /[^\x00-\xff]/g;

	this.validateRules = {
		'int': {
			//整数
			type: 'regex',
            extract: 'value',
			regex: /^\d+$/g,
			errorHint: '格式不正确，请输入整数'
		}, 
		'float': {
			type: 'regex',
            extract: 'value',
			regex: /^\d{1,5}(\.\d{1,2})?$/g,
			errorHint: '格式不正确，请重新输入'
		},
		'date': {
			type: 'regex',
			extract: 'value',
			regex: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g,
			errorHint: '输入格式为2001-01-01的日期'
		},
		'name': {
			type: 'function',
            extract: 'element',
			check: function(element) {
                var value = $.trim(element.val());
                
                var length = element.attr('data-validate-max-length');
                if (!length) {
                    length = 30;
                } else {
                    length = parseInt(length);
                }

				if(!value.match(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,100}$/)) {
                    this.errorHint = '请输入长度在1到'+length+'之间的字符，只能包含中英文、数字、下划线'
					return false;
				}

				//var asciiReplacedValue = value.replace(ascii, "**");
                var asciiReplacedValue = value;
                xlog('length: ' + asciiReplacedValue.length);
                if(asciiReplacedValue.length < 1 || asciiReplacedValue.length > length) {
                    this.errorHint = '请输入长度在1到'+length+'之间的字符，只能包含中英文、数字、下划线'
                    return false;
				}
				return true;
			},
			errorHint: ''
		},
		'required': {
			type: 'function',
            extract: 'element',
			check: function(element) {
				var trimedValue = $.trim(element.val());

                var length = element.attr('data-validate-max-length');
                var min = element.attr('data-validate-min-length') || 1;
                if (!length) {
                    length = 50;
                } else {
                    length = parseInt(length);
                }

				if (trimedValue.length < min || trimedValue.length > length) {
                    this.errorHint = '内容长度必须在'+min+'到'+length+'之间，请重新输入';
					return false;
				} else {
					return true;
				}
			},
			errorHint: ''
		},
		'required-none': {
			type: 'function',
			extract: 'element',
			check: function(element) {
				var trimedValue = $.trim(element.val());

				if (trimedValue.length == 0) {
					this.errorHint = '内容不能为空';
					return false;
				} else {
					return true;
				}
			},
			errorHint: ''
		},
		//可以为空，但有字符长度限制
		'can-none-length-limit': {
			type: 'function',
			extract: 'element',
			check: function(element) {
				var trimedValue = $.trim(element.val());

				var length = element.attr('data-validate-max-length');
				var min = element.attr('data-validate-min-length') || 0;
				if (!length) {
					length = 50;
				} else {
					length = parseInt(length);
				}

				if (trimedValue.length == 0) {
					return true;
				}
				if (trimedValue.length < min || trimedValue.length > length) {
					this.errorHint = '内容长度必须在'+min+'到'+length+'之间，请重新输入';
					return false;
				} else {
					return true;
				}
			},
			errorHint: ''
		},
        'require-select': {
            type: 'function',
            extract: 'value',
            check: function(value) {
                var trimedValue = $.trim(value);
                if (trimedValue.length == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            errorHint: '请选择一个选项'
        },
		'require-select-valid-option': {
			type: 'function',
			extract: 'value',
			check: function(value) {
				var value = parseInt(value);
				if (value < 0) {
					return false;
				} else {
					return true;
				}
			},
			errorHint: '请选择一个选项'
		},
        'require-image': {
            type: 'function',
            extract: 'value',
            check: function(value) {

                if (value.length == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            errorHint: '请选择一张图片'
        },
        'url': {
            type: 'function',
            extract: 'value',
            check: function(value) {
                var length = 256;
                if (value.length == 0) {
                    this.errorHint = '请输入正确的URL，以http://为前缀';
                    return false;
                }else if (!value.match(/^http(s?):\/\//g)) {
                    this.errorHint = '请输入正确的URL，以http://为前缀';
                    return false;
                }else if (value.length > length) {
                    this.errorHint = '内容长度已超出'+length+'个字符，请去掉'+(value.length - length)+'个字符';
                    return false;
                }else{
                    return true;
                }
            },
            errorHint: '请输入正确的URL，以http://为前缀'
        },
        'customer-url': {
            type: 'function',
            extract: 'value',
            check: function(value) {
                var length = 256;

                if(value!= '' && !value.match(/^http(s?):\/\//g)) {
                    return false;
                } else {
                    if (value.length > length) {
                        this.errorHint = '内容长度已超出'+length+'个字符，请去掉'+(value.length - length)+'个字符';
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            errorHint: '请输入正确的URL，以http://为前缀'
        },
        'selectCheckbox': {
            type: 'function',
            extract: 'element',
            check: function(element) {
                var result = false;
                element.find('input[type="checkbox"]').each(function() {
                    if($(this).is(":checked")) {
                        result = true;
                    }
                });
                if(element.find('input[type="checkbox"]').length == 0) {
                    this.errorHint = '请创建分类';
                    return false;
                }else{
                    this.errorHint ='请选择至少一个选项';
                }
                return result;
            },
            errorHint: '请选择至少一个选项'
        }
	};

	this.getRule = function(type) {
		return this.validateRules[type];
	}
};

W.Validater = new W.ValidaterClass();

//验证入口
W.validate = function(el, checkDynamicElement) {
	var elements = [];
	if (el) {
		elements.push(el.find('input[data-validate]'))
        elements.push(el.find('textarea[data-validate]'));
        elements.push(el.find('select[data-validate]'));
        elements.push(el.find('div.wx-checkboxGroup[data-validate]'));
        elements.push(el.find('div[data-validate]'));
	} else {
		elements.push($('input[data-validate]'));
        elements.push($('textarea[data-validate]'));
        elements.push($('select[data-validate]'));
        elements.push($('div.wx-checkboxGroup[data-validate]'));
        elements.push($('div[data-validate]'));
	}

	var toggleErrorHint = function(el, isValidate, hint) {
        if (isValidate) {
            xlog('hide error hint: ' + hint);
        } else {
            xlog('show error hint: ' + hint);
        }
		var parent = el.parent();
		var errorHint = parent.find('.errorHint');
		if (errorHint) {
			if (isValidate) {
				errorHint.hide().html('');
			} else {
                var elementHint = errorHint.attr('data-error-hint');
                if (elementHint) {
                    hint = elementHint;
                }
                errorHint.html(hint).show();
			}
		}
	}

    var hasError = false;

    var elementCount = elements.length;
    for (var i = 0; i < elementCount; ++i) {
        var subElements = elements[i];

        subElements.each(function() {
            xlog('------------------ new element ----------------');
            var $el = $(this);
            /*
            if (!$el.is(":visible")) {
                //没有显示的元素，直接返回
                return
            }
            */

            if ($el.attr('data-validate-dynamic') === 'true') {
                if (!checkDynamicElement) {
                    //不检查dynamic类型的输入控件，直接返回
                    return;
                }
            }

            var value = $el.val();
            var validateTypeStr = $el.attr('data-validate');
            if (!validateTypeStr) {
                return;
            }
            xlog('validate type str: ' + validateTypeStr);

            var validateTypes = validateTypeStr.split(',');
            var validateCount = validateTypes.length;
            for (var j = 0; j < validateCount; ++j) {
                var validateType = validateTypes[j];
                xlog('run ' + validateType);
                //执行验证
                var validater = W.Validater.getRule(validateType);
                xlog(validater);
                if (!validater) {
                    continue;
                }
                if (validater.type === 'function') {
                    if (validater.extract == 'element') {
                        value = $el;
                    }

                    if (validater.check.call(validater, value)) {
                        //验证成功
                        xlog('valid');
                        toggleErrorHint($el, true, validater.errorHint);
                    } else {
                        //验证失败
                        hasError = true;
                        xlog('invalid');
                        toggleErrorHint($el, false, validater.errorHint);
                    }
                } else if (validater.type === 'regex') {
                    if (value.match(validater.regex)) {
                        //验证成功
                        xlog('valid');
                        toggleErrorHint($el, true, validater.errorHint);
                    } else {
                        //验证失败
                        hasError = true;
                        xlog('invalid');
                        toggleErrorHint($el, false, validater.errorHint);
                    }
                }
                xlog(validater.errorHint);
                if (hasError) {
                    //发现一个错误，跳出循环
                    break;
                }
            }
        });
    }

    return !hasError;
}