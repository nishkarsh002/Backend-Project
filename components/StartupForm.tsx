'use client'

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {

  const [error , setError] = useState<Record<string,string>>({}); // for errors
  const [pitch , setPitch] = React.useState(""); // MD

  const {toast} = useToast();
  const router = useRouter()

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try{
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      }
      await formSchema.parseAsync(formValues);

      // console.log(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if(result.status === 'SUCCESS'){
        toast({
          title: "Sucess",
          description: "Your pitch has been created",
          // variant: "destructive"
        });

        router.push(`/startup/${result._id}`)
      }

      return result;
      

    } catch (error) {
      if(error instanceof z.ZodError){
        const fieldErrors = error.flatten().fieldErrors;
        setError(fieldErrors as unknown as Record<string,string>);

        toast({
          title: "Error",
          description: "Please check the form fields",
          variant: "destructive"
        });

        return {...prevState, error: "Validation failed", status: "ERROR"};
      }

      toast({
        title: "Error",
        description: "An unecprcted error has occurred",
        variant: "destructive"
      });

      return {
        ...prevState,
        error: "An unecprcted error has occurred",
        status: "ERROR",
      };
    } 
  };

  const [state , formAction , isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />

        {error.title && <p className="startup-form_error">{error.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />

        {error.description && <p className="startup-form_error">{error.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health , Edu...)"
        />

        {error.category && <p className="startup-form_error">{error.category}</p>}
      </div>
      
      <div>
        <label htmlFor="link" className="startup-form_label">Image URL</label>
        <Input id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />

        {error.link && <p className="startup-form_error">{error.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        
        <MDEditor 
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{borderRadius: 20, overflow: "hidden"}}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves"
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {error.pitch && <p className="startup-form_error">{error.pitch}</p>}

        <Button type="submit" className="startup-form_btn" 
        disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Your Pitch"}
          <Send className="size-6 ml-2"/>
        </Button>
      </div>      

    </form>
  )
}

export default StartupForm