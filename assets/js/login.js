$(function () {
	// 登录页面和注册页面的切换
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

	// 表单验证
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
		pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		repwd: function (value, item) {
			let pwd = document.querySelector('.reg-box [name=password]')
			if (value !== pwd.value) {
				return '两次密码不一致'
			}
		},
	})

	var layer = layui.layer
	// 监听注册表单的提交事件
	$('#reg-form').on('submit', function (e) {
		e.preventDefault()
		let formstr = $(this).serialize()
		let datastr = formstr.substring(0, formstr.indexOf('repassword') - 1)
		$.ajax({
			method: 'POST',
			url: '/api/reguser',
			data: datastr,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg(
						res.message,
						{
							icon: 5,
							time: 2000, //2秒关闭（如果不配置，默认是3秒）
						},
						function () {
							//注册失败提示框结束以后的处理
						}
					)
				}
				// 注册成功
				layer.msg(
					res.message,
					{
						icon: 1,
						time: 2000, //2秒关闭（如果不配置，默认是3秒）
					},
					function () {
						link_login.click()
						$('#reg-form')[0].reset()
					}
				)
			},
		})
	})

	// 监听登录表单的提交事件
	$('#login-form').on('submit', function (e) {
		e.preventDefault()
		let formstr = $(this).serialize()
		$.post('/api/login', formstr, (res) => {
			if (res.status !== 0) {
				return layer.msg(
					'登录失败',
					{
						icon: 5,
						time: 2000, //2秒关闭（如果不配置，默认是3秒）
					},
					function () {
						//登录失败的回调函数
						// document.querySelector('#login-form').reset()
					}
				)
			}
			// 登录成功
			layer.msg(
				'登录成功',
				{
					icon: 1,
					time: 2000, //2秒关闭（如果不配置，默认是3秒）
				},
				function () {
					// console.log(res.token)   能够成功获取token
					// 可以将登录成功得到的token字符串保存在localStorage中
					localStorage.setItem('token', res.token)
					//跳转到首页
					location.href = '/index.html'
					// 清空表单
					document.querySelector('#login-form').reset()
				}
			)
		})
	})
})
