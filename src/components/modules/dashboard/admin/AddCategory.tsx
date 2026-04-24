"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import * as zod from "zod"
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useForm } from "@tanstack/react-form"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {Pagination,PaginationContent,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious} from "@/components/ui/pagination"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { Modal } from "@/components/layout/Modal"
import {Field,FieldError,FieldGroup,FieldLabel} from "@/components/ui/field"
import {getAllCategory,createCategoryAction,updateCategoryAction,deleteCategory} from "@/actions/categories.action"
import { Category } from "@/types/categories.type"
import { toast } from "sonner"

// Zod Schema
const categorySchema = zod.object({
  name: zod.string().min(1, "Category name is required"),
  image: zod.any().nullable(),
})

interface CategoryFormValues {
  name: string
  image: File | null
}

export default function AddCategory() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null)
  
  const [categories, setCategories] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Form handling with TanStack Form
  const form = useForm({
    defaultValues: {
      name: "",
      image: null,
    } as CategoryFormValues,
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        const formData = new FormData()
        formData.append("name", value.name)
        if (value.image) {
          formData.append("image", value.image)
        }

        let response;
        if (selectedCategory) {
          response = await updateCategoryAction(selectedCategory.id, formData)
        } else {
          if (!value.image && !selectedCategory) {
            toast.error("Category image is required")
            setIsLoading(false)
            return
          }
          response = await createCategoryAction(formData)
        }

        if (response.error) {
          toast.error(response.error)
        } else {
          toast.success(`Category ${selectedCategory ? "updated" : "created"} successfully`)
          setIsModalOpen(false)
          resetForm()
          fetchCategories()
        }
      } catch (error) {
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    },
  })
  
  // Current searchTerm from URL
  const searchTerm = searchParams.get("searchTerm") || ""
  
  // Local state for the input field
  const [searchValue, setSearchValue] = useState(searchTerm)
  
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  // Update URL search parameters
  const updateSearchParam = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("searchTerm", value)
    } else {
      params.delete("searchTerm")
    }
    // Reset to page 1 on search
    setPage(1)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue !== searchTerm) {
        updateSearchParam(searchValue)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue])

  // Handle Enter Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateSearchParam(searchValue)
    }
  }

  //fetch all category
  const fetchCategories = async () => {
    setIsLoading(true)
    const response = await getAllCategory(page, limit, searchTerm);
    if (response.data) {
      setCategories(response.data);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit, searchTerm, pathname, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (categories?.pagination?.totalPages || 1)) {
      setPage(newPage)
    }
  }

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit))
    setPage(1) // Reset to first page when limit changes
  }

  const resetForm = () => {
    setSelectedCategory(null)
    form.reset()
  }

  const handleEditClick = (category: any) => {
    setSelectedCategory(category)
    form.setFieldValue("name", category.name)
    setIsModalOpen(true)
  }

  const handleDelete = (category: any) => {
    setCategoryToDelete(category)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    setIsLoading(true)
    const res = await deleteCategory(categoryToDelete.id);
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Category deleted successfully")
      setIsDeleteModalOpen(false)
      setCategoryToDelete(null)
      fetchCategories()
    }
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    form.handleSubmit()
  }

  return (
    <div className="p-4 md:p-6 max-w-full">
      <Card className="shadow-xs border border-border/60">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 px-4 md:px-6 pt-6 text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Platform Categories</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage course subject categories</p>
          </div>
          <div className="flex flex-col w-full sm:flex-row justify-center items-center gap-4 md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full sm:w-64 pl-9 rounded-md border-border/60 focus-visible:ring-primary/20 bg-background"
              />
            </div>
            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-md px-4 font-medium transition-all shadow-sm"
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 border-t border-border/60">
        {/* table content start */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead className="w-[80px] text-xs font-semibold text-muted-foreground uppercase tracking-wider h-12 pl-6">SL</TableHead>
                <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wider h-12">Image</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-12">Category Name</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider h-12 w-[150px] pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-muted-foreground font-medium">Loading categories...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories?.data?.map((category, index) => (
                  <TableRow key={category.id} className="border-border/60 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium text-muted-foreground py-5 pl-6 align-middle">
                      {((page - 1) * limit) + index + 1}
                    </TableCell>
                    <TableCell className="py-2 align-middle">
                      {category.image ? (
                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted">
                          <img src={category.image} alt={category.name} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 relative rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          N/A
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground py-5 align-middle">{category.name}</TableCell>
                    <TableCell className="text-right pr-6 py-5 align-middle">
                      <div className="flex items-center justify-end space-x-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 transition-colors rounded-full"
                          onClick={() => handleEditClick(category)}
                        >
                          <Pencil className="h-[18px] w-[18px]" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="h-[18px] w-[18px]" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* table content end */}
        </CardContent>
        
        <CardFooter className="flex flex-col lg:flex-row items-center justify-between border-t border-border/60 py-4 px-4 sm:px-6 text-sm text-muted-foreground gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto sm:justify-between lg:justify-start">
            <div className="text-center sm:text-left">
              Showing {categories?.data?.length || 0} of {categories?.pagination?.total || 0} categories
            </div>
            <div className="flex items-center space-x-2">
              <span className="whitespace-nowrap text-xs font-medium">Rows per page:</span>
              <Select defaultValue={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="h-8 w-[65px] border-border/60 bg-transparent text-xs">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Pagination className="mx-0 w-full lg:w-auto">
            <PaginationContent className="flex justify-center flex-wrap gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                  className={`h-8 px-2 sm:px-4 border border-border/60 hover:bg-muted/20 ${page === 1 ? "pointer-events-none opacity-50" : ""}`} 
                />
              </PaginationItem>
              
              {Array.from({ length: categories?.pagination?.totalPages || 1 }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p} className="hidden lg:inline-block">
                  <PaginationLink 
                    href="#" 
                    isActive={page === p} 
                    onClick={(e) => { e.preventDefault(); handlePageChange(p); }}
                    className="h-8 w-8 border border-border/60 hover:bg-muted/20"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                  className={`h-8 px-2 sm:px-4 border border-border/60 hover:bg-muted/20 ${page === (categories?.pagination?.totalPages || 1) ? "pointer-events-none opacity-50" : ""}`} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>

      </Card>

      {/* add or edit category modal start */}
      <Modal 
        open={isModalOpen} 
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) resetForm()
        }} 
        title={selectedCategory ? "Edit Category" : "Add New Category"} 
        description={selectedCategory ? "Update the name or image of this category." : "Enter the name of the new subject category."} 
        submitText={
          isLoading && isModalOpen
            ? (selectedCategory ? "Updating..." : "Creating...") 
            : (selectedCategory ? "Update Category" : "Add Category")
        } 
        onSubmit={handleSubmit}
        isLoading={isLoading && isModalOpen}
      >  
        <form 
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-5">
            <form.Field name="name" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full border-border/60 py-5"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }} />

            <form.Field name="image" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {selectedCategory ? "Update Image (Optional)" : "Category Image"}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="file"
                    accept="image/*"
                    className="w-full border-border/60 h-[40px] p-0 pr-3 file:h-[40px] file:mr-4 file:px-6 file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-muted-foreground leading-[40px] overflow-hidden"
                    onChange={(e) => field.handleChange(e.target.files?.[0] || null)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }} />
          </FieldGroup>
        </form>
      </Modal>
      {/* add or edit category modal end */}

      {/* delete modal start*/}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Category"
        description={`Are you sure you want to delete the "${categoryToDelete?.name}" category? This action cannot be undone.`}
        submitText="Delete"
        onSubmit={confirmDelete}
        isLoading={isLoading && !!categoryToDelete}
      />
      {/* delete modal end*/}
    </div>
  )
}