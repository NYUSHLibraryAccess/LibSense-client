import * as React from 'react';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';
import { GithubOutlined } from '@ant-design/icons';
import { Descriptions, version as antdVersion } from 'antd';

import { ContentLimiter } from '@/components/ContentLimiter';
import logo from '@/assets/logo.png';

const About: React.FC = () => {
  return (
    <ContentLimiter>
      <Descriptions column={1} labelStyle={{ width: '200px' }}>
        <Descriptions.Item>
          <div className="flex items-center gap-6">
            <img src={logo} alt="Logo" className="w-16 h-16 drop-shadow" />
            <span className="font-display text-4xl">{__NAME__}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Version">
          {__VERSION__} (
          <a
            href="https://github.com/NYUSHLibraryAccess/LibSense-client/blob/main/CHANGELOG.md"
            target="_blank"
            rel="nofollow noreferrer"
          >
            Changelog
          </a>
          )
        </Descriptions.Item>
        <Descriptions.Item label="Package Version">
          <div>
            <div>React: {reactVersion}</div>
            <div>React DOM: {reactDomVersion}</div>
            <div>Antd: {antdVersion}</div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Build Type">
          {__IS_DEV__ ? 'Development Build' : 'Production Build'}
        </Descriptions.Item>
        <Descriptions.Item label="Build Time">{new Date(__BUILD_TIMESTAMP__).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Build Timestamp">{__BUILD_TIMESTAMP__}</Descriptions.Item>
        <Descriptions.Item label="Source Code">
          <a href="https://github.com/NYUSHLibraryAccess/LibSense-client" target="_blank" rel="nofollow noreferrer">
            <GithubOutlined /> GitHub
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Credits">
          <div>
            <div>
              Icons made by{' '}
              <a href="https://www.freepik.com" title="Freepik" target="_blank" rel="nofollow noreferrer">
                Freepik
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="nofollow noreferrer">
                www.flaticon.com
              </a>
            </div>
            <div>
              Icons made by{' '}
              <a
                href="https://www.flaticon.com/authors/kerismaker"
                title="kerismaker"
                target="_blank"
                rel="nofollow noreferrer"
              >
                kerismaker
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="nofollow noreferrer">
                www.flaticon.com
              </a>
            </div>
            <a
              href="https://www.freepik.com/free-photo/library-with-books_925672.htm#query=bookshelf&position=42&from_view=keyword&track=sph"
              target="_blank"
              rel="nofollow noreferrer"
            >
              Image by ikaika
            </a>{' '}
            on Freepik
          </div>
        </Descriptions.Item>
      </Descriptions>
    </ContentLimiter>
  );
};

export { About };
