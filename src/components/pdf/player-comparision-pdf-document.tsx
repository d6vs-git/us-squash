import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  playerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  playerColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 4,
  },
  playerDetail: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#4b5563",
  },
  comparisonGrid: {
    flexDirection: "row",
    marginBottom: 20,
  },
  comparisonColumn: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  playingStyleBox: {
    backgroundColor: "#dbeafe",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  playingStyleLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 4,
  },
  playingStyleText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
  listContainer: {
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 5,
  },
  bullet: {
    width: 4,
    height: 4,
    backgroundColor: "#6b7280",
    borderRadius: 2,
    marginRight: 8,
    marginTop: 4,
  },
  strengthsBullet: {
    backgroundColor: "#10b981",
  },
  weaknessesBullet: {
    backgroundColor: "#ef4444",
  },
  listText: {
    flex: 1,
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  headToHeadSection: {
    backgroundColor: "#fef3c7",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  headToHeadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 15,
    textAlign: "center",
  },
  recordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginRight: 8,
  },
  recordValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  insightsText: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: 15,
    textAlign: "center",
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 40,
  },
  recommendationNumber: {
    width: 28,
    height: 28,
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
  },
  recommendationNumberText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "bold",
  },
  recommendationText: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  takeawayItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#0ea5e9",
  },
  takeawayBullet: {
    width: 6,
    height: 6,
    backgroundColor: "#0ea5e9",
    borderRadius: 3,
    marginRight: 10,
    marginTop: 4,
    flexShrink: 0,
  },
  takeawayText: {
    flex: 1,
    fontSize: 11,
    color: "#374151",
    lineHeight: 1.5,
  },
  tacticsContainer: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 6,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tacticsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  tacticItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  tacticBullet: {
    width: 4,
    height: 4,
    backgroundColor: "#f59e0b",
    borderRadius: 2,
    marginRight: 8,
    marginTop: 6,
    flexShrink: 0,
  },
  tacticText: {
    flex: 1,
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  fullPageSection: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  keyTakeawaysHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  keyTakeawaysIntro: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: 20,
    textAlign: "center",
  },
});

interface SearchPlayer {
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
}

interface PlayerComparisonAnalysis {
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
}

interface PlayerComparisonPDFDocumentProps {
  userId: string;
  currentUserName: string; // Added prop for current player's name
  comparisonPlayer: SearchPlayer;
  comparisonAnalysis: PlayerComparisonAnalysis;
  timestamp: string;
  metadata: Record<string, any>;
}

export const PlayerComparisonPDFDocument: React.FC<
  PlayerComparisonPDFDocumentProps
