"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResponsiveNav } from "@/components/ui/responsive";
import { useNotifications } from "@/hooks/useNotifications";
import { cn, generateInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
  Settings,
  Bell,
  LogOut,
  Shield,
  Users,
  BarChart3,
  Award,
  Search,
  Menu
} from "lucide-react";

// Navigation configuration
const mainNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    label: "My Learning",
    href: "/my-courses",
    icon: GraduationCap,
  },
];

const adminNavItems = [
  {
    label: "Admin",
    icon: Shield,
    children: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppHeader() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();

  // Don't show header on auth pages
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  // Check if user has admin role from custom metadata (you'll need to set this up in Clerk)
  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
  };

  // Combine nav items based on user role
  const navItems = isAdmin 
    ? [...mainNavItems, ...adminNavItems]
    : mainNavItems;

  // User menu items
  const userMenuItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  if (isAdmin) {
    userMenuItems.splice(1, 0, {
      label: "Admin Panel",
      href: "/admin",
      icon: Shield,
    });
  }

  // Notification component
  const NotificationButton = () => (
    <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Your recent notifications and updates
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col space-y-1 p-3 rounded-lg border bg-card"
                >
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  router.push('/notifications');
                }}
              >
                View All Notifications
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );  // User menu component
  const UserMenu = () => (
    <Dialog open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl || undefined} alt={user?.fullName || ""} />
            <AvatarFallback>
              {user?.fullName ? generateInitials(user.fullName) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.imageUrl || undefined} alt={user?.fullName || ""} />
              <AvatarFallback className="text-lg">
                {user?.fullName ? generateInitials(user.fullName) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user?.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-2">
          {userMenuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setIsUserMenuOpen(false);
                router.push(item.href);
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              setIsUserMenuOpen(false);
              handleSignOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Brand component
  const Brand = () => (
    <Link href="/dashboard" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <GraduationCap className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-xl hidden sm:inline-block">Ghana Tech</span>
    </Link>
  );

  // Search component (placeholder for now)
  const SearchButton = () => (
    <Button variant="outline" size="sm" className="relative w-40 justify-start text-sm text-muted-foreground">
      <Search className="mr-2 h-4 w-4" />
      Search...
    </Button>
  );

  // Actions component
  const HeaderActions = () => (
    <div className="flex items-center space-x-2">
      <div className="hidden md:block">
        <SearchButton />
      </div>
      <NotificationButton />
      <UserMenu />
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <ResponsiveNav
      brand={<Brand />}
      items={navItems}
      actions={<HeaderActions />}
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    />
  );
}

// Page wrapper with navigation
export function PageLayout({ 
  children, 
  title,
  description,
  showBackButton = false 
}: { 
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(title || description || showBackButton) && (
            <div className="mb-8">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  onClick={() => router.back()}
                  className="mb-4"
                >
                  ← Back
                </Button>
              )}
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

// Breadcrumb component
export function Breadcrumb({ 
  items 
}: { 
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.href ? (
              <Link 
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Active link component
export function NavLink({ 
  href, 
  children, 
  className = "",
  exact = false
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact 
    ? pathname === href 
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors duration-200",
        isActive 
          ? "text-blue-600 dark:text-blue-400 font-medium" 
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
        className
      )}
    >
      {children}
    </Link>
  );
}