import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {api, ApiError} from '../services/api.js';

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {dateStyle: 'medium', timeStyle: 'short'}).format(date);
}

function statusName(task) {
    return task?.taskStatus?.taskStatusType?.type || task?.taskStatus?.type || 'Unknown';
}

function historyStatusName(entry) {
    return entry?.taskStatusType?.type || entry?.taskStatus?.type || 'Unknown';
}

function personName(employment) {
    const account = employment?.employee?.account || employment?.account;
    return account ? ([account.firstName, account.lastName].filter(Boolean).join(' ') || account.accountName || account.accountID || '—') : '—';
}

function TaskDetails() {
    const {taskCode} = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [starting, setStarting] = useState(false);

    const loadTask = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setTask(await api.get(`/api/tasks/${encodeURIComponent(taskCode)}`));
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to load this task.');
        } finally {
            setLoading(false);
        }
    }, [taskCode]);

    useEffect(() => { loadTask(); }, [loadTask]);

    const statusHistory = useMemo(() => {
        if (!Array.isArray(task?.taskStatusHistory)) return [];
        return task.taskStatusHistory
            .filter(Boolean)
            .map((entry, index) => ({entry, index, time: entry?.time ? new Date(entry.time).getTime() : Number.NaN}))
            .sort((a, b) => {
                if (Number.isNaN(a.time) && Number.isNaN(b.time)) return a.index - b.index;
                if (Number.isNaN(a.time)) return 1;
                if (Number.isNaN(b.time)) return -1;
                return a.time - b.time;
            });
    }, [task]);

    async function startWorking() {
        setStarting(true);
        setError('');
        try {
            setTask(await api.post(`/api/tasks/start/${encodeURIComponent(taskCode)}`));
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to start the task.');
        } finally {
            setStarting(false);
        }
    }

    async function deleteTask() {
        if (!window.confirm('Delete this task? This action cannot be undone.')) return;
        setDeleting(true);
        setError('');
        try {
            await api.delete(`/api/tasks/delete/${encodeURIComponent(taskCode)}`);
            navigate('/home/tasks');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to delete this task.');
        } finally {
            setDeleting(false);
        }
    }

    if (loading) return <div className='rounded-lg bg2 p-8 text-center text2'>Loading task...</div>;
    if (error && !task) return <div className='rounded-lg bg2 p-8'><p className='text-red-400'>{error}</p><button onClick={loadTask} className='theme rounded-md px-4 py-2 mt-4'>Try again</button></div>;
    if (!task) return null;

    const currentStatus = statusName(task).toLowerCase();

    return (
        <div className='w-full space-y-5'>
            <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                <div>
                    <button onClick={() => navigate('/home/tasks')} className='text2 hover:text-white mb-3'>← Back to tasks</button>
                    <h2 className='text-2xl font-bold'>{task.title || 'Untitled task'}</h2>
                    <p className='text2 mt-1'>{task.taskCode}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {currentStatus === 'created' && <button onClick={startWorking} disabled={starting} className='rounded-md px-4 py-2 theme disabled:opacity-50'>{starting ? 'Starting...' : 'Start Working'}</button>}
                    <button onClick={() => navigate(`/home/tasks/${taskCode}/edit`)} className='rounded-md px-4 py-2 bg1'>Edit</button>
                    <button onClick={deleteTask} disabled={deleting} className='rounded-md px-4 py-2 bg-red-600/80 disabled:opacity-50'>{deleting ? 'Deleting...' : 'Delete'}</button>
                </div>
            </div>

            {error && <div role='alert' className='rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300'>{error}</div>}

            <section className='rounded-lg bg2 p-5'>
                <div className='flex flex-wrap gap-3 mb-5'>
                    <span className='rounded-full px-3 py-1 bg1 text-sm'>{statusName(task)}</span>
                    {task.priority && <span className='rounded-full px-3 py-1 bg1 text-sm'>{task.priority}</span>}
                </div>
                <h3 className='font-semibold text-lg mb-2'>Description</h3>
                <p className='text2 whitespace-pre-wrap'>{task.description || 'No description provided.'}</p>
            </section>

            <section className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <InfoCard title='Assignment'>
                    <Info label='Owner' value={personName(task.owner)} />
                    <Info label='Responsible' value={personName(task.responsible)} />
                    <Info label='Unit' value={task.unit?.unitName || task.unit?.unitCode || '—'} />
                </InfoCard>
                <InfoCard title='Schedule'>
                    <Info label='Start' value={formatDate(task.startTime)} />
                    <Info label='End' value={formatDate(task.endTime)} />
                    <Info label='Deadline' value={formatDate(task.deadline)} />
                    <Info label='Worked' value={task.workedMinutes != null ? `${task.workedMinutes} min` : task.workMinutes != null ? `${task.workMinutes} min planned` : '—'} />
                </InfoCard>
            </section>

            <section className='rounded-lg bg2 p-5'>
                <h3 className='font-semibold text-lg mb-4'>Task information</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Info label='Created' value={formatDate(task.createTime)} />
                    <Info label='Updated' value={formatDate(task.updateTime)} />
                    <Info label='Pinned' value={formatDate(task.pinDate)} />
                    <Info label='Task weight' value={task.taskWeight ?? '—'} />
                </div>
            </section>

            <section className='rounded-lg bg2 p-5'>
                <h3 className='font-semibold text-lg mb-4'>Status history</h3>
                {statusHistory.length === 0 ? (
                    <p className='text2'>No status history available.</p>
                ) : (
                    <ol className='relative ml-2 border-l border-white/10 pl-6 space-y-5'>
                        {statusHistory.map(({entry, index}) => (
                            <li key={`${entry?.taskCode || taskCode}-${entry?.time || 'unknown'}-${index}`} className='relative'>
                                <span aria-hidden='true' className='absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-current ring-4 ring-bg2' />
                                <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4'>
                                    <span className='font-medium break-words'>{historyStatusName(entry)}</span>
                                    <time className='text2 text-sm shrink-0' dateTime={entry?.time || undefined}>{formatDate(entry?.time)}</time>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </div>
    );
}

function InfoCard({title, children}) {
    return <section className='rounded-lg bg2 p-5'><h3 className='font-semibold text-lg mb-4'>{title}</h3><div className='space-y-3'>{children}</div></section>;
}

function Info({label, value}) {
    return <div className='flex flex-col'><span className='text2 text-sm'>{label}</span><span className='font-medium break-words'>{value}</span></div>;
}

export default TaskDetails;
