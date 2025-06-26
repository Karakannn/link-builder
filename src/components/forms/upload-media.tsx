import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FileUpload from "../global/file-upload";
import { createMedia } from "@/actions/media";
import { MediaType } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/providers/modal-provider";

type Props = {
    userId: string;
    siteId?: string;
};

const UploadMediaForm = ({ userId, siteId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setClose } = useModal();

    const formSchema = z.object({
        link: z.string().min(1, {
            message: "Medya dosyası gerekli",
        }),
        name: z.string().min(1, {
            message: "İsim gerekli",
        }),
        type: z.enum(["IMAGE", "VIDEO"]),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            link: "",
            name: "",
            type: "IMAGE" as const,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createMedia(userId, {
                ...values,
                siteId: siteId,
            });
      
            toast("Başarılı", { description: "Medya yüklendi" });
            form.reset();
            
            // Invalidate and refetch user media query
            await queryClient.invalidateQueries({
                queryKey: ['user-media', userId]
            });
            
            // Close the modal
            setClose();
            
            router.refresh();
        } catch (err) {
            console.log(err);
            toast("Başarısız", {
                description: "Medya yüklenemedi",
            });
        }
    };

    return (
        <Card className="w-full">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dosya Adı</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dosya adını girin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medya Türü</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Medya türünü seçin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="IMAGE">Resim</SelectItem>
                                            <SelectItem value="VIDEO">Video</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medya Dosyası</FormLabel>
                                    <FormControl>
                                        <FileUpload 
                                            apiEndpoint="media" 
                                            value={field.value} 
                                            onChange={field.onChange} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Medya Yükle
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default UploadMediaForm;