import fs from 'fs';
import {dump} from 'js-yaml';
import {nameSpec} from "@/pages/api/name";
import type {OpenAPIV3} from "openapi-types";

const openApiSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {title: 'My API', version: '1.0.0'},
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
    security: [{BearerAuth: []}],
    paths: {
        "/api/name": nameSpec
    },
};

fs.writeFileSync('openapi.yaml', dump(openApiSpec));
