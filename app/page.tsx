import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Users, Wand2, Star, Crown, Scroll, Flame } from "lucide-react"
import Link from "next/link"

export default function HogwartsAILanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Wand2 className="h-8 w-8 text-accent sparkle-animation" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full sparkle-animation" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-foreground">Arcanum Research</h1>
                <p className="text-sm text-muted-foreground">Magical Research & Image Generation</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#professors" className="text-foreground hover:text-accent transition-colors">
                Professors
              </a>
              <a href="#features" className="text-foreground hover:text-accent transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-foreground hover:text-accent transition-colors">
                Reviews
              </a>
              <a href="#pricing" className="text-foreground hover:text-accent transition-colors">
                Pricing
              </a>
            </nav>
            <Link href="/chat">
              <Button className="glow-effect">Start Researching</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="starry-night py-20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-accent text-accent-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Advanced AI Research & Image Generation
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
              Research with the Greatest
              <span className="text-accent block">Arcane Minds</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Experience magical research through our revolutionary AI agents that provide intelligent feedback and generate stunning images to enhance your discoveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8 py-4 glow-effect">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Begin Your Research Journey
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Research Areas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating magical elements */}
        <div className="absolute top-20 left-10 float-animation">
          <Scroll className="w-8 h-8 text-accent opacity-60" />
        </div>
        <div className="absolute top-32 right-16 float-animation" style={{ animationDelay: "1s" }}>
          <Star className="w-6 h-6 text-white opacity-40" />
        </div>
        <div className="absolute bottom-20 left-20 float-animation" style={{ animationDelay: "2s" }}>
          <Flame className="w-10 h-10 text-accent opacity-50" />
        </div>
      </section>

      {/* Professors Section */}
      <section id="professors" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Meet Your Professors
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Each AI agent has been crafted with unique research expertise, providing intelligent feedback and visual insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Albus Dumbledore",
                key: "dumbledore",
                avatar: "🧙‍♂️",
                subject: "Strategic Research & Wisdom",
                description:
                  "Advanced research methodology with deep analytical insights and strategic guidance for complex investigations.",
                icon: Crown,
                specialty: "Strategic Intelligence",
              },
              {
                name: "Severus Snape",
                key: "snape",
                avatar: "🦇",
                subject: "Critical Analysis & Precision",
                description:
                  "Rigorous fact-checking, critical evaluation, and synthesis of complex research materials with detailed feedback.",
                icon: Flame,
                specialty: "Critical Research Methods",
              },
              {
                name: "Minerva McGonagall",
                key: "mcgonagall",
                avatar: "👩‍🏫",
                subject: "Structured Research & Documentation",
                description:
                  "Systematic research organization, precise documentation, and clear presentation of findings and conclusions.",
                icon: Wand2,
                specialty: "Research Methodology",
              },
              {
                name: "Rubeus Hagrid",
                key: "hagrid",
                avatar: "🐻",
                subject: "Natural Research & Field Studies",
                description: "Comprehensive field research, natural observation methods, and collaborative investigation techniques.",
                icon: Star,
                specialty: "Field Research",
              },
              {
                name: "Luna Lovegood",
                key: "luna",
                avatar: "🌙",
                subject: "Creative Research & Innovation",
                description:
                  "Innovative research approaches, creative problem-solving, and unique perspectives on complex investigations.",
                icon: Sparkles,
                specialty: "Creative Research",
              },
              {
                name: "Hogwarts Archivist",
                key: "archivist",
                avatar: "📜",
                subject: "Data Archives & Documentation",
                description: "Comprehensive data archival, systematic documentation, and precise record-keeping for research integrity.",
                icon: BookOpen,
                specialty: "Research Archives",
              },
            ].map((professor, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-card border-border"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors">
                    <span className="text-3xl">{professor.avatar}</span>
                  </div>
                  <CardTitle className="font-serif text-xl text-card-foreground">{professor.name}</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">{professor.subject}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-card-foreground mb-4 text-pretty">{professor.description}</p>
                  <Badge variant="outline" className="mb-4">
                    {professor.specialty}
                  </Badge>
                  <Link href={`/chat?professor=${professor.key}`}>
                    <Button className="w-full group-hover:glow-effect">
                      <Users className="w-4 h-4 mr-2" />
                      Start Research Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Advanced Research Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Experience the most advanced AI-powered research platform with intelligent feedback and image generation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Wand2,
                title: "Intelligent Feedback",
                description: "Each research agent provides personalized, constructive feedback to guide your investigation process",
              },
              {
                icon: BookOpen,
                title: "Comprehensive Analysis",
                description: "Access deep research capabilities with detailed analysis and evidence-based conclusions",
              },
              {
                icon: Sparkles,
                title: "AI Image Generation",
                description: "Generate custom images and visualizations to illustrate your research findings and concepts",
              },
              {
                icon: Users,
                title: "Collaborative Research",
                description: "Work alongside AI agents in collaborative research sessions with real-time feedback and guidance",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-pretty">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Researcher Testimonials</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Hear from students who have enhanced their investigations through our AI professors and feedback system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emma Granger",
                house: "Gryffindor",
                quote:
                  "The AI feedback system helped me identify gaps in my research methodology I never would have caught. The generated visualizations made my findings crystal clear!",
                subject: "Research Methods",
              },
              {
                name: "Neville Longbottom",
                house: "Gryffindor",
                quote:
                  "The collaborative research sessions with Sprout's agent transformed my data analysis. The image generation feature brought my botanical research to life.",
                subject: "Data Analysis",
              },
              {
                name: "Luna Lovegood",
                house: "Ravenclaw",
                quote:
                  "Dumbledore's strategic research guidance opened new perspectives in my investigations. The intelligent feedback loops revolutionized my approach to complex problems.",
                subject: "Strategic Research",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="font-serif font-bold text-accent text-lg">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>
                        {testimonial.house} • {testimonial.subject}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground italic text-pretty">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Research Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Select the perfect plan for your research and investigation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Research Novice",
                price: "$29",
                period: "/month",
                description: "Perfect for beginning your research journey",
                features: ["Access to 3 research agents", "Basic feedback system", "Limited image generation", "Email support"],
                popular: false,
              },
              {
                name: "Advanced Researcher",
                price: "$59",
                period: "/month",
                description: "For serious research professionals",
                features: [
                  "Access to all research agents",
                  "Advanced feedback algorithms",
                  "Unlimited image generation",
                  "Priority support",
                  "Collaborative research sessions",
                ],
                popular: true,
              },
              {
                name: "Research Master",
                price: "$99",
                period: "/month",
                description: "Ultimate research intelligence experience",
                features: [
                  "Everything in Advanced",
                  "One-on-one agent consultations",
                  "Custom research methodologies",
                  "Advanced analytics dashboard",
                  "Lifetime access to research library",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-accent shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-pretty">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/chat">
                    <Button
                      className={`w-full ${plan.popular ? "glow-effect" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Start {plan.name} Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 magical-gradient text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
              Your Research Journey Awaits
            </h2>
            <p className="text-xl mb-8 text-white/90 text-pretty leading-relaxed">
              Join thousands of researchers who have enhanced their investigations with intelligent AI agents, advanced feedback systems, and powerful image generation capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 glow-effect">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Wand2 className="h-6 w-6 text-accent" />
                <span className="font-serif text-xl font-bold">Arcanum Research</span>
              </div>
              <p className="text-primary-foreground/80 text-pretty">
                Bringing advanced research capabilities to the digital age through intelligent AI agents and feedback systems.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Research Areas</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Strategic Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Data Visualization
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Critical Research Methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Image Generation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Research Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Methodology Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Feedback Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/60">© 2024 Arcanum Research. All rights reserved. Research responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
