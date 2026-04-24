import { getAllCategory } from "@/actions/categories.action"
import { Container } from "@/components/layout/Container"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ExploreCategorySection() {
    const response = await getAllCategory(1, 4);
    const categories = response?.data || [];
    
    return (
        <section className="py-12 md:py-20 bg-background">
            <Container>
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Explore Categories
                        </h2>
                        <p className="text-muted-foreground text-[17px]">
                            Find the right field of expertise for your goals
                        </p>
                    </div>
                    <Link 
                        href="/categories" 
                        className="text-primary font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all text-[15px]"
                    >
                        View All <ArrowRight className="size-4" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.data?.length > 0 ? (
                        categories.data?.map((category: any) => (
                            <Link 
                                key={category.id}
                                href={`/categories/${category.id}`}
                                className="group relative h-[180px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                            >
                                {/* Background Image */}
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground font-medium">{category.name}</span>
                                    </div>
                                )}
                                
                                {/* Overlay Gradient for better text contrast */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

                                {/* Category Name */}
                                <div className="absolute bottom-7 left-7 right-7">
                                    <h3 className="text-xl font-extrabold text-white tracking-wide transition-transform duration-500 group-hover:-translate-y-1">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Fallback static categories if no data from API to match the image initially
                        [
                            { id: 1, name: "Computer Science", image: "/images/hero-banner.png" }, // Using existing image for demo
                            { id: 2, name: "Mathematics", image: "/images/hero-banner.png" },
                            { id: 3, name: "Business", image: "/images/hero-banner.png" },
                            { id: 4, name: "Languages", image: "/images/hero-banner.png" }
                        ].map((cat) => (
                            <div key={cat.id} className="relative h-[280px] rounded-3xl overflow-hidden bg-muted">
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute bottom-7 left-7">
                                    <h3 className="text-xl font-extrabold text-white">{cat.name}</h3>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </section>
    )
}
