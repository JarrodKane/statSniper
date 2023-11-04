"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from 'lodash';
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface ProfileFormProps {
  callBack: (steamId: string) => void;
  loading: boolean;
}

const formSchema = z.object({
  steamId: z.string().regex(/^[0-9]{17}$/, {
    message: "Steam ID must be 17 digits.",
  })
})

/**
 * `ProfileForm` is a component that renders a form for updating a user's profile.
 * This form includes a single field for the steamId, which must be at least 17 digits long.
 * 
 * The form uses `react-hook-form` for form handling and `zod` for form validation.
 * 
 * When the form is submitted, it creates the user and looks up the games for them
 * 
 * This component uses the Form, FormControl, FormDescription, FormField, FormItem, and FormLabel components
 * from the shadcn UI library (https://ui.shadcn.com/docs/components/form) for form layout and styling.
 * 
 * @example
 * ```tsx
 * <ProfileForm />
 * ```
 * 
 * @see {@link https://ui.shadcn.com/docs/components/form} for more information on the used form components.
 */
export function ProfileForm({ callBack, loading }: ProfileFormProps) {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      steamId: "",
    },
  })

  const debouncedOnSubmit = debounce(onSubmit, 300);

  function onSubmit(values: z.infer<typeof formSchema>) {
    callBack(values.steamId)
  }

  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(debouncedOnSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="steamId"
          render={({ field }) => (
            <FormItem >
              <FormLabel>SteamId</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="12345678901234567" {...field} />
              </FormControl>
              <FormDescription>
                Your steam ID is 17 digits
              </FormDescription>
              <FormMessage />
            </FormItem>

          )}
        />
        <Button disabled={loading} type="submit">Submit</Button>
      </form>
    </Form>
  )
}
