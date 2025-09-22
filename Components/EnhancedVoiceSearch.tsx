import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { SpeechToText } from './SpeechToText';
import { Mic, MicOff, Volume2, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EnhancedVoiceSearchProps {
  onVoiceResult: (text: string, type: 'bus-number' | 'route-name') => void;
  currentSearchType?: 'route-planning' | 'bus-number' | 'route-search';
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
}

export function EnhancedVoiceSearch({ 
  onVoiceResult, 
  currentSearchType = 'bus-number',
  isVisible = false,
  onToggle
}: EnhancedVoiceSearchProps) {
  const [lastResult, setLastResult] = useState<{ text: string; type: string; timestamp: Date } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Clear old results after 30 seconds
  useEffect(() => {
    if (lastResult) {
      const timer = setTimeout(() => {
        setLastResult(null);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  const processVoiceResult = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Enhanced classification logic
      const result = classifyVoiceInput(text);
      
      setLastResult({
        text: result.processedText,
        type: result.type,
        timestamp: new Date()
      });
      
      // Provide feedback
      toast.success(`Voice input processed as ${result.type}: "${result.processedText}"`);
      
      // Call the callback
      onVoiceResult(result.processedText, result.type);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Error processing voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const classifyVoiceInput = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Bus number patterns and keywords
    const busPatterns = [
      /\bb\s*\d+/i,           // "B 001", "b15"
      /\bm\s*\d+/i,           // "M 15", "metro 7"
      /\bt\s*\d+/i,           // "T 7", "tram 3"
      /\bbus\s*\d+/i,         // "bus 15"
      /\bmetro\s*\d+/i,       // "metro 7"
      /\btram\s*\d+/i,        // "tram 3"
      /^\d+[a-z]*$/i,         // "15", "15A"
      /^[a-z]+\d+$/i          // "BUS15", "M7"
    ];
    
    // Route keywords and patterns
    const routeKeywords = [
      'loop', 'line', 'route', 'express', 'downtown', 'university', 
      'airport', 'north', 'south', 'east', 'west', 'green', 'blue', 
      'red', 'yellow', 'central', 'main', 'circle'
    ];
    
    const hasBusPattern = busPatterns.some(pattern => pattern.test(lowerText));
    const hasRouteKeyword = routeKeywords.some(keyword => lowerText.includes(keyword));
    
    // Process based on classification
    if (hasBusPattern && !hasRouteKeyword) {
      return {
        type: 'bus-number' as const,
        processedText: processBusNumber(text)
      };
    } else if (hasRouteKeyword) {
      return {
        type: 'route-name' as const,
        processedText: processRouteName(text)
      };
    } else {
      // Fallback based on current search context
      if (currentSearchType === 'route-search') {
        return {
          type: 'route-name' as const,
          processedText: processRouteName(text)
        };
      } else {
        return {
          type: 'bus-number' as const,
          processedText: processBusNumber(text)
        };
      }
    }
  };

  const processBusNumber = (text: string): string => {
    return text
      .replace(/\b(bus|number|metro|tram|vehicle)\b/gi, '')
      .replace(/\b(zero|oh)\b/gi, '0')
      .replace(/\bone\b/gi, '1')
      .replace(/\btwo\b/gi, '2')
      .replace(/\bthree\b/gi, '3')
      .replace(/\bfour\b/gi, '4')
      .replace(/\bfive\b/gi, '5')
      .replace(/\bsix\b/gi, '6')
      .replace(/\bseven\b/gi, '7')
      .replace(/\beight\b/gi, '8')
      .replace(/\bnine\b/gi, '9')
      .replace(/\bten\b/gi, '10')
      .replace(/\beleven\b/gi, '11')
      .replace(/\btwelve\b/gi, '12')
      .replace(/\bthirteen\b/gi, '13')
      .replace(/\bfourteen\b/gi, '14')
      .replace(/\bfifteen\b/gi, '15')
      .replace(/\s+/g, '')
      .trim()
      .toUpperCase();
  };

  const processRouteName = (text: string): string => {
    const routeMap = {
      'downtown': 'Downtown Loop',
      'university': 'University Route',
      'north south': 'North-South Line',
      'green': 'Green Line',
      'airport': 'Airport Express',
      'blue': 'Metro Blue Line'
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [key, value] of Object.entries(routeMap)) {
      if (lowerText.includes(key)) {
        return value;
      }
    }
    
    // Format as title case if no match found
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSuggestions = () => {
    if (currentSearchType === 'bus-number') {
      return [
        '"B zero zero one"',
        '"Metro fifteen"',
        '"Bus twenty"',
        '"T seven"'
      ];
    } else {
      return [
        '"Downtown Loop"',
        '"University Route"',
        '"Airport Express"',
        '"Green Line"'
      ];
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Enhanced Voice Search</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(false)}
              className="text-muted-foreground"
            >
              <MicOff className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Context Information */}
        <Alert>
          <Volume2 className="h-4 w-4" />
          <AlertDescription>
            Currently optimized for{' '}
            <strong>
              {currentSearchType === 'bus-number' ? 'bus numbers' : 
               currentSearchType === 'route-search' ? 'route names' : 
               'route planning'}
            </strong>
            . Speak clearly for best results.
          </AlertDescription>
        </Alert>

        {/* Voice Input Component */}
        <div className="space-y-3">
          <SpeechToText
            onTextReceived={processVoiceResult}
            placeholder="Voice input will be automatically processed and classified"
          />
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            Processing voice input...
          </div>
        )}

        {/* Last Result */}
        {lastResult && !isProcessing && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  Processed as {lastResult.type.replace('-', ' ')}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  "{lastResult.text}"
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {lastResult.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">💡 Try saying:</div>
          <div className="flex flex-wrap gap-1">
            {getSuggestions().map((suggestion, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>🎯 <strong>Tips for better recognition:</strong></p>
          <ul className="list-disc list-inside text-xs space-y-0.5 ml-2">
            <li>Speak clearly and at a normal pace</li>
            <li>Say numbers as individual digits: "zero zero one"</li>
            <li>Use full route names when possible</li>
            <li>Minimize background noise</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}