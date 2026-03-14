"use client";

import React, { useMemo } from "react";
import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";

import FormFieldWrapper from "@/components/jsonforms/FormFieldWrapper";
import { generateLabelFromPath, generatePlaceholderFromPath } from "@/helpers/jsonformsHelper/defultValueGenerator";
import { resolveErrorMessage } from "@/helpers/jsonformsHelper/resolveErrorMessage";
import dynamic from "next/dynamic";

const AutoComplete = dynamic(() => import("@/components/basicComponents/Input/EnumInput/AutoComplete"),
    { ssr: false, loading: () => null }
);

const RadioGroupEnum = dynamic(() => import("@/components/basicComponents/Input/EnumInput/RadioGroupEnum"),
    { ssr: false, loading: () => null }
);

type EnumOption = {
    label: string;
    value: string | null;
    disabled?: boolean;
    description?: string;
};

const EnumControl = (
    {
        schema,
        uischema,
        data,
        handleChange,
        path,
        label,
        required,
        errors,
        visible,
        enabled,
    }: ControlProps
) => {

    if (!visible) return null;

    const variant = uischema?.options?.variant ?? "autoComplete";

    const options: EnumOption[] = useMemo(() => {
        const schemaEnum = (schema as JsonSchema7)?.enum;
        const uiEnumOptions: EnumOption[] = uischema?.options?.enumOptions ?? [];
        if (uiEnumOptions.length > 0) {
            return uiEnumOptions;
        }
        if (Array.isArray(schemaEnum)) {
            return schemaEnum.map((value) => ({
                label: String(value),
                value: String(value),
            }));
        }
        return [];
    }, [schema, uischema]);


    const commonProps = {
        value: data,
        onChange: (value?: string) => handleChange(path, value),
        options,
        disabled: !enabled,
    };

    const getComponent = () => {
        switch (variant) {
            case "radioGroup":
                return (
                    <RadioGroupEnum
                        {...commonProps}
                        direction={uischema?.options?.direction ?? "horizontal"}
                        showDescription={uischema?.options?.showDescription ?? false}
                    />
                );
            case "autoComplete":
            default:
                return (
                    <AutoComplete
                        {...commonProps}
                        placeholder= {uischema?.options?.placeholder ?? generatePlaceholderFromPath(path)}
                        enabledSearch={uischema?.options?.enabledSearch ?? true}
                        showDescription={uischema?.options?.showDescription ?? false}
                        showStartIcon={uischema?.options?.showStartIcon}
                        startIcon={uischema?.options?.startIcon}
                    />
                );
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <FormFieldWrapper
                label={label ?? generateLabelFromPath(path)}
                required={required}
                errorMessage={resolveErrorMessage(errors, schema as JsonSchema7)}
                showLabel={uischema?.options?.showLabel ?? true}
            >

                {getComponent()}

            </FormFieldWrapper>
        </div>
    );
};

export default withJsonFormsControlProps(EnumControl);
