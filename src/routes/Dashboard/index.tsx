import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column } from '@ant-design/plots';
import { CardProps, Input } from 'antd';

import { StyledCard } from '@/components/StyledCard';
import { useOverviewQuery } from '@/services/overview';
import { getClassName } from '@/utils/getClassName';
import { useGreetingCard } from '@/hooks/useGreetingCard';

const SimpleStatistic: React.FC<{ title: string; value: number; colorCls?: string; onClick?: () => void }> = ({
  title,
  value,
  colorCls,
  onClick,
}) => {
  return (
    <div className="flex-1">
      <p className="mb-2 text-sm text-gray-500">{title}</p>
      <p
        className={getClassName(
          'text-2xl',
          colorCls,
          onClick && 'underline underline-offset-2 cursor-pointer transition-colors hover:text-violet-600'
        )}
        onClick={onClick}
      >
        {value ?? '-'}
      </p>
    </div>
  );
};

const SimpleDivider: React.FC = () => {
  return <div className="flex-none w-px bg-gray-200" />;
};

const GreetingCard: React.FC<{ className?: string }> = ({ className }) => {
  const { message, icon } = useGreetingCard();

  return (
    <StyledCard className={className}>
      <div className="flex justify-between">
        <div>
          <p className="font-display mb-4 text-3xl font-light">{message}</p>
          <p className="text-base font-light">Welcome to {__NAME__}!</p>
        </div>
        {React.cloneElement(icon, { className: 'w-20 h-20' })}
      </div>
    </StyledCard>
  );
};

const SearchCard: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <StyledCard className={className}>
      <Input.Search
        placeholder="Search orders..."
        allowClear
        enterButton
        onSearch={(value) => {
          navigate(`/manageOrders?search=${value}`);
        }}
      />
    </StyledCard>
  );
};

const PendingTasksCard: React.FC<{ className?: string }> = ({ className }) => {
  const { data, isLoading } = useOverviewQuery();
  const navigate = useNavigate();

  return (
    <StyledCard loading={isLoading} title="Pending to be Checked" className={className}>
      <div className="flex gap-4">
        <SimpleStatistic
          title="Rush-Local Orders"
          value={data?.localRushPending}
          colorCls={data?.localRushPending === 0 ? 'text-green-600' : 'text-orange-600'}
          onClick={() => navigate('/manageOrders?preset=-200')}
        />
        <SimpleDivider />
        <SimpleStatistic
          title="CDL Orders"
          value={data?.cdlPending}
          colorCls={data?.cdlPending === 0 ? 'text-green-600' : 'text-orange-600'}
          onClick={() => navigate('/manageOrders?preset=-201')}
        />
      </div>
    </StyledCard>
  );
};

const TimeSpendingCard: React.FC<{
  className?: string;
  title: CardProps['title'];
  category: 'Cdl' | 'CdlScan' | 'RushLocal' | 'RushNyc';
}> = ({ className, title, category }) => {
  const { data, isLoading } = useOverviewQuery();

  return (
    <StyledCard loading={isLoading} title={title} className={className}>
      <div className="flex gap-4">
        <SimpleStatistic title="Average" value={data?.[`avg${category}`]} colorCls="text-violet-600" />
        <SimpleDivider />
        <SimpleStatistic title="Minimum" value={data?.[`min${category}`]} colorCls="text-green-600" />
        <SimpleDivider />
        <SimpleStatistic title="Maximum" value={data?.[`max${category}`]} colorCls="text-yellow-600" />
      </div>
    </StyledCard>
  );
};

const TimeSpendingChartCard: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { data, isLoading } = useOverviewQuery();

  const dataToPlot = useMemo(
    () => [
      {
        type: 'CDL',
        range: [data?.minCdl, data?.maxCdl],
      },
      {
        type: 'CDL Scan',
        range: [data?.minCdlScan, data?.maxCdlScan],
      },
      {
        type: 'Rush-Local',
        range: [data?.minRushLocal, data?.maxRushLocal],
      },
      {
        type: 'Rush-NY',
        range: [data?.minRushNyc, data?.maxRushNyc],
      },
    ],
    [data]
  );

  return (
    <StyledCard loading={isLoading} title="Time Spending Chart" className={className}>
      <Column
        data={dataToPlot}
        xField="type"
        yField="range"
        color="#7c3aed"
        maxColumnWidth={30}
        style={{
          height: 248,
        }}
        label={{
          position: 'middle',
          layout: [
            {
              type: 'adjust-color',
            },
          ],
        }}
      />
    </StyledCard>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-10 pt-0 overflow-auto bg-gray-100">
      <div className="my-8 text-xl font-bold select-none">Dashboard</div>
      <div className="grid gap-6 grid-cols-3 md:grid-cols-6 xl:grid-cols-9">
        <GreetingCard className="col-span-3 md:col-span-4 xl:col-span-5" />
        <SearchCard className="col-span-3 md:col-span-4 xl:col-span-5" />
        <PendingTasksCard className="col-span-3 md:col-span-2 md:col-start-1 xl:col-span-3 xl:col-start-1" />
        <TimeSpendingCard title="CDL Order Time Spending" category="Cdl" className="col-span-3 md:col-start-1" />
        <TimeSpendingCard title="CDL Scan Time Spending" category="CdlScan" className="col-span-3" />
        <TimeSpendingCard
          title="Rush-Local Order Time Spending"
          category="RushLocal"
          className="col-span-3 xl:order-last"
        />
        <TimeSpendingCard title="Rush-NY Order Time Spending" category="RushNyc" className="col-span-3 xl:order-last" />
        <TimeSpendingChartCard className="col-span-3 row-span-2" />
      </div>
    </div>
  );
};

export { Dashboard };
