import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api, ApiError } from '../services/api.js';

function getAccount(employee) { return employee?.account || employee?.employee?.account || {}; }
function getAccountCode(employee) { return getAccount(employee)?.accountCode || ''; }
function getAccountName(employee) { const account = getAccount(employee); return account.accountName || account.accountID || account.email || account.accountCode || 'Unknown user'; }
function getAccountEmail(employee) { const account = getAccount(employee); return account.email || account.phoneNumber || ''; }
function toDateTime(value) { return value ? `${value}:00` : null; }

function CreateTask() {
    const navigate = useNavigate();
    const loggedUser = useSelector(state => state.loggedUser);
    const activeRole = useSelector(state => state.activeRole);
    const accountCode = loggedUser?.userInfo?.accountCode || '';
    const [organizations, setOrganizations] = useState([]);
    const [units, setUnits] = useState([]);
    const [unitEmployees, setUnitEmployees] = useState([]);
    const [organizationsLoading, setOrganizationsLoading] = useState(true);
    const [unitsLoading, setUnitsLoading] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', organizationCode: activeRole?.orgCode || '', unitCode: '', responsibleCode: '', relation: 'new', relatedTaskCode: '', startTime: '', endTime: '', deadline: '', workMinutes: '', priority: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

    const loadOrganizations = useCallback(async () => {
        if (!accountCode) { setOrganizations([]); setOrganizationsLoading(false); return; }
        setOrganizationsLoading(true);
        try { const result = await api.get(`/api/accounts/view/${encodeURIComponent(accountCode)}/orgs`); setOrganizations(Array.isArray(result) ? result : []); }
        catch (err) { setOrganizations([]); setError(err instanceof ApiError ? err.message : 'Unable to load your organizations.'); }
        finally { setOrganizationsLoading(false); }
    }, [accountCode]);

    const loadUnits = useCallback(async orgCode => {
        if (!orgCode) { setUnits([]); return; }
        setUnitsLoading(true);
        try { const result = await api.get(`/api/orgs/${encodeURIComponent(orgCode)}/units`); setUnits(Array.isArray(result) ? result : []); }
        catch (err) { setUnits([]); setError(err instanceof ApiError ? err.message : 'Unable to load organization units.'); }
        finally { setUnitsLoading(false); }
    }, []);

    const loadUnitEmployees = useCallback(async unitCode => {
        if (!unitCode) { setUnitEmployees([]); return; }
        setEmployeesLoading(true);
        try { const result = await api.get(`/api/units/${encodeURIComponent(unitCode)}/employments`); setUnitEmployees(Array.isArray(result) ? result : []); }
        catch (err) { setUnitEmployees([]); setError(err instanceof ApiError ? err.message : 'Unable to load employees for this unit.'); }
        finally { setEmployeesLoading(false); }
    }, []);

    useEffect(() => { loadOrganizations(); }, [loadOrganizations]);
    useEffect(() => { if (form.organizationCode) loadUnits(form.organizationCode); else setUnits([]); }, [form.organizationCode, loadUnits]);
    useEffect(() => { if (form.unitCode) loadUnitEmployees(form.unitCode); else setUnitEmployees([]); }, [form.unitCode, loadUnitEmployees]);
    useEffect(() => { if (activeRole?.orgCode && !form.organizationCode) update('organizationCode', activeRole.orgCode); }, [activeRole?.orgCode, form.organizationCode]);

    const employeeOptions = useMemo(() => {
        const seen = new Set();
        return unitEmployees.filter(employee => { const code = getAccountCode(employee); if (!code || seen.has(code)) return false; seen.add(code); return true; });
    }, [unitEmployees]);
    const ownerEmployment = useMemo(() => employeeOptions.find(employee => getAccountCode(employee) === accountCode) || null, [employeeOptions, accountCode]);
    const canSubmit = Boolean(form.title.trim() && form.organizationCode && form.unitCode && form.responsibleCode && ownerEmployment && !submitting);

    async function createTask(event) {
        event.preventDefault(); setError(''); setSuccess(false);
        if (!canSubmit) { setError('Please complete the task title, organization, unit, and responsible employee. You must also be a member of the selected unit because the backend requires the creator as owner.'); return; }
        if (form.relation === 'related' && !form.relatedTaskCode.trim()) { setError('Enter the previous task code when attaching this task to an existing task.'); return; }
        setSubmitting(true);
        try {
            const payload = {
                title: form.title.trim(), description: form.description.trim() || null,
                unit: { unitCode: form.unitCode },
                owner: { employee: { account: { accountCode } } },
                responsible: { employee: { account: { accountCode: form.responsibleCode } } },
                taskStatus: { taskStatusType: { type: 'created' } },
                startTime: toDateTime(form.startTime), endTime: toDateTime(form.endTime), deadline: toDateTime(form.deadline),
                workMinutes: form.workMinutes ? Number(form.workMinutes) : null, priority: form.priority.trim() || null,
            };
            if (form.relation === 'related') payload.taskPath = form.relatedTaskCode.trim();
            await api.post('/api/tasks/add', payload);
            setSuccess(true); setTimeout(() => navigate('/home/tasks'), 500);
        } catch (err) { setError(err instanceof ApiError ? err.message : 'Unable to create the task.'); }
        finally { setSubmitting(false); }
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-1">Create New Task</h2>
            <p className="text2">The owner is automatically you and the initial status is automatically <strong>created</strong>.</p>
            <form onSubmit={createTask} className="rounded-lg bg2 p-5 mt-5 space-y-5">
                {error && <div role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">{error}</div>}
                {success && <div role="status" className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-green-300">Task created successfully. Opening your tasks...</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field id="task-title" label="Task Name" value={form.title} onChange={value => update('title', value)} placeholder="Enter your task title" required />
                    <div className="flex flex-col items-start md:col-span-2"><label className="text3 font-medium mb-1 text-sm" htmlFor="task-description">Description</label><textarea id="task-description" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the task" rows={5} className="resize-y border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700" /></div>
                    <SelectField id="organization" label="Organization" value={form.organizationCode} onChange={value => { update('organizationCode', value); update('unitCode', ''); update('responsibleCode', ''); }} disabled={organizationsLoading} placeholder={organizationsLoading ? 'Loading organizations...' : 'Select an organization'} options={organizations.map(org => ({ value: org.orgCode, label: org.title || org.orgCode }))} required />
                    <SelectField id="unit" label="Unit" value={form.unitCode} onChange={value => { update('unitCode', value); update('responsibleCode', ''); }} disabled={!form.organizationCode || unitsLoading} placeholder={unitsLoading ? 'Loading units...' : form.organizationCode ? 'Select a unit' : 'Select an organization first'} options={units.map(unit => ({ value: unit.unitCode, label: unit.unitName || unit.name || unit.unitCode }))} required />
                    <EmployeeSelect id="responsible" label="Responsible" value={form.responsibleCode} onChange={value => update('responsibleCode', value)} employees={employeeOptions} disabled={!form.unitCode || employeesLoading} loading={employeesLoading} placeholder={form.unitCode ? 'Select the responsible employee' : 'Select a unit first'} required />
                    <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4"><p className="text-sm font-semibold">Owner</p><p className="text2 text-sm mt-1">{loggedUser?.userInfo?.accountName || loggedUser?.userInfo?.accountID || 'Current account'} — automatically assigned to you.</p>{form.unitCode && !employeesLoading && !ownerEmployment && <p className="text-amber-300 text-xs mt-2">You are not a member of this unit, so it cannot be used for a task you create.</p>}</div>
                    <div className="md:col-span-2 rounded-lg border border-gray-700 p-4"><p className="text-sm font-semibold mb-3">Task relation</p><div className="flex flex-wrap gap-4"><label className="flex items-center gap-2 text-sm"><input type="radio" name="relation" checked={form.relation === 'new'} onChange={() => update('relation', 'new')} /> New task</label><label className="flex items-center gap-2 text-sm"><input type="radio" name="relation" checked={form.relation === 'related'} onChange={() => update('relation', 'related')} /> Attach to a previous task</label></div>{form.relation === 'related' && <div className="mt-4"><Field id="related-task" label="Previous Task Code" value={form.relatedTaskCode} onChange={value => update('relatedTaskCode', value)} placeholder="e.g. Task_xxx" required /></div>}<p className="text2 text-xs mt-3">The backend represents task hierarchy through <code>taskPath</code>; the previous task code is used as the parent path.</p></div>
                    <Field id="priority" label="Priority" value={form.priority} onChange={value => update('priority', value)} placeholder="Optional" />
                    <Field id="work-minutes" label="Work Minutes" type="number" min="0" value={form.workMinutes} onChange={value => update('workMinutes', value)} placeholder="Optional" />
                    <Field id="start-time" label="Start Time" type="datetime-local" value={form.startTime} onChange={value => update('startTime', value)} />
                    <Field id="end-time" label="End Time" type="datetime-local" value={form.endTime} onChange={value => update('endTime', value)} />
                    <Field id="deadline" label="Deadline" type="datetime-local" value={form.deadline} onChange={value => update('deadline', value)} />
                </div>
                <div className="flex flex-wrap justify-end gap-3 pt-2"><button type="button" onClick={() => navigate('/home/tasks')} disabled={submitting} className="rounded-md px-4 py-2 bg1 disabled:opacity-50">Cancel</button><button type="submit" disabled={!canSubmit || employeeOptions.length === 0} className="rounded-md px-4 py-2 theme disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Creating...' : 'Create Task'}</button></div>
            </form>
        </div>
    );
}
function EmployeeSelect({ id, label, value, onChange, employees, disabled, loading, placeholder, required }) { return <div className="flex flex-col items-start"><label htmlFor={id} className="text3 font-medium mb-1 text-sm">{label}</label><select id={id} required={required} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="border border-gray-500 rounded-md p-2 w-full bg1 focus:outline-none focus:border-blue-700 disabled:opacity-60"><option value="">{loading ? 'Loading employees...' : placeholder}</option>{employees.map(employee => { const code = getAccountCode(employee); return <option key={code} value={code}>{getAccountName(employee)}{getAccountEmail(employee) ? ` — ${getAccountEmail(employee)}` : ''}</option>; })}</select></div>; }
function SelectField({ id, label, value, onChange, options, disabled, placeholder, required }) { return <div className="flex flex-col items-start"><label htmlFor={id} className="text3 font-medium mb-1 text-sm">{label}</label><select id={id} required={required} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="border border-gray-500 rounded-md p-2 w-full bg1 focus:outline-none focus:border-blue-700 disabled:opacity-60"><option value="">{placeholder}</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>; }
function Field({ id, label, value, onChange, type = 'text', placeholder = '', required = false, min }) { return <div className="flex flex-col items-start"><label htmlFor={id} className="text3 font-medium mb-1 text-sm">{label}</label><input id={id} type={type} min={min} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="border border-gray-500 rounded-md p-2 w-full bg1 focus:outline-none focus:border-blue-700" /></div>; }
export default CreateTask;
