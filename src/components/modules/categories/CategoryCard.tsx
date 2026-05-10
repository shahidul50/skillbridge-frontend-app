import Image from "next/image";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image?: string;
  };
  index: number;
}

export const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <ScrollMotion delay={index * 0.05}>
      <div className="group relative h-[220px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
        {/* Background Image */}
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-500 font-medium">{category.name}</span>
          </div>
        )}

        {/* Overlay Gradient for better text contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

        {/* Category Name */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-lg font-bold text-white tracking-wide transition-transform duration-500 group-hover:-translate-y-1">
            {category.name}
          </h3>
        </div>
      </div>
    </ScrollMotion>
  );
};
