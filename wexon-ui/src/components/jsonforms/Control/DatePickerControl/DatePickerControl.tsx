"use client";

import React from "react";
import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { format, parseISO, isValid } from "date-fns";

import FormFieldWrapper from "@/components/jsonforms/FormFieldWrapper";
import DatePickerInput from "@/components/basicComponents/Input/DatePickerInput";

import {
    generateLabelFromPath,
    generatePlaceholderFromPath,
} from "@/helpers/jsonformsHelper/defultValueGenerator";
import { resolveErrorMessage } from "@/helpers/jsonformsHelper/resolveErrorMessage";

const parseDate = (value?: string): Date | undefined => {
    if (!value) return undefined;
    const date = parseISO(value);
    return isValid(date) ? date : undefined;
};

const DatePickerControl = ({
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
                           }: ControlProps) => {
    if (!visible) return null;

    const selectedDate = parseDate(data as string | undefined);

    const handleDateChange = (date?: Date) => {
        if (!date) {
            handleChange(path, undefined);
            return;
        }

        handleChange(path, format(date, "yyyy-MM-dd"));
    };

    return (
        <div className="flex flex-col gap-1">
            <FormFieldWrapper
                label={label ?? generateLabelFromPath(path)}
                required={required}
                errorMessage={resolveErrorMessage(
                    errors,
                    schema as JsonSchema7
                )}
                showLabel={uischema?.options?.showLabel ?? true}
            >
                <DatePickerInput
                    value={selectedDate}
                    onChange={handleDateChange}
                    disabled={!enabled}
                    dateFormat={
                        uischema?.options?.dateFormat ?? "dd MMM yyyy"
                    }
                    fromYear={uischema?.options?.fromYear}
                    toYear={uischema?.options?.toYear}
                    placeholder={
                        uischema?.options?.placeholder ??
                        generatePlaceholderFromPath(path)
                    }
                />
            </FormFieldWrapper>
        </div>
    );
};

export default withJsonFormsControlProps(DatePickerControl);
