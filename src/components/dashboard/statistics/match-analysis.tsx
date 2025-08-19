"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface MatchAnalysisProps {
  wins: {
    "3": number
    "4": number
    "5": number
  }
  losses: {
    "3": number
    "4": number
    "5": number
  }
  totalWins: number
  totalLosses: number
}

const COLORS = {
  wins: ["#22c55e", "#16a34a", "#15803d"], // Green shades
  losses: ["#ef4444", "#dc2626", "#b91c1c"] // Red shades
}

export const MatchAnalysis = ({ wins, losses, totalWins, totalLosses }: MatchAnalysisProps) => {
  const winsData = [
    { name: "3 Games", value: wins["3"], total: totalWins },
    { name: "4 Games", value: wins["4"], total: totalWins },
    { name: "5 Games", value: wins["5"], total: totalWins }
  ].filter(item => item.value > 0)

  const lossesData = [
    { name: "3 Games", value: losses["3"], total: totalLosses },
    { name: "4 Games", value: losses["4"], total: totalLosses },
    { name: "5 Games", value: losses["5"], total: totalLosses }
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const total = data?.payload?.payload?.total;
      let percent = "N/A";
      if (typeof total === "number" && total > 0) {
        percent = ((data.value / total) * 100).toFixed(1) + "%";
      }
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} matches ({percent})
          </p>
        </div>
      );
    }
    return null
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Match Length Analysis</CardTitle>
        <CardDescription className="text-muted-foreground">
          Distribution of wins and losses by match length (3, 4, or 5 games)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wins Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Wins: {totalWins}</h3>
              <div className="text-sm text-muted-foreground">Total: {wins["3"] + wins["4"] + wins["5"]}</div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={winsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {winsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.wins[index % COLORS.wins.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3 min-w-[120px]">
                {winsData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS.wins[index % COLORS.wins.length] }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Losses Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Losses: {totalLosses}</h3>
              <div className="text-sm text-muted-foreground">Total: {losses["3"] + losses["4"] + losses["5"]}</div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lossesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {lossesData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.losses[index % COLORS.losses.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3 min-w-[120px]">
                {lossesData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS.losses[index % COLORS.losses.length] }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}