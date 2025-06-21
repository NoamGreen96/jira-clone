import { ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* {Hero Section} */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col ">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with{" "}
            <Image
              src={"/logo2.png"}
              alt="Zscrum Logo"
              width={400}
              height={80}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>
        <p>Empower your team with our intutive project managment solution.</p>
        <Link href='/onboarding'>
          <Button size="lg" variant='destructive' className="mr-4">
            Get Started
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
        <Link href='#features'>
          <Button size="lg" variant='outline' className="mr-4">
            Learn More
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
