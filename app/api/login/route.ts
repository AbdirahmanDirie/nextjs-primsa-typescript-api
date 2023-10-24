import prisma from "@/prisma";
import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";
import bcrypt from  'bcrypt';

export const POST = async (req: Request) => {
    try { 
        const {email, password } = await req.json();

        if(!email && !password){
            return NextResponse.json({smg: "all fields are required" }, { status: 400 });
        }

        await connectToDb();

        const existingUser = await prisma.user.findFirst({where : {email}})

        if(!existingUser){
            return NextResponse.json({smg: "User not found" }, { status: 400 });
        }

        const isPassordCorrect = await bcrypt.compare(password, existingUser.password)

        if(!isPassordCorrect){
            return NextResponse.json({smg: "Incorrect password" }, { status: 403 });
        }

        return NextResponse.json({ msg: "Logged In" }, { status: 201 });

    } catch (error: any) {

        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    } finally {

        await prisma.$disconnect();
    }
};


