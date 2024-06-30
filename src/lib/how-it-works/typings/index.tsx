export interface ForSectionProps {
  bgColor?: boolean;
  spacingClass?: string;
  title?: string;
  items: WorkItem[];
}
export interface WorkItem {
  id: string;
  title: string;
  body: string;
  links?: {
    href: string;
    title: string;
  }[];
}

export interface WorkItemProps extends WorkItem {}
