type ReduxLocalState<R> = {
	[P in keyof R]: R[P] extends (...args: any) => any ? ReturnType<R[P]> : never;
};

export { ReduxLocalState };
