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
                  Advanced Neurological Analysis
                </Badge>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Digital Twin of the Brain
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg sm:text-xl">
                  AI-powered EEG analysis for early detection of neurological conditions and simulation of treatment interventions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href="/register">
                  <Button size="lg" className="px-8 py-6 text-base rounded-md w-full sm:w-auto">
                    Clinician Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-md w-full sm:w-auto">
                    Clinician Login
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
                  <span className="font-semibold">1,000+</span> neurological assessments performed
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md p-4 sm:p-6 bg-muted/30 rounded-lg backdrop-blur-sm border border-muted">
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem>
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                          <div className="text-center">
                            <div className="mb-2 flex justify-center">
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
                                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
                                  <circle cx="20" cy="10" r="2"></circle>
                                </svg>
                              </div>
                            </div>
                            <div className="text-xl font-semibold mb-1">EEG Analysis</div>
                            <p className="text-sm text-muted-foreground">Upload EEG data for instant analysis</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                    <CarouselItem>
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                          <div className="text-center">
                            <div className="mb-2 flex justify-center">
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                  <path d="M14 6a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2Z"></path>
                                  <path d="M12 18a6 6 0 0 0 6-6a6 6 0 0 0-12 0a6 6 0 0 0 6 6Z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="text-xl font-semibold mb-1">Early Detection</div>
                            <p className="text-sm text-muted-foreground">Identify patterns linked to neurological conditions</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                    <CarouselItem>
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                          <div className="text-center">
                            <div className="mb-2 flex justify-center">
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                  <path d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"></path>
                                  <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"></path>
                                  <path d="M12 16v-3"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="text-xl font-semibold mb-1">Treatment Simulation</div>
                            <p className="text-sm text-muted-foreground">Model potential effects of interventions</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
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
              Key Capabilities
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Neurological Analysis
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg mx-auto">
              Our AI-powered platform processes EEG data to create a personalized Digital Twin of the Brain, 
              enabling early detection, simulation, and clinical decision support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4Z"></path>
                  </svg>
                </div>
                <CardTitle>Epilepsy Detection</CardTitle>
                <CardDescription>
                  Identify patterns in brain activity that may indicate early signs of epilepsy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
                <CardTitle>Cognitive Stress Analysis</CardTitle>
                <CardDescription>
                  Measure and track cognitive stress levels with detailed brain activity metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h8"></path>
                    <path d="M12 16V8"></path>
                  </svg>
                </div>
                <CardTitle>Depression Indicators</CardTitle>
                <CardDescription>
                  Detect neural patterns associated with depression for early intervention
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"></path>
                    <circle cx="18" cy="18" r="3"></circle>
                    <path d="M18 14v1"></path>
                    <path d="M18 21v1"></path>
                    <path d="M22 18h-1"></path>
                    <path d="M15 18h-1"></path>
                    <path d="M21 15l-.88.88"></path>
                    <path d="M15.88 20.12 15 21"></path>
                    <path d="M21 21l-.88-.88"></path>
                    <path d="M15.88 15.88 15 15"></path>
                  </svg>
                </div>
                <CardTitle>Medication Simulation</CardTitle>
                <CardDescription>
                  Model the potential effects of medications on the patient's brain activity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                    <line x1="18" y1="9" x2="13" y2="14"></line>
                    <line x1="13" y1="9" x2="18" y2="14"></line>
                  </svg>
                </div>
                <CardTitle>Surgical Intervention Planning</CardTitle>
                <CardDescription>
                  Support clinical decision-making for surgical interventions with brain simulations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <CardTitle>Longitudinal Analysis</CardTitle>
                <CardDescription>
                  Track changes in brain activity over time to monitor treatment efficacy
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Clinical Benefits */}
      <section className="w-full py-16 md:py-24 bg-background flex justify-center">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">
              Clinical Benefits
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Enhancing Neurological Care
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg mx-auto">
              Our Digital Twin of the Brain technology provides clinicians with powerful tools for 
              personalized care and improved patient outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>For Healthcare Providers</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Evidence-based treatment recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Improved diagnostic accuracy for complex neurological conditions</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Objective measurement of treatment efficacy</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Integration with existing clinical workflows</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>For Patients</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Earlier detection of neurological conditions</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Personalized treatment plans based on individual brain dynamics</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Reduced trial-and-error approach to medication</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Improved long-term neurological health outcomes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
