import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

export default function AuthCallbackLoading() {
  return (
    <LuxuryLoader 
      label="Completing secure sign in..." 
      sublabel="SmartInvoice Studio" 
      fullScreen={true} 
    />
  );
}
