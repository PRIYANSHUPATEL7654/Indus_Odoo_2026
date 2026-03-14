import React from "react";
import { JsonFormsDispatch, useJsonForms } from "@jsonforms/react";
import {
    isVisible,
    OwnPropsOfJsonFormsRenderer,
    UISchemaElement,
} from "@jsonforms/core";

interface FormDispatchProps extends OwnPropsOfJsonFormsRenderer {
    visible?: boolean;
    className?: string;
    width?: string | number;
}

const FormDispatch: React.FC<FormDispatchProps> = (props) => {
    const {
        uischema,
        path,
        visible = true,
        width = "100%",
        className,
    } = props;

    const ctx = useJsonForms();

    if (!uischema || !ctx?.core) {
        return null;
    }

    const resolvedPath = path ?? "";

    const isElementVisible =
        visible &&
        isVisible(
            uischema as UISchemaElement,
            ctx.core.data,
            resolvedPath,
            // @ts-ignore (ajv typing mismatch in jsonforms)
            ctx.core.ajv,
            undefined
        );

    if (!isElementVisible) {
        return null;
    }

    return (
        <div
            className={className}
            style={{ width: width }}
        >
            <JsonFormsDispatch {...props} />
        </div>
    );
};

export default FormDispatch;
