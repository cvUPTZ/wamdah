import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useCampaignStore } from '../store/campaignStore';
import { formatCurrency } from '../lib/utils';

export function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, loading, error, fetchCampaigns, updateCampaign } = useCampaignStore();
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const campaign = campaigns.find((c) => c.id === id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const handleStatusChange = async (newStatus: typeof campaign.status) => {
    try {
      await updateCampaign(campaign.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Campaigns
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{campaign.platform}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <select
                    value={campaign.status}
                    onChange={(e) => handleStatusChange(e.target.value as typeof campaign.status)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(campaign.budget)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Spent</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(campaign.spent)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ROI</dt>
                <dd className="text-sm text-gray-900">{campaign.roi}%</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(campaign.start_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(campaign.end_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="text-sm text-gray-900">{campaign.description}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}