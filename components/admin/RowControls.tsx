import Link from 'next/link';
import { deleteRow, moveRow, toggleVisible } from '@/app/admin/content-actions';
import { DeleteButton } from './DeleteButton';

type Props = {
  table: string;
  id: string;
  title: string;
  visible: boolean;
  editHref: string;
  isFirst: boolean;
  isLast: boolean;
};

const btn =
  'rounded-lg border border-border px-2.5 py-1.5 text-sm text-fg transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40';

/** Reorder, show/hide, edit and delete — shared by every content section. */
export function RowControls({ table, id, title, visible, editHref, isFirst, isLast }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <form action={moveRow}>
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button type="submit" disabled={isFirst} aria-label="Move up" className={btn}>
          ↑
        </button>
      </form>

      <form action={moveRow}>
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button type="submit" disabled={isLast} aria-label="Move down" className={btn}>
          ↓
        </button>
      </form>

      <form action={toggleVisible}>
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="next" value={String(!visible)} />
        <button type="submit" className={btn}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </form>

      <Link href={editHref} className={btn}>
        Edit
      </Link>

      <form action={deleteRow}>
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <DeleteButton title={title} />
      </form>
    </div>
  );
}
