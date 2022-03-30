import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { useEffect, useState } from "react";

export function useTimeAgo(compareDate: Date) {
	const [timeAgo, setTimeAgo] = useState(() => {
		return getTimeAgoFromNow(compareDate);
	});
	
	function getTimeAgoFromNow(date: Date) {
		return formatDistance(date, new Date(), {
			locale: ptBR,
			addSufix: true
		});
	}

	useEffect(() => {
		function refreshTimeAgo() {
			setTimeAgo(getTimeAgoFromNow(compareDate));
		}
		
		window.addEventListener("focus", refreshTimeAgo);
		
		return () => {
			window.removeEventListener("focus", refreshTimeAgo);
		};
	}, [compareDate]);

	return timeAgo;
}
