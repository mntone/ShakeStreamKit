interface Array<T> {
	get last(): T | undefined

	equals(other: Array<T>): boolean
}
