"use client";

import React from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { LucideIcon } from "lucide-react";

type MeasurementInputProps =
    React.ComponentProps<typeof InputGroupInput> & {
    showStartIcon?: boolean;
    startIcon?: LucideIcon;
    unit?: string;
    precision?: number;
};

const MeasurementInput = React.forwardRef<
    React.ComponentRef<typeof InputGroupInput>,
    MeasurementInputProps
>(
    (
        {
            showStartIcon = false,
            startIcon,
            unit,
            precision = 2,
            ...props
        },
        ref
    ) => {
        return (
            <InputGroup>

                {
                    showStartIcon && startIcon && (
                        <InputGroupAddon align="inline-start">
                            {React.createElement(startIcon, {
                                className: "h-4 w-4 text-muted-foreground",
                            })}
                        </InputGroupAddon>
                    )
                }

                <InputGroupInput
                    ref={ref}
                    type="number"
                    inputMode="decimal"
                    step={Math.pow(10, -precision)}
                    className="appearance-none"
                    {...props}
                />

                {
                    unit && (
                        <InputGroupAddon align="inline-end">
                            <span className="text-sm text-muted-foreground">
                                {unit}
                            </span>
                        </InputGroupAddon>
                    )
                }
            </InputGroup>
        );
    }
);

MeasurementInput.displayName = "MeasurementInput";
export default MeasurementInput;
