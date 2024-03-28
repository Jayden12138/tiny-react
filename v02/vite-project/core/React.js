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

function updateProps(dom, nextProps, prevProps) {
	// 1. new 存在 old 不存在 删除

	Object.keys(prevProps).forEach(key => {
		if (!(key in nextProps)) {
			dom.removeAttribute(key)
		}
	})

	// 2. new 存在 old 存在 更新
	// 3. new 不存在 old 存在 新增

	Object.keys(nextProps).forEach(key => {
		if (key !== 'children') {
			if (key.startsWith('on')) {
				// onClick => click
				const eventName = key.slice(2).toLocaleLowerCase()
				dom.removeEventListener(eventName, prevProps[key])
				dom.addEventListener(eventName, nextProps[key])
			} else {
				dom[key] = nextProps[key]
			}
		}
	})
}

let deleteArr = []
function initChildren(work, children) {
	console.log(work)
	let oldChild = work.alternate?.child
	let prevChild = null
	children.forEach((child, index) => {
		const isSameType = oldChild?.type === child.type

		let newWork = null
		if (isSameType) {
			newWork = {
				type: child.type,
				props: child.props,
				dom: oldChild.dom,
				parent: work,
				child: null,
				sibling: null,
				tag: 'update',
				alternate: oldChild,
			}
		} else {
			newWork = {
				type: child.type,
				props: child.props,
				dom: null,
				parent: work,
				child: null,
				sibling: null,
				tag: 'placement',
			}

			if (oldChild) {
				// 删除
				deleteArr.push(oldChild)
			}
		}

		if (oldChild) {
			oldChild = oldChild.sibling
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
let currentRoot = null
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

function deleteOldNode(work) {
	if (work.dom) {
		let workParent = work.parent
		while (!workParent.dom) {
			workParent = workParent.parent
		}

		workParent.dom.removeChild(work.dom)
	} else {
		// function component 并没有dom，所以这里删除其child
		deleteOldNode(work.child)
	}
}

function commitRoot() {
	deleteArr.forEach(deleteOldNode)
	commitWork(root.child)
	currentRoot = root
	root = null
	deleteArr = []
}

function commitWork(work) {
	if (!work) return

	let workParent = work.parent
	while (!workParent.dom) {
		workParent = workParent.parent
	}

	// if (work.dom) {
	// 	workParent.dom.append(work.dom)
	// }

	if (work.tag === 'update') {
		updateProps(work.dom, work.props, work.alternate.props)
	} else if (work.tag === 'placement') {
		if (work.dom) {
			workParent.dom.append(work.dom)
		}
	}

	commitWork(work.child)
	commitWork(work.sibling)
}

function updateFunctionComponent(work) {
	const children = [work.type(work.props)]

	initChildren(work, children)
}

function updateHostComponent(work) {
	if (!work.dom) {
		// 创建dom
		const dom = (work.dom = createDom(work.type))

		// props
		updateProps(dom, work.props, {})
	}

	const children = work.props.children

	initChildren(work, children)
}

// 执行任务
function performWorkOfUnit(work) {
	// 1. 创建dom
	// 2. props
	// 3. 转换链表 设置好指针
	// 4. 返回下一个要执行的任务

	const isFunctionComponent = typeof work.type === 'function'
	if (!isFunctionComponent) {
		updateHostComponent(work)
	} else {
		updateFunctionComponent(work)
	}

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

function update() {
	nextWork = {
		dom: currentRoot.dom,
		props: currentRoot.props,
		alternate: currentRoot,
	}
	root = nextWork
}

export default {
	createElement,
	render,
	update,
}
