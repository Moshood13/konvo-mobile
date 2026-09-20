// React Native Testing Library v12.4+ ships its jest matchers as part of the main
// entry point and registers them on import from a test file, so there is nothing to
// import here. Importing the library from a setup file actively hurts: jest resolves
// it to dist/ here and to src/ inside tests, giving two module instances and a
// `screen` global that never sees the render. Tests use render()'s return value.

// Chat code leans on module-scoped listener registries and MMKV singletons, so mock
// state must not leak between tests.
afterEach(() => {
	jest.clearAllMocks();
});
