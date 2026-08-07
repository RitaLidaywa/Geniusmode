export type HomeStackParamList = {
  Home: undefined;
};

export type JournalStackParamList = {
  JournalList: undefined;
  JournalEntry: { entryId?: string; prompt?: string } | undefined;
};

export type MoodStackParamList = {
  Mood: undefined;
};

export type ToolkitStackParamList = {
  ToolkitHome: undefined;
  Reframe: undefined;
  UrgeSurf: undefined;
  UnsentLetterList: undefined;
  UnsentLetterCompose: { letterId?: string } | undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  Crisis: undefined;
};

export type RootTabParamList = {
  HomeTab: undefined;
  JournalTab: undefined;
  MoodTab: undefined;
  ToolkitTab: undefined;
  SettingsTab: { screen?: keyof SettingsStackParamList } | undefined;
};
