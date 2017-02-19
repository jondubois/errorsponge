# ErrorSponge
A simple utility library for dehydrating errors for transmission and then rehydrating them.

<img alt="Hydrate SpongeBob" src="assets/spongebob.gif" title="Hydrate" />

## Install

```
npm install errorsponge
```

## API

```
var ErrorSponge = require('errorsponge').ErrorSponge;
```

### new ErrorSponge([options])

Create a new ErrorSponge utility to dehydrate and hydrate errors.
The `options` object is optional and can have the following properties:

- `unserializableErrorProperties` - A list of properties (strings) on Error objects which should be ignored when dehydrating.

### dehydrateError(error, [includeStackTrace])

Convert a JavaScript Error object into a serializable JSON object which can then easily be converted into a string using `JSON.stringify()` and sent across the network.
If `includeStackTrace` is specified and set to true, the error's stack trace will be included as part of the dehydrated JSON object.

### hydrateError(dehydratedError)

Convert a dehydrated JSON error back into a JavaScript Error object.

## Conventions

To make error handling easier, it is recommended that all Error objects have a custom `name` which allows your code to quickly identify the type of the error after it has been rehydrated.
A good way to instantiate errors might be (example):

```
var err = new Error('The provided object did not have all the required properties');
err.name = 'MissingPropertiesError';
```
