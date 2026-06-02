import React from "react";

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}

export function InfoItem({
  label,
  value,
  icon,
  valueClassName = "text-foreground font-medium",
}: InfoItemProps) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
      <div className={valueClassName}>
        {icon}
        {value}
      </div>
    </div>
  );
}
