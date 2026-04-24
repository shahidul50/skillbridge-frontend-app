"use server";

import { categoryService } from "@/services/category.service";
import { revalidatePath } from "next/cache";

export async function getAllCategory(page?: number, limit?: number, searchTerm?: string) {
    const categories = await categoryService.getAllCategory({ page, limit, searchTerm });
    return categories;
}

export async function createCategoryAction(formData: FormData) {
    const res = await categoryService.createCategory(formData);
    if (!res.error) {
        revalidatePath("/admin-dashboard/add-category");
    }
    return res;
}

export async function updateCategoryAction(id: string, formData: FormData) {
    const res = await categoryService.updateCategory(id, formData);
    if (!res.error) {
        revalidatePath("/admin-dashboard/add-category");
    }
    return res;
}

export async function deleteCategory(id: string) {
    const res = await categoryService.deleteCategory(id);
    if (!res.error) {
        revalidatePath("/admin-dashboard/add-category");
    }
    return res;
}