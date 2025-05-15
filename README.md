# Dumb Typebox Openapi Autogen with NextJS

A simple Next.js project that shows how to use TypeBox, AJV, and OpenAPI together to build better APIs.

## What This Project Does

This project helps you build APIs by connecting three useful tools:

- **TypeBox**: Helps define data structures in TypeScript
- **AJV**: Checks if data is valid
- **OpenAPI**: Creates documentation for your API

With this setup, you only need to define your data structures once, and you'll get:
1. TypeScript types for code completion
2. Data validation
3. API documentation

## Setup Instructions

```bash
# Get the code
git clone https://github.com/yourusername/nextjs-typebox-ajv-to-openapi-spec.git
cd nextjs-typebox-ajv-to-openapi-spec

# Install packages
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### 1. Define Your Data Structure with TypeBox

TypeBox lets you define what your data should look like:

```typescript
import { Static, Type } from "@sinclair/typebox";

// Define what the request data should include
export const bodySchema = Type.Object({
    firstName: Type.String({description: "User's first name"}),
    lastName: Type.String({description: "User's last name"}),
    surname: Type.Optional(Type.String({description: "User's surname", deprecated: true})),
}, {additionalProperties: false});

// Get a TypeScript type from this definition
type Body = Static<typeof bodySchema>
```

### 2. Validate Data with AJV

AJV checks if the data you receive matches your definition:

```typescript
import ajv from "@/avj";

// Create a validator
const bodyValidator = ajv.compile<Body>(bodySchema);

// Check if data is valid
if (!bodyValidator(req.body)) {
    return res.status(400).json({title: "Invalid body"});
}
```

The AJV setup is simple:

```typescript
import addFormats from 'ajv-formats'
import Ajv from "ajv";

const ajv = addFormats(new Ajv({strict: true}), [
    'date-time', 'time', 'date', 'email', 'hostname', 'ipv4', 'ipv6',
    'uri', 'uri-reference', 'uuid', 'uri-template', 'json-pointer',
    'relative-json-pointer', 'regex'
]);

export default ajv;
```

### 3. Generate API Documentation with OpenAPI

The project automatically creates API documentation from your TypeBox definitions:

Example API endpoint definition:

```typescript
export const nameSpec: OpenAPIV3.PathItemObject = {
    post: {
        summary: "Returns the full name for a given first/last name",
        requestBody: {
            content: {"application/json": {schema: bodySchema}},
        },
        responses: {
            "200": {
                description: "Success",
                content: {"application/json": {schema: responseSchema}},
            },
            "400": {
                description: "Invalid request",
                content: {"application/json": {schema: errorSchema}},
            },
            "405": {
                description: "Method not allowed",
            },
        },
    }
};
```

To create the OpenAPI documentation:

```bash
npx tsx openapi/make-spec.ts
```

This runs a script that collects all your API definitions and creates a complete OpenAPI document.

#### How to Add Your API Endpoints to the Documentation

The `openapi/make-spec.ts` file is where you define all your API paths and import your endpoint specifications:

```typescript
import fs from 'fs';
import {dump} from 'js-yaml';
// Import your endpoint specs here
import {nameSpec} from "@/pages/api/name";
// Import any other endpoint specs you create
// import {userSpec} from "@/pages/api/user";
import type {OpenAPIV3} from "openapi-types";

const openApiSpec: OpenAPIV3.Document = {
    // OpenAPI metadata...
    paths: {
        // Define your API paths here
        "/api/name": nameSpec,
        // "/api/user": userSpec,
    },
};

fs.writeFileSync('openapi.yaml', dump(openApiSpec));
```

For each new API endpoint you create:
1. Export the endpoint specification from your API file (like `nameSpec` in the example)
2. Import it in `make-spec.ts`
3. Add it to the `paths` object with the correct URL path

### 4. Ensure Data Matches Your Schema

TypeBox includes a helpful tool to make sure your data follows your schema:

```typescript
import {Value} from "@sinclair/typebox/value";

// Make sure the data follows the schema
const response = Value.Cast(responseSchema, payload);
```

This helps:
- Remove extra properties
- Convert data types when needed
- Make sure your API responses match your documentation

## Example Code

Check out `src/pages/api/name.ts` for a complete example showing:
1. How to define a schema
2. How to validate incoming data
3. How to document your API
4. How to handle requests
5. How to format responses

## Why This Approach Is Helpful

- **Write Once, Use Everywhere**: Define your data structure once and use it for types, validation, and documentation
- **Fewer Bugs**: Catch errors early with TypeScript
- **Data Validation**: Make sure the data you receive is valid
- **Good Documentation**: Automatically create API documentation
- **Client Generation**: Use the documentation to create API clients in different programming languages

## Learn More

- [TypeBox Documentation](https://github.com/sinclairzx81/typebox)
- [AJV Documentation](https://ajv.js.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Next.js Documentation](https://nextjs.org/docs)
