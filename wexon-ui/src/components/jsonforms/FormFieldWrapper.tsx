import React from "react";


interface FormFieldWrapperProps {
    label?: string;
    required?: boolean;
    errorMessage?: string;
    showLabel?: boolean;
    children: React.ReactNode;
}

const FormFieldWrapper = (
    {
        label,
        required,
        errorMessage,
        showLabel = true,
        children,
    } : FormFieldWrapperProps
) => {
    return (
        <div className="flex flex-col gap-1">

            {
                showLabel && label && (
                    <label className="flex text-sm font-medium gap-1">
                        { label }
                        { required && <span className="text-destructive">*</span> }
                    </label>
                )
            }

            { children }

            {
                errorMessage && (
                    <div className="text-xs font-medium text-destructive">
                        { errorMessage }
                    </div>
                )
            }
        </div>
    )
}

export default FormFieldWrapper;