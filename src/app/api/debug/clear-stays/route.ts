import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidateTag } from "next/cache";

export async function GET() {
    try {
        await connectToDatabase();
        const collectionName = "stays";
        const modelName = `Content_${collectionName}`;
        
        const Model = mongoose.models[modelName] || mongoose.model(modelName, new mongoose.Schema({ id: String, data: mongoose.Schema.Types.Mixed }, { collection: collectionName }));

        const result = await Model.deleteMany({});
        
        // Explicitly revalidate the cache tags
        revalidateTag(`content:collection:${collectionName}`);
        revalidateTag(`content:list:${collectionName}`);
        
        return NextResponse.json({ 
            message: "Stays collection cleared and cache revalidated", 
            deletedCount: result.deletedCount 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
