"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Option } from "@/components/basicComponents/Input/EnumInput/AutoComplete";

type EnumRadioGroupProps = {
    value?: string;
    onChange: (value?: string) => void;
    options: Option[];
    disabled?: boolean;
    direction?: "vertical" | "horizontal";
    showDescription?: boolean;
};

const RadioGroupEnum = ({
                            value,
                            onChange,
                            options,
                            disabled,
                            direction = "horizontal",
                            showDescription = false,
                        }: EnumRadioGroupProps) => {
    return (
        <RadioGroup
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            className={cn(
                "gap-3",
                direction === "horizontal"
                    ? "flex flex-wrap gap-x-6 gap-y-3"
                    : "flex flex-col"
            )}
        >
            {options.map((item) => {
                const isDisabled = disabled || item.disabled;

                return (
                    <div
                        key={item.value ?? item.label}
                        className={cn(
                            "flex items-start py-2 gap-2 h-9",
                            isDisabled && "opacity-60"
                        )}
                    >
                        <RadioGroupItem
                            value={item.value ?? ""}
                            disabled={isDisabled}
                            id={item.value ?? item.label}
                            // className="mt-1"
                        />

                        <Label
                            htmlFor={item.value ?? item.label}
                            className={cn(
                                "cursor-pointer leading-tight flex flex-col items-start",
                                isDisabled && "cursor-not-allowed"
                            )}
                        >
                            <div>{item.label}</div>

                            {showDescription && item.description && (
                                <div className="text-xs text-muted-foreground">
                                    {item.description}
                                </div>
                            )}
                        </Label>
                    </div>
                );
            })}
        </RadioGroup>
    );
};

export default RadioGroupEnum;
