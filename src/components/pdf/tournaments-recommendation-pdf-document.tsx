import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#4b5563',
  },
  analysisGrid: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15,
  },
  analysisColumn: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    textAlign: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statBox: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  gapAnalysis: {
    backgroundColor: '#fef3c7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  gapTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10,
  },
  gapGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  gapItem: {
    textAlign: 'center',
  },
  gapValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d97706',
    marginBottom: 2,
  },
  gapLabel: {
    fontSize: 9,
    color: '#92400e',
  },
  tournamentCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tournamentHeader: {
    backgroundColor: '#3b82f6',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tournamentNumber: {
    backgroundColor: '#ffffff',
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 6,
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginLeft: 10,
  },
  tournamentType: {
    backgroundColor: '#ffffff',
    color: '#3b82f6',
    fontSize: 10,
    fontWeight: 'bold',
    padding: 4,
    borderRadius: 4,
  },
  tournamentContent: {
    padding: 15,
  },
  tournamentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 8,
  },
  strategySection: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  strategyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  strategyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  strategyItem: {
    textAlign: 'center',
    flex: 1,
  },
  strategyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  strategyLabel: {
    fontSize: 8,
    color: '#3730a3',
  },
  reasoningText: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.4,
  },
  progressSection: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressItem: {
    textAlign: 'center',
    flex: 1,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 8,
    color: '#047857',
  },
  progressUpdate: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  progressUpdateText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
  },
  summarySection: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    marginTop: 30,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  successProbability: {
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  successLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  successValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  highSuccess: {
    color: '#10b981',
  },
  mediumSuccess: {
    color: '#f59e0b',
  },
  lowSuccess: {
    color: '#ef4444',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
    lineHeight: 1.4,
  },
});

interface Tournament {
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
}

interface TournamentSequenceItem {
  sequenceNumber: number;
  tournament: Tournament;
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
}

interface TournamentRecommendation {
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
  tournamentSequence: TournamentSequenceItem[];
  summary: {
    totalTournaments: number;
    totalPointsToEarn: number;
    finalProjectedAveragedPoints: number;
    targetPlayerToSurpass: string;
    projectedFinalRanking: number;
    timelineMonths: number;
    successProbability: "high" | "medium" | "low";
  };
}

interface TournamentRecommendationsPDFDocumentProps {
  userId: string;
  recommendations: TournamentRecommendation;
  userGoal: {
    type: string;
    description: string;
    timeframe: string;
    targetRanking?: number;
  };
  timestamp: string;
  metadata: Record<string, any>;
}

