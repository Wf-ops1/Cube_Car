import React from 'react';

export const AmbientBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F8F9FB]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3667AA]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
    );
};
