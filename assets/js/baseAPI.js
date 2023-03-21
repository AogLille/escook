// 调用ajax的使用都会先调用这个函数
$.ajaxPrefilter(function (options) {
	options.url = 'http://www.liulongbin.top:3007' + options.url
})
