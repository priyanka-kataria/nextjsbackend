"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SignInSchema } from '@/Schemas/signInSchema';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { signIn } from 'next-auth/react';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';


export default function page() {
  const { toast } = useToast();

  const router = useRouter();
  // zod implementation
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {

    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      toast({
        title: "Login failed",
        description: "Incorrect usernsame or password",
        varient: "destructive"
      })
    }
    if(result?.url){
      router.replace('/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extralight tracking-tight lg:text-5xl mb-6"> Verify  Your account </h1>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="bg-black" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input className="bg-black" placeholder="password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="bg-orange-500 my-6" type="submit" >
             SignIn
            </Button>
          </form>
        </Form>

      </div>
    </div >
  )
}
