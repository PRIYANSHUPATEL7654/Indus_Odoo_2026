import {ControlProps, JsonSchema7} from "@jsonforms/core";
import TextInput from "@/components/basicComponents/Input/StringInput/TextInput";
import EmailInput from "@/components/basicComponents/Input/StringInput/EmailInput";
import PasswordInput from "@/components/basicComponents/Input/StringInput/PasswordInput";
import FormFieldWrapper from "@/components/jsonforms/FormFieldWrapper";
import {generateLabelFromPath, generatePlaceholderFromPath} from "@/helpers/jsonformsHelper/defultValueGenerator";
import {resolveErrorMessage} from "@/helpers/jsonformsHelper/resolveErrorMessage";
import {withJsonFormsControlProps} from "@jsonforms/react";
import React from "react";
import TextAreaInput from "@/components/basicComponents/Input/StringInput/TextAreaInput";
import PhoneInput from "@/components/basicComponents/Input/StringInput/PhoneInput";


const TextInputControl = (
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

    const inputComponentFromFormat = uischema?.options?.variant ?? "text";

    const getComponent = (format: string) => {

        const commonProps = {
            value: data ?? "",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(path, e.target.value),
            disabled: !enabled,
            required,
            placeholder: uischema?.options?.placeholder ?? generatePlaceholderFromPath(path),
            showStartIcon: uischema?.options?.showStartIcon ?? false,
        };

        const textAreaProps = {
            value: data ?? "",
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(path, e.target.value),
            disabled: !enabled,
            required,
            placeholder: uischema?.options?.placeholder ?? generatePlaceholderFromPath(path),
            showStartIcon: uischema?.options?.showStartIcon ?? false,
        }

        switch (format) {

            case "text":
                return (
                    <TextInput
                        startIcon={uischema?.options?.startIcon}
                        {...commonProps}
                    />
                );
            case "email":
                return (
                    <EmailInput
                        {...commonProps}
                    />
                );
            case "password":
                return (
                    <PasswordInput
                        showPasswordShowAndHideButton={uischema?.options?.showPasswordShowAndHideButton}
                        {...commonProps}
                    />
                );
            case "phone":
                return (
                    <PhoneInput
                        startIcon={uischema?.options?.startIcon}
                        countryCode={uischema?.options?.countryCode}
                        {...commonProps}
                    />
                )
            case "textarea":
                return (
                    <TextAreaInput
                        startText={uischema?.options?.startText}
                        startIcon={uischema?.options?.startIcon}
                        {...textAreaProps}
                    />
                );
            default:
                return (
                    <TextInput
                        startIcon={uischema?.options?.startIcon}
                        {...commonProps}
                    />
                );

        }

    }

    return (

        <div className="flex flex-col gap-1">

            <FormFieldWrapper
                label={label ?? generateLabelFromPath(path)}
                required={required}
                errorMessage={resolveErrorMessage(errors, schema as JsonSchema7)}
                showLabel={uischema?.options?.showLabel ?? true}
            >

                {getComponent(inputComponentFromFormat)}

            </FormFieldWrapper>

        </div>

    );
}

export default withJsonFormsControlProps(TextInputControl);