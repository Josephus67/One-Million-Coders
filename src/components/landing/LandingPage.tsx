"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, ResponsiveSection, ResponsiveGrid } from "@/components/ui/responsive";
import { FadeInOnScroll, AnimatedCounter, StaggerContainer } from "@/components/ui/animations";
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Globe,
  Smartphone,
  Code,
  Database,
  Palette
} from "lucide-react";

export function LandingPage() {
  const stats = [
    { label: "Active Students", value: 25000, icon: Users },
    { label: "Courses Available", value: 150, icon: BookOpen },
    { label: "Certificates Issued", value: 12000, icon: Award },
    { label: "Hours of Content", value: 5000, icon: Clock },
  ];

  const features = [
    {
      icon: Globe,
      title: "Learn from Anywhere",
      description: "Access your courses from any device, anywhere in the world. Our platform is fully responsive and works on all devices.",
    },
    {
      icon: Clock,
      title: "Learn at Your Pace",
      description: "Self-paced learning with lifetime access to course materials. Learn on your schedule, at your own speed.",
    },
    {
      icon: Award,
      title: "Get Certified",
      description: "Earn industry-recognized certificates upon course completion to boost your career prospects.",
    },
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with thousands of learners, share knowledge, and grow together in our vibrant community.",
    },
  ];

  const courses = [
    {
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript from scratch",
      category: "Web Development",
      students: 4500,
      rating: 4.8,
      price: 49,
      image: "/api/placeholder/400/250",
      icon: Code,
    },
    {
      title: "Database Design & SQL",
      description: "Master database concepts and SQL queries",
      category: "Database",
      students: 3200,
      rating: 4.7,
      price: 59,
      image: "/api/placeholder/400/250", 
      icon: Database,
    },
    {
      title: "UI/UX Design Principles",
      description: "Create beautiful and user-friendly interfaces",
      category: "Design",
      students: 2800,
      rating: 4.9,
      price: 69,
      image: "/api/placeholder/400/250",
      icon: Palette,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Full Stack Developer",
      content: "Ghana Tech Online transformed my career. The courses are well-structured and the community support is amazing.",
      rating: 5,
    },
    {
      name: "Michael Asante",
      role: "Data Scientist",
      content: "I went from complete beginner to landing my dream job in tech. The hands-on projects made all the difference.",
      rating: 5,
    },
    {
      name: "Grace Osei",
      role: "UI/UX Designer",
      content: "The design courses here are top-notch. I learned practical skills that I use in my job every day.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <ResponsiveContainer className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Ghana Tech Online</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </ResponsiveContainer>
      </nav>

      {/* Hero Section */}
      <ResponsiveSection className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
        <ResponsiveContainer>
          <div className="text-center">
            <FadeInOnScroll>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Master Programming &{" "}
                <span className="text-blue-600 dark:text-blue-400">Technology</span>
              </h1>
            </FadeInOnScroll>
            <FadeInOnScroll>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Join thousands of students learning to code and building amazing projects. 
                Start your tech journey with hands-on courses designed for real-world success.
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link href="/sign-up">
                    Start Learning Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </FadeInOnScroll>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Stats Section */}
      <ResponsiveSection padding="lg">
        <ResponsiveContainer>
          <ResponsiveGrid cols={{ default: 2, md: 4 }}>
            {stats.map((stat, index) => (
              <FadeInOnScroll key={stat.label}>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      <AnimatedCounter value={stat.value} />
                      {stat.label === "Hours of Content" && "+"}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Features Section */}
      <ResponsiveSection className="bg-gray-50 dark:bg-gray-900">
        <ResponsiveContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Ghana Tech Online?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide everything you need to succeed in your tech journey
            </p>
          </div>
          <ResponsiveGrid cols={{ default: 1, md: 2 }}>
            {features.map((feature, index) => (
              <FadeInOnScroll key={feature.title}>
                <Card className="h-full">
                  <CardHeader>
                    <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Popular Courses */}
      <ResponsiveSection>
        <ResponsiveContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start with our most loved courses
            </p>
          </div>
          <ResponsiveGrid cols={{ default: 1, md: 3 }}>
            {courses.map((course, index) => (
              <FadeInOnScroll key={course.title}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                    <course.icon className="w-16 h-16 text-white" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {typeof course.category === 'string' 
                          ? course.category 
                          : (course.category as any)?.name || 'Uncategorized'
                        }
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>{course.students?.toLocaleString() || 0} students</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        ${course.price}
                      </span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/sign-up">Enroll Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Testimonials */}
      <ResponsiveSection className="bg-gray-50 dark:bg-gray-900">
        <ResponsiveContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Success stories from our community
            </p>
          </div>
          <ResponsiveGrid cols={{ default: 1, md: 3 }}>
            {testimonials.map((testimonial, index) => (
              <FadeInOnScroll key={testimonial.name}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* CTA Section */}
      <ResponsiveSection className="bg-blue-600 dark:bg-blue-800">
        <ResponsiveContainer>
          <div className="text-center text-white">
            <FadeInOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your Tech Journey?
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of students already learning and building amazing projects
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
                  <Link href="/sign-up">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </FadeInOnScroll>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <ResponsiveContainer>
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-white">Ghana Tech Online</span>
                </div>
                <p className="text-gray-400">
                  Empowering the next generation of tech professionals in Ghana and beyond.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Courses</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">Web Development</Link></li>
                  <li><Link href="#" className="hover:text-white">Mobile Development</Link></li>
                  <li><Link href="#" className="hover:text-white">Data Science</Link></li>
                  <li><Link href="#" className="hover:text-white">UI/UX Design</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                  <li><Link href="#" className="hover:text-white">Community</Link></li>
                  <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">About Us</Link></li>
                  <li><Link href="#" className="hover:text-white">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p>&copy; 2024 Ghana Tech Online. All rights reserved.</p>
            </div>
          </div>
        </ResponsiveContainer>
      </footer>
    </div>
  );
}