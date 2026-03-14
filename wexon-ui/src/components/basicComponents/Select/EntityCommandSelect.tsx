"use client";

import React, { forwardRef, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
    label: string;
    value: string;
    description?: React.ReactNode;
    searchText?: string;
};

type EntityCommandSelectProps =
    React.ComponentPropsWithoutRef<"button"> & {
    value?: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    enableSearch?: boolean;
    showStartIcon?: boolean;
    startIcon?: LucideIcon;
    isLoading: boolean;
};

const EntityCommandSelect = forwardRef<
    HTMLButtonElement,
    EntityCommandSelectProps
>(
    (
        {
            value,
            onChange,
            options = [],
            placeholder = "Select...",
            disabled,
            enableSearch = true,
            showStartIcon = false,
            startIcon,
            isLoading = false,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = useState(false);

        const selectedOption = options.find(
            (o) => o.value === value
        );

        return (
            <>
                <Button
                    ref={ref}
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className="w-full justify-between hover:bg-white cursor-pointer"
                    onClick={(e) => {
                        setOpen(true);
                        props.onClick?.(e);
                    }}
                >
                    <div className="flex items-center gap-2 truncate">
                        {showStartIcon && startIcon && (
                            <span
                                className={cn(
                                    selectedOption ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {React.createElement(startIcon)}
                            </span>
                        )}

                        <span
                            className={cn(
                                "truncate font-normal",
                                selectedOption ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {selectedOption?.label ?? placeholder}
                        </span>
                    </div>

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen} className="w-[50%]">
                    {enableSearch && (
                        <CommandInput placeholder="Search..." />
                    )}

                    <CommandList>
                        {isLoading && (
                            <CommandEmpty>
                                <span className="text-muted-foreground animate-pulse">
                                    Loading Data...
                                </span>
                            </CommandEmpty>
                        )}

                        {!isLoading && (
                            <>
                                <CommandEmpty> No results found. </CommandEmpty>
                                <CommandGroup className="p-2">
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            onChange("");
                                            setOpen(false);
                                        }}
                                        disabled={!value}
                                        className="w-full mb-2"
                                    >
                                        Clear Selection
                                    </Button>

                                    {options.map((option, index) => (
                                        <CommandItem
                                            key={index}
                                            value={`${option.label}-${option.value}`}
                                            keywords={[ option.label, option.searchText ?? "" ]}
                                            onSelect={() => {
                                                onChange(option.value);
                                                setOpen(false);
                                            }}
                                            className="flex justify-between p-2 gap-0"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="font-semibold text-sm">
                                                    {option.label}
                                                </div>
                                                {option.description && (
                                                    <div>{option.description}</div>
                                                )}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </CommandDialog>
            </>
        );
    }
);

EntityCommandSelect.displayName = "EntityCommandSelect";
export default EntityCommandSelect;
