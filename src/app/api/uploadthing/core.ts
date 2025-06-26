import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticateUser = () => {
    const user = auth();
    // If you throw, the user will not be able to upload
    if (!user) throw new Error("Unauthorized");
    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return user;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
    avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
    agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
    // Updated media endpoint for images and videos
    media: f({ 
        image: { maxFileSize: "8MB", maxFileCount: 1 },
        video: { maxFileSize: "32MB", maxFileCount: 1 }
    })
        .middleware(authenticateUser)
        .onUploadComplete((opts) => {
            console.log("Media upload complete for userId:", opts.metadata.userId);
            console.log("file url", opts.file.url);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;