"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Loading from "../../ui/loading";

interface RatingHistoryData {
  RankingPeriod: string;
  RatingGroup: string;
  NewRating: number;
}

export const RatingsHistoryChart = ({ userId }: { userId?: string }) => {
  const [ratingsHistory, setRatingsHistory] = useState<RatingHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "3m" | "6m" | "1y" | "all"
  >("1y");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!userId) return;

    const fetchRatingsHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/user/ratings-history?userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch ratings history");
        const data = await response.json();
        const filteredData = (data || []).filter(
          (rating: RatingHistoryData) =>
            !rating.RatingGroup.toLowerCase().includes("double") &&
            !rating.RatingGroup.toLowerCase().includes("psra") &&
            (rating.RatingGroup.includes("Singles") ||
              rating.RatingGroup.includes("Universal"))
        );
        setRatingsHistory(filteredData);
      } catch (error) {
        setError("Failed to load ratings history");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatingsHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const filterDataByPeriod = (data: RatingHistoryData[]) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (selectedPeriod) {
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        return data;
    }

    return data.filter((item) => new Date(item.RankingPeriod) >= cutoffDate);
  };

  const processChartData = () => {
    const filteredData = filterDataByPeriod(ratingsHistory);
    const dataMap = new Map<string, { date: string; rating: number | null }>();

    filteredData.forEach((item) => {
      const date = item.RankingPeriod;
      if (!dataMap.has(date)) {
        dataMap.set(date, {
          date: formatDate(date),
          rating: null,
        });
      }
      const point = dataMap.get(date)!;
      if (
        item.RatingGroup.includes("Singles") ||
        item.RatingGroup.includes("Universal")
      ) {
        point.rating = item.NewRating;
      }
    });

    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((point) => ({
        ...point,
        rating: point.rating ?? null,
      }));
  };

  const calculateTrend = (data: { rating: number | null }[]) => {
    const validData = data
      .map((d) => d.rating)
      .filter((d) => d !== null) as number[];
    if (validData.length < 2) return { trend: "stable", change: 0 };

    const first = validData[0];
    const last = validData[validData.length - 1];
    const change = last - first;

    if (Math.abs(change) < 0.01) return { trend: "stable", change };
    return { trend: change > 0 ? "up" : "down", change };
  };

  const getPaginatedHistory = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ratingsHistory.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(ratingsHistory.length / itemsPerPage);
  const chartData = processChartData();
  const trend = calculateTrend(chartData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-3 border border-border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Rating: {payload[0].value?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
     <Loading/>
    );
  }

  if (error) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Couldn't load rating history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (ratingsHistory.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>No rating data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No ratings recorded yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Rating History</CardTitle>
            <CardDescription>Your US Squash rating progression</CardDescription>
          </div>
          <div className="flex gap-2">
            {(["3m", "6m", "1y", "all"] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === "all" ? "All Time" : period.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend Indicator */}
        <div className="flex justify-center">
          <div
            className={`flex items-center gap-4 p-4 rounded-lg ${
              trend.trend === "up"
                ? "bg-success/10"
                : trend.trend === "down"
                ? "bg-destructive/10"
                : "bg-muted"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                trend.trend === "up"
                  ? "text-success"
                  : trend.trend === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {trend.trend === "up" ? (
                <TrendingUp className="h-5 w-5" />
              ) : trend.trend === "down" ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Minus className="h-5 w-5" />
              )}
              <span className="font-medium">
                {trend.change > 0 ? "+" : ""}
                {trend.change.toFixed(2)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {trend.trend === "up"
                ? "Rating increased"
                : trend.trend === "down"
                ? "Rating decreased"
                : "Rating stable"}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 0.1", "dataMax + 0.1"]}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRating)"
                activeDot={{
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                  fill: "hsl(var(--primary))",
                  r: 5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* History Table */}
        <Tabs defaultValue="recent">
          <TabsList className="bg-muted">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="all">All History</TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">Rating</th>
                    <th className="text-right p-3">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {ratingsHistory.slice(0, 5).map((rating, i) => {
                    const prevRating = ratingsHistory[i + 1]?.NewRating;
                    const change = prevRating
                      ? rating.NewRating - prevRating
                      : 0;
                    return (
                      <tr key={i} className="border-t hover:bg-muted/50">
                        <td className="p-3 text-muted-foreground">
                          {formatDate(rating.RankingPeriod)}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {rating.RatingGroup.includes("Singles")
                              ? "Singles"
                              : "Universal"}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-medium">
                          {rating.NewRating.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          {change !== 0 && (
                            <span
                              className={`inline-flex items-center ${
                                change > 0 ? "text-success" : "text-destructive"
                              }`}
                            >
                              {change > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              {Math.abs(change).toFixed(2)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedHistory().map((rating, i) => (
                    <tr key={i} className="border-t hover:bg-muted/50">
                      <td className="p-3 text-muted-foreground">
                        {formatDate(rating.RankingPeriod)}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {rating.RatingGroup.includes("Singles")
                            ? "Singles"
                            : "Universal"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {rating.NewRating.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between p-3 border-t bg-muted">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
