import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

const ExpenseContext = createContext();

// Initial state
const initialState = {
    expenses: [],
    monthlyBudget: null,
    categories: ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Misc'],
    loading: false,
    error: null,
    lastUpdated: null
};

// Reducer function
const expenseReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
            
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                expenses: action.payload.expenses || state.expenses,
                monthlyBudget: action.payload.monthlyBudget ?? state.monthlyBudget,
                lastUpdated: new Date().toISOString()
            };
            
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
            
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [...state.expenses, action.payload],
                lastUpdated: new Date().toISOString()
            };
            
        case 'UPDATE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map(expense =>
                    expense.id === action.payload.id ? action.payload : expense
                ),
                lastUpdated: new Date().toISOString()
            };
            
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload),
                lastUpdated: new Date().toISOString()
            };
            
        case 'SET_BUDGET':
            return {
                ...state,
                monthlyBudget: action.payload,
                lastUpdated: new Date().toISOString()
            };
            
        case 'IMPORT_EXPENSES':
            return {
                ...state,
                expenses: [...state.expenses, ...action.payload],
                lastUpdated: new Date().toISOString()
            };
            
        case 'CLEAR_ERROR':
            return { ...state, error: null };
            
        default:
            return state;
    }
};

// API request helper with retry logic
const apiRequest = async (url, options = {}, retries = MAX_RETRIES) => {
    const token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { ...options, headers });
            
            if (response.status === 401) {
                // Handle unauthorized
                localStorage.removeItem('jwt');
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
        }
    }
};

// Provider component
export const ExpenseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(expenseReducer, initialState);

    // Load initial state from API and local budget cache
    useEffect(() => {
        const loadInitialData = async () => {
            dispatch({ type: 'FETCH_START' });
            
            try {
                // Load budget from localStorage
                const savedBudget = localStorage.getItem('monthlyBudget');
                if (savedBudget) {
                    dispatch({ type: 'SET_BUDGET', payload: parseFloat(savedBudget) });
                }

                // Fetch expenses from API
                const expenses = await apiRequest('/api/expenses');
                const normalized = Array.isArray(expenses) 
                    ? expenses.map(e => ({ ...e, id: e.id ?? e._id })) 
                    : [];
                    
                dispatch({ 
                    type: 'FETCH_SUCCESS', 
                    payload: { expenses: normalized } 
                });
            } catch (error) {
                console.error('Failed to load expenses:', error);
                dispatch({ 
                    type: 'FETCH_ERROR', 
                    payload: error.message || 'Failed to load expenses' 
                });
            }
        };

        loadInitialData();
    }, []);

    // Save budget to localStorage when it changes
    useEffect(() => {
        if (state.monthlyBudget != null) {
            localStorage.setItem('monthlyBudget', state.monthlyBudget.toString());
        }
    }, [state.monthlyBudget]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (state.error) {
            const timer = setTimeout(() => {
                dispatch({ type: 'CLEAR_ERROR' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [state.error]);

    // Add a new expense
    const addExpense = async (expense) => {
        try {
            const payload = {
                ...expense,
                amount: parseFloat(expense.amount),
                date: expense.date || new Date().toISOString().split('T')[0]
            };

            const created = await apiRequest('/api/expenses', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const normalized = { ...created, id: created.id ?? created._id };
            dispatch({ type: 'ADD_EXPENSE', payload: normalized });
            return { success: true, data: normalized };
        } catch (error) {
            console.error('Error adding expense:', error);
            dispatch({ 
                type: 'FETCH_ERROR', 
                payload: error.message || 'Failed to add expense' 
            });
            return { success: false, error: error.message };
        }
    };

    // Update an existing expense
    const updateExpense = async (id, updates) => {
        try {
            const updated = await apiRequest(`/api/expenses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates)
            });

            const normalized = { ...updated, id: updated.id ?? updated._id };
            dispatch({ type: 'UPDATE_EXPENSE', payload: normalized });
            return { success: true, data: normalized };
        } catch (error) {
            console.error('Error updating expense:', error);
            dispatch({ 
                type: 'FETCH_ERROR', 
                payload: error.message || 'Failed to update expense' 
            });
            return { success: false, error: error.message };
        }
    };

    // Delete an expense
    const deleteExpense = async (id) => {
        try {
            await apiRequest(`/api/expenses/${id}`, {
                method: 'DELETE'
            });
            
            dispatch({ type: 'DELETE_EXPENSE', payload: id });
            return { success: true };
        } catch (error) {
            console.error('Error deleting expense:', error);
            dispatch({ 
                type: 'FETCH_ERROR', 
                payload: error.message || 'Failed to delete expense' 
            });
            return { success: false, error: error.message };
        }
    };

    // Set monthly budget
    const setMonthlyBudget = (amount) => {
        const budget = parseFloat(amount);
        if (isNaN(budget) || budget < 0) {
            const error = new Error('Invalid budget amount');
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
        
        dispatch({ type: 'SET_BUDGET', payload: budget });
        return { success: true };
    };

    // Import multiple expenses
    const importExpenses = async (expenses) => {
        try {
            const createdExpenses = await Promise.all(
                expenses.map(expense => 
                    apiRequest('/api/expenses', {
                        method: 'POST',
                        body: JSON.stringify({
                            ...expense,
                            amount: parseFloat(expense.amount),
                            date: expense.date || new Date().toISOString().split('T')[0]
                        })
                    })
                )
            );
            
            const normalized = createdExpenses.map(exp => ({
                ...exp,
                id: exp.id ?? exp._id
            }));
            
            dispatch({ type: 'IMPORT_EXPENSES', payload: normalized });
            return { success: true, data: normalized };
        } catch (error) {
            console.error('Error importing expenses:', error);
            dispatch({ 
                type: 'FETCH_ERROR', 
                payload: error.message || 'Failed to import expenses' 
            });
            return { success: false, error: error.message };
        }
    };

    // Clear error manually
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Refresh expenses from server
    const refreshExpenses = async () => {
        try {
            dispatch({ type: 'FETCH_START' });
            const expenses = await apiRequest('/api/expenses');
            const normalized = Array.isArray(expenses) 
                ? expenses.map(e => ({ ...e, id: e.id ?? e._id })) 
                : [];
                
            dispatch({ 
                type: 'FETCH_SUCCESS', 
                payload: { expenses: normalized } 
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to refresh expenses:', error);
            dispatch({ 
                type: 'FETCH_ERROR', 
                payload: error.message || 'Failed to refresh expenses' 
            });
            return { success: false, error: error.message };
        }
    };

    const getCurrentMonthExpenses = () => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        return state.expenses.filter(expense => {
            const expenseDate = new Date(expense.date)
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
        })
    }

    const value = {
        // State
        expenses: state.expenses,
        monthlyBudget: state.monthlyBudget,
        categories: state.categories,
        loading: state.loading,
        error: state.error,
        lastUpdated: state.lastUpdated,
        
        // Actions
        addExpense,
        updateExpense,
        deleteExpense,
        setMonthlyBudget,
        importExpenses,
        clearError,
        refreshExpenses,
        getCurrentMonthExpenses
    }

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
};

// Hook to use the expense context
export const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpense must be used within an ExpenseProvider');
    }
    return context;
};