export const theme = {
  colors: {
    background: {
      primary: '#0A0A0F',
      secondary: '#12121A',
      surface: '#1A1A24',
      elevated: '#22222E',
    },
    accent: {
      primary: '#8B5CF6',
      primaryHover: '#A78BFA',
      secondary: '#06B6D4',
      secondaryHover: '#22D3EE',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9CA3AF',
      muted: '#6B7280',
    },
    border: {
      default: '#27272A',
      hover: '#3F3F46',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
  gradients: {
    accent: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    accentHover: 'linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%)',
  },
} as const;

export type Theme = typeof theme;