> = ({
  userId,
  currentUserName,
  comparisonPlayer,
  comparisonAnalysis,
  timestamp,
  metadata,
}) => {
  // Clean up the record string by removing "(based on data provided)"
  const cleanRecord = comparisonAnalysis.headToHeadAnalysis.record
    .replace(/\(based on data provided\)/g, "")
    .trim();

  return (
    <Document>
      {/* Page 1: Introduction - Only show opponent data */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Player Comparison Analysis</Text>
          <Text style={styles.subtitle}>
            AI-Powered Squash Player Comparison Report
          </Text>
          <Text style={styles.subtitle}>
            Generated on {new Date(timestamp).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comparison Player Profile</Text>
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.playerName}>
              {comparisonPlayer.fname} {comparisonPlayer.lname}
            </Text>
            <Text style={styles.playerDetail}>
              {comparisonPlayer.city}, {comparisonPlayer.state}
            </Text>
            <Text style={styles.playerDetail}>
              {comparisonPlayer.mainAffiliation}
            </Text>
            {comparisonPlayer.rating && (
              <Text style={styles.playerDetail}>
                Rating: {comparisonPlayer.rating.toFixed(1)}
              </Text>
            )}
            <Text style={styles.playerDetail}>
              {comparisonPlayer.AdultJunior} • {comparisonPlayer.Gender}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionContent}>
            This comprehensive player comparison analysis provides detailed
            insights into the playing styles, strengths, and strategic
            differences between you and your selected comparison player. The
            report includes tactical recommendations and key takeaways to help
            you prepare for potential matches and improve your overall game
            strategy.
          </Text>
        </View>
      </Page>

      {/* Page 2: Detailed Player Analysis Comparison */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Detailed Player Analysis</Text>
        </View>

        <View style={styles.comparisonGrid}>
          <View style={styles.comparisonColumn}>
            <Text style={styles.columnTitle}>{currentUserName}'s Analysis</Text>

            <View style={styles.playingStyleBox}>
              <Text style={styles.playingStyleLabel}>Playing Style</Text>
              <Text style={styles.playingStyleText}>
                {comparisonAnalysis.currentUserAnalysis.playingStyle}
              </Text>
            </View>

            <View style={styles.listContainer}>
              <Text style={[styles.listTitle, { color: "#10b981" }]}>
                Strengths
              </Text>
              {comparisonAnalysis.currentUserAnalysis.strengths.map(
                (strength: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={[styles.bullet, styles.strengthsBullet]} />
                    <Text style={styles.listText}>{strength}</Text>
                  </View>
                )
              )}
            </View>

            <View style={styles.listContainer}>
              <Text style={[styles.listTitle, { color: "#ef4444" }]}>
                Areas for Improvement
              </Text>
              {comparisonAnalysis.currentUserAnalysis.weaknesses.map(
                (weakness: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={[styles.bullet, styles.weaknessesBullet]} />
                    <Text style={styles.listText}>{weakness}</Text>
                  </View>
                )
              )}
            </View>
          </View>

          <View style={styles.comparisonColumn}>
            <Text style={styles.columnTitle}>
              {comparisonPlayer.fname} {comparisonPlayer.lname}'s Analysis
            </Text>

            <View style={styles.playingStyleBox}>
              <Text style={styles.playingStyleLabel}>Playing Style</Text>
              <Text style={styles.playingStyleText}>
                {comparisonAnalysis.comparisonPlayerAnalysis.playingStyle}
              </Text>
            </View>

            <View style={styles.listContainer}>
              <Text style={[styles.listTitle, { color: "#10b981" }]}>
                Strengths
              </Text>
              {comparisonAnalysis.comparisonPlayerAnalysis.strengths.map(
                (strength: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={[styles.bullet, styles.strengthsBullet]} />
                    <Text style={styles.listText}>{strength}</Text>
                  </View>
                )
              )}
            </View>

            <View style={styles.listContainer}>
              <Text style={[styles.listTitle, { color: "#ef4444" }]}>
                Weaknesses
              </Text>
              {comparisonAnalysis.comparisonPlayerAnalysis.weaknesses.map(
                (weakness: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={[styles.bullet, styles.weaknessesBullet]} />
                    <Text style={styles.listText}>{weakness}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>
      </Page>

      {/* Page 3: Head-to-Head Analysis */}
      {comparisonAnalysis.headToHeadAnalysis.exists && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Head-to-Head Analysis</Text>
          </View>

          <View style={styles.fullPageSection}>
            <View style={styles.headToHeadSection}>
              <Text style={styles.headToHeadTitle}>Matchup History</Text>

              <View style={styles.recordContainer}>
                <Text style={styles.recordLabel}>Overall Record:</Text>
                <Text style={styles.recordValue}>{cleanRecord}</Text>
              </View>

              <Text style={styles.insightsText}>
                {comparisonAnalysis.headToHeadAnalysis.insights}
              </Text>

              {comparisonAnalysis.headToHeadAnalysis.keyTacticsObserved.length >
                0 && (
                <View style={styles.tacticsContainer}>
                  <Text style={styles.tacticsTitle}>Key Tactics Observed</Text>
                  {comparisonAnalysis.headToHeadAnalysis.keyTacticsObserved.map(
                    (tactic: string, index: number) => (
                      <View key={index} style={styles.tacticItem}>
                        <View style={styles.tacticBullet} />
                        <Text style={styles.tacticText}>{tactic}</Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          </View>
        </Page>
      )}

      {/* Page 4: Key Takeaways */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Key Insights</Text>
        </View>

        <View style={styles.fullPageSection}>
          <Text style={styles.keyTakeawaysHeader}>Key Takeaways</Text>
          <Text style={styles.keyTakeawaysIntro}>
            Important insights and actionable points from this comparison
            analysis:
          </Text>

          {comparisonAnalysis.keyTakeaways.map(
            (takeaway: string, index: number) => (
              <View key={index} style={styles.takeawayItem}>
                <View style={styles.takeawayBullet} />
                <Text style={styles.takeawayText}>{takeaway}</Text>
              </View>
            )
          )}
        </View>
      </Page>

      {/* Page 5: Strategic Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Strategic Recommendations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actionable Strategies</Text>
          <Text style={[styles.sectionContent, { marginBottom: 15 }]}>
            Based on the comparison analysis, here are specific strategic
            recommendations to help you improve your game and prepare for
            potential matches:
          </Text>

          {comparisonAnalysis.strategicRecommendations.map(
            (recommendation: string, index: number) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationNumber}>
                  <Text style={styles.recommendationNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            )
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text style={styles.sectionContent}>
            Use this analysis to focus your training and preparation. Consider
            implementing the strategic recommendations gradually and monitor
            your progress against similar playing styles. Regular analysis
            updates will help track your improvement and adjust strategies as
            your game evolves.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
