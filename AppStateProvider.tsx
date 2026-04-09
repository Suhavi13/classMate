import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import { useAuth } from '../auth/AuthProvider';
import type { AppState, Habit, Priority, Task } from './types';
import { toISODate } from '../utils/dates';

const STORAGE_PREFIX = 'classmate_app_state_v1:';

type AppActions = {
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskCompleted: (taskId: string) => void;
  addHabit: (input: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  setHabitCompletedForDate: (habitId: string, isoDate: string, completed: boolean) => void;
};

type AppContextValue = {
  state: AppState;
  actions: AppActions;
};

const AppContext = createContext<AppContextValue | null>(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function removePreviouslySeededDemoTasks(input: AppState): AppState {
  const seededIdPattern = /^2026-(03|04)-\d{2}_\d+_/;
  const filtered = input.tasks.filter((t) => !seededIdPattern.test(t.id));
  return filtered.length === input.tasks.length ? input : { ...input, tasks: filtered };
}

function emptyState(): AppState {
  return { tasks: [], habits: [] };
}

function hasSeed(state: AppState) {
  return state.tasks.some((t) => t.id.startsWith('seed:')) || state.habits.some((h) => h.id.startsWith('seed:'));
}

function sampleState(): AppState {
  const todayISO = toISODate(new Date());
  const calendarISO = '2022-09-20';
  const aprilISO = '2026-04-23';

  const tasks: Task[] = [
    {
      id: `seed:task:${todayISO}:maths`,
      name: 'Do maths assignment',
      notes: '',
      dateISO: todayISO,
      reminderTime: '9:00am',
      priority: 'medium',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${todayISO}:gift`,
      name: 'Buy gift for next week',
      notes: '',
      dateISO: todayISO,
      reminderTime: '9:00am',
      priority: 'low',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${todayISO}:mealprep`,
      name: 'Meal prep + groceries',
      notes: '',
      dateISO: todayISO,
      reminderTime: '9:00am',
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${todayISO}:oop`,
      name: 'OOP lab submission',
      notes: '',
      dateISO: todayISO,
      reminderTime: '9:00am',
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${todayISO}:research`,
      name: 'Research about project',
      notes: '',
      dateISO: todayISO,
      reminderTime: '9:00am',
      priority: 'medium',
      completed: false,
      createdAt: Date.now(),
    },
    // Calendar screen sample (September 20, 2022)
    {
      id: `seed:task:${calendarISO}:maths`,
      name: 'Do maths assignment',
      notes: '',
      dateISO: calendarISO,
      reminderTime: '9:00am',
      priority: 'medium',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${calendarISO}:gift`,
      name: 'Buy gift for next week',
      notes: '',
      dateISO: calendarISO,
      reminderTime: '9:00am',
      priority: 'low',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${calendarISO}:mealprep`,
      name: 'Meal prep + groceries',
      notes: '',
      dateISO: calendarISO,
      reminderTime: '9:00am',
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: `seed:task:${calendarISO}:oop`,
      name: 'OOP lab submission',
      notes: '',
      dateISO: calendarISO,
      reminderTime: '9:00am',
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
    },
    // Stats monthly progress sample (April 2026)
    {
      id: `seed:task:${aprilISO}:maths`,
      name: 'Do maths assignment',
      notes: '',
      dateISO: aprilISO,
      reminderTime: '9:00am',
      priority: 'medium',
      completed: true,
      createdAt: Date.now(),
    },
    {
      id: 'seed:task:2026-04-24:mealprep',
      name: 'Meal prep + groceries',
      notes: '',
      dateISO: '2026-04-24',
      reminderTime: '9:00am',
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
    },
  ];

  const habits: Habit[] = [
    {
      id: 'seed:habit:water',
      name: 'Drink more water',
      description: 'Aim for 8 cups today.',
      startDateISO: '2026-04-13',
      endDateISO: '2026-04-24',
      reminderTime: '9:00am',
      priority: 'medium',
      completions: {},
      createdAt: Date.now(),
    },
    {
      id: 'seed:habit:workout',
      name: 'Workout',
      description: '20–30 minutes.',
      startDateISO: '2026-04-13',
      endDateISO: '2026-04-24',
      reminderTime: '9:00am',
      priority: 'high',
      completions: { [todayISO]: true, [aprilISO]: true, '2026-04-05': true, '2026-04-12': true, '2026-04-19': true },
      createdAt: Date.now(),
    },
    {
      id: 'seed:habit:read',
      name: 'Read everyday',
      description: 'Read at least 10 pages.',
      startDateISO: '2026-04-13',
      endDateISO: '2026-04-24',
      reminderTime: '9:00am',
      priority: 'low',
      completions: { [todayISO]: true, [aprilISO]: true, '2026-04-02': true, '2026-04-09': true, '2026-04-16': true },
      createdAt: Date.now(),
    },
    {
      id: 'seed:habit:walk',
      name: 'Walk',
      description: 'Take a short walk.',
      startDateISO: '2026-04-13',
      endDateISO: '2026-04-24',
      reminderTime: '9:00am',
      priority: 'medium',
      completions: { [todayISO]: true, [aprilISO]: true, '2026-04-03': true, '2026-04-10': true, '2026-04-17': true, '2026-04-24': true },
      createdAt: Date.now(),
    },
  ];

  return { tasks, habits };
}

function ensureSeedData(input: AppState): AppState {
  if (hasSeed(input)) return input;
  const seed = sampleState();
  return { tasks: [...seed.tasks, ...input.tasks], habits: [...seed.habits, ...input.habits] };
}

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'addTask'; task: Task }
  | { type: 'toggleTaskCompleted'; taskId: string }
  | { type: 'addHabit'; habit: Habit }
  | { type: 'setHabitCompletedForDate'; habitId: string; isoDate: string; completed: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'addTask':
      return { ...state, tasks: [action.task, ...state.tasks] };
    case 'toggleTaskCompleted':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.taskId ? { ...t, completed: !t.completed } : t)),
      };
    case 'addHabit':
      return { ...state, habits: [action.habit, ...state.habits] };
    case 'setHabitCompletedForDate':
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.habitId) return h;
          return { ...h, completions: { ...h.completions, [action.isoDate]: action.completed } };
        }),
      };
    default:
      return state;
  }
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const { state: auth } = useAuth();
  const userId = auth.user?.id ?? null;
  const [state, dispatch] = useReducer(reducer, undefined, emptyState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!userId) {
          if (!cancelled) dispatch({ type: 'hydrate', state: emptyState() });
          return;
        }
        const raw = await AsyncStorage.getItem(`${STORAGE_PREFIX}${userId}`);
        if (!raw) {
          if (!cancelled) dispatch({ type: 'hydrate', state: ensureSeedData(emptyState()) });
          return;
        }
        const parsed = JSON.parse(raw) as AppState;
        if (!cancelled && parsed && typeof parsed === 'object') {
          dispatch({ type: 'hydrate', state: ensureSeedData(removePreviouslySeededDemoTasks(parsed)) });
        }
      } catch {
        // ignore (fallback to seed)
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (!userId) return;
      AsyncStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(state)).catch(() => {});
    }, 150);
    return () => clearTimeout(handle);
  }, [state, userId]);

  const addTask = useCallback(
    (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
      dispatch({
        type: 'addTask',
        task: { ...input, id: uid(), createdAt: Date.now(), completed: false },
      });
    },
    [dispatch]
  );

  const toggleTaskCompleted = useCallback((taskId: string) => {
    dispatch({ type: 'toggleTaskCompleted', taskId });
  }, []);

  const addHabit = useCallback(
    (input: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
      dispatch({
        type: 'addHabit',
        habit: { ...input, id: uid(), createdAt: Date.now(), completions: {} },
      });
    },
    [dispatch]
  );

  const setHabitCompletedForDate = useCallback((habitId: string, isoDate: string, completed: boolean) => {
    dispatch({ type: 'setHabitCompletedForDate', habitId, isoDate, completed });
  }, []);

  const actions = useMemo<AppActions>(
    () => ({ addTask, toggleTaskCompleted, addHabit, setHabitCompletedForDate }),
    [addTask, toggleTaskCompleted, addHabit, setHabitCompletedForDate]
  );

  const value = useMemo<AppContextValue>(() => ({ state, actions }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}

export const priorityLabels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
