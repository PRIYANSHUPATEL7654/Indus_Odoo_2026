import React from "react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import { LucideIcon } from "lucide-react";

type TextInputProps =
    React.ComponentProps<typeof InputGroupInput> & {
    showStartIcon?: boolean;
    startIcon?: LucideIcon;
};


const TextInput =
    React.forwardRef<React.ComponentRef<typeof InputGroupInput>, TextInputProps>((
            {
                showStartIcon = false,
                startIcon,
                ...props
            },
            ref
        ) => {


        return (
            <InputGroup>
                {
                    showStartIcon && startIcon && (
                        <InputGroupAddon align="inline-start">
                            {React.createElement(startIcon)}
                        </InputGroupAddon>
                    )
                }

                <InputGroupInput
                    ref={ref}
                    type="text"
                    {...props}
                />

            </InputGroup>
        );

        }
    );

TextInput.displayName = "TextInput";
export default TextInput;