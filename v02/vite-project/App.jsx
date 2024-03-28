/**@jsx CReact.createElement */
import CReact from './core/React.js'

let showBar = false
function Counter() {
	const bar = <div>bar</div>
	function toggleShow() {
		showBar = !showBar
		CReact.update()
	}
	return (
		<div>
			Counter
			{showBar && bar}
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
