import { Loader2 } from 'lucide-react';

export default function AgentLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
        <p style={{ color: '#b3b3b3' }}>Loading AI Payment Agent...</p>
      </div>
    </div>
  );
}
