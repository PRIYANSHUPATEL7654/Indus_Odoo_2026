import { JsonSchema7 } from "@jsonforms/core";

export const resolveErrorMessage = (
    errors: string | string[] | undefined,
    schema?: JsonSchema7
): string | undefined => {
    if (!errors) return undefined;

    const errorText = Array.isArray(errors) ? errors[0] : errors;

    if (errorText.toLowerCase().includes("required")) {
        return schema?.title
            ? `Enter ${schema.title}`
            : "This field is required";
    }

    return errorText;
};
