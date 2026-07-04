
import {loginShcema} from "@/lib/validator"
import {NextRequest, NextResponse} from"next/server";
// import {prisma} from "@/lib/prisma"

export async default function  POST(request: NextRequest){
    try{
        
         const body = await request.json();
        const valid = loginShcema.safeParse(body);
        if(!valid.success){
            return NextResponse.json(
                {error: valid.error.issues[0].message},
                {status:400}
            );
        }

        const {name,email,password} = valid.data; 
        const exitsUser =  await prisma.user.findUnique 
    }catch{

    }
}