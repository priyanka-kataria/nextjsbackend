"use client"

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
 import {User} from 'next-auth'
import { Button } from './ui/button'

export default function Navbar() {

const {data:session}= useSession();
const user: User= session?.user;

  return (
    <div>
       <div>
        <a href="#"> Mystry box</a>
        {
            session?(<>
            <span className='mr-4'> Welocome, {user.username || user.email}</span>
            <Button onClick={()=>{
                signOut()
            }}> LogOut</Button>
            </>):(
                <Link href='/sign-in'>
                    <Button> Login</Button>
                </Link>
            )
        }
       </div>
    </div>
  )
}
