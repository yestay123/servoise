"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AgentsPage() {
  const handleHireAgent = () => {
    // This would typically open a hire agent dialog
    // For now, we'll just log it
    console.log("Hire an Agent");
  };

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleHireAgent} className="gap-2">
          <Plus className="size-4" />
          Hire an Agent
        </Button>
      </div>
      <div className="container mx-auto py-8">
      </div>
    </>
  );
}
