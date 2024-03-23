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
	const dom =
		el.type === 'TEXT_ELEMENT'
			? document.createTextNode('')
			: document.createElement(el.type)

	// props
	Object.keys(el.props).forEach(key => {
		if (key !== 'children') {
			dom[key] = el.props[key]
		}
	})

	// children
	const children = el.props.children
	children.forEach(child => render(child, dom))

	// mount
	container.append(dom)
}

export default { createElement, render }
