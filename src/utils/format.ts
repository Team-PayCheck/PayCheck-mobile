export const formatCurrency = (amount: number): string => {
	return amount.toLocaleString();
};

export const formatDate = (workDate: string): string => {
	const date = new Date(workDate);
	return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const formatTime = (time: string): string => time.slice(0, 5);
