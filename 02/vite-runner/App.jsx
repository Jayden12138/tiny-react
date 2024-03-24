/**@jsx CReact.createElement */
import CReact from './core/React.js'

console.time('renderTime') // 开始计时
// const App = React.createElement(
// 	'div',
// 	{ id: 'root' },
// 	'hello world! ',
// 	'Jayden'
// )
const App = <div id="root">hello world! Jayden</div>
// const App = <div id="root">{generateDOM(20)}</div>
// console.log(App)

export default App

function generateDOM(depth) {
	if (depth === 0) {
		return null
	}

	return (
		<div id={depth}>
			deep tree{generateDOM(depth - 1)} {generateDOM(depth - 1)}
		</div>
	)
}

console.timeEnd('renderTime')
