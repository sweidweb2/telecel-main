"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MarketingPageCopy } from "@/types/marketing-page";

type FaqTabsSectionProps = {
  copy: MarketingPageCopy;
};

function FaqAccordion({
  tabId,
  items,
}: {
  tabId: string;
  items: { title: string; description: string }[];
}) {
  return (
    <Accordion className="flex flex-col gap-2">
      {items.map((item, index) => (
        <AccordionItem
          key={item.title}
          value={`${tabId}-${index}`}
          className="overflow-hidden rounded-lg border bg-card px-3"
        >
          <AccordionTrigger className="min-h-9 py-2.5 text-sm hover:no-underline sm:min-h-10 sm:py-3">
            <span className="min-w-0 flex-1 pr-2 text-left font-medium leading-snug">
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-2.5 sm:pb-3">
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {item.description}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FaqTabsSection({ copy }: FaqTabsSectionProps) {
  const tabs = copy.tabs ?? [];
  const defaultTab = tabs[0]?.id ?? "programme";

  if (tabs.length === 0) return null;

  return (
    <Tabs defaultValue={defaultTab} className="min-w-0 w-full">
      <TabsList
        variant="line"
        className="h-auto min-h-9 w-full justify-start overflow-x-auto rounded-none p-0"
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="min-h-9 shrink-0 px-2.5 text-sm sm:px-3"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4 sm:mt-5">
          <FaqAccordion tabId={tab.id} items={tab.items} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
