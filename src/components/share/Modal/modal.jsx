export const Modal = ({onClose, onShow = false, children}) => {
    return (
        <>
            {onShow && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative py-2 transform overflow-hidden rounded-lg bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl">
                            <button className={'absolute top-1 right-3 self-end text-gray-200'} onClick={onClose}>X</button>

                            <div className="bg-gray-700 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

        </>
    )
}