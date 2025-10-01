"use client";

import { ReactNode, useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn, isMobile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Responsive Container
export function ResponsiveContainer({ 
  children, 
  className = "",
  size = "lg" 
}: { 
  children: ReactNode; 
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-[1400px]",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8",
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Grid
export function ResponsiveGrid({ 
  children, 
  className = "",
  cols = { default: 1, sm: 2, md: 3, lg: 4 }
}: { 
  children: ReactNode; 
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}) {
  const gridClasses = [
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      gridClasses,
      className
    )}>
      {children}
    </div>
  );
}

// Mobile Navigation
interface MobileNavProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: "left" | "right";
}

export function MobileNav({ trigger, children, side = "left" }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={side} className="w-80 p-0">
        <div className="flex flex-col h-full">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Responsive Navigation Menu
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
  children?: NavItem[];
  onClick?: () => void;
}

interface ResponsiveNavProps {
  items: NavItem[];
  brand?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ResponsiveNav({ items, brand, actions, className }: ResponsiveNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={cn("border-b bg-background", className)}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            {brand}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {items.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {actions}
          </div>

          {/* Mobile Menu Button */}
          <MobileNav
            trigger={
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            }
          >
            <div className="p-4 space-y-1">
              {items.map((item, index) => (
                <MobileNavItem 
                  key={index} 
                  item={item} 
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
              {actions && (
                <div className="pt-4 border-t">
                  {actions}
                </div>
              )}
            </div>
          </MobileNav>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ item }: { item: NavItem }) {
  if (item.children) {
    return (
      <div className="relative group">
        <Button variant="ghost" className="flex items-center">
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
        <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {item.children.map((child, index) => (
            <a
              key={index}
              href={child.href}
              onClick={child.onClick}
              className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              {child.icon && <child.icon className="w-4 h-4 mr-2 inline" />}
              {child.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      asChild={!!item.href}
      onClick={item.onClick}
      className="flex items-center"
    >
      {item.href ? (
        <a href={item.href}>
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </a>
      ) : (
        <>
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </>
      )}
    </Button>
  );
}

function MobileNavItem({ 
  item, 
  onItemClick 
}: { 
  item: NavItem; 
  onItemClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between"
          >
            <div className="flex items-center">
              {item.icon && <item.icon className="w-4 h-4 mr-2" />}
              {item.label}
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4">
          {item.children.map((child, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start"
              asChild={!!child.href}
              onClick={() => {
                child.onClick?.();
                onItemClick();
              }}
            >
              {child.href ? (
                <a href={child.href} className="flex items-center">
                  {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                  {child.label}
                </a>
              ) : (
                <>
                  {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                  {child.label}
                </>
              )}
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      asChild={!!item.href}
      onClick={() => {
        item.onClick?.();
        onItemClick();
      }}
    >
      {item.href ? (
        <a href={item.href} className="flex items-center">
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </a>
      ) : (
        <>
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </>
      )}
    </Button>
  );
}

// Responsive Section
export function ResponsiveSection({ 
  children, 
  className = "",
  padding = "default"
}: { 
  children: ReactNode; 
  className?: string;
  padding?: "none" | "sm" | "default" | "lg" | "xl";
}) {
  const paddingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    default: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-24 lg:py-32"
  };

  return (
    <section className={cn(paddingClasses[padding], className)}>
      {children}
    </section>
  );
}

// Responsive Card Grid
export function ResponsiveCardGrid({ 
  children, 
  className = ""
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive Stack
export function ResponsiveStack({ 
  children, 
  className = "",
  direction = { default: "vertical", md: "horizontal" },
  spacing = "default",
  align = "start"
}: { 
  children: ReactNode; 
  className?: string;
  direction?: {
    default: "vertical" | "horizontal";
    sm?: "vertical" | "horizontal";
    md?: "vertical" | "horizontal";
    lg?: "vertical" | "horizontal";
  };
  spacing?: "none" | "sm" | "default" | "lg";
  align?: "start" | "center" | "end" | "stretch";
}) {
  const spacingClasses = {
    none: "gap-0",
    sm: "gap-2",
    default: "gap-4",
    lg: "gap-6"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center", 
    end: "items-end",
    stretch: "items-stretch"
  };

  const directionClasses = [
    direction.default === "horizontal" ? "flex-row" : "flex-col",
    direction.sm && (direction.sm === "horizontal" ? "sm:flex-row" : "sm:flex-col"),
    direction.md && (direction.md === "horizontal" ? "md:flex-row" : "md:flex-col"),
    direction.lg && (direction.lg === "horizontal" ? "lg:flex-row" : "lg:flex-col"),
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(
      "flex",
      directionClasses,
      spacingClasses[spacing],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
}

// Use responsive breakpoint hook
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<string>("lg");
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs");
      else if (width < 768) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else if (width < 1280) setBreakpoint("lg");
      else setBreakpoint("xl");
      
      setIsMobileDevice(width < 768);
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: isMobileDevice,
    isTablet: breakpoint === "md",
    isDesktop: ["lg", "xl"].includes(breakpoint),
  };
}