import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    function handleStartdShowOnboarding() {
        setShouldShowOnboarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault()

        if (content === ''){
            return
        }
        onNoteCreated(content)

        setContent('')
        setShouldShowOnboarding(true)

        if (content !== '') {
            toast.success('Nota criada com sucesso')
        }
    }



    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailabe = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    
        if (!isSpeechRecognitionAPIAvailabe){
            alert('Este navegador não suport a API para gravação, tente futuramente ou outro navegador')
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result)=>{
                return text.concat(result[0].transcript)
            },'')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)

        if (speechRecognition != null){
            speechRecognition.stop()
        }
    }


    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-700 p-5 space-y-3 outline:none hover:ring hover:ring-lime-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
                <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
                <p className='text-sm leading-6 text-slate-400'>Grave uma nota com audio</p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/45' />
                <Dialog.Content className='outline-none overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-200'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form className='flex flex-1 flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-200'>
                                adicionar nota
                            </span>

                            {shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400'>
                                    comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir pode <button onClick={handleStartdShowOnboarding} className='font-medium text-lime-400 hover:underline'> digitar</button>
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className='text-sm leading-6 bg-transparent resize-none flex-1 outline-none'
                                    onChange={handleContentChanged}
                                    value={content}
                                />
                            )}
                        </div>

                        {isRecording ? (
                            <button
                                type='button'
                                onClick={handleStopRecording}
                                className='bg-slate-900 flex items-center justify-center gap-2 font-medium w-full py-3 text-center text-slate-300 outline-none hover:bg-slate-950'
                            >
                                <div className='size-3 rounded-full bg-red-500 pulse ' />
                                Gravando! Clique para finalizar
                            </button>
                        ) : (
                            <button
                                type='button'
                                onClick={handleSaveNote}
                                className='hover:bg-lime-500 bg-lime-400 font-medium w-full py-3 text-center text-lime-950 outline-none'
                            >
                                Salvar nota
                            </button>
                        )}
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}