"use client"
import { useEffect, useId, useRef, useState } from "react"
import type React from "react"

import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Trophy,
  Award,
  Activity,
  ExternalLink,
  Plus,
  X,
  User,
  Users,
  TrendingUp,
  Star,
  Loader2,
  Calendar,
  Mail,
  Shield,
  Globe,
  Eye,
  EyeOff,
  GitCompare,
} from "lucide-react"

interface SearchPlayer {
  IMISID: string
  id: number
  FullPlayerName: string
  fullDetails: string
  playername: string
  mainAffiliation: string
  country: string
  state: string | null
  AdultJunior: string
  rating: number | null
  Gender: string
  fname: string
  lname: string
  city: string
  ProfilePictureUrl: string | null
}

interface TrackedPlayer {
  id: number
  name: string
  profilePictureUrl: string
  matchType: string
  matchStatus: string
  matchOpponent: string | null
  matchDate: string | null
  matchEvent: string | null
  matchEventDivision: string | null
  matchScore: string
  nextMatchWonOpponent: string
  nextMatchWonDate: string | null
  nextMatchWonEvent: string | null
}

interface ClubLockerUser {
  id: number
  spin: number
  firstName: string
  lastName: string
  mi: string
  name: string
  imisId: string
  profilePictureUrl: string
  mainAffiliation: {
    id: number
    descr: string
    shortName: string
    URL: string
    TypeID: number
    City: string
    LogoImageUrl: string
    urlTitle: string
    SupportLink: string | null
    BackgroundImageUrl: string | null
    expDate: string | null
    customId: string | null
  }
  rtoId: string | null
  PlayerId: number
  PAID_THRU: string
  WEBSITE: string | null
  hideScoringPopup: boolean
  profileBackgroundUrl: string
  coachingInterest: boolean
  officialInterest: boolean
  PlayerTrackerOptIn: boolean
  PlayerID: number
  FrontPage: number
  ShowGender: string
  ShowHomePhone: string
  ShowWorkPhone: string
  ShowCellPhone: string
  ShowEmail: string
  UserUpdated: string | null
  HideProfileInfo: string
  PreferredCommunication: string
  PreferredPhone: string
  OptOut_Magazine: string
  OptOut_Mail: string
  OptOut_Email: string
  OptOut_Text: string
  OptOut_3rdParty: string
  TimeZone: string | null
  Notification_Tournament: string
  Show_Location: string
  accountVerified: boolean
  Intercom_Rating: number
  Intercom_cl_customer_id: string
  Intercom_platform_customer_id: string | null
  Intercom_hasClubLockerLegacyRole: number
  isMember: boolean
}

interface ExpandablePlayerCardProps {
  players: SearchPlayer[]
  trackedPlayers: TrackedPlayer[]
  maxPlayersAllowed: number
  onAddPlayer: (playerId: number) => void
  addingPlayerId: number | null
  onSelectForComparison?: (player: SearchPlayer) => void
}

