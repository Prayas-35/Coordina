'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "../theme/ThemeSwitcher"
// import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GrResources } from "react-icons/gr";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { useTheme } from "next-themes"

export default function Navbar() {
    //   const router = useRouter()
    //   const { token, logout } = useAuth()
    //   const [name, setName] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { resolvedTheme } = useTheme()

    //   const getName = async () => {
    //     const res = await fetch("/api/getName", {
    //       method: "GET",
    //       headers: {
    //         Authorization: token
    //       }
    //     })
    //     const data = await res.json()
    //     setName(data.name)
    //   }

    //   useEffect(() => {
    //     if (token) {
    //       getName()
    //     }
    //   }, [token])

    //   const handleLogout = () => {
    //     logout()
    //     router.push("/")
    //   }

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <header className="mx-auto px-4 text-primary py-4 lg:px-24 border-b border-border bg-background sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full">
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={handleMenuToggle}
                        >
                            <MenuIcon className="h-6 w-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                        <Link href="/">
                            <span className="flex items-center gap-2 text-primary-foreground">
                                <img src={`${resolvedTheme === 'dark' ? "Logo6.png" : "Logo6 dark.png"}`}
                                    className="h-5 w-5 sm:h-10 sm:w-10 mr-4"
                                />
                                <span className="text-lg sm:text-xl text-black dark:text-white font-bold relative">
                                    CitySync
                                </span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <nav className="hidden lg:block mr-4">
                            <div className="flex gap-6">
                                <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} text="Dashboard" />
                                <NavLink href="/resources" icon={<GrResources className="h-5 w-5" />} text="Resources" />
                                <NavLink href="/conflicts" icon={<FaCompressArrowsAlt className="h-5 w-5" />} text="Conflicts" />
                            </div>
                        </nav>
                        <ModeToggle />
                        {/* <UserMenu name={name} handleLogout={handleLogout} /> */}
                    </div>
                </div>
            </header>
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={handleMenuToggle}
                        />
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-14 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg px-4 py-6 lg:hidden"
                        >
                            <div className="grid gap-4">
                                <NavLink href="/dashboard" icon={<HomeIcon className="h-4 w-4" />} text="Dashboard" />
                                <NavLink href="/resources" icon={<GrResources className="h-5 w-5" />} text="Resources" />
                                <NavLink href="/conflicts" icon={<FaCompressArrowsAlt className="h-5 w-5" />} text="Conflicts" />
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

function NavLink({ href, icon, text }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-2 py-1 text-foreground transition-all duration-200 rounded-md"
            prefetch={false}
        >
            {icon}
            {text}
        </Link>
    )
}

function UserMenu({ name, handleLogout }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full transition-all duration-200"
                >
                    <img
                        src="/pp.png"
                        width={32}
                        height={32}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                    <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <HelpCircleIcon className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}

function HomeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

function UserIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

function SettingsIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

function HelpCircleIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
    )
}

function LogOutIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}