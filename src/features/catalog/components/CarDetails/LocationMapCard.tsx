import React from 'react';

interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationMapCardProps {
    location: string;
    neighborhood?: string;
    coordinates?: Coordinates;
    isGuest?: boolean;
    availabilityHours?: {
        start: string;
        end: string;
    };
}

export const LocationMapCard: React.FC<LocationMapCardProps> = ({
    location,
    neighborhood,
    coordinates,
    isGuest = false,
    availabilityHours
}) => {
    // Inject neighborhood for higher map precision 
    const locationQuery = neighborhood ? `${neighborhood}, ${location}` : location;
    const hours = availabilityHours || { start: "08:00", end: "18:00" };

    return (
        <div className="space-y-8">
            {/* Context Header */}
            <div>
                <h3 className="text-2xl font-display font-bold text-[#1C2230] mb-6">Retirada e Devolução</h3>
                <div className="flex items-start gap-4 px-1">
                    <div className="mt-1">
                        <i className="fas fa-map-marker-alt text-red-500 text-xl"></i>
                    </div>
                    <div>
                        {neighborhood ? (
                            <p className="text-base font-medium text-slate-800">{neighborhood} <span className="text-gray-400 font-light">, {location}</span></p>
                        ) : (
                            <p className="text-base font-medium text-slate-800">{location.split(',')[0]} <span className="text-gray-400 font-light">, {location.split(',').slice(1).join(',').trim() || 'BR'}</span></p>
                        )}
                        <p className="text-sm text-gray-500 mt-0.5">O endereço exato é enviado após a reserva.</p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
                    <div className="relative w-full h-full">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=m&z=14&output=embed&iwloc=n`}
                            title="Car Location"
                            className="w-full h-full opacity-100"
                        ></iframe>

                        {/* Map Iframe Only - No Overlay */}
                        <div className="absolute top-4 left-4">
                            {/* Top left empty or other controls if needed */}
                        </div>
                    </div>

                {/* Internal Badge - Changed to Approximate Location */}

            </div>

            {/* Hours Data - Editorial Design Match */}
            <div className="border-t border-gray-100 pt-8 mt-2">
                <div className="grid grid-cols-2 w-full max-w-lg mx-auto">
                    {/* Pickup */}
                    <div className="text-center border-r border-gray-200 px-4">
                        <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 whitespace-nowrap">Retirada a partir de</p>
                        <p className="text-xl sm:text-3xl font-display font-bold text-slate-900">{hours.start}</p>
                    </div>

                    {/* Return */}
                    <div className="text-center px-4">
                        <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 whitespace-nowrap">Devolução até</p>
                        <p className="text-xl sm:text-3xl font-display font-bold text-slate-900">{hours.end}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
