import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import DetailItem from "./DetailItem";
import DetailSection from "./DetailSection";
const ApplicationDetails = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/api/admin/applications/${id}`);
        setApplication(response.data.application);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);
  if (loading) {
    return <p className="p-6">Loading application details...</p>;
  }

  if (!application) {
    return <p className="p-6">Application not found.</p>;
  }
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Application Details
        </h1>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
          <DetailSection title="Member Information">
            <DetailItem label="Name" value={application.user?.fullName} />

            <DetailItem label="Email" value={application.user?.email} />
          </DetailSection>

          <DetailSection title="Application Information">
            <DetailItem label="Status" value={application.status} />

            <DetailItem label="Priority" value={application.priority} />

            <DetailItem
              label="Submitted On"
              value={
                application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
