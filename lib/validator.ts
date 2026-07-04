import {email, z} from"zod";

export const loginShcema= z.object({
 name : z.string().min(2,"name must be two line"),
 password : z.string().min(8,"please enter the 8 word os password"),
 email:z.string().email("enter email addrase")

})