import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import DetailItem from "./DetailItem";
import DetailSection from "./DetailSection";
import ApplicationReviewPanel from "./ApplicationReviewPanel";
import AdminNotes from "./AdminNotes";
import AuditHistory from "./AuditHistory";
import MemberQuotaSection from "./MemberQuotaSection";

const ApplicationDetails = () => {
  const [application, setApplication] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/api/admin/applications/${id}`);
      setApplication(response.data.application);
      setHistory(response.data.history ?? []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleAction = async (action) => {
    let body = {};
    if (action === "reject") {
      const reason = window.prompt("Rejection reason (optional):");
      if (reason === null) return; // admin ne cancel kar diya
      body = { rejectionReason: reason };
    }

    try {
      const response = await api.patch(
        `/api/admin/applications/${id}/${action}`,
        body,
      );
      alert(response.data.message);
      await fetchApplication();
    } catch (error) {
      alert(error.response?.data?.message || `${action} failed`);
    }
  };

  const handlePriorityChange = async (priority) => {
    try {
      await api.patch(`/api/admin/applications/${id}/priority`, { priority });
      await fetchApplication();
    } catch (error) {
      alert(error.response?.data?.message || "Priority update failed");
    }
  };

  const handleSaveNotes = async (adminNotes) => {
    try {
      await api.patch(`/api/admin/applications/${id}/notes`, { adminNotes });
      await fetchApplication();
      alert("Notes saved");
    } catch (error) {
      alert(error.response?.data?.message || "Could not save notes");
    }
  };

  const handleQuotaUpdated = (updatedMember) => {
    setApplication((previous) => ({
      ...previous,
      user: { ...previous.user, ...updatedMember },
    }));
  };

  if (loading) {
    return <p className="p-6">Loading application details...</p>;
  }

  if (!application) {
    return <p className="p-6">Application not found.</p>;
  }

  const member = application.user;
  const invitation = application.invitation;
  const inviter = invitation?.createdBy;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Application Details
        </h1>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
          <DetailSection title="Applicant Information">
            <DetailItem label="Name" value={member?.fullName} />
            <DetailItem label="Email" value={member?.email} />
            <DetailItem label="Phone" value={application.phone} />
            <DetailItem label="Designation" value={application.designation} />
            <DetailItem label="Company" value={application.company} />
            <DetailItem label="Industry" value={application.industry} />
            <DetailItem label="Experience" value={application.experience} />
            <DetailItem label="Location" value={application.location} />
            <DetailItem label="Account Status" value={member?.accountStatus} />
          </DetailSection>

          <DetailSection title="Application Information">
            <DetailItem label="Status" value={application.status} />
            <DetailItem label="Priority" value={application.priority} />
            <DetailItem
              label="Rejection Reason"
              value={application.rejectionReason}
            />
            <DetailItem
              label="Submitted On"
              value={
                application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
            <DetailItem
              label="Reviewed By"
              value={application.reviewedBy?.fullName}
            />
            <DetailItem
              label="Reviewed On"
              value={
                application.reviewedAt
                  ? new Date(application.reviewedAt).toLocaleDateString()
                  : "N/A"
              }
            />
          </DetailSection>

          <DetailSection title="Invitation">
            <DetailItem label="Invitation Code" value={invitation?.code} />
            <DetailItem
              label="Invitation Source"
              value={
                inviter?.role === "ADMIN"
                  ? "Created by Admin"
                  : "Created by Member"
              }
            />
            <DetailItem
              label="Inviter"
              value={inviter ? `${inviter.fullName} (${inviter.email})` : "N/A"}
            />
          </DetailSection>

          <ApplicationReviewPanel
            application={application}
            onPriorityChange={handlePriorityChange}
            onAction={handleAction}
          />

          <AdminNotes
            key={application.updatedAt}
            initialNotes={application.adminNotes}
            onSave={handleSaveNotes}
          />

          <AuditHistory history={history} />

          {member?.accountStatus === "ACTIVE" && (
            <MemberQuotaSection
              member={member}
              onQuotaUpdated={handleQuotaUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
