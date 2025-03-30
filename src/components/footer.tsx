import Link from "next/link"
import { Instagram, Mail, Globe, Calendar, Shield } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full border-t bg-white py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Organization Info */}
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-emerald-700" />
                            <h3 className="text-lg font-semibold">Arumba Jabar</h3>
                        </div>
                        <p className="text-sm text-gray-600">Official election platform of Arumba Jabar.</p>
                        <p className="text-sm text-gray-600">
                            <Calendar className="mr-2 inline-block h-4 w-4" />
                            {currentYear} Election Period
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link href="/vote" className="text-gray-600 hover:text-emerald-700">
                                Vote
                            </Link>
                            <Link href="/profile" className="text-gray-600 hover:text-emerald-700">
                                Profile
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <div className="flex flex-col space-y-2 text-sm">
                            <a
                                href="https://instagram.com/arumba.jabar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-emerald-700"
                            >
                                <Instagram className="mr-2 h-4 w-4" />
                                @arumba.jabar
                            </a>
                            <a
                                href="mailto:suthasoma04@gmail.com"
                                className="flex items-center text-gray-600 hover:text-emerald-700"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Developer - suthasoma
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-4">
                    <div className="flex flex-col items-center justify-between space-y-2 text-center text-xs text-gray-500 md:flex-row md:text-left">
                        <p>© {currentYear} Arumba Jabar. All rights reserved.</p>
                        <p>
                            Developed by{" "}
                            <a href="mailto:suthasoma04@gmail.com" className="hover:text-emerald-700">
                                Arumba Jabar Tech Team
                            </a>
                        </p>
                        <p>All information will be kept confidential</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

