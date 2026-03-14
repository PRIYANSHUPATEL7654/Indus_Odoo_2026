"use client";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/components/ui/combobox";
import {InputGroupAddon} from "@/components/ui/input-group";
import React from "react";
import {Item, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item";
import {cn} from "@/lib/utils";


export type Option = {
    label: string;
    value: string | null
    disabled?: boolean;
    description?: string;
}

type AutoCompleteProps = {
    value?: string;
    onChange: (value?: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    showStartIcon?: boolean;
    startIcon?: React.ElementType;
    enabledSearch?: boolean;
    showDescription?: boolean;
};

const AutoComplete = (
    {
        value,
        onChange,
        options,
        placeholder,
        disabled,
        showStartIcon,
        startIcon,
        enabledSearch = true,
        showDescription = false,
    }: AutoCompleteProps
) => {

    const selectedOption = options.find((o) => o.value === value) ?? null


    return (
        <Combobox
            value={selectedOption}
            disabled={disabled}
            items={options}
            itemToStringValue={(option: Option) => option.label}
            autoHighlight={true}
            onValueChange={(option) => {onChange(option?.value ?? undefined);}}
        >

            <ComboboxInput
                placeholder={placeholder}
                disabled={disabled}
                readOnly={!enabledSearch}
                showClear={true}
            >
                {
                    showStartIcon && startIcon &&
                        <InputGroupAddon>
                            {React.createElement(startIcon)}
                        </InputGroupAddon>
                }
            </ComboboxInput>

            <ComboboxContent
                sideOffset={7}
                {...(showStartIcon && {
                    alignOffset: -28,

                })}
                className={cn(
                    "w-full",
                    showStartIcon && "w-[calc(100%+28px)]"
                )}
            >

                <ComboboxEmpty>
                    No Result Found
                </ComboboxEmpty>

                <ComboboxList>
                    {
                        (item) => (
                            <ComboboxItem
                                key={item.value}
                                value={item}
                                disabled={item?.disabled}
                            >
                                {
                                    showDescription ? (
                                        <Item size="sm" className="p-0">
                                            <ItemContent>
                                                <ItemTitle className="whitespace-nowrap">
                                                    {item.label}
                                                </ItemTitle>
                                                <ItemDescription>
                                                    {item?.description}
                                                </ItemDescription>
                                            </ItemContent>
                                        </Item>
                                    ) : (
                                        <div>
                                            {item.label}
                                        </div>
                                    )
                                }
                            </ComboboxItem>
                        )
                    }
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default AutoComplete;