"use client"
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signUpSchema } from '@/Schemas/SignUpSchema';
import { verifyScema } from '@/Schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import {useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form } from '@/components/ui/form';

export default function page() {
    const router = useRouter();
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof verifyScema>>({
        resolver: zodResolver(verifyScema)
     
    })
    const onSubmit = async (data: z.infer<typeof verifyScema>) => {
        try {
            const response = await axios.get(`/api/verify-Code`, {
                username: params.username,
                code: data.code
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('sign-in');
        } catch (error) {
            console.log("Error in signu of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Signup failed",
                description: axiosError.response?.data.message,
                varient: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className=" w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extralight tracking-tight lg:text-5xl mb-6"> Verify  Your acoount </h1>
                </div>
                <div>

                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="code" {...field} className="bg-black"
                                                 />

                                        </FormControl>
                                        <FormMessage/>

                                    </FormItem>
                                )}
                            />
                            <Button type="submit" > Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
