// 1.1 获取裁剪区域的 DOM 元素
$(function () {
	var $image = $('#image')
	// 1.2 配置选项
	const options = {
		//  宽高比
		aspectRatio: 1,
		// 指定预览区域
		preview: '.img-preview',
	}

	// 1.3 创建裁剪区域
	$image.cropper(options)

	// 上传按钮
	$('#upload').click(function (e) {
		$('#fileUpload').click()
	})

	var layer = layui.layer
	$('#fileUpload').on('change', function (e) {
		if (e.target.files.length < 1) {
			return layer.msg('上传失败')
		}
		// 获取文件
		var file = e.target.files[0]
		// 将文件转换为url路径
		var newImgURL = URL.createObjectURL(file)
		// 重新初始化裁剪区域
		$image
			.cropper('destroy') // 销毁旧的裁剪区域
			.attr('src', newImgURL) // 重新设置图片路径
			.cropper(options) // 重新初始化裁剪区域
	})

	// 为确定按钮绑定点击事件
	$('#btnSubmit').click(function (e) {
		// 拿到用户裁剪之后的头像
		var dataURL = $image
			.cropper('getCroppedCanvas', {
				// 创建一个 Canvas 画布
				width: 100,
				height: 100,
			})
			.toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
		// 调用接口，把头像上传到服务器
		$.ajax({
			method: 'POST',
			url: '/my/update/avatar',
			data: {
				avatar: dataURL,
			},
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				layer.msg(res.message)
				window.parent.getUserInfo()
			},
		})
	})
})
