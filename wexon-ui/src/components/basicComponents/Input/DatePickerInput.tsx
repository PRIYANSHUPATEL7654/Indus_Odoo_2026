"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerInputProps = {
    value?: Date;
    onChange?: (date?: Date) => void;
    placeholder?: string;
    disabled?: boolean;
    dateFormat?: string;
    fromYear?: number;
    toYear?: number;
    className?: string;
};

const DatePickerInput = React.forwardRef<
    HTMLButtonElement,
    DatePickerInputProps
>(
    (
        {
            value,
            onChange,
            placeholder = "Pick a date",
            disabled = false,
            dateFormat = "dd MMM yyyy",
            fromYear = 1900,
            toYear = new Date().getFullYear() + 10,
            className,
        },
        ref
    ) => {

        const [mounted, setMounted] = React.useState(false);
        React.useEffect(() => {
            setMounted(true);
        }, []);

        if (!mounted) return null;

        const handleDateSelect = (date?: Date) => {
            onChange?.(date);
        };

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground",
                            className
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, dateFormat) : placeholder}
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}
                        captionLayout="dropdown"
                        startMonth={new Date(fromYear, 0)}
                        endMonth={new Date(toYear, 11)}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
        );
    }
);

DatePickerInput.displayName = "DatePickerInput";

export default DatePickerInput;
