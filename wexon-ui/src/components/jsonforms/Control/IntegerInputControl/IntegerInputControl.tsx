import React from "react";
import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";

import FormFieldWrapper from "@/components/jsonforms/FormFieldWrapper";
import { generateLabelFromPath, generatePlaceholderFromPath } from "@/helpers/jsonformsHelper/defultValueGenerator";
import { resolveErrorMessage } from "@/helpers/jsonformsHelper/resolveErrorMessage";

import CurrencyInput from "@/components/basicComponents/Input/IntegerInput/CurrencyInput";
import MeasurementInput from "@/components/basicComponents/Input/IntegerInput/MeasurementInput";

const NumberInputControl = (
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

    if (!visible) { return; }

    const variant = uischema?.options?.variant ?? "number";
    const precision = uischema?.options?.precision ?? (schema?.type === "integer" ? 0 : 2);

    const commonProps = {
        value: data ?? "",
        disabled: !enabled,
        required,
        placeholder: uischema?.options?.placeholder ?? generatePlaceholderFromPath(path),
        showStartIcon: uischema?.options?.showStartIcon ?? false,
        startIcon: uischema?.options?.startIcon,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(
                path,
                e.target.value === "" ? undefined : Number(e.target.value)
            ),
    };

    const getComponent = () => {

        switch (variant) {

            case "currency":
                return (
                    <CurrencyInput
                        {...commonProps}
                        currencySymbol={uischema?.options?.currencySymbol ?? "₹"}
                        precision={precision}
                    />
                );

            case "measurement":
                return (
                    <MeasurementInput
                        {...commonProps}
                        unit={uischema?.options?.unit}
                        precision={precision}
                    />
                );

            case "number":
            default:
                return (
                    <MeasurementInput
                        {...commonProps}
                        precision={precision}
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

export default withJsonFormsControlProps(NumberInputControl);
