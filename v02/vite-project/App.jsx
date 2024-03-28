/**@jsx CReact.createElement */
import CReact from './core/React.js'

let showBar = true
function Counter() {
	// const foo = <div>foo</div>
	function Foo() {
		return <div>foo</div>
	}
	const bar = <span>bar</span>
	function toggleShow() {
		showBar = !showBar
		CReact.update()
	}
	return (
		<div>
			Counter
			<div>{showBar ? bar : <Foo />}</div>
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
