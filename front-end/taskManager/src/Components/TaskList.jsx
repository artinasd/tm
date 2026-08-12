import {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import Table from './Costume UI Components/Table.jsx';
import {api, ApiError} from '../services/api.js';
import {useSelector} from 'react-redux';

const STATUS_OPTIONS = ['All', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

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

function TaskList() {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.loggedUser.userInfo);
    const accountCode = getAccountCode(userInfo);
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState('All');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTasks = useCallback(async () => {
        if (!accountCode) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/tasks/${encodeURIComponent(accountCode)}`, {
                headers: {'Accept': 'application/json'},
                ...(status !== 'All' ? {} : {}),
            });
            setTasks(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to load your tasks.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [accountCode, status]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const visibleTasks = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return tasks.filter(task => {
            const taskStatus = getStatus(task).toUpperCase();
            const matchesStatus = status === 'All' || taskStatus === status;
            const matchesQuery = !normalizedQuery || [task.title, task.description, task.priority, getPersonName(task.responsible), getPersonName(task.owner)]
                .filter(Boolean)
                .some(value => String(value).toLowerCase().includes(normalizedQuery));
            return matchesStatus && matchesQuery;
        });
    }, [query, status, tasks]);

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

    return (
        <div className='flex flex-col h-full w-full'>
            <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                <div>
                    <h2 className='text-2xl font-bold mb-1'>All Tasks</h2>
                    <p className='text2'>Here are all your available tasks.</p>
                </div>
                <button onClick={() => navigate('/home/new-task')} className='theme rounded-full px-4 py-2 hover:bg-[#4f46e5] self-start'>
                    + Add New Task
                </button>
            </div>

            <div className='rounded-lg bg2 p-4 mt-6 flex flex-col md:flex-row gap-3'>
                <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder='Search your tasks...'
                    aria-label='Search tasks'
                    className='border border-gray-600 rounded-md px-3 py-2 bg-transparent flex-1 focus:outline-none focus:border-indigo-500'
                />
                <select value={status} onChange={event => setStatus(event.target.value)} aria-label='Filter tasks by status' className='border border-gray-600 rounded-md px-3 py-2 bg-transparent'>
                    {STATUS_OPTIONS.map(option => <option key={option} value={option} className='bg-gray-900'>{option.replace('_', ' ')}</option>)}
                </select>
                <button onClick={loadTasks} disabled={loading} className='rounded-md px-4 py-2 bg1 disabled:opacity-50'>Refresh</button>
            </div>

            <div className='mt-5 overflow-x-auto'>
                {loading ? (
                    <div className='rounded-lg bg2 p-8 text-center text2'>Loading tasks...</div>
                ) : error ? (
                    <div className='rounded-lg bg2 p-8 text-center'>
                        <p className='text-red-400'>{error}</p>
                        <button onClick={loadTasks} className='theme rounded-md px-4 py-2 mt-4'>Try again</button>
                    </div>
                ) : visibleTasks.length === 0 ? (
                    <div className='rounded-lg bg2 p-8 text-center'>
                        <p className='font-semibold'>{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</p>
                        <p className='text2 mt-1'>{tasks.length === 0 ? 'Create your first task to get started.' : 'Try another search or status filter.'}</p>
                    </div>
                ) : (
                    <Table title={`Tasks (${visibleTasks.length})`} headers={headers} rows={rows} />
                )}
            </div>
        </div>
    );
}

export default TaskList;
