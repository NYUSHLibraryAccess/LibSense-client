import { OrderTag } from '@/types/OrderTag';

const orderTagColors: Record<OrderTag | 'default', string> = {
  Rush: 'border-red-300 bg-red-100 text-red-900',
  'Non-Rush': 'border-gray-300 bg-gray-100 text-gray-900',
  CDL: 'border-blue-300 bg-blue-100 text-blue-900',
  Local: 'border-lime-300 bg-lime-100 text-lime-900',
  NY: 'border-violet-300 bg-violet-100 text-violet-900',
  Reserve: 'border-teal-300 bg-teal-100 text-teal-900',
  DVD: 'border-pink-300 bg-pink-100 text-pink-900',
  ILL: 'border-yellow-300 bg-yellow-100 text-yellow-900',
  Sensitive: 'border-orange-300 bg-orange-100 text-orange-900',
  default: 'border-gray-300 bg-gray-100 text-gray-900',
};

export { orderTagColors };
