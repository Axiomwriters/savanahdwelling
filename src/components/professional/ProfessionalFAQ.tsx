import { useState } from 'react';
import { ChevronDown, Building2, Home, HardHat, Users } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "For Agents",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        question: "How do I get started as an agent on Savanah?",
        answer: "Simply sign up as an agent, complete your profile verification, and you can immediately start listing properties and connecting with potential buyers and sellers."
      },
      {
        question: "What are the benefits of using the Savanah Intelligence Engine?",
        answer: "Our intelligence engine provides property valuations, tracks demand signals in real-time, and helps you prioritize serious buyers using intent scoring."
      },
      {
        question: "How do I track my performance and leads?",
        answer: "Access your professional dashboard to view analytics, track enquiries, monitor closing velocity, and manage your client relationships all in one place."
      },
      {
        question: "Is there a fee to join as an agent?",
        answer: "Savanah offers flexible pricing plans. Contact our team for detailed information on agent membership tiers and their features."
      }
    ]
  },
  {
    title: "For Hosts",
    icon: <Home className="w-5 h-5" />,
    items: [
      {
        question: "How do I list my property for short stays?",
        answer: "Sign up as a host, add your property details, upload high-quality photos, and set your availability. Our team will verify your listing within 48 hours."
      },
      {
        question: "How does the pricing work for short-stay rentals?",
        answer: "You set your own nightly rates. Savanah provides market insights to help you price competitively while maximizing your earnings."
      },
      {
        question: "What support do hosts receive?",
        answer: "Hosts get access to a dedicated dashboard, booking management tools, guest communication features, and 24/7 support for any issues."
      },
      {
        question: "Can I manage multiple properties?",
        answer: "Yes! Our host dashboard allows you to manage multiple listings, track performance across properties, and handle all bookings from a single account."
      }
    ]
  },
  {
    title: "For Professionals",
    icon: <HardHat className="w-5 h-5" />,
    items: [
      {
        question: "What professional categories can join Savanah?",
        answer: "We welcome architects, engineers, interior designers, property valuers, surveyors, and other real estate professionals who want to connect with clients."
      },
      {
        question: "How can professionals benefit from the platform?",
        answer: "Get connected with homeowners, developers, and agents seeking professional services. Build your portfolio, get reviews, and grow your client base."
      },
      {
        question: "Is there a verification process for professionals?",
        answer: "Yes, all professionals undergo a verification process including credential validation to ensure quality and trustworthiness for clients."
      },
      {
        question: "Can I showcase my past projects?",
        answer: "Absolutely! Your professional profile includes a portfolio section where you can showcase completed projects and receive client testimonials."
      }
    ]
  }
];

export function ProfessionalFAQ() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<{ category: string; index: number } | null>(null);

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  const toggleItem = (categoryTitle: string, index: number) => {
    const isSame = openItem?.category === categoryTitle && openItem?.index === index;
    setOpenItem(isSame ? null : { category: categoryTitle, index });
  };

  return (
    <section className="professional-faq-section">
      <div className="professional-faq-header">
        <h2 className="professional-faq-title">Frequently Asked Questions</h2>
        <p className="professional-faq-subtitle">
          Find answers about joining Savanah as an agent, host, or real estate professional
        </p>
      </div>
      
      <div className="professional-faq-categories">
        {faqData.map((category) => (
          <div key={category.title} className="professional-faq-category">
            <button
              className={`professional-faq-category-btn ${openCategory === category.title ? 'active' : ''}`}
              onClick={() => toggleCategory(category.title)}
            >
              <span className="professional-faq-category-icon">{category.icon}</span>
              <span className="professional-faq-category-title">{category.title}</span>
              <ChevronDown 
                className={`professional-faq-chevron ${openCategory === category.title ? 'open' : ''}`} 
              />
            </button>
            
            <div className={`professional-faq-items ${openCategory === category.title ? 'open' : ''}`}>
              {category.items.map((item, index) => (
                <div 
                  key={index} 
                  className={`professional-faq-item ${openItem?.category === category.title && openItem?.index === index ? 'open' : ''}`}
                >
                  <button
                    className="professional-faq-question"
                    onClick={() => toggleItem(category.title, index)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown className="professional-faq-item-chevron" />
                  </button>
                  <div className="professional-faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
