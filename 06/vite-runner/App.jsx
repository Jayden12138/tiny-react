/**@jsx CReact.createElement */
import CReact from './core/React.js'

// function component
function Counter({ count }) {
	return <div>count: {count}</div>
}

function App() {
	return (
		<div id="root">
			hello world! Jayden
			<Counter count={10}></Counter>
			<Counter count={20}></Counter>
		</div>
	)
}

export default App
