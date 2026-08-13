import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {api, ApiError} from '../services/api.js';

function getAccountCode(userInfo) {
    return userInfo?.accountCode || userInfo?.accountID || userInfo?.account?.accountCode || userInfo?.account?.accountID || '';
}

function toDateTime(value) {
    return value ? `${value}:00` : null;
}

function CreateTask() {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.loggedUser.userInfo);
    const defaultAccountCode = getAccountCode(userInfo);
    const [form, setForm] = useState({title: '', description: '', unitCode: '', ownerCode: defaultAccountCode, responsibleCode: defaultAccountCode, startTime: '', endTime: '', deadline: '', workMinutes: '', priority: '', status: ''});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const update = (field, value) => setForm(current => ({...current, [field]: value}));

    async function createTask(event) {
        event.preventDefault();
        setError('');
        setSuccess(false);
        if (!form.title.trim() || !form.unitCode.trim() || !form.ownerCode.trim() || !form.responsibleCode.trim() || !form.status.trim()) {
            setError('Title, unit code, owner code, responsible code, and status are required by the task API.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/api/tasks/add', {
                title: form.title.trim(),
                description: form.description.trim() || null,
                unit: {unitCode: form.unitCode.trim()},
                owner: {employee: {account: {accountCode: form.ownerCode.trim()}}},
                responsible: {employee: {account: {accountCode: form.responsibleCode.trim()}}},
                startTime: toDateTime(form.startTime),
                endTime: toDateTime(form.endTime),
                deadline: toDateTime(form.deadline),
                workMinutes: form.workMinutes ? Number(form.workMinutes) : null,
                priority: form.priority.trim() || null,
                taskStatus: {taskStatusType: {type: form.status.trim()}},
            });
            setSuccess(true);
            setTimeout(() => navigate('/home/tasks'), 500);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to create the task.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className='w-full'>
            <h2 className='text-2xl font-bold mb-1'>Create New Task</h2>
            <p className='text2'>Add and set up a new task using the task service.</p>
            <form onSubmit={createTask} className='rounded-lg bg2 p-5 mt-5 space-y-5'>
                {error && <div role='alert' className='rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300'>{error}</div>}
                {success && <div role='status' className='rounded-md border border-green-500/40 bg-green-500/10 p-3 text-green-300'>Task created successfully. Opening your tasks...</div>}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <Field id='task-title' label='Task Name' value={form.title} onChange={value => update('title', value)} placeholder='Enter your task title' required />
                    <div className='flex flex-col items-start md:col-span-2'>
                        <label className='text3 font-medium mb-1 text-sm' htmlFor='task-description'>Description</label>
                        <textarea id='task-description' value={form.description} onChange={e => update('description', e.target.value)} placeholder='Describe the task' rows={5} className='resize-y border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700' />
                    </div>
                    <Field id='unit-code' label='Unit Code' value={form.unitCode} onChange={value => update('unitCode', value)} placeholder='Unit_...' required />
                    <Field id='owner-code' label='Owner Account Code' value={form.ownerCode} onChange={value => update('ownerCode', value)} placeholder='Account_...' required />
                    <Field id='responsible-code' label='Responsible Account Code' value={form.responsibleCode} onChange={value => update('responsibleCode', value)} placeholder='Account_...' required />
                    <Field id='status' label='Initial Status Type' value={form.status} onChange={value => update('status', value)} placeholder='Use an existing status type' required />
                    <Field id='priority' label='Priority' value={form.priority} onChange={value => update('priority', value)} placeholder='Optional' />
                    <Field id='work-minutes' label='Work Minutes' type='number' min='0' value={form.workMinutes} onChange={value => update('workMinutes', value)} placeholder='Optional' />
                    <Field id='start-time' label='Start Time' type='datetime-local' value={form.startTime} onChange={value => update('startTime', value)} />
                    <Field id='end-time' label='End Time' type='datetime-local' value={form.endTime} onChange={value => update('endTime', value)} />
                    <Field id='deadline' label='Deadline' type='datetime-local' value={form.deadline} onChange={value => update('deadline', value)} />
                </div>
                <div className='flex flex-wrap justify-end gap-3 pt-2'>
                    <button type='button' onClick={() => navigate('/home/tasks')} disabled={submitting} className='rounded-md px-4 py-2 bg1 disabled:opacity-50'>Cancel</button>
                    <button type='submit' disabled={submitting} className='rounded-md px-4 py-2 theme disabled:opacity-50'>{submitting ? 'Creating...' : 'Create Task'}</button>
                </div>
            </form>
        </div>
    );
}

function Field({id, label, value, onChange, type = 'text', placeholder = '', required = false, min}) {
    return (
        <div className='flex flex-col items-start'>
            <label htmlFor={id} className='text3 font-medium mb-1 text-sm'>{label}</label>
            <input id={id} type={type} min={min} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className='border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700' />
        </div>
    );
}

export default CreateTask;
