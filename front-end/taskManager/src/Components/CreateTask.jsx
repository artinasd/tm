import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api, ApiError } from '../services/api.js';

// Keep this isolated so it can be changed to the backend team's final route
// when the TaskStatusType read API is added.
const TASK_STATUS_TYPES_ENDPOINT = '/api/task-status-types';

function getAccount(employee) {
    return employee?.account || employee?.employee?.account || {};
}

function getAccountCode(employee) {
    return getAccount(employee)?.accountCode || '';
}

function getAccountName(employee) {
    const account = getAccount(employee);
    return account.accountName || account.username || account.email || account.accountCode || 'Unknown user';
}

function getAccountEmail(employee) {
    const account = getAccount(employee);
    return account.email || account.phoneNumber || '';
}

function toDateTime(value) {
    return value ? `${value}:00` : null;
}

function normalizeStatusTypes(data) {
    const values = Array.isArray(data) ? data : [];
    return values
        .map((item) => typeof item === 'string' ? item : item?.type || item?.statusType || item?.name)
        .filter(Boolean)
        .map(String);
}

function CreateTask() {
    const navigate = useNavigate();
    const loggedUser = useSelector(state => state.loggedUser);
    const accountCode = loggedUser?.userInfo?.accountCode || '';

    const [organizations, setOrganizations] = useState([]);
    const [units, setUnits] = useState([]);
    const [unitEmployees, setUnitEmployees] = useState([]);
    const [statusTypes, setStatusTypes] = useState([]);

    const [organizationsLoading, setOrganizationsLoading] = useState(true);
    const [unitsLoading, setUnitsLoading] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);
    const [statusUnavailable, setStatusUnavailable] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        organizationCode: '',
        unitCode: '',
        ownerCode: '',
        responsibleCode: '',
        startTime: '',
        endTime: '',
        deadline: '',
        workMinutes: '',
        priority: '',
        status: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

    const loadOrganizations = useCallback(async () => {
        if (!accountCode) {
            setOrganizations([]);
            setOrganizationsLoading(false);
            return;
        }

        setOrganizationsLoading(true);
        try {
            const result = await api.get(`/api/accounts/view/${encodeURIComponent(accountCode)}/orgs`);
            setOrganizations(Array.isArray(result) ? result : []);
        } catch (err) {
            setOrganizations([]);
            setError(err instanceof ApiError ? err.message : 'Unable to load your organizations.');
        } finally {
            setOrganizationsLoading(false);
        }
    }, [accountCode]);

    const loadUnits = useCallback(async (orgCode) => {
        if (!orgCode) {
            setUnits([]);
            return;
        }

        setUnitsLoading(true);
        setUnitEmployees([]);
        try {
            const result = await api.get(`/api/orgs/${encodeURIComponent(orgCode)}/units`);
            setUnits(Array.isArray(result) ? result : []);
        } catch (err) {
            setUnits([]);
            setError(err instanceof ApiError ? err.message : 'Unable to load organization units.');
        } finally {
            setUnitsLoading(false);
        }
    }, []);

    const loadUnitEmployees = useCallback(async (unitCode) => {
        if (!unitCode) {
            setUnitEmployees([]);
            return;
        }

        setEmployeesLoading(true);
        try {
            const result = await api.get(`/api/units/${encodeURIComponent(unitCode)}/employments`);
            setUnitEmployees(Array.isArray(result) ? result : []);
        } catch (err) {
            setUnitEmployees([]);
            setError(err instanceof ApiError ? err.message : 'Unable to load employees for this unit.');
        } finally {
            setEmployeesLoading(false);
        }
    }, []);

    const loadStatusTypes = useCallback(async () => {
        setStatusLoading(true);
        setStatusUnavailable(false);
        try {
            const result = await api.get(TASK_STATUS_TYPES_ENDPOINT);
            const normalized = normalizeStatusTypes(result);
            setStatusTypes(normalized);
            setStatusUnavailable(false);
            if (normalized.length === 0) setStatusUnavailable(true);
        } catch {
            // The backend currently does not expose a TaskStatusType read API.
            // Keep the UI ready for the eventual endpoint without inventing status values.
            setStatusTypes([]);
            setStatusUnavailable(true);
        } finally {
            setStatusLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrganizations();
        loadStatusTypes();
    }, [loadOrganizations, loadStatusTypes]);

    useEffect(() => {
        if (!form.organizationCode) {
            setUnits([]);
            return;
        }
        loadUnits(form.organizationCode);
    }, [form.organizationCode, loadUnits]);

    useEffect(() => {
        if (!form.unitCode) {
            setUnitEmployees([]);
            return;
        }
        loadUnitEmployees(form.unitCode);
    }, [form.unitCode, loadUnitEmployees]);

    const selectedUnit = useMemo(
        () => units.find(unit => unit.unitCode === form.unitCode) || null,
        [units, form.unitCode]
    );

    const employeeOptions = useMemo(() => {
        const seen = new Set();
        return unitEmployees.filter((employee) => {
            const code = getAccountCode(employee);
            if (!code || seen.has(code)) return false;
            seen.add(code);
            return true;
        });
    }, [unitEmployees]);

    const canSubmit = Boolean(
        form.title.trim() &&
        form.organizationCode &&
        form.unitCode &&
        form.ownerCode &&
        form.responsibleCode &&
        form.status &&
        !submitting &&
        !statusLoading &&
        !statusUnavailable
    );

    const createTask = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);

        if (statusUnavailable) {
            setError('Task status options are currently unavailable. The backend must expose the TaskStatusType list before a task can be created safely.');
            return;
        }

        if (!form.title.trim() || !form.organizationCode || !form.unitCode || !form.ownerCode || !form.responsibleCode || !form.status) {
            setError('Please complete the task title, organization, unit, owner, responsible employee, and status.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/api/tasks/add', {
                title: form.title.trim(),
                description: form.description.trim() || null,
                unit: { unitCode: form.unitCode },
                owner: { employee: { account: { accountCode: form.ownerCode } } },
                responsible: { employee: { account: { accountCode: form.responsibleCode } } },
                startTime: toDateTime(form.startTime),
                endTime: toDateTime(form.endTime),
                deadline: toDateTime(form.deadline),
                workMinutes: form.workMinutes ? Number(form.workMinutes) : null,
                priority: form.priority.trim() || null,
                taskStatus: { taskStatusType: { type: form.status } },
            });
            setSuccess(true);
            setTimeout(() => navigate('/home/tasks'), 500);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to create the task.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-1">Create New Task</h2>
            <p className="text2">Choose real organization members instead of typing internal IDs.</p>

            <form onSubmit={createTask} className="rounded-lg bg2 p-5 mt-5 space-y-5">
                {error && <div role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">{error}</div>}
                {success && <div role="status" className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-green-300">Task created successfully. Opening your tasks...</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field id="task-title" label="Task Name" value={form.title} onChange={value => update('title', value)} placeholder="Enter your task title" required />

                    <div className="flex flex-col items-start md:col-span-2">
                        <label className="text3 font-medium mb-1 text-sm" htmlFor="task-description">Description</label>
                        <textarea id="task-description" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the task" rows={5} className="resize-y border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700" />
                    </div>

                    <SelectField
                        id="organization"
                        label="Organization"
                        value={form.organizationCode}
                        onChange={(value) => {
                            setError('');
                            setUnits([]);
                            setUnitEmployees([]);
                            update('organizationCode', value);
                            update('unitCode', '');
                            update('ownerCode', '');
                            update('responsibleCode', '');
                        }}
                        disabled={organizationsLoading}
                        placeholder={organizationsLoading ? 'Loading organizations...' : 'Select an organization'}
                        options={organizations.map(org => ({ value: org.orgCode, label: org.title || org.orgCode }))}
                        required
                    />

                    <SelectField
                        id="unit"
                        label="Unit"
                        value={form.unitCode}
                        onChange={(value) => {
                            setError('');
                            update('unitCode', value);
                            update('ownerCode', '');
                            update('responsibleCode', '');
                        }}
                        disabled={!form.organizationCode || unitsLoading}
                        placeholder={unitsLoading ? 'Loading units...' : form.organizationCode ? 'Select a unit' : 'Select an organization first'}
                        options={units.map(unit => ({ value: unit.unitCode, label: unit.unitName || unit.name || unit.unitCode }))}
                        required
                    />

                    <EmployeeSelect
                        id="owner"
                        label="Owner"
                        value={form.ownerCode}
                        onChange={value => update('ownerCode', value)}
                        employees={employeeOptions}
                        disabled={!form.unitCode || employeesLoading}
                        loading={employeesLoading}
                        placeholder={employeesLoading ? 'Loading employees...' : form.unitCode ? 'Select the task owner' : 'Select a unit first'}
                        required
                    />

                    <EmployeeSelect
                        id="responsible"
                        label="Responsible"
                        value={form.responsibleCode}
                        onChange={value => update('responsibleCode', value)}
                        employees={employeeOptions}
                        disabled={!form.unitCode || employeesLoading}
                        loading={employeesLoading}
                        placeholder={employeesLoading ? 'Loading employees...' : form.unitCode ? 'Select the responsible employee' : 'Select a unit first'}
                        required
                    />

                    <SelectField
                        id="status"
                        label="Initial Status"
                        value={form.status}
                        onChange={value => update('status', value)}
                        disabled={statusLoading || statusUnavailable}
                        placeholder={statusLoading ? 'Loading statuses...' : statusUnavailable ? 'Waiting for backend status API' : 'Select a status'}
                        options={statusTypes.map(type => ({ value: type, label: type }))}
                        required
                    />

                    {statusUnavailable && (
                        <div className="md:col-span-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
                            Status selection is intentionally disabled until the backend exposes the available <strong>TaskStatusType</strong> values. This prevents the current null-status backend exception instead of asking you to type an internal status string.
                        </div>
                    )}

                    <Field id="priority" label="Priority" value={form.priority} onChange={value => update('priority', value)} placeholder="Optional" />
                    <Field id="work-minutes" label="Work Minutes" type="number" min="0" value={form.workMinutes} onChange={value => update('workMinutes', value)} placeholder="Optional" />
                    <Field id="start-time" label="Start Time" type="datetime-local" value={form.startTime} onChange={value => update('startTime', value)} />
                    <Field id="end-time" label="End Time" type="datetime-local" value={form.endTime} onChange={value => update('endTime', value)} />
                    <Field id="deadline" label="Deadline" type="datetime-local" value={form.deadline} onChange={value => update('deadline', value)} />
                </div>

                {selectedUnit && <p className="text2 text-xs">{selectedUnit.unitName || selectedUnit.name || selectedUnit.unitCode} · {employeeOptions.length} eligible employee{employeeOptions.length === 1 ? '' : 's'} available for this task.</p>}
                {form.unitCode && !employeesLoading && employeeOptions.length === 0 && <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">No employees are available in this unit. Owner and Responsible must be existing unit employees because the task API expects employment records.</div>}

                <div className="flex flex-wrap justify-end gap-3 pt-2">
                    <button type="button" onClick={() => navigate('/home/tasks')} disabled={submitting} className="rounded-md px-4 py-2 bg1 disabled:opacity-50">Cancel</button>
                    <button type="submit" disabled={!canSubmit || employeeOptions.length === 0} className="rounded-md px-4 py-2 theme disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Creating...' : 'Create Task'}</button>
                </div>
            </form>
        </div>
    );
}

function EmployeeSelect({ id, label, value, onChange, employees, disabled, loading, placeholder, required }) {
    return (
        <div className="flex flex-col items-start">
            <label htmlFor={id} className="text3 font-medium mb-1 text-sm">{label}</label>
            <select id={id} required={required} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="border border-gray-500 rounded-md p-2 w-full bg1 focus:outline-none focus:border-blue-700 disabled:opacity-60">
                <option value="">{loading ? 'Loading employees...' : placeholder}</option>
                {employees.map(employee => {
                    const code = getAccountCode(employee);
                    return <option key={code} value={code}>{getAccountName(employee)}{getAccountEmail(employee) ? ` — ${getAccountEmail(employee)}` : ''}</option>;
                })}
            </select>
        </div>
    );
}

function SelectField({ id, label, value, onChange, options, disabled, placeholder, required }) {
    return (
        <div className="flex flex-col items-start">
            <label htmlFor={id} className="text3 font-medium mb-1 text-sm">{label}</label>
            <select id={id} required={required} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="border border-gray-500 rounded-md p-2 w-full bg1 focus:outline-none focus:border-blue-700 disabled:opacity-60">
                <option value="">{placeholder}</option>
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </div>
    );
}

function Field({ id, label, value, onChange, type = 'text', placeholder = '', required = false, min }) {
    return (
        <div className="flex flex-col items-start">
            <label htmlFor={id} className="text3 font-medium mb-1 text-sm">{label}</label>
            <input id={id} type={type} min={min} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="border border-gray-500 rounded-md p-2 w-full bg-transparent focus:outline-none focus:border-blue-700" />
        </div>
    );
}

export default CreateTask;
