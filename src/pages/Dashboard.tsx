import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockProperties } from "@/data/mockListings";
import { HeroAI } from "@/components/HeroAI";
import { BestAgentsSection } from "@/components/BestAgentsSection";
import { BestLocationsSection } from "@/components/BestLocationsSection";
import { BuyAbilitySection } from "@/components/BuyAbilitySection";
import { LandServicesSection } from "@/components/LandServicesSection";
import { NewsBlogSection } from "@/components/NewsBlogSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import { ListingCTAcard } from "@/components/ListingCTAcard";
import { TrendingUp, Wallet, Map, Loader2, Home } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { UserButton } from "@clerk/clerk-react";

// ... (other imports)

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [activeUseCase, setActiveUseCase] = useState("All");

  /* Use Query for properties */
  const { data: properties, isLoading } = useQuery({
    queryKey: ["dashboard-properties"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("agent_listings")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.warn("Supabase fetch error (falling back to mocks):", error);
          return mockProperties;
        }
        return [...(data || []), ...mockProperties];
      } catch (err) {
        console.warn("Supabase connection error (falling back to mocks):", err);
        return mockProperties;
      }
    },
  });

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    let filtered = properties;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.location.toLowerCase().includes(term) ||
          property.category.toLowerCase().includes(term) ||
          property.listing_type.toLowerCase().includes(term)
      );
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter((property) => property.listing_type === activeFilter);
    }

    if (activeType !== "all") {
      filtered = filtered.filter((property) => property.category === activeType);
    }

    // Filter by Use Case (Case-Insensitive)
    if (activeUseCase !== "All") {
      const lowerUseCase = activeUseCase.toLowerCase();
      filtered = filtered.filter(p => {
        const lowerTitle = p.title.toLowerCase();
        const lowerCat = (p.category || "").toLowerCase();

        if (activeUseCase === "Student Housing" && (p.price < 35000 || lowerTitle.includes("studio") || lowerTitle.includes("hostel"))) return true;
        if (activeUseCase === "Investment" && (p.price < 15000000 || lowerCat === 'land' || lowerTitle.includes('plot'))) return true;
        if (activeUseCase === "Mixed-Use" && (lowerCat === 'commercial' || lowerCat === 'land')) return true;
        if (activeUseCase === "Warehouses" && (lowerCat === 'commercial' || lowerTitle.includes("godown"))) return true;
        if (activeUseCase === "Co-working" && (lowerCat === 'commercial' || lowerTitle.includes("office"))) return true;
        return false;
      });
    }

    return filtered;
  }, [properties, searchTerm, activeFilter, activeType, activeUseCase]);

  const growthCount = filteredProperties.length;

  // Helpers
  const getIntentTags = (property: any) => {
    const tags = [];
    const lowerCat = (property.category || "").toLowerCase();
    if (property.price > 40000000) tags.push("Luxury Collection");
    if (property.price < 18000000 && lowerCat.includes('house')) tags.push("Best Value");
    if (property.listing_type === 'rent' && property.price < 50000) tags.push("Fast Moving");
    if (lowerCat.includes('land') && property.price < 5000000) tags.push("High ROI");
    return tags.splice(0, 2);
  };

  const getMicroData = (property: any) => {
    const data = [];
    const lowerCat = (property.category || "").toLowerCase();
    if (lowerCat.includes('land')) {
      data.push({ icon: Map, value: "Residential", label: "Zoning" });
      data.push({ icon: TrendingUp, value: "+12%", label: "Proj. ROI" });
    } else if (lowerCat.includes('house') || lowerCat.includes('apartment')) {
      data.push({ icon: Wallet, value: `KSh ${Math.floor(property.price / 240).toLocaleString()}`, label: "Est. Mortgage" });
      data.push({ icon: TrendingUp, value: "High Demand", label: "Area" });
    }
    return data;
  };

  const PropertyCardWrapper = ({ property, index }: { property: any; index: number }) => {
    const displayImage = property.image || (property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg");

    return (
      <div
        className="animate-scale-in w-full h-full"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <PropertyCard
          property={{
            id: property.id,
            title: property.title,
            price: `KSh ${property.price.toLocaleString()}`,
            location: property.location,
            image: displayImage,
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            sqm: property.land_size ? (typeof property.land_size === 'string' ? parseInt(property.land_size) : property.land_size) : 0,
            type: (property.listing_type === "sale" ? "For Sale" : property.listing_type === "rent" ? "For Rent" : "Short Stay") as "For Sale" | "For Rent",
            status: (property.listing_type === "sale" || property.listing_type === "rent" ? property.listing_type : "sale") as "sale" | "rent",
            isHighGrowth: false,
            propertyType: property.category as any
          }}
          intentTags={getIntentTags(property)}
          microData={getMicroData(property)}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 w-full">
      <div className="min-h-screen bg-background animate-fade-in">

        <HeroAI />

        <main id="property-listings" className="max-w-7xl mx-auto py-8 px-[20px]">
          <div className="space-y-8">
            {/* Filters */}
            <PropertyFilters
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              activeType={activeType}
              setActiveType={setActiveType}
              activeUseCase={activeUseCase}
              setActiveUseCase={setActiveUseCase}
              propertyCount={filteredProperties.length}
              growthCount={growthCount}
            />

            {/* Properties Carousel */}
            <div className="relative">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: false, // Changed to false so end is reachable for CTA
                    slidesToScroll: 1,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {filteredProperties.map((property, index) => (
                      <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-full">
                        <PropertyCardWrapper property={property} index={index} />
                      </CarouselItem>
                    ))}

                    {/* View More CTA Card at the end of Carousel */}
                    <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-full">
                      <div className="h-full min-h-[400px]">
                        <ListingCTAcard
                          onViewMore={() => setActiveUseCase("All")}
                          context={activeType !== 'all' ? activeType : 'properties'}
                        />
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
                  <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
                </Carousel>
              )}
            </div>

            {/* No Results */}
            {!isLoading && filteredProperties.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters to find more properties.
                </p>
              </div>
            )}
          </div>
        </main>

        <BestAgentsSection />
        <BestLocationsSection />
        <BuyAbilitySection />
        <LandServicesSection />
        <FAQSection />
        <NewsBlogSection />
        <Footer />

      </div>
    </div>
  );
}