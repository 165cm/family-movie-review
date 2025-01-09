// src/app/components/ui/content-warnings-timeline/index.tsx
import { ContentWarning } from '@/types/movie';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";

export const ContentWarningsTimeline = ({ warnings }: { warnings: ContentWarning[] }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {warnings.map((warning) => (
        <AccordionItem key={warning.category} value={warning.category}>
          <AccordionTrigger className="text-lg font-medium">
            {warning.category}
            <span className="ml-2 px-2 py-1 text-sm rounded-full bg-gray-200">
              {warning.scenes.length}件
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {warning.scenes.map((scene, index) => (
                <div key={index} className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm font-mono">{scene.timestamp}</span>
                  <div>
                    <p className="text-sm">{scene.description}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      scene.severity === 'high' ? 'bg-red-100 text-red-800' :
                      scene.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {scene.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};