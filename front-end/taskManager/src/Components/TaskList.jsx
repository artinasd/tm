import {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import Table from './Costume UI Components/Table.jsx';
import {api, ApiError} from '../services/api.js';
import {useSelector} from 'react-redux';

function getAccountCode(userInfo) {
    return userInfo?.accountCode || userInfo?.accountID || userInfo?.account?.accountCode || userInfo?.account?.accountID;
}

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {year: 'numeric', month: 'short', day: 'numeric'}).format(date);
}

function getStatus(task) {
    return task?.taskStatus?.taskStatusType?.type || task?.taskStatus?.type || 'UNKNOWN';
}

function getPersonName(employment) {
    const account = employment?.employee?.account || employment?.account;
    if (!account) return '—';
    return [account.firstName, account.lastName].filter(Boolean).join(' ') || account.accountName || account.accountID || '—';
}

function getPriorityRank(priority) {
    const value = String(priority || '').toLowerCase();
    if (value === 'critical') return 4;
    if (value === 'high') return 3;
    if (value === 'medium') return 2;
    if (value === 'low') return 1;
    return 0;
}

function getDeadlineTimestamp(task) {
    const timestamp = new Date(task?.deadline || '').getTime();
    return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function TaskList() {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.loggedUser.userInfo);
    const accountCode = getAccountCode(userInfo);
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState('');
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('deadline');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadTasks = useCallback(async () => {
        if (!accountCode) {
            setError('Your account code is not available. Please sign in again.');
            return;
        }
        if (!status.trim()) {
            setError('The current backend task-list endpoint requires a task status. Enter an existing status type to load tasks.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/tasks/${encodeURIComponent(accountCode)}?status=${encodeURIComponent(status.trim())}`, {headers: {'Accept': 'application/json'}});
            setTasks(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to load your tasks.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [accountCode, status]);

    useEffect(() => {
        setTasks([]);
        setError(null);
    }, [accountCode]);

    const visibleTasks = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = normalizedQuery
            ? tasks.filter(task => [
                task.taskCode,
                task.title,
                task.description,
                task.priority,
                getStatus(task),
                getPersonName(task.responsible),
                getPersonName(task.owner),
            ]
                .filter(Boolean)
                .some(value => String(value).toLowerCase().includes(normalizedQuery)))
            : [...tasks];

        return filtered.sort((first, second) => {
            if (sortBy === 'title') return String(first.title || '').localeCompare(String(second.title || ''));
            if (sortBy === 'priority') return getPriorityRank(second.priority) - getPriorityRank(first.priority);
            if (sortBy === 'deadline') return getDeadlineTimestamp(first) - getDeadlineTimestamp(second);
            return 0;
        });
    }, [query, sortBy, tasks]);

    const clearFilters = () => {
        setQuery('');
        setSortBy('deadline');
    };

    const headers = ['TASK', 'STATUS', 'DUE DATE', 'PRIORITY', 'RESPONSIBLE'];
    const rows = visibleTasks.map(task => [
        <button key={`${task.taskCode}-title`} onClick={() => navigate(`/home/tasks/${task.taskCode}`)} className="font-medium text-white hover:underline text-left">
            {task.title || 'Untitled task'}
        </button>,
        getStatus(task),
        formatDate(task.deadline),
        task.priority || '—',
        getPersonName(task.responsible),
    ]);

    const hasLocalFilters = query.trim() || sortBy !== 'deadline';

    return (
        <div className='flex flex-col h-full w-full'>
            <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                <div>
                    <h2 className='text-2xl font-bold mb-1'>Tasks</h2>
                    <p className='text2'>Load tasks for your account by an existing backend status type.</p>
                </div>
                <button onClick={() => navigate('/home/new-task')} className='theme rounded-full px-4 py-2 hover:bg-[#4f46e5] self-start'>+ Add New Task</button>
            </div>

            <div className='rounded-lg bg2 p-4 mt-6 flex flex-col md:flex-row gap-3'>
                <input value={status} onChange={event => setStatus(event.target.value)} placeholder='Status type (required by API)' aria-label='Task status type' className='border border-gray-600 rounded-md px-3 py-2 bg-transparent md:w-64 focus:outline-none focus:border-indigo-500' />
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder='Search loaded tasks...' aria-label='Search loaded tasks' className='border border-gray-600 rounded-md px-3 py-2 bg-transparent flex-1 focus:outline-none focus:border-indigo-500' />
                <select value={sortBy} onChange={event => setSortBy(event.target.value)} aria-label='Sort tasks' className='border border-gray-600 rounded-md px-3 py-2 bg2 md:w-44 focus:outline-none focus:border-indigo-500'>
                    <option value='deadline'>Sort: Due date</option>
                    <option value='title'>Sort: Title</option>
                    <option value='priority'>Sort: Priority</option>
                </select>
                {hasLocalFilters && (
                    <button onClick={clearFilters} className='rounded-md px-4 py-2 border border-gray-600 hover:bg-gray-800'>Clear</button>
                )}
                <button onClick={loadTasks} disabled={loading || !status.trim()} className='rounded-md px-4 py-2 bg1 disabled:opacity-50'>{loading ? 'Loading...' : 'Load Tasks'}</button>
            </div>

            <div className='mt-5 overflow-x-auto'>
                {error ? (
                    <div className='rounded-lg bg2 p-8 text-center'>
                        <p className='text-red-400'>{error}</p>
                        {status.trim() && <button onClick={loadTasks} className='theme rounded-md px-4 py-2 mt-4'>Try again</button>}
                    </div>
                ) : visibleTasks.length === 0 ? (
                    <div className='rounded-lg bg2 p-8 text-center'>
                        <p className='font-semibold'>{loading ? 'Loading tasks...' : status ? 'No tasks returned for this status' : 'Enter a status to load tasks'}</p>
                        <p className='text2 mt-1'>{status ? 'Try another existing status type.' : 'The backend currently does not expose an all-status task-list endpoint.'}</p>
                    </div>
                ) : (
                    <Table title={`Tasks (${visibleTasks.length}${query.trim() ? ` of ${tasks.length}` : ''})`} headers={headers} rows={rows} />
                )}
            </div>
        </div>
    );
}

export default TaskList;
