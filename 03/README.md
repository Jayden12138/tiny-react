```js
// 看得见的思考

// // 1. hello world
// const app = document.querySelector('#app')
// const dom = document.createElement('div')
// dom.id = 'root'
// app.append(dom)

// const textEl = document.createTextNode('')
// textEl.nodeValue = 'hello world'
// dom.append(textEl)

// 2. react -> vdom -> object
// const text = {
// 	type: 'TEXT_ELEMENT',
// 	props: {
// 		nodeValue: 'hello world',
// 		children: [],
// 	},
// }
// const el = {
// 	type: 'div',
// 	props: {
// 		id: 'root',
// 		children: [text],
// 	},
// }

// // object -> vnode
// const app = document.querySelector('#app')
// const dom = document.createElement(el.type)
// dom.id = el.props.id
// app.append(dom)

// const textEl = document.createTextNode('')
// textEl.nodeValue = text.props.nodeValue
// dom.append(textEl)

// // function
// function createElement(type, props, ...children) {
// 	return {
// 		type,
// 		props: {
// 			...props,
// 			children: children.map(child =>
// 				typeof child === 'string' ? createTextNode(child) : child
// 			),
// 		},
// 	}
// }

// function createTextNode(text) {
// 	return {
// 		type: 'TEXT_ELEMENT',
// 		props: {
// 			nodeValue: text,
// 			children: [],
// 		},
// 	}
// }

// // render 递归 整个树
// function render(el, container) {
// 	const dom =
// 		el.type === 'TEXT_ELEMENT'
// 			? document.createTextNode('')
// 			: document.createElement(el.type)

// 	// props
// 	Object.keys(el.props).forEach(key => {
// 		if (key !== 'children') {
// 			dom[key] = el.props[key]
// 		}
// 	})

// 	// children
// 	const children = el.props.children
// 	children.forEach(child => render(child, dom))

// 	// mount
// 	container.append(dom)
// }
// // const app = document.querySelector('#app')
// const el = createElement('div', { id: 'root' }, 'hello world! ', 'Jayden')
// // render(el, app)

// 重构
// const ReactDOM = {
// 	createRoot(container) {
// 		return {
// 			render(el) {
// 				render(el, container)
// 			},
// 		}
// 	},
// }

import ReactDOM from './core/ReactDOM.js'
import App from './App.js'

const app = document.querySelector('#app')
ReactDOM.createRoot(app).render(App)
```
