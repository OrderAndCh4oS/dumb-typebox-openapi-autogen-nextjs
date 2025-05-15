import type {NextApiRequest, NextApiResponse} from "next";
import {Static, Type} from "@sinclair/typebox";
import ajv from "@/avj";
import type {OpenAPIV3} from "openapi-types";
import {Value} from "@sinclair/typebox/value";

export const bodySchema = Type.Object({
    firstName: Type.String({description: "User's first name"}),
    lastName: Type.String({description: "User's last name"}),
    surname: Type.Optional(Type.String({description: "User's surname", deprecated: true})),
}, {additionalProperties: false});
type Body = Static<typeof bodySchema>
const bodyValidator = ajv.compile<Body>(bodySchema);

export const responseSchema = Type.Object({
    fullName: Type.String(),
}, {additionalProperties: false});

type Response = Static<typeof responseSchema>
const responseValidator = ajv.compile<Response>(responseSchema);

export const errorSchema = Type.Object({
    title: Type.String(),
}, {additionalProperties: false});
type ErrorResponse = Static<typeof errorSchema>

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
                description: "Invalid request or server validation error",
                content: {"application/json": {schema: errorSchema}},
            },
            "405": {
                description: "Method not allowed",
            },
        },
    }
};


/**
 * @openapi
 * @response
 * @query
 * @param req
 * @param res
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response | ErrorResponse>,
) {
    if (req.method !== "POST")
        return res.status(405).end();

    if (!bodyValidator(req.body))
        return res.status(400).json({title: "Invalid body"});

    const body = req.body;

    const payload = {fullName: `${body.firstName} ${body.lastName}`, badField: 'str'};

    if (responseValidator(payload))
        return res.status(400).json({title: "Invalid response"});

    const response = Value.Cast(responseSchema, payload);

    res.status(200).json(response);
}
