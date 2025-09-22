"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Animation variants
export const animations = {
  // Fade animations
  fadeIn: "animate-in fade-in duration-500",
  fadeOut: "animate-out fade-out duration-300",
  fadeInUp: "animate-in fade-in slide-in-from-bottom-4 duration-500",
  fadeInDown: "animate-in fade-in slide-in-from-top-4 duration-500",
  fadeInLeft: "animate-in fade-in slide-in-from-left-4 duration-500",
  fadeInRight: "animate-in fade-in slide-in-from-right-4 duration-500",
  
  // Scale animations
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200",
  
  // Slide animations
  slideInLeft: "animate-in slide-in-from-left-full duration-300",
  slideInRight: "animate-in slide-in-from-right-full duration-300",
  slideInUp: "animate-in slide-in-from-bottom-full duration-300",
  slideInDown: "animate-in slide-in-from-top-full duration-300",
  
  // Bounce animation
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
  ping: "animate-ping",
  
  // Custom transitions
  slideUp: "transform transition-transform duration-300 ease-in-out hover:-translate-y-1",
  scaleHover: "transform transition-transform duration-200 ease-in-out hover:scale-105",
  glow: "transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-blue-500/25",
} as const;

// Stagger animation component
export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 100 
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.isArray(children) ? children.map((child, index) => (
        <StaggerItem key={index} delay={index * staggerDelay}>
          {child}
        </StaggerItem>
      )) : children}
    </div>
  );
}

export function StaggerItem({ 
  children, 
  delay = 0 
}: { 
  children: ReactNode; 
  delay?: number;
}) {
  return (
    <div 
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: "both"
      }}
    >
      {children}
    </div>
  );
}

// Animated counter
export function AnimatedCounter({ 
  value, 
  duration = 2000,
  className = "" 
}: { 
  value: number; 
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
}

// Animated progress bar
export function AnimatedProgressBar({ 
  progress, 
  className = "",
  showPercentage = false,
  color = "blue"
}: { 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600", 
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600"
  };

  return (
    <div className={cn("relative", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className={cn(
            "h-2 rounded-full transition-all duration-1000 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span className="absolute right-0 top-3 text-sm text-gray-600 dark:text-gray-400">
          {currentProgress}%
        </span>
      )}
    </div>
  );
}

// Fade in on scroll component
export function FadeInOnScroll({ 
  children, 
  className = "",
  threshold = 0.1,
  rootMargin = "0px"
}: { 
  children: ReactNode; 
  className?: string;
  threshold?: number;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return (
    <div
      ref={setRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}

// Animated card component
export function AnimatedCard({ 
  children, 
  className = "",
  hoverEffect = "lift",
  delay = 0
}: { 
  children: ReactNode; 
  className?: string;
  hoverEffect?: "lift" | "scale" | "glow" | "none";
  delay?: number;
}) {
  const hoverEffects = {
    lift: "hover:-translate-y-2 hover:shadow-xl",
    scale: "hover:scale-105",
    glow: "hover:shadow-2xl hover:shadow-blue-500/10",
    none: ""
  };

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-500",
        "transition-all duration-300 ease-out",
        hoverEffects[hoverEffect],
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: "both"
      }}
    >
      {children}
    </div>
  );
}

// Typewriter effect
export function TypewriterEffect({ 
  text, 
  speed = 100,
  className = "",
  showCursor = true 
}: { 
  text: string; 
  speed?: number;
  className?: string;
  showCursor?: boolean;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

// Animated list component
export function AnimatedList({ 
  items, 
  className = "",
  staggerDelay = 100,
  itemClassName = ""
}: { 
  items: ReactNode[];
  className?: string;
  staggerDelay?: number;
  itemClassName?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "animate-in fade-in slide-in-from-left-4 duration-500",
            itemClassName
          )}
          style={{ 
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: "both"
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

// Ripple effect component
export function RippleEffect({ 
  children, 
  className = "",
  rippleColor = "rgba(255, 255, 255, 0.6)"
}: { 
  children: ReactNode; 
  className?: string;
  rippleColor?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </div>
  );
}

// Skeleton loader with animation
export function AnimatedSkeleton({ 
  className = "",
  count = 1,
  height = "h-4"
}: { 
  className?: string;
  count?: number;
  height?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-gray-200 dark:bg-gray-700 rounded animate-pulse",
            height
          )}
          style={{ 
            animationDelay: `${i * 100}ms`,
            animationDuration: "1.5s"
          }}
        />
      ))}
    </div>
  );
}

// Floating action button with animation
export function FloatingActionButton({ 
  children, 
  onClick,
  className = "",
  position = "bottom-right"
}: { 
  children: ReactNode; 
  onClick: () => void;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const positions = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        positions[position],
        "z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg",
        "transform transition-all duration-200 ease-in-out",
        "hover:scale-110 hover:shadow-xl",
        "animate-in zoom-in-50 duration-300",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
}