export function ExpandablePlayerCard({
  players,
  trackedPlayers,
  maxPlayersAllowed,
  onAddPlayer,
  addingPlayerId,
  onSelectForComparison,
}: ExpandablePlayerCardProps) {
  const [active, setActive] = useState<SearchPlayer | null>(null)
  const [playerDetails, setPlayerDetails] = useState<ClubLockerUser | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null)
      }
    }

    if (active) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(() => setActive(null))

  const fetchPlayerDetails = async (playerId: number) => {
    try {
      setLoadingDetails(true)
      setDetailsError(null)
      const response = await fetch(`/api/user?userId=${playerId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch player details: ${response.status}`)
      }

      const data = await response.json()
      setPlayerDetails(data)
    } catch (error) {
      setDetailsError(error instanceof Error ? error.message : "Failed to load player details")
      setPlayerDetails(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleCardClick = (player: SearchPlayer) => {
    setActive(player)
    setPlayerDetails(null)
    setDetailsError(null)
    fetchPlayerDetails(player.id)
  }

  const isAlreadyTracked = (playerId: number) => {
    return trackedPlayers.some((tp) => tp.id === playerId)
  }

  const canAddMore = trackedPlayers.length < maxPlayersAllowed

  const viewPlayerProfile = (playerId: number) => {
    window.open(`https://clublocker.com/users/${playerId}`, "_blank")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const InfoCard = ({
    title,
    value,
    icon,
    className = "",
  }: {
    title: string
    value: string | number | boolean
    icon?: React.ReactNode
    className?: string
  }) => (
    <div className={`p-3 bg-muted rounded-lg ${className}`}>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {title}
      </div>
      <div className="text-lg font-semibold text-foreground">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 lg:top-6 lg:right-6 items-center justify-center bg-card rounded-full h-8 w-8 shadow-lg z-10 border border-border"
              onClick={() => setActive(null)}
            >
              <X className="h-4 w-4 text-foreground" />
            </motion.button>

            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-4xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-card sm:rounded-xl overflow-hidden shadow-lg border border-border"
            >
              {/* Header */}
              <div className="p-6 bg-primary text-primary-foreground">
                <div className="flex items-center gap-4">
                  <motion.div layoutId={`avatar-${active.id}-${id}`}>
                    <Avatar className="h-16 w-16 border-4 border-primary-foreground/20">
                      <AvatarImage src={active.ProfilePictureUrl || "/placeholder.svg"} alt={active.FullPlayerName} />
                      <AvatarFallback className="bg-primary-foreground text-primary">
                        {active.fname[0]}
                        {active.lname[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 layoutId={`name-${active.id}-${id}`} className="text-2xl font-bold">
                      {active.fname} {active.lname}
                    </motion.h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                        {active.AdultJunior}
                      </Badge>
                      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                        {active.Gender}
                      </Badge>
                      {active.rating && (
                        <div className="flex items-center gap-1 text-primary-foreground/90">
                          <Trophy className="h-4 w-4" />
                          <span className="font-medium">{active.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Basic Information
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {active.city && active.state && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {active.city}, {active.state}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{active.mainAffiliation}</span>
                        </div>
                        <div className="text-xs">Player ID: {active.IMISID}</div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    {active.rating && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Performance
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                            <span className="text-sm font-medium text-accent-foreground">Current Rating</span>
                            <span className="text-lg font-bold">{active.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Detailed Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Detailed Profile
                    </h4>

                    {loadingDetails ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground">Loading detailed information...</p>
                        </div>
                      </div>
                    ) : detailsError ? (
                      <div className="text-center py-4 text-destructive bg-destructive/10 rounded-lg">
                        <p>Error loading details: {detailsError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => fetchPlayerDetails(active.id)}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : playerDetails ? (
                      <div className="space-y-6">
                        {/* Player Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <InfoCard title="Full Name" value={playerDetails.name} icon={<User className="h-3 w-3" />} />

                          <InfoCard
                            title="IMIS ID"
                            value={playerDetails.imisId}
                            icon={<Shield className="h-3 w-3" />}
                          />

                          <InfoCard
                            title="Player ID"
                            value={playerDetails.PlayerId}
                            icon={<Trophy className="h-3 w-3" />}
                          />

                          {playerDetails.Intercom_Rating && (
                            <InfoCard
                              title="Intercom Rating"
                              value={playerDetails.Intercom_Rating.toFixed(3)}
                              icon={<Star className="h-3 w-3" />}
                              className="bg-warning/10"
                            />
                          )}

                          <InfoCard
                            title="Account Verified"
                            value={playerDetails.accountVerified}
                            icon={
                              playerDetails.accountVerified ? (
                                <Shield className="h-3 w-3 text-success" />
                              ) : (
                                <Shield className="h-3 w-3 text-destructive" />
                              )
                            }
                            className={playerDetails.accountVerified ? "bg-success/10" : "bg-destructive/10"}
                          />

                          <InfoCard
                            title="Member Status"
                            value={playerDetails.isMember}
                            icon={
                              playerDetails.isMember ? (
                                <Star className="h-3 w-3 text-success" />
                              ) : (
                                <Star className="h-3 w-3 text-muted-foreground" />
                              )
                            }
                            className={playerDetails.isMember ? "bg-success/10" : "bg-muted"}
                          />

                          {playerDetails.PAID_THRU && (
                            <InfoCard
                              title="Membership Expires"
                              value={formatDate(playerDetails.PAID_THRU)}
                              icon={<Calendar className="h-3 w-3" />}
                              className="bg-accent"
                            />
                          )}

                          <InfoCard
                            title="Coaching Interest"
                            value={playerDetails.coachingInterest}
                            icon={<Users className="h-3 w-3" />}
                          />

                          <InfoCard
                            title="Official Interest"
                            value={playerDetails.officialInterest}
                            icon={<Award className="h-3 w-3" />}
                          />
                        </div>

                        {/* Club/Affiliation Information */}
                        {playerDetails.mainAffiliation && (
                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Club Affiliation
                            </h5>
                            <div className="p-4 bg-accent rounded-lg">
                              <div className="flex items-start gap-4">
                                {playerDetails.mainAffiliation.LogoImageUrl && (
                                  <img
                                    src={playerDetails.mainAffiliation.LogoImageUrl || "/placeholder.svg"}
                                    alt={playerDetails.mainAffiliation.descr}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h6 className="font-semibold">{playerDetails.mainAffiliation.descr}</h6>
                                  {playerDetails.mainAffiliation.shortName && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {playerDetails.mainAffiliation.shortName}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    {playerDetails.mainAffiliation.City && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {playerDetails.mainAffiliation.City}
                                      </span>
                                    )}
                                    {playerDetails.mainAffiliation.URL && (
                                      <a
                                        href={`https://${playerDetails.mainAffiliation.URL}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:underline"
                                      >
                                        <Globe className="h-3 w-3" />
                                        Website
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No additional details available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-muted border-t">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Button variant="outline" onClick={() => viewPlayerProfile(active.id)} className="flex-1 min-w-[200px]">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>

                    {!isAlreadyTracked(active.id) && canAddMore ? (
                      <Button
                        onClick={() => onAddPlayer(active.id)}
                        disabled={addingPlayerId === active.id}
                        className="flex-1 min-w-[200px]"
                      >
                        {addingPlayerId === active.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        {addingPlayerId === active.id ? "Adding..." : "Add to Tracker"}
                      </Button>
                    ) : isAlreadyTracked(active.id) ? (
                      <Badge variant="default" className="flex-1 min-w-[200px] justify-center py-2 bg-success">
                        Already Tracked
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex-1 min-w-[200px] justify-center py-2">
                        Tracker Full
                      </Badge>
                    )}

                    {onSelectForComparison && (
                      <Button
                        onClick={() => {
                          onSelectForComparison(active)
                          setActive(null)
                        }}
                        variant="secondary"
                        className="flex-1 min-w-[200px]"
                      >
                        <GitCompare className="h-4 w-4 mr-2" />
                        Compare
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Player Cards List */}
      <ul className="space-y-3">
        {players.map((player) => (
          <motion.div
            layoutId={`card-${player.id}-${id}`}
            key={`card-${player.id}-${id}`}
            onClick={() => handleCardClick(player)}
            className="p-4 flex items-center justify-between hover:bg-accent/50 rounded-lg cursor-pointer border border-border transition-all duration-200"
          >
            <div className="flex gap-4 items-center flex-1 min-w-0">
              <motion.div layoutId={`avatar-${player.id}-${id}`}>
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarImage src={player.ProfilePictureUrl || "/placeholder.svg"} alt={player.FullPlayerName} />
                  <AvatarFallback className="bg-muted text-foreground font-medium">
                    {player.fname[0]}
                    {player.lname[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h3 layoutId={`name-${player.id}-${id}`} className="font-medium truncate">
                  {player.fname} {player.lname}
                </motion.h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <Badge variant="outline" className="text-xs">
                    {player.AdultJunior}
                  </Badge>
                  {player.rating && (
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {player.rating.toFixed(1)}
                    </span>
                  )}
                  {player.city && player.state && (
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {player.city}, {player.state}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs mt-1 truncate">{player.mainAffiliation}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Button size="sm" variant="ghost" className="hover:bg-muted">
                View Details
              </Button>

              {!isAlreadyTracked(player.id) && canAddMore && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddPlayer(player.id)
                  }}
                  disabled={addingPlayerId === player.id}
                >
                  {addingPlayerId === player.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  Track
                </Button>
              )}

              {isAlreadyTracked(player.id) && (
                <Badge variant="default" className="text-xs bg-success">
                  Tracked
                </Badge>
              )}

              {!canAddMore && !isAlreadyTracked(player.id) && (
                <Badge variant="destructive" className="text-xs">
                  Full
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  )
}