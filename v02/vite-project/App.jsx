/**@jsx CReact.createElement */
import CReact from './core/React.js'

function Foo() {
	console.log('re foo')
	const [count, setCount] = CReact.useState(10)
	function handleClick() {
		setCount(c => c + 1)
	}

	CReact.useEffect(() => {
		console.log('init')
	}, [])

	CReact.useEffect(() => {
		console.log('update count: ', count)
	}, [count])

	return (
		<div>
			foo
			<p>count: {count}</p>
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
