"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, IdCard, History, User, Phone, Mail, ShieldCheck } from "lucide-react";
import { TGETUserProfileByIdResponse } from "@/types/profile.type";
import { updateUserProfileByIdAction } from "@/actions/profile.action";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    phoneNumber: z.string().min(6, "Please enter a valid phone number"),
});

export default function UserProfileModule({ initialData }: { initialData?: TGETUserProfileByIdResponse | null }) {
    const [name, setName] = useState(initialData?.name || "");
    const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size exceeds 2MB limit.");
                return;
            }
            
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = async () => {
        const validation = profileSchema.safeParse({ name, phoneNumber });
        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};
            validation.error.issues.forEach(err => {
                if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phoneNumber", phoneNumber);
        if (imageFile) {
            formData.append("avatar", imageFile);
        }

        const res = await updateUserProfileByIdAction(formData);

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Profile updated successfully!");
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
        >
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Top Section - Profile Picture */}
                <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-emerald-500 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col grow text-center sm:text-left gap-3">
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Your Profile Picture</h2>
                        <div className="flex flex-row items-center justify-center sm:justify-start gap-3">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg" 
                                onChange={handleImageUpload} 
                            />
                            <motion.button 
                                onClick={() => fileInputRef.current?.click()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Upload size={18} />
                                Upload New Photo
                            </motion.button>
                            <motion.button 
                                onClick={handleRemoveImage}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Trash2 size={18} />
                                Remove
                            </motion.button>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                            Preferred format: .jpg or .png. Maximum file size allowed is 2MB. High resolution recommended.
                        </p>
                    </div>
                </div>

                {/* Middle Section - Personal Information */}
                <div className="p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                            <IdCard size={20} className="text-emerald-600" />
                            <h3 className="text-lg font-semibold">Personal Information</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <History size={16} />
                            <span>Last Updated: {initialData?.updatedAt ? initialData.updatedAt : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-zinc-400" />
                                </div>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: "" }) }}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/50'} rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all font-medium`}
                                />
                            </div>
                            {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone size={18} className="text-zinc-400" />
                                </div>
                                <input 
                                    type="text" 
                                    value={phoneNumber}
                                    onChange={(e) => { setPhoneNumber(e.target.value); if(errors.phoneNumber) setErrors({...errors, phoneNumber: "" }) }}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border ${errors.phoneNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/50'} rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all font-medium`}
                                />
                            </div>
                            {errors.phoneNumber && <span className="text-xs text-red-500 font-medium">{errors.phoneNumber}</span>}
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-emerald-600 dark:text-emerald-500" />
                                </div>
                                <input 
                                    type="email" 
                                    readOnly
                                    value={initialData?.email || ""}
                                    className="w-full pl-10 pr-24 py-2.5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium italic focus:outline-none"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-[10px] font-bold tracking-wider text-emerald-700/60 dark:text-emerald-400/60 uppercase bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded">Read Only</span>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mt-1">
                                Contact support to change your registered academic email address.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Actions */}
                <div className="p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-sm font-medium">
                        <ShieldCheck size={18} />
                        Your data is secured and encrypted.
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none px-6 py-2.5 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button 
                            onClick={handleSave}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-medium rounded-lg shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
