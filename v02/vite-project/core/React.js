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
			children: children.map(child => {
				const isTextNode =
					typeof child === 'string' || typeof child === 'number'
				return isTextNode ? createTextNode(child) : child
			}),
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

function initChildren(work, children) {
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
	root = nextWork
}

let nextWork = null
let root = null
function workLoop(deadline) {
	let shouldYield = false

	while (!shouldYield && nextWork) {
		nextWork = performWorkOfUnit(nextWork)

		shouldYield = deadline.timeRemaining() < 1
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

function commitWork(work) {
	if (!work) return

	let workParent = work.parent
	while (!workParent.dom) {
		workParent = workParent.parent
	}

	if (work.dom) {
		workParent.dom.append(work.dom)
	}
	commitWork(work.child)
	commitWork(work.sibling)
}

// 执行任务
function performWorkOfUnit(work) {
	// 1. 创建dom
	// 2. props
	// 3. 转换链表 设置好指针
	// 4. 返回下一个要执行的任务

	const isFunctionComponent = typeof work.type === 'function'
	if (!isFunctionComponent) {
		if (!work.dom) {
			// 创建dom
			const dom = (work.dom = createDom(work.type))
			// work.parent.dom.append(dom)

			// props
			updateProps(dom, work.props)
		}
	}

	const children = isFunctionComponent
		? [work.type(work.props)]
		: work.props.children
	// children
	initChildren(work, children)

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
