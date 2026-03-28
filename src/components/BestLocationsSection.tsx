import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, DollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnimatedCountyText } from "./AnimatedCountyText";

// Import images
import apartmentWestlands from "@/assets/apartment-westlands.jpg";
import apartmentKilimani from "@/assets/apartment-kilimani.jpg";
import apartmentParklands from "@/assets/apartment-parklands.jpg";
import bungalowKaren from "@/assets/bungalow-karen.jpg";
import houseRunda from "@/assets/house-runda.jpg";
import villaLavington from "@/assets/villa-lavington.jpg";
import hotelCBD from "@/assets/hotel-cbd-nairobi.jpg";
import hotelGigiri from "@/assets/hotel-gigiri.jpg";
import apartmentRiverside from "@/assets/apartment-riverside.jpg";
import houseSyokimau from "@/assets/house-syokimau.jpg";
import houseKiambu from "@/assets/house-kiambu.jpg";
import houseThikaRoad from "@/assets/house-thika-road.jpg";

interface Location {
  id: string;
  name: string;
  averagePrice: string;
  growth: string;
  properties: number;
  description: string;
  image: string;
}

const locationData = {
  rent: [
    {
      id: "1",
      name: "Section 58",
      averagePrice: "KSh 25,000/month",
      growth: "+10%",
      properties: 156,
      description: "Major mid-income neighborhood near town",
      image: apartmentKilimani
    },
    {
      id: "2",
      name: "Naka Estate",
      averagePrice: "KSh 35,000/month",
      growth: "+15%",
      properties: 89,
      description: "Central and well-known residential hood",
      image: apartmentWestlands
    },
    {
      id: "3",
      name: "Free Area",
      averagePrice: "KSh 15,000/month",
      growth: "+8%",
      properties: 134,
      description: "Popular rental zone along the highway",
      image: apartmentParklands
    },
    {
      id: "13",
      name: "Githima",
      averagePrice: "KSh 20,000/month",
      growth: "+12%",
      properties: 78,
      description: "Quiet residential area with good connectivity",
      image: apartmentKilimani
    },
    {
      id: "14",
      name: "Kenyatta Ave",
      averagePrice: "KSh 40,000/month",
      growth: "+9%",
      properties: 45,
      description: "Premium location along the main avenue",
      image: apartmentWestlands
    }
  ],
  sell: [
    {
      id: "4",
      name: "Kiamunyi",
      averagePrice: "KSh 12M",
      growth: "+18%",
      properties: 67,
      description: "Large, growing residential area",
      image: bungalowKaren
    },
    {
      id: "5",
      name: "Milimani",
      averagePrice: "KSh 25M",
      growth: "+12%",
      properties: 43,
      description: "Established upscale estate",
      image: villaLavington
    },
    {
      id: "6",
      name: "Lanet",
      averagePrice: "KSh 8M",
      growth: "+20%",
      properties: 78,
      description: "Big residential and development zone",
      image: houseRunda
    },
    {
      id: "15",
      name: "Ngata",
      averagePrice: "KSh 6.5M",
      growth: "+16%",
      properties: 52,
      description: "Emerging suburb with modern developments",
      image: villaLavington
    },
    {
      id: "16",
      name: "Kiburegon",
      averagePrice: "KSh 4.2M",
      growth: "+14%",
      properties: 91,
      description: "Affordable area close to town center",
      image: bungalowKaren
    }
  ],
  shortStay: [
    {
      id: "7",
      name: "Nakuru CBD",
      averagePrice: "KSh 4,500/night",
      growth: "+25%",
      properties: 92,
      description: "Central location for business travelers",
      image: hotelCBD
    },
    {
      id: "8",
      name: "Milimani Suites",
      averagePrice: "KSh 8,000/night",
      growth: "+30%",
      properties: 34,
      description: "Luxury stays in a serene environment",
      image: hotelGigiri
    },
    {
      id: "9",
      name: "Naka Airbnbs",
      averagePrice: "KSh 5,000/night",
      growth: "+14%",
      properties: 56,
      description: "Cozy homes near recreational spots",
      image: apartmentRiverside
    },
    {
      id: "17",
      name: "Lake View Area",
      averagePrice: "KSh 6,500/night",
      growth: "+22%",
      properties: 28,
      description: "Scenic views near Lake Nakuru",
      image: hotelGigiri
    },
    {
      id: "18",
      name: "Westside Retreat",
      averagePrice: "KSh 3,500/night",
      growth: "+18%",
      properties: 67,
      description: "Budget-friendly stays for tourists",
      image: hotelCBD
    }
  ],
  buy: [
    {
      id: "10",
      name: "Njoro",
      averagePrice: "KSh 1.5M/acre",
      growth: "+22%",
      properties: 187,
      description: "Agricultural town with many land parcels",
      image: houseSyokimau
    },
    {
      id: "11",
      name: "Rongai",
      averagePrice: "KSh 900k/plot",
      growth: "+24%",
      properties: 203,
      description: "Fast-growing peri-urban town",
      image: houseThikaRoad
    },
    {
      id: "12",
      name: "Bahati",
      averagePrice: "KSh 1.2M/plot",
      growth: "+32%",
      properties: 145,
      description: "Suburban transition area with great plots",
      image: houseKiambu
    },
    {
      id: "19",
      name: "Mwichuti",
      averagePrice: "KSh 800k/plot",
      growth: "+19%",
      properties: 112,
      description: "Developing area with great potential",
      image: houseThikaRoad
    },
    {
      id: "20",
      name: "Kasarani",
      averagePrice: "KSh 2.1M/plot",
      growth: "+26%",
      properties: 89,
      description: "Sports and recreation hub area",
      image: houseKiambu
    }
  ]
};

const categoryLabels = {
  rent: "Best for Rent",
  sell: "Best for Sale",
  shortStay: "Best for Short Stay",
  buy: "Best to Buy"
};

export function BestLocationsSection() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof locationData>("rent");
  const currentLocations = locationData[activeCategory];

  const LocationCard = ({ location, index }: { location: Location; index: number }) => (
    <Card
      className="group hover:shadow-lg transition-all duration-300 animate-fade-in border-border/50 overflow-hidden w-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={location.image}
          alt={`${location.name} property`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {location.growth}
          </span>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {location.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {location.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Average Price</span>
            <span className="text-lg font-bold text-foreground flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {location.averagePrice}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Available Properties</span>
            <span className="text-sm font-semibold text-foreground">
              {location.properties} listings
            </span>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((parseInt(location.growth.replace('%', '').replace('+', '')) * 3), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Market performance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Top Locations in <AnimatedCountyText />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover the most sought-after areas based on market trends and property performance
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() => setActiveCategory(key as keyof typeof locationData)}
                className="px-6 py-2"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {currentLocations.map((location, index) => (
                <CarouselItem key={location.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                  <LocationCard location={location} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}