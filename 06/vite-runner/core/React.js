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

function createTextNode(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

// render 递归 整个树
function render(el, container) {
	nextWork = {
		dom: container,
		props: {
			children: [el],
		},
	}
	root = nextWork
}

let root = null
let nextWork = null
function workLoop(IdleDeadline) {
	let shouldYield = false
	while (!shouldYield && nextWork) {
		nextWork = performWorkOfUnit(nextWork)

		shouldYield = IdleDeadline.timeRemaining() < 1
	}

	if (!nextWork && root) {
		commitRoot()
	}

	requestIdleCallback(workLoop)
}

function commitRoot() {
	commitWork(root.child)
	root = null
}

function commitWork(fiber) {
	if (!fiber) return
	fiber.parent.dom.append(fiber.dom)
	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

function createDom(type) {
	return type === 'TEXT_ELEMENT'
		? document.createTextNode('')
		: document.createElement(type)
}

function updateProps(dom, props) {
	Object.keys(props).forEach(key => {
		if (key !== 'children') {
			dom[key] = props[key]
		}
	})
}
function initChildren(fiber) {
	// 3. 树转换成链表 设置好指针
	const children = fiber.props.children
	let prevChild = null
	children.forEach((child, index) => {
		const newFiber = {
			type: child.type,
			props: child.props,
			dom: null,
			parent: fiber,
			child: null,
			sibling: null,
		}

		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevChild.sibling = newFiber
		}

		prevChild = newFiber
	})
}

function performWorkOfUnit(fiber) {
	if (!fiber.dom) {
		// 1. 创建dom
		const dom = (fiber.dom = createDom(fiber.type))
		// fiber.parent.dom.append(dom)

		// 2. 处理props
		updateProps(dom, fiber.props)
	}

	// 3. 树转换成链表 设置好指针
	initChildren(fiber)

	// 4. 返回下一个要执行的任务
	if (fiber.child) {
		return fiber.child
	}

	if (fiber.sibling) {
		return fiber.sibling
	}

	return fiber.parent?.sibling
}

requestIdleCallback(workLoop)

export default { createElement, render }
