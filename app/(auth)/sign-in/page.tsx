import {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {auth} from '@/auth';
import { Card,CardContent,CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import CredentialsSignInForm from './credentials-signin-form';
export const metadata: Metadata = {
  title: `Sign In`,
};

const SignIn=async (props:{
    searchParams:Promise<{callbackUrl?:string}>;
})=>{
    const {callbackUrl}=await props.searchParams;
    const session=await auth();
    if(session){
        redirect(callbackUrl||'/');
    }
    return (
        <div className='w-full max-w-md mx-auto flex-col'>
            <Card>
    <CardHeader className='space-y-4'>
        <Link href='/' className='flex flex-col items-center gap-6  '>
        <Image
            priority={true}
            src='/images/logo.svg'
            width={100}
            height={100}
            alt={`${APP_NAME} logo`}
        />
            
        <CardTitle className='text-center'>Sign In</CardTitle>
        <CardDescription className='text-center'>Select a method to sign in to your account</CardDescription>
        </Link>
    </CardHeader>
    <CardContent className='space-y-4'><CredentialsSignInForm /></CardContent>
            </Card>
        </div>
    )
}
export default SignIn;