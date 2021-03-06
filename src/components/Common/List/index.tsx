import React from 'react';
import { withProperties } from '../../../utils/typeHelpers';

interface ListItemProps {
  title: string;
}

const ListItem: React.FC<ListItemProps> = ({ title, children }) => {
  return (
    <div>
      <div className="max-w-6xl py-4 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="block text-sm font-medium text-gray-400">{title}</dt>
        <dd className="flex text-sm text-white sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{children}</span>
        </dd>
      </div>
    </div>
  );
};

interface ListProps {
  title: string;
  subTitle?: string;
}

const List: React.FC<ListProps> = ({ title, subTitle, children }) => {
  return (
    <>
      <div>
        <h3 className="heading">{title}</h3>
        {subTitle && <p className="description">{subTitle}</p>}
      </div>
      <div className="border-t border-gray-800 section">
        <dl className="divide-y divide-gray-800">{children}</dl>
      </div>
    </>
  );
};

export default withProperties(List, { Item: ListItem });
