/**@jsx CReact.createElement */
import CReact from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hello world')
const App = (
	<div id="app">
		<div className="child child-1">
			<div className="child child-1-1">child 1-1</div>
			<div className="child child-1-2">child 1-2</div>
		</div>
		<div className="child child-2">
			<div className="child child-2-1">child 2-1</div>
			<div className="child child-2-2">child 2-2</div>
		</div>
	</div>
)

export default App
