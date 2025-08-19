"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Brain,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  Zap,
  Download,
} from "lucide-react";
import { 
  generateSingleAnalysisPDF, 
  generateCombinedAnalysisPDF, 
  downloadPDF, 
  generatePDFFilename 
} from "@/utils/pdf-generator";

interface AIAnalysisProps {
  userId: number;
}

interface AnalysisResult {
  success: boolean;
  analysis: any;
  analysisType: string;
  timestamp: string;
}

export const AIAnalysis = ({ userId }: AIAnalysisProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [analyses, setAnalyses] = useState<Record<string, AnalysisResult>>({});
  const [pdfGenerating, setPdfGenerating] = useState<Record<string, boolean>>({});

  const analysisTypes = [
    {
      id: "performance",
      label: "Performance Analysis",
      icon: TrendingUp,
      description:
        "Uncover strengths, weaknesses, and trends in your recent match history to optimize your training and match strategy.",
      color: "bg-primary",
    },
    {
      id: "opponent",
      label: "Opponent Analysis",
      icon: Users,
      description:
        "Gain insights into your results against different opponents and playing styles to better prepare for future matches.",
      color: "bg-primary",
    },
    {
      id: "prediction",
      label: "Rating Prediction",
      icon: Target,
      description:
        "Forecast your future rating trajectory based on your current form, recent match outcomes, improvement patterns, and training progress.",
      color: "bg-primary",
    },
  ];

  const runAnalysis = async (analysisType: string) => {
    setLoading((prev) => ({ ...prev, [analysisType]: true }));
    try {
      const response = await fetch("/api/ai/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.toString(), analysisType }),
      });

      // --- PATCH: Handle triple-backtick-wrapped JSON responses ---
      let result: any;
      const text = await response.text();
      try {
        // Try parsing as JSON directly first
        result = JSON.parse(text);
      } catch (e) {
        // If failed, try to strip triple backticks and parse again
        const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
        try {
          result = JSON.parse(cleaned);
        } catch (err) {
          console.error("Failed to parse analysis response:", err, text);
          result = null;
        }
      }
      // --- END PATCH ---

      if (result && typeof result === "object") {
        // If result is already in {success, analysis, ...} format, use as is
        if ("success" in result && "analysis" in result) {
          setAnalyses((prev) => ({ ...prev, [analysisType]: result }));
        } else {
          // Otherwise, wrap it so the rest of your UI works
          setAnalyses((prev) => ({
            ...prev,
            [analysisType]: {
              success: true,
              analysis: result,
              analysisType,
              timestamp: new Date().toISOString(),
            },
          }));
        }
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [analysisType]: false }));
    }
  };

  const runAllAnalyses = async () => {
    for (const type of analysisTypes) {
      await runAnalysis(type.id);
    }
  };

  const exportToPDF = async (analysisType: string) => {
    const result = analyses[analysisType];
    if (!result) return;

    const analysisTypeData = analysisTypes.find(t => t.id === analysisType);
    if (!analysisTypeData) return;

    setPdfGenerating(prev => ({ ...prev, [analysisType]: true }));

    try {
      const blob = await generateSingleAnalysisPDF({
        userId: userId.toString(),
        analysisType,
        analysisLabel: analysisTypeData.label,
        data: result,
        metadata: {
          keywords: `${analysisType}, squash, analysis, performance`,
          subject: `${analysisTypeData.label} for User ${userId}`,
        }
      });

      const filename = generatePDFFilename(userId.toString(), analysisType);
      downloadPDF(blob, filename);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setPdfGenerating(prev => ({ ...prev, [analysisType]: false }));
    }
  };

  const exportAllToPDF = async () => {
    const completedAnalyses = Object.keys(analyses).filter(
      (key) => analyses[key]
    );

    if (completedAnalyses.length === 0) {
      alert("No completed analyses to export. Please run some analyses first.");
      return;
    }

    setPdfGenerating(prev => ({ ...prev, combined: true }));

    try {
      const blob = await generateCombinedAnalysisPDF({
        userId: userId.toString(),
        analyses,
        analysisTypes
      });

      const filename = generatePDFFilename(userId.toString(), 'combined', true);
      downloadPDF(blob, filename);
    } catch (error) {
      console.error("Failed to export combined PDF:", error);
      alert("Failed to export combined PDF. Please try again.");
    } finally {
      setPdfGenerating(prev => ({ ...prev, combined: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            AI-Powered Analysis
          </CardTitle>
          <CardDescription className="text-base max-w-2xl mx-auto">
            Get comprehensive insights about your squash performance with
            advanced AI analysis
          </CardDescription>
          <div className="pt-4 flex gap-3 justify-center">
            <Button
              onClick={runAllAnalyses}
              disabled={Object.values(loading).some(Boolean)}
            >
              {Object.values(loading).some(Boolean) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Complete Analysis
                </>
              )}
            </Button>

            {Object.keys(analyses).length > 0 && (
              <Button
                onClick={exportAllToPDF}
                variant="outline"
                disabled={pdfGenerating.combined}
              >
                {pdfGenerating.combined ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export All to PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          const result = analyses[type.id];
          const isLoading = loading[type.id];
          const isPdfGenerating = pdfGenerating[type.id];

          return (
            <Card
              key={type.id}
              className="group hover:shadow-lg transition-all duration-300 border-0"
            >
              <CardHeader className="pb-4 flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-2xl ${type.color} flex items-center justify-center mb-3`}
                >
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg font-semibold mb-1">
                  {type.label}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="text-center py-6">
                    <Button
                      onClick={() => runAnalysis(type.id)}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Icon className="h-4 w-4 mr-2" />
                          Generate Analysis
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {new Date(result.timestamp).toLocaleString()}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToPDF(type.id)}
                          disabled={isPdfGenerating}
                          className="h-8 px-3 text-xs"
                        >
                          {isPdfGenerating ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              PDF
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => runAnalysis(type.id)}
                          disabled={isLoading}
                          className="h-8 px-3 text-xs"
                        >
                          Refresh
                        </Button>
                      </div>
                    </div>
                    {renderAnalysisPreview(type.id, result.analysis)}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Results */}
      {Object.keys(analyses).length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-accent-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Detailed Analysis Results</h2>
          </div>

          {analysisTypes.map((type) => {
            const result = analyses[type.id];
            if (!result) return null;

            return (
              <Card key={`detailed-${type.id}`} className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center`}
                    >
                      <type.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {type.label} - Detailed Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderDetailedAnalysis(type.id, result.analysis)}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  function renderAnalysisPreview(type: string, analysis: any) {
    if (!analysis) return null;
    
    switch (type) {
      case "performance":
        return (
          <div className="space-y-3">
            {analysis.overallPerformance && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Performance Rating</span>
                <Badge variant="outline" className="font-bold">
                  {analysis.overallPerformance.rating}/10
                </Badge>
              </div>
            )}
            <div className="text-sm text-muted-foreground line-clamp-3">
              {analysis.overallPerformance?.explanation ||
                "Performance analysis completed"}
            </div>
          </div>
        );
      case "opponent":
        return (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground line-clamp-3">
              {analysis.playingStyle || "Opponent analysis completed"}
            </div>
            {analysis.opponentAnalysis && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(analysis.opponentAnalysis)
                  .slice(0, 2)
                  .map(([key, data]: [string, any]) => (
                    <div key={key} className="p-2 bg-muted rounded">
                      <div className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="text-muted-foreground">
                        {data?.winRate || "N/A"}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      case "prediction":
        return (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground line-clamp-3">
              {typeof analysis.currentTrajectory === "object"
                ? analysis.currentTrajectory?.analysis ||
                  analysis.currentTrajectory?.trend
                : analysis.currentTrajectory || "Rating prediction completed"}
            </div>
            {analysis.predictions && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(analysis.predictions)
                  .slice(0, 2)
                  .map(([period, data]: [string, any]) => (
                    <div key={period} className="p-2 bg-muted rounded">
                      <div className="font-medium capitalize">{period}</div>
                      <div className="text-muted-foreground">
                        Singles: {data.singlesRating || "Calculating..."}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Analysis completed successfully
          </div>
        );
    }
  }

  function renderDetailedAnalysis(type: string, analysis: any) {
    if (!analysis) return null;
    
    switch (type) {
      case "performance":
        return <PerformanceAnalysisView analysis={analysis} />;
      case "opponent":
        return <OpponentAnalysisView analysis={analysis} />;
      case "prediction":
        return <PredictionView analysis={analysis} />;
      default:
        return (
          <pre className="text-sm bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        );
    }
  }
}

function PerformanceAnalysisView({ analysis }: { analysis: any }) {
  if (!analysis) return null;
  
  return (
    <div className="space-y-6">
      {analysis.overallPerformance && (
        <Card className="border-0 bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">
                {analysis.overallPerformance.rating}
              </div>
              <div className="text-2xl text-muted-foreground">/10</div>
              <Badge variant="secondary" className="ml-auto">
                Performance Score
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {analysis.overallPerformance.explanation}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths?.map((strength: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.weaknesses?.map((weakness: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {analysis.recommendations && (
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex gap-3 p-4 bg-muted rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function OpponentAnalysisView({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {analysis.opponentAnalysis && (
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(analysis.opponentAnalysis).map(([category, data]: [string, any]) => (
            <Card key={category} className="border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm capitalize">
                  {category.replace(/([A-Z])/g, " $1").replace("vs", "vs ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold">
                    {data?.winRate || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {data?.totalMatches || 0} matches
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.insights || "Insufficient match data for detailed analysis"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Playing Style Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            {analysis.playingStyle || "No playing style analysis available"}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Mental Game
              </h4>
              {typeof analysis.mentalGame === "object" ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      {analysis.mentalGame?.assessment || "No assessment"}
                    </Badge>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {analysis.mentalGame?.evidence?.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {analysis.mentalGame || "No mental game analysis available"}
                </p>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Consistency
              </h4>
              {typeof analysis.consistency === "object" ? (
                <>
                  <Badge variant="outline" className="mb-2">
                    {analysis.consistency?.rating || "N/A"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {analysis.consistency?.explanation || ""}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {analysis.consistency || "No consistency analysis available"}
                </p>
              )}
            </div>
          </div>

          {analysis.upsetPotential && (
            <div className="p-4 bg-warning/10 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Upset Potential
              </h4>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-semibold">
                  {analysis.upsetPotential.rating || "N/A"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {analysis.upsetPotential.explanation || ""}
                </span>
              </div>
            </div>
          )}

          {analysis.tacticalRecommendations && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Tactical Recommendations
              </h4>
              <ul className="space-y-2">
                {analysis.tacticalRecommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PredictionView({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {analysis.currentTrajectory && (
        <Card className="border-0 bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Current Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {typeof analysis.currentTrajectory === "object"
                ? analysis.currentTrajectory.analysis ||
                  analysis.currentTrajectory.trend
                : analysis.currentTrajectory}
            </p>
          </CardContent>
        </Card>
      )}

      {analysis.predictions && (
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(analysis.predictions).map(([period, data]: [string, any]) => (
            <Card key={period} className="border-0">
              <CardHeader className="pb-3">
                <CardTitle className="capitalize text-lg">{period}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm font-medium">Singles:</span>
                    <span className="font-semibold">
                      {data.singlesRating || "Calculating..."}
                    </span>
                  </div>
                  <Badge
                    variant={
                      data.confidence === "high"
                        ? "default"
                        : data.confidence === "medium"
                        ? "secondary"
                        : "outline"
                    }
                    className="w-full justify-center"
                  >
                    {data.confidence || "medium"} confidence
                  </Badge>
                  {data.reasoning && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {data.reasoning}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {analysis.scenarios && (
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(analysis.scenarios).map(([scenario, data]: [string, any]) => (
                <div key={scenario} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold capitalize mb-2">{scenario}</h4>
                  <p className="text-sm text-muted-foreground">
                    {typeof data === "object"
                      ? (data as any).description
                      : String(data)}
                  </p>
                  {typeof data === "object" && data.requirements && (
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {data.requirements.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analysis.recommendations && (
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex gap-3 p-4 bg-muted rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}




