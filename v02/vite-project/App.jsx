/**@jsx CReact.createElement */
import CReact from './core/React.js'

let showBar = false
function Counter() {
	const foo = (
		<div>
			foo
			<div>child1</div>
			<div>child2</div>
			<div>child3</div>
		</div>
	)
	const bar = <div>bar</div>
	function toggleShow() {
		showBar = !showBar
		CReact.update()
	}
	return (
		<div>
			Counter
			<div>{showBar ? bar : foo}</div>
			<button onClick={toggleShow}>toggleShow</button>
		</div>
	)
}

function App() {
	return (
		<div id="app">
			<Counter />
		</div>
	)
}

export default App
