'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../../theme/ThemeSwitcher";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GrResources } from "react-icons/gr";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { useTheme } from "next-themes";
import { GoDiscussionClosed } from "react-icons/go";
import { RiDashboardFill } from "react-icons/ri";
import { useAuth } from "@/app/_contexts/authcontext";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { House } from "lucide-react";

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    text: string;
}

interface UserMenuProps {
    name: string;
    handleLogout: () => void;
    handleShowUid: () => void;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

interface AuthResponse {
    uid: string;
    name: string;
}

interface NavbarProps {
    isMenuOpen: boolean;
    handleMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, handleMenuToggle }) => {
    const router = useRouter();
    const { token, logout } = useAuth();
    const [name, setName] = useState<string>('');
    const [uid, setUid] = useState<string>('');
    const [showUidDialog, setShowUidDialog] = useState<boolean>(false);
    const { resolvedTheme } = useTheme();
    const [copy, setCopy] = useState<string>("Copy");

    const getName = async (): Promise<void> => {
        try {
            const res = await fetch("/api/getName", {
                method: "GET",
                headers: {
                    Authorization: token as string,
                },
            });
            const data: AuthResponse = await res.json();
            setUid(data.uid);
            setName(data.name);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        if (token) {
            getName();
        }
    }, [token]);

    const handleLogout = (): void => {
        logout();
        router.push("/");
    };

    const handleShowUid = (): void => {
        setShowUidDialog(true);
    };

    const handleCopyUid = (): void => {
        navigator.clipboard.writeText(uid);
        setCopy("Copied!");
        setTimeout(() => {
            setCopy("Copy");
        }, 2000);
    };

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
                                <img
                                    src={`${resolvedTheme === 'light' ? "Logo6 dark.png" : "Logo6.png"}`}
                                    className="h-5 w-5 sm:h-10 sm:w-10 mr-4"
                                    alt="Logo"
                                />
                                <h5 className="text-lg sm:text-xl text-black dark:text-white font-black relative">
                                    Coordina
                                </h5>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <nav className="hidden lg:block mr-4">
                            <div className="flex gap-6">
                                <NavLink href="/home" icon={<House className="h-5 w-5" />} text="Home" />
                                <NavLink href="/dashboard" icon={<RiDashboardFill className="h-5 w-5" />} text="Dashboard" />
                                <NavLink href="/resources" icon={<GrResources className="h-5 w-5" />} text="Resources" />
                                <NavLink href="/conflicts" icon={<FaCompressArrowsAlt className="h-5 w-5" />} text="Conflicts" />
                                <NavLink href="/discussion" icon={<GoDiscussionClosed className="h-5 w-5" />} text="Discussion" />
                            </div>
                        </nav>
                        <ModeToggle />
                        <UserMenu name={name} handleLogout={handleLogout} handleShowUid={handleShowUid} />
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
                            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
                            onClick={handleMenuToggle}
                        />
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-14 left-0 right-0 z-50 bg-background/70 backdrop-blur-md px-4 py-6 lg:hidden"
                        >
                            <div className="grid gap-4">
                                <NavLink href="/home" icon={<House className="h-5 w-5" />} text="Home" />
                                <NavLink href="/dashboard" icon={<RiDashboardFill className="h-5 w-5" />} text="Dashboard" />
                                <NavLink href="/resources" icon={<GrResources className="h-5 w-5" />} text="Resources" />
                                <NavLink href="/conflicts" icon={<FaCompressArrowsAlt className="h-5 w-5" />} text="Conflicts" />
                                <NavLink href="/discussion" icon={<GoDiscussionClosed className="h-5 w-5" />} text="Discussion" />
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            <Dialog open={showUidDialog} onOpenChange={setShowUidDialog}>
                <AnimatePresence>
                    {showUidDialog && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 flex items-center justify-center z-50"
                            >
                                <DialogContent className="p-6 rounded-lg shadow-lg">
                                    <DialogTitle className="text-lg font-semibold mb-4">Your UID</DialogTitle>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-gray-800 dark:text-gray-200">{uid}</span>
                                        <Button onClick={handleCopyUid}>{copy}</Button>
                                    </div>
                                    <DialogClose asChild>
                                        <Button className="mt-4">Close</Button>
                                    </DialogClose>
                                </DialogContent>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Dialog>
        </>
    );
};

const NavLink: React.FC<NavLinkProps> = ({ href, icon, text }) => {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-2 py-1 text-foreground transition-all duration-200 rounded-md"
            prefetch={false}
        >
            {icon}
            {text}
        </Link>
    );
}

const UserMenu: React.FC<UserMenuProps> = ({ name, handleLogout, handleShowUid }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full transition-all duration-200"
                >
                    <img
                        src="/avatar.jpg"
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
                <DropdownMenuItem onClick={handleShowUid}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Show UID</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const MenuIcon: React.FC<IconProps> = (props) => {
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
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

const UserIcon: React.FC<IconProps> = (props) => {
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
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
        </svg>
    );
}

const LogOutIcon: React.FC<IconProps> = (props) => {
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
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
        </svg>
    );
}

export default Navbar;