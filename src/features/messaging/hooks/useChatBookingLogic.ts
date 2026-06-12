import { Conversation } from '../types';
import { useBookingStore } from '@/features/booking/stores/booking.store';

// Helper to format raw YYYY-MM-DD into "DD MMM" (e.g. "10 Dez")
export const formatChatDate = (dateString?: string) => {
    if (!dateString) return '';
    // If it's already formatted or not YYYY-MM-DD, return as is
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString.split('T')[0])) return dateString;

    try {
        const [year, month, day] = dateString.split('T')[0].split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const formatted = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        // Capitalize first letter of month
        return formatted.replace(/ de /g, ' ').replace(/^(\d{2}) ([a-z])/, (match, d, m) => `${d} ${m.toUpperCase()}`).replace('.', '');
    } catch (e) {
        return dateString;
    }
};

interface UseChatBookingLogicProps {
    carRelated: NonNullable<Conversation['carRelated']>;
    isHost: boolean;
}

export const useChatBookingLogic = ({ carRelated, isHost }: UseChatBookingLogicProps) => {
    const { uiStatuses: statuses, setBookingUIStatus: setBookingStatus } = useBookingStore();

    // The shared unique identifier for the booking state
    // In our mocked environment, we try to use the bookingId from details, or fallback to the carId
    const bookingId = carRelated.bookingDetails ? ((carRelated.bookingDetails as any).bookingId || carRelated.id) : carRelated.id;

    // Determine initial status from the data structure, defaulting to pending if there's a booking
    const initialStatus = carRelated.bookingDetails ? ((carRelated.bookingDetails as any).status || 'pending') : null;

    // The current global status of this particular booking
    const currentStatus = statuses[bookingId] || initialStatus;

    const isAccepting = currentStatus === 'accepting';
    const isRejecting = currentStatus === 'rejecting';
    const isCanceling = currentStatus === 'rejecting'; // Using rejecting for cancel animations too

    const getStatusText = () => {
        if (!currentStatus) return '';
        switch (currentStatus) {
            case 'pending': return 'Aprovação Pendente';
            case 'confirmed': return 'Reserva Confirmada';
            case 'completed': return 'Viagem Concluída';
            case 'rejected': return 'Reserva Recusada';
            case 'cancelled': return 'Reserva Cancelada';
            default: return 'Desconhecido';
        }
    };

    const getStatusColorClass = () => {
        if (!currentStatus) return 'text-slate-500 bg-slate-500';
        switch (currentStatus) {
            case 'pending': return 'text-amber-500 bg-amber-500';
            case 'confirmed': return 'text-emerald-500 bg-emerald-500';
            case 'completed': return 'text-blue-500 bg-blue-500';
            case 'rejected': return 'text-slate-500 bg-slate-500';
            case 'cancelled': return 'text-rose-500 bg-rose-500';
            default: return 'text-slate-500 bg-slate-500';
        }
    };

    const handleAccept = async () => {
        setBookingStatus(bookingId, 'accepting');
        // Simulate API delay
        setTimeout(() => {
            setBookingStatus(bookingId, 'confirmed');
        }, 800);
    };

    const handleReject = async () => {
        setBookingStatus(bookingId, 'rejecting');
        setTimeout(() => {
            setBookingStatus(bookingId, 'rejected');
        }, 800);
    };

    const handleCancel = async () => {
        setBookingStatus(bookingId, 'rejecting'); // Shared animation state
        setTimeout(() => {
            setBookingStatus(bookingId, 'cancelled');
        }, 800);
    };

    return {
        localStatus: currentStatus, // Keep the same variable name for backwards compatibility in components
        isAccepting,
        isRejecting,
        isCanceling,
        getStatusText,
        getStatusColorClass,
        actions: {
            handleAccept,
            handleReject,
            handleCancel
        }
    };
};
