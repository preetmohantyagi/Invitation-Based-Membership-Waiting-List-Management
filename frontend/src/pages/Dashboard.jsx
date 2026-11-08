import React from "react";
import { useAuth } from "../context/AuthContext";
import MemberDashboardHeader from "../components/member/MemberDashboardHeader";
import MembershipStatusCard from "../components/member/MembershipStatusCard";
import MemberInvitationSection from "../components/member/invitations/MemberInvitationSection";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <MemberDashboardHeader name={user?.fullName} />
        <MembershipStatusCard user={user} />
        <MemberInvitationSection />
      </div>
    </div>
  );
};

export default Dashboard;
