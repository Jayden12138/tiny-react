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

function initChildren(fiber, children = []) {
	let oldFiber = fiber.alternate?.child
	let prevChild = null
	children.forEach((child, index) => {
		const isSameType = oldFiber && child && oldFiber.type === child.type
		let newfilber = null
		if (isSameType) {
			newfilber = {
				type: child.type,
				props: child.props,
				child: null,
				return: fiber,
				sibling: null,
				dom: oldFiber.dom,
				alternate: oldFiber,
				effectTag: 'UPDATE',
			}
		} else {
			if (child) {
				newfilber = {
					type: child.type,
					props: child.props,
					child: null,
					return: fiber,
					sibling: null,
					dom: null,
					effectTag: 'PLACEMENT',
				}
			}
			if (oldFiber) {
				deletions.push(oldFiber)
			}
		}

		// 更新旧的fiber
		if (oldFiber) {
			oldFiber = oldFiber.sibling
		}
		if (index === 0) {
			fiber.child = newfilber
		} else {
			prevChild.sibling = newfilber
		}
		if (newfilber) {
			prevChild = newfilber
		}
	})
	while (oldFiber) {
		deletions.push(oldFiber)
		oldFiber = oldFiber.sibling
	}
}

function render(el, container) {
	nextWork = root = {
		dom: container,
		props: {
			children: [el],
		},
	}
}

let nextWork = null
let deletions = []
let root = null
let wipFiber = null
function workLoop(deadline) {
	let shouldYield = false

	while (!shouldYield && nextWork) {
		nextWork = performWorkOfUnit(nextWork)

		if (root?.sibling?.type === nextWork?.type) {
			nextWork = undefined
		}

		shouldYield = deadline.timeRemaining() < 1
	}

	if (!nextWork && root) {
		commitRoot()

		if (nextWork) {
			root = nextWork
		}
	}

	// if (nextWork && !root) {
	// 	root = nextWork
	// }

	requestIdleCallback(workLoop)
}
function commitRoot() {
	deletions.forEach(commitDeletion)
	commitWork(root.child)
	commitEffectHooks()
	root = null
	deletions = []
}
function commitEffectHooks() {
	function run(fiber) {
		if (!fiber) {
			return
		}
		if (!fiber.alternate) {
			fiber.effectHooks?.forEach(hook => {
				hook.cleanup = hook?.callback()
			})
		} else {
			const oldEffectHooks = fiber.alternate?.effectHooks
			const newEffectHooks = fiber.effectHooks

			newEffectHooks?.forEach((hook, index) => {
				if (hook.deps.length > 0) {
					const oldEffectHook = oldEffectHooks[index]
					const needUpdate = oldEffectHook.deps?.some(
						(oldDep, i) => oldDep !== hook.deps[i]
					)
					needUpdate && (hook.cleanup = hook.callback())
				}
			})
		}

		run(fiber.child)
		run(fiber.sibling)
	}
	function runCleanup(fiber) {
		if (!fiber) {
			return
		}
		fiber.alternate?.effectHooks?.forEach(hook => {
			if (hook.deps.length > 0) {
				hook.cleanup && hook.cleanup()
			}
		})
		runCleanup(fiber.child)
		runCleanup(fiber.sibling)
	}
	runCleanup(root)
	run(root)
}
function commitWork(fiber) {
	if (!fiber) {
		return
	}

	let fiberReturn = fiber.return
	while (!fiberReturn.dom) {
		fiberReturn = fiberReturn.return
	}
	const { effectTag } = fiber
	if (effectTag === 'PLACEMENT') {
		if (fiber.dom) {
			fiberReturn.dom.append(fiber.dom)
		}
	} else if (effectTag === 'UPDATE' && fiber.dom) {
		updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
	}

	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

function commitDeletion(fiber) {
	if (fiber.dom) {
		let fiberReturn = fiber.return
		while (!fiberReturn.dom) {
			fiberReturn = fiberReturn.return
		}
		fiberReturn.dom.removeChild(fiber.dom)
	} else {
		commitDeletion(fiber.child)
	}
}

function updateProps(dom, props = {}, oldProps = {}) {
	//删除
	Object.keys(oldProps).forEach(key => {
		if (key !== 'children') {
			if (!(key in props)) {
				dom.removeAttribute(key)
			}
		}
	})
	// 添加,更新
	Object.keys(props).forEach(key => {
		if (key !== 'children') {
			if (props[key] !== oldProps[key]) {
				if (key.startsWith('on')) {
					const event = key.slice(2).toLocaleLowerCase()
					dom.removeEventListener(event, oldProps[key])
					dom.addEventListener(event, props[key])
				} else {
					dom[key] = props[key]
				}
			}
		}
	})
}
function updateFunctionComponent(work) {
	stateHookIndex = 0
	stateHooks = []
	effectHooks = []
	wipFiber = work
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
		nextWork = nextWork.return
	}
}
requestIdleCallback(workLoop)

function update() {
	let currentFiber = wipFiber
	return () => {
		nextWork = {
			...currentFiber,
			alternate: currentFiber,
		}
		root = nextWork
	}
}

let stateHooks = []
let stateHookIndex = 0
function useState(initial) {
	let currentFiber = wipFiber
	let oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
	let stateHook = {
		state: oldHook ? oldHook.state : initial,
		queue: oldHook ? oldHook.queue : [],
	}

	stateHook.queue.forEach(action => {
		stateHook.state = action(stateHook.state)
	})

	stateHook.queue = []

	stateHookIndex++
	stateHooks.push(stateHook)

	currentFiber.stateHooks = stateHooks

	function setState(setter) {
		const isFunction = typeof setter === 'function'

		const eagerState = isFunction ? setter(stateHook.state) : setter

		if (eagerState === stateHook.state) return

		stateHook.queue.push(isFunction ? setter : () => setter)

		nextWork = {
			...currentFiber,
			alternate: currentFiber,
		}
		root = nextWork
	}

	return [stateHook.state, setState]
}

let effectHooks
function useEffect(callback, deps) {
	const effectHook = {
		deps,
		callback,
		cleanup: undefined,
	}

	effectHooks.push(effectHook)

	wipFiber.effectHooks = effectHooks
}

export default {
	createElement,
	render,
	update,
	useState,
	useEffect,
}
