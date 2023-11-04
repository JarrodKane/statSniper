// "use client"

import { BASE_URL } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  steamId: z.string().regex(/^[0-9]{17}$/, {
    message: "Steam ID must be 17 digits.",
  })
})

const handleSubmitSteamId = async (steamId: string) => {
  const data = await fetch(`${BASE_URL}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ steamId })
  })

  // TODO: Handle errors, and handle success
}

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
export function ProfileForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      steamId: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmitSteamId(values.steamId)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="steamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SteamId</FormLabel>
              <FormControl>
                <Input placeholder="12345678901234567" {...field} />
              </FormControl>
              <FormDescription>
                <p>Your steam ID is 17 digits</p>
              </FormDescription>
              <FormMessage />
            </FormItem>

          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
