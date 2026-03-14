import React from "react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Mail} from "lucide-react";

type EmailInputProps =
    React.ComponentProps<typeof InputGroupInput> & {
    showStartIcon?: boolean;
};


const EmailInput =
    React.forwardRef<React.ComponentRef<typeof InputGroupInput>, EmailInputProps>((
        {
            showStartIcon = false,
            ...props
        },
        ref
    ) => {

        return (
            <InputGroup>

                {
                    showStartIcon && (
                        <InputGroupAddon align="inline-start">
                            <Mail />
                        </InputGroupAddon>
                    )
                }

                <InputGroupInput
                    ref={ref}
                    type="email"
                    {...props}
                />

            </InputGroup>
        );
    }
);

EmailInput.displayName = "EmailInput";
export default EmailInput;