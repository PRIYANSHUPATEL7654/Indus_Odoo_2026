"use client";

import {PublicGuard} from "@/components/guards/PublicGuard";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Form from "@/components/jsonforms/Form";
import loginSchema from "@/assets/schema/Login/schema.json";
import loginUISchema from "@/assets/schema/Login/uischema.json";
import {useMutation} from "@tanstack/react-query";
import {login} from "@/api/login";
import {toast} from "sonner";
import {useUserStore} from "@/store/userStore";
import {setTokenCookie} from "@/helpers/tokenCookie";
import {useRouter} from "next/navigation";
import WexonWordmark from "@/components/branding/WexonWordmark";


const LoginPage = () => {

    const router = useRouter();

    const { mutate: onSubmit, isPending: isLoginLoading } = useMutation({
        mutationFn: async (data) => {
            const response = await login(data);
            return response?.data;
        },
        onSuccess: (data) => {
            console.log("Login success, redirecting...", data);
            toast.success("Login Successfully");
            useUserStore.getState().setUser(data);
            setTokenCookie(data?.token)
            router.push("/dashboard");
        },
        onError: (error) => {
            // @ts-ignore
            toast.error(error?.response?.data?.message);
        },
    })

    return (
        <PublicGuard>
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
                <Card className="max-w-sm w-full py-16">
                    <CardHeader className="w-full text-center">
                        <WexonWordmark size="md" showTagline />
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-1 flex-col gap-6 justify-center items-center">
                            <div className="flex flex-col w-full max-w-sm text-center">
                        <span className="text-2xl font-semibold text-gray-900">
                            Login to your account
                        </span>
                                <span className="text-gray-600">
                            Access your account using registered credentials
                        </span>
                            </div>

                            <div className="form w-full">
                                <Form
                                    schema={loginSchema}
                                    uiSchema={loginUISchema}
                                    submitBtnText="Login"
                                    isLoading={isLoginLoading}
                                    onSubmit={({ status, data }) => {
                                        if (!status) return;
                                        onSubmit(data);
                                    }}
                                    btnWidth="100%"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicGuard>
    )
}

export default LoginPage;
