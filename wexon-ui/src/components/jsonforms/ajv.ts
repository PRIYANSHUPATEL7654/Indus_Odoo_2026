import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";

export const ajv = new Ajv({
    allErrors: true,
    strict: false,
    messages: true
});

addFormats(ajv);

ajvErrors(ajv);
