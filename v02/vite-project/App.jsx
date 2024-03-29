/**@jsx CReact.createElement */
import CReact from './core/React.js'

function Foo() {
	const [count, setCount] = CReact.useState(10)
	const [bar, setBar] = CReact.useState('bar')
	function handleClick() {
		setCount(c => c + 1)
		setBar(b => b + ' bar')
	}
	return (
		<div>
			foo
			<p>count: {count}</p>
			<p>bar: {bar}</p>
			<button onClick={handleClick}>click</button>
		</div>
	)
}
function App() {
	return (
		<div id="app">
			app
			<Foo></Foo>
		</div>
	)
}

export default App
