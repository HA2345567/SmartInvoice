import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

export default function AuthSyncLoading() {
  return (
    <LuxuryLoader 
      label="Synchronizing credentials..." 
      sublabel="SmartInvoice Studio" 
      fullScreen={true} 
    />
  );
}
