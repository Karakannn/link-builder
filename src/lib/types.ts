import { z } from "zod";

export type NotificationWithUser =
    | ({
          User: {
              id: string;
              name: string;
              avatarUrl: string;
              email: string;
              createdAt: Date;
              updatedAt: Date;
              role: any;
              agencyId: string | null;
          };
      } & Notification)[]
    | undefined;




export const CreateFunnelFormSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    subDomainName: z.string().optional(),
    favicon: z.string().optional(),
});

export const FunnelPageSchema = z.object({
    name: z.string().min(1),
    pathName: z.string().optional(),
});


export const ContactUserFormSchema = z.object({
    name: z.string().min(1, "Required"),
    email: z.string().email(),
});
