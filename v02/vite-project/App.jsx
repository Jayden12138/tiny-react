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
		return () => {
			console.log('cleanup 0')
		}
	}, [])

	CReact.useEffect(() => {
		console.log('update1 count: ', count)
		return () => {
			console.log('cleanup 1')
		}
	}, [count])

	CReact.useEffect(() => {
		console.log('update2 count: ', count)
		return () => {
			console.log('cleanup 2')
		}
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
