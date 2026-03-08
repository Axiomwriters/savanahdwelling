import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "/Savanahdwell.png";

export const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Gradient background with blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* Brand Section */}
          <div className="space-y-4">
            <img src={logo} alt="Savanah Dwelling" className="h-16" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner in finding the perfect home. Making real estate dreams come true across Kenya.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Buy Property
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Rent Property
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                List Property
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Find Agents
              </a>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Resources</h4>
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                About Us
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Blog & News
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Terms of Service
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Get in Touch</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Nairobi, Kenya
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  +254 123 456 789
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  hello@savannahdwelling.ke
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Savanah Dwelling. All rights reserved.
          </p>

          {/* Social Icons with Glassmorphism */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-background/30 backdrop-blur-md border border-border/40 hover:bg-primary/20 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-primary" />
            </a>
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-background/30 backdrop-blur-md border border-border/40 hover:bg-primary/20 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-primary" />
            </a>
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-background/30 backdrop-blur-md border border-border/40 hover:bg-primary/20 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-primary" />
            </a>
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-background/30 backdrop-blur-md border border-border/40 hover:bg-primary/20 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-primary" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
