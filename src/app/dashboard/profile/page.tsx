"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/ui/loading";

interface UserData {
  id: number;
  name: string;
  email: string;
  cellPhone: string;
  birthDate: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  profilePictureUrl: string;
  Intercom_Rating: number;
  schools: Array<{
    GradYear: string;
  }>;
  affiliations: Array<{
    name: string;
    clubLogo: string;
    isHome: string;
  }>;
  mainAffiliation?: {
    descr: string;
  };
  zip?: string;
  gender?: string;
  imisId?: string;
  homePhone?: string;
  workPhone?: string;
  citizenship?: string;
  paidThru?: string;
  isMember?: boolean;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">
              {error || "No user data found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPhone = (phone: string) => {
    if (!phone) return "N/A";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Find home club from affiliations
  const homeClub =
    userData.affiliations?.find((affil) => affil.isHome === "Y")?.name || "N/A";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <img
            src={userData.profilePictureUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
          <h2 className="text-xl text-gray-600 mb-4">
            Professional Squash Player
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              Current Rating: {userData.Intercom_Rating?.toFixed(2) || "N/A"}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Member ID: {userData.imisId || "N/A"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Full Name</h3>
                  <p>{userData.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>{userData.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p>{formatPhone(userData.cellPhone)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Date of Birth</h3>
                    <p>{formatDate(userData.birthDate)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>
                      {[userData.city, userData.state, userData.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Citizenship</h3>
                    <p>{userData.citizenship || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Gender</h3>
                    <p>{userData.gender === "M" ? "Male" : "Female"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Main Affiliation</h3>
                    <p>{userData.mainAffiliation?.descr || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Home Club</h3>
                    <p>{homeClub}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Membership Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{userData.id}</p>
                  <p>MEMBER ID</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {userData.isMember ? "Active" : "Inactive"}
                  </p>
                  <p>STATUS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {userData.paidThru ? formatDate(userData.paidThru) : "N/A"}
                  </p>
                  <p>PAID THROUGH</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Affiliations Card */}
          {userData.affiliations && userData.affiliations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Affiliations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.affiliations.map((affiliation, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {affiliation.clubLogo && (
                        <img
                          src={affiliation.clubLogo}
                          alt={affiliation.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <p>{affiliation.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
