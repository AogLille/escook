$(function () {
	getArticleCate()
	// 获取文章列表,便于接下来的ajax函数结束以后重新渲染页面
	function getArticleCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				let htmlStr = template('tpl-table', res)
				$('.layui-card-body tbody').html(htmlStr)
			},
		})
	}
	let layer = layui.layer
	let indexAdd = null
	// 为添加类别按钮添加点击事件
	$('.btnCate').on('click', function (e) {
		indexAdd = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: ' 添加文章类别',
			content: $('#dialog-add').html(),
		})
		// 通过代理的形式为添加表单按钮绑定submit事件，因为再点击添加类别之前是没有分类表单的，无法对其进行事件的绑定
		$('body').on('submit', '#form-add', function (e) {
			e.preventDefault()
			$.ajax({
				method: 'POST',
				url: '/my/article/addcates',
				data: $(this).serialize(),
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg(res.message)
					}
					getArticleCate()
					layer.close(indexAdd)
				},
			})
		})
	})

	let form = layui.form
	let indexEdit = null
	// 为编辑按钮添加点击事件
	$('body').on('click', '.btnEdit', function (e) {
		// 显示弹出窗
		indexEdit = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: ' 修改文章类别',
			content: $('#dialog-edit').html(),
		})
		// 根据编辑按钮的id获取文章类别的信息进行渲染
		let id = $(this).data('id')
		$.ajax({
			method: 'GET',
			url: `/my/article/cates/${id}`,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				form.val('edit', res.data)
			},
		})
		// 为编辑表单绑定submit界面
		$('body').on('submit', '#form-edit', function (e) {
			e.preventDefault()
			$.ajax({
				method: 'POST',
				url: '/my/article/updatecate',
				data: $(this).serialize(),
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg(res.message)
					}
					getArticleCate()
					layer.close(indexEdit)
				},
			})
		})
	})

	// 为删除按钮绑定点击事件
	$('body').on('click', '.btnDelete', function (e) {
		// 拿到删除行的id
		let id = $(this).data('id')
		layer.confirm('确认删除?', { icon: 3, title: '提示' }, 
		// 根据所在行的id进行删除行操作
		function (index) {
			$.ajax({
				method: 'GET',
				url: '/my/article/deletecate/' + id,
				success: function (res) {
					if (res !== 0) {
						return layer.msg(res.message)
					}
					getArticleCate()
					layer.msg(res.message)
				},
			})
			layer.close(index)
		})
	})
})
