"use client";

import React from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { LucideIcon } from "lucide-react";

type CurrencyInputProps =
    React.ComponentProps<typeof InputGroupInput> & {
    showStartIcon?: boolean;
    startIcon?: LucideIcon;
    currencySymbol?: string;
    precision?: number;
};

const CurrencyInput = React.forwardRef<
    React.ComponentRef<typeof InputGroupInput>,
    CurrencyInputProps
>(
    (
        {
            showStartIcon = false,
            startIcon,
            currencySymbol = "₹",
            precision = 2,
            ...props
        },
        ref
    ) => {
        return (
            <InputGroup>
                {showStartIcon && startIcon && (
                    <InputGroupAddon align="inline-start">
                        {React.createElement(startIcon, {
                            className: "h-4 w-4 text-muted-foreground",
                        })}
                    </InputGroupAddon>
                )}

                {currencySymbol && (
                    <InputGroupAddon align="inline-start">
                        <span className="text-sm text-muted-foreground">
                          {currencySymbol}
                        </span>
                    </InputGroupAddon>
                )}

                <InputGroupInput
                    ref={ref}
                    type="number"
                    inputMode="decimal"
                    step={Math.pow(10, -precision)}
                    min={0}
                    className="appearance-none"
                    {...props}
                />
            </InputGroup>
        );
    }
);

CurrencyInput.displayName = "CurrencyInput";
export default CurrencyInput;
