$(function () {
	getUserInfo()
	$('.quit').on('click', function () {
		layui.layer.confirm('确认退出登录吗?', { icon: 3, title: '注意', area: ['360px', '175px'] }, function (index) {
			localStorage.removeItem('token')
			location.href = '/login.html'
			layer.close(index)
		})
	})
})

// 获取用户信息的函数
function getUserInfo() {
	$.ajax({
		method: 'GET',
		url: '/my/userinfo',
		success: function (res) {
			if (res.status !== 0) {
				return layui.layer.msg('获取用户信息失败')
			}
			// 调用渲染名字和头像的函数
			renderAvatar(res.data)
		},
		// 不论ajax请求是success还是error都会执行complete回调函数
	})
}
// 获取用户头像的函数
function renderAvatar(user) {
	// 获取用户的名称
	let name = user.nickname || user.username
	// 设置欢迎的文本
	$('#welcome').html('欢迎&nbsp;&nbsp;' + name)
	// 渲染头像
	if (user.user_pic === null) {
		// 如果用户设置的头像为空，则设置名字首个字母
		// 渲染文本头像
		$('.layui-nav-img').hide()
		$('.text-avatar').text(name[0].toUpperCase()).show()
	} else {
		// 如果用户设置的头像不为空，则设置头像
		// 渲染图片头像
		$('.layui-nav-img').attr('src', user.user_pic)
		$('.text-avatar').hide()
	}
}
