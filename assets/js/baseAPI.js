// 调用ajax的使用都会先调用这个函数
$.ajaxPrefilter(function (options) {
	// 拼接url，调用接口的时候每次少输入一次'http://www.liulongbin.top:3007'
	options.url = 'http://www.liulongbin.top:3007' + options.url
	// 统一为有权限的接口设置请求头
	const reg = /\/my\//
	if (reg.exec(options.url)) {
		options.headers = {
			Authorization: localStorage.getItem('token') || '',
		}
	}

	// 统一为有权限的接口设置身份认证
	options.complete = function (res) {
		if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
			localStorage.removeItem('token')
			location.href = '/login.html'
		}
	}
})
