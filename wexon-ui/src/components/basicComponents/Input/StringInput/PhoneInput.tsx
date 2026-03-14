import React from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { LucideIcon, Phone } from "lucide-react";

type PhoneInputProps =
    React.ComponentProps<typeof InputGroupInput> & {
    showStartIcon?: boolean;
    startIcon?: LucideIcon;
    countryCode?: string;
};

const PhoneInput =
    React.forwardRef<
        React.ComponentRef<typeof InputGroupInput>,
        PhoneInputProps
    >(
        (
            {
                showStartIcon = false,
                startIcon = Phone,
                countryCode = "+91",
                ...props
            },
            ref
        ) => {
            return (
                <InputGroup>
                    {
                        (showStartIcon || countryCode) && (
                            <InputGroupAddon align="inline-start" className="gap-2">
                                {
                                    showStartIcon && startIcon &&
                                        React.createElement(startIcon)
                                }
                                {
                                    countryCode && (
                                        <span className="text-sm text-muted-foreground disabled:bg-sidebar">
                                            {countryCode}
                                        </span>
                                    )
                                }
                            </InputGroupAddon>
                        )
                    }
                    <InputGroupInput
                        ref={ref}
                        type="tel"
                        inputMode="numeric"
                        {...props}
                    />

                </InputGroup>
            );
        }
    );

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
