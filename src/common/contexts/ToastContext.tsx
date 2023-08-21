import React, { createContext, ReactNode, useState } from 'react'
import { Snackbar } from 'react-native-paper'

export type Toast = {
	message: string | null
	open: boolean
	options?: ToastOptions
}

export type ToastOptions = {
	dismissDuration?: number
}

export type ToastDefault = {
	toast: Toast
	invokeToast: (message: string, options?: ToastOptions) => void
}

export const ToastContext = createContext<ToastDefault>({
	toast: { message: '', open: false },
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	invokeToast: () => {}
})

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const defaultOptions: ToastOptions = { dismissDuration: 500 }
	const [toast, setSnack] = useState<Toast>({ message: '', open: false })

	function invokeToast(msg = '', options = {}) {
		setSnack({ message: msg, open: true, options: options })
	}
	function onDismiss() {
		setSnack({ message: null, open: false })
	}

	return (
		<ToastContext.Provider value={{ toast, invokeToast }}>
			{children}

			<Snackbar
				visible={toast.open}
				onDismiss={onDismiss}
				duration={toast.options?.dismissDuration || defaultOptions.dismissDuration}
			>
				{toast.message}
			</Snackbar>
		</ToastContext.Provider>
	)
}
