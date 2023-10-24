import prisma from "@/prisma";
import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {

        await connectToDb();
        const tweets = await prisma.tweets.findMany()
        return NextResponse.json({ tweets }, { status: 200 });

    } catch (error: any) {

        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    } finally {

        await prisma.$disconnect();
    }
};


export const POST = async (req: Request) => {
    try {
        const { tweet, userId } = await req.json();

        if (!tweet && !userId) {
            return NextResponse.json({ msg: "all fields are required" }, { status: 400 });
        }
        await connectToDb();

        const user = await prisma.user.findFirst({ where: { id: userId }});

    if (!user) {
        return NextResponse.json({ msg: "user not found" }, { status: 403 });
    }


    const Newtweet = await prisma.tweets.create({data: {tweet, userId}})


    return NextResponse.json({tweet: Newtweet}, { status: 201 });

} catch (error: any) {

    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });

} finally {

    await prisma.$disconnect();
}
};






