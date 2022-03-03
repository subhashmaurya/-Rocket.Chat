import { useCallback } from 'react';

import { useUpload } from '../contexts/ServerContext';
import { useToastMessageDispatch } from '../contexts/ToastMessagesContext';

export const useEndpointUpload = (
	endpoint: string,
	params = {},
	successMessage: string,
): ((...args: any[]) => Promise<void | { success: boolean }>) => {
	const sendData = useUpload(endpoint);
	const dispatchToastMessage = useToastMessageDispatch();

	return useCallback(
		async (...args) => {
			try {
				let data = sendData(params, [...args]);
				const promise = data instanceof Promise ? data : (data as any).promise;

				data = await promise;

				if (!(data as any).success) {
					throw new Error((data as any).status);
				}

				successMessage && dispatchToastMessage({ type: 'success', message: successMessage });

				return data;
			} catch (error) {
				dispatchToastMessage({ type: 'error', message: String(error) });
				return { success: false };
			}
		},
		[dispatchToastMessage, params, sendData, successMessage],
	);
};