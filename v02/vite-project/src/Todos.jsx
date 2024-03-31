import React from '../core/React'

export function Todos() {
	const [inputValue, setInputValue] = React.useState('')
	const [todos, setTodos] = React.useState([
		{
			id: crypto.randomUUID(),
			title: '吃饭',
			status: 'active',
		},
		{
			id: crypto.randomUUID(),
			title: '喝水',
			status: 'active',
		},
		{
			id: crypto.randomUUID(),
			title: '写代码',
			status: 'active',
		},
	])

	function handleAdd() {
		// react 函数式编程
		// 不能破坏之前的，每次都需要创建新的
		// setTodos([...todos, { title: inputValue }])
		addTodo(inputValue)

		setInputValue('')
	}

	function addTodo(title) {
		setTodos([...todos, { title, id: crypto.randomUUID() }])
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

			<ul>
				{...todos.map(todo => (
					<li>
						{/* {todo.title}
						<button onClick={() => removeTodo(todo.id)}>
							remove
						</button>
						{todo.status === 'active' ? (
							<button onClick={() => doneTodo(todo.id)}>
								done
							</button>
						) : (
							<button onClick={() => cancelTodo(todo.id)}>
								cancel
							</button>
						)} */}

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
