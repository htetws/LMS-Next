import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const bannerVariant = cva("border text-center p-4 w-full flex items-center", {
  variants: {
    variant: {
      warning: "bg-yellow-200/80 border-yellow-30 text-primary",
      success: "bg-emerald-700 border-emerald-800 text-secondary",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

type bannerVariantProps = VariantProps<typeof bannerVariant>;

interface BannerProps extends bannerVariantProps {
  label: string;
}

export const Banner = ({ label, variant }: BannerProps) => {
  const IconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
  };

  const Icon = IconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariant({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};
