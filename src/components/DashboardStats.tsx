import React from 'react';
import { DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import type { Campaign } from '../lib/supabase';

interface DashboardStatsProps {
  campaigns: Campaign[];
}

export function DashboardStats({ campaigns }: DashboardStatsProps) {
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const averageROI = campaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Budget"
        value={formatCurrency(totalBudget)}
        icon={<DollarSign className="w-6 h-6" />}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Spent"
        value={formatCurrency(totalSpent)}
        icon={<Activity className="w-6 h-6" />}
        color="bg-green-500"
      />
      <StatCard
        title="Average ROI"
        value={`${averageROI.toFixed(2)}%`}
        icon={<TrendingUp className="w-6 h-6" />}
        color="bg-purple-500"
      />
      <StatCard
        title="Active Campaigns"
        value={activeCampaigns.toString()}
        icon={<PieChart className="w-6 h-6" />}
        color="bg-orange-500"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`${color} text-white p-2 rounded-lg`}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}