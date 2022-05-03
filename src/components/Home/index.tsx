import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Statistic, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { IRootState } from '@/utils/store';
import { IOverview } from '@/utils/interfaces';
import Welcome from '@/images/welcome-back.png';
import { requestWithCatch } from '@/utils';
import { getOverview } from '@/api/getOverview';
import style from './style.module.less';

const Home: React.FC = () => {
  const username = useSelector<IRootState, string>(({ auth }) => auth.displayUsername);

  const [overview, setOverview] = useState<IOverview>();

  useEffect(() => {
    requestWithCatch(getOverview()).then((r) => {
      if (r !== undefined) {
        setOverview(r);
      }
    });
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card className={style.card}>
          <img src={Welcome} draggable={false} width={64} alt="" className={style.img} />
          <Typography.Title level={3}>Welcome to LibSense.</Typography.Title>
          <Typography.Paragraph>Have a nice day, {username}!</Typography.Paragraph>
        </Card>
      </Col>
      <Col span={24}>
        <Card className={style.card}>
          <Typography.Paragraph>Here are some statistics for you:</Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              <li>
                Pending Rush-Local orders: <Typography.Text strong>{overview.localRushPending}</Typography.Text>
              </li>
              <li>
                New York Excel version: <Typography.Text strong>2022-04-19</Typography.Text>
              </li>
              <li>
                Total number of users: <Typography.Text strong>6</Typography.Text>
              </li>
            </ul>
          </Typography.Paragraph>
        </Card>
      </Col>
      {/* CDL Vendor Scanning Days */}
      <Col span={24}>
        <Card title={<Typography.Title level={5}>CDL Vendor Scanning Days</Typography.Title>}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview.avgCdlScan} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview.minCdlScan} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview.maxCdlScan} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
      {/* CDL Total Days */}
      <Col span={24}>
        <Card title={<Typography.Title level={5}>CDL Total Days</Typography.Title>}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview.avgCdl} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview.minCdl} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview.maxCdl} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
      {/* Rush-NY Total Days */}
      <Col span={24}>
        <Card title={<Typography.Title level={5}>Rush-NY Total Days</Typography.Title>}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview.avgRushNyc} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview.minRushNyc} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview.maxRushNyc} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
      {/* Rush-Local Total Days */}
      <Col span={24}>
        <Card title={<Typography.Title level={5}>Rush-Local Total Days</Typography.Title>}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview.avgRushLocal} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview.minRushLocal} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview.maxRushLocal} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export { Home };
