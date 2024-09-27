"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/Schemas/SignUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import dbConnect from "@/lib/dbConnect"

export default function page() {
  // await dbConnect();
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingusername, setIsCheckingusername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300)
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkusernameunique = async () => {
      console.log("eroor")
      // await dbConnect();
      if (username) {
        setIsCheckingusername(true);
        setUsernameMessage('')

        try {
          const response = await axios.get(`/api/usernameUniqueCheck?username=${username}`)
          // const response = await axios.get("/app/api/usernameUniqueCheck")
          setUsernameMessage(response.data.message);
          console.log(response.data.message)
          console.log("fdfdf")

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }
        finally {
          setIsCheckingusername(false)
        }
      }
    }
    checkusernameunique()
  }, [username])
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data)
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: 'signup failed ',
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false);

    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow-md">
        <div className="text-center"> 
          <h1 className="text-4xl font-extralight tracking-tight lg:text-5xl mb-6"> Sign Up Your acoount </h1>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }} className="bg-black" />

                  </FormControl>
                  {isCheckingusername && < Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-blue-500'}`}> test{usernameMessage} </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
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
            <Button className="bg-orange-500 my-6 mx-12" type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (<>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p> Aready a memeber? {''}</p>
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800"> Sign-in</Link>
        </div>
      </div>
    </div>
  )
}
