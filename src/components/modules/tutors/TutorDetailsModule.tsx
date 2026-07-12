import React from "react";
import Image from "next/image";
import { Star, CheckCircle, Clock, Users } from "lucide-react";
import BookingCard from "./BookingCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { ITutorDetails } from "@/types";

export default function TutorDetailsModule({ tutor }: { tutor: ITutorDetails }) {
  // Extract variables with fallbacks
  const name = tutor.user?.name;
  const image = tutor.user?.image;
  const title = tutor.title;
  const rating = tutor.rating;
  const totalReviews = tutor.totalReviews;
  const hourlyRate = tutor.hourlyRate;
  const bio = tutor.bio;
  const categories = Array.isArray(tutor.tutorCategories)
    ? tutor.tutorCategories.map((c: any) => c.category?.name || c.name || "")
    : [];

  // Mock stats
  const totalHours = tutor.totalClassHour;
  const totalStudents = tutor.totalUniqueStudents;

  // Mock reviews matching the design
  const mockReviews = [
    {
      id: 1,
      name: "James Smith",
      initials: "JS",
      date: "Oct 12, 2023",
      rating: 5,
      text: "Alex is an incredible mentor. He doesn't just show you how to code; he explains the reasoning behind every design choice. The project-based approach helped me land my first Junior Dev role in just 4 months!"
    },
    {
      id: 2,
      name: "Maria Lopez",
      initials: "ML",
      date: "Sep 28, 2023",
      rating: 5,
      text: "Very thorough explanation of React hooks and state management. I appreciated the TDD focus. Sometimes the pace was a bit fast for a beginner, but Alex was always happy to slow down and recap."
    },
    {
      id: 3,
      name: "David Wong",
      initials: "DW",
      date: "Aug 15, 2023",
      rating: 5,
      text: "Exactly what I needed to level up my Node.js skills. The architecture sessions on microservices were a game changer for my current company project."
    }
  ];

  return (
    <Container className="py-10 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 mb-8 flex items-center gap-1.5 uppercase">
        <a href="/" className="hover:text-emerald-600 transition-colors">Home</a>
        <span>/</span>
        <a href="/tutors" className="hover:text-emerald-600 transition-colors">Tutors</a>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200">{name}</span>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Section - Main Profile Info */}
        <div className="flex-1 w-full space-y-8">
          {/* Header Card */}
          <Card className="border-none shadow-xl shadow-zinc-100 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative size-24 md:size-28 rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shrink-0 shadow-inner">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                    {name}
                  </h1>
                  <CheckCircle className="size-6 text-emerald-500 shrink-0" />
                </div>
                <p className="text-sm md:text-base font-semibold text-zinc-500 dark:text-zinc-400">
                  {title}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.map((cat: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-none shadow-md shadow-zinc-50 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 text-center py-5 rounded-2xl">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white">{rating}</span>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1 w-full">
                  <Star className="size-3.5 text-amber-500 shrink-0" />
                  Rating
                </span>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md shadow-zinc-50 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 text-center py-5 rounded-2xl">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white">{totalHours}</span>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1 w-full">
                  <Clock className="size-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  Hours
                </span>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md shadow-zinc-50 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 text-center py-5 rounded-2xl">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white">{totalStudents}</span>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1 w-full">
                  <Users className="size-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  Students
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Bio Card */}
          <Card className="border-none shadow-xl shadow-zinc-100 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-4">Professional Bio</h3>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {bio}
            </p>
          </Card>

          {/* Reviews Card */}
          <Card className="border-none shadow-xl shadow-zinc-100 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-900 pb-4">
              Student Reviews
            </h3>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900 space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="pt-6 first:pt-0 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-400 shrink-0">
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{review.name}</h4>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{review.date}</p>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < review.rating ? "text-amber-500" : "text-zinc-200 dark:text-zinc-800"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed md:pl-13">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full text-xs font-bold h-10 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-transparent text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer"
            >
              View All {totalReviews}+ Reviews
            </Button>
          </Card>
        </div>

        {/* Right Section - Sticky Booking Card */}
        <BookingCard tutorName={name} tutorProfileId={tutor.id} hourlyRate={hourlyRate} />
      </div>
    </Container>
  );
}
