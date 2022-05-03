import * as React from 'react';
import { Tag, TagProps } from 'antd';
import { ITag } from '@/utils/interfaces';
import style from './style.module.less';

const getTagClassName = (tag: string): string => `${style.tag} ${style[`tag-${tag}`]}`;

const ColoredTag: React.FC<{ tag: ITag } & Omit<TagProps, 'className'>> = ({ tag, ...props }) => (
  <Tag {...props} className={getTagClassName(tag)}>
    {tag}
  </Tag>
);

export { ColoredTag };
