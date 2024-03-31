import React from '../core/React'

export function Todos() {
	const [filter, setFilter] = React.useState('all')
	const [inputValue, setInputValue] = React.useState('')
	const [displayTodos, setDisplayTodos] = React.useState([])
	const [todos, setTodos] = React.useState([])

	React.useEffect(() => {
		const savedTodos = localStorage.getItem('todos')
		if (savedTodos) {
			setTodos(JSON.parse(savedTodos))
		}
	}, [])

	React.useEffect(() => {
		console.log('change filter, todos', filter, todos)
		if (filter === 'all') {
			setDisplayTodos(todos)
		} else if (filter === 'active') {
			const newTodos = todos.filter(todo => todo.status === 'active')
			setDisplayTodos(newTodos)
		} else if (filter === 'done') {
			const newTodos = todos.filter(todo => todo.status === 'done')
			setDisplayTodos(newTodos)
		}
	}, [filter, todos])

	function handleAdd() {
		// react 函数式编程
		// 不能破坏之前的，每次都需要创建新的
		// setTodos([...todos, { title: inputValue }])
		addTodo(inputValue)

		setInputValue('')
	}

	function createTodo(title) {
		return {
			id: crypto.randomUUID(),
			title,
			status: 'active',
		}
	}

	function addTodo(title) {
		setTodos([...todos, createTodo(title)])
	}

	function removeTodo(id) {
		const newTodos = todos.filter(todo => todo.id !== id)
		setTodos(newTodos)
	}

	function doneTodo(id) {
		const newTodos = todos.map(todo => {
			if (todo.id === id) {
				return {
					...todo,
					status: 'done',
				}
			}
			return todo
		})
		setTodos(newTodos)
	}

	function cancelTodo(id) {
		const newTodos = todos.map(todo => {
			if (todo.id === id) {
				return {
					...todo,
					status: 'active',
				}
			}
			return todo
		})
		setTodos(newTodos)
	}
	function saveTodos() {
		localStorage.setItem('todos', JSON.stringify(todos))
	}

	return (
		<div>
			<h1>todos</h1>
			<div>
				<input
					type="text"
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
				/>
				<button onClick={handleAdd}>add</button>
			</div>

			<div>
				<button onClick={saveTodos}>save</button>
			</div>

			<div>
				<input
					type="radio"
					name="filter"
					id="all"
					checked={filter === 'all'}
					onChange={() => setFilter('all')}
				/>
				<label htmlFor="all">all</label>

				<input
					type="radio"
					name="filter"
					id="active"
					checked={filter === 'active'}
					onChange={() => setFilter('active')}
				/>
				<label htmlFor="active">active</label>

				<input
					type="radio"
					name="filter"
					id="done"
					checked={filter === 'done'}
					onChange={() => setFilter('done')}
				/>
				<label htmlFor="done">done</label>
			</div>

			<ul>
				{...displayTodos.map(todo => (
					<li>
						<TodoItem
							todo={todo}
							removeTodo={removeTodo}
							doneTodo={doneTodo}
							cancelTodo={cancelTodo}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

function TodoItem({ todo, removeTodo, doneTodo, cancelTodo }) {
	return (
		<div className={todo.status}>
			{todo.title}
			<button onClick={() => removeTodo(todo.id)}>remove</button>
			{todo.status === 'active' ? (
				<button onClick={() => doneTodo(todo.id)}>done</button>
			) : (
				<button onClick={() => cancelTodo(todo.id)}>cancel</button>
			)}
		</div>
	)
}
