import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

const schema = z.object({
  name: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply(), status: 'error' },
      { status: 400 }
    );
  }

  // Do something with the submission

  return json({ result: submission.reply(), status: 'success' });
}

export default function Index() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult: lastResult?.result,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <main className='h-dvh flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Form method='post' {...getFormProps(form)}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right' htmlFor={fields.name.id}>
                  Name
                </Label>
                <Input
                  className='col-span-3'
                  {...getInputProps(fields.name, { type: 'text' })}
                />
              </div>
            </div>
          </Form>
          <DialogFooter>
            <Button form={form.id} type='submit'>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
