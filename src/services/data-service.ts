import axios from "@/utils/axios"
import { config } from "@/utils/config"

export class DataService {
  static async fetchUserData(userId: string, sessionCookie: string) {
    const headers = {
      Cookie: `USSQ-API-SESSION=${sessionCookie}`,
    }

    try {

      const [
        profile,
        affiliations,
        rankings,
        ratingsHistory,
        sports,
        tournaments,
        leagues,
        schools,
        upcomingMatches,
        ratings,
        ratingsTop,
        record,
        matchTypes,
        matches,
        ladders,
      ] = await Promise.allSettled([
        axios.get(`${config.API_URL}/resources/res/user/${userId}`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/affiliations`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/rankings`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/ratings_history`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/sports`, { headers }),
        axios.get(`${config.API_URL}/resources/res/players/${userId}/tournament-scores`, { headers }),
        axios.get(`${config.API_URL}/resources/res/players/${userId}/leagues`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/schools`, { headers }),
        axios
          .get(`${config.API_URL}/resources/res/user/${userId}/upcoming_matches/0`, { headers })
          .catch(() => ({ data: [] })),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/ratings`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/ratings-top`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/record`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/3/matchTypes`, { headers }),
        axios.get(`${config.API_URL}/resources/res/user/${userId}/matches_profile/page/1?pageSize=500&sportId=3`, {
          headers,
        }), // Only singles
        axios.get(`${config.API_URL}/resources/res/players/${userId}/ladders`, { headers }),
      ])

      // Filter data to only include singles and remove all doubles references
      const ratingsData = ratings.status === "fulfilled" ? ratings.value.data : []
      const filteredRatings = ratingsData.filter(
        (rating: any) =>
          !rating.ratingTypeName?.toLowerCase().includes("double") &&
          (rating.ratingTypeName?.includes("Singles") || rating.ratingTypeName?.includes("Universal")),
      )

      const ratingsHistoryData = ratingsHistory.status === "fulfilled" ? ratingsHistory.value.data : []
      const filteredRatingsHistory = ratingsHistoryData.filter(
        (rating: any) =>
          !rating.RatingGroup?.toLowerCase().includes("double") &&
          (rating.RatingGroup?.includes("Singles") || rating.RatingGroup?.includes("Universal")),
      )

      const recordData = record.status === "fulfilled" ? record.value.data : []
      const filteredRecord = recordData.filter((rec: any) => rec.type === "S") // Only singles record

      const matchesData = matches.status === "fulfilled" ? matches.value.data : null
      const filteredMatches = matchesData?.matches?.filter((match: any) => match.Sportid === 3) || []

      // Filter tournaments to remove doubles tournaments
      const tournamentsData = tournaments.status === "fulfilled" ? tournaments.value.data : null
      const filteredTournaments =
        tournamentsData?.tournaments?.filter((tournament: any) => {
          const nameCheck = !tournament.tournamentName?.toLowerCase().includes("double")
          const titleCheck = !tournament.title?.toLowerCase().includes("double")
          const eventCheck = !tournament.eventTypeDescr?.toLowerCase().includes("double")
          const sportCheck = tournament.sportId === 3

          return nameCheck && titleCheck && eventCheck && sportCheck
        }) || []

      const userData = {
        profile: profile.status === "fulfilled" ? profile.value.data : null,
        affiliations: affiliations.status === "fulfilled" ? affiliations.value.data : [],
        rankings: rankings.status === "fulfilled" ? rankings.value.data : [],
        "ratings-history": filteredRatingsHistory,
        sports: sports.status === "fulfilled" ? sports.value.data : [],
        tournaments: {
          tournaments: filteredTournaments,
          numWeeksOfHistory: tournamentsData?.numWeeksOfHistory || null,
        },
        leagues: leagues.status === "fulfilled" ? leagues.value.data : [],
        schools: schools.status === "fulfilled" ? schools.value.data : [],
        "upcoming-matches": upcomingMatches.status === "fulfilled" ? upcomingMatches.value.data : [],
        ratings: filteredRatings,
        "ratings-top": ratingsTop.status === "fulfilled" ? ratingsTop.value.data : [],
        record: filteredRecord,
        "match-types": matchTypes.status === "fulfilled" ? matchTypes.value.data : [],
        matches: { matches: filteredMatches },
        ladders: ladders.status === "fulfilled" ? ladders.value.data : [],
      }


      return userData
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  }
}
