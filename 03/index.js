// requestIdleCallback
function callback(IdleDeadline) {
	// console.log(IdleDeadline.timeRemaining()) // 计算剩余时间

	let shouldYield = false
	while (!shouldYield) {
		console.log(IdleDeadline.timeRemaining())

		// TODO 渲染dom

		shouldYield = IdleDeadline.timeRemaining() < 1
	}
}

requestIdleCallback(callback)
