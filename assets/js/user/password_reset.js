$(function () {
	var form = layui.form
	form.verify({
		//数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
		pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		samePwd: function (value) {
			let pwd = document.querySelector('[name=oldPwd]')
			if (value === pwd.value) {
				return '新密码不能和原密码相同'
			}
		},
		repwd: function (value, item) {
			let pwd = document.querySelector('.newPwb')
			if (value !== pwd.value) {
				return '两次密码不一致'
			}
		},
	})

	// 对表单的提交进行事件监听
	$('.formRpw').on('submit', function (e) {
		e.preventDefault()
		let layer = layui.layer
		// 发送修改密码的ajax请求
		$.ajax({
			method: 'POST',
			url: '/my/updatepwd',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('修改密码失败,' + res.message)
				}
				layer.msg('修改密码成功')
				$('button[type=reset]').click()
			},
		})
	})
})
