import React, {
    forwardRef,
    useEffect, useImperativeHandle,
    useMemo, useRef,
    useState
} from "react";
import {Loader2, LucideIcon} from "lucide-react";
import clsx from "clsx";
import {JsonSchema, JsonSchema7, UISchemaElement, ValidationMode} from "@jsonforms/core";
import createDefaultFormData from "@/helpers/jsonformsHelper/createDefaultFormData";
import { JsonForms } from "@jsonforms/react";
import { Button } from "@/components/ui/button";
import { formRenderers } from "@/components/jsonforms/Renderers";
import { ajv } from "@/components/jsonforms/ajv";
import { cleanUpData } from "@/helpers/jsonformsHelper/formCleanup";
import normalizeBackendData from "@/helpers/jsonformsHelper/normalizeBackendData";

interface FormProps {
    schema: JsonSchema | JsonSchema7;
    uiSchema: UISchemaElement;
    validationMode?: ValidationMode;

    data?: any;
    readOnly?: boolean;
    onChange?: (data: any) => void;
    onSubmit?: ( result: { status: boolean; data: any;}) => void;
    isLoading?: boolean;

    showSubmitBtn?: boolean;
    submitBtnText?: string;
    startIconForSubmitBtn?: LucideIcon;
    endIconForSubmitBtn?: LucideIcon;
    btnWidth?: string;

    className?: string;
    children?: React.ReactNode;
}

type JsonFormsChange = {
    data: any;
    errors?: any[];
};

const Form = forwardRef<any, FormProps>((props, ref) => {
    const {
        schema,
        uiSchema,
        validationMode = "ValidateAndHide",
        data,
        readOnly = false,
        onChange,
        onSubmit,
        isLoading = false,
        showSubmitBtn = true,
        submitBtnText = "Submit",
        startIconForSubmitBtn,
        endIconForSubmitBtn,
        btnWidth,
        className = "max-w-[900px]",
        children
    } = props;

    const initialData = useMemo(() => {
        if (schema.type === "object") {
            return {
                ...createDefaultFormData(schema),
                ...normalizeBackendData(data, schema)
            };
        }
        return data;
    }, [schema, data]);

    const [formData, setFormData] = useState(initialData);
    const errorRef = useRef<any[]>([]);
    const [validationModeForm, setValidationModeForm] =
        useState(validationMode);

    useEffect(() => {
        setValidationModeForm(validationMode);
    }, [validationMode]);

    const handleChange = ({ data, errors }: JsonFormsChange) => {
        errorRef.current = errors ?? [];
        setFormData(data);
        onChange?.({ data, errors });
    };

    const handleSubmit = () => {
        const errors = errorRef.current ?? [];
        let finalData = structuredClone(formData);
        setFormData(finalData);
        onChange?.({ data: finalData, errors });

        setValidationModeForm("ValidateAndShow");

        if (Array.isArray(errors) && errors.length > 0) {
            console.error("Form Validation Failed");
            errors.forEach(err =>
                console.error(`${err.instancePath} - ${err.message}`)
            );

            onSubmit?.({
                status: false,
                data: errors
            });

            return { status: false, data: errors };
        }

        const cleanedData = cleanUpData(finalData);

        console.log(cleanedData);

        onSubmit?.({
            status: true,
            data: cleanedData
        });

        return { status: true, data: cleanedData };

    };

    useImperativeHandle(ref, () => ({
        onSubmit: handleSubmit,
    }));

    const StartIcon = startIconForSubmitBtn as LucideIcon;
    const EndIcon = endIconForSubmitBtn as LucideIcon;

    return (
        <div className={clsx(className)}>
            <JsonForms
                data={formData}
                schema={schema}
                uischema={uiSchema}
                onChange={handleChange}
                validationMode={validationModeForm}
                readonly={readOnly}
                renderers={formRenderers}
                ajv={ajv}
            />

            {children}

            {showSubmitBtn && !readOnly && (
                <Button
                    type="button"
                    className="flex gap-2 mt-xl"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    style={{width: btnWidth, marginTop: "1.3rem"}}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            {StartIcon && <StartIcon />}
                            <span>{submitBtnText}</span>
                            {EndIcon && <EndIcon />}
                        </>
                    )}
                </Button>
            )}

        </div>
    );
});

export default Form;
