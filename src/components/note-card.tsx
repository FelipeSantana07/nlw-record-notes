import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'

interface NoteCardProps {
    note: {
        id: string
        date: Date
        content: string
    }
    onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="flex-col text-left rounded-md bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
                <span className='text-sm font-medium text-slate-200'>
                    {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                </span>
                <p className='text-sm leading-6 text-slate-400'>
                    {note.content}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-black/0 pointer-events-none"></div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/45' />
                <Dialog.Content className='outline-none inset-0 md:inset-auto overflow-hidden fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-200'>
                        <X className='size-5' />
                    </Dialog.Close>
                    <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span className='text-sm font-medium text-slate-200'>
                            {/* {note.date.toISOString()} */}
                            {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                        </span>
                        <p className='text-sm leading-6 text-slate-400'>
                            {note.content}
                        </p>
                    </div>

                    <button
                        onClick={() => onNoteDeleted(note.id)}
                        type='button'
                        className='group font-medium w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none'
                    >
                        Deseja <span className='group-hover:underline text-red-500'>apagar esta nota</span>
                    </button>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}