import {ControlProps, JsonSchema7} from "@jsonforms/core";
import {generateLabelFromPath} from "@/helpers/jsonformsHelper/defultValueGenerator";
import {resolveErrorMessage} from "@/helpers/jsonformsHelper/resolveErrorMessage";
import FormFieldWrapper from "@/components/jsonforms/FormFieldWrapper";
import React from "react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {cn} from "@/lib/utils";
import {withJsonFormsControlProps} from "@jsonforms/react";


const BooleanControl = (
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
        enabled
    }: ControlProps,
) => {

    if (!visible) { return; }

    const variant = uischema?.options?.variant ?? "switch";
    const errorMessage = resolveErrorMessage(errors, schema as JsonSchema7);
    const defaultValue = typeof schema?.default === "boolean" ? schema.default : false;

    const direction = uischema?.options?.direction ?? "horizontal";
    const trueLabel = uischema?.options?.radio?.trueLabel ?? "Yes";
    const falseLabel = uischema?.options?.radio?.falseLabel ?? "No";

    const getComponent = () => {

        switch (variant) {

            case "switch":
                return (
                    <Switch
                        checked={Boolean(data) ?? defaultValue}
                        disabled={!enabled}
                        aria-invalid={!!errorMessage}
                        onCheckedChange={(checked) => handleChange(path, checked)}
                    />
                );

            case "radioGroup":
                return (
                    <RadioGroup
                        value={
                            (data ?? defaultValue) === true
                                ? "true"
                                : "false"
                        }
                        onValueChange={(val) =>
                            handleChange(path, val === "true")
                        }
                        disabled={!enabled}
                        className={cn(
                            "gap-3",
                            direction === "vertical" ? "flex flex-col" : "flex flex-row flex-wrap",
                        )}
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <RadioGroupItem
                                value="true"
                                id={`${path}-true`}
                                disabled={!enabled}
                            />
                            <Label
                                className="text-sm font-medium select-none"
                                htmlFor={`${path}-true`}>
                                {trueLabel}
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value="false"
                                id={`${path}-false`}
                                disabled={!enabled}
                            />
                            <Label
                                className="text-sm font-medium select-none"
                                htmlFor={`${path}-false`}>
                                {falseLabel}
                            </Label>
                        </div>
                    </RadioGroup>
                );

            default:
                return (
                    <div className="flex gap-1">
                        <Switch
                            checked={Boolean(data)}
                            disabled={!enabled}
                            aria-invalid={!!errorMessage}
                            onCheckedChange={(checked) => handleChange(path, checked)}
                        />
                        <Label
                            className="text-sm font-medium cursor-pointer select-none"
                            onClick={() => enabled && handleChange(path, !data)}
                        >
                            {label ?? generateLabelFromPath(path)}
                        </Label>
                    </div>
                );
        }
    };


    return (
        <div className="flex flex-col">
            <FormFieldWrapper
                label={label ?? generateLabelFromPath(path)}
                required={required}
                errorMessage={errorMessage}
                showLabel={uischema?.options?.showLabel ?? true}
            >

                {getComponent()}

            </FormFieldWrapper>
        </div>
    )
}

export default withJsonFormsControlProps(BooleanControl);