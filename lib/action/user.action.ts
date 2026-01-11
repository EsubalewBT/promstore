'use server';

import {signInSchema} from '../validator';
import { isRedirectError, RedirectError } from 'next/dist/client/components/redirect-error';
import { signIn, signOut } from '@/auth';


export async function signInUser(
    prevState: unknown,
    formdata: FormData
){
    try {
        const user=signInSchema.parse({
            email: formdata.get('email'),
            password: formdata.get('password')
        })
        await signIn('credentials', user)
        return {success: true, message: 'Sign in successful'}
    } catch (error) {
        if(isRedirectError(error)){
            throw error;
    }
     return { success: false, message: 'Invalid email or password' };
    }
}
export async function signOutUser(){
    await signOut();
}