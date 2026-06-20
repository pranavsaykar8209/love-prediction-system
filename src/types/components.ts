import React from 'react';

export interface CardProps {
  stepNumber?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  ctaText?: string;
  onLogoClick?: () => void;
  onCtaClick?: () => void;
  onHistoryClick?: () => void;
  showNavLinks?: boolean;
}

export interface SectionProps {
  id?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}
