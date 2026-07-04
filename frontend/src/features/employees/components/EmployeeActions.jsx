import { Edit3, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem } from '../../../components/ui/Dropdown';

export function EmployeeActions({ employee, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <Dropdown
      trigger={<button type="button" className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label={`Actions for ${employee.name}`}><MoreHorizontal className="size-5" /></button>}
    >
      <DropdownItem icon={Eye} onClick={() => navigate(`/employees/${employee.id}`)}>View profile</DropdownItem>
      <DropdownItem icon={Edit3} onClick={() => onEdit(employee)}>Edit employee</DropdownItem>
      <DropdownItem icon={Trash2} onClick={() => onDelete(employee)} danger>Delete employee</DropdownItem>
    </Dropdown>
  );
}
