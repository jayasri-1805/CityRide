import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Mic, MicOff, Square, Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SpeechToTextProps {
  onTextReceived: (text: string) => void;
  placeholder?: string;
  className?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Extend Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

const languages = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' }
];

export function SpeechToText({ onTextReceived, placeholder, className }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
        setFinalText('');
        toast.success('Voice recognition started. Speak now...');
        
        // Auto-stop after 30 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognition && isListening) {
            recognition.stop();
            toast.info('Voice recognition stopped automatically after 30 seconds');
          }
        }, 30000);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        setInterimText(interim);
        if (final) {
          setFinalText(prev => prev + final);
          const completeText = (finalText + final).trim();
          if (completeText) {
            onTextReceived(completeText);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please connect a microphone.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed in this context.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast.error(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        if (finalText.trim()) {
          toast.success('Voice input completed');
        }
      };
    } else {
      console.warn('Speech Recognition not supported in this browser');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedLanguage, finalText, isListening, onTextReceived]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    if (isListening) {
      // Restart recognition with new language
      stopListening();
      setTimeout(() => {
        startListening();
      }, 100);
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        <p>Speech recognition is not supported in this browser.</p>
        <p>Please try using Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Language Selector Toggle */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Globe className="w-3 h-3 mr-1" />
          {selectedLang ? `${selectedLang.flag} ${selectedLang.name}` : 'Select Language'}
        </Button>
        
        {/* Recording Status */}
        {isListening && (
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-ping" />
            Recording...
          </Badge>
        )}
      </div>

      {/* Language Selector */}
      {showLanguageSelector && (
        <div className="p-3 border rounded-lg bg-muted/30">
          <label className="block text-sm font-medium mb-2">Select Language</label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex items-center gap-2">
        {!isListening ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startListening}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Voice Input
          </Button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={stopListening}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Recording
          </Button>
        )}
        
        {isListening && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={stopListening}
            className="text-muted-foreground"
          >
            <MicOff className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Interim Results */}
      {(interimText || finalText) && (
        <div className="p-3 border rounded-lg bg-muted/20">
          <div className="text-sm">
            {finalText && (
              <span className="text-foreground font-medium">{finalText}</span>
            )}
            {interimText && (
              <span className="text-muted-foreground italic">{interimText}</span>
            )}
          </div>
          {placeholder && !finalText && !interimText && (
            <div className="text-xs text-muted-foreground mt-1">
              {placeholder}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!isListening && !finalText && (
        <div className="text-xs text-muted-foreground">
          <p>Click "Start Voice Input" and speak clearly. Supports {languages.length} languages.</p>
          <p>For best results, speak bus numbers like "B zero zero one" or "Metro fifteen".</p>
        </div>
      )}
    </div>
  );
}