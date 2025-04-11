import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Navbar } from "@/app/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <Navbar />
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background flex justify-center">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-5">
              <div className="inline-block">
                <Badge className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  New and Improved
                </Badge>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Modern solutions for your digital needs
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg sm:text-xl">
                  Our platform helps you build beautiful, accessible, and performant web applications with unparalleled ease.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href="/register">
                  <Button size="lg" className="px-8 py-6 text-base rounded-md w-full sm:w-auto">
                    Register
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-md w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="inline-block rounded-full overflow-hidden border-2 border-background w-8 h-8 md:w-10 md:h-10">
                      <div className="bg-muted h-full w-full flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {i}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">1,000+</span> developers trust our platform
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md p-4 sm:p-6 bg-muted/30 rounded-lg backdrop-blur-sm border border-muted">
                <Carousel className="w-full">
                  <CarouselContent>
                    {[1, 2, 3].map((index) => (
                      <CarouselItem key={index}>
                        <Card className="border-0 bg-transparent shadow-none">
                          <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                            <div className="text-center">
                              <div className="mb-2 flex justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-xl font-bold text-primary">{index}</span>
                                </div>
                              </div>
                              <div className="text-xl font-semibold mb-1">Feature {index}</div>
                              <p className="text-sm text-muted-foreground">Discover our powerful solution</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-4">
                    <CarouselPrevious className="relative inset-0 translate-y-0 rounded-full" />
                    <CarouselNext className="relative inset-0 translate-y-0 rounded-full" />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-muted/30 flex justify-center">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything you need to succeed
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg mx-auto">
              Our platform combines powerful tools with an intuitive interface to help you build amazing products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Lightning Fast', 
                description: 'Build and deploy web applications with incredible speed and performance.',
                icon: '⚡'
              },
              { 
                title: 'Highly Reliable', 
                description: 'Our infrastructure ensures your applications are always available when you need them.',
                icon: '🛡️'
              },
              { 
                title: 'Enterprise Secure', 
                description: 'Advanced security features to protect your data and your users.',
                icon: '🔒'
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-background border border-muted transition-all duration-200 hover:shadow-md hover:border-primary/20">
                <CardHeader>
                  <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="px-0 text-primary hover:text-primary/80 hover:bg-transparent">
                    Learn more <span className="ml-1">→</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-16 md:py-24 bg-background flex justify-center">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Trusted by developers worldwide
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg mx-auto">
              Here's what our users are saying about their experience with our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: 'Alex Chen', 
                role: 'Frontend Developer',
                content: "This platform has completely transformed how I build web applications. The components are beautifully designed and extremely customizable."
              },
              { 
                name: 'Sarah Johnson', 
                role: 'Project Manager',
                content: "We have reduced our development time by 40% since adopting this platform. The documentation is excellent and the support team is responsive."
              },
              { 
                name: 'Michael Lee', 
                role: 'CTO',
                content: "As someone responsible for technical decisions, I appreciate the platform emphasis on performance, accessibility, and developer experience."
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-muted/20 border border-muted">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="text-primary"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-foreground italic">{testimonial.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t mt-auto flex justify-center">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-[350px]">
              <div>
                <Image 
                  src="/next.svg" 
                  alt="Next.js Logo" 
                  width={100} 
                  height={24} 
                  className="dark:invert"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Building the next generation of web applications with modern tooling and exceptional developer experience.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-medium">Product</h3>
                <ul className="space-y-2">
                  {['Features', 'Pricing', 'Documentation', 'Changelog'].map((item) => (
                    <li key={item}>
                      <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Company</h3>
                <ul className="space-y-2">
                  {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                    <li key={item}>
                      <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Resources</h3>
                <ul className="space-y-2">
                  {['Community', 'Help Center', 'Partners', 'Status'].map((item) => (
                    <li key={item}>
                      <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              © 2025 Your Company. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                href="https://nextjs.org/learn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/file.svg"
                  alt="File icon"
                  width={16}
                  height={16}
                />
                Learn
              </a>
              <a
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                href="https://vercel.com/templates"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/window.svg"
                  alt="Window icon"
                  width={16}
                  height={16}
                />
                Examples
              </a>
              <a
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                />
                Next.js
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
