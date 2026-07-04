import {loginShcema} from "@/lib/validator"
import {NextRequest, NextResponse} from"next/server";
import {prisma} from "@/lib/prisma"
import { error } from "console";
import bcrypt from "bcryptjs";

export async function  POST(request: NextRequest){
    try{
        
         const body = await request.json();
        const valid = loginShcema.safeParse(body);

        
        if(!valid.success){
            return NextResponse.json(
                {error: valid.error.issues[0].message},
                {status:400}
            );
        }

        const {email,password} = valid.data; 
        const existingUser  =  await prisma.user.findUnique({
            where:{email},
        });
        if(!existingUser){
                return NextResponse.json(
                    {error : "invalid email or password"},
                    {status : 401}
                )
        }

        const ispasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
          if(!ispasswordCorrect){
                return NextResponse.json(
                    {error : "invalid email or password"},
                    {status : 401}
                )
        }
        return NextResponse.json(
            {
                message:"login done",
                user:{
                    id:existingUser.id,
                    name:existingUser.name,
                    email:existingUser.email
                },
            },
            {status: 200}
        )
     
    }catch(error){
        console.log(error);
        return NextResponse.json(
            {error:"invalid server error"},
            {status: 500}
        );

    }
}