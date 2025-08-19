// utils/pdfGenerator.ts
import { AnalysisPDFDocument } from '@/components/pdf/analysis-pdf-document';
import { PlayerComparisonPDFDocument } from '@/components/pdf/player-comparision-pdf-document';
import { TournamentRecommendationsPDFDocument } from '@/components/pdf/tournaments-recommendation-pdf-document';

import { pdf } from '@react-pdf/renderer';

export interface AnalysisData {
  success: boolean;
  analysis: any;
  analysisType: string;
  timestamp: string;
}

export interface PDFGenerationOptions {
  userId: string;
  analysisType: string;
  analysisLabel: string;
  data: AnalysisData;
  metadata?: Record<string, any>;
}

export interface CombinedPDFOptions {
  userId: string;
  analyses: Record<string, AnalysisData>;
  analysisTypes: Array<{
    id: string;
    label: string;
    icon: any;
    description: string;
    color: string;
  }>;
}

export interface PlayerComparisonPDFOptions {
  userId: string;
  comparisonPlayer: {
    IMISID: string;
    id: number;
    FullPlayerName: string;
    fullDetails: string;
    playername: string;
    mainAffiliation: string;
    country: string;
    state: string | null;
    AdultJunior: string;
    rating: number | null;
    Gender: string;
    fname: string;
    lname: string;
    city: string;
    ProfilePictureUrl: string | null;
  };
  comparisonAnalysis: {
    comparisonSummary: string;
    currentUserAnalysis: {
      strengths: string[];
      weaknesses: string[];
      playingStyle: string;
    };
    comparisonPlayerAnalysis: {
      strengths: string[];
      weaknesses: string[];
      playingStyle: string;
    };
    headToHeadAnalysis: {
      exists: boolean;
      record: string;
      insights: string;
      keyTacticsObserved: string[];
    };
    strategicRecommendations: string[];
    keyTakeaways: string[];
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TournamentRecommendationsPDFOptions {
  userId: string;
  recommendations: {
    currentAnalysis: {
      currentRanking: number;
      currentTotalPoints: number;
      currentExposures: number;
      currentAveragedPoints: number;
      targetRanking: number;
      targetPlayerName: string;
      targetPlayerAveragedPoints: number;
      averagedPointsGap: number;
      divisionName: string;
    };
    tournamentSequence: Array<{
      sequenceNumber: number;
      tournament: {
        TournamentID: number;
        TournamentName: string;
        StartDate: string;
        EndDate: string;
        SiteCity?: string;
        State?: string;
        EventType?: string;
        regularFee?: {
          price: number;
        };
        RankingPoints?: number;
        ClubLockerUrl?: string;
        URL?: string;
      };
      strategy: {
        requiredFinishPosition: number;
        estimatedDivisionEntrants: number;
        tournamentType: "JCT" | "Gold" | "Silver" | "Bronze";
        pointsFromFinish: number;
        reasoning: string;
      };
      pointsProgression: {
        pointsEarned: number;
        newTotalPoints: number;
        newExposures: number;
        newDivisor: number;
        newAveragedPoints: number;
        averagedPointsProgress: string;
        remainingGap: number;
      };
    }>;
    summary: {
      totalTournaments: number;
      totalPointsToEarn: number;
      finalProjectedAveragedPoints: number;
      targetPlayerToSurpass: string;
      projectedFinalRanking: number;
      timelineMonths: number;
      successProbability: "high" | "medium" | "low";
    };
  };
  userGoal: {
    type: string;
    description: string;
    timeframe: string;
    targetRanking?: number;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Generate a PDF for a single analysis
 */
export async function generateSingleAnalysisPDF(options: PDFGenerationOptions): Promise<Blob> {
  const { userId, analysisType, analysisLabel, data, metadata = {} } = options;
  
  const pdfMetadata = {
    title: `${analysisLabel} - User ${userId}`,
    author: 'AI Analysis System',
    subject: `${analysisLabel} Report`,
    creator: 'Squash Analysis App',
    producer: 'React-PDF',
    creationDate: new Date(),
    modificationDate: new Date(),
    ...metadata
  };

  const doc = AnalysisPDFDocument({
    userId,
    analysisType,
    analysisLabel,
    data: data.analysis,
    timestamp: data.timestamp,
    metadata: pdfMetadata,
    isCombined: false
  });

  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Generate a combined PDF for multiple analyses
 */
export async function generateCombinedAnalysisPDF(options: CombinedPDFOptions): Promise<Blob> {
  const { userId, analyses, analysisTypes } = options;
  
  const completedAnalyses = Object.keys(analyses).filter(key => analyses[key]);
  
  const pdfMetadata = {
    title: `Complete Analysis Report - User ${userId}`,
    author: 'AI Analysis System',
    subject: 'Complete Squash Analysis Report',
    creator: 'Squash Analysis App',
    producer: 'React-PDF',
    creationDate: new Date(),
    modificationDate: new Date(),
    keywords: completedAnalyses.join(', ')
  };

  const combinedData = completedAnalyses.map(analysisType => ({
    analysisType,
    analysisLabel: analysisTypes.find(t => t.id === analysisType)?.label || analysisType,
    data: analyses[analysisType].analysis,
    timestamp: analyses[analysisType].timestamp
  }));

  const doc = AnalysisPDFDocument({
    userId,
    analysisType: 'combined',
    analysisLabel: 'Complete Analysis Report',
    data: combinedData,
    timestamp: new Date().toISOString(),
    metadata: pdfMetadata,
    isCombined: true
  });

  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Generate a PDF for player comparison analysis
 */
export async function generatePlayerComparisonPDF(options: PlayerComparisonPDFOptions): Promise<Blob> {
  const { userId, comparisonPlayer, comparisonAnalysis, timestamp, metadata = {} } = options;
  
  const pdfMetadata = {
    title: `Player Comparison: ${comparisonPlayer.fname} ${comparisonPlayer.lname} - User ${userId}`,
    author: 'AI Analysis System',
    subject: `Player Comparison Analysis Report`,
    creator: 'Squash Analysis App',
    producer: 'React-PDF',
    creationDate: new Date(),
    modificationDate: new Date(),
    keywords: `player comparison, squash, analysis, ${comparisonPlayer.fname} ${comparisonPlayer.lname}`,
    ...metadata
  };

  const doc = PlayerComparisonPDFDocument({
    userId,
    comparisonPlayer,
    comparisonAnalysis,
    timestamp,
    metadata: pdfMetadata
  });

  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Generate a PDF for tournament recommendations
 */
export async function generateTournamentRecommendationsPDF(options: TournamentRecommendationsPDFOptions): Promise<Blob> {
  const { userId, recommendations, userGoal, timestamp, metadata = {} } = options;
  
  const pdfMetadata = {
    title: `Tournament Strategy Plan - User ${userId}`,
    author: 'AI Tournament Strategy System',
    subject: `Tournament Recommendations Report`,
    creator: 'Squash Analysis App',
    producer: 'React-PDF',
    creationDate: new Date(),
    modificationDate: new Date(),
    keywords: `tournament strategy, squash, ranking, ${userGoal.type}, target ranking ${userGoal.targetRanking}`,
    ...metadata
  };

  const doc = TournamentRecommendationsPDFDocument({
    userId,
    recommendations,
    userGoal,
    timestamp,
    metadata: pdfMetadata
  });

  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Download a blob as a PDF file
 */
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for PDF
 */
export function generatePDFFilename(userId: string, analysisType: string, isCombined: boolean = false): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (isCombined) {
    return `complete-analysis-user-${userId}-${timestamp}.pdf`;
  }
  
  return `${analysisType}-analysis-user-${userId}-${timestamp}.pdf`;
}

/**
 * Generate filename for player comparison PDF
 */
export function generateComparisonPDFFilename(userId: string, playerFirstName: string, playerLastName: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const playerName = `${playerFirstName}-${playerLastName}`.toLowerCase().replace(/\s+/g, '-');
  
  return `player-comparison-${playerName}-user-${userId}-${timestamp}.pdf`;
}

/**
 * Generate filename for tournament recommendations PDF
 */
export function generateTournamentRecommendationsPDFFilename(userId: string, targetRanking?: number): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const goalSuffix = targetRanking ? `-target-rank-${targetRanking}` : '';
  
  return `tournament-strategy-plan-user-${userId}${goalSuffix}-${timestamp}.pdf`;
}