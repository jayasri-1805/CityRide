import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SpeechToText } from './SpeechToText';
import { Mic, Volume2, Globe, Zap } from 'lucide-react';

interface VoiceSearchDemoProps {
  onVoiceResult: (text: string, type: 'bus-number' | 'route-name') => void;
}

export function VoiceSearchDemo({ onVoiceResult }: VoiceSearchDemoProps) {
  const [showDemo, setShowDemo] = useState(false);
  const [lastResult, setLastResult] = useState<{ text: string; type: string } | null>(null);

  const handleVoiceResult = (text: string) => {
    // Determine if it's likely a bus number or route name
    const isBusNumber = /^[A-Z]?\d+[A-Z]?$|^[A-Z]+\d+$/.test(text.replace(/\s/g, ''));
    const type = isBusNumber ? 'bus-number' : 'route-name';
    
    setLastResult({ text, type });
    onVoiceResult(text, type);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Mic className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Voice Search</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Zap className="w-3 h-3 mr-1" />
              New
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDemo(!showDemo)}
            className="border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20"
          >
            {showDemo ? 'Hide' : 'Try Voice Search'}
          </Button>
        </div>
      </CardHeader>
      
      {!showDemo && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4" />
              <span>Speak naturally</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>20+ languages</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Mic className="w-4 h-4" />
              <span>Bus numbers & routes</span>
            </div>
          </div>
          
          {lastResult && (
            <div className="mt-3 p-2 bg-white/60 dark:bg-black/20 rounded border">
              <div className="text-xs text-muted-foreground">Last voice input:</div>
              <div className="font-medium">"{lastResult.text}" → {lastResult.type}</div>
            </div>
          )}
        </CardContent>
      )}

      {showDemo && (
        <CardContent className="pt-0 space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">🎤 <strong>Try saying:</strong></p>
            <ul className="space-y-1 text-xs">
              <li>• "B zero zero one" or "Bus fifteen"</li>
              <li>• "Downtown Loop" or "University Route"</li>
              <li>• "Metro Blue Line" or "Airport Express"</li>
            </ul>
          </div>
          
          <SpeechToText
            onTextReceived={handleVoiceResult}
            placeholder="Voice input will appear here and be automatically processed"
          />
          
          <div className="text-xs text-blue-600 dark:text-blue-400">
            <p>✨ Voice input will automatically fill the appropriate search field based on what you say.</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}