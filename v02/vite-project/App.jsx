/**@jsx CReact.createElement */
import CReact from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hello world')

// function component
function Counter({ num }) {
	return (
		<div>
			<span>Counter: {num}</span>
		</div>
	)
}

function CountContianer() {
	return <Counter num={30} />
}

// const App = (
// 	<div id="app">
// 		<Counter num={10} />
// 		<Counter num={20} />
// 		<CountContianer />
// 	</div>
// )

function App() {
	return (
		<div id="app">
			<Counter num={10} />
			<Counter num={20} />
			<CountContianer />
		</div>
	)
}

export default App
