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

function render(el, container) {
	// dom
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
	if (children) {
		children.forEach(child => render(child, dom))
	}

	// append
	container.append(dom)
}

export default {
	createElement,
	render,
}
