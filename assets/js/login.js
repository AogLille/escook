window.addEventListener('load', function () {
	let link_reg = document.querySelector('#link_reg')
	let link_login = document.querySelector('#link_login')
	link_reg.addEventListener('click', function (e) {
		this.parentNode.style.display = 'none'
		link_login.parentNode.style.display = 'block'
	})
	link_login.addEventListener('click', function (e) {
		this.parentNode.style.display = 'none'
		link_reg.parentNode.style.display = 'block'
	})

	var form = layui.form
	form.verify({
		username: function (value, item) {
			//value：表单的值、item：表单的DOM对象
			if (!new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$').test(value)) {
				return '用户名不能有特殊字符'
			}
			if (/(^\_)|(\__)|(\_+$)/.test(value)) {
				return "用户名首尾不能出现下划线'_'"
			}
			if (/^\d+\d+\d$/.test(value)) {
				return '用户名不能全为数字'
			}

			//如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
			if (value === 'xxx') {
				alert('用户名不能为敏感词')
				return true
			}
		},

		//我们既支持上述函数式的方式，也支持下述数组的形式
		//数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
		pass: [/^\S*(?=\S{6,12})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/, '密码必须6到12位，且包含大写字母、小写字母、数字、特殊字符中的任意三项'],
	})
})
