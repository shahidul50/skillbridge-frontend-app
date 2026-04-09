import Link from "next/link"
import { Boxes } from "lucide-react" 
import { Container } from "@/components/layout/Container"

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5 md:gap-8">
          
          <div className="flex flex-col gap-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500 text-white"> 
                <Boxes className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">SkillBridge</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The world&apos;s leading platform for personalized learning. Connect
              with experts across hundreds of subjects.
            </p>
          </div>

          {/* Links Sections */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm">COMPANY</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">About Us</Link>
              <Link href="#" className="hover:text-primary">Careers</Link>
              <Link href="#" className="hover:text-primary">Blog</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm">SUPPORT</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">Help Center</Link>
              <Link href="#" className="hover:text-primary">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm">LEGAL</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
              <Link href="#" className="hover:text-primary">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SkillBridge. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </Link>

            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}