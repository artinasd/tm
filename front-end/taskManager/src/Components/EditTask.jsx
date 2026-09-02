import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {api, ApiError} from '../services/api.js';

function toDateTime(value) { return value ? `${value}:00` : null; }
function toInput(value) { return value ? String(value).slice(0, 16) : ''; }
function getStatus(task) { return task?.taskStatus?.taskStatusType?.type || ''; }

function EditTask() {
    const {taskCode} = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({title: '', description: '', startTime: '', endTime: '', deadline: '', workMinutes: '', priority: '', status: ''});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        api.get(`/api/tasks/${encodeURIComponent(taskCode)}`)
            .then(task => {
                if (!active) return;
                setForm({title: task?.title || '', description: task?.description || '', startTime: toInput(task?.startTime), endTime: toInput(task?.endTime), deadline: toInput(task?.deadline), workMinutes: task?.workedMinutes ?? task?.workMinutes ?? '', priority: task?.priority || '', status: getStatus(task)});
            })
            .catch(err => setError(err instanceof ApiError ? err.message : 'Unable to load this task.'))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [taskCode]);

    const update = (field, value) => setForm(current => ({...current, [field]: value}));

    async function save(event) {
        event.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.patch(`/api/tasks/edit/${encodeURIComponent(taskCode)}`, {
                title: form.title.trim(),
                description: form.description.trim(),
                startTime: toDateTime(form.startTime),
                endTime: toDateTime(form.endTime),
                deadline: toDateTime(form.deadline),
                workMinutes: form.workMinutes === '' ? null : Number(form.workMinutes),
                priority: form.priority.trim() || null,
            });
            navigate(`/home/tasks/${taskCode}`);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to save this task.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className='rounded-lg bg2 p-8 text-center text2'>Loading task...</div>;

    return (
        <div className='w-full'>
            <button onClick={() => navigate(`/home/tasks/${taskCode}`)} className='text2 hover:text-white mb-3'>← Back to task</button>
            <h2 className='text-2xl font-bold'>Edit Task</h2>
            <p className='text2 mt-1'>{taskCode}</p>
            <p className='text2 mt-1'>Status is automatic: new tasks are <strong>created</strong> until someone starts working on them.</p>
            <form onSubmit={save} className='rounded-lg bg2 p-5 mt-5 space-y-5'>
                {error && <div role='alert' className='rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300'>{error}</div>}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <Field label='Task Name' value={form.title} onChange={v => update('title', v)} required />
                    <Field label='Priority' value={form.priority} onChange={v => update('priority', v)} />
                    <div className='md:col-span-2 flex flex-col items-start'>
                        <label className='text3 font-medium mb-1 text-sm' htmlFor='edit-description'>Description</label>
                        <textarea id='edit-description' rows='5' value={form.description} onChange={e => update('description', e.target.value)} className='resize-y border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700' />
                    </div>
                    <Field label='Work Minutes' type='number' min='0' value={form.workMinutes} onChange={v => update('workMinutes', v)} />
                    <Field label='Start Time' type='datetime-local' value={form.startTime} onChange={v => update('startTime', v)} />
                    <Field label='End Time' type='datetime-local' value={form.endTime} onChange={v => update('endTime', v)} />
                    <Field label='Deadline' type='datetime-local' value={form.deadline} onChange={v => update('deadline', v)} />
                </div>
                <div className='flex justify-end gap-3'>
                    <button type='button' onClick={() => navigate(`/home/tasks/${taskCode}`)} disabled={saving} className='rounded-md px-4 py-2 bg1'>Cancel</button>
                    <button type='submit' disabled={saving} className='rounded-md px-4 py-2 theme'>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </div>
    );
}

function Field({label, value, onChange, type = 'text', min, required = false}) {
    return <div className='flex flex-col items-start'><label className='text3 font-medium mb-1 text-sm'>{label}</label><input required={required} type={type} min={min} value={value} onChange={e => onChange(e.target.value)} className='border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700' /></div>;
}

export default EditTask;
