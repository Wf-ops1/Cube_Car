import React, { useEffect } from 'react';
import { Car } from '@/core/data/car/car.types';
import { useReputationStore } from '@/features/reputation/stores/reputation.store';
import { ReputationService } from '@/core/data/reputation/reputation.service';
import { Spinner } from '@/shared/components/ui/Spinner';

interface ReviewsSectionProps {
    car: Car;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ car }) => {
    const { reviewsByCar, isLoadingCarReviews, fetchReviewsByCarId } = useReputationStore();

    useEffect(() => {
        if (car.id) {
            fetchReviewsByCarId(car.id);
        }
    }, [car.id, fetchReviewsByCarId]);

    const reviews = reviewsByCar[car.id] || [];
    const isLoading = isLoadingCarReviews[car.id];

    const reviewCount = reviews.length;
    const hasReviews = reviewCount > 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            {/* Header Area */}
            <div className="flex flex-row justify-between items-start mb-8 gap-4">
                {/* Title & Description */}
                <div>
                    <h3 className="text-2xl font-display font-bold text-[#1C2230] mb-2">Notas e avaliações</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">
                        {hasReviews ? 'Avaliações de quem já alugou este carro.' : 'Seja o primeiro a avaliar esta experiência.'}
                    </p>
                </div>

                {/* Big Score Block - Only show if has reviews */}
                {hasReviews && (
                    <div className="flex flex-col items-end shrink-0">
                        <span className="text-4xl sm:text-5xl font-display font-bold text-[#1C2230] leading-none">{car.rating || 5.0}</span>
                        <div className="flex gap-0.5 text-[#3667AA] text-[8px] sm:text-[10px] my-1">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star ${i < Math.round(car.rating || 5) ? '' : 'text-gray-300'}`}></i>
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{reviewCount} avaliações</span>
                    </div>
                )}
            </div>

            <div className="mb-12 pb-12 w-full">
                <div className="grid grid-cols-1 gap-4 px-1 w-full">
                    {[
                        { label: "Limpeza", score: ReputationService.calculateCriteriaScore(reviews, 'limpeza') * 20 },
                        { label: "Manutenção", score: ReputationService.calculateCriteriaScore(reviews, 'manutencao') * 20 },
                        { label: "Comunicação", score: ReputationService.calculateCriteriaScore(reviews, 'comunicacao') * 20 },
                        { label: "Precisão", score: ReputationService.calculateCriteriaScore(reviews, 'precisao') * 20 }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {/* Label (Left Aligned) */}
                            <div className="w-24 sm:w-28 shrink-0">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide truncate">{item.label}</span>
                            </div>

                            {/* Bar Track (Flexible) */}
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                {/* Bar Fill */}
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${hasReviews ? 'bg-[#3667AA]' : 'bg-transparent'}`}
                                    style={{ width: hasReviews ? `${item.score}%` : '0%' }}
                                ></div>
                            </div>

                            {/* Score (Right Aligned) */}
                            <div className="w-8 shrink-0 text-right">
                                <span className={`text-xs font-bold ${hasReviews ? 'text-[#1C2230]' : 'text-gray-400'}`}>
                                    {hasReviews ? (item.score / 20).toFixed(1) : '--'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {hasReviews ? (
                /* Reviews Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.slice(0, 4).map((review) => (
                        <div key={review.id} className="bg-transparent border-t border-gray-200 py-6">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={review.authorAvatar || "https://i.pravatar.cc/150"}
                                    className="w-10 h-10 rounded-full object-cover transition-all"
                                    alt={review.authorName || "Anônimo"}
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#1C2230]">{review.authorName || "Anônimo"}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <p className="text-base sm:text-lg font-light text-gray-600 leading-relaxed">"{review.body}"</p>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State Message - Only for the reviews list area */
                <div className="w-full py-8 border-t border-gray-100 flex flex-col items-center justify-center text-center opacity-100">
                    <p className="text-gray-500 font-medium italic max-w-sm mx-auto text-sm">
                        Este carro ainda não possui avaliações. Comece sua aventura e conte como foi!
                    </p>
                </div>
            )}
        </div>
    );
};