export const TournamentRecommendationsPDFDocument: React.FC<TournamentRecommendationsPDFDocumentProps> = ({
  userId,
  recommendations,
  userGoal,
  timestamp,
  metadata
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const getSuccessColor = (probability: string) => {
    switch (probability) {
      case "high":
        return styles.highSuccess;
      case "medium":
        return styles.mediumSuccess;
      case "low":
        return styles.lowSuccess;
      default:
        return { color: '#6b7280' };
    }
  };

  return (
    <Document>
      {/* Page 1: Introduction and Current Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Tournament Strategy Plan</Text>
          <Text style={styles.subtitle}>AI-Powered Tournament Recommendations</Text>
          <Text style={styles.subtitle}>Generated on {new Date(timestamp).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goal</Text>
          <Text style={styles.sectionContent}>
            Goal Type: {userGoal.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}{'\n'}
            Target Ranking: #{userGoal.targetRanking}{'\n'}
            Timeframe: {userGoal.timeframe.replace(/-/g, ' ')}{'\n'}
            {userGoal.description && `Additional Notes: ${userGoal.description}`}
          </Text>
        </View>

        <View style={styles.analysisGrid}>
          <View style={styles.analysisColumn}>
            <Text style={styles.columnTitle}>Your Current Position</Text>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>#{recommendations.currentAnalysis.currentRanking}</Text>
              <Text style={styles.statLabel}>Current Ranking</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{recommendations.currentAnalysis.currentAveragedPoints}</Text>
              <Text style={styles.statLabel}>Averaged Points</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{recommendations.currentAnalysis.currentTotalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{recommendations.currentAnalysis.currentExposures}</Text>
              <Text style={styles.statLabel}>Exposures</Text>
            </View>
          </View>

          <View style={styles.analysisColumn}>
            <Text style={styles.columnTitle}>Target Player</Text>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>#{recommendations.currentAnalysis.targetRanking}</Text>
              <Text style={styles.statLabel}>Target Ranking</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{recommendations.currentAnalysis.targetPlayerAveragedPoints}</Text>
              <Text style={styles.statLabel}>Their Averaged Points</Text>
            </View>
            
            <Text style={[styles.sectionContent, { textAlign: 'center', marginTop: 10 }]}>
              Player: {recommendations.currentAnalysis.targetPlayerName}{'\n'}
              Division: {recommendations.currentAnalysis.divisionName}
            </Text>
          </View>
        </View>

        <View style={styles.gapAnalysis}>
          <Text style={styles.gapTitle}>Gap Analysis</Text>
          <View style={styles.gapGrid}>
            <View style={styles.gapItem}>
              <Text style={styles.gapValue}>+{recommendations.currentAnalysis.averagedPointsGap}</Text>
              <Text style={styles.gapLabel}>Points Gap to Close</Text>
            </View>
            <View style={styles.gapItem}>
              <Text style={styles.gapValue}>{recommendations.summary.timelineMonths}mo</Text>
              <Text style={styles.gapLabel}>Projected Timeline</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategy Overview</Text>
          <Text style={styles.sectionContent}>
            This strategic tournament plan has been designed to help you achieve your ranking goal of 
            #{userGoal.targetRanking} by systematically targeting tournaments that will maximize your 
            averaged points progression. The plan includes {recommendations.summary.totalTournaments} carefully 
            selected tournaments over {recommendations.summary.timelineMonths} months, with a projected 
            success probability of {recommendations.summary.successProbability}.
          </Text>
        </View>
      </Page>

      {/* Tournament Sequence Pages */}
      {recommendations.tournamentSequence.map((item, index) => {
        const tournament = item.tournament;
        const location = tournament.SiteCity && tournament.State 
          ? `${tournament.SiteCity}, ${tournament.State}` 
          : tournament.SiteCity || tournament.State || "Location TBD";
        const entryFee = tournament.regularFee?.price ? `$${tournament.regularFee.price}` : "N/A";
        
        return (
          <Page key={item.sequenceNumber} size="A4" style={styles.page}>
            <View style={styles.tournamentCard}>
              <View style={styles.tournamentHeader}>
                <Text style={styles.tournamentNumber}>{item.sequenceNumber}</Text>
                <Text style={styles.tournamentName}>{tournament.TournamentName}</Text>
                <Text style={styles.tournamentType}>{item.strategy.tournamentType}</Text>
              </View>
              
              <View style={styles.tournamentContent}>
                <View style={styles.tournamentInfo}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>LOCATION</Text>
                    <Text style={styles.infoValue}>{location}</Text>
                    
                    <Text style={styles.infoLabel}>START DATE</Text>
                    <Text style={styles.infoValue}>{formatDate(tournament.StartDate)}</Text>
                    
                    <Text style={styles.infoLabel}>END DATE</Text>
                    <Text style={styles.infoValue}>{formatDate(tournament.EndDate)}</Text>
                  </View>
                  
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>ENTRY FEE</Text>
                    <Text style={styles.infoValue}>{entryFee}</Text>
                    
                    <Text style={styles.infoLabel}>EVENT TYPE</Text>
                    <Text style={styles.infoValue}>{tournament.EventType || "N/A"}</Text>
                    
                    <Text style={styles.infoLabel}>RANKING POINTS</Text>
                    <Text style={styles.infoValue}>{tournament.RankingPoints || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.strategySection}>
                  <Text style={styles.strategyTitle}>Tournament Strategy</Text>
                  <View style={styles.strategyGrid}>
                    <View style={styles.strategyItem}>
                      <Text style={styles.strategyValue}>#{item.strategy.requiredFinishPosition}</Text>
                      <Text style={styles.strategyLabel}>Required Finish</Text>
                    </View>
                    <View style={styles.strategyItem}>
                      <Text style={styles.strategyValue}>{item.strategy.pointsFromFinish}</Text>
                      <Text style={styles.strategyLabel}>Points Available</Text>
                    </View>
                    <View style={styles.strategyItem}>
                      <Text style={styles.strategyValue}>{item.strategy.estimatedDivisionEntrants}</Text>
                      <Text style={styles.strategyLabel}>Est. Entrants</Text>
                    </View>
                  </View>
                  <Text style={styles.reasoningText}>{item.strategy.reasoning}</Text>
                </View>

                <View style={styles.progressSection}>
                  <Text style={styles.progressTitle}>Points Progression</Text>
                  <View style={styles.progressGrid}>
                    <View style={styles.progressItem}>
                      <Text style={styles.progressValue}>+{Math.round(item.pointsProgression.pointsEarned)}</Text>
                      <Text style={styles.progressLabel}>Points Earned</Text>
                    </View>
                    <View style={styles.progressItem}>
                      <Text style={styles.progressValue}>{Math.round(item.pointsProgression.newTotalPoints)}</Text>
                      <Text style={styles.progressLabel}>New Total</Text>
                    </View>
                    <View style={styles.progressItem}>
                      <Text style={styles.progressValue}>{item.pointsProgression.newExposures}</Text>
                      <Text style={styles.progressLabel}>New Exposures</Text>
                    </View>
                    <View style={styles.progressItem}>
                      <Text style={styles.progressValue}>{Math.round(item.pointsProgression.newAveragedPoints)}</Text>
                      <Text style={styles.progressLabel}>New Avg Points</Text>
                    </View>
                  </View>
                  
                  <View style={styles.progressUpdate}>
                    <Text style={styles.progressUpdateText}>
                      Progress Update: {item.pointsProgression.averagedPointsProgress}
                      {item.pointsProgression.remainingGap > 0 
                        ? `\n${Math.round(item.pointsProgression.remainingGap)} points remaining to reach target.`
                        : '\nCongratulations! Target ranking achieved with this tournament.'}
                    </Text>
                  </View>
                </View>

                {tournament.ClubLockerUrl && (
                  <View style={{ marginTop: 15 }}>
                    <Text style={styles.infoLabel}>REGISTRATION</Text>
                    <Text style={[styles.infoValue, { color: '#3b82f6' }]}>
                      {tournament.ClubLockerUrl}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Page>
        );
      })}

      {/* Final Summary Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Plan Summary & Next Steps</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Tournament Plan Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{recommendations.summary.totalTournaments}</Text>
              <Text style={styles.summaryLabel}>Total Tournaments</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>+{recommendations.summary.totalPointsToEarn}</Text>
              <Text style={styles.summaryLabel}>Points to Earn</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{recommendations.summary.finalProjectedAveragedPoints}</Text>
              <Text style={styles.summaryLabel}>Final Avg Points</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>#{recommendations.summary.projectedFinalRanking}</Text>
              <Text style={styles.summaryLabel}>Projected Ranking</Text>
            </View>
          </View>

          <View style={styles.successProbability}>
            <Text style={styles.successLabel}>Success Probability</Text>
            <Text style={[styles.successValue, getSuccessColor(recommendations.summary.successProbability)]}>
              {recommendations.summary.successProbability.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Success Factors</Text>
          <Text style={styles.sectionContent}>
            • Consistent performance at the required finish positions{'\n'}
            • Early registration to secure spots in competitive tournaments{'\n'}
            • Proper preparation and training leading up to each event{'\n'}
            • Strategic tournament selection based on field strength{'\n'}
            • Maintaining physical and mental fitness throughout the campaign
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Considerations</Text>
          <Text style={styles.sectionContent}>
            This plan is based on current rankings and historical tournament data. Actual results 
            may vary depending on various factors including:
            {'\n\n'}
            • Changes in tournament fields and competition levels{'\n'}
            • Your performance and consistency in tournaments{'\n'}
            • Other players' participation and results{'\n'}
            • Tournament scheduling changes or cancellations{'\n'}
            • Ranking system updates or modifications
            {'\n\n'}
            Regular monitoring and plan adjustments are recommended as you progress through 
            the tournament sequence.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text style={styles.sectionContent}>
            1. Review the tournament sequence and mark important dates on your calendar{'\n'}
            2. Begin early registration for tournaments as entry periods open{'\n'}
            3. Develop a training schedule that peaks for each target tournament{'\n'}
            4. Monitor your progress after each tournament and adjust the plan if needed{'\n'}
            5. Stay updated on any tournament schedule changes or new opportunities
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by: AI Tournament Strategy System{'\n'}
            Report Date: {new Date(timestamp).toLocaleDateString()}{'\n'}
            Target Player: {recommendations.summary.targetPlayerToSurpass}{'\n'}
            Division: {recommendations.currentAnalysis.divisionName}{'\n'}
            Plan Duration: {recommendations.summary.timelineMonths} months
          </Text>
        </View>
      </Page>
    </Document>
  );
};