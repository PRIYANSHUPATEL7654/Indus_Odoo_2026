import * as React from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff, KeyRound } from "lucide-react";

type PasswordInputProps =
    React.ComponentPropsWithoutRef<typeof InputGroupInput> & {
    showStartIcon?: boolean;
    showPasswordShowAndHideButton?: boolean;
};

const PasswordInput =
    React.forwardRef<React.ComponentRef<typeof InputGroupInput>, PasswordInputProps>((
        {
            showStartIcon = false,
            showPasswordShowAndHideButton = true,
            ...props
        },
        ref
    ) => {

        const [visible, setVisible] = React.useState(false);

        return (
            <InputGroup>

                {
                    showStartIcon && (
                        <InputGroupAddon align="inline-start">
                            <KeyRound />
                        </InputGroupAddon>
                    )
                }

                <InputGroupInput
                    ref={ref}
                    type={ visible ? "text" : "password"}
                    {...props}
                />

                {
                    showPasswordShowAndHideButton && (
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                type="button"
                                aria-label={visible ? "Hide password" : "Show password"}
                                onClick={() => setVisible((v) => !v)}
                            >
                                {visible ? <EyeOff /> : <Eye />}
                            </InputGroupButton>
                        </InputGroupAddon>
                    )
                }

            </InputGroup>
        );
    }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
