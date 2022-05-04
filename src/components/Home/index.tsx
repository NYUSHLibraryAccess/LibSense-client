import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, Col, Divider, Row, Statistic, Typography } from 'antd';
import { HourglassTwoTone, StarTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { IRootState } from '@/utils/store';
import { IOverview } from '@/utils/interfaces';
import Welcome from '@/images/welcome-back.png';
import { useRequest } from '@/utils';
import { getOverview } from '@/api/getOverview';
import style from './style.module.less';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  const username = useSelector<IRootState, string>(({ auth }) => auth.username);

  const [overview, setOverview] = useState<IOverview>();

  useEffect(() => {
    // TODO: check the order between dispatch redux action and router re-rendering, does this hook work?
    if (username === null) {
      history.push('/Login');
    }
  }, []);

  // TODO: add subscription check
  useEffect(() => {
    useRequest(getOverview()).then((r) => {
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
          <Typography.Paragraph>
            <StarTwoTone /> Here are some statistics for you:
          </Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              <li>
                <Typography.Text strong>{overview?.localRushPending || 0}</Typography.Text> Rush-Local orders pending to
                be checked.
              </li>
              <li>
                <Typography.Text strong>{overview?.cdlPending || 0}</Typography.Text> CDL orders pending to be checked.
              </li>
            </ul>
          </Typography.Paragraph>
        </Card>
      </Col>
      {/* CDL Vendor Scanning Days */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Card
          title={
            <Typography.Title level={5}>
              <HourglassTwoTone /> CDL Vendor Scanning Days
            </Typography.Title>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview?.avgCdlScan} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview?.minCdlScan} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview?.maxCdlScan} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
      {/* CDL Total Days */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Card
          title={
            <Typography.Title level={5}>
              <HourglassTwoTone /> CDL Total Days
            </Typography.Title>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview?.avgCdl} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview?.minCdl} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview?.maxCdl} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
      {/* Rush-NY Total Days */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Card
          title={
            <Typography.Title level={5}>
              <HourglassTwoTone /> Rush-NY Total Days
            </Typography.Title>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview?.avgRushNyc} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview?.minRushNyc} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview?.maxRushNyc} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
      {/* Rush-Local Total Days */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Card
          title={
            <Typography.Title level={5}>
              <HourglassTwoTone /> Rush-Local Total Days
            </Typography.Title>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Average" className={style.avg} value={overview?.avgRushLocal} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Minimum" className={style.min} value={overview?.minRushLocal} suffix="Days" />
            </Col>
            <Col span={8}>
              <Statistic title="Maximum" className={style.max} value={overview?.maxRushLocal} suffix="Days" />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export { Home };
