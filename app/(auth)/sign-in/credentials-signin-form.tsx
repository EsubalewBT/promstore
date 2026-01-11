'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInUser } from '@/lib/action/user.action';
import { useSearchParams } from 'next/navigation';
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className='w-full' variant='default' disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In with credentials'}
    </Button>
  );
};

const CredentialsSignInForm = () => {
  const [state, action] = useActionState(signInUser, {
    message: '',
    success: false,
  });
const searchParams = useSearchParams();
const callbackUrl = searchParams.get('callbackUrl') || '/';
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            required
            type='email'
            defaultValue={signInDefaultValues.email}
            autoComplete='email'
          />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            required
            type='password'
            defaultValue={signInDefaultValues.password}
            autoComplete='current-password'
          />
        </div>
        <div>
          <SubmitButton />
        </div>

        {state.message ? (
          <p
            className={`text-sm text-center ${
              state.success ? 'text-green-600' : 'text-destructive'
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <div className='text-sm text-center text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link target='_self' className='link' href='/sign-up'>
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};
export default CredentialsSignInForm;