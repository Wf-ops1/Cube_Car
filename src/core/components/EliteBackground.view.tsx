import React from 'react';

const EliteBackground: React.FC = React.memo(() => {
    return (
        <div
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#F8F9FB]"
        >
        </div>
    );
});

EliteBackground.displayName = 'EliteBackground';

export default EliteBackground;
