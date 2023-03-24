$(function () {
	// 定义一个查询参数q,用于未来提交请求的时候,将q提交到服务器
	let q = {
		pagenum: 1, //页码值,用于获取当前所在页
		pagesize: 2, //每页显示多少数据
		cate_id: '',
		state: '',
	}
	let layer = layui.layer
	let form = layui.form
	let laypage = layui.laypage
	// 编辑弹框
	let indexEdit = null
	// 定义美化时间的过滤器
	template.defaults.imports.dataFormat = function (date) {
		const dt = new Date(date)
		let y = dt.getFullYear()
		let m = padZero(dt.getMonth() + 1)
		let d = padZero(dt.getDate())
		let hh = padZero(dt.getHours())
		let mm = padZero(dt.getMinutes())
		let ss = padZero(dt.getSeconds())
		return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
	}
	// 对于时间过滤器补零的方法
	function padZero(num) {
		return num < 10 ? '0' + num : num
	}
	getCate()
	getEssay()
	// 监听筛选的点击事件
	$('.formSelect').on('submit', function (e) {
		e.preventDefault()
		q.cate_id = $('[name=cate_id]').val()
		q.state = $('[name=state]').val()
		getEssay()
	})

	// 监听删除按钮的点击事件,通过事件委托
	$('body').on('click', '.btnDelete', function (e) {
		let len = $('.btnDelete').length()
		let id = $(this).data('id')
		// 弹出确认框
		layer.confirm(
			'确认删除?',
			{ icon: 3, title: '提示' },
			// 根据所在行的id进行删除行操作
			function (index) {
				$.ajax({
					method: 'GET',
					url: '/my/article/delete/' + id,
					success: function (res) {
						if (res !== 0) {
							return layer.msg(res.message)
						}
						// 判断该页数据是否删除完毕,如果删除成功,页码值-1
						if (len <= 1) {
							//如果这是最后一条数据,则页码减一,同时判断是否是在第一页,如果是则不变
							p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
						}
						getEssay()
						layer.msg(res.message)
					},
				})
				layer.close(index)
			}
		)
	})

	// 监听编辑按钮
	$('body').on('click', '.btnEdit', function (e) {
		indexEdit = ayer.open({
			type: 1,
			area: ['500px', '250px'],
			title: ' 修改文章类别',
			content: $('#formEdit').html(),
		})
		// 根据编辑按钮的id获取文章类别的信息进行渲染
		let id = $(this).data('id')
		$.ajax({
			method: 'GET',
			url: '/my/article/' + id,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				form.val('edit', res.data)
			},
		})
		// 为编辑表单绑定submit事件
		$('body').on('submit', '#form-edit', function (e) {
			e.preventDefault()
			$.ajax({
				method: 'POST',
				url: '/my/article/edit',
				data: $(this).serialize(),
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg(res.message)
					}
					getEssay()
					layer.close(indexEdit)
				},
			})
		})
	})

	// 获取文章列表的函数
	function getEssay() {
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: q,
			success: function (res) {
				if (res.status !== 0) {
					console.log(res)
					return layer.msg(res.message)
				}
				let htmlStr = template('tpl-table', res.data)
				$('tbody').html(htmlStr)
				renderPage(res.total)
			},
		})
	}

	// 初始化文章分类选择框
	function getCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				let htmlStr = template('tpl-cate', res)
				$('[name=cate_id]').html(htmlStr)
				form.render()
			},
		})
	}

	// 定义渲染分页的方法
	function renderPage(total) {
		laypage.render({
			elem: 'pag', //注意，这里的 test1 是 ID，不用加 # 号
			count: total,
			curr: q.pagenum, //设置选中哪一页
			limit: q.pagesize, //每一页多少条
			limits: [2, 4, 6, 8, 10],
			layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 每一页选择的条数
			jump: function (obj, first) {
				//obj包含了当前分页的所有参数，比如：
				//console.log(obj.curr) //得到当前页，以便向服务端请求对应页的数据。
				//console.log(obj.limit) //得到每页显示的条数

				//首次不执行
				if (!first) {
					q.pagenum = obj.curr
					q.pagesize = obj.limit
					getEssay()
				}
			},
		})
	}
})
