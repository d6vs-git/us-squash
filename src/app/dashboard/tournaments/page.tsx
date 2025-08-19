
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { History } from "@/components/dashboard/tournaments/history";
import { TournamentList } from "@/components/dashboard/tournaments/tournament-list";

export default function TournamentsPage() {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <TournamentList />
      </TabsContent>
      <TabsContent value="history">
        <History />
      </TabsContent>
    </Tabs>
  );
}