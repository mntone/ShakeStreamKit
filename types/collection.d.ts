interface Array<T> {
	get last(): T | undefined

	equals(other: Array<T>): boolean
}

interface ReadonlyArray<T> {
	get last(): Readonly<T> | undefined

	equals(other: ReadonlyArray<T>): boolean
}
