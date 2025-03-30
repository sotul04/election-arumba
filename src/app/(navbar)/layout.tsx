import { Footer } from "~/components/footer"
import Navbar from "~/components/navbar/navbar"

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
    return <main className="">
        <Navbar />
        {children}
        <Footer/>
    </main>
}