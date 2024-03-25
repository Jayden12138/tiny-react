function createTextNode(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map(child =>
				typeof child === 'string' ? createTextNode(child) : child
			),
		},
	}
}

function createDom(type) {
	// dom
	return type === 'TEXT_ELEMENT'
		? document.createTextNode('')
		: document.createElement(type)
}

function updateProps(dom, props) {
	// props
	Object.keys(props).forEach(key => {
		if (key !== 'children') {
			dom[key] = props[key]
		}
	})
}

function initChildren(work) {
	console.log(work, work.props.children)
	const children = work.props.children
	let prevChild = null
	children.forEach((child, index) => {
		const newWork = {
			type: child.type,
			props: child.props,
			dom: null,
			parent: work,
			child: null,
			sibling: null,
		}
		if (index === 0) {
			work.child = newWork
		} else {
			prevChild.sibling = newWork
		}
		prevChild = newWork
	})
}

//
function render(el, container) {
	// root 主入口
	nextWork = {
		dom: container,
		props: {
			children: [el],
		},
	}
}

let nextWork = null
function workLoop(deadline) {
	let shouldYield = false

	while (!shouldYield && nextWork) {
		nextWork = performWorkOfUnit(nextWork)

		shouldYield = deadline.timeRemaining() < 1
	}

	requestIdleCallback(workLoop)
}

// 执行任务
function performWorkOfUnit(work) {
	// 1. 创建dom
	// 2. props
	// 3. 转换链表 设置好指针
	// 4. 返回下一个要执行的任务

	console.log(work)

	if (!work.dom) {
		// 创建dom
		const dom = (work.dom = createDom(work.type))
		work.parent.dom.append(dom)

		// props
		updateProps(dom, work.props)
	}

	// children
	initChildren(work)

	// 返回下一个任务
	if (work.child) {
		return work.child
	}

	let nextWork = work
	while (nextWork) {
		if (nextWork.sibling) {
			return nextWork.sibling
		}
		nextWork = nextWork.parent
	}
}
requestIdleCallback(workLoop)

export default {
	createElement,
	render,
}
