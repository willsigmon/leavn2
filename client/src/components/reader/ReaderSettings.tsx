import React, { useState, useEffect } from 'react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Moon, Sun, Type, Palette, Maximize, Monitor, SlidersHorizontal } from 'lucide-react';

interface ReaderSettingsProps {
  onSettingsChange: (settings: ReaderSettingsState) => void;
  initialSettings?: ReaderSettingsState;
}

export interface ReaderSettingsState {
  fontSize: number;
  lineSpacing: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'system';
  showVerseNumbers: boolean;
  showChapterNumbers: boolean;
  enableDyslexicFont: boolean;
  enableComfortLight: boolean;
  paragraphView: boolean;
  columnWidth: number;
}

const DEFAULT_SETTINGS: ReaderSettingsState = {
  fontSize: 16,
  lineSpacing: 1.6,
  fontFamily: 'serif',
  theme: 'system',
  showVerseNumbers: true,
  showChapterNumbers: true,
  enableDyslexicFont: false,
  enableComfortLight: false,
  paragraphView: false,
  columnWidth: 70,
};

// Available font families
const FONT_OPTIONS = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans-serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: 'Baskerville, serif', label: 'Baskerville' },
  { value: 'Garamond, serif', label: 'Garamond' },
];

const ReaderSettings: React.FC<ReaderSettingsProps> = ({ 
  onSettingsChange,
  initialSettings = DEFAULT_SETTINGS 
}) => {
  const [settings, setSettings] = useState<ReaderSettingsState>(initialSettings);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        onSettingsChange(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved reader settings:', error);
        // If there's an error, use the default or initial settings
        setSettings(initialSettings);
      }
    } else {
      // If no saved settings, use the provided initial settings
      setSettings(initialSettings);
    }
  }, []);

  // Save settings to localStorage and notify parent component when settings change
  const updateSettings = (updatedSettings: Partial<ReaderSettingsState>) => {
    const newSettings = { ...settings, ...updatedSettings };
    setSettings(newSettings);
    localStorage.setItem('readerSettings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('readerSettings', JSON.stringify(DEFAULT_SETTINGS));
    onSettingsChange(DEFAULT_SETTINGS);
    toast({
      title: 'Settings reset',
      description: 'Reader settings have been restored to defaults.',
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full"
          aria-label="Reader Settings"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Reader Settings
            </DrawerTitle>
            <DrawerDescription>
              Customize your reading experience with these options
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4">
            <div className="space-y-6">
              {/* Text Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4" />
                  Text Options
                </div>
                
                <div className="grid gap-4">
                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
                      <span className="text-xs text-muted-foreground">{settings.fontSize}px</span>
                    </div>
                    <Slider
                      id="fontSize"
                      min={12}
                      max={28}
                      step={1}
                      value={[settings.fontSize]}
                      onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>A</span>
                      <span className="text-base">A</span>
                    </div>
                  </div>
                  
                  {/* Line Spacing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="lineSpacing">Line Spacing</Label>
                      <span className="text-xs text-muted-foreground">{settings.lineSpacing.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="lineSpacing"
                      min={1}
                      max={2.5}
                      step={0.1}
                      value={[settings.lineSpacing]}
                      onValueChange={(value) => updateSettings({ lineSpacing: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Compact</span>
                      <span>Spacious</span>
                    </div>
                  </div>
                  
                  {/* Column Width */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="columnWidth">Column Width</Label>
                      <span className="text-xs text-muted-foreground">{settings.columnWidth}%</span>
                    </div>
                    <Slider
                      id="columnWidth"
                      min={50}
                      max={100}
                      step={5}
                      value={[settings.columnWidth]}
                      onValueChange={(value) => updateSettings({ columnWidth: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Narrow</span>
                      <span>Full Width</span>
                    </div>
                  </div>
                  
                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      value={settings.fontFamily}
                      onValueChange={(value) => updateSettings({ fontFamily: value })}
                    >
                      <SelectTrigger id="fontFamily">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Theme Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="h-4 w-4" />
                  Theme & Display
                </div>
                
                <div className="grid gap-4">
                  {/* Theme Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value: 'light' | 'dark' | 'system') => updateSettings({ theme: value })}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center">
                            <Monitor className="h-4 w-4 mr-2" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Paragraph View Toggle */}
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="paragraphView" className="flex-1">Paragraph View</Label>
                    <Switch
                      id="paragraphView"
                      checked={settings.paragraphView}
                      onCheckedChange={(checked) => updateSettings({ paragraphView: checked })}
                    />
                  </div>
                  
                  {/* Show Verse Numbers Toggle */}
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="showVerseNumbers" className="flex-1">Show Verse Numbers</Label>
                    <Switch
                      id="showVerseNumbers"
                      checked={settings.showVerseNumbers}
                      onCheckedChange={(checked) => updateSettings({ showVerseNumbers: checked })}
                    />
                  </div>
                  
                  {/* Dyslexic Font */}
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableDyslexicFont" className="flex-1">
                      <div>OpenDyslexic Font</div>
                      <span className="text-xs text-muted-foreground">Improves readability for readers with dyslexia</span>
                    </Label>
                    <Switch
                      id="enableDyslexicFont"
                      checked={settings.enableDyslexicFont}
                      onCheckedChange={(checked) => updateSettings({ enableDyslexicFont: checked })}
                    />
                  </div>
                  
                  {/* ComfortLight Feature */}
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableComfortLight" className="flex-1">
                      <div>ComfortLight</div>
                      <span className="text-xs text-muted-foreground">Warm light feature for reduced eye strain</span>
                    </Label>
                    <Switch
                      id="enableComfortLight"
                      checked={settings.enableComfortLight}
                      onCheckedChange={(checked) => updateSettings({ enableComfortLight: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DrawerFooter>
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={resetSettings}>
                Reset to Defaults
              </Button>
              <DrawerClose asChild>
                <Button className="bg-[#2c4c3b] hover:bg-[#1a3329]">Apply Changes</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ReaderSettings;