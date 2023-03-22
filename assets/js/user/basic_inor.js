$(function () {
	// 表单验证规则，对昵称进行规则
	var form = layui.form
	form.verify({
		nickname: function (value, item) {
			//value：表单的值、item：表单的DOM对象
			if (value.length > 6 || value.length < 1) {
				return '昵称长度必须在 1~6 个字符之间'
			}
		},
	})

	getUserInfo()

	// 对表单提交事件进行绑定
	$('.formUserInfo').on('submit', function (e) {
		e.preventDefault()
		// 更新用户信息
		changeUserInfo()
	})
	// 对重置按钮进行事件绑定
	$('.btnReset').click(function (e) {
		e.preventDefault()
		getUserInfo()
	})

	// 调用获取用户信息接口的函数
	function getUserInfo() {
		$.ajax({
			method: 'GET',
			url: '/my/userinfo',
			success: function (res) {
				if (res.status !== 0) {
					return layui.layer.msg('获取用户信息失败')
				}
				// 渲染信息的函数
				renderUserInfo(res.data)
			},
		})
	}
	// 根据参数渲染用户信息
	function renderUserInfo(user) {
		// 第一种方法
		// $('.username').val(user.username || '')
		// $('.nickname').val(user.nickname || '')
		// $('.email').val(user.email || '')
		// 第二种方法,调用layui内置方法快速为表单赋值
		layui.form.val('user', user)
	}

	// 调用更改用户信息接口的函数
	function changeUserInfo() {
		$.ajax({
			method: 'POST',
			url: '/my/userinfo',
			data: { id: $('[name=id]').val(), nickname: $('[name=nickname]').val(), email: $('[name=email]').val() },
			success: function (res) {
				if (res.status !== 0) {
					return layui.layer.msg('修改用户信息失败')
				}
				// 提交用户信息
				layui.layer.msg('更新用户信息成功')
				// 提交用户信息以后再进行获取
				getUserInfo()
				// 调用父页面的方法进行名称和头像的渲染
				window.parent.getUserInfo()
			},
		})
	}
})
