import QuestionMark from '@mui/icons-material/QuestionMark';
import MUITooltip from '@mui/material/Tooltip';

interface TooltipProps {
  title: string;
}

export const Tooltip = ({ title }: TooltipProps) => (
  <MUITooltip title={title}>
    <QuestionMark className="ml-1.5 rounded-full bg-accent/15 p-0.5 text-accent-strong" sx={{ fontSize: 15 }} />
  </MUITooltip>
);
