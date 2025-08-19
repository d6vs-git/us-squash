// components/pdf/AnalysisPDFDocument.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
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
  performanceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 20,
    color: '#6b7280',
    marginRight: 15,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 4,
  },
  listContainer: {
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 4,
    height: 4,
    backgroundColor: '#6b7280',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 4,
  },
  strengthsBullet: {
    backgroundColor: '#10b981',
  },
  weaknessesBullet: {
    backgroundColor: '#ef4444',
  },
  listText: {
    flex: 1,
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 40,
  },
  recommendationNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  recommendationNumberText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.6,
    wordBreak: 'break-word',
  },
  scenarioItem: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    breakInside: 'avoid',
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  scenarioNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  scenarioNumberText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    lineHeight: 1.3,
  },
  scenarioDescription: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.5,
    marginBottom: 12,
    marginLeft: 40,
  },
  requirementsContainer: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    marginLeft: 40,
  },
  requirementsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  requirementBullet: {
    width: 3,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginRight: 6,
    marginTop: 4,
    flexShrink: 0,
  },
  requirementText: {
    flex: 1,
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  opponentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  opponentCard: {
    width: '30%',
    margin: '1.5%',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  opponentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  opponentWinRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  opponentMatches: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  opponentInsights: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.3,
  },
  predictionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  predictionCard: {
    width: '30%',
    margin: '1.5%',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  predictionPeriod: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  predictionRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  predictionLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  predictionValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  confidenceBadge: {
    padding: 4,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
    alignSelf: 'center',
  },
  confidenceText: {
    fontSize: 9,
    color: '#1d4ed8',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  pageBreak: {
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 20,
  },
});

interface AnalysisPDFDocumentProps {
  userId: string;
  analysisType: string;
  analysisLabel: string;
  data: any;
  timestamp: string;
  metadata: Record<string, any>;
  isCombined: boolean;
}

export const AnalysisPDFDocument: React.FC<AnalysisPDFDocumentProps> = ({
  userId,
  analysisType,
  analysisLabel,
  data,
  timestamp,
  metadata,
  isCombined
}) => {
  const renderPerformanceAnalysis = (analysis: any) => {
    const pages = [];

    // Page 2: Performance score, overview, strengths and improvements
    pages.push(
      <Page key="performance-main" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{!isCombined ? analysisLabel : 'Performance Analysis'}</Text>
        </View>

        {analysis.overallPerformance && (
          <View style={styles.performanceRating}>
            <Text style={styles.ratingNumber}>{analysis.overallPerformance.rating}</Text>
            <Text style={styles.ratingText}>/10</Text>
            <Text style={styles.ratingLabel}>Performance Score</Text>
          </View>
        )}

        {analysis.overallPerformance?.explanation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <Text style={styles.sectionContent}>{analysis.overallPerformance.explanation}</Text>
          </View>
        )}

        {analysis.strengths && analysis.strengths.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={[styles.listTitle, { color: '#10b981' }]}>Strengths</Text>
            {analysis.strengths.map((strength: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, styles.strengthsBullet]} />
                <Text style={styles.listText}>{strength}</Text>
              </View>
            ))}
          </View>
        )}

        {analysis.weaknesses && analysis.weaknesses.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={[styles.listTitle, { color: '#ef4444' }]}>Areas for Improvement</Text>
            {analysis.weaknesses.map((weakness: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, styles.weaknessesBullet]} />
                <Text style={styles.listText}>{weakness}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    );

    // Page 3: Performance Recommendations
    if (analysis.recommendations && analysis.recommendations.length > 0) {
      pages.push(
        <Page key="performance-recommendations" size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Performance Recommendations</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training & Match Strategy Recommendations</Text>
            {analysis.recommendations.map((rec: string, index: number) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationNumber}>
                  <Text style={styles.recommendationNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </Page>
      );
    }

    return pages;
  };

  const renderOpponentAnalysis = (analysis: any) => {
    const pages = [];

    // Page 4: Playing style analysis, opponent performance breakdown
    pages.push(
      <Page key="opponent-main" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{!isCombined ? analysisLabel : 'Opponent Analysis'}</Text>
        </View>

        {analysis.playingStyle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Playing Style Analysis</Text>
            <Text style={styles.sectionContent}>{analysis.playingStyle}</Text>
          </View>
        )}

        {analysis.opponentAnalysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opponent Performance Breakdown</Text>
            <View style={styles.opponentGrid}>
              {Object.entries(analysis.opponentAnalysis).map(([category, data]: [string, any]) => (
                <View key={category} style={styles.opponentCard}>
                  <Text style={styles.opponentTitle}>
                    {category.replace(/([A-Z])/g, ' $1').replace('vs', 'vs ')}
                  </Text>
                  <Text style={styles.opponentWinRate}>
                    {data?.winRate && data.winRate !== '0%' ? data.winRate : 'Limited data'}
                  </Text>
                  <Text style={styles.opponentMatches}>{data?.totalMatches || 0} matches</Text>
                  <Text style={styles.opponentInsights}>
                    {data?.insights || 'Insufficient data for analysis'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    );

    // Page 5: Mental game assessment and consistency analysis
    pages.push(
      <Page key="opponent-mental" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Mental Game & Consistency</Text>
        </View>

        {analysis.mentalGame && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mental Game Assessment</Text>
            <Text style={styles.sectionContent}>
              {typeof analysis.mentalGame === 'object'
                ? analysis.mentalGame?.assessment || 'No assessment available'
                : analysis.mentalGame}
            </Text>
            {analysis.mentalGame?.evidence && (
              <View style={{ marginTop: 10 }}>
                {analysis.mentalGame.evidence.map((item: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {analysis.consistency && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Consistency Analysis</Text>
            <Text style={styles.sectionContent}>
              {typeof analysis.consistency === 'object'
                ? `${analysis.consistency?.rating || 'N/A'} - ${analysis.consistency?.explanation || ''}`
                : analysis.consistency}
            </Text>
          </View>
        )}

        {analysis.upsetPotential && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upset Potential</Text>
            <Text style={styles.sectionContent}>
              {analysis.upsetPotential.rating || 'N/A'} - {analysis.upsetPotential.explanation || ''}
            </Text>
          </View>
        )}

        {analysis.tacticalRecommendations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tactical Recommendations</Text>
            {analysis.tacticalRecommendations.map((rec: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    );

    return pages;
  };

  const renderPredictionAnalysis = (analysis: any) => {
    const pages = [];

    // Page 6: Current trajectory and rating predictions
    pages.push(
      <Page key="prediction-main" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{!isCombined ? analysisLabel : 'Rating Prediction'}</Text>
        </View>

        {analysis.currentTrajectory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Trajectory</Text>
            <Text style={styles.sectionContent}>
              {typeof analysis.currentTrajectory === 'object'
                ? analysis.currentTrajectory.analysis || analysis.currentTrajectory.trend
                : analysis.currentTrajectory}
            </Text>
          </View>
        )}

        {analysis.predictions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating Predictions</Text>
            <View style={styles.predictionGrid}>
              {Object.entries(analysis.predictions).map(([period, data]: [string, any]) => (
                <View key={period} style={styles.predictionCard}>
                  <Text style={styles.predictionPeriod}>{period}</Text>
                  <View style={styles.predictionRating}>
                    <Text style={styles.predictionLabel}>Singles:</Text>
                    <Text style={styles.predictionValue}>
                      {data.singlesRating || 'Calculating...'}
                    </Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{data.confidence || 'medium'} confidence</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    );

    // Page 7: Future scenarios (FIXED)
    if (analysis.scenarios) {
      pages.push(
        <Page key="prediction-scenarios" size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Future Scenarios</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Potential Rating Trajectories</Text>
            
            {Object.entries(analysis.scenarios).map(([scenario, data], index) => (
              <View key={scenario} style={styles.scenarioItem}>
                <View style={styles.scenarioHeader}>
                  <View style={styles.scenarioNumber}>
                    <Text style={styles.scenarioNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.scenarioTitle}>
                    {scenario.charAt(0).toUpperCase() + scenario.slice(1).replace(/([A-Z])/g, ' $1')} Scenario
                  </Text>
                </View>
                
                <Text style={styles.scenarioDescription}>
                  {typeof data === 'object' ? (data as any).description : String(data)}
                </Text>
                
                {typeof data === 'object' && (data as any).requirements && (
                  <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Requirements:</Text>
                    {(data as any).requirements.map((req: string, reqIndex: number) => (
                      <View key={reqIndex} style={styles.requirementItem}>
                        <View style={styles.requirementBullet} />
                        <Text style={styles.requirementText}>{req}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </Page>
      );
    }

    return pages;
  };

  const renderSingleAnalysis = () => {
    let allPages = [];

    // Page 1: Intro (keep as is)
    allPages.push(
      <Page key="intro" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{analysisLabel}</Text>
          <Text style={styles.subtitle}>AI-Powered Squash Analysis Report</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionContent}>
            This comprehensive analysis provides detailed insights into your squash performance, 
            helping you understand your current level, identify areas for improvement, and develop 
            targeted strategies for enhancement. The report is generated using advanced AI algorithms 
            that analyze your match history, performance patterns, and playing characteristics.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis Overview</Text>
          <Text style={styles.sectionContent}>
            Your personalized report includes performance metrics, tactical recommendations, 
            and strategic insights designed to help you reach your next level of play. 
            Each section provides actionable feedback based on comprehensive data analysis.
          </Text>
        </View>
      </Page>
    );

    if (analysisType === 'performance') {
      allPages.push(...renderPerformanceAnalysis(data));
    } else if (analysisType === 'opponent') {
      allPages.push(...renderOpponentAnalysis(data));
    } else if (analysisType === 'prediction') {
      allPages.push(...renderPredictionAnalysis(data));
    }

    return allPages;
  };

  const renderCombinedAnalysis = () => {
    const analysisData = data as Array<{
      analysisType: string;
      analysisLabel: string;
      data: any;
      timestamp: string;
    }>;

    const allPages = [];

    // Page 1: Introduction
    allPages.push(
      <Page key="intro" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Analysis Report</Text>
          <Text style={styles.subtitle}>AI-Powered Squash Analysis</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionContent}>
            This comprehensive report combines multiple AI-powered analyses to provide you with 
            a complete understanding of your squash performance. The report includes performance 
            analysis, opponent analysis, and rating predictions to help you improve your game 
            strategically and systematically.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Contents</Text>
          {analysisData.map((analysis, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{analysis.analysisLabel}</Text>
            </View>
          ))}
        </View>
      </Page>
    );

    // Add individual analysis pages
    analysisData.forEach((analysis) => {
      if (analysis.analysisType === 'performance') {
        allPages.push(...renderPerformanceAnalysis(analysis.data));
      } else if (analysis.analysisType === 'opponent') {
        allPages.push(...renderOpponentAnalysis(analysis.data));
      } else if (analysis.analysisType === 'prediction') {
        allPages.push(...renderPredictionAnalysis(analysis.data));
      }
    });

    return <Document>{allPages}</Document>;
  };

  if (isCombined) {
    return renderCombinedAnalysis();
  }

  return <Document>{renderSingleAnalysis()}</Document>;
};