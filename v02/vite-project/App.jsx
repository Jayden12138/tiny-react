/**@jsx CReact.createElement */
import CReact from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hello world')

// function component
let count = 10
function Counter() {
	function handleClick() {
		count++
		CReact.update()
	}
	return (
		<div>
			<span>Counter: {count}</span>
			<button onClick={handleClick}>click</button>
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
