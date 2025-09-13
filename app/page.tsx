import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Users, Wand2, Star, Crown, Scroll, Flame } from "lucide-react"

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
                <h1 className="font-serif text-2xl font-bold text-foreground">Hogwarts AI</h1>
                <p className="text-sm text-muted-foreground">Magical Learning Experience</p>
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
            <Button className="glow-effect">Start Learning</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="starry-night py-20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-accent text-accent-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Advanced Agentic AI Research
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
              Converse with the Greatest
              <span className="text-accent block">Hogwarts Professors</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Experience magical learning through our revolutionary AI that brings the wisdom of Dumbledore, Snape,
              McGonagall, and other legendary professors to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 glow-effect">
                <Wand2 className="w-5 h-5 mr-2" />
                Begin Your Magical Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Subjects
              </Button>
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
              Meet Your Magical Mentors
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Each professor has been carefully crafted with their unique personality, teaching style, and vast
              knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Albus Dumbledore",
                subject: "Wisdom & Leadership",
                description:
                  "The greatest wizard of all time shares profound insights on life, magic, and the power of choice.",
                icon: Crown,
                specialty: "Philosophy & Strategy",
              },
              {
                name: "Severus Snape",
                subject: "Potions & Dark Arts",
                description:
                  "Master the complex art of potion-making and understand the delicate balance of magical forces.",
                icon: Flame,
                specialty: "Advanced Magic Theory",
              },
              {
                name: "Minerva McGonagall",
                subject: "Transfiguration",
                description:
                  "Learn the precise art of transformation magic with the most skilled transfiguration expert.",
                icon: Wand2,
                specialty: "Precision & Discipline",
              },
              {
                name: "Remus Lupin",
                subject: "Defense Against Dark Arts",
                description: "Practical defense techniques and understanding the nature of dark creatures and magic.",
                icon: Star,
                specialty: "Practical Application",
              },
              {
                name: "Pomona Sprout",
                subject: "Herbology",
                description:
                  "Discover the magical properties of plants and their applications in potion-making and healing.",
                icon: Sparkles,
                specialty: "Natural Magic",
              },
              {
                name: "Filius Flitwick",
                subject: "Charms",
                description: "Master the art of charms and enchantments that make everyday magic possible.",
                icon: BookOpen,
                specialty: "Practical Charms",
              },
            ].map((professor, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-card border-border"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors">
                    <professor.icon className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-serif text-xl text-card-foreground">{professor.name}</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">{professor.subject}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-card-foreground mb-4 text-pretty">{professor.description}</p>
                  <Badge variant="secondary" className="mb-4">
                    {professor.specialty}
                  </Badge>
                  <Button className="w-full group-hover:glow-effect">
                    <Users className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
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
              Magical Learning Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Experience the most advanced AI-powered educational platform designed for magical learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Wand2,
                title: "Personalized Teaching",
                description: "Each professor adapts their teaching style to your learning preferences and pace",
              },
              {
                icon: BookOpen,
                title: "Comprehensive Curriculum",
                description: "Access to all Hogwarts subjects with detailed explanations and practical applications",
              },
              {
                icon: Sparkles,
                title: "Interactive Spells",
                description: "Practice magic through interactive simulations and guided spell-casting sessions",
              },
              {
                icon: Users,
                title: "Study Groups",
                description: "Join other students in magical study sessions and collaborative learning experiences",
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
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Student Testimonials</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Hear from students who have transformed their magical education through our AI professors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emma Granger",
                house: "Gryffindor",
                quote:
                  "Professor Snape's AI helped me master advanced potion-making techniques I never thought possible. The personalized feedback is incredible!",
                subject: "Potions",
              },
              {
                name: "Neville Longbottom",
                house: "Gryffindor",
                quote:
                  "Professor Sprout's guidance in Herbology has been transformative. I finally understand the magical properties of every plant in the greenhouse.",
                subject: "Herbology",
              },
              {
                name: "Luna Lovegood",
                house: "Ravenclaw",
                quote:
                  "Dumbledore's wisdom sessions have given me perspectives on magic and life that I carry with me every day. Truly enlightening!",
                subject: "Philosophy",
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
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Magical Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Select the perfect plan for your magical education journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "First Year",
                price: "$29",
                period: "/month",
                description: "Perfect for beginning your magical education",
                features: ["Access to 3 professors", "Basic spell tutorials", "Study group access", "Email support"],
                popular: false,
              },
              {
                name: "Advanced Student",
                price: "$59",
                period: "/month",
                description: "For serious magical practitioners",
                features: [
                  "Access to all professors",
                  "Advanced spell simulations",
                  "Personalized learning paths",
                  "Priority support",
                  "Exclusive masterclasses",
                ],
                popular: true,
              },
              {
                name: "Master Wizard",
                price: "$99",
                period: "/month",
                description: "Ultimate magical education experience",
                features: [
                  "Everything in Advanced",
                  "One-on-one professor sessions",
                  "Custom spell creation",
                  "Research collaboration",
                  "Lifetime access to materials",
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
                  <Button
                    className={`w-full ${plan.popular ? "glow-effect" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Start {plan.name} Plan
                  </Button>
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
              Your Magical Education Awaits
            </h2>
            <p className="text-xl mb-8 text-white/90 text-pretty leading-relaxed">
              Join thousands of students who have discovered the magic of learning with Hogwarts' greatest professors.
              Begin your journey into the world of advanced magical education today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 glow-effect">
                <Wand2 className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
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
                <span className="font-serif text-xl font-bold">Hogwarts AI</span>
              </div>
              <p className="text-primary-foreground/80 text-pretty">
                Bringing the magic of Hogwarts education to the digital age through advanced AI technology.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Subjects</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Potions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Transfiguration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Defense Against Dark Arts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Herbology
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Spell Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Study Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Practice Tests
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
            <p className="text-primary-foreground/60">© 2024 Hogwarts AI. All rights reserved. Magic responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
