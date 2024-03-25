// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback

function callback(deadline) {
	let shouldYield = false

	while (!shouldYield) {
		console.log(deadline.timeRemaining())

		shouldYield = deadline.timeRemaining() < 1
	}
}

requestIdleCallback(callback)
