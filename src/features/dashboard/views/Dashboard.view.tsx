import React from 'react';
import { User } from '@/core/data/auth/auth.types';
import { AnimatePresence, motion } from 'framer-motion';
import TripReservationDetails from '../components/TripReservationDetails';
import { TripReviewModal } from '@/features/messaging/components/TripReviewModal';

// Extracted Logic & Components
import { useDashboard } from '../logic/useDashboard.logic';
import { DashboardHeader } from '../components/DashboardHeader';
import { TravelerDashboard } from '../components/TravelerDashboard';

interface DashboardProps {
   user: User;
   onNavigateHome: () => void;
   onNavigateHelp: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateHome, onNavigateHelp }) => {
   const {
      myTrips,
      activeReservation,
      selectedTripDetail,
      setSelectedTripDetail,
      handleCompleteTrip,
      completingTripId,
      reviewModalData,
      setReviewModalData,
      showSuccessOverlay,
      pendingReviewTrips,
      reviewedTripIds,
      handleReviewTrip,
      handleReviewClose,
      handleReviewSubmitted
   } = useDashboard(user);

   // Extracted to Top-Level Scope so React doesn't unmount/remount it across branch changes
   const successOverlayNode = (
      <AnimatePresence>
         {showSuccessOverlay && (
            <motion.div
               key="success-overlay"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[999] bg-[#F8F9FB]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
               <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.5 } }}
                  className="w-28 h-28 bg-[#3667AA]/10 rounded-full flex items-center justify-center mb-8 relative"
               >
                  <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1.5, opacity: 0 }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="absolute inset-0 bg-[#3667AA]/20 rounded-full"
                  />
                  <i className="fas fa-check text-[#3667AA] text-5xl relative z-10"></i>
               </motion.div>
               <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                  className="text-3xl md:text-5xl font-display font-medium text-[#1C2230] mb-4"
               >
                  Tudo certo por aqui!
               </motion.h2>
               <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                  className="text-slate-500 max-w-sm text-lg md:text-xl"
               >
                  Viagem finalizada com sucesso. Esperamos que a sua experiência com a Cube tenha sido incrível.
               </motion.p>
            </motion.div>
         )}
      </AnimatePresence>
   );

   if (selectedTripDetail) {
      return (
         <>
            <TripReservationDetails
               trip={selectedTripDetail}
               onBack={() => setSelectedTripDetail(null)}
               onHelpClick={onNavigateHelp}
               onCompleteTrip={handleCompleteTrip}
               isCompleting={completingTripId === selectedTripDetail.id}
            />
            {reviewModalData.trip && (
               <TripReviewModal
                  isOpen={reviewModalData.isOpen}
                  onClose={handleReviewClose}
                  carId={reviewModalData.trip.carId || reviewModalData.trip.id}
                  bookingId={reviewModalData.trip.id}
                  carName={reviewModalData.trip.carName}
                  carImage={reviewModalData.trip.imageUrl}
                  onReviewSubmitted={handleReviewSubmitted}
               />
            )}
            {successOverlayNode}
         </>
      );
   }

   return (
       <div className="min-h-screen bg-transparent relative overflow-hidden">
          {/* Luzes ambiente para staging do Glassmorphism */}
          <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none z-0"></div>
          
          <div className="absolute top-10 right-[-10%] md:top-20 md:right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full pointer-events-none z-0"></div>
          <div className="absolute top-[300px] left-[-20%] md:left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-6 md:pt-12 pb-32">
            <DashboardHeader
               user={user}
            />

            <TravelerDashboard
               myTrips={myTrips}
               activeReservation={activeReservation}
               onNavigateHome={onNavigateHome}
               setSelectedTripDetail={setSelectedTripDetail}
               onCompleteTrip={handleCompleteTrip}
               completingTripId={completingTripId}
               pendingReviewTrips={pendingReviewTrips}
               reviewedTripIds={reviewedTripIds}
               onReviewTrip={handleReviewTrip}
            />

            {reviewModalData.trip && (
               <TripReviewModal
                  isOpen={reviewModalData.isOpen}
                  onClose={handleReviewClose}
                  carId={reviewModalData.trip.carId || reviewModalData.trip.id}
                  bookingId={reviewModalData.trip.id}
                  carName={reviewModalData.trip.carName}
                  carImage={reviewModalData.trip.imageUrl}
                  onReviewSubmitted={handleReviewSubmitted}
               />
            )}

            {successOverlayNode}
         </div>
      </div>
   );
};

export default Dashboard;