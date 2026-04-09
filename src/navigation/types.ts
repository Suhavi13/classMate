export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

export type TabsParamList = {
  HomeStack: undefined;
  StatsStack: undefined;
  CalendarStack: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Profile: undefined;
  AddItem: { mode?: 'task' | 'habit'; dateISO?: string } | undefined;
};

export type StatsStackParamList = {
  Stats: undefined;
  AddItem: { mode?: 'task' | 'habit'; dateISO?: string } | undefined;
};

export type CalendarStackParamList = {
  Calendar: undefined;
  AddItem: { mode?: 'task' | 'habit'; dateISO?: string } | undefined;
};
