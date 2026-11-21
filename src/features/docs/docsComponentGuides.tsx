export { ComponentDocCard } from './components/ComponentDocCard';
export type {
  ComponentDocCardProps,
  DocComponentGuideItem,
  DocPropRow,
} from './types';

import { FORM_ACTION_GUIDES } from './guides/formActionGuides';
import { FORM_ENTERPRISE_GUIDES } from './guides/formEnterpriseGuides';
import { SURFACE_NAVIGATION_GUIDES } from './guides/surfaceNavGuides';
import { DATA_FEEDBACK_GUIDES } from './guides/dataFeedbackGuides';
import { RICH_MODULE_GUIDES } from './guides/richModuleGuides';

export const FORM_CONTROL_GUIDES = [
  ...FORM_ACTION_GUIDES,
  ...FORM_ENTERPRISE_GUIDES,
];

export { SURFACE_NAVIGATION_GUIDES };

export const DATA_FEEDBACK_WEBGL_GUIDES = [
  ...DATA_FEEDBACK_GUIDES,
  ...RICH_MODULE_GUIDES,
];
