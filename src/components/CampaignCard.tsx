import React from 'react';
import { Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import type { Campaign } from '../lib/supabase';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            statusColors[campaign.status]
          }`}
        >
          {campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Budget: {formatCurrency(campaign.budget)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Spent: {formatCurrency(campaign.spent)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date(campaign.start_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">ROI: {campaign.roi}%</span>
        </div>
      </div>

      <div className="text-sm text-gray-500">{campaign.platform}</div>
    </div>
  );
}