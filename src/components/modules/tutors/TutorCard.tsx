import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { RiStarFill, RiEyeLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function TutorCard({ tutor }: { tutor: any }) {

  return (
    <Card className="group overflow-hidden border-none shadow-sm ring-1 ring-border hover:ring-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-4/3 overflow-hidden shrink-0">
        <Image
          src={tutor.user.image || "/images/No-image.jpg"}
          alt={tutor.user.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {tutor.badge && (
          <Badge className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white border-none text-[10px] font-bold px-2 py-0.5">
            {tutor.badge}
          </Badge>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
          <RiStarFill className="size-3 text-amber-500" />
          <span className="text-[11px] font-bold dark:text-black">{tutor.rating}</span>
          <span className="text-[10px] text-secondary-foreground dark:text-muted">({tutor.totalReviews === 1000 ? "1k+" : tutor.totalReviews})</span>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start shrink-0">
          <div className="space-y-0.5">
            <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">{tutor.user.name}</h4>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-tight line-clamp-1">{tutor.title}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-bold">Tk {tutor.hourlyRate} </span>
            <span className="text-[10px] text-muted-foreground">/hr</span>
          </div>
        </div>
        
        <div className="min-h-10">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tutor.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Array.isArray(tutor?.tutorCategories) && tutor?.tutorCategories?.map((categories: any) => (
            <span key={categories.id} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
              {categories?.category?.name}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 text-xs font-bold transition-all shadow-md shadow-emerald-600/10">
            Book Session
          </Button>
          <Button asChild variant="outline" size="icon" className="size-9 rounded-lg border-muted-foreground/20 hover:border-primary hover:text-primary">
            <Link href={`/tutors/${tutor.id}`}>
              <RiEyeLine className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default TutorCard
