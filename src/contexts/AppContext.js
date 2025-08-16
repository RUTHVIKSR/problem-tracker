import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  theme: 'light',
  problems: [],
  patterns: [],
  templates: []
};

// Action types
const actionTypes = {
  SET_THEME: 'SET_THEME',
  SET_PROBLEMS: 'SET_PROBLEMS',
  ADD_PROBLEM: 'ADD_PROBLEM',
  DELETE_PROBLEM: 'DELETE_PROBLEM',
  SET_PATTERNS: 'SET_PATTERNS',
  ADD_PATTERN: 'ADD_PATTERN',
  DELETE_PATTERN: 'DELETE_PATTERN',
  SET_TEMPLATES: 'SET_TEMPLATES',
  ADD_TEMPLATE: 'ADD_TEMPLATE',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case actionTypes.SET_PROBLEMS:
      return { ...state, problems: action.payload };
    case actionTypes.ADD_PROBLEM:
      return { ...state, problems: [...state.problems, action.payload] };
    case actionTypes.DELETE_PROBLEM:
      return {
        ...state,
        problems: state.problems.filter((_, index) => index !== action.payload)
      };
    case actionTypes.SET_PATTERNS:
      return { ...state, patterns: action.payload };
    case actionTypes.ADD_PATTERN:
      return { ...state, patterns: [...state.patterns, action.payload] };
    case actionTypes.DELETE_PATTERN:
      return {
        ...state,
        patterns: state.patterns.filter((_, index) => index !== action.payload)
      };
    case actionTypes.SET_TEMPLATES:
      return { ...state, templates: action.payload };
    case actionTypes.ADD_TEMPLATE:
      return { ...state, templates: [...state.templates, action.payload] };
    case actionTypes.DELETE_TEMPLATE:
      return {
        ...state,
        templates: state.templates.filter((_, index) => index !== action.payload)
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Local storage utilities
const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Context Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedProblems = getFromStorage('problems');
    const savedPatterns = getFromStorage('patterns');
    const savedTemplates = getFromStorage('templates');

    dispatch({ type: actionTypes.SET_THEME, payload: savedTheme });
    dispatch({ type: actionTypes.SET_PROBLEMS, payload: savedProblems });
    dispatch({ type: actionTypes.SET_PATTERNS, payload: savedPatterns });
    dispatch({ type: actionTypes.SET_TEMPLATES, payload: savedTemplates });
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    document.body.className = state.theme === 'dark' ? 'dark-mode' : '';
  }, [state.theme]);

  useEffect(() => {
    saveToStorage('problems', state.problems);
  }, [state.problems]);

  useEffect(() => {
    saveToStorage('patterns', state.patterns);
  }, [state.patterns]);

  useEffect(() => {
    saveToStorage('templates', state.templates);
  }, [state.templates]);

  // Action creators
  const actions = {
    setTheme: (theme) => dispatch({ type: actionTypes.SET_THEME, payload: theme }),
    addProblem: (problem) => dispatch({ type: actionTypes.ADD_PROBLEM, payload: problem }),
    deleteProblem: (index) => dispatch({ type: actionTypes.DELETE_PROBLEM, payload: index }),
    addPattern: (pattern) => {
      if (!state.patterns.includes(pattern)) {
        dispatch({ type: actionTypes.ADD_PATTERN, payload: pattern });
      }
    },
    deletePattern: (index) => dispatch({ type: actionTypes.DELETE_PATTERN, payload: index }),
    addTemplate: (template) => dispatch({ type: actionTypes.ADD_TEMPLATE, payload: template }),
    deleteTemplate: (index) => dispatch({ type: actionTypes.DELETE_TEMPLATE, payload: index })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
