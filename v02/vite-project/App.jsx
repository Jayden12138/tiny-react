/**@jsx CReact.createElement */
import CReact from './core/React.js'

let fooCount = 0
function Foo() {
	console.log('foo return')
	const update = CReact.update()
	function handleClick() {
		fooCount += 1
		update()
	}
	return (
		<div>
			foo
			{fooCount}
			<button onClick={handleClick}>click</button>
		</div>
	)
}

let barCount = 0
function Bar() {
	console.log('bar return')
	const update = CReact.update()
	function handleClick() {
		barCount += 1
		update()
	}
	return (
		<div>
			bar
			{barCount}
			<button onClick={handleClick}>click</button>
		</div>
	)
}

let countRoot = 1
function App() {
	console.log('app return')
	const update = CReact.update()
	function handleClick() {
		countRoot += 1
		update()
	}
	return (
		<div id="app">
			count: {countRoot}
			<button onClick={handleClick}>click</button>
			<Foo></Foo>
			<Bar></Bar>
		</div>
	)
}

export default App
