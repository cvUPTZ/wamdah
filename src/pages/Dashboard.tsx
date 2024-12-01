import React from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { CampaignCard } from '../components/CampaignCard';
import { useCampaignStore } from '../store/campaignStore';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { campaigns, loading, error, fetchCampaigns } = useCampaignStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your marketing campaigns and performance metrics
        </p>
      </div>

      <DashboardStats campaigns={campaigns} />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.slice(0, 6).map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          />
        ))}
      </div>
    </div>
  );
}