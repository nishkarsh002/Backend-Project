'use server'

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import slugify from 'slugify'
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
    state: any, 
    form: FormData, 
    pitch: string) => {


    const session = await auth();
    if(!session) 
        return parseServerActionResponse({
           error: "Not singed in",
           status: "ERROR",
    }); // check user is or not

    const {title , description, category, link} = Object.fromEntries(
        Array.from(form).filter(([key]) => key != "pitch")
    ); // get the data from the form

    const slug = slugify(title as string, {lower: true, strict: true}); // create the slug

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: "reference",
                _ref: session?.id,
            },
            pitch,
        }; // collect all the data 


        const result = await writeClient.create({
            _type: "startup", ...startup});

            return parseServerActionResponse({
                ...result,
                error: '',
                status: "SUCCESS"
            }) // create the user
    } 
    catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
}