import React from "react";
import {InputGroup, InputGroupAddon, InputGroupTextarea} from "@/components/ui/input-group";
import { LucideIcon } from "lucide-react";

type TextAreaInputProps =
    React.ComponentProps<typeof InputGroupTextarea> & {
    showStartIcon?: boolean;
    startText?: string;
    startIcon?: LucideIcon;
};


const TextAreaInput =
    React.forwardRef<React.ComponentRef<typeof InputGroupTextarea>, TextAreaInputProps>((
            {
                showStartIcon = false,
                startIcon,
                startText,
                ...props
            },
            ref
        ) => {


            return (
                <InputGroup>
                    {
                        showStartIcon && startIcon && (
                            <InputGroupAddon align="block-start">
                                {React.createElement(startIcon)}
                            </InputGroupAddon>
                        )
                    }

                    {
                        startText && (
                            <InputGroupAddon align="block-start">
                                {startText}
                            </InputGroupAddon>
                        )
                    }

                    <InputGroupTextarea
                        {...props}
                    />

                </InputGroup>
            );

        }
    );

TextAreaInput.displayName = "TextInput";
export default TextAreaInput;