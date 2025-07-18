import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"
import Header from "../components/header"
import { Inter } from "next/font/google"
import "./globals.css"
import { shadesOfPurple } from "@clerk/themes"
import { Toaster } from "sonner"
import Footer from "@/components/footer"

// Font
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Zcrum",
  description: "Project Managment App",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#1a202c",
          colorInputBackground: "#2D3748",
          colorInputText: "#F3F4F6",
        },
        elements: {
          formButtonPrimary: "text-white",
          card: "bg-gray-800",
          headerTitle: "text-blue-400",
          headerSubtitle: "text-gray-400"
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.className} dotted-background `}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-screen"> {children} </main>
            <Toaster richColors />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
