"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What protocols does Marz support?",
    answer:
      "Marz supports all major Xray protocols including VMess, VLESS, Trojan, Shadowsocks, and more. Our universal link support ensures compatibility with all major Xray-provider panels.",
  },
  {
    question: "How does pre-connect verification work?",
    answer:
      "Before you connect, Marz automatically pings and verifies server health in the background. This ensures every tap leads to a working tunnel, eliminating the frustration of failed connections.",
  },
  {
    question: "Can I use Marz with my existing infrastructure?",
    answer:
      "Yes! Marz is designed to work seamlessly with your existing Xray infrastructure. You don't need to change anything on your server side - simply connect users through Marz for a premium experience.",
  },
  {
    question: "Is there a limit on the number of connections?",
    answer:
      "Connection limits depend on your chosen plan. The Starter plan supports up to 100 users, Pro supports up to 1,000 users, and Enterprise offers unlimited users with dedicated infrastructure.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We offer tiered support based on your plan. Starter users have access to community support, Pro users get priority email support, and Enterprise customers receive 24/7 phone support with a dedicated account manager.",
  },
  {
    question: "How do the real-time alerts work?",
    answer:
      "Marz monitors your connection status and server health continuously. When issues are detected, users receive instant notifications with actionable solutions - whether it's switching servers or contacting support.",
  },
];

const AccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-border">
    <button
      type="button"
      className="flex w-full items-center justify-between py-5 text-left"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="text-base font-medium">{item.question}</span>
      <ChevronDownIcon
        className={cn(
          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
    <div
      className={cn(
        "grid transition-all duration-200 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <p className="pb-5 text-muted-foreground">{item.answer}</p>
      </div>
    </div>
  </div>
);

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium  mb-4">
          Frequently Asked Questions
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-center">
          Everything you need to know about Marz. Can't find what you're looking
          for? Reach out to our support team.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            item={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
};
